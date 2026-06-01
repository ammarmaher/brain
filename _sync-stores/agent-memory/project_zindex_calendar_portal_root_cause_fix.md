---
name: Z-Index + Calendar Portal Root Cause Fix
description: 2026-05-16 root-cause fixes for body-portal z-index ladder, popover positioning race, and password-wrapper BEM-survivor — applies to ALL Falcon body-portaled overlays
type: project
originSessionId: bbadfbdd-1924-4e27-bfb5-ce8247d07402
---
**🟢 LANDED (2026-05-16)** Three distinct root-cause fixes after recurring "I cannot see the input button" / "calendar opens top-right or top-left" reports. Previous sessions had patched symptoms; this pass fixed at source.

**Why:** Z-index issues and calendar mis-positioning kept reappearing because they were patched per-component instead of fixed in the SSOT token ladder + the shared portal util.

**How to apply:**

1. **Body-portaled overlay z-index ladder (canonical)** — in `libs/falcon-ui-tokens/src/components/overlay.tokens.css`:
   - Surface chrome 1–60
   - Local panels (inline dropdown / multi-select / date-picker) 100–200
   - Menu / Tooltip 1100
   - Dialog / Drawer 1200
   - Toast 1300
   - **Body-portaled overlay 1400** (was 1000 — the bug)
   Never invent a new z-index. If a popover needs to be above a drawer, it MUST be portaled to body and inherit `--falcon-overlay-z-index`.

2. **Popover-portal positioning rule** — `libs/falcon-ui-core/src/utils/popover-portal.ts`:
   - NEVER early-return on zero-rect anchor — that lets the popover's own utility classes (`top-full start-0`) win after portal.
   - On zero-rect: park off-screen at `(-9999,-9999)` with `!important` inline writes, schedule one rAF retry to re-measure.
   - Inline `top/left` must always win over the popover's class-based positioning.
   - **RTL rule (2026-05-16 pass 2):** NEVER write both physical (`left`/`right`) AND logical (`inset-inline-start`/`inset-inline-end`) properties together. Logical resolves to physical at computed time; equal `!important` falls back to declaration order, so logical writes override the physical writes that came before. In RTL this produces `left: auto; right: rect.left` → popover lands at top-right/top-left of viewport, unrelated to trigger. Fix: resolve `direction` from `getComputedStyle(anchor)`, neutralize both logical insets to `auto !important` ONCE early, then branch — LTR writes `left: rect.left; right: auto`, RTL writes `right: viewportW - rect.right; left: auto`.

3. **Angular wrapper anti-pattern** — `libs/falcon-ui-core/src/angular-wrapper/components/falcon-password/` was the lone hand-rolled BEM template wrapper. Fixed to use the standard tag-switcher pattern. Rule: **every Angular wrapper delegates to its Stencil `-tw` (Tailwind) / Shadow component**. No wrapper renders its own BEM markup. No wrapper imports `pi` PrimeIcons classes (purged 2026-05-10) — use `falcon-icon` base class only.

4. **Beneficiaries of the portal + token fix (no extra work needed):**
   - `<falcon-angular-date-picker>` — popover positions correctly even on first-frame race; opens above drawer
   - `<falcon-angular-dropdown>`
   - `<falcon-angular-multi-select>`
   - `<falcon-angular-phone-field>` (country picker)
   Any future popover that adopts `popover-portal` + `--falcon-overlay-z-index` is fixed automatically.

5. **Diagnostic checklist when "popup is hidden / mis-positioned" recurs:**
   - Is it body-portaled? If yes, check `--falcon-overlay-z-index` value vs the parent surface (drawer/dialog).
   - Is `getBoundingClientRect()` returning zero on first open? Check for `transform`/`position:absolute` on a structurally-projected ancestor (e.g. `falcon-data-table-cell.directive.ts:135`).
   - Are utility classes leaking? Inline writes must use `!important` when the popover has Tailwind positioning classes.
   - **Is it only inside a shadow row?** → see rule 6 below.

6. **Shadow-row lifecycle race (2026-05-16 pass 3 — THE actual bug behind the recurring "top-left/top-right" reports):** if the popover only mis-positions inside a `<falcon-data-table>` shadow row, the cause is a same-task lifecycle race in `componentDidRender` of `<falcon-table-tw>`:
   - `falcon-table-tw.tsx:562` emits `falconShadowCellsMounted` SYNCHRONOUSLY → Angular handler calls `mountOrReuseShadowView` → `view.detectChanges()` → `*falconDataTableShadowCol` directive `ngOnInit` writes `left: var(--shadow-col-{key}-left, 0px)` on the projected node.
   - `falcon-table-tw.tsx:573` only THEN calls `updateShadowArrowPositions` which publishes the var.
   - The directive READS the var BEFORE the table PUBLISHES it. The `0px` fallback wins. Projected node sits at `left: 0` for the next layout. Trigger inside has `rect.left ≈ 0`. Popover lands at top-left (LTR) / top-right (RTL because `right = viewportW - rect.right ≈ viewportW`).
   - **Two-layer fix:**
     - **(A) Source-of-truth** — extract `publishShadowColumnVars()` in `falcon-table-tw.tsx`; call it BEFORE the emit AND retain the call inside `updateShadowArrowPositions`. Directive `ngOnInit` then reads a real value.
     - **(B) Defensive belt** — `popover-portal.ts`: bounded rAF stability re-check at the end of `positionPopoverFixed`. Re-measure next frame; if rect moved >0.5px, re-apply position. Cap = 2 retries. Threads `retryDepth` through the existing zero-rect bounce so they don't fight. Plus `window.__FALCON_DEBUG_POPOVER__` flag for live diagnosis (no-op by default).
   - This is why outside shadow rows the popover worked — only the data-table directive reads a not-yet-published var.

**Files modified (pass 3, 2026-05-16):**
- `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx` — `publishShadowColumnVars()` extracted + call moved before emit
- `libs/falcon-ui-core/src/utils/popover-portal.ts` — bounded rAF stability re-check + debug flag

**Files modified across all 3 passes:**
- `libs/falcon-ui-tokens/src/components/overlay.tokens.css` (pass 1)
- `libs/falcon-ui-tokens/src/components/toast.tokens.css` (pass 1)
- `libs/falcon-ui-core/src/utils/popover-portal.ts` (pass 1 + 2 + 3)
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-password/{falcon-password.component.html,falcon-password.component.ts,index.ts}` (pass 1)
- `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx` (pass 3)

**Builds GREEN (pass 3 with `--skip-nx-cache`):** falcon-ui-core, host-shell (`419805aaa14f7574`), admin-console (`0f7fd55787c7ec29`), management-console (`70988df8ac920aaa`).

**Live debug flag:** `window.__FALCON_DEBUG_POPOVER__ = true` in DevTools console — next popover open dumps anchor rect + ancestor chain with transform/position/left at each level. Set `delete window.__FALCON_DEBUG_POPOVER__` to silence.

**No commits, no push** — working tree dirty until user says "commit" / "push".
