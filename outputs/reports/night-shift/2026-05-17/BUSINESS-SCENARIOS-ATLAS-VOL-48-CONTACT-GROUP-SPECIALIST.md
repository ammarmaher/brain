# Volume 48 — Contact Group Specialist Guide

> **Specialist depth:** Operating model for Contact Group (CG) creation, edit, share, delete, download — including the 7-action permission matrix (Vol 44 §5), the creator-only Edit/Delete rule, the Falcon-staff non-mutation invariant, opt-in record management, and the upload validation pipeline.
>
> **Source-of-truth boundary:** BRD facts from `[BRD-EXTRACTED]` Contact-Group-Permissions.txt + Vol 44 §5 (CG-TT-01..05). Code citations queued for Wave 18 mining agent.

---

## §1 — Contact Group Entity Model

### §1.1 Concept

A **Contact Group (CG)** is a named list of recipients (phones, emails) owned by an account. CGs are the targeting input for BSA bulk-fanout sends (Vol 46 §7.1).

### §1.2 Core fields (canonical)

```
ContactGroup {
  id, accountId, name (with MultiLanguageName En + Ar),
  creatorId, createdAt, updatedAt,
  recipientCount (computed),
  status: Active | Archived (lifecycle),
  visibility: Private | Shared,
  sharedWith: [userId | nodeId] (only if visibility=Shared),
  originalUploadFile: { fileId, fileName, format, uploadedAt },
  metadata: { tags, externalRef },
  recipients: subcollection ContactRecipient
}
```

### §1.3 ContactRecipient subcollection

```
ContactRecipient {
  id, groupId, accountId,
  phone (E.164 canonical), email, name,
  customVariables: { [key]: value },
  optInStatus: { whatsapp, sms, email, voice } (per-channel),
  optInTimestamp, optInSource,
  status: Active | OptedOut | Bounced | Invalid,
  metadata
}
```

The `optInStatus` is **per-channel** — a recipient may opt-in to SMS but not WhatsApp, for instance.

---

## §2 — The 7-Action Permission Matrix (Vol 44 §5 — canonical)

### §2.1 Full matrix

| Actor | View Details | Create | Edit | Share | Delete | Download CG | Download Original Uploaded File |
|---|---|---|---|---|---|---|---|
| **Falcon: System Administrator** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Falcon: Product** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Falcon: Operation** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **AO — creator** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **AO — not creator** | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| **NA — creator** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **NA — not creator** | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| **NU — creator** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **NU — not creator** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |

### §2.2 The 5 tautologies (Vol 44 §5.2)

- **CG-TT-01** — Falcon staff cannot mutate CGs — View + Download only.
- **CG-TT-02** — Creator-only Edit and Delete across all client roles.
- **CG-TT-03** — Create + View + Download are universal across client roles.
- **CG-TT-04** — Share hierarchy: NU can only share own-created; AO/NA can share any.
- **CG-TT-05** — Download Original always pairs with Download CG.

---

## §3 — Falcon-Staff Non-Mutation Invariant (CG-TT-01)

> This is the **strongest** "Falcon does not touch customer data" enforcement in the platform.

### §3.1 What Falcon staff CAN do with CGs

- View Details (audit, support investigations).
- Download CG (extract recipient list for analysis/dispute resolution).
- Download Original Uploaded File (verify customer's source data).

### §3.2 What Falcon staff CANNOT do

- Create a CG on the customer's behalf.
- Edit a CG (no recipient additions, no metadata changes, no opt-in flag changes).
- Share a CG to other users/nodes.
- Delete a CG.

### §3.3 Why this matters

This is a **deliberate** PII/GDPR/SAMA hardening:
- Customer-uploaded contact data is **strictly the customer's responsibility** to mutate.
- Falcon staff have read access for support but cannot accidentally (or maliciously) modify recipient lists.
- Even a "System Administrator" Falcon role lacks the mutation PES keys.

### §3.4 How it's enforced

PES gate at command-handler entry:
```
[Authorize(Policy = "ContactGroup.Mutate")]
  → maps to PES key contactGroup.edit | contactGroup.delete | contactGroup.create | contactGroup.share
  → role check: caller.role IN { AO, NA, NU } (NOT FalconAdmin, FalconProduct, FalconOps)
```

---

## §4 — Creator-Only Edit/Delete (CG-TT-02)

### §4.1 The rule

For Edit and Delete actions, the user must be **both** in the allowed role list AND match `cg.creatorId == caller.userId`.

### §4.2 Why not role-based-only?

Two reasons:
1. **Accidental over-write protection** — a busy AO clicking through many CGs shouldn't accidentally Edit a CG created by a Normal User. The creator-only guard forces explicit ownership.
2. **Accountability** — every CG has a single auditable owner. If a CG sends to wrong people, the creator is accountable.

### §4.3 Edge cases

- **Creator deleted** — what happens to their CGs? CGs are NOT auto-deleted; they remain in the account with `creatorId` pointing to a Deleted user. **Edit/Delete is then impossible by anyone** (no live user matches creatorId).
- **Workaround:** AO can request Falcon (or use a future "ownership transfer" feature) to re-assign creator. Not in current scope; **Q-CG-01 (new):** Is ownership transfer in scope?
- **Creator suspended** — Edit/Delete blocked while suspended; restores when resumed.

### §4.4 What "Edit" includes

- Adding/removing recipients
- Updating recipient fields (name, custom variables, opt-in flags)
- Updating CG metadata (name, tags)
- Changing visibility (Private ↔ Shared)
- Adjusting share scope (which users/nodes can see)

Note: bulk re-import (replacing all recipients) is also an Edit, not a Create.

---

## §5 — Share Scopes (CG-TT-04)

### §5.1 Share-target hierarchy

| Sharer | Allowed share targets |
|---|---|
| AO | Any user/node in the account |
| NA | Any user/node within the NA's sub-hierarchy |
| NU (creator only) | Specific users/nodes the NU has visibility into |

### §5.2 Visibility resolution

When a user "Views Details" of a CG:
1. Check `creatorId == caller.userId` — full access if yes.
2. Check if CG is shared with caller (`sharedWith` includes caller.userId or any node above them).
3. Check role-based visibility:
   - AO/NA always see all CGs in their scope.
   - NU only sees CGs they created or that were shared with them.

### §5.3 Sharing mechanics

- Sharer adds user/node IDs to `sharedWith[]`.
- Shared-with users get a notification.
- Shared CG is read-only for the recipient (no Edit/Delete — only the creator has those).
- Recipient CAN use the CG as a send target (in BSA).

### §5.4 Un-sharing

- Only the creator can un-share.
- Recipient can hide a shared CG from their view (UI-only, doesn't affect actual sharing).

---

## §6 — Download CG vs Download Original Uploaded File (CG-TT-05)

### §6.1 The two artifacts

| Artifact | What it is | Format |
|---|---|---|
| **Download CG** | The CURRENT processed recipient list (after dedup, validation, opt-in flags) | CSV/XLSX with canonical schema |
| **Download Original Uploaded File** | The ORIGINAL file the customer uploaded (untouched) | Whatever format was uploaded (CSV/XLSX/JSON/TXT) |

### §6.2 Why both?

- **Download CG** = the current state, for re-use elsewhere.
- **Download Original Uploaded File** = the source-of-truth for audit and "show me what the customer actually uploaded" investigations.

### §6.3 Storage

- Processed CG is stored as the live `recipients` subcollection.
- Original uploaded file is stored in Falcon's blob store (S3 / Azure Blob), referenced by `originalUploadFile.fileId`.
- **Retention:** Original file retained 1+ year (SAMA audit), processed CG retained until explicit deletion.

### §6.4 Why CG-TT-05 pairing?

The actions are paired because:
- Both are read-only operations (no data mutation).
- Both potentially expose PII (phone/email) — same privacy gate.
- Customer expecting "Download" should get both options unambiguously.

---

## §7 — CG vs Recipient Lifecycle

### §7.1 When CG is deleted

- The `ContactGroup` document is marked `Status=Archived` OR soft-deleted.
- The `recipients` subcollection is **typically retained** for audit (90-day grace).
- After grace, recipients can be hard-deleted.
- Any in-flight BSA send referencing the CG continues (uses the snapshot at send-time, not the live CG).

### §7.2 Recipient-level deletion

A single recipient can be removed from a CG. This:
- Removes them from the `recipients` subcollection.
- Does NOT affect their `optInStatus` history (kept for SAMA — proof of past opt-in).
- Future sends to this CG will skip them.

### §7.3 Opt-out cascading

When a recipient opts out (e.g., sends "STOP" to a marketing WA campaign):
- `recipient.optInStatus.{channel} = false`.
- `recipient.status = OptedOut` (if all channels opted out).
- The recipient REMAINS in the CG (visible) but flagged as opted-out — they're skipped from sends.
- Opt-out is **per-channel** — opting out of WA marketing does NOT remove SMS opt-in.

---

## §8 — Opt-in Records (KSA CITC Compliance)

### §8.1 What KSA CITC requires

Per Vol 46 §4.2:
- Every marketing-channel recipient must have a documented opt-in.
- Opt-in records must include: timestamp + source + channel.
- Opt-out keyword ("STOP" / "إيقاف") must be honored.

### §8.2 Falcon's CG schema for opt-in

```
ContactRecipient.optInStatus: {
  whatsapp: { granted: bool, timestamp, source },
  sms: { granted: bool, timestamp, source },
  email: { granted: bool, timestamp, source },
  voice: { granted: bool, timestamp, source }
}
```

### §8.3 Opt-in source enum

- `CustomerOnboarding` — collected during initial signup.
- `WebFormConsent` — user filled a consent form on customer's website.
- `InPersonConsent` — customer's sales/support staff collected.
- `ImportedFromLegacy` — opt-in inherited from prior CRM (must include legacy timestamp).
- `WhatsAppDoubleOptIn` — explicit WA opt-in confirmation message replied to.

### §8.4 Per-send opt-in validation

Before BSA sends a marketing message:
```
foreach recipient in cg.recipients:
  if message.category == 'Marketing':
    if !recipient.optInStatus[message.channel].granted:
      skip
      log: { recipient, reason: 'NoOptIn' }
```

This must happen at the BSA layer, not CG layer.

---

## §9 — Upload Formats & Validation

### §9.1 Accepted formats

- CSV (default)
- XLSX (Excel)
- JSON (programmatic uploads via API)
- TXT (plain phone list)

### §9.2 Canonical column mapping

| Source column | Falcon field |
|---|---|
| `phone` / `mobile` / `cell` | recipient.phone |
| `email` / `e-mail` | recipient.email |
| `name` / `full_name` | recipient.name |
| `first_name`, `last_name` | recipient.name (concatenated) |
| `var_*` | recipient.customVariables.{*} |
| `optin_wa` / `whatsapp_optin` | recipient.optInStatus.whatsapp.granted |
| etc. | … |

Column auto-detection at upload time; user confirms mapping in UI.

### §9.3 Validation pipeline (per recipient)

1. **Required field check** — at least one of phone/email present.
2. **Phone normalization** — convert to E.164 canonical format using destination-ID flow (Vol 44 §8 / Vol 46 §8).
3. **Country code validation** — phone must match a known CC (per Vol 44 §8).
4. **NDC validation** — phone NDC must be valid for the CC.
5. **Length validation** — 7-15 digits.
6. **Email validation** — RFC 5322 syntax check + MX record check.
7. **Dedup** — within CG, dedup by phone (preserve first occurrence; or by configurable rule).
8. **Opt-in inference** — if upload includes opt-in column, populate; else default to `granted=false` (safe default).

### §9.4 Upload outcomes

After processing, the user sees:
- Total uploaded rows.
- Valid recipients added.
- Duplicates removed (count + sample).
- Invalid entries rejected (count + sample + reason).

The original file is stored verbatim; the processed recipients are stored canonically.

---

## §10 — PES Interactions

### §10.1 Key PES gates

| Action | PES key | Status gate | Creator gate |
|---|---|---|---|
| View Details | `contactGroup.view` | caller=Active | — |
| Create | `contactGroup.create` | caller=Active | — |
| Edit | `contactGroup.edit` | caller=Active | `caller.id == cg.creatorId` |
| Share | `contactGroup.share` | caller=Active | NU: `caller.id == cg.creatorId`; AO/NA: any |
| Delete | `contactGroup.delete` | caller=Active | `caller.id == cg.creatorId` |
| Download CG | `contactGroup.download` | caller=Active | — |
| Download Original | `contactGroup.downloadOriginal` | caller=Active | — |

### §10.2 Falcon-staff PES denial

Falcon roles (SystemAdmin, Product, Ops) get only:
- `contactGroup.view`
- `contactGroup.download`
- `contactGroup.downloadOriginal`

They are **explicitly denied** the mutation keys (create/edit/share/delete) via the PES catalog seed.

---

## §11 — Edge Cases

### §11.1 Bulk upload with mixed-validity rows
**Setup:** Upload 1000 rows; 50 fail validation.
**Behavior:** 950 added, 50 rejected with reasons; upload UI shows summary. User can download the rejected-rows CSV to fix and re-upload.

### §11.2 Bulk upload to existing CG
**Setup:** CG has 500 recipients; user uploads new file with 200 entries.
**Behavior:** Two modes (UI option):
- **Append** — 200 new recipients added (deduped against existing).
- **Replace** — existing 500 deleted, 200 new added. Original file replaced.

### §11.3 Opt-in flag changes during BSA send
**Setup:** BSA fans out marketing to 10k CG members; mid-send, 100 opt out.
**Behavior:** BSA uses snapshot of CG at send-time; opt-outs during send are honored from the next batch onwards but already-sent recipients receive the message.

### §11.4 Recipient with no phone OR email
**Setup:** Customer uploads a row with only `name`.
**Behavior:** Rejected at validation step 1.

### §11.5 Shared CG — sharer is deleted
**Setup:** AO-1 creates and shares CG with AO-2; later AO-1 is deleted.
**Behavior:** Shared visibility preserved; AO-2 can still view + use the CG. Edit/Delete impossible (creator gate fails). See §4.3 ownership transfer gap (Q-CG-01).

### §11.6 Large file upload
**Setup:** Customer uploads 1M-row CSV.
**Behavior:** Async processing — upload returns a job ID; UI shows progress. Once complete, recipients are added. **Cap:** typically 100k rows per single upload [INFERRED]; larger requires chunking. **Q-CG-02 (new):** What's the canonical cap?

### §11.7 Cross-account CG visibility
**Setup:** A Falcon admin investigating Account-A; can they see Account-B's CGs?
**Behavior:** **No** — even Falcon staff are account-scoped via PES (`accountId` filter). Falcon support can only see the account they're investigating.

---

## §12 — Error Catalog

| Error code | When thrown | Recovery |
|---|---|---|
| `ContactGroupNotFound` | View/Edit/Share/Delete/Download — id doesn't exist or no access | Verify ID + permissions |
| `ContactGroupAccessDenied` | Caller lacks view/share permission | Request share from creator |
| `ContactGroupEditDenied` | Caller is not the creator | Only creator can edit |
| `ContactGroupDeleteDenied` | Caller is not the creator | Only creator can delete |
| `ContactGroupShareDenied` | NU trying to share non-own CG | Only creator-NU can share |
| `ContactGroupFalconCannotMutate` | Falcon role attempting mutation | This is by design — request customer action |
| `InvalidPhoneFormat` | Phone fails E.164 normalization | Fix format in upload |
| `InvalidCountryCode` | CC not in known list | Add country to account's enabled list |
| `DuplicateRecipientInGroup` | Upload-time dedup catches duplicate | Dedup or use different key |
| `UploadFileTooLarge` | Upload exceeds size cap | Chunk into smaller files |
| `OriginalFileNotAvailable` | Download Original requested but file expired (>1y) | Re-upload if needed |

---

## §13 — PR Review Checklist

- [ ] Is `accountId` filter applied to every CG query? (no cross-account leakage)
- [ ] Is the creator-gate enforced for Edit/Delete?
- [ ] Is the Falcon-staff PES denial enforced for mutation actions?
- [ ] Is the share-target hierarchy checked (NU only own; AO/NA any in scope)?
- [ ] Is the original file preserved on upload (not overwritten by processed CG)?
- [ ] Is phone normalization via the canonical destination-ID flow?
- [ ] Is per-channel opt-in respected (not just a single opt-in flag)?
- [ ] Is the optInTimestamp + source recorded for SAMA?
- [ ] Are deletes soft (Archived status) with 90-day grace, not hard?
- [ ] Are large uploads chunked / async?
- [ ] Is dedup applied within the upload?
- [ ] Is the post-upload summary (added/rejected/duplicates) surfaced in UI?
- [ ] Is opt-out cascading per-channel (not all-channel)?
- [ ] Is the audit event written for every mutation (Create/Edit/Share/Delete)?

---

## §14 — Cross-References

- [[VOL-44-TRUTH-TAUTOLOGIES]] §Contact Group (CG-TT-01..05)
- Vol 37 — Module 04 Contact Group Mgmt Conclusion
- Vol 44 §5 — BRD-extracted permission matrix
- Vol 45 — Wallet Specialist (no direct dep, but mutations require Active status)
- Vol 46 — Campaigns Specialist §4.4 (opt-in compliance) + §9.4 (per-channel opt-in)
- Vol 47 — User Lifecycle (creator gate depends on user status)
- Vol 32 — Campaigns Honest Map (cross-context for opt-in compliance)

---

## §15 — New Open Questions

| ID | Question | Owner |
|---|---|---|
| Q-CG-01 | Is "ownership transfer" of a CG in scope? Currently no path to recover edit/delete after creator is deleted. | Product |
| Q-CG-02 | Canonical upload size cap (per-file recipients)? | Module 04 |
| Q-CG-03 | Original Uploaded File retention — 1 year, longer, or configurable? | Compliance |
| Q-CG-04 | Opt-in record schema details — what's the exact `source` enum vs free-text? | Product + Compliance |
| Q-CG-05 | Cross-CG dedup — does a recipient in CG-A automatically deduplicate in CG-B? | Product |
| Q-CG-06 | CG visibility for NU — does an NU see CGs created by their peers on the same node? | PES catalog audit |

---

**End of Volume 48 — Contact Group Specialist Guide**
**Authored:** 2026-05-18 (night-shift continuation)
**Builds on:** Vol 44 §5 + Vol 37 + Vol 46 §4.2/§9
**Pending:** Wave 18+ code-mining will produce §V48-CODE-VERIFICATION-ADDENDUM
