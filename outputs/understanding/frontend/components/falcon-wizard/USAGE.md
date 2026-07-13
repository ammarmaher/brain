# falcon-angular-wizard — USAGE

## Real usage in active codebase
- **None (2026-06-03).** `[CODE]` grep `<falcon-angular-wizard[ >]` across `apps/` + `libs/falcon/` → **0 element usages**. The prior dossier's `apps/host-shell/.../playground/playground.page.html` showcase is gone (the playground route was removed — `[MEMORY]` B01) and the tag is NOT in the current `falcon-ui-showcase` folder.
- The org-hierarchy Add Client / Add User wizards in `apps/{admin,management}-console/.../org-hierarchy-page/components/wizard-components/` still use the legacy `<falcon-stepper>` directly + manual footer; the end-of-wizard channel→submit→success flow is the separate `<falcon-angular-wizard-finalization>` orchestrator. **This shell is the standing migration target, un-adopted.**
- Drift note: the examples below use `[(currentStep)]` banana-box on the wrapper. **That does not actually two-way bind** — the wrapper `currentStep` is a one-way `@Input` with no `currentStepChange` Output (the inner Stencil prop is mutable, so the element advances itself, but the new index is not pushed back to the host). Track the step via `(falconWizardStepChange)` instead, or feed `[currentStep]` one-way from a signal you also update in the step-change handler. (Examples retained as the intended ergonomics once a `currentStep` model is added — GAP.)

## Recommended NEW usage

### Basic 5-step wizard with validation via `stepControls`
```ts
// component.ts
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FalconAngularWizardComponent, type FalconWizardStep } from '@falcon/ui-core/angular';

@Component({
  standalone: true,
  imports: [FalconAngularWizardComponent, ReactiveFormsModule, /* step body components */],
  templateUrl: './add-client-wizard.component.html',
})
export class AddClientWizardComponent {
  private readonly fb = inject(FormBuilder);

  readonly steps: FalconWizardStep[] = [
    { label: 'Information' },
    { label: 'Settings'    },
    { label: 'Channels'    },
    { label: 'Applications'},
    { label: 'Owner', optional: true },
  ];

  readonly currentStep = signal<number>(0);

  readonly infoForm     = this.fb.group({ /* … */ });
  readonly settingsForm = this.fb.group({ /* … */ });
  readonly channelsForm = this.fb.group({ /* … */ });
  readonly appsForm     = this.fb.group({ /* … */ });
  readonly ownerForm    = this.fb.group({ /* … */ });

  readonly stepControls = computed(() => [
    this.infoForm,
    this.settingsForm,
    this.channelsForm,
    this.appsForm,
    this.ownerForm,
  ]);

  onFinish(): void { /* submit + close */ }
  onDraft(): void { /* save draft */ }
}
```
```html
<!-- component.html -->
<falcon-angular-wizard
  [steps]="steps"
  [(currentStep)]="currentStep"
  [stepControls]="stepControls()"
  showBack
  showFinish
  showDraft
  nextLabel="Next"
  backLabel="Back"
  finishLabel="Save"
  draftLabel="Save Draft"
  (falconWizardFinish)="onFinish()"
  (falconWizardDraft)="onDraft()"
  (falconStepValidationFail)="showValidationToast($event)">
  <h2 slot="header" class="text-lg font-semibold">{{ 'hierarchy.addClient.title' | translate }}</h2>

  <app-client-information-step slot="step-0" [form]="infoForm" />
  <app-client-settings-step    slot="step-1" [form]="settingsForm" />
  <app-client-channels-step    slot="step-2" [form]="channelsForm" />
  <app-client-applications-step slot="step-3" [form]="appsForm" />
  <app-client-owner-step       slot="step-4" [form]="ownerForm" />

  <button slot="footer-extra" type="button" class="mr-auto" (click)="onCancel()">Cancel</button>
</falcon-angular-wizard>
```

### Async validation via `validateStep`
```ts
async validateStep(step: number): Promise<boolean> {
  if (step === 0) {
    // Make sure info form is valid AND uniqueness check passes (server roundtrip).
    if (this.infoForm.invalid) {
      this.infoForm.markAllAsTouched();
      return false;
    }
    return await this.checkAccountNameAvailable(this.infoForm.value.accountName);
  }
  return true;
}
```
```html
<falcon-angular-wizard
  [steps]="steps"
  [(currentStep)]="currentStep"
  [validateStep]="validateStep.bind(this)" />
```

### Imperative Next/Back via the embedded element
```ts
@ViewChild('wizardRef', { static: false, read: ElementRef })
private wizardRef!: ElementRef<HTMLElement & { next(): Promise<void>; back(): Promise<void> }>;

async forceNext(): Promise<void> {
  await this.wizardRef.nativeElement.next();
}
```

## Render-mode guidance
- **Default (`useTailwind=true`)** — Light DOM. Tailwind utilities cascade in from the consumer.
- **`useTailwind=false`** (Shadow) — token-driven only; use when consumer Tailwind shouldn't bleed through.

## Tailwind-only usage
- Consumer adds `class="…"` to the outer `<falcon-angular-wizard>` element for outer container shape.
- All visual overrides must be via tokens (`--falcon-wizard-*`).
- The step body components (slot content) are pure consumer Angular — Tailwind utilities apply normally there.

## Bad usage to avoid
- DO NOT supply BOTH `validateStep` AND `stepControls` expecting them to combine — `validateStep` wins outright.
- DO NOT mutate the `steps` array reference identity unnecessarily; Angular's CD + Stencil's prop assignment re-renders the embedded stepper.
- DO NOT use `*ngFor` to emit slots `slot="step-{i}"` — the slot name must be a literal string match; loop output may not match `currentStep`.
- DO NOT rely on `step.status` to render error/completed states yet — the Stencil component does not visualize this property (only `currentStep` index). Drive completion off `currentStep` for now.
- DO NOT wrap the wizard in a `<form>` element if you're using `stepControls` — each step body owns its own FormGroup; the wizard does not own a form.

## Do / Don't
- DO compose with `<falcon-angular-popup>` (`variant="unsaved"`) for the cancel-with-dirty-state confirmation. The wizard does NOT own this modal.
- DO listen to `falconStepValidationFail` and surface a toast or focus the first invalid field.
- DO use `slot="footer-extra"` for tertiary actions (Cancel, Skip This Step) that don't fit Next/Back/Finish/Draft.
- DON'T add custom CSS to override the footer layout — propose new tokens instead.
- DON'T set `[stepControls]` to a non-array; the wrapper's `resolvedValidateStep` guards with `if (!this.stepControls?.length) return undefined;`.

## Wave 7 Consumer Sweep (2026-05-17)

[CODE] grep `<falcon-angular-wizard>` across `apps/` + `libs/falcon/` returned **0 consumers** as of 2026-05-17. Status: showcase-only or not yet adopted.

## Deep-Dive Sweep Consumer Sweep (2026-06-03 — B20)

`[CODE]` grep `<falcon-angular-wizard[ >]` across `apps/` + `libs/falcon/` → **0 element usages** (the 4/14 grep hits that matched `falcon-angular-wizard*` were all `<falcon-angular-wizard-finalization>`, a DIFFERENT component, caught by prefix). No showcase consumer either (playground removed). **Adoption is still ZERO.** The wizard shell is production-ready but un-adopted; the real wizards use `<falcon-stepper>` + manual footer + `<falcon-angular-wizard-finalization>` for the finish flow.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B20 REFRESH). Consumer Sweep re-run (0 usages). `[(currentStep)]` caveat added (wrapper is one-way `@Input`, no `currentStepChange`). Recommended-usage code examples preserved from prior dossier (structurally valid; the two-way binding caveat now documented).
