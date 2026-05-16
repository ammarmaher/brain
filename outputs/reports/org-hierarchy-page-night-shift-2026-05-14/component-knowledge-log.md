# Component Knowledge Log — Org Hierarchy Page Live-Parity Session

**Started:** 2026-05-14 morning session (Wave 17 live MCP parity loop)
**Status:** Living document — append as new learnings surface

This file captures **every non-obvious behavior** discovered while live-testing the admin-console Org Hierarchy page through Chrome MCP. Each entry includes: symptom → root cause → fix pattern → applies-to list. Future sessions should READ THIS FIRST before debugging similar issues.

---

## 1. Stencil prop-forwarding gap (the recurring villain)

### Symptom
Angular's `[someProp]="value()"` binding on a `<falcon-angular-X>` wrapper visibly sets the wrapper's `@Input`, but the **inner Stencil custom element doesn't pick up the value**. DOM inspection: `wrapper.tabs = [...4 items...]` but `stencil.tabs = []`.

### Where seen this session
- **`<falcon-angular-tabs>` → `<falcon-tabs-tw>`** — `[tabs]` Input passed correctly to wrapper; stencil never received it; tab strip rendered empty.
- **`<falcon-angular-data-table>` → `<falcon-table-tw>` → `<falcon-paginator-tw>`** — `[rowsPerPageOptions]="[10,20,30,40]"` sets the property on `<falcon-table-tw>` but NOT forwarded to inner `<falcon-paginator-tw>`; rows-per-page dropdown hidden.

### Root cause hypothesis
Module Federation singleton mismatch: `@falcon` shared module has different instances between host-shell and admin-console (warnings emit on console). The Stencil custom element class is defined async via `defineFalconTwComponent()` in `ngOnInit`. If Angular renders + sets properties BEFORE the custom element class is registered, the pre-upgrade property writes get lost during the upgrade callback.

### Fix pattern
**Imperatively push the property onto the Stencil element AFTER `customElements.whenDefined(...)` resolves.** Use a `viewChild` (or `document.querySelector` scoped to the feature root) + `effect()` that re-runs whenever the source signal changes.

```ts
private readonly tabsHostRef = viewChild('tabsHost', { read: ElementRef });

constructor() {
  effect(() => {
    const tabs = this.visibleTabsForFalcon();              // signal-tracked
    const host = this.tabsHostRef()?.nativeElement;
    if (!host) return;
    const stencil = host.querySelector('falcon-tabs-tw');
    if (!stencil) return;
    const apply = () => { (stencil as any).tabs = tabs; };
    if (customElements.get('falcon-tabs-tw')) apply();
    else customElements.whenDefined('falcon-tabs-tw').then(apply).catch(() => undefined);
  });
}
```

### Applies to
Every Stencil Light-DOM component (`falcon-*-tw`) that takes an array/object property. Suspects worth checking: `<falcon-tree-tw>`, `<falcon-dropdown-tw>`, `<falcon-multi-select-tw>`.

---

## 2. TranslateService.translate() is SYNC — returns the key when translations haven't loaded

### Symptom
- `userColumns: ColumnDef[] = [{ headerKey: 'hierarchy.col.username', ... }]` initialized at class-field time → headers render as literal raw keys (`hierarchy.col.username`) instead of "Username".
- Same for `userRowMenuItems` with `label: this.i18n.translate('...')` inline.
- `<falcon-angular-tabs>` tab labels invisible — `i18n.translate('hierarchy.tabs.hierarchy')` returned `'hierarchy.tabs.hierarchy'` on first call, never re-run.

### Root cause
`TranslateService` (libs/falcon/src/language/lib/services/translate.service.ts):
- Has a `currentTranslations$` `BehaviorSubject<TranslationObject>` initialized with `{}`.
- `translate(key)` does a synchronous lookup; returns `key` if BehaviorSubject still empty (line 209: `return key; // Return key as last resort`).
- Translations load async via `loadTranslationsSync()` in the constructor — but it's HTTP fetch, so a few ms gap.
- Class fields initialized BEFORE translations load → captured key as value.
- `computed()` doesn't re-run on translation load because TranslateService doesn't expose a signal — only `get(key): Observable<string>`.

### Fix pattern
**Add a `langTick` signal driven by `get(anyKey)` Observable, depend on it in every translating computed.**

```ts
readonly langTick = signal(0);

constructor() {
  this.i18n.get('hierarchy.col.username')                // any key works as a tick source
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => this.langTick.update(n => n + 1));
}

readonly userColumns = computed<ColumnDef[]>(() => {
  this.langTick();                                       // dep — re-runs on translation load
  const t = (k: string) => this.i18n.translate(k);
  return [{ field: 'username', headerKey: t('hierarchy.col.username'), ... }, ...];
});
```

### Applies to
- Anywhere class-field initializer calls `i18n.translate()`
- Any `computed()` that calls `i18n.translate()` without depending on a translation-state signal
- Module Federation remotes — TranslateService is `providedIn: 'root'` so each remote has its own instance with its own async loading lifecycle

---

## 3. `<falcon-angular-data-table>` writes `headerKey` RAW to DOM (no translate)

### Symptom
Column headers show literal i18n keys (`hierarchy.col.username`) even though the keys exist in en.json.

### Root cause
`falcon-data-table.component.ts:430`:
```ts
const text = col?.headerKey ?? m.field;
if (m.element.textContent !== text) m.element.textContent = text;
```
No translate call. The library expects the consumer to pre-translate.

### Fix pattern
Combine with Section 2 — pre-translate via a `computed` that returns `ColumnDef[]` with already-resolved labels.

### Applies to
- Users data-table in org-hierarchy
- Apps & Services / CommChannels & Services tables (same lib component)
- Any future `<falcon-angular-data-table>` consumer

### Library bug to file
Data-table SHOULD translate `headerKey` via TranslatePipe internally. Currently it treats `headerKey` as the final label text — misleading field name.

---

## 4. `<falcon-table-tw>` has a `:host` CSS-var override that breaks parent inheritance

### Symptom
Setting `--falcon-table-header-bg` on the outer `<falcon-angular-data-table>` host via `[style]` binding doesn't propagate to inner `<th>` cells. Computed `--falcon-table-header-bg` on the wrapper is `#fafafa` but on the `<th>` resolves to `#ffffff` (the default).

### Root cause
`<falcon-table-tw>` Stencil component has a local `:host { --falcon-table-header-bg: #ffffff; ... }` declared in its tokens CSS. CSS variables cascade, but a child setting the same variable on its `:host` LOCALLY overrides the inherited value. So:
- Inheritance path: `<falcon-angular-data-table style="--falcon-table-header-bg: #fafafa">` → `<falcon-table-tw :host{--falcon-table-header-bg:#ffffff}>` → `<th>` reads `#ffffff` from the closer ancestor.

### Fix pattern
Set the CSS var on the `<falcon-table-tw>` element itself, not on the outer wrapper.

```ts
const tables = root.querySelectorAll('falcon-table-tw') as unknown as NodeListOf<HTMLElement>;
tables.forEach(t => {
  t.style.setProperty('--falcon-table-header-bg', 'var(--color-falcon-neutral-30, #fafafa)');
  t.style.setProperty('--falcon-table-footer-bg', 'var(--color-falcon-neutral-30, #fafafa)');
});
```

### CSS-var naming gotcha
The token name is **`--color-falcon-neutral-30`** (Tailwind `@theme` convention), NOT `--falcon-neutral-30`. Falcon table tokens reference these as `var(--color-falcon-neutral-0, #ffffff)`.

### Applies to
Any Stencil component with `:host{...}` token overrides — `<falcon-tabs-tw>`, `<falcon-dropdown-tw>`, etc. likely have similar patterns.

---

## 5. `<falcon-paginator-tw>` paginator-template internals

### Default template
```
CurrentPageReport FirstPageLink PrevPageLink JumpToPageInput NextPageLink LastPageLink RowsPerPageDropdown
```

### Rendering rules
- **RowsPerPageDropdown only renders when `rowsPerPageOptions` is non-empty** (per `falcon-paginator-tw.tsx:311`: `const opts = this.rowsPerPageOptions ?? []; if (opts.length === 0) ...`).
- The dropdown renders as a native `<select>` with the array values as `<option value>`.
- Element accepts the property as a JS array: `pag.rowsPerPageOptions = [10,20,30,40]`.

### Where to set it
- Angular wrapper accepts `[rowsPerPageOptions]="number[]"` (mutable, NOT readonly — TS4104 error otherwise).
- Wrapper forwards to `<falcon-table-tw>`, which is supposed to forward to inner `<falcon-paginator-tw>` (line 795 in `falcon-table-tw.tsx`).
- **In practice, the table-tw → paginator-tw forward fails under MF (see Section 1).** Fix: imperatively set `pag.rowsPerPageOptions` from the consumer.

---

## 6. `<falcon-angular-tabs>` per-tab actions slot — `<ng-template falconTabActions="...">`

### Use case
Project content INTO the tab strip row (same horizontal line as tab buttons), conditionally per active tab.

### Pattern
```html
<falcon-angular-tabs [tabs]="..." [selectedValue]="..." (valueChange)="...">
  <ng-template falconTabActions="hierarchy">
    <!-- only shows when 'hierarchy' tab is active; rendered as sibling of tab buttons -->
    <app-org-view-toggle [(value)]="state.structureView" />
  </ng-template>
  <ng-template falconTabActions="settings">
    <!-- different actions for settings tab -->
  </ng-template>
</falcon-angular-tabs>
```

### Wrapper implementation
- `FalconTabActionsDirective` registered via `contentChildren(FalconTabActionsDirective)`.
- Wrapper has an `effect()` that finds the Stencil `<div role="tablist">` and physically moves the actions anchor into it via `appendChild` (lines 121-152 in `falcon-tabs.component.ts`).
- A `MutationObserver` re-injects after every Stencil re-render.

### Imports needed
```ts
import { FalconTabActionsDirective } from '@falcon/ui-core/angular';
// add to component's imports array
```

### Common mistake
Putting the toggle OUTSIDE `<falcon-angular-tabs>` in a flex `justify-between` wrapper → looks ok visually but breaks the per-tab visibility contract + alignment with Falcon's tab pattern.

---

## 7. Read-before-edit reminders are ADVISORY in practice

### Behavior observed
- `PreToolUse:Edit hook` fires with "READ-BEFORE-EDIT REMINDER: ... runtime will reject edits to files that have not been read."
- In this session, the runtime **accepted** edits where the file was Read EARLIER in the same conversation but not immediately before the Edit. The reminder fires advisory; the runtime's actual gate is broader.
- Tool result `"has been updated successfully"` is the source of truth — if it says success, the edit landed.

### Pattern
- Don't waste a tool call re-reading the same file twice if you already Read it this session — but DO Read if you're about to edit a section you haven't seen.

---

## 8. Module Federation @falcon singleton warnings

### Symptom in console
```
[ Federation Runtime ] Version 0.0.1 from host_shell of shared singleton module @falcon
  does not satisfy the requirement of admin_console which needs auto
```

### What it means
host-shell and admin-console each have their own bundled `@falcon` library code. The singleton-share contract isn't satisfied because version metadata is `0.0.1` (placeholder) on both sides.

### Impact on this feature
- Two separate `TranslateService` instances — admin-console has its own translation cache.
- Two separate Stencil custom-element registrations — race conditions in property forwarding (see Section 1).
- HierarchyPageStateService is route-provided so it's scoped to admin-console route — OK.

### Mitigation
- All workarounds in this knowledge log are designed to be tolerant of these dual-instance situations.
- Long-term lib fix: pin actual versions in package.json for shared singletons.

---

## 9. i18n key conventions (Org Hierarchy scope)

### Top-level blocks in en.json / ar.json

| Block | Purpose | Examples |
|---|---|---|
| `hierarchy.col.*` | Users data-table column labels | `username`, `firstName`, `email`, `phone`, `role`, `permGroup`, `status` |
| `hierarchy.status.*` | User status badge labels | `active`, `pending`, `suspended`, `locked`, `deleted` |
| `hierarchy.users.*` | Users-section UI strings | `title`, `empty`, `moreDetails`, `bulk.*` |
| `hierarchy.tabs.*` | Tab strip labels | `hierarchy`, `commChannels`, `apps`, `settings` |
| `hierarchy.actions.*` | Node-header action buttons | `information`, `addNode`, `addClient`, `addUser`, `editNode`, `backToUsers`, `filter`, `search` |
| `hierarchy.settings.*` | Settings tab labels | `title`, `save`, `password`, `passwordNormal`, `allowedIps`, `ipNote` (= red restriction warning) |
| `hierarchy.applications.col.*` | Apps/CommChannels table columns | `visibility`, `name`, `priceType`, `priceValue`, `firstActivation`, `activationDate`, `renewDate`, `status`, `action` |
| `hierarchy.applications.status.*` | Apps/CommChannels status badges | `active`, `inactive`, `expired`, `disable` |
| `hierarchy.applications.priceType.*` | Price type dropdown options | `oneTime`, `monthly`, `quarterly`, `yearly` |
| `hierarchy.applications.actions.*` | Row actions | `edit`, `delete`, `cancel`, `rowMenu` |
| `hierarchy.applications.edit.*` | Inline-edit form labels | `newPriceType`, `newPriceValue`, `effectiveDate`, `set` |
| `hierarchyTab.tree.*` | Tree-panel labels | `clientsLabel`, `actions.addClient`, `actions.addNode`, `actions.editNode`, `actions.addUser` |
| `hierarchyTab.contextMenu.*` | Right-click menu items | `addNode`, `editNode`, `addClient`, `addUser`, `viewDetails`, `delete` |
| `hierarchy.commChannels.title` | CommChannels table title | `"Comm Channels"` |
| `hierarchy.appsServices.title` | Apps & Services table title | `"Apps & Services"` |

### Gotcha
The keys `hierarchy.applications.status.expired` and `.disable` were **missing** from en.json+ar.json when ApplicationsTable was first ported — fixed during Bug 2 by adding them under `hierarchy.applications.status`.

---

## 10. Shared `client-settings-step` between Settings tab + Add Client wizard

### Architecture
- `components/wizard-components/add-client-wizard/client-settings-step/` — the SOURCE of the security/IPs/limits form.
- `components/tab-components/settings-tab/` — thin shell that HOSTS `<app-client-settings-step>` in view/edit modes.

### Implication
Any structural change to `client-settings-step` (e.g., dual `Current/Max` column layout for Settings) **affects the Add Client wizard step 2 too**.

### Decision register
- **D-W3-1 (deferred):** Dual Current/Max columns in Settings — would require splitting `client-settings-step` into a Settings-specific variant. Architectural decision pending.

---

## 11. Compact button sizes for node-header actions

### Pattern
```
h-8 px-3 text-[12.5px] font-medium leading-none rounded-lg
```

Ghost-text variant (Information button only):
```
h-8 px-1.5 text-[12.5px] font-medium ... bg-transparent border-0 text-falcon-neutral-600
```

### Was
```
h-[38px] px-4 text-[13px] font-semibold rounded-[10px]
```
Too chunky vs React reference.

---

## 12. Users-view toggle (List | Board) hidden when Kanban deferred

### Reason
`<app-org-view-toggle [options]="state.usersOptions" [(value)]="state.usersView" />` was rendering above the users table even though `'board'` mode renders only a "not surfaced in v1" placeholder. Looked like dead UI to the user.

### Fix
Wrapped the users-table-internal toggle in a comment-block + condition so it doesn't render until KanbanView is actually surfaced. The page-level `List | Tree` toggle (now inside the tabs row via `falconTabActions` slot) remains.

---

## 13. `<app-falcon-status>` component (NEW, this session)

### Location
`apps/admin-console/src/app/features/org-hierarchy-page/components/falcon-status/`

### Contract
- **Input only:** `value: FalconStatusValue | null | undefined`
- **Fixed color map** — caller cannot override. Status types:
  - `active` → green-50 bg / green-500 dot / `hierarchy.status.active`
  - `pending` → amber-50 bg / amber-500 dot / `hierarchy.status.pending`
  - `suspended` → neutral-175 bg / neutral-500 dot / `hierarchy.status.suspended`
  - `locked` → neutral-175 bg / neutral-500 dot / `hierarchy.status.locked`
  - `deleted` → red-100 bg / red-500 dot / `hierarchy.status.deleted`
  - `expired` → red-50 bg / red-500 dot / `hierarchy.applications.status.expired`
  - `disable` → neutral-100 bg / neutral-500 dot / `hierarchy.applications.status.disable`
  - `inactive` → amber-50 bg / amber-500 dot / `hierarchy.applications.status.inactive`
- **Renders pill:** `inline-flex items-center h-5 px-2.5 rounded-full text-[11px] font-semibold leading-none capitalize whitespace-nowrap` + colored dot + translated label.
- **Falsy value** → renders `-----` placeholder.

### Usage in data-table cell template
```html
<ng-template falconDataTableCell="status" let-value="value">
  <app-falcon-status [value]="value" />
</ng-template>
```

### Replaces
30-line `@switch` inline in the menu template.

### Future
Could be promoted to `@falcon/ui-core/angular` lib if more consumers need it. For now stays page-local.

---

## 14. Authentication session timing

### Observation
- User logs in once → session cookie persists in the Chrome MCP-controlled tab.
- After ~1 hour, session expires → navigation to `/#/admin-console/...` redirects to `/#/error` ("Access Check Failed").
- Re-login required.

### Constraint
- **Claude cannot type the password** (security policy: never submit password forms even with pre-filled creds).
- User must click the "Login" button themselves.

### Workflow
- When session expires mid-session: pause + ask user to click Login button.
- After re-login, navigate back to the org-hierarchy route and resume from where we left off.

---

## 15. Browser cache & HMR quirks

### Observation
- TranslateService caches translations in a `BehaviorSubject` in memory.
- Updating `en.json` / `ar.json` and rebuilding host-shell does NOT invalidate the BehaviorSubject in an already-loaded tab.
- `location.reload()` is required to pick up new translation keys.

### When this matters
- Adding/changing i18n keys mid-session — always trigger a reload after the build completes.
- New components / template changes — HMR usually picks them up, but signal-driven re-renders sometimes need a reload too.

---

## Maintenance note

This file should be **appended to** as new learnings surface — never overwritten. Each new entry follows the format: numbered section, symptom, root cause, fix pattern, applies-to.

End of component knowledge log (sections 1-15 captured 2026-05-14 morning).

---

## 16. Paginator RowsPerPage wrapper is fixed-width — Tailwind `w-[var(...)]`

### Symptom
Injecting a "Rows per page" label before the `<select>` in `<falcon-paginator-tw>`'s rows-per-page wrapper → label visually truncated at the right edge of the table. JS check shows `labelText: "Rows per page"` (full) but `rppRect.width = 64px` (no room).

### Root cause
The `[data-component="paginator-rows-per-page"]` wrapper has Tailwind classes that pin it to fixed dimensions:
```
inline-flex items-center
  h-[var(--falcon-data-table-paginator-rpp-height)]
  min-w-[var(--falcon-data-table-paginator-rpp-min-width)]
  w-[var(--falcon-data-table-paginator-rpp-width)]
  bg-[var(--falcon-data-table-paginator-rpp-bg)]
  ...
```
The `w-[var(...)]` is the killer — it pins the **width** at the token value (64px). Inline `min-width: auto` doesn't help because `width` is the dominant constraint.

### Fix pattern
Override the underlying CSS vars (the Tailwind class reads from them):
```ts
rpp.style.setProperty('--falcon-data-table-paginator-rpp-width', 'auto');
rpp.style.setProperty('--falcon-data-table-paginator-rpp-min-width', 'auto');
rpp.style.flexShrink = '0';
rpp.style.paddingInline = '8px';
```

After: wrapper expands to 140px (label 89px + select 40px + padding) → label visible.

### Why CSS-var override beats inline `width: auto`
Tailwind's `w-[var(--falcon-data-table-paginator-rpp-width)]` generates `width: var(--falcon-data-table-paginator-rpp-width)` in the stylesheet. The cascade resolves `var(...)` at compute time. By setting the CSS var on the element via `style.setProperty`, the resolved value becomes `auto` — works without specificity wars.

### Applies to
Any Stencil component with Tailwind `w-[var(--token)]`/`min-w-[var(--token)]` classes when you need to inject extra content into a fixed-sized region. Suspects: paginator's CurrentPageReport region, JumpToPageInput region.

---

## 17. CSS-var inheritance: child class reads var, parent inline style sets var

### Pattern proven this session
- `<falcon-table-tw>` had Tailwind `bg-[var(--falcon-table-header-bg)]` on `<th>` cells.
- Setting `t.style.setProperty('--falcon-table-header-bg', '#fafafa')` on the `<falcon-table-tw>` element propagated correctly to descendant `<th>` cells.
- This works because CSS custom properties inherit through the cascade by default.

### When it fails
- Parent component has `:host { --token: defaultValue }` declared in its stylesheet. The local `:host` declaration WINS over the parent-element inline style (closer ancestor in the cascade).
- Workaround: set the var directly on the element that has the `:host` override (e.g., `<falcon-table-tw>` itself, not its `<falcon-angular-data-table>` wrapper).

### Var-name conventions
- Token bridge: Tailwind theme tokens are exposed as `--color-falcon-{family}-{shade}` (e.g., `--color-falcon-neutral-30`).
- Component-scoped tokens: `--falcon-{component}-{slot}-{property}` (e.g., `--falcon-table-header-bg`, `--falcon-data-table-paginator-rpp-width`).
- Always check which one a class uses before overriding.

---

## 18. `<app-falcon-custom-table-footer>` component (NEW, this session)

### Location
`apps/admin-console/src/app/features/org-hierarchy-page/components/falcon-custom-table-footer/`

### Why custom (instead of using lib's internal paginator footer)
The lib's `<falcon-angular-data-table>` renders `<falcon-paginator-tw>` inside `<falcon-table-tw>` in ONE flex row with all paginator regions inline. The React/HTML truth requires a **3-section grid layout**:
- Left: "Showing X-Y from Z"
- Center: « ‹ [page] of N › »
- Right: "Rows per page" + dropdown

Achieving this via CSS overrides on the internal paginator's nav was fragile and required imperative JS patches (label injection, width unfix). Cleaner: **disable the lib's internal paginator** (`[paginator]="false"`) and render a custom 3-section footer as a sibling.

### Contract
```ts
input.required<number>() totalRecords
input<number>() currentPage = 1
input<number>() rows = 10
input<readonly number[]>() rowsPerPageOptions = [10, 20, 30, 40]
input<boolean>() disabled = false

output<number>() pageChange
output<number>() rowsChange
```

### Internal composition
- Plain text + i18n for "Showing X-Y from Z" (no lib needed — `first`/`last` computed from currentPage × rows)
- `<falcon-angular-paginator>` (Angular wrapper) for the nav region with `[showFirstLast]="true"` `[showPrevNext]="true"` `[showPageInfo]="true"` `size="sm"`
- Plain `<label>` + `<select>` with `[ngModel]` for rows-per-page

### Why NOT use `<falcon-paginator-tw>` directly
- The Stencil element's class isn't registered unless something calls `defineFalconTwComponent('falcon-paginator')`.
- That helper isn't exported via the public `@falcon/ui-core` barrel — importing it via a deep path triggers TS to try compiling Stencil `.tsx` source files (errors: `falcon-accordion-tw.tsx is missing from the TypeScript compilation`).
- The `<falcon-angular-paginator>` wrapper calls `defineFalconTwComponent` in its own `ngOnInit`, so using the wrapper registers the Stencil element automatically.

### Wiring at the consumer (menu component)
```html
<falcon-angular-data-table [paginator]="false" ...>
  <ng-template falconDataTableCell="status" let-value="value">
    <app-falcon-status [value]="value" />
  </ng-template>
</falcon-angular-data-table>
<app-falcon-custom-table-footer
  [totalRecords]="state.usersTotalCount()"
  [currentPage]="state.usersPageNumber()"
  [rows]="state.usersPageSize()"
  [rowsPerPageOptions]="rowsPerPageOptions"
  (pageChange)="onPageChange($event)"
  (rowsChange)="onRowsChange($event)" />
```

### State sync
- `onPageChange(page)` → `state.usersPageNumber.set(page)` — triggers HierarchyService.getUsers() via the state service's combineLatest trigger.
- `onRowsChange(rows)` → `state.usersPageSize.set(rows); state.usersPageNumber.set(1)` — resets to page 1 on size change.

### Styling
- `grid grid-cols-3 items-center` → 3 equal zones with auto-aligning justify-self
- `bg-falcon-neutral-30 text-[12px] text-falcon-neutral-600` → matches header bg + small grey text
- `border-t border-falcon-neutral-150` → separator above
- `rounded-b-[12px]` → matches data-table container's rounded corners (clipped at bottom)

### Visual parity confirmed
Live screenshot matches the React/HTML reference for Aramco selected (1 user, AccOwner1, Pending status, footer with all 3 sections rendered correctly).
