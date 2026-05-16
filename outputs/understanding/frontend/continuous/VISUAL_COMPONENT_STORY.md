---
type: visual-story
purpose: per-component-screenshot-index
created: 2026-05-16
status: scaffold
tier: 4
component-count: 62
snapshots-captured: 0
---

*** Falcon Frontend — Visual Component Story ***
*** One screenshot per component, indexed by name ***

# 📸 Visual Component Story

> The visual-search layer over the Falcon component library. Search by **what something looks like** rather than what it's called. Tier 4 deliverable — scaffold today, snapshots populate over time as designers + agents use the components in dev-serve.

## Why this exists

Today's flow when someone needs a date picker:

1. Open `Component Atlas`
2. See `falcon-date-picker` in the list
3. Click into its 6-file dossier
4. Read API.md
5. Realize this isn't quite what they wanted
6. Repeat for `falcon-calendar`, `falcon-calendar-legacy`
7. Give up, build something custom

With visual snapshots:

1. Open Visual Component Story
2. Scroll through thumbnails grouped by category
3. Click the one that LOOKS right
4. Land in the dossier already knowing it's visually correct

The whole library becomes browsable by sight.

## Schema

Each snapshot entry has this shape:

```yaml
---
component: falcon-date-picker
snapshot-version: 1
captured-at: 2026-05-16T10:30:00Z
captured-by: agent | manual | falcon-eyes
falcon-version: ui-core@... + theme@...
screenshot:
  default:    snapshots/falcon-date-picker/default.png
  hovered:    snapshots/falcon-date-picker/hovered.png
  focused:    snapshots/falcon-date-picker/focused.png
  disabled:   snapshots/falcon-date-picker/disabled.png
  error:      snapshots/falcon-date-picker/error.png
  rtl:        snapshots/falcon-date-picker/rtl.png
  dark:       snapshots/falcon-date-picker/dark.png  # if dark theme exists
variants:
  - shadow-default
  - tailwind-default
  - shadow-rtl
  - tailwind-rtl
viewport: 1440x900
dossier: components/falcon-date-picker/
---
```

Storage:
- Images live at `Brain Outputs/understanding/frontend/components/<name>/snapshots/*.png`
- Index entries land in this file's "Snapshot catalog" section below

## How snapshots get captured

Three paths, in order of priority:

### 1. Falcon Eyes batch run (preferred when available)

`tools/falcon-eyes/` runs against the running playground apps (port 5173 React, 5174 Vue, 5175 Angular). For each component in `demos/component-docs/`, it captures the showcase state and writes the PNG. Best path: cross-framework parity check + visual record at the same time.

### 2. Per-component manual screenshot

When a developer is iterating on a component, they save a screenshot from the dev-server into the component's `snapshots/` folder. The index update is a 30-second copy-paste into this file.

### 3. Automated Playwright capture (future, ~2 days of build)

A Playwright test that visits each component's showcase page, captures the default + state variants, writes them into the dossier folder. Integrates with night-shift. Out of scope for today.

## Snapshot catalog

> Populated as snapshots are captured. Empty today (scaffold). Each row represents one component with at least one captured snapshot.

### 🟦 Dialogs / Overlays

| Component | Default | Hovered | Focused | RTL | Captured |
|---|---|---|---|---|---|
| falcon-alert-dialog | _pending_ | — | — | — | not yet |
| falcon-confirm-dialog | _pending_ | — | — | — | not yet |
| falcon-dialog | _pending_ | — | — | — | not yet |
| falcon-drawer | _pending_ | — | — | — | not yet |
| falcon-insufficient-balance-dialog | _pending_ | — | — | — | not yet |
| falcon-menu | _pending_ | — | — | — | not yet |
| falcon-notification | _pending_ | — | — | — | not yet |
| falcon-otp-send-dialog | _pending_ | — | — | — | not yet |
| falcon-popup | _pending_ | — | — | — | not yet |
| falcon-toast | _pending_ | — | — | — | not yet |
| falcon-tooltip | _pending_ | — | — | — | not yet |
| send-credentials-popup | _pending_ | — | — | — | not yet |

### 🟪 Form Inputs

| Component | Default | Focused | Error | Disabled | RTL | Captured |
|---|---|---|---|---|---|---|
| falcon-calendar | _pending_ | — | — | — | — | not yet |
| falcon-checkbox | _pending_ | — | — | — | — | not yet |
| falcon-checkbox-group | _pending_ | — | — | — | — | not yet |
| falcon-combobox | _pending_ | — | — | — | — | not yet |
| falcon-date-picker | _pending_ | — | — | — | — | not yet |
| falcon-dropdown | _pending_ | — | — | — | — | not yet |
| falcon-email-field | _pending_ | — | — | — | — | not yet |
| falcon-grid-input | _pending_ | — | — | — | — | not yet |
| falcon-input | _pending_ | — | — | — | — | not yet |
| falcon-input-number | _pending_ | — | — | — | — | not yet |
| falcon-mobile-number | _pending_ | — | — | — | — | not yet |
| falcon-multi-select | _pending_ | — | — | — | — | not yet |
| falcon-otp | _pending_ | — | — | — | — | not yet |
| falcon-password | _pending_ | — | — | — | — | not yet |
| falcon-phone-field | _pending_ | — | — | — | — | not yet |
| falcon-radio | _pending_ | — | — | — | — | not yet |
| falcon-radio-group | _pending_ | — | — | — | — | not yet |
| falcon-search-input | _pending_ | — | — | — | — | not yet |
| falcon-select | _pending_ | — | — | — | — | not yet |
| falcon-textarea | _pending_ | — | — | — | — | not yet |

### 🟩 Data Display

| Component | Default | With data | Empty state | RTL | Captured |
|---|---|---|---|---|---|
| falcon-data-table | _pending_ | — | — | — | not yet |
| falcon-empty-state | _pending_ | — | — | — | not yet |
| falcon-paginator | _pending_ | — | — | — | not yet |
| falcon-status-badge | _pending_ | — | — | — | not yet |
| falcon-table | _pending_ | — | — | — | not yet |
| falcon-tag | _pending_ | — | — | — | not yet |
| falcon-tree | _pending_ | — | — | — | not yet |
| falcon-tree-panel | _pending_ | — | — | — | not yet |
| falcon-tree-table | _pending_ | — | — | — | not yet |
| falcon-organization-hierarchy-tree-tw | _pending_ | — | — | — | not yet |

### 🟧 Layout / Structural

| Component | Default | Mobile | RTL | Captured |
|---|---|---|---|---|
| falcon-accordion | _pending_ | — | — | not yet |
| falcon-card | _pending_ | — | — | not yet |
| falcon-filter-panel | _pending_ | — | — | not yet |
| falcon-form-field | _pending_ | — | — | not yet |
| falcon-stepper | _pending_ | — | — | not yet |
| falcon-stepper-legacy | _pending_ | — | — | not yet |
| falcon-tabs | _pending_ | — | — | not yet |
| falcon-wizard | _pending_ | — | — | not yet |

### 🟡 Primitives

| Component | Default | Hover | Focus | Active | Disabled | Captured |
|---|---|---|---|---|---|---|
| falcon-avatar | _pending_ | — | — | — | — | not yet |
| falcon-badge | _pending_ | — | — | — | — | not yet |
| falcon-button | _pending_ | — | — | — | — | not yet |
| falcon-icon | _pending_ | — | — | — | — | not yet |
| falcon-photo-uploader | _pending_ | — | — | — | — | not yet |
| falcon-single-uploader | _pending_ | — | — | — | — | not yet |
| falcon-switch | _pending_ | — | — | — | — | not yet |

### ⚪ Misc / Shared

| Component | Default | Captured |
|---|---|---|
| falcon-message-host | _pending_ | not yet |
| falcon-uploader | _pending_ | not yet |
| shared-directives | (no visual) | n/a |

## Snapshot capture priorities

Not all 62 components need snapshots equally. Priority order:

### 🔴 Critical (capture FIRST — high-traffic components)

1. **falcon-button** (31 refs in 26 files — most-used) — capture default, hover, focus, disabled, all variants (primary, ghost, danger, etc.)
2. **falcon-input** (the OG dual-render component) — capture both shadow + tailwind variants, default + focused + error
3. **falcon-data-table** (8 commits this sprint, ~50%+ in active dev) — capture with data, empty state, loading
4. **falcon-dropdown** (popup-portal user, complex z-index) — verify the morning's portal fix visually
5. **falcon-calendar** + **falcon-date-picker** — same portal family

### 🟠 Important (capture next)

- All Form Inputs (20 components) — they're the daily-driver UI
- falcon-alert-dialog (newest composite, just got OVERVIEW.md today)
- falcon-tabs, falcon-stepper (wizard surfaces)
- falcon-empty-state (the falcon-component-creation strategy run target)

### 🟢 Nice-to-have

- Layout primitives (accordion, card, filter-panel)
- Legacy/deprecated components (capture once to record the visual history before removal)

## How to add a snapshot

Once a component has a visual:

1. Save the PNG to `Brain Outputs/understanding/frontend/components/<name>/snapshots/<state>.png`
2. Update this file's row for that component:
   - Replace `_pending_` with `[![default](snapshots/<name>/default.png)](snapshots/<name>/default.png)` (or a thumbnail link)
   - Fill in the state columns
   - Set the "Captured" column to today's date
3. Commit + push (snapshots are brain artifacts, auto-sync per Brain SK CLAUDE.md rule)

## Tools we'll need

To make snapshot capture continuous (Tier 4 setup, not done today):

| Tool | Status | Purpose |
|---|---|---|
| Playwright | not installed in workspace | Headless browser for automated capture |
| Falcon Eyes | exists at `tools/falcon-eyes/` | Visual diff QA — could be extended to "capture-mode" |
| `tools/snapshot/` directory | not created | Where Playwright config + capture scripts would live |
| `npm run snapshot:capture <name>` script | not created | Capture one component's variants |
| `npm run snapshot:capture:all` | not created | Full library sweep (60+ min) |

**Action item:** spin up `tools/snapshot/` in a dedicated session. The current state is "scaffold ready, automation pending."

## Why this matters more than it looks

Three deeper benefits:

1. **Visual regression catch** — when a token value changes (G-02 typography fix, G-04 typo fix), a new snapshot batch will reveal visual drift the component dossier text can't.
2. **Designer ↔ developer alignment** — the designer can browse the catalog to confirm "yes, that's what's shipping" without opening Figma.
3. **Documentation that ages well** — code docs go stale; visual snapshots are tied to a specific build hash so they're audit-trail accurate.

## Related

- [FRONTEND_KNOWLEDGE_PATH](../FRONTEND_KNOWLEDGE_PATH.md)
- [[Component Atlas]] — Tier 1 index (this Visual Story is its visual counterpart)
- [[Token Taxonomy]] — token changes drive snapshot regressions
- Falcon Eyes: `tools/falcon-eyes/` (existing visual diff tool)
- Memory: `feedback_no_ui_testing_during_implementation` (don't capture during implementation — separate phase)

## Tags

#type/visual-story #frontend #snapshots #continuous #tier-4 #scaffold
