# HUẾ TRAVEL PRO V2.3 — Homepage Logo Preview

- **Project / Gate / Task:** HUẾ TRAVEL PRO V2.3 / GATE 07-01 / OWNER LOTUS — HOMEPAGE PREVIEW.
- **Ngày:** 24/10/2026, Asia/Saigon.
- **Quyền Owner:** yêu cầu mới cho phép thay logo bằng chính `hoa sen.png` để xem trước; sau Owner duyệt mới khóa và áp dụng cả năm trang. Quyền này thay thế giới hạn không thay logo trong nhiệm vụ chẩn đoán trước, chỉ trong phạm vi bản xem trước.
- **Trạng thái:** IMPLEMENTED FOR PREVIEW — AWAIT OWNER VISUAL REVIEW. Chưa LOCK, chưa triển khai hoặc áp dụng logo hiển thị trên bốn trang con.

## Executive Summary

Đã thay biểu tượng hoa sen trong header Trang chủ desktop/mobile bằng ảnh Owner vừa chọn. Bỏ nền ô vuông cũ ở hai vị trí này để hiện hoa sen trực tiếp, giữ nguyên wordmark, khoảng cách wordmark, kích thước khung logo, navigation, Hero và dữ liệu. Không dựng lại, đổi màu, tẩy nền hoặc chỉnh ảnh gốc.

## Công việc / file thay đổi / phạm vi diff

1. Đọc AGENTS.md và component đang dùng; không có Git repository. Lưu checkpoint component cùng baseline source/public trước sửa tại [thư mục evidence](evidence/GATE-07-01-LOGO-PREVIEW-20261024-165945/).
2. Tạo `public/images/brand/owner-lotus.png`, sao chép nguyên file `hoa sen.png` (RGBA). Hai file có cùng SHA-256: `6E53DD205EDE658EBCAEBAED45632A1E5613C8D01E141B22172F597EB6112B9D`.
3. Sửa **duy nhất một file source**: `src/components/navigation/AdaptiveNavigation.tsx`: thêm import Image dòng 4; thay SVG ở header landing desktop dòng 255–264 và mobile dòng 301–310 bằng Next Image. Khung desktop 40×40px, mobile 36×36px, object-contain, alt rỗng vì wordmark nằm cạnh đã cung cấp tên thương hiệu. Giữ handler/link, kích thước header và chữ.
4. Sidebar và SubpageTopBar giữ logo cũ. Component shared vẫn có header landing ẩn ở route con theo cơ chế sẵn có; logo **đang hiển thị** ở bốn trang con chưa chuyển sang ảnh mới.
5. Không sửa AGENTS.md để tự công nhận logo chính thức. Không thay source Hero/font/CSS toàn cục, route, dữ liệu hoặc database; không cài package.

[Checkpoint trước sửa](evidence/GATE-07-01-LOGO-PREVIEW-20261024-165945/AdaptiveNavigation.before.tsx), [baseline](evidence/GATE-07-01-LOGO-PREVIEW-20261024-165945/baseline.csv), [file source đổi hash](evidence/GATE-07-01-LOGO-PREVIEW-20261024-165945/changed-files.json). So sánh baseline cho thấy chỉ AdaptiveNavigation.tsx thay đổi trong các file có sẵn được kiểm; asset mới được liệt kê riêng ở trên.

## Kết quả kiểm tra và bằng chứng

- **VERIFIED:** Home 1366×768, 1440×900, 390×844 hiển thị ảnh mới; ảnh tải thành công, naturalWidth>0, kích thước CSS desktop40/mobile36. Đã xem ảnh Home1366 và mobile cùng ảnh cận cảnh.
- **VERIFIED:** /ve-hue, /kham-pha, /cam-nang, /luu-tru vẫn có SVG sidebar và không có img trong sidebar; lưu screenshot cận cảnh từng route. Đã mở đối chiếu ảnh sidebar Về Huế.
- **VERIFIED:** màu hồng và hình dáng lấy từ ảnh Owner; không có filter hoặc asset AI mới được tạo. Ảnh nguồn có một số pixel nhiễu/trắng; bản xem trước dùng nguyên trạng, không tự xử lý.
- **NOT VERIFIED:** Owner chấp nhận kích thước/màu/tỷ lệ so với wordmark; độ sắc nét trên mọi màn hình/zoom. Chỉ Owner có thể nghiệm thu thương hiệu.

![Desktop logo preview](evidence/GATE-07-01-LOGO-PREVIEW-20261024-165945/logo-desktop-detail.png)

![Mobile logo preview](evidence/GATE-07-01-LOGO-PREVIEW-20261024-165945/logo-mobile-detail.png)

[Home1366](evidence/GATE-07-01-LOGO-PREVIEW-20261024-165945/home-1366.png) · [Home1440](evidence/GATE-07-01-LOGO-PREVIEW-20261024-165945/home-1440.png) · [Mobile](evidence/GATE-07-01-LOGO-PREVIEW-20261024-165945/home-mobile.png).

[Sidebar Về Huế](evidence/GATE-07-01-LOGO-PREVIEW-20261024-165945/sidebar-ve-hue.png) · [Khám phá](evidence/GATE-07-01-LOGO-PREVIEW-20261024-165945/sidebar-kham-pha.png) · [Cẩm nang](evidence/GATE-07-01-LOGO-PREVIEW-20261024-165945/sidebar-cam-nang.png) · [Lưu trú](evidence/GATE-07-01-LOGO-PREVIEW-20261024-165945/sidebar-luu-tru.png) · [DOM regression](evidence/GATE-07-01-LOGO-PREVIEW-20261024-165945/runtime-regression.json).

## Root Cause / giới hạn

Logo cũ là SVG dựng trong component, khác ảnh Owner chọn. Thay đúng hai block landing giải quyết việc xem trước; chưa thay các logo khác vì Owner muốn duyệt trước áp dụng cả năm trang. Đây không phải bản sửa typography/glyph Hero.

## Test Results

| Kiểm tra | Kết quả |
|---|---|
| Typecheck — pnpm exec tsc --noEmit --incremental false | PASS, exit0 |
| Lint — pnpm lint | PASS, không warning/error |
| Production build | NOT TESTED; bản xem trước local, chưa triển khai |
| Runtime load logo Home desktop/mobile | PASS trong các trạng thái đo |
| Sidebar bốn route giữ logo cũ | PASS cho kiểm tra DOM; ảnh đã lưu, không chứng nhận toàn bộ UI |
| Visual Home | PASS cho ảnh xuất hiện và không thấy cắt/chồng wordmark trong ảnh đã xem; thẩm mỹ PENDING OWNER REVIEW |
| Toàn bộ navigation/search/filter | NOT TESTED lại; không sửa handler/logic |

## Vấn đề chưa giải quyết / đề xuất tiếp theo

Chờ Owner duyệt logo Home (hình dáng, màu, kích thước và khoảng cách wordmark). Nếu được duyệt, nhiệm vụ tiếp theo mới đồng bộ các vị trí còn lại cho cả năm trang và cập nhật quyết định LOCK theo quyền cụ thể. Hiện không tự bắt đầu bước đó.

Ngoài source/asset nêu trên, tạo báo cáo này, evidence/checkpoint và báo cáo chẩn đoán Phase1F chưa hoàn tất runtime trước khi Owner chuyển sang yêu cầu logo. Không trình bày thay logo là kết quả của Phase1F READ-ONLY.

**PASS = LOCK — FIX ONLY WHAT FAILED — NO SCOPE CREEP.**

**HARD STOP — AWAIT OWNER REVIEW.**
