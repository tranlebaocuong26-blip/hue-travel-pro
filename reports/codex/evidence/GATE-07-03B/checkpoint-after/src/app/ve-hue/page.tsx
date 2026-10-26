"use client";

import React from "react";
import SubpageTopBar from "@/components/navigation/SubpageTopBar";
import Card from "@/components/common/Card";
import { useTransition } from "@/context/TransitionContext";
import { HERITAGE_TOPICS, TIMELINE_MILESTONES } from "@/data/heritage";
import {
  MapPin,
  ArrowRight,
  Landmark,
  Building2,
  Users,
  History,
} from "lucide-react";

const topicIcons = [
  <History key="1" className="w-6 h-6 text-deep-violet" />,
  <Landmark key="2" className="w-6 h-6 text-amber-700" />,
  <Building2 key="3" className="w-6 h-6 text-teal-700" />,
  <Users key="4" className="w-6 h-6 text-rose-700" />,
];

const topicBgColors = [
  "bg-purple-50/70 border-purple-100 hover:border-purple-200",
  "bg-amber-50/70 border-amber-100 hover:border-amber-200",
  "bg-teal-50/70 border-teal-100 hover:border-teal-200",
  "bg-rose-50/70 border-rose-100 hover:border-rose-200",
];

export default function VeHuePage() {
  const { navigate } = useTransition();

  const handleGo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    navigate(href);
  };
  return (
    <div className="space-y-8">
      {/* Top Search & Widgets */}
      <SubpageTopBar placeholder="Tìm địa điểm, món ăn, vùng đất..." />

      {/* Hero Banner (Ngọ Môn / Đại Nội Huế) */}
      <div
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[300px] sm:min-h-[360px] p-5 sm:p-8 md:p-12 flex flex-col justify-between text-white bg-cover bg-center shadow-lg"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(37, 28, 57, 0.82) 0%, rgba(37, 28, 57, 0.55) 50%, rgba(37, 28, 57, 0.08) 100%), url('/images/heroes/hero_lich_su.png')`,
          backgroundPosition: "right center",
          backgroundSize: "cover",
        }}
      >
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-warm-gold">
            <span>LỊCH SỬ</span>
            <div className="w-8 h-px bg-warm-gold/60" />
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-editorial tracking-tight leading-tight">
            Lịch sử Huế
          </h1>

          <p className="text-white/85 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
            Huế là sự giao hòa giữa lịch sử, văn hóa và nhịp sống hiện đại, nơi
            những giá trị truyền thống vẫn được gìn giữ và tiếp nối trong từng góc
            phố, dòng sông và con người.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 sm:pt-4">
            <a
              href="/kham-pha"
              onClick={(e) => handleGo(e, "/kham-pha")}
              className="inline-block"
            >
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 min-h-[44px] rounded-full bg-white text-[#251C39] hover:bg-gray-100 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Khám phá ngay</span>
                <ArrowRight className="w-4 h-4 text-[#251C39]" />
              </button>
            </a>
          </div>
        </div>

        {/* Location tag bottom */}
        <div className="self-start sm:self-end mt-4 sm:mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] sm:text-[11px] text-white/90 border border-white/20 max-w-full">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">Đại Nội Huế — Biểu tượng của một thời vàng son</span>
        </div>
      </div>

      {/* 4 Feature Topic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {HERITAGE_TOPICS.map((topic, index) => (
          <Card
            key={topic.id}
            className={`p-6 flex flex-col justify-between transition-all duration-200 border ${topicBgColors[index]}`}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4">
                {topicIcons[index]}
              </div>
              <h3 className="font-bold text-dark-ink text-base mb-1.5">
                {topic.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {topic.description}
              </p>
            </div>
            <div className="pt-4 flex justify-end">
              <div className="w-7 h-7 rounded-full bg-white shadow-xs flex items-center justify-center text-gray-500 hover:text-dark-ink">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* DÒNG THỜI GIAN & Di sản Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Timeline (8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-6">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-amber-700">
              DÒNG THỜI GIAN
            </div>
            <h2 className="text-2xl font-bold font-editorial text-dark-ink mt-1">
              Hành trình lịch sử của Huế
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
              Từ vùng đất Phú Xuân trù phú, Huế đã trải qua nhiều giai đoạn lịch
              sử quan trọng, trở thành kinh đô của triều Nguyễn và ngày nay là
              thành phố di sản.
            </p>
          </div>

          {/* Timeline Milestones Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
            {TIMELINE_MILESTONES.map((item, idx) => (
              <div key={idx} className="relative space-y-2 p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-deep-violet" />
                  <span className="text-xs font-bold text-deep-violet font-mono">
                    {item.year}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-dark-ink">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {item.description}
                </p>
                <div className="text-[9px] text-gray-400 italic pt-1 border-t border-gray-200/50">
                  Nguồn: {item.sourceNote}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Heritage Showcase Card (4 cols) (thay thế nút video chưa có hành động) */}
        <div className="lg:col-span-4 rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm flex flex-col">
          <div
            className="h-48 bg-cover bg-center relative"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url('/images/heroes/hero_trang_chu.png')`,
            }}
          >
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-semibold">
              Cố đô bên dòng Hương Giang
            </div>
          </div>
          <div className="p-6 space-y-3">
            <h3 className="font-bold text-dark-ink text-base">
              Nét đẹp cố đô Huế
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Trải nghiệm vẻ đẹp trầm mặc cổ kính hòa cùng nhịp sống hiện đại qua
              hệ thống di tích, cảnh quan thiên nhiên và ẩm thực truyền thống.
            </p>
            <a
              href="/kham-pha"
              onClick={(e) => handleGo(e, "/kham-pha")}
              className="block pt-1 cursor-pointer"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-deep-violet hover:underline">
                <span>Khám phá các điểm đến</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
