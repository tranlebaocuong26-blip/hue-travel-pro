# HUẾ TRAVEL PRO V2.3 — GATE 07-03B
## Vietnamese Typography System Implementation

- **Ngày:** 2026-10-25, Asia/Saigon.
- **Project:** `A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro`.
- **Task:** Be Vietnam Pro UI + Noto Serif editorial; controlled migration, regression, recovery.
- **Đề xuất nghiệm thu:** **PARTIAL PASS — OWNER DECISION REQUIRED / AWAIT OWNER VISUAL ACCEPTANCE**.
- Không tự LOCK Gate, không mở 07-03C, không deploy.

## 1. Executive Summary

Đã áp dụng Be Vietnam Pro cho navigation, UI/body, search/filter, buttons, card text, metadata và breadcrumb trong phạm vi triển khai; Noto Serif cho 13 vị trí editorial đang dùng `font-serif` trên bốn trang con.

**Hai phần UI được giữ font legacy sau phát hiện reflow:** nội dung landing Trang chủ (navigation vẫn dùng font mới) và mô tả Hero Di chuyển trên desktop. Đổi toàn bộ body đã làm ba dòng display Home dịch0,5 px; đổi mô tả Di chuyển làm Hero cao thêm 24 px. Đã giới hạn rollout thay vì sửa layout LOCK. Vì vậy không gọi migration toàn bộ UI là hoàn tất.

H1 Lưu trú Noto Serif28 px xuống thêm một dòng trên desktop. Theo ngoại lệ typography H1 Owner cấp, đã giảm riêng desktop xuống24 px, giữ câu chữ và line-height32 px: trở lại hai dòng/64 px như baseline. Mobile vẫn20 px, chiều cao110 px như baseline. Không sửa size/crop/gradient/ảnh Hero.

Kết quả chính: đủ25 tổ hợp trước/sau;0 document overflow;25 H1 có cùng chiều cao trước/sau;21 logo lockup và57 vùng chữ LOCK có bounds/computed/pixel giữ nguyên. Typecheck, lint, production build PASS. Navigation/filter/T05/A01 đã thử thực tế. Actual per-glyph font attribution, CLS và real browser zoom chưa xác minh.

## 2. Owner Authorization

Owner phê duyệt qua yêu cầu đính kèm “GATE 07-03B — VIETNAMESE TYPOGRAPHY SYSTEM IMPLEMENTATION / BE VIETNAM PRO + NOTO SERIF”. Quyền này mở đúng file/kiểu thay đổi typography được nêu; không mở Home source, Shell, globals, logo visual, data, API, database hay các phase khác.

Đã đọc AGENTS.md, Logo Design LOCK, báo cáo 07-03A và preview, typography audit07-01, T05/T07,07-02A,07-02B,07-02C-00 và07-02C-02A. Đối chiếu source hiện tại trước sửa, không áp patch theo line number cũ. Không sửa AGENTS/LOCK để tự cấp quyền.

## 3. Preflight Baseline

Không có Git repository (`git rev-parse` báo not a git repository). Không git init/reset/checkout/commit/push. Không có cơ sở xác định “uncommitted changes”; checkpoint giữ đúng bytes trên đĩa tại đầu task. Không quan sát được buffer chưa lưu của editor, không tuyên bố chúng không tồn tại.

Trước implementation đã lập [preflight](evidence/GATE-07-03B/preflight.md), [baseline 59 file](evidence/GATE-07-03B/baseline.csv), danh sách7 file dự kiến sửa và8 file mới, rồi copy7 file vào `checkpoint-before/`. Mỗi backup được copy lại sang `restore-rehearsal/` và so SHA-256 với nguồn:7/7 byte-identical. Chưa sửa source khi tạo/xác minh checkpoint.

## 4. Font Source & License

Sử dụng đúng file đã thử tại07-03A, kiểm tra hash trước copy: [font-input-verification.json](evidence/GATE-07-03B/font-input-verification.json). Nguồn gốc: repository chính thức [Be Vietnam Pro](https://github.com/google/fonts/tree/main/ofl/bevietnampro) và [Noto Serif](https://github.com/google/fonts/tree/main/ofl/notoserif). Không chọn Noto Sans, không tải font Internet mới trong Gate này.

Hai bản OFL/copyright được copy nguyên byte vào production. [Be Vietnam Pro OFL](https://github.com/google/fonts/blob/main/ofl/bevietnampro/OFL.txt), [Noto Serif OFL](https://github.com/google/fonts/blob/main/ofl/notoserif/OFL.txt): SIL Open Font License 1.1, self-host/embed theo điều kiện giấy phép. Không copy font Windows, không cài font OS/package.

Không tìm thấy `woff2_compress` trong PATH; Python runtime không có fontTools. Giữ TTF hợp lệ đã thử theo quyền Owner, không chuyển đổi hoặc subset không được kiểm chứng. Sáu font tổng **2,570,400bytes**, chưa tính OFL. Không coi đây là ngân sách đã tối ưu; không đo cold mobile load/CLS/LCP. `font-display:swap`, `preload:false` cho hai family mới để không preload cả bộ weight vào Home. Geist cũ vẫn giữ nguyên.

## 5. Font Files Added

| File mới | Bytes | SHA-256 |
|---|---:|---|
| `src/app/fonts/BeVietnamPro-Regular.ttf` | 132948 | `CD1EF6E9D7DB28AD5CDB88A65CCBE693870E60D340B791F349D248342B4FE4C3` |
| `src/app/fonts/BeVietnamPro-Medium.ttf` | 135980 | `B60832BFA0FCD015158112C64D7E3FDAD3B0C6287D1823F85A3103636E845268` |
| `src/app/fonts/BeVietnamPro-SemiBold.ttf` | 136736 | `BD8E27EB02720B9D91E59E4F10A90878643219F25CE6A8D9A4F06A8A88D3BB71` |
| `src/app/fonts/BeVietnamPro-Bold.ttf` | 140300 | `7F738FE5C43C8872807B20E2D30D42163618DE8A4DAF7F48A939ADAC32C16847` |
| `src/app/fonts/BeVietnamPro-Italic.ttf` | 137244 | `A33EBB3F68E0E260A7D3874D64259AD309971A2DAF969E7CE5F444D70BCE535F` |
| `src/app/fonts/NotoSerif-VF.ttf` | 1887192 | `4D8E6761424656867019081A1A01336F3CB086982682698714054FC33F782713` |
| `src/app/fonts/BeVietnamPro-OFL.txt` | 4397 | `6B7F8F73609A25EA78C891E34CF37B06F8A676B7EA986E941E43B009110F2A85` |
| `src/app/fonts/Noto Serif-OFL.txt` | 4396 | `CEE9892F9F0CC8FE882C9E9537EE6A89621D86EE7CEAF70B02E2B2B1C25C061A` |

Be Vietnam Pro: normal400/500/600/700, italic400 dùng cho metadata italic hiện có. Noto Serif: một variable font100–900; editorial hiện có weight700 và H1 ba trang dùng800 nên giữ axis, không thêm nhiều file static. Không copy Noto Serif italic vì các vùng editorial được triển khai không cần italic. Không xóa font cũ.

Next build sinh7 media font khớp nguyên byte6 font mới + Geist: [compiled-font-media.json](evidence/GATE-07-03B/compiled-font-media.json). Các font URL là `/_next/static/media/...`, không Google Fonts CDN runtime. [Compiled font-face rules](evidence/GATE-07-03B/compiled-font-face-rules.txt).

## 6. Exact Changed Files

**7 file hiện có sửa,8 file font/license mới =15 file production tác động.** Báo cáo/runbook/checkpoint/evidence tách khỏi số này.

| File | Phạm vi thay đổi cuối |
|---|---|
| `src/app/layout.tsx` | Thêm hai localFont, giữ nguyên Geist, gắn variables/UI body; selector font legacy cho root landing để giữ vị trí display |
| `tailwind.config.ts` | Thêm ui/editorial/brand; font-sans compatibility alias chuyển UI; giữ serif cũ cho các vùng ngoài bốn page chính |
| `src/components/navigation/AdaptiveNavigation.tsx` | Chỉ6 declaration class:3 font-ui ở navigation wrappers,3 font-brand ở wordmark wrappers. Không đổi DOM/logo/href/handlers/transforms/icons/labels |
| `src/app/ve-hue/page.tsx` | 2 font-serif→font-editorial |
| `src/app/kham-pha/page.tsx` | 3 font-serif→font-editorial |
| `src/app/cam-nang/page.tsx` | 4 font-serif→font-editorial; thêm lg:font-brand riêng mô tả Hero |
| `src/app/luu-tru/page.tsx` | 4 font-serif→font-editorial; riêng H1 desktop28→24 px |

[Exact changed-files](evidence/GATE-07-03B/changed-files.json). Diff từng file trong `evidence/GATE-07-03B/diffs/`, theo đúng đường dẫn nguồn +`.diff`. Source ngoài allowlist: **0 thay đổi trong baseline**. Không sửa `src/app/page.tsx`, Shell, globals, data/lib/types/Prisma/API/package/AGENTS/LOCK/ảnh.

## 7. Typography Tokens

| Token | Vai trò / chain |
|---|---|
| `--font-ui`, `font-ui`, compatibility `font-sans` | Local Be Vietnam Pro + Next adjusted fallback → Segoe UI → Arial → sans-serif |
| `--font-editorial`, `font-editorial` | Local Noto Serif + adjusted fallback → Georgia → serif; chỉ13 vị trí trên bốn main pages |
| Geist `--font-sans`, `font-brand` | Exact legacy Geist + Next adjusted Arial → Segoe UI → Roboto → Arial → sans-serif |

Không đổi Geist localFont arguments nên family/fallback identity cũ giữ nguyên. `font-serif` cũ không được tự đổi toàn website: các detail page/role ngoài scope không tự nhận Noto Serif.

Selector layout `[&_main>div[style*='hero']]:font-brand` hiện chỉ khớp root landing có inline background Hero; bốn root subpage không có style đó. Nó chỉ đặt family, không đổi layout/DOM. Đây là giới hạn rollout Home UI, không phải sửa display. Nếu sau này thay cấu trúc root landing, phải kiểm tra lại dependency này.

## 8. Vietnamese Unicode Coverage Results

Corpus07-03A:29 chữ cái hoa/thường;12 nguyên âm ×6 thanh ×2 kiểu chữ; NFC 178codepoint duy nhất, NFD 54. Parser đọc Unicode cmap 4/12, glyph ID khác0; không dùng `document.fonts.check()` làm chứng chỉ coverage.

| Kiểm tra | Kết quả / phạm vi |
|---|---|
| CMAP sáu font production sau copy | **PASS — 0 missing NFC, 0 missing NFD**, SHA khớp preview; GPOS/GSUB có trong file |
| Runtime loading | **PASS trong mẫu**:25 snapshot font status loaded; computed UI/editorial đúng family; specimen FaceSet6 face loaded; build media khớp file |
| Glyph clipping/tofu | **PASS theo quan sát các ảnh đã xem**, không thấy dấu bị cắt/tofu mới trong H1, controls và corpus |
| Actual per-glyph fallback | **NOT VERIFIED** — browser connector không trả rendered-font attribution; không suy ra từ computed family hoặc check=true |
| Vietnamese shaping | **VERIFIED ở mức visual corpus đã xem**: NFC/NFD hiện đủ dấu tại weights thử; không chứng nhận mọi chuỗi Unicode, shaping engine hoặc mọiOS |
| Home/brand coverage legacy | Giữ theo LOCK, không tự chữa thiếu coverage của Geist trong vùng này |

[Production coverage](evidence/GATE-07-03B/production-font-coverage.json), [specimen loading](evidence/GATE-07-03B/font-proof-loading.json), [full corpus screenshot](evidence/GATE-07-03B/font-proof-desktop.png). Specimen độc lập dùng đúng bytes production,10 mẫu: UI400/500/600/700 +italic400; editorial400/500/600/700/800. Đã xem cả4 phần screenshot, không dùng ảnh chữ thay HTML production. Server specimen đã dừng sau kiểm tra; HTML/fonts lưu tại `evidence/GATE-07-03B/font-proof/` để tái lập.

## 9. Brand / Wordmark Isolation Proof

Đã so **21 logo lockup đang hiện** ở matrix: bounds và pixel nguyên vẹn; không chỉ hash JSX. Đã so **42 dòng wordmark** riêng: computed family/size/weight/line-height/letter-spacing/style/color/bounds và pixel bằng nhau.

Family vẫn `__geistSans_1e4310, __geistSans_Fallback_1e4310, "Segoe UI", Roboto, Arial, sans-serif`. Font asset/fallback CSS gốc không đổi. Không có API đặt tên face từng glyph, nhưng ảnh render lockup thực tế pixel-identical tại cùng viewport/bounds là bằng chứng không đổi diện mạo; không tuyên bố đã biết tên font cho mỗi dấu.

- [Lockup comparison21](evidence/GATE-07-03B/brand-lockup-comparison.json).
- [Computed/pixel comparison57 text regions](evidence/GATE-07-03B/brand-home-comparison.json).
- Home desktop: [Before](evidence/GATE-07-03B/logo-lockup-before-home-1366.png) / [After](evidence/GATE-07-03B/logo-lockup-after-home-1366.png).
- Sidebar: [Before](evidence/GATE-07-03B/logo-lockup-before-ve-hue-1366.png) / [After](evidence/GATE-07-03B/logo-lockup-after-ve-hue-1366.png).
- Mobile Home: [Before](evidence/GATE-07-03B/logo-lockup-before-home-390.png) / [After](evidence/GATE-07-03B/logo-lockup-after-home-390.png).

Logo PNG SHA vẫn `6E53DD205EDE658EBCAEBAED45632A1E5613C8D01E141B22172F597EB6112B9D`. [Navigation diff, chỉ declarations font](evidence/GATE-07-03B/diffs/src/components/navigation/AdaptiveNavigation.tsx.diff). Không thay cấu trúc/logo/weight/tracking/gap/color.

## 10. Home Typography Non-regression

Ba dòng HUẾ / TRAVEL PRO / Huế có chi hay? có computed styles, bounds và screenshot pixel giữ nguyên ở cả5 viewport: **15/15 text regions equal**. Không sửa Home source hoặc inline fonts Palatino/Times. Các ảnh crop so sánh được cắt từ screenshot gốc tại cùng tọa độ, không recolor, warp hoặc chỉnh để khớp.

Lượt thử áp UI body toàn Home làm y tăng0,5 px tại1366. Đã giữ legacy family cho nội dung landing để loại reflow; [trial](evidence/GATE-07-03B/stage-c-restart-home-1366.json) so với [final](evidence/GATE-07-03B/after-home-1366.json). Navigation vẫn Be Vietnam Pro. Không tự can thiệp layout Home để “bù” vị trí.

## 11. Four Subpage Headings Before / After

| H1 | Trước | Sau | Chiều cao / ngoại lệ |
|---|---|---|---|
| Lịch sử Huế | Segoe UI/Georgia | Noto Serif | Desktop48 px, mobile24 px; height không đổi |
| Khám phá Huế | Segoe UI/Georgia | Noto Serif | Cùng size/weight/leading/tracking trước; height không đổi |
| Di chuyển ở Huế | Segoe UI/Georgia | Noto Serif | Cùng typography size; mô tả desktop giữlegacy để Hero không cao thêm |
| Câu H1 Lưu trú đã duyệt | Segoe UI/Georgia | Noto Serif | Desktop28→24 px, line32 px,2 dòng/64 px; mobile20 px,4 dòng/110 px như trước |

Câu Lưu trú giữ nguyên và chỉ xuất hiện một lần: “Những homestay xinh xắn, khách sạn tiện nghi và không gian lưu trú đầy cảm hứng cho hành trình của bạn.” Không đưa lại tiêu đề cũ.

[Computed H1](evidence/GATE-07-03B/h1-computed-before-after.json). Ảnh before/after các H1 tại [1366](evidence/GATE-07-03B/headings-before-after-1366.png), [1440](evidence/GATE-07-03B/headings-before-after-1440.png), [1650](evidence/GATE-07-03B/headings-before-after-1650.png), [1920](evidence/GATE-07-03B/headings-before-after-1920.png), [390](evidence/GATE-07-03B/headings-before-after-390.png). Ảnh montage để đọc nhanh; screenshot gốc và raw JSON ở matrix. Không lấy bounding box giao nhau làm bằng chứng ink collision.

## 12. Twenty-five Viewport Test Matrix

Browser in-app trên Windows. Mobile390×844 là viewport mô phỏng, không phải điện thoại vật lý. Giá trị overflow là scrollWidth−clientWidth;0 không có nghĩa mọi state UI đều được kiểm.

| Route | Viewport | Font status sau | Overflow trước→sau | H1height delta(px) | Evidence |
|---|---|---|---:|---:|---|
| `/` | 1366×768 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-home-1366.png) / [After](evidence/GATE-07-03B/after-home-1366.png) |
| `/ve-hue` | 1366×768 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-ve-hue-1366.png) / [After](evidence/GATE-07-03B/after-ve-hue-1366.png) |
| `/kham-pha` | 1366×768 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-kham-pha-1366.png) / [After](evidence/GATE-07-03B/after-kham-pha-1366.png) |
| `/cam-nang` | 1366×768 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-cam-nang-1366.png) / [After](evidence/GATE-07-03B/after-cam-nang-1366.png) |
| `/luu-tru` | 1366×768 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-luu-tru-1366.png) / [After](evidence/GATE-07-03B/after-luu-tru-1366.png) |
| `/` | 1440×900 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-home-1440.png) / [After](evidence/GATE-07-03B/after-home-1440.png) |
| `/ve-hue` | 1440×900 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-ve-hue-1440.png) / [After](evidence/GATE-07-03B/after-ve-hue-1440.png) |
| `/kham-pha` | 1440×900 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-kham-pha-1440.png) / [After](evidence/GATE-07-03B/after-kham-pha-1440.png) |
| `/cam-nang` | 1440×900 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-cam-nang-1440.png) / [After](evidence/GATE-07-03B/after-cam-nang-1440.png) |
| `/luu-tru` | 1440×900 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-luu-tru-1440.png) / [After](evidence/GATE-07-03B/after-luu-tru-1440.png) |
| `/` | 1650×786 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-home-1650.png) / [After](evidence/GATE-07-03B/after-home-1650.png) |
| `/ve-hue` | 1650×786 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-ve-hue-1650.png) / [After](evidence/GATE-07-03B/after-ve-hue-1650.png) |
| `/kham-pha` | 1650×786 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-kham-pha-1650.png) / [After](evidence/GATE-07-03B/after-kham-pha-1650.png) |
| `/cam-nang` | 1650×786 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-cam-nang-1650.png) / [After](evidence/GATE-07-03B/after-cam-nang-1650.png) |
| `/luu-tru` | 1650×786 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-luu-tru-1650.png) / [After](evidence/GATE-07-03B/after-luu-tru-1650.png) |
| `/` | 1920×1080 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-home-1920.png) / [After](evidence/GATE-07-03B/after-home-1920.png) |
| `/ve-hue` | 1920×1080 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-ve-hue-1920.png) / [After](evidence/GATE-07-03B/after-ve-hue-1920.png) |
| `/kham-pha` | 1920×1080 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-kham-pha-1920.png) / [After](evidence/GATE-07-03B/after-kham-pha-1920.png) |
| `/cam-nang` | 1920×1080 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-cam-nang-1920.png) / [After](evidence/GATE-07-03B/after-cam-nang-1920.png) |
| `/luu-tru` | 1920×1080 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-luu-tru-1920.png) / [After](evidence/GATE-07-03B/after-luu-tru-1920.png) |
| `/` | 390×844 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-home-390.png) / [After](evidence/GATE-07-03B/after-home-390.png) |
| `/ve-hue` | 390×844 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-ve-hue-390.png) / [After](evidence/GATE-07-03B/after-ve-hue-390.png) |
| `/kham-pha` | 390×844 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-kham-pha-390.png) / [After](evidence/GATE-07-03B/after-kham-pha-390.png) |
| `/cam-nang` | 390×844 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-cam-nang-390.png) / [After](evidence/GATE-07-03B/after-cam-nang-390.png) |
| `/luu-tru` | 390×844 | loaded | 0 → 0 | 0 | [Before](evidence/GATE-07-03B/before-luu-tru-390.png) / [After](evidence/GATE-07-03B/after-luu-tru-390.png) |

Đã xem ảnh H1 trước/sau ở đủ5 viewport, full screenshots mẫu, filter dài, footer và focus. Chưa thấy clipping dấu, collision, heading che nav, CTA mất hoặc grid vỡ mới trong trạng thái kiểm. Assets/crop/gradient/hero wrapper source nguyên byte. H1 và mốc filter/topic đầu sau Hero giữ y/height baseline sau các giới hạn rollout.

**Card metrics:**5 suggestion cards A01 vẫn89 px ở cả5 viewport. Sáu rental footer ×5: nhãn Chi tiết24,5px/Vị trí16,5px, nowrap; nguồn không horizontal overflow; links nằm trong footer. Card có thể cao thêm do text wrap của Be Vietnam Pro, không bị ép height. [Direct after measurements](evidence/GATE-07-03B/t05-footer-measurements.json); [card comparison](evidence/GATE-07-03B/rental-card-height-comparison.csv).

Card comparison ghi rõ before-height **suy từ DOM anchor positions và padding/border/gap bất biến**, after là wrapper rect đo trực tiếp; không giả làm đã thu before-wrapper rect. Delta tối đa31 px ở các mẫu ổn định; tại1366 một số card+15 px,1440 không đổi;1650/1920 một số+31 px;mobile một số+15/+31 px. Không sửa card layout. Source footer/A01/T07 được xác minh không thay cấu trúc/handlers. Chưa có đo wrapper trước/sau đầy đủ cho cả8 accommodation cards; không chứng nhận mọi chiều cao card bất biến.

CLS/layout shift trong quá trình font-swap **NOT VERIFIED**: connector không cung cấp số đo CLS. Bounds ổn định cuối tải không thay thế CLS. [MatrixJSON](evidence/GATE-07-03B/final-25-case-matrix.json).

## 13. Browser Zoom Findings

**BROWSER ZOOM125/150 — NOT VERIFIED.**100% thực cũng chưa có chỉ báo đủ xác minh. Không đổi viewport/text multiplier/CSSscale để giả làm zoom. Matrix chỉ ghi CSSviewport. Không kết luận đã sửa hiện tượng dấu dính trên đúng browser/zoom laptop Owner.

Checklist Owner: mở Chrome/Edge tại `/`, `/ve-hue`, `/kham-pha`, `/cam-nang`, `/luu-tru`; Ctrl+0 và xem menu browser xác nhận100%; đặt125% rồi150%; quan sát dấu hỏi/ngã/nặng, H1 dài Lưu trú, nav, option giá, footer thuêxe và focus A01. Nếu có lỗi, ghi browser/version, Windows scaling, viewport/content width, zoom thực và screenshot. Không chỉnh logo/Hero để xử lý ngoài phạm vi.

## 14. Navigation / Filter / Rental / A01 Regression

| Nhóm | Kết quả có bằng chứng |
|---|---|
| Desktop navigation | **PASS sampled:** Home→cả4 trang; các lượt History/Discovery/Rental→Home có state sidebar/capsule đúng; [JSON](evidence/GATE-07-03B/navigation-functional.json) |
| Mobile | **PASS:** mở drawer→Lịch sử; bottomnav→Khám phá→Di chuyển→Lưu trú→Home; [JSON](evidence/GATE-07-03B/mobile-navigation-functional.json), [drawer](evidence/GATE-07-03B/mobile-drawer.png) |
| T05 links | **PASS 6/6 details:** click và H1/URL đúng; **PASS 6/6 Maps mở đúng query tab**; không chứng nhận địa lý của Maps. [Details](evidence/GATE-07-03B/rental-details-functional.json), [Map tabs](evidence/GATE-07-03B/rental-map-tabs.json) |
| T05 layout | **PASS 30 footer samples:** nowrap/không source overflow; [desktop screenshot](evidence/GATE-07-03B/t05-footer-desktop.png), full settled cards `t05-settled-all-cards-<width>.png` |
| T07 labels | **PASS laptop samples:** chọn4 option dài, đọc đủ trên [1366](evidence/GATE-07-03B/t07-long-options-1366.png), [1440](evidence/GATE-07-03B/t07-long-options-1440.png), [1650](evidence/GATE-07-03B/t07-long-options-1650.png), [1920](evidence/GATE-07-03B/t07-long-options-1920.png). Native select mobile không đảm bảo hiện trọn mọi nhãn dài |
| Filters/query | **PASS sampled:** resort+Đại Nội+coffee+luxury cập nhật đủ query và0 kết quả đúng giao điều kiện; reset 8. q=Mường Thanh/q=muong thanh đều 1; budget giữ sau reload; reset 8. [FilterJSON](evidence/GATE-07-03B/t07-filter-functional.json), [search/query/reset](evidence/GATE-07-03B/search-query-reset.json) |
| A01 | **PASS:** Tab đủ5 card, Shift+Tab ngược;50 Enter/Space activations+50 reset, kết quả3/3/2/6/1 đúng task trước; [activation](evidence/GATE-07-03B/a01-activation-reset.json), [keyboard](evidence/GATE-07-03B/a01-keyboard-focus.json) |
| Focus | **PASS ổn định:**25 card focus-visible,89 px, không bị bottomnav che; [settledJSON](evidence/GATE-07-03B/a01-focus-settled.json), [mobile](evidence/GATE-07-03B/a01-focus-settled-390.png) |
| Breadcrumb | UI family mới, không sửa route/text; [computed](evidence/GATE-07-03B/breadcrumb-computed.json), [ảnh](evidence/GATE-07-03B/breadcrumb-after.png) |
| Content | 6Places/6Rentals/8Accommodations giữ data hash; không thêm giá/rating/ảnh hoặc database |

Một lượt loop click nav quá nhanh đã bị existing transition guard bỏ qua; đã test lại từng lượt sau ổn định, không sửa handlers. Đó không phải bằng chứng mọi thao tác trong transition đều PASS. Focus/card measurements ngay sau resize có số đo giữa transition; các file provisional giữ làm lịch sử nhưng dùng bản reload/settled để kết luận geometry.

## 15. Typecheck / Lint / Build

- `pnpm exec tsc --noEmit --incremental false`: **PASS**, exit0.
- `pnpm lint`: **PASS**, exit0, No ESLint warnings or errors.
- `pnpm build`: **PASS**, exit0, compiled/type validation và30static pages hoàn tất. Lần đầu FAIL vì EPERM tạo cache `.next/types/app/tim-kiem`; chạy lại cùng lệnh bằng quyền host hiện có thành công. Không sửa permission/source để che lỗi.
- Production build local `pnpm start --hostname 0.0.0.0`: đã smoke5 route, font status loaded và ảnh lưu riêng `production-fresh-*`. Không lấy dev/HTTP200 làm chứng chỉ build.

Sau production build đã đối chiếu lại 13 vùng chữ LOCK tại1366 bằng tab/ảnh mới: computed, bounds và pixel đều bằng baseline; [production lock comparison](evidence/GATE-07-03B/production-build-lock-comparison.json).

[QualityJSON](evidence/GATE-07-03B/quality-gates.json), [typecheck](evidence/GATE-07-03B/typecheck.log), [lint](evidence/GATE-07-03B/lint.log), [build](evidence/GATE-07-03B/build.log), [first build failure](evidence/GATE-07-03B/build-first-attempt.log), [build smoke](evidence/GATE-07-03B/production-fresh-smoke.json).

Console còn React warning `Extra attributes ... __processed_*` đã có trong báo cáo gate trước; [console hiện tại](evidence/GATE-07-03B/runtime-console.json). Không tuyên bố console sạch hoặc đã sửa warning này. Dev cũng nhắc future allowedDevOrigins choLAN; không đổi config/bảo mật ngoài scope.

## 16. SHA-256 and Source Diff

**59 baseline:7 changed đúng allowlist,52 unchanged;8 file mới đã đăng ký.** [Integrity](evidence/GATE-07-03B/integrity-final.csv), [protected regions](evidence/GATE-07-03B/protected-region-verification.json). Bốn page khôi phục chính xác bytes baseline khi đảo đúng các declaration font được task thêm/thay; navigation tương tự khi bỏ6 font class. Đây là kiểm chứng source của handlers/grid/markup/data mapping/href/query/crop, không thay thế test tương tác.

| File | SHA trước | SHA sau |
|---|---|---|
| `src/app/layout.tsx` | `1E9456DFF453135BE2872B1FE614D5A8D37AB17AD86D543E387C7EB60ECA7DF9` | `0378BB6475D431B15939406CE010756B7172312D4DE2CAA94389330648864A93` |
| `tailwind.config.ts` | `D004D059322F844A8E1AB882520597FDE1272A65798643ACCA3B2A99CD402B4F` | `F5F33F7590E9B4101D8023AEE9B4267BA7EF891F8284C565CEAF4C921BA574FC` |
| `src/components/navigation/AdaptiveNavigation.tsx` | `00B9231AFE4FACB5E16C03B20A4F8A5D30DCB95CB5F003E7A68BE61A2BF20E89` | `C8956693A1EADA727D65970A2BE73309AF5E681C1BD73844B1653EBC027D81CD` |
| `src/app/ve-hue/page.tsx` | `BB581471A6F524AB52280C67846763C168F56D133E47B6B77395CEAE9B81FE97` | `159401601D0106B51F2A20CD44E637830DDA55624390E81AFA261F17DCDF67B2` |
| `src/app/kham-pha/page.tsx` | `B1EA13C00855702C034C587CBE550B56BDA5BDA53F5148E32DAA7E21EF76CED0` | `75BFE61F61CE7997681E259808FCA5BAA1D7F9DB128A0285BF8E1003FE403028` |
| `src/app/cam-nang/page.tsx` | `87E7709536FBAC0931AD734F7D95938912517FD38781B8F7A574D3A4A4DF891D` | `418B40B267CE4891D30BDF9D6F13D668B0173B194F61F3EBB1764FB62B1DFFE2` |
| `src/app/luu-tru/page.tsx` | `B4A3D56BC8EC3AAD01B2B2159F0E554F38804A6D8E0114F5B0D76180BDC06A89` | `321B0E436A807562225A09FD1172507119AC8E44F60090F0F60EAABDBE0DC484` |
| `src/app/fonts/BeVietnamPro-Regular.ttf` | `NEW` | `CD1EF6E9D7DB28AD5CDB88A65CCBE693870E60D340B791F349D248342B4FE4C3` |
| `src/app/fonts/BeVietnamPro-Medium.ttf` | `NEW` | `B60832BFA0FCD015158112C64D7E3FDAD3B0C6287D1823F85A3103636E845268` |
| `src/app/fonts/BeVietnamPro-SemiBold.ttf` | `NEW` | `BD8E27EB02720B9D91E59E4F10A90878643219F25CE6A8D9A4F06A8A88D3BB71` |
| `src/app/fonts/BeVietnamPro-Bold.ttf` | `NEW` | `7F738FE5C43C8872807B20E2D30D42163618DE8A4DAF7F48A939ADAC32C16847` |
| `src/app/fonts/BeVietnamPro-Italic.ttf` | `NEW` | `A33EBB3F68E0E260A7D3874D64259AD309971A2DAF969E7CE5F444D70BCE535F` |
| `src/app/fonts/NotoSerif-VF.ttf` | `NEW` | `4D8E6761424656867019081A1A01336F3CB086982682698714054FC33F782713` |
| `src/app/fonts/BeVietnamPro-OFL.txt` | `NEW` | `6B7F8F73609A25EA78C891E34CF37B06F8A676B7EA986E941E43B009110F2A85` |
| `src/app/fonts/Noto Serif-OFL.txt` | `NEW` | `CEE9892F9F0CC8FE882C9E9537EE6A89621D86EE7CEAF70B02E2B2B1C25C061A` |

Không sửa source ngoài allowlist; assets cũ/data/AGENTS/LOCK/Shell/Home/globals nguyên byte trong tập kiểm. Cache `.next` phát sinh do dev/build, không phải source diff. Không thao tác database. Không tự nhận đây là snapshot toàn ổđĩa.

## 17. Rollback Manifest & Recovery Rehearsal

[Rollback manifest](evidence/GATE-07-03B/rollback-manifest.csv) có existed/new, hash before/after, backup path, vùngLOCK và restore status. Checkpointbefore/after giữ đúng7 source files. Before backup → sandbox restore 7/7 đã thử và hash khớp, không rollback live chỉ để diễn tập.

Script [rollback.py](evidence/GATE-07-03B/rollback.py) mặc định dry-run: **PASS7 existing/8 new, NO WRITES**. Chỉ khi `--apply` mới restore, và từ chối nếu currentafterhash/backup khác. Chỉ xóa đúng8 file mới đã đăng ký sau restore và kiểm tra source dependency; không recursive delete, không xóa file cũ hoặc thay đổi Owner độc lập.

**Recovery rehearsal VERIFIED; actual full rollback NOT PERFORMED.** Không gọi việc có backup là “full rollback đã chạy”. [Runbook](GATE-07-03B-ROLLBACK-RUNBOOK.md) quy định dừng server, dry-run/conflict checks, apply nếu được phép, build lại và smoke sau restore.

## 18. Failures / Rollbacks / Exceptions

1. Dev CSS chưa nhận token mới trong một lượt HMR làm text tạm rơi về Times New Roman; dừng đánh giá và restart dev server. Sau restart, computed đúng và ảnhbrand khớp. Không dùng ảnh trial làm PASS.
2. Home display dịch0,5 px khi đổi body UI: giới hạn Home content về legacy family. Không sửa Home source/layout. Navigation UI vẫn mới.
3. Di chuyển description wrap làm Hero +24 px: giữlegacy family mô tả tại lg trở lên. Mobile vẫn dùngUI mới và Hero không đổi.
4. Lưu trú Noto 28 px làm H1 từ 2→3 dòng/Hero +32 px: typography cục bộ desktop24 px đưa lại2 dòng. Không thay ảnh/height/crop/overlay.
5. First build EPERM đã nêu§15; retryPASS. Không cài package, sửa cache permissions hay mở rộng allowlist.

Không có full live rollback. Có partial font-rollout rollback nhằm giữ các vùng LOCK. Không cần sửa file ngoài allowlist cho trạng thái đang bàn giao. Muốn đổi các vùng legacy còn lại phải có phạm vi Owner mới, không tự sửa layout để hoàn thành rollout.

Ảnh production của tab cũ có lượt raster bị mờ/khối compositor; không dùng chúng làm bằng chứng glyph. Đã mở tab mới và lưu năm ảnh `production-fresh-*` đọc được. Bằng chứng pixel-identical21 lockup/57 text regions ở§9–10 là baseline dev so với final patch trên dev. Lượt fresh capture đã đạt13/13 computed/bounds/pixel bằng baseline; các lượt raster cũ không dùng để kết luận. Xem JSON riêng và Owner review ảnh production. Không sửa source để xử lý artifact chụp.

## 19. Remaining Risks

- Home content và mô tả Di chuyển desktop còn font legacy, do ưu tiên LOCK. Migration UI chưa100%.
- Actual font theo từng glyph, browserzoom, Windows scaling, CLS/LCP và iOS/Android thật chưa xác minh.
- Font TTF2,57MB chưa tối ưu; không giả định WOFF2/subset đạt Unicode trước đo lại.
- Native option/placeholder dài trên mobile và source ellipsisT06 vẫn là giới hạn cũ; không sửa để “dọn” phạm vi typography.
- Card có thể cao hơn do wrapping tự nhiên; full wrapper baseline cho8 accommodation chưa thu, không tuyên bố mọi card height giữ nguyên.
- Selector bảo vệ Home phụ thuộc root landing hiện tại; phải retest khi cấu trúc này thay đổi.
- Cảnh báo hydration còn theo log; không tự quy nguyên nhân chính xác cho extension hoặc patchfont.

## 20. Owner Decisions Required

Owner cần duyệt visual của typography đang bàn giao, đặc biệt Noto Serif H1 Lưu trú24 px desktop và mức tăng chiều cao một số card. Đề nghị chấp nhận giữlegacy ở hai vùng đã nêu để bảo toàn LOCK, hoặc cấp task/allowlist riêng nếu muốn tiếp tục rollout ở đó. Không coi báo cáo này là Owner nghiệm thu.

Kiểm tra local: [Trang chủ](http://192.168.1.12:3000/), [Lịch sử](http://192.168.1.12:3000/ve-hue), [Khám phá](http://192.168.1.12:3000/kham-pha), [Di chuyển](http://192.168.1.12:3000/cam-nang), [Lưu trú](http://192.168.1.12:3000/luu-tru). Đây là production build chạy local, không deploy; điện thoại cần cùng mạng và máy chủ còn chạy.

## 21. Acceptance Recommendation

**PARTIAL PASS — OWNER DECISION REQUIRED.** Phần UI/editorial đã áp dụng có coverage, technical checks và regression trong mẫu đạt; brand/Home display bảo toàn bằng computed+bounds+pixel. Giữ hai vùng legacy và các NOT VERIFIED đã nêu. Không tự đánh dấu toàn Gate hoàn tất/LOCK khi chưa có visual acceptance và quyết định của Owner về phần rollback.

Q1font integrity PASS corpus; Q2brand preservation PASS trong21 lockup/15 display lines; Q3visual PASS sampled25, CLS/zoom/device thật NOT VERIFIED; Q4functional PASS các ca ghi bằng chứng; Q5technical PASS. Không mở07-03C, KP02, card images/map/UI fidelity hoặc deploy.

**PASS = LOCK — FIX ONLY WHAT FAILED — NO SCOPE CREEP.**

**HARD STOP — AWAIT OWNER REVIEW.**

**STOP — AWAIT OWNER VISUAL ACCEPTANCE.**
