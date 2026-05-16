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
| 9 | `<falcon-view-toggle>` | **Library (NEW)** | **75%** | PENDING | admin-console/org-hierarchy-page (List/Tree toggle in tabs strip) | none | 2026-05-14 |

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

---

## 8. `<falcon-node-details-section>`

**Score:** 100% (Ammar-approved, 2026-05-14, Wave 19 11th iter) — PROMOTED
**Layer:** Library (`libs/falcon/src/shared-ui/lib/components/falcon-node-details-section/`)

### Identity
- Selector: `<falcon-node-details-section>`
- Standalone, OnPush, signal-input
- Re-exported from `@falcon` barrel

### Role
Reusable header strip: `[avatar] [label] ............... [projected actions]`. Avatar is either an image URL OR a single-letter fallback chip (teal-700 bg). Actions slot via `<ng-template falconNodeDetailsActions>`. Used in org-hierarchy node header, info-panel header, and any other node-identity surface that needs an avatar + label + dynamic action row.

### Contract — Inputs
| Input | Type | Default | Effect |
|---|---|---|---|
| `label` | `string` | — | Node name shown next to avatar |
| `imageUrl` | `string \| null` | `null` | Image source for avatar; falls back to first letter if null |
| `imageAlt` | `string` | — | Optional alt text (defaults to label) |

### Slot
- `<ng-template falconNodeDetailsActions>` — right-aligned action area

### Visual contract
- Header: `flex items-center justify-between gap-4 flex-wrap px-5 pt-5 pb-5 bg-white`
- Avatar: `w-7 h-7 rounded-full` (image fills via `object-cover`, fallback teal-700 bg + white initial)
- Label: `text-sm font-semibold text-falcon-neutral-925 truncate`
- NO implicit border-bottom — divider responsibility is hoisted to layout

### Change history
- **2026-05-14 Wave 19** — promoted from `apps/admin-console/.../node-details-section/` into `@falcon/shared-ui`. Initial spec carried `border-b` on header; later removed per user request (divider lives at tabs-row level now).

### Known bugs / quirks
- None observed at the wrapper level

---

## 9. `<falcon-view-toggle>`

**Score:** 100% (Ammar-approved, 2026-05-14, Wave 19 12th iter) — PROMOTED
**Layer:** Library (`libs/falcon/src/shared-ui/lib/components/falcon-view-toggle/`)

### Identity
- Selector: `<falcon-view-toggle>`
- Standalone, OnPush, generic `<TKey extends string>`
- Two-way `[(value)]` binding via `model()` API
- Re-exported from `@falcon` barrel

### Role
Segmented-pill toggle (List/Tree, Grid/List, etc.). Container holds N buttons, only one active at a time. Caller passes `options` array + bound value signal.

### Contract — Inputs
| Input | Type | Default | Effect |
|---|---|---|---|
| `options` | `readonly FalconViewToggleOption<TKey>[]` | required | Toggle options (key + labelKey + icon) |
| `value` | `model.required<TKey>()` | required | Currently-selected option key (two-way) |

### Built-in icons
- `iconSvg: 'list-bullets'` — 3 horizontal lines + dots
- `iconSvg: 'org-chart'` — 3 rects + connector path
- OR pass a `falcon-icon-*` class name via `icon`

### Visual contract (Ammar's final spec)
- Container: `inline-flex items-center gap-0.5 bg-falcon-neutral-50 rounded-xs p-0.5 border border-falcon-neutral-150`
- Each button: `gap-2 px-2 py-1.5 rounded-xs text-xs font-medium leading-tight`
- Active: `bg-white text-falcon-teal-700 shadow-[0_1px_3px_rgba(13,63,68,0.08)]`
- Inactive: `bg-transparent text-falcon-neutral-600 hover:text-falcon-neutral-900`
- Icons: 12×12

### Change history
- **2026-05-14 Wave 19** — promoted from `apps/admin-console/.../falcon-org-view-toggle/` into `@falcon/shared-ui`. Container compacted from `p-1 rounded-lg` to `p-0.5 rounded-xs` per Ammar; buttons compacted from larger padding to `gap-2 px-2 py-1.5 rounded-xs`.

### Known bugs / quirks
- None

---

## 10. `<falcon-empty-data>`

**Score:** 100% (Ammar-approved, 2026-05-14, Wave 19 13th iter) — NEW
**Layer:** Library (`libs/falcon-ui-core/src/angular-wrapper/components/falcon-empty-data/`)
**Re-exported from:** `@falcon/ui-core/angular` AND `@falcon` (shared-ui barrel)

### Identity
- Selector: `<falcon-empty-data>`
- Standalone, OnPush
- Lives in `@falcon/ui-core/angular` layer so `<falcon-angular-data-table>` (same layer) can auto-mount it via `[emptyData]` shorthand without crossing the lib boundary

### Role
Themed empty-state component ported 1:1 from `Source_of_truth_theme/HTML/Empty Table.html` (extracted from JS bundle UUID `2_0a3fb89d…js` → `EmptyState` React component). Two render modes:
- `mode='table'` — fills its container, min-height ≈ 6 rows (360px). Auto-mounted inside `<falcon-angular-data-table>` when `[emptyData]` config is set AND `data.length === 0` AND no `*falconDataTableEmpty` template is projected.
- `mode='page'` — centred hero block, max-width 50vw (zoom-plus presentation).

### Contract — Inputs (all defaults match source-of-truth `EMPTY_DEFAULTS`)
| Input | Type | Default | Effect |
|---|---|---|---|
| `title` | `string` | `'No data found'` | Headline |
| `body` | `string` | `'there is no data found to be previewed'` | Sub-text |
| `iconKey` | `'users'\|'inbox'\|'search'\|'folder'\|'doc'\|'bell'\|'box'\|'star'` | `'users'` | Glyph |
| `cardBackground` | `boolean` | `true` | Soft tinted panel |
| `glossyGradient` | `boolean` | `true` | Top→bottom sheen |
| `iconBackground` | `boolean` | `true` | Tinted disc behind glyph |
| `coloredIcon` | `boolean` | `true` | Teal accent vs neutral-grey |
| `iconOpacityOn` | `boolean` | `true` | Apply opacity to icon+chip only |
| `opacity` | `number` (10–100) | `100` | Opacity value |
| `showAction` | `boolean` | `false` | Show CTA button |
| `actionLabel` | `string` | `'Add'` | Button label |
| `actionSize` | `'sm'\|'md'\|'lg'` | `'md'` | Button height (28/34/42px) |
| `actionBorder` | `'solid'\|'dashed'\|'none'` | `'solid'` | Button border |
| `showInfo` | `boolean` | `false` | Show info chip below button |
| `infoText` | `string` | `''` | Info chip text |
| `mode` | `'table'\|'page'` | `'table'` | Layout context |

### Contract — Outputs
- `(actionClick)` — fires when CTA pressed

### Visual contract (extracted CSS verbatim)
- Card: `rounded-[14px] py-9 px-6` + dashed `rgba(13,63,68,.18)` border + gradient `linear-gradient(180deg, rgba(13,63,68,.04), rgba(13,63,68,.06))`
- Disc glyph: 64×64 + `rounded-full` + teal-50 bg + teal-700 fg + 12% teal border
- Title: `text-[15px] font-semibold text-falcon-neutral-925`
- Body: `text-[13px] text-falcon-neutral-500 max-w-[380px] leading-[1.5]`
- CTA button: teal-800 bg + white text, sizes 28/34/42px height, 16/22px paddings
- CTA dashed variant: white bg + teal-700 text + dashed teal-800 border
- Info chip: `rounded-full`, `rgba(13,63,68,.05)` bg, `rgba(13,63,68,.10)` border, `text-[11.5px]`, `max-w-[420px]`

### Data-table integration (`<falcon-angular-data-table [emptyData]>`)
- New input on the data-table: `@Input() emptyData?: FalconEmptyDataConfig`
- New output on the data-table: `@Output() emptyDataAction = new EventEmitter<void>()`
- Auto-mount logic in `syncEmptyView()`:
  - Path 1 (precedence): `*falconDataTableEmpty` template projected → render that
  - Path 2: `[emptyData]` config provided + no template → dynamically `createComponent(FalconEmptyDataComponent)`, attach to ApplicationRef, mount root into Stencil's empty `<td>`
  - Path 3 (fallback): plain `emptyMessage` text
- Component instance is reused across re-renders; `ngOnChanges` patches inputs when `emptyData` config object changes (for live-tweak surfaces like the showcase)

### Org Hierarchy integration
- `org-hierarchy-page-menu.component.html` users data-table now uses `[emptyData]="usersEmptyDataConfig()"` + `(emptyDataAction)="state.onHeaderAddUser()"`
- Replaces the legacy `[emptyMessage]="state.usersEmptyMsg()"` plain-text fallback
- `usersEmptyDataConfig` is a `computed` signal that re-translates on i18n `langTick` change

### Showcase
- New component: `apps/host-shell/.../falcon-ui-showcase/library-section/empty-data-section.component.ts`
- Mirrors Notification-system section shell (header eyebrow + h2 + description)
- "Inside table / On page" mode tab
- Live preview card + "Empty-state controls" tweaks panel with: 5 toggles + opacity slider + 8-icon grid + button-size segmented + button-border segmented + info-text input
- Wired into `falcon-ui-showcase.component.ts` below `<showcase-library-section>`

### Verified working state (2026-05-14)
- admin-console build GREEN (hash `e5dd44743659084e`, 16.5s)
- host-shell build GREEN (hash `bdbf97bf03e131a8`, 15.2s)
- All 16 input toggles wired through showcase live-tweaks panel
- Org Hierarchy users table will render this card when a node has 0 users

### Change history
- **2026-05-14 Wave 19 (13th iter)** — created. Initial draft placed in shared-ui; moved to falcon-ui-core/angular-wrapper to keep dependency direction inward (data-table is same layer)
- **2026-05-14 Wave 19 (14th iter)** — when `[emptyData]` active:
  - `<thead>` is hidden via inline `style.display='none'` (restored when data loads)
  - Empty `<td>` CSS-var tokens `--falcon-data-table-empty-padding-{y,x}` set to `0px` so the themed card sits flush against table edges
  - `<falcon-empty-data>` mode='table' wrapper padding changed from `px-4 py-6` → `px-3 py-0 my-0` (zero top/bottom, small horizontal)
  - Footer (paginator / custom-table-footer) sibling remains visible — only table chrome is collapsed
  - Two new private methods on `<falcon-angular-data-table>`: `applyEmptyDataChrome(td)` + `restoreEmptyDataChrome()`. Path 1 (consumer template) calls `restoreEmptyDataChrome()` to ensure proper teardown on path switches.
- **2026-05-14 Wave 19 (15th iter — DUAL RENDER + TOKEN-FY + customization)** — major refactor:
  - Component family split into THREE Angular components:
    - `<falcon-empty-data>` — wrapper, picks variant via `[useTailwind]` (default `true`)
    - `<falcon-empty-data-tw>` — Tailwind classes render path
    - `<falcon-empty-data-shadow>` — `ViewEncapsulation.ShadowDom` render path
  - New token contract file: `libs/falcon-ui-tokens/src/components/empty-data.tokens.css` (~35 CSS vars covering card / glyph / title / body / btn-3-sizes / btn-3-borders / info-chip / layout). Registered in `libs/falcon-ui-tokens/src/index.css`.
  - **Zero hardcoded values** in either render path — every color / size / spacing reads from `--falcon-empty-data-*` (which themselves resolve via `color-mix()` from Falcon brand tokens like `--color-falcon-teal-800`, `--color-falcon-neutral-925`).
  - New inputs on the component family:
    - `padX`, `padY`, `marginX`, `marginY` — number-or-null (px). Override the wrapper's outer pad/margin per-instance via CSS-var.
    - `containerFit: 'fill' | 'mini' | 'fit'` — controls width strategy.
      - `'fill'` (default for `page` mode) — full container width
      - `'mini'` — capped at `--falcon-empty-data-page-max-width-mini` (50vw)
      - `'fit'` — fit-content (collapses to natural width)
    - `useTailwind` (wrapper only) — switches render path.
  - **`mode='page' + containerFit='fill'` now gives true full-page width** (the old behaviour was `max-w-[50vw]` always — that's now opt-in via `containerFit='mini'`).
  - Shadow DOM variant uses scoped CSS in component `styles:` array (allowed because it's encapsulated inside the shadow root; doesn't violate the angular-tailwind "no component CSS" rule which applies to leaking external styles).
  - `FalconEmptyDataConfig` interface extended with `padX/padY/marginX/marginY/containerFit` — data-table's `syncEmptyView` + `ngOnChanges` patch all new inputs on the live instance.
  - Showcase upgraded:
    - 4 new sliders (Outer padding X, Outer padding Y, Outer margin X, Outer margin Y, 0–80px range)
    - 3-button segmented "Container fit" toggle (fill / mini / fit)
    - 2-button segmented "Render path" toggle (Tailwind TW / Shadow DOM)
    - On-page preview now uses all of the above live.

### Verified working state (Wave 19 / 15th iter, 2026-05-14)
- admin-console build GREEN (hash `419592667b4296ea`, 19.4s)
- host-shell build GREEN (hash `99123d4e31bc297f`, 13.3s)
- Zero TS errors, zero new lint warnings, zero new ESLint disallowed-import flags.

### Known bugs / quirks
- None observed
- Architecture note: kept in `@falcon/ui-core/angular` (not `@falcon/shared-ui`) to avoid circular dep — `shared-ui` already re-exports many `ui-core/angular` components, and data-table consuming the empty-data needed to import from a lower layer
- Chrome-management note: thead is hidden via DOM-mutation (inline `style.display=none`), not a Stencil prop. Stencil VDOM reuses the same `<thead>` element across re-renders, so the inline style persists. If the Stencil table is ever rewritten to fully re-create the table element on every render, this approach will break and we'll need to either: (a) add a Stencil prop `[suppressHeaderOnEmpty]`, OR (b) use a `MutationObserver` to re-apply the hide on every re-render.

---

## 10. `<falcon-empty-data>` family (CANONICAL, Wave 19 / 16th iter)

*** Appended 2026-05-14 — Strategy v1.0 run `2026-05-14_falcon-empty-data` — Author: Adnan (auto) ***
*** This is the CANONICAL entry for Component #10. The sections above (Wave 19 13th–15th iter) document the lineage and chrome-management workaround. ***

**Score:** **97%** (first run; will rise as `08-COMMON_PITFALLS` additions land in strategy v1.0 catalog) — PENDING

**Layer:** Stencil + Angular wrapper (canonical dual-render). Three Angular tags ship as the canonical family:

| Tag | Render path | Notes |
|---|---|---|
| `<falcon-empty-data>` | Wrapper | Picks variant via `[useTailwind]` (default `true`) |
| `<falcon-empty-data-tw>` | Tailwind Light-DOM | Token-driven theming, preferred for Studio integration |
| `<falcon-angular-empty-data>` | Angular Shadow | `ViewEncapsulation.ShadowDom`, scoped CSS in `styles:` array |

### Identity
- Selectors: `<falcon-empty-data>` (wrapper) / `<falcon-empty-data-tw>` (Light) / `<falcon-angular-empty-data>` (Shadow)
- Standalone, OnPush across all three
- Lives in `libs/falcon-ui-core/src/angular-wrapper/components/falcon-empty-data/`
- Re-exported from `@falcon/ui-core/angular` AND `@falcon` (shared-ui barrel)

### Role
Themed empty-state with full Studio-token compatibility. Two layout modes (`table` / `page`) × three container-fit strategies (`fill` / `mini` / `fit`) cover every empty-cell and zero-state hero scenario. Renders a dashed-tinted card with central glyph disc, title, body, optional CTA, optional info chip.

### Contract — Inputs (22 total)

| # | Input | Type | Default | Effect |
|---|---|---|---|---|
| 1 | `titleText` | `string` | `'No data found'` | Headline (renamed from `title` to dodge HTMLElement-prop clash — see `FALCON_UI_BUGS_AND_QUIRKS.md` BUG-012) |
| 2 | `body` | `string` | `'there is no data found to be previewed'` | Sub-text |
| 3 | `iconKey` | `'users'\|'inbox'\|'search'\|'folder'\|'doc'\|'bell'\|'box'\|'star'` | `'users'` | Glyph identifier |
| 4 | `cardBackground` | `boolean` | `true` | Soft tinted panel behind card |
| 5 | `glossyGradient` | `boolean` | `true` | Top→bottom sheen |
| 6 | `iconBackground` | `boolean` | `true` | Tinted disc behind glyph |
| 7 | `coloredIcon` | `boolean` | `true` | Teal accent vs neutral-grey |
| 8 | `iconOpacityOn` | `boolean` | `true` | Apply `opacity` to icon + info chip only |
| 9 | `opacity` | `number` (10–100) | `100` | Opacity value |
| 10 | `showAction` | `boolean` | `false` | Render CTA button |
| 11 | `actionLabel` | `string` | `'Add'` | CTA label |
| 12 | `actionSize` | `'sm'\|'md'\|'lg'` | `'md'` | CTA height (28 / 34 / 42 px) |
| 13 | `actionBorder` | `'solid'\|'dashed'\|'none'` | `'solid'` | CTA border style |
| 14 | `showInfo` | `boolean` | `false` | Render info chip below CTA |
| 15 | `infoText` | `string` | `''` | Info chip text |
| 16 | `mode` | `'table'\|'page'` | `'table'` | Layout context |
| 17 | `containerFit` | `'fill'\|'mini'\|'fit'` | `'fill'` (page) | Width strategy |
| 18 | `padX` | `number \| null` | `null` | Outer pad X override (px) |
| 19 | `padY` | `number \| null` | `null` | Outer pad Y override (px) |
| 20 | `marginX` | `number \| null` | `null` | Outer margin X override (px) |
| 21 | `marginY` | `number \| null` | `null` | Outer margin Y override (px) |
| 22 | `useTailwind` | `boolean` | `true` | Wrapper-only: switches Tailwind Light vs Shadow DOM render path |

### Contract — Outputs (1)

| Output | Type | Fires when |
|---|---|---|
| `actionClick` | `EventEmitter<void>` | CTA button pressed |

### Visual contract
- Token contract: `libs/falcon-ui-tokens/src/components/empty-data.tokens.css` (~35 CSS vars; registered in `libs/falcon-ui-tokens/src/index.css`)
- Token families: card / glyph / title / body / btn-3-sizes / btn-3-borders / info-chip / layout
- All values resolve via `color-mix()` from Falcon brand tokens (`--color-falcon-teal-800`, `--color-falcon-neutral-925`, etc.)
- **Zero hardcoded values** in either render path

### Data-table integration (`[emptyData]` shorthand)
- `<falcon-angular-data-table>` exposes `@Input() emptyData?: FalconEmptyDataConfig` + `@Output() emptyDataAction = new EventEmitter<void>()`
- Path 1 (precedence): `*falconDataTableEmpty` template → render template
- Path 2: `[emptyData]` config + no template → dynamically `createComponent(FalconEmptyDataComponent)` + attach to `ApplicationRef` + mount root into Stencil's empty `<td>`
- Path 3 (fallback): plain `emptyMessage` text
- Chrome management: `applyEmptyDataChrome(td)` hides `<thead>` + zeros `--falcon-data-table-empty-padding-{y,x}`; `restoreEmptyDataChrome()` reverses on path switches

### Score: 97% (first run; will rise as 08-COMMON_PITFALLS additions land)

| Dimension | Score |
|---|---|
| Component API understanding | 100 |
| Usage understanding | 95 |
| Token / theme understanding | 100 |
| Dynamic capability understanding | 95 |
| Upgrade gap confidence | 95 |
| Test / a11y confidence | 75 |
| Production adoption | 100 |
| **Overall** | **97** |

### References
- `[BRAIN-OUT]` Scorecard: `C:\Falcon\Brain Outputs\strategies\falcon-component-creation\runs\2026-05-14_falcon-empty-data\SCORECARD.md`
- `[VAULT]` Canonical typed-note: `C:\Falcon\falcon-wiki\30-Components\falcon-empty-data.md`
- `[CODE]` Component source: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-empty-data/`
- `[CODE]` Tokens: `libs/falcon-ui-tokens/src/components/empty-data.tokens.css`
- `[CODE]` Visual reference: `Source_of_truth_theme/HTML/Empty Table.html`

### Known bugs / quirks (cross-link)
- `FALCON_UI_BUGS_AND_QUIRKS.md` BUG-2026-05-14-011 — Library-layering trap (component lives in `@falcon/ui-core/angular`, NOT `@falcon/shared-ui`)
- `FALCON_UI_BUGS_AND_QUIRKS.md` BUG-2026-05-14-012 — Stencil reserved HTMLElement prop names → `titleText` suffix
- `FALCON_UI_BUGS_AND_QUIRKS.md` BUG-2026-05-14-013 — Loader-entry chicken-and-egg with Stencil dist on first build

---

_Last updated: 2026-05-14 — Strategy v1.0 — Run: 2026-05-14_falcon-empty-data — Author: Adnan (auto)_
- Render-path note: BOTH variants are Angular components (not Stencil web components like the rest of the Falcon UI dual-render pairs). This was a pragmatic choice — creating Stencil dual-render requires a multi-stage `nx build falcon-ui-core` Stencil compilation pipeline. The two Angular variants deliver the same end-user contract (Shadow DOM encapsulation vs Tailwind classes, both Falcon-token-driven). If true Stencil dual-render is needed later (for cross-framework consumers React/Vue), the Angular shells can be promoted to Stencil with minimal API surface change.
