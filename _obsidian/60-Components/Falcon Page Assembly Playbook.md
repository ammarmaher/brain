---
type: playbook
cluster: page-assembly
priority: critical
scope: current-angular-first
mode: light-only
created: 2026-05-20
---
*** Falcon Page Assembly Playbook ***
*** Teaches the Brain to build full pages from already-implemented Falcon components ***
*** Angular-first; React/Vue future placeholders only ***

# Falcon Page Assembly Playbook

> Once the UI patterns have been mapped via [[Falcon Component Recognition Playbook]], this note shows how to compose them into a full Falcon page that matches the platform's visual identity. Every region below has a canonical recipe — use it verbatim.

## 1. Purpose

Turn a recognized component list into a finished page that:
- Inherits the Falcon visual identity automatically (no custom CSS)
- Survives token / theme refactors without visual drift
- Reads consistently with [[Falcon Organization Hierarchy Visual Standard]] (the canonical reference page)
- Handles loading / empty / error states with Falcon-native components, not hand-rolled fallbacks

## 2. The page-shell pattern (canonical recipe)

Every Falcon page starts with this shell — sourced verbatim from `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html`.

```html
<section class="bg-falcon-neutral-75 flex flex-col gap-4 p-3 md:p-5 h-full min-h-0 relative">

  <!-- (Optional) Two-column rail layout -->
  <div class="grid grid-cols-[auto_1fr] gap-4 flex-1 min-h-0">

    <!-- (Optional) Left rail card -->
    <aside class="bg-falcon-teal-50 border border-falcon-neutral-200 rounded-[14px] min-h-0 overflow-hidden flex flex-col">
      <!-- tree, sidebar nav, etc. -->
    </aside>

    <!-- Main pane card -->
    <main class="bg-falcon-neutral-0 border border-falcon-neutral-200 rounded-[14px] overflow-hidden flex flex-col min-h-0">

      <!-- Tab bar -->
      <div class="ps-5 pe-2 pt-1 border-b border-falcon-neutral-150">
        <falcon-angular-tabs [tabs]="tabs" [activeTab]="activeTab">
          <ng-template falconTabActions="hierarchy">
            <!-- per-tab action buttons -->
          </ng-template>
        </falcon-angular-tabs>
      </div>

      <!-- Section header (avatar + name + actions) -->
      <falcon-node-details-section [label]="..." [imageUrl]="...">
        <ng-template falconNodeDetailsAvatar><app-org-node-avatar … /></ng-template>
        <ng-template falconNodeDetailsActions><!-- buttons --></ng-template>
      </falcon-node-details-section>

      <!-- Content area (per-tab) -->
      <!-- e.g. Users table, Settings panel, Info panel, Wizard, etc. -->

    </main>
  </div>
</section>
```

## 3. Page regions — recipe per region

### Header / action bar

Sits at the top of the **main pane** card (not the host shell topbar — that's a separate concern).

**Recipe:**
```html
<falcon-node-details-section [label]="state.nodeName()" [imageUrl]="state.imageUrl()">
  <ng-template falconNodeDetailsAvatar>
    <app-org-node-avatar [identity]="…" size="md" />
  </ng-template>
  <ng-template falconNodeDetailsActions>
    <falcon-angular-button variant="link" size="sm" (falconClick)="onInfo()">Information</falcon-angular-button>
    <falcon-angular-button variant="secondary" size="md" (falconClick)="onAddNode()">Add Node</falcon-angular-button>
    <falcon-angular-button variant="primary" size="md" (falconClick)="onAddUser()">Add User</falcon-angular-button>
  </ng-template>
</falcon-node-details-section>
```

**Rules:**
- All buttons MUST be `<falcon-angular-button>` — never raw HTML
- Variant order from left to right: link → secondary → primary (least to most emphasized)
- Gap between buttons: `gap-3` (12px)
- Vertical padding: ~16-18px (driven by token contract — do not override)

### Tab region

Falcon tabs sit immediately below the page-shell card's top edge, above the section header (for tab-driven pages like Organization Hierarchy).

**Recipe:**
```html
<div class="ps-5 pe-2 pt-1 border-b border-falcon-neutral-150">
  <falcon-angular-tabs [tabs]="state.tabs" [activeTab]="state.activeTab()" (tabChange)="onTabChange($event)">
    <ng-template falconTabActions="hierarchy">
      <falcon-view-toggle [options]="state.structureOptions" />
    </ng-template>
  </falcon-angular-tabs>
</div>
```

**Rules:**
- Tab bar has `border-b border-falcon-neutral-150` divider — do not change radius / no rounded corners on the divider
- Per-tab action UI goes inside `<ng-template falconTabActions="<tab-value>">` (P0-07 fragility — being refactored)

### Filter / search area

Sits between the tab bar (or section header) and the table/list region.

**Recipe (simple search):**
```html
<div class="px-5 pt-4 pb-2 flex items-center gap-3">
  <falcon-angular-search-input [(ngModel)]="state.search" (search)="onSearch($event)" />
  <falcon-angular-button variant="ghost" size="md" (falconClick)="onClearFilters()">Clear</falcon-angular-button>
</div>
```

**Recipe (advanced filter panel):**
```html
<falcon-angular-filter-panel [fields]="state.filterFields" (apply)="onApplyFilter($event)" />
```

**Rules:**
- ⚠ `<falcon-angular-filter-panel>` is P1-17 (uses raw HTML controls) — for production-critical filter UIs, compose Falcon atoms manually until P1-17 lands
- Search input clears via its built-in × button — do not add an external clear button next to it
- For filter "Apply" buttons, use `<falcon-angular-button variant="primary">`

### Data table region

The largest region on most Falcon list pages.

**Recipe:**
```html
<div class="px-5 pb-5 flex-1 min-h-0 flex flex-col">
  <div class="border border-falcon-neutral-200 rounded-md flex-1 min-h-0 overflow-hidden">
    <falcon-angular-data-table
      style="--falcon-table-header-bg: var(--color-falcon-neutral-30, #f7f8fa); --falcon-table-footer-bg: var(--color-falcon-neutral-30, #f7f8fa);"
      [data]="state.rows()"
      [columns]="state.columns()"
      [rowMenuItems]="state.rowMenuItems()"
      [paginator]="true"
      [lazy]="true"
      [rows]="state.pageSize()"
      [currentPage]="state.pageNumber()"
      [rowsPerPageOptions]="[10, 25, 50, 100]"
      [totalRecords]="state.totalCount()"
      [emptyData]="emptyConfig()">
    </falcon-angular-data-table>
  </div>
</div>
```

**Rules:**
- Wrapper recipe: `border border-falcon-neutral-200 rounded-md` (NOTE: `rounded-md`, NOT the page-shell's `rounded-[14px]`)
- Default page size: 10 (Falcon standing rule — [Memory: feedback_data_table_default_page_size_10])
- Status cells use `<falcon-angular-status-badge severity="...">` — never inline hex/tailwind chips
- Custom cells via `<ng-template falconColumn="<field>" let-row>…</ng-template>` (Strategy E)
- Empty state via `[emptyData]` config — DON'T put a separate `<div>` next to the table

### Details / info panel (master-detail right-side)

Sits to the right of a list or below a tab bar.

**Recipe:**
```html
<div class="mx-5 mb-6 border border-falcon-neutral-200 rounded-md bg-falcon-neutral-0">
  <app-org-info-panel [nodeName]="…" [editable]="…" [clientPhoto]="…" />
</div>
```

**Rules:**
- Card recipe matches the data-table wrapper: `border-falcon-neutral-200 rounded-md`
- Inset: `mx-5 mb-6` keeps the panel within the main pane's inner gutter
- Use Falcon atoms inside (input/dropdown/button/etc.) — never raw form HTML

### Form section

For full-page forms (e.g., user profile, settings).

**Recipe:**
```html
<form [formGroup]="state.form" class="grid grid-cols-1 md:grid-cols-2 gap-4 px-5 py-4">
  <falcon-angular-input formControlName="firstName" label="First Name" required />
  <falcon-angular-input formControlName="lastName" label="Last Name" required />
  <falcon-angular-email-field formControlName="email" label="Email" />
  <falcon-angular-phone-field formControlName="phone" label="Phone" />
  <falcon-angular-dropdown formControlName="role" label="Role" [options]="state.roles()" />
  <falcon-angular-date-picker formControlName="effectiveDate" label="Effective Date" />

  <div class="md:col-span-2 flex justify-end gap-3 mt-2">
    <falcon-angular-button variant="secondary" type="button" (falconClick)="onCancel()">Cancel</falcon-angular-button>
    <falcon-angular-button variant="primary" type="submit" [loading]="state.saving()">Save Changes</falcon-angular-button>
  </div>
</form>
```

**Rules:**
- Use `[formGroup]` + `formControlName` (Reactive Forms) — CVA is implemented on 15 form wrappers (per Capability Matrix)
- Grid layout: `grid grid-cols-1 md:grid-cols-2 gap-4` is the canonical 2-column form
- Required-field marker comes from the input wrapper's `required` attribute — do not add a manual `*`
- Errors render below the field automatically via the wrapper's `errorMessage` / `errorText` prop

### Drawer / wizard region

Side drawer (for Add Node, etc.) or wizard takes over content area (for Add Client/User).

**Recipe (drawer):**
```html
<falcon-angular-drawer [open]="state.drawerOpen()" position="end" size="md" (close)="onDrawerClose()">
  <ng-template falconDrawerHeader>Add Node</ng-template>
  <ng-template falconDrawerContent>
    <app-org-node-drawer-form … />
  </ng-template>
  <ng-template falconDrawerFooter>
    <falcon-angular-button variant="secondary" (falconClick)="onCancel()">Cancel</falcon-angular-button>
    <falcon-angular-button variant="primary" (falconClick)="onSave()">Save</falcon-angular-button>
  </ng-template>
</falcon-angular-drawer>
```

**Recipe (wizard inside main pane):**
```html
@if (state.addClientOpen()) {
  <app-add-client-wizard … />
} @else if (state.addUserOpen()) {
  <app-add-user-wizard … />
} @else {
  <!-- normal tab content -->
}
```

**Rules:**
- Drawer position `start` or `end` only (logical) — never `left` / `right`
- Wizard inside a page replaces the tab content (does NOT open as a modal)
- Wizard step controls use `<falcon-angular-wizard>` + `<falcon-angular-stepper>` (NOT legacy `<falcon-stepper>` — P0-02 migration)

### Empty state

For "no items yet" or "no results" panels.

**Recipe:**
```html
<falcon-angular-empty-state
  icon="users"
  title="No users yet"
  description="Get started by inviting your first user.">
  <ng-template falconEmptyStateActions>
    <falcon-angular-button variant="primary" (falconClick)="onAddUser()">Add User</falcon-angular-button>
  </ng-template>
</falcon-angular-empty-state>
```

**Rules:**
- Always use `<falcon-angular-empty-state>` — never `<div>` with "No results found" text
- For table-internal empty states, use the `[emptyData]` config on `<falcon-angular-data-table>` instead

### Loading state

**Recipe (page-wide):**
- Use the global default inline loader (`provideFalconLoader`) per [Memory: project_falcon_loader_inline_config_2026_05_19]
- Inline loader is centered with `z-2000`

**Recipe (per-region):**
- For data tables, use `[loading]` input on `<falcon-angular-data-table>` (Strategy E renders the loading overlay)
- For skeletons, use the Loader Studio registry config per [Memory: project_signalr_realtime_loader_skeleton_handoff_2026_05_19]
- For buttons: `<falcon-angular-button [loading]="saving()">Save</falcon-angular-button>`

**Rules:**
- DO NOT roll your own spinner CSS
- DO NOT use `rgba(255,255,255,0.7)` literal overlay (P3-02 hardcoded — being tokenized)
- DO NOT use full-screen overlay loader anymore (replaced by inline default)

### Error state

**Recipe (inline error in form field):**
- Errors auto-render below `<falcon-angular-input>` etc. via `errorMessage` prop on the wrapper

**Recipe (toast error):**
```ts
this.toast.error({ summary: 'Save failed', detail: 'Please retry.' });
```
- Use `FalconToastService` / `FalconMessageService` — never `console.error()` user-facing

**Recipe (page-level error panel):**
- Use `<falcon-angular-empty-state>` with `icon="alert"` and a Retry action button

## 4. Responsive rules

| Breakpoint | Behavior |
|---|---|
| Mobile (< 768px) | Outer padding `p-3` (12px), grids collapse to single column, drawer goes full-width |
| Tablet (≥ 768px) | Outer padding `p-5` (20px), grids `md:grid-cols-2` |
| Desktop (≥ 1024px) | Same as tablet — Falcon doesn't introduce a new desktop-only breakpoint |
| Density compact | `[data-density="compact"]` reduces spacing — DO NOT hardcode pixel sizes that block density re-rationing |

**Rules:**
- Use Tailwind's `md:` / `lg:` prefixes — never custom media queries in component CSS
- Use logical CSS (`ps-*` / `pe-*`) so RTL works automatically — DO NOT use `pl-*` / `pr-*` for directional spacing
- See [[Tailwind Sizing and Responsive]] for the full responsive cheat sheet

## 5. Spacing / radius / shadow rules

Sourced verbatim from [[Falcon Current Spacing Radius Shadow Map]].

| Slot | Value | Rule |
|---|---|---|
| Page outer padding | `p-3 md:p-5` (12 / 20px) | NEVER `p-4`, `p-6`, `p-[20px]` |
| Card gap | `gap-4` (16px) | NEVER `gap-3`, `gap-5`, `gap-[14px]` |
| Card padding-x | `px-5` (20px) inside main pane | Inset for header / tab / table region |
| Card radius (page-shell + main pane + left rail) | `rounded-[14px]` | NEVER 12, 16, or other |
| Card radius (data-table wrapper, info panel) | `rounded-md` (6px) | Inner cards use a smaller radius |
| Chip radius | `rounded-full` | Status badges, tags, avatars |
| Card shadow (none by default) | — | Falcon panels use `border` + `radius`, not shadows |
| Card shadow (raised popover) | `--shadow-falcon-popover` | Dropdowns, menus |
| Modal shadow | `--shadow-falcon-modal` | Dialogs, drawers |
| Focus ring | `--shadow-falcon-focus` | All interactive elements |

## 6. Light-mode visual baseline rules

Sourced from [[Falcon Light Mode Visual Baseline]] (the locked guardrail per Ammar 2026-05-20).

| Surface role | Token / utility |
|---|---|
| Page canvas | `bg-falcon-neutral-0` (`#ffffff`) |
| Page outer wrapper | `bg-falcon-neutral-75` (`#f5f6f7`) |
| Main pane card | `bg-falcon-neutral-0` (`#ffffff`) |
| Left rail card | `bg-falcon-teal-50` (`#f3f8f5`) |
| Default border | `border-falcon-neutral-200` (`#e5e7eb`) |
| Strong divider | `border-falcon-neutral-150` (`#eef0f2`) |
| Brand-accent text | `text-falcon-teal-700` (`#0d3f44`) |
| Error / required marker | `text-falcon-red-500` (`#dc2626`) |
| Selected row tint (table) | `bg-falcon-teal-tint` (`#eef3f4`) |
| Selected client row (tree) | `bg-falcon-teal-100` (`#e8f0f1`) |
| Sidebar (host shell) | `bg-falcon-teal-700` + `text-white` |

**Rules:**
- NEVER use arbitrary hex (`bg-[#0d3f44]`) when a token utility exists (`bg-falcon-teal-700`)
- NEVER invent a new neutral stop / new teal stop (palette is over-granulated per [[Falcon Color Palette Audit]])
- NEVER replace the page-shell recipe colors per page

## 7. Assembly walk-through (worked example)

**Task:** Build a "Users in this node" view inside Organization Hierarchy.

**Step 1 — Recognize.** Walk [[Falcon Component Recognition Playbook]]:
- Page-shell with tab bar + main pane → page recipe (§2)
- Tab "Users" → `<falcon-angular-tabs>` with `falconTabActions` slot
- "Add User" button → `<falcon-angular-button variant="primary">`
- Users list (rows + columns + status chip + kebab) → `<falcon-angular-data-table>` with `<falcon-angular-status-badge>` cell template + `[rowMenuItems]`
- "No users yet" → `<falcon-angular-empty-state>` (or table's `[emptyData]`)
- Pagination → built-in `<falcon-angular-paginator>` via `[paginator]="true"` (default page size 10)

**Step 2 — Assemble.**
```html
<section class="bg-falcon-neutral-75 flex flex-col gap-4 p-3 md:p-5 h-full min-h-0">
  <main class="bg-falcon-neutral-0 border border-falcon-neutral-200 rounded-[14px] overflow-hidden flex flex-col min-h-0">
    <div class="ps-5 pe-2 pt-1 border-b border-falcon-neutral-150">
      <falcon-angular-tabs [tabs]="tabs" [activeTab]="activeTab()" />
    </div>
    <falcon-node-details-section [label]="state.nodeName()">
      <ng-template falconNodeDetailsActions>
        <falcon-angular-button variant="primary" size="md" (falconClick)="onAddUser()">Add User</falcon-angular-button>
      </ng-template>
    </falcon-node-details-section>
    <div class="px-5 pb-5 flex-1 min-h-0 flex flex-col">
      <div class="border border-falcon-neutral-200 rounded-md flex-1 min-h-0 overflow-hidden">
        <falcon-angular-data-table
          [data]="state.users()"
          [columns]="state.userColumns()"
          [rowMenuItems]="state.userRowMenuItems()"
          [paginator]="true"
          [rows]="10"
          [totalRecords]="state.usersTotalCount()"
          [emptyData]="usersEmpty()">
        </falcon-angular-data-table>
      </div>
    </div>
  </main>
</section>
```

**Step 3 — Validate.** Run [[Falcon New Page Implementation Checklist]] over the result. Every "must ask" should answer YES.

## 8. Wrong patterns to avoid

- ❌ Building a page-shell from scratch (use §2 recipe)
- ❌ Inline `<button>` styled with Tailwind colors instead of `<falcon-angular-button>`
- ❌ `<div class="rounded-lg border ...">` instead of the canonical card recipe (`border-falcon-neutral-200 rounded-[14px]`)
- ❌ Custom modal scaffold instead of `<falcon-angular-popup>` or `<falcon-angular-drawer>`
- ❌ Raw `<table>` instead of `<falcon-angular-data-table>`
- ❌ Custom "no results" `<div>` instead of `<falcon-angular-empty-state>`
- ❌ Full-screen overlay loader (the inline loader is now the default — [Memory: project_falcon_loader_inline_config_2026_05_19])
- ❌ Per-page CSS file with `.users-table { ... }` overrides — break the rule, document a token gap
- ❌ Inline `style="..."` for visuals that have tokens

## 9. Angular-first notes

- Page templates live in `apps/<app-name>/src/app/features/<feature>/`
- Per-page state via standalone `*StateSlice` / `*Facade` (signal-based)
- Conditional rendering via Angular `@switch` / `@if` (NO `*ngIf` / `*ngFor` per Falcon standing rule)
- Standalone components only — Falcon platform is zoneless Angular 21

## 10. Future-agent instructions

- **For every new page:** open this playbook + [[Falcon Component Recognition Playbook]] + [[Falcon Organization Hierarchy Visual Standard]] BEFORE writing template HTML.
- **Pattern-match against the canonical reference page.** If your page diverges visually from Organization Hierarchy without a reason, refactor.
- **If a region doesn't fit any recipe in §3:** log a gap in [[Falcon Component Gap Registry]] BEFORE inventing a new pattern.
- **After implementation:** walk [[Falcon New Page Implementation Checklist]] and confirm every "must ask" answers YES.

## See also

- [[Falcon Component Recognition Playbook]] — recognize patterns first
- [[Falcon Component Selection Decision Tree]] — reuse vs extend vs create
- [[Falcon Component Capability Matrix]] — quick-pick reference
- [[Falcon Screenshot To Component Mapping Guide]] — 6-step process for designs
- [[Falcon New Page Implementation Checklist]] — pre-merge checklist
- [[Falcon Organization Hierarchy Visual Standard]] — canonical reference page
- [[Falcon Light Mode Visual Baseline]] · [[Falcon Page Visual Consistency Rules]] · [[Falcon Do Not Change Visual Rules]]
- [[Falcon Current Spacing Radius Shadow Map]] · [[Falcon Current Color Usage Map]] · [[Falcon Current Hover Focus State Map]]

## Tags

#type/playbook #layer/frontend #cluster/page-assembly #priority/critical

## Hubs

- [[60-Components/Falcon Component Recognition Playbook|Component Recognition Playbook]] · [[36-Theming/README|36-Theming]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
