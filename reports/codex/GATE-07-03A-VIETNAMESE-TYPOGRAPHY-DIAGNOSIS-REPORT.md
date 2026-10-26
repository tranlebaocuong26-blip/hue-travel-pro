# HUẾ TRAVEL PRO V2.3 — GATE 07-03A
## Vietnamese Typography Diagnosis & Isolated Preview

- **Ngày:** 2026-10-25, Asia/Saigon.
- **Task ID:** GATE-07-03A — VIETNAMESE TYPOGRAPHY RESTORATION.
- **Project:** `A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro`.
- **Quyền Owner cấp:** đọc source và hồ sơ LOCK, kiểm thử runtime; tạo preview riêng, báo cáo và evidence. Production source READ-ONLY. Không mở GATE 07-03B.
- **Trạng thái đề xuất:** chẩn đoán và preview đã bàn giao; **AWAIT OWNER FONT APPROVAL**. Không phải nghiệm thu production hay xác nhận Owner đã chọn font.

## 1. Executive Summary

Hai nguyên nhân được xác minh độc lập:

1. **VERIFIED — font file Geist hiện tại thiếu một phần codepoint tiếng Việt.** Trong corpus 29 chữ cái hoa/thường và 12 nguyên âm × 6 thanh × 2 kiểu chữ, cmap của file không có 88/178 codepoint NFC và 3/54 codepoint NFD. Đây là thiếu coverage của file, không đồng nghĩa website mất 88 ký tự. Fallback hoặc shaping có thể vẫn hiển thị đúng.
2. **VERIFIED — cấu hình `font-serif` ưu tiên Segoe UI, một font sans, trước Georgia.** Computed family và ảnh tiêu đề trang con xác nhận kiểu sans đang xuất hiện; tên class không đảm bảo hình dáng serif. Home dùng một chuỗi Palatino/Times khác, nên không quy tất cả vấn đề về Geist.

**LIKELY:** các đoạn UI dùng chữ Latin của Geist và chữ Việt từ fallback có thể không đồng đều về tỷ lệ/độ đậm. **NOT VERIFIED:** font chính xác theo từng glyph; nguyên nhân trực tiếp của mọi nhận xét “dấu dính”; mất dấu/tofu có thể tái hiện trên máy Owner; lỗi ở browser zoom 125/150%. Không có API rendered-fonts hoặc chỉ báo zoom thực trong công cụ hiện có.

Đã đo 25 tổ hợp 5 routes × 5 viewports và lưu ảnh/DOM computed styles. Font status đều `loaded`; document không tràn ngang trong các snapshot. Điều này không chứng minh tất cả glyph, tương tác hoặc trạng thái cuộn đều PASS.

Preview so sánh A hiện tại, B Be Vietnam Pro + Noto Serif, C Noto Sans + Noto Serif đã tải font local thành công. Ba family ứng viên có đủ cmap của corpus NFC/NFD; trên ảnh thử chưa thấy tofu hoặc dấu bị cắt. Chưa kiểm thử trên iOS/Android thật và chưa xác minh font theo từng glyph. **Không thay font production.**

Đã đọc `AGENTS.md`, hồ sơ Logo Design LOCK, báo cáo typography GATE 07-01, audit GATE 07-02C-00, báo cáo GATE 07-02A/07-02B và source typography liên quan. Các kết luận cũ được đối chiếu trạng thái hiện tại; không coi lỗi đã sửa của T05/T07/A01 là lỗi hiện hành. Công việc gồm phân tích source, kiểm tra cmap/font metadata, đo browser, xem screenshot và xây preview độc lập.

## 2. Font Inventory

### Source và chuỗi computed

| Phạm vi | Khai báo / nguồn | Computed family và loading |
|---|---|---|
| UI/body, nav, controls, phần lớn card | `src/app/layout.tsx:7–11,25`; `tailwind.config.ts:27–29`; local `src/app/fonts/GeistVF.woff` | `__geistSans_1e4310, __geistSans_Fallback_1e4310, "Segoe UI", Roboto, Arial, sans-serif` |
| Heading dùng `font-serif` | `tailwind.config.ts:29`; bốn page component | `"Segoe UI", Georgia, serif` |
| Home HUẾ / TRAVEL PRO / tagline | `src/app/page.tsx:34–49`, inline family | `"Palatino Linotype", "Times New Roman", serif` |
| Logo wordmark | `src/components/navigation/AdaptiveNavigation.tsx:185–188,266–269,312–315` | Kế thừa UI/Geist; **LOCKED**, không đề xuất thay ngầm |
| Geist Mono | `src/app/fonts/GeistMonoVF.woff` | Có file; không phải font chính của các mẫu UI đã đo |

File font runtime từ compiled CSS: `/_next/static/media/4473ecc91f70f139-s.p.woff`; 66,268 bytes, weight 100–900, `font-display:swap`. SHA-256 giống file gốc và bản copy vào preview. Fallback do Next tạo là local Arial với `size-adjust:107.19%`, ascent85.83%, descent20.52%, line-gap9.33%. Bản ghi CSS: [production-font-face-rules.txt](evidence/GATE-07-03A/production-font-face-rules.txt). Các font hệ điều hành không có URL tải trong ứng dụng.

Trong 25 snapshot, `document.fonts.status=loaded`. Trạng thái này chỉ cho biết font loading hoàn tất, không cho biết font nào vẽ từng ký tự. Computed family là chuỗi lựa chọn, **không phải rendered-font report**.

### Computed số đo tiêu biểu

Các cột size / weight / line-height / letter-spacing là giá trị browser trả về, không suy từ class. `display` và `editorial` là hai chuỗi tương ứng trong bảng trên. Bảng lấy 1366 và 390; dữ liệu đủ cả năm viewport nằm trong CSV.

| Route | Rộng viewport | Text | Size | Weight | Line-height | Letter-spacing | Family |
|---|---:|---|---|---|---|---|---|
| `/` | 1366 | HUẾ | 96px | 400 | 96px | -2.4px | display |
| `/` | 1366 | Huế có chi hay? | 36px | 400 | 48.6px | normal | display |
| `/ve-hue` | 1366 | Lịch sử Huế | 48px | 800 | 48px | -1.2px | editorial |
| `/kham-pha` | 1366 | Khám phá Huế | 48px | 800 | 48px | -1.2px | editorial |
| `/cam-nang` | 1366 | Di chuyển ở Huế | 48px | 800 | 48px | -1.2px | editorial |
| `/luu-tru` | 1366 | Những homestay xinh xắn, khách | 28px | 700 | 32px | normal | editorial |
| `/` | 390 | HUẾ | 72px | 400 | 72px | -1.8px | display |
| `/` | 390 | Huế có chi hay? | 30px | 400 | 40.5px | normal | display |
| `/ve-hue` | 390 | Lịch sử Huế | 24px | 800 | 30px | -0.6px | editorial |
| `/kham-pha` | 390 | Khám phá Huế | 24px | 800 | 30px | -0.6px | editorial |
| `/cam-nang` | 390 | Di chuyển ở Huế | 24px | 800 | 30px | -0.6px | editorial |
| `/luu-tru` | 390 | Những homestay xinh xắn, khách | 20px | 700 | 27.5px | normal | editorial |

UI thường: nav desktop/sidebar 14px, control input14px/20px/400, select12px/500 với line-height `normal`; heading card thường16px/24px/700; badge/metadata10–12px. Không phải mọi heading/card dùng cùng family. File inventory có **2,474 bản ghi** gồm family, size, weight, line, spacing, overflow, kích thước và text theo từng route/viewport: [computed-font-inventory.csv](evidence/GATE-07-03A/computed-font-inventory.csv), [runtime-inventory.json](evidence/GATE-07-03A/runtime-inventory.json).

Đo bổ sung text chính xác vì TRAVEL PRO là `div`, không phải H2: desktop1366 **48px /400 /50.4px /0.72px**, mobile390 **40px /400 /42px /0.6px**, family display Palatino/Times. Tagline có `font-style:italic`. Wordmark HUẾ desktop18px/700/22.5px/0.9px, mobile16px/700/20px/0.8px, family UI. Có các bản sao brand ẩn theo breakpoint trong DOM; chỉ đo phần tử không đủ chứng minh nó đang hiện. [Desktop computed](evidence/GATE-07-03A/home-exact-text-computed-desktop.json), [Mobile computed](evidence/GATE-07-03A/home-exact-text-computed.json).

## 3. Vietnamese Unicode Coverage

Corpus tái lập: [vietnamese-corpus.json](evidence/GATE-07-03A/vietnamese-corpus.json). Bao gồm:

- 29 chữ cái `A Ă Â B C D Đ E Ê G H I K L M N O Ô Ơ P Q R S T U Ư V X Y` và chữ thường.
- 12 nguyên âm `a ă â e ê i o ô ơ u ư y`, sáu thanh ngang/sắc/huyền/hỏi/ngã/nặng, cả hoa và thường: 144 cụm; mỗi cụm có NFC và NFD.
- 178 codepoint duy nhất ở NFC, 54 ở NFD, không tính khoảng trắng. Đây là corpus tiếng Việt đã nêu, không phải chứng nhận mọi ký tự Unicode.

Phương pháp: parser stdlib đọc WOFF/SFNT, Unicode cmap format4/12 và glyph ID khác0; ghi tên font, axis và có/không GPOS/GSUB. Không cài package. [Script](evidence/GATE-07-03A/font_coverage.py), [JSON đầy đủ ký tự thiếu](evidence/GATE-07-03A/font-coverage.json), [CSV](evidence/GATE-07-03A/font-coverage-summary.csv).

| File đã kiểm tra | Bytes | Thiếu NFC | Thiếu NFD |
|---|---:|---:|---:|
| BeVietnamPro-Bold.ttf | 140300 | 0/178 | 0/54 |
| BeVietnamPro-Italic.ttf | 137244 | 0/178 | 0/54 |
| BeVietnamPro-Medium.ttf | 135980 | 0/178 | 0/54 |
| BeVietnamPro-Regular.ttf | 132948 | 0/178 | 0/54 |
| BeVietnamPro-SemiBold.ttf | 136736 | 0/178 | 0/54 |
| GeistVF.woff | 66268 | 88/178 | 3/54 |
| NotoSans-Italic-VF.ttf | 2322640 | 0/178 | 0/54 |
| NotoSans-VF.ttf | 2049096 | 0/178 | 0/54 |
| NotoSerif-Italic-VF.ttf | 2448496 | 0/178 | 0/54 |
| NotoSerif-VF.ttf | 1887192 | 0/178 | 0/54 |
| GeistMonoVF.woff | 67864 | 88/178 | 3/54 |
| segoeui.ttf | 960076 | 0/178 | 0/54 |
| segoeuib.ttf | 947364 | 0/178 | 0/54 |
| arial.ttf | 1045720 | 0/178 | 0/54 |
| georgia.ttf | 219712 | 92/178 | 4/54 |
| pala.ttf | 472284 | 0/178 | 3/54 |
| times.ttf | 1190736 | 0/178 | 0/54 |

Geist thiếu trực tiếp các mark NFD `U+0309` COMBINING HOOK ABOVE, `U+031B` COMBINING HORN, `U+0323` COMBINING DOT BELOW. Các ứng viên không thiếu codepoint corpus ở mọi file đã tải. Các bảng GPOS/GSUB có trong file ứng viên, nhưng parser không thẩm định chất lượng định vị dấu.

Palatino trên máy này có đủ NFC nhưng thiếu3 mark NFD trực tiếp; **không kết luận NFD render sai**: shaping có thể chuẩn hóa/compose sang glyph dựng sẵn. Tương tự, thiếu cmap ở Geist không chứng minh xuất hiện tofu trên website. Segoe UI/Arial/Times được kiểm tra chỉ đọc file cài sẵn, không copy hay phân phối các font Windows.

### Root cause xếp theo độ tin cậy

| Độ tin cậy | Nguyên nhân | Giới hạn |
|---|---|---|
| Cao — VERIFIED | File Geist thiếu coverage; editorial token ưu tiên Segoe UI | Hai lỗi độc lập, không quy Home Palatino vào Geist |
| Trung bình — LIKELY | Fallback làm khác metrics/hình dáng trong UI | Chưa xác định face từng glyph |
| Thấp — NOT VERIFIED | Line-height/tracking hoặc antialiasing gây dấu dính trên máy Owner | Chưa tái hiện ink clip tại browser zoom thực |

## 4. Actual Font Fallback Findings

| Vấn đề | Trạng thái | Kết luận giới hạn |
|---|---|---|
| Font Geist chính có thiếu tiếng Việt | **VERIFIED / FAIL coverage** | File cụ thể thiếu các codepoint nêu trên; không suy rộng mọi phiên bản Geist |
| Chuỗi fallback hiện có | **VERIFIED** | Geist → adjusted Arial → Segoe UI → Roboto → Arial → generic sans |
| UI tiếng Việt có thể trộn face trong một cụm | **LIKELY** | Có điều kiện cần fallback/compose; chưa có rendered-fonts API để chỉ rõ ký tự dùng Arial hay Segoe UI |
| Face thực vẽ HUẾ / TRAVEL PRO / Huế có chi hay? ở Home | **NOT VERIFIED** | Computed là Palatino/Times; không gọi đó là font thực theo glyph |
| Segoe UI đứng trước Georgia của `font-serif` | **VERIFIED** | Source + computed family + ảnh heading dạng sans, không cần viện tên class |
| Tất cả dấu thanh đang fallback sai vị trí | **NOT VERIFIED** | Chưa có bằng chứng đủ để kết luận toàn bộ hoặc cùng nguyên nhân |
| Tofu/mất dấu trong mẫu NFC/NFD preview | **Không quan sát thấy trong ảnh đã xem** | Không chứng nhận toàn hệ thống hoặc mọi thiết bị |

Preview lưu `FontFaceSet` status cho từng face/weight và canvas width của144 cụm NFC so với NFD tại32px. Các family CurrentGeist, BeVietnamPro, NotoSans, Noto Serif đều có 0 cặp lệch width lớn hơn0.01px. [preview-font-metrics.json](evidence/GATE-07-03A/preview-font-metrics.json). Điều này không chứng minh không fallback, không chứng minh ink giống nhau và không xác định face theo glyph. `font.check=true` cũng không chứng minh coverage.

## 5. Visible Glyph Defects

| Quan sát | Bằng chứng / mức xác minh | Đánh giá |
|---|---|---|
| Heading trang con hiển thị sans | [Lịch sử1366](evidence/GATE-07-03A/production-ve-hue-1366.png) và source/computed | **VERIFIED**; cấu hình family là nguyên nhân tin cậy cao |
| Chữ Home có kiểu khác UI | [Home1366](evidence/GATE-07-03A/production-home-1366.png) | **VERIFIED** chuỗi font khác; không tự coi là lỗi cần đồng bộ |
| Dấu “HUẾ”, tagline hoặc wordmark dính/clip | Ảnh baseline và corpus không cho thấy mất dấu rõ ràng; chưa zoom thực | **NOT VERIFIED** là lỗi clip/mất glyph; phản ánh Owner vẫn cần đối chiếu trên đúng browser/scale máy Owner |
| Các dấu trong corpus A/B/C NFC/NFD | Hai ảnh corpus đầy đủ4100px, đã xem cả ba phần mỗi ảnh | Chưa thấy tofu, mất dấu hay ink va nhau rõ ràng; không dùng bounding box giao nhau để kết luận |
| Nguồn trên card Lưu trú bị rút gọn | [Card mobile](evidence/GATE-07-03A/production-luu-tru-card-metadata-390.png), `luu-tru/page.tsx:477–478` | **VERIFIED** `truncate` + max-width120/160px; là truncation CSS, không phải glyph thiếu. T06 vẫn DEFERRED |
| Breadcrumb mobile và placeholder dài kết thúc sớm | [Detail mobile](evidence/GATE-07-03A/production-detail-breadcrumb-390.png), ảnh top mobile | Có giới hạn bề ngang; không suy ra thiếu dấu hoặc mất dữ liệu |

Khác biệt độ nét trên screenshot, Windows smoothing và browser zoom chỉ là **khả năng**, chưa có thử nghiệm đối chứng để xác nhận antialiasing là root cause. `globals.css:29–34` có `-webkit-font-smoothing:antialiased`, nhưng không đủ để quy lỗi cho thuộc tính này.

## 6. CSS Collision vs Font Defects

- Home HUẾ tại1366: 96px/96px, letter-spacing−2.4px; TRAVEL PRO có tracking dương; tagline36px/48.6px. Line-height bằng font-size và tracking âm là **điểm cần quan sát**, chưa chứng minh glyph ink bị cắt. Không tự tăng line-height/tracking khi chưa có lỗi tái hiện.
- H1 Lịch sử/Khám phá/Di chuyển desktop48px/48px/800, tracking−1.2px. Độ đậm và khoảng dòng là vấn đề khác coverage. H1 Lưu trú28px/32px/700, mobile20px/27.5px theo snapshot; phải giữ nội dung và scope LOCK hiện tại.
- Card source Lưu trú là lỗi hiển thị toàn chuỗi do `truncate`, tách khỏi font; source Di chuyển hiện dùng `min-w-0 flex-1 basis-48 break-words` ở `cam-nang/page.tsx:382`, giữ T05 đã sửa. Không áp dụng kết luận lỗi cũ cho trạng thái hiện tại.
- Select native và placeholder dài là controls một dòng; có thể bị cắt phần cuối ở kích thước nhỏ. Font mới không tự khắc phục hết hạn chế này. Preview text-scale150% cũng cho thấy option/placeholder dài không hiện toàn bộ, dù dấu trong phần hiện ra vẫn có.
- Không thấy horizontal document overflow trong 25 snapshot; không bảo đảm mọi state modal/filter hoặc mọi scroll region. Font mới làm đổi wrapping nên cần kiểm thử layout sau phê duyệt; Gate này không sửa layout.

### Runtime matrix — số đo thật, không dùng HTTP200 làm bằng chứng giao diện

Browser in-app trên Windows, dùng các viewport đã yêu cầu. `clientWidth/scrollWidth` không gồm thanh cuộn; vì vậy ví dụ viewport1366 có content1351 là bình thường. 390 là mô phỏng viewport trên máy Windows, **không phải điện thoại thật**.

| Route | Viewport | Font status | Client / scroll width | Evidence |
|---|---|---|---|---|
| `/` | 1366×768 | loaded | 1366 / 1366 | [PNG](evidence/GATE-07-03A/production-home-1366.png) |
| `/ve-hue` | 1366×768 | loaded | 1351 / 1351 | [PNG](evidence/GATE-07-03A/production-ve-hue-1366.png) |
| `/kham-pha` | 1366×768 | loaded | 1351 / 1351 | [PNG](evidence/GATE-07-03A/production-kham-pha-1366.png) |
| `/cam-nang` | 1366×768 | loaded | 1351 / 1351 | [PNG](evidence/GATE-07-03A/production-cam-nang-1366.png) |
| `/luu-tru` | 1366×768 | loaded | 1351 / 1351 | [PNG](evidence/GATE-07-03A/production-luu-tru-1366.png) |
| `/` | 1440×900 | loaded | 1440 / 1440 | [PNG](evidence/GATE-07-03A/production-home-1440.png) |
| `/ve-hue` | 1440×900 | loaded | 1425 / 1425 | [PNG](evidence/GATE-07-03A/production-ve-hue-1440.png) |
| `/kham-pha` | 1440×900 | loaded | 1425 / 1425 | [PNG](evidence/GATE-07-03A/production-kham-pha-1440.png) |
| `/cam-nang` | 1440×900 | loaded | 1425 / 1425 | [PNG](evidence/GATE-07-03A/production-cam-nang-1440.png) |
| `/luu-tru` | 1440×900 | loaded | 1425 / 1425 | [PNG](evidence/GATE-07-03A/production-luu-tru-1440.png) |
| `/` | 1650×786 | loaded | 1650 / 1650 | [PNG](evidence/GATE-07-03A/production-home-1650.png) |
| `/ve-hue` | 1650×786 | loaded | 1635 / 1635 | [PNG](evidence/GATE-07-03A/production-ve-hue-1650.png) |
| `/kham-pha` | 1650×786 | loaded | 1635 / 1635 | [PNG](evidence/GATE-07-03A/production-kham-pha-1650.png) |
| `/cam-nang` | 1650×786 | loaded | 1635 / 1635 | [PNG](evidence/GATE-07-03A/production-cam-nang-1650.png) |
| `/luu-tru` | 1650×786 | loaded | 1635 / 1635 | [PNG](evidence/GATE-07-03A/production-luu-tru-1650.png) |
| `/` | 1920×1080 | loaded | 1920 / 1920 | [PNG](evidence/GATE-07-03A/production-home-1920.png) |
| `/ve-hue` | 1920×1080 | loaded | 1905 / 1905 | [PNG](evidence/GATE-07-03A/production-ve-hue-1920.png) |
| `/kham-pha` | 1920×1080 | loaded | 1905 / 1905 | [PNG](evidence/GATE-07-03A/production-kham-pha-1920.png) |
| `/cam-nang` | 1920×1080 | loaded | 1905 / 1905 | [PNG](evidence/GATE-07-03A/production-cam-nang-1920.png) |
| `/luu-tru` | 1920×1080 | loaded | 1905 / 1905 | [PNG](evidence/GATE-07-03A/production-luu-tru-1920.png) |
| `/` | 390×844 | loaded | 375 / 375 | [PNG](evidence/GATE-07-03A/production-home-390.png) |
| `/ve-hue` | 390×844 | loaded | 375 / 375 | [PNG](evidence/GATE-07-03A/production-ve-hue-390.png) |
| `/kham-pha` | 390×844 | loaded | 375 / 375 | [PNG](evidence/GATE-07-03A/production-kham-pha-390.png) |
| `/cam-nang` | 390×844 | loaded | 375 / 375 | [PNG](evidence/GATE-07-03A/production-cam-nang-390.png) |
| `/luu-tru` | 390×844 | loaded | 375 / 375 | [PNG](evidence/GATE-07-03A/production-luu-tru-390.png) |

Menu desktop/sidebar/mobile, H1/H2/H3, mô tả, select, placeholder, button, badge và metadata được inventory toàn DOM; ảnh25 trường hợp là vùng đầu trang. Bổ sung đã mở detail Lucia để xem breadcrumb và cuộn danh sách Lưu trú mobile để xem card/nguồn/nội dung dài. Đây là kiểm tra typography đọc, không thay thế full functional regression của tất cả bộ lọc/thuê xe.

## 7. Desktop Zoom Results

| Điều kiện | Kết quả |
|---|---|
| Browser zoom100% thực | **NOT VERIFIED**; baseline tại viewport khai báo, DPR1, visualViewport.scale1; các chỉ số này không đủ chứng minh browser zoom/Windows scaling100% |
| Browser zoom125% thực | **NOT TESTED** — không có API/control xác minh phần trăm zoom thực trong browser connector |
| Browser zoom150% thực | **NOT TESTED** — cùng giới hạn |
| Preview cỡ chữ100/125/150%,1440×900 | Đã chụp; **CSS text scaling riêng**, không đổi browser zoom; có thay wrapping, chưa thấy dấu bị clip trong mẫu thử |
| 1366×768 và1440×900 production | Đã đo/chụp; chưa có chứng cứ lỗi glyph chỉ xuất hiện ở một trong hai viewport |

Không dùng viewport nhỏ hơn hoặc CSSscale làm bằng chứng đã kiểm thử browser zoom. Không tuyên bố lỗi Owner tại125/150% đã được giải quyết.

## 8. Candidate Font Comparison

Tối đa **ba family**, ghép thành hai cấu hình thử. Tất cả là ứng viên nghiên cứu, **chưa được Owner duyệt**.

| Family | Vai trò / biến thể đã tải | Coverage và runtime preview | Nhận xét thị giác / hạn chế |
|---|---|---|---|
| **Be Vietnam Pro** | UI/body400,500,600,700 static; italic400 thật | 0 thiếu corpus NFC/NFD ở5file; các face `loaded` | B có nhịp chữ thân thiện, chữ Việt khá đều trên mẫu; hơi rộng hơn một số đoạn A, cần retest control/card. Italic500–700 chưa tải/visual test |
| **Noto Sans** | UI/body VF100–900; italic VF100–900; thử weights400/500/600/700 | 0 thiếu corpus ở2file; `loaded` | C trung tính, dễ đọc; khác hình dáng Geist, đổi wrapping; raw TTF lớn |
| **Noto Serif** | Editorial/display VF100–900 + italic thật; thử400/500/600/700 | 0 thiếu corpus ở2file; `loaded` | Serif rõ và italic cho tagline; không giống tuyệt đối Palatino/mockup. H1 dài Lưu trú xuống dòng khác; chỉ thay khi Owner mở đúng scope |

Nguồn chính thức: [Be Vietnam Pro](https://github.com/google/fonts/tree/main/ofl/bevietnampro), [Noto Sans](https://github.com/google/fonts/tree/main/ofl/notosans), [Noto Serif](https://github.com/google/fonts/tree/main/ofl/notoserif). METADATA.pb và OFL.txt tương ứng lưu nguyên bản trong preview; không lấy font từ trang tải lại bên thứ ba.

Khuyến nghị để Owner so sánh: **B** nếu thích UI Be Vietnam Pro và heading serif rõ; **C** nếu thích UI Noto Sans trung tính. Chưa chọn thay Owner. Trên Windows/in-app và mobile viewport, các mẫu đã hiển thị đọc được. Android/iOS/Safari/Chrome mobile thiết bị thật **NOT TESTED**.

## 9. Typography Preview Screenshots

**Preview:** [http://192.168.1.12:3001/](http://192.168.1.12:3001/) — server riêng của thư mục preview trong phiên làm việc này; điện thoại cùng mạng có thể mở khi server còn chạy. Không triển khai public và không đổi ứng dụng cổng3000.

**Tệp:** `A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro\reports\codex\typography-preview\index.html`. [Hướng dẫn](typography-preview/README.md). Cần HTTP để nạp JSON/fonts; mở file trực tiếp có thể bị chặn fetch.

| Ảnh | Nội dung / giới hạn |
|---|---|
| [Overview desktop](evidence/GATE-07-03A/preview-overview-1440.png) | A/B/C, mẫu thật, size100% của preview |
| [Corpus UI NFC/NFD](evidence/GATE-07-03A/preview-corpus-ui-1440.png) | Toàn bộ bảng,24rows ×6thanh, hoa/thường |
| [Corpus heading NFC/NFD](evidence/GATE-07-03A/preview-corpus-heading-1440.png) | Cùng corpus, heading family; B/C Noto Serif |
| [Mobile NFD390](evidence/GATE-07-03A/preview-overview-mobile-NFD-390.png) | Ba panel xếp dọc; không phải mobile OS thật |
| [Text scale125](evidence/GATE-07-03A/preview-text-scale-125-NFD-1440.png) | NFD, tăng cỡ chữ CSS, không browser zoom |
| [Text scale150](evidence/GATE-07-03A/preview-text-scale-150-NFD-1440.png) | Cùng giới hạn |

Các ảnh crop `*-part*.png`, `*-top.png` chỉ cắt từ screenshot để đọc ink, không sửa ảnh production. Contact sheet `contact-production-*.jpg` là ảnh tổng hợp nhỏ để kiểm tra bố cục, không dùng làm chứng cứ chi tiết dấu. Hai ảnh `provisional-*` là capture trong thao tác chưa ổn định, **loại khỏi bằng chứng kết luận**, không coi filename ban đầu là viewport thực.

Preview dùng text thật, có đủ các câu Owner yêu cầu, alphabet, native select, placeholder, badge, CTA, card dài,400/500/600/700 và italic. Mẫu “HUẾ TRAVEL PRO” không phải thay logo/wordmark LOCK. Preview dùng spacing rộng để kiểm tra glyph; không được suy ra thay vào layout production sẽ tự PASS.

## 10. Performance / License Considerations

| Family / file | Bytes thực trong preview |
|---|---:|
| Be Vietnam Pro Regular / Medium / Semibold / Bold | 132948 /135980 /136736 /140300 |
| Be Vietnam Pro Italic400 | 137244 |
| Noto Sans variable normal / italic | 2049096 /2322640 |
| Noto Serif variable normal / italic | 1887192 /2448496 |
| Geist baseline exactcopy | 66268 |

Đây là **raw TTF tải để thử**, không phải ngân sách production đã tối ưu. B normal UI 4 weights tổng545,964bytes; thêm italic thành683,208bytes. Noto Sans hai file 4,371,736bytes; Noto Serif hai file 4,335,688bytes. Preview tải nhiều family để đối chiếu, không đại diện hiệu năng website sau triển khai. Chưa đo cold-load trên điện thoại, CLS/LCP hay kích thước WOFF2 tối ưu.

Cả ba có **SIL Open Font License1.1** theo tệp chính thức: [Be Vietnam Pro OFL](https://github.com/google/fonts/blob/main/ofl/bevietnampro/OFL.txt), [Noto Sans OFL](https://github.com/google/fonts/blob/main/ofl/notosans/OFL.txt), [Noto Serif OFL](https://github.com/google/fonts/blob/main/ofl/notoserif/OFL.txt). Có thể self-host/embed và phân phối kèm sản phẩm với điều kiện OFL, giữ copyright/license, không bán font riêng, tuân thủ Reserved Font Names khi chỉnh sửa nếu có. Không cài font hệ điều hành, không thêm package, không nạp font từ Google vào production.

Đề xuất sau phê duyệt: chỉ đóng gói family/weights dùng thật, ưu tiên WOFF2 hợp lệ hoặc subset đúng giấy phép; giữ đầy đủ Vietnamese, combining marks NFC/NFD và shaping tables, rồi chạy lại coverage/visual. **Chưa subset/chuyển font trong Gate này**; không bịa kích thước tối ưu.

Nguồn/bytes/SHA từng tệp preview: [preview-file-manifest.csv](evidence/GATE-07-03A/preview-file-manifest.csv). Google Fonts `main` có thể thay đổi; hash ghi lại chính xác file đã thử trong phiên này.

## 11. File-by-file Implementation Proposal — chưa thực hiện

| File / vùng | Sửa tối thiểu được đề xuất cho Gate sau | Điều kiện |
|---|---|---|
| `src/app/layout.tsx:7–11,25` và thư mục font được duyệt | Đăng ký font UI mới bằng local font, chọn weights hợp lệ | Cần Owner chọn B/C và duyệt cách giữ Geist wordmark; không thay global ngay |
| `tailwind.config.ts:27–29` | Tách token UI và editorial, bỏ Segoe UI khỏi vị trí đầu của editorial nếu Owner muốn serif | Phải khoanh phạm vi; token shared ảnh hưởng nhiều vùng LOCK |
| `src/app/page.tsx:34–49` | Chỉ đổi family display/tagline nếu Owner chọn Noto Serif cho Home | Hero kích thước/wrapping có thể đổi; không tự sửa tracking/line-height cùng lúc |
| `src/app/ve-hue/page.tsx:58,127`; `kham-pha/page.tsx:154,382`; `cam-nang/page.tsx:140,285`; `luu-tru/page.tsx:151,383` | Áp dụng typography theo nhóm đã duyệt, kiểm tra dấu và linewrap | H1 Lưu trú và bốn Hero LOCK cần phê duyệt ảnh hưởng riêng; không đổi câu chữ/ảnh/height |
| `src/components/navigation/AdaptiveNavigation.tsx` | Giữ nguyên trong Gate này; sau này nếu cần cách ly font wordmark, phải có allowlist/exception cụ thể | Không sửa logo visual hoặc logic nav để “tiện đổi font” |
| `src/app/globals.css` | Chưa có sửa tối thiểu được chứng minh cần thiết | Không đổi smoothing/theme/global spacing dựa vào nghi ngờ |
| Card/filter/A01/T05/T07 | Retest sau font change, chỉ sửa lỗi tái hiện nếu được phép | Không tự mở card/layout phase; T06 source ellipsis vẫn DEFERRED |

Không cần asset Owner cung cấp để tiếp tục thử ba family đã có. Nếu Owner yêu cầu wordmark trùng chính xác bộ nhận diện/mockup bằng font khác, cần **file brand/font hoặc wordmark chuẩn và ngoại lệ LOCK riêng**; không tự dựng lại từ ảnh.

## 12. LOCK Impact Analysis

- Logo asset và wordmark: giữ PNG cùng SHA, không thay màu/hình/dimensions/gap/font. Đổi body font sẽ kế thừa vào wordmark nếu không cách ly: **dependency cần Owner duyệt riêng**, không phải quyền có sẵn từ Gate 07-03A.
- AdaptiveNavigation production không sửa. Desktop capsule/sidebar/mobile và Hero-to-Sidebar không thay logic; kiểm tra typography không đồng nghĩa regression chức năng toàn bộ.
- Bốn Hero 07-02B: asset, crop, overlay và source không đổi. Font heading mới có nguy cơ reflow che chủ thể, nên cần duyệt phạm vi typography và kiểm tra lại, không tự đổi hero height.
- H1 Lưu trú giữ nguyên câu đã phê duyệt và vùng mã. Không tự mở ngoại lệ để dùng serif mới.
- T05/T07 và A01: file/vùng hiện hành giữ nguyên; không trả về phiên bản cũ. Không rerun A01 full keyboard regression vì chưa sửa production; checksum không thay thế test functional.
- Routes/search/filter/rental/data/API/Prisma/database/ảnh card: không thay đổi, không migration/seed/deploy.

## 13. SHA-256 Integrity — READ-ONLY / NO SOURCE MODIFICATION

**59/59 file baseline UNCHANGED; 0 file production thay đổi.** [Baseline](evidence/GATE-07-03A/baseline.csv), [before/after đầy đủ](evidence/GATE-07-03A/integrity-before-after.csv). Phạm vi gồm tập source/public/LOCK/Prisma và file cấu hình liên quan được ghi trong baseline; không tuyên bố hash toàn ổ đĩa hoặc database.

| File đặc biệt | SHA-256 trước = sau |
|---|---|
| `src/app/fonts/GeistVF.woff` | `296FAFAFD41304F7C992079054B8AF914DBBD865F32DE97C66D0F613B55755D6` |
| `public/images/brand/owner-lotus.png` | `6E53DD205EDE658EBCAEBAED45632A1E5613C8D01E141B22172F597EB6112B9D` |
| `src/app/luu-tru/page.tsx` | `B4A3D56BC8EC3AAD01B2B2159F0E554F38804A6D8E0114F5B0D76180BDC06A89` |

Không sửa `AGENTS.md`, hồ sơ LOCK, layout, globals, font production, navigation, page, data hoặc package manifest. Không có Git repo để xuất git diff; checksum theo file là bằng chứng integrity. Diff production = 0 theo tập baseline.

**Chỉ tạo mới** báo cáo này; thư mục `reports/codex/typography-preview/` (HTML/CSS/JS/corpus/fonts/OFL/metadata/buildscript/README); và `reports/codex/evidence/GATE-07-03A/` (ảnh, corpus, font parser, inventory, metrics, manifest, integrity và script tổng hợp). Danh sách từng file tại [task-artifacts.csv](evidence/GATE-07-03A/task-artifacts.csv).

| Kiểm tra | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Typecheck | **NOT TESTED** | Không sửa production; không chạy lại |
| Lint | **NOT TESTED** | Cùng phạm vi |
| Build | **NOT TESTED** | Không tạo build production mới |
| Runtime typography inventory | **PASS trong 25 snapshot** | Route/viewport/computed/status ghi JSON; không phải full functional PASS |
| Coverage Geist | **FAIL** | Thiếu 88 NFC / 3 NFD trong corpus |
| Coverage candidate | **PASS corpus** | 9 candidate font files, 0 missing NFC/NFD; không chứng nhận per-glyph render |
| Preview font loading | **PASS** | FontFaceSet loaded + READY + ảnh |
| Visual Tests | **PARTIAL / NOT FULLY VERIFIED** | Đã xem corpus và preview, 25 ảnh vùng đầu production; actual zoom/mobile OS/font theo glyph chưa có |
| Production integrity | **PASS** | 59/59 unchanged |

## 14. Owner Decisions Required

1. Chọn UI/body **Be Vietnam Pro (B)** hay **Noto Sans (C)**; có dùng **Noto Serif cho editorial/display** hay giữ Home Palatino. Không xem lựa chọn UI là tự động duyệt tất cả heading.
2. Duyệt phạm vi ảnh hưởng riêng của font mới đến nav text, bốn Hero và H1 Lưu trú; xác nhận cách bảo vệ wordmark giữ font cũ. Logo visual không được thay vì chọn font body mới.
3. Xác nhận yêu cầu kiểm chứng trên máy Owner: browser/OS/zoom thực, vùng text cụ thể bị lỗi; cần kiểm thử thiết bị thật trước khi kết luận lỗi zoom đã hết. Gate này ghi rõ giới hạn, không đòi Owner duyệt “PASS” khi chưa có chứng cứ.

**Chưa giải quyết:** font thực theo từng glyph; tái hiện dấu dính trên đúng môi trường Owner; browser zoom125/150; mobile OS thật; hiệu năng font sau tối ưu; ảnh hưởng đến wordmark; T06 không thuộc phạm vi sửa font.

## 15. Recommended GATE 07-03B scope — proposal only

Đề xuất Gate sau chỉ đăng ký family/weights Owner chọn và áp dụng vào các vùng typography có allowlist; bảo vệ wordmark theo cách Owner duyệt. Sửa riêng cấu hình serif sai ưu tiên nếu được duyệt. Giữ dữ liệu, route, asset, chiều cao Hero, bộ lọc, logic card và các vùng LOCK khác.

Tiêu chí kiểm chứng: typecheck/lint; 25 tổ hợp route/viewport; corpus NFC/NFD; ink dấu; H1/card/select/metadata; bốn Hero và H1 Lưu trú; checksum và hình ảnh wordmark; A01 bằng bàn phím; T05/T07; chuyển navigation; browser zoom thực và thiết bị thật khi có công cụ. Chỉ đổi line-height/tracking nếu tái hiện lỗi ink bị cắt, không tăng toàn hệ thống theo suy đoán.

**Không bắt đầu GATE 07-03B. Không có Owner font approval trong báo cáo này.**

**PASS = LOCK — FIX ONLY WHAT FAILED — NO SCOPE CREEP.**

**HARD STOP — AWAIT OWNER REVIEW.**

**STOP — AWAIT OWNER FONT APPROVAL.**
