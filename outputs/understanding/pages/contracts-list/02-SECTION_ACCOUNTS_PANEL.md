*** Contracts List — Section: Accounts panel ***
*** Left-side accounts tree · 2026-05-18 ***

# Contracts List — Accounts Panel

> Left-side tree of accounts. **Local component** — NOT the shared `<falcon-organization-hierarchy-tree>` ([CODE] `apps/admin-console/.../shared/components/contracts-accounts-panel/`). Single-level under `/` — does NOT lazy-load sub-nodes ([INFERRED] contracts are only authored at Main Node / Account level, never sub-nodes).

## Component

`<app-contracts-accounts-panel>` — selector + standalone.

Inputs:
- `selectedNodeId: string | null`

Outputs:
- `(nodeSelect): TreeNode` — emits the PrimeNG TreeNode object on selection

## Data load

Uses `OrgHierarchyApiService` from organization-hierarchy feature ([CODE] reused):

```typescript
GET commerce/Node              → root nodes
GET commerce/Node?NodeId={id}  → children (not used here — flat list)
```

## Display

Each tree row shows:
- Icon (from node config)
- Account name
- Tenant / Main Node level

## Why not the shared tree?

[INFERRED] Two reasons:
1. The shared `<falcon-organization-hierarchy-tree>` lazy-loads children — contracts only care about Main Nodes, so the lazy-load chrome is wasted.
2. Custom click behavior — single-click selects (no expand/collapse) since there are no children to drill into.

## Anti-pattern flag

Local re-implementation of a tree control. New UI should evaluate using the canonical `<falcon-organization-hierarchy-tree>` with a `[mode]="'flat-accounts-only'"` prop or similar. Flagged as `GAP-CC-LIST-LOCAL-TREE`.

## Falcon component composition (NEW UI target)

| Element | Falcon component | Customization |
|---|---|---|
| Tree shell | `<falcon-organization-hierarchy-tree>` with `[loadDepth]="1"` OR a new `<falcon-account-tree>` | flat-accounts-only mode |
| Tree row | (composed inside tree) | shows icon + name |
| Empty state | inline message | "No accounts found." |

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [09-COMPONENTS](09-COMPONENTS.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
