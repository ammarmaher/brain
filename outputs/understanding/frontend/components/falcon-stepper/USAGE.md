# falcon-stepper — USAGE

## Real usage in active codebase

### Example 1 — flagship: rail-only stepper + external panels (Add Client wizard)
`[CODE]` `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html:54-72`:
```html
<div class="pt-2 shrink-0">
  <falcon-angular-stepper
    [steps]="stepperSteps()"
    [activeValue]="stepperActiveValue()"
    [completedValues]="stepperCompletedValues()"
    [forwardLockedFrom]="forwardLockedFrom()"
    mode="linear"
    orientation="horizontal"
    size="md"
    labelPosition="bottom-center"
    [showStepNumbers]="false"
    [showCheckOnComplete]="true"
    (valueChange)="onStepperValueChange($event)"
    (navigationBlocked)="onNavigationBlocked($event)" />
</div>
<!-- *** Panels — rendered OUTSIDE the rail (the wrapper is rail-only by design). *** -->
<!-- *** Only one step component is mounted at a time (the viewChild refs in .ts -->
<!-- *** key off it for revealErrors()). *** -->
<div class="flex-1 min-h-0 overflow-y-auto p-6"> … @switch panels … </div>
```
This is the canonical live pattern: stepper = rail only; the wizard mounts the active step's panel beneath it via `@switch`, and `[forwardLockedFrom]` gates forward navigation while the current step is invalid. `(navigationBlocked)` triggers `revealErrors()` on the offending step.

### Example 2 — Templates wizard (same pattern, both consoles)
`[CODE]` `apps/management-console/.../templates-page/components/templates-wizard/templates-wizard.component.html:93` ("rail only + @switch panels — mirrors Hierarchy add-user-wizard") — identical input set: `[steps]`, `[activeValue]`, `[completedValues]`, `[forwardLockedFrom]`, `mode="linear"`, `labelPosition="bottom-center"`, `(valueChange)`, `(navigationBlocked)`.

### Example 3 — Add User wizard (admin + management)
`[CODE]` `apps/{admin,management}-console/.../org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html` — same shape; the `add-user-wizard.component.ts` imports `FalconAngularStepperComponent` from `@falcon` / `@falcon/ui-core`.

> NOTE: the prior dossier said wizards still ran on the LEGACY bespoke stepper. That is STALE — legacy deleted 2026-05-17; all consumers are now `<falcon-angular-stepper>`.

## Recommended NEW usage

### Basic linear stepper with horizontal layout
```ts
protected readonly steps: FalconStepperStep[] = [
  { value: 'info',     label: 'Account Info'  },
  { value: 'settings', label: 'Settings'      },
  { value: 'channels', label: 'Communication' },
];
protected readonly active = signal<string>('info');
protected readonly completed = signal<readonly string[]>([]);
```
```html
<falcon-angular-stepper
  [steps]="steps"
  [activeValue]="active()"
  [completedValues]="completed()"
  mode="linear"
  orientation="horizontal"
  size="md"
  labelPosition="bottom-center"
  (valueChange)="active.set($any($event))"
  (stepComplete)="onWizardFinish()">
  <div slot="content-info">…step 1…</div>
  <div slot="content-settings">…step 2…</div>
  <div slot="content-channels">…step 3…</div>
</falcon-angular-stepper>
```

### Forward-validity gate (the live pattern)
```ts
// when the current step's FormGroup is invalid, lock forward nav from it
protected readonly forwardLockedFrom = computed<(string|number)[]>(() =>
  this.currentStepValid() ? [] : [this.active()]);
```
```html
<falcon-angular-stepper
  [steps]="steps" [activeValue]="active()" [completedValues]="completed()"
  [forwardLockedFrom]="forwardLockedFrom()"
  (valueChange)="active.set($any($event))"
  (navigationBlocked)="revealErrorsFor($event.attemptedValue)" />
```

### Reactive Forms / ngModel binding (CVA)
```html
<falcon-angular-stepper [steps]="steps" [completedValues]="completed()" formControlName="step" />
<falcon-angular-stepper [steps]="steps" [(ngModel)]="active" [completedValues]="completed()" />
```

### Vertical layout with inline per-step content
```html
<falcon-angular-stepper [steps]="steps" [(activeValue)]="active" orientation="vertical" size="lg">
  <div slot="content-info">…</div>
  <div slot="content-settings">…</div>
</falcon-angular-stepper>
```

### Per-instance token override
```html
<falcon-angular-stepper class="add-client-stepper" [steps]="steps" [(activeValue)]="active" />
```
```css
/* anywhere Tailwind can scan — DO NOT use SCSS in a component */
:where(.add-client-stepper) {
  --falcon-stepper-circle-bg-active: var(--color-falcon-teal-600, #095a61);
  --falcon-stepper-circle-shadow-active: 0 0 0 6px rgba(13,63,68,0.15);
  --falcon-stepper-label-color-active: var(--color-falcon-teal-600, #095a61);
}
```
Same convention as `<falcon-angular-input class="add-client-special-input">` (client-information-step.component.html).

## Render-mode guidance
- **Default (`useTailwind=true`)** for any consumer inside the apps' Tailwind v4 scanner — Light DOM lets the consumer's utilities cascade and lets `@source inline(...)` safelist runtime-built class strings. **Every live consumer uses this.**
- **`useTailwind=false`** (Shadow) only when embedded in a foreign host outside Falcon Tailwind reach, or when hard style isolation is required.

## Tailwind-only usage
- ALL visual extensions live in tokens (`--falcon-stepper-*`) or Tailwind utilities via `class=` / `rootClass=` on the wrapper. NEVER add a `*.component.scss` with rules — the wrapper CSS is `:host{display:block}` only.

## Import requirements
- Standalone consumer imports `FalconAngularStepperComponent` in `imports: []`.
- `CUSTOM_ELEMENTS_SCHEMA` NOT needed (the wrapper owns it — `[CODE]` ts:63).
- `ngOnInit()` calls `defineFalconTwComponent('falcon-stepper')` automatically to register both tags.

## Bad usage to avoid
- DO NOT mutate `el.steps` directly from the consumer; pass through `[steps]`.
- DO NOT use `*ngFor` for `slot="content-{value}"` projections; named slots must be top-level direct children (Stencil constraint). Use `@for` only to build the panels host content if needed, but each slot node stays direct.
- DO NOT use `<p-stepper>` / `<p-step>` anywhere — PrimeNG is uninstalled.
- DO NOT target the deleted legacy bespoke stepper — it no longer exists (`falcon-stepper-legacy/`).
- DO NOT pass duplicate `value` entries in `steps[]`.
- DO NOT treat `(stepClick)` as "navigation happened" — it fires even on a blocked click; listen to `(valueChange)`.
- DO NOT bind both `[value]`-style raw passthrough and `[(activeValue)]`.

## Do / Don't
| Do | Don't |
|---|---|
| Use `mode="linear"` for ordered/validated flows. | Use `non-linear` when later steps consume earlier data. |
| Gate forward nav via `[forwardLockedFrom]` + `(navigationBlocked)`. | Hand-roll a click-interception gate. |
| Surface top-level message via `helperText`/`errorMessage`. | Add sibling message elements. |
| Mount panels externally (rail-only stepper). | Expect the stepper to render Next/Back. |
| Override tokens via host class. | Hardcode hex/px or paint custom dot CSS. |
| Set `step.optional = true` for the Optional tag. | Append "(optional)" to the label string. |

## Consumer Sweep (2026-06-03)
`[CODE]` grep `<falcon-angular-stepper` across `apps/` → **21 occurrences / 13 files** (HTML render + TS imports). Enumerated:
- `apps/admin-console/.../org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.{html (1), ts (2)}`
- `apps/{admin,management}-console/.../org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.{html (2), ts (2)}`
- `apps/{admin,management}-console/.../templates-page/components/templates-wizard/templates-wizard.component.{html (2), ts (1)}`
- `apps/admin-console/.../contracts-cost-management/components/contracts-add-wizard/contracts-add-wizard.component.html (2)`
- `apps/management-console/.../contact-groups/create-contact-group/create-contact-group.component.{html (1), ts (1)}`

> `[INFERRED]` count rose from the prior "5" sweep because (a) the legacy→Stencil migration completed across both consoles, and (b) templates / contracts / contact-groups wizards adopted the rail. The prior `playground.page.html` entry is gone (route removed).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B21). Example 1 (add-client-wizard rail-only + `[forwardLockedFrom]` + `(navigationBlocked)`) and Example 2 (templates-wizard) confirmed against live source. Consumer Sweep re-run (`<falcon-angular-stepper` → 21 occurrences / 13 files). Prior "wizards on legacy stepper" + "playground consumer" claims corrected.
