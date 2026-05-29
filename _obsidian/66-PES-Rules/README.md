---
type: cluster-index
cluster: 66-pes-rules
status: "STUB — created 2026-05-19 to close pre-existing broken wikilinks"
maintained-by: Vol 43 enhancement run
---

# 66 — PES Rules Index

> Stub MOC — closes broken wikilink targets. To be populated with PES (Permission Enforcement System) policy rules cross-referenced across modules.

## Status

🟡 **STUB**

## Purpose

A cross-page index of PES policy rules:
- 47 PES key factories from `falcon-access.registry.ts`
- 6 canonical roles from `BuiltInRoleCatalog.cs:79-290`
- Per-(role × action) policy decisions

## Source data

- `[CODE]` `BuiltInRoleCatalog.cs:79-290` (6 roles + their seeded p-rules)
- `[CODE]` `falcon-access.registry.ts:1-185` (47 PES key factories)
- `[BRAIN-OUT]` `prd/modules/02-user-management/` Permission List - Jawad.xlsx (now FULLY captured 2026-05-19)
- `[BRAIN-OUT]` `Brain Outputs/datasets/authority-dataset/03-pes-keys/REGISTRY-RAW.md`
- `[Atlas]` Vol 28 Matrix 2 (Actor × User Status × Allowed Actions)
- `[Atlas]` Vol 34-40 §5 (per-module permission matrices)

## See also

- [[AMMAR_BRAIN_HOME]]
- [[ATLAS_MASTER_INDEX]]

## Tags

#type/cluster-index #status/stub #pes #security
