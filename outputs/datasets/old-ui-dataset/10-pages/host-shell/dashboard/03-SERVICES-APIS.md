# Services & APIs — dashboard

## Services
| Service | File | Singleton? | Purpose |
|---|---|---|---|
| `SessionProvider` (read-only) | `@falcon` (`libs/falcon/src/lib/auth/...`) | `providedIn: 'root'` | Read `session.name` for greeting |

## HTTP endpoints called
**None.** `[CODE]` confirmed — no `http.get/post/put/delete` calls in `dashboard.component.ts`. Source comment at line 64 acknowledges:
> "Mock 1s loading delay — replace with forkJoin of real API calls"

## Base URL resolution
N/A — no API calls.

## Auth / interceptors
N/A — no API calls.

## Backend service mapping
N/A — dashboard is currently a static skeleton. When backend is wired (per inline comment), `[INFERRED]` the most likely endpoints would be:
- `/commerce/...` for total customers, monthly revenue.
- `/charging/...` for service-status usage metrics.
- `/identity/...` or `/commerce/activity-feed` for recent activity.

But none of this is in the current code.
