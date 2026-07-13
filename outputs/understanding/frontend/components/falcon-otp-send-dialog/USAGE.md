# falcon-otp-send-dialog — USAGE

## Real usage examples (active codebase)

> `[CODE]` 2026-06-03 — there are **no live `<falcon-angular-otp-send-dialog>` consumers** in `apps/` or `libs/falcon/`. The prior add-user-wizard + playground consumers were removed. The examples below are the recommended patterns; the showcase docs (`falcon-ui-showcase-data/src/docs/otp-send-dialog.md`) are the only on-disk usage today.

### Example 1 — Email+SMS verification (recommended)

```html
<falcon-angular-otp-send-dialog
  [(open)]="showDialog"
  [step]="dialogStep()"
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
  this.api.sendOtp(detail.channel).subscribe(() => this.dialogStep.set('code')); // 'code', NOT 'verify'
}

verifyCode(detail: FalconOtpSendDialogVerifyDetail) {
  this.api.verifyOtp(detail.code).subscribe(ok => {
    if (ok) this.showDialog = false;
    else this.dialogEl.markVerificationError('Invalid code'); // or set [errorMessage]
  });
}
```

> `[CODE]` Bind `[step]` **one-way** and drive it from the flow — the wrapper does NOT emit `stepChange`, so `[(step)]` write-back from the dialog's own transitions will not propagate (API.md). The flow flips `channel → code` after a successful send.

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

### Example 3 — programmatic step + error painting (Stencil methods)

```ts
@ViewChild('otpEl', { read: ElementRef }) otpEl!: ElementRef<HTMLElement>;

// after a successful send, drive step 2 + on failure paint the error, both via Stencil @Methods:
async onSent() { await (this.otpEl.nativeElement as any).advanceToCodeStep(); }
async onWrongCode() { await (this.otpEl.nativeElement as any).markVerificationError('Invalid code'); }
async onReset() { await (this.otpEl.nativeElement as any).resetToChannelStep(); }
```

> These three `@Method`s exist on BOTH Stencil tags (`[CODE]` falcon-otp-send-dialog.tsx:112-133) but are NOT proxied on the Angular wrapper (GAP G1) — reach the native element ref. Equivalent declarative path: drive `[step]` + `[errorMessage]` from the flow.

## Recommended usage for NEW Angular pages

- Use for verify-identity send-then-verify workflows.
- Pass `email` AND/OR `phone`; `mode` (set from **tenant policy**, not a UI default) determines which channels appear.
- Two-way bind `open`; drive `step` one-way from the flow.
- Handle `send` / `verify` / `resend` / `cancel` in the parent — they are **intents**, not completed actions (the flow owns every Identity call + any throttle).
- Match `otpLength` to the Identity-issued code length.
- Pre-translate every label (the defaults are English).

## Reactive Forms

Not applicable — this is an orchestrator, not a value control.

## Tailwind-only

`useTailwind=true` (default) composes the `-tw` children. There is no `wrapperClass`/`rootClass` on this orchestrator — override via tokens.

## Token usage

```css
.my-otp-dialog {
  --falcon-otp-send-dialog-option-bg-selected: var(--color-falcon-teal-25);
  --falcon-otp-send-dialog-option-border-color-selected: var(--color-falcon-teal-500);
  --falcon-otp-send-dialog-resend-color: var(--color-falcon-teal-500);
}
```

Plus the composed children's tokens (dialog / radio / otp / button) if you need to restyle them.

## Bad usage to avoid

- **Do NOT** use for generic confirm/cancel modals → `<falcon-angular-dialog>` / `<falcon-angular-popup>`.
- **Do NOT** manually compose dialog + radio + otp — this orchestrator IS that assembly.
- **Do NOT** validate inside the dialog — emit only; the parent handles Identity.
- **Do NOT** bind `step='verify'` — the enum value is **`'code'`** (`[CODE]` falcon-otp-send-dialog.types.ts:10).
- **Do NOT** rely on `[(step)]` two-way write-back — the wrapper never emits `stepChange`; drive it one-way.
- **Do NOT** listen for the events on the host element — bind via the `@Output`s; `falcon-verify`/`falcon-resend`/`falcon-channel-change` bubble and would double-fire on a host listener (only `falcon-send` is stop-propagated).
- **Do NOT** leave `mode='both-allowed'` when the tenant forbids a channel — set `mode` from policy.

## Do / Don't

| Do | Don't |
|---|---|
| Use for OTP send-then-verify flows. | Use for arbitrary modals. |
| Two-way bind `open`; drive `step` one-way. | Expect `[(step)]` write-back. |
| Handle send/verify/resend in the parent. | Validate inside the dialog. |
| Bind `step='code'` for step 2. | Bind `step='verify'` (wrong enum). |
| Set `mode` from tenant policy. | Leave the permissive default. |
| Pre-translate every label. | Ship the English defaults to non-EN tenants. |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `<falcon-angular-otp-send-dialog` across `apps/` → **0 files**; `libs/falcon/` → **0 files**. Non-render references:

- `libs/falcon/src/shared-ui/index.ts` — re-export (non-render).
- `apps/admin-console/src/tailwind.css` + `apps/host-shell/src/tailwind.css` — `@source` glob (JIT class retention).
- `host-shell .../falcon-ui-showcase/showcase-data/registry.ts` + `falcon-ui-showcase-data/src/docs/otp-send-dialog.md` + `demos/component-docs/otp-send-dialog.md` (showcase only).

> `[CODE]` CORRECTION vs the prior 2026-05-17 sweep ("3 consumers: add-user-wizard.html/.ts + playground"): all gone — the add-user-wizard no longer embeds the dialog, the playground route was removed. **Zero live consumers.**

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B07). Consumer Sweep re-run → 0 live (was 3). Examples updated to bind `step='code'` (not `'verify'`), drive `step` one-way, and use the real `@Method` names (`advanceToCodeStep`/`markVerificationError`/`resetToChannelStep`).
