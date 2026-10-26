# Phase 1E — Design QA

Ngày: 2026-10-24 / Asia-Saigon. Báo cáo QA đặt trong reports/codex/evidence theo giới hạn tài liệu của Owner; không tạo file QA ở gốc hoặc sửa source ngoài allowlist.

## Visual truth và implementation

- Source truth: `A:\trí tuệ nhân tạo\BAI_3\HUE_TRAVEL_PRO_V2.3_5_MOCKUPS\01_TRANG_CHU.png`, bitmap 1448×1086.
- Implementation: `http://localhost:3000/`, [ảnh cùng khung 1448×1086](GATE-07-01-PHASE1E-1448x1086-comparison.jpg).
- CSS viewport thực đo: 1448×1086; DPR khoảng 1.000000015. Bitmap screenshot 1448×1086; không resize ảnh để giả khớp.
- State: Home, capsule navigation, drawer đóng, scrollY=0. Source/implementation cùng khung nhưng khác dữ liệu/nội dung theo quyết định sản phẩm của Owner.
- Source và ảnh render được mở cùng lượt xem để đánh giá toàn cảnh; không tuyên bố đã có collage raster hoặc pixel-diff tự động. Typography/caption được xem ở ảnh độ phân giải gốc và đối chiếu các ảnh desktop/mobile; không tạo crop nguồn hoặc ảnh ghép giả.
- [Mockup nguồn được lưu ở Phase 1D](GATE-07-01-PHASE1D-owner-mockup.png); [baseline trước sửa](GATE-07-01-PHASE1E-before-runtime.jpg); [ảnh bổ sung sau sửa](GATE-07-01-PHASE1E-after-runtime-reference.jpg). Baseline có bitmap 1264×744, không ghi được CSS viewport đồng thời; cặp baseline này chỉ dùng so sánh định tính, không làm bằng chứng pixel-match.

## Lịch sử so sánh và sửa trong phạm vi

1. Baseline từ Phase 1C/1D và ảnh trước sửa: sans nặng, badge pill, padding lồng, dock nhiều hộp, nhãn giá trị sát nhau.
2. Đổi stack font riêng Home sang Palatino Linotype / Times New Roman, weight 400, HUẾ lớn nhất; tagline serif italic có đủ glyph đang dùng. Bỏ pill, giảm độ nặng mô tả.
3. Thay wrapper hero/dock bằng layout cục bộ, một glass dock, caption phủ đáy ảnh; cột cuối rộng 1.35 phần và 3 ô giá trị có gap.
4. Ảnh card ban đầu còn mép trắng/UI; sửa crop hiển thị sang object-right-bottom và scale 1.5 (hover 1.55), không đổi pixel ảnh. Vẫn có thể còn mẩu UI trong crop rộng vì asset có sẵn UI; không khai báo ảnh đã sạch.
5. Phép đo 1366×768 ở lượt đầu có khoảng 0.8 px dư. Giảm padding đáy desktop thấp từ 24 xuống 20 px; lượt cuối scrollHeight=clientHeight=768. Không cắt chữ, không giảm cực đoan typography.
6. Bộ ảnh cuối 1366×768, 1440×900, 1650×786 và mobile fullpage đã được mở kiểm tra. CTA, caption, mũi tên và giá trị rõ; không tràn ngang; mobile cuộn tự nhiên.

## Năm bề mặt fidelity

| Bề mặt | Đánh giá |
|---|---|
| Fonts / typography | HUẾ và TRAVEL PRO đã là serif thanh hơn; font stack cục bộ không sửa cấu hình toàn site. Có glyph Việt theo cmap. Tagline mềm hơn nhưng chưa là script gốc: NEEDS FONT APPROVAL. Không khẳng định tên font gốc hoặc anti-aliasing trùng tuyệt đối. |
| Spacing / layout | Trục hero bớt lùi sâu; CTA có khoảng thở; dock gọn và cột giá trị tách. Header/nav vẫn ở vị trí cũ theo LOCKED; gutter ngoài vẫn thấp hơn mockup. Không cắt nội dung để buộc One-Screen. |
| Colors / tokens | CTA giữ #CAFA35, khác nút sáng trong mockup theo quyết định Owner. Hero phải sáng hơn, overlay đủ đọc chữ trái; background ngoài có chuyển sắc nhẹ. Màu ấm/pink của cảnh còn phụ thuộc asset cũ. |
| Images / logo / quality | Hero cũ vẫn crop thiếu trời và chứa chữ/UI raster. Hai ảnh card giữ nguyên; crop có thể làm mềm/phóng lớn ảnh thấp phân giải. Ẩm thực vẫn NEEDS ASSET. Logo navigation chưa được phép đổi. Không coi các phần này đã hoàn thành. |
| Copy / content | Tiêu đề, tagline, mô tả, CTA, card/giá trị và href giữ nguyên; không số liệu giả, không video, không menu cũ. |

## Findings còn mở

- [P0 theo kế hoạch Owner] NEEDS CLEAN HERO ASSET: không có cảnh cầu sạch đủ độ phân giải trong nguồn đã khảo sát; không được thay hero khi chưa duyệt asset.
- [P0 theo kế hoạch Owner] Logo đúng chưa tích hợp: Owner yêu cầu chỉ chuẩn bị preview, navigation vẫn LOCKED. HTML preview có bản gốc và bản ngà alpha-mask, nhưng browser chặn file:// nên không có screenshot preview đã xác minh. NEEDS OWNER LOGO REVIEW.
- [P1] Tagline chưa khớp script gốc: font script cài sẵn thiếu glyph ế/Ế; dùng Palatino italic gần nhất, chờ duyệt.
- [P1 / DEFERRED] Card ẩm thực thiếu ảnh; giữ placeholder trung thực theo Owner.
- [P2 / giới hạn asset] Ảnh card có UI raster, crop chỉ giảm phần nhìn thấy, không làm sạch file.
- [Intentional / LOCKED] CTA lime; navigation 4 mục + Home; không video/số đếm giả; header/logo hiện tại chưa sửa.

Không sửa các điểm ngoài allowlist để ép QA thành passed. Owner đã quy định phương án fallback cho font, hero và logo; bàn giao báo cáo trạng thái còn mở thay vì tự triển khai tiếp.

## Runtime và hồi quy

- [11 tương tác](GATE-07-01-PHASE1E-interactions.json): PASS trong các trường hợp thử; bấm Home quá nhanh trong morph bị guard cũ bỏ qua, thử lại sau ổn định thành công, không sửa guard.
- [Console trước](GATE-07-01-PHASE1E-before-console.json) và [sau](GATE-07-01-PHASE1E-after-console.json): cùng 1 warning extra attributes __processed_…__, cùng thời điểm/nội dung; không có bản ghi mới trong lượt thử. Nguồn gốc warning chưa xác minh, không suppress.
- Typecheck/lint exit 0; build NOT TESTED. Không coi HTTP 200 hoặc DOM probes đơn lẻ là visual acceptance.

## Checklist bàn giao

- [x] Source chỉ hai file allowlist thay đổi; 52 file baseline còn lại không đổi.
- [x] Có ảnh/số đo ở bốn viewport và ảnh so sánh cùng khung mockup.
- [x] Có runtime interactions, console baseline/sau, typecheck/lint.
- [x] Logo, hero sạch và font script được đánh dấu đúng trạng thái chưa hoàn thành.
- [ ] Owner visual acceptance; không tự mở Phase 2 hoặc sửa logo/hero.

**final result: blocked**

Blocked cho nghiệm thu fidelity đầy đủ bởi asset/logo/font còn chờ Owner, không phải báo rằng phần sửa được cấp phép chưa được triển khai. STOP — AWAIT OWNER VISUAL ACCEPTANCE.
