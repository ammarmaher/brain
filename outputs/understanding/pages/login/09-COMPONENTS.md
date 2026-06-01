*** Login — Components ***
*** 2026-05-18 ***

# Login — Components

## Component tree

```
LoginLayoutComponent  (shared shell)
├── <header> branding + logo
├── Language selector
├── <router-outlet>
│   ├── GetStartedComponent (default)
│   │   └── Reactive form: <falcon-input> × 2 + <falcon-button>
│   ├── EnterOtpComponent (after login)
│   │   ├── <falcon-otp> (replaces PrimeNG `<p-inputOtp>`)
│   │   └── Timer pill + Resend link
│   ├── ChangePasswordComponent (first-login mode)
│   │   └── Reactive form: <falcon-password> × 2 + <falcon-button>
│   └── ForgotPasswordFlowComponent (see forgot-password folder)
└── <footer> copyright + links
```

## Anti-patterns

- PrimeNG `<p-inputOtp>` → replace with `<falcon-otp>`.
- SCSS files → migrate to Tailwind.
- Reactive Forms — GOOD (keep).

## See also

- [02-STAGE_1_GET_STARTED](02-STAGE_1_GET_STARTED.md) · [03-STAGE_2_ENTER_OTP](03-STAGE_2_ENTER_OTP.md) · [04-STAGE_3_FIRST_LOGIN_PASSWORD](04-STAGE_3_FIRST_LOGIN_PASSWORD.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
