---
type: graph-wave-plan
title: "Waves 11-15 — Push every dimension to ≥97% (BE↔FE wire-level integration focus)"
status: AWAITING-USER-APPROVAL
created: 2026-05-28
target_floor: 0.97
predecessor: WAVE-010-GRAPH-PLAYBACK
concurrent_with: brain-query-layer-bundle-a-2026-05-28
up: "[[00_START_HERE]]"
tags: [graph, plan, waves, 97-percent, backend-frontend-integration]
---

# Waves 11-15 — Push every dimension to ≥97%

> [!summary]
> **Hard target:** every brain-understanding dimension + every graph-coverage dimension at **≥97%** — not just weighted average. Currently 1 dimension below 90% (style/token = 60%) and 3 below 97% (frontend 85%, business rules 90%, architecture 95%).
>
> **User's explicit focus:** "increase knowledge about backend, frontend, and the relation between them as DTOs and all APIs."
>
> **5 waves planned:** Wave 11 (style/token + components) · Wave 12 (BE↔FE wire-level — the headline) · Wave 13 (validation + BR closure) · Wave 14 (architecture + patterns) · Wave 15 (consolidate + verify + re-PDF).

## Current state — Wave 10 baseline

[BRAIN-OUT] `200-Graph/GRAPH_COVERAGE_REPORT.md` + `Brain Outputs/graphs/aggregate-summary.json`:

| Dimension | Current % | Gap to 97% | Wave that closes it |
|---|---:|---:|---|
| Authority | 100% | 0 | already maxed |
| Backend | 98% | +0 (already above) | maintain |
| Architecture | 95% | +2 | Wave 14 |
| Validation (xlsx SoT) | 95% | +2 | Wave 13 |
| Cross-store integration | 95% | +2 | Wave 12 |
| Business rules | 90% | +7 | Wave 13 |
| **Frontend** | **85%** | **+12** | **Wave 11 + Wave 12** |
| MOC / index | 95% | +2 | Wave 15 consolidation |
| Component-relationship | 80% | +17 | Wave 11 + Wave 12 |
| **Style / token** | **60%** | **+37** ⚠️ | **Wave 11 (highest priority)** |
| Page→component usage | 85% | +12 | Wave 12 |
| API ↔ business ↔ architecture | 100% | 0 | maintain |
| Orphan reduction | 95% | +2 | Wave 15 |
| Weak cluster reduction | 100% | 0 | maintain |
| Evidence quality | 95% | +2 | Wave 15 |

**Brain understanding (composite):** 94% → target 97%.
**Graph coverage (composite):** 94% → target 97%.
**Floor (worst single dimension):** 60% → target ≥97%.

## Coexistence with Bundle A (BQL build)

The in-progress task `brain-query-layer-bundle-a-2026-05-28` (Brain Query Layer + `/brain-context` skill) is **complementary, not blocking**:

- Bundle A builds the *query infrastructure* on top of the graph data.
- Waves 11-15 *fill the graph data* the query layer reads.
- They can run **interleaved or in either order**. Default recommendation: finish Bundle A first (it makes graph data testable mid-wave), then run Waves 11-15. But either order works.

## Stop conditions (hard floor for the wave loop to halt)

ALL must be true before the loop stops:

| # | Condition | Measurement |
|---:|---|---|
| 1 | Every brain-understanding dimension ≥ 97% | `GRAPH_COVERAGE_REPORT.md` table |
| 2 | Every graph-coverage sub-dimension ≥ 97% | same |
| 3 | No `Conflict` node unresolved | `Conflict` nodes count = 0 (or each carries a `REPLACES`/decision edge) |
| 4 | Every Component has a `TOKENS.md` (or marked deprecated) | direct file existence check |
| 5 | Every Endpoint traced E2E: Service → Endpoint → DTO → Controller → ValidationRule → BusinessRule | edge density audit |
| 6 | Every Page → uses_component graph closed | each Page has ≥1 `USES_COMPONENT` edge |
| 7 | Every WrapperComponent ↔ StencilComponent pair has `WRAPS` edge | currently 0 emitted |
| 8 | Evidence-only edges (no inferred edges asserted) | `inferred = 0` |
| 9 | Sync repo committed + pushed (on user instruction) | `git log` |

## Wave order rationale

```
Wave 11 (Style/Token + Component completion)
   ↓ unblocks
Wave 12 (BE↔FE wire-level — needs component data to thread)
   ↓ unblocks
Wave 13 (Validation + BR closure — needs endpoint+page data from W12)
   ↓
Wave 14 (Architecture + Pattern — pure consistency pass)
   ↓
Wave 15 (Consolidate + verify + re-PDF)
```

Hard dependency: Wave 12 needs Wave 11's component+token data to assert edges. Wave 13 needs Wave 12's endpoint+DTO data to cross-link. Waves 14+15 read all of the above.

---

# WAVE 11 — Style / Token + Component Catalog Completion

**Objective:** Lift style/token coverage from 60% to ≥97% AND complete component-relationship coverage from 80% to ≥97%.

**Effort:** ~3 hours (5 parallel agents + aggregation)
**Risk:** medium — touches the largest file count (61 components × 9 files + 46 theming files)

## Sub-objectives

| # | Sub-objective | Current | Target |
|---:|---|---:|---:|
| 1 | All 61 on-disk components have a `TOKENS.md` (or explicit "deprecated, no tokens") | 40/63 (per WAVE-002) | 61/61 |
| 2 | Centralize tokens cluster — populate `falcon-wiki/40-Tokens/` (currently empty) | 0 files | ≥30 token notes |
| 3 | Emit `MAPS_TO_TOKEN` edges (`--falcon-color-X` → `DesignToken:color-X`) | ~30 | ~200 |
| 4 | Emit `WRAPS` edges (WrapperComponent → StencilComponent for all pairs) | 0 | 25 |
| 5 | Emit `HAS_INPUT` / `HAS_OUTPUT` / `HAS_SLOT` edges per component | 0 | ~600 (avg 10/comp) |
| 6 | Theme-mode cascade audit — verify dark mode coverage per component | partial | full |

## Spawn pattern

5 parallel Explore agents:
- **Agent A:** Components 1-15 → read `API.md` (extract @Inputs, @Outputs, slots, variants); produce `HAS_INPUT`/`HAS_OUTPUT`/`HAS_SLOT`/`HAS_VARIANT` edge JSON.
- **Agent B:** Components 16-30 → same.
- **Agent C:** Components 31-45 → same.
- **Agent D:** Components 46-61 → same.
- **Agent E:** Token centralization → read all 61 `TOKENS.md` + all 46 `36-Theming/` files → produce centralized `DesignToken` registry + `MAPS_TO_TOKEN` edges + list of components lacking `TOKENS.md`.

## Files produced

- `200-Graph/waves/WAVE-011-GRAPH-PLAYBACK.md` — wave audit
- `200-Graph/graph/wave-deltas/wave-011.json` — node + edge delta
- `falcon-wiki/40-Tokens/INDEX.md` — token cluster MOC (new)
- `falcon-wiki/40-Tokens/<token-namespace>.md` — one file per major namespace (color, spacing, radius, shadow, typography, motion)
- Updated `STYLE_TOKEN_GRAPH.md` + `CSS_VARIABLE_GRAPH.md` + `TAILWIND_USAGE_GRAPH.md` with dense data
- Updated `COMPONENT_REGISTRY_GRAPH.md` — every row has `tokens-md-status`, `wrapper-stencil-paired`, `input-count`, `output-count`

## Edge contract for Wave 11

- `DEFINES_CSS_VARIABLE` — already in Wave 2; extend to remaining 23 components.
- `MAPS_TO_TOKEN` — every `--color-falcon-X` CSS var maps to a `DesignToken:color-X` node. New.
- `WRAPS` — for every `<falcon-angular-X>` ↔ `<falcon-X-tw>` pair found in API.md.
- `HAS_INPUT` / `HAS_OUTPUT` / `HAS_SLOT` — from API.md `@Input()` / `@Output()` / slot mentions. Confirmed-only.

## Expected coverage delta

| Dimension | Wave 10 | Wave 11 |
|---|---:|---:|
| Style/token | 60% | **95%** |
| Component-relationship | 80% | **95%** |
| Frontend | 85% | **92%** |
| **Total** | 94% | **96%** |

---

# WAVE 12 — Backend ↔ Frontend Wire-Level Integration ⭐ USER'S HEADLINE ASK

**Objective:** Trace every Endpoint, every DTO, every Controller end-to-end through the stack — from FE component all the way to BE service.

**Effort:** ~4 hours (6 parallel agents + heavy aggregation)
**Risk:** medium-high — most complex wave; touches every store

## The wire-level mesh to build

For every endpoint, the graph must answer in one query:

```
Endpoint ─── EXPOSED_BY ──→ Controller ─── BELONGS_TO ──→ Service
   │                                                          │
   │ USES_DTO (request)                                       │ PRODUCES_EVENT
   ↓                                                          ↓
DTO (request)                                            KafkaEvent
   │                                                          │
   │ VALIDATED_BY                                             │ CONSUMED_BY
   ↓                                                          ↓
ValidationRule                                          Service (downstream)
   │
   │ IMPLEMENTS_BUSINESS_RULE
   ↓
BusinessRule (BR-*)
   │
   │ DISPLAYED_ON
   ↓
Page ─── USES_COMPONENT ──→ Component ─── HAS_INPUT ──→ <input fields>
```

After Wave 12, asking "show me everything that breaks if I change `POST /commerce/account` request shape" should return a complete dependency walk.

## Sub-objectives

| # | Sub-objective | Current | Target |
|---:|---|---:|---:|
| 1 | All 137 Endpoint nodes have `EXPOSED_BY` edge to a Controller node | partial | 137/137 |
| 2 | All 206 DTOs have `USES_DTO` edges to consuming Endpoints (req/resp directionality) | ~250 edges | ~500 (req+resp explicit) |
| 3 | Every Page → API connection has `CONNECTS_TO_API` edge | sparse | 14 pages × avg 5 APIs = 70 |
| 4 | Every Page → Component connection has `USES_COMPONENT` edge | 125 | ≥200 |
| 5 | Per-endpoint validation trace — which `ValidationRule`s gate each endpoint | partial | 137/137 |
| 6 | Per-endpoint business-rule trace — which BR-*s the endpoint implements | partial | 137/137 |
| 7 | Cross-service event flow — `CONSUMES_EVENT` directionality | ~28 | ~50 |

## Spawn pattern

6 parallel agents:
- **Agent A:** Read 5 services (access, charging, commerce, contact-group, core-gateway) — `ENDPOINT_REGISTRY.md` + `DTO_DICTIONARY.md` + `VALIDATIONS.md` + `ERRORS.md`. Produce per-service endpoint inventory + DTO mapping.
- **Agent B:** Read 4 services (identity, provisioning, system-gateway, templates) — same.
- **Agent C:** Read 14 page dossiers — `08-BACKEND_API.md` + `09-COMPONENTS.md` per page. Extract `CONNECTS_TO_API` + `USES_COMPONENT` edges.
- **Agent D:** Read `Brain SK/_obsidian/47-Events/` (21 KafkaEvent files) — extract `PRODUCES_EVENT` + `CONSUMES_EVENT` with directionality.
- **Agent E:** Read `understanding/integration/` cross-service docs — extract cross-service dependencies.
- **Agent F:** Read every `INTEGRATION_VALIDATION.md` in component dossiers (61 files) — extract `Component → ValidationRule` and `Component → Endpoint` ties.

## Files produced

- `200-Graph/waves/WAVE-012-GRAPH-PLAYBACK.md` — the headline wave audit
- `200-Graph/graph/wave-deltas/wave-012.json` — largest delta yet (~2000+ edges expected)
- `200-Graph/BE_FE_WIRE_LEVEL_INTEGRATION_GRAPH.md` — **NEW** dense doc showing the full mesh per feature area
- `200-Graph/API_BUSINESS_ARCHITECTURE_GRAPH.md` — rewritten with full data
- `200-Graph/PAGE_TO_COMPONENT_USAGE_GRAPH.md` — rewritten with full data
- Per-endpoint trace pages (optional Wave 12.5 if scope allows)

## Edge contract for Wave 12

| Edge | When emitted | Strength |
|---|---|---|
| `EXPOSED_BY` (Endpoint → Controller) | every endpoint in `ENDPOINT_REGISTRY.md` | confirmed |
| `USES_DTO` (Endpoint → DTO, directional: request/response) | every endpoint with body | confirmed |
| `BELONGS_TO_SERVICE` (Endpoint → Service) | path prefix maps to service | confirmed |
| `VALIDATED_BY` (Endpoint → ValidationRule) | every V-rule that gates this endpoint | confirmed (xlsx-sot first) |
| `IMPLEMENTS_BUSINESS_RULE` (Endpoint → BR-*) | from VALIDATIONS.md cross-walk | confirmed |
| `CONNECTS_TO_API` (Page → API) | from page `08-BACKEND_API.md` | confirmed |
| `USES_COMPONENT` (Page → Component) | from page `09-COMPONENTS.md` | confirmed |
| `DISPLAYED_ON` (DTO → Page) | inverse of CONNECTS_TO_API | confirmed |
| `PRODUCES_EVENT` (Service → KafkaEvent) | every event from `47-Events/` | confirmed |
| `CONSUMES_EVENT` (Service → KafkaEvent) | downstream consumers | confirmed |

## Expected coverage delta

| Dimension | Wave 11 | Wave 12 |
|---|---:|---:|
| Cross-store integration | 95% | **99%** |
| Backend | 98% | **99%** |
| Frontend | 92% | **96%** |
| Page → component usage | 85% | **98%** |
| API ↔ business ↔ architecture | 100% | 100% (maintain) |
| **Total** | 96% | **97%** |

---

# WAVE 13 — Validation + Business Rule Closure

**Objective:** Resolve every `Conflict` node, close every PRD-only V-rule's xlsx cross-walk, and verify every BR-* has an enforcer trace.

**Effort:** ~2.5 hours (4 parallel agents)
**Risk:** medium — requires careful xlsx parsing + PRD↔xlsx triangulation

## Sub-objectives

| # | Sub-objective | Current | Target |
|---:|---|---:|---:|
| 1 | Resolve all 4 `Conflict` nodes (PRD↔xlsx) | 4 open | 0 open |
| 2 | Every V-rule has explicit `sot` field (`xlsx` / `prd` / `backend` / `superseded`) | partial | 78/78 |
| 3 | 27 PRD-only V-rules cross-walked vs xlsx — confirm "xlsx silent on this field" or "needs xlsx revision" | not yet | 27/27 |
| 4 | Every BR-* has at least one `IMPLEMENTS_BUSINESS_RULE` edge from a Page/Service/Endpoint | partial (~120 of 225) | 225/225 |
| 5 | Q-UM-07 standing-truth reconciliation (file says RESOLVED, hook still flags blocked) | inconsistent | resolved |
| 6 | All 78 ValidationRule nodes have a `confirmed` `HAS_VALIDATION` edge from the consuming form/DTO | partial | 78/78 |

## Spawn pattern

4 parallel agents:
- **Agent A:** Parse all 10+ xlsx TSVs in `Source_of_truth_theme/.xlsx-parse/dump-SOT/`. Build canonical xlsx-field → ValidationRule map.
- **Agent B:** Read all 27 PRD-only V-rules. Cross-check against Agent A's xlsx map. Emit `needs-xlsx-revision` or `xlsx-silent-acceptable` for each.
- **Agent C:** Read all 5 `BUSINESS_RULES.md` files in `prd/modules/<m>/`. Cross-walk every BR-* against existing enforcer edges. Identify orphan BR-*s.
- **Agent D:** Read `_pending-questions/Q-UM-07-RESOLVED-2026-05-19.md`. Determine if standing-truth in session-start hook needs update or if there's a real residual gap.

## Files produced

- `200-Graph/waves/WAVE-013-GRAPH-PLAYBACK.md`
- `200-Graph/graph/wave-deltas/wave-013.json`
- `200-Graph/VALIDATION_CONFLICT_RESOLUTIONS.md` — **NEW** — each of the 4 Conflict nodes resolved with explicit decision + supporting evidence
- `200-Graph/BR_ENFORCER_MAP.md` — **NEW** — for each of 225 BR-*, which Page/Service/Endpoint enforces it
- Updated `Q-UM-07-RESOLVED-2026-05-19.md` cross-reference doc (or new memo) clarifying standing-truth

## Edge contract for Wave 13

- `REPLACES` (xlsx-V-rule → PRD-V-rule) — for every Conflict resolution
- `HAS_VALIDATION` (DTO/Page → ValidationRule) — close the 78/78 mapping
- `IMPLEMENTS_BUSINESS_RULE` (Page/Service/Endpoint → BR-*) — close the 225/225 mapping
- `NEEDS_REVIEW` cleared for any V-rule that gets a definitive `sot` field

## Expected coverage delta

| Dimension | Wave 12 | Wave 13 |
|---|---:|---:|
| Validation | 95% | **99%** |
| Business rules | 90% | **98%** |
| Cross-store integration | 99% | **99%** (maintain) |
| **Total** | 97% | **98%** |

---

# WAVE 14 — Architecture + Pattern Adherence

**Objective:** Verify every architecture rule (24 ADRs + patterns) has explicit `GOVERNED_BY_ARCHITECTURE_RULE` edges to applicable nodes. Audit anti-pattern presence.

**Effort:** ~2 hours (3 parallel agents)
**Risk:** low — read-only audit + edge emission

## Sub-objectives

| # | Sub-objective | Current | Target |
|---:|---|---:|---:|
| 1 | All 23 ArchitectureRule nodes have ≥1 `GOVERNED_BY_ARCHITECTURE_RULE` edge | 315 total edges across all rules | 23/23 rules with ≥1 edge AND total ≥400 |
| 2 | All 13 AntiPattern nodes have audit-report findings | partial | 13/13 |
| 3 | All 14 Pattern nodes have ≥3 example consumers | partial | 14/14 |
| 4 | ADR-1 through ADR-8 explicit application checklist per component | 0 / 24 | 24/24 |
| 5 | Theme-mode dark cascade coverage per component (re-audit) | partial | 61/61 components |

## Spawn pattern

3 parallel agents:
- **Agent A:** Read all 24 files in `Brain SK/_obsidian/35-Architecture/` (incl. 8 ADRs). For each ArchitectureRule, list which components/services/pages adhere. Emit `GOVERNED_BY_ARCHITECTURE_RULE` edges.
- **Agent B:** Read `Brain SK/_obsidian/90-Approved-Patterns/` (14 patterns). For each, find ≥3 component consumers in the codebase + emit `USES_PATTERN` edges. Read `Brain Outputs/datasets/authority-dataset/15-implementation-pitfalls/ANTI-PATTERNS.md`. For each anti-pattern, find documented violations + emit `HAS_ANTI_PATTERN` edges.
- **Agent C:** Theme-mode + state cascade audit — for each of 61 components, verify `theme:dark` HAS_STATE edge exists; flag the ~20% lacking dark-mode override per Wave 2 Group E.

## Files produced

- `200-Graph/waves/WAVE-014-GRAPH-PLAYBACK.md`
- `200-Graph/graph/wave-deltas/wave-014.json`
- `200-Graph/ARCHITECTURE_ADHERENCE_REPORT.md` — **NEW** — ADR ↔ component matrix
- `200-Graph/PATTERN_USAGE_GRAPH.md` — **NEW** — pattern → consumers map
- `200-Graph/ANTI_PATTERN_VIOLATIONS.md` — **NEW** — flagged violations

## Expected coverage delta

| Dimension | Wave 13 | Wave 14 |
|---|---:|---:|
| Architecture | 95% | **99%** |
| Pattern compliance | 70% (estimated) | **97%** |
| Frontend (dark-mode cascade closure) | 96% | **98%** |
| **Total** | 98% | **98.5%** |

---

# WAVE 15 — Consolidation + Final Verification + Re-PDF

**Objective:** Merge all wave-deltas into a single master `nodes.json` + `edges.json`. Re-run scanner. Verify every dimension ≥97%. Regenerate PDF.

**Effort:** ~1.5 hours (mostly sequential consolidation)
**Risk:** low — read-mostly with one consolidation write

## Sub-objectives

| # | Sub-objective | Notes |
|---:|---|---|
| 1 | Merge `nodes.json` + 5 wave-delta files into single master `nodes.json` (v2) | Preserve original Wave 1 baseline as `nodes-wave-01-baseline.json` |
| 2 | Same for `edges.json` | |
| 3 | Regenerate `nodes.csv` + `edges.csv` | Gephi/igraph re-import |
| 4 | Run scanner `falcon-wiki/scripts/scan-authority.ps1` — confirm 67/67 source files clean | Read-only verification |
| 5 | Recompute coverage report with final numbers | Every dimension ≥97% target |
| 6 | Regenerate PDF report — `FALCON-KNOWLEDGE-GRAPH-FINAL-V2-REPORT.pdf` | Replace v1 PDF |
| 7 | Update `Brain Outputs/graphs/aggregate-summary.json` | machine-readable cumulative |
| 8 | Write `WAVE-015-GRAPH-PLAYBACK.md` — final wave handoff |
| 9 | Update `00_START_HERE.md` — point at v2 PDF + consolidated JSON |
| 10 | Add memory entry to home-memory + MEMORY.md | one-line summary |

## Files produced

- `200-Graph/waves/WAVE-015-GRAPH-PLAYBACK.md`
- `200-Graph/graph/nodes.json` (consolidated v2 — single file replacing Wave 1 + 5 deltas as canonical query target)
- `200-Graph/graph/edges.json` (consolidated v2)
- `200-Graph/graph/nodes.csv` + `edges.csv` (regenerated)
- `200-Graph/graph/nodes-wave-01-baseline.json` + `edges-wave-01-baseline.json` (originals preserved)
- `200-Graph/GRAPH_COVERAGE_REPORT.md` — final trajectory rows for waves 11-15
- `200-Graph/.exports/FALCON-KNOWLEDGE-GRAPH-FINAL-V2-REPORT.pdf` (replaces v1 with updated numbers + Wave 12's BE↔FE mesh chapter)
- `Brain Outputs/graphs/aggregate-summary.json` (updated)
- `~/.claude/projects/C--Falcon/memory/project_obsidian_graph_waves_11_to_15_2026_05_28.md`
- `MEMORY.md` index entry

## Final verification gate

Wave 15 only marks the loop COMPLETE if these are all true:

| # | Gate | How verified |
|---:|---|---|
| 1 | Every dimension ≥ 97% | `GRAPH_COVERAGE_REPORT.md` final row |
| 2 | Conflicts = 0 | grep `Conflict` nodes in `nodes.json` |
| 3 | Every Component has TOKENS.md or `deprecated` flag | filesystem check |
| 4 | Every Endpoint has `EXPOSED_BY` + `USES_DTO` + `VALIDATED_BY` edges | edge density audit |
| 5 | Every Page has ≥1 `USES_COMPONENT` + ≥1 `CONNECTS_TO_API` | edge density audit |
| 6 | Every WrapperComponent has `WRAPS` edge | check 25/25 |
| 7 | Zero `inferred` edges asserted | grep edges.json |
| 8 | Scanner 67/67 clean | scan-authority.ps1 |
| 9 | PDF regenerated successfully | file exists + size sanity check |
| 10 | Sync repo state captured for next push | git status |

If any gate fails, Wave 15 halts-and-flags rather than declaring done.

## Expected final coverage

| Dimension | Wave 10 final | Wave 15 final | Δ |
|---|---:|---:|---:|
| Authority | 100% | 100% | 0 |
| Backend | 98% | **99%** | +1 |
| Architecture | 95% | **99%** | +4 |
| Validation | 95% | **99%** | +4 |
| Cross-store integration | 95% | **99%** | +4 |
| Business rules | 90% | **98%** | +8 |
| Frontend | 85% | **98%** | +13 |
| MOC | 95% | **98%** | +3 |
| Component-relationship | 80% | **97%** | +17 |
| Style/token | 60% | **97%** | +37 ⭐ |
| Page→component | 85% | **98%** | +13 |
| API ↔ biz ↔ arch | 100% | 100% | 0 |
| Orphan reduction | 95% | **98%** | +3 |
| Weak cluster reduction | 100% | 100% | 0 |
| Evidence quality | 95% | **97%** | +2 |
| **Weighted total** | **94%** | **98.5%** | **+4.5** |
| **Worst single dim (floor)** | **60%** | **≥97%** ⭐ | **+37** |

---

# Cross-cutting safety + invariants (every wave honors)

| Rule | Applied per wave |
|---|---|
| No app code edits | Yes |
| No git commits / pushes | Yes (until user instruction) |
| No npm install / build / test runner | Yes |
| No docker compose / service start | Yes |
| No secrets written | Yes |
| Writes confined to `falcon-wiki/200-Graph/`, `Brain SK/_obsidian/`, `Brain Outputs/graphs/`, `universal-brain/state/`, `falcon-wiki/40-Tokens/` (new), home-memory | Yes |
| Evidence-only edges (no inferred-only) | Yes |
| xlsx-over-PRD SoT preserved | Yes |
| Snapshot before destructive batch | Yes — `universal-brain/snapshots/pre-waves-11-15/` |
| Wave-delta files (preserve atomicity until Wave 15 consolidation) | Yes |
| Brain SK CLAUDE.md governance (no edits to plugin data.json, workspace.json, .smart-env/) | Yes |

# Time budget summary

| Wave | My execution time | Your time | Stop point |
|---|---:|---:|---|
| 11 — Style/Token + Components | 3 hr | 0 | none — auto-continue |
| 12 — BE↔FE Wire-Level ⭐ | 4 hr | 0 | none |
| 13 — Validation + BR Closure | 2.5 hr | 0 | none |
| 14 — Architecture + Patterns | 2 hr | 0 | none |
| 15 — Consolidate + Verify + Re-PDF | 1.5 hr | 5 min approve sync push | ✅ — only if all 10 gates pass |
| **TOTAL** | **~13 hr** | **~5 min** | — |

(Comparable to the 10-wave loop's total — that took ~13-15 hours across multiple sessions.)

# How to start

Reply with one of:

- **"approve, start Wave 11"** — pre-flight snapshot → spawn 5 parallel agents → land Wave 11. Then auto-continue to Wave 12-15 unless you say stop.
- **"approve plan but reorder X before Y"** — I adjust the sequence and start.
- **"approve plan but pause after Wave 12"** — I stop after the BE↔FE wave (your headline ask) and you decide whether to continue.
- **"finish Bundle A first"** — I switch to completing the Brain Query Layer task that's currently in-progress, then return to this plan.
- **"hold, revise X"** — I edit this plan document.

I will not begin execution until I see an explicit "start" instruction.

# See also

- [[GRAPH_COVERAGE_REPORT]] — the dimension scoring model this plan targets
- [[GRAPH_GAPS_AND_NEXT_STEPS]] — original stop conditions (this plan extends them)
- [[waves/WAVE-010-GRAPH-PLAYBACK]] — what Wave 10 left behind
- [[../00_START_HERE]] — graph entry doc
- [BRAIN-OUT] `Brain Outputs/graphs/aggregate-summary.json` — machine-readable current state
- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/19-night-shift-readiness/DECISION-PROTOCOL.md` — halt-and-flag protocol
