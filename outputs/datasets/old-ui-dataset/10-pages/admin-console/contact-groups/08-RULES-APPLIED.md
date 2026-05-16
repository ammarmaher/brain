# Rules / patterns — contact-groups (admin-console)

## Observed (good)

1. **Standalone components throughout.** Both `ContactGroupsComponent` (line 49) and `ContactGroupDetailsComponent` (line 63) declare `standalone: true` and import their dependencies inline. Aligns with Angular v17+ idioms. [CODE]
2. **`inject()` over constructor DI.** Every service is pulled with `inject(...)` at field-init time (lines 65-72 of list, lines 86-96 of detail). No constructor injection. Cleaner DI surface, also enables service-injection in functional guards. [CODE]
3. **Signals for permission state.** Permissions are held in `signal<ContactGroupPermissionFlags>()` + `signal<boolean>()` for the `permissionsReady` gate (lines 97-98 of list, 105-106 of detail). A `computed()` reads the flags to derive `isReadOnlyViewer`. This is the right primitive for cross-template gating. [CODE]
4. **Batch PES resolution.** A single `accessControlFacade.resolveFlags({ ... })` call resolves 9 (list) / 8 (detail) PES queries in one round-trip — instead of 9 sequential `can()` calls. Banner comment is explicit: "PES outage → empty (all-false) flags". [CODE — `loadPermissions()` in both files]
5. **`takeUntilDestroyed(destroyRef)`** on every long-lived observable in the detail component (lines 308, 361, 402, 645). No manual `Subject<void>` + `takeUntil` boilerplate. [CODE]
6. **OnPush change detection on the detail component.** Line 80: `changeDetection: ChangeDetectionStrategy.OnPush` + explicit `cdr.markForCheck()` calls after async work. [CODE]
7. **DTO-as-source-of-truth dynamic columns.** `buildColumnsFromDefinitions()` (line 334 of detail) reads `detail.columnDefinitions[]` from the server and synthesises the contacts table columns at runtime. The schema can change per group without UI changes. [CODE]
8. **Owner check uses `identityUserId`.** `rowFlags()` (models.ts:47-60) explicitly comments: "NEVER compare with `session.subjectId` (Zitadel id space)". Reaches the right space (Identity Service) for identity comparison. [CODE]
9. **Centralised PES factory.** `FalconAccess.contactGroup.*` factories live in `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:13-25`; consumers pass `'sys'` / `'acc'` scope. Avoids string-typed permission keys at call sites. [CODE]
10. **Status normalisation defaults to safe value.** Unknown status enum values fall through to `InProgress` (lines 113-117 of `contact-group.models.ts`). Banner comment on lines 101-107 makes this policy explicit. [CODE]

## Observed (bad — would be flagged by the night-shift digest)

1. **`*ngIf` / `*ngFor` instead of `@if` / `@for` / `@switch`** — the list template uses `@if` / `@else` once (line 99) but every other conditional uses `*ngIf` (`<div *ngIf="!hasSelectedNode">`, `<falcon-multiselect *ngIf="isEditing">`, etc.). The detail template uses only `*ngIf` / `*ngFor`. Should be migrated to Angular v17+ control flow. [CODE]
2. **`[ngClass]` usage** — status cell on the list page uses `[ngClass]="{ 'text-status-completed': row.status === 'Completed', ... }"` (HTML lines 21-23). Detail status uses `[ngClass]="statusClass"`. Wiki/skill rules prefer class binding via `[class.x]="..."`. [CODE]
3. **SCSS files** — `contact-groups.component.scss` (138 lines) and `contact-group-details.component.scss` (227 lines). Memory files `feedback_no_inline_styles_tokens_only.md` and `feedback_falcon_custom_library_mandatory.md` require Tailwind + tokens only — no SCSS / component CSS. [CODE — file sizes from `wc -l`]
4. **PrimeNG components in templates** — direct use of `<p-tabs>`, `<p-tablist>`, `<p-tab>`, `<p-skeleton>`, `<p-toast>`, `pButton` directive, `pInputText` directive. Memory file `project_falcon_primeng_total_removal_complete.md` reports the platform has already completed total PrimeNG removal — this code predates that program. Every PrimeNG usage must be migrated to `<falcon-*>` equivalents. [CODE]
5. **`pi pi-*` icon classes** — used for `pi-info-circle` (row menu), `pi-trash`, `pi-pencil`, `pi-users` (empty state), `pi-info-circle` (no-data placeholder), `pi-arrow-left` (back button), `pi-download`, `pi-exclamation-triangle`. PrimeIcons have been removed platform-wide; replace with the vendored Falcon icon font (see memory `project_falcon_primeng_total_removal_complete.md`). [CODE]
6. **Inline `style="..."` attributes** — `style="min-height: 400px"` on the empty-state container (list HTML line 68), `style="max-width: 400px"` (line 69). Memory `feedback_no_inline_styles_tokens_only.md` is the standing rule against this. [CODE]
7. **Hard-coded magic numbers**:
   - `LIST_PAGE_SIZE = 100` (line 339 of list) — ceiling for client-side pagination
   - `SELECT_ALL_PAGE_SIZE = 9999999` (line 59 of detail) — bypasses pagination by asking for "infinity"
   - `PAGE_SIZE = 10` (line 58 of detail) — multiselect page size
   - `[maxVisible]="2"` / `[maxVisible]="3"` — chip-list overflow limits
   - These should be config-driven (or at minimum named constants in a shared file). [CODE]
8. **JSON.parse(JSON.stringify(...)) for clone** — `onEdit()` line 594, `onCancel()` line 615. Loses Dates, Sets, Maps, RegExps. Use `structuredClone()` (available in Angular v15+ runtime). [CODE]
9. **`getRowStyleClass` returns the literal class name** — line 122 of list TS: `return row.isDeleted ? 'deleted-row' : '';`. Class `deleted-row` is not in the SCSS file shown, and Tailwind would suggest `text-muted opacity-60` or similar utility classes. Brittle string. [CODE]
10. **`document.createElement('a').click()` for downloads** — `triggerDownload()` line 414-424 of detail. Works but bypasses Angular's renderer abstraction; would not run on SSR. Wiki rule favours `Renderer2` or a service abstraction. [CODE]
11. **Dead code in `onSave()`** — `selectedUsers` is computed (lines 628-630) and then never used; `sharePolicy: null` is hard-coded into the payload. This is documented in [[06-VALIDATIONS]] as a real bug. [CODE]
12. **Hard-coded English in templates** — "Valid Contacts" (HTML line 261), "Invalid Contacts" (line 269), "No data available yet" (line 393), "Organization" fallback (line 95 of list). These are NOT going through the translate pipe. Memory `domain-glossary` brain-skill requires every term to validate against the glossary En/Ar. [CODE]
13. **`changeDetection` left at default on the list component** — `ContactGroupsComponent` does not declare `OnPush` (line 47-62). Mixed change-detection strategy across two siblings makes performance reasoning harder. [CODE]
14. **Two identical column arrays** — `contactGroupColumns` and `sharedGroupColumns` (lines 196-217 of list) are byte-identical (both 8 fields). The "sharedGroupColumns" header comment claims "includes Created By column", but Created By is in both. [CODE]
15. **Mixed casing in HTTP params** — `list()` sends `page`/`pageSize`; `getSharedGroups()` sends `Page`/`PageSize`; `getShareableUsers()` sends `PageNumber`/`PageSize`. Each upstream chose its own convention; the FE just mirrors. Worth normalising platform-side. [CODE]
16. **`searching` set/reset boilerplate** — the same `this.searching = true / this.cdr.detectChanges()` / `this.searching = false / this.cdr.detectChanges()` pattern is repeated five times across `setupSearch`, `onMultiselectOpen`, `loadPage`, `onSelectAllRequested`, `handlePageResult`. Candidate for a small `withLoading()` helper observable operator. [CODE]

## Patterns worth porting

1. **Batch PES resolve** via `resolveFlags({ key: query, ... })` — extends naturally to any new permission-gated page.
2. **`permissionsReady` skeleton gate** — prevents the brief flash of wrong actions while PES is in-flight.
3. **Dynamic column synthesis from server-provided `columnDefinitions[]`** — handy any time the schema is per-record.
4. **Owner overlay separated from tenant flags** — `rowFlags(row, session, flags)` is a pure function, easy to unit-test.
5. **Lazy tab loading via `onTabChange`** — shared-groups list is only fetched when the user actually clicks that tab.
6. **Session-aware tree root** (`FALCON_ROOT_NODE` for Falcon users; `nodes[0]` for tenants) — the same pattern can be ported wherever the tree is reused.
7. **`useGateway()` HTTP option spread** — keeps endpoint paths terse and gateway routing centralised.

## Anti-patterns to NOT port to new theme

1. Direct `document.querySelector` / `document.createElement` for downloads.
2. PrimeNG components and `pi pi-*` icons (platform-wide removal already complete elsewhere).
3. SCSS files / inline `style=""`.
4. Hard-coded English in templates that bypass `TranslatePipe`.
5. The dead-code `selectedUsers` calculation in `onSave()` — fix the share-policy serialisation, do not preserve the bug.
6. `JSON.parse(JSON.stringify(...))` clones.
7. Magic `9999999` page size for "select all" — design a server-side `selectAll: true` flag and let the backend handle it.
8. Mixed change-detection strategies across sibling components — pick OnPush everywhere.

## How the new theme should treat this page

- Treat `apps/admin-console/src/app/features/contact-groups/` as a **list + detail + edit** scope; the Create wizard belongs only in management-console.
- Keep the 30/70 tree-list layout and the lazy shared-tab — both are correct UX.
- Re-route the 6 endpoints (see [[03-SERVICES-APIS]]) untouched — the backend contract is stable.
- Fix the `sharePolicy: null` bug in `onSave()` — the FE must serialise the multiselect choices.
- Replace every PrimeNG element with Falcon UI Core equivalents:
  - `<p-tabs>` → wait for `<falcon-tabs>` (or use plain buttons + signal state in the meantime).
  - `<p-skeleton>` → `<falcon-skeleton>` (if it exists; otherwise a Tailwind-only skeleton).
  - `<p-toast>` + `MessageService` → `<falcon-toast>` / equivalent app-level toast service.
  - `pButton` / `pInputText` → `<falcon-button>` / `<falcon-input>`.
- Replace SCSS with Tailwind utilities + token classes.
- Move `editName` / `editReferenceId` to reactive forms; consider adding a duplicate-name async validator that mirrors the wizard one in management-console.
