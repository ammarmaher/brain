---
type: graph-index
title: MOC Connections Index — which MOCs root which graph clusters
created: 2026-05-27
wave-introduced: 1
up: "[[00_START_HERE]]"
tags: [graph, moc, index]
---

# MOC Connections Index

> [!summary]
> 76 MOC nodes catalogued in Wave 1 (46 in `falcon-wiki/00-MOCs/` + 30 in `Brain SK/_obsidian/*INDEX*.md`). This file maps each MOC to the graph cluster it roots.

## Falcon Wiki MOCs (46) → cluster roots

| MOC | Roots cluster | Wave-1 child count |
|---|---|---:|
| [[../00-MOCs/Pages]] | `Page` nodes | 14 |
| [[../00-MOCs/Components]] | `Component` nodes | 63 |
| [[../00-MOCs/PRDs]] | `Module` nodes | 6 |
| [[../00-MOCs/Services]] | `Service` nodes | 9 |
| [[../00-MOCs/Endpoints]] | `Endpoint` nodes | TBD Wave 4 |
| [[../00-MOCs/Tokens]] | `DesignToken` + `CSSVariable` nodes | TBD Wave 2 |
| [[../00-MOCs/Tests]] | (test scenarios — Wave 7 target) | TBD |
| [[../00-MOCs/Gaps]] | `Gap` nodes | TBD Wave 6 |
| [[../00-MOCs/Questions]] | (Q-* tickets — Wave 6) | TBD |
| [[../00-MOCs/Knowledge-Health]] | feeds back FROM this graph (coverage status) | — |
| [[../00-MOCs/Linker-Health]] | feeds back FROM this graph (orphan + dead-link status) | — |
| [[../00-MOCs/Orphans]] | `Gap` of type "orphan" | TBD |
| [[../00-MOCs/Dead-Links]] | broken wikilink registry | — |
| [[../00-MOCs/Frontend-Master]] | App / Feature / Component subgraph root | TBD Wave 2 |
| [[../00-MOCs/Local-Auth-Recipe]] | (operational doc, not a node MOC) | — |
| [[../00-MOCs/Local-Backend-Bring-Up]] | (operational doc) | — |
| [[../00-MOCs/Local-Test-Users]] | (operational doc) | — |
| [[../00-MOCs/Authorization-Security-MOC]] | `PESRule` cluster | 47 |
| [[../00-MOCs/PES-Subject-Contract]] | (PES sub-cluster) | — |
| [[../00-MOCs/AI-Agent-Onboarding]] | (operational doc) | — |
| [[../00-MOCs/Old-UI-Dataset-Index]] | (legacy provenance) | 150 (old-ui dossier files) |
| [[../00-MOCs/Org-Hierarchy-Tree-Component-Knowledge]] | `Component` sub-cluster (tree) | — |
| [[../00-MOCs/Add-Client-Brain-Coverage-Report]] | feature-level coverage on Add Client | — |
| [[../00-MOCs/Add-Client-Deep-Analysis-v2]] | feature-level analysis on Add Client | — |
| [[../00-MOCs/IDE-Setup-Doctrine-WebStorm-Angular-Nx]] | (operational doc) | — |
| [[../00-MOCs/Night-Shift-2026-05-16]] | (event log) | — |
| [[../00-MOCs/Brain-SK-*]] (10 cross-vault projection MOCs) | each projects the same-named Brain SK cluster | — |

## Brain SK MOCs (30) → cluster roots

| MOC | Roots cluster | Notes |
|---|---|---|
| [BRAIN-SK] `APPROVED_PATTERNS_INDEX.md` | `Pattern` nodes | from `90-Approved-Patterns/` |
| [BRAIN-SK] `BUSINESS_INDEX.md` | `BusinessRule` nodes | |
| [BRAIN-SK] `PRD_INDEX.md` | `Module` nodes | |
| [BRAIN-SK] `VALIDATION_INDEX.md` | `ValidationRule` nodes | 30 V-rules |
| [BRAIN-SK] `ERROR_INDEX.md` | error catalog cluster | |
| [BRAIN-SK] `ATLAS_MASTER_INDEX.md` | cross-cluster atlas | |
| [BRAIN-SK] `GAPS_INDEX.md` | `Gap` nodes | |
| [BRAIN-SK] `COMPONENT_INDEX.md` + `FALCON_COMPONENT_INDEX.md` | `Component` nodes (Brain SK mirror) | |
| [BRAIN-SK] `PAGE_LEARNING_INDEX.md` + `PAGES_INDEX.md` + `PAGE_KNOWLEDGE_INDEX.md` | `Page` nodes | |
| [BRAIN-SK] `UI_UX_INDEX.md` | UI/UX rule cluster | |
| [BRAIN-SK] `EVIDENCE_INDEX.md` | evidence-citation cluster | |
| [BRAIN-SK] `API_INDEX.md` + `BACKEND_INDEX.md` (×2) | `Service` + `Endpoint` + `DTO` nodes | |
| [BRAIN-SK] `PROJECT_INDEX.md` | project tracking | |
| [BRAIN-SK] `TASK_REPORT_INDEX.md` | task tracking | |
| [BRAIN-SK] `WIKI_INDEX.md` | cross-vault wiki ref | |
| [BRAIN-SK] `FALCON_EYES_INDEX.md` | visual-QA cluster | |
| [BRAIN-SK] `VISUAL_QA_INDEX.md` | visual-QA cluster | |
| [BRAIN-SK] `PR_REVIEW_INDEX.md` | PR review history | |
| [BRAIN-SK] `STATISTICS_INDEX.md` | stats dashboards | |
| [BRAIN-SK] `EXECUTIVE_REPORTS_INDEX.md` | exec reports | |
| [BRAIN-SK] `RULES_INDEX.md` (in 35-Architecture) | `ArchitectureRule` nodes | 24 |
| [BRAIN-SK] `40-Authority/_INDEX.md` | PES / authority projection | |

## MOC inter-edges (Wave 1)

These edges connect MOCs to each other where one is a parent of another:

```
00-MOCs/Pages           PARENT_MOC   00-MOCs/Frontend-Master
00-MOCs/Components      PARENT_MOC   00-MOCs/Frontend-Master
00-MOCs/Services        PARENT_MOC   00-MOCs/Brain-SK-BACKEND_INDEX
00-MOCs/PRDs            PARENT_MOC   00-MOCs/Brain-SK-BUSINESS_INDEX
00-MOCs/Tokens          PARENT_MOC   00-MOCs/Brain-SK-FRONTEND_INDEX (Wave 2 confirms)
```

## Wave 2+ MOC work

- Add Wave-MOC `00-MOCs/Waves.md` to root all wave playback files.
- Add Token-MOC sub-entries when Wave 2 extracts the 1000+ design tokens.
- Reconcile the 10 `Brain-SK-*` projection MOCs with their actual Brain SK counterparts (some have drifted per earlier night-shift audits).

## See also

- [[00_START_HERE]]
- [[COMPONENT_REGISTRY_GRAPH]]
- [[ORPHAN_NODES_REVIEW]]
