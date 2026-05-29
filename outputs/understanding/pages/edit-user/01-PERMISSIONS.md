*** Edit User — Permissions ***
*** SoT for who can edit which user · 2026-05-17 ***

# Edit User — Permissions

## Route guards

- `/profile/:nodeId` inherits `authGuard` + `shellPrimeAccessGuard` from `LayoutComponent` parent. ([CODE] `apps/host-shell/.../user-profile/user-profile.component.ts` route definitions).
- No additional route-level guards beyond LayoutComponent inheritance ([CODE] `Brain Outputs/datasets/old-ui-dataset/10-pages/host-shell/user-profile/05-PES.md:38-39`).

## Per-action PES matrix

### Role-edit matrix (`FalconAccess.userRole.other(sourceRoleKey, targetRoleKey)`)

The role dropdown is filtered through this dynamic-PES family. The user can pick a target role only if `accessControlFacade.can(FalconAccess.userRole.other(originalRoleKey, targetRoleKey)) === true`.

[CODE] `apps/host-shell/.../user-profile.component.ts:1162-1183` (`filterRoleOptionsByRoleEditAccess`):

```typescript
const queries = options.map((option) =>
  FalconAccess.userRole.other(sourceRoleKey, option.roleKey),
);
await this.accessControlFacade.ensure(queries);
return options.filter((option) =>
  this.accessControlFacade.can(FalconAccess.userRole.other(sourceRoleKey, option.roleKey)),
);
```

The `roleSelectionEditable` flag is true when at least one transition is available.

### Inline derived rules

| Rule | Code source | Effect |
|---|---|---|
| `canEditStatus = !!nodeId` | [CODE] `user-profile.component.ts:300-302` | Status editable only for admin-edit (i.e. when a `:userId` exists), never self-edit |
| `canEditRole = !!nodeId && roleSelectionEditable` | [CODE] `user-profile.component.ts:304-306` | Role editable only when admin-edit AND PES allows ≥1 transition |
| `canEditPermissionGroup = false` (WIP) | [CODE] `user-profile.component.ts:308-310` | Currently disabled in old-UI; new-UI must wire per BR-UM-40 |

### Per-role guardrails per BR-UM-08 (status transitions)

[PRD] `Brain Outputs/prd/modules/02-user-management/BUSINESS_RULES.md:23` (BR-UM-08):

| From → To | Allowed by |
|---|---|
| Active ↔ Suspended | Any actor with `userRole.other` for the target |
| Active ↔ Locked | Auto OR manual |
| Locked → Pending | Manual |
| Active ↔ Deleted | Any allowed actor |
| Deleted → Active | **Falcon usertype only** (restoration) |

> Falcon's "Deleted → Active" exclusivity is hardcoded business; the FE should enforce this in the status dropdown filter, and the BE rejects via `FalconKeys.Error.User.UnauthorizedStatusTransition`.

### Cross-cutting limits (re-validated per BR-UM-38)

- Changing Role to **Normal User**: re-validates against the account's `MaxNormalUserLimit`. Backend rejects with `FalconKeys.Error.Account.NormalUserLimitReached` if at cap.
- Changing Status to **Active** for a Normal User: same limit check per BR-UM-09.

[BRAIN-OUT] Backend enforcement: `Brain Outputs/understanding/backend/identity/VALIDATIONS.md` — account limit validators.

## Per-role action visibility (PRD-02 derived)

| Action | Falcon System Admin | Falcon Product | Falcon Operation | Account Owner | Node Admin | Normal User |
|---|---|---|---|---|---|---|
| Edit user in own scope | All | All | All (view-only?) | All in own account | Own sub-node | Self only (via My Profile) |
| Restore Deleted user | YES | YES | NO | NO | NO | NO |
| Change user role | per matrix | per matrix | per matrix | per matrix | per matrix | NO |
| Change permission group | YES | YES | YES | YES (if granted) | NO | NO |
| Trigger OTP for own email/phone change | N/A (Falcon use generic email/phone change) | N/A | N/A | YES (`/me/verify-*`) | YES | YES |
| Trigger OTP for OTHER user's email/phone change | **Q-UM-13 OPEN** | **Q-UM-13** | **Q-UM-13** | **Q-UM-13** | **Q-UM-13** | N/A |

[INFERRED] Falcon admins likely bypass OTP for email/phone changes (admin override), but PRD silent — see [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) GAP-UM-21 / Q-UM-13.

## PES query reference

| Query | Used for | Source |
|---|---|---|
| `FalconAccess.userRole.other(srcKey, tgtKey)` | Role dropdown filter | [CODE] `user-profile.component.ts:1162-1183` + `role-status-step.component.ts:156-181` |
| (none) | Status dropdown | Inline `Helper.enumToOptions(UserStatus, UserStatusI18n)` — full enum minus 'none'; BE enforces BR-UM-08 |
| (none) | Permission group dropdown | Hardcoded in old-UI (WIP); should query `pes/permission-groups` or similar |

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [03-SECTION_ROLE_STATUS](03-SECTION_ROLE_STATUS.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) · [README](README.md)

## Hubs

- [[PES Service]] · [[Falcon Roles Permission Matrix]] · [[02 User Management]]
