---
type: feature
slug: basic-app-compose-whatsapp
prd-implements: [PRD-06]
status: built-verified
created: 2026-07-12
---
*** Feature note — Send Whatsapp Message compose (Wave F2) ***
*** Code: apps/basic-app/src/app/features/compose/ ***

# Feature — Send WhatsApp Compose

**Route** `marketplace/basic-app/send/whatsapp` (both consoles). **Status: BUILT (Wave F2) + live-verified 2026-07-12** — Send navigates, cascade gates, phone preview renders, cancel-confirm shows SoT copy.

## Composition
- 3-column takeover `grid-cols-[1fr_1.85fr_1.15fr]`; collapsible preview column; teal `#0d3f44` summary strip (Message Summary · Estimated Recipients · Date & Time)
- **Step 1 Message Details**: sender → category → language → template cascade (each reset clears downstream); Approved-only templates (ruling C7) with send-time paused-guard
- **Step 2 Recipients**: contact-group picker (Created by me | Shared with me tabs + search popover) with per-group variable→field mapping grid (move-on-reassign); manual recipients ≤3 (ruling C3) with phone normalization
- **Step 3 Preview**: `BasicAppPhonePreviewComponent` — token-border phone frame, `*bold*` runs, `{{var}}` substitution, footer/CTA
- Confirm overlay: native `<dialog falconOverlay="modal">` (the primitive `falcon-angular-popup` itself uses — `falcon-angular-dialog` default-slot projection is runtime-broken under zoneless, documented GAP) · duplicates toggle (`falcon-angular-switch`) · quote KPIs with riyal icon
- Cancel → `FalconUnsavedChangesService` popup (SoT copy)

## Store
`BasicAppComposeStore` (DI-free signals): cascade resets, `groupReady/groupsReady`, manual-row validity, `previewValues`, `scheduledAtIso`, exact `canSend`, added-order `spec()`, quote/submit → prepends the home grid and lands on the right tab via `?channel/&mode` return params.

Specs: `apps/admin-console/tests/basic-app-compose.spec.ts` (36/36, incl. 11-case `canSend` table).

Links: [[00 Basic App MOC]] · [[Feature — Home Transactions]] · [[Basic Send Message]]
