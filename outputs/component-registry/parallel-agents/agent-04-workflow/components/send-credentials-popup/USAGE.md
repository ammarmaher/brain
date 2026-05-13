# send-credentials-popup (LEGACY) — USAGE

## Real usage in active codebase
- _Verify with grep._ Likely Add Client final step in admin-console + management-console.

## Recommended NEW usage

### Embed in a wizard finalize step
```ts
// component.ts
readonly showCredPopup = signal<boolean>(false);
readonly loadingSend = signal<boolean>(false);
readonly newClientPayload = signal<{accountOwnerName: string; phone: string; email: string} | null>(null);

onSubmitWizard(payload: NewClientWizardPayload): void {
  this.newClientPayload.set({
    accountOwnerName: payload.owner.fullName,
    phone: payload.owner.phone,
    email: payload.owner.email,
  });
  this.showCredPopup.set(true);
}

onSendCredentials(method: DeliveryMethod): void {
  this.loadingSend.set(true);
  this.api.sendCredentials(this.newClientPayload()!, method).subscribe({
    next: () => {
      this.loadingSend.set(false);
      this.showCredPopup.set(false);
      this.notifySuccess();
    },
    error: () => {
      this.loadingSend.set(false);
      this.notifyError();
    },
  });
}
```
```html
<falcon-send-credentials-popup
  [(visible)]="showCredPopup"
  [accountOwnerName]="newClientPayload()?.accountOwnerName ?? ''"
  [phoneNumber]="newClientPayload()?.phone ?? ''"
  [email]="newClientPayload()?.email ?? ''"
  [loading]="loadingSend()"
  (submit)="onSendCredentials($event)" />
```

## Reactive Forms / ngModel
- N/A.

## Bad usage to avoid
- DO NOT use this for generic confirmation dialogs.
- DO NOT pass a `loading=true` and forget to reset to false (Submit becomes permanently disabled).

## Do / Don't
- DO drive the visible flag from a signal.
- DO reset `loading` on both success and error API responses.
- DON'T extend this for new credential-delivery patterns — propose new slot-friendly variants of `<falcon-angular-popup>` instead.
