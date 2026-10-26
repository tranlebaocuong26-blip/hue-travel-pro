"use client";

import React from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import { useTransition } from "@/context/TransitionContext";
import { ArrowRight, Sparkles, MapPin, Users, HeartHandshake } from "lucide-react";

export default function HomePage() {
  const { navigate } = useTransition();

  const handleGo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <div
      className="relative flex-1 flex flex-col w-full mx-auto max-w-[1536px] rounded-[24px] sm:rounded-[32px] lg:rounded-[36px] overflow-hidden border border-white/25 shadow-2xl shadow-indigo-950/25 bg-no-repeat bg-right-top bg-cover min-h-[calc(100vh-1.25rem)] sm:min-h-[calc(100vh-1.75rem)] lg:min-h-[calc(100svh-2rem)] lg:flex-none p-4 sm:p-6 lg:p-7 pt-6 sm:pt-8 md:pt-20 lg:pt-[84px] lg:[@media(max-height:820px)]:pt-[68px] lg:[@media(max-height:820px)]:pb-5 transition-all"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(37, 28, 57, 0.94) 0%, rgba(47, 32, 81, 0.78) 38%, rgba(37, 28, 57, 0.12) 100%), url('/images/heroes/hero_trang_chu.png')`,
      }}
    >
      {/* Hero Center-Left Content */}
      <div className="flex flex-1 items-center px-1 py-4 sm:px-3 sm:py-6 lg:px-4 lg:py-4 lg:[@media(max-height:820px)]:py-1.5">
        <div className="w-full max-w-[34rem]">
          {/* Tagline Badge */}
          <div className="mb-4 lg:[@media(max-height:820px)]:mb-3 inline-flex items-center gap-2 text-[11px] sm:text-xs font-medium tracking-[0.28em] uppercase text-[#F3DFDE]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Khám phá cố đô</span>
          </div>

          {/* Main Hero Headings */}
          <div>
            <h1
              className="font-normal tracking-tight text-[4.5rem] sm:text-[5.5rem] lg:text-[7rem] lg:[@media(max-height:820px)]:text-[6rem] text-[#FFF9F2] leading-none drop-shadow-sm"
              style={{ fontFamily: '"Palatino Linotype", "Times New Roman", serif' }}
            >
              HUẾ
            </h1>
            <div
              className="font-normal tracking-[0.015em] text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] lg:[@media(max-height:820px)]:text-[3rem] text-[#F4CBDF] leading-[1.05] drop-shadow-sm"
              style={{ fontFamily: '"Palatino Linotype", "Times New Roman", serif' }}
            >
              TRAVEL PRO
            </div>
            <p
              className="mt-3 text-[1.875rem] sm:text-[2.25rem] lg:text-[2.5rem] lg:[@media(max-height:820px)]:text-[2.25rem] leading-[1.35] font-normal italic text-[#FFE1C9] drop-shadow-sm"
              style={{ fontFamily: '"Palatino Linotype", "Times New Roman", serif' }}
            >
              Huế có chi hay?
            </p>
          </div>

          {/* Description */}
          <p className="mt-5 lg:[@media(max-height:820px)]:mt-4 max-w-[31rem] text-sm sm:text-base font-normal leading-[1.75] text-white/90 drop-shadow-sm">
            Khám phá vẻ đẹp trầm mặc và nên thơ của Huế — nơi những di sản ngàn
            năm, ẩm thực tinh tế và con người hiền hòa cùng tạo nên một hành
            trình đáng nhớ.
          </p>

          {/* Action CTAs (Xem video ẩn theo Gate 07-01 directive vì chưa có tệp video thực tế) */}
          <div className="mt-6 lg:[@media(max-height:820px)]:mt-4 flex flex-wrap items-center gap-4">
            <a
              href="/kham-pha"
              onClick={(e) => handleGo(e, "/kham-pha")}
              className="inline-block"
            >
              <Button
                variant="accent"
                size="lg"
                className="gap-3 shadow-xl hover:scale-105 transition-transform"
              >
                <span>Khám phá Huế ngay</span>
                <span className="w-6 h-6 rounded-full bg-dark-ink text-electric-lime flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Floating Glass Dock */}
      <div className="mt-4 sm:mt-6 lg:mt-4 rounded-[24px] sm:rounded-[28px] border border-white/25 bg-white/10 p-3 shadow-lg backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.35fr] gap-3 items-stretch">
            {/* Card 1: Di tích - Lịch sử */}
            <a
              href="/kham-pha"
              onClick={(e) => handleGo(e, "/kham-pha")}
              className="relative min-h-[188px] sm:min-h-[192px] lg:min-h-[176px] lg:[@media(max-height:820px)]:min-h-[164px] rounded-2xl overflow-hidden border border-white/25 bg-dark-ink/30 transition-all group flex flex-col justify-end cursor-pointer"
            >
              <div className="absolute inset-0">
                <Image
                  src="/images/cards/card_dai_noi.png"
                  alt="Di tích Đại Nội Huế"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-right-bottom scale-[1.5] group-hover:scale-[1.55] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#21182F] via-[#21182F]/25 to-transparent pointer-events-none" />
              </div>
              <div className="relative flex items-end justify-between gap-3 p-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-white text-sm sm:text-base leading-tight">
                    Di tích - Lịch sử
                  </h3>
                  <p className="text-xs leading-relaxed text-white/85 mt-1">
                    Khám phá dấu ấn triều Nguyễn
                  </p>
                </div>
                <span className="w-7 h-7 shrink-0 rounded-full bg-white text-dark-ink flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>

            {/* Card 2: Văn hoá - Tâm linh */}
            <a
              href="/kham-pha"
              onClick={(e) => handleGo(e, "/kham-pha")}
              className="relative min-h-[188px] sm:min-h-[192px] lg:min-h-[176px] lg:[@media(max-height:820px)]:min-h-[164px] rounded-2xl overflow-hidden border border-white/25 bg-dark-ink/30 transition-all group flex flex-col justify-end cursor-pointer"
            >
              <div className="absolute inset-0">
                <Image
                  src="/images/cards/card_thien_mu.png"
                  alt="Chùa Thiên Mụ"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-right-bottom scale-[1.5] group-hover:scale-[1.55] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#21182F] via-[#21182F]/25 to-transparent pointer-events-none" />
              </div>
              <div className="relative flex items-end justify-between gap-3 p-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-white text-sm sm:text-base leading-tight">
                    Văn hoá - Tâm linh
                  </h3>
                  <p className="text-xs leading-relaxed text-white/85 mt-1">
                    Chạm vào hồn cốt xứ Huế
                  </p>
                </div>
                <span className="w-7 h-7 shrink-0 rounded-full bg-white text-dark-ink flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>

            {/* Card 3: Ẩm thực Huế (NEEDS ASSET — DEFER IMAGE INTEGRATION) */}
            <a
              href="/kham-pha"
              onClick={(e) => handleGo(e, "/kham-pha")}
              className="relative min-h-[188px] sm:min-h-[192px] lg:min-h-[176px] lg:[@media(max-height:820px)]:min-h-[164px] rounded-2xl overflow-hidden border border-white/25 bg-dark-ink/30 transition-all group flex flex-col justify-end cursor-pointer"
            >
              <div className="font-ui absolute inset-0 flex flex-col items-center justify-center pb-16 px-3 text-center bg-white/[0.06]">
                <span className="text-[11px] font-semibold text-amber-100/95 tracking-[0.08em] uppercase leading-tight">
                  Đang chờ tư liệu ảnh
                </span>
                <span className="text-[11px] font-medium text-white/85 mt-1.5 leading-snug">
                  Ẩm thực Cố Đô (Đợt 1)
                </span>
              </div>
              <div className="relative flex items-end justify-between gap-3 p-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-white text-sm sm:text-base leading-tight">
                    Ẩm thực Huế
                  </h3>
                  <p className="text-xs leading-relaxed text-white/85 mt-1">
                    Tinh hoa hương vị cố đô
                  </p>
                </div>
                <span className="w-7 h-7 shrink-0 rounded-full bg-white text-dark-ink flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>

            {/* Card 4: Giá trị cốt lõi phi định lượng */}
            <div className="grid grid-cols-3 items-center gap-2 rounded-2xl bg-white/[0.06] px-3 py-6 text-center divide-x divide-white/15">
              <div className="min-w-0 px-1">
                <div className="flex items-center justify-center text-warm-ivory mb-3">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="block text-sm font-medium text-white leading-snug">Di sản</span>
                <span className="mt-1.5 block text-[10px] leading-relaxed text-white/75">Cố đô nghìn năm</span>
              </div>
              <div className="min-w-0 px-1">
                <div className="flex items-center justify-center text-warm-ivory mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <span className="block text-sm font-medium text-white leading-snug">Cẩm nang</span>
                <span className="mt-1.5 block text-[10px] leading-relaxed text-white/75">Du lịch tự túc</span>
              </div>
              <div className="min-w-0 px-1">
                <div className="flex items-center justify-center text-warm-ivory mb-3">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <span className="block text-sm font-medium text-white leading-snug">Trải nghiệm</span>
                <span className="mt-1.5 block text-[10px] leading-relaxed text-white/75">Văn hóa bản địa</span>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
