---
type: page-dataset
app: host-shell
feature: dashboard
source: origin/main @ 803ac1d1
extracted: 2026-05-16
extracted-by: P7
---

# Dashboard

## TL;DR
Default landing page (`/`) for every authenticated user (Falcon + Client). Currently a **placeholder with hardcoded mock data** — no API integration. Shows a greeting (`Good Morning/Afternoon/Evening`), 4 stat cards (Total Customers, Active Services, Monthly Revenue, Pending Requests), a 6-month revenue bar chart (CSS-driven), a service-status list (5 PrimeNG-styled rows), and a recent-activity feed (5 rows). Has a 1.5-second skeleton-loader animation on mount. Reads `session.name` from `SessionProvider` to greet the user by name. Replace mock arrays with real API calls before going live.

## Manifest
- [[01-ROUTING]] — 1 route (default child of LayoutComponent)
- [[02-COMPONENTS]] — 1 component (DashboardComponent)
- [[03-SERVICES-APIS]] — 0 services, 0 endpoints (mock data only — `[CODE]` confirmed)
- [[04-DTOS]] — 4 internal interfaces (StatCard, RecentActivity, ServiceStatus, RevenueData)
- [[05-PES]] — 0 permission checks
- [[06-VALIDATIONS]] — 0 form validators
- [[07-CROSS-PAGE]] — 1 inbound dep (`SessionProvider` for `session.name`), 0 outbound
- [[08-RULES-APPLIED]] — OnPush change detection, signal-based loading state, `pi pi-*` icons hardcoded

## Source files
| File | Role |
|---|---|
| `apps/host-shell/src/app/features/dashboard/dashboard.component.ts` | Component class (178 lines, mock data) |
| `apps/host-shell/src/app/features/dashboard/dashboard.component.html` | Template with skeleton + loaded states |
| `apps/host-shell/src/app/features/dashboard/dashboard.component.scss` | Styles (not read in this dataset) |
