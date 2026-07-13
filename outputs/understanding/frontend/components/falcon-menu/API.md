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

## Reflected props (Stencil, both tags)
`[CODE]` falcon-menu.tsx:46-50 / falcon-menu-tw.tsx:45-49 — `open`, `popup`, `appendTo`, `disabled` are `@Prop({ reflect: true })`. `items` is a non-reflected array prop; `anchorEl` is a plain (non-`@Prop`) class field (HTMLElement is non-serializable — always set as a JS property via `showAt()` or directly).

## Stencil methods (on underlying element — both tags)
`[CODE]` falcon-menu.tsx:99-145 / falcon-menu-tw.tsx:91-129 — exactly: `openMenu()`, `closeMenu()`, `toggle()`, `showAt(el, event?)`, `hide()`. **There is NO `setFocus()` method** on either menu tag (CORRECTION 2026-06-03 — the prior dossier's "`setFocus()` — focuses trigger or active item" was fabricated; the menu focuses items internally via `focusActiveItem()`, a private method, never exposed). The wrapper proxies all five real methods (above).

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

## Top Layer promotion (wrapper-level, additive)
`[CODE]` falcon-menu.component.ts:69-83,253-338 — Phase C / Wave 6 (2026-05-21). The Stencil menu does NOT body-portal; its panel is rendered inline + `position:fixed` and carries `data-component="falcon-menu-panel"`. On `falcon-menu-open`, the wrapper (one rAF later) locates the panel (light-DOM `querySelector` first, then `shadowRoot`), sets `popover="auto"`, neutralizes the UA popover stylesheet (`right/bottom: auto !important; margin: 0 !important`), calls `showPopover()`, and registers it with `FalconStackingService`. On close it `hidePopover()` + unregisters. Feature-detected — non-supporting browsers keep the plain `position:fixed` presentation. This escapes the trigger's stacking context (e.g. a data-table row's `overflow:hidden`).

## Parts (Stencil Shadow only — `<falcon-menu>`)
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

> `[CODE]` **Shadow↔`-tw` parity (B13):** the Light `<falcon-menu-tw>` mirrors `<falcon-menu>` 1:1 in props/events/methods/keyboard/ARIA/positioning, sharing the SAME inline navigability helpers + `positionPanel()` viewport-fixed logic + the `data-component="falcon-menu-panel"` Top-Layer hook. **Divergences (B-dim):** (1) the `-tw` twin emits NO `part=` attributes (all parts above are Shadow-only); (2) `-tw` styles via `menu-tailwind-classes.ts`, Shadow via `falcon-menu.css`; (3) `-tw` seeds an initial off-screen `style={top/left: -9999px}` in anchor mode (Shadow uses the `.anchor-fixed` CSS class for the same flash-prevention). Token contract identical.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B13) against falcon-menu.component.ts (340 ln), .component.html (28 ln), falcon-menu.tsx (472 ln), falcon-menu-tw.tsx (430 ln), falcon-menu.types.ts. Drift corrected: **NO `setFocus()` Stencil method exists** (prior claim removed); documented the Top-Layer popover promotion + the `-tw` no-`part=` divergence; the 5 real `@Method`s (openMenu/closeMenu/toggle/showAt/hide) confirmed on BOTH tags + all proxied on the wrapper.
