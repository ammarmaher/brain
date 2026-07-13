---
name: project_commerce_applications_500_translatehelper_nre_2026_06_06
description: "Root cause + fix for the admin-console GET /commerce/Node/{id}/applications 500 (TranslateHelper NRE on null subTitle/description); plus the latent UserType.Value line-69 bug and how to read commerce backend stack traces."
metadata: 
  node_type: memory
  type: project
  originSessionId: 1c474d5d-980a-43ea-9afa-5af0285ed1c1
---

**Symptom (2026-06-06):** Admin console (System GW :7256) → Contracts/Addons page → `GET http://localhost:7256/commerce/Node/{id}/applications` returns **500**, while `comm-channels/visible` returns 200. User: "worked before."

**ROOT CAUSE (runtime-verified via `docker logs falcon-commerce-1`):** `System.NullReferenceException` in `TranslateHelper.GetTranslation(ITranslate)` (`Falcon.Commerce.Application/Services/Helpers/TranslateHelper.cs:19` — does `translate.En`/`.Ar` with **no null check**), called from `GetAccountApplicationsHandler.cs:50-56` which translates `Name`+**`SubTitle`+`Description`**. The dev DB `FalconCommerceDB.Applications` catalog has **8 docs with `name` populated but `subTitle`/`description` = null** → `GetTranslation(null)` → NRE → 500. `visible` survives because it only translates `Name` (populated) and is null-safe. **Why now:** commit `62a23f7 "add services fields requried for card view"` (in branch `feature/contract-quota-consumed-on-detail`) is the SINGLE commit that added SubTitle/Description translation to the handler; the 8 catalog docs ("Survey Pro","Workflow Builder","Analytics Suite","Form Builder","Reporting Hub","AI Assistant"...) do NOT match the 3-app seeder `SeedData.GetApplications()` (which DOES set subTitle/description) — they were loaded by an older/custom seed (name-only). New code reads a field the old data never had.

**FIX APPLIED (UNCOMMITTED, 2026-06-06):** (1) **code** — null-guard `GetTranslation` (`if (translate is null) return null;`) + made param `ITranslate?` in both `TranslateHelper.cs` and `ITranslateHelper.cs`; (2) **data** — backfilled `subTitle`+`description` ({en,ar}) on all 8 `Applications` docs via mongosh. Restarted `falcon-commerce-1` (→ recompiled; seeder is **seed-if-empty** `DatabaseSeeder.cs:53` so backfill persists). VERIFIED: NRE gone (log signature shifted line-50→line-69), 0 docs missing fields, /health green. Authenticated 200 reasoned (not end-to-end clicked) — user to refresh browser.

**STILL-OPEN / latent (FLAGGED, not fixed):**
- **Line-69 `_currentUser.UserType.Value`** (`GetAccountApplicationsHandler.cs:69`) throws `InvalidOperationException` when `UserType` is null. The GET endpoints have **NO `[Authorize]`** (only PUTs do), so a token-less / unvalidated-claim request 500s instead of 401. `UserType` = parsed from `user-type` JWT claim (`SessionProvider.cs:81`), via `ZitadelClaimsTransformation` decoding `urn:zitadel:iam:user:metadata`. Real authenticated Falcon admin = fine. Fix needs a design call (add `[Authorize]` vs guard null→Client/skip).
- Charging `GET http://charging:8080/wallet/contract-balance-summaries` returns **404** (caught → "returning contract without consumed values", contracts still 200). Separate non-fatal issue from the quota-consumed feature.

**REUSABLE DEBUGGING FACTS (this env):**
- ALL backend svcs run in **Docker** (`falcon-commerce-1` :7045→8080, `falcon-system-gateway-1` :7256, `falcon-zitadel-1` :8080, etc.); host mount `C:\Falcon\Falcon -> /workspace`; commerce CMD = `dotnet run` (NO hot-reload → `docker restart` to apply code).
- Serilog = **Console sink only** → backend stack traces are in **`docker logs <container>`** (no file logs).
- Mongo: connect with **`directConnection=true`** (rs0 advertises a docker-internal host → plain rs URI times out from host): `mongodb://root:example@localhost:27017/?directConnection=true&authSource=admin`. Commerce fields serialize **camelCase** (`name`,`subTitle` with nested `en`/`ar`).
- Gateway `/commerce/{**}` is a **YARP proxy** with `AuthorizationPolicy: FalconOnly`, strips `/commerce` + prepends `/api`, forwards JWT (`JwtForwardingHandler`). Commerce validates JWT independently (`ZitadelExtensions`, `AuthorityDomain=http://localhost:8080` issuer / `BackchannelDomain=http://zitadel:8080` JWKS).

Related [[project_contracts_cost_reskin_2026_06_04]] · [[reference_wallet_backend_integration_contract_2026_06_02]].
