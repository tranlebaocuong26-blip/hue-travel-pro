# HUẾ TRAVEL PRO V2.3 — CỐ ĐÔ HUẾ
# BÁO CÁO GIẢI TRÌNH VÀ LÀM RÕ KIỂM TOÁN HIỆN TRẠNG
## MÃ TÀI LIỆU: GATE-07-00-AUDIT-CLARIFICATION
**Dự án:** HUẾ TRAVEL PRO V2.3 — “Huế có chi hay?”  
**Phiên bản:** V1.0  
**Ngày thực hiện:** 24/10/2026  
**Chế độ thực thi:** READ-ONLY CLARIFICATION ONLY  
**Nguyên tắc cốt lõi:** PASS = LOCK — FIX ONLY WHAT FAILED — NO SCOPE CREEP

---

## 01. ĐẾM THỰC TẾ SỐ PHẦN TỬ TRONG BA FILE DỮ LIỆU NGUỒN

Thực hiện trích xuất và đếm số lượng bản ghi thực tế (thông qua phân tích cú pháp mảng đối tượng, kiểm tra `id` và `slug`) tại thư mục `src/data/`:

| Tệp dữ liệu | Số lượng phần tử | Danh sách `id` | Danh sách `slug` chi tiết |
| :--- | :---: | :---: | :--- |
| [`src/data/places.ts`](file:///A:/trí%20tuệ%20nhân%20tạo/BAI_3/hue-travel-pro/src/data/places.ts) | **6** | `p1` đến `p6` | 1. `dai-noi-hue`<br>2. `cau-truong-tien`<br>3. `doi-thien-an`<br>4. `bai-bien-lang-co`<br>5. `chua-thien-mu`<br>6. `lang-huong-thuy-xuan` |
| [`src/data/rentals.ts`](file:///A:/trí%20tuệ%20nhân%20tạo/BAI_3/hue-travel-pro/src/data/rentals.ts) | **6** | `r1` đến `r6` | 1. `dong-xanh-motorbike`<br>2. `kevin-motorbike`<br>3. `hidibike-hue`<br>4. `thue-xe-hanh-thao`<br>5. `thue-xe-nam-thanh`<br>6. `thue-xe-chi-chi` |
| [`src/data/accommodations.ts`](file:///A:/trí%20tuệ%20nhân%20tạo/BAI_3/hue-travel-pro/src/data/accommodations.ts) | **8** | `a1` đến `a8` | 1. `lucia-homestay-coffee`<br>2. `tropikult-homestay`<br>3. `muong-thanh-holiday-hue`<br>4. `indochine-palace`<br>5. `nam-mua-boutique`<br>6. `a-maze-house`<br>7. `senna-hue-hotel`<br>8. `pilgrimage-village` |
| **TỔNG CỘNG** | **20** | | **20 thực thể nội dung hạt giống** |

*(Ghi chú: Tệp [`src/data/heritage.ts`](file:///A:/trí%20tuệ%20nhân%20tạo/BAI_3/hue-travel-pro/src/data/heritage.ts) chứa 4 chủ đề di sản dùng riêng cho trang Về Huế, không nằm trong tập danh mục hạt giống của `content_items`).*

---

## 02. ĐỐI CHIẾU SHA-256 VỚI LOCKED ARTIFACTS REGISTER

Bảng đối chiếu giá trị băm SHA-256 tính toán thực tế của 3 file nguồn cục bộ với Hồ sơ bàn giao phiên 01 ([`03_LOCKED_ARTIFACTS_REGISTER.md`](file:///A:/trí%20tuệ%20nhân%20tạo/BAI_3/hue-travel-pro/PROJECT_HANDOFF/SESSION_01_GATE_00_TO_06/03_LOCKED_ARTIFACTS_REGISTER.md)):

| STT Register | Tên file | SHA-256 trong Locked Register | SHA-256 tính toán thực tế trên đĩa | Trạng thái | Ghi chú |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **13** | `src/data/places.ts` | `3F7061E7F89EFB7A4742F3E0D3B443C6AD76944A9C93613B2382549179CD3C39` | `3F7061E7F89EFB7A4742F3E0D3B443C6AD76944A9C93613B2382549179CD3C39` | **MATCH 100%** | GATE 04 (LOCKED) |
| **14** | `src/data/rentals.ts` | `FB3DD93B1C95C2CA62B033DD10A50AB5EEFCDB9956622EA667362032AF395E27` | `FB3DD93B1C95C2CA62B033DD10A50AB5EEFCDB9956622EA667362032AF395E27` | **MATCH 100%** | GATE 04 (LOCKED) |
| **15** | `src/data/accommodations.ts` | `B960142F3C50117D937200A7854DE0DB44BC6404FF35F6C9ADE84158994C85BA` | `B960142F3C50117D937200A7854DE0DB44BC6404FF35F6C9ADE84158994C85BA` | **MATCH 100%** | GATE 04 (LOCKED) |

**Kết luận xác minh SHA-256:** Cả 3 tệp dữ liệu nguồn hoàn toàn nguyên vẹn, không có bất kỳ ký tự nào bị thay đổi so với bản đã nghiệm thu và khóa tại GATE 04 / GATE 06.

---

## 03. GIẢI THÍCH SỰ KHÁC BIỆT SỐ LIỆU: GATE 06 SO VỚI BÁO CÁO GATE 07-00

### 3.1 Bản chất dữ liệu: Hoàn toàn KHÔNG có sự phân kỳ
- **Cơ sở dữ liệu đám mây Supabase DEV (GATE 06):**
  - Bảng `places`: **6 dòng** (`p1` đến `p6`).
  - Bảng `rental_providers`: **6 dòng** (`r1` đến `r6`).
  - Bảng `accommodations`: **8 dòng** (`a1` đến `a8`).
  - Bảng gốc `content_items`: **20 dòng** ($6 + 6 + 8 = 20$).
  *(Tham chiếu chính xác tại mục 2.2 bảng phân loại thực thể của tài liệu `04_ARCHITECTURE_AND_DATA_STATE.md`).*
- **Tệp TypeScript nguồn cục bộ (Local Mock):**
  - `src/data/places.ts`: **6 phần tử** (`p1` đến `p6`).
  - `src/data/rentals.ts`: **6 phần tử** (`r1` đến `r6`).
  - `src/data/accommodations.ts`: **8 phần tử** (`a1` đến `a8`).
  - Tổng số phần tử: **20 phần tử**.

### 3.2 Nguyên nhân sự khác biệt trong văn bản Báo cáo GATE 07-00 V1.0
- Sự khác biệt xuất phát hoàn toàn từ **lỗi đánh máy đảo số (transposition typographical error)** của kiểm toán viên trong quá trình soạn thảo văn bản báo cáo tổng quan GATE-07-00 V1.0 (ghi nhầm thành *"8 Places / 6 Rentals / 6 Accommodations"* thay vì *"6 Places / 6 Rentals / 8 Accommodations"*).
- **Khẳng định:** Cả hai tầng dữ liệu (Local Mock và Cloud Database) từ trước đến nay đều hoàn toàn đồng nhất về số lượng thực thể: **6 Địa điểm — 6 Xe thuê — 8 Cơ sở lưu trú (Tổng 20)**. Không có sự sai lệch dữ liệu giữa môi trường local và cloud seed.

---

## 04. RÀ SOÁT DANH MỤC HỢP LỆ VÀ ĐÁNH GIÁ LẠI ĐỀ XUẤT SỬA BUG-01

### 4.1 Hợp đồng kiểu dữ liệu (Type Contract)
Theo định nghĩa chuẩn tại [`src/types/content.ts`](file:///A:/trí%20tuệ%20nhân%20tạo/BAI_3/hue-travel-pro/src/types/content.ts#L40-L45):
```typescript
export interface Place {
  id: string;
  slug: string;
  name: string;
  category: "di-tich" | "camping" | "bien" | "check-in";
  categoryLabel: string;
  // ...
}
```
Tập hợp danh mục hợp lệ (`category`) cho `Place` **CHỈ GỒM 4 GIÁ TRỊ DUY NHẤT**:
1. `"di-tich"`: Di tích & danh thắng (Gồm: Đại Nội Huế `p1`, Chùa Thiên Mụ `p5`).
2. `"camping"`: Camping & dã ngoại (Gồm: Đồi Thiên An `p3`).
3. `"bien"`: Biển & nghỉ dưỡng (Gồm: Bãi biển Lăng Cô `p4`).
4. `"check-in"`: Check-in nổi bật (Gồm: Cầu Trường Tiền `p2`, Làng hương Thủy Xuân `p6`).

### 4.2 Hành vi của bộ lọc tại [`src/lib/search.ts`](file:///A:/trí%20tuệ%20nhân%20tạo/BAI_3/hue-travel-pro/src/lib/search.ts#L96-L99)
Logic lọc địa điểm:
```typescript
if (category !== "all" && place.category !== category) {
  return false;
}
```

### 4.3 Đánh giá sai sót trong đề xuất sửa BUG-01 trước đây
- Trong báo cáo GATE-07-00 V1.0, đề xuất sửa BUG-01 từng nêu:
  *Đổi `href` thành `/kham-pha?category=di-tich`, `/kham-pha?category=van-hoa`, `/kham-pha?category=am-thuc`.*
- **ĐÂY LÀ ĐỀ XUẤT SAI VÀ GÂY HỎNG TRẢI NGHIỆM:**
  - Vì `"van-hoa"` và `"am-thuc"` **KHÔNG TỒN TẠI** trong union type `Place.category`.
  - Trong `places.ts` không có bất kỳ địa điểm nào mang danh mục `van-hoa` hay `am-thuc`.
  - Nếu người dùng bấm vào liên kết `/kham-pha?category=van-hoa` hoặc `/kham-pha?category=am-thuc`, bộ lọc `searchPlaces` sẽ so khớp `place.category !== category` và loại bỏ 100% kết quả, dẫn tới màn hình **"Không tìm thấy địa điểm phù hợp" (Empty State)**!

### 4.4 Phương án xử lý chuẩn mực cho 3 thẻ Dock chân Trang chủ
Để bảo đảm tính toàn vẹn và không gây lỗi khi demo:
1. **Thẻ 1 — "Di tích - Lịch sử":**
   - Hợp lệ: `href="/kham-pha?category=di-tich"`.
   - Kết quả: Lọc ra chính xác 2 điểm đến nổi tiếng nhất: *Đại Nội Huế* và *Chùa Thiên Mụ*.
2. **Thẻ 2 — "Văn hoá - Tâm linh":**
   - Không dùng `category=van-hoa`.
   - Lựa chọn an toàn A: `href="/kham-pha?category=di-tich"` (chung nhóm di tích tâm linh).
   - Lựa chọn an toàn B: `href="/ve-hue"` (chuyển sang trang Cố Đô giới thiệu sâu về văn hoá nhã nhạc, di sản triều Nguyễn).
   - Lựa chọn an toàn C: `href="/kham-pha?q=chùa"` hoặc `href="/tim-kiem?q=tam linh"`.
3. **Thẻ 3 — "Ẩm thực Huế":**
   - Không dùng `category=am-thuc` trên trang Khám phá (vì `places.ts` chỉ quản lý danh thắng, lăng tẩm, bãi biển).
   - Lựa chọn an toàn A: `href="/ve-hue#am-thuc"` (dẫn tới chuyên mục Ẩm thực Cố Đô trên trang Về Huế).
   - Lựa chọn an toàn B: `href="/tim-kiem?q=ẩm thực"`.
4. **Lựa chọn khuyến nghị cho Student Demo:**
   - **GIỮ NGUYÊN THIẾT KẾ HIỆN TẠI (`href="/kham-pha"`):** 3 thẻ dock đóng vai trò như các khối giới thiệu giá trị cốt lõi (Overview Highlights) dẫn người dùng vào cổng Khám phá chung. Đây không phải lỗi bắt buộc sửa, không vi phạm hợp đồng và an toàn tuyệt đối 100% cho bài trình diễn.

---

## 05. ĐIỀU CHỈNH KẾT LUẬN DEMO READINESS

Nhằm tuân thủ tuyệt đối quy định tại Điều 04.3 và Điều 08 của Chỉ thị Owner (*"Không đồng nhất STATIC VERIFIED với chức năng chạy thành công", "Tuyệt đối không báo RUNTIME PASS chỉ dựa vào đọc code"*):

### 5.1 Điều chỉnh phân định kiểm toán
- **STATIC CODE AUDIT: 95% (RẤT CAO / CẤU TRÚC HOÀN THIỆN)**.
  - Mã nguồn sạch: 0 lỗi TypeScript (`tsc --noEmit`), 0 cảnh báo ESLint (`eslint src`).
  - Toàn bộ hình ảnh tài nguyên tồn tại đủ 100% trong `public/images/`.
  - Toàn bộ routing động `[slug]` định nghĩa `generateStaticParams()` khớp 100% dữ liệu mock.
- **RUNTIME VERIFICATION: `RUNTIME NOT TESTED`**.
  - Do trong phiên kiểm toán hiện tại, server cục bộ (`localhost:3000`) chưa được bật và chưa có lệnh cấp phép kiểm thử động trên trình duyệt.
  - Tuyệt đối **KHÔNG KHẲNG ĐỊNH** các tương tác client-side (như Framer Motion layout morphing, hydration, mobile drawer gesture) đã PASS ở cấp độ runtime.

### 5.2 Bảng tổng kết trạng thái điều chỉnh

| Tiêu chí | Đánh giá trước | Đánh giá điều chỉnh chuẩn hóa | Lý giải |
| :--- | :---: | :---: | :--- |
| **Tính toàn vẹn mã nguồn** | 95% | **95% (STATIC VERIFIED)** | Dựa trên phân tích cú pháp tĩnh và kiểm tra kiểu |
| **Trạng thái Runtime** | Chưa rõ ràng | **`RUNTIME NOT TESTED`** | Chưa có phiên chạy trình duyệt thực tế |
| **Phân bổ Mock Data** | 8 Places / 6 / 6 | **6 Places / 6 Rentals / 8 Accommodations** | Khớp 100% với GATE 06 và Locked Register |
| **Đề xuất BUG-01** | `category=am-thuc` | **HỦY ĐỀ XUẤT SAI — GIỮ NGUYÊN HOẶC DÙNG ROUTE HỢP LỆ** | Tránh gây lỗi Empty State trên `/kham-pha` |

---

## 06. TUYÊN BỐ BẢO TOÀN (NON-MUTATION AFFIRMATION)

- **Không sửa file code nào.**
- **Không chạy seed, không sửa cơ sở dữ liệu Supabase.**
- **Không cài đặt dependency.**
- **Không mở GATE 07-01.**

```text
================================================================================
STOP — AWAIT OWNER ACCEPTANCE.
================================================================================
```
