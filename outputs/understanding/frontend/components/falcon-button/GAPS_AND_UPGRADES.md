# falcon-button — GAPS AND UPGRADES

## Missing capabilities

### P1 — Automatic `aria-label` when `iconOnly` + icon class is detectable
The Stencil source already auto-detects `iconOnly` mode when there's no label + a slotted `icon-start`. But it does NOT auto-derive an `aria-label` from the icon class name (e.g. `falcon-icon-pencil` → "Edit"). Consumers forget to pass `ariaLabel` regularly. Adding a dev-time warning when `iconOnly === true && !ariaLabel` would be a low-risk a11y guard.

**Priority: P1**
**Where to fix:** shared Falcon component (Stencil + Angular wrapper).
**Workaround:** code review.

### P1 — No `routerLink` / href passthrough
The `link` variant looks like a link but the underlying tag is always `<button>`. There's no way to render an anchor for "View details" type actions that should be real `<a [routerLink]>`. Right now consumers either:
- Use raw `<a class="...">` (no token alignment), or
- Use `<falcon-angular-button variant="link" (falconClick)="router.navigate(...)">` (loses right-click → "Open in new tab").

**Proposed API:**
```ts
@Input() href?: string;        // when set, render <a> instead of <button>
@Input() target?: '_blank' | '_self' | '_parent' | '_top';
@Input() rel?: string;          // auto-set to 'noopener' when target=_blank
```

**Priority: P1**
**Where to fix:** shared Falcon component — would require both Shadow + Light forks to render either `<button>` or `<a>` per prop. Add `href` slot to tokens (already covers).
**Workaround:** wrap manually.

### P2 — No `as` / polymorphic tag
Similar to above but more general — for cases like "render this button-styled element as a `<label>` for file inputs" we currently fall back to wrapping. Less critical than `href`, but worth tracking.

**Priority: P2**

### P2 — No size hint for spinner stroke per density
Currently spinner stroke is fixed at 2px regardless of size. At `sm` (14px spinner) the 2px stroke is proportionally heavier than at `lg` (18px). A density-aware stroke-width token would tighten the visual.

**Token addition:**
```css
--falcon-button-spinner-stroke-width-sm: 1.5px;
--falcon-button-spinner-stroke-width-md: 2px;
--falcon-button-spinner-stroke-width-lg: 2px;
```

**Priority: P2**

### P3 — `iconRotate` for "send" / "back" arrow flipping under RTL
Not handled in the Stencil source. Today an arrow icon in `icon-end` won't flip in RTL. Tokens have RTL infrastructure (`libs/falcon-ui-tokens/src/themes/rtl.css`) but the button doesn't consume it for icons. Caller responsibility today.

**Priority: P3** — low; most icons are bi-directional or icon-font controlled.

## Missing ng-template / template slots
- No template slot for the spinner (e.g. custom branded loading indicator). The spinner is a hardcoded `<svg>` in both Shadow + Light DOM sources. Could be made `<slot name="spinner">` with the default fallback for parity.
- No `before` / `after` slots distinct from icons — `icon-start` / `icon-end` are the only entry points. For most use cases this is fine, but a consumer wanting badge-style annotations next to a button label has nowhere to put them without breaking the icon-only auto-detect.

## Missing flags / options / states
- No `compact` mode (smaller-than-`sm`). At 34 px sm is already pretty large for inline-grid actions.
- No `block` mode that mirrors `fullWidth` but with an explicit semantics distinction (some teams want "centered" vs "stretched").
- No `selected` / `active` state for use as a toggle button. Today consumers need `variant="primary"` swap-on-state, which is a heavier visual than a toggle indicator.

## Missing accessibility features
- No automatic `aria-describedby` linking to a sibling helper-text element (would help when buttons sit next to an error message).
- `aria-busy` is set but `aria-live` polite/assertive on the parent region is the consumer's job — no built-in live announcement when `loading` flips on/off.

## Missing tests
- The wrapper has no `.spec.ts` file in `libs/falcon-ui-core/src/angular-wrapper/components/falcon-button/`. Stencil core has none either (verified by listing the folder — only `.tsx`, `.types.ts`, `.utils.ts`).
- An e2e test confirming the spinner geometry stays width-stable when `loading` flips would catch any future layout regression.

## Missing Tailwind / token parity
The Shadow and Tailwind paths share `falconButtonRootClasses({...})` plus `buildRootClasses({...})` helpers, but those produce different string shapes:
- Shadow path returns `Record<string, boolean>` (class-object syntax for Stencil's `class={}`).
- Tailwind path emits a string of Tailwind utilities built up by `falconButtonRootClasses()` (file at `libs/falcon-ui-core/src/tailwind/button-tailwind-classes.ts` referenced but not read in this audit).

**Risk:** divergence over time. If `buildRootClasses` gains a new flag (say `'compact': true`) and `falconButtonRootClasses` is updated separately, Shadow and Tailwind can drift. Recommendation: have both helpers consume the same `RootClassInput` shape and centralise the boolean-class string emission.

## Performance risks
- The Stencil component renders the entire spinner SVG on every render when `loading=true`. Cheap, but not memoised — moving to a styled `::before` pseudo-element with CSS-driven animation would lower the JS render budget for buttons in tables.
- `host.querySelector('[slot="label"]')` runs on every render in Shadow source. For mass-rendering scenarios (data tables with N action buttons per row) this is O(N × labels) DOM queries. Cache result during `componentWillLoad` would be a quick win.

## Visual / interaction risks
- `link` variant has no underline by default — visually it looks like plain ghost text. Consumers can mistake it for "do nothing on click" affordance. Tokens declare `--falcon-button-link-text-hover: var(--color-falcon-teal-500)` which only fires on hover. Recommendation: add `--falcon-button-link-text-decoration: underline` default.
- The disabled `opacity: 0.5` is uniform across all variants. For `secondary` (already-grey-text) this can look broken — the text barely changes. A per-variant disabled treatment (drop bg-hover-only) would be cleaner.
- Loading spinner color is `currentColor` which equals the button's text color. For `ghost` + danger contexts the contrast is fine, but for `link` on a dark background the spinner becomes invisible.

## Reusable upgrades needed
1. **`href` + `target` props** — unblock real `<a>` rendering for routing actions.
2. **`<slot name="spinner">`** — pluggable loading visual.
3. **A11y dev-mode warning** — log when `iconOnly && !ariaLabel`.
4. **Density-aware spinner stroke** — token addition.
5. **`selected` / `active` toggle state** — for filter chip buttons.

## Priority: page-level vs shared

| Item | Fix location |
|---|---|
| `href` / `target` passthrough | Shared component (both Shadow + Light) |
| `aria-label` dev warning | Shared component (Stencil layer) |
| Spinner slot | Shared component |
| Per-variant disabled treatment | Tokens only (`button.tokens.css`) |
| `selected` state | Shared component (Stencil + tokens + wrapper) |

Everything else listed here is **shared-fix only** — no page should monkey-patch buttons.

## Recommended upgrade API (proposed)

```ts
// FalconAngularButtonComponent additions
@Input() href?: string;
@Input() target?: '_blank' | '_self' | '_parent' | '_top';
@Input() rel?: string;          // auto = 'noopener' when target=_blank
@Input() selected = false;       // toggle state
// Slot additions (template / Stencil tsx)
//   <slot name="spinner">…default svg…</slot>
//   <slot name="badge"></slot>   // top-right corner badge (count / dot)
// Dev warning
//   constructor() {
//     if (!isProd && this.iconOnly && !this.ariaLabel) console.warn('[falcon-angular-button] iconOnly requires ariaLabel for a11y');
//   }
```

## Future-proof recommendation
Move `buildRootClasses` (Stencil-internal) + `falconButtonRootClasses` (Tailwind helper) to a single shared module that produces both the `Record<string, boolean>` for class-object syntax AND the joined string. That removes the drift risk and lets future flags propagate to both render paths automatically.
