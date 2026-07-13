---
name: project_addclient_commchannels_apps_row_vcenter_2026_06_06
description: Add-Client wizard CommChannels (step 3) + Applications (step 4) — activated-row controls (Price Type dropdown + Price Value input) rendered ~7px ABOVE row center; fixed by making the control the sole in-flow cell child + absolute error overlay.
metadata: 
  node_type: memory
  type: project
  originSessionId: 6d2dc1db-e2ed-4dfb-8d79-9fa32bc5e43e
---

Admin-console **Create New Client** wizard, **CommChannels (step 3)** + **Applications (step 4)**: the Price Type `<falcon-angular-dropdown>` and Price Value `<falcon-angular-input>` rendered ~7px ABOVE the row's vertical center on *activated* (visible) rows, looking "stuck to the top" while the Name text and Status badge sat at true center. FIXED 2026-06-06 (claude), branch polishing-v0.4, NO COMMITS.

**ROOT CAUSE (reusable layout trap):** `falcon-angular-data-table` body `<td>` is a FIXED-height band with `vertical-align: middle` ([CODE] libs/falcon-ui-core/src/components/falcon-table/falcon-table.css:150-160; token `--falcon-table-cell-vertical-align: middle`, table.tokens.css:125). The two editable cell templates wrapped their control in a `flex flex-col` of **[control] + [ALWAYS-reserved `h-3.5` (14px) error line BELOW]**. The cell centers the WHOLE ~48px block, so the control (34px) lands in the block's upper half → ~7px above the cell's true center. Name/Status are single centered lines → exactly at center → the asymmetry was visible. Only VISIBLE rows were affected; non-visible rows render a single centered `—————` dash line (already fine). The author's own comment claimed the flex-col "matches the Name/Status cells" — it did NOT, because those cells have no second (error) line.

**FIX (4 edits, 2 byte-identical files, template-only):** make the **control the ONLY in-flow child** of the cell wrapper (`relative flex items-center w-full`) so the td's `vertical-align:middle` centers it exactly like Name/Status; turn the required-error line into an **absolute overlay** `<span class="absolute start-0 top-full text-[10px] leading-[0.875rem] text-falcon-red-500">` rendered ONLY on error. Reserved by POSITION, not flow height → revealing it causes NO layout jump AND does not shift the control off-center; rows stay exactly 60px (`[style.--falcon-table-row-height]="'60px'"`). Non-visible branch → single `flex items-center` dash line. Kept byte-for-byte: SAR-icon positioned-sibling overlay (`start-2.5 top-1/2 -translate-y-1/2`, the slot-wipe workaround), `maxlength`/paste-defence, `[state]` Falcon error styling, `hierarchy.validation.required` key, all Falcon components + tokens (no native HTML, no SCSS, no raw hex/px).

**LESSON:** in a fixed-height `falcon-data-table` cell (vertical-align:middle), a control + a BOTTOM-ONLY reserved helper/error line is NOT vertically centered — the cell centers the combined block, floating the control above center. To keep the control centered WHILE reserving error space with no jump: control = sole in-flow child, error = `absolute top-full` overlay. Do NOT add the reserved line as a flow sibling below (shifts up) — and a symmetric phantom line above would grow the row past its fixed height.

**Files** ([CODE]):
- apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-comm-channels-step/client-comm-channels-step.component.html (priceType + priceValue cells)
- apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-applications-step/client-applications-step.component.html (priceType + priceValue cells)

**Scope:** ADMIN-ONLY — no mgmt "Create Client" wizard exists. Old `flex flex-col w-full` + `h-3.5 ... text-falcon-red-500` reserved-line pattern now absent from the entire apps tree (grep-verified → exactly these 2 files).

**VERIFIED:** `nx build admin-console --configuration=development --skip-nx-cache` EXIT 0 (Hash cef87ff12d103f3f, 21s; only pre-existing unrelated warnings — data-table NG8102 + unused-index/env TS warnings). No spec asserts on these cell DOM structures. ⚠️ Live pixel-verify pending login (full MF dev stack + 4-step wizard auth = blocked by credential policy).

Related [[reference_fe_structure_standard_angular21_2026_06_02]] · [[project_contracts_matrix_falcon_datatable_migration_2026_06_06]] · [[project_datepicker_required_star_red_2026_06_06]].
