# HUẾ TRAVEL PRO V2.3 — PROJECT MASTER SUMMARY
## TỔNG QUAN DỰ ÁN & BẢN ĐỒ KIẾN TRÚC TOÀN DIỆN

```
Tài liệu: 01_PROJECT_MASTER_SUMMARY.md
Phiên bản: V2.3 ("Huế có chi hay?")
Thư mục dự án: A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro
Ngày chốt phiên Session 01: 22/10/2026
Trạng thái: GATE 00–05 LOCKED | GATE 06 CONDITIONAL PASS & LOCKED
```

---

## 1. TỔNG QUAN SẢN PHẨM & MỤC TIÊU

### 1.1 Tên và Định vị Thương hiệu
- **Tên nền tảng:** **HUẾ TRAVEL PRO**
- **Thông điệp cốt lõi:** *"Huế có chi hay?"* — Cổng thông tin trải nghiệm du lịch số hóa, toàn diện và đậm đà bản sắc Cố đô Huế.
- **Phiên bản hiện tại:** V2.3 (Bảo toàn chuẩn mực thiết kế, hiệu ứng chuyển cảnh mượt mà và nền tảng dữ liệu quan hệ chuẩn hóa cao).

### 1.2 Mục tiêu Sản phẩm
1. Cung cấp trải nghiệm khám phá Huế trực quan, hiện đại, xóa bỏ định kiến Huế "buồn và thiếu trải nghiệm".
2. Cung cấp dữ liệu chính xác, có nguồn gốc (provenance) về địa điểm tham quan, ẩm thực, thuê xe và cơ sở lưu trú.
3. Kiến trúc web tối ưu hóa hiệu năng, tương thích di động, hỗ trợ SEO và tương thích kiến trúc headless API.

### 1.3 Đối tượng Sử dụng
- **Du khách nội địa & quốc tế:** Tìm kiếm lịch trình, thông tin minh bạch về giá, địa chỉ và dịch vụ tại Huế.
- **Giới trẻ / Phượt thủ:** Tìm kiếm điểm check-in, ẩm thực đường phố, dịch vụ thuê xe máy linh hoạt.
- **Gia đình / Du khách nghỉ dưỡng:** Tìm kiếm khách sạn, resort, homestay uy tín, đầy đủ tiện ích.
- **Biên tập viên / Quản trị viên:** Quản lý vòng đời nội dung (Draft → Review → Published) với kiểm soát phân quyền nghiêm ngặt.

---

## 2. PHẠM VI TÍNH NĂNG & SITEMAP ĐÃ PHÊ DUYỆT

### 2.1 Cấu trúc Sitemap & Hệ thống Điều hướng
Hệ thống điều hướng chính (Navigation Header & Footer) gồm 5 phân hệ cốt lõi:
- **Trang chủ (`/`):** Hero section ấn tượng, thanh tìm kiếm nhanh, điểm nhấn di sản, danh mục trải nghiệm nổi bật, liên kết chuyển cảnh Hero-to-Sidebar.
- **Về Huế (`/ve-hue`):** Lịch sử, văn hóa, con người, thời tiết theo mùa và cẩm nang văn hóa ứng xử xứ Huế.
- **Khám Phá (`/kham-pha`):** Bộ lọc đa chiều di tích, danh thắng, check-in, ẩm thực, làng nghề; hỗ trợ hiển thị lưới và bản đồ.
- **Cẩm Nang (`/cam-nang`):** Kinh nghiệm di chuyển, mẹo du lịch, lịch trình gợi ý 2N1Đ, 3N2Đ, 4N3Đ.
- **Lưu Trú (`/luu-tru`):** Danh mục khách sạn, homestay, resort với bộ lọc tiện ích, mức giá và khu vực.

### 2.2 Hiệu ứng Chuyển cảnh Hero-to-Sidebar Đã Duyệt (Adaptive Navigation Transition)
- **Cơ chế tương tác đã được phê duyệt và nghiệm thu tại GATE 03:**
  - **Landing ➔ Trang con:** Khi người dùng nhấp menu điều hướng từ Landing Page, thanh navigation ngang (dạng capsule bo tròn) chuyển động tịnh tiến sang trái và biến đổi hình thái (morph) thành thanh Sidebar dọc cố định ở lề trái (`w-64`, `100vh`).
  - **Chuyển tiếp nội dung:** Nội dung giữa các trang được chuyển tiếp bằng hiệu ứng **crossfade** mượt mà (nội dung trang cũ fade-out, nội dung trang mới fade-in).
  - **Trở về Trang chủ:** Khi người dùng nhấp quay lại Trang chủ, thanh Sidebar dọc thu nhỏ và chuyển ngược trở về thành thanh navigation capsule ngang trên Landing Page.
  - **Trang con ➔ Trang con:** Sidebar bên trái được giữ cố định hoàn toàn; chỉ có thanh highlight đổi vị trí theo mục được chọn và nội dung trang thực hiện crossfade nhanh.
  - **Ranh giới tương tác:** Trigger chuyển cảnh là **sự kiện nhấp menu điều hướng (navigation click)**; tuyệt đối không mô tả hay sử dụng cuộn trang (scroll) làm trigger chính.

---

## 3. HỆ THỐNG THIẾT KẾ (DESIGN SYSTEM & TOKENS)

### 3.1 Bảng màu Chủ đạo Đã Phê duyệt (Core Color Tokens)
Đối chiếu Master Spec (Mục 3.3) và cấu hình Tailwind CSS (`tailwind.config.ts`), bộ màu chính thức gồm:
- **Lavender / Periwinkle (`#C2C6FA`):** Nền chuẩn ban đầu / Hero backdrop.
- **Deep Violet (`#4D3087`):** Panel / menu / nhận diện thương hiệu.
- **Soft Purple (`#9075F4`):** Tương tác phụ / hover / secondary actions.
- **Electric Lime (`#CAFA35`):** Accent tiết chế theo mockup đã duyệt.
- **Off-white (`#FAFAFC`):** Card nội dung / bề mặt chứa dữ liệu.
- **Dark Ink (`#251C39`):** Nội dung văn bản chính / heading.

*Các biến thể mở rộng theo mockup:* Warm Lavender (`#E8DDF5`), Imperial Plum (`#513568`), Warm Ivory (`#FFF9F2`), Warm Gold (`#F2C675`).  
*Lưu ý:* Tuyệt đối không tự ý thay thế bằng Imperial Gold, Teal hoặc các bộ màu ngoại lai khác ngoài bảng màu tham chiếu đã duyệt.

### 3.2 Typography & Phông chữ
- **Trạng thái phê duyệt Spec:** **`NOT VERIFIED`** (Chưa được chốt chuẩn font cụ thể trong Master Spec; Mục 2.2 Master Spec nêu rõ: *"Những lựa chọn chưa được chốt (KHÔNG TỰ QUYẾT): chuẩn font cụ thể"*).
- **Hiện trạng mã nguồn thực tế (`src/app/layout.tsx` & `tailwind.config.ts`):**
  - Font sans: Sử dụng font cục bộ Next.js `GeistVF.woff` qua biến CSS `var(--font-sans)` với chuỗi font dự phòng hệ thống (`'Segoe UI'`, `Roboto`, `Arial`, `sans-serif`).
  - Font serif: Chuỗi font dự phòng hệ thống (`'Segoe UI'`, `Georgia`, `serif`).
- **Ranh giới:** Ghi nhận trạng thái chính thức là **`NOT VERIFIED`**. Tuyệt đối không tự ý chọn hoặc khai báo thêm font mới (như Playfair Display, Cormorant Garamond, Be Vietnam Pro) khi chưa có sự phê duyệt bằng văn bản của Owner.

### 3.3 Quy tắc Bố cục Responsive & Khả năng Tiếp cận
- **Phân giải màn hình:** Desktop (≥ 1200px: Sidebar ở trang con, layout card nhiều cột), Tablet (768px – 1199px: Sidebar thu gọn hoặc menu thích ứng), Mobile (< 768px: Top Header + Drawer trên Landing, Bottom Navigation trên 4 trang con).
- **Tiếp cận & Thao tác:** Tối ưu hóa kích thước cảm ứng (touch targets ≥ 44px) và độ tương phản màu chữ đạt chuẩn WCAG AA.

---

## 4. NGĂN XẾP CÔNG NGHỆ (TECH STACK)

| Lớp Kiến trúc | Công nghệ Sử dụng | Phiên bản | Vai trò / Mục đích |
|:---|:---|:---:|:---|
| **Framework** | Next.js (App Router) | `14.2.35` | Server Components, Routing, SSR/SSG |
| **Core UI** | React | `18.3.1` | Thư viện giao diện người dùng |
| **Language** | TypeScript | `5.x` | Kiểu dữ liệu tĩnh nghiêm ngặt |
| **Styling** | Tailwind CSS | `3.4.x` | Utility-first CSS, Custom tokens |
| **Package Manager**| pnpm | `9.x` | Quản lý phụ thuộc cô lập, hiệu năng cao |
| **ORM** | Prisma Client & CLI | `5.14.0` | Object-Relational Mapping, Type-safe DB access |
| **Database Engine**| PostgreSQL | `17.x` | Supabase Cloud DEV (Project `rgoqdykpqyedambkrlvr`) |
| **Security Layer** | Row Level Security (RLS)| Native Postgres | 19 policies, bảo vệ dữ liệu Draft |
| **Integrity Triggers**| PL/pgSQL Triggers | Native Postgres | 5 deferred triggers bảo vệ quan hệ 1:1 subtype |

---

## 5. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro\
├── .env                               # Cấu hình biến môi trường kết nối DEV (Protected)
├── .env.example                       # File mẫu cấu hình biến môi trường
├── package.json                       # Khai báo dependencies và scripts
├── pnpm-lock.yaml                     # Khóa phiên bản gói phụ thuộc
├── tailwind.config.ts                 # Cấu hình Design Tokens, colors, fonts
├── tsconfig.json                      # Cấu hình TypeScript compiler
├── prisma/
│   ├── schema.prisma                  # [LOCKED V5] File định nghĩa 22 bảng cơ sở dữ liệu
│   └── migrations/
│       └── 20261021201500_init_22_tables/
│           └── migration.sql          # [LOCKED V5] DDL SQL khởi tạo 22 bảng, RLS, triggers
├── src/
│   ├── app/                           # Next.js App Router (Giao diện các trang)
│   │   ├── layout.tsx                 # Root layout toàn hệ thống
│   │   ├── page.tsx                   # Trang chủ ("Huế có chi hay?")
│   │   ├── ve-hue/page.tsx            # Trang Về Huế
│   │   ├── kham-pha/page.tsx          # Trang Khám Phá
│   │   ├── cam-nang/page.tsx          # Trang Cẩm Nang
│   │   └── luu-tru/page.tsx           # Trang Lưu Trú
│   ├── components/                    # Thư viện component giao diện tái sử dụng
│   │   ├── common/                    # Button, Card tái sử dụng
│   │   ├── layout/                    # Shell (Shared Layout), Container
│   │   └── navigation/                # AdaptiveNavigation (Hero-to-Sidebar), Header, SubpageTopBar
│   ├── context/                       # TransitionContext (State machine điều khiển chuyển cảnh)
│   ├── data/                          # [LOCKED] 20 bản ghi nguồn TypeScript gốc
│   │   ├── places.ts                  # 6 địa điểm (p1–p6)
│   │   ├── rentals.ts                 # 6 đơn vị thuê xe (r1–r6)
│   │   └── accommodations.ts          # 8 cơ sở lưu trú (a1–a8)
│   └── lib/                           # Utility functions, helpers
└── PROJECT_HANDOFF/
    └── SESSION_01_GATE_00_TO_06/     # Thư mục chứa bộ hồ sơ bàn giao chính thức
```

---

## 6. PHÂN BIỆT TRẠNG THÁI TRIỂN KHAI THỰC TẾ

> [!IMPORTANT]
> Cần phân biệt rõ ràng 3 trạng thái của các thành phần trong dự án để tránh ngộ nhận kỹ thuật:

1. **SPECIFICATION APPROVED (Đặc tả đã phê duyệt):**
   - Tài liệu Master Spec V2.3.
   - Thiết kế kiến trúc 22 bảng cơ sở dữ liệu và ERD.
   - Các quy tắc kinh doanh: Giá 16/3/1, OD-01 (Hotline), OD-02 (Địa chỉ nguyên vẹn), OD-03 (Brand = Name), OD-04 (Chuẩn hóa loại lưu trú).
2. **UI APPROVED (Giao diện đã phê duyệt):**
   - Các màn hình giao diện tĩnh và tương tác CSS/Framer Motion đã được nghiệm thu qua GATE 00–05.
   - **Lưu ý then chốt:** Giao diện frontend hiện tại đang chạy trên nguồn dữ liệu mock cục bộ (`src/data/*.ts`), **CHƯA ĐƯỢC KẾT NỐI VỚI CLOUD DATABASE**.
3. **IMPLEMENTED & TESTED (Đã triển khai và kiểm thử trên Cloud):**
   - Cơ sở dữ liệu Supabase DEV (`rgoqdykpqyedambkrlvr`) đã tạo thành công 22 bảng, 19 RLS, 5 trigger hoãn.
   - Cloud Seed đã nạp thành công 260 hàng vào 17 bảng (20 content items đều ở trạng thái `draft`, 6 media unpublished).
   - Kiểm toán bảo mật D01–D05, D06-01 (HTTPS Public API với key) và D07 đã đạt **100% PASS**.
   - **Giới hạn tồn đọng:** D06-02 (Authenticated API với JWT) là ngoại lệ chuyển tiếp (`BLOCKED / NOT TESTED`).
   - Việc nối frontend Next.js với Supabase Cloud DB thuộc phạm vi tương lai, **chưa được triển khai trong GATE 06**.
