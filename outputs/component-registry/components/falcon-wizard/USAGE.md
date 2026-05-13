# falcon-angular-wizard — USAGE

## Real usage in active codebase
- `apps/host-shell/src/app/playground/playground.page.html` — playground showcase (5-step demo of the dual render path).
- **No production consumer yet** in admin-console or management-console; the wizards in `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/` still use the legacy bespoke `<falcon-stepper>` directly.

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
