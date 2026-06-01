# falcon-mobile-number — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## ⚠ Source correction
`[CODE]` `falcon-mobile-number` is **absent from the current new-UI codebase** (`Falcon/falcon-web-platform-ui/libs/`). The only source is the OLD-UI worktree `Brain Outputs/worktrees/falcon-old-ui-main/`. Treat this dossier as legacy reference. The replacement is `<falcon-angular-phone-field>` — see that component's `INTEGRATION_VALIDATION.md`.

## Owning backend module(s)
- **Identity** — the captured phone is a user/contact attribute and, in the old forgot-password screen, the SMS-OTP delivery address. The component itself is presentational + a CVA boundary; it makes **no HTTP calls**.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| (none direct) | — | — | — | — | `[CODE]` `falcon-mobile-number.component.ts` — no service injected, no `HttpClient`. The component only emits an E.164 string via CVA. |
| `auth/forgot-password` (downstream) | POST | Identity | `{ username, phoneNumber, deliveryMethod }` / `ServiceOperationResult<LoginStepResult>` | host-shell auth | `[INFERRED]` The old forgot-password flow took this component's value as `phoneNumber`. The HTTP call lived in the flow service, not the component. |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Required-field | mobile number | `required=true` + touched + empty | `[CODE]` `:236-252` — `validate()` returns `{ required: true }`; template shows `requiredErrorMessageKey` (default `validation.phoneRequired`). |
| Phone-format | mobile number | invalid intl number | `[CODE]` `falcon-mobile-number.component.html:19` — delegated to `ngx-intl-tel-input`'s `[phoneValidation]="true"`; the component class adds no format check. |
| Dial-code de-duplication | mobile number | E.164 carries a repeated dial code | `[CODE]` `:256-266` `normalizePhone` strips a doubled `+966+966…` prefix. |

## PES keys gating this component
- `[INFERRED]` None. The component is unaware of PES; gating was the host form's concern via `setDisabledState` (`:226-229`).

## State / signal pattern
- `[CODE]` `:96-118` Old-UI pattern — a private `FormControl` (`phoneCtrl`) bound to `ngx-intl-tel-input`; `valueChanges` subscription pushes normalized E.164 out through `onChange`. A `writing` guard flag prevents the `writeValue`→`valueChanges`→`onChange` echo loop.
- `[CODE]` `:120-169` `ngAfterViewInit` installs a `MutationObserver` on `.iti` to toggle ancestor `overflow:visible` while the country dropdown is open — a clipping workaround.
- No Angular signals — this predates the signal-based wrappers; it uses `FormControl` + RxJS `Subscription`.

## Skeleton ↔ app-wrapper layering
- **No Stencil skeleton.** `[CODE]` `OVERVIEW.md` — pure-Angular bespoke component; cross-framework parity was never achievable. This is itself a reason it lost to the Stencil-backed `<falcon-angular-phone-field>` (which has Shadow + Light-DOM twins).
- It is a single Angular component (`libs/falcon/src/shared-ui/`), not a wrapper-over-skeleton.

## Integration gotchas
- `[CODE]` `:64-79` `preferredCountries`, `showDialCode`, `maxLength` are accepted but `ngx-intl-tel-input`-specific — the legacy dossier flags some as no-ops; do not rely on them.
- `[CODE]` `:181-216` `writeValue` accepts both an E.164 string and a legacy ChangeData object — order-sensitive parsing via `parseE164`.
- `[CODE]` `phone-utils.ts:11` Pulls in `google-libphonenumber` — a heavy, now-banned dependency. Any attempt to revive this component reintroduces it.
- `[INFERRED]` The `MutationObserver` overflow hack is fragile against modern portal-based overlays — the new phone-field solves clipping with a body portal instead.

## Verification
🟡 CODE-DERIVED from the `falcon-old-ui-main` worktree source. 🔴 Component absent from the new UI; all integration is legacy. For new work use `<falcon-angular-phone-field>`.
