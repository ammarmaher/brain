*** falcon-alert-dialog — API ***

# Inputs (`@Input` on Angular wrapper, `@Prop` on Stencil)

| Name | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | `false` | Two-way bindable open state |
| `title` | `string?` | — | Centered title shown under the icon |
| `subtitle` | `string?` | — | Centered subtitle (max 460px wide) |
| `severity` | `FalconAlertDialogSeverity` | `'warning'` | Drives icon glyph + Confirm color |
| `icon` | `string?` | — | Override icon glyph (CSS class). Falls back to severity-default SVG |
| `confirmLabel` | `string` | `'Confirm'` | Confirm button label |
| `cancelLabel` | `string` | `'Cancel'` | Cancel button label |
| `hideConfirm` | `boolean` | `false` | Hide the Confirm button (single-CTA mode) |
| `hideCancel` | `boolean` | `false` | Hide the Cancel button (single-CTA mode) |
| `size` | `FalconAlertDialogSize` | `'md'` | Panel size (`'sm' \| 'md' \| 'lg'`) |
| `position` | `FalconAlertDialogPosition` | `'center'` | `'center' \| 'top' \| 'bottom'` |
| `closable` | `boolean` | `false` | Show the close X button |
| `closeOnBackdrop` | `boolean` | `true` | Dismiss when backdrop clicked |
| `closeOnEsc` | `boolean` | `true` | Dismiss on Escape key |
| `useTailwind` | `boolean` | `true` | (Angular wrapper) Light DOM if true, Shadow DOM if false |

# Outputs (`@Output` on Angular wrapper, `@Event` on Stencil)

| Name | Detail | When |
|---|---|---|
| `falconConfirm` | `{ severity }` | Confirm button clicked |
| `falconCancel` | `{ severity, reason }` | Cancel / backdrop / esc / close X |
| `openChange` | `boolean` | Open state changed |

# Types

```ts
type FalconAlertDialogSeverity = 'danger' | 'warning' | 'info' | 'success';
type FalconAlertDialogSize = 'sm' | 'md' | 'lg';
type FalconAlertDialogPosition = 'center' | 'top' | 'bottom';

interface FalconAlertDialogConfirmDetail {
  severity: FalconAlertDialogSeverity;
}

interface FalconAlertDialogCancelDetail {
  severity: FalconAlertDialogSeverity;
  reason: 'cancel' | 'backdrop' | 'esc' | 'close';
}
```

# Slots

| Slot | What goes here | Required? |
|---|---|---|
| default (unnamed) | Body content (priority list, info pill, etc.) | No |
| `[slot=header]` | NOT exposed — header is composed internally | — |
| `[slot=footer]` | NOT exposed — footer is composed internally | — |

The component renders its own header (icon + title + subtitle) and footer (Cancel/Confirm
buttons). Only the body is consumer-projected via the default slot. If you need
custom header/footer, drop down to `<falcon-angular-dialog>` directly.
