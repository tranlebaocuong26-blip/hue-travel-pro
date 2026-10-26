# AGENTS.md — HUẾ TRAVEL PRO V2.3

> **Owner-controlled instructions for coding agents (including Codex).**
> Project root (Windows): `A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro`
> Project mode: **STUDENT PROJECT — DEMO FIRST**.
> Operating rule: **PASS = LOCK — FIX ONLY WHAT FAILED — NO SCOPE CREEP.**

## 1. Role and authority

You are an implementation and QA assistant, **not** the project Owner. Read and follow this file before any task. An agent prompt is not permission to expand scope, overwrite Owner decisions, modify locked files, deploy, or change data. When instructions conflict, follow the most recent **explicit Owner authorization** and report the conflict. Never infer authorization from the existence of this file, from a prior planning document, or from a report saying `PASS`.

**Current authorized task as of 2026-10-24:** `GATE 07-01 / PHASE 1B — RUNTIME VISUAL DIAGNOSIS`, **READ-ONLY**. Diagnose the homepage desktop viewport overflow, clipped bottom card dock, and stray text in the bottom-left of the Owner's screenshot. **No source-code edits are currently authorized by this task.** Earlier Phase 1 homepage edits were performed and are awaiting Owner visual acceptance; prior permissions are **not blanket ongoing permission**.

If the Owner later explicitly authorizes implementation, follow only the named files, operations, and phase in that new instruction. Do not silently unlock all files.

## 2. Product and locked UX decisions

- Project: **HUẾ TRAVEL PRO V2.3 — “Huế có chi hay?”**, self-guided Huế travel guide.
- Stack: Next.js 14 App Router, React 18, TypeScript strict, pnpm, Tailwind; Supabase/PostgreSQL/Prisma exist but are **outside UI restoration scope**.
- Four current top-level destinations: **Về Huế** (`/ve-hue`), **Khám Phá** (`/kham-pha`), **Cẩm Nang** (`/cam-nang`), **Lưu Trú** (`/luu-tru`); Home is `/`.
- **Keep the current navigation concept** and Hero-to-Sidebar/Sidebar-to-Hero behavior, route paths, existing card URLs, mobile drawer/bottom navigation, and functional search/filter logic. Do not resurrect older mockup navigation labels.
- Design references: `01_TRANG_CHU.png`, `02_VE_HUE.png`, `03_KHAM_PHA.png`, `04_CAM_NANG.png`, `05_LUU_TRU.png` in the Owner's approved mockup set. Search for the actual files; **do not assume a path**. If missing, report `REFERENCE NOT FOUND`.
- Palette references: Lavender `#C2C6FA`, Deep Violet `#4D3087`, Soft Purple `#9075F4`, Electric Lime `#CAFA35`, Off-white `#FAFAFC`, Dark Ink `#251C39`.
- The **original Owner-provided lotus icon** (delicate line-work, alongside `HUẾ / TRAVEL PRO`) is the logo reference. A separately generated pink AI lotus is **NOT approved**. Existing purple square icon on the website is not the desired final logo. **Do not replace or reconstruct the logo without separate Owner visual approval.** Beware that a previous Gravity report claimed 100% logo matching without supplying sufficient visual evidence.
- Approved visual restoration scope: **P0/P1 only**; comprehensive font audit, expansion of Huế locations, and other P2/P3 work are **deferred**.

## 3. Data and security invariants — do not modify

- Keep local content at **6 places, 6 rentals, 8 accommodations**. This dataset is currently frozen; research into future additions is separate and requires Owner approval.
- Never change `src/data/places.ts`, `src/data/rentals.ts`, `src/data/accommodations.ts`, `src/types/content.ts`, `src/lib/search.ts`, Prisma schema/migrations, Supabase data/RLS, authentication/JWT, or seeds unless individually approved by Owner.
- Established SHA-256 hashes for frozen local data:
  - `src/data/places.ts`: `3F7061E7F89EFB7A4742F3E0D3B443C6AD76944A9C93613B2382549179CD3C39`
  - `src/data/rentals.ts`: `FB3DD93B1C95C2CA62B033DD10A50AB5EEFCDB9956622EA667362032AF395E27`
  - `src/data/accommodations.ts`: `B960142F3C50117D937200A7854DE0DB44BC6404FF35F6C9ADE84158994C85BA`
- Mockups are **visual references, not a data contract**. Never import fictional visitor counts, prices, ratings, hotel/restaurant names, weather readings, positions or phone numbers from mockups.
- No fake map pins, GPS coordinates, routes, rental policies, booking claims, or video/play buttons with no functional content. If an approved design requires missing assets/data, report `NEEDS ASSET`, `NEEDS DATA`, or `DEFERRED`.
- Do not log, expose, print, or commit tokens, credentials, `.env` contents, or personal information.

## 4. Gate status and modification control

- **GATE 00–06:** previously locked, preserve as-is. GATE 06 database locked; Auth/JWT subtask D06-02 not fully tested.
- **GATE 07-00C:** UI Fidelity Audit accepted as a planning/audit basis, **not** a pass for visual fidelity.
- **GATE 07-01 Restoration Plan:** P0/P1 accepted conditionally. **Only Phase 1 homepage implementation was separately authorized and then executed**; screenshots revealed unresolved visual defects, so **Phase 1 visual review is FAILED/PENDING REWORK**. Phase 2 and Phase 3 have **no implementation authorization**.
- **GATE 07-00B:** automated smoke tests reportedly 54/54 PASS, but they do **not** prove visual correctness or mobile interaction. The Owner's manual inspection found exceptions.
- `OD-FID-01=reference` (original logo), `OD-FID-02=core` (P0/P1), `OD-FID-03=later` (no blanket unlock).
- Earlier Phase 1 exceptions named only `src/app/page.tsx` and `src/components/layout/Shell.tsx` for a completed scoped implementation. **Do not treat these as currently authorized for further edits** without fresh Owner approval.
- All other frontend components, including `src/components/navigation/AdaptiveNavigation.tsx`, `src/components/navigation/Header.tsx`, and the four subpage `page.tsx` files, remain outside Phase 1B editing rights.

## 5. CURRENT TASK — Phase 1B, READ-ONLY visual diagnosis

Use the already running app at `http://localhost:3000/` when accessible (start a dev server only if needed and explicitly permitted by the host environment). Read source, inspect browser if supported, and distinguish **browser verified**, **DOM only**, **static analysis**, and **not tested**.

Investigate:
1. At desktop viewports `1366×768`, `1440×900` and, if possible, `1649×786`: Why does the homepage require vertical scrolling despite the intended one-screen landing? Measure actual viewport, `scrollHeight/clientHeight`, hero and dock bounding boxes, computed `height`, `min-height`, margins, padding, positioning and overflow.
2. Why are the **three bottom dock cards** partially below the visible viewport, cut or visually crowded? Identify precise selector/file and explain minimal correction; **do not hide content using `overflow: hidden`**.
3. Why is faint stray text visible to the bottom-left of the dock? Investigate duplicated content, stacking contexts, overflow and transforms. Report `NOT REPRODUCED` if unverified.
4. Inspect mobile around `390×844` for overflow and navigation integrity. Do not force desktop one-screen layout onto mobile.
5. If browser interaction is available, actually click Home → a subpage → Home and the homepage cards. Do not infer interaction success from HTTP status 200.
6. The previously observed Next.js dev badge `1 error` requires its real console/error text. Never claim it is harmless or production-fixed solely because the indicator is dev-only.
7. Search behavior: `q=dai noi` with `category=all` should find Đại Nội; with `category=camping` the conjunction may return none. Verify both conditions before declaring pass/fail; do not alter search behavior in Phase 1B.

**Deliverable:** concise `GATE-07-01-PHASE1B-RUNTIME-VISUAL-DIAGNOSIS` findings in chat or a report requested by Owner, with root cause, evidence, affected source file/line, proposed minimal fix, regression risk, and unverified items. Report actual screenshots or `NOT CAPTURED`; no fabricated screenshots or numeric fidelity percentage. End with **STOP — AWAIT OWNER REVIEW**.

## 6. Implementation protocol for future Owner-approved work

For any **subsequently authorized** coding task:

1. Read explicit Owner grant: phase, exact file allowlist and permitted change types. If absent, **READ ONLY**.
2. Run `git status`/`git diff` and inspect existing user changes; never reset, overwrite or discard uncommitted changes. If no Git repository, explain and use a safe checkpoint procedure approved by Owner.
3. Make the smallest diff, preserve routes, data and navigation; no unrelated refactors.
4. Do not install packages, run migrations, seed databases, alter network/security settings, push/commit, or deploy unless separately authorized.
5. Validate with available typecheck/lint/tests; test browser visuals at desktop and mobile when tools allow; report any tool limitations honestly.
6. Provide exact changed-file list, diff summary, before/after comparison, screenshots when available, regression results and remaining issues. **Never claim 100% visual match from DOM probes alone.**
7. Stop after the authorized phase; wait for Owner's visual acceptance before progressing.

## 7. Approval and response convention

- `APPROVED` means only what the Owner explicitly approved, never the next gate by implication.
- Label findings: `VERIFIED`, `LIKELY`, or `NOT VERIFIED`.
- Use status markers: `PASS`, `FAIL`, `DEFERRED`, `NEEDS ASSET`, `NEEDS DATA`, `NOT TESTED` and `REQUIRES OWNER EXCEPTION` accurately.
- A prompt requesting inspection/plan/report is **not** authorization to modify code.
- Be concise, clear, in **Vietnamese**; avoid unnecessary paperwork for this student demo.

## 8. CODEX MANDATORY TASK REPORTING PROTOCOL

Owner authorization dated 2026-10-24. This protocol applies permanently to every subsequent Codex task and supersedes the chat-only deliverable option in section 5. All existing Owner decisions, LOCKED scope, and implementation approval requirements remain in force.

1. Sau mỗi nhiệm vụ được giao, BẮT BUỘC tạo một file báo cáo Markdown `.md`.
2. Lưu báo cáo trong thư mục `reports/codex/` của dự án.
3. Nếu thư mục chưa tồn tại, được phép tạo thư mục phục vụ lưu báo cáo.
4. Tên file theo dạng `[GATE-ID]-[TASK-NAME]-REPORT.md`; sử dụng tên duy nhất, không ghi đè báo cáo cũ. Nếu trùng tên, thêm hậu tố duy nhất vào TASK-NAME. Tên cụ thể do Owner chỉ định có ưu tiên cao hơn mẫu mặc định; vẫn không được ghi đè báo cáo cũ.
5. Báo cáo phải hoàn chỉnh, có thể đọc độc lập và đủ bằng chứng để Owner chuyển cho ChatGPT nghiệm thu.
6. Không được chỉ báo cáo trong khung chat mà quên tạo file.
7. Sau khi lưu và kiểm tra thành công, trả về đường dẫn tuyệt đối của file để Owner dễ tìm và tải lên ChatGPT.
8. Khi nhiệm vụ READ-ONLY, không được sửa mã nguồn. Tạo báo cáo và lưu evidence là ngoại lệ tài liệu. Lệnh Owner ngày 2026-10-24 cho phép bổ sung mục quy trình này vào AGENTS.md; không phải quyền sửa AGENTS.md tùy ý trong các nhiệm vụ sau.
9. Không tự động bắt đầu nhiệm vụ tiếp theo sau khi xuất báo cáo.
10. Nếu việc tạo file thất bại, phải thông báo rõ và cung cấp toàn bộ nội dung báo cáo trong chat, không tuyên bố đã lưu thành công.

### Cấu trúc bắt buộc của mỗi báo cáo

- Project / Gate / Task ID.
- Ngày thực hiện.
- Phạm vi Owner cấp phép.
- Executive Summary.
- Công việc đã thực hiện.
- Kết quả kiểm tra và bằng chứng.
- Root Cause nếu có lỗi.
- Danh sách file thay đổi và phạm vi diff; hoặc tuyên bố READ-ONLY / NO SOURCE MODIFICATION.
- Kết quả Typecheck, Build, Runtime Tests và Visual Tests (ghi rõ PASS / FAIL / NOT TESTED).
- Những vấn đề chưa giải quyết.
- Đề xuất bước tiếp theo.
- Trạng thái nghiệm thu đề xuất.
- HARD STOP — AWAIT OWNER REVIEW.

Không khai báo PASS nếu không có bằng chứng. Không coi HTTP 200 là bằng chứng giao diện hoạt động chính xác. Không tự tuyên bố Owner đã nghiệm thu. Phân biệt VERIFIED / LIKELY / NOT VERIFIED và nêu giới hạn bằng chứng. Nếu có screenshot thực tế, lưu bản sao tại `reports/codex/evidence/` và liên kết bằng đường dẫn tương đối trong báo cáo; không sửa asset hiện có để tạo bằng chứng.
