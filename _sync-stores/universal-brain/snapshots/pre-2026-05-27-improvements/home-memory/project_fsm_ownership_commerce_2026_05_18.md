---
name: CommChannel/App FSM owned by Commerce not Provisioning
description: Critical architectural truth - CommChannel status lifecycle is driven by Commerce service; Provisioning is a read-mirror only. Discovered Wave 5d 2026-05-18.
type: project
originSessionId: f6ecc776-1773-4495-92d7-3bd75ebceecd
---
CommChannel and Application status FSM (InActive→Paid→Active→Expired→Disabled) is owned by Commerce service, not Provisioning.

**Why:** Wave 5d Provisioning deep-dive found zero lifecycle-mutation controllers. `falcon-core-provisioning-svc` has only: `ServicesController` (read-only state mirror + availableActions[] policy) + `LookupController` (empty catalog). All status transitions are driven by Commerce via Kafka events; Provisioning reflects the result.

**How to apply:** When debugging CommChannel status issues, look in Commerce logs/handlers, not Provisioning. When a business manager asks "why did this CommChannel change status?", answer: "Commerce service drove it via a Kafka event." Detail at `Brain Outputs/understanding/integration/ARCH-FINDING-CommChannel-FSM-ownership.md`.
