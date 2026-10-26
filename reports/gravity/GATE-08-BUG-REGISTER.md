# SỔ THEO DÕI VÀ XỬ LÝ LỖI GATE 08 — BUG REGISTER
**Dự án:** HUẾ TRAVEL PRO V2.3 (`A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro`)  
**Thời điểm ghi nhận:** 26/10/2026 — 16:10 (Giờ Việt Nam)  
**Phạm vi:** Kiểm thử hiển thị Cross-Device & Responsive trên 6 trang chính

---

## 1. TỔNG HỢP THEO PHÂN CẤP MỨC ĐỘ (SEVERITY SUMMARY)

| Mức độ (Severity) | Định nghĩa | Đã phát hiện | Đã sửa | Còn lại |
|:---:|:---|:---:|:---:|:---:|
| **P0** | Lỗi nghiêm trọng, sập trang, mất nội dung cốt lõi | 0 | 0 | 0 |
| **P1** | Lỗi hiển thị rõ rệt, tràn màn hình (horizontal overflow), cản trở thao tác | 1 | 1 | 0 |
| **P2** | Lỗi nhỏ về responsive, spacing, clipping không cản trở thao tác | 0 | 0 | 0 |
| **P3** | Đề xuất cải thiện thẩm mỹ / ngoài phạm vi lỗi khách quan | 0 | 0 | 0 |
| **TỔNG CỘNG** | | **1** | **1** | **0** |

---

## 2. CHI TIẾT LỖI DUY NHẤT ĐƯỢC XÁC MINH & KHẮC PHỤC

### 📌 BUG-08-01: Tràn màn hình ngang trên trang Di chuyển (`/cam-nang`) ở viewport siêu nhỏ M01 (320×568)

- **Mã định danh:** `BUG-08-01`
- **Mức độ nghiêm trọng:** **P1** (Responsive Display Bug — Horizontal Document Overflow)
- **Trang bị ảnh hưởng (Route):** `/cam-nang` (Di chuyển & Thuê xe Cố Đô)
- **Môi trường & Viewport:**
  - Viewport: `M01 — 320×568` (Điện thoại màn hình rất nhỏ, ví dụ: iPhone SE gen 1)
  - Device Scale Factor (DPR): 2.0
  - Browser: Microsoft Edge Headless (Chromium Engine)
- **Bằng chứng trước khi sửa (Screenshot Before):**
  - Tệp ảnh: `reports/gravity/evidence/GATE-08/baseline/cam-nang_M01_320x568.png`
  - Chỉ số DOM đo đạc trước sửa:
    - `docWidth`: 320px
    - `maxScroll`: 334px
    - `overflowDelta`: **+14px** (Xuất hiện thanh cuộn ngang gây xô lệch giao diện)
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  - Tại [src/app/cam-nang/page.tsx](file:///A:/trí tuệ nhân tạo/BAI_3/hue-travel-pro/src/app/cam-nang/page.tsx#L223), thanh bộ lọc sử dụng lớp CSS `<div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full">`.
  - Cả 3 thẻ `<select>` bên trong sử dụng lớp `flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2.5 rounded-xl ...`.
  - Thẻ `<select>` thứ 3 có nhãn lựa chọn mặc định dài 41 ký tự: `"Khoảng giá: Tham khảo chung theo dòng xe"`.
  - Do thuộc tính `flex-1` trong CSS Flexbox mặc định có `min-width: auto`, thẻ `<select>` không thể co nhỏ hơn kích thước nội dung tự nhiên (intrinsic width ~303px).
  - Khi cộng thêm padding vùng chứa `p-4` (16px trái + 16px phải = 32px), tổng chiều rộng phần tử đạt: `303px + 32px = 335px > 320px`.
  - Hậu quả: Đẩy khung trang vượt quá kích thước màn hình 320px một khoảng `+14px`.
- **Tệp nguồn được cấp phép sửa:**
  - [src/app/cam-nang/page.tsx](file:///A:/trí tuệ nhân tạo/BAI_3/hue-travel-pro/src/app/cam-nang/page.tsx)
- **Giải pháp xử lý tối giản (Targeted Fix):**
  1. Chuyển khối chứa 3 thẻ dropdown sang dạng lưới CSS: `grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full`, đồng bộ 100% với cấu trúc chuẩn đã được kiểm chứng tại `/an-uong` và `/kham-pha`.
  2. Bổ sung `w-full min-w-0 truncate` vào cả 3 thẻ `<select>` để bảo đảm trên màn hình 320px, mỗi dropdown chiếm trọn vẹn 1 hàng độc lập và tự động cắt ngắn nhãn văn bản nếu vượt quá độ rộng cột mà không bao giờ làm tràn layout.
  3. Di chuyển nút bấm `Xóa bộ lọc` xuống hàng tóm tắt số lượng ở chân thanh công cụ (giống hệt trang Ăn uống `/an-uong`), vừa đẹp mắt vừa loại bỏ xung đột flex.
- **Bằng chứng sau khi sửa (Screenshot After):**
  - Tệp ảnh nghiệm thu độc lập: `reports/gravity/evidence/GATE-08/fixes/cam-nang_M01_320x568_after_fix.png`
  - Tệp ảnh kiểm thử hồi quy 120 ca: `reports/gravity/evidence/GATE-08/regression/cam-nang_M01_320x568_final.png`
- **Kết quả tái kiểm thử (Retest Status):**
  - `docWidth`: 320px
  - `maxScroll`: 320px
  - `overflowDelta`: **0px** (Hết hoàn toàn hiện tượng tràn ngang!)
  - Trạng thái: **PASS**
- **Ảnh hưởng hồi quy (Regression Status):**
  - Đã chạy kiểm thử lại trên toàn bộ 20 viewports của cả 6 trang chính (120 trường hợp): **120/120 PASS (100%)**.
- **Tác động tới vùng LOCK:**
  - Không thay đổi bất kỳ màu sắc, phông chữ, ảnh nền 2D, các tùy chọn loại xe hay dữ liệu thuê xe nào của trang Di chuyển.
  - 11 tệp cốt lõi còn lại giữ nguyên 100% mã băm SHA-256 ban đầu.
