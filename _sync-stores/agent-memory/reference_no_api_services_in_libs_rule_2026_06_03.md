---
name: reference-no-api-services-in-libs-rule-2026-06-03
description: HARD RULE (user-reaffirmed) — never put API-calling/HTTP services inside libs/; they live in the app/feature layer. Libraries are skeletons/DTO-only.
metadata: 
  node_type: memory
  type: reference
  originSessionId: a32bf10b-d381-4298-bcc9-35850712e73a
---

# HARD RULE: No API-calling services inside libraries

**Reaffirmed by Ammar 2026-06-03 ("I told you that before, and it should be saved in the brain").**

- **NEVER** place a service that calls a backend API (injects `HttpClient`/`HttpService`, does `.get()/.post()`, hits a gateway) inside any `libs/` library — e.g. `libs/falcon/**`. This includes `libs/falcon/src/shared-data-access/lib/**`.
- **Libraries are SKELETONS / presentational / pure:** components take inputs + emit outputs; libs may hold DTOs/types, pure helpers, tokens, pipes, directives, UI components — but **NOT HTTP/API services**.
- **API/HTTP services live in the APP/FEATURE layer** (`apps/<app>/src/app/features/<feature>/services/...`). Each feature owns its own API service.
- This matches the existing Falcon doctrine: `[BRAIN-OUT] strategies/falcon-component-creation/01-CANONICAL_PATTERN.md` anti-pattern "Library component injecting an HTTP service → Library components are SKELETONS … never inject anything that calls a backend"; and the "Library = Skeleton, App = API" rule (org-hierarchy-tree wrapper header).

**VIOLATION being corrected:** the wallet-migration **W1** wave "promoted" the donor `wallet-balance-management` `WalletBalanceService` + DTOs into `libs/falcon/src/shared-data-access/lib/wallet/` (alias `@falcon/wallet`). That was WRONG — the service calls the gateway APIs. **Fix 2026-06-03:** move the service back into the wallet FEATURE (`apps/admin-console/src/app/features/new-wallet-balance/`), restore the donor's own service, DELETE `libs/falcon/src/shared-data-access/lib/wallet/`, and remove the `@falcon/wallet` path alias. DTOs may be duplicated per-feature (app layer) rather than shared via a lib service.

**Going forward:** when "sharing" tempts a lib service, instead (a) duplicate the thin service per feature, or (b) put a shared service at the APP level (`apps/<app>/src/app/shared/...`), never in `libs/`. Pure DTOs/types/helpers MAY be shared in a lib, but anything that injects HttpClient/HttpService must not.
