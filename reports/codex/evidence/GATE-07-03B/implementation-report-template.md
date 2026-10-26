# HUẾ TRAVEL PRO V2.3 — GATE 07-03B
## Vietnamese Typography System Implementation

- **Ngày:** 2026-10-25, Asia/Saigon.
- **Project:** `A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro`.
- **Task:** Be Vietnam Pro UI + Noto Serif editorial; controlled migration, regression, recovery.
- **Đề xuất nghiệm thu:** **PARTIAL PASS — OWNER DECISION REQUIRED / AWAIT OWNER VISUAL ACCEPTANCE**.
- Không tự LOCK Gate, không mở 07-03C, không deploy.

## 1. Executive Summary

Đã áp dụng Be Vietnam Pro cho navigation, UI/body, search/filter, buttons, card text, metadata và breadcrumb trong phạm vi triển khai; Noto Serif cho 13 vị trí editorial đang dùng `font-serif` trên bốn trang con.

**Hai phần UI được giữ font legacy sau phát hiện reflow:** nội dung landing Trang chủ (navigation vẫn dùng font mới) và mô tả Hero Di chuyển trên desktop. Đổi toàn bộ body đã làm ba dòng display Home dịch0,5px; đổi mô tả Di chuyển làm Hero cao thêm24px. Đã giới hạn rollout thay vì sửa layout LOCK. Vì vậy không gọi migration toàn bộ UI là hoàn tất.

H1 Lưu trú Noto Serif28px xuống thêm một dòng trên desktop. Theo ngoại lệ typography H1 Owner cấp, đã giảm riêng desktop xuống24px, giữ câu chữ và line-height32px: trở lại hai dòng/64px như baseline. Mobile vẫn20px, chiều cao110px như baseline. Không sửa size/crop/gradient/ảnh Hero.

Kết quả chính: đủ25 tổ hợp trước/sau;0 document overflow;25 H1 có cùng chiều cao trước/sau;21 logo lockup và57 vùng chữ LOCK có bounds/computed/pixel giữ nguyên. Typecheck, lint, production build PASS. Navigation/filter/T05/A01 đã thử thực tế. Actual per-glyph font attribution, CLS và real browser zoom chưa xác minh.

## 2. Owner Authorization

Owner phê duyệt qua yêu cầu đính kèm “GATE07-03B — VIETNAMESE TYPOGRAPHY SYSTEM IMPLEMENTATION / BE VIETNAM PRO + NOTO SERIF”. Quyền này mở đúng file/kiểu thay đổi typography được nêu; không mở Home source, Shell, globals, logo visual, data, API, database hay các phase khác.

Đã đọc AGENTS.md, Logo Design LOCK, báo cáo07-03A và preview, typography audit07-01, T05/T07,07-02A,07-02B,07-02C-00 và07-02C-02A. Đối chiếu source hiện tại trước sửa, không áp patch theo line number cũ. Không sửa AGENTS/LOCK để tự cấp quyền.

## 3. Preflight Baseline

Không có Git repository (`git rev-parse` báo not a git repository). Không git init/reset/checkout/commit/push. Không có cơ sở xác định “uncommitted changes”; checkpoint giữ đúng bytes trên đĩa tại đầu task. Không quan sát được buffer chưa lưu của editor, không tuyên bố chúng không tồn tại.

Trước implementation đã lập [preflight](evidence/GATE-07-03B/preflight.md), [baseline59file](evidence/GATE-07-03B/baseline.csv), danh sách7file dự kiến sửa và8file mới, rồi copy7file vào `checkpoint-before/`. Mỗi backup được copy lại sang `restore-rehearsal/` và so SHA-256 với nguồn:7/7 byte-identical. Chưa sửa source khi tạo/xác minh checkpoint.

## 4. Font Source & License

Sử dụng đúng file đã thử tại07-03A, kiểm tra hash trước copy: [font-input-verification.json](evidence/GATE-07-03B/font-input-verification.json). Nguồn gốc: repository chính thức [Be Vietnam Pro](https://github.com/google/fonts/tree/main/ofl/bevietnampro) và [Noto Serif](https://github.com/google/fonts/tree/main/ofl/notoserif). Không chọn Noto Sans, không tải font Internet mới trong Gate này.

Hai bản OFL/copyright được copy nguyên byte vào production. [Be Vietnam Pro OFL](https://github.com/google/fonts/blob/main/ofl/bevietnampro/OFL.txt), [Noto Serif OFL](https://github.com/google/fonts/blob/main/ofl/notoserif/OFL.txt): SIL Open Font License1.1, self-host/embed theo điều kiện giấy phép. Không copy font Windows, không cài font OS/package.

Không tìm thấy `woff2_compress` trong PATH; Python runtime không có fontTools. Giữ TTF hợp lệ đã thử theo quyền Owner, không chuyển đổi hoặc subset không được kiểm chứng. Sáu font tổng **2,570,400bytes**, chưa tính OFL. Không coi đây là ngân sách đã tối ưu; không đo cold mobile load/CLS/LCP. `font-display:swap`, `preload:false` cho hai family mới để không preload cả bộ weight vào Home. Geist cũ vẫn giữ nguyên.

## 5. Font Files Added

| File mới | Bytes | SHA-256 |
|---|---:|---|
{{FONTS}}

Be Vietnam Pro: normal400/500/600/700, italic400 dùng cho metadata italic hiện có. Noto Serif: một variable font100–900; editorial hiện có weight700 và H1 ba trang dùng800 nên giữ axis, không thêm nhiều file static. Không copy Noto Serif italic vì các vùng editorial được triển khai không cần italic. Không xóa font cũ.

Next build sinh7media font khớp nguyên byte6font mới + Geist: [compiled-font-media.json](evidence/GATE-07-03B/compiled-font-media.json). Các font URL là `/_next/static/media/...`, không Google Fonts CDN runtime. [Compiled font-face rules](evidence/GATE-07-03B/compiled-font-face-rules.txt).

## 6. Exact Changed Files

**7 file hiện có sửa,8 file font/license mới =15 file production tác động.** Báo cáo/runbook/checkpoint/evidence tách khỏi số này.

| File | Phạm vi thay đổi cuối |
|---|---|
| `src/app/layout.tsx` | Thêm hai localFont, giữ nguyên Geist, gắn variables/UI body; selector font legacy cho root landing để giữ vị trí display |
| `tailwind.config.ts` | Thêm ui/editorial/brand; font-sans compatibility alias chuyển UI; giữ serif cũ cho các vùng ngoài bốn page chính |
| `src/components/navigation/AdaptiveNavigation.tsx` | Chỉ6declaration class:3font-ui ở navigation wrappers,3font-brand ở wordmark wrappers. Không đổi DOM/logo/href/handlers/transforms/icons/labels |
| `src/app/ve-hue/page.tsx` | 2font-serif→font-editorial |
| `src/app/kham-pha/page.tsx` | 3font-serif→font-editorial |
| `src/app/cam-nang/page.tsx` | 4font-serif→font-editorial; thêm lg:font-brand riêng mô tả Hero |
| `src/app/luu-tru/page.tsx` | 4font-serif→font-editorial; riêng H1desktop28→24px |

[Exact changed-files](evidence/GATE-07-03B/changed-files.json). Diff từng file trong `evidence/GATE-07-03B/diffs/`, theo đúng đường dẫn nguồn +`.diff`. Source ngoài allowlist: **0 thay đổi trong baseline**. Không sửa `src/app/page.tsx`, Shell, globals, data/lib/types/Prisma/API/package/AGENTS/LOCK/ảnh.

## 7. Typography Tokens

| Token | Vai trò / chain |
|---|---|
| `--font-ui`, `font-ui`, compatibility `font-sans` | Local Be Vietnam Pro + Next adjusted fallback → Segoe UI → Arial → sans-serif |
| `--font-editorial`, `font-editorial` | Local Noto Serif + adjusted fallback → Georgia → serif; chỉ13vị trí trên bốn main pages |
| Geist `--font-sans`, `font-brand` | Exact legacy Geist + Next adjusted Arial → Segoe UI → Roboto → Arial → sans-serif |

Không đổi Geist localFont arguments nên family/fallback identity cũ giữ nguyên. `font-serif` cũ không được tự đổi toàn website: các detail page/role ngoài scope không tự nhận Noto Serif.

Selector layout `[&_main>div[style*='hero']]:font-brand` hiện chỉ khớp root landing có inline background Hero; bốn root subpage không có style đó. Nó chỉ đặt family, không đổi layout/DOM. Đây là giới hạn rollout Home UI, không phải sửa display. Nếu sau này thay cấu trúc root landing, phải kiểm tra lại dependency này.

## 8. Vietnamese Unicode Coverage Results

Corpus07-03A:29chữ cái hoa/thường;12nguyên âm ×6thanh ×2kiểu chữ; NFC178codepoint duy nhất, NFD54. Parser đọc Unicode cmap4/12, glyph ID khác0; không dùng `document.fonts.check()` làm chứng chỉ coverage.

| Kiểm tra | Kết quả / phạm vi |
|---|---|
| CMAP sáu font production sau copy | **PASS — 0 missing NFC,0 missing NFD**, SHA khớp preview; GPOS/GSUB có trong file |
| Runtime loading | **PASS trong mẫu**:25snapshot font status loaded; computed UI/editorial đúng family; specimen FaceSet6face loaded; build media khớp file |
| Glyph clipping/tofu | **PASS theo quan sát các ảnh đã xem**, không thấy dấu bị cắt/tofu mới trong H1, controls và corpus |
| Actual per-glyph fallback | **NOT VERIFIED** — browser connector không trả rendered-font attribution; không suy ra từ computed family hoặc check=true |
| Vietnamese shaping | **VERIFIED ở mức visual corpus đã xem**: NFC/NFD hiện đủ dấu tại weights thử; không chứng nhận mọi chuỗi Unicode, shaping engine hoặc mọiOS |
| Home/brand coverage legacy | Giữ theo LOCK, không tự chữa thiếu coverage của Geist trong vùng này |

[Production coverage](evidence/GATE-07-03B/production-font-coverage.json), [specimen loading](evidence/GATE-07-03B/font-proof-loading.json), [full corpus screenshot](evidence/GATE-07-03B/font-proof-desktop.png). Specimen độc lập dùng đúng bytes production,10mẫu: UI400/500/600/700 +italic400; editorial400/500/600/700/800. Đã xem cả4phần screenshot, không dùng ảnh chữ thay HTML production. Server specimen đã dừng sau kiểm tra; HTML/fonts lưu tại `evidence/GATE-07-03B/font-proof/` để tái lập.

## 9. Brand / Wordmark Isolation Proof

Đã so **21 logo lockup đang hiện** ở matrix: bounds và pixel nguyên vẹn; không chỉ hashJSX. Đã so **42dòng wordmark** riêng: computed family/size/weight/line-height/letter-spacing/style/color/bounds và pixel bằng nhau.

Family vẫn `__geistSans_1e4310, __geistSans_Fallback_1e4310, "Segoe UI", Roboto, Arial, sans-serif`. Font asset/fallback CSS gốc không đổi. Không có API đặt tên face từng glyph, nhưng ảnh render lockup thực tế byte-pixel-identical tại cùng viewport/bounds là bằng chứng không đổi diện mạo; không tuyên bố đã biết tên font cho mỗi dấu.

- [Lockup comparison21](evidence/GATE-07-03B/brand-lockup-comparison.json).
- [Computed/pixel comparison57text regions](evidence/GATE-07-03B/brand-home-comparison.json).
- Home desktop: [Before](evidence/GATE-07-03B/logo-lockup-before-home-1366.png) / [After](evidence/GATE-07-03B/logo-lockup-after-home-1366.png).
- Sidebar: [Before](evidence/GATE-07-03B/logo-lockup-before-ve-hue-1366.png) / [After](evidence/GATE-07-03B/logo-lockup-after-ve-hue-1366.png).
- Mobile Home: [Before](evidence/GATE-07-03B/logo-lockup-before-home-390.png) / [After](evidence/GATE-07-03B/logo-lockup-after-home-390.png).

Logo PNG SHA vẫn `6E53DD205EDE658EBCAEBAED45632A1E5613C8D01E141B22172F597EB6112B9D`. [Navigation diff, chỉ declarations font](evidence/GATE-07-03B/diffs/src/components/navigation/AdaptiveNavigation.tsx.diff). Không thay cấu trúc/logo/weight/tracking/gap/color.

## 10. Home Typography Non-regression

Ba dòng HUẾ / TRAVEL PRO / Huế có chi hay? có computed styles, bounds và screenshot pixel giữ nguyên ở cả5viewport: **15/15 text regions equal**. Không sửa Home source hoặc inline fonts Palatino/Times. Các ảnh crop so sánh được cắt từ screenshot gốc tại cùng tọa độ, không recolor, warp hoặc chỉnh để khớp.

Lượt thử áp UI body toàn Home làm y tăng0,5px tại1366. Đã giữ legacy family cho nội dung landing để loại reflow; [trial](evidence/GATE-07-03B/stage-c-restart-home-1366.json) so với [final](evidence/GATE-07-03B/after-home-1366.json). Navigation vẫn Be Vietnam Pro. Không tự can thiệp layout Home để “bù” vị trí.

## 11. Four Subpage Headings Before / After

| H1 | Trước | Sau | Chiều cao / ngoại lệ |
|---|---|---|---|
| Lịch sử Huế | Segoe UI/Georgia | Noto Serif | Desktop48px, mobile24px; height không đổi |
| Khám phá Huế | Segoe UI/Georgia | Noto Serif | Cùng size/weight/leading/tracking trước; height không đổi |
| Di chuyển ở Huế | Segoe UI/Georgia | Noto Serif | Cùng typography size; mô tả desktop giữlegacy để Hero không cao thêm |
| Câu H1 Lưu trú đã duyệt | Segoe UI/Georgia | Noto Serif | Desktop28→24px, line32px,2dòng/64px; mobile20px,4dòng/110px như trước |

Câu Lưu trú giữ nguyên và chỉ xuất hiện một lần: “Những homestay xinh xắn, khách sạn tiện nghi và không gian lưu trú đầy cảm hứng cho hành trình của bạn.” Không đưa lại tiêu đề cũ.

[Computed H1](evidence/GATE-07-03B/h1-computed-before-after.json). Ảnh before/after các H1 tại [1366](evidence/GATE-07-03B/headings-before-after-1366.png), [1440](evidence/GATE-07-03B/headings-before-after-1440.png), [1650](evidence/GATE-07-03B/headings-before-after-1650.png), [1920](evidence/GATE-07-03B/headings-before-after-1920.png), [390](evidence/GATE-07-03B/headings-before-after-390.png). Ảnh montage để đọc nhanh; screenshot gốc và rawJSON ở matrix. Không lấy bounding box giao nhau làm bằng chứng ink collision.

## 12. Twenty-five Viewport Test Matrix

Browser in-app trên Windows. Mobile390×844 là viewport mô phỏng, không phải điện thoại vật lý. Giá trị overflow là scrollWidth−clientWidth;0 không có nghĩa mọi state UI đều được kiểm.

| Route | Viewport | Font status sau | Overflow trước→sau | H1height delta(px) | Evidence |
|---|---|---|---:|---:|---|
{{MATRIX}}

Đã xem ảnh H1 trước/sau ở đủ5viewport, full screenshots mẫu, filter dài, footer và focus. Chưa thấy clipping dấu, collision, heading che nav, CTA mất hoặc grid vỡ mới trong trạng thái kiểm. Assets/crop/gradient/hero wrapper source nguyên byte. H1 và mốc filter/topic đầu sau Hero giữ y/height baseline sau các giới hạn rollout.

**Card metrics:**5suggestion cards A01 vẫn89px ở cả5viewport. Sáu rental footer ×5: nhãn Chi tiết24,5px/Vị trí16,5px, nowrap; nguồn không horizontal overflow; links nằm trong footer. Card có thể cao thêm do text wrap của Be Vietnam Pro, không bị ép height. [Direct after measurements](evidence/GATE-07-03B/t05-footer-measurements.json); [card comparison](evidence/GATE-07-03B/rental-card-height-comparison.csv).

Card comparison ghi rõ before-height **suy từ DOM anchor positions và padding/border/gap bất biến**, after là wrapper rect đo trực tiếp; không giả làm đã thu before-wrapper rect. Delta tối đa31px ở các mẫu ổn định; tại1366 một số card+15px,1440 không đổi;1650/1920 một số+31px;mobile một số+15/+31px. Không sửa card layout. Source footer/A01/T07 được xác minh không thay cấu trúc/handlers. Chưa có đo wrapper trước/sau đầy đủ cho cả8accommodation cards; không chứng nhận mọi chiều cao card bất biến.

CLS/layout shift trong quá trình font-swap **NOT VERIFIED**: connector không cung cấp số đo CLS. Bounds ổn định cuối tải không thay thế CLS. [MatrixJSON](evidence/GATE-07-03B/final-25-case-matrix.json).

## 13. Browser Zoom Findings

**BROWSER ZOOM125/150 — NOT VERIFIED.**100% thực cũng chưa có chỉ báo đủ xác minh. Không đổi viewport/text multiplier/CSSscale để giả làm zoom. Matrix chỉ ghi CSSviewport. Không kết luận đã sửa hiện tượng dấu dính trên đúng browser/zoom laptop Owner.

Checklist Owner: mở Chrome/Edge tại `/`, `/ve-hue`, `/kham-pha`, `/cam-nang`, `/luu-tru`; Ctrl+0 và xem menu browser xác nhận100%; đặt125% rồi150%; quan sát dấu hỏi/ngã/nặng, H1 dài Lưu trú, nav, option giá, footer thuêxe và focus A01. Nếu có lỗi, ghi browser/version, Windows scaling, viewport/content width, zoom thực và screenshot. Không chỉnh logo/Hero để xử lý ngoài phạm vi.

## 14. Navigation / Filter / Rental / A01 Regression

| Nhóm | Kết quả có bằng chứng |
|---|---|
| Desktop navigation | **PASS sampled:** Home→cả4trang; các lượt History/Discovery/Rental→Home có state sidebar/capsule đúng; [JSON](evidence/GATE-07-03B/navigation-functional.json) |
| Mobile | **PASS:** mở drawer→Lịch sử; bottomnav→Khámphá→Dichuyển→Lưutrú→Home; [JSON](evidence/GATE-07-03B/mobile-navigation-functional.json), [drawer](evidence/GATE-07-03B/mobile-drawer.png) |
| T05 links | **PASS6/6details:** click và H1/URL đúng; **PASS6/6Maps mở đúng query tab**; không chứng nhận địa lý của Maps. [Details](evidence/GATE-07-03B/rental-details-functional.json), [Map tabs](evidence/GATE-07-03B/rental-map-tabs.json) |
| T05 layout | **PASS30footer samples:** nowrap/không source overflow; [desktop screenshot](evidence/GATE-07-03B/t05-footer-desktop.png), full settled cards `t05-settled-all-cards-<width>.png` |
| T07 labels | **PASS laptop samples:** chọn4option dài, đọc đủ trên [1366](evidence/GATE-07-03B/t07-long-options-1366.png), [1440](evidence/GATE-07-03B/t07-long-options-1440.png), [1650](evidence/GATE-07-03B/t07-long-options-1650.png), [1920](evidence/GATE-07-03B/t07-long-options-1920.png). Native select mobile không đảm bảo hiện trọn mọi nhãn dài |
| Filters/query | **PASS sampled:** resort+ĐạiNội+coffee+luxury cập nhật đủ query và0kết quả đúng giao điều kiện; reset8. q=MườngThanh/q=muongthanh đều1; budget giữ sau reload; reset8. [FilterJSON](evidence/GATE-07-03B/t07-filter-functional.json), [search/query/reset](evidence/GATE-07-03B/search-query-reset.json) |
| A01 | **PASS:** Tab đủ5card, Shift+Tab ngược;50Enter/Space activations+50reset, kết quả3/3/2/6/1 đúng task trước; [activation](evidence/GATE-07-03B/a01-activation-reset.json), [keyboard](evidence/GATE-07-03B/a01-keyboard-focus.json) |
| Focus | **PASS ổn định:**25card focus-visible,89px, không bị bottomnav che; [settledJSON](evidence/GATE-07-03B/a01-focus-settled.json), [mobile](evidence/GATE-07-03B/a01-focus-settled-390.png) |
| Breadcrumb | UI family mới, không sửa route/text; [computed](evidence/GATE-07-03B/breadcrumb-computed.json), [ảnh](evidence/GATE-07-03B/breadcrumb-after.png) |
| Content | 6Places/6Rentals/8Accommodations giữ datahash; không thêm giá/rating/ảnh hoặc database |

Một lượt loop click nav quá nhanh đã bị existing transition guard bỏ qua; đã test lại từng lượt sau ổn định, không sửa handlers. Đó không phải bằng chứng mọi thao tác trong transition đều PASS. Focus/card measurements ngay sau resize có số đo giữa transition; các file provisional giữ làm lịch sử nhưng dùng bản reload/settled để kết luận geometry.

## 15. Typecheck / Lint / Build

- `pnpm exec tsc --noEmit --incremental false`: **PASS**, exit0.
- `pnpm lint`: **PASS**, exit0, No ESLint warnings or errors.
- `pnpm build`: **PASS**, exit0, compiled/type validation và30static pages hoàn tất. Lần đầu FAIL vì EPERM tạo cache `.next/types/app/tim-kiem`; chạy lại cùng lệnh bằng quyền host hiện có thành công. Không sửa permission/source để che lỗi.
- Production build local `pnpm start --hostname 0.0.0.0`: đã smoke5route, font status loaded và ảnh lưu riêng `build-smoke-*`. Không lấy dev/HTTP200 làm chứng chỉ build.

[QualityJSON](evidence/GATE-07-03B/quality-gates.json), [typecheck](evidence/GATE-07-03B/typecheck.log), [lint](evidence/GATE-07-03B/lint.log), [build](evidence/GATE-07-03B/build.log), [first build failure](evidence/GATE-07-03B/build-first-attempt.log), [build smoke](evidence/GATE-07-03B/build-smoke.json).

Console còn React warning `Extra attributes ... __processed_*` đã có trong báo cáo gate trước; [console hiện tại](evidence/GATE-07-03B/runtime-console.json). Không tuyên bố console sạch hoặc đã sửa warning này. Dev cũng nhắc future allowedDevOrigins choLAN; không đổi config/bảo mật ngoài scope.

## 16. SHA-256 and Source Diff

**59baseline:7changed đúng allowlist,52unchanged;8file mới đã đăng ký.** [Integrity](evidence/GATE-07-03B/integrity-final.csv), [protected regions](evidence/GATE-07-03B/protected-region-verification.json). Bốn page khôi phục chính xác bytes baseline khi đảo đúng các declaration font được task thêm/thay; navigation tương tự khi bỏ6font class. Đây là kiểm chứng source của handlers/grid/markup/data mapping/href/query/crop, không thay thế test tương tác.

| File | SHA trước | SHA sau |
|---|---|---|
{{HASHES}}

Không sửa source ngoài allowlist; assets cũ/data/AGENTS/LOCK/Shell/Home/globals nguyên byte trong tập kiểm. Cache `.next` phát sinh do dev/build, không phải source diff. Không thao tác database. Không tự nhận đây là snapshot toàn ổđĩa.

## 17. Rollback Manifest & Recovery Rehearsal

[Rollback manifest](evidence/GATE-07-03B/rollback-manifest.csv) có existed/new, hashbefore/after, backup path, vùngLOCK và restore status. Checkpointbefore/after giữ đúng7source files. Before-backup→sandboxrestore7/7 đã thử và hashkhớp, không rollback live chỉ để diễn tập.

Script [rollback.py](evidence/GATE-07-03B/rollback.py) mặc định dry-run: **PASS7existing/8new, NO WRITES**. Chỉ khi `--apply` mới restore, và từ chối nếu currentafterhash/backup khác. Chỉ xóa đúng8file mới đã đăng ký sau restore và kiểm tra source dependency; không recursive delete, không xóa file cũ hoặc thay đổi Owner độc lập.

**Recovery rehearsal VERIFIED; actual full rollback NOT PERFORMED.** Không gọi việc có backup là “full rollback đã chạy”. [Runbook](GATE-07-03B-ROLLBACK-RUNBOOK.md) quy định dừng server, dry-run/conflict checks, apply nếu được phép, build lại và smoke saurestore.

## 18. Failures / Rollbacks / Exceptions

1. Dev CSS chưa nhận token mới trong một lượt HMR làm text tạm rơi về Times New Roman; dừng đánh giá và restart dev server. Sau restart, computed đúng và ảnhbrand khớp. Không dùng ảnh trial làm PASS.
2. Home display dịch0,5px khi đổi body UI: giới hạn Home content về legacyfamily. Không sửa Home source/layout. Navigation UI vẫn mới.
3. Di chuyển description wrap làm Hero+24px: giữlegacyfamily mô tả tại lg trở lên. Mobile vẫn dùngUI mới và Hero không đổi.
4. Lưu trú Noto28px làm H1từ2→3dòng/Hero+32px: typography cục bộ desktop24px đưa lại2dòng. Không thay ảnh/height/crop/overlay.
5. First build EPERM đã nêu§15; retryPASS. Không cài package, sửa cache permissions hay mở rộng allowlist.

Không có full live rollback. Có partial font-rollout rollback nhằm giữ các vùng LOCK. Không cần sửa file ngoài allowlist cho trạng thái đang bàn giao. Muốn đổi các vùng legacy còn lại phải có phạm vi Owner mới, không tự sửa layout để hoàn thành rollout.

## 19. Remaining Risks

- Home content và mô tả Di chuyển desktop còn fontlegacy, do ưu tiên LOCK. Migration UI chưa100%.
- Actual font theo từng glyph, browserzoom, Windows scaling, CLS/LCP và iOS/Android thật chưa xác minh.
- Font TTF2,57MB chưa tối ưu; không giả định WOFF2/subset đạt Unicode trước đo lại.
- Native option/placeholder dài trên mobile và source ellipsisT06 vẫn là giới hạn cũ; không sửa để “dọn” phạm vi typography.
- Card có thể cao hơn do wrapping tự nhiên; full wrapper baseline cho8accommodation chưathu, không tuyên bố mọi card height giữ nguyên.
- Selector bảo vệ Home phụ thuộc root landing hiện tại; phải retest khi cấu trúc này thay đổi.
- Cảnh báo hydration còn theo log; không tự quy nguyên nhân chính xác cho extension hoặc patchfont.

## 20. Owner Decisions Required

Owner cần duyệt visual của typography đang bàn giao, đặc biệt NotoSerif H1Lưutrú24px desktop và mức tăng chiều cao một số card. Đề nghị chấp nhận giữlegacy ở hai vùng đã nêu để bảo toàn LOCK, hoặc cấp task/allowlist riêng nếu muốn tiếp tục rollout ở đó. Không coi báo cáo này là Owner nghiệm thu.

Kiểm tra local: [Trang chủ](http://192.168.1.12:3000/), [Lịch sử](http://192.168.1.12:3000/ve-hue), [Khám phá](http://192.168.1.12:3000/kham-pha), [Di chuyển](http://192.168.1.12:3000/cam-nang), [Lưu trú](http://192.168.1.12:3000/luu-tru). Đây là production build chạy local, không deploy; điện thoại cần cùng mạng và máy chủ còn chạy.

## 21. Acceptance Recommendation

**PARTIAL PASS — OWNER DECISION REQUIRED.** Phần UI/editorial đã áp dụng có coverage, technical checks và regression trong mẫu đạt; brand/Home display bảo toàn bằng computed+bounds+pixel. Giữ hai vùng legacy và các NOT VERIFIED đã nêu. Không tự đánh dấu toàn Gate hoàn tất/LOCK khi chưa có visual acceptance và quyết định của Owner về phần rollback.

Q1font integrity PASS corpus; Q2brand preservation PASS trong21lockup/15displaylines; Q3visual PASS sampled25, CLS/zoom/device thật NOT VERIFIED; Q4functional PASS các ca ghi bằng chứng; Q5technical PASS. Không mở07-03C, KP02, card images/map/UI fidelity hoặc deploy.

**PASS = LOCK — FIX ONLY WHAT FAILED — NO SCOPE CREEP.**

**HARD STOP — AWAIT OWNER REVIEW.**

**STOP — AWAIT OWNER VISUAL ACCEPTANCE.**
