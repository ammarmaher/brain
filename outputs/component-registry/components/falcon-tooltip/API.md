# falcon-tooltip — API

## Angular selector
`falcon-angular-tooltip`

## Stencil tags
- Shadow: `<falcon-tooltip>`
- Light: `<falcon-tooltip-tw>`

## Import path
```ts
import {
  FalconAngularTooltipComponent,
  type FalconTooltipPlacement,
} from '@falcon/ui-core/angular';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `content` | `string \| undefined` | — | Plain text tooltip content. Overridden by `slot="content"`. |
| `placement` | `FalconTooltipPlacement` | `'top'` | One of 12 placement values. |
| `delay` | `number` | `100` | Show delay in ms. |
| `disabled` | `boolean` | `false` | Disable tooltip entirely. |
| `interactive` | `boolean` | `false` | Keep panel open while hovering body (allow clicks inside). |
| `maxWidth` | `string \| undefined` | — | Inline `max-width` on the panel. E.g. `'320px'`. |
| `useTailwind` | `boolean` | `true` | Render-path switch. |
| `rootClass` | `string` | `''` | Caller-supplied class. |

## Outputs

| Name | Payload |
|---|---|
| `falconShow` | `FalconTooltipShowDetail { placement }` |
| `falconHide` | `FalconTooltipHideDetail { reason: 'pointer-leave' \| 'blur' \| 'disabled' \| 'programmatic' }` |

## TypeScript types

```ts
export type FalconTooltipPlacement =
  | 'top' | 'top-start' | 'top-end'
  | 'right' | 'right-start' | 'right-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end';

export interface FalconTooltipShowDetail { readonly placement: FalconTooltipPlacement; }
export interface FalconTooltipHideDetail {
  readonly reason: 'pointer-leave' | 'blur' | 'disabled' | 'programmatic';
}
```

## Reflected props (Stencil)
`placement`, `disabled`, `interactive`.

## Stencil methods
| Method | Purpose |
|---|---|
| `open(): Promise<void>` | Programmatic show (respects `disabled` + `delay`). |
| `close(): Promise<void>` | Programmatic hide. |

## Slots

| Slot name | Purpose |
|---|---|
| (default) | The trigger element (any HTML/Falcon component). The tooltip wraps it. |
| `content` | Rich tooltip content — overrides plain text `content` prop. |

## CVA support
Not applicable.

## Signal compatibility
Wrapper uses classic `@Input()` decorators.

## Supported placements
12 total:
- `top`, `top-start`, `top-end`
- `right`, `right-start`, `right-end`
- `bottom`, `bottom-start`, `bottom-end`
- `left`, `left-start`, `left-end`

The `-start` / `-end` suffix shifts the tooltip toward the start/end edge of the trigger axis. E.g. `top-start` puts the tooltip above-and-left-aligned with trigger.

## Important constraints
- **Show delay (`delay`, default 100ms)** — tooltip doesn't appear instantly. Hide delay is hardcoded at 80ms.
- **`interactive=true` keeps panel open while hovering it** — needed for links inside.
- **`disabled=true` suppresses show entirely** — already-open tooltip on disable is NOT closed automatically (no Watch). Programmatic `close()` may be needed.
- **Positioning is JS-set** — `panel.style.transform = translate(Xpx, Ypx)` from `computeOffset(triggerRect, panelRect, placement, offset)`. The `--falcon-tooltip-offset` CSS var controls panel-to-trigger gap (default 8px).
- **The trigger slot is `<span class="falcon-tooltip-trigger" tabIndex={0}>`** — the trigger gets `tabIndex=0` for keyboard focus, meaning ANY child becomes focusable. For non-interactive triggers (a span with text), this might surprise consumers.
- **`maxWidth` is the only inline style on the panel** beyond the position transform.

## Accessibility attributes
- Trigger: `aria-describedby="<tooltipId>"` when tooltip is visible.
- Panel: `role="tooltip"`.
- Trigger is focusable (`tabIndex=0`) — keyboard users can Tab to it and see the tooltip.
- Focus events: focus shows tooltip, blur hides it.

## Parts (Stencil Shadow)
| Part | Element |
|---|---|
| `trigger` | Trigger wrapper span. |
| `panel` | Tooltip panel. |
