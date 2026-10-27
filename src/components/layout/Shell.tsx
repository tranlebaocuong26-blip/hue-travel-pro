"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdaptiveNavigation from "@/components/navigation/AdaptiveNavigation";
import { useTransition } from "@/context/TransitionContext";

interface ShellProps {
  children: React.ReactNode;
}

export default function Shell({ children }: ShellProps) {
  const pathname = usePathname();
  const { targetHref } = useTransition();

  // Effective visual mode: based on active target destination if navigating, or current pathname
  const effectivePath = targetHref ?? pathname;
  const isSidebarVisual = effectivePath !== "/";

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ease-out relative ${
        isSidebarVisual
          ? "bg-[#F7F7FA] text-dark-ink"
          : "bg-[#8774CE] bg-[linear-gradient(115deg,#8774CE_0%,#B490C0_45%,#F5AF96_100%)] text-white p-2 sm:p-3 md:px-4 md:pb-4 md:pt-2 lg:px-6 lg:py-4 2xl:px-8 2xl:py-5 3xl:px-12 3xl:py-6"
      }`}
    >
      {/* Persistent Shared Adaptive Navigation */}
      <AdaptiveNavigation />

      {/* Main Content Shell with Hardware Compositing (no continuous layout reflow) */}
      <div
        className={`flex-1 flex flex-col min-w-0 relative z-10 ${
          isSidebarVisual ? "md:pl-64" : "md:pl-0"
        }`}
      >
        <main
          className={`flex-1 w-full mx-auto box-border min-w-0 transition-opacity duration-200 ease-out ${
            isSidebarVisual
              ? "p-3.5 sm:p-6 lg:p-8 max-w-7xl pb-28 md:pb-8"
              : "p-0 flex flex-col justify-center items-center h-full"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
