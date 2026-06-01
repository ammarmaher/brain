---
name: Data-table single height token
description: Falcon data table header/row/footer unified to one --falcon-table-row-height token; table owns height
type: project
originSessionId: 80cf526a-c579-42ed-889f-b185a2bb1850
---
🟢 BUILD-GREEN 2026-05-19 (falcon-ui-core + admin-console). Falcon data table (`falcon-angular-data-table` → Stencil `<falcon-table-tw>`) header/row/footer rendered unequal heights.

**Two root causes:**
1. Users list (org-hierarchy): racy `stencil-prop-patches.ts patchUsersTable()` forced `--falcon-table-*-padding-block` via `setProperty` from a `queueMicrotask`+`setTimeout(100)` effect; on a lost race vs the `<falcon-table-tw>` mount → no override → unequal intrinsic heights.
2. Add-Client wizard steps (`client-applications-step` / `client-comm-channels-step`): every `falconDataTableCell` template wrapped content in `<div class="flex h-[52px]">`. That 52px STACKED on the table's own `<td>` `py` (12px×2) → ~76px rows vs ~39px header. Working tabs (`apps-services-tab`/`comm-channels-tab`) never did this → looked fine.

**Universal fix — the data-table OWNS the row height:**
- `table.tokens.css`: `--falcon-table-row-height: 52px` (+ `-compact:40px` / `-spacious:64px`).
- `table-tailwind-classes.ts`: header/body-cell/footer helpers → FIXED `h-[var(--falcon-table-row-height)]`, vertical padding DROPPED, content centred (`align-middle` / `items-center`).
- `falcon-table.css` (shadow variant): `height`+`padding-block:0` on `thead th`/`tbody td`/footer; density selectors re-point the token.
- `data-table.tokens.css`: `--falcon-data-table-paginator-min-height` → `var(--falcon-table-row-height)` (was undefined `--spacing-row-h`).
- `falcon-custom-table-footer.component.html`: `h-[var(--falcon-table-row-height)]`, dropped `py-3`.
- Removed the 3 racy padding `setProperty` lines from `stencil-prop-patches.ts`.
- Both wizard steps: removed the `h-[52px]` inner wrappers (cell now owns height; rows stay uniform via fixed cell height).

**Footer scope-gap follow-up:** footer still mismatched after the above — `showCustomFooter` defaults `true` so tables use `<falcon-angular-custom-table-footer>`, a SIBLING of `<falcon-table-tw>`. `--falcon-table-row-height` (in `table.tokens.css`) was declared on a `:where()` that omitted `falcon-angular-data-table`, so the token reached the `<th>`/`<td>` but never the sibling footer → its `h-[var(--falcon-table-row-height)]` resolved to nothing. Fix: added `falcon-data-table, falcon-data-table-tw, falcon-angular-data-table, .falcon-data-table, [data-falcon-data-table]` to the `table.tokens.css` `:where()` selector so the token is defined on the data-table host and inherits to BOTH the table and the footer.

**Why:** declarative CSS (no JS race) + one token = strict header=row=footer parity everywhere. A token only reaches a node if declared on an ancestor — sibling components need the token on the shared parent host.
**How to apply:** cell height = `--falcon-table-row-height` only; NEVER add an `h-[..]` wrapper inside a `falconDataTableCell` template (stacks on the cell), and never JS-patch table padding for height. Keep cell content ≤ token height.
