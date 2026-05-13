*** API_TO_COMPONENT_TRACE — frontend page/service → backend endpoint (2026-05-13) ***

> Best-effort trace from a Grep on `this.http.(get|post|put|delete|patch)` across the active frontend tree
> (excludes `node_modules`, `dist`, `legacy-*`, `deprecated-*`, `demos/`). Paths in column 1 are absolute on disk.
> Method + URL is what the frontend emits (pre-gateway). After the gateway's `PathPrefix=/api` transform, every
> URL below becomes `/api/<frontend-url-after-the-first-prefix>` on the upstream service.
>
> The `useGateway(...)` call decides which gateway is hit:
> - `Gateway.IdentityGateway` → Identity routes (`/api/auth/*`, `/api/user/*`)
> - `Gateway.SystemGateway` → System Gateway (Falcon admin scope, port 7256)
> - `useGateway()` with no arg → dynamic per logged-in user type (Falcon → System; Client → Core)

## Bound endpoints (frontend → backend match)

| FRONTEND CALL SITE | METHOD | URL (pre-gateway) | UPSTREAM (after `/api` rewrite) | SERVICE | DTO IN → OUT |
|---|---|---|---|---|---|
| `apps/host-shell/src/app/core/auth/auth-api.service.ts:31` | POST | `auth/login` | `/api/auth/login` | Identity | `LoginRequest` → `LoginStepResult` |
| `apps/host-shell/src/app/core/auth/auth-api.service.ts:40` | POST | `auth/verify-otp` | `/api/auth/verify-otp` | Identity | `VerifyOtpRequest` → `LoginStepResult` |
| `apps/host-shell/src/app/core/auth/auth-api.service.ts:49` | POST | `auth/resend-otp` | `/api/auth/resend-otp` | Identity | `ResendOtpRequest` → `LoginStepResult` |
| `apps/host-shell/src/app/core/auth/auth-api.service.ts:58` | POST | `auth/forgot-password` | `/api/auth/forgot-password` | Identity | `ForgotPasswordRequest` → `LoginStepResult` |
| `apps/host-shell/src/app/core/auth/auth-api.service.ts:67` | POST | `auth/set-password` | `/api/auth/set-password` | Identity | `SetPasswordRequest` → `bool` |
| `apps/host-shell/src/app/core/auth/auth-api.service.ts:76` | POST | `auth/forgot-password/set-password` | `/api/auth/forgot-password/set-password` | Identity | `ForgotPasswordSetPasswordRequest` → `bool` |
| `apps/host-shell/src/app/core/auth/auth-api.service.ts:85` | POST | `auth/first-login` | `/api/auth/first-login` | Identity | `FirstLoginSetupRequest` → `LoginStepResult` |
| `apps/host-shell/src/app/core/auth/auth-api.service.ts:98` | POST | `auth/refresh-token` | `/api/auth/refresh-token` | Identity | `{refreshToken}` → `AuthenticatedResult` |
| `apps/host-shell/src/app/core/user/user-api.service.ts:46` | GET | `identity/user/me` | `/api/user/me` | Identity | (none) → `UserResponse` |
| `apps/host-shell/src/app/core/user/user-api.service.ts:53` | GET | `identity/user/{id}` | `/api/user/{id}` | Identity | (route) → `UserResponse` |
| `apps/host-shell/src/app/core/user/user-api.service.ts:73` | GET | `identity/user?NodeId=&Role=` | `/api/user/?NodeId=&Role=` | Identity | (query) → `PagedResponse<UserInfoResponse>` |
| `apps/host-shell/src/app/core/user/user-api.service.ts:90` | POST | `identity/user` | `/api/user/` | Identity | `CreateUserRequest` → `CreateUserResponse` |
| `apps/host-shell/src/app/core/user/user-api.service.ts:101` | POST | `identity/user/exist` | `/api/user/exist` | Identity | `UserExistRequest` → `ExistResponse` |
| `apps/host-shell/src/app/core/user/user-api.service.ts:112` | POST | `identity/user/generate-password` | `/api/user/generate-password` | Identity | `GeneratePasswordRequest` → `GeneratePasswordResponse` |
| `apps/host-shell/src/app/core/user/user-api.service.ts:125` | PUT | `identity/user/status` | `/api/user/status` | Identity | `ChangeUserStatusRequest` → `object` |
| `apps/host-shell/src/app/core/user/user-api.service.ts:136` | PUT | `identity/user/profile` | `/api/user/profile` | Identity | `UpdateUserProfileRequest` → `bool` |
| `apps/host-shell/src/app/core/user/user-api.service.ts:148` | PUT | `identity/user/{id}/profile` | `/api/user/{id}/profile` | Identity | `UpdateUserProfileRequest` → `bool` |
| `apps/host-shell/src/app/core/user/user-api.service.ts:160` | PUT | `identity/user/{id}/role` | `/api/user/{id}/role` | Identity | `UpdateUserRoleRequest` → `bool` |
| `libs/falcon/src/core/lib/services/node.service.ts:24` | GET | `commerce/Node` | `/api/Node?NodeId=` | Commerce | (query) → `List<GetHierarchyNodeResponse>` |
| `libs/falcon/src/shared-data-access/lib/services/order-status.service.ts:14` | GET | `commerce/Node/order/{orderId}/status` | `/api/Node/order/{orderId}/status` | Commerce | (route) → `GetOrderStatusResponse` |
| `libs/falcon/src/shared-data-access/lib/services/account-validation.service.ts:25` | GET | `commerce/Node/ValidateAccountName` | `/api/Node/ValidateAccountName?AccountName=` | Commerce | (query) → `bool` |
| `libs/falcon/src/shared-data-access/lib/services/account-validation.service.ts:56` | POST | `user/exist` | `/api/user/exist` | Identity | `{Username}` → `{exists}` |
| `libs/falcon/src/shared-data-access/lib/services/lookup.service.ts:68` | GET | `commerce/Lookup/{lookupId}` | `/api/Lookup/{id}?name=&code=` | Commerce | (route + query) → `List<Hook<LookupValueResponse>>` |
| `libs/falcon/src/core/lib/access-control/access-control.client.ts:20` | POST | `pes/authorize/resources` | `/pes/authorize/resources` | Access (PES) | `PesAuthorizeResourcesRequest` → `PesAuthorizeResourcesResponse` |
| `apps/admin-console/.../organization-hierarchy/services/services.ts:68` | GET | `commerce/Node` (System GW) | `/api/Node?NodeId=` | Commerce | (query) → `List<GetNodeResponse>` |
| `apps/admin-console/.../organization-hierarchy/services/services.ts:97` | GET | `commerce/Node` (System GW, paged) | `/api/Node?...` | Commerce | (query) → `List<GetNodeResponse>` |
| `apps/admin-console/.../organization-hierarchy/services/services.ts:138` | GET | `user` (Identity GW) | `/api/user/` | Identity | (query) → `PagedList<UserInfoWire>` |
| `apps/admin-console/.../organization-hierarchy/services/services.ts:172` | POST | `commerce/Node/create-SubNode` | `/api/Node/create-SubNode` | Commerce | `CreateSubNodeRequest` → `bool` |
| `apps/admin-console/.../organization-hierarchy/services/services.ts:200` | PUT | `commerce/Node/ChangeNodeName` | `/api/Node/ChangeNodeName` | Commerce | `ChangeNodeNameRequest` → `string` |
| `apps/admin-console/.../wizard-components/add-client-wizard/services/services.ts:42` | POST | `commerce/Node/create-account` | `/api/Node/create-account` | Commerce | `CreateAccountRequest` → `CreateAccountResponse` |
| `apps/admin-console/.../wizard-components/add-user-wizard/services/services.ts:80` | POST | `user` (Identity GW) | `/api/user/` | Identity | `CreateUserRequest` → `CreateUserResponse` |
| `apps/admin-console/.../wizard-components/add-user-wizard/services/services.ts:99` | PUT | `user/{id}/profile` | `/api/user/{id}/profile` | Identity | `UpdateUserProfileRequest` → `bool` |
| `apps/admin-console/.../wizard-components/add-user-wizard/services/services.ts:117` | PUT | `user/{id}/role` | `/api/user/{id}/role` | Identity | `{roleKey}` → `bool` |
| `apps/admin-console/.../wizard-components/add-user-wizard/services/services.ts:146` | POST | `user/generate-password` | `/api/user/generate-password` | Identity | `GeneratePasswordRequest` → `GeneratePasswordResponse` |
| `apps/management-console/.../organization-hierarchy-page/services/services.ts:62` | GET | `commerce/Node` | `/api/Node?...` | Commerce | (query) → `List<GetNodeResponse>` |
| `apps/management-console/.../organization-hierarchy-page/services/services.ts:88` | GET | `commerce/Node` (paged) | `/api/Node?...` | Commerce | (query) → `List<GetNodeResponse>` |
| `apps/management-console/.../organization-hierarchy-page/services/services.ts:122` | GET | `user` (Identity GW) | `/api/user/` | Identity | (query) → `PagedList<UserInfoWire>` |
| `apps/management-console/.../organization-hierarchy-page/services/services.ts:154` | POST | `commerce/Node/create-SubNode` | `/api/Node/create-SubNode` | Commerce | `CreateSubNodeRequest` → `bool` |
| `apps/management-console/.../organization-hierarchy-page/services/services.ts:180` | PUT | `commerce/Node/ChangeNodeName` | `/api/Node/ChangeNodeName` | Commerce | `ChangeNodeNameRequest` → `string` |
| `apps/management-console/.../wizard-components/add-client-wizard/services/services.ts:36` | POST | `commerce/Node/create-account` | `/api/Node/create-account` | Commerce | `CreateAccountRequest` → `CreateAccountResponse` |
| `apps/management-console/.../wizard-components/add-user-wizard/services/services.ts:76` | POST | `user` (Identity GW) | `/api/user/` | Identity | `CreateUserRequest` → `CreateUserResponse` |
| `apps/management-console/.../wizard-components/add-user-wizard/services/services.ts:93` | PUT | `user/{id}/profile` | `/api/user/{id}/profile` | Identity | `UpdateUserProfileRequest` → `bool` |
| `apps/management-console/.../wizard-components/add-user-wizard/services/services.ts:111` | PUT | `user/{id}/role` | `/api/user/{id}/role` | Identity | `{roleKey}` → `bool` |
| `apps/management-console/.../wizard-components/add-user-wizard/services/services.ts:138` | POST | `user/generate-password` | `/api/user/generate-password` | Identity | `GeneratePasswordRequest` → `GeneratePasswordResponse` |

**Total bound:** 41 frontend call sites → roughly 22 distinct backend endpoints (de-duplicated by URL).

## Unbound endpoints (catalogued by Phase 1 but no frontend consumer found this pass)

These endpoints exist in the backend ENDPOINT_REGISTRY files but no frontend call was located. Many are legitimately east-west (anonymous service-to-service); others appear genuinely unconsumed by the current `polishing-v0.4` checkout. Flag as a **discovery gap, not a quality gap** — the existing user-facing pages do not yet exercise these.

### Identity (unbound from `understanding/backend/identity/ENDPOINT_REGISTRY.md`)
- `PUT /api/user/change-password`
- `POST /api/user/verify-password`
- `GET /api/user/count` — east-west only
- `GET /api/user/by-tenant` — east-west only (used by Gateways for hierarchy enrichment)
- `POST /api/user/me/verify-email` + `/resend` + `/confirm`
- `POST /api/user/me/verify-phone` + `/resend` + `/confirm`
- `POST /api/auth/logout` — bound in code but not seen in Grep (the `AuthApiService` only exposes login/verify/forgot/set/refresh; logout likely lives in a separate AuthService that bypasses `AuthApiService`)
- `GET /api/security/user-status/{IdentityUserId}` — anonymous east-west
- `POST /api/webhook/zitadel` — anonymous webhook receiver

### Commerce (unbound from `understanding/backend/commerce/ENDPOINT_REGISTRY.md`)
- `GET /api/Node/{id}/comm-channels`, `/visible`, `/visible/details`
- `GET /api/Node/{id}/applications`
- `PUT /api/Node/comm-channel/visibility`, `application/visibility`
- `PUT /api/Node/comm-channel/price-type`, `application/price-type`, `comm-channel/price-value`, `application/price-value`
- `POST /api/Node/comm-channel/do-payment`, `application/do-payment`
- `POST /api/Node/comm-channel/disable`, `comm-channel/enable`, `application/disable`, `application/enable`
- `DELETE /api/Node/comm-channel/new-price-type`, `comm-channel/new-price-value`, `application/new-price-type`, `application/new-price-value`
- `GET /api/accounts/hierarchy` (the `AccountHierarchyController` endpoint)
- `GET /api/Application`, `GET /api/CommunicationChannel`
- `GET /api/Contracts`, `GET /api/Contracts/{contractId}`, `POST /api/Contracts`, `PUT /api/Contracts/{contractId}`
- `GET /api/Information`, `PUT /api/Information`
- `GET /api/Security/ip-allowlists` — east-west only
- `GET /api/Setting`, `PUT /api/Setting`, `POST /api/Setting/wallets`, `GET /api/Setting/wallets/{ownerId}`
- `GET /api/testing/accounts`
- `GET /commerce/accounts/{id}/hierarchy` (Core Gateway aggregation)
- `GET /commerce/contracts` (Core Gateway aggregation)
- `GET /commerce/contracts/{ContractId}` (Core Gateway aggregation)

### Charging (unbound from `understanding/backend/charging/ENDPOINT_REGISTRY.md`)
- All 20 endpoints — none located in frontend Grep this pass. The Testing Charging BFF endpoints on the System Gateway have a clearly-labeled "Falcon-admin only" gating that the current Admin Console UI may not yet expose.

### Provisioning (unbound from `understanding/backend/provisioning/ENDPOINT_REGISTRY.md`)
- All 6 endpoints — none located.

### Templates (unbound from `understanding/backend/templates/ENDPOINT_REGISTRY.md`)
- All 3 endpoints — Templates is not routed by either gateway (GAP-008), so the frontend cannot reach it currently.

### Contact Group (unbound from `understanding/backend/contact-group/ENDPOINT_REGISTRY.md`)
- All 14 endpoints — none located. Memory references an `active-story-115329-handover` for contact-group permission work, suggesting frontend consumption is planned but not yet on `polishing-v0.4`.

### Access (PES, unbound from `understanding/backend/access/ENDPOINT_REGISTRY.md`)
- All endpoints except `pes/authorize/resources` (which IS bound — see table above).

## Notes on the trace

1. **`commerce/Node` is the workhorse**: 6 distinct call sites read it (hierarchy view, paged tree, both apps' org-hierarchy pages). Several mutations (`/create-SubNode`, `/ChangeNodeName`, `/create-account`) are wired but `/api/Node/{id}/comm-channels`, applications, prices, payments, enables/disables, and new-price-deletes are NOT — these are the post-MVP destructive admin operations.
2. **Identity is the workhorse for user lifecycle**: `host-shell/UserApiService` covers 9 of the 18 user endpoints (`me`, `{id}`, list, create, exist, generate-password, status, profile, `{id}/profile`, `{id}/role`). The remaining 9 (email verify, phone verify, change-password, verify-password, count, by-tenant, webhook, security-status, logout) are all bound to the user-profile / settings / verification flows that haven't been built on `polishing-v0.4` yet.
3. **`identity/user/{id}` and `user/{id}` mix**: `host-shell/UserApiService` prepends `identity/` (so `identity/user/{id}`), but the feature-level services in admin-console and management-console use the bare `user/{id}` prefix. Both ultimately hit `/api/user/{id}` because the `useGateway()` interceptor rewrites the URL host but not the path prefix. Worth documenting as a convention drift in `frontend/ANGULAR_AND_TAILWIND_RULES.md` (LOW — already an existing convention deviation noted but not formally tracked).
4. **No frontend consumer of the 3 Core Gateway aggregation endpoints** (`accounts/{id}/hierarchy`, `contracts`, `contracts/{id}`). The frontend currently goes directly to Commerce's `/Node` and `/Contracts` endpoints. The aggregation layer is wired in the gateway but not yet exercised.
