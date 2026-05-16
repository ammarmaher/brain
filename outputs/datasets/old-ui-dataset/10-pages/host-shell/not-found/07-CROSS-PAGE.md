# Cross-page dependencies — not-found

## Inbound (not-found depends on)
- `ButtonDirective` from `primeng/button`.
- `Router` from `@angular/router`.

## Outbound (other features depend on not-found)
None at host level. `[INFERRED]` Some remote MFE may call `router.navigate(['/not-found'])` when a sub-route is under construction.

## Shared state
None.

## Navigation entry points
- Top-level route `/not-found`.
- "Back to Dashboard" button → `/shell` (which is the Demo `ShellComponent`, NOT the actual dashboard at `/`). `[INFERRED]` Looks like a legacy assumption from when `/shell` was the home route.
