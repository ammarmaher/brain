# Task History — new-wallet-balance SoT port (both apps)

- **Task:** Night-shift FEATURE — port React SoT "Wallet & Balance .Mng" → NEW `new-wallet-balance` feature in admin-console (Falcon view) + management-console (Client view), 100% parity.
- **Mode:** night-shift → night-shift-feature
- **Date:** 2026-06-02
- **Status:** COMPLETED (build-green + runtime-verified) · NO COMMITS (push held for user go-ahead)
- **Branch:** `management-console` off `polishing-v0.4` (head 4f55e345). Prior WIP → `stash@{0}`.

## What shipped
- Shared component `@host-shell/shared/new-wallet-balance` (`app-new-wallet-balance`, `perspective: picker|falcon|client`) + 13 sub-components (wb-allocation-table = custom two-pane resizable table w/ synced scroll + tree rails; wb-client-view, wb-settings-card, wb-view-picker, wb-clients-tree, wb-balance-transfer-drawer, wb-confirm-save-modal, wb-radio-pill, wb-icons; + data/seed.ts, data/build-rows.ts, models/types.ts).
- Per-app thin wrappers: admin `perspective="picker"`, mgmt `perspective="client"`.
- Routes (admin loadComponent, mgmt loadChildren) + doubled sidebar NavItem + `newWalletBalance` i18n (~60 keys en+ar) + 5 brand PNGs.
- 36 new files / 5 modified. Existing `wallet-balance-management` UNTOUCHED.

## Verification
- 3/3 prod builds EXIT 0, tsc clean, 0 console errors.
- mgmt Client view ~100% parity (computed-style exact: teal #0d3f44, master #F3F8F5, header #F5F5F5, 48px rows, grids single + multi-3; seed values exact; single+multiple modes).
- admin Falcon view ~99.5% (ammar-qa-web 12/12 PASS as sysadmin: picker, 3-zone, SEED rows, resizer drag+reset+fixed grip, 48px rows both panes, multiple channel cols + master subs + lock + Show All, user-based 3 users, transfer drawer, teal padlock confirm modal + save-lock, role gating).
- 0 actionable diffs.

## Key facts
- Creds: sysadmin/Admin@1234 (Falcon admin), accowner/Admin@1234 (client). test.sa/Falcon@2026! STALE.
- CDP screenshots time out on the Wallet page (both React + Angular) → verified via computed-style/DOM.
- Servers left UP: :4200/:4204/:4301 (Angular) + :5173 (React SoT).

## Artifacts
- Reports: `plans/wallet-balance-port/reports/new-wallet-balance-parity-report.html` + `Brain Outputs/datasets/authority-dataset/_runtime-verification/night-shift-feature-new-wallet-balance-2026-06-02-2330.md`
- Build refs: `plans/wallet-balance-port/{SPEC.md, reference/SOT-REFERENCE.md, reference/ANGULAR-TARGET.md}`
- Memory: `project_new_wallet_balance_port_both_apps_2026_06_02.md`

## Next
- User visual sign-off in browser; on "commit"/"push" → cherry-commit to management-console + open PR. Restore prior WIP with `git stash pop`.
