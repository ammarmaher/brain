*** Create Contact Group — Permissions ***
*** 2026-05-18 ***

# Create Contact Group — Permissions

## Per-PRD BR-CGM-13..19

| Role | Can Create? |
|---|---|
| Falcon System Admin | **NO** (BR-CGM-13) |
| Falcon Operation | **NO** |
| Falcon Product | **NO** |
| Client AO (creator) | YES |
| Client Node Admin (creator) | YES |
| Client Normal User (creator) | YES |
| Client AO (not creator role) | YES (per BR-CGM-15 — AO can always create) |
| Client Node Admin (not creator role) | YES (per BR-CGM-17) |
| Client Normal User (not creator role) | YES (per BR-CGM-19) |

So all client usertypes can create. Only Falcon usertypes cannot.

## Route guards

- `authGuard`
- `clientConsoleGuard` (management-console scope)
- `FalconAccess.contactGroup.create()` PES (NEW UI must add)

## Per-PRD tab visibility (BR-CGM-20..23)

[PRD] BR-CGM-20: AO/NA on own node → 1 tab "Contact Groups".
[PRD] BR-CGM-21: NU on own node → 2 tabs "Contact Groups" + "Shared Groups".
[PRD] BR-CGM-22: AO/NA on sub-node hierarchy → 1 tab.
[PRD] BR-CGM-23: Falcon → must select Main node first; 1 tab; view-only.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · `../contact-groups-list/01-PERMISSIONS.md`
