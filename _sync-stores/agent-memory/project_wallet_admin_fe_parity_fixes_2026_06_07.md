---
name: project-wallet-admin-fe-parity-fixes-2026-06-07
description: "5 admin-console wallet FE defects fixed to mgmt-console parity (3-user cap, channel-column reconcile, disabled-row gating, channel-slot collision guard, description Save-gate). 10 files / +347/-40; build GREEN + 437/437 vitest GREEN. NO commits."
metadata: 
  node_type: memory
  type: project
  originSessionId: b1e85432-b3b0-4942-9a42-52c79c77e3eb
---

**Task (user 2026-06-07): autopilot/ultracode fix all admin-console wallet FE issues to best practice.** Mgmt is the parity reference (already correct). Initial workflow `wf_55f9a39d-151` died on a StructuredOutput schema error AFTER the implement agent had already applied all 5 fixes; I verified the working tree, ran the gates myself, and confirmed everything is correct + green.

**FIXES (all admin-console, FE-only, NO commits, branch polishing-v0.4):**
1. **FIX-1 3-user cap** — `[CODE] data/build-rows.ts:30` removed the seed-demo `(org.users || []).slice(0, 3)` → all users render in the table + transfer holder lists (mgmt-parity comment cites the mirror).
2. **FIX-2 channel-column reconcile** — `[CODE] services/wallet.service.ts:412-420` (first-load branch) `this.activeChannels.set(view.channels.map(c=>c.id))` reconciles the visible columns with the loaded account's REAL mapped channels (was hard-coded `['whatsapp','voice','aichat']` at `:259`). Scoped to the strategy-toggle branch so a user's later un-check is never reverted; "Show All" still expands to the full WB_CHANNELS catalog.
3. **FIX-3 disabled-row gating (mgmt parity)** — added `disabled?: boolean` to `WbRow`/`WbUser`/`WbTreeNode` (`modules/modules.ts`), threaded in `data/build-rows.ts` (lines 50, 88) and the mapper (`data/map-wallet-data.ts:214, 261` — `disabled: node.disabled ?? false`); table button gates `[disabled]="transferLocked() || !!row.disabled"` (`components/wbm-allocation-table/...component.html:181`); imperative backstop `if (row.disabled) return;` in `services/wallet.service.ts:513 openDrawerForRow`. Mirrors mgmt's pattern exactly.
4. **FIX-4 channel-slot collision guard (safe part of the 5-channel ceiling)** — new pure `buildChannelSlotMap(channels)` in `data/map-wallet-data.ts:103-138` assigns slots FIRST-WRITER-WINS so a 6th channel can never wrap onto an occupied slot and CORRUPT an earlier channel's balance (the actual silent-data-loss risk). `mapWalletDataToWb` now uses this map and `masterSubBalances` loop drops the positional `?? WB_CHANNEL_IDS[i%5]` fallback (which was the alias-bug entry point). RENDERING a true 6th column still needs the union→string migration (`WbChannelId` union, `WbAllocation` fixed keys, `--falcon-wallet-cols-multi-6` token) — documented in the new builder's JSDoc; deferred as a separate, larger change.
5. **FIX-5 description Save-gate** — `wbm-balance-transfer-drawer.component.ts:177-183` added optional `descriptionAlwaysRequired` input (default false; mgmt parity) + `descriptionRequired` computed (always-required OR per-path via `isDescriptionRequired(srcType, dstType, mode)`); `descriptionProvided` + `canSave` AND-ed with `(!descriptionRequired() || descriptionProvided())` (`:387-400`); inline `descriptionError` hint via `validateDescriptionRequired`. Template: `*` shows ONLY when `descriptionRequired()` (was unconditional); inline `descriptionError` rendered. Admin keeps per-path (Master IS a holder); mgmt-Client orchestrator can bind `[descriptionAlwaysRequired]="true"` if desired.

**FILES CHANGED (10 files, +347/-40):** `data/build-rows.ts`, `data/map-wallet-data.ts`, `modules/modules.ts`, `services/wallet.service.ts`, `components/wbm-allocation-table/wbm-allocation-table.component.html`, `components/wbm-balance-transfer-drawer/wbm-balance-transfer-drawer.component.{ts,html}`, `__tests__/build-rows.spec.ts`, `__tests__/map-wallet-data.spec.ts`, `__tests__/pes-gating.spec.ts` + NEW `__tests__/description-required.spec.ts`.

**GATES (verified myself, NOT trusting the failed workflow's claim):**
- `npx nx build admin-console --configuration=development` → **GREEN** (hash `07c74deb9aeda05e`, 22s, 7 deps cached).
- `vitest run src/app/features/wallet-balance-management/__tests__` → **19 files / 437 tests / 0 failed / 0 skipped** (up from 418 baseline → +19 new test cases incl. the new `description-required.spec.ts` 6-test file).
- NO transfer wire-payload / PES / HTTP service changes — pure UI/state/typing fixes.
- NO commits; working-tree only. Hand off for user review/commit. Related [[reference_wallet_balance_knowledge_map_2026_06_07]] · [[project_wallet_balance_code_coverage_audit_2026_06_07]] · [[project_wallet_ownership_admin_no_wallet_rootcause_2026_06_07]].
