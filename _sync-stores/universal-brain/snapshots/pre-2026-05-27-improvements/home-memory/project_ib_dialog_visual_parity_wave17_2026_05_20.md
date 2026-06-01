---
name: ib-dialog-visual-parity-wave17-2026-05-20
description: "IB dialog visual parity with OLD-UI reference — tokens, Shadow CSS, TW variant aligned to deprecated SCSS"
metadata: 
  node_type: memory
  type: project
  originSessionId: cbc5a10d-46a0-4e2f-9d8a-c53ea595e5dc
---

🟢 BUILD-GREEN 2026-05-20. `<falcon-angular-insufficient-balance-dialog>` (do-payment priority popup) visually aligned to the canonical OLD-UI reference shown in Ammar's screenshot. Reference source: `Falcon/deprecated-falcon-web-platform-ui/apps/admin-console/src/app/shared/components/insufficient-balance-priority-dialog/insufficient-balance-priority-dialog.component.scss`.

**Files touched (4):**

1. `libs/falcon-ui-tokens/src/components/insufficient-balance-dialog.tokens.css` — Wave 17 token bumps:
   - Panel: max-width 480 → **720px**, radius 16 → **18px**, padding 28 → **40px** symmetric
   - Icon: SVG 56 → **64px** (chip stays 72)
   - Title 18 → **17px**; subtitle 13 → **14px**, lh 1.5 → **1.45**, max-w 460 → **560px**, color neutral-600 → **neutral-700** (#5a6470)
   - List card: bg neutral-30 → **white**, radius 12 → **14px**, padding 14 → **18px**
   - Drag label: 12 → **15px**, weight 500 → **400**, dark, new **`--falcon-ib-dialog-drag-label-padding-inline-start: 20px`** so the label aligns past the rank column; margin-bottom 10 → **20px**
   - Row pill: height 42 → **52px**, gap 10 → **14px**, padding 12/10 → **14/14**, radius 8 → **12px**
   - Rank column: width 18 → **44px**, font 13 → **18px**, weight 500 → **700**, color neutral-500 → **neutral-900** (BIG / BOLD / DARK)
   - Row label: 13 → **15px**, color stays neutral-900
   - **NEW tokens**: `--falcon-ib-dialog-row-first-highlight-bg` (teal-50) + `--falcon-ib-dialog-row-first-highlight-border` (teal-700) → first row in the list gets the green-tint "top priority" treatment
   - Reorder buttons (jump-top / step-up / step-down / jump-bottom): size 22 → **28px**; flipped from solid-pill (neutral-100 bg, teal-500 hover) to **outline** (white bg + neutral-200 border + neutral-50 hover + neutral-400 hover-border); icon 12 → **14px**; **NEW tokens** `--falcon-ib-dialog-btn-border` + `--falcon-ib-dialog-btn-border-hover`
   - Info pill: font 12.5 → **14px**, padding 10/12 → **12/14**, radius 8 → **10px**, icon 14 → **18px**, gap 8 → **10px**
   - Error banner: same dimensional bumps as info pill
   - Footer: gap 10 → **16px**, mt 16 → **20px**; buttons padding 10/18 → **12/28**, font 14 → **15px**, radius 8 → **10px** (PrimeNG `p-button-lg` equivalent)

2. `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog/falcon-insufficient-balance-dialog.css` — Shadow DOM rules:
   - `.falcon-ib-dialog__drag-label` reads new `padding-inline-start` + `font-weight` tokens
   - `.falcon-ib-dialog__li` outer gap now reads `--falcon-ib-dialog-row-gap`
   - `.falcon-ib-dialog__rank` reads new `font-weight` token
   - **NEW rule**: `.falcon-ib-dialog__li:first-child .falcon-ib-dialog__row:not(.falcon-ib-dialog__row--dragging)` — applies the first-row highlight (skipped while that row is itself being dragged so the dashed-ghost wins)
   - `.falcon-ib-dialog__ctrl` gains outline border (`--falcon-ib-dialog-btn-border`) + hover border-color transition

3. `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog-tw/falcon-insufficient-balance-dialog-tw.tsx` — Light/TW variant rebuilt:
   - `rowClasses()` adds first-row branch (`isFirst && !isDragging`) → teal-tint bg + teal-700 border via the new highlight tokens
   - `ctrlClasses()` flipped to outline style — `bg-white border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-400`
   - Warning SVG width/height 56 → **64**
   - `renderRows()` rank `w-[18px] text-[13px] neutral-500 font-medium` → `w-[44px] text-[18px] neutral-900 font-bold`; label `text-[13px]` → `text-[15px]`; control icons 12 → 14
   - `renderSkeleton()` row height 42 → 52, rounded-lg → rounded-xl, gap 2.5 → 14px
   - Main panel `rounded-2xl px-7 py-7 max-w-[480px]` → token-driven `rounded-[var(--…-panel-radius,18px)] px-[var(--…-panel-padding-inline,40px)] py-[var(--…-panel-padding-block,40px)] max-w-[var(--…-panel-max-width,720px)]`
   - Header / drag-label / list card / info pill / error banner / footer all rewritten to read tokens with the new fallback defaults
   - List card bg `neutral-30` → **white**
   - Drag label now reads `padding-inline-start` token + `mb-5`
   - Info pill font 12.5 → 14, icon 14 → 18; same for error banner

4. `libs/falcon-ui-showcase-data/src/docs/insufficient-balance-dialog.md` — token defaults table refreshed to the new Wave 17 values + 5 new tokens documented.

**Functional behaviour preserved:** All 4 reorder mechanisms (drag handle + jump-up + step-up + step-down + jump-bottom) remain. Events `falcon-proceed` / `falcon-cancel` / `falcon-open-change` unchanged. Props unchanged. Body-portal from Wave 16 (see [[ib-dialog-portal-to-body-2026-05-20]]) and z-index 1200 from `--falcon-ib-dialog-backdrop-z` token preserved.

**Build evidence:**
- `nx run-many --target=build --projects=falcon-ui-tokens,falcon-ui-core` → **GREEN** (46.5s; 0 errors). Pre-existing `@Prop` reserved-name warnings on `falcon-toast`/`falcon-dialog`/`falcon-table` only — none on IB dialog.
- `nx build admin-console --configuration=development` → **GREEN** (14.8s; hash `b86cfba9adfc26c2`).

**Not yet runtime-verified.** Browser preview requires backend stack + a triggered insufficient-balance flow (Apps tab → click Pay on an unfunded service). Ammar to verify visually against the screenshot. If first-row highlight or 4-button column feels off, two known follow-up forks:
- a) Reduce reorder controls from 4 buttons (top/up/down/bottom) → 2 buttons (up/down) to exactly match the OLD-UI reference. Currently kept at 4 for backward compatibility with the shipped API.
- b) Panel padding: reference uses **60/79/80** (top/inline/bottom) — I chose 40px symmetric as a modern compromise. Bumping to the legacy values is a one-line token change if the larger whitespace is preferred.

**How to apply same pattern elsewhere:** for any Falcon dialog that needs visual parity with an OLD-UI reference, edit ONLY the per-component token file in `libs/falcon-ui-tokens/src/components/` — the Stencil + TW variants read every value via `var(--falcon-<dialog>-…)`. Structural additions (e.g. first-row highlight) need parallel edits in `.css` + `.tsx`. Always cite the OLD-UI source SCSS line range in the comment block. Do NOT inline hex values that already have a Falcon palette token — use teal-50/teal-700/neutral-200/etc. so dark-mode + theme overrides keep working.

Related: [[ib-dialog-portal-to-body-2026-05-20]] [[visual-baseline-guardrail-2026-05-20]] [[falcon-ui-core-layout-traps]] [[edit-price-due-payment-wallet-signalr-dossier-2026-05-19]].
