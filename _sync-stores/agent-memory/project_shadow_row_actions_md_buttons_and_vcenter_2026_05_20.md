---
name: shadow-row-actions-md-buttons-and-vcenter
description: Shadow-row Cancel/Save bumped to MD-sized buttons + the inline action zone vertical-centered against the cell — applied platform-wide via SoT tokens + Stencil class helpers (no per-page overrides). 2026-05-20.
metadata: 
  node_type: memory
  type: project
  originSessionId: 3258490b-c1c5-4802-8866-a139a4416d37
---

🟢 BUILD-GREEN 2026-05-20 (falcon-ui-tokens registry 3614 → 3620 / falcon-ui-core 40.30s / admin-console hash `5a62a48a492ec4df` 30.0s). User reported the service-pricing shadow-row Save + Cancel sat in a row ABOVE the input controls and looked too small (SM); they want them aligned on the SAME row as the inputs and at MD size, applied to EVERY shadow row platform-wide. See [[project_shadow_row_edit_price_layout_2026_05_19]] for the original shadow-row chrome.

**Why:** Two coupled root causes in the Stencil library (NOT scoped to service-pricing):

1. [CODE] `libs/falcon-ui-tokens/src/components/data-table.tokens.css:283` pinned `--falcon-data-table-shadow-actions-top: 12px` (2026-05-15 wave). Combined with the consumer's `h-16 items-center` form wrappers, the controls vertical-center inside a 64px-tall band → control mid-y ≈ 44px from cell top, while the buttons sat at 12-40px → buttons land in the LABEL band (above the controls), not the control band.

2. [CODE] `libs/falcon-ui-core/src/tailwind/table-tailwind-classes.ts:856,878` made Cancel + Save read `--falcon-data-table-action-btn-height: 1.75rem` (28px) and `--falcon-data-table-cell-font-size: 12.5px` — that's SM sizing (28×12.5) reused from row-action triggers. MD button tokens ([CODE] `button.tokens.css:48,66`) are 38px / 13px / radius 10 / padding-x 16.

**Fix — SoT, single mechanism, every shadow-row consumer inherits automatically:**

**3 files modified:**

- `libs/falcon-ui-tokens/src/components/data-table.tokens.css` — flipped `--falcon-data-table-shadow-actions-top: 12px → 50%` (with a fat comment explaining the prior wave's regression). Added **6 new tokens** for Cancel/Save MD sizing:
  ```
  --falcon-data-table-shadow-cancel-save-height:      var(--falcon-button-height-md, 38px);
  --falcon-data-table-shadow-cancel-save-min-width:   5.25rem;  /* 84px — fits "Cancel" @ 13px */
  --falcon-data-table-shadow-cancel-save-padding-x:   var(--falcon-button-padding-x-md, 16px);
  --falcon-data-table-shadow-cancel-save-font-size:   var(--falcon-button-font-size-md, 13px);
  --falcon-data-table-shadow-cancel-save-font-weight: var(--falcon-button-font-weight, 600);
  --falcon-data-table-shadow-cancel-save-radius:      var(--falcon-button-border-radius, 10px);
  ```
  Tokens DEFAULT to the Falcon `size="md"` button ramp via `var(--falcon-button-*-md)` fallbacks — bumping the master Falcon-button MD sizing automatically lifts the shadow-row Cancel/Save in step.

- `libs/falcon-ui-core/src/tailwind/table-tailwind-classes.ts` — `falconTableShadowOutlineButtonClasses()` (Cancel) + `falconTableShadowFilledButtonClasses()` (Save) re-pointed to the new MD tokens (height / min-width / padding-x / radius / font-size + a new `font-[var(...font-weight)]` line). `falconTableShadowActionsZoneInlineClasses()` gained `-translate-y-1/2` — paired with the new `top: 50%` from the token, this vertical-centers the cluster against the `position: relative` shadow `<td>`.

- The icon-only Edit + Delete (view-mode) buttons keep their compact 28×28 sizing — `falconTableShadowEditIconButtonClasses()` + `falconTableShadowDeleteIconButtonClasses()` UNTOUCHED. Only the two text buttons (Cancel + Save) move to MD per user ask.

**Coverage — every shadow row, no per-page change required:**

The Stencil library is the SINGLE consumer of these helpers (verified by grep: `falconTableShadow{Outline,Filled}ButtonClasses` and `falconTableShadowActionsZoneInlineClasses` each have ONE caller in the whole monorepo — the falcon-table-tw `renderShadowRow` at [CODE] `falcon-table-tw.tsx:994-995,971`). Every `<falcon-angular-data-table>` that renders a shadow row in edit-mode inherits the new MD buttons + vertical-center alignment automatically:
- Apps & Services tab edit-price-type + edit-price-value (admin-console)
- CommChannels & Services tab edit-price-type + edit-price-value (admin-console)
- Anything future that wires `[shadowRows]` + an edit-mode template

**Sticky-actions branch unaffected** — `falconTableShadowActionsZoneClasses()` (the SHARED variant for sticky-trailing-actions tables) is unchanged; that branch owns its own cell so vertical-center wasn't broken there.

**Token-cache details:**
- 6 new tokens picked up by the build-token-registry (3614 → 3620).
- `font-[var(...)]` reads as Tailwind arbitrary class; the registry doesn't track JIT classes (no registry impact from font-weight alone — the token name is the only thing that registers).

**Build evidence:**
- `nx build falcon-ui-tokens` — PASS (registry generated, 6 new tokens visible)
- `nx build falcon-ui-core` — PASS in 40.30s (only pre-existing `scrollHeight` reserved-prop warning, unchanged)
- `nx build admin-console` — PASS in 30.0s, hash `5a62a48a492ec4df` (6 dependent tasks succeeded)

**Not yet runtime-verified.** User flow: open Apps & Services tab in admin-console → click the kebab on a row that already has a parent priceType → choose Edit price type / Edit price value → shadow row opens → confirm Cancel + Save now sit ON THE SAME ROW as the dropdown/datepicker (vertical-center) AND are MD-sized (38px tall / 13px font / 10px radius / wider buttons).

**Tunables if runtime says otherwise:**
- Bump or shrink `--falcon-data-table-shadow-cancel-save-min-width` (default 84px) if buttons feel cramped or too wide.
- Bump `--falcon-data-table-shadow-actions-end` (default 16px) for more breathing room from the right edge.
- The 5 MD-button vars default through to `--falcon-button-*-md` — to scope-override only THIS surface, set the data-table-level tokens on the wrapper element, e.g. `style="--falcon-data-table-shadow-cancel-save-height: 36px"`.
