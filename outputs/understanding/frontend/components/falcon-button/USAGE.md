# falcon-button — USAGE

## Real usage examples (active codebase)

### Example 1 — Drawer footer: ghost Cancel + primary Save (loading + disabled)

`apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` (the canonical drawer-footer pattern):

```html
<div slot="footer" class="flex items-center justify-end gap-2 ...">
  <falcon-angular-button
    type="button"
    variant="ghost"
    [label]="'common.cancel' | translate"
    (falconClick)="onCancel()" />
  <falcon-angular-button
    type="button"
    [label]="(mode() === 'add' ? '...addNode.save' : '...editNode.save') | translate"
    [loading]="busy()"
    [disabled]="!canSave()"
    (falconClick)="onSave()" />
</div>
```

- Canonical: ghost Cancel + primary Save. `[loading]="busy()"` → spinner overlay, label fades to `opacity:0`, native button disabled until `busy()===false`.

### Example 2 — Settings-tab header strip: Edit / Cancel / Save with icon slots

`apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/settings-tab/settings-tab.component.html`:

```html
@if (mode() === 'view') {
  <falcon-angular-button [label]="'common.edit' | translate" (falconClick)="onEdit()">
    <i slot="icon-start" class="falcon-icon falcon-icon-pencil"></i>
  </falcon-angular-button>
} @else {
  <falcon-angular-button [label]="'common.cancel' | translate" variant="ghost" (falconClick)="onCancel()" />
  <falcon-angular-button [label]="'common.save' | translate" [disabled]="!formValid() || !formDirty()" (falconClick)="onSave()">
    <i slot="icon-start" class="falcon-icon falcon-icon-check"></i>
  </falcon-angular-button>
}
```

- `<i slot="icon-start">` is content-projected next to the `label` string. `variant="ghost"` is the canonical Cancel/secondary look.

### Example 3 — Wave 9.F variant family in Templates decision cards

`apps/{admin,management}-console/.../templates-page/components/templates-details/templates-details.component.html` (8 occurrences each) uses the four "designer" variants:

```html
<!-- Approve toggle: filled when selected, outline when not -->
<falcon-angular-button [variant]="approved() ? 'primary-dark' : 'outline-primary-dark'" ... />
<!-- Reject toggle: outline-danger when unselected -->
<falcon-angular-button [variant]="rejected() ? 'danger' : 'outline-danger'" ... />
<!-- "+ Create Template" CTA (client view) -->
<falcon-angular-button variant="primary-dark" [label]="'...createTemplate' | translate" ... />
<!-- "Switch perspective" low-emphasis pill -->
<falcon-angular-button variant="outline" [label]="'...switchPerspective' | translate" ... />
```

- These four variants (`primary-dark` / `outline-primary-dark` / `outline-danger` / `outline`) exist specifically for this card per `[CODE]` falcon-button.types.ts:10-17 inline doc.

## Recommended usage for NEW Angular pages

```html
<!-- Primary submit -->
<falcon-angular-button type="submit" [label]="'common.save' | translate"
  [loading]="saving()" [disabled]="!form.valid" (falconClick)="onSubmit()" />

<!-- Secondary cancel -->
<falcon-angular-button variant="ghost" [label]="'common.cancel' | translate" (falconClick)="onCancel()" />

<!-- Icon-only kebab (paired with a falcon-menu host) -->
<falcon-angular-button variant="ghost" size="sm" [iconOnly]="true" ariaLabel="More actions"
  (falconClick)="menu.showAt($event.currentTarget as HTMLElement, $event)">
  <i slot="icon-start" class="falcon-icon falcon-icon-more-vertical"></i>
</falcon-angular-button>
```

Defaults: `useTailwind=true` (Light DOM, preferred), `variant='primary'`, `size='md'`, `type='button'`.

## Reactive Forms

Buttons are not form controls — no CVA. Standard pattern:

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <falcon-angular-button type="submit" [label]="'common.save' | translate"
    [disabled]="form.invalid || form.pristine" [loading]="saving()" />
</form>
```

For `type="submit"`, handle the flow from `(ngSubmit)` — `(falconClick)` ALSO fires, so usually you do NOT bind `(falconClick)` on submit buttons.

## ngModel

Not applicable (stateless trigger).

## Tailwind-only usage

The wrapper is Tailwind-driven by default (`useTailwind=true` → `<falcon-button-tw>`, classes from `button-tailwind-classes.ts`). Caller-side Tailwind use is **layout only** — wrap buttons in `flex items-center gap-2 justify-end`; do NOT add color/border/padding utilities to the host (Shadow mode won't see them; Light-DOM template overrides them).

## Per-instance token override

Add a host class, then mutate `--falcon-button-*` tokens in a stylesheet loaded after the component tokens:

```css
.my-special-button {
  --falcon-button-primary-bg: var(--color-falcon-teal-700);
  --falcon-button-primary-bg-hover: var(--color-falcon-teal-800);
  --falcon-button-border-radius: 999px; /* pill */
}
```

> Tokens are inherited through Shadow DOM and matched by the `:where(falcon-button, falcon-button-tw, falcon-angular-button, …)` selector chain, so the override wins on BOTH render paths. NEVER hardcode hex — always reference a `--color-falcon-*` palette token.

## Do / Don't

| Do | Don't |
|---|---|
| Use `variant="ghost"` for Cancel | Use `variant="link"` for Cancel |
| Use `<i slot="icon-start" class="falcon-icon falcon-icon-X">` for icons | Use `pi pi-X` (PrimeIcons removed Wave PR-8) |
| Pass a translated string to `[label]` | Put bare text inside the host with no `label` (only `slot="label"` content renders) |
| Bind `[loading]` to the async-busy signal | Toggle BOTH `[disabled]` and `[loading]` (loading already disables) |
| Set `ariaLabel` when `iconOnly` | Rely on the icon glyph to convey purpose to AT |
| Override via host class + `--falcon-button-*` tokens | Override via `::ng-deep` / `[style]` / `part="root"` mutation |
| Use `useTailwind=true` (default) | Reach for `useTailwind=false` unless you truly need Shadow isolation |
| Bind `[valueAttr]` for form value | Bind `[value]` (clashes with Angular) |

## Consumer Sweep (2026-06-03)

[CODE] grep `<falcon-angular-button` across `apps/` returned **249 occurrences / 71 files**; across `libs/falcon/` **11 occurrences / 3 files** (W1-c re-grep 2026-06-03 — up from the prior "182 / 55"; the codebase added the whole `contracts-cost-management` feature + `contact-group-detail` + more wallet/template usage). Heaviest clusters:

- **Templates-page** (BOTH consoles): `templates-details` (8 each — decision cards), `templates-wizard/steps/step2-message-structure` (9 each), `step1-basic-info` (2), `templates-wizard.component` (4), `whatsapp-preview` (4), `flow/{flow-type-modal (6), flow-editor (5), flow-card (3)}`, `buttons/button-card` (1), `templates-list` (2).
- **Org-hierarchy-page** (BOTH consoles): `org-hierarchy-page-menu.component.{html (11-12),ts}`, `falcon-org-node-drawer.component.{html (5),ts}`, `falcon-org-node-header` (1), `settings-tab` (3), `add-{client,user}-wizard` (3 each), `client-settings-step.{html (5),ts}`.
- **new-wallet-balance** (BOTH consoles): `wb-settings-card` (4), `wb-allocation-table.{html (2),ts}`, `wb-balance-transfer-drawer` (3), `wb-client-view` (3), `new-wallet-balance.component.{html,ts}` + `__tests__/standards.spec.ts`.
- **wallet-balance-management** (admin): `balance-transfer.component.html` (3).
- **contact-groups** (mgmt): `share-dialog` (2), `contact-groups-list` (2).
- **host-shell auth**: `get-started`, `forgot-password-flow`, `change-password` (1 each html). `[CODE]` Stale `<falcon-angular-button>` selector refs ALSO linger in `login-layout.component.scss` (2), `get-started.component.scss` (1), `change-password.component.scss` (1) — leftover SCSS targeting the host (the auth feature still carries `.scss`, the wallet-port exception aside; see GAPS).
- **libs/falcon**: `shared-features/user-details/user-details-page.component.html` (7); `shared-features/comm-mkt-view/.../comm-mkt-card.component.ts` (2); `shared-ui/lib/components/falcon-node-details-section/falcon-node-details-section.component.ts` (1).
- **contracts-cost-management** (BOTH consoles — NEW since the prior sweep): `contracts-cost-management.component.html`, `contracts-view-contract` (1-2), `contracts-edit-contract` (2), `contracts-add-wizard` (4).
- **contact-group-detail** (BOTH consoles — NEW): `contact-group-detail.component.html` (5 admin / 10 mgmt).
- **showcase**: `apps/host-shell/.../falcon-ui-showcase/library-section/library-section.component.ts` (the full variant×size×state matrix demo).

> `[INFERRED]` count rose again at the W1-c re-grep (249/71 in apps, up from 182/55) mainly because the `contracts-cost-management` feature and `contact-group-detail` landed in both consoles and Templates/wallet usage deepened. The prior `host-shell playground.page.html` reference is GONE (playground route removed → `falcon-ui-showcase`).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B17). Examples 1-3 confirmed against live source paths; Consumer Sweep re-run. Stale `playground.page.html` reference removed; residual `.scss` selector refs in auth flows recorded.
🟢 RE-VERIFIED 2026-06-03 (W1-c VERIFY) — consumer sweep re-grepped: **249 occurrences / 71 files in `apps/` + 11 / 3 in `libs/falcon`** (was 182/55 + 10/3). ADDED the `contracts-cost-management` + `contact-group-detail` clusters (both consoles).
