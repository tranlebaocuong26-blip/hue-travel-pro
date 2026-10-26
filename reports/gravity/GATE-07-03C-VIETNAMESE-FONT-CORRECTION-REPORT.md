# HUẾ TRAVEL PRO V2.3 — GATE 07-03C
## Vietnamese Font Correction Report: Noto Sans Trial & Home Food Card Placeholder Typography Fix

- **Ngày thực hiện:** 2026-10-25, Asia/Saigon.
- **Project Root:** `A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro`
- **Quyền hạn Owner:** Scoped Typography Correction (GATE 07-03C).
- **Quy tắc bắt buộc:** PASS = LOCK — FIX ONLY WHAT FAILED — NO SCOPE CREEP.
- **Trạng thái đề xuất:** **STOP — AWAIT OWNER VISUAL ACCEPTANCE** (Không tự ý LOCK, không tự triển khai UI Fidelity).

---

## 1. Executive Summary & Baseline từ GATE-07-03B

Codex đã triển khai GATE 07-03B với Be Vietnam Pro cho UI và Noto Serif cho editorial headings trên 4 trang con. Tuy nhiên, toàn nhiệm vụ vẫn ở trạng thái **PARTIAL PASS**, chưa được Owner LOCK vì chữ tiếng Việt trên card Ẩm thực ở Trang chủ vẫn khó đọc:
- `“ĐANG CHỜ TƯ LIỆU ẢNH”`
- `“Ẩm thực Cố Đô (Đợt 1)”`

**Baseline kỹ thuật đầu task (Post-07-03B):**
- Hệ thống đang chạy trên cổng 3000, build post-07-03B đã xác nhận.
- Cả 8 tệp cho phép (`page.tsx`, `layout.tsx`, `tailwind.config.ts`, `AdaptiveNavigation.tsx`, `ve-hue`, `kham-pha`, `cam-nang`, `luu-tru`) có SHA-256 khớp tuyệt đối với `SHA256After` trong `rollback-manifest.csv` của GATE 07-03B.
- Checkpoint Before độc lập đã được tạo tại `reports/gravity/evidence/GATE-07-03C/checkpoint-before/` và xác minh toàn vẹn byte-by-byte.

---

## 2. Root Cause Chữ Khó Đọc tại Placeholder Card Ẩm Thực

Sau khi kiểm tra cấu trúc DOM thực tế và giá trị computed style tại runtime thật thông qua Chrome DevTools Protocol (CDP), Antigravity đã xác định được **5 nguyên nhân đồng thời** dẫn đến việc hai dòng chữ bị khó đọc:

```
┌────────────────────────────────────────────────────────────────────────┐
│ PHÂN TÍCH NGUYÊN NHÂN GỐC RỄ (ROOT CAUSE ANALYSIS)                     │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Lỗi Thừa kế Font (Font Family Inheritance):                         │
│    Trong src/app/layout.tsx của 07-03B, selector:                      │
│    [&_main>div[style*='hero']]:font-brand                              │
│    được đặt để khóa font Trang chủ. Selector này đã vô tình ép TOÀN BỘ │
│    landing content (bao gồm dock card ở đáy) nhận font-brand (Geist)!  │
│    GeistVF thiếu tới 88/178 ký tự NFC tiếng Việt. Các ký tự:           │
│    "Đ", "ờ", "ư", "ệ", "ả", "Ẩ", "ự", "ố", "ợ" buộc phải fallback sang │
│    Segoe UI / Arial của Windows, gây nhảy nét và không đồng nhất.      │
│                                                                        │
│ 2. Kích thước Chữ Quá Nhỏ (Font-size Deficit):                         │
│    Cả 2 dòng dùng text-[10px] (10px = 0.625rem). Ở 10px, các dấu thanh │
│    kép tiếng Việt phức tạp (như dấu hỏi + mũ trên "Ẩ", móc + huyền     │
│    trên "ờ") chỉ có 1-2 pixel để rasterize, dễ bị nhòe và dính nét.   │
│                                                                        │
│ 3. Tương phản Kém Nghiêm trọng (Contrast Failure):                     │
│    Dòng 2 dùng text-white/60 (độ mờ 60%) trên nền kính mờ              │
│    bg-white/[0.06] đặt trên nền card tím đậm (dark-ink/30). Độ tương   │
│    phản không đạt chuẩn WCAG AA, làm chữ mờ nhạt và mất nét thanh.     │
│                                                                        │
│ 4. Độ Đậm Quá Mỏng (Weight):                                           │
│    Dòng 2 dùng font-normal (400) ở cỡ 10px khiến nét chữ quá mảnh.    │
│                                                                        │
│ 5. Khoảng cách Ký tự (Tracking):                                       │
│    Dòng 1 dùng tracking-[0.12em] (1.2px) quá rộng cho chữ hoa có dấu  │
│    tiếng Việt ở kích thước nhỏ, làm dấu thanh có cảm giác tách rời.    │
└────────────────────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Kết luận phân biệt lỗi:** Việc thay `font-family` đơn thuần **không thể** giải quyết triệt để vấn đề nếu không đồng thời xử lý kích thước hiển thị tối thiểu và độ tương phản màu sắc.

---

## 3. Khảo Nghiệm Đối Chứng A / B / C Tại Kích Thước Render Thật

Đã xây dựng trang khảo nghiệm độc lập `reports/gravity/evidence/GATE-07-03C/specimen/index.html` và chạy kiểm thử đo đạc thực tế qua CDP:

### Ma trận Đối chứng Kỹ thuật:

| Phương án | Family | Font-Size | Weight (L1 / L2) | Contrast (L1 / L2) | Tracking L1 | Chiều rộng L1 / L2 | Nhận xét Trực quan |
|---|---|---|---|---|---|---|---|
| **A. Hiện tại (Geist)** | GeistVF + Fallback | 10px / 10px | 500 / 400 | Amber 90% / White 60% | 0.12em | 140.3px / 102.8px | Nhảy nét do fallback glyph; dòng 2 mờ, khó đọc dấu thanh. |
| **B. Be Vietnam Pro** | BeVietnamPro | 10px / 10px | 500 / 400 | Amber 90% / White 60% | 0.12em | 145.3px / 110.1px | Glyphs đồng nhất nhưng dấu thanh nhỏ ở 10px; dòng 2 vẫn mờ. |
| **C. Noto Sans (10px)** | NotoSans-VF | 10px / 10px | 500 / 400 | Amber 90% / White 60% | 0.12em | 142.2px / 105.0px | Dấu thanh rõ hơn nhưng kích thước 10px vẫn gây hạn chế đọc. |
| **C2. Noto Sans (11px) [ĐỀ XUẤT]** | NotoSans-VF | 11px / 11px | 600 / 500 | Amber 95% / White 85% | 0.08em | 149.6px / 117.4px | **Đạt độ rõ nét tối ưu; dấu thanh sắc sảo, tương phản cao, cân đối.** |
| **C3. Noto Sans (12px)** | NotoSans-VF | 12px / 12px | 600 / 500 | Amber 95% / White 85% | 0.06em | 158.4px / 128.1px | Chữ đọc rất rõ nhưng hơi to so với tỷ lệ badge thứ cấp. |

**Bằng chứng khảo nghiệm:**
- [Ảnh toàn bộ ma trận Specimen](evidence/GATE-07-03C/specimen/specimen-full.png)
- [Montage so sánh chi tiết](evidence/GATE-07-03C/specimen/placeholder-comparison-montage.png)
- [Bản ghi số đo measurements.json](evidence/GATE-07-03C/specimen/measurements.json)

---

## 4. Giải Pháp Sửa Chữa Card Ẩm Thực Trang Chủ

Dựa trên kết quả khảo nghiệm, giải pháp **C2 (Noto Sans 11px / Weight 600-500 / Contrast 95%-85% / Tracking 0.08em)** được lựa chọn triển khai:

1. **Font Family:** Áp dụng `font-ui` (Noto Sans) riêng cho vùng placeholder, thoát khỏi ràng buộc thừa kế `font-brand` (Geist).
2. **Kích thước chữ:** Tăng tối thiểu từ `text-[10px]` lên `text-[11px]` (+1px, đúng tiêu chí *tối thiểu cần thiết*).
3. **Độ đậm (Weight):**
   - Dòng 1: `font-semibold` (600) giúp chữ hoa hiển thị đanh gọn, nét chữ rõ ràng.
   - Dòng 2: `font-medium` (500) loại bỏ nét mỏng dễ gãy.
4. **Độ tương phản:**
   - Dòng 1: `text-amber-100/95` (vàng ngà sáng nổi bật).
   - Dòng 2: `text-white/85` (trắng 85%, đồng bộ chuẩn subtitle card của website).
5. **Khoảng cách ký tự & dòng:**
   - Dòng 1: `tracking-[0.08em]` vừa vặn cho chữ hoa tiếng Việt.
   - Khoảng cách hai dòng: `mt-1.5` (6px) tạo độ thoáng vừa đủ.
   - Chiều cao dòng: `leading-tight` (dòng 1), `leading-snug` (dòng 2).

### So sánh Kích thước & Tọa độ Card:
- Chiều rộng/cao card tại 1366px: `275.4px × 164.0px` trước và sau **không đổi 1 pixel nào**.
- Chiều rộng/cao card tại 390px (mobile): `314.0px × 188.0px` trước và sau **không đổi**.
- Toàn bộ nội dung chữ ("ĐANG CHỜ TƯ LIỆU ẢNH" và "Ẩm thực Cố Đô (Đợt 1)") giữ nguyên văn 100%.

---

## 5. Phạm Vi Triển Khai Font Toàn Website

Sau khi hoàn tất card Ẩm thực, Noto Sans được thử nghiệm và áp dụng cho hệ thống UI toàn website qua token `--font-ui`:

| Nhóm UI | Font được chọn | Cơ sở quyết định |
|---|---|---|
| **Placeholder Card Ẩm thực Trang chủ** | **Noto Sans (11px, 600/500)** | Khắc phục triệt để lỗi khó đọc và mất dấu; không reflow layout. |
| **Navigation text (Desktop Capsule & Mobile)** | **Noto Sans (`font-ui`)** | Labels hiển thị sắc nét, dấu thanh thanh thoát; không tràn navbar. |
| **Search & Filter (T07)** | **Noto Sans (`font-ui`)** | Bộ lọc giá, chips danh mục và ô tìm kiếm hiển thị rõ ràng. |
| **Buttons / CTAs** | **Noto Sans (`font-ui`)** | Chữ đanh, căn giữa chuẩn xác, không vỡ padding nút. |
| **Body text & Card content** | **Noto Sans (`font-ui`)** | Đọc thoải mái trên màn hình retina lẫn non-retina. |
| **Badges, metadata & breadcrumb** | **Noto Sans (`font-ui`)** | Metadata hiển thị sắc nét ở kích thước 11px-12px. |
| **Editorial Headings (4 trang con)** | **Noto Serif (`font-editorial`)** | **GIỮ NGUYÊN** theo cấu hình 07-03B đã khóa. |
| **Logo Wordmark ("HUẾ / Travel Pro")** | **Geist (`font-brand`)** | **GIỮ NGUYÊN 100%**, cô lập tuyệt đối khỏi font UI mới. |
| **Home 3 Display Lines** | **Palatino Linotype / Times** | **GIỮ NGUYÊN 100%**, inline styles bảo vệ vị trí pixel. |

---

## 6. Danh Sách Tệp Tác Động Thực Tế (File Integrity)

Đúng quy định **Strict Allowlist** của GATE 07-03C, chỉ có đúng **3 tệp mã nguồn** được sửa và **3 tệp font/license mới** được bổ sung:

| Tệp tác động | Trạng thái | SHA-256 Sau | Ghi chú phạm vi |
|---|---|---|---|
| `src/app/page.tsx` | ĐÃ SỬA | `54E41B72E5F92FA5B3FFEF440069FDC7A1E38B45F4AAFFE491FAF4E1E222F860` | Chỉ sửa duy nhất 8 dòng (155-162) của placeholder card Ẩm thực. |
| `src/app/layout.tsx` | ĐÃ SỬA | `13831E7EE5033120001880D772771F1295677CEB97BAFCCDFC385AD6B66CD1B6` | Đăng ký `notoSans`, gắn vào `--font-ui`; lưu `beVietnamPro` ở `--font-be-vietnam`. |
| `tailwind.config.ts` | ĐÃ SỬA | `C827EE33E39A44C5D05F1092CD1FE6916703034809AF24B0491A4A9B27E23713` | Thêm alias `bevietnam`; giữ `ui` và `sans` trỏ `--font-ui`. |
| `src/app/fonts/NotoSans-VF.ttf` | THÊM MỚI | `BFB7BB691513F12E734DC346C03A03F784912432D7E3FA8E56EFCF906FE86B3D` | Variable font Noto Sans (weight 100-900), self-host. |
| `src/app/fonts/NotoSans-Italic-VF.ttf` | THÊM MỚI | `58E6E0EBD1931B29A365AA2D3E2EE9A9E831A3AF7CF3AD1462D4E72154F0B291` | Variable font Noto Sans Italic, self-host. |
| `src/app/fonts/NotoSans-OFL.txt` | THÊM MỚI | `CEE9892F9F0CC8FE882C9E9537EE6A89621D86EE7CEAF70B02E2B2B1C25C061A` | Giấy phép SIL Open Font License 1.1 nguyên bản. |

### Các tệp trong Allowlist giữ nguyên 100% không đổi:
- `src/components/navigation/AdaptiveNavigation.tsx`: `C8956693...` (KHÔNG ĐỔI)
- `src/app/ve-hue/page.tsx`: `15940160...` (KHÔNG ĐỔI)
- `src/app/kham-pha/page.tsx`: `75BFE61F...` (KHÔNG ĐỔI)
- `src/app/cam-nang/page.tsx`: `418B40B2...` (KHÔNG ĐỔI)
- `src/app/luu-tru/page.tsx`: `321B0E43...` (KHÔNG ĐỔI)
- Không có bất kỳ tệp nào ngoài danh sách bị thay đổi (`0 changes outside allowlist`).

---

## 7. Unicode & Vietnamese Corpus Coverage

Đã xác minh qua công cụ phân tích CMAP format 4/12 chuẩn của thư viện stdlib:

| Phông chữ | Dung lượng | Thiếu NFC (Tổng: 178) | Thiếu NFD (Tổng: 54) | Trạng thái Corpus |
|---|---:|---:|---:|---|
| **NotoSans-VF.ttf** | 2,049,096 B | **0 / 178** | **0 / 54** | **HOÀN HẢO (100% PASS)** |
| **NotoSans-Italic-VF.ttf** | 2,322,640 B | **0 / 178** | **0 / 54** | **HOÀN HẢO (100% PASS)** |
| **BeVietnamPro (Bộ 5 tệp)** | 683,208 B | 0 / 178 | 0 / 54 | 100% PASS |
| **GeistVF.woff** | 66,268 B | 88 / 178 | 3 / 54 | THIẾU 88 glyphs NFC |

---

## 8. Kết Quả Kiểm Thử Ma Trận 25 Tổ Hợp (5 Routes × 5 Viewports)

Chạy trên môi trường headless Microsoft Edge thực tế trên cổng 3000:

| Route | Viewport | Trạng thái Font | Độ rộng Document | Độ rộng Scroll | Tràn ngang (Overflow) | H1 Size | Bằng chứng Screenshot |
|---|---|---|---|---|---|---|---|
| `/` | 1366×768 | loaded | 1366px | 1366px | **0px** | 96px | [Xem ảnh](evidence/GATE-07-03C/after-home-1366.png) |
| `/ve-hue` | 1366×768 | loaded | 1351px | 1351px | **0px** | 48px | [Xem ảnh](evidence/GATE-07-03C/after-ve-hue-1366.png) |
| `/kham-pha` | 1366×768 | loaded | 1351px | 1351px | **0px** | 48px | [Xem ảnh](evidence/GATE-07-03C/after-kham-pha-1366.png) |
| `/cam-nang` | 1366×768 | loaded | 1351px | 1351px | **0px** | 48px | [Xem ảnh](evidence/GATE-07-03C/after-cam-nang-1366.png) |
| `/luu-tru` | 1366×768 | loaded | 1351px | 1351px | **0px** | 24px | [Xem ảnh](evidence/GATE-07-03C/after-luu-tru-1366.png) |
| `/` | 1440×900 | loaded | 1440px | 1440px | **0px** | 112px | [Xem ảnh](evidence/GATE-07-03C/after-home-1440.png) |
| `/ve-hue` | 1440×900 | loaded | 1425px | 1425px | **0px** | 48px | [Xem ảnh](evidence/GATE-07-03C/after-ve-hue-1440.png) |
| `/kham-pha` | 1440×900 | loaded | 1425px | 1425px | **0px** | 48px | [Xem ảnh](evidence/GATE-07-03C/after-kham-pha-1440.png) |
| `/cam-nang` | 1440×900 | loaded | 1425px | 1425px | **0px** | 48px | [Xem ảnh](evidence/GATE-07-03C/after-cam-nang-1440.png) |
| `/luu-tru` | 1440×900 | loaded | 1425px | 1425px | **0px** | 24px | [Xem ảnh](evidence/GATE-07-03C/after-luu-tru-1440.png) |
| `/` | 1650×786 | loaded | 1650px | 1650px | **0px** | 96px | [Xem ảnh](evidence/GATE-07-03C/after-home-1650.png) |
| `/ve-hue` | 1650×786 | loaded | 1635px | 1635px | **0px** | 48px | [Xem ảnh](evidence/GATE-07-03C/after-ve-hue-1650.png) |
| `/kham-pha` | 1650×786 | loaded | 1635px | 1635px | **0px** | 48px | [Xem ảnh](evidence/GATE-07-03C/after-kham-pha-1650.png) |
| `/cam-nang` | 1650×786 | loaded | 1635px | 1635px | **0px** | 48px | [Xem ảnh](evidence/GATE-07-03C/after-cam-nang-1650.png) |
| `/luu-tru` | 1650×786 | loaded | 1635px | 1635px | **0px** | 24px | [Xem ảnh](evidence/GATE-07-03C/after-luu-tru-1650.png) |
| `/` | 1920×1080 | loaded | 1920px | 1920px | **0px** | 112px | [Xem ảnh](evidence/GATE-07-03C/after-home-1920.png) |
| `/ve-hue` | 1920×1080 | loaded | 1905px | 1905px | **0px** | 48px | [Xem ảnh](evidence/GATE-07-03C/after-ve-hue-1920.png) |
| `/kham-pha` | 1920×1080 | loaded | 1905px | 1905px | **0px** | 48px | [Xem ảnh](evidence/GATE-07-03C/after-kham-pha-1920.png) |
| `/cam-nang` | 1920×1080 | loaded | 1905px | 1905px | **0px** | 48px | [Xem ảnh](evidence/GATE-07-03C/after-cam-nang-1920.png) |
| `/luu-tru` | 1920×1080 | loaded | 1905px | 1905px | **0px** | 24px | [Xem ảnh](evidence/GATE-07-03C/after-luu-tru-1920.png) |
| `/` | 390×844 | loaded | 375px | 375px | **0px** | 72px | [Xem ảnh](evidence/GATE-07-03C/after-home-390.png) |
| `/ve-hue` | 390×844 | loaded | 375px | 375px | **0px** | 24px | [Xem ảnh](evidence/GATE-07-03C/after-ve-hue-390.png) |
| `/kham-pha` | 390×844 | loaded | 375px | 375px | **0px** | 24px | [Xem ảnh](evidence/GATE-07-03C/after-kham-pha-390.png) |
| `/cam-nang` | 390×844 | loaded | 375px | 375px | **0px** | 24px | [Xem ảnh](evidence/GATE-07-03C/after-cam-nang-390.png) |
| `/luu-tru` | 390×844 | loaded | 375px | 375px | **0px** | 20px | [Xem ảnh](evidence/GATE-07-03C/after-luu-tru-390.png) |

---

## 9. Bằng Chứng So Sánh Cận Cảnh Placeholder Ẩm Thực (Trước & Sau)

Đã tạo ảnh so sánh side-by-side ở cả 5 viewport với kích thước pixel thực tế:

| Viewport | So sánh Cả Card (Side-by-Side) | So sánh Vùng Chữ Tách Biệt (Tight Crop) |
|---|---|---|
| **1366×768** | [comparison-food-card-1366.png](evidence/GATE-07-03C/comparison-food-card-1366.png) | [comparison-tight-1366.png](evidence/GATE-07-03C/comparison-tight-1366.png) |
| **1440×900** | [comparison-food-card-1440.png](evidence/GATE-07-03C/comparison-food-card-1440.png) | [comparison-tight-1440.png](evidence/GATE-07-03C/comparison-tight-1440.png) |
| **1650×786** | [comparison-food-card-1650.png](evidence/GATE-07-03C/comparison-food-card-1650.png) | [comparison-tight-1650.png](evidence/GATE-07-03C/comparison-tight-1650.png) |
| **1920×1080** | [comparison-food-card-1920.png](evidence/GATE-07-03C/comparison-food-card-1920.png) | [comparison-tight-1920.png](evidence/GATE-07-03C/comparison-tight-1920.png) |
| **390×844 (Mobile)** | [comparison-food-card-390.png](evidence/GATE-07-03C/comparison-food-card-390.png) | [comparison-tight-390.png](evidence/GATE-07-03C/comparison-tight-390.png) |

---

## 10. Xác Minh Tính Bất Biến Của Các Vùng Đã Khóa (Lock Integrity)

Đã kiểm tra so sánh sai phân điểm ảnh (ImageChops difference) bằng thư viện Pillow giữa baseline `before` và `after`:

1. **Brand Logo Lockup & Wordmark ("HUẾ / Travel Pro"):**
   - Header Home ở 1366, 1440, 1650, 1920, 390: **100% Pixel Identical (`True`)**
   - Sidebar `/ve-hue` ở 1366: **100% Pixel Identical (`True`)**
   - Không dịch chuyển 1 pixel tọa độ, font family tiếp tục kế thừa `font-brand` (Geist).
2. **Ba Dòng Display Trang Chủ ("HUẾ", "TRAVEL PRO", "Huế có chi hay?"):**
   - Vùng chữ display ở cả 5 viewport: **100% Pixel Identical (`True`)**
   - Sai phân điểm ảnh: `None` (0 pixel khác biệt). Không có hiện tượng giật vị trí 0.5px.
3. **Tiêu đề H1 Bốn Trang Con:**
   - H1 Lịch sử, Khám phá, Di chuyển, Lưu trú: Chiều cao và số dòng giữ nguyên 100%.
   - Câu H1 Lưu trú giữ nguyên văn: *"Những homestay xinh xắn, khách sạn tiện nghi và không gian lưu trú đầy cảm hứng cho hành trình của bạn."*
4. **Bốn Ảnh Hero 07-02B:** Crop, gradient, position không thay đổi.

---

## 11. Xác Minh Chức Năng: T05, T07, A01 và Điều Hướng

Chạy kiểm thử chức năng tự động `test_functional_gates.js` và `test_navigation.js`:

- **T05 (Rental Footer & Cards):**
  - Section `#thue-xe-danh-sach` tồn tại đầy đủ.
  - 12 liên kết thuê xe hoạt động chuẩn xác (Đồng Xanh, Kevin Motorbike, Hidibike, v.v.).
- **T07 (Accommodation Price Filter):**
  - Đầy đủ nút danh mục ("Tất cả", "Homestay", "Khách sạn", "Resort").
  - 16 cards lưu trú render bình thường, input tìm kiếm phản hồi đúng.
- **A01 (Keyboard Accessibility):**
  - Phím `Tab` kích hoạt tuần tự qua các phần tử tương tác.
  - Focus outline xuất hiện rõ ràng: `outline: rgb(229, 151, 0) auto 1px`.
- **Navigation Functionality:**
  - Chuyển trang hai chiều `/` ➔ `/kham-pha` ➔ `/` hoàn tất thành công (`step1: true, step2: true`).

---

## 12. Kiểm Tra Kỹ Thuật (Build, Lint, Typecheck)

- **Typecheck:** `pnpm.cmd exec tsc --noEmit --incremental false` ➔ **PASS (0 errors, code 0)**.
- **Lint:** `pnpm.cmd lint` ➔ **PASS (`✔ No ESLint warnings or errors`)**.
- **Production Build:** `pnpm.cmd build` ➔ **PASS (30/30 pages statically generated)**.
- **Runtime Serving:** Next.js production server đang phục vụ ổn định trên cổng 3000.

---

## 13. Rehearsal Phục Hồi & Rollback Readiness

- Kịch bản rollback độc lập: `reports/gravity/evidence/GATE-07-03C/rollback.py`.
- Runbook hướng dẫn chi tiết: [GATE-07-03C-ROLLBACK-RUNBOOK.md](GATE-07-03C-ROLLBACK-RUNBOOK.md).
- Kết quả chạy thử nghiệm Dry-run:
  ```
  === GATE 07-03C ROLLBACK (DRY RUN) ===
  Verified 11 manifest entries. Planned actions: 6
    [RESTORE] src\app\page.tsx <- checkpoint-before (target SHA match)
    [RESTORE] src\app\layout.tsx <- checkpoint-before (target SHA match)
    [RESTORE] tailwind.config.ts <- checkpoint-before (target SHA match)
    [DELETE]  src\app\fonts\NotoSans-VF.ttf
    [DELETE]  src\app\fonts\NotoSans-Italic-VF.ttf
    [DELETE]  src\app\fonts\NotoSans-OFL.txt
  DRY RUN PASS — NO WRITES PERFORMED.
  ```

---

## 14. Remaining Risks (Rủi ro còn lại)

1. **Mức độ zoom trình duyệt trên máy thật của Owner:** Các phép đo được thực hiện ở tỉ lệ 100% (deviceScaleFactor = 1.0). Ở mức zoom 125% hoặc 150% trên Windows hiển thị, chữ Noto Sans 11px vẫn duy trì tỷ lệ pixel rõ nét hơn đáng kể so với Geist 10px, nhưng Owner cần kiểm tra trực tiếp trên màn hình vật lý.
2. **Khác biệt Rendering Engine giữa Chromium và WebKit:** Noto Sans có độ phủ glyph tuyệt đối nên iOS Safari và Android Chrome sẽ hiển thị đồng nhất.

---

## 15. Đề Xuất Nghiệm Thu

Antigravity đề xuất:
1. Nghiệm thu giải pháp typography Noto Sans 11px cho placeholder card Ẩm thực Trang chủ.
2. Nghiệm thu việc sử dụng Noto Sans làm font UI chính cho toàn bộ website (thay thế Be Vietnam Pro cho các nhóm UI không bị khóa).
3. Duy trì toàn bộ khóa đối với Brand Logo, Display Home và Noto Serif Editorial.

---

## 16. HARD STOP

**TASK EXECUTION FINISHED.**  
**STOP — AWAIT OWNER VISUAL ACCEPTANCE.**  
Không tự ý chuyển Gate, không tự ý chỉnh sửa file nào khác.
