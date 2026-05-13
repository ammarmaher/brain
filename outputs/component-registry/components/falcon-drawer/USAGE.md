# falcon-drawer — USAGE

## Real usage example (cited)

`apps/admin-console/src/app/features/organization-hierarchy/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html`:

```html
<falcon-angular-drawer
  [open]="visible()"
  position="right"
  size="md"
  [closable]="false"
  [modal]="true"
  rootClass="falcon-node-drawer"
  (drawerHide)="onHide()">

  <div slot="header" class="flex flex-col gap-1">
    <h3 class="text-lg font-semibold m-0">
      {{ (mode() === 'add' ? 'hierarchy.drawer.addNode.title' : 'hierarchy.drawer.editNode.title') | translate }}
    </h3>
    @if (parentName()) {
      <p class="text-xs text-falcon-neutral-600 m-0">
        {{ 'hierarchy.drawer.under' | translate }} <strong>{{ parentName() }}</strong>
      </p>
    }
  </div>

  <div class="flex flex-col gap-4 p-6">
    <label class="flex flex-col gap-1.5 text-sm">
      <span class="font-medium">{{ 'hierarchy.drawer.nameLabel' | translate }}</span>
      <falcon-angular-input
             type="text"
             [ngModel]="nameValue()"
             (ngModelChange)="nameValue.set($event)"
             [placeholder]="'hierarchy.drawer.namePlaceholder' | translate"
             [state]="!!nameError() && touched() ? 'error' : 'default'"
             (blur)="touched.set(true)" />
      @if (nameError() && touched()) {
        <span class="text-xs text-falcon-red-500">{{ nameError()! | translate }}</span>
      }
    </label>
  </div>

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
</falcon-angular-drawer>
```

Notes:
- `closable=false` — drawer × button is hidden; consumer-owned Cancel button drives close.
- `position="right"`, `size="md"` — canonical right-side detail drawer (480 px wide).
- Header slot includes a sub-line ("Under <parent>") with translated content.
- Footer slot has its own border + padding — the drawer's footer slot is bare (only renders when projected).
- `(drawerHide)` — single handler covers all dismissal reasons (escape, backdrop, programmatic).
- `[modal]="true"` blocks underlying clicks; `[modal]="false"` would let the user keep interacting with the tree behind.

## Recommended usage for new pages

```html
<falcon-angular-drawer
  [open]="open()"
  (openChange)="open.set($event)"
  position="right"
  size="lg"
  [header]="'Add User'">
  
  <div class="p-6">
    <!-- form fields -->
  </div>
  
  <div slot="footer" class="flex items-center justify-end gap-2 px-6 py-4 border-t border-falcon-neutral-150">
    <falcon-angular-button variant="ghost" [label]="'common.cancel' | translate" (falconClick)="cancel()" />
    <falcon-angular-button [label]="'common.save' | translate" [loading]="saving()" (falconClick)="save()" />
  </div>
</falcon-angular-drawer>
```

## Reactive forms inside drawer
Drawer is just a container — forms inside use their own bindings. Pattern:

```ts
form = new FormGroup({
  name: new FormControl(''),
  type: new FormControl('user'),
});

onSave() {
  this.api.create(this.form.value).subscribe(() => this.open.set(false));
}
```

```html
<falcon-angular-drawer [(open)]="open">
  <form [formGroup]="form" class="p-6 grid gap-4">
    <falcon-angular-input formControlName="name" label="Name" />
    <falcon-angular-dropdown formControlName="type" [options]="typeOptions" label="Type" />
  </form>
  <div slot="footer">...</div>
</falcon-angular-drawer>
```

## ngModel example
N/A — drawer is not a form control.

## Tailwind-only usage
Body content gets layout utilities directly. The drawer panel's outer geometry (width, position, animation) comes from tokens — don't override on the host.

## Token override
```css
.add-user-drawer {
  --falcon-drawer-side-width-md: 560px;
  --falcon-drawer-panel-border-radius-right: 24px 0 0 24px;
  --falcon-drawer-overlay-blur: 8px;
}
```

```html
<falcon-angular-drawer class="add-user-drawer" position="right" [open]="open()">...</falcon-angular-drawer>
```

## Bad usage to avoid
- Don't pass `[closable]="true"` AND project a Cancel button in the footer that ALSO closes — duplicate close paths confuse keyboard users.
- Don't render the drawer outside an `@if (open)` block if you also bind `[open]` — let the drawer manage its own DOM (the Stencil source returns `null` when closed).
- Don't subscribe to multiple of `(drawerShow)`, `(drawerHide)`, `(openChange)` — pick one. `(openChange)` is sufficient for `[(open)]` two-way.
- Don't nest drawers inside drawers — focus trap layering breaks.
- Don't use `position="bottom"` for a confirm prompt — wrong concept; use `falcon-angular-popup`.

## Import requirements
```ts
@Component({
  standalone: true,
  imports: [FalconAngularDrawerComponent, FalconAngularButtonComponent /* etc */],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
```

## Do / Don't

| Do | Don't |
|---|---|
| Use `slot="header"` for rich header (title + sub-line + icon) | Pass `[header]` AND `slot="header"` (both render) |
| Use `slot="footer"` for action button row | Put action buttons in body slot (no border separator) |
| Use `[modal]="false"` for non-blocking detail panels | Use `[modal]="false"` if click-out should still dismiss (it won't — see Stencil source line 105-109) |
| Add body padding via inner `<div class="p-6">` | Mutate `--falcon-drawer-body-padding` per page (use it for global density) |
| Bind `[(open)]` for state | Toggle DOM presence with `@if` AND `[open]` (redundant) |
