# falcon-input-number — API

## Selectors

- Angular: `falcon-angular-input-number`
- Stencil pair exists.

## Import

```ts
import { FalconAngularInputNumberComponent } from '@falcon/ui-core';
```

## Inputs

`[CODE]` falcon-input-number.component.ts — boolean inputs use `transform: booleanAttribute` (more modern than input's string-truthy idiom).

| Name | Type | Default | Notes |
|---|---|---|---|
| `min` | `number?` | — | Clamped on blur (not keystroke). |
| `max` | `number?` | — | Clamped on blur. |
| `step` | `number` | `1` | Used by spinner buttons. |
| `showButtons` | `boolean` (`booleanAttribute`) | `false` | Show ± spinner. |
| `mode` | `'decimal' \| 'currency'` | `'decimal'` | |
| `currency` | `string` | `'USD'` | ISO currency code; used when mode='currency'. |
| `locale` | `string?` | (browser default) | Intl locale; controls decimal/group separators. |
| `minFractionDigits` | `number?` | — | Ignored in currency mode (Intl owns it). |
| `maxFractionDigits` | `number?` | — | Same. |
| `integer` | `boolean` (`booleanAttribute`) | `false` | Truncates fractional input (`Math.trunc`). |
| `placeholder` | `string` | `''` | |
| `label` | `string` | `''` | |
| `helperText` | `string` | `''` | |
| `errorMessage` | `string` | `''` | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | `[CODE]` ts:80 — accepted on the wrapper. ⚠️ **Forwarded ONLY in the Tailwind path** (`-tw` passes `state` to inner `<falcon-input-tw>`); the **Shadow `<falcon-input-number>` has NO `state` prop** and silently drops it (see Constraints / GAP). |
| `readonly` | `boolean` (`booleanAttribute`) | `false` | |
| `required` | `boolean` (`booleanAttribute`) | `false` | |
| `disabled` | `boolean \| string` (setter) | `false` | `[CODE]` ts:111-114 — `disabledFromInput` setter (boolean OR string-truthy), parity with input. CVA `setDisabledState` writes the same signal. |
| `name` | `string` | `''` | |
| `inputId` | `string` | `''` | |
| `useTailwind` | `boolean` (`booleanAttribute`) | `true` | Render-path switch. |
| `rootClass` | `string` | `''` | Forwarded as `root-class` to BOTH paths. |
| `inputClass` | `string` | `''` | `[CODE]` ⚠️ Forwarded as `input-extra-class` ONLY in the Tailwind path (html:39). The Shadow path binds `root-class` but NOT `input-extra-class` — divergence. |
| `iconLeft` | `boolean` (`booleanAttribute`) | `false` | `[CODE]` ts:95 — projects `slot="icon-left"` (forwarded to inner `<falcon-input(-tw)>`). |
| `iconRight` | `boolean` (`booleanAttribute`) | `false` | `[CODE]` ts:96 — projects `slot="icon-right"`. |
| `inputMode` | `'numeric' \| 'decimal' \| 'text' \| 'tel' \| 'none'` | `undefined` | `[CODE]` ts:99 — overrides keyboard hint; resolves to `'numeric'` (integer) / `'decimal'` (default) inside the Stencil component if unset. |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `valueChange` | `number \| null` | `[CODE]` ts:102 — emitted on every committed change for non-CVA consumers. |
| `(blur)` | `void` | `[CODE]` ts:42/76 in html — the wrapper template binds `(falcon-blur)="handleBlur()"`; `handleBlur()` calls `onTouched()` only. **NOTE:** unlike input, there is NO `@Output() blur` declared on `FalconAngularInputNumberComponent` — `(blur)` template bindings on a `<falcon-angular-input-number>` host will NOT fire. The internal `(falcon-blur)` is consumed for CVA touched-state only. |

## TypeScript types

`[CODE]` falcon-input-number.types.ts:

```ts
export type FalconInputNumberMode = 'decimal' | 'currency';
export type FalconInputNumberSize = 'sm' | 'md' | 'lg';
export interface FalconInputNumberChangeDetail { value: number | null; }
```

`[CODE]` The wrapper ALSO exports `FalconInputNumberState` (`'default'|'error'|'success'|'warning'`) + `FalconInputNumberInputMode` from the component file (ts:36-37).

## CVA

YES. `[CODE]` `writeValue(number | string | null | undefined)` → `coerce()` (strips non-`[\d.\-]`, `Number()`, returns `null` for non-finite/empty, `Math.trunc` if integer) → `value` signal + defensive `componentOnReady().then(push)` (cell-remount race guard, mirrors input). Value type is **`number | null`** — never bind a `FormControl<string>`.

## Methods

`[CODE]` BOTH Stencil tags define `stepUp()`/`stepDown()` as private handlers (not `@Method`). The Shadow `<falcon-input-number>` exposes NO public `@Method`; the wrapper proxies nothing. **GAP G3** (no `setFocus`/`stepUp`/`stepDown` proxy).

## Slots / template inputs

`[CODE]` **CORRECTION (2026-06-03):** the prior "None" is stale. `slot="icon-left"` / `slot="icon-right"` (toggled by `[iconLeft]`/`[iconRight]`) are projected through the wrapper → forwarded to the inner `<falcon-input(-tw)>` (html:43-44/77-78). No text `prefix`/`suffix` slot (GAP G2). No `ng-template`.

## Constraints

- `[CODE]` During focus, display is the raw value string (no Intl formatting); on blur, the formatted display takes over (`handleInputFocus`/`handleInputBlur`).
- `[CODE]` `clamp()` runs only on **blur** — typing past `max` is allowed mid-edit; an Enter-submit without blur can carry an unclamped value (GAP G1).
- `Intl.NumberFormat` is locale-aware; pass `locale='ar-SA'` for Arabic numerals. `Intl` is instantiated **per format/parse call** — memoise in heavy lists.
- Currency mode auto-displays the symbol per Intl rules; `minFractionDigits`/`maxFractionDigits` are honored but currency overrides decimal minimums.
- `[CODE]` The `coerce()` regex `[^\d.\-]` strips locale separators — the Stencil `parse()` (`Intl.formatToParts`) is the real locale-aware parser; `coerce()` is a coarse CVA-side fallback.
- `[CODE]` ⚠️ **Shadow-vs-Tailwind PARITY GAPS (verified 2026-06-03):**
  1. **`state` is dropped in Shadow mode** — `<falcon-input-number>` (Shadow) has no `state` prop and never passes it to its inner `<falcon-input>`; only `<falcon-input-number-tw>` forwards `state` (tw.tsx:46/306). So `useTailwind=false` + `[state]="'error'"` shows NO error ring. (GAP)
  2. **DOM numeric keystroke/paste/beforeinput filter is `-tw`-only** — tw.tsx:147-283 attaches host-level `keydown`/`paste`/`beforeinput` listeners that block non-numeric input; the Shadow component has NO such filter, so Shadow mode accepts letters until blur-parse discards them. (GAP)
  3. **`inputExtraClass` is `-tw`-only** — Shadow path forwards `root-class` but not `input-extra-class`.

## Accessibility

- `[CODE]` Inherits the inner `<falcon-input>` A11y (label/aria-invalid/aria-required/aria-describedby/role=alert).
- `[CODE]` Spinner buttons have `aria-label="Increase"` / `"Decrease"` (falcon-input-number.tsx:168/204; tw inline buttons same) + `disabled` when disabled/readonly. (NOTE: labels are the bare verbs, not "Increase value".)
- `[CODE]` `inputmode` resolves to `'numeric'` (integer) / `'decimal'` (default) via `resolveInputMode()` — VERIFIED set on the native input.
- `[CODE]` Projected icon `<span>`s inherit the inner input's `aria-hidden` icon treatment.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B01); RE-VERIFIED 2026-06-03 (W1-a) against falcon-input-number.component.ts (160 ln) + .html (81 ln). Re-confirmed verbatim: `booleanAttribute`-transformed boolean inputs, the `disabledFromInput` setter, the single real `@Output() valueChange` (`number|null`) with NO `@Output() blur` (host `(blur)` will not fire), and CVA `coerce()` + `componentOnReady().then(push)`. The THREE Shadow↔tw parity gaps re-checked against the live template: Shadow `<falcon-input-number>` has NO `[attr.state]` binding (html:48-74) and NO `[attr.input-extra-class]` (only `root-class`), while `-tw` forwards both (html:35/39) → state-drop + inputExtraClass-tw-only CONFIRMED; numeric-filter Shadow gap stands. W1-a verdict: PASS.
