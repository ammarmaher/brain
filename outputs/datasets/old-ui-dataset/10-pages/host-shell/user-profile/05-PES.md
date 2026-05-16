# PES — user-profile

## Permission keys used

### Role-edit matrix (`FalconAccess.userRole.other(sourceRoleKey, targetRoleKey)`)
- Used twice:
  1. **Edit-mode** in `UserProfileComponent.filterRoleOptionsByRoleEditAccess` (`user-profile.component.ts:1162-1183`):
     - Computes one query per (sourceRoleKey, candidateOption.roleKey) pair where `sourceRoleKey = this.originalProfile.roleKey`.
     - Ensures all queries via `accessControlFacade.ensure(queries)`.
     - Filters `roleOptions` to those where `accessControlFacade.can(FalconAccess.userRole.other(sourceRoleKey, option.roleKey)) === true`.
     - Decision lives in `roleSelectionEditable` — when true, the role dropdown is enabled.
  2. **Add-mode** in `RoleStatusStepComponent.filterAssignableRoleOptions` (`role-status-step.component.ts:156-181`):
     - For each candidate role, checks if ANY built-in role of the same target user-type can transition into it.
     - sourceRoleKeys = `SYSTEM_ROLE_KEYS` (when targetUserType=system) OR `ACCOUNT_ROLE_KEYS` (when account).
     - Same `ensure() + can()` pattern.
     - Filtered roleOptions = those where ANY source role can transition to it.

### Implicit access via guarded route
- `/profile` and `/profile/:nodeId` inherit `authGuard` + `shellPrimeAccessGuard` from the LayoutComponent parent.

## AccessControlFacade usage
- File: `user-profile.component.ts:103` (inject) + lines 1174-1182 (ensure + can).
- File: `role-status-step.component.ts:41` (inject) + lines 171-180 (ensure + can).
- Pattern:
```typescript
const queries = options.map((option) =>
  FalconAccess.userRole.other(sourceRoleKey, option.roleKey),
);
try {
  await this.accessControlFacade.ensure(queries);
} catch { return []; }

return options.filter((option) =>
  this.accessControlFacade.can(FalconAccess.userRole.other(sourceRoleKey, option.roleKey)),
);
```

## Route guards
- No additional route-level guards beyond LayoutComponent inheritance.

## Eligibility / Subscription checks
None at the user-profile level.

## Inline access decisions (NOT a FalconAccess query, just business state)

### canEditStatus (`user-profile.component.ts:300-302`)
```typescript
get canEditStatus(): boolean {
  return !!this.nodeId;
}
```
- "Can edit status only when viewing another user (admin edit), never own profile."

### canEditRole (`user-profile.component.ts:304-306`)
```typescript
get canEditRole(): boolean {
  return !!this.nodeId && this.roleSelectionEditable;
}
```
- "Can edit role only when admin-edit mode AND PES says at least one transition is available."

### canEditPermissionGroup (`user-profile.component.ts:308-310`)
```typescript
get canEditPermissionGroup(): boolean {
  return false;
}
```
- Currently disabled (`[INFERRED]` Permissions tab is WIP).

## Profile-OTP contact verification (NOT PES — it's a business rule)
- Email or phone changes (i.e. typed value differs from `originalProfile`) trigger `emailNeedsVerification` / `phoneNeedsVerification`.
- The save button is disabled until OTP verification is completed.
- This is not a PES check, but a soft confirmation flow with the backend's identity service.
