# falcon-date-picker — USAGE

## Real usage examples (active codebase)

### Example 1 — contracts wizard Start/Expiration date (the flagship live consumer)

`[CODE]` `apps/admin-console/.../contracts-cost-management/components/contracts-add-wizard/contract-information-step/contract-information-step.component.html:37,48`:

```html
<!-- Start Date -->
<falcon-angular-date-picker
  data-testid="contracts-field-startDate"
  [label]="'contractsCostManagement.wizard.contractInformation.startDate' | translate"
  ... />

<!-- Expiration Date -->
<falcon-angular-date-picker
  data-testid="contracts-field-expirationDate"
  [label]="'contractsCostManagement.wizard.contractInformation.expirationDate' | translate"
  ... />
```

> These two are a real-world "start ≤ end" range expressed as **two separate pickers** (the component has no native range mode — GAP G2); the wizard cross-validates externally.

### Example 2 — service-pricing-table effective date with a per-instance token override

`[CODE]` `libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.html:235-238`:

```html
<falcon-angular-date-picker
  size="sm"
  class="block w-[200px]"
  style="--falcon-date-picker-input-padding-block: 6.5px; --falcon-date-picker-input-padding-block-sm: 6.5px">
</falcon-angular-date-picker>
```

> The inline `style=` token override lines the field's box up with a sibling dropdown — the canonical per-instance customization (override tokens, never hardcode).

### Example 3 — birth date with min/max (recommended pattern)

```html
<falcon-angular-date-picker
  [label]="'Date of birth'"
  min="1900-01-01"
  [max]="todayIso"
  [(value)]="dob"
  (valueChange)="onDateChange($event)">
</falcon-angular-date-picker>
```

### Example 4 — disable weekends + error state

```ts
readonly isWeekend = (d: Date): boolean => d.getDay() === 0 || d.getDay() === 6; // stable reference
```

```html
<falcon-angular-date-picker
  [label]="'Start date'"
  [disabledDates]="isWeekend"
  [errorMessage]="startError() | translate"
  [state]="startError() ? 'error' : 'default'"
  [required]="true"
  [(value)]="startDate">
</falcon-angular-date-picker>
```

## Recommended usage for NEW Angular pages

- Always for input + popover date entry (the default; keep `useTailwind=true`).
- Pair with form validation externally — the wrapper has no CVA (GAP G1).
- Use `[firstDayOfWeek]="6"` for Saturday-start (Arabic) locales.
- Pass `[disabledDates]` as a stable JS array/predicate for business rules (e.g. a renew-day clamp) so illegal dates are physically un-clickable.
- Defaults: `useTailwind=true`, `placeholder='YYYY-MM-DD'`, `size='md'`, `firstDayOfWeek=0`, `locale='en-US'`.

## Reactive Forms

No CVA (GAP G1). Bridge via `@ViewChild`:

```ts
@ViewChild(FalconAngularDatePickerComponent) picker!: FalconAngularDatePickerComponent;

ngAfterViewInit() {
  this.picker.valueChange.subscribe(v => this.form.controls.date.setValue(v));
  this.form.controls.date.valueChanges.subscribe(v => this.picker.value = v);
}
```

OR (cleaner) wrap in a small directive that implements `ControlValueAccessor` and bridges `[value]`/`(valueChange)`.

## ngModel

NOT supported (no CVA). There is no legacy `<falcon-calendar>` façade to fall back to — it was deleted (`[CODE]` `shared-ui/index.ts:312`). Use `[value]`/`(valueChange)`.

## Tailwind-only

```html
<falcon-angular-date-picker class="block w-full" rootClass="..." ... />
```

## Token usage (per-instance override)

```css
.brand-date {
  --falcon-date-picker-input-border-color-focus: var(--color-falcon-teal-500);
  --falcon-calendar-day-selected-bg: var(--color-falcon-teal-500);  /* recolors the popup grid too */
}
```

Or inline `style="--falcon-date-picker-input-padding-block: 6.5px"` (see Example 2). Both the input and the embedded grid read shared tokens.

## Bad usage to avoid

- **Do NOT** set `useTailwind="false"` to "fix" something — the Shadow variant lacks the popover-portal fixes AND still has the RC#4 first-click bug (`[CODE]` falcon-date-picker.tsx:125-128). The default `-tw` is the correct path.
- **Do NOT** bind `[(ngModel)]` / `formControlName` — no CVA; silently does nothing.
- **Do NOT** pass `disabledDates` as a string attribute — JS prop only; keep the reference stable.
- **Do NOT** use for an always-visible inline grid → `<falcon-angular-calendar>`.
- **Do NOT** trust the typed input as validation — `parseInputValue` is lenient (drops un-parseable text); validate the emitted value.
- **Do NOT** expect `[locale]` to switch the calendar *system* or the *display format* — it only changes the popup grid labels; the field always shows ISO.
- **Do NOT** use native `<input type="date">` or PrimeNG `<p-calendar>` in app code — banned (`feedback_falcon_ui_library_only_no_native`).

## Do / Don't

| Do | Don't |
|---|---|
| Use for input + popover date entry. | Use for an always-visible inline grid. |
| Keep `useTailwind=true` (default). | Switch to Shadow (`false`) — lacks portal fixes + has the first-click bug. |
| Bind `[value]` + `(valueChange)`. | Use `[(ngModel)]` (no CVA). |
| Pass `disabledDates` as a stable JS array/fn. | Pass it as a string attr or fresh-per-render fn. |
| Override visuals via tokens / inline `style=`. | Hardcode hex/px or write component CSS. |
| Compose two pickers for a date range. | Expect native range support. |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `<falcon-angular-date-picker` across `apps/` → **2 files**; `libs/falcon/` → **2 files** (one a no-op comment). Full list:

- `apps/admin-console/.../contracts-cost-management/components/contracts-add-wizard/contract-information-step/contract-information-step.component.html` (Start Date + Expiration Date).
- `apps/admin-console/.../contracts-cost-management/components/contracts-edit-contract/contracts-edit-contract.component.html`.
- `libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.html:235` (effective date + per-instance token override).
- `libs/falcon/src/shared-ui/lib/directives/falcon-effective-date.directive.ts` (slug in a Wave-3 no-op-stub comment only — not a render).

> `[CODE]` CORRECTION vs the prior 2026-05-17 sweep ("7 consumers"): applications-table + falcon-table-edit-row + playground + the legacy `falcon-calendar` façade (`.component.{html,ts}`) are **all gone/migrated**. The legacy façade was deleted. The live consumers are now the contracts wizard + service-pricing-table (net ~3 live render sites).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B07). Consumer Sweep re-run; live consumers are the contracts wizard (Start/Expiration) + service-pricing-table (with a per-instance `style=` token override) — both quoted from live source. The prior 7-consumer list is corrected (applications-table/edit-row/playground/legacy-façade gone).
