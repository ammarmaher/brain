---
type: feature
slug: basic-app-details
prd-implements: [PRD-06]
status: queued-f3
created: 2026-07-12
---
*** Feature note — WhatsApp Transaction Details (Wave F3, queued) ***
*** Target code: apps/basic-app/src/app/features/details/ ***

# Feature — Transaction Details (WA)

**Route (planned)** `marketplace/basic-app/details/:id`. **Status: QUEUED (Wave F3)** — the first F3 build was aborted mid-flight by the 2026-07-12 architecture reversal; it relaunches against `apps/basic-app`.

## Planned composition (SoT S3 + BR-BSA-53..70)
- Header: txn id + status pill (REUSE `BasicAppStatusPillComponent`) + template/sender/created/scheduled meta
- KPI cards: recipients · delivered/read/failed · total cost (riyal icon)
- Delivery-breakdown charts (backlog N3 donut + N4 horizontal bars): **feature-local SVG**, colors from the established status palette — NO chart library, NO new falcon-ui-core components unless a generic one is genuinely warranted (then app-agnostic naming + flags, per [[Architecture Ruling 2026-07-12]])
- Per-recipient results table: `falcon-angular-data-table` with the same token re-pointing block as home
- Message preview: REUSE `BasicAppPhonePreviewComponent`

Links: [[00 Basic App MOC]] · [[Basic Send WhatsApp Details]] · [[Feature — Waves Roadmap F4-F9]]
