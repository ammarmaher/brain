---
type: business-scenarios-atlas
volume: 10
title: "Falcon Business Scenarios Atlas — Volume 10: Bulk Operations Design Space (Q-UM-11 OPEN)"
purpose: "What bulk operations does the business actually need? PRD-02 GAP-UM-35 flags this as missing. This volume maps the demand, the design space, and the implementation recommendation."
volume-10-deep-dives: 4
---

# Falcon Business Scenarios Atlas — Volume 10

> Q-UM-11 (bulk user operations) is currently [OPEN] in the User Management PRD. GAP-UM-35 confirms no bulk endpoints exist today. This volume answers: what would the business actually use bulk for? And what's the cleanest design?

---

## DEEP-DIVE 45 — The Business Demand for Bulk Operations

### Where bulk operations get asked for (real-world scenarios)

**1. Bulk user creation — onboarding a new enterprise client**

Scenario: New client signs up with 500 employees. Account Owner needs to create 500 user accounts. Today: 500 single-user creates = ~30 min of clicking + error-prone.

**Demand level:** HIGH. Every new enterprise onboarding hits this.

**2. Bulk user import on platform migration**

Scenario: Client moves from competitor (Twilio/MessageBird) to Falcon. Already has 5000 users they need replicated.

**Demand level:** HIGH for sales-led migrations. LOW for organic growth.

**3. Bulk role/permission update**

Scenario: Client reorgs. 200 users need their role/permissionGroup updated from "NormalUser/Sales" to "NormalUser/SalesAndSupport."

**Demand level:** MEDIUM. Happens quarterly per enterprise client.

**4. Bulk user export**

Scenario: GDPR SAR, regulatory audit, or internal HR review needs all user data.

**Demand level:** MEDIUM. SAR-driven; gets HIGHER with EU expansion.

**5. Bulk user suspension/deletion**

Scenario: Client laid off a department. 50 users need to be Suspended (or Deleted) in one operation.

**Demand level:** LOW but URGENT when it happens. Each individual suspension is 1 click but doing 50 sequentially is risky (one missed).

**6. Bulk send-transaction (campaign)**

Scenario: Client wants to send the same template to 100k recipients (Contact Group). Today this might be possible via the App layer (campaigns), but explicit Falcon-level bulk send isn't in PRD.

**Demand level:** This is the actual CPaaS volume use case. Should be FE-orchestrated (loop through recipients) not a Falcon API "bulk send" endpoint.

**7. Bulk ContactGroup operations (delete old groups)**

Scenario: Client has 1000 stale Contact Groups, wants to soft-delete them all.

**Demand level:** LOW. Usually handled via UI filters.

### Where bulk is NOT needed (often misrequested)

- **Bulk contract creation** — Each contract is its own commercial agreement; bulk creation makes no sense.
- **Bulk wallet transfer** — Each transfer is auditable; bulk would obscure the actor-action mapping.
- **Bulk template create** — Each template needs Maker submission per Meta requirements.
- **Bulk PermissionGroup definition** — Each group is structured; bulk would be confusing.

### Sorting demand: top 3 to build

Based on impact + frequency:
1. **Bulk user creation** (CSV/Excel import)
2. **Bulk user role/permissionGroup update**
3. **Bulk user export** (for SAR, audits)

The rest are either too niche, can be done via UI loop, or shouldn't be bulk.

---

## DEEP-DIVE 46 — Design Pattern: How Bulk Endpoints Should Work

### The wrong design (avoid)

```http
POST /api/users/bulk-create
Body: [ {user1}, {user2}, ... {user1000} ]
Response: 200 OK { "results": [...] } (eventually)
```

Problems:
- Long-running request (timeouts)
- All-or-nothing dilemma (1 failure rolls back all?)
- No progress reporting
- Difficult to debug partial failures
- Server holds large request in memory

### The right design (recommended)

**Step 1 — Upload + validate (sync, fast)**
```http
POST /api/users/bulk-create/upload
Body: multipart with CSV file
Response: 200 OK { "jobId": "abc123", "rowCount": 500, "validationErrors": [] }
```

**Step 2 — Approve + start (sync, fast)**
```http
POST /api/users/bulk-create/jobs/{jobId}/start
Response: 202 Accepted { "jobId": "abc123", "status": "Queued" }
```

**Step 3 — Background processing (async)**

Backend processes rows individually:
- Each user creation = 1 atomic transaction
- Per-row failure = log + continue with next
- Periodic state update to job record

**Step 4 — Status polling (FE polls)**
```http
GET /api/users/bulk-create/jobs/{jobId}
Response: {
  "jobId": "abc123",
  "status": "Running" | "Completed" | "Failed" | "Cancelled",
  "totalRows": 500,
  "processedRows": 312,
  "succeededRows": 290,
  "failedRows": 22,
  "errors": [ { "row": 45, "username": "x", "error": "Username already exists" } ]
}
```

**Step 5 — Cancel (if needed)**
```http
POST /api/users/bulk-create/jobs/{jobId}/cancel
```

### Why this design

- **Atomic per-row** — one failure doesn't block others
- **Resumable** — can re-run failed rows after fixing
- **Visible** — FE shows progress bar
- **Audit-friendly** — each row's creation has its own actor + timestamp
- **Backpressure-friendly** — backend controls rate; doesn't blow up on huge files
- **Idempotent** — re-uploading same file with same content can be detected (e.g., file hash) to avoid double-processing

### Required schema additions

```
BulkJob {
  jobId, jobType (user-create / user-update / etc.),
  initiatedBy (userId), initiatedAt,
  totalRows, processedRows, succeededRows, failedRows,
  status, sourceFileRef, resultFileRef,
  errors[], retryCount
}
```

---

## DEEP-DIVE 47 — Edge Cases the Business Will Hit

### Edge case 1: Duplicate username in import

Default: skip + log error.
Business question: "we have a user X already; do we want to UPDATE them or SKIP them in bulk import?"
Recommend: explicit toggle on the job — "On duplicate: SKIP / UPDATE / FAIL_ALL"

### Edge case 2: `maxNormalUserLimit` exceeded mid-import

Business question: "what if the import would push us past our user limit?"
Options:
- A: Pre-flight check the limit (likely complete) — if `currentCount + importCount > limit` → reject before starting
- B: Process until limit hit → mark remaining as failed
- Recommend: A (clearer + more predictable)

### Edge case 3: Email/phone delivery during bulk

Business question: "do we send credentials to all 500 users individually?"
Options:
- A: Bulk creation triggers individual delivery (per BR-UM-18) — could overload email provider
- B: Skip credential delivery, generate a list of credentials for the admin to distribute
- C: Schedule delivery throttled (e.g., 10 per second)
- Recommend: B for >50 rows; A for smaller batches

### Edge case 4: Partial state on cancellation

Business question: "I cancelled the job. What happened to the 312 users already created?"
Default: **They stay.** Cancellation only prevents further processing.
Optional: provide "Rollback already-created users" action separately.

### Edge case 5: Time-bounded bulk operations (24-hour-old jobs)

Business question: "what's the SLA for completing a bulk job?"
Recommend: jobs should complete within 1 hour (for up to 10k rows). Beyond that, the file is too large — recommend splitting.

### Edge case 6: Concurrent bulk jobs by same admin

Business question: "can an admin start 5 bulk imports at once?"
Recommend: limit to 2 concurrent jobs per admin to avoid resource contention.

### Edge case 7: Bulk job for the wrong account

Business question: "AO accidentally selected the wrong subnode when starting the job. Now 200 users are in the wrong place."
Mitigation:
- Confirmation step on start ("Add 500 users to <nodeName>?")
- Bulk move/delete capability after the fact (which itself is a future bulk endpoint!)

---

## DEEP-DIVE 48 — The Bulk Operations Roadmap

### Phase 1 — Minimum viable bulk (sprint 1)

- Bulk user create from CSV
- Includes: pre-flight validation, async processing, status polling, error file download
- Excludes: bulk update, bulk delete, scheduled jobs

**Estimated effort:** 2-3 sprints (3-5 backend engineers + 1 FE).

### Phase 2 — Update + delete (sprint 4-5)

- Bulk user update (role, status, permission group)
- Bulk user export
- Bulk user soft-delete

### Phase 3 — ContactGroup + Template bulk (Phase 2 of platform)

- Bulk ContactGroup operations
- Bulk Template approval / rejection
- Bulk audit log queries

### Phase 4 — Cross-account admin bulk (Falcon-only)

- Bulk transfer of users between accounts (account merger scenarios)
- Bulk contract amendments (rare but needed for company restructurings)

### Estimated end-to-end timeline

For a complete bulk-operations capability:
- Phase 1: 2-3 sprints
- Phase 2: 3-4 sprints
- Phase 3: 4-6 sprints (depends on Template entity being built)
- Phase 4: 4-6 sprints
- **Total: ~6-12 months of platform investment**

### Business value justification

For an enterprise sales pitch:
- "Bulk import 1000 users in 5 minutes" — major time-saver for new clients
- "Bulk export for compliance" — regulatory readiness
- "Bulk role updates" — supports client reorgs without manual labor

For client retention:
- "We're investing in self-service bulk operations" — signal of platform maturity
- "Reduce time-to-value for new clients" — onboarding becomes a competitive advantage

### What to bring to product team to close Q-UM-11

1. **The demand prioritization** — top 3 bulk operations (above)
2. **The design pattern** — async job + polling (not synchronous mega-request)
3. **The phased roadmap** — Phase 1 = bulk create, deliverable in 2-3 sprints
4. **The schema delta** — `BulkJob` table + endpoints listed in Deep-Dive 46
5. **The success metrics** — % of new client onboardings using bulk import; time to onboard 100+ users

Closing Q-UM-11 unblocks all subsequent bulk operations.

---

## Continuous mining queue update

Volumes 1-10 = 54 deep analyses (scenarios + compliance + scaling + runbooks + bulk).

Remaining queue:
- **Vol 11:** Multi-language Template behavior (English + Arabic variants)
- **Vol 12:** Knowledge graph navigation patterns (how the Falcon Brain stays useful as it grows)
- **Vol 13:** CPaaS competitor positioning (Twilio, Vonage, MessageBird, regional)
- **Vol 14:** Sales playbook addendum (enterprise sales motion specifics)
- **Vol 15:** Engineering investment priorities (what to build next, ranked by business impact)

---

*Falcon Brain Forever-Wave · Continuous business deep-diving · Vol 10 (bulk operations) written 2026-05-18 · 54 deep-dives total.*
