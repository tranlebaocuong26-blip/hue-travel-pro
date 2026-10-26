# GATE 07-03B Preflight — 2026-10-25

No Git repository. No git init/reset/checkout. Current on-disk files checkpointed; unsaved editor buffers cannot be inspected.

Planned existing files:
- src/app/layout.tsx
- tailwind.config.ts
- src/components/navigation/AdaptiveNavigation.tsx
- src/app/ve-hue/page.tsx
- src/app/kham-pha/page.tsx
- src/app/cam-nang/page.tsx
- src/app/luu-tru/page.tsx

Planned new files:
- src/app/fonts/BeVietnamPro-Regular.ttf
- src/app/fonts/BeVietnamPro-Medium.ttf
- src/app/fonts/BeVietnamPro-SemiBold.ttf
- src/app/fonts/BeVietnamPro-Bold.ttf
- src/app/fonts/BeVietnamPro-Italic.ttf
- src/app/fonts/NotoSerif-VF.ttf
- src/app/fonts/BeVietnamPro-OFL.txt
- src/app/fonts/NotoSerif-OFL.txt

All seven backups copied into isolated restore-rehearsal and verified byte-identical. No real rollback performed. Six font inputs match 07-03A hashes. No source modification before this checkpoint.

Strategy: retain original Geist --font-sans registration and existing sans/serif tokens; add UI/editorial/brand tokens. Pin three existing wordmark wrappers to brand. Apply UI first to navigation, verify, then body. Replace only existing font-serif classes in four main subpages with editorial token; keep Home display inline fonts. Preserve T05/T07/A01 handlers/markup and assets.
