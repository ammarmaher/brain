# falcon-empty-data — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[CODE]` falcon-empty-data.tsx:1-7 — falcon-empty-data is the **decorated zero-data moment**: when a list a Falcon operator opened has nothing in it, this is the card that says *"there is no data found to be previewed"* and (optionally) offers the one action that fixes it ("Add"). In business terms it is the productised answer to the most common dead-end in the platform — an empty user list, an empty templates list, an empty contracts table, an empty contact-groups list. It standardises the *shape* of that dead-end so every empty table across both consoles looks and behaves identically. It carries **no business logic** and **no `BR-*` rule** — it is a presentational nudge.

`[INFERRED]` Its business value is *guidance + consistency*: an empty table with a clear, branded card and a CTA ("No clients yet — Add client") turns a confusing blank grid into an obvious next step, and does so the same way everywhere because the data-table auto-mounts it from one shared config.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| (none direct) | — | Presentational — it guides, it enforces nothing. |
| `[INFERRED]` Empty ≠ loading ≠ error | `[CODE]` falcon-empty-data.tsx:1-7 + OVERVIEW.md | Shown only after a fetch resolves to zero rows; the loading moment is the table `[loading]` skeleton, the error moment is a different treatment (no error variant here). |
| `[INFERRED]` Default empty copy is centrally governed | `[CODE]` falcon-empty-data.component.ts:88-91 (`FalconConfigurationService.resolveEmptyData`) | The platform's default "No data found" message + icon are set once in `falcon-defaults.json` / `registerEmptyDataOverride()` — so an operator sees consistent empty-state language unless a feature deliberately overrides it. |

## Business constraints baked in
- `[CODE]` falcon-empty-data.component.ts:88-91,190-240 — **default copy/icon are an app-level decision, not a per-page one.** A feature that wants the standard empty message binds nothing; the config service fills it. A feature with a bespoke message binds `[titleText]`/`[body]`/`[iconKey]` and wins. A builder must NOT scatter "No data found" literals per page — change the default in the config service.
- `[CODE]` falcon-empty-data.tsx:54/66 + org-hierarchy-page-menu.component.ts:128 — **the CTA + info chip are OFF by default** (`showAction=false`, `showInfo=false`). Showing the "Add" button is a deliberate product opt-in: a list the operator cannot add to (PES-denied) shows a message-only empty state; a list they CAN add to opts the CTA on and wires `(emptyDataAction)`.
- `[CODE]` falcon-empty-data.tsx:250-251 — **`context.feedbackLevel` changes only assistive-tech semantics**, not the look. `destructive` → `role="alert"`, `action-required` → `role="status"`. A builder must NOT expect `feedbackLevel='destructive'` to paint a red error card — it won't (there is no error variant; GAPS G5). A real error needs a different component.
- `[CODE]` falcon-empty-data.component.ts:50-55 — **the eager element-define is load-bearing for the showcase + data-table toggles.** Removing it makes `showAction`/`showInfo` appear non-functional. This is a correctness constraint, not a perf nicety.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| `[CODE]` Empty user list | org-hierarchy menu (both consoles) | Auto-mounted by the data-table when `users.length === 0`; message-only or with an Add CTA per PES. |
| `[CODE]` Empty templates list | templates-page (both consoles) | Auto-mounted on `templates.length === 0`. |
| `[CODE]` Empty contracts/cost table | contracts-cost-management (both consoles) | `[emptyData]` config on the table. |
| `[CODE]` Empty contact-groups list | contact-groups-list (both consoles) | `[emptyData]` config on the table. |
| `[CODE]` Library showcase | host-shell falcon-ui-showcase | The only DIRECT render — a live dual-mode demo. |

`[CODE]` Adoption — **1 direct render + 9 `[emptyData]`-config tables + 1 lib re-export** (B12 sweep). Unlike `<falcon-empty-state>` (3 direct renders, niche), empty-data is **broadly adopted via the data-table shorthand** — it is the de-facto empty visual for Falcon lists.

## Business gotchas
- `[CODE]` falcon-empty-data.tsx:1-7 — **do not use it for a loading state.** An empty-data card shown during a fetch falsely tells the operator "there is no data" before data arrives — use the table `[loading]` skeleton.
- `[CODE]` falcon-empty-data.tsx — **there is no error variant.** A failed list load must not reuse this card with a different icon; `feedbackLevel='destructive'` only re-roles it for screen readers (GAPS G5).
- `[CODE]` falcon-empty-data.tsx:283 — the title is a `<div>`, NOT an `<h*>`; a page with a strict heading outline gets no heading semantics from the empty card (contrast `<falcon-empty-state>`'s `<h3>`). Business-visible only to assistive-tech users (a11y gap G3).
- `[CODE]` falcon-data-table.component.ts:1020 — **a projected `*falconDataTableEmpty` template silently beats `[emptyData]`.** A builder who sets both gets the projected template and a silently-ignored config — a confusing "my empty config does nothing" bug.
- `[CODE]` falcon-empty-data.tsx:317 — the info chip needs **both** `showInfo` AND a non-empty `infoText`; setting only `showInfo=true` renders nothing.

## Verification
🟢 CODE-DERIVED 2026-06-03 (B12, NEW) from `[CODE]` falcon-empty-data.tsx + .component.ts + the data-table integration + org-hierarchy-page-menu.component.ts. No `BR-*` rule binds this presentational primitive. The config-default governance, CTA/info opt-in, no-error-variant, template-precedence, and `<div>`-title facts are ✅ VERIFIED against source. Business flows ✅ confirmed from the 9 `[emptyData]` consumers + showcase.
