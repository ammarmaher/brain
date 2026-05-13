# falcon-menu — USAGE

## Real usage examples

The menu is composed inside `FalconTreePanelComponent` and per-row data-table action menus. Direct `<falcon-angular-menu>` usage is limited because the component is typically wired through higher-level composers.

## Recommended usage for new pages

### 1. Inline kebab menu (popup mode with trigger slot)

```html
<falcon-angular-menu
  [items]="rowActions"
  (falconMenuItemSelect)="onMenuSelect($event)">
  
  <button slot="trigger" class="grid place-items-center h-8 w-8 rounded-md hover:bg-falcon-neutral-100" aria-label="More actions">
    <i class="falcon-icon falcon-icon-more-vertical"></i>
  </button>
</falcon-angular-menu>
```

```ts
rowActions: FalconMenuItem[] = [
  { label: 'Edit', icon: 'falcon-icon falcon-icon-pencil', command: ({item}) => this.onEdit() },
  { label: 'Delete', icon: 'falcon-icon falcon-icon-trash', command: () => this.onDelete() },
  { separator: true, label: '' },
  { label: 'Archive', icon: 'falcon-icon falcon-icon-archive', command: () => this.onArchive() },
];

onMenuSelect(detail: FalconMenuItemSelectDetail) {
  console.log('Selected', detail.item, detail.index);
}
```

### 2. External-anchor mode (shared menu for table rows)

```ts
import { ViewChild, ElementRef } from '@angular/core';
import { FalconAngularMenuComponent, FalconMenuItem } from '@falcon/ui-core/angular';

@Component(...)
export class MyTableComponent {
  @ViewChild('rowMenu') rowMenu!: FalconAngularMenuComponent;
  
  menuItems: FalconMenuItem[] = []; // updated per click

  onRowKebabClick(row: MyRow, event: MouseEvent) {
    this.menuItems = this.buildItemsForRow(row);  // dynamic per row
    void this.rowMenu.showAt(event.currentTarget as HTMLElement, event);
  }
}
```

```html
<!-- One menu, shared across all rows -->
<falcon-angular-menu #rowMenu [items]="menuItems" (falconMenuItemSelect)="onSelect($event)" />

<!-- Per-row trigger -->
<table>
  <tr *ngFor="let row of rows">
    <td>{{ row.name }}</td>
    <td>
      <button (click)="onRowKebabClick(row, $event)" aria-label="Row actions">
        <i class="falcon-icon falcon-icon-more-vertical"></i>
      </button>
    </td>
  </tr>
</table>
```

This is the PrimeNG `Menu.toggle(event)` parity — one shared menu, dynamic items.

### 3. Inline mode (no trigger, always open)

```html
<falcon-angular-menu
  [popup]="false"
  [items]="quickActions"
  (falconMenuItemSelect)="onSelect($event)" />
```

Renders the panel inline as part of the document flow. Useful for action columns or sidebar-fixed menus.

## Reactive forms / ngModel
Not applicable.

## Tailwind-only usage
- Items are styled via the menu token contract.
- Trigger slot content is fully consumer-controlled — apply Tailwind freely.
- Don't override panel position via host classes — `showAt()` does it.

## Token override
```css
.compact-menu {
  --falcon-menu-item-padding-y: 6px;
  --falcon-menu-panel-min-width: 140px;
  --falcon-menu-panel-padding-y: 2px;
}
```

```html
<falcon-angular-menu rootClass="compact-menu" [items]="items" />
```

## Bad usage to avoid
- Don't bind `[attr.items]` — items will stringify. Use `[items]` (property binding).
- Don't try to build nested submenus — not supported (carve-out scope).
- Don't show multiple menus at once — they share the global Esc listener.
- Don't position the menu manually via inline style — use `showAt()` for external anchor.
- Don't pass an `<a href>` as a menu item — use `command` callback + router navigate.
- Don't expect `appendTo="body"` to work — only `'host'` is implemented in the carve-out.

## Import requirements
```ts
@Component({
  standalone: true,
  imports: [FalconAngularMenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
```

The wrapper auto-registers Stencil tags via `defineFalconTwComponent('falcon-menu')`.

## Do / Don't

| Do | Don't |
|---|---|
| Use `command` callback per item | Subscribe to `falconMenuItemSelect` and dispatch by index (fragile) |
| Use `showAt(event.currentTarget, event)` for table row menus | Open one menu instance per row (wastes DOM) |
| Use `separator: true` items for dividers | Style item labels with HR-like CSS |
| Use `<slot name="trigger">` for custom triggers | Pass a raw string `triggerLabel` for icon-only kebabs (use slot for SVG / icon) |
| Pass `data` payload per item for round-trip context | Mutate the items array in-place during render |
| Use `[popup]="false"` for inline action lists | Use `popup=false` for popups (intent mismatch) |
