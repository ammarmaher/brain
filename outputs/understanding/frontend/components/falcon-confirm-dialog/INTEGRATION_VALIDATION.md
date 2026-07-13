# falcon-confirm-dialog — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)

**None — the component is presentational AND dormant.** `[CODE]` falcon-confirm-dialog.tsx:1-3 — a specialized composition of `<falcon-dialog>`; it owns no data and (being commented out) is wired to nothing. Any accept/reject *decision* belongs to whatever module the calling flow targets, and today every such flow uses `FalconConfirmService` rather than this component.

## Backend wiring

| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| (none called by the component) | — | — | — | — | `[CODE]` tsx:63-72 emits `falcon-confirm-accept` / `falcon-confirm-reject` / `falcon-confirm-open-change`; no consumer translates these. The component has **zero HTTP coupling**. |

## Validation rules (V-*)

| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| (none) | — | — | No form fields, no validators (`[CODE]` API.md "CVA: N/A"). |

## PES keys gating this component

| PES key | Action | Effect when denied |
|---|---|---|
| (none own) | — | The confirm-dialog inherits no PES key. `[INFERRED]` Where the action behind Accept is PES-gated, the trigger that would open a confirm is hidden/disabled by the owning component's PES resolution. |

## The LIVE confirm integration (what replaced this component)

`[CODE]` This is the integration that actually ships — documented here because it is the answer to "how does confirm integrate":

1. **`FalconConfirmService.confirm(request): Observable<boolean>`** (`[CODE]` falcon-confirm.service.ts:65-116) — a cold Observable emitting exactly once (`true` = confirm; `false` = cancel / backdrop / Esc / replaced-by-a-newer-confirm) then completing.
2. It calls **`FalconMessageOrchestratorService.show({ category: 'action-required', title, message, actionLabel, actionCallback: () => resolve(true), cancelCallback: () => resolve(false), hideCancel, correlationId })`** (`[CODE]` :91-105).
3. **`FalconModalAdapterComponent`** subscribes to `orchestrator.activeModal()` and, for `category === 'action-required'`, renders **`<falcon-angular-popup variant="error">`** (`[CODE]` falcon-modal-adapter.component.ts:51-61, 108).
4. **Sequential semantics:** a new `confirm()` while one is open resolves the previous one as `false` first (`[CODE]` :67-72).
5. **Teardown:** unsubscribing before the user picks resolves `false` + dismisses the orchestrator modal by `correlationId` (`[CODE]` :109-114).

> So the confirm-dialog Stencil component is bypassed entirely — the live render is `<falcon-angular-popup>` (B-substrate sibling), driven by the orchestrator. The `<falcon-angular-confirm-dialog-host>` legacy mount (host-shell/app.ts:53) is also dead in Phase 5 (`active()` always null — `[CODE]` falcon-confirm.service.ts:14-16, 59-60).

## State / signal pattern (the dormant component, for completeness)

`[CODE]` falcon-confirm-dialog.tsx:74-95 — Stencil `@Watch('open')` re-emits `falcon-confirm-open-change` on every change. Accept (`handleAccept`), Reject (`handleReject`), and dialog-close (`handleDialogClose`) all set `open = false` *first*, then emit. Accept emits `falcon-confirm-accept`; the other two BOTH emit `falcon-confirm-reject`. The (commented) Angular wrapper would use classic `@Input()` + a two-way `[(open)]`.

## Skeleton ↔ app-wrapper layering

- **Stencil skeleton** — `<falcon-confirm-dialog>` (Shadow) + `<falcon-confirm-dialog-tw>` (Light DOM). Pure presentational; composes `<falcon-dialog>` / `<falcon-dialog-tw>` (`[CODE]` tsx:100, tw.tsx:69) for focus-trap / backdrop / esc.
- **Angular wrapper** — `<falcon-angular-confirm-dialog>`: **dormant (commented out).** Were it live it would pick render path via `[useTailwind]` and internally import `FalconAngularDialogComponent`.
- **App-level wrapper** — per `[VAULT]` `feedback_library_skeleton_app_api`, the API call lives at the app/state layer. For the live confirm path, that contract is honored by `FalconConfirmService`'s callers (the wizard/state-service holds the Observable subscription and the API call).

## Integration gotchas

- `[CODE]` tsx:109 — the Stencil component listens to `onFalcon-close` (lowercase, dash-separated) from the composed `<falcon-dialog>`. Binding `onFalconClose` silently no-ops.
- `[CODE]` tsx:29 vs API — the Stencil prop is `heading`; the (dormant) Angular wrapper renames it to `title`. `[heading]` on the Angular tag would do nothing.
- `[CODE]` tsx:63-72 — Stencil events are `falcon-confirm-accept` / `falcon-confirm-reject` / `falcon-confirm-open-change`; the (dormant) wrapper would re-expose them as `accept` / `reject` / `openChange`.
- `[CODE]` tsx:124-139 — accept/reject buttons are raw `<button>`, NOT `<falcon-button-tw>` (P1 structural gap). No built-in loading/disabled state.
- `[CODE]` tsx:91-95 — backdrop / Esc / close-X all fire `reject`, not a distinct `cancel`/`close`. (The live `FalconConfirmService` preserves this: `false` for all dismissals.)
- `[CODE]` `icon` is a CSS-class string via `<i>` — passing an `<svg>` does not work.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15). The LIVE confirm integration (`FalconConfirmService` → orchestrator → `<falcon-angular-popup>`) ✅ traced end-to-end in source (falcon-confirm.service.ts + falcon-modal-adapter.component.ts). Drift corrected vs prior dossier: the prior "there is no dedicated FalconConfirmService" claim is **wrong** — it exists and IS the live confirm path; the confirm-dialog component is bypassed. PES/V-rule sections remain N/A (presentational + dormant).
