# Task — Add Client wizard CommChannels + Applications: vertically center activated-row controls

- taskId: addclient-commchannels-applications-row-vcenter-2026-06-06
- status: completed
- date: 2026-06-06
- branch: polishing-v0.4 (uncommitted; NO commits per policy)
- repo: C:/Falcon/Falcon/falcon-web-platform-ui
- mode: fe-bug-alignment

## Problem (user)
On the admin Create-New-Client wizard, step 3 (CommChannels) and step 4 (Applications),
the activated rows' Price Type dropdown + Price Value input render at the TOP of the row
instead of vertically centered. "Make the row centered."

## Root cause
`falcon-angular-data-table` body `<td>` = fixed 60px band, `vertical-align: middle`
(falcon-table.css:150-160; token --falcon-table-cell-vertical-align: middle).
Editable cells wrapped the control in `flex flex-col` = [control] + [always-reserved
h-3.5 (14px) error line BELOW]. The cell centers the WHOLE ~48px block, so the 34px
control lands in the block's upper half -> ~7px above true center. Name/Status are single
centered lines -> exactly at center -> visible asymmetry. Only VISIBLE rows affected
(non-visible rows = single centered dash line).

## Fix (template-only, 4 edits across 2 byte-identical files)
- Control = the ONLY in-flow child (`relative flex items-center w-full`) -> centered by
  the td's vertical-align:middle, level with Name/Status.
- Required-error line -> absolute overlay `absolute start-0 top-full text-[10px]
  leading-[0.875rem] text-falcon-red-500`, rendered only on error -> reserved by position,
  not flow height -> no layout jump, rows stay 60px.
- Non-visible branch -> single `flex items-center` dash line.
- Preserved byte-for-byte: SAR-icon positioned-sibling overlay, maxlength/paste-defence,
  [state] Falcon error styling, hierarchy.validation.required key, all Falcon components +
  tokens (no native HTML, no SCSS, no raw hex/px).

## Files
- apps/admin-console/.../add-client-wizard/client-comm-channels-step/client-comm-channels-step.component.html
- apps/admin-console/.../add-client-wizard/client-applications-step/client-applications-step.component.html

## Verification
- nx build admin-console --configuration=development --skip-nx-cache -> EXIT 0
  (Hash cef87ff12d103f3f, 21s). Only pre-existing/unrelated warnings (data-table NG8102 +
  unused-index/env TS warnings).
- No spec asserts on these cell DOM structures.
- grep: old `flex flex-col`+`h-3.5...red-500` reserved-line pattern absent from whole apps tree.
- Live pixel-verify PENDING login (full MF dev stack + 4-step wizard auth = credential policy).

## Scope notes
ADMIN-ONLY — no management-console "Create Client" wizard exists. 2 files only.
NO COMMITS.

## Memory
project_addclient_commchannels_apps_row_vcenter_2026_06_06.md (+ MEMORY.md pointer).
