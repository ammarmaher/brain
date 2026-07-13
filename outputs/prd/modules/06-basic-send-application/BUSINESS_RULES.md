*** PRD Understanding - Basic Send Application - BUSINESS_RULES ***

# 06-basic-send-application - BUSINESS_RULES

> Source PRD: `latest-prd.md` in this folder (extracted from `C:\Users\User\Downloads\lab dirver\Basic Send Application-V5.docx`, user-supplied 2026-07-06; V5 is current & authoritative).
> Derived 2026-07-06 by the bsa-deep-understanding intake (prd-analyst agent, verbatim-quoted, line-anchored to `latest-prd.md`).
> React reference implementation: `C:\Falcon\Source_of_truth_theme\latest 07062026\falcon-ux (4)\admin\basic-app.jsx` — see `REACT_REFERENCE.md` + `GAPS.md`.
> 96 numbered rules BR-BSA-01..96 (numbered per section below). Every rule carries the verbatim PRD quote + line anchor.

---

## 1. BUSINESS RULES (BR-BSA-NN)

### 1.1 Purchase, activation, availability, permissions

**BR-BSA-01 — Purchase/activation restricted to Account Owner & Falcon UserType.**
Restatement: Only the Account Owner role and the Falcon UserType role may purchase and activate marketplace applications (including BSA). Normal Users cannot purchase.
Quote: "The Account Owner & Falcon Usertype are only allowed to purchase and activate applications from the marketplace." [PRD-V5 §BSA (Assumptions and Conditions), L7]
Reinforced: "can be purchased only from the Marketplace & Applications.Mng main menu by the Account Owner or a Falcon UserType with the required permissions." [PRD-V5 §Application Purchase, Activation, and Navigation, L18]

**BR-BSA-02 — Post-activation availability to all Normal Users at all levels, permission-group override.**
Restatement: Once purchased+activated, every Normal User in the account, at every org level, may use BSA by default; an assigned Permission Group can override (remove/restrict) that default.
Quote: "Once this application is activated and purchased, it is allowed to be used by all Normal Users in that account (in all levels), unless a permission group is assigned to that user and overrides this default role permission." [PRD-V5 §BSA (Assumptions and Conditions), L8]

**BR-BSA-03 — Purchase completes to Active immediately; no extra activation/configuration.**
Quote: "Once the purchase is completed successfully, the application status becomes Active immediately, and no additional activation or configuration steps are required." [PRD-V5 §Application Purchase, Activation, and Navigation, L19]

**BR-BSA-04 — Auto-created submenu on activation.**
Restatement: The system automatically creates submenu item "Basic Send Application" under Marketplace & Applications.Mng after activation.
Quote: "After activation, the system automatically creates a new submenu item named Basic Send Application under the Marketplace & Applications.Mng main menu." [PRD-V5 §Application Purchase, Activation, and Navigation, L20]

**BR-BSA-05 — Two navigation paths, one instance.**
Restatement: BSA is reachable both from Marketplace & Applications.Mng and from the new submenu; both open the same instance with identical data/functionality.
Quote: "Both navigation paths open the same application instance and display the same data and functionality." [PRD-V5 §Application Purchase, Activation, and Navigation, L21–24]

**BR-BSA-06 — Sender ID selection default + Permission Group restriction (WA).**
Quote: "By default; a Normal User can select any Sender ID attached to the tenant, unless restricted by an overriding Permission Group." [PRD-V5 §Send Whatsapp Message button, L46]

**BR-BSA-07 — Sender ID selection default + Permission Group restriction (Voice).**
Quote: "By default; any Normal User can select any Sender ID attached to the tenant, unless restricted by an overriding permission group." [PRD-V5 §Send Voice IVR Message button, L291]

### 1.2 CommChannel-status gating

**BR-BSA-08 — Channel never enabled ⇒ Send disabled; read-only tabs.**
Restatement: If a commchannel under the account was never enabled, its SEND button inside BSA is disabled; user can only see Outbox and Scheduled sub-tabs and cannot create transactions on it.
Quote: "If there is any commchannel under that account that was not enabled; its SEND button will be disabled inside the BSA, and the user can see only the outbox and scheduled sub-tabs, he can not do transactions." [PRD-V5 §BSA (Assumptions and Conditions), L9]

**BR-BSA-09 — Channel disabled ⇒ scheduled transactions fail at due date, with reason.**
Quote: "If the commchannel was disabled for any reason (manually disabled, grace period finished, …) the scheduled transactions once their due date came will be failed, and a failed reason will be identified." [PRD-V5 §BSA (Assumptions and Conditions), L10]
Expanded: "Any scheduled transactions that reach their execution time while the Communication Channel is unavailable shall fail automatically, and the transaction failure reason shall indicate that the selected Communication Channel is not active." [PRD-V5 §BSA Behavior Based on WhatsApp/ Voice Communication Channel Status, L33]

**BR-BSA-10 — App stays Active regardless of channel status; functionality is channel-status-driven.**
Quote: "The application itself remains Active regardless of the Communication Channel status; however, the functionality available to the user depends on the status of the selected Communication Channel." [PRD-V5 §BSA Behavior…Channel Status, L27]

**BR-BSA-11 — Channel Active ⇒ full functionality.**
Quote: "If the selected WhatsApp/ Voice Communication Channel is Active, all related BSA functionalities are available." [PRD-V5 §BSA Behavior…Channel Status, L28]

**BR-BSA-12 — Channel Expired/Disabled/any send-blocking status ⇒ Send button disabled, history still viewable, no new transactions.**
Quote: "If the selected WhatsApp/ Voice Communication Channel becomes Expired, Disabled or enters any status that prevents message/call sending: The corresponding Send button (Send WhatsApp Message / Send Voice IVR Message) shall be disabled. Users can continue accessing the Outbox, Scheduled, transaction details, statistics, reports, and other historical data related to that Communication Channel. Users cannot create new transactions using the affected Communication Channel." [PRD-V5 §BSA Behavior…Channel Status, L29–32]

**BR-BSA-13 — Channel reactivation ⇒ immediate new sends; NO automatic retry of previously failed scheduled transactions.**
Quote: "Once the Communication Channel becomes Active again, users can immediately create new transactions. Previously failed scheduled transactions are not retried automatically and must be recreated or rescheduled by the user." [PRD-V5 §BSA Behavior…Channel Status, L34]

**BR-BSA-14 — Both channels inactive ⇒ app in read-only mode with view/export of history.**
Quote: "If both the WhatsApp and Voice Communication Channels are not active, the Basic Send Application remains Active and accessible in read-only mode. Users can view and export historical transactions and statistics, but all sending operations are disabled until at least one Communication Channel becomes Active." [PRD-V5 §BSA Behavior…Channel Status, L35]

### 1.3 Balance / charging rules

**BR-BSA-15 — App follows the tenant's balance strategy; ignores Wallet & Balance configurations.**
Quote: "Using the application to send transactions does not care about the Wallet and Balance configurations, it will follow the balance strategy used and comply with it." [PRD-V5 §BSA (Assumptions and Conditions), L11]

**BR-BSA-16 — No balance failover (app-wide and future apps): empty final wallet/bucket ⇒ abort.**
Quote: "There is no balance failover facility in this application and in all applications in future, if the final wallet/bucket does not have balance, the transaction will be aborted." [PRD-V5 §BSA (Assumptions and Conditions), L12]

**BR-BSA-17 — No commchannel failover: WA or Voice, never both / never switch.**
Quote: "There is no failover between commchannels in this application, the user either uses it to send Whatsapp messages or Voice call messages." [PRD-V5 §BSA (Assumptions and Conditions), L13]

**BR-BSA-18 — No balance reservation at creation; deduction at execution time (WA & Voice, immediate & scheduled).**
Quote (compose, both channels): "In both cases the balance deduction will be done on sending time for the transactions, which means there is no reservation for balance at the transaction creation time for the future transactions." [PRD-V5 §Send Whatsapp Message button, L77; §Send Voice IVR Message button, L322]
Quote (engine): "The system does not make any reservation for balance at the transaction creation time, it starts deducting balance at the execution time and once it starts processing the records/patches of that transaction." [PRD-V5 §Send Logic (WA), L81; §Send Logic (Voice), L326]

**BR-BSA-19 — WA per-batch charging: deduct first, refund on internal failure; strategy-agnostic.**
Restatement: For WhatsApp, per record/batch the engine verifies balance sufficiency, deducts as the FIRST processing step, and refunds if an internal failure prevents successful processing of that record/batch. Applies under every balance strategy.
Quote: "The system should make sure that there is enough balance for the current record/batch under processing. We will deduct the balance as the first step of processing the record/batch, and then refund in case of any internal failures preventing this record/batch from being processed successfully. This will be applied regardless of the balance strategy (User Based or NodeBased, Single Wallet or Multiple Wallets)." [PRD-V5 §Send Logic (WA), L82]

**BR-BSA-20 — WA per-record/bulk reservation-commit-return wording; insufficient balance aborts that record/bulk.**
Restatement: V5 additionally describes WA charging as: reserve the needed amount per record/bulk before processing; commit on success, return on failure (per charging controls); if reservation cannot be made (insufficient balance) the process for that record/bulk is aborted.
Quote: "When it comes to charging; for each record/bulk we do a reservation from the balance to the needed amount for that record/bulk, and commit in success or return in case of filed (and based on charging controls). So anytime we decide to process a record/bulk we do a reservation then proceed, if there is not enough balance we abort the process for that record/bulk." [PRD-V5 §Send Logic (WA), L86]
[INFERRED] L82 (deduct-then-refund) and L86 (reserve-then-commit) describe two different charging mechanics for the same WA flow — flagged as Q-BSA-08.

**BR-BSA-21 — Voice charging: NO reservation; near-realtime per-second deduction; terminate call on exhaustion.**
Quote: "When it comes to charging; for each record/bulk we do NOT make any reservation from the balance, we start doing the call, deducting the cost from balance in almost realtime (every one second), and once the balance is exhausted; we terminate the call. This is applied in both cases to send a single transaction or bulk, since the bulk from inside is sending one by one." [PRD-V5 §Send Logic (Voice), L330]

**BR-BSA-22 — Voice pre-call gate: balance must exceed one second of call cost.**
Quote: "Which means before processing a voice call we are checking if there is a balance greater than the cost for one second; we will proceed, otherwise we terminate the transaction." [PRD-V5 §Send Logic (Voice), L331]

### 1.4 Template & contact-group eligibility

**BR-BSA-23 — Approved templates only, both channels, even when Voice body type is "free".**
Quote: "For both Whatsapp and Voice messages; the user can send to a pre-detained and approved templates only, even the body type was set for free for the Voice commchannel." [PRD-V5 §BSA (Assumptions and Conditions), L14]
[INFERRED] "pre-detained" is a typo for "pre-defined"/"pre-approved".

**BR-BSA-24 — Asset visibility: own or shared-within-account templates & contact groups.**
Quote: "The normal user can select the templates and contact groups which are created by him, or shared with him. And the shared templates and contact groups are created by other users inside the account/ tenant." [PRD-V5 §BSA (Assumptions and Conditions), L15]
Reinforced for WA templates (L47), WA CGs (L57–59), Voice templates (L292), Voice CGs (L302–304).

**BR-BSA-25 — WA template selection: single template via 3-tier hierarchy.**
Quote: "Users are restricted to selecting a single, pre-approved template that they created or that was shared within their tenant. The UI must enforce a 3-tier selection hierarchy: Whatsapp template Category/ service type (Marketing, Utility, and Authentication) → Language → Template Name." [PRD-V5 §Send Whatsapp Message button, L47–48]

**BR-BSA-26 — Voice template selection: single approved IVR via 2-tier hierarchy.**
Quote: "Users are restricted to selecting a single, pre-approved voice IVR template that is created or shared with the user, the UI enforces a 2-tier selection tree: Voice IVR trees category (Static or Dynamic) → Template Name." [PRD-V5 §Send Voice IVR Message button, L292–293]

**BR-BSA-27 — Template variables surfaced in a Variables field (both channels).**
Quote: "The selected template variables will be viewed under the Variables field to be more clear to user to know the variables then map them" [PRD-V5 L49 (WA); L294 (Voice)]

**BR-BSA-28 — Suggested Meta template sync on selection (explicitly a suggestion).**
Quote: "We suggest to have a backend call to sync the selected template with Meta, requesting the Meta to share the current status of that template, and the current body for that template -in case the template status or body changed and not updated in Falcon via webhook- this sync will update the template on templates pages also." [PRD-V5 §Send Whatsapp Message button, L50]

**BR-BSA-29 — Non-Approved template blocks send; user told to pick another.**
Quote: "In case the template status was changed to anything not Approved/Active, the system will indicate to the user that he has to select another template." [PRD-V5 §Send Whatsapp Message button, L52]

### 1.5 Recipients, mapping, duplicates, preview, confirmation

**BR-BSA-30 — Contact groups: one or multiple per UI transaction; own or shared.**
Quote: "The user can select one or multiple contact groups as recipients. The selected contact groups can be: Created by the same user. Shared with the user." [PRD-V5 §Send Whatsapp Message button, L56–59; Voice L301–304]

**BR-BSA-31 — Per CG: destination column identification + full variable mapping BEFORE adding next CG; add-CG button gated.**
Quote: "For each selected contact group, the user must: Identify the destination column that contains the recipients' destination for example mobile numbers. Map the contact group fields/columns with the template variables before selecting another contact group, 'add contact group' button will remain disabled if the contact group columns are not mapped with the template variables." [PRD-V5 §Send Whatsapp Message button, L60–62; Voice equivalent L305–307 without the button-gating sentence]

**BR-BSA-32 — Manual recipients: max 3; all variables required; add-recipient button gated; values displayed & editable.**
Quote: "The user can enter a direct/manual 'destination' for example 'phone number' in the recipient field. A maximum of 3 manual recipients is allowed. For each manually added recipient, the user must: Enter values for all related template variables. 'Add recipient' button will remain disabled until the user fills in the variable. The manually entered template variable values should: Be displayed to the user. Be editable by the user." [PRD-V5 §Send Whatsapp Message button, L63–71; Voice equivalent L308–315 (no button-gating sentence)]

**BR-BSA-33 — 1:1 variable schema mapping grid; every required variable must map to a column header.**
Quote: "For each contact group added, the interface must render a 1:1 schema mapping grid, forcing the user to map every required variable inside the WhatsApp template to a specific data column header within that contact group sheet." [PRD-V5 L72; Voice L316 with "Voice IVR template"]

**BR-BSA-34 — Message preview uses first recipient of first selected CG (WA).**
Quote: "The user can see a message preview for the current transaction he is building which contains variable replacements by the values related to the first recipient in the first selected contact group." [PRD-V5 §Send Whatsapp Message button, L73]

**BR-BSA-35 — Voice preview: IVR canvas playable node by node with first-recipient variable replacement.**
Quote: "The user can see the canvas including the IVR tree and play the IVR voices node by node for the current transaction he is building which contains variable replacements by the values related to the first recipient in the first selected contact group." [PRD-V5 §Send Voice IVR Message button, L317–318]

**BR-BSA-36 — Pre-send confirmation overlay: duplicate checkbox + programmatic cost estimation (WA).**
Quote: "the system displays a confirmation summary overlay presenting: A duplicate handling checkbox: 'Allow duplicate recipients'. A transaction cost estimation calculated programmatically based on target recipient's destination, template category type, total recipient count, and active contract details" [PRD-V5 §Send Whatsapp Message button, L74–76]

**BR-BSA-37 — Pre-send confirmation (Voice): duplicate checkbox + cost estimation incl. expected call time.**
Quote: "A Check box to ask the user if he wants to allow for duplicate recipients or not. Estimation for this transaction cost (based on the recipient's destination, expected call time, number of recipients, active contract details, …)." [PRD-V5 §Send Voice IVR Message button, L320–321]

**BR-BSA-38 — Duplicate handling at execution: when not allowed, dedup keeps FIRST occurrence only.**
Quote: "If the user does not allow for duplicate sending, the internal logic will remove the duplicated numbers, keep and process the first one only." [PRD-V5 §Send Logic (WA), L85; §Send Logic (Voice), L329]

**BR-BSA-39 — Processing order: manual recipients first, then contact groups in the order added.**
Quote: "The system must process the manually entered recipients first, then the other contact groups based on their added order in the compose process." [PRD-V5 §Send Logic (WA), L83; §Send Logic (Voice), L327]
[INFERRED] Combined with BR-BSA-38, "first occurrence" during dedup is deterministic: manual entries outrank CG rows; earlier-added CGs outrank later ones.

**BR-BSA-40 — Variable replacement happens right before provider dispatch and defines the per-recipient Send date.**
Quote: "The system will do variable replacements with the actual data for each recipient right before dispatching the payload to Meta or Voice providers. (this will represent the Send date for each recipient)." [PRD-V5 §Send Logic (WA), L84; Voice variant L328 "to SIPor Voice providers"]

**BR-BSA-41 — Sending time: now or scheduled future datetime (both channels).**
Quote: "The user can select the sending time for that transaction, either send the transaction now (immediately) or schedule it in future (set date and time)." [PRD-V5 L51 (WA); L295 (Voice)]

**BR-BSA-42 — Voice retry logic (optional): up to 3 attempts, per-status triggers, per-attempt wait minutes.**
Quote: "The User can configure up to 3 retry attempts for one or more of the following statuses (no answer, busy, cancel, failed ). For each attempt, a duration (in minutes) can be specified to define the waiting period before the next retry. This allows for flexible handling of temporary network issues or recipient unavailability." [PRD-V5 §Send Voice IVR Message button, L296–297]
ABSENT: any retry facility for WhatsApp.
### 1.6 Transaction statuses (identical text blocks for WA L88–97 and Voice L333–342)

**BR-BSA-43 — Insufficient balance before ANY record processed ⇒ transaction "Failed".**
Quote: "If the system decides to abort the transaction due to insufficient balance right before processing any record; the transaction status will be 'Failed'." [PRD-V5 §Transaction statuses (WA), L89; (Voice) L334]

**BR-BSA-44 — Insufficient balance mid-way ⇒ "Partially processed".**
Quote: "If the system decides to partially process the transaction due to insufficient balance the transaction status will be 'Partially processed'." [PRD-V5 L90; L335]

**BR-BSA-45 — All records processed ⇒ "Completed".**
Quote: "If the system successfully processes the whole transaction records, the status will be 'Completed'." [PRD-V5 L91; L336]

**BR-BSA-46 — While processing ⇒ "In Progress" with LIVE-updating recipient count and cost columns.**
Quote: "During the process of the transaction its status will be 'In Progress' and the total recipient count and total transaction cost columns will be updated during the time." [PRD-V5 L92; L337]

**BR-BSA-47 — User cancel during processing ⇒ "Canceled"; stop next patch; update records.**
Quote: "During the process of the transaction the user can 'Cancel' this transaction, and its status will be 'Canceled'. The system will stop processing the next patch and update the records accordingly." [PRD-V5 L93; L338]

**BR-BSA-48 — Cancel confirmation must state whether cancel landed mid-flight or after full processing.**
Quote: "There should be a confirmation message shown to the user about the cancelation action, and indicate if the cancelation action took place while the transaction is still in progress, or the system already finished the whole transaction and processed all recipients in it." [PRD-V5 L94; L339]

**BR-BSA-49 — Delete of not-yet-due scheduled transaction ⇒ system ignores it; status "Deleted".**
Quote: "If the user decided to Delete -from the scheduled tab- the scheduled transaction which their due date has not come yet, the system will ignore this transaction, and its status will be 'Deleted'." [PRD-V5 L95; L340]

**BR-BSA-50 — Not-yet-due transactions live in Scheduled tab with status "Scheduled" (unless Deleted).**
Quote: "All transactions whose due date has not come yet will be viewed and listed in the scheduled tab, and their status will be 'Scheduled' unless they were deleted and mentioned before." [PRD-V5 L96; L341]

**BR-BSA-51 — Failed / Partially processed must carry a reason on the detail page.**
Quote: "Anytime the system decides to abort the transaction with status 'Failed' or change its status to 'Partially processed', details will be added in the transaction detailed page to give the user indication and reason for these statuses." [PRD-V5 L97; L342]

### 1.7 Outbox tabs & cancellation (WA L99–124; Voice L344–368 — texts mirror each other)

**BR-BSA-52 — Outbox scope: transactions of the LOGGED-IN user whose execution time is satisfied (processed or processing).**
Quote: "This tab contains a grid view for all transactions sent by the logged in user (the transactions whose execution time is satisfied regardless if they are already processed or are processing now)." [PRD-V5 §WhatsApp Outbox Tab, L100; §Voice Outbox tab, L345]

**BR-BSA-53 — Outbox columns (WA).** Transaction ID (auto-generated unique), Sender ID, Template name, Template language, Template type, Creation date, Total recipient count ("all CGs including the manually added recipients"), Total transaction cost, Recipients ("Contact groups names, in addition to the added manually recipients"), Status "(In Progress, Canceled, Partially Processed, Failed, Completed)", Actions (3-dots: Details, Cancel). [PRD-V5 §WhatsApp Outbox Tab, L101–115]

**BR-BSA-54 — Outbox columns (Voice).** Same as WA but "IVR name" and "IVR type" replace template name/language/type. Status set identical. [PRD-V5 §Voice Outbox tab, L346–356]

**BR-BSA-55 — Cancel semantics: terminate at next immediate batch edge.**
Quote: "Cancellation Rule: If a user triggers a Cancel command on an In Progress transaction via the 3-dot action menu, the engine terminates processing at the next immediate batch edge." [PRD-V5 L115 (WA); L359 (Voice)]
Also: "'Cancel' button which cancels and aborts the sending/ processing logic, and stops processing the next batch regardless of the remaining or processed recipients. And update the fields accordingly (status, count, cost, …)." [PRD-V5 L114 (WA); L358 (Voice, "patch")]

**BR-BSA-56 — Cancel confirmation dialog: dynamic thread state, 3 disclosures.**
Quote: "The system must intercept the cancellation request with a confirmation dialog that dynamically displays the thread state. It must clarify: The transaction's current processing status. Whether the cancellation successfully intercepted the transaction mid-flight (leaving unsent records uncharged). Whether the backend completed processing all records before the cancel thread completed execution." [PRD-V5 L116–119 (WA); L360–363 (Voice)]

**BR-BSA-57 — Post-cancellation recalculation: count & cost reflect ONLY successfully sent messages; unprocessed recipients excluded.**
Quote: "Upon successful cancellation, the system will: Update the transaction's Status to 'Canceled'. Adjust the Total Recipient Count to reflect only those recipients for whom messages were successfully sent before the cancellation. Recalculate the Total Transaction Cost based solely on these successfully sent messages. Exclude recipients whose messages were not processed from both the count and the cost." [PRD-V5 L120–124 (WA); L364–368 (Voice)]

### 1.8 Outbox detailed view (WA L126–160; Voice L370–408)

**BR-BSA-58 — WA detail header fields.** Transaction ID, Sender ID, Template name/language/type, Creation date, Total recipient count, Total transaction cost, Recipients, Transaction Status. [PRD-V5 §Outbox Detailed View Page (WA), L129]

**BR-BSA-59 — WA "Suggested Statistics".** Delivered Rate, Read Rate, Played Rate (voice notes), Seen Rate (media), Failed Rate, Reply Rate, Average Delivery Time, Cost Breakdown (by template type and recipient destination; cost of messages sent; average cost per message). Explicitly labeled "Suggested Statistics". [PRD-V5 L131–142]

**BR-BSA-60 — WA per-recipient grid fields.** Recipient mobile number; WhatsApp message status "as per Meta" (Pending, Sent, Delivered, Read, Played, Seen — definitions L146–151); Send Date ("The exact timestamp when the Falcon system successfully submitted the message payload to Meta for the specific recipient." L152); Delivery Date ("timestamp returned by Meta … remains empty until a 'Delivered' status is received." L153); Status Date ("timestamp of the most recent status update … dynamically updates as the recipient interacts" L154); Message cost ("does not include any costs for replies later." L155); Has a reply indication (L156). [PRD-V5 L143–156]

**BR-BSA-61 — Per-recipient Conversation action (WA).**
Quote: "'Conversation' option, in which the user can enter to the conversation history page for this recipient starting from this transaction message point, and he can go up (older) and down (newer) in addition to ability to manage the conversation and start chatting with the recipient 'with conditions'" [PRD-V5 L158]

**BR-BSA-62 — Per-recipient message preview (WA).**
Quote: "once the user selects/ presses on any recipient, a phone preview screen will be shown to him, filled by the transaction message after variable replacements for this user." [PRD-V5 L159]

**BR-BSA-63 — WA export rules.**
Quote: "Options to export the details and export statistics. Export details will be the same as the recipient details grid adding to each recipient (creation date 'transaction creation date', Message content 'message body with variable replacement', list of all statuses available and their dates)." [PRD-V5 L160]

**BR-BSA-64 — Voice detail header + "Suggested Statistics".** Header: Transaction ID, Sender ID, IVR tree name, IVR tree type, Creation date, count, cost, Recipients, Status [L373]. Statistics: Answered Rate, Busy Rate, No Answer Rate, Failed Rate, IVR Completion Rate, Average Call Duration, Cost Breakdown ("by IVR template type, recipient destination, or retry attempts"). [PRD-V5 §Outbox Detailed View Page (Voice), L372–382]

**BR-BSA-65 — Voice per-recipient statuses (11) with a to-verify note.**
Quote header: "Voice message status, Check the mapping of the below statuses with SIP status in this sheet:" then Pending, Sent, Ringing, Live, Unreachable, "Initiator drop the call", Canceled, Answered, Busy, No Answer, Failed (definitions L386–396). [PRD-V5 L385–396]

**BR-BSA-66 — Voice attempt tracking (retry-enabled transactions).**
Quote: "Attempt Tracking: For transactions with retry logic enabled, this grid will display: Attempt Number: (1, 2, or 3). Attempt Status: The specific status of that particular attempt (failed, canceled ,busy,no answered,unreachable). Attempt Timestamp: The exact time the attempt was initiated. Duration Between Attempts: The configured wait time before this attempt was triggered." [PRD-V5 L397–401]

**BR-BSA-67 — Voice per-recipient date/cost semantics.**
Quote: "Send date: The timestamp of the first attempt. Status date: The timestamp of the final status update. Message cost: The total cost incurred for all attempts for this recipient." [PRD-V5 L402–404]

**BR-BSA-68 — Voice per-recipient Conversation action with cross-channel follow-up.**
Quote: "Conversation option that will view the IVR and the interaction from the recipient , in this screen the user can either 'send whatsapp message'' and this will open send whatsapp message screen filled with the recipient details or 'send IVR voice message' that will view the send screen with the recipient details filled (will be more clear later)" [PRD-V5 L406]

**BR-BSA-69 — Voice export incl. full audit trail.**
Quote: "Export details will be the same as the recipient details grid, including a full audit trail for each recipient (creation date, all attempt statuses, and their respective timestamps)." [PRD-V5 L407]

**BR-BSA-70 — Voice per-recipient Preview = recorded playback of the actual call.**
Quote: "'Preview', in which the user can preview and play the IVR tree with variable replacements and as the user system did it with the recipient, it is a recorded message including when the user closes or hangs the call." [PRD-V5 L408]

### 1.9 Scheduled tabs, edit, delete (WA L162–198; Voice L410–445)

**BR-BSA-71 — Scheduled scope & columns.** Grid of transactions "created by the logged in user but their due date is still not satisfied"; columns add Scheduled date ("when this transaction should be processed"); Status "(Scheduled, Deleted)". [PRD-V5 §WhatsApp Scheduled Tab, L163–174; §Voice Scheduled tab, L411–421]

**BR-BSA-72 — Edit scheduled (WA): reopen compose screen prefilled; everything editable.**
Quote: "'Edit' button which opens the 'send whatsapp message' screen with the data that already filled before and he can edit anything in this page" [PRD-V5 L177]

**BR-BSA-73 — Edit scheduled (Voice): reopen send-IVR screen prefilled; everything editable.**
Quote: "'Edit' button which opens the 'send voice IVR message' the details will open the 'send IVR screen' with the already filled details and the user can edit anything in this screen" [PRD-V5 L424]

**BR-BSA-74 — Delete scheduled: only pre-due-date; confirmation popup; row remains visible as Deleted.**
Quote: "'Delete' button: Enabled only if the due date for this scheduled transaction is not satisfied. A confirmation popup will be shown to the user to confirm the deletion action or no. If the user confirms the delete action, this record will stay viewed in the view but with status Deleted." [PRD-V5 L178–180; Voice L425–427]

**BR-BSA-75 — WA scheduled detail: zeroed statistics; all recipients Pending; empty dates; 0 SAR cost; Conversation disabled; smartphone-mockup preview.**
Quote: "Statistics will be all zeros and empty since the transaction is not yet processed … Pending: Send Date:empty Delivery Date:empty Status Date :empty Message cost: 0 SAR. … 'Conversation' option disabled … Message Preview: A smartphone mockup UI component displaying a real-time message preview, generated by replacing template variables with data values from the first recipient in the first selected contact group." [PRD-V5 §Scheduled Detailed View Page (WA), L184–198]

**BR-BSA-76 — Voice scheduled detail: view mode fields incl. Estimated Cost; empty stats; Pending recipients with Attempts=0, empty Status Date, 0 SAR, Duration; Conversation disabled; IVR canvas.**
Quote: "Transaction details: Displays Transaction ID, Sender ID, IVR Template Name, Creation Date, Scheduled Date, Total Recipient Count, and Estimated Cost. Statistics will be all empty … Pending: Attempts :will be 0. Status Date :empty Message cost: 0 SAR. Duration … 'Conversation' option disabled … The IVR canvas showing the IVR tree for this transaction." [PRD-V5 §Scheduled Detailed View Page (Voice), L431–445]
[INFERRED] L436 labels the field "Whatsapp message status" inside the VOICE page — copy/paste defect (see Q-BSA-19).

### 1.10 WhatsApp Conversation Page (L200–283)

**BR-BSA-77 — Entry point & structure.** Reached "By clicking on the 'conversation' option that is located in the whatsapp outbox details page". Parts: Header (Message Name, Created Date, Recipient Number); Message Information Panel (Sender Number, Message Type, Created Date, Send Date, Delivery Date, Read Date); Conversation Area; Message Actions; Conversation Search; Customer Service Window; Message Composer. [PRD-V5 §WhatsApp Conversation Page, L201–216]

**BR-BSA-78 — Supported conversation message types (11).** Text, Images, Documents, Audio, Videos, Location, Contacts, Interactive, Template, Replies, Emoji Reactions. [PRD-V5 L219–230]

**BR-BSA-79 — Conversation display rules.**
Quote: "Messages shall be displayed in chronological order. Sender messages shall appear on right side of the conversation. Recipient messages shall appear on the left side. Each message shall display its sending time. Delivery and read indicators shall be displayed when available.." [PRD-V5 L232–236]

**BR-BSA-80 — Message actions & gating.** Actions: Reply, View Information (reflects into message info panel), React with Emoji, Download Attachment (if applicable). Gate: "Reply and react on message is available only while the customer service window is active." [PRD-V5 L237–245]

**BR-BSA-81 — Conversation search.** Search by message text, file name, keywords; results "Highlight matching messages. Navigate directly to the selected message." [PRD-V5 L246–255]

**BR-BSA-82 — Customer Service Window mechanics (24h, recipient-initiated, resettable).**
Quote: "The customer service window shall start when the recipient sends a message to the organization. The countdown shall begin from 24 hours and decrease continuously. Whenever the recipient sends another message before the countdown expires, the customer service window shall be reset to 24 hours, and the countdown shall restart. While the customer service window is active, authorized users may send free-form WhatsApp messages to the recipient. When the countdown reaches 00:00:00, the customer service window shall be marked as Expired, and free-form messaging shall no longer be permitted." Display shows Hours/Minutes/Seconds remaining. [PRD-V5 L256–267]

**BR-BSA-83 — After expiry: template-only re-initiation creating a NEW conversation record.**
Quote: "After the customer service window expires, the user may only initiate communication by sending an approved WhatsApp template message. Sending an approved template message after the customer service window has expired will open the 'send whatsapp message' screen with keeping the recipient (destination) and viewing the added variables that may be viewed based on the selected template and by clicking on send the system shall create a new conversation record." [PRD-V5 L268–269]

**BR-BSA-84 — Conversation record chaining & lifecycle isolation.**
Quote: "The new conversation record shall reference the previous conversation record as its Conversation History, allowing users to view all previous conversations with the same recipient. Each conversation record shall maintain its own lifecycle, timestamps, statuses, and messages while preserving the complete conversation history across all conversation records for the recipient." [PRD-V5 L270–271]

**BR-BSA-85 — Message Composer (active-window only) + in-conversation template send with locked recipient.**
Quote: "Allows users to send messages while the customer service window remains active. Supported content: Text Attachments Emojis Voice record Templates: By clicking on its icon the 'send whatsapp message' screen will appear: The Recipient details must appear and be disabled The variables should be viewed based on the selected template name The user should fill in the variables" [PRD-V5 L272–283]

### 1.11 API rules (L447–496)

**BR-BSA-86 — API audience & parity goal.**
Quote: "Our BSA should provide all needed APIs that allow the client (Normal user & in future only system user) to use all app functionalities as they are in the UI interface in order to compose and send transactions using the API for system-to-system integration." [PRD-V5 §API, L448]

**BR-BSA-87 — Send API capabilities.** Authentication & authorization; specify commchannel/sending method (Whatsapp or Voice); specify SenderName/SenderID; specify message body as WhatsApp template ID or Voice IVR ID where "The ID could be our autogenerated ID, or the Reference ID linked to that template while its creation." [PRD-V5 L450–455]

**BR-BSA-88 — Send API recipients: ONLY ONE contact group per request (vs multi-CG in UI).**
Quote: "Ability to select ONLY one contact group per request. To specify the Destination 'recipient' in this contact group, the user should specify the column name which contains the mobile numbers as a value for a key called 'Destination/Recipient'. The user should give us the (Key = variable name exactly as it is in the template/IVR) & the (Value = column name in the selected contact group)." [PRD-V5 L456–459]

**BR-BSA-89 — Send API manual recipients: list of phone numbers, per-recipient variable key/values.**
Quote: "Ability to add a list of recipients 'phone numbers' manually. The user should give us the (Key = variable name exactly as it is in the template/IVR) & the (Value = the value of that variable) per recipient for each added recipient." [PRD-V5 L460–461]
ABSENT: whether the UI max-3 manual cap applies to the API (see Q-BSA-14).

**BR-BSA-90 — Send API duplication flag + send date defaulting/validation + meaningful errors.**
Quote: "Ability to specify if duplication behaviour: Allow the duplication or not. Ability to specify the send date: If not given, it means now. If given, should be greater than now and datetime format. Detailed and meaningful errors if there is anything not correct or rejected for this request" [PRD-V5 L462–467]

**BR-BSA-91 — Templates Skeleton API.** Auth; caller specifies commchannel (whatsapp or Voice); returns templates "eligible to be used by this user (his own created templates or shared with him) & should be Approved"; each JSON: Template type (WA: Authentication/Utility/Marketing; Voice: Dynamic/Static), Template Name, Language ("if exist… only for whatsapp"), Template ID (autogenerated), Reference ID, Variable list. [PRD-V5 L468–478]

**BR-BSA-92 — Contact Groups Skeleton API.** Auth; returns CGs "eligible … (his own created contact groups or shared with him) & should be active 'not deleted'"; each JSON: CG name, CG ID (autogenerated), Reference ID, "Columns name in each template, their final shape." [PRD-V5 L479–486]

**BR-BSA-93 — SenderID Skeleton API.** Auth; returns per-commchannel lists: "Commchannel; List of Sendernames/ SenderIDs under that commchannel." [PRD-V5 L487–491]

**BR-BSA-94 — Near-future API roadmap.** (a) "App configuration to decide who the user wants to manage the statuses and call back." (b) "APIs for return/inquiring about the transaction status per transaction and per recipient inside the transaction." (c) "APIs for balance inquiry, this is API for the Skeleton not for the app" (d) "Allow/now allow partial processing in case of insufficient balance." [PRD-V5 L492–496]

### 1.12 Landing/navigation inside the app

**BR-BSA-95 — Landing page = WhatsApp tab; Voice tab "almost similar".**
Quote: "Once the normal user selects the activated BSA from the marketplace; the application landing page will be the detailed page for the Whatsapp tab and there is another almost similar page for the Voice tab." [PRD-V5 §BSA Features, Functionalities, and Pages, L38]

**BR-BSA-96 — Tab structure.** WhatsApp tab: sub-tabs Outbox + Scheduled + "Send Whatsapp Message" button [L41]. Voice tab: sub-tabs Outbox + Scheduled + "Send Voice IVR Message" button [L286]. WA compose screen "opens three sections (Message details, Recipients and preview)" [L44].
---

