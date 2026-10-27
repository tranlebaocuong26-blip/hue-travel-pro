"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { usePathname, useRouter } from "next/navigation";

export type TransitionPhase =
  | "IDLE"
  | "LANDING_TO_SUBPAGE"
  | "SUBPAGE_TO_LANDING"
  | "SUBPAGE_TO_SUBPAGE";

interface TransitionContextType {
  phase: TransitionPhase;
  isTransitioning: boolean;
  targetHref: string | null;
  navigate: (href: string) => void;
  prefersReducedMotion: boolean;
}

const TransitionContext = createContext<TransitionContextType>({
  phase: "IDLE",
  isTransitioning: false,
  targetHref: null,
  navigate: () => {},
  prefersReducedMotion: false,
});

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [phase, setPhase] = useState<TransitionPhase>("IDLE");
  const [targetHref, setTargetHref] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const isNavigatingRef = useRef(false);
  const currentPathRef = useRef(pathname);

  // Prefetch all main routes into memory on client mount for instant (<50ms) page switches
  useEffect(() => {
    const mainRoutes = ["/", "/ve-hue", "/kham-pha", "/an-uong", "/cam-nang", "/luu-tru"];
    mainRoutes.forEach((route) => {
      try {
        router.prefetch(route);
      } catch {}
    });
  }, [router]);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Listen for browser Back / Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      setPhase("IDLE");
      setTargetHref(null);
      isNavigatingRef.current = false;
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Lifecycle-driven transition settlement:
  // Only settle to IDLE once pathname has ACTUALLY reached targetHref!
  useEffect(() => {
    currentPathRef.current = pathname;

    if (
      targetHref &&
      (pathname === targetHref || (targetHref !== "/" && pathname.startsWith(targetHref)))
    ) {
      // The destination page has mounted! Allow 350ms CSS morph animation to complete smoothly
      const timer = setTimeout(() => {
        setPhase("IDLE");
        setTargetHref(null);
        isNavigatingRef.current = false;
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [pathname, targetHref]);

  // Safety watchdog: if route navigation takes unusually long or fails, release lock after 6s
  useEffect(() => {
    if (!targetHref) return;
    const watchdog = setTimeout(() => {
      setPhase("IDLE");
      setTargetHref(null);
      isNavigatingRef.current = false;
    }, 6000);
    return () => clearTimeout(watchdog);
  }, [targetHref]);

  const navigate = useCallback(
    (href: string) => {
      const current = currentPathRef.current;
      // If clicking current route, ignore
      if (current === href) return;

      // Prevent overlapping navigations if user clicks rapidly
      if (isNavigatingRef.current) return;

      // If user prefers reduced motion, navigate immediately without animation
      if (prefersReducedMotion) {
        router.push(href);
        return;
      }

      isNavigatingRef.current = true;
      setTargetHref(href);

      const isCurrentLanding = current === "/";
      const isTargetLanding = href === "/";

      if (isCurrentLanding && !isTargetLanding) {
        // Landing -> Subpage (Hero-to-Sidebar Morph)
        setPhase("LANDING_TO_SUBPAGE");
      } else if (!isCurrentLanding && isTargetLanding) {
        // Subpage -> Landing (Sidebar-to-Hero Reverse Morph)
        setPhase("SUBPAGE_TO_LANDING");
      } else {
        // Subpage -> Subpage
        setPhase("SUBPAGE_TO_SUBPAGE");
      }

      // Immediately push route so destination page loads concurrently
      router.push(href);
    },
    [prefersReducedMotion, router]
  );

  return (
    <TransitionContext.Provider
      value={{
        phase,
        isTransitioning: phase !== "IDLE" || targetHref !== null,
        targetHref,
        navigate,
        prefersReducedMotion,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  return useContext(TransitionContext);
}
