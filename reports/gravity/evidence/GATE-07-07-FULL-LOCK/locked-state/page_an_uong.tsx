"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import SubpageTopBar from "@/components/navigation/SubpageTopBar";
import Card from "@/components/common/Card";
import { FEATURED_FOODS, FoodSpot } from "@/data/foods";
import { searchFoods } from "@/lib/search";
import {
  Utensils,
  Soup,
  Coffee,
  Sparkles,
  MapPin,
  Clock,
  Coins,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Phone,
  Flame,
  X,
} from "lucide-react";

function AnUongContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Đọc params từ URL
  const paramQ = searchParams.get("q") || "";
  const paramCategory = searchParams.get("category") || "all";
  const paramArea = searchParams.get("area") || "all";
  const paramBudget = searchParams.get("budget") || "all";

  const [searchKeyword, setSearchKeyword] = useState<string>(paramQ);
  const [selectedCategory, setSelectedCategory] = useState<string>(paramCategory);
  const [selectedArea, setSelectedArea] = useState<string>(paramArea);
  const [selectedBudget, setSelectedBudget] = useState<string>(paramBudget);
  const [activeModalFood, setActiveModalFood] = useState<FoodSpot | null>(null);

  // Đồng bộ khi URL thay đổi (Back / Forward)
  useEffect(() => {
    setSearchKeyword(searchParams.get("q") || "");
    setSelectedCategory(searchParams.get("category") || "all");
    setSelectedArea(searchParams.get("area") || "all");
    setSelectedBudget(searchParams.get("budget") || "all");
  }, [searchParams]);

  // Cập nhật URLSearchParams
  const updateUrl = (
    newParams: {
      q?: string;
      category?: string;
      area?: string;
      budget?: string;
    },
    action: "push" | "replace" = "push"
  ) => {
    const params = new URLSearchParams();
    const qVal = newParams.q !== undefined ? newParams.q : searchKeyword;
    const catVal = newParams.category !== undefined ? newParams.category : selectedCategory;
    const areaVal = newParams.area !== undefined ? newParams.area : selectedArea;
    const budgetVal = newParams.budget !== undefined ? newParams.budget : selectedBudget;

    if (qVal.trim()) params.set("q", qVal.trim());
    if (catVal !== "all") params.set("category", catVal);
    if (areaVal !== "all") params.set("area", areaVal);
    if (budgetVal !== "all") params.set("budget", budgetVal);

    const queryString = params.toString();
    const targetUrl = `/an-uong${queryString ? `?${queryString}` : ""}`;
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
    router.push("/an-uong", { scroll: false });
  };

  // Tìm kiếm và lọc
  const searchResult = useMemo(() => {
    return searchFoods(FEATURED_FOODS, {
      query: searchKeyword,
      category: selectedCategory,
      area: selectedArea,
      budget: selectedBudget,
    });
  }, [searchKeyword, selectedCategory, selectedArea, selectedBudget]);

  const displayedFoods = searchResult.exactMatches;

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 font-ui">
      {/* 1. TOP BAR SEARCH */}
      <SubpageTopBar
        placeholder="Tìm bún bò, chè hẻm, bánh bèo nậm lọc, quán ăn..."
        value={searchKeyword}
        onChange={(val) => {
          setSearchKeyword(val);
          updateUrl({ q: val }, "replace");
        }}
        onClear={() => {
          setSearchKeyword("");
          updateUrl({ q: "" }, "push");
        }}
        onSubmit={(val) => {
          setSearchKeyword(val);
          updateUrl({ q: val }, "push");
        }}
      />

      {/* 2. HERO BANNER VỚI ẢNH ẨM THỰC HÌNH 3 (PHONG CÁCH HÌNH 2) */}
      <div
        className="w-full rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 text-white shadow-lg relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(37, 28, 57, 0.92) 0%, rgba(37, 28, 57, 0.68) 50%, rgba(37, 28, 57, 0.18) 100%), url('/images/heroes/hero_an_uong.png')`,
          backgroundPosition: "right center",
          backgroundSize: "cover",
        }}
      >
        <div className="max-w-2xl space-y-2.5 sm:space-y-3 relative z-10">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-editorial tracking-tight leading-snug text-white max-w-xl">
            Những món ăn ngon, quán chuẩn vị và đặc sản trứ danh đang chờ bạn thưởng thức.
          </h1>

          {/* Quick Search Suggestion Tags */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 text-xs">
            <span className="text-white/70 text-[11px] sm:text-xs shrink-0">Gợi ý tìm kiếm:</span>
            {[
              "Bún bò Huế",
              "Bánh bèo",
              "Bánh lọc",
              "Cơm hến",
              "Chè Hẻm",
              "Cà phê muối",
            ].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchKeyword(tag);
                  updateUrl({ q: tag });
                }}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/90 text-[11px] sm:text-xs backdrop-blur-sm transition-colors border border-white/10"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 4 CATEGORY CARDS - Chuẩn hóa đồng bộ 4 ô ngang như Di chuyển & Khám phá */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        {/* Card 1: Bún bò & Món nước */}
        <div
          onClick={() => handleCategoryClick("bun-bo")}
          className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 border transition-all cursor-pointer min-h-[68px] min-w-0 ${
            selectedCategory === "bun-bo"
              ? "bg-amber-100 border-amber-300 shadow-sm ring-2 ring-amber-400/40"
              : "bg-orange-50/40 border-orange-100 hover:border-orange-300"
          }`}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Soup className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 w-full">
            <h4 className="font-bold text-xs sm:text-sm text-dark-ink truncate">Bún bò & Món nước</h4>
            <span className="text-[10px] sm:text-[11px] text-gray-500 block truncate">Đậm đà hương ruốc sả</span>
          </div>
        </div>

        {/* Card 2: Bánh đặc sản Huế */}
        <div
          onClick={() => handleCategoryClick("banh-hue")}
          className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 border transition-all cursor-pointer min-h-[68px] min-w-0 ${
            selectedCategory === "banh-hue"
              ? "bg-emerald-100 border-emerald-300 shadow-sm ring-2 ring-emerald-400/40"
              : "bg-emerald-50/40 border-emerald-100 hover:border-emerald-300"
          }`}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 w-full">
            <h4 className="font-bold text-xs sm:text-sm text-dark-ink truncate">Bánh đặc sản Huế</h4>
            <span className="text-[10px] sm:text-[11px] text-gray-500 block truncate">Bèo, nậm, lọc, bánh khoái</span>
          </div>
        </div>

        {/* Card 3: Cơm & Món hến */}
        <div
          onClick={() => handleCategoryClick("com-hen")}
          className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 border transition-all cursor-pointer min-h-[68px] min-w-0 ${
            selectedCategory === "com-hen"
              ? "bg-rose-100 border-rose-300 shadow-sm ring-2 ring-rose-400/40"
              : "bg-rose-50/40 border-rose-100 hover:border-rose-300"
          }`}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 w-full">
            <h4 className="font-bold text-xs sm:text-sm text-dark-ink truncate">Cơm & Món hến</h4>
            <span className="text-[10px] sm:text-[11px] text-gray-500 block truncate">Cồn Hến, cay nồng đậm vị</span>
          </div>
        </div>

        {/* Card 4: Chè & Cà phê Cố Đô */}
        <div
          onClick={() => handleCategoryClick("che-ca-phe")}
          className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 border transition-all cursor-pointer min-h-[68px] min-w-0 ${
            selectedCategory === "che-ca-phe" || selectedCategory === "che-hue" || selectedCategory === "ca-phe"
              ? "bg-purple-100 border-purple-300 shadow-sm ring-2 ring-purple-400/40"
              : "bg-purple-50/40 border-purple-100 hover:border-purple-300"
          }`}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 w-full">
            <h4 className="font-bold text-xs sm:text-sm text-dark-ink truncate">Chè & Cà phê Cố Đô</h4>
            <span className="text-[10px] sm:text-[11px] text-gray-500 block truncate">Chè Hẻm, cà phê muối</span>
          </div>
        </div>
      </div>

      {/* 4. FILTER CONTROL BAR - Đồng bộ layout thanh công cụ như Di chuyển (Hình 1) */}
      <div id="am-thuc-danh-sach" className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-3 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              updateUrl({ category: e.target.value });
            }}
            aria-label="Thể loại ẩm thực"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-purple-400 text-xs"
          >
            <option value="all">Thể loại: Tất cả thể loại</option>
            <option value="bun-bo">Bún bò Huế & Món nước</option>
            <option value="banh-hue">Bánh đặc sản (Bèo - Nậm - Lọc - Khoái)</option>
            <option value="com-hen">Cơm & Món hến Cồn Hến</option>
            <option value="che-hue">Chè cung đình & Chè heo quay</option>
            <option value="ca-phe">Cà phê muối & Trà Cung đình</option>
            <option value="an-vat">Ăn vặt Cố Đô (Bánh ép, nem chua)</option>
          </select>

          {/* Area Dropdown */}
          <select
            value={selectedArea}
            onChange={(e) => {
              setSelectedArea(e.target.value);
              updateUrl({ area: e.target.value });
            }}
            aria-label="Khu vực địa lý"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-purple-400 text-xs"
          >
            <option value="all">Khu vực: Tất cả khu vực Huế</option>
            <option value="bo-nam">Bờ Nam Sông Hương (Trung tâm, phố Tây, Vĩ Dạ)</option>
            <option value="bo-bac">Bờ Bắc Sông Hương (Thành Nội, Phố Cổ Chi Lăng)</option>
          </select>

          {/* Budget Dropdown */}
          <select
            value={selectedBudget}
            onChange={(e) => {
              setSelectedBudget(e.target.value);
              updateUrl({ budget: e.target.value });
            }}
            aria-label="Mức chi phí"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-purple-400 text-xs"
          >
            <option value="all">Khoảng giá: Tất cả mức giá</option>
            <option value="budget">Bình dân (Dưới 50.000đ)</option>
            <option value="mid">Trung bình (50.000đ - 150.000đ)</option>
            <option value="premium">Cao cấp / Cung đình (Trên 150.000đ)</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>
              Hiển thị <strong className="text-dark-ink font-bold">{displayedFoods.length}</strong> địa điểm ăn uống chuẩn vị
            </span>
            {(searchKeyword || selectedCategory !== "all" || selectedArea !== "all" || selectedBudget !== "all") && (
              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-semibold text-[10px]">
                Đang lọc
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="italic text-gray-400">
              * Toàn bộ địa điểm được tuyển chọn theo phong vị Cố Đô Huế
            </span>
            {(searchKeyword || selectedCategory !== "all" || selectedArea !== "all" || selectedBudget !== "all") && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[32px] rounded-xl text-gray-600 hover:text-dark-ink hover:bg-gray-100 transition-colors font-medium text-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xóa bộ lọc</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 6. FOOD CARDS GRID */}
      {displayedFoods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {displayedFoods.map((food) => (
            <Card
              key={food.id}
              variant="elevated"
              className="flex flex-col h-full group hover:shadow-xl transition-all duration-300 border border-gray-100/90 rounded-3xl overflow-hidden bg-white"
            >
              {/* Card Image Cover */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <Image
                  src={food.image}
                  alt={food.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Badges on Top */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-purple-900 shadow-sm backdrop-blur-sm">
                    {food.categoryLabel}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/90 text-white shadow-sm backdrop-blur-sm">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Xác thực</span>
                  </span>
                </div>

                {/* Title & Price on Bottom of Image */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-lg sm:text-xl text-white leading-snug drop-shadow-sm">
                    {food.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold mt-0.5">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{food.priceRange}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Address & Hours */}
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{food.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{food.openHours}</span>
                    </div>
                  </div>

                  {/* Specialty Dishes Pills */}
                  <div className="pt-1">
                    <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Món đặc sắc phải thử:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {food.specialtyDishes.slice(0, 3).map((dish, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-purple-50 text-purple-800 border border-purple-100"
                        >
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {food.summary}
                  </p>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalFood(food)}
                    className="w-full py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs transition-colors text-center"
                  >
                    Xem chi tiết
                  </button>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      food.googleMapsQuery
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-[#2D1B4E] hover:bg-[#3D2568] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Chỉ đường</span>
                    <ExternalLink className="w-3 h-3 text-[#D2F801]" />
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center space-y-4 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <Utensils className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-dark-ink">
              Chưa tìm thấy quán ăn phù hợp
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Không có địa điểm ẩm thực nào khớp với từ khóa hoặc bộ lọc hiện tại. Hãy thử chọn thể loại khác hoặc đặt lại bộ lọc.
            </p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-700 text-white font-bold text-xs shadow-md hover:bg-purple-800 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Xem tất cả quán ăn Huế</span>
          </button>
        </div>
      )}

      {/* 7. INTERACTIVE DETAIL MODAL */}
      {activeModalFood && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-y-auto border border-gray-100">
            {/* Modal Image Header */}
            <div className="relative h-60 w-full overflow-hidden">
              <Image
                src={activeModalFood.image}
                alt={activeModalFood.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalFood(null)}
                aria-label="Đóng cửa sổ"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-colors border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title on Image */}
              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E25C3D] text-white">
                  {activeModalFood.categoryLabel}
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
                  {activeModalFood.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
                  <Coins className="w-4 h-4" />
                  <span>{activeModalFood.priceRange}</span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-dark-ink uppercase tracking-wider text-purple-900">
                  Về quán ăn này
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {activeModalFood.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-sm text-dark-ink uppercase tracking-wider text-purple-900">
                  Điểm nổi bật
                </h4>
                <div className="space-y-1.5">
                  {activeModalFood.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Food Tips */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <h4 className="font-bold text-xs text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Bí kíp ăn ngon của người Huế:</span>
                </h4>
                <div className="space-y-1 text-xs text-amber-950">
                  {activeModalFood.tips.map((tip, idx) => (
                    <p key={idx}>• {tip}</p>
                  ))}
                </div>
              </div>

              {/* Address & Contact Info Box */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs text-gray-700">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Địa chỉ:</span>
                    <span>{activeModalFood.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold">Giờ mở cửa:</span> {activeModalFood.openHours}
                  </div>
                </div>
                {activeModalFood.contactPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold">Liên hệ:</span> {activeModalFood.contactPhone}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveModalFood(null)}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    activeModalFood.googleMapsQuery
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#2D1B4E] hover:bg-[#3D2568] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Mở Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#D2F801]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnUongPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center font-ui text-gray-500">
          Đang tải dữ liệu ẩm thực Huế...
        </div>
      }
    >
      <AnUongContent />
    </Suspense>
  );
}
