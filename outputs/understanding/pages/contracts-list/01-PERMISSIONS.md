*** Contracts List — Permissions ***
*** SoT for who can see / act · 2026-05-18 ***

# Contracts List — Permissions

> Falcon-user feature. Inherits parent `adminConsoleGuard` only — **NO** feature-level PES guard on the route ([CODE] `Brain Outputs/datasets/old-ui-dataset/10-pages/admin-console/contracts-cost-management/05-PES.md`).

## Route guard

- Parent `adminConsoleGuard` enforces `FalconAccess.adminConsole.enter()`.
- No feature-level guard. No per-action PES check on Add/View/Edit buttons in old-UI.

## Per-action visibility (PRD-derived)

[PRD] `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/` (Contract module):

| Action | Falcon System Admin | Falcon Product | Falcon Operation | Account Owner | Node Admin | Normal User |
|---|---|---|---|---|---|---|
| View list (admin-console) | YES | YES | YES (view-only?) | NO (different view in mgmt-console) | NO | NO |
| Add Contract | YES | YES | NO (per [INFERRED]) | NO | NO | NO |
| Edit Contract | YES | YES | NO (per [INFERRED]) | NO | NO | NO |
| View Contract | YES | YES | YES | YES (read-only in mgmt-console) | YES | NO |

[INFERRED] Falcon Operation permission boundary for Add/Edit is ambiguous in PRD — likely view-only. **Flagged Q-CC-OP-EDIT in [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md).**

## Account-Owner / Node-Admin view (NOT this page)

[PRD] hints that AO/NA see contract balance summaries in mgmt-console but cannot edit. This page covers Falcon-user admin-console only.

## RemainingValue visibility rules per status per role

[INFERRED — needs PRD confirmation]:

| Contract status | Falcon roles | AO / NA |
|---|---|---|
| Pending | (not yet funded) — show "—" | (not visible to AO/NA in pending) |
| Active | Show current remaining | Show current remaining |
| Expired | Show frozen final remaining | Show frozen final remaining |

[BRAIN-OUT] Backend `ApiContractBalanceSummary` shape includes `remaining` and possibly per-status visibility flags.

## PES queries (potential — currently NONE)

In NEW UI, recommend adding:

| Query | Used for | Suggested key |
|---|---|---|
| `FalconAccess.contracts.add()` | Show/hide Add button | `adminConsole.contracts.add` |
| `FalconAccess.contracts.edit()` | Show/hide Edit action on view mode | `adminConsole.contracts.edit` |
| `FalconAccess.contracts.viewRemainingValue(status, role)` | Show/hide remaining column | dynamic |

→ Flagged as GAP-CC-LIST-PES in [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md).

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) · [README](README.md)
