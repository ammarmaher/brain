# falcon-stepper (LEGACY) — API

## Selector
- `<falcon-stepper>` — Angular bespoke (collides on string with the Falcon UI core `<falcon-stepper>` Stencil tag; resolution is by Angular import barrel, not Custom Elements registration).

## Import path
```ts
import {
  FalconStepperComponent,
  FalconStepDirective,
  FalconStepperFooterDirective,
} from '@falcon'; // libs/falcon barrel
```

The `@falcon` barrel re-exports these from `libs/falcon/src/shared-ui/lib/components/falcon-stepper/index.ts`.

## TypeScript types involved
```ts
// libs/falcon/src/shared-ui/lib/components/falcon-stepper/falcon-stepper-footer.directive.ts
export interface FalconStepperFooterContext {
  $implicit: number;       // currentStep (1-indexed)
  valid: boolean;
  isFirst: boolean;
  isLast: boolean;
}

// Internal — not exported
type DotState = 'idle' | 'active' | 'done';
```

## Component: `FalconStepperComponent`
Inputs (Angular signal-based `input()` / `model()`):

| Name | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `currentStep` | `model<number>` | `number` (1-indexed) | `1` | Two-way (`[(currentStep)]`). |
| `valid` | `input<boolean>` | — | `true` | Disables Next when false. |
| `linear` | `input<boolean>` | — | `true` | When true, only `done` dots are clickable backward; `idle` dots are no-op. |
| `nextLabelKey` | `input<string>` | — | `'common.next'` | Translated through `TranslatePipe`. |
| `backLabelKey` | `input<string>` | — | `'common.back'` | Translated. |
| `finishLabelKey` | `input<string>` | — | `'common.finish'` | Translated. |
| `cancelLabelKey` | `input<string>` | — | `'common.cancel'` | Translated. |

Outputs (Angular `output<T>()`):

| Name | Payload | Description |
|---|---|---|
| `back` | `void` | Emitted when `onBack()` is called from the first step (typically maps to cancel). |
| `cancel` | `void` | Emitted from the explicit Cancel button on step 1. |
| `finish` | `void` | Emitted when Next is clicked on the last step. |

Internal computed signals (`computed()`):
- `count` — `steps().length`.
- `isFirst` / `isLast` — derived from `currentStep`.
- `pct` — fill width: `(currentStep - 1) / (count - 1) * 100`. Edge: single step → `0%`.

Internal methods:
- `dotPos(i)` — left-percent for the i-th dot.
- `dotState(i)` — `'done' | 'active' | 'idle'` based on `currentStep`.
- `onJump(i)` — clicked a dot; only `done` dots navigate.
- `onNext()`, `onBack()`, `onCancel()`.

## Companion directive: `FalconStepDirective` — `<falcon-step>`
```ts
@Directive({ selector: 'falcon-step', standalone: true })
export class FalconStepDirective {
  readonly label = input.required<string>();
  readonly icon = input<string>('');
  readonly content = contentChild.required(TemplateRef);
}
```
- Registers one step with the stepper via `contentChildren(FalconStepDirective)`.
- `content` is the body TemplateRef (wrap the step body in `<ng-template>` inside `<falcon-step>`).

## Companion directive: `FalconStepperFooterDirective` — `[falconStepperFooter]`
```ts
@Directive({ selector: '[falconStepperFooter]', standalone: true })
export class FalconStepperFooterDirective {
  readonly tpl = inject<TemplateRef<FalconStepperFooterContext>>(TemplateRef);
}
```
- Provides a custom footer TemplateRef. The context object includes `$implicit: currentStep`, `valid`, `isFirst`, `isLast`.
- When no `[falconStepperFooter]` is supplied, the component renders a default footer row (Next + Back/Cancel).

## CVA / Forms support
- **None.** Not a form control. `currentStep` is exposed as `model<number>()` for two-way binding but does NOT implement `ControlValueAccessor`.

## Slots / ng-template inputs
- One `<falcon-step>` per step — each with a child `<ng-template>` body.
- Optional `<ng-template falconStepperFooter>` for the footer row.

## Supported modes / variants
- `linear` mode toggle (boolean).
- Three dot states: `'idle' | 'active' | 'done'`.
- No size variants.

## Lazy / server mode
- _None observed in active source._

## Important constraints
- The internal CSS uses class names like `fs-rail`, `fs-track`, `fs-fill`, `fs-dot`, `fs-labels`, `fs-label`, `fs-panels`, `fs-footer-btn`. These are defined in `falcon-stepper.component.scss` and must not be relied upon externally.
- The component uses `*ngTemplateOutlet` to render each step's content TemplateRef — old syntax preserved from Wave 3; not migrated to `@if/@for`.
- Inline style: `[style.width.%]="pct()"` on the fill bar and `[style.inset-inline-start.%]="dotPos(i)"` on each dot. Inline geometry escape hatch is permitted here per project rules.
- The template's bg/border colors use `var(--color-falcon-neutral-150,#e5e7eb)` directly (not a per-component token) — this is a Wave 3 token wiring gap.

## Accessibility (from the template)
- Outer header: `role="tablist"` with `aria-orientation="horizontal"`.
- Each dot button: `role="tab"`, `aria-selected={dotState === 'active'}`, `aria-current={dotState === 'active' ? 'step' : null}`, `aria-label={step.label | translate}`, `tabindex={active ? 0 : -1}`, `disabled={dotState === 'idle'}`.
- Keyboard: native focus + click — no Arrow key / Home / End handler.
- ChecksSVG inside `done` state has `stroke="white"`.
