# falcon-multiselect (LEGACY STUB — REMOVED) — API

> **RECONCILE 2026-06-03 (B22):** The stub is **DELETED.** `import { FalconMultiselectComponent } from '@falcon'` no longer resolves (the barrel exports only `FalconAngularMultiSelectComponent`, `shared-ui/index.ts:58`). The surface below is what the stub last exposed — nearly all inputs were silent no-ops. For multi-select use `<falcon-angular-multi-select>`.

## Selector
- `<falcon-multiselect>` — Angular bespoke standalone component (single-render, no Stencil twin). **Removed.**

## Import path (no longer valid)
```ts
// REMOVED — does not resolve in 2026-06-03 tree
import { FalconMultiselectComponent } from '@falcon';
// Use instead:
import { FalconAngularMultiSelectComponent } from '@falcon';
```

## TypeScript types
```ts
// libs/falcon/src/shared-ui/lib/components/falcon-multiselect/falcon-multiselect.models.ts
export interface FalconMultiselectItem {
  id: string;
  displayName: string;
  subtitle?: string;
}
```

## @Inputs (decorator-based)
ALL inputs are preserved for API compat. Most are silent no-ops on the stub façade.

| Name | Type | Default | Notes |
|---|---|---|---|
| `items` | `FalconMultiselectItem[]` | `[]` | Renders as `<falcon-angular-multi-select>` options. |
| `selectedIds` | `string[]` | `[]` | Renders as `value`. |
| `loading` | `boolean` | `false` | No-op. |
| `showSelectAll` | `boolean` | `true` | No-op. |
| `showSelectedPanel` | `boolean` | `false` | No-op. |
| `leftTitle` | `string` | `''` | No-op. |
| `leftSubtitle` | `string` | `''` | No-op. |
| `rightTitle` | `string` | `'Selected'` | No-op. |
| `placeholder` | `string` | `'Search...'` | Passed to dropdown if applicable. |
| `emptyMessage` | `string` | `'No items selected'` | No-op. |
| `unselectAllLabel` | `string` | `'Unselect all'` | No-op. |
| `selectAllLabel` | `string` | `'All'` | No-op. |
| `allSelectedMessage` | `string` | `'All items are selected'` | No-op. |
| `maxChipCount` | `number` | `3` | No-op. |
| `selectedItemsLabel` | `string` | `'{0} items selected'` | No-op. |
| `filterBy` | `string` | `'displayName,subtitle'` | No-op. |
| `scrollHeight` | `string` | `'290px'` | No-op. |
| `minHeight` | `string` | `'420px'` | No-op. |
| `skeletonRows` | `number` | `5` | No-op. |
| `skeletonSelectedRows` | `number` | `3` | No-op. |
| `serverFilter` | `boolean` | `false` | No-op. |
| `hasMore` | `boolean` | `false` | No-op. |
| `scrollThreshold` | `number` | `50` | No-op. |
| `searching` | `boolean` | `false` | No-op. |
| `selectAllLoading` | `boolean` | `false` | No-op. |

## @Outputs
All preserved on the public surface. Most fire only via the embedded multi-select.

| Name | Payload |
|---|---|
| `selectedIdsChange` | `string[]` |
| `selectionChange` | `FalconMultiselectItem[]` |
| `allSelectedChange` | `boolean` |
| `filterChange` | `string` |
| `selectAllRequested` | `void` |
| `scrollEnd` | `void` |
| `panelShow` | `void` |

## CVA / Forms support
- **None.** Two-way pattern via `[selectedIds]` + `(selectedIdsChange)`.

## Slots / ng-template inputs
- _None._

## Important constraints
- Dual-panel UX is NOT preserved.
- Server-filter, infinite-scroll, Select-All-with-cross-page-cache are NOT preserved.
- The embedded `<falcon-angular-multi-select>` only displays a single list.

## Accessibility
- Delegated to `<falcon-angular-multi-select>` (no a11y of its own).

## CVA / signal / reflected / mutable
- **No CVA.** Two-way `[selectedIds]` + `(selectedIdsChange)` only — could not be a Reactive-Forms control. Legacy decorator `@Input`/`@Output`, no signals. No Stencil reflected/mutable props (single-render).

## Verification
🟡 CODE-DERIVED 2026-06-03 (B22) — the source is DELETED and cannot be re-read; the input/output tables are preserved verbatim from the last verified Wave-3 dossier (archaeology, not live API). The deletion itself is 🟢 CODE-VERIFIED (folder + barrel export gone). Migration target `<falcon-angular-multi-select>` 🟢 confirmed live.
