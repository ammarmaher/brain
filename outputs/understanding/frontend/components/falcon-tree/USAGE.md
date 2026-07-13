# falcon-angular-tree — USAGE

## Real usage in active codebase

`[CODE]` **No production render consumer (2026-06-03 / B09).** A repo-wide grep for `<falcon-angular-tree[\s>]` (excluding `dist/`) returned only barrel/doc-comment references — **zero render sites.** The org-hierarchy pages use `<falcon-tree-panel>` (legacy bespoke, own `<falcon-tree-node>` recursive component), NOT `<falcon-angular-tree>`. See Consumer Sweep below. All examples here are **recommended** new usage, not live snippets.

## Recommended NEW usage

### Single-select tree with hover-path

```ts
// component.ts
import {
  FalconAngularTreeComponent,
  type FalconTreeRowNode,        // barrel alias of FalconTreeNode
  type FalconTreeHoverDetail,
  type FalconTreeExpandDetail,
} from '@falcon/ui-core/angular';

@Component({
  standalone: true,
  imports: [FalconAngularTreeComponent],
  templateUrl: './category-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryTreeComponent {
  readonly nodes: FalconTreeRowNode[] = [
    { id: 'fin', label: 'Finance', icon: 'falcon-icon falcon-icon-bank', children: [
      { id: 'ar', label: 'AR', badge: { text: '12', variant: 'info' } },
      { id: 'ap', label: 'AP', badge: { text: '3',  variant: 'warning' } },
    ]},
    { id: 'hr', label: 'HR', children: [
      { id: 'hir', label: 'Hiring', children: [{ id: 'op', label: 'Open positions' }] },
      { id: 'pay', label: 'Payroll', badge: { text: 'urgent', variant: 'danger' } },
    ]},
  ];
  readonly selected = signal<string | null>('ar');
  readonly expanded = signal<readonly string[]>(['fin', 'hr']);

  onExpand(detail: FalconTreeExpandDetail): void {
    this.expanded.update(list => detail.expanded
      ? [...list, detail.id as string]
      : list.filter(id => id !== detail.id));
  }
}
```

```html
<!-- component.html -->
<falcon-angular-tree
  [nodes]="nodes"
  [selectedValue]="selected()"
  [expandedIds]="expanded()"
  selectionMode="single"
  density="comfortable"
  groupLabel="Categories"
  ariaLabel="Category tree"
  (valueChange)="selected.set($any($event))"
  (expandChange)="onExpand($event)" />
```

### Multi-select with searchable filter

```html
<falcon-angular-input [iconRight]="true" [(ngModel)]="query" placeholder="Search…">
  <span slot="icon-right" aria-hidden="true"><i class="falcon-icon falcon-icon-search"></i></span>
</falcon-angular-input>

<falcon-angular-tree
  [nodes]="nodes"
  [selectedValues]="selectedIds()"
  [searchQuery]="query()"
  selectionMode="multiple"
  density="compact"
  (valuesChange)="selectedIds.set([...$event])" />
```

> `[CODE]` falcon-tree.tsx:543-558 — a non-empty `searchQuery` filters the forest down to matches + ancestors AND force-expands every node so matches are reachable. An empty result renders the literal text `"No matches"`.

### Reactive Forms (single mode)

```ts
this.form = this.fb.group({ category: this.fb.control<string | null>('ar') });
```

```html
<falcon-angular-tree [nodes]="nodes" formControlName="category" />
```

### Programmatic select + scroll

```ts
@ViewChild(FalconAngularTreeComponent) treeRef!: FalconAngularTreeComponent;

async focusNodeFromSearchResult(id: string): Promise<void> {
  await this.treeRef.expandTo(id);          // open all ancestors
  await this.treeRef.selectAndScrollTo(id); // select + scrollIntoView({block:'nearest'})
}
```

> `[CODE]` The scroll is `requestAnimationFrame`-deferred inside the Stencil component (falcon-tree.tsx:136-145) — `selectAndScrollTo` resolves before the scroll visibly completes.

## Token usage (per-instance override pattern)

Add a host marker class on the consumer, then mutate `--falcon-tree-*` tokens in the consumer's CSS:

```html
<falcon-angular-tree class="dense-tree" [nodes]="nodes" />
```

```css
.dense-tree {
  --falcon-tree-node-min-height: 28px;
  --falcon-tree-node-padding-y: 4px;
  --falcon-tree-label-font-size: 12px;
}
```

> The token file `:where(...)` selector keeps specificity 0, so a host-class override wins. Both render paths read the same tokens.

## Render-mode guidance

- **Default (`useTailwind=true`)** — Light DOM. Best for Studio token-runtime mutation + cross-framework parity.
- `useTailwind=false` — Shadow DOM. Switch only for style isolation from a noisy parent stylesheet.

## Do / Don't

| Do | Don't |
|---|---|
| Use `searchQuery` for filtering (auto-expands matches). | Add a custom hover-path effect — the `Set<id>` already drives it. |
| Listen to `hoverChange` for sibling UI (breadcrumbs). | Pass a **cyclic** forest — infinite recursion in `flattenTree`. |
| Use `defaultExpandLevel` for initial expansion. | Mutate `nodes` in place — pass a fresh array. |
| Override visuals via host-class + `--falcon-tree-*` tokens. | Hardcode hex / px in `style=`. |
| Use `@if`/`@for` in the surrounding template. | Use `*ngIf`/`*ngFor` (project rule). |
| Use `<falcon-tree-panel>` for org-hierarchy with 3-dot menus. | Hand-roll a parallel recursive tree because this lacks a per-row action slot. |

## Bad usage to avoid

- **Do NOT** rely on `<falcon-tree-panel>` and `<falcon-angular-tree>` producing identical visual output — they are parallel implementations.
- **Do NOT** render large trees (n > 1000 nodes) without virtualization — none exists (P1 gap).
- **Do NOT** expect children to lazy-load on expand — there is no `loadChildren` hook.
- **Do NOT** use `multiple` mode and expect a parent click to select descendants — selection is self-only.
- **Do NOT** project content into the bare `<ng-content>` expecting it to render — the Stencil row structure is fixed; there is no usable mount point.

## Import requirements (standalone component)

```ts
import { FalconAngularTreeComponent } from '@falcon/ui-core/angular';
import { FormsModule } from '@angular/forms';        // for [(ngModel)]
// or: import { ReactiveFormsModule } from '@angular/forms';

@Component({ standalone: true, imports: [FalconAngularTreeComponent, FormsModule], /* … */ })
```

## Consumer Sweep (2026-06-03 — B09)

`[CODE]` grep `<falcon-angular-tree[\s>]` across the whole repo (excluding `dist/`) → **0 render consumers.** Non-render matches only:

- `libs/falcon-ui-core/src/angular-wrapper/index.ts:121` — barrel re-export comment.
- `libs/falcon-ui-core/src/types/tree.types.ts:5` — type doc-comment.

The broader `<falcon-tree[\s>-]` grep (138 occurrences / 56 files) is dominated by the SIBLINGS `falcon-tree-table`, `falcon-tree-panel`, the token files, and component docs — none are render consumers of THIS component.

> `[INFERRED]` Consumer count **dropped from the Wave 7 "1"** because the `apps/host-shell/src/app/playground/` route folder was removed (the prior dossier's only cited consumer). The component is built and exported but currently un-consumed.

## Wave 7 Consumer Sweep (2026-05-17)

`[CODE]` grep `<falcon-angular-tree>` returned **1 consumer**: `apps/host-shell/src/app/playground/playground.page.html` — **now stale** (folder removed; see B09 sweep above).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B09). Consumer Sweep re-run → 0 render consumers (playground folder confirmed absent on disk). Recommended-usage snippets are 🟡 CODE-DERIVED from the API surface (no live consumer to cite). `searchQuery` auto-expand + `selectAndScrollTo` rAF-defer re-confirmed in falcon-tree.tsx.
