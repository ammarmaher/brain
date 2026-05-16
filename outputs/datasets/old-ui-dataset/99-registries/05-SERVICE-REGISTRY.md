---
title: Service Registry — Old UI (origin/main @ 803ac1d1)
type: registry
registry: services
source: aggregated from 10-pages/ deep-dives (origin/main @ 803ac1d1)
extracted: 2026-05-16
extracted-by: aggregation-agent
total_services: 49
---

# Old UI — Service Registry

> Every Angular `@Injectable()` service that participates in feature behaviour. Deduplicated across features — shared services (`OrgHierarchyApiService`, `CommerceGatewayService`, `AccessControlFacade`, `SessionProvider`, `OrderStatusService`, etc.) listed once with consumer counts.

## Headline counts

- **Feature-local services**: ~40 (1–3 per feature)
- **Cross-feature shared services**: 9 (consumed by 2+ features)
- **Platform `@falcon` services**: ~12 (re-used in nearly every feature)
- **Total distinct service classes**: **~49** across the workspace

---

## Cross-feature shared services (the ones every refactor must track)

| Service | File | providedIn | Endpoints | Consumed by |
|---|---|---|---|---|
| `OrgHierarchyApiService` | `apps/admin-console/src/app/features/organization-hierarchy/services/org-hierarchy.api.service.ts:29` (admin) + `apps/management-console/src/app/features/account-administration/organization-hierarchy/services/org-hierarchy.api.service.ts` (mgmt) + `apps/host-shell/src/app/features/user-profile/services/org-hierarchy.api.service.ts:21` (host) | `root` | `GET commerce/Node`, `GET commerce/Node?NodeId={id}` | **9 features**: admin (organization-hierarchy, wallet-balance, comms-hub, contact-groups, contracts, marketplace), mgmt (account-administration, contact-groups, contracts), host (user-profile). Owner of tree population. Mocks-on-error anti-pattern in admin version. |
| `CommerceGatewayService` | `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/service/commerce-gateway.service.ts:42` (admin) + mirror in mgmt | `root` | 16 endpoints under `commerce/node/*` (visibility/price-type/price-value/do-payment/enable/disable/delete-new-price-* × application + comm-channel) | admin: org-hierarchy apps + comm-channels tabs, comms-hub, marketplace; mgmt: account-administration apps + comm-channels tabs, comms-hub, marketplace |
| `CommerceActionsService` | `apps/admin-console/.../tabs-layout/components/service/commerce-actions.service.ts:43` (admin) + mirror in mgmt | `root` | Thin façade — delegates to `CommerceGatewayService` for testability/mocking | same 4 admin features + 4 mgmt features |
| `OrgHierarchyApiService` | (see top) | | | (see top) |
| `OrderStatusService` (`@falcon`) | `libs/falcon/src/shared-data-access/lib/services/order-status.service.ts` | `root` | `GET` commerce-hosted order status (URL inside service) | Every feature that does `do-payment`: admin (comms-hub, marketplace, org-hierarchy apps + comm-channels tabs), mgmt (same set) |
| `SimplePollService` (`@falcon`) | `libs/falcon/src/shared-data-access/lib/services/simple-poll.service.ts` | `root` | Non-HTTP — generic interval-poll with `shouldStop` predicate | Same 4 admin + 4 mgmt features that poll order status |
| `HttpService` (`@falcon`) | `libs/falcon/src/shared-data-access/lib/services/http.service.ts` | `root` | Thin wrapper around `HttpClient` that honors `useGateway()` HttpContext | Every feature with a service |
| `AccessControlFacade` (`@falcon`) | `libs/falcon/src/core/lib/access-control/access-control.facade.ts:28` | `root` | Non-HTTP — `ensure(queries)`, `can(query)`, `resolveFlags({})` | Every PES-gated feature + every guard |
| `SessionProvider` (`@falcon`) | `libs/falcon/src/core/lib/services/session-provider.service.ts` | `root` | Non-HTTP — `session.userType`, `session.tenantId`, `session.client_id`, `session.identityUserId`, etc. | Every feature that conditions on userType / account-id / ownership |
| `TranslateService` (`@falcon`) | `libs/falcon/src/language/lib/services/translate.service.ts` | `root` | Non-HTTP — i18n keys → localized strings | Every feature |
| `CommunicationChannelsApiService` | `apps/admin-console/src/app/shared/services/communication-channels-api.service.ts:11` + mgmt mirror at `apps/management-console/src/app/shared/services/communication-channels-api.service.ts` | `root` | `GET commerce/Node/{nodeId}/comm-channels/visible` | admin + mgmt: comms-hub priority dialog, marketplace priority dialog, contracts (channel options lookup) |

---

## Feature-owned services

### Admin / Organization Hierarchy (11 services)

| Service | File | providedIn | Endpoints | Notes |
|---|---|---|---|---|
| `OrgHierarchyApiService` | `services/org-hierarchy.api.service.ts:29` | `root` | 2 GET on `commerce/Node` | tree root + children |
| `NodeApiService` | `services/node-api.service.ts:21` | `root` | `PUT commerce/Node/changeNodeName`, `POST commerce/Node/create-SubNode`, `POST commerce/Node/create-account` | rename + add child + create-client wizard |
| `UserApiService` (org-hierarchy local) | `services/user-api.service.ts:42` | `root` | `POST user/generate-password` (Identity Gateway), `GET user?...` (Identity Gateway) | distinct from host-shell's `core/user/user-api.service.ts` |
| `ApplicationApiService` | `services/application-channel-api.service.ts:7` | `root` | `GET commerce/application` | wizard step 3 lookup |
| `CommunicationChannelApiService` | `services/communication-channel-api.service.ts:7` | `root` | `GET commerce/communicationChannel` | wizard step 2 lookup |
| `SettingsApiService` | `services/settings-api.service.ts:9` | `root` | `GET commerce/Setting?ownerId=`, `PUT commerce/Setting` | settings tab |
| `InformationService` | `components/tabs-layout/components/hierarchy-tab/components/information/service/information.service.ts:9` | `root` | `GET commerce/information?NodeId=`, `PUT commerce/information` (PascalCase body) | info view |
| `AppsServicesService` | `components/tabs-layout/components/apps-services-tab/services/apps-services.service.ts:23` | `root` | `GET commerce/Node/{id}/applications` (+ 2 unused legacy `PUT commerce/Node/priceType\|priceValue`) | apps tab list |
| `CommChannelsServicesService` | `components/tabs-layout/components/comm-channels-services-tab/services/comm-channels-services.service.ts:24` | `root` | `GET commerce/Node/{id}/comm-channels` (+ 2 unused legacy) | comm-channels tab list (admin) |
| `CommerceGatewayService` | (shared — see top) | `root` | 16 endpoints | shared mutation surface |
| `CommerceActionsService` | (shared — see top) | `root` | façade | shared façade |

### Admin / Wallet Balance Management (1 owned + 1 reused)

| Service | File | providedIn | Endpoints |
|---|---|---|---|
| `WalletBalanceService` | `services/wallet-balance.service.ts:15` | `root` | `GET api/commerce/accounts/{id}/hierarchy?...`, `POST commerce/setting/wallets`, `POST charging/wallet/transfer` |
| `OrgHierarchyApiService` | (shared) | `root` | tree |

### Admin / Comms Hub (1 owned + 4 reused)

| Service | File | providedIn | Endpoints |
|---|---|---|---|
| `CommsHubService` | `services/comms-hub.service.ts` | `root` | `GET commerce/Node/{id}/comm-channels` (+ 2 unused legacy `updatePriceType/Value`) |
| `CommerceActionsService` + `CommerceGatewayService` + `OrgHierarchyApiService` + `CommunicationChannelsApiService` | (shared) | `root` | mutations + tree + visible-channels |

### Admin / Contact Groups (2 owned + 1 reused)

| Service | File | providedIn | Endpoints |
|---|---|---|---|
| `ContactGroupsApiService` | `services/contact-groups-api.service.ts:34` | `root` | `GET contactgroup/contact-groups` (list), `GET contactgroup/contact-groups/shared` (shared list) |
| `ContactGroupDetailsService` | `components/contact-group-details/services/contact-group-details.service.ts:43` | `root` | 6 endpoints: detail GET / file-download GET / contacts GET / update PATCH / shareable users GET (identity) |
| `OrgHierarchyApiService` | (shared) | `root` | tree |

### Admin / Contracts (1 owned + 1 reused via shared component)

| Service | File | providedIn | Endpoints |
|---|---|---|---|
| `ContractsApiService` | `services/contracts-api.service.ts:140` | `root` | 8 endpoints: `commerce/Contracts` × 4 (CRUD) + `commerce/Setting/wallets/{id}` + 2× `commerce/Node/{id}/*` (application + channel options) + `charging/Wallet/contract-balance-summaries` |
| `OrgHierarchyApiService` | (shared, consumed via `ContractsAccountsPanelComponent`) | `root` | tree |

### Admin / Marketplace Applications (1 owned + 4 reused)

| Service | File | providedIn | Endpoints |
|---|---|---|---|
| `MarketplaceApplicationsService` | `services/marketplace-applications.service.ts:17` | `root` | `GET commerce/Node/{id}/applications` |
| `CommerceActionsService` + `CommerceGatewayService` + `OrgHierarchyApiService` + `CommunicationChannelsApiService` + `OrderStatusService` + `SimplePollService` | (shared) | `root` | mutations + tree + visible-channels + polling |

### Admin / Testing Charging (1 owned)

| Service | File | providedIn | Endpoints |
|---|---|---|---|
| `TestingChargingApiService` | `services/testing-charging-api.service.ts:18` | `root` | 10 endpoints under `api/testing/charging/*` (accounts/overview/wallets/reservations/ledger/balances/runs/runs/{id}/whatsapp/batches × 2) |

### Host / Core (7 services)

| Service | File | providedIn | Endpoints |
|---|---|---|---|
| `AuthService` | `apps/host-shell/src/app/core/auth/auth.service.ts:17` | `root` | Non-HTTP orchestration of `AuthApiService` + JWT lifecycle + refresh-token coordinator |
| `AuthApiService` | `core/auth/auth-api.service.ts:23` | `root` | 8 endpoints under `auth/*` (Identity Gateway) |
| `TokenStorageService` | `core/auth/token-storage.service.ts:9` | `root` | Non-HTTP — sessionStorage for `access_token`/`refresh_token` |
| `UserApiService` (host core — distinct from org-hierarchy's local) | `core/user/user-api.service.ts:29` | `root` | 10 endpoints under `identity/user/*` |
| `ChangePasswordService` (layout) | `layout/components/user-profile-menu/change-password-modal/services/change-password.service.ts:7` | `root` | `PUT identity/user/change-password` |
| `PrimeNGThemeService` | `core/services/prime-ng-theme.service.ts:12` | `root` | Non-HTTP — theme + RTL sync to `<html>` |
| `RemoteRouteService` | `core/services/remote-route.service.ts:16` | `root` | `GET /assets/module-federation.manifest.json` + dynamic route builder |

### Host / Auth (5 screen wrappers)

| Service | File | providedIn | Endpoints (via `AuthApiService`) |
|---|---|---|---|
| `LoginService` | `features/auth/get-started/services/login.service.ts` | `root` | `POST auth/login` (trims+lowercases username) |
| `OtpService` | `features/auth/enter-otp/services/otp.service.ts` | `root` | `POST auth/verify-otp`, `POST auth/resend-otp` |
| `ChangePasswordService` (auth feature, first-login) | `features/auth/change-password/services/change-password.service.ts` | `root` | `POST auth/first-login`, `POST auth/set-password` |
| `ForgotPasswordFlowService` | `features/auth/forgot-password-flow/services/forgot-password-flow.service.ts` | `root` | `POST auth/forgot-password`, `POST auth/verify-otp`, `POST auth/forgot-password/set-password` |
| `AuthFlowStateService` | `features/auth/services/auth-flow-state.service.ts` | `root` | Non-HTTP — sessionStorage state under `'falcon_auth_flow'` key |

### Host / Dashboard

**0 services injected.** Mock data only.

### Host / Demo

**0 services injected.** Reads `FALCON_AUTH`/`FALCON_LANGUAGE`/`FALCON_THEME`/`FALCON_NOTIFIER`/`FALCON_CONTEXT` tokens (facades) + injects `AuthService` for logout.

### Host / Error / Not Found / Unauthorized

**0 services injected.** Pure UI fallbacks.

### Host / User Profile (5 owned + multiple reused)

| Service | File | providedIn | Endpoints |
|---|---|---|---|
| `UserProfileService` | `user-profile.service.ts:21` | `root` | Façade over `UserApiService` (host core) — orchestrates profile/status/role update chain |
| `OrgHierarchyApiService` (user-profile local) | `services/org-hierarchy.api.service.ts:21` | `root` | `GET commerce/Node`, `GET commerce/Node?NodeId=` |
| `RoleCatalogService` | `services/role-catalog.service.ts:24` | `root` | `GET <baseURLPes>/pes/roles?...` (bypasses gateway) |
| `ProfileOtpService` | `services/profile-otp.service.ts:23` | `root` | `POST /user/me/verify-{phone,email}`, `POST user/me/verify-{phone,email}/confirm` |
| `UserWizardService` | `components/add-user-wizard/services/user-wizard.service.ts:19` | `root` | Façade → `UserApiService.create()` |
| `UserApiService` (host core) | (reused) | | |

### Management Console / Account Administration (8 owned + shared mirrors)

Mirror of admin/organization-hierarchy (same class names, same file structure under `apps/management-console/src/app/features/account-administration/`):

- `OrgHierarchyApiService` (mgmt copy)
- `NodeApiService` (mgmt copy)
- `UserApiService` (mgmt copy, explicit `useGateway(Gateway.CoreGateway)`)
- `SettingsApiService` (mgmt copy)
- `InformationService` (mgmt copy)
- `AppsServicesService` (mgmt copy)
- `CommChannelsServicesService` (mgmt copy — uses `GET commerce/Node/{id}/comm-channels/visible/details` instead of `commerce/Node/{id}/comm-channels`)
- `CommerceActionsService` + `CommerceGatewayService` (mgmt copy)

### Management Console / Comms Hub (mgmt-only)

- `CommsHubService` (mgmt-local) — uses `GET commerce/Node/{id}/comm-channels/visible/details` (vs admin's `commerce/Node/{id}/comm-channels`)
- Reuses `CommerceActionsService` from account-administration

### Management Console / Contact Groups (5 wizard services + 2 detail/list services)

| Service | File | Endpoints |
|---|---|---|
| `ContactGroupsApiService` (mgmt) | `services/contact-groups-api.service.ts` | list + shared list + share legacy + delete |
| `ContactGroupDetailsService` (mgmt) | wizard detail folder | 6 detail/file endpoints |
| `UploadGroupDetailsService` (mgmt only — wizard) | `create-contact-group/.../upload-group-details/services/...` | 4 endpoints: config GET, init POST, S3 PUT (external), complete POST |
| `PreviewConfigureService` (mgmt only) | wizard step 2 service | `GET contactgroup/contact-groups/uploads/{uploadId}/preview` |
| `ReviewCreateService` (mgmt only) | wizard step 3 service | `POST contactgroup/contact-groups` |
| `ShareGroupService` (mgmt only) | wizard step 4 service | `GET identity/user?Status=2&Status=3&Status=4&Role=6` |
| `ContactGroupsStateService` (mgmt only) | shared state — signals for selectedNode/uploadConfig/pendingSuccessMessage | Non-HTTP — provided at parent-component level (`providers: [ContactGroupsStateService]`) |

### Management Console / Contracts (1 service)

| Service | File | Endpoints |
|---|---|---|
| `ManagementContractsApiService` | `apps/management-console/src/app/features/contracts-cost-management/services/contracts-api.service.ts` | `GET api/commerce/contracts` (list), `GET api/commerce/contracts/{id}` (detail). **No balance lookup, no create/update — view-only.** |

> Cross-app sibling import: this service imports DTOs/components from `apps/admin-console/.../contracts-cost-management/contracts.models.ts` via relative path `../../../../../admin-console/...`. **Anti-pattern** — flagged as GAP-OLDUI-07 (cross-app coupling).

### Management Console / Marketplace + Wallet (mgmt copies)

- `MarketplaceApplicationsService` (mgmt copy) — same `GET commerce/Node/{id}/applications` + UI-extras DTOs
- `WalletBalanceService` (mgmt copy) — `GET api/commerce/accounts/{id}/hierarchy`, `POST commerce/setting/wallets`, `POST wallet/transfer` (with explicit `useGateway(Gateway.ChargingGateway)`)

---

## Shared / cross-app sibling-import anti-patterns

| Anti-pattern | Site | What it imports |
|---|---|---|
| Cross-app sibling import (admin → mgmt) | `mgmt/contracts-cost-management/contracts-cost-management.component.ts:6-14` + `services/contracts-api.service.ts:14` | Reaches across to `apps/admin-console/...` via `../../../../../admin-console/src/app/...` — 3 components (`ContractsDataTableComponent`, `ContractsNodeHeaderComponent`, `ContractsViewContractComponent`) + the entire `contracts.models.ts` |
| Duplicated `CommerceGatewayService` + `CommerceActionsService` | admin + mgmt each carry a copy of the same 16-endpoint service tree under `account-administration` | Code is byte-identical but two-file maintenance |
| Duplicated `OrgHierarchyApiService` | admin + mgmt + host/user-profile each have their own | Three independent copies (with subtle diffs — mgmt uses `useGateway(Gateway.CoreGateway)`, host uses no arg) |
| Duplicated `UserApiService` | `apps/admin-console/.../organization-hierarchy/services/user-api.service.ts` vs `apps/host-shell/src/app/core/user/user-api.service.ts` — overlapping `generate-password` and `listByNode` functionality with different URLs (`user/generate-password` vs `identity/user/generate-password`) |
| Duplicated `ChangePasswordService` | layout `change-password-modal/services/` (logged-in user changes own) vs auth-feature `change-password/services/` (first-login flow) — same class name, different purpose. Confusing — should rename. |

## Summary

- **49 distinct service classes** across the workspace (counting admin/mgmt mirrors as distinct files even when code is identical)
- **9 cross-feature shared services** (consumed by 2+ features)
- **12 platform `@falcon` services** (consumed everywhere — `HttpService`, `AccessControlFacade`, `SessionProvider`, `TranslateService`, `OrderStatusService`, `SimplePollService`, etc.)
- **Most heavily consumed feature service**: `OrgHierarchyApiService` — 9 features depend on it (admin × 6 + mgmt × 3 + host user-profile). Consolidating this is the highest-leverage refactor target.
- **Most-mirrored class**: `CommerceGatewayService` + `CommerceActionsService` — admin and mgmt each carry full copies, used across 8 features (4 admin + 4 mgmt). Candidate for promotion to `libs/falcon/` shared.
