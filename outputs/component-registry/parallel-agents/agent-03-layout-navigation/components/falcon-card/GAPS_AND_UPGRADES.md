# falcon-card — GAPS AND UPGRADES

## Missing capabilities

### P1 — No `interactive` / `clickable` / `selected` state
Common pattern: "Selectable plan card" for billing pages, "Choose this option" tile-grids. Today the card has no built-in hover-lift, focus-ring, or selected styling. The registry table incorrectly listed these as supported.

**Proposed API:**
```ts
@Input() interactive = false;   // hover-lift + focus-ring + cursor-pointer
@Input() selected = false;       // selected ring + accent border
@Output() falconClick = new EventEmitter<MouseEvent>();
```

When `interactive=true`, render as `<button>` instead of `<div>` for native keyboard accessibility.

**Priority: P1**

### P1 — Duplicate header rendering risk
The Stencil source renders both the prop-driven header AND `<slot name="header">` (lines 49-77). When a consumer projects content into `slot="header"` AND passes `[header]` prop, both appear. Either:
- Hide the prop-header when slot has content (current logic doesn't check this), OR
- Document the precedence and add a runtime warning.

**Priority: P1** (data integrity / footgun).

### P2 — No `loading` / `skeleton` mode
Common UX: card shows skeleton bars while data fetches. Today the consumer renders a separate skeleton card.

**Proposed:** `<falcon-angular-card [loading]="isLoading">` that swaps body slot for a skeleton placeholder.

**Priority: P2**

### P2 — No "draggable" / "sortable" mode
Dashboard widget reordering — current registry lists "no drag-handle / sortable mode" as a known gap. Not in the active source.

**Priority: P2** (only if dashboard reordering is on roadmap).

### P2 — No `image` / cover-image slot
For media cards (avatar tile / cover photo + body), no built-in support.

**Proposed:** `<slot name="media">` above the header.

**Priority: P2**

### P3 — Body has no `padding="none"` mode
For tables that should reach the edge of the card, body padding `--falcon-card-body-padding: 16px` adds a gutter. Today consumers override the token or use a different container.

**Proposed:** `[bodyPadding]="'none' | 'sm' | 'md' | 'lg'"`.

**Priority: P3**

## Missing ng-template / template slots
- No `<ng-template falconCardHeader>` / `falconCardFooter` directives. Today rich content goes through `slot="header"` / `slot="footer"` — works for static content but harder to drive with `*ngTemplateOutlet`. A directive-based approach would be more Angular-idiomatic for dynamic header switching.

## Missing flags / options / states
- No `density` / `compact` mode beyond `size`.
- No `hover` / `pressed` visual states (no `interactive` mode to gate them).
- No `tone` / `severity` variant (e.g. info / success / warning / danger card with colored accent).
- No `borderless-body` flag for media cards.

## Missing accessibility features
- The `<h3>` is always level 3 — no `headingLevel` prop. Pages with proper h1 → h2 → h3 hierarchy can't override the level.
- When no `header` and no `ariaLabel`, the card has no `role` — fine for decorative use, but the inferred logic could be smarter (e.g. infer from slot content).

## Missing tests
- No `.spec.ts` in the Angular wrapper folder.
- No Stencil unit tests (verified by listing the source folder).

## Missing Tailwind / token parity
The wrapper's `computed()` helpers (`classes`, `bodyClasses`, `headerClasses`, `footerClasses`) emit Tailwind utilities, but these are LEGACY helpers — the modern rendering goes through `<falcon-card-tw>` which uses `falconCardRootClasses({...})` etc. The wrapper's own computed helpers are unused by the template. Cleanup opportunity.

## Performance risks
- Negligible — card is a pure-render container.

## Visual / interaction risks
- The header-slot-and-prop-both-render footgun (above).
- The `<h3>` is structural — pages that change the visible header size won't see the underlying `h3` change to `h2`/`h4`.
- `flat` variant strips the border AND shadow — looks indistinct on white parents (no visual separation). Consider keeping a 1px border in flat mode for clarity, or rename `flat` to `bare` to set expectations.

## Reusable upgrades needed
1. **`interactive` + `selected` + `falconClick`** — selectable card pattern.
2. **Hide prop header when slot has content** — fix the duplicate-render footgun.
3. **`loading` / skeleton mode** — common UX.
4. **`tone` variant** — info / success / warning / danger accent.
5. **`headingLevel` prop** — better heading hierarchy.

## Priority: page-level vs shared
All upgrades belong in the shared component. Per-page hand-rolling defeats the purpose.

## Recommended upgrade API (proposed)

```ts
// FalconAngularCardComponent additions
@Input() interactive = false;
@Input() selected = false;
@Input() loading = false;
@Input() tone?: 'info' | 'success' | 'warning' | 'danger';
@Input() headingLevel: 1 | 2 | 3 | 4 | 5 | 6 = 3;
@Input() bodyPadding?: 'none' | 'sm' | 'md' | 'lg';

@Output() falconClick = new EventEmitter<MouseEvent>();

// Stencil slot additions
//   <slot name="media" />
//   when slotted-header exists, suppress prop-driven header render
```

## Future-proof recommendation
Pre-adoption: ship `interactive` + `selected` + the slot/prop fix. Without them the card can't compete with hand-rolled selectable tiles in coming dashboard / billing pages.
