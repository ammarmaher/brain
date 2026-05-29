*** Templates List — Permissions ***
*** 2026-05-18 ***

# Templates List — Permissions

## Route guards (NEW UI proposed)

- `authGuard` (always)
- Either `adminConsoleGuard` (Falcon view-only) OR `clientConsoleGuard` (Client makers)
- Feature-level: `FalconAccess.templates.list()` (NEW)

## Per-role matrix per PRD-05

[PRD] BR-TM-01 + understanding.md:11-14:

| Action | Falcon | AO | Node Admin | Normal User | Checker |
|---|---|---|---|---|---|
| List templates | View | YES | YES | YES (own?) | YES |
| Create template | NO | YES (Maker default) | per permission | per permission | N/A |
| Submit for approval | NO | YES (own Maker) | per permission | per permission | N/A |
| Approve / Reject internally | NO | NO unless also Checker | NO unless Checker | NO unless Checker | YES |
| Delete | NO | YES (own pending) | per permission | per permission | NO |

## PES queries (NEW — needed in design)

- `FalconAccess.templates.create(channel)` — gate "+ Create Template" per channel
- `FalconAccess.templates.edit(templateId)` — gate Edit
- `FalconAccess.templates.approve(templateId)` — gate Approve
- `FalconAccess.templates.reject(templateId)` — gate Reject
- `FalconAccess.templates.delete(templateId)` — gate Delete
- `FalconAccess.templates.view(templateId)` — gate View

## Checker assignment (open question)

Q-TM-XX: How is Checker role assigned? PRD silent on whether:
- It's a global role
- Per-account permission group
- Per-CommChannel permission

Flagged in [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md).

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
