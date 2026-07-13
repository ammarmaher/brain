---
name: session-backup-wallet-balance-transfer-24-client-matrix-scale-up
description: "Scaled the verified d10001 pilot to the full 24-client wallet-transfer matrix (4 modes x 6). Data-only, idempotent, live-verified both gateways + real transfer + PES."
metadata: 
  node_type: memory
  type: project
  agent: ammar-essentials
  date: 2026-06-07
  status: completed
  originSessionId: 77e0390c-3601-471d-a383-c610bf6618f9
---

## What Was Done
- **Generalized the 2 pilot scripts (data only, NO backend .cs, NO commits):**
  - NEW `falcon-essentials/seed/seed-wallet-transfer-matrix.js` — parameterized via `process.env` (passed with `docker exec -e`): `TID`, `NAME`, `BALANCE_OWNER_TYPE` (1 NodeBased / 2 UserBased), `WALLET_STRUCTURE` (1 Single / 2 Multiple), `SUBNODE_COUNT`. Handles all 4 modes incl. UserBased (reads `FalconIdentityDb.Users` by tenant, funds `USER:{user._id hex}:...` wallets; skips `*-disabled*` users so their row renders Disabled).
  - NEW `falcon-essentials/zitadel/seed-wallet-transfer-matrix-users.sh` — parameterized via `PILOT_TENANT_ID`/`TENANT_ID`, `USER_PREFIX`, `PHONE_BASE`, `EXTRA_FUNDED_USERS`, `EXTRA_DISABLED_USERS`. Always creates owner/admin/user (roles 4/5/6) + UserBased extras. Full clean-client recipe per client: Zitadel human/_import + metadata + OTP + Identity Users + PES g-link + 245 account-role p-rules (pes-account-role-rules.json templated on {TENANT_ID}).
  - NEW `falcon-essentials/seed/run-wallet-transfer-matrix.sh` — orchestrator looping d10002..d10024 (skips d10001 pilot).
  - The ORIGINAL pilot scripts (seed-wallet-transfer-pilot.js / -users.sh) are UNCHANGED and still work.
- **Created 23 clients d10002..d10024** (d10001 kept as the pilot). Independently verified in mongo: every client matches its expected node/settings/strategy/wallet/user profile EXACTLY (see table below).
- **Live HTTP verified (independent GETs, not seed logs):** one client per mode on BOTH gateways → all HTTP 200 with real balances.
  - mgmt :7038 (owner token): d10003 NM, d10008 NS, d10014 UM, d10020 US → 200.
  - admin :7256 (sysadmin token, pwd Admin@1234): same 4 → 200.
  - US d10020 user rows: 7 funded (owner 8000/admin 4500/user 12000/fund1-4) + Disabled1 `disabled:true balance:0`.
- **Real transfer** POST :7224/api/wallet/transfer on d10003 (master-WA 5000 → North-WA 4000, amount 500) → HTTP 200 success+transactionId; balances moved to 4500/4500; re-seed restored baseline.
- **PES verified** for pilot-nm-3-owner via /pes/authorize (corrected body `{sub:{kind:"u:{zuid}@{tid}"},obj:{kind},actions:[...]}`): app.management-console/view=true, acc.wallet-balance/view=true, /transfer=true, app.admin-console/view=false. All 4 modes' owners login stage 4.

## Bugs found + fixed during scale-up (all in the NEW scripts, pre-delivery)
1. **Sub-node id collision** — first `subNodeId(n)=TID.slice(0,20)+"a00"+n` produced the SAME ids (`...d1a001/d1a002`) for every d100NN tenant (they share the first 20 hex) → cross-tenant `_id` collision; the d10002 test even overwrote+re-parented the PILOT's sub-nodes. FIXED to `TID.slice(0,18)+TID.slice(-4)+"0"+n` (globally unique 24-hex). Then RESTORED the pilot d10001 (3 nodes / 10 wallets) via the original pilot JS.
2. **UserBased Identity Users silently lost** — users script ran FIRST (matrix said "users-first"), but `upsert_identity_user` stamps `nodeId=ObjectId(MainNodeHex)` and the Main node didn't exist yet → `ObjectId("")` threw inside mongosh, swallowed by `2>/dev/null` → 0 Identity Users for all 12 UserBased clients. FIXED ordering to JS→users→JS for UserBased (JS pass1 creates Main node; users insert succeeds; JS pass2 funds USER wallets — idempotent). Also HARD-GUARDED `upsert_identity_user` to fail loudly if Main node missing + stopped discarding mongosh stderr.
3. **Disabled-user skip regex** — `/-disabled$/` did not match username `pilot-us-N-disabled-1` → disabled user got a wallet (US showed 8 funded / 0 disabled). FIXED to `/-disabled(-\d+)?$/`; cleared the 6 stray wallets + re-ran → US now 7 funded / 1 wallet-less.

## Files Changed
- NEW seed/seed-wallet-transfer-matrix.js, NEW seed/run-wallet-transfer-matrix.sh, NEW zitadel/seed-wallet-transfer-matrix-users.sh. NO commits, NO backend edits, NO repo app code.

## Verified per-mode data profile (independent mongo counts, all 24 match)
- NM d10001-06 NodeBased+Multiple: nodes=3, set 1/2, strat 1/2, masterWallets=4 (ALL+3chan), nodeWallets=6 (2 sub x3 chan), users=3.
- NS d10007-12 NodeBased+Single: nodes=3, set 1/1, strat 1/1, masterWallets=1 (ALL), nodeWallets=2 (2 sub ALL), users=3.
- UM d10013-18 UserBased+Multiple: nodes=3, set 2/2, strat 2/2, masterWallets=4, userWallets=21 (7 users x3 chan), users=7 (owner+admin+user+4 fund).
- US d10019-24 UserBased+Single: nodes=1 (Main only), set 2/1, strat 2/1, masterWallets=1, userWallets=7, users=8 (7 funded + 1 wallet-less disabled).

## Context for Next Agent
- Tooling: jq at `C:/Users/User/AppData/Local/Microsoft/WinGet/Packages/jqlang.jq_*/jq.exe` (not on PATH). Login `POST :7777/api/auth/login {username,password}` → `.result.tokens.accessToken` (stage 4, OTP pre-verified by seed). sysadmin/Admin@1234 = Falcon admin for :7256.
- Hierarchy GET: `:7038` (mgmt, owner token) / `:7256` (admin, sysadmin token) `api/commerce/accounts/{TID}/hierarchy?walletStructure={1|2}`. Response under `.result.{accountInfo,summary{totalBalance,channelWallet[]},node{children[]},canSave}`. UserBased user rows appear as `node.children[]` with `nodeType:3`.
- Transfer: `POST :7224/api/wallet/transfer` REQUIRES Bearer token; body `{amount,currency:1,description,source:{walletId,channelId},destination:{walletId,channelId}}`.
- Sub-node id scheme for d100NN: North=`690000000000000000` + `00NN` + `01`, South + `02` (e.g. d10003 → North `690000000000000000000301`). d10001 pilot is the EXCEPTION: its subs are at the original `690000000000000000d1a001`/`d1a002`.
- Re-run anytime: `cd falcon-essentials/seed && (jq on PATH) && sh ./run-wallet-transfer-matrix.sh` (idempotent; converges).
