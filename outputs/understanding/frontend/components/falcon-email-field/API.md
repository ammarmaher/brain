# falcon-email-field — API

## Selectors

- Angular: `falcon-angular-email-field`
- Stencil Shadow: `<falcon-email-field>`
- Stencil Light: `<falcon-email-field-tw>`

## Import

```ts
import { FalconAngularEmailFieldComponent } from '@falcon/ui-core';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `string?` | — | |
| `placeholder` | `string` | `'name@example.com'` | |
| `helperText` | `string?` | — | |
| `errorMessage` | `string?` | — | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | |
| `readonly` | `boolean` | `false` | |
| `required` | `boolean` | `false` | |
| `verifyButton` | `boolean` | `false` | Show Verify button. |
| `verifyLabel` | `string` | `'Verify'` | Button text. |
| `verifyDisabled` | `boolean` | `false` | Disable just the verify button. |
| `name` | `string?` | — | |
| `inputId` | `string?` | auto `falcon-email-field-ng-{seq}` | |
| `autocomplete` | `string` | `'email'` | |
| `useTailwind` | `boolean` | `true` | |
| `wrapperClass / inputClass / labelClass` | `string` | `''` | |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `falcon-verify` | `{ value: string }` | Fired when Verify button is pressed. |

(Plus CVA writes value; no other `@Output` on wrapper.)

## CVA

YES.

## Methods

None proxied.

## Slots / template inputs

- None.

## Constraints

- "Single-element look" — input + verify button share the same outer border.
- Validation deferred — component emits verify event only; consumer drives logic.
- `verifyDisabled` is separate from the input's `disabled` (gives a "disable just the button" affordance).

## Accessibility

- Native `<input type="email">` underneath — full A11y.
- Verify button has its own `aria-label` (verify).
- Required marker + `aria-required`.
- `aria-invalid` on error.
