# falcon-confirm-dialog — API

## Angular selector
`falcon-angular-confirm-dialog`

## Stencil tags
- Shadow: `<falcon-confirm-dialog>`
- Light: `<falcon-confirm-dialog-tw>`

## Import path
```ts
import { FalconAngularConfirmDialogComponent } from '@falcon/ui-core/angular';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | `false` | Two-way via `openChange`. |
| `title` | `string \| undefined` | — | Dialog heading. (Wrapper renames Stencil's `heading` to `title`.) |
| `message` | `string \| undefined` | — | Body message text. |
| `icon` | `string \| undefined` | — | Icon class string (e.g. `"falcon-icon falcon-icon-exclamation-triangle"`). |
| `acceptLabel` | `string` | `'OK'` | Accept button label. |
| `rejectLabel` | `string` | `'Cancel'` | Reject button label. |
| `severity` | `FalconDialogSeverity` | `'info'` | `info` / `success` / `warning` / `danger`. |
| `size` | `FalconDialogSize` | `'sm'` | Inherited from dialog sizes. |
| `position` | `FalconDialogPosition` | `'center'` | Inherited from dialog positions. |
| `closable` | `boolean` | `true` | Show × button. |
| `closeOnBackdrop` | `boolean` | `true` | Backdrop click closes. |
| `closeOnEsc` | `boolean` | `true` | Esc closes. |
| `useTailwind` | `boolean` | `true` | Render-path switch. |
| `rootClass` | `string` | `''` | Caller-supplied class on dialog. |

## Outputs

| Name | Payload |
|---|---|
| `accept` | `void` |
| `reject` | `void` (also fires on backdrop / esc / × close) |
| `openChange` | `boolean` |

## TypeScript types
Re-exports `FalconDialogSeverity`, `FalconDialogSize`, `FalconDialogPosition` from `falcon-dialog.types.ts`.

## Reflected props (Stencil)
`open`, `severity`, `size`, `position` are reflected.

## Stencil methods
None public on the wrapper. Underlying dialog methods (`show()`, `hide()`) are not proxied.

## Slots

| Slot name | Purpose |
|---|---|
| (default) | Additional body content projected BELOW the icon + message. The wrapper template renders `<ng-content>` after the message div. |

(The accept / reject buttons are projected into the underlying dialog's `slot="footer"` automatically by the wrapper template — consumer cannot override them.)

## CVA support
Not applicable.

## Signal compatibility
Wrapper uses classic `@Input()` decorators.

## Supported sizes / severities
- Sizes: `sm` (default — 420 px) / `md` (560) / `lg` (720) / `xl` / `full`.
- Severities: `info` / `success` / `warning` / `danger`.
- Positions: `center` / `top` / `side-right` (inherited; `side-right` discouraged).

## Important constraints
- **The accept / reject buttons are hardcoded `<button class="falcon-confirm-dialog__btn">`** — NOT `<falcon-angular-button>`. This is a structural inconsistency worth flagging.
- **Backdrop / Esc / × dismissal all fire `reject` event** — not `cancel` or `close`. Consumer must treat all dismissal paths as rejection.
- **The Stencil version `<falcon-confirm-dialog>` uses `onFalcon-close` event listener** (lowercase, dash-separated) — this is the Stencil-correct syntax for the cross-component bubbled event.
- **`title` is renamed from `heading`** in the wrapper compared to the Stencil `heading` prop. Both work via `[heading]` on the Stencil tag, but the Angular wrapper exposes `[title]`.
- **The Stencil source uses `falcon-confirm-accept` / `falcon-confirm-reject` / `falcon-confirm-open-change` events** — different naming from the wrapper's `accept` / `reject` / `openChange`.

## Accessibility attributes
- Inherits from `<falcon-angular-dialog>`: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` to title.
- Icon span has `aria-hidden="true"`.
- Native `<button>` for accept / reject — keyboard activation free.
- NO explicit `aria-describedby` linking the message body to the dialog (gap).

## Parts (Stencil Shadow)
| Part | Element |
|---|---|
| `body` | Body container. |
| `message` | Message text. |
| `actions` | Footer button row. |
| `reject-btn` | Reject button. |
| `accept-btn` | Accept button. |
