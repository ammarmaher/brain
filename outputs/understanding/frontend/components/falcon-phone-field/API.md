# falcon-phone-field — API

## Selectors

- Angular: `falcon-angular-phone-field`
- Stencil Shadow: `<falcon-phone-field>` (tag `'falcon-phone-field'`, `shadow: true`)
- Stencil Light: `<falcon-phone-field-tw>` (tag `'falcon-phone-field-tw'`, `shadow: false`)

## Import

```ts
import { FalconAngularPhoneFieldComponent } from '@falcon/ui-core';
```

Add to the host's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is on the wrapper (`[CODE]` `falcon-phone-field.component.ts:71`).

## Inputs (all on `FalconAngularPhoneFieldComponent`)

`[CODE]` `falcon-phone-field.component.ts:111-141`

| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `string \| undefined` | `undefined` | |
| `placeholder` | `string \| undefined` | `undefined` | Native tel input placeholder. |
| `helperText` | `string \| undefined` | `undefined` | Helper paragraph; hidden when `errorMessage` set. |
| `errorMessage` | `string \| undefined` | `undefined` | Error paragraph `role="alert"`; implies error state. |
| `country` | `string` | `'SA'` | ISO-3166 alpha-2 default (Saudi Arabia). Reflected on the Stencil tag. |
| `countries` | `ReadonlyArray<FalconPhoneFieldCountry> \| undefined` | `undefined` (→ `DEFAULT_PHONE_COUNTRIES`, 25) | Restrict / replace the dropdown list. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Wrapper height + flag size per token. |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | Visual validation state. |
| `readonly` | `boolean` | `false` | |
| `required` | `boolean` | `false` | Red asterisk + `aria-required`. |
| `verifyButton` | `boolean` | `false` | Show the in-field Verify button (+ 1px divider). |
| `verifyLabel` | `string` | `'Verify'` | Button text. |
| `verifyDisabled` | `boolean` | `false` | Disables ONLY the Verify button (field stays editable). |
| `verifyIcon` | `boolean` | `false` | Leading circular-arrows SVG in the Verify button. **`-tw` path only.** |
| `name` | `string \| undefined` | `undefined` | Native input name. |
| `inputId` | `string \| undefined` | auto `falcon-phone-field-ng-{seq}` | |
| `autocomplete` | `string` | `'tel'` | |
| `searchPlaceholder` | `string` | `'Search…'` | Country-panel search placeholder. |
| `emptyMessage` | `string` | `'No countries match'` | Shown when the filter matches nothing. |
| `useTailwind` | `boolean` | `true` | **Render-path switch.** `true` → `<falcon-phone-field-tw>` (Light, portaled panel). `false` → `<falcon-phone-field>` (Shadow, inline panel). |
| `wrapperClass` | `string` | `''` | Forwarded as `wrapper-extra-class` → `-tw` only. |
| `inputClass` | `string` | `''` | Forwarded as `input-extra-class` → `-tw` only. |
| `labelClass` | `string` | `''` | Forwarded as `label-extra-class` → `-tw` only. |
| `iconRight` | `boolean` | `false` | Project `slot="icon-right"` — suppressed when `verifyButton` is on. (`iconLeft` is intentionally absent — the country chooser owns the start edge.) |
| `inputMode` | `'numeric'\|'decimal'\|'text'\|'tel'\|'email'\|'search'\|'url'\|'none' \| undefined` | `undefined` | Forwarded as `input-mode-override`; the tags default native `inputMode` to `'tel'`. |

> **No `[disabled]` input** (CVA-only via `setDisabledState`). **No `[maxlength]`** — a `[maxlength]="10"` binding seen on the User-Details consumer is NOT a wrapper input and falls through as an unknown attr on the host element (it does NOT cap the inner native input — see GAPS). **No `appendTo`** on the wrapper (it's a `-tw`-only Stencil prop, default `'body'`).

### Shadow vs Light prop divergence

`[CODE]` The **Light** tag (`falcon-phone-field-tw.tsx`) additionally declares `verifyIcon` (`:100`), `wrapperExtraClass`/`inputExtraClass`/`labelExtraClass` (`:110-112`), and `appendTo: 'body' | 'inline'` (`:124`, default `'body'`). The **Shadow** tag declares NONE of these (it has no `verifyIcon`, no extra-class props, and always renders the panel inline). Since `useTailwind=true` is the default, these work for most consumers but silently no-op on the Shadow path. **Divergence** (see GAPS).

## Outputs

`[CODE]` `falcon-phone-field.component.ts:143-150`

| Name (Angular) | Payload | Source DOM event | Notes |
|---|---|---|---|
| `falcon-country-change` | `{ country: string; dialCode: string }` | `falcon-country-change` | Aliased Output (`@Output('falcon-country-change') countryChangeOut`). Fires when the user picks a different country. |
| `falcon-verify` | `{ value: string; country: string }` | `falcon-verify` | Aliased Output (`verifyOut`). Fires on Verify click; `value` is the full E.164. |
| `blur` | `void` | `falcon-blur` | `@Output() blur` re-emits Stencil `falcon-blur` (2026-05-21; native blur doesn't bubble) + calls CVA `onTouched`. |

`falcon-input`/`falcon-change` are NOT re-emitted (value → CVA only). `falcon-open`/`falcon-close` are consumed internally by the wrapper for the Top-Layer popover lifecycle (see below) — not surfaced as Angular outputs. `falcon-focus` is not re-emitted.

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-phone-field/falcon-phone-field.types.ts`:

```ts
type FalconPhoneFieldSize  = 'sm' | 'md' | 'lg';
type FalconPhoneFieldState = 'default' | 'error' | 'success' | 'warning';
interface FalconPhoneFieldCountry { readonly iso: string; readonly name: string; readonly dialCode: string; readonly flagEmoji?: string; }
interface FalconPhoneFieldChangeDetail { readonly value: string; readonly country: string; readonly dialCode: string; readonly nationalNumber: string; }
interface FalconPhoneFieldCountryChangeDetail { readonly country: string; readonly dialCode: string; }
interface FalconPhoneFieldVerifyDetail { readonly value: string; readonly country: string; }
interface FalconPhoneFieldFocusDetail { readonly value: string; }
interface FalconPhoneFieldBlurDetail  { readonly value: string; }
```

(The wrapper re-declares `Country`/`ChangeDetail`/`CountryChangeDetail`/`VerifyDetail` locally `[CODE]` `:39-61` — DRY smell, see GAPS.)

## Reflected props (Stencil)

`[CODE]` Both tags reflect `country`, `size`, `state`, `disabled`, `readonly`, `required`, `verifyButton`. `value` is mutable, not reflected.

## Mutable props (Stencil)

`value` and `country` are both `@Prop({ mutable: true })`. Selecting a country mutates `country` internally and re-emits. The Light twin syncs the native input value imperatively in `handleInput` (`[CODE]` `:317-319`).

## CVA / ngModel / Reactive Forms

**YES — with a value-shape wrinkle.** `[CODE]` `falcon-phone-field.component.ts:155-185`

- `writeValue(v)` — sets the internal `value` signal (no `componentOnReady` push; see GAPS).
- `handleInput(detail)` — sets the value signal to **`detail.nationalNumber`** (the display digits) but calls **`onChange(detail.value)`** = the **full E.164** (`composeFullNumber(dialCode, nationalNumber)`). **So the form model receives the E.164 string, while the rendered input shows the national digits.**
- `registerOnTouched` — on `falcon-blur`.
- `setDisabledState` — toggles the `disabled` signal.

`[(ngModel)]`, `formControl`, `formControlName` all work. **Seed `country` alongside the value** — `writeValue` does not parse a dial-code prefix out of an incoming value, so the emitted E.164 depends on the current `country`.

## Top-Layer popover lifecycle (Angular wrapper)

`[CODE]` `falcon-phone-field.component.ts:86-265` — **Phase C / Wave 6 (2026-05-21).** The wrapper injects `FalconStackingService` and listens to the Stencil `(falcon-open)` / `(falcon-close)` events:
- `handlePopoverOpen()` → `scheduleTopLayerAcquire()` → after a frame, finds the body-portaled panel (`.falcon-overlay-container [data-falcon-popover-instance="…"][data-falcon-portaled="true"]`), calls `showPopover()` (native Top Layer), and `stacking.register(panel, 'popover')`.
- `handlePopoverClose()` / `ngOnDestroy()` → `releaseTopLayer()` → `hidePopover()` + `stacking.unregister`.

> **Correction vs prior dossier:** these handlers are **NOT no-ops** anymore — they actively promote the portaled panel into the native Top Layer. (The 2026-05-15 portal wave left them as no-ops; the 2026-05-21 Phase C wave wired them up.)

## Methods (Stencil only)

`[CODE]` Both tags expose `@Method() async setFocus()`, `openPanel()`, `closePanel()`. **None are proxied on the Angular wrapper** — reach `ViewChild('phoneFieldEl')` → the inner element. GAP.

## Slots / template inputs

`[CODE]` `falcon-phone-field.component.html:41,75` — `slot="icon-right"` via `<ng-content>` on both branches (suppressed when `verifyButton` is on). No `icon-left` (country chooser owns the start). No `ng-template` inputs.

## Sizes / states / variants / appearances

- Sizes: `sm` (36px) / `md` (44px) / `lg` (52px); flag size scales (`22/26/30px`).
- States: `default` / `error` / `success` / `warning`.
- **No `variant` / `appearance`** (GAP).

## Accessibility

- Country chooser `<button>`: `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls={listboxId}`, `aria-disabled`, `disabled` `[CODE]` `falcon-phone-field.tsx:313-326`.
- Country panel: `role="listbox"` + `role="option"` rows with `aria-selected`; `aria-labelledby` → the input id.
- Keyboard: ArrowDown/ArrowUp/Enter/Space on the chooser open the panel; Esc closes + returns focus to the chooser; outside-click (document `mousedown`) closes; selecting refocuses the native input.
- Native `<input type="tel">`: `aria-invalid` / `aria-required` / `aria-describedby` (helper+error ids).
- Error paragraph `role="alert"`; required asterisk + flag + chevron + dial code are `aria-hidden`.
- **Verify button has NO `aria-label`** (relies on visible text — same as email-field; GAP).

## Verification
🟢 code-verified against `falcon-phone-field.component.ts`, `.html`, `falcon-phone-field.tsx`, `falcon-phone-field-tw.tsx`, `.types.ts`, `.utils.ts`, `phone-field-tailwind-classes.ts` (2026-06-03). Corrected the popover-handlers-are-no-ops claim; documented the CVA E.164/national split, the Shadow↔`-tw` divergence, and the non-existent `maxlength` input.
