# falcon-switch — GAPS AND UPGRADES

## Missing capabilities

### G1 — `errorText` vs `errorMessage` inconsistency (P2)

### G2 — No description / sub-label (P2)

### G3 — No loading state (P2)

For async toggles (e.g. server-confirmed feature flags), no loading variant. Consumers must compose with a sibling spinner.

**Recommended fix:** add `@Input() loading = false` + a token-driven spinner inside the track.

### G4 — No method proxies (P2)

### G5 — `value` input is unused if not in a form submit (P3)

The `value` input forwards to the native form. For pure boolean UI without a form, it's vestigial. Document.

### G6 — No icon inside knob (P3)

Some products embed a check/X inside the knob. Not supported.

### G7 — No three-state ('indeterminate') (by design — fine)

Document explicitly that switches don't support indeterminate.

## Missing accessibility

- Verify `aria-checked` transitions are announced.
- Verify focus ring visible across all 3 variants.

## Missing tests

- No Angular wrapper spec located.

## Missing Tailwind / token parity

- Verify all 3 variants render correctly on both render paths.

## Performance risks

- None.

## Visual / interaction risks

- `channel-pill` with long `textOn` / `textOff` strings can stretch unexpectedly — token-driven max-width recommended.
- Loading addition (G3) needs careful track layout.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | `errorMessage` alias | P2 |
| G2 | `description` | P2 |
| G3 | `loading` state | P2 |
| G4 | Method proxies | P2 |
| G6 | Knob icon | P3 |

## Concrete upgrade API

```ts
@Input() errorMessage?: string;
@Input() description?: string;
@Input() loading = false;
@Input() onIcon?: string;
@Input() offIcon?: string;
async setFocus(): Promise<void>;
async toggle(): Promise<void>;
```

## Shared vs per-page

All shared.

## Workarounds today

- For G3: gate `[disabled]` while async pending, show a sibling spinner externally.
- For G2: extend label with HTML in default slot.
