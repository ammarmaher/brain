# falcon-empty-state — API

## Selectors / Tags

| Mode | Tag |
|---|---|
| Stencil Shadow | `<falcon-empty-state>` |
| Stencil Light | `<falcon-empty-state-tw>` |
| Angular wrapper | `<falcon-angular-empty-state>` |

## Inputs (Angular wrapper)

| Input | Type | Default | Notes |
|---|---|---|---|
| `iconName` | `string \| null \| undefined` | `''` | `.falcon-icon-{name}` |
| `titleText` | `string \| null \| undefined` | `''` | Required heading text |
| `descriptionText` | `string \| null \| undefined` | `''` | Optional supporting copy |
| `size` | `FalconEmptyStateSize` | `'md'` | sm / md / lg |
| `useTailwind` | `boolean` | `true` | |

## Stencil props (one extra)

| Prop | Type | Notes |
|---|---|---|
| `ariaLabel` | `string \| undefined` | Overrides accessible label (defaults to `titleText`); pass `""` to make presentational |

## Outputs

NONE — presentational.

## TypeScript types

```ts
type FalconEmptyStateSize = 'sm' | 'md' | 'lg';
```

(`FalconAngularEmptyStateSize` re-exported from the wrapper file matches the Stencil type.)

## Slots

- Stencil: named `action` slot for the action button(s) below the description.
- Angular wrapper: YES — the wrapper template projects `<ng-content select="[slot=action]">` into both render paths (verified in `falcon-empty-state.component.html`). Consumers pass `<falcon-angular-button slot="action">…</falcon-angular-button>` and the wrapper forwards the projection.

## Variants

- **Size:** sm / md / lg drives icon size + font scale + vertical rhythm.

## CVA

NO — not a form control.

## Accessibility

- Root has `role="img"` + `aria-label={titleText}` (overridable via `ariaLabel` prop).
- Icon container is `aria-hidden="true"`.
- Title rendered as `<h3>`.
- Description rendered as `<p>`.
- Action slot is a positional region, content is the consumer's responsibility.

## Important constraints

- The action slot in Stencil is `<slot name="action">`. For the Light variant `<falcon-empty-state-tw>`, projecting via Angular requires the consumer to pass `<your-content slot="action">` directly.
- The wrapper's host has `class="falcon-angular-empty-state block"`.
