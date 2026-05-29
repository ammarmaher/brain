*** Login — Error states ***
*** 2026-05-18 ***

# Login — Error States

## Generic errors (info-leak prevention)

[PRD] BR-UM-24: All credential failures return the same generic message.

| Origin | UX |
|---|---|
| Wrong username | "Incorrect username or password." |
| Wrong password | "Incorrect username or password." |
| IP not on allowlist | "Incorrect username or password." (same!) |
| User Suspended | "Your account is suspended. Contact admin." |
| User Locked | "Your account is locked. Contact admin." |
| User Deleted | "Incorrect username or password." (same as wrong user) |

## Specific errors

| FalconKey | UX |
|---|---|
| `Error.Auth.InvalidOtp` | "Incorrect code. Try again." |
| `Error.Auth.OtpExpired` | "Code expired. Resend?" |
| `Error.Auth.LockoutTriggered` | "Your account has been locked. Contact admin." |
| `Error.Auth.SessionExpired` | "Session expired. Please start over." |
| `Error.Auth.PasswordWeak` | "Password does not meet security requirements." (first-login) |
| `Error.Auth.ThrottleExceeded` | 429: "Too many attempts. Try again in a moment." |

## Attempt counter display

After 1 wrong attempt: "Incorrect username or password."
After 2 wrong attempts: "Incorrect username or password. 1 attempt left."
After 3rd wrong: "Your account has been locked."

[INFERRED] Old-UI may not display attempt counter for security reasons.

## See also

- [05-SECTION_IP_ALLOWLIST](05-SECTION_IP_ALLOWLIST.md) · [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
