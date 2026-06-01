# falcon-popup — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[INFERRED]`.

## Owning backend module(s)
**None — the component is presentational.** `[CODE]` `falcon-popup.component.ts:84-340` — the popup owns no data, makes no HTTP calls. The decision it gates belongs to the calling flow's module:
- **Identity** — OTP flow `error` retry (`USAGE.md:151` `otp-dialog`).
- **Commerce** — Add User / Add Client wizard `unsaved` discards; org-hierarchy node deletes; applications-table row actions.
- The popup itself is variant config + content composition only.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| (none called by the component) | — | — | — | — | `[CODE]` `falcon-popup.component.ts:255-256` emits `confirm` / `cancel`; the consuming component runs the API call. |
| `[INFERRED]` interceptor-caught HTTP failures | (any) | (any) | — | — | `[CODE]` `falcon-http-error-dialog.service.ts:1-8` — the global HTTP interceptor / error boundary calls `FalconHttpErrorDialogService.show({...})`, which opens an OK-only `error` popup; the popup is the *surface* of the failure, not the caller. |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| (none) | — | — | The popup has no form fields and runs no validators `[CODE]` `API.md:92` ("CVA support: Not applicable"). |

`[INFERRED]` Where the `unsaved` variant gates a dirty-form discard, the *dirty* state is computed by the owning wizard step's snapshot dirty-tracker (the `formValue` vs `snapshot` pattern, `[MEMORY]` `project_settings_tab_standalone_wave14`) — the popup only fires when that tracker reports dirty. `[CODE]` `USAGE.md:115` — do not open `save` over an invalid form; the popup assumes the form is already valid.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (none own) | — | The popup inherits no PES key. `[INFERRED]` Where the action behind `confirm` is PES-gated (e.g. a node delete), the trigger that opens the popup is hidden/disabled by the owning component's PES resolution; the popup is never reached. |

## State / signal pattern
`[CODE]` `falcon-popup.component.ts:6-16` — the component is **fully signal-driven**: inputs are `input<T>()` (`:230-253`), outputs are `output<void>()` (`:255-256`), and all derived display values are `computed()` (`:263-320`). Change detection is `OnPush` (`:88`).
`[CODE]` `falcon-popup.component.ts:259-265` — `FalconConfigurationService` is injected; `resolvedGlossy` / `resolvedIconBg` / `resolvedIconColor` computeds enforce the priority chain **instance input > app-override > JSON default** (Wave 19). Variant content (titles/icons/labels) always comes from the `VARIANTS` map, never the config service.
**Global service layer** `[CODE]` `falcon-http-error-dialog.service.ts`:
- `FalconHttpErrorDialogService` (`@Injectable({ providedIn: 'root' })`) — singleton signal store: `open`, `title`, `body`, `hint`, `okLabel` signals. `.show(payload)` sets them + `open=true`; `.close()` sets `open=false`. `[CODE]` `:32-34` — replaces any current payload (one popup at a time, native-`alert()` semantics).
- `FalconAngularHttpErrorDialogHostComponent` (`<falcon-angular-http-error-dialog-host>`) — `[CODE]` `falcon-http-error-dialog-host.component.ts:28-47` — mounted ONCE in the app shell; binds the service signals to a `<falcon-angular-popup>` in `[hideCancel]="true"` OK-only `error` mode. Both `(confirm)` and `(cancel)` call `dialog.close()`.
- `[CODE]` `falcon-http-error-dialog.service.ts:6-8` — explicitly documented as **parallel to `ErrorDialogService`**, which drives `<falcon-angular-alert-dialog>` with a multi-message list. Two services, two overlay components: popup = single-message OK-only; alert-dialog = multi-message list.
**Error pipeline:** `[MEMORY]` `project_commchannels_apps_tabs_wave17` — `falcon-http-ui.config.ts` routes 403/404/5xx/network → popup confirm; 400 → top-right toast; 422 → warning toast. The popup is the platform's confirm-popup surface in that pipeline.

## Skeleton ↔ app-wrapper layering
- **No Stencil skeleton** — `[CODE]` `API.md:6-7` — popup is an **Angular-only** component (`falcon-popup.component.ts`, inline template). `[CODE]` `OVERVIEW.md:10` — it does NOT compose `<falcon-dialog>`; it re-implements backdrop / ARIA / scale-in animation itself.
- **Footer buttons** — `[CODE]` `falcon-popup.component.ts:183-197` — composes the Stencil Light-DOM `<falcon-button-tw>` directly; `[CODE]` `:226-228` `ngOnInit` calls `defineFalconTwComponent('falcon-button')` to register the tag on demand.
- **App-level layer** — `[CODE]` `falcon-http-error-dialog-host.component.ts` is itself the canonical app-wrapper: it injects `FalconHttpErrorDialogService` and binds it to the popup. Feature consumers (wizards, menus, tables) inject their own state slice + API service and bind `[open]` / `(confirm)` / `(cancel)`.

## Integration gotchas
- `[CODE]` `falcon-popup.component.ts:322-339` — the popup **does not self-close**. `confirm` and `cancel` only emit; the owning flow must toggle `[open]`. `[CODE]` `USAGE.md:138` — toggling `[open]=false` *before* async work completes makes the popup vanish and the user cannot retry on failure.
- `[CODE]` `falcon-popup.component.ts:273-275` — empty-string overrides fall back to the variant default. `[CODE]` `USAGE.md:113` — to render genuinely empty text, pass `' '` (single space). i18n pipes returning the key transiently rely on this fallback — changing it breaks i18n loading (`DECISION.md:113`).
- `[CODE]` `falcon-popup.component.ts:184-196` — the `(falcon-click)` event on `<falcon-button-tw>` is dash-separated (Stencil-correct); binding `(falconClick)` no-ops.
- `[CODE]` `falcon-popup.component.ts:108` — no focus trap / no focus restore (P0 a11y gap, `GAPS_AND_UPGRADES.md:5-16`). The owning flow must manage focus if keyboard a11y matters.
- `[CODE]` `TOKENS.md:4` — popup has **no token file**; all paint is hardcoded Tailwind utilities. Per-instance restyling is not possible without source changes — only `glossy` / `iconBg` / `iconColor` are knobs (`API.md:73-74`).

## Verification
🟢 LANDED — service layer (`FalconHttpErrorDialogService` + host component) ✅ VERIFIED in source. 8-consumer adoption ✅ VERIFIED by Wave 7 sweep (`USAGE.md:141-153`). 🟡 CODE-DERIVED for the signal/computed pattern from `falcon-popup.component.ts`. Error-pipeline routing ✅ flagged in `[MEMORY]` `project_commchannels_apps_tabs_wave17`.
