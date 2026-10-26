# HUẾ TRAVEL PRO V2.3 — GATE 07-04 ROLLBACK RUNBOOK
## Emergency & Standard Rollback Procedure for Gate 07-04 Changes

- **Target:** Rollback all Gate 07-04 modifications to pre-implementation checkpoint.
- **Checkpoint Location:** `A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro\reports\gravity\evidence\GATE-07-04\checkpoint-before\`
- **Production Safety:** Zero data loss, zero dangling processes.

---

### 1. Affected Files in Gate 07-04

1. `src/app/page.tsx`
2. `src/components/navigation/AdaptiveNavigation.tsx`
3. `src/components/layout/Shell.tsx`
4. `public/images/cards/card_di_tich.png`
5. `public/images/cards/card_van_hoa.png`
6. `public/images/cards/card_am_thuc.png`

---

### 2. Step-by-Step Rollback Execution

#### Step 1: Terminate Node/Next.js Running Tasks
```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

#### Step 2: Restore Source Code Files from Checkpoint
```powershell
Copy-Item "A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro\reports\gravity\evidence\GATE-07-04\checkpoint-before\page.tsx" -Destination "A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro\src\app\page.tsx" -Force
Copy-Item "A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro\reports\gravity\evidence\GATE-07-04\checkpoint-before\AdaptiveNavigation.tsx" -Destination "A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro\src\components\navigation\AdaptiveNavigation.tsx" -Force
Copy-Item "A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro\reports\gravity\evidence\GATE-07-04\checkpoint-before\Shell.tsx" -Destination "A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro\src\components\layout\Shell.tsx" -Force
```

#### Step 3: Verify Integrity & Rebuild
```powershell
cd "A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro"
pnpm exec tsc --noEmit --incremental false
pnpm lint
pnpm build
```

#### Step 4: Restart Production Server
```powershell
pnpm start
```
