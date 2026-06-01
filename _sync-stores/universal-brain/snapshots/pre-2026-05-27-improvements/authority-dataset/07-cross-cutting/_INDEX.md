---
type: index
cluster: 07-cross-cutting
verified-at: 2026-05-16
purpose: "Answers 'what concerns cut across all features (gateway routing, session shape, PRD drift, test users)'. Open when wiring backend, debugging auth, or seeding the local stack."
---

# 07-cross-cutting - Concerns that span features

> [!tldr]
> 4 files. Each answers a question whose scope spans every feature in the system - so they don't fit inside a single feature cluster. Keep this small; expand only when a new fact is truly cross-feature.

## Contents

| File | Answers | When to open |
|---|---|---|
| [gateway-routing-map.md](gateway-routing-map.md) | "Which gateway routes which client?" | Wiring a new endpoint, debugging 404s |
| [permission-sheet-gaps.md](permission-sheet-gaps.md) | "Where does PRD disagree with code?" | PR review, role-catalog refresh |
| [session-shape.md](session-shape.md) | "What's in the session blob the FE consumes?" | Building a new page that reads session |
| [test-users.md](test-users.md) | "What test users + passwords exist locally?" | Local stack setup, smoke test |

## See also

- `01-roles/` - the runtime role catalog (referenced by permission-sheet-gaps)
- `03-pes-keys/` - the PES key registry (referenced by every file here)
- `15-implementation-pitfalls/` - traps that pull from these cross-cutting facts
