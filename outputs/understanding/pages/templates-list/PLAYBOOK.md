*** Templates List — Playbook ***
*** Blocked on backend · 2026-05-18 ***

# Templates List — Playbook

## TL;DR

List view for message templates per CommChannel. Implements Maker/Checker governance (Maker creates+submits, Checker approves/rejects). WhatsApp templates also pass through Meta external approval. **Backend CRUD endpoints DO NOT EXIST today (GAP-T-001)** — only 3 channel-config endpoints documented. PRD-05 is only 25% mined.

## Sections

1. Permissions — role matrix unclear on Checker assignment (Q-TM-CHECKER-ROLE).
2. List table — 10 columns with status pill + Meta secondary pill.
3. Filters — status / channel / category / language / search / date.
4. Empty states — 5 variants.
5. Create entry — channel-picker → routes to per-channel wizard.
6. Validations — V-rules at Create wizard (not list).
7. Backend API — **9 endpoints missing**, only 3 config endpoints exist.
8. Components — `<falcon-data-table>`, `<falcon-tag>`, `<falcon-select>` etc.
9. Kafka — proposed `templates.*` topics (none exist today).
10. State FSM — 6 states + Meta substates.
11. Errors — proposed FalconKeys.
12. Gaps — GAP-T-001 critical, Q-TM-CHECKER-ROLE, Q-TM-PRD-COVERAGE.

## Hubs

[[05 Templates]] · [[Templates Service]] · [[Contact Groups List]] · [[Create Template WhatsApp Flow]]
