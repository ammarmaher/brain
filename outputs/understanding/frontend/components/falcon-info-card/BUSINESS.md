# falcon-info-card — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose

`[CODE]` falcon-info-card.component.ts:1-20 — In business terms this is the **"read-only summary of a thing"** surface: it lays out an entity's attributes as labelled values so an operator can *review* (not edit) them. At both live sites it summarizes a **message Template** — once as the persisted "Template details" panel, once as the "review what you entered before you submit" step of the create-template wizard. It owns **no business data**; the consumer feeds it already-resolved label/value pairs (`[fields]`) + projected non-text cells, and the component just renders the card chrome.

## PRD / business rules touched

| Rule | Source | How this component surfaces it |
|---|---|---|
| Template details show the 4-dimension status + provenance metadata | `[CODE]` templates-details.component.ts:204-213 (BRD §11.2 — approvalStatus / qualityRating / source / nodeId / lastUpdated) | These fields are built into `infoFields(tpl)` and rendered as the card's grid; the Falcon (normalized §10) status is rendered as a projected coloured `<falcon-status-chip>` (templates-details.component.html:98-109). |
| Wizard Step 3 is a PRD-strict review of Steps 1-2 before submit | `[CODE]` step3-share-submit.component.html:1-7 (PRD §9.4 — "final review of Steps 1-2 … review-only") | The info-card renders `reviewFields()` so the operator confirms entered values before the §9.4 submit handoff. |
| Templates have a status (Draft / submitted / approved …) | `[CODE]` templates-details.component.html:88-96 (`<falcon-status-chip [status]="tpl.status">`) | Status is a non-text cell projected into the card grid, not a plain field. |

> `[INFERRED]` The card itself enforces no rule — it is a presentation surface for the Templates feature's rules. The business contract (what fields, what statuses, the §9.4 submit gate) lives in the Templates feature + its DTOs, not in `falcon-info-card`.

## Business constraints baked in

- `[CODE]` **Read-only by design** (ts:11/20 "DATA-FED, READ-ONLY … display only") — there is no way for an operator to edit a value through the card. Business-correct for a details/review surface; a builder must NOT try to make a field editable inside the card (use a form elsewhere).
- `[CODE]` **Values are pre-resolved** (ts:19/42) — the component shows exactly the string the consumer computed (including formatting like `creationDate · creationTime` and fallbacks like `subCategory ?? '---'`, templates-details.component.ts:199/203). The business formatting decisions (date format, "---" for empty) are the consumer's; the card is format-agnostic.
- `[CODE]` **Status is a chip, not a field** — the live consumers deliberately render status as a projected `<falcon-status-chip>` (templates-details.component.html:95/105) rather than a plain text value, so the business status carries its colour semantics. A builder should follow this (don't flatten a status into a plain `value` string).

## Business flows using this component

| Flow | Page | Role of the component in the flow |
|---|---|---|
| View template details | templates-page (admin-console) | Read-only "Template details" card: provenance + 4-dimension status + projected status chips + Shared-With multi-select. |
| View template details | templates-page (management-console) | Same — client-facing parity. |
| Create template (wizard) | templates-page → wizard Step 3 (admin) | Read-only review of Steps 1-2 before the §9.4 submit. |
| Create template (wizard) | templates-page → wizard Step 3 (mgmt) | Same — client-facing parity. |

## Business gotchas

- `[CODE]` **It does not translate** — passing an i18n key as a `value`/`label`/`title` shows the raw key to the operator. The live consumers translate in TS (`this.i18n.translate(k)`, templates-details.component.ts:190) or pipe `[title]` in the template. A business-visible bug if a builder forgets and passes a key.
- `[CODE]` **Status colour lives in the projected chip, not the card** — if a builder adds a status as a plain `[fields]` value, it loses the colour semantics the business relies on. Project a `<falcon-status-chip>` instead.
- `[CODE]` **`fullWidth` is the only span control** — a long business value (e.g. a Shared-With list, an address) must be flagged `fullWidth` or it clips in a normal column. The live Shared-With multi-select is a full-width projected cell.
- `[INFERRED]` **Low blast radius today** (Templates-only) but it is a shared primitive — restyling it ripples to any future "details/review" adopter; treat changes as shared-component changes.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25) — the read-only/display-only contract (ts:11/20), pre-resolved-value pattern (`infoFields(tpl)`, templates-details.component.ts:189-213), the §9.4 review use (step3-share-submit.component.html:1-13), and status-as-projected-chip (templates-details.component.html:88-109) all re-confirmed in live source. Business *rules* (BRD §11.2 fields, PRD §9.4 review gate) cross-referenced from the consumer comments; the card itself enforces none — it is a presentation surface for the Templates feature.
