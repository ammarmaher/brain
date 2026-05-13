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
