---
type: page-dataset
app: host-shell
feature: unauthorized
source: origin/main @ 803ac1d1
extracted: 2026-05-16
extracted-by: P7
---

# Unauthorized (HTTP 401)

## TL;DR
Top-level fallback at `/401`. Shows a large "401" code, "Unauthorized Access" title, message "You do not have permission to access this resource.", and a "Return to Home" link to `/shell`. Component is ~75 lines with inline template + inline styles. Reached when PES guards (`shellPrimeAccessGuard`, `shellAccessGuard`) deny.

## Manifest
- [[01-ROUTING]] — 1 route (`/401`)
- [[02-COMPONENTS]] — 1 component (`UnauthorizedComponent`, inline)
- [[03-SERVICES-APIS]] — 0
- [[04-DTOS]] — 0
- [[05-PES]] — 0 permission checks (it IS the PES denial destination)
- [[06-VALIDATIONS]] — 0
- [[07-CROSS-PAGE]] — 1 inbound dep (`RouterModule`)
- [[08-RULES-APPLIED]] — Inline `styles: [...]` with CSS variables (`var(--color-primary, #007bff)`) — better than `error/` but still hardcoded fallbacks

## Source files
| File | Role |
|---|---|
| `apps/host-shell/src/app/features/unauthorized/unauthorized.component.ts` | Inline template + styles, 74 lines |
