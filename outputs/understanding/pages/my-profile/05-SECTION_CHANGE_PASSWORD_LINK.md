*** My Profile — Section: Change Password link ***
*** 2026-05-18 ***

# My Profile — Change Password Link

> The Change Password flow lives in a separate route (`/profile/change-password` or similar). My Profile page provides a navigation link/button.

## UX

```
Security section in My Profile:

  [ Change Password ]   → click → navigate to change-password page
```

## Why separate flow?

[See `pages/change-password/` for full detail]:
- Requires Current Password verification (My Profile doesn't).
- Revokes ALL sessions on success.
- UX is dialog-like — separate route makes navigation cleaner.

## Distinguishing from Edit User

Edit User does NOT have a Change Password link — because admins cannot change others' passwords per BR-UM-20.

## See also

- `../change-password/` · [00-OVERVIEW](00-OVERVIEW.md)
