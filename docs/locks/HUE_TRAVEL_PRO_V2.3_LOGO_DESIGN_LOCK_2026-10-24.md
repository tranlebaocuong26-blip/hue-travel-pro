# HUẾ TRAVEL PRO V2.3 — LOGO DESIGN LOCK

**Owner decision date:** 2026-10-24 (Asia/Bangkok)
**Decision:** APPROVED — LOGO VISUAL DESIGN LOCK
**Scope:** Brand logo only; not a sign-off of the entire homepage, navigation runtime, or remaining UI issues.

## Approved visual reference
- The current lotus-outline brand mark shown in the Owner's latest homepage screenshot, in delicate pale pink on deep-violet background.
- Wordmark: **HUẾ** and **TRAVEL PRO**, arranged as shown in the approved screenshot.
- The previous filled lotus inside a purple square is rejected.
- Owner confirms having checked the new logo on mobile. Desktop appearance has been visually reviewed from the supplied screenshot.

## Lock conditions
- Preserve the exact approved icon silhouette, color treatment, wordmark wording, sizing/spacing and overall logo lockup currently accepted by Owner.
- Do not redesign, recolor, substitute, regenerate, swap assets, or alter the logo across layouts without a new explicit Owner exception.
- Preserve four navigation destinations and Hero-to-Sidebar behavior.
- Preserve existing travel data, mock data and database.
- Logo acceptance does not grant permission to edit other frozen artifacts or proceed to Phase 2.

## Handover action for Codex (administrative, not design change)
1. Read AGENTS.md and this Owner decision.
2. Record the exact currently used logo asset path(s) and component path(s), source revision identifiers if available, and SHA-256 hashes for applicable local logo files. **Do not invent paths or hashes.**
3. Add this decision to the project's approved decisions / LOCK register if authorized to edit governance documents, and append a `LOGO LOCKED — OWNER APPROVED` note to AGENTS.md without changing its other policies.
4. Create a Markdown confirmation report in `reports/codex/` with the paths, hashes, desktop/mobile check evidence available, and a no-source-modification declaration.
5. Do not modify app source, assets, CSS, navigation, data or database as part of this administrative lock record.
6. Stop after reporting; wait for the Owner before subsequent implementation.

**Rule:** PASS = LOCK — FIX ONLY WHAT FAILED — NO SCOPE CREEP.

## Technical registration — 2026-10-24 (Asia/Saigon)

**LOGO DESIGN — OWNER APPROVED / LOCKED (2026-10-24).** Administrative registration of the existing approved design; no application or asset edits performed. The original Owner decision above is preserved. Asia/Saigon and the original Asia/Bangkok date label both use UTC+07:00 on this decision date.

### Asset / source identity

Project root: `A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro`.

| File relative to root | Role | SHA-256 at registration |
|---|---|---|
| `public/images/brand/owner-lotus.png` | Active lotus-outline icon; source URL `/images/brand/owner-lotus.png` | `6E53DD205EDE658EBCAEBAED45632A1E5613C8D01E141B22172F597EB6112B9D` |
| `hoa sen.png` | Original Owner file, byte-identical to public copy | `6E53DD205EDE658EBCAEBAED45632A1E5613C8D01E141B22172F597EB6112B9D` |
| `src/components/navigation/AdaptiveNavigation.tsx` | Active logo renderer and adjacent DOM wordmark; entire-file hash for provenance only | `FDB4D916AB82AA2D7AF33A829B7917ABE16D484E46B49BA7C65F19DCAA349D5A` |
| `src/app/fonts/GeistVF.woff` | Declared local sans font inherited by wordmark, with fallback stack | `296FAFAFD41304F7C992079054B8AF914DBBD865F32DE97C66D0F613B55755D6` |
| `src/app/layout.tsx` | `localFont` variable and body font-sans declaration; provenance only | `1E9456DFF453135BE2872B1FE614D5A8D37AB17AD86D543E387C7EB60ECA7DF9` |
| `tailwind.config.ts` | Declared sans family chain; provenance only | `D004D059322F844A8E1AB882520597FDE1272A65798643ACCA3B2A99CD402B4F` |

No Git repository was found at the project root; no commit/revision is claimed. SHA-256 identifies the local files observed at registration, not a historical file version that was not retained.

### Precisely bounded visual code regions

Active wiring: `src/components/layout/Shell.tsx:5,31` imports/renders AdaptiveNavigation. All three icon nodes use Next Image, not inline lotus SVG. Wordmark `HUẾ` / `Travel Pro` is DOM text, with uppercase styling on the second line.

The following region hashes use UTF-8 bytes of the specified inclusive lines joined with **LF, without a trailing LF**, as read by Get-Content. They identify the visual blocks separately from the rest of navigation logic. Line numbers may move after authorized unrelated edits; locate by the asset URL, wordmark and region label as well.

| Region in AdaptiveNavigation.tsx | Visual bounds | Region SHA-256 |
|---|---|---|
| Sidebar logo and wordmark | lines164–181 | `39D123F4EFEAADD031F69844BCF140A81F0F18CCE3CC9B7DBB930B2DC2D6D012` |
| Home desktop logo and wordmark | lines245–262 | `AE042E8F3C89FFCE7804771A18CEDD4CAA6F3D5ECA3A19AE99CB60C843F8EFAE` |
| Home mobile logo and wordmark | lines291–308 | `062997ABF68639AAEBEAD8880E3E7B2CFC68653E3C1A08EABFF6175E06EF3A69` |

### Appearance frozen at LOCK

- Sidebar: image44×44px, w-11/h-11, shrink-0, object-contain; brand gap-3. HUẾ: text-lg/font-bold/tracking-wider/leading-tight/text-dark-ink. Travel Pro: text10px/font-semibold/tracking-widest/leading-none/uppercase/text-gray-500.
- Home desktop: image40×40px, w-10/h-10, shrink-0, object-contain; gap-3. HUẾ: text-lg/font-bold/tracking-wider/leading-tight/text-white. Travel Pro: text10px/font-semibold/tracking-widest/leading-none/uppercase/text-white/80.
- Home mobile: image36×36px, w-9/h-9, shrink-0, object-contain; gap-2.5. HUẾ: text-base/font-bold/tracking-wider/leading-tight/text-white. Travel Pro: text9px/font-semibold/tracking-widest/leading-none/uppercase/text-white/80.
- At the existing default root16px, text-lg is18px, text-base16px, gap-3 is12px and gap-2.5 is10px. Preserve the existing responsive sizing; do not replace it with one arbitrary size for all contexts.
- Wordmark inherits font-sans: local Geist variable from layout.tsx:7–10,25, then Tailwind's Segoe UI/Roboto/Arial/sans-serif chain at tailwind.config.ts:27–29. This documents the configured font treatment; it does **not** certify actual per-glyph rendered font or close the separate typography diagnosis.
- Icon color/shape are intrinsic to the exact PNG; no CSS recoloring/filter or purple square background in these current logo blocks. Preserve aspect ratio, color, proportions and visual relationship to the wordmark. No resizing, font/weight/tracking/case changes, spacing changes or asset substitution without fresh explicit Owner approval.

### Scope boundary and evidence

This freezes **logo design**, not the entire AdaptiveNavigation implementation or global font/layout configuration. Full-file checksums are provenance references. An unrelated authorized navigation edit may change a full-file hash while the logo remains unchanged; compare the bounded regions and approved appearance. This registration grants no additional implementation rights.

Applies to `/`, `/ve-hue`, `/kham-pha`, `/cam-nang`, `/luu-tru` wherever the existing brand slot is displayed. Mobile subpages currently have no brand slot; keep their existing navigation structure. `src/components/navigation/Header.tsx` contains an older SVG but is not imported by the current Shell and was not selected as the approved renderer.

Prior rollout evidence, explicitly historical (not new screenshots from registration): [logo rollout report](../../reports/codex/GATE-07-01-LOGO-ROLLOUT-LOCK-REPORT.md), [sidebar crop](../../reports/codex/evidence/GATE-07-01-LOGO-ROLLOUT-20261024/approved-sidebar-logo.png), [Home mobile](../../reports/codex/evidence/GATE-07-01-LOGO-ROLLOUT-20261024/home-mobile.png). Owner approval is recorded in the decision above; this administrative action does not invent a new visual acceptance.

**LOGO LOCKED — OWNER APPROVED. STOP — AWAIT OWNER REVIEW.**
