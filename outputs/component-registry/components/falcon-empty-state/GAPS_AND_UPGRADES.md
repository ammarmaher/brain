# falcon-empty-state — GAPS & UPGRADES

## Missing capabilities

### Not composed by default in `<falcon-table>` core

- The Stencil `<falcon-table>` renders a bare text-only empty cell (`<td>{emptyMessage}</td>`). It does NOT compose `<falcon-empty-state>` by default. Consumers reach this via `<ng-template falconDataTableEmpty>` projection only. **P2 — wire the table to compose this primitive automatically when an `emptyStateIconName`/`emptyStateDescription` input is supplied. See `falcon-table` FT-05.**

### No usage in production

- Zero direct consumer in `apps/` (grep). All current empty states are bare strings.

### Image / illustration variant

- The component supports an icon name only — no illustration (SVG / image) variant. **P3 — add `[illustrationUrl]` or `<slot name="illustration">` for product-marketing-grade zero states.**

### Action slot is single-region

- One `<slot name="action">` for buttons. Multiple buttons sit side-by-side. Layout (column vs row) is fixed by the component. **P3 — add `[actionLayout]="'row'|'column'"`.**

### No "error variant"

- Empty state is presentational and could double as a generic error state with a different icon. Today no `[variant]="'empty'|'error'|'success'|'info'"` driver. **P3 — add variant input + token surface per variant.**

### A11y

- `role="img"` + `aria-label={titleText}` is set on the root, with `ariaLabel` prop override on Stencil only. **P3 — expose `[ariaLabel]` on Angular wrapper for parity.**

### Tests

- No specs. **P3** — pure presentational.

## Reusable upgrades needed

| ID | Title | Priority |
|---|---|---|
| FES-01 | Auto-compose inside `<falcon-table>` empty cell | **P2** |
| FES-02 | Illustration slot | **P3** |
| FES-03 | `[actionLayout]` input | **P3** |
| FES-04 | `[variant]` input for error / success / info | **P3** |
| FES-05 | Expose `[ariaLabel]` on Angular wrapper | **P3** |

## Workarounds available

- Auto-compose: today consumer must project `<ng-template falconDataTableEmpty>` per table.
- Illustration: drop down to Stencil and use a custom slot if you want a non-icon visual.

## Visual / interaction risks

- Default heading `<h3>` may collide with the consumer page's heading hierarchy. Consumer should ensure the H3 fits the document outline.

## Future-proof recommendation

Add an `[emptyState]` input on `<falcon-angular-data-table>` that auto-composes this primitive without requiring a template projection — most empty states need the same icon + title + description + action shape, so a shorthand reduces boilerplate.
