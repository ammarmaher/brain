# Project Index

This index is auto-updated by Brain SK TouchBase and report generation.

## Latest

### 2026-05-13 · Shared Bootstrap TouchBase (first-pass)

Decision: **READY_WITH_WARNINGS**

| Output | Link |
|---|---|
| Discovered path map (MD) | [open](../outputs/discovery/discovered-path-map.md) |
| Discovered path map (JSON) | [open](../outputs/discovery/discovered-path-map.json) |
| Startup readiness report | [open](../outputs/discovery/startup-readiness-report.md) |
| Scan metadata | [open](../outputs/discovery/scan-metadata.json) |
| Obsidian health | [open](../outputs/discovery/obsidian-health.md) |

### Discovered scope

- 7 backend services on `main` (clean) — Identity · Commerce · Charging · Provisioning · Access · Contact Group · Templates
- 2 gateways on `main` (clean) — Core · System
- 2 frontends — `falcon-web-platform-ui` on `polishing-v0.4`, `falcon-portal` on `main`
- 1 umbrella infra repo at `C:\Falcon\Falcon\Falcon` (clean, `main`)
- Missing optional sources: PRD folder, architecture wiki (recorded, not blocking)

### 2026-05-13 · Full parallel discovery (Phases 1 + 2)

Overall readiness **68%** · decision **READY_WITH_WARNINGS** · 101 understanding artifacts.

| Output | Link |
|---|---|
| Discovery rollup | [report](../outputs/reports/discovery-2026-05-13/DISCOVERY_REPORT.md) · [JSON](../outputs/reports/discovery-2026-05-13/DISCOVERY_SUMMARY.json) |
| Backend portfolio | [BACKEND_SERVICE_MAP](../outputs/understanding/backend/BACKEND_SERVICE_MAP.md) · [GATEWAY_ROUTE_MAP](../outputs/understanding/backend/GATEWAY_ROUTE_MAP.md) |
| Frontend portfolio | [WORKSPACE_MAP](../outputs/understanding/frontend/FRONTEND_WORKSPACE_MAP.md) · [COMPONENT_REGISTRY](../outputs/understanding/frontend/FALCON_COMPONENT_REGISTRY.md) |
| Architecture (code-extracted) | [RULES](../outputs/understanding/wiki/ARCHITECTURE_RULES.md) · [CONFLICTS](../outputs/understanding/wiki/ARCHITECTURE_CONFLICTS.md) |
| Integration | [OVERVIEW](../outputs/understanding/integration/INTEGRATION_OVERVIEW.md) · [READINESS_MATRIX](../outputs/understanding/integration/READINESS_MATRIX.md) · [GAP_LIST](../outputs/understanding/integration/GAP_LIST.md) · [NEXT_ACTIONS](../outputs/understanding/integration/NEXT_ACTIONS.md) · [API_TO_COMPONENT_TRACE](../outputs/understanding/integration/API_TO_COMPONENT_TRACE.md) · [BLOCKERS_AND_QUESTIONS](../outputs/understanding/integration/BLOCKERS_AND_QUESTIONS.md) |

### Headline numbers
- ~125 backend HTTP endpoints across 9 services.
- 47 Stencil component pairs + 49 Angular wrappers + 7 legacy bespoke = **58-row Falcon Component Registry**.
- ~264 Tailwind `@theme` design tokens in the canonical theme.
- 6 HIGH · 14 MED · 12 LOW gaps · 15 next actions queued.
- ~85+ backend endpoints currently unbound in the API-to-component trace.

### 2026-05-13 (evening) · Wiki + PRD onboarding (Phase 3)

Both previously-WARN sources are now **OK**. See [onboarding rollup](../outputs/reports/discovery-2026-05-13/2026-05-13-wiki-prd-onboarding.md).

| Output | Link |
|---|---|
| Wiki-grounded architecture | [`outputs/wiki-architect/`](../outputs/wiki-architect/README.md) — 21 files |
| PRD understanding (6 modules) | [`outputs/prd/`](../outputs/prd/README.md) — 32 files |

Headline additions:
- **180 PRD business rules** extracted with line-cited evidence
- **~45 domain entities** catalogued from PRDs
- **185 PRD↔code GAP rows** (≈ 48% covered)
- **9 of 12 fallback UNVERIFIED items resolved** against the wiki
- **7 new conflicts** the wiki surfaced (X-MicroApp-Key, third gateway, Outbox, FeatureManagement, ClickHouse, …)
