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

  // Keep track of current path
  useEffect(() => {
    currentPathRef.current = pathname;
  }, [pathname]);

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

        // Immediately push route so destination page renders concurrently without blank screen
        router.push(href);

        // Morph runs 350ms, settles completely at 550ms
        setTimeout(() => {
          setPhase("IDLE");
          setTargetHref(null);
          isNavigatingRef.current = false;
        }, 550);
      } else if (!isCurrentLanding && isTargetLanding) {
        // Subpage -> Landing (Sidebar-to-Hero Reverse Morph)
        setPhase("SUBPAGE_TO_LANDING");

        // Immediately push route so landing hero renders concurrently without blank screen
        router.push(href);

        // Reverse morph settles at 550ms
        setTimeout(() => {
          setPhase("IDLE");
          setTargetHref(null);
          isNavigatingRef.current = false;
        }, 550);
      } else {
        // Subpage -> Subpage (Stationary Sidebar, Subtle Content Crossfade)
        setPhase("SUBPAGE_TO_SUBPAGE");

        router.push(href);

        setTimeout(() => {
          setPhase("IDLE");
          setTargetHref(null);
          isNavigatingRef.current = false;
        }, 320);
      }
    },
    [prefersReducedMotion, router]
  );

  return (
    <TransitionContext.Provider
      value={{
        phase,
        isTransitioning: phase !== "IDLE",
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
