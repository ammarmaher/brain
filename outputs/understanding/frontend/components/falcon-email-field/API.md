# falcon-email-field — API

## Selectors

- Angular: `falcon-angular-email-field`
- Stencil Shadow: `<falcon-email-field>` (tag `'falcon-email-field'`, `shadow: true`)
- Stencil Light: `<falcon-email-field-tw>` (tag `'falcon-email-field-tw'`, `shadow: false`)

## Import

```ts
import { FalconAngularEmailFieldComponent } from '@falcon/ui-core';
```

Add to the host's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is declared on the wrapper (`[CODE]` `falcon-email-field.component.ts:39`) — the host does not need it.

## Inputs (all on `FalconAngularEmailFieldComponent`)

`[CODE]` `falcon-email-field.component.ts:54-81`

| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `string \| undefined` | `undefined` | `<label>` above the field. |
| `placeholder` | `string` | `'name@example.com'` | Strong "this is email" tell. |
| `helperText` | `string \| undefined` | `undefined` | Helper paragraph; hidden when `errorMessage` set. |
| `errorMessage` | `string \| undefined` | `undefined` | Error paragraph, `role="alert"`; implies error state. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Wrapper height per `--falcon-email-field-height-*`. |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | Visual validation state. |
| `readonly` | `boolean` | `false` | |
| `required` | `boolean` | `false` | Red asterisk + `aria-required`. |
| `verifyButton` | `boolean` | `false` | Show the in-field Verify button (+ its 1px divider). |
| `verifyLabel` | `string` | `'Verify'` | Button text (consumer passes already-translated string). |
| `verifyDisabled` | `boolean` | `false` | Disables **only the Verify button** — the field stays editable. |
| `verifyIcon` | `boolean` | `false` | Show a leading circular-arrows SVG inside the Verify button. **`-tw` path only** (see divergence below). |
| `name` | `string \| undefined` | `undefined` | Native input name. |
| `inputId` | `string \| undefined` | auto `falcon-email-field-ng-{seq}` | (Stencil tags also self-resolve their own id when unset.) |
| `autocomplete` | `string` | `'email'` | |
| `useTailwind` | `boolean` | `true` | **Render-path switch.** `true` → `<falcon-email-field-tw>`. `false` → `<falcon-email-field>`. |
| `wrapperClass` | `string` | `''` | Forwarded as `wrapper-extra-class` attr → consumed by the `-tw` twin only. |
| `inputClass` | `string` | `''` | Forwarded as `input-extra-class` → `-tw` only. |
| `labelClass` | `string` | `''` | Forwarded as `label-extra-class` → `-tw` only. |
| `iconLeft` | `boolean` | `false` | Project `slot="icon-left"` (2026-05-17 unified icon-slot API). |
| `iconRight` | `boolean` | `false` | Project `slot="icon-right"` — **suppressed when `verifyButton` is on** (button + trailing icon never collide). |
| `inputMode` | `'numeric'\|'decimal'\|'text'\|'tel'\|'email'\|'search'\|'url'\|'none' \| undefined` | `undefined` | Forwarded as `input-mode-override`; the Stencil tags default the native `inputMode` to `'email'` when unset. |

> **No `[disabled]` `@Input`.** Disabled is CVA-only via `setDisabledState`. `verifyDisabled` IS a normal input and is independent of it.

### Shadow vs Light prop divergence

`[CODE]` The **Shadow** tag (`falcon-email-field.tsx`) does NOT declare `verifyIcon`, `wrapperExtraClass`, `inputExtraClass`, or `labelExtraClass`. The **Light** tag (`falcon-email-field-tw.tsx:64-73`) declares all four. So `[verifyIcon]` + the `*Class` inputs are honored only when `useTailwind=true` (the default) — they silently no-op on the Shadow path. **Divergence** (see GAPS).

## Outputs

`[CODE]` `falcon-email-field.component.ts:83-88`

| Name (Angular) | Payload | Source DOM event | Notes |
|---|---|---|---|
| `falcon-verify` | `{ value: string }` | `falcon-verify` | Aliased Output (`@Output('falcon-verify') verifyOut`) — bind `(falcon-verify)`. Fires on Verify click. |
| `blur` | `void` | `falcon-blur` | `@Output() blur` re-emits the Stencil `falcon-blur` (2026-05-21 — native DOM blur does NOT bubble, so without this re-emit a consumer `(blur)` never fires → touched never set → required errors hidden). Also calls CVA `onTouched`. |

`falcon-input` / `falcon-change` are NOT re-emitted as Angular outputs — value escapes only via CVA. `falcon-focus` is emitted by the Stencil tags but NOT re-emitted by the wrapper.

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-email-field/falcon-email-field.types.ts`:

```ts
type FalconEmailFieldSize = 'sm' | 'md' | 'lg';
type FalconEmailFieldState = 'default' | 'error' | 'success' | 'warning';
interface FalconEmailFieldChangeDetail { readonly value: string; }
interface FalconEmailFieldVerifyDetail { readonly value: string; }
interface FalconEmailFieldFocusDetail { readonly value: string; }
interface FalconEmailFieldBlurDetail  { readonly value: string; }
```

(The Angular wrapper re-declares `FalconEmailFieldChangeDetail` / `…VerifyDetail` locally `[CODE]` `:23-29` — DRY smell, see GAPS.)

## Reflected props (Stencil)

`[CODE]` Both tags reflect `size`, `state`, `disabled`, `readonly`, `required`, `verifyButton` to host attributes.

## Mutable props (Stencil)

`value` is `@Prop({ mutable: true, reflect: false })` on both tags; updated on `onInput`. (No `@Watch` on value here — unlike phone-field; the native input value is set declaratively each render.)

## CVA / ngModel / Reactive Forms

**YES.** `[CODE]` `falcon-email-field.component.ts:40-45,104-115`

- `writeValue(v)` — sets the internal `value` signal (no `componentOnReady` push — email-field omits the defensive re-push that input/password have; see GAPS).
- `registerOnChange(fn)` — invoked on `falcon-input` / `falcon-change` (both bound to `handleInput`).
- `registerOnTouched(fn)` — invoked on `falcon-blur`.
- `setDisabledState(isDisabled)` — toggles the `disabled` signal → forwarded as `[attr.disabled]`.

`[(ngModel)]`, `formControl`, `formControlName` all work.

## Methods (Stencil only)

`[CODE]` Both tags declare `@Method() async setFocus()` (`falcon-email-field.tsx:83-86`, `falcon-email-field-tw.tsx:101-104`) → focuses the native `<input>`. **The Angular wrapper does NOT proxy it** — to call it, reach `ViewChild` → the inner Stencil element. **GAP.**

## Slots / template inputs

`[CODE]` `falcon-email-field.component.html:35-36,64-65` — `slot="icon-left"` and `slot="icon-right"` projected via `<ng-content>` on BOTH render branches (the 2026-05-17 unified icon-slot API). `icon-right` is suppressed when `verifyButton` is on. No `ng-template` inputs.

> Correction: the prior API doc said "Slots: None" — stale. Both icon slots exist.

## Sizes / states / variants / appearances

- Sizes: `sm` (36px) / `md` (44px) / `lg` (52px) — `[CODE]` `email-field.tokens.css:43-45`.
- States: `default` / `error` / `success` / `warning` (error implied by `errorMessage` via `isFieldInError`).
- **No `variant` / `appearance`** — does not follow the input Wave-9.C pattern (GAP).
- Verify button heights track the field: `sm` 28 / `md` 36 / `lg` 44px.

## Accessibility

- Native `<input type="email">` with `aria-invalid` (on error), `aria-required`, `aria-describedby` (helper+error ids). `[CODE]` `falcon-email-field.tsx:183-185`.
- Error paragraph `role="alert"`.
- Required asterisk `aria-hidden`.
- Icon slot spans are `aria-hidden`.
- **Verify button has NO `aria-label`** `[CODE]` `falcon-email-field.tsx:205-215` / `-tw:224-251` — it relies on its visible text label (`verifyLabel`). The prior doc claimed an aria-label exists; it does not. With `verifyIcon` on, the SVG is `aria-hidden` and the text still labels the button — acceptable, but a dedicated `aria-label` would be more robust (GAP). There is no "verified ✓" state.

## Verification
🟢 code-verified against `falcon-email-field.component.ts`, `.html`, `.component.css`, `falcon-email-field.tsx`, `falcon-email-field-tw.tsx`, `.types.ts`, `.utils.ts`, `email-field-tailwind-classes.ts` (2026-06-03). Added `verifyIcon` / `iconLeft` / `iconRight` / `inputMode` / `(blur)` output; corrected "Slots: None" and the verify-button aria-label claim.
