*** All Screenshots Summary Report — Org Hierarchy Falcon Eyes ***

## Run summary
- Source captures: 12 (+ 1 full-page) — all show the Organization Hierarchy page
- Destination captures: 12 (+ 1 full-page) — **all show the "Access Check Failed" card** because the destination route is auth-blocked
- Pixel mismatch (all sections): 17.57% — constant because every destination screenshot is identical
- Semantic analysis: not performed (would be fabrication without visible destination UI)
- Status: **BLOCKED — destination route requires authenticated session**

## Per-section table
| Section | Source | Destination | Diff | Pixel mismatch % | Semantic score | P0 | P1 | P2 | P3 | Status |
|---|---|---|---|---:|---:|---:|---:|---:|---:|---|
| tabs-header | source/tabs-header.png | destination/tabs-header.png | diff/tabs-header-diff.png | 17.57 | n/a (blocked) | — | — | — | — | blocked |
| comm-channels-tab | source/... | destination/... | diff/... | 17.57 | n/a (blocked) | — | — | — | — | blocked |
| apps-services-tab | source/... | destination/... | diff/... | 17.57 | n/a (blocked) | — | — | — | — | blocked |
| org-info-panel | source/... | destination/... | diff/... | 17.57 | n/a (blocked) | — | — | — | — | blocked |
| org-info-audit-mode | source/... | destination/... | diff/... | 17.57 | n/a (blocked) | — | — | — | — | blocked |
| org-info-rule-status | source/... | destination/... | diff/... | 17.57 | n/a (blocked) | — | — | — | — | blocked |
| org-info-permission-privilege | source/... | destination/... | diff/... | 17.57 | n/a (blocked) | — | — | — | — | blocked |
| settings-tab-view-mode | source/... | destination/... | diff/... | 17.57 | n/a (blocked) | — | — | — | — | blocked |
| settings-tab-edit-mode | source/... | destination/... | diff/... | 17.57 | n/a (blocked) | — | — | — | — | blocked |
| settings-ip-management | source/... | destination/... | diff/... | 17.57 | n/a (blocked) | — | — | — | — | blocked |
| settings-account-limitation | source/... | destination/... | diff/... | 17.57 | n/a (blocked) | — | — | — | — | blocked |
| otp-popup | source/... | destination/... | diff/... | 17.57 | n/a (blocked) | — | — | — | — | blocked |

## Why every section is identical
The Angular admin-console at `/#/admin-console/org-hierarchy-page` short-circuits to an "Access Check Failed" card whenever the auth/permission guard cannot complete the authorization check. The card is the same DOM regardless of which tab or section the URL targets, so every full-page section screenshot is byte-for-byte the same.

## Required action to make this run meaningful
A logged-in session (real OAuth/OIDC handshake through Identity Service) so the destination renders the Organization Hierarchy feature. Without that, Falcon Eyes cannot do semantic work on this page.
