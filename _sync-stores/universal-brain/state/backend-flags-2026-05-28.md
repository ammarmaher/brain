---
type: backend-action-tickets
title: Backend Flags — P0/P1 items requiring code work
created: 2026-05-28
status: AWAITING-SPECIALIST-PICKUP
audience: ammar-core-charging, ammar-core-commerce, ammar-auth
tags: [backend-flags, p0, p1, kafka, security, action-tickets]
---

# Backend Flags — Action Tickets (P0/P1)

> [!warning]
> These items REQUIRE code changes to Falcon backend services. The brain-graph workstream does NOT edit product code (safety rule). This doc is the handoff to specialist Ammar agents.

---

## TICKET P0-#1 — KAFKA-GAP-02 shared consumer group `commerce-service`

**Severity:** HIGH (production risk — silent event drop)
**Route to:** `ammar-core-charging` + `ammar-core-commerce` (paired review)
**Evidence:** Wave 12 + Wave 13 Agent D

### Problem

Both `Brain Outputs/understanding/backend/commerce/SERVICE_OVERVIEW.md` line 91 ("Consumer group: `commerce-service`") AND `Brain Outputs/understanding/backend/charging/SERVICE_OVERVIEW.md` line 81 ("Consumer group: `commerce-service` (note: same group as Commerce — likely a misconfig)") confirm shared group.

Charging's own doc explicitly flags this as "likely a misconfig."

### Risk

When 2 services share a Kafka consumer group, partition assignment is non-deterministic. Sub-wallet events (`commerce.user-wallet-create.v1`, `commerce.subnode-wallet-create.v1`) intended for Charging can be partition-assigned to a Commerce consumer instance (which has no handler) and **silently dropped**.

**Manifestation:** Missing wallets after account/sub-node creation — visible only as "wallet not configured" downstream failures.

### Action steps

1. **Verify in code:**
   ```powershell
   # Hunt the actual GroupId in appsettings + code
   Get-ChildItem 'C:\Falcon\Falcon\falcon-core-charging-svc' -Recurse -Include 'appsettings*.json' | Select-String -Pattern 'GroupId|ConsumerGroup'
   Get-ChildItem 'C:\Falcon\Falcon\falcon-core-commerce-svc' -Recurse -Include 'appsettings*.json' | Select-String -Pattern 'GroupId|ConsumerGroup'
   # Also check Program.cs / Startup.cs for AddKafkaConsumer registrations
   ```

2. **If shared in code (HIGH severity confirmed):**
   - Change Charging consumer group to `falcon-charging-svc` (mirror Identity's `falcon-identity-svc` pattern)
   - Update Charging `SERVICE_OVERVIEW.md` line 81 to match
   - Backend tests: re-run Kafka consumer tests in both services
   - Verify in dev: bring up local backend, trigger Add SubNode flow, confirm Charging receives the event

3. **If docs-only drift (MEDIUM severity):**
   - Update both SERVICE_OVERVIEW.md files to reflect actual group IDs
   - No code changes needed

### Acceptance

- `grep -r "GroupId" charging + commerce` shows distinct values
- Local Add SubNode flow successfully creates Charging-side wallet
- Wave 13's KAFKA-GAP-02 closed (REPLACES edge from misconfig-flag to verified-resolution)

---

## TICKET P0-#2 — BR-UM-32 silent forgot-password OTP (credential-stuffing vector)

**Severity:** HIGH (security)
**Route to:** `ammar-auth`
**Evidence:** Wave 13 Agent C

### Problem

`BR-UM-32` states: "Incorrect Forgot-Password OTP is silent (status stays Active)" — diverges from `BR-UM-27` (3-strike lock on login OTP).

Wave 13 found no enforcer code that distinguishes the two flows.

### Risk

Credential-stuffing attack vector against Active accounts via forgot-password flow. An attacker can guess unlimited OTPs without triggering account lockout.

### Action steps

1. **Symmetrize OTP attempt counting** between login and forgot-password endpoints:
   - `Falcon.Identity.Api/Endpoints/Auth/VerifyOtpEndpoint.cs` (login OTP — already 3-strike per BR-UM-27)
   - `Falcon.Identity.Api/Endpoints/Auth/ForgotPasswordVerifyOtpEndpoint.cs` (or equivalent — needs the same policy)

2. **Add `OtpAttemptCounter` policy** to forgot-password verify-otp endpoint:
   - Counter scoped to (username, session-id) tuple
   - Limit: 3 wrong attempts → lock user account (status → Locked)
   - Match login-OTP behavior exactly

3. **Update BR-UM-32 in PRD-02** — either:
   - Change BR to match BR-UM-27 (recommended — security parity)
   - OR document the deliberate divergence with security review sign-off

4. **Add test cases:**
   - `Falcon.Identity.Tests` — `ForgotPasswordOtpLockoutTests.cs`
   - Case: 3 wrong OTP attempts on forgot-password → user becomes Locked
   - Case: Wrong then correct OTP within window → succeeds (no lockout)

### Acceptance

- 3 wrong forgot-password OTPs lock the account
- Identity test suite green
- BR-UM-32 in PRD-02 updated to reflect new behavior

---

## TICKET P0-#3 — Q-UM-07 stale standing-truths (DONE — docs-only)

**Severity:** MEDIUM (docs hygiene)
**Status:** ✅ COMPLETED 2026-05-28 in this session

Fixed:
- `BRAIN-ARCHITECTURE-CHART.md` lines 785 + 884
- `BRAIN-ARCHITECTURE.canvas` standing-truth panel
- `07-cross-cutting/permission-sheet-gaps.md` lines 109-110
- `Identity SERVICE_OVERVIEW.md` line 70 (KAFKA-GAP-01 typo)

Remaining (low priority):
- `.claude/CLAUDE.md` session-start hook STANDING TRUTHS (need user/dev to update)
- `_pending-questions/wave-2-02-user-Q-UM-07.md` — mark RESOLVED
- `19-night-shift-readiness/DECISION-PROTOCOL.md` F-009 row — update
- `19-night-shift-readiness/NIGHT-SHIFT-MINING-PLAN-2026-05-17.md` — update

---

## TICKET P1-#5 — Templates module enforcement gap (~17 BR-TM-* unenforced)

**Severity:** P1 (roadmap epic — biggest single coverage gap)
**Route to:** Cross-functional — `ammar-core-commerce` (or new `ammar-core-templates`), `ammar-web-platform-ui`, business analyst
**Evidence:** Wave 13 Agent C

### Problem

Templates module has only 3 endpoints in `templates-svc`. FE template editor is not built. **17 BR-TM-* rules are entirely unenforced** — the single largest enforcement gap on the platform.

Examples of unenforced rules:
- `BR-TM-07` — Template variables cannot be at start/end of body
- `BR-TM-26` — Meta state → General status mapping (In-Review→Pending; Active*→Approved usable; Paused/Disabled→Approved-not-usable)
- `BR-TM-10` — Sub-category validity

### Treatment

This is a **roadmap epic, not a single ticket**. Three stages:

#### Stage 1 — Backend
Add ~12 endpoints to `templates-svc`:
- CRUD on templates (GET list, GET by id, POST create, PATCH update, DELETE)
- Submit/Approve/Reject lifecycle
- Meta webhook ingestion
- Requires Meta API integration spec

#### Stage 2 — Frontend
Build template editor wizard (pattern: similar to Add Client wizard). Components: `falcon-stepper`, `falcon-input`, `falcon-textarea`, `falcon-uploader`, `falcon-whatsapp-preview`.

#### Stage 3 — Validation
Implement BR-TM-07 (vars not at body edges), BR-TM-26 (Meta-state mapping), BR-TM-10 (sub-category validity), and the rest of the 17 orphan BRs.

### Acceptance

- Templates-svc grows from 3 to ~15 endpoints
- FE editor reaches feature-parity with templates-list page
- Wave-15 re-run shows BR-TM-* coverage moves from 0 to ≥10 enforced

---

## TICKET P1-#7 — 3 xlsx-vs-V-rule drift cases (business decisions)

**Severity:** P1 (business clarity)
**Route to:** Business analyst + `ammar-web-platform-ui` (for FE validator alignment)
**Evidence:** Wave 13 Agent B

### Drift cases

| V-rule | xlsx says | V-rule says | Decision needed |
|---|---|---|---|
| `V-contact-group-column-name-shape` | 2-32 chars | ≤20 chars | Pick one — xlsx is SoT per 2026-05-24 flip |
| `V-contract-rate-per-unit-non-negative` | > 0 strict | ≥ 0 (allow 0) | Semantics matter — is 0 = "free" valid? |
| `V-contact-group-file-size-cap` | 20 MB hard | configurable | Align: pin xlsx to 20MB OR change xlsx to "App Settings configured" |

### Action steps

1. Business decision per drift
2. Edit xlsx OR V-rule frontmatter `superseded-by` accordingly
3. Update Brain SK Obsidian V-rule note

---

## See also

- `BEST-RECOMMENDATIONS-2026-05-28.md` — full P0/P1/P2 prioritized list
- `falcon-wiki/200-Graph/waves/WAVE-013-GRAPH-PLAYBACK-2026-05-28.md` — Wave 13 audit
- `falcon-wiki/200-Graph/waves/WAVE-014-GRAPH-PLAYBACK-2026-05-28.md` — Wave 14 audit
- `falcon-wiki/200-Graph/THEME_DRIFT_RESOLUTIONS.md` — companion theme-drift tickets
- `falcon-wiki/200-Graph/BE_FE_WIRE_LEVEL_INTEGRATION_GRAPH.md` — Wave 12 mesh data
