# falcon-paginator — GAPS AND UPGRADES

> This is where the B09 AUDIT findings for `<falcon-angular-paginator>` live in prose. We document — we do NOT fix this pass.

## Missing capabilities (active source verified)

### FP-01 — (P1) Angular wrapper API surface lags behind the Stencil core
`[CODE]` The Stencil tags expose the PR-3 props `totalRecords`, `rows`, `rowsPerPageOptions`, `currentPageReportTemplate`, `paginatorTemplate`, `showCurrentPageReport` (falcon-paginator.tsx:54-66) + the `falcon-rows-change` event (tsx:75-76). The Angular wrapper (`falcon-paginator.component.ts:45-59`) exposes NONE of them and does NOT re-emit `falcon-rows-change`. So a **standalone** `<falcon-angular-paginator>` cannot drive the rows-per-page dropdown, the jump-to-page input, or the current-page report.

**Recommended fix (additive, low-risk):**
```ts
// falcon-paginator.component.ts additions
@Input() totalRecords = 0;
@Input() rows = 0;
@Input() rowsPerPageOptions?: number[];
@Input() currentPageReportTemplate = '{first} - {last} of {totalRecords}';
@Input() paginatorTemplate?: string;
@Input() showCurrentPageReport = false;
@Output() rowsChange = new EventEmitter<number>();
// + forward the props in the template + bind (falcon-rows-change)
```
**Why low-risk:** purely additive (`rowsPerPageOptions` must be a property binding, not `[attr.]`, since it is an object). HIGH-RISK-QUEUE only insofar as it is a public-API addition; behaviourally safe.

### FP-02 — (P1) No utils unit tests
`[CODE]` There is no `.spec.ts` for `clampPage`, `buildPaginationItems`, `parsePaginatorTemplate`, or `interpolatePageReport` (none under `libs/falcon-ui-core/src/components/falcon-paginator*/`). `buildPaginationItems` is non-trivial (boundary/sibling/bridge/ellipsis/dedupe logic — utils:8-75) and is exactly the kind of pure function that should be locked by tests. `safe-local`.

### FP-03 — (P2) Native `<input>` / `<select>` atoms (not Falcon atoms)
`[CODE]` The JumpToPage region is a native `<input type="number">` (falcon-paginator.tsx:272-286) and the RowsPerPage region is a native `<select>` (tsx:288-307). This violates the Falcon "no native primitives" house rule — but it is a **documented PR-3-spec choice** with `rowsPerPageDropdownAppendTo` (on `-tw`) reserved for the eventual `<falcon-dropdown-tw>` migration. **Recommended fix:** swap to `<falcon-angular-input-number>` / `<falcon-angular-dropdown>` once those are wired into the paginator helper. `safe-local` (intentional deferral).

### FP-04 — (P3) JumpToPage input lacks a `<label>` association
`[CODE]` falcon-paginator.tsx:272-286 — the jump input has `aria-label="Jump to page"` only, no associated `<label htmlFor>`. Acceptable but not ideal. `safe-local`.

### FP-05 — (P2) Stencil `goto()` / `setFocus()` not proxied by the Angular wrapper
`[CODE]` falcon-paginator.tsx:90-101 defines `@Method() goto(page)` + `@Method() setFocus()`, but the wrapper exposes no Angular-side proxies (contrast falcon-tree, which proxies its 5 methods). Consumers must reach `@ViewChild.nativeElement`. **Recommended fix:** add `async goto(page)` / `async setFocus()` proxies. `safe-local`.

### FP-06 — (P2) NEW: Shadow ↔ `-tw` parity divergences
`[CODE]` Two divergences found this pass:
1. **`rowsPerPageDropdownAppendTo` prop is `-tw`-ONLY** (falcon-paginator-tw.tsx:85, a PR-4 addition) — the Shadow tag has no such prop. Prop parity break.
2. **Non-template region layout differs** — `-tw` wraps the non-template regions in a `falconTablePaginatorCenterClusterClasses()` center-cluster `<span>` (tsx:391-397); the Shadow tag renders them flat with no cluster wrapper (falcon-paginator.tsx:364). DOM-structure divergence between paths.

**Recommended fix:** mirror both onto the Shadow tag (or document the divergence as intentional). HIGH-RISK-QUEUE-adjacent (render-structure change), but currently low-impact because the heavy consumer is the `-tw` path via tables.

### FP-07 — (P2) NEW: PR-3 regions in `-tw` are styled by TABLE tokens, not paginator tokens
`[CODE]` falcon-paginator-tw.tsx:34-40 — the current-page report / jump input / rows-per-page wrapper+select use `falconTablePaginator*Classes()` from `table-tailwind-classes.ts`, i.e. their visuals are owned by `--falcon-table-*` tokens, not `--falcon-paginator-*`. A consumer overriding paginator tokens will NOT restyle those regions. Token-ownership inconsistency. `safe-local`.

### FP-08 — (P3) NEW: hardcoded English aria-labels + no i18n
`[CODE]` falcon-paginator.tsx:318-324 — nav `aria-label`s (`First page` / `Previous page` / `Next page` / `Last page`), `Page N`, `Jump to page`, `Rows per page` are all hardcoded English with no i18n hook. `safe-local`.

## Missing accessibility features

- **A1 (P2):** the compact page-info label (`{currentPage} of {totalPages}`) is a plain `<span>` with no `aria-live` — it does not re-announce on page change. (The prior dossier guessed `aria-live="polite"` "in the Stencil source" — **CORRECTED: no `aria-live` exists** on the info span, falcon-paginator.tsx:366-370.) Consider `aria-live="polite"`.
- **A2 (P3):** FP-04 — JumpToPage `<label>` association.

## Missing tests

- `[CODE]` **NO spec/e2e** for the component or its utils (FP-02). The utils (`buildPaginationItems` especially) are pure and high-value to test. `safe-local`.

## Missing Tailwind / token parity

- FP-07 — PR-3 regions in `-tw` lean on TABLE tokens.
- FP-06 — `-tw`-only prop + center-cluster wrapper.
- Otherwise the core page/nav/ellipsis/info regions share `--falcon-paginator-*` across both paths cleanly.

## Performance risks

- `[CODE]` `buildPaginationItems` allocates a new array every render — fine for typical page counts. `parsePaginatorTemplate` likewise — trivial.

## Visual / interaction risks

- `[CODE]` A rows-per-page change does NOT reset the page (falcon-paginator.tsx:150-157) — the host must decide; forgetting to reset to page 1 can show an out-of-range page until the next clamp.
- `[CODE]` `totalPages` vs `totalRecords` are both host-owned — if the host computes them inconsistently, the number strip (`totalPages`) and the "X of Y" report (`totalRecords`+`rows`) disagree.

## Recommended upgrade priority

| ID | Title | Priority | Risk-class |
|---|---|---|---|
| FP-01 | Wrapper API parity with Stencil PR-3 | P1 | HIGH-RISK-QUEUE (public API add) |
| FP-02 | Utils unit tests | P1 | safe-local |
| FP-05 | Proxy `goto()` / `setFocus()` on the wrapper | P2 | safe-local |
| FP-06 | Shadow↔`-tw` prop + layout parity | P2 | HIGH-RISK-QUEUE (render structure) |
| FP-07 | Paginator-scoped tokens for PR-3 regions | P2 | safe-local |
| FP-03 | Migrate inner atoms to Falcon dropdown/input | P2 | safe-local (deferral) |
| FP-08 | i18n aria-labels | P3 | safe-local |
| FP-04 | JumpToPage `<label>` association | P3 | safe-local |
| A1 | `aria-live` on page-info | P2 | safe-local |

## Fix-shared-vs-per-page

All gaps belong in the **shared Falcon component**. FP-01 is the keystone — without it, standalone Angular consumers must drop to the raw Stencil tag, which breaks the wrapper-as-single-API promise.

## Workarounds (if upgrade blocked)

- For FP-01 standalone: use `<falcon-paginator-tw>` directly + `@ViewChild` to set `rowsPerPageOptions`; OR consume inside a Falcon table (the table wires PR-3).
- For FP-05: reach `@ViewChild.nativeElement` and call `goto`/`setFocus` on the inner tag.

## Wave 7 Findings (2026-05-17)

**Consumer count: 1** (`apps/host-shell/src/app/playground/playground.page.html`). No new structural gaps beyond those listed above.

## Deep-Dive Sweep Findings (2026-06-03 — B09)

**Consumer count: 1 render consumer** (`[CODE]` grep `<falcon-angular-paginator[\s>]` → `falcon-custom-table-footer.component.html:21`, the B09 sibling) + the Stencil tag auto-composed inside `falcon-table.tsx`/`falcon-table-tw.tsx`. The prior Wave 7 playground consumer was **removed**.

Corrections + new findings vs prior dossier (component stays ACTIVE / READY-in-table / NEEDS-UPGRADE-standalone — no deletion/promotion flag):
- **Consumer corrected** playground → `falcon-custom-table-footer` (the SOLE wrapper consumer; the table footer uses the Stencil tag).
- **A1 corrected** — there is NO `aria-live` on the page-info span (the prior "has `aria-live=polite` in source — verify" was wrong).
- **NEW FP-06** — Shadow↔`-tw` parity divergence: `rowsPerPageDropdownAppendTo` is `-tw`-only + `-tw` adds a center-cluster wrapper the Shadow tag lacks.
- **NEW FP-07** — PR-3 regions in `-tw` styled by TABLE tokens, not paginator tokens.
- **NEW FP-08** — hardcoded English aria-labels (no i18n).
- **NEW** — no spec/e2e for the component or its utils (FP-02 confirmed; the utils are pure + high-value).
- Token file recounted 109 ln / 14 categories, gate-12 `:where()` compliant; corrected the theme-token table (literal px + 4 theme vars only).
- All findings are `safe-local` EXCEPT FP-01 (public-API add) and FP-06 (render-structure parity), which are HIGH-RISK-QUEUE. See FINDINGS/B09.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B09) against all source layers. Component stays ACTIVE (READY in-table / NEEDS-UPGRADE standalone). FP-01 keystone confirmed; A1 corrected (no `aria-live`); FP-06/07/08 + no-spec added. No deletion/promotion flag.
