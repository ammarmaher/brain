---
type: page-dataset
app: admin-console
feature: testing-charging
source: origin/main @ 803ac1d1
extracted: 2026-05-16
extracted-by: deep-dive-agent-P6
---

# Testing Charging Lab

## TL;DR

[CODE] An internal Falcon-user-only QA / developer surface that drives the live OCS (Online Charging System) for a target account end-to-end: it lists accounts that have a wallet strategy configured, surfaces every OCS sub-system (overview, wallets, buckets, reservations, ledger, balances, commit-record runs), and ships a WhatsApp Simulator that creates real OCS reservations, then lets QA trigger Delivered/Failed/Mixed commit/release callbacks. Every action mutates real OCS state — the UI is a thin pass-through over a dedicated admin "Testing Charging" subsystem proxied through `api/testing/charging/*`. The recent `add localdatetime to test charging model` commit added `effectiveFromLocalDateTime` / `expiresAtLocalDateTime` / `businessTimeZone` to the bucket DTO so QA sees account-timezone-aware window edges next to the UTC timestamps.

## Manifest

- [[01-ROUTING]] — 1 route (`/admin-console/testing/charging`), 1 inherited guard (`adminConsoleGuard`), no local `shellAccessGuard`
- [[02-COMPONENTS]] — 1 standalone component (`TestingChargingComponent`), no sub-components — the entire page is rendered inline with 8 tab panels in a single template
- [[03-SERVICES-APIS]] — 1 service (`TestingChargingApiService`), 10 HTTP endpoints under `api/testing/charging/*`, all routed via `useGateway()` → System Gateway
- [[04-DTOS]] — 14 request/response/state interfaces in `testing-charging.models.ts`
- [[05-PES]] — 0 in-feature permission keys; 1 inherited gate (`FalconAccess.adminConsole.enter()` via `adminConsoleGuard`); 1 nav-level visibility rule (Falcon-user-only)
- [[06-VALIDATIONS]] — 0 reactive/async validators; 7 template-level `min`/`max` constraints + 1 derived guard (`canCreateBatch`) + 1 strategy filter on account list
- [[07-CROSS-PAGE]] — 5 inbound deps (`@falcon` lib types + interceptor + facades), 0 outbound contributions, 0 shared state writes — fully isolated
- [[08-RULES-APPLIED]] — 9 patterns observed (4 good, 5 night-shift anti-patterns)

## Source files

| File | Role |
|---|---|
| `apps/admin-console/src/app/features/testing-charging/testing-charging.component.ts` | Standalone container component (~414 LOC) — accounts list, tab orchestration, simulator state, OCS state aggregation |
| `apps/admin-console/src/app/features/testing-charging/testing-charging.component.html` | Inline 346-line template — accounts aside, 8 tab panels, simulator form |
| `apps/admin-console/src/app/features/testing-charging/testing-charging.component.scss` | 320-line scoped SCSS with hand-rolled palette (greens / cream / amber) |
| `apps/admin-console/src/app/features/testing-charging/services/testing-charging-api.service.ts` | Singleton HTTP client wrapping 10 endpoints + `ServiceOperationResult<T>` unwrap |
| `apps/admin-console/src/app/features/testing-charging/models/testing-charging.models.ts` | 14 TS interfaces (account / overview / wallet / bucket / reservation / ledger / balances / run / message / requests) |
| `apps/admin-console/src/app/features/routes.ts:62-75` | Route definition (nested `path: 'testing'` → `path: 'charging'`) |
| `apps/admin-console/src/app/app.routes.ts:1-19` | App-level wrapper that applies `adminConsoleGuard` to all admin-console routes |
| `apps/admin-console/src/app/app.config.ts:52` | `provideAppDefaultGateway(Gateway.SystemGateway)` — every `useGateway()` call lands on System Gateway |
| `apps/host-shell/src/app/layout/layout.component.ts:79, 397-405` | Sidebar nav entry — `Testing Charging Lab`, scope = `AdminConsole`, `requiredUserTypes: [FALCON_USER]`, hidden for client users |
