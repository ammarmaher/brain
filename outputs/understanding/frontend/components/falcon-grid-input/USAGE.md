# falcon-grid-input — USAGE

## Real usage examples

### Example 1 — Inside data-table custom cell

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

```ts
commit(rowIndex: number, value: string) { /* save */ }
cancelEdit(rowIndex: number) { /* revert UI state */ }
navigate(rowIndex: number, dir: 'next' | 'previous') {
  /* save current, focus next cell */
}
```

### Example 2 — Standalone cell editor

```html
<falcon-angular-grid-input
  [value]="cellValue()"
  [originalValue]="originalCellValue()"
  (falconGridCommit)="onCommit($event.value)">
</falcon-angular-grid-input>
```

## Recommended usage for NEW Angular pages

- Use ONLY inside grid / table cells.
- Always pass `originalValue` to enable Escape-revert.
- Handle `falconGridNavigate` to implement cell focus nav.
- Default `autoFocus=true` is correct for cell-edit UX.

## Reactive Forms

Not typical — grid edits are usually imperative cell mutations.

## ngModel

Not supported.

## Tailwind-only

```html
<falcon-angular-grid-input class="w-full" ... />
```

## Token usage

```css
.editing-cell {
  --falcon-grid-input-bg: var(--color-falcon-neutral-50);
  --falcon-grid-input-border-color: var(--color-falcon-teal-500);
}
```

## Bad usage to avoid

- Do NOT use as a regular form input — no label / error / helper.
- Do NOT skip `originalValue` if Escape-revert matters.
- Do NOT add external focus management when `autoFocus=true` already handles it.

## Do / Don't

| Do | Don't |
|---|---|
| Use inside grid/table cells. | Use as form field. |
| Pass `originalValue` for revert. | Skip it. |
| Handle navigate event for focus. | Hand-roll Tab handling. |
