# GATE 07-03C — Rollback Runbook

**Project:** `A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro`  
**Date:** 2026-10-25, Asia/Saigon.  
**Baseline:** Post-GATE-07-03B state (`GATE-07-03B SHA256After`).  
**Rule:** Rehearsal verified, dry-run default, no destructive commands.

---

## 1. Mục đích & Điều kiện Sử dụng

Tài liệu này hướng dẫn khôi phục toàn bộ mã nguồn và cấu hình phông chữ về trạng thái sau GATE-07-03B nếu:
- Phát hiện bất kỳ hồi quy nào trên các vùng thiết kế đã khóa (Brand wordmark, Home display lines, Hero images, Subpage H1, T05, T07, A01).
- Chủ sở hữu (Owner) yêu cầu hủy thử nghiệm Noto Sans và phục hồi Be Vietnam Pro làm font UI chính.

---

## 2. Trạng thái Checkpoint Đã Xác minh

- Checkpoint Before lưu tại: `reports/gravity/evidence/GATE-07-03C/checkpoint-before/`
- Checkpoint After lưu tại: `reports/gravity/evidence/GATE-07-03C/checkpoint-after/`
- Toàn bộ 11 tệp (8 tệp nguồn + 3 tệp phông/giấy phép mới) được lập chỉ mục tại [manifest.csv](evidence/GATE-07-03C/manifest.csv).
- Dry-run script đã chạy và báo: `DRY RUN PASS — NO WRITES PERFORMED`.

---

## 3. Quy trình Thực hiện Rollback

### Bước 1: Dừng server production hiện hành

```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force -ErrorAction SilentlyContinue
```

### Bước 2: Chạy kiểm tra Dry-run (không ghi đĩa)

```powershell
& 'C:\Users\cường\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' 'reports/gravity/evidence/GATE-07-03C/rollback.py'
```
*Kết quả bắt buộc: `DRY RUN PASS — NO WRITES PERFORMED`.*

### Bước 3: Thực hiện Rollback Trực tiếp (Live Apply)

Khi có chỉ đạo của Owner, chạy lệnh:

```powershell
& 'C:\Users\cường\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' 'reports/gravity/evidence/GATE-07-03C/rollback.py' --apply
```

Hành động thực hiện:
1. `src/app/page.tsx` <- phục hồi nguyên bản 07-03B (`SHA256: 3EAA1C0AB4792D09981429AA7F4E5B43D877F22529A086122E2F958716393A7B`)
2. `src/app/layout.tsx` <- phục hồi nguyên bản 07-03B (`SHA256: 0378BB6475D431B15939406CE010756B7172312D4DE2CAA94389330648864A93`)
3. `tailwind.config.ts` <- phục hồi nguyên bản 07-03B (`SHA256: F5F33F7590E9B4101D8023AEE9B4267BA7EF891F8284C565CEAF4C921BA574FC`)
4. Xóa 3 tệp Noto Sans (`NotoSans-VF.ttf`, `NotoSans-Italic-VF.ttf`, `NotoSans-OFL.txt`) khỏi `src/app/fonts/`.

### Bước 4: Kiểm thử và Xây dựng lại Build

```powershell
cd "A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro"
pnpm.cmd exec tsc --noEmit --incremental false
pnpm.cmd lint
pnpm.cmd build
```

---

## 4. Giới hạn

- Kịch bản rollback mặc định ở chế độ Dry-run để bảo vệ dữ liệu.
- Kịch bản chỉ phục hồi đúng các tệp trong manifest GATE 07-03C, không chạm vào database, Prisma, assets tĩnh hoặc các tệp cấu hình khác.
- Rehearsal đã được kiểm chứng thành công độc lập.
