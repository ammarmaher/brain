# falcon-resizable-split-pane — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)

**None.** `[CODE]` The split owns no data and calls no endpoint. It is layout infrastructure. The data shown in its slots (wallet org rows + value rows) is owned by the wallet feature:

- **Commerce / Charging / Identity** — the wallet allocation data (`tableRows()`) is hydrated by the wallet service via the 3-call wallet contract (`[MEMORY]` wallet backend integration — `GET …/hierarchy`, `POST wallet/transfer`, `POST commerce/setting/wallets`). The split just renders whatever rows the consumer puts in its slots.

## Backend wiring

| Endpoint | Method | Backend module | DTO | Gateway | Notes |
|---|---|---|---|---|---|
| (none — the split calls nothing) | — | — | — | — | `[CODE]` No `inject()` of any service, no HttpClient. It wires DOM events + element rects into the pure math helpers; no I/O. |

> `[CODE]` The split is **pure DOM/geometry**. Its only "external" side-effects are: a `window 'resize'` listener (re-clamp, ts:295-296), document-level `mousemove`/`mouseup`/`touchmove`/`touchend` listeners during a drag (ts:246-249, removed on stop), `requestAnimationFrame` for the scroll mirror (ts:192-199), and a 120ms `setTimeout` scroll-end settle (ts:197). All are properly torn down (see State/teardown).

## Validation rules (V-*)

| V-rule | Field | Trigger | Effect |
|---|---|---|---|
| Width clamp `[min, container − reserve]` | `leftWidth` | drag / arrow / window-resize | `[CODE]` math.ts:31-40 — desired width is clamped + rounded; out-of-range inputs are corrected, never rejected. |
| Predominantly-vertical wheel gate | (wheel forward) | wheel over left pane | `[CODE]` math.ts:86-95 — only vertical-dominant wheels forward to the right scroll; horizontal wheels are ignored (`null`). |

> `[CODE]` These are **geometric guards**, not business validators. There is no form, no value-validation, no error surface. The "validation" is clamping and wheel-direction gating, fully in the pure math core (unit-testable).

## PES keys gating this component

| PES key | Action | Effect when denied |
|---|---|---|
| (none) | — | — |

`[CODE]` The split has **no PES gate** — it is layout. Whatever PES gates the wallet data / transfer actions is enforced by the wallet feature inside the slots, not by the split. (E.g. the wallet's `canTransferRows()` toggles a host class on the split — `[class.wb-no-xfer]`, wb-allocation-table.component.html:12 — but the PES decision is the wallet's.)

## State / signal pattern

`[CODE]` falcon-resizable-split-pane.component.ts — **the richest signal+teardown pattern in the B25/B26 batch**:
- **Inputs are signals** (`leftDefaultWidth` etc. via `input()`); width is a two-way `model()` (`leftWidth`); outputs are `output()` (`resize`/`resetWidth`); internal `dragging = signal(false)`; derived `leftBasis`/`ariaNow` are `computed()`; element refs are `viewChild.required()`. OnPush (ts:67); zoneless-safe.
- **Imperative geometry deliberately bypasses CD** — the scroll mirror writes `c.style.transform` directly (ts:218) inside a rAF loop, and the drag writes `document.body.style` + `leftWidth.set()` per move (ts:227-235). This is the correct pattern for high-frequency pointer/scroll geometry (signals would thrash CD).
- **Teardown is explicit + complete:**
  - `DestroyRef.onDestroy(() => window.removeEventListener('resize', this.onWinResize))` (ts:296).
  - `ngOnDestroy()` cancels the scroll rAF + clears the scroll-end timer (ts:299-302).
  - The drag's document listeners are removed in the `stop` closure (ts:241-244) on mouseup/touchend.
  - This is **proper zoneless teardown** — no leaked listeners/rAF/timers.

## Skeleton ↔ app-wrapper layering

- **No Stencil skeleton layer** — single-render Angular component; the dual-render "skeleton ↔ wrapper" split is **N/A**.
- **The layering that exists:** the split is a **content-agnostic layout shell** (the inner shared component); the consumer (`wb-allocation-table`) is the outer layer that owns the data (`tableRows()`), projects the org card into `[slot=left-header]`/`[slot=left]` and the values card into `[slot=right]`, and reacts to `(resize)`/`(resetWidth)`. Per `feedback_library_skeleton_app_api`, the shared shell never fetches — the consumer's state slice does.
- **Math core as a separable layer:** the pure `falcon-resizable-split-pane.math.ts` is a distinct, DOM-less layer the component wires into — and which it re-exports so consumers/tests can use the same formulas (index.ts:7-16). This is a deliberate testability seam (the component itself can't instantiate under node-vitest because of DOM, so the *math* is the unit-tested surface — math.ts:1-5).

## Integration gotchas

- `[CODE]` **All scroll content must go in `[slot=right]`** — the left pane's scrollbar is hidden and it mirrors via transform (ts:82-89, 215-219). Putting scrollable content in `[slot=left]` breaks the single-scroll model.
- `[CODE]` **`[(leftWidth)]` is two-way** — the drag/arrow write back to it (ts:234/265). Binding it one-way (`[leftWidth]`) and expecting the drag to also update your state will desync; use two-way or omit it (internal management).
- `[CODE]` **Window-resize re-clamps** — on a window shrink the max-left may shrink; the component re-clamps a concrete width but leaves a `null` (default) width alone (ts:277-291). Don't fight this with your own resize handler.
- `[CODE]` **Grip is CSS-centred** — no JS placement (html:61-64); the retained `gripCenterLeft()` is for tests/consumers only (math.ts:99-104). Do NOT reintroduce JS grip positioning (it caused the old `position:fixed` viewport-middle bug, html:8-9).
- `[CODE]` **`ViewEncapsulation.None`** — the inline `styles:` are global; consumers must not redefine the `.falcon-split-*` class names (ts:68-73, 82-126).
- `[CODE]` **i18n is the caller's job** — `resizerAriaLabel`/`resizerTitle` are rendered as-is; pass already-translated strings (the wallet passes `… | translate`, wb-allocation-table.component.html:13-14).
- `[CODE]` **RTL drag-direction not runtime-verified** — the drag math assumes the resized pane is geometric-left (math.ts:45-51); under RTL this may feel inverted (TOKENS RTL caveat / GAP).

## Verification
🟢 RE-VERIFIED 2026-06-03 (B26, NEW dossier) — the component is data-less (no `inject`/HTTP — confirmed against ts:1-307 + math.ts); clamping + wheel-gate are geometric guards in the pure math core (math.ts:31-95). Teardown completeness (DestroyRef + ngOnDestroy + drag-stop listener removal) 🟢 code-verified (ts:296/299-302/241-244). Wallet data ownership cross-referenced from `[MEMORY]` wallet integration. RTL drag caveat 🟡 code-derived (not runtime-verified).
