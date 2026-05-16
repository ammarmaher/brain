# Rules / patterns — error

## Observed (good)
- Standalone component, tiny surface area, no dependencies beyond Common+Router.
- Renders fast (no API, no skeleton).

## Observed (bad — would be flagged by the night-shift digest)
- **Inline `styles: [...]` array with hardcoded hex colors** (`#1d4ed8`, `#1f2937`, `#4b5563`, `#f4f7fb`, `#e7eef9`, `#ffffff`). Should use Falcon design tokens.
- **Hardcoded English copy** — no `TranslateService`, no i18n key.
- **No icon / no illustration** — bare minimum landing. Visually inconsistent with `unauthorized` and `not-found` (which both have illustrations / styling that differs).
- **`routerLink="/shell"` hard-coded** — pre-supposes the `/shell` route exists. If a future build removes `/shell` (which is the Demo route), this back-link becomes broken.

## Patterns worth porting
None really — the page is a placeholder.

## Anti-patterns to NOT port to new theme
- Inline styles with hex colors.
- Hardcoded English copy.
- Three separate error pages (`error`, `unauthorized`, `not-found`) all with different visual treatments. Consolidate into one `<falcon-error-page>` component parameterized by `(status: 'auth-failed' | '401' | '404' | '500', message?: string)`.
