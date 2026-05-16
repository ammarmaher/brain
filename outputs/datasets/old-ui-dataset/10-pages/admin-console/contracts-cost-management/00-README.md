---
type: page-dataset
app: admin-console
feature: contracts-cost-management
source: origin/main @ 803ac1d1
extracted: 2026-05-16
extracted-by: P5 (Deep-Dive Agent)
---

# Contracts & Cost Management

## TL;DR
Falcon-user (admin-console) page for authoring a commercial **Contract** against a selected Account node. A contract bundles four ordered concerns: (1) **Contract Info** — name, dates, committed value; (2) **Rate Card** — channel-specific unit-conversion (price-per-priceUnit/rating-unit, e.g. WhatsApp `ONE_KSA_TRANSACTION → MESSAGE`); (3) **Contract Details** — a per-(application × channel × priority × destination-country) rate matrix; (4) **Add-ons** — channel quotas (free-credit / credit-pool) and overage rates. Backend split: contract CRUD + lookups via `commerce/Contracts`, `commerce/Setting`, `commerce/Node` (Falcon Core Commerce Service); contract balances via `charging/Wallet/contract-balance-summaries` (Falcon Core Charging Service). Routed through the Core Gateway via `useGateway()` HTTP context. **No PES guards on the route** (defense-in-depth only via the parent `adminConsoleGuard`).

## Manifest
- [[01-ROUTING]] — 1 route, 1 guard (parent only)
- [[02-COMPONENTS]] — 9 components (1 container + 7 feature + 5 shared)
- [[03-SERVICES-APIS]] — 1 feature service, 8 HTTP endpoints (5 Commerce, 1 Charging, 2 Commerce-Node lookups)
- [[04-DTOS]] — 17 form/state DTOs + 11 API-wire DTOs + 4 catalog constants
- [[05-PES]] — 0 PES checks in feature (route relies on parent `adminConsoleGuard` for `FalconAccess.adminConsole.enter()`)
- [[06-VALIDATIONS]] — Custom field validators (no Reactive Forms — ngModel + getters); ~25 validation predicates across 4 wizard steps
- [[07-CROSS-PAGE]] — 5 inbound deps (OrgHierarchy, shared dialogs, falcon lib), 0 outbound exports
- [[08-RULES-APPLIED]] — 11 patterns observed (5 good, 6 anti-patterns)

## Source files
| File | Role |
|---|---|
| `apps/admin-console/src/app/features/contracts-cost-management/contracts-cost-management.component.ts` | Container — mode-state machine (list/add/view/edit) + node-driven data load |
| `apps/admin-console/src/app/features/contracts-cost-management/contracts-cost-management.component.html` | Container template — `@if` block flow per mode |
| `apps/admin-console/src/app/features/contracts-cost-management/contracts.models.ts` | Type definitions + catalog constants + matrix helpers (605 lines, the spec) |
| `apps/admin-console/src/app/features/contracts-cost-management/services/contracts-api.service.ts` | Single feature service — all HTTP + payload mapping |
| `apps/admin-console/src/app/features/contracts-cost-management/components/contracts-add-wizard/` | 4-step `DynamicStepperComponent`-driven create flow |
| `apps/admin-console/src/app/features/contracts-cost-management/components/contracts-edit-contract/` | Tabbed edit (4 tabs match wizard steps) |
| `apps/admin-console/src/app/features/contracts-cost-management/components/contracts-view-contract/` | Tabbed read-only view |
| `apps/admin-console/src/app/features/contracts-cost-management/components/contracts-rate-card-section/` | Reusable Step 2 (rate-card / unit-conversion) |
| `apps/admin-console/src/app/features/contracts-cost-management/components/contracts-contract-details-section/` | Reusable Step 3 (rate matrix grid) |
| `apps/admin-console/src/app/features/contracts-cost-management/components/contracts-addons-section/` | Reusable Step 4 (quotas + overage rates) |
| `apps/admin-console/src/app/features/contracts-cost-management/components/contracts-number-input/` | Inline numeric input with thousands-separator (used by all 3 sections) |
| `apps/admin-console/src/app/shared/components/contracts-accounts-panel/` | **Local** left-side accounts tree (single-level under `/`; not the shared `<falcon-organization-hierarchy-tree>`) |
| `apps/admin-console/src/app/shared/components/contracts-data-table/` | Local table (NOT `<falcon-table>` — paginated, click-row to view, kebab for actions) |
| `apps/admin-console/src/app/shared/components/contracts-node-header/` | Selected-node header (icon + title + action slot) |
| `apps/admin-console/src/app/shared/components/contracts-empty-state/` | Empty placeholder (title + message inputs) |
| `apps/admin-console/src/app/shared/components/primary-button/primary-button.component.ts` | `<app-primary-button>` + `<app-secondary-button>` |

[[01-ROUTING]] · [[02-COMPONENTS]] · [[03-SERVICES-APIS]] · [[04-DTOS]] · [[05-PES]] · [[06-VALIDATIONS]] · [[07-CROSS-PAGE]] · [[08-RULES-APPLIED]]
