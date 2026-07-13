# falcon-dropdown — USAGE

> Sweep-refreshed 2026-06-03 (B04). Verified 2026-06-03 (W1-b). Consumer Sweep re-run — count jumped from 13 (Wave 7) to **54 distinct files** (51 under `apps/` + 3 under `libs/falcon/`) as templates/contracts/wallet features adopted it. (Prior dossier said "57 across apps/"; the W1-b re-grep landed 51 in `apps/` + 3 in `libs/falcon/` = 54 — count drifts with grep scope since TS option-source files are included.)

## Real usage examples (active codebase)

### Example 1 — Status picker (admin-console add-user wizard)

`[CODE]` `apps/admin-console/.../org-hierarchy-page/.../add-user-wizard/user-role-status-step/user-role-status-step.component.html`:

```html
<falcon-angular-dropdown
  [label]="'hierarchy.addUser.fields.status.label' | translate"
  [placeholder]="'common.choose' | translate"
  [options]="statusOptions()"
  [state]="statusError() ? 'error' : 'default'"
  [errorText]="statusError() | translate"
  [required]="true"
  [clearable]="true"
  [(ngModel)]="value().status">
</falcon-angular-dropdown>
```

### Example 2 — Searchable picker (long list)

```html
<falcon-angular-dropdown
  label="Country"
  [options]="countryOptions"
  [searchable]="true"
  searchPlaceholder="Search country..."
  [(ngModel)]="selectedCountry">
</falcon-angular-dropdown>
```

### Example 3 — Language picker with per-option icons (Wave 4 `iconUrl`)

```ts
languages: FalconDropdownOption[] = [
  { value: 'en', label: 'English',  iconUrl: '/assets/flags/en.svg' },
  { value: 'ar', label: 'العربية', iconUrl: '/assets/flags/ar.svg' },
];
```

```html
<falcon-angular-dropdown
  [options]="languages"
  [(ngModel)]="currentLang"
  variant="search"
  size="sm">
</falcon-angular-dropdown>
```

### Example 4 — Shadow path with `slot="options"` (custom panel content)

`[CODE]` `apps/admin-console/.../add-client-wizard/client-account-owner-step/client-account-owner-step.component.html` uses the bare `<falcon-dropdown>` Stencil tag (`useTailwind=false`). Only the Shadow path supports the `options` slot:

```html
<falcon-angular-dropdown [useTailwind]="false" [options]="owners" [(ngModel)]="ownerId">
  <div slot="options">
    <!-- fully custom listbox content; replaces the default option loop -->
  </div>
</falcon-angular-dropdown>
```

> Tailwind mode (default) has NO `options` slot (GAP G1). Use `iconUrl` on options for the icon-left-of-label case, or drop to Shadow mode for full panel custom rendering.

## Recommended usage for NEW Angular pages

- Always bind via Reactive Forms (`formControlName`) or `[(ngModel)]` — never `[value]`.
- Set `searchable=true` when options > ~10.
- Set `clearable=true` for optional fields.
- Use `errorText` + `state="error"` together.
- Prefer `iconUrl` on options over slot-based custom rendering.
- Keep `useTailwind=true` (default) for Studio token-runtime + cross-framework parity + body-portaled panel that escapes ancestor stacking contexts.

## Reactive Forms

```ts
form = new FormGroup({
  status: new FormControl<string | null>(null, Validators.required),
});
```

```html
<falcon-angular-dropdown
  formControlName="status"
  [label]="'Status'"
  [options]="statusOptions"
  [errorText]="form.controls.status.touched && form.controls.status.invalid ? 'Required' : ''"
  [state]="form.controls.status.touched && form.controls.status.invalid ? 'error' : 'default'">
</falcon-angular-dropdown>
```

## ngModel

```html
<falcon-angular-dropdown [options]="options" [(ngModel)]="selectedValue"></falcon-angular-dropdown>
```

## Tailwind-only usage

```html
<falcon-angular-dropdown class="w-full max-w-xs" ... />
```

Wrapper-scoped Tailwind extras (Tailwind path only — Shadow path ignores them, GAP G8):

```html
<falcon-angular-dropdown
  triggerClass="border-2"
  panelClass="shadow-2xl"
  optionClass="hover:bg-falcon-teal-tint"
  ... />
```

## Token usage (per-instance override pattern)

```html
<falcon-angular-dropdown class="brand-dropdown" ... />
```

```css
.brand-dropdown {
  --falcon-dropdown-border-color-focus: var(--color-falcon-teal-500);
  --falcon-dropdown-border-radius: 12px;
  --falcon-dropdown-panel-max-height: 280px;
}
```

> `[CODE]` Because the panel is body-portaled into `.falcon-overlay-container`, the token file scopes that container too (`dropdown.tokens.css:66-73`) so the portaled panel still inherits `--falcon-dropdown-*`. A per-instance host-class override on the trigger does NOT reach the portaled panel; to restyle the portaled panel per-instance, use `panelClass` (Tailwind path).

## Bad usage to avoid

- Do NOT use for multi-select → `<falcon-angular-multi-select>`.
- Do NOT pass `errorMessage` on the Angular wrapper — the wrapper input is `errorText` (it maps to the Stencil `error-message` attr internally).
- Do NOT bind `[value]` directly — use CVA.
- Do NOT use `[attr.disabled]` — use `[disabled]="…"` (property binding; the `[attr.*]` form bypasses the setter).
- Do NOT hand-roll a search input around the dropdown — use `searchable=true`.
- Do NOT expect `slot="options"` or `panelClass`/`triggerClass` to work in the default Tailwind mode for custom panel content — switch to `useTailwind=false` for the `options` slot.
- Do NOT push options imperatively via `nativeElement.options =` — use the `[options]` setter (it race-guards Stencil hydration via `componentOnReady`).

## Do / Don't

| Do | Don't |
|---|---|
| Use the `[options]` setter — wrapper handles Stencil prop timing + value re-assert. | Push options imperatively to `nativeElement.options`. |
| Use `iconUrl` for flag/avatar visuals. | Wrap in legacy `<falcon-form-field>` unless mixed-control layout demands it. |
| Use `searchable=true` for long lists. | Hand-roll a filter on top of the component. |
| Use `errorText` + `state="error"` together. | Pass `errorMessage` (wrong input name on the wrapper). |
| `[disabled]="cond"` (property binding). | `[attr.disabled]` (bypasses the setter). |

## Consumer Sweep (2026-06-03)

`[CODE]` `Grep "<falcon-angular-dropdown"` returned **54 distinct files** (HTML templates + TS option-source files): **51 under `apps/`** + **3 under `libs/falcon/`** (`shared-features/service-pricing-table`, `shared-features/comm-mkt-view`, `shared-features/user-details/components/user-details-page`). Verified 2026-06-03 (W1-b). Notable clusters:

- **Templates** (admin + mgmt): `templates-list`, `templates-wizard/steps/step1-basic-info`, `step2-message-structure`, `flow/{flow-type-modal,flow-editor,flow-card}`, `buttons/button-card`.
- **Org-hierarchy** (admin + mgmt): `add-user-wizard/{user-role-status-step,user-permissions-step}`, `add-client-wizard/{client-information-step,client-account-owner-step,client-comm-channels-step,client-applications-step}`, `falcon-org-info-panel`.
- **Contracts-cost-management** (admin + mgmt): `contracts-add-wizard/{contract-details-step,rate-card-step,contract-information-step}`, `contracts-{contract-details,rate-card}-section`, `contracts-edit-contract`.
- **Wallet** (admin + mgmt): `new-wallet-balance` (+ `wb-balance-transfer-drawer`, `wb-settings-card`, `wb-client-view`), `wallet-balance-management/balance-transfer`.
- **host-shell:** `auth/login-layout`.

> The 4 `new-wallet-balance/__tests__/*.spec.ts` matches are STANDARDS specs asserting the feature uses `<falcon-angular-dropdown>` (not native), not runtime consumers.

## Verification
🟢 code-verified examples (cited files) + 🟢 grep-verified consumer count (2026-06-03). 🟢 RE-VERIFIED 2026-06-03 (W1-b): consumer count CORRECTED to 54 distinct files (51 `apps/` + 3 `libs/falcon/`); the "57 across apps/" figure was an overcount.
