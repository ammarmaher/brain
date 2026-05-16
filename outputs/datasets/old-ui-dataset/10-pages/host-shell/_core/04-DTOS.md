# DTOs — host-shell core

## Auth Request DTOs (`apps/host-shell/src/app/core/auth/auth.models.ts`)

### LoginRequest (line 23-26)
```typescript
interface LoginRequest {
  username: string; // C# "Username" → camelCase
  password: string;
}
```
Used by: `AuthApiService.login()`

### VerifyOtpRequest (line 45-48)
```typescript
interface VerifyOtpRequest {
  sessionId: string; // Guid as string
  code: string;
}
```
Used by: `AuthApiService.verifyOtp()`

### ResendOtpRequest (line 50-52)
```typescript
interface ResendOtpRequest {
  sessionId: string;
}
```
Used by: `AuthApiService.resendOtp()`

### ForgotPasswordRequest (line 55-59)
```typescript
interface ForgotPasswordRequest {
  username: string;
  phoneNumber: string;
  deliveryMethod: number; // 1=Email, 2=SMS, 3=Both
}
```
Used by: `AuthApiService.forgotPassword()`

### ForgotPasswordSetPasswordRequest (line 61-64)
```typescript
interface ForgotPasswordSetPasswordRequest {
  sessionId: string;
  newPassword: string;
}
```
Used by: `AuthApiService.forgotPasswordSetPassword()`

### FirstLoginSetupRequest (line 76-79)
```typescript
interface FirstLoginSetupRequest {
  sessionId: string; // Guid as string
  newPassword: string;
}
```
Used by: `AuthApiService.firstLogin()`

### SetPasswordRequest (line 83-87)
```typescript
interface SetPasswordRequest {
  sessionId: string; // Guid as string
  newPassword: string;
  confirmPassword: string;
}
```
Used by: `AuthApiService.setPassword()`

## Auth Response DTOs

### AuthenticatedResult (line 16-20)
```typescript
interface AuthenticatedResult {
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number;
}
```
Used by: `auth/refresh-token` response, `LoginStepResult.tokens`

### LoginStepResult (line 28-42)
```typescript
interface LoginStepResult {
  sessionId: string;
  stage: AuthenticationStage;
  requiresOtp: boolean;
  requiresPasswordChange: boolean;
  otpCodeLength: number | null;
  otpExpiresInSeconds: number | null;
  tokens: AuthenticatedResult | null;
  devOtpCode: string | null;
  otpCode: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  expiresIn: number | null;
}
```
Returned by: `auth/login`, `auth/verify-otp`, `auth/resend-otp`, `auth/forgot-password`, `auth/first-login`

### AuthSessionResult (line 66-73)
```typescript
interface AuthSessionResult {
  sessionId: string | null;
  sessionToken: string | null;
  accessToken: string | null;
  idToken: string | null;
  isMfaRequired: boolean;
  isPasswordChangeRequired: boolean;
}
```
(declared but not currently referenced in code; potential legacy DTO)

## Auth Enums

### AuthenticationStage (line 6-13)
```typescript
enum AuthenticationStage {
  PasswordPending = 1,
  OtpPending = 2,
  PasswordChangeRequired = 3,
  Authenticated = 4,
  Failed = 5,
  OtpVerified = 6,
}
```

## User Request DTOs (`apps/host-shell/src/app/core/user/user.models.ts`)

### CreateUserRequest (line 149-158)
```typescript
interface CreateUserRequest {
  personalInfo: UserPersonalInformation;
  permissionGroupId: string;
  deliveryMethod: number; // eDeliveryMethod
  roleKey: string;
  tenantId: string | null;
  nodeId: string | null;
  path?: string | null;
}
```

### UserPersonalInformation (nested in CreateUserRequest, line 134-142)
```typescript
interface UserPersonalInformation {
  firstName: string;
  lastName: string;
  userName: string; // C# "UserName" (two words) → camelCase
  nationalId: string;
  phoneNumber: string;
  email: string;
  profilePictureInfo: ProfilePictureInfo;
}
```

### ProfilePictureInfo (class — line 123-126)
```typescript
class ProfilePictureInfo {
  extension?: string | null;
  fileBase64String?: string | null;
}
```

### UserExistRequest (line 165-169)
```typescript
interface UserExistRequest {
  username: string | null;
  email: string | null;
  phoneNumber: string | null;
}
```

### GeneratePasswordRequest (line 176-178)
```typescript
interface GeneratePasswordRequest {
  passwordSecurityLevel: number; // ePasswordSecurityLevel
}
```

### ChangeUserStatusRequest (line 185-188)
```typescript
interface ChangeUserStatusRequest {
  userId: string;
  newStatus: number; // eUserStatus
}
```

### UpdateUserProfileRequest (line 197-205)
```typescript
interface UpdateUserProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  nationalId: string;
  email: string;
  profilePictureInfo?: ProfilePictureInfo | null;
  deleteImage?: boolean;
}
```

### UpdateUserRoleRequest (line 212-214)
```typescript
interface UpdateUserRoleRequest {
  roleKey: string;
}
```

### GetUsersByNodeRequest (line 221-223)
```typescript
interface GetUsersByNodeRequest {
  nodeId: string | null;
}
```

### ChangePasswordRequest (layout — `change-password.models.ts:4-8`)
```typescript
interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
```

## User Response DTOs

### UserResponse (line 28-47)
```typescript
interface UserResponse {
  id: string;
  nodeId: string | null;
  firstName: string;
  lastName: string;
  username: string;
  email: string | null;
  phoneNumber: string | null;
  roleKey: string;
  userType: number;
  status: number;
  permissionGroup: string;
  tenantId: string;
  nationalId: string | null;
  image: string | null;
  createdAt: string; // ISO 8601
  createdBy: string | null;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
}
```

### UserInfoResponse (line 54-67)
```typescript
interface UserInfoResponse {
  id: string;
  nodeId: string | null;
  firstName: string;
  lastName: string;
  username: string;
  email: string | null;
  phoneNumber: string | null;
  roleKey: string;
  userType: number;
  status: number;
  permissionGroup: string;
  path: string | null;
}
```

### PagedResponse<T> (line 70-75)
```typescript
interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
```

### CreateUserResponse (line 82-96)
```typescript
interface CreateUserResponse {
  id: string;
  nodeId: string | null;
  firstName: string;
  lastName: string;
  username: string;
  email: string | null;
  phoneNumber: string | null;
  roleKey: string;
  userType: number;
  tenantId: string;
  image: string | null;
  createdAt: string;
  createdBy: string | null;
}
```

### ExistResponse (line 103-105)
```typescript
interface ExistResponse {
  exist: boolean;
}
```

### GeneratePasswordResponse (line 112-114)
```typescript
interface GeneratePasswordResponse {
  password: string;
}
```

## Re-exported enums (from `@falcon`)
- `UserType`, `DeliveryMethod`, `PasswordSecurityLevel`, `UserStatus` re-exported by `user.models.ts:11-18`.

## Layout / nav DTOs (`apps/host-shell/src/app/layout/model/models.ts`)

### NavItem (line 6-21)
```typescript
interface NavItem {
  label: string;
  path: string;
  iconClass: string;
  exact?: boolean;
  disabled?: boolean;
  section?: string;
  badge?: string;
  hidden?: boolean;
  scope?: AppRouteScope;
  requiredUserTypes?: UserTypeString[];
  access?: AccessQuery | AccessQuery[];
  safePath?: string | null; // computed by RouteAccessService
  children?: Array<NavItem>;
}
```

### User (line 23-27)
```typescript
interface User {
  name: string;
  role: string;
  avatar: string;
}
```

### Breadcrumb (line 29-32)
```typescript
interface Breadcrumb {
  label: string;
  url: string;
}
```

## Module-Federation DTOs (`apps/host-shell/src/app/core/services/remote-config.ts`)

### RemoteDefinition (line 3-16)
```typescript
interface RemoteDefinition {
  name: string;
  remoteEntry: string;     // URL to mf-manifest.json or remoteEntry.{js,mjs,json}
  exposedModule: string;   // "./Routes", "./survey-routes", etc.
  routePath: string;       // path segment in host router
  active: boolean;
  framework: string;
  displayName: string;
  exposeType: RemoteExposeType;
  entryType: RemoteEntryType;
  requiredAccess?: AccessQuery[];
  styles?: string[];
}
```

### RemoteExposeType (line 18-23)
```typescript
enum RemoteExposeType {
  Component = 'component',
  Module = 'module',
  Routes = 'routes',
  RoutingModule = 'routingModule',
}
```

### RemoteEntryType (line 28-31)
```typescript
enum RemoteEntryType {
  Manifest = 'manifest',
  RemoteEntry = 'remoteEntry',
}
```

### RemoteConfig (line 25)
```typescript
type RemoteConfig = Record<string, RemoteDefinition>;
```

## Auth-flow temp DTO (`features/auth/services/auth-flow-state.service.ts`)

### LoginDTO (line 3-6)
```typescript
interface LoginDTO {
  userName: string;
  password: string;
}
```

### OtpConfig (line 8-13)
```typescript
interface OtpConfig {
  seconds: number;
  length: number;
}
```

### AuthFlowState (internal, line 18-23)
```typescript
interface AuthFlowState {
  credentials: LoginDTO | null;
  sessionId: string | null;
  otpConfig: OtpConfig;
  firstLogin: boolean;
}
```
Persisted in `sessionStorage` under key `'falcon_auth_flow'`.
