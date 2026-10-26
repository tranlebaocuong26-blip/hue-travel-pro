export type VerificationStatus = "verified" | "reference_only" | "illustrative";

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export type PriceUnit =
  | "nguoi/luot"
  | "xe/ngay"
  | "phong/dem"
  | "ve"
  | "mien-phi"
  | "thoa-thuan";

export type PriceType = "fixed" | "range" | "contact" | "free" | "unknown";

export interface PriceStructure {
  amount: number | null; // Luôn là null khi chưa có bảng giá xác minh chính thức. Tuyệt đối không dùng 0 để biểu diễn giá chưa rõ.
  minAmount?: number | null;
  maxAmount?: number | null;
  currency: "VND";
  unit: PriceUnit;
  priceType: PriceType;
  displayLabel: string; // Chuỗi hiển thị thân thiện: ví dụ "Giá theo thỏa thuận", "Miễn phí tham quan", "Theo mùa & loại phòng"
  isFree: boolean; // Chỉ true khi xác nhận 100% miễn phí tham quan
  isVerified: boolean; // true nếu mức giá đã được đối chiếu văn bản niêm yết chính thức
  verifiedDate?: string | null;
}

export interface VerificationScope {
  existence: boolean; // Xác minh cơ sở/danh thắng thực sự tồn tại
  location: boolean; // Xác minh vị trí địa lý / tọa độ
  openHours: boolean; // Xác minh khung giờ hoạt động
  ticketPrice: boolean; // Xác minh bảng giá vé/dịch vụ
  regulations: boolean; // Xác minh quy định tham quan/sử dụng
  scopeDescription: string; // Diễn giải chi tiết phạm vi xác nhận
}

export interface Place {
  id: string;
  slug: string;
  name: string;
  category: "di-tich" | "camping" | "bien" | "check-in";
  categoryLabel: string;
  location: string;
  area: string;
  summary: string;
  description: string;
  image: string;
  gallery?: string[];
  tags: string[];
  highlights: string[];
  safetyNote?: string | null;
  bestTimeToVisit?: string | null;
  price: PriceStructure;
  priceNote?: string | null;
  openHours?: string | null;
  contactPhone?: string | null;
  coordinates?: GeoCoordinates | null;
  googleMapsQuery: string;
  source: string;
  sourceUrl?: string;
  sourceExcerpt?: string; // Đoạn trích dẫn hỗ trợ từ nguồn
  checkedDate: string | null;
  verificationStatus: VerificationStatus;
  verificationScope: VerificationScope;
  verificationNote: string;
}

export interface RentalProvider {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  location: string;
  area: string;
  image?: string;
  price: PriceStructure;
  pricePerDayVND?: string; // Giữ để tương thích ngược nếu cần
  vehicleTypes: string[];
  tags: string[];
  features: string[];
  requirements: string[];
  pickupService: string;
  contactPhone?: string | null;
  address?: string | null;
  coordinates?: GeoCoordinates | null;
  googleMapsQuery: string;
  source: string;
  sourceUrl?: string;
  sourceExcerpt?: string; // Đoạn trích dẫn từ bài viết MOTOGO
  checkedDate: string | null;
  verificationStatus: VerificationStatus;
  verificationScope: VerificationScope;
  verificationNote: string;
}

export interface Accommodation {
  id: string;
  slug: string;
  name: string;
  type: "homestay" | "hotel" | "resort";
  typeLabel: string;
  summary: string;
  description: string;
  location: string;
  area: string;
  image?: string;
  price: PriceStructure;
  pricePerNightVND?: string; // Giữ để tương thích ngược nếu cần
  amenities: string[];
  features: string[];
  roomTypes?: string[];
  contactPhone?: string | null;
  address?: string | null;
  coordinates?: GeoCoordinates | null;
  googleMapsQuery: string;
  source: string;
  sourceUrl?: string;
  sourceExcerpt?: string;
  checkedDate: string | null;
  verificationStatus: VerificationStatus;
  verificationScope: VerificationScope;
  verificationNote: string;
}

export type FoodCategory =
  | "bun-bo"
  | "banh-hue"
  | "com-hen"
  | "che-hue"
  | "an-vat"
  | "ca-phe";

export interface FoodSpot {
  id: string;
  slug: string;
  name: string;
  category: FoodCategory;
  categoryLabel: string;
  specialtyDishes: string[];
  summary: string;
  description: string;
  location: string;
  area: string;
  address: string;
  image: string;
  gallery?: string[];
  priceRange: string;
  openHours: string;
  bestTime?: string;
  budgetCategory: "budget" | "mid" | "premium";
  highlights: string[];
  tips: string[];
  contactPhone?: string | null;
  coordinates?: GeoCoordinates | null;
  googleMapsQuery: string;
  tags: string[];
  checkedDate: string | null;
  verificationStatus: VerificationStatus;
  verificationScope: VerificationScope;
  verificationNote: string;
}
