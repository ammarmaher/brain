# falcon-confirm-dialog-host — DECISION

## Brain SK final recommendation

**SERVICE: READY / PREFERRED.** Use `FalconConfirmService.confirm()` for every imperative yes/no decision. **HOST element: DEPRECATED IN PLACE** — dead-but-mounted in Phase 5; queued for removal (do not add new mounts; do not rely on it rendering).

## Use this for

- **Imperative confirms** — inject `FalconConfirmService`, call `.confirm({ title, body, confirmLabel?, hideCancel? }).subscribe(ok => …)`.
- Replacing `window.confirm()`.
- Single-CTA acknowledgements (`hideCancel: true`).

## Avoid this for

- Route-leave "unsaved changes" gates → `FalconUnsavedChangesService` + `<falcon-unsaved-changes-host>`.
- HTTP/error message modals → `ErrorDialogService` + `<falcon-angular-error-dialog-host>`.
- Toasts / non-blocking notifications → `FalconMessageOrchestratorService` toast adapter.
- Declarative dialogs you control with `[(open)]` → `<falcon-angular-dialog>` / `<falcon-angular-popup>`.
- The dormant `<falcon-angular-confirm-dialog>` Stencil component (dead — different thing).

## Preferred render path

N/A — the host renders nothing in Phase 5; the live render is `<falcon-angular-popup variant="error">` via the orchestrator modal-adapter. To restyle, tune popup tokens.

## Required upgrades before wider use

None for the SERVICE — it is production-quality and already the canonical confirm primitive. For the HOST, the upgrade is removal (GAP G1) + trimming the inert request fields (G2) and vestigial service surface (G4).

## Relationship to other components

| Component | Relationship |
|---|---|
| `FalconMessageOrchestratorService` + `FalconModalAdapterComponent` | The Phase-5 engine the service delegates to; renders the popup. |
| `<falcon-angular-popup>` | The LIVE rendered substrate (`variant="error"`). |
| `<falcon-angular-alert-dialog>` | The LEGACY (dead) template target of the host. |
| `<falcon-unsaved-changes-host>` + `FalconUnsavedChangesService` | Sibling imperative pattern (route-leave gate). |
| `<falcon-angular-error-dialog-host>` (libs/falcon) | Sibling imperative pattern (error message host). |
| `<falcon-angular-confirm-dialog>` | UNRELATED to rendering — dormant Stencil component with a confusingly similar name. |

## Exact rule for future implementation tasks

> **For an imperative confirm, inject `FalconConfirmService` and call `.confirm({ title, body, confirmLabel?, hideCancel? }).pipe(takeUntilDestroyed(destroyRef)).subscribe(ok => { if (ok) … })`.** Treat `false` as the universal cancel. Do NOT mount `<falcon-angular-confirm-dialog-host>` anywhere new (it is a deprecated singleton in `host-shell/app.ts`). Do NOT pass `severity`/`icon` expecting a visual change (inert in Phase 5). For a route-leave gate use `FalconUnsavedChangesService` instead. If asked to remove the dead host, that is GAP G1 (safe-local, app-scoped) — remove the `app.ts` mount + the host component, keep the service.

---

## Dynamic capability assessment

### 1. What is static today?

- The host renders nothing (always-false `@if`).
- The confirm modal's appearance is fixed to `<falcon-angular-popup variant="error">` regardless of `severity`/`icon` (Phase 5).
- The default confirm/cancel labels (`'Confirm'`/`'Cancel'`) when the caller omits them (`[CODE]` service.ts:54-55, :96).

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` Via `FalconConfirmRequest`: `title`, `body`, `confirmLabel`, `hideCancel` reach the popup (live). `severity`, `icon`, `cancelLabel`, `closeOnBackdrop`, `closeOnEsc`, `hideConfirm` are accepted but inert (Phase 5).
- The host component itself has **no inputs/outputs** — pure projection.

### 3. What is already dynamic through slots / ng-template?

- None — content is passed via `FalconConfirmRequest` fields, not slots. The host has no `<ng-content>`.

### 4. What is dynamic through token/theme overrides?

- Nothing on the host. The rendered popup is token-driven (via its own token contract + `dialog.tokens.css` chrome) and flips under `.app-dark`.

### 5. What is dynamic through Tailwind classes?

- Nothing on the host (no chrome). Substrate (popup) classes are internal.

### 6. What is missing to make this reusable across pages?

- Nothing for the service — it is already used across 8 caller files / 3 apps via the MF singleton.
- For richer confirms: honoring `severity`/`icon` (G2) would make it reusable for non-error confirms.

### 7. What capability should be added to shared component (not page hack)?

- If product needs a softer/info confirm tone, add it to the orchestrator/modal-adapter (G2) — not a per-page custom dialog.

### 8. What flags / options / templates / slots would make it better?

- Forward `severity`/`icon`/`cancelLabel` into the rendered popup (G2).
- A focused `FalconConfirmService` spec to lock the Observable contract.
- Possibly a unified confirm service with a `kind` discriminator (G3).

### 9. What is the safest upgrade path?

1. **Add a focused service spec** (zero-risk) to pin supersession + teardown + idempotency.
2. **G2:** wire `severity`/`icon`/`cancelLabel` through the orchestrator → modal-adapter (additive; or trim them with a doc note).
3. **G1 + G4:** remove the dead host mount + vestigial service members in a deliberate commit (app-scoped, safe-local).

### 10. What is risky to change because other pages depend on it?

- **The `confirm()` Observable<boolean> contract** — 8 caller files depend on the single-shot/`true`-on-confirm semantics. Do not change the resolution semantics.
- **The MF singleton sharing** of `FalconConfirmService` — flipping it would split the queue across remotes.
- **The `hideCancel` forwarding** — do-payment relies on the single-CTA acknowledgement behavior.
- Removing the host (G1) is low-risk (it renders nothing) but touches `host-shell/app.ts` — verify the barrel still exports the service and no other mount exists.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15 — NEW). Recommendation: SERVICE READY/PREFERRED, HOST deprecated-in-place. Observable<boolean> contract, MF-singleton, `hideCancel` forwarding, and the always-null `active()` re-confirmed in source. Delete-host (G1) flagged safe-local/app-scoped; inert-fields (G2) and vestigial surface (G4) noted.
