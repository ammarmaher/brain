# falcon-switch — USAGE

## Real usage examples (active codebase)

### Example 1 — Row visibility toggle in a data table (the canonical consumer)

`libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.html:52-55`:

```html
<falcon-angular-switch
  size="sm"
  [checkedInput]="row.visible"
  (valueChange)="onToggleVisibility(row.id, $event)" />
```

> `[CODE]` Driven by `[checkedInput]` (parent owns the row's confirmed visibility) + `(valueChange)` (fires the toggle). The host-shell `service-pricing.component.ts` gates the disable: `[disabled]="row.visibility && !row.canHide"` — the **origin of the G-25 parent-driven `disabled` input** (a row that visibility-can't-be-hidden disables the toggle to communicate "this row cannot be hidden" rather than silently rejecting the click).

### Example 2 — Per-row enable in Add-Client wizard steps

`apps/admin-console/.../add-client-wizard/client-applications-step/client-applications-step.component.html:37` and `client-comm-channels-step.component.html:37` — a switch per application / comm-channel row, the operator's opt-in for the new client.

### Example 3 — Share toggle in contact-groups

`apps/management-console/.../contact-groups/share-dialog/share-dialog.component.html:39` + `.../share-group-step.component.html:29`.

### Example 4 — Reactive Forms feature toggle

```ts
form = new FormGroup({ emailAlerts: new FormControl<boolean>(true, { nonNullable: true }) });
```

```html
<falcon-angular-switch formControlName="emailAlerts" [label]="'Email alerts'"></falcon-angular-switch>
```

## Recommended usage for NEW Angular pages

- Use `dot-knob` (default) for typical feature toggles.
- Use `hidden-input` for compact dense rows.
- Use `channel-pill` for a bordered-pill look; add `[textOn]`/`[textOff]` if the state should also show in words (note: those inner labels render in ANY variant, not just channel-pill).
- Bind via CVA, OR `[checkedInput]` when a parent/table row owns the value.
- For a backend-confirmed toggle: drive `[checkedInput]` from the confirmed-state signal, gate `[disabled]` during the call, re-set the signal on success, leave unchanged on failure (no built-in loading — GAPS G3).

Defaults: `useTailwind=true`, `variant='dot-knob'`, `size='md'`, `value='on'`.

## ngModel (template forms)

```html
<falcon-angular-switch [(ngModel)]="value" [label]="'Toggle'"></falcon-angular-switch>
```

## Tailwind-only usage

```html
<falcon-angular-switch class="mt-3" trackClass="ring-1 ring-falcon-neutral-200" [(ngModel)]="v" />
```

> `rowClass`/`trackClass`/`labelClass` flow on the Tailwind path only.

## Token usage (per-instance override pattern)

```css
.brand-switch {
  --falcon-switch-track-bg-on: var(--color-falcon-teal-500);
  --falcon-switch-knob-bg: var(--color-falcon-neutral-0);
  --falcon-switch-track-w-dot-knob: 44px;   /* per-variant geometry */
}
```

> `[CODE]` Track/knob geometry tokens are **per-variant** (`--falcon-switch-track-w-dot-knob`, `--falcon-switch-knob-translate-channel-pill`, …), not per-size. There are no `--falcon-switch-knob-position-off/on` tokens (the prior dossier invented them) — the knob slides via `translate-x-[var(--falcon-switch-knob-translate-<variant>)]`.

## Bad usage to avoid

- **Do NOT** use for tri-state — switch is strictly boolean.
- **Do NOT** mix `[(ngModel)]` AND `[checkedInput]` on one instance.
- **Do NOT** treat a switch as instantly committed when the backend can reject it — gate `[disabled]` during the call and reconcile with the confirmed state.
- **Do NOT** model a choice between two *named things* (Monthly/Yearly) as a `channel-pill` switch — that is a radio/dropdown decision; the pill labels describe a *state*.
- **Do NOT** use a switch for required form acceptance ("I agree") — use `<falcon-angular-checkbox>`.
- **Do NOT** rely on `size` to make a bigger switch — it only changes the label font (GAPS G8); use a per-variant geometry token override.
- **Do NOT** use `*ngIf` / `*ngFor`.

## Do / Don't

| Do | Don't |
|---|---|
| Use for feature toggles / live row enable. | Use for required form acceptance (use checkbox). |
| Add `textOn`/`textOff` when the state should read in words. | Assume they only work on channel-pill (they work everywhere). |
| Drive backend-confirmed toggles via `[checkedInput]` + `[disabled]`. | Optimistically flip and desync from the server. |
| Override per-variant geometry tokens for sizing. | Expect `size` to enlarge the track. |

## Consumer Sweep (2026-06-03)

[CODE] grep `<falcon-angular-switch[\s>]` returned **4 `.html` render sites in `apps/`** + **1** TS template (host-shell service-pricing) + **1** in `libs/falcon`:

- `libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.html` (1 — canonical row toggle, G-25 origin)
- `apps/host-shell/src/app/shared-components/service-pricing/service-pricing.component.ts` (TS template)
- `apps/admin-console/.../add-client-wizard/client-applications-step/client-applications-step.component.html` (1)
- `apps/admin-console/.../add-client-wizard/client-comm-channels-step/client-comm-channels-step.component.html` (1)
- `apps/management-console/.../contact-groups/share-dialog/share-dialog.component.html` (1)
- `apps/management-console/.../contact-groups/create-contact-group/steps/share-group-step/share-group-step.component.html` (1)

Plus showcase demos: `host-shell/.../falcon-ui-showcase/library-section/{empty-data-section, library-section, uploader-section}.component.ts`.

> `[CODE]` CORRECTION vs prior "7 consumers" Wave-7 list: `playground.page.html` is gone; the exact `applications-table` / `client-service-row-table` paths were not found — the live service-toggle consumers are the add-client app/comm-channels STEP files + service-pricing-table.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B06). service-pricing-table + add-client examples confirmed against live source; Consumer Sweep re-grepped; corrected the channel-pill-only `textOn`/`textOff` claim and the fabricated `knob-position-*` tokens.
🟢 RE-VERIFIED 2026-06-03 (W1-c VERIFY) — PASS. Re-grep: `apps/` = 8 files (service-pricing TS + 3 showcase demos + add-client app/comm-channels steps + contact-groups share-dialog/share-group-step), `libs/falcon` = 1 (service-pricing-table). Matches the enumerated sweep; no correction needed.
