# Task History — Admin Contracts "Contract Information" card-chrome + node-header alignment fix

- **taskId:** contracts-admin-info-card-chrome-align-2026-06-07
- **date:** 2026-06-07
- **agent:** claude (brain-loaded)
- **scope:** apps/admin-console — Contracts & Cost Management → Contract Information tab (view + edit). NO commits.
- **status:** COMPLETED — build + test green. Live pixel verify pending (credential policy).

## What the user reported
View + edit of the contract (admin console) had a "bordering that is not shown on the view" + "background color" problem, and the `falcon-node-details-section` header was misaligned in both view and edit. Asked to match the SoT ✓ screenshots and load the brain.

## Root cause (deep-dive, source-cited)
TARGET = SoT React `Source_of_truth_theme/.../admin/contracts-details.jsx` + `admin/styles.css`:
`tabs → .node-header (avatar+name LEFT · actions RIGHT, align-items:center, OUTSIDE card) → .info-panel CARD {border 1px #e5e7eb · radius 12px · bg #fff}` with `.info-panel-header "Information" border-bottom` + body (grid A · SOLID border-top section · grid B). SAME panel for view AND edit. Falcon tokens map EXACT (neutral-0=#fff, neutral-200=#e5e7eb=React `--border`).

- VIEW: "Information" was an `<h3>` OUTSIDE the card; flat `p-5` card, no header band, dashed section split.
- EDIT: tabs+header+form in ONE big `rounded-md` card with `falcon-node-details-section` INSIDE it (`withPadding=false` → flush-left vs padded tabs/form → MISALIGNED) + fields floating with no Information card.
- BACKGROUND: app canvas is white `bg-falcon-neutral-0`; SoT page is gray `#f5f6f7` → white-on-white, no pop. Match token = `neutral-50 #f5f7f8`.

## Fix (3 files, chrome/layout markup only)
1. `contracts-view-contract.component.html` — `.info-panel` chrome (header band + `border-b` + `p-6` body + SOLID section `border-t`).
2. `contracts-edit-contract.component.html` — rewrite: header OUTSIDE the (deleted) big card, form in the IDENTICAL Information card as view, fixed-height scroll preserved → fixes alignment + restores card.
3. `contracts-cost-management.component.html` — `bg-falcon-neutral-50` on the contracts `<section>` (user-chosen: contracts page only).
NO shared-component edit. Zero logic/binding/validation change.

## Verification
- `nx build admin-console --configuration=development` EXIT 0 (×2, `--skip-nx-cache`).
- `nx test admin-console` → 784/784 vitest GREEN (39 files); view-spec 14 + edit-spec 15.
- Live UI: PENDING login.

## Follow-ups offered (not done)
- mgmt-console view card (identical pattern) parity.
- add-wizard header alignment (same old `node-details-section pb-4` pattern).
- global gray page (if app-wide SoT parity wanted).

## Memory
`project_contracts_admin_info_card_chrome_align_2026_06_07.md` (+ MEMORY.md index line). Plan: `C:\Falcon\plans\contracts-admin-card-chrome-fix\PLAN.md`.
