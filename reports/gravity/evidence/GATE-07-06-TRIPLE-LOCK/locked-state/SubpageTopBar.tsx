"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Heart, X } from "lucide-react";

interface SubpageTopBarProps {
  placeholder?: string;
  defaultQuery?: string;
  value?: string;
  onChange?: (val: string) => void;
  onSubmit?: (val: string) => void;
  onClear?: () => void;
  showGlobalLink?: boolean;
}

export default function SubpageTopBar({
  placeholder = "Tìm địa điểm, món ăn, vùng đất...",
  defaultQuery = "",
  value,
  onChange,
  onSubmit,
  onClear,
  showGlobalLink = true,
}: SubpageTopBarProps) {
  const [internalQuery, setInternalQuery] = useState(defaultQuery);
  const router = useRouter();

  const isControlled = value !== undefined;
  const currentQuery = isControlled ? value : internalQuery;

  useEffect(() => {
    if (!isControlled && defaultQuery !== undefined) {
      setInternalQuery(defaultQuery);
    }
  }, [defaultQuery, isControlled]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    if (isControlled) {
      onChange?.(newVal);
    } else {
      setInternalQuery(newVal);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(currentQuery);
    } else if (currentQuery.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(currentQuery.trim())}`);
    }
  };

  const handleClear = () => {
    if (isControlled) {
      onChange?.("");
      onClear?.();
    } else {
      setInternalQuery("");
      onClear?.();
    }
  };

  return (
    <div className="w-full flex items-center justify-between gap-2.5 sm:gap-4 mb-6 sm:mb-8 min-w-0">
      {/* Search Input Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex-1 min-w-0 max-w-2xl relative"
      >
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 sm:left-4 pointer-events-none" />
          <input
            type="text"
            value={currentQuery}
            onChange={handleInputChange}
            placeholder={placeholder}
            aria-label="Tìm kiếm nội dung Huế"
            className="w-full bg-white pl-9 sm:pl-11 pr-9 sm:pr-10 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm text-dark-ink placeholder-gray-400 border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-soft-purple focus:border-transparent transition-all min-h-[44px]"
          />
          {currentQuery && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Xóa từ khóa tìm kiếm"
              className="absolute right-3 w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </form>

      {/* Right widgets */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Brand exploration pill (thay thế nhiệt độ tĩnh theo yêu cầu Gate 02 Correction) */}
        {showGlobalLink && (
          <button
            type="button"
            onClick={() => {
              if (currentQuery.trim()) {
                router.push(`/tim-kiem?q=${encodeURIComponent(currentQuery.trim())}`);
              } else {
                router.push("/tim-kiem");
              }
            }}
            title="Tìm kiếm toàn trang"
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-deep-violet/10 hover:bg-deep-violet/15 border border-deep-violet/20 text-deep-violet text-xs font-semibold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-deep-violet shrink-0" />
            <span>Tìm toàn site</span>
          </button>
        )}

        {/* Favorites button (neutralized per LOCK-08: favorites=later) */}
        <button
          type="button"
          disabled
          aria-label="Yêu thích (tính năng đang phát triển)"
          title="Yêu thích (tính năng dự kiến)"
          className="hidden sm:flex w-10 h-10 rounded-full bg-white border border-gray-100 items-center justify-center text-gray-300 cursor-not-allowed shadow-sm"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* User profile tạm ẩn theo yêu cầu: phát triển đăng nhập sẽ làm sau */}
      </div>
    </div>
  );
}
