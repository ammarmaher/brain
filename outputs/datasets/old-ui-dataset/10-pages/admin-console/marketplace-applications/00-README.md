---
type: page-dataset
app: admin-console
feature: marketplace-applications
source: origin/main @ 803ac1d1
extracted: 2026-05-16
extracted-by: P5 (Deep-Dive Agent)
---

# Marketplace & Applications

## TL;DR
Falcon-user (admin-console) page for managing **per-account application visibility + pricing + payment activation/renewal** across the org-hierarchy tree. A row is a service-descriptor (`AppServiceItem`) bound to one account node — each row exposes a visibility toggle, a price-type (Monthly/Yearly/OneTime) inline editor, a price-value (SAR) inline editor, a payment action that initiates an order through Charging, and a row-menu for Disable/Enable. Pending price changes show as expandable detail rows with edit/delete actions. Backend: Falcon Core Commerce Service (`commerce/Node/{id}/applications` for list + 13 sibling endpoints under `commerce/node/application/*` for visibility / payment / lifecycle / pricing) + Falcon Core Charging Service (via order-status polling). Page is PES-gated on **4 distinct permissions**.

## Manifest
- [[01-ROUTING]] — 1 route, 1 guard (`shellAccessGuard` declared but **no `data.access` set** → guard is a no-op for this route)
- [[02-COMPONENTS]] — 1 container + 2 shared dialogs + heavy reuse of `<falcon-*>` and PrimeNG components
- [[03-SERVICES-APIS]] — 3 feature/shared services, **15 distinct HTTP endpoints** (1 list + 14 mutation/sibling)
- [[04-DTOS]] — 8 application-scoped DTOs + 7 mirrored comm-channel-scoped DTOs (shared models file) + 1 polling response
- [[05-PES]] — 4 PES checks via `AccessControlFacade.resolveFlags({...})` (payment / editPriceType / editPriceValue / visibility)
- [[06-VALIDATIONS]] — Inline editor effective-date constraints via `FalconCalendarComponent` custom validators (`effectiveDateRequired`, `effectiveDateMustBeInFuture`, `invalidEffectiveDateForPeriodicPricingChange`); back-end-enforced price > 0
- [[07-CROSS-PAGE]] — Heavy inbound deps on org-hierarchy + shared dialogs + commerce-actions service; provides nothing outbound
- [[08-RULES-APPLIED]] — 13 patterns observed (5 good, 8 anti-patterns)

## Source files
| File | Role |
|---|---|
| `apps/admin-console/src/app/features/marketplace-applications/marketplace-applications.component.ts` | Container — heavy 1,249-line component with payment-flow state machine + tree + table + inline editors |
| `apps/admin-console/src/app/features/marketplace-applications/marketplace-applications.component.html` | Container template (379 lines) — toast + 5 ng-templates + tree + table + 2 dialogs |
| `apps/admin-console/src/app/features/marketplace-applications/marketplace-applications.component.scss` | SCSS (276 lines) — page layout, tree styling, skeleton states |
| `apps/admin-console/src/app/features/marketplace-applications/models/models.ts` | `AppServiceItem` interface + helpers |
| `apps/admin-console/src/app/features/marketplace-applications/services/marketplace-applications.service.ts` | Single list-endpoint service (`getList(nodeId)`) |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/service/commerce-actions.service.ts` | **Shared** mutation facade (visibility / price-type / price-value / payment / enable / disable / delete-pending — for both applications and comm-channels) |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/service/commerce-gateway.service.ts` | **Shared** HTTP gateway (puts/posts/deletes under `commerce/node/application/*` + `commerce/node/comm-channel/*`) |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/models/models.ts` | **Shared** request/response DTOs (15 request types, 15 response types) |
| `apps/admin-console/src/app/features/organization-hierarchy/services/org-hierarchy.api.service.ts` | Tree-panel data API |
| `apps/admin-console/src/app/shared/components/insufficient-balance-priority-dialog/insufficient-balance-priority-dialog.component.ts` | **Shared** drag-drop priority dialog (offered to user when payment fails with `CommChannelPriorityOrderRequired`) |
| `apps/admin-console/src/app/shared/components/insufficient-balance-warning-dialog/insufficient-balance-warning-dialog.component.ts` | **Shared** warning dialog (offered for `InsufficientFunds` or `WalletNotConfigForTheNode`) |
| `apps/admin-console/src/app/shared/services/communication-channels-api.service.ts` | Shared lookup — `commerce/Node/{id}/comm-channels/visible` |

[[01-ROUTING]] · [[02-COMPONENTS]] · [[03-SERVICES-APIS]] · [[04-DTOS]] · [[05-PES]] · [[06-VALIDATIONS]] · [[07-CROSS-PAGE]] · [[08-RULES-APPLIED]]
