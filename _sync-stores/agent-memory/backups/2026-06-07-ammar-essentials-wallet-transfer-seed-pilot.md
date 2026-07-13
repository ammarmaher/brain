---
name: Session Backup - Wallet balance-transfer test-data seed (pilot)
description: Root-caused accowner wallet 500; built+verified ONE pilot client (NodeBased+Multiple) end-to-end; designed the 24-client matrix. Awaiting go to scale.
type: project
agent: ammar-essentials
date: 2026-06-07
status: in-progress
---

## What Was Done
- **ROOT-CAUSED the accowner wallet 500** (live, with code+log evidence). NOT a FE bug — a seeding/identity mismatch.
  - `[CODE] GetAccountHierarchyHandler.cs:46` throws `System.FormatException: 'test-tenant-001' is not a valid 24 digit hex string.`
  - `[CODE] GetAccountHierarchyEndpoint.cs:40-44` (core-gateway) forwards the **JWT tenantId** to commerce `accounts/hierarchy?accountId={tenantId}` and the code comment explicitly says the route id "must not be used as Commerce accountId". Proven live: all 3 route ids (test-tenant-001 / a11001 hex / BMW hex) returned identical 500 with accowner's token, while mercedes-owner (hex tenantId) returns 200.
  - accowner identity record: `tenantId:"test-tenant-001"` (NON-hex), `nodeId:ObjectId("000000000000000000a11001")`. Commerce `Node.Id` is `[BsonRepresentation(ObjectId)]` → non-hex tenantId can't render → throw.
  - VERDICT: fix is SEEDING — new test clients must use **ObjectId-style hex tenantIds** (Main node `_id == ObjectId(tenantId)`), exactly like brand accounts `690000000000000000c1000X` and clean-client `c10009`. No backend `.cs` change, no FE change needed for the 24 new clients.
- **Confirmed both mode axes are pure data** (no backend change): `GetAccountHierarchyHandler.cs:56-66` derives CanSave/walletType/walletBalanceType from Commerce `Settingss.walletSettings`; charging `GetAccountWalletsHandler.cs:69` derives ownerWalletType from `wallet_strategy_read_model.balanceOwnerType`.
- **Built 2 new idempotent seed scripts** (data only, no repo commit):
  - `C:\Falcon\Falcon\Falcon\falcon-essentials\seed\seed-wallet-transfer-pilot.js` (commerce Nodes/Settingss/Tenants + charging strategy/wallets/snapshots)
  - `C:\Falcon\Falcon\Falcon\falcon-essentials\zitadel\seed-wallet-transfer-pilot-users.sh` (mirrors seed-toyota-users.sh: Zitadel human/_import + Identity Users + metadata + OTP + PES g-link + 245 p-rules)
- **PILOT client seeded + FULLY VERIFIED** (NodeBased + MultipleWallets):
  - tenant `690000000000000000d10001` "Wallet Pilot NM"; Main + 2 sub-nodes North `690000000000000000d1a001` / South `690000000000000000d1a002`; channels WhatsApp/Voice/AI.
  - 3 users (pwd `Admin@1234`): **pilot-nm-owner** (acc-owner, zuid 376287562395811849), **pilot-nm-admin** (acc-admin, 376287568905371657), **pilot-nm-user** (acc-user, 376287575364599817).
  - balances: master 100000 (WA 5000 / Voice 3000 / AI 200); North WA4000 V2500 AI1500; South WA1800 V50 AI600.
  - VERIFY: (a) `:7038` mgmt hierarchy 200 with all balances; `:7256` admin hierarchy 200 too. (b) all 3 logins stage 4. (c) PES `acc.wallet-balance/view`+`/transfer` true, `app.management-console/view` true, per-pair **kebab** keys `transfer-owner-owner`/`-master-owner`/`-channel-owner` all true (matches brand Mercedes). (d) REAL transfer master-WA→North-WA 500 → HTTP 200 success, balances moved 5000→4500 / 4000→4500, re-seed restored baseline.

## What Remains
- **SCALE to 24 clients** (NOT done — user asked to pilot one then report). Matrix block = `690000000000000000d10001`..`d10024` (d1 block, distinct from c1 brands). 6 clients per mode × 4 modes (NodeBased/UserBased × Single/Multiple). Each: owner/admin/user + 2 sub-nodes (+ funded users for UserBased) + balances.
- Live FE click-through (login policy) — script-level only so far.

## Key Decisions
- New tenant id block = `d1` (ObjectId-style hex) to avoid the non-hex 500 and not collide with c1 brands.
- Reused the proven `seed-wallet-e2e.js` wallet-key conventions verbatim (ACCOUNT/NODE/USER:{id}:{CH|ALL}:SAR + snapshot).
- UserBased clients: must seed `USER:{identityUserId}:ALL:SAR` wallets keyed on Identity Users `_id` hex + flip strategy.balanceOwnerType=2 + Settingss.walletBalanceType=2 (gateway pulls users via Identity `user/by-tenant?WalletOwnerOnly=true`).

## Files Changed
- NEW `falcon-essentials/seed/seed-wallet-transfer-pilot.js`
- NEW `falcon-essentials/zitadel/seed-wallet-transfer-pilot-users.sh`
- (no commits, no backend edits)

## Context for Next Agent
- Charging `/api/wallet/transfer` (:7224) now **requires a Bearer token** (401 without; 200 with owner JWT). Request shape `{amount,currency,description,source:{walletId,channelId},destination:{walletId,channelId}}`.
- Hierarchy response top-level keys: `accountInfo, channels, summary{masterWalletId,totalBalance,channelWallet[]}, node{...children[]}, canSave`. Node per-channel balances in `node.channelBalances` (id→balance). NO `walletType/ownerWalletType` field surfaces at top level (it's implicit in shape).
- charging container shows "unhealthy" but serves fine (login/hierarchy/transfer all worked).
- To scale: loop the two scripts per tenant with parameterized name/mode/subnodes; the users script already takes `PILOT_TENANT_ID` env. The js needs templating per tenant (TID/NAME/mode/subnode-matrix).
