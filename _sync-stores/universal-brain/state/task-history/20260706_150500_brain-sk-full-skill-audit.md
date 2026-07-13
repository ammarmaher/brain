# Task: Brain SK full skill audit + project structure map + enhancement plan

**Date:** 2026-07-06 · **Status:** COMPLETED (report-only; no skill/source files modified)
**Note:** current-task.json was taken over mid-run by a parallel session (bsa-prd-v5); this task's closure is recorded here only.

## What ran
18-agent workflow (10 skill auditors, 5 structure mappers, 1 adversarial broken-ref verifier, 1 gap analyst, 1 completeness critic). Every path claim disk-verified; 120 broken-ref claims re-checked adversarially (120 confirmed, 0 refuted).

## Scope covered
96 skill artifacts across 8 stores: Brain SK v8 skills (18), Brain SK domains (16), Brain SK routing artifacts (8), brand (3), imported-business (5), legacy-v7 (14), .claude/skills (16), .claude/commands (15+strays), brain-skills/code-skills (2). Plus structure maps: falcon-web-platform-ui, 9 backend svc repos, 2 gateways, essentials/compose stack, portal, 7 knowledge stores, 6 misc top-level dirs.

## Verdict distribution
17 KEEP · 43 ENHANCE · 27 MERGE · 4 ARCHIVE · 5 BROKEN. Average score ≈ 67%.

## Headline findings
1. **Migration inversion:** v8 "canonical" skills (html/react/screenshot-to-angular, business-understanding, backend-api-understanding, pes-permission-analysis, validation-rules, testing-qa) are 25-line stubs (30-40%) while the REAL content sits in legacy-v7 (55-82%). Content and pointer are swapped.
2. **Path-resolution rot** is the dominant failure mode (adnan: all 7 repo paths wrong; brain-* commands all fail from C:/Falcon cwd; falcon-essentials vs C:/Falcon/Falcon/Falcon compose stack).
3. **Freshness cliff 2026-05-28/29:** graph, authority ledger, old-UI snapshot, registries frozen while June/July work shipped. brain-context stats 3x-inflated vs live graph (535 nodes actual).
4. **Governance conflict:** Brain SK auto-commit/push mandate vs platform standing never-commit rules — needs one written carve-out.
5. **Coverage skew:** templates-svc, contact-group-svc, access-svc(PES), comm-realtime have NO specialist skill and are absent from night-shift-backend's list — exactly the highest-velocity services. comm-realtime main branch has NO source (code on 2 feature branches).
6. **12 new skills proposed** (top: falcon-fe-new-screen-walkthrough 92%, ammar-core-templates 88%, ammar-core-access-pes 85%, falcon-kafka-event-map 82%, falcon-local-stack-runbook 80%).

## Deliverable
Full report: `C:\Falcon\Brain Outputs\reports\brain-sk-skill-audit-2026-07-06\SKILL_AUDIT_REPORT.md` (all 96 skills with scores/issues/enhancements, structure maps, gap analysis, critic limitations).
