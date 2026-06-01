*** My Profile — Error states ***
*** 2026-05-18 ***

# My Profile — Error States

## Same as Edit User Personal Info errors

[See [../edit-user/12-ERROR_STATES.md](../edit-user/12-ERROR_STATES.md)]:

| FalconKey | UX |
|---|---|
| `Error.User.EmailAndPhoneSimultaneousEdit` | Toast: "Update email and phone separately." |
| `Error.User.EmailNotVerified` | Toast: "Verify your new email first." |
| `Error.User.PhoneNotVerified` | Toast: "Verify your new phone first." |
| `Error.Validation.InvalidEmail` | Inline |
| `Error.Validation.InvalidPhone` | Inline |
| `Error.Validation.LettersOnly` | Inline |
| `Error.Validation.ImageTooLarge` | Inline |
| `Error.OTP.IncorrectCode` | OTP modal inline |
| `Error.OTP.Expired` | OTP modal "Resend?" |

## No partial-save recovery (only 1 endpoint)

Unlike Edit User (3-endpoint chain), My Profile saves via single `PUT /api/user/profile`. So no partial-state recovery needed.

## See also

- `../edit-user/12-ERROR_STATES.md`
