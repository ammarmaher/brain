# Tabs Wave Plan — Organization Hierarchy

**Date:** 2026-05-14
**Scope:** tabs only above `falcon-node-details-section`
**Author:** Brain SK orchestrator (Adnan)
**Target route:** http://localhost:4200/#/admin-console/org-hierarchy-page

## Wave overview

| Wave | Title | Status | Files touched (est.) | Falcon components | Target parity |
|---|---|---|---|---|---|
| 1 | Tabs source re-check | DONE | report only | — | knowledge |
| 2 | Current Angular tabs inspection | DONE | report only | — | knowledge |
| 3 | Component mapping & wave plan | DONE | report only | — | knowledge |
| 4 | Shared component upgrade plan | DONE — NO UPGRADES NEEDED | report only | — | knowledge |
| 5 | comm-channels tab → Falcon data-table | PENDING | 3-5 | 5 new Falcon usages | 85%+ visual |
| 6 | apps-services tab inherits Wave-5 | PENDING | 1-2 | 0 (shared component) | 85%+ visual |
| 7 | org-info-panel — wire (ngModelChange) + uploader + dropdowns | PENDING | 2-3 | 2 new Falcon usages | 80%+ visual |
| 7b | user-details-page — verify + targeted OTP-before-save | PENDING | 2-4 | 3 new Falcon usages | 70%+ visual |
| 8 | settings-tab — radio-group + tag + input-number + confirm-dialog | PENDING | 2-3 | 5 new Falcon usages | 85%+ visual |
| 9 | OTP & verification flow inside Personal Info (user-details) | PENDING (rolled into 7b) | — | — | — |
| 10 | Build + visual parity check (admin-console nx build GREEN, code-level diff) | PENDING | — | — | — |
| 11 | Smoke test & regression | PENDING | — | — | — |
| 12 | Reports + PDF + Obsidian + Git | PENDING | report + git | — | — |

---

## Wave 5 — comm-channels-tab → Falcon data-table

### Goal
Migrate `<app-applications-table>` (the inner table used by both Tabs 1 + 2) from hand-rolled `<table>` to `<falcon-angular-data-table>` with cell templates. This single change benefits both tabs.

### Files to edit
1. `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.ts`
2. `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html`
3. (Optional) `models/models.ts` for any new `ApplicationRow` column metadata

### Falcon components introduced
- `<falcon-angular-data-table>` (with `[columns]`, `[data]`, `[rowsPerPageOptions]`, `[showCustomFooter]=false`)
- `<falcon-angular-switch>` (visibility cell template)
- `<falcon-angular-status-badge>` (status cell template)
- `<falcon-angular-calendar>` (replace legacy `<falcon-calendar>` in inline edit row)
- `<falcon-angular-empty-state>` (via `[emptyData]` config)

### Cell template approach
Use `<ng-template falconDataTableCell="<columnKey>" let-row>` inside `<falcon-angular-data-table>` body:
```html
<falcon-angular-data-table [columns]="columns" [data]="apps()" ...>
  <ng-template falconDataTableCell="visibility" let-row>
    <falcon-angular-switch [checked]="row.visible" (valueChange)="toggleVisibility(row, $event)" size="sm" />
  </ng-template>
  <ng-template falconDataTableCell="status" let-row>
    @if (row.visible && row.firstActivation && row.status) {
      <falcon-angular-status-badge [severity]="row.status" size="sm" />
    } @else { <span class="text-falcon-neutral-400">—————</span> }
  </ng-template>
  <ng-template falconDataTableCell="action" let-row>
    <!-- Use [rowActions] config with conditional per-status array OR keep current dropdown -->
  </ng-template>
</falcon-angular-data-table>
```

### Row actions per status (BIZ-010 from registry)
| status | actions |
|---|---|
| `active` | Disable, Edit Price Type, Edit Price Value |
| `expired` | Do Payment, Disable, Edit Price Type, Edit Price Value |
| `disable` / `disabled` | Enable, Edit Price Type, Edit Price Value |
| `inactive` | Do Payment, Disable |

Map via a per-row `[rowActions]="actionsFor(row)"` getter.

### Inline edit row preservation
The existing `@if (editingId() === row.id)` expansion can be kept by injecting a `<ng-template falconDataTableRowExpansion>` (if data-table supports it). If not, use the legacy approach of catching `(rowAction)` outputs that trigger `editingId.set(row.id)` and rendering the edit row as a SEPARATE row in the data array (or use the existing component-local `@if` block above the data-table).

**Fallback:** if `falcon-angular-data-table` doesn't natively expose a row-expansion template, keep the inline edit `<tr>` block as a separate region rendered ABOVE or INSIDE a custom footer. Decision: try data-table-native first; fall back if blocked.

### Validation
- No new validation — table is mostly display + inline edit. Existing validators in `applications-table` (priceValue numeric, effectiveDate >= today) stay.

### Acceptance criteria (Wave 5)
- [ ] `<table>` element removed from `applications-table.component.html`
- [ ] `<falcon-angular-data-table>` renders all 9 columns
- [ ] Visibility toggle works via `<falcon-angular-switch>`
- [ ] Status column uses `<falcon-angular-status-badge>` (or shows `—————` correctly)
- [ ] Per-status row action menu shows correct actions
- [ ] Inline edit row still functional (price-type / price-value)
- [ ] Pagination shows real X-Y of Z (not hard-coded "1 of 1")
- [ ] Build green: `nx build admin-console` returns 0 errors
- [ ] No PrimeNG imports
- [ ] Tailwind tokens only
- [ ] No console errors on route load

### Visual parity target: 85%

---

## Wave 6 — apps-services-tab inherits Wave-5

### Goal
Verify that the data-table migration in Wave 5 propagates correctly to `<app-apps-services-tab>`. No new code unless apps-specific divergence is needed.

### Files to edit
- `apps-services-tab.component.html` only if title-row needs adjustment (panel header text already differs from tab label per source — handled in Wave 5)

### Acceptance criteria (Wave 6)
- [ ] `<app-apps-services-tab>` renders the new Falcon data-table
- [ ] Mock apps rows (8 items) display correctly
- [ ] Status badges match: 2 active, 2 expired, 1 disable, 2 inactive
- [ ] Panel header reads "Applications" (per React `apps.jsx:495`) — confirm via i18n key
- [ ] Build green

### Visual parity target: 85%

---

## Wave 7 — falcon-org-info-panel enhancements

### Goal
Bring `<falcon-angular-input>` edits into the dossier (currently no `(ngModelChange)`), add `<falcon-angular-single-uploader>` for client picture, wire `back` output, and add `Validators.required` on `accountName`+`financeId`.

### Files to edit
1. `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.ts`
2. `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html`
3. `apps/admin-console/src/app/features/org-hierarchy-page/services/hierarchy-page-state.service.ts` — add `updateInfoField(key, value)` mutator (or similar)

### Falcon components introduced
- `<falcon-angular-single-uploader>` (picture replacement in edit mode)
- `<falcon-angular-dropdown>` (classification, sub-classification, country, city, authority type)

### Per-field type table (after enhancement)
| key | type | required? |
|---|---|---|
| accountName | input | YES |
| financeId | input | YES |
| classification | dropdown | NO |
| subClassification | dropdown | NO |
| entityName | input | NO |
| authorityType | dropdown | NO |
| sector | input | NO |
| budget | input | NO |
| country | dropdown | NO |
| city | dropdown | NO |
| district | input | NO |
| street | input | NO |
| building | input | NO |
| postal | input | NO |
| addlAddr | input | NO |
| anotherId | input | NO |
| vat | input | NO |

### Acceptance criteria (Wave 7)
- [ ] Edits to inputs in edit mode update local form state and persist via `state.saveInfoEdit()` (no-op stub today — confirm Bridge or accept in-memory-only per Wave 12 decision)
- [ ] Single-uploader replaces single-letter avatar in edit mode
- [ ] `accountName` and `financeId` show `* ` and red error message when empty
- [ ] `back` output emits on cancel (`(back)="state.closeInfo()"` handler now fires)
- [ ] Build green

### Visual parity target: 80%

---

## Wave 7b — user-details-page polish (where "Audit/RuleStatus/Permission" patterns belong)

### Goal
Confirm the existing 3-tab pattern (Personal Information / Role & Status / Permissions & Privilege) in `<app-user-details-page>` is functional + polished. Apply the brief's *intent* (image uploader + 6 required fields + OTP-gated phone/email + status/role/permissions dropdowns + checkbox group).

### Files to edit (after inspection — confirm scope first)
1. `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.ts`
2. `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html`
3. (maybe) state service additions for verify-before-save

### Decision gate before Wave 7b
After Wave 7, **read** the user-details files. If parity is already ≥60% (IMPLEMENTATION_SCORECARD lines 21-22 say ~65%), Wave 7b becomes:
- Wire `<falcon-angular-phone-field>` + `<falcon-angular-otp>` integration with `OtpMockService`
- Add `Validators.required` on the 6 personal fields
- Add `cannotSave when phone/email not verified` business rule (VAL-005, VAL-006)
- Verify status dropdown disabled-in-edit (BIZ-009)

If parity is <40% (significant gap), defer to a follow-up wave and log as GAP-IMPL-007.

### Falcon components introduced (conditional)
- `<falcon-angular-phone-field>` (with `[verifyButton]="true"`)
- `<falcon-angular-otp>` (length=6, all-zeros pass per `OtpMockService`)
- `<falcon-angular-dropdown>` (status, role, permission group)
- `<falcon-angular-radio-group>` × 2 (WhatsApp/Voice checker level)
- `<falcon-angular-single-uploader>` (user picture replacement)

### Acceptance criteria (Wave 7b)
- [ ] Personal Info tab: 6 fields all have `* ` required indicator
- [ ] Phone Number field has Verify button → opens OTP modal → all-zeros passes
- [ ] Email Address field has Verify button → opens OTP modal → all-zeros passes
- [ ] Save button disabled until both phone+email are verified (when in pending state)
- [ ] Status dropdown rendered, disabled in edit mode per source
- [ ] Role dropdown rendered, enabled
- [ ] Permission group dropdown rendered, 4 options
- [ ] CommChannel checker level: 2 radio-groups (WhatsApp + Voice) with 3 options each
- [ ] Build green

### Visual parity target: 70%

---

## Wave 8 — settings-tab upgrades

### Goal
Replace hand-rolled UI in `<app-client-settings-step>` with Falcon primitives. Add IP delete confirmation popup. Keep dashed-button via Tailwind tokens.

### Files to edit
1. `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.ts`
2. `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html`
3. (Optional) `settings-tab.component.html` — wire confirm dialog if hosted at tab level

### Falcon components introduced
- `<falcon-angular-radio-group>` (password security Normal/Advanced)
- `<falcon-angular-tag>` (closable IP chips)
- `<falcon-angular-input-number>` (3 account limits)
- `<falcon-angular-input>` `[readonly]` (3 "Current existing" cells)
- `<falcon-angular-confirm-dialog>` (IP delete confirmation)

### Dashed "Add IP" button
Use `<falcon-angular-button variant="ghost" class="border border-dashed border-falcon-teal-700 text-falcon-teal-700 bg-white">` — Tailwind tokens for dashed look. **Defer** a real `variant="dashed"` API to a future Falcon Button upgrade backlog item.

### Acceptance criteria (Wave 8)
- [ ] Password security uses `<falcon-angular-radio-group>` with rich card-style labels
- [ ] Allowed IPs uses `<falcon-angular-tag>` with `×` close → opens confirm dialog
- [ ] Confirm dialog title: "Delete IP" message: "Are you sure you want to delete this IP?" Accept: Delete (severity=danger) Reject: Cancel
- [ ] Add IP button uses Tailwind dashed border (token-based)
- [ ] IP input validates IPv4 and IPv6 — invalid shows red error message inline
- [ ] Account limits use `<falcon-angular-input-number>` with min=0 max=9999 step=1
- [ ] "Current existing" uses `<falcon-angular-input>` `[readonly]="true"` size="sm"
- [ ] Build green
- [ ] Existing view/edit/save/cancel flow unchanged (still working)

### Visual parity target: 85%

---

## Wave 9 — OTP + verification flow (rolled into Wave 7b)

OTP is intrinsic to Personal Info verify flow → see Wave 7b acceptance criteria.

---

## Wave 10 — Build + visual parity check

### Goal
- `nx build admin-console --skip-nx-cache` returns 0 errors
- Code-level visual diff against React using:
  - Compare Tailwind classes used in tab templates vs React class definitions in `styles.css`
  - Verify spacing/border-radius/typography tokens align with `falcon-tailwind-tokens.css`

### Files
- None (verification only)

### Acceptance criteria
- [ ] All 4 tab routes load without console error
- [ ] No PrimeNG / PrimeIcons imports in tab files
- [ ] No `*.scss` / `*.css` files created in tab folders
- [ ] No arbitrary Tailwind values (e.g. `bg-[#hex]`) — only `bg-falcon-*` tokens
- [ ] Build hash captured

### Visual parity target: 85%+ aggregate across 4 tabs

---

## Wave 11 — Smoke test & regression

### Goal
Verify the existing page route still works AND the new tab content renders correctly.

### Approach
Use code-level inspection + read template state — no live UI testing since browser MCP isn't configured to drive both Angular + React simultaneously in this session.

### Acceptance criteria
- [ ] Route `http://localhost:4200/#/admin-console/org-hierarchy-page` lands
- [ ] Selecting a node shows 4 tabs (hierarchy/commChannels/apps/settings)
- [ ] Selecting root shows 2 tabs (hierarchy/settings)
- [ ] Tab switching works
- [ ] Hierarchy tab still renders tree + users table + node header
- [ ] No breakage to wizards, status badges, node drawer (sanity check imports)

---

## Wave 12 — Reports + PDF + Obsidian + Git

### Deliverables
1. `TABS_IMPLEMENTATION_SUMMARY.md` — per-wave outcome summary
2. `TABS_VALIDATION_REPORT.md` — validation rules applied
3. `TABS_BUSINESS_RULE_REPORT.md` — business rules applied
4. `TABS_VISUAL_PARITY_REPORT.md` — per-section parity %
5. `TABS_TEST_REPORT.md` — smoke test results
6. `TABS_GAP_REPORT.md` — remaining gaps
7. `TASK_REPORT.md` — final consolidated report
8. `TASK_REPORT.pdf` — via market-report-pdf or pdf-creator skill
9. Update Brain Outputs page registry:
   - `PAGE_SCORECARD.md` (tab-related dimensions only)
   - `UI_UX_RULES.md` (tab rules now Applied)
   - `VALIDATION_RULES.md` (Wave 7b/8 validators)
   - `BUSINESS_RULES.md` (BIZ-010/011/014)
   - `GAP_REGISTRY.md` (new gaps logged, others resolved)
   - `VISUAL_PARITY_SCORECARD.md` (sections 11/12/9/10)
   - `IMPLEMENTATION_SCORECARD.md` (features 23/25/26/30)
   - `COMPONENT_MAPPING.md` (new Falcon components engaged)
10. Mirror `Brain Outputs` → `Brain SK\outputs` (additive sync only)
11. Update Obsidian indexes if linked
12. Commit + push:
    - Implementation: `enhance organization hierarchy tabs`
    - Brain reports: `docs(brain-sk): add organization hierarchy tabs night shift report`

---

## Stop conditions

- **Hard stop**: Build fails after 2 fix-attempts on the same wave
- **Hard stop**: Falcon component lacks required API (e.g. data-table cell template) — log gap, defer wave
- **Soft pause**: Per-tab visual parity stays below 60% after 5 repair rounds — log as remaining gap, continue to next wave
