# DTOs — user-profile

## Screen-level DTOs

### UserProfile (`user-profile.models.ts:6-23`)
```typescript
interface UserProfile {
  firstName: string;
  lastName: string;
  userName: string;
  tenantId?: string;
  userType?: string | number;
  nationalId: string;
  phoneNumber: string;
  email: string;
  picture?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  /** Role & Status tab */
  userStatus?: number;
  roleKey?: string;
  /** Permissions tab */
  assignedPermissionGroup?: string;
}
```
- Mapped from backend `UserResponse` by `UserProfileService.mapToUserProfile()`:
  - `r.username → userName`
  - `r.image → picture`
  - `r.status → userStatus`
  - `r.isEmailVerified → emailVerified`
  - `r.isPhoneVerified → phoneVerified`
  - `r.permissionGroup → assignedPermissionGroup`

### SaveUserProfileRequest (`user-profile.models.ts:28-43`)
```typescript
interface SaveUserProfileRequest {
  firstName: string;
  lastName: string;
  userName: string;
  tenantId?: string;
  userType?: string | number;
  nationalId: string;
  phoneNumber: string;
  email: string;
  userStatus?: number;
  roleKey?: string;
  assignedPermissionGroup?: string;
  picture?: string;
  profilePictureInfo?: ProfilePictureInfo | null;
  deleteImage?: boolean;
}
```

### ProfilePageMode enum (`user-profile.models.ts:51-55`)
```typescript
enum ProfilePageMode {
  View = 'view',
  Edit = 'edit',
  Add = 'add',
}
```

## Wizard DTOs (`components/add-user-wizard/models/`)

### UserCreateRequest (`user-create-request.model.ts:5-15`)
```typescript
interface UserCreateRequest {
  nodeId?: string | null;
  path?: string | null;
  tenantId?: string | null;
  personalInfo: PersonalInformationModel;
  roleStatus: RoleStatusModel;
  deliveryMethod?: DeliveryMethod;
}
```

### PersonalInformationModel (`personal-information.model.ts:1-11`)
```typescript
interface PersonalInformationModel {
  firstName: string;
  lastName: string;
  userName: string;
  // password?: string;        // disabled — commented out
  nationalId: string;
  phoneNumber: string;
  email: string;
  profilePictureUrl?: string | null;
  profilePictureInfo?: { extension?: string; fileBase64String?: string } | null;
}
```

### RoleStatusModel (`role-status.model.ts:1-4`)
```typescript
interface RoleStatusModel {
  userStatus?: number;
  roleKey?: string;
}
```

## Node-API DTO (`models/node-api.models.ts`)

### GetNodeResponse (line 8-18)
```typescript
interface GetNodeResponse {
  id: string;
  label: string;
  tenantId?: string | null;
  icon?: string;
  url?: string;
  hasChildren: boolean;
  path?: string | null;
  children?: GetNodeResponse[];
  [key: string]: unknown;  // open-ended for backend-added fields
}
```

## Profile-OTP DTOs (`models/profile-otp.models.ts`)

### SendProfileOtpRequest (line 11-16)
```typescript
interface SendProfileOtpRequest {
  field: VerifiableField;
  value: string;  // kept for UI display, NOT sent to backend
}
```

### VerifyProfileOtpRequest (line 28-32)
```typescript
interface VerifyProfileOtpRequest {
  field: VerifiableField;
  value: string;
  otp: string;
}
```

### Response aliases (line 21, 37)
```typescript
type SendProfileOtpResponse = boolean;
type VerifyProfileOtpResponse = boolean;
```

Re-exports `VerifiableField` from `@falcon` (line 1, 4).

## Role-catalog DTOs (`services/role-catalog.service.ts`)

### RoleCatalogItem (line 5-12)
```typescript
interface RoleCatalogItem {
  id?: string;
  tenantId?: string | null;
  englishName: string;
  arabicName: string;
  roleKey: string;
  isBuiltIn: boolean;
}
```

### RoleOption (line 14-19)
```typescript
interface RoleOption {
  label: string;
  value: string;
  roleKey: string;
  isBuiltIn: boolean;
}
```

### TargetRoleUserType (line 21)
```typescript
type TargetRoleUserType = 'system' | 'account';
```

## Re-exported from `@falcon`
- `OrgHierarchyNode` — used by org-hierarchy.api.service + mapper
- `OrgNodeAction` — used by user-profile.component
- `VerifiableField` — used by ProfileOtpModal + UserProfileComponent
- `OtpScreenState`, `OTP_DEFAULTS`, `FlowStep` — used by ProfileOtpModal
- `FALCON_ROOT_NODE` — Falcon-user virtual root
- `UserStatus`, `UserStatusI18n` — status enum + i18n keys
- `Hook<T>` — generic name/value option type
- `AccessQuery`, `FalconAccess` — PES query builder
- `USER_TYPE_STRINGS`, `SYSTEM_ROLE_KEYS`, `ACCOUNT_ROLE_KEYS` — string constants for matrix lookup
- `AttachmentRequestModel` — file-upload payload
- `FALCON_PATTERNS.EMAIL_STRING` — email regex used by personal-information step
- `SelectedNodeInfo`, `StepperConfig`, `DeliveryMethod` — wizard contracts

## Re-exported from host core
- `ProfilePictureInfo`, `UpdateUserProfileRequest`, `UpdateUserRoleRequest`, `UserResponse`, `CreateUserRequest`, `CreateUserResponse` — from `apps/host-shell/src/app/core/user/user.models.ts` (see `_core/04-DTOS.md`).
