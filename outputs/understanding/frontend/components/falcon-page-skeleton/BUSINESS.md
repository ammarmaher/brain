# falcon-page-skeleton — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose

`[CODE]` The **"the page is loading, here's its shape"** affordance. In business terms it manages the operator's *perceived performance and trust* during the initial data fetch of a tree+table workspace: instead of a blank screen or a bare spinner, the operator sees a faithful ghost of the page they're about to get (a tree on the left, a table with status pills on the right). This reduces the sense of latency and signals "the right page is coming," which matters on the org-hierarchy / Templates screens where the first load aggregates data from multiple gateways.

## PRD / business rules touched

| Rule | Source | How this component surfaces it |
|---|---|---|
| (no direct business/validation rule) | — | `[CODE]` The skeleton encodes **no business rule** — it is a pure loading-UX device. It does not gate, validate, or persist anything. |
| Loading state must not let the operator act on un-loaded data | `[CODE]` templates-list.component.html:9 (`pointer-events-none` overlay) | The consumer overlays the skeleton with `pointer-events-none` so clicks cannot land on placeholder rows during the fetch — a UX-correctness guard owned by the consumer, not the skeleton. |

> `[CODE]` This is the rare component with **no business-rule footprint**. Its only "rule" is presentational: show a structurally-honest placeholder while loading.

## Business constraints baked in

- `[CODE]` **The placeholder mimics a SPECIFIC business surface** — the org-hierarchy / Templates "tree + table with status pills" layout (ts:1, 37-62). It is not a generic skeleton; it visually promises *that* shape. Using it on a differently-shaped page would mis-set the operator's expectation (and look broken) — a business-UX constraint, not a technical one (GAP G2).
- `[CODE]` **Pixel-parity with Hierarchy is a deliberate product decision** — ts:8 states the markup intentionally mirrors the Hierarchy skeleton "so the loading state is pixel-identical across features." The business value is a *consistent* loading experience across the two related workspaces; the cost is a code duplicate (the dedup `TODO`, ts:11-12).
- `[CODE]` **The status-pill tones** (success/warning/danger/muted via `PILL_BG`, ts:30-35) ghost the real table's status column, so the operator pre-recognizes that the loaded table will have colour-coded statuses — a small business-recognition cue.

## Business flows using this component

| Flow | Page | Role of the component in the flow |
|---|---|---|
| Open Templates list | templates-page (list, both consoles) | Shown as a `pointer-events-none` overlay while the templates list loads, then removed when data arrives (`showSkeleton()` flips false) |
| `[INFERRED]` Open org-hierarchy workspace | org-hierarchy-page | The byte-equivalent ORIGINAL (`app-org-hierarchy-skeleton`) backs this today; once the dedup `TODO` lands, THIS shared component would back it too |

## Business gotchas

- The skeleton appearing is **not** a sign of a slow backend per se — it appears for the normal duration of any initial fetch. A persistently-stuck skeleton, however, indicates the fetch never resolved (the consumer never flips `showSkeleton()`/`loading()` false) — that is a data/consumer bug, not a skeleton bug.
- `[CODE]` Because the layout is fixed, a reviewer who sees the skeleton on a page whose real content is NOT a tree+table is hitting GAP G2 (wrong-shape placeholder), which is a UX-honesty issue worth flagging.
- `[CODE]` In dark mode the skeleton renders as a bright light block (no `dark:` variants — TOKENS G4); a reviewer seeing a glaring white flash on a dark page is hitting that gap, not a data issue.
- The component has **no auto-timeout** — it shows for exactly as long as the consumer keeps `visible()` true; the consumer owns the "give up / show error" decision.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B26, NEW dossier) — the component carries no business/validation logic (confirmed against ts:1-192: only `forceVisible`/`loading`/`visible` + display constants). The `pointer-events-none` loading-correctness guard lives in the consumer (templates-list.component.html:9), confirmed in live source. The "pixel-parity across features" product rationale is quoted from ts:8. No PRD/V-rule footprint — 🟢 by-design.
