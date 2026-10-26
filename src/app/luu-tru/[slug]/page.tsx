import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ACCOMMODATIONS } from "@/data/accommodations";
import {
  MapPin,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Hotel,
  Info,
  AlertCircle,
  Bed,
} from "lucide-react";

interface AccommodationDetailPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return ACCOMMODATIONS.map((a) => ({
    slug: a.slug,
  }));
}

export default function AccommodationDetailPage({
  params,
}: AccommodationDetailPageProps) {
  const item = ACCOMMODATIONS.find((a) => a.slug === params.slug);

  if (!item) {
    notFound();
  }

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    item.googleMapsQuery
  )}`;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto whitespace-nowrap py-1"
      >
        <Link
          href="/"
          className="hover:text-deep-violet transition-colors flex items-center gap-1 shrink-0"
        >
          <span>Trang chủ</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
        <Link
          href="/luu-tru"
          className="hover:text-deep-violet transition-colors flex items-center gap-1 shrink-0"
        >
          <span>Lưu trú</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
        <span className="text-gray-400 shrink-0">{item.typeLabel}</span>
        <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
        <span className="text-dark-ink font-semibold truncate max-w-[200px] sm:max-w-none">
          {item.name}
        </span>
      </nav>

      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <Link
          href="/luu-tru"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-deep-violet hover:border-deep-violet/30 text-xs font-semibold shadow-xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách lưu trú</span>
        </Link>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-deep-violet text-white hover:bg-opacity-95 text-xs font-semibold shadow-xs transition-all"
        >
          <MapPin className="w-4 h-4 text-warm-gold" />
          <span>Mở vị trí cơ sở trên Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>

      {/* 2 & 3. Hero Visual & Title Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#251C39] via-[#513568] to-[#251C39] text-white shadow-xl p-6 sm:p-10">
        <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-warm-gold text-dark-ink text-xs font-bold tracking-wider uppercase shadow-sm">
              {item.typeLabel}
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/90 text-white text-xs font-semibold backdrop-blur-md">
              <Info className="w-3.5 h-3.5" />
              <span>Dữ liệu tham khảo du lịch</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight leading-tight">
            {item.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/90">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-warm-gold shrink-0" />
              <span>{item.area}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Hotel className="w-4 h-4 text-warm-gold shrink-0" />
              <span>{item.typeLabel} tại Huế</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Description, Amenities, Features */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          {/* Summary Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Tóm lược cơ sở
            </span>
            <p className="text-base sm:text-lg text-dark-ink font-serif italic leading-relaxed">
              &ldquo;{item.summary}&rdquo;
            </p>
          </div>

          {/* 4. Full Description */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-dark-ink flex items-center gap-2.5">
              <Hotel className="w-5 h-5 text-deep-violet" />
              <span>Giới thiệu không gian nghỉ dưỡng</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* 6. Amenities & Highlights */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-dark-ink flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-warm-gold" />
              <span>Đặc điểm nổi bật & tiện ích</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {item.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FAFAFC] border border-gray-100/80 flex items-start gap-3 hover:bg-white hover:shadow-xs transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-deep-violet/10 text-deep-violet flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Room Types (if present) */}
          {item.roomTypes && item.roomTypes.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-dark-ink flex items-center gap-2.5">
                <Bed className="w-5 h-5 text-deep-violet" />
                <span>Các hạng phòng tham khảo</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.roomTypes.map((room, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F2C675]/30 flex items-center gap-3 text-xs sm:text-sm text-dark-ink font-semibold"
                  >
                    <span className="w-2 h-2 rounded-full bg-warm-gold shrink-0" />
                    <span>{room}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 mt-4">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Khuyến cáo:</strong> HUẾ TRAVEL PRO là nền tảng cẩm nang thông tin phi thương mại, không cung cấp tính năng đặt phòng hay thu hộ thanh toán trực tuyến. Để đảm bảo quyền lợi và kiểm tra phòng trống thực tế, du khách vui lòng liên hệ các kênh đại lý du lịch chính thức hoặc kênh tiếp nhận khách của cơ sở.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Information Card & Provenance */}
        <div className="lg:col-span-4 space-y-6">
          {/* Practical Info Card */}
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-5">
            <h3 className="font-bold font-serif text-dark-ink text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-deep-violet" />
              <span>Thông tin tham khảo</span>
            </h3>

            <div className="space-y-4 text-xs sm:text-sm divide-y divide-gray-100">
              <div className="pt-2 first:pt-0 space-y-1">
                <span className="text-gray-400 block text-xs">Phân loại hình thức:</span>
                <span className="font-semibold text-dark-ink block">
                  {item.typeLabel}
                </span>
              </div>

              <div className="pt-3 space-y-1">
                <span className="text-gray-400 block text-xs">Vị trí khu vực:</span>
                <span className="font-semibold text-dark-ink block">
                  {item.area}
                </span>
              </div>

              <div className="pt-3 space-y-1">
                <span className="text-gray-400 block text-xs">Mức giá tham khảo:</span>
                <span className="font-bold text-amber-900 block">
                  {item.price.displayLabel}
                </span>
              </div>

              <div className="pt-3 space-y-1">
                <span className="text-gray-400 block text-xs">Tiện nghi chính:</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {item.amenities.map((a, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* External Google Maps Button */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-deep-violet text-white text-xs sm:text-sm font-semibold hover:bg-opacity-95 shadow-sm transition-all"
            >
              <MapPin className="w-4 h-4 text-warm-gold" />
              <span>Xem vị trí trên Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 7 & 8. Data Provenance & Verification Badge */}
          <div className="p-6 rounded-3xl bg-[#FFF9F2] border border-[#F2C675]/40 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Nguồn & Tình trạng dữ liệu</span>
            </div>

            <div className="space-y-2 text-xs text-amber-950/80 leading-relaxed">
              <p>
                <strong className="text-amber-950">Trạng thái: </strong>
                <span className="text-amber-700 font-semibold">Dữ liệu tham khảo thị trường</span>
              </p>

              <p>
                <strong className="text-amber-950">Nguồn dữ liệu: </strong>
                <span>{item.source}</span>
              </p>

              {item.checkedDate && (
                <p>
                  <strong className="text-amber-950">Ngày kiểm tra: </strong>
                  <span>{item.checkedDate}</span>
                </p>
              )}

              {item.sourceExcerpt && (
                <div className="p-2.5 rounded-xl bg-white/70 border border-amber-200/60 text-[11px] text-amber-950 leading-relaxed italic">
                  &ldquo;{item.sourceExcerpt}&rdquo;
                </div>
              )}

              <p className="text-[11px] text-amber-900/70 pt-1 border-t border-amber-200/60">
                {item.verificationNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
