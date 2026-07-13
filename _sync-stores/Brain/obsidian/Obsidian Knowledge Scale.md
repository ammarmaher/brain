---
title: Obsidian Knowledge Scale
type: brain-knowledge-scale
purpose: Measures how strong and complete the Brain knowledge is after each Get Shit Done run.
tags: [brain, knowledge-scale, gsd-review, obsidian]
updated: 2026-05-19
---

# Obsidian Knowledge Scale

This file measures how strong and complete the Brain knowledge is after each
Get Shit Done run. Every GSD run scores the ten areas below, appends a
`## Review:` section under [[#Review History]], and refreshes the Current
Overall Score. All scoring follows [[#Scoring Rules]] — never inflate.

## Score Areas

| Area | Score 0-100 | Meaning |
|---|---:|---|
| Architecture Knowledge | 0-100 | How well architecture decisions, boundaries, wiki rules, and source-of-truth rules are documented |
| Frontend Knowledge | 0-100 | How well components, tokens, Tailwind rules, pages, and UI patterns are understood |
| Backend Knowledge | 0-100 | How well controllers, DTOs, validators, services, events, and database rules are documented |
| Full-Stack Contract Knowledge | 0-100 | How well FE/BE contracts, APIs, gateway routes, and error mappings are linked |
| Business Knowledge | 0-100 | How well PRD/BRD rules, actors, statuses, validations, and flows are documented |
| Security Knowledge | 0-100 | How well PES, roles, tenant isolation, auth, payment risks, and vulnerabilities are tracked |
| Testing Knowledge | 0-100 | How well test cases, test data, QA scenarios, and verification evidence are documented |
| Token / Design System Knowledge | 0-100 | How well Falcon Tailwind Tokens, design tokens, component styling rules, and token gaps are tracked |
| Agent Improvement Knowledge | 0-100 | How well agent failures, improvements, missed checks, and skill updates are recorded |
| Review Evidence Quality | 0-100 | How complete the evidence is: code, commands, build, runtime, screenshots, network, DB, docs |

## Overall Brain Confidence

Overall Score = average of all areas.

**Current Overall Score:** ~79/100 — Strong enough for guided implementation
(with cited gaps; runtime email delivery unverified — no local SMTP). Last run:
gsd-2026-06-23-pr42786-unlock-message (2026-06-23). See [[#Review History]].

| Score | Meaning |
|---:|---|
| 0-30 | Weak knowledge, risky to automate |
| 31-50 | Partial knowledge, many gaps |
| 51-70 | Usable but needs review |
| 71-85 | Strong enough for guided implementation |
| 86-95 | Very strong, safe for advanced automation with gates |
| 96-100 | Excellent, but still requires evidence and approval gates |

## Mandatory Per-Review Update

Every Get Shit Done run must append a section to [[#Review History]] using the
template below. `<review-name>` and `<date>` are placeholders. `Before` is the
`After` value from the most recent prior entry (or `n/a` on the first run);
`Change` is `After - Before`. Every score must be defensible from the cited
review evidence and must obey [[#Scoring Rules]].

```
## Review: <review-name> — <date>

| Area | Before | After | Change | Evidence |
|---|---:|---:|---:|---|
| Architecture Knowledge |  |  |  |  |
| Frontend Knowledge |  |  |  |  |
| Backend Knowledge |  |  |  |  |
| Full-Stack Contract Knowledge |  |  |  |  |
| Business Knowledge |  |  |  |  |
| Security Knowledge |  |  |  |  |
| Testing Knowledge |  |  |  |  |
| Token / Design System Knowledge |  |  |  |  |
| Agent Improvement Knowledge |  |  |  |  |
| Review Evidence Quality |  |  |  |  |

## Gaps Found

- 

## New Candidate Memories

- 

## Approved Memories Applied

- 

## Agent Improvements Proposed

- 

## Next Knowledge Priorities

- 
```

## Scoring Rules

**Do not inflate scores.**

- If evidence is missing, the score must stay low.
- If runtime was not verified, Review Evidence Quality cannot be above 80.
- If backend contracts were not inspected, Backend Knowledge and Full-Stack
  Contract Knowledge cannot be above 70.
- If security review did not run, Security Knowledge cannot be above 60.

A score is a measurement, not a goal. Honest low scores are correct and useful;
inflated scores corrupt every downstream automation decision. An inflated or
unjustified score is itself an agent failure — record it in the review's
`agent-improvement-notes.md`.

## Review History

_Per-review entries are appended below, newest first. Each is one
`## Review: <review-name> — <date>` block produced from the template above._

## Review: gsd-2026-06-21-contact-group-pr42603 — 2026-06-21

Decision: REQUEST CHANGES (0 blocker / 1 high / 6 medium / 13 low / 3 info; 23 total). Mode: REVIEW-ONLY. Scope: PR 42603 falcon-core-contact-group-svc — remove hand-coded view-authorization rules checking (`ContactGroup.IsViewableBy` gone everywhere; 3 view handlers byte-identical to origin/main); keep PES integration + Validations.xlsx field validation. Single squashed commit 00ac232 vs origin/main (20 files). Boss-alignment goal MET per all 8 seniors. Overall: **~78/100**.

| Area | Before | After | Change | Evidence |
|---|---:|---:|---:|---|
| Architecture Knowledge | 82 | 84 | +2 | write=PES / view=in-code asymmetry mapped + judged coherent (GSD-007 BA); PEP mirrors IdentityClient pattern, CQRS/DDD layering correct (GSD-002/011/012 Architect); dead @system branch + inconsistent Falcon read-only guard + stale docstring surfaced |
| Frontend Knowledge | 88 | 88 | 0 | backend-only PR — Tailwind/token/Falcon-component checklist N/A (stated, not skipped); view-auth removal confirmed FE-safe (no new 403 on read paths) |
| Backend Knowledge | 72 | 88 | +16 | PEP wire contract, subject normalization, two-resource Share fan-out, fail-closed semantics, ReDoS-safe regex, DI, EN/AR resx parity all CODE-VERIFIED against the live access-svc PES engine (E-04); minor resilience-handler + 'system' tenant-guard gaps (GSD-013/021) |
| Full-Stack Contract Knowledge | 78 | 84 | +6 | view handlers literal zero-diff vs main; FE/BE error-key rename ForbiddenTo*->NotAuthorizedTo* contract delta tracked (GSD-009); 2 initial High e2e risks resolved on verification (keying REFUTED GSD-022, PES-dependency DOWNGRADED GSD-020) |
| Business Knowledge | 80 | 82 | +2 | field validation confirmed faithful encoding of Validations.xlsx (2-50, emoji-reject, optional ref-id); FE/BE parity edges mapped (emoji range narrower than FE \p{Extended_Pictographic} GSD-003, clear/trim/UTF-16 GSD-014/015/016) |
| Security Knowledge | 80 | 85 | +5 | security review DID run (not capped) — net tightening, removal complete + clean (no fail-open, no cross-tenant/IDOR view leak, tenant-scoped queries retained), PES strictly fail-closed, Falcon read-only Share guard preserved + ordered first; no security objection (GSD-023 info-only pre-existing doc) |
| Testing Knowledge | 82 | 70 | -12 | High coverage gap — new PolicyEnforcer PEP has ZERO direct unit tests; fail-closed + Share fan-out unverified so 168/168 overstates auth confidence (GSD-001); emoji-range/len-2/cross-tenant/short-circuit gaps (GSD-004/017/018/019) |
| Token / Design System Knowledge | 84 | 84 | 0 | N/A this run — backend-only PR, no token surface touched |
| Agent Improvement Knowledge | 80 | 82 | +2 | adversarial-verification discipline recorded — two initially-High findings re-tested and resolved (GSD-022 REFUTED, GSD-020 DOWNGRADED) rather than shipped inflated |
| Review Evidence Quality | 80 | 80 | 0 | capped 80 — build PASS (0w/0e E-01), restore/NuGet-audit PASS no-suppress (E-02), tests PASS 168/168 (E-03), keying CODE-VERIFIED (E-04); PES runtime allow/deny for edit/delete NOT verified (only share live-verified per team memory) |

## Gaps Found

- GSD-001 (sole High): PolicyEnforcer (the new PEP) has ZERO direct unit tests — fail-closed (4xx/5xx/malformed/missing-subject -> deny), the two-resource Share own/share-other OR fan-out, and Falcon@system vs client@tenant subject keying are all unexercised; handler tests only mock IPolicyEnforcer, so 168/168 overstates authorization confidence. Runtime: PES allow/deny for edit/delete NOT verified (only share is live-verified per team memory); creator edit/delete happy-path not yet runtime-proven (GSD-020). Cross-service subject keying CODE-VERIFIED, not runtime (GSD-022, E-04). Pre-existing list-vs-detail capability gap (AO/NA can LIST but 403 on details/contacts/download) — on main, NOT introduced here (GSD-007). Empty Access.BaseUrl footgun (silent blanket 403 if a manifest omits the override; GSD-006). Backend emoji guard narrower than FE (GSD-003).

## New Candidate Memories

- ~7 candidates: (1) PolicyEnforcer-PEP-needs-direct-tests testing pattern (GSD-001); (2) empty-Access.BaseUrl-fail-closed runtime-wiring footgun + fail-fast-at-startup rule (GSD-006); (3) backend-ContainsEmoji-must-match-FE-\p{Extended_Pictographic} validation rule / generated-table candidate (GSD-003); (4) write=PES / view=in-code authorization-boundary ADR for contact-group (GSD-007); (5) dead @system PolicyEnforcer branch + orphaned ForbiddenTo{Edit,Delete} keys cleanup lesson (GSD-002/008); (6) adversarial-verification-before-severity discipline (keying REFUTED / PES-dependency DOWNGRADED — GSD-020/022); (7) live edit/delete PES smoke-test as the residual gate before prod reliance (GSD-020). All CANDIDATE — see the review's `obsidian/memory-update-candidates.md`.

## Approved Memories Applied

- None — REVIEW-ONLY, no promotion this run (0 applied).

## Agent Improvements Proposed

- Add a PolicyEnforcer-direct-test requirement to the Business Tester checklist whenever a new PEP/authorization wire-call is introduced (mocking IPolicyEnforcer in handler tests does not count as authorization coverage). Keep the adversarial re-test step that downgraded GSD-020 and refuted GSD-022 standard for any initially-High end-to-end finding. Treat an empty fail-closed BaseUrl as a startup fail-fast / health-check item, not a silent 403.

## Next Knowledge Priorities

- Add PolicyEnforcerTests (fail-closed 4xx/5xx/malformed/missing-subject -> deny; Share builds exactly two resources vs Edit/Delete one; Falcon->@system, client->@tenant) — closes GSD-001 High. Live-verify a real creator JWT can edit + delete their own group (200) and a denied role gets 403 — closes the GSD-020 runtime residual and fully closes GSD-022 keying. Ensure every deployment manifest sets Access.BaseUrl + add the fail-fast/health-check (GSD-006). Broaden backend ContainsEmoji to the full Extended_Pictographic set or honestly downgrade the docstring (GSD-003).

## Review: gsd-2026-06-07-edit-user-v2-fe-pes — 2026-06-08

Decision: REQUEST CHANGES (0 blocker / 4 high / 13 medium / 27 low / 12 info; 56 total). Mode: IMPLEMENT-FIXES (re-verify of 49 prior findings). Disposition: 22 fixed / 5 open / 29 wont-fix. Overall: **~81/100**.

| Area | Before | After | Change | Evidence |
|---|---:|---:|---:|---|
| Architecture Knowledge | 80 | 82 | +2 | Fail-open/fail-closed PES inversion mapped (B05) -> tri-state facade ADR (MUC-001); port-boundary confirmed (B42) |
| Frontend Knowledge | 84 | 88 | +4 | Read-only-immutable-field pattern + payload guards code-read (B01/B03/B07/B11); Stencil verify-field gating, i18n en+ar parity, token mandate PASS |
| Backend Knowledge | 70 | 72 | +2 | capped low — PES seed line-verified (BuiltInRoleCatalog.cs, dotnet test 107/107) but Identity backend NOT inspected (out of scope) |
| Full-Stack Contract Knowledge | 76 | 78 | +2 | capped — FE<->PES action-string contract byte-verified (B08 PRODUCED==GOLDEN==seed); Identity DTO lane not re-read |
| Business Knowledge | 78 | 80 | +2 | Universal admin contact-deferral rule surfaced (MUC-002, B09/B10/B22/B53); status-freeze + self-edit lifecycle mapped |
| Security Knowledge | 82 | 80 | -2 | security review DID run (not capped); honest re-score — self/other ABAC gap (B04) + display fail-open (B15/B39) remain open, so not raised |
| Testing Knowledge | 72 | 82 | +10 | real nx/vitest target wired (B02), falcon 294/1 GREEN + validation 18 + PES 107 + admin B36 2; +66 new slice tests; typecheck gap found (B54) |
| Token / Design System Knowledge | 80 | 84 | +4 | token mandate PASS (zero hardcoded hex/rgb/inline-style; falcon-* tokens); UI-port type-scale tokenization candidate raised (MUC-004) |
| Agent Improvement Knowledge | 76 | 80 | +4 | false-negative-from-reverted-checkout lesson (MUC-005/006) + typecheck-gate improvement (MUC-010) recorded |
| Review Evidence Quality | 80 | 80 | 0 | capped 80 — runtime/browser/E2E NOT verified; build + unit only; mgmt B36 env-blocked (E-06) |

## Gaps Found

- B04 (sole out-of-scope High): acc-user UNSCOPED `user/edit-*` PES, no self/other ABAC — drives REQUEST CHANGES. B05/B15/B33/B39 display-only PES fail-open inversion. B18/B20/B22/B23 Identity authority gaps (FE/PES stricter). B56 mgmt vitest env block (20/32 suites). B54 typecheck not gated. B49 no machine-readable canonical Edit-User matrix. Runtime/browser/E2E not collected this round.

## New Candidate Memories

- MUC-001 (tri-state PES facade ADR), MUC-002 (universal admin contact-deferral business rule), MUC-003 (self/other ABAC security rule), MUC-004 (UI-port type-scale token rule), MUC-005 (reverted-checkout false-negative lesson), MUC-006 (anchor seats to worktree + change summary), MUC-007 (lib vitest test-target testing pattern), MUC-008 (mgmt vitest env open risk), MUC-009 (Identity authority gaps open risk), MUC-010 (typecheck gate on the lib test target). All CANDIDATE — see the review's `obsidian/memory-update-candidates.md`.

## Approved Memories Applied

- None — review-only learning, no promotion this run.

## Agent Improvements Proposed

- Anchor every board seat to the exact worktree path + a change summary on a post-fix re-run (prevents the B01/B03/B06 false-negatives). Add a `tsc --noEmit` / typecheck pass to the new libs/falcon test target. Track the mgmt `@falcon/ui-core/angular` vitest fix as a test-infra task and re-confirm mgmt B36 green.

## Next Knowledge Priorities

- Land + re-review MUC-001 (tri-state PES facade), MUC-003 (self/other ABAC, closes B04), and the Identity authority tightenings (MUC-009); fix the mgmt vitest env (MUC-008) and confirm mgmt B36 green; collect runtime/browser/E2E evidence for Edit User V2; commit a canonical Edit-User role+status matrix with a data-driven diff test (B49).

## Review: gsd-2026-05-29-mgmt-console-authority-pes — 2026-05-29

Decision: APPROVED WITH COMMENTS (0 blocker / 0 high / 4 medium / 4 low / 1 info). Mode: REVIEW-ONLY. Overall: **78/100**.

| Area | Before | After | Change | Evidence |
|---|---:|---:|---:|---|
| Architecture Knowledge | n/a | 80 | +80 | Identity→PES create coupling mapped (GSD-003) |
| Frontend Knowledge | n/a | 84 | +84 | wizard access-resolution + session-provider code-read |
| Backend Knowledge | n/a | 70 | +70 | capped 70 — C# not independently re-read this run |
| Full-Stack Contract Knowledge | n/a | 76 | +76 | FE/BE action-string mismatch found (GSD-001) |
| Business Knowledge | n/a | 78 | +78 | BR-UM-03 single-owner interaction surfaced |
| Security Knowledge | n/a | 82 | +82 | privilege-escalation closure live-proven (403/200) |
| Testing Knowledge | n/a | 72 | +72 | verification tiers mapped; gaps identified |
| Token / Design System Knowledge | n/a | 80 | +80 | N/A this run — logic-only FE changes |
| Agent Improvement Knowledge | n/a | 76 | +76 | FE↔BE action-parity check added |
| Review Evidence Quality | n/a | 80 | +80 | capped 80 — #2 + dropdown not browser-verified |

## Gaps Found

- GSD-001 FE/BE role-matrix action-string mismatch; GSD-004 dropdown render not browser-verified; GSD-005 role-UPDATE path not inspected; backend C# cited from agent + live proof, not independently re-read.

## New Candidate Memories

- MUC-001 (FE/BE action parity), MUC-002 (session.roles always [] → use /user/me), MUC-003 (server-enforced fail-closed authority), MUC-004 (Identity→PES coupling ADR), MUC-005 (board: check FE/BE action parity). All CANDIDATE — see the review's `obsidian/memory-update-candidates.md`.

## Approved Memories Applied

- None (REVIEW-ONLY — no promotion this run).

## Agent Improvements Proposed

- Add FE↔BE PES-action-string parity to the Full-Stack checklist; keep honest verification tiering (build vs API vs browser).

## Next Knowledge Priorities

- Align the FE/BE matrix cell (GSD-001); browser-verify the Add-User dropdown (GSD-004); confirm BR-UM-03 single-owner guard (GSD-002).

## Review: gsd-2026-06-23-pr42786-unlock-message — 2026-06-23

| Area | Before | After | Change | Evidence |
|---|---:|---:|---:|---|
| Architecture Knowledge | 80 | 81 | +1 | layering correct; ADR candidates (event-Reason, unlock-as-reonboard) |
| Frontend Knowledge | 84 | 84 | 0 | N/A — backend-only PR |
| Backend Knowledge | 70 | 74 | +4 | changed contracts (handler/event/enum/Zitadel svc/entity) read; full service not re-read |
| Full-Stack Contract Knowledge | 76 | 74 | -2 | event + IZitadelVerificationService contracts reviewed; no FE contract this run |
| Business Knowledge | 78 | 79 | +1 | Pending→Active + unlock business-rule candidates surfaced |
| Security Knowledge | 82 | 82 | 0 | adversarial pass ran; HTML-encoding + plaintext-pw notes; no Blocker |
| Testing Knowledge | 72 | 74 | +2 | scope well-covered (7 tests); bundled feature untested gap found |
| Token / Design System Knowledge | 80 | 80 | 0 | N/A — backend-only |
| Agent Improvement Knowledge | 76 | 78 | +2 | "diff vs origin/main before finalizing PR" lesson |
| Review Evidence Quality | 80 | 80 | 0 | capped 80 — runtime email delivery NOT verified (no SMTP) |

## Gaps Found

- GSD-001 bundled undocumented commit 888dc9b; GSD-002 email-auto-verify untested; GSD-003 notifications English-only; GSD-004 Pending→Active behavior unconfirmed.

## New Candidate Memories

- C1 credential re-issue fail-safe ordering; C2 event-Reason discriminator; C3 Arg.Do copy-assert; C4 i18n-of-notifications; C5 Pending→Active rule; C6 diff-vs-origin/main; C7 email HTML-encode. All CANDIDATE — see this review's `obsidian/memory-update-candidates.md`.

## Approved Memories Applied

- None (REVIEW-ONLY — no promotion this run).

## Agent Improvements Proposed

- Add "git fetch + diff origin/main..origin/<branch> + confirm every commit is described in the PR body" to the PR-finalize checklist.

## Next Knowledge Priorities

- Resolve 888dc9b scope (GSD-001); add email-auto-verify tests (GSD-002); product ruling on Pending→Active (GSD-004).
