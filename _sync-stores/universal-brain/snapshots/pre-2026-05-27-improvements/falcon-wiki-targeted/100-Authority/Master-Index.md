---
type: master-index
cluster: 100-Authority
title: Falcon Knowledge — Master Index (router across all knowledge stores)
projection-source: _mounts/brain-outputs/datasets/authority-dataset/0-MASTER-INDEX.md
verified-at: 2026-05-16
purpose: "Answers 'where is every piece of Falcon knowledge + which trigger phrase loads it'. Open at session start as the single entry point to ALL Falcon knowledge stores."
---

> [!tldr]
> **Read this FIRST.** The 7 Falcon knowledge stores with a complete routing table. Use this to find which store owns your question before loading any specific file.

# Master Index — Falcon Knowledge Router

## The 7 knowledge stores

| # | Store | Primary path | What it owns |
|---|---|---|---|
| 1 | **Authority Dataset** | `Brain Outputs/datasets/authority-dataset/` | Authority · validation · drift · BR · view-hide · port · freshness · errors · flows · pitfalls · triggers · A→Z traces |
| 2 | **Brain Outputs/Understanding** | `Brain Outputs/understanding/` | Per-service deep specs · per-page learning · per-component dossiers (62) |
| 3 | **Brain Skills** | `brain-skills/` + `Brain SK/skills/` | Rule books (Angular/Tailwind/Nx/UI-UX/Business/PDF) |
| 4 | **Falcon Wiki** (this vault) | `falcon-wiki/` | Architecture wiki + typed PRD/page/component/service notes + Authority projections |
| 5 | **Brain SK Obsidian** | `Brain SK/_obsidian/` | V-rules (25) · E-* entities (15) · Permissions matrices · Pages · Components · Journeys |
| 6 | **PRD Modules** | `Brain Outputs/prd/modules/` | Canonical PRD content per module |
| 7 | **Old-UI Dataset** | `Brain Outputs/datasets/old-ui-dataset/` | Proven feature inventory from `origin/main` |

## Drill into Brain Outputs

[Full Master Index with routing table](../_mounts/brain-outputs/datasets/authority-dataset/0-MASTER-INDEX.md) — comprehensive question → store mapping for all 12 axes of Falcon knowledge

## Session-start protocol

1. Read this Master Index
2. Read [[Verification-Status]] (know what's tested vs not)
3. Identify task type
4. Use the routing table in the SoT file to find the owning store
5. Load the specific file
6. Source-prefix every fact

## See also

- [[_INDEX]] — this cluster's MOC
- [[Verification-Status]] — verified vs unverified
- [[Authorization-Security-MOC]] — auth-model overview (sister cluster)
- All other 100-Authority/ notes
