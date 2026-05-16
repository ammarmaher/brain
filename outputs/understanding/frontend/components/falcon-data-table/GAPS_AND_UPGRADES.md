# falcon-data-table — GAPS & UPGRADES

## Closed in Wave 20 (2026-05-15) — Shadow row notch alignment

| ID | Title | Resolution |
|---|---|---|
| FDT-SHADOW-NOTCH-01 | Notch invisible on first paint | **CLOSED.** Root cause: `top-0 -translate-y-full` on a `w-0 h-0` element is a no-op (Tailwind's percentage translate is relative to the element's own CSS height, which `h-0` zeroes). The triangle stayed at `top: 0` with the visible bottom-border extending DOWN INTO the green band — same colour = invisible. Fix: replaced with explicit `top-[calc(-1*var(--falcon-data-table-shadow-arrow-size))]` lifting the triangle so its base sits AT the cell's top edge and its body extends UP into the parent row's footer space. |
| FDT-SHADOW-NOTCH-02 | Inline `style={{ left: '0px' }}` reset on every render | **CLOSED.** Removed the JSX inline-style from the arrow span (`falcon-table-tw.tsx` `renderShadowRow`). `updateShadowArrowPositions` now writes `left` + `display` directly to the DOM in `componentDidRender`, no longer fighting Stencil's reconciliation. |
| FDT-SHADOW-NOTCH-03 | First-paint flash at `left: 0` before position is computed | **CLOSED.** Two-pass update: (1) synchronous `updateShadowArrowPositions()` immediately after `falcon-shadow-cells-mounted` is emitted; (2) follow-up `scheduleShadowArrowUpdate()` via `requestAnimationFrame` to catch late layout settle from Angular template injection. |
| FDT-SHADOW-NOTCH-04 | No `window.resize` listener | **CLOSED.** Added `window.addEventListener('resize', ...)` in `connectedCallback` + matching cleanup in `disconnectedCallback`. Coalesced through `scheduleShadowArrowUpdate` rAF. |
| FDT-SHADOW-NOTCH-05 | Arrow z-index undefined → could fall behind parent row's bottom border | **CLOSED.** Added `--falcon-data-table-shadow-arrow-z: 2` token + `z-[var(...)]` class. |
| FDT-SHADOW-NOTCH-06 | Silent failure when `targetColumn` doesn't resolve to a visible header | **CLOSED.** `updateShadowArrowPositions` now sets `arrow.style.display = 'none'` when `targetColumn` is empty OR the header `th[data-column-key=...]` lookup fails, instead of leaving the arrow at the stale position. |

### Open follow-ups from Wave 20 (not implemented this wave)

*(All Wave 20 follow-ups now closed — see Wave 22D below for FU-01.)*

## Closed in Wave 22D (2026-05-15) — FU-01 Angular-only demo

| ID | Title | Resolution |
|---|---|---|
| FDT-SHADOW-FU-01 | Showcase demo at `demos/component-docs/falcon-data-table-shadow-rows.md` | **CLOSED — Angular-only by design.** Pivoted from cross-framework `demos/component-docs/` to an in-workspace Angular-only demo at `demos/angular-playground/src/studio/shadow-rows/shadow-rows-demo.component.ts`, wired via a pill toggle in `app.component.ts`. Four scenarios shown side-by-side: (1) single shadow view-only; (2) single shadow view ↔ edit; (3) multi-shadow per parent with two different `targetColumn`s (priceType + priceValue); (4) sticky-actions + shadow rows. Mock dataset mirrors admin-console's `mock-applications` shape (channels with `scheduledChanges`). Vite + tsconfig path-mapping added for `@falcon/ui-core/angular` so the playground can consume the Angular wrapper. **Cross-framework demos (React/Vue) deferred indefinitely** — shadow row projection requires an Angular-specific Strategy E orchestrator (`EmbeddedViewRef` mounting via `ViewContainerRef.createEmbeddedView`). React/Vue would require equivalent orchestrators in `libs/falcon-ui-react/` and `libs/falcon-ui-vue/` — separate feature, separate effort, out of scope for the shadow rows feature itself. The Stencil base `<falcon-table-tw>` exposes the raw shadow events (`falcon-shadow-toggle`, `falcon-shadow-action`, `falcon-shadow-delete-request`, `falcon-shadow-cells-mounted`); React/Vue consumers can hook into those directly and manage their own template projection. |

## Closed in Wave 22A (2026-05-15) — Shadow row test coverage + minor cleanups

| ID | Title | Resolution |
|---|---|---|
| FDT-SHADOW-FU-08 | Specs for `updateShadowArrowPositions` + the projection orchestrator | **CLOSED.** Test framework: existing Stencil `--spec` harness (`@stencil/core/testing` + Jest 29 — same path the pre-existing `falcon-input.spec.ts` uses). New file: `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.shadow.spec.ts` with 16 specs across 5 describe blocks: render fence (3 specs — no shadow `<tr>` when meta null/empty, parent not expanded; correct `data-shadow-*` hooks when expanded), sticky-actions split (2 specs — 2-`<td>` layout vs single-cell default), chevron toggle event (2 specs — `falcon-shadow-toggle` payload + `aria-expanded` reflection), default action button events (4 specs — Edit/Delete/Save/Cancel emit correct `falcon-shadow-action` payloads; Delete also emits `falcon-shadow-delete-request` with `proposedShadowsForRow`; mode-dependent rendering), i18n aria-labels (2 specs — null falls back to visible label / explicit label wins), shadow arrow rendering surface (3 specs — `<span data-shadow-arrow>` emitted with no JSX inline style per Wave 20 fix, `data-shadow-target-column` carries the meta, parent `<th data-column-key>` hooks exist for runtime lookup). Result: **42 passed, 0 failed** (26 pre-existing + 16 new). Live position-math testing (header center − cell left − arrowHalfWidth) is deferred to a real-DOM e2e since mock-doc's `componentDidRender` does not propagate prototype-level patches to `updateShadowArrowPositions` reliably and `getBoundingClientRect` returns zeroed rects by default. The structural contract spec-tested here is the part `updateShadowArrowPositions` reads — geometry math is exercised end-to-end by the falcon-data-table showcase. |
| Chevron unicode → Falcon icon font | Replace `<span>▾</span>` in the shadow chevron button | **CLOSED.** `falcon-icon-chevron-down` glyph is defined in `libs/falcon-theme/src/styles/falcon-icons.css` (codepoint `\e902`) and loaded globally by both admin-console + management-console via `project.json` styles array. The shadow chevron is now `<i class="falcon-icon falcon-icon-chevron-down ${falconTableShadowChevronIconClasses()}" aria-hidden="true"></i>`. Rotation animation is unaffected — `rotate-180` lives on the `<button>` parent (`falconTableShadowChevronClasses`) and applies to the `<i>` child via CSS inheritance through the transform stack. Comment in `table-tailwind-classes.ts` updated. |
| ASCII-art glyph in doc-comment | Replace `▼` in `apps/admin-console/.../falcon-table-edit-row/falcon-table-edit-row.component.ts` line 3 | **CLOSED.** Header doc-comment ASCII layout updated: `[ New Price Type ▼ ] [ Effective Date 📅 ]` → `[ New Price Type (v) ] [ Effective Date (cal) ]`. Comment meaning preserved; future glyph-scanning regexes won't flag this file. Note: the brief referenced this file under `libs/falcon-ui-core/.../falcon-data-table/`, but it actually lives in `apps/admin-console` — that's where the change was made. |

## Closed in Wave 22C (2026-05-15) — management-console migration

| ID | Title | Resolution |
|---|---|---|
| FDT-SHADOW-FU-07 | management-console migration to shadow-row API | **CLOSED.** `apps/management-console/.../applications-table` migrated from a hand-rolled `<table>` to `<falcon-angular-data-table>` mirroring the admin-console twin. Visibility → `<falcon-angular-switch>`, Status → `<falcon-angular-status-badge>`, inline edit → `<app-falcon-table-edit-row>` projected via `slot="row-expansion"`, empty state via `[emptyData]`, scheduled changes → `[shadowRows]` + `<ng-template falconDataTableShadow>` with view/edit modes driven by lazy Reactive Forms (keyed `${rowId}::${shadowId}`). `mock-applications.ts` extended with the same `ApplicationScheduledChange` union so two channel rows (`c1`, `c2`) and one expired row (`c4`) demonstrate the shadow API. Architectural deviations from admin-console: doPayment action + accountId/nodeId inputs + DoPaymentPriorityPopupComponent intentionally omitted — mgmt-console callers don't wire account/node context and the legacy table never offered the action. |

## Closed in Wave 21 (2026-05-15) — Shadow row hardening

| ID | Title | Resolution |
|---|---|---|
| FDT-SHADOW-FU-02 | Validation contract for `targetColumn` (dev-mode `console.warn` when the field doesn't match any visible column) | **CLOSED.** `updateShadowArrowPositions` now emits a single `console.warn` per `(targetColumn, parentRowId, shadowId)` tuple when the header lookup fails. Tree-shaken in production via Stencil's `Build.isDev`. Tracked via a per-instance `Set<string>` to avoid spam on resize/render. |
| FDT-SHADOW-FU-03 | ResizeObserver hardening — observe individual `<th>` headers, not just the table host | **CLOSED.** The existing host-level ResizeObserver instance now ALSO observes every visible `<th data-column-key="…">`. Header set is synced inside `componentDidRender` and cleaned up in `disconnectedCallback`. Same RAF-coalesced `scheduleShadowArrowUpdate()` fires on each resize. Zero extra allocations — single observer reused. |
| FDT-SHADOW-FU-04 | (Re-scoped) `(shadowRowDeleteRequest)` convenience output | **CLOSED with re-scope.** Original "two-way `[(shadowRows)]`" rejected as an anti-pattern (consumer-derived collection state should not be library-managed — see `DECISION.md` Wave 21 entry). Replaced with `(shadowRowDeleteRequest)` output emitting `{ row, shadow, proposedShadowsForRow }`. Fires alongside the existing `shadowRowDelete` — consumer chooses which to wire. New Stencil event: `falcon-shadow-delete-request`. |
| FDT-SHADOW-FU-05 | Sticky-actions + shadow row precedence | **CLOSED.** When `stickyActions=true` AND `hasRowActions=true` (or `hasShadowRows=true`), each shadow `<tr>` now renders TWO `<td>`s: a main body cell spanning `(totalCols - 1)` (arrow + consumer template) AND a trailing sticky cell at the inline-end (default action buttons or projected `falconDataTableShadowActions` template). When either condition is false, the existing single-cell layout is preserved bit-for-bit. Arrow positioning is unaffected (anchored in the main cell). |
| FDT-SHADOW-FU-06 | i18n aria-labels | **CLOSED.** Five new opt-in props on `<falcon-table-tw>` + Angular wrapper inputs: `shadowChevronAriaLabel` (default `'Toggle row detail'`), `shadowEditAriaLabel`, `shadowDeleteAriaLabel`, `shadowSaveAriaLabel`, `shadowCancelAriaLabel` (last four default to `null`, which falls back to the visible label text). Forwarded as Stencil DOM properties in `syncProps`. |



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
