---
type: hub
purpose: master-architecture-view
created: 2026-05-16
tier: 2
canonical-source: C:\Falcon\Brain Outputs\understanding\frontend\architecture\
status: in-progress
---

*** Falcon Frontend Architecture Atlas ***
*** The single hub for how the Falcon frontend is structured ***
*** Tier 2 deliverable of FRONTEND_KNOWLEDGE_PATH ***

# 🏛 Frontend Architecture Atlas

> The single place where you can see **how the Falcon frontend is wired together** — apps, libs, federation, state, auth, routing, theme. Each section links to a deep-dive document; this hub is the index.

## Why this exists

Tier 1 ([Component Atlas]) answered "what components do we have?". Tier 2 answers the bigger questions:

- *How do the 3 Angular apps work together?*
- *What's the canonical token scale? Does `text-noor-*` exist?*
- *How does the user log in?*
- *What route serves what page?*
- *Should I use a signal, a service, or a facade?*

Each subsection has a permanent deep-dive doc. This Atlas links them all.

---

## 🎨 Theme + Token Taxonomy

**Doc:** [Token Taxonomy](../../../Brain%20Outputs/understanding/frontend/architecture/TOKEN_TAXONOMY.md) _(populated by Agent A)_

**Quick answer:**

| Question | Answer |
|---|---|
| Where is the canonical theme? | _populated by agent_ |
| Does `text-noor-*` exist? | _agent will resolve the morning's puzzle_ |
| Typography scale | _agent will list_ |
| Color palette families | _agent will list_ |
| Spacing scale | _agent will list_ |

Status: 🟠 agent running

---

## 🧱 Module Federation Topology

**Doc:** [Module Federation Topology](../../../Brain%20Outputs/understanding/frontend/architecture/MODULE_FEDERATION_TOPOLOGY.md) _(populated by Agent B)_

**Quick answer:**

| Question | Answer |
|---|---|
| Host app | _populated by agent_ |
| Remote apps | _populated by agent_ |
| Shared dependencies | _populated by agent_ |
| Routes per app | _populated by agent_ |

Status: 🟠 agent running

---

## 🧠 State Management Architecture

**Doc:** [State Management Architecture](../../../Brain%20Outputs/understanding/frontend/architecture/STATE_MANAGEMENT_ARCHITECTURE.md) _(populated by Agent C)_

**Quick answer:**

| Question | Answer |
|---|---|
| Default state primitive | _populated by agent_ |
| When to use a service | _populated by agent_ |
| When to use a facade | _populated by agent_ |
| RxJS allowed? | _populated by agent_ |

Status: 🟠 agent running

---

## 📂 Folder Structure Deep-Dive

**Doc:** [Folder Structure Deep-Dive](../../../Brain%20Outputs/understanding/frontend/architecture/FOLDER_STRUCTURE_DEEP_DIVE.md) _(populated by Agent D)_

**Quick answer:**

| Question | Answer |
|---|---|
| `apps/` vs `libs/` | _populated by agent_ |
| Inside `libs/falcon-ui-core/` | _populated by agent_ |
| Inside `libs/falcon/` | _populated by agent_ |
| Where do new features live? | _populated by agent_ |

Status: 🟠 agent running

---

## 🔐 Auth Flow Architecture

**Doc:** [Auth Flow Architecture](../../../Brain%20Outputs/understanding/frontend/architecture/AUTH_FLOW_ARCHITECTURE.md) _(populated by Agent E)_

**Quick answer:**

| Question | Answer |
|---|---|
| Auth provider | _populated by agent_ |
| Login flow steps | _populated by agent_ |
| Token storage | _populated by agent_ |
| Refresh strategy | _populated by agent_ |

Status: 🟠 agent running

---

## 🗺 Routing Topology

**Doc:** [Routing Topology](../../../Brain%20Outputs/understanding/frontend/architecture/ROUTING_TOPOLOGY.md) _(populated by Agent F)_

**Quick answer:**

| Question | Answer |
|---|---|
| Per-app routes count | _populated by agent_ |
| Federation routes | _populated by agent_ |
| Guard types | _populated by agent_ |
| Lazy boundaries | _populated by agent_ |

Status: 🟠 agent running

---

## How this Atlas evolves

Tier 2 agents are running in parallel. As each completes:

1. Their deep-dive doc lands under `Brain Outputs/understanding/frontend/architecture/`
2. Mirrored to `Brain SK/outputs/understanding/frontend/architecture/`
3. This Atlas gets updated with the agent's "quick answer" section
4. Commit + push

The 🟠 markers above flip to ✅ as deliverables land.

## What Tier 2 unlocks

Once all 6 deep-dives exist:

- Newcomer onboarding goes from days to hours (one hub → all answers)
- Future agents brief themselves on architecture in 5 min
- R-NOOR-003 misalignment never happens again (Token Taxonomy catches it)
- Federation-related routing bugs become debuggable (Topology shows the wiring)
- State management discussions reference a single doctrine

## Related

- [[Component Atlas]] — Tier 1 view of all 62 components
- [[Decisions Queue]] — open decisions including R-NOOR-003 amendment
- [FRONTEND_KNOWLEDGE_PATH](../../../Brain%20Outputs/understanding/frontend/FRONTEND_KNOWLEDGE_PATH.md) — the master roadmap
- [[RULES_INDEX]] — the rulebook hub
- [[AMMAR_BRAIN_HOME]]

## Tags

#type/hub #frontend #architecture-atlas #tier-2 #knowledge-graph
