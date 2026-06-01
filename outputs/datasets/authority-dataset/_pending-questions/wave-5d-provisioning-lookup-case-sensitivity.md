---
type: pending-question
fork-id: F-001 (PRD cap vs backend behavior — FE enforces tighter)
wave: 5d
halted-at: 2026-05-17T+03:00
night-shift-batch: forever-wave-2026-05-17
related-controller: LookupController
related-file: "Brain Outputs/understanding/backend/provisioning/controllers/LookupController/FRONTEND_CONTRACT.md"
module: cross-cutting
feature: lookup-search
verification: unverified
last-verified: 2026-05-17
tags: ["#status/open", "#module/cross-cutting", "#verification/unverified", "#layer/be"]
up: "[[Q-tickets-MOC]]"
parent: "[[Q-tickets-MOC]]"
tracked-as-task: true
priority: medium
due: 
blocked-on: [prd-clarification]
---

# Fork: LookupController search is case-sensitive, PRD implies case-insensitive

## Why halted

`GET /api/lookup-values?name=<string>` compiles to a case-sensitive MongoDB `$regex` match (LINQ `Contains` default on string fields with no collation set). The Add Client wizard Step 3 CommChannel picker and Step 4 Application picker use this endpoint for search. PRD-01 (Add Client) does not explicitly state case-sensitivity for search, but standard Arabic + English UX convention expects case-insensitive matching — a user typing "whatsapp" should find "WhatsApp".

## Sources reviewed

- `[CODE]` `ListLookupQuery.cs` — no `CollationStrength` or `$options: "i"` set
- `[CODE]` `LookupController.cs` — no preprocessing of search string
- `[PRD]` `01-account-management/latest-prd.md` — silent on case-sensitivity
- `[INFERRED]` UX convention for search fields in the Falcon UI

## Plausible answers

**A** — Case-insensitive is required. Fix: add `.Options("i")` to the MongoDB regex or set `Collation(new Collation("en", strength: CollationStrength.Secondary))` on the query. No schema migration needed.

**B** — Case-sensitive is acceptable (lookups are always Falcon-seeded and users know the correct casing). No action.

**C** — FE works around it by lowercasing the search input before submitting. Acceptable short-term; backend fix preferred long-term.

## Recommended question for the human

"Should the CommChannel/Application name search in the Add Client wizard be case-insensitive (A), or is case-sensitive search acceptable because lookup values are Falcon-seeded with consistent casing (B)?"

## Blast radius

- Cosmetic UX issue; non-blocking for MVP.
- If A: one-line backend fix + one API integration note in FE contract.
- If C: one-line FE fix.

## Tasks-plugin tracking

- [ ] [[wave-5d-provisioning-lookup-case-sensitivity]] Fork: LookupController search is case-sensitive, PRD implies case-insensitive 🔼 #blocked-on/prd-clarification
