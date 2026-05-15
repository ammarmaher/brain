*** Journey Playbook — Send Campaign ***
*** Multi-page user flow · 2026-05-15 ***
*** Crosses: [[Contact Groups]] · [[Templates]] · [[Send Transaction]] · Charging cascade ***

# Send Campaign

> A Normal User on the Client portal browses Contact Groups, picks an audience, picks a Template, composes a Send Transaction, and confirms. The backend resolves the **nearest-expiring Active contract** for the relevant CommChannel and charges against its wallet bucket. Provisioning fans out the actual delivery. Journey ends when the Send Transaction is `Accepted` and the wallet's nearest-expiring contract bucket is debited by the computed cost.

## Actors involved

| Actor | Role |
|---|---|
| Normal User | Composes the Send Transaction; selects audience + template |
| Node Admin | Same capability scoped to own sub-node (per [[Falcon Roles Permission Matrix]]) |
| Account Owner | Same capability tenant-wide (oversight); typically delegates |
| Contact Group Service | Owns Contact Group catalog + member resolution |
| Templates Service | Owns Template catalog; resolves variables; gates Maker/Checker if required |
| Commerce Service | Persists Service Order / Send Transaction; resolves nearest-expiring contract |
| Charging Service | Reserves + debits against the resolved contract bucket |
| Provisioning Service | Hands the send to the CommChannel adapter for actual delivery |
| Access (PES) Service | Gates "Send" action + Contact Group visibility + Template availability |
| Core Gateway | Routes Client-side calls; enforces IP allowlist |

## Pages traversed (in order)

1. [[Contact Groups]] — User opens the Contact Groups list, browses, picks one. `forward-ref (page not yet seeded — covered by PRD-04)`
2. [[Templates]] — User picks a Template that matches the chosen CommChannel. `forward-ref (page not yet seeded — covered by PRD-05)`
3. [[Send Transaction]] — User composes the message body / variables, picks the scheduled time (or "now"), reviews cost preview, confirms. `forward-ref (page not yet seeded)`

## Flow playbooks used

- [[Contact Group Selection Flow]] — `forward-ref (flow not yet seeded)`. Loads list via `GET /api/contact-group`, filters by user permission, applies share-policy mode (per [[V-contact-group-share-policy-mode-mutex]]).
- [[Template Selection Flow]] — `forward-ref (flow not yet seeded)`. Loads templates filtered by the user's CommChannel scope; resolves Maker/Checker state per [[V-template-checker-level-integrity]].
- [[Send Transaction Flow]] — `forward-ref (flow not yet seeded)`. Composes + submits the Send Transaction; cost preview pre-call.

## Backend services exercised (in order)

- [[Core Gateway Service]] — first hop; enforces IP allowlist + JWT.
- [[Contact Group Service]] — list + read of Contact Group (member count, validation status).
- [[Templates Service]] — list + read of Template; variable schema; Maker/Checker state.
- [[Access PES Service]] — runtime authorization decisions: can-this-user-send-on-this-channel · can-this-user-use-this-template · can-this-user-target-this-group.
- [[Commerce Service]] — persists the Send Transaction / Service Order; resolves nearest-expiring contract per the channel; composes the cost.
- [[Charging Service]] — reserves balance pre-confirm; debits on confirm; returns `InsufficientBalance` 422 if reservation fails.
- [[Provisioning Service]] — consumes `commerce.service-order-created.v1` → triggers actual CommChannel delivery (out-of-scope here).

## Kafka events fired

| Event | Producer → Consumer | Fires between... |
|---|---|---|
| `commerce.service-order-created.v1` | Commerce → Provisioning + Charging | Send Transaction Submit → delivery + debit |
| `commerce.charging-debited.v1` | Commerce / Charging → audit consumers | `forward-ref (event name TBC)` — fires post-confirm |
| `templates.template-used.v1` | Templates → analytics consumers | `forward-ref (event name TBC)` — fires when a template is materialized into a Send |
| `provisioning.delivery-started.v1` | Provisioning → downstream adapters | `forward-ref (event name TBC)` — outside scope; mentioned for completeness |

> Brain SK's BACKEND_INDEX records the Kafka producers (Commerce / Contact Group / Identity) but does not yet enumerate Send-Transaction-specific events. The names above are the best-known names; verify against `understanding/backend/commerce/ENDPOINT_REGISTRY.md` + `provisioning/SERVICE_OVERVIEW.md` at integration time.

## V-rules touched

| V-rule | Where it fires |
|---|---|
| [[V-contact-group-share-policy-mode-mutex]] | Step 1 — Contact Group visibility per share policy |
| [[V-contact-group-file-type-allowlist]] | Indirect — Contact Group must already be validated; rule fired at upload time |
| [[V-template-checker-level-integrity]] | Step 2 — Template must be in `Approved` state, not Maker/Checker pending |
| [[V-account-ip-allowlist-enforcement]] | Step 0 implicit — gateway-enforced on every request |
| [[V-charging-insufficient-balance]] | Step 3 confirm — reservation may return 422 |
| [[V-contract-edit-status-aware-fields]] | Indirect — contract status determines whether it is eligible for charging |
| [[V-normal-user-limit-enforcement]] | Indirect — the user must already exist (account-level cap was checked at user creation) |

## End-to-end happy-path narrative

**Step 1.** Normal User opens [[Contact Groups]] (`forward-ref`). Page lists Contact Groups visible per the user's PES scope + share-policy mode ([[V-contact-group-share-policy-mode-mutex]]). User picks one (status `Approved`, member count > 0).

**Step 2.** User navigates to [[Templates]] (`forward-ref`) — or opens the Template picker inline. Page filters templates by the CommChannel implied by the selected Contact Group (or by the user's role). Each Template surfaces its variable schema, latest version, Maker/Checker state.

**Step 3.** User picks a Template in `Approved` state ([[V-template-checker-level-integrity]] guarantees it is sendable).

**Step 4.** User opens [[Send Transaction]] (`forward-ref`). Wizard / form shows: audience preview (member count from the Contact Group) · message preview (template body with variable bindings) · scheduling (Now / scheduled) · cost preview (computed by Commerce against current contract rates).

**Step 5.** User clicks Send. Frontend submits via Core Gateway → Commerce `POST /api/send-transaction` (or equivalent — `forward-ref endpoint`). Commerce:
1. Validates inputs (group exists + approved · template exists + approved · user PES allows · variables bound).
2. Resolves the **nearest-expiring Active contract** for the relevant CommChannel (PRD-03 charging-cascade rule). If no Active contract exists, returns `NoActiveContract` 422.
3. Computes cost from contract rate-card × audience count.
4. Calls Charging to reserve balance on that contract's wallet bucket. If reservation fails, returns `InsufficientBalance` 422 ([[V-charging-insufficient-balance]]).
5. On success, persists the Send Transaction in `Accepted` status, emits `commerce.service-order-created.v1`.

**Step 6.** Provisioning consumes `service-order-created` → hands the send to the CommChannel adapter for actual delivery.

**Step 7.** On delivery acknowledgement (or per debit policy), Charging commits the reservation as a debit. Wallet bucket balance reduces by cost.

**Step 8.** Frontend shows success toast: "Send transaction accepted." User can navigate to the Sent History page (out-of-scope).

**Journey ends.** Final state:
- **Send Transaction:** `Accepted` (then `Delivered` / `Failed` per delivery callbacks)
- **Wallet bucket (nearest-expiring contract):** debited by cost
- **Contact Group:** unchanged
- **Template:** usage counter incremented (if tracked)

## Failure modes + recovery paths

- **Step 1 fails (no visible Contact Groups):** User cannot proceed. Cause: PES scope or share-policy mode. Recovery: AO grants visibility or user joins the right node.
- **Step 2 fails (no matching Templates):** Cause: every template is Draft / Pending Approval / Rejected. Recovery: wait for Checker approval ([[V-template-checker-level-integrity]]).
- **Step 5.2 fails (`NoActiveContract` 422):** Wallet is empty because no contract has activated. Recovery: AO creates / renews a contract — see [[Renew Contract]] or [[New Tenant Onboarding]] Step 10.
- **Step 5.4 fails (`InsufficientBalance` 422):** Reservation against nearest-expiring contract fell short. Recovery: AO top-up via wallet transfer ([[Wallet Transfer]]) or new contract ([[Renew Contract]]).
- **Step 5 fails with 403 (`Forbidden` / `UnauthorizedAction`):** PES denied. Cause: user lacks Send permission on this channel / group / template. Recovery: AO adjusts permissions; no in-flow recovery.
- **Step 6 fails (Provisioning consumer down):** Commerce stored the Send Transaction in `Accepted` but no delivery happened. Recovery: Provisioning replays Kafka offsets when back; idempotent on `service-order-created`.
- **Step 7 fails (delivery callback never arrives):** Send sits in `Accepted` forever. Recovery: delivery-timeout job marks it `Failed`; refund flow may credit the wallet bucket back. (`forward-ref (refund flow not yet documented)`).
- **IP allowlist denies (Step 0):** Standard 403 toast (BR-UM-24 generic "Request not permitted from your network").

## Cross-journey dependencies

- **Depends on:** [[New Tenant Onboarding]] completed (Active Account + Active Contract + funded wallet). User in `Active` status (per BR-UM-08). Contact Group `Approved`. Template `Approved`.
- **Triggers downstream:** Wallet balance reduction → may cascade to [[Renew Contract]] if balance approaches zero on the active contract.
- **Sibling journey:** [[Wallet Transfer]] is the orthogonal way wallet state changes; this journey is the only way wallet state changes via business transactions.

## Implementation checklist

- [ ] All page playbooks in the journey are loaded — Contact Groups + Templates + Send Transaction
- [ ] Kafka subscriptions are wired — Provisioning + Charging listening to `commerce.service-order-created.v1`
- [ ] Error states from each step propagate correctly — `NoActiveContract` + `InsufficientBalance` + Forbidden all rendered cleanly
- [ ] State transitions per actor are tested end-to-end — Send Transaction: Composed → Accepted → Delivered/Failed; Wallet: balance unchanged → debited
- [ ] Nearest-expiring-contract charging cascade is verified against test data (multiple Active contracts, varying expiry)
- [ ] PES gates are enforced (Contact Group visibility · Template availability · Send permission)
- [ ] Cost preview pre-call matches actual debit (no surprises on confirm)

## Hubs

- [[Organization Hierarchy]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
