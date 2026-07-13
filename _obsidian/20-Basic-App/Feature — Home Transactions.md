---
type: feature
slug: basic-app-home
prd-implements: [PRD-06]
status: built-verified
created: 2026-07-12
---
*** Feature note — Basic App home (transactions landing) ***
*** Code: apps/basic-app/src/app/features/home/ ***

# Feature — Home Transactions (landing)

**Route** `marketplace/basic-app` (child of Marketplace & Applications .Mng) in BOTH consoles.
**Status: BUILT + SoT pixel-parity runtime-verified 2026-07-12.**

## Composition (falcon components only)
- Channel tabs **WhatsApp | IVR Voice** → sub-tabs **Outbox | Scheduled** (`falcon-angular-tabs`)
- Right-aligned **Send** button (`falcon-angular-button`, SoT-exact `#0d3f44`/38px/13px) → routes to [[Feature — Send WhatsApp Compose]] for WA
- Toolbar: `falcon-angular-search-input` (230px) · type `falcon-angular-dropdown` · REAL date-range via two composed `falcon-angular-date-picker`s (SoT chip was decorative; PRD requires a working filter)
- Grid: `falcon-angular-data-table`, page size 10, per-status row actions (Details always · Cancel only In-Progress · Edit/Delete only Scheduled) via `visible` predicates + danger `styleClass`
- Recipients cell: first recipient + **+N popover** (feature-local `BasicAppRecipientsCellComponent`, shared-with-chip precedent)
- Status pill: `BasicAppStatusPillComponent` — SoT-exact palette for the 7-state FSM (see [[SoT Parity and Token Re-pointing]])

## Files
`basic-app-home.component.ts/.html` · `basic-app-recipients-cell.component.ts` · `basic-app-status-pill.component.ts`
Models/seeds: [[Models Seeds and Validation]]. Specs: `apps/admin-console/tests/basic-app-home.models.spec.ts` (7/7).

Links: [[00 Basic App MOC]] · [[Basic Send App]]
