# falcon-grid-input — GAPS AND UPGRADES

## Missing capabilities

### G1 — Single string value only (P2)

For numeric cell editing (with format / step), no built-in. Consumers must coerce externally.

**Recommended fix:** add `mode?: 'text' | 'number'` + type-specific input. OR document the convention of composing `<falcon-angular-input-number>` for numeric cells instead.

### G2 — No validation feedback (P2)

If commit fails (server returns error), no way to display in-cell error.

**Recommended fix:** add `@Input() errorState?: boolean` + `@Input() errorMessage?: string` rendered as tooltip / red ring.

### G3 — No method proxies (P2)

No `setFocus()` / `selectAll()` / `commit()` / `cancel()` on wrapper.

### G4 — Auto-focus race with parent visibility (P3)

If parent toggles editing mode and the component mounts before the row is visible, focus can land in a hidden field. Verify Stencil handles this.

### G5 — Tab navigation event-only — no built-in focus next-cell (P3)

By design — host handles. Document.

### G6 — No "dirty" indicator (P3)

For users editing across multiple cells, no visual hint that current value differs from `originalValue`.

### G7 — No paste sanitization (P3)

For numeric cells, pasting `"$1,234.56"` doesn't clean — consumer responsibility.

## Missing accessibility

- Verify `aria-label` configurable (currently none in wrapper).
- Verify focus management on cancel — does focus go back to triggering cell?

## Missing tests

- No Angular wrapper spec.

## Missing Tailwind / token parity

- Verify Shadow + Light render identically.

## Performance risks

- None.

## Visual / interaction risks

- Auto-focus on mount can steal focus if multiple grid-inputs mount simultaneously.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | `mode='number'` variant | P2 |
| G2 | Validation feedback | P2 |
| G3 | Method proxies | P2 |
| G6 | Dirty indicator | P3 |
| G7 | Paste sanitization | P3 |

## Concrete upgrade API

```ts
@Input() mode: 'text' | 'number' = 'text';
@Input() errorState = false;
@Input() errorMessage?: string;
@Input() ariaLabel?: string;
async setFocus(): Promise<void>;
async selectAll(): Promise<void>;
async commit(): Promise<void>;
async cancel(): Promise<void>;
```

## Shared vs per-page

All shared.

## Workarounds today

- For G1: validate / coerce inside `(falconGridCommit)` handler.
- For G2: render error in a sibling cell-level container.
- For G3: query nativeElement.querySelector('input').
