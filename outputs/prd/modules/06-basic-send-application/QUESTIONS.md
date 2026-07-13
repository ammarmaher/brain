*** PRD Understanding - Basic Send Application - QUESTIONS ***

# 06-basic-send-application - QUESTIONS

> Source PRD: `latest-prd.md` in this folder (extracted from `C:\Users\User\Downloads\lab dirver\Basic Send Application-V5.docx`, user-supplied 2026-07-06; V5 is current & authoritative).
> Derived 2026-07-06 by the bsa-deep-understanding intake (prd-analyst agent, verbatim-quoted, line-anchored to `latest-prd.md`).
> React reference implementation: `C:\Falcon\Source_of_truth_theme\latest 07062026\falcon-ux (4)\admin\basic-app.jsx` — see `REACT_REFERENCE.md` + `GAPS.md`.
> 24 open questions Q-BSA-01..24 - places the PRD is genuinely silent or self-contradictory. Platform-integration questions live in GAPS.md section D.

---

## 7. AMBIGUITIES / OPEN QUESTIONS (Q-BSA-NN)

Only items where V5 is genuinely silent or self-contradictory. Each cites the triggering text.

**Q-BSA-01 — Who exactly is an "authorized user"?** Compose flows open for "an authorized user" [L44, L289] and the CS window allows "authorized users" to free-form message [L266], but authorization is only defined as Normal Users by default minus permission-group overrides [L8]. Can Account Owner / Falcon UserType themselves send? Are conversation permissions the same as send permissions? ABSENT; "Other Roles behaviour and screens" is Pending [L499].

**Q-BSA-02 — Cross-user visibility of Outbox/Scheduled.** Both grids are scoped to "the logged in user" [L100, L163, L345, L411]. Does any role (AO, tenant admin, Falcon UserType) see other users' transactions, or an account-wide view? ABSENT (Pending L499).

**Q-BSA-03 — Cost estimation formula & rate source.** Estimation is "calculated programmatically based on target recipient's destination, template category type, total recipient count, and active contract details" [L76] / "expected call time … , …" [L321], but no formula, no rate-card reference, no rounding rules, no statement whether the estimate is binding vs indicative, and Voice "expected call time" derivation is unstated. ABSENT.

**Q-BSA-04 — Currency assumption (SAR).** "Message cost: 0 SAR." appears in scheduled details [L194, L440]; V2 priced the app at "0 SAR" [V2 L11]. Is SAR the platform-wide fixed currency, or tenant/contract-dependent? ABSENT.

**Q-BSA-05 — Timezone of scheduled datetime.** Schedule pickers [L51, L295] and API send date ("greater than now and datetime format" L466) never specify timezone (tenant TZ? UTC? user browser?). ABSENT.

**Q-BSA-06 — Batch/"patch" size and composition.** The engine works in "records/patches" [L81], "record/batch" [L82], "record/bulk" [L86] with cancellation at "the next immediate batch edge" [L115], yet batch size, whether a batch = one recipient or N, and who defines N are ABSENT. This directly controls cancellation granularity and refund scope.

**Q-BSA-07 — Missing per-recipient WA failure status.** WA statuses are only Pending/Sent/Delivered/Read/Played/Seen [L145–151], yet the PRD needs "Failed Rate: Percentage of messages that failed to send or deliver" [L136] and the Third-Party Rejections edge case "simply marks the status as 'Failed.'" [L508]. Where does a failed WA message surface per-recipient? Contradiction/gap.

**Q-BSA-08 — WA charging mechanism: deduct-then-refund vs reserve-commit-return.** L82 mandates deduct-as-first-step + refund on internal failure; L86 describes reservation + commit/return "(and based on charging controls)". These are different wallet primitives with different failure semantics. Which one is normative, and what are "charging controls"? Internal contradiction.

**Q-BSA-09 — Template-Meta sync is only "We suggest".** L50 proposes a sync call updating template status/body "on templates pages also". Is it a committed requirement, and does send-time validation [L52] depend on it or on webhooks alone? ABSENT commitment.

**Q-BSA-10 — Retry trigger "cancel" vs status "Canceled".** Retry triggers are "(no answer, busy, cancel, failed )" [L296], but Canceled is defined as "user-initiated cancellation or system intervention" [L392] — retrying a user-canceled call contradicts cancellation intent. Also attempt statuses include "unreachable" [L399] which is NOT a configurable trigger [L296] — can an Unreachable attempt ever retry? Contradiction/gap.

**Q-BSA-11 — Voice "Live" vs "Answered" overlap.** Live = "answered by the recipient and the IVR interaction is active" [L389]; Answered = "recipient picked up the call and the IVR started" [L393]. Which is transient vs final, and which one feeds Answered Rate [L376]? The PRD itself says "Check the mapping of the below statuses with SIP status in this sheet" [L385] — mapping unresolved.

**Q-BSA-12 — Representation of cancelled-away recipients.** After cancel, unprocessed recipients are excluded "from both the count and the cost" [L124] — but are their rows removed from the recipient details grid, kept as Pending, or marked Canceled? For Voice a per-recipient Canceled exists [L392]; for WA none does. ABSENT.

**Q-BSA-13 — Statusing/charging of a Voice call terminated by balance exhaustion.** L330 terminates the live call when balance hits zero; the seconds already elapsed were charged. Is that recipient counted as processed? Which status (Answered? Failed? Initiator drop)? Does it push the transaction to Partially processed? ABSENT.

**Q-BSA-14 — API manual-recipient cap.** UI caps manual recipients at 3 [L65, L310]; the API just says "a list of recipients 'phone numbers'" [L460]. Does the 3-cap bind the API? ABSENT.

**Q-BSA-15 — "Suggested Statistics" normativity.** Both statistics blocks are titled "Suggested Statistics" [L131, L375] and Reply Rate depends on reply tracking whose scope is Pending (conversation menu item L502). Are these required for v1? ABSENT.

**Q-BSA-16 — Edit-scheduled re-confirmation and audit.** Edit reopens the compose screen prefilled and "he can edit anything" [L177, L424]. Unstated: does saving re-run the duplicate/cost confirmation overlay; does Transaction ID persist or a new one issue; is an edit history kept; what happens if the due date passes mid-edit? ABSENT.

**Q-BSA-17 — Duplicate definition & scope.** Dedup "will remove the duplicated numbers, keep and process the first one only" [L85, L329]. Exact-string vs normalized (E.164/country-code) comparison, and whether the manual-vs-CG "first" tiebreak is guaranteed by BR-BSA-39 ordering, are unstated. Cross-transaction dedup is clearly out of scope ([INFERRED] from per-transaction wording). ABSENT normalization rule.

**Q-BSA-18 — Voice "Duration" field.** The Voice scheduled-detail recipient grid lists a bare "Duration" [L441] with no definition, and the Voice OUTBOX recipient grid has no Duration column at all (only Average Call Duration statistic L381). What is it and why does it exist only pre-execution? ABSENT.

**Q-BSA-19 — Copy/paste defects that obscure intent.** (a) Voice scheduled detail says "Whatsapp message status for this mobile number" [L436] inside the Voice page; (b) WA compose "a screen opens three sections" [L44] vs Voice "a screen will." [L289] — sentence truncated; (c) "in case of filed" [L86]; (d) "SIPor" [L328]; (e) "pre-detained" [L14]; (f) "Allow/now allow" [L496]. Intent recoverable but each is a spec-quality risk.

**Q-BSA-20 — Scheduled-tab cost column semantics.** Scheduled grid shows "Total transaction cost: The total cost for all sent messages…" [L172, L419] while nothing is sent yet; Voice scheduled DETAIL calls it "Estimated Cost" [L432] and WA scheduled detail keeps "Total transaction cost" [L185]. Is the grid column the estimation? ABSENT.

**Q-BSA-21 — Mid-flight channel disablement.** Rules cover scheduled transactions reaching due date on a disabled channel [L33] but not an In Progress transaction whose channel dies mid-processing (fail? partially processed? pause?). ABSENT.

**Q-BSA-22 — Charging of CS-window conversation messages.** Per-recipient Message cost "does not include any costs for replies later" [L155]; free-form composer messages [L272–283] have no stated pricing/charging path (wallet? which rate?). ABSENT.

**Q-BSA-23 — Scheduling bounds.** Minimum lead time, maximum horizon, and behavior when execution engine wakes late (catch-up vs skip) are all ABSENT; API only requires "greater than now" [L466].

**Q-BSA-24 — Who may Cancel/Delete/Edit a transaction.** "the user can 'Cancel'" [L93] — creator only, or any authorized user of the account? Same for Delete/Edit of scheduled items. ABSENT.

---

