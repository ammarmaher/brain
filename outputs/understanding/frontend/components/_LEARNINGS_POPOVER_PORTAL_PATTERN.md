# Popover-Portal Pattern — Learnings & Traps

> **Scope:** every Falcon component that uses `portalToOverlay` from `libs/falcon-ui-core/src/utils/popover-portal.ts`. Currently: `<falcon-date-picker-tw>`, `<falcon-dropdown-tw>`, `<falcon-multi-select-tw>`, `<falcon-phone-field-tw>`. Read BEFORE building any new component that opens a panel/calendar/menu portaled to body.

> **Origin:** session 2026-05-17. A user-reported "calendar opens at bottom-right of viewport" bug in `apps-services-tab` shadow rows. Five distinct root causes were identified across multiple investigation rounds (Phases 1-3 landed; Phases 4-5 parked).

---

## The five root causes (in order of severity)

### RC #1 — Stencil vdom orphan from missing `key`

**Symptom:** popover opens correctly on first render; on any subsequent re-render of the host component, popover appears in a DIFFERENT location (typically bottom-right of viewport in transformed-ancestor contexts).

**Mechanism:**
1. The popover JSX has NO `key` attribute: `{this.isOpen && (<div ref={(el) => (this.popoverEl = el)} ...>...</div>)}`.
2. Stencil's vdom diff uses **positional identity** when no key is present. It expects the popover `<div>` at position N inside the parent wrap.
3. On first open: ref fires → `this.popoverEl = element`. `componentDidRender` runs → `portalToOverlay(popoverEl)` MOVES the element into `.falcon-overlay-container` (a child of `<body>`).
4. On the NEXT render of the same Stencil component (state tick, prop sync, ancestor cascade): JSX evaluates again. Stencil looks for the popover at position N inside the wrap. **It's not there** (we moved it). Stencil **creates a NEW element** at position N.
5. The OLD element STAYS in `.falcon-overlay-container`, never cleaned up by Stencil's vdom. It is now an **orphan**.
6. `this.popoverEl` now points to the NEW (in-wrap) element. `positionPopoverFixed(anchor, popoverEl)` writes inline styles on the in-wrap element.

**Why this produces "bottom-right of viewport":** see RC #2.

**Fix landed (Phase 2):** `ensurePortaled(popover, instanceId)` in `popover-portal.ts`. Idempotent — checks `popover.parentNode === overlayContainer`; if not, cleans up orphan with same `data-falcon-popover-instance` attribute and portals the fresh element. Called every `componentDidRender` and every `handleReposition` rAF. Plus `removeFromOverlay(instanceId)` for explicit cleanup on close.

**Rule for new components:** if you use `portalToOverlay`, you MUST use `ensurePortaled` instead. Never call `portalToOverlay` directly unless you guarantee the element will never be re-created by your component's vdom.

---

### RC #2 — `position: fixed` inside a transformed ancestor resolves against the ancestor, not viewport

**Symptom:** popover gets correct inline `top`/`left` writes but lands far from where intended.

**Mechanism:**
- CSS spec: when an ancestor has `transform`, `filter`, `perspective`, `backdrop-filter`, or `will-change: transform`, **`position: fixed` descendants resolve their coordinates relative to that ancestor**, not the viewport. The ancestor becomes a "containing block" for fixed descendants.
- The shadow-row directive `*falconDataTableShadowCol` at [falcon-data-table-cell.directive.ts:128](Falcon/falcon-web-platform-ui/libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table-cell.directive.ts:128) sets `transform: translateY(-50%)` on its rootNode.
- A popover element that gets STUCK inside this transformed ancestor (because of RC #1 — Stencil created a new element in the wrap, didn't get portaled out) inherits this containing-block override.
- Inline `position: fixed !important; top: <rect.bottom>px; left: <rect.left>px` resolves to "offset Xpx from the transformed ancestor's top-left", NOT viewport top-left. Result: popover lands somewhere unpredictable, often far off in bottom-right.

**Why this only shows in shadow rows:** the transform is applied by the `*falconDataTableShadowCol` directive — unique to that context.

**Fix landed:** RC #1's `ensurePortaled` keeps the popover OUT of the transformed ancestor by reliably keeping it in `.falcon-overlay-container` (which has no transform).

**Rule:** every popover positioned with `position: fixed` MUST live in the overlay container, not under any Falcon component that uses transform/filter/perspective. If you're building a new portal mechanism, verify the destination container has none of these CSS properties.

---

### RC #3 — Brief paint at default utility position (the "flicker")

**Symptom:** popover briefly flashes at a wrong location, then jumps to the correct location.

**Mechanism:**
- Stencil's `componentDidRender` is supposed to run synchronously after the vdom commit. The browser is NOT supposed to paint between them.
- In practice, the browser CAN paint in tight windows: heavy main-thread load, DevTools open, simultaneous animations, lower-end devices.
- If a paint slips in between (a) JSX commit creating the popover in the wrap with default classes `absolute top-full start-0` and (b) `componentDidRender` calling `portalToOverlay` + `positionPopoverFixed`, the user sees a single frame of the popover at the in-wrap location.

**Fix landed (Phase 3):** `portalToOverlay` writes `visibility: hidden !important` at portal time. `positionPopoverFixed` writes `visibility: visible !important` in its success branch atomically with the coordinate writes. `restoreFromOverlay` clears the inline visibility. The `!rectUsable` park branch deliberately leaves visibility hidden so off-screen popovers stay invisible during the rAF retry window.

**Rule:** any portal helper that writes inline position MUST also gate visibility so the element cannot be seen at intermediate positions.

---

### RC #4 — Focus-vs-click race (input-trigger popovers only)

**Symptom:** first click on a date-picker input doesn't open the calendar; second click does.

**Mechanism:**
- Date picker input had BOTH `onClick={handleInputClick}` (toggle) AND `onFocus={handleInputFocus}` (open) handlers.
- Native browser event order on click: **mousedown → focus → mouseup → click**.
- First click sequence: mousedown → focus event fires → `handleInputFocus` → `openInternal` → `isOpen=true`. Then click event → `handleInputClick` sees `isOpen=true` → `closeInternal` → `isOpen=false`. Stencil batches both state changes into a single render with final `isOpen=false`. **Popover never appears.**
- Second click: input is already focused → no new focus event → only click handler runs → toggles `isOpen=false → true` → opens.
- Dropdown, multi-select, phone-field were never affected — their focus handlers only set `this.focused = true` (style state), they don't call openInternal.

**Fix landed (Phase 3):** removed the `openInternal('input')` call from `handleInputFocus` in `falcon-date-picker-tw.tsx`. Click handler still toggles open/close. Tab-focus alone no longer auto-opens (matches dropdown/multi-select/phone-field, matches most date-picker libraries).

**Trade-off (intentional):** keyboard users who Tab to the input must now click or (future enhancement) press Enter/Space/ArrowDown. Currently no keyboard-open handler — flagged for future accessibility pass.

**Rule for new input-trigger popovers:** never put `openInternal` in the focus handler if the click handler also opens via toggle. The two will race on every first click. Either:
- Open only on click (current pattern)
- Open on focus + click handler doesn't toggle (only closes via outside-click)
- Open on focus + click handler only fires open (not toggle) — but then how does user close? Outside-click only.

The simplest is **open on click only**. Focus is for styling/state tracking.

---

### RC #5 — `host.replaceChildren` cascade on every emit

**Symptom:** popover anchor rect briefly reads as zero during click → popover-portal stability rAF fires → may produce a flash or wrong-position result.

**Mechanism:**
- Stencil `<falcon-table-tw>` emits `falconShadowCellsMounted` on EVERY `componentDidRender` (gated only on `hasShadowRows`).
- The Angular wrapper's `onShadowCellsMounted` handler calls `mountOrReuseShadowView(...)` which calls `host.replaceChildren(...view.rootNodes)` even when nothing changed.
- `replaceChildren` briefly detaches and re-attaches the projected DOM. If a popover opens during this detach window, `inputWrapEl.getBoundingClientRect()` reads `{0,0,0,0}`.

**Defensive fix landed (Phase 1):** `STABILITY_MAX_RETRIES = 8` (was 2) in `popover-portal.ts`. The rAF stability check now survives a multi-frame storm and re-positions when the rect settles. Zero-rect during stability re-check no longer silently returns — re-schedules with bounded `retryDepth`.

**True fix (parked for Phase 4):** diff-guard `host.replaceChildren` to skip when current children are already the view's rootNodes. Also gate `falconShadowCellsMounted` emission by hashing the mount set (skip emit when unchanged). Would eliminate the storm at the source.

**Rule:** any Angular wrapper that bridges Stencil events to embedded views should diff-check before destructive DOM operations. Don't `replaceChildren` if nothing changed.

---

## The 4 popover components — uniform contract

All four components MUST follow this contract:

```ts
// 1. State + refs
private panelEl?: HTMLDivElement;     // or popoverEl for date-picker
private anchorEl?: HTMLDivElement;    // or inputWrapEl for date-picker
private portalState: PortalAnchorState | null = null;
private repositionScheduled = false;
private listenersBound = false;       // Phase 2 — tracks listener registration

// 2. Reposition handler (idempotent, scheduled to rAF)
private readonly handleReposition = (): void => {
  if (!this.<open> || !this.<panel> || !this.<anchor>) return;
  if (this.appendTo !== 'body') return;
  if (this.repositionScheduled) return;
  this.repositionScheduled = true;
  requestAnimationFrame(() => {
    this.repositionScheduled = false;
    if (this.<open> && this.<panel> && this.<anchor>) {
      const fresh = ensurePortaled(this.<panel>, this.resolvedId);  // Phase 2
      if (fresh) this.portalState = fresh;
      positionPopoverFixed(this.<anchor>, this.<panel>);            // Phase 3: writes visibility:visible
    }
  });
};

// 3. componentDidRender (or syncPortal)
componentDidRender(): void {
  if (this.appendTo !== 'body') { /* inline mode: restore if needed */ return; }
  if (this.<open> && this.<panel> && this.<anchor>) {
    const fresh = ensurePortaled(this.<panel>, this.resolvedId);    // Phase 2
    if (fresh) {
      this.portalState = fresh;
      if (!this.listenersBound) {
        window.addEventListener('scroll', this.handleReposition, true);
        window.addEventListener('resize', this.handleReposition);
        this.listenersBound = true;
      }
    }
    positionPopoverFixed(this.<anchor>, this.<panel>);
  } else if (!this.<open>) {
    removeFromOverlay(this.resolvedId);                             // Phase 2
    this.portalState = null;
    if (this.listenersBound) {
      window.removeEventListener('scroll', this.handleReposition, true);
      window.removeEventListener('resize', this.handleReposition);
      this.listenersBound = false;
    }
  }
}

// 4. disconnectedCallback
disconnectedCallback(): void {
  removeFromOverlay(this.resolvedId);
  this.portalState = null;
  if (this.listenersBound) {
    window.removeEventListener('scroll', this.handleReposition, true);
    window.removeEventListener('resize', this.handleReposition);
    this.listenersBound = false;
  }
}
```

---

## Diagnostic workflow when a popover misbehaves

### Step 1 — turn on the debug flag

```javascript
window.__FALCON_DEBUG_POPOVER__ = true;
```

Then open the popover. Console emits a `[falcon-popover-portal]` log per open + per stability re-check, containing:
- `anchorTag` — the trigger element
- `rect: { x, y, w, h, l, r, t, b }` — the anchor's `getBoundingClientRect()` in viewport coords
- `anchorPos` — computed `position` on the anchor
- `anchorDir` — computed `direction` (drives RTL physical-write branch)
- `anchorConnected` — false means the anchor was detached mid-frame (RC #5)
- `chain` — ancestor walk up to 12 levels, each with position + transform-presence + left

### Step 2 — read the chain

Healthy chain (under-anchor placement working):
```
div pos=relative tr=- l=935.0
div[shadow-col=priceValue] pos=absolute tr=Y l=935.0   ← transform exists but popover should NOT inherit
form pos=relative tr=- l=787.0
...
```

Look for `tr=Y` (transform present) on any ancestor. The popover MUST be portaled out of that subtree to render correctly.

Broken chain (anchor read zero rect):
```
div pos=relative tr=- l=0.0       ← inputWrapEl rect.left = 0
```
→ RC #5 (replaceChildren detach) or RC #1 (Stencil orphan rendering wrap from earlier render position).

Broken chain (anchor measured fine but popover lands wrong):
```
div pos=relative tr=- l=935.0  rect: { l: 935, t: 263 }   ← measured correctly
```
But popover ends up at `(viewportW - X, viewportH - Y)` → RC #1 + RC #2 (orphan in transformed ancestor) OR RC #3 (paint before portal).

### Step 3 — inspect the overlay container in DevTools

```javascript
document.querySelectorAll('.falcon-overlay-container > *').length    // count of portaled popovers
document.querySelectorAll('[data-falcon-portaled="true"]').length    // all portaled markers
document.querySelectorAll('[data-falcon-popover-instance]').length   // Phase 2 instance markers
```

If you see MORE portaled elements than open popovers → orphans exist (Phase 2 should prevent this, but verify).

### Step 4 — inspect the popover's computed position

```javascript
const popover = document.querySelector('[data-falcon-portaled="true"]');
const cs = getComputedStyle(popover);
console.log({
  position: cs.position,           // expect 'fixed'
  top: cs.top, left: cs.left,
  right: cs.right, bottom: cs.bottom,
  insetStart: cs.insetInlineStart, // expect 'auto' (Phase 1 RTL fix)
  insetEnd: cs.insetInlineEnd,     // expect 'auto'
  transform: cs.transform,         // expect 'none'
  visibility: cs.visibility,       // Phase 3: 'visible' when positioned
  zIndex: cs.zIndex,
  inlineStyle: popover.getAttribute('style')
});
```

---

## Files modified during the 2026-05-17 fix waves

| File | Phases | Change |
|---|---|---|
| `libs/falcon-ui-core/src/utils/popover-portal.ts` | P1, P2, P3 | STABILITY_MAX_RETRIES 2→8, ensurePortaled + removeFromOverlay helpers, visibility:hidden/visible atomic |
| `libs/falcon-ui-core/src/components/falcon-date-picker-tw/falcon-date-picker-tw.tsx` | P2, P3 | ensurePortaled wiring + listenersBound, handleInputFocus no longer opens |
| `libs/falcon-ui-core/src/components/falcon-dropdown-tw/falcon-dropdown-tw.tsx` | P2 | ensurePortaled wiring + listenersBound |
| `libs/falcon-ui-core/src/components/falcon-multi-select-tw/falcon-multi-select-tw.tsx` | P2 | ensurePortaled wiring + listenersBound (in syncPortal helper) |
| `libs/falcon-ui-core/src/components/falcon-phone-field-tw/falcon-phone-field-tw.tsx` | P2 | ensurePortaled wiring + listenersBound |

## Phases still parked (not landed)

| Phase | Fix | Reason |
|---|---|---|
| P4 | Diff-guard `host.replaceChildren` + emit-gate hash on `falconShadowCellsMounted` | Higher risk, needs demo scenario 5 to verify |
| P5 | Restore `--falcon-data-table-shadow-row-min-height` from 5px back to 56px | Visual regression on every shadow row consumer |
| GR-1 | Add shadow-rows-demo scenario 5 using `*falconDataTableShadowCol` | Demo asset to gate future regressions |
| GR-2 | Token-floor lint rule for shadow-row min-h | CI guard |

Future enhancement (separate from this bug):
- Add `handleInputKeydown` cases for Enter / Space / ArrowDown to open the date-picker via keyboard (the focus-open removal in Phase 3 left a keyboard-accessibility gap).

---

## Pattern — when adding any new portaled popover

1. **Always import from popover-portal.ts:** `ensurePortaled`, `positionPopoverFixed`, `removeFromOverlay`, `restoreFromOverlay`, `type PortalAnchorState`.
2. **Never call `portalToOverlay` directly.** Use `ensurePortaled(panel, this.resolvedId)`. It handles the Stencil orphan case AND first-portal case.
3. **Always pair open path with close cleanup.** `removeFromOverlay(this.resolvedId)` in the close branch and in `disconnectedCallback`.
4. **Decouple listener registration from portalState.** Use a separate `listenersBound` boolean. Phase 2 found that `portalState` can be re-created on orphan recovery, but scroll/resize listeners should only register once per open cycle.
5. **Verify the popover JSX renders into a wrap that won't be transformed.** If any ancestor uses `transform / filter / perspective / will-change`, the popover MUST be portaled (default `appendTo='body'`).
6. **Test with `*falconDataTableShadowCol`.** This is the most aggressive consumer pattern in the codebase (absolute positioning + transform). If your popover works inside a shadow row, it works everywhere.
7. **Never put `openInternal` in a focus handler if the click handler toggles.** Pick one source-of-open.
8. **Document the popover element's role** — `role="dialog"` for date-pickers, `role="listbox"` for dropdowns, etc. Accessibility check.

---

## See also

- [popover-portal.ts](../../../../Falcon/falcon-web-platform-ui/libs/falcon-ui-core/src/utils/popover-portal.ts) — source of truth
- [falcon-date-picker/GAPS_AND_UPGRADES.md](falcon-date-picker/GAPS_AND_UPGRADES.md) — debug flag instructions
- [MEMORY] `project_falcon_shadow_row_popover_5_root_causes_2026_05_17.md` — full session log
- [MEMORY] `project_zindex_calendar_portal_root_cause_fix.md` — earlier passes (1-3) on z-index ladder, RTL physical/logical separation, var-publish ordering
- [MEMORY] `project_falcon_ui_core_layout_traps.md` — sibling traps in falcon-ui-core
