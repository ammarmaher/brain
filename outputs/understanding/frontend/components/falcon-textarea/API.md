# falcon-textarea — API

## Selectors

- Angular: `falcon-angular-textarea`
- Stencil Shadow: `<falcon-textarea>`
- Stencil Light: `<falcon-textarea-tw>`

## Import

```ts
import { FalconAngularTextareaComponent } from '@falcon/ui-core';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `string?` | — | |
| `placeholder` | `string?` | — | |
| `helperText` | `string?` | — | |
| `errorMessage` | `string?` | — | **Note:** uses `errorMessage` (consistent with input — NOT `errorText`). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | |
| `variant` | `'form' \| 'grid'` | `'form'` | NO `'search'` (multi-line doesn't have search variant). |
| `appearance` | `'default' \| 'filled' \| 'ghost'` | `'default'` | |
| `readonly` | `boolean` | `false` | |
| `required` | `boolean` | `false` | |
| `name` | `string?` | — | |
| `inputId` | `string?` | auto `falcon-ata-{seq}` | |
| `rows` | `number` | `4` | |
| `autoResize` | `boolean` | `false` | Grows with content. |
| `minRows` | `number` | `2` | Auto-resize floor. |
| `maxRows` | `number` | `8` | Auto-resize ceiling. |
| `maxlength` | `number?` | — | |
| `showCounter` | `boolean` | `false` | `[CODE]` falcon-textarea.component.ts:69 — renders char counter (inert unless `maxlength` > 0). |
| `useTailwind` | `boolean` | `true` | Render-path switch → `<falcon-textarea-tw>` (Light) vs `<falcon-textarea>` (Shadow). |
| `wrapperClass / inputClass / labelClass` | `string` | `''` | Forwarded as `wrapper-extra-class` / `input-extra-class` / `label-extra-class`. **Tailwind path only.** |
| `iconLeft` | `boolean` | `false` | `[CODE]` falcon-textarea.component.ts:78 — projects `slot="icon-left"` at the field's start, top-anchored (`top: 10px`). BOTH paths. |
| `iconRight` | `boolean` | `false` | `[CODE]` falcon-textarea.component.ts:79 — projects `slot="icon-right"`. BOTH paths. |
| `inputMode` | `'numeric' \| 'decimal' \| 'text' \| 'tel' \| 'email' \| 'search' \| 'url' \| 'none' \| undefined` | `undefined` | `[CODE]` falcon-textarea.component.ts:80 — forwarded as HTML `inputmode`. |

> `[CODE]` **No `disabled` `@Input()`** — unlike `<falcon-angular-input>` (which has a `disabledFromInput` setter), textarea's disabled state arrives ONLY through Angular Forms `setDisabledState` (CVA). To disable, call `control.disable()` or use `readonly`. (Confirmed falcon-textarea.component.ts:85-110 — no `@Input('disabled')`.)
> `[CODE]` **No `clearable`** — textarea has no clear-X affordance.

## Outputs

`[CODE]` falcon-textarea.component.ts — **ZERO Angular `@Output`s.** The Stencil tags emit `falcon-input` / `falcon-change` / `falcon-focus` / `falcon-blur`; the wrapper binds `(falcon-input)`/`(falcon-change)` → `handleInput()` (CVA) and `(falcon-blur)` → `handleBlur()` which calls `onTouched()` ONLY — it does **NOT** re-emit a `(blur)` Output (a divergence from `<falcon-angular-input>`, which added a `(blur)` Output 2026-05-21). A consumer needing change/blur events must use the form control's `valueChanges` / `statusChanges`. **GAP G1.**

## CVA

YES — `NG_VALUE_ACCESSOR` + `forwardRef`. `writeValue(string|null|undefined)` → `value` signal (no `componentOnReady` push — unlike input/input-number). `registerOnChange`/`registerOnTouched`/`setDisabledState` standard.

## Methods

`[CODE]` BOTH Stencil tags expose `@Method() setFocus()` (falcon-textarea.tsx:115 / falcon-textarea-tw.tsx:122). The Angular wrapper does NOT proxy it — **GAP G3**. Neither tag has `clear()` (no clearable).

## Slots / template inputs

`[CODE]` **CORRECTION (2026-06-03):** the prior "None" is stale. Both render paths project `slot="icon-left"` + `slot="icon-right"` (wrapper html:39-40/71-72, toggled by `iconLeft`/`iconRight`). Icons are top-anchored (not vertically centered like input) since the field is multi-line. No `prefix`/`suffix` slots. No `ng-template` inputs.

## Constraints

- `[CODE]` `autoResize=true` overrides `rows` — measures `scrollHeight` and caps at `max(minRows,maxRows) × lineHeight` (falcon-textarea-tw.tsx:150-158). This is the ONLY place in the library that writes inline `style.height` (documented escape-hatch).
- `[CODE]` `showCounter=true` only renders when `maxlength` is a positive number (`shouldShowCounter`, falcon-textarea.tsx:198-200).
- `[CODE]` Counter has three color states via `classifyCounter()`: default / warning (≥90% of max) / over (≥max).
- No `'search'` variant (`FalconTextareaVariant = 'form' | 'grid'`).
- `[CODE]` `FalconTextareaResize` type (`none|vertical|horizontal|both`, types.ts:8) exists but **no `resize` prop consumes it** — resize is token-driven (`--falcon-textarea-resize`, default `vertical`) only; the type is currently dead (GAP G5).
- Native `<textarea>` is directly visible (no clip-trick).

## Accessibility

- `[CODE]` Native `<textarea>` — full keyboard A11y.
- `[CODE]` Label `htmlFor={resolvedId}` ties to the native element (falcon-textarea.tsx:219).
- `[CODE]` Required marker `*` is `aria-hidden="true"`; `aria-required` set from `required` prop.
- `[CODE]` `aria-invalid` set when `hasError` (state==='error' || errorMessage).
- `[CODE]` Error message `<p role="alert">` (falcon-textarea.tsx:315).
- `[CODE]` Counter is `aria-live="polite"` — **VERIFIED** (falcon-textarea.tsx:293 / falcon-textarea-tw.tsx:290).
- `[CODE]` `aria-describedby` joins helper + error + counter ids (falcon-textarea.tsx:190-196).
- `[CODE]` Projected icon `<span>`s are `aria-hidden="true"` + `pointer-events-none`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B01); RE-VERIFIED 2026-06-03 (W1-a) against falcon-textarea.component.ts (123 ln) + .html (75 ln) — all 25 inputs (incl. `showCounter`/`iconLeft`/`iconRight`/`inputMode`), ZERO `@Output`, NO `disabled` input (CVA-only via `setDisabledState`), NO `clearable`, and CVA wiring (no `componentOnReady` push) confirmed verbatim. Corrected: icon slots exist (prior "Slots: None" stale); `setFocus` on both Stencil tags; `FalconTextareaResize` type is dead. W1-a verdict: PASS (no further drift).
