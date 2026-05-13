# falcon-menu — API

## Angular selector
`falcon-angular-menu`

## Stencil tags
- Shadow: `<falcon-menu>`
- Light: `<falcon-menu-tw>`

## Import path
```ts
import {
  FalconAngularMenuComponent,
  type FalconMenuItem,
  type FalconMenuItemSelectDetail,
  type FalconMenuToggleDetail,
} from '@falcon/ui-core/angular';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `items` | `FalconMenuItem[] \| null \| undefined` | `[]` | Pushed imperatively onto the live Stencil element (not via `[attr.items]` — would stringify). |
| `open` | `boolean` | `false` | Controlled visibility. |
| `popup` | `boolean` | `true` | `true` = trigger button + panel. `false` = inline panel (always open). |
| `appendTo` | `'host' \| 'body'` | `'host'` | Currently only `host` is implemented. |
| `triggerLabel` | `string \| undefined` | — | Default trigger button text when no `slot="trigger"` content. |
| `disabled` | `boolean` | `false` | Disable trigger + menu. |
| `anchorEl` | `HTMLElement \| undefined` | — | External anchor for `showAt()`. Pushed as JS property, not attribute. |
| `useTailwind` | `boolean` | `true` | Render-path switch. |
| `rootClass` | `string` | `''` | Caller-supplied class. |

## Outputs

| Name | Payload |
|---|---|
| `falconMenuItemSelect` | `FalconMenuItemSelectDetail { item, index }` |
| `falconMenuOpen` | `FalconMenuToggleDetail { reason: 'trigger' \| 'item-select' \| 'outside-click' \| 'escape' \| 'programmatic' }` |
| `falconMenuClose` | `FalconMenuToggleDetail` (same reason union) |

## Methods (on wrapper, proxied to Stencil)

| Method | Purpose |
|---|---|
| `showAt(el: HTMLElement, event?: Event): Promise<void>` | Open at external anchor. Re-calling with same anchor toggles closed. |
| `hide(): Promise<void>` | Programmatically close. |
| `openMenu(): Promise<void>` | Programmatically open. |
| `closeMenu(): Promise<void>` | Same as `hide()`. |
| `toggle(): Promise<void>` | Programmatically toggle. |

## TypeScript types

```ts
export interface FalconMenuItem {
  label: string;
  icon?: string;       // CSS class for font-icon
  iconUrl?: string;    // <img> URL — wins over icon when both set
  disabled?: boolean;
  separator?: boolean; // render as divider; label/icon ignored
  command?: (event: { item: FalconMenuItem; domEvent: Event }) => void;
  data?: unknown;      // free-form payload
  styleClass?: string; // additional CSS class on the rendered item
}

export type FalconMenuAppendTo = 'host' | 'body';

export interface FalconMenuItemSelectDetail {
  readonly item: FalconMenuItem;
  readonly index: number;
}

export interface FalconMenuToggleDetail {
  readonly reason: 'trigger' | 'item-select' | 'outside-click' | 'escape' | 'programmatic';
}
```

## Reflected props (Stencil)
`open`, `popup`, `appendTo`, `disabled`.

## Stencil methods (on underlying element)
Same as wrapper's proxied methods above, plus:
- `setFocus()` — focuses trigger or active item.

## Slots

| Slot name | Purpose |
|---|---|
| `trigger` | Custom trigger content (kebab icon, button, etc.). When unset, renders `triggerLabel` text. |

## CVA support
Not applicable.

## Signal compatibility
- Wrapper uses classic `@Input()` decorators.
- `items` is pushed onto the live Stencil element via the setter — not via `[attr.items]` (would stringify the array).
- `anchorEl` is pushed as a JS property (HTMLElement isn't serializable to an attribute).
- `syncProps()` awaits `componentOnReady()` before pushing — handles hydration race.

## Supported modes
- `popup=true` (default) — inline trigger button + panel.
- `popup=false` — inline panel (always open).
- **External-anchor mode** — `popup=true` + `showAt(el)`. The trigger button is HIDDEN (`!hasAnchor` guard), panel positions as `position: fixed` relative to `el`. Re-calling `showAt(sameEl)` toggles closed. Re-calling with different anchor repositions.

## Important constraints
- **`items` MUST be pushed as property**, not attribute. The wrapper handles this via the setter. Consumers binding `[items]="..."` benefit automatically.
- **`anchorEl` is pushed as property**, not attribute.
- **External-anchor mode requires `popup=true`** — `popup=false` is inline, no external positioning.
- **Outside-click closes menu** — `composedPath()` pierces Shadow DOM. The anchor element is treated as inside (so re-clicking the same row trigger toggles, doesn't double-fire close-open).
- **No nested submenus.** The carve-out scope (registry note): "no submenus, no tooltips, no badges."
- **`command` callbacks throw catches** — if a consumer's command throws, the menu still closes (line 237-241 of `falcon-menu.tsx`).
- **Esc closes from anywhere** — global keydown listener while `open` and `popup` is true.

## Accessibility attributes
- Trigger: `<button>` with `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`, `aria-disabled`.
- List: `<ul role="menu">` with `aria-orientation="vertical"`.
- Items: `<button role="menuitem">` with `aria-disabled`, `tabIndex={isActive ? 0 : -1}` (roving tabindex).
- Separators: `<li role="separator" aria-orientation="horizontal">`.
- `aria-labelledby` on the list points to the trigger id (popup mode only).

## Parts (Stencil Shadow)
| Part | Element |
|---|---|
| `base` | Outer container. |
| `trigger` | Trigger button. |
| `panel` | Popup panel. |
| `list` | `<ul>` list. |
| `item-wrap` | `<li>` wrapper. |
| `item` | `<button>` menu item. |
| `item-icon` | Icon span. |
| `item-label` | Label span. |
| `separator` | Divider. |
