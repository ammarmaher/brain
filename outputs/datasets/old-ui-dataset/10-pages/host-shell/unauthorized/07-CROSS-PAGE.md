# Cross-page dependencies — unauthorized

## Inbound (unauthorized depends on)
- `CommonModule`, `RouterModule`.

## Outbound (other features depend on unauthorized)
- `@falcon/shellPrimeAccessGuard` and `@falcon/shellAccessGuard` (and similar guards) redirect here.
- `LayoutComponent.navigateToAdminConsole` (`layout.component.ts:521-525`) navigates to `APP_ROUTES.UNAUTHORIZED` as a fallback.

## Shared state
None.

## Navigation entry points
- `/401` (route key) — referenced by `@falcon/APP_ROUTES.UNAUTHORIZED`.
- "Return to Home" → `/shell` (the Demo `ShellComponent` route).
