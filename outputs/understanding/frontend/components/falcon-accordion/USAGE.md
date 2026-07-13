# falcon-accordion — USAGE

## Real usage examples (active codebase)

`[CODE]` **There are NO production consumers.** `<falcon-angular-accordion>` is exported from `@falcon/ui-core` but adopted by **0 files** in `apps/` or `libs/falcon/` (Consumer Sweep below). The examples here are the **recommended** authoring shape, derived from the live source contract — they are not copied from a shipping page.

## Recommended usage for NEW Angular pages

### Multiple-open accordion with projected content (the canonical model)

```html
<!-- *** Falcon UI <falcon-angular-accordion> — config-array items + content-<value> slots. *** -->
<falcon-angular-accordion
  class="w-full"
  mode="multiple"
  size="md"
  [items]="faqItems"
  [expandedValues]="openValues"
  (valueChange)="openValues = $event"
  [ariaLabel]="'faq.aria' | translate">

  <!-- Each child is matched to its item by slot="content-<value>" -->
  <div slot="content-shipping">{{ 'faq.shipping.body' | translate }}</div>
  <div slot="content-returns">{{ 'faq.returns.body' | translate }}</div>
  <div slot="content-billing">{{ 'faq.billing.body' | translate }}</div>
</falcon-angular-accordion>
```

```ts
readonly faqItems: FalconAccordionItem[] = [
  { value: 'shipping', label: 'Shipping', description: 'Delivery & tracking' },
  { value: 'returns',  label: 'Returns',  icon: 'falcon-icon falcon-icon-rotate' },
  { value: 'billing',  label: 'Billing',  disabled: true },
];
openValues: ReadonlyArray<string | number> = ['shipping'];
```

> `[CODE]` **Binding note:** the wrapper exposes an `expandedValues` getter/setter and a `(valueChange)` Output but **no `expandedValuesChange`** — so the `[(expandedValues)]` banana-box does NOT auto-wire. Use `[expandedValues]` + `(valueChange)` explicitly (the prior dossier's `[(expandedValues)]` examples were incorrect — GAP A1).

### Single-open with helper / error text + form controls in panels

```html
<form [formGroup]="form">
  <falcon-angular-accordion
    mode="single"
    [items]="sections"
    [expandedValues]="active"
    (valueChange)="active = $event"
    [helperText]="'settings.expandHint' | translate"
    [errorMessage]="hasInvalidSection() ? ('settings.fixSection' | translate) : ''">
    <div slot="content-personal">
      <falcon-angular-input formControlName="firstName" [label]="'First name'" />
      <falcon-angular-input formControlName="lastName"  [label]="'Last name'" />
    </div>
    <div slot="content-contact">
      <falcon-angular-email-field formControlName="email" />
    </div>
  </falcon-angular-accordion>
</form>
```

The accordion is just a container; projected `slot="content-<value>"` content can hold any form controls.

### Imperative expand/collapse (today requires the inner Stencil element)

```ts
// GAP A2: the wrapper does NOT proxy expand()/collapse(). Reach the Stencil tag:
@ViewChild('acc', { read: ElementRef }) accRef?: ElementRef<HTMLElement>;
async openBilling() {
  const stencil = this.accRef?.nativeElement
    .querySelector('falcon-accordion-tw, falcon-accordion') as any;
  await stencil?.expand?.('billing');
}
```

## Reactive Forms / ngModel
**Not supported on the accordion's expansion state** — the wrapper does not implement `ControlValueAccessor` (GAP A1). Track the expanded set in a plain component field. (Form controls *inside* the panels work normally via their own CVA.)

## Tailwind-only usage
Add host utilities via `class=` (layout/width) or pass extra classes through `rootClass` (forwarded to the Stencil tag):

```html
<falcon-angular-accordion class="max-w-2xl" rootClass="my-faq" [items]="items" />
```

## Token usage (per-instance override pattern)

```css
.my-faq {
  --falcon-accordion-border-radius: 12px;
  --falcon-accordion-header-color-expanded: var(--color-falcon-green-600);
  --falcon-accordion-header-padding-y-md: 8px;     /* densify */
}
```

> Both render paths read the SAME `--falcon-accordion-*` tokens through the token file's `:where(falcon-accordion, falcon-accordion-tw, falcon-angular-accordion, …)` selector chain — overrides bite identically in Shadow + Light.

## Do / Don't

| Do | Don't |
|---|---|
| Drive content via `[items]` + `slot="content-<value>"`. | Try to project `<falcon-accordion-item>` child components (none exist). |
| Use `[expandedValues]` + `(valueChange)`. | Use `[(expandedValues)]` (no `expandedValuesChange` Output) or `[(ngModel)]` (no CVA). |
| Use `mode="multiple"` for independent collapse. | Expect `mode="single"` to keep one always open (it collapses to zero). |
| Pass `icon` as a CSS-class string per item. | Project SVGs into the header (header is built from item props only). |
| Override visuals via `--falcon-accordion-*` tokens on a host class. | Hardcode hex/px or add SCSS rules in consumer CSS. |
| Give every item a non-empty `label`. | Ship an empty `label` (header loses its accessible name). |
| Use `@if` / `@for` in the surrounding template. | Use `*ngIf` / `*ngFor` (project rule). |
| Pass unique `value`s. | Pass duplicate `value`s (breaks keyboard nav + slot matching). |

## Import requirements (standalone component)

```ts
import { FalconAngularAccordionComponent } from '@falcon/ui-core';

@Component({
  standalone: true,
  imports: [FalconAngularAccordionComponent],   // CUSTOM_ELEMENTS_SCHEMA NOT needed (wrapper sets it)
  ...
})
```

## Consumer Sweep (2026-06-03)

[CODE] grep `<falcon-angular-accordion` across `apps/` → **0 files / 0 occurrences**; across `libs/falcon/` → **0 files**. Non-render references for `falcon-accordion` (not consumers):

- `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/registry.ts` — showcase registry entry.
- `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-variant-tile.component.ts` — gallery tile.
- `apps/host-shell/src/assets/component-docs/accordion.md` — showcase docs page.
- `apps/admin-console/src/tailwind.css` + `apps/host-shell/src/tailwind.css` — `@source inline` safelist mentions.

> `[CODE]` Confirms the prior dossier's "Zero matches in apps/" (the Wave-7 "1" at `playground.page.html` is stale — the playground route is gone). Component remains an exported-but-unadopted primitive.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B13). Consumer Sweep re-run (`<falcon-angular-accordion` → 0 app files, 0 lib files; only showcase/docs/safelist references). Corrected the prior `[(expandedValues)]` examples (no `expandedValuesChange` Output) and the stale `CUSTOM_ELEMENTS_SCHEMA`-on-host import note.
