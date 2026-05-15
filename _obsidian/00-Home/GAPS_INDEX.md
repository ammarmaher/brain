---
type: hub
hub: gaps
created: 2026-05-15
---
*** Gaps Index — graph hub ***
*** Updated 2026-05-15 ***

# Gaps Index

> Brain Outputs holds the gaps. This note holds the graph.
>
> **Canonical knowledge root:** [`Brain Outputs/understanding/KNOWLEDGE_ROOT_INDEX.md`](../../../Brain%20Outputs/understanding/KNOWLEDGE_ROOT_INDEX.md). Gaps live at `understanding/pages/<page>/GAP_REGISTRY.md` (page-specific) and [`understanding/integration/GAP_LIST.md`](../../../Brain%20Outputs/understanding/integration/GAP_LIST.md) (cross-cutting).

## Per-page gap registries

| Page | Gap registry | Open gaps |
|---|---|---|
| organization-hierarchy | [GAP_REGISTRY.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/GAP_REGISTRY.md) | 14 (baseline) |

## Gap entry rule

Every gap entry in any `GAP_REGISTRY.md` MUST link:

| Required link | Target |
|---|---|
| Page | `10-Pages/<Page>.md` (this vault) + `Brain Outputs/understanding/pages/<page>/PAGE_LEARNING.md` |
| Component | `60-Components/<Component>.md` (this vault) when applicable |
| Evidence | `Brain Outputs/understanding/pages/<page>/evidence/<learningId>/` when applicable |
| Status | one of `open · in-progress · resolved · accepted-debt` |
| Next action | freeform text + ownership |
| Category | one of `UI/UX · Validation · API · Business · Component · Source-Truth` |

## PRD gaps (upstream gap source)

| PRD | Gaps file (SoT) | COVERED | PARTIAL | MISSING | UNVERIFIABLE | Vault note |
|---|---|---:|---:|---:|---:|---|
| 01 — Account Management | [GAPS](../../../Brain%20Outputs/prd/modules/01-account-management/GAPS.md) | 18 | 3 | 3 | 9 | [[01 Account Management]] |
| 02 — User Management | [GAPS](../../../Brain%20Outputs/prd/modules/02-user-management/GAPS.md) | 20 | 6 | 2 | 9 | [[02 User Management]] |
| 03 — Contract / Packaging / Charging / Billing | [GAPS](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/GAPS.md) | 13 | 7 | 6 | 14 | [[03 Contract Packaging Charging Billing]] |
| 04 — Contact Group Management | [GAPS](../../../Brain%20Outputs/prd/modules/04-contact-group-management/GAPS.md) | 14 | 2 | 5 | 8 | [[04 Contact Group Management]] |
| 05 — Templates | [GAPS](../../../Brain%20Outputs/prd/modules/05-templates/GAPS.md) | 3 | 2 | 21 | 1 | [[05 Templates]] |
| — Root meta | [GAPS](../../../Brain%20Outputs/prd/modules/root-documents/GAPS.md) | 1 | 1 | 8 | 1 | [[Root Documents]] |
| **TOTAL** | [PRD_GAP_SUMMARY](../../../Brain%20Outputs/prd/PRD_GAP_SUMMARY.md) | **69** | **21** | **45** | **42** | — |

**Effective measurable rows:** 143 → **Coverage 48.3 %** · **Coverage+Partial 63.0 %**

## Related hubs

- [[PAGE_LEARNING_INDEX]] · [[UI_UX_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[BUSINESS_INDEX]] · [[COMPONENT_INDEX]] · [[EVIDENCE_INDEX]] · [[PRD_INDEX]]

## Tags

#type/index #prd/01 #prd/02 #prd/03 #prd/04 #prd/05 #prd/root #gap
