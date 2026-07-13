# falcon-confirm-dialog-host — OVERVIEW

> **Shape note:** this is an **imperative host + service pair**, NOT a Stencil dual-render component. It is a single Angular standalone host element placed ONCE in the app shell that an injectable orchestrator service drives to open confirm prompts on demand (analogous to `<falcon-angular-error-dialog-host>`, `<falcon-angular-message-host>`, `<falcon-unsaved-changes-host>`). There is no `<falcon-confirm-dialog-host>` Stencil tag, no `-tw` twin, and no `confirm-dialog-host.tokens.css`. The 9-file dossier is adapted accordingly (TOKENS/INTEGRATION describe the rendered substrate, not a token file of its own).

## Component purpose

The **app-shell confirm orchestration host**. A feature anywhere in the app injects `FalconConfirmService`, calls `confirm({ title, body }).subscribe(accepted => …)`, and gets back an `Observable<boolean>` — no imperative dialog creation. The host element renders the actual modal. There is exactly one host, one service singleton, one queue across host-shell + every Module-Federation remote.

> **⚠️ Phase-5 reality (2026-05-24): the HOST renders nothing.** `[CODE]` `FalconConfirmService` was rewritten into a **shim over `FalconMessageOrchestratorService`** (`[CODE]` falcon-confirm.service.ts:1-16). `.confirm()` now calls `orchestrator.show({ category: 'action-required' })`, and the orchestrator's `FalconModalAdapterComponent` renders `<falcon-angular-popup variant="error">`. The service's legacy `active()` signal is **always null** (`[CODE]` :14-16, 59-60), so the host's `@if (active())` template body never instantiates. The host is still mounted in `app.ts` "pending its own removal in a later sweep" (`[CODE]` :14-15). So the LIVE confirm modal is the popup; the host is a dead-but-compiling mount.

## Business / UI use case

- The single platform-canonical "are you sure?" entry point for **imperative** confirms (vs declarative `[(open)]` dialogs): discard-unsaved-wizard-step, delete contact group/member, abandon an in-progress action, acknowledgement-only failure popups (`hideCancel: true`).
- Lets any component request a confirm without importing/mounting a dialog — it just injects the service and subscribes.

## When to use it / when NOT to use it

**Use the SERVICE (`FalconConfirmService`) for:**
- Any imperative yes/no decision that returns a boolean to your code flow.
- Replacing `window.confirm()` (banned — `[CODE]` contact-groups-list.component.ts:379).
- Acknowledgement-only failure prompts (pass `hideCancel: true`).

**Do NOT:**
- Mount `<falcon-angular-confirm-dialog-host>` more than once (it is a singleton host; one mount in `host-shell/app.ts` covers all remotes via the `@falcon/ui-core` MF singleton share — `[CODE]` app.ts:49-53).
- Use the SERVICE for a declarative dialog you control with `[(open)]` — use `<falcon-angular-dialog>` / `<falcon-angular-popup>` directly.
- Use it for unsaved-route-leave gating — that has its own host + service: `<falcon-unsaved-changes-host>` + `FalconUnsavedChangesService` (a sibling of this pattern — `[CODE]` falcon-unsaved-changes-host.component.ts:5-6).
- Rely on the HOST element to render in Phase 5 — it does not; the popup (via the orchestrator) does.

## Status

**SERVICE: ACTIVE / PREFERRED** (`FalconConfirmService.confirm()` is the live confirm primitive, 4 caller files / 9+ call sites). **HOST element: DEAD-BUT-MOUNTED** — kept compiling in `app.ts:53` against the legacy `active()` signal, but renders nothing in Phase 5 (orchestrator owns the modal). Wave 13 (2026-05-17) shipped the host+service; Phase 5 (2026-05-24) turned the service into an orchestrator shim and orphaned the host body.

## Replaces

- Native `window.confirm()` (Wave 15 — `[CODE]` contact-groups-list.component.ts:379, contact-group-detail.component.ts:343).
- Per-feature inline confirm dialogs (the host centralizes one queue).
- `[CODE]` Pre-Phase-5 the host directly rendered `<falcon-angular-alert-dialog>` from the service's `active()` signal — that render path is now superseded by the orchestrator's popup (the host template still names alert-dialog but never reaches it).

## Source file paths

| Layer | Path |
|---|---|
| Host component TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-confirm-dialog-host/falcon-confirm-dialog-host.component.ts` (71 ln) |
| Host component HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-confirm-dialog-host/falcon-confirm-dialog-host.component.html` (22 ln) |
| Service TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-confirm-dialog-host/falcon-confirm.service.ts` (129 ln) |
| Barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-confirm-dialog-host/index.ts` (exports host + `FalconConfirmService` + `FalconConfirmRequest` + `FalconConfirmSeverity`) |
| Rendered substrate (legacy template) | `<falcon-angular-alert-dialog>` — `libs/falcon-ui-core/src/angular-wrapper/components/falcon-alert-dialog/` (dead in Phase 5) |
| Actual live renderer (Phase 5) | `<falcon-angular-popup variant="error">` via `libs/falcon-ui-core/src/services/message-orchestrator/adapters/falcon-modal-adapter.component.ts` |
| App-shell mount | `apps/host-shell/src/app/app.ts:31, 53` |
| Spec/tests | `apps/host-shell/tests/falcon-message-orchestrator.spec.ts` (covers the orchestrator path `FalconConfirmService` routes through — `[CODE]` :499) |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular host selector | `falcon-angular-confirm-dialog-host` |
| Injectable service | `FalconConfirmService` (`@Injectable({ providedIn: 'root' })`) |
| Stencil tag | _none — this is Angular-only_ |

## Known consumers (grep verified 2026-06-03)

- **Host element mount:** exactly **1** — `apps/host-shell/src/app/app.ts:53` (`<falcon-angular-confirm-dialog-host />`).
- **`FalconConfirmService` injectors:** **4 files / 9+ call sites** — `[CODE]`:
  - `apps/admin-console/.../org-hierarchy-page/services/hierarchy-page-state.service.ts:237, 506`
  - `apps/admin-console/.../add-user-wizard.component.ts:404`, `add-client-wizard.component.ts:361`
  - `apps/management-console/.../org-hierarchy-page/services/hierarchy-page-state.service.ts:296`
  - `apps/management-console/.../add-user-wizard.component.ts:448`
  - `apps/management-console/.../contact-groups/contact-groups-list.component.ts:382`, `contact-group-detail.component.ts:346`
  - `apps/host-shell/.../do-payment-priority-popup/do-payment-priority-popup.component.ts:602`
  - `libs/falcon/.../user-details-page.component.ts:378` (via `FalconUnsavedChangesService`, the sibling pattern that also exposes `.confirm()`)

See `USAGE.md` for the enumerated list.

## Related components

- **Sibling hosts (same imperative pattern):** `<falcon-angular-error-dialog-host>` (`ErrorDialogService` → alert-dialog; lives in `libs/falcon`), `<falcon-angular-message-host>` (`FalconMessageOrchestratorService` toasts), `<falcon-unsaved-changes-host>` + `FalconUnsavedChangesService` (route-leave gate), `<falcon-angular-http-error-dialog-host>`.
- **Rendered substrate:** `<falcon-angular-alert-dialog>` (legacy template target) and `<falcon-angular-popup>` (Phase-5 actual). See `[BRAIN-OUT]` `components/falcon-alert-dialog/`.
- **Orchestrator:** `FalconMessageOrchestratorService` + `FalconModalAdapterComponent` — the Phase-5 renderer.
- **NOT related to render:** `<falcon-angular-confirm-dialog>` (the dormant Stencil-based confirm component) — despite the similar name, the host does NOT use it. See `[BRAIN-OUT]` `components/falcon-confirm-dialog/`.

## Ownership / responsibility

`libs/falcon-ui-core` (Angular-wrapper area; cross-framework not applicable — Angular-only). Owned by Falcon UI team. The host element removal is an open follow-up (`[CODE]` falcon-confirm.service.ts:14-15 explicitly flags "pending its own removal in a later sweep").

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15 sweep — NEW dossier). Host (71 ln) + service (129 ln) + HTML (22 ln) read in full; mount confirmed at `app.ts:53`; Phase-5 orchestrator shim + always-null `active()` + popup render path traced end-to-end. Adapted to the imperative-host shape (no Stencil twin / token file). Consumer counts grep-verified.
