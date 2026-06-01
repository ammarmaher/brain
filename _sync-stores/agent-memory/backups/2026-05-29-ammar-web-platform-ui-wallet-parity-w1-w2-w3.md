---
name: Session Backup - Mgmt wallet BUSINESS parity (W1 walletId + W2 structural + W3 3dp)
description: Restored management-console wallet transfer business parity with origin/main — fixed empty SingleWallet walletId (W1), restored structural drawer guards (W2, no PES), 3-decimal balance precision (W3)
type: project
agent: ammar-web-platform-ui
date: 2026-05-29
status: completed
---

## What Was Done

Restored management-console wallet BUSINESS parity with `origin/main` in three objectives. REVIEW oracle = `C:/Falcon/qa/runs/wallet-parity-2026-05-29/CONTRACT.md` + `discovery/04-fe-mgmt-wallet.md`. Ported FROM origin/main (read via `git show origin/main:<path>`), kept the new T2 visual design. Edits confined to `apps/management-console/src/app/features/wallet-balance-management/` (3 files). NO commits. Build GREEN, lint clean.

### W1 (🔴 CRITICAL) — SingleWallet transfer empty walletId — FIXED
- BUG (confirmed): drawer `onSubmit` built `{walletId: src.channelBalances?.[0]?.walletId, channelId: src.channelId}`. In Single mode the parent's `buildTransferContext` pushes Node/User entities WITHOUT `channelBalances` → `walletId: undefined` → charging rejects `InvalidTransferWallets`.
- FIX: new static `buildTransferEndpoint(entity)` in the drawer, mirroring origin/main mgmt drawer (`balance-transfer.component.ts:706-764`) + admin (`:650-662`):
  - `CommChannelWallet` → `{walletId: entity.channelBalances?.[0]?.walletId || entity.id, channelId: entity.channelId}`
  - `Node`/`User` (single) → `{walletId: entity.id, channelId: undefined}`
- `onSubmit` now calls `buildTransferEndpoint(src)` / `buildTransferEndpoint(dst)`.
- Kept `submitting()` / `!canSubmit()` double-submit guard (transfer is NOT idempotent server-side per CONTRACT §2 rule 9).

### W2 (🟠) — structural drawer correctness guards (NO PES/registry) — RESTORED
- (a) Balance-type owner filter: new static `ownerMatchesDistribution(nodeType, dist)` in parent (mirrors main `filterByBalanceType` :580). Applied in `buildTransferContext` to BOTH the Single owner loop and the Multiple owner loop: NodeBased offers ONLY Org/Service owners, UserBased ONLY wallet-owner users. (Was: every non-root node offered regardless of distribution.)
- (b) Channel-wallet locking (Multiple): in drawer `destinationOptions` computed, when the selected source is a `CommChannelWallet` and mode is MultipleWallets, destinations whose `channelId !== source.channelId` are `disabled` at the option level. `onSourceChange` also clears a now-illegal selected destination. Mirrors main `updateDestinationWallets` + `applyAccessFilterToDestinations`.
- (c) Legal owner-type pairs: the parent already skips the root account node (`if (n.nodeType===Organization && n.id===payload.node.id) continue;`) and mgmt NEVER adds a Master/Account entity → Account→Account is unconstructable (CONTRACT §2 rule 5). Same-source disabled at option level (pre-existing).
- KEPT the coarse `managementConsole.wallet.transfer()` PES gate EXACTLY as-is (resolved in parent constructor). Did NOT edit `libs/falcon`.

### W4 — per-pair directional PES — NOT DONE (intentional, marked)
- origin/main's mgmt drawer used 7 ABAC factories `FalconAccess.managementConsole.walletBalance.transfer{OwnerOwner,MasterOwner,OwnerMaster,ChannelOwner,OwnerChannel,MasterChannel,ChannelMaster}(attrs)` with `sourcePath`/`destinationPath`. These DO NOT EXIST in this branch's `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts` (only the coarse `acc.wallet-balance:transfer` is present at registry :109-112). Restoring them needs a shared-lib registry edit = OUT OF SCOPE per brief.
- Left a clear `// TODO(W4): per-pair directional PES` documentation block above the drawer's `canSubmit` computed. NOT stubbed to always-allow — authorization is still enforced by the coarse PES gate + the backend POST (CONTRACT §2 rules + charging `ResolveOcsTransferWalletsPolicy`).

### W3 (🟡) — 3-decimal balance precision — FIXED
- Parent `formatAmount`: `{maximumFractionDigits:0}` → `{minimumFractionDigits:3, maximumFractionDigits:3}` (= Angular `1.3-3`). Feeds all table value cells (`formatWalletCell`/`formatChannelCell`).
- Master card: already `| number:'1.3-3':'en-US'` in HTML — no change needed.
- Drawer balance text aligned to 3dp: new static `formatBalance` (3dp); `labelFor` (dropdown option balances — LIVE) + `availableBalanceLabel` (DEAD, not in template — harmless) now use it; HTML inline "Available" hint `number:'1.0-2'` → `number:'1.3-3'` (LIVE).

## EXACT before→after of walletId resolution

SINGLE mode:
- BEFORE: `source: { walletId: src.channelBalances?.[0]?.walletId, channelId: src.channelId }` → `{ walletId: undefined, channelId: undefined }` (BROKEN)
- AFTER:  `source: buildTransferEndpoint(src)` → `{ walletId: entity.id /* owner node/user id */, channelId: undefined }`

MULTIPLE mode:
- BEFORE: `{ walletId: src.channelBalances?.[0]?.walletId, channelId: src.channelId }` → happened to work (entity HAD channelBalances)
- AFTER:  `buildTransferEndpoint(src)` → `{ walletId: channelBalances[0].walletId || entity.id /* channel sub-wallet */, channelId: entity.channelId }` (now with `entity.id` fallback so never blank)

## Files Changed (3, all under wallet-balance-management/)
1. `wallet-balance-management.component.ts` — +`ownerMatchesDistribution` static helper, distribution filter in both `buildTransferContext` branches, `formatAmount` → 3dp.
2. `components/balance-transfer/balance-transfer.component.ts` — +`buildTransferEndpoint` static, +`formatBalance` static, `onSubmit` uses buildTransferEndpoint, channel-lock in `destinationOptions` + `onSourceChange`, `// TODO(W4)` block, imports +`ITransferEndpoint`/`TransferEntityType`/`TransferMode`, header comment corrected (removed stale "transfer-limit-pct / currency-mismatch guard" claims, documented W1/W2/W4).
3. `components/balance-transfer/balance-transfer.component.html` — 1 line: "Available" hint `1.0-2` → `1.3-3`.

## Build / Verify
- `nx build management-console --skip-nx-cache` → exit 0, Hash `7488f275c4f9eada`, "Successfully ran target build for project management-console and 6 tasks it depends on".
- `eslint` on both changed TS files → exit 0.
- Verified by code-trace (Single→owner id, Multiple→channel sub-wallet id+channelId, both non-blank). NOT browser-verified — brief forbade dev-server/Docker, and per prior memory (2026-05-28) the mgmt transfer button only mounts with live seed + PES, which needs the full stack.

## Context for Next Agent
- KEPT `validations/validations.ts` unchanged (correct per CONTRACT §2: amount>0 & ≤ balance, src≠dst; NO limit-%/currency-mismatch — backend has neither).
- The working tree (polishing-v0.4) has many OTHER dirty files (comm-mkt-view, contact-groups, contracts, org-hierarchy, libs i18n) — these are PRE-EXISTING uncommitted work from prior sessions; I did NOT touch them. My new helper names (`buildTransferEndpoint`, `ownerMatchesDistribution`, `formatBalance`) appear ONLY in the 2 wallet TS files (grep-verified).
- W4 (per-pair directional PES) is the remaining gap — it is BLOCKED on a `libs/falcon/.../falcon-access.registry.ts` edit to add the 7 `walletBalance.transfer*` ABAC factories + the drawer `authorizePair`/`buildPairAccessQuery`/`resolveTransferFlow` logic. That is a separate coordinated step requiring shared-lib changes. Admin console has the SAME W4 gap (also dropped per discovery 04 §F).
- Runtime verification recipe (when Docker is up): login mercedes-owner (Multiple+NodeBased seed, c10003) or mitsubishi-owner (Single+NodeBased, c10001) per the essentials wallet-e2e seed; open transfer drawer; pick source→dest; submit; capture `POST :7224/api/wallet/transfer` body — assert `source.walletId` + `destination.walletId` are BOTH non-blank and `Success:true`. For Single: walletId = node id. For Multiple: walletId = channel sub-wallet id + channelId present.
