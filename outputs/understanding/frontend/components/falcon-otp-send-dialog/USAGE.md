# falcon-otp-send-dialog — USAGE

## Real usage examples

### Example 1 — Email+SMS verification

```html
<falcon-angular-otp-send-dialog
  [(open)]="showDialog"
  [(step)]="dialogStep"
  [email]="user().email"
  [phone]="user().phone"
  mode="both-allowed"
  [otpLength]="6"
  [errorMessage]="otpError() | translate"
  (falcon-send)="sendCode($event)"
  (falcon-verify)="verifyCode($event)"
  (falcon-resend)="resendCode($event)"
  (falcon-cancel)="onCancel()">
</falcon-angular-otp-send-dialog>
```

```ts
sendCode(detail: FalconOtpSendDialogSendDetail) {
  this.api.sendOtp(detail.channel).subscribe(() => {
    this.dialogStep = 'verify';
  });
}

verifyCode(detail: FalconOtpSendDialogVerifyDetail) {
  this.api.verifyOtp(detail.code).subscribe(ok => {
    if (ok) this.showDialog = false;
    else this.otpError.set('Invalid code');
  });
}
```

### Example 2 — Email-only mode

```html
<falcon-angular-otp-send-dialog
  [(open)]="show"
  mode="email-only"
  [email]="email"
  (falcon-send)="onSend($event)"
  (falcon-verify)="onVerify($event)">
</falcon-angular-otp-send-dialog>
```

## Recommended usage for NEW Angular pages

- Use for verify-identity workflows.
- Pass email AND/OR phone; mode determines what's available.
- Handle send / verify / resend events in the parent.
- Parent owns step state (use `[(step)]`).

## Reactive Forms

Not applicable.

## Tailwind-only

`useTailwind=true` default. No wrapperClass on this orchestrator.

## Token usage

Inherits dialog + radio + otp tokens.

## Bad usage to avoid

- Do NOT use for generic confirm/cancel modals.
- Do NOT manually compose dialog+radio+otp — this orchestrator does it.
- Do NOT validate inside the dialog — emit only; parent handles.

## Do / Don't

| Do | Don't |
|---|---|
| Use for OTP-send-verify flows. | Use for arbitrary modals. |
| Two-way bind `open` and `step`. | One-way only. |
| Handle send/verify/resend in parent. | Try to validate inside dialog. |
