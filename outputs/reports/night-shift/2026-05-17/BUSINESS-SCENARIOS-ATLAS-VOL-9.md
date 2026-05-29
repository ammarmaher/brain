---
type: business-scenarios-atlas
volume: 9
title: "Falcon Business Scenarios Atlas — Volume 9: Operational Runbooks (Incident Response, Data Recovery, Key Rotation)"
purpose: "When things break or when scheduled operational hygiene needs to run. Step-by-step playbooks the operations team executes. The doc to open during a 2am page or a scheduled maintenance window."
volume-9-runbooks: 5
---

# Falcon Business Scenarios Atlas — Volume 9

> Five concrete operational runbooks. Each is a step-by-step playbook. Not theoretical — these are what the on-call engineer needs at 2am.

---

## RUNBOOK 39 — "A client reports they were charged but their CommChannel didn't activate"

**Severity:** HIGH (money + service issue)
**Estimated time to resolve:** 30 min to 2 hours depending on scope

### Step 1: Verify the report (5 min)

Ask the client:
- Account name + tenantId
- CommChannel name
- Approximate time of the failed activation
- Their Account Owner who initiated

### Step 2: Inspect the Order record (5 min)

Query Commerce DB:
```javascript
db.orders.findOne({ accountId: <id>, commChannelId: <id>, status: { $ne: 'Completed' } })
```

If Order exists with `status = "Pending"` after 30+ min, it's stuck.

### Step 3: Inspect Charging side (5 min)

Query Charging DB:
```javascript
db.walletRecords.find({ accountId: <id>, contractId: <id> }).sort({ createdAt: -1 }).limit(20)
```

Check: was a deduction recorded? If YES, the money was moved. If NO, the deduction didn't happen but Commerce thinks it did (or vice versa).

### Step 4: Inspect Kafka consumer lag (10 min)

Check Kafka admin tool:
```bash
kafka-consumer-groups --describe --group falcon-charging --bootstrap-server <kafka-host>
```

If the consumer is lagging behind the producer, events are queued but not processed.

### Step 5: Resolve based on findings

**Case A — Money deducted but no activation Kafka event published:**
- Manual: republish the `CommChannelPaymentCompleted` event to Provisioning
- Manual: update CommChannelConfig.status to Active
- Notify client: "Activation complete; system delay, not a charge issue"

**Case B — Activation done but money not deducted:**
- Likely a bug. Document. **CRITICAL.** Manually debit the WalletRecord OR refund the activation.
- File incident report.

**Case C — Both sides stuck (no money + no activation):**
- Most common. Order timed out. Refund the FE (if money was held) and retry.
- Client to retry the Do Payment manually.

**Case D — Both sides consistent (money + activation): client confused**
- They actually DO have the service. Walk them through the UI.

### Step 6: Post-incident

- File incident report with: timeline, root cause, resolution
- If pattern (multiple clients), open an Engineering ticket
- Update this runbook if a new edge case found

---

## RUNBOOK 40 — "Identity service is returning 500s for all logins"

**Severity:** CRITICAL (platform unusable)
**Estimated time to resolve:** 5 min to 1 hour

### Step 1: Acknowledge + Escalate (1 min)

- Page on-call: senior engineer + ops lead
- Status page update: "We are investigating login issues."

### Step 2: First-pass diagnosis (5 min)

Check in order:
1. Identity service health endpoint: `GET /health` — is it responding at all?
2. Identity service logs: any obvious exceptions?
3. Zitadel availability: is the upstream Zitadel reachable?
4. Database (Mongo): are reads/writes working?
5. Kafka: is the publish path working?

### Step 3: Common scenarios

**Scenario A: Zitadel is down**
- Symptom: all logins return 500. Identity logs show "Zitadel unreachable."
- Fix: cannot resolve — wait for Zitadel recovery. Notify Zitadel ops.
- Mitigation: degrade gracefully if possible (let already-issued JWTs continue working until they expire)

**Scenario B: Mongo connection pool exhausted**
- Symptom: timeouts on user queries
- Fix: restart Identity service to flush connections. Check what's holding connections.
- Long-term: bigger pool OR connection cycling

**Scenario C: Recent deploy broke something**
- Check: git log on the Identity service. Was there a recent deploy?
- Fix: roll back the deploy. Investigate the change after.

**Scenario D: IpAllowlistPreProcessor cache poisoned**
- Symptom: all logins rejected at IP check
- Fix: clear the IP allowlist cache. Restart Identity service.

**Scenario E: 3rd-party rate limit (SMS provider blocking OTP delivery)**
- Symptom: logins reach OTP stage but OTPs aren't delivered
- Fix: check SMS provider dashboard. Switch to alternate provider if needed.

### Step 4: Resolution + post-mortem

- Once resolved, confirm with status page update
- File incident report within 24 hours
- Schedule post-mortem within 48 hours

---

## RUNBOOK 41 — "Mongo primary failed; need to fail over"

**Severity:** CRITICAL (data layer down)
**Estimated time to resolve:** 5 min (if Mongo replica set configured) to 1 hour (if not)

### Pre-requisites (must be in place ALREADY)

- Mongo replica set with ≥ 3 nodes
- Automatic election configured
- Connection strings use replica-set discovery (not direct IP)
- Monitoring on replica lag

### Step 1: Verify primary is actually down (2 min)

```bash
mongo --host <primary-host> --eval "rs.status()"
```

If unreachable, the replica set should auto-elect a new primary within ~30 seconds.

### Step 2: Confirm new primary elected (2 min)

```bash
mongo --host <any-replica> --eval "rs.status()" | grep -A 2 PRIMARY
```

A new primary should be visible. If not, manual intervention needed.

### Step 3: Verify application connectivity (5 min)

Application services should auto-reconnect to the new primary (if connection strings are correct).

Check:
```bash
curl https://commerce-api/health
curl https://identity-api/health
curl https://charging-api/health
```

If any service is failing, restart it to force connection refresh.

### Step 4: Diagnose the failed primary (out of critical path)

- Get the old primary's logs
- Determine cause (OOM, disk full, network partition, etc.)
- Plan recovery or replacement

### Step 5: Restore replica set health

- Add the recovered node back as secondary
- Wait for replication to catch up
- Monitor

### Step 6: Post-incident

- Confirm no data loss (compare write counts before/after)
- File incident report
- Review monitoring alerts (did we catch it fast enough?)

---

## RUNBOOK 42 — "Rotate Zitadel webhook signing secret"

**Severity:** ROUTINE (scheduled maintenance, ~quarterly)
**Estimated time to resolve:** 30 min (well-coordinated) to 4 hours (if rushed)

### Why rotate

Webhook signing secret is a shared secret between Zitadel and Falcon Identity. If it leaks, attackers can forge webhook events. Rotate periodically (per security policy) or immediately on suspected leak.

### Step 1: Generate new secret (1 min)

Strong random secret (≥ 32 bytes):
```bash
openssl rand -base64 32
```

### Step 2: Update Zitadel webhook config (5 min)

In Zitadel admin UI:
- Configure NEW webhook endpoint signing secret (Zitadel can support multiple temporarily during rotation)
- DO NOT disable old secret yet

### Step 3: Update Falcon Identity config (10 min)

- Add new secret to Falcon Identity service config (e.g., as `ZITADEL_WEBHOOK_SIGNING_SECRET_V2`)
- Modify WebhookController to accept signatures from EITHER the old OR new secret (dual-acceptance window)
- Deploy + verify

### Step 4: Verify (5 min)

Trigger a known Zitadel event (e.g., create a test user). Confirm:
- Zitadel signs with new secret
- Falcon Identity accepts and processes

### Step 5: Cut over

- Wait for all in-flight webhook events to settle (~10 min)
- In Zitadel: remove the OLD secret
- In Falcon Identity: remove the OLD secret from config
- Deploy

### Step 6: Confirm + document

- Verify webhooks still working
- Update security log: "Rotated Zitadel webhook secret on YYYY-MM-DD by <actor>"
- Schedule next rotation

### ⚠ Related — Wave 5b finding

The current HMAC comparison uses non-constant-time `string.Equals(..., OrdinalIgnoreCase)` — vulnerable to timing attacks. **Fix this FIRST before any rotation cycle** so the rotation isn't undermined by the comparison flaw. See `_pending-questions/wave-5b-...` and security task chip already shown.

---

## RUNBOOK 43 — "Data Recovery from accidental contract deletion"

**Severity:** HIGH (money + audit trail at risk)
**Estimated time to resolve:** 30 min to 4 hours

### Pre-requisites

- Mongo replica set with delayed replica (e.g., 1 hour delay) OR daily backups OR oplog access
- Document retention policy: SAMA requires ~10 years for financial records

### Step 1: Verify the deletion (5 min)

Confirm: was the contract actually deleted? Or just status flipped to Expired? (Per BR-AM-38 and BR-CC-38, contracts shouldn't be hard-deleted in normal operation.)

```javascript
db.contracts.findOne({ id: <contractId> })
```

If found: just a status issue, not deletion.

If NOT found: actual deletion. Continue.

### Step 2: Identify the deletion event (10 min)

Check Mongo oplog (if available):
```javascript
db.oplog.rs.find({ ns: "falcon.contracts", op: "d", "o.id": <contractId> })
```

This shows when + by whom.

### Step 3: Restore options

**Option A — Oplog replay**
- Replay the inverse operation from oplog (re-insert)
- Cost: simple if oplog has the original `o` field

**Option B — Restore from delayed replica**
- Connect to delayed replica
- Query the contract
- Re-insert into primary

**Option C — Restore from backup**
- Restore the relevant collection from latest pre-deletion backup
- Cost: full restore is expensive; partial restore (one document) is preferred

### Step 4: Verify integrity

- Re-inserted contract should restore all wallet records linked to it (they should still exist, just orphaned)
- Cross-check: contract.remainingValueSar = sum of unspent WalletRecords for this contract
- Cross-check: dependent CommChannelConfig statuses are still consistent

### Step 5: Audit + post-incident

- Who deleted it? Why? Was it intentional?
- Update access policies to prevent recurrence
- File incident report

### ⚠ Note on prevention

Hard-delete of contracts is NOT in the current PRD or normal flow. If it happened, it's either:
- A bug in code
- A manual database operation (DBA / engineer with direct DB access)
- A malicious action

**Recommend:** add a soft-delete flag on Contract (similar to softDeleted on ContactGroup). Make hard-delete impossible from the application layer. Database-level deletion should require explicit DBA approval.

---

## RUNBOOK 44 — "Kafka consumer lag spikes — diagnose + recover"

**Severity:** MEDIUM (state becoming stale across services)
**Estimated time to resolve:** 15 min to 2 hours

### When this happens

Symptoms:
- CommChannel status mirror in Provisioning is hours behind Commerce
- Wallet balance shown in UI doesn't reflect just-completed transactions
- New users created in Identity not appearing in Commerce tenant view

### Step 1: Identify which consumer is lagging (5 min)

```bash
kafka-consumer-groups --describe --bootstrap-server <host> --all-groups
```

Look for consumer groups with LAG > 1000.

### Step 2: Identify which topic + which service

Topic naming convention (per Falcon-essentials): `falcon.<service>.<event-type>` (verify in code).

### Step 3: Common causes

**Cause A — Consumer service is down**
- Restart it
- Check why it died (OOM? crash loop?)

**Cause B — Consumer is processing slowly (CPU or DB bound)**
- Check service metrics
- May need to scale horizontally (more consumer instances)
- Kafka allows parallel consumers if topic is partitioned

**Cause C — Bad message in queue (poison pill)**
- One malformed event blocks the consumer
- Check service logs for repeated failures on same offset
- Skip the bad message (advance consumer offset by 1)
- File a bug for the producer

**Cause D — Downstream dependency slow (e.g., Mongo write latency)**
- Address the dependency
- Consumer will catch up

### Step 4: Catch-up monitoring

After mitigation:
- Watch the lag metric — should decrease
- ETA to zero lag = (current lag) / (processing rate - production rate)

### Step 5: Verify state convergence

Once caught up:
- Spot-check: is Provisioning's view of a recently-changed CommChannel now consistent with Commerce?
- Run a reconciliation script if available

---

## Continuous mining queue update

Volumes 1-9 = 50 scenarios + compliance maps + scaling + operational runbooks.

Remaining queue:
- **Vol 10:** Bulk operations design space (Q-UM-11 OPEN)
- **Vol 11:** Multi-language Template behavior
- **Vol 12:** Knowledge graph navigation patterns
- **Vol 13:** CPaaS competitor positioning

---

*Falcon Brain Forever-Wave · Continuous business deep-diving · Vol 9 (operational runbooks) written 2026-05-18 · 50 deep-dives total.*
