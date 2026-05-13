# falcon-input-number — GAPS AND UPGRADES

## Missing capabilities

### G1 — Clamp only fires on blur (P2)

If the user types `99999` and submits without blurring (e.g. Enter), the form will receive the unclamped value. Consider clamping on Enter too.

**Recommended fix:** add Enter-key clamp handler.

### G2 — No `prefix` / `suffix` text inputs (P1)

For "kg" / "%" / custom symbols not handled by Intl currency, no input. The registry mentioned `prefix?` / `suffix?` on Stencil — verify and surface on wrapper.

**Recommended fix:** add `@Input() prefix?: string` + `@Input() suffix?: string` plus token-driven layout.

### G3 — No method proxies (P2)

No `setFocus()` / `stepUp()` / `stepDown()` exposed publicly.

### G4 — Sign-style negative-number display not configurable (P3)

Some locales prefer `()` for negatives. Intl handles this via `signDisplay` and currency display options — not exposed.

### G5 — No `state` input (P2)

Missing `state: 'default' | 'error' | 'success' | 'warning'` on the wrapper despite passing through `errorMessage`. Pattern divergence from input / dropdown / textarea.

### G6 — No keyboard step (Up/Down arrows) (P2)

When `showButtons=false`, user has no easy way to step. Browser-native `<input type=number>` would handle Up/Down arrows — verify whether Stencil/Angular composition does.

### G7 — Long-press spinner not implemented (P3)

For very long ranges, single-click step is tedious. Long-press auto-step (with acceleration) is a common ask.

### G8 — Currency code list not validated (P3)

`currency='XYZ'` would silently fail Intl. Could provide a typed union of known codes.

## Missing accessibility

- Verify `inputmode="decimal" | "numeric"` is set.
- Verify spinner buttons have correct `aria-label` and `aria-controls`.
- Verify value changes announced via `aria-live`.

## Missing tests

- No Angular wrapper spec.

## Missing Tailwind / token parity

- Spinner button placement on both render paths needs verification.

## Performance risks

- `Intl.NumberFormat` instantiation per format/parse call — consumers running heavy lists should memoize.

## Visual / interaction risks

- Switching focused/blurred display can cause cursor position jumps.
- Spinner buttons in `showButtons=true` mode add ~64px of horizontal real-estate — narrow columns may compress.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G2 | `prefix` / `suffix` text | P1 |
| G5 | `state` input | P2 |
| G6 | Keyboard step (Arrow keys) | P2 |
| G1 | Clamp on Enter | P2 |
| G3 | Method proxies | P2 |
| G7 | Long-press auto-step | P3 |
| G4 | `signDisplay` option | P3 |

## Concrete upgrade API

```ts
@Input() prefix?: string;
@Input() suffix?: string;
@Input() state: 'default' | 'error' | 'success' | 'warning' = 'default';
@Input() signDisplay?: 'auto' | 'never' | 'always' | 'exceptZero';
@Input() longPressStep = false;
async setFocus(): Promise<void>;
async stepUp(): Promise<void>;
async stepDown(): Promise<void>;
```

## Shared vs per-page

All shared.

## Workarounds today

- For G2: pass `mode='currency'` if needing a symbol; otherwise render prefix/suffix externally outside the component.
- For G6: use `showButtons=true`.
- For G1: trigger `blur()` programmatically on form submit.
