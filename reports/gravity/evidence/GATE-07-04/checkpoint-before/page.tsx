"use client";

import React from "react";
import Image from "next/image";
import { useTransition } from "@/context/TransitionContext";
import { ArrowRight, MapPin, Users, Star, Sparkles } from "lucide-react";

export default function HomePage() {
  const { navigate } = useTransition();

  const handleGo = (e: React.MouseEvent | null, href: string) => {
    if (e) e.preventDefault();
    navigate(href);
  };

  return (
    <div
      className="relative flex-1 flex flex-col w-full mx-auto max-w-[1536px] rounded-[24px] sm:rounded-[32px] lg:rounded-[36px] overflow-hidden border border-white/20 shadow-2xl shadow-indigo-950/30 bg-no-repeat bg-right-top bg-cover min-h-[calc(100vh-1.25rem)] sm:min-h-[calc(100vh-1.75rem)] lg:min-h-[calc(100svh-2rem)] lg:flex-none p-4 sm:p-6 lg:p-7 pt-6 sm:pt-8 md:pt-20 lg:pt-[124px] lg:[@media(max-height:820px)]:pt-[100px] lg:[@media(max-height:820px)]:pb-3.5 transition-all"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(29, 31, 65, 0.94) 0%, rgba(36, 34, 75, 0.82) 34%, rgba(55, 38, 92, 0.35) 65%, rgba(0, 0, 0, 0) 100%), url('/images/heroes/hero_trang_chu.png')`,
      }}
    >
      {/* Hero Center-Left Content */}
      <div className="flex flex-1 items-center px-1 py-4 sm:px-3 sm:py-6 lg:px-4 lg:py-3.5 lg:[@media(max-height:820px)]:py-1">
        <div className="w-full max-w-[34rem]">
          {/* Tagline Badge */}
          <div className="mb-3 lg:[@media(max-height:820px)]:mb-2 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.28em] uppercase text-[#F3DFDE] drop-shadow-sm font-ui">
            <Sparkles className="w-3.5 h-3.5 text-[#FFA86B]" />
            <span>KHÁM PHÁ CỐ ĐÔ</span>
          </div>

          {/* Main Hero Headings */}
          <div>
            <h1
              className="font-bold tracking-tight text-[4.7rem] sm:text-[5.7rem] lg:text-[6.9rem] lg:[@media(max-height:820px)]:text-[5.9rem] leading-none drop-shadow-md bg-gradient-to-b from-white via-[#FFF0E8] to-[#F5C2B4] bg-clip-text text-transparent font-serif"
              style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
            >
              HUẾ
            </h1>
            <div
              className="font-ui font-extrabold tracking-[0.14em] text-[2.2rem] sm:text-[2.7rem] lg:text-[3.2rem] lg:[@media(max-height:820px)]:text-[2.7rem] leading-tight drop-shadow-md bg-gradient-to-b from-white via-[#FFF0E8] to-[#F2B6A6] bg-clip-text text-transparent uppercase mt-1"
            >
              TRAVEL PRO
            </div>
            <div className="relative inline-block mt-2 mb-1">
              <p
                className="text-[1.7rem] sm:text-[2.1rem] lg:text-[2.45rem] lg:[@media(max-height:820px)]:text-[2.1rem] font-normal italic drop-shadow-sm bg-gradient-to-r from-[#FFE5CC] via-[#FFD0A0] to-[#FFA86B] bg-clip-text text-transparent font-serif"
                style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", cursive, serif' }}
              >
                Huế có chi hay?
              </p>
              {/* Golden brush underline */}
              <svg
                className="w-full h-2.5 mt-0.5 text-[#FFA86B] opacity-85"
                viewBox="0 0 200 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,5 Q50,0 100,5 T200,5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Description */}
          <p className="font-ui mt-4 max-w-[31rem] text-[15px] sm:text-base font-normal leading-[1.75] text-white/95 drop-shadow-sm">
            Khám phá vẻ đẹp trầm mặc và nên thơ của Huế — nơi những di sản ngàn
            năm, ẩm thực tinh tế và con người hiền hòa cùng tạo nên một hành
            trình đáng nhớ.
          </p>

          {/* Action CTA */}
          <div className="mt-6 lg:[@media(max-height:820px)]:mt-4 flex items-center">
            {/* Primary CTA */}
            <a
              href="/kham-pha"
              onClick={(e) => handleGo(e, "/kham-pha")}
              className="font-ui inline-flex items-center gap-3.5 px-6 py-3.5 rounded-full bg-[#D2F801] hover:bg-[#c4eb00] text-[#1E1435] font-bold text-base shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              <span>Khám phá Huế ngay</span>
              <span className="w-7 h-7 rounded-full bg-[#271E42] text-[#D2F801] flex items-center justify-center transition-transform group-hover:translate-x-1 shadow-md">
                <ArrowRight className="w-4 h-4" />
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Floating Glass Dock */}
      <div className="mt-3 sm:mt-6 lg:mt-3 rounded-[24px] sm:rounded-[28px] border border-white/20 bg-white/[0.08] p-2.5 sm:p-3.5 shadow-2xl backdrop-blur-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.35fr] gap-3 items-stretch">
          {/* Card 1: Di tích - Lịch sử */}
          <a
            href="/kham-pha"
            onClick={(e) => handleGo(e, "/kham-pha")}
            className="relative min-h-[170px] sm:min-h-[176px] lg:min-h-[164px] lg:[@media(max-height:820px)]:min-h-[148px] rounded-2xl overflow-hidden border border-white/20 bg-dark-ink/30 transition-all group flex flex-col justify-end cursor-pointer shadow-lg hover:scale-[1.02]"
          >
            <div className="absolute inset-0">
              <Image
                src="/images/cards/card_di_tich.png"
                alt="Di tích - Lịch sử"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
            </div>
            <div className="relative flex items-end justify-between gap-3 p-3 z-10">
              <div className="min-w-0">
                <h3 className="font-ui font-semibold text-white text-[15px] sm:text-base leading-snug drop-shadow-sm">
                  Di tích - Lịch sử
                </h3>
                <p className="font-ui text-xs leading-relaxed text-white/90 mt-1 drop-shadow-sm">
                  Khám phá dấu ấn triều Nguyễn
                </p>
              </div>
              <span className="w-8 h-8 shrink-0 rounded-full bg-white text-dark-ink flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </a>

          {/* Card 2: Văn hoá - Tâm linh */}
          <a
            href="/kham-pha"
            onClick={(e) => handleGo(e, "/kham-pha")}
            className="relative min-h-[170px] sm:min-h-[176px] lg:min-h-[164px] lg:[@media(max-height:820px)]:min-h-[148px] rounded-2xl overflow-hidden border border-white/20 bg-dark-ink/30 transition-all group flex flex-col justify-end cursor-pointer shadow-lg hover:scale-[1.02]"
          >
            <div className="absolute inset-0">
              <Image
                src="/images/cards/card_van_hoa.png"
                alt="Văn hoá - Tâm linh"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
            </div>
            <div className="relative flex items-end justify-between gap-3 p-3 z-10">
              <div className="min-w-0">
                <h3 className="font-ui font-semibold text-white text-[15px] sm:text-base leading-snug drop-shadow-sm">
                  Văn hoá - Tâm linh
                </h3>
                <p className="font-ui text-xs leading-relaxed text-white/90 mt-1 drop-shadow-sm">
                  Chạm vào hồn cốt xứ Huế
                </p>
              </div>
              <span className="w-8 h-8 shrink-0 rounded-full bg-white text-dark-ink flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </a>

          {/* Card 3: Ẩm thực Huế (Ảnh Bún bò Huế thật) */}
          <a
            href="/cam-nang"
            onClick={(e) => handleGo(e, "/cam-nang")}
            className="relative min-h-[170px] sm:min-h-[176px] lg:min-h-[164px] lg:[@media(max-height:820px)]:min-h-[148px] rounded-2xl overflow-hidden border border-white/20 bg-dark-ink/30 transition-all group flex flex-col justify-end cursor-pointer shadow-lg hover:scale-[1.02]"
          >
            <div className="absolute inset-0">
              <Image
                src="/images/cards/card_am_thuc.png"
                alt="Ẩm thực Huế"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
            </div>
            <div className="relative flex items-end justify-between gap-3 p-3 z-10">
              <div className="min-w-0">
                <h3 className="font-ui font-semibold text-white text-[15px] sm:text-base leading-snug drop-shadow-sm">
                  Ẩm thực Huế
                </h3>
                <p className="font-ui text-xs leading-relaxed text-white/90 mt-1 drop-shadow-sm">
                  Tinh hoa hương vị cố đô
                </p>
              </div>
              <span className="w-8 h-8 shrink-0 rounded-full bg-white text-dark-ink flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </a>

          {/* Stats Panel (Khối Thống kê 3 Cột từ Mockup) */}
          <div className="rounded-2xl bg-white/[0.08] border border-white/20 p-3 sm:p-4 flex items-center justify-around shadow-inner backdrop-blur-md min-h-[170px] sm:min-h-[176px] lg:min-h-[164px] lg:[@media(max-height:820px)]:min-h-[148px]">
            {/* Stat 1: 200+ Điểm đến hấp dẫn */}
            <div className="flex flex-col items-center text-center px-1">
              <MapPin className="w-5 h-5 text-white/95 mb-1.5" />
              <div className="text-2xl lg:text-[26px] font-serif font-bold text-white tracking-tight drop-shadow-sm">
                200+
              </div>
              <div className="font-ui text-[11.5px] font-medium text-white/90 mt-1 leading-snug">
                Điểm đến hấp dẫn
              </div>
            </div>
            <div className="w-px h-10 bg-white/25" />
            {/* Stat 2: 50+ Trải nghiệm độc đáo */}
            <div className="flex flex-col items-center text-center px-1">
              <Users className="w-5 h-5 text-white/95 mb-1.5" />
              <div className="text-2xl lg:text-[26px] font-serif font-bold text-white tracking-tight drop-shadow-sm">
                50+
              </div>
              <div className="font-ui text-[11.5px] font-medium text-white/90 mt-1 leading-snug">
                Trải nghiệm độc đáo
              </div>
            </div>
            <div className="w-px h-10 bg-white/25" />
            {/* Stat 3: 10K+ Du khách hài lòng */}
            <div className="flex flex-col items-center text-center px-1">
              <Star className="w-5 h-5 text-white/95 mb-1.5 fill-white/95" />
              <div className="text-2xl lg:text-[26px] font-serif font-bold text-white tracking-tight drop-shadow-sm">
                10K+
              </div>
              <div className="font-ui text-[11.5px] font-medium text-white/90 mt-1 leading-snug">
                Du khách hài lòng
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
