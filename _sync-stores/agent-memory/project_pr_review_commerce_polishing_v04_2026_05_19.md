---
name: PR review commerce polishing-v0.4
description: Silent code review of falcon-core-commerce-svc polishing-v0.4 → main; verdict Request Changes
type: project
originSessionId: 3644e8c7-82fb-4bdd-a152-dccb053ef521
---
🟠 PR REVIEW 2026-05-19. Reviewed `falcon-core-commerce-svc` branch `polishing-v0.4` → `main`
(PR-create URL; PR not yet opened). Scope = 1 commit `3b6c113` (11 files, +220/−17):
order idempotency guard + NodeController `[Authorize]` + new `commerce.order-finalized.v1` event.

**Verdict: Request changes.** Deliverable = silent HTML report (nothing posted to Azure DevOps):
`C:\Falcon\reports\commerce-polishing-v0.4-pr-review-2026-05-19.html`.

- **F1 (HIGH)** — unguarded `OrderFinalizedEvent` publish in `CompleteFalconServicePaymentProcess.ExecuteAsync`.
  `KafkaAvroProducer` rethrows on produce failure → consumer `catch(Exception)=>return false` →
  `KafkaAvroConsumerBase` skips offset commit; `AlreadyTerminal` short-circuit blocks re-emission →
  event permanently lost + payment-processed consumer poisoned. Commit admits the topic isn't provisioned,
  so the path fails for every order today. Fix: wrap publish in try/catch (no rethrow) + outbox/feature-flag.
- **F2 (MED)** — commit message wrongly calls the old bug an "infinite re-consume loop"; `return false`
  skips, not loops (consumer base advances). Fix is right, narrative wrong.
- **F3 (MED)** — `PublishToDeadLetterAsync` is a stub that only logs; no real DLQ (pre-existing).
- F4/F5/F6 LOW — `DateTime.Now` vs UtcNow; event emitted even if order not transitioned; BOM churn.
- **Verified correct (merge-ready):** B3 `[Authorize]` (closes real auth hole on create-account/do-payment;
  matches 6 sibling controllers); B1 idempotency guard (`eOrderStatus` = Pending/Paid/Failed only, guard sound);
  Avro `OrderFinalizedEvent` wiring (schema/Get/Put/EventContext all consistent).

NOTE: branch has 9 uncommitted working-tree files (seed-data work) NOT in the PR — flagged, not reviewed.
Recommendation given: split B1+B3 to merge now, fix event publishing separately.
