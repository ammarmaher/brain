---
type: reference
cluster: components
layer: composition
scope: angular-first
created: 2026-05-20
updated: 2026-05-20
---
*** Falcon Page Region Patterns ***
*** Angular-first — React/Vue are future placeholders ***
*** 12 named regions every Falcon page is built from ***

# Falcon Page Region Patterns

> **Purpose:** A Falcon page is assembled from named regions. This note defines the 12 canonical regions, the components that populate each, their Tailwind layout pattern, the rules that govern them, and the wrong patterns to avoid.
>
> **Use this with:** [[Falcon Page Assembly Playbook]] (full page assembly) and [[Falcon Component Composition Playbook]] (multi-component wiring).
>
> **Guardrail:** All layout tokens must come from [[Falcon Tailwind Theme]] — no hardcoded px values in new code.

---

## Region Map

```
┌─────────────────────────────────────────────────────┐
│  R01  Page Shell (outer bg + padding)               │
│  ┌───────────────────────────────────────────────┐  │
│  │  R02  Page Header (title + primary CTA)       │  │
│  ├───────────────────────────────────────────────┤  │
│  │  R03  Filter / Search Row                     │  │
│  ├───────────────────────────────────────────────┤  │
│  │  R04  Main Pane (card / panel)                │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  R05  Tab Bar (optional)                │  │  │
│  │  ├─────────────────────────────────────────┤  │  │
│  │  │  R06  Data Table or Tree                │  │  │
│  │  ├─────────────────────────────────────────┤  │  │
│  │  │  R07  Detail / Info Panel               │  │  │
│  │  ├─────────────────────────────────────────┤  │  │
│  │  │  R08  Form Section                      │  │  │
│  │  ├─────────────────────────────────────────┤  │  │
│  │  │  R09  Footer / Action Bar               │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  R10  Drawer (side overlay, portaled)               │
│  R11  Dialog / Popup (center overlay, portaled)     │
│  R12  Toast / Notification (corner overlay)         │
└─────────────────────────────────────────────────────┘
```

---

## Region Reference Table

| Region | Name | Common Components | Layout Pattern | Rules | Wrong Patterns |
|---|---|---|---|---|---|
| **R01** | Page Shell | _(no Falcon component — pure layout)_ | `bg-falcon-neutral-75 flex flex-col gap-4 p-3 md:p-5 h-full min-h-0` | Must be the outermost element of every routed page component | `min-h-screen`, fixed heights, `overflow-y-scroll` on shell |
| **R02** | Page Header | `<falcon-angular-button>` for CTAs; plain `<h1>` for title | `flex items-center justify-between` | Title left, primary CTA right; no secondary nav here | Routing links styled as buttons; breadcrumb in header |
| **R03** | Filter / Search Row | `<falcon-angular-search-input>`, `<falcon-angular-dropdown>`, `<falcon-angular-date-picker>`, `<falcon-angular-button>` | `flex flex-wrap gap-2 items-end` | Filters live ABOVE the table in parent; never inside table header cells | Dropdowns inside `<th>` cells; filter panel covering the table |
| **R04** | Main Pane | _(layout shell — wraps R05–R09)_ | `bg-falcon-neutral-0 border border-falcon-neutral-200 rounded-[14px] overflow-hidden flex flex-col min-h-0` | Provides the white card surface for all content below; radius 14 px | Multiple nested `.card` divs with competing radii |
| **R05** | Tab Bar | `<falcon-angular-tabs>` | `flex-shrink-0` header within R04 | Each tab body is a lazy-loaded child component; tab does NOT own scroll | `<ul><li>` tab reimplementations; router-based tabs for sub-sections |
| **R06** | Data Table / Tree | `<falcon-angular-data-table>`, `<app-organization-hierarchy-tree>` | `flex-1 min-h-0 overflow-auto` | Table/tree fills remaining height; paginator is a sibling below | Table inside a `<div style="height:400px">` fixed container |
| **R07** | Detail / Info Panel | `<falcon-angular-tabs>` (nested), `<falcon-angular-input>`, `<falcon-angular-status-badge>` | `flex flex-col gap-4 p-4` inside R04 right pane | Detail panel appears beside tree (split view) — never overlapping | Dialog used as a detail panel; drawer used for read-only detail |
| **R08** | Form Section | `<falcon-angular-input>`, `<falcon-angular-dropdown>`, `<falcon-angular-checkbox>`, `<falcon-angular-phone-field>`, `<falcon-angular-uploader>` | `grid grid-cols-1 md:grid-cols-2 gap-4` or `flex flex-col gap-3` | Every field has a label; every required field has a validation message; use `FormGroup` + `FALCON_VALIDATIONS` | Raw `<input>` outside Falcon wrapper; `class="form-group"` Bootstrap remnants |
| **R09** | Footer / Action Bar | `<falcon-angular-button variant="primary">`, `<falcon-angular-button variant="secondary">` | `flex items-center justify-end gap-2 p-4 border-t border-falcon-neutral-200` | Save on right, Cancel on left (from right edge); border-top separates from body | Floating buttons outside the panel boundary; buttons in middle of form |
| **R10** | Drawer | `<falcon-angular-drawer>` | `portaled to <body>`, side slide | Drawer for complex multi-field edit flows; contains R08 + R09 internally; closes via Escape or explicit X | Drawer rendered inside a tab; drawer with fixed px width |
| **R11** | Dialog / Popup | `<falcon-angular-dialog>`, `<falcon-angular-confirm-dialog>`, `<falcon-angular-alert-dialog>` | `portaled to <body>`, z-1200, backdrop-blur | Always portaled; confirm CTA disabled until form valid; after success → close → toast | Dialog nested inside another dialog; dialog inside table row |
| **R12** | Toast / Notification | `<app-falcon-notification>` via `FalconToastService` | Corner overlay, z-2000 | Success → green; Error → red; auto-dismiss 5 s for success, persistent for errors | Raw browser `alert()`; custom `<div class="toast">` beside dialogs |

---

## Region-Specific Component Rules

### R01 — Page Shell
- The shell class string is the **single source of truth** for page background: `bg-falcon-neutral-75`
- Do not add `overflow-hidden` to the shell — it must allow drawer/dialog portals to bleed out
- `h-full min-h-0` combination is mandatory for proper flex column scroll behavior
- Source verified from: `org-hierarchy-page-menu.component.html`

### R02 — Page Header
- Header height is NOT fixed — let content size it
- Title is `text-lg font-semibold text-falcon-neutral-900`
- CTA buttons use `size="md"` (38 px height token `--falcon-button-height-md`)
- Do not place filter controls in the header — they belong in R03

### R03 — Filter / Search Row
- Omit R03 entirely when the page has no filtering — never render an empty filter row
- Search input debounce: 300 ms via `debounceTime(300)` in the parent's subscription
- Filter dropdowns use `[options]` array of `{label, value}` — never raw string arrays

### R04 — Main Pane
- `rounded-[14px]` is the canonical card radius — do not use `rounded-xl` (12 px) or `rounded-2xl` (16 px)
- `overflow-hidden` on the pane clips child content to the rounded corners
- `flex flex-col min-h-0` is required for flex children (table, tabs) to scroll correctly

### R05 — Tab Bar
- `<falcon-angular-tabs>` receives `[tabs]` array of `{id, label, disabled?}`
- Active tab index driven by `[(activeTab)]` two-way binding to parent signal
- Tab body components are instantiated once and hidden/shown — they do NOT unmount on tab switch unless explicitly told to
- Tab header action buttons are NOT part of `[tabs]` — they are siblings in the same flex row as the tabs component

### R06 — Data Table / Tree
- Table `[columns]` are defined as `FalconTableColumn[]` typed array — not ad-hoc objects
- Tree node selection emits `(nodeSelect)` event → parent stores `selectedNode` signal
- Both table and tree must have `[loading]="isLoading()"` bound to a loading signal
- Empty state: both components accept `[emptyTemplate]` — use it, never add a sibling `*ngIf` empty block

### R07 — Detail / Info Panel
- Panel appears in a flex split: `flex-1 overflow-hidden` beside the tree's fixed width
- Read/edit mode toggled by a signal — same component, not two separate components
- Unsaved-changes guard fires when switching tree nodes, tabs, or routing away — uses `FalconUnsavedChangesService`

### R08 — Form Section
- Two-column grid for desktop: `grid grid-cols-2 gap-4`
- Single column for narrow / wizard steps: `flex flex-col gap-3`
- Each field = `<falcon-angular-input [label]="..." [errorMessage]="..." formControlName="...">`
- Password fields use `<falcon-angular-password>` — never `<falcon-angular-input type="password">`
- Phone fields use `<falcon-angular-phone-field>` — emits E.164 string

### R09 — Footer / Action Bar
- Canonical layout: `flex items-center justify-end gap-2 p-4 border-t border-falcon-neutral-200`
- In wizards: Next on right, Back on left edge; both same footer row
- Save/Finish button is `[disabled]="form.invalid || loading"` — never enabled during submit

### R10 — Drawer
- Width: `w-[480px]` for standard edit drawers; `w-[640px]` for complex multi-section drawers
- Drawer overlay = `bg-black/40` backdrop — do not darken the main content manually
- Drawer contains full R08 (form) + R09 (footer) inside its body

### R11 — Dialog / Popup
- Small dialogs: `max-w-sm` (384 px); standard: `max-w-md` (448 px); large: `max-w-lg` (512 px)
- Always `[appendTo]="'body'"` — verified in IB dialog fix (2026-05-20)
- Backdrop z: `--falcon-ib-dialog-backdrop-z` = 1200

### R12 — Toast / Notification
- Never import `FalconToastService` in a Stencil component — Angular-only
- Success toast: 5 s auto-dismiss; Error toast: persistent until user dismisses
- Only one toast visible at a time for the same operation — deduplicate by source

---

## Page Assembly Quick Reference

| Page Type | Regions Used |
|---|---|
| List-only page (Users) | R01 → R02 → R03 → R04 → R06 → R12 |
| Master-detail (Org Hierarchy) | R01 → R04(split) → R06(tree) + R07(detail) → R05(tabs) → R08(form) → R09 |
| Wizard/Stepper page | R01 → R04 → stepper → R08(per step) → R09(nav buttons) → R11(finalization) |
| Settings form page | R01 → R02 → R04 → R08 → R09 |
| Dashboard/Cards page | R01 → R02 → R03 → R04 → card-grid(R06 variant) → R12 |

---

## Cross-Links

- [[Falcon Page Assembly Playbook]] — assembles these regions into full pages
- [[Falcon Component Composition Playbook]] — wires components inside each region
- [[Falcon Component Recognition Playbook]] — recognizes which region a UI element belongs to
- [[Falcon Organization Hierarchy Visual Standard]] — the canonical implemented reference
- [[Falcon Light Mode Visual Baseline]] — visual guardrail
- [[Falcon Do Not Change Visual Rules]] — what must never change
- [[Falcon Data Table Composition Rules]] — R06 deep rules
- [[Falcon Form Composition Rules]] — R08 deep rules
- [[Falcon Popup and Drawer Composition Rules]] — R10/R11 deep rules
- [[Falcon Tree and Details Composition Rules]] — R06(tree) + R07 deep rules

## Tags

#type/reference #layer/frontend #layer/composition #status/active #scope/angular-first

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[Falcon Page Assembly Playbook]] · [[Falcon Component Composition Playbook]]
