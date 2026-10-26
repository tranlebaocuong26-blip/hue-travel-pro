"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import SubpageTopBar from "@/components/navigation/SubpageTopBar";
import Card from "@/components/common/Card";
import { ACCOMMODATIONS, Accommodation } from "@/data/accommodations";
import { searchAccommodations } from "@/lib/search";
import {
  Hotel,
  Home,
  Building2,
  Trees,
  MapPin,
  ExternalLink,
  Wifi,
  Coffee,
  Waves,
  Car,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

function LuuTruContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Đọc params từ URL
  const paramQ = searchParams.get("q") || "";
  const paramType = searchParams.get("type") || "all";
  const paramArea = searchParams.get("area") || "all";
  const paramAmenity = searchParams.get("amenity") || "all";
  const paramBudget = searchParams.get("budget") || "all";

  const [searchKeyword, setSearchKeyword] = useState<string>(paramQ);
  const [selectedType, setSelectedType] = useState<string>(paramType);
  const [selectedArea, setSelectedArea] = useState<string>(paramArea);
  const [selectedAmenity, setSelectedAmenity] = useState<string>(paramAmenity);
  const [selectedBudget, setSelectedBudget] = useState<string>(paramBudget);

  // Đồng bộ khi URL thay đổi
  useEffect(() => {
    setSearchKeyword(searchParams.get("q") || "");
    setSelectedType(searchParams.get("type") || "all");
    setSelectedArea(searchParams.get("area") || "all");
    setSelectedAmenity(searchParams.get("amenity") || "all");
    setSelectedBudget(searchParams.get("budget") || "all");
  }, [searchParams]);

  const updateUrl = (
    newParams: {
      q?: string;
      type?: string;
      area?: string;
      amenity?: string;
      budget?: string;
    },
    action: "push" | "replace" = "push"
  ) => {
    const params = new URLSearchParams();
    const qVal = newParams.q !== undefined ? newParams.q : searchKeyword;
    const typeVal = newParams.type !== undefined ? newParams.type : selectedType;
    const areaVal = newParams.area !== undefined ? newParams.area : selectedArea;
    const amVal = newParams.amenity !== undefined ? newParams.amenity : selectedAmenity;
    const budVal = newParams.budget !== undefined ? newParams.budget : selectedBudget;

    if (qVal.trim()) params.set("q", qVal.trim());
    if (typeVal !== "all") params.set("type", typeVal);
    if (areaVal !== "all") params.set("area", areaVal);
    if (amVal !== "all") params.set("amenity", amVal);
    if (budVal !== "all") params.set("budget", budVal);

    const queryString = params.toString();
    const targetUrl = `/luu-tru${queryString ? `?${queryString}` : ""}`;
    if (action === "push") {
      router.push(targetUrl, { scroll: false });
    } else {
      router.replace(targetUrl, { scroll: false });
    }
  };

  const resetFilters = () => {
    setSearchKeyword("");
    setSelectedType("all");
    setSelectedArea("all");
    setSelectedAmenity("all");
    setSelectedBudget("all");
    router.push("/luu-tru", { scroll: false });
  };

  // Tìm kiếm và lọc bằng searchAccommodations (tuân thủ quy tắc giá null)
  const searchResult = useMemo(() => {
    return searchAccommodations(ACCOMMODATIONS, {
      query: searchKeyword,
      type: selectedType,
      area: selectedArea,
      amenity: selectedAmenity,
      budget: selectedBudget,
    });
  }, [searchKeyword, selectedType, selectedArea, selectedAmenity, selectedBudget]);

  const { exactMatches, unknownPriceItems, totalCount } = searchResult;
  const isFiltered =
    searchKeyword.trim() !== "" ||
    selectedType !== "all" ||
    selectedArea !== "all" ||
    selectedAmenity !== "all" ||
    selectedBudget !== "all";

  return (
    <div className="space-y-8 min-w-0">
      {/* Top Search & Widgets (Tích hợp local search với URL query) */}
      <SubpageTopBar
        placeholder="Tìm homestay, khách sạn theo tên, khu vực (VD: Lucia, Tropikult, Mường Thanh, sông Hương)..."
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

      {/* Hero Header (05_LUU_TRU mockup) */}
      <div
        className="w-full rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 text-white bg-cover bg-center shadow-lg relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(37, 28, 57, 0.95) 0%, rgba(139, 92, 246, 0.7) 55%, rgba(37, 28, 57, 0.3) 100%), url('/images/heroes/hero_luu_tru.png')`,
          backgroundPosition: "right center",
          backgroundSize: "cover",
        }}
      >
        <div className="max-w-2xl space-y-2.5 sm:space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-warm-gold">
            <span>LƯU TRÚ</span>
            <div className="w-8 h-px bg-warm-gold/60" />
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight leading-tight">
            Nghỉ ngơi ở Huế
          </h1>

          <p className="text-white/85 text-xs sm:text-sm lg:text-base leading-relaxed">
            Những homestay xinh xắn, khách sạn tiện nghi và không gian lưu trú
            đầy cảm hứng cho hành trình của bạn.
          </p>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            {[
              { id: "all", label: "Tất cả" },
              { id: "homestay", label: "Homestay" },
              { id: "hotel", label: "Khách sạn" },
              { id: "resort", label: "Resort" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedType(cat.id);
                  updateUrl({ type: cat.id });
                }}
                className={`px-3.5 py-1.5 min-h-[36px] flex items-center rounded-full font-medium transition-colors text-xs ${
                  selectedType === cat.id
                    ? "bg-white text-dark-ink font-bold shadow-md"
                    : "bg-white/20 hover:bg-white/30 backdrop-blur-md text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Control Bar with URL persistence */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-3 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 w-full">
          {/* Loại hình */}
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              updateUrl({ type: e.target.value });
            }}
            aria-label="Loại hình lưu trú"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-purple-400 text-xs"
          >
            <option value="all">Loại hình: Tất cả</option>
            <option value="homestay">Homestay mộc mạc</option>
            <option value="hotel">Khách sạn tiện nghi</option>
            <option value="resort">Khu nghỉ dưỡng (Resort)</option>
          </select>

          {/* Khu vực */}
          <select
            value={selectedArea}
            onChange={(e) => {
              setSelectedArea(e.target.value);
              updateUrl({ area: e.target.value });
            }}
            aria-label="Khu vực lưu trú"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-purple-400 text-xs"
          >
            <option value="all">Khu vực: Tất cả</option>
            <option value="Trung tâm">Trung tâm TP. Huế</option>
            <option value="sông Hương">Ven sông Hương</option>
            <option value="Đại Nội">Gần Đại Nội / Thành Nội</option>
            <option value="Ngoại ô">Ngoại ô thanh bình</option>
          </select>

          {/* Ngân sách */}
          <select
            value={selectedBudget}
            onChange={(e) => {
              setSelectedBudget(e.target.value);
              updateUrl({ budget: e.target.value });
            }}
            aria-label="Khoảng giá phòng"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-purple-400 text-xs"
          >
            <option value="all">Khoảng giá: Tham khảo chung theo mùa</option>
            <option value="budget-standard">Phân khúc phổ thông (Cần kiểm chứng)</option>
            <option value="budget-luxury">Phân khúc cao cấp & resort (Cần kiểm chứng)</option>
            <option value="contact">Giá theo mùa & loại phòng</option>
          </select>

          {/* Tiện nghi */}
          <select
            value={selectedAmenity}
            onChange={(e) => {
              setSelectedAmenity(e.target.value);
              updateUrl({ amenity: e.target.value });
            }}
            aria-label="Tiện nghi lưu trú"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-purple-400 text-xs"
          >
            <option value="all">Tiện nghi: Tất cả</option>
            <option value="wifi">Có Wi-Fi tốc độ cao</option>
            <option value="coffee">Bữa sáng / Quán cà phê</option>
            <option value="pool">Có hồ bơi</option>
            <option value="parking">Bãi đỗ xe ô tô</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>
              Hiển thị <strong className="text-dark-ink font-bold">{totalCount}</strong> cơ sở lưu trú
            </span>
            {isFiltered && (
              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-semibold text-[10px]">
                Đang lọc
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 italic">
              * Đơn vị: VNĐ/phòng/đêm (Biến động theo thời điểm đặt)
            </span>
            {isFiltered && (
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

      {/* Gợi ý theo nhu cầu Row (5 Cards from Mockup - Tương tác URL) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold font-serif text-dark-ink flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-warm-gold" />
          <span>Gợi ý theo nhu cầu</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div
            onClick={() => {
              setSelectedType("homestay");
              setSelectedArea("Trung tâm");
              updateUrl({ type: "homestay", area: "Trung tâm" });
            }}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1 ${
              selectedType === "homestay" && selectedArea === "Trung tâm"
                ? "bg-amber-100 border-amber-300 ring-2 ring-amber-400/30"
                : "bg-amber-50/70 border-amber-100 hover:border-amber-300"
            }`}
          >
            <Home className="w-5 h-5 text-amber-700" />
            <h4 className="font-bold text-xs text-dark-ink">Homestay trung tâm</h4>
            <p className="text-[10px] text-gray-500">Ấm cúng, giá tốt</p>
          </div>

          <div
            onClick={() => {
              setSelectedType("hotel");
              updateUrl({ type: "hotel" });
            }}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1 ${
              selectedType === "hotel"
                ? "bg-blue-100 border-blue-300 ring-2 ring-blue-400/30"
                : "bg-blue-50/70 border-blue-100 hover:border-blue-300"
            }`}
          >
            <Building2 className="w-5 h-5 text-blue-700" />
            <h4 className="font-bold text-xs text-dark-ink">Khách sạn 3–5 sao</h4>
            <p className="text-[10px] text-gray-500">Tiện nghi, view đẹp</p>
          </div>

          <div
            onClick={() => {
              setSelectedArea("sông Hương");
              updateUrl({ area: "sông Hương" });
            }}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1 ${
              selectedArea === "sông Hương"
                ? "bg-teal-100 border-teal-300 ring-2 ring-teal-400/30"
                : "bg-teal-50/70 border-teal-100 hover:border-teal-300"
            }`}
          >
            <Waves className="w-5 h-5 text-teal-700" />
            <h4 className="font-bold text-xs text-dark-ink">Ven sông Hương</h4>
            <p className="text-[10px] text-gray-500">Thư giãn, thơ mộng</p>
          </div>

          <div
            onClick={() => {
              setSelectedAmenity("wifi");
              updateUrl({ amenity: "wifi" });
            }}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1 ${
              selectedAmenity === "wifi"
                ? "bg-purple-100 border-purple-300 ring-2 ring-purple-400/30"
                : "bg-purple-50/70 border-purple-100 hover:border-purple-300"
            }`}
          >
            <Hotel className="w-5 h-5 text-purple-700" />
            <h4 className="font-bold text-xs text-dark-ink">Cho gia đình</h4>
            <p className="text-[10px] text-gray-500">Phòng rộng, tiện nghi</p>
          </div>

          <div
            onClick={() => {
              setSelectedType("resort");
              updateUrl({ type: "resort" });
            }}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1 ${
              selectedType === "resort"
                ? "bg-rose-100 border-rose-300 ring-2 ring-rose-400/30"
                : "bg-rose-50/70 border-rose-100 hover:border-rose-300"
            }`}
          >
            <Trees className="w-5 h-5 text-rose-700" />
            <h4 className="font-bold text-xs text-dark-ink">Resort sinh thái</h4>
            <p className="text-[10px] text-gray-500">Không gian xanh</p>
          </div>
        </div>
      </div>

      {/* Main Grid + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Accommodation Cards */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-serif text-dark-ink flex items-center gap-2">
              <Hotel className="w-5 h-5 text-amber-700" />
              <span>Danh sách lưu trú</span>
              <span className="text-xs font-normal text-gray-400 font-sans ml-2">
                ({totalCount} cơ sở)
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
              <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <HelpCircle className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold font-serif text-dark-ink">
                  Không tìm thấy cơ sở lưu trú phù hợp
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  Không có homestay, khách sạn hay resort nào khớp với tiêu chí tìm kiếm hoặc tiện nghi bạn đã chọn. Hãy thử xóa bớt bộ lọc hoặc nhập tên khác.
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
              {/* Danh sách cơ sở lưu trú hiển thị chuẩn */}
              {exactMatches.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {exactMatches.map((item: Accommodation) => (
                    <Card
                      key={item.id}
                      className="group p-5 border border-gray-100 hover:shadow-lg transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              href={`/luu-tru/${item.slug}`}
                              className="font-bold text-dark-ink text-base group-hover:text-deep-violet transition-colors cursor-pointer"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              <span>{item.location}</span>
                            </p>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                            {item.typeLabel}
                          </span>
                        </div>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.amenities.map((amenity, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px]"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>

                        {/* Price format VNĐ/phòng/đêm per REQ-05 */}
                        <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100/80 flex items-center justify-between">
                          <span className="text-[11px] text-gray-500">Giá tham khảo:</span>
                          <span className="text-xs font-bold text-amber-900">
                            {item.price.displayLabel}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-gray-400 truncate max-w-[120px] sm:max-w-[160px]">
                          Nguồn: {item.source}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            href={`/luu-tru/${item.slug}`}
                            className="px-2.5 py-1 rounded-full bg-deep-violet text-white text-xs font-semibold hover:bg-opacity-90 transition-colors"
                          >
                            Chi tiết
                          </Link>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              `${item.name} Huế`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-500 hover:text-deep-violet flex items-center gap-0.5"
                          >
                            <span>Vị trí</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Tách riêng nhóm Chưa Rõ Giá khi người dùng lọc ngân sách (BẮT BUỘC SECTION 06) */}
              {unknownPriceItems.length > 0 && (
                <div className="pt-4 space-y-3">
                  <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs space-y-1.5">
                    <div className="font-bold text-amber-900 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Nhóm cơ sở lưu trú chưa có bảng giá kiểm chứng riêng ({unknownPriceItems.length} cơ sở)</span>
                    </div>
                    <p className="text-amber-800 text-[11px] leading-relaxed">
                      Toàn bộ 8 cơ sở lưu trú tại Huế có mức giá phòng biến động linh hoạt theo mùa du lịch và loại phòng. Theo quy định Master Spec, hệ thống không tự ý đưa vào mức ngân sách cố định và yêu cầu liên hệ trực tiếp cơ sở để nhận báo giá chính xác.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {unknownPriceItems.map((item: Accommodation) => (
                      <Card
                        key={item.id}
                        className="group p-5 border border-amber-100 bg-amber-50/20 hover:shadow-lg transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <Link
                                href={`/luu-tru/${item.slug}`}
                                className="font-bold text-dark-ink text-base group-hover:text-deep-violet transition-colors"
                              >
                                {item.name}
                              </Link>
                              <p className="text-xs text-gray-500 mt-0.5">{item.location}</p>
                            </div>
                            <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                              Chưa rõ giá
                            </span>
                          </div>

                          <div className="p-3 rounded-2xl bg-white border border-amber-200 flex items-center justify-between">
                            <span className="text-[11px] text-gray-500">Mức giá:</span>
                            <span className="text-xs font-bold text-amber-900">
                              {item.price.displayLabel}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[10px] text-gray-400">Tham khảo</span>
                          <Link
                            href={`/luu-tru/${item.slug}`}
                            className="px-3 py-1 rounded-full bg-deep-violet text-white text-xs font-semibold"
                          >
                            Chi tiết
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

        {/* Right Column (4 cols): Quick Amenities & Guidelines */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tiện nghi phổ biến */}
          <Card className="p-5 border border-gray-100 space-y-3">
            <h3 className="font-bold text-dark-ink text-sm">Tiện nghi phổ biến</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <button
                type="button"
                onClick={() => {
                  setSelectedAmenity("wifi");
                  updateUrl({ amenity: "wifi" });
                }}
                className={`flex items-center gap-2 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                  selectedAmenity === "wifi" ? "bg-purple-100 font-bold" : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <Wifi className="w-4 h-4 text-deep-violet" />
                <span>Wi-Fi tốc độ cao</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedAmenity("coffee");
                  updateUrl({ amenity: "coffee" });
                }}
                className={`flex items-center gap-2 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                  selectedAmenity === "coffee" ? "bg-amber-100 font-bold" : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <Coffee className="w-4 h-4 text-amber-700" />
                <span>Bữa sáng kèm phòng</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedAmenity("pool");
                  updateUrl({ amenity: "pool" });
                }}
                className={`flex items-center gap-2 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                  selectedAmenity === "pool" ? "bg-blue-100 font-bold" : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <Waves className="w-4 h-4 text-blue-600" />
                <span>Hồ bơi ngoài trời</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedAmenity("parking");
                  updateUrl({ amenity: "parking" });
                }}
                className={`flex items-center gap-2 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                  selectedAmenity === "parking" ? "bg-emerald-100 font-bold" : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <Car className="w-4 h-4 text-emerald-600" />
                <span>Bãi đỗ xe ô tô</span>
              </button>
            </div>
          </Card>

          {/* Kinh nghiệm đặt phòng */}
          <Card className="p-5 border border-gray-100 space-y-3">
            <h3 className="font-bold text-dark-ink text-sm flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-amber-600" />
              <span>Kinh nghiệm đặt phòng ở Huế</span>
            </h3>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Nên đặt sớm vào mùa cao điểm (tháng 3 – tháng 8 và các dịp Festival).</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Ưu tiên cơ sở có hình ảnh thực tế và đánh giá minh bạch.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Kiểm tra chính sách hủy phòng và giờ nhận/trả phòng.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Liên hệ trực tiếp cơ sở để nhận giá ưu đãi khi ở dài ngày.</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function LuuTruPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-500 text-sm">
          Đang tải trang Lưu trú...
        </div>
      }
    >
      <LuuTruContent />
    </Suspense>
  );
}
