# falcon-input-number — USAGE

## Real usage examples

### Example 1 — Active codebase: contracts rate-card price-value (decimal + SAR icon slot)

`[CODE]` `apps/admin-console/src/app/features/contracts-cost-management/components/contracts-add-wizard/rate-card-step/rate-card-step.component.html:60-76`:

```html
<falcon-angular-input-number
  [attr.data-testid]="'contracts-rate-card-priceValue-' + row.code"
  class="block w-full"
  size="md"
  mode="decimal"
  [min]="0"
  [maxFractionDigits]="6"
  [iconRight]="true"
  [ngModel]="row.priceValue"
  [ngModelOptions]="{ standalone: true }"
  (valueChange)="onPriceValueChange(row, $event)"
  [placeholder]="'0'">
  <span slot="icon-right" class="text-[12px] font-medium text-falcon-neutral-600" aria-hidden="true">
    {{ 'contractsCostManagement.contractDetails.sar' | translate }}
  </span>
</falcon-angular-input-number>
```

> Note this uses **decimal mode + an `iconRight` SAR affordance** rather than `mode="currency"` — the SoT renders SAR as a static end-glyph, not an Intl-prefixed symbol.

### Example 1b — Currency entry

```html
<falcon-angular-input-number
  [label]="'Amount'"
  mode="currency"
  currency="SAR"
  locale="en-SA"
  [min]="0"
  [(ngModel)]="amount">
</falcon-angular-input-number>
```

### Example 2 — Quantity picker with spinner

```html
<falcon-angular-input-number
  [label]="'Quantity'"
  [showButtons]="true"
  [step]="1"
  [min]="1"
  [max]="99"
  [integer]="true"
  [(ngModel)]="qty">
</falcon-angular-input-number>
```

### Example 3 — Decimal with 2-digit precision

```html
<falcon-angular-input-number
  mode="decimal"
  [minFractionDigits]="2"
  [maxFractionDigits]="2"
  [(ngModel)]="weight">
</falcon-angular-input-number>
```

## Recommended usage for NEW Angular pages

- Use `mode='currency'` for money entry — let Intl handle the symbol + decimals.
- Use `integer=true` for IDs / counts.
- Use `showButtons=true` for low-step quantities.
- Pass `locale` for Arabic / locale-specific rendering.

## Reactive Forms

```ts
form = new FormGroup({
  amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
});
```

## ngModel

```html
<falcon-angular-input-number [(ngModel)]="amount"></falcon-angular-input-number>
```

## Tailwind-only

```html
<falcon-angular-input-number class="w-32" rootClass="..." ... />
```

## Token usage

Inherits all `--falcon-input-*` tokens for the field; spinner has its own set. Per-instance (`[CODE]` real token names from input-number.tokens.css):

```css
.amount-input {
  --falcon-input-number-gap: 4px;            /* input↔spinner gap */
  --falcon-input-number-spinner-size: 32px;  /* spinner button width */
  --falcon-input-number-spinner-bg: var(--color-falcon-neutral-100);
}
```

> ⚠️ `[CODE]` These spinner tokens are read ONLY by the **Shadow** `<falcon-input-number>` CSS. The **Tailwind** `-tw` twin renders spinner buttons with **hardcoded palette utilities** (`bg-falcon-neutral-100 …`) inline in the `.tsx` — so token overrides do NOT retune the `-tw` spinner. (Token-parity GAP — see GAPS_AND_UPGRADES.)

## Bad usage to avoid

- Do NOT bind to a `FormControl<string>` — value is `number | null`.
- Do NOT use `minFractionDigits` in currency mode (Intl owns decimals).
- Do NOT skip `locale` for Arabic — defaults to browser locale which may not match.

## Do / Don't

| Do | Don't |
|---|---|
| Use `mode='currency'` for money. | Use `<falcon-angular-input>` for currency. |
| Pass `locale` explicitly when relevant. | Rely on browser locale silently. |
| Use Reactive Forms validators for min/max. | Trust the clamp only — clamp runs on blur. |

## Bad usage to avoid (additions)

- **Do NOT** use `useTailwind=false` (Shadow) when you need an error ring or letter-blocking — `[state]` is dropped and the numeric keystroke filter is absent in Shadow mode (Shadow↔tw parity GAPs). Stay on the default `useTailwind=true`.
- **Do NOT** expect `(blur)="…"` on the host to fire — there is no `@Output() blur`; use `(valueChange)` or the form control's `statusChanges`.
- **Do NOT** override `--falcon-input-number-spinner-*` and expect the Tailwind-path spinner to change — it's hardcoded in the `-tw` `.tsx`.

## Consumer Sweep (2026-06-03)

[CODE] grep `<falcon-angular-input-number[\s>]` across `apps/` returned **≈16 consumer files** (0 in `libs/falcon/`). Up from the prior "2". Heaviest = contracts-cost-management. Current consumers:

- `apps/admin-console/.../contracts-cost-management/components/contracts-add-wizard/{rate-card-step, addons-step, contract-information-step}.component.{html,ts}`
- `apps/{admin,management}-console/.../contracts-cost-management/components/{contracts-addons-section, contracts-rate-card-section, contracts-edit-contract}.component.{html,ts}`
- `apps/admin-console/.../org-hierarchy-page/components/tab-components/settings-tab/settings-tab.component.ts`
- `apps/admin-console/.../org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.{html,ts}`
- `apps/{admin,management}-console/.../new-wallet-balance/components/wb-balance-transfer-drawer/...`

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B01); RE-VERIFIED 2026-06-03 (W1-a). Example 1 cited from live rate-card-step.component.html; spinner token names corrected + `-tw` hardcode caveat added. Consumer sweep re-run (`<falcon-angular-input-number[\s>]` → 17 app files / 23 occurrences incl. 1 `standards.spec.ts` selector assertion + `new-wallet-balance` drawer; 0 in `libs/falcon`) — matches the "≈16" estimate. W1-a verdict: PASS.
