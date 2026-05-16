---
type: page-dataset
app: host-shell
feature: Demo
source: origin/main @ 803ac1d1
extracted: 2026-05-16
extracted-by: P7
---

# Demo (host-shell developer affordances)

## TL;DR
Three internal "demo" pages used to verify the cross-MFE facade plumbing during development. **Not user-facing.** `ShellComponent` (`/shell`) shows the current host env via `FALCON_CONTEXT` and links to `/auth-view`. `AuthViewComponent` (`/auth-view`, gated by `FalconAccess.authView.view()`) shows all 4 facade values (auth / language / theme / context) and provides a Logout button. `FacadeStatusComponent` (selector: `app-facade-status1`) is a reusable table that inspects all five facades injected via the `FALCON_*` tokens.

## Manifest
- [[01-ROUTING]] — 2 routes (`/shell`, `/auth-view`)
- [[02-COMPONENTS]] — 3 components (Shell, AuthView, FacadeStatus)
- [[03-SERVICES-APIS]] — 0 HTTP endpoints (facade reads only)
- [[04-DTOS]] — 1 internal interface (`FacadeRow`)
- [[05-PES]] — 1 permission check (`FalconAccess.authView.view()` on `/auth-view`)
- [[06-VALIDATIONS]] — 0
- [[07-CROSS-PAGE]] — depends on 5 facade tokens (`FALCON_AUTH`, `FALCON_LANGUAGE`, `FALCON_THEME`, `FALCON_NOTIFIER`, `FALCON_CONTEXT`)
- [[08-RULES-APPLIED]] — Demo-quality code, should be excluded from production rebuild

## Source files
| File | Role |
|---|---|
| `apps/host-shell/src/app/features/Demo/shell/shell.component.ts` | Shell landing (`/shell`) |
| `apps/host-shell/src/app/features/Demo/shell/shell.component.html` | Template |
| `apps/host-shell/src/app/features/Demo/auth-view/auth-view.component.ts` | Auth diagnostic view (`/auth-view`) |
| `apps/host-shell/src/app/features/Demo/auth-view/auth-view.component.html` | Template |
| `apps/host-shell/src/app/features/Demo/facade-status/facade-status.component.ts` | Facade table (selector: `app-facade-status1`) |
| `apps/host-shell/src/app/features/Demo/facade-status/facade-status.component.html` | Template (`*ngFor` over 4 rows) |
