*** Wallets — Section: Hierarchy tree ***
*** Left org tree · 2026-05-18 ***

# Wallets — Hierarchy Tree

> Re-uses `<falcon-organization-hierarchy-tree>` from `@falcon` lib (NOT a local tree like contracts page).

## Component

`<falcon-organization-hierarchy-tree>` from `libs/falcon/src/shared-ui/...`.

## Data load

Re-uses `OrgHierarchyApiService` from organization-hierarchy feature:

```
GET commerce/Node              → root nodes
GET commerce/Node?NodeId={id}  → children (lazy load on expand)
```

Both routed via System Gateway.

## Node selection

On user click:
- `selectedNodeId = node.id` set in container.
- Triggers `forkJoin({hierarchy, channels})` (the strategy + balance load).
- Triggers PES re-evaluation for the node context.

## Tree shape

Falcon root → Main Nodes (accounts) → Sub-nodes (departments / teams).

Each node can have:
- Sub-nodes
- CommChannel wallets
- User wallets (for system + normal users at that node)

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [Organization Hierarchy] (sister)
