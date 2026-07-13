# falcon-calendar (LEGACY FACADE — REMOVED) — API

> **RECONCILE 2026-06-03 (B22):** The legacy `<falcon-calendar>` (class `FalconCalendarComponent`) is **DELETED** from production — the barrel comment at `shared-ui/index.ts:313` says so. `import { FalconCalendarComponent } from '@falcon'` no longer resolves. The surface below is what it last exposed (5 effective-date inputs were no-ops). For date fields use `<falcon-angular-date-picker>`; for an inline grid `<falcon-angular-calendar>`. ⚠ Note the unrelated modern Stencil `<falcon-calendar>` reuses the tag — this dossier is about the deleted `libs/falcon` Angular component.

## Selector
- `<falcon-calendar>` — Angular bespoke standalone component (single-render over PrimeNG `<p-datepicker>`). **Removed.**

## Import path (no longer valid)
```ts
// REMOVED — does not resolve in 2026-06-03 tree
import { FalconCalendarComponent } from '@falcon';
// Use instead:
import { FalconAngularDatePickerComponent } from '@falcon'; // field + popover
import { FalconAngularCalendarComponent } from '@falcon';   // inline month grid
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
- Delegated to `<falcon-angular-date-picker>` (no a11y of its own).

## Reflected / mutable / signal
- _N/A._ Single-render Angular over PrimeNG — no Stencil `@Prop({reflect})`/`@Prop({mutable})`; legacy decorator `@Input`/`@Output` + plain fields (`draftValue`/`committedValue`/`snapshotValue`), no signals.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B22) — the production source is DELETED and cannot be re-read; the @Input/@Output tables are preserved verbatim from the last verified dossier (archaeology, not live API). The deletion itself is 🟢 CODE-VERIFIED (folder gone + barrel comment at index.ts:313). Migration targets `<falcon-angular-date-picker>`/`<falcon-angular-calendar>` 🟢 confirmed live.
