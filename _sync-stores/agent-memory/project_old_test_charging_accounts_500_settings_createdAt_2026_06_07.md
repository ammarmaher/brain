---
name: project-old-test-charging-accounts-500-settings-createdat-2026-06-07
description: Old/Test Charging page accounts list 500 root cause — Commerce Settingss docs polluted with unmapped createdAt/createdBy break strict Bson deserialization
metadata: 
  node_type: memory
  type: project
  originSessionId: f1588852-d6fd-4e5a-8195-22c2b5c24c3f
---

**Old Test Charging** (and the new **Testing Charging**) admin page 500s on load. Both FE services (`old-test-charging-api.service.ts` / `testing-charging-api.service.ts`) are byte-identical and call `GET :7256/api/testing/charging/accounts?search=&page=1&pageSize=50` → System Gateway `TestingChargingAccountsEndpoint` ([CODE] `falcon-int-system-gateway-svc/.../TestingCharging/TestingChargingEndpoints.cs:72`) which (uniquely among testing endpoints) forwards to **Commerce** `GET testing/accounts`, NOT Charging.

ROOT CAUSE (runtime-verified via `docker logs falcon-commerce-1`): `System.FormatException: Element 'createdAt' does not match any field or property of class Falcon.Commerce.Domain.Entities.Settings.Settings` at [CODE] `TestingListAccountsHandler.cs:line 64` (`LoadWalletStrategySettingsAsync` → `settingsRepository.GetAsync(...)` with **no projection** → loads the FULL `Settings` entity). The `Settings` entity ([CODE] `Falcon.Commerce.Domain/Entities/Settings/Settings.cs`) maps ONLY `_id, ownerId, securitySettings, quotaSettings, walletSettings` and — unlike EVERY sibling entity (Node, Application, Contract, WalletConfiguration, QuotaConfiguration, SecurityConfiguration all have it) — is **MISSING `[BsonIgnoreExtraElements]`**. There is NO global ignore-extra-elements convention in Commerce. So any Settings doc with an unmapped field fails strict deserialization → GlobalExceptionHandler → 500.

DATA TRIGGER: Mongo `FalconCommerceDB.Settingss` (collection name has double-s) = 42 docs, **24 carry top-level `createdAt` + `createdBy`** (keys: `_id, ownerId, createdAt, createdBy, walletSettings`). Those 24 ownerIds are EXACTLY the wallet-type test-bed clients `690000000000000000d10001`–`d10024` seeded 2026-06-06/07 ([[project_wallet_transfer_restore_24client_testbed_2026_06_07]]). The seed wrote `createdAt`/`createdBy` that the domain model doesn't expect. "Main works fine" = NOT a code-branch diff (origin/main `Settings.cs` is byte-identical, attribute never existed per `git log -S`) — it's purely DATA: main/clean DBs have no polluted Settingss docs.

BLAST RADIUS: only code paths that load the **full** `Settings` entity for these accounts break. Handlers that PROJECT a field are safe (`ActivateFalconServiceHandler:112` `s=>s.WalletSettings`; `TestingListAccountsHandler:35` `setting=>setting.OwnerId`). Full-entity loaders are at risk (`TestingListAccountsHandler:195`, check CreateContract/UpdateContract/GetSettings/GetAccountHierarchy).

FIX OPTIONS (not yet applied — diagnosis only): (A, recommended, permanent) add `[BsonIgnoreExtraElements]` to `Settings` class → 1-line, matches codebase convention, fixes all consumers, needs commerce rebuild+redeploy. (B, immediate unblock) `db.Settingss.updateMany({},{$unset:{createdAt:"",createdBy:""}})` — no rebuild but recurs on re-seed. (C, prevent recurrence) fix the 24-client seed script to stop writing createdAt/createdBy into Settingss. Best = A + C; B to unblock now. Mongo creds root:example, DB FalconCommerceDB, container falcon-mongo-1.
