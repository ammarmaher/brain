# falcon-status-chip — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[PRD]` `[MEMORY]` `[INFERRED]`.

> **Single-render Angular shared-ui chip.** `<falcon-status-chip>` lives at `libs/falcon/src/shared-ui/` and has no Stencil twin / no token file. In business terms it is how the operator **reads a template's lifecycle state at a glance** — the colored word that says whether a message template is approved, awaiting review, rejected, or deleted.

## Business purpose
`[BRAIN-OUT]` `<falcon-status-chip>` is the **status read-out** for the message-Templates domain. A template moves through a maker/checker lifecycle (drafted → in review → approved / rejected, and can be deleted); operators scan a list of templates and a single details page and must instantly know each template's state and each checker's verdict. The chip encodes that verdict as a color + word: green=approved, amber=pending/in-review, red=rejected/deleted, neutral=not-applicable. `[CODE]` ts:1-7 frames it as "the single source of truth for status indicators" — i.e. the one place the templates-status color/word contract is defined, so two pages (list + details) and two consoles (admin + mgmt) render the same state identically.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| A template has a lifecycle status the operator must see | `[CODE]` templates-list.component.html:215-221 + ts:15-21 | The `status` column renders a filled chip whose color+label come from the template's `status` field. |
| Maker/checker review state is shown per checker | `[CODE]` templates-list.component.html:225-266 (`checker1`/`checker2` cells, `variant="text"`) | Each checker's verdict renders as an italic colored status under their name — the operator sees who approved/rejected. |
| Empty / not-applicable status renders as "---" not blank | `[CODE]` ts:13-21,70-75 (`none` → `templates.status.na`) | `none` is an explicit status bucket (neutral pill / "N/A") so an absent status is shown deliberately, never as an empty cell. |
| Status text is translation-keyed (En/Ar) | `[CODE]` ts:90,99 (`\| translate`) + ts:44-74 (`templates.status.*` keys) + `[VAULT]` Glossary En/Ar discipline | The label is always an i18n key (`templates.status.approved` / `.pending` / `.inReview` / `.rejected` / `.deleted` / `.na`), resolved through `TranslatePipe`; RTL Arabic supported via the keyed lookup. |
| A Falcon-vs-client status may need a domain-specific word | `[CODE]` templates-list.component.html:335-340 (`[labelKey]="falconChipLabelKey(row)"`) | The `falconStatus` column reuses the chip's color buckets but overrides the word via `labelKey` — the same color contract, a context-specific label. |

## Business constraints baked in
- `[CODE]` ts:13-21 **The status vocabulary is exactly six values** — `approved` / `pending` / `rejected` / `deleted` / `review` / `none`. This is the **templates-domain** lifecycle, NOT the account/user lifecycle. A builder who needs `active`/`suspended`/`expired` etc. is using the wrong component (that is `<falcon-status-badge>`'s 9-severity set) — see `RECOGNITION.md` G1.
- `[CODE]` ts:52-57,64-69 **`pending`≡`review` and `rejected`≡`deleted` are color-identical** — they paint the same amber / red but carry different words. The business distinction (awaiting first review vs in-review; rejected by a checker vs administratively deleted) is conveyed by the **label**, not the color. A monochrome screenshot cannot distinguish them.
- `[CODE]` ts:84-101 **The chip is display-only** — no click, no dismiss, no output. Selecting/acting on a template happens elsewhere (the row, the details page); the chip only reports state. A builder must not expect a chip click to do anything.
- `[CODE]` ts:90,99 **Labels are i18n KEYS** — passing a translated string (e.g. `"Approved"`) ships a missing-translation artifact in the other locale.
- `[INFERRED]` **The chip owns no business data** — `row.status` is computed by the templates page from the backend template DTO; the chip renders whatever bucket it is handed. It is a read surface, not a source of truth for the *value* (only for the color/word *contract*).

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Browse templates | Templates list (admin + mgmt console) | The `status` column chip + the per-checker `variant="text"` sub-lines — the operator scans lifecycle + review state. |
| View a template's detail | Templates details (admin + mgmt console) | Renders the same status + checker verdicts on the single-template page. |
| Falcon-vs-client status read | Templates list `falconStatus` column | Color-bucketed chip with a domain-overridden label (`labelKey`). |

## Business gotchas
- `[CODE]` **"Single source of truth … across the Falcon platform" is aspirational** (ts:1-2) — in practice the chip is consumed ONLY by the Templates pages, and its status set is templates-specific. Account/user/wallet statuses go through `<falcon-status-badge>`. Treating this chip as the platform-wide status SoT is a documented over-claim (G1) — a builder must pick the component by status vocabulary, not by the header comment.
- `[CODE]` **`pending` vs `review`** — both amber; choose the right one for the right business meaning (the label differs: `templates.status.pending` vs `templates.status.inReview`). Picking `pending` where the template is mid-review mislabels the state even though the color is "right".
- `[CODE]` **`status` is required** — a template with an unmapped/undefined status must be coerced to `'none'` upstream, or the chip is a template error. Never leave the cell to "figure it out".
- `[CODE]` **Color is fixed per status** — there is no business-driven recolor. If a future status needs a new color, that is a shared `STATUS_TOKENS` change (one-line append), not a per-page tweak (`TOKENS.md`).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B24) — the six-status vocabulary, the color/label contract, the `none`→"N/A" placeholder, the i18n-key labels, and the display-only (no-output) nature all re-confirmed against `falcon-status-chip.component.ts` (read in full) + the live `templates-list.component.html` consumer (lines cited). The Templates list/details consumption across both consoles is 🟢 CODE-VERIFIED (consumer sweep). The "platform SoT over-claim" + the templates-vs-account vocabulary split are 🟢 source-confirmed (vs `<falcon-status-badge>`'s 9-severity type file). PRD lifecycle semantics 🟡 CODE-DERIVED from the consumer templates + status keys (not re-read from a Templates PRD this pass).
