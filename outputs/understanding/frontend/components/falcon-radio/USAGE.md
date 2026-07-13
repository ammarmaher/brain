# falcon-radio — USAGE

## Real usage examples (active codebase)

### Example 1 — App-level pill wrapper (new-wallet-balance `wb-radio-pill`)

`apps/admin-console/src/app/features/new-wallet-balance/components/wb-radio-pill/wb-radio-pill.component.ts:122-133` — the canonical "one radio per card" pattern, wrapped in a thin app component:

```html
<falcon-angular-radio
  [useTailwind]="true"
  [label]="label()"
  [helperText]="helper() ?? undefined"
  [checkedInput]="checked()"
  [disabledInput]="disabled()"
  [rowClass]="rowClass()"
  markClass="wb-radio-pill-mark"
  (valueChange)="onValueChange($event)" />
```

> `[CODE]` Note `disabledInput` (parent-driven disable) + `checkedInput` (parent-driven check) — both bypass CVA because the pill is template-driven, not form-bound. `rowClass()` returns `wb-radio-pill-row--dim` for the unchecked option in view mode.

### Example 2 — One radio per card, visual-only (templates wizard)

`apps/{admin,management}-console/src/app/features/templates-page/components/templates-wizard/steps/step1-basic-info.component.html:125` (and `flow-type-modal.component.html:56/97`): a `<falcon-angular-radio useTailwind>` rendered `disabled` + pre-`checkedInput` to show the locked/selected card state without being interactive.

### Example 3 — Reactive Forms (value must match)

```html
<falcon-angular-radio formControlName="channel" name="ch" value="email" [label]="'Email'"></falcon-angular-radio>
<falcon-angular-radio formControlName="channel" name="ch" value="sms"   [label]="'SMS'"></falcon-angular-radio>
```

```ts
form = new FormGroup({ channel: new FormControl<string>('email') });
```

> Each radio's `value` must match the control's value. CVA `writeValue` receives the control value and the radio self-checks if it equals its own `value`.

## Recommended usage for NEW Angular pages

- For 2+ options, prefer a single grouping component. **Caveat:** `<falcon-angular-radio-group>` currently composes radio children but ships no Light-DOM CSS for its own wrapper classes (see `falcon-radio-group` GAPS) — so for production today, the pattern that actually works is an app-level `@for` of `<falcon-angular-radio>` with shared `name` (or the `wb-radio-pill` wrapper) + your own Tailwind layout.
- Use a single standalone `<falcon-angular-radio>` only for non-uniform layouts (one per card/pill) — drive `checkedInput` + `disabledInput` from the parent, or bind a `formControl` whose value matches.

Defaults: `useTailwind=true`, `size='md'`, `state='default'`, `value='on'`.

## ngModel (template forms)

```html
<falcon-angular-radio [(ngModel)]="channel" name="ch" value="email" [label]="'Email'"></falcon-angular-radio>
```

## Tailwind-only usage

```html
<falcon-angular-radio class="me-3" rowClass="gap-3" [label]="'Email'" [(ngModel)]="channel" name="ch" value="email" />
```

> `rowClass` / `markClass` / `labelClass` flow ONLY on the Tailwind path (default). On the Shadow path (`useTailwind=false`) use token overrides instead.

## Token usage (per-instance override pattern)

Add a host class, then mutate `--falcon-radio-*` in the consumer's CSS:

```css
.brand-radio {
  --falcon-radio-border-color-checked: var(--color-falcon-teal-500);
  --falcon-radio-border-width-checked: 6px;   /* fatter dot */
  --falcon-radio-size-md: 18px;
}
```

> `[CODE]` There is no `--falcon-radio-bg-checked-inner` token (the prior dossier invented it). The dot IS the thick teal border on `:checked` (`--falcon-radio-border-width-checked: 5px` + `--falcon-radio-border-color-checked`); the background stays white (`--falcon-radio-bg-checked`).

## Bad usage to avoid

- **Do NOT** mix CVA (`formControlName`/`ngModel`) with `[checkedInput]` on the same radio.
- **Do NOT** vary `name` across radios that should be mutually exclusive.
- **Do NOT** bind `[disabled]` — the parent-driven input is `disabledInput`.
- **Do NOT** wait for an "unchecked" event when another radio is picked — the browser fires no `change` on the now-unchecked radio; read the newly-checked value.
- **Do NOT** use a radio for a true on/off boolean → `<falcon-angular-switch>` / `<falcon-angular-checkbox>`.
- **Do NOT** put SCSS rules in the consumer's CSS to restyle the mark — use the token-override host-class pattern (the `wb-radio-pill` cursor rule is a pragmatic exception, not a model to copy).
- **Do NOT** use `*ngIf` / `*ngFor`.

## Do / Don't

| Do | Don't |
|---|---|
| Set a meaningful `value` per radio. | Leave the default `'on'` on multiple radios. |
| Share `name` across exclusive siblings. | Mix `name`s in one choice. |
| Use `errorText` + `state="error"` together. | Use `[disabled]` (use `disabledInput`). |
| Override tokens via host class. | Hardcode hex/px in `style=`. |
| Read the newly-checked value on `(valueChange)`. | Wait for an un-check event. |

## Consumer Sweep (2026-06-03)

[CODE] grep `<falcon-angular-radio[\s>]` across `apps/` returned **5 render occurrences in `.html`** + **1** TS template-string component, plus **2** in `libs/falcon`:

- `apps/admin-console/.../new-wallet-balance/components/wb-radio-pill/wb-radio-pill.component.ts` (TS template — pill wrapper)
- `apps/{admin,management}-console/.../templates-page/.../steps/step1-basic-info.component.html` (1 each)
- `apps/{admin,management}-console/.../templates-page/.../steps/flow/flow-type-modal.component.html` (2 each)
- `apps/{admin,management}-console/.../org-hierarchy-page/.../settings-tab/settings-tab.component.html` (1 each)
- `apps/admin-console/.../add-client-wizard/client-settings-step/client-settings-step.component.html` (1)
- `apps/{admin,management}-console/.../add-user-wizard/user-permissions-step/user-permissions-step.component.html` (1 each)
- `apps/admin-console/.../wallet-balance-management/wallet-balance-management.component.{html,ts}` (legacy wallet view — was NOT in the prior list)
- `libs/falcon/src/shared-features/user-details/components/user-details-page.component.html` (2)

Plus a regression spec referencing the tag: `apps/admin-console/.../new-wallet-balance/__tests__/radio-pill.spec.ts`.

> **W1-c re-grep 2026-06-03:** `<falcon-angular-radio` = **13 files in `apps/`** (incl. the radio-pill spec) + **1 in `libs/falcon`** (user-details-page). New vs the prior sweep: the legacy `wallet-balance-management` admin component pair.

> `[CODE]` CORRECTION vs prior "5 consumers" Wave-7 list: `host-shell/.../user-details` moved to `libs/falcon`; `playground.page.html` is gone; the OTP-send-dialog consumer was never real. New real consumers: wb-radio-pill, templates-wizard, flow-type-modal.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B06). wb-radio-pill + templates examples confirmed against live source; Consumer Sweep re-grepped; fabricated `--falcon-radio-bg-checked-inner` token and OTP-send-dialog consumer removed.
🟢 RE-VERIFIED 2026-06-03 (W1-c VERIFY) — consumer sweep re-grepped: 13 `apps/` files + 1 `libs/falcon` file; ADDED the legacy `wallet-balance-management` admin consumer that the prior sweep missed.
