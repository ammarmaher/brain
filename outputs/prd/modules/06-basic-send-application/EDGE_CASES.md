*** PRD Understanding - Basic Send Application - EDGE_CASES_AND_PENDING ***

# 06-basic-send-application - EDGE_CASES_AND_PENDING

> Source PRD: `latest-prd.md` in this folder (extracted from `C:\Users\User\Downloads\lab dirver\Basic Send Application-V5.docx`, user-supplied 2026-07-06; V5 is current & authoritative).
> Derived 2026-07-06 by the bsa-deep-understanding intake (prd-analyst agent, verbatim-quoted, line-anchored to `latest-prd.md`).
> React reference implementation: `C:\Falcon\Source_of_truth_theme\latest 07062026\falcon-ux (4)\admin\basic-app.jsx` — see `REACT_REFERENCE.md` + `GAPS.md`.
> The PRD's own Pending list + Edge Cases, verbatim, with implications.

---

## 6. EDGE CASES + PENDING (verbatim, with implications)

### 6.1 Pending list [PRD-V5 §Pending, L497–504] — verbatim
"- Report page.
- Other Roles behaviour and screens.
- Detailed subpages under the command channel.
- Detailed subpages under the Marketplace application.
- The conversation menu item.
- API documentation and requirements.
- Considering the edge cases below."
Implications ([INFERRED]):
- No reporting UI is in scope for this revision; only per-transaction stats + exports.
- All non-Normal-User experiences (AO/Falcon UserType/admin views, cross-user visibility) are undefined — supports Q-BSA-01/02.
- The centralized WhatsApp "conversation menu item" (V2's aggregation hub, §3.1 C.5 in V2) is explicitly parked; V5 only specifies the per-recipient conversation page.
- The API section is a capability list, not a contract: no endpoints, verbs, schemas, auth mechanism, rate limits.

### 6.2 Edge Cases [PRD-V5 §Edge Cases, L505–508] — verbatim
1. "Zero Balance at Start: If a scheduled campaign begins, and the wallet is already at zero, the entire transaction is immediately marked as 'Failed - Insufficient Balance' and no messages are sent."
   Implication: composite status string "Failed - Insufficient Balance" implies status + reason surfaced together; consistent with BR-BSA-43/51.
2. "Deleted Assets Before Scheduled Send: If a user schedules a send for next week, but another user deletes the selected Contact Group or the Template gets revoked by Meta in the meantime, the system will instantly fail the transaction at execution time and log the reason (e.g., 'Asset Missing')."
   Implication: asset validity is checked at EXECUTION time, not continuously; no advance warning to the scheduler is required ([INFERRED] a warning would be a UX improvement but is not specified); log carries the reason.
3. "Third-Party Rejections: If the system successfully deducts the wallet and sends the message, but WhatsApp later rejects it (e.g., number blocked), this application does not handle the refund. It simply marks the status as 'Failed.' The platform's core Wallet Engine will automatically process the refund based on the overarching contract rules."
   Implications: (a) refund responsibility split — BSA refunds only internal pre-dispatch failures [L82]; post-dispatch provider rejections are the Wallet Engine's job per contract; (b) "marks the status as 'Failed'" refers to a message-level failure, yet Failed is NOT in the WA per-recipient status vocabulary [L145–151] — feeds Q-BSA-07.
---

