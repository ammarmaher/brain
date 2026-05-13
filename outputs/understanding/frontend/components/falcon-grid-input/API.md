# falcon-grid-input — API

## Selectors

- Angular: `falcon-angular-grid-input`
- Stencil Shadow: `<falcon-grid-input>`
- Stencil Light: `<falcon-grid-input-tw>`

## Import

```ts
import { FalconAngularGridInputComponent } from '@falcon/ui-core';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `value` (setter) | `string` | `''` | |
| `originalValue` | `string` | `''` | Restored on Escape. |
| `autoFocus` | `boolean` | `true` | Auto-focuses on mount. |
| `disabled` | `boolean` | `false` | |
| `useTailwind` | `boolean` | `true` | |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `falconGridCommit` | `{ value: string }` | Enter or blur. |
| `falconGridCancel` | `void` | Escape — value reverted to `originalValue`. |
| `falconGridNavigate` | `{ direction: 'next' \| 'previous' }` | Tab / Shift+Tab after commit. |

## TypeScript types

```ts
interface FalconGridCommitDetail { value: string; }
interface FalconGridNavigateDetail { direction: 'next' | 'previous'; }
```

## CVA

**NO.** Bind via `[value]` + `(falconGridCommit)` event.

## Methods

None proxied.

## Slots / template inputs

- None.

## Constraints

- Enter → commits value via `falconGridCommit`.
- Escape → reverts to `originalValue` + emits `falconGridCancel`.
- Tab / Shift+Tab → commits + emits `falconGridNavigate` so the host table can move focus.
- Blur → commits (same as Enter).
- No label / helper / error — pure cell editor.

## Accessibility

- Native `<input>` underneath.
- `aria-label` should be set by the host based on column context (verify).
- Tab/Shift+Tab nav events let host implement cell-level focus management.
