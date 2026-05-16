# Services & APIs — host-shell core

## Services
| Service | File | Singleton? | Purpose |
|---|---|---|---|
| `AuthService` | `apps/host-shell/src/app/core/auth/auth.service.ts:17` | `providedIn: 'root'` | Owns JWT lifecycle, refresh-token coordination, queueing concurrent 401s |
| `AuthApiService` | `apps/host-shell/src/app/core/auth/auth-api.service.ts:23` | `providedIn: 'root'` | Thin HTTP layer for all 7 auth endpoints |
| `TokenStorageService` | `apps/host-shell/src/app/core/auth/token-storage.service.ts:9` | `providedIn: 'root'` | sessionStorage access for `access_token` / `refresh_token` keys |
| `UserApiService` | `apps/host-shell/src/app/core/user/user-api.service.ts:29` | `providedIn: 'root'` | 1:1 with UserController endpoints |
| `ChangePasswordService` (layout) | `apps/host-shell/src/app/layout/components/user-profile-menu/change-password-modal/services/change-password.service.ts:7` | `providedIn: 'root'` | Logged-in user changes their own password |
| `PrimeNGThemeService` | `apps/host-shell/src/app/core/services/prime-ng-theme.service.ts:12` | `providedIn: 'root'` | Sync theme + RTL on `<html>` element |
| `RemoteRouteService` | `apps/host-shell/src/app/core/services/remote-route.service.ts:16` | `providedIn: 'root'` | Loads MF manifest, registers remotes, builds dynamic Route[] |

## HTTP endpoints called (host-core only)

### Auth (Identity Gateway — via `useGateway(Gateway.IdentityGateway)`)

| Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line | Notes |
|---|---|---|---|---|---|---|
| POST | `auth/login` | `AuthApiService.login()` | `LoginRequest` | `ServiceOperationResult<LoginStepResult>` | `auth-api.service.ts:30-36` | `notShowToaster: 'true'` header so component renders inline error |
| POST | `auth/verify-otp` | `AuthApiService.verifyOtp()` | `VerifyOtpRequest` | `ServiceOperationResult<LoginStepResult>` | `auth-api.service.ts:39-45` | `notShowToaster: 'true'` |
| POST | `auth/resend-otp` | `AuthApiService.resendOtp()` | `ResendOtpRequest` | `ServiceOperationResult<LoginStepResult>` | `auth-api.service.ts:48-54` | |
| POST | `auth/forgot-password` | `AuthApiService.forgotPassword()` | `ForgotPasswordRequest` | `ServiceOperationResult<LoginStepResult>` | `auth-api.service.ts:57-63` | |
| POST | `auth/set-password` | `AuthApiService.setPassword()` | `SetPasswordRequest` | `ServiceOperationResult<boolean>` | `auth-api.service.ts:66-72` | |
| POST | `auth/forgot-password/set-password` | `AuthApiService.forgotPasswordSetPassword()` | `ForgotPasswordSetPasswordRequest` | `ServiceOperationResult<boolean>` | `auth-api.service.ts:75-81` | |
| POST | `auth/first-login` | `AuthApiService.firstLogin()` | `FirstLoginSetupRequest` | `ServiceOperationResult<LoginStepResult>` | `auth-api.service.ts:84-90` | |
| POST | `auth/refresh-token` | `AuthApiService.refreshToken()` | `{ refreshToken }` | `ServiceOperationResult<AuthenticatedResult>` | `auth-api.service.ts:97-103` | `notShowToaster: 'true'`; called by `AuthService.refreshTokenIfNeeded()` |

### Profile / User (gateway is dynamic — falls back via `useGateway()` to System/Core based on session.userType)

| Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|
| GET | `identity/user/me` | `UserApiService.getMe()` | n/a | `ServiceOperationResult<UserResponse>` | `user-api.service.ts:44-49` |
| GET | `identity/user/{id}` | `UserApiService.getById(id)` | n/a | `ServiceOperationResult<UserResponse>` | `user-api.service.ts:52-57` |
| GET | `identity/user?NodeId={nodeId}&Role={n}` | `UserApiService.listByNode(nodeId, roles)` | (params) | `ServiceOperationResult<PagedResponse<UserInfoResponse>>` mapped to `UserInfoResponse[]` | `user-api.service.ts:60-82` |
| POST | `identity/user` | `UserApiService.create(payload)` | `CreateUserRequest` | `ServiceOperationResult<CreateUserResponse>` | `user-api.service.ts:87-95` |
| POST | `identity/user/exist` | `UserApiService.checkExist(payload)` | `UserExistRequest` | `ServiceOperationResult<ExistResponse>` | `user-api.service.ts:98-106` |
| POST | `identity/user/generate-password` | `UserApiService.generatePassword(payload)` | `GeneratePasswordRequest` | `ServiceOperationResult<GeneratePasswordResponse>` | `user-api.service.ts:109-117` |
| PUT | `identity/user/status` | `UserApiService.changeStatus(payload)` | `ChangeUserStatusRequest` | `ServiceOperationResult<object>` | `user-api.service.ts:122-130` |
| PUT | `identity/user/profile` | `UserApiService.updateOwnProfile(payload)` | `UpdateUserProfileRequest` | `ServiceOperationResult<boolean>` | `user-api.service.ts:133-141` |
| PUT | `identity/user/{id}/profile` | `UserApiService.updateUserProfile(id, payload)` | `UpdateUserProfileRequest` | `ServiceOperationResult<boolean>` | `user-api.service.ts:144-153` |
| PUT | `identity/user/{id}/role` | `UserApiService.updateUserRole(id, payload)` | `UpdateUserRoleRequest` | `ServiceOperationResult<boolean>` | `user-api.service.ts:156-165` |

### Password change (logged-in user, layout dropdown)

| Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|
| PUT | `identity/user/change-password` | `ChangePasswordService.changePassword(payload)` (layout) | `ChangePasswordRequest` `{oldPassword, newPassword, confirmNewPassword}` | `ServiceOperationResult` | `change-password.service.ts:17-25` |

### Remote-federation manifest fetch (not an API call to the platform)
- GET `/assets/module-federation.manifest.json` via `RemoteRouteService` (`remote-route.service.ts:33-44`).

## Base URL resolution
- Environment vars (`environments/environment.ts:14-40`):
  - dev: `baseURL = 'http://localhost:7045/api/'`, `baseURLPes = 'http://localhost:5296/'`, `baseURLCoreGateway = 'http://localhost:7038'`, `baseURLSystemGateway = 'http://localhost:7256'`, `baseURLChargingGateway = 'http://localhost:7224/api/'`, `baseURLIdentityGateway = 'http://localhost:7777/api/'`
- prod (`environments/environment.prod.ts:1-19`):
  - `baseURL = ''`, `baseURLPes = 'https://pes-api.falconhub.space/'`, `baseURLCoreGateway = 'https://core-api.falconhub.space/'`, `baseURLSystemGateway = 'https://system-api.falconhub.space/'`, `baseURLChargingGateway = 'https://charging-api.falconhub.space/api/'`, `baseURLIdentityGateway = 'https://auth.falconhub.space/api/'`
- Wired into `provideShellEnvConfig(hostRuntimeConfig)` + `RuntimeBaseUrlInterceptor` (both from `@falcon`) → `RuntimeBaseUrlInterceptor` (registered at `app.config.ts:92-96`) inspects the `useGateway()` context tag on the request and prefixes the right gateway URL.
- `useGateway(Gateway.IdentityGateway)` (in `AuthApiService`, `ProfileOtpService`) always routes to Identity Gateway.
- `useGateway()` with no arg (in `UserApiService`, `RoleCatalogService`) falls back to session-based routing — userType=1 (Falcon) → System Gateway, userType=2 (Client) → Core Gateway.

## Auth / interceptors

### RequestInterceptor (`request-interceptor.ts:8-62`)
- Registered at `app.config.ts:82-86`.
- Adds `ngrok-skip-browser-warning: 'true'` when `environment.useNgrok` is set.
- Skips `auth/...` URLs (auth endpoints are `[AllowAnonymous]`).
- For all other URLs, reads `auth.getAccessToken()`:
  - If token is expired OR within 30s of expiry → triggers `AuthService.refreshTokenIfNeeded()`.
  - Else → calls `authTokenService.addTokenToRequest(req, token)` which clones request with `Authorization: Bearer ${token}` + `Cache-Control: 'no-cache'`.
- Already-retried requests (`X-Token-Retried` header) → logout immediately if still expired.

### RequestInterceptor's pair: RuntimeBaseUrlInterceptor (from `@falcon`)
- Registered at `app.config.ts:92-96`.
- Re-writes relative URLs (e.g. `auth/login`, `identity/user/me`) by prepending the gateway-context base URL.

### ResponseInterceptor (`response-interceptor.ts:8-367`)
- Registered at `app.config.ts:97-101`.
- On success (HTTP 2xx):
  - If body `isBulkAction` → handles bulk error array + success message.
  - If `isSuccessful === false` → calls `showBodyErrorMessages(body)` (toast unless `notShowToaster: 'true'` header).
  - Else (and `notShowToaster !== 'true'`) → `displaySuccessToaster(method)` (currently all branches commented out — silent on success).
- On error:
  - HTTP 401 + URL is not `auth/...` + not `X-Token-Retried` → triggers `AuthService.refreshTokenIfNeeded()`.
  - HTTP 401 + already retried → `authService.logout()`.
  - All other statuses → `showHttpErrorToast()` (extracts `ErrorMessages`/`errorMessages`/`Errors`/`errors` arrays, then `Message`/`message`/`Error`/`error` single field, then plain-string body, then generic fallback `"Error N — ..."`).

### Refresh-token coordinator (`AuthService.refreshTokenIfNeeded()`, `auth.service.ts:207-276`)
- Singleton flag `isRefreshing` + `BehaviorSubject<string | null> refreshTokenSubject`.
- First caller hits `authApi.refreshToken(refreshToken)`; concurrent callers queue on the BehaviorSubject and replay with the new token.
- On success: stores `accessToken` + `refreshToken`, calls `sessionProvider.setFromToken(newAccessToken)`, `authFacad.emmitSubjects()` (notifies remotes), reschedules `scheduleSessionTimeout()`, retries original request with `X-Token-Retried: 'true'` header.
- On failure: `logout()` (clears tokens, clears session, navigates to `/login`).

## Backend service mapping (inference)
- `auth/...` → Identity Gateway → Identity Service. `[CODE]` URL prefix `useGateway(Gateway.IdentityGateway)`.
- `identity/user/...` → Identity Gateway → Identity Service. `[CODE]` URL prefix matches Identity controller routes.
- `pes/roles` → PES Service (config has `baseURLPes`). `[CODE]` URL pattern in `RoleCatalogService.getRoles()`.
- `commerce/Node` → Core/System Gateway → Core-Commerce Service (NodeController). `[CODE]` URL prefix `commerce/Node` in `OrgHierarchyApiService.apiEndpoint`.
