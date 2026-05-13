# falcon-angular-single-uploader — TOKENS

## Token file path
- `libs/falcon-ui-tokens/src/components/single-uploader.tokens.css`

## Related Falcon theme tokens
- Same family as `falcon-uploader` (see `falcon-uploader/TOKENS.md`) — teal, neutral, red.
- Plus action button colors (`--color-falcon-red-500` for delete, `--color-falcon-neutral-500` for edit).

## Tokens (categories — full audit required against source CSS)
- Empty dropzone: padding, border, radius, bg, color per state (default / drag-over / error / disabled).
- Filled tile: size sm/md/lg, radius, border, bg per status (queued / uploading / success / error).
- Preview image: aspect ratio, object-fit, radius.
- Icon-only fallback: icon size, bg, color.
- Compact body: row gap, name font, size font.
- Action button (delete): position, size, color, hover, focus, danger ring.
- Action button (edit): position, size, color, hover, focus.
- Progress bar: height, track color, fill color.
- Label + helper + error text.

## Tailwind utility guidance
- The Tailwind helper file consumes `--falcon-single-uploader-*` tokens.
- Consumers must not hardcode hex / px.

## Dark mode support
- Audit required.

## Density support
- `size: 'sm' | 'md' | 'lg'` toggles the tile dimensions and font scale.

## RTL support
- Action buttons use absolute positioning with `inset-inline-end` (logical). Should flip in RTL.

## Static style risks
- `<i class="pi pi-cloud-upload" />` and `<i class="pi pi-pencil" />` — PrimeIcons residuals.
- Inline width on progress fill — documented escape hatch.

## No CSS / No SCSS guidance
- Stencil consumes `falcon-single-uploader.css`. No `*.component.scss` in Angular wrapper.

## Token usage matrix per state
| Element | Default | Hover | Focus | Error | Drag-over | Disabled |
|---|---|---|---|---|---|---|
| Empty dropzone | `-empty-bg`, `-border` | `-bg-hover` | `-border-focus`, `-focus-shadow` | `-bg-error`, `-border-error` | `-bg-drag-over`, `-border-drag-over` | `-bg-disabled`, `-disabled-opacity` |
| Filled tile | `-tile-bg`, `-tile-border` | — | — | `-tile-bg-error` | (TBD) | `-tile-bg-disabled` |
| Delete button | `-delete-bg`, `-color` | `-bg-hover` | `-focus-ring` | — | — | `-disabled-opacity` |
| Edit button | `-edit-bg`, `-color` | `-bg-hover` | `-focus-ring` | — | — | `-disabled-opacity` |
| Preview image | — | — | — | — | — | — |
| Icon fallback | `-icon-color`, `-bg` | — | — | — | — | — |
| Progress fill | `-progress-fill-color` | — | — | — | — | — |
