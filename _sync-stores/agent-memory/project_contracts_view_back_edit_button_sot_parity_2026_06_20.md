---
name: project_contracts_view_back_edit_button_sot_parity_2026_06_20
description: Contract-details view Back/Edit buttons aligned to SoT in both admin + mgmt consoles; falcon-angular-button has NO icon input (project via slot) and falcon-icon-edit is not a real glyph (use falcon-icon-pencil).
metadata: 
  node_type: memory
  type: project
  originSessionId: 1d9f4a52-ed00-4666-885d-9e073f063bb2
---

Contracts → Contract Details (`contracts-view-contract`) Back/Edit buttons did not match the React SoT ([CODE] `Source_of_truth_theme/latest/admin/contracts-details.jsx:609-624`: Back = `IcArrowLeft` + `cmBackToList` "Back to list" secondary; Edit = pencil svg + `cmEdit` "Edit" primary, shown when `!readOnly`).

**Three drifts found + FIXED (FE-only, NO commits, both `nx build` admin-console + management-console GREEN, hash e3dfd43be6940f7a, 2026-06-20):**
1. Back label used `button.back` → renders "Back" (not "Back to list"). Added i18n key `contractsCostManagement.view.backToList` (en "Back to list" / ar "العودة إلى القائمة") and pointed both consoles at it. Did NOT touch shared `button.back` (used by wizards).
2. Back button had NO icon. Added `<i slot="icon-start" class="falcon-icon falcon-icon-arrow-left rtl:rotate-180 text-xs">`.
3. Admin Edit button used `icon="falcon-icon falcon-icon-edit"` — **doubly dead**: see gotchas below. Replaced with the slot pattern + `falcon-icon-pencil`.

**REUSABLE GOTCHAS (the why):**
- `<falcon-angular-button>` (wrapper `libs/falcon-ui-core/src/angular-wrapper/components/falcon-button/`) exposes **NO `icon` input** — only `[slot=icon-start] / [slot=label] / [slot=icon-end]` are projected (via `<ng-content select>`). Passing `icon="..."` is a silent no-op. Canonical pattern = [CODE] `templates-details.component.html:13-20`: `<i slot="icon-start" class="falcon-icon falcon-icon-X text-xs" aria-hidden>` + `<span slot="label">{{ key | translate }}</span>`. `falcon-button-tw` detects slots via `host.querySelector('[slot=...]')`; works fine under zoneless (templates-details/flow-card ship it).
- `falcon-icon-edit` is **NOT a real glyph** in `libs/falcon-theme/src/styles/falcon-icons.css` → renders tofu/nothing. Platform-standard Edit glyph = `falcon-icon-pencil` (org-hierarchy "Edit Node", templates, contact-groups all use it). `falcon-icon-arrow-left` (\e91a) and `falcon-icon-pen-to-square` (\ea0b, boxed pencil) DO exist.

Mgmt console = Back only (client view-only, matches SoT `readOnly`); admin = Back + Edit (Edit gated by `canEdit()` = `detail.canEdit === true`). Build-green only; live-UI visual confirmation USER-GATED. Edit-glyph choice (pencil vs pen-to-square) = platform-consistency call; SoT's literal shape is the boxed pencil (pen-to-square) but every other app Edit btn uses plain pencil. Related [[project_contract_rate_matrix_combination_render_staleness_2026_06_20]].
