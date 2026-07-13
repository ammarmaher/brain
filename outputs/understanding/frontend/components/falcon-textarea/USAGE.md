# falcon-textarea — USAGE

## Real usage examples

### Example 1 — Active codebase: templates message-body (auto-resizing)

`[CODE]` `apps/admin-console/src/app/features/templates-page/components/templates-wizard/steps/step2-message-structure.component.html:369-381`:

```html
<falcon-angular-textarea
  #bodyArea
  class="block w-full"
  [useTailwind]="true"
  [autoResize]="true"
  [rows]="4"
  [minRows]="4"
  [maxRows]="14"
  [maxlength]="bodyMax"
  [placeholder]="'templates.wizard.step2.bodyPh' | translate"
  [ngModel]="value().body"
  id="step2-body"
  (ngModelChange)="setBody($event)">
</falcon-angular-textarea>
```

### Example 1b — Description textarea with counter

```html
<falcon-angular-textarea
  [label]="'Description'"
  [placeholder]="'Add a description...'"
  [maxlength]="500"
  [showCounter]="true"
  [autoResize]="true"
  [minRows]="3"
  [maxRows]="8"
  [(ngModel)]="description">
</falcon-angular-textarea>
```

### Example 2 — Reactive Forms with error

```html
<falcon-angular-textarea
  formControlName="notes"
  [label]="'Notes'"
  [errorMessage]="form.controls.notes.touched && form.controls.notes.invalid ? 'Required' : ''"
  [state]="form.controls.notes.touched && form.controls.notes.invalid ? 'error' : 'default'">
</falcon-angular-textarea>
```

### Example 3 — In-grid editing (compact)

```html
<falcon-angular-textarea
  variant="grid"
  size="sm"
  [rows]="2"
  [(ngModel)]="row.notes">
</falcon-angular-textarea>
```

## Recommended usage for NEW Angular pages

- Use `autoResize=true` for descriptions where line count varies.
- Use `maxlength` + `showCounter=true` for length-bounded fields.
- Always bind via CVA.

## Reactive Forms

```ts
form = new FormGroup({
  description: new FormControl<string>('', [Validators.required, Validators.maxLength(500)]),
});
```

## ngModel

```html
<falcon-angular-textarea [(ngModel)]="notes"></falcon-angular-textarea>
```

## Tailwind-only

```html
<falcon-angular-textarea class="w-full" ... />
```

## Token usage (per-instance override)

```css
.note-textarea {
  --falcon-textarea-bg: var(--color-falcon-neutral-50);
  --falcon-textarea-border-radius: 12px;
  --falcon-textarea-min-height-md: 120px;   /* per-size token — NOT a bare --min-height */
}
```

> `[CODE]` There is no bare `--falcon-textarea-min-height`; sizing tokens are `--falcon-textarea-min-height-{sm,md,lg}` (textarea.tokens.css:56-58). `--falcon-textarea-max-height` (auto-resize cap) IS a single token.

## Bad usage to avoid

- Do NOT use for rich-text (no formatting).
- Do NOT bind `[value]` directly.
- Do NOT set `rows` AND `autoResize=true` simultaneously — autoResize wins.

## Do / Don't

| Do | Don't |
|---|---|
| Use for any multi-line text. | Use for rich-text. |
| Use `autoResize` for variable-length input. | Hand-roll a resize handler. |
| Bind via CVA. | Bind `[value]` directly. |

## Consumer Sweep (2026-06-03)

[CODE] grep `<falcon-angular-textarea` across `apps/` returned **12 files** (0 in `libs/falcon/`). The prior sweep's only consumer (`host-shell playground.page.html`) is gone — playground route removed. Current consumers:

- `apps/{admin,management}-console/.../templates-page/components/templates-wizard/steps/step2-message-structure.component.html` (message body, autoResize)
- `apps/{admin,management}-console/.../templates-page/components/templates-wizard/steps/flow/flow-editor.component.html`
- `apps/{admin,management}-console/.../templates-page/components/templates-details/templates-details.component.html`
- `apps/{admin,management}-console/.../wallet-balance-management/components/balance-transfer/balance-transfer.component.html` (admin also has a selector-string ref in its `.component.ts`)
- `apps/{admin,management}-console/.../new-wallet-balance/components/wb-balance-transfer-drawer/wb-balance-transfer-drawer.component.html`
- `apps/management-console/.../new-wallet-balance/__tests__/standards.spec.ts` (selector assertion in a test, non-render)

> `[CODE]` Correction 2026-06-03 (W1-a verify): the prior list's `contracts-cost-management/contracts-addons-section.component.html` entry is **stale** — that file no longer uses `<falcon-angular-textarea>` (0 matches). Plus `libs/falcon-studio` gallery/loader-studio references (Studio scaffolding, not feature consumers).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B01); RE-VERIFIED 2026-06-03 (W1-a). Example 1 cited from live step2-message-structure.component.html; token-override key corrected to per-size; consumer sweep CORRECTED (stale `contracts-addons-section` removed; live count = 12 app files via `<falcon-angular-textarea`).
