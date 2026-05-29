*** Edit User — Section: Role & Status tab ***
*** SoT for the Role & Status tab · 2026-05-17 ***

# Edit User — Role & Status tab

> Tab 2 of 3. Editable by admin only ([CODE] `canEditStatus = !!nodeId`). Hidden in My Profile flow per BR-UM-41.

## Fields

| Field | Editable | Constraint | Backend field | Endpoint |
|---|---|---|---|---|
| `userStatus` | YES (admin) | Per BR-UM-08 transition matrix | `ChangeUserStatusRequest.NewStatus` (eUserStatus enum int) | `PUT /api/user/status` |
| `roleKey` | YES (admin, PES-gated) | Per `userRole.other(src,tgt)` matrix | `UpdateUserRoleByIdRequest.RoleKey` | `PUT /api/user/{id}/role` |

## Status dropdown — `UserStatus` enum

[BRAIN-OUT] `Brain Outputs/prd/modules/02-user-management/ENTITIES.md` + [CODE] `apps/host-shell/.../user-profile.component.ts:1116-1119` (`Helper.enumToOptions(UserStatus, UserStatusI18n)`):

| Value | i18n Key | Notes |
|---|---|---|
| `Pending` | `userStatus.pending` | Fresh-create state · system-set only · admin cannot manually set |
| `Active` | `userStatus.active` | Normal operating state |
| `Suspended` | `userStatus.suspended` | Manual freeze · reversible |
| `Locked` | `userStatus.locked` | Auto via 3-wrong attempts OR manual; reversible to Pending |
| `Deleted` | `userStatus.deleted` | Soft-delete · Falcon usertype only can restore to Active per BR-UM-08 |

### Allowed transitions (BR-UM-08)

```
       Pending ◄──── Locked
          │            ▲
          │            │ (auto: ≥3 wrong attempts BR-UM-25)
          ▼            │
      [Active] ◄──── [any manual]
       ▲     ▲
       │     │
   Suspended Deleted (Deleted→Active: Falcon only)
       ▲     ▲
       └──[Active]──┘
```

**FE must filter** status options to only those reachable from `originalProfile.userStatus`. Old-UI does NOT do this filter — it shows full enum and relies on backend to reject ([CODE] `user-profile.component.ts:1116`). New UI MUST filter ([F-001] FE enforces tighter).

## Role dropdown — PES-filtered

[CODE] `user-profile.component.ts:1162-1183`:

```typescript
private async filterRoleOptionsByRoleEditAccess(): Promise<void> {
  const sourceRoleKey = this.originalProfile?.roleKey;
  if (!sourceRoleKey) return;

  const candidates = this.roleOptions;
  const queries = candidates.map((opt) =>
    FalconAccess.userRole.other(sourceRoleKey, opt.roleKey),
  );

  try {
    await this.accessControlFacade.ensure(queries);
  } catch {
    this.roleSelectionEditable = false;
    return;
  }

  this.roleOptions = candidates.filter((opt) =>
    this.accessControlFacade.can(
      FalconAccess.userRole.other(sourceRoleKey, opt.roleKey),
    ),
  );
  this.roleSelectionEditable = this.roleOptions.length > 0;
}
```

Role catalog source: `RoleCatalogService.getRoles(targetUserType, tenantId)` → `GET <baseURLPes>/pes/roles?targetUserType={system|account}&tenantId={...}` ([CODE] `role-catalog.service.ts:29-45`).

> Note: this PES call **bypasses the gateway** and uses `envConfig.baseURLPes` directly — this is an anti-pattern flagged in [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) GAP-UM-31.

### `RoleOption` shape ([CODE] `role-catalog.service.ts:14-19`)

```typescript
interface RoleOption {
  label: string;     // localized name per current language
  value: string;     // roleKey (sent to backend)
  roleKey: string;   // same as value
  isBuiltIn: boolean;
}
```

### Role-change side effects

| Target role | Backend re-validates | Error if exceeded |
|---|---|---|
| Normal User | Account.MaxNormalUserLimit | `FalconKeys.Error.Account.NormalUserLimitReached` |
| System User | Account.MaxSystemUserLimit | `FalconKeys.Error.Account.SystemUserLimitReached` |
| Account Owner | Singleton constraint (one per account) | `FalconKeys.Error.Account.AccountOwnerAlreadyExists` |

[BRAIN-OUT] inferred from BR-UM-38 + Commerce/Identity DTO contracts.

## Diff detection (`UserProfileService.updateUserProfile`)

[CODE] `apps/host-shell/.../user-profile.service.ts:75-122`:

```typescript
const statusChanged =
  !!userId && payload.userStatus != null &&
  payload.userStatus !== originalProfile.userStatus;

const roleChanged =
  !!userId && !!payload.roleKey &&
  payload.roleKey !== originalProfile.roleKey;
```

Each diff → its own PUT endpoint, chained via `switchMap`. See [08-BACKEND_API](08-BACKEND_API.md).

## UI shape

```
+----------------------------------+
| Personal Info | Role & Status | Permissions |
+----------------------------------+
|                                  |
|  Status *      [ Active ▼ ]      |
|                                  |
|  Role *        [ Normal User ▼ ] |
|                                  |
|  [ Save ] [ Cancel ]             |
+----------------------------------+
```

## Falcon component composition

| Element | Falcon component | Customization |
|---|---|---|
| Status dropdown | `<falcon-select>` | options filtered by BR-UM-08 transitions |
| Role dropdown | `<falcon-select>` | options filtered by PES `userRole.other` |
| Status badge (read-only display) | `<falcon-tag>` | color per status |

## See also

- [01-PERMISSIONS](01-PERMISSIONS.md) · [07-VALIDATIONS](07-VALIDATIONS.md) · [08-BACKEND_API](08-BACKEND_API.md) · [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) · [README](README.md)
