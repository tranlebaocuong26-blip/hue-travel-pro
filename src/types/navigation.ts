export interface NavItem {
  id: string;
  label: string;
  href: string;
  description?: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { id: "trang-chu", label: "Trang chủ", href: "/" },
  { id: "ve-hue", label: "Lịch sử", href: "/ve-hue" },
  { id: "kham-pha", label: "Khám phá", href: "/kham-pha" },
  { id: "an-uong", label: "Ăn uống", href: "/an-uong" },
  { id: "cam-nang", label: "Di chuyển", href: "/cam-nang" },
  { id: "luu-tru", label: "Lưu trú", href: "/luu-tru" },
];
