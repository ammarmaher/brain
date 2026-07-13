---
name: project_wallet_balance_management_deleted_both_apps_2026_06_03
description: The old wallet-balance-management feature was deleted from BOTH apps + sidebar; new-wallet-balance is now the sole wallet feature
metadata: 
  node_type: memory
  type: project
  originSessionId: 76b17f32-ca8b-4732-881b-dd2b5664e74c
---

On 2026-06-03 (claude) the **old `wallet-balance-management` feature was DELETED from BOTH apps** at the user's request — supersedes the prior "Existing wallet-balance-management UNTOUCHED" note in [[project_new_wallet_balance_port_both_apps_2026_06_02]]. `new-wallet-balance` is now the SOLE wallet feature in the FE.

Deleted: `apps/admin-console/.../features/wallet-balance-management` (8 files) + `apps/management-console/.../features/wallet-balance-management` (11 files). Removed the lazy route block from both `app.routes.ts` (admin `loadComponent` / mgmt `loadChildren` → `walletBalanceManagementRoutes`), removed the mgmt per-role matrix doc line, and removed the TWO "Wallet & Balance .Mng" sidebar nav items + their `admin_console_PATH_WALLET_BALANCE` / `management_console_PATH_WALLET_BALANCE` constants from `host-shell/.../layout/layout.component.ts`. The mgmt sidebar item's `access: FalconAccess.managementConsole.wallet.view()` consumer is gone, but the **registry factory `FalconAccess.managementConsole.wallet.view()` MUST stay** — `new-wallet-balance` (mgmt) still uses it as its route gate (`new-wallet-balance.routes.ts` + `standards.spec.ts`).

Verified SAFE by static analysis: repo-wide grep proved ZERO remaining import/symbol references to the deleted folders (only harmless donor doc-comments remain in `new-wallet-balance/*`, `contracts-cost-management`, and `libs/falcon/.../wallet/wallet-balance.models.ts:11`); no orphaned imports; valid syntax; live host-shell :4200 stayed 200.

**Why:** future sessions must not try to wire/edit/audit the deleted feature, and must not delete the `managementConsole.wallet` registry factory.
**How to apply:** treat `new-wallet-balance` as the only wallet feature. Left in place (deliberately, out of scope): `walletBalance.*` i18n keys (shared/harmless) and the donor doc-comments. NO COMMITS, branch polishing-v0.4. **No full webpack build was run** — a live `nx serve host-shell` was active and this project's rule is don't-build-while-serving (corrupts static remotes); admin/mgmt static remotes still serve STALE pre-built dist with the old routes until rebuilt. Related [[reference_wallet_backend_integration_contract_2026_06_02]] · [[project_new_wallet_balance_port_both_apps_2026_06_02]] · [[reference_504_admin_console_mf_duplicate_servers_2026_05_31]].
