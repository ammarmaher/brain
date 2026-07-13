*** PRD Understanding - Basic Send Application - WORKFLOWS ***

# 06-basic-send-application - WORKFLOWS

> Source PRD: `latest-prd.md` in this folder (extracted from `C:\Users\User\Downloads\lab dirver\Basic Send Application-V5.docx`, user-supplied 2026-07-06; V5 is current & authoritative).
> Derived 2026-07-06 by the bsa-deep-understanding intake (prd-analyst agent, verbatim-quoted, line-anchored to `latest-prd.md`).
> React reference implementation: `C:\Falcon\Source_of_truth_theme\latest 07062026\falcon-ux (4)\admin\basic-app.jsx` — see `REACT_REFERENCE.md` + `GAPS.md`.
> State machines (transaction WA/Voice, per-recipient WA/Voice) + 8 step-by-step workflows.

---

## 3. STATE MACHINES

### 3a. Transaction statuses — WhatsApp
Status vocabulary: Outbox = {In Progress, Canceled, Partially Processed, Failed, Completed} [L111]; Scheduled tab = {Scheduled, Deleted} [L174].

Transitions (all [PRD-V5] unless flagged):
1. (create, send-now confirmed) → **In Progress** — engine takes over "Upon immediate execution" [L80, L92].
2. (create, future datetime) → **Scheduled** — "All transactions whose due date has not come yet … status will be 'Scheduled'" [L96].
3. **Scheduled** → **Deleted** — user Delete before due date + confirmation; row stays visible [L95, L178–180]. Terminal.
4. **Scheduled** → **In Progress** — "when a scheduled date matures" [L80]. [INFERRED] transition passes through execution-time validations first (5–7).
5. **Scheduled** → **Failed** — due date arrives while channel unavailable; reason "the selected Communication Channel is not active" [L33, L10]. No auto-retry after channel recovery [L34]. Terminal.
6. **Scheduled** → **Failed ("Failed - Insufficient Balance")** — wallet at zero when scheduled campaign begins; "no messages are sent" [Edge Cases, L506]. Terminal.
7. **Scheduled** → **Failed ("Asset Missing")** — CG deleted or template revoked by Meta before execution; "instantly fail the transaction at execution time and log the reason" [L507]. Terminal.
8. **In Progress** → **Failed** — insufficient balance "right before processing any record" [L89]. Reason recorded on detail page [L97]. Terminal.
9. **In Progress** → **Partially processed** — insufficient balance after ≥1 record processed [L90]; reason on detail page [L97]. Terminal.
10. **In Progress** → **Completed** — whole transaction records processed successfully [L91]. Terminal.
11. **In Progress** → **Canceled** — user Cancel; engine "terminates processing at the next immediate batch edge" [L93, L115]; count/cost recalculated to successfully-sent only [L120–124]. Terminal.
During In Progress: total recipient count + total cost update continuously [L92].
ABSENT: any transition out of Failed/Partially processed/Canceled/Completed/Deleted (no retry/resume/restore anywhere in V5).

### 3b. Transaction statuses — Voice
Identical vocabulary and transitions 1–11 [L333–342, L355, L421, L358–368], with Voice-specific execution semantics:
- Pre-call gate replaces batch deduction: proceed only if balance > 1-second cost, "otherwise we terminate the transaction" [L331].
- Mid-call exhaustion terminates the live call [L330]. [INFERRED] repeated exhaustion mid-bulk yields Partially processed per L335; the PRD does not explicitly say how a terminated-mid-call recipient is statused or charged beyond per-second deduction already taken (Q-BSA-13).
- Retry attempts (≤3) happen inside In Progress per recipient [L296–297]; retries do not create transaction-level states.

### 3c. Per-recipient WhatsApp message statuses
Vocabulary: **Pending, Sent, Delivered, Read, Played, Seen** [L145–151]. "as per Meta".
- **Pending** — "we did not submit it yet to Meta, still in our system." [L146]. Initial state; also the frozen state of every recipient in a Scheduled transaction (Send/Delivery/Status dates empty, cost 0 SAR) [L189–194].
- Pending → **Sent** — variables replaced + submitted to Meta; sets **Send Date** = Falcon submission timestamp [L147, L152].
- Sent → **Delivered** — Meta returns delivered; sets **Delivery Date** (empty until then) [L148, L153].
- Delivered → **Read** (text; read date recorded) [L149] | **Played** (voice note/audio; played date) [L150] | **Seen** (media: image/video/document; seen date) [L151]. Each interaction updates **Status Date** = most recent status update [L154].
- ABSENT: per-recipient Failed status — despite a "Failed Rate: Percentage of messages that failed to send or deliver" statistic [L136] and the Third-Party Rejections edge case marking "the status" as "Failed" [L508]. Gap flagged as Q-BSA-07.
- ABSENT: per-recipient Canceled/Skipped status for recipients cut off by cancellation — they are "excluded … from both the count and the cost" [L124]; grid representation unstated (Q-BSA-12).

### 3d. Per-recipient Voice call statuses
Vocabulary (11): **Pending, Sent, Ringing, Live, Unreachable, Initiator drop the call, Canceled, Answered, Busy, No Answer, Failed** [L386–396], with PRD note "Check the mapping of the below statuses with SIP status in this sheet" [L385].
- **Pending** — queued, not yet submitted to SIP/Voice provider [L386]; frozen state in Scheduled detail with Attempts=0 [L437–438].
- Pending → **Sent** — call request submitted to provider; marks submission date [L387].
- Sent → **Ringing** — ringing on recipient device [L388].
- Ringing → **Live** — "answered by the recipient and the IVR interaction is active" [L389] / **Answered** — "recipient picked up the call and the IVR started" [L393]. [INFERRED] Live and Answered overlap semantically; final-vs-transient roles unstated (Q-BSA-11).
- Terminal/outcome statuses: **Unreachable** (out of service/invalid number) [L390]; **Initiator drop the call** (Falcon or provider terminated pre-answer/completion) [L391]; **Canceled** (user-initiated cancellation or system intervention) [L392]; **Busy** [L394]; **No Answer** [L395]; **Failed** (technical error initiating/completing) [L396].
- Retry loop: if final attempt status ∈ user-selected subset of {no answer, busy, cancel, failed} and attempts < configured (≤3): wait configured minutes → new Attempt (number++, own status/timestamp) [L296–297, L397–401]. Send date = first attempt; Status date = final update; Message cost = sum over attempts [L402–404].
- Attempt Status vocabulary is narrower: {failed, canceled, busy, no answered, unreachable} [L399] — note "unreachable" appears as an attempt status but NOT as a configurable retry trigger [L296], and "cancel" is a trigger though Canceled is defined as user/system cancellation (Q-BSA-10).
---

## 4. WORKFLOWS (step-by-step)

### 4.1 Compose + Send WhatsApp
1. Authorized user clicks "Send WhatsApp Message" → screen with three sections: Message details, Recipients, preview [L44].
2. Select WhatsApp Sender ID (any tenant Sender ID unless Permission Group restricts) [L46].
3. Select template via Category → Language → Template Name (single, pre-approved, own/shared) [L47–48]; variables shown under Variables field [L49]; (suggested) Meta sync refreshes status/body and updates template pages [L50]; if template no longer Approved/Active, system forces reselection [L52].
4. Select sending time: now or future date+time [L51].
5. Add recipients — either/both:
   a. Contact Groups: pick CG (own/shared) → identify destination column → map every template variable to a column via the 1:1 grid; "add contact group" stays disabled until mapped; repeat per CG [L55–62, L72].
   b. Manual: enter destination (max 3); fill every template variable ("Add recipient" disabled until filled); values remain visible/editable [L63–71].
6. Review Message Preview built from first recipient of first selected CG [L73].
7. Click "send" → confirmation summary overlay: "Allow duplicate recipients" checkbox + programmatic cost estimation (destination, template category type, recipient count, active contract) [L74–76].
8. Confirm → if now: processing starts; if future: saved as Scheduled. No balance reservation either way [L77].
9. Engine (immediate or matured schedule): per record/batch — verify balance, deduct first (refund on internal failure) / reserve-commit-return per L86; manual recipients first then CGs in added order; dedup keep-first if duplicates not allowed; variable replacement immediately before Meta dispatch → sets per-recipient Send Date [L80–86].
10. Status evolves per §3a; count/cost columns update live [L92]; Failed/Partially processed get reasons on the detail page [L97].

### 4.2 Compose + Send Voice IVR
1. Click "Send Voice IVR Message" [L289].
2. Select Voice Sender ID (SIP-verified number; permission-group restrictable) [L291].
3. Select IVR template: Category (Static/Dynamic) → Template Name; variables shown [L292–294].
4. Select sending time (now/future) [L295].
5. Optionally configure Retry Logic: up to 3 attempts; trigger statuses ⊆ {no answer, busy, cancel, failed}; per-attempt wait minutes [L296–297].
6. Add recipients: CGs (destination column + variable mapping before next CG) [L300–307] and/or manual (max 3; variable values required, visible, editable) [L308–315]; 1:1 mapping grid [L316].
7. Preview: IVR canvas; play voices node-by-node with first-recipient variable replacement [L317–318].
8. Confirmation message: duplicates checkbox + cost estimation (destination, expected call time, recipient count, contract, …) [L319–321].
9. Confirm → now or Scheduled; no reservation [L322].
10. Engine: manual first then CGs in order; dedup keep-first; variable replacement right before SIP dispatch (= Send date); per call: proceed only if balance > 1-second cost; deduct every second in near-realtime; exhaustion terminates the live call; bulk sends one-by-one [L326–331].
11. Per-recipient status/attempt tracking per §3d; transaction status per §3b.

### 4.3 Scheduled lifecycle
1. Created with future date → appears in Scheduled tab, status Scheduled, with Scheduled date column [L96, L170].
2. Until due: Details (view page: zeroed stats, Pending recipients, empty dates, 0 SAR, Conversation disabled, preview/canvas) [L182–198, L429–445]; Edit (4.5); Delete (4.6).
3. At due date: channel active? assets exist? balance nonzero? → engine runs (4.1/4.2 step 9–10); else Failed with reason (channel inactive L33; zero balance L506; asset missing L507).
4. After execution time is satisfied, the transaction is an Outbox item ("regardless if they are already processed or are processing now") [L100].
[INFERRED] The PRD does not state the moment a row moves from Scheduled tab to Outbox tab beyond "execution time is satisfied"; Deleted rows stay in the Scheduled view [L180].

### 4.4 Cancel flow (In Progress, both channels)
1. Outbox 3-dots → Cancel [L114/L358].
2. Confirmation dialog dynamically shows thread state: current processing status; whether cancel intercepted mid-flight (unsent records uncharged); or whether backend already finished all records [L116–119/L360–363]; the post-action message also distinguishes mid-progress vs already-finished [L94/L339].
3. On confirm: engine terminates at next immediate batch edge [L115/L359].
4. System updates: Status→Canceled; Total Recipient Count→only successfully-sent; Total Transaction Cost→recalculated over those; unprocessed recipients excluded from count and cost [L120–124/L364–368].

### 4.5 Edit scheduled flow
1. Scheduled tab 3-dots → Edit (enabled while Scheduled; ABSENT: explicit enablement rule for Edit — only Delete has "Enabled only if the due date … is not satisfied").
2. WA: opens the "send whatsapp message" screen prefilled, "he can edit anything in this page" [L177]. Voice: opens the send-IVR screen prefilled, "the user can edit anything in this screen" [L424].
3. [INFERRED] Re-submission passes back through the confirmation overlay (duplicates + re-estimated cost) since it is the same compose screen; PRD does not state it explicitly (Q-BSA-16).

### 4.6 Delete flow (scheduled only)
1. Scheduled tab 3-dots → Delete; enabled only while due date not satisfied [L179/L426].
2. Confirmation popup [L180/L427].
3. On confirm: system ignores the transaction at due time; row remains listed with status Deleted [L95/L340, L180/L427]. No undo stated (ABSENT).

### 4.7 Conversation flow (WA) incl. CS-window reset and template-after-expiry
1. Entry: WA Outbox detail → recipient row 3-dots → "Conversation"; opens history at this transaction's message point; user can scroll older/newer [L158, L201].
2. Page renders Header (Message Name, Created Date, Recipient Number), Message Info panel, chronological thread (sender right / recipient left, sending time per message, delivery/read indicators when available) [L202–236].
3. Recipient sends a message → CS window starts; countdown from 24:00:00 displayed in H/M/S [L258–264].
4. Every further recipient message before expiry resets the window to 24h [L265].
5. While active: authorized users send free-form messages (Text/Attachments/Emojis/Voice record/Templates via composer) and may Reply/React [L266, L245, L272–283].
6. At 00:00:00: window Expired; free-form blocked [L267].
7. After expiry: only approved template messages; choosing template opens "send whatsapp message" screen with recipient kept/locked and variables per selected template; user fills variables; Send → NEW conversation record created [L268–269, L280–283].
8. New record references the previous one as Conversation History; each record keeps its own lifecycle/timestamps/statuses/messages; full per-recipient history preserved [L270–271].
9. Search within conversation by text/file name/keywords; matches highlighted; direct navigation [L246–255].
Voice variant: Conversation option shows the IVR + recipient interaction; from there user can open "send whatsapp message" or "send IVR voice message" prefilled with the recipient [L406] ("will be more clear later").

### 4.8 Export flows
- WA detail page: Export details (recipient grid + transaction creation date + post-replacement message content + all statuses with dates) and Export statistics [L160].
- Voice detail page: Export details (recipient grid + full audit trail: creation date, all attempt statuses, timestamps) and Export statistics [L407].
- Read-only mode (both channels down) still permits viewing and exporting historical transactions/statistics [L35].
ABSENT: file format, column order, localization, size limits.

---

