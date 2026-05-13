# falcon-button — USAGE

## Real usage examples (cited from active source)

### 1. Settings tab header strip — Edit / Cancel / Save (icon slots + loading + disabled)

`apps/admin-console/src/app/features/organization-hierarchy/components/tab-components/settings-tab/settings-tab.component.html` (lines 10-27):

```html
@if (mode() === 'view') {
  <falcon-angular-button
    [label]="'common.edit' | translate"
    (falconClick)="onEdit()">
    <i slot="icon-start" class="falcon-icon falcon-icon-pencil"></i>
  </falcon-angular-button>
} @else {
  <falcon-angular-button
    [label]="'common.cancel' | translate"
    variant="ghost"
    (falconClick)="onCancel()" />
  <falcon-angular-button
    [label]="'common.save' | translate"
    [disabled]="!formValid() || !formDirty()"
    (falconClick)="onSave()">
    <i slot="icon-start" class="falcon-icon falcon-icon-check"></i>
  </falcon-angular-button>
}
```

Notes:
- `label` is bound to the translated string — `<i slot="icon-start">` is content-projected next to the label.
- `variant="ghost"` is the canonical pattern for secondary / Cancel actions.
- `disabled` is computed from form signals; loading would go here if Save were async.

### 2. Drawer footer — Cancel + Save with loading state

`apps/admin-console/src/app/features/organization-hierarchy/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` (lines 42-54):

```html
<div slot="footer" class="flex items-center justify-end gap-2 px-6 py-4 border-t border-falcon-neutral-150">
  <falcon-angular-button
    type="button"
    variant="ghost"
    [label]="'common.cancel' | translate"
    (falconClick)="onCancel()" />
  <falcon-angular-button
    type="button"
    [label]="(mode() === 'add' ? 'hierarchy.drawer.addNode.save' : 'hierarchy.drawer.editNode.save') | translate"
    [loading]="busy()"
    [disabled]="!canSave()"
    (falconClick)="onSave()" />
</div>
```

Notes:
- This is the canonical drawer-footer pattern: ghost Cancel + primary Save.
- `loading` is bound to a signal; the spinner overlay appears, label fades to `opacity: 0`, native button is disabled until `busy() === false`.

### 3. Icon-only button — playground reference matrix

`apps/host-shell/src/app/playground/playground.page.html` (lines 1130-1140):

```html
<falcon-angular-button
  [variant]="variant"
  [size]="'md'"
  [iconOnly]="true"
  [ariaLabel]="variant + ' icon-only shadow'"
  (falconClick)="handleButtonClick()">
  <svg slot="icon-start" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</falcon-angular-button>
```

Notes:
- `iconOnly=true` triggers the square-aspect mode (`--falcon-button-icon-only-size-md: 38px` → 38×38).
- `ariaLabel` is **mandatory** here — without it the rendered button has no accessible name. The Stencil component does NOT auto-fill this.
- `<svg slot="icon-start">` is the SVG equivalent of `<i slot="icon-start" class="falcon-icon ...">` — both work.

## Recommended usage for new Angular pages

```html
<!-- Primary submit -->
<falcon-angular-button
  type="submit"
  [label]="'common.save' | translate"
  [loading]="saving()"
  [disabled]="!form.valid"
  (falconClick)="onSubmit()" />

<!-- Secondary cancel -->
<falcon-angular-button
  variant="ghost"
  [label]="'common.cancel' | translate"
  (falconClick)="onCancel()" />

<!-- Icon-only kebab (with menu host) -->
<falcon-angular-button
  variant="ghost"
  size="sm"
  [iconOnly]="true"
  ariaLabel="More actions"
  (falconClick)="menu.showAt($event.currentTarget as HTMLElement, $event)">
  <i slot="icon-start" class="falcon-icon falcon-icon-more-vertical"></i>
</falcon-angular-button>
```

Default `useTailwind=true` (Light DOM) is the preferred mode — Tailwind utilities + tokens cascade from the parent app. Drop to `useTailwind=false` only when you need true Shadow-DOM style isolation (e.g. rendering inside a host that already pollutes class names).

## Reactive forms example
Buttons are not form controls — no CVA / ngModel binding. The standard pattern is:

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  ...
  <falcon-angular-button
    type="submit"
    [label]="'common.save' | translate"
    [disabled]="form.invalid || form.pristine"
    [loading]="saving()" />
</form>
```

`type="submit"` makes it participate in the native submit flow — `(ngSubmit)` on the form fires; `falconClick` will ALSO fire for the click event, so usually you handle submission from `(ngSubmit)` and don't bind `(falconClick)` for type=submit buttons.

## ngModel example
Not applicable.

## Tailwind-only usage
The wrapper is already Tailwind-driven by default (`useTailwind=true` → `<falcon-button-tw>`). Inside that path the inner classes are emitted by `libs/falcon-ui-core/src/tailwind/button-tailwind-classes.ts` from the same `falconButtonRootClasses({ ... })` helper that mirrors the Shadow token mapping.

Caller-side Tailwind use is limited to layout — wrap buttons in `flex items-center gap-2 justify-end` etc.; do NOT add color / border / padding utilities to the host element (would conflict with the inner-tag layout).

## Token override (per-instance)
Add a host class:

```html
<falcon-angular-button
  class="my-special-button"
  variant="primary"
  [label]="'Save'" />
```

Then in `app.tailwind.css` (or any preloaded layer-after-component-tokens stylesheet):

```css
.my-special-button {
  --falcon-button-primary-bg: var(--color-falcon-teal-700);
  --falcon-button-primary-bg-hover: var(--color-falcon-teal-800);
  --falcon-button-border-radius: 999px; /* pill */
}
```

Per Falcon SSOT rule, NEVER hardcode hex values here — always reference a Falcon palette token.

## Bad usage to avoid

- Don't add Tailwind color / padding / border utilities to the host `<falcon-angular-button>` — the inner button shadow won't see them (Shadow mode) and the Light-DOM template overrides them anyway. Use the token override pattern instead.
- Don't bind `[value]` — bind `[valueAttr]` (Angular conflict).
- Don't omit `ariaLabel` when `iconOnly=true` and there's no label.
- Don't reach into the rendered Shadow root or query `part="root"` to mutate — change tokens instead.
- Don't use `link` variant for routing — that's `<a [routerLink]>` work. `link` is for inline-text affordances.
- Don't toggle `disabled` and `loading` simultaneously to indicate "saving" — just `loading=true` (loading also disables).

## Import requirements
```ts
@Component({
  standalone: true,
  imports: [FalconAngularButtonComponent /*, plus translation pipes etc. */],
  ...
})
```

The wrapper is `standalone: true` and uses `CUSTOM_ELEMENTS_SCHEMA` internally to render the Stencil tag. Consumers do NOT need `CUSTOM_ELEMENTS_SCHEMA` themselves when using the Angular wrapper — they DO need it if they render `<falcon-button>` / `<falcon-button-tw>` raw.

The wrapper auto-registers the Stencil tag via `defineFalconTwComponent('falcon-button')` in `ngOnInit()` — no manual `defineCustomElements()` call needed in the consumer.

## Do / Don't

| Do | Don't |
|---|---|
| Use `variant="ghost"` for Cancel | Use `variant="link"` for Cancel |
| Use `<i slot="icon-start" class="falcon-icon falcon-icon-X">` for icons | Use `pi pi-X` (PrimeIcons banned Wave PR-8) |
| Pass translated string to `label` | Place translated text inside the host with no `label` (it won't render — only `slot="label"` content works) |
| Bind `[loading]` to async-busy signal | Toggle both `[disabled]` and `[loading]` |
| Set `ariaLabel` when icon-only | Rely on icon visual to convey purpose to screen readers |
| Override tokens via `class="my-host"` + `.my-host { --falcon-button-* }` | Override via `::ng-deep` or `[style]` |
| Use `useTailwind=true` (default) for net-new code | Reach for `useTailwind=false` unless you specifically need Shadow isolation |
