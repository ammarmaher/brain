---
type: atlas-volume-graph-node
volume: 54
cluster: 10-pages
source: "[BRAIN-OUT] Brain Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-54-RESERVATION-TTL-SPECIALIST.md"
created: 2026-05-18
status: canonical
tags:
  - atlas/vol54
  - specialist/reservation
  - specialist/wallet
  - specialist/concurrency
---

# Vol 54 — Reservation & TTL Specialist Guide

> The reservation pattern that protects against TOCTOU race in wallet operations. The `ReservationExpiryWorker` self-healing mechanism. 3-outcome lifecycle: Commit / Release / Expire.

## What's in it

13 sections:
- §1 Why reservations exist (TOCTOU race + 2-phase reserve-then-commit)
- §2 Reservation entity schema [INFERRED]
- §3 Three outcomes (Commit/Release/Expire) + why distinguish Released from Expired
- §4 `ReservationExpiryWorker` (the only safety-net background service in Charging)
- §5 Reservation lifecycle visual + allowed transitions
- §6 Per-use-case reservation sizing
- §7 Concurrent reservation handling on same wallet
- §8 Reservation × Multi-Contract (sources[] split)
- §9 6-class edge cases
- §10 Mental model (available = balance - reserved; commit XOR release; TTL is safety net)
- §11 PR review checklist
- §12 Cross-references
- §13 5 new open questions (Q-RES-01..05)

## Headline truths

> `available = balance - reservedAmount` — every wallet query must use available, not raw balance. Reservations have TTLs; if neither commit nor release happens by expiry, `ReservationExpiryWorker` (BackgroundService) self-heals. Multi-contract reservations record `sources[]` to allow proportional commit or release. Commit and release are mutually exclusive terminal states.

## See also

- [[WALLET-SPECIALIST-HUB]] — Vol 54 is the concurrency-safety extension of Vol 45
- [[Vol 53 — Order Payment Polling Specialist]] — sibling (orders create reservations)
- [[VOL-44-TRUTH-TAUTOLOGIES]] §Wallet (W-TT-06 atomicity is built on reservations)
- [[ATLAS_MASTER_INDEX]]
