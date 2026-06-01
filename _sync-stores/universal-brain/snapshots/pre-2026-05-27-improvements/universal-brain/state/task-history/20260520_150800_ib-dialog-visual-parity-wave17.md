# IB Dialog Visual Parity — Wave 17 (2026-05-20)

**Task:** Align `<falcon-angular-insufficient-balance-dialog>` (do-payment priority popup) to the canonical OLD-UI reference shown in Ammar's screenshot.
**Owner:** claude
**Outcome:** 🟢 BUILD-GREEN. Not yet runtime-verified — Ammar to verify visually.

## What changed

Four files in `Falcon/falcon-web-platform-ui/libs/`:

1. **`falcon-ui-tokens/src/components/insufficient-balance-dialog.tokens.css`** — token-contract bumps (panel 480→720, radius 16→18, padding 28→40, icon 56→64, title 18→17, subtitle 13→14, list-bg neutral-30→white, list-radius 12→14, list-padding 14→18, drag-label 12→15 + new 20px start-indent + 20px mb, row-height 42→52, row-gap 10→14, row-padding 12/10→14/14, row-radius 8→12, rank-width 18→44, rank-font 13→18, rank-weight 500→700, rank-color neutral-500→neutral-900, label 13→15, NEW `--falcon-ib-dialog-row-first-highlight-bg` (teal-50) + `--falcon-ib-dialog-row-first-highlight-border` (teal-700), btn-size 22→28, btn-bg neutral-100→white, NEW `--falcon-ib-dialog-btn-border` + `--falcon-ib-dialog-btn-border-hover`, btn-icon 12→14, info-pill all dimensions up, error-banner mirrors info-pill, footer-gap 10→16 / mt 16→20, footer-btn-padding 10/18→12/28, footer-btn-font 14→15, footer-btn-radius 8→10).

2. **`falcon-ui-core/src/components/falcon-insufficient-balance-dialog/falcon-insufficient-balance-dialog.css`** — Shadow DOM: drag-label reads new padding-inline-start + font-weight tokens; `.falcon-ib-dialog__li` outer gap reads `--falcon-ib-dialog-row-gap`; `.falcon-ib-dialog__rank` reads new font-weight token; NEW `:first-child .row:not(--dragging)` rule paints the first-row teal-tint highlight; `.falcon-ib-dialog__ctrl` gains outline border + hover border-color transition.

3. **`falcon-ui-core/src/components/falcon-insufficient-balance-dialog-tw/falcon-insufficient-balance-dialog-tw.tsx`** — Light/TW variant: `rowClasses()` first-row branch (teal-50 bg + teal-700 border); `ctrlClasses()` flipped to outline style; warning SVG 56→64; rank `w-[44px] text-[18px] font-bold neutral-900`; label `text-[15px]`; control icons 14; skeleton row `h-[52px] rounded-xl gap-[14px]`; main panel reads panel-radius / panel-padding-inline / panel-padding-block / panel-max-width tokens with new fallback defaults; header / drag-label / list-card (now WHITE) / info-pill / error-banner / footer / footer-buttons all rewritten to read tokens with new fallbacks.

4. **`falcon-ui-showcase-data/src/docs/insufficient-balance-dialog.md`** — token defaults table refreshed; 5 new tokens documented.

## Source-prefix evidence

Every numeric value traces to the OLD-UI reference at:
- `[CODE] Falcon/deprecated-falcon-web-platform-ui/apps/admin-console/src/app/shared/components/insufficient-balance-priority-dialog/insufficient-balance-priority-dialog.component.scss`
- `[CODE] …/insufficient-balance-priority-dialog.component.html` (structure)

Highlight colours canonicalised to `--color-falcon-teal-700` (#0d3f44) and `--color-falcon-teal-50` (#f3f8f5) from `[CODE] Falcon/falcon-web-platform-ui/libs/falcon-theme/src/falcon-tailwind-tokens.css:19-68` — the reference's exact `#0f6a55` is not a brand-palette colour, so we used the closest sibling token.

## Verification

| Step | Result |
|---|---|
| `nx run-many --target=build --projects=falcon-ui-tokens,falcon-ui-core --skip-nx-cache` | 🟢 GREEN, 46.5s, 0 errors. Pre-existing warnings on `falcon-toast`/`falcon-dialog`/`falcon-table` only — none on IB dialog. |
| `nx build admin-console --configuration=development --skip-nx-cache` | 🟢 GREEN, 14.8s, hash `b86cfba9adfc26c2`. Angular wrapper still types cleanly against the new tokens. |
| Browser preview | ⏸ Not run — requires backend stack + triggered IB flow. Ammar to verify. |

## Preserved (no regression)

- All 4 reorder mechanisms (drag handle + jump-up + step-up + step-down + jump-bottom) intact.
- Events `falcon-proceed` / `falcon-cancel` / `falcon-open-change` unchanged.
- Props API unchanged — no breaking change for existing consumers.
- Body-portal + z-index 1200 from prior Wave 16 (see [[ib-dialog-portal-to-body-2026-05-20]]).
- RTL footer flip preserved (`rtl:justify-start`).
- Glossy mode toggle preserved.

## Follow-up forks

- **a)** Reduce reorder controls from 4 → 2 buttons to exactly match the OLD-UI reference. Kept at 4 for backward compatibility — flip when ready.
- **b)** Bump panel padding from 40 → reference's exact 60/79/80 if larger whitespace is preferred.

Both are one-line token edits.

## Brain compliance

- No SCSS introduced ✅
- No PrimeNG introduced ✅
- No PrimeIcons introduced ✅
- No inline `style="…"` introduced ✅
- Tailwind-only ✅
- PES keys touched: 0
- Backend DTO drift: none

Related: [[ib-dialog-portal-to-body-2026-05-20]] [[visual-baseline-guardrail-2026-05-20]] [[falcon-ui-core-layout-traps]].
