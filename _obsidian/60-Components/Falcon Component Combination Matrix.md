---
type: matrix
cluster: components
layer: composition
scope: angular-first
created: 2026-05-20
updated: 2026-05-20
---
*** Falcon Component Combination Matrix ***
*** Angular-first — React/Vue are future placeholders ***
*** 7 canonical UI compositions — components + wiring + gaps ***

# Falcon Component Combination Matrix

> **Purpose:** Quick-pick matrix for the 7 most common Falcon UI compositions. Answers: what components, when to use them, how to wire them (required inputs/outputs/slots), what states to handle, and what known gaps exist.
>
> **Read first:** [[Falcon Component Selection Decision Tree]] (individual component), then [[Falcon Component Composition Playbook]] (wiring detail), then use this matrix as a fast lookup.
>
> **Guardrail:** [[Falcon Light Mode Visual Baseline]] — every composition must preserve the current visual identity.

---

## Matrix

### C01 · Table + Status + Row Actions + Pagination

| Dimension | Detail |
|---|---|
| **UI Composition** | Data list with typed status chips, per-row kebab actions, and paged navigation |
| **Components Used** | `<falcon-angular-data-table>` · `<falcon-angular-status-badge>` · `<falcon-angular-menu>` · `<falcon-angular-paginator>` · `<falcon-angular-empty-state>` · `<app-falcon-loader>` |
| **When To Use** | Any tabular list page: Users, Applications, Services, CommChannels, Clients |
| **Required Slots / Templates** | `[columns]` with `cellTemplate` per custom column · `[emptyTemplate]` for empty state · `[footerTemplate]` (optional) |
| **Required States** | Loading (in-flight) · Empty (no results) · Error (fetch failed, show toast) · Row-selected · Row-action-in-progress (disable other rows) |
| **Known Gaps** | P0-08 multi-sort · P1-10 column resize · P1-11 row drag · P1-03 virtual scroll (large datasets) |
| **Example Pages** | Org Hierarchy → Users tab · Applications tab · Services tab |

**Minimal wiring template:**
```html
<div class="flex flex-col min-h-0 h-full gap-4">
  <falcon-angular-data-table
    [columns]="columns"
    [rows]="rows()"
    [loading]="isLoading()"
    [emptyTemplate]="emptyTpl"
    (rowAction)="onRowAction($event)">
    <ng-template #statusCell let-row>
      <falcon-angular-status-badge [status]="row.status" />
    </ng-template>
    <ng-template #actionsCell let-row>
      <falcon-angular-menu [items]="menuItems(row)" (itemClick)="onMenu($event, row)" />
    </ng-template>
  </falcon-angular-data-table>
  <falcon-angular-paginator
    [total]="total()"
    [page]="page()"
    [pageSize]="pageSize()"
    (pageChange)="onPageChange($event)" />
</div>
<ng-template #emptyTpl>
  <falcon-angular-empty-state icon="users" message="No users found" />
</ng-template>
```

---

### C02 · Tree + Details + Tabs + Action Buttons

| Dimension | Detail |
|---|---|
| **UI Composition** | Left tree navigation with right-panel detail view containing tabs and per-tab CTAs |
| **Components Used** | `<app-organization-hierarchy-tree>` · `<falcon-angular-tabs>` · `<falcon-angular-button>` · per-tab content components |
| **When To Use** | Any hierarchical master-detail view — Organization Hierarchy, service trees, account structures |
| **Required Slots / Templates** | `[tabs]` array · `[(activeTab)]` two-way binding · header CTA buttons as tab siblings |
| **Required States** | No node selected (empty right panel with placeholder) · Node loading · Node loaded · Edit mode (form) · Unsaved changes guard |
| **Known Gaps** | P0-05 tree virtual scroll (large hierarchy) · P1-07 tree search/filter · P1-12 tree drag-reorder |
| **Example Pages** | Admin Console → Organization Hierarchy page |

**Layout contract:**
```html
<div class="flex h-full min-h-0">
  <!-- Left tree -->
  <div class="w-[320px] shrink-0 flex flex-col border-r border-falcon-neutral-200">
    <app-organization-hierarchy-tree
      [selectedNode]="selectedNode()"
      (nodeSelect)="onNodeSelect($event)" />
  </div>
  <!-- Right detail -->
  <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
    @if (selectedNode()) {
      <div class="flex items-center justify-between px-4 pt-3 pb-0">
        <h2 class="text-sm font-semibold">{{ selectedNode()!.name }}</h2>
        <falcon-angular-button size="sm" (click)="openAddUser()">Add User</falcon-angular-button>
      </div>
      <falcon-angular-tabs [tabs]="tabs" [(activeTab)]="activeTab" />
    } @else {
      <falcon-angular-empty-state icon="click" message="Select a node to view details" />
    }
  </div>
</div>
```

---

### C03 · Form + Validation + Footer

| Dimension | Detail |
|---|---|
| **UI Composition** | Editable form section with labeled inputs, inline validation errors, and Save/Cancel footer |
| **Components Used** | `<falcon-angular-input>` · `<falcon-angular-dropdown>` · `<falcon-angular-phone-field>` · `<falcon-angular-date-picker>` · `<falcon-angular-checkbox>` · `<falcon-angular-button>` |
| **When To Use** | Detail panel edit mode · Wizard steps · Drawer body · Settings form |
| **Required Slots / Templates** | `[label]` input · `[errorMessage]` input · `formControlName` bindings; parent provides `FormGroup` |
| **Required States** | Pristine · Invalid (per-field errors) · Valid · Submitting (footer buttons disabled + loader) · Success (toast + reset or navigate) · Error (keep form, show toast) |
| **Known Gaps** | P1-04 CVA missing on Calendar/DatePicker/SearchInput/GridInput · P1-08 async field-level validation indicator (only on accountName/username today) |
| **Example Pages** | Org Hierarchy → Information tab edit mode · Add Client Step 1 · Add User Step 1 |

**Canonical footer:**
```html
<div class="flex items-center justify-end gap-2 p-4 border-t border-falcon-neutral-200 flex-shrink-0">
  <falcon-angular-button variant="secondary" (click)="onCancel()">Cancel</falcon-angular-button>
  <falcon-angular-button variant="primary"
    [disabled]="form.invalid || isSaving()"
    [loading]="isSaving()"
    (click)="onSave()">Save</falcon-angular-button>
</div>
```

---

### C04 · Popup + Form + Confirm

| Dimension | Detail |
|---|---|
| **UI Composition** | Modal dialog containing a form; confirm CTA gated on form validity |
| **Components Used** | `<falcon-angular-dialog>` · `<falcon-angular-input>` (or specialized form controls) · `<falcon-angular-button>` |
| **When To Use** | OTP dialogs · insufficient-balance dialogs · single-field quick-edit popups · confirm-before-delete |
| **Required Slots / Templates** | `[title]` · `[body]` (projected form content) · `[footer]` (confirm + cancel buttons) |
| **Required States** | Idle (form empty) · Form invalid (confirm disabled) · Form valid (confirm enabled) · Submitting (confirm loading) · Success (close + toast) · Error (keep open + inline error OR toast) |
| **Known Gaps** | P0-06 focus-trap not always honored on complex nested dialogs · P1-09 accessible close via Escape in all dialog variants |
| **Example Pages** | OTP Send Dialog · Insufficient Balance Dialog · Edit-price confirm popup |

**Portal rule:**
```html
<!-- ALWAYS appendTo body — prevents z-index bleed-through -->
<falcon-angular-dialog
  [appendTo]="'body'"
  [visible]="isOpen()"
  [title]="'Confirm Action'"
  (close)="onClose()">
  <!-- form content projected here -->
  <ng-template #footer>
    <falcon-angular-button variant="secondary" (click)="onCancel()">Cancel</falcon-angular-button>
    <falcon-angular-button variant="primary"
      [disabled]="form.invalid || isSending()"
      (click)="onConfirm()">Confirm</falcon-angular-button>
  </ng-template>
</falcon-angular-dialog>
```

---

### C05 · Stepper + Forms + Summary Table

| Dimension | Detail |
|---|---|
| **UI Composition** | Multi-step wizard with per-step forms and a final summary/review step |
| **Components Used** | `<falcon-angular-wizard>` or `<falcon-stepper>` · per-step `FormGroup` · `<falcon-angular-data-table>` (summary) · `<falcon-angular-wizard-finalization>` |
| **When To Use** | Add Client (5 steps) · Add User (3 tabs) · any multi-step creation flow |
| **Required Slots / Templates** | Per-step form component · `[submitFn]` async function · finalization channel-picker slot |
| **Required States** | Step valid / invalid (gate Next) · Step in-progress (async validation spinner) · Submitting (Finish button loading) · Success (success dialog) · Error (5 s toast, wizard stays open) |
| **Known Gaps** | P0-09 wizard step persistence on browser back · P1-13 drag-to-reorder wizard steps |
| **Example Pages** | Add Client wizard · Add User wizard |

**Step navigation contract:**
```typescript
// Each step exposes: isValid(): boolean, getStepData(): StepDTO
// Wizard aggregates: steps.map(s => s.getStepData())
// Next disabled: !currentStep().isValid()
// Finish calls: wizardFinalization.submit(aggregatedDTO)
```

---

### C06 · Filter Panel + Search + Dropdowns

| Dimension | Detail |
|---|---|
| **UI Composition** | Horizontal filter bar above a data table: free-text search + category dropdowns + date range |
| **Components Used** | `<falcon-angular-search-input>` · `<falcon-angular-dropdown>` · `<falcon-angular-date-picker>` · `<falcon-angular-button>` |
| **When To Use** | Any table with filterable data — Users list, Applications list, audit logs |
| **Required Slots / Templates** | Each filter control binds to a `FormControl` in a `filterForm: FormGroup`; form `valueChanges` drives table reload |
| **Required States** | All-clear (no filters) · Filtered (active filter indicators) · Loading (table shows loader while filter applies) · No results (table shows empty state) |
| **Known Gaps** | P1-14 active filter chips/count badge · P1-15 saved filter presets |
| **Example Pages** | _(filter bar was removed from Org Hierarchy Users in 2026-05-16 per project decision — apply to future list pages)_ |

**Filter form pattern:**
```typescript
filterForm = this.fb.group({
  search: [''],
  status: [null],
  dateFrom: [null],
  dateTo: [null],
});

// In constructor:
this.filterForm.valueChanges
  .pipe(debounceTime(300), takeUntilDestroyed())
  .subscribe(f => this.loadData(f));
```

---

### C07 · Card Grid + Status Tags + Action Menu

| Dimension | Detail |
|---|---|
| **UI Composition** | Responsive card grid with status badge and kebab action menu per card |
| **Components Used** | `<falcon-angular-card>` · `<falcon-angular-status-badge>` · `<falcon-angular-tag>` · `<falcon-angular-menu>` · `<falcon-angular-button>` |
| **When To Use** | Marketplace listings · service catalog · dashboard tiles · feature showcase |
| **Required Slots / Templates** | `[header]` slot (title + status) · `[body]` slot (description + tags) · `[footer]` slot (CTA button) |
| **Required States** | Default · Hover (shadow-md) · Selected/Active · Disabled · Loading (skeleton card) |
| **Known Gaps** | P1-16 card skeleton loader · P1-17 card selection mode (checkbox overlay) |
| **Example Pages** | Admin Console → Marketplace page (planned) · CommChannels landing |

**Grid layout:**
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  @for (item of items(); track item.id) {
    <falcon-angular-card>
      <ng-template #header>
        <div class="flex items-center justify-between">
          <span class="font-semibold">{{ item.name }}</span>
          <falcon-angular-status-badge [status]="item.status" />
        </div>
      </ng-template>
      <ng-template #body>
        <p class="text-sm text-falcon-neutral-500">{{ item.description }}</p>
        <div class="flex gap-1 mt-2">
          @for (tag of item.tags; track tag) {
            <falcon-angular-tag [label]="tag" />
          }
        </div>
      </ng-template>
      <ng-template #footer>
        <falcon-angular-button size="sm" variant="secondary" (click)="onView(item)">View</falcon-angular-button>
        <falcon-angular-menu [items]="cardMenu(item)" (itemClick)="onCardAction($event, item)" />
      </ng-template>
    </falcon-angular-card>
  }
</div>
```

---

## Decision Matrix — Which Composition?

| UI Need | Composition |
|---|---|
| "Show a list of X with edit/delete actions" | C01 — Table + Status + Row Actions + Pagination |
| "Browse a hierarchy and view details" | C02 — Tree + Details + Tabs + Action Buttons |
| "Edit a record's fields" | C03 — Form + Validation + Footer |
| "Confirm or complete a single action in a modal" | C04 — Popup + Form + Confirm |
| "Create a new entity across multiple steps" | C05 — Stepper + Forms + Summary Table |
| "Filter a list before viewing it" | C06 — Filter Panel + Search + Dropdowns |
| "Browse items as visual cards" | C07 — Card Grid + Status Tags + Action Menu |

---

## Cross-Links

- [[Falcon Component Composition Playbook]] — wiring detail for each composition
- [[Falcon Page Region Patterns]] — where each composition slots into a page
- [[Falcon Component Selection Decision Tree]] — individual component selection
- [[Falcon Component Gap Registry]] — all P0/P1 gaps referenced above
- [[Falcon Data Table Composition Rules]] — C01 deep rules
- [[Falcon Form Composition Rules]] — C03/C05 deep rules
- [[Falcon Popup and Drawer Composition Rules]] — C04 deep rules
- [[Falcon Tree and Details Composition Rules]] — C02 deep rules
- [[Falcon New Page Implementation Checklist]] — pre-merge gate

## Tags

#type/matrix #layer/frontend #layer/composition #status/active #scope/angular-first

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[Falcon Component Composition Playbook]]
