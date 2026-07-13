---
name: project_wallet_drawer_overbalance_indicator_master_bound_redbg_2026_06_06
description: Wallet balance-transfer drawer — over-balance error indicator NEVER fired (master source sourceMax=Infinity) + the red error bg was near-white red-50. Fixed by bounding the master by masterTotal + a clearly-red red-100 bg via inputClass. Verified.
metadata: 
  node_type: memory
  type: project
  originSessionId: 00be6008-2c58-4599-9789-5cc3a6058aaa
---

# Wallet balance-transfer drawer — "exceed balance shows NO indicator" + faint red bg (fixed 2026-06-06)

**Symptom (user, live):** in the balance-transfer drawer, typing an amount ABOVE the balance showed
NO indicator — "I can write anything", "balance is zero, transfer 10, no indicator and nothing", and the
error background wasn't visibly red. (This is the follow-on to the "input disappears" work, which was the
slot-wipe; see [[project_wallet_drawer_amount_overbalance_disappear_rootcause_2026_06_06]].)

**ROOT CAUSE (the "no indicator" bug) — [CODE]:** `overBalance` requires a FINITE `sourceMax`
(admin `wbm-balance-transfer-drawer.component.ts` `overBalance = !!srcOpt() && isFinite(sourceMax()) && amountNum() > sourceMax()`),
but `computeSourceMax` (admin `data/transfer-pairing.ts`) / `sourceMax` (mgmt `transfer-rules.ts`) hard-returned
**`Infinity` for the MASTER source**. So when transferring FROM the master (the Falcon-admin/admin console — master
IS a holder there; mgmt is `noMaster` so the master is never a source), `sourceMax = Infinity` → `overBalance` could
NEVER be true → no red styling, no message, any amount accepted. A zero-balance master = exactly "write anything,
no indicator." (The master's real total balance — `summary.totalBalance` — was already computed as
`masterTotal` in `data/map-wallet-data.ts` and DISPLAYED on the Master card via `store.masterTotal()`, but was
NOT passed to the drawer; `computeSourceMax` ignored it.)

**FIX A — bound the master by its real total (admin):** added `masterTotal: number` to `SourceMaxInput`;
`computeSourceMax` master branch now `return masterTotal` (was `Infinity`); drawer gained
`readonly masterTotal = input<number>(0)` threaded into the `computeSourceMax` call; the orchestrator template
passes `[masterTotal]="store.masterTotal()"`. Now a zero-balance master → `sourceMax = 0` (FINITE) →
`overBalance` fires on any amount > 0 → red styling + message + Save disabled, matching the Master card. Comm-channel
(its pool) + node/user (allocation) were already finite; only the master was unbounded. (mgmt is `noMaster`, so its
sources were already finite — only the red-bg fix below applies there.)

**FIX B — clearly-RED error background (both consoles):** the error bg was the platform default
`--falcon-input-bg-error` = red-50 (#fef5f5, near-white → read as "no background"). Bumped to a clearly-visible
**red-100** via a Tailwind utility, NOT a styles-block token: each drawer now binds
`[inputClass]="amountInputClass()"` where `amountInputClass = computed(() => '<base padding/text>' + (overBalance() ? ' !bg-falcon-red-100' : ''))`.
This was deliberately done as a Tailwind class (not a `--falcon-input-bg-error` orchestrator remap): the mgmt
wallet feature's `__tests__/standards.spec.ts` FORBIDS component `styles:`/`styleUrl:` blocks AND any `#hex`/`rgb()`
in feature `.ts` — an orchestrator `styles` block with `#fee2e2` tripped BOTH rules (caught in test). The
`.\!bg-falcon-red-100` important variant IS generated in both built `styles.css` (verified) and overrides the inner
input's `bg-transparent`. The red border + ring (admin via orchestrator `--falcon-input-*-error → --falcon-wallet-error`
token map; mgmt platform red-500) + the over-balance message below were already present.

**VERIFIED 2026-06-06 (claude):** admin build EXIT 0 + **743 tests pass** (`transfer-matrix.spec` 58 incl. NEW
master-bounded + zero-balance-master cases; `transfer-pairing.spec` 36); mgmt build EXIT 0 + **568 tests pass**
(`standards.spec` 32 ✓ — proves no styles-block/hex violation; `transfer-rules.spec` 52). `.\!bg-falcon-red-100`
confirmed in both dist `styles.css`. The 13 `NG0201 FALCON_LANGUAGE` admin failures seen mid-task were a FLAKY
collection-order/env issue (gone on clean re-run 743/743), NOT related. Templates + drawer/data `.ts` + 1 spec ONLY;
NO commits. ⚠️ live pixel-verify (no browser connected): confirm the over-balance field shows the red fill + red
border + ring + message, esp. transferring from a zero-balance master (admin).

Related [[project_wallet_drawer_amount_overbalance_disappear_rootcause_2026_06_06]] · [[reference_wallet_backend_integration_contract_2026_06_02]] · [[reference_wallet_transfer_source_destination_matrix_2026_06_06]].
