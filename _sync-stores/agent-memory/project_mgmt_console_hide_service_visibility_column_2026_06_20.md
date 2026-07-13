---
name: project_mgmt_console_hide_service_visibility_column_2026_06_20
description: Management Console org-hierarchy CommChannels & Services + Apps & Services tabs now drop the Visibility-toggle column (it was a dead no-op for Client users); shared table gained a showVisibilityColumn input; admin unchanged.
metadata: 
  node_type: memory
  type: project
  originSessionId: a5ea9fa1-ced8-442d-b32b-dfb8919e39b9
---

Management Console must NOT show the **Visibility** toggle column in the org-hierarchy **CommChannels & Services** and **Apps & Services** tabs (user request 2026-06-20, screenshots showed the dead toggle). Done FE-only, builds GREEN, NO commits.

**Why it was a dead toggle:** the service-pricing surface is ONE shared stack — library presentation `falcon-service-pricing-table` (`libs/falcon/src/shared-features/service-pricing-table/`) wrapped by host-shell `<app-service-pricing>` (`apps/host-shell/src/app/shared-components/service-pricing/`), used by admin-console (org-hierarchy + comm-channels-services + marketplace) AND management-console (org-hierarchy + comms-hub + marketplace). The wrapper resolves PES per console (`service-pricing.component.ts:278-294`): admin (Falcon staff, `adminConsole.services.visibility()`) gets `canVisibility=flag`; **management (Client users) hard-sets `canVisibility=false`** — setting service visibility is Falcon-staff-only by design. So in management the switch rendered but `onToggleVisibility()` returned early → no-op.

**Fix (5 edits, surgical, admin byte-unchanged):**
1. `table-config.ts` `buildServiceColumns(t, showVisibility = true)` — conditionally spreads the leading `visibility` ColumnDef.
2. `service-pricing-table.component.ts` — added `showVisibilityColumn = input<boolean>(true)`; `columns()` passes it to `buildServiceColumns`.
3. wrapper `service-pricing.component.ts` — added pass-through `showVisibilityColumn = input<boolean>(true)`.
4. wrapper `service-pricing.component.html` — `[showVisibilityColumn]="showVisibilityColumn()"`.
5. management `node-workspace.component.html` `@case('commChannels')` + `@case('apps')` — `[showVisibilityColumn]="false"`.

Default `true` everywhere ⇒ admin + management-comms-hub + management-marketplace untouched. The `falconDataTableCell="visibility"` cell template is LEFT in place (harmless when column absent; still used by admin). Shadow-col / header templates key by FIELD name not index, so dropping the column doesn't break alignment.

**Builds:** `nx build management-console` GREEN (b0652d40315bd280), `host-shell` GREEN (4e699c904144981e; first run hit the FLAKY `falcon-grid-input-tw`/`p-zJN_CRPE.js` Stencil-dist chunk error — passed on retry), `admin-console` GREEN (warnings only). Live-UI verify USER-GATED (needs acc-owner session + seeded node, per house convention).

**Known residual (NOT changed, out of scope):** management-console **comms-hub** + **marketplace-applications** still render the same dead visibility toggle (same `canVisibility=false`). Extend by passing `[showVisibilityColumn]="false"` there too if the user wants console-wide consistency.

Related [[project_service_pricing_per_row_loader_wave_12_2026_05_21]].
