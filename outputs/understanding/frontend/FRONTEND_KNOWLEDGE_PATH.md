---
type: knowledge-path
purpose: roadmap-to-deep-frontend-understanding
created: 2026-05-16
status: proposal
scope: falcon-web-platform-ui + libs/falcon-ui-core + libs/falcon
---

*** Falcon Frontend — the Path to Deep Understanding ***
*** What we have · what's missing · how to close every gap ***
*** Read this when you want to know how the frontend actually works ***

# 🧭 Frontend Knowledge Path

> The single roadmap for building **complete, machine-readable understanding** of the Falcon frontend — architecture, components, design system, decisions, and continuous knowledge. Every gap traceable to a fix; every fix traceable to an agent; every agent traceable to a deliverable.

## Why this exists

Right now the brain knows **fragments**:

- 62 component dossiers (most are 5-file partial)
- 4 flow playbooks (org-hierarchy only)
- 39 rules + detector engines
- 18 refactor patterns
- A Falcon Component Creation strategy with templates
- A 23-file component-creation methodology

But it cannot answer questions like:

- "When I open admin-console, what loads from host-shell? Which remote responds to `/users`?"
- "Which 14 pages use `<falcon-data-table>`? In what context — readonly, editable, with bulk-actions?"
- "Why is there a Falcon library instead of PrimeNG?" (the answer is in three different memory files, never assembled)
- "What's the typography token scale? Is `text-noor-headline` real, or are we using `text-2xl`?" (this morning's audit revealed this gap)
- "If I add a new component, what's the EXACT folder layout + naming convention?" (it exists in `outputs/strategies/falcon-component-creation/`, but no one navigates there)
- "Which components have RTL bugs? Which support i18n correctly?" (scattered across GAPS files)

This path closes those gaps systematically.

## What we have (audit of current frontend knowledge)

### Component knowledge

- **62 component dossiers** under `Brain Outputs/understanding/frontend/components/<name>/`
- Each dossier is supposed to have **6 files**: `OVERVIEW.md` · `API.md` · `USAGE.md` · `TOKENS.md` · `GAPS_AND_UPGRADES.md` · `DECISION.md`
- **Reality check**: Most dossiers are **5-file** (missing OVERVIEW.md). Only 1 component has OVERVIEW.md today (`falcon-insufficient-balance-dialog`).
- **Registries**: `registries/FALCON_COMPONENT_REGISTRY.md` (live inventory) + `registries/FALCON_UI_BUGS_AND_QUIRKS.md` (known issues)
- **Capability matrix**: `outputs/frontend-understanding/FALCON_COMPONENT_CAPABILITY_MATRIX.md` (which features each component supports)
- **Relationship map**: `outputs/frontend-understanding/COMPONENT_RELATIONSHIP_MAP.md` (legacy path — needs migration to canonical)
- **Readiness scores**: `outputs/frontend-understanding/READINESS_SCORES.md` (per-component scorecard)

### Page knowledge

- **Page Learning System** under `Brain Outputs/understanding/pages/<page>/`
- **Flow playbooks**: Add Client (folder-form, 17 files) · Add User · Add Node · Edit Node (single-file each)
- Per-page scorecards
- Light Learning Events + Pending/Approved patterns

### Architecture knowledge

- **Brain Outputs/understanding/frontend/architecture/** (audits + design docs)
- **Brain Outputs/understanding/frontend/migration/** (PrimeNG removal etc.)
- **Brain Outputs/understanding/frontend/theme/** (Tailwind v4 + V0.2 theme adoption)
- Wiki rules at `falcon-wiki/Home/Software-Architecture-Design/Front-End-Architecture.md`

### Strategy + creation knowledge

- **`Brain Outputs/strategies/falcon-component-creation/`** — 23 files including:
  - `01-CANONICAL_PATTERN.md` · `02-FOLDER_STRUCTURE.md` · `03-NAMING_CONVENTION.md`
  - 7 file templates (Stencil shadow/TW, Angular wrapper, types, utils, Tailwind classes, README)
  - `05-SCORING_RUBRIC.md` · `06-EXECUTION_PROTOCOL.md` · `07-INTEGRATION_POINTS.md` · `08-COMMON_PITFALLS.md`
  - One landed run: `2026-05-14_falcon-empty-data/`

### Rules + audit infrastructure

- **39 rules** with full detector logic (regex / structural / AST / semantic-llm)
- **LIVE AST runners** for R-FE-007 (library skeleton) and R-BE-002 (app-service composition)
- **18 refactor patterns** with playbooks
- **5 detector engines** (regex + structural + AST-fe + AST-be + semantic stub)
- **Night-shift orchestrator** for autonomous audit

### Memory snapshots

- ~50 memory files in `C:\Users\User\.claude\projects\C--Falcon\memory\` capturing project decisions, feedback rules, and standing protocols

## What's missing (the gaps this path closes)

| Gap | Why it matters | Cost to close |
|---|---|---|
| **Component Atlas hub** | No single page in Obsidian to view all 62 components with severity/coverage/status at a glance | 30 min |
| **Missing OVERVIEW.md** (61 components) | Without OVERVIEW, you can't tell at-a-glance what a component IS or how it's positioned | 2-3 h (agent batch) |
| **Component dependency graph** | Don't know which component uses which other component; refactor blast-radius unknown | 1 h (AST script) |
| **Component-to-page usage matrix** | Don't know which page uses `<falcon-data-table>` for what; can't plan UI changes confidently | 1 h (grep + write) |
| **Module Federation topology** | Don't have a clear diagram of host-shell + remotes + routes + lazy boundaries | 2 h (read + diagram) |
| **State management architecture** | No single doc on signals vs services vs facades — pattern is implicit | 2 h |
| **Theme + Token taxonomy** | This morning's audit proved we don't even know if `text-noor-*` tokens exist (they don't) | 2 h (parse @theme + write) |
| **Folder Structure Deep-Dive** | Newcomer can't tell `apps/admin-console/src` from `libs/falcon` from `libs/falcon-ui-core` | 1 h |
| **8 ADRs (Architecture Decision Records)** | The "why" is scattered across memory files; one place tells the story | 4-6 h (one ADR per session) |
| **Anti-pattern catalog** | We have rules saying what NOT to do; we don't have curated examples of what people TRIED to do but shouldn't have | 2 h |
| **Component Evolution Timeline** | Don't know when each component was added or last modified — orphans go unnoticed | 30 min (git log script) |
| **Frontend Onboarding Playbook** | "If you're new, read these 12 docs in this order" — doesn't exist | 1 h |
| **Performance Budget Map** | Don't track bundle sizes per release — regressions invisible | 1 h |
| **Test Coverage Matrix** | Don't know which components have spec files vs which don't | 30 min |
| **Visual Component Story** | No screenshot/snapshot per component — search-by-look is impossible | 4 h (Falcon Eyes batch) |

**Total cost to close ALL gaps: ~25-30 hours of focused work.** Sequenced in tiers so you can stop at any tier and have a usable improvement.

---

## The Path — 4 Tiers

### Tier 1 — Foundation (this week, ~6 h)

**Goal:** Every component has a complete dossier; one Obsidian hub views them all.

| # | Deliverable | Cost | Agent |
|---|---|---|---|
| 1 | **`Component Atlas.md`** — single Obsidian hub with Dataview over 62 dossiers, grouped by category, sortable by health-score | 30 min | me |
| 2 | **Complete the 61 missing OVERVIEW.md files** in parallel using a 5-file batch agent (write OVERVIEW for one component, build pattern, replicate) | 2-3 h | 6 parallel agents (10 components each) |
| 3 | **Component-to-page usage matrix** generated from grep across `apps/**/*.html` for each `<falcon-*>` tag | 1 h | me (script + write) |
| 4 | **Component dependency graph** generated from TS Compiler API walking imports in `libs/falcon-ui-core/**` | 1 h | TS script (ast-runner-fe.ts variant) |
| 5 | **Component Evolution Timeline** generated from `git log --follow` on each component file | 30 min | bash script |

After Tier 1: open `Component Atlas.md` in Obsidian, click any component, see its full 6-file dossier + the pages it's used on + its dependencies + its git history. **Every question about "this component" has an immediate answer.**

### Tier 2 — Architectural maps (next week, ~10 h)

**Goal:** The architecture is fully drawn in the brain — not in your head.

| # | Deliverable | Cost | Method |
|---|---|---|---|
| 6 | **`Frontend Architecture Atlas.md`** — Obsidian hub linking all architecture knowledge | 30 min | me |
| 7 | **`Module Federation Topology.md`** — Mermaid diagram + table: host-shell + 2 remotes + their routes + their lazy boundaries + their entry components | 2 h | me (read `webpack.config.ts` + write) |
| 8 | **`State Management Architecture.md`** — signals vs services vs facades, when to use each, with code examples drawn from `apps/admin-console/.../auth/` | 2 h | me + reference codebase |
| 9 | **`Theme and Token Taxonomy.md`** — full @theme catalog parsed from `libs/falcon-theme/src/falcon-tailwind-tokens.css`, every CSS variable named, grouped by family (color / spacing / typography / shadow / radius / motion), each mapped to glossary entry | 2 h | parse + agent write |
| 10 | **`Folder Structure Deep-Dive.md`** — apps/ vs libs/ vs scripts/ vs demos/, what lives where, why | 1 h | me |
| 11 | **`Auth Flow Architecture.md`** — Identity Service integration, OAuth2/OIDC, token refresh, IP allowlist, MFA — sequence diagrams | 2 h | me (read identity-svc + write) |
| 12 | **`Routing Topology.md`** — per-app routes, federation routes, guards, lazy loading boundaries | 1 h | me (extract from `app.routes.ts`) |

After Tier 2: the brain knows the architecture as well as you do. Any new agent can be briefed in 2 minutes.

### Tier 3 — Decision Rationale (week 3, ~6 h)

**Goal:** The "why" is permanent, not lost in chat history.

8 ADRs (Architecture Decision Records) under `Brain Outputs/understanding/frontend/decisions/`:

| ADR | Title | What it captures |
|---|---|---|
| 001 | Why Falcon custom library instead of PrimeNG | Origin story, tradeoffs, what survived from PrimeNG removal (commit project_falcon_primeng_total_removal_complete) |
| 002 | Why Tailwind v4 instead of SCSS | Hardened 2026-05-05 rules, V0.2 theme adoption, ::ng-deep elimination journey |
| 003 | Why Module Federation (3 apps) | host-shell + admin-console + management-console design rationale |
| 004 | Why Stencil for shadow components | Cross-framework portability, React/Vue/Angular demos, Shadow DOM benefits |
| 005 | Why dual-render path (Shadow + Tailwind variants) | `*-tw.tsx` pattern, when to use which |
| 006 | Why Identity Service owns user lifecycle | The R-XC-001 rule's origin |
| 007 | Why Tailwind v4 @theme over @config | V0.2 vs V0.3 theme decision |
| 008 | Why feature-folder pattern (`models/models.ts` etc.) | R-FE-009 rule origin |

Each ADR = ~45 min to write. Spawn 8 sequential agent calls, one per ADR, each with full memory context.

After Tier 3: the brain explains itself. New team members onboard in hours instead of weeks.

### Tier 4 — Continuous knowledge (ongoing, ~4 h to set up)

**Goal:** The knowledge stays current automatically.

| # | Deliverable | Set-up cost | Run cost |
|---|---|---|---|
| 13 | **`Component Evolution Timeline.md` auto-refresh** — Saturday cron via night-shift orchestrator + git log per component file | 1 h | 5 min/week |
| 14 | **`Frontend Onboarding Playbook.md`** — "Read these 12 docs in this order on day 1" | 1 h | static |
| 15 | **`Anti-Pattern Catalog.md`** — curated examples of what people tried but shouldn't have, with rule violations + correct alternatives | 2 h | grows organically |
| 16 | **`Performance Budget Tracker.md`** — bundle size per release auto-logged from CI artifacts | 1 h | 0 min/run (CI integration) |
| 17 | **`Visual Component Story` snapshots** — Falcon Eyes screenshot per component, indexed by name | 4 h | 1 h/refresh |

After Tier 4: the knowledge graph maintains itself. You only intervene when there's a real architectural change.

---

## Suggested execution sequence

### Immediate (today/tomorrow, 6 h)

```
1. Component Atlas hub                              (30 min, me)
2. Complete 61 OVERVIEW.md (6 parallel agents)      (3 h wall, ~30 min each agent)
3. Component-to-page usage matrix                   (1 h, script + me)
4. Component dependency graph                       (1 h, TS script)
5. Component Evolution Timeline                     (30 min, git script)
```

### Next session (week, 10 h)

```
6.  Frontend Architecture Atlas hub                 (30 min)
7.  Module Federation Topology                      (2 h)
8.  State Management Architecture                   (2 h)
9.  Theme + Token Taxonomy                          (2 h)  ← addresses this morning's R-NOOR-003 misalignment
10. Folder Structure Deep-Dive                      (1 h)
11. Auth Flow Architecture                          (2 h)
12. Routing Topology                                (1 h)
```

### Week 3 (6 h)

```
13. 8 ADRs (45 min each, sequential agents)         (6 h wall — could parallel)
```

### Then continuous

```
14-17. Onboarding, Anti-patterns, Performance, Visual snapshots
```

---

## Concrete agent briefs (for spawning)

Each tier's agents need precise scope. Drafted below — copy-paste to spawn:

### Brief 1 — OVERVIEW.md batch agent (Tier 1, Step 2)

```
You are filling missing OVERVIEW.md files for Falcon component dossiers.

For each of these 10 components (assigned to you):
  <list-of-10-components>

1. Read API.md, USAGE.md, TOKENS.md, GAPS_AND_UPGRADES.md, DECISION.md (5 existing files)
2. Read the component source at libs/falcon-ui-core/src/components/<name>/
3. Write OVERVIEW.md with these sections:
   - What it is (one sentence, then 2-3 paragraphs)
   - Where it lives (file paths)
   - Who uses it (cross-link to component-to-page matrix)
   - Falcon library tier (primitive, composite, page-section)
   - Render path (shadow only, tailwind only, dual)
   - Status (production-ready / beta / experimental)
   - 1-paragraph anti-patterns (what NOT to do with this component)
   - Related: list other components in the same family

Hard rules:
- Brain repo only — never touch Falcon source
- Match the canonical 6-file dossier shape
- ~250-400 words per OVERVIEW
- Cite source files inline
```

### Brief 2 — Theme + Token Taxonomy agent (Tier 2, Step 9)

```
You are building the canonical Token Taxonomy from libs/falcon-theme/src/falcon-tailwind-tokens.css.

1. Parse every --token in the @theme block (`@theme { --color-falcon-...: ...; }`)
2. Group by family: color, spacing, radius, shadow, typography, motion, z-index
3. For each token:
   - Token name (--color-falcon-emerald-500)
   - Tailwind utility name (bg-emerald-500)
   - Resolved value (#10B981)
   - Family + role (primary / secondary / surface / state)
   - Used in (grep across apps/ + libs/, count usages)
   - Glossary cross-link
4. Write Brain Outputs/understanding/frontend/theme/TOKEN_TAXONOMY.md
5. Also write per-family Obsidian notes: 05-Glossary/Token-Colors.md, Token-Spacing.md, etc.
6. Resolve this morning's R-NOOR-003 question: does text-noor-* exist? (No.) What's the
   canonical typography scale? (Document the answer.)

Hard rules:
- Brain repo only
- Every claim cites the @theme line number
- Identify gaps (tokens declared but never used; utilities used but no token)
```

### Brief 3 — Module Federation Topology agent (Tier 2, Step 7)

```
You are producing the Module Federation topology document.

1. Read webpack.config.ts in each app (admin-console, host-shell, management-console)
2. Identify host vs remote, exposed modules, shared dependencies
3. Read the routes for each app + the federation lazy-loaders
4. Produce Brain Outputs/understanding/frontend/architecture/MODULE_FEDERATION_TOPOLOGY.md with:
   - Mermaid diagram of host-shell + remotes + their connections
   - Table: route path -> app -> exposed module -> entry component
   - Table: shared dependency -> singleton requirement -> version
   - Section: known boundaries (what host CANNOT do, what remote MUST do)
   - Section: failure modes (what happens if a remote is offline)
   - Section: dev vs prod federation paths

Hard rules:
- Brain repo only
- Cite file path + line for every claim
- Visual: at least 2 diagrams (topology + sequence)
```

(Other agent briefs follow similar discipline — full set lives in `Brain Outputs/understanding/frontend/AGENT_BRIEFS_FOR_KNOWLEDGE_PATH.md` which will be the next file authored.)

---

## Vault structure after this path

```
_obsidian/
  00-Home/
    Component Atlas.md                  ← NEW (Tier 1)
    Frontend Architecture Atlas.md      ← NEW (Tier 2)
    Frontend Onboarding Playbook.md     ← NEW (Tier 4)
  35-Architecture/
    code-rules/ (existing 39 rules)
    decisions/                          ← NEW (Tier 3 — 8 ADRs)
    MODULE_FEDERATION_TOPOLOGY.md       ← NEW
    STATE_MANAGEMENT_ARCHITECTURE.md    ← NEW
    AUTH_FLOW_ARCHITECTURE.md           ← NEW
    ROUTING_TOPOLOGY.md                 ← NEW
    FOLDER_STRUCTURE_DEEP_DIVE.md       ← NEW
    ANTI_PATTERN_CATALOG.md             ← NEW
  60-Components/ (existing 62 notes)
    COMPONENT_DEPENDENCY_GRAPH.md       ← NEW
    COMPONENT_TO_PAGE_USAGE_MATRIX.md   ← NEW
    COMPONENT_EVOLUTION_TIMELINE.md     ← NEW (auto-refreshed)

Brain Outputs/understanding/frontend/
  components/<name>/
    OVERVIEW.md                         ← NEW for 61 components
  theme/
    TOKEN_TAXONOMY.md                   ← NEW
  architecture/
    (deeper docs land here)
  decisions/                            ← NEW (8 ADRs)
  AGENT_BRIEFS_FOR_KNOWLEDGE_PATH.md    ← NEW (the brief library)
  FRONTEND_KNOWLEDGE_PATH.md            ← THIS FILE
```

---

## How to use this path

### When you want to start

Tell the orchestrator (me) one of:

- **"start Tier 1"** → I spawn 6 parallel agents for OVERVIEW completion + author the Atlas + run the dependency + usage scripts
- **"start Tier 2"** → I spawn the architecture-doc agents
- **"start Tier 3"** → I spawn 8 ADR-authoring agents
- **"build the Token Taxonomy"** → I spawn just that one agent (the most leverage-per-hour task right now)
- **"build the Component Atlas"** → just the hub, 30 min
- **"all of Tier 1 + 2 in the background"** → I orchestrate every agent autonomously, you check in at the end

### When you have a specific question

The path doesn't have to be linear. You can also ask:

- **"explain `<falcon-data-table>` fully"** → I read all 6 dossier files + usage matrix + deps + git log
- **"explain Module Federation in 5 minutes"** → I summarize the Tier-2 topology doc
- **"what tokens does the typography scale have?"** → I read the @theme block + Token Taxonomy
- **"why don't we use PrimeNG?"** → I read ADR-001

### When you want to test the brain

- **"quiz me"** → I generate 10 questions from the path + test which I can answer with sources
- **"audit the knowledge"** → I report which dossiers are still incomplete, which architecture docs are missing

---

## Cost summary

| Tier | Wall time (with parallel agents) | What it buys |
|---|---|---|
| **Tier 1 — Foundation** | 4-6 h | Every component fully documented; one Atlas hub |
| **Tier 2 — Architecture** | 6-10 h | Every architectural question has a permanent answer |
| **Tier 3 — Decisions** | 4-6 h | The "why" of every major choice is recorded |
| **Tier 4 — Continuous** | 4 h setup, then near-zero ongoing | The knowledge stays current automatically |
| **Total** | **~25 h** | A frontend knowledge graph that explains itself |

---

## What this morning's work taught us

The "do all 5" run surfaced one critical learning that proves the value of this path:

> **R-NOOR-003 demands `text-noor-*` tokens that DO NOT EXIST in the workspace.**

This was hidden until Item 2 forced a migration that exposed it. **If we had the Token Taxonomy** (Tier 2, Step 9), this gap would have been visible from day one — saving the morning's confusion.

That's the value of this path: **knowing what you have prevents wasted effort.**

---

## Hard rules (path-wide)

- Brain repo ONLY. Never edit Falcon source code to build knowledge.
- Every artifact has a frontmatter type tag for Dataview queries.
- Every claim cites a source file + line.
- Every agent brief is in `AGENT_BRIEFS_FOR_KNOWLEDGE_PATH.md` for reproducibility.
- Mirror to Brain SK `outputs/` is additive only (`robocopy /E /XO`).
- All work auto-committed + auto-pushed to `github.com/ammarmaher/brain` main per the standing rule.

---

## Related

- `Brain Outputs/understanding/frontend/components/` — existing 62 dossiers
- `Brain Outputs/strategies/falcon-component-creation/` — existing creation methodology
- `Brain Outputs/understanding/rules/` — 39 rules + detector engines
- `Brain Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/` — morning's audit context
- `Brain Outputs/reports/brain-capability-audit/2026-05-14/` — last full brain audit (just preserved in commit 529ba97)
- `_obsidian/00-Home/Decisions Queue.md` — open decisions including R-NOOR-003 amendment

---

## Tags

#type/hub #type/knowledge-path #frontend #architecture #roadmap
