---
name: project_canonical_date_format_dd_mmm_yyyy_2026_06_20
description: Platform date display is now centralized as dd-MMM-yyyy via @falcon/ui-core/date-format + falconDate pipe; picker default + all display sites converted
metadata: 
  node_type: memory
  type: project
  originSessionId: d5844dbf-f311-4c94-8157-05530b1112d7
---

Falcon FE date-format consolidation (2026-06-20, claude, FE-only, NO commits). Fixed the
inconsistent date views (mm/dd/yyyy · MMM-dd,-yyyy · mediumDate) across marketplace,
comm-channels, contract list + details. Target format: **`dd-MMM-yyyy` (22-Aug-2026)**,
fixed English month, locale-independent (same under en/ar/RTL — user decision).

**Single source of truth:** `libs/falcon-ui-core/src/utils/falcon-date-format.ts`
— `formatFalconDate()` + `parseFalconDate()`, NO `Intl` (Intl drifted en-US `Aug 22, 2026`
vs en-GB `22 Aug 2026` — the root of the bug). Exposed via dedicated tsconfig subpath
`@falcon/ui-core/date-format` (mirrors `@falcon/ui-core/tailwind`) + main barrel. Angular
consumer surface = standalone `FalconDatePipe` (`| falconDate`) in `libs/falcon` shared-utils
(re-exported through `libs/falcon/src/index.ts`).

**TZ rule (important):** bare dates (`yyyy-mm-dd` / `dd-MMM-yyyy`) formatted from digits
(tz-free); full ISO **instants** read back in **UTC** — preserves the service-pricing
`effectiveDate` SoT (`| date:…:'UTC'`, end-of-day) and removes a latent ±1-day bug the old
local-formatted call sites carried.

**Picker (`falcon-date-picker-tw` + legacy shadow `falcon-date-picker` + Angular wrapper):**
`displayValue` → `formatFalconDate`, `parseInputValue` → `parseFalconDate` (manual typing kept),
placeholder `YYYY-MM-DD` → `DD-MMM-YYYY`. **Stored/emitted `falcon-change` value + calendar
min/max stay ISO** — display-only change, zero form/payload impact. Stencil dist MUST be rebuilt
(`nx build falcon-ui-core`) for the runtime to pick it up.

**~22 display sites converted, 5 divergent recipes deleted:** comm-mkt-view ×4 + comm-mkt-card ×4
(`M/d/yyyy`→`falconDate`); contract list admin+mgmt, view admin+mgmt, edit creation-date
(`formatDate` bodies → `formatFalconDate`, dropped 3 dead `currentLocale` helpers + 4 stray
`DatePipe` imports); service-pricing-table (`mediumDate:'UTC'`→`falconDate`);
user-details `formatJoinedDate` (`toLocaleDateString('en-GB')`→`formatFalconDate`).
LEFT (out of scope): `angular-playground` demo (`mediumDate`, non-prod) + `contact-group.mapper`
`dd/MM/yyyy`+time pair (contact-groups, date+time split — optional follow-up).

**DATA-TABLE DATE-COLUMN SWEEP (follow-up):** 3 cell render paths — (A) `render:` fn, (B) built-in
`col.type` switch, (C) custom `falconDataTableCell` template. `falcon-table-tw.renderCell` PREVIOUSLY had NO
`'date'` branch (a `type:'date'` col rendered RAW ISO via `String(value)`). APPLIED across two passes:
(1) `service-pricing models.ts:463 formatIsoToDisplay` `M/d/yyyy`→`formatFalconDate` (First
Activation/Activation/Renew table cols render pre-formatted mapper strings, NOT raw — fix in mapper).
(2) Best-practice set (user approved 2026-06-20): **central net** — `falcon-table-tw renderCell` now has a
guarded `col.type==='date'` → `formatFalconDate` branch (so ANY `type:'date'` col is masked, no per-cell
template); **contact-groups list** creationDate (`contact-group.mapper.ts formatDate`→`formatFalconDate`,
keeps paired creationTime); **templates list + details createdAt/updatedAt** (`templates-read.mapper.ts
dateTimeSplit` date portion→`formatFalconDate`, keeps time; edited in BOTH admin & mgmt copies — approval
timeline cell left alone = MOCK data). Mapper `Date`-instance path uses LOCAL parts (consistent with the
paired local time). LEFT OUT (intentional): testing-charging/old-test-charging dev harness + angular-playground
demo (full timestamps matter). Contracts list/comm-mkt table cells masked in the main pass (method/pipe).
Builds: host-shell `db583f89` then admin+mgmt+host-shell 3/3 GREEN.

**GATES:** `nx build admin-console management-console host-shell` GREEN 3/3 (incl. falcon-ui-core
Stencil rebuild) + formatter 12/12 unit tests (incl. UTC-instant cases) + both contract specs'
`formatDate` expectation updated `Feb-01,-2026`→`01-Feb-2026`. Contract component specs DON'T LOAD
in vitest (PRE-EXISTING: admin = unresolved MF remote `@host-shell/shared/organization-hierarchy-tree`;
mgmt = missing `MESSAGE_PRIORITIES` DI token in TestBed) — NOT caused by this change; formatDate logic
covered by the formatter unit tests. Live-UI browser verify USER-GATED (MF stack + login). Related
[[project_contract_rate_matrix_combination_render_staleness_2026_06_20]] · [[reference_fe_structure_standard_angular21_2026_06_02]].
