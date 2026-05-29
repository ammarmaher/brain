*** Login — Validations ***
*** 2026-05-18 ***

# Login — Validations

## V-rules per stage

| V-rule | Stage | Source | FE | BE |
|---|---|---|---|---|
| `V-login-username-required` | 1 | required | `Validators.required` | `[Required]` |
| `V-login-password-required` | 1 | required | `Validators.required` | `[Required]` |
| `V-otp-length` | 2 | length === 6 | `Validators.minLength(6) + maxLength(6)` | `[Length(6)]` |
| `V-password-complexity-normal` | 3 | account level=Normal: 8+ chars | custom validator | `[ComplexityNormal]` |
| `V-password-complexity-advanced` | 3 | account level=Advanced: 12+ chars + upper + lower + digit + special | custom | `[ComplexityAdvanced]` |
| `V-password-match` | 3 | newPassword === confirmPassword | `passwordMatchValidator` | (n/a — FE-only) |

## passwordMatchValidator (custom)

```typescript
function passwordMatchValidator(group: FormGroup): ValidationErrors | null {
  const newPwd = group.get('newPassword')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return newPwd === confirm ? null : { passwordMismatch: true };
}
```

## OTP auto-submit on completion

[CODE] `EnterOtpComponent` watches `valueChanges` for length 6 → auto-submit.

## Reactive Forms (good pattern!)

[CODE] Auth feature is one of the few in old-UI that uses Reactive Forms (not template-driven). Keep this in NEW UI.

## See also

- [02-STAGE_1_GET_STARTED](02-STAGE_1_GET_STARTED.md) · [03-STAGE_2_ENTER_OTP](03-STAGE_2_ENTER_OTP.md) · [04-STAGE_3_FIRST_LOGIN_PASSWORD](04-STAGE_3_FIRST_LOGIN_PASSWORD.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
