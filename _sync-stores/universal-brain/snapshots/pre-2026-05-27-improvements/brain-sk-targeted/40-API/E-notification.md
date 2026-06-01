---
type: entity
id: E-notification
title: Notification (Email / SMS delivery)
status: stub
created: 2026-05-18
source: Business deep-dive mining 2026-05-18 (GAP-BIZ-X-05)
priority: high
tags: [entity, cross-module, notification, email, sms, otp, stub]
---

# E-notification — Notification

> [!warning] **STUB — Authoring required**
> Multi-module dependency cited by BR-UM-18, BR-UM-26, BR-AM-21 + every module's "delivery" story. No vault note existed until this stub. Closes GAP-BIZ-X-05.

## One-line shape

A Notification is a single **outbound delivery attempt** of a templated message to one user via one channel (Email / SMS / In-App). Records the request, the channel, the rendered content, the result, and audit metadata.

## Provisional fields

| Field | Type | Notes |
|---|---|---|
| `id` | string | Primary key |
| `userId` | userId? | Target user; null for non-user notifications |
| `recipient` | string | Email address OR phone (E.164); resolved from user record at send time |
| `channel` | enum {Email, Sms, InApp, Push} | Delivery channel |
| `purpose` | enum {Credential, Otp, GraceWarning, ActivityAlert, AdminNotice, Receipt, Other} | Why the notification fired |
| `templateKey` | string | DB-keyed template identifier (NOT the Module 05 Template entity; this is a transactional notification template) |
| `templatePayload` | json | Variable values passed to template |
| `renderedSubject` | string? | Email subject after render |
| `renderedBody` | string | Final body after template + variables |
| `language` | string | Locale used |
| `status` | enum {Queued, Sending, Sent, Failed, Bounced, OptedOut} | Delivery status |
| `failureReason` | string? | When Failed/Bounced |
| `attemptCount` | int | Retry counter |
| `correlationId` | string? | Cross-module trace id (BR-X-AUDIT-EVENT-01) |
| `createdAt` | datetime | Audit |
| `sentAt` | datetime? | Audit |

## Cross-module use cases

| Purpose | Triggered by | Module |
|---|---|---|
| Credential delivery (Email/Phone/Both) | Add User wizard Step 5 confirmation | 02 (BR-UM-18) |
| OTP for login, first-login, forgot-password | Auth flow | 02 (BR-UM-26, BR-UM-31, BR-UM-32) |
| OTP for email/phone change | My Profile flow | 02 (BR-UM-36) |
| Grace-period warning before commchannel expiry | Renewal job | 01 (BR-AM-21) |
| Manual lock notification | Admin status change | 02 (BR-UM-45 OPEN) |
| Account-limit-exceeded alert | Background limit check | 01 (Q-AM-NEW-01) |
| Refund issued receipt | Refund flow (future) | 03 (BR-CC-49 OPEN) |
| Rate-card price change notification | Falcon admin price edit | 03 (Q-CC-NEW-20) |
| Send Transaction failure | Charging cascade | 03 (Q-X-NEW-10) |

## Open questions

- Channel fallback policy — when Email fails, fall back to SMS? (Q-UM-NEW-11)
- DB-stored editable message catalog vs .resx — root-documents Q-RD-06 + BR-X-I18N-FALLBACK-01
- Per-tenant notification preferences (opt-out, quiet hours)? — no rule
- Notification module as 1st-class PRD module? — Q-X-NEW-19

## Cross-module references

- **02-user-management** — OTP + credentials primary consumer
- **01-account-management** — grace-period + admin-driven notifications
- **03-contract-packaging-charging-billing** — receipts + price-change alerts (future)
- **04-contact-group-management** — N/A (contact groups are recipient lists FOR Send Transaction, not for notifications)
- **05-templates** — distinct from this entity; Module 05 templates are commercial broadcasts via CommChannel; E-notification is transactional system-level

## Bound by BR rules

- BR-UM-18 (credential delivery channel choice)
- BR-UM-26..32 (OTP delivery)
- BR-AM-21 (grace-period notifications)
- BR-X-DELIVERY-FAILURE-01 (proposed — failure → user stays Pending)
- BR-X-I18N-FALLBACK-01 (proposed — locale fallback)

## Backend reality

**[INFERRED]** No notification service has been mined in the backend dossier yet. Likely outsourced via Identity Service (OTP delivery) + an unmapped notification microservice. Needs `[CODE]` verification.

## See also

- `[[E-otp-challenge]]` — separate entity for OTP-specific state (purpose enum, attempts, resendCount)
- `[[E-translation]]` (stub) — for DB-editable message catalog
- [BRAIN-OUT] `Brain Outputs/prd/modules/root-documents/QUESTIONS.md` Q-RD-06 (DB-editable messages)

## Authoring status

- 🟡 Provisional shape
- ⏳ Awaiting Q-X-NEW-19 (1st-class PRD module y/n)
- ⏳ Awaiting Q-UM-NEW-11 (channel fallback y/n)
- ⏳ Awaiting Q-RD-06 (DB-editable catalog y/n)
