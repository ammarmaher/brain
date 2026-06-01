# falcon-multiselect (LEGACY) — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration → `INTEGRATION_VALIDATION.md`.
> **⚠ LEGACY / DEPRECATED — and the source is no longer in the repository.** See "Legacy status" below.

## Legacy status (read first)
`[CODE]` Live-source check 2026-05-18: the path the dossiers cite — `libs/falcon/src/shared-ui/lib/components/falcon-multiselect/` — **does not exist**. `libs/falcon/src/shared-ui/lib/components/` now contains only `falcon-form-field`, `falcon-node-details-section`, `falcon-photo-uploader`, `falcon-tree-panel`, `falcon-view-toggle`. A repo-wide search for `*multiselect*` (excluding `node_modules` / `dist`) returns nothing.
**CODE-DERIVED CORRECTION to the existing 6 dossier files:** they describe `falcon-multiselect` as an existing Wave 3 *stub façade*. That stub has since been **deleted** — the OVERVIEW's own note "Slated for deletion" has been executed. This dossier folder is now a **historical record only**; the component no longer ships.

## Business purpose (historical)
`[BRAIN-OUT]` `OVERVIEW.md` — `falcon-multiselect` was originally a bespoke `<p-multiSelect>` wrapper with a **dual-panel multi-select UX**: search + chips on the left, a confirmed "Selected" list on the right, with server-side filtering, infinite scroll, and a Select-All that cached selections across pages. In business terms it served large-catalogue multi-assignment where the operator needed an explicit "what I have chosen so far" panel — e.g. assigning many items to an account where the selection set itself is reviewed.
`[BRAIN-OUT]` `OVERVIEW.md` — Wave 3 verified **zero consumer templates** referenced it, dropped the `primeng/multiselect` dependency, and replaced it with a thin stub that only rendered a plain `<falcon-angular-multi-select>` for any latent single-list consumer. The dual-panel / server-filter / infinite-scroll / cross-page Select-All UX was **explicitly not preserved** even in the stub.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| (none) | `[BRAIN-OUT]` `OVERVIEW.md` | No `BR-*` rule binds to it — Wave 3 confirmed zero consumers; the deleted component enforced nothing. |

## Business constraints baked in
- `[CODE]` **None — the component does not exist.** Historically (`[BRAIN-OUT]` `API.md`) the stub preserved ~25 inputs and 7 outputs purely for compile compatibility; almost all were **silent no-ops**. The stub committed a set of `string` ids via `[selectedIds]` two-way binding (no CVA).

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| (none) | (none) | `[BRAIN-OUT]` `OVERVIEW.md` — Wave 3 grep confirmed zero consumers; post-deletion there are none and can be none. |

## What it CAN do (business)
- **Nothing — the component has been removed from the codebase.** `[CODE]` Live-source check 2026-05-18.

## What it CANNOT do (business)
- `[CODE]` It cannot be used at all — the source files (`.ts` / `.html` / `.scss` / `.models.ts` / `index.ts`) are gone; `@falcon` no longer exports `FalconMultiselectComponent`.
- `[BRAIN-OUT]` `OVERVIEW.md` — Even the Wave 3 stub could **not** do the dual-panel UX, server-side filtering, infinite scroll, or cross-page Select-All — those were dropped on the way to the stub.

## Enhancement opportunities
- `[INFERRED]` **None for this component** — it is deleted, not a candidate for enhancement. Any need for multi-value selection is served by `<falcon-angular-multi-select>`.
- `[INFERRED]` If the original *dual-panel review* UX is ever needed again (large-catalogue assignment with an explicit "Selected" panel), it should be raised as a **new feature on `<falcon-angular-multi-select>`** (e.g. a `dual-panel` variant) — not a revival of this legacy component.

## Business gotchas
- This folder is a **historical record**. A builder must not plan work against `falcon-multiselect` — it does not exist.
- The existing `OVERVIEW.md` / `API.md` describe a Wave 3 *stub* that has since been deleted; treat their input/output tables as archaeology, not API.
- For any multi-value picker, the answer is `<falcon-angular-multi-select>` (see that component's 9 dossier files).

## Verification
🔴 INFERRED / historical. CODE-DERIVED CORRECTION: `[CODE]` live-source check 2026-05-18 confirms the component's source directory and all files have been **deleted** — the existing 6 dossier files describe a now-removed Wave 3 stub. No business behavior remains.
