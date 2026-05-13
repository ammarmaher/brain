# falcon-dialog — API

## Angular selector
`falcon-angular-dialog`

## Stencil tags
- Shadow DOM: `<falcon-dialog>`
- Light DOM: `<falcon-dialog-tw>`

## Import path
```ts
import { FalconAngularDialogComponent } from '@falcon/ui-core/angular';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | `false` | Two-way via `openChange`. |
| `title` | `string \| undefined` | — | Plain text title (overridden by `slot="header"`). |
| `description` | `string \| undefined` | — | Optional description below title. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Panel max-width per size. |
| `closable` | `boolean` | `true` | Show close × button. |
| `closeOnBackdrop` | `boolean` | `true` | Backdrop click closes. |
| `closeOnEsc` | `boolean` | `true` | Esc closes. |
| `dismissible` | `boolean` | `true` | Master enable for both Esc + backdrop (overrides the two above when `false`). |
| `severity` | `'info' \| 'success' \| 'warning' \| 'danger' \| undefined` | — | Tone indicator. |
| `position` | `'center' \| 'top' \| 'side-right'` | `'center'` | Layout origin. |
| `disabled` | `boolean` | `false` | Block `show()` programmatic opens. |
| `errorMessage` | `string \| undefined` | — | Optional inline error (rendered in dialog body if templated). |
| `ariaLabel` | `string \| undefined` | — | Fallback label when no title. |
| `useTailwind` | `boolean` | `true` | Render-path switch. |
| `rootClass` | `string` | `''` | Caller-supplied extra class. |

## Outputs

| Name | Payload |
|---|---|
| `falconOpen` | `FalconDialogOpenDetail` |
| `falconClose` | `FalconDialogCloseDetail` (reason: close-button / backdrop / escape / programmatic) |
| `falconConfirm` | `FalconDialogConfirmDetail` (value?: unknown) |
| `falconCancel` | `FalconDialogCancelDetail` (reason?: string) |
| `openChange` | `boolean` (two-way sugar) |

Note: `falcon-confirm` and `falcon-cancel` events are emitted by Stencil but require explicit `confirm()` / `cancel()` invocation — the dialog itself does NOT render confirm/cancel buttons; those events are passthrough for consumers that emit them programmatically.

## TypeScript types

```ts
export type FalconDialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type FalconDialogPosition = 'center' | 'top' | 'side-right';
export type FalconDialogSeverity = 'info' | 'success' | 'warning' | 'danger';

export interface FalconDialogOpenDetail   { readonly source: 'programmatic' | 'attribute'; }
export interface FalconDialogCloseDetail  { readonly reason: 'close-button' | 'backdrop' | 'escape' | 'programmatic'; }
export interface FalconDialogConfirmDetail { readonly value?: unknown; }
export interface FalconDialogCancelDetail  { readonly reason?: string; }
```

## Reflected props (Stencil)
`open`, `size`, `closable`, `severity`, `position`, `disabled`.

## Stencil methods
| Method | Purpose |
|---|---|
| `show(): Promise<void>` | Programmatic open (no-op when `disabled`). |
| `hide(): Promise<void>` | Programmatic close. |

## Slots

| Slot name | Purpose |
|---|---|
| (default) | Body content. |
| `header` | Rich header — overrides plain `title` / `description` rendering. |
| `footer` | Footer content. Optional — only renders when projected. |

## CVA support
Not applicable.

## Signal compatibility
Wrapper uses classic `@Input()`. Internal state is Stencil-managed.

## Supported sizes / states / variants
- **Sizes:** `sm` (420 px) / `md` (560) / `lg` (720) / `xl` (?) / `full` (viewport).
- **Positions:** `center` (default), `top` (anchored near top), `side-right` (right-anchored — overlap with drawer concept).
- **Severities:** `info` / `success` / `warning` / `danger` — color the title strip / icon-bg per `data-severity` attribute.
- **States:** open / closed, disabled (blocks programmatic open).

## Important constraints
- **Focus trap is mandatory while open** — same logic as drawer (Tab cycles, Esc closes).
- **`dismissible=false` overrides `closeOnBackdrop` and `closeOnEsc`** — master kill-switch.
- **Body slot has token-driven padding.**
- **Confirm / Cancel events are NOT auto-wired** — the dialog has no built-in confirm button. Consumers project their own buttons + emit the events as needed (or use `falcon-angular-confirm-dialog` which composes this for you).

## Accessibility attributes
- Root panel: `role="dialog"`, `aria-modal="true"`.
- `aria-labelledby` linked to title id.
- `aria-describedby` linked to description id.
- `aria-label` fallback when no title.
- Close × button has `aria-label` from `closeAriaLabel` prop (Stencil-level only; not exposed by wrapper).

## Parts (Stencil Shadow)
| Part | Element |
|---|---|
| `backdrop` | Backdrop wrap. |
| `panel` | Panel container. |
| `close` | Close × button. |
| `header` | Header section. |
| `title` | `<h2>` title. |
| `description` | `<p>` description. |
| `body` | Body container. |
