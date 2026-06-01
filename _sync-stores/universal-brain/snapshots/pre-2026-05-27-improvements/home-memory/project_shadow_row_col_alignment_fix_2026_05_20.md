---
name: shadow-row-col-alignment-fix
description: "Fix for shadow row label/value misalignment with parent data-table columns (10px off-by-padding bug, 2026-05-20)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 135b9b13-ad38-4a21-ab1b-025478066323
---

# Shadow Row Column Alignment Fix — 2026-05-20

🟢 BUILD-GREEN 2026-05-20. Fixed 10px horizontal misalignment between shadow row content and parent table column headers in both view mode and edit mode.

**Why:** `FalconDataTableShadowColDirective` computes `left` using `--shadow-col-key-left` (= `th.outer-left − tr.outer-left`). But the absolutely-positioned element sits inside a `.relative` wrapper that is INSIDE the shadow `<td>` whose horizontal padding = `--falcon-data-table-shadow-row-padding-x` (24 px default). The wrapper's left = `tr.outer-left + 24 px`. Result: every field lands 24 − 14 = **10 px to the right** of where the column text starts (cell padding = 14 px).

**How to apply:** Always apply this correction when absolutely-positioning inside a shadow row content wrapper. The formula: `left = var(--shadow-col-key-left) - var(--falcon-data-table-shadow-row-padding-x, 0px) + var(--falcon-data-table-cell-padding-x, 0px)`.

## File changed

`libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table-cell.directive.ts` — `FalconDataTableShadowColDirective.ngOnInit()` — left calc now subtracts shadow row padding-x and adds cell padding-x before the per-column pad-left/pad-right fine-tuning.

## Key tokens involved

- `--falcon-data-table-shadow-row-padding-x: 24px` (shadow <td> horizontal padding)
- `--falcon-data-table-cell-padding-x: 14px` (normal cell content padding)
- Correction = 24 − 14 = **10 px** (shadow content was offset 10 px to the right)

## Applies to

ALL places that use `*falconDataTableShadowCol` — service-pricing-table (apps-services + comm-channels tabs) and any future shadow row consumers. Fixes both view mode AND edit mode since both use the same directive.
