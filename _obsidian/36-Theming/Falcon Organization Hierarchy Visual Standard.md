---
type: reference
library: "[[Tailwind CSS]]"
topic: org-hierarchy-visual-standard
priority: critical
scope: current-angular-first
mode: light-only
created: 2026-05-20
---
*** Falcon Organization Hierarchy — visual reference page for the platform ***
*** The canonical "this is how a Falcon page looks" page ***

# Falcon Organization Hierarchy Visual Standard

> The Organization Hierarchy page is the visual reference for the Falcon platform — the most heavily-trafficked, most-iterated, and most-tokenized production page. Other pages should pattern-match against it for the page-shell · tree-rail · main-pane · tabs · data-table recipe.

## 1. Purpose

Document the Org Hierarchy page's visual anatomy so:
- Future pages reuse the same shell pattern without re-inventing
- Designers know which parts are "the Falcon page recipe" vs "page-specific"
- Token / theme refactors preserve this page's visual identity

## 2. Current implemented behavior

### Page anatomy (top-down)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  HOST SHELL                                                              │
│  ┌────────────┬──────────────────────────────────────────────────────┐  │
│  │            │  Topbar — bg-falcon-neutral-0 · border-b · h-topbar    │  │
│  │            │  Title + breadcrumb + actions (search / bell / theme)  │  │
│  │  SIDEBAR   ├──────────────────────────────────────────────────────┤  │
│  │            │  Org Hierarchy <section>                                │  │
│  │  bg-       │  bg-falcon-neutral-75 · flex flex-col · p-3 md:p-5     │  │
│  │  falcon-   │  ┌──────────────┬──────────────────────────────────┐  │  │
│  │  teal-700  │  │              │  Main pane                          │  │  │
│  │            │  │  Tree panel  │  bg-falcon-neutral-0 · border       │  │  │
│  │  Falcon    │  │              │  neutral-200 · rounded-[14px]       │  │  │
│  │  brand     │  │  bg-falcon-  │                                     │  │  │
│  │  + nav     │  │  teal-50     │  ┌────────────────────────────┐    │  │  │
│  │            │  │  border      │  │  Tab bar (Hierarchy /       │    │  │  │
│  │            │  │  rounded-    │  │   CommChannels / Apps /     │    │  │  │
│  │            │  │  [14px]      │  │   Settings)                 │    │  │  │
│  │            │  │              │  ├────────────────────────────┤    │  │  │
│  │            │  │              │  │  Node-details section       │    │  │  │
│  │            │  │              │  │  (icon + name + actions)    │    │  │  │
│  │            │  │              │  ├────────────────────────────┤    │  │  │
│  │            │  │              │  │  Active tab content         │    │  │  │
│  │            │  │              │  │  e.g. Users table /          │    │  │  │
│  │            │  │              │  │  Settings tab /              │    │  │  │
│  │            │  │              │  │  Info panel / Wizard         │    │  │  │
│  │            │  │              │  └────────────────────────────┘    │  │  │
│  │            │  └──────────────┴──────────────────────────────────┘  │  │
│  └────────────┴──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Page-shell tokens

| Slot | Token / utility | Hex (light) | Source |
|---|---|---|---|
| Outer section bg | `bg-falcon-neutral-75` | `#f5f6f7` | [CODE] [`org-hierarchy-page-menu.component.html:25`](file://C:/Falcon/Falcon/falcon-web-platform-ui/apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html) |
| Outer padding | `p-3 md:p-5` | 12px / 20px | line 25 |
| Layout grid | `grid grid-cols-[auto_1fr] gap-4 flex-1 min-h-0` | — | line 52 |
| Tree panel bg | `bg-falcon-teal-50` | `#f3f8f5` | [CODE] [`falcon-tree-panel.component.html:2`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html) |
| Tree panel border | `border border-falcon-neutral-200` | `#e5e7eb` | line 2 |
| Tree panel radius | `rounded-[14px]` | 14px | line 2 |
| Main pane bg | `bg-falcon-neutral-0` | `#ffffff` | line 84 |
| Main pane border | `border border-falcon-neutral-200` | `#e5e7eb` | line 84 |
| Main pane radius | `rounded-[14px]` | 14px | line 84 |
| Main pane overflow | `overflow-hidden flex flex-col min-h-0` | — | line 84 |

### Tree panel (Falcon Clients)

| Element | Pattern | Source |
|---|---|---|
| Root row | `flex items-center justify-between gap-4 ps-4 pe-row-action-inset py-3 border-b border-falcon-neutral-150 transition-[background-color]` | [CODE] [`falcon-tree-panel.component.html:10`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html) |
| Root row selected | `[class.bg-falcon-teal-100]="isRootSelected()"` | line 12 |
| Root row hover | `[class.hover:bg-falcon-neutral-0]="rootSelectable() && !isRootSelected()"` | line 13 |
| Initials chip (root mode) | `bg-falcon-teal-700 text-white rounded-full` | line 26 |
| Falcon brand mark (logo mode) | `text-falcon-teal-500 svg path fill=currentColor` | line 31 |
| Section label "Falcon Clients" | `text-2xs text-falcon-neutral-600 pt-3 px-4 pb-1.5 tracking-label` | line 60 |
| Tree scroll body | `falcon-tree flex-1 min-h-0 overflow-auto [scrollbar-gutter:stable] pb-1` | line 73 |
| Tree row | shared with tree-node component, padding via `--spacing-row-*` tokens | tree-node template |
| Action kebab geometry | `w-[22px] h-[22px] rounded-xs` (root) — same for per-node | lines 48, 115 |

### Main pane internals

#### Tab bar

```html
<div class="ps-5 pe-2 pt-1 border-b border-falcon-neutral-150">
  <falcon-angular-tabs ...>
    <ng-template falconTabActions="hierarchy">
      <falcon-view-toggle [options]="state.structureOptions" />
    </ng-template>
  </falcon-angular-tabs>
</div>
```

Tabs: Hierarchy · CommChannels & Services · Apps & Services · Settings. Active tab: bottom-border + teal-700 text + bold.

#### Node-details section (header band per tab)

```html
<falcon-node-details-section [label]="..." [imageUrl]="...">
  <ng-template falconNodeDetailsAvatar>
    <app-org-node-avatar [identity]="..." size="md" />
  </ng-template>
  <ng-template falconNodeDetailsActions>
    <!-- Buttons: Information · Add Client · Add Node · Add User -->
  </ng-template>
</falcon-node-details-section>
```

- Icon + name + button row
- Icon: 28px (md size) — `app-org-node-avatar`
- Button row: `gap-3` between buttons, all `<falcon-angular-button>` (variants: link/secondary/primary)
- Padding: ~16-18px vertical

#### Users table (Hierarchy tab — primary content)

```html
<falcon-angular-data-table
  style="--falcon-table-header-bg: var(--color-falcon-neutral-30, #f7f8fa); --falcon-table-footer-bg: var(--color-falcon-neutral-30, #f7f8fa);"
  [data]="state.users()"
  [columns]="state.userColumns()"
  [rowMenuItems]="state.userRowMenuItems()"
  [paginator]="false"
  [showCustomFooter]="true"
  [lazy]="true"
  [rows]="state.usersPageSize()"
  [currentPage]="state.usersPageNumber()"
  [rowsPerPageOptions]="rowsPerPageOptions"
  [totalRecords]="state.usersTotalCount()"
  [emptyData]="usersEmptyDataConfig()">
</falcon-angular-data-table>
```

- Wrapped in `border border-falcon-neutral-200 rounded-md` (note: `rounded-md` here, not the page-shell's `rounded-[14px]`)
- Header bg overridden inline to `neutral-30` (light grey wash)
- Status badge column uses `<falcon-angular-status-badge>` with `severity="active|disabled|invited|deleted"`
- Row hover: `--falcon-data-table-row-bg-hover` → neutral-25 (`#fafbfc`)
- Row selected: `--falcon-data-table-row-bg-selected` → teal-tint (`#eef3f4`)
- Rows-per-page default: **10** (per Falcon standing rule [[feedback_data_table_default_page_size_10]])

#### Information panel (Info button in node-details-section)

```html
<app-org-info-panel [nodeName]="..." [editable]="..." [clientPhoto]="..." />
```

Wrapped in `mx-5 mb-6 border border-falcon-neutral-200 rounded-md bg-falcon-neutral-0` — same card recipe as Users table wrapper.

#### Settings tab content

```html
<app-settings-tab [nodeId]="..." />
```

Same wrapper recipe.

#### CommChannels / Apps tabs

```html
<app-service-pricing [nodeId]="..." kind="comm-channel|application" />
```

Both tabs use the `<app-service-pricing>` component with different `kind` values — Falcon's "share a component, configure via prop" pattern.

#### Wizards inside the page (when active)

When user clicks "Add Client" or "Add User", the wizard replaces the tab content:
```html
@if (state.addClientOpen()) {
  <app-add-client-wizard ... />
} @else if (state.addUserOpen()) {
  <app-add-user-wizard ... />
} @else if (state.userInfoOpen()) {
  <app-user-details-page ... />
} @else {
  <!-- normal tab content -->
}
```

The wizard takes over the entire `<main>` area; tree-panel stays on the left throughout.

### Action buttons (per node-details-section actions slot)

| Tab + State | Buttons shown |
|---|---|
| Hierarchy + Info-closed + selected root | Add Client (secondary) · Add User (primary) |
| Hierarchy + Info-closed + selected sub-node | Information (link) · Add Node (secondary) · Add User (primary) |
| Hierarchy + Info-open + view | Back to Users (secondary) · Edit Info (primary) |
| Hierarchy + Info-open + edit | Cancel (secondary) · Save Changes (primary) |
| Settings + view + has PES rights | Edit (primary) |
| Settings + edit | Cancel (secondary) · Save Changes (primary) |

All buttons are `<falcon-angular-button>` with `variant="primary|secondary|link"` and `size="md"` (or `sm` for the link-variant Information button).

### Drawer (Add Node)

Add Node opens a side drawer `<app-org-node-drawer>` at top-level of the page-menu component. Uses Falcon drawer chrome from `<falcon-angular-drawer>`.

## 3. Evidence / source file references

- [CODE] [`apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html`](file://C:/Falcon/Falcon/falcon-web-platform-ui/apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html) — entire page-shell template
- [CODE] [`libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html) — tree-panel chrome
- [CODE] [`libs/falcon-ui-tokens/src/components/organization-hierarchy.tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/organization-hierarchy.tokens.css) — token contract (Stencil-side)

## 4. Best practice for reuse

**The org-hierarchy page-shell recipe is:**

1. **Outer wrapper:** `<section class="bg-falcon-neutral-75 flex flex-col gap-4 p-3 md:p-5 h-full min-h-0 relative">`
2. **Two-column grid (when applicable):** `<div class="grid grid-cols-[auto_1fr] gap-4 flex-1 min-h-0">`
3. **Left rail (if present):** branded surface `bg-falcon-teal-50 border border-falcon-neutral-200 rounded-[14px]`
4. **Main pane:** `<main class="bg-falcon-neutral-0 border border-falcon-neutral-200 rounded-[14px] overflow-hidden flex flex-col min-h-0">`
5. **Tab bar inside main:** `<div class="ps-5 pe-2 pt-1 border-b border-falcon-neutral-150">`
6. **Section header:** `<falcon-node-details-section>` with avatar slot + actions slot
7. **Card content:** wrap in `mx-5 mb-6 border border-falcon-neutral-200 rounded-md bg-falcon-neutral-0` — repeated wrapper recipe

**Other pages that should match this recipe:**
- Wallet & Balance page (when built)
- CommChannels & Services Management page
- Marketplace & Applications page
- Contracts & Cost Management page
- Templates page
- Contact Groups page

**Other pages NOT yet shipped but should follow:** Permissions page (admin/system).

## 5. Wrong patterns to avoid

- ❌ New page that uses a different outer bg color (must be `bg-falcon-neutral-75`)
- ❌ Card without `border-falcon-neutral-200 rounded-[14px]` recipe (would break visual consistency)
- ❌ Tab bar without `border-b border-falcon-neutral-150` (the standard divider)
- ❌ Custom 3-column layout where 2-column is sufficient
- ❌ Data table without the `border border-falcon-neutral-200 rounded-md` wrapper recipe
- ❌ Action buttons without `<falcon-angular-button>` wrapper (e.g., raw `<button>` styled inline — see P1-33 reverse)

## 6. Angular-first notes

- Page lives in `apps/admin-console/src/app/features/org-hierarchy-page/`
- Template: `components/org-hierarchy-page-menu.component.html`
- All children are Angular components from `libs/falcon-ui-core/src/angular-wrapper/components/`
- State management via standalone state slices (composed at page-state.facade level)
- Per-tab content is conditional via Angular's `@switch` / `@if` template control flow
- Wizards / popups composed via `<falcon-angular-popup>` + `<falcon-angular-drawer>` from the design system

## 7. Future-agent instructions

- **Treat this page as the visual contract reference.** When building a new page, open this note + the live screen, mirror the shell + recipe.
- **Do NOT redesign the org-hierarchy page** without explicit Ammar approval — it's the canonical reference.
- **What's page-specific** (don't generalize to other pages):
  - The 4-tab structure (Hierarchy / CommChannels / Apps / Settings) is specific to clients-and-services management
  - The tree-panel left rail is specific to hierarchical-data pages
  - The Add Client wizard is specific to client onboarding
- **What SHOULD generalize** (reuse on other pages):
  - The outer `bg-falcon-neutral-75 p-3 md:p-5` wrapper
  - The `border-falcon-neutral-200 rounded-[14px] bg-falcon-neutral-0` card recipe
  - The `<falcon-angular-tabs>` + `<falcon-node-details-section>` header pattern
  - The `<falcon-angular-data-table>` with `border border-falcon-neutral-200 rounded-md` wrapper
  - The `<falcon-angular-button>` variant=primary/secondary/link mapping for primary/secondary/tertiary actions

## See also

- [[Falcon Light Mode Visual Baseline]] · [[Falcon Current Color Usage Map]] · [[Falcon Current Spacing Radius Shadow Map]] · [[Falcon Current Hover Focus State Map]]
- [[Falcon Page Visual Consistency Rules]] — rules for building new pages from this baseline
- [[Falcon Do Not Change Visual Rules]] — strict guardrails
- Existing component vault notes: [[Falcon Tree Panel]] · [[Falcon Data Table]] · [[Falcon Button]] · [[Falcon Tabs]]
- Supporting evidence: Brain Outputs `understanding/pages/organization-hierarchy/` (the 14-file dossier per page-learning system)

## Tags

#type/reference #layer/frontend #layer/design #light-mode-baseline #reference-page

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]] · [[PAGE_LEARNING_INDEX]]
