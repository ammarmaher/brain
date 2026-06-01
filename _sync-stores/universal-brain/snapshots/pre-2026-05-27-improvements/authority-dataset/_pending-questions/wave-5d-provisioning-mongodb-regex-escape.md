---
type: pending-question
fork-id: F-004 (entity drift — input sanitization)
wave: 5d
halted-at: 2026-05-17T+03:00
night-shift-batch: forever-wave-2026-05-17
related-controller: LookupController
related-file: "Brain Outputs/understanding/backend/provisioning/controllers/LookupController/VALIDATIONS.md"
---

# Fork: LookupController — MongoDB LINQ regex metacharacter safety

## Why halted

`LookupController GET /api/lookup-values?name=<string>` passes the filter string into a LINQ `Contains` expression that compiles to a MongoDB `$regex` match. If the .NET MongoDB LINQ translator does NOT auto-escape regex metacharacters (`.`, `*`, `+`, `?`, `[`, `]`, `^`, `$`, `|`, `(`, `)`), a caller passing `name=.*` becomes an unbounded wildcard and leaks all records. PRD-01 Add Client wizard calls this endpoint to populate CommChannel/Application dropdowns — a client-controlled `name` parameter could be abused.

## Sources reviewed

- `[CODE]` `LookupController.cs` — parameter passed to handler
- `[CODE]` `ListLookupQuery.cs` — LINQ `Contains` usage
- `[CODE]` `Falcon.Provisioning.Infrastructure` — MongoDB LINQ provider version
- `[INFERRED]` .NET MongoDB.Driver 2.x LINQ translator behavior on special chars (not confirmed from source)

## Plausible answers

**A** — The MongoDB.Driver LINQ translator escapes metacharacters automatically (`$regex` is constructed with `Regex.Escape`). No action needed beyond existing length cap.

**B** — The translator does NOT escape. A `Regex.Escape(name)` call must be added in `ListLookupQueryHandler` before the LINQ expression, or the query must be rewritten to use `BsonRegularExpression` with explicit escaping.

## Recommended question for the human

"Does `ListLookupQueryHandler` in `falcon-core-provisioning-svc` apply `Regex.Escape` (or equivalent) to the `name` filter before passing it to MongoDB? Yes → A (no action); No → B (fix needed)."

## Blast radius

- Security: low-severity information disclosure (lookup catalog is read-only and not sensitive PII). Non-blocking for MVP.
- Correctness: searching for `name=.` would match all records silently — could confuse UX.
- Action if B: one-line fix in handler; no schema change.
