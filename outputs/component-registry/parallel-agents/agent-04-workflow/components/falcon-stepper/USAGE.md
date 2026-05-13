# falcon-angular-stepper — USAGE

## Real usage in active codebase
- **`apps/host-shell/src/app/playground/playground.page.html`** — playground showcases dual render path + sizes + modes + linear/non-linear.
- The org-hierarchy wizards currently consume the LEGACY bespoke `<falcon-stepper>` from `libs/falcon/src/shared-ui/lib/components/falcon-stepper/`, NOT this new `<falcon-angular-stepper>`. See `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/add-client-wizard.component.ts:6-14` (imports `FalconStepperComponent` from `@falcon` barrel — that is the legacy bespoke one).
- Migration to `<falcon-angular-stepper>` for these wizards is the recommended next step but has NOT happened yet (see `GAPS_AND_UPGRADES.md`).

## Recommended NEW usage (no consumer in production today)

### Basic linear stepper with horizontal layout
```ts
// component.ts
protected readonly steps: FalconStepperStep[] = [
  { value: 'info',     label: 'Account Info'   },
  { value: 'settings', label: 'Settings'       },
  { value: 'channels', label: 'Communication'  },
  { value: 'apps',     label: 'Applications'   },
  { value: 'owner',    label: 'Account Owner'  },
];
protected readonly active = signal<string>('info');
protected readonly completed = signal<readonly string[]>([]);

protected onChange(detail: FalconStepperChangeDetail): void {
  this.active.set(detail.value as string);
}
```
```html
<!-- component.html -->
<falcon-angular-stepper
  [steps]="steps"
  [activeValue]="active()"
  [completedValues]="completed()"
  mode="linear"
  orientation="horizontal"
  size="md"
  labelPosition="bottom-center"
  groupLabel="Add Client"
  (valueChange)="active.set($any($event))"
  (stepComplete)="onWizardFinish()">
  <div slot="content-info">…step 1 content…</div>
  <div slot="content-settings">…step 2 content…</div>
  <div slot="content-channels">…step 3 content…</div>
  <div slot="content-apps">…step 4 content…</div>
  <div slot="content-owner">…step 5 content…</div>
</falcon-angular-stepper>
```

### Reactive Forms binding (CVA)
```ts
this.form = this.fb.group({
  step: this.fb.control<string | null>('info'),
});
```
```html
<falcon-angular-stepper
  [steps]="steps"
  [completedValues]="completed()"
  formControlName="step" />
```

### ngModel binding
```html
<falcon-angular-stepper
  [steps]="steps"
  [(ngModel)]="active"
  [completedValues]="completed()" />
```

### Vertical layout with per-step content
```html
<falcon-angular-stepper
  [steps]="steps"
  [(activeValue)]="active"
  orientation="vertical"
  size="lg"
  labelPosition="side">
  <div slot="content-info">…</div>
  <div slot="content-settings">…</div>
  <div slot="content-channels">…</div>
</falcon-angular-stepper>
```

### Per-instance token override
```html
<falcon-angular-stepper class="add-client-stepper" [steps]="steps" [(activeValue)]="active" />
```
```css
/* in any place Tailwind can scan — DO NOT use SCSS in a component */
:where(.add-client-stepper) {
  --falcon-stepper-circle-bg-active: var(--color-falcon-teal-600, #095a61);
  --falcon-stepper-circle-shadow-active: 0 0 0 6px rgba(13,63,68,0.15);
  --falcon-stepper-label-color-active: var(--color-falcon-teal-600, #095a61);
}
```
Token-override pattern follows the same convention demonstrated in `client-information-step.component.html:16-17` for `<falcon-angular-input class="add-client-special-input">`.

## Render-mode guidance
- **Default (`useTailwind=true`)** for any consumer that lives inside the apps' Tailwind v4 scanner — Light DOM lets the consumer's utility classes cascade in and lets `@source inline(...)` safelists pick up runtime-built class strings.
- **`useTailwind=false`** (Shadow) when:
  - The stepper is embedded in a foreign host that doesn't import Falcon Tailwind.
  - The consumer wants maximum style isolation.
  - Token-only theming via the Studio (the Studio mutates `--falcon-stepper-*` tokens, which propagate into Shadow).

## Tailwind-only usage
- ALL visual extensions must live in tokens (`--falcon-stepper-*`) or in Tailwind utility classes via `class="…"` / `rootClass="…"` on the wrapper element.
- NEVER add a `*.component.scss` file with rules. The Angular component CSS file is an empty placeholder.

## Admin-console / management-console example (future-state)
When wizards migrate off the legacy stepper, the call site becomes:
```html
<!-- inside add-client-wizard.component.html (post-migration sketch) -->
<falcon-angular-stepper
  class="flex-shrink-0"
  [steps]="visibleSteps()"
  [activeValue]="stepperActiveValue()"
  [completedValues]="completedValues()"
  mode="linear"
  size="md"
  labelPosition="bottom-center"
  groupLabel="hierarchy.addClient.title' | translate" />
```
Plus the wizard footer (Next/Back/Cancel/Finish) is then provided by `<falcon-angular-wizard>` wrapping this stepper, OR by a bespoke footer row beneath the stepper.

## Import requirements
- Standalone consumer must import `FalconAngularStepperComponent` in its `imports: []` array.
- `CUSTOM_ELEMENTS_SCHEMA` is NOT needed in the consumer — the wrapper itself owns the schema.
- `ngOnInit()` calls `defineFalconTwComponent('falcon-stepper')` automatically to register both Shadow + Light tags on demand.

## Bad usage to avoid
- DO NOT mutate `el.steps` directly from the consumer; pass through `[steps]`.
- DO NOT use `*ngFor` in the consumer's `slot="content-{value}"` projections; named slots must be top-level direct children of the wrapper (Stencil constraint).
- DO NOT use `<p-stepper>` or `<p-step>` anywhere — PrimeNG is uninstalled (Wave PR-8).
- DO NOT use the bespoke legacy `<falcon-stepper>` from `libs/falcon/src/shared-ui/` for new code; it is REFERENCE-ONLY.
- DO NOT pass duplicate `value` entries in `steps[]`.

## Do / Don't
- DO use `mode="linear"` for required-validation flows; allow `non-linear` only when each step is independent.
- DO surface helper text or top-level error via the wrapper inputs (`helperText` / `errorMessage`), not by adding sibling elements.
- DO set `step.optional = true` to render the "Optional" tag — never add it as a label suffix.
- DO use `step.icon` only when `showStepNumbers=false` is intentional, otherwise the icon and number may collide visually.
- DON'T paint your own custom dot CSS — that violates the token-SSOT rule; override tokens instead.
- DON'T animate the fill bar with JS — the fill transition is owned by `--falcon-stepper-fill-transition-duration` + easing token.
