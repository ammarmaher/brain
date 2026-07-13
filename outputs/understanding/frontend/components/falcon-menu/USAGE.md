# falcon-menu — USAGE

## Real usage examples (active codebase)

`[CODE]` The menu has **2 render sites, both in `libs/`** — apps never render `<falcon-angular-menu>` directly; they reach it transitively through these composers:
- `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html:149` — the SHARED `<falcon-angular-menu #actionMenu rootClass="falcon-tree-action-menu">` host, opened via `showAt()` on per-node kebab triggers. Consumed by the org-hierarchy menus in both consoles.
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.html:51` — the data-table per-row action menu (`rootClass="falcon-data-table-row-action-menu"`); `.component.ts:1186` wires `falcon-row-action-trigger` → `<falcon-angular-menu>.showAt(...)`.

The examples below are the recommended authoring shapes for those external-anchor + inline patterns.

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

<!-- Per-row trigger (project rule: @for, not *ngFor) -->
<table>
  @for (row of rows; track row.id) {
    <tr>
      <td>{{ row.name }}</td>
      <td>
        <button (click)="onRowKebabClick(row, $event)" aria-label="Row actions">
          <i class="falcon-icon falcon-icon-more-vertical"></i>
        </button>
      </td>
    </tr>
  }
</table>
```

This is the PrimeNG `Menu.toggle(event)` parity — one shared menu, dynamic items. It is exactly the pattern `falcon-data-table` + `falcon-tree-panel` use internally. On open, the wrapper promotes the inline panel into the browser Top Layer (native popover + `FalconStackingService`) so it escapes a row's `overflow:hidden` — no body-portal needed.

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

## Wave 7 Consumer Sweep (2026-05-17)

[CODE] grep `<falcon-angular-menu>` across `apps/` + `libs/falcon/` returned **2 consumer file(s)** as of 2026-05-17 (tree-panel only — the data-table render site is in `libs/falcon-ui-core`, outside the Wave-7 grep scope).

## Consumer Sweep (2026-06-03)

[CODE] grep `<falcon-angular-menu` (HOST render usage) across the repo → **2 render sites**:

- `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html:149` — the shared tree action-menu host (`#actionMenu`, `rootClass="falcon-tree-action-menu"`). The `.html` also has 2 explanatory comments at lines 44/117.
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.html:51` — data-table per-row action menu (`rootClass="falcon-data-table-row-action-menu"`); wired in `.component.ts:1186`.

Non-render references (comments / type imports, NOT consumers): `apps/{admin,management}-console/.../org-hierarchy-page/components/stencil-prop-patches.ts:114` (comment), `libs/falcon-ui-core/.../falcon-insufficient-balance-dialog.component.ts` (×3 comments citing the `[appendTo]` idiom), `libs/falcon-ui-tokens/src/components/menu.tokens.css:124` (scoped-override doc).

> `[CODE]` Apps reach the menu **transitively** through `falcon-tree-panel` (org-hierarchy in both consoles) and `falcon-data-table` (every list with row actions) — so its effective footprint is large despite only 2 literal render sites.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B13). Consumer Sweep re-run; the 2 render sites + their `rootClass` action-menu surfaces confirmed. Fixed the `*ngFor` example to `@for` (project rule) and added the Top-Layer-promotion note (the data-table/tree-panel real pattern).
