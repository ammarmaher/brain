# falcon-email-field — GAPS AND UPGRADES

## Missing capabilities

### G1 — Validation deferred — no built-in email regex (P2)

By design — but document clearly that consumers MUST add `Validators.email` (or a stricter custom regex). The component emits `falcon-verify` without checking the value shape.

### G2 — No "verified" state (P1)

Once the consumer confirms verification, there's no built-in "verified ✓" visual. Consumer must compose a sibling icon or change `state`.

**Recommended fix:** add `@Input() verified = false` + a token-driven check icon next to the verify button. (Registry mentions `verified` as a prop on the Stencil version — the Angular wrapper does not surface it. Verify whether the Stencil tag has it and surface.)

### G3 — `verifyLabel` doesn't support i18n keys directly (P3)

Consumers pass already-translated string. OK pattern.

### G4 — No event for "verification result" coming back from server (P3)

The component emits when verify is clicked; it doesn't track success/failure. Consumer manages state externally.

**Recommended fix:** add `@Input() verified` + `@Input() verifying` (loading) inputs so the component can render success/loading visuals.

### G5 — `falcon-verify` output uses kebab-case binding (P3)

Angular wrappers usually use camelCase outputs. The current `@Output('falcon-verify')` binding works but is non-idiomatic.

**Recommended fix:** add `@Output() verified = new EventEmitter<...>();` alias (camelCase).

### G6 — No prefix slot / icon (P2)

No leading email-icon for visual disambiguation.

### G7 — No methods proxied (P2)

### G8 — `variant` / `appearance` not supported (P2)

Doesn't follow Wave 9.C pattern.

## Missing accessibility

- Verify button must have correct `aria-label` (e.g. "Verify email").
- "Verified" state needs `aria-live` announcement.

## Missing tests

- No spec located.

## Missing Tailwind / token parity

- Verify single-border treatment renders correctly on both render paths.

## Performance risks

- None.

## Visual / interaction risks

- Verify button position relative to RTL — verify it flips correctly.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G2 | `verified` state + visual | P1 |
| G6 | Leading icon | P2 |
| G7 | Method proxies | P2 |
| G8 | variant / appearance | P2 |
| G4 | `verifying` loading state | P2 |
| G5 | camelCase output alias | P3 |

## Concrete upgrade API

```ts
@Input() verified = false;
@Input() verifying = false;
@Input() leadingIcon = 'email';
@Input() variant: 'form' | 'grid' = 'form';
@Input() appearance: 'default' | 'filled' | 'ghost' = 'default';
@Output() verified = new EventEmitter<string>();   // alias of 'falcon-verify'
async setFocus(): Promise<void>;
async clear(): Promise<void>;
```

## Shared vs per-page

All shared.

## Workarounds today

- For G2: drive `state` to a custom token-overridden 'success' state on the host.
- For G4: render a sibling spinner externally.
