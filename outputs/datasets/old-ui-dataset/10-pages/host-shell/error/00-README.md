---
type: page-dataset
app: host-shell
feature: error
source: origin/main @ 803ac1d1
extracted: 2026-05-16
extracted-by: P7
---

# Error (generic fallback)

## TL;DR
Generic-failure landing page at `/error`. Renders a single card with hardcoded title "Access Check Failed", a hardcoded paragraph, and a "Return to Home" link to `/shell`. Entire component (~60 lines) — no API, no DTO, no form, no PES. Used as a catch-all when the platform-wide authorization checks throw.

## Manifest
- [[01-ROUTING]] — 1 route (`/error`)
- [[02-COMPONENTS]] — 1 component (`ErrorComponent`, inline template + inline styles)
- [[03-SERVICES-APIS]] — 0 services, 0 endpoints
- [[04-DTOS]] — 0 DTOs
- [[05-PES]] — 0 permission checks
- [[06-VALIDATIONS]] — 0
- [[07-CROSS-PAGE]] — 1 inbound dep (`RouterModule` for `routerLink`)
- [[08-RULES-APPLIED]] — Inline `styles: [...]` block with hardcoded hex colors; static English text

## Source files
| File | Role |
|---|---|
| `apps/host-shell/src/app/features/error/error.component.ts` | Inline template + styles, 62 lines |
