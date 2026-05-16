---
patternId: PATTERN-12
name: Auth feature SCSS cluster → pure Tailwind templates (sweep)
violatesRules: [R-FE-001, R-FE-002, R-FE-004]
estimatedReach: 5 SCSS files (change-password, enter-otp, forgot-password-flow, get-started, login-layout) + their templates
estimatedEffortPerOccurrence: 35 minutes per SCSS file (template rewrite)
totalEffortHours: ~3
ammarAgent: ammar-web-platform-ui
priority: high
runId: 2026-05-16-overnight-deep-dive
---

## What this pattern is
The entire `apps/host-shell/src/app/features/auth/` cluster still uses SCSS sidecars (R-FE-002 violation) AND raw `<input>` + `<button>` markup (PATTERN-01 + PATTERN-02). This is a single coherent rebuild: each auth screen needs both pattern fixes at once. Treating it as one batched effort avoids two passes through each file.

## Where it appears (top 10 file paths)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\change-password\change-password.component.{ts,html,scss}
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\enter-otp\enter-otp.component.{ts,html,scss}
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\forgot-password-flow\forgot-password-flow.component.{ts,html,scss}
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\get-started\get-started.component.{ts,html,scss}
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\login-layout\login-layout.component.{ts,html,scss}

## What replaces it (the canonical pattern)
Per screen:
1. Apply PATTERN-04: drop the scss, port styles to Tailwind on the template.
2. Apply PATTERN-01: replace `<input>` with `<falcon-angular-input>`.
3. Apply PATTERN-02: replace `<button>` with `<falcon-angular-button>` or use form's submit affordance.
4. Apply PATTERN-06: any hex literal lifted from scss must become a Falcon token.
5. Apply PATTERN-11: replace any `<i class="falcon-icon ...">` with `<falcon-angular-icon>`.
6. Apply PATTERN-07: logical `ms-*/me-*/ps-*/pe-*` instead of physical.

Reference: the org-hierarchy `falcon-org-node-drawer` and the wizard step components already follow this approach.

## Migration steps
1. Pick `enter-otp` first (smallest scss).
2. Rewrite the template using Tailwind + Falcon components, while still on `[closable]` patterns where applicable.
3. Delete the scss + remove `styleUrls`.
4. `nx serve host-shell` and walk through the auth flow.
5. Repeat for `get-started` → `change-password` → `forgot-password-flow` → `login-layout`.
6. Final build + i18n smoke (toggle to Arabic).

## Detection regex
File-glob:
```
apps/host-shell/src/app/features/auth/**/*.component.scss
```

## Falcon components / libs involved
- `<falcon-angular-input>`, `<falcon-angular-button>`, `<falcon-angular-icon>`, optionally `<falcon-angular-otp>`
- `falcon-tailwind-tokens.css` for any new auth-page tokens
- Auth-flow brain spec: `Brain Outputs/understanding/frontend/auth/` (read first to verify flow)

## Risk + verification
- High — the auth flow is the platform entry point; regressing it locks every user out.
- Test every flow end-to-end: login, OTP enter, OTP send, forgot password reset, change password.
- Run against the real Identity service (auth.falconhub.space/api) — DO NOT mock.
