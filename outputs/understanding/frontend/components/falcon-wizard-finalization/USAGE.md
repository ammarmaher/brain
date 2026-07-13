# falcon-wizard-finalization — USAGE

## Real usage examples (active codebase)

### Example 1 — Add Client finalization (admin-console)

`apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html:399-408`:

```html
<!-- *** ONE component replaces the previous separate sending-credentials + completion-success
     *** dialog mounts. Add Client + Add User now use the IDENTICAL finalization flow — only the
     *** submitFn / open signal differ. submitFn is host-supplied (API code stays in the page-state slices). *** -->
<falcon-angular-wizard-finalization
  [open]="state.sendingCredentialsOpen()"
  [ownerName]="state.sendingCredentialsOwner().name"
  [ownerPhone]="state.sendingCredentialsOwner().phone"
  [ownerEmail]="state.sendingCredentialsOwner().email"
  defaultDelivery="email"
  [submitFn]="state.addClientSubmitFn"
  [autoDismissMs]="10000"
  (finalized)="onSendCredentialsSuccessDismissed()"
  (cancelled)="state.onCancelSendingCredentials()" />
```

### Example 2 — Add User finalization (admin-console, same component, different submitFn)

Same file (`:413-422`):

```html
<!-- *** Add User finalization. Same shared component + identical popups as Add Client; the
     *** OTP code-entry step is dropped. The wizard's Finish parks the payload in AddUserStateSlice;
     *** this mount drives the channel popup. *** -->
<falcon-angular-wizard-finalization
  [open]="state.addUserSendingCredentialsOpen()"
  [ownerName]="state.addUserSendingCredentialsOwner().name"
  [ownerPhone]="state.addUserSendingCredentialsOwner().phone"
  [ownerEmail]="state.addUserSendingCredentialsOwner().email"
  defaultDelivery="email"
  [submitFn]="state.addUserSubmitFn"
  [autoDismissMs]="10000"
  (finalized)="state.onAddUserCompletionSuccessDismissed()"
  (cancelled)="state.onCancelAddUserSendingCredentials()" />
```

> The management-console mounts the identical Add User finalization at `org-hierarchy-page-menu.component.html:399`.

### The host `submitFn` (where the API lives)

`[CODE]` The state slices (`add-client-wizard.signals.ts`, `add-user-state.signals.ts`, `client.service.ts`) expose a bound `submitFn` of shape `(method: FalconCredentialDeliveryMethod) => Observable<unknown>`. It performs the real create/send call and returns the HTTP Observable. **API code stays in the host app** — the orchestrator never calls a service directly. BUG-14 (2026-05-29): when the host `submitFn` rejects with an `Error` carrying a non-empty human-readable `message` (e.g. the Add User pipe throwing the backend's localized "Normal user limit reached…" text), that message becomes the toast body.

## Recommended usage for NEW wizards

```html
<falcon-angular-wizard-finalization
  [open]="finalizeOpen()"
  [ownerName]="owner().name"
  [ownerPhone]="owner().phone"
  [ownerEmail]="owner().email"
  [submitFn]="submitFn"
  [channelTitle]="'wizard.finalize.title' | translate"
  [successTitle]="'wizard.finalize.successTitle' | translate"
  [successSubtitle]="'wizard.finalize.successSubtitle' | translate"
  [errorToastTitle]="'wizard.finalize.errorTitle' | translate"
  [errorToastBody]="'wizard.finalize.errorBody' | translate"
  (finalized)="onFinalized()"
  (cancelled)="onCancelFinalize()" />
```

```ts
// host component / state slice
readonly submitFn = (method: FalconCredentialDeliveryMethod): Observable<unknown> =>
  this.api.createEntityAndSendCredentials(this.payload(), method);
```

- Flip `finalizeOpen` to `true` from the wizard's `(falconWizardFinish)` (or your manual Finish button).
- Provide all label inputs translated (the component does NO i18n — defaults are English).

## i18n

`[CODE]` Every copy input has an English default; consumers pass `… | translate` strings (channel labels, success copy, error copy). There is no internal translation. The Add Client consumer translates via the `hierarchy.*` keys.

## Tailwind-only usage

`[CODE]` `:host { display: contents; }` — the orchestrator contributes no box; there is nothing to size/style on it. All visuals come from the two child dialogs (which are token-driven). Do NOT add layout classes to `<falcon-angular-wizard-finalization>`.

## Bad usage to avoid

- **Do NOT** forget `[submitFn]` — it is `input.required()`; omission throws.
- **Do NOT** put your API/service call anywhere but inside `submitFn` — the component is pure orchestration (no HTTP).
- **Do NOT** drive the channel dialog's `[open]` yourself — this orchestrator owns the picker↔loader↔success state machine via the `pickerOpen` computed; you only flip the orchestrator's `[open]`.
- **Do NOT** try to route the success ack through the message orchestrator — it was deliberately reverted to the inline `<falcon-angular-completion-success-dialog>` (2026-05-24); the orchestrator route renders the wrong small red alert.
- **Do NOT** remove the minimum-loader-visibility gate or call the loader yourself — the component manages it.
- **Do NOT** expect a `submitting`/`error` output — observe success via `(finalized)`; errors surface as the orchestrator toast.

## Import requirements (standalone component)

```ts
import { FalconAngularWizardFinalizationComponent } from '@falcon/ui-core';

@Component({ standalone: true, imports: [FalconAngularWizardFinalizationComponent], … })
```

The two child dialogs + `FalconMessageOrchestratorService` + `FalconLoaderService` are wired internally — no extra imports.

## Do / Don't

| Do | Don't |
|---|---|
| Put the API call in a host `submitFn` returning `Observable`. | Inject a service into the orchestrator. |
| Flip the orchestrator's `[open]` from the wizard Finish. | Drive the inner channel dialog's `[open]`. |
| Listen to `(finalized)` to close the flow. | Look for a `submitting`/`success` output (none). |
| Pass translated label inputs. | Rely on the English defaults in production. |
| Let the orchestrator own the loader. | Show your own loader during `submitFn`. |
| Keep the inline success dialog. | Re-route the success ack through the orchestrator. |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `<falcon-angular-wizard-finalization` across `apps/` → **3 element mounts**:
- `apps/admin-console/.../org-hierarchy-page/components/org-hierarchy-page-menu.component.html:399` (Add Client) + `:413` (Add User).
- `apps/management-console/.../org-hierarchy-page/components/org-hierarchy-page-menu.component.html:399` (Add User).

TS references (page-menu + state slices that build `submitFn` / `*SendingCredentialsOpen()`): `org-hierarchy-page-menu.component.ts` (both consoles), `add-user-state.signals.ts` (both), `add-client-wizard.signals.ts` (admin), `client.service.ts` (admin), `hierarchy-page-state.service.ts` (both), `add-user-wizard.component.{ts,html}` (both — comments referencing the page-menu mount). `0` consumers under `libs/falcon/`.

> Note: management-console has NO Add Client flow (clients are added from admin), so it mounts only the Add User finalization.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B20). Examples 1 + 2 quoted verbatim from org-hierarchy-page-menu.component.html (admin :399/:413). Consumer Sweep grep-verified (3 element mounts: admin 2 + mgmt 1). The `submitFn` shape + BUG-14 message passthrough confirmed in component source; the exact state-slice `addClientSubmitFn`/`addUserSubmitFn` bodies are 🟡 CODE-DERIVED from the binding + comments, not re-read line-by-line.
