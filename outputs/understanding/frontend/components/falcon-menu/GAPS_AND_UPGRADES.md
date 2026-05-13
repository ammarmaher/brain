# falcon-menu — GAPS AND UPGRADES

## Missing capabilities

### P1 — No sub-menu / nested menu support
The carve-out explicitly excludes submenus (per types file comment). For complex action lists with categories ("Export → CSV / PDF / Excel"), no built-in support.

**Proposed:** `items?: FalconMenuItem[]` field on `FalconMenuItem` for child items.

**Priority: P1** for ANY consumer needing categorised actions.

### P1 — `appendTo="body"` not implemented
The type allows it; the implementation only handles `'host'`. For tree-deep menus where the parent has `overflow: hidden`, the menu gets clipped today.

**Proposed:** implement body-portal mode using a `position: fixed` panel + portal mount to `document.body`.

**Priority: P1**

### P1 — No `<falcon-angular-icon>` composition for item icons
Items use `<i class="...">` (CSS class) or `<img src="...">` (URL). For consistency with the rest of the platform, support `iconName` field that renders `<falcon-angular-icon>`.

**Priority: P1**

### P2 — No badges on items
Common UX: "Drafts (3)" — badge count next to label. Today consumers embed count in the label string.

**Proposed:** `FalconMenuItem.badge?: { value: string; severity?: FalconBadgeSeverity }`.

**Priority: P2**

### P2 — No tooltips on items
Useful for icon-only items. Today consumers wrap each item externally.

**Priority: P2**

### P2 — No keyboard shortcut hint per item
Common pattern: "Edit ⌘E". Today the consumer embeds the shortcut in the label string.

**Priority: P2**

### P2 — No virtualisation for very long menus
For >100 items, render is O(N). Not currently needed but worth tracking.

### P3 — No header / footer slots in panel
For a "Settings" header above the list, or a "Manage…" link below — no slots today.

**Priority: P3**

## Missing ng-template / template slots
- No `<ng-template falconMenuItem="value">` directive for custom item rendering. The `command` callback handles the click, but visual customisation per-item (badges, sub-labels, dividers with text) requires source changes.

## Missing flags / options / states
- `submenuOn` / nested items.
- `placement` (start / end / top / bottom variants beyond `appendTo`).
- `[loading]` for async-populated menus.

## Missing accessibility features
- No `aria-activedescendant` pattern — uses roving `tabIndex` (acceptable per WAI-ARIA APG, but `aria-activedescendant` is the alternative).
- No `aria-keyshortcuts` per item.
- `aria-haspopup="menu"` is correct, but there's no `aria-controls` linkage when in external-anchor mode (the anchor is not the trigger).

## Missing tests
- No `.spec.ts`.
- No e2e for `showAt()` external-anchor behaviour.
- No test for outside-click closure with composedPath().

## Missing Tailwind / token parity
- Light + Shadow renderers should be parity-audited.

## Performance risks
- Outside-click `mousedown` listener is global — fires on every mousedown when menu is open. Acceptable.
- Position recalculation on every `showAt()` — O(1).
- `composedPath()` is fast enough for typical depths.

## Visual / interaction risks
- The menu panel uses `position: fixed` in anchor mode — won't scroll with the page. Closing on scroll outside is not implemented; for long lists this could float oddly.
- Hover sets active index AND mouse-enter changes active row — for keyboard users mixing mouse and keyboard, focus can jump unexpectedly.

## Reusable upgrades needed
1. **Submenu support** (P1).
2. **`appendTo="body"` portal mode** (P1).
3. **`<falcon-angular-icon>` composition** (P1).
4. **Item badges + tooltips + shortcuts** (P2).

## Priority: page-level vs shared
All belong in the shared component. Per-page submenu hacks would multiply.

## Recommended upgrade API (proposed)

```ts
// FalconMenuItem additions
export interface FalconMenuItem {
  label: string;
  icon?: string;
  iconUrl?: string;
  iconName?: string;        // new — falcon-angular-icon
  disabled?: boolean;
  separator?: boolean;
  command?: (event: { item: FalconMenuItem; domEvent: Event }) => void;
  data?: unknown;
  styleClass?: string;
  badge?: { value: string; severity?: FalconBadgeSeverity };       // new
  tooltip?: string;                                                  // new
  shortcut?: string;                                                 // new — e.g. "⌘E"
  items?: FalconMenuItem[];                                          // new — submenu
}

// FalconAngularMenuComponent additions
@Input() appendTo: 'host' | 'body' = 'host';   // now genuinely supports 'body'
@Input() scrollDismiss = true;                  // close on outside scroll

// Stencil slot additions
//   <slot name="header">  panel header (above list)
//   <slot name="footer">  panel footer (below list)
```

## Future-proof recommendation
**`appendTo="body"` is the highest-leverage fix.** Without it, any data-table or tree with `overflow: hidden` clips the menu — a common shipping bug. Land this before broader adoption.
