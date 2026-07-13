# falcon-mobile-number (LEGACY FACADE — REMOVED) — API

> **RECONCILE 2026-06-03 (B22):** The `<falcon-mobile-number>` façade is **DELETED from source.** The surface below is the API it last exposed (Wave 2 / Wave 7), retained as a migration map. For all new + existing code, use `<falcon-angular-phone-field>` — its API is documented in the `falcon-phone-field` dossier. The legacy → modern input mapping is in the table notes.

## Live status
- `[CODE]` `FalconMobileNumberComponent` no longer exists; the import `import { FalconMobileNumberComponent } from '@falcon'` no longer resolves (barrel re-export removed from `shared-ui/index.ts`).

---

## Historical API (component as it last existed)

## Selector
- `<falcon-mobile-number>` — Angular bespoke standalone component (single-render, no Stencil twin).

## Import path (no longer valid)
```ts
// REMOVED — does not resolve in 2026-06-03 tree
import { FalconMobileNumberComponent } from '@falcon';
// Use instead:
import { FalconAngularPhoneFieldComponent } from '@falcon';
```

## TypeScript types
- The component did NOT export its own types — it accepted a legacy E.164 string or `{ e164Number, dialCode }` shape via `writeValue`.

## @Inputs (decorator-based `@Input` — legacy, NOT Angular-21 `input()`)

| Name | Type | Default | Notes / legacy→modern mapping |
|---|---|---|---|
| `labelKey` | `string` | `''` | Translation key (translated internally via `TranslateService`). → `<falcon-angular-phone-field [label]>` (pre-translated). |
| `required` | `boolean` | `false` | → drives validator; phone-field uses Reactive-Forms validators externally. |
| `preferredCountries` | `ReadonlyArray<string>` | `['sa', 'ae']` | Lowercase ISO-2. **Silent no-op** (Falcon renders a full searchable list). No equivalent needed. |
| `defaultCountry` | `string` | `'sa'` | Lowercase ISO-2 → upper-cased. → `<falcon-angular-phone-field [country]="'SA'">`. |
| `showDialCode` | `boolean` | `true` | **Silent no-op** (Falcon always renders the dial code). |
| `maxLength` | `number` | `15` | **Silent no-op.** |
| `error` | `boolean` | `false` | Drove the `state` input. → `[state]="… ? 'error' : 'default'"`. |
| `errorMessageKey` | `string` | `''` | Translation key. → `[errorMessage]`. |
| `requiredErrorMessageKey` | `string` | `'validation.phoneRequired'` | Translation key. → `[errorMessage]` via the consumer's validator. |
| `useCustomStyle` | `boolean` | `true` | API-compat only — drove a `@HostBinding('class.fpf-standard')`. |

## @Outputs
- _None._ Used CVA's `onChange` callback exclusively. (The modern `<falcon-angular-phone-field>` exposes `(blur)` + emits `falcon-verify`/`falcon-country-change`.)

## CVA / ngModel / Reactive Forms
- Provided BOTH `NG_VALUE_ACCESSOR` AND `NG_VALIDATORS` (for `required`).
- `writeValue(value)` accepted:
  - `string` (E.164 directly).
  - `{ e164Number?, number? }` (legacy `ChangeData` object).
  - `null` / other → empty.
- `validate(control)` returned `{ required: true }` when empty + required.
- Worked with `formControlName` and `[(ngModel)]`.

## Reflected props / mutable props
- _N/A._ Single-render Angular component — no Stencil `@Prop({reflect})` / `@Prop({mutable})` layer.

## Signal compatibility
- `[INFERRED]` Legacy decorator `@Input`s + manual CVA; no signal inputs. (Source no longer on disk to re-confirm internal state primitives.)

## Methods
- _None public._

## Slots / ng-template inputs
- _None._

## Supported sizes / states / variants / appearances
- _None of its own._ Inherited the embedded Falcon phone-field's defaults.

## Important constraints
- Three inputs were silent no-ops: `preferredCountries`, `showDialCode`, `maxLength`. Consumers passing them expected behavior they did not get.
- Owned a local dial-code → ISO-2 map (`ISO2_TO_DIAL`) — 25 countries. Needing more required extending the map (a reason to migrate).
- Output transformation: Stencil emitted `{ value, country, dialCode, nationalNumber }`; the façade recomposed E.164 as `${dialCode}${nationalNumber}` (digits only, no spaces).
- `touchedFlag` was set on `handleFalconBlur` (native blur) → triggered required-error display.

## Accessibility
- Delegated to `<falcon-angular-phone-field>` for native input + country chooser semantics (no a11y of its own).

## Verification
🟡 CODE-DERIVED 2026-06-03 (B22) from the prior Wave-2/Wave-7 dossier — the source file is DELETED and cannot be re-read, so the @Input table is preserved verbatim from the last verified dossier, not re-confirmed against live code. The deletion itself is 🟢 CODE-VERIFIED (folder + barrel export both gone). Legacy→modern mapping 🟡 CODE-DERIVED against the live `<falcon-angular-phone-field>` API.
