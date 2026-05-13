*** PRD Understanding - Root Documents - BUSINESS_RULES ***

# root-documents - Business Rules

> The two files at Drive root (`Points to be covered later` and `Copilot 4DevOps`) are **NOT PRDs** and carry **no runtime business rules**. This file exists for symmetry with the other modules and to record meta-rules about how these documents should be handled.

## Meta-Rules About These Documents

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-RD-01 | `Points to be covered later` is a backlog of cross-cutting open topics. Each item must be re-homed in the relevant module's `QUESTIONS.md` (not invented as a business rule). | latest-prd.md:14-29; understanding.md:8-12 | [CONFIRMED] |
| BR-RD-02 | When a backlog item is addressed by a PRD revision, it must be removed from BOTH `Points to be covered later` on Drive AND from this module's `latest-prd.md`. | understanding.md:24 | [CONFIRMED] |
| BR-RD-03 | `Copilot 4DevOps` is a prompt library for AI-assisted product work. It does NOT define any runtime business rule. | latest-prd.md:35-50; understanding.md:7 | [CONFIRMED] |
| BR-RD-04 | `Copilot 4DevOps` revision tracking is OPTIONAL - only re-sync if the product team updates the prompt library. | understanding.md:25 | [CONFIRMED] |

## What This File is NOT

- This module has **no domain entities** (see `ENTITIES.md`).
- This module has **no workflows** (see `WORKFLOWS.md`).
- This module has **no PRD-vs-code gaps**, but DOES surface cross-cutting questions that affect multiple modules (see `GAPS.md`).
