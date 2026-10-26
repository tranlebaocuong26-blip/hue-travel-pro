import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FEATURED_PLACES } from "@/data/places";
import {
  MapPin,
  Clock,
  CheckCircle2,
  Info,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Compass,
} from "lucide-react";

interface PlaceDetailPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return FEATURED_PLACES.map((p) => ({
    slug: p.slug,
  }));
}

export default function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const place = FEATURED_PLACES.find((p) => p.slug === params.slug);

  if (!place) {
    notFound();
  }

  const isVerified = place.verificationStatus === "verified";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    place.googleMapsQuery
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
          href="/kham-pha"
          className="hover:text-deep-violet transition-colors flex items-center gap-1 shrink-0"
        >
          <span>Khám phá</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
        <span className="text-dark-ink font-semibold truncate max-w-[200px] sm:max-w-none">
          {place.name}
        </span>
      </nav>

      {/* Top Action Bar: Back to List + External Map button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <Link
          href="/kham-pha"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-deep-violet hover:border-deep-violet/30 text-xs font-semibold shadow-xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách điểm đến</span>
        </Link>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-deep-violet text-white hover:bg-opacity-95 text-xs font-semibold shadow-xs transition-all"
        >
          <MapPin className="w-4 h-4 text-warm-gold" />
          <span>Mở vị trí trên Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>

      {/* 2 & 3. Hero Visual & Title Header */}
      <div className="relative rounded-3xl overflow-hidden bg-dark-ink text-white shadow-xl min-h-[320px] sm:min-h-[380px] lg:min-h-[440px] flex flex-col justify-end p-6 sm:p-10">
        {/* Background Image Banner */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
          style={{
            backgroundImage: `url('${place.image}')`,
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-ink via-dark-ink/65 to-black/30" />

        <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
          {/* Category & Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-warm-gold text-dark-ink text-xs font-bold tracking-wider uppercase shadow-sm">
              {place.categoryLabel}
            </span>

            {isVerified ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-semibold backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Thông tin đã xác minh</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/90 text-white text-xs font-semibold backdrop-blur-md">
                <Info className="w-3.5 h-3.5" />
                <span>Dữ liệu tham khảo du lịch</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight leading-tight drop-shadow-sm">
            {place.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/90">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-warm-gold shrink-0" />
              <span>{place.area}</span>
            </div>

            {place.openHours && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-warm-gold shrink-0" />
                <span>{place.openHours}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Detail Grid (8 cols content + 4 cols metadata) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Full Description & Experiences */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          {/* Summary Quote Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Tóm lược điểm đến
            </span>
            <p className="text-base sm:text-lg text-dark-ink font-serif italic leading-relaxed">
              &ldquo;{place.summary}&rdquo;
            </p>
          </div>

          {/* 4. Full Description */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-dark-ink flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-deep-violet" />
              <span>Giới thiệu chi tiết</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {place.description}
            </p>

            {/* Safety Notice if present (camping/beach) */}
            {place.safetyNote && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 flex items-start gap-3 mt-4">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-bold block">Khuyến cáo an toàn & quy định:</strong>
                  <p className="leading-relaxed">{place.safetyNote}</p>
                </div>
              </div>
            )}
          </div>

          {/* 6. Highlights & Experiences */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-dark-ink flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-warm-gold" />
              <span>Trải nghiệm nổi bật</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {place.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FAFAFC] border border-gray-100/80 flex items-start gap-3 hover:bg-white hover:shadow-xs transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-deep-violet/10 text-deep-violet flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags list */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-gray-400 font-medium">Từ khóa:</span>
            {place.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column (4 cols): Information Card & Provenance */}
        <div className="lg:col-span-4 space-y-6">
          {/* Practical Visit Info */}
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-5">
            <h3 className="font-bold font-serif text-dark-ink text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-deep-violet" />
              <span>Thông tin tham quan</span>
            </h3>

            <div className="space-y-4 text-xs sm:text-sm divide-y divide-gray-100">
              {/* Area */}
              <div className="pt-2 first:pt-0 space-y-1">
                <span className="text-gray-400 block text-xs">Vị trí khu vực:</span>
                <span className="font-semibold text-dark-ink block">
                  {place.area}
                </span>
              </div>

              {/* Best time to visit */}
              {place.bestTimeToVisit && (
                <div className="pt-3 space-y-1">
                  <span className="text-gray-400 block text-xs">Thời điểm lý tưởng:</span>
                  <span className="font-semibold text-dark-ink block">
                    {place.bestTimeToVisit}
                  </span>
                </div>
              )}

              {/* Price Note */}
              <div className="pt-3 space-y-1">
                <span className="text-gray-400 block text-xs">Chi phí tham khảo:</span>
                <span className="font-bold text-amber-700 block">
                  {place.price.displayLabel}
                </span>
                {place.priceNote && place.priceNote !== place.price.displayLabel && (
                  <span className="text-[11px] text-gray-500 block">
                    {place.priceNote}
                  </span>
                )}
              </div>

              {/* Open Hours */}
              {place.openHours && (
                <div className="pt-3 space-y-1">
                  <span className="text-gray-400 block text-xs">Giờ mở cửa:</span>
                  <span className="font-semibold text-dark-ink block">
                    {place.openHours}
                  </span>
                </div>
              )}

              {/* Coordinates */}
              {place.coordinates && (
                <div className="pt-3 space-y-1">
                  <span className="text-gray-400 block text-xs">Tọa độ GPS xác minh:</span>
                  <span className="font-mono text-xs text-gray-600 block">
                    {place.coordinates.lat.toFixed(4)}° N, {place.coordinates.lng.toFixed(4)}° E
                  </span>
                </div>
              )}
            </div>

            {/* External Google Maps Button */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-deep-violet text-white text-xs sm:text-sm font-semibold hover:bg-opacity-95 shadow-sm transition-all"
            >
              <MapPin className="w-4 h-4 text-warm-gold" />
              <span>Mở bản đồ ngoài (Google Maps)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 7 & 8. Data Provenance & Verification Badge Card */}
          <div className="p-6 rounded-3xl bg-[#FFF9F2] border border-[#F2C675]/40 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Nguồn & Phạm vi xác thực dữ liệu</span>
            </div>

            <div className="space-y-2 text-xs text-amber-950/80 leading-relaxed">
              <p>
                <strong className="text-amber-950">Trạng thái: </strong>
                {isVerified ? (
                  <span className="text-emerald-700 font-semibold">Đã xác minh di tích/danh thắng</span>
                ) : (
                  <span className="text-amber-700 font-semibold">Tham khảo kinh nghiệm du lịch</span>
                )}
              </p>

              <p>
                <strong className="text-amber-950">Nguồn tham chiếu: </strong>
                <span>{place.source}</span>
              </p>

              {place.checkedDate && (
                <p>
                  <strong className="text-amber-950">Ngày đối chiếu: </strong>
                  <span>{place.checkedDate}</span>
                </p>
              )}

              {/* Granular Scope Badges */}
              <div className="pt-2 border-t border-amber-200/50 space-y-1.5">
                <span className="text-[11px] font-bold text-amber-900 block">Phạm vi xác thực:</span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className="flex items-center gap-1">
                    <span className={place.verificationScope.existence ? "text-emerald-600 font-bold" : "text-gray-400"}>
                      {place.verificationScope.existence ? "✓" : "○"} Tồn tại
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={place.verificationScope.location ? "text-emerald-600 font-bold" : "text-gray-400"}>
                      {place.verificationScope.location ? "✓" : "○"} Vị trí/GPS
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={place.verificationScope.openHours ? "text-emerald-600 font-bold" : "text-gray-400"}>
                      {place.verificationScope.openHours ? "✓" : "○"} Giờ mở cửa
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={place.verificationScope.ticketPrice ? "text-emerald-600 font-bold" : "text-amber-700 font-medium"}>
                      {place.verificationScope.ticketPrice ? "✓ Giá vé chuẩn" : "○ Giá tại quầy"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-amber-900/75 pt-2 border-t border-amber-200/60 leading-relaxed italic">
                {place.verificationScope.scopeDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
