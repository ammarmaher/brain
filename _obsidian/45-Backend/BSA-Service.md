---
type: backend-service
service: basic-send-application
status: "INFERRED location pending code search"
created: 2026-05-19
prd-source: "Basic Send Application-V2.docx"
---

# BSA — Backend Service Note

> Backend service note for Basic Send Application. **Implementation location is currently INFERRED** — the BRD describes the design but no dossier exists at `understanding/backend/bsa/`.

## Status

🟡 **Service mining DEFERRED** — needs an agent to find BSA-related code in:
- Likely candidates: new `falcon-core-bsa-svc` service OR within `falcon-core-commerce-svc` OR `falcon-core-charging-svc`
- Cross-reference: search for "SendTransaction", "Outbox", "Scheduled", "WhatsAppSend", "VoiceSend" controllers/handlers
- Spawn agent: `ammar-core-commerce` or `ammar-core-charging` to mine BSA implementation

## What we know from BRD

### 4 APIs documented (system-to-system integration)

| API | Purpose |
|---|---|
| **BSA Send API** | Submit a Send Transaction (one CG per request, manual recipients, variables, scheduling, duplicate handling) |
| **Template Retrieval API** | List approved templates eligible for the user (own + shared) |
| **Contact Group Retrieval API** | List active CGs eligible for the user (own + shared) |
| **Sender ID Retrieval API** | List Sender IDs available per CommChannel |

### Auth + Authorization

- User authentication required for all 4 APIs
- Permission Group restrictions may apply
- Per BR-BSA-01..03: AO + Falcon usertype can purchase/activate; NU access controlled by Permission Group

### Key handlers (INFERRED)

- `CreateTransactionHandler` (BSA Send)
- `ScheduleTransactionHandler` (future-dated transactions)
- `CancelTransactionHandler`
- `EditScheduledTransactionHandler`
- `DeleteScheduledTransactionHandler`
- `ProcessScheduledTransactionsJob` (background scheduler)
- `DispatchWhatsAppMessageHandler` (via Meta API)
- `DispatchVoiceMessageHandler` (via Voice provider)

### Balance flow (per BR-BSA-10..14)

- No pre-reservation
- Deduction at execution per batch/record
- Refund via **core Wallet Engine** (NOT BSA) for internal failures
- Third-party rejection: log status; core Wallet Engine handles refund per contract rules

### Kafka events (INFERRED — none documented in BRD)

Likely events emitted:
- `TransactionCreated`
- `TransactionStarted`
- `TransactionCompleted`
- `TransactionPartiallyProcessed`
- `TransactionFailed`
- `TransactionCanceled`
- `RecipientDelivered`
- `RecipientRead` (via Meta webhook)

[INFERRED] These events likely feed:
- Audit log
- Charging service (deduction trigger)
- Customer Success dashboards (when built)

## Cross-service dependencies

- [[Commerce Service]] (AppConfig + CommChannel state)
- [[Charging Service]] (wallet deduction; core Wallet Engine for refunds)
- [[Identity Service]] (user auth + Permission Group)
- [[Contact Group Service]] (CG retrieval)
- Templates service (template retrieval + approval status check)
- External: Meta (WhatsApp) · SIP/Voice providers

## Next-mining recommendations

1. Spawn `ammar-core-commerce` to search for BSA-related controllers
2. Document `Transaction` entity schema
3. Document Kafka event topics + payloads
4. Build full controller dossier at `understanding/backend/bsa/`
5. Update Atlas Vol 40 §13 (Next Steps) with backend findings

## Source

- [[06-Basic-Send-Application]] (PRD module)
- BRD: `C:\Falcon\PRD\BRDs\6- Basic Sending App\Basic Send Application-V2.docx`
- [Atlas Vol 40](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-40-MODULE-06-CONCLUSION.md)
- [Atlas Vol 42](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-42-BRD-REFRESH-REPORT.md)

## Tags

#type/backend-service #service/bsa #status/inferred-location
