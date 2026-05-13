# Agent 4 — Workflow / Feature / Organization Components — SUMMARY

Agent 4 investigated the workflow / feature / org-hierarchy surface of Falcon UI: steppers, wizards, uploaders, trees, tree panels, the form-field shell, the send-credentials popup, and the shared directives barrel.

## Totals

| Metric | Count |
|---|---|
| Components investigated | 13 |
| Component folders created | 13 (1 of which covers all shared directives) |
| Total markdown files written | 78 (= 13 × 6) |
| Active / preferred components | 6 (`falcon-stepper`, `falcon-wizard`, `falcon-uploader`, `falcon-single-uploader`, `falcon-tree`, `falcon-tree-panel`) |
| Legacy-in-use components | 4 (`falcon-stepper` legacy, `falcon-photo-uploader`, `falcon-form-field`, `send-credentials-popup`) |
| Deprecated / reference-only components | 3 (`falcon-mobile-number`, `falcon-multiselect`, `falcon-calendar` façades) |
| Directives documented (under shared-directives/) | 12 |

## Components investigated

### Falcon UI core (Stencil + Angular wrapper, ACTIVE)
1. **`falcon-stepper`** — 18 px dot, 4 px teal fill, dual render path, 14-category tokens, full a11y. Status: READY visually but **NEEDS-UPGRADE** for migration (no production consumer yet; wizards still use legacy).
2. **`falcon-wizard`** — composes `<falcon-stepper>` + step-{i} slots + Next/Back/Finish/Draft footer + Reactive-Forms `stepControls` bridge. Status: READY.
3. **`falcon-uploader`** — multi-file dropzone / button / inline-list, per-file progress + status + error display. Status: READY (PrimeIcons residual flagged).
4. **`falcon-single-uploader`** — single-file with replace UX, preview tile + delete + edit overlays. Status: READY (PrimeIcons residuals flagged).
5. **`falcon-tree`** — recursive expandable, hover-path highlighting, rail SVG connectors, programmatic select+scrollIntoView. Status: NEEDS-UPGRADE (per-row template gap → parallel implementation with `<falcon-tree-panel>`).

### Legacy bespoke (LEGACY-IN-USE)
6. **`falcon-stepper` (legacy)** — Wave 3 PrimeNG-removal stepper used by org-hierarchy wizards. Status: LEGACY-IN-USE; migration target.
7. **`falcon-photo-uploader`** — Wave 23 circular avatar uploader used by Add Client / Add User wizards. Status: LEGACY-IN-USE; migration target (single-uploader + circular mask).
8. **`falcon-tree-panel`** — bespoke chrome + per-row 3-dot menus + hover-path + chevron-overlap auto-scroll. Renders ITS OWN `<falcon-tree-node>` recursive component (PARALLEL implementation). Status: LEGACY-IN-USE.
9. **`falcon-form-field`** — labeled input wrapper with required asterisk + hint + error slot. Status: LEGACY-IN-USE; could be promoted to Falcon UI core OR deprecated.
10. **`send-credentials-popup`** — credential-delivery confirmation popup; waits for `<falcon-angular-popup>` slot-friendly variant. Status: LEGACY-IN-USE.

### Legacy façades / stubs (REFERENCE-ONLY)
11. **`falcon-mobile-number`** — Wave 2 façade delegating to `<falcon-angular-phone-field>`. Status: REFERENCE-ONLY.
12. **`falcon-multiselect`** — Wave 3 stub (dual-panel UX dropped). Status: DEPRECATED.
13. **`falcon-calendar`** — Wave 3 façade delegating to `<falcon-angular-date-picker>`. Status: DEPRECATED.

### Shared directives (one folder, 12 directives)
14. **shared-directives/** — 12 standalone directives at `libs/falcon/src/shared-ui/lib/directives/`. `FalconFormValidateDirective` is heavy + needs major upgrade (inline styles, PrimeNG selectors, console.log); the 11 simpler validators / mutators are READY.

## Hotspots

### Hotspot 1 — Org-hierarchy wizards have NOT migrated to the new stepper/wizard
- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/` + `add-user-wizard/`.
- `apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/` mirrors.
- All still import `FalconStepperComponent` + `FalconStepDirective` + `FalconStepperFooterDirective` from `@falcon` (legacy bespoke), NOT `FalconAngularStepperComponent` + `FalconAngularWizardComponent` from `@falcon/ui-core/angular`.
- **This is the single largest workflow-component migration backlog item.**

### Hotspot 2 — `<falcon-tree-panel>` ↔ `<falcon-angular-tree>` parallel implementation
- The panel renders its OWN internal `<falcon-tree-node>` recursive component, not `<falcon-angular-tree>`. Two parallel code paths for the same locked-spec contract.
- Risk: visual drift over time.
- Fix: add per-row template / actions slot to `<falcon-angular-tree>`, then refactor `<falcon-tree-panel>` to compose it.

### Hotspot 3 — PrimeIcons residuals in uploader Stencil components
- `falcon-uploader.tsx:319, 361` and `falcon-single-uploader.tsx:235, 313` still use `<i class="pi pi-cloud-upload" />` and `<i class="pi pi-pencil" />`. PrimeIcons was uninstalled in Wave PR-8 — these are residuals that ESLint's flat-block likely doesn't catch in Stencil .tsx files.

### Hotspot 4 — Legacy SCSS files violate "no SCSS" rule
- `falcon-stepper.component.scss` (legacy), `falcon-photo-uploader.component.scss`, `falcon-mobile-number.component.scss`, `falcon-multiselect.component.scss`, `falcon-tree-panel.component.scss`, `falcon-tree-node.component.scss`, `falcon-form-field.component.scss`, `send-credentials-popup.component.scss` — all violate the standard.

### Hotspot 5 — `FalconFormValidateDirective` is heavy + outdated
- Inline styles (color, font-size, padding, margin) violate `feedback_no_inline_styles_tokens_only.md` (hardened 2026-05-05).
- Targets PrimeNG selectors (`.p-dropdown` etc.) that no longer exist after Wave PR-8.
- Includes `console.log` debug statements in production code.

## Top 5 dynamic-capability findings

### 1. The active stepper's tokens are rich (14 categories ≈ 70+ vars) but the legacy stepper has ZERO tokens
- Migration would unlock per-instance Studio theming for wizards.

### 2. Both `<falcon-angular-tree>` and `<falcon-tree-panel>` have the same locked-spec visual — but only the Falcon UI core component has tokens
- Convergence (or extending `<falcon-angular-tree>` with row template/action slot) eliminates this gap.

### 3. The uploaders (`<falcon-angular-uploader>` + `<falcon-angular-single-uploader>`) DEFER validation to the consumer
- This is intentional and documented but means the consumer must implement size/mime/count checks. A flag `enableNativeValidation?: boolean` would let consumers opt into built-in checks.

### 4. `<falcon-angular-wizard>` has a Reactive-Forms validation bridge (`stepControls`) but does NOT await async validators
- Pure sync `ctrl.valid` reading misses `PENDING` state. Important for `FalconCheckExistsDirective` flows.

### 5. The org-hierarchy `mode='falcon'` vs `mode='client'` distinction in `<falcon-tree-panel>` is HARD-CODED
- A `<ng-content select="[slot=root-row]">` would allow consumer to render any root row visual without forking.

## Top 5 reusable-upgrade ideas (see UPGRADE_CANDIDATES.md for full details)

1. **Per-row template / per-row action slot on `<falcon-angular-tree>`** — unblocks convergence with `<falcon-tree-panel>`; biggest reusability win across workflow surfaces.
2. **Migrate org-hierarchy wizards to `<falcon-angular-wizard>`** — single largest production rollout of the new wizard component; de-risks the new stepper.
3. **Add slot-friendly `<falcon-angular-popup variant="custom">`** — unblocks deletion of `send-credentials-popup` bespoke and any future credential / OTP / confirm popups.
4. **Replace PrimeIcons residuals in uploader Stencil components + delete SCSS files across legacy components** — closes the Wave PR-8 cleanup loop.
5. **Promote `<falcon-form-field>` to Falcon UI core (`<falcon-angular-form-field>`)** with a token contract + label/for auto-link + hint+error coexistence + tooltip slot.
