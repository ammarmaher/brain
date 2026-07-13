# falcon-grid-input — USAGE

## Real usage examples (active codebase)

### Example 1 — Editable price/cost matrix cell (the live consumer)

`apps/admin-console/src/app/features/contracts-cost-management/components/contracts-add-wizard/contract-details-step/contract-details-step.component.html:106-111` (mirrored at `apps/management-console/.../contracts-contract-details-section/contracts-contract-details-section.component.html:106-111`):

```html
<td class="px-3 py-3 align-middle" [attr.data-testid]="'contracts-matrix-cell-' + row.priority + '-' + cell.destination">
  @if (editable()) {
    <falcon-angular-grid-input
      [value]="cellDisplayValue(cell)"
      [originalValue]="cellDisplayValue(cell)"
      [autoFocus]="false"
      (falconGridCommit)="onCellCommit(rowIndex, cellIndex, $event)">
    </falcon-angular-grid-input>
  } @else {
    <div class="text-center text-sm text-falcon-neutral-950">{{ cellDisplayValue(cell) }}</div>
  }
</td>
```

```ts
// the commit event carries a STRING { value }; the consumer parses + writes
onCellCommit(rowIndex: number, cellIndex: number, e: { value: string }) { /* parse + store */ }
```

> `[CODE]` Note this is a **plain `<table>` matrix**, NOT a `<falcon-angular-data-table>` custom-cell template. The live consumers set `[autoFocus]="false"` (the whole matrix renders editable at once — auto-focusing every cell would fight for focus) and pass `originalValue == value` initially (Escape reverts to the cell's current display value).

### Example 2 — Inside a data-table custom cell (recommended pattern, not yet used live)

```html
<falcon-angular-data-table [data]="rows" [columns]="cols">
  <ng-template falconDataTableCell="amount" let-row let-rowIndex="rowIndex">
    @if (row.editing) {
      <falcon-angular-grid-input
        [value]="row.amount"
        [originalValue]="row.originalAmount"
        (falconGridCommit)="commit(rowIndex, $event.value)"
        (falconGridCancel)="cancelEdit(rowIndex)"
        (falconGridNavigate)="navigate(rowIndex, $event.direction)">
      </falcon-angular-grid-input>
    } @else {
      <span (dblclick)="startEdit(rowIndex)">{{ row.amount }}</span>
    }
  </ng-template>
</falcon-angular-data-table>
```

Here `autoFocus=true` (default) is correct — only one cell enters edit mode at a time, so grabbing focus is the desired UX.

## Recommended usage for NEW Angular pages

- Use ONLY inside grid / table / matrix cells.
- Always pass `originalValue` to enable Escape-revert (omitting it reverts to `''`).
- Handle `(falconGridNavigate)` to implement cell focus nav when one-cell-at-a-time editing — Tab is hijacked, so without a handler Tab loses focus.
- `autoFocus`: leave `true` for single-cell edit (double-click → edit); set `false` when the whole grid renders editable at once (the live contracts matrix).
- The commit value is a **string** — parse/validate numeric cells yourself in the commit handler.

## Reactive Forms

Not typical and not supported (no CVA) — grid edits are imperative cell mutations. Bind `[value]` + `(falconGridCommit)`.

## ngModel

Not supported (no CVA).

## Tailwind-only

```html
<falcon-angular-grid-input class="w-full" ... />
```

The wrapper host-binds `block w-full` (`[CODE]` falcon-grid-input.component.ts:67); add layout utilities via `class=`. No `wrapperClass`/`inputClass` inputs.

## Token usage (per-instance override pattern)

The component's **own** token surface is two focus-ring tokens — and they are currently **orphan** (declared but not consumed by the Shadow CSS, which only sets `display:block`):

```css
/* grid-input.tokens.css — these exist but are NOT wired into any rule today */
--falcon-grid-input-focus-ring-color
--falcon-grid-input-focus-ring-width
```

To actually restyle the editing cell (background, border, focus colour), override the shared **`--falcon-input-*`** tokens (the field is `<falcon-input variant="grid">`), NOT a `--falcon-grid-input-*` token:

```css
.editing-cell {
  --falcon-input-bg: var(--color-falcon-neutral-50);
  --falcon-input-border-color-focus: var(--color-falcon-teal-500);
}
```

> There is **no** `--falcon-grid-input-bg` / `--falcon-grid-input-border-color` / `--falcon-grid-input-text-color` token (a prior version of this doc claimed a 6-category set — fictional). Override `--falcon-input-*`.

## Bad usage to avoid

- **Do NOT** use as a regular form input — no label / helper / error.
- **Do NOT** skip `originalValue` if Escape-revert matters — it reverts to `''`.
- **Do NOT** also commit in a host blur handler — the internal `committed` flag already de-dups; you would double-write (`[CODE]` falcon-grid-input.tsx:90-93).
- **Do NOT** rely on native Tab order — Tab is hijacked into `falconGridNavigate`; implement focus nav (`[CODE]` falcon-grid-input.tsx:114-122).
- **Do NOT** target `--falcon-grid-input-bg`/`-border-color` — they don't exist; override `--falcon-input-*`.
- **Do NOT** expect numeric parsing or a red error border — string-only, no error state; the consumer owns both.

## Do / Don't

| Do | Don't |
|---|---|
| Use inside grid/table/matrix cells. | Use as a form field. |
| Pass `originalValue` for revert. | Skip it (reverts to ''). |
| Handle `(falconGridNavigate)` for focus. | Hand-roll Tab handling. |
| Override `--falcon-input-*` for cell visuals. | Invent `--falcon-grid-input-bg`. |
| Parse the committed string yourself. | Assume a numeric/typed value. |

## Consumer Sweep (2026-06-03)

[CODE] grep `falcon-angular-grid-input` across `apps/` + `libs/falcon/` returned **2 application consumer feature(s)** (4 files) as of 2026-06-03:

- `apps/admin-console/src/app/features/contracts-cost-management/components/contracts-add-wizard/contract-details-step/contract-details-step.component.html` (+ `.ts`)
- `apps/management-console/src/app/features/contracts-cost-management/components/contracts-contract-details-section/contracts-contract-details-section.component.html` (+ `.ts`)

(The third repo match, `libs/falcon-ui-tokens/src/components/grid-input.tokens.css`, is the token file, not a consumer.)

**Status: adopted (was 0 at Wave 7, 2026-05-17).** Both consumers are the Contracts cost-management price/cost matrix.
