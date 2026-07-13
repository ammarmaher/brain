# falcon-checkbox — USAGE

## Real usage examples (active codebase)

### Example 1 — `ngModel` boolean toggle in a wizard step

`apps/admin-console/src/app/features/templates-page/components/templates-wizard/steps/step2-message-structure.component.html:92`:

```html
<falcon-angular-checkbox
  class="mt-1.5"
  [label]="'templates.wizard.step2.auth.security' | translate"
  [ngModel]="auth().securityRecommendation"
  (ngModelChange)="setAuthSecurity($event)" />
```

A signal-backed boolean field driven via `[ngModel]` + `(ngModelChange)`; the surrounding `@if` reveals helper text when checked. The mgmt twin is identical (`apps/management-console/.../step2-message-structure.component.html:92,104,129`).

### Example 2 — `checkedInput` (CVA bypass) with a guarded toggle

`apps/admin-console/src/app/features/new-wallet-balance/components/wb-allocation-table/wb-allocation-table.component.html:120`:

```html
<falcon-angular-checkbox
  [useTailwind]="true"
  [checkedInput]="true"
  [label]="'newWalletBalance.' + channelLabel(chId) | translate"
  (valueChange)="activeChannels().length > 1 && toggleChannel.emit(chId)" />
```

The channel-header checkbox is **parent-driven** (`[checkedInput]`, not CVA) so the parent owns the active-channel set. The `(valueChange)` is guarded — the last remaining channel cannot be unchecked ("at least one channel" rule). The `.ts:19` header documents the token override applied to this instance. The mgmt client-view mirrors this (`wb-client-view.component.html:159`).

### Example 3 — Reactive Forms (recommended)

```ts
form = new FormGroup({
  marketing: new FormControl<boolean>(false, { nonNullable: true }),
});
```

```html
<falcon-angular-checkbox
  formControlName="marketing"
  [label]="'Send me marketing emails'">
</falcon-angular-checkbox>
```

### Example 4 — Tri-state "Select all" header

```html
<falcon-angular-checkbox
  [indeterminate]="someSelected() && !allSelected()"
  [checkedInput]="allSelected()"
  (valueChange)="toggleAll($event)">
</falcon-angular-checkbox>
```

Recompute `indeterminate` (as a `computed` off the selection set) — it resets on every user toggle.

## Recommended usage for NEW Angular pages

- Standalone boolean → CVA (`formControlName` / `[(ngModel)]`).
- Inside a group → `<falcon-angular-checkbox-group>` (do not loop raw checkboxes).
- Parent-owned selection (table header / wallet channels) → `[checkedInput]` + `(valueChange)`, NOT CVA.
- Validation feedback → `[state]="'error'"` + `[errorText]`.
- Disabled → a disabled `FormControl` (there is no `[disabled]` input).

## ngModel (template forms)

```html
<falcon-angular-checkbox [(ngModel)]="agreed" [label]="'I agree to the terms'" [required]="true" />
```

## Tailwind-only usage

```html
<falcon-angular-checkbox class="mt-2" [(ngModel)]="v" [label]="'Hello'" />
```

Path-specific tweaks via `rowClass` / `boxClass` / `labelClass` (Light path only):

```html
<falcon-angular-checkbox boxClass="rounded-md" rowClass="gap-3" [(ngModel)]="v" [label]="'X'" />
```

## Token usage (per-instance override pattern)

```css
.brand-checkbox {
  --falcon-checkbox-bg-checked: var(--color-falcon-teal-500);
  --falcon-checkbox-border-color-checked: var(--color-falcon-teal-500);
  --falcon-checkbox-radius: 4px;
}
```

> Both Shadow + Light read the same `--falcon-checkbox-*` tokens via the `:where(falcon-checkbox, falcon-checkbox-tw, falcon-angular-checkbox, .falcon-checkbox, [data-falcon-checkbox])` chain. The wallet allocation-table uses exactly this pattern (token-overridden header checkbox).

## Do / Don't

| Do | Don't |
|---|---|
| Use CVA for standalone form checkboxes. | Use `checkedInput` outside a parent-owned-selection scenario. |
| Use `[checkedInput]` + `(valueChange)` for parent-driven selection. | Bind both `[(ngModel)]` AND `[checkedInput]` (two owners fight). |
| Use `[indeterminate]` for tri-state headers + recompute it. | Try to persist `indeterminate` across toggles (it resets). |
| Disable via a disabled `FormControl`. | Expect `[disabled]="true"` to work (no such input). |
| Override visuals via `--falcon-checkbox-*` tokens. | Hardcode hex/px in consumer CSS. |
| Use `@if`/`@for` around it. | Use `*ngIf`/`*ngFor`. |

## Bad usage to avoid

- **Do NOT** rely on `<ng-content>` for a rich label — there is no projection (GAP G2). `label` is plain text.
- **Do NOT** loop raw checkboxes to model a multi-value field — use `<falcon-angular-checkbox-group>`.
- **Do NOT** read the business answer from `value` (`'on'`) — it is the native submit token; the answer is the boolean from CVA / `valueChange`.
- **Do NOT** add `pi pi-check` / PrimeIcons — the check glyph is a built-in inline SVG.

## Consumer Sweep (2026-06-03)

[CODE] grep `<falcon-angular-checkbox` across `apps/` + `libs/falcon/` returned **5 real consumer files**:

- `apps/admin-console/src/app/features/new-wallet-balance/components/wb-allocation-table/wb-allocation-table.component.html`
- `apps/management-console/src/app/features/new-wallet-balance/components/wb-client-view/wb-client-view.component.html`
- `apps/admin-console/src/app/features/templates-page/components/templates-wizard/steps/step2-message-structure.component.html`
- `apps/management-console/src/app/features/templates-page/components/templates-wizard/steps/step2-message-structure.component.html`
- `apps/management-console/src/app/features/contact-groups/create-contact-group/steps/preview-configure-step/preview-configure-step.component.html`

Also referenced by `libs/falcon-studio/src/lib/components/preview-grid.component.ts` (Studio) and the new-wallet-balance standards specs. Corrected from the stale Wave-7 "1 (playground)".

## Verification
🟢 code-verified — examples cite live `templates-wizard` + `wb-allocation-table` files (read 2026-06-03). Consumer count 🟢 grep-verified 2026-06-03 and corrected. `<ng-content>` rich-label claim removed (false).
🟢 RE-VERIFIED 2026-06-03 (W1-c VERIFY) — PASS. Re-grep: the 5 enumerated non-spec consumer files all still present (`apps/` shows 8 hits incl. 2 `__tests__/*.spec.ts`); `libs/falcon` = 0. No correction needed.
