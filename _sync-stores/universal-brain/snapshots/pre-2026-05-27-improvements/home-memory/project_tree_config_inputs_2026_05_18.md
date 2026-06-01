---
name: Org-hierarchy tree configuration inputs
description: falcon-tree-panel + wrapper config-input API — rootSelectable/nodesSelectable added, client-mode label auto-hide
type: project
originSessionId: a8853276-9745-4ce1-8626-4531781606e3
---
The org-hierarchy tree is a 2-layer component: `falcon-tree-panel` (library skeleton, presentational) + `app-organization-hierarchy-tree` (host-shell wrapper, owns PES + fetch). **Admin-console consumes the wrapper** (via `org-hierarchy-page-menu`).

**Config-input API after 2026-05-18 enhancement:**
- Root-as-client: `mode` (`'falcon'|'client'` skeleton; `'falcon-clients'|'falcon-full'|'client'` wrapper) — already existed.
- Hide actions: `showActions` / `showRootActions` — already existed.
- Hide chevrons: `showArrows` — skeleton always had it; **now also exposed on the wrapper** (pass-through added 2026-05-18).
- Expansion: `expandedIds`, `showSubNodes` — already existed.
- **NEW** `rootSelectable: boolean=true` — root row clickable or not (gates `select` emit + cursor/hover affordance).
- **NEW** `nodesSelectable: boolean=true` — client rows clickable or not (gates `select` emit + cursor/hover; chevron + 3-dot still work).
- `rootSelectable`, `nodesSelectable`, `showArrows` all exist on the skeleton AND the wrapper (wrapper passes through).
- Wrapper auto-hides the "Falcon Clients" label when `mode='client'` via `effectiveClientsLabelKey` computed.

Design choice: individual signal `input()`s (not a config object) — discoverable, independently overridable, OnPush-friendly, consistent with existing API.

**Wizard locks (admin-console, wired 2026-05-18):** `org-hierarchy-page-menu` has two computeds:
- `treeNavigable = computed(() => !state.addClientOpen())` → bound to `[nodesSelectable]` + `[showArrows]`. Add Client freezes tree navigation (rows non-clickable, chevrons hidden); Add User does NOT.
- `treeActionsVisible = computed(() => !state.addClientOpen() && !state.addUserOpen())` → bound to `[showActions]` + `[showRootActions]`. EITHER wizard hides all 3-dot menus.

Net: **Add Client = full lock** (no navigation + no actions); **Add User = actions-only** (3-dots hidden, navigation intact). Root row stays clickable in both (`rootSelectable` left default true).

**Obsidian knowledge:** full hand-authored knowledge note at `falcon-wiki/00-MOCs/Org-Hierarchy-Tree-Component-Knowledge.md` (architecture, API, layout, wizard-lock pattern, what-can/can't, §11 tree-component disambiguation). The `falcon-tree-panel` canonical dossier (`Brain Outputs/understanding/frontend/components/falcon-tree-panel/` — OVERVIEW/API/USAGE/TOKENS/DECISION) was re-swept to current state (Tailwind not SCSS; wrapper = sole consumer; new inputs).

**Tree-component name trap:** the production org-hierarchy tree is `falcon-tree-panel`. NOT `falcon-angular-tree` (generic bare tree, parallel impl) and NOT `falcon-organization-hierarchy-tree-tw` (Stencil look-alike, zero production consumers). Disambiguation callouts added to those two dossiers' OVERVIEW.md.

**Why:** user wants the tree reusable across many future use-cases, driven entirely by caller inputs.
**How to apply:** to lock the tree for a new flow, bind these inputs to a `computed` off that flow's open-signal. Not browser-verified / not compiled yet.
