"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAV_ITEMS } from "@/types/navigation";
import {
  Home,
  Landmark,
  Compass,
  Car,
  Building2,
  Settings,
} from "lucide-react";

const navIcons: Record<string, React.ReactNode> = {
  "trang-chu": <Home className="w-5 h-5 shrink-0" />,
  "ve-hue": <Landmark className="w-5 h-5 shrink-0" />,
  "kham-pha": <Compass className="w-5 h-5 shrink-0" />,
  "cam-nang": <Car className="w-5 h-5 shrink-0" />,
  "luu-tru": <Building2 className="w-5 h-5 shrink-0" />,
};

const activeColorMap: Record<string, string> = {
  "trang-chu": "bg-deep-violet text-white",
  "ve-hue": "bg-[#F2C675] text-dark-ink font-semibold shadow-sm",
  "kham-pha": "bg-soft-purple text-white shadow-sm",
  "cam-nang": "bg-[#F2994A] text-white shadow-sm",
  "luu-tru": "bg-[#E6D5B8] text-dark-ink font-semibold shadow-sm",
};

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar (visible on md+) */}
      <aside className="hidden md:flex w-64 min-h-screen bg-white border-r border-gray-100 flex-col justify-between p-6 shrink-0 shadow-sm sticky top-0 h-screen overflow-y-auto">
        <div>
          {/* Brand Header */}
          <Link href="/" className="flex items-center gap-3 mb-10 group">
            <div className="w-11 h-11 rounded-2xl bg-deep-violet flex items-center justify-center text-white shadow-md">
              <svg
                className="w-6 h-6 fill-current text-white"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C12 2 15 7 15 11C15 13.5 13.5 15.5 12 16C10.5 15.5 9 13.5 9 11C9 7 12 2 12 2Z" />
                <path d="M7 6C7 6 10 9.5 10 13C10 14.8 9 16.5 7.5 17C5.5 16 4 14 4 12C4 9.5 7 6 7 6Z" opacity="0.8" />
                <path d="M17 6C17 6 14 9.5 14 13C14 14.8 15 16.5 16.5 17C18.5 16 20 14 20 12C20 9.5 17 6 17 6Z" opacity="0.8" />
                <path d="M12 18C15 18 19 19 22 21H2C5 19 9 18 12 18Z" opacity="0.9" />
              </svg>
            </div>
            <div>
              <span className="block font-bold tracking-wider text-dark-ink text-lg leading-tight">
                HUẾ
              </span>
              <span className="block text-[10px] tracking-widest text-gray-500 uppercase leading-none font-semibold">
                Travel Pro
              </span>
            </div>
          </Link>

          {/* 5 Main Nav Items (LOCK-01) */}
          <nav className="space-y-2">
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);
              const activeClass =
                activeColorMap[item.id] || "bg-deep-violet text-white";

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? activeClass
                      : "text-gray-600 hover:text-dark-ink hover:bg-gray-50"
                  }`}
                >
                  {navIcons[item.id]}
                  <span>{item.label}</span>
                </Link>
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
      </aside>

      {/* Mobile Bottom Navigation Bar (visible below md - Strict 5 LOCK-01 Items) */}
      <nav
        aria-label="Điều hướng di động chính"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 grid grid-cols-5 items-center px-1 py-1 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      >
        {MAIN_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 rounded-xl text-[10px] transition-colors w-full ${
                isActive
                  ? "text-deep-violet font-bold"
                  : "text-gray-500 hover:text-dark-ink"
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? "bg-deep-violet/10 text-deep-violet scale-105" : ""
                }`}
              >
                {navIcons[item.id]}
              </div>
              <span className="mt-0.5 text-[10px] leading-tight truncate max-w-full text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
