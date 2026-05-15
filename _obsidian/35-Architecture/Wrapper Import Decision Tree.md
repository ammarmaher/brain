---
type: architecture-rules
audit-source: Wrapper Import Decision Tree
rule-count: 10
created: 2026-05-15
---
*** Architecture Rule Set — Wrapper Import Decision Tree ***
*** SoT: Brain Outputs/understanding/frontend/architecture/WRAPPER_IMPORT_DECISION_TREE.md ***
*** Indexed 2026-05-15 by Brain SK Phase 3F ***

# Wrapper Import Decision Tree

> Step-by-step decision flow when writing an Angular feature. TL;DR — always `@falcon/ui-core/angular` for new code. Adds `CUSTOM_ELEMENTS_SCHEMA` when rendering Stencil tags directly. `useTailwind=true` (Light DOM) is the default render path. Per-instance customisation via host-class targeting `--falcon-<name>-*` tokens. Translations always through `translate` pipe.

## Source-of-truth file
- [WRAPPER_IMPORT_DECISION_TREE](../../outputs/understanding/frontend/architecture/WRAPPER_IMPORT_DECISION_TREE.md)

## Key rules extracted

| Rule id | Rule (one-line) | Severity | Cited file/line |
|---|---|---|---|
| AR-decide-01 | New Angular feature code MUST import Falcon Angular wrappers from `@falcon/ui-core/angular` — root barrel. | high | path alias |
| AR-decide-02 | Library-internal code MUST use `@falcon/ui-core/angular/<component>` per-component alias. | medium | path alias |
| AR-decide-03 | Legacy bespoke Angular components (form-field, stepper, photo-uploader, mobile-number, multiselect, calendar façade, tree-panel, send-credentials-popup) MUST import from `@falcon`. | high | `shared-ui/index.ts` |
| AR-decide-04 | Any Angular component rendering Stencil custom elements DIRECTLY (without going through a Falcon Angular wrapper) MUST add `schemas: [CUSTOM_ELEMENTS_SCHEMA]`. | high | Angular contract |
| AR-decide-05 | `useTailwind=true` (Light DOM) is the DEFAULT and RECOMMENDED render path. `useTailwind=false` (Shadow DOM) is reserved for Studio-mode pixel-perfect isolation. | high | wrapper `useTailwind` input |
| AR-decide-06 | Forms MUST use ReactiveForms (`[formGroup]` + `formControlName`) — `ngModel` is acceptable only for ad-hoc 1-control forms. All Falcon CVA wrappers support both. | high | Memory `feedback_clean_code_dry_minimal.md` |
| AR-decide-07 | Per-instance customisation MUST be done via host class + `:where(.host-class) { --falcon-<name>-*: ... }` in feature CSS — NEVER inline styles. | high | Memory `feedback_shadow_is_token_ssot.md` |
| AR-decide-08 | All user-facing label text MUST pipe through `translate`: `[label]="'forms.name.label' \| translate"`. | high | i18n standard |
| AR-decide-09 | Logical-property utilities MUST be used for RTL: `text-start`/`text-end` (not `text-left`/`text-right`), `ms-*`/`me-*` (not `ml-*`/`mr-*`). Inline SVGs needing horizontal mirror use `class="flip-rtl"`. | high | Memory `feedback_tailwind_grid_first.md` |

## Decision flow (summary)

```
Q1: Is the component a Falcon Angular wrapper (falcon-angular-*)?
  YES → Q2
  NO + legacy bespoke (form-field/stepper/etc.) → import from @falcon
  NO + Stencil-direct tag → add CUSTOM_ELEMENTS_SCHEMA + use tag in template
  NO + feature-internal → declare in feature folder

Q2: Which import path?
  → @falcon/ui-core/angular (root barrel) for feature code
  → @falcon/ui-core/angular/<name> for library-internal
  → @falcon (legacy re-export) ONLY if also needing other @falcon symbols AND wrapper IS re-exported

Q3: Add CUSTOM_ELEMENTS_SCHEMA?
  YES if rendering Stencil tag directly (e.g. <falcon-organization-hierarchy-tree-tw>)
  NO if going through Angular wrapper (wrapper has it internally)

Q4: useTailwind input?
  → true (default) — Light DOM, Tailwind utilities cascade
  → false — Shadow DOM, pixel-perfect isolation (Studio-mode only)

Q5: Reactive Forms or ngModel?
  → ReactiveForms for non-trivial forms
  → ngModel only for ad-hoc 1-control forms

Q6: Token override per-instance?
  → Add host class on component
  → Target via :where(.host-class) { --falcon-<name>-*: token-value }
```

## Forbidden patterns (verbatim from SoT)

| Anti-pattern | Why |
|---|---|
| `from '@angular/material'` | Material is NOT a dependency. Use Falcon. |
| `from 'primeng/<x>'` | Wave PR-8 removed PrimeNG. ESLint flat-block live-fires. |
| `<p-button>`, `<p-table>`, etc. | PrimeNG removed. |
| Direct Zitadel API calls | Frontend never calls Zitadel directly. Use AuthApiService. |
| `*ngIf` / `*ngFor` / `*ngSwitch` | Use `@if` / `@for` / `@switch`. |
| `[ngClass]` with raw hex | Inline styles forbidden. Tokens only. |
| `style="color: #fff"` | Inline styles forbidden. |
| `bg-[#f5f6f7]` Tailwind arbitrary | Tokens-first. Use `bg-falcon-neutral-50`. |
| `<falcon-input>` directly | Use `<falcon-angular-input>` to get CVA + Angular bindings. |
| Importing wrapper from `@falcon` when not re-exported | Use `@falcon/ui-core/angular`. |
| Forgetting `schemas: [CUSTOM_ELEMENTS_SCHEMA]` when rendering Stencil tag directly | Angular won't recognise the custom tag. |

## Recommended component template

```ts
@Component({
  selector: 'my-feature',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe,
    FalconAngularInputComponent,
    FalconAngularDropdownComponent,
    FalconAngularButtonComponent,
  ],
  providers: [MyFeaturePageStateService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './my-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyFeatureComponent { /* ... */ }
```

## Per-instance customisation example

```html
<falcon-angular-input class="add-client-special-input" />
```

```css
:where(.add-client-special-input) {
  --falcon-input-border-color: var(--color-falcon-teal-700);
  --falcon-input-border-width: var(--falcon-border-width-2);
  --falcon-input-radius: var(--radius-lg);
}
```

Reference: `apps/admin-console/.../client-information-step.component.html:16-17`.

## Related
- See [[Import Path Conventions]] for the path alias table.
- See [[Barrel Exports]] for which wrappers are re-exported via `@falcon` vs only via `@falcon/ui-core/angular`.
- See [[Forbidden Patterns]] for the live grep of active violations.

## Related component notes
- [[Falcon Input]] · [[Falcon Dropdown]] · [[Falcon Button]] · [[Falcon Data Table]] — primary CVA wrappers.

## Tags

#type/architecture-rules #security

## Hubs
- [[FRONTEND_INDEX]] · [[COMPONENT_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
