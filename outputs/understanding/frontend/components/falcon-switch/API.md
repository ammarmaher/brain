# falcon-switch — API

## Selectors

- Angular: `falcon-angular-switch`
- Stencil Shadow: `<falcon-switch>` (tag `'falcon-switch'`, `shadow:true`)
- Stencil Light: `<falcon-switch-tw>` (tag `'falcon-switch-tw'`, `shadow:false`)

## Import

```ts
import { FalconAngularSwitchComponent } from '@falcon/ui-core';
```

Add `FalconAngularSwitchComponent` to the consuming standalone component's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is already set on the wrapper internally.

## Inputs (all on `FalconAngularSwitchComponent`)

`[CODE]` 18 `@Input`s total (two are setters). Recount 2026-06-03 — `disabled` (the parent-driven setter) was MISSING from the prior dossier.

| Name | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'dot-knob' \| 'hidden-input' \| 'channel-pill'` | `'dot-knob'` | Three visual variants. `[CODE]` ts:50 |
| `label` | `string \| undefined` | `undefined` | Text label beside the track. `[CODE]` ts:51 |
| `helperText` | `string \| undefined` | `undefined` | Helper `<p>` below; bound to `helper-text`. `[CODE]` ts:52 |
| `errorText` | `string \| undefined` | `undefined` | Error `<p>` (`role="alert"`); bound to Stencil attr `error-message`. `[CODE]` ts:53 + html:14/38. Name differs from the Stencil prop `errorMessage`. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | **Affects the LABEL font only today** — track/knob geometry does NOT rescale (see GAPS G8). `[CODE]` ts:54 |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | Visual validation state. `[CODE]` ts:55 |
| `required` | `boolean` | `false` | Red asterisk + `aria-required`. `[CODE]` ts:56 |
| `name` | `string \| undefined` | `undefined` | Native input name. `[CODE]` ts:57 |
| `value` | `string \| number \| boolean` | `'on'` | Native form value when checked (NOT the business answer — the boolean is). `[CODE]` ts:58 |
| `inputId` | `string \| undefined` | auto `falcon-asw-{seq}` | `[CODE]` ts:59/99-102 |
| `textOn` | `string \| undefined` | `undefined` | Inner "on" text — rendered when checked. **Renders in ANY variant when set** (not channel-pill-only). `[CODE]` ts:61 + falcon-switch.tsx:191-200 |
| `textOff` | `string \| undefined` | `undefined` | Inner "off" text — rendered when unchecked. **Renders in ANY variant when set.** `[CODE]` ts:62 |
| `checkedInput` (setter) | `boolean \| null \| undefined` | — | **Bypasses CVA** — parent-driven checked. `[CODE]` ts:65-67 |
| `disabled` (setter) | `boolean \| null \| undefined` | — | **Bypasses CVA** — parent-driven disabled (G-25, 2026-05-21). Writes the same `disabled$` signal CVA's `setDisabledState` writes (single source of truth). `[CODE]` ts:77-79 |
| `useTailwind` | `boolean` | `true` | **Render-path switch.** `true` → `<falcon-switch-tw>`. `[CODE]` ts:82 |
| `rowClass` | `string` | `''` | Extra Tailwind on the label row (`row-extra-class`). Tailwind path only. `[CODE]` ts:83 + html:24 |
| `trackClass` | `string` | `''` | Extra Tailwind on the painted track (`track-extra-class`). Tailwind path only. `[CODE]` ts:84 + html:25 |
| `labelClass` | `string` | `''` | Extra Tailwind on the label text (`label-extra-class`). Tailwind path only. `[CODE]` ts:85 + html:26 |

> `[CODE]` The parent-driven disable input IS named **`disabled`** here (ts:77) — unlike `<falcon-angular-radio>`, whose equivalent is `disabledInput`. So `[disabled]="…"` DOES bind on a switch.

### Stencil-only props (NOT on the Angular wrapper)

| Prop | Type | Default | Available on |
|---|---|---|---|
| `checked` | `boolean` | `false` | BOTH tags `@Prop({mutable,reflect})` `[CODE]` falcon-switch.tsx:39 / -tw:56. Wrapper drives via `checkedInput`/CVA. |
| `errorMessage` | `string` | — | BOTH tags `[CODE]` falcon-switch.tsx:43 (the wrapper input `errorText` maps here). |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `(valueChange)` | `boolean` | `[CODE]` ts:88,124-130 — emits the new checked boolean (canonical CVA write via `handleChange`). |

`[CODE]` Stencil tags ALSO emit `falcon-change` / `falcon-blur` / `falcon-focus` (falcon-switch.tsx:61-66). The wrapper binds only `(falcon-change)` + `(falcon-blur)` (html:27-28/47-48) — `falcon-focus` is NOT surfaced (GAP).

> Note: unlike the radio's `handleChange` (which has a disabled early-return), the **switch's `handleChange` has no disabled guard** (ts:124-130) — it relies on the Stencil layer's `if (this.disabled) { event.preventDefault(); return; }` (falcon-switch.tsx:99-106) to block disabled toggles.

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-switch/falcon-switch.types.ts`:

```ts
type FalconSwitchSize = 'sm' | 'md' | 'lg';
type FalconSwitchState = 'default' | 'error' | 'success' | 'warning';
type FalconSwitchVariant = 'dot-knob' | 'hidden-input' | 'channel-pill';
interface FalconSwitchChangeDetail { checked: boolean; value: string | number | boolean | null; }
type FalconSwitchBlurDetail = FalconEventDetail<FalconSwitchChangeDetail>;
```

> The wrapper redeclares the three union types locally (ts:22-24) rather than importing them.

## Reflected props (Stencil only)

`checked`, `variant`, `size`, `state`, `disabled`, `required` are `@Prop({reflect:true})` on both tags so `:host([variant='channel-pill'])`, `:host([state='error'])`, etc. can target them.

## Mutable props (Stencil)

`checked` is `@Prop({mutable:true, reflect:true})` + `@Watch`ed (`onCheckedChange`) to re-sync the native input.

## CVA / ngModel / Reactive Forms

**YES — full ControlValueAccessor (boolean).**

```ts
providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FalconAngularSwitchComponent), multi: true }],
```

- `[CODE]` `writeValue(value)` → `value$.set(!!value)` (ts:110-112).
- `registerOnChange(fn)` — fired by `handleChange` with the boolean (ts:113-115).
- `registerOnTouched(fn)` — fired on blur (ts:132-134).
- `setDisabledState(isDisabled)` → `disabled$` signal (shared with the `disabled` input) (ts:119-121).

`[(ngModel)]`, `formControl`, `formControlName` all work.

## Signal compatibility

Internal state uses Angular signals (`value$`, `disabled$` — ts:97-98). External binding via `@Input`s/CVA; no signal-input. `OnPush` enforced.

## Methods (Stencil only — call via element ref)

| Method | Description | Available on |
|---|---|---|
| `setFocus()` | Focuses the inner native input. | BOTH tags `[CODE]` falcon-switch.tsx:82-85 / -tw:102-105 |
| `toggle()` | Toggles checked (no-op if disabled). | BOTH tags `[CODE]` falcon-switch.tsx:88-92 / -tw:107-111 |

> `[CODE]` The Angular wrapper proxies **NEITHER** — no Angular-side `focus()`/`toggle()` (GAP).

## Slots / template inputs

`[CODE]` None — the wrapper template is a pure attribute-forwarding tag-switcher (html:1-51). The label is the prop-driven `[label]`; the Stencil tags render `{this.label}` text (NO label `<slot>` — the prior dossier's "default slot for label content" is unconfirmed/fabricated).

## Supported sizes / states / variants / appearances

- Sizes: `sm` / `md` / `lg` — **label font only** (track/knob geometry is per-VARIANT, not per-size; G8).
- States: `default`, `error`, `success`, `warning` (success/warning are accepted but `hasError`-driven CSS only branches error/disabled).
- Variants: `dot-knob` (default), `hidden-input`, `channel-pill` — distinct track/knob geometry each.
- Inner labels (`textOn`/`textOff`) render in any variant when set.

## Constraints

- `[CODE]` `textOn`/`textOff` render whenever EITHER is set, in ANY variant (falcon-switch.tsx:191) — NOT channel-pill-only (prior dossier was wrong). They are display-only state words, not a two-option picker.
- `[CODE]` `size` rescales the label font, not the switch geometry (G8).
- `[CODE]` Parent-driven disable input is `disabled` (binds), parent-driven check is `checkedInput`.
- `[CODE]` `rowClass`/`trackClass`/`labelClass` flow on the Tailwind path only.
- `[CODE]` Do NOT mix CVA (`ngModel`/`formControlName`) AND `[checkedInput]` on the same instance.
- Strictly boolean — no tri-state / indeterminate.

## Accessibility

- `[CODE]` Real native `<input type="checkbox">` underneath, visually hidden but focusable + AT-readable (falcon-switch.tsx:168-188).
- `role="switch"` + `aria-checked` on BOTH the track span and the native input (falcon-switch.tsx:167,179).
- `<label htmlFor={resolvedId}>` wires the label; `aria-invalid`/`aria-required`/`aria-disabled` set appropriately; `aria-describedby` joins helper + error.
- Error `<p>` has `role="alert"`; required `*` + the track span + inner labels are `aria-hidden`.
- `[CODE]` `keydown` Enter is suppressed (no accidental submit); Space toggles natively (falcon-switch.tsx:118-123).

## Verification
🟢 CODE-VERIFIED 2026-06-03 against falcon-switch.component.ts (135 ln), .component.html (51 ln), falcon-switch.tsx (248 ln), falcon-switch-tw.tsx (249 ln), .types.ts, .utils.ts. Added the `disabled` setter input; corrected `textOn`/`textOff` to render in ANY variant (not channel-pill-only); documented `setFocus`/`toggle` exist on BOTH tags but are NOT proxied; removed the fabricated label-slot; flagged `size`=label-only (G8).
🟢 RE-VERIFIED 2026-06-03 (W1-c VERIFY) — PASS. **18 `@Input`s grep-confirmed** (incl. the parent-driven `disabled` setter, the genuine asymmetry vs radio's `disabledInput`). CVA (NG_VALUE_ACCESSOR + forwardRef + writeValue `!!value` / registerOnChange / registerOnTouched / setDisabledState → shared `disabled$`) re-confirmed. `handleChange` has NO disabled guard (relies on Stencil) re-confirmed. No correction needed.
