# falcon-drawer — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` `falcon-drawer` is the **edge-anchored work surface** — a panel that slides in from a screen edge to host a focused task (create/edit a record, filter a list, inspect a detail) without fully discarding the page context behind it. In business terms it is the "do a side job" surface: heavier than a tooltip, lighter than a full page navigation, and unlike a centered dialog it keeps the originating list/tree visible at the edge so the operator stays oriented.

`[CODE]` `falcon-drawer.tsx:1-5` — the component owns the overlay, slide-from-edge panel, focus trap, focus restore, and Esc/backdrop dismissal.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| No direct business rule | `[INFERRED]` | The drawer encodes no PRD `BR-*` rule — it is a layout primitive. The business logic lives in the form/list projected into its body. |
| "Create / edit a node happens in a side panel" | `[BRAIN-OUT]` `OVERVIEW.md:46-48` + `USAGE.md:4` | The Org Hierarchy Add Node / Edit Node flow renders its form inside `<falcon-angular-drawer position="right">` — the drawer is the chosen surface for hierarchy mutations so the tree stays visible. |

## Business constraints baked in
- `[CODE]` `falcon-drawer.tsx:40,107-109,115-119` **`dismissable=false` is a hard lock** — when false, both Esc and backdrop click are suppressed. Business meaning: a flow can force the operator to resolve the side task via explicit Cancel/Save buttons and forbid accidental dismissal mid-edit.
- `[CODE]` `falcon-drawer.tsx:39` **`closable` toggles the close ×** — `[BRAIN-OUT]` `USAGE.md:61` the canonical Add/Edit Node drawer sets `[closable]="false"` and relies on a consumer-owned Cancel button. Business meaning: for destructive-risk forms there is exactly one, explicit exit path — no ambient × that could be hit by mistake.
- `[CODE]` `falcon-drawer.tsx:41,105-109` **`modal=true` blocks underlying clicks** — `[BRAIN-OUT]` `USAGE.md:154` with `modal=false` the user can keep interacting with the tree/list behind. Business meaning: `modal=true` protects data integrity (the operator cannot mutate the underlying record while a side edit is open); `modal=false` is for non-blocking inspectors only.
- `[INFERRED]` **Body unmounts on close** (`[CODE]` `falcon-drawer.tsx:169` `render()` returns `null`) — an abandoned draft is discarded, not silently retained. The flow must lift any business state to the parent if it needs to survive a close.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Add Node | organization-hierarchy (admin-console) | `[CODE]` `OVERVIEW.md:47` — right-side drawer hosts the new-node name form. |
| Edit Node | organization-hierarchy (admin-console) | `[CODE]` `OVERVIEW.md:47` — same drawer component, `mode='edit'`; pre-fills the node name. |
| Add / Edit Node | organization-hierarchy (management-console) | `[CODE]` `OVERVIEW.md:48` — twin app uses the same `falcon-org-node-drawer` pattern. |
| Filter panels / side inspectors | (general) | `[BRAIN-OUT]` `OVERVIEW.md:9-11` — recommended surface for filter UIs and detail previews. |

## Business gotchas
- `[BRAIN-OUT]` `USAGE.md:160` **Zero feature adoption as of 2026-05-17** — a grep across `apps/` returned 0 consumers of `<falcon-angular-drawer>`. The Add/Edit Node drawers are cited in `OVERVIEW.md` but the Wave 7 sweep found no live `<falcon-angular-drawer>` tags — the org-hierarchy `falcon-org-node-drawer` may currently use a different shell. A builder should verify the actual node-drawer template before assuming this primitive is wired.
- `[BRAIN-OUT]` A drawer is for **work and detail**, not decisions — using `position="bottom"` for a confirm prompt is the wrong concept (`[BRAIN-OUT]` `USAGE.md:137`). Decisions belong in `falcon-angular-popup`.
- `[CODE]` `falcon-drawer.tsx:40` vs `falcon-dialog.tsx:48` **spelling trap** — the drawer prop is `dismissable` (a-spelling); the dialog prop is `dismissible` (i-spelling). A builder copying a dialog template into a drawer will silently get the default.
- `[INFERRED]` `position="right"` / `"left"` are **physical**, not logical — they do not auto-swap under RTL. An Arabic flow that wants the drawer on the start edge must set `position` dynamically (`[BRAIN-OUT]` `TOKENS.md:44-49`).

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-drawer.tsx` + `falcon-drawer.component.ts` and the existing 6 dossier files. No PRD `BR-*` rule binds this primitive. ⚠ Note the contradiction flagged above: `OVERVIEW.md` cites org-hierarchy node-drawer consumers, but `GAPS_AND_UPGRADES.md` / `USAGE.md` Wave 7 sweep reports 0 live `<falcon-angular-drawer>` tags — adoption is unconfirmed.
