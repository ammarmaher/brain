---
name: project_falcon_wallet_lib_deleted_localized_2026_06_03
description: "The @falcon/wallet shared lib was DELETED and its wire contract localized into each app's wallet-balance-management/modules/modules.ts; admin flipped 12 imports, mgmt drift-guard test removed, tsconfig alias removed; vitest 682/682 + lint green; build deferred; NO COMMITS."
metadata: 
  node_type: memory
  type: project
  originSessionId: 1aa42bdc-855a-456e-ba6d-a896eada9375
---

Decoupled and deleted the shared **`@falcon/wallet`** lib (`libs/falcon/src/shared-data-access/lib/wallet/` — index.ts + wallet-balance.models.ts + transfer.models.ts) at the user's request; each app now owns its wallet wire contract locally.

**What changed (branch polishing-v0.4, all UNCOMMITTED):**
- **admin-console** was the only real consumer (mgmt had already forked locally). Appended the FULL wire contract (both lib files, VERBATIM, cross-file import dropped) under a "WALLET WIRE CONTRACT" banner into `apps/admin-console/src/app/features/wallet-balance-management/modules/modules.ts` (now 53 exports = wire contract + the pre-existing `Wb*` view types; no name collisions — `WalletStructure` const+type pair is intentional). Flipped all **12** admin importers from `'@falcon/wallet'` → `'../modules/modules'` (6 prod: services/wallet.service, services/wallet-balance.service, data/wallet-query, data/map-wallet-data, data/transfer-request, validations/validations; 6 specs). 4 of them now have two `../modules/modules` import lines (Wb* + wire) — harmless, ESLint has NO no-duplicate-imports rule.
- **management-console** needed no copy — its `wallet-balance-management/modules/modules.ts` §1 already re-implements the (subset) contract and production imports only local. Deleted its ONLY shared-lib consumer: `__tests__/wire-contract-compat.spec.ts` (the drift-guard; meaningless once the SoT is gone).
- Removed the `@falcon/wallet` path alias from `tsconfig.base.json`.

**Verification (with a dev server live, so build deferred):** vitest `wallet-balance-management` filter = **682/682 tests, 26 files green** (both apps, incl. admin's contract-lock spec running against the local copy); ESLint on the 13 changed .ts files = **0 errors/0 warnings** (`--max-warnings=0`). Webpack-MF build DEFERRED — `nx serve host-shell` was live on 4200/4204/4301 and building corrupts static remotes (did not kill the user's server). Standalone `tsc` is NOT a usable gate here (pre-existing FE-GATE02-MODRES floods it).

**Backup:** the 3 untracked lib files copied to `C:\Falcon\plans\_wallet-lib-backup-2026-06-03` before deletion.

**Caveats / residual:** (1) Build still un-run. (2) Stale doc-comments carried over verbatim into admin modules.ts (lines ~132-149, 463) + several admin files still say "from @falcon/wallet" in prose — cosmetic, optional cleanup. (3) Architectural: with the shared SoT gone, admin's and mgmt's copies can now silently drift from each other + the backend C# enums (the drift-guard that protected this is deleted) — consider a cross-app parity test if drift is a concern.

**⚠️ Working-tree reality:** the wallet feature folder on disk is **`wallet-balance-management`** in BOTH apps; `new-wallet-balance` is gone because it was RENAMED to wallet-balance-management — see [[project_new_wallet_balance_renamed_wallet_balance_management_2026_06_03]] (that rename was mid-flight during this session's first turns, which is why files appeared to "vanish" between reads). The tree had ~340 uncommitted changes; HEAD `dff8dcae` contains NEITHER the feature NOR the lib — all wallet work is uncommitted. Treat disk as authoritative. Related [[reference_wallet_backend_integration_contract_2026_06_02]] · [[reference_504_admin_console_mf_duplicate_servers_2026_05_31]].
