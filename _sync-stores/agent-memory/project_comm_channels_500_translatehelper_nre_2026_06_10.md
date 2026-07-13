---
name: project_comm_channels_500_translatehelper_nre_2026_06_10
description: "GET /commerce/Node/{id}/comm-channels 500 for EVERY node — TranslateHelper NRE on null SubTitle/Description — FIXED backend-only (null-safe GetTranslation + 7 tests), live-verified 200 on 2026-06-10; NOT committed"
metadata: 
  node_type: memory
  type: project
  originSessionId: 89dbdb45-cadf-4fca-a144-15b2e1809a19
---

# comm-channels 500 — root cause (2026-06-10, claude, read-only investigation)

**Symptom:** Admin console "Communication & Services" tab → `GET http://localhost:7256/commerce/Node/{nodeId}/comm-channels` → **500 for EVERY node id** (verified in logs for `000000000000000000a11001`, `6a0aeb8abe28a563d80b472e`, `690000000000000000c10001`, `c10003`). Port 7256 = falcon-system-gateway → YARP → `commerce:8080/api/Node/{id}/comm-channels`.

**Root cause (code × data):**
1. **[CODE]** `falcon-core-commerce-svc/src/Falcon.Commerce.Application/Services/Helpers/TranslateHelper.cs:19` — `GetTranslation(ITranslate translate)` does `translate.En` with NO null check → `NullReferenceException` when passed null ("en" culture branch; runtime stack confirms line 19).
2. **[CODE]** `GetAccountCommunicationChannelsHandler.cs:55-58` calls `GetTranslation(channel.Name/SubTitle/Description)` unconditionally, but entity `CommunicationChannel.cs` marks `SubTitle`/`Description` `[BsonIgnoreIfNull]` = optional → null after deserialization when field absent.
3. **[DATA]** Mongo `FalconCommerceDB.CommunicationChannels`: **all 9 docs missing `description`; 5 of 9 (Email Relay, Push Notifications, RCS Messaging, Telegram Bot, Apple Business Chat) also missing `subTitle`**. Fields were deliberately `$unset` by `falcon-essentials/seed/seed-service-scenarios.js:176-184` (comment block :144-148: "We CLEAR description (so the FE i18n SoT text wins)…") — author checked the handler's card-count logic but missed the GetTranslation NRE on the backend read path.
4. **Why every node:** handler loads ALL catalog channels (`GetListAsync(_ => true)`); for Falcon users `isFalconUser=true` bypasses the `nodeChannel is null → continue` skip → first doc (WhatsApp, has subTitle, no description) throws on `Description = GetTranslation(null)` → GlobalExceptionHandler → 500. Node id is irrelevant.
5. **Why `/applications` (same tab) returns 200:** `Applications` docs all still HAVE subTitle+description (8/8 verified in Mongo) — something re-populated apps after the scenario seed; channels were never repaired.

**Runtime evidence:** every comm-channels proxy line in system-gateway logs pairs with a commerce ERR `NullReferenceException at TranslateHelper.cs:19 ← GetAccountCommunicationChannelsHandler.cs:52 ← NodeController.cs:145` at the same timestamp (13:54:50, :52, 13:55:01/:04/:10/:44 on 2026-06-10). Controller line 145 matches local code = deployed image is current; release-PDB attributes the whole object-initializer to handler line 52.

**Blast radius (latent, same pattern):** ~10 handlers call `GetTranslation(x.SubTitle/Description)` without null check — `GetVisibleCommunicationChannelDetailsHandler.cs:73-76` (mgmt-console marketplace details for nodes WITH channels), `ChangeCommunicationChannelPriceType/Value`, `DeleteCommunicationChannelNewPriceType/Value`, `GetAccountApplicationsHandler` (safe only because app data intact). `ListCommunicationChannelHandler` (Add-Client wizard) only reads `Name` → works.

**FIX APPLIED (2026-06-10, backend-only, user-approved, NOT committed):**
- Decision: fix belongs 100% BACKEND. FE untouched — FE contract already types `subTitle/description: string | null` (`service-pricing-table/models/models.ts:53-54`); null is the seed's intended design (FE i18n supplies text by name).
- [CODE] `TranslateHelper.GetTranslation` now takes `ITranslate?` and returns null for null input (guard BEFORE culture switch; NotSupportedException for unknown cultures kept). `ITranslateHelper` signature widened to match. Single choke point → heals all ~10 latent call sites (visible/details, price-type/value change/delete, etc.).
- NO data repair: leaving `description`/`subTitle` absent is valid per the seed-service-scenarios.js design; backend now honors the entity's `[BsonIgnoreIfNull]` contract.
- Tests: NEW `tests/.../Application/Helpers/TranslateHelperTests.cs` (6 cases: en/ar values, null→null ×3 cultures, unsupported-culture throws) + NEW regression in `GetAccountCommunicationChannelsHandlerTests` using the REAL TranslateHelper on a bare channel (mock was null-safe `n?.En ?? ""` — more forgiving than prod code, which is WHY tests never caught it). Targeted suites 15/15 GREEN; full suite 436/444 — the 8 fails are NOT mine (7 pre-existing AddressTests + 1 ChangeNodeNameHandlerTests owned by the PARALLEL session's in-flight NodeName regex task).
- Deploy: commerce container runs `dotnet run` over bind-mounted local source (`compose: volumes ..:/workspace`) → `docker compose restart commerce` recompiles; no image rebuild.
- LIVE-VERIFIED: login `FalconAdmin`/`Admin@1234` (identity :7777 `/api/auth/login` → `result.tokens.accessToken`) → `GET :7256/commerce/Node/690000000000000000c10001/comm-channels` = **200, 9 channels** (4 with subTitle, 5 bare, null description everywhere) AND `/comm-channels/visible/details` = **200, 9 items** (same fix heals it).
- **DRAFT PR 42324** (user-requested): https://t2development.visualstudio.com/DefaultCollection/Falcon/_git/falcon-core-commerce-svc/pullrequest/42324 — branch `fix/comm-channels-null-safe-translation` (commit 33a012f) → `main`, ONLY the 4 fix files (built in a TEMP worktree off origin/main so the parallel session's NodeName edits stayed out; 15/15 targeted tests re-run GREEN on the main base before push). PR-creation recipe: no az CLI → `git credential fill` (must pipe via BASH; PS5.1 mangles stdin encoding) → ADO REST `POST .../_apis/git/repositories/{repo}/pullrequests?api-version=7.1` with `isDraft:true`.

Related: [[project_wallet_transfer_restore_24client_testbed_2026_06_07]] (the seed-service-scenarios.js origin), [[project_clean_client_one_owner_created_2026_06_06]].
