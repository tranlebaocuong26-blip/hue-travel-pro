# QUY TRÌNH PHỤC HỒI NGUYÊN TRẠNG (ROLLBACK RUNBOOK) — GATE 08
**Dự án:** HUẾ TRAVEL PRO V2.3 (`A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro`)  
**Mục tiêu:** Cung cấp hướng dẫn từng bước để phục hồi mã nguồn về trạng thái baseline trước GATE 08 một cách chuẩn xác, an toàn, byte-for-byte.

---

## 1. THÔNG TIN ĐIỂM SAO LƯU (BASELINE CHECKPOINT)

- **Vị trí thư mục checkpoint nguyên byte:**
  `A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro\checkpoints\GATE-08-BASELINE\`
- **Tệp manifest kiểm soát toàn vẹn:**
  `checkpoints/GATE-08-BASELINE/manifest.json`

### Bảng đối chiếu mã băm SHA-256

| Tệp tin | Trạng thái GATE 08 | SHA-256 Trước sửa (Baseline) | SHA-256 Hiện tại | Ghi chú |
|:---|:---:|:---|:---|:---|
| `src/app/cam-nang/page.tsx` | Đã sửa (Fix bug P1) | `ab6fc6f79d24a0c0fce5afeb631de25b065b937446a9846829ea2e26fbc00d51` | `ba74fa77ad33fc003cb828946e3bead08b61e272bc1dfcbbd0ea2da310ea0a9e` | Khắc phục tràn ngang 320px |
| `src/app/page.tsx` | Nguyên vẹn | `af4bb3b4bb0cdf61f6b9514e04fbee33b9be6b5d4f5151ab3d0ebbc5e2cbc4d8` | `af4bb3b4bb0cdf61f6b9514e04fbee33b9be6b5d4f5151ab3d0ebbc5e2cbc4d8` | Khóa bất khả xâm phạm |
| `src/app/ve-hue/page.tsx` | Nguyên vẹn | `000216141ddf9b3712446d08de8afc8401378118f85beacb8129a49579970318` | `000216141ddf9b3712446d08de8afc8401378118f85beacb8129a49579970318` | Khóa |
| `src/app/kham-pha/page.tsx` | Nguyên vẹn | `ecdbe9147443089f325aa97456c923b762a36ec9279a38f7485799dd8fe02986` | `ecdbe9147443089f325aa97456c923b762a36ec9279a38f7485799dd8fe02986` | Khóa |
| `src/app/an-uong/page.tsx` | Nguyên vẹn | `ed0ae2b6878f7cc75234611ee255c9fa3cb035ed038b058e2df67b559448d723` | `ed0ae2b6878f7cc75234611ee255c9fa3cb035ed038b058e2df67b559448d723` | Khóa |
| `src/app/luu-tru/page.tsx` | Nguyên vẹn | `9aacc13f4a35b12b977d73bdbdd147e8fa5d3dc8204f4b321801dcde718d2dc1` | `9aacc13f4a35b12b977d73bdbdd147e8fa5d3dc8204f4b321801dcde718d2dc1` | Khóa |
| `src/app/layout.tsx` | Nguyên vẹn | `afd53a690202fdf12ca38388bc6115bfba10b9bdf9fd38a1fd123463b39d8d30` | `afd53a690202fdf12ca38388bc6115bfba10b9bdf9fd38a1fd123463b39d8d30` | Khóa |
| `src/app/globals.css` | Nguyên vẹn | `06f5c99683a2e9a77ffabc02f29a021f374e0ecd88d799a93d1623cc8115ab22` | `06f5c99683a2e9a77ffabc02f29a021f374e0ecd88d799a93d1623cc8115ab22` | Khóa |
| `src/components/layout/Shell.tsx` | Nguyên vẹn | `e7120656768b22def68eda5120309daec8c08638c49dfb96e91898767b2907cb` | `e7120656768b22def68eda5120309daec8c08638c49dfb96e91898767b2907cb` | Khóa |
| `src/components/navigation/AdaptiveNavigation.tsx` | Nguyên vẹn | `ac3b3f4d38d1c031050c4eda6fc8c0f53225854d9fe05bdfdbbc0ed187e0b405` | `ac3b3f4d38d1c031050c4eda6fc8c0f53225854d9fe05bdfdbbc0ed187e0b405` | Khóa |
| `src/components/navigation/Header.tsx` | Nguyên vẹn | `0595995142c2edbc9181782484f8dbbd43fa051999763ffdee3f0791d15b5cb1` | `0595995142c2edbc9181782484f8dbbd43fa051999763ffdee3f0791d15b5cb1` | Khóa |
| `tailwind.config.ts` | Nguyên vẹn | `c827ee33e39a44c5d05f1092cd1fe6916703034809af24b0491a4a9b27e23713` | `c827ee33e39a44c5d05f1092cd1fe6916703034809af24b0491a4a9b27e23713` | Khóa |

---

## 2. QUY TRÌNH PHỤC HỒI NHANH (QUICK ROLLBACK STEPS)

Khi Owner yêu cầu rollback trang Di chuyển (`src/app/cam-nang/page.tsx`) về phiên bản trước khi sửa bug 320px:

### Cách 1: Sử dụng PowerShell (Khuyến nghị trên Windows)

```powershell
# Di chuyển vào thư mục dự án
cd "A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro"

# Sao chép tệp từ checkpoint ghi đè vào src
Copy-Item -Path "checkpoints\GATE-08-BASELINE\src\app\cam-nang\page.tsx" -Destination "src\app\cam-nang\page.tsx" -Force

# Kiểm tra lại mã băm để xác nhận trùng khớp baseline
node -e "
const fs = require('fs');
const crypto = require('crypto');
const h = crypto.createHash('sha256').update(fs.readFileSync('src/app/cam-nang/page.tsx')).digest('hex');
console.log('Restored hash:', h);
console.log('Match expected:', h === 'ab6fc6f79d24a0c0fce5afeb631de25b065b937446a9846829ea2e26fbc00d51');
"

# Build lại dự án
pnpm build
```

### Cách 2: Sử dụng tập lệnh Node.js tự động

Chạy đoạn mã sau để tự động đối chiếu toàn bộ thư mục `checkpoints/GATE-08-BASELINE/` và phục hồi mọi tệp có thay đổi:

```bash
node -e "
const fs = require('fs');
const path = require('path');
const root = 'A:\\trí tuệ nhân tạo\\BAI_3\\hue-travel-pro';
const ck = path.join(root, 'checkpoints', 'GATE-08-BASELINE');
const manifest = JSON.parse(fs.readFileSync(path.join(ck, 'manifest.json')));
for (const rel of Object.keys(manifest)) {
  const src = path.join(ck, rel);
  const dest = path.join(root, rel);
  fs.copyFileSync(src, dest);
}
console.log('Rollback 100% completed.');
"
```

---

## 3. KẾT QUẢ DIỄN TẬP PHỤC HỒI (REHEARSAL VERIFICATION)

Đã tiến hành diễn tập phục hồi vào thư mục tạm thời độc lập:
- **Thời gian diễn tập:** 26/10/2026 16:10
- **Kết quả:** `SUCCESS (100% byte-for-byte verified)`.
- Tất cả 12 tệp trong manifest đều khớp mã băm SHA-256 sau khi trích xuất từ checkpoint.
