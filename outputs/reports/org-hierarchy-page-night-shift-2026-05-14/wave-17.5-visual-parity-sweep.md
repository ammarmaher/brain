# Wave 17.5 — Visual Parity Sweep (P1.1)

**Date:** 2026-05-14
**Sources verified live:**
- HTML source @ `http://localhost:8765/T2%20Falcon%20Admin%20-%20Offline.html` (200)
- React reference @ `http://localhost:5500/T2%20Falcon%20Admin.html` (200)
- Angular destination @ `http://localhost:4200/#/admin-console/org-hierarchy-page` (200, logged in)

**Sweep type:** Measurement + classification only. No major fixes.

---

## Section-by-section findings

### 1. Page shell / layout

| Aspect | Source | Angular destination | Status |
|---|---|---|---|
| Page title text | `Organization Hierarchy` | `Org Hierarchy` | **NOT_APPLIED** |
| Breadcrumb | `Home › Organization Hierarchy` | `Home › Org Hierarchy` | **NOT_APPLIED** |
| Sidebar layout (left 224px + main 1fr) | CSS Grid | CSS Grid | **APPLIED** |
| Topbar present | yes | yes | **APPLIED** |

### 2. Sidebar / menu route

| Aspect | Source | Angular destination | Status |
|---|---|---|---|
| Sidebar items in "Account Administration" section | single "Organization Hierarchy" item | THREE entries: `Org Hierarchy (Admin)` + `Organization Hierarchy (New Page)` + `Organization Hierarchy` | **NOT_APPLIED — pollution** |
| Active item style | teal-deep `#082a2e` bg, white text | teal bg, white text | **APPLIED** |
| Icon present | `IcBuilding` | falcon icon | **APPLIED** |

### 3. Hierarchy tree (seed + structure)

| Aspect | Source | Angular destination | Status |
|---|---|---|---|
| Seed data | Al-Rajhi Bank, Saudi National Bank, Bupa Arabia, **Aramco** (with HR/DigitalBanking/ContactCenter+3sub/Marketing/IT), BMW Group | Dev test data: ammar/Ammar×3/ARB1/RB/BMW/mercedes/Aramco×2/Account1/Account3/Aramco3/Account4/Account5/ABCDEF.../Aramco4/DDD×2/Ejada/Dina Account/UserSingle/... | **NOT_APPLIED — different seed entirely** |
| BrandLogo per client (BMW conic gradient, Bupa red circle, etc.) | rendered | dev seed uses simple letters/generic icons | **NOT_APPLIED** |
| Tree row structure (chevron + logo + name + kebab) | per HTML §4 | matches structurally | **APPLIED** |
| Indent rails (connector lines) | visible | not visible | **NOT_APPLIED** |

### 4. Tree hover / selected states

| Aspect | Source | Angular destination | Status |
|---|---|---|---|
| Selected row visual: `--teal-light #e8f0f1` bg + teal name | yes | yes | **APPLIED** |
| Hover-path teal stripe on ancestor rails | yes | not visible | **NOT_APPLIED** |
| Kebab opacity on hover (0 → 1) | yes | yes | **APPLIED** |

### 5. Node action menu (tree kebab)

| Aspect | Source | Angular destination | Status |
|---|---|---|---|
| Kebab visible on row hover/selected | yes | yes | **APPLIED** |
| Menu items per node type (root → Add Client+Add User; node → Add Node+Edit Node+Add User) | yes | matches via `ROOT_ACTIONS`/`NODE_ACTIONS` | **APPLIED** |
| Menu opens via `position:fixed` (escapes overflow) | yes | uses Stencil popup | **APPLIED** |

### 6. Tabs / header actions

| Aspect | Source | Angular destination | Status |
|---|---|---|---|
| Tabs per node type (root → 2; client/node → 4) | yes | yes via `state.visibleTabs()` | **APPLIED** |
| View toggle (List / Tree) on Hierarchy tab | yes, right-aligned in tabs row | yes via `<ng-template falconTabActions="hierarchy">` (Wave 17.1) | **APPLIED** |
| Active tab indicator (`--teal` underline) | yes | yes | **APPLIED** |
| Node header buttons (Information / Add Client / Add Node / Add User) | yes | yes (gated by `[canShow*]` inputs) | **APPLIED** |

### 7. Users table

| Aspect | Source | Angular destination | Status |
|---|---|---|---|
| 7 column headers (Username/FirstName/Email/Phone/Role/PermGroup/Status) | yes | yes | **APPLIED** |
| Actions column with kebab | yes, sticky-right | **DELETED today (Wave 18)** | **NOT_APPLIED — intentional, see BIZ-006** |
| Phone column `dir="ltr"` | yes | not verified RTL | **UNKNOWN** |
| Default selected user (Hajeer/u3 highlighted on load) | yes | **NOT_APPLIED** | **NOT_APPLIED** |
| Header bg matches footer bg | yes | yes (post Wave 17.4) | **APPLIED** |
| Header/data-row/footer same height | yes | yes within 0.94px (Wave 18) | **APPLIED** |
| Container border-radius = 0 | yes (subtle) | yes (Wave 18) | **APPLIED** |

### 8. Table top actions (Filter / Search)

| Aspect | Source | Angular destination | Status |
|---|---|---|---|
| Filter btn + Search input ONLY on root node table | yes | yes (template `@if (state.isRootSelected() && usersView === 'list')`) | **APPLIED** |
| Filter btn styling (`.filter-btn` + `IcFilter`) | yes | basic implementation | **PARTIAL** |
| Search input placeholder "Search here" | yes | yes | **APPLIED** |

### 9. Row actions / More Details path

| Aspect | Source | Angular destination | Status |
|---|---|---|---|
| Row kebab → menu opens → "More Details" → drills into UserDetailsPage | yes | **NO kebab in row** (deleted Wave 18) | **NOT_APPLIED — path broken** |
| Alternative path to drill-in (e.g. row-click) | n/a in source | not implemented | **APPLICABLE — need new trigger** |

### 10. Information / Details page (drill-in)

| Aspect | Source | Angular destination | Status |
|---|---|---|---|
| Information panel appears in-place (replaces users table) when "Information" clicked | yes | `<app-org-info-panel>` exists | **UNKNOWN — not exercised in this sweep** |
| 4-col + 4-col field grid (17 fields) | yes | unknown | **UNKNOWN** |

### 11. Add Client / Add User wizard entry points

| Aspect | Source | Angular destination | Status |
|---|---|---|---|
| "Add Client" button visible on root | yes | yes | **APPLIED** |
| "Add User" button visible | yes | yes | **APPLIED** |
| "Add Node" button visible on non-root | yes | yes | **APPLIED** |
| Wizard opens as full-page replacement (not modal) | yes | unknown | **UNKNOWN — not exercised** |

### 12. OTP popup / verification

| Aspect | Source | Angular destination | Status |
|---|---|---|---|
| OTP modal reachable | requires Add User wizard step 1 | not exercised | **BLOCKED — not reached in this sweep** |

---

## Score updates (per-evidence)

### Dimension scores

| Dimension | Baseline (pre-sweep) | After Wave 17.5 | Trend |
|---|---|---|---|
| UI / UX | 25% | **40%** | ↑ +15 |
| Business | 10% | 10% | — (sweep was visual; business unchanged) |
| Validation | 5% | 5% | — |
| Gaps Resolved | 20% | **25%** | ↑ +5 (some gaps resolved as not_applicable; 5 new found) |

### Auxiliary scores

| Metric | Baseline | After Wave 17.5 | Trend |
|---|---|---|---|
| Source understanding % | 70% | **80%** | ↑ +10 (live verification adds confidence) |
| Destination implementation % | 55% | 55% | — |
| Visual parity % | 35% | **52%** | ↑ +17 |
| Business rule coverage % | 10% | 10% | — |
| Validation coverage % | 5% | 5% | — |
| Gap resolution % | 20% | 25% | ↑ +5 |
| Component reuse % | 80% | 80% | — |
| Test coverage % | 0% | 0% | — |

### Page understanding (weighted)

```
Page % = (UIUX × 0.35) + (Business × 0.25) + (Validation × 0.20) + (GapsResolved × 0.20)
       = (40 × 0.35) + (10 × 0.25) + (5 × 0.20) + (25 × 0.20)
       = 14.0 + 2.5 + 1.0 + 5.0
       = 22.5% ≈ **23%**
```

| Metric | Baseline | After Wave 17.5 |
|---|---|---|
| **Aggregated Page Understanding %** | 16% | **23%** |

All four dimensions still below 60% → **NEEDS-ATTENTION flag remains**.

---

## Rule status changes

| Movement | Count |
|---|---|
| Rules moved from `unknown` → `applied` | 8 |
| Rules moved from `unknown` → `not_applied` | 6 |
| New rules added as `not_applied` | 5 |
| New rules added as `applicable` | 2 |
| Rules confirmed `partially_applied` | 3 |
| Rules confirmed `applied` (already were) | 6 |
| Rules left `blocked` (OTP not reached, RTL not tested) | 2 |

### Newly logged rules (5 new not_applied + 2 new applicable)

| ruleId | Title | Category | Status | Source diff |
|---|---|---|---|---|
| UIUX-PARITY-001 | Page title text "Organization Hierarchy" vs "Org Hierarchy" | uiux | not_applied | Source: "Organization Hierarchy"; Angular: "Org Hierarchy" |
| UIUX-PARITY-002 | Sidebar has SINGLE "Organization Hierarchy" entry | uiux | not_applied | Source: 1 entry; Angular: 3 entries (Admin/NewPage/regular) |
| UIUX-PARITY-003 | Tree seed data is the React reference seed (Al-Rajhi, SNB, Bupa, Aramco, BMW) | uiux | not_applied | Angular uses dev test data |
| UIUX-PARITY-004 | BMW BrandLogo (conic gradient + "BMW" text) renders | uiux | not_applied | Source: conic gradient; Angular: generic icon |
| UIUX-PARITY-005 | Default-selected user (Hajeer/u3 highlighted on load) | uiux | not_applied | Source: u3 selected via `setSelected(new Set(['u3']))`; Angular: no default selection |
| UIUX-PARITY-006 | Tree indent connector rails (elbow + rail lines) | uiux | applicable | Source: visible; Angular: not yet implemented |
| UIUX-PARITY-007 | Hover-path teal stripe on ancestor rails | uiux | applicable | Source: visible; Angular: not yet implemented |

### Newly logged gaps

| gapId | Title | Severity | Status |
|---|---|---|---|
| GAP-PARITY-001 | Page title text mismatch ("Org Hierarchy" vs "Organization Hierarchy") | LOW | applicable |
| GAP-PARITY-002 | Sidebar has 3 org-hierarchy entries (dev/migration pollution) | MED | applicable |
| GAP-PARITY-003 | Tree seed data does not match React reference seed | MED (demo/QA only) | applicable |
| GAP-PARITY-004 | BrandLogo per client not rendered (BMW conic, Bupa red circle, etc.) | LOW | applicable |
| GAP-PARITY-005 | Default-selected user row (Hajeer per HTML §6) not implemented | LOW | applicable |

---

## Sections checked

12 / 12 priority sections inspected:
- ✓ 1. Page shell/layout
- ✓ 2. Sidebar/menu route
- ✓ 3. Hierarchy tree
- ✓ 4. Tree hover/selected states
- ✓ 5. Node action menu
- ✓ 6. Tabs / header actions
- ✓ 7. Users table
- ✓ 8. Table top actions
- ✓ 9. Row actions / More Details
- ✓ 10. Information/Details page (visual structure only; behavior not exercised → UNKNOWN)
- ✓ 11. Add Client / Add User wizard entry points (entry visible; wizard contents not exercised)
- ⚠ 12. OTP popup — BLOCKED (would require opening Add User wizard, risk of state mutation)

## Blocked items

| Item | Reason | Unblock action |
|---|---|---|
| OTP popup verification | Required opening wizard which would mutate test data | Schedule dedicated OTP test pass with a clean user state |
| RTL mode sweep | Source HTML loaded LTR; RTL sweep needs language switch | Schedule dedicated RTL pass |

## What did NOT happen in this sweep

- No code edits to fix the parity gaps (per spec: "Do not implement major fixes during this sweep")
- No git commits to falcon-web-platform-ui
- No tests added
- No new bugs added to `FALCON_UI_BUGS_AND_QUIRKS.md` (5 page-level parity gaps logged in `GAP_REGISTRY.md` instead)

## Approval state

PENDING — awaits Ammar approval signal before:
- Promoting any of the 7 components in `FALCON_COMPONENT_REGISTRY.md` to 100%
- Mirroring this wave report to `Brain SK\outputs\`
- Auto-pushing to `github.com/ammarmaher/brain`

## Cross-references

- Updated registry files: see [`UI_UX_RULES.md`](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/UI_UX_RULES.md), [`SOURCE_DESTINATION_COMPARISON.md`](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/SOURCE_DESTINATION_COMPARISON.md), [`VISUAL_PARITY_SCORECARD.md`](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/VISUAL_PARITY_SCORECARD.md), [`PAGE_SCORECARD.md`](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/PAGE_SCORECARD.md), [`GAP_REGISTRY.md`](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/GAP_REGISTRY.md), [`NEXT_ACTIONS.md`](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/NEXT_ACTIONS.md)
- Skill: [`component-capability-upgrade SKILL`](../../../../Brain%20SK/skills/component-capability-upgrade/SKILL.md)
- Registry index: [`PAGES_INDEX`](../../../../Brain%20SK/_obsidian/PAGES_INDEX.md)
