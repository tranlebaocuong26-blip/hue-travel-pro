# HUẾ TRAVEL PRO V2.3 — GATE 07-02B — CLEAN HERO IMAGE REPLACEMENT

Ngày: 25/10/2026, Asia/Saigon. OWNER APPROVED — SCOPED HERO ASSET REPLACEMENT.

## Phạm vi và danh sách trước sửa

Chỉ sửa backgroundImage/backgroundPosition trong bốn page component: src/app/ve-hue/page.tsx, src/app/kham-pha/page.tsx, src/app/cam-nang/page.tsx, src/app/luu-tru/page.tsx. Giữ nguyên HTML, typography, kích thước, nội dung, CTA, navigation và handlers.

Copy byte-identical các ảnh Owner gốc theo mapping: lịch sử.png → public/images/heroes/hero_lich_su.png; khám phá.png → public/images/heroes/hero_kham_pha.png; di chuyển.png → public/images/heroes/hero_di_chuyen.png; lưu trú.png → public/images/heroes/hero_luu_tru.png.

Ba asset đích mới chưa tồn tại. Asset đích Lưu trú đã tồn tại (750×260, SHA-256 5A5392C5BE99B16D3BF32296208E291E99DA7E5E34D673BF6B7D6D80F0703B47); Owner đã duyệt ngoại lệ bằng câu “Duyệt thay file Hero Lưu trú hiện có”. Bản cũ đã được lưu tại evidence/GATE-07-02B-20261025/hero_luu_tru.before.png. Không sửa bốn bản gốc Owner.

Đã đọc AGENTS.md, báo cáo GATE 07-02A và hồ sơ Logo Design LOCK. Không có Git repository; dùng checkpoint source, ảnh cũ và baseline SHA-256 60 file trước sửa. Không reset hoặc ghi đè source ngoài phần được cấp phép. Lệnh Owner GATE 07-02B mới nhất cấp quyền giới hạn thay Hero, không mở khóa các phạm vi khác trong AGENTS.md.

## Executive Summary

VERIFIED: đã thay nền Hero bốn trang bằng đúng bốn PNG Owner cung cấp, byte-identical, không chỉnh sửa nội dung ảnh. Không có chữ/nav/nút ghép sẵn trong bốn ảnh mới qua quan sát. Các tiêu đề, mô tả, chips, CTA và navigation tiếp tục là DOM/HTML thật. Không dùng ảnh mockup toàn trang làm nền Hero.

VERIFIED: chỉ backgroundImage và backgroundPosition của bốn page thay đổi; kích thước, font, HTML, handlers và nội dung giữ nguyên. Typecheck và lint PASS. Đã kiểm tra trực quan 12 trường hợp (4 route × 3 viewport), không tràn ngang; Hero không tăng chiều cao. Đề xuất Owner review visual; chưa tự nghiệm thu hoặc đăng ký LOCK mới.

## Công việc đã thực hiện / Asset mapping

Tất cả ảnh gốc có định dạng PNG, 1774×887 (tỷ lệ 2:1). Metadata và SHA-256 trước sửa: [owner-assets.csv](evidence/GATE-07-02B-20261025/owner-assets.csv). Public copy giữ nguyên checksum ảnh gốc: [asset-copy-verification.csv](evidence/GATE-07-02B-20261025/asset-copy-verification.csv), cả bốn Identical=True.

| Route | Bản gốc trong project root | URL Hero sau sửa | Nền trước sửa |
|---|---|---|---|
| /ve-hue | lịch sử.png | /images/heroes/hero_lich_su.png | /images/heroes/hero_ve_hue.png |
| /kham-pha | khám phá.png | /images/heroes/hero_kham_pha.png | /images/heroes/hero_trang_chu.png |
| /cam-nang | di chuyển.png | /images/heroes/hero_di_chuyen.png | /images/heroes/hero_cam_nang.png |
| /luu-tru | lưu trú.png | /images/heroes/hero_luu_tru.png | Cùng URL, nội dung asset cũ 750×260 được thay theo ngoại lệ Owner |

Ảnh hero_ve_hue.png, hero_cam_nang.png, hero_trang_chu.png cũ được giữ nguyên file; không sửa background phụ ở các card/map bên dưới vì ngoài phạm vi Hero. Không chỉnh ảnh gốc Owner. Ba asset mới được thêm, một asset Lưu trú được thay, bốn page được sửa; ngoài ra chỉ tạo báo cáo/evidence.

## Root Cause / cách sửa tối thiểu

VERIFIED: khai báo nền trước đây tham chiếu bộ ảnh cũ; riêng Khám phá dùng hero_trang_chu.png. Ảnh Lưu trú cũ chứa thành phần giao diện ghép sẵn nhìn thấy ở mobile, đã được ghi nhận trong 07-02A. Thay asset là cách loại bỏ nội dung ghép sẵn mà vẫn giữ UI thật.

Giữ background-size cover để bảo toàn tỷ lệ. Không transform, không resize file ảnh, không sửa padding/min-height/typography. Overlay đổi từ mức tối 0.95 bên trái và màu phủ mạnh ở giữa sang deep-violet alpha 0.82 trái → 0.55 giữa → 0.08 phải. Lịch sử dùng điểm giữa 50%; ba trang còn lại 55%. Màu gốc và chủ thể phía phải sáng hơn, vùng chữ bên trái vẫn có nền tối.

Vị trí cuối cùng:

- Lịch sử: right center, công trình vẫn rõ; crop theo tỷ lệ Hero hiện có.
- Khám phá: right 20%, ưu tiên giữ đầu/mặt rồng trong Hero desktop; chữ desktop nằm bên trái không che mặt rồng.
- Di chuyển: right 90%, giữ được hai người, mũ bảo hiểm và xe ở cả 1366/1440. Đây là điều chỉnh CSS sau khi quan sát crop trên laptop 1440, không sửa ảnh.
- Lưu trú: right 65%, ưu tiên giường ngủ, vẫn thấy cửa sổ và ánh sáng ấm.

Trên mobile, cover tất yếu crop hai bên ảnh 2:1. Công trình/xe/giường/rồng vẫn nhận diện được; chữ có thể nằm trên một phần chủ thể, đặc biệt tiêu đề Khám phá ở vùng đầu rồng. Không di chuyển hoặc đổi kích thước text/layout đã duyệt để né toàn bộ chủ thể; điểm này được để Owner đánh giá trên ảnh mobile.

## Danh sách file thay đổi / diff

| File | Phạm vi | Diff |
|---|---|---|
| src/app/ve-hue/page.tsx | Background URL + overlay | [ve-hue.diff](evidence/GATE-07-02B-20261025/ve-hue.diff) |
| src/app/kham-pha/page.tsx | Background URL + overlay + position | [kham-pha.diff](evidence/GATE-07-02B-20261025/kham-pha.diff) |
| src/app/cam-nang/page.tsx | Background URL + overlay + position | [cam-nang.diff](evidence/GATE-07-02B-20261025/cam-nang.diff) |
| src/app/luu-tru/page.tsx | Overlay + position; giữ đúng URL mapping | [luu-tru.diff](evidence/GATE-07-02B-20261025/luu-tru.diff) |
| public/images/heroes/hero_lich_su.png | Thêm bản copy ảnh lịch sử.png | Byte-identical Owner source |
| public/images/heroes/hero_kham_pha.png | Thêm bản copy ảnh khám phá.png | Byte-identical Owner source |
| public/images/heroes/hero_di_chuyen.png | Thêm bản copy ảnh di chuyển.png | Byte-identical Owner source |
| public/images/heroes/hero_luu_tru.png | Thay bằng bản copy lưu trú.png đã được Owner cho phép | [Bản cũ](evidence/GATE-07-02B-20261025/hero_luu_tru.before.png) |

[scoped-diff-check.json](evidence/GATE-07-02B-20261025/scoped-diff-check.json): bỏ các dòng backgroundImage/backgroundPosition rồi so sánh hai bản cho kết quả giống nhau trên cả bốn page. T05/T07, CTA, data, filters và mọi vùng khác trong page giữ nguyên; không sửa navigation component, logo/wordmark, global CSS/font, API hoặc database.

## Kết quả kiểm tra và bằng chứng

Kiểm thử tại http://192.168.1.12:3000 bằng in-app browser, viewport mô phỏng CSS px. Kết luận dựa trên screenshot, DOM và click thực tế; không suy từ HTTP 200.

### Runtime / Visual

| Trang | Chiều cao Hero trước → sau tại 1366×768 | Tại 1440×900 | Tại 390×844 | Kết quả |
|---|---|---|---|---|
| Lịch sử | 394.5 → 394.5px | 394.5 → 394.5px | 300 → 300px | Ảnh/công trình và UI thật hiện đúng |
| Khám phá | 292 → 292px | 292 → 292px | 271 → 271px | Mặt rồng rõ trên desktop, không bị text che |
| Di chuyển | 260 → 260px | 260 → 260px | 207 → 207px | Nhận diện rõ xe và người đi xe |
| Lưu trú | 228 → 228px | 228 → 228px | 274 → 274px | Giường là chủ thể; câu h1 giữ nguyên |

Bề rộng Hero: 1031px / 1105px / 347px tương ứng các viewport trên. Không tràn ngang ở cả 12 trường hợp: scrollWidth=clientWidth (1351 / 1425 / 375px; có thanh cuộn dọc). Không thấy cắt chữ hay chồng navigation/bộ lọc trong screenshot. Chữ trắng được quan sát trên overlay; không có phép đo tự động chứng nhận WCAG contrast.

[Đo trước](evidence/GATE-07-02B-20261025/before-measurements.json) · [Đo sau, background URL/position thực tế](evidence/GATE-07-02B-20261025/after-measurements.json).

### Navigation và non-regression

- Bốn route cũ vẫn mở được; nhãn 07-02A giữ nguyên Trang chủ / Lịch sử / Khám phá / Di chuyển / Lưu trú. Bottom nav mobile hiển thị đúng trên cả bốn trang.
- Click Home capsule → Lịch sử; click sidebar Trang chủ → Home thành công. Hero-to-Sidebar và chiều ngược vẫn sử dụng cơ chế hiện có.
- Click CTA Khám phá ngay của Lịch sử → /kham-pha; click tag Đại Nội → /kham-pha?q=%C4%90%E1%BA%A1i+N%E1%BB%99i.
- Click CTA Thuê xe tham khảo → /cam-nang#thue-xe-danh-sach, phần danh sách cuộn tới top=0.
- Click chip Homestay → /luu-tru?type=homestay, select chuyển homestay, Hiển thị 4 cơ sở lưu trú.
- Logo asset nạp được, sidebar44px và Home desktop40px; checksum toàn component navigation và asset logo không đổi so baseline. Không sửa wordmark/kích thước/nhận diện.
- [interactions.json](evidence/GATE-07-02B-20261025/interactions.json). Không kiểm thử lại mọi tổ hợp bộ lọc, tất cả nút thuê xe, mọi URL ngoài site; handlers được bảo toàn qua diff và các test trên là kiểm tra đại diện.

### Trạng thái kiểm thử

| Hạng mục | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Typecheck | PASS | pnpm exec tsc --noEmit --incremental false; exit 0, [log](evidence/GATE-07-02B-20261025/typecheck.log) |
| Lint | PASS | pnpm lint; exit 0, không ESLint warning/error, [log](evidence/GATE-07-02B-20261025/lint.log) |
| Production Build | NOT TESTED | Không chạy build/deploy trong nhiệm vụ thay ảnh |
| Runtime | PASS trong phạm vi đã kiểm tra | Routes, CTA, chip và navigation nêu trên hoạt động |
| Visual | PASS có giới hạn, chờ Owner duyệt thẩm mỹ | 12 trường hợp đã chụp và quan sát, crop mobile nêu rõ phía trên |
| Thiết bị vật lý / đa trình duyệt | NOT TESTED | Viewport mô phỏng không thay kiểm tra trên máy Owner |

Typecheck/lint chạy sau thay asset và code nền; sau đó chỉ tinh chỉnh chuỗi backgroundPosition của Di chuyển từ right bottom sang right 90%, được kiểm tra lại trực quan cả ba viewport; không thay type, logic hoặc class.

## Screenshot trước / sau

| Trang | Trước — 1366 | Sau — 1366 | Sau — 1440 | Sau — 390 |
|---|---|---|---|---|
| ve-hue | [Before](evidence/GATE-07-02B-20261025/before-ve-hue-1366.png) | [After](evidence/GATE-07-02B-20261025/after-ve-hue-1366.png) | [After](evidence/GATE-07-02B-20261025/after-ve-hue-1440.png) | [After](evidence/GATE-07-02B-20261025/after-ve-hue-390.png) |
| kham-pha | [Before](evidence/GATE-07-02B-20261025/before-kham-pha-1366.png) | [After](evidence/GATE-07-02B-20261025/after-kham-pha-1366.png) | [After](evidence/GATE-07-02B-20261025/after-kham-pha-1440.png) | [After](evidence/GATE-07-02B-20261025/after-kham-pha-390.png) |
| cam-nang | [Before](evidence/GATE-07-02B-20261025/before-cam-nang-1366.png) | [After](evidence/GATE-07-02B-20261025/after-cam-nang-1366.png) | [After](evidence/GATE-07-02B-20261025/after-cam-nang-1440.png) | [After](evidence/GATE-07-02B-20261025/after-cam-nang-390.png) |
| luu-tru | [Before](evidence/GATE-07-02B-20261025/before-luu-tru-1366.png) | [After](evidence/GATE-07-02B-20261025/after-luu-tru-1366.png) | [After](evidence/GATE-07-02B-20261025/after-luu-tru-1440.png) | [After](evidence/GATE-07-02B-20261025/after-luu-tru-390.png) |
## Checksum SHA-256

[baseline.csv](evidence/GATE-07-02B-20261025/baseline.csv) chứa 60 file trước sửa: src/public/locks/Prisma/config, bốn ảnh Owner và AGENTS. [integrity-final.csv](evidence/GATE-07-02B-20261025/integrity-final.csv) xác nhận chỉ bốn page và asset Lưu trú cũ đổi checksum trong tập này; 55 file còn lại giữ nguyên, gồm navigation, logo, Home, global font/theme, data và database schema/migration. Ba asset mới được ghi riêng trong asset-copy-verification.csv. Không tuyên bố đây là snapshot mọi file trên ổ đĩa.

### Asset Owner / public copy (cùng SHA-256)
- `lịch sử.png` → `public/images/heroes/hero_lich_su.png`: `D7143BA2693B61E9C3E35A2E0B4BB1320EA43CC7252430BB492E62AAEEA7CC9F`
- `khám phá.png` → `public/images/heroes/hero_kham_pha.png`: `6A832B20857101A2F6EF71778F152F173F9B88B63C8AA206B702E7AC1CB61E23`
- `di chuyển.png` → `public/images/heroes/hero_di_chuyen.png`: `C6DB8491B411D15D1481DF1161B0265C3953AD3A284E7C9A2BBF5FA655FCEE37`
- `lưu trú.png` → `public/images/heroes/hero_luu_tru.png`: `A2296E45F95E8FD2184921990DD73AAE3C53790B1220EA5F2985F65D54801558`

### Các file đã tồn tại — trước / sau

- `src\app\cam-nang\page.tsx`
  - Before: `C8B9E851C83DD6128092C2D355B28C0CA7A0CF5A8434BAADCF9BE92F690EDBEB`
  - After: `87E7709536FBAC0931AD734F7D95938912517FD38781B8F7A574D3A4A4DF891D`
- `src\app\kham-pha\page.tsx`
  - Before: `7B9F97276077266AA9FF30BBA094B6C07880041A66EBE30FE7953C9ACCCAB4BC`
  - After: `B1EA13C00855702C034C587CBE550B56BDA5BDA53F5148E32DAA7E21EF76CED0`
- `src\app\luu-tru\page.tsx`
  - Before: `9C6A38C7CB5CDD59E1EDD3C47B2CAE5FCF1BC09D22C5843EBD44D3876861318C`
  - After: `7B6EB36E1CE57C457063594401AC054496118A21D96A0879F2F49719C832FFA0`
- `src\app\ve-hue\page.tsx`
  - Before: `59DBEF26E3A69344C7D05EB98C48C6527928B30C2C2507B5F21A9EC32C06CBAF`
  - After: `BB581471A6F524AB52280C67846763C168F56D133E47B6B77395CEAE9B81FE97`
- `public\images\heroes\hero_luu_tru.png`
  - Before: `5A5392C5BE99B16D3BF32296208E291E99DA7E5E34D673BF6B7D6D80F0703B47`
  - After: `A2296E45F95E8FD2184921990DD73AAE3C53790B1220EA5F2985F65D54801558`
Logo owner-lotus.png giữ SHA-256 `6E53DD205EDE658EBCAEBAED45632A1E5613C8D01E141B22172F597EB6112B9D`. AGENTS.md và hồ sơ LOCK không sửa; không tự ghi nhận Owner đã nghiệm thu 07-02A/07-02B.

## Những vấn đề chưa giải quyết

- VERIFIED: cảnh báo React “Extra attributes from the server” với thuộc tính __processed_… đã có trước và còn sau: [console trước](evidence/GATE-07-02B-20261025/console-before.json), [console sau](evidence/GATE-07-02B-20261025/console-after.json). Nguồn chèn thuộc tính NOT VERIFIED; không tuyên bố console sạch hoặc sửa ngoài scope.
- Crop mobile và mức overlay cần Owner duyệt thẩm mỹ; không khẳng định mọi pixel ảnh gốc đều hiện khi dùng cover. Không tạo thêm layout hoặc sửa typography để né toàn bộ vùng chủ thể.
- Nội dung yêu cầu nhận được kết thúc ở câu chưa hoàn chỉnh “Nếu ảnh không phù hợp với”. Không suy diễn điều kiện/phần quyền bổ sung sau câu này. Chỉ thực hiện các phần đầy đủ đã được cấp phép và ngoại lệ Lưu trú Owner vừa duyệt.
- Không có REQUIRES OWNER EXCEPTION chưa được duyệt: ngoại lệ ghi đè đúng asset Lưu trú đã được xác nhận trước thao tác. Không có MISSING OWNER ASSET.

## Đề xuất bước tiếp theo / trạng thái nghiệm thu đề xuất

Đề xuất Owner duyệt bốn Hero qua screenshot và trang đang chạy. Các kiểm tra kỹ thuật trong phạm vi đã hoàn thành; nghiệm thu thẩm mỹ là PENDING OWNER REVIEW. Không tự LOCK gate, không tự sửa các vùng khác hoặc triển khai nhiệm vụ kế tiếp.

**HARD STOP — AWAIT OWNER REVIEW.**

**PASS = LOCK — FIX ONLY WHAT FAILED — NO SCOPE CREEP.**
