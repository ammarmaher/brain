---
type: pending-question
fork-id: F-017
task-id: night-shift-static-value-migration-W5
halted-at: 2026-05-18T00:00:00Z
night-shift-batch: 2026-05-18
---

# Fork: host-shell SCSS demolition (auth + dashboard + layout)

## Why halted

7 SCSS files in `apps/host-shell/src/app` (~2,200 LOC total) are tightly coupled to multi-step auth-flow HTML via deep BEM class hierarchies. Demolishing them to pure Tailwind requires simultaneous rewrites of both `.scss` AND `.component.html` for each component — and the auth flow is on the critical user path (login → OTP → reset password). Per `DECISION-PROTOCOL` Class E (UI/UX) the conservative default for high-impact rewrites without a designer in the loop is halt-and-flag.

## Files in scope

| File | LOC | Coupled HTML | Notes |
|---|---|---|---|
| `apps/host-shell/src/app/layout/layout.component.scss` | 76 | layout.component.html | Shell + scrollbar styling; uses var() already; only `width: 8px` is a raw px |
| `apps/host-shell/src/app/features/dashboard/dashboard.component.scss` | 562 | dashboard.component.html | Skeleton-shimmer + stat cards + chart bars + activity/service lists |
| `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.scss` | 350 | login-layout.component.html | Brand panel + card body + footer + `::ng-deep` language switcher |
| `apps/host-shell/src/app/features/auth/get-started/get-started.component.scss` | 247 | get-started.component.html | Login form + API error banner |
| `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.scss` | 331 | enter-otp.component.html | OTP boxes + separator + timer + resend + skeleton + success |
| `apps/host-shell/src/app/features/auth/change-password/change-password.component.scss` | 262 | change-password.component.html | Reset-password form + verify + back link |
| `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.scss` | 574 | forgot-password-flow.component.html | 3-step flow (form + OTP + reset) |

## Sources reviewed
- [BRAIN-SK] `noor-instructions-skill/resources/` — "Tailwind utilities only — no SCSS, no component CSS"
- [DECISION-PROTOCOL] F-017: "SCSS file in old code → Replace with Tailwind utilities (standing rule)"
- [CODE] All 7 SCSS files inspected; they use var(--login-*, --otp-*) heavily but contain ~80 raw px/rem values

## Plausible answers

- **A: Full demolition** — rewrite every SCSS → Tailwind. Cost: ~6-8h of careful work, requires manual visual validation of every auth screen (login, OTP, forgot, reset). Risk: medium-high (critical user path).
- **B: In-place tokenization** — replace raw px/rem values inside the SCSS with `var()` references to SSOT tokens, keep BEM structure. Cost: ~1h. Risk: low. Doesn't satisfy noor-instructions' "no SCSS" doctrine but moves design-system compliance forward.
- **C: Hybrid** — demolish only `layout.component.scss` (76 LOC, low coupling) and `dashboard.component.scss` (no critical-path), tokenize the 5 auth SCSS files in-place. Cost: ~2h. Risk: low-medium.

## Recommended question for the human

Which of (A / B / C) should the next night-shift batch tackle for the host-shell SCSS files?

## Blast radius

- W5 itself is BLOCKED until a decision is made.
- W6 (host-shell residual TS/HTML) and W7 (libs/falcon shared-ui) are UNBLOCKED and proceed in parallel.
- W8 (folder-structure compliance) and W9 (helper extraction) are UNBLOCKED.
- W10 (final audit) will note the SCSS demolition as a residual debt.
