---
name: project_new_wallet_balance_transfer_rules_seed_decoupling_2026_06_02
description: mgmt new-wallet-balance drawer transfer-rules.ts decoupled from seed.ts via injected userAllocFallback resolver — fixes latent UserBased sourceMax=0 regression
metadata: 
  node_type: memory
  type: project
  originSessionId: 75d2d795-94f1-45c5-98fe-bdf254f53b97
---

Management-console `new-wallet-balance` Balance-Transfer drawer: the PURE rules module `transfer-rules.ts` is now **seed-DECOUPLED**. Previously `allocForRow()` reproduced the seed computeds' `userAllocs[k] || seedUserAlloc(...)` user-row lazy-fill via a **direct `import { seedUserAlloc } from '../../data/seed'`** (the "run-3 fix"). That coupling is removed: the fallback is now an **injected resolver** `TransferRulesContext.userAllocFallback: (orgId, userIdx) => WbAllocation` (REQUIRED field). The composition root supplies it — the drawer (`wb-balance-transfer-drawer.component.ts`, already seed-aware for `WB_CHANNELS`/`fmtTotal`) wires `userAllocFallback: seedUserAlloc`; the test fixture `ctx()` defaults it to the real `seedUserAlloc`.

**Why it mattered (latent, was unreachable in seed):** with `userAllocs === {}` in UserBased mode a user-source `sourceMax` collapsed to 0 → Save permanently disabled + false "exceeds available", while the table still showed the seeded/real balance. Unreachable while `balanceType` was hardwired `'node'`, but the backend-integration plan seeds `balanceType` from `Summary.walletBalanceType` (and the orchestrator's `applyHierarchy` already does `this.balanceType.set(m.balanceType)`), making UserBased reachable. The adapter `mapHierarchyToWb` populates `userAllocs` for EVERY user child (`wallet.adapter.ts:207`), so post-migration the `||` short-circuits and the injected fallback is **inert** (kept for the seed/offline path; caller may swap it without touching the pure module).

**How to apply:** any new construction of `TransferRulesContext` MUST pass `userAllocFallback` (required field — compile-enforced). Keep `transfer-rules.ts` seed-agnostic (no `data/seed` import) so it stays node-vitest testable; put the seed coupling in the component. Files: `transfer-rules.ts` (`allocForRow` uses `ctx.userAllocFallback`), drawer component (wires it), `__tests__/fixtures/transfer-rules.fixtures.ts` (default), `__tests__/transfer-rules.spec.ts` (new "userAllocFallback is INJECTED (decoupling guard)" block exercises empty `userAllocs` + a custom resolver). `nx test management-console` = 448/448 green (transfer-rules 49, standards-drawer 16). NO COMMITS, branch as-is. The admin twin + mgmt client-view keep their own inline `|| seedUserAlloc` computeds (app-level, allowed) — untouched.

Related [[project_new_wallet_balance_backend_integration_plan_2026_06_02]] · [[project_new_wallet_balance_port_both_apps_2026_06_02]] · [[reference_wallet_backend_integration_contract_2026_06_02]].
