---
type: index
cluster: 10-non-pes-gates-by-feature
purpose: "Answers 'where to look up the 6 non-PES gate types × feature mappings'. Open to navigate the 6-gate × 7-feature matrix or recall composite-gate patterns."
---

# Non-PES Gates × Feature Cross-Cut — Index

> [!tldr]
> 6 non-PES gate types catalogued per feature. Answers "what hides/shows UI on feature F BESIDES PES?" Composite gates (PES + node-type + business-rule) are the canonical pattern.

## Files

| File | Content |
|---|---|
| [[MATRIX]] | The 6 × 7 grid + per-feature inventory + composite gate pattern + server-driven rows + porting implications |

## The 6 gate types

| Gate | Example |
|---|---|
| **PES** | `FalconAccess.adminConsole.account.add()` |
| **Session-type** | `session.userType === FALCON_USER` |
| **Node-type** | `isFalconNode`, `isFirstLevelChild`, `isRootSelection`, `isMainMenu` |
| **Mode** | `mode === HierarchyTabMode.View` |
| **Tab-visibility** | `enabled: !isFalcon && isMain` |
| **Server-driven row** | `row.allowedActions: FalconRowAction[]` |
| **Composite** | `canEditSelectedSettings` = PES + node-type + business rule |

## Quick answers

- **Which non-PES gates hide wallet-balance UI?** Session-type (Master Wallet card) + node-type (cross-account picker) + server-driven row (per-row transfer actions). See MATRIX § wallet-balance-management.
- **Composite gate canonical example?** `canEditSelectedSettings` — composes PES flag + isMainNodeSelection + isRootSelection + business rule "not deep sub-node".
- **Server-driven row example?** Marketplace + Comms-hub use `row.allowedActions` — backend stamps per-row, FE trusts.

## Why this matters for porting

When copying admin → mgmt, non-PES gates often need DIFFERENT implementations:
- Session userType is fixed per console (FALCON_USER vs CLIENT_USER)
- Node-type gates may re-evaluate (mgmt has no synthetic Falcon root)
- Tab-visibility conditions reverse direction (`!isFalcon` becomes always-true on mgmt)

## See also

- `Brain Outputs/datasets/old-ui-dataset/10-pages/admin-console/<feature>/05-PES.md` (the inputs — every "Non-PES gates" section)
- [[../04-feature-parity-matrix/MATRIX]]
- [[../07-cross-cutting/session-shape]] — the source of session-type gates
- [[../00-VERIFICATION-GATE]] — Q14 answered here
