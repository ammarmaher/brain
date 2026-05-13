# falcon-radio — GAPS AND UPGRADES

## Missing capabilities

### G1 — `errorText` vs `errorMessage` inconsistency (P2)

Same as checkbox / dropdown.

### G2 — No description sub-label (P2)

For "rich label" scenarios (e.g. card-style radios with description), no `description` input.

### G3 — `checkedInput` bypass not documented as group-only (P3)

Same naming concern as checkbox.

### G4 — No method proxies (P2)

Stencil methods (focus / blur / select) not exposed on Angular wrapper.

### G5 — No icon / `iconUrl` on radio (P3)

Some designs render a small icon left of label inside radio rows. Add `@Input() iconUrl?` for parity with dropdown options.

### G6 — No "card" / boxed variant (P3)

`<falcon-angular-tabs mode='radio-cards'>` is the closest pattern. Standalone radio doesn't have a card style.

## Missing accessibility

- Verify focus ring is visible at all sizes.
- Verify `aria-describedby` joins helper + error.

## Missing tests

- No Angular wrapper spec located.

## Missing Tailwind / token parity

- Verify check-dot rendering on Tailwind path matches Shadow path.

## Performance risks

- None.

## Visual / interaction risks

- Border-width-5 trick for the inner dot may break at very small sizes — verify `size='sm'` visual.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | `errorMessage` alias | P2 |
| G2 | `description` input | P2 |
| G4 | Method proxies | P2 |
| G5 | `iconUrl` option | P3 |
| G6 | Card variant | P3 |

## Concrete upgrade API

```ts
@Input() errorMessage?: string;
@Input() description?: string;
@Input() iconUrl?: string;
async setFocus(): Promise<void>;
```

## Shared vs per-page

All shared.

## Workarounds today

- For G2: wrap label content with custom HTML in default slot.
- For G5: pre-format label with text-prefix glyph.
