# falcon-dialog — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md` etc. Business → `BUSINESS.md`.

## Owning backend module(s)
**None.** `[CODE]` `falcon-dialog.tsx` / `falcon-dialog.component.ts` — the component performs no HTTP calls, holds no service injection, binds no DTO. It is a pure presentational overlay. Any backend coupling belongs to the *content* a consumer projects into the slots (e.g. the contact-groups Share dialog body talks to Commerce/Identity for the share action — that wiring lives in `share-dialog.component.ts`, not the dialog).

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | Dialog is presentational. The slotted body/footer carry whatever wiring the consuming flow needs. |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| — | — | — | The dialog declares no validation. Form validation lives in the projected body content. |

The dialog's only "validation-like" behavior is dismissal gating: `[CODE]` `falcon-dialog.tsx:122-140` — `dismissible` + `closeOnBackdrop` + `closeOnEsc` together gate whether a close path fires. This is interaction gating, not data validation.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| — | — | The dialog has no PES key. It inherits the gate of whatever flow opens it — if the parent step is PES-denied it never sets `[open]="true"` / never calls `show()`. |

## State / signal pattern
- `[CODE]` `falcon-dialog.component.ts:54-64` The Angular wrapper uses **classic `@Input()` decorators** PLUS a mirrored `openSignal = signal<boolean>(false)`. The `open` setter writes both the `@Input` field AND the signal; the native `<dialog>`'s `[falconOpen]="openSignal()"` reads the signal (ts:64).
- `[CODE]` `falcon-dialog.component.ts:95-100` `handleClose()` writes `this.open = false` + emits `openChange.emit(false)` (two-way `[(open)]` sugar) + re-emits the Stencil `falcon-close` detail.
- `[CODE]` `falcon-dialog.tsx:41,79-83` Inside Stencil, `open` is `@Prop({ mutable: true, reflect: true })` with an `@Watch` running `afterOpenSideEffects` (focus capture) / `afterCloseSideEffects` (focus restore) on transition.
- `[INFERRED]` No error-pipeline interaction — a dialog showing a server error must receive that error as already-resolved text in its projected body (`errorMessage` prop is dead — see `BUSINESS.md`). The contact-groups dialog renders `errorMessage()` in its own body banner.

## Skeleton ↔ app-wrapper layering
**Three layers now** (the native `<dialog>` shell is new since the prior dossier):
1. **Native `<dialog falconOverlay="modal">` shell** — `[CODE]` `falcon-dialog.component.html:11-17`. The `[falconOverlay]` directive (`[CODE]` `falcon-overlay.directive.ts`) drives `showModal()`/`close()` and registers with `FalconStackingService`. The native `::backdrop` supplies dim+blur (`[CODE]` `falcon-dialog.component.css:56-61`).
2. **Stencil skeleton** — `[CODE]` `falcon-dialog.tsx` `<falcon-dialog>` (Shadow, `shadow:true`) / `<falcon-dialog-tw>` (Light DOM, `shadow:false`). Pure presentational; owns the hand-rolled focus trap, the inner backdrop (now visually neutralised), the slots.
3. **Angular wrapper** — `[CODE]` `falcon-dialog.component.ts` `<falcon-angular-dialog>`. Bridges `@Input`/`@Output`, registers the Stencil tag via `defineFalconTwComponent('falcon-dialog')` in `ngOnInit`, re-emits CustomEvents.

Per `feedback_library_skeleton_app_api`: any service injection / data fetching belongs to the **consuming feature component**, never inside this library primitive.

### Top Layer + overlay stacking (corrected 2026-06-03 — supersedes the prior z-index ladder)
`[CODE]` `falcon-overlay.directive.ts` + `falcon-stacking.service.ts` — the 8-wave Top Layer migration (Phase A–D, 2026-05-21) made the **browser's Top Layer** the authoritative stacking mechanism for every Falcon overlay:
- `falcon-dialog` (`falconOverlay="modal"`) and `falcon-drawer` (`falconOverlay="drawer"`) call `showModal()` → both enter the Top Layer (above the whole z-index world). `falcon-popup` does the same.
- **Stacking is DOM order** in the Top Layer — the last-promoted element is topmost. No per-overlay z-index counters.
- `[CODE]` `FalconStackingService` tracks every open overlay by kind (`modal`/`drawer`/`popover`/`toast`) and on every modal/drawer register schedules a **toast reassert** (hide+show the popover) on the next animation frame so notification toasts always re-enter the Top Layer **above** the modal (priority-1: alerts must stay readable through any modal stack — `[CODE]` falcon-stacking.service.ts:73-91,114-133).
- `[CODE]` The legacy `--falcon-dialog-z-index: 99999` token (`dialog.tokens.css:178`) is **fallback-only** post-migration — read solely by the un-migrated Stencil shadow-DOM cores + the `.falcon-overlay-container` body-portal path (popovers/calendars opened from inside a dialog, which sit at `--falcon-overlay-z-index: 100000`, `[CODE]` overlay.tokens.css:79). Notification toasts at 100001.
- `[INFERRED]` Two open dialogs each run their own hand-rolled `document` keydown listener (`[CODE]` falcon-dialog.tsx:129) — Esc resolves ambiguously even though the Top Layer stacks them correctly. `[BRAIN-OUT]` USAGE.md warns against rendering multiple dialogs simultaneously.

## Integration gotchas
- `[CODE]` `falcon-dialog.tsx:129` The Esc/Tab handler is `@Listen('keydown', { target: 'document' })` — a **global** listener active whenever the dialog is open. Two open dialogs collide on Esc (the Top-Layer stacking does not fix the hand-rolled handler).
- `[CODE]` `falcon-dialog.tsx:186` `render()` returns `null` when closed — the body DOM (and any signal state inside it) is destroyed on close and rebuilt on next open. Hoist state to the parent.
- `[CODE]` `falcon-dialog.component.ts:102-110` `falconConfirm`/`falconCancel` are wired through the wrapper but **no built-in button emits them** — subscribing without an emitter is dead code (GAP G-CONFIRM).
- `[CODE]` `falcon-dialog.tsx:54` `closeAriaLabel` exists on the Stencil source (default `'Close'`) but the Angular wrapper does **not** expose it — the close × label is stuck English for i18n (GAP G-A11Y-LABEL).
- `[CODE]` `falcon-dialog.component.css:56` The native `::backdrop` dim/blur uses **literal** `rgba(13,63,68,0.45)` (a deliberate Top-Layer-cascade override that "wins" over the shared `@layer falcon-overlay` default) — a per-instance backdrop-color token override on the host will NOT change it (only the inner-backdrop tokens are, and those are neutralised).

## Verification
🟢 RE-VERIFIED 2026-06-03 (B14). Native `<dialog falconOverlay="modal">` three-layer architecture confirmed in falcon-dialog.component.{ts,html,css} + falcon-overlay.directive.ts + falcon-stacking.service.ts. Z-index ladder **rewritten** from the prior (pre-migration) version → Top Layer is now authoritative; the 99999 token is fallback-only (deprecation note quoted). No backend module, no `V-*`, no PES key — confirmed presentational.
