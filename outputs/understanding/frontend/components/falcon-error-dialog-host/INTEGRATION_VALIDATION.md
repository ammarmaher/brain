# falcon-error-dialog-host — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)

The host is **presentational + UI-agnostic** — it owns no data and calls no endpoint. It is the rendering sink for `ErrorDialogService`, whose state is fed by whichever **feature flow** failed:

- **Commerce** — settings save (`commerce/setting/*`), Information-panel save (`commerce/information`), Add-Client/Add-Node create failures.
- **Identity** — Add-User create failures.
- **Studio** — loader-config load/save errors (client-side editor state).

The component never imports an HTTP client `[CODE]` (its only injections are `ErrorDialogService` + `TranslateService`, ts:44-45) — by design, per the skeleton/wrapper doctrine (UI host consumes a UI-agnostic service). ts:10-11.

## Backend wiring

| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| _(none — host is presentational)_ | — | — | — | — | The host calls **no** endpoint. |
| `commerce/setting/*` (failing call that FEEDS the dialog) | PUT/POST | Commerce | settings payload | System GW (admin) / Core GW (mgmt) | On error, the settings-tab signals call `openError({ httpStatus, errorMessages })`. `[CODE]` settings-tab.signals.ts:220. |
| `commerce/information` (failing call) | PUT | Commerce | `UpdateMainNodeInfoRequest` | System/Core GW | Info-panel save failure → `openError(...)`. `[CODE]` info-panel-state.signals.ts:247. |
| Add-User create (failing call) | POST | Identity | user-create payload | System/Core GW | Wizard create failure → `openError(...)` in parallel with field-level mapping. `[CODE]` add-user-wizard.component.ts:213. |

> `[CODE]` The host never reads a response body. The CALLER extracts `httpStatus` (via a `statusFromHttpError(err)` helper) + `errorMessages` (translated) and hands them to `openError`. The host only maps `httpStatus` → title/severity and renders the messages. ts:51-89.

## Validation rules (V-*)

| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| _(inherited)_ | n/a | the FAILED backend operation | the host surfaces the backend's rejection list verbatim — it performs **no validation itself** |
| `422` business-rule rejection | n/a | server returns HTTP 422 | host renders title `hierarchy.error.title.422` ("Business rule rejected") in **warning** severity + the rule list `[CODE]` ts:54/74-78 |
| `400` validation list | n/a | server returns HTTP 400 | title `hierarchy.error.title.400` ("Validation error") in **danger** + the field-error list |

> `[CODE]` The host has **no validator** of its own. It is purely a presenter of backend-supplied messages. All real validation lives server-side (or in the caller's Reactive Forms), surfaced into `errorMessages`.

## PES keys gating this component

| PES key | Action | Effect when denied |
|---|---|---|
| _(none)_ | open / dismiss the dialog | The host has **no PES gate**. It renders whatever error any flow hands it. |

The acknowledgement dialog is role-agnostic — it shows the failure of whatever operation the operator was permitted to attempt. The PES gate lives on the **action** that failed (e.g. "edit settings"), not on the error surface.

## State / signal pattern

`[CODE]` falcon-error-dialog-host.component.ts + error-dialog.service.ts:

- **Single source of truth:** `ErrorDialogService.state = signal<ErrorDialogState | null>` (service:24). The host aliases it (`protected readonly state = this.errorDialog.state`, ts:47) and derives 6 `computed()`s (title/subtitle/severity/messages/confirmLabel).
- **No subscriptions, no timers, no manual CD** — `@if (state(); as s)` in the template reacts to the signal; `OnPush` (ts:38); zoneless-safe.
- **Promise bridge:** `openError(...)` returns a Promise resolved on `dismiss()` (service:32-53) so a flow may await acknowledgement.
- **Translation pipeline:** all display strings flow through `TranslateService.translate(...)` (ts:45) at compute time — re-translates reactively if the language changes while open (the computeds re-run).
- **Error pipeline orthogonality:** the global HTTP response interceptor's toaster is suppressed (`notShowToaster: 'true'`) for flows that use this dialog — the two channels do not double-fire. `[CODE]` settings.service.ts:62.

## Skeleton ↔ app-wrapper layering

- **UI-agnostic service** — `ErrorDialogService` lives in `libs/falcon/src/shared-data-access` (no UI deps); it is the state holder, drivable by any consumer (server-rendered fallback, test snapshot). `[CODE]` service:1-8.
- **Composition host** — `<falcon-angular-error-dialog-host>` lives in `libs/falcon/src/shared-ui`, injects the service, and renders the dual-render `<falcon-angular-alert-dialog>` primitive (imported DOWN, one-way, from `@falcon/ui-core/angular`). `[CODE]` ts:22-32.
- **Rendered primitive** — `<falcon-angular-alert-dialog>` (Stencil-backed dual-render) owns the actual overlay/card/ARIA/focus-trap. The host only maps state → props + projects the bullet list.
- **Cycle-break (FE-CYCLE-01 Fix B):** relocating the host UP from `falcon-ui-core-angular` into `falcon` removed the `falcon ↔ falcon-ui-core-angular` ESM cycle (NG0200 eager-init crash). `[CODE]` ts:22-26 + eslint.config.mjs:85-97 + `[MEMORY]` project_fe_cycle01_resolved_leaf_extraction_2026_06_03.

## Integration gotchas

- `[CODE]` **The host extracts NOTHING from the error** — the caller MUST compute `httpStatus` + translate `errorMessages` before calling `openError`. Passing the raw `HttpErrorResponse` is wrong (the interface wants `{ httpStatus: number; errorMessages: readonly string[] }`). service:12-19.
- `[CODE]` **`401` is a no-op at the service** — never expect a dialog for it; the interceptor handles re-auth. service:32-33.
- `[CODE]` **Last-wins** — a second `openError` while one is open replaces it (and resolves the first Promise). If a flow needs to queue multiple acknowledgements, it must serialize them itself. service:36-40.
- `[CODE]` **Mount once** — `providedIn: 'root'` service + one host. A duplicate host renders a duplicate modal. ts:6 header.
- `[CODE]` **Best-effort i18n echoes raw** — a backend message that is neither a key nor pre-translated shows verbatim. Pass real keys or translated copy. ts:84-88.
- `[CODE]` **Two parallel error hosts coexist** — do NOT route a single-message interceptor error here; that is `FalconHttpErrorDialogService` → `<falcon-angular-http-error-dialog-host>`. falcon-http-error-dialog.service.ts:6.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B27, NEW). Host injects only `ErrorDialogService` + `TranslateService` (ts:44-45) — no HTTP, no PES, no validator. Signal/Promise state model re-read from service:24-53; `401`-suppression + last-wins confirmed. Backend wiring rows 🟡 CODE-DERIVED from the cited caller signals + `[MEMORY]` settings/info-panel pipelines (the host itself touches no endpoint). Cycle-break per eslint.config.mjs:85-97 + `[MEMORY]` FE-CYCLE-01.
