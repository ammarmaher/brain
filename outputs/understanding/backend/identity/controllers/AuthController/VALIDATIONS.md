# AuthController — Validations

> Two layers: **FluentValidation** (cheap, syntactic, auto-discovered) and **Domain Policies**
> (business rules, throw `FalconException`). FastEndpoints runs validators on request bind; failures
> are funneled through `ErrorLocalizer` and returned as `ServiceOperationResult<object>.Failure` (HTTP 400).

## FluentValidation validators

Files in [CODE] `Endpoints/Auth/Validators/`:

### `LoginRequestValidator`
[CODE] `Endpoints/Auth/Validators/LoginRequestValidator.cs:8-20`

```csharp
RuleFor(x => x.Username)
    .NotEmpty().WithMessage(FalconKeys.Error.RequiredFieldMissing)
    .MaximumLength(100).WithMessage(FalconKeys.Error.MaxLengthExceeded);

RuleFor(x => x.Password)
    .NotEmpty().WithMessage(FalconKeys.Error.RequiredFieldMissing)
    .MinimumLength(6).WithMessage(FalconKeys.Error.BelowMinimumLength);
```

**Note:** validator min length is 6, but `PasswordPolicy.Validate` enforces 8 server-side. The 6
is a wire-level minimum to reject obvious noise; the 8 is the real policy floor.

### `VerifyOtpRequestValidator`
[CODE] `VerifyOtpRequestValidator.cs:8-15`

- `SessionId` NotEmpty
- `Code` NotEmpty (no length / format check — server must accept whatever the user types and let
  Zitadel reject. Code length is dictated by `ZitadelOptions.Otp.CodeLength`.)

### `ResendOtpRequestValidator`
[CODE] `ResendOtpRequestValidator.cs:8-14`

- `SessionId` NotEmpty

### `ForgotPasswordRequestValidator`
[CODE] `ForgotPasswordRequestValidator.cs:8-19`

```csharp
RuleFor(x => x.Username).NotEmpty().WithMessage(FalconKeys.Error.RequiredFieldMissing);
RuleFor(x => x.DeliveryMethod).IsInEnum().WithMessage(FalconKeys.Error.InvalidValue);
RuleFor(x => x.PhoneNumber)
    .NotEmpty()
    .When(x => x.DeliveryMethod is eDeliveryMethod.Sms or eDeliveryMethod.Both)
    .WithMessage(FalconKeys.Error.RequiredFieldMissing);
```

Conditional: `PhoneNumber` is required only when delivery is `Sms` or `Both`. (For `Email` delivery
the phone field can be empty — though current code also `PhoneNumber-equals` check happens inside
`ForgotPasswordProcess` regardless. ⚠ The handler still enforces phone match in code — see
ENDPOINTS.md §4. This is a coordination gap between validator-conditional + handler-unconditional.)

### `ForgotPasswordSetPasswordRequestValidator`
[CODE] `ForgotPasswordSetPasswordRequestValidator.cs:8-17`

- `SessionId` NotEmpty
- `NewPassword` NotEmpty + Min 8

### `SetPasswordRequestValidator`
[CODE] `SetPasswordRequestValidator.cs:8-20`

- `SessionId` NotEmpty
- `NewPassword` NotEmpty + Min 8
- `ConfirmPassword` NotEmpty + Equal(`NewPassword`)
  → emits `FalconKeys.Error.PasswordsDoNotMatch` (not the generic `InvalidValue`).

### `FirstLoginSetupRequestValidator`
[CODE] `FirstLoginSetupRequestValidator.cs:8-17`

- `SessionId` NotEmpty
- `NewPassword` NotEmpty + Min 8

### `LogoutRequestValidator`
[CODE] `LogoutRequestValidator.cs:9-17`

- `RefreshToken` NotEmpty.

### `RefreshTokenRequestValidator`
[CODE] `RefreshTokenRequestValidator.cs:8-14`

- `RefreshToken` NotEmpty.

## Domain policies (business rules)

These execute inside command handlers and throw `FalconException`. They are **not** part of
FluentValidation but rather Domain-layer guards.

### `LoginEligibilityPolicy`
[CODE] `Domain/Policies/LoginEligibilityPolicy.cs:14-26`

```csharp
public void Validate(eUserStatus status)
{
    switch (status)
    {
        case eUserStatus.Locked:    throw new FalconException(FalconKeys.Error.UserLocked);
        case eUserStatus.Suspended: throw new FalconException(FalconKeys.Error.UserSuspended);
        case eUserStatus.Deleted:   throw new FalconException(FalconKeys.Error.InvalidCredentials);  // BR-UM-32 silent-deny
    }
}
```

Applied in `LoginProcess.cs:35` and `ForgotPasswordProcess.cs:33`.

### `AuthenticationStagePolicy`
[CODE] `Domain/Policies/AuthenticationStagePolicy.cs:15-21`

```csharp
public eAuthenticationStage Resolve(bool requiresOtp, bool requiresPasswordChange)
{
    if (requiresOtp) return eAuthenticationStage.OtpPending;
    if (requiresPasswordChange) return eAuthenticationStage.PasswordChangeRequired;
    return eAuthenticationStage.Authenticated;
}
```

**Order matters:** OTP wins over password-change. After OTP success, `VerifyOtpProcess.ResolveFlowAsync`
re-checks `RequiresPasswordChange` and routes back to `PasswordChangeRequired` (the bool is preserved
in the session).

### `PasswordPolicy`
[CODE] `Domain/Policies/PasswordPolicy.cs:68-86`

```csharp
public void Validate(string password, ePasswordSecurityLevel? level)
{
    const int minLength = 8;
    if (password.Length < minLength) throw new FalconException(FalconKeys.Error.PasswordTooShort);
    if (!password.Any(char.IsUpper))    throw FalconException(FalconKeys.Error.PasswordRequiresUppercase);
    if (!password.Any(char.IsLower))    throw FalconException(FalconKeys.Error.PasswordRequiresLowercase);
    if (!password.Any(char.IsDigit))    throw FalconException(FalconKeys.Error.PasswordRequiresDigit);
    if (!password.Any(c => !char.IsLetterOrDigit(c))) throw FalconException(FalconKeys.Error.PasswordRequiresSpecialChar);
}
```

**Q-UM-12 resolution:** The PRD describes a 2-tier vocab (`Normal` / `Advanced`); the enum in code
has exactly 2 values (`ePasswordSecurityLevel { Normal=1, Advanced=2 }` at
[CODE] `Domain/Constants/Enums.cs:6-10`). The `level` parameter is currently passed to `Validate` but
not consulted — both levels enforce the same Zitadel-floor rules. The level field is "reserved for
future Advanced-only rules (history, reuse, etc.)" per the doc-comment on
[CODE] `PasswordPolicy.cs:23-25`. **Code and PRD vocabularies match.** Apply F-002 directly: FE shows
PRD labels ("Normal" / "Advanced"); BE accepts the enum codes 1 / 2.

Applied in:
- `FirstLoginSetupProcess.cs:24` (with tenant-settings level)
- `ForgotPasswordSetPasswordHandler.cs:24` (with tenant-settings level)
- `ChangePasswordHandler.cs:24` (Users domain — not Auth)

### Pre-processor: `IpAllowlistPreProcessor`
[CODE] `Endpoints/Auth/PreProcessors/IpAllowlistPreProcessor.cs:10-38`

See `OVERVIEW.md` "Pre-processors" section. Throws `FalconException(IpNotAllowed)` → HTTP 403.

## Cross-field rules

| Rule                                                | Where enforced            | Error                         |
|---|---|---|
| `NewPassword == ConfirmPassword` (set-password)     | Validator (`Equal`) AND handler ([CODE] `SetPasswordHandler.cs:16`) | `PasswordsDoNotMatch` |
| `Username + PhoneNumber` match (forgot-password)    | Handler ([CODE] `ForgotPasswordProcess.cs:26-31`) | `InvalidUsernameOrPhone` (BR-UM-32 silent-deny) |
| Phone required only when delivery includes SMS      | Validator conditional `.When(...)` | `RequiredFieldMissing` |
| Session must be in stage `OtpPending` before verify-otp | Handler ([CODE] `VerifyOtpProcess.cs:20-21`) | `InvalidCredentials` |
| Session must be in stage `PasswordResetPending` before forgot-set | Handler ([CODE] `ForgotPasswordSetPasswordHandler.cs:20-21`) | `InvalidCredentials` |
| OTP resend rate cap (`MaxResendAttempts`)           | Handler ([CODE] `ResendOtpProcess.cs:31-35`) | `OtpResendLimitExceeded` (also locks user) |
| OTP cooldown (within `ExpirySeconds` of `OtpGeneratedAt`) | Handler ([CODE] `ResendOtpProcess.cs:38-42`) | `OtpStillValid` |

## BR-UM-21 cross-field rule (Email AND Phone modified together)

**Not enforced anywhere in the AuthController surface.** This rule applies to the Users surface
(`UpdateMyProfileEndpoint` + `UpdateUserProfileByIdEndpoint`). Reviewed
[CODE] `Application/Users/UseCases/UpdateUserProfileHandler.cs:20-73`:
neither `phoneChanged` nor `emailChanged` are cross-checked. **BR-UM-21 not implemented** in the
current Users handler. See `UserController/VALIDATIONS.md` for the deeper finding.

## Deviations from platform standards

- AuthController has **no `MultiLanguageName(En, Ar)` fields** — error messages are localized,
  payload field labels are not (no `Username[En]` etc.).
- All Auth requests are `record` (Falcon convention).
- `LoginStepResponse` and `AuthenticatedResult` are `class` (mutable) for legacy reasons — every
  handler that constructs one uses object-initializer syntax. Not a convention violation, but
  inconsistent with the surrounding `record` style.
