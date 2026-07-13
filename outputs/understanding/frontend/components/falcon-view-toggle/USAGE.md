# falcon-view-toggle — USAGE

## Real usage examples (active codebase)

### Example 1 — Org-hierarchy "structure view" switcher (one-way + guarded change) — admin & mgmt

`[CODE]` `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html:131-134` (identical in mgmt at :124-127):

```html
<falcon-angular-tabs ...>
  <ng-template falconTabActions="hierarchy">
    <!-- One-way [value] + (valueChange) routes the toggle through the same -->
    <!-- unsaved-changes gate as the tab bar: re-feeding the authoritative   -->
    <!-- [value] snaps the visual back when a guarded change is blocked.      -->
    <falcon-view-toggle
      [options]="state.structureOptions"
      [value]="state.structureView()"
      (valueChange)="onStructureViewChange($any($event))" />
  </ng-template>
</falcon-angular-tabs>
```

`[CODE]` The option list (`apps/.../services/state/tree-state.signals.ts:42-45`):

```ts
export type StructureView = 'tree' | 'chart';
// HTML truth: toggle reads "List | Tree". State keys 'tree'/'chart' kept for code stability.
const STRUCTURE_OPTIONS: readonly FalconViewToggleOption<StructureView>[] = [
  { key: 'tree',  labelKey: 'hierarchy.view.list', iconSvg: 'list-bullets' },
  { key: 'chart', labelKey: 'hierarchy.view.tree', iconSvg: 'org-chart' },
];
```

`[CODE]` The guarded change handler (`org-hierarchy-page-menu.component.ts:259-273`) shows the **deliberate one-way pattern**: instead of `[(value)]`, the host takes `(valueChange)`, runs the unsaved-changes guard, and only commits `structureView.set(next)` if the guard allows; otherwise it does nothing and the next CD pass re-feeds the authoritative `[value]="state.structureView()"`, snapping the pill back. **This is the canonical way to veto a toggle change.**

> `[CODE]` Note the `$any($event)` cast at html:134 — `state.structureView()` is `StructureView` but the handler param is widened, so the template casts. Acceptable here; prefer a typed handler in new code.

## Recommended usage for NEW Angular pages

For a simple round-trip toggle where no veto is needed, use the two-way `model()` directly:

```html
<falcon-view-toggle
  [options]="viewOptions"
  [(value)]="currentView" />
```

```ts
import { FalconViewToggleComponent, type FalconViewToggleOption } from '@falcon';

type CardsView = 'grid' | 'list';

@Component({
  selector: 'app-example',
  imports: [FalconViewToggleComponent],
  template: `<falcon-view-toggle [options]="viewOptions" [(value)]="view" />`,
})
export class ExampleComponent {
  readonly view = signal<CardsView>('grid');
  readonly viewOptions: readonly FalconViewToggleOption<CardsView>[] = [
    { key: 'grid', labelKey: 'common.view.grid', icon: 'grid' },   // → falcon-icon-grid
    { key: 'list', labelKey: 'common.view.list', iconSvg: 'list-bullets' },
  ];
}
```

> Keep `viewOptions` as a stable reference (a field/const, not an inline array literal in the template) — `@for ... track opt.key` benefits from referential stability and inline literals re-allocate every CD pass.

## When to use the guarded one-way pattern vs `[(value)]`

| Situation | Pattern |
|---|---|
| Switching view has no side effects / no unsaved state | `[(value)]="view"` (two-way model). |
| Switching view must pass an unsaved-changes / permission guard that can VETO | `[value]="view()"` + `(valueChange)="onChange($any($event))"` (the live org-hierarchy pattern). |

## i18n

`[CODE]` Each option's `labelKey` is piped through `TranslatePipe` (`<span>{{ opt.labelKey | translate }}</span>`, html:36). Always pass an **i18n key** as `labelKey`, never a literal string — and add it to BOTH `en.json` and `ar.json`. The live keys are `hierarchy.view.list` / `hierarchy.view.tree`.

## Tailwind-only / token override

`[CODE]` There is **no token file** and **no `wrapperClass`/`labelClass` input** — the pill styling is hardcoded inline Tailwind in the template. To restyle:
- Layout/spacing around the control: add utilities on the host via `class=` (the host is `inline-flex`).
- Deeper visual change (active color, container bg): **not customizable via inputs/tokens today** — you would have to fork the component or upstream a token contract (GAP G6). Do NOT add a consumer `.css` rule targeting `.falcon-view-toggle button` — that breaks the shared-style promise and the no-SCSS house rule.

## Do / Don't

| Do | Don't |
|---|---|
| Pass i18n keys as `labelKey` (translated internally). | Pass literal display strings. |
| Use `iconSvg` for List/Tree; `icon` (Falcon icon-font name) for everything else. | Hand-roll an `<svg>` in the consumer — extend the component instead. |
| Keep `options` as a stable const/field. | Inline a fresh array literal in the template each render. |
| Use the guarded `[value]`+`(valueChange)` pattern when a change can be vetoed. | Use `[(value)]` when you need to block a change (the model commits immediately). |
| Reach for `<falcon-angular-radio>`/`tabs` for *form* selection. | Use this for a submitted form value (no CVA). |
| Limit to 2-4 options. | Feed a long/overflowing option list (no overflow handling). |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `<falcon-view-toggle[\s>]` across `apps/` returned **2 render sites**; across `libs/falcon/` **0** render sites (only the component's own source files). TS imports of `FalconViewToggleComponent`: 2 (both `org-hierarchy-page-menu.component.ts`).

Full render list:
- `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html:131`
- `apps/management-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html:124`

Both consume `state.structureOptions` (= `STRUCTURE_OPTIONS`, `tree-state.signals.ts:42-45`) and bind to `state.structureView()`.

> `[INFERRED]` Adoption is low (List/Tree switcher only) because it was promoted as a generic primitive but the two consoles are the only surfaces that currently need a view toggle. New "grid/list"-style toggles SHOULD reuse it.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25). Example 1 + `STRUCTURE_OPTIONS` + the guarded `onStructureViewChange` veto pattern confirmed against live source. Consumer Sweep re-run (`<falcon-view-toggle[\s>]` → 2 app render sites, 0 in `libs/falcon`).
