*** Add Contract — Permissions ***
*** SoT for who can author · 2026-05-18 ***

# Add Contract — Permissions

> Falcon-user-only. No PES guards on this feature today — same as `contracts-list`.

## Route guard

- Parent `adminConsoleGuard` enforces `FalconAccess.adminConsole.enter()`.
- No feature-level PES.
- No per-action PES on "Add Contract" button (gated only by wallet strategy).

## Per-role permission

| Role | Add Contract |
|---|---|
| Falcon System Admin | YES |
| Falcon Product | YES |
| Falcon Operation | (TBD per Q-CC-OP-EDIT — likely view-only) |
| Account Owner | NO (mgmt-console doesn't have add path) |
| Node Admin | NO |
| Normal User | NO |

## Suggested PES additions (NEW UI)

- `FalconAccess.contracts.add()` — gate button visibility.
- `FalconAccess.contracts.add.priorityBasedRates()` — if priority-based rates are role-restricted.
- `FalconAccess.contracts.add.overageRates()` — same for overage.

→ Flagged as `GAP-CC-ADD-PES` in [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md).

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
