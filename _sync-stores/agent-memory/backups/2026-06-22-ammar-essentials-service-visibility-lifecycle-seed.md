---
name: session-backup-service-visibility-lifecycle-seed-s1-s8-for-org-hierarchy-apps-commchannels-fix-e2e
description: "New idempotent mongosh seed loading every service lifecycle state onto test-tenant-001 (both kinds), wallet funded, S7 Pending orders, backup of replaced services; verified new commerce branch is live via per-row canHide."
metadata: 
  node_type: memory
  type: project
  agent: ammar-essentials
  date: 2026-06-22
  status: completed
  originSessionId: 8e361e5c-e98d-42c7-889a-5e46e1d71a15
---

## What Was Done
- Authored + ran + verified a NEW seed: `C:\Falcon\Falcon\Falcon\falcon-essentials\seed\seed-service-visibility-lifecycle.js` (+ wrapper `run-service-visibility-lifecycle.sh`). NO app-source change, NO commits.
- Confirmed the running `falcon-commerce-1` executes the branch `fix/commerce-service-visibility-status-preserve` working tree: container = `mcr.microsoft.com/dotnet/sdk:10.0`, `WorkingDir=/workspace/falcon-core-commerce-svc`, `command: dotnet run --project src/Falcon.Commerce.Api/...`, volume `..:/workspace` (host `C:\Falcon\Falcon` → `/workspace`). Gateways route by docker DNS `http://commerce:8080` → `falcon-commerce-1` (NOT the parallel `pr42316-commerce-main` on :7046).
- Loaded S1..S8 onto ONE node (test-tenant-001 `000000000000000000a11001`) for BOTH `applications[]` and `commChannels[]`. Backed up the node's prior services ONCE into `FalconCommerceDB.Nodes_visibility_lifecycle_backup` (`_id=000000000000000000a11001`; original = 8 apps + 9 channels). Inserted 2 deterministic Pending Orders for S7. Funded master wallet 50000 SAR. Purged stale Paid/Failed orders on the node.

## Verification (proves seed AND new backend live)
- Falcon JWT: `POST http://localhost:7777/api/auth/login {username:"sysadmin",password:"Admin@1234"}` → `result.tokens.accessToken` (JWT metadata `user-type:"MQ"` = Falcon=1).
- `GET http://localhost:7256/commerce/Node/000000000000000000a11001/comm-channels` (9 rows) and `/applications` (8 rows): per-row **canHide ALL PASS** both kinds — S1 F, S2 T, S3 F, S4 F, S5 F, S6 F, S7 T, S8 F.
- **S3 canHide=FALSE is the live-code proof**: S3 = visible + InActive + FirstActivationDate set. New `CanHide()=Visibility && IsFirstActivation()` → false. OLD code (status-only) would have returned true. Combined with S2/S7 (first-time InActive) = true, this confirms the new domain method is executing.
- PUT probes (throw before DB write → state intact): hide S7-app + S7-chan → **422 CannotHideServiceWithTheCurrentStatus** (order-guard); hide S3-app → 422 (new domain block). Wallet still 50000 SAR after probes; node rows unchanged.

## Key Decisions
- Reused the canonical test-tenant-001 node (a11001) rather than create a new account: it is the ONLY node both the Falcon sys-admin (admin org-hierarchy, sees all accounts) and the account-owner (mgmt console, bound to a11001) can reach, and `tenantId == node _id` so the order-guard (`Order.mainNodeId == command.AccountId == node _id`) keys cleanly.
- Wrote a dedicated `svc()` that does NOT coerce visibility for status:None (unlike seed-service-scenarios.js), so S8 (hidden + Active, legacy/corrupted) can be seeded exactly.
- Order-guard: `Order.mainNodeId` (BSON) maps to `Order.AccountId`; `status` enum Pending=1/Paid=2/Failed=3; only Pending|Paid gate a hide. Seeded Pending(1) for S7.
- Purge ALL non-S7 orders on the node (not just S7-itemId matches): prior do-payment runs left Paid/Failed orders on other catalog ids (e.g. S2 chan `…d0de` had a Paid order that would wrongly block the S2 hideable case).

## Files Changed
- NEW `C:\Falcon\Falcon\Falcon\falcon-essentials\seed\seed-service-visibility-lifecycle.js`
- NEW `C:\Falcon\Falcon\Falcon\falcon-essentials\seed\run-service-visibility-lifecycle.sh`
- DATA (Mongo, FalconCommerceDB): `Nodes` (_id a11001 applications[]+commChannels[]), `Orders` (2 Pending + purged rest on node), new `Nodes_visibility_lifecycle_backup`. (FalconChargingDB): `wallets` + `wallet_balance_snapshots` master wallet funded 50000.

## Context for Next Agent
- Test NODE: `000000000000000000a11001` ("Test Tenant 001").
- State→serviceId (idx0..7, full id = `695a304f901bb7d4a830<suffix>`): S1 d0dc/d0e2 · S2 d0dd/d0de · S3 d0e1/d0e3 · S4 d100/d110 · S5 d101/d111 · S6 d102/d112 · S7 d103/d113 · S8 d104/d114 (app/chan). Catalog: 8 Applications, 9 CommunicationChannels (index 8 Apple Business Chat unused).
- Logins (Admin@1234): `sysadmin` (Falcon, admin console / system-gateway :7256), `accowner` (acc-owner @ a11001, mgmt console / core-gateway :7038). Identity :7777.
- Pre-test wallet balance to assert unchanged after any toggle: **50000 SAR** at `ACCOUNT:000000000000000000a11001:ALL:SAR`.
- Backup of replaced services: `FalconCommerceDB.Nodes_visibility_lifecycle_backup` (_id a11001). Restore snippet is printed by the wrapper's tail.
- States all seeded; none failed. Re-run is idempotent (backup is guarded, orders converge on deterministic ids, wallet delete+insert).
- For a CLIENT-eye check (accowner via :7038): the client GET filters to node rows only and hides not-shown rows; canHide is still on the payload. The admin/Falcon view (:7256) is the authoritative full-matrix surface.
