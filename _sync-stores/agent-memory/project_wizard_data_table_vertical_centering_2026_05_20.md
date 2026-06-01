---
name: wizard-data-table-vertical-centering-2026-05-20
description: "Add Client Step 3/4 chromed cells — bumped row height to 60px + grid-rows-[1fr_auto_1fr] so dropdown/input sit at true cell center while preserving reserved error space"
metadata: 
  node_type: memory
  type: project
  originSessionId: 83decaa1-c904-45aa-815b-66087b5c865e
---

# Wizard Data-Table Vertical-Centering — 2026-05-20

🟢 BUILD-GREEN 2026-05-20 (admin-console hash `3ccba1d65abeec22`, 22.6s). 🔴 NOT runtime-verified — needs browser open on Add Client wizard Step 3/4 to confirm dropdown/input center at y=30 of the 60px row band.

**Bug pattern**: Add Client Step 3 (`client-comm-channels-step`) and Step 4 (`client-applications-step`) priceType + priceValue cells rendered the control at the TOP of the row band, not the visual center. Visibility / Name / Status cells were correctly centered.

**Root cause**: The cell template stacked the control + a reserved-error-space span inside `flex flex-col justify-center gap-1`. Stack height = 32 (control sm) + 4 (gap-1) + 14 (h-3.5 error placeholder) = **50 px**. Centered in the 52 px `<td>` via `vertical-align: middle` gave 1 px top + 1 px bottom. Control center at y=17; cell center at y=26 → control was 9 px ABOVE cell center on every row, even when no error was active. Equal-row-heights contract was preserved (all rows same offset) but visual centering was sacrificed.

**Why:** `justify-center` on a flex-col centers the whole STACK, not just the control. Any reserved-bottom space (the always-present error placeholder) shifted the control upward by half the bottom span's height — geometric, unavoidable without restructuring.

**How to apply**: For consumer cells that combine a centered control with a reserved-below-line (error message, helper text), use the Approach A pattern below. Three approaches considered:

| | Row height | Error space | Control centered? | Trade-off |
|---|---|---|---|---|
| **A. Taller row + grid lanes** (CHOSEN) | 60 px local override | Reserved in bottom 1fr lane | ✅ y=30 = cell center | +8 px row height local to wizard |
| B. Absolute error overlay | 52 px | Renders absolute on overflow | ✅ y=26 | Error can spill 6–10 px into next row |
| C. Conditional error | 52→66 px | Only present on error | ✅ when clean | Layout shift on validation |

## Files changed

- [CODE] `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-comm-channels-step/client-comm-channels-step.component.html` — added `[style.--falcon-table-row-height]="'60px'"` on `<falcon-angular-data-table>`; rewrote `priceType` + `priceValue` cell templates to use `grid grid-rows-[1fr_auto_1fr] h-full w-full` with 3 lanes (top spacer / control band / error band)
- [CODE] `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-applications-step/client-applications-step.component.html` — identical twin changes

## Math verification

- Row height: 60 px (local override via inline style on the data-table)
- Lanes [1fr_auto_1fr]: leftover = 60 − 32 (auto control) = 28 → each 1fr = 14 px
- Top spacer: 14 px
- Control band (32 px) at y = 14 → 46. **Control center at y = 30 = cell center ✓**
- Bottom band (14 px) at y = 46 → 60. Error span (h-3.5 = 14 px) fits exactly
- Visibility / Name / Status cells inherit the 60 px height; `vertical-align: middle` centers their single child unchanged

## What this DOES NOT change

- Platform `--falcon-table-row-height` token stays at 52 px ([CODE] `table.tokens.css:92`)
- Other tables (Users list, Apps tab, Services tab, Comms-Hub, Contact-Groups) are untouched
- `apps-services-tab` and `comm-channels-tab` org-hierarchy tabs are untouched — they don't reserve error space inline (validation is via shadow rows)
- `Alignment Contract v1` headerInset values remain unset on the wizard ([[project_data_table_alignment_contract_v1_2026_05_20]] — outer-edge alignment is still the default)

## Build status

- `nx build admin-console` — GREEN, hash `3ccba1d65abeec22`, 22.6s, zero warnings on the 2 edited files

## See also

- [[project_data_table_alignment_contract_v1_2026_05_20]] — sister fix earlier in this session for HORIZONTAL alignment (header X vs body X)
- [[project_data_table_single_height_token_2026_05_19]] — the single `--falcon-table-row-height` contract this override piggy-backs on
- [[project_add_client_wizard_plain_table_2026_05_17]] — Step 3/4 self-contained data-tables (origin of the inline-error-reservation pattern)
- [[feedback_visual_baseline_guardrail_2026_05_20]] — visual baseline guardrail; this change was approved by Ammar in-session

## Triggers to recall

`data-table vertical centering` / `dropdown not centered in row` / `wizard step 3 4 row height` / `grid-rows 1fr_auto_1fr` / `reserved error space centering` / `falcon-table-row-height 60px wizard`.
