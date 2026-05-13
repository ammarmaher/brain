# falcon-otp — API

## Selectors

- Angular: `falcon-angular-otp`
- Stencil Shadow: `<falcon-otp>`
- Stencil Light: `<falcon-otp-tw>`

## Import

```ts
import { FalconAngularOtpComponent } from '@falcon/ui-core';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `string?` | — | |
| `placeholder` | `string` | `''` | |
| `helperText` | `string?` | — | |
| `errorMessage` | `string?` | — | |
| `length` | `number` | `6` | Number of boxes. |
| `mask` | `boolean` | `false` | Masks the entered digits (e.g. for PIN). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | |
| `required` | `boolean` | `false` | |
| `name` | `string?` | — | |
| `inputId` | `string?` | auto `falcon-otp-ng-{seq}` | |
| `pattern` | `string` | `'[0-9]'` | Character pattern per box (default numeric). |
| `useTailwind` | `boolean` | `true` | |
| `wrapperClass / boxClass / inputClass / labelClass` | `string` | `''` | |

## Outputs

None at wrapper level (CVA only). Stencil emits `falcon-change` with `{ value, complete }`.

## TypeScript types

```ts
interface FalconOtpChangeDetail { value: string; complete: boolean; }
type FalconOtpSize = 'sm' | 'md' | 'lg';
type FalconOtpState = 'default' | 'error' | 'success' | 'warning';
```

## CVA

YES.

## Methods

None proxied.

## Slots / template inputs

- None.

## Constraints

- Pattern restricts allowed characters per box (default digits only).
- Paste auto-fills boxes.
- Backspace retreats focus.
- Arrow keys / Home / End navigate boxes.

## Accessibility

- Per-box `aria-label="OTP digit N"` (verify).
- Required + `aria-required`.
- `aria-invalid` on error.
- Error has `role="alert"`.
- Auto-focus on first box (configurable in Stencil source — verify).

## Note: missing `complete` event

Stencil emits `falcon-change` with `complete: boolean` but the wrapper only forwards `value`. To detect completion, consumer must check `value.length === length` after each change.

**GAP** — add `(falconComplete)` output emitting when `complete=true`.
