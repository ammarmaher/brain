---
type: index
cluster: 18-a-to-z-traces
purpose: "Index of feature-level A→Z traceability documents. Each trace walks ONE feature from business intent through 18 implementation layers."
---

# Cluster 18 — A→Z Traceability Traces

## TL;DR

Per-feature **A→Z trace documents**. Each trace takes one Falcon feature and walks it through 18 implementation layers — business intent, PRD, permissions, business rules, validations, entities, backend, frontend, tests, verification — citing every layer from a single primary source. Use a trace as the **single document** to read when you need a complete picture of one feature: which BRs apply, which DTOs are touched, which roles can run it, which error codes can fire, which i18n keys to author, which test scenarios to write.

The trace is the **canonical template**: when adding a new feature documentation, copy the shape of `Add-Client.trace.md` and fill the 18 layers from that feature's primary sources.

## Traces available

| Feature | Status | File | Lines | Last updated |
|---|---|---|---|---|
| Add Client wizard | 🟢 EXEMPLAR | [Add-Client.trace.md](Add-Client.trace.md) | 1029 | 2026-05-16 |
| Add User wizard | 🟢 COMPLETE | [Add-User.trace.md](Add-User.trace.md) | 1041 | 2026-05-16 |
| Add Node | 🟢 COMPLETE | [Add-Node.trace.md](Add-Node.trace.md) | 899 | 2026-05-16 |
| Edit Node | 🟢 COMPLETE | [Edit-Node.trace.md](Edit-Node.trace.md) | 979 | 2026-05-16 |
| Create Contact Group wizard | 🟡 TODO | (not yet authored) | — | — |
| Add Contract wizard | 🟡 TODO | (not yet authored) | — | — |
| Transfer Balance | 🟡 TODO | (not yet authored) | — | — |
| Do Payment (CommChannel) | 🟡 TODO | (not yet authored) | — | — |

## The 18-layer model

Every trace document MUST cover these 18 layers in this order. Each layer is uniquely determined by the one above (see the "traceability backbone" section in any trace).

| # | Layer | Question it answers |
|---|---|---|
| 1 | **Business intent** | What user need does this serve? |
| 2 | **PRD requirement** | Which PRD lines authorize this flow? |
| 3 | **Permission gate** | Who can run it (role × resource × action)? |
| 4 | **BR-* business rules** | What cross-field / workflow rules apply? |
| 5 | **V-rules per step** | What field-level validation rules govern each step? |
| 6 | **E-* entity drift** | Which entities does this create + drift items? |
| 7 | **Backend DTOs** | Composite request shape + `[ThrowIf*]` attributes |
| 8 | **Backend endpoint + handler** | Route + controller + handler flow |
| 9 | **FluentValidator + handler-time gate** | What runs server-side after `[ThrowIf*]`? |
| 10 | **Kafka events** | What downstream events fire on success? |
| 11 | **Error codes** | Every `FalconKeys.Error.*` that can surface |
| 12 | **FE route + PES gate** | Route path + `data.access` + `FalconAccess.*` key |
| 13 | **FE components** | Falcon UI Core components used per step |
| 14 | **FE form + state** | NgForm/FormGroup choice per step + state machine |
| 15 | **FE i18n keys** | Translation keys (en + ar resolutions) |
| 16 | **Test case (Gherkin)** | 5+ scenarios with realistic assertions |
| 17 | **Port artifact** | Where it lives in admin-console; does it port to mgmt? |
| 18 | **Capability map per role** | 6 roles × can-run verdict |

Each layer must end with **cross-reference citations**: every fact source-prefixed with `[VAULT]`, `[BRAIN-OUT]`, `[CODE]`, `[MEMORY]`, or `[INFERRED]`.

## How to use a trace

### As a developer about to implement a feature

1. Load the trace for your target feature (or `Add-Client.trace.md` as the template if no trace exists yet).
2. Drill through layers 3–6 to understand who can run it + what rules apply.
3. Drill through layers 7–10 to understand the backend contract.
4. Drill through layers 12–14 to understand the frontend wiring.
5. Use layer 16 as the basis for your acceptance test.
6. Check layer 18 to confirm your understanding of role boundaries.

### As an auditor checking compliance

1. Start at layer 18 (what does each role actually get to do?).
2. Trace back upward to find the layer that authorizes the verdict — usually layer 4 (BR) or layer 2 (PRD).
3. Check that all 3 gates of layer 3 (FE visibility + gateway PES + backend `[Authorize]`) are in place.
4. Confirm runtime status — has this been ✋ runtime-verified, or only 🟢 spec-verified?

### As a Brain SK / AI agent picking up a task

1. Read the trace front-to-back to ground your context.
2. Confirm you can answer the 8 verification questions from `[BRAIN-OUT] Add Client/README.md:54`.
3. If the trace doesn't exist for the target feature, author one **before** writing any code.

## How to add a new trace

1. **Copy** `Add-Client.trace.md` as your template.
2. **Replace the YAML frontmatter** with your feature's name + extracted date.
3. **Rewrite each layer** from the target feature's primary sources (its folder under `[BRAIN-OUT] understanding/pages/<page>/<flow>/` or its single-file playbook under `flows/`).
4. **Source-prefix every fact** — `[VAULT]` / `[BRAIN-OUT]` / `[CODE]` / `[MEMORY]` / `[INFERRED]`. Inferred bridges should be marked explicitly.
5. **Mark uncovered layers honestly** — if a layer has no source, write `(no source — needs investigation)` rather than fabricate.
6. **Add a row** to the "Traces available" table above with the file link + line count.
7. **Cross-link** from your trace's "See also" section back to this index.

### Trace authoring checklist

- [ ] YAML frontmatter (`type: a-to-z-trace`, `feature`, `trace-depth: 18 layers`, `extracted`)
- [ ] TL;DR (2 sentences max — what the feature does + why this trace exists)
- [ ] 18-layer table at a glance
- [ ] One section per layer (18 sections)
- [ ] Every fact source-prefixed
- [ ] Runtime verification status (per-layer 🟢/🟡/🔴/✋ verdict)
- [ ] Traceability backbone diagram (how N+1 follows from N)
- [ ] Cross-references to the source playbook, authority dataset clusters, Brain SK vault, and memory standing rules

## Why this cluster exists

The authority dataset's other clusters (01-roles, 02-statuses, 03-pes-keys, 06-validation-by-feature, 08-entity-drift-by-feature, 09-business-rules-by-feature, 13-error-catalog, 14-flow-playbook-integration) are **cross-cuts** — they slice the platform by one axis (roles, error codes, V-rules, etc.).

This cluster (18-a-to-z-traces) is a **per-feature view** — it gathers everything those cross-cuts say about ONE feature into one document. It complements the cross-cuts:

- A cross-cut answers "which features use V-rule X?" (read from cluster 06)
- A trace answers "which V-rules + BRs + DTOs + errors + Kafka topics + routes + components apply to feature Y?" (read from cluster 18)

Both are needed. Cross-cuts are how you change a rule globally (e.g. "update V-username cap"). Traces are how you implement or audit a single feature end-to-end.

## Source-prefix legend

| Prefix | Meaning | Examples in this dataset |
|---|---|---|
| `[VAULT]` | Typed note in `Brain SK/_obsidian/` (canonical V-rule + E-* + page graph) | `[VAULT] V-account-name-format-uniqueness.md:23` |
| `[BRAIN-OUT]` | Brain Outputs file (PRD, understanding folder, dataset cluster) | `[BRAIN-OUT] Add Client/00-OVERVIEW.md:30` |
| `[CODE]` | Actual source code under `Falcon/<service>/` | `[CODE] BuiltInRoleCatalog.cs:87` |
| `[MEMORY]` | Shared agent memory under `_mounts/memory/` | `[MEMORY] feedback_library_skeleton_app_api.md` |
| `[INFERRED]` | Bridge / reasoning by the trace author — MUST be flagged so the reader can sanity-check |
| `(no source — needs investigation)` | A layer that has no documented source; explicit gap |

## Cross-references

### Authority dataset (sibling clusters)

- [`../00-INDEX.md`](../00-INDEX.md) — dataset entry point
- [`../00-VERIFICATION-GATE.md`](../00-VERIFICATION-GATE.md) — 10 verification questions
- [`../01-roles/`](../01-roles/) — per-role PES rule lists
- [`../02-statuses/`](../02-statuses/) — entity state machines (account-creation-status, user-status, etc.)
- [`../03-pes-keys/REGISTRY-RAW.md`](../03-pes-keys/REGISTRY-RAW.md) — full PES key universe
- [`../04-feature-parity-matrix/MATRIX.md`](../04-feature-parity-matrix/MATRIX.md) — 7 features × roles
- [`../05-capability-maps/_INDEX.md`](../05-capability-maps/_INDEX.md) — per-role action enumeration
- [`../06-validation-by-feature/MATRIX.md`](../06-validation-by-feature/MATRIX.md) — V-rules × features
- [`../07-cross-cutting/`](../07-cross-cutting/) — gateway routing, JWT claims, etc.
- [`../08-entity-drift-by-feature/MATRIX.md`](../08-entity-drift-by-feature/MATRIX.md) — E-* entities × features
- [`../09-business-rules-by-feature/MATRIX.md`](../09-business-rules-by-feature/MATRIX.md) — BR-* × features
- [`../10-non-pes-gates-by-feature/MATRIX.md`](../10-non-pes-gates-by-feature/MATRIX.md) — other gating axes
- [`../11-copy-playbook/`](../11-copy-playbook/) — port-by-port migration playbook
- [`../13-error-catalog/CATALOG.md`](../13-error-catalog/CATALOG.md) — 130-code catalog
- [`../14-flow-playbook-integration/`](../14-flow-playbook-integration/) — per-flow authority-lens integration
- [`../15-implementation-pitfalls/`](../15-implementation-pitfalls/) — known traps
- [`../16-trigger-phrases/`](../16-trigger-phrases/) — how to phrase a task for the right routing

### Flow playbooks (Brain Outputs — the canonical source for any new trace)

- [`Brain Outputs/understanding/pages/organization-hierarchy/Add Client/`](../../../understanding/pages/organization-hierarchy/Add%20Client/) — folder form (17 files)
- [`Brain Outputs/understanding/pages/organization-hierarchy/flows/Add User.md`](../../../understanding/pages/organization-hierarchy/flows/Add%20User.md) — single file
- [`Brain Outputs/understanding/pages/organization-hierarchy/flows/Add Node.md`](../../../understanding/pages/organization-hierarchy/flows/Add%20Node.md) — single file
- [`Brain Outputs/understanding/pages/organization-hierarchy/flows/Edit Node.md`](../../../understanding/pages/organization-hierarchy/flows/Edit%20Node.md) — single file

### Brain SK vault hubs

- `[VAULT] _obsidian/00-Home/IMPLEMENTATION_KNOWLEDGE_MAP.md` — top-of-session entry point
- `[VAULT] _obsidian/00-Home/AI-Agent-Onboarding.md` — agent retrieval contract
- `[VAULT] _obsidian/00-Home/VALIDATION_INDEX.md` — 25 V-rule index
- `[VAULT] _obsidian/00-Home/API_INDEX.md` — E-* entity index
