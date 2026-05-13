*** PRD Understanding - User Management - ENTITIES ***

# 02-user-management - Domain Entities

> Inferred from `latest-prd.md` + `understanding.md`. *Italicized* fields are inferred.

| Entity | Description | Key Fields | Lifecycle Status | Relationships |
|---|---|---|---|---|
| User | A person in Falcon with credentials, role, status. | id, usertype (Falcon\|Client), role (sys-admin\|operation\|product\|account-owner\|node-admin\|normal-user), firstName, lastName, username (unique, immutable), email, phoneNumber, passwordHash, profilePicture?, status, permissionGroupId, nodeId, tenantId, createdAt, updatedAt, lastLoginAt, isEmailVerified, isPhoneVerified | Pending -> Active -> {Suspended,Locked,Deleted}; Locked -> Pending (manual); Deleted -> Active (Falcon only) | N:1 Node; N:1 PermissionGroup |
| UserStatusHistory | Audit trail of status changes. | userId, fromStatus, toStatus, actor, at, reason | Append-only | N:1 User |
| LoginAttempt | Each authentication attempt for lockout-counter math. | id, userId?, username, ip, success (bool), reason, at | Append-only | N:0..1 User |
| OtpChallenge | Per-purpose OTP session. | id, userId, channel (Email\|Sms), destination, code, expiresAt (60s), attempts, resendCount, purpose (login\|edit-email\|edit-phone\|forgot-password\|first-login) | Active -> Verified / Expired / Failed | N:1 User |
| Session | A live authenticated session (JWT + refresh token state). | id, userId, ipAtLogin, createdAt, lastActivityAt, idleTimeoutAt (createdAt + 30 min), refreshTokenId | Active -> Expired (logout / idle / forced) | N:1 User |
| PermissionGroup | Named bundle of permissions assigned to one or more users. | id, name, tenantId?, permissions[] (per `Permission list - Jawad` shape: Menu Item / Page Tab / Function/Action / value per role) | Active / Archived (inferred) | 1:N User |
| Permission | A single (Menu Item, Page Tab, Function/Action, Role, Value) tuple. | menuItem, pageTab, functionAction, role, value (Allow\|NotAllow\|Deny\|CanBeOverriddenByDeny) | n/a | N:1 PermissionGroup |
| PasswordPolicy | Embedded in AccountSettings (01-account-management) but consumed here. | passwordSecurityLevel (Normal\|Advanced), complexity rules (per sheet referenced in PRD) | n/a | 1:1 Account |
| AppSetting | System-wide global settings. | id, key, value | n/a | N:0 (singleton-ish) |
| OtpAppSetting | Specific instance: OTP length (4 or 6), editable by Operation. | otpLength | n/a | extends AppSetting |

## Relationship summary

```
Account (01-account-management)
  ├─ User × N
  │   ├─ PermissionGroup × 1
  │   │   └─ Permission × N
  │   ├─ Session × N (Active)
  │   ├─ OtpChallenge × N (active or recent)
  │   ├─ LoginAttempt × N (audit)
  │   └─ UserStatusHistory × N (audit)
  └─ AccountSettings.passwordSecurityLevel ─→ User.password complexity check
```

## Status enumeration

- **User.status** (`eUserStatus` per Identity backend): `Active`, `Pending`, `Locked`, `Suspended`, `Deleted`.
- **User.role** (`eUserRoles` per Identity backend): one of sys-admin, operation, product, account-owner, node-admin, normal-user. Canonical identifier going forward is the string **RoleKey** (per `UserRolePolicy.GetRoleFromRoleKey` in Identity).
- **User.usertype** (`eUserType`): `Falcon`, `Client`. Drives tenant-scoping decisions in handlers.
- **OtpChallenge.purpose**: login / first-login / edit-email / edit-phone / forgot-password.
- **OtpChallenge.channel** (`eDeliveryMethod`): Email / Sms.
- **eAuthenticationStage** (returned via `LoginStepResponse.Stage`): InProgress / OtpRequired / PasswordChangeRequired / Authenticated.
- **PasswordSecurityLevel** (`ePasswordSecurityLevel`): Normal, Advanced (PRD wording) — Identity uses Low / Medium / High / Strict; cross-reference QUESTIONS.md Q-UM-12.
- **Permission value**: Allow / Not Allow / Deny / Can be overridden by Deny.

## Tenant + Path

Per Identity DTOs (`UserResponse`, `ListNodeUsersRequest`), the User entity carries:
- `TenantId` — opaque identifier from Zitadel.
- `Path` — node-path string (for hierarchy enrichment); used by Gateways for east-west user lookups.
- `NodeId` — node this user belongs to (root for Falcon, main/sub for Client).

The `currentUser` injected at the FastEndpoints layer reads usertype + tenantId + path from the JWT.
