---
name: session-backup-wallet-balance-mng-full-e2e-seed-both-consoles
description: Idempotent seed making the wallet page fully transfer-testable for admin + mgmt; live-API + real-transfer verified
metadata: 
  node_type: memory
  type: project
  agent: ammar-essentials
  date: 2026-05-29
  status: completed
  originSessionId: ec388185-676b-461f-8e96-12da072b241b
---

## What Was Done
Wrote + ran a NEW idempotent seed `C:/Falcon/Falcon/Falcon/falcon-essentials/seed/seed-wallet-e2e.js`
(layers on top of `seed-service-scenarios.js` + `seed-big-data.js`; does NOT modify either) that makes the
Wallet & Balance .Mng page fully end-to-end testable for BOTH consoles across the whole WAVE1 transfer matrix.

Verified live against the running 18-container stack (commerce/core-gw :7038, system-gw :7256, charging :7224,
auth :7777) and executed THREE real money transfers (all HTTP 200).

### Mode matrix (seeded + documented)
| Account | id | Strategy | Notes |
|---|---|---|---|
| Mitsubishi | c10001 | SingleWallet + NodeBased | funded node tree (master 100k; Sales 25k, Marketing 12k, Operations 40k, Field Sales 5k …); 11 funded nodes |
| Honda | c10002 | SingleWallet + **UserBased** | FLIPPED from NodeBased. 8 funded USER wallets (honda-owner 8000 / -nodeadmin 4500 / -user 1 + 5 display); 34 users wallet-less (Disabled rows). Master kept 1 SAR so the do-payment InsufficientFunds scenario survives. |
| Mercedes | c10003 | **MultipleWallets + NodeBased** | CANONICAL multi-wallet demo (both consoles). |
| Toyota | c10004 | (none) | WalletNotConfig — left untouched. |

### The actual fix (Mercedes)
Mercedes nodes rendered "N/A" because they had NO per-node per-channel wallets. Seeded
`NODE:{nodeId}:{channelId}:SAR` (ownerType=3) on the first 3 departments (Sales/Marketing/Operations):
- Sales: Voice 4000 / WhatsApp 2500 / AI 1500 (response order varies — see below)
- Marketing: 1800 / 1200 / 600
- Operations: 3000 / 50 / 900  ← the 50 is an intentional insufficient-on-one-channel case
Master `ACCOUNT:c10003:ALL` = 10; master per-channel `ACCOUNT:c10003:{ch}` = Voice 3000 / WhatsApp 5000 / AI 200.
Master-channels use upsert (authoritative reset each run); node + user wallets use delete+insert (idempotent).

### Wallet-key → gateway-response map (CODE-verified)
`GetAccountWalletsHandler.cs` (charging) + `AccountHierarchyMapper.cs` (both gateways):
- `ACCOUNT:{acct}:ALL:SAR`      → `summary.masterWalletId` + `summary.totalBalance`
- `ACCOUNT:{acct}:{channel}:SAR`→ `summary.channelWallet[]` (master per-channel)
- `NODE:{node}:{channel}:SAR`   → `node.channelBalances[].walletId/balance` (Multiple mode)
- `NODE:{node}:ALL:SAR`         → `node.balance` (SingleWallet node row)
- `USER:{userId}:ALL:SAR`       → user row balance (UserBased; userId = Identity Users `_id` hex)
- ownerWalletType = User iff `wallet_strategy.balanceOwnerType==UserBased(2)`, else Node(3).
- A funded bucket must be ContractFunded(1) + Active(1) + effectiveFrom ≤ now ≤ expiresAt (use -30/+335 days).
- Gateway fetches Charging balances ONLY when `commerce CanSave==false`; `CanSave==(walletSettings is null)`.
  So every funded account needs Commerce `Settingss.walletSettings={currency,walletBalanceType,walletType}`.

### Real transfers executed (POST :7224/api/wallet/transfer — charging svc is exposed directly on host)
- B5 node→node same-ch: Mercedes Sales WhatsApp(4000)→Marketing WhatsApp(1800) 1000 → 200 (Sales→3000, Marketing→2800)
- B1 master→channel:     Mercedes master WhatsApp(5000)→Sales WhatsApp 500 → 200
- A2 user→user single:   Honda honda-owner(8000)→honda-nodeadmin(4500) 2000 → 200
Re-ran the seed afterward → balances restored to documented baseline (idempotent).

## What Remains
Nothing required for the seed. ONE backend-code gap flagged below (out of this task's seed/PES scope).

## Key Decisions
- **PES req #4 needed NO action.** `acc.wallet-balance` (view + transfer + 7 `transfer-*` per-pair keys) is
  provisioned for EVERY tenant by the .NET `BuiltInRoleProvisioner` at tenant creation — NOT by
  `zitadel/pes-account-role-rules.json` (that file has zero wallet rules; confirmed by an earlier session too).
  Live-verified: acc-owner = transfer allow + owner-owner/master-owner/owner-master/channel-owner/owner-channel
  allow (master-channel + channel-master = deny); acc-admin = view+transfer + only owner-owner allow;
  acc-user = ALL deny; sysadmin/sysprod = sys.wallet-balance view+configure+transfer. Did NOT touch PES.
- Honda chosen as the UserBased demo (not test-tenant-001, whose wallet page 500s via B-W1 string-tenant
  FormatException; not Mitsubishi/Mercedes which I keep NodeBased). Honda is the lowest-loaded scenario and its
  InsufficientFunds story is master-driven, so flipping owner-type preserves it. Master left at 1 SAR.
- New seed file rather than editing the existing seeds → smallest blast radius, fully idempotent, safe to re-run.

## Files Changed
- CREATED: `C:/Falcon/Falcon/Falcon/falcon-essentials/seed/seed-wallet-e2e.js`  (the only file written; no commits)
- No backend code, no FE, no PES, no .NET recompile.

## Context for Next Agent
- 🔴 **BACKEND-CODE FLAG (blocks the mgmt Transfer BUTTON only — NOT a seed/PES issue):**
  The live re-skinned mgmt wallet component computes
  `canTransfer = pesCanTransfer() && !!this.data()?.canTransfer`
  (`apps/management-console/.../wallet-balance-management.component.ts:163`).
  But `AccountHierarchyResponse` (`falcon-int-core-gateway-svc` AND `falcon-int-system-gateway-svc`,
  `Features/AccountHierarchy/Models/AccountHierarchyResponse.cs`) has ONLY `CanSave` — there is NO
  `CanTransfer` property, and neither `AccountHierarchyMapper.MapToResponse` sets one. So
  `data().canTransfer === undefined` → the per-row Transfer button can NEVER mount, regardless of PES or balances.
  The transfer ENDPOINT itself works (3 real transfers proved it). FIX (pick one, owner = web-platform-ui or
  gateway agent): (a) add `bool CanTransfer` to gateway `AccountHierarchyResponse` + set it in both mappers
  (e.g. mirror PES/`!CanSave`), OR (b) FE drops the `&& this.data()?.canTransfer` clause and relies on
  `pesCanTransfer()` alone. This is the single thing standing between "data ready" and a clickable mgmt transfer.
  (Admin/Falcon console uses a local path matrix + `canTransferWallet` PES, not `data().canTransfer`, so its
  button gating differs — re-check admin separately.)
- test-tenant-001 wallet hierarchy still returns HTTP 500 (B-W1: Commerce `n.Id == "test-tenant-001"` on an
  ObjectId-represented field → FormatException). Pre-existing backend issue; not in scope here. Brands dodge it.
- Tooling gotchas: jq is NOT on PATH — use full WinGet path
  `C:/Users/User/AppData/Local/Microsoft/WinGet/Packages/jqlang.jq_Microsoft.Winget.Source_8wekyb3d8bbwe/jq.exe`.
  Login: `POST http://localhost:7777/api/auth/login {username,password}` → token at `.result.tokens.accessToken`
  (Admin@1234 for all seeded users; no OTP). Charging svc transfer is reachable directly at :7224/api/wallet/transfer
  (the FE `Gateway.ChargingGateway` points there in dev — no separate charging-gateway container).
  Running compose is `C:\Falcon\Falcon\Falcon\docker-compose.yml` (NOT the falcon-essentials copy).
