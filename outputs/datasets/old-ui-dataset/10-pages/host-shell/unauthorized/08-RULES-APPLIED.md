# Rules / patterns — unauthorized

## Observed (good)
- Uses CSS variables (`var(--color-primary, ...)`) — partially aligned with the design-token approach.
- Standalone, no dependencies beyond Common+Router.
- Clear visual hierarchy (large "401" → title → message → action link).

## Observed (bad — would be flagged by the night-shift digest)
- **Hex color fallbacks inline** (`#e74c3c`, `#007bff`, `#0056b3`, etc.) — defeats the design-token purpose. The fallback should be removed or rely on global theme defaults.
- **Hardcoded English copy** — no i18n.
- **Inline `template` + `styles`** block. Bigger than `error/` would suggest splitting into HTML + SCSS files (current path: TS-only).
- **`routerLink="/shell"`** — same legacy assumption as `error/` and `not-found/`. `/shell` is the Demo route, not the dashboard.
- **`background-color: var(--color-bg, #f5f5f5)`** — `--color-bg` is not a known Falcon token name (Falcon uses `--falcon-bg-surface` etc.). This was likely an early local naming convention.

## Patterns worth porting
- The 401-large-numeral pattern is visually identifiable and clean.

## Anti-patterns to NOT port to new theme
- Inline styles with hex fallbacks.
- Three separate error pages with different visual treatments — consolidate.
- `--color-*` ad-hoc CSS variables — these don't map to the canonical `--falcon-*` token namespace.
