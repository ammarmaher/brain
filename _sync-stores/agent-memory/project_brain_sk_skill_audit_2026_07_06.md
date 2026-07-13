---
name: brain-sk-skill-audit-2026-07-06
description: "Full 96-artifact Brain SK skill audit (2026-07-06) — scores, migration-inversion finding, 12 proposed new skills; report in Brain Outputs/reports/brain-sk-skill-audit-2026-07-06"
metadata: 
  node_type: memory
  type: project
  originSessionId: fd5efd67-f5ad-4008-ae05-792a1e224189
---

2026-07-06: 18-agent audit of ALL skill stores (Brain SK v8/domains/brand/imported/legacy-v7, .claude/skills, .claude/commands, brain-skills/code-skills) = 96 artifacts. Verdicts: 17 KEEP / 43 ENHANCE / 27 MERGE / 4 ARCHIVE / 5 BROKEN, avg ≈67%. Full report: `C:\Falcon\Brain Outputs\reports\brain-sk-skill-audit-2026-07-06\SKILL_AUDIT_REPORT.md`.

Key durable facts:
- **Migration inversion:** Brain SK v8 skills (html/react/screenshot-to-angular, business-understanding, backend-api-understanding, pes-permission-analysis, validation-rules, testing-qa) are 25-line boilerplate stubs (30-40%); the real implementations live in `Brain SK/skills/legacy-v7/` (55-82%). Best-in-tree: falcon-input-render-debugging 95%, Falcon Eyes 93%, /brain-grounded 93%, pr-review-governance 92%, page-learning 92%, incremental-component-scan 92%, get-shit-done 92%.
- **BROKEN (misleading, fix or delete):** adnan (all 7 repo paths wrong — repos live under C:/Falcon/Falcon/), .claude/commands/CLAUDE.md + genius-brain.md (stale v7 governance strays), Brain SK domains/business entry, legacy-v7/20-claude-implementation-engineer.
- **Repo truths skills get wrong:** FE is Angular 21.2.9/Nx 22.7.1 (not 20), PrimeNG uninstalled; commerce CQRS is plain-DTO + per-use-case handlers (ZERO IRequest<>, MediatR only for domain events) — ammar-core-commerce describes the wrong pattern; compose stack lives at C:/Falcon/Falcon/Falcon (NOT falcon-essentials/, which is a non-git scrap dir); comm-realtime main branch is source-empty (code on feature/falcon-on-behalf-routing + night-shift/due-payment-signal-fixes).
- **No specialist skill exists for:** templates-svc, contact-group-svc, access-svc (PES/T2.PES), comm-realtime — all also missing from night-shift-backend's service list.
- **Top proposed new skills:** falcon-fe-new-screen-walkthrough 92%, ammar-core-templates 88%, ammar-core-access-pes 85%, falcon-kafka-event-map 82%, falcon-local-stack-runbook 80%, falcon-seed-data-recipes 74%, falcon-fe-dev-workflow 72%.
- Related: [[feedback_brain_sk_obsidian_canonical_vault_2026_05_20]], [[feedback_never_modify_code_or_commit_2026_05_20]]
