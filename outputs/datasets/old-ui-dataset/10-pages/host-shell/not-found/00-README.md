---
type: page-dataset
app: host-shell
feature: not-found
source: origin/main @ 803ac1d1
extracted: 2026-05-16
extracted-by: P7
---

# Not Found (Page Under Construction)

## TL;DR
Used both as a 404 catch-all AND as a "page under construction" placeholder. Renders `assets/images/under-construction.png`, an H1 "Page Under Construction", a paragraph, and a PrimeNG `<button pButton>` labeled "Back to Dashboard" with `pi pi-home` icon. Clicking the button calls `router.navigate(['/shell'])`. Three files (TS + HTML + SCSS), ~20 lines TS.

## Manifest
- [[01-ROUTING]] — 1 route (`/not-found`)
- [[02-COMPONENTS]] — 1 component (`NotFoundComponent`)
- [[03-SERVICES-APIS]] — 0 services, 0 endpoints
- [[04-DTOS]] — 0
- [[05-PES]] — 0
- [[06-VALIDATIONS]] — 0
- [[07-CROSS-PAGE]] — 1 inbound dep (`primeng/button` ButtonDirective)
- [[08-RULES-APPLIED]] — Uses `pButton` directive, asset image (`under-construction.png`), `pi pi-home` icon

## Source files
| File | Role |
|---|---|
| `apps/host-shell/src/app/features/not-found/not-found.component.ts` | Component class (21 lines) |
| `apps/host-shell/src/app/features/not-found/not-found.component.html` | Template (20 lines) |
| `apps/host-shell/src/app/features/not-found/not-found.component.scss` | Styles |
