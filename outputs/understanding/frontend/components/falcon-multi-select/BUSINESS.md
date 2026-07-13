# falcon-multi-select — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` `OVERVIEW.md` — The multi-select is how an operator commits a **set of categorical decisions at once**: which permissions a role holds, which tags apply, which regions a filter covers. Where `falcon-dropdown` answers "which one", multi-select answers "which ones". Today its only **live** business face is the **display-only chip-list**: the Templates list + detail use it to *show* which users a template is "Shared with" — a read surface, not a picker — `[CODE]` admin/mgmt templates-list.component.html:310-318, templates-details.component.html:120-126. The full selection picker (chips + searchable list + tri-state "Select all") exists and is feature-complete but is exercised only in the Studio gallery.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| A template's "Shared with" audience is a set of users | `[CODE]` templates-list.component.html:308-319 + templates-details.component.html:120-126 | The "Shared with" cell/detail renders the set as chips via `displayMode="chip-list"`; overflow folds into a "+N" dialog. **Falcon view is `readonly`** (`state.isFalconView()`), so Falcon admins see-but-cannot-edit the audience. |
| Sharing audience is owned by the flow, not the chip | `[CODE]` B-CG-2 (`share-group-step.component.html:4`) | The contact-group "Share" step was re-skinned but deliberately NOT migrated to multi-select — sharing audience there is captured by a bespoke picker. The chip-list here is a *display* of an already-decided set. |
| Permission assignment is a multi-value set | `[BRAIN-OUT]` `OVERVIEW.md` "Permission picker (multiple permissions per role)" | Design intent for the selection picker — the canonical permission picker would select a role's permission set here. Showcase-only today. |
| Multi-category / multi-region filtering | `[BRAIN-OUT]` `OVERVIEW.md` | Filter panels would express an OR-set of business categories. Showcase-only today. |

`[INFERRED]` No specific `BR-*` rule id is mapped in the dossiers; the business contract is "a set of values from a closed list", enforced structurally by the array-valued CVA.

## Business constraints baked in
- `[CODE]` falcon-multi-select.component.ts:55,142,194 — the value is `ReadonlyArray<string | number>` — a multi-select **always commits a set** (possibly empty), never a scalar. The empty array is a valid business state ("nothing selected" / "shared with no one").
- `[CODE]` falcon-multi-select.tsx:512-534 + falcon-multi-select.utils.ts:142-164 — `showSelectAll` adds a **tri-state** row: none / some (indeterminate) / all. `applySelectAllToggle` **never touches disabled options' selected state** — a deliberate rule: "select all" means "all *enabled* options", disabled-but-selected values are preserved.
- `[CODE]` falcon-multi-select.component.ts:114,282-289 — `maxChipsVisible` (default 3) caps how many selected values render as chips before a "+N more" pill (selection) / "+N" button (chip-list) — a *display* cap, not a *selection* cap.
- `[CODE]` GAPS_AND_UPGRADES.md G8 — there is **no `maxSelected` business cap** on the wrapper. A flow that must limit how many values a user may pick ("at most 5 regions") cannot enforce it through this component today — it must cap externally.
- `[CODE]` falcon-multi-select.component.ts:106-107 — `readonly` freezes the committed set; `required` marks it mandatory (≥1 selection). In chip-list mode `readonly` also disables the "+N" expander.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| Templates list — "Shared with" column | admin + mgmt templates-page | display-only chip strip of the share audience; +N opens a names dialog |
| Template details — "Shared with" | admin + mgmt templates-details | full chip list of the audience (readonly) |
| Permission selection | (design intent) user/role wizard | would pick the permission set for a role — showcase-only |
| Filter panels | (design intent) | would express multi-category / multi-region filter — showcase-only |
| Studio gallery | falcon-studio | live selection-picker showcase |

## What it CAN do (business)
- `[CODE]` html:12-97 — Render an audience/tag set as a **display-only chip strip** with a "+N" overflow dialog (today's real use).
- `[CODE]` ts:55 — Commit a set of categorical values (permissions, tags, regions) in one form field (selection mode).
- `[CODE]` tsx:512-534 — Offer a one-click "select everything" bulk decision (tri-state Select all, disabled-preserving).
- `[CODE]` ts:107-108 — Mark the set mandatory (`required`) or frozen (`readonly`); offer a clear-all affordance.

## What it CANNOT do (business)
- `[CODE]` GAPS_AND_UPGRADES.md G8 — It cannot enforce a **minimum or maximum count** of selections.
- `[CODE]` GAPS_AND_UPGRADES.md G3 — It cannot lazy-load options — the whole option set must be in memory.
- `[CODE]` GAPS_AND_UPGRADES.md G1/G9 — It cannot show per-option/per-chip business context (icon, status, sub-label) — only `label` text.
- `[CODE]` GAPS_AND_UPGRADES.md G5 — It cannot group options into business sections (no `group?` on the option type).
- `[INFERRED]` It cannot express ordered selection meaning — the value is an unordered set (though `resolveSelectedOptions` does preserve the `values` array order for display).

## Enhancement opportunities
- `[CODE]` GAPS_AND_UPGRADES.md G8 — Add `maxSelected` (and a min) so quota-style rules are enforced in the control, not duplicated across consumers.
- `[CODE]` GAPS_AND_UPGRADES.md G1/G9 — Per-option / per-chip templates + `iconUrl` parity so permission rows can show a status/scope glyph.
- `[CODE]` GAPS_AND_UPGRADES.md G5 — Grouped options so a permission picker can show "Account / User / Billing" sections.
- `[INFERRED]` Formally map a `BR-*` for the permission-picker use — today the business contract is implicit in the (future) consuming wizard.

## Business gotchas
- An empty array is a legitimate committed value — distinguish "user cleared the set" from "user has not touched the field" via `required` + `touched`, not via emptiness alone.
- `maxChipsVisible` is cosmetic — a "+2" pill does **not** mean only N values are selected; the full set is still committed. Never read selection count from visible chips.
- `showSelectAll` "select all" commits **every enabled option currently in the list** — if options are filtered/partial, "all" means "all loaded", which can mislead in a paged dataset.
- chip-list mode is **display-only** — clicking a chip does nothing; only the "+N" button is interactive. Do not expect chip-list to capture edits.

## Verification
🟢 code-verified — value contract (ts:55,142,194), tri-state select-all logic (utils.ts:142-164), chip-list readonly/display semantics (html:12-97), and the live Templates "Shared with" usage (templates-list/details, read 2026-06-03). Consumer count corrected 3→4 (chip-list). Permission-picker / filter-panel business use is design intent (`[BRAIN-OUT]`), showcase-only — no live picker consumer; no `BR-*` id formally mapped.
