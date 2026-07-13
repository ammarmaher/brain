---
name: project_new_wallet_balance_renamed_wallet_balance_management_2026_06_03
description: "The new-wallet-balance feature was renamed to wallet-balance-management in BOTH apps (folder, classes, selectors, routes, i18n, sidebar)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 76b17f32-ca8b-4732-881b-dd2b5664e74c
---

On 2026-06-03 (claude) the `new-wallet-balance` feature was **RENAMED to `wallet-balance-management`** in BOTH apps — the name was free because the OLD wallet-balance-management feature had just been deleted ([[project_wallet_balance_management_deleted_both_apps_2026_06_03]]). **So in ANY older memory entry, `new-wallet-balance` now means `wallet-balance-management`.** User-approved scope = Option A.

**What changed (ordered literal replacements, idempotent):** feature folder + top files `new-wallet-balance.*`→`wallet-balance-management.*`; entry class `NewWalletBalanceComponent`→`WalletBalanceManagementComponent`; services `NewWalletBalance{StateService,ViewStore}`→`WalletBalanceManagement{StateService,ViewStore}`; selector `app-new-wallet-balance`→`app-wallet-balance-management`; mgmt `newWalletBalanceRoutes`→`walletBalanceManagementRoutes`; route SLUG `new-wallet-balance`→`wallet-balance-management`; sub-components `wb-`/`Wb…Component`→`wbm-`/`Wbm…Component` (folders `components/wbm-*`, selectors `app-wbm-*` incl. the ~15 `app-wbm-ic-*` icons); i18n namespace `newWalletBalance`→`walletBalanceManagement` (en+ar); host-shell sidebar consts `*_PATH_NEW_WALLET`→`*_PATH_WALLET_BALANCE` + **labels `New Wallet & Balance`→`Wallet & Balance Management`**; breadcrumbs likewise; token-scope selectors in `libs/falcon-ui-tokens/.../wallet.tokens.css`.

**KEPT (deliberate, NOT renamed):** `Wb*` view-TYPES (WbRow/WbChannel/WbAllocation/WbWalletData/WbTreeNode/…) — a spec even asserts `export type WbChannelId`; the `mapWalletDataToWb` mapper; `WB_BRAND_LOGOS` data const; CSS style-hooks `wb-dd-panel`/`wb-dd-ring`/`wb-rate-dd`/`wb-select-menu`/`wb-select-opt`; `modules/modules.ts` (documented-intentional types dir); old orphaned `walletBalance.*` i18n namespace (from the deleted feature).

**Verified:** zero residual `new-wallet-balance`/`NewWalletBalance`/`newWalletBalance`/`app-wb-`/`PATH_NEW_WALLET`/`New Wallet & Balance` in code (only 7 historical provenance comments in shared libs — falcon-resizable-split-pane*, falcon-ui-tokens index/resizable-split-pane.tokens, falcon-tailwind-tokens, shared wallet-balance.models.ts — left accurate on purpose). **vitest GREEN: admin 674/674 (29 files), mgmt 461/461 (20 files)** incl. all standards/standards-drawer/standards-client-view/pes-gating specs. Internal imports/decorators/barrel consistent.

**Why:** future sessions must use `wallet-balance-management` (not `new-wallet-balance`) and must NOT delete the kept `Wb*` types / `managementConsole.wallet.view()` registry factory.
**How to apply:** NO COMMITS (branch polishing-v0.4, staged via `git add -A`). **Production webpack build GREEN** — stopped the live serve, `nx run-many -t build -p admin-console,management-console,host-shell` exit 0 (renamed lazy chunks `features-wallet-balance-management-*` emitted in both apps), then restarted `nx serve host-shell` (:4200 back to 200). Pre-existing non-blocking warns only (10.21MB bundle budget; test-only `index.ts`/fixtures "unused"). Rollback stash object `0ff0d4d952d030dce78d65b5ecdc7abf0aaf18aa`. Plan (gitignored) `falcon-web-platform-ui/plans/wallet-rename/RENAME-PLAN.md`. Sidebar parent-dir rename hit a Windows watcher lock → worked around by move-children-into-new-dir. Related [[project_new_wallet_balance_port_both_apps_2026_06_02]] · [[reference_wallet_backend_integration_contract_2026_06_02]].
