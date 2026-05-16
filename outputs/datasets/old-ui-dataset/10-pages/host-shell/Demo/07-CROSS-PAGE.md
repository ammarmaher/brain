# Cross-page dependencies — Demo

## Inbound (Demo depends on)
- `@falcon/sdk` facade tokens: `FALCON_AUTH`, `FALCON_LANGUAGE`, `FALCON_THEME`, `FALCON_NOTIFIER`, `FALCON_CONTEXT`, `FALCON_FACADE_TOKENS`.
- `AuthService` from host core (for `logout()`).
- `CommonModule`, `RouterLink`.

## Outbound (other features depend on Demo)
- The error/unauthorized/not-found pages link to `/shell` ("Return to Home") — `[INFERRED]` a legacy choice from when `/shell` was the home route.

## Shared state
- **Reads only:** all 5 facade values.
- **Writes:** `AuthService.logout()` clears tokens and navigates.

## Navigation entry points
- `/shell` (Demo route).
- `/auth-view` (Demo route).
- "Return to Home" buttons in error/unauthorized/not-found.
- Demo pages are NOT exposed in the sidebar.
