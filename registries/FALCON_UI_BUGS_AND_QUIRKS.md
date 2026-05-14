# Falcon UI Bugs & Quirks Catalog ("Tautology")

> **Purpose:** Prevent the brain from repeating bugs and quirks already discovered.
> **Consultation rule:** Every component edit MUST grep this catalog for the component's selector BEFORE making changes (see `component-capability-upgrade` skill).
> **Promotion gate:** Entries are `PENDING` until user approves. Per `protocols\APPROVAL_LEARNING_GATE.md`.
> **Cross-reference:** [`FALCON_COMPONENT_REGISTRY.md`](FALCON_COMPONENT_REGISTRY.md)

---

## Index

| ID | Affected component(s) | Severity | Status | Discovered |
|---|---|---|---|---|
| BUG-2026-05-14-001 | `<falcon-table-tw>` | Quirk | PENDING | 2026-05-14 |
| BUG-2026-05-14-002 | All Stencil `-tw` variants | Quirk | PENDING | 2026-05-13 |
| BUG-2026-05-14-003 | `<falcon-angular-data-table>` | Bug | PENDING | 2026-05-13 |
| BUG-2026-05-14-004 | `<falcon-angular-menu>` + wrapper | **Bug (HIGH)** | PENDING | 2026-05-14 |
| BUG-2026-05-14-005 | `<falcon-paginator-tw>` RPP wrapper | Quirk | PENDING | 2026-05-13 |
| BUG-2026-05-14-006 | `@falcon/ui-core` Stencil imports | Quirk | PENDING | 2026-05-13 |
| BUG-2026-05-14-007 | Falcon `rounded-md` scale | Naming trap | PENDING | 2026-05-14 |
| BUG-2026-05-14-008 | `--falcon-*` vs `--color-falcon-*` token names | Naming trap | PENDING | 2026-05-13 |
| BUG-2026-05-14-009 | `TranslateService.translate()` returns key when not loaded | Quirk | PENDING | 2026-05-13 |

---

## BUG-2026-05-14-001 — `<falcon-table-tw>` `:host` CSS-var override defeats parent inheritance

**Severity:** Quirk
**Status:** PENDING (workaround proven)

### Previous state
- Setting `--falcon-table-header-bg: var(--color-falcon-neutral-30)` on an ANCESTOR (e.g. the `<falcon-angular-data-table>` host) was being IGNORED because `<falcon-table-tw>` defines `:host { --falcon-table-header-bg: #ffffff; ... }` locally, overriding the cascade.

### Current state
- **Workaround**: set the CSS variable directly on the `<falcon-table-tw>` element itself (or on `<falcon-angular-data-table>` and use the inline style approach in the consumer effect):
  ```ts
  const tables = root.querySelectorAll('falcon-table-tw') as unknown as NodeListOf<HTMLElement>;
  tables.forEach((t) => {
    t.style.setProperty('--falcon-table-header-bg', 'var(--color-falcon-neutral-30, #fafafa)');
  });
  ```

### Recommended next action
- Library could expose a `themeProfile` input that sets the vars internally, removing the need for caller-side workarounds.

### Affected components
- Any `<falcon-table-tw>` consumer needing custom CSS-var overrides

---

## BUG-2026-05-14-002 — Stencil prop-forwarding gap

**Severity:** Quirk
**Status:** PENDING (viewChild imperative push is the standard workaround)

### Previous state
- Angular `[prop]` template bindings on Stencil custom elements (e.g. `[tabs]="visibleTabs()"`, `[items]="menuItems"`) don't reliably set the Stencil prop when:
  - The custom element is defined AFTER Angular's first render
  - The app is running in a federated remote (Module Federation registration timing)

### Current state
- **Workaround**: use `@ViewChild` to get the host element, then on every change push the prop imperatively:
  ```ts
  const stencil = host.querySelector('falcon-tabs-tw') as (HTMLElement & { tabs?: readonly FalconTabOption[] });
  if (customElements.get('falcon-tabs-tw')) {
    stencil.tabs = tabs;
  } else {
    customElements.whenDefined('falcon-tabs-tw').then(() => { stencil.tabs = tabs; });
  }
  ```

### Recommended next action
- Audit Stencil components and ensure `componentOnReady()` is awaited in wrappers' `syncProps()` before initial prop assignment. Already done correctly in `FalconAngularMenuComponent` (line 117-122).

### Affected components
- All Stencil `-tw` variants when consumed via Angular

---

## BUG-2026-05-14-003 — `<falcon-angular-data-table>` writes `headerKey` raw to DOM

**Severity:** Bug
**Status:** PENDING (consumer-side workaround in use)

### Previous state
- Setting `[columns]="[{headerKey: 'hierarchy.users.username', ...}]"` writes the i18n key literally to the `<th>` element instead of translating it.

### Current state
- **Workaround**: consumer translates column headers BEFORE passing to the data-table (see `state.userColumns()` computed in `HierarchyPageStateService`).

### Recommended next action
- Library should accept either `header` (raw text) or `headerKey` (i18n key) and call the injected `TranslateService` for the latter.

### Affected components
- `<falcon-angular-data-table>` column header rendering

---

## BUG-2026-05-14-004 — `<falcon-angular-menu>` wrapper `syncProps()` resets `open` + `anchorEl` on every change *(HIGH SEVERITY)*

**Severity:** Bug — HIGH (was making popup mechanism non-functional in reactive scenarios)
**Status:** **RESOLVED 2026-05-14 Wave 19** — `ngOnChanges` now uses `SimpleChanges` to sync ONLY the changed inputs; full sync only happens once in `ngAfterViewInit`. Empirically verified: row kebab → popup opens → STAYS open (no programmatic auto-close); "More Details" item clickable → drilldown opens.

### Previous state
- `falcon-menu.component.ts` `ngOnChanges() → syncProps()` (line 96-124) unconditionally writes ALL inputs to the Stencil element on every change cycle:
  ```ts
  el.items = this._items;
  el.anchorEl = this.anchorEl;   // wrapper @Input default: undefined
  el.open = this.open;            // wrapper @Input default: false
  el.popup = this.popup;
  ...
  ```
- When `<falcon-angular-data-table>` called `menuItems.set(items) + this.rowMenu?.showAt(anchor)` (line 542-543 of `falcon-data-table.component.ts`):
  - Stencil correctly set `el.open = true`, `el.anchorEl = anchor`, menu opened
  - Angular CD cycle then fired `ngOnChanges('items')` → `syncProps()` → reset `el.open = false`, `el.anchorEl = undefined`
  - Menu auto-closed ~54ms after opening with `reason: 'programmatic'`

### Empirical proof
Event capture during row-kebab click:
```
mousedown @ t=0
menu-open @ t=1ms
menu-close @ t=54ms (reason: 'programmatic')
```
Confirmed identical behavior with AND without consumer-side CSS workaround — confirming the issue is in the wrapper's syncProps, not in any consumer code.

### Current state (2026-05-14)
- `<falcon-angular-menu>` block DELETED from `<falcon-angular-data-table>` template per Ammar's authorization
- `<falcon-angular-data-table>`'s row-action menu feature now disabled library-wide
- `<falcon-tree-panel>` still uses its own `<falcon-angular-menu>` instance, unaffected (does not pass reactive items in the same tick as showAt)
- The wrapper bug REMAINS — any direct consumer that emulates the data-table's pattern will hit it

### Recommended next action
- Fix wrapper `syncProps()` to use `SimpleChanges` to only sync the inputs that actually changed:
  ```ts
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.menuEl) return;
    const el = this.menuEl.nativeElement;
    const assign = () => {
      if ('items' in changes) el.items = this._items;
      if ('anchorEl' in changes) el.anchorEl = this.anchorEl;
      if ('open' in changes) el.open = this.open;
      if ('popup' in changes) el.popup = this.popup;
      if ('appendTo' in changes) el.appendTo = this.appendTo;
      if ('triggerLabel' in changes) el.triggerLabel = this.triggerLabel;
      if ('disabled' in changes) el.disabled = this.disabled;
    };
    ...
  }
  ```
- After this fix, the row-action menu can be restored to `<falcon-angular-data-table>` template (with `[anchorEl]="host"` for trigger-hiding).

### Affected components
- `<falcon-angular-menu>` (wrapper) — primary
- `<falcon-angular-data-table>` (consumer of menu) — secondary, mitigated by 2026-05-14 library edit

---

## BUG-2026-05-14-005 — `<falcon-paginator-tw>` RPP wrapper fixed-width via Tailwind CSS-var

**Severity:** Quirk
**Status:** PENDING (CSS-var override is the standard workaround)

### Previous state
- The library's `[data-component="paginator-rows-per-page"]` wrapper uses Tailwind `w-[var(--falcon-data-table-paginator-rpp-width)]` and `min-w-[var(--falcon-data-table-paginator-rpp-min-width)]`. Defaults clip the wrapper to ~64px, hiding overflow content (e.g. an injected label).

### Current state
- **Workaround**: in the consumer effect, override the vars:
  ```ts
  rpp.style.setProperty('--falcon-data-table-paginator-rpp-width', 'auto');
  rpp.style.setProperty('--falcon-data-table-paginator-rpp-min-width', 'auto');
  rpp.style.flexShrink = '0';
  rpp.style.paddingInline = '8px';
  rpp.style.gap = '0';
  ```

### Recommended next action
- Library should expose a `rppWidth` input or allow `auto` as default.

### Affected components
- `<falcon-paginator-tw>` rows-per-page section

---

## BUG-2026-05-14-006 — `defineFalconTwComponent` direct import bundle bloat

**Severity:** Quirk
**Status:** PENDING (use wrapper instead)

### Previous state
- Importing `defineFalconTwComponent` from `@falcon/ui-core` directly into a consumer module pulled in ALL Stencil `.tsx` source files at compile time, breaking the build (TypeScript could not resolve all referenced types).

### Current state
- **Workaround**: use the corresponding Angular wrapper component (e.g. `<falcon-angular-paginator>` instead of the raw `<falcon-paginator-tw>`). The wrapper internally calls `defineFalconTwComponent` without exposing the bundle-graph issue.

### Recommended next action
- Library should provide tree-shakeable per-component define entries (`defineFalconPaginator`, `defineFalconMenu`, etc.)

### Affected components
- Any consumer trying to use raw Stencil tags without the Angular wrapper

---

## BUG-2026-05-14-007 — Falcon `rounded-md` scale ≠ standard Tailwind `rounded-md`

**Severity:** Naming trap
**Status:** PENDING

### Previous state
- Falcon's theme defines:
  - `--radius-sm` = **8px**
  - `--radius-md` = **12px**
  - `--radius-lg` = 16px
  - `--radius-xl` = 24px
- Conventional designer intent for "medium-rounded" (≈6-8px) maps to Falcon `rounded-sm`, NOT `rounded-md`. Using `rounded-md` produces what most designers would call `rounded-xl` (12px feels like a pill on small controls).

### Current state
- **Workaround**: when a designer says "medium rounded", use `rounded-sm` (8px) in Falcon scope. Confirmed by `libs/falcon-studio/WAVE-6A-AUDIT-REPORT.md` line 184.

### Affected components
- ALL Falcon UI consumers using Tailwind `rounded-*` classes

---

## BUG-2026-05-14-008 — `--falcon-*` vs `--color-falcon-*` token names

**Severity:** Naming trap
**Status:** PENDING

### Previous state
- Tailwind theme exposes color CSS variables as `--color-falcon-{family}-{shade}` (with the `--color-` prefix).
- Writing `var(--falcon-neutral-30)` returns an empty value (cascade misses), producing transparent or unstyled output.

### Current state
- **Workaround**: always use the full `--color-falcon-{family}-{shade}` prefix when reading color vars in `var(...)`:
  ```css
  background: var(--color-falcon-neutral-30, #fafafa);  /* ✓ correct */
  background: var(--falcon-neutral-30);                  /* ✗ empty */
  ```

### Affected components
- All consumers using Tailwind color theme tokens

---

## BUG-2026-05-14-009 — `TranslateService.translate()` is SYNC and returns the key when translations haven't loaded

**Severity:** Quirk
**Status:** PENDING (`langTick` signal pattern is the established workaround)

### Previous state
- `i18n.translate('hierarchy.users.username')` called before translations load returns the literal key `'hierarchy.users.username'` instead of the translated label.

### Current state
- **Workaround**: use a `langTick` signal that watches `i18n.get(anyKey)`. Wrap translating computeds in `langTick()` access so they re-fire when translations finish loading:
  ```ts
  protected readonly columnHeaders = computed(() => {
    this.state.langTick();  // re-fire when translations load
    return [{ field: 'username', header: this.i18n.translate('hierarchy.users.username') }];
  });
  ```

### Affected components
- All consumers using `TranslateService.translate()` synchronously in computeds

---

## BUG-2026-05-14-010 — `<falcon-tabs-tw>` auto-renders empty `<div role="tabpanel">` per tab with default padding

**Severity:** Quirk
**Status:** PENDING (CSS-var override is the standard workaround)

### Previous state
- Stencil `<falcon-tabs-tw>` (mode=navigation) renders a `<div class="falcon-tabs-panels">` container with one `<div role="tabpanel">` per tab option, each with `py-[var(--falcon-tabs-panel-padding-y)]`.
- Default `--falcon-tabs-panel-padding-y = 16px` (from `tabs.tokens.css` line 233) → 32px empty gap below the tab strip for consumers that DON'T use the Stencil's `<slot name="panel-${value}">` projection model.
- Affects any consumer that renders tab content as a sibling (not a projected slot).

### Current state
- **Workaround**: set `--falcon-tabs-panel-padding-y: 0px` (and `padding-x` too) on the `<falcon-tabs-tw>` element imperatively in the consumer effect. Panels stay in DOM for a11y (`role="tabpanel"` preserved) but collapse to 0px.
  ```ts
  tabsEls.forEach((t) => {
    t.style.setProperty('--falcon-tabs-panel-padding-y', '0px');
    t.style.setProperty('--falcon-tabs-panel-padding-x', '0px');
  });
  ```

### Recommended next action
- Library should expose a `[renderPanels]="false"` mode for consumers that handle content rendering themselves. OR change the default panel-padding-y to 0 (current padding only useful in Stencil-slot consumers).

### Affected components
- `<falcon-tabs-tw>` (consumers that render tab content as siblings)

---

## Catalog growth rules

1. Every new bug/quirk discovered during a session MUST be appended here BEFORE the session report is finalized.
2. Status starts at `PENDING` — promotion to `APPROVED` requires explicit user approval (per `protocols\APPROVAL_LEARNING_GATE.md`).
3. Severity scale:
   - **Quirk** — library behaves unexpectedly but documented workaround works
   - **Bug** — library defect that should be fixed
   - **Bug (HIGH)** — library defect that breaks a feature for ≥1 known consumer
   - **Naming trap** — non-obvious naming that easily produces silent failures
4. Cross-link every entry to the affected component(s) in `FALCON_COMPONENT_REGISTRY.md`.
5. Recommended next action MUST be concrete (code snippet preferred), not vague.
