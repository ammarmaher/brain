# falcon-calendar (LEGACY FACADE) — API

## Selector
- `<falcon-calendar>` — Angular bespoke standalone component.

## Import path
```ts
import { FalconCalendarComponent } from '@falcon';
```

## TypeScript types
- Accepts `Date | null` via `writeValue`; uses `FalconItemStatus` and `PricingType` from `@falcon/shared-types` (effective-date inputs, all no-op).

## @Inputs
| Name | Type | Default | Notes |
|---|---|---|---|
| `showIcon` | `boolean` | `true` | No-op (Falcon date-picker always shows icon). |
| `dateFormat` | `string` | `'dd/mm/yy'` | No-op. Falcon date-picker uses ISO; format is its own concern. |
| `appendTo` | `string` | `'body'` | No-op. |
| `placeholder` | `string` | `''` | Passed to Falcon date-picker. |
| `disabled` | `boolean` | `false` | Drives the date-picker's disabled state. |
| `styleClass` | `string` | `'w-full'` | Forwarded. |
| `useEffectiveDateValidation` | `boolean` | `false` | No-op (Wave-3 stub). |
| `visibility` | `boolean` | `false` | No-op. |
| `status` | `FalconItemStatus \| null` | `null` | No-op. |
| `pricingType` | `PricingType \| null` | `null` | No-op. |
| `renewDate` | `Date \| null` | `null` | No-op. |

## @Outputs
| Name | Payload | Description |
|---|---|---|
| `dateChange` | `Date \| null` | Emitted on every date selection. |

## CVA / Forms support
- Provides `NG_VALUE_ACCESSOR`. `writeValue(Date|null)`.
- Internal `isoValue: string | null` is the Falcon date-picker's binding. `toIso(d)` and `fromIso(iso)` helpers handle the conversion (LOCAL time, not UTC, to avoid timezone off-by-one).

## Slots / ng-template inputs
- _None._

## Supported sizes / variants
- _None._ Inherits Falcon date-picker defaults.

## Important constraints
- Set/Cancel overlay UX replaced by immediate-commit.
- `useEffectiveDateValidation` is a no-op until Wave 4 owns re-implementation.
- The `toIso` / `fromIso` helpers explicitly use local time (year/month/day) to avoid UTC rollback in negative offsets.

## Accessibility
- Delegated to `<falcon-angular-date-picker>`.
