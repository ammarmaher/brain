# falcon-icon — API

## Angular selector
`falcon-angular-icon`

## Stencil tags
- Shadow: `<falcon-icon>`
- Light: `<falcon-icon-tw>`

## Import path
```ts
import {
  FalconAngularIconComponent,
  type FalconIconSize,
} from '@falcon/ui-core/angular';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | (REQUIRED) | Icon name — maps to `.falcon-icon-<name>` class on the vendored font. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Drives `--falcon-icon-{size}` token. (xs=12 / sm=14 / md=16 / lg=20 / xl=24 px.) |
| `decorative` | `boolean` | `true` | When true, `aria-hidden="true"`. When false, provide `label` for screen-reader access. |
| `label` | `string \| null \| undefined` | — | Accessible label when icon conveys meaning (decorative=false). |
| `useTailwind` | `boolean` | `true` | Render-path switch. |

## Outputs
**None.** Icon is purely visual.

## TypeScript types

```ts
export type FalconIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
```

## Reflected props (Stencil)
`size`, `decorative` are reflected (and `data-size` on host).

## Stencil methods
None.

## Slots
None.

## CVA support
Not applicable.

## Signal compatibility
Wrapper uses internal `signal<string>('')` for `name` and `label`.

## Supported sizes
- `xs` — 12px (`--falcon-icon-xs`).
- `sm` — 14px (`--falcon-icon-sm`).
- `md` — 16px (default, `--falcon-icon-md`).
- `lg` — 20px (`--falcon-icon-lg`).
- `xl` — 24px (`--falcon-icon-xl`).

## Available icon names
Per project memory: 122 icons migrated from PrimeIcons. The full list is in `libs/falcon-theme/src/styles/falcon-icons.css`. Naming conventions follow the original PrimeIcons set (e.g. `pencil`, `trash`, `cog`, `user`, `check`, `times`, `chevron-down`, `arrow-right`, etc.).

## Important constraints
- **`name` is REQUIRED.** Without it, the rendered element shows nothing.
- **`decorative=true` is the default** — explicit `aria-hidden`. Most icons inside buttons / menus / tabs are decorative and the surrounding element provides the label.
- **`decorative=false` REQUIRES `label`** — pass a meaningful description. The component sets `role="img"` and `aria-label="<label>"`.
- **Color inherits from parent** — `--falcon-icon-color: currentColor`. To color an icon, set color on the parent.
- **The Falcon icon font is loaded once globally** via `falcon-icons.css`. The font-face cascades through Shadow boundaries naturally; no per-component font loading.

## Accessibility attributes
- Decorative mode: `aria-hidden="true"`, no role.
- Meaningful mode: `role="img"`, `aria-label="<label>"`.

## Parts (Stencil Shadow)
| Part | Element |
|---|---|
| `glyph` | The `<i>` element. |
