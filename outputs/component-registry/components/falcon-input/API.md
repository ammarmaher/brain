# falcon-input — API

## Selectors

- Angular: `falcon-angular-input`
- Stencil Shadow: `<falcon-input>` (tag `'falcon-input'`, `shadow: true`)
- Stencil Light: `<falcon-input-tw>` (tag `'falcon-input-tw'`, `shadow: false`)

## Import

```ts
import { FalconAngularInputComponent } from '@falcon/ui-core/angular-wrapper/components/falcon-input';
// or via barrel:
import { FalconAngularInputComponent } from '@falcon/ui-core';
```

Add `FalconAngularInputComponent` to the consuming standalone component's `imports: []`. Schema `CUSTOM_ELEMENTS_SCHEMA` is already set on the wrapper internally — the host component does NOT need it.

## Inputs (all on `FalconAngularInputComponent`)

| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `string \| undefined` | `undefined` | Renders a `<label>` above the field. |
| `placeholder` | `string \| undefined` | `undefined` | HTML `placeholder` attr. |
| `helperText` | `string \| undefined` | `undefined` | Renders helper paragraph below; hidden when `errorMessage` is set. |
| `errorMessage` | `string \| undefined` | `undefined` | Renders error paragraph below with `role="alert"`. Implicitly sets error state. |
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'search' \| 'tel' \| 'url'` | `'text'` | Native input type. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Maps to `--falcon-density-input-height-*` tokens. |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | Visual validation state. Implicit `error` when `errorMessage` is set. |
| `variant` | `'form' \| 'search' \| 'grid'` | `'form'` | Wave 9.C — visual variant per architect §5.12.2. Reflected to host. |
| `appearance` | `'default' \| 'filled' \| 'ghost'` | `'default'` | Wave 9.C — surface appearance. Reflected to host. |
| `readonly` | `boolean` | `false` | |
| `required` | `boolean` | `false` | Renders red asterisk after label + sets `aria-required`. |
| `clearable` | `boolean` | `false` | Renders X clear-button when value is non-empty. |
| `name` | `string \| undefined` | `undefined` | Native input name attr. |
| `inputId` | `string \| undefined` | auto-generated `falcon-ai-{seq}` | Tie label `for` + custom id. |
| `autocomplete` | `string` | `'off'` | Native autocomplete attr. |
| `maxlength` | `number \| undefined` | `undefined` | |
| `minlength` | `number \| undefined` | `undefined` | |
| `borderless` | `boolean` | `false` | **Stencil-Shadow path only.** Removes border via `:host([borderless])` CSS rule. |
| `shadowless` | `boolean` | `false` | **Stencil-Shadow path only.** Removes drop shadow. |
| `flat` | `boolean` | `false` | **Stencil-Shadow path only.** Removes radius. |
| `noFocusRing` | `boolean` | `false` | **Stencil-Shadow path only.** Removes focus halo. |
| `useTailwind` | `boolean` | `true` | **Render-path switch.** `true` → `<falcon-input-tw>` (Light DOM). `false` → `<falcon-input>` (Shadow DOM). |
| `wrapperClass` | `string` | `''` | Caller-supplied extra Tailwind classes on the wrapper. **Tailwind path only.** |
| `inputClass` | `string` | `''` | Extra Tailwind classes on the native input. **Tailwind path only.** |
| `labelClass` | `string` | `''` | Extra Tailwind classes on the label. **Tailwind path only.** |

### Stencil-only props (NOT exposed on Angular wrapper but available if you use the raw tag)

| Prop | Type | Default |
|---|---|---|
| `autoFocusOnMount` | `boolean` | `false` |
| `spellcheckMode` | `boolean` | `true` |
| `clearAriaLabel` | `string` | `'Clear input'` |

> Mutable prop `value: string` exists on both Stencil tags but Angular wrapper drives it via CVA — do not bind directly.

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `falcon-input` | `CustomEvent<{ value: string }>` | Native input event (keystroke). |
| `falcon-change` | `CustomEvent<{ value: string }>` | Native change event (commit). |
| `falcon-focus` | `CustomEvent<{ value: string }>` | Stencil Shadow only — NOT re-emitted by Angular wrapper. |
| `falcon-blur` | `CustomEvent<{ value: string }>` | Wrapper invokes `onTouched()` so CVA marks dirty. |
| `falcon-clear` | `CustomEvent<{ value: string }>` | Fires when clear-X is pressed (value becomes `''`). |

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-input/falcon-input.types.ts`:

```ts
type FalconInputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
type FalconInputSize = 'sm' | 'md' | 'lg';
type FalconInputState = 'default' | 'error' | 'success' | 'warning';
type FalconInputVariant = 'form' | 'search' | 'grid';
type FalconInputAppearance = 'default' | 'filled' | 'ghost';
type FalconInputEventDetail = FalconEventDetail<string>;
```

## Reflected props (Stencil only)

`size`, `state`, `variant`, `appearance`, `disabled`, `readonly`, `required`, `clearable`, `borderless`, `shadowless`, `flat`, `noFocusRing` are reflected to host attributes so `:host([state='error'])`, `:host([appearance='filled'])`, etc. CSS rules can target them.

## Mutable props (Stencil)

`value` is `@Prop({ mutable: true, reflect: false })` and is `@Watch`ed for parent-driven updates.

## CVA / ngModel / Reactive Forms

**YES — full ControlValueAccessor support.**

```ts
providers: [
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FalconAngularInputComponent),
    multi: true,
  },
],
```

- `writeValue(value: string | null | undefined)` — sets internal signal.
- `registerOnChange(fn)` — invoked on every input event + on clear.
- `registerOnTouched(fn)` — invoked on blur.
- `setDisabledState(isDisabled)` — toggles internal `disabled` signal.

`[(ngModel)]`, `[ngModel] + (ngModelChange)`, `formControl`, and `formControlName` all work.

## Signal compatibility

Internal state uses Angular signals (`value`, `disabled`). External binding is still via `@Input`s and `(ngModelChange)` — there is no signal-input variant yet. `OnPush` change detection enforced.

## Methods (Stencil only — call via element ref)

| Method | Description |
|---|---|
| `setFocus()` | Programmatically focuses the inner native input. |
| `clear()` | Mirrors clear-button click. |

> The Angular wrapper does NOT proxy these methods. To call them, obtain the inner Stencil element via `ViewChild` + `nativeElement`. There is no Angular-side `focus()` / `clear()` method — **GAP**.

## Slots / template inputs

- **Stencil Shadow (`<falcon-input>`)**: `slot="prefix"`, `slot="suffix"` (passed through via `<ng-content select="[slot=prefix]">` and `<ng-content select="[slot=suffix]">` in the wrapper).
- **Stencil Light (`<falcon-input-tw>`)**: **NO SLOTS**. Prefix/suffix slots are unavailable in the Tailwind render path. This is a documented divergence — **GAP**.
- **Angular wrapper**: no `ng-template` inputs.

## Supported sizes / states / variants / appearances

- Sizes: `sm` (28px), `md` (34px), `lg` (38px).
- States: `default`, `error`, `success`, `warning`.
- Variants: `form` (default), `search` (search-styled), `grid` (in-grid editing).
- Appearances: `default` (bordered), `filled` (tinted bg), `ghost` (no border).
- Feature toggles (Shadow only): `borderless`, `shadowless`, `flat`, `noFocusRing`.

## Constraints

- Tailwind render path (`useTailwind=true`, default) does NOT support `prefix` / `suffix` slots.
- Tailwind render path does NOT honor `borderless` / `shadowless` / `flat` / `noFocusRing` props — those are CSS-only on the Shadow path.
- The wrapper-supplied `wrapperClass` / `inputClass` / `labelClass` only flow to the Tailwind path. In Shadow path, override tokens via host class (see USAGE.md).
- `falcon-focus` event is not re-emitted by the Angular wrapper template (the wrapper only listens to `falcon-input`, `falcon-change`, `falcon-clear`, `falcon-blur`).
- The Tailwind path emits a generic `Clear input` aria-label; the Shadow path supports custom `clearAriaLabel` via Stencil prop but the Angular wrapper does NOT expose it.

## Accessibility

- `<label htmlFor={resolvedId}>` automatically wired when `label` is set.
- `aria-invalid` set when `hasError`.
- `aria-required` set when `required`.
- `aria-describedby` joins helper + error IDs.
- Error message paragraph has `role="alert"`.
- Required asterisk is `aria-hidden="true"`.
- Clear button has `aria-label`, `tabindex={-1}`, and `onMouseDown={preventDefault}` so focus stays on the input.
