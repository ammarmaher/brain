---
type: feature-compare
feature: comms-hub
purpose: "Answers 'how does comms-hub differ between admin (flat) and mgmt (nested + 3 child stubs) + which PES keys gate each side'. Open before porting or modifying comm-channel screens."
admin-side-app: admin-console
admin-side-route: /admin-console/comm-mgmt
admin-side-gateway: SystemGateway
mgmt-side-app: management-console
mgmt-side-route: /management-console/comm-mgmt
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

# Feature · `comms-hub` — Falcon vs Client

> [!tldr]
> Per-account list of **communication channels / services** (SMS, Email, WhatsApp, Voice, AI…) with inline-edit pricing, visibility toggle, payment-activation, and pending-change details. Path slug is `comm-mgmt`, folder name is `comms-hub`. Mgmt-side enriches the screen with **3 child sub-page placeholders** (`whatsapp-business`, `voice-service`, `ai` — all currently redirect to `/not-found`) and pulls a **visibility-filtered list endpoint** (`comm-channels/visible/details`) that matches what a Client user should see. The data plane is the same backend `falcon-core-commerce-svc` reached via different gateways (System for admin, Core for mgmt). Authority asymmetry mirrors `marketplace-applications`: admin gates on `sys.services.*` (sys-admin · sys-products only; sys-ops zero); mgmt gates on `acc.services.*` (acc-owner only; acc-admin explicitly **deny**, acc-user no rule).

## At a glance

| Falcon (admin-console) | Client (management-console) | Notes |
|---|---|---|
| Route: `/admin-console/comm-mgmt` (flat, no children) | Route: `/management-console/comm-mgmt` (parent + 3 placeholder child slugs redirecting to `/not-found`) | [BRAIN-OUT] `comms-hub.diff.md:7-13` |
| Gateway: `SystemGateway` (`:7256`) | Gateway: `CoreGateway` (`:7038`) | Both → `falcon-core-commerce-svc` |
| List endpoint: `GET commerce/Node/{nodeId}/comm-channels` (unfiltered) | List endpoint: `GET commerce/Node/{nodeId}/comm-channels/visible/details` (visibility-filtered + priority/payment details) | [BRAIN-OUT] `comms-hub.diff.md:22-25` |
| PES gate at route: **none** (`shellAccessGuard` declared but no `data.access`) | PES gate at route: `FalconAccess.managementConsole.services.view()` | [CODE] `apps/admin-console/src/app/features/routes.ts:23-32`; [BRAIN-OUT] `comms-hub.diff.md:11` |
| In-component PES: 4 `resolveFlags(...)` keys (`canDoPayments`, `canEditPriceType`, `canEditPriceValue`, `canManageVisibility`) | In-component PES: **none** (gating relies on backend `row.allowedActions` array) | [CODE] `comms-hub.component.ts:1252-1262`; [BRAIN-OUT] `comms-hub.diff.md:43-45` |
| Tree panel (`<falcon-organization-hierarchy-tree>`, 30%) with `FALCON_ROOT_NODE` virtual root | Same tree component; mgmt fills root from session tenant | [CODE] `comms-hub.component.ts:276-364` |
| 13 endpoints reachable from UI flow | Same 13 endpoints (different list URL) | [BRAIN-OUT] `comms-hub.03-SERVICES-APIS.md:38-41` |
| DTO `CommChannelServiceItem` — lean | DTO `CommChannelServiceItem` — adds card-view UI extras (`subtitle`, `description`, `iconClass`, `iconSvg`, `iconUrl`, `pricePeriod`, `currency`, `showDates`, `showPrice`) | [BRAIN-OUT] `comms-hub.diff.md:35-38` |
| Unknown `pricingType` → defaults to `PricingType.Monthly` | Unknown `pricingType` → `'--'` | Subtle UX divergence — admin shows a fake value, mgmt shows a placeholder. [BRAIN-OUT] `comms-hub.diff.md:38` |

## Per-role capability

| Role | Land on page | Can change visibility | Can do payment (Activate / Renew) | Can edit price-type | Can edit price-value | Can disable a row |
|---|---|---|---|---|---|---|
| **sys-admin** | ✅ admin-console | ✅ `sys.services / visibility` | ✅ `sys.services / payment` | ✅ `sys.services / edit-price-type` | ✅ `sys.services / edit-price-value` | ✅ |
| **sys-ops** | ✅ admin-console | ❌ no rule on `sys.services.*` (silent deny) | ❌ | ❌ | ❌ | ❌ |
| **sys-products** | ✅ admin-console | ✅ | ✅ | ✅ | ✅ | ✅ |
| **acc-owner** | ✅ management-console | n/a — mgmt has no `acc.services / visibility` action | ✅ `acc.services / payment` | n/a (no `acc.services / edit-price-*` actions exist) | n/a | ✅ `acc.services / disable` |
| **acc-admin** | ✅ management-console (route check passes `app.management-console / view`) — but `acc.services / view` is explicitly `deny` so the page itself returns empty | ❌ | ❌ explicit deny | ❌ | ❌ | ❌ explicit deny |
| **acc-user** | ✅ management-console (page hidden anyway — `acc.services.*` deny + no view) | ❌ | ❌ | ❌ | ❌ | ❌ |

> [!note]
> The mgmt-side route uses `FalconAccess.managementConsole.services.view()` as the activation gate. `acc.services / view` is **explicitly denied** for acc-admin and acc-user (per [[../01-roles/acc-admin]] permission matrix). So an acc-admin clicking the menu hits `/401`, while acc-user typically can't see the menu link either.

> [!note]
> Per-row backend `allowedActions: FalconRowAction[]` is the **second gate** (default-deny if `allowedActions` is missing). Also a row-level `canHide: boolean` flag disables the visibility toggle when the channel is currently visible but `canHide === false` ([INFERRED] mandatory-channel signal from backend). [CODE] `comms-hub.component.ts:867-869, 1061-1073`.

## PES keys consumed

### Admin side (`sys.services` resource)

Source: [CODE] `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:116-121` + `comms-hub.component.ts:1252-1262`.

```typescript
// comms-hub.component.ts:1252-1262
private async primeAccess(): Promise<void> {
  Object.assign(this, await this.accessControlFacade.resolveFlags({
    canDoPayments:       FalconAccess.adminConsole.services.payment(),       // {action:'payment',          resource:'sys.services'}
    canEditPriceType:    FalconAccess.adminConsole.services.editPriceType(), // {action:'edit-price-type',  resource:'sys.services'}
    canEditPriceValue:   FalconAccess.adminConsole.services.editPriceValue(),// {action:'edit-price-value', resource:'sys.services'}
    canManageVisibility: FalconAccess.adminConsole.services.visibility(),    // {action:'visibility',       resource:'sys.services'}
  }));
}
```

Flag-to-UI mapping:
- `canManageVisibility` → column inclusion (only pushed when true at `:942-950`); guards `onDisable`, `onEnable`, `onVisibilityChange` (`:408-410, 577-579, 614-616`); `Disable` / `Enable` row actions.
- `canDoPayments` → guards `onDoPayment` (`:445-447`); `DoPayment` row action.
- `canEditPriceType` → guards `onEditDetail` / `onDeleteDetail` / `onSaveEdit` for price-type editor; `EditPriceType` row action; pen-square / trash icons on each pending-change details row; inline save button `[disabled]` (`HTML:64`).
- `canEditPriceValue` → same suite for price-value editor; HTML:102.

Parent-route guard: `adminConsoleGuard` resolves `FalconAccess.adminConsole.enter()` → `{action:'view', resource:'app.admin-console'}`. The route-level `shellAccessGuard` is wired but no-op (no `data.access`).

### Mgmt side (`acc.services` resource)

Source: [CODE] `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:55-58, 70-72`.

- `FalconAccess.managementConsole.services.view()` → `{action:'view', resource:'acc.services'}` — route guard `data.access`. acc-owner only (acc-admin / acc-user explicit deny).
- `FalconAccess.managementConsole.services.payment()` → `{action:'payment', resource:'acc.services'}` — acc-owner only.
- `FalconAccess.managementConsole.services.disable()` → `{action:'disable', resource:'acc.services'}` — acc-owner only.

The mgmt component **does NOT call `AccessControlFacade` in-component** — gating relies entirely on the route guard + backend `row.allowedActions`. The narrower set of actions (no `edit-price-type` / `edit-price-value` / `visibility` on the `acc.services` side) reflects the authority model: clients don't set their own service prices, only Falcon staff do.

## Differences

### Routing
- **Admin**: single route `comm-mgmt` with `loadComponent` lazy loader, `shellAccessGuard` with no `data.access` (no-op). [CODE] `apps/admin-console/src/app/features/routes.ts:23-32`.
- **Mgmt**: `comm-mgmt` parent with **3 redirected children** (`whatsapp-business`, `voice-service`, `ai` — all redirect to `/not-found`). Parent renders `CommsHubComponent` synchronously (no `loadComponent`). [BRAIN-OUT] `comms-hub.diff.md:9`.
- **Mgmt-only sub-component stubs**: `whatsapp-business.component.ts`, `voice-service.component.ts`, `ai.component.ts` exist under `components/` but the routes redirect away — placeholders for future child pages. [BRAIN-OUT] `comms-hub.diff.md:16`.
- **Path slug is `comm-mgmt`**, NOT `comms-hub`. The folder name `comms-hub` is internal namespace only. [CODE] `apps/admin-console/src/app/features/routes.ts:24`; `apps/host-shell/src/app/layout/layout.component.ts:75`.

### Component
- **Same primary component class name** (`CommsHubComponent`) and same major shape: tree + table + 5 ng-template renderers (`editPriceTypeTpl`, `editPriceValueTpl`, `detailsRowTpl`, `visibilityTpl`, `priceValueCellTpl`) + 2 insufficient-balance dialogs.
- **Admin uses default change detection** (no `OnPush`) and manually calls `markForCheck()` / `detectChanges()` in async paths.
- **Both** components resolve `accountId` from session as `session.tenantId || session.client_id` (line 227, 880-883).
- **Heavy inbound coupling to `organization-hierarchy`** feature: both pull `CommerceActionsService`, `CommerceGatewayService`, `OrgHierarchyApiService`, `OrgHierarchyNode`, mapper utils, and request DTOs from `apps/<console>/src/app/features/organization-hierarchy/components/tabs-layout/components/service/...`. Smell flagged for new theme — should be lifted to shared library. [BRAIN-OUT] `comms-hub.07-CROSS-PAGE.md:6-18`.

### Service / API
- **List endpoint differs**:
  - **Admin**: `GET commerce/Node/{nodeId}/comm-channels` (full unfiltered list for management). [CODE] `apps/admin-console/.../services/comms-hub.service.ts:31`.
  - **Mgmt**: `GET commerce/Node/{nodeId}/comm-channels/visible/details` (visibility-filtered list with priority/payment details — what Client users should see). [CODE] `apps/management-console/.../services/comms-hub.service.ts:22`.
- **Mutation endpoints — identical** on both sides (both import the same `CommerceActionsService` from `account-administration/organization-hierarchy/components/tabs-layout/components/service/commerce-actions.service.ts`):
  - `PUT commerce/node/comm-channel/visibility`
  - `PUT commerce/node/comm-channel/price-type`
  - `PUT commerce/node/comm-channel/price-value`
  - `POST commerce/node/comm-channel/do-payment` (header `notShowToaster: 'true'`)
  - `POST commerce/node/comm-channel/disable`
  - `POST commerce/node/comm-channel/enable`
  - `DELETE commerce/node/comm-channel/new-price-type` (body)
  - `DELETE commerce/node/comm-channel/new-price-value` (body)
  - `GET commerce/Node/{nodeId}/comm-channels/visible` (priority dialog source)
  - `GET commerce/Node/order/{orderId}/status` (polling)
  - `GET commerce/Node` + `GET commerce/Node?NodeId={parentId}` (tree)
- **13 endpoints total per page UI flow**. The admin-side `CommsHubService` also declares `updatePriceType` and `updatePriceValue` methods that hit `commerce/Node/priceType` / `commerce/Node/priceValue` — **dead code** (component routes through `CommerceActionsService` instead). [BRAIN-OUT] `comms-hub.03-SERVICES-APIS.md:41`.
- **Payment polling**: `SimplePollService.watch({intervalSeconds: 2, maxDurationMinutes: 30, shouldStop: status ∈ {Completed, Failed}})`. Three failure-reason branches identical on both sides:
  - `InsufficientFunds` → warning dialog
  - `CommChannelPriorityOrderRequired` → drag-drop priority dialog → retry with `commChannelPriorityIds`
  - `WalletNotConfigForTheNode` → warning dialog (directs to Wallet & Balance Management).
- **Provider integration endpoints**: there are NONE. comms-hub is the **commercial subscription** view, not provider config (Twilio / SMTP / SendGrid settings live elsewhere). Also no template-related endpoints — "Communication Channel Templates" concept is not joined here. [BRAIN-OUT] `comms-hub.00-README.md:14-16`.

### DTOs
- **Shared core fields** in `CommChannelServiceItem` (id, accountId, name, visibility, pricingType, priceValue, 3 date fields, status, allowedActions, canHide).
- **Mgmt-only UI extras**: `subtitle`, `description`, `iconClass`, `iconSvg`, `iconUrl`, `pricePeriod`, `currency`, `showDates`, `showPrice`. [BRAIN-OUT] `comms-hub.diff.md:35-38`.
- **Shared mutation DTOs** — same `Change*` / `DoPayment*` / `Enable/Disable*` / `Delete*NewPrice*` request types (with comm-channel variants mirroring the application variants used by marketplace-applications). [CODE] `apps/admin-console/.../organization-hierarchy/components/tabs-layout/components/models/models.ts`.
- **Shared enums**: `PricingType`, `FalconRowAction`, `FalconItemStatus`, `ProcessState`, `OrderFailureReason`, `WalletType` — all from `@falcon`.

### Gateway
- **Admin → SystemGateway → falcon-core-commerce-svc.**
- **Mgmt → CoreGateway → falcon-core-commerce-svc.**
- Order-status polling is also Commerce-hosted ([INFERRED] same URL family `commerce/Node/order/{orderId}/status`, NOT a dedicated charging path). [BRAIN-OUT] `comms-hub.03-SERVICES-APIS.md:63`.

## What changes when copying admin → mgmt

- [ ] Swap admin-console route path under `/management-console/comm-mgmt`; **expand** to parent + 3 placeholder child slugs (`whatsapp-business`, `voice-service`, `ai`) that all redirect to `/not-found`.
- [ ] Switch route loader: change `loadComponent` lazy import to `component: CommsHubComponent` synchronous import (mgmt convention).
- [ ] Add `data.access: FalconAccess.managementConsole.services.view()` to the route definition.
- [ ] Remove the in-component `primeAccess()` block (4 `resolveFlags` calls) — mgmt-side relies on route gate + backend `row.allowedActions` only.
- [ ] Replace `Gateway.SystemGateway` with `Gateway.CoreGateway` in `app.config.ts:52`.
- [ ] Replace list endpoint URL: `commerce/Node/{nodeId}/comm-channels` → `commerce/Node/{nodeId}/comm-channels/visible/details` (visibility-filtered).
- [ ] Extend DTO `CommChannelServiceItem` with card-view UI fields (`subtitle`, `description`, `iconClass`, `iconSvg`, `iconUrl`, `pricePeriod`, `currency`, `showDates`, `showPrice`).
- [ ] Change unknown `pricingType` default from `PricingType.Monthly` to `'--'` placeholder.
- [ ] Add 3 stub component files under `components/` (`whatsapp-business.component.ts`, `voice-service.component.ts`, `ai.component.ts`) — even though their routes redirect away, they exist for future expansion.
- [ ] Honour acc-* role differences: **acc-owner only** for payment & disable; acc-admin's `acc.services.{view, payment, disable}` are explicitly `deny`; acc-user has no rule (silent deny — page returns empty / hidden from nav).
- [ ] Mirror insufficient-balance dialogs into `apps/management-console/src/app/shared/components/` if not already there — currently duplicated per app.
- [ ] Lift `CommerceActionsService` + `CommerceGatewayService` out of `organization-hierarchy/components/tabs-layout/components/service/` into a shared library (smell flagged). Both `comms-hub` and `marketplace-applications` consume them; both sides need the move.
- [ ] Drop the unused `EditPriceType` / `EditPriceValue` / `Visibility` row-menu actions (no `acc.services / edit-price-*` or `acc.services / visibility` actions exist — only `view`, `payment`, `disable`).

## Cross-references

- Roles: [[../01-roles/sys-admin]] · [[../01-roles/sys-products]] · [[../01-roles/sys-ops]] · [[../01-roles/acc-owner]] · [[../01-roles/acc-admin]] · [[../01-roles/acc-user]]
- Status enums (Commerce + Provisioning): [[../02-statuses/service-status]] (this page uses `eFalconServiceStatus` heavily — Active=2, InActive=1, Expired=3, Disabled=4)
- PES key universe: [[../03-pes-keys/REGISTRY-RAW]]
- Sibling page that shares `CommerceActionsService` + 2 insufficient-balance dialogs: [[marketplace-applications]] (parallel application implementation)
- Old-UI dataset (admin): `C:\Falcon\Brain Outputs\datasets\old-ui-dataset\10-pages\admin-console\comms-hub\`
- Old-UI dataset (mgmt diff): `C:\Falcon\Brain Outputs\datasets\old-ui-dataset\10-pages\management-console\_diffs\comms-hub.diff.md`
