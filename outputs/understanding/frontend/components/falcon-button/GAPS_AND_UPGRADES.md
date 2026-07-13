# falcon-button — GAPS AND UPGRADES

## Missing capabilities (active source verified 2026-06-03)

### G1 — `rootClass` (rootExtraClass) is Tailwind-path-only (P2)
`[CODE]` The wrapper forwards `rootClass` as `root-extra-class` ONLY in the Tailwind branch (falcon-button.component.html:20). The Shadow tag `<falcon-button>` has no `rootExtraClass` `@Prop()` (falcon-button.tsx:32-46) — the `-tw` twin does (falcon-button-tw.tsx:52). So a consumer passing `rootClass` while `useTailwind=false` silently loses it.

**Fix (P2):** add a `rootExtraClass` `@Prop()` to the Shadow tag + bind `[attr.root-extra-class]` in the Shadow branch. Additive, no break.

### G2 — Wrapper re-declares the variant/size/type unions inline (P3 — DRY)
`[CODE]` falcon-button.component.ts:18-20 hand-copies `FalconButtonVariant`/`Size`/`Type` instead of importing from `falcon-button.types.ts`. They are currently identical, but adding an 11th variant means editing TWO files; drift is a latent bug. (This is exactly why the prior dossier said "5 variants" while the type already had 10 — the dossier tracked one copy.)

**Fix (P3):** import the unions from `../../../components/falcon-button/falcon-button.types`.

### G3 — Angular wrapper does not proxy `setFocus()` / `clickProgrammatic()` (P1)
`[CODE]` Both Stencil tags expose `@Method() setFocus()` + `@Method() clickProgrammatic()` (falcon-button.tsx:55-65 / falcon-button-tw.tsx:60-69), but the wrapper exposes neither. Consumers must reach into `ViewChild.nativeElement` (the wrapper, then the inner Stencil tag).

**Fix (P1):**
```ts
@ViewChild('stencilEl', { read: ElementRef }) stencilEl?: ElementRef<HTMLElement>;
async setFocus(): Promise<void> { await (this.stencilEl?.nativeElement as any)?.setFocus?.(); }
async clickProgrammatic(): Promise<void> { await (this.stencilEl?.nativeElement as any)?.clickProgrammatic?.(); }
```
…and tag the inner element `#stencilEl`. (Same shape as `falcon-input` G2.)

### G4 — No automatic `aria-label` warning when `iconOnly` + no `ariaLabel` (P1, a11y)
`[CODE]` The Stencil core auto-detects icon-only mode (falcon-button.tsx:87-88) but does NOT auto-derive or warn about a missing `ariaLabel`. Consumers forget it regularly. A dev-mode `console.warn` when `iconOnly && !ariaLabel` is a low-risk guard.

**Fix (P1):** add the warning in the wrapper constructor (guarded by `isDevMode()`).

### G5 — Classic `@Input()` decorators, no signal inputs (P3)
`[CODE]` The wrapper uses legacy `@Input()` (falcon-button.component.ts:32-46), not Angular-21 `input()`/`model()`. Functionally fine + ref-stable, but the house direction is signals-first. Low-priority modernization.

### G6 — No spec / e2e coverage (P2)
`[CODE]` grep 2026-06-03 → **no `.spec.ts` / `.e2e.ts`** for the wrapper, the Shadow tag, OR the `-tw` twin. For the single most-used primitive (182+ consumers) this is the biggest test gap in the kit. A spec should lock: click suppression while disabled/loading, `falconClick` envelope unwrap, the 10 variants × 3 sizes render-class shape, icon-only auto-detect, full-width host flip, Shadow↔`-tw` parity.

### G7 — Empty icon-wrapper rendering divergence (P3)
`[CODE]` The `-tw` twin only renders the `icon-start`/`icon-end` wrappers when content is slotted (`hasSlottedIconStart()`/`hasSlottedIconEnd()` — falcon-button-tw.tsx:167-183) to kill phantom `gap-*` space; the Shadow tag ALWAYS renders the wrappers (falcon-button.tsx:142-153). Behaviourally equivalent in practice (Shadow `::slotted` collapses), but a structural drift worth aligning.

### G8 — `link` underline divergence between render paths (P2)
`[CODE]` Shadow `link:hover` underlines (falcon-button.css:164-167); the `-tw` path keeps `no-underline` even on hover (button-tailwind-classes.ts:98-99, per the Wave 19 "remove underline" directive). The DEFAULT render path (`-tw`) has no underline at all; flipping `useTailwind=false` reintroduces it. Pick one behaviour and align both paths.

### G9 — No `href` / `routerLink` / polymorphic-tag passthrough (P1)
The `link` variant looks like a link but the tag is always `<button>` — no anchor for "View details" actions that should be real `<a [routerLink]>` (loses right-click → open-in-new-tab). 

**Proposed API:** `@Input() href?: string; @Input() target?: '_blank'|…; @Input() rel?: string;` → render `<a>` instead of `<button>` when `href` is set. Requires both Shadow + Light forks to branch tags. (Also subsumes a P2 `as`/polymorphic-tag request for file-input `<label>` styling.)

## Missing template slots
- No `<slot name="spinner">` — the spinner SVG is hardcoded in both Stencil sources. A pluggable spinner slot (default fallback) would let teams brand the loading visual.
- No `before`/`after`/`badge` slots distinct from icons — `icon-start`/`icon-end` are the only entry points (a count-badge next to the label has nowhere to go without breaking icon-only auto-detect).

## Missing flags / states
- No `selected` / `active` toggle state — the Templates decision card simulates it by swapping `primary-dark` ⇄ `outline-primary-dark`. A first-class `selected` prop would be cleaner for filter-chip use.
- No `compact` mode (smaller than `sm`'s 34 px) for dense in-grid actions.
- No density-aware spinner stroke — fixed 2 px at every size (proportionally heavier at `sm`). A `--falcon-button-spinner-stroke-width-{sm,md,lg}` token trio would tighten it.

## Missing accessibility features
- **A1 (P2):** no `aria-live` announcement when `loading` flips on/off — the consumer must own the live region. `aria-busy` is set but not announced.
- **A2 (P3):** disabled `opacity: 0.5` is uniform across variants — `secondary`/`outline` (already-muted) barely change. A per-variant disabled treatment reads cleaner.
- **A3 (P3):** spinner color is `currentColor` = text color; for `link` on a dark surface the spinner can be low-contrast.

## Missing Tailwind / token parity
- `[CODE]` Parity is **GOOD at the token level** — both paths read `--falcon-button-*` via the shared `RootClassInput` shape (utils.ts) / `FalconButtonTailwindContext` (tailwind helper). Mutating a token updates both render paths.
- Residual divergences: `link` hover underline (G8), empty-icon-wrapper rendering (G7), `rootExtraClass` Shadow-absence (G1). All `safe-local`.

## Performance risks
- `[CODE]` `hasSlottedLabel()` runs `host.querySelector('[slot="label"]')` on every render (falcon-button.tsx:77-83). For data tables with N action buttons per row this is O(N) DOM queries per CD cycle. Caching during `componentWillLoad` is a quick win. **Low real impact** (querySelector is cheap), but worth noting for grid-heavy pages.
- Spinner SVG re-renders each render while `loading=true` — cheap, not memoised. A CSS `::before`-driven spinner would shave the JS render budget.

## Visual / interaction risks
- The 4 Wave 9.F variants are semantically bound to the Templates decision card — reusing them as generic primaries elsewhere muddies the design intent (process/UX risk, not a code bug).
- Two render paths can drift if a variant ships to one path only (process risk — guard via a parity spec, G6).

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G3 | Proxy `setFocus()` / `clickProgrammatic()` on the wrapper | P1 |
| G4 | Dev-mode `aria-label` warning for icon-only | P1 |
| G9 | `href` / `routerLink` / polymorphic-tag passthrough | P1 |
| G1 | `rootExtraClass` on the Shadow tag (parity) | P2 |
| G6 | Add wrapper + Stencil + parity specs | P2 |
| G8 | Align `link` hover underline across render paths | P2 |
| G2 | Import unions from types.ts (DRY) | P3 |
| G5 | Migrate to `input()` signal inputs | P3 |
| G7 | Align empty-icon-wrapper rendering | P3 |

## Fix-shared-vs-per-page
All gaps belong in the **shared Falcon component** (Stencil + wrapper + tokens), NOT per-page. The button is the single chokepoint for every commit affordance; per-page hacks would break the cross-framework SSOT.

## Workarounds (if upgrade blocked)
- For G3 today: `@ViewChild` the wrapper, then `nativeElement.querySelector('falcon-button-tw, falcon-button')?.setFocus()`.
- For G9 today: use a token-styled `<a [routerLink]>` for real navigation; reserve `link` variant for in-content text actions.
- For G4 today: code review / the parity spec once G6 lands.

## Deep-Dive Sweep Findings (2026-06-03 — B17)

**Consumer count: 182 app occurrences / 55 files + 10 occurrences / 3 files in `libs/falcon`** ([CODE] grep `<falcon-angular-button[\s>]`).

Drift corrected vs prior dossier (no deletion/promotion flags — component stays ACTIVE/FLAGSHIP):
- **Variant count 5 → 10** — the prior dossier (OVERVIEW/API/DECISION) documented only 5; the type has had 10 since Wave 9.F (`dashed`/`outline`/`primary-dark`/`outline-primary-dark`/`outline-danger`). Root cause: the wrapper's INLINE union copy was tracked, but it too lists 10 — the dossier was simply stale.
- **Token count 214 → 278 lines; gap values md 8 → 12, lg 10 → 14** (Wave 19 bump).
- **Shadow CSS confirmed token-only** (prior dossier said "would need a separate audit" — now VERIFIED clean, no raw hex).
- **Tailwind helper now read** — confirmed the dual-render class SSOT shares one input shape (prior dossier flagged drift-risk as "referenced but not read").
- **Stale paths removed** — `organization-hierarchy/` → `org-hierarchy-page/`; `playground.page.html` GONE (→ `falcon-ui-showcase`).
- **New finding: zero spec/e2e (G6)** for the most-used primitive.
- All findings are `safe-local` (doc/token/parity/test) — see FINDINGS/B17.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B17) against all source layers. 10-variant union confirmed; token-only Shadow CSS verified; G1/G3/G4/G6/G8/G9 confirmed against live source. No deletion/promotion flags — component stays ACTIVE/FLAGSHIP.
