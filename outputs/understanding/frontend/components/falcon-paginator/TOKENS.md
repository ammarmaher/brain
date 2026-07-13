# falcon-paginator — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/paginator.tokens.css` (**109 lines** — recount 2026-06-03 / B09).

`[CODE]` paginator.tokens.css:25 — selector scope:

```css
:where(falcon-paginator, falcon-paginator-tw, falcon-angular-paginator, .falcon-paginator, [data-falcon-paginator]) { … }
```

`:where()` keeps specificity 0 so per-instance host-class overrides win. **gate-12 compliant** (scoped, NOT `:root`). All declarations are `var(--token, literalFallback)` form.

> `[CODE]` Spec source note (tokens header): paginator was NOT in the React V0.2 reference (inventory §26 had only a `.table-footer` with "n of m" + prev/next, no page numbers) — it is a clean build per the Falcon V0.2 token contract, borrowing the button per-state palette idiom.

## Token categories (14 declared)

`[CODE]` paginator.tokens.css:8-23 (header) + the declared blocks:

1. **CONTAINER** — `display`, `align`, `justify`, `gap` (4px), `info-gap` (12px), `padding` (0).
2. **PAGE BUTTON** — `bg` / `bg-hover` / `bg-active` / `bg-disabled`; `color` / `-hover` / `-active` / `-disabled`; `border-width/style/color` + `-hover` / `-active` / `-disabled`.
3. **PREV/NEXT BUTTON** (icon-only square) — `nav-bg` / `-bg-hover` / `-bg-disabled`; `nav-color` / `-hover` / `-disabled`; `nav-border-color`.
4. **ELLIPSIS** — `ellipsis-color`, `ellipsis-padding-x` (6px).
5. **SEPARATOR / gap aliases** — `spacing` (4px).
6. **PAGE INFO TEXT** — `info-color`, `info-font-size` (12px), `info-font-weight` (500).
7. **SIZING** — `button-size-{sm,md,lg}` (28/32/36px), `button-padding-x-{sm,md,lg}` (6/8/10px).
8. **TYPOGRAPHY** — `font-family`, `font-size-{sm,md,lg}` (11.5/12.5/13.5px), `font-weight` (500), `font-weight-active` (600).
9. **BORDER + RADIUS** — `button-radius` (6px).
10. **FOCUS RING** — `focus-ring-width` (3px), `focus-ring-color`.
11. **MOTION** — `transition-duration` (150ms), `transition-easing` (ease).
12. **ICON SIZE** — `icon-size` (14px, prev/next chevron).
13. **STATE — disabled** — `disabled-cursor` (not-allowed), `disabled-opacity` (0.5).
14. **RTL ALIAS** — `rtl-icon-rotate` (0deg; chevron flip handled by inline SVG in CSS scope).

## Related Falcon theme tokens (actually referenced)

`[CODE]` The token file references ONLY these theme vars (the prior dossier listed `--radius-xs` / `--falcon-size-icon-*` / `--ease-falcon-out` — **none of those appear in the file**; corrected below):

| Falcon theme token | Used by paginator via |
|---|---|
| `--color-falcon-neutral-0 / 100 / 200 / 400 / 475 / 500 / 700 / 900` | Page/nav bg, text, borders, ellipsis, info. |
| `--color-falcon-teal-500` | Page active bg + hover color + active border (`#124c52`). |
| `--color-falcon-teal-alpha-12` | Focus ring color. |
| `--falcon-font-family` | Paginator font family. |

> All sizing/radius/motion values are **literal numbers** baked into the component tokens (e.g. `button-radius: 6px`, `button-size-md: 32px`) — they do NOT alias `--falcon-radius-*` / `--falcon-density-*`. (Minor: this means density presets do not ripple through the paginator — size is the only sizing axis. `safe-local`.)

## Tailwind utility guidance for this component

`[CODE]` `<falcon-paginator-tw>` consumes the helpers in `paginator-tailwind-classes.ts` (146 ln) for the root / page button / nav button / ellipsis / icon / info regions — all reading `--falcon-paginator-*`. **Cross-component coupling:** the PR-3 regions (current-page report, jump input, rows-per-page wrapper/select, center cluster) use `falconTablePaginator*Classes()` from `table-tailwind-classes.ts` instead of paginator-scoped helpers (`[CODE]` falcon-paginator-tw.tsx:34-40). So the report/jump/RPP visuals are governed by **table** tokens, not paginator tokens — a token-ownership split worth noting. `safe-local`.

## Dark mode support

`[CODE]` No component-level dark override in `paginator.tokens.css`. Inherits the master theme's neutral/teal flips. `[INFERRED]` — not verified end-to-end (flag for theme agent).

## Density support

`[CODE]` No explicit density variants — `size: 'sm' | 'md' | 'lg'` is the only sizing axis (drives `button-size-*` + `font-size-*` + `button-padding-x-*`). The tokens are literal px, not density aliases.

## RTL support

`[CODE]` Token category 14 (`rtl-icon-rotate`) + the inline chevron SVGs. The Tailwind helpers use logical properties (`ms-`/`px-`) so spacing mirrors. Chevron direction in RTL is `[INFERRED]` (flag for theme agent).

## Static style risks

- `[CODE]` Chevron SVG `stroke-width="1.6"` is a hardcoded presentation **attribute** (not a CSS value). Acceptable.
- `[CODE]` falcon-paginator-tw.tsx:391-397 — when NOT using a `paginatorTemplate`, the non-template regions are wrapped in a `falconTablePaginatorCenterClusterClasses()` `<span>` (a table-helper). This center-cluster wrapper exists ONLY on the `-tw` twin, not the Shadow tag → a layout-structure divergence between paths (see GAPS). `safe-local`.
- `[CODE]` The native `<input type="number">` (jump) + `<select>` (rows-per-page) are styled via table helpers in `-tw` and via `falcon-paginator-jump-input` / `falcon-paginator-rpp-select` classes in Shadow CSS — i.e. native primitives, not Falcon atoms (FP-03 deferral).
- `[CODE]` falcon-paginator.component.css is `:host { display:block }` only — no risk.

## No CSS / no SCSS guidance

- Tailwind utilities only; visual values via `--falcon-paginator-*` (and, for the PR-3 regions in `-tw`, the table tokens) — never hardcode hex/px.
- Consumer per-instance overrides MUST mutate `--falcon-paginator-*` via a host marker class.

## Token usage by state

| Aspect | Token(s) |
|---|---|
| Page border | `--falcon-paginator-page-border-{width,style,color,color-hover,color-active,color-disabled}` |
| Page radius | `--falcon-paginator-button-radius` (6px) |
| Page bg | `--falcon-paginator-page-bg` / `-bg-hover` / `-bg-active` / `-bg-disabled` |
| Page color | `--falcon-paginator-page-color` / `-hover` / `-active` / `-disabled` |
| Nav button | `--falcon-paginator-nav-bg{,-hover,-disabled}` / `-color{,-hover,-disabled}` / `-border-color` |
| Sizing | `--falcon-paginator-button-size-{sm,md,lg}` + `-button-padding-x-{sm,md,lg}` |
| Typography | `--falcon-paginator-font-{family,size-sm,size-md,size-lg,weight,weight-active}` |
| Focus | `--falcon-paginator-focus-ring-{width,color}` (3px ring) |
| Disabled | `--falcon-paginator-page-color-disabled`, `-nav-color-disabled`, `-disabled-cursor`, `-disabled-opacity` (0.5) |
| Ellipsis | `--falcon-paginator-ellipsis-{color,padding-x}` |
| Info text | `--falcon-paginator-info-{color,font-size,font-weight,gap}` |
| Icon | `--falcon-paginator-icon-size` (14px) |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B09) — token file recounted at 109 lines, 14 categories confirmed against the header + declared blocks, `:where()` gate-12 scope confirmed. **Corrected** the prior theme-token table (removed `--radius-xs` / `--falcon-size-icon-*` / `--ease-falcon-out` / `--text-xs` which are NOT referenced; the file uses literal px + only the 4 theme vars listed). Flagged the `-tw` PR-3-regions-use-table-tokens coupling + the `-tw`-only center-cluster wrapper as `safe-local`.
