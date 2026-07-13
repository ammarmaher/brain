---
name: reference-wallet-transfer-source-destination-matrix-2026-06-06
description: "Exact transfer-drawer Source/Destination behavior — what shows when you click the Master wallet vs each row, the full computeDestOptions pairing matrix, triggers, gating, and payload→wire mapping."
metadata: 
  node_type: memory
  type: reference
  originSessionId: a63a1065-d159-4653-a786-cbebfc22b2e0
---

Deep-dive (2026-06-06, claude, code-verified) of the wallet **Balance Transfer drawer** Source/Destination logic. LIVE feature on `polishing-v0.4` = **`wallet-balance-management`** (components `wbm-*`), NOT `new-wallet-balance` (that feature is NOT on this branch — it lived on the `management-console` branch/stash). Both are verbatim 1:1 ports of React SoT `Falcon-Taha2/admin/wallet-drawer.jsx`, so logic is identical. ⚠️ Brain doc `understanding/pages/wallets-and-balance-management/05-SECTION_TRANSFER_DRAWER.md` (2026-05-18) is STALE — describes the pre-rewrite `balance-transfer.component.ts`; its matrix table is the PRD-level one, NOT the implemented matrix. Authoritative SoT = `apps/admin-console/.../wallet-balance-management/data/transfer-pairing.ts` (pure), truth-table `__tests__/transfer-matrix.spec.ts`.

**HOLDER MODEL** (3 kinds, `transfer-pairing.ts:52-84`): `master` id=`__master`; `commch` id=`__ch_<channel>` (Multiple-Wallets mode ONLY; channels whatsapp/voice/aichat/sms/email); `entity` id=node-id or `<orgId>::<userIdx>` for users. **SOURCE dropdown = ALWAYS the full holder list** (`buildAllOptions`); the clicked button only sets the INITIAL selection (user can switch). **DESTINATION dropdown = `computeDestOptions(source)`** — filtered by the pairing matrix.

**3 AXES:** walletType single|multiple; balanceType node|user (node→entity holders are Org/Service nodes; user→Users only); noMaster (false=admin/Falcon view, master IS a holder; true=mgmt/Client view, master NEVER a holder). Admin orchestrator always passes `[noMaster]="false"`.

**TRIGGERS → initial source** (`resolveInitialSourceId`, `wbm-settings-card.ts:117-138` + `wbm-allocation-table.html:184`): Master card button → `{isMaster:true}` → `__master`; Master per-channel sub-button (Multiple+falcon-admin only, `showSubs`) → `{isCommch:true,ch}` → `__ch_<ch>`; table row → the WbRow → `row.id`.

**FULL DESTINATION MATRIX** (`computeDestOptions`, `transfer-pairing.ts:122-145`):
- Falcon/noMaster=false, SINGLE: master→all entities | entity→master + OTHER entities (self excluded).
- Falcon, MULTIPLE: master→comm-channel pools ONLY | comm-channel→master + all entities | entity→matching pool (ch===sourceCh) + OTHER entities.
- Client/noMaster=true, SINGLE: entity→OTHER entities only (no master).
- Client, MULTIPLE: comm-channel→all entities | entity→OTHER entities only (NO master, NO pool).
Holder can NEVER target itself (Rule D). Master pairs only with channel pools in Multiple. Client view never exposes master; client entity→siblings only.

**DIRECT ANSWERS:** Click MASTER → source=Master; dest = all entities (Single) OR comm-channel pools only (Multiple); sourceMax=Infinity. Click a ROW → source=that entity; dest = master + other entities (Single) OR matching channel pool + other entities (Multiple); a "Source Wallet" channel dropdown appears in Multiple and the dest channel LOCKS to it (`computeLockCh`, 🔒 crossChannelLocked, Dest-Wallet disabled).

**SAVE GATE** (`computeCanSave`): source set + dest set + sourceId≠destId + 0<amount≤sourceMax (master/unknown=Infinity). Full validation on confirm (`validateTransferForm`): amount/currency/source≠dest/insufficient-balance/description-required (Multiple comm-channel or node↔node/user).

**GATING** (`wallet.service.ts:464-473`): PES `FalconAccess.adminConsole.wallet.transfer` (fails closed) + role (column needs ≠normal-user; master button needs falcon-admin/account-owner) + **`transferLocked=canSave`**: KEY RULE — while strategy NOT-yet-configured (canSave=true) ALL transfer buttons DISABLED; transfer enabled only once configured (canSave=false) — inverse of the Save button. Master card needs `masterWallet.view`. Row button visibility `showRowXfer`: node mode=all org/service rows; user mode=user rows only.

**PAYLOAD→WIRE** (`transfer-request.ts:193`): WbTransferPayload → `ITransferRequest{amount,currency,description?,source,destination}` each `{walletId?,channelId?}`; master→summary.masterWalletId; commch→channelWallet[realChId].walletId; entity→node channelBalances[realChId].walletId (or node id in Single). POST `charging/wallet/transfer` → on success reload hierarchy.

**OBSERVATION (not a bug):** store `drawerSource()` (`wallet.service.ts:408-420`) branches `if ('kind' in d)` to tell WbRow from WbDrawerSource, but BOTH carry `kind` → the manual-coercion else block is DEAD CODE. Functionally correct (drawer only reads id/isMaster/isCommch/ch) but the comment is misleading.

Related [[reference_wallet_backend_integration_contract_2026_06_02]] · [[project_new_wallet_balance_port_both_apps_2026_06_02]] · [[reference_fe_structure_standard_angular21_2026_06_02]].
