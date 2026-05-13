# falcon-form-field (LEGACY) — API

## Selector
- `<falcon-form-field>` — Angular bespoke standalone component.

## Import path
```ts
import { FalconFormFieldComponent } from '@falcon';
```

## TypeScript types
- Inputs are mostly primitive strings/booleans; `errorParams` is `Record<string, string | number> | null`.

## @Inputs (signal-based via `input()`)

| Name | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `label` | `input<string>` | translation key | `''` | Pass empty string to skip the label row. |
| `required` | `input<boolean>` | — | `false` | Adds `*` next to the label. |
| `hint` | `input<string>` | translation key | `''` | Pass empty string to skip the hint row. |
| `errorKey` | `input<string \| null>` | translation key | `null` | When non-null, displays the error message. |
| `errorParams` | `input<Record<string, string \| number> \| null>` | — | `null` | Interpolation for the errorKey. |
| `disabled` | `input<boolean>` | — | `false` | Drives the disabled visual. |
| `invalid` | `input<boolean \| null>` | — | `null` | Explicit override — when set, drives the invalid visual instead of `errorKey`. |

## @Outputs
- _None._

## Internal computed
- `hasError = computed<boolean>(() => { const explicit = invalid(); return explicit !== null ? explicit : !!errorKey(); })` — single source of truth for the invalid visual.

## CVA / Forms support
- **None.** The contained input (slot) owns the form binding.

## Slots / ng-template inputs
- Default `<ng-content>` — the input/control body.

## Supported sizes / variants
- _None._

## Important constraints
- The component uses `TranslatePipe` — `label`, `hint`, `errorKey` are translation keys.
- Render order: label row → control slot (`<ng-content>`) → hint row (if no error) → error row (if hasError).
- The invalid visual lives on the wrapping element class (likely `.fff-error` from the SCSS).

## Accessibility
- _Gap._ The label is rendered as a `<label>` element but `for` attribute linking to the inner input is not automatic — the inner control must own its own `id` and the consumer wires the label `for=` manually OR (more commonly) the inner input has its own label and this wrapper's label is decorative. Audit.
