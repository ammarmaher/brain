---
name: Backend technical gaps registered as GAP-BE-01 through GAP-BE-11
description: 11 backend gaps from Wave 5 deep-dives + Wave 4 page-mining persisted into falcon-wiki/70-Gaps/ as GAP-BE-* with explicit why-must-fill rationale per each
type: project
originSessionId: 2fdefc53-e967-4763-843a-47867ca3cb18
---
11 technical backend gaps registered into `C:\Falcon\falcon-wiki\70-Gaps\` on 2026-05-18 as `GAP-BE-01` through `GAP-BE-11`, each with frontmatter (severity / status / scope / service / controller / category / related-question link), `## Why this gap must be filled` section, and `## Recommended fix` with code-shape suggestion. All 11 cross-reference the originating `_pending-questions/wave-*` file in the authority dataset. Files were authored as REPORT-ONLY — no backend code was changed in the session that registered them.

**Why:** User explicitly asked to "save these gaps as technical backend gaps" and "clarify why we need to fill these gaps". Brain protocol HALT-AND-FLAG requires every security/data-integrity fork to be persisted with rationale, not just discussed. The pending-questions files capture the F-* fork classification + answer matrix, but they don't surface in the falcon-wiki Dataview-driven Gaps MOC — so before today, the team had no single dashboard showing open backend gaps. Now `00-MOCs/Gaps.md` auto-lists them.

**How to apply:** When asked about "open backend issues" or "what needs fixing in backend", route to `C:\Falcon\falcon-wiki\70-Gaps\GAP-BE-*.md` first (severity-ordered: 01-04 HIGH, 05-10 MEDIUM, 11 LOW). For any new backend gap discovered: (a) author the pending-question in `_pending-questions/` first per night-shift protocol, (b) write the GAP-BE-* file mirroring the GAP-BE-01 template (frontmatter + What's broken + Why must fill + Risk if unfilled + Recommended fix + Cross-references), (c) assign next available `GAP-BE-NN` number. Filename convention: `GAP-BE-NN-Kebab-Headline.md`. Do NOT touch backend code on a "register gap" task; the gap file IS the deliverable.

## Registry (severity-ordered)

| Gap | Severity | Service | One-liner |
|---|---|---|---|
| GAP-BE-01 | HIGH (security) | Commerce | AccountHierarchyController missing client tenant-isolation guard |
| GAP-BE-02 | HIGH (security) | Commerce | InformationController has commented-out role check; permissive write path |
| GAP-BE-03 | HIGH (functional) | Provisioning | LookupSeedData returns empty lists; Add Client wizard pickers broken |
| GAP-BE-04 | HIGH (ambiguity) | Identity | Q-UM-13 admin OTP path undefined; blocks Edit User epic |
| GAP-BE-05 | MEDIUM (security) | Commerce | SettingController + InformationController missing class-level [Authorize] |
| GAP-BE-06 | MEDIUM (security) | Charging | TestKafkaController [AllowAnonymous] + namespace/response-shape drift |
| GAP-BE-07 | MEDIUM (functional) | Commerce | SettingController.Get calls AutoMapper twice (paste error/intent-unclear) |
| GAP-BE-08 | MEDIUM (functional) | Provisioning | Lookup regex search may not escape metacharacters |
| GAP-BE-09 | MEDIUM (ambiguity) | Identity | BR-UM-21 reject email+phone together; handler is permissive |
| GAP-BE-10 | MEDIUM (ambiguity) | Identity | BR-UM-29 30-min idle timeout — token-TTL vs per-tenant config undefined |
| GAP-BE-11 | LOW (UX) | Provisioning | Lookup name search is case-sensitive; PRD implies case-insensitive |

## Items NOT registered as GAP-BE (intentionally excluded)

These remain as `_pending-questions/*` only — they are not "technical backend gaps":

- **Q-CC-01** (`wave-2-03-contract-Q-CC-01.md`) — PRD scope question for Module 03 folder vs body
- **Q-UM-07** (`wave-2-02-user-Q-UM-07.md`) — Drive-export operational issue (Permission Sheet Tab 2)
- **WAVE-1-AND-10 prereq blockers** — missing `keys.env` + missing brain-skills Skill.md backings (infrastructure, not backend code)
