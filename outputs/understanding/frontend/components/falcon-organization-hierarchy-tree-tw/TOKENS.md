# falcon-organization-hierarchy-tree-tw — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/organization-hierarchy.tokens.css` (**213 lines** — recount 2026-06-03). `:where()`-scoped → gate-12 compliant (specificity 0, NOT `:root`).

`[CODE]` ACTUAL selector union (lines 41-51 — re-read 2026-06-03; the prior dossier's union was incomplete):

```css
:where(
  falcon-organization-hierarchy,            /* historic Shadow variants */
  falcon-organization-hierarchy-tw,
  falcon-organization-hierarchy-tree,       /* canonical Shadow (does not ship) */
  falcon-organization-hierarchy-tree-tw,    /* THE live Stencil tag */
  falcon-angular-organization-hierarchy,
  falcon-angular-organization-hierarchy-tree,
  app-organization-hierarchy-tree,          /* ← the host-shell WRAPPER selector */
  .falcon-organization-hierarchy,
  [data-falcon-organization-hierarchy]
) { … }
```

**KEY FINDING:** the union deliberately includes `app-organization-hierarchy-tree` — the live host-shell wrapper around `<falcon-tree-panel>`. So this token file styles BOTH the un-rendered Stencil `-tw` tree AND the live `falcon-tree-panel`-based wrapper. The token contract is the genuinely-shared SoT; the two render implementations diverge but consume the SAME tokens. (Note also: `--falcon-tree-*` rail/node/indicator/chevron/label tokens are shared with `falcon-tree` / `falcon-tree-table` — `[CODE]` the `<style>` block + inline styles read them directly.)

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

- `[CODE]` Companion `<style>` block (`ORG_HIERARCHY_RAIL_STYLES`, tsx:69-227) injects literal CSS rules scoped to `[data-fohtree-render="tailwind"]`. `!important` used at tsx:156, 158, 165, 166 to override Tailwind utility specificity for menu-button bg/color/shadow. **P3 — review specificity.**
- `[CODE]` Every visual value in that `<style>` block + the inline `style={{…}}` objects reads from `--falcon-tree-*` / `--falcon-org-hierarchy-*` tokens — verified token-only; the only non-token literals are structural (`border-radius: 3px` on scrollbar thumb tsx:187, `objectFit: 'cover'`, the SVG geometry, and one fallback `var(--color-falcon-neutral-500, #6b7280)` on the empty-state tsx:939). No raw color hex driving the chrome.
- `[CODE]` `node.brand` is a DECLARED-BUT-UNUSED prop — the indicator renderer does NOT apply `client-logo bank-{x}` classes (correcting the prior dossier). So the "brand class leakage" risk is currently MOOT (no brand class is emitted), but the latent prop is a GAP.

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
| Disabled | row disabled state via `aria-disabled` + `--falcon-tree-node-disabled-opacity` |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B21) — token file recounted at 213 lines, `:where()` gate-12 scope confirmed, ACTUAL selector union re-read (includes `app-organization-hierarchy-tree` = the live wrapper, so the token contract is shared). Companion `<style>` block + inline styles verified token-driven; `!important` at tsx:156/158/165/166. RTL `[dir="rtl"]` rules confirmed (tsx:105-108, 213-218). Dark-mode bucket: NOT found (P2 gap stands).
