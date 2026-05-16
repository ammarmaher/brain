---
type: hub
purpose: tier-4-continuous-knowledge-index
created: 2026-05-16
tier: 4
status: live
canonical-source: C:\Falcon\Brain Outputs\understanding\frontend\continuous\
---

*** Falcon Frontend — Continuous Knowledge Hub ***
*** Onboarding · Anti-patterns · Perf · Visual stories ***
*** Tier 4 of FRONTEND_KNOWLEDGE_PATH ***

# 🔄 Continuous Knowledge Hub

> The knowledge that keeps growing. Onboarding playbooks · anti-pattern catalog · performance budget tracker · visual component story. Each lives in `Brain Outputs/understanding/frontend/continuous/` and gets updated as the platform evolves.

## What lives here

| Doc | Purpose | Update cadence |
|---|---|---|
| 📖 [Onboarding Playbook](../../../Brain%20Outputs/understanding/frontend/continuous/ONBOARDING_PLAYBOOK.md) | Day 1 reading order — 12 docs in ~6h that get a newcomer to "ready to implement" | Updated when major architecture changes |
| 🚫 [Anti-Pattern Catalog](../../../Brain%20Outputs/understanding/frontend/continuous/ANTI_PATTERN_CATALOG.md) | "Things people tried but shouldn't have" — with real examples + alternatives | Grows whenever a new mistake is found |
| 📊 [Performance Budget Tracker](../../../Brain%20Outputs/understanding/frontend/continuous/PERFORMANCE_BUDGET_TRACKER.md) | Bundle sizes per app · budgets · regressions | Weekly via night-shift |
| 📸 [Visual Component Story](../../../Brain%20Outputs/understanding/frontend/continuous/VISUAL_COMPONENT_STORY.md) | One screenshot per component (62 components, snapshots populate over time) | Whenever a component is touched |

## The 4 dimensions of continuous knowledge

Tiers 1-3 captured the **state** of the platform: what components exist, what architecture is in place, what decisions were made. Tier 4 captures the **flow**:

1. **People flow** (Onboarding) — how new humans + agents enter the platform with shared understanding
2. **Mistake flow** (Anti-patterns) — what people get wrong, why, and how to recognize it next time
3. **Bytes flow** (Performance) — how the platform's weight evolves over releases
4. **Sight flow** (Visual stories) — what the platform looks like, indexed for fast recognition

Together these 4 make the knowledge graph **self-maintaining** — it learns from every interaction.

---

## 📖 Onboarding Playbook

**File:** [`continuous/ONBOARDING_PLAYBOOK.md`](../../../Brain%20Outputs/understanding/frontend/continuous/ONBOARDING_PLAYBOOK.md)

A 12-document reading order with verification questions. Designed for ~6 hours of focused reading on day one.

**The 12 readings:**

| # | Reading | Time |
|---|---|---|
| 1 | Component Atlas | 10 min |
| 2 | Frontend Architecture Atlas | 15 min |
| 3 | Folder Structure Deep-Dive | 30 min |
| 4 | Module Federation Topology | 30 min |
| 5 | Routing Topology | 20 min |
| 6 | Auth Flow Architecture | 45 min |
| 7 | State Management Architecture | 20 min |
| 8 | Token Taxonomy | 30 min |
| 9 | RULES_INDEX (skim) | 45 min |
| 10 | The 8 ADRs (Context + Decision sections only) | 60 min |
| 11 | Anti-Pattern Catalog | 30 min |
| 12 | Add Client flow playbook | 60 min |

End with the **8 verification questions** — if you can answer them with file citations, you're ready to implement.

---

## 🚫 Anti-Pattern Catalog

**File:** [`continuous/ANTI_PATTERN_CATALOG.md`](../../../Brain%20Outputs/understanding/frontend/continuous/ANTI_PATTERN_CATALOG.md)

Consolidated registry of "don't do this" across 8 categories — populated by an agent harvesting findings from Tiers 1-3 plus all morning audits + memory. Status: 🟠 agent running.

The catalog will include (sources harvested):

- **Routing** — 7 anti-patterns from Agent F (dead redirects, zombie prime-ng routes, commented-out guards, etc.)
- **Auth** — 10 anti-patterns from Agent E (don't store tokens in localStorage, don't call Zitadel directly, etc.)
- **State management** — anti-patterns from Agent C (BehaviorSubject misuse, setTimeout in zoneless, NgRx temptation)
- **Tokens / theming** — 9 gaps from Agent A (non-monotonic scale, dual z-index ladder, etc.)
- **Folder structure** — orphans + stale duplicates from Agent D
- **Component composition** — from per-component GAPS_AND_UPGRADES files
- **Federation** — 8 anomalies from Agent B
- **Operational** — from memory + Decisions Queue

Target: at least 40 anti-patterns, each with severity, real example, and correct alternative.

---

## 📊 Performance Budget Tracker

**File:** [`continuous/PERFORMANCE_BUDGET_TRACKER.md`](../../../Brain%20Outputs/understanding/frontend/continuous/PERFORMANCE_BUDGET_TRACKER.md)

**Current baselines (from memory, awaiting verification):**

| App | main.js raw | main.js gz |
|---|---:|---:|
| admin-console | 1,210 KB | 335 KB |
| host-shell | _to measure_ | _to measure_ |
| management-console | _to measure_ | _to measure_ |

**Historical wins** (captured in the ledger for celebration + learning):

- 2026-05-10 Wave 8 PrimeNG purge: admin-console **−1,043 KB raw / −233 KB gz** (−46% / −41%)
- 2026-05-09→10 v3.1 revamp: host-shell **−55% / −56%**, management-console **−33% / −42%**, ~11 MB raw / ~3 MB gz removed total

**Proposed budgets** (need lock-in via decision):

- admin-console: hard 1,500 KB raw / 400 KB gz; soft 1,250 / 350
- host-shell: TBD after first measurement
- management-console: grows with features

**Open decisions:** D-21 (lock hard limits), D-22 (add build step to night-shift), D-23 (add bundle-analyzer)

---

## 📸 Visual Component Story

**File:** [`continuous/VISUAL_COMPONENT_STORY.md`](../../../Brain%20Outputs/understanding/frontend/continuous/VISUAL_COMPONENT_STORY.md)

Per-component screenshot index. **Status: scaffold today, snapshots populate over time.**

**Catalog shape:** for each of the 62 components, a row showing thumbnail snapshots for `default · hovered · focused · disabled · error · rtl · dark` states. All grouped by category (matches Component Atlas).

**Capture priorities** documented in the file:

- 🔴 Critical first: falcon-button, falcon-input, falcon-data-table, falcon-dropdown, falcon-calendar + falcon-date-picker
- 🟠 Important next: all form inputs, falcon-alert-dialog, falcon-tabs, falcon-stepper, falcon-empty-state
- 🟢 Nice-to-have: layout primitives, legacy components

**Tooling needed (Tier 4 enhancement):** Playwright config + capture scripts at `tools/snapshot/` — not done today, listed in the file's action items.

---

## How Tier 4 keeps the brain alive

Tiers 1-3 are **mostly static** — once written, they update when architecture changes (probably every few weeks). Tier 4 is **always changing**:

| Event | What updates |
|---|---|
| New developer joins | They follow Onboarding Playbook; if anything was confusing, the playbook gets edited |
| Audit finds new violation | If repeatable, it gets added to Anti-Pattern Catalog |
| Release ships | Bundle size goes into Performance Budget Tracker ledger |
| Component visual changes | New snapshot captured + indexed in Visual Component Story |

Tier 4 makes the brain a **living organism** instead of a snapshot.

---

## Today's Tier 4 status

- ✅ [Onboarding Playbook](../../../Brain%20Outputs/understanding/frontend/continuous/ONBOARDING_PLAYBOOK.md) — full draft, 12-reading sequence, 8 verification questions
- ✅ [Anti-Pattern Catalog](../../../Brain%20Outputs/understanding/frontend/continuous/ANTI_PATTERN_CATALOG.md) — **71 anti-patterns** across 8 categories (12 🔴 · 46 🟠 · 13 🟢)
- ✅ [Performance Budget Tracker](../../../Brain%20Outputs/understanding/frontend/continuous/PERFORMANCE_BUDGET_TRACKER.md) — baselines + ledger + proposed budgets + measurement protocol
- ✅ [Visual Component Story](../../../Brain%20Outputs/understanding/frontend/continuous/VISUAL_COMPONENT_STORY.md) — schema + index scaffold for all 62 components (snapshots populate over time)

### 🔴 Top 3 anti-patterns to fix FIRST (per Anti-Pattern agent)

1. **A-AP-10** — `auth/logout` never called from frontend (security blast radius, ~30 min fix)
2. **R-AP-06** — `adminConsoleGuard` commented out (defense-in-depth disabled, one-line fix)
3. **C-AP-01** — Stencil `@Prop()` clashes with `HTMLElement` member names (silent dist-emission skip, needs build-time gate)

## Related

- [FRONTEND_KNOWLEDGE_PATH](../../../Brain%20Outputs/understanding/frontend/FRONTEND_KNOWLEDGE_PATH.md) — master roadmap (Tiers 1-4)
- [[Component Atlas]] — Tier 1
- [[Frontend Architecture Atlas]] — Tier 2
- [[Decisions Queue]] — open decisions including D-21/22/23 from this hub
- [[AMMAR_BRAIN_HOME]]

## Tags

#type/hub #frontend #continuous-knowledge #tier-4 #knowledge-graph
