---
type: cross-cut-matrix
cluster: 100-Authority
axis: non-pes-gates-by-feature
projection-source: _mounts/brain-outputs/datasets/authority-dataset/10-non-pes-gates-by-feature/MATRIX.md
verified-at: 2026-05-16
purpose: "Answers 'which 6 non-PES gate types (session-type, node-type, mode, tab-visibility, server-driven, composite) apply to each feature'. Open before porting any UI."
---

> [!tldr]
> The 6 non-PES gate types catalogued per feature. PES is one of many gates — UI hiding usually composes 2-4 gate types together. Composite gates like `canEditSelectedSettings` are the canonical pattern.

# Non-PES Gates × Feature

## The 6 gate types

| Gate | Mechanism | Example |
|---|---|---|
| **PES** | Policy decision | `FalconAccess.adminConsole.account.add()` |
| **Session-type** | JWT user-type claim | `session.userType === FALCON_USER` |
| **Node-type** | Tree position flag | `isFalconNode`, `isFirstLevelChild`, `isRootSelection`, `isMainMenu` |
| **Mode** | Component state | `mode === HierarchyTabMode.View` |
| **Tab-visibility** | Computed in tabs-layout | `enabled: !isFalcon && isMain` |
| **Server-driven row** | Backend stamps per-row | `row.allowedActions: FalconRowAction[]` |
| **Composite** | All of the above AND'd | `canEditSelectedSettings` = PES + isMainNodeSelection + isRootSelection + business rule |

## Composite gate canonical example

```typescript
get canEditSelectedSettings(): boolean {
  return this.canEditPasswordSecurityLevel    // PES flag
      && (this.isRootSelection                  // node-type
          || this.isMainNodeSelection)          // node-type
      && this.mode === HierarchyTabMode.Edit;   // mode
}
```

This is why pure PES checks are insufficient — node-type business rules compose on top.

## Server-driven row pattern

Marketplace + Comms-hub stamp `row.allowedActions: FalconRowAction[]` server-side per row. FE trusts the backend — no client-side `canDo*` flags for row-level decisions. Pattern preserved across admin → mgmt port.

## Why this matters for porting (admin → mgmt)

| Gate type | Difference on mgmt side |
|---|---|
| Session-type | Fixed CLIENT_USER (not FALCON_USER) — invert conditions |
| Node-type | Mgmt has no synthetic Falcon root — drop `isFalconNode` checks |
| Tab-visibility | `!isFalcon && isMain` becomes always-true → simplify or drop |
| Composite gates | Often simpler on mgmt (fewer business-rule layers) |

## Drill into Brain Outputs

[Full matrix → 10-non-pes-gates-by-feature/MATRIX.md](../_mounts/brain-outputs/datasets/authority-dataset/10-non-pes-gates-by-feature/MATRIX.md)

## See also

- [[Session-Shape]] — source of session-type gates
- [[PES-Keys]] — the one gate type covered by my Phase 1 dataset
- [[Falcon-vs-Client]] — feature classification
