# falcon-error-dialog-host — OVERVIEW

> **Single-render Angular shared-ui component** (`libs/falcon/src/shared-ui`), NOT a dual-render Stencil component. There is **no Shadow/`-tw` twin, no Tailwind-helper, and no component token file** — it is a thin Angular composition HOST that renders the dual-render `<falcon-angular-alert-dialog>` primitive. Rubric dimensions **B (Stencil dual-render)** and **E (cross-framework parity)** are therefore **N/A** and marked so throughout.

## Component purpose

Imperative, app-shell-mounted **global error-dialog host**. It subscribes to the UI-agnostic `ErrorDialogService` signal and renders exactly one `<falcon-angular-alert-dialog>` whenever the service holds an active error state. Feature code never creates a dialog imperatively — it calls `ErrorDialogService.openError({ httpStatus, errorMessages })` and this host opens / closes / re-translates the dialog in response. `[CODE]` falcon-error-dialog-host.component.ts:1-11.

It is the **acknowledge-this-backend-error** surface: a centered modal with a translated status-aware title, an error-count subtitle, a bulleted list of (best-effort-translated) error messages, and a single OK button. `[CODE]` falcon-error-dialog-host.component.html:3-25.

## Business / UI use case

- **Settings-tab save failures** and **Information-panel save failures** in BOTH admin-console and management-console org-hierarchy pages open it via `ErrorDialogService.openError(...)`. `[CODE]` admin/management `org-hierarchy-page/.../settings-tab/signals/settings-tab.signals.ts:220/276/296` + `.../hierarchy-tab/falcon-org-info-panel/signals/info-panel-state.signals.ts:247/353/377`.
- **Add-User wizard** create failures open it in parallel with field-level error mapping. `[CODE]` admin/management `add-user-wizard/add-user-wizard.component.ts:201/213` ("The error dialog is opened in parallel by ErrorDialogService").
- **falcon-studio loader editor** routes load errors through `ErrorDialogService`. `[CODE]` libs/falcon-studio/.../loader-studio-state.service.ts:32/160.
- The host renders these as a uniform, full-message-list acknowledgement modal (e.g. a `422` business-rule rejection showing every broken rule as a bullet).

## When to use it / when NOT to use it

**Use it (the SERVICE, not the host) for:**
- A backend operation that returns one OR MORE messages the operator MUST acknowledge before continuing (validation list, business-rule rejection, conflict). Call `ErrorDialogService.openError({ httpStatus, errorMessages })`.
- Flows that suppress the global toaster (`headers: { notShowToaster: 'true' }`) and own their own error UX — the settings tab + info panel do exactly this. `[CODE]` settings.service.ts:62 / information.service.ts:55.

**Do NOT use it for:**
- A single-line transient status message → use the **Falcon Message Orchestrator toast adapter** (`<falcon-toast-adapter>` driven by `FalconMessageOrchestratorService`) `[CODE]` app.ts:47, or the deprecated `FalconMessageService` queue.
- A single-message OK-only HTTP-interceptor popup → use the **PARALLEL** `FalconHttpErrorDialogService.show({...})` → `<falcon-angular-http-error-dialog-host>` (a `<falcon-angular-popup>` in OK-only mode). `[CODE]` libs/falcon-ui-core/.../falcon-popup/falcon-http-error-dialog.service.ts:6 explicitly documents the two as parallel doctrines (this host = multi-message **alert-dialog**; that host = single-message **popup**).
- A confirm/cancel decision → use `FalconConfirmService` → `<falcon-angular-confirm-dialog-host>`.
- An unsaved-changes guard → use `FalconUnsavedChangesService` → `<falcon-unsaved-changes-host>`.
- A `401` → it is **suppressed** by `ErrorDialogService.openError` (the response interceptor handles re-auth) and never reaches this host. `[CODE]` error-dialog.service.ts:32-33 + component comment ts:71-73.

## Status

**ACTIVE / PREFERRED for multi-message backend-error acknowledgement.** Not deprecated. `[CODE]` v1.3.0 (2026-05-16), header ts:4. **RELOCATED 2026-06-03 (FE-CYCLE-01 Fix B)** from `libs/falcon-ui-core/src/angular-wrapper` UP into `libs/falcon/src/shared-ui` — because it consumes falcon's `ErrorDialogService` + `TranslateService`, the old location created a `falcon ↔ falcon-ui-core-angular` ESM cycle (the NG0200 eager-init crash). Now it imports the alert-dialog primitive DOWN via `@falcon/ui-core/angular` (one-way) and the cycle is gone. `[CODE]` ts:22-26 + eslint.config.mjs:85-97 + `[MEMORY]` project_fe_cycle01_resolved_leaf_extraction_2026_06_03.

## Replaces

- A prior bespoke per-feature "imperatively `new` a dialog on every save failure" pattern — consolidated into one service + one shell-mounted host. `[CODE]` error-dialog.service.ts:2-5.
- NOT a replacement for the parallel `FalconHttpErrorDialogService`/`<falcon-angular-http-error-dialog-host>` — both coexist by design.

## Source file paths

| Layer | Path |
|---|---|
| Angular component TS | `libs/falcon/src/shared-ui/lib/components/falcon-error-dialog-host/falcon-error-dialog-host.component.ts` (98 ln) |
| Angular component HTML | `libs/falcon/src/shared-ui/lib/components/falcon-error-dialog-host/falcon-error-dialog-host.component.html` (26 ln) |
| Component CSS | **NONE** — no `.component.css`; styling is entirely token-driven via the embedded alert-dialog primitive + Tailwind utilities on the projected `<ul>`. |
| Barrel | `libs/falcon/src/shared-ui/lib/components/falcon-error-dialog-host/index.ts` (3 ln) |
| Library re-export | `libs/falcon/src/shared-ui/index.ts:406-410` (`export * from './lib/components/falcon-error-dialog-host'`) |
| Driving service | `libs/falcon/src/shared-data-access/lib/services/error-dialog.service.ts` (54 ln) — `ErrorDialogService` + `ErrorDialogState` |
| Service barrel | `libs/falcon/src/shared-data-access/lib/services/index.ts:10` |
| Rendered primitive | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-alert-dialog/falcon-alert-dialog.component.ts` (`<falcon-angular-alert-dialog>`) |
| Mount site | `apps/host-shell/src/app/app.ts:15/27/39` (imported from `@falcon`, declared, rendered) |
| Stencil Shadow / Light twin | **N/A** — single-render Angular host; no `.tsx`. |
| Token file | **N/A** — no `falcon-error-dialog-host.tokens.css`; relies on `alert-dialog` + Falcon theme tokens. |
| Spec/tests | **NONE found** `[CODE]` (no `*.spec.ts` under the slug; GAP G6). |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-error-dialog-host` `[CODE]` ts:35 |
| Host class | `.falcon-angular-error-dialog-host` (via `@HostBinding`) `[CODE]` ts:42 |
| Stencil tag | **N/A** |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-angular-error-dialog-host>` / `FalconAngularErrorDialogHostComponent` renders in exactly **1 file**:

- `apps/host-shell/src/app/app.ts:15/27/39` — the app shell mounts it once (`<falcon-angular-error-dialog-host></falcon-angular-error-dialog-host>`), next to `<falcon-angular-message-host>` and `<falcon-angular-http-error-dialog-host>`.

The **driving service** `ErrorDialogService` has far more reach (the host is the single rendering sink for all of them) — callers of `openError(...)`: settings-tab signals (admin+mgmt), info-panel-state signals (admin+mgmt). See `USAGE.md` Consumer Sweep for the enumerated call sites.

## Related components

- **Renders:** `<falcon-angular-alert-dialog>` (the dual-render alert-dialog primitive — title/subtitle/severity/confirm/cancel + body slot). `[CODE]` ts:29-32 + html:4.
- **Parallel sibling (NOT this):** `<falcon-angular-http-error-dialog-host>` (driven by `FalconHttpErrorDialogService`; single message; OK-only `<falcon-angular-popup>`). Both mounted in app.ts.
- **Sibling shell hosts (same "service + shell-mounted host" doctrine):** `<falcon-angular-confirm-dialog-host>` (FalconConfirmService), `<falcon-unsaved-changes-host>` (FalconUnsavedChangesService), `<falcon-angular-message-host>` (FalconMessageService), `<falcon-modal-adapter>` + `<falcon-toast-adapter>` (FalconMessageOrchestratorService). `[CODE]` app.ts:37-57.

## Ownership / responsibility

`libs/falcon` shared-ui (the composition host) + `libs/falcon` shared-data-access (the `ErrorDialogService` state holder). The rendered primitive + its token contract are owned by `libs/falcon-ui-core` / `libs/falcon-ui-tokens`. Owned by the Falcon UI team.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B27 sweep, NEW dossier). All facts read from live source (component ts/html/index, error-dialog.service.ts, app.ts, en.json `hierarchy.error.*`, alert-dialog component @Inputs). Single-render Angular host confirmed (no `.tsx`/token file). Consumer = 1 mount site; service callers grep-verified across admin+mgmt.
