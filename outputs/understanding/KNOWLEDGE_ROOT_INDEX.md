*** Canonical Knowledge Root — Brain Outputs / understanding ***
*** Path: C:\Falcon\Brain Outputs\understanding\KNOWLEDGE_ROOT_INDEX.md ***
*** Created: 2026-05-15 ***

# Canonical Knowledge Root — `understanding/`

> **Architectural rule:** `C:\Falcon\Brain Outputs\understanding\` is the canonical root for ALL Brain SK knowledge. Every Adnan / Ammar agent reads here. Obsidian is the graph/navigation layer over this root — it does NOT duplicate content.
>
> Mirror destination: `C:\Falcon\Brain SK\outputs\understanding\` (additive sync only via `robocopy /E /XO`; never `/MIR`).

## Folder map

| Folder | Status | Purpose | Read by | Written by | Obsidian index |
|---|---|---|---|---|---|
| [`frontend/`](frontend/) | **ACTIVE** | Frontend / component / UI knowledge — 62 component dossiers (OVERVIEW · API · USAGE · TOKENS · GAPS_AND_UPGRADES · DECISION), `architecture/`, `migration/`, `narrative/`, `patterns/` (global frontend patterns), `theme/`, `_scan-state/` | every frontend Ammar, page-learning skill, falcon-eyes skill, component-knowledge skill | component-knowledge incremental-scan, page-learning Deep mode (promotion to `patterns/`), theme/architecture audits | [[FRONTEND_INDEX]] · [[COMPONENT_INDEX]] · [[APPROVED_PATTERNS_INDEX]] |
| [`backend/`](backend/) | **ACTIVE** | Per-service knowledge — `SERVICE_OVERVIEW.md` · `ENDPOINT_REGISTRY.md` · `DTO_DICTIONARY.md` · `VALIDATIONS.md` · `ERRORS.md` · `FRONTEND_CONTRACT.md` per service. Includes domain services (e.g. account-management, contact-group) under each service's folder | every backend Ammar, full-stack integration tasks, API-rule learning intake | backend-api-understanding skill, gateway-map skill | [[BACKEND_INDEX]] · [[API_INDEX]] |
| [`integration/`](integration/) | **ACTIVE** | Full-stack integration knowledge — `INTEGRATION_OVERVIEW.md`, `API_TO_COMPONENT_TRACE.md`, `READINESS_MATRIX.md`, `GAP_LIST.md`, `BLOCKERS_AND_QUESTIONS.md`, `NEXT_ACTIONS.md` | full-stack Ammar tasks, page implementation routing | integration / FE↔BE contract mapping skill | [[FRONTEND_INDEX]] · [[BACKEND_INDEX]] · [[GAPS_INDEX]] |
| [`pages/`](pages/) | **ACTIVE** | Page Learning System — one folder per Falcon page with `PAGE_LEARNING.md`, `LIGHT_LEARNING_EVENTS.md`, `PENDING_PAGE_PATTERNS.md`, `APPROVED_PAGE_PATTERNS.md`, `REJECTED_PAGE_PATTERNS.md`, `PROMOTION_CANDIDATES.md`, `UI_UX_RULES.md`, `VALIDATION_RULES.md`, `API_RULES.md`, `BUSINESS_RULES.md`, `GAP_REGISTRY.md`, `EVIDENCE_INDEX.md`, `COMPONENT_USAGE_DECISIONS.md`, `PAGE_SCORECARD.md`, `LEARNING_CHANGE_HISTORY.md`, and `evidence/<learningId>/` | every page task, Learning-First Task Routing modes 1-6 | page-learning skill (Light + Deep), falcon-eyes screenshot intake | [[PAGE_LEARNING_INDEX]] · [[PAGES_INDEX]] · [[PAGE_KNOWLEDGE_INDEX]] · [[UI_UX_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]] · [[EVIDENCE_INDEX]] · [[APPROVED_PATTERNS_INDEX]] |
| [`wiki/`](wiki/) | **ACTIVE** | Architecture wiki references — `ARCHITECTURE_RULES.md`, `ARCHITECTURE_CONFLICTS.md`, `WIKI_FALLBACK_NOTE.md`, `WIKI_IMAGE_INDEX.md`. Mirror of Falcon Wiki facts after each sync | every Ammar pre-implementation | wiki-architect skill | [[WIKI_INDEX]] |

## Conceptual mappings (no dedicated top-level folder — read from these locations instead)

| Concept Ammar asks about | Lives in | Notes |
|---|---|---|
| **service / domain-service knowledge** | `backend/<short-name>/` (e.g. `backend/commerce/`, `backend/charging/`) | Long-name folders (`falcon-core-commerce-svc/`) are stubs only — see "Risks" below |
| **business rules** | per-page `BUSINESS_RULES.md` + (when shared) `frontend/patterns/PAGE_SECTION_PATTERN.md` | Approved through Deep Page Learning |
| **api / endpoint / DTO** | `backend/<service>/ENDPOINT_REGISTRY.md` + `DTO_DICTIONARY.md` · per-page `API_RULES.md` | Cross-link both when wiring FE↔BE |
| **gaps** | per-page `GAP_REGISTRY.md` (page-scoped) + `integration/GAP_LIST.md` (cross-cutting) | [[GAPS_INDEX]] aggregates |
| **evidence** | per-page `evidence/<learningId>/` + `reports/falcon-eyes/<run>/` for screenshot comparisons | [[EVIDENCE_INDEX]] aggregates |
| **scan freshness** | `frontend/_scan-state/` + per-page `_scan-state/` | Read before deciding what to re-scan |

## Source-of-truth priority (when artifacts disagree)

1. Architecture Wiki / architect-approved rules — `wiki/` + `Brain Outputs/wiki-architect/`
2. Backend controllers / DTOs / validators — `backend/<service>/`
3. Approved page rules — per-page APPROVED files
4. Existing codebase (`_mounts/services/` references when scanning)
5. Falcon component registry — `frontend/`
6. Global frontend patterns — `frontend/patterns/`
7. HTML/React/screenshot reference material — `Brain Outputs/reports/`
8. Best-practice assumptions, clearly marked

## Hard rules

- Brain Outputs is the source of truth. Obsidian holds the graph only.
- Page-specific rules stay page-specific unless Ammar says `promote this globally`.
- Scorecards count APPROVED entries only. Any dimension < 60 % → `NEEDS ATTENTION`.
- Mirror to `Brain SK\outputs\` is additive only (`/E /XO`; never `/MIR`).
- No commits/pushes without an explicit `commit` / `push` in the current message.

## PRD upstream layer (`Brain Outputs/prd/`)

PRDs are **upstream** of every active folder under `understanding/`. Business rules, validation rules, API contracts, page screens, and component choices all derive from PRDs. The PRD tree is a peer to `understanding/` (not a child), but every PRD module feeds artifacts into `understanding/`.

| PRD module | SoT folder | Feeds (vault graph) | Backend services |
|---|---|---|---|
| 01 Account Management | [`prd/modules/01-account-management/`](../prd/modules/01-account-management/) | [[01 Account Management]] · [[Organization Hierarchy]] · all 10 component notes | commerce · charging · identity |
| 02 User Management | [`prd/modules/02-user-management/`](../prd/modules/02-user-management/) | [[02 User Management]] · login + user pages | identity · access · commerce |
| 03 Contract / Packaging / Charging / Billing | [`prd/modules/03-contract-packaging-charging-billing-management/`](../prd/modules/03-contract-packaging-charging-billing-management/) | [[03 Contract Packaging Charging Billing]] · contracts pages | commerce · charging · provisioning |
| 04 Contact Group Management | [`prd/modules/04-contact-group-management/`](../prd/modules/04-contact-group-management/) | [[04 Contact Group Management]] · contact-group pages | contact-group · access · templates |
| 05 Templates | [`prd/modules/05-templates/`](../prd/modules/05-templates/) | [[05 Templates]] · templates pages | templates _(architectural decision pending)_ |
| — Root meta | [`prd/modules/root-documents/`](../prd/modules/root-documents/) | [[Root Documents]] | platform |

PRD-knowledge skill: [`brain-skills/business-skills/prd-knowledge/Skill.md`](../../brain-skills/business-skills/prd-knowledge/Skill.md). Trigger: `take latest from PRD`. Last sync: 2026-04-24 — **STALE** at 21 days (14-day threshold). Coverage: 48.3 % effective.

## Routing reference

Every task routes through [`Brain SK/protocols/LEARNING_FIRST_TASK_ROUTING.md`](../../Brain%20SK/protocols/LEARNING_FIRST_TASK_ROUTING.md) before any code, plan, or fix:

| Task type | Loads (in order) |
|---|---|
| Frontend task | `frontend/` (registries + `patterns/` + per-component dossier) + page `pages/<page>/` if a page is named |
| Backend task | `backend/<service>/` + `integration/` if cross-service |
| Full-stack task | `frontend/` + `backend/<service>/` + `integration/` + `pages/<page>/` |
| Page task | `pages/<page-name>/` (all 14+ files) + relevant component dossiers from `frontend/components/` + Falcon Eyes reports if any |
| Screenshot / bug task | `pages/<page>/evidence/<learningId>/` (save first) + relevant component dossier + Falcon Eyes report if generated |

## Risks (carried into the dated verification report)

- `backend/` has TWO naming styles side-by-side: short-name (`commerce`, `charging`, …) and long-name (`falcon-core-commerce-svc`, …). The short-name folders carry the active content; the long-name folders are empty stubs. Action: keep short-name as canonical; let backend-skill cleanups absorb the stubs over time.
- `_obsidian/` symlinks/mounts at `Brain Outputs/_mounts/` are NOT scanned here (they live in `Brain SK/_mounts/` per Obsidian vault setup).
- Legacy mirrors at `Brain Outputs/component-registry/` and `Brain Outputs/frontend-understanding/` remain for archival provenance — see legacy-only table below.

## Legacy / mirror / import — NOT to be used as active source

| Folder | Status | Reason kept |
|---|---|---|
| `Brain Outputs/component-registry/` | LEGACY | Pre-canonicalization registry; readers must use `frontend/` |
| `Brain Outputs/frontend-understanding/` | LEGACY | Pre-canonicalization tree; readers must use `frontend/` |
| `Brain Outputs/discovery/` | DISCOVERY | Bootstrap discovery outputs (one-time runs). Active for re-bootstrap only |
| `Brain Outputs/readiness/` | OUTPUT | Readiness reports, not a knowledge source |
| `Brain Outputs/scan-metadata/` | METADATA | Replaced by per-domain `_scan-state/`; archival only |
| `Brain Outputs/prd/` | ACTIVE (separate) | PRD analysis from `prd-knowledge` skill (not a duplicate of `understanding/`) |
| `Brain Outputs/wiki-architect/` | ACTIVE (separate) | Wiki analysis from `wiki-architect` skill (companion to `understanding/wiki/`) |
| `Brain Outputs/reports/` | OUTPUT | All dated run reports — companion to knowledge root, not part of it |
| `Brain Outputs/strategies/` | ACTIVE (separate) | Cross-cutting strategy docs (e.g. `falcon-component-creation/01-CANONICAL_PATTERN.md`) |
| `Brain SK/outputs/component-registry/` | LEGACY MIRROR | Pre-canonicalization; same status as Brain Outputs counterpart |
| `Brain SK/outputs/frontend-understanding/` | LEGACY MIRROR | Pre-canonicalization; same status as Brain Outputs counterpart |
| `Brain SK/outputs/understanding/` | ACTIVE MIRROR | Additive mirror of this canonical root |

## Brain SK skills that read/write this root

| Skill | Path | Reads | Writes |
|---|---|---|---|
| page-learning | `Brain SK/domains/frontend/page-learning/SKILL.md` | `pages/<page>/`, `frontend/`, `backend/` (for API rules), `frontend/patterns/` | `pages/<page>/` (Light pending events) · `pages/<page>/` APPROVED files + `frontend/patterns/` (Deep mode only) |
| falcon-eyes | `Brain SK/domains/frontend/falcon-eyes/SKILL.md` | `pages/<page>/`, `frontend/components/` | `Brain Outputs/reports/falcon-eyes/<run>/`, `pages/<page>/EVIDENCE_INDEX.md` |
| component-knowledge incremental-scan | `Brain SK/domains/frontend/component-knowledge/incremental-scan/SKILL.md` | `frontend/_scan-state/`, source repos | `frontend/components/<component>/`, `frontend/_scan-state/`, `Brain Outputs/reports/component-scans/<run>/` |
| backend-api-understanding | (TBD per backend domain) | source repos, `backend/<service>/` | `backend/<service>/` |
| wiki-architect | `Brain SK/skills/wiki-architect/` | Falcon Wiki | `wiki/`, `Brain Outputs/wiki-architect/` |
| prd-knowledge | `brain-skills/business-skills/prd-knowledge/Skill.md` | Drive PRDs | `Brain Outputs/prd/` |

## Obsidian graph entry points

- [[AMMAR_BRAIN_HOME]] — top-of-vault hub
- [[FRONTEND_INDEX]] · [[COMPONENT_INDEX]] · [[BACKEND_INDEX]]
- [[PAGE_LEARNING_INDEX]] · [[PAGES_INDEX]] · [[PAGE_KNOWLEDGE_INDEX]]
- [[UI_UX_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[BUSINESS_INDEX]]
- [[GAPS_INDEX]] · [[EVIDENCE_INDEX]] · [[APPROVED_PATTERNS_INDEX]]
- [[WIKI_INDEX]] · [[FALCON_EYES_INDEX]]
