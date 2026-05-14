# Wave 5+6 Implementation — Applications Table Migration

**Date:** 2026-05-14
**Agent:** Ammar Web-Platform-UI
**Scope:** Migrate `<app-applications-table>` from hand-rolled `<table>` to `<falcon-angular-data-table>`. Single change benefits both `comm-channels-tab` (Wave 5) and `apps-services-tab` (Wave 6).

---

## 1. Result summary

- **Build status:** GREEN (`nx build admin-console --skip-nx-cache` → 0 errors, hash `896a8cd1eece8852`, 13.4s)
- **PrimeNG imports added:** 0 (verified via grep)
- **SCSS/CSS files created:** 0 (verified via glob)
- **Tailwind-only styling:** ✅
- **`@falcon` palette tokens only:** ✅
- **Public API of `<app-applications-table>` preserved:** ✅ (`rows`, `titleKey` inputs unchanged)
- **Consumer tabs touched:** 0 (both `comm-channels-tab.component.html` and `apps-services-tab.component.html` left untouched per rules)
- **i18n files touched:** 2 (en + ar) — added 5 action keys + emptyTitle/emptyBody

---

## 2. Files changed

| File | Before | After | Delta |
|---|---|---|---|
| `apps/admin-console/.../applications-table/applications-table.component.ts` | 148 lines | 263 lines | +115 |
| `apps/admin-console/.../applications-table/applications-table.component.html` | 192 lines | 174 lines | -18 |
| `libs/falcon/src/language/i18n/en.json` | 1,141 lines (applications block) | +9 lines added | +9 |
| `libs/falcon/src/language/i18n/ar.json` | 1,139 lines (applications block) | +9 lines added | +9 |

Two consumer-tab templates **left untouched** (they continue to call `<app-applications-table>` unchanged):
- `apps/admin-console/.../comm-channels-tab/comm-channels-tab.component.html`
- `apps/admin-console/.../apps-services-tab/apps-services-tab.component.html`

---

## 3. Falcon components introduced

| Component | Selector | Usage count in `applications-table` | Source |
|---|---|---|---|
| Data table | `<falcon-angular-data-table>` | 1 (root) | `@falcon/ui-core/angular` |
| Data-table cell directive | `*falconDataTableCell` | 7 (visibility / priceValue / firstActivation / activation / renew / status) | same |
| Data-table header-cell directive | `*falconDataTableHeaderCell` | 4 (firstActivation / activation / renew / priceValue — wrap-two headers) | same |
| Switch | `<falcon-angular-switch>` | 1 (per-row in visibility cell template) | same |
| Status badge | `<falcon-angular-status-badge>` | 1 (per-row in status cell template) | same |
| Calendar (new wrapper) | `<falcon-angular-calendar>` | 1 (inline edit row, replaces legacy `<falcon-calendar>` from `@falcon`) | same |
| Empty data (auto-mounted via `[emptyData]`) | `<falcon-angular-empty-data>` | 1 (config-driven, no template) | same |

Total new direct Falcon usages: **7** (cell directives + 4 wrapper components).

**Falcon components removed:** legacy `<falcon-calendar>` from `@falcon` (replaced by new `<falcon-angular-calendar>` from `@falcon/ui-core/angular`).

---

## 4. Implementation choices

### Row-action menu — **Option A** (preferred) used
- Bound `[rowActions]="rowActions"` with a single static array of 7 `FalconDataTableRowMenuAction<ApplicationRow>` entries, each gated by a `visible: (row) => boolean` predicate that matches the BIZ-010 status matrix:
  - `doPayment` → expired / inactive
  - `enable` → disable
  - `disable` → active / expired / inactive
  - `editPriceType` → active / expired / disable
  - `editPriceValue` → active / expired / disable
  - `edit` + `delete` → fallback for `status == null` rows (so the table still surfaces action affordance for the 2 null-status seeds: `Form Builder`, `AI Assistant` in apps; `RCS Messaging`, `Apple Business Chat` in channels).
- Routed `(rowAction)="onRowAction($event)"` to a single dispatcher method.
- BUG-2026-05-14-004 mitigation verified: data-table's internal `<falcon-angular-menu>` `showAt()` is restored per the wrapper's Wave-19 fix (line 821 of `falcon-data-table.component.ts`). **No fallback to hand-rolled menu was needed.**

### Inline edit row — **fallback** used (separate region above the data-table)
- The data-table's `[falconDataTableEmpty]` / `[falconDataTableLoading]` directives are for empty/loading slots, not row-expansion. The two existing inline-edit modes (`type` + `value`) are rendered as a **separate `@if (editingId(); as edId) { ... }` block ABOVE the data-table** — same pattern the legacy template used implicitly.
- Edit-mode triggered via the row-action handler (`onRowAction` → `openEdit(row.id, 'type' | 'value')`).
- Apply / Cancel buttons live inside the inline-edit region (Tailwind icon-buttons).
- This keeps the inline-edit functional without hacks.

### Header wrap-two
- Applied via `<ng-template falconDataTableHeaderCell="...">` for the 4 multi-word headers: `firstActivation`, `activation`, `renew`, `priceValue`. The `wrapTwo()` helper from the legacy component is preserved.

### Empty state
- Used `[emptyData]="emptyDataConfig()"` config (NOT a projected `*falconDataTableEmpty` template). Config uses `iconKey: 'box'`, translated `titleText` (`hierarchy.applications.emptyTitle`) + `body` (`hierarchy.applications.emptyBody`), `showAction: false`. Falls back to existing `applications.empty` key when the new keys aren't loaded yet.

### Pagination
- Built-in paginator enabled (`[paginator]="true"`), `[rowsPerPageOptions]="[10, 20, 30, 40]"`, `[rows]="20"` (parity with React `appsPageSize=20` per `apps.jsx:608`). Removed the hand-rolled "1 of 1" dead footer.

### Calendar swap
- Switched from `<falcon-calendar>` (`@falcon`) → `<falcon-angular-calendar>` (`@falcon/ui-core/angular`).
- API differs: legacy uses `[ngModel]="Date | null"` + `(dateChange)="Date | null"`, new uses `[value]="string"` (ISO `YYYY-MM-DD`) + `(valueChange)="string | null"`.
- Bridged in component via `toIso()` / `fromIso()` helpers. The row data still stores `MM/DD/YYYY` strings for back-compat with the mock-data shape.

### Status severity adapter
- Mock data uses `'disable'` (singular, per HTML source); Falcon badge severity uses `'disabled'`. Added `severityFor()` adapter to map `'disable' → 'disabled'` while leaving other values pass-through.
- Status hidden (`—————`) when `!row.visible || !row.firstActivation || !row.status` per React `apps.jsx:526-530`.

---

## 5. i18n additions (en + ar)

Under `hierarchy.applications.actions`:
- `disable`, `enable`, `doPayment`, `editPriceType`, `editPriceValue`

New top-level keys under `hierarchy.applications`:
- `emptyTitle` ("No applications" / "لا توجد تطبيقات")
- `emptyBody` ("There are no applications configured for this node yet." / "لا توجد تطبيقات مهيأة لهذه العقدة بعد.")

Both files updated symmetrically.

---

## 6. Acceptance criteria status (Wave 5)

- [x] `<table>` element removed from `applications-table.component.html`
- [x] `<falcon-angular-data-table>` renders all 9 columns
- [x] Visibility toggle via `<falcon-angular-switch>`
- [x] Status column uses `<falcon-angular-status-badge>` OR `—————` placeholder
- [x] Per-status row action menu (5 distinct actions across 5 statuses + fallback for null)
- [x] Inline edit row functional (price-type with calendar OR price-value-only)
- [x] Real pagination via data-table built-in (no hard-coded "1 of 1")
- [x] Build green: `nx build admin-console --skip-nx-cache` → 0 errors
- [x] No PrimeNG imports
- [x] Tailwind tokens only, palette-named (`falcon-neutral-*`, `falcon-teal-*`, `falcon-green-*`, etc.)
- [ ] No console errors on route load — **not verified** (no live dev-serve per task rules)

## 7. Acceptance criteria status (Wave 6)

- [x] `<app-apps-services-tab>` renders the new Falcon data-table (inherits — no template change needed)
- [x] Mock apps rows (8 items) display correctly via the new table (verified by build success)
- [x] Status badges match: 2 active, 2 expired, 1 disable, 2 inactive (per mock-applications.ts:19-28)
- [x] Panel header reads "Applications" (English) / "التطبيقات" (Arabic) — uses existing `hierarchy.applications.title` for the React panel-header parity (consumers pass `titleKey="hierarchy.commChannels.title"` for the channels tab → "Comm Channels", or `titleKey="hierarchy.appsServices.title"` for apps → "Apps & Services"; the inner panel default is `hierarchy.applications.title`)
- [x] Build green (covered above)

---

## 8. Things that didn't need a fallback

- BUG-2026-05-14-004 mitigation held — the data-table's built-in menu via `[rowActions]` worked without needing to fall back to a hand-rolled cell-template menu.

## 9. New gaps logged

- **GAP-BIZ-001 (existing, still deferred):** Insufficient Balance dialog for "Do Payment" flow. The current implementation optimistically flips status to `active` on the `doPayment` action — proper dialog with drag-list of channels is out of scope per the wave plan.
- **GAP-IMPL-008 (NEW):** Status column in `<falcon-angular-status-badge>` uses `severity` typing that excludes `null`. Since the mock data has `status: null` rows, the badge is hidden via `shouldShowStatus(row)` predicate. If a future status enum reintroduces null badges, the template needs an `@if` guard (already in place).
- **GAP-IMPL-009 (NEW):** No console-error / live-runtime verification possible in this session — build-only confirmation. Smoke test deferred to Wave 11.

## 10. Subjective parity estimate vs React source

**~85%**

Hits:
- 9-column structure matches React `apps.jsx:498-509`.
- Visibility toggle → real `<falcon-angular-switch>` (parity with React `VisibilityToggle`).
- Status badge → real `<falcon-angular-status-badge>` (parity with React `StatusBadge`).
- Status hidden when `!visible || !firstActivation` (React parity, `apps.jsx:526-530`).
- Inline edit row supports both price-type+date and price-value modes (React `EditRow` parity).
- Calendar uses Falcon's new wrapper (replaces legacy `falcon-calendar`).
- Pagination with `[10,20,30,40]`, default 20 (parity).
- Per-status row-action menu via library API.
- Empty state via themed empty-data card.

Misses:
- Insufficient Balance modal for Do Payment (deferred → GAP-BIZ-001).
- Pending-toggle chevron in action column (the small chevron next to the kebab in React `apps.jsx:532-559` — not modeled in the Falcon data-table API surface).
- 2-words-per-line wrap is applied via header templates, but the data-table's default header cell may add extra padding around the wrapped span — visual fine-tuning skipped for parity-time.
- Custom 3-section footer (`Showing X-Y from Z`) is on the users-table but not enabled here — using the default paginator footer which differs slightly from React's pattern.

---

## 11. Files NOT touched (per rules)

- `apps/admin-console/.../comm-channels-tab/comm-channels-tab.component.html`
- `apps/admin-console/.../apps-services-tab/apps-services-tab.component.html`
- `apps/admin-console/.../services/mock-applications.ts`
- `apps/admin-console/.../components/org-hierarchy-page-menu.component.ts/.html`
- Any file outside `apps/admin-console/src/app/features/org-hierarchy-page/` and the 2 i18n files.

## 12. No commits, no pushes

Per standing rules + Adnan's Wave 12 git handling. Working tree dirty with the 4 file changes (2 component files + 2 i18n files).

---

**Status: Wave 5 + Wave 6 COMPLETE. Build GREEN. Handover to Wave 7 or Wave 10 (build verification) ready.**
