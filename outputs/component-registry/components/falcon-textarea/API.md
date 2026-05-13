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
| `showCounter` | `boolean` | `false` | Renders char-count helper. |
| `useTailwind` | `boolean` | `true` | |
| `wrapperClass / inputClass / labelClass` | `string` | `''` | |

## Outputs

Stencil emits `falcon-input`, `falcon-change`, `falcon-blur`. The Angular wrapper does NOT re-emit these as `@Output`s — value flows via CVA only.

## CVA

YES.

## Methods

None proxied.

## Slots / template inputs

- None.

## Constraints

- `autoResize=true` overrides `rows` — uses `minRows` / `maxRows` instead.
- `showCounter=true` only meaningful when `maxlength` is set.
- No `'search'` variant.
- Native `<textarea>` is directly visible (no clip-trick).

## Accessibility

- Native textarea — full A11y.
- Label `htmlFor` ties to native element.
- Required marker + `aria-required`.
- `aria-invalid` on error.
- Error message `role="alert"`.
- Counter is `aria-live="polite"` (verify Stencil).
