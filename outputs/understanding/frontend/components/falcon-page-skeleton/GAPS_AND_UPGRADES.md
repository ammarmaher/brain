# falcon-page-skeleton — GAPS AND UPGRADES

> NEW dossier (B26, 2026-06-03). Single-render pure-Angular shared-ui component — rubric dims **B (Stencil dual-render)** and **E (React/Vue parity)** are **N/A**. AUDIT-in-prose; row-per-finding table in `FINDINGS/B26.md`.

## Best-practice posture (mixed)

`[CODE]` **Angular structure (dim A) is clean:** standalone, `OnPush` (ts:75), 2 signal inputs + 1 `computed` (ts:177-179), `@if`/`@for track $index` (no `*ngIf/*ngFor`), zoneless-safe, no subscriptions/teardown, no NgModule. **House rules (dim C) are the weak spot:** raw Tailwind palette utilities + two inline `style` usages + no dark mode (deliberate parity copy, but a deviation). It is the **least token-disciplined** unit in the B25/B26 shared-ui batch. The headline issue, however, is the **documented duplication** (G6) and **wrong-shape rigidity** (G2).

## Missing capabilities (active source verified)

### G6 — Known DUPLICATE of `app-org-hierarchy-skeleton` (P1 — the headline)

`[CODE]` ts:2-12 — this component is a **verbatim byte-equivalent copy** of `apps/admin-console/.../org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` (`app-org-hierarchy-skeleton`), promoted into shared-ui "for Templates alignment," with an explicit `TODO` (ts:11-12) to "deduplicate by migrating Hierarchy to this shared component in a future commit." Two copies of a 192-line skeleton now exist and must be kept in lockstep (the parity copy's whole point was consistency — ironically now at risk of drift).

**Recommended fix (P1):** execute the `TODO` — migrate `org-hierarchy-page` to render `<falcon-page-skeleton>` and **delete** the app-local `app-org-hierarchy-skeleton`. Single source of truth. `risk-class: safe-local` mechanically (it's a copy), but human-approve as a deliberate cross-feature change + public-surface consolidation. **This is the most consequential item.**

### G2 — Fixed, non-parameterized layout (P2)

`[CODE]` The shape is hardcoded: 12 tree rows (`TREE_ROWS`, ts:37-50), 9 table rows (`TABLE_ROWS`, ts:52-62), 4 tabs (`TABS_WIDTHS`, ts:64), a `lg:grid-cols-5` split (ts:79). No inputs to set row counts, column counts, or to switch off the tree pane. A page that isn't the tree+table workspace shape cannot use it without looking wrong.

**Recommended fix (P2):** add optional inputs — `@Input() treeRowCount` / `tableRowCount` / `tableColumnCount` / `showTree` — OR split into composable sub-skeletons (`<falcon-tree-skeleton>` + `<falcon-table-skeleton>`) so other layouts can assemble a fitting placeholder. (A `<falcon-table-skeleton>` primitive would also serve in-table loading.)

### G3 — Raw Tailwind palette instead of `--falcon-*` tokens (P2 — house rule)

`[CODE]` Pervasive raw palette: `bg-emerald-100`/`bg-amber-100`/`bg-rose-100`/`bg-slate-200` (`PILL_BG`, ts:30-35), `bg-slate-300/70`, `bg-slate-200/80`, `bg-slate-50/60`, `border-slate-200`, `border-slate-100`, `bg-emerald-50/40` (throughout). These bypass the Falcon theme. **Deliberate** per ts:8 ("intentionally mirrors Hierarchy's skeleton including its raw-palette utilities … pixel-identical"), but still a tokens-over-literals deviation.

**Recommended fix (P2):** map raw palette → Falcon neutral/status tokens (`bg-falcon-neutral-200`, `bg-falcon-emerald-100`, …) once the dedup (G6) lands, so both the source and the copy move together. Until then, do NOT "fix" one copy in isolation (it would break the pixel-parity the copy exists to preserve).

### G4 — No dark-mode styling (P2)

`[CODE]` Zero `dark:` variants; built on light surfaces (`bg-falcon-neutral-50`, `bg-white`, `bg-slate-*`). On a dark canvas the skeleton is a bright light block. (Same class of finding as B25 `<falcon-org-node-header>` G8 + B26 `<falcon-node-details-section>` G5 — a recurring shared-ui "no dark mode" pattern.)

**Recommended fix:** add `dark:` variants (do it together with G3 token migration + G6 dedup).

### G5 — Physical `margin-left` indent breaks RTL (P2)

`[CODE]` `INDENT_STYLE` (ts:66-70) uses `'margin-left: 24px'` / `'margin-left: 48px'` (a **physical** property) applied as inline style (ts:94), plus an absolute `-left-3` guide line (ts:96). Under RTL the tree indents the **wrong way**.

**Recommended fix:** use logical `margin-inline-start` (or Tailwind `ms-*`) instead of `margin-left`, and `-start-3` instead of `-left-3`.

### G1 — No spec coverage (P3)

`[CODE]` No `*.spec.ts` (Glob 2026-06-03). The `visible()` OR logic, `indentStyle()` / `pillBg()` lookups, and `@if (visible())` gating are trivially testable. Low priority (display-only).

### G7 — No ARIA loading semantics (P2 — a11y, see below)

Covered in "Missing accessibility features."

### G8 — Arbitrary/non-standard widths (P3)

`[CODE]` `w-35` (ts:122/123 — not a default Tailwind step; relies on a custom scale or silently no-ops) and `min-w-[860px]` (ts:132/145/159 — arbitrary px). Minor; verify `w-35` actually resolves.

## Missing accessibility features

- **A1 (P2) — no loading announcement:** the skeleton has **zero ARIA** (no `role="status"` / `aria-busy="true"` / `aria-live` / `aria-hidden`). A screen-reader user gets no "loading" cue from the component. Add `role="status"` + `aria-busy="true"` + an `aria-label`/visually-hidden "Loading…" text on the root, and/or `aria-hidden="true"` on the purely-decorative shimmer blocks. (GAP G7.)
- **A2 (P3):** the placeholder blocks are meaningless to AT; marking the container `aria-hidden="true"` (paired with an `aria-live` "Loading" announcement elsewhere) would prevent AT from reading dozens of empty divs.

## Missing tests

- `[CODE]` No spec (G1). No coverage of `visible()` / `indentStyle()` / `pillBg()`.

## Missing Tailwind / token parity

- **Token discipline gap** (G3) — raw palette vs Falcon tokens.
- **N/A (dual-render / React-Vue parity)** — single-render Angular-only.

## Performance risks

- `[CODE]` Renders ~21 shimmer rows × several blocks each, all with `animate-pulse`. That's a modest number of animated elements; on a fast initial paint it's fine. `OnPush` + frozen constants — no re-render churn. **Low risk**, though many simultaneous `animate-pulse` elements have a small paint cost (acceptable for a transient placeholder).

## Visual / interaction risks

- `[CODE]` **Wrong-shape misuse** (G2) — the biggest visual risk; it promises a tree+table page.
- `[CODE]` **Dark-mode flash** (G4) and **RTL mis-indent** (G5).
- `[CODE]` **Duplicate drift** (G6) — if one copy is restyled and the other isn't, the "pixel-identical" promise breaks.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G6 | Dedup — migrate Hierarchy onto this + delete `app-org-hierarchy-skeleton` | P1 |
| G2 | Parameterize layout (or split into tree/table sub-skeletons) | P2 |
| G3 | Raw palette → Falcon tokens (after G6) | P2 |
| G4 | Dark-mode variants | P2 |
| G5 | Logical `margin-inline-start` for RTL | P2 |
| A1 | ARIA loading semantics (`role="status"`/`aria-busy`) | P2 |
| G1 | Spec | P3 |
| G8 | Fix `w-35`/`min-w-[860px]` | P3 |

## Recommended upgrade API (concrete)

```ts
// optional parameterization (G2)
readonly showTree = input<boolean>(true);
readonly tableRowCount = input<number>(9);
readonly tableColumnCount = input<number>(6);
```

```html
<!-- A1: announce loading -->
<div ... role="status" aria-busy="true" aria-label="Loading">
  <!-- decorative shimmer; mark blocks aria-hidden -->
```

## Fix-shared-vs-per-page

The dedup (G6) is the point — there should be ONE shared skeleton, not a shared copy plus an app copy. All other gaps belong in the shared component. **Critical ordering:** do G6 (consolidate) BEFORE G3/G4 (restyle), so the token/dark-mode migration happens once on the single source, not divergently on two copies.

## Workarounds (if upgrade blocked)

- For G2/wrong-shape today: build a page-specific skeleton for non-tree+table layouts; don't force this one.
- For G4/dark today: accept the light flash, or wrap in a matching light scrim.
- For A1/loading-announce today: the consumer can add its own `aria-live` "Loading" region next to the overlay.

## Deep-Dive Sweep Findings (2026-06-03 — B26)

**Consumer count: 2 occurrences / 2 app HTML files + 0 in `libs/falcon`** (`[CODE]` grep `<falcon-page-skeleton`). Both Templates list (admin + mgmt).

- **Status ACTIVE/SHARED but a documented DUPLICATE** — byte-equivalent to `app-org-hierarchy-skeleton`, with an explicit dedup `TODO` (ts:11-12). **G6 is the headline:** consolidate to one source.
- **Angular structure PASS** (signals, OnPush, `@for track`, no `*ngIf`); **house-rule deviations** are the rest: raw palette (G3, deliberate parity), inline `style` ×2 + physical `margin-left` (G5/RTL), no dark mode (G4), zero ARIA (A1).
- **Recurring shared-ui pattern:** "no dark mode" (shared with B25 `<falcon-org-node-header>` + B26 `<falcon-node-details-section>`).
- **All findings are `safe-local`** (dedup is a copy-removal; the rest are house-rule/a11y/doc). **0 HIGH-RISK-QUEUE.** No deletion flag for THIS component (it's actively used) — but G6 would delete its app-local TWIN once Hierarchy migrates onto it.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B26) against the full inline-template source (ts:1-192). Angular posture PASS; the duplicate-provenance + dedup `TODO` (G6), raw palette (G3), inline `style`/physical-margin (G5), no dark mode (G4), zero ARIA (A1) all read from live source. No deletion flag for this component; G6 targets its app-local twin. All `safe-local`.
