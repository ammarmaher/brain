# Current Angular Tabs Inspection
Date: 2026-05-14
Scope: tabs only above `falcon-node-details-section`. Out of scope: hierarchy tab body (tree, users table, org-chart), wizards, login.

Workspace root: `C:\Falcon\Falcon\falcon-web-platform-ui`
Feature root: `apps\admin-console\src\app\features\org-hierarchy-page`
Falcon UI lib root: `libs\falcon-ui-core\src\angular-wrapper\components`

All paths below are relative to one of the three roots above. `[CODE]` marks code-evidenced facts; `[INFERRED]` marks reasoning.

---

## 0. Tab strip & template-slot mechanism (menu component)

### 0.A Files
- `[CODE]` `components/org-hierarchy-page-menu.component.ts` (313 lines, standalone, `OnPush`)
- `[CODE]` `components/org-hierarchy-page-menu.component.html` (259 lines)
- No `.scss` / `.css`; Tailwind only.
- Standalone? Yes. ChangeDetection: `OnPush`. Host class: `block h-full`.

### 0.B Imports (relevant to the tab strip)
`[CODE]` `org-hierarchy-page-menu.component.ts:7-50`
- `FalconAngularTabsComponent`, `FalconTabActionsDirective`, `FalconAngularButtonComponent`, `FalconAngularDataTableComponent`, `FalconAngularInputComponent`, `FalconAngularStatusBadgeComponent`, `FalconDataTableCellDirective`, type `FalconTabOption` from `@falcon/ui-core/angular`.
- `FalconNodeDetailsActionsDirective`, `FalconNodeDetailsSectionComponent`, `FalconTreePanelComponent`, `FalconViewToggleComponent`, `TranslatePipe`, `TranslateService` from `@falcon`.
- 4 page-local tab bodies + 3 wizards + skeleton + drilldown.

### 0.C Tab strip template
`[CODE]` `org-hierarchy-page-menu.component.html:48-60`
```html
<falcon-angular-tabs
  #tabsHost
  [tabs]="visibleTabsForFalcon()"
  [selectedValue]="state.activeClientTab()"
  (valueChange)="onTabChange($event)">
  <ng-template falconTabActions="hierarchy">
    <falcon-view-toggle [options]="state.structureOptions" [(value)]="state.structureView" />
  </ng-template>
</falcon-angular-tabs>
```
- Only the `hierarchy` tab gets a tab-action slot (the List/Tree view toggle).
- `commChannels`, `apps`, `settings` have NO `<ng-template falconTabActions=...>`.
- Tab strip is inside `<div class="pl-5 pr-2 pt-1 border-b border-falcon-neutral-150">` and the tab body content is rendered as siblings inside `<div class="flex-1 min-h-0 overflow-auto">` via `@switch (state.activeClientTab())`.

### 0.D Tab body switch
`[CODE]` `org-hierarchy-page-menu.component.html:149-252`
```html
@switch (state.activeClientTab()) {
  @case ('hierarchy')    { <!-- tree+users table or chart or info-panel --> }
  @case ('commChannels') { <app-comm-channels-tab [nodeId]="state.effectiveNodeId()" /> }
  @case ('apps')         { <app-apps-services-tab [nodeId]="state.effectiveNodeId()" /> }
  @case ('settings')     { <div class="mx-5 mb-6 border ..."><app-settings-tab [nodeId]="state.effectiveNodeId()" /></div> }
}
```

### 0.E Imperative Stencil DOM patches
`[CODE]` `org-hierarchy-page-menu.component.ts:148-254` (effect block).
The component performs several caller-side DOM patches to work around Stencil prop-forwarding + visual gaps:
1. `falcon-tabs-tw` does not always pick up `[tabs]` binding when the custom-element is registered after Angular renders — `viewChild('tabsHost')` is used to imperatively assign `stencil.tabs = tabs` once `customElements.whenDefined('falcon-tabs-tw')` resolves.
2. `--falcon-tabs-panel-padding-y/x` zeroed to remove ~32px gap (Stencil renders empty `<div role="tabpanel">` siblings that the consumer doesn't use).
3. Paginator rows-per-page label is injected as a child text node.
4. `falcon-table-tw` colour/padding/border-radius vars overridden.
5. Empty `<th aria-label="Row actions">` gets `"Actions"` text injected as the dev-server cached bundle still misses the label.

### 0.F State + computed
`[CODE]` `org-hierarchy-page-menu.component.ts:101-137`
- `state = inject(HierarchyPageStateService)`
- `userDetails = signal<User | null>(null)` (drilldown panel, page-local).
- `visibleTabsForFalcon = computed<readonly FalconTabOption[]>(...)` maps `state.visibleTabs()` (label-key) to `{ value, label }` using `i18n.translate`, depends on `state.langTick`.
- `usersEmptyDataConfig` (used by hierarchy users table — out of scope).
- `rowsPerPageOptions: number[] = [10, 20, 30, 40]` (out of scope — users table).
- `showSkeleton = computed(() => state.treeRoot() === null)`

### 0.G State service tab mechanics
`[CODE]` `services/hierarchy-page-state.service.ts:42, 57-62, 93, 135-140`
- `ClientTab = 'hierarchy' | 'commChannels' | 'apps' | 'settings'`
- `CLIENT_TABS`: 4 entries with `labelKey` strings (`hierarchy.tabs.hierarchy/commChannels/apps/settings`).
- `activeClientTab = signal<ClientTab>('hierarchy')`.
- `visibleTabs = computed(...)`: root selection → `['hierarchy', 'settings']`; non-root → all 4 tabs.
- `effect`: if active tab not in `visibleTabs`, reset to `'hierarchy'`.

---

## 1. comm-channels-tab

### 1.A Files
- `[CODE]` `components/tab-components/comm-channels-tab/comm-channels-tab.component.ts` (18 lines)
- `[CODE]` `components/tab-components/comm-channels-tab/comm-channels-tab.component.html` (5 lines)
- `[CODE]` `index.ts` (barrel re-export)
- No `models/`, no `services/`, no `.scss`.
- Standalone? Yes. `OnPush`. Selector: `app-comm-channels-tab`.

### 1.B Template
`[CODE]` `comm-channels-tab.component.html:1-5` — entire template:
```html
<div class="flex flex-col gap-4 px-6 pb-6 pt-0">
  <app-applications-table [rows]="rows()" titleKey="hierarchy.commChannels.title" />
</div>
```
- Single child: `<app-applications-table>` (the shared inner table).
- No Falcon-library components used DIRECTLY in this template (delegated to `applications-table`).
- 1 Tailwind class group only.

### 1.C TS class
`[CODE]` `comm-channels-tab.component.ts`
- Inputs: `nodeId = input<string | null>(null)`.
- Outputs: NONE.
- Computed: `rows = computed(() => getMockChannels(this.nodeId()))`.
- Imports: `ApplicationsTableComponent`, `getMockChannels`.
- Methods: NONE.
- No DI, no forms, no constants beyond mock data.

### 1.D State service touchpoints
- NONE direct. Receives `nodeId` from parent (`state.effectiveNodeId()`); never reads/writes `HierarchyPageStateService`.

### 1.E Falcon UI components used
- NONE directly. (All UI delegated to `app-applications-table`, which is a page-local, hand-rolled HTML `<table>` — see Section 5 / Section 6.)

### 1.F What's missing (Angular-truth)
- No real data — bound to mock-applications.
- No add/edit/delete dialog flows wired to a service.
- No status legend, no row-tooltip, no bulk actions.
- No filter / search inputs.
- Pagination row in `applications-table` is HARD-CODED `1 of 1` and "Next" button is `disabled`. (See §5.)
- No theming / configurable column visibility.

---

## 2. apps-services-tab

### 2.A Files
- `[CODE]` `components/tab-components/apps-services-tab/apps-services-tab.component.ts` (18 lines)
- `[CODE]` `components/tab-components/apps-services-tab/apps-services-tab.component.html` (5 lines)
- `[CODE]` `index.ts` (barrel)
- No `models/`, no `services/`, no `.scss`.
- Standalone? Yes. `OnPush`. Selector: `app-apps-services-tab`.

### 2.B Template
`[CODE]` `apps-services-tab.component.html:1-5` — entire template:
```html
<div class="flex flex-col gap-4 px-6 pb-6 pt-0">
  <app-applications-table [rows]="rows()" titleKey="hierarchy.appsServices.title" />
</div>
```
- Identical structure to `comm-channels-tab` template. Only difference: `titleKey` and `rows()` source.

### 2.C TS class
`[CODE]` `apps-services-tab.component.ts`
- Inputs: `nodeId = input<string | null>(null)`.
- Outputs: NONE.
- Computed: `rows = computed(() => getMockApps(this.nodeId()))`.
- Imports: `ApplicationsTableComponent`, `getMockApps`.
- Methods: NONE.
- No DI, no forms.

### 2.D State service touchpoints
- NONE direct. Same pattern as §1.D.

### 2.E Falcon UI components used
- NONE directly. Delegates to `app-applications-table`.

### 2.F What's missing (Angular-truth)
- Identical to §1.F.
- No "Add Application" button.
- No tier/category filtering.
- No effective-date validation or persistence.
- `apps-services-tab` is functionally just a re-skinned `comm-channels-tab` with different mock data — no app-specific concepts (license type, allocation, seats, etc.) exist anywhere in the code.

---

## 3. falcon-org-info-panel (Audit / RuleStatus / Permission sub-tabs)

> Note: The brief mentions "Audit / RuleStatus / Permission sub-tabs". The current Angular implementation **does not** contain any such sub-tabs. The panel is a flat 17-field dossier organised in 4 sections (`identity`, `business`, `address`, `identifiers`) per `OrgInfoSection`. See §3.F.

### 3.A Files
- `[CODE]` `components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.ts` (48 lines)
- `[CODE]` `components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` (56 lines)
- `[CODE]` `models/models.ts` (27 lines)
- `[CODE]` `index.ts` (barrel)
- No `.scss`.
- Standalone? Yes. `OnPush`. Selector: `app-org-info-panel`. Host class: `falcon-org-info-panel-host flex flex-col`.

### 3.B Template
`[CODE]` `falcon-org-info-panel.component.html`
Top-level structure:
1. `<header class="px-6 pt-5 pb-3.5 bg-white text-sm font-bold ...">` — renders `'hierarchy.info.title' | translate`.
2. `@if (loading())` → skeleton grid (12 placeholders, 4 columns).
3. `@else if (dossier())` → avatar block + 4-column responsive grid of fields.
4. `@else` → empty message.

Avatar block (lines 15-23):
```html
<span class="grid place-items-center w-16 h-16 rounded-full text-white text-xl font-bold bg-falcon-teal-700">
  {{ (nodeName().charAt(0) || 'A').toUpperCase() }}
</span>
<div>
  <span>{{ nodeName() }}</span>
  <span>{{ 'hierarchy.info.clientPicture' | translate }}</span>
</div>
```

Field grid (lines 25-49):
- Iterates `sections` → for each section, optionally renders an `<h4>` for `business`-section heading only (others have no section header), then iterates fields.
- Per field: label (translate `hierarchy.info.fields.<key>`), and either:
  - `editable() === true` → `<falcon-angular-input [useTailwind]="true" size="sm" [ngModel]="valueOf(key)" />`
  - `editable() === false` → `<span class="text-[13.5px] font-bold ...">{{ valueOf(key) }}</span>` (read-only)

Falcon components used:
- `<falcon-angular-input>` — one instance per field, only when `editable()`.

Tailwind classes: utility-only, no custom CSS.

### 3.C TS class
`[CODE]` `falcon-org-info-panel.component.ts:20-48`
- Inputs:
  - `dossier = input.required<NodeDossier | null>()` (from `@falcon/sdk`)
  - `loading = input<boolean>(false)`
  - `nodeName = input<string>('')`
  - `editable = input<boolean>(false)`
- Outputs:
  - `back = output<void>()` — declared but **not emitted anywhere in the template**.
- Constants:
  - `sections: readonly OrgInfoSection[]` — 4 entries totaling 17 fields:
    - `identity`: `accountName, financeId, classification, subClassification`
    - `business`: `entityName, authorityType, sector, budget`
    - `address`: `country, city, district, street, building, postal, addlAddr`
    - `identifiers`: `anotherId, vat`
  - `skeletons: readonly number[]` — `Array.from({ length: 12 }, ...)` for the loading state.
- Methods:
  - `fieldKey(key)` → `'hierarchy.info.fields.' + key`
  - `sectionKey(id)` → `'hierarchy.info.sections.' + id`
  - `valueOf(key)` → `dossier()?.[key] ?? '—'`
- No DI, no forms, no signals.
- Imports: `TranslatePipe` (`@falcon`), `FormsModule`, `FalconAngularInputComponent` (`@falcon/ui-core/angular/falcon-input`).

### 3.D State service touchpoints
- Parent (`org-hierarchy-page-menu.component.html:164-168`) passes:
  - `[dossier]="state.infoDossier()"` — computed from `state.selectedNode()` (state service line 154-176, hard-coded mock dossier).
  - `[nodeName]="node.name"`
  - `[editable]="state.infoEditMode()"`
  - `(back)="state.closeInfo()"`
- Edit/save/cancel is **driven from outside** the panel (node-details-section action slot):
  - `state.infoOpen`, `state.infoEditMode` — signals on state service.
  - `state.openInfoEdit()`, `state.cancelInfoEdit()`, `state.saveInfoEdit()` — all in `HierarchyPageStateService`.
  - `state.saveInfoEdit()` is a no-op stub: `/*** Persist would go here — in-memory only for v1 ***/` (state svc line 296-299).

### 3.E Falcon UI components used
- `<falcon-angular-input>` — one per field when editable. No outputs wired; `[ngModel]` is **one-way** (no `(ngModelChange)` handler), so edits **do not persist** to the dossier.

### 3.F What's missing (Angular-truth)
- **No Audit sub-tab.** `editable()` is global to the whole panel — no per-section/per-field edit lock.
- **No RuleStatus sub-tab.**
- **No Permission sub-tab.**
- No tabs/segments inside the panel at all — flat single-screen layout.
- Inputs are read-only-in-effect: `[ngModel]` is bound but `(ngModelChange)` is missing → edits in the DOM never reach the dossier or state service.
- `back` output is declared but never `.emit()`-ed (the parent wires `(back)="state.closeInfo()"` but that handler never fires).
- No form validation, no required-field markers, no helper-text per field.
- Avatar is a single-letter coloured circle (no image upload, no client-picture replace).
- "Client Picture" label is purely cosmetic — no upload control.

---

## 4. settings-tab

### 4.A Files
- `[CODE]` `components/tab-components/settings-tab/settings-tab.component.ts` (67 lines)
- `[CODE]` `components/tab-components/settings-tab/settings-tab.component.html` (40 lines)
- `[CODE]` `index.ts` (barrel)
- No `models/`, no `services/`, no `.scss`.
- Standalone? Yes. `OnPush`. Selector: `app-settings-tab`.

### 4.B Template
`[CODE]` `settings-tab.component.html`
Top-level structure:
1. Header row (lines 2-31):
   - Left: brand-name node header → `<span class="w-9 h-9 rounded-md bg-falcon-teal-50 text-falcon-teal-700"><i class="falcon-icon falcon-icon-home text-base"></i></span>` + `<h3>{{ nodeName() }}</h3>`.
   - Right: action buttons:
     - View mode → single `<falcon-angular-button [label]="'common.edit' | translate" (falconClick)="onEdit()">` with pencil icon slot.
     - Edit mode → two buttons: `Cancel` (`variant="ghost"`) + `Save` (`variant="primary"`, `[disabled]="!formValid() || !formDirty()"`).
2. Body (lines 33-39):
   - `<app-client-settings-step [(value)] [(valid)] [(dirty)] [readonly]="mode() === 'view'" />` — REUSED from the Add Client wizard step 2.

Falcon components used:
- `<falcon-angular-button>` × 3 (1 in view mode, 2 in edit mode).

### 4.C TS class
`[CODE]` `settings-tab.component.ts:19-66`
- Inputs:
  - `nodeId = input<string | null>(null)`
- Outputs: NONE.
- DI: `state = inject(HierarchyPageStateService)`, `i18n = inject(TranslateService)`, `notifier = inject(FALCON_NOTIFIER, { optional: true })` (typed `FalconNotifierFacade | null`).
- Signals:
  - `nodeName = computed<string>(() => state.selectedNode()?.name ?? '')`
  - `mode = signal<'view' | 'edit'>('view')`
  - `formValue = signal<ClientSettingsFormValue>(this.hydrate())`
  - `formValid = signal<boolean>(true)`
  - `formDirty = signal<boolean>(false)`
- Methods:
  - `hydrate()` → reads `state.getSettingsForNode(nodeId)` → `state.fromAccountSettings(...)` → form value.
  - `onEdit()` → `mode.set('edit')`.
  - `onCancel()` → re-hydrate, clear `formDirty`, switch back to view.
  - `onSave()` → `state.saveSettings(nodeId, formValue())` → notifier success → `mode.set('view')`.
- Constructor effect re-hydrates the form whenever `nodeId` changes (line 36-42).
- Imports: `FalconAngularButtonComponent`, `ClientSettingsStepComponent` (from wizard), `TranslatePipe`. Notifier from `@falcon/sdk`.

### 4.D State service touchpoints
- Reads: `state.selectedNode()`, `state.getSettingsForNode(nodeId)`, `state.fromAccountSettings()`.
- Writes: `state.saveSettings(nodeId, formValue)`.
- Settings tab `mode` flag (`view`/`edit`) is **local** to the component, NOT in state service (so it resets to `view` on node change via constructor effect).
- `[CODE]` state service lines 498-533: `nodeSettings = signal<ReadonlyMap<string, AccountSettings>>(...)`, `getSettingsForNode(nodeId)`, `saveSettings(nodeId, formValue)`, `fromAccountSettings()`, `toAccountSettings()`. Backed by an in-memory `Map`; no backend call.

### 4.E Falcon UI components used
- `<falcon-angular-button>` (3 usages).
- All real settings UI is **inside `<app-client-settings-step>`** — see §6.

### 4.F What's missing (Angular-truth)
- The settings step is **reused verbatim from the Add Client wizard** — it's a single-step `[readonly]`-aware form. No settings-tab-specific layout / fields.
- No tabs/sections inside settings (e.g., no "Security" / "Limits" / "IP Allowlist" segmented tabs — just one flat 2-column grid).
- No OTP / verification flow for sensitive changes — `onSave()` immediately persists in-memory.
- No audit trail / change history view.
- No "Reset to defaults" button.
- No discard-confirmation dialog when leaving edit mode with unsaved changes.
- Notifier call uses `FALCON_NOTIFIER` token (optional) — silently no-ops if not provided.
- Settings step itself uses NO `<falcon-angular-*>` components (see §6) — it's hand-rolled HTML radios + `<input type="number">` + custom IP-chip UI.

---

## 5. Shared inner table — `app-applications-table` (used by Tabs 1 + 2)

### 5.A Files
- `[CODE]` `components/tab-components/applications-table/applications-table.component.ts` (148 lines)
- `[CODE]` `components/tab-components/applications-table/applications-table.component.html` (192 lines)
- `[CODE]` `index.ts` (barrel)
- Standalone? Yes. `OnPush`. Selector: `app-applications-table`.

### 5.B Template (high level)
- Hand-rolled `<table class="w-full border-collapse text-[13px]">` — NOT `<falcon-angular-data-table>`.
- 9 columns: Visibility (toggle), Name, Price Type, Price Value, First Activation, Activation Date, Renew Date, Status, Action (kebab).
- Inline row edit: when `editingId() === app.id`, two extra `<tr>` rows expand below the row to show `<select>` + `<falcon-calendar>` + price number `<input>`.
- Status badges: **hand-rolled `<span>`s with Tailwind colour classes**, NOT `<falcon-angular-status-badge>`. 5 status types (active / expired / disable / inactive / null) hard-coded with `@switch`.
- Row kebab menu: hand-rolled absolutely-positioned `<div>` with Edit + Delete items — NOT `<falcon-angular-menu>`.
- Visibility toggle: hand-rolled `<button role="switch">` — NOT `<falcon-angular-switch>`.
- Footer: `<div>1 of 1</div>` + disabled Next button (placeholder).

### 5.C TS class
- Inputs: `rows = input.required<ApplicationRow[]>()`, `titleKey = input<string>('hierarchy.applications.title')`.
- Signals: `apps`, `editingId`, `menuFor`, `editForm`, `effDateValue`.
- Methods: `toggleVisibility`, `toggleMenu`, `closeMenu`, `openEdit`, `cancelEdit`, `applyEdit`, `deleteRow`, `wrapTwo` (header-text 2-word wrap), `updateEditField`, `onEffDateChange`, plus `parseEffDate`/`formatEffDate`/`defaultEditForm` helpers.
- Constants: `priceTypeOptions` (OneTime/Monthly/Quarterly/Yearly), `headerKeys` (9 column header translate keys).
- Constructor effect re-clones `rows()` into local `apps` signal on every change.

### 5.D State service touchpoints
- NONE. Pure presentational table — all state is component-local.

### 5.E Falcon UI components used (DIRECTLY)
- `<falcon-calendar>` — ONE instance (inline edit row, applications-table.component.html:129-132). This is the **legacy** `FalconCalendarComponent` from `@falcon` (`libs/falcon/src/shared-ui`), NOT the new `<falcon-angular-calendar>` wrapper.

### 5.F What's missing
- No use of `<falcon-angular-data-table>` even though the hierarchy users-table on the page uses it (so the library supports it).
- No status badges via `<falcon-angular-status-badge>` even though the library has all 4 severities needed.
- No menu via `<falcon-angular-menu>`.
- No real toggle via `<falcon-angular-switch>`.
- No real pagination — footer is dead text.
- No backend / no persistence — `applyEdit`/`deleteRow` mutate the local `apps` signal only.

---

## 6. Shared settings inner step — `app-client-settings-step` (used by Tab 4)

### 6.A Files
- `[CODE]` `components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.ts` (143 lines)
- `[CODE]` `components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` (184 lines)
- Standalone? Yes. `OnPush`. Selector: `app-client-settings-step`.

### 6.B Template (high level)
2-column layout (responsive 1-col on small):
- Left column:
  1. "Password Security" section header.
  2. Two radios (`<label>` + hidden native `<input type="radio">`): Normal / Advanced — hand-rolled, NOT `<falcon-angular-radio>`.
  3. "Allowed IPs" section header.
  4. Add-IP inline editor: native `<input type="text" falconIpAddress>` + + / × inline buttons. Pending-IP state with `editingIp` signal.
  5. IP chips list: hand-rolled `<span class="bg-falcon-neutral-100 ...">` chips with `×` remove button — NOT `<falcon-angular-tag>`.
  6. Validation messages (red text).
- Right aside ("Account Limitations"):
  1. Three `<input type="number">` fields: Max Normal Users / Max System Users / Max Node Level.
  2. Per-field validation messages.
  - NOT `<falcon-angular-input-number>` — native HTML inputs.

### 6.C TS class
- `value/valid/dirty` = `model()` two-way bindings.
- `readonly = input<boolean>(false)` — toggled by parent settings-tab.
- Per-field signals with `computed` validation messages (calls `allowedIpListValidator`, `userLimitValidator`, `maxNodeLevelsValidator`).
- Methods: `onSecurity`, `startAddIp`, `cancelAddIp`, `commitIp`, `removeIp`, `onPendingIpKey`, `onPendingIpChange`, `stepNum`, `onNumChange`, `onBlur`, `updateField`.
- HARD_CAP = 999 for numeric inputs.
- Imports: `FormsModule`, `FalconIpAddressDirective` (`@falcon`), `TranslatePipe`. Imports `isValidIp` from `@falcon`.

### 6.D Falcon UI components used (DIRECTLY)
- NONE. (`FalconIpAddressDirective` is an input mask directive, not a UI component.)

### 6.E What's missing
- No `<falcon-angular-input>` / `<falcon-angular-radio>` / `<falcon-angular-input-number>` / `<falcon-angular-tag>` — all hand-rolled.
- No password-strength visualisation.
- No OTP / 2FA settings.
- No IP-range / CIDR support (only `isValidIp(v, 'ipv4'|'ipv6')`).
- No persistence beyond the in-memory `state.nodeSettings` Map.

---

## 7. Falcon UI library — relevant component capability table

> Existence verified by directory presence + Stencil/wrapper file presence under `libs/falcon-ui-core/src/angular-wrapper/components/`. Selectors come from the `@Component` decorators.

| Need (for tabs) | Exists? | Wrapper path | Selector | Top-level inputs / outputs | Notes |
|---|---|---|---|---|---|
| Tabs | YES | `falcon-tabs/falcon-tabs.component.ts` | `falcon-angular-tabs` | `[tabs] [mode] [size] [orientation] [ariaLabel] [helperText] [errorMessage] [useTailwind=true] [(selectedValue)] (valueChange)`; CVA + `<ng-template falconTabActions="<value>">` slot. | Slot directive `FalconTabActionsDirective` in same folder. Used by menu (§0). |
| Tab actions slot | YES | `falcon-tabs/falcon-tab-actions.directive.ts` | `ng-template[falconTabActions]` | `@Input({required:true, alias:'falconTabActions'}) tabKey` | Used for the hierarchy view-toggle only (§0.C). |
| Data table | YES | `falcon-data-table/falcon-data-table.component.ts` | `falcon-angular-data-table` | `[data] [columns] [selectable] [selectionMode] [selection] [paginator] [rows] [rowsPerPageOptions] [dataKey] [lazy] [totalRecords] [sortMode] [loading] [skeletonRows] [scrollable] [scrollHeight] [striped] [hoverable] [rowMenuItems] [rowActions] [actionFlags] [stickyActions] [showGlobalFilter] [emptyData] [showCustomFooter] [currentPage] [footerShowingLabel] [footerFromLabel] [footerRowsPerPageLabel]`; outputs `(emptyDataAction) (emptyStateChange) (pageChange) (rowsChange) (selectionChange) (sortChange) (lazyLoad) (rowAction) (rowMenuAction)`. + cell/header/empty/loading directives. | NOT used by `applications-table` (hand-rolled) — but used by hierarchy users table on same page. |
| Button | YES | `falcon-button/falcon-button.component.ts` | `falcon-angular-button` | `[label] [variant] [size] [disabled] (falconClick)` (plus slots `icon-start`/`label`). | Used in `settings-tab`, `org-hierarchy-page-menu`. |
| Input (text) | YES | `falcon-input/falcon-input.component.ts` | `falcon-angular-input` | `[useTailwind] [size]` + CVA `[ngModel]`. | Used in `falcon-org-info-panel` (edit mode). |
| Dropdown | YES | `falcon-dropdown/falcon-dropdown.component.ts` | `falcon-angular-dropdown` | (not used by tabs) | Available — `applications-table` uses native `<select>` instead. |
| Calendar (legacy) | YES | `libs/falcon/src/shared-ui/.../falcon-calendar` | `falcon-calendar` (legacy) | `[ngModel] (dateChange) [dateFormat]` | Used by `applications-table`. |
| Calendar (new wrapper) | YES | `falcon-calendar/falcon-calendar.component.ts` | `falcon-angular-calendar` | `[value:string] [min] [max] [disabledDates] [firstDayOfWeek] [locale] [showWeekNumbers] [size] [disabled] [useTailwind=true]`; `(falconChange) (falconBlur) (valueChange)` | NOT used by tabs. (Legacy used instead.) |
| Date picker | YES | `falcon-date-picker/falcon-date-picker.component.ts` | `falcon-angular-date-picker` | (not used by tabs) | Available, unused. |
| Switch | YES | `falcon-switch/falcon-switch.component.ts` | `falcon-angular-switch` | `[variant] [label] [helperText] [errorText] [size] [state] [required] [name] [value] [textOn] [textOff] [checkedInput] [useTailwind=true]` + CVA | NOT used by `applications-table` visibility toggle (hand-rolled). |
| Checkbox / Checkbox group | YES | `falcon-checkbox/`, `falcon-checkbox-group/` | `falcon-angular-checkbox`, `falcon-angular-checkbox-group` | (not used by tabs) | Available, unused. |
| Single uploader | YES | `falcon-single-uploader/...component.ts` | `falcon-angular-single-uploader` | `[accept] [maxSize] [required] [helperText] [errorMessage] [label] [placeholder] [placeholderHint] [size] [previewMode] [ariaLabel] [useTailwind=true]` + CVA | NOT used by `falcon-org-info-panel` "Client Picture" block. |
| Phone field | YES | `falcon-phone-field/...component.ts` | `falcon-angular-phone-field` | `[label] [placeholder] [helperText] [errorMessage] [country=SA] [countries] [size] [state] [readonly] [required] [verifyButton] [verifyLabel] [name] [inputId] [autocomplete]` | NOT used by any tab. |
| OTP | YES | `falcon-otp/falcon-otp.component.ts` | `falcon-angular-otp` | `[label] [placeholder] [helperText] [errorMessage] [length=6] [mask] [size] [state] [required] [name] [inputId] [pattern]` + classes | NOT used by any tab. |
| OTP send dialog | YES | `falcon-otp-send-dialog/...component.ts` | `falcon-angular-otp-send-dialog` | (not used by tabs) | Available, unused. |
| Status badge | YES | `falcon-status-badge/...component.ts` | `falcon-angular-status-badge` | `[severity: active\|pending\|suspended\|locked\|deleted\|inactive\|paid\|expired\|disabled] [label] [size]` | NOT used by `applications-table` status column (hand-rolled). USED by hierarchy users table. |
| Tag | YES | `falcon-tag/...component.ts` | `falcon-angular-tag` | (not used by tabs) | NOT used by `client-settings-step` IP chips (hand-rolled). |
| Badge | YES | `falcon-badge/...component.ts` | `falcon-angular-badge` | (not used by tabs) | Available, unused. |
| Popup | YES | `falcon-popup/...component.ts` | `falcon-angular-popup` | signal-based `open()`, `resolvedTitle()`, glossy preset, icon switch | NOT used by any tab. |
| Dialog | YES | `falcon-dialog/...component.ts` | `falcon-angular-dialog` | `[open] [title] [description] [size] [closable] [closeOnBackdrop] [closeOnEsc] [dismissible] [severity] [position] [disabled] [errorMessage] [ariaLabel] [useTailwind=true]` | NOT used by any tab. |
| Confirm dialog | YES | `falcon-confirm-dialog/...component.ts` | `falcon-angular-confirm-dialog` | `[open] [title] [message] [icon] [acceptLabel] [rejectLabel] [severity] [size] [position] [closable] [closeOnBackdrop] [closeOnEsc] [useTailwind=true]`; `(accept) (reject) (openChange)` | NOT used by any tab (settings discard-confirm would benefit). |
| Menu | YES | `falcon-menu/falcon-menu.component.ts` | `falcon-angular-menu` | (used internally by data-table) | NOT used by `applications-table` row kebab (hand-rolled). |
| Input number | YES | `falcon-input-number/...component.ts` | `falcon-angular-input-number` | (not used by tabs) | NOT used by `client-settings-step` Max-User inputs (native `<input type="number">`). |
| Radio / Radio group | YES | `falcon-radio/`, `falcon-radio-group/` | `falcon-angular-radio`, `falcon-angular-radio-group` | (not used by tabs) | NOT used by `client-settings-step` password security selector (hand-rolled radios). |
| Uploader (multi) | YES | `falcon-uploader/...component.ts` | `falcon-angular-uploader` | (not used by tabs) | Available, unused. |

`[INFERRED]` No `@deprecated` markers spotted on any of the components used by the tabs. The legacy `<falcon-calendar>` (in `libs/falcon`) coexists with the newer `<falcon-angular-calendar>` (in `libs/falcon-ui-core/src/angular-wrapper`); the inner `applications-table` uses the legacy.

---

## 8. Cross-cutting findings

1. **No page-local SCSS in any tab.** Confirmed by `find` over `components/tab-components` returning zero `.scss` / `.css` files. Tailwind utilities only.

2. **No `<falcon-angular-status-badge>` reuse in `applications-table`.** 5 status types are duplicated as inline `<span>` blocks with Tailwind colour classes — the library wrapper supports `expired`, `disabled` (≈ `disable`), `inactive`, plus 6 more out of the box and is already used in the hierarchy users-table column on the same page.

3. **No `<falcon-angular-data-table>` reuse in `applications-table`.** The shared inner table is hand-rolled HTML `<table>` despite the hierarchy users table on the same page using `<falcon-angular-data-table>` with all its features.

4. **No `<falcon-angular-switch>` for the Visibility column.** Hand-rolled `<button role="switch">` instead.

5. **No `<falcon-angular-menu>` for the row kebab.** Hand-rolled absolute-positioned dropdown.

6. **No `<falcon-angular-radio>` in `client-settings-step`.** Two hand-rolled "card-style" radios.

7. **No `<falcon-angular-input-number>` for limits.** Three native `<input type="number">`.

8. **No `<falcon-angular-tag>` for IP chips.** Hand-rolled chip spans.

9. **Hard-coded pagination footer in `applications-table`.** "1 of 1" + disabled "Next" — does not paginate the underlying mock array.

10. **`falcon-org-info-panel` edit-mode is a façade.** `<falcon-angular-input>` rendered when `editable()` is true, BUT no `(ngModelChange)` handler wired and `state.saveInfoEdit()` is a no-op (in-memory only). Inputs accept text but nothing persists or flows back to the dossier.

11. **Tab strip uses imperative DOM patches.** 5 documented Stencil prop-forwarding / styling workarounds inside the menu effect block (see §0.E). Most patches use `customElements.whenDefined(...)` to wait for the web-component to register, then mutate CSS vars + inject text nodes. This is consumer-side until the Stencil bundle is rebuilt.

12. **`commChannels` and `apps` tabs share 100% of their UI** via the same `applications-table`. The only difference: `titleKey` and the mock-data source function. There is no concept of "apps vs channels" beyond seed data.

13. **Settings tab leaks wizard internals.** Imports `ClientSettingsStepComponent` from `add-client-wizard/client-settings-step` and `ClientSettingsFormValue` from `add-client-wizard/models/models`. Edit-mode flag is component-local (not in state service) so it resets on node change via constructor effect.

14. **Notifier is optional with silent no-op fallback.** Settings tab uses `inject(FALCON_NOTIFIER, { optional: true })` (line 24) — save still proceeds even if no notifier is provided.

15. **No tabs inside tabs.** The brief implies sub-tabs (Audit / RuleStatus / Permission) inside the info panel — they do not exist in the current Angular code.

16. **Colour usage is palette-named.** No hard-coded hex/rgb in templates — all `bg-falcon-teal-700`, `text-falcon-neutral-900`, etc. (consistent with Noor Instructions). One exception: `applications-table.component.html:107` uses `bg-falcon-teal-50/60` and `bg-falcon-teal-50/40` (opacity utilities) for the active edit-row stripe; still palette-based.

17. **i18n keys present and consistent.** All user-facing text uses `| translate` with namespaced keys (`hierarchy.applications.*`, `hierarchy.info.*`, `hierarchy.settings.*`, `common.*`).

18. **Settings save flow is in-memory.** `state.saveSettings()` updates a `signal<Map>` only. No HTTP / no Kafka / no audit event.

---

## Summary

**Completeness estimate per tab (subjective):**
- `comm-channels-tab`: ~35% — UI shell + mock data only; edit/delete/visibility toggle work locally; no real persistence, no pagination, no add-row.
- `apps-services-tab`: ~35% — same as comm-channels (shares `applications-table`); app-specific concepts (license/tier/seats) entirely absent.
- `falcon-org-info-panel`: ~55% — flat 17-field dossier renders cleanly with skeleton + read/edit toggle, but `(ngModelChange)` not wired so edits don't persist; `back` output never emits; sub-tabs (Audit/RuleStatus/Permission per brief) do not exist.
- `settings-tab`: ~65% — full read/edit/cancel/save flow works in-memory with validation; reuses wizard step verbatim; no segmented sub-tabs, no confirm-on-discard, no OTP guard.
- Tab strip (`org-hierarchy-page-menu` tab section): ~80% — visible-tab filtering + view-toggle slot + i18n re-translate work; 5 imperative DOM patches paper over Stencil gaps.

**Falcon components reused by tabs:** `falcon-angular-tabs` (+ `falconTabActions` directive), `falcon-angular-button`, `falcon-angular-input` (info-panel edit-mode only), legacy `falcon-calendar` (applications-table edit row only).

**Falcon components clearly missing from tab use:** `falcon-angular-data-table`, `falcon-angular-status-badge`, `falcon-angular-switch`, `falcon-angular-menu`, `falcon-angular-radio`/`radio-group`, `falcon-angular-input-number`, `falcon-angular-tag`, `falcon-angular-single-uploader` (client-picture), `falcon-angular-phone-field` / `otp` / `otp-send-dialog` (settings-tab security flows), `falcon-angular-confirm-dialog` (discard-on-edit guard), `falcon-angular-dialog`, `falcon-angular-popup`.
