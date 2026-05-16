---
type: page-dataset
app: host-shell
feature: auth
source: origin/main @ 803ac1d1
extracted: 2026-05-16
extracted-by: P7
---

# Auth (Login / OTP / First-Login Change-Password / Forgot Password)

## TL;DR
The auth feature owns every screen in the unauthenticated user journey: username+password (`/login`), OTP verification (`/login/verify-otp`), forced-first-login password change (`/login/change-password`), and the three-step forgot-password flow (`/login/forgot-password`). All screens are rendered inside the shared `LoginLayoutComponent` (branding + footer + language selector) and orchestrate state across screens via `AuthFlowStateService` (sessionStorage persisted). Backend integration is centralized in `core/auth/AuthApiService` (7 endpoints, all on Identity Gateway). The feature ends by calling `AuthService.handleLoginSuccess(tokens)` which stores the JWT pair, extracts the session, fetches the user's org node, schedules auto-logout, and navigates to the previously-saved redirect URL.

## Manifest
- [[01-ROUTING]] — 5 routes (lazy), 2 guards (otpGuard, changePasswordGuard)
- [[02-COMPONENTS]] — 5 components (LoginLayout, GetStarted, EnterOtp, ChangePassword, ForgotPasswordFlow)
- [[03-SERVICES-APIS]] — 5 services (LoginService, OtpService, ChangePasswordService, ForgotPasswordFlowService, AuthFlowStateService) + AuthApiService (7 endpoints total)
- [[04-DTOS]] — 12 DTOs (screen-level + re-exported core)
- [[05-PES]] — 0 permission checks (all screens are pre-auth)
- [[06-VALIDATIONS]] — 8 form rules (`Validators.required`, custom `passwordMatchValidator`, OTP completeness, email regex `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` inline in `UserProfileComponent`, phone min-7-digits)
- [[07-CROSS-PAGE]] — 9 inbound deps (`@falcon`, core/auth/*, PrimeNG, FalconMobileNumberComponent), 1 outbound (AuthFlowStateService consumed by guards + screens)
- [[08-RULES-APPLIED]] — Reactive forms + standalone components; uses InputOtp from PrimeNG; sessionStorage for transient state; auto-submit on OTP completion; SCSS files

## Source files
| File | Role |
|---|---|
| `apps/host-shell/src/app/features/auth/auth.routes.ts` | AUTH_ROUTES with login-layout shell + child routes |
| `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.ts` | Branding + footer + language selector |
| `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.html` | Template (5-col login card with notch) |
| `apps/host-shell/src/app/features/auth/get-started/get-started.component.ts` | Username/password form (Stage 1) |
| `apps/host-shell/src/app/features/auth/get-started/models/login.models.ts` | LoginRequest screen DTO + re-export |
| `apps/host-shell/src/app/features/auth/get-started/services/login.service.ts` | Screen wrapper that lowercases/trims username |
| `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.ts` | OTP entry with timer + resend (Stage 2) |
| `apps/host-shell/src/app/features/auth/enter-otp/models/otp.models.ts` | CheckOtpRequest / ResendOtpRequest screen DTOs |
| `apps/host-shell/src/app/features/auth/enter-otp/services/otp.service.ts` | Screen wrapper for verify-otp + resend-otp |
| `apps/host-shell/src/app/features/auth/change-password/change-password.component.ts` | First-login password set (Stage 3) |
| `apps/host-shell/src/app/features/auth/change-password/models/change-password.models.ts` | Screen DTOs |
| `apps/host-shell/src/app/features/auth/change-password/services/change-password.service.ts` | Screen wrapper for first-login + set-password |
| `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.ts` | 3-step forgot-password flow |
| `apps/host-shell/src/app/features/auth/forgot-password-flow/models/forgot-password-flow.models.ts` | Screen DTOs |
| `apps/host-shell/src/app/features/auth/forgot-password-flow/services/forgot-password-flow.service.ts` | Screen wrapper for forgot-password + verify-otp + forgot-set-password |
| `apps/host-shell/src/app/features/auth/services/auth-flow-state.service.ts` | sessionStorage-backed multi-screen state |
| `apps/host-shell/src/app/features/auth/guards/otp.guard.ts` | Guards `/login/verify-otp` route |
| `apps/host-shell/src/app/features/auth/guards/change-password.guard.ts` | Guards `/login/change-password` route |
