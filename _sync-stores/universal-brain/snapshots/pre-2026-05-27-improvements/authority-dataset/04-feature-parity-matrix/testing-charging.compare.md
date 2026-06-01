---
type: feature-compare
feature: testing-charging
purpose: "Answers 'why is testing-charging Falcon-only + not portable to Client + which guard/userType filter gates entry'. Open if asked to expose any OCS testing surface to Client users (don't)."
admin-side-app: admin-console
admin-side-route: /admin-console/testing/charging
admin-side-gateway: SystemGateway
mgmt-side-app: null
mgmt-side-route: null
mgmt-side-gateway: null
falcon-only: true
client-only: false
shared: false
pes-keys-admin: []
pes-keys-mgmt: []
extracted: 2026-05-16
---

# Feature · `testing-charging` — Falcon-only QA / Dev Lab

> [!tldr]
> Internal **Falcon-user-only** developer / QA surface that drives the live OCS (Online Charging System) for any target account end-to-end: lists accounts with a wallet strategy, exposes 8 tab panels (overview / wallets / buckets / reservations / ledger / balances / commit-record runs / WhatsApp simulator), and lets QA mutate **real** OCS state by creating reservations and triggering Delivered/Failed/Mixed commit/release callbacks. **No management-console counterpart exists.** No PES keys are checked in-feature; access is gated solely by (1) inherited `adminConsoleGuard` and (2) Falcon-user-type filter on the sidebar nav link.

## At a glance

| Falcon (admin-console) | Client (management-console) | Notes |
|---|---|---|
| Route: `/admin-console/testing/charging` (nested under `path: 'testing'`) | **Does not exist** | No `apps/management-console/.../testing-charging/` folder anywhere |
| Gateway: `SystemGateway` (`:7256`) | — | Endpoints under `api/testing/charging/*` proxied to `falcon-core-charging-svc` |
| In-feature PES keys: **0** | — | Only the inherited `FalconAccess.adminConsole.enter()` from `adminConsoleGuard` is checked at route activation |
| Sidebar visibility: `requiredUserTypes: [FALCON_USER]` + `hidden: userType === CLIENT_USER` | — | [CODE] `apps/host-shell/src/app/layout/layout.component.ts:79, 397-405` |
| 1 service (`TestingChargingApiService`), 10 endpoints | — | [CODE] `apps/admin-console/.../services/testing-charging-api.service.ts:18-105` |
| 1 standalone component (414 LOC + 346-line inline template, no sub-components) | — | [CODE] `apps/admin-console/.../testing-charging.component.ts:25-32` |
| **Zero `<falcon-*>` components, zero PrimeNG** — raw HTML + hand-rolled SCSS palette | — | [BRAIN-OUT] `testing-charging.02-COMPONENTS.md:177-188` |
| Backend feature-flagged: requires `TestingCharging` enabled in **both** system-gateway and charging settings | — | [INFERRED from error copy in component lines 129, 239, 258] |
| Mutates **real OCS state** (real reservations, real callbacks) | — | UI carries a warning banner about this. [CODE] `testing-charging.component.html:5, 67` |

## Per-role capability

| Role | Sees nav link | Reaches route | Sees accounts list | Can run simulator / triggers |
|---|---|---|---|---|
| **sys-admin** | ✅ (Falcon user, `requiredUserTypes` match) | ✅ (`view` on `app.admin-console` allow) | ✅ (subject to backend `TestingCharging` flag + `walletStrategyConfigured` filter) | ✅ |
| **sys-ops** | ✅ (Falcon user) | ✅ | ✅ same as above | ✅ |
| **sys-products** | ✅ (Falcon user) | ✅ | ✅ same as above | ✅ |
| **acc-owner** | ❌ — sidebar `hidden: userType === CLIENT_USER` | ❌ — `adminConsoleGuard` denies (`acc-owner` has explicit deny on `app.admin-console / view`) → `/401` | n/a | n/a |
| **acc-admin** | ❌ | ❌ same | n/a | n/a |
| **acc-user** | ❌ | ❌ same | n/a | n/a |

> [!note]
> All 3 `sys-*` roles get **identical access** to this feature. There is no role-internal differentiation — the entire feature is Falcon-internal and the role differences (root-password edit, wallet-transfer, contact-group create, etc.) play no part in gating this surface. Per [INFERRED] commentary in `testing-charging.05-PES.md:11`, this is consistent with its role as **a sandboxed QA / dev tool, not a customer-facing feature**.

> [!warning]
> One **client-side eligibility filter** lives outside PBAC: `walletStrategyAccounts` getter ([CODE] `testing-charging.component.ts:133-135`) filters the left-column account list to `accounts.filter(a => a.walletStrategyConfigured)`. The backend returns all accounts and the UI does the filtering. Accounts without a wallet strategy are hidden but not denied — the rule is business-state, not PBAC.

## PES keys consumed

### Admin side (testing-charging itself)

| Key | Where | Status |
|---|---|---|
| `FalconAccess.adminConsole.enter()` → `{ action: 'view', resource: 'app.admin-console' }` | Inherited from parent `app.routes.ts:8` via `adminConsoleGuard` | The **only** PBAC gate. [CODE] `libs/falcon/src/core/lib/guards/admin-console.guard.ts:14-27` |
| `shellAccessGuard` | **NOT applied** to `testing/charging` route | Every other admin-console child route declares `shellAccessGuard` either with a specific access query or with breadcrumb-only data. testing-charging is the lone exception. [BRAIN-OUT] `testing-charging.01-ROUTING.md:28` |
| `AccessControlFacade` direct calls | **NONE** in `testing-charging.component.ts`, `testing-charging-api.service.ts`, or `testing-charging.models.ts` | Verified by grep. [BRAIN-OUT] `testing-charging.05-PES.md:13-19` |

### Mgmt side
None — the feature does not exist on the mgmt console.

## Differences

### Routing
**Admin-only — no mgmt counterpart.**

- **Route**: `apps/admin-console/src/app/features/routes.ts:62-75` registers `path: 'testing'` with one child `path: 'charging'` and `loadComponent`. No `canActivate: [shellAccessGuard]`, no `data.access`. [BRAIN-OUT] `testing-charging.01-ROUTING.md:8-29`.
- **Parent guard**: only `adminConsoleGuard` (inherited via `app.routes.ts:5-15`).
- **Breadcrumb**: `Testing Charging Lab`.
- **Sidebar nav**: `apps/host-shell/src/app/layout/layout.component.ts:397-405`. Scope `AdminConsole`, icon `FALCON_ICONS.SETTINGS`, hidden for `CLIENT_USER`.

### Component
**Admin-only — no mgmt counterpart.**

- One standalone component, ~414 LOC, 346-line inline template, zero sub-components — entire UI rendered inline via 8 tabs (Overview / Wallets / Buckets / Reservations / Ledger / Balances / Commit Records / WhatsApp Simulator).
- **Zero `<falcon-*>` components, zero PrimeNG** — raw HTML primitives (`<button>`, `<input>`, `<select>`, `<table>`), styled by 320 lines of scoped SCSS with a hand-rolled palette (`#173d35` deep green, `#2d6f5d` mid green, `#fffdf8` cream, `#9d4c2f` rust) and serif `h1/h2` via `Georgia, 'Times New Roman'`. No design-token integration. [BRAIN-OUT] `testing-charging.02-COMPONENTS.md:177-187`.
- **Single service injection** (`TestingChargingApiService`) — no `AccessControlFacade`, no `SessionProvider`, no `OrgHierarchyApiService`, no `MessageService`, no `TranslateService`. [CODE] `testing-charging.component.ts:33`.
- **WhatsApp simulator form** (11 fields): `accountId`, `ownerId`, `channelId`, `applicationId`, `priority` (`UTILITY` / `AUTHENTICATION` / `ADVERTISEMENT` / `SERVICE`), `destination` (11 ISO-3 codes — `SAU`, `ARE`, `OMN`, `QAT`, `KWT`, `YEM`, `JOR`, `EGY`, `USA`, `GBR`, `IND`), `unit` (`MESSAGE`), `currency`, `messageCount`, `quantityPerMessage`, `reservationTtlSeconds`, `parallelism`, `deliveryMode` (`Manual` etc), `successRate`. [CODE] `testing-charging.component.ts:53-100`.
- **Non-trivial wallet-channel resolution logic** (`:286-401`): `applySimulatorWalletDefaults` sorts owner-options by available balance; `resolveWhatsappChannelId` searches wallets + buckets for explicit channel id; `walletLooksLikeWhatsapp` fuzzy-matches on `channel` / `quotaCode` / `subService` / `bucketId`.

### Service / API
**Admin-only — no mgmt counterpart. 10 endpoints under `api/testing/charging/*`** (NOT `commerce/*` like sibling features):

| # | Method | URL | Method | Response |
|---|---|---|---|---|
| 1 | GET | `api/testing/charging/accounts?search=…&page=1&pageSize=50` | `getAccounts` | `TestingChargingPagedResponse<TestingChargingAccount>` |
| 2 | GET | `api/testing/charging/accounts/{id}/overview` | `getOverview` | `TestingChargingOverview` (KPI grid) |
| 3 | GET | `api/testing/charging/accounts/{id}/wallets` | `getWallets` | `TestingChargingWallet[]` (with buckets) |
| 4 | GET | `api/testing/charging/accounts/{id}/reservations?page&pageSize` | `getReservations` | paged reservations |
| 5 | GET | `api/testing/charging/accounts/{id}/ledger?page&pageSize` | `getLedger` | paged ledger entries |
| 6 | GET | `api/testing/charging/accounts/{id}/balances` | `getBalances` | wallet snapshots + contract summaries |
| 7 | GET | `api/testing/charging/runs?accountId=…&page&pageSize` | `getRuns` | paged commit records |
| 8 | GET | `api/testing/charging/runs/{runId}` | `getRun` | `TestingChargingRun` with full `messages[]` |
| 9 | POST | `api/testing/charging/whatsapp/batches` | `createWhatsappBatch` | new `TestingChargingRun` |
| 10 | POST | `api/testing/charging/whatsapp/batches/{runId}/deliveries` | `triggerDeliveries` | updated run |

- All `accountId` / `runId` params wrapped in `encodeURIComponent(...)`. [CODE] `testing-charging-api.service.ts:37, 44, 88, 101`.
- All responses come back wrapped as `ServiceOperationResult<T>` and pass through `unwrap<T>` → component sees `Observable<T>` directly (no `isSuccessful` branching). [CODE] `:107-109`.
- All requests pass `useGateway()` HttpContext with no specific argument → resolves via `APP_DEFAULT_GATEWAY = Gateway.SystemGateway` (set at `apps/admin-console/src/app/app.config.ts:52`). Interceptor `RuntimeBaseUrlInterceptor` prefixes the base URL. Final URL: `https://<system-gateway-host>/api/testing/charging/...`. [CODE] `runtime-base-url.interceptor.ts:63-80`.
- **6 endpoints fan out in parallel** via `forkJoin` when an account is selected. Worst-case fresh selection = 1 accounts call + 6 detail calls + 1 run-detail = **8 concurrent endpoints touched**. [CODE] `testing-charging.component.ts:202-209`.
- **Backend mapping**: `falcon-int-system-gateway-svc` (System Gateway) → `falcon-core-charging-svc` (Charging Service). [INFERRED] Path `/api/testing/charging/*` is the gateway reverse-proxy prefix; "TestingCharging" is a **feature-flagged controller** behind a YARP route, mounted only when both the gateway and the charging service have `TestingCharging` enabled in their settings. Error-state copy confirms this: *"Verify TestingCharging is enabled in system-gateway and charging settings."* [CODE] `testing-charging.component.ts:129`.

### DTOs
**Admin-only — no mgmt counterpart.** 14 interfaces in `testing-charging.models.ts`: `TestingChargingAccount`, `TestingChargingOverview`, `TestingChargingWallet`, `TestingChargingBucket`, `TestingChargingReservation`, `TestingChargingLedgerEntry`, `TestingChargingBalances`, `TestingChargingRun`, `TestingChargingMessage`, `TestingChargingPagedResponse<T>`, plus 3 request types and the `TestingChargingTab` string-literal union (8 tab ids). [BRAIN-OUT] `testing-charging.00-README.md:21, 36`.

Recent schema motion: `effectiveFromLocalDateTime` / `expiresAtLocalDateTime` / `businessTimeZone` added to `TestingChargingBucket` for account-timezone-aware window edges. [BRAIN-OUT] `testing-charging.00-README.md:14`.

### Gateway
**Admin-only.** SystemGateway → Charging. URL prefix `api/testing/charging/*` (NOT `commerce/*` or `contactgroup/*` — its own internal namespace).

## What changes when copying admin → mgmt

**Not portable — feature design is Falcon-internal.**

Reasoning:
- The feature is explicitly named **Testing Charging Lab** and described in code comments and error banners as an *"internal QA / developer surface that drives the live OCS for a target account end-to-end"*. [CODE] `testing-charging.00-README.md:14` paraphrases the in-component banner.
- Every action **mutates real OCS state** — real reservations, real callbacks. The UI ships a banner warning users about this. [CODE] `testing-charging.component.html:5, 67`. Exposing this to Client users (who own the data being mutated) would be a security and integrity hazard — a tenant could trigger arbitrary charging callbacks against their own wallet to manipulate balances.
- The feature is **feature-flagged behind two backend settings** (`TestingCharging` enabled on system-gateway AND charging service) — explicitly designed as an opt-in dev surface, never a production user feature.
- Sidebar visibility filter pins it to `requiredUserTypes: [FALCON_USER]` and explicitly `hidden: userType === CLIENT_USER`. The mgmt-side route would have to mirror with `requiredUserTypes: [CLIENT_USER]`, which contradicts the entire premise.
- The `walletStrategyAccounts` eligibility filter operates on a Falcon-staff browse of **all client accounts** — Client users have no notion of "browse other accounts". The semantic doesn't translate.
- **No `acc.*` PES resource has ever been seeded for testing-charging** ([CODE] `BuiltInRoleCatalog.cs:171-290` shows zero rules for any `acc.testing.*` / `acc.charging-debug.*` / similar). Adding such resources would require a deliberate authority-model decision; current design rules it out.

If a Client-side debugging surface were ever needed, it would be a **different feature** (read-only "Your wallet activity" / "Your OCS state" page, gated on `acc-owner` only, with no simulator). It would share zero code with `testing-charging` other than perhaps the `TestingChargingBucket` DTO shape.

## Cross-references

- Roles (Falcon-only access): [[../01-roles/sys-admin]] · [[../01-roles/sys-ops]] · [[../01-roles/sys-products]]
- Roles explicitly excluded (mgmt-side has no counterpart route): [[../01-roles/acc-owner]] · [[../01-roles/acc-admin]] · [[../01-roles/acc-user]]
- PES key universe (only `FalconAccess.adminConsole.enter()` is touched, transitively): [[../03-pes-keys/REGISTRY-RAW]]
- Old-UI dataset (admin): `C:\Falcon\Brain Outputs\datasets\old-ui-dataset\10-pages\admin-console\testing-charging\`
- Old-UI dataset mgmt diff: **none** — `C:\Falcon\Brain Outputs\datasets\old-ui-dataset\10-pages\management-console\_diffs\` has no `testing-charging.diff.md`. By construction.
- Sidebar registration: `apps/host-shell/src/app/layout/layout.component.ts:79, 397-405`
- Backend feature flag: `TestingCharging` in `falcon-int-system-gateway-svc` + `falcon-core-charging-svc` configs
- Most-isolated admin-console page (only 2 symbols from `@falcon`: `ServiceOperationResult<T>` and `useGateway()`) — low-risk port template for the new theme. [BRAIN-OUT] `testing-charging.07-CROSS-PAGE.md:71-78`.
