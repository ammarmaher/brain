# falcon-organization-hierarchy-tree-tw — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/organization-hierarchy.tokens.css` (200+ lines).

Selector union (per source file):

```
:where(falcon-organization-hierarchy, falcon-organization-hierarchy-tw,
       falcon-angular-organization-hierarchy, .falcon-organization-hierarchy,
       [data-falcon-organization-hierarchy]) { … }
```

Note — selector union references `falcon-organization-hierarchy` (Shadow) and `falcon-organization-hierarchy-tw` (Light) — but only the Light variant ships today. Tokens are forward-prepared for the Shadow variant when it arrives (FOHT-01).

## Token categories (from source comment)

- **A. PANEL** — outer card surface (`--falcon-org-hierarchy-panel-{bg, border-width, border-style, border-color, border-radius, min-height}`)
- **Font** — `--falcon-org-hierarchy-font-family: var(--font-display)`
- **B. ROOT HEADER** — `--falcon-org-hierarchy-root-{padding-y, padding-x, gap, bg, bg-selected, border-bottom-*, icon-size}`
- **C. ROW** — per-state row bg, padding, hover bg, selected bg (delegates to `--falcon-tree-node-bg-selected`)
- **D. CHEVRON** — size, rotation transitions
- **E. ICON / INITIALS / LOGO BUBBLE** — size, radius, bg per brand
- **F. NAME LABEL** — font-size, weight, line-height, clamp width reserve
- **G. MENU BUTTON (sticky reveal)** — inset-end, bg, bg-hover, bg-open, color, color-hover, color-open, shadow, transition-duration
- **H. ROOT MENU BUTTON** — always-visible variant of the sticky button (always opacity 1)
- **I. CTX MENU (floating)** — bg, border, radius, shadow, padding, item-padding, item-bg-hover, item-icon-color, item-highlighted-bg, item-disabled-color, animation-duration
- **J. RAILS (depth connectors)** — `--falcon-tree-rail-*` (shared with `falcon-tree` / `falcon-tree-table`)
- **K. SECTION LABEL** — between root header and child list
- **L. SCROLLBAR** — webkit-scrollbar size + thumb colors

## React → Falcon token mapping (per source comment)

```
React              Workspace SSOT                   Hex
─────────────────  ──────────────────────────────   ───────
--teal             --color-falcon-teal-700          #0d3f44
--teal-light       --color-falcon-teal-100          #e8f0f1
--teal hover bg    --color-falcon-teal-600          #104c54
--text             --color-falcon-neutral-900       #1a1a1a
--text-muted       --color-falcon-neutral-600       #6b7280
--border           --color-falcon-neutral-200       #e5e7eb
--border-2         --color-falcon-neutral-150       #eef0f2
--bg-hover         --color-falcon-neutral-50        #f5f7f8
panel bg #F3F8F5   --color-falcon-green-50          #F3F8F5
panel rail color   --color-falcon-teal-700 @ 18%    rgba(13,63,68,0.18)
font (Poppins)     --font-display                   Poppins, Inter…
```

## Related Falcon theme tokens

- `--font-display` family (Poppins/Inter)
- Color palette + brand teal
- Shadow tokens for ctx menu + sticky menu button

## Tailwind utility guidance

- Tailwind utilities are **inline in the Stencil source** (`.tsx`) — no `tailwind-classes.ts` helper file.
- The companion `<style>` block inside the `.tsx` source uses `[data-fohtree-render="tailwind"]` selectors to scope additional rules that Tailwind utilities cannot express (rail SVG geometry, ctx menu animation, sticky menu button reveal).
- Per-instance customisation via token override on a host class.

## Dark mode

Verify the `organization-hierarchy.tokens.css` file for a `:where(.app-dark, .app-dark *)` block. If absent, **P2 — add dark-mode bucket overrides.**

## Density

No `density` variant — fixed sizing per React V0.2 reference.

## RTL

- Companion `<style>` block has `[dir="rtl"]` rules for elbow rail flipping and chevron rotation (verified in source lines 105-107, 203-207).
- `inset-inline-end` for sticky menu button — RTL-safe.

## Static style risks

- Companion `<style>` block injects literal CSS rules. `!important` used at lines 151, 155, 156 (verified). **P3 — review specificity.**
- Brand class names `client-logo bank-{x}` depend on consumer CSS. **GAP.**
- Hex / px values used inside the `linear-gradient` rail definitions — these read from tokens (`--falcon-tree-rail-line-width`, `--falcon-tree-rail-color`) which is correct.

## Token usage by aspect

| Aspect | Token |
|---|---|
| Border | panel border tokens |
| Radius | `--falcon-org-hierarchy-panel-border-radius` (14px) |
| Shadow | ctx menu shadow, sticky menu button shadow |
| Spacing | root padding, row padding, gap, indent step |
| Color | per-row + per-state surface and text colors |
| Hover | row bg-hover, menu button bg-hover, rail color-active |
| Focus | tree focus ring inheritance |
| Disabled | row disabled state via `aria-disabled` |
