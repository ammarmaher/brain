# falcon-data-table — GAPS & UPGRADES

## Missing capabilities

### API parity placeholders without implementation

- **`[reorderableColumns]` and `[resizableColumns]` inputs exist but are NOT wired to anything.** They are present on the wrapper for PrimeNG API parity. **P2 — either implement them or remove them with a deprecation note.** Setting them does nothing today.

### Strategy E projection edge cases

- **Header templates fall back to plain text when `hostsExternalCells=true` + no `headerKey`.** In `onCellsMounted` (line 416-432), the wrapper writes `String(value ?? '')` for body cells with no template, and `col?.headerKey ?? m.field` for header cells. This is reasonable but means a typo in `[falconDataTableHeaderCell="…"]` silently falls back. **P3** — add a dev-mode console warning.
- **`emptyView` and `loadingView` are recreated only if not cached.** On `(loading)` toggling rapidly, the loading template's `EmbeddedViewRef` is destroyed on `loading=false` (via `syncLoadingView(null)` because the `data-loading-mount` element disappears). Subsequent `loading=true` reinitialises the view. **No leak, just churn — P3.**
- **No `falcon-cells-mounted` debouncing.** Every Stencil render runs the projection orchestrator over every visible cell. For 50 rows x 6 columns = 300 lookups per render. Fine today (<5ms) but a future hotspot. **P3.**
- **`mountOrReuseView` rebuilds context for every render.** Even when content hasn't changed, the wrapper does `for (const k of Object.keys(ctx)) c[k] = ctx[k]` + `detectChanges()`. Could be optimised by reference-equality check. **P3.**

### Row-action menu

- **`<falcon-angular-menu>` is rendered once but its `[items]` shifts based on the active row** — `menuItems.set(items)` is called inside `onRowActionTrigger`. There can be a flicker where the menu first opens with the previous row's items before signal flush. **P2 — verify timing; possibly set items synchronously before `rowMenu.showAt`.**
- **Three input shapes for menu items** (`rowMenuItems` legacy, `boundMenuItems` legacy callback, `rowActions` typed). The precedence is `rowActions > boundMenuItems > rowMenuItems`. Confusing API surface. **P2 — deprecate the two legacy inputs once consumers fully migrate to `rowActions`.**
- **`FalconDataTableMenuItem.command` callback** is fired inside `onMenuItemSelect` but only for the legacy paths (`boundMenuItems` array or `rowMenuItems`) — not for typed `rowActions`. Documented at line 605-614, but inconsistent. **P2 — make `rowActions` first-class with `(action)` callback support.**
- **No keyboard shortcut for opening the row menu.** A11y-wise, the user must reach the `⋮` button via TAB. **P2 — add an `aria-haspopup` + keyboard handler.**

### Selection mechanics

- **`syncSelectionFromInput()` falls back to `resolveRowId(row, -1)`.** When `selection` contains an object that doesn't carry an `id` or `dataKey`-keyed field, the row resolves to `-1`. This works visually but two rows with no id would both map to `-1` and collide. **P3 — log a dev-mode warning.**
- **Single-mode selection emits `null` when deselected, but only if `selectable=true`.** When `selectable=false`, no emit occurs even on internal state change. This matches the design intent, but the docstring is silent. **P3 — clarify in JSDoc.**

### Lazy + sort

- **`(sortChange)` emits only single-mode sort** `{ field, order: 1|-1 }`. Multi-sort changes do NOT surface here. The Stencil core emits `falcon-multi-sort` but the wrapper doesn't forward it. **P1 — add `multiSortChange` output for parity with `sortMode='multiple'`.**

### Lazy + filter

- **Global filter changes do NOT auto-trigger a lazy reload** — instead the consumer reads `(globalFilterChange)` and threads it through `(lazyLoad)`. The Stencil core emits both events, so the consumer can choose. **No gap, but easy to miss.** Document.

### Internationalization

- **`emptyMessageKey` is a string, not a translate-pipe expression.** The component does NOT call any i18n service — consumers must pre-translate via `[emptyMessage]`. The two inputs coexist (`emptyMessage` beats `emptyMessageKey`). **No gap — but the input naming implies the component does the translation, which it doesn't.** **P3 — rename or document.**
- The composed `<falcon-table-tw>` carries the same hardcoded `'Search…'` placeholder + `'No records to display.'` defaults — gap inherited from the Stencil core (`falcon-table` GAPS_AND_UPGRADES.md FT-04).

### Empty cell rendering when no template provided

- When NO `[falconDataTableEmpty]` template is projected, the wrapper writes `el.textContent = (emptyMessage ?? emptyMessageKey)` directly into the `[data-empty-mount]` element. Good — no flash of empty content. But this is plain text — no icon / illustration / action button. Consumers must explicitly project an empty template to get a rich empty state. **P2 — add an `emptyState` input shape `{ iconName, descriptionKey, actionLabelKey }` that composes `<falcon-angular-empty-state>` by default.**

### Frozen + sticky-actions

- `frozen: 'left' | 'right'` is mapped to `ColumnDef → FalconTableColumnExt` (`adaptColumns()`). Works.
- `stickyActions` is forwarded as an HTML attribute. Works.
- BUT: when both `stickyActions=true` AND a `frozen: 'right'` column exists, both compete for inline-end position. **No documented precedence.** **P2 — document or pick a winner.**

### Tests

- **No `.spec.ts` for `falcon-data-table.component.ts` or the projection directives** alongside source. The Strategy E orchestrator is non-trivial; a spec around `mountOrReuseView` + `syncEmptyView` + GC of orphaned views would catch regressions. **P1.**

### Performance

- **EmbeddedViewRef registry has no size cap.** A 1000-row + 10-column table creates 10,000 `EmbeddedViewRef`s. With virtual scrolling absent, this is a problem. **P1 — add virtual scrolling or document the row-count limit.**
- **No virtual scrolling.** For lists >500 rows the table renders all in DOM. **P2 — investigate CDK virtual scrolling integration through Strategy E.**

### Accessibility

- **Row click vs row-action button click** — Stencil's `falcon-row-action-trigger` handler does `ev.stopPropagation()` so it doesn't fire `falcon-row-click`. Good. But the row TR is `tabIndex={0}` while the inner button is also tabbable. **TAB order: row → action button → next row.** Verify with screen readers.
- **`<falcon-angular-menu>` aria-haspopup** — verify the menu wrapper exposes `aria-haspopup` on its trigger so the connection is announced.

## Reusable upgrades needed

| ID | Title | Priority | Recommended API |
|---|---|---|---|
| FDT-01 | `multiSortChange` output | **P1** | `@Output() readonly multiSortChange = new EventEmitter<{ field: string; order: 1\|-1 }[]>();` forwarding `falcon-multi-sort` |
| FDT-02 | Specs for projection orchestrator | **P1** | Vitest specs covering mount, reuse, GC, empty/loading views |
| FDT-03 | Default empty-state composition | **P2** | Optional `[emptyState]="{ iconName, descriptionKey, actionLabelKey }"` input |
| FDT-04 | Remove or implement reorder/resize placeholders | **P2** | Implement column reordering + resizing via CDK drag-drop OR remove inputs |
| FDT-05 | Typed-action callback hook | **P2** | `FalconDataTableRowMenuAction<T>` adds `command?: (row: T) => void` invoked in `onMenuItemSelect` |
| FDT-06 | Frozen + sticky-actions precedence | **P2** | Document or enforce; right-frozen columns win over sticky-actions or vice versa |
| FDT-07 | Menu items flicker fix | **P2** | Set `menuItems.set(items)` synchronously before `rowMenu.showAt`; verify with browser timing |
| FDT-08 | Virtual scrolling | **P2** | CDK virtual-for through Strategy E (slice rows + offset row indices) |
| FDT-09 | Rename `emptyMessageKey` or wire translate | **P3** | Either inject translate service or rename to `emptyText` |

## Workarounds available

- **`multiSortChange`:** consumers can listen to the raw Stencil `falcon-multi-sort` event on the wrapper element via `@ViewChild` + `nativeElement.addEventListener` — ugly but possible.
- **Default empty state:** consumers can ALWAYS project a `<ng-template falconDataTableEmpty>` with `<falcon-angular-empty-state>`. That's the recommended pattern today.
- **`reorderableColumns` / `resizableColumns`:** no workaround — either roll your own column reordering UI outside the table or wait for implementation.
- **Virtual scrolling:** load + slice rows server-side via `lazy=true`. Limit page size to ≤50 to keep DOM small.

## Visual / interaction risks

- **Menu items flicker** (see FDT-07) — the `menuItems` signal might update on the next microtask while `rowMenu.showAt` fires immediately.
- **Stencil object-prop ordering** — `syncProps()` runs in `ngAfterViewInit` and on every `ngOnChanges`. If a consumer rebinds `[data]` rapidly, the wrapper might reassign object refs faster than Stencil's render cycle. **Verify under stress.**

## Fix in shared component vs per-page

- All gaps belong in the shared component. The whole point of `<falcon-angular-data-table>` is one canonical Angular table.
- The only "per-page" decision is which template to project — that's the consumer's job.

## Future-proof recommendation

- **Deprecate `rowMenuItems` and `boundMenuItems`** once consumers fully migrate to typed `rowActions`. Add an ESLint rule disallowing the legacy inputs in `apps/`.
- **Document Strategy E publicly.** It's a unique pattern (Stencil emits projection mount-points; Angular wraps with `EmbeddedViewRef`) that other Falcon wrappers could adopt (`<falcon-angular-tree-table>` could project per-row templates the same way).
- **Add a typed cell template helper** — a tiny utility type to give cell templates better TS inference for `let-value="value" let-row="row"` context typing.
