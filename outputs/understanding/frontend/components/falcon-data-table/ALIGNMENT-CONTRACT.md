# Falcon Data-Table — Alignment Contract v1

> **Status:** BUILD-GREEN — 2026-05-20 — NOT YET RUNTIME-VERIFIED
> **Scope:** `<falcon-table-tw>` + `<falcon-angular-data-table>` (every Falcon table on the platform)
> **Approved by:** Ammar — platform-wide 3 px header X-shift accepted

---

## Why this exists

Two independent root causes produced visible header-vs-body misalignment on chromed columns (Price Type dropdown, Price Value input, Status badge) in the Add Client wizard Step 3 (CommChannels) and Step 4 (Applications):

1. **Token mismatch (platform-wide, every Falcon table).**
   `libs/falcon-ui-tokens/src/components/table.tokens.css:52` declared `--falcon-table-header-padding-inline: 17px` while line 102 declared `--falcon-table-cell-padding-inline: 20px`. The 3 px delta affected the X-position of EVERY header label relative to its body content — silently — on every table in the workspace.

2. **Chromed-control inner padding (per-column, opt-in).**
   `falcon-angular-dropdown`, `falcon-angular-input`, and `falcon-angular-status-badge` carry their own internal padding so their inner text sits further right than the cell content-edge. Aligning header labels with INNER text of chromed body controls requires an explicit per-column nudge — but only when the consumer asks for inner-edge alignment.

---

## The three layers

### Layer 1 — Token unification (mandatory, automatic)

ONE inline-padding token contract — header and body both consume `--falcon-table-cell-padding-inline`. The legacy `--falcon-table-header-padding-inline` name lives on as a **back-compat alias** whose default value is now `var(--falcon-table-cell-padding-inline)`. Any consumer who has explicitly overridden the legacy token continues to work.

```css
/* libs/falcon-ui-tokens/src/components/table.tokens.css */
--falcon-table-header-padding-inline: var(--falcon-table-cell-padding-inline);
--falcon-table-cell-padding-inline: 20px;
```

**Effect:** Header text outer-left = body content outer-left for EVERY column on EVERY Falcon table. No consumer code changes required.

### Layer 2 — `headerInset` API (opt-in, per-column)

New optional field on `FalconTableColumnExt` (Stencil) and `ColumnDef` (Angular wrapper):

```ts
readonly headerInset?: number | string;
```

When set, the column header `<th>` receives an inline style:

```css
padding-inline-start: calc(var(--falcon-table-cell-padding-inline) + Npx);
```

Body cell padding is unaffected. Default `0` = outer-edge alignment (header label X = body content outer-left X).

### Layer 3 — Doctrine

Future consumers read this document first when wiring a new chromed-cell column.

---

## Matrix — `headerInset` values by cell content kind (size=sm)

| Cell content kind                       | Recommended `headerInset` (px) | Rationale                                                                 |
|-----------------------------------------|-------------------------------:|---------------------------------------------------------------------------|
| Plain text                              |                              0 | No chrome, outer-edge alignment is correct.                               |
| `falcon-angular-status-badge`           |                              0 | Pill chrome is centred + tight; outer-edge alignment reads correctly.     |
| `falcon-angular-switch`                 |                              0 | Switch track is small + centred; outer-edge alignment reads correctly.    |
| `falcon-angular-input` (with iconLeft)  |                              0 | Icon sits at outer-left of the input chrome — already at content edge.    |
| `falcon-angular-input` (no iconLeft)    |                             11 | Native input padding pushes placeholder ~11 px in from outer chrome edge. |
| `falcon-angular-dropdown`               |                             11 | Trigger chrome padding pushes placeholder ~11 px in from outer chrome edge. |

> Platform default (2026-05-20) is **outer-edge alignment** — `headerInset` stays unset on every wizard step. The matrix above is for future consumers who explicitly want inner-edge alignment.

---

## Cell-template DO / DON'T

### DO

- Render the chromed control as the **immediate** child of the `*falconDataTableCell` template.
- Let the cell's `--falcon-table-cell-padding-inline` handle ALL horizontal spacing.
- Compose alignment with chrome by setting `headerInset` on the column, NOT by adding margins to the cell content.

### DON'T

- Do NOT wrap the chromed control in a `<div class="px-N">` or apply inline margins on the immediate child. The cell already pads; an inner wrapper shifts content away from the cell content-edge and breaks the contract.
- Do NOT override `--falcon-table-cell-padding-inline` on a specific column without also overriding `--falcon-table-header-padding-inline` — divergence reintroduces the 3 px drift.
- Do NOT override `--falcon-table-header-padding-inline` alone in app source. The alias keeps header and body locked; overrides should be done at the wider table host scope only when documented.

---

## Worked example — dropdown column with inner-edge alignment

```ts
const columns: ColumnDef[] = [
  {
    field: 'priceType',
    headerKey: 'pricing.priceType.label',
    width: '200px',
    /*** Inner-edge alignment with the dropdown placeholder. The 11 px nudge
         offsets the dropdown trigger's internal padding so the header label
         and the placeholder share the same X. ***/
    headerInset: 11,
  },
  {
    field: 'priceValue',
    headerKey: 'pricing.priceValue.label',
    width: '160px',
    headerInset: 11,
  },
  {
    field: 'status',
    headerKey: 'pricing.status.label',
    width: '120px',
    /* Default 0 — status badges are tight + centred. */
  },
];
```

The Add Client Step 3 / Step 4 wizard consumers leave `headerInset` unset across the board — Layer 1 alone delivers the visual fix and the wizard stays on outer-edge alignment.

---

## Files touched (Alignment Contract v1)

| File                                                                                                                          | Edit                                                            |
|-------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| `libs/falcon-ui-tokens/src/components/table.tokens.css` (line 52-57)                                                          | Token unification — alias to `--falcon-table-cell-padding-inline` |
| `libs/falcon-ui-core/src/components/falcon-table/falcon-table.types.ts` (line 43-52)                                          | New optional `headerInset` field on `FalconTableColumnExt`      |
| `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx` (line 1355-1370 + `style={headerStyle}` swap)        | Compose inline `padding-inline-start` on `<th>` when set        |
| `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.types.ts` (line 36-39)                | New optional `headerInset` field on `ColumnDef`                 |
| `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts` (line 629 — `adaptColumns`) | Forward `headerInset` from `ColumnDef` → `FalconTableColumnExt` |

Build hashes (2026-05-20):
- `falcon-ui-tokens` — GREEN
- `falcon-ui-core` — GREEN (only pre-existing reserved-prop warnings: `title`, `scrollHeight`)
- `admin-console` — GREEN, hash `4c3cbbe166bab6a4`

---

## See also

- [[project_shadow_row_col_alignment_fix_2026_05_20_v2]] — sibling alignment work, confirms `--falcon-table-cell-padding-inline = 20px` is the SoT for body content edge.
- [[project_data_table_single_height_token_2026_05_19]] — companion "single source of truth" contract for row height (`--falcon-table-row-height`).
