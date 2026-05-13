*** PRD Understanding - User Management - GAPS ***

# 02-user-management - PRD vs Code Gaps

> Cross-references `Brain Outputs\understanding\backend\identity\ENDPOINT_REGISTRY.md` + `DTO_DICTIONARY.md` and `Brain Outputs\understanding\backend\access\ENDPOINT_REGISTRY.md`. `latest-prd.md` is relative to this module.

## Coverage Matrix

| # | PRD Requirement | PRD Citation | Backend Code Location | Status |
|---|---|---|---|---|
| GAP-UM-01 | Add User (3 tabs: Personal Info / Role & Status / Permissions) | latest-prd.md:44-65 | Identity `POST /api/user/` (`CreateUserRequest` carrying `UserPersonalInformation` + `PermissionGroupId` + `RoleKey` + `eDeliveryMethod`) — bound in frontend `add-user-wizard/services/services.ts` | COVERED |
| GAP-UM-02 | First / Last Name <=50, letters only, mandatory | latest-prd.md:47-48 (BR-UM-11) | Identity `CreateUserRequest.PersonalInfo.FirstName/LastName`; validators in `Falcon.Identity` (FluentValidation per BACKEND_SERVICE_MAP) | COVERED (validators exist) |
| GAP-UM-03 | Username <=30, starts with letter, unique | latest-prd.md:49 (BR-UM-12) | Identity `POST /api/user/exist` (`UserExistRequest -> ExistResponse`) — bound in frontend `account-validation.service.ts:56`. Uniqueness + format enforced via validator on create. | COVERED |
| GAP-UM-04 | Auto-generated password per security level | latest-prd.md:52 (BR-UM-15) | Identity `POST /api/user/generate-password` (`GeneratePasswordRequest(PasswordSecurityLevel)` -> `GeneratePasswordResponse(Password)`) — bound in `add-user-wizard/services/services.ts:146`. Vocabulary mismatch: PRD says Normal/Advanced, code says Low/Medium/High/Strict (Q-UM-12). | PARTIAL |
| GAP-UM-05 | Profile picture optional | latest-prd.md:53 (BR-UM-16) | `UserPersonalInformation.ProfilePictureInfo { Extension?, FileBase64String? }`. Both optional. | COVERED (constraints on size/type silent - BR-UM-48) |
| GAP-UM-06 | Status defaults to Pending on create | latest-prd.md:58 (BR-UM-10) | Implied default in Identity create handler. `eUserStatus` has Pending; assumed default. | COVERED (assumed) |
| GAP-UM-07 | Normal-User limit check on create + on role-change-to-NormalUser + on status-change-to-Active | latest-prd.md:62, 100, 42 (BR-UM-09, 17, 38) | Identity `GET /api/user/count?TenantId=&Roles[]=` (east-west); enforcement is presumably in the create / status-change handlers. Limit value lives in Commerce account settings. | UNVERIFIABLE (need handler-level check) |
| GAP-UM-08 | Credential delivery via Email / Phone / Both at create | latest-prd.md:64 (BR-UM-18) | `CreateUserRequest.DeliveryMethod: eDeliveryMethod`. Identity sends per choice. | COVERED |
| GAP-UM-09 | First Login flow (Pending -> Active): IP check -> credentials -> OTP -> force-change-password | latest-prd.md:67-74 (BR-UM-22) | Identity `POST /api/auth/login` -> `LoginStepResponse` carries `Stage, RequiresOtp, RequiresPasswordChange, SessionId, OtpExpiresInSeconds`. Sub-routes `/api/auth/verify-otp`, `/api/auth/first-login`. `IpAllowlistPreProcessor` runs before credentials. | COVERED |
| GAP-UM-10 | Regular Login (Active only) with same IP/OTP path | latest-prd.md:76-78 (BR-UM-23) | Identity `POST /api/auth/login` returns Authenticated stage with tokens directly when no first-time-change needed. | COVERED |
| GAP-UM-11 | IP check runs BEFORE credentials check (BR-UM-24) | latest-prd.md:71 | Identity FastEndpoints `IpAllowlistPreProcessor` documented as pre-processor (before HandleAsync). | COVERED |
| GAP-UM-12 | 3 wrong logins / wrong OTPs / resend-counts -> Locked | latest-prd.md:72-73 (BR-UM-25, 27) | Identity throttle (10/60s on login) + Zitadel-side lockout policy + Identity webhook `/api/webhook/zitadel` consumes `UserLocked` event. | COVERED (split between Zitadel lockout policy and webhook sync) |
| GAP-UM-13 | OTP validity 60s; Resend appears on expiry | latest-prd.md:73 (BR-UM-26) | `LoginStepResponse.OtpExpiresInSeconds`; resend via `POST /api/auth/resend-otp` (`ResendOtpRequest`). | COVERED |
| GAP-UM-14 | OTP length (4 or 6) configurable by Operation | latest-prd.md:119 (BR-UM-28) | `LoginStepResponse.OtpCodeLength` is returned (nullable int). Where this value is configured (DB? appsettings? Operation-editable UI?) is not visible from endpoints. | PARTIAL (config surface unclear) |
| GAP-UM-15 | Forgot Password (Active only) | latest-prd.md:80-85 (BR-UM-30, 31) | Identity `POST /api/auth/forgot-password` (`ForgotPasswordRequest(Username, PhoneNumber, DeliveryMethod) -> LoginStepResponse`), `POST /api/auth/forgot-password/set-password`. | COVERED |
| GAP-UM-16 | Forgot Password wrong OTP is silent (BR-UM-32) | latest-prd.md:84 | Behavior is server-side decision in `VerifyOtpEndpoint`; not directly verifiable from endpoint signature. The PRD/code divergence vs login lockout is the open Q-UM-01. | UNVERIFIABLE |
| GAP-UM-17 | Forgot Password mismatch (Username+Phone) generic alert | latest-prd.md:85 (BR-UM-33) | Server-side return is generic; specific endpoint behavior. | UNVERIFIABLE (likely COVERED) |
| GAP-UM-18 | Change Password (current + new + confirm) | latest-prd.md:87-89 (BR-UM-34) | Identity `PUT /api/user/change-password` (`ChangePasswordRequest`). | COVERED |
| GAP-UM-19 | Force logout after Change Password | latest-prd.md:90 (BR-UM-35) | Identity `ChangePasswordEndpoint` per `ENDPOINT_REGISTRY` note: "Revokes all sessions on success." | COVERED |
| GAP-UM-20 | Edit User (admin) | latest-prd.md:91-105 (BR-UM-36..40) | Identity `PUT /api/user/{id}/profile` (`UpdateUserProfileByIdRequest`), `PUT /api/user/{id}/role`, `PUT /api/user/status`. | COVERED |
| GAP-UM-21 | Edit Email -> OTP to new email; Edit Phone -> OTP to new phone | latest-prd.md:94 (BR-UM-36) | Identity `POST /api/user/me/verify-email` + `/resend` + `/confirm`; same for phone. These are `/me/` paths (self-edit). For admin-edit-another-user, the OTP path is **NOT documented** in the registry. (Q-UM-13) | PARTIAL (self-edit covered; admin-edit path unclear) |
| GAP-UM-22 | Reject save when Email AND Phone modified in same request (BR-UM-21) | latest-prd.md:94 | Not enforceable from DTO inspection; server-side validator must block. The OTP `/me/verify-{email,phone}` are split endpoints, which naturally prevents simultaneous edit via that flow. Profile-update via `PUT /api/user/profile` could carry both — must verify validator. | UNVERIFIABLE |
| GAP-UM-23 | Username is immutable (BR-UM-19) | latest-prd.md:96 | Identity `UpdateUserProfileRequest` shape not fully visible; presumably no `Username` field. | UNVERIFIABLE (likely COVERED) |
| GAP-UM-24 | Role edit (with limit re-check on Normal User) | latest-prd.md:99-100 (BR-UM-38) | Identity `PUT /api/user/{id}/role` (`UpdateUserRoleByIdRequest`). Limit re-check is server-side. | PARTIAL (endpoint exists; limit re-check not visible) |
| GAP-UM-25 | Status edit per allowed transitions; Deleted->Active Falcon only | latest-prd.md:42, 101 (BR-UM-08, 39) | Identity `PUT /api/user/status` (`ChangeUserStatusRequest`). Server-side transition validation. | UNVERIFIABLE (likely COVERED in handler) |
| GAP-UM-26 | Edit Own Profile excludes Role / Status / Permission Group (BR-UM-41) | latest-prd.md:107 | Identity `PUT /api/user/profile` (`UpdateUserProfileRequest`) for self; separate from `/{id}/profile`. Field exclusion is shape-level. | COVERED |
| GAP-UM-27 | 30-min idle logout (BR-UM-29) | latest-prd.md:118 | Not visible in Identity endpoints; presumably JWT expiry + refresh-token TTL. Open Q-UM-04. | UNVERIFIABLE |
| GAP-UM-28 | Permission Group assignment (one per user, BR-UM-42) | latest-prd.md:60-61 | `CreateUserRequest.PermissionGroupId` is a single string; one group per user. Editing via profile update. | COVERED |
| GAP-UM-29 | Permission engine evaluates per-action against role | understanding.md:55-65 | Access (PES) `POST /pes/authorize` + `/pes/authorize/resources` (bound in frontend `access-control.client.ts`). Sheet-to-policy-rule alignment is open Q-AM-16 / Q-UM-15. | PARTIAL (engine exists; alignment with sheet open) |
| GAP-UM-30 | User list with filters (Username, Email, Phone, Role, Status, Permission Group) | understanding.md:18 | Identity `GET /api/user/` (`ListNodeUsersRequest { NodeId, Search, Status[], Role[], TenantId, PathPrefix, PageNumber, PageSize, IncludeDeleted, ExcludeCurrentUser, IgnoreNodeIdFilter }`). The PRD's "Email" and "Phone" filters are **not** explicit query params; presumably `Search` is full-text. | PARTIAL (PRD filters partly mapped to Search; not 1:1) |
| GAP-UM-31 | More Details / View User (read-only) | understanding.md:20 | Identity `GET /api/user/{id}` (`GetUserByIdRequest`) -> `UserResponse`. | COVERED |
| GAP-UM-32 | User soft-delete (Deleted status, not counted in limit) | latest-prd.md:34-40 (BR-UM-07) | Identity uses `eUserStatus.Deleted`; `IncludeDeleted` flag on listings; Falcon-only restore via status change. | COVERED |
| GAP-UM-33 | "Forgot password" while Pending -> alert "please login first" | understanding.md:84 | Server-side validator in `ForgotPasswordEndpoint`. | UNVERIFIABLE |
| GAP-UM-34 | "Contact administrator" alerts include manager info | understanding.md:151 (BR-UM-49) | No endpoint surfaces manager contact info. Frontend likely renders a static message. | UNVERIFIABLE (probably MISSING for personalized info) |
| GAP-UM-35 | Bulk operations on users | Q-UM-11 | No bulk endpoints in Identity. | MISSING |
| GAP-UM-36 | User moved between nodes (cross-hierarchy reassign) | Q-UM-10 | No move-node-of-user endpoint visible. | MISSING |
| GAP-UM-37 | Falcon-only skip-validation for phone/status edit | root-documents/latest-prd.md:26 (Q-UM-16) | No endpoint flag for "skip OTP for Falcon admin". | UNVERIFIABLE (server policy decision) |

## Summary

- **Total rows:** 37.
- **COVERED:** 20.
- **PARTIAL:** 6 (GAP-UM-04, 14, 21, 24, 29, 30).
- **MISSING:** 2 (GAP-UM-35 bulk, GAP-UM-36 move user across hierarchy).
- **UNVERIFIABLE:** 9 (mostly handler-side validators not inspectable from registry alone).

## Quick-win flags

- **GAP-UM-04 / Q-UM-12**: vocabulary mismatch (PRD 2-tier vs code 4-tier). Either rename PRD or collapse `ePasswordSecurityLevel` to 2 values. Pick one and align.
- **GAP-UM-21 / Q-UM-13**: admin-driven email/phone change OTP flow needs explicit endpoint design — today the `/me/` routes are the only OTP flow visible.
- **GAP-UM-30**: PRD filter list (Email, Phone) maps to `Search`; consider whether dedicated query params would simplify the UI.
