---
type: reference
slug: basic-app-models-seeds
prd-implements: [PRD-06]
status: built
created: 2026-07-12
---
*** Reference note — Basic App models, seeds, validation utils ***
*** Code: apps/basic-app/src/app/models/ + app/services/ ***

# Models, Seeds and Validation

## models/models.ts
- `BasicAppTransaction` + 7-state FSM `BasicAppTransactionStatus`: completed · in_progress · partially_processed · failed · canceled · scheduled · deleted (BR-BSA-43..51)
- `BASIC_APP_STATUS_META` status → i18n labelKey + badge severity (semantic buckets)
- `basicAppActionAllowed(action, row, mode)` — per-status row-action gating
- F2 additions: `BasicAppTemplate/Body/Status`, `BasicAppContactGroup(+sampleRows)`, `BasicAppComposeSpec/GroupSpec/ManualSpec/Timing`, `BasicAppQuote`

## models/validation.ts
`basicAppNormalizeDestination` (strip spaces/dashes/parens, 05x→+9665x, `+` 9-15 digits) · `basicAppPrettyVariable` · `basicAppSubstituteVariables` · `basicAppFormatBody` (`*bold*` runs)

## services/mock-transactions.ts (mock-first; backend is SoT later)
Seeds mirroring the React SoT: WA outbox 15 / WA scheduled 5 / voice outbox 4 / voice scheduled 2 · `BASIC_APP_WHATSAPP_SENDERS` (5) · `BASIC_APP_WHATSAPP_TEMPLATES` (5, incl. paused wt5) · `BASIC_APP_CONTACT_GROUPS` (5, 2 shared) · `basicAppQuote` (flat 2.5) · `basicAppSubmitCompose` (TXN-1006xx, prepends grids) · `basicAppTransactionsChanged` signal.

i18n: `basicApp.*` namespace lives in the platform's shared language store (`libs/falcon/src/language/i18n/en.json` + `ar.json`, lockstep) — that store serves ALL apps by design.

Links: [[00 Basic App MOC]]
