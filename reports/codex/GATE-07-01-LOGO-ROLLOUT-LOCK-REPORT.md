# HUẾ TRAVEL PRO V2.3 — Logo Rollout & Lock

- **Project / Gate / Task:** HUẾ TRAVEL PRO V2.3 / GATE 07-01 / LOGO-ROLLOUT-LOCK.
- **Ngày:** 24/10/2026, Asia/Saigon.
- **Phạm vi được cấp:** Owner yêu cầu xem trước `hoa sen.png`, đồng ý sẽ áp dụng cả năm trang sau duyệt, sau đó phản hồi **“chốt”**. Đây là quyền duyệt mẫu logo và đồng bộ logo; không phải quyền sửa typography hoặc layout khác.
- **Trạng thái:** mẫu logo **OWNER APPROVED / LOCKED**; đồng bộ các vị trí brand hiện có đã hoàn tất local. Không tuyên bố toàn website hoặc typography đã được nghiệm thu.

## Executive Summary

Đã đồng bộ ảnh hoa sen được duyệt cho brand của Trang chủ, Về Huế, Khám phá, Cẩm nang và Lưu trú. Home desktop/mobile tiếp tục dùng mẫu xem trước đã chốt; sidebar bốn trang con chuyển từ SVG/ô vuông tím sang cùng ảnh hoa sen. Giữ wordmark, khung logo, khoảng cách chữ, routes và cơ chế navigation.

Quyết định LOCK được ghi ở AGENTS.md mục2 và mục9, gồm đường dẫn asset và SHA-256. Bốn trang con mobile vốn không có brand header; giữ nguyên cấu trúc đó, không tự thêm một vị trí logo/header mới.

## Công việc đã thực hiện / root cause

1. Đọc AGENTS.md, AdaptiveNavigation, SubpageTopBar và Shell; xác định Shell dùng AdaptiveNavigation. Header.tsx không được import trong source đang dùng nên không mở sửa file đó.
2. Lưu checkpoint trước sửa. Dự án không có Git repository theo kiểm tra trước; dùng bản sao source/tài liệu và hash để kiểm soát phạm vi.
3. Thay đúng block logo sidebar còn dùng SVG cũ trong `src/components/navigation/AdaptiveNavigation.tsx:164`. Dùng Next Image với cùng public asset đã duyệt, width/height44, object-contain, không đổi màu/cắt ảnh; bỏ nền ô vuông tím quanh icon để nhất quán mẫu Home. Giữ wrapper44px và wordmark như cũ.
4. Cập nhật `AGENTS.md:24,117` ghi nhận quyết định Owner ngày24/10 và phạm vi LOCK. Quyết định mới thay thế ghi chú trước đó chưa duyệt hoa sen hồng, không tự mở quyền sửa khác.
5. Typecheck/lint và kiểm tra runtime/ảnh năm route ở desktop1366×768 và mobile390×844. Trả viewport về mặc định và quay lại Home sau kiểm tra.

**Nguyên nhân logo chưa đồng bộ trước lượt này:** đợt trước chỉ được phép thay Home để Owner xem trước; sidebar cố ý giữ logo cũ chờ phê duyệt. Nay điều kiện phê duyệt đã có.

## Kết quả và bằng chứng

Asset giữ nguyên từ `hoa sen.png` sang `public/images/brand/owner-lotus.png`: cùng SHA-256 **6E53DD205EDE658EBCAEBAED45632A1E5613C8D01E141B22172F597EB6112B9D**. Không tạo hoặc chỉnh asset trong lượt này.

| Route | Desktop1366×768 | Mobile390×844 |
|---|---|---|
| `/` | VERIFIED ảnh cùngasset, loaded, CSS40px | VERIFIED loaded, CSS36px |
| `/ve-hue` | VERIFIED sidebar cùngasset, loaded, CSS44px | Không có brand slot sẵn; bottom nav5 mục giữ nguyên |
| `/kham-pha` | VERIFIED sidebar cùngasset, loaded, CSS44px | Không có brand slot sẵn; bottom nav5 mục giữ nguyên |
| `/cam-nang` | VERIFIED sidebar cùngasset, loaded, CSS44px | Không có brand slot sẵn; bottom nav5 mục giữ nguyên |
| `/luu-tru` | VERIFIED sidebar cùngasset, loaded, CSS44px | Không có brand slot sẵn; bottom nav5 mục giữ nguyên |

Đã xem đủ10 ảnh viewport để kiểm tra vùng logo/navigation hiện có. Không thấy logo hoặc wordmark cắt/chồng trong những vùng đã xem; màu hồng nhạt trên sidebar trắng giữ theo asset Owner duyệt, không tự đổi tương phản. Kích thước ảnh chụp phụ thuộc vùng capture của công cụ; viewport CSS được ghi riêng trong JSON, không suy ra từ độ phân giải PNG.

![Logo sidebar được duyệt](evidence/GATE-07-01-LOGO-ROLLOUT-20261024/approved-sidebar-logo.png)

| Trang | Desktop screenshot | Mobile screenshot |
|---|---|---|
| Home | [Ảnh](evidence/GATE-07-01-LOGO-ROLLOUT-20261024/home-desktop.png) | [Ảnh](evidence/GATE-07-01-LOGO-ROLLOUT-20261024/home-mobile.png) |
| Về Huế | [Ảnh](evidence/GATE-07-01-LOGO-ROLLOUT-20261024/ve-hue-desktop.png) | [Ảnh](evidence/GATE-07-01-LOGO-ROLLOUT-20261024/ve-hue-mobile.png) |
| Khám phá | [Ảnh](evidence/GATE-07-01-LOGO-ROLLOUT-20261024/kham-pha-desktop.png) | [Ảnh](evidence/GATE-07-01-LOGO-ROLLOUT-20261024/kham-pha-mobile.png) |
| Cẩm nang | [Ảnh](evidence/GATE-07-01-LOGO-ROLLOUT-20261024/cam-nang-desktop.png) | [Ảnh](evidence/GATE-07-01-LOGO-ROLLOUT-20261024/cam-nang-mobile.png) |
| Lưu trú | [Ảnh](evidence/GATE-07-01-LOGO-ROLLOUT-20261024/luu-tru-desktop.png) | [Ảnh](evidence/GATE-07-01-LOGO-ROLLOUT-20261024/luu-tru-mobile.png) |

[DOM desktop](evidence/GATE-07-01-LOGO-ROLLOUT-20261024/runtime-desktop.json), [DOM mobile](evidence/GATE-07-01-LOGO-ROLLOUT-20261024/runtime-mobile.json).

## File thay đổi / phạm vi diff

- **Sửa:** `src/components/navigation/AdaptiveNavigation.tsx`: chỉ logo sidebar; logo Home đã đổi ở đợt trước không thay tiếp.
- **Sửa:** `AGENTS.md`: quyết định Owner về logo LOCK và phạm vi đồng bộ; các LOCK khác giữ nguyên.
- **Tạo:** báo cáo này và evidence/checkpoint tại `reports/codex/evidence/GATE-07-01-LOGO-ROLLOUT-20261024/`.
- Asset, wordmark, font config, Hero, bốn page.tsx, dữ liệu/database không sửa. Không cài package, build/deploy/push hoặc bắt đầu bước tiếp theo.

[Source trước sửa](evidence/GATE-07-01-LOGO-ROLLOUT-20261024/AdaptiveNavigation.before.tsx), [AGENTS trước sửa](evidence/GATE-07-01-LOGO-ROLLOUT-20261024/AGENTS.before.md), [baseline](evidence/GATE-07-01-LOGO-ROLLOUT-20261024/baseline.csv), [hash cuối](evidence/GATE-07-01-LOGO-ROLLOUT-20261024/integrity-final.csv). Trong tập baseline source/public/AGENTS chỉ hai file nêu trên đổi hash.

## Test Results

| Hạng mục | Kết quả |
|---|---|
| Typecheck: pnpm exec tsc --noEmit --incremental false | PASS, exit0 |
| Lint: pnpm lint | PASS, không warning/error |
| Production build | NOT TESTED; thay đổi logo nhỏ, kiểm tra trên dev, không triển khai |
| Runtime image loading5 route desktop + Home mobile | PASS, complete=true và naturalWidth>0 |
| Visual logo ở5 route desktop và mobile hiện có | PASS trong phạm vi đã xem; không chứng nhận toàn UI |
| Functional navigation click/morph, search/filter | NOT TESTED lại; handler/logic không sửa |
| Typography zoom100/125/150 và actual glyph fonts | NOT TESTED trong nhiệm vụ logo; còn thuộc báo cáo Phase1F |

## Vấn đề chưa giải quyết / bước tiếp theo / trạng thái nghiệm thu

Không còn việc triển khai trong phạm vi đồng bộ logo này. Mẫu ảnh đã được Owner duyệt bằng “chốt”; quyết định logo LOCK được lưu. Những vấn đề font, asset background, layout hoặc visual fidelity trước đây không được tự coi đã giải quyết bởi việc thay logo. Chờ nhiệm vụ cụ thể mới từ Owner, không tự tiếp tục sửa typography.

**PASS = LOCK — FIX ONLY WHAT FAILED — NO SCOPE CREEP.**

**HARD STOP — AWAIT OWNER REVIEW.**
