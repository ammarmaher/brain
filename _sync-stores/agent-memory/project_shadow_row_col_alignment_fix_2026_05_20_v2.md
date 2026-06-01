---
name: shadow-row-col-alignment-fix-v2-cell-padding-inline
description: Fix v2 for shadow row label/value misalignment — switched from legacy 14px token to real 20px cell-padding-inline (2026-05-20 follow-up)
metadata: 
  node_type: memory
  type: project
  originSessionId: c82bf20d-ad8e-48c1-8143-e4edae950b79
---

# Shadow Row Column Alignment Fix v2 — 2026-05-20

🟢 BUILD-GREEN 2026-05-20 (NOT runtime-verified). Follow-up to [[project_shadow_row_col_alignment_fix_2026_05_20]] — that fix used the LEGACY `--falcon-data-table-cell-padding-x` (14 px from the pre-Stencil PrimeNG wrap), but the REAL body cells of `<falcon-table-tw>` use `--falcon-table-cell-padding-inline` (20 px) declared in `table.tokens.css:102`. Result: shadow content was landing 6 px LEFT of the parent's body cell content edge — visibly off-column in both view and edit modes on service-pricing-table.

**Why:** Two padding tokens exist for the data-table:
- `--falcon-table-cell-padding-inline: 20px` (table.tokens.css:102) — **ACTUAL** `<td>` body padding, applied by `falconTableCellClasses` (`px-[var(--falcon-table-cell-padding-inline)]`).
- `--falcon-data-table-cell-padding-x: 14px` (data-table.tokens.css:49) — **LEGACY** PrimeNG-wrap token; the new Stencil `<falcon-table-tw>` does not use it.

The directive's `left` calc subtracted shadow-row padding (24 px) and added the WRONG cell-padding token. Geometry trace (LTR):
- `.relative` wrapper viewport.left = `tr.outer-left + 24` (the shadow `<td>` padding-x).
- Old formula → `projected.viewport.left = th.outer-left + 14` ← 6 px LEFT of body content.
- New formula → `projected.viewport.left = th.outer-left + 20` = body content edge ✓ (same x as parent row's value text).

**How to apply:** Always anchor shadow-row content to `--falcon-table-cell-padding-inline`, not the legacy `--falcon-data-table-cell-padding-x`. Fallback chain `var(--falcon-table-cell-padding-inline, var(--falcon-data-table-cell-padding-x, 0px))` keeps back-compat for any legacy `<falcon-data-table>` consumer.

## Files changed

1. `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table-cell.directive.ts` — `FalconDataTableShadowColDirective.ngOnInit()` swaps the cell-padding token; comment block rewritten with the full math derivation.
2. `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx` — `updateShadowArrowPositions()` now offsets the arrow's `left` by `+ cell-padding-inline − arrow-size` so the arrow TIP lands on the SAME x as the projected content's left edge (body cell content edge).

## Math summary

Let:
- `H = th.outer-left` (target column header outer-left in viewport coords)
- `T = tr.outer-left` (shadow `<tr>` outer-left)
- `P_shadow = 24px` (`--falcon-data-table-shadow-row-padding-x`)
- `P_cell   = 20px` (`--falcon-table-cell-padding-inline`)
- `A = 10px` (`--falcon-data-table-shadow-arrow-size`)

Directive (projected content):
- `element.style.left = (H−T) − P_shadow + P_cell`
- `element.viewport.left = (T + P_shadow) + element.style.left = H + P_cell = H + 20` ✓

Stencil (arrow):
- `arrow.style.left (cell-local) = (H−T) + P_cell − A` (since `cellRect.left = T`)
- `arrow.tip.viewport.x = T + (H−T) + P_cell − A + A = H + P_cell = H + 20` ✓

⇒ Arrow tip + projected content left edge sit on the EXACT same vertical line, anchored to the parent body cell's content edge. Works for any column key (priceType, priceValue, …) via the `--shadow-col-${key}-left` var that Stencil publishes on each shadow `<tr>`.

## Build status

- `nx build falcon-ui-core` — GREEN in 46.55s (only pre-existing reserved-prop warnings: `title`, `scrollHeight`).
- `nx build admin-console` — GREEN in 20.9s, hash `8be3d6a4f3ff9270`.

## Verification status

🟢 BUILD-GREEN. 🔴 NOT runtime-verified — requires running docker stack + auth + service-pricing edit interaction to capture before/after pixels. Per [[feedback_visual_baseline_guardrail_2026_05_20]], next runtime session should compare against the Falcon Light Mode Visual Baseline.

## RTL note

Both edits still use `node.style.left` and `cellRect.left` (physical, not logical). LTR alignment is mathematically guaranteed. RTL is OUT OF SCOPE — would need a separate switch to `inset-inline-start` and rect-end measurement.

## Applies to

ALL consumers of `*falconDataTableShadowCol` — service-pricing-table (Apps & Services + CommChannels & Services tabs) and any future shadow row. Single directive, single Stencil code path → both view mode and edit mode covered.
