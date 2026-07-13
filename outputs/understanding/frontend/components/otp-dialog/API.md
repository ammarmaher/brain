# otp-dialog — API

> Single-render Angular component using the **new signal-input API** (`model.required` / `input()` / `output()`) — NOT legacy `@Input`/`@Output`. Rubric **B** (Stencil dual-render) + **E** (cross-framework) are **N/A**.

## Selectors

- Angular: `app-otp-dialog` `[CODE]` ts:30
- Host: `display: contents` via `host: { class: 'contents' }` `[CODE]` ts:34
- Stencil Shadow / Light: **N/A**

## Import

```ts
import { OtpDialogComponent } from '@falcon';          // re-exported via shared-ui/index.ts:404
// the host app MUST provide the gateway:
import { OTP_GATEWAY } from '@falcon/sdk';
// { provide: OTP_GATEWAY, useExisting: <YourIdentityGatewayService> }
```

`[CODE]` Add `OtpDialogComponent` to the consuming standalone component's `imports: []` (user-details-page.component.ts:108). The component injects `OTP_GATEWAY` (ts:65) — the host app MUST bind a concrete implementation (host-shell binds `ProfileOtpService`, app.config.ts:113) or the dialog cannot send/verify.

## Inputs (signal API)

| Name | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `open` | `model.required<boolean>` | `boolean` | _(required)_ | `[CODE]` ts:37 — two-way `[(open)]`. The host's INTENT to open. A false→true edge triggers `sendOtp()` (the modal does NOT appear until send succeeds). The component sets it back to `false` on cancel/success/fail. |
| `field` | `input<VerifiableField \| null>` | `'email' \| 'phone' \| null` | `null` | `[CODE]` ts:40 — which contact field is verified; drives the `verify-*` endpoint selection. |
| `fieldValue` | `input<string>` | `string` | `''` | `[CODE]` ts:42 — the contact value to verify (email address / phone number), sent on the wire so the BE targets the right record. |
| `length` | `input<number>` | `number` | `OTP_DEFAULTS.LENGTH` (6) | `[CODE]` ts:45 — FALLBACK box count; the BE `otpCodeLength` from `sendOtp` **wins** when present and > 0. |

> `[CODE]` There is no `@Input` decorator anywhere — all inputs are `input()` / `model.required()` (zoneless signal style). ts:37-45.

## Outputs (signal API)

| Name | Kind | Payload | Notes |
|---|---|---|---|
| `verified` | `output<void>` | `void` | `[CODE]` ts:47 — emitted ~900ms after a successful `verifyOtp` (success beat), then `open` flips false. ts:311-318. |
| `cancelled` | `output<void>` | `void` | `[CODE]` ts:48 — emitted on Cancel / backdrop / Esc. ts:195-199. |
| `failed` | `output<string>` | i18n key | `[CODE]` ts:49-52 — emitted when OTP cannot be STARTED: send/resend transport failure (`'hierarchy.otp.sendFailed'`) OR a BE-returned unusable code length (`'hierarchy.otp.zeroLength'`). The host shows an error toast; the modal never opens (or closes again). ts:220-225. |

## Gateway port — `OtpGateway` (the backend contract the host app must implement)

`[CODE]` `libs/sdk/src/types/otp-gateway.interface.ts`. Injected via `OTP_GATEWAY` token (ts:65). The library depends on this ABSTRACTION, not on HTTP — the presentational lib stays gateway-free.

| Method | Signature | Endpoint (host-shell impl) |
|---|---|---|
| `sendOtp` | `(field: OtpField, value: string) => Observable<ServiceOperationResult<VerificationCodeResponse>>` | `POST /user/me/verify-{email\|phone}` body `{ email }` or `{ phoneNumber }` `[CODE]` profile-otp.service.ts:35-48 |
| `verifyOtp` | `(field: OtpField, code: string) => Observable<ServiceOperationResult<boolean>>` | `POST /user/me/verify-{email\|phone}/confirm` body `{ code }` `[CODE]` profile-otp.service.ts:51-64 |
| `resendOtp` | `(field: OtpField) => Observable<ServiceOperationResult<VerificationCodeResponse>>` | `POST /user/me/verify-{email\|phone}/resend` body `{}` `[CODE]` profile-otp.service.ts:68-80 |

`OtpField = 'email' | 'phone'` `[CODE]` otp-gateway.interface.ts:12.

## TypeScript types

`[CODE]` `libs/falcon/src/shared-types/lib/enums/otp.enums.ts`:

```ts
enum OtpScreenState { Sending='sending', Input='input', Verifying='verifying', Success='success', Error='error', Expired='expired' }
enum VerifiableField { Email='email', Phone='phone' }
const OTP_DEFAULTS = { LENGTH: 6, EXPIRY_SECONDS: 120 } as const;
```

`[CODE]` `libs/sdk/src/types/otp.dtos.ts`:

```ts
interface VerificationCodeResponse { otpCodeLength: number; otpExpiresInSeconds: number; devOtpCode: string | null; }
interface VerifyEmailRequest { email: string; }
interface VerifyPhoneRequest { phoneNumber: string; }
interface ConfirmOtpRequest { code: string; }
```

## Reflected props / Mutable props

**N/A** — single-render Angular component; no Stencil props/reflection.

## CVA / ngModel / Reactive Forms

**N/A on the dialog itself** — it is a modal, not a form control (no `ControlValueAccessor`). Internally it binds the composed `<falcon-angular-otp>` with `[ngModel]="value()"` + `(ngModelChange)` (ts:73 + html:165-171), but the dialog exposes no CVA outward. The verified VALUE is never returned — only the boolean `verified` event (the BE owns the verified state).

## Signal compatibility

`[CODE]` Fully signal-first + zoneless: `model.required` + `input()` + `output()`; internal state is all `signal()`/`computed()` (`screenState`, `value`, `invalid`, `verifyErrorMsg`, `visible`, `otpLength`, `secondsLeft`, `modalVisible`, `isComplete`, `progress`, `ringDashOffset`, `countdownText`, `introKey`, `expired`). `OnPush` (ts:33). Teardown via `DestroyRef.onDestroy` (ts:153-156) clearing all timers/handles.

## Methods (protected — template-bound, no public imperative API)

| Method | Purpose |
|---|---|
| `onCodeChange(code)` | OTP box change → set value, clear invalid, auto-verify on incomplete→complete edge (200ms debounce). `[CODE]` ts:172-187 |
| `onConfirm()` | Manual verify (guarded by `isComplete` + not expired). ts:189-193 |
| `onCancel()` | Reset + `open=false` + emit `cancelled`. ts:195-199 |
| `onResend()` | Resend (only reachable from Expired). ts:201-203 |
| `onBackdropClick(e)` | Dismiss when click target IS the `<dialog>` element (outside the card). ts:161-165 |
| `onDialogClose()` | Sync on native `<dialog>` `close` (Esc / `.close()`). ts:167-170 |

> No public `open()`/`verify()` method — control the dialog via the `[(open)]` model.

## Internal state machine (the real behavioral surface)

`[CODE]` `OtpScreenState` transitions (ts):

```
open:false→true edge (+field+value) → resetState() → sendOtp()  [screenState=Sending, modal NOT yet visible]
  sendOtp ok + len>0  → enterInputState() [otpLength/seconds set, visible=true, startTimer] → Input
  sendOtp ok + len<=0 → failSend('zeroLength') [emit failed, open=false]
  sendOtp fail/timeout→ failSend('sendFailed')
Input → onCodeChange complete → (200ms) verify() → Verifying
  verify ok          → Success [stopTimer, ~900ms beat, emit verified, open=false]
  verify envelope-fail/HTTP → enterVerifyError(msg) → Error [value cleared, invalid=true]
Input/Error → timer hits 0 → Expired [Resend enabled]
Expired → onResend() → resendOtp() → (same ok/zeroLength/fail branches as send) → Input
any → onCancel/backdrop/Esc → reset + open=false + emit cancelled
```

- **Watchdog:** `SEND_TIMEOUT_MS = 12_000` — if send/resend doesn't resolve in 12s while still in Sending, `failSend()` fires (prevents a permanent spinner). `[CODE]` ts:119, 400-410.
- **`modalVisible = computed(open() && visible())`** — the `[falconOpen]` binding; the modal is rendered only when BOTH the host intends open AND a send has succeeded. `[CODE]` ts:63 + html:29.

## Slots / template inputs

- `[CODE]` No `ng-content` / `ng-template` inputs. The body is a fixed state-driven layout (Sending spinner / Success check / Input boxes + countdown ring + Resend). html:133-235.

## Sizes / states / variants / appearances

- No size/variant axis. The composed `<falcon-angular-otp>` is pinned `size="lg"` (html:170); the card width is a fixed `750px` (html:96).
- "States" = the `OtpScreenState` enum (visual mode), not a styling variant.

## Constraints

- `[CODE]` **The host app MUST provide `OTP_GATEWAY`** — without a bound implementation, `inject(OTP_GATEWAY)` fails at construction. ts:65 + app.config.ts:113.
- `[CODE]` **`open` is a positive-edge trigger** — `sendOtp()` fires only on a real false→true transition (`wasOpen` guard, ts:131/135-146). Re-running the effect for `field()`/`fieldValue()` recompute (e.g. user-fetch resolving, or mid-typing) must NOT re-send — the guard prevents auto-open-on-load + input-wipe regressions.
- `[CODE]` **BE `otpCodeLength` overrides `length`** — the fallback `[length]` input is only used until `sendOtp` returns a usable count. ts:45/242-247.
- `[CODE]` **`notShowToaster: 'true'`** is set on every gateway call (profile-otp.service.ts:46/62/78) — the dialog owns its own error UX (inline `verifyErrorMsg` + the `failed` toast), so the global toaster must not double-fire.
- `[CODE]` **Modal opens only after send success** — a failed send never shows an empty popup (`visible` stays false). ts:240-254.

## Accessibility

- `[CODE]` `<dialog role="dialog" aria-modal="true" [attr.aria-label]="titleKey | translate">` (html:32-36) — native `showModal()` top-layer (via `[falconOverlay]`) gives a real focus trap + Esc.
- `[CODE]` Close X has `[attr.aria-label]="'common.cancel' | translate"` (html:106); the SVG is `aria-hidden`.
- `[CODE]` Countdown ring wrapper has `[attr.aria-label]="'hierarchy.otp.expiresIn' | translate"` (html:199); the ring SVG + center dot + spinner are `aria-hidden` (decorative).
- `[CODE]` Resend button uses `[disabled]="!expired()"` + `disabled:cursor-not-allowed` (html:223-227) — disabled until expiry.
- `[INFERRED]` **A11y gaps:** the invalid/expired/verifying status messages (html:179-195) are NOT in an `aria-live` region — a screen reader is not told the code was rejected. The OTP-box accessibility (per-box labels) is the composed `<falcon-angular-otp>` primitive's responsibility. See GAPS A1/A2.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B27, NEW) against otp-dialog.component.ts (440 ln) + .html (239 ln), otp-gateway.interface.ts, otp.dtos.ts, otp.enums.ts, profile-otp.service.ts, app.config.ts:113. Signal-input API (model.required/input/output) + the 3-method gateway port + the OtpScreenState machine + the 12s watchdog + the positive-edge `wasOpen` guard all read from live source. B/E rubric N/A.
