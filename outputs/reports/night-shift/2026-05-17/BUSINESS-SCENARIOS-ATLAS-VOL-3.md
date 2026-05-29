---
type: business-scenarios-atlas
volume: 3
title: "Falcon Business Scenarios Atlas — Volume 3: Operational Failure + Multi-Tenant Boundaries (2026-05-18)"
purpose: "What breaks when infrastructure fails? Where are tenant boundaries enforced (and where do they leak)? Business continuity + security guarantee deep-dives."
volume-3-scenarios: 5
---

# Falcon Business Scenarios Atlas — Volume 3

> The questions that come up in BCP/DR reviews and security audits. What happens when Kafka is down? What stops Tenant A from reading Tenant B's data? How robust is multi-tenant isolation in practice?

---

## SCENARIO 13 — Kafka Outage During CommChannel Activation

**Business question:** "We had a 10-minute Kafka outage during peak business hours. Did any client lose money or get stuck in a bad state?"

### Pre-context: where Kafka is used
- Commerce → Charging events (CommChannel payment requests)
- Commerce → Provisioning events (state mirror)
- Identity → Commerce events (UserCreated for tenant linkage)
- Identity webhook handler (Zitadel events)

### The Do Payment scenario during outage

1. AO clicks "Do Payment" on a CommChannel
2. Commerce receives the request, creates an Order record, generates `orderId`
3. Commerce attempts `Publish(CommChannelPaymentRequested)` to Kafka
4. **Kafka unreachable** — publish fails
5. **What does Commerce do?** This is the critical question.

### Three possible behaviors (one is current, two are alternatives)

**Behavior A (likely current — fail fast):**
- Commerce returns 5xx to the FE immediately
- Order record exists in Mongo but no event was published
- FE polling sees order status = "pending" indefinitely → eventually 30-min timeout
- User is shown a failure dialog
- **Risk:** Orphan Order records accumulate. Manual cleanup needed.

**Behavior B (outbox pattern — recommended):**
- Commerce writes Order + Outbox row in a single Mongo transaction
- Background worker retries Outbox → Kafka with exponential backoff
- When Kafka recovers, all queued events publish
- Late-arriving events are processed by Charging in order
- User sees their payment complete (with delay)
- **Tradeoff:** Adds infrastructure (outbox worker, dedup logic)

**Behavior C (transactional Kafka with idempotency):**
- Commerce uses Kafka transactions to ensure atomicity
- Mongo write + Kafka publish are committed atomically
- If Kafka is down, Mongo write fails too — clean rollback
- **Tradeoff:** Performance cost; depends on Kafka transactional support

### What we actually do — [INFERRED from current code]

Based on the controller dossiers and lack of outbox pattern in any service:
- Likely **Behavior A** — fail-fast on Kafka unavailability
- No outbox pattern visible in Commerce or Charging
- Orphan Orders possible during outage

### Recovery playbook (during/after outage)

| Step | Action |
|---|---|
| Detect | Monitoring alerts (Kafka health checks). Operations notified. |
| During outage | Communicate with major clients: "Do Payment / wallet operations temporarily unavailable." |
| New requests | Reject with 503 + retry-after header (if implemented). |
| In-flight requests | Orphan Orders accumulate. Track via dashboard. |
| Recovery | Restart Kafka. Operations runs a cleanup script to retry orphan Orders. |
| Post-mortem | Any orders that lost money but didn't activate the CommChannel must be manually refunded. |

### Business implications

| Question | Answer |
|---|---|
| "Could a client be charged but not get their service?" | **Yes — at risk during outage.** If Commerce wrote the Order + deducted from wallet but the Kafka event to Provisioning failed, the CommChannel status would be stuck. Refund/manual activation needed. |
| "How long can we tolerate Kafka down?" | Indefinitely from a data-loss standpoint (Mongo is the SoT). **Operationally:** all wallet operations become unusable. Business impact: real revenue loss per minute. |
| "Why isn't there an outbox pattern?" | [INFERRED] Velocity tradeoff — outbox adds complexity. Worth re-evaluating as the platform scales. |
| "Can we 'replay' lost messages from Kafka?" | Only if Kafka has retention. Likely 7 days default. After that, manual reconciliation. |
| "What's the SLA for Kafka recovery?" | Falcon-essentials defines this. Recommend RPO=0 / RTO<15min for Kafka cluster. **Verify with infra team.** |

---

## SCENARIO 14 — Zitadel Webhook Delay (UserLocked event lag)

**Business question:** "A user got locked out at 09:00 (3 wrong logins). Until what time was their session still valid?"

### The architecture — [PRD] BR-UM-25/27, [CODE] understanding/backend/identity/controllers/WebhookController

- User authenticates via Zitadel (OAuth2/OIDC). Identity service proxies the login.
- Lockout is enforced by **Zitadel** (their policy engine: 3 failed attempts).
- After Zitadel locks, Zitadel fires a webhook to Falcon Identity: `POST /api/webhook/zitadel` with a `UserLocked` event.
- Falcon Identity consumes the webhook, updates `User.status = Locked` in Mongo.
- **Existing JWT tokens** for this user are still valid for their remaining TTL (typically 1800s = 30 min).

### The lag

```
09:00:00.000 — User submits 3rd wrong password
09:00:00.100 — Zitadel marks user as Locked in its own DB
09:00:00.150 — Zitadel emits UserLocked webhook event
09:00:00.500 — Webhook arrives at Falcon Identity /api/webhook/zitadel
09:00:00.520 — Falcon Identity updates Mongo User.status = Locked
                — Falcon Identity raises a Kafka event for downstream services
09:00:00.700 — Commerce / Charging consume the event (update cached user state if any)
```

**Webhook delay scenarios:**
- Network glitch: 30-second delay
- Zitadel outage: webhook never arrives until Zitadel recovers
- Falcon Identity processing lag: queued behind other events

### What's at risk during the lag

- The user has a valid JWT (issued before the lock)
- The user can continue making authenticated API calls
- Backend services trust the JWT (signature is valid)
- **Risk:** A locked user could still send transactions, view data, etc., until token TTL expires (30 min default)

### Mitigations

| Layer | Mitigation |
|---|---|
| **Token TTL** | Keep access tokens short (30 min). [INFERRED] from `idleTimeoutAt` |
| **Refresh token check** | Token refresh endpoint should re-check User.status. If Locked, refuse to issue new tokens. Forces hard logout after 30 min. |
| **Per-action authorization** | PES check on every authorized action calls Identity → if Identity has Locked status, deny. This closes the lag. |
| **WebhookController security** | The webhook MUST be signed by Zitadel (HMAC verification). [BRAIN-OUT] Wave 5b found this uses **non-constant-time** comparison. Timing attack risk on the verification itself. |

### Q-UM-* relationship

This scenario interacts with the open Q-UM-* questions:
- Q-UM-01: Forgot-password 3-wrong-OTP — does this also fire a UserLocked webhook? PRD-32 says forgot-password is silent on wrong OTPs (no lockout), so presumably NO webhook.
- BR-UM-29: 30-min idle logout — Session.idleTimeoutAt = createdAt + 30min. After this, the session is invalid even if not formally locked.

### Business implications

| Question | Answer |
|---|---|
| "If a user is locked at 09:00, when can they no longer access the platform?" | Hard answer: when their JWT expires (≤30 min from issuance). Soft answer: PES + per-action User.status check should deny within seconds of the webhook arriving. **In practice: ≤30 seconds if webhook is healthy, ≤30 minutes if webhook is delayed.** |
| "What's the worst-case attack window?" | If an attacker gains a victim's JWT, they have full access until that JWT expires (30 min). Locking the victim's account doesn't immediately invalidate the stolen JWT. **JWT rotation + short TTL is the only defense.** |
| "Should we revoke tokens on UserLocked?" | Ideally yes — issue a token revocation list. Currently not in the PRD. **Recommend product add explicit token revocation on Locked/Deleted/Suspended.** |
| "How robust is the webhook?" | Wave 5b found 2 issues: (1) non-constant-time HMAC = timing attack risk, (2) `[AllowAnonymous]` is NOT on this endpoint (it IS on the auth-side TestKafkaController, but not webhook). The webhook is correctly auth-gated except for the HMAC timing vuln. |

---

## SCENARIO 15 — Multi-Tenant Isolation: Where Boundaries Are Enforced (and Where They Leak)

**Business question:** "Can Tenant A's Account Owner ever see Tenant B's data? Where exactly is the isolation enforced?"

### The tenant boundary primitives

Every Falcon entity carries one or more of:
- `tenantId` — Zitadel-issued opaque identifier per Account
- `nodeId` — the tree position (root for Falcon, main/sub for Client)
- `path` — the dot-delimited node path string for hierarchy enrichment
- `accountId` — the Account's primary key (often = main node's id)

These are stamped on JWT claims at login (`u:<userId>@<tenantId>` per PES contract).

### Where isolation is enforced — code-grounded answers

**1. Identity service (login + user CRUD)**
- `ListNodeUsersRequest` requires `TenantId` query param — only users in the requested tenant are returned — [CODE] `understanding/backend/identity/DTO_DICTIONARY.md`
- `currentUser` injection at FastEndpoints layer reads `usertype + tenantId + path` from JWT — [BRAIN-OUT] understanding/backend/identity/SERVICE_OVERVIEW.md
- For cross-tenant access: rejected at the handler layer with `OwnerIdNotMatchWithTenantId` error (where implemented)

**2. Commerce service**
- **SettingController.Get** — ✅ does check `OwnerIdNotMatchWithTenantId` for Client users — [BRAIN-OUT] Wave 5a
- **AccountHierarchyController.GetAccountHierarchy** — 🟡 **does NOT check** tenant isolation (Wave 5a security finding). A Client user with a target nodeId could potentially read another account's hierarchy — [BRAIN-OUT] _pending-questions/wave-5a-AccountHierarchyController-tenant-isolation.md
- **NodeController, ContractsController, etc.** — [INFERRED] should check, but Wave 5a only fully audited 2 controllers for tenant isolation

**3. Charging service**
- WalletController operations are scoped by `accountId` or `walletId`
- The wallet → account link is the isolation boundary
- [INFERRED] If a Client user could spoof a walletId belonging to another tenant, they could potentially transfer funds. The check should be at the handler level — needs verification.

**4. PES (Access service)**
- Subject format `u:<userId>@<tenantId>` — the tenantId is part of the subject
- Rules are tenant-scoped — `p`-rules are templated per tenant
- A user with tenantId=A cannot satisfy a policy rule defined for tenantId=B

**5. Gateway layer**
- Falcon users go through System Gateway (port 7256)
- Client users go through Core Gateway (port 7038)
- The gateway forwards the JWT; the BE services trust the JWT claims

### Where boundaries CAN leak — risk catalog

| Risk | Description | Status |
|---|---|---|
| **Backend handler skips tenant check** | If a handler doesn't read `currentUser.tenantId` and compare to entity's tenantId, cross-tenant access possible. | 🟡 At least 1 confirmed gap (AccountHierarchyController). Suspected in others. |
| **PES rule applied to wrong subject** | If a rule's `obj` field doesn't include tenantId scope, it could match across tenants. | 🟢 Subject contract enforces tenant in obj format. Hard to misconfigure. |
| **Cached user state stale** | If Commerce/Charging cache user metadata and don't invalidate on tenant change, a moved user could see old tenant data. | [INFERRED] no caching layer documented; likely no risk. |
| **Direct DB query** | If anyone runs a Mongo query without tenant filter (analytics dashboards, support tools), data leaks. | Operational risk, not code risk. Mitigate via DB access controls. |
| **JWT spoofing** | If JWT signing key leaks, attacker can craft any tenantId. | Cryptographic risk; depends on key management. |
| **Tenant header injection** | If FE adds a `TenantId` header that the BE trusts over JWT claims. | [INFERRED] Should not exist; verify no BE handler accepts external TenantId override. |

### What's in scope for tenant boundaries

| Resource | Tenant-isolated? | Mechanism |
|---|---|---|
| Users | ✅ | tenantId on User; queries filter by tenant |
| Nodes (hierarchy) | ✅ | parentId chain; nodeId scoped |
| Accounts | ✅ | accountId = main node id |
| Contracts | ✅ | linked to accountId |
| Wallets + WalletRecords | ✅ | linked to accountId or userId |
| ContactGroups | ✅ | nodeId + tenantId |
| Templates | ✅ | tenantId on entity (when built) |
| Permission Groups | ✅ | optional tenantId field |
| CommChannel master catalog | ❌ (intentional — shared) | Per-account CommChannelConfig is tenant-isolated, but the master CommChannel definition is shared. |
| Lookup catalog | ❌ (intentional — shared) | Same as CommChannel master. |
| Application catalog | ❌ (intentional — shared) | Same. |

### Business implications

| Question | Answer |
|---|---|
| "Can Tenant A's Account Owner ever see Tenant B's data?" | **In the FE: never** (routes are tenant-scoped, FE never has a "switch tenant" feature for Client users). **In the backend: at least 1 known gap (AccountHierarchyController) where a crafted HTTP request could return cross-tenant metadata. Other handlers are presumed-safe but not fully audited.** |
| "What about Falcon admins — can they see all tenants?" | **Yes — by design.** Falcon admins (sys-admin, operation, product) operate across tenants. This is explicit in BR-AM-02. |
| "What's the worst-case data leakage?" | Via the AccountHierarchyController gap: account name, sub-node tree structure, possibly wallet aggregate metadata. **Not** the actual contact lists or message content (those are scoped per node/user). Sensitive but not catastrophic. |
| "Have we done a formal tenant-isolation audit?" | Wave 5a covered Commerce partially. **Recommend a full security pass on all Identity + Commerce + Charging + Provisioning + Contact Group + Templates controllers** to verify every handler enforces tenant scope. |
| "What's the SAMA/CITC requirement?" | Saudi data residency rules require client data stays within KSA. Tenant boundaries enforce that **within** Falcon's data; the cloud-hosting region enforces it geographically. |

---

## SCENARIO 16 — Falcon Admin (admin-console) vs Client AO (management-console) — Feature Delta

**Business question:** "When I demo to a new client, what features will the Account Owner have access to that I don't show in our Falcon-admin demos?"

### The two consoles

| Console | Port | User type | Gateway |
|---|---|---|---|
| **admin-console** | 4204 | Falcon (sys-admin / operation / product) | System Gateway (7256) |
| **management-console** | 4301 | Client (account-owner / node-admin / normal-user) | Core Gateway (7038) |
| host-shell | 4200 | Both (entry point + auth) | (chooses gateway per JWT) |

### Feature parity matrix

| Feature area | admin-console (Falcon) | management-console (Client) |
|---|---|---|
| Organization Hierarchy | ✅ Full — all clients visible | ✅ Own account only |
| Add Client | ✅ Full 5-step wizard | ❌ Cannot create clients |
| Add Node / Sub-node | ✅ | ✅ within own account |
| Add User | ✅ | ✅ within own account/sub-tree |
| Edit Account Settings | ✅ | 🟡 Limited — password level + IPs editable; quotas Falcon-only (BR-AM-13) |
| CommChannel visibility toggle (Hide/Show) | ✅ Falcon-only (BR-AM-14) | ❌ |
| CommChannel pricing (priceType, priceValue) | ✅ Falcon-only (BR-AM-25) | ❌ |
| CommChannel Do Payment | ✅ | ✅ Account Owner can |
| CommChannel Enable/Disable | ✅ | ✅ Account Owner (Disable + Do Payment per BR-AM-25) |
| Wallet topology (Single/Multiple + Balance Type) | ✅ Falcon-only (BR-AM-25) | ❌ |
| Master ↔ Comm transfer | ✅ | ❌ (BR-AM-30) |
| Comm ↔ User/Node transfer | ✅ | ✅ AO (BR-AM-31) |
| User/Node ↔ User/Node transfer | ✅ | ✅ AO + NA (BR-AM-32) |
| Contract list view | ✅ | ✅ AO + NA (view only) (BR-CC-40) |
| Add Contract / Edit Contract | ✅ Falcon-only (BR-CC-01) | ❌ |
| Contact Groups — create/edit/share | ❌ (Falcon view+download only) (BR-CGM-13) | ✅ AO + NA + NU per BR-CGM-14..19 |
| Templates — create/edit/submit | ❌ Falcon-cannot-create (BR-TM-01) | ✅ (when built — currently GAP-T-001) |
| Permission Groups | ✅ | ✅ AO can assign |
| Wallets & Balance Mng dedicated page | ✅ admin-console has this | 🟡 ([INFERRED] mgmt-console may have equivalent inside org-hierarchy Settings) |
| Marketplace Applications | ✅ admin-console has this | 🟡 ([INFERRED] mgmt-console shows subscribed apps via tabs) |
| Comms Hub (telemetry) | ✅ admin-console has this | ❌ Falcon-only feature |

### Why the asymmetry — design intent

- **admin-console** is Falcon's "operator workstation" — full platform control
- **management-console** is the client's "self-service portal" — operational management within their account
- The split is intentional: clients should never see other clients' data, Falcon-internal pricing logic, or commercial decisions

### Common confusion points

| Client says | Reality |
|---|---|
| "I want to set my own pricing for CommChannels" | NO. Falcon controls pricing (BR-AM-25). Client only sees the configured price + can choose to pay. |
| "Why can't I create a new application?" | Apps are part of the master catalog (Falcon-controlled). Client subscribes to existing apps. |
| "Why can't I see my contract details?" | You CAN — but view-only. AO sees Remaining Value (Active only) per BR-CC-40. To negotiate, contact Falcon sales. |
| "Where do I create my templates?" | Currently nowhere — Template UI is unbuilt (GAP-T-001). Use Meta's Business Manager directly for now. |
| "Can I export my contact lists?" | Yes — `GET /api/contact-groups/{id}/files/{fileType}` returns original or validated file. Available to all client roles. |

### Business implications

| Question | Answer |
|---|---|
| "What's our 'self-service' story for clients?" | Account/node management + user management + contact groups + payment actions on services. Pricing + contracts + new app/channel onboarding require Falcon admin involvement. |
| "Could we move pricing into management-console as a future feature?" | Architecturally yes (it's an Edit Price action in the FSM). Commercially: probably not — pricing is the commercial relationship core. Keep Falcon-controlled. |
| "What does an Account Owner do day-to-day?" | Create/manage sub-nodes, create/manage users in their account, monitor wallet balance, do Do Payment / Disable on CommChannels, manage contact groups, manage templates (when built). |
| "What does a Falcon Operation role do day-to-day?" | View accounts (cannot create), manage nodes/users on existing accounts, view contracts (cannot edit), set OTP length (BR-UM-28), other ops-team tasks. |

---

## SCENARIO 17 — Sub-Node Creation Cascade

**Business question:** "I'm an Account Owner. I create a sub-node. What ripples through the system?"

### Trigger
- AO opens Organization Hierarchy → selects Main Node → "Add Sub-Node"
- Submits subNodeName (1-30 chars per [INFERRED], starts with letter — same naming rules as Account Name in BR-AM-03)

### Cascade

1. **Commerce** — POST `commerce/Node` with parentId, subNodeName, tenantId
2. **Validation**: `Node.parentId chain length < maxNodeLevels` (account setting from BR-AM-11). If equal to limit, reject.
3. Mongo write: new Node record created
4. **Wallet creation per topology**:
   - User-based + Single: nothing (users get individual wallets)
   - User-based + Multiple: nothing (comm wallets are per-user not per-node)
   - **Node-based + Single**: create one Node Wallet for this sub-node (initially empty)
   - **Node-based + Multiple**: create one Node Wallet PER VISIBLE CommChannel for this sub-node (initially empty)
5. **Permission cascade**: AO and NA permissions extend to the new sub-node automatically (PES rules are hierarchical via `path` matching)
6. **No CommChannel/App cascading** — the sub-node inherits visibility from its parent; doesn't get new CommChannelConfigs
7. Commerce publishes Kafka event `NodeCreated` → Provisioning + Charging consume

### Edge cases

| Case | Behavior |
|---|---|
| `maxNodeLevels = 0` | Means "no limit" per BR-AM-11. Can create infinite depth. |
| `maxNodeLevels = 3` and we're at depth 3 | Reject with appropriate error. |
| Sub-node name collision within same parent | [INFERRED] Likely allowed (unique constraint is at Account Name level, not sub-node level). But UX should warn. |
| Sub-node created in Node-based + Multiple topology with 50 CommChannels | 50 new wallet records created. Performance: 50 inserts. Negligible. |
| AO tries to create sub-node under a DIFFERENT account's main node | Tenant-isolation check rejects (per BR-AM-02 scope rules). |

### Renaming / Moving / Archiving — currently MISSING

Per Wave 4 (Edit Node flow file):
- Renaming a sub-node: ✅ supported (Add/Edit Node playbook)
- **Moving a sub-node to a different parent**: ❌ Marked MISSING in Edit Node flow
- **Archiving a sub-node**: ❌ Marked MISSING

When a client asks "can we restructure our hierarchy?" — answer: rename yes, move no, archive no. **Phase 2 feature.**

### Business implications

| Question | Answer |
|---|---|
| "How deep can a hierarchy go?" | Limited by `maxNodeLevels` (BR-AM-11). Default 0 = unlimited. Practical limit per UX: usually 3-5 levels for most enterprise clients. |
| "If a client says 'we want to reorganize our nodes,' what can we offer?" | Rename: yes. Move sub-tree to different parent: NO (Phase 2). Workaround: create new structure, copy users/contact-groups manually, delete old. |
| "Does the new sub-node automatically get the parent's CommChannels?" | The CommChannelConfigs are at Account level (not per-node). The new sub-node inherits whatever the Account has. |
| "Does a sub-node creation cost anything in the wallet?" | No — sub-node creation is a Commerce metadata operation. No wallet impact. (Wallet records get created in Node-based topology but their balance is 0 until a transfer or contract activation feeds them.) |

---

## Continuous mining queue (Volumes 4-N)

- **Vol 4:** Template approval flow (when Template entity API is built) + Maker/Checker decision tree
- **Vol 5:** Edit User end-to-end (Q-UM-13 RESOLVED so this is now buildable: deferred verification flow)
- **Vol 6:** Compliance gap analysis (SAMA + CITC + GDPR delta vs current state)
- **Vol 7:** Scaling scenarios (1M users, 10M transactions/day — where does the platform bend?)
- **Vol 8:** Negotiation & contract amendment patterns (Rate Card edits, addon additions, mid-contract changes)
- **Vol 9:** Data export & migration scenarios (client off-boarding, vendor change)
- **Vol 10:** Refund flows (Q-CC-49 OPEN — bring to product)

---

*Falcon Brain Forever-Wave · Continuous business deep-diving · Vol 3 written 2026-05-18 · Each volume = 5 more business cascades, source-prefixed.*
