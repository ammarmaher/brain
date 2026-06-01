---
type: pending-question
fork-id: F-007 (operational — security concern)
wave: 5c
severity: SECURITY
halted-at: 2026-05-18T+03:00
night-shift-batch: forever-wave-2026-05-17
related-controller: TestKafkaController
related-service: falcon-core-charging-svc
related-file: "Brain Outputs/understanding/backend/charging/controllers/TestKafkaController/OVERVIEW.md"
---

# Security Fork: TestKafkaController has [AllowAnonymous] — unauthenticated Kafka publish endpoint in Charging service

## Why flagged

`TestKafkaController` in `falcon-core-charging-svc` exposes:
- `POST /api/TestKafka/publish` — publishes a `TestEvent` to Kafka
- `GET /api/TestKafka/health` — returns Kafka connection health

Both endpoints are decorated with `[AllowAnonymous]` — no authentication required. Any caller with network access to the Charging service port can trigger a Kafka publish without credentials.

Additional concerns found by Wave 5c:
1. The controller namespace is `Falcon.Commerce.*` (copy-pasted from Commerce, not updated)
2. Error responses return raw `text/plain` bodies instead of the standard `ServiceOperationResult` shape
3. `DateTimeOffset.Now` used in `TestEvent` — local-time drift in distributed system

## Sources reviewed

- `[CODE]` `TestKafkaController.cs` — `[AllowAnonymous]` decorator confirmed
- `[CODE]` `TestEvent.cs` — namespace mismatch + `DateTimeOffset.Now`
- `[BRAIN-OUT]` `understanding/backend/charging/controllers/TestKafkaController/OVERVIEW.md`

## Risk assessment

| Dimension | Level | Reason |
|---|---|---|
| Confidentiality | LOW | TestEvent payload is synthetic test data, not PII |
| Integrity | MEDIUM | Unauthenticated caller could flood Kafka with test events, potentially disrupting consumers |
| Availability | MEDIUM | Kafka flooding from unauthenticated publish could degrade charging pipeline |
| Exploitability | LOW in production | Charging service port is internal; but defense-in-depth requires auth |

## Plausible answers

**A — Remove the controller entirely from production builds** (use `#if DEBUG` conditional compilation or an environment-based feature flag). This is the safest and cleanest fix.

**B — Add `[Authorize]` and restrict to Falcon sys-admin or internal service token.** Keeps the endpoint for integration testing while preventing anonymous access.

**C — Accept the risk** — note that the port is not exposed externally and treat it as internal-only. Lowest effort but leaves the risk documented.

## Recommended question for the human

"Should `TestKafkaController` in the Charging service be (A) removed from production builds entirely, (B) protected with `[Authorize]` requiring a Falcon service token, or (C) accepted as-is because the port is never externally exposed?"

## Blast radius

- If A: remove controller + its 3 test files + namespace cleanup. Clean build.
- If B: add `[Authorize(Policy = "FalconServiceAuth")]` (or equivalent) — no schema change.
- Non-blocking for any active development sprint. Flag for next security review.
