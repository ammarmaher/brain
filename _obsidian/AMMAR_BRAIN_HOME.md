---
type: hub
hub: ammar-brain-home
created: 2026-05-15
---
# Brain SK Home

Welcome to Brain SK knowledge vault.

## Indexes

- [[PROJECT_INDEX]]
- [[BUSINESS_INDEX]]
- [[FRONTEND_INDEX]]
- [[BACKEND_INDEX]]
- [[WIKI_INDEX]]
- [[TASK_REPORT_INDEX]]
- [[PAGES_INDEX]] — Page-level registries (NEEDS-ATTENTION pages, scoring, 4 dimensions per page)
- [[PAGE_KNOWLEDGE_INDEX]] — Page-level knowledge folders under `Brain Outputs/understanding/pages/`
- [[FALCON_EYES_INDEX]] — Falcon Eyes semantic visual difference QA hub
- [[VISUAL_QA_INDEX]] — Visual QA index (Falcon Eyes + aliases + screenshot-to-angular)

## Main outputs

- [[discovered-path-map]]
- [[startup-readiness-report]]
- [[FALCON_COMPONENT_REGISTRY]]
- [[FALCON_COMPONENT_INDEX]] — deep dossiers for 60 components (six files each)
- [[API_DTO_DICTIONARY]]
- [[BUSINESS_RULE_REGISTRY]]

## Latest knowledge build — 2026-05-13 (evening)

Seven-agent parallel Deep Falcon Component Knowledge Build · overall readiness **91 %**. Canonical-path repointed 2026-05-13 by Agent 6 (Obsidian Link Agent). Top-level navigation: [[Frontend Understanding]] and [[Frontend Components Index]].

- [[FALCON_COMPONENT_INDEX]] — 60-component master index (now points to canonical paths)
- [CANONICAL_FRONTEND_UNDERSTANDING](../../Brain%20Outputs/understanding/frontend/CANONICAL_FRONTEND_UNDERSTANDING.md) — top-level canonical entry point
- [FALCON_COMPONENT_REGISTRY_DEEP](../../Brain%20Outputs/understanding/frontend/FALCON_COMPONENT_REGISTRY_DEEP.md)
- [FALCON_COMPONENT_CAPABILITY_MATRIX](../../Brain%20Outputs/understanding/frontend/FALCON_COMPONENT_CAPABILITY_MATRIX.md)
- [COMPONENT_RELATIONSHIP_MAP](../../Brain%20Outputs/understanding/frontend/COMPONENT_RELATIONSHIP_MAP.md)
- [COMPONENT_UPGRADE_BACKLOG](../../Brain%20Outputs/understanding/frontend/COMPONENT_UPGRADE_BACKLOG.md) — 124-item prioritized backlog
- [FRONTEND_COMPONENT_KNOWLEDGE_REPORT](../../Brain%20Outputs/understanding/frontend/FRONTEND_COMPONENT_KNOWLEDGE_REPORT.md)
- [FRONTEND_COMPONENT_DYNAMIC_CAPABILITY_REPORT](../../Brain%20Outputs/understanding/frontend/FRONTEND_COMPONENT_DYNAMIC_CAPABILITY_REPORT.md)
- [FALCON_THEME_AND_TAILWIND_REPORT](../../Brain%20Outputs/understanding/frontend/FALCON_THEME_AND_TAILWIND_REPORT.md)
- [FALCON_WRAPPER_AND_RENDER_PATH_REPORT](../../Brain%20Outputs/understanding/frontend/FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md)
- [narrative/READINESS_SCORES](../../Brain%20Outputs/understanding/frontend/narrative/READINESS_SCORES.md)
- [narrative/FINAL_COVERAGE_REPORT](../../Brain%20Outputs/understanding/frontend/narrative/FINAL_COVERAGE_REPORT.md)

Coverage: 60 component folders / 360 component markdown files / 22 READY / 22 NEEDS-UPGRADE / 2 DEPRECATED / 7 LEGACY / 2 REFERENCE-ONLY · 124-item upgrade backlog · 12 conflicts resolved against live source · zero uncovered components.

## Latest bootstrap — 2026-05-13

Shared Bootstrap TouchBase first-pass · decision **READY_WITH_WARNINGS**.

- [Discovered path map](../outputs/discovery/discovered-path-map.md) · [JSON](../outputs/discovery/discovered-path-map.json)
- [Startup readiness report](../outputs/discovery/startup-readiness-report.md)
- [Scan metadata](../outputs/discovery/scan-metadata.json)
- [Bootstrap health check](../outputs/reports/bootstrap-touchbase/2026-05-13-health-check.md) · [JSON](../outputs/scan-metadata/bootstrap-health.json)
- [Obsidian health](../outputs/discovery/obsidian-health.md)

Active source root: `C:\Falcon\Falcon` · Output root: `C:\Falcon\Brain Outputs` (mirrored to `Brain SK\outputs`).

## Wiki + PRD onboarding — 2026-05-13 (evening)

Both previously-WARN sources are now **OK**. Brain analysis at `outputs/wiki-architect/` and `outputs/prd/`.

| Source | Canonical | Local | Brain analysis |
|---|---|---|---|
| Architecture wiki | [Azure DevOps wiki](https://t2development.visualstudio.com/Falcon/_wiki/wikis/Falcon.wiki/1129/Home) | `C:\Falcon\falcon-wiki` (branch `wikiMaster`, HEAD `0d0cb311…`, 110 files) | [`outputs/wiki-architect/`](../outputs/wiki-architect/README.md) — 21 files · [CONSOLIDATED_ARCHITECTURE_RULES](../outputs/wiki-architect/CONSOLIDATED_ARCHITECTURE_RULES.md) · [CONSOLIDATED_ARCHITECTURE_CONFLICTS](../outputs/wiki-architect/CONSOLIDATED_ARCHITECTURE_CONFLICTS.md) · [WIKI_TO_CODE_TRACE](../outputs/wiki-architect/WIKI_TO_CODE_TRACE.md) |
| PRDs | [Drive folder](https://drive.google.com/drive/folders/1ww3nICya-CjW4_5mzoVpzTaaMz9nNTtH) | `Brain SK\skills\imported-business\prd-knowledge\modules\` (6 modules, synced 2026-04-24) | [`outputs/prd/`](../outputs/prd/README.md) — 32 files · [PRD_INDEX](../outputs/prd/PRD_INDEX.md) · [PRD_GAP_SUMMARY](../outputs/prd/PRD_GAP_SUMMARY.md) |

Onboarding rollup: [2026-05-13-wiki-prd-onboarding](../outputs/reports/discovery-2026-05-13/2026-05-13-wiki-prd-onboarding.md). New HIGH findings:
- ValidateAudience=true is wiki-canonical; Commerce + both gateways set `false`.
- `X-MicroApp-Key` dual-credential auth required by wiki; not implemented anywhere.
- Templates entity has no public API (3 CommChannelConfig endpoints exist; Template surface unbuilt).
- Templates service not routed by either gateway.

## Latest discovery — 2026-05-13

Phase 1+2 parallel discovery pipeline · overall readiness **68%** · decision **READY_WITH_WARNINGS**.

- [DISCOVERY_REPORT](../outputs/reports/discovery-2026-05-13/DISCOVERY_REPORT.md) — single-page rollup
- [DISCOVERY_SUMMARY.json](../outputs/reports/discovery-2026-05-13/DISCOVERY_SUMMARY.json) — machine-readable

| Domain | Artifacts | Index |
|---|---:|---|
| Backend / API | 74 | [[BACKEND_INDEX]] |
| Frontend / Falcon components | 17 | [[FRONTEND_INDEX]] |
| Architecture / structure | 4 (code-extracted fallback) | [[WIKI_INDEX]] |
| Integration / impact | 6 | [INTEGRATION_OVERVIEW](../outputs/understanding/integration/INTEGRATION_OVERVIEW.md) |

### Top HIGH gaps to act on (after acknowledgments)

> GAP-001 / GAP-002 / GAP-003 (SQL `sa` creds + Anthropic API key) were `ACKNOWLEDGED — not pursuing (2026-05-13)`. They remain in [GAP_LIST](../outputs/understanding/integration/GAP_LIST.md) for audit but are excluded from headlines.

1. Decide on canonical `ServiceOperationResult<T>` shape — 5 distinct versions ship in tree (GAP-004).
2. Verify intent of commented-out `adminConsoleGuard` in `apps/admin-console/src/app/app.routes.ts:7` (GAP-005).
3. Convert PES GET-with-body endpoints (`policyrulesBySub`, `policyrulesByFilter`) to POST (GAP-006).
4. Move Mongo default creds out of non-Development `appsettings.json` for Templates + Access (GAP-010, MED).
5. Restore architecture wiki vault — unblocks 7 downstream actions (ACT-004).

## Tags

#type/index #status/deprecated #gap #security
