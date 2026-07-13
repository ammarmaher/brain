# falcon-menu — TOKENS

## Token file
`libs/falcon-ui-tokens/src/components/menu.tokens.css` (**147 lines** — recount 2026-06-03).

10 categories (per the file header `[CODE]` menu.tokens.css:8-19): container, trigger, panel, list, item, item icon, separator, motion, disabled state, focus ring.

Token selector (specificity-0, gate-12 compliant — scoped, NOT `:root`):
```css
:where(falcon-menu, falcon-menu-tw, falcon-angular-menu, .falcon-menu, [data-falcon-menu])
```

`[CODE]` **PLUS two scoped action-menu override blocks** (`menu.tokens.css:141-146`) — NOT on `:root`, so still gate-12 fine:
```css
.falcon-data-table-row-action-menu,
.falcon-tree-action-menu {
  --falcon-menu-item-bg-hover:        var(--color-falcon-teal-700, #0d3f44);
  --falcon-menu-item-color-hover:     var(--color-falcon-neutral-0, #ffffff);
  --falcon-menu-item-icon-color-hover: var(--color-falcon-neutral-0, #ffffff);
}
```
These give the data-table row-action + tree action menus the "hover → teal bg, white label + icon" look. Applied via `rootClass="<class>"` on the `<falcon-angular-menu>`. **A file comment explicitly warns NOT to set these via inline Tailwind arbitrary props in `rootClass`** (`menu.tokens.css:134-139`) — the cascade has not been observed to land at runtime; this scoped block is the SSOT.

## gate-12 / portaled-token scope
`[CODE]` Although the menu panel can be promoted into the browser **Top Layer** (popover) by the wrapper, it does **NOT body-portal into `.falcon-overlay-container`** (the wrapper sets `popover` on the inline panel in place — falcon-menu.component.ts:300-321). So unlike the 4 portaled-popover token files (calendar/dropdown/multi-select/phone-field), the menu token file does **NOT** need a `.falcon-overlay-container` selector — the panel keeps the `:where(falcon-menu-tw, …)` cascade because it stays a descendant of the Stencil host even while in the Top Layer. ✅ Correctly scoped as-is.

## Related Falcon theme tokens

| Menu token | References |
|---|---|
| `--falcon-menu-panel-bg` | `var(--color-falcon-neutral-0)` |
| `--falcon-menu-panel-border-color` | `var(--color-falcon-neutral-200)` |
| `--falcon-menu-panel-shadow` | `0 8px 24px rgba(0, 0, 0, 0.08)` |
| `--falcon-menu-trigger-bg-hover` | `var(--color-falcon-neutral-100)` |
| `--falcon-menu-trigger-focus-ring-color` | `var(--color-falcon-teal-alpha-12)` |

## Tailwind utility guidance
- Trigger slot is fully consumer-controlled — apply Tailwind.
- Panel + item geometry come from tokens.
- Layout utilities on host (margin) work.

## Dark mode support
- Panel bg flips via neutral inversion.
- Shadow strengthens in dark.

## Density support
Via internal token defaults — no `size` prop yet (could be added).

## RTL support
- Menu list is symmetrical.
- External-anchor positioning uses `rect.right - panelWidth` to align right — under RTL pages this may want to flip to `rect.left + panelWidth`. Current source aligns to anchor's right edge always.

## Static style risks (B13 re-verify)
- `[CODE]` `falcon-menu.css` (194 ln, Shadow) is **token-only — VERIFIED clean 2026-06-03**: every visual value reads `--falcon-menu-*`; literals are structural (`display:flex`, `border:0`, `list-style:none`). No raw color hex (the only literal coordinate is `.anchor-fixed { top/inset-inline-start: -9999px }`, a flash-prevention offset).
- `[CODE]` `menu-tailwind-classes.ts` (consumed by `-tw`) emits only `*-[var(--falcon-menu-*)]` arbitrary-value utilities + structural utilities (`flex`, `group`, `list-none`). No hardcoded palette.
- `[CODE]` Panel `position:fixed` + `top`/`left` in anchor mode is set via inline `style` by `positionPanel()` (escape hatch — anchor coordinates aren't CSS-var-expressible). The `-tw` twin additionally seeds `style={top/left:-9999px}` to prevent a 1-frame flash. Acceptable.
- `[CODE]` The wrapper neutralizes the UA popover stylesheet with three `!important` inline writes on the panel during Top-Layer promotion (`right/bottom: auto`, `margin: 0`) — documented + physical-side-safe (LTR+RTL). Acceptable escape hatch.
- `[CODE]` The wrapper `.component.css` is `:host { display: inline-block }` only — no risk.

## Token usage cheat-sheet

| Concern | Token |
|---|---|
| Trigger height | `--falcon-menu-trigger-height: 32px` |
| Trigger padding | `--falcon-menu-trigger-padding-{x,y}` |
| Trigger bg hover | `--falcon-menu-trigger-bg-hover` |
| Trigger focus ring | `--falcon-menu-trigger-focus-ring-color/-width` |
| Panel bg | `--falcon-menu-panel-bg` |
| Panel border | `--falcon-menu-panel-border-*` |
| Panel radius | `--falcon-menu-panel-border-radius: 10px` |
| Panel shadow | `--falcon-menu-panel-shadow` |
| Panel min/max width | `--falcon-menu-panel-min-width: 180px`, `-max-width: 320px` |
| Panel max height | `--falcon-menu-panel-max-height: 320px` |
| Panel offset (host-anchor) | `--falcon-menu-panel-offset: 4px` |
| Panel z-index (non-Top-Layer fallback) | `--falcon-menu-panel-z-index: 1100` |
| Panel padding | `--falcon-menu-panel-padding-{y,x}` |
| Item padding, gap, font, colors | `--falcon-menu-item-*` (+ `-item-bg-hover`, `-item-color-hover`, `-item-icon-color-hover`) |
| Item focus ring | `--falcon-menu-item-focus-ring-{color,width}` (inset) |
| Separator | `--falcon-menu-separator-{border-width,border-style,border-color,margin-y}` |
| Motion | `--falcon-menu-transition-{duration,easing}` (NOT `--falcon-menu-motion-*` — corrected 2026-06-03) |

## Per-instance override
```css
.compact-action-menu {
  --falcon-menu-item-padding-y: 6px;
  --falcon-menu-panel-min-width: 140px;
  --falcon-menu-panel-max-height: 240px;
}
```
> For the "teal-hover / white-label" action-menu look, prefer the two PRE-DEFINED classes (`falcon-data-table-row-action-menu` / `falcon-tree-action-menu`) over re-deriving the three hover tokens — the file comment warns inline-Tailwind arbitrary-prop overrides of these tokens don't land at runtime.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B13) — token file recount 147 ln / 10 categories + 2 scoped action-menu blocks (gate-12 compliant; NOT `:root`); Shadow CSS + `-tw` helper verified token-only (no raw hex); motion-token cheat-sheet corrected (`--falcon-menu-transition-*`, not `-motion-*`); `z-index:1100` + panel-offset added; gate-12 portaled-scope note added (menu does NOT body-portal → no `.falcon-overlay-container` selector needed).
