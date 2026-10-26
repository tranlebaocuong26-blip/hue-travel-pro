# GATE 07-03B — Rollback Runbook

Project: `A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro`.
Ngày:2026-10-25, Asia/Saigon. Phạm vi chỉ rollback các file task07-03B đã sửa/thêm. Không Git reset/checkout/init. Không deploy, không sửa database.

## Trạng thái recovery đã xác minh

- 7source files trước sửa có backup nguyên byte và SHA-256.
- Đã copy backup vào `reports/codex/evidence/GATE-07-03B/restore-rehearsal/`, kiểm tra7/7 khớp nguồn đầu task.
- Dry-run script kiểm tra7current files và8 new files khớp checkpoint after; **NO WRITES**.
- **Actual full rollback chưa chạy**. Không gọi rehearsal là rollback live.

Manifest đầy đủ: [rollback-manifest.csv](evidence/GATE-07-03B/rollback-manifest.csv). Đường dẫn trong manifest tương đối với project root; hashafter là phiên bản task bàn giao. Backup tại `reports/codex/evidence/GATE-07-03B/checkpoint-before/`, mirror đúng đường dẫn nguồn. After copy tại `checkpoint-after/`.

## Khi nào dùng

Thực hiện nếu điều kiện rollback của Owner xảy ra: brand/Home typography đổi, P0/glyph loss/clip nghiêm trọng, navigation/filter/T05/T07/A01 regress, hoặc technical fail do patch không thể sửa trong allowlist. Nếu Owner thay đổi file độc lập sau task, dừng và xử lý conflict trước; không ghi đè.

## Quy trình

1. Dừng đúng server local của task trước khi restore/build. Không kill mọi process Node hoặc server khác. Giữ bằng chứng lỗi và checksum hiện tại.
2. Chạy dry-run từ project root bằng Python đã có, không cài package:

```powershell
Set-Location -LiteralPath 'A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro'
& 'C:\Users\cường\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' 'reports/codex/evidence/GATE-07-03B/rollback.py'
```

3. Kết quả phải là `DRY RUN PASS — NO WRITES`. Script kiểm tra current hash bằng SHA256After và backup bằng SHA256Before cho toàn bộ manifest **trước mọi thao tác ghi**. Nếu CONFLICT, không dùng `--apply`; không “sửa” manifest để bỏ qua khác biệt.
4. Khi rollback thuộc quyền Owner cấp và không có conflict, chạy:

```powershell
& 'C:\Users\cường\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' 'reports/codex/evidence/GATE-07-03B/rollback.py' --apply
```

5. Script chỉ restore7 file: layout.tsx,tailwind.config.ts,AdaptiveNavigation.tsx và4main subpage page.tsx. Hash sau restore phải bằng before. Không restore Home/Shell/globals/AGENTS/LOCK/data vì task không sửa chúng.
6. Sau restore source, script kiểm tra không còn source dependency rồi chỉ xóa8 file do task tạo:5 BeVietnamPro TTF,1Noto SerifVF,2 OFL, đúng tên trong manifest. Không xóa Geist/GeistMono hoặc thư mục fonts; không recursive delete. Nếu phát hiện dependency mới, giữ assets và báo conflict, không tự ép xóa.
7. Đọc `actual-rollback-result.json` nếu có. Nếu script báo lỗi giữa bước ghi, giữ nguyên evidence, kiểm tra từng hash và dừng khi cần Owner quyết định; không tuyên bố recovery xong chỉ vì một phần đãrestore.
8. Chạy lại:

```powershell
pnpm exec tsc --noEmit --incremental false
pnpm lint
pnpm build
```

Build lại là bắt buộc trước khi dùng `pnpm start`: `.next` hiện chứa typography mới, restore source không tự thay compiled build. Nếu quyền ghi cache bị chặn, chạy lệnh trong môi trường quyền host được phê duyệt; không tự đổi ACL hoặc xóa cache bằng lệnh recursive.

9. Khi buildPASS, chạy server local theo cấu hình được Owner cho phép. Smoke5 routes, Home3display,logo/sidebar/mobile, navhai chiều,6rental links,stayfilter/reset 8,Tab/Shift+Tab/Enter/Space/focusA01; so checksum các file LOCK/data và ảnhbaseline. Không dùng HTTP200 thayvisual.
10. Lưu báo cáo rollback riêng, nêu hash trước/sau, file đãrestore/xóa, lỗi/conflict, technical/runtime/visual outcomes thực tế. Không ghi đè báo cáo implementation.

## Giới hạn

Script mặc định dry-run; không tự chạy `--apply` khi đọc runbook. Không xử lý mọi thay đổi Owner về sau. Partial rollback chỉ một stage cần kiểm tra dependency và source diff riêng; không restore nguyên một page để hủy riêng Noto Serif nếu làm mất UI changes hoặc sửa độc lập của Owner.

**Recovery rehearsal VERIFIED; full live rollback NOT PERFORMED.**

**HARD STOP — AWAIT OWNER REVIEW.**
