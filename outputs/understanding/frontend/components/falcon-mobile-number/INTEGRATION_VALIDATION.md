# falcon-mobile-number (LEGACY — REMOVED) — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## RECONCILE 2026-06-03 (B22)
`[CODE]` `falcon-mobile-number` is **absent from the production new-UI codebase** (`C:\Falcon\Falcon\falcon-web-platform-ui`) — confirmed by Glob (folder empty) + repo-wide grep (0 live consumers) + barrel inspection (no `FalconMobileNumberComponent` re-export). The only source ever read was the OLD-UI worktree `Brain Outputs/worktrees/falcon-old-ui-main/`. Treat this dossier as a **legacy reference + migration map**. The replacement is `<falcon-angular-phone-field>` — see that component's `INTEGRATION_VALIDATION.md`.

## Owning backend module(s)
- **Identity** — the captured phone was a user/contact attribute and, in the forgot-password screen, the SMS-OTP delivery address. The component itself was presentational + a CVA boundary; it made **no HTTP calls** (true of both the old-UI raw component and the new-UI façade).

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| (none direct) | — | — | — | — | `[BRAIN-OUT]` No service injected, no `HttpClient`. The component only emitted an E.164 string via CVA. |
| `auth/forgot-password` (downstream) | POST | Identity | `{ username, phoneNumber, deliveryMethod }` / `ServiceOperationResult<LoginStepResult>` | host-shell auth | `[INFERRED]` The forgot-password flow took this control's value as `phoneNumber`. The HTTP call lives in the flow service, not the control — and the control is now `<falcon-angular-phone-field>` (`[CODE]` forgot-password-flow.component.html:60-71). |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Required-field | mobile number | `required=true` + touched + empty | `[BRAIN-OUT]` `validate()` returned `{ required: true }`; template showed `requiredErrorMessageKey` (default `validation.phoneRequired`). The migrated phone-field uses a Reactive-Forms validator surfaced into `[errorMessage]`. |
| Phone-format | mobile number | invalid intl number | `[BRAIN-OUT]` (old-UI) delegated to `ngx-intl-tel-input`'s `[phoneValidation]="true"`; the class added no format check. New-UI consumers use `saudiPhoneValidator` (`[CODE]` forgot-password-flow.component.html:58 comment). |
| Dial-code de-duplication | mobile number | E.164 carries a repeated dial code | `[BRAIN-OUT]` (old-UI) `normalizePhone` stripped a doubled `+966+966…` prefix. |

## PES keys gating this component
- `[INFERRED]` None. The component was PES-unaware; gating was the host form's concern via `setDisabledState`. (It inherited the gate of the field it rendered, like every capture control.)

## State / signal pattern
- `[BRAIN-OUT]` Old-UI pattern — a private `FormControl` (`phoneCtrl`) bound to `ngx-intl-tel-input`; a `valueChanges` subscription pushed normalized E.164 out through `onChange`. A `writing` guard flag prevented the `writeValue`→`valueChanges`→`onChange` echo loop. `ngAfterViewInit` installed a `MutationObserver` overflow workaround.
- **No Angular signals** — this predated the signal-based wrappers; it used `FormControl` + RxJS `Subscription`. (Per rubric A, this is a legacy `@Input`/`FormControl` component, not `input()`/signal-state.)

## Skeleton ↔ app-wrapper layering
- **No Stencil skeleton.** Pure-Angular bespoke component in `libs/falcon/src/shared-ui/` — cross-framework parity (React/Vue) was never achievable. This was itself a reason it lost to the Stencil-backed `<falcon-angular-phone-field>` (Shadow + Light-DOM twins). There was NO wrapper-over-skeleton split.

## Integration gotchas (historical)
- `[BRAIN-OUT]` `preferredCountries`, `showDialCode`, `maxLength` were accepted but intl-widget-specific / no-ops — do not rely on them.
- `[BRAIN-OUT]` `writeValue` accepted both an E.164 string and a legacy `ChangeData` object — order-sensitive parsing.
- `[BRAIN-OUT]` (old-UI) pulled in `google-libphonenumber` — a heavy, now-banned dependency. Reviving the component reintroduces it.
- `[INFERRED]` The `MutationObserver` overflow hack is fragile against modern portal overlays — the phone-field solves clipping with a body portal instead.
- `[CODE]` **Migration is contract-compatible:** the E.164 string the control emitted equals what `<falcon-angular-phone-field>` emits, so the form model usually did not change on migration (confirmed by the forgot-password flow still binding `requestFormValue().phoneNumber`).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B22) for absence from production + the migrated forgot-password wiring. Historical integration rows 🟡 CODE-DERIVED / `[BRAIN-OUT]` from the old-UI worktree dossier (source not on the production disk). For new work use `<falcon-angular-phone-field>`.
