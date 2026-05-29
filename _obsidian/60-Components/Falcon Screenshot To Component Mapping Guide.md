---
type: process
cluster: screenshot-mapping
priority: critical
scope: current-angular-first
mode: light-only
created: 2026-05-20
---
*** Falcon Screenshot To Component Mapping Guide ***
*** 6-step process for converting any design/screenshot/HTML/React into a Falcon-component implementation plan ***
*** Angular-first; React/Vue future placeholders only ***

# Falcon Screenshot To Component Mapping Guide

> When Ammar (or anyone) hands the Brain a screenshot, design, HTML, or React output, the Brain MUST map it to Falcon components FIRST — before writing any Angular template, before opening any IDE. This note is the deterministic 6-step process.

## 1. Purpose

Standardize "convert this design into a Falcon plan" so:
- Every screenshot run produces a comparable component-plan artifact
- Falcon Eyes can later verify pixel-parity against the plan
- Capability gaps surface BEFORE any bespoke code is shipped
- Two agents handed the same screenshot land on the same plan

## 2. The 6-step process

### Step 1 — Break the screenshot into UI regions

Take the screenshot and partition it into named visual regions, top-to-bottom.

**Canonical region names (use these labels):**
- `host-shell-sidebar` — left dark teal navigation rail
- `host-shell-topbar` — top white horizontal bar (logo + search + bell + theme + avatar)
- `page-outer` — the `bg-falcon-neutral-75` outer wrapper
- `left-rail` — branded `bg-falcon-teal-50` left card (if present)
- `main-pane` — the `bg-falcon-neutral-0` main content card
- `tab-bar` — horizontal tabs at top of main pane
- `section-header` — avatar + name + action-row band
- `filter-strip` — search + filter chips region
- `data-table-region` — the table + paginator block
- `details-panel` — right-side or inline detail card
- `wizard-host` — wizard taking over the main pane
- `drawer` — right-side slide-in panel
- `popup` — centered modal
- `tooltip` / `menu` — floating overlays

**Output of this step:** an annotated screenshot or a list like:
```
Region 1: page-outer
Region 2: tab-bar (4 tabs)
Region 3: section-header (avatar + "ABC Tenant" + 2 buttons)
Region 4: data-table-region (Users table, 6 columns, status chip in col 5)
Region 5: paginator (below table)
```

### Step 2 — Identify repeated patterns inside each region

Within each region, identify atomic UI patterns. Use the recognition table from [[Falcon Component Recognition Playbook]] §2 — left-column terms are the lookup keys.

For each atom, capture:
- The pattern name (e.g., "status chip", "button", "kebab menu")
- The role (e.g., "shows active/inactive/invited state")
- Repeating instances (e.g., "status chip appears in every table row")
- States visible (e.g., "row hover lightens bg", "selected row has teal tint")

**Output:** a pattern inventory per region:
```
data-table-region:
  - table with 6 cols
  - status-chip in col 5 (severity: active/disabled/invited/deleted)
  - kebab menu at row end (3 dots)
  - row hover: bg-falcon-neutral-25
  - row selected: bg-falcon-teal-tint
  - empty state visible at bottom (when no rows)
```

### Step 3 — Match each pattern to a Falcon component

Walk the inventory and assign every pattern to a Falcon component via [[Falcon Component Recognition Playbook]] §2 + [[Falcon Component Capability Matrix]].

**Mapping format (use this exact format):**
```
Region: <region-name>
  Pattern: <pattern-name>
    → Falcon component: <ComponentName>
    → Angular wrapper: <wrapper-tag>
    → Variant/size/severity: <if applicable>
    → Slot/template: <if extension needed>
    → States required: <which states from pattern inventory>
    → Capability check: ✅ supports / ⚠ partial-needs-gap / ❌ missing
```

**Example:**
```
Region: data-table-region
  Pattern: table with 6 cols + status chip cell + kebab + row hover/selected
    → Falcon component: Falcon Data Table
    → Angular wrapper: <falcon-angular-data-table>
    → Strategy E for status-column cell: <ng-template falconColumn="status" let-row><falcon-angular-status-badge [severity]="row.status">...</falcon-angular-status-badge></ng-template>
    → [rowMenuItems] for kebab
    → States: hover (neutral-25), selected (teal-tint) — both built-in
    → Capability check: ✅ supports

  Pattern: empty state when no rows
    → Falcon component: Falcon Data Table's [emptyData] config OR Falcon Empty State
    → Capability check: ✅ supports
```

### Step 4 — Detect missing component capabilities

For every "Capability check: ⚠" or "❌" from Step 3, dig deeper:

1. Is the capability listed as a known gap in [[Falcon Component Gap Registry]] or [`COMPONENT_UPGRADE_BACKLOG.md`](../../Brain%20Outputs/understanding/frontend/COMPONENT_UPGRADE_BACKLOG.md)?
   - YES → cite the existing gap ID; the gap is already tracked. Decide whether to wait for the fix or use a local workaround.
   - NO → log a new entry in [[Falcon Component Gap Registry]] with P0/P1/P2/P3 priority.
2. Is the capability blockable (P0/P1) or non-blocking (P2/P3)?
   - P0/P1 → STOP. Escalate to Ammar. Page work cannot proceed without the fix or an Ammar-approved workaround.
   - P2/P3 → proceed with a documented local composition (e.g., add a `<falcon-angular-status-badge>` next to the cell instead of inside it).

**Output:** a gap-decision list:
```
Detected gaps for this design:
  - Tree per-row action slot — already tracked as P0-06; design needs it on the org-rail. Workaround: use `<falcon-tree-panel>` legacy (already does this).
  - Popup focus trap — P0-01 tracked. Workaround: compose with `<falcon-angular-dialog>` per P1-02.
  - Custom in-table inline-edit action — not tracked. New gap: P2 — log in registry.
```

### Step 5 — Produce an implementation plan using existing components

Compose the Falcon page from your mapped components, following [[Falcon Page Assembly Playbook]] §3 recipes.

**Plan format:**
```
Page: <page-name>
Route: <route-path>
Feature folder: apps/<app>/src/app/features/<feature>/

Shell:
  - Outer: bg-falcon-neutral-75 p-3 md:p-5 (recipe §2)
  - (optional left rail: bg-falcon-teal-50 rounded-[14px])
  - Main pane: bg-falcon-neutral-0 border-falcon-neutral-200 rounded-[14px]

Sub-regions:
  - Tab bar: <falcon-angular-tabs ...>
  - Section header: <falcon-node-details-section ...>
  - Content per tab:
    @switch (activeTab()) {
      @case ('users') { <users-tab /> }
      @case ('settings') { <settings-tab /> }
      ...
    }

Per-tab components composed:
  - <falcon-angular-data-table> with Strategy E column templates
  - <falcon-angular-empty-state> for no-data
  - <falcon-angular-status-badge> in status cell
  - <falcon-angular-paginator> (built into data-table)

State management:
  - <PageName>StateSlice (signal-based)

PES guards / route guards:
  - <list any required permissions>

API contracts:
  - <list endpoints expected from gateway>

Capability gaps blocking:
  - (none — or list P0/P1 gaps that must be unblocked first)

Capability gaps non-blocking:
  - (list P2/P3 gaps + workaround)
```

### Step 6 — Only create a new component if no reusable component exists

If Step 3 returns "Capability check: ❌ missing component entirely" — meaning NO Falcon component covers the role at all:

1. Walk Q6 of [[Falcon Component Selection Decision Tree]].
2. Log the gap as a **NEW-COMPONENT** entry in [[Falcon Component Gap Registry]].
3. **STOP.** Do not create the component until Ammar approves.
4. If Ammar approves, the new component MUST:
   - Live in `libs/falcon-ui-core/src/components/<name>/` (Stencil)
   - Have an Angular wrapper in `libs/falcon-ui-core/src/angular-wrapper/components/<name>/`
   - Implement [[Falcon Component Theme Contract]] (9 sections)
   - Carry a `*.tokens.css` contract file in `libs/falcon-ui-tokens/src/components/`
   - Pass [[Tailwind Implementation Review Checklist]] before merge

## 3. Worked example — Org-hierarchy "Users" tab from a hypothetical screenshot

### Step 1 — Regions

Annotated screenshot:
- `host-shell-sidebar` (dark teal, nav items, active highlight)
- `host-shell-topbar` (white, breadcrumb + search + bell + theme + user-chip)
- `page-outer` (bg-falcon-neutral-75 wrapper)
- `left-rail` (Falcon Clients tree with kebab per node)
- `main-pane` (white card)
- `tab-bar` (Hierarchy / CommChannels & Services / Apps & Services / Settings)
- `section-header` (client icon + "ABC Tenant" + 2 buttons: Add Node / Add User)
- `data-table-region` (Users table — 6 cols: First Name / Last Name / Role / Email / Status / Actions)
- `paginator` (below table)

### Step 2 — Pattern inventory (selected)

```
host-shell-sidebar: nav-item rows (active = teal-900, idle = transparent, hover = white-alpha-06)
host-shell-topbar: icon buttons (search/bell/theme), user-chip dropdown
left-rail:
  - branded card (bg-falcon-teal-50)
  - tree rows (root + nested)
  - per-row kebab (3 dots)
  - selected row: bg-falcon-teal-100 + text-falcon-teal-700 semibold
main-pane:
  - tab bar with 4 tabs, "Hierarchy" active
  - section-header: avatar (28px) + bold name + 2 buttons
data-table-region:
  - 6-column table
  - sortable headers
  - status chip in col 5 (severity: active/disabled/invited/deleted)
  - kebab at row end (Edit / Disable / Delete)
  - row hover: neutral-25
  - row selected: teal-tint
paginator: rows-per-page selector + page navigation
```

### Step 3 — Component mapping

```
host-shell-sidebar
  - nav-item: existing sidebar component in host-shell (not a Falcon UI component; layout-specific)

host-shell-topbar
  - topbar icon-btn: <button> styled with bg-transparent text-falcon-neutral-800 hover:bg-falcon-neutral-50 (host-shell layout)
  - user-chip: <falcon-angular-menu> trigger + items

left-rail
  - tree: <falcon-tree-panel> (legacy bespoke — canonical org-hierarchy rail) ✅
  - per-row kebab: built into tree-panel API ✅

main-pane
  - card: page-shell recipe ✅
  - tab bar: <falcon-angular-tabs> with [tabs]=[Hierarchy, CommChannels, Apps, Settings] ✅
  - section-header: <falcon-node-details-section> with avatar + actions slots ✅
  - Add Node btn: <falcon-angular-button variant="secondary" size="md"> ✅
  - Add User btn: <falcon-angular-button variant="primary" size="md"> ✅

data-table-region
  - data table: <falcon-angular-data-table> with [columns], [data], [lazy], [paginator]=true, [rows]=10 ✅
  - column 5 status cell: <ng-template falconColumn="status" let-row><falcon-angular-status-badge [severity]="row.status">{{ row.status }}</falcon-angular-status-badge></ng-template> ✅
  - kebab per row: [rowMenuItems] config ✅
  - row hover: built-in (neutral-25) ✅
  - row selected: built-in (teal-tint) ✅

paginator: built into <falcon-angular-data-table> via [paginator]=true (uses <falcon-angular-paginator>) ✅
```

### Step 4 — Gap detection

Walk the matrix; in this example everything maps cleanly. No gaps blocking. (If the screenshot had shown a `<falcon-angular-popup>` with an async confirm spinner, P1-27 would be the relevant gap and the plan would compose `<falcon-angular-dialog>` instead.)

### Step 5 — Implementation plan

```
Page: Organization Hierarchy (existing — see [[Falcon Organization Hierarchy Visual Standard]])
Route: /organization-hierarchy
Feature folder: apps/admin-console/src/app/features/org-hierarchy-page/

Already implemented (this exercise is read-only mapping):
  - components/org-hierarchy-page-menu.component.html (page shell)
  - state slice (composed at page-state.facade level)
  - Per-tab content via @switch / @if

Component composition (already shipped):
  - <falcon-tree-panel> (left rail)
  - <falcon-angular-tabs>
  - <falcon-node-details-section>
  - <falcon-angular-data-table> with Strategy E column templates
  - <falcon-angular-status-badge> in status cell
  - <falcon-angular-button> for actions
  - <falcon-angular-paginator> via data-table

State management:
  - OrgHierarchyStateSlice + per-tab slices (users, comm-channels, apps, settings)

Capability gaps blocking: none
Capability gaps non-blocking: P0-01 popup focus trap (not used in this view), P0-06 tree per-row template (using legacy tree-panel which has it built-in)
```

### Step 6 — New component needed?

NO. Every region maps to an existing Falcon component. Build with what's shipped.

## 4. Process artifacts — what to save

After running the 6 steps, save these artifacts to the page learning folder:
- Annotated screenshot (Step 1 output)
- Pattern inventory (Step 2 output)
- Component mapping (Step 3 output)
- Gap-decision list (Step 4 output)
- Implementation plan (Step 5 output)
- New-component decisions (Step 6 output, if any)

Suggested location: `Brain Outputs/understanding/pages/<page-name>/evidence/<learning-id>/component-mapping/`. (Read-only reference here — not in scope for this Obsidian-only build.)

## 5. Source-of-truth ordering

When the screenshot / design conflicts with existing implementation:

1. **Existing implementation wins** — never redesign what's already shipped (per [[Falcon Do Not Change Visual Rules]])
2. **Falcon component capabilities win** — never bend a screenshot into something the component doesn't support
3. **Existing token system wins** — never invent a new color/spacing/radius just because the design has it (per [[Falcon Page Visual Consistency Rules]])
4. **Light Mode Visual Baseline wins** — preserve the locked baseline per Ammar 2026-05-20

If the design diverges from any of the above, escalate to Ammar BEFORE implementing.

## 6. Wrong patterns to avoid

- ❌ Jumping straight to HTML/Angular template after seeing a screenshot — always run the 6 steps first
- ❌ Skipping Step 4 (gap detection) and discovering blockers mid-implementation
- ❌ Creating new bespoke Angular components for one-off patterns instead of composing existing Falcon atoms
- ❌ Matching a pattern to a deprecated component (use the Capability Matrix's "Do Not Use When" column)
- ❌ Treating the design as authoritative when it conflicts with the visual baseline
- ❌ Producing no artifact — every mapping run should leave a record so Falcon Eyes can verify pixel-parity later

## 7. Angular-first notes

- The mapping produces Angular templates + Angular wrappers + Angular state slices
- React/Vue placeholders are skipped — no parallel mapping needed
- Standalone components only — Falcon platform is zoneless Angular 21 with `@switch`/`@if` template control flow (no `*ngIf`/`*ngFor`)

## 8. Future-agent instructions

- **Every screenshot/design/HTML/React handoff:** run the 6 steps in order. No shortcuts.
- **Save the artifacts:** even if read-only mapping, the artifacts feed Falcon Eyes + page learning.
- **Cross-link to gap entries:** every "Capability check: ⚠ / ❌" must reference a gap ID in [[Falcon Component Gap Registry]] (existing or new).
- **Pattern-match against canonical pages:** [[Falcon Organization Hierarchy Visual Standard]] is the reference; if your mapped plan doesn't visually align with it, refactor before implementing.

## See also

- [[Falcon Component Recognition Playbook]] — Step 3 mapping reference
- [[Falcon Component Capability Matrix]] — Step 3-4 detail
- [[Falcon Component Selection Decision Tree]] — Step 6 trigger
- [[Falcon Component Gap Registry]] — Step 4-6 logging target
- [[Falcon Page Assembly Playbook]] — Step 5 recipe library
- [[Falcon Organization Hierarchy Visual Standard]] — canonical reference page
- [[Falcon Light Mode Visual Baseline]] · [[Falcon Page Visual Consistency Rules]] · [[Falcon Do Not Change Visual Rules]]
- [[FALCON_EYES_INDEX]] — visual-parity follow-up after implementation

## Tags

#type/process #layer/frontend #cluster/screenshot-mapping #priority/critical

## Hubs

- [[60-Components/Falcon Component Recognition Playbook|Component Recognition Playbook]] · [[36-Theming/README|36-Theming]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
