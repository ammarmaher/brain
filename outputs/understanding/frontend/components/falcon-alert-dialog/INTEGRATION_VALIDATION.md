# falcon-alert-dialog — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[INFERRED]`.

## Owning backend module(s)
**None — the component is presentational.** `[CODE]` `OVERVIEW.md:34-37` — the Stencil + Angular wrapper layer injects no services and owns no data. The *decision* it gates belongs to whatever backend module the calling flow targets:
- **Charging / Commerce** — the Insufficient-Balance funding decision (do-payment, wallet prioritisation) `[BRAIN-OUT]` `SPEC.md:5`.
- **Commerce** — settings / account-edit discard confirmations `[INFERRED]` from `USAGE.md` consumers.
- The app-level wrapper (e.g. an `<app-do-payment-priority-popup>`, `[CODE]` `OVERVIEW.md:32`) is the layer that injects the API service and calls the gateway.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| (none called by the component) | — | — | — | — | `[CODE]` alert-dialog emits `falcon-alert-confirm` / `falcon-alert-cancel`; the app-wrapper translates Confirm into the actual API call (e.g. `do-payment` POST). |
| `[INFERRED]` do-payment + order-status poll | POST + GET | Commerce / Charging via System Gateway | per the owning flow's DTOs | System Gateway `useGateway()` | `[MEMORY]` `project_commchannels_apps_tabs_backend_integration_plan` — do-payment polls `GET order/{orderId}/status`; alert-dialog only gates the *decision* to start it. |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| `[CODE]` two-button invariant | `hideConfirm` + `hideCancel` | both set true | no runtime error — the dialog renders with zero action buttons and traps the user (`OVERVIEW.md:54`); a lint/review-time rule, not a backend V-rule |
| `[INFERRED]` funding-sufficiency | (the owning Payment step) | order total exceeds available balance | the alert-dialog is *opened* as the surfacing of a backend funding-decision rule — it does not itself validate |

The component has no form fields and runs no validators. It is the *surface* for a decision the owning flow's `validations/` layer or backend has already computed.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (none own) | — | The alert-dialog inherits no PES key. `[INFERRED]` Where the action behind Confirm is PES-gated (e.g. `FalconAccess.adminConsole.services.payment`), the *trigger* that opens the dialog is hidden/disabled by the owning step's PES resolution — the dialog itself is never reached. |

## State / signal pattern
`[CODE]` `falcon-alert-dialog.component.ts:49` — the Angular wrapper uses classic `@Input()` (NOT signal inputs). `open` is two-way: `[CODE]` `:65-67` outputs `falconConfirm` / `falconCancel` / `openChange`; `[CODE]` `:82-87` `onCancel` sets `this.open = false` and emits `openChange(false)` so a `[(open)]` consumer stays in sync.
`[CODE]` `falcon-alert-dialog.tsx:84-87` — the Stencil `@Watch('open')` re-emits `falcon-alert-open-change` on every change. `[CODE]` `:90-99` — Confirm and every Cancel path set `open = false` *first*, then emit — the dialog closes optimistically. The owning flow typically holds a `signal<boolean>` for `open` and an effect/handler on `(falconConfirm)` that fires the API call.
**Error pipeline:** `[MEMORY]` `project_commchannels_apps_tabs_wave17` — global HTTP error handling lives in `falcon-http-ui.config.ts` (400→toast, 403/404/5xx→popup, 422→warning toast). Because alert-dialog self-closes on Confirm, a failed confirmed action surfaces through *that* pipeline, not back inside the dialog (the dialog has no `[confirmLoading]` state — `[CODE]` `GAPS_AND_UPGRADES.md:16-18` flags this as a P2 gap).

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `[CODE]` `falcon-alert-dialog.tsx` `<falcon-alert-dialog>` (Shadow) + `falcon-alert-dialog-tw.tsx` `<falcon-alert-dialog-tw>` (Light DOM). Pure presentational; composes `<falcon-dialog>` for focus-trap / backdrop / esc (`:137-147`).
- **Angular wrapper** — `[CODE]` `falcon-alert-dialog.component.ts` `<falcon-angular-alert-dialog>`. Picks the render path via `[useTailwind]` (default `true` → Light DOM); `[CODE]` `:71-75` `ngOnInit` calls `defineFalconTwComponent('falcon-alert-dialog')` on demand. Still presentational — no service injection.
- **App-level wrapper** — `[CODE]` `OVERVIEW.md:32` `<app-do-payment-priority-popup>` / similar in `apps/.../shared-components/`: this is the layer that injects the business service and calls the API. Per `[VAULT]` `feedback_library_skeleton_app_api` — lookups/APIs are never fetched inside the library component.
- **Related service** — `[CODE]` `falcon-http-error-dialog.service.ts:6-8` — `ErrorDialogService` (drives `<falcon-angular-alert-dialog>` with a multi-message list) is the documented sibling of `FalconHttpErrorDialogService` (drives the simpler `falcon-popup`). Both are singleton signal-based stores mounted once in the shell.

## Integration gotchas
- `[CODE]` `falcon-alert-dialog.tsx:146` — the Stencil component listens to `onFalcon-close` (lowercase, dash-separated) from the composed `<falcon-dialog>`. This is the Stencil-correct cross-component bubbled-event syntax; binding `onFalconClose` would silently no-op.
- `[CODE]` `falcon-alert-dialog.tsx:36` — the Stencil prop is `headingText`, **renamed from `title`** to avoid the reserved `HTMLElement.title` prototype clash. The Angular wrapper re-exposes it as `[title]` (`falcon-alert-dialog.component.ts:50`). Binding `[heading]` or `[headingText]` on the Angular tag does nothing.
- `[CODE]` `falcon-alert-dialog.component.ts:84-86` — the wrapper's `onCancel` mutates `this.open = false` directly. Because change detection is `OnPush` (`:45`), a consumer relying on `[(open)]` must let the `openChange` event drive the bound signal — do not also force `open` from outside on the same tick.
- `[INFERRED]` alert-dialog has **no `[confirmLoading]` / busy state** (`GAPS_AND_UPGRADES.md:16-18`). For an async confirmed action, the dialog vanishes immediately — the flow must show its own progress indicator (e.g. order-status poll spinner) and route failures to the global error pipeline.

## Verification
🟡 CODE-DERIVED from `falcon-alert-dialog.tsx` + `falcon-alert-dialog.component.ts` + `falcon-http-error-dialog.service.ts`. App-wrapper layering ✅ VERIFIED against `OVERVIEW.md:32-37`. Error-pipeline behaviour ✅ flagged in `[MEMORY]` `project_commchannels_apps_tabs_wave17`. A full-fidelity pass should read the `-tw` variant + `falcon-dialog.tsx` directly.
