# Falcon Component Registry

> **Single source of truth** for Falcon UI library understanding.
> Maintained by the `component-capability-upgrade` skill.
> Cross-reference: [`FALCON_UI_BUGS_AND_QUIRKS.md`](FALCON_UI_BUGS_AND_QUIRKS.md) — known bugs catalog (consulted BEFORE every edit).
>
> **Promotion gate:** entries are `PENDING` by default. They become `APPROVED` only after the user explicitly approves the entry (per `protocols\APPROVAL_LEARNING_GATE.md`).
>
> **Understanding score (Ammar's rule, 2026-05-14):**
> - The score auto-promotes to **100%** when the user approves the page that uses the component AND there are no open comments on that component.
> - The assistant does NOT ask for a score per change. The score climbs based on **page-level approval signals**.
> - Trigger phrases for approval: see `skills\component-capability-upgrade\SKILL.md` → "Auto-promote rule".

---

## Index

| # | Component selector | Layer | Score | Status | Used in pages | Open comments | Last update |
|---|---|---|---|---|---|---|---|
| 1 | `<falcon-angular-data-table>` + `<falcon-table-tw>` | Library | **100%** | **APPROVED** | admin-console/org-hierarchy-page | none | 2026-05-14 |
| 2 | `<falcon-angular-menu>` + `<falcon-menu-tw>` | Library | **80%** | **UNBLOCKED — pending re-approval** | admin-console/org-hierarchy-page (data-table row actions) | BUG-004 syncProps reset **RESOLVED** Wave 19; menu now opens row-action popup correctly | 2026-05-14 |
| 3 | `<falcon-angular-paginator>` + `<falcon-paginator-tw>` | Library | **100%** | **APPROVED** | admin-console/org-hierarchy-page (via custom footer) | none | 2026-05-14 |
| 4 | `<falcon-angular-tabs>` + `<falcon-tabs-tw>` | Library | **100%** | **APPROVED** | admin-console/org-hierarchy-page | none | 2026-05-14 |
| 5 | `<falcon-tree-panel>` | Library | **100%** | **APPROVED** | admin-console/org-hierarchy-page | none | 2026-05-14 |
| 6 | `<app-falcon-status>` | Consumer | **100%** | **APPROVED** | admin-console/org-hierarchy-page | none | 2026-05-14 |
| 7 | `<app-falcon-custom-table-footer>` | Consumer | **100%** | **APPROVED** | admin-console/org-hierarchy-page | none | 2026-05-14 |
| 8 | `<falcon-node-details-section>` + `FalconNodeDetailsActionsDirective` | **Library (NEW)** | **80%** | PENDING | admin-console/org-hierarchy-page (node header + info-panel header) | none | 2026-05-14 |

### Score history (page-level approval events log)

| Date | Page | Approval phrase | Components promoted to 100% |
|---|---|---|---|
| 2026-05-14 14:00 | admin-console/org-hierarchy-page | "approve the page" | data-table, paginator, tabs, tree-panel, falcon-status, custom-table-footer (6/7) |
| 2026-05-14 14:00 | admin-console/org-hierarchy-page | (same — stays_blocked) | `<falcon-angular-menu>` stays at 60% due to BUG-004 syncProps reset (open comment) |
| _(none yet)_ | | | |

---

## 1. `<falcon-angular-data-table>` + `<falcon-table-tw>`

**Score:** 60% (Ammar, 2026-05-14) — PENDING
**Layer:** Angular wrapper (`libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/`) + Stencil Light-DOM `<falcon-table-tw>` (`libs/falcon-ui-core/src/components/falcon-table/`)

### Identity
- Angular selector: `<falcon-angular-data-table>` (alias `<falcon-angular-data-table>`)
- Wrapper class: `FalconAngularDataTableComponent`
- Stencil tag: `<falcon-table-tw>` (Light DOM, Tailwind-class-driven)

### Role
Renders a Falcon-themed data table with header, body, optional paginator, lazy-load events, row/cell projection via directive templates, sortable columns, selection, and row-action menu hooks.

### Contract — Inputs (selected)
| Input | Type | Purpose |
|---|---|---|
| `data` | `readonly T[]` | Typed row payload |
| `columns` | `readonly ColumnDef[]` | Column descriptors driving header + body |
| `paginator` | `boolean` | Toggle internal paginator (we set false and render `<app-falcon-custom-table-footer>` instead) |
| `lazy` / `totalRecords` | `boolean` / `number` | Server-driven pagination mode |
| `rows`, `rowsPerPageOptions` | `number` / `number[]` | Page size + selectable options |
| `rowMenuItems` | `FalconDataTableMenuItem[] \| null` | **Was** used to populate the now-deleted row-action menu |
| `selection`, `selectable`, `selectionMode` | T \| T[] \| null / boolean / 'single'\|'multiple' | Row selection model |
| `emptyMessage` | `string` | Shown when `data.length === 0` |

### Contract — CSS variables (read by `<falcon-table-tw>`)
| Variable | Default | We use for |
|---|---|---|
| `--falcon-table-header-bg` | (theme) | Set to `var(--color-falcon-neutral-30)` for grey header |
| `--falcon-table-footer-bg` | (theme) | Match header bg |
| `--falcon-table-container-bg` | (theme) | White interior |
| `--falcon-table-container-border-radius` | (theme) | Force `0px` per user request |
| `--falcon-table-header-padding-block` | (theme) | `25px` to match footer height |
| `--falcon-table-footer-padding-block` | (theme) | `12px` (footer is intrinsically tall via paginator) |
| `--falcon-table-cell-padding-block` | `13px` | `20px` for 64px row height (matches footer with status badge content) |

### Verified working state (2026-05-14)
- Header / data row / footer heights within **0.94px** (live measured)
- Container `border-radius: 0` (all 4 corners)
- No orphan menu element inside the data-table
- No row kebab column rendered

### Change history (delta log)
- **2026-05-13** (initial) — used as-is from library
- **2026-05-13 Wave 17.4** — set `--falcon-table-header-bg` + `--falcon-table-footer-bg` to `var(--color-falcon-neutral-30, #fafafa)` via imperative style on the element (CSS var inheritance fix — see §4 of `Brain Outputs\reports\org-hierarchy-page-night-shift-2026-05-14\component-knowledge-log.md`)
- **2026-05-14 §21** — added `--falcon-table-container-border-radius: 0`, `--falcon-table-header-padding-block: 25px`, `--falcon-table-cell-padding-block: 20px` to harmonize heights
- **2026-05-14 §20** — **LIBRARY EDIT**: deleted `<falcon-angular-menu>` block from `falcon-data-table.component.html`, hard-coded `[attr.has-row-actions]="null"`, removed `@ViewChild('rowMenu')` and `showAt(...)` call from `falcon-data-table.component.ts`. Affects all consumers library-wide.

### Known bugs / quirks
- See [`FALCON_UI_BUGS_AND_QUIRKS.md`](FALCON_UI_BUGS_AND_QUIRKS.md):
  - BUG-2026-05-14-001 — `:host` CSS var override breaks parent cascade
  - BUG-2026-05-14-002 — Stencil prop-forwarding gap (Angular `[prop]` doesn't reliably reach Stencil)
  - BUG-2026-05-14-003 — `headerKey` written raw to DOM (no translate)

### Evidence
- `Brain Outputs\reports\falcon-ui-library-learnings\2026-05-14-org-hierarchy-data-table\index.md`
- Build hashes: admin-console `faceeba559362666`, management-console `ab3840dfb76b63a1`
- Live regression measurements: `withinPx: 0.94`, `containerRadius: 0px`, `orphanGone: true`

---

## 2. `<falcon-angular-menu>` + `<falcon-menu-tw>`

**Score:** 60% (Ammar, 2026-05-14) — PENDING
**Layer:** Angular wrapper + Stencil Light-DOM

### Identity
- Angular selector: `<falcon-angular-menu>`
- Wrapper class: `FalconAngularMenuComponent`
- Stencil tag: `<falcon-menu-tw>` (Light DOM)

### Role
Popup menu for row actions, dropdowns, context menus. Two modes: inline (`popup=false`) and popup (`popup=true`, default).

### Contract — Inputs
| Input | Type | Notes |
|---|---|---|
| `items` | `FalconMenuItem[]` | Menu items array — wrapper pushes to Stencil eagerly via prop setter |
| `popup` | `boolean` | Default `true` |
| `appendTo` | `'host' \| 'body'` | Default `'host'` — popup attaches to host element OR document.body |
| `anchorEl` | `HTMLElement` | **Plain class field, NOT a `@Prop()`**. Set imperatively |
| `open` | `boolean` | @Input default `false`. Controlled internally by `showAt()`, `openMenu()`, `closeMenu()` |
| `triggerLabel` | `string` | Optional label on built-in trigger button |
| `disabled` | `boolean` | Disables entire menu |

### Contract — Methods (imperative API)
- `showAt(anchor: HTMLElement, event?: Event)` — opens panel anchored at `anchor` using `position: fixed`
- `openMenu()` / `closeMenu()` / `toggle()` / `hide()` — programmatic open/close
- `falconMenuItemSelect`, `falconMenuOpen`, `falconMenuClose` — events

### Stencil rendering rule (line 440 of `falcon-menu.tsx`)
```tsx
{!hasAnchor && (<button id={triggerId} class="falcon-menu-trigger" ...>...</button>)}
```
If `anchorEl` is unset → built-in trigger button renders inline. If set → trigger is hidden (anchor mode).

### Verified working state (2026-05-14)
- When deleted from `<falcon-angular-data-table>` template, the data-table no longer leaks a 21×33 trigger button artifact. ✓
- Tree-panel kebabs (separate `<falcon-angular-menu>` instance) still render. ✓
- Direct consumers may still use the menu but should NOT pass reactive `items` prop in the same tick as calling `showAt()` (triggers syncProps reset — see bugs catalog).

### Change history
- **2026-05-14 §19 (discovered)** — empirically traced the syncProps reset bug via event capture (`menu-open → menu-close 53ms later, reason: 'programmatic'`)
- **2026-05-14 §20 (consequence)** — deleted from `<falcon-angular-data-table>` template library-wide per Ammar authorization

### Known bugs / quirks
- See [`FALCON_UI_BUGS_AND_QUIRKS.md`](FALCON_UI_BUGS_AND_QUIRKS.md):
  - BUG-2026-05-14-004 — `syncProps()` reset bug (unconditionally writes `el.open=false`, `el.anchorEl=undefined` on every `ngOnChanges`)

### Evidence
- Stencil source: `libs/falcon-ui-core/src/components/falcon-menu/falcon-menu.tsx` (line 47-58, 126-138, 397-470)
- Wrapper source: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-menu/falcon-menu.component.ts` (line 96-124 — buggy syncProps)

---

## 3. `<falcon-angular-paginator>` + `<falcon-paginator-tw>`

**Score:** 60% (Ammar, 2026-05-14) — PENDING
**Layer:** Angular wrapper + Stencil Light-DOM

### Identity
- Angular selector: `<falcon-angular-paginator>`
- Stencil tag: `<falcon-paginator-tw>`

### Role
Page navigation: first/last/prev/next buttons + page input + rows-per-page dropdown. Used inside `<app-falcon-custom-table-footer>` center section.

### Contract — Inputs
| Input | Type | Notes |
|---|---|---|
| `currentPage` | `number` | 1-indexed |
| `totalPages` | `number` | Calculated from totalRecords / rows |
| `showFirstLast`, `showPrevNext`, `showPageInfo` | `boolean` | Toggle nav elements |
| `size` | `'sm' \| 'md' \| 'lg'` | Stencil size variant |
| `disabled` | `boolean` | Disable all controls |
| `rowsPerPageOptions` | `number[]` | Required by some internal sub-components (must be set imperatively post-hydration) |

### Verified working state (2026-05-14)
- Center section of custom footer shows `« ‹ [1] of 1 › »` correctly
- Internal `[data-component="paginator-rows-per-page"]` wrapper has fixed Tailwind width that requires CSS var override

### Quirks
- `--falcon-data-table-paginator-rpp-width` and `--falcon-data-table-paginator-rpp-min-width` must be set to `auto` (or explicit) for the RPP wrapper to size to content (see §16 of session log)
- Library renderRowsPerPageDropdown doesn't include a "Rows per page" label — caller injects one (see §5)

### Change history
- **2026-05-13 Wave 17.5** — adopted wrapper inside custom footer; bypassed lib's built-in paginator (`[paginator]="false"` on data-table)
- **2026-05-14** — confirmed wrapper version (NOT raw `<falcon-paginator-tw>`) avoids `defineFalconTwComponent` bundle bloat

### Known bugs / quirks
- See `FALCON_UI_BUGS_AND_QUIRKS.md`:
  - BUG-2026-05-14-005 — RPP wrapper Tailwind fixed-width CSS-var requirement

---

## 4. `<falcon-angular-tabs>` + `<falcon-tabs-tw>`

**Score:** 60% (Ammar, 2026-05-14) — PENDING
**Layer:** Angular wrapper + Stencil Light-DOM

### Identity
- Angular selector: `<falcon-angular-tabs>`
- Stencil tag: `<falcon-tabs-tw>`

### Role
Tab strip with per-tab content panels. Supports projected per-tab action templates via `falconTabActions` directive slot.

### Contract — Inputs / Outputs
| | Type | Notes |
|---|---|---|
| `tabs` | `readonly FalconTabOption[]` | Tab definitions (value + label) |
| `selectedValue` | `string \| number \| null` | Currently active tab |
| `valueChange` (output) | `EventEmitter<...>` | Tab switch |
| `<ng-template falconTabActions="<tabValue>">` | template | Per-tab action slot (e.g. view-toggle inside Hierarchy tab) |

### Verified working state (2026-05-14)
- Hierarchy tab actions slot renders `<app-org-view-toggle>` inline with tab strip
- Other tabs render without the toggle (per-tab scoping works)
- Tab labels translate correctly on re-render via `langTick()` signal

### Change history
- **2026-05-14 §6** — confirmed `<ng-template falconTabActions="<value>">` projection contract via `FalconTabActionsDirective`
- **2026-05-14 Wave 17.1** — moved `<app-org-view-toggle>` from outside the tabs strip into the Hierarchy tab's actions slot

### Known bugs / quirks
- See `FALCON_UI_BUGS_AND_QUIRKS.md`:
  - BUG-2026-05-14-002 — Stencil prop-forwarding gap (Angular `[tabs]` binding unreliable; viewChild imperative push required)

---

## 5. `<falcon-tree-panel>`

**Score:** 60% (Ammar, 2026-05-14) — PENDING
**Layer:** Library (Angular standalone, no Stencil Light DOM wrapper needed — pure Angular)

### Identity
- Selector: `<falcon-tree-panel>`
- Lib path: `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/`

### Role
Left sidebar hierarchical tree with expand/collapse, selection, per-node kebab actions (uses its own `<falcon-angular-menu>` instance — NOT affected by our data-table edit).

### Contract — Inputs
| Input | Type | Notes |
|---|---|---|
| `mode` | `'falcon' \| 'default'` | Theme variant |
| `root` | `FalconTreeNode \| null` | Root of the tree |
| `expandedIds` | `Set<string>` | Currently expanded node IDs |
| `selectedId` | `string` | Currently selected node ID |
| `rootActions`, `nodeActions` | `FalconTreeAction[]` | Kebab menu items for root vs. internal nodes |
| `clientsLabelKey` | `string` | i18n key for "Falcon Clients" label |

### Outputs
| Output | Payload | Purpose |
|---|---|---|
| `toggle` | `{ nodeId, expanded }` | Node expand/collapse |
| `select` | `{ nodeId }` | Node selected |
| `action` | `FalconTreePanelActionEvent` | Kebab action chosen |

### Verified working state (2026-05-14)
- Tree-panel kebabs (2 instances visible elsewhere in DOM at y=109 and y=3401) confirmed unaffected by our `<falcon-angular-data-table>` library edit

### Change history
- **2026-05-13** — first integrated for Org Hierarchy
- **2026-05-14** — confirmed independence from data-table's now-deleted menu

### Known bugs / quirks
- None observed yet at the wrapper level

---

## 6. `<app-falcon-status>` (NEW — consumer-side)

**Score:** 60% (Ammar, 2026-05-14) — PENDING
**Layer:** Consumer (`apps/admin-console/.../components/falcon-status/`)

### Identity
- Selector: `<app-falcon-status>`
- Standalone, OnPush, signal-based

### Role
Renders a colored status badge ("Active", "Pending", "Suspended", "Locked", "Deleted", "Expired", "Disable", "Inactive") with fixed color mapping. Used in the Users data-table Status column via projected cell template.

### Contract
- Input: `value: string` — status text
- Internal `STATUS_MAP` (fixed): each status maps to bg/fg color tokens

### Verified working state (2026-05-14)
- Pending status renders with orange dot + label, observed in AccOwner2 row

### Change history
- **2026-05-13 Wave 17.3** — created (replaces ad-hoc switch in data-table cell template)

### Known bugs / quirks
- None

---

## 7. `<app-falcon-custom-table-footer>` (NEW — consumer-side)

**Score:** 60% (Ammar, 2026-05-14) — PENDING
**Layer:** Consumer (`apps/admin-console/.../components/falcon-custom-table-footer/`)

### Identity
- Selector: `<app-falcon-custom-table-footer>`
- Standalone, OnPush, signal-input

### Role
3-section paginator footer: `Showing X-Y from Z` | `« ‹ [page] of N › »` | `Rows per page [dropdown]`. Replaces the lib's built-in paginator (which was disabled via `[paginator]="false"` on the data-table) because we needed a specific layout and a label on the dropdown.

### Contract — Inputs
| Input | Type | Required |
|---|---|---|
| `totalRecords` | `number` | yes |
| `currentPage` | `number` (default 1) | no |
| `rows` | `number` (default 10) | no |
| `rowsPerPageOptions` | `readonly number[]` (default `[10,20,30,40]`) | no |
| `disabled` | `boolean` (default false) | no |

### Contract — Outputs
- `pageChange(number)` — emitted when user navigates pages
- `rowsChange(number)` — emitted when user picks new page size

### Verified working state (2026-05-14)
- Layout grid `grid-cols-3` displays all 3 sections aligned
- Background `bg-falcon-neutral-30` matches header
- Border-top only, zero border-radius (matches table container after radius=0 edit)
- Dropdown `rounded-sm` (8px) per Ammar's request

### Change history
- **2026-05-13 Wave 17.6** — created (replaces lib paginator)
- **2026-05-14 Wave 17.6.1** — removed `rounded-b-[12px]`
- **2026-05-14 §23** — final contract documented; `rounded-md` → `rounded-sm` on dropdown

### Known bugs / quirks
- See `FALCON_UI_BUGS_AND_QUIRKS.md`:
  - BUG-2026-05-14-006 — `defineFalconTwComponent` direct import pulls all Stencil sources (workaround: use Angular wrapper, not raw Stencil)
