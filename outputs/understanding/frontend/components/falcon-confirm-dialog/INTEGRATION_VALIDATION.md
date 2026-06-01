# falcon-confirm-dialog — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[INFERRED]`.

## Owning backend module(s)
**None — the component is presentational.** `[CODE]` `falcon-confirm-dialog.tsx:1-3` — it is a specialized composition of `<falcon-dialog>` and owns no data. The accept/reject *decision* belongs to whatever backend module the calling flow targets:
- **Commerce** — Add Client wizard / settings discard confirmations `[INFERRED]` from `USAGE.md:109`.
- For any "Approve / Reject" operational confirm, the owning flow's module (Commerce / Provisioning / Identity) owns the actual mutation; the confirm-dialog only gates it.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| (none called by the component) | — | — | — | — | `[CODE]` `falcon-confirm-dialog.tsx:63-72` emits `falcon-confirm-accept` / `falcon-confirm-reject` / `falcon-confirm-open-change`; the consuming component translates Accept into the actual API call. |

The component has zero HTTP coupling — it is a pure decision surface.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| (none) | — | — | The confirm-dialog has no form fields and runs no validators `[CODE]` `API.md:60` ("CVA support: Not applicable"). |

`[INFERRED]` Where a confirm-dialog gates a discard-of-dirty-form, the *dirty* state is computed by the owning step's snapshot dirty-tracker (e.g. the `formValue` vs `snapshot` pattern in `SettingsTabStateSlice`, `[MEMORY]` `project_settings_tab_standalone_wave14`) — the confirm-dialog only fires when that tracker says the form is dirty.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (none own) | — | The confirm-dialog inherits no PES key. `[INFERRED]` Where the action behind Accept is PES-gated, the trigger that opens the dialog is hidden/disabled by the owning component's PES resolution — the dialog itself is never reached. |

## State / signal pattern
`[CODE]` `falcon-confirm-dialog.component.ts` (Angular wrapper) uses classic `@Input()` decorators `[CODE]` `API.md:62`. `open` is two-way via `openChange` `[CODE]` `API.md:19,34-36`.
`[CODE]` `falcon-confirm-dialog.tsx:74-77` — Stencil `@Watch('open')` re-emits `falcon-confirm-open-change` on every change. `[CODE]` `:79-95` — Accept (`handleAccept`), Reject (`handleReject`), and dialog-close (`handleDialogClose`) all set `open = false` *first*, then emit. Accept emits `falcon-confirm-accept`; the other two BOTH emit `falcon-confirm-reject`.
**Error pipeline:** `[INFERRED]` because the dialog self-closes on Accept and has no `loading` input (`GAPS_AND_UPGRADES.md:20-29`), a confirmed action that fails async surfaces through the global HTTP error pipeline (`[MEMORY]` `project_commchannels_apps_tabs_wave17` — `falcon-http-ui.config.ts`: 400→toast, 403/404/5xx→popup, 422→warning toast), not back inside the dialog.
**Related service** — `[CODE]` `falcon-http-error-dialog.service.ts:6-8` documents `ErrorDialogService` (drives `<falcon-angular-alert-dialog>` with a multi-message list) and `FalconHttpErrorDialogService` (drives `falcon-popup`). There is no dedicated `FalconConfirmService` in the read sources — the confirm-dialog is a declarative `[(open)]`-bound component, not an imperative service-summoned dialog.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `[CODE]` `falcon-confirm-dialog.tsx` `<falcon-confirm-dialog>` (Shadow) + `falcon-confirm-dialog-tw` (Light DOM, `OVERVIEW.md:35`). Pure presentational; composes `<falcon-dialog>` (`:100-110`) for focus-trap / backdrop / esc.
- **Angular wrapper** — `[CODE]` `OVERVIEW.md:31-32` `<falcon-angular-confirm-dialog>`. Picks render path via `[useTailwind]` (default `true`). The wrapper internally imports `FalconAngularDialogComponent` `[CODE]` `USAGE.md:93` — consumers do not import it explicitly. Still presentational — no service injection.
- **App-level wrapper** — `[INFERRED]` the consuming feature component (e.g. the Add Client `client-settings-step`) holds the `[(open)]` signal, the API service, and the `(accept)` handler. Per `[VAULT]` `feedback_library_skeleton_app_api`, the API call lives at the app/state layer, never inside the library component.

## Integration gotchas
- `[CODE]` `falcon-confirm-dialog.tsx:109` — the Stencil component listens to `onFalcon-close` (lowercase, dash-separated) from the composed `<falcon-dialog>`. `[CODE]` `API.md:73` — this is the Stencil-correct cross-component bubbled-event syntax; binding `onFalconClose` silently no-ops.
- `[CODE]` `falcon-confirm-dialog.tsx:29` — the Stencil prop is `heading`; the Angular wrapper **renames it to `title`** `[CODE]` `API.md:74` for parity with `<falcon-angular-dialog>`. Binding `[heading]` on the Angular tag does nothing.
- `[CODE]` `API.md:75` — Stencil events are `falcon-confirm-accept` / `falcon-confirm-reject` / `falcon-confirm-open-change`; the Angular wrapper re-exposes them as `accept` / `reject` / `openChange`. Different naming across the two layers — bind the wrapper names in Angular code.
- `[CODE]` `falcon-confirm-dialog.tsx:124-139` — the accept/reject buttons are raw `<button class="falcon-confirm-btn">`, **NOT** `<falcon-button-tw>` `[CODE]` `GAPS_AND_UPGRADES.md:5-18` (P1 structural gap). Consequence: no built-in loading/disabled state; an async-accept flow must manage its own progress UI.
- `[CODE]` `API.md:72` — backdrop / Esc / close-X **all fire `reject`**, not a distinct `cancel` / `close`. Treat `(reject)` as the universal cancel handler; do not also bind the inner dialog's `(falconClose)` separately.
- `[CODE]` `icon` is a CSS class string rendered via `<i class={...}>` `[CODE]` `falcon-confirm-dialog.tsx:113-115` — passing an `<svg>` does not work; pass `"falcon-icon falcon-icon-X"`.

## Verification
🟡 CODE-DERIVED from `falcon-confirm-dialog.tsx` + the 6 UI dossier files. Self-close + reject-on-all-dismissal contract ✅ VERIFIED in source (`:85-95`). No dedicated confirm service — `[INFERRED]` from absence in read sources; a full pass should grep `apps/` for any `ConfirmService`.
