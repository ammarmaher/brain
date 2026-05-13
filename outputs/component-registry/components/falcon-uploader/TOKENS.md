# falcon-angular-uploader — TOKENS

## Token file path
- `libs/falcon-ui-tokens/src/components/uploader.tokens.css`

Selector scope (applies tokens to all 4 surfaces):
```css
:where(falcon-uploader, falcon-uploader-tw, falcon-angular-uploader, .falcon-uploader, [data-falcon-uploader]) { … }
```

## Related Falcon theme tokens
From `libs/falcon-theme/src/falcon-tailwind-tokens.css`:
- `--color-falcon-teal-500` — dropzone drag-over border + hover.
- `--color-falcon-teal-alpha-04` — drag-over bg.
- `--color-falcon-neutral-0` — base white.
- `--color-falcon-neutral-45` — empty dropzone bg.
- `--color-falcon-neutral-150` — disabled border.
- `--color-falcon-neutral-200` — default border.
- `--color-falcon-neutral-400` — disabled text.
- `--color-falcon-neutral-500` — secondary text.
- `--color-falcon-neutral-800` / `-900` — primary text.
- `--color-falcon-red-500` — error text + required marker.

## 14 token categories (verbatim from uploader.tokens.css)
1. **CONTAINER** — `--falcon-uploader-max-width`.
2. **LABEL** — `--falcon-uploader-label-{color,font-size,font-weight,line-height,margin-bottom}`, `-required-marker-color`.
3. **DROPZONE per state** — padding, border, radius, bg, color, focus shadow, disabled opacity (per default / hover / drag-over / focus / error / disabled).
4. **DROPZONE ICON** — large empty-dropzone icon size + color.
5. **PLACEHOLDER TEXT** — empty dropzone prompt.
6. **BROWSE LINK** — inline "click to browse" styling.
7. **FILE LIST item** — gap, padding, border, radius, bg per state.
8. **FILE NAME** — font, color.
9. **FILE SIZE** — font-size, color.
10. **PROGRESS BAR** — height, track color, fill color, transition.
11. **STATUS BADGE per state** — queued / uploading / success / error.
12. **REMOVE BUTTON** — size, color, hover.
13. **PREVIEW THUMBNAIL** — size, radius, border.
14. **MOTION** — drag-over + status + progress transitions.

## Tailwind utility guidance
- The Tailwind helper (`uploader-tailwind-classes.ts` if present) reads the same `--falcon-uploader-*` tokens.
- Consumers must NOT hardcode hex / px overrides.

## Dark mode support
- Partial. Some semantic tokens (e.g., `--color-falcon-neutral-0`) auto-flip in dark mode via theme. Uploader-scoped overrides for `--falcon-uploader-dropzone-bg-disabled` etc. are likely missing; audit.

## Density support
- _None._ Single density.

## RTL support
- Position-related properties use logical values (`padding-x`) → flips in RTL automatically.

## Static style risks
- Inline width on the progress fill: `style={{ width: `${progress}%` }}` — documented "escape hatch" (geometry from data).
- `<i class="pi pi-cloud-upload" />` references a removed library — high-priority gap (see `GAPS_AND_UPGRADES.md`).

## No CSS / No SCSS guidance
- Stencil consumes `falcon-uploader.css`. No `.component.scss` in the Angular wrapper.
- Consumer must NOT add visual `*.component.css` rules.

## Token usage matrix per state
| Element | Default | Hover | Focus | Error | Drag-over | Disabled |
|---|---|---|---|---|---|---|
| Dropzone | `-dropzone-bg`, `-border-color` | `-bg-hover`, `-border-color-hover` | `-border-color-focus`, `-focus-shadow` | `-bg-error`, `-border-color-error` | `-bg-drag-over`, `-border-color-drag-over` | `-bg-disabled`, `-border-color-disabled`, `-disabled-opacity` |
| Dropzone text | `-dropzone-color` | — | — | — | — | `-dropzone-color-disabled` |
| File row | `-row-bg`, `-row-border-color` | — | — | `-row-bg-error` (if defined) | — | `-row-bg-disabled` (if defined) |
| Progress | `-progress-track-color` | — | — | — | — | — |
| Progress fill | `-progress-fill-color` | — | — | — | — | — |
| Badge — queued | (token TBD per status) | — | — | — | — | — |
| Badge — uploading | (token TBD) | — | — | — | — | — |
| Badge — success | (token TBD) | — | — | — | — | — |
| Badge — error | (token TBD) | — | — | — | — | — |
