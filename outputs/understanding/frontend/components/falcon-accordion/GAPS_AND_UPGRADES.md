# falcon-accordion — GAPS AND UPGRADES

## Missing capabilities

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
- Light + Shadow renderers both exist; parity not deeply audited but follows the same dual-render pattern.

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
