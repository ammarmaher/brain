---
section: comm-channels-tab
page: organization-hierarchy
captured: 2026-05-15T20:30+03:00
source_tab: localhost:3000/T2%20Falcon%20Admin (React SoT)
destination_tab: localhost:4200/#/admin-console/org-hierarchy-page (Angular impl, polishing-v0.4)
---

# CommChannels & Services tab — Semantic Mismatches (Round 2)

## Pre-fix live discovery (2026-05-15 night shift, Round 2)

Brief asserted three defects. Live chrome-MCP capture against both SoT and destination
showed only **TWO of three** are real, plus one new bonus copy mismatch.

| # | Defect (per brief)                          | Live finding                                                                                 | Verdict     |
|---|---------------------------------------------|----------------------------------------------------------------------------------------------|-------------|
| 1 | Title `Comm Channels` → `CommChannels & Services` | Confirmed. `en.json:hierarchy.commChannels.title = "Comm Channels"`. `ar.json` same.    | REAL        |
| 2 | Edit affordance: drawer above table → row-expansion + 3 fields + per-lane icons | Wave 14 ALREADY ships row-expansion. SoT actually has 2 modes: `type` (2 fields: dropdown+date) + `value` (1 field). NO per-lane icons in SoT — single Cancel/Save. Implementation already matches SoT exactly. | ALREADY OK  |
| 3 | Footer bg parity with header                | Wave 19 ALREADY applies `--falcon-table-footer-bg = falcon-neutral-30` on the same table. JS `getComputedStyle` confirms both header AND footer container = `rgb(250, 250, 250)`. | ALREADY OK  |
| 4 | (bonus) Actions header copy                 | Dest = "Actions" (plural). SoT = "Action" (singular).                                        | REAL        |

## SoT screenshots captured

- `SOURCE_default.png` (file `ss_22069dx1v`) — default table state, all 9 rows, header/footer tint visible
- `SOURCE_kebab_email_relay.png` (file `ss_1352wb144`) — kebab menu opened on Email Relay (3 items: Disable, Edit Price Type, Edit Price Value)
- `SOURCE_edit_price_value.png` (file `ss_807097um7`) — row-expansion BELOW Email Relay with single `New Price Value` field + Cancel/Save
- `SOURCE_edit_price_type.png` (file `ss_7836ojcmr`) — row-expansion with two fields: `New Price Type` (dropdown=Yearly) + `Effective Date` (5/25/2026) + Cancel/Save
- `SOURCE_kebab_voice_ivr.png` (file `ss_0350v2ivg`) — kebab on Expired row shows 4 items: Do Payment, Disable, Edit Price Type, Edit Price Value
- `SOURCE_edit_price_type_voice_ivr.png` (file `ss_80434g1qx`) — opening edit on Voice IVR automatically closes prior Email Relay edit (single-active pattern)

## Destination screenshots captured

- `DEST_default.png` (file `ss_694092bc6`) — full destination view, tab "CommChannels & Services" active
- `DEST_kebab_email_relay.png` (file `ss_0291a5fs0`) — kebab opens with 3 items matching SoT
- `DEST_edit_price_type_email_relay.png` (file `ss_7443a9fhz`) — row-expansion with New Price Type (dropdown=OneTime) + Effective Date (2026-05-25) + Cancel/Save — pattern matches SoT
- `DEST_table_chrome_zoom.png` (file `ss_3710u6duk`) — header AND footer tinted gray (matches SoT)

## Final fix list (Round 2)

1. **Title** (HIGH): `libs/falcon/src/language/i18n/en.json:1228` and `ar.json:1226`. en `"Comm Channels"` → `"CommChannels & Services"`. ar `"قنوات التواصل"` → `"قنوات التواصل والخدمات"` (already used in the tab strip).
2. **Actions header copy** (LOW): `apps/admin-console/.../org-hierarchy-page-menu.component.ts:244` `actionsHeader.textContent = 'Actions'` → `'Action'`. Bonus alignment with SoT singular form.

## Verified-OK list (Round 2)

- ✅ Inline edit affordance (Wave 14 row-expansion) — 100% SoT parity (two-mode, two fields / one field, Cancel + Save).
- ✅ Table chrome parity (Wave 19 patch) — header AND footer both `falcon-neutral-30` (#fafafa).
- ✅ Kebab menu items + visibility-by-status — matches SoT 1:1.
- ✅ Single-active edit-row (auto-closes prior) — matches SoT pattern.
- ✅ Status badges (Active/Expired/Inactive/Disable) — match SoT.
- ✅ Toggle switch column — matches SoT.

## Out-of-scope notes (logged to backlog, not fixed)

- The `falcon-table-edit-row` panel currently uses `bg-falcon-teal-50` (very pale teal) which renders almost identical to SoT's neutral light gray — visually a wash. No fix needed unless visual diff sensor sees it.
- The Stencil `<falcon-table-tw>` renders the Actions `<th>` as empty; consumer-side patch in `org-hierarchy-page-menu.component.ts` injects text. A future shared upgrade should let `<falcon-angular-data-table>` accept an `actionsHeaderLabel` input so consumer patches are eliminated.
