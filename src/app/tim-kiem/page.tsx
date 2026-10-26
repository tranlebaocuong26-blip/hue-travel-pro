"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/common/Card";
import { globalSearch } from "@/lib/search";
import { Place, RentalProvider, Accommodation } from "@/types/content";
import {
  Search,
  Compass,
  Bike,
  Building2,
  MapPin,
  ChevronRight,
  Sparkles,
  RotateCcw,
  HelpCircle,
} from "lucide-react";

function TimKiemContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Đọc query params từ URL
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = (searchParams.get("category") as
    | "all"
    | "places"
    | "rentals"
    | "accommodations") || "all";

  const [queryInput, setQueryInput] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<
    "all" | "places" | "rentals" | "accommodations"
  >(initialCategory);

  // Đồng bộ khi URL thay đổi (Back / Forward)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const cat = (searchParams.get("category") as
      | "all"
      | "places"
      | "rentals"
      | "accommodations") || "all";
    setQueryInput(q);
    setActiveCategory(cat);
  }, [searchParams]);

  // Cập nhật URL khi thay đổi query hoặc tab
  const updateUrl = (
    newQuery: string,
    newCategory: "all" | "places" | "rentals" | "accommodations",
    action: "push" | "replace" = "push"
  ) => {
    const params = new URLSearchParams();
    if (newQuery.trim()) {
      params.set("q", newQuery.trim());
    }
    if (newCategory !== "all") {
      params.set("category", newCategory);
    }
    const queryString = params.toString();
    const targetUrl = `/tim-kiem${queryString ? `?${queryString}` : ""}`;
    if (action === "push") {
      router.push(targetUrl, { scroll: false });
    } else {
      router.replace(targetUrl, { scroll: false });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(queryInput, activeCategory, "push");
  };

  const handleCategoryChange = (
    cat: "all" | "places" | "rentals" | "accommodations"
  ) => {
    setActiveCategory(cat);
    updateUrl(queryInput, cat, "push");
  };

  const handleClear = () => {
    setQueryInput("");
    setActiveCategory("all");
    router.push("/tim-kiem", { scroll: false });
  };

  // Thực hiện tìm kiếm
  const searchResults = useMemo(() => {
    return globalSearch(queryInput, activeCategory);
  }, [queryInput, activeCategory]);

  const hasSearched = queryInput.trim().length > 0;
  const { places, rentals, accommodations, totalCount } = searchResults;

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      {/* 1. Header Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-deep-violet/10 text-deep-violet text-xs font-semibold uppercase tracking-wider">
            <Search className="w-3.5 h-3.5" />
            <span>Tìm kiếm toàn site (GATE 05)</span>
          </div>

          <Link
            href="/"
            className="text-xs font-medium text-gray-500 hover:text-deep-violet flex items-center gap-1 transition-colors"
          >
            <span>Về Trang chủ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-dark-ink">
            Tìm kiếm thông tin du lịch Huế
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Tra cứu đồng thời danh lam thắng cảnh, đơn vị thuê xe máy và cơ sở lưu trú. Hỗ trợ gõ tiếng Việt có dấu và không dấu.
          </p>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="pt-2">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={queryInput}
              onChange={(e) => {
                setQueryInput(e.target.value);
                updateUrl(e.target.value, activeCategory, "replace");
              }}
              placeholder="Nhập tên điểm đến, di tích, loại xe, homestay (VD: Đại Nội, dai noi, xe ga, homestay)..."
              aria-label="Tìm kiếm toàn hệ thống"
              className="w-full bg-gray-50 pl-11 sm:pl-12 pr-24 sm:pr-28 py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm text-dark-ink placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-deep-violet/30 focus:border-deep-violet transition-all min-h-[48px]"
            />
            {queryInput && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 px-3 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold transition-colors"
              >
                Xóa tìm
              </button>
            )}
          </div>
        </form>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-gray-400 text-[11px] sm:text-xs">Từ khóa gợi ý:</span>
          {[
            "Đại Nội",
            "dai noi",
            "Chùa Thiên Mụ",
            "Camping",
            "Xe ga",
            "Homestay",
            "Lăng Cô",
          ].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setQueryInput(tag);
                updateUrl(tag, activeCategory);
              }}
              className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-deep-violet/10 hover:text-deep-violet text-gray-600 text-[11px] transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200/80 pb-3">
        <button
          type="button"
          onClick={() => handleCategoryChange("all")}
          className={`px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeCategory === "all"
              ? "bg-deep-violet text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-100"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Tất cả danh mục</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeCategory === "all"
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {totalCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleCategoryChange("places")}
          className={`px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeCategory === "places"
              ? "bg-deep-violet text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-100"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Điểm khám phá</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeCategory === "places"
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {places.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleCategoryChange("rentals")}
          className={`px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeCategory === "rentals"
              ? "bg-deep-violet text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-100"
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Thuê xe máy</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeCategory === "rentals"
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {rentals.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleCategoryChange("accommodations")}
          className={`px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeCategory === "accommodations"
              ? "bg-deep-violet text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-100"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Lưu trú</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeCategory === "accommodations"
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {accommodations.length}
          </span>
        </button>
      </div>

      {/* 3. Search Results State */}
      {totalCount === 0 ? (
        /* Empty State */
        <Card className="p-8 sm:p-12 text-center bg-white border border-gray-100 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <HelpCircle className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold font-serif text-dark-ink">
              Không tìm thấy kết quả phù hợp
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              {hasSearched ? (
                <>
                  Không có nội dung nào khớp với từ khóa{" "}
                  <strong className="text-dark-ink font-semibold">
                    &ldquo;{queryInput}&rdquo;
                  </strong>
                  . Vui lòng thử tìm kiếm bằng tiếng Việt không dấu (VD:{" "}
                  <em>dai noi</em>, <em>thien an</em>), kiểm tra lại chính tả hoặc chọn danh mục khác.
                </>
              ) : (
                "Vui lòng nhập từ khóa để bắt đầu tra cứu thông tin du lịch Huế."
              )}
            </p>
          </div>

          {hasSearched && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-deep-violet text-white text-xs font-semibold hover:bg-opacity-95 shadow-sm transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xóa từ khóa & Xem tất cả</span>
              </button>
            </div>
          )}
        </Card>
      ) : (
        /* Results Lists Grouped by Category */
        <div className="space-y-10">
          {/* Nhóm 1: Điểm Khám Phá */}
          {(activeCategory === "all" || activeCategory === "places") &&
            places.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h2 className="text-lg font-bold font-serif text-dark-ink flex items-center gap-2">
                    <Compass className="w-5 h-5 text-deep-violet" />
                    <span>Điểm khám phá & di tích</span>
                    <span className="text-xs font-normal text-gray-400 font-sans">
                      ({places.length} kết quả)
                    </span>
                  </h2>
                  <Link
                    href="/kham-pha"
                    className="text-xs font-semibold text-deep-violet hover:underline flex items-center gap-1"
                  >
                    <span>Trang Khám phá</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {places.map((place: Place) => (
                    <Card
                      key={place.id}
                      className="p-4 border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/kham-pha/${place.slug}`}
                            className="font-bold text-dark-ink text-sm sm:text-base hover:text-deep-violet transition-colors line-clamp-1"
                          >
                            {place.name}
                          </Link>
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold uppercase shrink-0">
                            {place.categoryLabel}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{place.location}</span>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {place.summary}
                        </p>

                        <div className="p-2 rounded-xl bg-purple-50/70 border border-purple-100 text-[11px] flex items-center justify-between">
                          <span className="text-gray-500">Giá vé:</span>
                          <span className="font-bold text-deep-violet">
                            {place.price.displayLabel}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">
                          {place.verificationStatus === "verified"
                            ? "✓ Đã xác minh"
                            : "○ Tham khảo"}
                        </span>
                        <Link
                          href={`/kham-pha/${place.slug}`}
                          className="px-3 py-1 rounded-full bg-deep-violet/10 text-deep-violet hover:bg-deep-violet hover:text-white text-xs font-semibold transition-colors"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}

          {/* Nhóm 2: Thuê Xe Máy */}
          {(activeCategory === "all" || activeCategory === "rentals") &&
            rentals.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h2 className="text-lg font-bold font-serif text-dark-ink flex items-center gap-2">
                    <Bike className="w-5 h-5 text-orange-600" />
                    <span>Cơ sở thuê xe máy</span>
                    <span className="text-xs font-normal text-gray-400 font-sans">
                      ({rentals.length} kết quả)
                    </span>
                  </h2>
                  <Link
                    href="/cam-nang#thue-xe-danh-sach"
                    className="text-xs font-semibold text-orange-600 hover:underline flex items-center gap-1"
                  >
                    <span>Trang Di chuyển</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rentals.map((rental: RentalProvider) => (
                    <Card
                      key={rental.id}
                      className="p-4 border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/cam-nang/thue-xe/${rental.slug}`}
                            className="font-bold text-dark-ink text-sm sm:text-base hover:text-orange-600 transition-colors line-clamp-1"
                          >
                            {rental.name}
                          </Link>
                          <span className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 text-[10px] font-bold shrink-0">
                            Thuê xe
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{rental.location}</span>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {rental.summary}
                        </p>

                        <div className="p-2 rounded-xl bg-orange-50/70 border border-orange-100 text-[11px] flex items-center justify-between">
                          <span className="text-gray-500">Mức giá:</span>
                          <span className="font-bold text-orange-700">
                            {rental.price.displayLabel}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">
                          Nguồn: MOTOGO
                        </span>
                        <Link
                          href={`/cam-nang/thue-xe/${rental.slug}`}
                          className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-600 hover:text-white text-xs font-semibold transition-colors"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}

          {/* Nhóm 3: Cơ Sở Lưu Trú */}
          {(activeCategory === "all" || activeCategory === "accommodations") &&
            accommodations.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h2 className="text-lg font-bold font-serif text-dark-ink flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-700" />
                    <span>Cơ sở lưu trú</span>
                    <span className="text-xs font-normal text-gray-400 font-sans">
                      ({accommodations.length} kết quả)
                    </span>
                  </h2>
                  <Link
                    href="/luu-tru"
                    className="text-xs font-semibold text-purple-700 hover:underline flex items-center gap-1"
                  >
                    <span>Trang Lưu trú</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {accommodations.map((item: Accommodation) => (
                    <Card
                      key={item.id}
                      className="p-4 border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/luu-tru/${item.slug}`}
                            className="font-bold text-dark-ink text-sm sm:text-base hover:text-purple-700 transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold uppercase shrink-0">
                            {item.typeLabel}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {item.summary}
                        </p>

                        <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-100 text-[11px] flex items-center justify-between">
                          <span className="text-gray-500">Giá phòng:</span>
                          <span className="font-bold text-amber-800">
                            {item.price.displayLabel}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">
                          {item.typeLabel} · Tham khảo
                        </span>
                        <Link
                          href={`/luu-tru/${item.slug}`}
                          className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-700 hover:text-white text-xs font-semibold transition-colors"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}
        </div>
      )}
    </div>
  );
}

export default function TimKiemPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-500 text-sm">
          Đang tải dữ liệu tìm kiếm...
        </div>
      }
    >
      <TimKiemContent />
    </Suspense>
  );
}
