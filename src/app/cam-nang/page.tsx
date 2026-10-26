"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import SubpageTopBar from "@/components/navigation/SubpageTopBar";
import Card from "@/components/common/Card";
import { RENTAL_PROVIDERS, RentalProvider } from "@/data/rentals";
import { searchRentals } from "@/lib/search";
import {
  Bike,
  Bus,
  ShieldCheck,
  Lightbulb,
  CheckCircle2,
  MapPin,
  ExternalLink,
  PhoneCall,
  CloudRain,
  HelpCircle,
  Briefcase,
  Navigation as NavIcon,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

function CamNangContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Đọc params từ URL
  const paramQ = searchParams.get("q") || "";
  const paramVehicle = searchParams.get("vehicle") || "all";
  const paramArea = searchParams.get("area") || "all";
  const paramBudget = searchParams.get("budget") || "all";

  const [searchKeyword, setSearchKeyword] = useState<string>(paramQ);
  const [selectedType, setSelectedType] = useState<string>(paramVehicle);
  const [selectedArea, setSelectedArea] = useState<string>(paramArea);
  const [selectedBudget, setSelectedBudget] = useState<string>(paramBudget);

  // Đồng bộ khi URL thay đổi
  useEffect(() => {
    setSearchKeyword(searchParams.get("q") || "");
    setSelectedType(searchParams.get("vehicle") || "all");
    setSelectedArea(searchParams.get("area") || "all");
    setSelectedBudget(searchParams.get("budget") || "all");
  }, [searchParams]);

  const updateUrl = (
    newParams: {
      q?: string;
      vehicle?: string;
      area?: string;
      budget?: string;
    },
    action: "push" | "replace" = "push"
  ) => {
    const params = new URLSearchParams();
    const qVal = newParams.q !== undefined ? newParams.q : searchKeyword;
    const vehVal = newParams.vehicle !== undefined ? newParams.vehicle : selectedType;
    const areaVal = newParams.area !== undefined ? newParams.area : selectedArea;
    const budVal = newParams.budget !== undefined ? newParams.budget : selectedBudget;

    if (qVal.trim()) params.set("q", qVal.trim());
    if (vehVal !== "all") params.set("vehicle", vehVal);
    if (areaVal !== "all") params.set("area", areaVal);
    if (budVal !== "all") params.set("budget", budVal);

    const queryString = params.toString();
    const targetUrl = `/cam-nang${queryString ? `?${queryString}` : ""}`;
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
    setSelectedBudget("all");
    router.push("/cam-nang", { scroll: false });
  };

  // Tìm kiếm và lọc bằng searchRentals (tuân thủ quy tắc giá null)
  const searchResult = useMemo(() => {
    return searchRentals(RENTAL_PROVIDERS, {
      query: searchKeyword,
      vehicleType: selectedType,
      area: selectedArea,
      budget: selectedBudget,
    });
  }, [searchKeyword, selectedType, selectedArea, selectedBudget]);

  const { exactMatches, unknownPriceItems, totalCount } = searchResult;
  const isFiltered =
    searchKeyword.trim() !== "" ||
    selectedType !== "all" ||
    selectedArea !== "all" ||
    selectedBudget !== "all";

  return (
    <div className="space-y-8 min-w-0">
      {/* Top Search & Widgets (Tích hợp local search với URL query) */}
      <SubpageTopBar
        placeholder="Tìm đơn vị thuê xe máy, loại xe, khu vực nhận xe (VD: Đồng Xanh, Kevin, xe ga)..."
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

      {/* Hero Header (04_CAM_NANG mockup) */}
      <div
        className="w-full rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 text-white bg-cover bg-center shadow-lg relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(37, 28, 57, 0.82) 0%, rgba(37, 28, 57, 0.55) 55%, rgba(37, 28, 57, 0.08) 100%), url('/images/heroes/hero_di_chuyen.png')`,
          backgroundPosition: "right 90%",
          backgroundSize: "cover",
        }}
      >
        <div className="max-w-2xl space-y-2.5 sm:space-y-3">
          <h1 className="text-[23px] sm:text-[27px] lg:text-[33px] font-bold font-editorial tracking-tight leading-snug text-white max-w-xl">
            Đi sao cho tiện, thuê xe sao cho dễ, chuẩn bị gì cho chuyến đi tự túc
            an toàn và chủ động.
          </h1>

          {/* Category Chips (Đồng bộ theo phong cách Lưu trú Hình 2 & Gợi ý tìm kiếm Hình 3) */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 text-xs">
            <span className="text-white/70 text-[11px] sm:text-xs shrink-0">Gợi ý tìm kiếm:</span>
            {[
              { id: "all", label: "Tất cả" },
              { id: "oto", label: "Xe ô tô" },
              { id: "gan-may", label: "Xe gắn máy" },
              { id: "xe-ga", label: "Xe ga" },
              { id: "dien", label: "Xe máy điện" },
              { id: "xe-dap", label: "Xe đạp" },
              { id: "cong-cong", label: "Phương tiện công cộng" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedType(cat.id);
                  updateUrl({ vehicle: cat.id });
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

      {/* 4 Category Cards - Responsive 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        <div
          onClick={() => {
            setSelectedType("all");
            updateUrl({ vehicle: "all" });
          }}
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 border border-orange-100 hover:border-orange-300 transition-colors cursor-pointer bg-orange-50/40 min-h-[68px] min-w-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Bike className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 w-full">
            <h4 className="font-bold text-xs sm:text-sm text-dark-ink truncate">Thuê xe tự lái</h4>
            <span className="text-[10px] sm:text-[11px] text-gray-500 block truncate">Đa dạng xe ga, xe số</span>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 border border-blue-100 hover:border-blue-300 transition-colors cursor-pointer bg-blue-50/40 min-h-[68px] min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Bus className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 w-full">
            <h4 className="font-bold text-xs sm:text-sm text-dark-ink truncate">Di chuyển nội thành</h4>
            <span className="text-[10px] sm:text-[11px] text-gray-500 block truncate">Xe buýt, taxi công nghệ</span>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 border border-emerald-100 hover:border-emerald-300 transition-colors cursor-pointer bg-emerald-50/40 min-h-[68px] min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 w-full">
            <h4 className="font-bold text-xs sm:text-sm text-dark-ink truncate">Lưu ý khi thuê xe</h4>
            <span className="text-[10px] sm:text-[11px] text-gray-500 block truncate">Hợp đồng, tiền cọc</span>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 border border-purple-100 hover:border-purple-300 transition-colors cursor-pointer bg-purple-50/40 min-h-[68px] min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 w-full">
            <h4 className="font-bold text-xs sm:text-sm text-dark-ink truncate">Mẹo cho người mới</h4>
            <span className="text-[10px] sm:text-[11px] text-gray-500 block truncate">Kinh nghiệm bản địa</span>
          </div>
        </div>
      </div>

      {/* Filter Bar with URL synchronization */}
      <div id="thue-xe-danh-sach" className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-3 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full">
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              updateUrl({ vehicle: e.target.value });
            }}
            aria-label="Loại xe"
            className="w-full min-w-0 min-h-[44px] px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-orange-400 text-xs truncate"
          >
            <option value="all">Loại xe: Tất cả</option>
            <option value="oto">Xe ô tô</option>
            <option value="gan-may">Xe gắn máy</option>
            <option value="xe-ga">Xe ga</option>
            <option value="dien">Xe máy điện</option>
            <option value="xe-dap">Xe đạp</option>
            <option value="cong-cong">Phương tiện công cộng</option>
          </select>

          <select
            value={selectedArea}
            onChange={(e) => {
              setSelectedArea(e.target.value);
              updateUrl({ area: e.target.value });
            }}
            aria-label="Khu vực nhận xe"
            className="w-full min-w-0 min-h-[44px] px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-orange-400 text-xs truncate"
          >
            <option value="all">Khu vực nhận xe: Tất cả</option>
            <option value="TP. Huế">Trung tâm TP. Huế</option>
            <option value="Ga Huế">Khu vực Ga tàu Huế</option>
            <option value="Khu phố Tây">Khu phố Tây</option>
            <option value="Phú Bài">Sân bay Phú Bài</option>
          </select>

          {/* Budget filter handling null prices */}
          <select
            value={selectedBudget}
            onChange={(e) => {
              setSelectedBudget(e.target.value);
              updateUrl({ budget: e.target.value });
            }}
            aria-label="Khoảng giá thuê xe"
            className="w-full min-w-0 min-h-[44px] px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-orange-400 text-xs truncate"
          >
            <option value="all">Khoảng giá: Tham khảo chung theo dòng xe</option>
            <option value="under-150k">Dưới 150.000đ/ngày (Cần kiểm chứng)</option>
            <option value="contact">Giá theo thỏa thuận (Chưa xác minh riêng)</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>
              Hiển thị <strong className="text-dark-ink font-bold">{totalCount}</strong> cơ sở thuê xe máy đối chiếu từ MOTOGO
            </span>
            {isFiltered && (
              <span className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 font-semibold text-[10px]">
                Đang lọc
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="italic text-gray-400">
              * Toàn bộ giá thuê phụ thuộc vào từng loại xe và thời điểm thuê thực tế
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

      {/* Main Grid + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Rentals List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-editorial text-dark-ink flex items-center gap-2">
              <Bike className="w-5 h-5 text-orange-500" />
              <span>Đơn vị thuê xe tham khảo</span>
              <span className="text-xs font-normal text-gray-400 font-sans ml-2">
                ({totalCount} cơ sở)
              </span>
            </h2>
            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-orange-600 hover:underline"
              >
                Xem tất cả ➔
              </button>
            )}
          </div>

          {/* Không tìm thấy kết quả */}
          {totalCount === 0 ? (
            <Card className="p-8 sm:p-12 text-center bg-white border border-gray-100 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <HelpCircle className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold font-editorial text-dark-ink">
                  Không tìm thấy cơ sở thuê xe phù hợp
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  Không có đơn vị thuê xe nào khớp với tiêu chí tìm kiếm hoặc khu vực đã chọn. Vui lòng thử lại với từ khóa khác hoặc xóa bộ lọc.
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
              {/* Danh sách cơ sở thuê xe hiển thị chuẩn */}
              {exactMatches.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {exactMatches.map((item: RentalProvider) => (
                    <Card
                      key={item.id}
                      className="group p-5 border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              href={`/cam-nang/thue-xe/${item.slug}`}
                              className="font-bold text-dark-ink text-base group-hover:text-orange-600 transition-colors cursor-pointer"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              <span>{item.location}</span>
                            </p>
                          </div>
                          <span className="px-2 py-1 rounded-lg bg-orange-50 text-orange-700 text-[10px] font-bold">
                            Tham khảo
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed">
                          {item.summary}
                        </p>

                        {/* Price note without false individual assignment */}
                        <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-100 flex items-center justify-between">
                          <span className="text-[11px] text-gray-500">Mức giá:</span>
                          <span className="text-xs font-bold text-orange-700">
                            {item.price.displayLabel}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.features.map((feat, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px]"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-400">
                        <span className="min-w-0 flex-1 basis-48 break-words">Nguồn: {item.source}</span>
                        <div className="flex shrink-0 items-center gap-2 whitespace-nowrap">
                          <Link
                            href={`/cam-nang/thue-xe/${item.slug}`}
                            className="shrink-0 whitespace-nowrap px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-600 hover:text-white font-semibold transition-colors"
                          >
                            Chi tiết
                          </Link>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              `${item.name} Huế`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-deep-violet font-semibold hover:underline"
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

              {/* Tách riêng nhóm Chưa Rõ Giá khi người dùng lọc ngân sách cụ thể (BẮT BUỘC SECTION 06) */}
              {unknownPriceItems.length > 0 && (
                <div className="pt-4 space-y-3">
                  <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs space-y-1.5">
                    <div className="font-bold text-amber-900 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Nhóm cơ sở chưa rõ mức giá niêm yết riêng ({unknownPriceItems.length} cơ sở)</span>
                    </div>
                    <p className="text-amber-800 text-[11px] leading-relaxed">
                      Toàn bộ 6 cơ sở thuê xe tại Huế hiện áp dụng biểu giá biến động theo thỏa thuận từng dòng xe (xe số, xe ga, xe côn tay) và chưa có bảng giá niêm yết cố định được kiểm chứng. Theo quy định Master Spec, hệ thống tách riêng nhóm này và không gán giá mặc định.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {unknownPriceItems.map((item: RentalProvider) => (
                      <Card
                        key={item.id}
                        className="group p-5 border border-amber-100 bg-amber-50/20 hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <Link
                                href={`/cam-nang/thue-xe/${item.slug}`}
                                className="font-bold text-dark-ink text-base group-hover:text-orange-600 transition-colors"
                              >
                                {item.name}
                              </Link>
                              <p className="text-xs text-gray-500 mt-0.5">{item.location}</p>
                            </div>
                            <span className="px-2 py-1 rounded-lg bg-amber-100 text-amber-800 text-[10px] font-bold">
                              Chưa rõ giá
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">{item.summary}</p>
                          <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-xs font-bold text-amber-900">
                            {item.price.displayLabel}
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                          <span className="text-[10px] text-gray-400">Tham khảo</span>
                          <Link
                            href={`/cam-nang/thue-xe/${item.slug}`}
                            className="px-3 py-1 rounded-full bg-deep-violet text-white font-semibold text-xs"
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

          {/* Bottom Guidelines (4 cards) */}
          <div className="pt-6 space-y-4">
            <h3 className="text-base font-bold font-editorial text-dark-ink flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Kinh nghiệm & lưu ý quan trọng</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Card className="p-4 bg-white border border-gray-100 space-y-1.5">
                <Briefcase className="w-5 h-5 text-deep-violet" />
                <h4 className="font-bold text-xs text-dark-ink">Cần mang gì?</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Giấy tờ tùy thân, GPLX, tiền mặt, điện thoại, áo mưa mỏng, kem chống nắng.
                </p>
              </Card>

              <Card className="p-4 bg-white border border-gray-100 space-y-1.5">
                <HelpCircle className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-xs text-dark-ink">Có nên thuê xe máy?</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Linh hoạt, chủ động lịch trình ngắm cảnh đồi lăng tẩm và bãi biển cố đô.
                </p>
              </Card>

              <Card className="p-4 bg-white border border-gray-100 space-y-1.5">
                <CloudRain className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-xs text-dark-ink">Khi đi trời mưa</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Huế mùa mưa đường trơn, kiểm tra phanh kỹ, đi chậm, mặc áo mưa bộ gọn gàng.
                </p>
              </Card>

              {/* Verified emergency numbers only per Correction Request 3 */}
              <Card className="p-4 bg-white border border-rose-100 bg-rose-50/30 space-y-1.5">
                <PhoneCall className="w-5 h-5 text-rose-600" />
                <h4 className="font-bold text-xs text-dark-ink">SĐT khẩn cấp</h4>
                <p className="text-[10px] text-gray-600 font-mono">
                  Công an: 113<br />
                  Cứu hộ y tế: 115<br />
                  <span className="text-gray-400 italic">Đầu số xác minh quốc gia</span>
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Checklist & Route Directions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Checklist thuê xe */}
          <Card className="p-5 border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-dark-ink text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Checklist thuê xe an toàn</span>
              </h3>
              <span className="text-[11px] text-emerald-700 font-semibold">Cần nhớ</span>
            </div>

            <div className="space-y-2.5 text-xs text-gray-600">
              {[
                "Chuẩn bị giấy tờ tùy thân (CCCD, GPLX phù hợp)",
                "Kiểm tra kỹ phanh trước/sau, đèn chiếu sáng, còi và gai lốp",
                "Đổ xăng đầy hoặc chụp đồng hồ xăng lúc nhận xe",
                "Yêu cầu mũ bảo hiểm đạt chuẩn có kính chắn gió",
                "Chụp ảnh toàn bộ xe trước khi nhận (tránh tranh chấp)",
                "Hỏi rõ tiền cọc, giờ trả xe và chính sách hỗ trợ sự cố đường",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Gợi ý hướng di chuyển (Đã ẩn cự ly số học chưa xác minh per Correction Request 3) */}
          <Card className="p-5 border border-gray-100 space-y-3">
            <h3 className="font-bold text-dark-ink text-sm flex items-center gap-2">
              <NavIcon className="w-4 h-4 text-deep-violet" />
              <span>Gợi ý hướng di chuyển</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-dark-ink block">Đại Nội Huế</span>
                  <span className="text-[10px] text-gray-400">Khu vực trung tâm bờ Bắc</span>
                </div>
                <span className="font-semibold text-deep-violet">Thuận tiện xe máy</span>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-dark-ink block">Biển Thuận An</span>
                  <span className="text-[10px] text-gray-400">Tuyến QL49 hướng biển Đông</span>
                </div>
                <span className="font-semibold text-blue-600">Đường nhựa thoáng</span>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-dark-ink block">Vườn QG Bạch Mã</span>
                  <span className="text-[10px] text-gray-400">Khu vực đèo núi phía Nam</span>
                </div>
                <span className="font-semibold text-emerald-600">Cần tay lái vững</span>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-dark-ink block">Dạo quanh bờ sông</span>
                  <span className="text-[10px] text-gray-400">Đường Lê Lợi, cầu gỗ lim</span>
                </div>
                <span className="font-semibold text-warm-gold">Thích hợp ngắm cảnh</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CamNangPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-500 text-sm">
          Đang tải trang Di chuyển...
        </div>
      }
    >
      <CamNangContent />
    </Suspense>
  );
}
