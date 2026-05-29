---
type: playbook
cluster: components
layer: composition
scope: angular-first
created: 2026-05-20
updated: 2026-05-20
---
*** Falcon Component Composition Playbook ***
*** Angular-first — React/Vue are future placeholders ***
*** Read BEFORE combining two or more Falcon components ***

# Falcon Component Composition Playbook

> **Purpose:** This playbook answers "how do multiple Falcon components work *together* to form a region or flow?" — not which single component to use.
>
> **Read first:** [[Falcon Component Selection Decision Tree]] (pick the right individual component), then return here to wire them together correctly.
>
> **Guardrail:** Every composition must satisfy [[Falcon Light Mode Visual Baseline]] — no visual deviation without explicit Ammar approval.

---

## Composition Law

> [!important] Composition Law
> A composition is valid only when:
> 1. Every component in it has an existing Falcon wrapper (`falcon-angular-*`)
> 2. No bespoke layout div replaces a layout contract that a Falcon component already owns
> 3. No `z-index` value is invented — use the established ladder (see [[Falcon Current Hover Focus State Map]])
> 4. Gaps between components are discovered via [[Falcon Component Gap Registry]] before creating wrapper code

---

## 9 Composition Families

### 1 · Table + Status + Row Actions + Pagination

**Use for:** any tabular data list (Users, Applications, Services, CommChannels)

**Component stack:**
| Layer | Component | Role |
|---|---|---|
| Container | `<falcon-angular-data-table>` | Owns columns, rows, selection |
| Status cell | `<falcon-angular-status-badge>` inside `ng-template` | Visual status |
| Row action | `<falcon-angular-menu>` (kebab) | Per-row CRUD actions |
| Pagination | `<falcon-angular-paginator>` | Paging below table |
| Empty state | `<falcon-angular-empty-state>` inside `[emptyTemplate]` | No-data slot |
| Loader | `<app-falcon-loader>` or skeleton | Data-loading state |

**Wiring rules:**
- Pass `[columns]` and `[rows]` as signals / plain arrays — never mutate in template
- Status badges go inside `<ng-template #cellTemplate let-row>` — never as raw text in `value`
- Kebab menu trigger lives in a dedicated `actions` column with `[isActionColumn]="true"`
- Paginator emits `(pageChange)` → parent service re-fetches; table does NOT own pagination state
- Empty state is injected via `[emptyTemplate]` input — never rendered outside table boundaries

**Known gaps:** see [[Falcon Component Gap Registry]] → P1-10 (column-resize), P1-11 (row-drag), P0-08 (multi-sort)

**Example pages:** Organization Hierarchy Users tab, Applications tab, Services tab

---

### 2 · Tree + Details Panel + Tabs + Action Buttons

**Use for:** master-detail navigation (Organization Hierarchy left↔right split)

**Component stack:**
| Layer | Component | Role |
|---|---|---|
| Left tree | `<app-organization-hierarchy-tree>` (bespoke wrapper) | Node selection |
| Right panel shell | `div.flex.flex-col.min-h-0` | Details container |
| Details tabs | `<falcon-angular-tabs>` | Information / Users / Apps / Services / Settings |
| Tab action | `<falcon-angular-button>` (header slot) | Add-user, Add-node CTAs |
| Form inside tab | [[Falcon Form Composition Rules]] | Editable Info fields |
| Sub-table inside tab | [[Falcon Data Table Composition Rules]] | Users / Apps lists |

**Wiring rules:**
- Tree emits `(nodeSelect)` → parent stores `selectedNode` signal → right panel reads it
- Tabs use `[activeTab]` input bound to a signal; tab changes do NOT reload tree
- Action buttons live in the tab header, not in the table — placed via `[headerTemplate]` or adjacent flex row
- Drawer / wizard opens ON TOP of the whole split — it is a portal-body overlay, not inside the right panel
- `refreshPath` input on tree wrapper triggers sequential node-walk after add/edit operations

**Layout contract:**
```
host: flex h-full min-h-0 gap-0
  left: w-[320px] shrink-0 flex flex-col border-r border-falcon-neutral-200
  right: flex-1 flex flex-col min-h-0 overflow-hidden
```

---

### 3 · Form + Validation + Footer

**Use for:** editable detail panels, wizard steps, drawer body sections

**Component stack:**
| Layer | Component | Role |
|---|---|---|
| Fields | `<falcon-angular-input>`, `<falcon-angular-dropdown>`, `<falcon-angular-phone-field>` etc. | Input collection |
| Validation | Angular `ReactiveFormsModule` + `FALCON_VALIDATIONS` registry | Rule enforcement |
| Error display | `<falcon-angular-input [errorMessage]>` | Inline field errors |
| Footer | `flex justify-end gap-2 p-4 border-t border-falcon-neutral-200` | Save / Cancel |
| Save button | `<falcon-angular-button variant="primary">` | Submit CTA |
| Cancel button | `<falcon-angular-button variant="secondary">` | Dismiss / reset |

**Deep rules:** [[Falcon Form Composition Rules]]

---

### 4 · Popup + Form + Confirm

**Use for:** OTP dialogs, insufficient-balance dialogs, confirm-before-action dialogs

**Component stack:**
| Layer | Component | Role |
|---|---|---|
| Overlay | `<falcon-angular-dialog>` portaled to `<body>` | z-1200 modal shell |
| Form body | standard Angular reactive form | Input collection |
| Confirm button | `<falcon-angular-button>` | Action CTA (disabled until valid) |
| Cancel / X | `<falcon-angular-button>` | Dismiss without action |

**Wiring rules:**
- Dialog is always portaled to `<body>` (`[appendTo]="'body'"` default) — never rendered inside a table or tree subtree
- Confirm button is `[disabled]="form.invalid || loading"` — never enabled on invalid form
- A loading spinner replaces the confirm button label during the async call (use `[loading]` input if available, else swap icon)
- After success → close dialog → show toast via `FalconToastService` → trigger data refresh
- After failure → keep dialog open → show error inline (do not close)

**Deep rules:** [[Falcon Popup and Drawer Composition Rules]]

---

### 5 · Stepper + Forms + Summary Table

**Use for:** Add Client wizard, Add User wizard, multi-step flows

**Component stack:**
| Layer | Component | Role |
|---|---|---|
| Shell | `<falcon-angular-wizard>` or `<falcon-stepper>` | Step navigation |
| Per-step body | Angular reactive form (`FormGroup`) | Step data |
| Step validation | FALCON_VALIDATIONS + async validators | Gate to next step |
| Summary step | read-only data table or definition list | Review before submit |
| Navigation | Next / Back / Finish buttons | Wizard flow |
| Finalization | `<falcon-angular-wizard-finalization>` shared component | Channels + submit + success/error |

**Wiring rules:**
- Each step owns its own `FormGroup`; the wizard aggregates into a parent `FormArray` or DTO builder
- "Next" button is disabled until the current step's form is valid (including async validators)
- Do NOT navigate to step N+1 programmatically without user action — let wizard component own step state
- The finalization component handles: OTP channel popup → POST → success dialog / 5 s error toast
- Back navigation preserves form values — never reset unless step explicitly clears on back

**Deep rules:** [[Falcon Form Composition Rules]] (per step), [[Falcon Popup and Drawer Composition Rules]] (finalization overlay)

---

### 6 · Filter Panel + Search + Dropdowns

**Use for:** table filter bars, advanced search panels

**Component stack:**
| Layer | Component | Role |
|---|---|---|
| Container | `flex flex-wrap gap-2 items-end` row | Filter row |
| Search | `<falcon-angular-search-input>` | Free-text filter |
| Category filter | `<falcon-angular-dropdown>` | Enum / FK filter |
| Date range | `<falcon-angular-date-picker>` | Date-bounded filter |
| Apply button | `<falcon-angular-button>` | Explicit apply (if not live) |
| Clear button | `<falcon-angular-button variant="ghost">` | Reset all filters |

**Wiring rules:**
- Each filter control emits value changes → parent builds a filter DTO → triggers table reload
- Live filtering (no Apply button) is preferred for ≤ 3 filters; explicit Apply for complex panels
- Dropdowns in filter rows are NEVER inside a data-table column header — they live above the table in a dedicated filter row
- Search input debounce is 300 ms minimum to avoid excess API calls
- Clear resets the reactive form group powering the filters — does not manually null each control

---

### 7 · Card Grid + Status Tags + Action Menu

**Use for:** dashboard tiles, marketplace listings, service cards

**Component stack:**
| Layer | Component | Role |
|---|---|---|
| Grid | CSS Grid / `grid grid-cols-{n} gap-4` | Layout shell |
| Card | `<falcon-angular-card>` | Item container |
| Status | `<falcon-angular-status-badge>` | Card state chip |
| Tag | `<falcon-angular-tag>` | Category / metadata labels |
| Action | `<falcon-angular-menu>` (kebab inside card) | Per-card actions |

**Wiring rules:**
- Card grid is NOT a data-table — do not use `<falcon-angular-data-table>` for card layouts
- Status badge and tags are visual-only — they do not own filter state
- Kebab menu inside a card uses the same menu component as table row actions — same slot pattern
- Card hover style: `hover:shadow-md cursor-pointer` — do not invent custom hover CSS

---

### 8 · Loading + Empty + Error States (cross-composition)

**Every composition must handle three non-data states:**

| State | Component | When |
|---|---|---|
| Loading | `<app-falcon-loader>` (centered, z-2000) or skeleton | API in-flight |
| Empty | `<falcon-angular-empty-state>` with icon + message | Zero results |
| Error | Inline error banner or toast via `FalconToastService` | API failure |

**Rules:**
- Loader overlays the entire region — not just the table or form
- Empty state is component-provided (table `[emptyTemplate]`, tree `[emptyTemplate]`) — never a sibling `*ngIf` div
- Error toast fires via `FalconToastService.error()` — no raw `alert()` or custom red banners
- After error → keep existing data visible (do not blank the UI) — show the toast above

---

### 9 · Tab Bar + Action Buttons + Inline Section

**Use for:** detail panel tabs with per-tab CTAs (e.g., Information, Users, Apps tabs in Org Hierarchy)

**Component stack:**
| Layer | Component | Role |
|---|---|---|
| Tab bar | `<falcon-angular-tabs>` | Section switcher |
| Header CTA | `<falcon-angular-button>` adjacent to tab bar | Add / Export |
| Tab body | per-tab angular component | Section content |
| Inline form | [[Falcon Form Composition Rules]] | Edit mode |
| Inline table | [[Falcon Data Table Composition Rules]] | List mode |

**Wiring rules:**
- Tabs do NOT reload data on every switch — cache tab data in parent component signals
- Tab-active-index is a signal — changes trigger `(tabChange)` output, not route navigation
- Action buttons outside the tab bar are positioned in a flex row: `flex items-center justify-between` above the tabs
- Drawer / wizard triggered from a tab action IS NOT rendered inside the tab — it portals to body

---

## Composition Anti-Patterns (never do these)

| Anti-Pattern | Why | Correct Approach |
|---|---|---|
| Nesting a `<falcon-angular-data-table>` inside a `<falcon-angular-dialog>` body | Overflow + z-index collisions | Use a plain `<table>` or a simplified list in dialog body |
| Using raw `<select>` inside a composition | Breaks visual consistency | Use `<falcon-angular-dropdown>` |
| Inventing a custom status chip | Diverges from status-badge token system | Use `<falcon-angular-status-badge>` |
| Placing paginator inside the table `[footerTemplate]` | Paginator is a sibling, not a child | Place `<falcon-angular-paginator>` below the table in parent template |
| Custom modal with `position:fixed` outside Falcon dialog | Bypasses z-index ladder and portal contract | Use `<falcon-angular-dialog [appendTo]="'body'">` |
| Using `setTimeout` to defer re-renders | Race condition; breaks zoneless | Use `afterNextRender` or `effect()` |
| Tree selection state stored in local variable | Lost on view re-creation | Store in a service signal |

---

## Cross-Links

- [[Falcon Component Selection Decision Tree]] — pick components first
- [[Falcon Component Recognition Playbook]] — recognize pattern from UI
- [[Falcon Page Assembly Playbook]] — assemble regions into a full page
- [[Falcon Component Gap Registry]] — check before any bespoke code
- [[Falcon Data Table Composition Rules]] — deep rules for table compositions
- [[Falcon Form Composition Rules]] — deep rules for form compositions
- [[Falcon Popup and Drawer Composition Rules]] — deep rules for overlay compositions
- [[Falcon Tree and Details Composition Rules]] — deep rules for tree-detail split
- [[Falcon New Page Implementation Checklist]] — pre-merge gate
- [[Falcon Light Mode Visual Baseline]] — visual guardrail

## Tags

#type/playbook #layer/frontend #layer/composition #status/active #scope/angular-first

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[Falcon Component Recognition Playbook]] · [[Falcon Page Assembly Playbook]]
