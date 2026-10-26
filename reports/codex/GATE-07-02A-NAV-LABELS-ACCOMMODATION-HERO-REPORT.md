# HUẾ TRAVEL PRO V2.3 — GATE07-02A

Ngày: 24/10/2026, Asia/Saigon. OWNER APPROVED — SCOPED CONTENT/UI CHANGE.

## Danh sách file dự kiến — ghi trước khi sửa source

1. `src/components/navigation/AdaptiveNavigation.tsx`: ánh xạ nhãn hiển thị trên capsule/sidebar/drawer/bottom nav; không thay vùng logo hoặc handlers.
2. `src/app/ve-hue/page.tsx`: nhãn/heading trực tiếp của trang Lịch sử.
3. `src/app/cam-nang/page.tsx`: nhãn/heading và loading name trang Di chuyển; giữ footer T05.
4. `src/app/luu-tru/page.tsx`: đưa nguyên câu Owner lên h1, xóa mô tả lặp và dùng typography responsive cục bộ; giữ grid T07, dữ liệu và background.
5. `src/app/cam-nang/thue-xe/[slug]/page.tsx`: tên trang cha ở breadcrumb/nút quay lại, không sửa chức năng thuê xe.
6. `src/app/tim-kiem/page.tsx`: tên link trỏ trực tiếp đến trang /cam-nang.

Các file này nằm trong component navigation/page thực sự chứa nội dung liên quan. `src/types/navigation.ts`, global font/theme, AGENTS.md, hồ sơ LOCK, logo/assets, data/lib/Prisma không thuộc phần sửa. Header.tsx/Navigation.tsx không được Shell dùng nên không mở sửa các component legacy. Routes và ý nghĩa danh mục con giữ nguyên.

## Project / Gate / Task ID và phạm vi

Project: HUẾ TRAVEL PRO V2.3. Gate / Task: GATE-07-02A — NAVIGATION LABELS & ACCOMMODATION HERO UPDATE. Thực hiện ngày 24/10/2026, Asia/Saigon.

Owner cho phép đổi nhãn navigation và tên trang liên quan trực tiếp, thay nội dung/typography cục bộ Hero Lưu trú. Đã đọc AGENTS.md và hồ sơ docs/locks/HUE_TRAVEL_PRO_V2.3_LOGO_DESIGN_LOCK_2026-10-24.md trước sửa. Không triển khai, không cài package, không thay dữ liệu/database, ảnh nền, logo, font toàn hệ thống, routes hoặc logic bộ lọc/thuê xe. Danh sách sáu file phía trên được ghi vào báo cáo trước khi sửa source.

## Executive Summary

VERIFIED: cả capsule desktop, sidebar, drawer Home mobile và bottom navigation dùng thống nhất Trang chủ / Lịch sử / Khám phá / Di chuyển / Lưu trú. Routes cũ giữ nguyên. Trang Lịch sử và Di chuyển đã cập nhật heading trực tiếp; breadcrumb/nút quay lại thuê xe và liên kết trang Di chuyển trong tìm kiếm đã đồng bộ.

VERIFIED: Hero /luu-tru dùng nguyên câu Owner làm h1 một lần, giữ nhãn LƯU TRÚ và ảnh nền. Quan sát và đo tại ba viewport yêu cầu không thấy cắt chữ hoặc chồng navigation/bộ lọc. Logo và các vùng T05/T07 được bảo toàn nguyên văn. Typecheck và lint PASS.

## Công việc và phạm vi diff

| File (so với checkpoint trước nhiệm vụ) | Thay đổi thực tế | Diff |
|---|---|---|
| src/components/navigation/AdaptiveNavigation.tsx | Ánh xạ hai nhãn theo id và dùng cho bốn vòng render; href, handlers, transitions, vùng logo không đổi | [file-0.diff](evidence/GATE-07-02A-20261024/file-0.diff) |
| src/app/ve-hue/page.tsx | Eyebrow LỊCH SỬ; h1 Lịch sử Huế | [file-1.diff](evidence/GATE-07-02A-20261024/file-1.diff) |
| src/app/cam-nang/page.tsx | Eyebrow DI CHUYỂN; h1 Di chuyển ở Huế; loading name | [file-2.diff](evidence/GATE-07-02A-20261024/file-2.diff) |
| src/app/luu-tru/page.tsx | Thay h1, bỏ paragraph lặp, giới hạn cỡ chữ cục bộ và mở rộng max-width phần chữ | [file-3.diff](evidence/GATE-07-02A-20261024/file-3.diff) |
| src/app/cam-nang/thue-xe/[slug]/page.tsx | Breadcrumb và tên nút Quay lại Di chuyển | [file-4.diff](evidence/GATE-07-02A-20261024/file-4.diff) |
| src/app/tim-kiem/page.tsx | Nhãn link Trang Di chuyển, giữ href và search logic | [file-5.diff](evidence/GATE-07-02A-20261024/file-5.diff) |

src/types/navigation.ts vẫn giữ cấu hình gốc; nhãn mới được ánh xạ tại component hoạt động để tuân thủ allowlist component/page của Owner. Shell đang dùng AdaptiveNavigation. Các component Header/Navigation legacy không được Shell sử dụng không mở sửa. Từ Cẩm nang trong danh mục/nội dung có nghĩa riêng, tên nguồn và dữ liệu không bị đổi hàng loạt.

## Root Cause / cơ sở thay đổi

Đây là thay đổi nội dung đã duyệt: navigation trước đây render trực tiếp nhãn cấu hình cũ; heading và các tên trang cha nằm riêng ở page component. Hero cũ đặt câu Owner ở paragraph dưới tiêu đề ngắn. Nếu chỉ thay nội dung h1 mà giữ cỡ chữ cũ 48px trên laptop sẽ gây nhiều dòng; đã dùng cỡ chữ cục bộ 28px trên laptop, 20px mobile, cho phép xuống dòng tự nhiên. Không áp dụng sửa font/global theme.

## Kết quả kiểm tra và bằng chứng

Môi trường kiểm thử: dev server hiện có tại http://192.168.1.12:3000, trình duyệt in-app, viewport mô phỏng. Không dùng HTTP 200 làm kết luận visual. Kiểm tra qua DOM, tương tác thật và screenshot.

### Navigation / routes — PASS trong phạm vi đã kiểm tra

- Desktop 1366×768: mở /, /ve-hue, /kham-pha, /cam-nang, /luu-tru; Home có capsule, bốn trang con có sidebar; đủ năm nhãn/href đúng. [Desktop DOM](evidence/GATE-07-02A-20261024/desktop-navigation.json).
- Click capsule Lịch sử từ Home → /ve-hue, sidebar Trang chủ → /; morph Hero-to-Sidebar và chiều ngược hoạt động. [Chiều quay lại](evidence/GATE-07-02A-20261024/interaction-return-home.json).
- Mobile 390×844: mở drawer Home; click Di chuyển tới /cam-nang; kiểm tra bottom nav ở cả bốn trang con; click Lịch sử từ Lưu trú tới /ve-hue. Không tràn ngang trong các trang đã đo: clientWidth = scrollWidth = 375px (phần còn lại là scrollbar). [Mobile DOM](evidence/GATE-07-02A-20261024/mobile-navigation.json).
- /tim-kiem?q=dong+xanh vẫn trả một kết quả thuê xe; nhãn Trang Di chuyển trỏ đúng /cam-nang#thue-xe-danh-sach. Không sửa search logic.

### Hero Lưu trú — PASS trong phạm vi viewport đã kiểm tra

| Viewport CSS px | Hero (rộng × cao) | H1 (rộng × cao) | Font / line-height | Khoảng từ đáy Hero tới bộ lọc | Số lần câu xuất hiện |
|---|---|---|---|---|---|
| 1366×768 | 1031×228 | 768×64 | 28 / 32px | 32px | 1 |
| 1440×900 | 1105×228 | 768×64 | 28 / 32px | 32px | 1 |
| 390×844 | 347×274 | 307×110 | 20 / 27.5px | 32px | 1 |

H1 màu trắng, đầy đủ nội dung; nhãn LƯU TRÚ và chips vẫn còn; Hero không đè nav hay bộ lọc. Desktop h1 có scrollHeight 66px so với box 64px theo font metrics, nhưng không có clipping nhìn thấy và còn khoảng trống trong Hero. Mobile clientHeight/scrollHeight đều 110px. Đo thực tế: [hero-measurements.json](evidence/GATE-07-02A-20261024/hero-measurements.json). Không đo tỷ lệ tương phản WCAG tự động; kết luận đủ đọc ở đây dựa trên ảnh thực tế, không phải chứng nhận accessibility toàn site.

### Non-regression — PASS cho các thao tác đã thử

- Lưu trú: chọn Homestay → ?type=homestay, còn 4 cơ sở; chọn ngân sách cao → giữ cả type và budget, nhóm 4 cơ sở chưa có giá kiểm chứng vẫn có thông báo đúng; xóa bộ lọc → /luu-tru, bốn select về all, 8 cơ sở.
- Thuê xe: chọn Xe số → ?vehicle=Xe+s%E1%BB%91, 6 nút Chi tiết vẫn hiện; xóa lọc → /cam-nang. Mở Chi tiết Đồng Xanh Motorbike Rental → /cam-nang/thue-xe/dong-xanh-motorbike; nút Quay lại Di chuyển → /cam-nang. Bấm Vị trí mở tab Google Maps đúng cơ sở. Chỉ xác minh mở đích; không chứng nhận độ chính xác dữ liệu bên thứ ba và không phát sinh cuộc gọi/đặt xe.
- Logic và href các nút thuê xe được bảo toàn qua diff; không kiểm thử tất cả tổ hợp lọc, mọi nút của từng cơ sở hoặc tất cả điểm đích ngoài website.
- [Tương tác và kết quả](evidence/GATE-07-02A-20261024/interactions.json).
- Logo: asset nạp thành công; DOM đo sidebar44px, Home desktop40px, Home mobile36px. Ba đoạn logo/wordmark nguyên văn; T05 footer và toàn block bộ lọc T07 nguyên văn: [protected-check.json](evidence/GATE-07-02A-20261024/protected-check.json), tất cả true. Không khóa nhầm toàn component navigation.

### Typecheck / Lint / Build / Runtime / Visual

| Kiểm tra | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Typecheck | PASS | pnpm exec tsc --noEmit --incremental false; exit 0, không diagnostics; [log](evidence/GATE-07-02A-20261024/typecheck.log) |
| Lint | PASS | pnpm lint; exit 0, No ESLint warnings or errors; [log](evidence/GATE-07-02A-20261024/lint.log) |
| Production Build | NOT TESTED | Không chạy production build trong nhiệm vụ này |
| Runtime Tests | PASS có giới hạn | Các đường dẫn, navigation, bộ lọc và thuê xe nêu trên hoạt động; không tuyên bố console sạch |
| Visual Tests | PASS có giới hạn | Desktop/mobile và ba viewport Hero đã chụp, quan sát; chưa kiểm tra thiết bị điện thoại vật lý hoặc đa trình duyệt |

## Screenshot

Ảnh bằng chứng nguyên trạng; không sửa asset website để tạo ảnh.

| Nội dung | Trước | Sau |
|---|---|---|
| Hero 1366×768 | [Before](evidence/GATE-07-02A-20261024/before-stay-1366.png) | [After](evidence/GATE-07-02A-20261024/after-stay-1366.png) |
| Hero 1440×900 | [Before](evidence/GATE-07-02A-20261024/before-stay-1440.png) | [After](evidence/GATE-07-02A-20261024/after-stay-1440.png) |
| Hero 390×844 | [Before](evidence/GATE-07-02A-20261024/before-stay-390.png) | [After](evidence/GATE-07-02A-20261024/after-stay-390.png) |

Desktop: [Home](evidence/GATE-07-02A-20261024/desktop-home.png), [Lịch sử](evidence/GATE-07-02A-20261024/desktop-ve-hue.png), [Khám phá](evidence/GATE-07-02A-20261024/desktop-kham-pha.png), [Di chuyển](evidence/GATE-07-02A-20261024/desktop-cam-nang.png), [Lưu trú](evidence/GATE-07-02A-20261024/desktop-luu-tru.png).

Mobile: [Home drawer](evidence/GATE-07-02A-20261024/mobile-home-drawer.png), [Lịch sử](evidence/GATE-07-02A-20261024/mobile-ve-hue.png), [Khám phá](evidence/GATE-07-02A-20261024/mobile-kham-pha.png), [Di chuyển](evidence/GATE-07-02A-20261024/mobile-cam-nang.png), [Lưu trú](evidence/GATE-07-02A-20261024/mobile-luu-tru.png), [Chi tiết thuê xe](evidence/GATE-07-02A-20261024/rental-detail-mobile.png).

## Checksum trước / sau (SHA-256)

Checkpoint 57 file source/public/config/lock/data theo [baseline.csv](evidence/GATE-07-02A-20261024/baseline.csv); chỉ sáu file trong allowlist thay đổi. 51 file còn lại giữ checksum, gồm AGENTS.md, hồ sơ LOCK, asset logo/hero, dữ liệu, globals.css, cấu hình và package manifest. Bản đối chiếu đầy đủ: [integrity-final.csv](evidence/GATE-07-02A-20261024/integrity-final.csv). Đây là checkpoint các file đã liệt kê, không phải snapshot mọi file trên ổ đĩa.

Logo public/images/brand/owner-lotus.png và hoa sen.png trước/sau: `6E53DD205EDE658EBCAEBAED45632A1E5613C8D01E141B22172F597EB6112B9D`.

### src\app\cam-nang\page.tsx

- Before: `C6FF4D38F91A78B8AF05AC704B5D8AF651AB1D1267C31DC8EBA6535279440135`
- After: `C8B9E851C83DD6128092C2D355B28C0CA7A0CF5A8434BAADCF9BE92F690EDBEB`

### src\app\cam-nang\thue-xe\[slug]\page.tsx

- Before: `5560433784E1DCCE3E7DA698E819D3787BF08676BFBFFF1009D2B346E7F49EBD`
- After: `6F15A27C5FF97E8C7A11D8273753BE8D5BE51C996D4BE97E57B09DE46823F6A0`

### src\app\luu-tru\page.tsx

- Before: `829379152F6250A3E57C551F7A668BB2B3822F3EA87B269FCD6330758B594279`
- After: `9C6A38C7CB5CDD59E1EDD3C47B2CAE5FCF1BC09D22C5843EBD44D3876861318C`

### src\app\tim-kiem\page.tsx

- Before: `7455F5C7392E19F91A038AF4669BB9FE81AB2C2E800FF257309E5A9A40095AFB`
- After: `80D9F4D8881C2027E26E3032ADF39501C10D424E41F398E65E3D9D4FA64F672F`

### src\app\ve-hue\page.tsx

- Before: `1E80E112E4A3D65C6F8F6E7DCC5B489E6BC2ECBD06AA1CC76DEB8FB466E1F7F8`
- After: `59DBEF26E3A69344C7D05EB98C48C6527928B30C2C2507B5F21A9EC32C06CBAF`

### src\components\navigation\AdaptiveNavigation.tsx

- Before: `FDB4D916AB82AA2D7AF33A829B7917ABE16D484E46B49BA7C65F19DCAA349D5A`
- After: `00B9231AFE4FACB5E16C03B20A4F8A5D30DCB95CB5F003E7A68BE61A2BF20E89`

## Những vấn đề chưa giải quyết / giới hạn

- VERIFIED trước và sau: console có cảnh báo React “Extra attributes from the server” với thuộc tính __processed_… trên body. [Before](evidence/GATE-07-02A-20261024/console-before.json), [After](evidence/GATE-07-02A-20261024/console-after.json). Chưa xác minh nguồn chèn thuộc tính; không quy kết do thay nhãn, không sửa ngoài phạm vi.
- Ảnh nền Lưu trú hiện chứa hình/chữ giao diện baked-in nhìn thấy trên mobile. Giữ nguyên theo lệnh Owner; không khôi phục ảnh nền trong gate này.
- Các kích thước screenshot là viewport mô phỏng, không thay thế Owner kiểm tra trực tiếp trên laptop/mobile. Không có kết luận nghiệm thu font toàn site hay các gate khác.
- Trong quá trình tự động kiểm thử có một lần chờ nhầm tên URL parameter vehicleType; kiểm tra DOM/URL thực tế xác nhận ứng dụng vẫn dùng vehicle. Đây là kỳ vọng sai của thao tác kiểm thử, không sửa code để đáp ứng kỳ vọng đó.

## Đề xuất bước tiếp theo / trạng thái nghiệm thu đề xuất

Đề xuất Owner duyệt riêng GATE-07-02A dựa trên sáu diff, checklist và ảnh kèm theo. Các kiểm tra trong phạm vi đã hoàn thành; chưa tuyên bố Owner nghiệm thu. Không tự mở nhiệm vụ tiếp theo, không sửa ảnh nền hoặc trang khác. Các vùng đang LOCK tiếp tục giữ nguyên.

**HARD STOP — AWAIT OWNER REVIEW.**

**PASS = LOCK — FIX ONLY WHAT FAILED — NO SCOPE CREEP.**
