# Volume 49 — Template Lifecycle Specialist Guide

> **Specialist depth:** Unified operating model for template creation, maker/checker workflow (V4 Free/Restricted Body, 1-Level/2-Level), 6-status lifecycle (Pending/Approved/Rejected-internal/Rejected-final/Restricted/Deleted), Meta integration boundary, hierarchy-axis action matrix, status mapping Meta↔Falcon, variable interpolation, and i18n.
>
> **Source-of-truth boundary:** Combines Vol 41 (Template V4 deep refresh), Vol 44 §4 (template tab matrix TM-TT-01..08), Vol 46 §2 (WhatsApp template lifecycle), Statuses-for-Template.txt BRD content. Code mining queued for Wave 19.

---

## §1 — Template Concept

### §1.1 What is a template?

A **template** is a pre-defined, reusable content shape with variable placeholders. Templates exist per channel (WhatsApp, Voice, SMS, Email-partial).

```
Template "OrderConfirmation_v2" (WA-Util)
  body: "مرحبًا {{1}}, طلبك رقم {{2}} بقيمة {{3}} ريال تم تأكيده."
  variables: [customerName, orderId, amount]
  status: Approved
  meta_template_id: HX1234... (after Meta approval)
```

### §1.2 Why templates?

Three reasons:
1. **Meta requires it** — outside the 24h customer service window, WhatsApp ONLY accepts pre-approved templates.
2. **Maker/checker compliance** — high-volume marketing content needs human-reviewed approval before it ships.
3. **i18n/personalization** — variable placeholders enable per-recipient customization without re-creating content.

### §1.3 Channels that use templates

| Channel | Template required? | Approval gate |
|---|---|---|
| WhatsApp Marketing/Util/Auth | **Mandatory** outside 24h window | Meta + (optional) internal maker/checker |
| WhatsApp Service (within 24h window) | Optional (free-form allowed) | None |
| Voice | Required (audio template) | Falcon-internal only (no Meta) |
| SMS | Best-practice, not mandatory | Falcon-internal only |
| Email | [INFERRED] best-practice | [INFERRED] internal |

---

## §2 — The 6 Status Lifecycle States

### §2.1 Status definitions

| Status | Definition | Reached from | Reached to |
|---|---|---|---|
| **Pending** | Awaiting review (internal maker/checker OR Meta) | Created · Rejected-internally (after Edit + Re-submit) | Approved · Rejected-internally · Rejected-final |
| **Approved** | Live, sendable | Pending | Restricted · Deleted |
| **Rejected internally** | Internal maker/checker rejected; loop-back to author | Pending | Pending (after Edit + Re-submit) |
| **Rejected final** | Meta rejected (terminal) | Pending (after passing internal) | (terminal — no recovery) |
| **Restricted** | Meta paused (quality issue) | Approved | Approved (if Meta restores) · Deleted |
| **Deleted** | Soft-deleted | Approved · Restricted | (terminal soft-delete; Falcon-only un-delete?) |

### §2.2 Transition graph

```
                      ┌─────[INITIAL]─────┐
                      │  user creates      │
                      ▼                    │
              ┌──────────────┐             │
              │   PENDING    │ ◄────────── │
              └──────────────┘             │
              ├───────┬──────┐             │
              │       │      │             │
       (passes      (rejected (rejected     │
       maker/        by maker/  by Meta     │
       checker)      checker)  final)       │
              │       │      │             │
              ▼       ▼      ▼             │
       ┌─────────┐ ┌─────┐ ┌────────────┐ │
       │APPROVED │ │ REJ │ │ REJ FINAL  │ │
       └─────────┘ │INT  │ └────────────┘ │
              │   └─────┘                  │
       ┌──────┼──────┐ │                   │
       │      │      │ │ (Edit + Re-submit)│
       ▼      ▼      ▼ └───────────────────┘
   ┌──────┐┌─────┐
   │RESTR.││DEL.  │
   └──────┘└─────┘
       │
       └── (Meta restores) ──> APPROVED
```

### §2.3 Meta↔Falcon status mapping (Vol 46 §8)

| Falcon | Meta equivalent | Notes |
|---|---|---|
| Pending | In-review / Appealed | Awaiting Meta verdict |
| Approved | Active | Live |
| Rejected internally | (not yet sent to Meta) | Falcon-internal |
| Rejected final | Rejected | Meta rejected; terminal |
| Restricted | Paused / Disabled | Meta paused (quality) |
| Deleted | Deleted | Either side |

For **Voice templates** — no Meta involvement; statuses are Falcon-internal only.

---

## §3 — Free Body vs Restricted Body (Vol 41 V4)

### §3.1 The concept

A template's **body type** determines its approval path:

| Body type | Internal review | Meta path |
|---|---|---|
| **Free Body** | Auto-approved (skips maker/checker) | Goes directly to Meta (WA) or to Active (Voice) |
| **Restricted Body** | Requires internal maker/checker (1-Level or 2-Level) | Only after internal approval does Meta receive (WA) |

### §3.2 What makes a body "Restricted"?

Configurable per-account or per-template-category:
- High-risk content categories (Marketing requiring legal/brand review).
- Templates with PII variables.
- Templates with promotional offers (regulated content).
- Templates sent to vulnerable demographics.

Account-level toggle for which body type is the default.

---

## §4 — Maker/Checker Workflow

### §4.1 Roles

- **Maker** — the author who creates the template.
- **Checker (Level 1)** — first reviewer (typically Reviewer-NA or AO).
- **Checker (Level 2)** — second reviewer (typically AO, if 2-Level mode is enabled).

### §4.2 The 4 modes

| Body Type | Level | Path |
|---|---|---|
| Free Body | n/a | Pending → auto-Approved → (if WA) → Meta |
| Restricted Body | 1-Level | Pending → Level-1 Approved → (if WA) → Meta |
| Restricted Body | 2-Level | Pending → Level-1 Approved → Level-2 Approved → (if WA) → Meta |
| Restricted Body | 2-Level with Rejection | Pending → Level-1 Approved → Level-2 Rejected → Rejected-internally → Edit loop |

### §4.3 PES gates per role

| Action | PES key | Status gate |
|---|---|---|
| Create template (Maker) | `template.create` | caller=Active |
| Approve at Level 1 | `template.approveL1` | caller=Active, status=Pending |
| Approve at Level 2 | `template.approveL2` | caller=Active, status=L1-Approved (if 2L mode) |
| Reject (any level) | `template.reject` | caller=Active, status ∈ {Pending, L1-Approved} |
| Edit (after rejection) | `template.edit` | caller=Active, status=Rejected-internally, creator-gate (TM-TT-02) |
| Resubmit | `template.resubmit` | caller=Active, status=Rejected-internally |
| Delete | `template.delete` | caller=Active, status=Approved (TM-TT-02 creator gate for NA/AO; NU unconstrained on own node) |

### §4.4 Notification flow

When Maker submits → Checkers notified (in-app + email).
When Checker approves → next stage or final approval → Maker notified.
When Checker rejects → Maker notified + reason captured.

---

## §5 — Per-Status Action Matrix (Vol 44 §4 canonical)

### §5.1 Templates Tab — His Node

| User Type | Pending | Approved | Rejected internally | Rejected final | Restricted | Deleted |
|---|---|---|---|---|---|---|
| NU | View Details, Share | View Details, Share, Delete | View Details, Share, **Edit** | View Details | View Details | NA |
| NA | View Details, Share | View Details, Share, Delete (his own created) | View Details, Share, Edit (his own created) | View Details | View Details | NA |
| AO | View Details, Share | View Details, Share, Delete (his own created) | View Details, Share, Edit (his own created) | View Details | View Details | NA |
| Falcon usertype | NA | NA | NA | NA | NA | NA |

### §5.2 Templates Tab — Sub-Hierarchy

| User Type | Pending | Approved | Rejected internally | Rejected final | Restricted | Deleted |
|---|---|---|---|---|---|---|
| NU | NA | NA | NA | NA | NA | NA |
| NA | View Details, Share | View Details, Share | View Details, Share | View Details | View Details | NA |
| AO | View Details, Share | View Details, Share | View Details, Share | View Details | View Details | NA |
| **Falcon usertype** | View Details | View Details | View Details | View Details | View Details | **View Details** |

### §5.3 Pending Review Tab — His Node

All client roles: View Details across all states except Deleted (NA).
Falcon usertype: NA on all.

### §5.4 Pending Review Tab — Sub-Hierarchy

All NA. (Pending Review is per-hierarchy-level — never shows sub-node items.)

### §5.5 Shared Templates Tab — His Node

NU only: View Details across Pending/Approved/Rejected-int/Rejected-final/Restricted. Others NA.

### §5.6 Tautologies (Vol 44 §4.8)

- **TM-TT-01** — NU has more template-edit power on his own node than NA/AO (unconstrained Edit/Delete on Rejected-internally + Approved).
- **TM-TT-02** — NA/AO can only Edit/Delete templates **they personally created** (creator-gate).
- **TM-TT-03** — Falcon User has ZERO access on Templates tab "His Node" view — only sub-hierarchy visibility.
- **TM-TT-04** — Falcon User is the only actor with access to the Deleted column (audit retention).
- **TM-TT-05** — Rejected internally is the ONLY status where Edit is allowed (loop-back to Pending).
- **TM-TT-06** — Restricted templates (Meta-paused) are READ-ONLY everywhere.
- **TM-TT-07** — Shared Templates tab is NU-only on His Node.
- **TM-TT-08** — Pending Review tab is per-hierarchy-level — never shows sub-node items.

---

## §6 — Meta Integration Boundary (WhatsApp)

### §6.1 Submission flow

```
Falcon (creator submits) ─────►  [Internal approval if Restricted Body]
                                          │
                                          ▼ (after Level-1/2 approval)
                                  Meta Business Mgmt API
                                          │
                                          ▼
                                  Meta Review (24-48h typical)
                                          │
                          ┌───────────────┼───────────────┐
                          ▼               ▼               ▼
                     Approved        Rejected         Paused/Restricted
                     (live)          (final)          (quality issue)
```

### §6.2 Meta-side review criteria

- Content compliance (no prohibited categories — gambling, adult, etc.)
- Quality (clear, professional, no spam patterns)
- Category match (Auth/Util/Marketing classification correct)
- Variable usage (placeholders are sensibly used)
- Language correctness

### §6.3 Falcon's Meta-side surface

The Identity service is NOT involved here. Module 05 (Templates) directly communicates with Meta Business Mgmt API:
- `POST /message_templates` — submit new template
- `GET /message_templates` — list with status filter
- `DELETE /message_templates/{id}` — delete (terminal)
- Webhook → Falcon Conversation/Templates service for status changes

### §6.4 Mapping of Meta status changes to Falcon status

Webhook events from Meta → Falcon updates internal status:
- `template_approved` → Falcon status `Approved`
- `template_rejected` → Falcon status `Rejected final`
- `template_paused` → Falcon status `Restricted`
- `template_disabled` → Falcon status `Restricted`
- `template_active` → Falcon status `Approved` (from Restricted)

---

## §7 — Variable Interpolation

### §7.1 Placeholder syntax

Meta-style: `{{1}}, {{2}}, …` for positional variables.

### §7.2 Variable types

| Type | Example |
|---|---|
| Recipient field | `{{recipient.name}}` |
| Custom variable | `{{vars.orderId}}` |
| System token | `{{system.unsubscribe_link}}` |

### §7.3 Validation at send time

For each send:
1. Resolve all placeholders against recipient + send-context.
2. Reject send if any placeholder is unresolvable (missing variable).
3. Optionally apply content policy (e.g., strip HTML, escape special chars).

### §7.4 Variable count limits

Meta limits to 10 variables per template. Falcon should enforce this at template-creation time.

---

## §8 — Internationalization

### §8.1 Per-template language

Each template has a primary language: `ar` (Arabic), `en` (English), etc.

A logical template may have multiple language variants linked by name:
- `OrderConfirmation_ar` (Arabic)
- `OrderConfirmation_en` (English)

BSA picks the right variant per recipient locale (or account default).

### §8.2 RTL handling

For Arabic, the body text is right-to-left. Placeholders interpolate naturally; rendering is per-channel:
- WhatsApp natively renders RTL.
- Voice TTS picks Arabic voice when language=ar.
- SMS sends as-is; recipient handset handles RTL.

### §8.3 Mixed-language scenario

If recipient locale is unknown, fall back to account default language. If account default is missing, fall back to Arabic (KSA market default).

---

## §9 — Edge Cases

### §9.1 Template edited while in-flight send is running
**Setup:** Marketing send to 10k CG is mid-flight; AO edits the template body.
**Behavior:** BSA uses the template **snapshot** at send-initiation time. Edits affect future sends only. The in-flight send completes with the original body.

### §9.2 Template restricted mid-flight
**Setup:** Send to 10k members started 1 minute ago; Meta restricts the template.
**Behavior:** Send continues for already-submitted-to-Meta messages but Falcon-side queue STOPS submitting new ones. Remaining recipients are marked Failed with reason `TemplateRestricted`.

### §9.3 Maker creates, Maker deletes own draft
**Setup:** NU creates template, status=Pending; before checker reviews, NU deletes.
**Behavior:** Allowed — NU is creator. Audit event recorded. Pending Review queue updates.

### §9.4 Variable count mismatch
**Setup:** Template has 3 variables; send specifies only 2.
**Behavior:** Reject at send-validation step (`InvalidVariableCount`).

### §9.5 Rejected-final loop attempt
**Setup:** User tries to edit a Rejected-final template.
**Behavior:** Edit denied (`TemplateRejectedFinalNotEditable`). User must create a new template.

### §9.6 Falcon-side template that doesn't go to Meta
**Setup:** Voice template (Free Body) — internal flow only.
**Behavior:** Same status lifecycle but Approved is set immediately after auto-approval; no Meta submission, no `Rejected final` possible.

### §9.7 Concurrent maker submissions
**Setup:** Two NUs submit the same template name simultaneously.
**Behavior:** Optimistic concurrency on the template entity catches the conflict; second submission fails with `TemplateNameConflict`.

---

## §10 — Error Catalog

| Error code | When | Recovery |
|---|---|---|
| `TemplateNotFound` | View/Edit/Delete — ID invalid or no access | Verify ID + permissions |
| `TemplateNameConflict` | Create — name already used in account | Use different name |
| `TemplateApprovalDenied` | Approve action — caller lacks Level-1/Level-2 PES key | Need correct role |
| `TemplateEditDenied` | Edit — not creator OR not in Rejected-internally state | Only creator can edit; only Rejected-int is editable |
| `TemplateDeleteDenied` | Delete — not creator (NA/AO) or wrong status | Creator gate |
| `TemplateRejectedFinalNotEditable` | Edit on Rejected-final | Create new template |
| `TemplateRestrictedNotEditable` | Edit on Restricted | Wait for Meta restore or create new |
| `InvalidTemplateBody` | Submit — body fails validation | Fix syntax |
| `InvalidVariableCount` | Submit OR send-validation — mismatch | Align variables |
| `TemplateMetaRejected` | After Meta review | Reason captured; create new compliant template |
| `MetaSubmissionFailed` | Meta API call failed (network, rate-limit) | Retry with backoff |

---

## §11 — PR Review Checklist

- [ ] Is the 6-status state machine canonical (use enum + transition policy)?
- [ ] Is Free vs Restricted Body honored (Free auto-approves; Restricted needs 1L/2L)?
- [ ] Is the creator gate applied to Edit (TM-TT-02)?
- [ ] Is the Falcon-staff zero-edit invariant enforced (TM-TT-03)?
- [ ] Is the Rejected-internally → Pending re-submit loop wired (TM-TT-05)?
- [ ] Is Meta submission only after internal approval (for Restricted Body)?
- [ ] Are Meta webhooks properly mapped (template_approved/rejected/paused → Falcon status)?
- [ ] Is variable count enforced at create + send-validation?
- [ ] Is the template snapshot used during in-flight sends (not live)?
- [ ] Is Restricted-during-send handled (queue stops)?
- [ ] Is multi-language linking supported (ar+en variants)?
- [ ] Is the audit event written for every status transition + edit?
- [ ] Is the PES catalog updated for new approve-level keys?
- [ ] Is the Pending Review tab scoped per-hierarchy-level (TM-TT-08)?

---

## §12 — Cross-References

- [[VOL-44-TRUTH-TAUTOLOGIES]] §Template Tab Matrix (TM-TT-01..08)
- Vol 38 — Module 05 Templates conclusion (SUPERSEDED by Vol 41)
- **Vol 41** — Template Module V4 deep refresh (the canonical predecessor)
- Vol 44 §4 — BRD-extracted action matrix
- Vol 46 §2 — WhatsApp template lifecycle within Campaigns hub
- Vol 47 — User Lifecycle (creator gate depends on user status)
- Vol 48 — Contact Group (recipients are the consumer of templates)
- Statuses-for-Template.txt — original Meta↔Falcon status mapping

---

## §13 — New Open Questions

| ID | Question | Owner |
|---|---|---|
| Q-TM-V4-15 (re-open) | Can Falcon Level-1/Level-2 produce a Rejected-final state, or is that Meta-exclusive? | Module 05 architect |
| Q-TM-V4-16 (new) | When a template is Restricted by Meta, can the account un-restrict by re-submitting? | Module 05 + product |
| Q-TM-V4-17 (new) | Variable count cap — Meta is 10; is Falcon's cap also 10 or different? | Module 05 |
| Q-TM-V4-18 (new) | Multi-language linking — explicit field or convention-based (name suffix)? | Module 05 |
| Q-TM-V4-19 (new) | Template `Deleted` status semantics — soft-delete (recoverable) or hard? | Module 05 + audit |
| Q-TM-V4-20 (new) | When Maker is suspended/deleted mid-review-cycle, what happens to the in-progress template? | Module 05 + Module 02 cross-cluster |

---

**End of Volume 49 — Template Lifecycle Specialist Guide**
**Authored:** 2026-05-18 (night-shift continuation)
**Builds on:** Vol 41 (V4 refresh) + Vol 44 §4 + Vol 46 §2 + Vol 47 §9 (user status gates)
**Pending:** Wave 19+ code-mining will produce §V49-CODE-VERIFICATION-ADDENDUM
