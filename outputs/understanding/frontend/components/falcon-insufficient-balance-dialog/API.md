# falcon-insufficient-balance-dialog — API

## Selectors

- **Stencil Shadow:** `<falcon-insufficient-balance-dialog>` (Shadow DOM)
- **Stencil Light/TW:** `<falcon-insufficient-balance-dialog-tw>` (Light DOM, Tailwind v4)
- **Angular wrapper:** `<falcon-angular-insufficient-balance-dialog>` (default uses `-tw` variant)

## Import

```ts
import {
  FalconAngularInsufficientBalanceDialogComponent,
  type FalconInsufficientBalanceDialogProceedDetail,
  type FalconInsufficientBalanceDialogCancelDetail,
  type IbDialogItem,
} from '@falcon/ui-core/angular';
```

## Props (Stencil) / Inputs (Angular wrapper)

### Visibility + data
| Name | Type | Default | Reflected | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `false` | ✅ | Visibility. Re-seeds working order on every false→true. |
| `items` | `IbDialogItem[]` | `[]` | — | Items to rank. `{ id, label }`. |
| `loading` | `boolean` | `false` | — | Skeleton rows in body. |
| `busy` | `boolean` | `false` | — | Disables controls + buttons. |
| `errorMessage` | `string` | `—` | — | Inline error banner (pre-translated). |

### Visual configuration (Wave 15 user-requested)
| Name | Type | Default | Reflected |
| --- | --- | --- | --- |
| `showGlossy` | `boolean` | `true` | ✅ |
| `showIconColor` | `boolean` | `true` | ✅ |
| `showIconBackground` | `boolean` | `true` | ✅ |

### Header + labels (pre-translated)
| Name | Type | Default |
| --- | --- | --- |
| `headingText` | `string` | `—` |
| `subtitle` | `string` | `—` |
| `confirmLabel` | `string` | `'Proceed Payment'` |
| `cancelLabel` | `string` | `'Cancel'` |
| `dragLabel` | `string` | `'Drag To Change Priority:'` |
| `firstAutoLabel` | `string` | `'The first channel will be used automatically.'` |
| `moveUpLabel` / `moveDownLabel` / `moveToTopLabel` / `moveToBottomLabel` | `string` | (defaults) |

### Dismiss-path toggles
| Name | Type | Default |
| --- | --- | --- |
| `closeOnBackdrop` | `boolean` | `true` |
| `closeOnEsc` | `boolean` | `true` |

### Angular-only
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `useTailwind` | `boolean` | `true` | Render-path switch. `true` → `-tw`. `false` → Shadow. |

## Events (Stencil) / Outputs (Angular)

| Stencil event | Angular output | Payload | Fires when |
| --- | --- | --- | --- |
| `falcon-proceed` | `falconProceed` | `{ orderedIds: string[] }` | Confirm button. |
| `falcon-cancel` | `falconCancel` | `{ reason: 'cancel' \| 'backdrop' \| 'esc' }` | Dismiss. |
| `falcon-open-change` | `openChange` | `boolean` | Open state change. |

All Stencil events use `bubbles: true, composed: true` — cross Shadow boundaries (Contract C3).

## Types

```ts
export interface IbDialogItem {
  id: string;
  label: string;
}

export interface FalconInsufficientBalanceDialogProceedDetail {
  orderedIds: string[];
}

export interface FalconInsufficientBalanceDialogCancelDetail {
  reason: 'cancel' | 'backdrop' | 'esc';
}
```

## Methods

None public. Internal `move(i, delta)`, drag handlers, dismiss handler are `private`.

## Slots

None. Body is fully controlled — the dialog renders its own priority list + info pill.

## Parts (Shadow only)

| Part | Element |
| --- | --- |
| `backdrop` | Outer backdrop div |
| `panel` | Inner dialog panel |
| `header` | Header (icon + title + subtitle) |
| `body` | Body container |
| `row` | Each channel pill |
| `footer` | Footer (Cancel + Confirm) |

## Reflected attrs

`open`, `show-glossy`, `show-icon-color`, `show-icon-background` — exposed via `[reflect: true]` so consumer CSS can target `:where(falcon-insufficient-balance-dialog[show-glossy="true"])` for cascade-time variant styling.

## Signal compatibility (Angular wrapper)

Inputs/outputs are decorator-based (`@Input` / `@Output`) — matches surrounding wrapper components (alert-dialog, dialog, etc.). Internal state in Stencil uses `@State()`.

## Accessibility

- `role="alertdialog"` on the panel.
- `aria-modal="true"`.
- `aria-label` from `headingText`.
- Each reorder button carries `aria-label` from the `move*Label` inputs.
- `<ul role="list">` for the priority list.
- Drag-drop produces same reorder result as the four buttons — keyboard parity.
