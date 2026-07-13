*** Task history — Wallet "N/A before configuration" balance mask (flag-gated) ***
*** Completed 2026-06-24 14:13 UTC · FE-only · both consoles · build-green · uncommitted ***

# Goal

Show `N/A` for every wallet balance BEFORE the wallet strategy is configured
(instead of a formatted `0`/`0.0000`), in both admin-console and
management-console. Once configured, show real numbers (unchanged). Controllable
by a single flag the user can flip in the future.

# Outcome — DONE, builds GREEN

- Trigger = `IWalletDataResponse.canSave === true` (not-yet-configured; the
  gateway only queries Charging when `canSave===false`).
- Single master flag (user control point):
  `libs/falcon/src/shared-types/lib/constants/wallet-display.config.ts`
  -> `WALLET_MASK_UNCONFIGURED_BALANCE = true` (+ `WALLET_BALANCE_MASK_KEY`,
  `shouldMaskWalletBalance(notConfigured)`), exported through the `@falcon`
  barrel. Flip the const to disable the mask across both consoles.
- Pattern: store/orchestrator computes one `maskBalances` signal
  = `shouldMaskWalletBalance(canSave())`; leaf components take a plain
  `maskBalances` boolean input. Riyal mark suppressed in the mask state; header/
  root rows stay blank; gate sits inside the existing non-header / `!hideValue`
  branch so by-design blanks stay blank.

# Files changed

- libs/falcon/src/shared-types/lib/constants/wallet-display.config.ts (NEW flag + helper)
- libs/falcon/src/shared-types/lib/constants/wallet-display.config.spec.ts (NEW, convention-parity)
- libs/falcon/src/shared-types/index.ts (barrel export)
- libs/falcon/src/language/i18n/en.json + ar.json (notApplicable = "N/A")
- admin: services/wallet.service.ts (store maskBalances + import);
  wallet-balance-management.component.html (2 bindings);
  components/wbm-settings-card/*.ts+.html (input + master total + channel subs);
  components/wbm-allocation-table/*.ts+.html (input + single + multiple cells)
- mgmt: wallet-balance-management.component.ts (canSave signal set from
  response.canSave + maskBalances computed + binding + import);
  components/wbm-client-view/*.ts+.html (input + master total x2 layouts +
  channel subs + value cells single+multiple)

# Verification

- `nx build admin-console` + `nx build management-console` GREEN (skip-nx-cache,
  exit 0, mgmt hash ccfb925760543b11). Template type-check validated every
  `[maskBalances]` binding, the new component inputs, the `notApplicable` i18n
  pipe, and that the shared flag resolves through `@falcon` in both apps.
- Lib unit spec added but NOT wired into the app/validation vitest configs (same
  as its sibling falcon-access.registry.spec.ts) -> not executed this session;
  the build is the verification of record for this presentation-only change.
- Live-UI visual check USER-GATED (Chrome unavailable this session).

# Status / follow-ups

- UNCOMMITTED on `polishing-v0.4` (standing no-commit rule).
- To revert: WALLET_MASK_UNCONFIGURED_BALANCE = false.
- Memory: [MEMORY] project_wallet_na_mask_before_config_2026_06_24.
