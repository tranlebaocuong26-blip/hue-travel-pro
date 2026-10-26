import { Place, RentalProvider, Accommodation, FoodSpot } from "@/types/content";
import { FEATURED_PLACES } from "@/data/places";
import { RENTAL_PROVIDERS } from "@/data/rentals";
import { ACCOMMODATIONS } from "@/data/accommodations";
import { FEATURED_FOODS } from "@/data/foods";

/**
 * Chuẩn hóa chuỗi tiếng Việt:
 * - Chuyển chữ thường
 * - Khử toàn bộ dấu thanh và dấu mũ (a, ă, â -> a, đ -> d, v.v.)
 * - Bỏ khoảng trắng thừa ở đầu/cuối
 */
export function normalizeVietnamese(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Kiểm tra xem primaryText và fullText có khớp với query hay không:
 * - 1. Nếu cụm từ tìm kiếm đầy đủ xuất hiện trong toàn bộ văn bản -> MATCH
 * - 2. Nếu query gồm nhiều từ (vd: "dai noi", "hue dai noi"), toàn bộ từ phải có mặt trong các trường chính (tên, khu vực, danh mục, tags)
 * - 3. Nếu query là từ đơn (vd: "camping", "xe ga", "homestay"), tìm trong fullText
 */
export function matchesQuery(
  primaryText: string,
  fullText: string,
  query: string
): boolean {
  const cleanQuery = query.trim();
  if (!cleanQuery) return true;

  const normQuery = normalizeVietnamese(cleanQuery);
  const normPrimary = normalizeVietnamese(primaryText);
  const normFull = normalizeVietnamese(fullText);

  // 1. Khớp nguyên vẹn cả cụm từ tìm kiếm trong văn bản (ưu tiên cao nhất)
  if (normFull.includes(normQuery)) {
    return true;
  }

  const tokens = normQuery.split(/\s+/).filter(Boolean);

  // 2. Với truy vấn nhiều từ (e.g. "dai noi", "hue dai noi"):
  // Toàn bộ các từ khóa phải xuất hiện trong các trường thông tin chính (tránh khớp tản mạn các từ đơn lẻ trong bài văn dài)
  if (tokens.length > 1) {
    const isAllInPrimary = tokens.every((token) => normPrimary.includes(token));
    if (isAllInPrimary) {
      return true;
    }
  }

  // 3. Với truy vấn 1 từ đơn lẻ (e.g. "bien", "camping", "homestay")
  if (tokens.length === 1) {
    return normFull.includes(tokens[0]);
  }

  return false;
}

// ==========================================
// BỘ LỌC VÀ TÌM KIẾM CHO ĐỊA ĐIỂM (PLACES)
// ==========================================

export interface PlaceFilterOptions {
  query?: string;
  category?: string; // "all" | "di-tich" | "camping" | "bien" | "check-in"
  area?: string; // "all" | "trung-tam" | "phu-loc" | "thuy-bang" | "kim-long"
  budget?: string; // "all" | "free" | "ticket" | "contact"
  audience?: string; // "all" | "family" | "couple" | "youth" | "first-time"
}

export interface PlaceSearchResult {
  exactMatches: Place[];
  unknownPriceItems: Place[];
  totalCount: number;
}

export function searchPlaces(
  places: Place[] = FEATURED_PLACES,
  options: PlaceFilterOptions = {}
): PlaceSearchResult {
  const {
    query = "",
    category = "all",
    area = "all",
    budget = "all",
    audience = "all",
  } = options;

  const filtered = places.filter((place) => {
    // 1. Kiểm tra Category
    if (category !== "all" && place.category !== category) {
      return false;
    }

    // 2. Kiểm tra Area
    if (area !== "all") {
      const normArea = normalizeVietnamese(place.location + " " + place.area);
      if (area === "trung-tam" && !normArea.includes("trung tam") && !normArea.includes("kinh thanh")) {
        return false;
      }
      if (area === "phu-loc" && !normArea.includes("phu loc") && !normArea.includes("lang co")) {
        return false;
      }
      if (area === "thuy-bang" && !normArea.includes("thuy bang") && !normArea.includes("thien an")) {
        return false;
      }
      if (area === "kim-long" && !normArea.includes("kim long") && !normArea.includes("thien mu")) {
        return false;
      }
    }

    // 3. Kiểm tra Audience / Gợi ý nhu cầu
    if (audience !== "all") {
      const normTags = normalizeVietnamese(
        place.tags.join(" ") + " " + place.highlights.join(" ") + " " + place.summary
      );
      if (audience === "first-time" && !place.slug.includes("dai-noi") && !place.slug.includes("cau-truong-tien")) {
        return false;
      }
      if (audience === "family" && !normTags.includes("gia dinh") && place.category !== "di-tich") {
        return false;
      }
      if (audience === "couple" && !normTags.includes("hoang hon") && !normTags.includes("nghi duong") && place.category !== "check-in") {
        return false;
      }
      if (audience === "youth" && place.category !== "camping" && place.category !== "check-in") {
        return false;
      }
    }

    // 4. Kiểm tra Text Query
    if (query.trim()) {
      const primaryText = [
        place.name,
        place.categoryLabel,
        place.location,
        place.area,
        ...place.tags,
      ].join(" ");

      const fullText = [
        primaryText,
        place.summary,
        place.description,
        ...place.highlights,
      ].join(" ");

      if (!matchesQuery(primaryText, fullText, query)) {
        return false;
      }
    }

    return true;
  });

  // 5. Xử lý bộ lọc Ngân sách theo quy tắc GATE 05 (Bắt buộc không coi null là 0 hay miễn phí)
  if (budget === "all") {
    return {
      exactMatches: filtered,
      unknownPriceItems: [],
      totalCount: filtered.length,
    };
  }

  if (budget === "free") {
    // Chỉ các địa điểm ĐÃ XÁC MINH miễn phí tham quan
    const exactMatches = filtered.filter(
      (p) => p.price.isFree && p.price.isVerified
    );
    // Các địa điểm dã ngoại tự túc / chưa xác minh vé
    const unknownPriceItems = filtered.filter(
      (p) => p.price.isFree && !p.price.isVerified
    );
    return {
      exactMatches,
      unknownPriceItems,
      totalCount: exactMatches.length + unknownPriceItems.length,
    };
  }

  if (budget === "ticket") {
    // Có biểu giá vé niêm yết tại quầy hoặc có thu phí
    const exactMatches = filtered.filter(
      (p) => !p.price.isFree && p.price.priceType === "contact"
    );
    return {
      exactMatches,
      unknownPriceItems: [],
      totalCount: exactMatches.length,
    };
  }

  if (budget === "contact") {
    // Nhóm chưa rõ giá vé hoặc dịch vụ tự thỏa thuận
    const exactMatches = filtered.filter(
      (p) => p.price.priceType === "unknown" || !p.price.isVerified
    );
    return {
      exactMatches,
      unknownPriceItems: [],
      totalCount: exactMatches.length,
    };
  }

  return {
    exactMatches: filtered,
    unknownPriceItems: [],
    totalCount: filtered.length,
  };
}

// ==========================================
// BỘ LỌC VÀ TÌM KIẾM CHO THUÊ XE (RENTALS)
// ==========================================

export interface RentalFilterOptions {
  query?: string;
  vehicleType?: string; // "all" | "Xe ga" | "Xe số" | "Xe côn tay"
  area?: string; // "all" | "TP. Huế" | "Ga Huế" | "Khu phố Tây" | "Sân bay"
  budget?: string; // "all" | "under-150k" | "contact"
}

export interface RentalSearchResult {
  exactMatches: RentalProvider[];
  unknownPriceItems: RentalProvider[];
  totalCount: number;
}

export function searchRentals(
  rentals: RentalProvider[] = RENTAL_PROVIDERS,
  options: RentalFilterOptions = {}
): RentalSearchResult {
  const {
    query = "",
    vehicleType = "all",
    area = "all",
    budget = "all",
  } = options;

  const filtered = rentals.filter((rental) => {
    // 1. Kiểm tra loại xe
    if (vehicleType !== "all") {
      const normVehicles = rental.vehicleTypes.map((v) => normalizeVietnamese(v));
      const normTarget = normalizeVietnamese(vehicleType);

      let matched = false;
      if (vehicleType === "gan-may") {
        matched = normVehicles.some(
          (v) =>
            v.includes("xe") ||
            v.includes("may") ||
            v.includes("ga") ||
            v.includes("so") ||
            v.includes("con tay")
        );
      } else if (vehicleType === "xe-ga") {
        matched = normVehicles.some((v) => v.includes("ga"));
      } else if (vehicleType === "oto") {
        matched = normVehicles.some(
          (v) => v.includes("oto") || v.includes("o to") || v.includes("xe hoi")
        );
      } else if (vehicleType === "dien") {
        matched = normVehicles.some((v) => v.includes("dien"));
      } else if (vehicleType === "xe-dap") {
        matched = normVehicles.some((v) => v.includes("dap"));
      } else if (vehicleType === "cong-cong") {
        matched = normVehicles.some(
          (v) => v.includes("cong cong") || v.includes("buyt") || v.includes("bus")
        );
      } else {
        matched = normVehicles.some((v) => v.includes(normTarget));
      }

      if (!matched) {
        return false;
      }
    }

    // 2. Kiểm tra khu vực
    if (area !== "all") {
      const normLocation = normalizeVietnamese(
        rental.location + " " + rental.area + " " + rental.pickupService
      );
      const normTargetArea = normalizeVietnamese(area);
      if (!normLocation.includes(normTargetArea)) {
        return false;
      }
    }

    // 3. Kiểm tra Search Query
    if (query.trim()) {
      const primaryText = [
        rental.name,
        rental.location,
        rental.area,
        ...rental.vehicleTypes,
        ...rental.tags,
      ].join(" ");

      const fullText = [
        primaryText,
        rental.summary,
        rental.description,
        ...rental.features,
        rental.pickupService,
      ].join(" ");

      if (!matchesQuery(primaryText, fullText, query)) {
        return false;
      }
    }

    return true;
  });

  // 4. Xử lý ngân sách:
  // Vì toàn bộ 6 cơ sở thuê xe hiện tại có price.amount === null (giá theo thỏa thuận từng dòng xe),
  // khi lọc ngân sách cụ thể (ví dụ "under-150k"), TUYỆT ĐỐI KHÔNG xếp cơ sở nào vào exactMatches.
  // Toàn bộ cơ sở phải được đưa vào unknownPriceItems với nhãn giải thích rõ ràng.
  if (budget === "under-150k") {
    return {
      exactMatches: [],
      unknownPriceItems: filtered, // Tách riêng nhóm chưa rõ giá
      totalCount: filtered.length,
    };
  }

  return {
    exactMatches: filtered,
    unknownPriceItems: [],
    totalCount: filtered.length,
  };
}

// ==========================================
// BỘ LỌC VÀ TÌM KIẾM CHO LƯU TRÚ (ACCOMMODATIONS)
// ==========================================

export interface AccommodationFilterOptions {
  query?: string;
  type?: string; // "all" | "homestay" | "hotel" | "resort"
  area?: string; // "all" | "Trung tâm" | "sông Hương" | "Đại Nội" | "Ngoại ô"
  amenity?: string; // "all" | "wifi" | "coffee" | "pool" | "parking"
  budget?: string; // "all" | "budget-standard" | "budget-luxury" | "contact"
}

export interface AccommodationSearchResult {
  exactMatches: Accommodation[];
  unknownPriceItems: Accommodation[];
  totalCount: number;
}

export function searchAccommodations(
  accommodations: Accommodation[] = ACCOMMODATIONS,
  options: AccommodationFilterOptions = {}
): AccommodationSearchResult {
  const {
    query = "",
    type = "all",
    area = "all",
    amenity = "all",
    budget = "all",
  } = options;

  const filtered = accommodations.filter((item) => {
    // 1. Kiểm tra loại hình
    if (type !== "all" && item.type !== type) {
      return false;
    }

    // 2. Kiểm tra khu vực
    if (area !== "all") {
      const normLoc = normalizeVietnamese(item.location + " " + item.area);
      const normTarget = normalizeVietnamese(area);
      if (!normLoc.includes(normTarget)) {
        return false;
      }
    }

    // 3. Kiểm tra tiện nghi
    if (amenity !== "all") {
      const normAmenities = normalizeVietnamese(
        item.amenities.join(" ") + " " + item.features.join(" ")
      );
      if (amenity === "wifi" && !normAmenities.includes("wi-fi") && !normAmenities.includes("wifi")) {
        return false;
      }
      if (amenity === "coffee" && !normAmenities.includes("ca phe") && !normAmenities.includes("coffee") && !normAmenities.includes("bua sang")) {
        return false;
      }
      if (amenity === "pool" && !normAmenities.includes("ho boi") && !normAmenities.includes("be boi")) {
        return false;
      }
      if (amenity === "parking" && !normAmenities.includes("do xe") && !normAmenities.includes("bai do")) {
        return false;
      }
    }

    // 4. Kiểm tra Search Query
    if (query.trim()) {
      const primaryText = [
        item.name,
        item.typeLabel,
        item.location,
        item.area,
        ...(item.roomTypes || []),
      ].join(" ");

      const fullText = [
        primaryText,
        item.summary,
        item.description,
        ...item.amenities,
        ...item.features,
      ].join(" ");

      if (!matchesQuery(primaryText, fullText, query)) {
        return false;
      }
    }

    return true;
  });

  // 5. Xử lý ngân sách:
  // Vì 8 cơ sở lưu trú đều có price.amount === null (giá biến động theo mùa & loại phòng),
  // khi lọc ngân sách cụ thể, tách toàn bộ vào unknownPriceItems.
  if (budget === "budget-standard" || budget === "budget-luxury") {
    return {
      exactMatches: [],
      unknownPriceItems: filtered,
      totalCount: filtered.length,
    };
  }

  return {
    exactMatches: filtered,
    unknownPriceItems: [],
    totalCount: filtered.length,
  };
}

// ==========================================
// BỘ LỌC VÀ TÌM KIẾM CHO ĂN UỐNG (FOODS)
// ==========================================

export interface FoodFilterOptions {
  query?: string;
  category?: string; // "all" | "bun-bo" | "banh-hue" | "com-hen" | "che-hue" | "an-vat" | "ca-phe"
  area?: string; // "all" | "bo-nam" | "bo-bac"
  budget?: string; // "all" | "budget" | "mid" | "premium"
}

export interface FoodSearchResult {
  exactMatches: FoodSpot[];
  totalCount: number;
}

export function searchFoods(
  foods: FoodSpot[] = FEATURED_FOODS,
  options: FoodFilterOptions = {}
): FoodSearchResult {
  const { query = "", category = "all", area = "all", budget = "all" } = options;

  const filtered = foods.filter((food) => {
    // 1. Category
    if (category !== "all") {
      if (category === "che-ca-phe") {
        if (food.category !== "che-hue" && food.category !== "ca-phe") {
          return false;
        }
      } else if (food.category !== category) {
        return false;
      }
    }

    // 2. Budget
    if (budget !== "all" && food.budgetCategory !== budget) {
      return false;
    }

    // 3. Area
    if (area !== "all") {
      const normArea = normalizeVietnamese(food.area + " " + food.location);
      if (area === "bo-nam" && !normArea.includes("bo nam")) return false;
      if (area === "bo-bac" && !normArea.includes("bo bac") && !normArea.includes("thanh noi")) return false;
    }

    // 4. Query text
    if (query.trim()) {
      const primaryText = `${food.name} ${food.categoryLabel} ${food.specialtyDishes.join(" ")} ${food.address}`;
      const fullText = `${primaryText} ${food.summary} ${food.description} ${food.tags.join(" ")} ${food.highlights.join(" ")}`;
      if (!matchesQuery(primaryText, fullText, query)) {
        return false;
      }
    }

    return true;
  });

  return {
    exactMatches: filtered,
    totalCount: filtered.length,
  };
}

// ==========================================
// TÌM KIẾM TOÀN TRANG (GLOBAL SEARCH)
// ==========================================

export interface GlobalSearchResult {
  query: string;
  totalCount: number;
  places: Place[];
  rentals: RentalProvider[];
  accommodations: Accommodation[];
  foods: FoodSpot[];
}

export function globalSearch(
  query: string,
  categoryFilter: "all" | "places" | "rentals" | "accommodations" | "foods" = "all"
): GlobalSearchResult {
  const cleanQuery = query.trim();

  const places =
    categoryFilter === "all" || categoryFilter === "places"
      ? searchPlaces(FEATURED_PLACES, { query: cleanQuery }).exactMatches
      : [];

  const rentals =
    categoryFilter === "all" || categoryFilter === "rentals"
      ? searchRentals(RENTAL_PROVIDERS, { query: cleanQuery }).exactMatches
      : [];

  const accommodations =
    categoryFilter === "all" || categoryFilter === "accommodations"
      ? searchAccommodations(ACCOMMODATIONS, { query: cleanQuery }).exactMatches
      : [];

  const foods =
    categoryFilter === "all" || categoryFilter === "foods"
      ? searchFoods(FEATURED_FOODS, { query: cleanQuery }).exactMatches
      : [];

  const totalCount = places.length + rentals.length + accommodations.length + foods.length;

  return {
    query: cleanQuery,
    totalCount,
    places,
    rentals,
    accommodations,
    foods,
  };
}
