*** My Profile — Overview ***
*** Self-edit variant · 2026-05-18 ***

# My Profile — Overview

> Self-edit own profile at `/profile` (no `:userId`). Re-uses the same `UserProfileComponent` shell as Edit User, but with Role/Status/Permissions tabs hidden per BR-UM-41. Endpoint uses `PUT /api/user/profile` (no `:id` param).

## Source-of-truth

- [PRD] PRD-02 BR-UM-36, BR-UM-41 · `Brain Outputs/prd/modules/02-user-management/BUSINESS_RULES.md:74-86`
- [BRAIN-OUT] Identity `/api/user/profile` · `Brain Outputs/understanding/backend/identity/ENDPOINT_REGISTRY.md:29`
- [CODE] `apps/host-shell/src/app/features/user-profile/user-profile.component.ts`
- [CODE] Old-UI dossier · `Brain Outputs/datasets/old-ui-dataset/10-pages/host-shell/user-profile/`

## Trigger / entry

- **Route:** `/profile` (no nodeId query param)
- **Action:** click avatar/name in header → "My Profile"
- **Pre-condition:** authenticated

## What's editable (BR-UM-41)

| Field | Self-edit | Admin-edit |
|---|---|---|
| First Name | ✓ | ✓ |
| Last Name | ✓ | ✓ |
| Username | (immutable) | (immutable) |
| Email | ✓ (with OTP) | ✓ (with OTP — Q-UM-13) |
| Phone | ✓ (with OTP) | ✓ (with OTP — Q-UM-13) |
| National Id | ✓ | ✓ |
| Profile Picture | ✓ | ✓ |
| Role | ✗ (hidden) | ✓ |
| Status | ✗ (hidden) | ✓ |
| Permission Group | ✗ (hidden) | ✓ |

[PRD] BR-UM-41:
> Same editable set as admin edit EXCEPT Role and Status are NOT editable, and Permission Group is NOT editable.

## Endpoint differences

| Action | Self-edit endpoint | Admin-edit endpoint |
|---|---|---|
| Update profile | `PUT /api/user/profile` | `PUT /api/user/{id}/profile` |
| Verify email | `POST /api/user/me/verify-email` (own contact) | `POST /api/user/me/verify-email` (Q-UM-13 ambiguity) |
| Verify phone | Same | Same |
| Change password | `PUT /api/user/change-password` | N/A (admins cannot per BR-UM-20) |

## Layout (proposed)

```
+----------------------------------------+
|  My Profile                            |
+----------------------------------------+
|                                        |
|  [ Avatar ]   FirstName LastName       |
|               Username (immutable)     |
|                                        |
|  Personal Info                         |
|  ───────────────                       |
|  First Name *  [_____________________] |
|  Last Name *   [_____________________] |
|  Username      [user1234] (lock)       |
|  Email *       [a@b.com] [Verify]      |
|  Phone *       [+966 ...] [Verify]     |
|  National Id   [_____________________] |
|                                        |
|  Security                              |
|  ───────────────                       |
|  [ Change Password ] → /profile/change-password |
|                                        |
|  [ Save ] [ Cancel ]                   |
+----------------------------------------+
```

## See also

- [02-SECTION_PERSONAL_INFO](02-SECTION_PERSONAL_INFO.md) · [03-SECTION_OTP_VERIFICATION](03-SECTION_OTP_VERIFICATION.md) · [05-SECTION_CHANGE_PASSWORD_LINK](05-SECTION_CHANGE_PASSWORD_LINK.md) · [08-BACKEND_API](08-BACKEND_API.md) · `../edit-user/00-OVERVIEW.md`

## Hubs

[[My Profile Flow]] · [[Edit User Flow]] · [[Change Password Flow]] · [[02 User Management]] · [[Identity Service]]
