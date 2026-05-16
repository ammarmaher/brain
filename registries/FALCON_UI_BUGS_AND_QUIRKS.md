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
| BUG-2026-05-14-011 | Library layering: shared-ui ↔ ui-core | Naming trap | PENDING | 2026-05-14 |
| BUG-2026-05-14-012 | Stencil `@Prop()` reserved HTMLElement names | Naming trap | PENDING | 2026-05-14 |
| BUG-2026-05-14-013 | Loader-entry chicken-and-egg with Stencil dist (first build) | Quirk | PENDING | 2026-05-14 |

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

## BUG-2026-05-14-011 — Falcon button `link` variant adds `hover:underline` + tight `--falcon-button-gap-*` defaults

**Severity:** Quirk (design-system tuning)
**Status:** **RESOLVED 2026-05-14** — library tokens updated

### Previous state
- `libs/falcon-ui-core/.../button-tailwind-classes.ts` line 95 set `hover:underline` on `variant="link"`. This added an underline to action buttons like "Information" on hover that visually competed with the surrounding chrome.
- `libs/falcon-ui-tokens/.../button.tokens.css` line 55-57 defined `--falcon-button-gap-{sm,md,lg}: 6/8/10 px` — too tight; icon glyphs visually pressed against the label.

### Current state
- Library `link` variant line 95: `hover:underline` → `hover:no-underline`.
  - Link variant now: transparent bg + text-color-change on hover, NO underline.
- Library token defaults bumped by +4px each: `--falcon-button-gap-sm: 6→8`, `gap-md: 8→12`, `gap-lg: 10→14`.
  - Visible breathing room between icon and label, matches source-of-truth.

### Affected components
- ALL Falcon button consumers across the platform (library-wide token change).

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

## BUG-2026-05-14-011 — Library layering: `@falcon/shared-ui` cannot be imported FROM `@falcon/ui-core/angular`

**Severity:** Naming trap (architectural)
**Status:** PENDING

### Previous state
- New `<falcon-empty-data>` component placed in `libs/falcon/src/shared-ui/lib/components/falcon-empty-data/`.
- `<falcon-angular-data-table>` (in `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/`) needs to import it for the `[emptyData]` auto-mount feature.
- Attempted `import { FalconEmptyDataComponent } from '@falcon/shared-ui'` → circular dependency because `@falcon/shared-ui` already re-exports MANY components FROM `@falcon/ui-core/angular` (data-table, input, button, dropdown, etc.).

### Current state
- Component is colocated INSIDE `libs/falcon-ui-core/src/angular-wrapper/components/falcon-empty-data/`, sibling of `falcon-data-table`.
- `@falcon/ui-core/angular` barrel exports it directly.
- `@falcon/shared-ui` barrel re-exports it FROM `@falcon/ui-core/angular` (one-way dependency: shared-ui depends on ui-core, never the reverse).
- Consumer API surface is unchanged — `import { FalconEmptyDataComponent } from '@falcon'` still works.

### Rule (going forward)
- **Layering direction:** `@falcon/ui-core/angular` → `@falcon/shared-ui` → consumer apps.
- A library component USED BY any `@falcon/ui-core/angular` wrapper MUST live in `@falcon/ui-core/angular`, not in `@falcon/shared-ui`.
- Use `@falcon/shared-ui` only for components that depend on `@falcon/ui-core/angular` but are NOT themselves depended on by it (e.g., `<falcon-tree-panel>`, `<falcon-node-details-section>`, `<falcon-view-toggle>` — all compose data-table or button but no library wrapper imports them).

### Affected components
- `<falcon-empty-data>` (initial placement was wrong, corrected)
- Architectural rule applies to ALL future shared components

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

---

## BUG-2026-05-14-012 — Stencil reserved HTMLElement prop names silently skip dist emission

**Severity:** Naming trap
**Status:** PENDING
**Discovered:** 2026-05-14 (Strategy v1.0 run `2026-05-14_falcon-empty-data`, Wave 19 / 16th iter)

### Previous state
- New Stencil components declared `@Prop()` names that clash with HTMLElement prototype members — common cases: `title`, `scrollHeight`, `scrollTop`, `scrollLeft`, `id`, `lang`, `dir`, `hidden`, `style`, `tabIndex`, `accessKey`, `draggable`, `contentEditable`.
- Concrete example: initial `<falcon-empty-data>` draft declared `@Prop() title: string;`.
- Stencil's compiler emits a build-time warning for these names (e.g. `"The component's prop 'title' is a reserved HTMLElement property"`), but the warning is easy to miss in long build logs.
- **More dangerous:** Stencil then **silently skips dist emission for the affected component**. The build succeeds, the loader-entry exists, but the runtime element does not register — every usage renders an empty inert custom element with no shadow root and no internals.

### Current state
- Pre-flight grep added to the strategy v1.0 pitfall catalog (`08-COMMON_PITFALLS`):
  ```bash
  grep -nE "@Prop\(\)\s+(title|scrollHeight|scrollTop|scrollLeft|id|lang|dir|hidden|style|tabIndex|accessKey|draggable|contentEditable)[?:!]" libs/falcon-ui-core/src/components/**/*.tsx
  ```
- **Rename convention:** suffix with `<noun>Text` (e.g. `titleText`, `bodyText`, `descriptionText`) — already in use by `<falcon-empty-state>` and now by `<falcon-empty-data>`.
- For `<falcon-empty-data>` specifically, `@Prop() titleText: string = 'No data found';` ships in the canonical Wave 19 / 16th-iter contract.

### Recommended next action
- Add a Stencil custom-rule plugin (or post-build check script) that fails the build on reserved-name `@Prop()` declarations rather than only warning.
- Document the full reserved-name list in `protocols/STENCIL_NAMING_GUIDE.md`.

### Affected components
- `<falcon-empty-data>` family — fixed by renaming `title` → `titleText` in the 16th iter
- Any future Stencil component declaring `@Prop()` with the names above

### Mitigation rule (going forward)
- **Pre-flight grep before every new Stencil component lands.**
- When in doubt, suffix with `Text` / `Value` / `Setting` to disambiguate.

---

## BUG-2026-05-14-013 — Loader-entry chicken-and-egg with Stencil dist on first build

**Severity:** Quirk
**Status:** PENDING
**Discovered:** 2026-05-14 (Strategy v1.0 run `2026-05-14_falcon-empty-data`, Wave 19 / 16th iter)

### Previous state
- New entries in `define-falcon-tw-component.ts`'s `twLoaders` map reference paths like `'../dist/components/falcon-X-tw'`.
- TypeScript validates the import path **before** Stencil emits the dist on the FIRST build for a brand-new component (the dist file doesn't yet exist).
- Build fails with: `Module not found: Error: Can't resolve '../dist/components/falcon-empty-data-tw'` (or equivalent).
- Same trap exists for ANY new dual-render `*-tw` component in the loader-map.

### Current state
- **One-time bootstrap pattern:**
  1. Comment out the new line in `twLoaders` map.
  2. Run `nx build falcon-ui-core` once — Stencil emits the dist for the new component.
  3. Uncomment the line.
  4. Rebuild — TypeScript now resolves the import successfully.
- After the first successful build, the dist persists and subsequent rebuilds work normally.

### Why it happens
- Stencil's build emits `dist/components/<tag>.js` only AFTER the TypeScript compiler validates every `.ts` file in the build graph.
- The loader map TypeScript-validates the dist path before Stencil emits it. Pure ordering problem on first build only.

### Recommended next action
- Add a build-time post-Stencil hook that auto-generates the `twLoaders` entry from `dist/components/*.js` matches — eliminates the manual sync and the chicken-and-egg.
- Alternatively, mark the import as `import(/* webpackIgnore: true */ '...')` dynamic to defer resolution past TS validation.

### Affected components
- Any new `*-tw` Light-DOM Stencil component added to `twLoaders` for the first time
- Concrete instance: `<falcon-empty-data-tw>` (Wave 19 / 16th iter)

### Mitigation rule (going forward)
- **Document this in the strategy v1.0 `09-FIRST_TIME_BUILD_BOOTSTRAP.md` step.**
- Reviewer checklist: confirm new `*-tw` entries shipped in a build that succeeded — not just a clean tree where the loader-map was added last.

---

_Last updated: 2026-05-14 — Strategy v1.0 — Run: 2026-05-14_falcon-empty-data — Author: Adnan (auto)_
5. Recommended next action MUST be concrete (code snippet preferred), not vague.
