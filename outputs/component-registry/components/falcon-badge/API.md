# falcon-badge — API

## Selectors / Tags

| Mode | Tag |
|---|---|
| Stencil Shadow | `<falcon-badge>` |
| Stencil Light | `<falcon-badge-tw>` |
| Angular wrapper | `<falcon-angular-badge>` |

## Inputs (Angular wrapper)

| Input | Type | Default | Notes |
|---|---|---|---|
| `variant` | `FalconBadgeVariant` | `'neutral'` | One of 6 semantic variants |
| `appearance` | `FalconBadgeAppearance` | `'subtle'` | `solid` / `subtle` / `outline` |
| `size` | `FalconBadgeSize` | `'md'` | sm / md / lg |
| `dot` | `boolean` | `false` | Leading variant-tinted dot |
| `iconName` | `string \| undefined` | — | Leading icon name (`.falcon-icon-{name}`) |
| `useTailwind` | `boolean` | `true` | |

## Stencil props (one extra)

| Prop | Type | Notes |
|---|---|---|
| `ariaLabel` | `string \| undefined` | For dot-only badges with no visible text |

## Outputs

NONE — presentational.

## TypeScript types

```ts
type FalconBadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type FalconBadgeAppearance = 'solid' | 'subtle' | 'outline';
type FalconBadgeSize = 'sm' | 'md' | 'lg';
```

## Variant × appearance × size matrix

- **6 variants:** neutral / primary (teal) / success (green) / warning (amber) / danger (red) / info (blue)
- **3 appearances:** solid (filled, white fg) / subtle (tinted bg, dark fg) / outline (border, no fill)
- **3 sizes:** sm / md / lg

`6 × 3 × 3 = 54 visual combinations.` All token-driven.

## Slots

- Stencil: default slot for label content.
- Angular wrapper: YES — the wrapper template includes `<ng-content></ng-content>` inside both `<falcon-badge-tw>` and `<falcon-badge>` render paths (verified in `falcon-badge.component.html`). So `<falcon-angular-badge>3</falcon-angular-badge>` works.

## CVA

NO — not a form control.

## Accessibility

- Stencil sets `aria-label` from `ariaLabel` prop for dot-only badges.
- `data-variant`, `data-appearance`, `data-size` attributes on the host span for token cascading + selector targeting.
