# send-credentials-popup (LEGACY) — API

## Selector
- `<falcon-send-credentials-popup>` — Angular bespoke standalone component.

## Import path
```ts
import { FalconSendCredentialsPopupComponent } from '@falcon';
import { DeliveryMethod } from '@falcon/shared-types';
```

## TypeScript types
- `DeliveryMethod` — enum from `@falcon/shared-types/lib/enums/globels`. Values include `Email` and likely `Sms` / `Both`.
- `Hook<DeliveryMethod>` — option shape from `@falcon/shared-types/lib/models/models`.

## @Inputs (decorator-based)
| Name | Type | Default | Notes |
|---|---|---|---|
| `visible` | `boolean` | `false` | Two-way via `[(visible)]` (the component emits `visibleChange`). |
| `accountOwnerName` | `string` | `''` | Display name in the prompt. |
| `phoneNumber` | `string` | `''` | Phone shown next to the SMS radio. |
| `email` | `string` | `''` | Email shown next to the Email radio. |
| `recipientLabel` | `string` | `'Account owner'` | Label for the recipient (e.g., "User"). |
| `loading` | `boolean` | `false` | Disables Submit, shows spinner. |

## @Outputs
| Name | Payload | Description |
|---|---|---|
| `visibleChange` | `boolean` | Two-way binding partner for `[visible]`. |
| `submit` | `DeliveryMethod` | The chosen delivery method. |

## Internal state
- `method: DeliveryMethod = DeliveryMethod.Email` — the currently selected radio.
- `deliveryMethodOptions: Hook<DeliveryMethod>[]` — populated in `ngOnInit` via `Helper.enumToOptions(DeliveryMethod, DeliveryMethodI18n, translateService)`.
- Exposes `DeliveryMethod` enum + `DeliveryMethodI18n` map to the template.

## Internal methods
- `close()` — sets `visible=false` and emits `visibleChange(false)`.
- `send()` — if not loading, emits `submit(method)`.

## CVA / Forms support
- **None.**

## Slots / ng-template inputs
- _None._

## Supported sizes / variants
- _None._ Single visual.

## Important constraints
- The dialog visibility flows out via `visibleChange` — consumers using `[(visible)]` get two-way binding.
- `loading=true` disables Submit; consumer must reset to false after the API call completes.
- The radio group uses `DeliveryMethod` enum values — consumer must understand the enum.

## Accessibility
- Inherits `<falcon-angular-dialog>` ARIA semantics.
- Radio group has native semantics via `<falcon-angular-radio>`.
- _Gap:_ no `aria-live` for the loading state.
