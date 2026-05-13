# falcon-otp — GAPS AND UPGRADES

## Missing capabilities

### G1 — No `(falconComplete)` event re-emission (P1)

Stencil emits `falcon-change` with `{ value, complete }`. Wrapper forwards only `value` via CVA. Consumers wanting to auto-submit on completion must inspect length externally.

**Recommended fix:** add `@Output() falconComplete = new EventEmitter<string>()` firing when `complete=true`.

### G2 — Validation deferred (by design, but documented poorly) (P2)

Component doesn't validate the code beyond per-box pattern matching. Must validate via Reactive Forms.

### G3 — No method proxies (P2)

No `clear()` / `setFocus()` / `submit()` on wrapper.

### G4 — Built-in SMS auto-fill not wired (P2)

iOS / Android can auto-fill OTPs via SMS. Falcon's component should set `autocomplete="one-time-code"` on the underlying inputs. Verify Stencil source.

### G5 — Per-box visual states not exposed individually (P3)

Each box has same state. For granular error highlighting (e.g. nth box invalid), no API.

### G6 — Mask character not configurable (P3)

`mask=true` toggles masking, but the mask char (typically •) is hardcoded.

## Missing accessibility

- Verify per-box `aria-label`.
- Verify completion announced.
- Verify `aria-invalid` on each box on error.

## Missing tests

- No Angular wrapper spec.

## Missing Tailwind / token parity

- Verify gap, box-size on both render paths.

## Performance risks

- None.

## Visual / interaction risks

- Long lengths cause horizontal overflow — cap at 10 in docs.
- Paste-fill behavior with stray characters (spaces, hyphens) — verify Stencil sanitizes.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | `falconComplete` event | P1 |
| G4 | SMS auto-fill attr | P2 |
| G3 | Method proxies | P2 |
| G5 | Per-box state hook | P3 |
| G6 | Mask character | P3 |

## Concrete upgrade API

```ts
@Output() falconComplete = new EventEmitter<string>();
@Input() maskCharacter = '•';
async clear(): Promise<void>;
async setFocus(boxIndex?: number): Promise<void>;
```

## Shared vs per-page

All shared.

## Workarounds today

- For G1: check `value.length === length` inside `(ngModelChange)`.
- For G4: verify `autocomplete="one-time-code"` is set on Stencil; if not, file a Stencil-side gap.
- For G3: query nativeElement.querySelector('input') and call focus.
