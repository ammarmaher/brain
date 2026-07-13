# falcon-insufficient-balance-dialog — TOKENS

## Component token file
`libs/falcon-ui-tokens/src/components/insufficient-balance-dialog.tokens.css` (**187 lines** — counted 2026-06-03). Imported into `libs/falcon-ui-tokens/src/index.css` (component-layer, bottom).

`[CODE]` Selector chain (gate-12 compliant — `:where()`, specificity 0, NOT `:root`):
```css
:where(falcon-insufficient-balance-dialog, falcon-insufficient-balance-dialog-tw,
       falcon-angular-insufficient-balance-dialog, .falcon-insufficient-balance-dialog,
       [data-falcon-insufficient-balance-dialog]) { … }
```

## Token categories

### Backdrop + panel chrome
| Token | Default |
|---|---|
| `--falcon-ib-dialog-backdrop-bg` | `rgba(15, 23, 42, 0.42)` |
| `--falcon-ib-dialog-backdrop-z` | **`99999`** (CORRECTED — was documented as `1000`; live value matches `--falcon-dialog-z-index` per the 2026-05-20 rev-3 ladder; insufficient-balance-dialog.tokens.css:55) |
| `--falcon-ib-dialog-panel-bg` | `--color-falcon-neutral-0` |
| `--falcon-ib-dialog-panel-radius` | `16px` |
| `--falcon-ib-dialog-panel-padding-block` / `-inline` | `28px` |
| `--falcon-ib-dialog-panel-max-width` | `480px` |
| `--falcon-ib-dialog-panel-shadow` | `0 25px 50px -12px rgba(0,0,0,0.25)` |

### Glossy mode (toggled by `[show-glossy="true"]`)
| Token | Default |
|---|---|
| `--falcon-ib-dialog-glossy-backdrop-filter` | `blur(8px) saturate(1.4)` |
| `--falcon-ib-dialog-glossy-panel-filter` | `saturate(1.05)` |

### Icon · Header text · List card · Row pill · Reorder buttons · Info pill · Error banner · Footer buttons
`[CODE]` Full per-area token sets (unchanged 2026-06-03): icon (`-icon-size 56px`, `-icon-color` = `--falcon-status-danger`, `-icon-color-neutral`, `-icon-bg`, `-icon-bg-size 72px`), header (`-title-*` 18px/700/1.3, `-subtitle-*` 13px/1.5), list card (`-list-bg`, `-list-border`, `-list-radius 12px`), **row pill dimensions** (Wave 15 user-requested surface: `-row-height 42px`, `-row-min-width 280px`, `-row-gap`, `-row-padding-*`, `-row-radius 8px`, `-row-bg`, `-row-border`, `-row-hover-border` teal-500, `-row-dragging-opacity 0.55`, `-row-rank-*`, `-row-label-*`, `-row-grip-*`, `-row-controls-gap`), reorder buttons (`-btn-size 22px`, `-btn-radius 50%`, `-btn-bg`/`-fg`, `-btn-bg-hover` teal, `-btn-disabled-opacity 0.4`), info pill (teal-50/teal-700 family), error banner (red family), footer buttons (`-footer-btn-confirm-bg` teal-700, `-footer-btn-cancel-*`, `-footer-btn-disabled-opacity 0.55`).

## Token vs render-path application (IMPORTANT — refresh finding)

`[CODE]` The Shadow `.css` consumes the `--falcon-ib-dialog-*` tokens cleanly. **BUT the `-tw` (default) twin reads several visuals as RAW `var(--color-falcon-*)` palette refs, NOT `--falcon-ib-dialog-*` tokens** (falcon-insufficient-balance-dialog-tw.tsx:202,359 — e.g. error banner `bg-[var(--color-falcon-red-50,#fef5f5)]`, drag-over border `border-[var(--color-falcon-teal-500,#124c52)]`). So a per-instance `style="--falcon-ib-dialog-..."` override may retint the Shadow path only; geometry tokens (row-height/gap/etc., read via `var(--falcon-ib-dialog-row-gap,14px)`) DO flow to both (GAP G-TOK, same family as B15 alert-dialog).

## Wrapper-CSS backdrop literals (refresh finding)

`[CODE]` The Angular WRAPPER css (falcon-insufficient-balance-dialog.component.css:48-56) paints the native `::backdrop` with RAW literals — `background: rgba(15, 23, 42, 0.42)`, `backdrop-filter: blur(8px) saturate(1.4)`, `animation … 180ms` — NOT the `--falcon-ib-dialog-backdrop-bg` / `-glossy-backdrop-filter` tokens (which it instead NEUTRALISES on the host to `transparent`/`none` so only the native `::backdrop` paints). Tokens-over-literals smell (GAP G-BACKDROP, same as B15 alert-dialog wrapper `::backdrop`). The values happen to equal the token defaults, but a token override of `--falcon-ib-dialog-backdrop-bg` would NOT reach the native `::backdrop`.

## Related Falcon theme tokens
`--color-falcon-neutral-0/30/200/400/500/600/700/900`, `--color-falcon-teal-50/500/700`, `--color-falcon-red-*`, `--falcon-status-danger`. The token file's AUDIT comment (lines 7-9) asserts all external refs + fallbacks verified against `falcon-tailwind-tokens.css` (no invented tokens, no standard-Tailwind hex masquerading).

## Dark mode support
`[INFERRED]` Inherits neutral inversion from `.app-dark` via the `--color-falcon-*` aliases. No IB-dialog-specific dark override. Not re-verified this pass.

## Density support
No density tokens — row geometry is the per-instance override surface (`--falcon-ib-dialog-row-*`).

## RTL support
`[INFERRED]` The panel is centered + symmetric; the reorder buttons + grip flip naturally under `dir=rtl`. The directional chevron glyphs (up/down) are vertical, so RTL has no effect on them. Not re-verified.

## Static style risks
- `[CODE]` Shadow `.css` (451 ln) — token-driven; structural literals only.
- `[CODE]` Wrapper `.component.css` — raw `::backdrop` literals (G-BACKDROP, above).
- `[CODE]` `-tw` twin — raw `var(--color-falcon-*)` palette refs for error/drag-over visuals (G-TOK, above).
- `[CODE]` Stencil `onDragStart` writes inline `ghost.style.*` (drag-image clone) incl. `boxShadow: '0 12px 24px -6px rgba(0,0,0,0.25)'` + `background: var(--falcon-ib-dialog-row-bg, #fff)` (tsx:170-179) — transient drag-ghost only, acceptable.

## Override patterns
```css
.priority-dialog {
  --falcon-ib-dialog-row-height: 56px;
  --falcon-ib-dialog-row-min-width: 320px;
  --falcon-ib-dialog-row-radius: 12px;     /* geometry → flows to BOTH paths */
  --falcon-ib-dialog-icon-color: var(--color-falcon-amber-500);  /* colour → Shadow only on -tw (G-TOK) */
}
```

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Backdrop | `-backdrop-bg`, `-backdrop-z` (99999), `-glossy-backdrop-filter` (when `show-glossy`) |
| Panel | `-panel-bg`, `-panel-radius`, `-panel-padding-*`, `-panel-max-width`, `-panel-shadow`, `-glossy-panel-filter` |
| Icon | `-icon-color` (danger) vs `-icon-color-neutral` (when `show-icon-color=false`), `-icon-bg`/`-icon-bg-size` (when `show-icon-background`) |
| Row idle | `-row-bg`, `-row-border`, `-row-height`, `-row-radius`, `-row-rank-*`, `-row-label-*`, `-row-grip-*` |
| Row hover | `-row-hover-border` (teal-500) |
| Row dragging | `-row-dragging-opacity` (0.55), `-row-dragging-shadow` |
| Reorder btn | `-btn-bg`/`-fg`, `-btn-bg-hover`/`-fg-hover` (teal), `-btn-disabled-opacity` (0.4) |
| Info pill | `-info-bg`/`-fg` (teal-50/700) |
| Error banner | red family (Shadow tokens; `-tw` reads raw `--color-falcon-red-*` — G-TOK) |
| Footer | `-footer-btn-confirm-bg` (teal-700), `-footer-btn-cancel-*`, `-footer-btn-disabled-opacity` (0.55) |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B17) — token file counted at 187 lines, gate-12 `:where()` scope confirmed. **`backdrop-z` DRIFT corrected `1000` → `99999`** (insufficient-balance-dialog.tokens.css:55). NEW findings: `-tw` reads raw palette refs for some visuals (G-TOK) + wrapper `::backdrop` raw literals (G-BACKDROP). Token catalogue otherwise re-confirmed against the live file.
