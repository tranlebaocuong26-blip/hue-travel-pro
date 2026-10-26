"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTransition } from "@/context/TransitionContext";
import { MAIN_NAV_ITEMS } from "@/types/navigation";
import {
  Home,
  Landmark,
  Compass,
  BookOpen,
  Building2,
  Settings,
  Search,
  Menu,
  X,
} from "lucide-react";

const navIcons: Record<string, React.ReactNode> = {
  "trang-chu": <Home className="w-5 h-5 shrink-0" />,
  "ve-hue": <Landmark className="w-5 h-5 shrink-0" />,
  "kham-pha": <Compass className="w-5 h-5 shrink-0" />,
  "cam-nang": <BookOpen className="w-5 h-5 shrink-0" />,
  "luu-tru": <Building2 className="w-5 h-5 shrink-0" />,
};

const activeColorMap: Record<string, string> = {
  "trang-chu": "bg-deep-violet text-white shadow-sm",
  "ve-hue": "bg-[#F2C675] text-dark-ink font-semibold shadow-sm",
  "kham-pha": "bg-soft-purple text-white shadow-sm",
  "cam-nang": "bg-[#F2994A] text-white shadow-sm",
  "luu-tru": "bg-[#E6D5B8] text-dark-ink font-semibold shadow-sm",
};

const navigationLabels: Record<string, string> = {
  "ve-hue": "Lịch sử",
  "cam-nang": "Di chuyển",
};

const displayNavItems = MAIN_NAV_ITEMS.map((item) => ({
  ...item,
  label: navigationLabels[item.id] ?? item.label,
}));

export default function AdaptiveNavigation() {
  const pathname = usePathname();
  const { phase, isTransitioning, targetHref, navigate, prefersReducedMotion } =
    useTransition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCurrentLanding = pathname === "/";
  // The visual state of the navigation: Sidebar vs Capsule
  const isSidebarVisual =
    phase === "LANDING_TO_SUBPAGE" ||
    (!isCurrentLanding && phase !== "SUBPAGE_TO_LANDING");

  // Effective active path (updates immediately to targetHref during transition for responsive feedback)
  const activePath = isTransitioning && targetHref ? targetHref : pathname;

  const handleItemClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate(href);
  };

  return (
    <>
      {/* =========================================================================
          DESKTOP UNIFIED ADAPTIVE NAVIGATION CONTAINER
          Continuous morph between:
          - State A (Capsule): top: 16px, left: calc(50% - 265px), w: 530px, h: 52px, rx: 9999px
          - State B (Sidebar): top: 0px, left: 0px, w: 256px, h: 100vh, rx: 0px
         ========================================================================= */}
      <div
        id="desktop-adaptive-nav"
        data-morph-state={isSidebarVisual ? "sidebar" : "capsule"}
        aria-label="Thanh điều hướng thích nghi"
        className="font-ui hidden md:block fixed z-50 overflow-hidden box-border pointer-events-auto"
        style={{
          top: isSidebarVisual ? "0px" : "16px",
          left: isSidebarVisual ? "0px" : "calc(50% - 265px)",
          width: isSidebarVisual ? "256px" : "530px",
          height: isSidebarVisual ? "100vh" : "52px",
          borderRadius: isSidebarVisual ? "0px" : "9999px",
          backgroundColor: isSidebarVisual
            ? "rgba(255, 255, 255, 1)"
            : "rgba(37, 28, 57, 0.75)",
          backdropFilter: isSidebarVisual ? "none" : "blur(20px)",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: isSidebarVisual
            ? "rgba(243, 244, 246, 1)"
            : "rgba(255, 255, 255, 0.22)",
          boxShadow: isSidebarVisual
            ? "0 4px 20px -2px rgba(0, 0, 0, 0.05)"
            : "0 20px 30px -10px rgba(0, 0, 0, 0.4)",
          transition: prefersReducedMotion
            ? "none"
            : [
                "top 350ms cubic-bezier(0.25, 1, 0.5, 1)",
                "left 350ms cubic-bezier(0.25, 1, 0.5, 1)",
                "width 350ms cubic-bezier(0.25, 1, 0.5, 1)",
                "height 350ms cubic-bezier(0.25, 1, 0.5, 1)",
                "border-radius 350ms cubic-bezier(0.25, 1, 0.5, 1)",
                "background-color 350ms cubic-bezier(0.25, 1, 0.5, 1)",
                "border-color 350ms cubic-bezier(0.25, 1, 0.5, 1)",
                "box-shadow 350ms cubic-bezier(0.25, 1, 0.5, 1)",
              ].join(", "),
          willChange: "top, left, width, height, border-radius, background-color",
        }}
      >
        {/* =====================================================================
            LAYER 1: CAPSULE CONTENT (Horizontal Pill Layout)
            Smoothly fades out during Morph to Sidebar; fades in on return
           ===================================================================== */}
        <div
          id="capsule-content-layer"
          className="absolute inset-0 flex items-center justify-between px-2 py-1.5 transition-opacity"
          style={{
            opacity: isSidebarVisual ? 0 : 1,
            pointerEvents: isSidebarVisual ? "none" : "auto",
            transitionDuration: prefersReducedMotion ? "0.01ms" : "180ms",
            transitionDelay: isSidebarVisual ? "0ms" : "140ms",
            transitionTimingFunction: "ease",
          }}
        >
          {displayNavItems.map((item) => {
            const isActive =
              item.href === "/"
                ? activePath === "/"
                : activePath?.startsWith(item.href);

            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleItemClick(e, item.href)}
                aria-current={isActive ? "page" : undefined}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 select-none cursor-pointer ${
                  isActive
                    ? "bg-white text-dark-ink shadow-md font-semibold"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* =====================================================================
            LAYER 2: SIDEBAR CONTENT (Full Vertical Layout)
            Smoothly fades in during Morph to Sidebar; fades out on return
           ===================================================================== */}
        <div
          id="sidebar-content-layer"
          className="absolute inset-0 p-6 flex flex-col justify-between transition-opacity"
          style={{
            opacity: isSidebarVisual ? 1 : 0,
            pointerEvents: isSidebarVisual ? "auto" : "none",
            transitionDuration: prefersReducedMotion ? "0.01ms" : "220ms",
            transitionDelay: isSidebarVisual ? "130ms" : "0ms",
            transitionTimingFunction: "ease",
          }}
        >
          {/* Top Brand Block */}
          <div>
            <a
              href="/"
              onClick={(e) => handleItemClick(e, "/")}
              className="flex items-center gap-3 mb-8 group cursor-pointer"
            >
              <div className="w-11 h-11 shrink-0 flex items-center justify-center">
                <Image
                  src="/images/brand/owner-lotus.png"
                  alt=""
                  width={44}
                  height={44}
                  className="w-11 h-11 object-contain"
                  priority
                />
              </div>
              <div className="font-brand">
                <span className="block font-bold tracking-wider text-dark-ink text-lg leading-tight">
                  HUẾ
                </span>
                <span className="block text-[10px] tracking-widest text-gray-500 uppercase leading-none font-semibold">
                  Travel Pro
                </span>
              </div>
            </a>

            {/* Vertical 5 Items */}
            <nav
              aria-label="Thanh điều hướng sidebar"
              className="space-y-2 flex flex-col"
            >
              {displayNavItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? activePath === "/"
                    : activePath?.startsWith(item.href);
                const activeClass =
                  activeColorMap[item.id] || "bg-deep-violet text-white";

                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleItemClick(e, item.href)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 select-none cursor-pointer ${
                      isActive
                        ? activeClass
                        : "text-gray-600 hover:text-dark-ink hover:bg-gray-50"
                    }`}
                  >
                    {navIcons[item.id]}
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Footer Settings Link */}
          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 px-4 py-2 text-xs text-gray-400">
              <Settings className="w-4 h-4" />
              <span>Phiên bản V2.3</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          DESKTOP HEADER WRAPPER (Top-left Brand & Top-right Search on Landing)
          Rendered on desktop, fades out when morphing to subpage
         ========================================================================= */}
      <header
        className="hidden md:flex w-full pt-4 pb-2 px-6 fixed top-0 left-0 right-0 z-40 justify-between items-center max-w-7xl mx-auto pointer-events-none transition-opacity"
        style={{
          opacity: isSidebarVisual ? 0 : 1,
          transitionDuration: prefersReducedMotion ? "0.01ms" : "250ms",
          transitionTimingFunction: "ease-out",
        }}
      >
        {/* Brand Logo Left */}
        <a
          href="/"
          onClick={(e) => handleItemClick(e, "/")}
          className="flex items-center gap-3.5 pointer-events-auto group cursor-pointer"
        >
          <div className="w-12 h-12 shrink-0 flex items-center justify-center">
            <Image
              src="/images/brand/owner-lotus.png"
              alt=""
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
              priority
            />
          </div>
          <div className="font-brand">
            <span className="block font-bold tracking-wider text-white text-[22px] leading-tight">
              HUẾ
            </span>
            <span className="block text-[11px] tracking-widest text-white/80 uppercase leading-none font-semibold">
              Travel Pro
            </span>
          </div>
        </a>

        {/* Right Search Button */}
        <div className="pointer-events-auto">
          <a
            href="/tim-kiem"
            onClick={(e) => handleItemClick(e, "/tim-kiem")}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-white/30 transition-colors shadow-sm cursor-pointer"
            title="Tìm kiếm"
          >
            <Search className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* =========================================================================
          MOBILE NAVIGATION (Top Header on Landing, Fixed Bottom Nav on Subpages)
          Visible only on < md screens
         ========================================================================= */}
      {/* Mobile Top Header on Landing */}
      {isCurrentLanding && (
        <header className="font-ui md:hidden w-full pt-4 pb-2 px-4 relative z-50">
          <div className="flex items-center justify-between">
            <a
              href="/"
              onClick={(e) => handleItemClick(e, "/")}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 shrink-0 flex items-center justify-center">
                <Image
                  src="/images/brand/owner-lotus.png"
                  alt=""
                  width={36}
                  height={36}
                  className="w-9 h-9 object-contain"
                  priority
                />
              </div>
              <div className="font-brand">
                <span className="block font-bold tracking-wider text-white text-base leading-tight">
                  HUẾ
                </span>
                <span className="block text-[9px] tracking-widest text-white/80 uppercase leading-none font-semibold">
                  Travel Pro
                </span>
              </div>
            </a>

            <div className="flex items-center gap-2">
              <a
                href="/tim-kiem"
                onClick={(e) => handleItemClick(e, "/tim-kiem")}
                className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20"
                title="Tìm kiếm"
              >
                <Search className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20"
                aria-label="Mở menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Drawer Menu */}
          {mobileMenuOpen && (
            <div className="mt-3 p-4 rounded-3xl bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl space-y-2">
              {displayNavItems.map((item) => {
                const isActive = activePath === item.href;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleItemClick(e, item.href)}
                    className={`block px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-white text-dark-ink font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          )}
        </header>
      )}

      {/* Mobile Fixed Bottom Navigation on Subpages */}
      {!isCurrentLanding && (
        <nav
          aria-label="Điều hướng di động chính"
          className="font-ui md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 grid grid-cols-5 items-center px-1 py-1 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
        >
          {displayNavItems.map((item) => {
            const isActive =
              item.href === "/"
                ? activePath === "/"
                : activePath?.startsWith(item.href);

            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleItemClick(e, item.href)}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 rounded-xl text-[10px] transition-colors w-full select-none ${
                  isActive
                    ? "text-deep-violet font-bold"
                    : "text-gray-500 hover:text-dark-ink"
                }`}
              >
                <div
                  className={`p-1 rounded-lg transition-transform ${
                    isActive
                      ? "bg-deep-violet/10 text-deep-violet scale-105"
                      : ""
                  }`}
                >
                  {navIcons[item.id]}
                </div>
                <span className="mt-0.5 text-[10px] leading-tight truncate max-w-full text-center">
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>
      )}
    </>
  );
}
