# falcon-form-field — USAGE

> **REFRESHED 2026-06-03 (B24).** Consumer sweep re-run (5 → 10 live templates, now BOTH consoles + templates-page). SCSS-migration references removed (no stylesheet exists — `TOKENS.md`/`GAPS`).

## Real usage examples (active codebase)

### Example 1 — Wrapping a Falcon input (LEGACY pattern; new code should not do this)

`[CODE]` `apps/management-console/.../add-user-wizard/user-personal-step/user-personal-step.component.html`:

```html
<falcon-form-field
  label="hierarchy.addUser.fields.firstName.label"
  [required]="true"
  [errorKey]="firstNameError()?.key ?? null"
  [errorParams]="firstNameError()?.params ?? null">
  <falcon-angular-input type="text" class="w-full"
    [state]="firstNameError() ? 'error' : 'default'"
    [placeholder]="'hierarchy.addUser.fields.firstName.placeholder' | translate"
    [ngModel]="value().firstName"
    (ngModelChange)="updateField('firstName', $event)"
    (blur)="onBlur('firstName')" />
</falcon-form-field>
```

> This double-handles the label (form-field `label` + `<falcon-angular-input>` has its own built-in label support). New code should drop `<falcon-form-field>` and use the input's built-in `label` / `required` / `errorMessage`. Note the **state-sync discipline**: `[errorKey]` on the wrapper AND `[state]="…'error':'default'"` on the inner input (the wrapper does not cross-bind — G5).

### Example 2 — Wrapping a non-Falcon control (still valid)

```html
<falcon-form-field
  label="profile.bio"
  hint="profile.bioHint"
  [errorKey]="bioError() ? 'profile.bioErr' : null">
  <my-custom-rich-editor [(value)]="bio"></my-custom-rich-editor>
</falcon-form-field>
```

### Example 3 — Templates wizard step (templates-page, BOTH consoles)

`[CODE]` `apps/{admin,management}-console/.../templates-page/components/templates-wizard/steps/step1-basic-info.component.html` wraps the basic-info fields in `<falcon-form-field>` (5 occurrences each) — the same legacy labeled-row pattern in a non-org-hierarchy feature.

## Recommended usage for NEW Angular pages

- **DO NOT use `<falcon-form-field>` to wrap `<falcon-angular-*>` inputs.** Use their built-in `label` / `errorMessage` / `required`.
- Use only for non-Falcon controls or mixed-layout rows.
- Migration plan: replace `<falcon-form-field>` wrappers in wizards over time (G3).

## Reactive Forms

The wrapper doesn't bind value — the consumer's `FormGroup` does, and feeds `errorKey`/`required`/`disabled` (typically from `computed()` signals over the form).

## ngModel

Same — the wrapper is purely visual; the slotted input owns `[(ngModel)]`.

## Tailwind-only

`[CODE]` The wrapper IS Tailwind-only (no SCSS — `TOKENS.md`). For layout, add utilities via the host `class=` (host is `block`):

```html
<falcon-form-field class="mb-4" label="profile.bio"> … </falcon-form-field>
```

## Token usage

**No token-override pattern.** There is no `--falcon-form-field-*` namespace. Label/hint colors come from the `--text-2` / `--text-muted` theme tokens (changed at the theme level, not per-field). Do not attempt per-instance token overrides.

## Bad usage to avoid

- Do NOT use to wrap Falcon UI inputs in NEW code (double label — G3).
- Do NOT depend on internal label-for-control association — there is no `for=`; set a shared `inputId` explicitly (G2).
- Do NOT pass already-translated strings — `label` / `hint` / `errorKey` are i18n KEYS.
- Do NOT set `[errorKey]` on the wrapper but leave the inner control's `state` at `default` — `hasError` does not cross-bind (G5).
- Do NOT use `*ngIf`/`*ngFor` in the surrounding template — use `@if`/`@for` (project rule).

## Do / Don't

| Do | Don't |
|---|---|
| Use only for legacy / non-Falcon controls. | Wrap Falcon UI inputs in new code. |
| Pass translation keys. | Pass translated strings directly. |
| Sync `[errorKey]` here + `[state]` on the inner input. | Set only one and expect both red. |
| Migrate to built-in input labels over time. | Add new `<falcon-form-field>` usages. |
| Add layout utilities via host `class=`. | Expect a token override (none exists). |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `<falcon-form-field[\s>]` across the repo → **54 occurrences / 12 files** (10 live consumer templates + 2 docs/plans). Full live list (occurrence counts):

- `apps/admin-console/.../org-hierarchy-page/components/wizard-components/add-client-wizard/client-information-step.component.html` (15) + `client-account-owner-step.component.html` (8)
- `apps/admin-console/.../add-user-wizard/{user-personal-step (6), user-role-status-step (1), user-permissions-step (1)}.component.html`
- `apps/management-console/.../add-user-wizard/{user-personal-step (6), user-role-status-step (1), user-permissions-step (1)}.component.html`
- `apps/{admin,management}-console/.../templates-page/components/templates-wizard/steps/step1-basic-info.component.html` (5 each)
- (non-render: `docs/_plans/W21-wizard-plan.md`, `docs/_plans/W21-W25-wizard-roadmap.md`)

> **Drift corrected:** prior "Wave 7 = 5 consumer files" was admin-console-only and stale. The wrapper is now used in BOTH consoles' add-client + add-user wizards AND in templates-page step1.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B24). Example 1 confirmed against `user-personal-step.component.html`; Example 3 confirmed against `step1-basic-info.component.html`. Consumer sweep re-run (`<falcon-form-field[\s>]` → 54 occ / 12 files; 10 live templates across both consoles + templates-page). The "no SCSS / no token override" facts confirmed from source (`TOKENS.md`).
