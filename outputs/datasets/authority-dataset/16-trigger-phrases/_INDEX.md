---
type: index
cluster: 16-trigger-phrases
purpose: Consolidated reference card for every trigger phrase that auto-loads dataset context
extracted: 2026-05-16
---

# Trigger Phrases — Consolidated Index

> [!tldr]
> Every trigger phrase a Claude session can use to auto-load the right slice of the authority dataset. ~45 phrases organized by use case. Paste any one of these into a new session and it loads the relevant SoT files via the documented load order.

## 1 · "Tell me about the dataset" (orient)

| Phrase | Auto-loads |
|---|---|
| `falcon vs client` | `00-INDEX` + `Falcon-vs-Client` vault note + `MATRIX.md` |
| `authority dataset` | Same — full orientation |
| `who can see what` | `Roles` vault note + `MATRIX.md` |
| `what is the authority spec` | `KNOWLEDGE-DUMP.md` (the polished 30-page doc) |
| `show me the dataset structure` | `00-INDEX` + folder map |

## 2 · "Who can do X?" (role lookups)

| Phrase | Auto-loads |
|---|---|
| `full action inventory for sys-admin` | `05-capability-maps/sys-admin.capability.md` |
| `full action inventory for sys-ops` | `05-capability-maps/sys-ops.capability.md` |
| `full action inventory for sys-products` | `05-capability-maps/sys-products.capability.md` |
| `full action inventory for acc-owner` | `05-capability-maps/acc-owner.capability.md` |
| `full action inventory for acc-admin` | `05-capability-maps/acc-admin.capability.md` |
| `full action inventory for acc-user` | `05-capability-maps/acc-user.capability.md` |
| `can a client X` | drill into `MATRIX.md` + relevant role note |
| `what can falcon do that client cannot` | `MATRIX.md` § Falcon-only |
| `what can acc-user see` | `acc-user.capability.md` (TL;DR: only contact-groups) |

## 3 · "What about feature F?" (per-feature lookups)

| Phrase | Auto-loads |
|---|---|
| `what V-rules apply to <feature>` | `06-validation-by-feature/MATRIX.md` |
| `what entity drift on <feature>` | `08-entity-drift-by-feature/MATRIX.md` |
| `what business rules govern <feature>` | `09-business-rules-by-feature/MATRIX.md` |
| `what hides UI besides PES on <feature>` | `10-non-pes-gates-by-feature/MATRIX.md` |
| `what error codes does <feature> surface` | `13-error-catalog/CATALOG.md` § by-feature |
| `compare <feature> admin vs mgmt` | `04-feature-parity-matrix/<feature>.compare.md` |

## 4 · "How do I implement Y?" (port + implementation)

| Phrase | Auto-loads |
|---|---|
| `copy <feature> from admin to mgmt` | `11-copy-playbook/copy-admin-feature-to-mgmt.md` + 6 checklists |
| `implement Add Client wizard` | `14-flow-playbook-integration/Add-Client.integration.md` + Brain Outputs flow playbook folder |
| `implement Add User` | `14-flow-playbook-integration/Add-User.integration.md` + Brain Outputs flow playbook |
| `implement Add Node` / `implement Edit Node` | `14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md` |
| `who can run Add User` | `Add-User.integration.md` (3-actor-path clarification) |
| `Add Client V-rules` | `Add-Client.integration.md` + V-rule MATRIX footnote `[^c]` |
| `namespace flip checklist` | `11-copy-playbook/namespace-flip.checklist.md` |
| `gateway flip checklist` | `11-copy-playbook/gateway-flip.checklist.md` |

## 5 · "How do I error-handle?" (FE contract)

| Phrase | Auto-loads |
|---|---|
| `frontend error contract` | `13-error-catalog/FE-CONTRACT.md` |
| `how do I display errors` | `FE-CONTRACT.md` § HTTP status → UX mapping |
| `what status code means what` | `CATALOG.md` § code grouping by HTTP status |
| `lockout cascade` | `CATALOG.md` § defensive patterns |
| `payment poll timeout` | `CATALOG.md` § defensive patterns (30-min upper bound) |

## 6 · "What should I avoid?" (pitfalls + anti-patterns)

| Phrase | Auto-loads |
|---|---|
| `implementation pitfalls` | `15-implementation-pitfalls/PITFALLS.md` |
| `what anti-patterns should I avoid` | `15-implementation-pitfalls/ANTI-PATTERNS.md` |
| `pre-port grep checklist` | `ANTI-PATTERNS.md` § grep commands |
| `if I see broken UI for X` | `PITFALLS.md` § cheat sheet |
| `what to NOT copy from old UI` | `ANTI-PATTERNS.md` § replacement table |

## 7 · "Refresh / audit" (Phase 5 scanner)

| Phrase | Auto-loads |
|---|---|
| `audit drift` | runs `falcon-wiki/scripts/scan-authority.ps1 -CheckOnly` |
| `refresh authority dataset` | same |
| `refresh authority dataset Phase 0` | re-run Phase 0 (foundation) |
| `refresh feature parity matrix` | re-run Phase 1 |
| `refresh validation by feature` | re-run Phase 2 § 06 |
| `refresh entity drift by feature` | re-run Phase 2 § 08 |
| `refresh business rules by feature` | re-run Phase 2 § 09 |
| `refresh non-pes gates by feature` | re-run Phase 2 § 10 |
| `audit PES vs PRD sheet drift` | **BLOCKED** — `07-cross-cutting/permission-sheet-gaps.md` |

## 8 · "Operational" (test users + login)

| Phrase | Auto-loads |
|---|---|
| `seeded test user credentials` | `07-cross-cutting/test-users.md` |
| `how to log in locally` | `Local-Auth-Recipe` (sister cluster) |
| `which test users exist` | `Test-Users` vault note |
| `JWT shape` / `session shape` | `07-cross-cutting/session-shape.md` |
| `gateway routing` | `07-cross-cutting/gateway-routing-map.md` |

## 9 · "Continue work"

| Phrase | What happens |
|---|---|
| `continue authority dataset` | Resume from where the last session left off (memory-driven) |
| `update authority dataset to v7.X` | Regenerate PDF via `_pdf-build/build-pdf.js` |

## How to use this list

1. Open a fresh Claude session
2. Paste a phrase from one of the 9 categories above
3. Claude (or any agent) reads the matching files and orients itself
4. Ask the actual question

The dataset's strength is that **no single phrase loads everything** — each phrase targets a slice. Use the right slice for the question, not the whole dataset.

## See also

- `00-INDEX.md` — phase status + use-the-dataset guide
- `00-VERIFICATION-GATE.md` — 19 questions that prove the dataset answers them
- Memory entry: `project_authority_dataset_2026_05_16.md` (in `~/.claude/projects/C--Falcon/memory/`)
