# falcon-tag — API

## Selectors / Tags

| Mode | Tag |
|---|---|
| Stencil Shadow | `<falcon-tag>` |
| Stencil Light | `<falcon-tag-tw>` |
| Angular wrapper | `<falcon-angular-tag>` |

## Inputs (Angular wrapper)

| Input | Type | Default | Notes |
|---|---|---|---|
| `value` | `string \| null \| undefined` | `''` | Display label |
| `severity` | `FalconTagSeverity` | `'secondary'` | 7 values |
| `size` | `FalconTagSize` | `'md'` | sm / md / lg |
| `icon` | `string \| undefined` | — | Leading icon class (e.g. `'check'`) |
| `rounded` | `boolean` | `true` | Pill (true) vs square (false) |
| `dismissible` | `boolean` | `false` | Renders ✕ button |
| `useTailwind` | `boolean` | `true` | |

## Outputs

| Output | Type | When |
|---|---|---|
| `falconDismiss` | `EventEmitter<string>` | ✕ clicked — emits the tag's value |

## Stencil events

- `falcon-tag-dismiss` — `{ value: string }` (kebab-case event name)

## TypeScript types

```ts
type FalconTagSeverity =
  | 'success' | 'info' | 'warning' | 'warn'      // 'warn' kept as legacy alias for 'warning'
  | 'danger' | 'secondary' | 'contrast';

type FalconTagSize = 'sm' | 'md' | 'lg';

interface FalconTagDismissDetail { value: string; }
```

## Slots

- Stencil: default slot for richer label content (overrides `[value]`).
- Angular wrapper: YES — `<ng-content>` projected in both render paths (verified in `falcon-tag.component.html`).

## Variants

- **Severity:** 7 values — `success` / `info` / `warning` / `warn` (legacy alias) / `danger` / `secondary` / `contrast`
- **Size:** sm / md / lg
- **Shape:** `rounded=true` (pill) / `rounded=false` (square corners with `--falcon-tag-radius-square: 4px`)
- **Dismissible:** opt-in ✕ button

## CVA

NO — not a form control.

## Accessibility

- Dismiss button has `aria-label="Remove"`.
- Stencil `data-severity` + `data-size` for token cascading.
- Inline `<i>` for icon is `aria-hidden="true"`.

## Important constraints

- The Angular wrapper `classes` computed (lines 62-71) generates a hardcoded fallback set of Tailwind classes for visual fidelity. The `_severityClasses()` returns concrete `bg-falcon-{x}-{n} text-falcon-{x}-{n}` strings — these duplicate the token-driven Stencil rendering. **Note:** when `[useTailwind]="true"`, the Stencil `falcon-tag-tw` renders independently — the wrapper's `classes` computed is unused in template. Verify if this is dead code.
