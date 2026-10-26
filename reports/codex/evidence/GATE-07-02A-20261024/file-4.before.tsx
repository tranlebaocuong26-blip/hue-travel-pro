import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RENTAL_PROVIDERS } from "@/data/rentals";
import {
  MapPin,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Bike,
  FileText,
  AlertCircle,
  Info,
} from "lucide-react";

interface RentalDetailPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return RENTAL_PROVIDERS.map((r) => ({
    slug: r.slug,
  }));
}

export default function RentalDetailPage({ params }: RentalDetailPageProps) {
  const rental = RENTAL_PROVIDERS.find((r) => r.slug === params.slug);

  if (!rental) {
    notFound();
  }

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    rental.googleMapsQuery
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
          href="/cam-nang"
          className="hover:text-deep-violet transition-colors flex items-center gap-1 shrink-0"
        >
          <span>Cẩm nang</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
        <span className="text-gray-400 shrink-0">Thuê xe máy</span>
        <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
        <span className="text-dark-ink font-semibold truncate max-w-[200px] sm:max-w-none">
          {rental.name}
        </span>
      </nav>

      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <Link
          href="/cam-nang"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-deep-violet hover:border-deep-violet/30 text-xs font-semibold shadow-xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Cẩm nang di chuyển</span>
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
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#251C39] via-[#4D3087] to-[#251C39] text-white shadow-xl p-6 sm:p-10">
        <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold tracking-wider uppercase shadow-sm">
              Thuê xe máy Huế
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/90 text-white text-xs font-semibold backdrop-blur-md">
              <Info className="w-3.5 h-3.5" />
              <span>Khảo sát thị trường tham khảo</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight leading-tight">
            {rental.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/90">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-warm-gold shrink-0" />
              <span>{rental.area}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Bike className="w-4 h-4 text-warm-gold shrink-0" />
              <span>{rental.vehicleTypes.join(" • ")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Description, Services, Procedures */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          {/* Summary Quote Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Tóm lược dịch vụ
            </span>
            <p className="text-base sm:text-lg text-dark-ink font-serif italic leading-relaxed">
              &ldquo;{rental.summary}&rdquo;
            </p>
          </div>

          {/* 4. Full Description */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-dark-ink flex items-center gap-2.5">
              <Bike className="w-5 h-5 text-deep-violet" />
              <span>Giới thiệu cơ sở</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {rental.description}
            </p>
          </div>

          {/* 6. Features & Amenities */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-dark-ink flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-warm-gold" />
              <span>Tiện ích & dịch vụ đi kèm</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {rental.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FAFAFC] border border-gray-100/80 flex items-start gap-3 hover:bg-white hover:shadow-xs transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rental Requirements & Procedures */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-dark-ink flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-deep-violet" />
              <span>Thủ tục thuê xe dự kiến</span>
            </h2>

            <div className="space-y-3">
              {rental.requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 text-xs sm:text-sm text-gray-700"
                >
                  <span className="w-5 h-5 rounded-full bg-deep-violet/10 text-deep-violet flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{req}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 mt-4">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Lưu ý:</strong> Nền tảng không thực hiện chức năng đặt xe hoặc giữ tiền cọc trực tuyến. Vui lòng kiểm tra kỹ hiện trạng xe (thắng, đèn, lốp, gương chiếu hậu) và thống nhất hợp đồng trước khi nhận bàn giao phương tiện.
              </p>
            </div>
          </div>
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
                <span className="text-gray-400 block text-xs">Khu vực phục vụ:</span>
                <span className="font-semibold text-dark-ink block">
                  {rental.area}
                </span>
                {rental.address && (
                  <span className="text-xs text-gray-500 block">
                    Địa chỉ: {rental.address}
                  </span>
                )}
              </div>

              <div className="pt-3 space-y-1">
                <span className="text-gray-400 block text-xs">Dịch vụ giao nhận:</span>
                <span className="font-semibold text-dark-ink block">
                  {rental.pickupService}
                </span>
              </div>

              <div className="pt-3 space-y-1">
                <span className="text-gray-400 block text-xs">Mức giá tham khảo:</span>
                <span className="font-bold text-orange-700 block">
                  {rental.price.displayLabel}
                </span>
              </div>

              <div className="pt-3 space-y-1">
                <span className="text-gray-400 block text-xs">Dòng xe cung cấp:</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {rental.vehicleTypes.map((v, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs"
                    >
                      {v}
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
              <span>Tìm kiếm cơ sở trên Google Maps</span>
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
                <span className="text-amber-700 font-semibold">Khảo sát thị trường tham khảo</span>
              </p>

              <p>
                <strong className="text-amber-950">Nguồn dữ liệu: </strong>
                <span>{rental.source}</span>
              </p>

              {rental.checkedDate && (
                <p>
                  <strong className="text-amber-950">Ngày kiểm tra: </strong>
                  <span>{rental.checkedDate}</span>
                </p>
              )}

              {rental.sourceExcerpt && (
                <div className="p-2.5 rounded-xl bg-white/70 border border-amber-200/60 text-[11px] text-amber-950 leading-relaxed italic">
                  &ldquo;{rental.sourceExcerpt}&rdquo;
                </div>
              )}

              <p className="text-[11px] text-amber-900/70 pt-1 border-t border-amber-200/60">
                {rental.verificationNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
