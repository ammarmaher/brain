# falcon-phone-field — GAPS AND UPGRADES

## Missing capabilities

### G1 — Validation deferred (P1)

By design, but documented poorly. The component does NOT validate the phone format. Consumers MUST add `Validators.required` + a libphonenumber-based validator (or strict regex).

**Recommended fix:** ship an opt-in `@Input() validateOnBlur = false` + a pluggable validator function `validator?: (e164: string) => boolean`. OR document the Validators-only contract clearly.

### G2 — `verified` state not surfaced (P1)

Same as email-field. No "verified ✓" visual.

### G3 — No method proxies (P2)

### G4 — No `variant` / `appearance` (P2)

### G5 — kebab-case Outputs (`falcon-country-change`, `falcon-verify`) (P3)

Same idiomatic concern as email-field — add camelCase aliases.

### G6 — Default country list maintenance (P3)

Built-in full list (~250 countries) lives in Stencil. Updates (e.g. new ISO codes) require Stencil-side work. Consider exposing the list as a public export so consumers can override / merge.

### G7 — Country search predicate fixed (P3)

Search by name+iso+dial-code. No alphabet locale-aware sorting (Arabic, etc.). Consider adding `searchFn?` input.

### G8 — Flag-emoji vs flag-image (P2)

Flags use `flagEmoji` strings by default. Some platforms render emoji inconsistently. Consider adding `flagUrl?` per country for image fallback.

### G9 — No support for E.164 vs national-only display toggle (P3)

The displayed value is always national; emitted is E.164. No way to display E.164 mode (e.g. for compact tables).

## Missing accessibility

- Verify `aria-controls` on country trigger maps to country listbox.
- Verify search input inside dropdown has appropriate `aria-label`.
- Verify focus management after country select.

## Missing tests

- No Angular wrapper spec located.

## Missing Tailwind / token parity

- Verify country dropdown panel renders on both render paths.

## Performance risks

- Full country list (~250) rendered eagerly in dropdown. Verify whether virtualization is in place; if not, ~250 DOM nodes per phone field per page is heavy. **Flag as performance concern.**

## Visual / interaction risks

- RTL flips chooser to the right.
- Flag-emoji rendering varies across OSes — visual regression risk.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | Pluggable validator | P1 |
| G2 | `verified` state | P1 |
| G3 | Method proxies | P2 |
| G4 | variant / appearance | P2 |
| G8 | `flagUrl` option | P2 |
| G6 | Public country list export | P3 |
| G7 | `searchFn` input | P3 |
| G5 | camelCase Output aliases | P3 |
| Perf | Virtualize country dropdown | P2 |

## Concrete upgrade API

```ts
@Input() verified = false;
@Input() verifying = false;
@Input() validator?: (e164: string) => boolean;
@Input() variant: 'form' | 'grid' = 'form';
@Input() appearance: 'default' | 'filled' | 'ghost' = 'default';
@Input() searchFn?: (q: string, country: FalconPhoneFieldCountry) => boolean;
@Input() displayMode: 'national' | 'e164' = 'national';
@Output() countryChange = new EventEmitter<{ country: string; dialCode: string }>(); // camelCase alias
@Output() verified = new EventEmitter<{ value: string; country: string }>();
async setFocus(): Promise<void>;
async clear(): Promise<void>;
async openCountryPicker(): Promise<void>;
```

## Shared vs per-page

All shared.

## Workarounds today

- For G1: add `Validators.required + customPhoneValidator()` externally.
- For G2: drive `state='success'` after server confirm and override via token.
- For G6: filter via `countries` input.
