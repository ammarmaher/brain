---
name: project_rounded_surface_xl_already_resolved_2026_05_29
description: "rounded-surface-xl \"undefined platform-wide\" was a FALSE ALARM — already fully migrated to rounded-[14px] on polishing-v0.4; on origin/main it IS defined (per-app tailwind.css, 24px). Value drift 14px vs 24px."
metadata: 
  node_type: memory
  type: project
  originSessionId: cb8e8541-cd1b-44f4-9fde-32b51aada1e0
---

Task: "fix the OTHER silently-broken `rounded-surface-xl` usages" in `C:\Falcon\Falcon\falcon-web-platform-ui`. Investigation 2026-05-29 (branch `polishing-v0.4` @ 17a3c254) found NOTHING to fix on the target branch — review-only, NO code changes made.

Evidence:
- [CODE] Target branch `polishing-v0.4`: ZERO `rounded-surface-xl` usages and ZERO `--radius-surface-xl`/`surface-xl` token. Verified 5+ ways: working-tree Grep, `git grep HEAD`, `rg --no-ignore --hidden "rounded-surface" apps/ libs/`, and the night-shift-token-migration worktree. All surfaces use raw `rounded-[14px]` (27 files incl `apps/admin-console/.../contracts-view-contract.component.html`).
- [CODE] `libs/falcon-theme/src/falcon-tailwind-tokens.css:313-329` radius scale has NO `surface` family. The 14px token = `--radius-pane: 0.875rem`; `--radius-xl`=1.5rem=24px. `tailwind.config.js` is an empty Tailwind-v4 bridge (`module.exports={}`) — tokens live in the @theme CSS.
- [CODE] `origin/main` STILL has 7 `rounded-surface-xl` usages (contracts files) AND DEFINES `--radius-surface-xl: 1.5rem` (24px) in `apps/admin-console/src/tailwind.css:14` + `apps/management-console/src/tailwind.css:14` → on main it renders 24px and is NOT broken. The "undefined platform-wide" report missed the per-app tailwind.css (only checked falcon-theme + tailwind.config + preset).
- [CODE] Introduced by commit `0c4e5966` (reachable from origin/main, NOT an ancestor of polishing-v0.4). polishing-v0.4 is +191/-66 vs origin/main.

Key drift: contracts/wallet surface radius = 14px on polishing-v0.4 vs 24px on origin/main → must be reconciled at merge.

**Why:** Stops a future agent re-running this ~30-min cross-branch investigation, or "fixing" a non-bug by adding a dead/wrong-valued token. The token's apparent absence is real ONLY relative to the SSOT theme file; per-app tailwind.css is a second (legacy) token home on main.
**How to apply:** If asked to "fix rounded-surface-xl": on polishing-v0.4 it's already done (no-op). The real residual is on origin/main — token lives in per-app css (not the SSOT theme) at 24px while polishing-v0.4 standardized on 14px; needs explicit go-ahead + branch switch. Existing 14px token to consolidate onto = `--radius-pane`. See [[project_admin_to_mgmt_contract_reconciliation_2026_05_28]] for the main-alignment pattern.
