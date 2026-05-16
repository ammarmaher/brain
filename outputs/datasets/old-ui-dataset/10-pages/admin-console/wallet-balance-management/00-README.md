---
type: page-dataset
app: admin-console
feature: wallet-balance-management
source: origin/main @ 803ac1d1
extracted: 2026-05-16
extracted-by: P2
---

# Wallet & Balance Management (Admin Console)

## TL;DR
Falcon-admin wallet strategy + balance + transfer page. For a selected node in the org hierarchy it shows the node's master wallet balance, lets a Falcon admin pick currency / balance-distribution / wallet-structure and save the wallet strategy, and exposes per-row Balance Transfer (Master ↔ CommChannel ↔ Node/User wallets) through a side drawer. Backend evidence: 3 HTTP endpoints — `GET commerce/accounts/{id}/hierarchy` (Commerce-aggregated wallet hierarchy), `POST commerce/setting/wallets` (save strategy), `POST charging/wallet/transfer` (Charging-service transfer). Plus the Commerce `Node` lookup endpoint via the shared `OrgHierarchyApiService` to populate the left tree. All routed through **System Gateway** (admin-console default = `Gateway.SystemGateway`).

## Manifest
- [[01-ROUTING]] — 1 route, 2 guards (`adminConsoleGuard` at parent, `shellAccessGuard` here — but no `access:` value supplied, so the latter is a no-op)
- [[02-COMPONENTS]] — 2 components (1 container, 1 drawer child) + 1 shared lib component used
- [[03-SERVICES-APIS]] — 2 services injected by feature + 1 reused; 5 HTTP endpoints total (3 feature-owned, 2 via shared)
- [[04-DTOS]] — 22 TS types (4 enums + 13 interfaces + 5 helpers/aliases)
- [[05-PES]] — 4 permission checks (1 entry-gate at parent + 4 feature permissions via `AccessControlFacade.resolveFlags`)
- [[06-VALIDATIONS]] — 0 reactive form validators (ngModel-only), 1 transfer-path business rule machine, 1 amount-cap rule, 1 description-required rule, 1 same-source/destination rule
- [[07-CROSS-PAGE]] — 4 inbound deps (`OrgHierarchyApiService` from sibling feature, `<falcon-organization-hierarchy-tree>`, `AccessControlFacade`, `SessionProvider`); 0 outbound contributions
- [[08-RULES-APPLIED]] — 12 patterns observed (3 good, 9 anti-patterns)

## Source files
| File | Role |
|---|---|
| `apps/admin-console/src/app/features/wallet-balance-management/wallet-balance-management.component.ts` | container component (885 lines) |
| `apps/admin-console/src/app/features/wallet-balance-management/wallet-balance-management.component.html` | template (453 lines) |
| `apps/admin-console/src/app/features/wallet-balance-management/wallet-balance-management.component.scss` | styles (1,177 lines, SCSS) |
| `apps/admin-console/src/app/features/wallet-balance-management/services/wallet-balance.service.ts` | HTTP service for hierarchy / save / transfer (70 lines) |
| `apps/admin-console/src/app/features/wallet-balance-management/models/wallet-balance.models.ts` | hierarchy DTOs + enums + key helpers (287 lines) |
| `apps/admin-console/src/app/features/wallet-balance-management/models/transfer.models.ts` | transfer DTOs + enums + business rules (232 lines) |
| `apps/admin-console/src/app/features/wallet-balance-management/components/balance-transfer/balance-transfer.component.ts` | transfer drawer component (700 lines) |
| `apps/admin-console/src/app/features/wallet-balance-management/components/balance-transfer/balance-transfer.component.html` | drawer template (210 lines) |
| `apps/admin-console/src/app/features/wallet-balance-management/components/balance-transfer/balance-transfer.component.scss` | drawer styles (439 lines, SCSS) |
| `apps/admin-console/src/app/features/wallet-balance-management/components/index.ts` | barrel (1 line) |
| `apps/admin-console/src/app/features/routes.ts` | route registration (line 52-61) |
| `apps/admin-console/src/app/app.routes.ts` | parent route + `adminConsoleGuard` |
| `apps/admin-console/src/app/app.config.ts` | `provideAppDefaultGateway(Gateway.SystemGateway)` |

## Inventory totals (real numbers)
- TS files: 5
- HTML files: 2
- SCSS files: 2
- Total LOC: ~2,253 lines (TS+HTML+SCSS, excluding barrel)
- HTTP endpoints called directly: 3
- DTO interfaces declared: 13
- Enums declared: 4
- Permission keys consulted: 5 (including the `adminConsoleGuard` entry-key)
