---
type: cross-cut-matrix
cluster: 40-Authority
axis: non-pes-gates-by-feature
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\10-non-pes-gates-by-feature\MATRIX.md
verified-at: 2026-05-16
purpose: "Answers 'which 6 non-PES gate types (session-type, node-type, mode, tab-visibility, server-driven, composite) apply to each feature'. Open before porting any UI."
---

> [!tldr]
> 6 non-PES gate types catalogued per feature. UI hiding usually composes 2-4 gate types together. Composite gates are the canonical pattern.

# Non-PES Gates × Feature

## The 6 gate types

| Gate | Example |
|---|---|
| PES | `FalconAccess.adminConsole.account.add()` |
| Session-type | `session.userType === FALCON_USER` |
| Node-type | `isFalconNode`, `isFirstLevelChild`, `isRootSelection`, `isMainMenu` |
| Mode | `mode === HierarchyTabMode.View` |
| Tab-visibility | `enabled: !isFalcon && isMain` |
| Server-driven row | `row.allowedActions: FalconRowAction[]` |
| Composite | All AND'd: `canEditSelectedSettings` = PES + isMainNodeSelection + isRootSelection + business rule |

## Why this matters for porting

- Session-type: fixed CLIENT_USER on mgmt — invert conditions
- Node-type: mgmt has no synthetic Falcon root — drop `isFalconNode`
- Tab-visibility: `!isFalcon && isMain` simplifies on mgmt

## Drill into Brain Outputs

`C:\Falcon\Brain Outputs\datasets\authority-dataset\10-non-pes-gates-by-feature\MATRIX.md`

## See also
- [[Session-Shape]] — source of session-type gates
- [[PES-Keys]] · [[Falcon-vs-Client]]
