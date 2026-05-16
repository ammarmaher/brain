# Cross-page dependencies — dashboard

## Inbound (dashboard depends on)
- `SessionProvider` from `@falcon` — for `session.name`.
- `CommonModule` from `@angular/common` — for `*ngIf`/`*ngFor`/`*ngClass`.
- `signal`, `inject`, `OnInit`, `DestroyRef`, `ChangeDetectionStrategy.OnPush` from `@angular/core`.

## Outbound (other features depend on dashboard)
None. Dashboard is a terminal route — no other component references it.

## Shared state
- **Reads:** `SessionProvider.session?.name`.
- **Writes:** none.

## Navigation entry points
- Default landing on `'/'` after login (or token refresh).
- Sidebar nav item: `'Dashboard'` → path `/` (from `layout.component.ts:253-260`).
- Programmatic navigation via `router.navigate(['/'])` from `AuthService.handleLoginSuccess` (when no `auth_redirect` is stored).
