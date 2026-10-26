"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAV_ITEMS } from "@/types/navigation";
import { Search, Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full pt-4 pb-2 px-4 sm:px-6 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-sm">
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
            <span className="block font-bold tracking-wider text-white text-lg leading-tight">
              HUẾ
            </span>
            <span className="block text-[10px] tracking-widest text-white/80 uppercase leading-none font-semibold">
              Travel Pro
            </span>
          </div>
        </Link>

        {/* Center Pill Navigation (LOCK-01: Exactly 5 items) */}
        <nav className="hidden md:flex items-center bg-black/35 backdrop-blur-md border border-white/20 rounded-full p-1.5 shadow-lg">
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white text-dark-ink shadow-md font-semibold"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side widgets & mobile menu toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/tim-kiem"
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-white/30 transition-colors"
            title="Tìm kiếm"
          >
            <Search className="w-4 h-4" />
          </Link>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20"
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (visible when open on mobile) */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 p-4 rounded-3xl bg-black/85 backdrop-blur-xl border border-white/20 shadow-2xl space-y-2">
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white text-dark-ink font-bold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
