# falcon-drawer — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md` etc. Business → `BUSINESS.md`.

## Owning backend module(s)
**None.** `[CODE]` `falcon-drawer.tsx` / `falcon-drawer.component.ts` — no HTTP calls, no service injection, no DTO binding. Pure presentational overlay. Backend coupling belongs to the form/list projected into the body (e.g. a Balance Transfer form talks to Charging/Commerce — that wiring lives in the consuming feature component, not the drawer).

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | Drawer is presentational. The slotted body carries the flow's own wiring. |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| — | — | — | The drawer declares no validation. Form validation lives in the projected body. |

The drawer's only "validation-like" behavior is dismissal gating: `[CODE]` `falcon-drawer.tsx:105-123` — `dismissable` gates whether Esc and backdrop click fire a hide.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| — | — | The drawer has no PES key. It inherits the gate of the flow that opens it — if "Add Node" / "Transfer" is PES-denied the parent never sets `[open]="true"`. |

## State / signal pattern
- `[CODE]` `falcon-drawer.component.ts:48-57` The Angular wrapper uses **classic `@Input()` decorators** PLUS a mirrored `openSignal` (read by the native `<dialog>`'s `[falconOpen]`).
- `[CODE]` `falcon-drawer.component.ts:81-86` `handleHide()` writes `this.open=false` + emits `openChange.emit(false)` (two-way `[(open)]` sugar) + re-emits the Stencil `falconDrawerHide` detail.
- `[CODE]` `falcon-drawer.tsx:36,64-68` Inside Stencil, `open` is `@Prop({ mutable: true, reflect: true })` with an `@Watch` running `afterOpenSideEffects` (focus capture) / `afterCloseSideEffects` (focus restore).

## Skeleton ↔ app-wrapper layering
**Three layers** (the native `<dialog>` shell is new since the prior dossier):
1. **Native `<dialog falconOverlay="drawer">` shell** — `[CODE]` `falcon-drawer.component.html:13-20`. The `[falconOverlay]` directive drives `showModal()`/`close()` + registers with `FalconStackingService`. The native `::backdrop` supplies dim+blur (`[CODE]` `falcon-drawer.component.css:59-64`); the slide animation stays intrinsic to the inner Stencil panel.
2. **Stencil skeleton** — `[CODE]` `falcon-drawer.tsx` `<falcon-drawer>` (Shadow) / `<falcon-drawer-tw>` (Light). Owns the hand-rolled focus trap, the inner overlay (now visually neutralised), the slide transition.
3. **Angular wrapper** — `<falcon-angular-drawer>` (`[CODE]` `falcon-drawer.component.ts`). Bridges `@Input`/`@Output`, registers the Stencil tag, re-emits CustomEvents.

Per `feedback_library_skeleton_app_api`: service injection / data fetching belong to the **consuming feature component** (e.g. `wb-balance-transfer-drawer`), never inside this library primitive.

### Top Layer + overlay stacking (corrected 2026-06-03 — supersedes the prior z-index ladder)
`[CODE]` `falcon-overlay.directive.ts` + `falcon-stacking.service.ts` — the 8-wave Top Layer migration (Phase A–D, 2026-05-21):
- `falcon-drawer` (`falconOverlay="drawer"`) and `falcon-dialog` (`falconOverlay="modal"`) both call `showModal()` → both enter the browser Top Layer (above the whole z-index world).
- **Stacking is DOM order** in the Top Layer; no per-overlay counters.
- `[CODE]` `FalconStackingService` tracks open overlays by kind and on every modal/drawer register schedules a toast reassert (next animation frame) so notification toasts stay above the drawer (priority-1).
- `[CODE]` The legacy `--falcon-drawer-z-index: 99999` token (`drawer.tokens.css:113`) is **fallback-only** post-migration — read only by the un-migrated Stencil cores + the `.falcon-overlay-container` body-portal path (dropdowns/calendars opened from inside a drawer sit at `--falcon-overlay-z-index: 100000`). Toasts at 100001.
- `[INFERRED]` Two open drawers each run their own hand-rolled `document` keydown listener (`[CODE]` falcon-drawer.tsx:112) — nesting breaks the focus-trap layering even though the Top Layer stacks them.

### THE ZONELESS-CD SLOT-WIPE DEFECT (G-ZONELESS-SLOT — integration-blocking)
`[CODE]` `wb-balance-transfer-drawer.component.ts:5-23` + `balance-transfer.component.html:4-10` — **the drawer's projected default-slot body is wiped under Angular zoneless change detection** (`provideZonelessChangeDetection()` per `[MEMORY]`): the opened drawer paints header + footer with an EMPTY body. Both wallet feature teams permanently route around it with a hand-rolled native `<aside role="dialog">` shell (WAIVER W11). **This is a library-level integration defect, not a consumer mistake** — any new feature that uses `<falcon-angular-drawer>` for a projected-body form under zoneless CD will hit the same empty-body bug. See `GAPS_AND_UPGRADES.md` G-ZONELESS-SLOT (🟠, HIGH-RISK-QUEUE).

## Integration gotchas
- `[CODE]` `falcon-drawer.tsx:112` The Esc/Tab handler is `@Listen('keydown', { target: 'document' })` — a **global** listener active whenever the drawer is open. Nesting collides.
- `[CODE]` `falcon-drawer.tsx:169` `render()` returns `null` when closed — body DOM + signal state destroyed on close. Lift state to the parent.
- `[CODE]` `falcon-drawer.tsx:105-109` `modal=false` shows no backdrop AND does not dismiss on outside click — there is no "show backdrop but click-through" mode (GAP G-BACKDROP-MODE).
- `[CODE]` `falcon-drawer.tsx:44` `closeAriaLabel` exists on the Stencil source (default `'Close'`) but the wrapper does NOT expose it — the × label cannot be translated (GAP G-A11Y-LABEL).
- `[CODE]` `falcon-drawer.tsx:151-156` `collectFocusable()` runs a DOM query on **every Tab press** — O(N) over the panel subtree; non-trivial for very large forms (GAP G-FOCUS-PERF).
- `[CODE]` `falcon-drawer.tsx:99-103,169` There is **no exit transition** — on close the panel is removed from the DOM immediately. Opens slide; closes pop.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B14). Native `<dialog falconOverlay="drawer">` three-layer architecture confirmed in falcon-drawer.component.{ts,html,css} + falcon-overlay.directive.ts. Z-index ladder **rewritten** → Top Layer is authoritative; 99999 token is fallback-only. **The zoneless-CD slot-wipe defect is the headline integration finding** (CODE-cited from the WAIVER comments). No backend module, no `V-*`, no PES key — confirmed presentational.
