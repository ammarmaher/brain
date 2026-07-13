# falcon-angular-tree — API

## Selectors
- Angular: `falcon-angular-tree`
- Stencil Shadow: `<falcon-tree>` (tag `'falcon-tree'`, `shadow: true` — `[CODE]` falcon-tree.tsx:50-52)
- Stencil Light: `<falcon-tree-tw>` (tag `'falcon-tree-tw'`, `shadow: false` — `[CODE]` falcon-tree-tw.tsx:129-130)

## Import

```ts
import { FalconAngularTreeComponent } from '@falcon/ui-core/angular';
// per-component deep path also works: '@falcon/ui-core/angular/falcon-tree'
import type {
  FalconTreeRowNode,        // aliased from FalconTreeNode (barrel renames to avoid tree-table clash)
  FalconTreeRowDensity,     // aliased from FalconTreeDensity
  FalconTreeRowSelectionMode,
  FalconTreeBadge,
  FalconTreeBadgeVariant,
  FalconTreeChangeDetail,
  FalconTreeMultiChangeDetail,
  FalconTreeExpandDetail,
  FalconTreeHoverDetail,
  FalconTreeFocusDetail,
} from '@falcon/ui-core/angular';
```

`[CODE]` index.ts:3-19 — the wrapper barrel deliberately re-exports the row type under the distinct name **`FalconTreeRowNode`** (and `FalconTreeRowDensity` / `FalconTreeRowSelectionMode`) because `FalconTreeNode` / `FalconTreeDensity` already exist with a DIFFERENT shape in the tree-table barrel. Schema `CUSTOM_ELEMENTS_SCHEMA` is set on the wrapper internally (`[CODE]` falcon-tree.component.ts:39) — the host component does NOT need it.

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-tree/falcon-tree.types.ts`:

```ts
export type FalconTreeDensity = 'compact' | 'comfortable';
export type FalconTreeSelectionMode = 'none' | 'single' | 'multiple';
export type FalconTreeBadgeVariant = 'success' | 'warning' | 'danger' | 'info';

export interface FalconTreeBadge {
  readonly text: string;
  readonly variant: FalconTreeBadgeVariant;
}

export interface FalconTreeNode {
  readonly id: string | number;
  readonly label: string;
  readonly icon?: string;
  readonly children?: ReadonlyArray<FalconTreeNode>;
  readonly disabled?: boolean;
  readonly badge?: FalconTreeBadge;
}

export interface FalconTreeChangeDetail      { readonly selectedValue: string | number | null; readonly previousSelectedValue: string | number | null; }
export interface FalconTreeMultiChangeDetail { readonly selectedValues: ReadonlyArray<string | number>; readonly previousSelectedValues: ReadonlyArray<string | number>; }
export interface FalconTreeExpandDetail      { readonly id: string | number; readonly expanded: boolean; }
export interface FalconTreeHoverDetail       { readonly id: string | number | null; readonly ancestorPath: ReadonlyArray<string | number>; }
export interface FalconTreeFocusDetail       { readonly id: string | number | null; }
```

## Inputs (on `FalconAngularTreeComponent`)

`[CODE]` falcon-tree.component.ts:55-71 + the `selectedValue` setter (95-101).

| Name | Type | Default | Notes |
|---|---|---|---|
| `nodes` | `ReadonlyArray<FalconTreeNode>` | `[]` | The tree forest. Bound as an element **property** to both render paths (`[CODE]` html:20/46). |
| `selectedValue` / CVA | `string \| number \| null` | `null` | Two-way via `[(ngModel)]` / `formControlName` (single mode). Setter writes the internal `value` signal. |
| `selectedValues` | `ReadonlyArray<string \| number>` | `[]` | Multi mode. NOT a CVA — bind manually. |
| `expandedIds` | `ReadonlyArray<string \| number>` | `[]` | Which nodes are currently open. |
| `density` | `'compact' \| 'comfortable'` | `'comfortable'` | Forwarded as `[attr.density]`. |
| `selectionMode` | `'none' \| 'single' \| 'multiple'` | `'single'` | Forwarded as `[attr.selection-mode]`. |
| `disabled` | `boolean` | `false` | Disables the whole tree. OR'd with the CVA `disabledSig()`. |
| `helperText` | `string?` | `undefined` | Renders below the tree when no error. |
| `errorMessage` | `string?` | `undefined` | `<p role="alert">` below the tree; implicitly sets error state. |
| `groupLabel` | `string?` | `undefined` | Renders above the tree. |
| `ariaLabel` | `string?` | `undefined` | Outer container `aria-label`. |
| `searchQuery` | `string` | `''` | When non-empty, filters the forest + auto-expands ALL matches. |
| `defaultExpandLevel` | `number` | `0` | Initial auto-expansion to depth N (only when `expandedIds` empty). |
| `useTailwind` | `boolean` | `true` | **Render-path switch.** `true` → `<falcon-tree-tw>` (Light DOM). `false` → `<falcon-tree>` (Shadow DOM). |
| `rootClass` | `string` | `''` | Caller-supplied extra classes forwarded as `[class]` onto the inner Stencil element. |

> `[CODE]` There is **no `@Input() set disabled` setter** like falcon-input's — `disabled` is a plain boolean `@Input`; CVA `setDisabledState` writes a separate `disabledSig` signal, and the template OR's them: `[attr.disabled]="disabled || disabledSig() ? '' : null"` (`[CODE]` html:13/39).

## Outputs

`[CODE]` falcon-tree.component.ts:73-77 — five Angular `@Output`s, each bridged from a namespaced Stencil event.

| Name | Payload | Bridged from | Notes |
|---|---|---|---|
| `valueChange` | `string \| number \| null` | `falcon-change` | Single-mode selection. ALSO writes the CVA `onChange` (`[CODE]` ts:117-123). |
| `valuesChange` | `ReadonlyArray<string \| number>` | `falcon-multi-change` | Multi-mode selection (`[CODE]` ts:126-130). |
| `expandChange` | `FalconTreeExpandDetail` | `falcon-expand` | Node expand/collapse. |
| `hoverChange` | `FalconTreeHoverDetail` | `falcon-hover` | Hovered node + ancestor path (drives the hover-path visual). |
| `focusChange` | `FalconTreeFocusDetail` | `falcon-focus` | Keyboard focus change. |

> `[CODE]` The Stencil tags ALSO emit `falcon-blur` (`[CODE]` falcon-tree.tsx:91-92), bound by the wrapper template to call CVA `onTouched()` (`[CODE]` ts:150-152) — but there is **no `(blur)` Angular `@Output`** re-emitting it. So the tree marks the form control touched on blur but does NOT surface a blur event to the consumer.

## Reflected props (Stencil only)

`[CODE]` falcon-tree.tsx:59-64 — `selectedValue` (`@Prop({ mutable: true, reflect: true })`), `selectionMode`, `density`, `disabled` are reflected to host attributes so `:host([disabled])`, etc. can target them. Object props `nodes` / `selectedValues` / `expandedIds` are `@Prop` (NOT reflected) — they must be set as element properties (the wrapper binds them with `[nodes]` etc.).

## Mutable props (Stencil)

`[CODE]` `selectedValue`, `selectedValues`, `expandedIds` are `@Prop({ mutable: true })` and the component mutates them internally on user interaction (`[CODE]` falcon-tree.tsx:59-61).

## CVA / ngModel / Reactive Forms

**YES (single mode only)** — `[CODE]` falcon-tree.component.ts:40-46/103-114.

```ts
providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FalconAngularTreeComponent), multi: true }]
```

- `writeValue(value)` — writes the internal single `value` signal (`value.set(value ?? null)`).
- `registerOnChange(fn)` — invoked on `falcon-change`.
- `registerOnTouched(fn)` — invoked on `falcon-blur`.
- `setDisabledState(isDisabled)` — writes `disabledSig`.

`[(ngModel)]`, `formControl`, and `formControlName` all work in **single** mode. **Multi mode is NOT a CVA** — bind `[selectedValues]` + `(valuesChange)` manually.

## Signal compatibility

`[CODE]` Internal state uses Angular signals (`value`, `disabledSig`). External binding is `@Input`/`@Output` (legacy decorators — no `input()`/`output()`/`model()` signal-API variant). `OnPush` change detection enforced (`[CODE]` ts:38).

## Programmatic Angular API (delegates to Stencil `@Method`s)

`[CODE]` falcon-tree.component.ts:158-211 — each resolves `activeEl` (`twEl` when `useTailwind`, else `shadowEl`) and calls the matching Stencil `@Method` if present.

| Method | Description |
|---|---|
| `selectAndScrollTo(id): Promise<void>` | Select + `scrollIntoView({block:'nearest'})`. |
| `expandTo(id): Promise<void>` | Expand all ancestors of `id`. |
| `expandAll(): Promise<void>` | Expand every node with children. |
| `collapseAll(): Promise<void>` | Collapse everything. |
| `focusNode(id): Promise<void>` | Move keyboard focus to `id` (renamed from `focus` to avoid `HTMLElement.focus()` clash — `[CODE]` falcon-tree.tsx:172-173). |

## Slots / template inputs

`[CODE]` Both render paths declare a single bare `<ng-content></ng-content>` (`[CODE]` html:31/57) — but the Stencil components render a **fixed row structure** and define NO named `<slot>`s, so projected content has no defined mount point. Effectively **no usable slots and no `ng-template` inputs.** The row is: rails column + chevron + (multi-check in multiple mode) + initials chip + optional icon + label + optional badge.

## Supported sizes / modes / variants

- **density:** `comfortable` (default) / `compact`.
- **selectionMode:** `none` (read-only display) / `single` (CVA) / `multiple`.
- **searchable** via the `searchQuery` Input (auto-expands matches).
- **render path:** Shadow / Light via `useTailwind`.
- No `size` / `variant` / `appearance` axes (unlike form controls).

## Lazy / server mode

`[CODE]` _None._ The tree expects the full forest in memory (`nodes`); there is no lazy children loader (GAP G5).

## Important constraints

- `[CODE]` falcon-tree.tsx:107/180 — a private `justClickedId` flag suppresses the programmatic-scroll watcher when the user clicked the node directly (avoids a redundant smooth-scroll).
- `[CODE]` falcon-tree.tsx:226-237 — clicking the chevron NEVER selects the row (`event.stopPropagation()` + a `target.closest('[data-tree-chevron]')` guard in the row handler). Expand and select are separate actions.
- `[CODE]` falcon-tree.utils.ts:169-210 — `filterTreeBySearch()` is a case-insensitive `label.toLowerCase().includes(query)` substring match; keeps matches + their ancestors; no custom predicate hook.
- `[CODE]` falcon-tree.tsx:184-205 — multi mode is self-only: clicking a node toggles only its own inclusion (`toggleInArray`); no "select all descendants".
- `[CODE]` Passing a **cyclic** forest causes infinite recursion in `flattenTree` — the consumer must guarantee an acyclic forest with unique `id`s across the whole tree.

## Accessibility

`[CODE]` falcon-tree.tsx:460-583 / falcon-tree-tw.tsx:521-548:
- Outer container: `role="tree"`, `aria-label`, `aria-multiselectable={selectionMode==='multiple'}`, `aria-disabled`.
- Each row: `role="treeitem"`, `aria-level={depth+1}`, `aria-posinset`, `aria-setsize`, `aria-selected`, `aria-expanded` (only when `hasChildren`), `aria-disabled`. Disabled rows get `tabIndex={-1}`, else `tabIndex={0}`.
- Chevron `<button>` has `aria-label={isOpen ? 'Collapse' : 'Expand'}` (`[CODE]` falcon-tree.tsx:379) — **hardcoded English, not i18n** (GAP).
- Multi-check `<span>` is `aria-hidden="true"` — the row's `aria-selected` carries the semantics.
- Error paragraph has `role="alert"` (`[CODE]` falcon-tree.tsx:601).
- Rails / indicator / icon spans are all `aria-hidden="true"`.
- **Keyboard support** (`[CODE]` falcon-tree.tsx:262-323, identical in `-tw`):
  - `ArrowDown`/`ArrowUp` — next / previous visible row.
  - `Home`/`End` — first / last visible row.
  - `ArrowRight` — expand if collapsed-with-children; if already expanded, focus first child.
  - `ArrowLeft` — collapse if expanded; if leaf, focus parent.
  - `Enter`/`Space` — toggle selection (when `selectionMode!=='none'` + not disabled), else toggle expand if it has children.
- **GAP** `[CODE]` — chevron has no `aria-controls` pointing to the subtree (A11y gap); `aria-busy` not set (no lazy-load to gate).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B09) against falcon-tree.component.ts (212 ln), falcon-tree.component.html (59 ln), falcon-tree.tsx (611 ln), falcon-tree-tw.tsx (642 ln), falcon-tree.types.ts (54 ln), falcon-tree.utils.ts (238 ln), index.ts. Confirmed: 15 wrapper `@Input`s (incl. the `selectedValue` setter), 5 `@Output`s, single-mode CVA, 5 delegated `@Method`s, `falcon-blur`→`onTouched` (no `(blur)` Output), fixed row structure (no usable slots).
