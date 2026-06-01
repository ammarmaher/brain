---
name: reference_falcon_root_node_has_tabs_keep_2026_05_30
description: Falcon root node DOES have a tab strip (Hierarchy + Settings) per brain UIUX-016 + BIZ-014; user chose to follow the brain and KEEP it — do NOT hide the Falcon root tabs.
metadata: 
  node_type: memory
  type: reference
  originSessionId: 60b58da8-bed3-4372-8be8-e9b3d2e0f95e
---

The Falcon root (synthetic "Falcon" node at the top of the Organization Hierarchy tree) **DOES** show a tab strip — do NOT hide it. The brain says the opposite of "the Falcon node has no tab".

**Brain evidence (all agree root HAS tabs):**
- `[BRAIN-OUT]` UIUX-016 (`understanding/pages/organization-hierarchy/UI_UX_RULES.md:48`): tab strip per node type → **root: Hierarchy+Settings**; client/sub-node: 4 tabs. Status "applied / Verified".
- `[BRAIN-OUT]` BIZ-014 (`.../BUSINESS_RULES.md:53`): root Settings tab shows ONLY the left card (Password Security + Allowed IPs); Account Limitations hidden.
- `[BRAIN-OUT]` `reports/org-hierarchy-page-night-shift-2026-05-14/wake-up-status-FINAL.md:77` + `01-html-source-discovery.md:472`: "on root only Hierarchy + Settings visible"; "For root (Falcon): only the left card shows".
- A full-brain grep for "root has no tab / tabs hidden on root" returned **ZERO** matches.
- `[CODE]` React SoT `new react/admin/hierarchy.jsx:1191-1200`: `isRoot ? [hierarchy, settings] : [4 tabs]`.

**Code state (already correct, no change made):**
- `[CODE]` admin `users-state.signals.ts:107-116`: root = `['hierarchy','settings']`. Matches brain + SoT.
- `[CODE]` mgmt `users-state.signals.ts:142-162`: root = `['hierarchy']` only — but this is a **dead defensive branch**: mgmt has NO synthetic Falcon root (`services.ts:9-10` dropped it; the tree starts at the account Main node = 4 tabs incl. Settings).

**Console split:** the Falcon node is only selectable in the **admin** console (Falcon users sys-admin/ops/products). There its Settings tab is a real API-backed feature — platform Password Security + Allowed IPs via the Falcon-self `ownerId=null` path, live-PES-verified working (so "don't call any API" would remove a genuine capability). The **management** console suppresses the synthetic root and guards its literal id, so no settings API fires there anyway.

**Decision 2026-05-30 (USER):** asked whether the brain says the Falcon node has no tab → it says the OPPOSITE; user chose **option (a) follow the brain → keep as-is, no hide, no code change, no API change.** If a future request asks to hide the Falcon root tabs, treat it as an explicit override of the brain and require a newer PRD/business authority (brain rule dated 2026-05-14). Related: [[project_settings_tab_per_section_view_gating_2026_05_30]].
