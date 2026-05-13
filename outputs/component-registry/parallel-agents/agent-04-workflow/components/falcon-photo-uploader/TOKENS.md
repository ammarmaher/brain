# falcon-photo-uploader (LEGACY) — TOKENS

## Token file path
- _None._ This legacy bespoke component does NOT have a per-component token file.

## Related Falcon theme tokens
- Likely consumes `--color-falcon-neutral-…` and `--color-falcon-teal-…` via the SCSS file (untokenized references).

## Tailwind utility guidance
- Template uses some Tailwind utilities for layout; visual styling is in SCSS.

## Dark mode support
- **Missing.**

## Density support
- **None.** Single visual.

## RTL support
- Audit required. SCSS likely uses `inset-inline-…` or directional properties — verify.

## Static style risks
- **High.** All visual values live in SCSS — full violation of the "no SCSS, tokens-only" project rule.

## No CSS / No SCSS guidance
- **The SCSS file violates this rule.** Delete during migration.

## Token usage matrix per state
- **N/A.** Tokens not used.

## Migration mapping
When migrating to `<falcon-angular-single-uploader>`, the visual values from the SCSS map onto:
- Avatar circle size → `--falcon-single-uploader-tile-size-{sm,md,lg}`.
- Circle radius → `--falcon-single-uploader-tile-radius` (set to `50%`).
- Drag-over border / bg → `--falcon-single-uploader-empty-bg-drag-over` / `-border-drag-over`.
- Upload button → `<falcon-angular-button>` styling (token-driven).
