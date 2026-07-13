# falcon-custom-table-footer — DECISION

## Brain SK final recommendation

**STATUS: READY (library-promoted Wave 19). It is the DEFAULT footer of `<falcon-angular-data-table>` — use it implicitly via the data-table; direct use only for a bespoke table shell.**

## Use this component for

- The standard 3-section footer band under a paginated Falcon data table (you get it for free — `showCustomFooter` defaults `true`).
- A custom table shell (rare) that wants this exact `[Showing X-Y from Z] [« ‹ page › »] [Rows per page ▾]` band without the full data-table.

## Avoid this component for

- A bare numeric page strip (no report / no size selector) → `<falcon-angular-paginator>` directly.
- A footer with custom non-pagination content (totals, bulk actions) → a bespoke data-table footer template.
- "Load more" / infinite scroll → not a paginated-footer pattern.
- Mounting as a SIBLING of a data-table → it is the table's internal footer.

## Preferred variant / render path

**There is only one render path** — this is an Angular-only composite (no Shadow/`-tw` toggle). Drive it through `<falcon-angular-data-table>` (the normal path) with translated `footer*Label` inputs.

## Required upgrades before wider use

None block production use — it is the live default footer. The documented gaps (`GAPS_AND_UPGRADES.md`) are improvements: G1 (native `<select>` → `<falcon-angular-dropdown>`, the one house-rule fix), G2 (`aria-live` report), G6 (compact-density band), G8 (jump-to-page passthrough).

## Relationship to other components

- **Consumed BY:** `<falcon-angular-data-table>` (its internal default footer) — the SOLE consumer.
- **Composes:** `<falcon-angular-paginator size="sm">` (its center nav cluster) — this footer is paginator's SOLE wrapper consumer.
- **Should compose (GAP):** `<falcon-angular-dropdown>` for the rows-per-page region (currently a native `<select>`).

## Exact rule for future implementation tasks

1. **Paginated table?** Use `<falcon-angular-data-table [paginator]="true">` — this footer renders automatically. Do NOT mount a footer yourself.
2. **Localize** the footer via the data-table's `footerShowingLabel` / `footerFromLabel` / `footerRowsPerPageLabel` inputs (bind `| translate`; defaults are English). Update BOTH `en.json` + `ar.json`.
3. **Handle `(rowsChange)`** by setting page size AND resetting `currentPage` to 1.
4. **Handle `(pageChange)`** by re-fetching the page (lazy) — the footer only emits.
5. **Bare strip needed?** Drop to `<falcon-angular-paginator>`; do not strip-mine this footer.
6. **Restyle?** Override `--falcon-table-row-height` / theme neutrals — the footer owns no tokens.

---

## Dynamic capability assessment

### 1. What is static today?
- `[CODE]` The 3-section grid layout (Showing / paginator / rows-per-page) — fixed columns.
- `[CODE]` The composed paginator is pinned `size="sm"` with `showFirstLast`/`showPrevNext`/`showPageInfo` all `true` — not configurable from the footer.
- `[CODE]` Rows-per-page is a native `<select>` (no Falcon-dropdown affordances).
- `[CODE]` No jump-to-page region (the footer does not pass `paginatorTemplate`).
- `[CODE]` Band height pinned to the non-compact `--falcon-table-row-height` (no compact variant).
- `[CODE]` Two literal `text-[12px]` + the `<select>`'s literal scale utilities.

### 2. What is already dynamic through inputs/outputs?
- `[CODE]` **8 signal inputs:** `totalRecords` (required), `currentPage`, `rows`, `rowsPerPageOptions`, `disabled`, `showingLabel`, `fromLabel`, `rowsPerPageLabel`.
- `[CODE]` **2 signal outputs:** `pageChange`, `rowsChange`.
- `[CODE]` **3 `computed()`s** derive `totalPages` / `first` / `last` from the inputs.

### 3. What is already dynamic through slots / ng-template?
- `[CODE]` None — no `<ng-content>`, no `ng-template` inputs.

### 4. What is dynamic through token/theme overrides?
- `[CODE]` Band height via `--falcon-table-row-height`; colours via theme neutral utilities; the center cluster via the paginator's `--falcon-paginator-*`. The footer mints no tokens of its own.

### 5. What is dynamic through Tailwind classes?
- `[CODE]` The footer's own template IS hand-written Tailwind (it is an app-layer composite). No `rootClass`/`wrapperClass` input to inject more — utilities are fixed in the template.

### 6. What is missing to make this component reusable across pages?
- Falcon-dropdown rows-per-page (G1).
- `aria-live` report (G2) + `<label>` association (G3).
- Compact-density band (G6).
- Jump-to-page passthrough (G8 — blocked by paginator FP-01).
- A `[paginatorSize]` / `[showJumpToPage]` / `[showRowsPerPage]` configurability input.

### 7. What capability should be added to the shared component (not a page hack)?
- The Falcon-dropdown swap (G1) + a11y fixes (G2/G3) — every table inherits this footer, so the fix lands once and ripples everywhere.
- Configurability inputs (paginator size, which regions show) so a feature can tune the footer without forking it.

### 8. What flags / options / templates / slots would make it better?
- `@Input() compact?: boolean` (band height + paginator size).
- `@Input() showJumpToPage?: boolean` / `showRowsPerPage?: boolean`.
- A `report` content-projection slot for a custom left region.
- `aria-live` on the report.

### 9. What is the safest upgrade path?
1. **Phase A (additive, zero risk):** add `aria-live` to the report (G2); wire `<label for>` ↔ `<select id>` (G3); `pr-6`→`pe-6` (G4); literal `text-[12px]`→token (G5); add a unit spec for the computeds.
2. **Phase B (opt-in inputs):** `compact`, `showJumpToPage`, `showRowsPerPage`, `paginatorSize`.
3. **Phase C (render-path change):** swap the native `<select>` for `<falcon-angular-dropdown>` (G1) — verify the data-table footer still aligns; resolves G3/G4 for free.
All phases additive — no consumer break (the data-table is the only consumer and binds by input name).

### 10. What is risky to change because other pages depend on it?
- It is the DEFAULT footer of EVERY paginated data table — any layout/height change ripples to every list page in both consoles.
- The `(pageChange)` / `(rowsChange)` output names + the input names — the data-table binds them by name (`falcon-data-table.component.html:72-81`).
- The `[disabled]="_isEmpty()"` contract — the data-table drives it from its empty signal.
- Changing the composed paginator's pinned config (size/first-last) would visually shift every table footer.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B09 — CREATED). Recommendation READY (library-promoted default footer). Counts confirmed: 8 signal inputs (1 required), 2 signal outputs, 3 computeds, NO CVA. The one clear house-rule miss is the native rows-per-page `<select>` (G1). Sole consumer = `<falcon-angular-data-table>`; composes `<falcon-angular-paginator>`.
