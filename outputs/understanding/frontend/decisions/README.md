---
type: adr-index
purpose: architectural-decision-records-hub
created: 2026-05-16
tier: 3
---

*** Falcon Frontend — Architecture Decision Records ***
*** The "why" behind every major frontend choice ***

# 📜 Architecture Decision Records (ADRs)

> The permanent record of **why** the Falcon frontend looks the way it does. Each ADR captures one major decision: context, choice, alternatives rejected, consequences, and verification path.

## Why ADRs

A working codebase records **what**. The brain knows **what** through the rulebook (39 rules), the Component Atlas (62 components), and the Architecture Atlas (6 deep-dives). But none of those answer **why** — why Falcon has its own component library, why Tailwind v4, why Module Federation across 3 apps, why Identity Service fronts Zitadel.

The why lives in chat history, memory files, post-mortems, and people's heads. When those leak, the team relearns the same lessons. ADRs make the why permanent.

## ADR catalog

| ID | Title | Status | Severity-of-reversal |
|---|---|---|---|
| [[ADR-001]] | Why Falcon library instead of PrimeNG | accepted | irreversible (PrimeNG fully removed) |
| [[ADR-002]] | Why Tailwind v4 instead of SCSS | accepted | high-cost reversal |
| [[ADR-003]] | Why Module Federation (3 apps) | accepted | very-high-cost reversal |
| [[ADR-004]] | Why Stencil for shadow components | accepted | medium-cost reversal |
| [[ADR-005]] | Why dual-render path (Shadow + Tailwind) | accepted | low-cost reversal (drop one variant) |
| [[ADR-006]] | Why Identity Service owns user lifecycle | accepted | medium-cost (rewire to Zitadel direct) |
| [[ADR-007]] | Why Tailwind v4 `@theme` over `@config` | accepted | low-cost reversal |
| [[ADR-008]] | Why feature-folder pattern (one file per type-folder) | accepted | low-cost reversal |

## ADR template

Every ADR follows this shape. See `ADR-TEMPLATE.md` in this folder for the canonical skeleton.

```yaml
---
type: adr
adr-id: ADR-XXX
title: One-line decision statement
status: accepted | superseded | rejected | proposed
date: YYYY-MM-DD
deciders: [Names]
supersedes: [list of ADR-IDs or empty]
superseded-by: [ADR-ID or empty]
---

# ADR-XXX — Title

## Context
What was happening before this decision. The pain that prompted it.

## Decision
What we chose. One paragraph, decisive.

## Alternatives considered
- Option A — rejected because ...
- Option B — rejected because ...
- Option C — rejected because ...

## Consequences
### Positive
- ...
### Negative
- ...
### Trade-offs accepted
- ...

## Verification
How we know this is the right call:
- Code paths that prove the decision is in effect
- Memory citations
- Audit results
- User feedback

## Related
- [[ADR-XXX]] — sibling decision
- Rule citations
- Memory citations
- Component / pattern references
```

## How ADRs evolve

1. **New decision lands** → write a `proposed` ADR
2. **Team agrees** → status → `accepted`
3. **Decision is revisited** → either confirm (no change) or supersede
4. **Decision is replaced** → old ADR status → `superseded`, new ADR's `supersedes: [old-id]`, old ADR's `superseded-by: new-id`
5. **Decision is reversed without replacement** → status → `rejected`, document the reversal reason

ADRs are **append-only history**. Never delete; only update status.

## Reading order for newcomers

If you're new to Falcon:

1. **ADR-001** (PrimeNG removal) — sets up the design system story
2. **ADR-002** (Tailwind v4) — the styling foundation
3. **ADR-004** (Stencil) — the component primitive
4. **ADR-005** (dual-render) — how components ship to Angular today + React/Vue tomorrow
5. **ADR-007** (@theme) — how tokens flow into utility classes
6. **ADR-008** (feature folders) — the file layout convention
7. **ADR-003** (Module Federation) — how the apps come together
8. **ADR-006** (Identity Service) — auth architecture

After reading the 8 ADRs: open `_obsidian/00-Home/Frontend Architecture Atlas.md` and the deep-dive docs make full sense.

## Where ADRs live

| Location | Purpose |
|---|---|
| `Brain Outputs/understanding/frontend/decisions/ADR-XXX-*.md` | Canonical SoT |
| `Brain SK/outputs/understanding/frontend/decisions/` | Git-tracked mirror |
| `Brain SK/_obsidian/35-Architecture/decisions/` | Vault graph nodes (thin wiki-links) |

## Related

- [[Frontend Architecture Atlas]] — Tier 2 deep-dives this ADR set explains the WHY of
- [[Component Atlas]] — Tier 1 component view
- [[Decisions Queue]] — open decisions (different concept — pending ADRs)
- [FRONTEND_KNOWLEDGE_PATH](../FRONTEND_KNOWLEDGE_PATH.md) — master roadmap

## Tags

#type/adr-index #frontend #architecture #tier-3
