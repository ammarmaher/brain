# falcon-card — USAGE

## Real usage examples (active codebase)

> **The dominant production pattern is `variant="outlined"` + content in the DEFAULT body `<ng-content>`** (a plain `<div class="...p-4">` inside the tags) — `[header]`/`[footer]` props and `[slot=header]`/`[slot=footer]` projection are rarely used in practice.

### Example 1 — Section card, default body slot (production)

`[CODE]` `apps/management-console/src/app/features/contact-groups/contact-group-detail/contact-group-detail.component.html:96-242`:

```html
<falcon-angular-card variant="outlined">
  <div class="flex flex-col gap-4 p-4">
    <h2 class="text-base font-bold text-falcon-neutral-900">{{ 'contactGroups.detail.groupDetails' | translate }}</h2>
    <!-- detail grid, status, edit form, etc. -->
  </div>
</falcon-angular-card>
```

> Content goes into the default `<ng-content>` (body). The consumer renders its own `<h2>` inside the body rather than using the `[header]` prop — common, because the prop-`<h3>` is a fixed heading level and the consumer wants `<h2>`.

### Example 2 — Error banner via `rootClass` accent

`[CODE]` `apps/admin-console/.../contact-groups/contact-groups-list/contact-groups-list.component.html:49-54` (also contact-group-detail.component.html:40):

```html
<falcon-angular-card variant="outlined" rootClass="border-falcon-error-200 bg-falcon-error-50">
  <div class="flex items-center gap-2 p-3 text-sm text-falcon-error-700">
    <span class="falcon-icon falcon-icon-alert-triangle"></span>
    <span>{{ errorMessage() }}</span>
  </div>
</falcon-angular-card>
```

> `rootClass` is the per-instance override channel — appended to the root `classes()`. Here it tints the surface to an error banner.

### Example 3 — Plain text header + subheader + body (prop-driven)

```html
<falcon-angular-card [header]="'Account Details'" [subheader]="'Last updated 2 hours ago'" variant="default" size="md">
  <p>Account information panel body.</p>
</falcon-angular-card>
```

> `[header]`/`[subheader]` render an Angular `<header>` with an `<h3>` + `<p>`; body content goes into the default `<ng-content>`.

### Example 4 — Rich header slot (use INSTEAD of the prop)

```html
<falcon-angular-card variant="outlined">
  <div slot="header" class="flex items-center justify-between gap-2 px-4 pt-4 pb-3">
    <h3 class="text-base font-semibold m-0 text-falcon-neutral-900">Permissions</h3>
    <falcon-angular-button variant="ghost" size="sm" [label]="'common.edit' | translate" (falconClick)="onEdit()"></falcon-angular-button>
  </div>
  <ul class="px-4 py-3">...</ul>
</falcon-angular-card>
```

> **Leave `[header]` empty** — projecting `slot="header"` AND passing `[header]` renders both (footgun). The projected element must carry the `slot="header"` attribute (Angular `<ng-content select="[slot=header]">`).

## Recommended usage for NEW Angular pages

- Most cases: `<falcon-angular-card variant="outlined">` + body content in the default `<ng-content>`.
- For a token-accent surface (error/info banner): add `rootClass="…"`.
- For a simple titled section: use `[header]`/`[subheader]` props.
- For a header with an action button: project `slot="header"` and leave `[header]` empty.

## Reactive forms / ngModel
Not applicable — card is not a form control.

## Tailwind-only usage
`[CODE]` The wrapper renders Angular chrome whose classes come from the LIVE `classes()`/`bodyClasses()`/… `computed()` helpers (hardcoded `bg-falcon-*` palette utilities). Add per-instance Tailwind via `rootClass` (root) or `class=` on the host (layout). Host `bg-*`/`border-*` utilities on `<falcon-angular-card>` do NOT reach the inner root — use `rootClass`.

## Token override example (Shadow path / React-Vue only)
`[CODE]` `card.tokens.css` `--falcon-card-*` vars are consumed by the **Shadow `<falcon-card>`** (React/Vue) — **NOT by the Angular wrapper**, which uses hardcoded palette utilities. On the Angular path, override via `rootClass` + palette utilities instead:

```html
<falcon-angular-card rootClass="rounded-[14px] shadow-md" variant="outlined">...</falcon-angular-card>
```

## Bad usage to avoid

- **DON'T** pass `[header]` AND project `slot="header"` — both render (duplicate title). Pick one.
- **DON'T** expect `--falcon-card-*` token overrides to restyle the Angular wrapper — they only bite the Shadow path (React/Vue). Use `rootClass`.
- **DON'T** try to make the whole card clickable — there is no `interactive`/`selected`/click state. Wrap in your own `<button>` if needed.
- **DON'T** put a card inside a dialog/drawer/popup — those own a surface; a card inside is a double surface.
- **DON'T** add host `bg-*`/`border-*` utilities expecting them to reach the root — use `rootClass`.
- **DON'T** use `*ngIf`/`*ngFor` around it — use `@if`/`@for`.

## Import requirements (standalone component)
```ts
import { FalconAngularCardComponent } from '@falcon/ui-core';

@Component({ standalone: true, imports: [FalconAngularCardComponent], ... })
// NOTE: no CUSTOM_ELEMENTS_SCHEMA needed — the wrapper renders plain Angular <div>s.
```

## Do / Don't

| Do | Don't |
|---|---|
| Put content in the default body `<ng-content>`. | Pass `[header]` AND project `slot="header"`. |
| Use `rootClass` for per-instance accents (error banner). | Expect `--falcon-card-*` tokens to recolor the Angular path. |
| Use `variant="outlined"` for nested/summary cards. | Use the card for clickable tiles (no interactive mode). |
| Wrap data grids / detail blocks for a framed section. | Wrap a dialog in a card. |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `falcon-angular-card` across `apps/` → **10 files / 42 occurrences**; across `libs/falcon/` → **1 file / 3 occurrences**. Full list:

**apps/ (10 files):**
- `apps/admin-console/.../wallet-balance-management/wallet-balance-management.component.html` (9)
- `apps/management-console/.../wallet-balance-management/wallet-balance-management.component.html` (2)
- `apps/management-console/.../contact-groups/contact-group-detail/contact-group-detail.component.html` (6)
- `apps/management-console/.../contact-groups/create-contact-group/create-contact-group.component.html` (6)
- `apps/management-console/.../contact-groups/create-contact-group/steps/review-create-step/review-create-step.component.html` (6)
- `apps/management-console/.../contact-groups/create-contact-group/steps/preview-configure-step/preview-configure-step.component.html` (2)
- `apps/{admin,management}-console/.../contact-groups/contact-groups-list/contact-groups-list.component.html` (2 each — error banner)
- `apps/admin-console/.../contracts-cost-management/components/contracts-view-contract/contracts-view-contract.component.ts` (1)

**libs/falcon/ (1 file):**
- `libs/falcon/src/shared-features/comm-mkt-view/components/card/comm-mkt-card.component.ts` (3)

> No raw `<falcon-card>` / `<falcon-card-tw>` Stencil-tag usage in `apps/`. `[INFERRED]` count rose from the prior Wave-7 "1" as wallet-balance-management + the contact-groups feature (detail / create / review / preview / list-error-banner) adopted the component.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B10). Examples 1-2 confirmed against live source (contact-group-detail.component.html:96-242, contact-groups-list.component.html:49-54). Consumer Sweep re-run (`falcon-angular-card` → 10 app files / 42 + 1 lib / 3) — corrects the prior "1"/"no matches". Dominant pattern = `variant="outlined"` + default body `<ng-content>` + optional `rootClass`.
