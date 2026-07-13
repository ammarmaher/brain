# falcon-multi-select — USAGE

## Real usage examples (active codebase)

> Both live consumers use `displayMode="chip-list"` (display-only). The selection picker (search / select-all / clear) has **no production consumer** today — it lives in the Studio gallery only.

### Example 1 — chip-list inside a data-table cell ("Shared with")

`apps/admin-console/src/app/features/templates-page/components/templates-list.component.html:310`:

```html
<ng-template falconDataTableCell="sharedWith" let-row="row">
  @if (row) {
    <falcon-angular-multi-select
      displayMode="chip-list"
      [options]="namesToOptions(row.sharedWith)"
      [maxChipsVisible]="1"
      [readonly]="state.isFalconView()"
      [popoverTitle]="'templates.toolbar.sharedWithMore' | translate" />
  }
</ng-template>
```

The designer renders ONE chip + a "+N" badge → consumers pass `maxChipsVisible=1`. The +N button opens the names dialog. `[readonly]` (Falcon view) makes the badge non-interactive. The `options` array is built client-side from the row's names (`namesToOptions`).

### Example 2 — chip-list in a detail panel with a per-instance token override

`apps/admin-console/src/app/features/templates-page/components/templates-details/templates-details.component.html:120`:

```html
<falcon-angular-multi-select
  class="[--falcon-multi-select-chip-row-gap:8px]"
  displayMode="chip-list"
  [readonly]="true"
  [maxChipsVisible]="tpl.sharedWith.length"
  [options]="namesToOptions(tpl.sharedWith)" />
```

`maxChipsVisible = total names` → every name shows as a chip, no overflow. The `[--falcon-multi-select-chip-row-gap:8px]` arbitrary-utility on the host overrides the chip-row gap token for this instance only (the canonical per-instance token-override pattern).

### Example 3 — mgmt mirrors

`apps/management-console/.../templates-list.component.html:315` and `.../templates-details/templates-details.component.html:120` are the management-console twins of Examples 1 & 2 (identical shape).

## Recommended usage for NEW Angular pages

### Display-only chip strip (most common need)

```html
<falcon-angular-multi-select
  displayMode="chip-list"
  [options]="namesToOptions(row.tags)"
  [maxChipsVisible]="1"
  [popoverTitle]="'common.moreItems' | translate"
  [readonly]="isReadonly" />
```

### Multi-value selection picker

```html
<falcon-angular-multi-select
  [label]="'role.permissions' | translate"
  [options]="permissionOptions"
  [searchable]="true"
  [clearable]="true"
  [showSelectAll]="true"
  [maxChipsVisible]="5"
  [(ngModel)]="selectedPermissions">
</falcon-angular-multi-select>
```

Defaults are tuned for the picker: `useTailwind=true`, `displayMode='default'`, `size='md'`, `state='default'`. Set `searchable=true` for > 10 options; `showSelectAll=true` when the user is likely to want all.

## Reactive Forms

```ts
form = new FormGroup({
  perms: new FormControl<(string | number)[]>([], { nonNullable: true }),
});
```

```html
<falcon-angular-multi-select
  formControlName="perms"
  [options]="permissionOptions"
  [searchable]="true">
</falcon-angular-multi-select>
```

## ngModel (template forms)

```html
<falcon-angular-multi-select [options]="options" [(ngModel)]="selectedValues">
</falcon-angular-multi-select>
```

## Tailwind-only usage

```html
<falcon-angular-multi-select class="w-full max-w-md" [options]="opts" [(ngModel)]="v" />
```

For wrapper-scoped customization in the Tailwind/Light path use the `*Class` inputs (forwarded as `*-extra-class`):

```html
<falcon-angular-multi-select
  triggerClass="hover:border-falcon-teal-500"
  panelClass="max-h-72"
  [options]="opts" [(ngModel)]="v" />
```

## Token usage (per-instance override pattern)

Add a host class (or arbitrary utility) on the consumer and mutate `--falcon-multi-select-*`:

```css
.priority-multi {
  --falcon-multi-select-chip-bg: var(--color-falcon-teal-tint);
  --falcon-multi-select-chip-text-color: var(--color-falcon-teal-700);
  --falcon-multi-select-chip-radius: 4px;
}
```

> Both Shadow + Light read the same tokens via the `:where(falcon-multi-select, falcon-multi-select-tw, falcon-angular-multi-select, .falcon-multi-select, [data-falcon-multi-select], .falcon-overlay-container)` chain. The `.falcon-overlay-container` member is required because the `-tw` panel **portals into the body overlay container** — without it the portaled panel would lose `--falcon-multi-select-*` (gate-12 portal trap).

## Do / Don't

| Do | Don't |
|---|---|
| Use `displayMode="chip-list"` for display-only chip strips. | Build a custom chip strip + popover by hand. |
| Use `[options]` + `[(ngModel)]`/`formControlName`. | Bind `[values]` directly (races CVA). |
| Build the `options` array client-side and feed the setter. | Push options imperatively onto the inner Stencil element. |
| Set `maxChipsVisible` to a sensible cap. | Read the selection count from visible chips (overflow hides the rest). |
| Override visuals via host-class token mutation. | Hardcode hex/px in `style=` or write component CSS rules. |
| Use `searchable=true` for long lists. | Use it for ≫200 options (no virtualization). |
| Use `@if`/`@for` in the surrounding template. | Use `*ngIf`/`*ngFor` (project rule). |

## Bad usage to avoid

- **Do NOT** use for single-select → `<falcon-angular-dropdown>`.
- **Do NOT** rely on `slot="options"` in Tailwind mode — it is Shadow-only (GAP G11).
- **Do NOT** expect `(searched)` / `(chipRemoved)` / `(added)` outputs — only `valuesChange`/`opened`/`closed`/`showMoreClick` are surfaced (GAP G6/G10).
- **Do NOT** treat `maxChipsVisible` as a `maxSelected` cap — it is cosmetic (GAP G8).
- **Do NOT** add `pi pi-*` icons — PrimeIcons are removed; use `slot="icon-left"` + the Falcon icon font.

## Consumer Sweep (2026-06-03)

[CODE] grep `<falcon-angular-multi-select` across `apps/` + `libs/falcon/` returned **4 real consumer files** (all `displayMode="chip-list"`):

- `apps/admin-console/src/app/features/templates-page/components/templates-list.component.html`
- `apps/admin-console/src/app/features/templates-page/components/templates-details/templates-details.component.html`
- `apps/management-console/src/app/features/templates-page/components/templates-list.component.html`
- `apps/management-console/src/app/features/templates-page/components/templates-details/templates-details.component.html`

Non-consumer references (excluded from the count): `apps/management-console/.../share-group-step.component.html` (comment-only, B-CG-2 not-migrated), `libs/falcon-studio/.../gallery-defaults.ts` (showcase), `libs/falcon/src/shared-ui/.../falcon-multiselect/*` (the deprecated legacy component, not this one). Prior Wave 7 sweep counted "3" but those were the legacy component + playground — the picture changed: real usage is now the templates chip-list.

## Verification
🟢 code-verified — examples cite live `templates-list`/`templates-details` files (read 2026-06-03). Consumer count 🟢 grep-verified 2026-06-03 and corrected. Selection-picker examples 🟡 recommended-usage (no live picker consumer to cite). 🟢 RE-VERIFIED 2026-06-03 (W1-b): `<falcon-angular-multi-select` = 4 distinct HTML consumers (admin+mgmt `templates-list` + `templates-details`), all `displayMode="chip-list"`; 0 in `libs/falcon/`. Accurate.
