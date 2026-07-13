# falcon-sending-credentials-dialog — USAGE

## Real usage examples (active codebase)

### Example 1 — composed inside `<falcon-angular-wizard-finalization>` (the ONLY live consumer)

`[CODE]` `libs/falcon-ui-core/src/angular-wrapper/components/falcon-wizard-finalization/falcon-wizard-finalization.component.html:25-45`:

```html
<falcon-angular-sending-credentials-dialog
  [open]="pickerOpen()"
  [ownerName]="ownerName()"
  [ownerPhone]="ownerPhone()"
  [ownerEmail]="ownerEmail()"
  [defaultDelivery]="defaultDelivery()"
  [disableSend]="submitting()"
  [title]="channelTitle()"
  [subtitle]="channelSubtitle()"
  [deliveryLabel]="deliveryLabel()"
  [ownerKeyLabel]="ownerKeyLabel()"
  [phoneKeyLabel]="phoneKeyLabel()"
  [emailKeyLabel]="emailKeyLabel()"
  [sendLabel]="sendLabel()"
  [cancelLabel]="cancelLabel()"
  [emailMethodLabel]="emailMethodLabel()"
  [smsMethodLabel]="smsMethodLabel()"
  [bothMethodLabel]="bothMethodLabel()"
  (send)="onSend($event)"
  (cancel)="onCancel()"
></falcon-angular-sending-credentials-dialog>
```

> `[CODE]` Every label is bound from a `computed()` signal on `wizard-finalization` (which resolves the translations + channel-specific copy). The component itself never translates. `[disableSend]="submitting()"` keeps Send disabled while the create+send API call is in flight; the parent flips `pickerOpen()` to `false` in its `onSend`/`onCancel` handlers (there is no two-way `open` binding).

### Example 2 — recommended NEW usage (only if you bypass wizard-finalization)

```html
<falcon-angular-sending-credentials-dialog
  [open]="pickerOpen()"
  [ownerName]="owner.name"
  [ownerPhone]="owner.phone"
  [ownerEmail]="owner.email"
  [defaultDelivery]="'email'"
  [disableSend]="sending()"
  [title]="'credentials.send.title' | translate"
  [subtitle]="'credentials.send.subtitle' | translate"
  [sendLabel]="'credentials.send.cta' | translate"
  [cancelLabel]="'common.cancel' | translate"
  [emailMethodLabel]="'credentials.method.email' | translate"
  [smsMethodLabel]="'credentials.method.sms' | translate"
  [bothMethodLabel]="'credentials.method.both' | translate"
  (send)="deliver($event)"
  (cancel)="pickerOpen.set(false)">
</falcon-angular-sending-credentials-dialog>
```

```ts
// component
import {
  FalconAngularSendingCredentialsDialogComponent,
  type FalconCredentialDeliveryMethod,
} from '@falcon/ui-core/angular';

@Component({
  standalone: true,
  imports: [FalconAngularSendingCredentialsDialogComponent, TranslatePipe],
})
export class MyFlow {
  readonly pickerOpen = signal(false);
  readonly sending = signal(false);
  deliver(method: FalconCredentialDeliveryMethod): void {
    this.sending.set(true);
    this.api.sendCredentials(method).subscribe(() => {
      this.sending.set(false);
      this.pickerOpen.set(false); // close after success
    });
  }
}
```

> **Recommendation:** prefer `<falcon-angular-wizard-finalization>` for the standard create-then-confirm-then-success flow — it already wires this dialog + the success dialog + the orchestrator toasts. Use the bare component only for a non-wizard credential-send path.

## Reactive Forms

N/A — this is not a form control (no CVA). The chosen method arrives via `(send)`.

## ngModel (template forms)

N/A — no `[(ngModel)]`. There is no `[(open)]` either; bind `[open]` one-way and flip it in your `(send)`/`(cancel)` handlers.

## Tailwind-only usage

The panel geometry is fixed (`max-w-[880px]`, internal padding) and there is no `rootClass`/`wrapperClass` input. Do NOT try to restyle via host `class=` — there is no documented per-instance customization surface. To change copy, use the label inputs; to change buttons/cards, that is a shared-component upgrade (see GAPS).

## Token / per-instance override

`[CODE]` **No token file exists** for this component (verified by glob — no `sending-credentials*.tokens.css`). Colors are Tailwind `falcon-*` utility classes in the template (`bg-falcon-neutral-0`, `text-falcon-neutral-900`, `border-falcon-teal-700`, `bg-falcon-teal-50`, …) plus a handful of raw values in the inline `styles:` block and the selected-card ring `shadow-[0_0_0_3px_rgba(13,63,68,0.08)]`. There is no `--falcon-sending-credentials-*` token surface to override per instance (see TOKENS.md + GAPS G3).

## Do / Don't

| Do | Don't |
|---|---|
| Prefer `<falcon-angular-wizard-finalization>` for the standard flow. | Reach for the bare component if the wizard composite fits. |
| Feed **pre-translated** label strings. | Expect the component to translate keys. |
| Bind `[open]` one-way; flip it in `(send)`/`(cancel)`. | Expect `[(open)]` two-way binding. |
| Read the chosen method from the `(send)` payload. | Try `[(ngModel)]` / `formControlName` (no CVA). |
| Use `[disableSend]` while the API call is in flight. | Leave Send enabled during submit (double-send). |
| Use `@if`/`@for` in surrounding templates. | Use `*ngIf` / `*ngFor`. |
| Use the still-imported `<falcon-send-credentials-popup>`. | It is **deleted from source** — the old import path no longer resolves. |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `<falcon-angular-sending-credentials-dialog` across `apps/` + `libs/falcon/` + `libs/falcon-ui-core/` → **1 render site**:

- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-wizard-finalization/falcon-wizard-finalization.component.html:25` (the wizard-finalization composite).

Other matches are non-render references:
- `apps/host-shell/tests/falcon-sending-credentials-dialog.spec.ts` (the component's own spec).
- `apps/admin-console/.../add-client-wizard/models/wire-builders.ts` (maps the chosen `FalconCredentialDeliveryMethod` → backend delivery enum for the create payload).
- `libs/falcon-ui-core/src/angular-wrapper/index.ts:81` (barrel re-export) + the component's own `index.ts`.
- `eslint.config.mjs`, `docs/_plans/W21*`, `docs/archive/WAVE-A-OLD-STRUCTURE.md` (config / planning docs, non-render).
- `libs/falcon/src/shared-ui/index.ts:25-26` (the comment recording the supersession of `send-credentials-popup`).

> The component is effectively **single-consumer** (via wizard-finalization), but that consumer is reached by EVERY Add Client / Add User wizard in both consoles, so its real reach is the create-account flow platform-wide.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B19). Example 1 confirmed against wizard-finalization.component.html:25-45. Consumer Sweep re-run (`<falcon-angular-sending-credentials-dialog` → 1 render site + spec + wire-builder + barrels). No token override surface (glob-confirmed no token file).
