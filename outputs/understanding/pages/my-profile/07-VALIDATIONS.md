*** My Profile — Validations ***
*** 2026-05-18 ***

# My Profile — Validations

## V-rules

Same V-rules as Edit User Personal Info tab. See [../edit-user/07-VALIDATIONS.md](../edit-user/07-VALIDATIONS.md).

The Role/Status/PermissionGroup V-rules do NOT apply here (those fields are hidden).

## Specific to My Profile

| V-rule | Where | Effect |
|---|---|---|
| `V-mp-self-edit-only` | route guard | URL is `/profile` (not `/profile/:userId`) — backend uses JWT, not URL param |

## See also

- `../edit-user/07-VALIDATIONS.md`
