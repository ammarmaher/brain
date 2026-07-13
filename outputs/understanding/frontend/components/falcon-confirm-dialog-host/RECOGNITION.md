# falcon-confirm-dialog-host — Recognition Layer

> Given a need ("I want to ask the user to confirm something from my code"), recognize that the answer is **inject `FalconConfirmService`**, not mount a dialog. This unit is an imperative orchestration pattern, so "recognition" is about API/idiom shape, not a visual fingerprint.

## Idiom fingerprint

You are looking at this pattern when you see:
- A single host element mounted once in the app shell next to other `*-host` elements: `<falcon-angular-message-host>`, `<falcon-angular-error-dialog-host>`, `<falcon-unsaved-changes-host>`, `<falcon-angular-confirm-dialog-host>` (`[CODE]` app.ts:38-57).
- A feature injecting an `@Injectable({ providedIn: 'root' })` service and calling `.confirm({...}).subscribe(boolean => …)` — NOT mounting a `[(open)]`-bound dialog.
- An `Observable<boolean>` confirm result piped through `takeUntilDestroyed`.

There is **no visual fingerprint for the host** — it renders nothing in Phase 5. The visual you see is the rendered substrate (`<falcon-angular-popup variant="error">`).

## Cross-library equivalents

| Library | Their pattern | Parity notes |
|---|---|---|
| PrimeNG | `ConfirmationService.confirm({ accept, reject })` + one `<p-confirmDialog>` mounted in the shell | **Direct conceptual match.** Falcon's `FalconConfirmService.confirm()` is the Observable-returning analogue; the single shell host mirrors PrimeNG's single `<p-confirmDialog>`. |
| Ant Design | `Modal.confirm({ onOk, onCancel })` (static, imperative) | Imperative confirm with no mounted element — Falcon returns an Observable instead of `onOk`/`onCancel` callbacks. |
| MUI | (no built-in) — usually a `useConfirm()` hook / `<ConfirmProvider>` from `material-ui-confirm` | Provider + hook ≈ shell host + injectable service. |
| Angular CDK | `Overlay` + a custom confirm service | Falcon's service is the productized version (Top-Layer via the popup substrate). |
| plain JS | `window.confirm()` | **Banned** — replaced by `FalconConfirmService` (`[CODE]` contact-groups-list.component.ts:379). |

## Use THIS vs siblings

| If you need… | Use | NOT |
|---|---|---|
| an imperative yes/no that returns a boolean to your flow | **`FalconConfirmService.confirm()`** | a mounted dialog with `[(open)]` |
| to gate leaving a route with unsaved changes | `FalconUnsavedChangesService` + `<falcon-unsaved-changes-host>` | `FalconConfirmService` |
| to show an HTTP/error message modal | `ErrorDialogService` + `<falcon-angular-error-dialog-host>` (libs/falcon) | `FalconConfirmService` |
| a toast / notification (non-blocking) | `FalconMessageOrchestratorService` (toast adapter) / `<falcon-angular-message-host>` | a confirm |
| a declarative dialog you fully control | `<falcon-angular-dialog>` / `<falcon-angular-popup>` directly | the host/service |
| the dormant Stencil confirm component | (don't) — `<falcon-angular-confirm-dialog>` is dead | — |

## Composition recipe

`[VAULT]` Customization order (inputs → templates → slots → variants → token → shared upgrade → wrapper → GAP) collapses to a single step for this pattern:

1. **Inject + call** — `inject(FalconConfirmService)`, then `.confirm({ title, body, confirmLabel?, hideCancel? }).pipe(takeUntilDestroyed(destroyRef)).subscribe(ok => …)` (`[CODE]` falcon-confirm.service.ts:65; usage at contact-groups-list.component.ts:381-396).
2. **Single-CTA** — pass `hideCancel: true` for acknowledgement-only.
3. **Mount** — already done once in `host-shell/app.ts:53`; do NOT add another mount.
4. **Substrate theming** — to restyle the modal, tune `<falcon-angular-popup>` tokens (Phase-5 renderer), not the host.
5. **GAP** — want a softer/info-colored confirm, or a custom icon? In Phase 5 those are inert (`severity`/`icon` ignored — GAP G2). Raise the gap; do not hand-roll a second confirm modal.

## Anti-patterns

- **Mounting `<falcon-angular-confirm-dialog-host>` in a remote/feature** — it is a singleton; one mount in host-shell covers all remotes (`[CODE]` app.ts:49-52).
- **Subscribing without `takeUntilDestroyed`** — leaks + the modal won't auto-dismiss on teardown (`[CODE]` service.ts:109-114).
- **Using `window.confirm()`** — banned (`[CODE]` contact-groups-list.component.ts:379).
- **Picking `FalconConfirmService` for an unsaved-changes route gate** — that's `FalconUnsavedChangesService` (different shape/copy).
- **Expecting `severity`/`icon`/`cancelLabel` to change the popup** — inert in Phase 5 (GAP G2).
- **Reading `service.active()` for the in-flight request** — always null (Phase 5).
- **Treating `confirm()` as a Promise** — it's a cold `Observable<boolean>`.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B15 — NEW) from `falcon-confirm.service.ts` + `app.ts` + the live callers. Cross-library map `[INFERRED]` from each framework's documented imperative-confirm idiom (PrimeNG `ConfirmationService` is the closest 1:1). Sibling-routing table verified against the other `*-host` mounts in `app.ts`.
