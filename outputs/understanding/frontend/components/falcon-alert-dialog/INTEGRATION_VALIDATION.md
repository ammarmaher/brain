# falcon-alert-dialog — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)

**None — the component is presentational.** The Stencil + Angular wrapper layer injects no services and owns no data. The *decision* / *message* it surfaces belongs to whatever module the calling layer targets:
- **Platform-wide (error lists)** — `ErrorDialogService` collects backend error messages (from the HTTP error pipeline) and renders them; no module of its own.
- **Charging / Commerce** — the Insufficient-Balance funding decision (do-payment, wallet prioritisation) — the SoT origin.
- The app-level wrapper (e.g. `do-payment-priority-popup`) is the layer that injects the API service and calls the gateway.

## Backend wiring

| Endpoint | Method | Backend module | DTO | Gateway | Notes |
|---|---|---|---|---|---|
| (none called by the component) | — | — | — | — | alert-dialog emits `falcon-alert-confirm` / `falcon-alert-cancel`; the app-wrapper / service translates Confirm into the API call. |
| `[INFERRED]` do-payment + order-status poll | POST + GET | Commerce / Charging via System Gateway | per the owning flow's DTOs | System Gateway | `[MEMORY]` do-payment polls `GET order/{orderId}/status`; alert-dialog only gates the *decision* to start it. |

## How it is rendered (the live integration)

`[CODE]` Two host/service renderers drive alert-dialog (you rarely mount it directly):

1. **`ErrorDialogService` → `<falcon-angular-error-dialog-host>`** (`libs/falcon/src/shared-ui/.../falcon-error-dialog-host/`). The host's `@if (state())` renders `<falcon-angular-alert-dialog [title] [subtitle] [severity] [hideCancel]="true">` with a projected `<ul>` of `errorMessages()` (`[CODE]` .component.html:4-25). Both `(falconConfirm)` and `(falconCancel)` → `dismiss()`. Mounted once in `host-shell/app.ts:39`.
2. **`FalconMessageOrchestratorService` → `FalconModalAdapterComponent`** — for `category === 'configuration-required'` WITHOUT an `actionCallback`, `renderKind = 'alert-dialog'` → renders `<falcon-angular-alert-dialog severity="warning" [hideCancel]="true">` (`[CODE]` falcon-modal-adapter.component.ts:75-85, 109-110). (With an `actionCallback`, or for `action-required`, the adapter renders `<falcon-angular-popup>` instead — alert-dialog is the no-decision acknowledgement branch.)

> So the integration story is: **alert-dialog = the "acknowledge / read this" substrate; popup = the "decide" substrate.** `FalconConfirmService` (imperative confirm) routes to the popup, NOT here.

## Validation rules (V-*)

| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| `[CODE]` two-button invariant | `hideConfirm` + `hideCancel` | both true | no runtime error — renders zero action buttons + traps the user; a lint/review-time rule, not a backend V-rule |
| `[INFERRED]` funding-sufficiency | (the owning Payment step) | order total > available balance | the alert-dialog is *opened* as the surface of a backend funding-decision rule — it does not itself validate |

The component has no form fields and runs no validators.

## PES keys gating this component

| PES key | Action | Effect when denied |
|---|---|---|
| (none own) | — | The alert-dialog inherits no PES key. `[INFERRED]` Where the action behind Confirm is PES-gated, the *trigger* that opens the dialog is hidden/disabled by the owning step's PES resolution. |

## State / signal pattern

`[CODE]` falcon-alert-dialog.component.ts:61-70 — the wrapper mirrors `open` into an internal **`openSignal`** so the native `<dialog falconOverlay="modal">`'s `falconOpen` model + the `@Input` stay in lockstep. Outputs `falconConfirm` / `falconCancel` / `openChange`; `onCancel` sets `this.open = false` + emits `openChange(false)` so a `[(open)]` consumer stays in sync (`[CODE]` :104-109). The native dialog's close/cancel are bridged back into `open` via `onNativeDialogClose`/`onNativeDialogCancel` (`[CODE]` :120-129) — and `closeOnEsc=false` is honored by `preventDefault()`ing the native cancel (`[CODE]` :127-128).
`[CODE]` falcon-alert-dialog.tsx:84-101 — Stencil `@Watch('open')` re-emits `falcon-alert-open-change`; Confirm + every Cancel set `open=false` first, then emit (optimistic close).
**Zoneless-safe:** `OnPush` + signal-mirrored open. **Error pipeline:** because the dialog self-closes on Confirm and has no `confirmLoading`, a failed confirmed action surfaces via the global HTTP pipeline (`[MEMORY]` 400→toast / 5xx→popup), not back inside the dialog.

## Skeleton ↔ app-wrapper layering

- **Stencil skeleton** — `<falcon-alert-dialog>` (Shadow) + `<falcon-alert-dialog-tw>` (Light DOM, separate folder). Pure presentational; composes `<falcon-dialog>` / `<falcon-dialog-tw>` for focus-trap / backdrop / esc (`[CODE]` tsx:137-147, tw.tsx:115-125).
- **Angular wrapper** — `<falcon-angular-alert-dialog>`: picks render path via `[useTailwind]` (default `true` → Light DOM); `ngOnInit` calls `defineFalconTwComponent('falcon-alert-dialog')` (`[CODE]` :93-97). **Adds a native `<dialog falconOverlay="modal">` outer wrapper** for Top-Layer promotion (`[CODE]` html:6-12) — neutralising the nested dialog's backdrop so the native `::backdrop` owns dim+blur (`[CODE]` .component.css:19-46). Still presentational — no service injection.
- **App-level wrapper / host** — `do-payment-priority-popup` (app), `falcon-error-dialog-host` (libs/falcon), the orchestrator modal-adapter (libs/falcon-ui-core): these inject the business service / drive the open state. Per `[VAULT]` `feedback_library_skeleton_app_api`, APIs are never fetched inside the library component.

## Integration gotchas

- `[CODE]` **`title` (Angular) → `heading-text` (Stencil attr)** — the Stencil prop is `headingText` (renamed from `title` to dodge the `HTMLElement.title` clash, `[CODE]` tsx:32-34); the wrapper binds `[attr.heading-text]="title ?? null"` (`[CODE]` html:16/38). Binding `[heading]`/`[headingText]` on the Angular tag does nothing.
- `[CODE]` **`onFalcon-close`** (lowercase, dash) is the cross-component event from the composed dialog (`[CODE]` tsx:146); `onFalconClose` no-ops.
- `[CODE]` **Native-`<dialog>` open sync** — the wrapper's `open` setter + `openSignal` + the native close/cancel bridges keep three sources in lockstep. A consumer relying on `[(open)]` must let `openChange` drive the bound signal — do not also force `open` from outside on the same tick (OnPush).
- `[CODE]` **No `confirmLoading` / busy state** — async confirmed actions vanish the dialog immediately; show your own progress + route failures to the global pipeline (GAP).
- `[CODE]` **`-tw` per-instance token override break** — per-instance `--falcon-alert-dialog-*` overrides do NOT reach the `-tw` (default) render path's Confirm/icon/cancel colors (`[BRAIN-OUT]` TOKENS.md) — the live error-host + orchestrator both use `useTailwind=true`.
- `[CODE]` **Outer-backdrop dim/blur is hardcoded** — the wrapper's `::backdrop` uses raw `rgba(13,63,68,0.45)` + `blur(2px)` (`[CODE]` .component.css:42-44), NOT the `--falcon-dialog-backdrop-*` tokens (token-discipline GAP).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15). Live render path traced through `falcon-error-dialog-host.component.html` + `falcon-modal-adapter.component.ts` (alert-dialog = acknowledgement branch; popup = decision branch). Native-`<dialog>` Top-Layer wrapper + open-sync bridges + `title`→`heading-text` rename re-confirmed in `falcon-alert-dialog.component.{ts,html,css}`. Drift corrected: the wrapper is NOT a bare Stencil passthrough (it adds the native-`<dialog>` layer); `-tw` token-parity + raw-backdrop gotchas added.
