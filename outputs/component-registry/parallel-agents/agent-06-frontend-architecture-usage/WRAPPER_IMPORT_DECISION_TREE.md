# Wrapper Import Decision Tree

> *"I am writing an Angular feature. Which wrapper do I import and from where?"*

---

## Step 1 — Is the component a Falcon Angular wrapper (`falcon-angular-*`)?

YES → step 2.

NO — Is it a Falcon legacy bespoke Angular component (e.g. `<falcon-form-field>`, `<falcon-stepper>`, `<falcon-photo-uploader>`)?
  → import from `@falcon`.

NO — Is it a Stencil tag used directly (e.g. `<falcon-organization-hierarchy-tree-tw>`)?
  → no Angular wrapper exists. Add `CUSTOM_ELEMENTS_SCHEMA` to the component, use the tag in template, import types from `@falcon/ui-core/angular` if needed.

NO — Is it a feature-internal Angular component?
  → declare in the same feature folder under `components/`.

---

## Step 2 — Which import path?

**TL;DR:** always `@falcon/ui-core/angular` for new code.

### The lookup order (most-direct first)

1. `@falcon/ui-core/angular/<component-folder-name>` — direct per-component alias. Smallest barrel impact. Use this in `libs/` internal code.
2. `@falcon/ui-core/angular` — root barrel. Use this in app feature code. Idiomatic.
3. `@falcon` — legacy re-export path. Works for many components but NOT ALL (~14 wrappers are NOT re-exported through `@falcon`). Use this only when you specifically need other `@falcon` symbols in the same file (TranslateService, SessionProvider, validators, etc.) AND the wrapper is in the re-export list.

### Wrappers NOT re-exported via `@falcon`

(must come from `@falcon/ui-core/angular`)

- `<falcon-angular-avatar>` (`FalconAngularAvatarComponent`)
- `<falcon-angular-badge>` (`FalconAngularBadgeComponent`)
- `<falcon-angular-card>` (`FalconAngularCardComponent`)
- `<falcon-angular-status-badge>` (`FalconAngularStatusBadgeComponent`)
- `<falcon-angular-empty-state>` (`FalconAngularEmptyStateComponent`)
- `<falcon-angular-icon>` (`FalconAngularIconComponent`)
- `<falcon-angular-input-number>` (`FalconAngularInputNumberComponent`)
- `<falcon-angular-drawer>` (`FalconAngularDrawerComponent`)
- `<falcon-angular-search-input>` (`FalconAngularSearchInputComponent`)
- `<falcon-angular-grid-input>` (`FalconAngularGridInputComponent`)
- `<falcon-angular-combobox>` (`FalconAngularComboboxComponent`)
- `<falcon-angular-filter-panel>` (`FalconAngularFilterPanelComponent`)
- `<falcon-angular-menu>` (`FalconAngularMenuComponent`)
- `<falcon-angular-wizard>` (`FalconAngularWizardComponent`)
- `<falcon-angular-select>` (`FalconAngularSelectComponent`)
- `<falcon-angular-data-table>` (`FalconAngularDataTableComponent`) — types `ColumnDef`, `FalconDataTableCellDirective`, `FalconDataTableRowAction`, `FalconDataTableMenuItem` all from `@falcon/ui-core/angular`.

---

## Step 3 — Add `CUSTOM_ELEMENTS_SCHEMA`?

YES — any Angular component that renders Stencil custom elements directly in its template (without going through a Falcon Angular wrapper) MUST add `CUSTOM_ELEMENTS_SCHEMA`:

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'my-page',
  standalone: true,
  imports: [/* normal Angular imports */],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './my-page.component.html',
})
export class MyPage {}
```

The Falcon Angular wrappers internally declare `CUSTOM_ELEMENTS_SCHEMA` because they render `<falcon-input>` / `<falcon-input-tw>` directly. Consumers using a wrapper don't need to add it again unless they ALSO render a Stencil tag directly (e.g. `<falcon-organization-hierarchy-tree-tw>`).

---

## Step 4 — `useTailwind` input — Shadow or Light DOM?

Every Falcon Angular wrapper has a `useTailwind: boolean` input (default `true`):

- `useTailwind=true` → renders `<falcon-X-tw>` Light DOM tag. Consumer's Tailwind utilities cascade in. Theme-token customisation works because Tailwind `@theme` block exposes the same `--falcon-*` vars.
- `useTailwind=false` → renders `<falcon-X>` Shadow DOM tag. Style isolation. Theme tokens applied via Shadow's own `<style>` block (driven by the same token files).

**Recommended for production:** keep `useTailwind=true` (default). Shadow DOM is for legacy / Studio-mode where pixel-perfect style isolation is required.

---

## Step 5 — Form control? Use Reactive Forms or ngModel?

Every CVA-implementing wrapper supports BOTH. The Falcon Form Pattern:

```ts
// Reactive Forms (recommended for non-trivial forms)
form = inject(FormBuilder).group({
  name: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
  country: [null],
  subscribe: [false],
});
```

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <falcon-angular-input formControlName="name" [label]="'Name' | translate"></falcon-angular-input>
  <falcon-angular-email-field formControlName="email"></falcon-angular-email-field>
  <falcon-angular-dropdown formControlName="country" [options]="countryOptions"></falcon-angular-dropdown>
  <falcon-angular-checkbox formControlName="subscribe">Subscribe to newsletter</falcon-angular-checkbox>
</form>
```

```html
<!-- ngModel (acceptable for ad-hoc 1-control forms) -->
<falcon-angular-input [(ngModel)]="search" (falcon-input)="onSearchChange($event)"></falcon-angular-input>
```

Memory `feedback_clean_code_dry_minimal.md` + `feedback_folder_structure_pattern.md`: prefer Reactive Forms.

---

## Step 6 — Token override per-instance

To customise a single Falcon Angular component instance (different border, larger radius, brand colour):

```html
<!-- 1. Add a host class on the component -->
<falcon-angular-input class="add-client-special-input" />
```

```css
/* 2. In the feature's tailwind override (NOT in the wrapper itself), target the host class
   and mutate the --falcon-input-* tokens. */
:where(.add-client-special-input) {
  --falcon-input-border-color: var(--color-falcon-teal-700);
  --falcon-input-border-width: var(--falcon-border-width-2);
  --falcon-input-radius: var(--radius-lg);
}
```

This is the **only** sanctioned per-instance customisation path. Memory `feedback_shadow_is_token_ssot.md`.

**Demonstrated:** `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/client-information-step/client-information-step.component.html:16-17`.

---

## Step 7 — Slot vs template?

| Slot type | Mechanism | When to use |
|---|---|---|
| Stencil `slot="x"` (Shadow DOM) | `<falcon-angular-X><div slot="x">content</div></falcon-angular-X>` | Always works for Stencil-defined slots (header/footer/options/etc.). |
| Angular `ng-template` directive | `<falcon-angular-data-table><ng-template falconDataTableCell="status" let-row>...</ng-template></falcon-angular-data-table>` | Type-safe, Angular-native, used by data-table cell projection. |

`<falcon-angular-data-table>` uses Strategy E projection: an Angular directive `FalconDataTableCellDirective` carrying a `TemplateRef` is collected via `@ContentChildren`, then projected into the underlying Stencil `<falcon-table-tw>` cell slot. Type-safe templates with full row context.

---

## Step 8 — Translations / multi-language

```html
<!-- Always pipe label text through translate. -->
<falcon-angular-input [label]="'forms.name.label' | translate"></falcon-angular-input>
<falcon-angular-button [label]="'actions.save' | translate" severity="primary"></falcon-angular-button>
```

For dynamic options (dropdown, etc.):

```ts
this.countryOptions = this.translate.observeCollection('forms.country.options'); // Returns options translated for current language
```

Memory rule `feedback_brain_skill` + multi-language is platform-wide standard.

---

## Step 9 — RTL handling

The Falcon icon font, Stencil components, and Tailwind utilities all auto-handle RTL via:

- `<html dir="rtl">` set by `HostLanguageFacade.setLanguage('ar')`.
- Tailwind `text-start` / `text-end` (logical) instead of `text-left` / `text-right` (physical).
- Tailwind `ms-*` / `me-*` (logical margin-inline-start/end) instead of `ml-*` / `mr-*`.
- `class="flip-rtl"` on inline SVGs that need horizontal mirroring (chevrons, etc.).

Per memory `feedback_tailwind_grid_first.md` + the V0.2 theme adoption.

---

## Recommended import statement template

```ts
// apps/<app>/src/app/features/<feature>/components/<x>.component.ts

import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

// Falcon Angular wrappers — prefer /angular barrel
import {
  FalconAngularInputComponent,
  FalconAngularDropdownComponent,
  FalconAngularButtonComponent,
  FalconAngularCheckboxComponent,
  type FalconDropdownOption,
} from '@falcon/ui-core/angular';

// Cross-cutting Falcon symbols
import { TranslatePipe, TranslateService } from '@falcon';
import { FALCON_NOTIFIER } from '@falcon/sdk';

// Feature-local
import { MyFeatureService } from '../services/services';
import { MyFeaturePageStateService } from '../services/my-feature-page-state.service';

@Component({
  selector: 'my-feature',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe,
    FalconAngularInputComponent,
    FalconAngularDropdownComponent,
    FalconAngularButtonComponent,
    FalconAngularCheckboxComponent,
  ],
  providers: [MyFeaturePageStateService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './my-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyFeatureComponent { /* ... */ }
```

---

## Anti-patterns to avoid

| Anti-pattern | Why |
|---|---|
| `import { ... } from '@angular/material'` | Material is NOT in dependencies. Use Falcon. |
| `import { Button } from 'primeng/button'` | Wave PR-8 removed PrimeNG. ESLint flat-block live-fires on this. |
| `<p-button>`, `<p-table>`, etc. in templates | Same — PrimeNG removed. |
| Direct Zitadel API calls | Memory rule: frontend never calls Zitadel directly. Go through AuthApiService. |
| `*ngIf="x"` / `*ngFor="let y of z"` | Zero matches across apps. Use `@if (x)` / `@for (y of z; track y)`. |
| `[ngClass]="dynamic"` with raw hex | Inline styles forbidden. Tokens only. |
| `style="color: #fff"` | Inline styles forbidden. |
| `bg-[#f5f6f7]` Tailwind arbitrary value | Tokens-first rule. Use `bg-falcon-neutral-50`. |
| `<falcon-input>` directly in feature code without a wrapper | Use `<falcon-angular-input>` to get CVA + Angular bindings. |
| Importing wrapper from `@falcon` when it's not re-exported | Use `@falcon/ui-core/angular`. |
| Forgetting `schemas: [CUSTOM_ELEMENTS_SCHEMA]` when rendering Stencil tags directly | Angular won't recognise the custom tag. |
