# HUẾ TRAVEL PRO V2.3 — Phase 1F Typography Diagnosis

- **Project / Gate / Task:** HUẾ TRAVEL PRO V2.3 / GATE 07-01 / PHASE1F-TYPOGRAPHY-TARGETED-DIAGNOSIS.
- **Ngày:** 24/10/2026, Asia/Saigon.
- **Phạm vi:** READ-ONLY Hero title/tagline, landing wordmark và top capsule nav; không có quyền sửa typography.
- **Trạng thái đề xuất:** PARTIAL DIAGNOSIS — RUNTIME BLOCKED / AWAIT OWNER REVIEW. Owner sau đó chuyển sang yêu cầu xem trước logo; phần triển khai logo được báo cáo riêng, không phải sửa trong Phase1F.

## Executive Summary / công việc

Đã đọc lại AGENTS.md, Home và AdaptiveNavigation, đối chiếu cmap và CSS font của audit trước. Việc lấy font thực sự và kiểm tra zoom chưa hoàn tất: Computer Use dừng vì không xác định chắc chắn URL hiện tại của Edge để áp dụng chính sách an toàn. Đã dừng browser ở lượt Phase1F, không đổi bảo mật hay thử vượt chặn. Không có screenshot zoom mới từ Phase1F.

Owner xác nhận thấy dấu sít/dính khi zoom: ghi nhận là **OWNER-REPORTED**, không bác bỏ chỉ vì ảnh trước chưa thấy collision. Đợt này chưa tự tái hiện và quy kết nguyên nhân chính xác.

## Kết quả VERIFIED / NOT VERIFIED

| Vấn đề | Trạng thái / bằng chứng |
|---|---|
| Hero HUẾ/TRAVEL PRO/tagline dùng Geist | **VERIFIED: không phải computed stack của Hero.** page.tsx:37,43,49 đặt Palatino Linotype, Times New Roman, serif trực tiếp |
| Font thật browser vẽ HUẾ | **NOT VERIFIED** actual Rendered Fonts; computed stack không chứng minh platform face |
| Font thật browser vẽ TRAVEL PRO | **NOT VERIFIED**; chuỗi Latin không có dấu Việt, nên không thể quy việc chữ sít cho thiếu glyph Việt |
| Font thật browser vẽ Huế có chi hay? | **NOT VERIFIED** actual face/shaping |
| Geist hỗ trợ đầy đủ tiếng Việt | **VERIFIED: không đầy đủ** theo cmap audit trước: thiếu Ế/ế/ề/ơ/ư và một số dấu/tổ hợp. File source Geist chưa đổi theo kiểm tra hash trước sửa logo |
| Palatino/Times hỗ trợ các chuỗi Hero NFC | Cmap audit trước **VERIFIED coverage mẫu NFC**; không đủ chứng minh font thật browser đang dùng hoặc không có lỗi positioning. Palatino thiếu một số combining marks NFD trong tập thử |
| Fallback tiếng Việt ở Hero | **NOT VERIFIED**; không có căn cứ từ việc Geist thiếu glyph để kết luận Hero Palatino đang fallback |
| Wordmark/nav có thể cần fallback | **VERIFIED cấu hình/coverage**: stack Geist → generated Arial fallback → Segoe UI…; **NOT VERIFIED** face thực tế từng glyph và có trộn font trong đúng chuỗi |
| Trộn nhiều font trong một cụm Hero/wordmark | **NOT VERIFIED**. Cần Rendered Fonts, không thay bằng document.fonts.check hoặc font-family computed |
| Dấu bị cắt/đè nhau | **NOT VERIFIED trong Phase1F**; Owner đã báo, chưa có ảnh/số đo mới đúng zoom để tự tái hiện |
| Icon cũ khác ảnh Owner | **VERIFIED từ source**: AdaptiveNavigation.tsx:254–278 là SVG trong khung vuông; khác ảnh hoa sen Owner chọn. Wordmark là text DOM riêng, không nằm trong ảnh icon |

## Computed typography tham chiếu

Các số sau là **bằng chứng runtime của audit trước**, không phải phép đo mới Phase1F. Source cùng hash trước nhiệm vụ logo; actual browser face và zoom UI vẫn chưa xác minh. [Số đo Home1366](evidence/GATE-07-01-TP-01-HOME-metrics.json), [Home1440](evidence/GATE-07-01-TP-02-HOME-metrics.json).

| Thành phần | family | 1366×768 size /weight /line-height /spacing | 1440×900 |
|---|---|---|---|
| HUẾ | Palatino Linotype, Times New Roman, serif | 96px /400 /96px /−2,4px | 112px /400 /112px /−2,8px |
| TRAVEL PRO | cùng serif | 48px /400 /50,4px /+0,72px | 56px /400 /58,8px /+0,84px |
| Huế có chi hay? | cùng serif, italic | 36px /400 /48,6px /normal | 40px /400 /54px /normal |
| Wordmark HUẾ | Geist + fallback stack | 18px /700 /22,5px /+0,9px | cùng cấu hình |
| Wordmark Travel Pro | Geist + fallback stack | 10px /600 /10px /+1px | cùng cấu hình |
| Nav Về Huế | Geist + fallback stack | 12px /500 /16px /normal | cùng cấu hình |

Hero dùng tracking-tight âm ở HUẾ nhưng TRAVEL PRO tracking dương và tagline normal. Vì vậy nếu cả ba đều khó nhìn, chưa đủ cơ sở kết luận chỉ letter-spacing gây lỗi. Range giao nhau ở audit trước không chứng minh nét glyph giao nhau; không được coi Owner report là đã loại trừ.

## Zoom / viewport matrix

| Viewport laptop | 100% | 125% | 150% |
|---|---|---|---|
| 1366×768 | NOT VERIFIED zoom UI; có ảnh audit trước với viewport override | NOT TESTED | NOT TESTED |
| 1440×900 | NOT VERIFIED zoom UI; có ảnh audit trước với viewport override | NOT TESTED | NOT TESTED |

Không dùng DPR≈1 hoặc visualScale=1 để chứng minh browser zoom100%. Chưa phân biệt được tác động riêng của Windows scaling, anti-aliasing, zoom và thay đổi CSS viewport. Không mô phỏng zoom bằng transform/thu phóng ảnh để gọi là kiểm thử thật.

## Root Cause xếp theo độ tin cậy

1. **Cao / VERIFIED:** icon SVG cũ khác asset tham chiếu; đây là vấn đề nhận diện, độc lập với glyph text. Nhiệm vụ logo sau đó có quyền riêng và báo cáo riêng.
2. **Cao / VERIFIED coverage, chưa verified rendering:** Geist không đủ glyph Việt và generated fallback Arial có size-adjust107,19%. Liên quan wordmark/nav, không trực tiếp giải thích Hero serif.
3. **Trung bình / LIKELY:** nét/dấu Palatino italic/serif, tracking-tight của HUẾ và line-height sát em có thể tạo cảm giác sít. Chưa chứng minh sai positioning, clipping hay actual face; chưa nên sửa một biến để giải thích cả ba chuỗi.
4. **Thấp / NOT VERIFIED:** anti-aliasing/browser zoom làm rõ thêm vấn đề. Chưa đo đúng zoom và máy Owner, không đổ lỗi toàn bộ cho anti-aliasing.

## File liên quan / đề xuất sửa tối thiểu

- **P1 Hero rendering:** `src/app/page.tsx:36–49`. Ưu tiên lấy Rendered Fonts đúng ba node, font file/style/weight và screenshot zoom100/125/150 trước. Nếu xác minh clipping thì điều chỉnh riêng line-height/khoảng giữa dòng; nếu spacing thì sửa riêng tracking. Nếu không có glyph/face đúng mới đề xuất font thay thế cục bộ được Owner duyệt. Chưa đổi font global. Không cần asset mới cho một sửa spacing; font thương hiệu chính xác cần file/font spec và quyền sử dụng nếu Owner yêu cầu.
- **P1 logo/wordmark fidelity:** `src/components/navigation/AdaptiveNavigation.tsx:254–279`; icon cần đúng asset Owner chọn. Ảnh `hoa sen.png` được cung cấp nhưng không có chữ wordmark; nếu cần match chính xác cả lockup thì **NEEDS ASSET** wordmark/lockup SVG hoặc PNG đủ chất lượng do Owner duyệt. Không tự vẽ chữ/hoa sen hoặc đổi màu.
- **P2 nav:** AdaptiveNavigation.tsx:129, chỉ xử lý sau khi xác minh trộn actual font/spacing; giữ concept và labels.
- Nguyên nhân nền: `src/app/layout.tsx:7–10,25`, `tailwind.config.ts:27–29`, `src/app/fonts/GeistVF.woff`, `.next/static/css/app/layout.css:4–11` (generated). Chưa có quyền thay các file cấu hình/font này.

## Evidence / file changes / tests

[Cmap audit trước](evidence/GATE-07-01-TP-font-cmap-results.json), [báo cáo audit trước](GATE-07-01-TYPOGRAPHY-AUDIT-REPORT.md), [hash54 file trước nhiệm vụ logo](evidence/GATE-07-01-PHASE1F-source-integrity.csv): không đổi so với audit trước tại thời điểm ghi16:55, trước triển khai logo.

**READ-ONLY / NO SOURCE MODIFICATION trong Phase1F.** Chỉ tạo báo cáo này và source-integrity.csv. Không coi thay logo trong nhiệm vụ kế tiếp là kết quả sửa font Phase1F.

| Kiểm tra | Trạng thái Phase1F |
|---|---|
| Typecheck / lint / build | NOT TESTED |
| Runtime actual fonts | NOT TESTED — công cụ bị dừng |
| Visual zoom matrix | NOT TESTED — chưa có ảnh mới |
| Static stack / source | VERIFIED |
| Visual acceptance | PENDING OWNER REVIEW |

## Vấn đề chưa giải quyết / bước tiếp theo

Chưa đáp ứng actual font từng glyph và ma trận zoom; báo cáo này không phải kết luận lỗi đã sửa hay toàn bộ typography PASS. Chờ Owner xem xét bằng chứng; khi công cụ hỗ trợ lại có thể tiếp tục đúng phạm vi đo, chưa sửa typography.

**STOP — AWAIT OWNER REVIEW.**
