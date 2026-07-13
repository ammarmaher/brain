# falcon-custom-table-footer — GAPS AND UPGRADES

> This is where the B09 AUDIT findings for `falcon-custom-table-footer` live in prose. We document — we do NOT fix this pass.

## Missing capabilities (active source verified)

### G1 — (P2) Rows-per-page uses a native `<select>`, not `<falcon-angular-dropdown>` (HOUSE-RULE violation)
`[CODE]` falcon-custom-table-footer.component.html:35-43 — the rows-per-page region is a native `<select>` + `<option>` (with hand-rolled Tailwind `h-7 px-2 pr-6 rounded-sm border ...`). The Falcon house rule (`feedback_falcon_ui_library_only_no_native`) is "no native primitives — use Falcon atoms." A `<select>` here is a raw HTML primitive.

**Why it persists:** mirrors the same deferral as the paginator's own RowsPerPage `<select>` (paginator FP-03). **Recommended fix:** swap to `<falcon-angular-dropdown>` (which carries its own tokens + dark-mode + RTL + a11y). `safe-local` (intentional-looking deferral, but it IS a house-rule miss — flag).

### G2 — (P2) No `aria-live` on the "Showing X - Y from Z" report
`[CODE]` html:14-17 — the left report is a plain `<div>`. When the operator changes page, screen readers do NOT re-announce the new slice. **Recommended fix:** add `aria-live="polite"` (or `role="status"`) to the report `<div>`. `safe-local`.

### G3 — (P2) Rows-per-page `<label>` is not associated with the `<select>`
`[CODE]` html:34-35 — the `<label>` is adjacent text with no `for`/`id` link to the `<select>` (html:36 has no `id`). Clicking the label does not focus the select, and AT name-association is weaker than a wired `<label for>`. **Recommended fix:** add `id` to the `<select>` + `for` on the `<label>` (or wrap the `<select>` inside the `<label>`). `safe-local`. (Resolved automatically if G1 swaps to `<falcon-angular-dropdown>` with a `label` input.)

### G4 — (P3) `pr-6` physical padding on the `<select>` breaks RTL caret clearance
`[CODE]` html:36 — `pr-6` reserves caret space on the PHYSICAL right; in RTL the native caret moves to the left, so the clearance lands on the wrong side. **Recommended fix:** `pe-6` (logical). `safe-local`.

### G5 — (P3) Two literal `text-[12px]` instead of a font-size token
`[CODE]` html:9/36 — the band + `<select>` use literal `text-[12px]` rather than `--text-xs` / a `--falcon-font-size-*` token. Minor token-discipline miss. `safe-local`.

### G6 — (P2) Band height ignores the compact density token
`[CODE]` html:9 reads `--falcon-table-row-height` (52px) but NOT `--falcon-table-row-height-compact` (40px, table.tokens.css:110). A compact-density table keeps a 52px footer band. **Recommended fix:** make the footer accept a `compact` input (or read a density-aware token alias). `safe-local`.

### G7 — (P3) No `pageSizeChange`-resets-page convenience
`[CODE]` ts:67-70 — `onSelectRows` emits the new size but the component does not (and arguably should not) reset the page. Every consumer must remember to reset to page 1 in their `(rowsChange)` handler. **Recommended:** document prominently (done in USAGE/BUSINESS) OR optionally emit a combined "size changed → page 1" signal. `safe-local`.

### G8 — (P2) No `jumpToPage` / large-list affordance
The footer composes the paginator WITHOUT `JumpToPageInput` (it does not pass `paginatorTemplate`). For very large page counts, there is no jump-to-page box. **Recommended:** expose a `showJumpToPage` input that threads through to the paginator. `safe-local` (the paginator supports it; the footer just doesn't surface it — and it can't standalone today because the paginator WRAPPER doesn't expose `paginatorTemplate` — see paginator FP-01).

## Missing accessibility features

- **A1 (P2):** G2 — no `aria-live` on the report.
- **A2 (P2):** G3 — `<label>` not associated with the `<select>`.
- **A3 (P3):** the `<select>` relies on native semantics (acceptable), but a Falcon dropdown (G1) would give consistent keyboard + focus-ring behavior.

## Missing tests

- `[CODE]` **NO spec** for the footer. The three `computed()`s (`totalPages`, `first`, `last`) are pure, deterministic, and edge-case-prone (`totalRecords=0`, `rows=0` guard, partial last page) — exactly the kind of logic to lock with a unit test. The output guards (`page>=1`, `rows>0`) are also testable. `safe-local`.

## Missing Tailwind / token parity

- G5 — literal `text-[12px]`.
- G6 — non-compact band height.
- The footer owns no token contract (by design, it is a composite). Its colours reuse theme neutrals; its band reuses the table row-height token. No parity break beyond G5/G6.

## Performance risks

- `[CODE]` None material. Three `computed()`s + `OnPush` + signal inputs = minimal change-detection cost. No streams, no manual subscriptions.

## Visual / interaction risks

- `[CODE]` A rows-per-page change without a host page-reset can briefly show an out-of-range page (the inner paginator then clamps) — see G7 + BUSINESS gotchas.
- `[CODE]` Dark-mode: `bg-falcon-neutral-30` is a very light surface; if the `neutral-30` shade lacks a dark value the footer band could look wrong under `.app-dark` — verify (TOKENS dark-mode note).

## Recommended upgrade priority

| ID | Title | Priority | Risk-class |
|---|---|---|---|
| G1 | Rows-per-page → `<falcon-angular-dropdown>` | P2 | HIGH-RISK-QUEUE (render-path change; would also fix G3/G4) |
| G2 | `aria-live` on the report | P2 | HIGH-RISK-QUEUE (a11y semantics) |
| G3 | `<label for>` ↔ `<select id>` | P2 | safe-local |
| G6 | Compact-density band height | P2 | safe-local |
| G8 | `showJumpToPage` passthrough | P2 | safe-local (blocked by paginator FP-01) |
| spec | Unit-test the computeds + guards | P2 | safe-local |
| G4 | `pr-6` → `pe-6` (RTL) | P3 | safe-local |
| G5 | font-size token | P3 | safe-local |
| G7 | size-change-resets-page convenience | P3 | safe-local |

## Fix-shared-vs-per-page

This component IS the shared footer — all gaps belong here, not in the data-table or per-feature. G1 is the keystone house-rule fix (the native `<select>` is the one clear convention violation); doing it cascades through G3/G4 and aligns the footer with the rest of the Falcon kit.

## Workarounds (if upgrade blocked)

- For G1 today: accept the native `<select>` (it is functional + token-bordered) until `<falcon-angular-dropdown>` is wired in.
- For G7 today: every `(rowsChange)` handler must reset the page to 1.
- For G8 today: there is no jump-to-page; rely on prev/next/first/last + the page strip.

## Deep-Dive Sweep Findings (2026-06-03 — B09 — CREATED)

**Consumer count: 1 render consumer** (`[CODE]` `<falcon-angular-data-table>` internal footer, default `showCustomFooter=true`). It is the SOLE wrapper consumer of `<falcon-angular-paginator>`.

New dossier (created from scratch — no prior dossier existed). Findings:
- **G1 (the one clear house-rule violation)** — native `<select>` for rows-per-page (should be `<falcon-angular-dropdown>`). HIGH-RISK-QUEUE (render-path change).
- **G2/G3 a11y** — no `aria-live` on the report; `<label>` not associated with the `<select>`.
- **G4/G5/G6 token/RTL** — `pr-6` physical padding (RTL), two literal `text-[12px]`, non-compact band height. `safe-local`.
- **No spec** — the pure computeds + output guards are untested. `safe-local`.
- **Positive:** the MOST modern component in B09 — signals-first (`input()`/`input.required()`/`output()`/`computed()`), `OnPush`, i18n-decoupled, no CVA needed, no streams. Standalone + explicit imports + zero `*ngIf`/`*ngFor` (`@if`/`@for` in the data-table caller; the footer itself uses `@for` for options). Clean.
- All findings `safe-local` EXCEPT G1 (native→Falcon dropdown render-path change) + G2 (a11y semantics), which are HIGH-RISK-QUEUE. See FINDINGS/B09.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B09 — CREATED) against falcon-custom-table-footer.component.ts + .html. Component is ACTIVE / library-promoted (Wave 19) / the default data-table footer. G1 native-`<select>` is the single house-rule miss; remaining findings are minor a11y/token/RTL/test gaps. No deletion/promotion flag.
