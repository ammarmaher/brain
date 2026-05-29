# AI-SPEC — Wave 8: PRD Business Rule → Gherkin Test Case Authoring

> AI design contract for the Wave 8 test case authoring system.
> Consumed by QA engineers, business managers, and eval auditors.
> Generated 2026-05-17 by gsd-domain-researcher.

---

## 1. System Classification

**System Type:** Content Generation / Extraction (Hybrid)

**Description:**
This system ingests structured PRD business rule documents (BUSINESS_RULES.md per module) and generates Gherkin-format test scenarios suitable for business-team review and QA engineering handoff. The system operates across 5 platform modules (Account Management, User Management, Contract & Cost, Contact Group, Templates) covering 221 confirmed business rules in the CPaaS / telecom billing domain. "Good" means each generated scenario is independently verifiable by a business manager without engineering context, maps to exactly one BR-* rule, and contains specific enough acceptance criteria that two QA engineers would write the same test.

**Critical Failure Modes:**
1. Generating a scenario that inverts the business rule — e.g., stating the system ACCEPTS an invalid input when the rule says it must REJECT it
2. Conflating roles — asserting that a Falcon usertype action is available to a Client usertype (or vice versa), which would cause a security test gap
3. Producing scenarios for [OPEN] or [INFERRED] rules without marking them as unverified, leading business managers to approve test cases based on speculation rather than confirmed PRD
4. Missing the permission dimension on rules that carry role gates — every wallet transfer rule, status transition, and edit restriction has a "who can" clause that, if untested, leaves an authorization gap in production
5. Fabricating PRD citations — attaching a line number or rule ID that does not exist in the source document, undermining the traceability chain

---

## 1b. Domain Context

> Researched by gsd-domain-researcher. Grounds the evaluation strategy in domain expert knowledge.

**Industry Vertical:** CPaaS (Communications Platform as a Service) / Telecom Billing & Account Lifecycle Management

**User Population:** Two distinct populations interact with outputs of this system:
- **Business managers / Product owners** — review Gherkin scenarios for correctness against their understanding of platform rules; use them in sprint planning and UAT sign-off sessions
- **QA engineers** — translate accepted Gherkin into automated or manual test scripts; require unambiguous preconditions, actions, and assertions
The *authoring* AI system is operated by senior Falcon platform team members running night-shift mining sessions.

**Stakes Level:** High

**Output Consequence:** Accepted test scenarios become the UAT acceptance gate for the Falcon platform before production release. A test scenario that incorrectly encodes a business rule will either (a) pass a broken system through UAT (missed defect) or (b) block a correct system (false regression). In the wallet / billing domain, a missed defect can result in unauthorized balance transfers, incorrect deductions from expired contracts, or clients accessing channels they have not paid for — all of which carry direct financial liability and potential regulatory exposure under Saudi SAMA and CITC telecom regulations.

---

### What Domain Experts Evaluate Against

**Dimension: Role precision on authorization rules**
Good (domain expert would accept): Scenario explicitly names the Falcon usertype or Client usertype performing the action, and the test assertion confirms the OTHER role is blocked — e.g., "Given a Client Account Owner is authenticated / When they attempt to transfer Master Wallet to Comm Wallet / Then the system returns 403 Forbidden"
Bad (domain expert would flag): Scenario says "a user transfers between wallets" without specifying which usertype; the role gate is the entire point of the business rule
Stakes: Critical
Source: [PRD] Wallet transfer matrix BR-AM-30..33; SAMA regulatory principle of least-privilege access in financial platforms

**Dimension: Financial state specificity in wallet / balance scenarios**
Good (domain expert would accept): Scenario specifies the wallet type (Single vs. Multiple), balance amount relative to the transfer limit cap, and which contract's record is tagged — e.g., "Given account has Balance Transfer Limit of 20% / And User wallet balance is 1000 SAR / When Node Admin initiates a 250 SAR transfer / Then system rejects with 'ExceedsBalanceTransferLimit'"
Bad (domain expert would flag): Scenario says "a transfer is attempted" without specifying the limit configuration, wallet type, or expected error code — QA cannot reproduce this test deterministically
Stakes: Critical
Source: [PRD] BR-AM-34 Balance Transfer Limit cap; [BRAIN-OUT] account-management BUSINESS_RULES.md; telecom billing audit doctrine (deterministic rule-based assertion over probabilistic output)

**Dimension: FSM transition completeness for status lifecycles**
Good (domain expert would accept): For every status transition scenario, both the ALLOWED and BLOCKED transitions from the same source state are covered — e.g., for CommChannel "Expired" state: payment restores to Active (allowed), manual Disable is allowed, but auto-transition to Active without payment is blocked
Bad (domain expert would flag): Only the happy-path transition is tested; the negative guard (attempting an invalid transition from the same state) is absent — this is the gap where billing errors hide
Stakes: High
Source: [PRD] BR-AM-20..24 CommChannel lifecycle; BR-UM-06..08 User status transitions; BR-CC-11..17 Contract status machine; industry practice: FSM coverage requires N+1 (valid + all invalid from each state)

**Dimension: Traceability — every scenario cites its BR-* rule**
Good (domain expert would accept): Each scenario file header and individual scenario contains the BR-* rule ID it tests, the PRD citation (file:line), and the source tag ([CONFIRMED] / [INFERRED] / [OPEN])
Bad (domain expert would flag): Scenario exists but has no BR-* reference — a business manager cannot determine whether this tests an actual PRD requirement or a developer assumption; blocks sign-off
Stakes: High
Source: Falcon PRD knowledge chain doctrine (Brain SK skill: prd-knowledge); standard Gherkin traceability practice for regulated platform releases

**Dimension: Boundary condition precision on field validation rules**
Good (domain expert would accept): Scenario tests the exact boundary value — e.g., for Account Name (<=30 chars, must start with letter): tests exactly 30 chars (pass), 31 chars (fail), starts with digit (fail), starts with letter (pass), empty (fail) — each as a separate scenario row in a Scenario Outline
Bad (domain expert would flag): Scenario says "account name is too long" without specifying the threshold — two QA engineers will write different tests for "too long"; boundary ambiguity is the most common source of test coverage gaps in billing platforms
Stakes: Medium
Source: [PRD] BR-AM-03, BR-UM-11..12, BR-TM-04..05; standard boundary value analysis doctrine for data-entry validation in enterprise platforms

---

### Known Failure Modes in This Domain

**1. Role-flattening on multi-tier permission rules**
The Falcon platform has 6 distinct user roles across 3 node levels (Root / Main / Sub). When an AI system generates test cases, it consistently collapses "Falcon usertype" and "Client usertype" into a generic "admin user," producing test scenarios that miss the cross-tier authorization boundary. In production, this manifests as Node Admins accessing Falcon-only wallet operations or Client AOs performing account-creation operations reserved for Falcon System Admins.
Source: [PRD] BR-UM-01..05; [BRAIN-OUT] user-management BUSINESS_RULES.md; observed pattern in multi-tier RBAC test generation

**2. FSM dead-state omission in billing lifecycle rules**
Test case authoring systems reliably cover the primary "payment received" happy path and miss the grace-period dead states. For CommChannel lifecycle, the "InActive (Grace Period Ends)" state is the most commercially significant — it means the client has lost service without notice if the 7/30-day window expired silently. Generated scenarios tend to conflate this with the initial "InActive (First time)" state. In production, this has caused billing teams to miss service-restoration SLA violations.
Source: [PRD] BR-AM-20..23; industry CPaaS billing failure mode documentation

**3. Contract-wallet interplay omitted from contract status tests**
When a contract transitions from Active to Expired (BR-CC-14), wallet records are retained but subtracted from lump-sum values — meaning the Master Wallet balance drops without any explicit transfer transaction. AI-generated test cases typically model this as a simple status change and do not include the wallet-balance assertion. Business managers reviewing such scenarios will approve them without realizing the financial state change is untested.
Source: [PRD] BR-CC-14, BR-AM-38; [BRAIN-OUT] contract BUSINESS_RULES.md

**4. Two-step external approval gate collapse (Templates)**
The WhatsApp template Maker/Checker/Meta approval chain (BR-TM-21..23) is a two-step gate where internal Checker approval is necessary but not sufficient — Meta external approval is also required for WhatsApp templates. AI systems generating test cases regularly collapse this into a single "approved" state, producing scenarios that would pass a broken system where Meta rejection is silently swallowed.
Source: [PRD] BR-TM-23; WhatsApp Business API approval governance

---

### Regulatory / Compliance Context

**SAMA (Saudi Arabian Monetary Authority) — Financial data handling**
Wallet balance records, contract values, and transfer transactions are financial records subject to SAMA data retention and audit trail requirements. Test scenarios for wallet operations must include an assertion that every balance-affecting action is tagged with a contract ID (BR-AM-36) — this is the audit trail. A scenario that tests only the balance change without asserting the contract tag omits a regulatory compliance check.

**CITC (Communications and Information Technology Commission, Saudi Arabia) — Telecom service lifecycle**
CommChannel activation, suspension, and grace period rules (BR-AM-20..24) reflect telecom service continuity obligations under CITC. The 7-day (Monthly) and 30-day (Yearly/OneTime) grace periods are commercially agreed SLAs with regulatory backing. Test scenarios must verify the exact grace-period duration, not just that a grace period exists.

**WhatsApp Business API — Meta Platform Policy**
Template submission and approval flows (BR-TM-17..27) are governed by Meta's WhatsApp Business Platform policy, which requires a documented two-step approval chain. Non-compliance (e.g., auto-approving templates that should go through Meta) can result in WhatsApp Business Account suspension.

**Note:** GDPR does not directly apply to this deployment (Saudi Arabia jurisdiction). HIPAA not applicable. PCI-DSS not directly applicable (wallet is points-based, not payment-card data).

---

### Domain Expert Roles for Evaluation

| Role | Responsibility in Eval |
|------|----------------------|
| Falcon Product Manager (PRD owner) | Reference dataset labeling — confirms each generated scenario accurately encodes the PRD intent; flags role-flattening and FSM omissions; final sign-off authority on [CONFIRMED] rule coverage |
| Billing / Finance Lead | Rubric calibration for wallet, contract, and balance scenarios — verifies financial state assertions are commercially accurate (amounts, contract tagging, deduction order) |
| QA Lead (Falcon platform) | Production sampling — reviews 10% of generated scenarios for reproducibility: can a QA engineer execute this test with no additional context? Flags ambiguous preconditions |
| SAMA/CITC Compliance Officer | Edge case review for wallet transfer limit and contract expiry scenarios — confirms audit trail assertions meet regulatory documentation requirements |
| WhatsApp Integration Lead | Reviews all Template module (TC-TM-*) scenarios for Meta approval gate accuracy — has production experience with Meta rejection behavior |

---

### Research Sources

- [The Next Decade of Telecommunications Artificial Intelligence](https://arxiv.org/abs/2101.09163) — BSS/OSS AI integration patterns and evaluation challenges
- [A Survey of AIOps in the Era of Large Language Models](https://arxiv.org/html/2507.12472v1) — failure localization in distributed telecom systems, 2025
- [Denial of Wallet: Cost-Aware Rate Limiting for Generative AI Applications](https://handsonarchitects.com/blog/2025/denial-of-wallet-cost-aware-rate-limiting-part-1/) — cost-based failure modes in AI-integrated billing platforms
- [Revolutionizing telecom revenue assurance: the AWS AI-driven framework](https://aws.amazon.com/blogs/industries/revolutionizing-telecom-revenue-assurance-the-aws-ai-driven-framework-for-next-generation-solutions/) — deterministic audit trail requirements for telecom billing AI
- [The 4-Step AI Playbook for Telcos to Modernize Legacy Billing Systems](https://mobilelive.ai/blog/the-4-step-ai-playbook-for-telcos-to-modernize-legacy-billing-systems/) — production failure modes in telecom billing AI modernization
- [PRD] Brain SK modules 01..05 BUSINESS_RULES.md — canonical business rule source for all 5 platform modules
