*** Create Template (WhatsApp) — Permissions ***
*** 2026-05-18 ***

# Create Template (WhatsApp) — Permissions

## Route + entry guards

- `authGuard`
- `clientConsoleGuard` OR `adminConsoleGuard` depending on app
- `FalconAccess.templates.create('WHATSAPP')` PES check at entry

## Per-PRD

[PRD] BR-TM-01 — Falcon usertype CANNOT create. So entry restricted to Client users.

| Role | Create | Source |
|---|---|---|
| Falcon (any subtype) | NO | BR-TM-01 |
| Account Owner | YES (Maker default) | understanding.md:12 |
| Node Admin | YES (per permission) | understanding.md:12 |
| Normal User | YES (per permission) | understanding.md:12 |
| Checker | N/A (Checker doesn't create) | understanding.md:14 |

## Auto-approval scope (OPEN: BR-TM-32)

If account has auto-approval configured for the (CommChannel + Category) combination, then on submit:
- Skip Checker step.
- Go directly to PendingMeta (WhatsApp) OR Approved (other channels).

Where is auto-approval configured? PRD silent. Flag as Q-TM-AUTO-APPROVAL-SCOPE.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
