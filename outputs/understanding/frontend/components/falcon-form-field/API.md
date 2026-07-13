# falcon-form-field — API

> **REFRESHED 2026-06-03 (B24).** Single-render Angular component — no Stencil twin, no reflected props, no `@Method`s, no `useTailwind` switch. Drift corrected: the "SCSS file exists" note removed (no stylesheet exists). 7 signal inputs, 0 outputs.

## Selectors

- Angular: `falcon-form-field` (`[CODE]` ts:9, `standalone` via `imports: [TranslatePipe]`).
- Stencil: **None**.
- Host: `class: 'block'` (`[CODE]` ts:13).

## Import

```ts
import { FalconFormFieldComponent } from '@falcon';
```

`[CODE]` Re-exported from the shared-ui barrel `libs/falcon/src/shared-ui/index.ts:5` → `@falcon`. Add `FalconFormFieldComponent` to the consuming standalone component's `imports: []`. No `CUSTOM_ELEMENTS_SCHEMA` needed (pure Angular).

## Inputs (all signal `input()` on `FalconFormFieldComponent`)

| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | `''` | `[CODE]` ts:17. i18n KEY resolved through `TranslatePipe`. **Empty string skips the label row entirely** (`html:6` `@if (label())`). |
| `required` | `boolean` | `false` | `[CODE]` ts:18. Renders a red `*` (`text-falcon-red-500`, `aria-hidden`) after the label (`html:9-11`). |
| `hint` | `string` | `''` | `[CODE]` ts:19. i18n KEY for helper text — shown below the control only when there is no error (`html:24-28`). |
| `errorKey` | `string \| null` | `null` | `[CODE]` ts:20. i18n KEY for the error message. Non-null → drives the invalid visual (`hasError`) and renders the red `*errorKey` line (`html:20-24`). |
| `errorParams` | `Record<string, string \| number> \| null` | `null` | `[CODE]` ts:22. Interpolation params for `errorKey` (e.g. `{ max: 30, min: 2 }`) — passed to `\| translate: (errorParams() ?? undefined)` (`html:22`). |
| `disabled` | `boolean` | `false` | `[CODE]` ts:23. Dims the whole field to `opacity-[0.65]` + `pointer-events-none` (`html:3-4`). |
| `invalid` | `boolean \| null` | `null` | `[CODE]` ts:26. **Explicit override** — when non-null it drives `hasError` directly, bypassing `errorKey` inference. |

## Outputs

**None.** `[CODE]` Zero `output()`s — purely a labeled-row render of inputs around projected content.

## TypeScript types

None specific — all primitives. The only exported member is `FalconFormFieldComponent` (`[CODE]` `index.ts:2`).

## Reflected props (Stencil only) / Mutable props (Stencil)

**N/A** — no Stencil layer.

## CVA / ngModel / Reactive Forms

**Not a form control.** `[CODE]` It is a layout/labeled wrapper — no `ControlValueAccessor`, no `value`, no form binding. The slotted control owns the value; the consumer drives `errorKey`/`required`/`disabled` from its own `FormGroup`.

## Computed state

`[CODE]` ts:29-32 — `hasError = computed<boolean>(() => { const explicit = this.invalid(); return explicit !== null ? explicit : !!this.errorKey(); })`. So `invalid()` (when set) wins; otherwise error state is inferred from a non-null `errorKey()`. `hasError()` drives the `is-invalid` host-div class (`html:5`) and the error-vs-hint branch (`html:20-28`).

## Signal compatibility

`[CODE]` Fully signals-first: all 7 inputs are `input()`, `hasError` is `computed()`, `OnPush` change detection. Zoneless-safe.

## Methods

None.

## Slots / template inputs

- `[CODE]` html:15-18 — a single default `<ng-content>` slot (wrapped in `<div class="ff-slot">`) for the actual control (`<falcon-angular-input>`, a `<falcon-angular-dropdown>`, a custom editor, etc.). No named slots, no `ng-template` inputs.

## Supported sizes / states / variants / appearances

- **No size / variant / appearance inputs.** The wrapper is a single layout (vertical `flex flex-col gap-1.5 min-w-0`).
- **States:** `default`, `invalid` (via `hasError`), `disabled`. That's the full visual axis.

## Constraints

- `[CODE]` `label` / `hint` / `errorKey` are **i18n KEYS** (fed to `TranslatePipe`) — not literal text. Passing a translated string ships a missing-translation artifact.
- `[CODE]` Shows **error OR hint, never both** (`html:20` `@if (hasError())` … `@else if (hint())`).
- `[CODE]` `hasError` is derived from `errorKey`/`invalid` only — it does NOT read the slotted control's own `state="error"`. The consumer must keep them in sync (the real usages do: `[errorKey]` on the wrapper AND `[state]="…'error':'default'"` on the inner input) (G5).
- `[CODE]` **No `for`/`htmlFor` on the `<label>`** — the rendered label is not programmatically associated with the slotted control's id (G2).
- `[CODE]` Template carries one literal helper class `ff-slot` (`html:16`) — a plain content-wrapper hook, no stylesheet rule behind it (no CSS file exists).

## Accessibility

- `[CODE]` html:6-12 — `<label>` renders when `label()` is set; the required `*` is `aria-hidden="true"`.
- `[CODE]` **No `for=` association** — screen readers may not announce the label on inner-control focus (G2). The consumer should set a shared id explicitly.
- `[CODE]` `required` here renders the visual asterisk; `aria-required` lives on the **slotted control** — the two are not synced (G4). A required field needs `required` here AND `aria-required` on the inner input.
- `[CODE]` No `aria-describedby` wiring between the error/hint line and the slotted control — the message is visual; AT association is the consumer's responsibility.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B24) against `falcon-form-field.component.ts` (33 ln) + `.html` (29 ln), both read in full. 7 inputs / 0 outputs / `hasError` precedence / error-xor-hint / no `for=` / `ff-slot` literal class all re-confirmed. Drift corrected: the prior API note "SCSS file exists — flag for migration" is removed (no stylesheet exists).
