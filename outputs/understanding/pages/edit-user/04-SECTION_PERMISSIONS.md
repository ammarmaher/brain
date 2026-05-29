*** Edit User — Section: Permissions tab ***
*** SoT for the Permissions tab · 2026-05-17 ***

# Edit User — Permissions tab

> Tab 3 of 3. **Currently WIP in old-UI** ([CODE] `canEditPermissionGroup = false` at `user-profile.component.ts:308-310`). New UI must wire this per [PRD] BR-UM-40.

## Status in old-UI

[CODE] `apps/host-shell/.../user-profile/components/add-user-wizard/steps/permissions-privilege-step/permissions-privilege-step.component.ts:14-61`:

- Component exists but is NOT in the active stepper config ([CODE] `add-user-wizard.component.ts:105-117` — only Personal + Role-Status).
- Hardcoded mock options: Admin Group, Editor Group, Viewer Group.
- No PES query, no real endpoint call.

> Tag: `[INFERRED]` — Permissions tab is staged for future work; new UI implementation should target PRD-02 BR-UM-40 + BR-UM-42 directly.

## Fields

| Field | Editable | Backend field | Endpoint |
|---|---|---|---|
| `permissionGroup` | YES (admin) | `UpdateUserProfileByIdRequest.PermissionGroup` OR dedicated endpoint TBD | `PUT /api/user/{id}/profile` (likely) OR new `PUT /api/user/{id}/permission-group` |

[PRD] BR-UM-42 (`Brain Outputs/prd/modules/02-user-management/BUSINESS_RULES.md:90-92`):
> Permission Group is assigned at user create + editable thereafter; one group per user.

[PRD] BR-UM-43:
> The `Permission list - Jawad` sheet is the authoritative role→action matrix. PRD prose is secondary.

## Catalog source — UNRESOLVED

No `/pes/permission-groups` endpoint exists in the [BRAIN-OUT] identity dossier. Old-UI hardcodes. Halt-and-flag for clarification:

- Where does the catalog of permission groups come from?
- Is it per-account (defined by AO) or system-wide (defined by Falcon)?
- Does the catalog vary by usertype?

→ Flagged as `Q-UM-PERM-CATALOG` in [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md).

## UI shape (proposed)

```
+----------------------------------+
| Personal Info | Role & Status | Permissions |
+----------------------------------+
|                                  |
|  Permission Group *  [ Admin Group ▼ ]  |
|                                  |
|  Effective permissions (read-only):     |
|  ☑ commerce.create-client       |
|  ☑ commerce.edit-client         |
|  ☐ commerce.delete-client       |
|  ...                             |
|                                  |
|  [ Save ] [ Cancel ]             |
+----------------------------------+
```

## Falcon component composition (proposed)

| Element | Falcon component | Notes |
|---|---|---|
| Group dropdown | `<falcon-select>` | options from PES catalog (TBD) |
| Effective permissions list | `<falcon-checkbox>` (read-only) | preview the group's permission set |

## Save dispatch

[INFERRED] Permission Group change will use the same `PUT /api/user/{id}/profile` endpoint, adding `PermissionGroup` to the payload. Identity DTO currently has `assignedPermissionGroup` returned but no update field exposed — backend addition needed.

## See also

- [01-PERMISSIONS](01-PERMISSIONS.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) · [README](README.md)
