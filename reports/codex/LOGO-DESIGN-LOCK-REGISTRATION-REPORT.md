# HUẾ TRAVEL PRO V2.3 — LOGO DESIGN LOCK REGISTRATION

- **Project / Gate / Task ID:** HUẾ TRAVEL PRO V2.3 / GATE07-01 / LOGO-DESIGN-LOCK-REGISTRATION.
- **Ngày:** 24/10/2026, Asia/Saigon.
- **Root:** `A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro`.
- **Owner cấp phép:** đọc và xác định logo hiện hành; ghi checksum và phạm vi thiết kế LOCK; chỉ cập nhật AGENTS.md, hồ sơ LOCK và tạo báo cáo bắt buộc. Không sửa source, CSS, logo, navigation, asset hoặc dữ liệu/database.

## Executive Summary

**VERIFIED:** hồ sơ Owner đã tồn tại đúng vị trí `docs/locks/HUE_TRAVEL_PRO_V2.3_LOGO_DESIGN_LOCK_2026-10-24.md`. Đã đọc trước sửa và giữ nguyên phần quyết định gốc, bổ sung technical registration. AGENTS.md nay có mục10 **LOGO DESIGN — OWNER APPROVED / LOCKED (2026-10-24)**, dẫn đến hồ sơ chuẩn.

Logo hiện hành là PNG `public/images/brand/owner-lotus.png`, được Next Image trong AdaptiveNavigation tải. Biểu tượng không được vẽ lại bằng inline SVG. Wordmark là DOM text riêng bên cạnh ảnh. Đã ghi đủ asset, font khai báo, ba vùng mã thiết kế và checksum; không khóa nhầm toàn bộ logic navigation.

**NO SOURCE MODIFICATION:** so sánh SHA-256 trước/sau của53 file source/public/original asset và config liên quan: **53/53 không đổi**, không có file mới trong tập kiểm source/public. Chỉ hai tài liệu quản trị sửa và báo cáo này tạo mới.

## Công việc đã thực hiện / bằng chứng

1. Đọc đầy đủ AGENTS.md và hồ sơ LOCK Owner chỉ định.
2. Đọc các block logo/wordmark trong AdaptiveNavigation.tsx; kiểm tra đường dẫn render qua Shell.tsx:5,31.
3. Đọc localFont/body font-sans ở layout.tsx và fontFamily trong tailwind.config.ts để phân biệt icon PNG với font wordmark.
4. Tính SHA-256 bằng Get-FileHash SHA256 cho asset/file liên quan; tính riêng ba vùng mã visual.
5. Bổ sung điều kiện bảo toàn hình dáng, màu, kích thước, font/weight/case/spacing wordmark và asset; mọi thay đổi cần ngoại lệ Owner mới.
6. Kiểm tra vị trí/tồn tại hồ sơ và đọc lại các mục mới, xác nhận source/asset/config không đổi hash.

## Logo thực tế và SHA-256 tại đăng ký LOCK

Các đường dẫn dưới đây tương đối với root đã ghi ở đầu báo cáo. Hash đọc từ file hiện hành, không tự suy đoán từ screenshot.

| File | Vai trò | SHA-256 |
|---|---|---|
| `public/images/brand/owner-lotus.png` | Asset icon đang được tham chiếu; URL `/images/brand/owner-lotus.png` | `6E53DD205EDE658EBCAEBAED45632A1E5613C8D01E141B22172F597EB6112B9D` |
| `hoa sen.png` | Ảnh gốc Owner, byte-identical với public copy | `6E53DD205EDE658EBCAEBAED45632A1E5613C8D01E141B22172F597EB6112B9D` |
| `src/components/navigation/AdaptiveNavigation.tsx` | Renderer đang dùng, chứa icon và wordmark | `FDB4D916AB82AA2D7AF33A829B7917ABE16D484E46B49BA7C65F19DCAA349D5A` |
| `src/app/fonts/GeistVF.woff` | File sans local khai báo cho wordmark | `296FAFAFD41304F7C992079054B8AF914DBBD865F32DE97C66D0F613B55755D6` |
| `src/app/layout.tsx` | Cấu hình localFont / body font-sans | `1E9456DFF453135BE2872B1FE614D5A8D37AB17AD86D543E387C7EB60ECA7DF9` |
| `tailwind.config.ts` | Font chain khai báo | `D004D059322F844A8E1AB882520597FDE1272A65798643ACCA3B2A99CD402B4F` |

Không có Git repository tại root khi chạy git rev-parse, nên **không có commit ID để ghi nhận**. Đây là snapshot checksum file tại thời điểm đăng ký, không phải khẳng định một revision lịch sử không được lưu.

### Vùng thiết kế chính xác trong AdaptiveNavigation.tsx

| Vùng visual | Dòng inclusive | Kích thước icon | Region SHA-256 |
|---|---|---|---|
| Sidebar logo + wordmark | 164–181 | 44×44px | `39D123F4EFEAADD031F69844BCF140A81F0F18CCE3CC9B7DBB930B2DC2D6D012` |
| Home desktop logo + wordmark | 245–262 | 40×40px | `AE042E8F3C89FFCE7804771A18CEDD4CAA6F3D5ECA3A19AE99CB60C843F8EFAE` |
| Home mobile logo + wordmark | 291–308 | 36×36px | `062997ABF68639AAEBEAD8880E3E7B2CFC68653E3C1A08EABFF6175E06EF3A69` |

Quy tắc region hash: đọc các dòng inclusive bằng Get-Content, nối LF, UTF-8, **không LF cuối**. Lưu cả vùng dòng, URL asset và nhãn semantic vì số dòng có thể dịch chuyển sau một sửa khác được duyệt.

Wordmark hiện tại: `HUẾ` và `Travel Pro` (line2 có uppercase CSS). Sidebar/desktop dùng gap-3; mobile gap-2.5. Font/size/weight/tracking/leading/color từng context đã ghi nguyên class trong hồ sơ LOCK. Không đổi font global làm thay đổi wordmark mà không có ngoại lệ Owner. Cấu hình font không chứng minh actual font của từng glyph; đăng ký này không kết thúc chẩn đoán typography Phase1F.

### Phân định phạm vi LOCK

- Khóa **thiết kế logo**: silhouette, màu gốc, asset, tỷ lệ/kích thước theo context, font/weight/case/spacing và lockup đang được Owner chấp nhận.
- Full-file hash AdaptiveNavigation/layout/config chỉ là bằng chứng nhận diện snapshot; **không khóa toàn bộ file hoặc logic navigation**. Routes, handlers, transitions, capsule/sidebar, drawer và labels tiếp tục theo quyết định riêng đã có; nhiệm vụ này không cấp quyền sửa chúng.
- Header.tsx có SVG cũ nhưng không được Shell hiện tại import; không chọn nhầm SVG đó làm logo đã duyệt và không sửa/xóa file legacy.
- Bốn trang con mobile không có brand slot từ trước; không thêm header/logo slot mới trong nhiệm vụ tài liệu.

## Tài liệu đã cập nhật / phạm vi diff

1. **Sửa `AGENTS.md:123`**: thêm mục10 đăng ký quyết định với tên chuẩn, asset/hash, vùng mã và điều kiện không tự thay hình dáng/màu/kích thước/font wordmark/asset; phân định rõ visual lock với logic navigation. Không đổi các chính sách khác.
2. **Sửa `docs/locks/HUE_TRAVEL_PRO_V2.3_LOGO_DESIGN_LOCK_2026-10-24.md:30`**: chỉ bổ sung technical registration, bảng checksum và phạm vi visual; giữ phần Owner decision gốc. File vẫn ở đúng vị trí yêu cầu, không di chuyển/đổi tên.
3. **Tạo báo cáo này:** `reports/codex/LOGO-DESIGN-LOCK-REGISTRATION-REPORT.md`.

| Tài liệu | SHA-256 trước | SHA-256 sau cập nhật |
|---|---|---|
| AGENTS.md | `C6F7A8C4AADC5EDAC614D14E925CF6792C7641BC7534F90322C07CFC07465093` | `EBF22FE544BDFAB52B4A68F97033B71DF53E9564FFAC60B482E44A62B175B1AA` |
| Hồ sơ LOCK | `D2905A330362BCB8F23CD355F6BD42F95B709A08D41429CD47678EFA2667AE28` | `F6D4211C32ADF2DD1EBBF22485524410544056D42EB1814E448EF954EB477293` |

## Root Cause / vấn đề còn lại

Đây là đăng ký quản trị theo quyết định Owner, không phải sửa lỗi hiển thị. Hồ sơ đã có quyết định visual nhưng chưa có danh tính kỹ thuật chi tiết của asset/renderer/vùng mã; phần bổ sung giải quyết thiếu sót này. Không phát hiện thiếu hồ sơ ở đường dẫn yêu cầu.

Không có runtime visual test mới trong lượt này. Bằng chứng dưới đây là **lịch sử từ lượt rollout**, không giả làm ảnh mới:

- [Báo cáo rollout](GATE-07-01-LOGO-ROLLOUT-LOCK-REPORT.md).
- [Logo sidebar](evidence/GATE-07-01-LOGO-ROLLOUT-20261024/approved-sidebar-logo.png).
- [Home mobile](evidence/GATE-07-01-LOGO-ROLLOUT-20261024/home-mobile.png).

## Test Results / xác nhận không sửa source

| Kiểm tra | Kết quả |
|---|---|
| Hồ sơ LOCK đúng vị trí, đọc được | PASS |
| Asset/public copy trùng checksum | PASS |
| Renderer và ba vùng visual xác định | PASS qua source inspection |
| Hash trước/sau53 file source/public/original asset/config | PASS:53/53 không đổi |
| Typecheck / Build | NOT TESTED — chỉ tài liệu |
| Runtime Tests / Visual Tests mới | NOT TESTED — không cần đổi runtime cho đăng ký tài liệu |

**NO SOURCE CODE / CSS / ASSET / NAVIGATION / DATA / DATABASE MODIFICATION.** Không cài package, không chạy build/dev server hoặc triển khai trong nhiệm vụ này. Chỉ ba file Markdown được tạo/cập nhật như trên.

## Đề xuất bước tiếp theo / nghiệm thu đề xuất

Đăng ký đã hoàn tất; đề xuất **PASS cho hồ sơ đăng ký**, chờ Owner duyệt báo cáo. Logo có trạng thái Owner-approved từ quyết định đã cung cấp; không tự tuyên bố Owner đã nghiệm thu báo cáo này hoặc toàn website. Không còn bước implementation trong nhiệm vụ này; mọi đổi logo tiếp theo cần ngoại lệ rõ ràng của Owner.

**PASS = LOCK — FIX ONLY WHAT FAILED — NO SCOPE CREEP.**

**HARD STOP — AWAIT OWNER REVIEW.**
