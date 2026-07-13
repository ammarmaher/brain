# falcon-card — GAPS AND UPGRADES

## Render-architecture findings (corrected 2026-06-03)

### FC-ARCH-1 — Angular wrapper does NOT use the Stencil element (documented, by-design)
`[CODE]` falcon-card.component.ts:1-11 + .component.html:1-14 — "Defect A FIX (2026-05-28)": the wrapper renders pure-Angular `<div>`/`<header>`/`<footer>` + native `<ng-content>`, because under the app's zoneless CD + the define-before-project race the `<falcon-card-tw>` Stencil render destroyed Angular-projected slot content (verified empty across `forceUpdate` / manual-relocate / `scoped:true` strategies). **Consequence for docs:** the Stencil `<falcon-card>` / `<falcon-card-tw>` are React/Vue-only; `useTailwind` is a no-op; `card.tokens.css` does not apply to the Angular path; `::part()` is unavailable on the Angular path. This is **by-design and correct**, not a gap — but the prior dossier mis-stated it. No action; documentation only.

### FC-ARCH-2 — The wrapper `computed()` helpers are LIVE, not dead code (corrects prior dossier)
`[CODE]` falcon-card.component.ts:63-95 bound at html:15/17/28/33 — `classes()`/`bodyClasses()`/`headerClasses()`/`footerClasses()` **are the render**. The prior GAPS/TOKENS/INTEGRATION "remove the legacy dead helpers" recommendation was **wrong** and is retracted. Do NOT remove them.

### FC-TOKEN-1 — Angular path hardcodes palette utilities, not `--falcon-card-*` tokens (P2, NEW)
`[CODE]` card-tailwind-classes.ts + falcon-card.component.ts:89-103 emit `bg-falcon-neutral-0 border-falcon-neutral-150 shadow-sm` etc.; the `--falcon-card-*` tokens are only read by the Shadow CSS (React/Vue). So per-instance token overrides don't bite the Angular path. **P2 — consider migrating the Angular chrome to arbitrary-value token utilities (`bg-[color:var(--falcon-card-bg)]`) for token parity** (same family as tag FT-07). Until then, `rootClass` is the override channel.

### FC-A11Y-1 — Angular path lacks the Shadow path's `role="region"` landmark (P2, NEW)
`[CODE]` falcon-card.tsx:36-37,44-47 — the Shadow source gives the root `role="region"` + `aria-label` when `ariaLabel`/`header` is set. The **Angular wrapper's `<div>` has no role and no `ariaLabel` input** (falcon-card.component.html:15). A named section rendered via `<falcon-angular-card>` is NOT a screen-reader landmark. **P2 — add `[ariaLabel]` to the wrapper + `role="region"` on the root `<div>` when header/ariaLabel present.**

## Missing capabilities (active source verified)

### G-INT-1 (P1) — No `interactive` / `clickable` / `selected` state
Common pattern: "Selectable plan card", "Choose this option" tile-grids. `[CODE]` The live source has **no** hover-lift, focus-ring, selected styling, or click output (the registry's `interactive`/`selected`/`falcon-click` do NOT exist).

**Proposed API:**
```ts
@Input() interactive = false;   // hover-lift + focus-ring + cursor-pointer
@Input() selected = false;      // selected ring + accent border
@Output() falconClick = new EventEmitter<MouseEvent>();
```
When `interactive=true`, render the root as `<button>` for native keyboard a11y. **P1.**

### G-FOOTGUN-1 (P1) — Header / footer prop-and-slot double render
`[CODE]` falcon-card.component.html:16-26 / 32-37 — the prop-driven `<header>`/`<footer>` AND the `<ng-content select="[slot=header|footer]">` **both render**. Passing `[header]` AND projecting `slot="header"` → two headers (a visible defect). **P1 — suppress the prop-driven block when the matching slot has projected content** (e.g. gate behind a `[suppressDuplicateHeader]` flag for one release, then default it). NOTE: this is an **Angular-template** double-render (not Stencil-slot precedence as the prior dossier said).

### G-LOAD-1 (P2) — No `loading` / `skeleton` mode
A card showing a fetching section must render its own skeleton. **Proposed:** `[loading]="true"` swaps the body for a token-driven skeleton. **P2.**

### G-MEDIA-1 (P2) — No `image` / cover-image slot
For media cards (cover photo + body). **Proposed:** `<ng-content select="[slot=media]">` above the header. **P2.**

### G-PAD-1 (P3) — Body has no `padding="none"` mode
For tables that should reach the card edge. **Proposed:** `[bodyPadding]="'none'|'sm'|'md'|'lg'"`. **P3.**

### G-TONE-1 (P2) — No `tone` / `severity` accent variant
No info/success/warning/danger accent card (consumers do this with `rootClass` today, e.g. the error banner). **Proposed:** `[tone]="'info'|'success'|'warning'|'danger'"`. **P2.**

### G-HEAD-1 (P3) — `<h3>` heading level is fixed
`[CODE]` falcon-card.component.html:19 — always `<h3>`; pages with a proper h1→h2→h3 outline can't override (consumers work around it by rendering their own `<h2>` in the body, as contact-group-detail does). **Proposed:** `[headingLevel]="1..6"`. **P3.**

## Missing ng-template / template slots
- No `<ng-template falconCardHeader>` / `falconCardFooter` directives. Rich content goes through the `slot="header"` / `slot="footer"` `<ng-content>` selectors — fine for static content, harder to drive with `*ngTemplateOutlet`. A directive-based approach would be more idiomatic for dynamic header switching. **P3.**

## Missing tests
- `[CODE]` **No `.spec.ts` for any layer** (Angular wrapper, Shadow, `-tw`) — verified by listing the source folders. A wrapper spec covering the double-render footgun + null-coercion + variant/size class output would be cheap.

## Performance risks
- Negligible — card is a pure-render container; `OnPush` + signal-backed inputs.

## Visual / interaction risks
- The prop-and-slot double-render footgun (G-FOOTGUN-1).
- `flat` strips border AND shadow — invisible on a white parent (no visual separation). Consider keeping a 1px border in flat mode, or rename `flat` → `bare`.
- The `<h3>` is structural — visible header size changes don't change the underlying tag.

## Reusable upgrades needed
1. **`interactive` + `selected` + `falconClick`** (G-INT-1) — selectable card pattern.
2. **Suppress prop header/footer when the slot has content** (G-FOOTGUN-1).
3. **`[ariaLabel]` + `role="region"` on the Angular path** (FC-A11Y-1).
4. **`loading` skeleton** (G-LOAD-1), **`tone` accent** (G-TONE-1), **`headingLevel`** (G-HEAD-1), **media slot** (G-MEDIA-1).
5. **Token-parity for the Angular chrome** (FC-TOKEN-1).

## Recommended upgrade API (proposed)
```ts
@Input() interactive = false;
@Input() selected = false;
@Input() loading = false;
@Input() tone?: 'info' | 'success' | 'warning' | 'danger';
@Input() headingLevel: 1 | 2 | 3 | 4 | 5 | 6 = 3;
@Input() bodyPadding?: 'none' | 'sm' | 'md' | 'lg';
@Input() ariaLabel?: string;             // + role="region" on the root <div>
@Output() falconClick = new EventEmitter<MouseEvent>();
// + <ng-content select="[slot=media]">  + suppress prop header when slot present
```

## Priority: page-level vs shared
All upgrades belong in the shared component. Per-page hand-rolling defeats the purpose.

## Wave 7 Findings (2026-05-17)

**Consumer count: 1** ([CODE] grep `<falcon-angular-card>` across `apps/` + `libs/falcon/`).

## Deep-Dive Sweep Findings (2026-06-03 — B10)

**Consumer count: 10 app files / 42 occurrences + 1 lib file / 3 occurrences** ([CODE] grep `falcon-angular-card`).

Drift corrected vs prior dossier (no deletion/promotion flags; component stays ACTIVE):
- **FC-ARCH-1/2 — MAJOR correction:** the Angular wrapper renders pure-Angular `<div>` + native `<ng-content>` (Defect A FIX), NOT the Stencil `<falcon-card-tw>`. The `computed()` helpers are LIVE (not dead code — prior claim retracted). `useTailwind` is a no-op. Stencil pair + `card.tokens.css` + `::part()` are React/Vue-only.
- **Slot framing corrected** — slots are Angular `<ng-content select="[slot=header|footer]">` (body = default); the double-header footgun is via the Angular template, not Stencil-slot precedence.
- **FC-TOKEN-1 NEW** — Angular chrome hardcodes `bg-falcon-*` palette utilities; token overrides don't bite (use `rootClass`).
- **FC-A11Y-1 NEW** — Angular path lacks the Shadow path's `role="region"` landmark + has no `ariaLabel` input.
- **Adoption corrected** — now 10 app files / 42 + 1 lib / 3 (was "no matches/1").
- **No new structural gaps beyond the additive proposals.** All findings are `safe-local` (doc) — see FINDINGS/B10.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B10) against falcon-card.component.ts (104 ln), .component.html (38 ln), falcon-card.tsx, falcon-card-tw.tsx, card-tailwind-classes.ts. Render-architecture corrected (Angular chrome, LIVE helpers, no-op `useTailwind`); G-INT-1 (interactive) + G-FOOTGUN-1 (double header) confirmed; FC-TOKEN-1 + FC-A11Y-1 NEW; no spec for any layer. No deletion/promotion flags — component stays ACTIVE.
