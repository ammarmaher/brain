# falcon-drawer — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md` etc. Business → `BUSINESS.md`.

## Owning backend module(s)
**None.** `[CODE]` `falcon-drawer.tsx` — no HTTP calls, no service injection, no DTO binding. It is a pure presentational overlay. Backend coupling belongs to the form/list projected into the body — e.g. an Add Node form inside the drawer talks to **Commerce** (node hierarchy), but that wiring lives in the consuming feature component, not the drawer.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | Drawer is presentational. The slotted body carries the flow's own wiring (e.g. node create/update → Commerce via System/Core Gateway). |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| — | — | — | The drawer declares no validation. Form validation lives in the projected body (e.g. node-name required, uniqueness). |

The drawer's only "validation-like" behavior is dismissal gating: `[CODE]` `falcon-drawer.tsx:105-123` — `dismissable` gates whether Esc and backdrop click fire a hide. This is interaction gating, not data validation.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| — | — | The drawer has no PES key. It inherits the gate of the flow that opens it — if the "Add Node" action is PES-denied the parent simply never sets `[open]="true"`. |

## State / signal pattern
- `[CODE]` `falcon-drawer.component.ts` (per `[BRAIN-OUT]` `API.md:71-72`) — the Angular wrapper uses **classic `@Input()` decorators**, not signal inputs.
- `[BRAIN-OUT]` `API.md:34-37` Outputs: `drawerShow`, `drawerHide` (carries a `reason`), and `openChange` (two-way `[(open)]` sugar — always emits `false` on hide).
- `[CODE]` `falcon-drawer.tsx:36,64-68` Inside Stencil, `open` is `@Prop({ mutable: true, reflect: true })` with an `@Watch` running `afterOpenSideEffects` (focus capture) / `afterCloseSideEffects` (focus restore) on transition.
- `[BRAIN-OUT]` `USAGE.md:91-101` Consumer pattern: a parent `signal` drives `[open]`; the form inside uses its own `FormGroup` / signals; on save the API call resolves and the parent flips the signal to `false`.

## Skeleton ↔ app-wrapper layering
Two layers, both inside the library — there is **no app-level wrapper** for this primitive:
1. **Stencil skeleton** — `[CODE]` `falcon-drawer.tsx` `<falcon-drawer>` (Shadow DOM, `shadow: true`) and the Light-DOM twin `<falcon-drawer-tw>`. Pure presentational; owns the focus trap (`[CODE]` `falcon-drawer.tsx:125-149`), overlay, slide transition.
2. **Angular wrapper** — `<falcon-angular-drawer>` (`[CODE]` `falcon-drawer.component.ts`). Bridges `@Input`/`@Output`, registers the Stencil tag on demand, re-emits CustomEvents.

Per `feedback_library_skeleton_app_api`: service injection and data fetching belong to the **consuming feature component** (e.g. `falcon-org-node-drawer`), never inside this library primitive. A feature component composes `<falcon-angular-drawer>` as its shell and owns the form + API service.

### Overlay / z-index tier ladder
`[CODE]` `drawer.tokens.css` exposes `--falcon-drawer-z`; `[BRAIN-OUT]` `TOKENS.md:82`. The Falcon overlay tier ordering, low → high:
- `falcon-tooltip` (`--falcon-tooltip-z`) — transient hint.
- **`falcon-drawer` (`--falcon-drawer-z`)** — edge-anchored sheet; sits below the centered-modal tier.
- `falcon-dialog` (`--falcon-dialog-z`) — centered modal.
- `falcon-insufficient-balance-dialog` (`--falcon-ib-dialog-backdrop-z: 1000`) / `falcon-sending-credentials-dialog` (`z = 1200`) — domain dialogs at the modal tier.
- `[CODE]` `falcon-drawer.tsx:41,177` `modal=false` renders the overlay with `data-modal="false"` — a transparent, click-through backdrop. The panel still sits at the drawer z-tier.
- `[INFERRED]` `[BRAIN-OUT]` `USAGE.md:136` Nesting drawers (drawer inside drawer) breaks the focus-trap layering — each runs its own `document` keydown listener.

## Integration gotchas
- `[CODE]` `falcon-drawer.tsx:112` The Esc/Tab handler is `@Listen('keydown', { target: 'document' })` — a **global** listener active whenever the drawer is open.
- `[CODE]` `falcon-drawer.tsx:169` `render()` returns `null` when closed — body DOM and any signal state inside it are destroyed on close. Lift state to the parent.
- `[CODE]` `falcon-drawer.tsx:105-109` `modal=false` shows no backdrop **and** does not dismiss on outside click — there is no "show backdrop but click-through" mode (`[BRAIN-OUT]` `GAPS_AND_UPGRADES.md:58`).
- `[CODE]` `falcon-drawer.tsx:44` `closeAriaLabel` exists on the Stencil source (default `'Close'`) but the Angular wrapper does **not** expose it — the × button label cannot be translated.
- `[CODE]` `falcon-drawer.tsx:151-156` `collectFocusable()` runs a DOM query on **every Tab press** — O(N) over the panel subtree; non-trivial for very large forms (`[BRAIN-OUT]` `GAPS_AND_UPGRADES.md:75`).
- `[CODE]` `falcon-drawer.tsx:99-103,169` There is **no exit transition** — on close the panel is removed from the DOM immediately. Opens slide; closes pop.

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-drawer.tsx` + `drawer.tokens.css` references + `[BRAIN-OUT]` existing dossiers. No backend module, no `V-*` rules, no PES key — confirmed presentational. ⚠ Live consumer count is 0 per Wave 7 sweep (`GAPS_AND_UPGRADES.md`) despite `OVERVIEW.md` citing org-hierarchy node drawers — adoption unconfirmed.
