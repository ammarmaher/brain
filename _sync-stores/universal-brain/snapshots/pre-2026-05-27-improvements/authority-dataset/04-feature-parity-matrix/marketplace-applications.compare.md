---
type: feature-compare
feature: marketplace-applications
purpose: "Answers 'how marketplace-applications shares one backend + one table protocol but splits on sys.services.* vs acc.services.* PES keys'. Open before changing pricing/visibility/payment flows."
admin-side-app: admin-console
admin-side-route: /admin-console/marketplace-applications
admin-side-gateway: SystemGateway
mgmt-side-app: management-console
mgmt-side-route: /management-console/marketplace-applications
mgmt-side-gateway: CoreGateway
falcon-only: false
client-only: false
shared: true
pes-keys-admin:
  - adminConsole.services.payment
  - adminConsole.services.editPriceType
  - adminConsole.services.editPriceValue
  - adminConsole.services.visibility
pes-keys-mgmt:
  - managementConsole.services.view
  - managementConsole.services.payment
  - managementConsole.services.disable
extracted: 2026-05-16
---

# Feature · `marketplace-applications` — Falcon vs Client

> [!tldr]
> Per-account, per-application visibility + pricing + payment-activation page. Both sides share the **same backend** (Falcon Core Commerce + Charging) and the **same Falcon table protocol** (`<falcon-table>` with row-menu, inline editors, expandable details, `row.allowedActions` FSM disclosure). The split is on **authority**: admin-console writes via `sys.services.*` PES keys across the org-tree (sys-admin · sys-products fully; sys-ops zero); mgmt-console writes via `acc.services.*` for the tenant's own subscriptions (acc-owner only).

## At a glance

| Falcon (admin-console) | Client (management-console) | Notes |
|---|---|---|
| Route: `/admin-console/marketplace-applications` | Route: `/management-console/marketplace-applications` | Same URL slug, different host app |
| Gateway: `SystemGateway` (`:7256`) | Gateway: `CoreGateway` (`:7038`) | Both proxy to **Falcon Core Commerce Service** + **Charging** [CODE] `apps/admin-console/src/app/app.config.ts:52`; `apps/management-console/src/app/app.config.ts:52` |
| PES gate at route: **none** (`shellAccessGuard` declared but no `data.access`) | PES gate at route: `FalconAccess.managementConsole.services.view()` | [CODE] `apps/admin-console/src/app/features/routes.ts:33-42`; [BRAIN-OUT] `marketplace-applications.diff.md:12` |
| In-component PES: 4 `resolveFlags(...)` keys (`canDoPayments`, `canEditPriceType`, `canEditPriceValue`, `canManageVisibility`) | In-component PES: **none** (gating relies entirely on backend `row.allowedActions` array) | [CODE] `marketplace-applications.component.ts:1236-1246`; [BRAIN-OUT] `marketplace-applications.diff.md:58-60` |
| DTO `AppServiceItem` — lean | DTO `MarketplaceApplicationItem` — extra UI fields (`subtitle`, `iconClass`, `iconSvg`, `iconUrl`, `pricePeriod`, `currency`, `showDates`, `showPrice`) | [CODE] `apps/admin-console/.../models/models.ts:8-24`; [BRAIN-OUT] `marketplace-applications.diff.md:50-52` |
| Node selection: org-hierarchy tree (sys-side; `FALCON_ROOT_NODE` virtual root) | Node selection: tenant root from session (`session.tenantId ‖ session.client_id`) | [CODE] `marketplace-applications.component.ts:254-289`; [BRAIN-OUT] `marketplace-applications.diff.md:64` |
| Tabs: list view only | Card list / list-view toggle persisted in `localStorage` (`marketplaceAppsViewMode`) | [BRAIN-OUT] `marketplace-applications.diff.md:25-26` |
| 15 endpoints reachable from UI flow | 15 endpoints reachable (identical shared `CommerceActionsService`/`CommerceGatewayService`) | [BRAIN-OUT] `marketplace-applications.diff.md:32-44` |

## Per-role capability

| Role | Can land on page | Can change visibility | Can do payment (Activate / Renew) | Can edit price-type | Can edit price-value | Can disable a row |
|---|---|---|---|---|---|---|
| **sys-admin** | ✅ admin-console | ✅ `sys.services / visibility` | ✅ `sys.services / payment` | ✅ `sys.services / edit-price-type` | ✅ `sys.services / edit-price-value` | ✅ (visibility action) |
| **sys-ops** | ✅ admin-console | ❌ no rule on `sys.services.*` (silent deny) | ❌ | ❌ | ❌ | ❌ |
| **sys-products** | ✅ admin-console | ✅ | ✅ | ✅ | ✅ | ✅ |
| **acc-owner** | ✅ management-console | n/a — mgmt has no per-row visibility column (only payment & disable via `acc.services`) | ✅ `acc.services / payment` | n/a | n/a | ✅ `acc.services / disable` |
| **acc-admin** | ✅ management-console | n/a | ❌ `acc.services / payment` explicitly deny | n/a | n/a | ❌ explicitly deny |
| **acc-user** | ✅ management-console (deny on entry — silent: `acc.services.*` deny + page assumes empty) | ❌ | ❌ | ❌ | ❌ | ❌ |

> [!note]
> Both consoles also apply a **second gate**: the backend ships a per-row `allowedActions: FalconRowAction[]` whitelist that filters which menu entries appear regardless of PES. PES says "can this user attempt the action at all"; `allowedActions` says "is this row's current FSM state legal for the action". Both must pass. [CODE] `marketplace-applications.component.ts:1032-1043`.

## PES keys consumed

### Admin side (`sys.services` resource)
- `FalconAccess.adminConsole.services.payment()` → `{action: 'payment', resource: 'sys.services'}` — [CODE] `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:116-121`; checked at [CODE] `marketplace-applications.component.ts:1238`, guarded in `onDoPayment` at line 405.
- `FalconAccess.adminConsole.services.editPriceType()` → `{action: 'edit-price-type', resource: 'sys.services'}` — checked at line 1239, enforced at lines 628-630, 706.
- `FalconAccess.adminConsole.services.editPriceValue()` → `{action: 'edit-price-value', resource: 'sys.services'}` — checked at line 1240, enforced at lines 628-630, 775.
- `FalconAccess.adminConsole.services.visibility()` → `{action: 'visibility', resource: 'sys.services'}` — checked at line 1241, enforced at lines 368, 533, 570, 918.

### Mgmt side (`acc.services` resource)
- `FalconAccess.managementConsole.services.view()` → `{action: 'view', resource: 'acc.services'}` — route guard data.access. [BRAIN-OUT] `marketplace-applications.diff.md:12`.
- `FalconAccess.managementConsole.services.payment()` → `{action: 'payment', resource: 'acc.services'}` — acc-owner only.
- `FalconAccess.managementConsole.services.disable()` → `{action: 'disable', resource: 'acc.services'}` — acc-owner only.

> [!note]
> The mgmt-side **does not call `AccessControlFacade.resolveFlags(...)` in the component** — gating is via route-level `data.access` + backend `row.allowedActions`. The `editPriceType` / `editPriceValue` / `visibility` actions are **not exposed on the mgmt console** (no `acc.services.{edit-price-type, edit-price-value, visibility}` PES keys exist; those are Falcon-staff-only). [CODE] `falcon-access.registry.ts:55-58` shows mgmt has only `{view, payment, disable}`.

## Differences

### Routing
- **Loader**: admin uses `loadComponent` (lazy); mgmt uses `component: MarketplaceApplicationsComponent` (synchronous import). [BRAIN-OUT] `marketplace-applications.diff.md:10`.
- **Route PES**: admin route has `shellAccessGuard` declared but no `data.access` → guard short-circuits to `true` (no-op). The 4 PES checks are inside the component instead. Mgmt route has `data.access = FalconAccess.managementConsole.services.view()` so the guard actually enforces something. [CODE] `apps/admin-console/src/app/features/routes.ts:33-42`; [CODE] `libs/falcon/src/core/lib/access-control/shell-access.guard.ts:49-52, 84-87`.
- **Dead nav**: mgmt component has `openAiAgentBuilder()` that routes to `'../ai-agent'` — route is **declared but not implemented** in mgmt routes (placeholder). [BRAIN-OUT] `marketplace-applications.diff.md:19`.

### Component
- **Same base shape**: tree + table + 5 `<ng-template>` cell/editor renderers + 2 insufficient-balance dialogs + payment-poll state machine.
- **Admin uses `<falcon-organization-hierarchy-tree>`** on the left (30% width) with `FALCON_ROOT_NODE` virtual root; **mgmt uses session-derived tenant root** with no tree picker (single-tenant context). [CODE] `marketplace-applications.component.ts:79-97` (admin imports); [BRAIN-OUT] `marketplace-applications.diff.md:64`.
- **Admin component is 1,249 lines** with default change detection (no `OnPush`); mgmt is 886 lines, same default-CD pattern. [CODE] `marketplace-applications.component.ts:76, 102-1248`; [BRAIN-OUT] `marketplace-applications.diff.md:67`.
- **Shared payment-poll flow**: both use `SimplePollService.watch({intervalSeconds: 2, maxDurationMinutes: 30, shouldStop: …})` from `@falcon`, identical 3-failure-branch UX (`WalletNotConfigForTheNode` → warning; `CommChannelPriorityOrderRequired` → drag-drop priority dialog → retry with `commChannelPriorityIds`; `InsufficientFunds` → warning). [CODE] `marketplace-applications.component.ts:404-515`; [BRAIN-OUT] `marketplace-applications.diff.md:27-29`.

### Service / API
- **Identical mutation surface** — both apps import the same `CommerceActionsService` + `CommerceGatewayService` (currently from `organization-hierarchy/components/tabs-layout/components/service/`; smell flagged for new theme). [BRAIN-OUT] `marketplace-applications.diff.md:41-44`; [BRAIN-OUT] `marketplace-applications.07-CROSS-PAGE.md:77-79`.
- **15 endpoints reachable** from this page's UI flow (1 list + 6 application mutations + 4 application delete-pending + 1 polling + 1 priority lookup + 2 tree). [BRAIN-OUT] `marketplace-applications.03-SERVICES-APIS.md:90-108`.
- **List endpoint** `GET commerce/Node/{nodeId}/applications` is identical on both sides; the gateway differs (System vs Core). [BRAIN-OUT] `marketplace-applications.diff.md:33-35`.
- **Order status polling** routes to `OrderStatusService.getOrderStatus(orderId)` — admin → Charging via System Gateway; mgmt → Charging via Core Gateway. Same backend service (`falcon-core-charging-svc`). [BRAIN-OUT] `marketplace-applications.03-SERVICES-APIS.md:69-81`.
- **Custom header `notShowToaster: 'true'`** on `do-payment` POSTs suppresses the global error interceptor's toast — both sides. [CODE] `commerce-gateway.service.ts:119-132`.

### DTOs
- **Admin `AppServiceItem`** — lean shape (id, accountId, name, visibility, pricingType, priceValue, 3 date fields, status, allowedActions, canHide, indexable). [CODE] `apps/admin-console/src/app/features/marketplace-applications/models/models.ts:8-24`.
- **Mgmt `MarketplaceApplicationItem`** — same fields plus card-view UI extras: `subtitle`, `description`, `iconClass`, `iconSvg`, `iconUrl`, `pricePeriod`, `currency`, `showDates`, `showPrice`. [BRAIN-OUT] `marketplace-applications.diff.md:50`.
- **Shared mutation DTOs** — both apps import the same `Change*PriceTypeRequest`, `Change*PriceValueRequest`, `Change*VisibilityRequest`, `DoPaymentApplicationRequest`, `Enable/DisableApplicationRequest`, `Delete*NewPrice*Request` from the shared models file. ~15 request types × 2 (mirrored for comm-channels). [CODE] `apps/admin-console/.../organization-hierarchy/components/tabs-layout/components/models/models.ts:1-117`.
- **Shared enums** from `@falcon`: `PricingType` (Monthly=1, Yearly=2, OneTimePayment=3), `FalconRowAction` (DoPayment=1, Disable=2, Enable=3, EditPriceType=4, EditPriceValue=5), `FalconItemStatus` (None=0, InActive=1, Active=2, Expired=3, Disabled=4), `ProcessState` (Pending=1…Failed=4), `OrderFailureReason` (None=0, InsufficientFunds=1, CommChannelPriorityOrderRequired=2, WalletNotConfigForTheNode=3), `WalletType`. [CODE] `libs/falcon/src/shared-types/lib/enums/globels.ts:57-124`; `order-status.enums.ts:1-18`.

### Gateway
- **Admin → SystemGateway → Core Commerce Service.** `commerce/Node/...` paths.
- **Mgmt → CoreGateway → Core Commerce Service.** Same underlying paths.
- **Casing inconsistency** in URLs: list endpoint uses PascalCase `commerce/Node`; mutation endpoints use lowercase `commerce/node`. ASP.NET routing is case-insensitive but worth consolidating in the new theme. [BRAIN-OUT] `marketplace-applications.03-SERVICES-APIS.md:123`.

## What changes when copying admin → mgmt

- [ ] Swap admin-console route to management-console route slug (same: `marketplace-applications`).
- [ ] Replace 4-key `resolveFlags({...})` (sys.services.*) with route-level `data.access: FalconAccess.managementConsole.services.view()` + remove component PES (mgmt relies on backend `row.allowedActions`).
- [ ] Replace `Gateway.SystemGateway` with `Gateway.CoreGateway` in `provideAppDefaultGateway(...)` of `app.config.ts:52`.
- [ ] Replace tree-panel node source: drop `OrgHierarchyApiService.getRootNodes()` / `getChildren()` + `FALCON_ROOT_NODE` virtual root; substitute single-tenant root from `SessionProvider.session.tenantId ‖ session.client_id`.
- [ ] Extend DTO: replace lean `AppServiceItem` with `MarketplaceApplicationItem` (add `subtitle`, `description`, `iconClass`, `iconSvg`, `iconUrl`, `pricePeriod`, `currency`, `showDates`, `showPrice`).
- [ ] Add card / list view-mode toggle persisted in `localStorage` (key `marketplaceAppsViewMode`).
- [ ] Verify backend `row.allowedActions` filtering still hides `EditPriceType` / `EditPriceValue` / `Disable` for non-owner roles (acc-admin / acc-user) — backend is source of truth on FSM-allowed transitions.
- [ ] Verify `commerce/node/application/do-payment` POST works end-to-end through Core Gateway (admin uses System Gateway; mgmt-side host must be configured) — same backend service, different reverse-proxy.
- [ ] Mirror insufficient-balance dialogs (`InsufficientBalancePriorityDialogComponent` + `InsufficientBalanceWarningDialogComponent`) into `apps/management-console/src/app/shared/components/` — currently duplicated per app rather than lifted to `@falcon`.
- [ ] Honour acc-* role differences: **acc-owner only** for payment & disable; acc-admin's `acc.services.{view, payment, disable}` are explicitly `deny`; acc-user has no rule (silent deny).
- [ ] Lift `CommerceActionsService` + `CommerceGatewayService` out of `organization-hierarchy/components/tabs-layout/components/service/` into a shared library (smell flagged for new theme). [BRAIN-OUT] `marketplace-applications.07-CROSS-PAGE.md:77-79`.

## Cross-references

- Roles: [[../01-roles/sys-admin]] · [[../01-roles/sys-products]] · [[../01-roles/sys-ops]] · [[../01-roles/acc-owner]] · [[../01-roles/acc-admin]] · [[../01-roles/acc-user]]
- Status enums (Commerce + Provisioning): [[../02-statuses/service-status]]
- PES key universe: [[../03-pes-keys/REGISTRY-RAW]]
- Old-UI dataset (admin): `C:\Falcon\Brain Outputs\datasets\old-ui-dataset\10-pages\admin-console\marketplace-applications\`
- Old-UI dataset (mgmt diff): `C:\Falcon\Brain Outputs\datasets\old-ui-dataset\10-pages\management-console\_diffs\marketplace-applications.diff.md`
- Sibling pages that share `CommerceActionsService`: [[comms-hub]] (parallel comm-channel implementation)
