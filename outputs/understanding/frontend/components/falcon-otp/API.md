# falcon-otp — API

## Selectors

- Angular: `falcon-angular-otp`
- Stencil Shadow: `<falcon-otp>` (tag `'falcon-otp'`, `shadow: true`)
- Stencil Light: `<falcon-otp-tw>` (tag `'falcon-otp-tw'`, `shadow: false`)

## Import

```ts
import { FalconAngularOtpComponent } from '@falcon/ui-core';
import { FormsModule } from '@angular/forms'; // for [(ngModel)]
```

Add `FalconAngularOtpComponent` to the host's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is declared on the wrapper internally (`[CODE]` falcon-otp.component.ts:34) — the host does NOT need it.

## Inputs (all on `FalconAngularOtpComponent`)

| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `string?` | `undefined` | Renders a `<label htmlFor={id}-0>` above the boxes. |
| `placeholder` | `string` | `''` | Per-box placeholder. |
| `helperText` | `string?` | `undefined` | Helper paragraph below; hidden when `errorMessage` is set. |
| `errorMessage` | `string?` | `undefined` | Error paragraph below with `role="alert"`; implicitly sets error state (`isFieldInError`). |
| `length` | `number` | `6` | Number of boxes. `@Watch`ed — reshaping preserves as much of the value as possible. **Must equal the backend-issued code length.** |
| `mask` | `boolean` | `false` | Boxes render as `type="password"` (dots). For true PINs, not transient OTPs. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Box square size (36 / 44 / 52 px). |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | Visual state; `error` (or a non-empty `errorMessage`) paints boxes red. |
| `required` | `boolean` | `false` | Red `*` after label + `aria-required` on each box. |
| `name` | `string?` | `undefined` | Box names become `{name}-{index}`. |
| `inputId` | `string?` | auto `falcon-otp-ng-{seq}` | Wrapper auto-IDs via a module `__idSeq` (`[CODE]` :75-78). |
| `pattern` | `string` | `'[0-9]'` | Per-box character class; anchored internally; bad regex falls back to numeric (`[CODE]` falcon-otp.utils.ts:52-62). |
| `useTailwind` | `boolean` | `true` | Render-path switch: `true` → `<falcon-otp-tw>` (Light DOM, **default**); `false` → `<falcon-otp>` (Shadow). |
| `wrapperClass` | `string` | `''` | Extra Tailwind classes on the wrapper. **Tailwind path only** → `wrapper-extra-class`. |
| `boxClass` | `string` | `''` | Extra classes on each box. **Tailwind path only** → `box-extra-class`. |
| `inputClass` | `string` | `''` | Extra classes on each input. **Tailwind path only** → `input-extra-class`. |
| `labelClass` | `string` | `''` | Extra classes on the label. **Tailwind path only** → `label-extra-class`. |

> The four `*Class` inputs flow ONLY to the Tailwind path (`<falcon-otp-tw>` reads `wrapperExtraClass`/`boxExtraClass`/`inputExtraClass`/`labelExtraClass`, `[CODE]` falcon-otp-tw.tsx:73-76). The Shadow path template does NOT bind them (`[CODE]` falcon-otp.component.html:31-48) → in Shadow mode they silently no-op (parity note).

## Outputs

**At the Angular wrapper level: NONE.** The wrapper exposes no `@Output` — value flows out via **CVA** only (`registerOnChange`). Touch flows via `registerOnTouched` (on `falcon-blur`).

The Stencil tags emit three events (both render paths, identical):

| Stencil event | Payload | Wrapper handling |
|---|---|---|
| `falcon-change` | `{ value: string; complete: boolean }` | Bound → `handleChange` → updates signal + `onChange(value)`. The `complete` flag is **dropped** (CVA only carries the string). (`[CODE]` falcon-otp.component.ts:98-103) |
| `falcon-blur` | `{ value: string }` | Bound → `handleBlur` → `onTouched()`. (`[CODE]` falcon-otp.component.ts:105-107) |
| `falcon-complete` | `{ value: string; complete: true }` | **NOT bound by the wrapper** — fired once on the false→true completion transition (`[CODE]` falcon-otp.tsx:67-68,145-147) but never re-emitted to Angular. **GAP G1.** |

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-otp/falcon-otp.types.ts`:

```ts
type FalconOtpSize = 'sm' | 'md' | 'lg';
type FalconOtpState = 'default' | 'error' | 'success' | 'warning';
interface FalconOtpChangeDetail extends FalconEventDetail<string> { complete: boolean; }
interface FalconOtpCompleteDetail extends FalconEventDetail<string> { complete: true; }
type FalconOtpBlurDetail = FalconEventDetail<string>;
```

## Reflected props (Stencil only)

`length`, `mask`, `size`, `state`, `disabled`, `required` are `@Prop({ reflect: true })` on both tags (`[CODE]` falcon-otp.tsx:45-53 / falcon-otp-tw.tsx:58-66). `value`, `label`, `helperText`, `errorMessage`, `name`, `inputId`, `pattern`, `placeholder` are NOT reflected.

## Mutable props (Stencil)

`value` is `@Prop({ mutable: true, reflect: false })`, `@Watch`ed (`onValueChange`) — re-syncs boxes ONLY when the external value diverges from the current boxes (avoids CVA-echo render thrash) (`[CODE]` falcon-otp.tsx:44,81-89).

## CVA / ngModel / Reactive Forms

**YES — full ControlValueAccessor** (`NG_VALUE_ACCESSOR` + `forwardRef`, `[CODE]` falcon-otp.component.ts:35-41):
- `writeValue(value)` → sets the internal signal (`null`/`undefined` → `''`).
- `registerOnChange(fn)` → invoked on every `falcon-change`.
- `registerOnTouched(fn)` → invoked on `falcon-blur`.
- `setDisabledState(isDisabled)` → toggles the internal `disabled` signal.

`[(ngModel)]`, `[ngModel]+(ngModelChange)`, `formControl`, `formControlName` all work. The live login consumer uses `[ngModel]` + `(ngModelChange)` (`[CODE]` enter-otp.component.html:75-78).

## Signal compatibility

Wrapper internal state is signals (`value`, `disabled`); external binding is `@Input` + CVA (legacy `@Input` decorators, no `input()`/`model()` variant). `OnPush` enforced.

## Methods (Stencil only — call via element ref)

| Method | Description |
|---|---|
| `setFocus(index = 0)` | Focuses + selects box `index` (clamped to `[0, length-1]`) (`[CODE]` falcon-otp.tsx:99-102). |
| `clear()` | Clears all boxes, emits `falcon-change`, focuses box 0 (no-op if disabled) (`[CODE]` falcon-otp.tsx:105-112). |

> The Angular wrapper proxies **neither** — reach `ViewChild.nativeElement` to call them. **GAP G3.**

## Slots / template inputs

- **None** on any layer. No `<slot>`, no `<ng-content>`, no `ng-template`.

## Supported sizes / states / variants

- Sizes: `sm` (36px box) / `md` (44px) / `lg` (52px).
- States: `default` / `error` / `success` / `warning` (success/warning are visual only — no extra behaviour).
- No `variant` / `appearance` axis (OTP is always the box grid).

## Constraints

- `length` MUST match the backend-issued code length or verification can never pass (cross-module contract).
- Per-box pattern filters input; a rejected char restores the box's prior value (`[CODE]` falcon-otp.tsx:164-168).
- Paste-fill: clipboard paste OR any >1-char arrival (autofill/IME) fills from the focused box forward, filtered by pattern (`[CODE]` falcon-otp.tsx:255-281).
- Enter is swallowed — the field never submits a form (`[CODE]` falcon-otp.tsx:236-240).
- Completion is edge-triggered ONCE on false→true (`[CODE]` falcon-otp.tsx:144-148).

## Accessibility

- **Row:** `role="group"`, `aria-label="One-time passcode"`, `aria-describedby` (helper/error ids), `aria-live="polite"` (`[CODE]` falcon-otp.tsx:308-315).
- **Per box:** `aria-label="Digit {n} of {length}"` (NOT "OTP digit N" — prior dossier was wrong), `aria-invalid` on error, `aria-required` when required (`[CODE]` falcon-otp.tsx:348-350).
- **Label:** `<label htmlFor={id}-0>` ties to the first box; required `*` is `aria-hidden="true"`.
- **Error:** paragraph has `role="alert"`.
- **Inputs:** `inputMode="numeric"`, `autocomplete="one-time-code"` on box 0 only (OS SMS auto-fill), `maxLength={1}`.
- Fully keyboard operable (type/backspace/Delete/Arrow/Home/End); focused box auto-selects so typing replaces in place.

> A11y parity: Shadow and `-tw` carry **identical** ARIA (both build the same `role="group"` + per-box labels + `role="alert"`) — no divergence (contrast search-input's clearAriaLabel gap).

## Verification
🟢 code-verified against `falcon-otp.component.ts/.html`, `falcon-otp.tsx`, `falcon-otp-tw.tsx`, `falcon-otp.utils.ts`, `falcon-otp.types.ts` (read 2026-06-03). CVA, dropped-`complete`-flag, un-bound `falcon-complete` (G1), Tailwind-only `*Class` props, "Digit N of N" label, Shadow↔`-tw` a11y parity all ✅ source-verified. Corrects prior "OTP digit N" a11y stub + resolves the "verify" items.
