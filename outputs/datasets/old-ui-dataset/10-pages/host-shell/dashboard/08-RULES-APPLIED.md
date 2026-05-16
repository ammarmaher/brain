# Rules / patterns — dashboard

## Observed (good)
- **Standalone component** with explicit imports.
- **OnPush change detection** + signal-based loading state — `isLoading = signal(true)` with `.set(false)` in `setTimeout` callback.
- **`DestroyRef.onDestroy()`** for `clearTimeout` cleanup instead of `OnDestroy` interface.
- **Two-state template** (skeleton + loaded) via `*ngIf` blocks — clean separation.

## Observed (bad — would be flagged by the night-shift digest)
- **Mock data hardcoded inside the component** — no service, no fake API. Pure cosmetic shell.
- **`pi pi-*` icon classes** as raw strings inside the component constants (`stat-card.icon = 'pi pi-users'`). PrimeIcons font dependency in templates.
- **Hardcoded English strings** for greeting, status labels, stat-card labels. No `TranslateService` lookups.
- **`*ngIf` / `*ngFor` / `[ngClass]`** instead of `@if/@for` per current Angular 20+ idioms.
- **CSS classes drive business logic** — `getStatusClass()` returns a class name; the calling template combines it via `[class]` binding. The status enum is a string union, not a typed enum.
- **`Math.max(...arr.map(...))`** in a getter — recomputes on every CD pass. Tolerable here because `revenueData` is `readonly` and never changes, but worth flagging if data becomes dynamic.
- **`setTimeout(1500)` hardcoded "loading" delay** — cosmetic only; would be removed when real API integration arrives.
- **Stat card colors are an inline union type** `'primary' | 'success' | 'warning' | 'danger'` — repeated in 2 interfaces. Would extract to a shared `SeverityColor` token.
- **Bar chart implemented as pure CSS `[style.height.%]`** — fine for a placeholder, would not survive real-world chart requirements (axis labels, tooltips, responsive widths).
- **No accessibility metadata** — bar chart has no `role="img"` or `aria-label`; only number percentages in the visual track.

## Patterns worth porting
- **Signal-based `isLoading` + two-template-state pattern** — clean way to model "fetching" without a third loading library.
- **`DestroyRef.onDestroy`** for trivial cleanup (clear a timer) — modern Angular idiom that avoids the `OnDestroy` interface.

## Anti-patterns to NOT port to new theme
- **Component file embeds the data** — even if mock, this entanglement means the new build will have to delete-then-rebuild the mock layer. A separate `dashboard-mock-data.service.ts` would be cleaner.
- **Pure-CSS bar chart** is a placeholder, not a real visualization. New build should pick a charting library decision once (e.g. `<falcon-chart>` wrapper around Chart.js or ApexCharts) so dashboards across the platform stay consistent.
