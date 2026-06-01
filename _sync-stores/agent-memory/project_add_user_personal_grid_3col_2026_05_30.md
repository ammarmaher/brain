---
name: project-add-user-personal-grid-3col-2026-05-30
description: "Add User wizard Step-1 personal inputs switched 3row×2col → 2row×3col in BOTH consoles (React SoT parity); both dev builds green, no commits"
metadata: 
  node_type: memory
  type: project
  originSessionId: 3272f3b0-4a46-4c36-b9a2-a94a24dcd423
---

**Add User wizard — Step-1 (personal info) input grid: 3-row×2-col → 2-row×3-col, both consoles.** 🟢 BOTH dev builds GREEN, NOT browser/runtime-verified, NO COMMITS. Branch `night-shift-audit/2026-05-30-0128`, repo `C:\Falcon\Falcon\falcon-web-platform-ui`.

**User ask:** "Add User components in admin + management console show inputs in 3-row, 2-column; make it 2-row, 3-column; apply best practice + use brain/SoT skills."

**Where:** the 6 personal inputs (firstName, lastName, userName, nationalId, phone, email) live in `user-personal-step.component.html` (Step 1 of the add-user-wizard), **byte-identical** across both apps:
- `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/user-personal-step/user-personal-step.component.html`
- `apps/management-console/.../user-personal-step/user-personal-step.component.html`

**Change (1 line each, + a 4-line SoT-rationale comment):**
`grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5` → `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5`. 6 fields ÷ 3 cols = 2 rows × 3 cols on desktop.

**Why 3-col is correct (NOT just preference) — design drift, SoT-grounded:**
- [CODE] `Source_of_truth_theme/React/new react/admin/adduser.jsx:116` — Step-1 uses `au-form-grid au-form-grid-3` (**3 cols**); Step-2 (role/status) uses `au-form-grid-2` (2 cols, intentional).
- [CODE] `.../new react/admin/styles.css:2914-2935` — `.au-form-grid-3 = repeat(3,1fr)` desktop; `@media(max-width:1024px){repeat(2)}`; `@media(max-width:640px){1fr}`; `gap:20px 20px`. The Tailwind translation `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` mirrors that 1→2→3 scale at the 640/1024 breakpoints exactly.
- Angular had drifted to a 2-col cap (`md:grid-cols-2`). Field ORDER already matched SoT (no reorder). Gaps already match (`gap-x-5/gap-y-5` = 20px = SoT). `au-form-grid-3` has NO max-width (Angular has none either — correct); only `au-form-grid-2` has max-width 560px.

**Best-practice notes:** wizard renders pane-constrained — [CODE] `org-hierarchy-page-menu.component.html:51` `grid grid-cols-[auto_1fr]` (org-tree + `1fr` `<main>`:84), wizard mounted `:99` with `p-6` content padding — so the responsive 1→2→3 scale is intentional (graceful on tablet), NOT a hard 3-col that would cram. Classes `sm:grid-cols-2`/`lg:grid-cols-3` already emitted elsewhere (contracts-view-contract, contact-group-detail, falcon-org-info-panel) → no Tailwind v4 JIT/safelist risk.

**Did NOT touch:** Step-2 role/status grid (intentionally 2-col per SoT `au-form-grid-2`); Step-3 permissions; any .ts/logic.

**Verification:** `nx build admin-console --skip-nx-cache -c development` EXIT 0 (hash `a8882a8e8c3e8539`); `nx build management-console ...` EXIT 0. Browser-render NOT verified (no dev server up; Add User is a deep authenticated flow). NO COMMITS.

**Concurrency:** `universal-brain/state/current-task.json` was held `in_progress` by ANOTHER live session (comm-mkt card-button task) — did NOT clobber it; ran this as a distinct task. Related: [[project_commkt_card_button_gap_disable_slate_2026_05_30]] (same branch, sibling session).
