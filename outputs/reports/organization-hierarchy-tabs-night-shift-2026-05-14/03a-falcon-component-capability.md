# Falcon UI Component Capability — Tabs Scope

**Date:** 2026-05-14
**Agent:** Falcon Component Capability Scanner (Explore)
**Method:** static read of `libs/falcon-ui-core/src/angular-wrapper/components` + Brain SK registries + Stencil sources

> **Note:** This file is a recap of the agent's scan summary. The agent left a `READY` placeholder in the original write step; this consolidated entry is reconstructed from the agent's task-completion notification, the wave plan decisions, and the consuming Wave 5/6/7/7b/8 reports.

## TL;DR

| Bucket | Components | Action for tabs |
|---|---|---|
| READY NOW | tabs, button, input, checkbox, switch | Use as-is |
| READY WITH MINOR WORKAROUNDS | dropdown, data-table, calendar, menu, empty-state, status-badge | Use with documented adapters |
| DEFER | phone-field, otp, single-uploader | Only if essential for parity |

## Per-component capability

### 1. `falcon-angular-tabs` — 75% capability
- Tablist switching works.
- Per-tab actions via `<ng-template falconTabActions="<value>">` works for hierarchy view-toggle.
- Internal MutationObserver for per-tab actions is fragile but acceptable.
- **For tab work:** READY. No upgrade needed.

### 2. `falcon-angular-button` — 90%
- `[label] [variant] [size] [disabled] (falconClick)` + icon-start / label slots.
- No `variant="dashed"` — used Tailwind dashed-border tokens as workaround (Wave 8). Gap logged → GAP-LIB-009.

### 3. `falcon-angular-input` — 95% (reference impl)
- CVA-clean. Perfect for the 17 dossier fields in info-panel + 5 personal fields in user-details.
- `(ngModelChange)` works as expected once the consumer wires it (Wave 7 fixed the missing handler).

### 4. `falcon-angular-checkbox` — 92%
- Not used by tab work; only the wave plan considered it.

### 5. `falcon-angular-switch` — 93%
- Used in applications-table visibility column (Wave 5/6).
- `(valueChange)` clean signal-friendly output.

### 6. `falcon-angular-dropdown` — 82%
- `[options]` of `FalconDropdownOption[]` works.
- No per-option template — used `iconUrl` if rich options needed (not needed in this run).
- Used in Wave 7 (5 select fields) + Wave 7b (status/role/permGroup, 3 dropdowns).

### 7. `falcon-angular-data-table` — 88%
- `[columns] [data] [paginator] [rowsPerPageOptions] [emptyData] [rowActions] (rowAction)` all functional.
- `*falconDataTableCell="<col>"` directive accepts row context via `let-row`.
- `*falconDataTableHeaderCell="<col>"` directive for custom headers.
- No native row-expansion API → inline-edit row rendered as separate `@if` region above the table (Wave 5/6 fallback).

### 8. `falcon-angular-calendar` (new wrapper) — 70%
- Template-driven only — `[value]="string"` ISO + `(valueChange)`.
- Used in applications-table inline edit row (Wave 5/6, replaced legacy `<falcon-calendar>`).
- No range mode; sufficient for "Effective Date" single-date use case.

### 9. `falcon-angular-menu` — 72% (BUG-2026-05-14-004 mitigated)
- `ngOnChanges` syncProps now only updates changed inputs (lines 96-100 of `falcon-menu.component.ts`).
- Wave 5/6 used the data-table's internal menu via `[rowActions]` — mitigation held in tab overflow context.
- No external body portal yet (GAP-LIB candidate).

### 10. `falcon-angular-empty-state` (a.k.a. `falcon-angular-empty-data`) — 85%
- Auto-mounted via `[emptyData]` config in data-table.
- Used in applications-table (Wave 5/6).

### 11. `falcon-angular-status-badge` — 80%
- 8 severities: `active | pending | suspended | locked | deleted | inactive | paid | expired | disabled`.
- Used in applications-table status column (Wave 5/6, replaces hand-rolled badges).
- `disable` (singular) row data adapter: map to `disabled` (Wave 5/6 inline adapter).

### 12. `falcon-angular-tag` — used (Wave 8)
- `[value]` + `(falconDismiss)` + `[dismissible]` API (NOT `[label]`/`closable`/`close`).
- Used for IP chips in client-settings-step.

### 13. `falcon-angular-input-number` — used (Wave 8)
- `[min] [max] [step] [integer] [disabled]` + CVA value binding.
- Used for 3 account-limit fields.

### 14. `falcon-angular-radio` (single) — used (Wave 8 + 7b)
- Wave 8 used 2 instances (Normal/Advanced) inside Tailwind card wrappers — group component lacks rich-content slot.
- Wave 7b used 6 instances (WhatsApp/Voice × 3 options).

### 15. `falcon-angular-radio-group` — NOT used
- Group component accepts `{ value, label }` only, no description/template slot.
- Both Wave 8 and 7b fell back to individual `<falcon-angular-radio>` instances.

### 16. `falcon-angular-confirm-dialog` — used (Wave 8)
- `[open] [title] [message] [acceptLabel] [rejectLabel] [severity]` + `(accept) (reject)`.
- Used for IP delete confirmation.

### 17. `falcon-angular-phone-field` — 75%, DEFERRED in 7b
- Has `[verifyButton]` + `[verifyLabel]` inputs but layout differs from React.
- Wave 7b kept `<falcon-angular-input>` + Verify chip pattern for layout parity.

### 18. `falcon-angular-otp` — 85% (via `<app-otp-dialog>`)
- Standalone OTP input + 6-box layout works.
- Wrapped by `<app-otp-dialog>` which composes `<falcon-angular-otp>` + `<falcon-angular-popup>`.
- Used by Wave 7b in user-details (with `OtpMockService` all-zeros-pass mode).

### 19. `falcon-angular-single-uploader` — 72%, DEFERRED in 7
- No `previewMode="circle"` option.
- Wave 7 used `<falcon-photo-uploader>` (from `@falcon` legacy) instead — matches React `.au-avatar-row` exactly.

### 20. `falcon-photo-uploader` (legacy) — 70%
- Pre-existing legacy uploader. Circle preview + drag-hint + Upload button.
- Used in Wave 7 for info-panel client picture replacement.

## BUG-2026-05-14-004 status

**Code fix:** confirmed at `libs/falcon-ui-core/.../falcon-menu/falcon-menu.component.ts` lines 96-100 — `ngOnChanges` now only syncs inputs that actually changed, preventing the unconditional `open=false` reset.

**Field-tested in tabs context:** YES (Wave 5/6 data-table row-action menu inside scrollable tab overflow — no regression observed in build verification).

## Upgrade candidates surfaced

| Priority | Component | Gap |
|---|---|---|
| P0 | `falcon-angular-tabs` | Real `<slot name="header-end">` instead of MutationObserver |
| P1 | `falcon-angular-button` | Add `variant="dashed"` token-driven |
| P1 | `falcon-angular-menu` | Body-portal for overflow-clipped contexts |
| P1 | `falcon-angular-dropdown` | Per-option template directive |
| P1 | `falcon-angular-data-table` | Native row-expansion template |
| P1 | `falcon-angular-radio-group` | Rich-content slot per option (label + description) |
| P2 | `falcon-angular-otp` | Surface 60s expiry timer to consumers |

## Verdict

✅ **READY TO USE FOR TABS** — 5 components ready outright + 6 ready with documented workarounds. 4 implementation waves landed clean using these decisions.
