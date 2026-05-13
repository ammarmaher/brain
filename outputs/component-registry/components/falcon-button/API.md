# falcon-button — API

## Angular selector
`falcon-angular-button`

## Stencil tags
- Shadow DOM: `<falcon-button>`
- Light DOM (Tailwind path): `<falcon-button-tw>`

## Import path
```ts
import { FalconAngularButtonComponent } from '@falcon/ui-core/angular';
```

The lib is `libs/falcon-ui-core` (re-exported through the `@falcon/ui-core/angular` entry-point used by all 3 apps).

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger' \| 'link'` | `'primary'` | Reflected to host. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Heights: 34 / 38 / 44 px (per `button.tokens.css`). |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Forwarded to native `<button type=...>`. |
| `disabled` | `boolean` | `false` | When true, click events are swallowed; native `disabled` attribute set. |
| `loading` | `boolean` | `false` | Shows spinner overlay, hides label visually (width-stable), sets `aria-busy="true"`, disables click. |
| `fullWidth` | `boolean` | `false` | Stretches to container width (`--falcon-button-full-width: 100%`). |
| `iconOnly` | `boolean` | `false` | Forces icon-only mode (square aspect). Auto-detected when no label + an `icon-start` slot is present, but caller can force. |
| `label` | `string \| undefined` | — | Text label. Overridden by `slot="label"` when present. |
| `ariaLabel` | `string \| undefined` | — | **REQUIRED when `iconOnly` is true and no visible label**. Forwarded to native `aria-label`. |
| `name` | `string \| undefined` | — | Native form-submission `name`. |
| `valueAttr` | `string \| undefined` | — | Native form-submission `value`. Bound via `[attr.value-attr]` to avoid clobbering Angular's `value` binding. |
| `useTailwind` | `boolean` | `true` | Render-path switch. `true` → `<falcon-button-tw>` (Light DOM). `false` → `<falcon-button>` (Shadow DOM). |
| `rootClass` | `string` | `''` | Caller-supplied extra class on the inner Stencil root — passed through as `root-extra-class` on the Tailwind tag. |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `falconClick` | `MouseEvent` | Native MouseEvent unwrapped from Stencil's `{ nativeEvent }` envelope. Suppressed when `disabled` or `loading`. |

## TypeScript types
Defined in `libs/falcon-ui-core/src/components/falcon-button/falcon-button.types.ts`:

```ts
export type FalconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
export type FalconButtonSize = 'sm' | 'md' | 'lg';
export type FalconButtonType = 'button' | 'submit' | 'reset';

export interface FalconButtonClickDetail {
  readonly nativeEvent: MouseEvent;
}
```

(Note: the wrapper re-declares these as local type aliases for ergonomic import paths.)

## Reflected props (Stencil)
On the underlying Stencil element, the following are reflected back to attributes (visible in DevTools):
`variant`, `size`, `type`, `disabled`, `loading`, `fullWidth`, `iconOnly`.

## Stencil methods (exposed on the underlying custom element)
The Angular wrapper does NOT proxy these — consumers can grab the underlying element via `@ViewChild` and call:

| Method | Purpose |
|---|---|
| `setFocus(): Promise<void>` | Programmatically focus the native button. |
| `clickProgrammatic(): Promise<void>` | Programmatically click (respects disabled / loading). |

## Stencil events emitted

| Event | Payload | Bubbles + composed? |
|---|---|---|
| `falcon-click` | `FalconButtonClickDetail` | Yes (`bubbles: true, composed: true`). The Angular wrapper unwraps this into `falconClick: EventEmitter<MouseEvent>`. |

## Slots

| Slot name | Purpose |
|---|---|
| `icon-start` | Leading icon. Typical content: `<i slot="icon-start" class="falcon-icon falcon-icon-pencil">` or `<svg slot="icon-start">`. |
| `label` | Override the `label` prop with richer content (e.g. spans + icons inline). |
| `icon-end` | Trailing icon. Same pattern as `icon-start`. |

The wrapper template uses `ng-content select="[slot=icon-start]"` + `ngProjectAs` to route Angular content into the Stencil slot.

## CVA / ngModel / Reactive Forms
Not applicable. Buttons are stateless triggers, not form controls. No `ControlValueAccessor` is implemented.

## Signal compatibility
The wrapper uses classic `@Input()` decorators, not `input()` signals (this is the pattern most of the Falcon UI wrappers follow for ref-stable Angular interop). Wrapper itself is `OnPush`.

## Supported sizes / states / variants
- **Sizes:** `sm` (34px), `md` (38px), `lg` (44px). Height + padding-x + gap + font-size all driven by tokens.
- **Variants:** `primary` (teal bg / white fg), `secondary` (white bg / neutral border / dark fg), `ghost` (transparent / neutral fg / hover bg), `danger` (red bg / white fg), `link` (transparent / dark fg / teal hover).
- **States:** default / hover / active / focus / disabled — each variant has explicit `bg`, `text`, `border` token slots per state in `button.tokens.css`.
- **Modes:** icon-only (square aspect via `--falcon-button-icon-only-size-*`), full-width, loading (spinner + label fade).

## Important constraints
- **`ariaLabel` is mandatory** when `iconOnly` is true and there is no visible `label` slot. Without it screen readers see an empty button. The auto-detect logic in the Stencil source uses `host.querySelector('[slot="icon-start"]')` to flip `iconOnly` to true when no label is present — but this does NOT inject an `aria-label` for you.
- **`loading` and `disabled` both block clicks**, but only `disabled` reaches `aria-disabled`. `loading` sets `aria-busy="true"`.
- **`label` prop loses to a slotted `<span slot="label">`** — the slot's text content takes precedence (Stencil source line 88).
- The Angular wrapper's `valueAttr` exists because plain `value` clashes with Angular's native value binding on `<falcon-angular-button>` host — never bind `[value]` here.

## Accessibility attributes / events
- `aria-label` — forwarded from `ariaLabel` input.
- `aria-disabled` — set to `"true"` / `"false"` via `ariaBool(disabled)` from `utils/a11y`.
- `aria-busy` — set to `"true"` / `"false"` via `ariaBool(loading)`.
- Native `<button>` provides Enter / Space keyboard activation for free.
- `disabled` attribute is set when `disabled || loading` so the browser refuses keyboard activation as well.

## Parts (Stencil Shadow shadow-parts)
For `<falcon-button>` (Shadow only — `<falcon-button-tw>` is Light DOM and exposes class names directly):

| Part | Element |
|---|---|
| `root` | The native `<button>` element. |
| `spinner` | The loading spinner overlay span. |
| `content` | The flex container wrapping icons + label. |
| `icon-start` | The leading icon slot wrapper. |
| `label` | The label wrapper. |
| `icon-end` | The trailing icon slot wrapper. |
