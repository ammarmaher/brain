# falcon-page-skeleton — DECISION

## Brain SK final recommendation

**STATUS: USABLE / SHARED — but a documented DUPLICATE pending consolidation.** Use it for the tree+table workspace loading state (org-hierarchy / Templates shape). Its Angular structure is sound; the open work is (1) **dedup** with `app-org-hierarchy-skeleton` (G6 — the headline) and (2) house-rule/a11y polish (token migration, dark mode, RTL indent, ARIA) done **after** the dedup so it happens once.

## Use this component for

- A full-page loading placeholder on the org-hierarchy / Templates "tree + table with status pills" layout.
- A structural shimmer during a page's initial fetch where a spinner would feel jarring.
- Either self-gating (`[loading]`) or an overlay (`[forceVisible]="true"` inside your own `@if` + scrim).

## Avoid this component for

- A loading state whose layout is NOT the tree+table workspace shape (hardcoded — GAP G2). Build a page-specific skeleton instead.
- Per-row/per-cell loading inside an already-rendered table (that's a hard content-swap; a future `<falcon-table-skeleton>` primitive — G2 — would serve that).
- A small inline placeholder (overkill).
- Dark-mode-critical or RTL-critical surfaces today (GAPs G4/G5 unaddressed).

## Preferred variant / render path

**Single render path** — pure-Angular component, no `useTailwind`/Shadow choice (dual-render concepts N/A). Prefer the **overlay pattern** (`[forceVisible]="true"` + a `pointer-events-none` scrim) when overlaying live content (the Templates pattern); use **self-gating** (`[loading]`) when the skeleton replaces a blank region.

## Required upgrades before wider use

- **G6 (dedup) is the gating item before promoting wider adoption** — migrate `org-hierarchy-page` onto this component and delete `app-org-hierarchy-skeleton`, so there is one source. Until then, every fix must be mirrored across two copies.
- **G2 (parameterize / split into primitives)** is needed before it can serve layouts other than tree+table.
- Dark mode (G4), RTL indent (G5), and ARIA loading semantics (A1) are quality upgrades.

## Relationship to other components

- **Duplicates:** `app-org-hierarchy-skeleton` (byte-equivalent app-local original). The dedup `TODO` (ts:11-12) would consolidate them.
- **Pairs with:** the consumer's real content (overlaid while loading) — and conceptually with the data table's hard content-swap (this is the whole-page alternative to in-table loading).
- **Sibling shared-ui:** `<falcon-node-details-section>`, `<falcon-info-card>` (B25), `<falcon-view-toggle>` (B25) — all single-render pure-Angular.

## Exact rule for future implementation tasks

1. **Loading a tree+table workspace page?** Use `<falcon-page-skeleton>` (overlay with `[forceVisible]="true"` + `pointer-events-none`, or `[loading]` self-gating).
2. **Loading a DIFFERENT page shape?** Do NOT use this — build a page-specific skeleton (and consider proposing the G2 split into `<falcon-tree-skeleton>`/`<falcon-table-skeleton>` primitives).
3. **Never create a third copy** — if you find yourself copying this, do the dedup (G6) instead.
4. **You own show/hide** — flip `visible()` false on both success AND error (no auto-timeout).
5. **Don't restyle one copy in isolation** (G3/G4) — consolidate first (G6), then restyle the single source.
6. **Add an `aria-live` "Loading" region in your consumer** until A1 lands (the skeleton announces nothing).

---

## Dynamic capability assessment

### 1. What is static today?

- The **entire layout** — 12 tree rows, 9 table rows, 4 tabs, `lg:grid-cols-5` split, every width/height (ts:37-70, template). Nothing about the shape is parameterized (G2).
- The **colours** — a mix of raw Tailwind palette (`slate`/`emerald`/`amber`/`rose`) and Falcon tokens (`falcon-neutral`/`falcon-teal`), baked in (G3).
- **No dark mode** (G4); **physical `margin-left` indent** (G5); **no ARIA** (A1).

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` **2 signal inputs:** `forceVisible`, `loading` → the `visible` `computed` (OR). That is the ONLY dynamic axis — visible vs hidden.
- `[CODE]` **0 outputs.**

### 3. What is already dynamic through slots / ng-template?

- **Nothing** — no `<ng-content>`, no `<ng-template>` inputs. Fully self-contained (G2).

### 4. What is dynamic through token/theme overrides?

- **Nothing per-instance** — no token file; raw-palette colours can't be themed, and the Falcon-token ones aren't exposed for override (G3).

### 5. What is dynamic through Tailwind classes?

- Host `class=` flows to the outer box (`block w-full h-full`, ts:76) — affects only the outer container, not the internal shimmer.

### 6. What is missing to make this component reusable across pages?

- **A lot** — it is reusable only for ONE shape. To generalize: parameterize row/column/tab counts + `showTree` (G2), or split into composable skeleton primitives.
- Dark mode (G4), RTL indent (G5), ARIA (A1), token migration (G3) for cross-context fitness.
- **And first:** consolidate the duplicate (G6).

### 7. What capability should be added to shared component (not page hack)?

- The dedup (G6) — one source, not a shared copy + an app copy.
- Composable sub-skeletons (`<falcon-tree-skeleton>` + `<falcon-table-skeleton>`) so other pages assemble a fitting placeholder (G2) — this would also give the data table a per-row loading option.

### 8. What flags / options / templates / slots would make it better?

- `@Input() showTree` / `tableRowCount` / `tableColumnCount` (G2).
- `role="status"` + `aria-busy` + a visually-hidden "Loading" label (A1).
- `dark:` variants (G4); logical `ms-*` indent (G5).

### 9. What is the safest upgrade path?

1. **Phase A (consolidate — the prerequisite):** execute the dedup `TODO` (G6) — migrate Hierarchy onto `<falcon-page-skeleton>`, delete `app-org-hierarchy-skeleton`. Now one source.
2. **Phase B (a11y, additive):** add `role="status"`/`aria-busy`/visually-hidden label (A1) + `aria-hidden` on decorative blocks. Zero visual change.
3. **Phase C (house-rule, on the single source):** raw palette → Falcon tokens (G3), add `dark:` variants (G4), logical `margin-inline-start` indent (G5).
4. **Phase D (generalize):** parameterize the layout / split into primitives (G2).

Order matters: **B and C must come AFTER A**, or the token/dark/RTL work happens twice and risks divergence.

### 10. What is risky to change because other pages depend on it?

- `[CODE]` The **pixel-parity contract** (ts:8) — restyling this copy without the original (or vice-versa) breaks the "loading state is pixel-identical across features" promise. Consolidate (G6) before touching colours.
- `[CODE]` The **fixed layout** — Templates depends on the exact tree+table shape; changing row counts/widths would alter the loading look on a shipped page (low stakes, but visible).
- The **`forceVisible` vs `loading` semantics** — the Templates overlay relies on `[forceVisible]="true"` always rendering; changing the OR logic would break the overlay.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B26, NEW dossier). Recommendation USABLE/SHARED with a P1 dedup (G6). Counts: 2 signal inputs, 1 `computed`, 0 outputs, no slots, no CVA, no Stencil layer. The duplicate provenance + dedup `TODO`, fixed layout, raw-palette/dark/RTL/ARIA gaps all re-confirmed in live source (ts:1-192).
