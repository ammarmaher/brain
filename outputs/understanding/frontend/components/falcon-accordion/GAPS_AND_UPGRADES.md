# falcon-accordion — GAPS AND UPGRADES

## Missing capabilities

### A1 — No CVA + no `expandedValuesChange` Output (P1)
`[CODE]` falcon-accordion.component.ts:52,60-66 — the wrapper has an `expandedValues` getter/setter and a `(valueChange)` Output, but **no `expandedValuesChange` Output** → the `[(expandedValues)]` banana-box does NOT auto-wire (the prior dossier's `[(expandedValues)]` examples were wrong). It also does NOT implement `ControlValueAccessor`. **Fix (additive, zero-risk — 0 consumers):** add `@Output() expandedValuesChange` aliased from `valueChange`, AND/OR implement CVA for Reactive-Forms-driven section visibility.

### A2 — Stencil `expand()` / `collapse()` not proxied on the wrapper (P2)
`[CODE]` falcon-accordion.tsx:79-90 / -tw.tsx:86-96 — both Stencil tags expose `@Method() expand(value)` / `collapse(value)`, but the Angular wrapper does NOT proxy them and does NOT tag the inner element with a template `#ref`. Consumers must `querySelector('falcon-accordion-tw, falcon-accordion')` off a host `ViewChild`. **Fix:** tag the inner element + add async `expand()` / `collapse()` proxies on the wrapper.

### P1 — No header slot per item
Today the header content is built from `FalconAccordionItem` props (`label`, `description`, `icon`). For richer header content (badges, status pills, action buttons next to the title), there's no escape hatch.

**Proposed:** `<slot name="header-<value>">` matching the existing `content-<value>` pattern.

**Priority: P1**

### P1 — No "always-1-open" mode
`mode="single"` allows collapsing the open item to zero. For UI patterns that require always-1-open (e.g. tabbed-like with persistent visibility), there's no built-in option.

**Proposed:** `mode="single-locked"` (or `[allowCollapseLast]="false"` flag).

**Priority: P1**

### P1 — No CVA support
The Angular wrapper doesn't implement `ControlValueAccessor`. Two-way is `[(expandedValues)]` only, not Reactive Forms. For form-driven section visibility this is a gap.

**Priority: P1**

### P2 — Item icons are CSS class strings
Same as other components — `<i class="falcon-icon falcon-icon-X">` bypasses `<falcon-angular-icon>`.

**Priority: P2**

### P2 — No `loading` state per item
For async-loaded panel content, no built-in skeleton / spinner. Today consumers render their own placeholder in the panel body.

**Priority: P2**

### P2 — No "controlled item" mode
Pages may want to disable expand/collapse for specific items only via a callback, not just `disabled: true`. E.g. "this item is collapsing but isn't ready yet — defer".

**Proposed:** `[canToggle]="(value) => boolean"`.

**Priority: P2**

### P3 — No animation customisation
The expand/collapse uses Stencil's `hidden` attribute toggle. No height-animation by default. For smooth UX, consumers need to add CSS transitions on the panel.

**Priority: P3**

### P3 — No nested accordion support
Accordion can be nested inside an accordion panel — but the outer-accordion's keyboard handler may steal focus. Untested.

## Missing ng-template / template slots
- No `<ng-template falconAccordionHeader="value">` directive.
- No `<ng-template falconAccordionContent="value">` directive (slot equivalent exists, but Angular directive would be more idiomatic for dynamic content lookup).

## Missing flags / options / states
- `single-locked` mode.
- `loading` per item.
- `canToggle` predicate.
- Custom expand-collapse animation toggle.
- Auto-collapse-on-outside-click.

## Missing accessibility features
- The accordion as a whole has `aria-label` but the inner `<button>` headers don't carry their own `aria-label` — they rely on visible text label. If `label` is empty (which shouldn't happen but is technically possible), the header has no accessible name.
- No `aria-level` on the header buttons — accordion sections SHOULD have a heading level. WAI-ARIA APG recommends wrapping headers in `<h2>`-`<h6>` per consumer context. Today the headers are bare `<button>`.

## Missing tests
- No `.spec.ts`.
- No e2e for keyboard nav.

## Missing Tailwind / token parity
- `[CODE]` **Light + Shadow render-path parity VERIFIED 2026-06-03 (B13)** — `falcon-accordion-tw.tsx` mirrors `falcon-accordion.tsx` 1:1 in `@Prop`/`@Event`/`@Method`/slots/keyboard, sharing the SAME `falcon-accordion.utils.ts` and the SAME `--falcon-accordion-*` tokens (Shadow via CSS, `-tw` via `accordion-tailwind-classes.ts`). **One divergence (B-dim):** the `-tw` twin emits NO `part=` attributes (`part="header"`/`"panel"`/etc. are Shadow-only — Light DOM has no `::part`). Token parity OK.

## Performance risks
- `headerRefs` Map grows per-render and is cleaned in `onItemsChange`. For very long accordions (>50 items), the Map and DOM grow proportionally. Acceptable for typical use.

## Visual / interaction risks
- Chevron rotation isn't animated by default — relies on CSS in tokens.
- Disabled items still show the chevron (chevron visible, not greyed).

## Reusable upgrades needed
1. **Per-item header slot** — P1.
2. **`mode="single-locked"`** — P1.
3. **CVA support** — P1.
4. **`<falcon-angular-icon>` composition** — P2.
5. **Per-item `loading` state** — P2.
6. **`canToggle` predicate** — P2.

## Priority: page-level vs shared
All belong in the shared component.

## Recommended upgrade API (proposed)

```ts
@Component({ selector: 'falcon-angular-accordion', ... })
export class FalconAngularAccordionComponent {
  @Input() items: ReadonlyArray<FalconAccordionItem> = [];
  @Input() mode: 'single' | 'multiple' | 'single-locked' = 'single';   // new mode
  @Input() size: FalconAccordionSize = 'md';
  @Input() disabled = false;
  @Input() helperText?: string;
  @Input() errorMessage?: string;
  @Input() showChevron = true;
  @Input() ariaLabel?: string;
  @Input() canToggle?: (value: string | number, isExpanded: boolean) => boolean;  // new
  @Input() loadingValues?: ReadonlyArray<string | number>;                          // new

  @Input() expandedValues: ReadonlyArray<string | number> = [];
  @Output() valueChange = new EventEmitter<ReadonlyArray<string | number>>();
  @Output() expand = new EventEmitter<FalconAccordionExpandDetail>();
  @Output() collapse = new EventEmitter<FalconAccordionCollapseDetail>();

  // CVA (new)
  // ...implement ControlValueAccessor
}

// FalconAccordionItem additions
export interface FalconAccordionItem {
  value: string | number;
  label: string;
  description?: string;
  icon?: string;
  iconName?: string;        // new — for <falcon-angular-icon>
  disabled?: boolean;
  badge?: { value: string; severity?: FalconBadgeSeverity };  // new
}

// Slot additions
//   <slot name="header-<value>">  per-item header escape
//   <slot name="loading-<value>"> per-item skeleton
```

## Future-proof recommendation
Land the header slot first (P1) — unblocks the "rich header with status badge" pattern that any settings page will eventually need.

## Wave 7 Findings (2026-05-17)

**Consumer count: 1** ([CODE] grep `<falcon-angular-accordion>` across `apps/` + `libs/falcon/`) — STALE (`playground.page.html`, route now gone).

## Deep-Dive Sweep Findings (2026-06-03 — B13)

**Consumer count: 0 app files / 0 occurrences + 0 in `libs/falcon`** ([CODE] grep `<falcon-angular-accordion`). Only showcase/registry/docs/safelist references remain — the component stays ACTIVE but UNADOPTED.

Drift corrected vs prior dossier (no deletion/promotion flags; component stays ACTIVE):
- **`-tw` twin CONFIRMED to exist** — `falcon-accordion-tw/falcon-accordion-tw.tsx` (238 ln) is on disk + registered in `define-falcon-tw-component.ts:28`. The dual-render is real (prior dossier listed the path; the B10 mis-pattern of "single-render" does NOT apply here). Render-path parity verified (one divergence: `-tw` emits no `part=`).
- **Binding corrected** — there is no `expandedValuesChange` Output, so `[(expandedValues)]` does NOT banana-box. New gap **A1** (add the Output and/or CVA). USAGE/RECOGNITION/INTEGRATION/DECISION corrected to `[expandedValues]` + `(valueChange)`.
- **New gap A2** — Stencil `expand()`/`collapse()` `@Method`s are not proxied on the Angular wrapper.
- **Token recount** — token file is **139 lines / 14 categories** (`:where()`-scoped, gate-12 compliant); Shadow CSS + `-tw` helper verified token-only (no raw hex).
- **No new structural gaps** beyond A1/A2 + the previously-listed P1/P2 items. All findings are `safe-local` — see `FINDINGS/B13.md`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B13) against all source layers. Gaps A1 (no `expandedValuesChange`/CVA) + A2 (un-proxied methods) added; render-path parity + token scope verified; consumer count reconciled to 0. No deletion/promotion flags — component stays ACTIVE but UNADOPTED.
