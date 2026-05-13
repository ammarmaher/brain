# falcon-tabs — GAPS AND UPGRADES

## Missing capabilities

### P0 — `falconTabActions` is fragile to re-render
The Angular wrapper uses a MutationObserver to keep the actions anchor parented inside the Stencil `<div role="tablist">`. Risk surfaces:
- Wrapping the tablist in a flex container that wraps on narrow viewport will push the actions to a new row.
- Stencil tab re-renders that drop the tablist (orientation switch in particular) require the observer to re-attach — the implementation handles this with `requestAnimationFrame` + observer, but it's the largest source of integration risk in the library.
- If a consumer manipulates the Shadow root (e.g. through `::part(tablist)`) and changes display, the absolute layout assumptions break.

**Priority: P0** for any consumer that switches orientation at runtime.
**Where to fix:** shared. Replace MutationObserver with a real Stencil slot `name="header-end"` on the underlying tag — would require a v0.3 Stencil refactor.

### P1 — No `header-start` slot on Stencil
Only `header-end` (via the Angular MutationObserver trick) exists. Many designs want a leading title or breadcrumb stuck to the left of the tabs. Today the consumer wraps the tabs in a flex container and adds the leading content as a sibling — works, but not part of the component.

**Proposed API:**
```html
<!-- in falcon-tabs.tsx -->
<slot name="header-start" />
<div class="falcon-tabs-tablist" role="tablist">...</div>
<slot name="header-end" />
```

**Priority: P1**

### P1 — `radio-cards` mode has no body slot
After a card is selected, the consumer must render the body OUTSIDE the component (using `@switch`). For consistency with navigation mode (which has `panel-<value>` slots), radio-cards should also offer them.

**Priority: P1**

### P1 — Tab `icon` only supports CSS-class glyphs
`FalconTabOption.icon` is typed as `string` and rendered as `<i class={option.icon} />`. SVG icons or `<falcon-angular-icon>` use cases need either:
- A per-tab template slot, OR
- An `iconUrl` field for `<img>` rendering.

**Proposed:**
```ts
export interface FalconTabOption {
  ...
  readonly icon?: string;
  readonly iconUrl?: string;             // new — wins over icon
  readonly iconTemplate?: TemplateRef<unknown>;  // new — Angular-only escape
}
```

**Priority: P1**

### P2 — Lazy panel content
In navigation mode, all `panel-<value>` slot content renders simultaneously (just hidden via `hidden={!selected}`). For heavy tab bodies (big tables, charts), this hurts initial paint. A `[lazy]="true"` mode would defer rendering until the tab is first activated.

**Workaround:** consumers use `@switch (activeTab)` outside the component (current pattern in org-hierarchy).

**Priority: P2**

### P2 — No badge / count slot per tab
Common UX: "Settings (3)" where 3 = unread/invalid count. Today consumers embed the count in `label` as a string. A dedicated badge slot would tokens-align with `falcon-angular-badge`.

**Proposed:** per-tab `<slot name="badge-<value>">`.

**Priority: P2**

### P2 — No tab close affordance
Common in IDE-like UIs. Not currently supported.

**Priority: P2** — niche.

### P3 — No drag-to-reorder
Future enhancement, not currently requested.

## Missing ng-template / template slots
- No `tab-label` per-tab template (rich label content beyond plain string).
- No `panel-fallback` template (loading state while async content streams in).
- No `actions-default` / `actions-fallback` template — `falconTabActions` matches only specific tab values; tabs without an action template show nothing (which is the intended behavior, but a "default for all tabs" template would reduce boilerplate).

## Missing flags / options / states
- No "scrollable" mode for tab strips with >N tabs that overflow horizontally — overflow:hidden cuts them off. PrimeNG had `[scrollable]` on `p-tabView`; here the only option is to clamp `tabs[]` length.
- No "underline only" / "filled" / "pill" subvariants under navigation mode. Today navigation always renders the same sliding underline.
- No persistent-state tab disable distinct from per-option `disabled` (e.g. "this tab is loading, defer interaction" — currently you'd toggle disabled on the option which is a render-time change).

## Missing accessibility features
- Vertical mode uses `aria-orientation="vertical"` but the keyboard handler still only checks `orientation === 'horizontal'` for the up/down vs left/right key swap. Verified in source — already wired correctly.
- Radio-cards `role="radio"` is correct, but the cards don't expose a description region for the `helperText` sub-description text — screen readers will read it as part of the button label by default. Adding `aria-describedby` linking to a description element would tighten this.
- No `aria-current` on the active tab (only `aria-selected`). For nav-like usage, both attributes are standard.

## Missing tests
- No `.spec.ts` for tabs wrapper.
- No e2e test for the MutationObserver re-attachment of `falconTabActions` after a tab change.
- No test for keyboard navigation Home / End wrapping with mixed disabled tabs.

## Missing Tailwind / token parity
The Stencil Shadow source uses scoped CSS (`falcon-tabs.css`). The Light DOM source emits Tailwind utility classes through helpers. As with button, the two helpers can drift. The token file is the single SSOT — but the helper functions need to be kept aligned.

## Performance risks
- `measureActiveTab()` runs on every `componentDidUpdate` and `componentDidLoad`. For tabs that re-render frequently (parent recomputes `tabs[]` array reference), this is `getBoundingClientRect()` + inline style writes — non-zero cost. Memoising the indicator position keyed on `[activeIdx, tabs.length, orientation]` would skip redundant work.
- MutationObserver on the entire Stencil host subtree (`childList: true, subtree: true`) — high-fan-out. A more targeted observation on just the tablist would be cheaper. Currently mitigated by the rAF batch.

## Visual / interaction risks
- The underline indicator can lag during fast tab switches because it animates 220ms. Concurrent rAF measure on the new active tab can produce a brief "skip" if the previous animation hasn't settled.
- Vertical orientation places the indicator as a top-strip (height-based) — visually inconsistent with how most vertical tab strips show a left/right vertical strip. The CSS may need a per-orientation indicator shape.
- Radio-cards mode shows `helperText` as a smaller secondary line — but if the helper text is very long, the cards uneven up.

## Reusable upgrades needed
1. **Real Stencil slot for `header-end` / `header-start`** — replaces the MutationObserver hack.
2. **Per-tab `panel-<value>` slot in radio-cards mode** — parity with navigation mode.
3. **Per-tab badge / count slot** — first-class support.
4. **`iconUrl` per option** — SVG + image icons.
5. **Lazy panel mode** — defer body rendering.
6. **Scrollable tablist** — for overflow.

## Priority: page-level vs shared

All listed items belong in the shared component. Per-page hacks would multiply the MutationObserver fragility.

## Recommended upgrade API (proposed)

```ts
// FalconTabOption additions
export interface FalconTabOption {
  readonly value: string | number;
  readonly label: string;
  readonly disabled?: boolean;
  readonly icon?: string;
  readonly iconUrl?: string;       // new
  readonly badge?: { value: string | number; severity?: 'info' | 'warning' | 'danger' | 'success' };  // new
  readonly helperText?: string;
}

// FalconAngularTabsComponent additions
@Input() lazy = false;
@Input() scrollable = false;
@Input() variant: 'underline' | 'pill' | 'filled' = 'underline';  // navigation mode only

// Stencil slot additions
//   <slot name="header-start" />
//   <slot name="header-end" />     <-- replaces falconTabActions injection
//   <slot name="panel-<value>" />  <-- radio-cards mode too
//   <slot name="badge-<value>" />  <-- per-tab badge
```

## Future-proof recommendation
The `falconTabActions` directive is a clever stop-gap but introduces fragility. Long-term: promote `header-end` into a real Stencil slot and migrate consumers. Keep `falconTabActions` as a deprecation shim that forwards into the new slot during the transition.
