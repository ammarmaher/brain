*** Journey Playbook — Suspend Client ***
*** Multi-page user flow · 2026-05-15 ***
*** Crosses: [[Organization Hierarchy]] · [[Org Settings]] · [[Login]] · Notification delivery ***

# Suspend Client

> A Falcon System Administrator (or Falcon Product) suspends a tenant Account. The status change is the trigger for a fan-out cascade: Identity locks all users at the gateway, Charging freezes the wallet topology (no debits / no transfers), Provisioning rejects new service orders, in-flight Send Transactions are aborted, and the AO is notified of the suspension. The tenant retains its data (read-only at most) until the admin Unsuspends. Journey ends when all four downstream services have acknowledged the status change.

## Actors involved

| Actor | Role |
|---|---|
| Falcon System Administrator | Initiates suspension; usually with a reason |
| Falcon Product | Same scope (per PRD-01 OVERVIEW Actors) |
| Account Owner | Recipient of the suspension notification; cannot log in after cascade |
| Commerce Service | Persists Account status change; produces cascade event |
| Identity Service | Locks every user under the tenant; emits per-user status events |
| Charging Service | Freezes wallet topology (no debits, no transfers) |
| Provisioning Service | Rejects new service orders on this tenant |
| Access (PES) Service | Returns Deny for every authorize call from this tenant |
| Core Gateway | Refreshes Redis IP-allowlist + tenant-status cache; rejects requests for suspended tenants |

## Pages traversed (in order)

1. [[Organization Hierarchy]] — Falcon admin navigates to the target Account, opens Settings tab or right-pane action menu.
2. [[Org Settings]] — Admin changes Account Status to `Suspended` (with optional reason). `forward-ref (Settings tab editing for status not yet covered by a dedicated flow)`
3. Notification delivery — AO receives an email / SMS notification (delivery medium per tenant `DeliveryMethod` or admin-chosen channel). No dedicated page.
4. [[Login]] — AO attempts to log in later; gateway returns "Account suspended" toast. `forward-ref`

## Flow playbooks used

- [[Edit Node Flow]] — built (single-file SoT). Covers rename / scheduled rename; flag `move ❌` + `archive ❌` as MISSING. Suspend is a sibling action with similar permission gating.
- [[Suspend Account Flow]] — `forward-ref (flow not yet seeded)`. Should be a standalone playbook because the cascade is non-trivial.
- [[Unsuspend Account Flow]] — `forward-ref (flow not yet seeded)`. Reverse of this journey.

## Backend services exercised (in order)

- [[System Gateway Service]] — receives the suspend action POST from Admin Console.
- [[Commerce Service]] — owns Account.Status; persists `Pending → Suspended`; emits cascade.
- [[Identity Service]] — consumes status-change event; updates user statuses; invalidates sessions.
- [[Charging Service]] — consumes status-change event; flags wallet aggregate as frozen.
- [[Provisioning Service]] — consumes status-change event; rejects future Service Orders for tenant.
- [[Access PES Service]] — consumes status-change event; updates policy state; every authorize call on this tenant returns Deny.
- [[Core Gateway Service]] — consumes the cache-refresh event; tenant-status cache flips to Suspended; subsequent requests rejected at gateway.

## Kafka events fired

| Event | Producer → Consumer | Fires between... |
|---|---|---|
| `commerce.account-status-changed.v1` | Commerce → Identity + Charging + Provisioning + Access + Core Gateway | `forward-ref (event name TBC)`. Fires on admin's status-change POST commit. Carries `{accountId, oldStatus, newStatus, reason, actorUserId}`. |
| `commerce.tenant-ip-allowlist-changed.v1` | Commerce → Core Gateway | Re-emitted as a side-effect so the cache also refreshes (tenant flag goes from Active to Suspended) |
| `identity.user-status-changed.v1` | Identity → Access PES | `forward-ref (event name TBC)`. Per-user; Identity emits one per user it locks. |
| `identity.session-invalidated.v1` | Identity → audit consumers | `forward-ref (event name TBC)`. Per-session; emitted when Identity revokes active sessions of users in the tenant. |
| `provisioning.service-order-rejected.v1` | Provisioning → audit consumers | `forward-ref (event name TBC)`. Per in-flight order rejected. |

> Brain SK's BACKEND_INDEX records the general Kafka topology (Commerce as primary producer; Charging / Templates / Identity / Access as consumers) but does not enumerate status-change events specifically. Names above are best-known. Verify at integration.

## V-rules touched

| V-rule | Where it fires |
|---|---|
| [[V-account-ip-allowlist-enforcement]] | Indirectly — gateway still applies allowlist; suspended status is enforced before allowlist |
| [[V-charging-transfer-source-destination]] | Any in-flight Wallet Transfer is rejected post-cascade |
| [[V-charging-insufficient-balance]] | Not applicable (wallet is frozen, not empty) |
| [[V-contract-edit-status-aware-fields]] | Contract entity status remains as-is; suspension is at Account level |
| [[V-login-lockout-3-wrong-attempts]] | Pre-empted by Suspend status — user cannot reach the password screen |

## End-to-end happy-path narrative

**Step 1.** Falcon Sys Admin opens [[Organization Hierarchy]] → searches / navigates to the target Account. PES allows the action because admin has Suspend permission (per Permission list - Jawad).

**Step 2.** Admin clicks the Account → opens the right-pane / Settings tab → selects Status dropdown → chooses `Suspended` → enters optional reason → clicks Apply. Admin Console POSTs the status change via System Gateway to Commerce. Endpoint: `forward-ref (PATCH /api/Account/{id}/status` or similar).

**Step 3.** Commerce validates the actor's permission (PES) + the tenant's current status (must be in a suspendable state — typically `Active` or `Pending`; cannot suspend an already-Suspended tenant). Commerce persists Account.Status = `Suspended` + Account.SuspendReason + Account.SuspendedAt + Account.SuspendedBy.

**Step 4.** Commerce emits `commerce.account-status-changed.v1`. The 5 downstream consumers pick it up:

- **Identity:** marks every user under the tenant as `Status = Disabled` (or equivalent — see [[User Statuses]]; the actual status code may be `Locked` per BR-UM rather than a new `Disabled`). Invalidates active sessions. Emits per-user `identity.user-status-changed.v1`.
- **Charging:** flips wallet aggregate flag to `Frozen`. Reservation API returns 423 `WalletFrozen` (`forward-ref`).
- **Provisioning:** marks tenant Service Orders as `Suspended`; future creations 422 `TenantSuspended` (`forward-ref`).
- **Access PES:** updates internal cache so any future `authorize/*` call for the tenant returns Deny.
- **Core Gateway:** refreshes Redis tenant-status cache. All requests on the tenant route now reject at gateway with `403 TenantSuspended` (`forward-ref`).

**Step 5.** AO receives a notification (email / SMS / Both) delivered by Identity or by a notification adapter (depending on which service owns "suspend reasons inform AO" — `forward-ref (notification ownership not yet documented)`).

**Step 6.** Admin Console refreshes the Organization Hierarchy view; the tenant row now shows a Suspended status badge.

**Step 7.** AO (or any tenant user) attempts to log in later → hits gateway → tenant-status cache says Suspended → gateway returns 403 with "Account suspended — contact your administrator". No password attempt is allowed; lockout counters do not increment.

**Journey ends.** Final state:
- **Account:** `Suspended`
- **All tenant users:** sessions invalidated; status `Disabled` (or `Locked` — see drift note)
- **Wallet:** `Frozen` (no debits, no transfers, no top-ups)
- **Service Orders:** future creations rejected; in-flight aborted or rejected per Provisioning policy
- **AO:** notified

## Recovery path — Unsuspend

A Falcon admin reverses the status by setting Account.Status back to `Active`. Reverse cascade fires the same shape of events with new=Active. Wallet unfreezes, users unlock (per Identity policy — may require admin to also unlock individual locked users), gateway cache flips back, AO can log in. Sibling journey [[Unsuspend Account Flow]] — `forward-ref`.

## Failure modes + recovery paths

- **Step 2 fails (PES denies):** Admin lacks suspend permission. 403 `UnauthorizedAction`. No state change.
- **Step 3 fails (tenant already Suspended):** 422 `InvalidStatusTransition` (`forward-ref`). Admin Console shows inline error.
- **Step 4 partial — Identity consumer down:** Account is Suspended in Commerce but tenant users may still hold valid sessions until Identity catches up + invalidates. Gateway tenant-status cache (Step 4 Core Gateway) should still block requests because that path is independent. Recovery: Kafka replay; Identity idempotent on status-change.
- **Step 4 partial — Charging consumer down:** Wallet not frozen; an in-flight Send Transaction could still debit before Charging catches up. Gateway-level block should pre-empt this, but if the gateway cache also lagged, debit may occur. Recovery: Kafka replay; Charging idempotent.
- **Step 4 partial — Core Gateway cache stale:** Requests slip through until TTL expires. Recovery: manual cache invalidation by ops.
- **Step 5 fails (notification not delivered):** AO doesn't know they're suspended; they hit the login error in Step 7. Recovery: out-of-band call from Falcon Operations.
- **Account had in-flight Send Transactions at moment of suspend:** Provisioning rejects new deliveries. Already-delivered ones are not rolled back. Charging may have already reserved balance for a transaction that won't fulfill — refund flow handles cleanup (`forward-ref (refund flow not yet documented)`).

## Cross-journey dependencies

- **Depends on:** Tenant exists ([[New Tenant Onboarding]] completed). Admin has suspend permission per [[Falcon Roles Permission Matrix]].
- **Pre-empts:** Any in-flight [[Send Campaign]], [[Wallet Transfer]], [[Renew Contract]] on this tenant fails.
- **Triggers downstream:** AO notification → support call → eventual Unsuspend.

## Implementation checklist

- [ ] All page playbooks in the journey are loaded — Organization Hierarchy + (forward-ref) Suspend Account Flow
- [ ] Kafka subscriptions are wired — all 5 consumers (Identity, Charging, Provisioning, Access, Core Gateway) on `commerce.account-status-changed.v1`
- [ ] Error states from each step propagate correctly — PES Deny + invalid transition + partial-cascade failure
- [ ] State transitions per actor are tested end-to-end — Account: Active → Suspended; Users: Active → Locked/Disabled; Wallet: Active → Frozen
- [ ] Partial-cascade failure UX is acceptable (no admin-visible inconsistency)
- [ ] Gateway tenant-status cache TTL is short enough to enforce suspension quickly
- [ ] Notification path delivers reliably (AO must learn out-of-band)
- [ ] Unsuspend journey is fully tested for reversibility

## Hubs

- [[Organization Hierarchy]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
