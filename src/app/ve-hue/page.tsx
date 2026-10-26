"use client";

import React, { useState, useRef, useEffect } from "react";
import SubpageTopBar from "@/components/navigation/SubpageTopBar";
import Card from "@/components/common/Card";
import { useTransition } from "@/context/TransitionContext";
import { HERITAGE_TOPICS } from "@/data/heritage";
import {
  MapPin,
  ArrowRight,
  Landmark,
  Building2,
  Users,
  History,
  BookOpen,
  ChevronUp,
  X,
} from "lucide-react";

const topicIcons = [
  <History key="1" className="w-6 h-6 text-deep-violet" />,
  <Landmark key="2" className="w-6 h-6 text-amber-700" />,
  <Building2 key="3" className="w-6 h-6 text-teal-700" />,
  <Users key="4" className="w-6 h-6 text-rose-700" />,
];

const topicThemes = [
  {
    cardBg: "bg-purple-50/70 border-purple-100 hover:border-purple-200",
    activeBorder: "border-purple-400 ring-2 ring-purple-300/50 shadow-md",
    panelBg: "bg-purple-50/60 border-purple-200/80",
    badgeBg: "bg-purple-100 text-purple-900 border-purple-200",
    bulletBg: "bg-purple-600",
    accentText: "text-purple-800",
  },
  {
    cardBg: "bg-amber-50/70 border-amber-100 hover:border-amber-200",
    activeBorder: "border-amber-400 ring-2 ring-amber-300/50 shadow-md",
    panelBg: "bg-amber-50/60 border-amber-200/80",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-200",
    bulletBg: "bg-amber-600",
    accentText: "text-amber-800",
  },
  {
    cardBg: "bg-teal-50/70 border-teal-100 hover:border-teal-200",
    activeBorder: "border-teal-400 ring-2 ring-teal-300/50 shadow-md",
    panelBg: "bg-teal-50/60 border-teal-200/80",
    badgeBg: "bg-teal-100 text-teal-900 border-teal-200",
    bulletBg: "bg-teal-600",
    accentText: "text-teal-800",
  },
  {
    cardBg: "bg-rose-50/70 border-rose-100 hover:border-rose-200",
    activeBorder: "border-rose-400 ring-2 ring-rose-300/50 shadow-md",
    panelBg: "bg-rose-50/60 border-rose-200/80",
    badgeBg: "bg-rose-100 text-rose-900 border-rose-200",
    bulletBg: "bg-rose-600",
    accentText: "text-rose-800",
  },
];

export default function VeHuePage() {
  const { navigate } = useTransition();
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);

  const toggleTopic = (id: string) => {
    setActiveTopicId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    if (activeTopicId && detailPanelRef.current) {
      const timer = setTimeout(() => {
        detailPanelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTopicId]);

  const handleGo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    navigate(href);
  };

  const activeIndex = HERITAGE_TOPICS.findIndex((t) => t.id === activeTopicId);
  const activeTopic = activeIndex >= 0 ? HERITAGE_TOPICS[activeIndex] : null;
  const activeTheme = activeIndex >= 0 ? topicThemes[activeIndex] : null;

  return (
    <div className="space-y-8 pb-12">
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
          <h1 className="text-[23px] sm:text-[27px] lg:text-[33px] font-bold font-editorial tracking-tight leading-snug text-white max-w-xl">
            Huế là sự giao hòa giữa lịch sử, văn hóa và nhịp sống hiện đại, nơi
            những giá trị truyền thống vẫn được gìn giữ và tiếp nối trong từng góc
            phố, dòng sông và con người.
          </h1>

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

      {/* 4 Feature Topic Cards with Equal Dimensions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
        {HERITAGE_TOPICS.map((topic, index) => {
          const isSelected = activeTopicId === topic.id;
          const theme = topicThemes[index];

          return (
            <div
              key={topic.id}
              className="relative flex flex-col cursor-pointer"
              onClick={() => toggleTopic(topic.id)}
            >
              <Card
                className={`p-5 sm:p-6 flex-1 flex flex-col justify-between transition-all duration-300 border rounded-2xl sm:rounded-3xl shadow-xs hover:shadow-md ${
                  theme.cardBg
                } ${isSelected ? theme.activeBorder : ""}`}
              >
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                      {topicIcons[index]}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-white/80 border border-black/5 text-gray-600">
                      {topic.tag}
                    </span>
                  </div>

                  <h3 className="font-bold text-dark-ink text-base mb-1.5">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed min-h-[58px]">
                    {topic.description}
                  </p>
                </div>

                {/* Navigation Action Row */}
                <div className="pt-4 mt-2 flex items-center justify-between border-t border-black/5">
                  <span className="text-xs font-semibold text-gray-600 transition-colors">
                    {isSelected ? "Đang mở chi tiết" : "Tìm hiểu thêm"}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTopic(topic.id);
                    }}
                    aria-expanded={isSelected}
                    aria-label={isSelected ? `Thu gọn ${topic.title}` : `Mở rộng ${topic.title}`}
                    className={`w-8 h-8 rounded-full shadow-xs flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                      isSelected
                        ? "bg-[#251C39] text-white rotate-90 shadow-md ring-2 ring-[#251C39]/20"
                        : "bg-white text-gray-500 hover:text-[#251C39] hover:bg-gray-100"
                    }`}
                  >
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300" />
                  </button>
                </div>
              </Card>

              {/* Active Downward Indicator Caret */}
              {isSelected && (
                <div className="hidden lg:block absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-current text-dark-ink" />
              )}
            </div>
          );
        })}
      </div>

      {/* Full-Width Slide-Down Detail Panel (Tràn ra hai bên) */}
      <div
        ref={detailPanelRef}
        id="heritage-detail-panel"
        className={`scroll-mt-20 sm:scroll-mt-24 grid transition-all duration-500 ease-in-out ${
          activeTopic
            ? "grid-rows-[1fr] opacity-100 mt-6"
            : "grid-rows-[0fr] opacity-0 mt-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          {activeTopic && activeTheme && (
            <div
              className={`p-6 sm:p-8 rounded-3xl border shadow-sm transition-all duration-300 ${activeTheme.panelBg}`}
            >
              {/* Header of Detail Panel */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-black/10">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${activeTheme.badgeBg}`}
                    >
                      {activeTopic.tag}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                      <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                      <span>Tư liệu chuyên sâu</span>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-editorial text-dark-ink">
                    {activeTopic.detail.title}
                  </h3>

                  {activeTopic.detail.intro && (
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic bg-white/75 p-3.5 rounded-2xl border border-black/5">
                      {activeTopic.detail.intro}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTopicId(null)}
                  className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-gray-100 text-xs font-bold text-gray-700 hover:text-dark-ink border border-black/10 shadow-xs transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Đóng tư liệu</span>
                </button>
              </div>

              {/* Sections & Items in Wide Responsive Multi-Column Grid */}
              <div className="pt-6 space-y-6">
                {activeTopic.detail.sections.map((section, sIdx) => (
                  <div key={sIdx} className="space-y-3">
                    {section.heading && (
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full inline-block ${activeTheme.bulletBg}`}
                        />
                        <span>{section.heading}</span>
                      </h4>
                    )}

                    <div
                      className={`grid gap-4 ${
                        activeTopic.id === "lifestyle"
                          ? "grid-cols-1 md:grid-cols-2"
                          : activeTopic.id === "modern"
                          ? "grid-cols-1 md:grid-cols-3"
                          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      }`}
                    >
                      {section.items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className="p-4 rounded-2xl bg-white/95 border border-black/5 shadow-2xs hover:shadow-xs transition-all space-y-2 flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              {item.badge && (
                                <span
                                  className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${activeTheme.badgeBg}`}
                                >
                                  {item.badge}
                                </span>
                              )}
                              <h5 className="text-xs sm:text-sm font-bold text-dark-ink">
                                {item.title}
                              </h5>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Collapse Button */}
              <div className="pt-6 mt-6 flex justify-center border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setActiveTopicId(null)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-gray-100 text-xs font-bold text-gray-700 hover:text-dark-ink border border-black/10 shadow-xs transition-all cursor-pointer"
                >
                  <ChevronUp className="w-4 h-4" />
                  <span>Thu gọn tư liệu</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
