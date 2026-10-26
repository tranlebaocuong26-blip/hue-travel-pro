# GATE 07-03D — Rollback Runbook

**Project:** `A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro`  
**Date:** 2026-10-25, Asia/Saigon.  
**Baseline:** Post-GATE-07-03C state (`baseline-sha256.csv`).  
**Rule:** Rehearsal verified, dry-run default, no destructive commands.

---

## 1. Mục đích & Điều kiện Kích hoạt

Tài liệu này hướng dẫn khôi phục toàn bộ mã nguồn về trạng thái sau GATE-07-03C nếu:
- Chủ sở hữu (Owner) không chấp thuận phương án phóng to Brand Lockup (H02) hoặc vị trí chiều dọc (H01).
- Phát hiện bất kỳ lỗi hồi quy nào trên các vùng thiết kế đã khóa (Brand wordmark, Home display lines, Hero images, Subpage H1, T05, T07, A01).

---

## 2. Trạng thái Checkpoint Đã Xác minh

- Checkpoint Before lưu tại: `reports/gravity/evidence/GATE-07-03D/checkpoint-before/`
- Checkpoint After lưu tại: `reports/gravity/evidence/GATE-07-03D/checkpoint-after/`
- Hai tệp duy nhất thay đổi:
  - `src/app/page.tsx`
  - `src/components/navigation/AdaptiveNavigation.tsx`
- Bảng đối chiếu mã băm được lưu tại [manifest.csv](evidence/GATE-07-03D/manifest.csv).
- Kịch bản hoàn nguyên: [rollback.py](evidence/GATE-07-03D/rollback.py).
- Kết quả kiểm thử chạy thử (dry-run): `DRY RUN PASS — NO WRITES PERFORMED`.
- Kết quả chạy thử khôi phục (rehearsal restore): `REHEARSAL RESTORE SUCCESSFUL`.

---

## 3. Quy trình Thực hiện Hoàn nguyên (Rollback Execution)

### Bước 1: Dừng server đang chạy (nếu cần)
```powershell
# Kiểm tra tiến trình node đang chạy trên cổng 3000
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
# Nếu cần tắt thủ công:
Stop-Process -Name node -Force
```

### Bước 2: Kiểm tra trước hoàn nguyên (Dry-run)
```powershell
python "A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro\reports\gravity\evidence\GATE-07-03D\rollback.py"
```
Kết quả kỳ vọng:
```
=== GATE 07-03D ROLLBACK TOOL (DRY RUN) ===
[OK] Backup valid for src\app\page.tsx
[OK] Backup valid for src\components\navigation\AdaptiveNavigation.tsx
DRY RUN PASS — NO WRITES PERFORMED
```

### Bước 3: Thực thi khôi phục
```powershell
python "A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro\reports\gravity\evidence\GATE-07-03D\rollback.py" --execute
```
Kết quả kỳ vọng:
```
=== GATE 07-03D ROLLBACK TOOL (EXECUTE) ===
[RESTORED] src\app\page.tsx successfully restored to baseline hash.
[RESTORED] src\components\navigation\AdaptiveNavigation.tsx successfully restored to baseline hash.
ROLLBACK COMPLETED SUCCESSFULLY — Files restored to Gate 07-03C baseline.
```

### Bước 4: Kiểm tra tính toàn vẹn và Build lại
```powershell
cd "A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro"
pnpm.cmd tsc --noEmit
pnpm.cmd build
```

Sau khi hoàn tất, mã nguồn dự án sẽ trở về nguyên vẹn 100% như lúc hoàn thành GATE 07-03C.
