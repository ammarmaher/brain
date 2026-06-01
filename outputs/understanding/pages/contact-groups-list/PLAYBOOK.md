*** Contact Groups List — Playbook ***
*** 2026-05-18 ***

# Contact Groups List — Playbook

## TL;DR

Admin-console feature for browsing contact groups. Two tabs (Own + Shared). Detail page deep-linkable with paginated contacts and download URLs. Falcon admin views all groups including soft-deleted; clients see only non-deleted. 9 PES queries (1 entry + 8 per-row). 1177 LOC backend code.

Critical drift: query param casing inconsistency between Own (`page`) and Shared (`Page`) endpoints.

## Sections

1. Permissions — 9 PES + row-owner overlay.
2. Tabs — Own / Shared with separate endpoints.
3. List table — 7 columns + softDelete badge for Falcon.
4. Detail view — metadata + paginated contacts + download URLs.
5. Edit panel — name/refId via PATCH; share-policy via separate endpoint.
6. User picker — Identity multi-select filtered Status[Active,Suspended,Locked] + Role[NormalUser].
7. Validations — name required.
8. Backend API — 9 endpoints (8 cg + 1 identity), all exist.
9. Components — `<falcon-tabs>` + `<falcon-angular-data-table>` + lazy pagination.
10. Kafka — group-updated, share-policy-changed, group-deleted.
11. State — Active ↔ Inactive ↔ SoftDeleted.
12. Errors — NotFound · NameDuplicate · DownloadUrlExpired.
13. Gaps — CASING · CLIENT-PAGINATION · MISSING-FILTERS · DOWNLOAD-EXPIRY.

## Hubs

[[Contact Groups List]] · [[Create Contact Group Flow]] · [[04 Contact Group Management]] · [[Contact Group Service]]
