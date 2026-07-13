# falcon-radio — API

## Selectors

- Angular: `falcon-angular-radio`
- Stencil Shadow: `<falcon-radio>` (tag `'falcon-radio'`, `shadow: true`)
- Stencil Light: `<falcon-radio-tw>` (tag `'falcon-radio-tw'`, `shadow: false`)

## Import

```ts
import { FalconAngularRadioComponent } from '@falcon/ui-core';
```

Add `FalconAngularRadioComponent` to the consuming standalone component's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is already set on the wrapper internally — the host does NOT need it.

## Inputs (all on `FalconAngularRadioComponent`)

`[CODE]` **15** `@Input`s total (incl. two setter-inputs `checkedInput` + `disabledInput`). Recount 2026-06-03 (B06-VERIFY) — `disabledInput` is present in the live code; the prior "17" was a miscount (the enumerated list below is the authoritative 15: label, helperText, errorText, size, state, required, name, value, inputId, checkedInput, disabledInput, useTailwind, rowClass, markClass, labelClass — grep-confirmed against falcon-radio.component.ts).

| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `string \| undefined` | `undefined` | Text label beside the mark. `[CODE]` ts:49 |
| `helperText` | `string \| undefined` | `undefined` | Helper paragraph below; bound to Stencil `helper-text`. `[CODE]` ts:50 |
| `errorText` | `string \| undefined` | `undefined` | Error paragraph below (`role="alert"`); bound to Stencil attr `error-message`. `[CODE]` ts:51 + html:11/33. **Name differs from the Stencil prop `errorMessage`** (alias — see Constraints). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Mark dims 14/16/18px. `[CODE]` ts:52 |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | Visual validation state. `[CODE]` ts:53 |
| `required` | `boolean` | `false` | Red asterisk + `aria-required`. `[CODE]` ts:54 |
| `name` | `string \| undefined` | `undefined` | **Exclusivity key** — radios sharing a `name` are one native group. `[CODE]` ts:55 |
| `value` | `string \| number \| boolean` | `'on'` | The value emitted (via CVA) when this radio is selected. `[CODE]` ts:56 |
| `inputId` | `string \| undefined` | auto `falcon-arad-{seq}` | Ties label `for` + custom id. `[CODE]` ts:57/90-93 |
| `checkedInput` (setter) | `boolean \| null \| undefined` | — | **Bypasses CVA** — parent-driven checked state. Used by the radio-group + wb-radio-pill. `[CODE]` ts:60-62 |
| `disabledInput` (setter) | `boolean \| null \| undefined` | — | **Bypasses CVA** — parent-driven disabled. Added because template-only consumers (no FormControl) could not disable the control; without it, view-mode radios stayed clickable. Writes the same `disabled` signal CVA's `setDisabledState` writes. `[CODE]` ts:64-73 |
| `useTailwind` | `boolean` | `true` | **Render-path switch.** `true` → `<falcon-radio-tw>` (Light DOM). `false` → `<falcon-radio>` (Shadow DOM). `[CODE]` ts:76 |
| `rowClass` | `string` | `''` | Extra Tailwind classes on the label row (`row-extra-class`). **Tailwind path only.** `[CODE]` ts:77 + html:21 |
| `markClass` | `string` | `''` | Extra Tailwind classes on the painted mark (`mark-extra-class`). **Tailwind path only.** `[CODE]` ts:78 + html:22 |
| `labelClass` | `string` | `''` | Extra Tailwind classes on the label text (`label-extra-class`). **Tailwind path only.** `[CODE]` ts:79 + html:23 |

> `[CODE]` There is **no `disabled` `@Input`** under that exact name — the parent-driven disable input is named **`disabledInput`** (ts:71). `[disabled]="…"` will NOT bind. (This differs from `<falcon-angular-switch>`, whose parent-driven input IS named `disabled`.)

### Stencil-only props (NOT on the Angular wrapper)

| Prop | Type | Default | Available on |
|---|---|---|---|
| `checked` | `boolean` | `false` | BOTH tags `@Prop({mutable,reflect})` `[CODE]` falcon-radio.tsx:39 / -tw:50. Wrapper drives it via `checkedInput`/CVA → `[attr.checked]`. |
| `errorMessage` | `string` | — | BOTH tags `[CODE]` falcon-radio.tsx:42 (the wrapper input named `errorText` maps to this). |

## Outputs

`[CODE]` The wrapper exposes exactly **one** `@Output`.

| Name | Payload | Notes |
|---|---|---|
| `(valueChange)` | `boolean` | `[CODE]` ts:82 — emits `true` when this radio becomes checked. Re-emitted from Stencil `falcon-change` via `handleChange()` (ts:116-128), which is the canonical CVA write (`onChange(this.value)` when checked, `null` otherwise). Guarded: a disabled radio emits nothing (ts:121). |

`[CODE]` Stencil tags ALSO emit `falcon-change` (`{checked, value}`), `falcon-blur` (`{checked, value}`), and `falcon-focus` (`{checked, value}`) (falcon-radio.tsx:56-61). The wrapper template binds only `(falcon-change)` + `(falcon-blur)` (html:24-25/41-42) — `falcon-focus` is NOT surfaced (GAP).

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-radio/falcon-radio.types.ts`:

```ts
type FalconRadioSize = 'sm' | 'md' | 'lg';
type FalconRadioState = 'default' | 'error' | 'success' | 'warning';
interface FalconRadioChangeDetail { checked: boolean; value: string | number | boolean | null; }
type FalconRadioBlurDetail = FalconEventDetail<FalconRadioChangeDetail>;
```

> The Angular wrapper redeclares `FalconRadioSize`/`FalconRadioState` locally (ts:22-23) rather than importing the Stencil types.

## Reflected props (Stencil only)

`checked`, `size`, `state`, `disabled`, `required` are `@Prop({reflect:true})` on both tags so `:host([state='error'])`, `:host([disabled])`, the `.size-*` mapping, etc. can target them.

## Mutable props (Stencil)

`checked` is `@Prop({mutable:true, reflect:true})` and `@Watch`ed (`onCheckedChange`) to re-sync the native input.

## CVA / ngModel / Reactive Forms

**YES — full ControlValueAccessor, with a group-valued twist.**

```ts
providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FalconAngularRadioComponent), multi: true }],
```

- `[CODE]` `writeValue(value)` receives the **group's currently-selected value** and sets `checked$ = (value === this.value)` (ts:102-104). It is NOT a boolean toggle — binding a boolean control to a single radio will not behave like a checkbox.
- `registerOnChange(fn)` — fired on selection with this radio's `value` (or `null`).
- `registerOnTouched(fn)` — fired on blur (ts:130-132).
- `setDisabledState(isDisabled)` — toggles the same `disabled` signal as `disabledInput`.

`[(ngModel)]`, `formControl`, and `formControlName` all work (value must match the radio's `value`).

## Signal compatibility

Internal state uses Angular signals (`checked$`, `disabled` — ts:88-89). External binding is via `@Input`s/CVA; no signal-input variant. `OnPush` enforced.

## Methods (Stencil only — call via element ref)

| Method | Description | Available on |
|---|---|---|
| `setFocus()` | Focuses the inner native input. | BOTH tags `[CODE]` falcon-radio.tsx:77-80 / -tw:92-95 |
| `select()` | One-way select (no-op if already checked or disabled). | BOTH tags `[CODE]` falcon-radio.tsx:83-87 / -tw:97-101 |

> `[CODE]` The Angular wrapper proxies **NEITHER** — there is no Angular-side `focus()`/`select()` on `FalconAngularRadioComponent` (GAP). Reach the inner Stencil element via `ViewChild` if needed (template tags the host with `#host` but the inner element is not separately tagged).

## Slots / template inputs

`[CODE]` None projected by the Angular wrapper template (it is a pure attribute-forwarding tag-switcher — html:1-45). The label is the prop-driven `[label]`. The Stencil tags render the label internally; they do NOT expose a `<slot>` for label content (the prior dossier's "default slot for label content" is unconfirmed — the `.tsx` renders `{this.label}` text, no `<slot>`).

## Supported sizes / states / variants / appearances

- Sizes: `sm` (14px mark), `md` (16px), `lg` (18px).
- States: `default`, `error`, `success`, `warning` (note: `success`/`warning` map through `hasError=false` in the utils, so they render like default unless CSS targets the reflected `state` attr).
- No `variant` / `appearance` axis (radio has a single visual shape — the border-width-5 dot).

## Constraints

- `[CODE]` Parent-driven disable is `disabledInput`, NOT `disabled` (ts:71) — `[disabled]` will not bind.
- `[CODE]` `errorText` (wrapper) ⇒ `error-message` (Stencil attr) — works, but the name differs from the Stencil prop `errorMessage` and from siblings.
- `[CODE]` `rowClass`/`markClass`/`labelClass` only flow on the Tailwind path (forwarded as `*-extra-class`); the Shadow path does not bind them (override via tokens).
- `[CODE]` Do NOT mix CVA (`formControlName`/`ngModel`) AND `[checkedInput]` on the same instance — two competing sources of `checked$`.
- `[CODE]` CVA `writeValue` takes the **group value**, not a boolean.

## Accessibility

- `[CODE]` Real native `<input type="radio">` underneath, visually hidden (opacity-0, absolute, `appearance:none`) but focusable + AT-readable (falcon-radio.tsx:157-176).
- `<label htmlFor={resolvedId}>` wires the label.
- `aria-invalid` when `hasError`; `aria-required` when `required`; `aria-disabled` mirrors `disabled`.
- `aria-describedby` joins helper + error IDs (`joinIds`, falcon-radio.tsx:130-135).
- Error paragraph has `role="alert"`; required asterisk is `aria-hidden="true"`.
- `[CODE]` `keydown` Enter is suppressed (so selecting inside a form does not submit); Space + arrow keys are native (falcon-radio.tsx:118-123). Browser handles same-`name` exclusivity + arrow-key movement.

## Verification
🟢 CODE-VERIFIED 2026-06-03 against falcon-radio.component.ts (133 ln), .component.html (45 ln), falcon-radio.tsx (222 ln), falcon-radio-tw.tsx (212 ln), .types.ts, .utils.ts. Added `disabledInput`/`inputId`/`value` to the inputs table; corrected the single `@Output` to `(valueChange)`; documented `setFocus`/`select` exist on BOTH tags but are NOT proxied; removed the unconfirmed label-slot claim.
🟢 RE-VERIFIED 2026-06-03 (W1-c VERIFY pass) — **CORRECTED the `@Input` total from 17 → 15** (grep of `@Input` on falcon-radio.component.ts = 15 decorators; the prior "17" contradicted its own 15-name enumeration). CVA contract (NG_VALUE_ACCESSOR + forwardRef + writeValue group-value compare / registerOnChange / registerOnTouched / setDisabledState) re-confirmed. `disabledInput`-not-`disabled` asymmetry vs switch re-confirmed. Consumer sweep re-grepped (see USAGE).
