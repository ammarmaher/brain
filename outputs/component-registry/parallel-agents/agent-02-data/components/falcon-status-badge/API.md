# falcon-status-badge — API

## Selectors / Tags

| Mode | Tag |
|---|---|
| Stencil Shadow | `<falcon-status-badge>` |
| Stencil Light | `<falcon-status-badge-tw>` |
| Angular wrapper | `<falcon-angular-status-badge>` |

## Inputs (Angular wrapper)

| Input | Type | Default | Notes |
|---|---|---|---|
| `severity` | `FalconStatusBadgeSeverity` | `'active'` | 9 values — see types |
| `label` | `string \| null \| undefined` | `''` | Display label (consumer translates) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `dot` | `boolean` | `true` | Leading severity-tinted dot |
| `useTailwind` | `boolean` | `true` | |

## Stencil props (one extra)

| Prop | Type | Notes |
|---|---|---|
| `ariaLabel` | `string \| undefined` | For dot-only badges with no visible text |

## Outputs / Events

NONE — presentational.

## TypeScript types

```ts
type FalconStatusBadgeSeverity =
  | 'active'      // success bucket
  | 'paid'        // success bucket
  | 'pending'     // warning bucket
  | 'suspended'   // neutral bucket
  | 'locked'      // neutral bucket
  | 'inactive'    // neutral bucket
  | 'disabled'    // neutral bucket
  | 'deleted'     // danger bucket
  | 'expired';    // danger bucket

type FalconStatusBadgeSize = 'sm' | 'md' | 'lg';
```

## Severity → visual bucket map (per `status-badge.tokens.css`)

| Severity | Bucket | bg token | fg token | dot token |
|---|---|---|---|---|
| `active`, `paid` | Success | `--color-falcon-green-200` | `--color-falcon-green-700` | `--color-falcon-green-500` |
| `pending` | Warning | `--color-falcon-amber-50` | `--color-falcon-amber-700` | `--color-falcon-amber-500` |
| `suspended`, `locked`, `inactive`, `disabled` | Neutral | `--color-falcon-neutral-175` | `--color-falcon-neutral-700` | `--color-falcon-neutral-500` |
| `deleted`, `expired` | Danger | `--color-falcon-red-100` | `--color-falcon-red-700` | `--color-falcon-red-500` |

## Slots

- Stencil: default slot for richer label content (overrides `label` prop).
- Angular wrapper: NO `<ng-template>` projection — `[label]` is the only label input.

## Variants

- **Size:** `sm` (10px font, 60px min-width, 5px dot), `md` (12px font, 74px min-width, 6px dot, **default**), `lg` (13px font, 88px min-width, 8px dot).
- **With/without dot:** `[dot]="true|false"`.

## CVA

NO — not a form control.

## Accessibility

- Stencil sets `aria-label` from the `ariaLabel` prop when no visible label exists (dot-only mode).
- The wrapper has `inline-flex align-middle` host class for inline placement.
- Color contrast — bucket fg/bg tokens are tested for WCAG AA in the React V0.2 reference.
