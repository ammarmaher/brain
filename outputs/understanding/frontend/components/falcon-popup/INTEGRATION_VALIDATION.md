# falcon-popup — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
**None — the component is presentational.** `[CODE]` `falcon-popup.component.ts` — the popup owns no data, makes no HTTP calls. The decision it gates belongs to the calling flow's module:
- **Identity** — OTP / auth `error` retry.
- **Commerce / Charging** — wizard `unsaved` discards; node deletes; wallet confirm-save.
- The popup itself is variant config + content composition only.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| (none called by the component) | — | — | — | — | `[CODE]` ts:408-414 emits `confirm` / `cancel`; the consuming component runs the API call. |
| `[INFERRED]` interceptor-caught HTTP failures | (any) | (any) | — | — | `[CODE]` `falcon-http-error-dialog.service.ts` — the global HTTP interceptor / error boundary calls `FalconHttpErrorDialogService.show({...})`, which opens an OK-only `error` popup via the host component. The popup is the *surface* of the failure, not the caller. |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| (none) | — | — | The popup has no form fields and runs no validators (`API.md` — CVA N/A). |

`[INFERRED]` Where the `unsaved` variant gates a dirty-form discard, the *dirty* state is computed by the owning wizard step's snapshot dirty-tracker (`formValue` vs `snapshot`, `[MEMORY]` `project_settings_tab_standalone_wave14`) — the popup only fires when that tracker reports dirty. Do not open `save` over an invalid form; the popup assumes the form is already valid.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (none own) | — | The popup inherits no PES key. `[INFERRED]` Where the action behind `confirm` is PES-gated (e.g. a node delete), the trigger that opens the popup is hidden/disabled by the owning component's PES resolution; the popup is never reached. |

## State / signal pattern
`[CODE]` `falcon-popup.component.ts` — the component is **fully signal-driven**: inputs `input<T>()` (ts:300-323), outputs `output<void>()` (ts:325-326), all derived display values `computed()` (ts:333-390). `OnPush` (ts:98).
`[CODE]` ts:330-335 — `FalconConfigurationService` is injected; `resolvedGlossy`/`resolvedIconBg`/`resolvedIconColor` enforce **instance input > app-override > JSON default** (`undefined` sentinel falls through to `cfg.popup.*`). Variant content (titles/icons/labels) always comes from `VARIANTS`, never the config service.

**Global service layer** `[CODE]` `falcon-http-error-dialog.service.ts` + host:
- `FalconHttpErrorDialogService` (`@Injectable({ providedIn: 'root' })`) — singleton signal store (`open`, `title`, `body`, `hint`, `okLabel`). `.show(payload)` sets them + `open=true`; `.close()` clears. One popup at a time (alert() semantics).
- `FalconAngularHttpErrorDialogHostComponent` (`<falcon-angular-http-error-dialog-host>`) — `[CODE]` `falcon-http-error-dialog-host.component.ts:33-46` — mounted ONCE in the app shell; binds the service signals to a `<falcon-angular-popup [hideCancel]="true">` OK-only `error` mode; both `(confirm)`/`(cancel)` call `dialog.close()`. Visual toggles bound `undefined` → inherit `FalconConfigurationService.popup.*` (host comment ts:8-12).
- `FalconUnsavedChangesHostComponent` (`<falcon-unsaved-changes-host>`) — `[CODE]` `falcon-unsaved-changes-host.component.ts:30-39` — mounted ONCE; renders `<falcon-angular-popup variant="unsaved">` when `FalconUnsavedChangesService.active()` is set; `(confirm)`→`accept()`, `(cancel)`→`reject()` (resolves the service's Observable).
- `[INFERRED]` `FalconHttpErrorDialogService` is documented as parallel to `ErrorDialogService` (which drives `<falcon-angular-alert-dialog>` with a multi-message list): popup = single-message OK-only; alert-dialog = multi-message list.
**Error pipeline:** `[MEMORY]` `project_commchannels_apps_tabs_wave17` — `falcon-http-ui.config.ts` routes 403/404/5xx/network → popup confirm; 400 → top-right toast; 422 → warning toast.

## Skeleton ↔ app-wrapper layering
- **No Stencil skeleton** — popup is **Angular-only** (`falcon-popup.component.ts`, inline template). It does NOT compose `<falcon-dialog>`; it re-implements the modal scaffolding itself.
- **Native `<dialog falconOverlay="modal">` shell** — `[CODE]` ts:101-112. The `[falconOverlay]` directive drives `showModal()`/`close()` + registers with `FalconStackingService`; the `::backdrop` supplies dim+blur; the inline `styles:` reset turns the full-viewport `<dialog>` into a flex-centring container for the inner `<article>` (ts:252-272).
- **Footer buttons** — `[CODE]` ts:194-209 — composes the Stencil Light-DOM `<falcon-button-tw>` directly; `ngOnInit` (ts:296-298) calls `defineFalconTwComponent('falcon-button')`. The button event is `(falcon-click)` (dash-separated).
- **App-level layer** — the two host components are themselves the canonical app-wrappers; feature consumers inject their own state slice + API service and bind `[open]`/`(confirm)`/`(cancel)`.

### Top Layer + overlay stacking
`[CODE]` `falcon-overlay.directive.ts` + `falcon-stacking.service.ts` — the popup (`falconOverlay="modal"`) calls `showModal()` → enters the browser Top Layer (above the z-index world). `FalconStackingService` registers it as a `modal` and reasserts any open toasts above it on the next frame (priority-1: alerts stay readable). No z-index token is involved at runtime — the inline `styles:` reset uses `inset:0` + flex centring, not z-index.

## Integration gotchas
- `[CODE]` ts:408-414 — the popup **does not self-close**. `confirm`/`cancel` only emit; the owning flow toggles `[open]`. Toggling `[open]=false` *before* async work completes makes the popup vanish and the user cannot retry on failure.
- `[CODE]` ts:343-345 — empty-string overrides fall back to the variant default. To render genuinely empty text, pass `' '` (single space). i18n pipes returning the key transiently rely on this — changing it breaks i18n loading.
- `[CODE]` ts:199/207 — the `(falcon-click)` event on `<falcon-button-tw>` is dash-separated (Stencil-correct); binding `(falconClick)` no-ops.
- `[CODE]` ts:101-112 — **focus**: `showModal()` confines focus + inerts the page (good). The popup has **no hand-rolled Tab-cycle** like dialog/drawer — it relies on the native modal (GAP G-FOCUS — downgraded from the prior "P0").
- `[CODE]` `TOKENS.md` — popup has **no token file**; all paint is hardcoded Tailwind utilities + inline `styles:` literals. Per-instance restyling is not possible without source changes — only `glossy`/`iconBg`/`iconColor` are knobs (GAP G-TOKENS).

## Verification
🟢 RE-VERIFIED 2026-06-03 (B14). Service layer (`FalconHttpErrorDialogService` + host) + the unsaved-changes host ✅ VERIFIED in source (line-anchored). Native `<dialog falconOverlay="modal">` Top Layer + the `FalconConfigurationService` sentinel chain confirmed. Focus reframed: native modal confinement (not "P0 escape"). Error-pipeline routing ✅ `[MEMORY]` Wave 17. Direct-consumer count refreshed to 5 app files / 9 + 2 lib hosts.
