# falcon-error-dialog-host — USAGE

> The host is mounted ONCE; feature code interacts with it through the injected **`ErrorDialogService`**. All examples below are the real usage pattern: inject the service, call `openError(...)`.

## Real usage examples (active codebase)

### Example 0 — Mounting the host (app shell, do this once)

`apps/host-shell/src/app/app.ts:15/27/39`:

```ts
import { FalconAngularErrorDialogHostComponent } from '@falcon';

@Component({
  imports: [ /* … */ FalconAngularErrorDialogHostComponent, /* … */ ],
  template: `
    <falcon-angular-message-host position="top-right"></falcon-angular-message-host>
    <falcon-angular-error-dialog-host></falcon-angular-error-dialog-host>
    <falcon-angular-http-error-dialog-host defaultOkLabel="OK" />
    …
  `,
})
export class App { … }
```

> Note the THREE distinct error/message surfaces mounted side-by-side: the message host (toasts), THIS multi-message alert-dialog host, and the parallel single-message HTTP-error popup host. They are not interchangeable — see OVERVIEW "When NOT to use it".

### Example 1 — Settings-tab load failure (fire-and-forget, single message)

`apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/settings-tab/signals/settings-tab.signals.ts:220-223`:

```ts
error: (err) => {
  this.mode.set('error');
  this.loadError.set(this.i18n.translate('hierarchy.settings.error.loadFailed'));
  console.error('[settings-tab] load failed', err);
  void this.errorDialog.openError({
    httpStatus: statusFromHttpError(err),
    errorMessages: [this.i18n.translate('hierarchy.error.network')],
  });
},
```

> The tab requests `notShowToaster: 'true'` on its HTTP calls (`[CODE]` settings.service.ts:62) precisely so it can own its error UX through this dialog instead of the global toaster.

### Example 2 — Information-panel save failure (mgmt console)

`apps/management-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/signals/info-panel-state.signals.ts:247/353/377`:

```ts
private readonly errorDialog = inject(ErrorDialogService);
// …
this.errorDialog.openError({
  httpStatus: /* status from the failed save */,
  errorMessages: /* array of translated business-rule messages */,
});
```

> A `422` here makes the dialog render in **warning** severity (`[CODE]` ts:74-78) with every broken business rule listed as a bullet.

### Example 3 — Add-User wizard create failure (parallel error pipeline)

`apps/management-console/.../add-user-wizard/add-user-wizard.component.ts:213`:

```ts
/*** The error dialog is opened in parallel by ErrorDialogService — this handles the
 *** field-level error mapping via FIELD_LEVEL_ERROR_MAP. ***/
```

> The wizard maps known field errors inline AND opens the acknowledgement dialog for the full message set — the two are complementary.

## Recommended usage for NEW code

```ts
import { ErrorDialogService } from '@falcon';

export class MyFeatureSignals {
  private readonly errorDialog = inject(ErrorDialogService);

  private handleSaveError(err: unknown): void {
    void this.errorDialog.openError({
      httpStatus: statusFromHttpError(err),                 // drives title + severity
      errorMessages: extractMessages(err),                  // pre-translated, or i18n keys
      // titleKey: 'myFeature.error.title',                  // optional override
    });
  }
}
```

- To **await** acknowledgement before continuing a flow: `await this.errorDialog.openError({...});` (the Promise resolves on dismiss). No current call site does this, but the API supports it `[CODE]` service:32-44.
- Suppress the global toaster on the failing HTTP call (`headers: { notShowToaster: 'true' }`) so the operator does not get a toast AND a dialog for the same failure.

## Tailwind-only usage

- `[CODE]` The host's only inline markup is the projected bullet list — `class="list-disc ps-5 m-0 space-y-1 text-falcon-neutral-800 text-sm leading-relaxed text-start"` (html:18). All token-driven via Falcon utilities; `ps-5` (logical padding) + `text-start` keep it RTL-correct.
- There is **no per-instance token override surface** on the host (no token file). To restyle the dialog chrome, override `--falcon-alert-dialog-*` tokens at the primitive level (see the `falcon-alert-dialog` dossier) — not here.

## Per-instance token override

**N/A on the host.** The dialog chrome is the `<falcon-angular-alert-dialog>` primitive's responsibility; override its `--falcon-alert-dialog-*` tokens if needed. The host only styles the bullet `<ul>` with Falcon Tailwind utilities.

## Do / Don't

| Do | Don't |
|---|---|
| Mount the host **once** in the app shell. | Mount it inside a feature/remote — it is shell chrome. |
| Open via `ErrorDialogService.openError({ httpStatus, errorMessages })`. | `new` a dialog imperatively in feature code. |
| Pass **already-translated** copy OR a real i18n key in `errorMessages`. | Pass a raw backend slug expecting it to localize (best-effort only). |
| Set `notShowToaster: 'true'` on the failing call. | Let the toaster AND this dialog both fire for one failure. |
| Use this for **multi-message** acknowledgement. | Use it for a single transient status (use a toast) or a confirm/cancel (use `FalconConfirmService`). |
| Let `401` flow through — it is auto-suppressed. | Special-case `401` in feature code. |
| Use `@if`/`@for` (already done in the host template). | Reintroduce `*ngIf`/`*ngFor`. |

## Bad usage to avoid

- **Do NOT** confuse this with `<falcon-angular-http-error-dialog-host>` (`FalconHttpErrorDialogService`) — that is the single-message OK-only **popup** used by the HTTP interceptor. This one is the multi-message **alert-dialog**. `[CODE]` falcon-http-error-dialog.service.ts:6.
- **Do NOT** rely on the dialog to localize backend strings — `errorMessages` are echoed raw unless they match a key (ts:84-88).
- **Do NOT** mount a second instance — duplicate modal for the same state.

## Import requirements (standalone shell component)

```ts
import { FalconAngularErrorDialogHostComponent } from '@falcon';

@Component({
  standalone: true,
  imports: [FalconAngularErrorDialogHostComponent /*, … */],
  template: `<falcon-angular-error-dialog-host></falcon-angular-error-dialog-host> …`,
})
```

## Consumer Sweep (2026-06-03)

`[CODE]` grep `<falcon-angular-error-dialog-host>` / `FalconAngularErrorDialogHostComponent` across `apps/` + `libs/falcon/` → **render consumer = 1 file** (the mount site):

- `apps/host-shell/src/app/app.ts` (import :15, declare :27, render :39).

`[CODE]` grep `ErrorDialogService` / `openError(` (the DRIVING service — the host is the single sink) → callers across `apps/` + `libs/`:

- `apps/admin-console/.../settings-tab/signals/settings-tab.signals.ts` (`inject` :55; `openError` :220, :276, :296)
- `apps/admin-console/.../falcon-org-info-panel/signals/info-panel-state.signals.ts` (`inject` :60; `openError` :247, :353, :377)
- `apps/management-console/.../settings-tab/signals/settings-tab.signals.ts` (`inject` :57; `openError` :228, :287, :307)
- `apps/management-console/.../falcon-org-info-panel/signals/info-panel-state.signals.ts` (`inject` :60; `openError` :247, :353, :377)
- `apps/{admin,management}-console/.../add-user-wizard/add-user-wizard.component.ts` (parallel error pipeline note :201/:213)
- `libs/falcon-studio/.../loader-studio-state.service.ts` (routes editor load errors via `ErrorDialogService` :32/:160)
- `apps/{admin,management}-console/.../settings-tab/services/settings.service.ts` + `.../information.service.ts` (comments — set `notShowToaster` because the tab/panel own error UX via `ErrorDialogService`)

> `[INFERRED]` Net: **1 mount + ~6 active caller modules** (admin & mgmt settings-tab + info-panel are the hot paths). The host itself is intentionally low-fan-in (one shell mount); the service is the high-fan-in surface.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B27, NEW). Example 0 (mount) verified against app.ts:15/27/39; Example 1 quoted verbatim from settings-tab.signals.ts:220-223. Consumer Sweep grep-verified: render consumer = 1 (app.ts); service callers enumerated across admin+mgmt signals + falcon-studio.
