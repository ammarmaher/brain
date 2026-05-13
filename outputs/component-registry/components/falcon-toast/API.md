# falcon-toast — API

## Angular selector (single toast)
`falcon-angular-toast`

## Angular selector (host container)
`falcon-angular-toast-host`

## Stencil tags
- Shadow toast: `<falcon-toast>`
- Light toast: `<falcon-toast-tw>`
- Shadow host: `<falcon-toast-host>`
- Light host: `<falcon-toast-host-tw>`

## Import path
```ts
import {
  FalconAngularToastComponent,
  FalconAngularToastHostComponent,
} from '@falcon/ui-core/angular';
```

## Inputs — `<falcon-angular-toast>`

| Name | Type | Default | Notes |
|---|---|---|---|
| `severity` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Determines icon + colors + ARIA role. |
| `title` | `string \| undefined` | — | Optional summary line. |
| `message` | `string \| undefined` | — | Detail line. |
| `duration` | `number` | `5000` | Auto-dismiss in ms. 0 or negative disables. |
| `dismissible` | `boolean` | `true` | Show × button. |
| `icon` | `string \| undefined` | — | Optional icon class (overrides per-severity default). |
| `actionLabel` | `string \| undefined` | — | Optional action button label. |
| `actionHref` | `string \| undefined` | — | If set, renders action as `<a>` instead of `<button>`; opens in `_blank`. |
| `useTailwind` | `boolean` | `true` | Render-path switch. |
| `rootClass` | `string` | `''` | Caller-supplied class. |

## Inputs — `<falcon-angular-toast-host>`

| Name | Type | Default | Notes |
|---|---|---|---|
| `position` | `FalconToastHostPosition` | `'top-right'` | One of 6 positions. |
| `gap` | `number \| undefined` | — | Gap between stacked toasts. |
| `maxToasts` | `number \| undefined` | — | Max simultaneous toasts. |
| `useTailwind` | `boolean` | `true` | Render-path switch. |
| `rootClass` | `string` | `''` | — |

## Outputs — `<falcon-angular-toast>`

| Name | Payload |
|---|---|
| `falconDismiss` | `FalconToastDismissDetail { reason: 'auto-dismiss' \| 'user' \| 'programmatic' }` |
| `falconActionClick` | `FalconToastActionClickDetail { nativeEvent: MouseEvent }` |

## TypeScript types

```ts
export type FalconToastSeverity = 'info' | 'success' | 'warning' | 'error';

export type FalconToastHostPosition =
  | 'top-right' | 'top-left' | 'top-center'
  | 'bottom-right' | 'bottom-left' | 'bottom-center';

export interface FalconToastDismissDetail {
  readonly reason: 'auto-dismiss' | 'user' | 'programmatic';
}

export interface FalconToastActionClickDetail {
  readonly nativeEvent: MouseEvent;
}
```

## Reflected props (Stencil)
`severity`, `dismissible`.

## Stencil methods (on toast element)
| Method | Purpose |
|---|---|
| `dismiss(): Promise<void>` | Programmatically dismiss. |

## Slots

### `<falcon-toast>`
| Slot | Purpose |
|---|---|
| (default) | Additional content below message. |
| `action` | Custom action button slot (overrides `actionLabel`/`actionHref`). |

### `<falcon-toast-host>`
| Slot | Purpose |
|---|---|
| (default) | Toast children. |

## CVA support
Not applicable.

## Signal compatibility
Wrappers use classic `@Input()` decorators.

## Supported severities / positions
- **Severities:** `info` / `success` / `warning` / `error`. Each maps to a default icon SVG (drawn inline if `icon` prop not set).
- **Host positions (6):** `top-right`, `top-left`, `top-center`, `bottom-right`, `bottom-left`, `bottom-center`.

## Important constraints
- **Auto-dismiss pauses on hover or focus** — `onMouseEnter` / `onFocusin` halt the timer; remaining time resumes on leave / blur.
- **`role`/`aria-live` set per severity:**
  - `warning` / `error` → `role="alert"`, `aria-live="assertive"`.
  - `info` / `success` → `role="status"`, `aria-live="polite"`.
- **Action button**: if `actionHref` is set, renders `<a target="_blank" rel="noopener">`. Otherwise `<button>`.
- **The toast element manages its own auto-dismiss timer** — the host doesn't drive it; the host just stacks.
- **`<falcon-angular-toast-host>` is just a positioner** — it doesn't render toasts; it accepts toast children via `<ng-content>`.

## Accessibility attributes
- Toast root: `role="alert"` or `role="status"` per severity. `aria-live` polite / assertive.
- Icon: `aria-hidden="true"`.
- Dismiss button: `aria-label="Dismiss"`.

## Parts (Stencil Shadow)

### Toast
| Part | Element |
|---|---|
| `root` | Outer toast container. |
| `icon` | Icon span. |
| `body` | Body container. |
| `title` | Title div. |
| `message` | Message div. |
| `action` | Action button/anchor. |
| `dismiss` | Dismiss × button. |

### Host
| Part | Element |
|---|---|
| `host` | Outer positioning container. |
