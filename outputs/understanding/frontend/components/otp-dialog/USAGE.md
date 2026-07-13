# otp-dialog — USAGE

> The dialog is consumed by exactly ONE host today (the shared user-details page). The full integration recipe below is that real usage, plus the mandatory `OTP_GATEWAY` provider.

## Real usage examples (active codebase)

### Example 1 — The canonical (only) consumer: user-details page

`libs/falcon/src/shared-features/user-details/components/user-details-page.component.html:679-684`:

```html
<!-- OTP dialog — field + the live draft phone/email value being verified.
     The real verify-* API is reached via the @falcon/sdk OTP_GATEWAY port. -->
<app-otp-dialog
  [(open)]="state.otpOpen"
  [field]="state.otpField()"
  [fieldValue]="state.otpRecipient()"
  (verified)="onOtpVerified()"
  (failed)="onOtpFailed($event)" />
```

`[CODE]` Wiring on the host:
- `state.otpOpen` = `signal<boolean>(false)` — set true to start verification. `[CODE]` signals.ts:173/752.
- `state.otpField()` = `computed<VerifiableField>` (email|phone being changed). `[CODE]` signals.ts:481.
- `state.otpRecipient()` = `computed<string>` (the draft new value). `[CODE]` signals.ts:476.
- `(verified)` → `state.onOtpVerified()` marks the field locally verified so Save is unblocked. `[CODE]` user-details-page.component.ts:402-404 + signals.ts:758.
- `(failed)` → a top-right **error toast** (`notifier.error(translate(msgKey), translate('hierarchy.otp.errorTitle'))`); the modal stays closed. `[CODE]` user-details-page.component.ts:409-414.

> Note `(cancelled)` is available but the host does not bind it here (cancel just closes; the host's own guard resets `otpOpen`, ts:282).

### Example 2 — Mandatory gateway provider (host-shell)

`apps/host-shell/src/app/app.config.ts:111-113`:

```ts
import { OTP_GATEWAY } from '@falcon/sdk';
import { ProfileOtpService } from './core/user/profile-otp.service';
// …
providers: [
  // OTP port — host-shell owns the Identity-gateway HTTP service; the shared @falcon
  // <app-otp-dialog> (incl. the admin-console embed) injects it via this token.
  { provide: OTP_GATEWAY, useExisting: ProfileOtpService },
  // …
]
```

`[CODE]` `ProfileOtpService implements OtpGateway` and routes the 6 verify-* endpoints through `Gateway.IdentityGateway` with `notShowToaster: 'true'`. profile-otp.service.ts:27-80.

## Recommended usage for NEW code

```html
<app-otp-dialog
  [(open)]="otpOpen"
  [field]="otpField()"          <!-- VerifiableField.Email | VerifiableField.Phone -->
  [fieldValue]="draftValue()"   <!-- the NEW email/phone the user typed -->
  (verified)="onVerified()"     <!-- mark field verified; unblock Save -->
  (failed)="onFailed($event)"   <!-- show error toast with the i18n key -->
  (cancelled)="onCancelled()" /> <!-- optional -->
```

```ts
import { OtpDialogComponent } from '@falcon';
import { VerifiableField } from '@falcon'; // shared-types enum

@Component({ standalone: true, imports: [OtpDialogComponent], … })
export class MyProfileComponent {
  otpOpen = signal(false);
  otpField = computed(() => VerifiableField.Email);
  draftValue = computed(() => this.form().email);
  startVerify() { this.otpOpen.set(true); }   // false→true edge fires sendOtp
  onFailed(key: string) { this.notifier.error(this.i18n.translate(key)); }
}
```

> And in the host APP config: bind `OTP_GATEWAY` to a service implementing the 3-method `OtpGateway` against your Identity endpoints. **Without this provider the dialog throws on construction.**

## Reactive Forms / ngModel

**N/A on the dialog** — it is a modal, not a form control. Internally it drives `<falcon-angular-otp>` via `[ngModel]`/`(ngModelChange)` (html:165-171); externally it returns only the `verified` boolean event (the BE owns the verified state — the code itself is never surfaced).

## Tailwind-only usage

⚠️ `[CODE]` This component is **NOT Tailwind-token-only** — it mixes Falcon utilities (`bg-falcon-neutral-0`, `text-falcon-teal-700`, `rounded-2xl`) with an inline `<style>` block (html:41-90) and many literal `px`/`rgba` inline `style=` values (`width: 750px`, `font-size: 40px`, `box-shadow: 0 30px 80px -20px rgba(13,63,68,0.30)`, `rgba(13,63,68,0.55)` backdrop, etc.). This is a deliberate legacy/parity exception (like `new-wallet-balance`), documented in `TOKENS.md` + `GAPS_AND_UPGRADES.md`. **Do NOT copy this styling approach for new components** — it violates the no-inline-style / token-only house rule.

## Per-instance token override

**N/A** — no token file, no host-class token hook. The hardcoded geometry (card width, paddings, font sizes) is baked into inline `style=` and cannot be overridden per-instance. (This is itself a gap — see GAPS G-TOKENS.)

## Do / Don't

| Do | Don't |
|---|---|
| Bind `[(open)]`, `[field]`, `[fieldValue]` + handle `(verified)`/`(failed)`. | Try to read the entered CODE — it is never emitted (BE owns verified state). |
| Provide `OTP_GATEWAY` in the host app. | Consume the dialog without binding the gateway (it throws). |
| Flip `open` false→true to start (positive-edge). | Toggle `open` rapidly or set it from a recomputing source — only the edge matters; spurious re-runs are guarded but avoid them. |
| Pass the NEW (draft) email/phone in `fieldValue`. | Pass the OLD/persisted value — the BE targets the wire value. |
| Show the `(failed)` key as a toast. | Swallow `(failed)` — the user would see a silent no-op. |
| Use this for `/user/me` self-service contact change. | Use it for a channel-picker composer (use `<falcon-angular-otp-send-dialog>`) or a bare code box (use `<falcon-angular-otp>`). |

## Bad usage to avoid

- **Do NOT** mount it without `OTP_GATEWAY` bound — `inject(OTP_GATEWAY)` (ts:65) fails.
- **Do NOT** expect a value out — only `verified`/`cancelled`/`failed` events exist.
- **Do NOT** rely on `[length]` to fix the box count — the BE `otpCodeLength` overrides it (ts:242).
- **Do NOT** replicate the inline-`<style>` + literal-px approach in new Falcon components.
- **Do NOT** treat `(cancelled)` and `(failed)` as the same — `cancelled` = user closed; `failed` = send/verify-start error (toast).

## Import requirements (standalone component)

```ts
import { OtpDialogComponent } from '@falcon';
// host APP config (once):
import { OTP_GATEWAY } from '@falcon/sdk';
// { provide: OTP_GATEWAY, useExisting: MyIdentityOtpService }
```

## Consumer Sweep (2026-06-03)

`[CODE]` grep `<app-otp-dialog>` / `OtpDialogComponent` across `apps/` + `libs/falcon/` → **render consumer = 1 file**:

- `libs/falcon/src/shared-features/user-details/components/user-details-page.component.{ts,html}` (import :44, declare :108, render html:679).

`[CODE]` Related references (non-render):
- `libs/falcon/src/shared-features/user-details/signals/signals.ts:480` — type-source comment + `otpOpen`/`otpField`/`otpRecipient` signals that feed the dialog.
- `apps/host-shell/src/app/app.config.ts:111-113` + `apps/host-shell/.../core/user/profile-otp.service.ts` — the `OTP_GATEWAY` provider + impl (the dialog's backend).
- `libs/sdk/src/types/otp-gateway.interface.ts:2` — port doc references `<app-otp-dialog>`.

> `[CODE]` The single render consumer (user-details page) is itself **shared** and embedded by both admin-console + management-console user-detail routes AND the host-shell `/profile` self route (`[MEMORY]` edit-user-by-status) — so the one dialog instance serves Falcon admin + Client + self users through that host. **`<falcon-angular-otp-send-dialog>` (the sibling composer) has 0 app consumers** — confirming the two are distinct, and the send-dialog is currently unused.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B27, NEW). Example 1 quoted verbatim from user-details-page.component.html:679-684 + host glue (ts:402-414, signals.ts:173/476/481/758). Example 2 from app.config.ts:111-113 + profile-otp.service.ts. Consumer Sweep grep-verified: render consumer = 1 (user-details page); `falcon-angular-otp-send-dialog` = 0 app consumers. Inline-style exception flagged.
