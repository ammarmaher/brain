# Agent 4 — UPGRADE_CANDIDATES (Workflow / Feature / Organization)

Concrete reusable-upgrade backlog identified across the workflow components. Cross-component proposals at the top; per-component items follow.

---

## CROSS-COMPONENT upgrades (highest impact)

### UC-W01 — Per-row template / per-row action slot on `<falcon-angular-tree>`
- **Motivation:** `<falcon-tree-panel>` exists as a parallel implementation because `<falcon-angular-tree>` has no row template / action slot. Convergence eliminates the duplication.
- **Scope:** `<falcon-angular-tree>` (Stencil Shadow + Light + Angular wrapper). Knock-on impact: `<falcon-tree-panel>` becomes a thin chrome shell that composes `<falcon-angular-tree>`.
- **Proposed API:**
  ```ts
  // Stencil slots
  <slot name="row-{id}" />        // overrides the entire row rendering for that id
  <slot name="actions-{id}" />    // overrides only the trailing action area
  <slot name="row-default" />     // overrides the row template for ALL rows; ng-template provides {node, depth, state} context

  // Angular wrapper
  @Directive({ selector: '[falconTreeRow]' })
  export class FalconTreeRowDirective {
    @Input('falconTreeRow') id?: string | number;  // omit for default
    readonly tpl = inject(TemplateRef);
  }
  @Directive({ selector: '[falconTreeActions]' })
  export class FalconTreeActionsDirective {
    @Input('falconTreeActions') id?: string | number;
    readonly tpl = inject(TemplateRef);
  }
  ```
- **Risk:** medium. Stencil slot system needs to thread per-node IDs into slot names — verify Stencil supports dynamic slot names (it does, since the host element renders Light-DOM children).
- **Priority:** P0 (blocks tree-panel convergence).

### UC-W02 — Migrate org-hierarchy wizards to `<falcon-angular-wizard>`
- **Motivation:** Production validation of `<falcon-angular-stepper>` + `<falcon-angular-wizard>` — the only meaningful use case. Eliminates 4 legacy bespoke stepper consumers.
- **Scope:**
  - `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/`
  - `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-user-wizard/`
  - `apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/add-client-wizard/`
  - `apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/add-user-wizard/`
  - Knock-on: `react-add-client-wizard.component.ts` and `react-add-user-wizard.component.ts` (admin-console) — both delegate to the org-hierarchy AddClientWizardComponent, so the migration ripples automatically.
- **Proposed API:** see `falcon-wizard/USAGE.md` for the canonical `stepControls` pattern.
- **Risk:** high. Each wizard has 3-5 form-heavy step bodies. Migration must remap:
  - `[(currentStep)]` (1-indexed) → `[(currentStep)]` (0-indexed).
  - `<falcon-step label="…"><ng-template>…</ng-template></falcon-step>` → `step.label` + `<div slot="step-{i}">…</div>`.
  - `<ng-template falconStepperFooter>` → wizard footer (Next/Back/Finish/Draft) + `slot="footer-extra"` for additions.
  - `[valid]` driving signal → `[stepControls]` array of FormGroups.
- **Priority:** P0 (largest production rollout opportunity).

### UC-W03 — Add `<falcon-angular-popup variant="custom">` slot-friendly variant
- **Motivation:** Unblocks deletion of `send-credentials-popup` bespoke. Also future-proofs OTP / confirm / save / unsaved flows that need rich body content.
- **Scope:** `<falcon-angular-popup>` (Agent 3's territory) — Agent 4 flags the need.
- **Proposed API:**
  ```html
  <falcon-angular-popup variant="custom" [open]="visible">
    <h3>{{ title }}</h3>
    <ng-content></ng-content>  <!-- body -->
    <button slot="footer">{{ confirmLabel }}</button>
  </falcon-angular-popup>
  ```
- **Risk:** low. Purely additive variant.
- **Priority:** P1 (depends on Agent 3 ownership).

### UC-W04 — Replace PrimeIcons residuals + delete legacy SCSS files
- **Motivation:** Close the Wave PR-8 cleanup loop. Currently 4 Stencil files have `<i class="pi …">` and 7+ legacy components have `.component.scss` violating the "no SCSS" rule.
- **Scope:**
  - PrimeIcons swap: `falcon-uploader.tsx:319, 361`, `falcon-single-uploader.tsx:235, 313`.
  - SCSS deletions during migrations: `falcon-stepper.component.scss` (legacy), `falcon-photo-uploader.component.scss`, `falcon-mobile-number.component.scss`, `falcon-multiselect.component.scss`, `falcon-tree-panel.component.scss`, `falcon-tree-node.component.scss`, `falcon-form-field.component.scss`, `send-credentials-popup.component.scss`.
- **Proposed:**
  - PrimeIcons → `<i class="falcon-icon falcon-icon-cloud-upload" />` etc. from the vendored Falcon icon font.
  - SCSS deletions paired with each component migration.
- **Risk:** low (icon swap) / medium (SCSS deletion paired with migration).
- **Priority:** P0 (Wave PR-8 hygiene).

### UC-W05 — Promote `<falcon-form-field>` to Falcon UI core
- **Motivation:** Used in many wizard steps. Currently a bespoke SCSS-driven component with double-painting issues. Promotion gets it a full token contract and dual-render path.
- **Scope:** new `<falcon-angular-form-field>` component in `libs/falcon-ui-core/`. Migrate existing consumers.
- **Proposed API:**
  ```ts
  @Component({ selector: 'falcon-angular-form-field', … })
  export class FalconAngularFormFieldComponent {
    @Input() label?: string;
    @Input() labelText?: string;        // i18n bypass
    @Input() inputId?: string;          // auto-link <label for=…>
    @Input() required = false;
    @Input() hint?: string;
    @Input() errorMessage?: string;     // direct
    @Input() errorKey?: string;
    @Input() errorParams?: Record<string, string | number>;
    @Input() showHintOnError = false;
    @Input() tooltipKey?: string;
    @Input() invalid?: boolean | null;  // explicit override
    @Input() disabled = false;
  }
  ```
- **Risk:** medium — migrating ~20+ wizard step templates.
- **Priority:** P1.

---

## PER-COMPONENT upgrades

### `<falcon-angular-stepper>`
- **UC-S01 (P1):** Per-step `<slot name="dot-{value}">` + `<slot name="label-{value}">` + Angular directives.
- **UC-S02 (P2):** `canAdvance?: (current, next) => boolean | Promise<boolean>` Prop + `falcon-blocked` event.
- **UC-S03 (P2):** Inline per-step error message rendering (today only the dot turns red).
- **UC-S04 (P2):** Align `labelPosition` default between Shadow and Light DOM.
- **UC-S05 (P2):** Add `aria-orientation` on the outer `<div role="group">`.
- **UC-S06 (P3):** `density: 'comfortable' | 'compact'` Prop.
- **UC-S07 (P3):** Honor `prefers-reduced-motion` for the pulse animation.
- **UC-S08 (P3):** Dark-mode token overrides in `falcon-tailwind-tokens.css`.

### `<falcon-angular-wizard>`
- **UC-Z01 (P0):** Visualize `step.status` via embedded stepper's `completedValues` + per-step error.
- **UC-Z02 (P1):** `Skip` button for optional steps + `(falconWizardSkip)` Output.
- **UC-Z03 (P1):** Per-step `slot="header-{index}"`.
- **UC-Z04 (P2):** `disabled?: boolean` + `busy?: boolean` overall flags.
- **UC-Z05 (P2):** `reset()` Method.
- **UC-Z06 (P2):** Async-validator awaiting in `stepControls` bridge.
- **UC-Z07 (P3):** `lazyStepBodies?: boolean` Input.

### `<falcon-angular-uploader>`
- **UC-U01 (P0):** Built-in validation (`enableNativeValidation` Input).
- **UC-U02 (P1):** Retry button + `(fileRetry)` Output for error rows.
- **UC-U03 (P1):** Per-file custom template / Angular `*falconUploaderItem` directive.
- **UC-U04 (P1):** `dragAnywhere?: boolean` Input.
- **UC-U05 (P2):** `displayMode?: 'list' | 'grid'` Input.
- **UC-U06 (P3):** `statusLabels?: { queued, uploading, success, error }` Input (i18n).
- **UC-U07 (P3):** `showProgressText?: boolean` Input.

### `<falcon-angular-single-uploader>`
- **UC-SU01 (P1):** `editOpensPicker?: boolean` Input OR `(beforeEdit)` cancellable Output.
- **UC-SU02 (P1):** Replace overlay in filled state on drag-over.
- **UC-SU03 (P1):** `showFileMeta?: boolean` overlay for thumbnail mode.
- **UC-SU04 (P2):** Retry button + `(fileRetry)` Output.
- **UC-SU05 (P2):** Conditional render of compact body block (DOM cleanup).
- **UC-SU06 (P2):** `loading?: boolean` Input + spinner overlay.

### `<falcon-angular-tree>`
- **UC-T01 (covered above via UC-W01):** Per-row template + action slot.
- **UC-T02 (P1):** Virtualization (`virtualScroll?: boolean` Input + @angular/cdk integration).
- **UC-T03 (P1):** Lazy children loader (`loadChildren?: (parentId) => Promise<FalconTreeNode[]>` Input).
- **UC-T04 (P1):** Drag-and-drop (`enableDragDrop?: boolean` + `(falcon-drop)` Output).
- **UC-T05 (P1):** Multi-mode cascading select (`selectMode?: 'self-only' | 'cascading'`).
- **UC-T06 (P2):** Custom search predicate (`searchPredicate?: (node, query) => boolean`).
- **UC-T07 (P3):** `*` keyboard chord for `expandAll()`.

### `<falcon-tree-panel>` (legacy)
- **UC-TP01 (P1):** `FalconTreeAction.disabled?: (node) => boolean`.
- **UC-TP02 (P1):** `FalconTreeAction.variant?: 'default' | 'highlighted' | 'destructive' | 'warning'`.
- **UC-TP03 (P1):** Keyboard activation for 3-dot trigger (`Alt+F10`).
- **UC-TP04 (P2):** `selectionMode?: 'none' | 'single' | 'multi'`.
- **UC-TP05 (P2):** `<ng-content select="[slot=root-row]">` for custom root visual.
- **UC-TP06 (P2):** `<ng-content select="[slot=section-label]">`.
- **UC-TP07 (PLAN):** Eventual convergence with `<falcon-angular-tree>` per UC-W01.

### Legacy components — migration plan
- **UC-L01:** Migrate `<falcon-mobile-number>` consumers (if any) to `<falcon-angular-phone-field>` directly. Delete folder.
- **UC-L02:** Delete `<falcon-multiselect>` folder (zero consumers).
- **UC-L03:** Migrate `<falcon-calendar>` consumers (if any) to `<falcon-angular-date-picker>` directly. Delete folder.
- **UC-L04:** Migrate `<falcon-photo-uploader>` consumers to `<falcon-angular-single-uploader>` with `--falcon-single-uploader-tile-radius: 50%`. Delete folder.
- **UC-L05:** Migrate `<falcon-send-credentials-popup>` to `<falcon-angular-popup variant="custom">` (depends on UC-W03).
- **UC-L06:** Decide `<falcon-form-field>` future (promote per UC-W05 OR deprecate in favor of per-input labels).

### Shared directives
- **UC-D01 (P0):** Refactor `FalconFormValidateDirective` — drop PrimeNG selectors + inline styles + console.log. Define `.falcon-error`, `.falcon-required`, `.falcon-control-invalid`, `.falcon-label-invalid` in theme CSS.
- **UC-D02 (P0):** Decide `FalconEffectiveDateDirective` — re-implement on `<falcon-angular-date-picker>` OR delete.
- **UC-D03 (P3):** Add `errorKey?: string` Input to every validator directive.
- **UC-D04 (P3):** Add `format?: string` Input to `FalconPhoneMaskDirective` for non-Saudi phone formats.
- **UC-D05 (P3):** Service-level cache option for `FalconCheckExistsDirective` (cross-component reuse).
- **UC-D06 (P1):** Auto-link `aria-describedby` + set `aria-invalid="true"` in `FalconFormValidateDirective`.

---

## Priority summary
- **P0 (blocks correct usage):** UC-W01, UC-W02, UC-W04, UC-Z01, UC-U01, UC-D01, UC-D02.
- **P1 (frequent need):** UC-W03, UC-W05, UC-S01, UC-Z02/Z03/Z06, UC-U02/U03/U04, UC-SU01/SU02/SU03, UC-T02/T03/T04/T05, UC-TP01/TP02/TP03.
- **P2 (improvement):** rest.
- **P3 (polish):** dark-mode tokens, density support, prefers-reduced-motion, custom error keys.
