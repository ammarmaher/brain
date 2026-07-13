# falcon-checkbox — API

## Selectors

- Angular: `falcon-angular-checkbox`
- Stencil Shadow: `<falcon-checkbox>` (tag `'falcon-checkbox'`, `shadow: true`)
- Stencil Light: `<falcon-checkbox-tw>` (tag `'falcon-checkbox-tw'`, `shadow: false`)

## Import

```ts
import { FalconAngularCheckboxComponent } from '@falcon/ui-core';
```

Add to the consuming component's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is declared on the wrapper internally — the host does NOT need it.

## Inputs (all on `FalconAngularCheckboxComponent`)

| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `string?` | `undefined` | Label text. **Prop-only — there is NO `<ng-content>` projection** (the wrapper is a pure tag-switcher; the Stencil tags render `{this.label}` with no default `<slot/>`). |
| `helperText` | `string?` | `undefined` | Helper paragraph below; hidden when `errorText` set. |
| `errorText` | `string?` | `undefined` | Error paragraph (`role="alert"`); forwarded to Stencil as `error-message`. **Naming inconsistency vs `errorMessage` — GAP G1.** |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Box size 14/16/18px via `--falcon-checkbox-box-size-*`. |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | Visual validation state. |
| `readonly` | `boolean` | `false` | Blocks toggle (guarded in `handleInputChange`). |
| `required` | `boolean` | `false` | Red asterisk + `aria-required`. |
| `name` | `string?` | `undefined` | Native name attr. |
| `value` | `string \| number \| boolean` | `'on'` | Native form-submit value when checked (NOT the boolean answer — that comes from CVA / `valueChange`). |
| `inputId` | `string?` | auto `falcon-acb-{seq}` | Tie label `for` + custom id. |
| `indeterminate` | `boolean` (setter) | `false` | Tri-state display. **Lost on user toggle** (matches native). |
| `checkedInput` | `boolean \| null \| undefined` (setter) | — | **Direct boolean that BYPASSES CVA** — used by `<falcon-angular-checkbox-group>` for parent-driven binding. Do not combine with `[(ngModel)]`. |
| `useTailwind` | `boolean` | `true` | Render-path switch: `true` → `<falcon-checkbox-tw>` (Light), `false` → `<falcon-checkbox>` (Shadow). |
| `rowClass / boxClass / labelClass` | `string` | `''` | Extra Tailwind classes; **Tailwind/Light path only**, forwarded as `row-extra-class` / `box-extra-class` / `label-extra-class`. |

> **No `disabled` `@Input`.** Disabled state is driven ONLY through CVA `setDisabledState` (e.g. `formControl.disable()`), which sets an internal `disabled` signal forwarded to the Stencil tag as `[attr.disabled]`. A `[disabled]="true"` template binding has no input to land on — use `readonly` for a non-CVA lock, or a disabled `FormControl`. (GAP G8.)

### Stencil-only props (NOT exposed on the Angular wrapper)

| Prop | Type | Default | Notes |
|---|---|---|---|
| `checked` | `boolean` | `false` | `@Prop({ mutable: true, reflect: true })`. The wrapper drives it via `[attr.checked]` from the `value$` signal. |
| `disabled` | `boolean` | `false` | `@Prop({ reflect: true })`. Driven by the wrapper's CVA signal. |

## Outputs (Angular wrapper)

| Name | Payload | Notes |
|---|---|---|
| `valueChange` | `boolean` | Canonical CVA write; fires on every toggle (and folds indeterminate→false). |

## Stencil events (raw tags — both Shadow + `-tw`, 1:1)

| Event | Detail | Surfaced as wrapper output? |
|---|---|---|
| `falcon-change` | `{ checked: boolean; value: string\|number\|boolean\|null }` | → `valueChange` (boolean only). |
| `falcon-blur` | same shape | → `onTouched()` (CVA), no public output. |
| `falcon-focus` | same shape | **NOT bound by the Angular wrapper** (GAP G7). |

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-checkbox/falcon-checkbox.types.ts`:

```ts
type FalconCheckboxSize  = 'sm' | 'md' | 'lg';
type FalconCheckboxState = 'default' | 'error' | 'success' | 'warning';
interface FalconCheckboxChangeDetail { checked: boolean; value: string | number | boolean | null; }
type FalconCheckboxBlurDetail = FalconEventDetail<FalconCheckboxChangeDetail>;
```

## Reflected props (Stencil)

`checked`, `indeterminate`, `size`, `state`, `disabled`, `readonly`, `required` are reflected to host attributes → `:host([checked])`, `:host([indeterminate])`, `:host([state='error'])` CSS can target them. (Both tags.)

## Mutable props (Stencil)

`checked` and `indeterminate` are `@Prop({ mutable: true })` and `@Watch`ed: `onCheckedChange` syncs the native input's `.checked`; `onIndeterminateChange` syncs the native `.indeterminate` DOM property (not an attribute) — `[CODE]` falcon-checkbox.tsx:73-102.

## CVA / ngModel / Reactive Forms

**YES — full ControlValueAccessor support.**

```ts
providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FalconAngularCheckboxComponent), multi: true }],
```

- `writeValue(boolean | null | undefined)` — coerces to boolean (`!!value`) → the `value$` signal.
- `registerOnChange(fn)` — invoked on every `falcon-change`.
- `registerOnTouched(fn)` — invoked on `falcon-blur`.
- `setDisabledState(isDisabled)` — sets the internal `disabled` signal (the only disabled path).

`[(ngModel)]`, `formControl`, `formControlName` all work. Toggling auto-resets `indeterminate` to false (`handleChange` — ts:114-122).

**Two ways to set checked, mutually exclusive in spirit:**
1. **CVA** — `[(ngModel)]` / `formControlName` (canonical for standalone use).
2. **`checkedInput`** — parent-driven bypass; used by `<falcon-angular-checkbox-group>` so it can manage selection without per-checkbox CVA registration.

## Methods (Stencil only — call via element ref)

| Method | Tag | Description |
|---|---|---|
| `setFocus()` | both | Focus the underlying native input — `[CODE]` falcon-checkbox.tsx:86-89. |
| `toggle()` | both | Toggle checked (no-op if disabled/readonly) — `[CODE]` falcon-checkbox.tsx:92-96. |

> The Angular wrapper proxies NEITHER (GAP G4). There is no `@ViewChild` on the inner Stencil element, so reaching them requires a host-element query. There is no Angular-side `setFocus()`/`toggle()`.

## Slots / template inputs

- **None.** Neither Stencil tag declares a default `<slot/>` for label content, and the Angular wrapper template has no `<ng-content>`. Rich label content (a link inside an "I agree" label) is **not supported** today — GAP G2/G7. (Prior dossier text claiming a default-slot projection was incorrect — corrected this sweep.)

## Sizes / states / variants

- Sizes: `sm` (≈14px box), `md` (16px), `lg` (18px). Check glyph scales 9/10/12px.
- States: `default` / `error` / `success` / `warning`.
- No `variant` / `appearance` axis.

## Constraints

- `indeterminate` is transient — lost on user toggle; recompute it (e.g. as a `computed` off the selection set) if a header must keep partial state.
- `checkedInput` and CVA are two owners for one fact — never use both on one instance.
- No `disabled` input — use a disabled `FormControl` or `readonly`.
- No rich-label slot — `label` is plain text.

## Accessibility

- Real native `<input type="checkbox">` underneath → full native keyboard (Space toggles) + screen-reader semantics. Enter is suppressed so it never submits the surrounding form (`handleKeyDown` — tsx:130-135).
- `aria-checked` = `'true' | 'false' | 'mixed'` (mixed for indeterminate); JS `.indeterminate` DOM property synced in `componentDidLoad` + on `@Watch`.
- `aria-invalid` (error), `aria-required`, `aria-disabled`, `aria-describedby` (helper+error ids).
- Label is a `<label htmlFor={resolvedId}>` wrapping the box (clicking label toggles).
- Error paragraph `role="alert"`; required asterisk `aria-hidden`.

## Verification
🟢 code-verified against the wrapper + both Stencil tags + types (read 2026-06-03). `falcon-focus` event + `setFocus()`/`toggle()` methods 🟢 confirmed present (previously "verify"). The `<ng-content>` / default-slot claim 🟢 confirmed FALSE and corrected. `disabled`-via-CVA-only 🟢 confirmed.
🟢 RE-VERIFIED 2026-06-03 (W1-c VERIFY) — PASS, no corrections. 16 `@Input`s grep-confirmed; CVA (NG_VALUE_ACCESSOR + forwardRef + writeValue `!!value` / registerOnChange / registerOnTouched / setDisabledState) re-confirmed; `checkedInput` CVA-bypass and indeterminate-resets-on-toggle re-confirmed against falcon-checkbox.component.ts.
