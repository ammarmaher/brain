# falcon-drawer — API

## Angular selector
`falcon-angular-drawer`

## Stencil tags
- Shadow DOM: `<falcon-drawer>`
- Light DOM: `<falcon-drawer-tw>`

## Import path
```ts
import { FalconAngularDrawerComponent } from '@falcon/ui-core/angular';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | `false` | Two-way bindable via `openChange`. |
| `position` | `'right' \| 'left' \| 'top' \| 'bottom'` | `'right'` | Side anchor. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Width (right/left) or height (top/bottom). Token-driven (sm=320 / md=480 / lg=640 / xl=800 px for sides). |
| `closable` | `boolean` | `true` | Renders the close × button in header. |
| `dismissable` | `boolean` | `true` | Allow Esc / backdrop click dismissal. Note: typed differently from `dismissible` on dialog (legacy spelling inconsistency). |
| `modal` | `boolean` | `true` | Show backdrop (`true`) or render without backdrop (`false`). |
| `header` | `string \| undefined` | — | Plain text header. Overridden by `slot="header"`. |
| `ariaLabel` | `string \| undefined` | — | Used when no `header` is set. |
| `useTailwind` | `boolean` | `true` | Render-path switch. |
| `rootClass` | `string` | `''` | Caller-supplied extra class. |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `drawerShow` | `FalconDrawerShowDetail` | Fires after drawer opens. |
| `drawerHide` | `FalconDrawerHideDetail` | Fires on close. Detail includes the reason. |
| `openChange` | `boolean` | Two-way binding sugar (always emits `false` on hide). |

## TypeScript types
```ts
export type FalconDrawerPosition = 'right' | 'left' | 'top' | 'bottom';
export type FalconDrawerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface FalconDrawerShowDetail {
  readonly source: 'programmatic' | 'attribute';
}
export interface FalconDrawerHideDetail {
  readonly reason: 'close-button' | 'backdrop' | 'escape' | 'programmatic';
}
```

## Reflected props (Stencil)
`open`, `position`, `size`, `closable`, `modal`.

## Stencil methods
| Method | Purpose |
|---|---|
| `show(): Promise<void>` | Programmatic open. |
| `hide(): Promise<void>` | Programmatic close. |

## Slots

| Slot name | Purpose |
|---|---|
| (default) | Drawer body content. |
| `header` | Rich header content — overrides plain text `header` prop. |
| `footer` | Footer content (action button row typically). Renders only when something is slotted. |

## CVA support
Not applicable.

## Signal compatibility
Wrapper uses classic `@Input()` decorators with default values.

## Supported sizes / positions / states
- **Positions:** `right`, `left`, `top`, `bottom`.
- **Sizes:** `sm` / `md` / `lg` / `xl` mapping to per-position tokens (320/480/640/800 px sides; 240/360/480/640 px edges).
- **States:** open / closed (no intermediate).
- **Modal:** `true` (backdrop blocks underlying clicks) or `false` (transparent backdrop, click-through possible).

## Important constraints
- **Focus trap is mandatory while open** — Tab cycles within the drawer panel only (intercepts at first/last focusable boundary).
- **Focus restore on close** — previously focused element regains focus.
- **Esc key closes only when `dismissable=true`.**
- **Backdrop click closes only when `dismissable=true`** AND target is the overlay itself (not bubbled from inner content).
- **Body slot has internal padding from tokens** — caller projects raw content; padding comes from `--falcon-drawer-body-padding-block` / `-inline`.

## Accessibility attributes
- Root panel: `role="dialog"`, `aria-modal="true"`.
- `aria-labelledby` linked to the header `<h2>` id when `header` is set.
- `aria-label` fallback when no header.
- Close × button: `aria-label="Close"` (or `closeAriaLabel` prop on the Stencil side — wrapper doesn't expose this currently).
- Panel `tabIndex=-1` for focus-target fallback when no focusable children.

## Parts (Stencil Shadow)
| Part | Element |
|---|---|
| `overlay` | Backdrop / outer wrap. |
| `panel` | Slide-in panel container. |
| `header` | Header section. |
| `title` | `<h2>` inside header. |
| `close` | Close × button. |
| `body` | Body container. |
