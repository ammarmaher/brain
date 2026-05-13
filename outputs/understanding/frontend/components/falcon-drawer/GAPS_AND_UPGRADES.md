# falcon-drawer — GAPS AND UPGRADES

## Missing capabilities

### P1 — Wrapper does not expose `closeAriaLabel` to consumers
The Stencil source has a `closeAriaLabel` prop with default `'Close'`. The Angular wrapper does not bridge it. For i18n, the × button label is stuck as "Close" — not translated.

**Priority: P1** — a11y / i18n.

### P1 — No `headerActions` slot
Today the only header content is the `slot="header"` (or `header` text prop) + an automatic close × button. Consumers wanting an action button INSIDE the drawer header (e.g. "Reset" button next to the title) project everything via `slot="header"` and manually lay it out — but they fight the close × button positioning.

**Proposed:** `<slot name="header-actions">` rendered to the left of the close button.

**Priority: P1**

### P1 — No `[(open)]` true two-way macro shortcut
The wrapper emits `openChange` for sugar, but the Stencil source's `open` Prop is `mutable: true` — meaning a deeper consumer could write back to it. The Angular wrapper doesn't propagate two-way to Angular's `[(open)]` cleanly because `[open]` is a one-way Input. Consumers must use `(openChange)` separately. Adding the `@Output() openChange` is already done — just clarify in docs.

**Priority: P1** (docs).

### P2 — `dismissable` spelling vs `dismissible` on dialog
The drawer uses `dismissable`, the dialog uses `dismissible`. Cross-component consistency would prevent confusion.

**Priority: P2** — rename one (additive deprecation).

### P2 — No `preventClose` predicate
Common pattern: "Save in progress — don't let the user close". Today the consumer must:
- Set `[dismissable]="false"` AND `[closable]="false"` during save, then re-enable.
- OR catch `(drawerHide)` and re-open if save in progress.

**Proposed:** `[canClose]="() => !saving()"` callback returning boolean to gate dismissal.

**Priority: P2**

### P2 — No `[lazy]="true"` / unmount on close
Drawer DOM is rendered when `open=true` and unmounted via `return null` when `open=false` (Stencil source line 169). So body content IS destroyed on close — good for memory, but signal state inside is lost on each open. Consumers needing persistent form state must lift it to the parent.

**Behavior is correct.** Document this clearly in the wrapper.

### P3 — No `[maxWidth]` / `[maxHeight]` constraint
For `position="right"` with `[size]="'xl'"` on small viewports, the 800px drawer can overflow. Per-instance token override works but a prop would be ergonomic.

**Priority: P3**

### P3 — No drag-to-resize handle
Niche but common in IDE-style detail panels.

**Priority: P3**

## Missing ng-template / template slots
- No `<ng-template falconDrawerFooter>` — Angular-idiomatic alternative to `slot="footer"`. Useful when the footer is conditional or dynamic.
- No `<ng-template falconDrawerHeader>` — same.

## Missing flags / options / states
- No `tone` / `severity` variant (info / success / warning / danger header strip).
- No "wide" vs "narrow" size beyond the 4-step `sm/md/lg/xl` ladder.
- No `[backdrop]` mode (separate from `[modal]`) — today `modal=false` shows no backdrop AND doesn't dismiss on outside click. Want a "show backdrop but click-through" mode? Not possible.
- No `[stackIndex]` for layered drawers (per-drawer z-index).

## Missing accessibility features
- The close × button has no programmatic SVG `<title>` — relies on `aria-label`.
- `aria-describedby` for the body content is not auto-linked.
- No `<dialog>` element used — the Stencil renders a `<div role="dialog">`. Native `<dialog>` would give Esc / backdrop / inertness for free, but Stencil shadow can't host one cleanly.

## Missing tests
- No `.spec.ts` for wrapper.
- No e2e for focus-trap correctness with nested focusable elements (radio groups, custom-element form fields).

## Missing Tailwind / token parity
- Both Shadow and Light renderers consume the same tokens. No divergence observed.

## Performance risks
- The `keydown` document listener is global — fires on every keystroke when drawer is open. Cheap, but scales poorly with many concurrent overlays. Acceptable for current usage.
- The `collectFocusable()` query runs on every Tab press — O(N) on subtree. For drawers with 100+ inputs (settings panel), this is non-trivial. Memoising the list per render would help.

## Visual / interaction risks
- The slide-in animation duration is token-driven (`--falcon-drawer-transition-*`) — but the close behavior immediately removes the panel from the DOM (Stencil returns `null`). No exit transition is played. Result: opens slide, closes pop.
- The overlay backdrop has `backdrop-filter: blur(4px)` — heavy on low-end devices.

## Reusable upgrades needed
1. **Expose `closeAriaLabel` in wrapper** for i18n.
2. **`<slot name="header-actions">`** for header action buttons.
3. **`canClose` predicate** for gated dismissal.
4. **Rename `dismissable` → `dismissible` (alias)** for consistency with dialog.
5. **Exit transition** — keep panel mounted briefly during close-out.

## Priority: page-level vs shared
All belong in the shared component.

## Recommended upgrade API (proposed)

```ts
// FalconAngularDrawerComponent additions
@Input() closeAriaLabel = 'Close';
@Input() canClose?: (reason: FalconDrawerHideDetail['reason']) => boolean;
@Input() dismissible = true;     // alias for dismissable (deprecate the typo)
@Input() tone?: 'info' | 'success' | 'warning' | 'danger';

// Stencil slot additions
//   <slot name="header-actions" />
//   <slot name="body-loading" />   // skeleton during async load

// Wrapper template additions
//   <ng-template falconDrawerHeader> / falconDrawerFooter directives
```

## Future-proof recommendation
Consolidate the dialog + drawer focus-trap code into a shared `useFocusTrap()` Stencil mixin. Both components today duplicate ~30 lines of focus-trap logic — a single source would prevent future drift.
