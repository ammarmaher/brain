---
name: project_wallet_na_mask_before_config_2026_06_24
description: "Wallet balances render 'N/A' (not 0) before the wallet strategy is configured, gated by a single shared flag; both consoles; FE-only; build-green"
metadata: 
  node_type: memory
  type: project
  originSessionId: 7dcb04b8-ea8f-4192-9dbc-ee62c8a19d76
---

**Wallet & Balance Management now shows `N/A` for every balance BEFORE the wallet strategy is configured (instead of a formatted `0`/`0.0000`), in BOTH consoles. FE-only, presentation-only, gated by a single shared flag the user can flip in the future.**

**Trigger = `IWalletDataResponse.canSave === true`** (the not-yet-configured state — the gateway only queries Charging when `canSave===false`, so pre-config every balance is 0 and nodes are `disabled`; same flag that already locks transfers via `[transferLocked]`). Once configured (`canSave===false`) real numbers render unchanged.

**The flag (single SoT, user-controllable):** `libs/falcon/src/shared-types/lib/constants/wallet-display.config.ts` — `export const WALLET_MASK_UNCONFIGURED_BALANCE = true` + `WALLET_BALANCE_MASK_KEY='walletBalanceManagement.notApplicable'` + helper `shouldMaskWalletBalance(notConfigured)= FLAG && notConfigured`. Re-exported via `shared-types/index.ts` → the `@falcon` barrel. Flip the one const to enable/disable the mask across BOTH consoles. (Lib spec `wallet-display.config.spec.ts` added for convention-parity with `falcon-access.registry.spec.ts`; NOTE both are NOT wired into the app/validation vitest configs — verification of record is the production build.)

**Pattern:** each console's store/orchestrator computes ONE `maskBalances` signal = `shouldMaskWalletBalance(canSave())`; leaf presentational components take a plain `maskBalances` boolean input (flag-agnostic). Template gate `@if (maskBalances()) { N/A } @else { riyal + fmtNum/fmtTotal }` — the riyal/currency mark is suppressed in the masked state; header/root rows stay blank (never N/A — their money is the Master Wallet card); the gate sits inside the existing `@if(!hideValue(row))`/non-header branch so by-design blank cells stay blank.

**Files:**
- Admin: `services/wallet.service.ts` (store `maskBalances` computed + import `shouldMaskWalletBalance`); `wallet-balance-management.component.html` (bind `[maskBalances]` to settings-card + allocation-table); `components/wbm-settings-card/*.ts+.html` (new `maskBalances` input; master total + per-channel sub gated); `components/wbm-allocation-table/*.ts+.html` (new `maskBalances` input; single + multiple value cells gated).
- Mgmt: `wallet-balance-management.component.ts` (NEW `canSave` signal set from `response.canSave` in `applyHierarchy` + `maskBalances` computed + bind `[maskBalances]`); `components/wbm-client-view/*.ts+.html` (new `maskBalances` input; master total BOTH layouts + channel subs + value cells single+multiple). NOTE mgmt previously had NO canSave surfaced to the view — added it.
- i18n: `libs/falcon/src/language/i18n/en.json` + `ar.json` → `walletBalanceManagement.notApplicable` = `"N/A"` (identical both locales, per user choice N/A-with-slash).

**Verification:** `nx build admin-console` + `nx build management-console` GREEN (skip-nx-cache; mgmt hash ccfb925760543b11; template type-check validated all `[maskBalances]` bindings + new inputs + i18n pipe + the shared `@falcon` export). Live-UI visual check USER-GATED (Chrome unavailable this session).

**Status:** UNCOMMITTED on `polishing-v0.4` per the standing no-commit rule [[feedback_fe_no_commit_no_branch_without_instruction_2026_06_22]]. Builds on the data-driven wallet work [[project_wallet_admin_channels_destatic_2026_06_22]].

**Why:** before saving, balances are structurally 0 (Charging not yet queried) — showing `0` is misleading; `N/A` is honest. **How to apply / extend:** the behavior is one flag — set `WALLET_MASK_UNCONFIGURED_BALANCE=false` to revert to legacy `0` display; the mask token text lives in one i18n key. Do NOT re-mask configured wallets (only `canSave` gates it).
