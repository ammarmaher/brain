# Cross-page dependencies — error

## Inbound (error depends on)
- `CommonModule`, `RouterModule` (for `routerLink="/shell"`).

## Outbound (other features depend on error)
- `[INFERRED]` Triggered from a `@falcon`-level access-control error handler. Not referenced from any host code directly.

## Shared state
None.

## Navigation entry points
- Top-level route `/error`. Direct navigation via `router.navigate(['/error'])` from places where access-check infrastructure throws.
