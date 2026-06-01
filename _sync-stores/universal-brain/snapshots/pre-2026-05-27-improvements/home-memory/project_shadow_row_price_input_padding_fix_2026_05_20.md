---
name: shadow-row-price-input-padding-fix-2026-05-20
description: "Shadow-row Edit-Price input: removed the 48 px runaway left padding and re-anchored the SAR overlay to the parent-row icon column. Falcon spacing-scale gotcha documented."
metadata: 
  node_type: memory
  type: project
  originSessionId: 8b65a77e-2e34-45a8-8d5c-57868303434a
---

# Shadow-row Edit-Price input — padding + SAR-icon column alignment fix (2026-05-20)

🟢 **BUILD-GREEN** — `nx build admin-console` PASS, 27.1 s, hash `5e9d3420b974125f` (final). Two iterations:
- Pass 1: `ps-8` → `ps-2`, icon `start-[var(--falcon-data-table-cell-padding-x)]` → `start-0` (hash `32d6f86902d9c3c8`). Icon column-perfect with parent row, but flush against input border — visually cramped.
- Pass 2 (final): icon `start-0` → `start-[3px]`, input `ps-2` → `ps-2.5`. 3 px breathing room before the glyph, 4 px gap to value text (matches parent row `gap-1`).

Not runtime-verified yet.

## What changed

[CODE] `Falcon/falcon-web-platform-ui/libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.html:229-272`

Two coupled edits inside the `'price-value-change'` shadow-row edit template:

1. `<falcon-angular-input ... inputClass="ps-8" />` → `inputClass="ps-2.5"`
2. `<span class="...absolute start-[var(--falcon-data-table-cell-padding-x)] ...">` → `start-[3px]`

Comment block above the snippet rewritten to explain the new math + the Falcon spacing-scale gotcha.

## Why

**Symptom (user DevTools screenshot):** the native `<input>` inside the new-price-value overlay showed `padding: 0 0 0 48px`. The "20" value sat ~30 px to the right of the SAR glyph, and the glyph itself was 14 px to the right of the parent-row SAR glyph — visually broken.

**Three coupled root causes:**

1. **Falcon overrides Tailwind's spacing scale.** [CODE] `libs/falcon-theme/src/falcon-tailwind-tokens.css:272-276`:
   - `--spacing-5: 1.5rem` (24 px, not stock 20 px)
   - `--spacing-6: 2rem` (32 px, not stock 24 px)
   - `--spacing-7: 2.5rem` (40 px, not stock 28 px)
   - **`--spacing-8: 3rem` (48 px, not stock 32 px)** ← this is what `ps-8` resolved to
   So `inputClass="ps-8"` injected 48 px, not the 32 px the author appears to have intended.

2. **Legacy `--falcon-data-table-cell-padding-x` token (14 px) leaking through.** Per [MEMORY] `project_shadow_row_col_alignment_fix_2026_05_20_v2`, today's v2 fix re-anchored the `*falconDataTableShadowCol` directive to `H + --falcon-table-cell-padding-inline` (20 px = the real `<td>` body cell content edge). The directive's own JSDoc ([CODE] `falcon-data-table-cell.directive.ts:158-163`) marks the 14 px token as a pre-Stencil PrimeNG back-compat fallback. The SAR-glyph overlay in service-pricing-table still pinned to that 14 px token, so it sat 14 px deeper than the parent-row SAR glyph.

3. **`*falconDataTableShadowCol` already lands the inner div at the body cell content edge.** The author's old comment treated the 14 px offset as the parent-cell inset — true pre-v2, false now. After v2, the inner `<div class="relative w-[280px]">` is already at `column.left + 20 px`, which matches where the parent row's `<span class="inline-flex gap-1"><SAR/>VALUE</span>` starts. The icon needs `start-0`, not another 14 px offset.

## New math (LTR)

Let `H` = parent column's `th.outer-left`. Inner `.relative w-[280px]` div sits at `H + 20` (via the v2 directive).

| Element | Old (`ps-8` + `start-[14px]`) | Pass 1 (`ps-2` + `start-0`) | Pass 2 final (`ps-2.5` + `start-[3px]`) | Parent row |
|---|---|---|---|---|
| SAR icon left | `H + 34` | `H + 20` (flush with input border) | `H + 23` (3 px breathing room) | `H + 20` |
| Native input start | `H + 29` (1 px border + 8 px `--falcon-input-padding-x-sm`) | `H + 29` | `H + 29` | — |
| Value text start | `H + 77` (`ps-8` = 48 px in Falcon scale) | `H + 37` (`ps-2` = 8 px) | `H + 39` (`ps-2.5` = 10 px) | `H + 36` (icon 12 + `gap-1` 4) |
| Icon-to-value gap | n/a (text past icon) | 5 px | 4 px ✓ matches parent | 4 px |

Net (Pass 2): "down" SAR glyph drifts 3 px from "up" SAR — below typical perception threshold — in exchange for visible breathing room before the glyph. Icon-to-value gap matches parent row exactly.

## How to apply

- Any future shadow-row cell that overlays a glyph on top of an input should pin the glyph with a small inline-start inset (~3 px), NOT the legacy `--falcon-data-table-cell-padding-x` (14 px). The `*falconDataTableShadowCol` directive already lands the inner div at the body cell content edge — additional inset above ~3 px will visibly misalign the glyph column.
- When sizing `ps-*` to clear an overlay in a falcon-input wrapper, remember the wrapper itself contributes 1 px border + `--falcon-input-padding-x-sm` (8 px for `size="sm"`) before the native input starts. With a 3 px icon inset, `ps-2.5` (10 px) gives a 4 px icon-to-value gap.
- **Falcon spacing-scale gotcha:** `ps-5..ps-12` are NOT the stock Tailwind values. Re-check any padding utility that needs to land at a precise pixel inset — read `libs/falcon-theme/src/falcon-tailwind-tokens.css` § SPACING. (`--spacing-2.5 = 0.625rem = 10 px` IS still stock; the drift starts at `--spacing-5`.)

## Build

- `npx nx build admin-console` → PASS, 21.9 s, hash `32d6f86902d9c3c8`.
- No errors / warnings on the edited file.
- Not yet runtime-verified at `localhost:4200` — host-shell currently blocked on [[host-shell-ng0201-domrendererfactory2]].

Related:
- [[shadow-row-col-alignment-fix-2026-05-20-v2]] — the directive-level anchor change this builds on
- [[edit-price-phase-a-2026-05-19]] — the broader Edit-Price feature
- [[ib-dialog-visual-parity-wave17-2026-05-20]] — sibling visual-parity work landed earlier today
