*** My Profile — Permissions ***
*** 2026-05-18 ***

# My Profile — Permissions

## Route guard

- `authGuard` — must be authenticated.

## No PES checks

Self-edit is always allowed for own profile. No per-action PES.

## Per-role

| Role | Can view My Profile | Can edit fields per BR-UM-41 |
|---|---|---|
| Falcon System Admin | YES | YES (excluding Role/Status/PG) |
| Falcon Operation | YES | YES |
| Falcon Product | YES | YES |
| Account Owner | YES | YES |
| Node Admin | YES | YES |
| Normal User | YES | YES |

Every authenticated user has access to their own My Profile.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · `../edit-user/01-PERMISSIONS.md`
