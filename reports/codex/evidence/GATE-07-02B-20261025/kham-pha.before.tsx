"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import SubpageTopBar from "@/components/navigation/SubpageTopBar";
import Card from "@/components/common/Card";
import { FEATURED_PLACES, Place } from "@/data/places";
import { searchPlaces } from "@/lib/search";
import {
  Compass,
  Tent,
  Waves,
  Camera,
  ExternalLink,
  RotateCcw,
  Sparkles,
  MapPin,
  AlertCircle,
  Users,
  Landmark,
  HelpCircle,
} from "lucide-react";

function KhamPhaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Đọc params từ URL
  const paramQ = searchParams.get("q") || "";
  const paramCategory = searchParams.get("category") || "all";
  const paramArea = searchParams.get("area") || "all";
  const paramBudget = searchParams.get("budget") || "all";
  const paramAudience = searchParams.get("audience") || "all";

  const [searchKeyword, setSearchKeyword] = useState<string>(paramQ);
  const [selectedCategory, setSelectedCategory] = useState<string>(paramCategory);
  const [selectedArea, setSelectedArea] = useState<string>(paramArea);
  const [selectedBudget, setSelectedBudget] = useState<string>(paramBudget);
  const [selectedAudience, setSelectedAudience] = useState<string>(paramAudience);

  // Đồng bộ khi URL thay đổi (Back / Forward)
  useEffect(() => {
    setSearchKeyword(searchParams.get("q") || "");
    setSelectedCategory(searchParams.get("category") || "all");
    setSelectedArea(searchParams.get("area") || "all");
    setSelectedBudget(searchParams.get("budget") || "all");
    setSelectedAudience(searchParams.get("audience") || "all");
  }, [searchParams]);

  // Cập nhật URLSearchParams (hỗ trợ cả push để back/forward và replace khi đang gõ)
  const updateUrl = (
    newParams: {
      q?: string;
      category?: string;
      area?: string;
      budget?: string;
      audience?: string;
    },
    action: "push" | "replace" = "push"
  ) => {
    const params = new URLSearchParams();
    const qVal = newParams.q !== undefined ? newParams.q : searchKeyword;
    const catVal = newParams.category !== undefined ? newParams.category : selectedCategory;
    const areaVal = newParams.area !== undefined ? newParams.area : selectedArea;
    const budgetVal = newParams.budget !== undefined ? newParams.budget : selectedBudget;
    const audVal = newParams.audience !== undefined ? newParams.audience : selectedAudience;

    if (qVal.trim()) params.set("q", qVal.trim());
    if (catVal !== "all") params.set("category", catVal);
    if (areaVal !== "all") params.set("area", areaVal);
    if (budgetVal !== "all") params.set("budget", budgetVal);
    if (audVal !== "all") params.set("audience", audVal);

    const queryString = params.toString();
    const targetUrl = `/kham-pha${queryString ? `?${queryString}` : ""}`;
    if (action === "push") {
      router.push(targetUrl, { scroll: false });
    } else {
      router.replace(targetUrl, { scroll: false });
    }
  };

  const handleCategoryClick = (cat: string) => {
    const nextCat = selectedCategory === cat ? "all" : cat;
    setSelectedCategory(nextCat);
    updateUrl({ category: nextCat }, "push");
  };

  const resetFilters = () => {
    setSearchKeyword("");
    setSelectedCategory("all");
    setSelectedArea("all");
    setSelectedBudget("all");
    setSelectedAudience("all");
    router.push("/kham-pha", { scroll: false });
  };

  // Tìm kiếm và lọc bằng module search.ts (tuân thủ quy tắc giá null và tiếng Việt)
  const searchResult = useMemo(() => {
    return searchPlaces(FEATURED_PLACES, {
      query: searchKeyword,
      category: selectedCategory,
      area: selectedArea,
      budget: selectedBudget,
      audience: selectedAudience,
    });
  }, [searchKeyword, selectedCategory, selectedArea, selectedBudget, selectedAudience]);

  const { exactMatches, unknownPriceItems, totalCount } = searchResult;
  const isFiltered =
    searchKeyword.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedArea !== "all" ||
    selectedBudget !== "all" ||
    selectedAudience !== "all";

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      {/* Top Search & Widgets (Tích hợp local search với URL query) */}
      <SubpageTopBar
        placeholder="Tìm địa điểm, món ăn, camping, bãi biển (VD: Đại Nội, dai noi)..."
        value={searchKeyword}
        onChange={(val) => {
          setSearchKeyword(val);
          updateUrl({ q: val }, "replace");
        }}
        onSubmit={(val) => {
          setSearchKeyword(val);
          updateUrl({ q: val }, "push");
        }}
        onClear={() => {
          setSearchKeyword("");
          updateUrl({ q: "" }, "push");
        }}
        showGlobalLink={true}
      />

      {/* Hero Header (03_KHAM_PHA mockup) */}
      <div
        className="w-full rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 text-white bg-cover bg-center shadow-lg relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(37, 28, 57, 0.95) 0%, rgba(77, 48, 135, 0.75) 55%, rgba(37, 28, 57, 0.3) 100%), url('/images/heroes/hero_trang_chu.png')`,
          backgroundPosition: "right center",
          backgroundSize: "cover",
        }}
      >
        <div className="max-w-2xl space-y-2.5 sm:space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-warm-gold">
            <span>KHÁM PHÁ</span>
            <div className="w-8 h-px bg-warm-gold/60" />
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight leading-tight">
            Khám phá Huế
          </h1>

          <p className="text-white/85 text-xs sm:text-sm lg:text-base leading-relaxed">
            Những điểm đến đẹp, thú vị và đáng trải nghiệm đang chờ bạn khám phá.
          </p>

          {/* Quick Search Suggestion Tags */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 text-xs">
            <span className="text-white/70 text-[11px] sm:text-xs shrink-0">Gợi ý tìm kiếm:</span>
            {[
              "Đại Nội",
              "dai noi",
              "Chùa Thiên Mụ",
              "Bãi biển Lăng Cô",
              "Camping",
              "Làng hương Thủy Xuân",
            ].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchKeyword(tag);
                  updateUrl({ q: tag });
                }}
                className="px-2.5 py-1 min-h-[32px] sm:min-h-[36px] flex items-center rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-[11px] sm:text-xs transition-colors shrink-0"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Category Pill Buttons - Responsive 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        <button
          type="button"
          onClick={() => handleCategoryClick("di-tich")}
          className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 transition-all text-left border min-w-0 w-full min-h-[68px] ${
            selectedCategory === "di-tich"
              ? "bg-amber-100 border-amber-300 shadow-sm ring-2 ring-amber-400/40"
              : "bg-white border-gray-100 hover:border-amber-200"
          }`}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 w-full">
            <h4 className="font-bold text-xs sm:text-sm text-dark-ink truncate">
              Di tích & danh thắng
            </h4>
            <span className="text-[10px] sm:text-[11px] text-gray-500 block truncate">Lăng tẩm, chùa chiền</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleCategoryClick("camping")}
          className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 transition-all text-left border min-w-0 w-full min-h-[68px] ${
            selectedCategory === "camping"
              ? "bg-emerald-100 border-emerald-300 shadow-sm ring-2 ring-emerald-400/40"
              : "bg-white border-gray-100 hover:border-emerald-200"
          }`}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center shrink-0">
            <Tent className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 w-full">
            <h4 className="font-bold text-xs sm:text-sm text-dark-ink truncate">
              Camping & dã ngoại
            </h4>
            <span className="text-[10px] sm:text-[11px] text-gray-500 block truncate">Thiên nhiên, trải nghiệm</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleCategoryClick("bien")}
          className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 transition-all text-left border min-w-0 w-full min-h-[68px] ${
            selectedCategory === "bien"
              ? "bg-blue-100 border-blue-300 shadow-sm ring-2 ring-blue-400/40"
              : "bg-white border-gray-100 hover:border-blue-200"
          }`}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/15 text-blue-700 flex items-center justify-center shrink-0">
            <Waves className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 w-full">
            <h4 className="font-bold text-xs sm:text-sm text-dark-ink truncate">
              Biển & nghỉ dưỡng
            </h4>
            <span className="text-[10px] sm:text-[11px] text-gray-500 block truncate">Bãi biển đẹp, check-in</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleCategoryClick("check-in")}
          className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 transition-all text-left border min-w-0 w-full min-h-[68px] ${
            selectedCategory === "check-in"
              ? "bg-purple-100 border-purple-300 shadow-sm ring-2 ring-purple-400/40"
              : "bg-white border-gray-100 hover:border-purple-200"
          }`}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-500/15 text-purple-700 flex items-center justify-center shrink-0">
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 w-full">
            <h4 className="font-bold text-xs sm:text-sm text-dark-ink truncate">
              Check-in nổi bật
            </h4>
            <span className="text-[10px] sm:text-[11px] text-gray-500 block truncate">Cầu Trường Tiền, làng hương</span>
          </div>
        </button>
      </div>

      {/* Filter Control Bar (4 Selects with State and URL persistence) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Category Select */}
          <div className="relative w-full">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                updateUrl({ category: e.target.value });
              }}
              aria-label="Danh mục điểm đến"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-soft-purple"
            >
              <option value="all">Danh mục: Tất cả danh mục</option>
              <option value="di-tich">Di tích & danh thắng</option>
              <option value="camping">Camping & dã ngoại</option>
              <option value="bien">Biển & nghỉ dưỡng</option>
              <option value="check-in">Check-in nổi bật</option>
            </select>
          </div>

          {/* Area Select */}
          <div className="relative w-full">
            <select
              value={selectedArea}
              onChange={(e) => {
                setSelectedArea(e.target.value);
                updateUrl({ area: e.target.value });
              }}
              aria-label="Khu vực"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-soft-purple"
            >
              <option value="all">Khu vực: Tất cả khu vực</option>
              <option value="trung-tam">Trung tâm TP. Huế / Kinh thành</option>
              <option value="phu-loc">Huyện Phú Lộc / Vịnh Lăng Cô</option>
              <option value="thuy-bang">Xã Thủy Bằng / Đồi Thiên An</option>
              <option value="kim-long">Phường Kim Long / Chùa Thiên Mụ</option>
            </select>
          </div>

          {/* Budget Select (LOCK-12: Price null separation) */}
          <div className="relative w-full">
            <select
              value={selectedBudget}
              onChange={(e) => {
                setSelectedBudget(e.target.value);
                updateUrl({ budget: e.target.value });
              }}
              aria-label="Ngân sách"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-soft-purple"
            >
              <option value="all">Ngân sách: Tất cả mức giá</option>
              <option value="free">Miễn phí tham quan (Đã xác minh)</option>
              <option value="ticket">Vé tham quan theo quy định di tích</option>
              <option value="contact">Chưa rõ vé / Dã ngoại tự do</option>
            </select>
          </div>

          {/* Suitable for / Audience Select */}
          <div className="relative w-full">
            <select
              value={selectedAudience}
              onChange={(e) => {
                setSelectedAudience(e.target.value);
                updateUrl({ audience: e.target.value });
              }}
              aria-label="Đối tượng phù hợp"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-soft-purple"
            >
              <option value="all">Phù hợp: Mọi đối tượng</option>
              <option value="first-time">Đi Huế lần đầu (Must-visit)</option>
              <option value="family">Gia đình & Người lớn tuổi</option>
              <option value="couple">Cặp đôi & Hoàng hôn</option>
              <option value="youth">Nhóm bạn trẻ & Check-in</option>
            </select>
          </div>
        </div>

        {/* Status & Reset Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-2 text-gray-500">
            <span>
              Hiển thị <strong className="text-dark-ink font-bold">{totalCount}</strong> địa điểm phù hợp
            </span>
            {isFiltered && (
              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-deep-violet font-semibold text-[10px]">
                Đang áp dụng bộ lọc
              </span>
            )}
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-xl text-gray-600 hover:text-dark-ink hover:bg-gray-100 transition-colors font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout (Grid + Right Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Places Grid (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-serif text-dark-ink flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-warm-gold" />
              <span>Địa điểm phù hợp</span>
              <span className="text-xs font-normal text-gray-400 font-sans ml-2">
                ({totalCount} địa điểm)
              </span>
            </h2>
            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-deep-violet hover:underline"
              >
                Xem tất cả ➔
              </button>
            )}
          </div>

          {/* Khi không tìm thấy kết quả */}
          {totalCount === 0 ? (
            <Card className="p-8 sm:p-12 text-center bg-white border border-gray-100 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <HelpCircle className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold font-serif text-dark-ink">
                  Không tìm thấy địa điểm phù hợp
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  Không có điểm đến nào khớp với các tiêu chí tìm kiếm và bộ lọc đã chọn. Hãy thử xóa bớt điều kiện lọc hoặc nhập từ khóa khác (VD: <em>Đại Nội, dai noi, Thủy Xuân</em>).
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-deep-violet text-white text-xs font-semibold hover:bg-opacity-95 shadow-sm transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Xóa bộ lọc & Xem toàn bộ danh sách</span>
                </button>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Danh sách địa điểm phù hợp chính xác */}
              {exactMatches.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {exactMatches.map((place: Place) => (
                    <Card
                      key={place.id}
                      className="group flex flex-col justify-between overflow-hidden hover:shadow-lg transition-all border border-gray-100"
                    >
                      <div>
                        {/* Image banner */}
                        <Link
                          href={`/kham-pha/${place.slug}`}
                          className="block h-44 w-full bg-cover bg-center relative cursor-pointer"
                          style={{
                            backgroundImage: `url('${place.image}')`,
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/75 transition-colors" />
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase">
                            {place.categoryLabel}
                          </span>
                          <span className="absolute bottom-2.5 right-3 text-xs font-bold text-amber-300 drop-shadow">
                            {place.price.displayLabel}
                          </span>
                        </Link>

                        {/* Body text */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/kham-pha/${place.slug}`}
                              className="font-bold text-dark-ink text-base group-hover:text-deep-violet transition-colors cursor-pointer"
                            >
                              {place.name}
                            </Link>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{place.location}</span>
                          </div>

                          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                            {place.summary}
                          </p>

                          {/* Safety note for camping (Master Spec REQ-03) */}
                          {place.safetyNote && (
                            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-1.5 mt-2">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                              <span>{place.safetyNote}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tags and Action */}
                      <div className="px-4 pb-4 pt-2 border-t border-gray-50 flex items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1.5">
                          {place.tags.slice(0, 2).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <Link
                            href={`/kham-pha/${place.slug}`}
                            className="px-3 py-1 rounded-full bg-deep-violet/10 text-deep-violet hover:bg-deep-violet hover:text-white text-xs font-semibold transition-colors"
                          >
                            Chi tiết
                          </Link>

                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              `${place.name} Huế`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Mở Google Maps"
                            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-deep-violet hover:text-white flex items-center justify-center text-gray-600 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Nhóm tách riêng cho bản ghi chưa rõ giá khi có lọc ngân sách (Bắt buộc theo Section 06) */}
              {unknownPriceItems.length > 0 && (
                <div className="pt-4 space-y-3">
                  <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-1">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Nhóm địa điểm chưa có giá kiểm chứng riêng / Dã ngoại tự túc ({unknownPriceItems.length} địa điểm)</span>
                    </div>
                    <p className="text-amber-800 text-[11px] leading-relaxed">
                      Các địa điểm này không thu phí vé thương mại nhưng chưa có văn bản niêm yết chính thức. Hệ thống tách riêng nhằm bảo đảm không trộn lẫn với danh mục miễn phí 100% đã kiểm chứng.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {unknownPriceItems.map((place: Place) => (
                      <Card
                        key={place.id}
                        className="group flex flex-col justify-between overflow-hidden hover:shadow-lg transition-all border border-amber-100 bg-amber-50/20"
                      >
                        <div>
                          <Link
                            href={`/kham-pha/${place.slug}`}
                            className="block h-40 w-full bg-cover bg-center relative cursor-pointer"
                            style={{ backgroundImage: `url('${place.image}')` }}
                          >
                            <span className="absolute bottom-2.5 right-3 text-xs font-bold text-amber-300 drop-shadow">
                              {place.price.displayLabel}
                            </span>
                          </Link>

                          <div className="p-4 space-y-2">
                            <Link
                              href={`/kham-pha/${place.slug}`}
                              className="font-bold text-dark-ink text-base group-hover:text-deep-violet transition-colors cursor-pointer"
                            >
                              {place.name}
                            </Link>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {place.summary}
                            </p>
                          </div>
                        </div>

                        <div className="px-4 pb-4 pt-2 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[10px] text-amber-700 font-semibold">
                            Tự túc / Tham khảo
                          </span>
                          <Link
                            href={`/kham-pha/${place.slug}`}
                            className="px-3 py-1 rounded-full bg-deep-violet text-white text-xs font-semibold"
                          >
                            Xem chi tiết
                          </Link>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Map Preview & Gợi ý (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Map Widget (LOCK-09: maps=external) */}
          <Card className="p-5 border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-dark-ink text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-deep-violet" />
                <span>Bản đồ địa điểm</span>
              </h3>
              <a
                href="https://www.google.com/maps/search/dia+diem+du+lich+hue"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-deep-violet font-semibold hover:underline flex items-center gap-1"
              >
                <span>Xem bản đồ lớn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Stylized Illustrated Map Box */}
            <div
              className="h-44 rounded-2xl bg-blue-50 border border-blue-100 relative overflow-hidden flex flex-col justify-between p-3 bg-cover bg-center"
              style={{
                backgroundImage: `url('/images/03_KHAM_PHA.png')`,
              }}
            >
              <div className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] space-y-1">
                <div className="font-bold">📍 Vùng tham quan Huế:</div>
                <div className="text-[10px] text-white/80">
                  Đại Nội · Chùa Thiên Mụ · Sông Hương · Lăng Cô
                </div>
              </div>

              <a
                href="https://www.google.com/maps/search/dia+diem+du+lich+hue"
                target="_blank"
                rel="noopener noreferrer"
                className="self-end px-3 py-1.5 rounded-xl bg-white text-dark-ink text-xs font-bold shadow-md hover:bg-gray-50 flex items-center gap-1"
              >
                <span>Mở Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-gray-400 italic">
              * Liên kết dẫn trực tiếp tới Google Maps theo toạ độ địa danh chính xác.
            </p>
          </Card>

          {/* Gợi ý theo nhu cầu (Cập nhật tương tác URL params) */}
          <Card className="p-5 border border-gray-100 space-y-3">
            <h3 className="font-bold text-dark-ink text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-warm-gold" />
              <span>Gợi ý theo nhu cầu</span>
            </h3>

            <div className="space-y-2 pt-1">
              <div
                onClick={() => {
                  setSelectedAudience("first-time");
                  updateUrl({ audience: "first-time" });
                }}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                  selectedAudience === "first-time"
                    ? "bg-amber-100 border-amber-300 ring-2 ring-amber-400/30"
                    : "bg-amber-50/70 hover:bg-amber-100/70 border-amber-100"
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-dark-ink">Đi Huế lần đầu</h4>
                  <p className="text-[10px] text-gray-500">Những điểm không thể bỏ lỡ</p>
                </div>
              </div>

              <div
                onClick={() => {
                  setSelectedCategory("camping");
                  updateUrl({ category: "camping" });
                }}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                  selectedCategory === "camping"
                    ? "bg-emerald-100 border-emerald-300 ring-2 ring-emerald-400/30"
                    : "bg-emerald-50/70 hover:bg-emerald-100/70 border-emerald-100"
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center">
                  <Tent className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-dark-ink">Chill cuối tuần</h4>
                  <p className="text-[10px] text-gray-500">Thiên nhiên & thư giãn</p>
                </div>
              </div>

              <div
                onClick={() => {
                  setSelectedAudience("family");
                  updateUrl({ audience: "family" });
                }}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                  selectedAudience === "family"
                    ? "bg-blue-100 border-blue-300 ring-2 ring-blue-400/30"
                    : "bg-blue-50/70 hover:bg-blue-100/70 border-blue-100"
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-blue-200 text-blue-800 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-dark-ink">Đi cùng gia đình</h4>
                  <p className="text-[10px] text-gray-500">An toàn, phù hợp mọi lứa tuổi</p>
                </div>
              </div>

              <div
                onClick={() => {
                  setSelectedCategory("check-in");
                  updateUrl({ category: "check-in" });
                }}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                  selectedCategory === "check-in"
                    ? "bg-rose-100 border-rose-300 ring-2 ring-rose-400/30"
                    : "bg-rose-50/70 hover:bg-rose-100/70 border-rose-100"
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-dark-ink">Check-in sống ảo</h4>
                  <p className="text-[10px] text-gray-500">Góc chụp ảnh đẹp nhất xứ Huế</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function KhamPhaPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-500 text-sm">
          Đang tải trang Khám phá...
        </div>
      }
    >
      <KhamPhaContent />
    </Suspense>
  );
}
