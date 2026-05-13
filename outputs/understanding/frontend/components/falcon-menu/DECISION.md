# falcon-menu — DECISION

## Brain SK final recommendation

### Use this component for
- Page-header kebab menus.
- Per-row action menus in data tables (via `showAt()`).
- Tree-node action menus (composed by `falcon-tree-panel`).
- Inline action lists (`popup=false`).
- Any pattern previously using `p-menu`.

### Avoid this component for
- Navigation (use `<a routerLink>`).
- Dropdown form-control selects (use `<falcon-angular-dropdown>`).
- Tooltips (use `<falcon-angular-tooltip>`).
- Nested submenus (NOT supported in current carve-out).

### Preferred render path
`useTailwind=true` (default).

### Required upgrades before wider use
**Tier 1 (high-leverage):**
1. Implement `appendTo="body"` portal mode — fixes overflow:hidden clipping.
2. Add submenu support if categorised actions are needed.
3. Use `<falcon-angular-icon>` for item icons.

**Tier 2:**
4. Add item badges, tooltips, shortcuts.
5. Add header / footer slots in panel.

### Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-angular-data-table` | Common consumer via `showAt()` external-anchor mode. |
| `falcon-angular-tree` / `falcon-tree-panel` | Composes menu for tree-row actions. |
| `falcon-angular-button` | Common trigger (project into `slot="trigger"`). |
| `falcon-angular-icon` | Should be used for item icons (today CSS class). |

### Exact rule for future implementation tasks
> Use `<falcon-angular-menu>` for action lists (Edit / Delete / Archive type rows). Pass `FalconMenuItem[]` with `label`, `icon` (CSS class), `command` callback, and optional `separator: true` for dividers. For per-row tables / trees, declare ONE menu in the template and call `menuRef.showAt(row.kebabElement, event)` per click — this is the PrimeNG `Menu.toggle(event)` parity. For inline action lists, use `[popup]="false"`. Avoid nested submenus until the upgrade lands. Be aware `appendTo="body"` is NOT implemented — for menus inside `overflow: hidden` containers, expect clipping until the upgrade.

### Status
**READY** for production with the noted constraints. The external-anchor pattern is one of the cleanest abstractions in the library.

---

## Dynamic capability assessment

### 1. What is static today?
- No submenus.
- `appendTo="body"` not implemented.
- Trigger button shape is fixed (or use `slot="trigger"`).
- Item icons are CSS class or img URL only.
- No badges / tooltips / shortcuts.
- Panel has no header / footer slots.
- Items are flat list (no grouping).

### 2. What is already dynamic through inputs/outputs?
- `items` (array, property-bound).
- `open`, `popup`, `appendTo`, `triggerLabel`, `disabled`.
- `anchorEl` (HTMLElement, property-pushed).
- Outputs: `falconMenuItemSelect`, `falconMenuOpen`, `falconMenuClose`.
- Methods: `showAt()`, `hide()`, `openMenu()`, `closeMenu()`, `toggle()`.

### 3. What is already dynamic through slots / ng-template?
- `slot="trigger"` — custom trigger content.

### 4. What is dynamic through token / theme overrides?
- Trigger geometry + colors.
- Panel surface (bg, border, radius, shadow, sizing).
- Item padding, gap, font, color per state.
- Separator styling.
- Motion duration / easing.
- Focus ring color.

### 5. What is dynamic through Tailwind classes?
- Inside trigger slot — full freedom.
- Not inside panel / items.

### 6. What is missing to make this component reusable across pages?
- Submenu support.
- `appendTo="body"` portal mode.
- Per-item badges / tooltips / shortcuts.
- Header / footer slots in panel.
- Icon component composition.
- Custom item template per row.

### 7. What capability should be added to the shared component instead of a one-off page hack?
All items 6.

### 8. What flags / options / templates / slots would make it better?
- `items[].items` for submenus.
- `appendTo="body"` portal.
- `<slot name="header">` / `<slot name="footer">` for panel header/footer.
- `<ng-template falconMenuItem>` for custom item rendering.
- Per-item `[badge]` / `[tooltip]` / `[shortcut]`.

### 9. What is the safest upgrade path?
1. `appendTo="body"` first (fixes the most common shipping bug).
2. Submenus via `items[].items` recursive (additive — current consumers unaffected).
3. Per-item annotations (badge, tooltip, shortcut) — additive.
4. Header/footer slots — additive.
5. Custom item template directive — additive.

### 10. What would be risky to change because other pages depend on it?
- **The `FalconMenuItem.command` callback contract** — pages depend on this.
- **The `data` payload round-tripping in events** — `falconMenuItemSelect` returns `item` (with `data`).
- **The `showAt(el, event)` signature** — used by data-table / tree composers.
- **Outside-click closes the menu** — flipping to "click-to-toggle only" would break expected behaviour.
- **Esc closes from anywhere when open** — removing would frustrate keyboard users.
- **`composedPath()` outside-click detection** — relies on the click bubbling out of Shadow DOM. Changing the wrapper to Light DOM only would break Shadow consumers.
