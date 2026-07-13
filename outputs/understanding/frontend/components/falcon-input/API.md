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
| `wrapperClass` | `string` | `''` | Caller-supplied extra Tailwind classes on the wrapper, forwarded as `wrapper-extra-class`. **Tailwind path only.** |
| `inputClass` | `string` | `''` | Extra Tailwind classes on the native input (`input-extra-class`). **Tailwind path only.** |
| `labelClass` | `string` | `''` | Extra Tailwind classes on the label (`label-extra-class`). **Tailwind path only.** |
| `iconLeft` | `boolean` | `false` | `[CODE]` falcon-input.component.ts:97 — Wave 2026-05-17 unified icon-slot API. When `true`, projects `slot="icon-left"` content at the start edge (BOTH render paths). |
| `iconRight` | `boolean` | `false` | `[CODE]` falcon-input.component.ts:98 — projects `slot="icon-right"` at the end edge (BOTH render paths). |
| `inputMode` | `'numeric' \| 'decimal' \| 'text' \| 'tel' \| 'email' \| 'search' \| 'url' \| 'none' \| undefined` | `undefined` | `[CODE]` falcon-input.component.ts:99 — forwarded as the HTML `inputmode` attr to pin the on-screen keyboard. Used by `<falcon-input-number>` to force `'numeric'`. |

> `[CODE]` There is **no `clearable`-aria-label** input on the wrapper. The Shadow tag exposes `clearAriaLabel` (default `'Clear input'`); the wrapper does NOT surface it (GAP G3). The Tailwind twin hardcodes `aria-label="Clear input"` (`[CODE]` falcon-input-tw.tsx:290).

### Stencil-only props (NOT exposed on Angular wrapper but available if you use the raw tag)

| Prop | Type | Default | Available on |
|---|---|---|---|
| `autoFocusOnMount` | `boolean` | `false` | Shadow `<falcon-input>` only `[CODE]` falcon-input.tsx:69 (NOT on `-tw`) |
| `spellcheckMode` | `boolean` | `true` | Shadow only `[CODE]` falcon-input.tsx:70 (NOT on `-tw`) |
| `clearAriaLabel` | `string` | `'Clear input'` | Shadow only `[CODE]` falcon-input.tsx:73 (the `-tw` twin hardcodes the label) |

> `[CODE]` Mutable prop `value: string` (`@Prop({ mutable: true, reflect: false })`, `@Watch`ed) exists on both Stencil tags but Angular wrapper drives it via CVA — do not bind directly.

## Outputs

`[CODE]` The wrapper template (falcon-input.component.html) binds **four** Stencil events; the only Angular `@Output` is `blur`.

| Name | Payload | Notes |
|---|---|---|
| `(blur)` | `void` | `[CODE]` falcon-input.component.ts:107 — the **only** Angular `@Output`. Re-emitted from the Stencil `falcon-blur` (added 2026-05-21) so consumer templates writing `(blur)="onBlur('field')"` actually receive it. Without this, native DOM `blur` does not bubble and per-field `touched`-gated errors never surfaced. Fires AFTER CVA `onTouched()`. |
| `falcon-input` | `CustomEvent<{ value: string }>` | Stencil keystroke event → wrapper `handleInput()` → CVA `onChange`. |
| `falcon-change` | `CustomEvent<{ value: string }>` | Stencil commit event → ALSO routed through `handleInput()`. |
| `falcon-clear` | `CustomEvent<{ value: string }>` | Stencil clear-X event → ALSO routed through `handleInput()` (value becomes `''`). |
| `falcon-focus` | `CustomEvent<{ value: string }>` | Emitted by BOTH Stencil tags `[CODE]` falcon-input.tsx:96 / falcon-input-tw.tsx:111 — but **NOT bound/re-emitted by the Angular wrapper template** (GAP G4). |

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

| Method | Description | Available on |
|---|---|---|
| `setFocus()` | Programmatically focuses the inner native input. | BOTH tags `[CODE]` falcon-input.tsx:124 / falcon-input-tw.tsx:132 |
| `clear()` | Mirrors clear-button click. | BOTH tags `[CODE]` falcon-input.tsx:130 / falcon-input-tw.tsx:137 |

> `[CODE]` The Angular wrapper does NOT proxy these methods. There is no Angular-side `focus()` / `clear()` method on `FalconAngularInputComponent` — **GAP G2**. To call them, obtain the inner Stencil element via `ViewChild` + `nativeElement` (the wrapper tags it `#inputEl`).

## Slots / template inputs

`[CODE]` falcon-input.component.html — slot wiring (corrected 2026-06-03; the prior dossier's "Tailwind path has no slots" is now **stale**):

- **Stencil Light (`<falcon-input-tw>`, `useTailwind=true`, default)**: projects `slot="icon-left"` + `slot="icon-right"` (`[CODE]` html:41-42). The Stencil twin renders absolutely-positioned icon `<span>`s and prepends `--falcon-input-icon-input-padding-{start,end}` padding to the native input (`[CODE]` falcon-input-tw.tsx:243-284). **Still NO `prefix` / `suffix` slots in the Tailwind path** (GAP G1 — prefix/suffix differ from icon-left/right).
- **Stencil Shadow (`<falcon-input>`, `useTailwind=false`)**: projects FOUR slots — `slot="prefix"`, `slot="suffix"`, `slot="icon-left"`, `slot="icon-right"` (`[CODE]` html:78-81). The Shadow `.tsx` renders `slot name="prefix"` + `iconLeft && slot name="icon-left"` inside the prefix `<span>`, mirrored for suffix (`[CODE]` falcon-input.tsx:226-285).
- **Angular wrapper**: no `ng-template` inputs.

## Supported sizes / states / variants / appearances

- Sizes: `sm` (28px), `md` (34px), `lg` (38px).
- States: `default`, `error`, `success`, `warning`.
- Variants: `form` (default), `search` (search-styled), `grid` (in-grid editing).
- Appearances: `default` (bordered), `filled` (tinted bg), `ghost` (no border).
- Feature toggles (Shadow only): `borderless`, `shadowless`, `flat`, `noFocusRing`.

## Constraints

- `[CODE]` Tailwind render path (`useTailwind=true`, default) supports `icon-left` / `icon-right` slots but NOT `prefix` / `suffix` slots (those are Shadow-only).
- `[CODE]` Tailwind render path does NOT honor `borderless` / `shadowless` / `flat` / `noFocusRing` props — those are CSS-only on the Shadow path (`:host([borderless])` etc. in falcon-input.css:21-39). The Tailwind helper `falconInputWrapperClasses()` does not branch on them (GAP G5).
- `[CODE]` The wrapper-supplied `wrapperClass` / `inputClass` / `labelClass` only flow to the Tailwind path (forwarded as `wrapper-extra-class` / `input-extra-class` / `label-extra-class`). In Shadow path they are not bound — override tokens via host class (see USAGE.md).
- `[CODE]` `falcon-focus` event is not re-emitted by the Angular wrapper template (the wrapper binds only `falcon-input`, `falcon-change`, `falcon-clear`, `falcon-blur`) — GAP G4.
- `[CODE]` The Tailwind twin hardcodes `aria-label="Clear input"`; the Shadow path supports custom `clearAriaLabel` via Stencil prop but the Angular wrapper does NOT expose it (GAP G3).

## Accessibility

- `<label htmlFor={resolvedId}>` automatically wired when `label` is set.
- `aria-invalid` set when `hasError`.
- `aria-required` set when `required`.
- `aria-describedby` joins helper + error IDs.
- Error message paragraph has `role="alert"`.
- Required asterisk is `aria-hidden="true"`.
- Clear button has `aria-label`, `tabindex={-1}`, and `onMouseDown={preventDefault}` so focus stays on the input.
- `[CODE]` Projected icon `<span>`s in the `-tw` twin are `aria-hidden="true"` + `pointer-events-none` (falcon-input-tw.tsx:246-249/277-280) — decorative only.

## Verification
🟢 CODE-VERIFIED 2026-06-03; RE-VERIFIED 2026-06-03 (W1-a) against falcon-input.component.ts (243 ln) + .html (84 ln) — all 30 inputs, the `disabledFromInput` boolean/string-truthy setter, the single `@Output() blur` (re-emitted from `falcon-blur` after CVA `onTouched()`), and the full CVA contract incl. the `writeValue` + `componentOnReady().then(push)` cell-remount guard confirmed verbatim. Drift corrected vs the pre-B01 dossier: `iconLeft`/`iconRight`/`inputMode` inputs + `(blur)` Output (the old `falconFocus` Output claim was wrong — no such Output exists); both render paths project icon slots; `setFocus`/`clear` exist on BOTH Stencil tags. W1-a verdict: PASS (no further drift).
