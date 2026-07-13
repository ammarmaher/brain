# falcon-drawer — TOKENS

## Component token file
`libs/falcon-ui-tokens/src/components/drawer.tokens.css` (**114 lines** — recount 2026-06-03).

`[CODE]` Token selector (gate-12 compliant — `:where()`, not `:root`):
```css
:where(falcon-drawer, falcon-drawer-tw, falcon-angular-drawer, .falcon-drawer, [data-falcon-drawer])
```
Both render paths consume the same tokens; the `-tw` Tailwind helper reads them via arbitrary-value utilities (`drawer-tailwind-classes.ts`).

## Token categories (12 declared)
1. CONTAINER — `--falcon-drawer-display: contents`.
2. OVERLAY — `bg` (`var(--color-falcon-teal-alpha-18, rgba(13,63,68,0.18))`), `blur` (4px), `opacity`. **Neutralised on the migrated wrapper** (`[CODE]` falcon-drawer.component.css:39-40 sets bg transparent + blur 0) so the native `::backdrop` (`rgba(13,63,68,0.18)`, blur 4px, `[CODE]` falcon-drawer.component.css:59-64) supplies dim+blur.
3. PANEL (base) — `bg`, `color`, `border-{width,style,color}`, `shadow` (`0 24px 60px rgba(0,0,0,0.18)`).
4. PANEL per-position radius — `border-radius-{right `18px 0 0 18px`, left `0 18px 18px 0`, top `0 0 18px 18px`, bottom `18px 18px 0 0`}`.
5. SIDE WIDTHS (right/left) — `side-width-{sm 320, md 480, lg 640, xl 800}`.
6. EDGE HEIGHTS (top/bottom) — `edge-height-{sm 240, md 360, lg 480, xl 640}`.
7. HEADER — `padding-block (16px)/-inline (24px)`, `border-bottom-{width 1px, color}`, `gap (12px)`.
8. TITLE — `font-family/-size (18px)/-weight (600)/color/line-height`.
9. CLOSE BUTTON — `size (32px)`, `icon-size (16px)`, `color`, `color-hover`, `bg (transparent)`, `bg-hover`, `border-radius (8px)`.
10. BODY — `padding-block (20px)/-inline (24px)`, `color`, `font-size (14px)`, `line-height`.
11. FOCUS RING — `color` (`var(--color-falcon-teal-alpha-12)`), `width (3px)`.
12. Z-INDEX — `--falcon-drawer-z-index: 99999`. **Fallback-only post-migration** — see below.

## Z-index is fallback-only (Top Layer migration)
`[CODE]` drawer.tokens.css:97-113 — `--falcon-drawer-z-index: 99999` carries a `@deprecated — Wave 8 (Phase D, 2026-05-21) — top-layer-migration` note: the native `<dialog>.showModal()` wrapper (Phase B / Wave 5.1) promotes the drawer into the **browser Top Layer** (above ALL z-index stacking), so this token is **irrelevant at runtime** for the migrated wrapper. It stays alive only for the un-migrated Stencil shadow-DOM cores (`falcon-drawer.css:20,64`, `drawer-tailwind-classes.ts:21,51`). Body-portaled popovers (dropdowns/calendars opened from inside a drawer) sit at `--falcon-overlay-z-index: 100000` (`overlay.tokens.css:79`) so they float above; notification toasts at 100001. **NEW CODE MUST NOT depend on this for stacking** (`[CODE]` overlay.tokens.css ESLint guard).

## Related Falcon theme tokens

| Drawer token | References |
|---|---|
| `--falcon-drawer-overlay-bg` | `var(--color-falcon-teal-alpha-18, rgba(13, 63, 68, 0.18))` |
| `--falcon-drawer-panel-bg` | `var(--color-falcon-neutral-0, #ffffff)` |
| `--falcon-drawer-panel-color` | `var(--color-falcon-neutral-900, #1a1a1a)` |
| `--falcon-drawer-focus-ring-color` | `var(--color-falcon-teal-alpha-12, rgba(13,63,68,0.12))` |
| `--falcon-drawer-title-font-family` | `var(--falcon-font-family)` |

## Tailwind utility guidance
- Don't touch panel layout via host utilities — width/position is token-driven per `position` + `size`.
- Apply padding utilities INSIDE the body slot (`<div class="p-6">`), not on the drawer host.

## Dark mode support
- Surface tokens inherit dark via `--color-falcon-neutral-0` flip → panel bg becomes dark automatically.
- Overlay teal-alpha is mode-aware via the teal-alpha token system.
- Shadow strengthens in dark via the theme override. Geometry unchanged.

## Density support
Via the `size` prop. Sides (right/left): width sm 320 / md 480 / lg 640 / xl 800 px. Edges (top/bottom): height sm 240 / md 360 / lg 480 / xl 640 px.

## RTL support
- `position="right"`/`"left"` are **physical**, not logical — the panel does NOT swap edges under RTL by default.
- `[CODE]` BUT the Stencil `.falcon-drawer-overlay[data-position='right']` uses `justify-content: flex-end` (and `'left'` → `flex-start`); the wrapper comment (`falcon-drawer.component.css:28-33`) states these "map to the start/end edges automatically because the consumer sets `dir` on the document" — so once the page direction is set the panel positions itself accordingly without wrapper-level direction logic.
- Per-position border-radius (`--falcon-drawer-panel-border-radius-right` etc.) is physical — for true RTL mirroring, override the per-position radius.
- `[BRAIN-OUT]` Prior dossier's "prefer `position='end'`/`'start'` semantics — NOT yet supported" still holds.

## Static style risks
- `[CODE]` falcon-drawer.component.css:59-64 — the native `::backdrop` uses **literal** `rgba(13,63,68,0.18)` + `blur(4px)` (a deliberate Top-Layer-cascade override; the comment says it mirrors the drawer overlay token). Acceptable but a literal, not a token reference (DRIFT-BACKDROP-LITERAL — `safe-local`). Reduced-motion is honoured (`falcon-drawer.component.css:71-75` disables the `::backdrop` animation under `prefers-reduced-motion: reduce`).
- `[CODE]` `drawer-tailwind-classes.ts` `falconDrawerPanelStyle` writes inline `transform` style for the slide (token-referencing — acceptable hook).
- Panel shadow is a fixed `0 24px 60px rgba(0,0,0,0.18)` value (no per-mode reference) — acceptable.

## No CSS / no SCSS guidance
- Token file is the SSOT. The drawer's Angular wrapper `.component.css` holds ONLY the native-`<dialog>` reset + `::backdrop` (not consumer-overridable styling).
- Consumer per-instance overrides mutate `--falcon-drawer-*` via a host class. Never hardcode hex/px.

## Token usage cheat-sheet

| Concern | Token |
|---|---|
| Panel bg / color / shadow | `--falcon-drawer-panel-bg`, `-panel-color`, `-panel-shadow` |
| Side width sm/md/lg/xl | `--falcon-drawer-side-width-{sm,md,lg,xl}` |
| Edge height sm/md/lg/xl | `--falcon-drawer-edge-height-{sm,md,lg,xl}` |
| Per-position radius | `--falcon-drawer-panel-border-radius-{right,left,top,bottom}` |
| Overlay (neutralised; native `::backdrop` wins) | `--falcon-drawer-overlay-bg`, `-overlay-blur`, `-overlay-opacity` |
| Header / title | `--falcon-drawer-header-*`, `-title-*` |
| Close × | `--falcon-drawer-close-{size,icon-size,color,color-hover,bg,bg-hover,border-radius}` |
| Body padding | `--falcon-drawer-body-padding-block`, `-body-padding-inline` |
| Focus ring | `--falcon-drawer-focus-ring-color`, `-focus-ring-width` |
| Motion | `--falcon-drawer-transition-duration (220ms)`, `-transition-easing` |
| Z-index (fallback only) | `--falcon-drawer-z-index (99999)` |

## Per-instance override
```css
.add-user-drawer {
  --falcon-drawer-side-width-md: 560px;
  --falcon-drawer-panel-border-radius-right: 24px 0 0 24px;
  --falcon-drawer-panel-shadow: 0 30px 80px rgba(13,63,68,0.18);
}
```

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B14) — token file recounted at 114 lines, 12 categories confirmed; z-index demoted to fallback (Top-Layer `@deprecated` note quoted); native `::backdrop` literal + reduced-motion handling flagged; RTL `justify-content` flip behaviour confirmed from the wrapper CSS comment.
