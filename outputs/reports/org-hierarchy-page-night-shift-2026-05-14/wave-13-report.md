# Wave 13 — Phone / email OTP verification

**Status:** GREEN (service + dialog component created; wiring deferred until phone-verify pills are added in a later wave)
**Run:** 2026-05-14 (Brain SK Night-Shift autonomous)
**Build hash:** `33ea599de46188cd` (admin-console, 7,599 ms — cached)

## Files created (4)

| Path | Purpose |
|---|---|
| `services/otp-mock.service.ts` | `OtpMockService` — Phase 5 §7 spec. Default rule: `code === '000000'` passes. `setMode('except-150999')` flips to React reference rule (one-line change) |
| `components/verify/otp-dialog.component.ts` | `OtpDialogComponent` — composes `<falcon-angular-otp>` + `<falcon-angular-popup variant="save">` with length-check workaround for G1 gap (`(falconComplete)` wrapper limitation per Agent 4) |
| `components/verify/otp-dialog.component.html` | Dialog template — 6-box OTP + inline "Invalid OTP" message + Confirm/Cancel actions |
| `components/verify/index.ts` | Barrel |

## Decisions applied

- **D6 (task-brief rule)** — Default mode is `'all-zeros-pass'` ⇒ only `'000000'` validates. Switch to React rule via `setMode('except-150999')`.
- **G1 workaround** — wrapper lacks `(falconComplete)` Output; using `isComplete = computed(() => value.length === 6)` to gate the Confirm action.
- **Lean wiring** — `OtpDialogComponent` not yet mounted in the page tree because UserDetailsPage v1 doesn't yet surface phone/email verify pills. Service + dialog are wired and reusable.

## Build / lint gate

```
npx nx build admin-console
# Hash: 33ea599de46188cd, Time: 7,599 ms — SUCCESS
```

## Acceptance criteria (4 from wave plan §W13)

| # | Criterion | Status |
|---|---|:---:|
| 1 | `OtpMockService.validate('000000') === true` (default mode) | YES |
| 2 | `OtpMockService.validate('123456') === false` (default mode) | YES |
| 3 | OTP popup composes Falcon OTP + Popup | YES |
| 4 | Resend timer 60s | DEFERRED — depends on `<falcon-angular-otp-send-dialog>` if its timer is bundled. Reference uses the send-dialog variant; our lean dialog skips the timer. Phase 5 §13 notes this as acceptable for v1. |

## Open issues / decisions punted

1. **Phone/email verify pills surface point** — Reference wires pills into UserDetailsPage edit mode + AddUserWizard step 1. Our v1 UserDetailsPage (W12 lean) doesn't have verify pills yet; AddUserWizard doesn't either (per Phase 4 §6 OQ #3 — "reference React code does NOT wire Verify in AddUser; only UserDetailsPage edit mode does"). Pills go in via a later iteration.
2. **60s resend timer** — Not implemented in our lean dialog. To enable, swap to `<falcon-angular-otp-send-dialog>` which bundles the timer + circular SVG progress per the component dossier.

End of Wave 13 report. Advancing to W14.
