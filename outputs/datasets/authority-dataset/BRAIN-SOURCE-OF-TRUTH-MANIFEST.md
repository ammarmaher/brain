---
type: source-of-truth-manifest
title: Falcon Brain — Source-of-Truth Manifest (the one doc that says what is canonical)
created: 2026-05-28
purpose: "Declare, per knowledge type, the ONE canonical source + its derived artifacts + the regeneration chain + the drift policy. Resolves the multi-representation fragmentation that accumulated across 14 graph waves + the improvement plan."
companions: 0-MASTER-INDEX.md (routing) · VERIFICATION-STATUS.md (trust) · BRAIN-ARCHITECTURE-CHART.md (shape)
status: ADOPTED
---

# Falcon Brain — Source-of-Truth Manifest

> [!important]
> **The rule:** every knowledge type has exactly ONE canonical source. Everything else is a *derived artifact* that must be regenerable from that source. If a derived artifact disagrees with its source, the source wins and the artifact is stale. This manifest names the source, the derivations, the regen command, and the drift policy for each type.

## 1. The SoT hierarchy (top = ultimate truth)

```
LEVEL 0  Falcon product code (falcon-web-platform-ui + falcon-core-*-svc)
            │ scanned by component/backend scan skills
            ▼
LEVEL 1  Brain Outputs/understanding/  ← CANONICAL knowledge (dossiers)
            │ + Validations.xlsx (validation SoT, post-2026-05-24 flip)
            │ + PRD Modules (business SoT)
            │ + Authority Dataset (permission/PES SoT)
            ▼
LEVEL 2  falcon-wiki/200-Graph/graph/wave-deltas/*.json  ← graph (derived from L1)
            ▼
LEVEL 3  component-capability-feed.json  ← tooling feed (derived from L2 + L1)
            ▼
LEVEL 4  HTML report · MATRIX dataview · Obsidian notes  ← views (derived from L1-L3)
```

**Golden rule:** knowledge flows DOWN only. A derived level (2,3,4) never becomes the source. If level 4 is wrong, fix level 1 and regenerate.

## 2. Per-knowledge-type SoT table

| Knowledge type | CANONICAL source (the SoT) | Derived artifacts | Regenerate via | Drift policy |
|---|---|---|---|---|
| **Validation rules** | `Source_of_truth_theme/Validations.xlsx` (xlsx wins over PRD per 2026-05-24 flip) | V-rule notes · 06-validation MATRIX · graph ValidationRule nodes · capability-feed (none) | `/brain-resync-validation` | xlsx changes → re-run resync → V-rules flagged NEW/MODIFIED/STALE |
| **Component capability** | `Brain Outputs/understanding/frontend/components/<comp>/API.md` (per Brain SK CLAUDE.md canonical path) | `component-capability-feed.json` · graph Component nodes · Obsidian 60-Components notes | `build-capability-feed.js --merge` | API.md changes → re-run feed builder → drift check vs wave-011 |
| **Backend endpoints/DTOs** | `Brain Outputs/understanding/backend/<svc>/ENDPOINT_REGISTRY.md + DTO_DICTIONARY.md` | BE↔FE mesh graph · wave-012.json · HTML Ch.05 | (manual wave; needs a generator) | code change → re-scan service dossier |
| **Business rules** | `Brain Outputs/prd/modules/<m>/BUSINESS_RULES.md` (canonical PRD) | BR-* graph nodes · BR_ENFORCER_MAP.md · 09-business MATRIX | (manual wave; needs a generator) | PRD change → re-extract BR-* |
| **Permissions / PES** | `falcon-access.registry.ts` (FE) + `BuiltInRoleCatalog.cs` (BE) — code is SoT | Authority Dataset 03-pes-keys · PES graph nodes · capability maps | scanner (`scan-authority.ps1`) | scanner watches these 2 files → drift flagged |
| **Design tokens** | `libs/falcon-theme/src/falcon-tailwind-tokens.css` + per-component `*.tokens.css` (code) | `40-Tokens/INDEX.md` · 140-token registry · capability-feed `tokens` field | (manual; Wave 11 agent) | token CSS change → re-extract |
| **Architecture decisions** | `falcon-wiki/Home/Software-Architecture-Design/*` + `Brain SK/_obsidian/35-Architecture/` (8 ADRs) | ARCHITECTURE_ADHERENCE_REPORT.md · graph ArchitectureRule nodes | (manual; Wave 14 agent) | ADR added → re-audit adherence |
| **Auth / local-dev** | `falcon-wiki/00-MOCs/` (operational) + Security-Architecture.md (architectural) | service notes · graph | manual | MOC is operational SoT; arch wiki wins on conflict |
| **Graph (the connections)** | the wave-delta JSONs (`wave-deltas/*.json`) ARE the graph source-of-record | `nodes.json` baseline · CSV · HTML report · Bases | Wave 15 consolidation (DEFERRED) | ⚠️ NOT consolidated — see §4 risk #1 |
| **Session state** | `universal-brain/state/current-task.json` + `progress-log.md` | restore packet · HTML capability log | live | file-backed; chat memory never wins |

## 3. What is genuinely SINGLE-SOURCED today (the wins)

✅ **Validation** — xlsx is unambiguously the SoT; REPLACES edges encode supersession; `/brain-resync-validation` regenerates. Clean.
✅ **Component capability** — `API.md` dossiers are canonical; the feed has a *generator with a drift check* (`build-capability-feed.js` cross-checks vs wave-011). This is the cleanest derived-artifact chain in the brain.
✅ **Permissions** — code (`falcon-access.registry.ts` + `BuiltInRoleCatalog.cs`) is SoT; the scanner watches both files for drift. 21/21 runtime-verified.
✅ **Session state** — file-backed, `current-task.json` is the one truth; chat memory explicitly subordinate.

## 4. Where SoT is FORKED or RISKY (the honest disadvantages)

### Risk #1 — Graph not consolidated (HIGH)
The graph lives in **15 files**: `nodes.json`/`edges.json` (Wave 1 baseline) + 13 `wave-deltas/wave-NNN.json`. There is no single master. To answer "what's the full graph?" you must mentally merge 15 files. **Wave 15 (the consolidation) was deferred.** → Fix: run Wave 15 to produce one master `nodes.json` + `edges.json`, keep deltas as history.

### Risk #2 — Component knowledge exists in 4 places (MEDIUM)
1. `understanding/frontend/components/<comp>/` (canonical dossiers — SoT)
2. `component-capability-feed.json` (derived — has generator ✓)
3. graph Component nodes (derived — manual)
4. `Brain SK/_obsidian/60-Components/` notes (derived — manual, can go stale)
→ Fix: declare #1 the only SoT (done here); make #2 the only tooling consumer; treat #3/#4 as views that regenerate, never edit by hand.

### Risk #3 — HTML report + MATRIX are point-in-time snapshots (MEDIUM)
The 11-chapter HTML report and the static-fallback MATRIX tables embed numbers that go stale the moment code changes. They are VIEWS, not sources. → Fix: regenerate the report from data (never hand-edit); the Dataview MATRIX live-query already self-updates — prefer it over the static fallback.

### Risk #4 — Most regeneration is MANUAL (MEDIUM)
Only validation (`/brain-resync-validation`) and the component feed (`build-capability-feed.js`) have real generators. Backend dossiers, BR extraction, token extraction, graph deltas are all hand-built per wave. → Fix: build a generator per knowledge type + one `rebuild-brain` orchestrator.

### Risk #5 — No automated code→dossier→graph→feed drift detection (MEDIUM)
The scanner watches 67 source files, but a change there does not automatically mark the downstream dossier/graph/feed as stale. → Fix: extend the scanner to emit a "stale derived artifacts" list on drift.

### Risk #6 — FE execution still blocked (HIGH, known)
40+ Stencil/Angular compile errors. Knowledge ≠ ability to ship. Tracked; routed to `ammar-web-platform-ui`.

## 5. Best practice we HAVE (keep doing)

| Practice | Where it's working |
|---|---|
| Source-prefix discipline | every Falcon claim cites `[CODE]/[BRAIN-OUT]/[VAULT]/[BRAIN-SK]/[MEMORY]/[INFERRED]` |
| Derived-artifact generator with drift check | `build-capability-feed.js` (the model to copy) |
| Evidence-only graph edges | no inferred-only edges asserted across 14 waves |
| Snapshot before destructive batch | `universal-brain/snapshots/` |
| Append-only progress log | `progress-log.md` never edits prior entries |
| Verification ladder honesty | build-green never promoted to runtime-verified |
| xlsx-over-PRD SoT with REPLACES edges | validation supersession is provenanced |

## 6. Best practice we NEED (the gap list)

| # | Need | Why | Effort |
|---|---|---|---|
| 1 | **One `rebuild-brain` orchestrator** | regenerate every derived artifact from L1 sources in one command | 1 day |
| 2 | **Graph consolidation (Wave 15)** | one master graph file, not 15 | 1.5 hr |
| 3 | **A generator per knowledge type** | backend / BR / tokens currently hand-built (drift-prone) | 1 day each |
| 4 | **Code→derived drift detection** | scanner should flag stale dossiers/feed/graph on source change | 0.5 day |
| 5 | **Report-as-build** | HTML report regenerated from data, never hand-edited | 0.5 day |
| 6 | **Deprecate duplicate component notes** | Obsidian 60-Components becomes a view, not a parallel source | 0.5 day |
| 7 | **This manifest enforced in CI** | a check that derived artifacts match their source | 0.5 day |

## 6b. STATUS — rebuild pipeline now EXISTS (2026-05-28)

Best-practice needs #1 + #2 are now DELIVERED:

| Need | Status | Artifact |
|---|---|---|
| #1 one `rebuild-brain` orchestrator | ✅ BUILT + RAN | `graph/rebuild-brain.js` — 8 steps, 0 errors, 7.1s |
| #2 graph consolidation (Wave 15) | ✅ BUILT + RAN | `graph/consolidate-graph.js` → master `nodes.json`+`edges.json` |

**The one command** (regenerate every derived artifact from canonical sources):
```
cd falcon-wiki/200-Graph/graph && node rebuild-brain.js
```
Runs in dependency order: consolidate-graph → capability-feed (merge + validate) → xlsx-resync → implicit-edges → trust-scores → purpose-overlay → verify-evidence. Non-fatal per step (a broken generator is reported, not fatal). Report → `REBUILD-REPORT.json`.

**First rebuild surfaced "69 modified" — investigated, RESOLVED as artifacts (not real drift):**
- The 69 were investigated before any bulk-mutate (best practice on a >50%-of-set flag). Root cause: the comparator did raw string `!==` with no normalization, AND ignored the separate `Allowed Special Char` xlsx column.
- Fixed `resync-xlsx.js` (5 edits): semantic normalizer (Mandetory≡Yes, `(2-30) Char`≡`2-30`, separator-agnostic) + dropdown-prefix strip + Allowed-Special-Char column read.
- **VERDICT: 0 of 69 were real semantic drift.** All were comparator/schema-read/verbose-prose artifacts. **No V-rule file was regenerated** (snapshot `pre-vrule-regen-2026-05-28/` stayed pristine, proving none needed it). Full analysis: `falcon-wiki/200-Graph/VRULE-DRIFT-RECONCILIATION-2026-05-28.md`.
- LESSON: a >50% drift flag is almost always a comparator/schema bug — fix the comparator (5 edits), not the N files (69 churned).
- trust overlay: runtime=70 · code=20 · structural=574 · unverified=43
- purpose overlay: 518/707 nodes annotated

### Honest reconciliation finding (new SoT item)
The rebuild revealed **two ingestion paths count the graph differently**:
- `consolidate-graph.js` (array-merge of explicit nodes) → **233 nodes / 370 edges** (individually-materialized)
- `query.js` + overlay scripts (cluster-aware ingestion) → **707 nodes** (includes cluster-placeholder + summary nodes)

Neither is wrong — they count different things. **Resolution (follow-up):** make `consolidate-graph.js` and `query.js` share one ingestion module so "how many nodes?" has ONE answer. Until then: 233 = explicit graph elements; 707 = explicit + cluster-placeholders + overlay-tracked. The historical "1,462 / 5,209" figures were summary-aggregate counts (e.g. "~600 HAS_INPUT edges" never enumerated individually).

## 7. The single rule that fixes most of it

**"Derived artifacts must be generated, never authored."** Today the capability-feed obeys this (it has `build-capability-feed.js`). Everything else should follow that model: if a human hand-edits a MATRIX, a graph node, or a report number, it's a SoT violation — fix the source and regenerate instead.

## 8. SoT decision protocol (when two sources disagree)

Per the precedence in `0-MASTER-INDEX.md` + the 2026-05-24 validation flip:

1. **Validation field** → xlsx wins over PRD
2. **Transport shape (DTO)** → backend code wins
3. **Permission rule** → code (`falcon-access.registry.ts` + `BuiltInRoleCatalog.cs`) wins
4. **Business rule semantics** → PRD wins
5. **Labels / copy** → PRD wins
6. **Architecture pattern** → architecture wiki wins
7. **Component capability** → `API.md` dossier wins (which itself derives from code)
8. **Anything unresolvable** → emit a Conflict node + halt-and-flag

## See also

- `0-MASTER-INDEX.md` — routing (which store answers which question)
- `VERIFICATION-STATUS.md` — trust grades per claim
- `BRAIN-ARCHITECTURE-CHART.md` — the 10-store shape
- `falcon-wiki/200-Graph/graph/build-capability-feed.js` — the model generator
- `falcon-wiki/200-Graph/PLAN-WAVES-11-15-TO-97-PERCENT.md` — Wave 15 consolidation (deferred)
