# COMPLETED — bsa-deep-architecture-plan

- **Completed:** 2026-07-06 ~17:45
- **Task:** BSA perfect implementation plan at architecture depth — backend architecture + full API surface + integration wiring; frontend architecture + falcon-ui-core coverage audit; business fully traced to BR-BSA-*/C-* rulings.

## Deliverables (module `Brain Outputs\prd\modules\06-basic-send-application\`)

1. **ARCHITECTURE_BACKEND.md** — 13 sections: principles P1-P10 (BR-traced) · integration matrix (12 dependencies, existing-vs-proposed) · Mongo `FalconBsaDb` collections field-level (sendTransactions, recipientResults, conversations+messages, transactionStats, senderIds registry, destinationMap, outbox/idempotency/exports) · engine designs w/ pseudocode (compose pipeline, scheduler+sweep, WA batch reserve→commit|release loop w/ cancel-at-batch-edge + race outcome, Meta adapter + signed webhook processor, voice per-second engine + retry, stats/exports) · FULL API surface (19 UI endpoints w/ PES keys + public /public/v1/send + 3 skeleton APIs + webhooks) · PES seeding matrix · 6 Kafka topics · 19-error catalog · config keys · deployment/onboarding order (container-before-routes trap) · NFRs · 5 normative sequence walkthroughs · risk register (+ pointer to 20-item BE_CONTRACTS register).
2. **ARCHITECTURE_FRONTEND.md** — D-1 REVISED placement (NX lib `libs/basic-send` + Recipe A; MF remote rejected w/ evidence) · lib/console folder structures + ports (BSA_API_PORT) · Recipe A wiring distilled (10 steps w/ precedents) · screen×component map w/ coverage verdicts + traps · new-component backlog N1-N10 w/ wave placement + extensions E1-E8 · signal-store state design + polling · PES flags/guards · i18n/RTL/tokens (+ NEW dark-token requirement) · testing/parity protocol · wave re-grounding.
3. **Evidence files:** FE_LIBRARY_COVERAGE.md (113 rows: 74/16/23; audio trio + IVR canvas + WA preview discoveries; dormant confirm-dialog trap) · FE_WORKSPACE_WIRING.md (repo reality: consoles are the only remotes; Recipes A/B file:line) · BE_CONTRACTS.md (exact DTOs/enums/gateway JSON/PES shapes; 3 source contradictions; 20-item risk register) · evidence-templates-openapi.json (LIVE probe: templates-svc UP, 45 paths/52 ops — closes P-1 endpoint enumeration).
4. **Stitched:** IMPLEMENTATION_PLAN.md D-1/F0 revised · ARCHITECTURE_BACKEND diagram+templates row+risk pointer · OVERVIEW.md file table · vault 15-PRD note SoT table · memory file + MEMORY.md index.

## Method
3 parallel background agents (library coverage vs REACT_REFERENCE inventory + repo greps; backend contract extraction + live GET probes; workspace wiring archaeology) + main-loop authored architecture docs. No code changes, no commits, read-only probes only.

## Key corrections discovered
- **D-1 inverted:** BSA FE must be an NX LIBRARY consumed in-console, not an MF remote (only consoles are remotes; PRD navigation binds BSA inside them).
- Angular 21.2.9 / Tailwind v4 / PrimeNG fully removed / admin vitest runner FIXED (two stale memories corrected).
- templates-svc now 45 paths (was 42) — drifting branch.
- Brain-vs-source contradictions: PagedResult field names, eWalletBalanceType enum order, Provisioning `…Respose` typo confirmed real.

## Open decisions carried (unchanged)
D-2..D-10, P-2..P-4, Q-BSA-08 charging wording, V2-vs-V5 purchase model, Q-BSA-01/02 role scope — all listed in IMPLEMENTATION_PLAN §3 + QUESTIONS.md.
