# Brain SK Home

Welcome to Brain SK knowledge vault.

## Indexes

- [[PROJECT_INDEX]]
- [[BUSINESS_INDEX]]
- [[FRONTEND_INDEX]]
- [[BACKEND_INDEX]]
- [[WIKI_INDEX]]
- [[TASK_REPORT_INDEX]]

## Main outputs

- [[discovered-path-map]]
- [[startup-readiness-report]]
- [[FALCON_COMPONENT_REGISTRY]]
- [[API_DTO_DICTIONARY]]
- [[BUSINESS_RULE_REGISTRY]]

## Latest bootstrap — 2026-05-13

Shared Bootstrap TouchBase first-pass · decision **READY_WITH_WARNINGS**.

- [Discovered path map](../outputs/discovery/discovered-path-map.md) · [JSON](../outputs/discovery/discovered-path-map.json)
- [Startup readiness report](../outputs/discovery/startup-readiness-report.md)
- [Scan metadata](../outputs/discovery/scan-metadata.json)
- [Bootstrap health check](../outputs/reports/bootstrap-touchbase/2026-05-13-health-check.md) · [JSON](../outputs/scan-metadata/bootstrap-health.json)
- [Obsidian health](../outputs/discovery/obsidian-health.md)

Active source root: `C:\Falcon\Falcon` · Output root: `C:\Falcon\Brain Outputs` (mirrored to `Brain SK\outputs`).

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
