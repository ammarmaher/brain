# Falcon Component Relationship Map

*** Brain SK canonical — Agent 7 merge, 2026-05-13 ***
*** How components compose, replace, supersede, and share tokens ***

## 1. Composition trees (component A renders component B internally)

### `<falcon-angular-wizard>` composes `<falcon-angular-stepper>` + per-step body slots + Next/Back/Finish/Draft footer
- Source: `libs/falcon-ui-core/src/components/falcon-wizard/falcon-wizard.tsx`
- Wizard owns the chrome (header, body slot host, footer). Stepper is the visual progress indicator at the top.
- Reactive-Forms validation bridge via `stepControls: FormGroup[]` input.
- Slot pattern: `<div slot="step-{i}">…</div>` per step, optionally `<div slot="footer-extra">…</div>`.

### `<falcon-angular-popup>` does NOT compose `<falcon-angular-dialog>` (anti-pattern documented)
- Source: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-popup/falcon-popup.component.ts`
- Popup re-implements the modal scaffold (backdrop, ARIA, scale-in animation, Esc handling) in its own Angular inline template.
- Consequence: popup **lacks a focus trap** (verified P0 a11y gap — UP-3-02).
- Recommended fix: compose `<falcon-angular-dialog>` internally to inherit focus trap + focus restore + ARIA wiring.

### `<falcon-angular-confirm-dialog>` composes `<falcon-angular-dialog>`
- Source: `libs/falcon-ui-core/src/components/falcon-confirm-dialog/falcon-confirm-dialog.tsx`
- Confirm-dialog is a thin layer over dialog with hardcoded OK/Cancel buttons (currently raw `<button>` — should be `<falcon-angular-button>` per UP-3-17).
- Reject button rendered before accept — flagged for WAI-ARIA APG compliance check.

### `<falcon-angular-message-host>` composes `<falcon-angular-toast>` queue
- Source: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-message-service/`
- `FalconMessageService.add(...)` → host listens to a signal stream → renders `<falcon-angular-toast>` instances stacked.
- PrimeNG-compat substrate. Drop-in replacement for `<p-messages>` + `MessageService`.

### `<falcon-angular-notification-stack>` composes `<falcon-angular-notification>`
- Source: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-notification-stack.component.ts`
- Modern signal-based queue. Preferred over toast for new code.

### `<falcon-angular-data-table>` composes `<falcon-table-tw>` via Strategy E projection
- Source: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts` (672 LOC)
- Angular wrapper listens for `falcon-cells-mounted` event emitted by Stencil core.
- For each mount-point (`<td data-cell-mount=…>`), Angular mounts an `EmbeddedViewRef` from the projected `<ng-template falconDataTableCell>` template into the Light-DOM cell.
- Strategy E lets consumers project ng-templates per column (custom Angular components inside cells).

### `<falcon-angular-date-picker>` composes `<falcon-angular-calendar>` + input field + popover
- Source: `libs/falcon-ui-core/src/components/falcon-date-picker/falcon-date-picker.tsx`
- Input + chevron icon + popover panel that renders `<falcon-calendar>` (single-month grid).
- Outside-click closes; immediate-commit on date select.

### `<falcon-angular-search-input>` composes `<falcon-angular-input>` with `variant=search`
- Source: `libs/falcon-ui-core/src/components/falcon-search-input/falcon-search-input.tsx`
- Wraps the flagship input with clear-button affordance + 300ms debounced emit.

### `<falcon-angular-password>` composes `<falcon-angular-input>` with `type=password`/`text` toggle
- Source: `libs/falcon-ui-core/src/components/falcon-password/falcon-password.tsx`
- Composes input + reveal toggle button + optional 4-segment strength meter.
- Strength estimator is naive heuristic — pluggable replacement requested (U7).

### `<falcon-angular-otp-send-dialog>` composes `<falcon-angular-dialog>` + `<falcon-angular-radio-group>` + `<falcon-angular-otp>` + `<falcon-angular-button>`
- Source: `libs/falcon-ui-core/src/components/falcon-otp-send-dialog/falcon-otp-send-dialog.tsx`
- Step 1: channel chooser (email/sms/both). Step 2: OTP boxes + resend button.

### `<falcon-angular-checkbox-group>` composes `<falcon-angular-checkbox>` × N
- Source: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-checkbox-group/falcon-checkbox-group.component.ts`
- Pure Angular composition. Group manages selection state; each item is a `<falcon-angular-checkbox>`.

### `<falcon-angular-radio-group>` composes `<falcon-angular-radio>` × N
- Same pattern as checkbox-group — pure Angular composition.

### `<falcon-angular-phone-field>` composes country chooser + dial-code + `<input type=tel>` + verify button
- Source: `libs/falcon-ui-core/src/components/falcon-phone-field/falcon-phone-field.tsx`
- All four atoms share ONE outer border. Internal partitions are 1px vertical dividers.
- Country dropdown is searchable, ~250 entries rendered eagerly (perf concern at scale).

### `<falcon-tree-panel>` (legacy) composes its OWN `<falcon-tree-node>` recursive child (parallel impl to `<falcon-angular-tree>`)
- Source: `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.ts`
- Renders chrome + recursive tree + per-row 3-dot menus + root-row 3-dot menu.
- **Does NOT compose `<falcon-angular-tree>`** — two parallel codepaths for the same visual spec.
- Convergence path: add per-row template / actions slot to `<falcon-angular-tree>` (UC-W01), then refactor tree-panel to use it.

### `<falcon-tree-panel>` (legacy) consumes `<falcon-angular-menu>` for 3-dot actions
- Pattern: external-anchor `showAt()` mode — single shared menu instance, dynamic items per-row.

### Wizards (organization-hierarchy add-client / add-user) currently compose legacy `<falcon-stepper>` + `FalconStepDirective` + `FalconStepperFooterDirective`
- Source: `libs/falcon/src/shared-ui/lib/components/falcon-stepper/`
- 4 production wizards: admin + management × add-client + add-user.
- Migration target: replace with `<falcon-angular-wizard>` (UC-W02 — P0).

### `<falcon-photo-uploader>` (legacy) wraps `<input type=file>` + circular crop preview
- Source: `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.ts`
- Avatar circle + drag-hint banner. Used by Add Client / Add User wizards (6+ step templates).
- Migration target: `<falcon-angular-single-uploader>` with `previewMode='thumbnail'` + circular mask token (UC-L04).

### `<send-credentials-popup>` (legacy) composes `<falcon-angular-dialog>`
- Source: `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.ts`
- Last consumer of the deprecated `<falcon-angular-dialog>`.
- Blocked from retiring until `<falcon-angular-popup variant="custom">` slot-friendly variant ships (UC-W03).

## 2. Replaces / Supersedes (new replaces old)

| Modern (READY) | Replaces (LEGACY / DEPRECATED) |
|---|---|
| `<falcon-angular-phone-field>` | ← `<falcon-mobile-number>` (legacy facade — Wave 2) |
| `<falcon-angular-multi-select>` | ← `<falcon-multiselect>` (legacy stub — Wave 3) |
| `<falcon-angular-stepper>` (Stencil, READY) | ← `<falcon-stepper>` (legacy bespoke, Wave 3 PrimeNG removal) |
| `<falcon-angular-wizard>` | ← composition of `<falcon-stepper>` + `FalconStepDirective` + `FalconStepperFooterDirective` |
| `<falcon-angular-single-uploader>` (`previewMode='thumbnail'`) | ← `<falcon-photo-uploader>` (legacy Wave 23) |
| `<falcon-angular-date-picker>` | ← `<falcon-calendar>` (legacy facade — Wave 3, drop-in for `<p-calendar>`) |
| `<falcon-angular-notification>` | ← `<falcon-angular-toast>` (DEPRECATED for new code; kept as `FalconMessageService` substrate) |
| `<falcon-angular-popup>` | ← `<falcon-angular-dialog>` for action-required flows (DEPRECATED for that case; dialog kept as composition substrate for `send-credentials-popup` until UC-W03) |
| `<falcon-angular-confirm-dialog>` | ← `<p-confirmDialog>` (PrimeNG, removed in Wave PR-8) |
| `<falcon-angular-data-table>` | ← legacy `<falcon-data-table>` (PrimeNG `<p-table>` wrapper, deleted in Wave PR-7) |
| `<falcon-angular-tag>` | ← `<p-tag>` (PrimeNG, removed in Wave PR-8) |
| Vendored Falcon icon font (`libs/falcon-theme/src/styles/falcon-icons.css`) | ← PrimeIcons `pi pi-*` (122 icons migrated in Wave PR-8) |
| `<falcon-angular-input>` (CVA) | ← `<input>` + `ngx-intl-tel-input` (uninstalled in Wave 2) |
| `<falcon-angular-multi-select>` | ← composing PrimeNG `<p-multiSelect>` |
| `<falcon-angular-paginator>` (CVA) | ← `<p-paginator>` |
| `<falcon-angular-radio-group>` | ← `<p-radioButton>` |
| `<falcon-angular-checkbox-group>` | ← `<p-checkbox>` group composition |
| `<falcon-angular-textarea>` (no clip-trick) | ← `<p-inputTextarea>` |
| `<falcon-angular-password>` (4-segment strength + reveal) | ← `<p-password>` |
| `<falcon-angular-dropdown>` | ← `<p-dropdown>` |
| `<falcon-angular-table>` (role=grid, lazy mode, multi-sort) | ← `<p-table>` |
| `<falcon-angular-tabs>` | ← `<p-tabView>` |
| `<falcon-angular-tooltip>` | ← `[pTooltip]` directive |
| `<falcon-angular-drawer>` | ← `<p-sidebar>` |
| `<falcon-angular-dialog>` | ← `<p-dialog>` (and now itself deprecated for the popup case) |

## 3. Token sharing (multiple components reading the same token family)

### Status / severity palette (shared by status-badge, tag, badge)
- `--color-falcon-green-{50,100,500,700}` — success
- `--color-falcon-red-{50,100,500,700,900}` — danger
- `--color-falcon-amber-{50,500,700}` — warning
- `--color-falcon-blue-500` — info
- `--color-falcon-neutral-{75,150,500,700,900}` — secondary / contrast
- The 9-severity → 4-visual-bucket mapping in `<falcon-status-badge>` is the exemplary "semantic vocabulary on inputs, visual decisions in tokens" pattern.

### Focus halo palette (shared by input family + button + dropdown + multi-select + combobox + stepper + calendar + table)
- `--shadow-falcon-focus` — `0 0 0 3px rgba(13, 63, 68, 0.12)` (teal-alpha-12)
- `--shadow-falcon-focus-strong` — stronger ring
- `--shadow-falcon-danger-focus` — red ring for error state

### Teal alpha cascade (shared dark-mode auto-invert pattern)
- `--color-falcon-teal-alpha-{04,06,08,12,18}` — dark-aware (light: rgba(13,63,68,…); dark: rgba(105,142,146,…))
- 178 lines of per-component dark overrides exist because some component tokens hardcode `rgba(13, 63, 68, …)` literal instead of cascading through the alpha series — flagged as UP-06.

### Sidebar/topbar/rail layout tokens (shared by host-shell layout chrome)
- `--spacing-sidebar` (224px), `--spacing-sidebar-collapsed` (68px), `--spacing-topbar` (72px), `--spacing-rail` (18px), `--spacing-clients` (272px)
- These are consumed by host-shell `LayoutComponent` + admin/management feature shells.

### Tree-row layout tokens (shared by `<falcon-angular-tree>`, `<falcon-angular-tree-table>`, `<falcon-tree-panel>`, `<falcon-organization-hierarchy-tree-tw>`)
- `--spacing-row-h` (36px), `--spacing-row-gap` (6px), `--spacing-row-pad-x` (10px), `--spacing-row-pad-y` (6px)
- `--background-image-falcon-rail-on-path` + `--background-image-falcon-rail-default` — vertical connector lines

### Stepper-circle sizes (shared by stepper + wizard)
- `--falcon-size-stepper-circle-{sm,md,lg}` = 16 / 18 / 20 px
- Plus 11 Studio knobs: `--falcon-stepper-step-{shape,radius,rotate,size-1..5,label-position,label-visible,animation-enabled}`

### Control sizing (shared by every form-control wrapper + buttons + tags + badges)
- `--falcon-size-control-{sm,md,lg}` = 28 / 34 / 38 px
- `--falcon-size-icon-{xs,sm,md,lg}` = 12 / 14 / 16 / 24 px
- Density layer flips these via `[data-density='compact']` for ~20% tighter UI.

### Z-index stacking (shared by all overlays)
- `--z-falcon-{dropdown,sticky,fixed,overlay,modal,popover,tooltip}` = 1000 / 1020 / 1030 / 1040 / 1050 / 1060 / 1070
- Strictly ordered — tooltips on top, dropdowns at the bottom of the overlay stack.

## 4. Directive / behavior sharing

### `FalconDataTableCellDirective` — only Strategy E exemplar
- Source: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table-cell.directive.ts`
- Should be replicated for `<falcon-angular-tree-table>` (UC-P1-01) and `<falcon-angular-tree>` (UC-W01).
- Pattern: `@Directive({ selector: '[falconDataTableCell]' })` + `@ContentChildren` collection in parent + Stencil mount-point emission via `falcon-cells-mounted` event.

### `FalconTabActionsDirective` — fragile MutationObserver lift
- Source: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tabs/falcon-tab-actions.directive.ts`
- Uses MutationObserver to physically move per-tab action templates into the Stencil tablist row.
- Largest fragility in scope — UP-3-01 replaces it with a real `<slot name="header-end">`.

### `falconChevronRotateForCollapsed` / `falconScrollChevronOverlapFix` (legacy)
- Source: `libs/falcon/src/shared-ui/lib/directives/index.ts`
- Used by sidebar chevron + tree-panel auto-scroll.
- 11 of 12 shared directives are clean validators / mutators (READY).
- 1 directive needs major upgrade: `FalconFormValidateDirective` (inline styles, PrimeNG selectors, console.log) — UC-D01.

### `FalconCheckExistsDirective` (async existence validator)
- Used in wizards for username / email uniqueness checks.
- Needs `aria-busy` wiring during async check — flagged.

### Standalone form validators
- `FalconPhoneMaskDirective`, `FalconAlphabeticOnlyDirective`, `FalconNumericOnlyDirective`, `FalconNoSpacesDirective`, etc.
- READY — used across wizard inputs without refactoring.

## 5. Service relationships

### `FalconMessageService` (Angular, PrimeNG-compat) ↔ `<falcon-angular-message-host>` ↔ `<falcon-angular-toast>`
- Source: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-message-service/falcon-message-service.ts`
- Drop-in for `MessageService` + `<p-messages>` API.
- Long-term migration: `FalconMessageService.add()` → forward to `FalconNotificationService.push()` (UP-3-19).

### `FalconNotificationService` (signal-based modern) ↔ `<falcon-angular-notification-stack>` ↔ `<falcon-angular-notification>`
- Source: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-notification.service.ts`
- Signal-based push API. Preferred for all new code.

### `RemoteRouteService` (host-shell) ↔ `JsonFileRemoteManifestProvider` / `ApiRemoteManifestProvider`
- Source: `apps/host-shell/src/app/core/services/remote-route.service.ts`
- Wave 8 pluggable abstraction — `REMOTE_MANIFEST_PROVIDER` token.
- Dead-code sibling at `apps/host-shell/src/app/remote-route.service.ts` should be deleted (Agent 6 finding).

### `PrimeNGThemeService` (vestigial name) — handles theme + RTL `<html>` class sync
- Source: `apps/host-shell/src/app/core/services/prime-ng-theme.service.ts`
- Memory flag: rename to `ThemeRtlSyncService` (Agent 6 finding #6).

### `HostAuthFacade` / `HostThemeFacade` / `HostLanguageFacade` / `HostNotifierFacade` / `HostContextFacade`
- Registered at host-shell composition root via `provideFalconFacades({ ... })`.
- Remotes register `provideFalconFallbackFacades()` for standalone-dev mode.
- All auth flows go through `auth-api.service.ts` → Identity Gateway. **NEVER directly to Zitadel.**

## 6. Legacy bespoke composition routes (current production reality)

### Add-Client / Add-User wizard flow (admin-console + management-console)
```
<falcon-stepper [steps]="steps" [currentStep]="step()">  (legacy bespoke)
  <falcon-step *falconStep="0; label: 'Client Info'">
    <client-information-step />
  </falcon-step>
  <falcon-step *falconStep="1; label: 'Account Owner'">
    <client-account-owner-step />
  </falcon-step>
  ...
  <ng-template falconStepperFooter let-state>
    <button (click)="back()">Back</button>
    <button (click)="next()">Next</button>
  </ng-template>
</falcon-stepper>
```

Inside each step component:
```
<falcon-form-field [label]="'Username'" [errorKey]="...">  (legacy bespoke)
  <falcon-angular-input formControlName="username" />
</falcon-form-field>

<falcon-mobile-number formControlName="mobile" />  (legacy facade → phone-field)

<falcon-photo-uploader [(file)]="avatar" />  (legacy bespoke)
```

### Organization-hierarchy menu page
```
<falcon-tree-panel [nodes]="nodes" [actions]="actions">  (legacy bespoke)
  <falcon-tree-node *for="let node of nodes; let depth = depth">
    ...
  </falcon-tree-node>
</falcon-tree-panel>
```

### Target end-state (post-migration)
```
<falcon-angular-wizard
  [steps]="steps"
  [stepControls]="formGroups"
  [(currentStep)]="step"
  (falconWizardFinish)="onFinish()"
  (falconWizardCancel)="onCancel()">

  <div slot="step-0">
    <falcon-angular-input label="Username" formControlName="username" errorMessage="..." />
    <falcon-angular-phone-field formControlName="mobile" />
    <falcon-angular-single-uploader previewMode="thumbnail" [(file)]="avatar" />
  </div>
  ...
</falcon-angular-wizard>

<falcon-angular-tree [nodes]="nodes" [hasRowActions]="true">
  <ng-template falconTreeRow let-node>
    ...rich row content...
  </ng-template>
  <ng-template falconTreeActions let-node>
    <falcon-angular-menu [items]="getMenuItems(node)" />
  </ng-template>
</falcon-angular-tree>
```

## 7. Cross-cutting deletion paths

Once UC-W02 + UC-L01 / 02 / 03 / 04 / 05 + UC-W03 land:

- Delete `libs/falcon/src/shared-ui/lib/components/falcon-stepper/` (legacy bespoke + FalconStepDirective + FalconStepperFooterDirective).
- Delete `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/`.
- Delete `libs/falcon/src/shared-ui/lib/components/falcon-multiselect/` (zero consumers verified).
- Delete `libs/falcon/src/shared-ui/lib/components/falcon-calendar/`.
- Delete `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/`.
- Delete `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/`.
- Eventually: delete `libs/falcon/src/shared-ui/lib/components/falcon-form-field/` (after UC-W05 promotion OR U13 migrate consumers).
- Eventually: delete `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/` (after UC-W01 + UC-TP07 convergence).
- Eventually: deprecate `<falcon-angular-toast>` + `<falcon-angular-dialog>` (kept as substrate while migration adapter lands — UP-3-19).

---

## 8. `<falcon-angular-data-table>` integrates `<falcon-empty-data>` via `[emptyData]` shorthand (Wave 19 / 16th iter, 2026-05-14)

*** Added 2026-05-14 — Strategy v1.0 run `2026-05-14_falcon-empty-data` — Author: Adnan (auto) ***

### `<falcon-angular-data-table>` auto-mounts `<falcon-empty-data>` when `data.length === 0`
- Source (host): `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts` (672 LOC + new emptyData logic)
- Source (mount target): `libs/falcon-ui-core/src/angular-wrapper/components/falcon-empty-data/`
- New input on the data-table: `@Input() emptyData?: FalconEmptyDataConfig`
- New output on the data-table: `@Output() emptyDataAction = new EventEmitter<void>()`
- Auto-mount precedence in `syncEmptyView()`:
  - **Path 1 (precedence)** — `*falconDataTableEmpty` template projected → render that template
  - **Path 2** — `[emptyData]` config provided + no template → dynamically `createComponent(FalconEmptyDataComponent)`, attach to `ApplicationRef`, mount root into Stencil's empty `<td>`
  - **Path 3 (fallback)** — plain `emptyMessage` text
- Chrome management (private methods): `applyEmptyDataChrome(td)` hides `<thead>` via inline `style.display='none'` and zeros `--falcon-data-table-empty-padding-{y,x}` so the themed card sits flush; `restoreEmptyDataChrome()` reverses both on path switches / data return.
- Instance reuse: component instance is kept across re-renders; `ngOnChanges` patches inputs when the `emptyData` config object reference changes (live-tweak surfaces like the showcase).
- Layering rule (`[BRAIN-SK]` BUG-2026-05-14-011): `<falcon-empty-data>` lives in `@falcon/ui-core/angular`, NOT `@falcon/shared-ui`, because the data-table (same layer) imports it. Reverse import would cycle.

### Family of three tags
| Tag | Render path | When to use |
|---|---|---|
| `<falcon-empty-data>` | Wrapper — picks via `[useTailwind]` (default `true`) | Default consumer-facing tag |
| `<falcon-empty-data-tw>` | Tailwind Light-DOM | Token-driven theming with `<falcon-studio>` |
| `<falcon-angular-empty-data>` | Shadow DOM (scoped CSS in `styles:` array) | When external style isolation matters |

### Visual contract (provenance)
- Source-of-truth HTML: `Source_of_truth_theme/HTML/Empty Table.html` (extracted from JS bundle `2_0a3fb89d…js` → React `EmptyState` component)
- Token contract: `libs/falcon-ui-tokens/src/components/empty-data.tokens.css` (~35 CSS vars; registered in `libs/falcon-ui-tokens/src/index.css`)
- Zero hardcoded literals in either render path — every color / size / spacing resolves via `color-mix()` from Falcon brand tokens

### Replaces / supersedes (within data-table empty-state lineage)
| Modern (READY) | Replaces |
|---|---|
| `<falcon-empty-data>` mounted via `[emptyData]` | ← `<falcon-angular-data-table [emptyMessage]>` plain-text fallback |
| `<falcon-empty-data>` (canonical) | ← Earlier pre-Wave-19 attempts at empty-state cards inside shared-ui (10th–12th iter, deleted) |

### Adopters
- `apps/admin-console/.../organization-hierarchy-page/org-hierarchy-page-menu.component.html` — users table now binds `[emptyData]="usersEmptyDataConfig()"` + `(emptyDataAction)="state.onHeaderAddUser()"`; the config is a `computed` signal that re-translates on i18n `langTick` change.

---

_Last updated: 2026-05-14 — Strategy v1.0 — Run: 2026-05-14_falcon-empty-data — Author: Adnan (auto)_
