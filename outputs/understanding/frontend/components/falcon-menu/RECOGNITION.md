# falcon-menu — Recognition Layer

> Cross-cutting layer. Purpose: given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-menu>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-menu.tsx:397-471` — a **floating action-list panel**:
- A **trigger** — usually a kebab/3-dot icon button, or any consumer-supplied content via `slot="trigger"` `[CODE]` `:440-457`. In external-anchor mode the built-in trigger is hidden entirely (`:431-432`).
- A **panel** — a small bordered card (`menu-tokens` default radius 10px, shadow `0 8px 24px rgba(0,0,0,0.08)`, min-width 180px / max-width 320px / max-height 320px `[CODE]` `TOKENS.md:52-56`) that floats over the page.
- A **vertical list** of items — each a left-aligned row with an optional leading icon (font-icon class OR `<img>` URL) and a label `[CODE]` `:374-392`.
- **Separators** — thin horizontal dividers carving the list into groups `[CODE]` `:329-339`.
- Items show **hover / active / disabled** states; the active item has a focus ring.
- No checkmarks, no nested-submenu arrows, no badges — `[CODE]` `API.md:112` the carve-out scope is flat lists only.

The fingerprint: *a click-to-open list of verbs floating near a trigger*. Two render modes — `popup=true` (trigger + floating panel) and `popup=false` (inline always-open list, `:420-428`).

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Menu>` + `<MenuItem>` (anchored via `anchorEl`) | direct 1:1 — MUI's `anchorEl` prop is the exact analogue of falcon-menu's `showAt(el)` / `anchorEl` |
| PrimeNG | `<p-menu>` / `Menu.toggle(event)` | direct 1:1 — `OVERVIEW.md:30` falcon-menu replaces `<p-menu>`; `showAt(el, event)` IS the `Menu.toggle(event)` parity |
| Ant Design | `<Dropdown>` with a `menu` items array | Ant `<Dropdown>` overlay menu — items-array driven |
| Bootstrap | `.dropdown-menu` / `.dropdown-item` | upgrade target — the Bootstrap dropdown action menu |
| shadcn / Radix | `<DropdownMenu>` (Radix DropdownMenu) | direct conceptual 1:1 — Radix DropdownMenu trigger + content + items |
| plain HTML | `<details>` / hand-rolled absolute-positioned `<ul>` | always replace — falcon-menu carries the keyboard model + outside-click + positioning |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a kebab/3-dot button that opens a list of actions | `<falcon-angular-menu>` | — |
| per-row action menus in a data table or tree | `<falcon-angular-menu>` + `showAt(rowEl, event)` (one shared instance) | one menu per row |
| an always-visible inline action list (no trigger) | `<falcon-angular-menu [popup]="false">` | — |
| a form control that picks one value into a model | `<falcon-angular-dropdown>` | menu |
| a free-text-plus-list input | `<falcon-angular-combobox>` | menu |
| navigation links (routerLink targets) | `<a routerLink>` nav | menu |
| a hover hint / explanatory text | `<falcon-angular-tooltip>` | menu |
| a nested / categorised action tree ("Export → CSV / PDF") | (no Falcon component yet — GAP) | menu (no submenus) |

## Composition recipe to reach parity
Customization order (per `[VAULT]` `feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → shared upgrade → wrapper → GAP.
1. **Inputs** — `[items]` (a `FalconMenuItem[]`, **property-bound, never `[attr.items]`** `[CODE]` `API.md:106`), `[popup]` (`true` trigger+panel / `false` inline), `[disabled]`, `[triggerLabel]` `[CODE]` `API.md:22-32`.
2. **Item shape** — each `FalconMenuItem`: `label`, `icon` (CSS class) or `iconUrl` (`<img>`, wins over `icon`), `disabled`, `separator` (divider), `command` callback, `data` (free payload), `styleClass` `[CODE]` `API.md:55-65`. Prefer per-item `command` callbacks over dispatching by index from `falconMenuItemSelect` (`USAGE.md:126`).
3. **Trigger slot** — project a custom trigger (kebab SVG, button) into `slot="trigger"` `[CODE]` `API.md:86-89`; for icon-only kebabs use the slot, not a raw `triggerLabel` string.
4. **External-anchor variant** — for table/tree row menus: declare ONE `<falcon-angular-menu>`, rebuild `items` per row click, call `menuRef.showAt(event.currentTarget, event)` `[CODE]` `USAGE.md:36-72` — the PrimeNG `Menu.toggle(event)` parity.
5. **Token override** — `rootClass="compact-menu"` + a CSS class declaring `--falcon-menu-*` tokens (item padding, panel min-width, max-height, motion) `[CODE]` `USAGE.md:93-103` + `TOKENS.md:62-68`.
6. **Render path** — `[useTailwind]=true` (default, Light DOM); `false` for Shadow-DOM isolation.
7. **GAP** — nested submenus, `appendTo="body"` portal mode, per-item badges / tooltips / shortcuts, and panel header/footer slots are NOT available `[CODE]` `GAPS_AND_UPGRADES.md:3-78`. `DECISION.md:118` names `appendTo="body"` the highest-leverage fix (clipping inside `overflow:hidden`). Raise an upgrade; do not hand-roll a submenu.

## Anti-patterns
- Binding `[attr.items]` — `[CODE]` `USAGE.md:106` the array stringifies; use property binding `[items]`.
- Building one menu instance per table row — `[CODE]` `USAGE.md:107` wastes DOM; use one shared menu + `showAt()`.
- Building nested submenus — `[CODE]` `USAGE.md:107` not supported (carve-out scope).
- Rendering multiple menus simultaneously — `[CODE]` `USAGE.md:108` they share the global Esc listener.
- Positioning the panel via inline style — `[CODE]` `USAGE.md:109` use `showAt()` for external anchors.
- Passing an `<a href>` as a menu item — `[CODE]` `USAGE.md:110` use a `command` callback + router navigate.
- Expecting `appendTo="body"` to work — `[CODE]` `USAGE.md:111` only `'host'` is implemented; menus inside `overflow:hidden` clip.
- Using `popup=false` for a popup, or `popup=true` for an inline list — `[CODE]` `USAGE.md:133` intent mismatch.
- Showing an action the operator may not perform — `[INFERRED]` gate the `items` array by PES / user-type / `availableActions[]` BEFORE binding (see `BUSINESS.md`).

## Verification
🟢 LANDED — menu is production-ready, composed inside `falcon-tree-panel` (`USAGE.md:135-140`). 🟡 CODE-DERIVED for the visual fingerprint + composition recipe from `falcon-menu.tsx` + `API.md`. Cross-library map is `[INFERRED]` from each library's documented menu/dropdown primitive.
