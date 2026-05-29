*** Wallets & Balance Management — Permissions ***
*** 5 PES keys · 2026-05-18 ***

# Wallets & Balance Management — Permissions

## Route guards

- `adminConsoleGuard` (parent) enforces `FalconAccess.adminConsole.enter()`.
- `shellAccessGuard` (feature) — declared but with **no `access:` value** → NO-OP today ([CODE] `apps/admin-console/.../features/routes.ts:52-61`). Flagged as GAP-WBM-GUARD.

## PES checks via AccessControlFacade.resolveFlags

[CODE] feature uses `AccessControlFacade.resolveFlags()` to bulk-evaluate 4 keys on page load:

| Key | Controls | Source |
|---|---|---|
| `FalconAccess.adminConsole.walletStrategy.view()` | Visibility of strategy controls | [CODE] container |
| `FalconAccess.adminConsole.walletStrategy.edit()` | Save button + dropdown editability | Same |
| `FalconAccess.adminConsole.wallet.viewMaster()` | Visibility of Master Wallet row | Same |
| `FalconAccess.adminConsole.wallet.transfer()` | Visibility of Transfer button per row | Same |

Plus the entry key `FalconAccess.adminConsole.enter()` (parent guard) → **5 total**.

## Per-role permission

[PRD] BR-AM-27..38 + BR-AM-31..33:

| Role | View strategy | Edit strategy | View master | Transfer |
|---|---|---|---|---|
| Falcon System Admin | YES | YES | YES | YES (any path) |
| Falcon Product | YES | YES | YES | YES (any) |
| Falcon Operation | YES | NO (view-only?) | YES | NO (likely) |
| Account Owner | NO (mgmt-console only) | NO | NO | YES (in-account paths) |
| Node Admin | NO | NO | NO | YES (own subtree) |
| Normal User | NO | NO | NO | NO |

## Inline derived rules

- `canEditStrategy = adminConsole.walletStrategy.edit() && !alreadyConfigured` ([INFERRED]: typically strategy is set ONCE at account creation; subsequent edits restricted).
- `canTransferRow(row) = adminConsole.wallet.transfer() && row.balanceType !== 'Master'` (Master is abstract; you transfer FROM Master TO somewhere or BETWEEN children).

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [05-SECTION_TRANSFER_DRAWER](05-SECTION_TRANSFER_DRAWER.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
