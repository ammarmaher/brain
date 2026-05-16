# Cross-page dependencies — contracts-cost-management

## Inbound (this feature depends on)

### Other feature folders (sibling apps/admin-console paths)
| What | Source path | Purpose |
|---|---|---|
| `OrgHierarchyApiService` | `apps/admin-console/src/app/features/organization-hierarchy/services/org-hierarchy.api.service.ts` | Tree-panel data loading (`getRootNodes`, `getChildren`) consumed via `ContractsAccountsPanelComponent` |
| `OrgHierarchyNode` type | `apps/admin-console/src/app/features/organization-hierarchy/models/org-hierarchy.models.ts` | Account-tree node interface |
| `mapOrgNodeToTreeNode`, `updateTreeNodeChildren` | `apps/admin-console/src/app/features/organization-hierarchy/utils/org-hierarchy.mapper.ts` | Map service models to PrimeNG TreeNode |

### `@falcon` library (`libs/falcon/`)
| Symbol | Used for |
|---|---|
| `HttpService`, `ServiceOperationResult`, `useGateway` | All HTTP calls in `ContractsApiService` |
| `TranslateService`, `TranslatePipe` | i18n throughout |
| `DynamicStepperComponent`, `StepperConfig`, `SelectedNodeInfo` | 4-step wizard |
| `FalconCalendarComponent` | Date pickers in wizard + edit |
| `SessionProvider`, `USER_TYPE_STRINGS`, `FALCON_ROOT_NODE` | Falcon-user detection in accounts panel |
| `FalconIconComponent` | Node icons + add button glyph |

### Shared components (`apps/admin-console/src/app/shared/`)
| Component | Selector | File |
|---|---|---|
| `ContractsAccountsPanelComponent` | `app-contracts-accounts-panel` | `shared/components/contracts-accounts-panel/contracts-accounts-panel.component.ts` |
| `ContractsDataTableComponent` | `app-contracts-data-table` | `shared/components/contracts-data-table/contracts-data-table.component.ts` |
| `ContractsNodeHeaderComponent` | `app-contracts-node-header` | `shared/components/contracts-node-header/contracts-node-header.component.ts` |
| `ContractsEmptyStateComponent` | `app-contracts-empty-state` | `shared/components/contracts-empty-state/contracts-empty-state.component.ts` |
| `PrimaryButtonComponent`, `SecondaryButtonComponent` | `app-primary-button`, `app-secondary-button` | `shared/components/primary-button/primary-button.component.ts` |

[INFERRED] The five contract-prefixed shared components were authored for this feature first. Naming convention (`contracts-*`) suggests they were extracted to `shared/` to allow future reuse but currently have **only this consumer**.

## Outbound (other features depend on this)

### Direct imports from this feature folder
**None.** [CODE] grep shows zero imports of any symbol from `features/contracts-cost-management/` outside the feature itself.

### Service registry (providedIn: 'root')
- `ContractsApiService` is `providedIn: 'root'` (potentially reachable from anywhere) but has **no external callers**. [CODE] confirmed.

## Shared state
- **Reads:**
  - PrimeNG `TreeNode` from `ContractsAccountsPanelComponent` output `(nodeSelected)` — drives all subsequent loads.
  - `SessionProvider.session.userType` for Falcon-vs-Client root rendering.
  - `document.documentElement.dir` for RTL detection (locale + flex direction).
- **Writes:**
  - Nothing global. All state is component-scoped.

## Navigation entry points
- Menu item: "Contracts & Cost Management" (`breadcrumb: 'Contracts & Cost Management'`, `apps/admin-console/src/app/features/routes.ts:48`).
- Deep links: `/admin-console/contracts-cost-management` — no `:id` segment; row selection is in-page.

## Related features (peer-level commercial features)

| Page | Path | Relation to contracts |
|---|---|---|
| `marketplace-applications` | `/admin-console/marketplace-applications` | Sets per-application visibility + price-type + price-value at the **node** level. Contracts then build per-(app × channel) rate matrices over those visible applications. |
| `comms-hub` (`comm-mgmt`) | `/admin-console/comm-mgmt` | Comm-channel equivalent — per-channel visibility + price-type + price-value. Contracts consume `commerce/Node/{id}/comm-channels/visible` to populate `channelOptions`. |
| `wallet-balance-management` | `/admin-console/wallet-balance-management` | Wallet strategy configuration. Without a wallet strategy for the node, "Add Contract" is disabled. **Hard dependency.** |
| `organization-hierarchy` | `/admin-console/organization-hierarchy` | Owns the tree-panel data API (`commerce/Node`). All node-scoped pages consume it. |

## Cross-feature shared dependencies (highlighted for new theme)
1. **`useGateway()` HTTP context** — single mechanism for picking System/Core/Charging/Identity gateway. Used by every commerce + charging call.
2. **`ServiceOperationResult<T>` wrapper** — universal response envelope across Falcon.
3. **`SessionProvider`** — sole source of `userType`, `tenantId`, `client_id`. Determines Falcon vs Client UX paths.
4. **PrimeNG `TreeNode`** — the de-facto tree-node type used across all node-scoped pages. Will likely need a Falcon-owned replacement in the new theme.

## NO bidirectional event bus / pub-sub
This feature does not emit cross-feature events. All inter-page coordination is via URL navigation + re-fetching on the destination page.
