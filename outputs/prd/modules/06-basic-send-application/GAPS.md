*** PRD Understanding - Basic Send Application - GAPS ***

# 06-basic-send-application - GAPS

> Three-way gap register, adversarially verified 2026-07-06 (parity-critic agent; every doubted claim re-checked against `latest-prd.md` and `basic-app.jsx` primaries).
> Layer 1 - PRD <-> React reference parity (matrix below): what the cloud-design SoT already renders vs what must be designed from PRD alone.
> Layer 2 - Reference stubs/dead code (see `REACT_REFERENCE.md` section 6): UI that LOOKS done but is demo-faked (exports, date filter, CS-window tick, allowDup persistence, schedule persistence, edit-in-place...).
> Layer 3 - Backend: the ENTIRE BSA execution plane is CONFIRMED-ABSENT / ABSENT-IN-BRAIN (see `PLATFORM_GROUNDING.md` section 3): transaction engine, batch processor, Meta send+webhooks, WABA/SIP sender registries, voice dialer + per-second charging loop, conversation store + CS-window, voice retry engine, exports, BSA public API + skeleton facades, BSA PES resources, cost-estimation/quote path, destination resolution.
> Rule of consumption: a PRESENT row in the matrix means present IN THE REACT REFERENCE - it does NOT mean built in Falcon. Nothing of BSA exists in the Falcon platform beyond the marketplace SKU.

---

# BSA Parity Critic — PRD v5 vs React Reference (falcon-ux (4))

Adversarial completeness review. Date: 2026-07-06.

Inputs read in full: `agents/prd-analyst.md` (750 lines), `agents/code-core.md` (451 lines), `agents/code-host.md` (291 lines).
Primary-source verifications performed against `prd-v5.md` and `admin/basic-app.jsx` (cited inline as `[VERIFIED]`).

Status legend: **PRESENT** = React reference implements the requirement (possibly with mock data), **PARTIAL** = UI shell exists but behavior is stubbed/incomplete/deviates, **MISSING** = no React counterpart at all. Backend-only rules with no possible UI surface are marked MISSING with a `(backend)` tag — the FE must still design their UI consequences (error copy, statuses, disabled states) from PRD alone.

---

## 1. PARITY MATRIX

### 1.1 Purchase, activation, navigation

| Req | PRD requirement | Status | Evidence |
|---|---|---|---|
| BR-BSA-01 | Purchase/activation only by Account Owner & Falcon UserType | PARTIAL | [PRD L7,L18]. [CODE apps.jsx:23, comm-mkt.jsx:377-394] marketplace card `a1 'Basic Send App'` with Do Payment/Disable/Enable lifecycle exists, but no role gating on purchase actions anywhere |
| BR-BSA-02 | Post-activation available to all Normal Users at all levels; permission-group override | PARTIAL | [PRD L8]. [CODE basic-app.jsx:2949-2955] role dropdown demo: only `normal-user` sees Send; no permission-group model at all |
| BR-BSA-03 | Purchase completes → Active immediately | PRESENT | [PRD L19]. [CODE apps.jsx:678-687] doPayment → `status:'active'` for non-comm apps (BSA) |
| BR-BSA-04 | Auto-created submenu "Basic Send Application" after activation | PARTIAL | [PRD L20]. [CODE sidebar.jsx:20] submenu item "Basic Application" is statically present regardless of a1 status; no creation-on-activation logic [code-host §2.5: "no purchase gate in front of the BSA screen"] |
| BR-BSA-05 | Two navigation paths (marketplace card + submenu), same instance | MISSING | [PRD L21-24]. [CODE comm-mkt.jsx] card actions are lifecycle-only; "no navigation wired from the 'Basic Send App' marketplace card to the BSA screen" [code-host §2.3] |
| BR-BSA-95 | Landing page = WhatsApp tab detailed page | PARTIAL | [PRD L38]. [CODE basic-app.jsx:2709-2734, 2912] code lands on a Falcon/Client perspective picker first (code-only); after picking, default channel is `whatsapp` list |
| BR-BSA-96 | WA tab = Outbox + Scheduled + Send WA button; Voice mirror; compose = 3 sections | PRESENT | [PRD L41,L44,L286]. [CODE basic-app.jsx:298-301, 2832, css:212-224] channel tabs, sub-tabs, per-channel Send label, 3-column compose (Message Details · Recipients · Preview) |

### 1.2 CommChannel-status gating

| Req | PRD requirement | Status | Evidence |
|---|---|---|---|
| BR-BSA-08 | Channel never enabled ⇒ Send disabled; Outbox/Scheduled view-only | MISSING | [PRD L9]. No channel-status model anywhere in basic-app.jsx; Send visibility is role-based only [CODE basic-app.jsx:2949-2955] |
| BR-BSA-09 | Channel disabled ⇒ scheduled txns fail at due date with reason | MISSING (backend) | [PRD L10,L33]. Scheduled rows never auto-execute in code [code-core §6.22] |
| BR-BSA-10/11 | App stays Active; channel Active ⇒ full functionality | MISSING | [PRD L27-28]. No wiring between comm-channel status (comm-mkt.jsx `c2`/`c4`) and BSA behavior |
| BR-BSA-12 | Channel Expired/Disabled ⇒ Send button disabled, history viewable | MISSING | [PRD L29-32]. No counterpart |
| BR-BSA-13 | Channel reactivation ⇒ new sends OK, NO auto-retry of failed scheduled | MISSING (backend) | [PRD L34]. No counterpart |
| BR-BSA-14 | Both channels inactive ⇒ read-only mode incl. export | MISSING | [PRD L35]. No counterpart |

### 1.3 Balance / charging

| Req | PRD requirement | Status | Evidence |
|---|---|---|---|
| BR-BSA-15/16/17 | Follow balance strategy; no balance failover; no channel failover | MISSING (backend) | [PRD L11-13]. No balance display or check in code [code-core §6.20] |
| BR-BSA-18 | No reservation at creation; deduction at execution | PARTIAL | [PRD L77,L81]. Confirm-overlay copy states "Your balance is charged at send time." [CODE basic-app.jsx:471-507] — the only UI trace |
| BR-BSA-19/20 | WA per-batch deduct-refund / reserve-commit-return | MISSING (backend) | [PRD L82,L86]. PRD itself self-contradicts (Q-BSA-08) |
| BR-BSA-21/22 | Voice per-second realtime charging; 1-second pre-call gate | MISSING (backend) | [PRD L330-331]. No counterpart; code voice cost is a per-attempt formula for demo figures only [CODE basic-app.jsx:1397] |

### 1.4 Templates & eligibility

| Req | PRD requirement | Status | Evidence |
|---|---|---|---|
| BR-BSA-23 | Approved templates only, both channels | PARTIAL | [PRD L14]. [CODE basic-app.jsx:524-526] template list still shows `wt5` (Paused) — gating happens at send, not at listing |
| BR-BSA-24 | Own or shared-within-account templates & CGs | PARTIAL | [PRD L15]. CGs have Created-by-me / Shared-with-me tabs [CODE basic-app.jsx:172-216]; templates have NO ownership/shared distinction in the mock [CODE basic-app-data.jsx:11-24] |
| BR-BSA-25 | WA 3-tier picker: Category → Language → Template Name | PRESENT | [PRD L47-48]. [CODE basic-app.jsx:723-726, 918-919] with cascade resets |
| BR-BSA-26 | Voice 2-tier picker: Static/Dynamic → Template Name | PRESENT | [PRD L292-293]. [CODE basic-app.jsx:723] (no Language tier for voice, verified) |
| BR-BSA-27 | Variables surfaced under a Variables field | PRESENT | [PRD L49,L294]. [CODE basic-app.jsx:923-925] "VARIABLES" monospace chips |
| BR-BSA-28 | Suggested Meta template sync on selection (status + body) | PARTIAL | [PRD L50]. [CODE basic-app.jsx:524-526] static `BSA_TPL_META` simulates status only; no body refresh, no sync call |
| BR-BSA-29 | Non-Approved template ⇒ block + tell user to reselect | PRESENT | [PRD L52]. [CODE basic-app.jsx:926-928, 796] warning banner "This template is Paused on Meta — please select another template." + `canSend` blocked [VERIFIED :796] |

### 1.5 Recipients, mapping, duplicates, preview, confirm

| Req | PRD requirement | Status | Evidence |
|---|---|---|---|
| BR-BSA-30 | One or multiple CGs; own or shared | PRESENT | [PRD L56-59]. [CODE basic-app.jsx:172-216, 947] multi-add with mine/shared tabs + search |
| BR-BSA-31 | Per CG: destination column + full variable map before next CG; add-CG button gated | PRESENT | [PRD L60-62]. [CODE basic-app.jsx:768, 947] `groupsReady` (mobileCol + every var mapped) gates the picker |
| BR-BSA-32 | Manual: max 3; ALL variables required; add-recipient gated; values displayed & editable | PARTIAL | [PRD L63-71]. Max 3 + add-gating + editable table all present [CODE basic-app.jsx:716, 754-761, 1025]; **BUT `canSend` does not require manual vars filled** — a destination-only row is sendable [VERIFIED basic-app.jsx:796: `canSend = sender && tplId && tplApproved && (selGroups.length>0 || manualValid.length>0) && groupsReady`] |
| BR-BSA-33 | 1:1 variable→column mapping grid, every required variable | PRESENT | [PRD L72]. [CODE basic-app.jsx:961-996] mapping table with move-on-reassign semantics, red-invalid unmapped columns, progress pill, no auto-map |
| BR-BSA-34 | WA preview = first recipient of first selected CG | PRESENT | [PRD L73]. [CODE basic-app.jsx:798-810] first group's first sample row through the map, else first manual row |
| BR-BSA-35 | Voice preview: IVR canvas, play voices node by node w/ first-recipient values | PARTIAL | [PRD L317-318]. Compose shows read-only `TplIvrStep2` canvas [VERIFIED basic-app.jsx:1061-1064]; node-play hint ("Tap any node to play its prompt") exists only on the DETAILS canvas [VERIFIED :2128], and audio is simulated everywhere |
| BR-BSA-36/37 | Confirm overlay: duplicate checkbox + programmatic cost estimation (contract, category/destination/count; voice + expected call time) | PARTIAL | [PRD L74-76, L319-321]. Overlay exists w/ recipients + estimated cost + "Allow duplicate recipients" toggle [CODE basic-app.jsx:471-507]; cost = flat `recipients × 2.5 (WA) / 4 (voice)` [CODE :758] — no contract/destination/category/call-time inputs; duplicate value **discarded** by `doSend` [CODE :812-820] |
| BR-BSA-38 | Dedup at execution keeps FIRST occurrence | MISSING (backend) | [PRD L85,L329]. allowDup not even persisted |
| BR-BSA-39 | Processing order: manual first, then CGs in added order | MISSING (backend) | [PRD L83,L327] |
| BR-BSA-40 | Variable replacement right before dispatch = per-recipient Send date | MISSING (backend) | [PRD L84,L328]. (Send Date column exists in details, semantics not enforced) |
| BR-BSA-41 | Send now or schedule future datetime | PARTIAL | [PRD L51,L295]. Immediate/Schedule segmented + full calendar+time picker [CODE basic-app.jsx:636-690, 842-855]; **picked datetime is not persisted** — stored `scheduledAt` hardcoded '20-Jul-2026 · 09:00 am' [CODE :2858] |
| BR-BSA-42 | Voice retry: up to 3 attempts, per-status triggers {no answer, busy, cancel, failed}, per-attempt wait minutes | PRESENT (UI) / PARTIAL (persistence) | [PRD L296-297]. [CODE basic-app.jsx:857-897] toggle + exact 4 trigger chips + up-to-3 wait rows (1..1440 min); `data.retry` never stored on the created txn [CODE :2853-2859] |

### 1.6 Transaction statuses & cancel semantics

| Req | PRD requirement | Status | Evidence |
|---|---|---|---|
| BR-BSA-43/44/45 | Failed (pre-record) / Partially processed (mid) / Completed | PRESENT (vocabulary) | [PRD L89-91]. [CODE basic-app.jsx:9-22] `BSA_STATUS` = completed/in_progress/partial/failed/canceled/scheduled/deleted — exact match to PRD's 7 statuses; seed rows exercise each [CODE basic-app-data.jsx:48-85]. Transitions themselves are demo-only |
| BR-BSA-46 | In Progress: live-updating recipient count + cost | PRESENT (simulated) | [PRD L92]. [CODE basic-app.jsx:2799-2821] 4.5s ticker + live progress banner in details |
| BR-BSA-47/48, 55, 56 | Cancel during processing → Canceled; stop next batch; confirmation states mid-flight vs already-finished | PRESENT | [PRD L93-94, L115-119]. [CODE basic-app.jsx:2972-2979, 2867-2891] dialog explains batch-edge semantics + race caveat; `applyCancel` re-reads live row → "Too late to cancel" (completed) vs canceled-with-partial-charge. This is the strongest behavioral match in the reference |
| BR-BSA-57 | Post-cancel: count & cost = successfully-sent only | PRESENT | [PRD L120-124]. [CODE basic-app.jsx:2867-2891] keeps processed count/cost, writes failReason, excludes rest |
| BR-BSA-49/50 | Delete not-yet-due scheduled → Deleted, stays listed; not-yet-due = Scheduled | PRESENT | [PRD L95-96]. [CODE basic-app.jsx:2892-2897, 338] soft-delete, row dimmed in place |
| BR-BSA-51 | Failed/Partial carry reason on detail page | PRESENT | [PRD L97]. [CODE basic-app.jsx:1246-1249] tinted `failReason` banners |

### 1.7 Outbox tabs

| Req | PRD requirement | Status | Evidence |
|---|---|---|---|
| BR-BSA-52 | Scope: logged-in user's transactions whose execution time is satisfied | MISSING | [PRD L100,L345]. Grids are global demo seeds; no user scoping (role dropdown only changes chrome) |
| BR-BSA-53 | WA outbox columns: Txn ID, Sender ID, Template name/language/type, Creation date, Total recipient count, Total cost, Recipients, Status (5 values), Actions (Details/Cancel) | PRESENT | [PRD L101-115]. [CODE basic-app.jsx:310-336] all columns incl. `+N` recipients popover; Cancel only on in_progress; status pill set matches exactly [VERIFIED PRD L111 vs CODE :9-17] |
| BR-BSA-54 | Voice outbox: same w/ IVR name + IVR type (no language) | PRESENT | [PRD L346-356]. [CODE basic-app.jsx:291, 315] header swap + Language column dropped for voice |

### 1.8 WA Outbox detailed view

| Req | PRD requirement | Status | Evidence |
|---|---|---|---|
| BR-BSA-58 | Header fields (ID, sender, template n/l/t, dates, count, cost, recipients, status) | PRESENT | [PRD L129]. [CODE basic-app.jsx:1223-1255] header + KPI row + recipients popover |
| BR-BSA-59 | Suggested Statistics: Delivered/Read/Played/Seen/Failed/Reply rates, Average Delivery Time, Cost Breakdown (by template type AND destination; cost sent; avg per message) | PARTIAL | [PRD L131-142]. [CODE basic-app.jsx:1259-1314] 6 rate bars + cost-sent + avg-cost + destination donut present; **Average Delivery Time computed ('4.2s') but never displayed** [CODE :408]; **breakdown "by template type" absent** |
| BR-BSA-60 | Recipient grid: number, Meta status, Send Date, Delivery Date, Status Date, Message cost, has-reply | PRESENT | [PRD L143-156]. [VERIFIED basic-app.jsx:1323] columns: Recipient Number · Status · Send Date · Delivery Date · Status Date · Reply · Message Cost · Actions. Code adds a `Failed` recipient status the PRD omits (see Conflicts C1) |
| BR-BSA-61 | Per-recipient Conversation action | PRESENT | [PRD L158]. [CODE basic-app.jsx:1340] gated (disabled for scheduled/deleted) |
| BR-BSA-62 | Per-recipient message preview on select | PRESENT | [PRD L159]. [CODE basic-app.jsx:1351-1354] phone preview re-renders with selected recipient's values |
| BR-BSA-63 | Export details + export statistics | PARTIAL | [PRD L160]. [CODE basic-app.jsx:1241-1242] both buttons exist — **toast only, no file** |

### 1.9 Voice Outbox detailed view

| Req | PRD requirement | Status | Evidence |
|---|---|---|---|
| BR-BSA-64 | Header + stats: Answered/Busy/No Answer/Failed rates, IVR Completion, Avg Call Duration, Cost Breakdown (by IVR type / destination / retry attempts) | PARTIAL | [PRD L372-382]. [CODE basic-app.jsx:1986-2046] 4 bars + IVR Completion tile + Avg Duration tile + destination donut + retry-attempt rows; **breakdown "by IVR template type" absent** |
| BR-BSA-65 | 11 voice statuses (Pending…Failed) incl. "Initiator drop the call" | PRESENT | [PRD L385-396]. [CODE basic-app.jsx:1363-1376] `BSA_VSTATUS` — exact 11-status match ("Initiator Dropped") |
| BR-BSA-66 | Attempt tracking: number (1-3), status, timestamp, wait duration | PRESENT | [PRD L397-401]. [CODE basic-app.jsx:2087-2115] expandable attempts sub-table (adds a per-attempt Cost column the PRD lacks) |
| BR-BSA-67 | Per recipient: Send date (first attempt), Status date (final), Message cost (all attempts) | PARTIAL | [PRD L402-404]. [VERIFIED basic-app.jsx:2057-2062] voice grid columns = Recipient Number · Status · Attempts · Status Date · Duration — **no Send Date column, no Message Cost column** (cost only inside the attempts expansion; Duration is a code-only column the PRD only lists on the SCHEDULED voice detail) |
| BR-BSA-68 | Voice Conversation: view IVR + recipient interaction; cross-channel follow-up (send WA / send IVR prefilled) | PRESENT | [PRD L406]. [CODE basic-app.jsx:1759-1901] full IVR-walk thread (voice notes, transcripts, keypresses) + footer "Send Whatsapp Message"/"Send Voice IVR Message" → compose prefilled [CODE :2840-2841]. Code adds an AI-handoff continuation (code-only, F5) |
| BR-BSA-69 | Voice export incl. full audit trail | PARTIAL | [PRD L407]. Buttons toast only [CODE basic-app.jsx:1969-1970] |
| BR-BSA-70 | Per-recipient Preview: recorded playback of the actual call incl. hang/close | MISSING | [PRD L408]. `BsaVoicePreview` modal exists but is **unreachable** — `setPreviewId` never invoked [CODE basic-app.jsx:1505-1560, verified orphan per code-core §6.29]; play button is a toast |

### 1.10 Scheduled tabs + scheduled details

| Req | PRD requirement | Status | Evidence |
|---|---|---|---|
| BR-BSA-71 | Scheduled grid: logged-in user's not-yet-due; + Scheduled date column; Status {Scheduled, Deleted} | PRESENT (columns) / MISSING (user scope) | [PRD L163-174]. [CODE basic-app.jsx:318, 345] Scheduled Date column only on scheduled tab; deleted rows dimmed in place |
| BR-BSA-72/73 | Edit: reopen compose prefilled; EVERYTHING editable | PARTIAL | [PRD L177,L424]. [CODE basic-app.jsx:699-706] Edit opens compose but prefill is broken: `selGroups=['cg1']` hardcoded, category/language/schedule not restored, and **sending creates a NEW transaction instead of updating the original** [CODE :2846-2865] |
| BR-BSA-74 | Delete: only pre-due; confirmation popup; row stays as Deleted | PRESENT | [PRD L178-180]. [CODE basic-app.jsx:329-336, 2980-2987] Edit/Delete only on `status==='scheduled'`; confirm dialog; soft delete |
| BR-BSA-75 | WA scheduled detail: zeroed stats, all Pending, empty dates, 0 SAR, Conversation disabled, smartphone-mockup preview | PRESENT | [PRD L184-198]. [CODE basic-app.jsx:375-386, 414-439, 1340] scheduled → grey '—' chart stubs, all-pending recipients w/ no dates, conversation disabled w/ hint, iPhone-mockup preview |
| BR-BSA-76 | Voice scheduled detail: fields incl. Estimated Cost; empty stats; Pending w/ Attempts=0, empty Status Date, 0 SAR, Duration; Conversation disabled; IVR canvas | PARTIAL | [PRD L431-445]. Empty stats + pending + disabled conversation + canvas all present [CODE basic-app.jsx:1903-2161]; **code renders scheduled recipients with a single pending attempt (Attempts badge = 1, PRD says 0)** [CODE :1406-1443]; header shows `totalCost` flagged as estimate (`costEstimated:true` [VERIFIED :379-386]) rather than a distinct Estimated Cost field |

### 1.11 WhatsApp Conversation page (8 sub-features)

| Req | PRD requirement | Status | Evidence |
|---|---|---|---|
| BR-BSA-77 | Structure: header (Message Name/Created Date/Recipient Number), Message Info panel, thread, actions, search, CS window, composer | PRESENT | [PRD L201-216]. [CODE basic-app.jsx:2371-2706] all seven regions exist |
| BR-BSA-77 (entry) | Entered from WA outbox details, "starting from this transaction message point… go up (older) and down (newer)" | PARTIAL | [PRD L158,L201]. Thread STARTS with the actual sent template bubble [CODE basic-app.jsx:2375-2382] then a fixed sample thread; no older-history scroll-back |
| BR-BSA-78 | 11 supported message types (Text, Images, Documents, Audio, Videos, Location, Contacts, Interactive, Template, Replies, Emoji Reactions) | PARTIAL | [PRD L219-230]. Code demonstrates Text, Images, Documents, Audio (voice note), Template, Replies, Reactions, big-emoji [CODE basic-app-data.jsx:103-116]; **Videos, Location, Contacts, Interactive ABSENT** |
| BR-BSA-79 | Chronological; sender right / recipient left; per-message time; delivery/read indicators | PRESENT | [PRD L232-236]. [CODE basic-app.jsx:2595-2621, 2165-2175] incl. `BsaTicks` single/double-grey/double-blue |
| BR-BSA-80 | Actions: Reply, View Information (mirrors info panel), React, Download Attachment; Reply/React only while CS window active | PARTIAL | [PRD L237-245]. Reply/Info(→left panel)/React present and expiry-gated [CODE basic-app.jsx:2437-2460]; **Download Attachment action ABSENT** |
| BR-BSA-81 | Search by text/file name/keywords; highlight; navigate to match | PRESENT | [PRD L246-255]. [CODE basic-app.jsx:2462-2480] match count, prev/next, `<mark>` highlight + ring + scroll-into-view; searches text/title/caption/fileName/footer/button |
| BR-BSA-82 | CS window: starts on recipient message; 24h countdown H/M/S decreasing continuously; RESET to 24h on each recipient message; Expired at 00:00:00 blocks free-form | PARTIAL | [PRD L256-267]. Countdown UI (HH:MM:SS boxes + label) exists but values are **static constants 22:30:15 — no ticking interval, no reset-on-message logic**; expiry is a manual "Simulate expiry" demo link [CODE basic-app.jsx:2397-2398, 2552, 2627] |
| BR-BSA-83 | After expiry: template-only re-initiation; opens send-WA screen w/ recipient locked + variables; Send creates a NEW conversation record | PARTIAL | [PRD L268-269]. Expired footer CTA → compose in fromConversation mode with locked recipient + vars [CODE basic-app.jsx:2691-2699, 903-906]; **but the staged template posts back into the SAME thread — no new conversation record is created** [CODE :2426-2431, 2644-2657] |
| BR-BSA-84 | Conversation record chaining (new record references previous as Conversation History; per-record lifecycle) | MISSING | [PRD L270-271]. Single flat thread; no record entity, no history chaining |
| BR-BSA-85 | Composer (active window): Text, Attachments, Emojis, Voice record, Templates (icon → send-WA screen, recipient disabled, variables per template) | PRESENT | [PRD L272-283]. [CODE basic-app.jsx:2624-2690] text/Enter-send, emoji popover, attach Photo/Document, full record→preview→send flow, tplAdd → fromConversation compose |

### 1.12 API surface

| Req | PRD requirement | Status | Evidence |
|---|---|---|---|
| BR-BSA-86–93 | Send API (1 CG max, manual list, dup flag, send-date rules, errors), Templates/CG/SenderID Skeleton APIs | MISSING | [PRD L447-491]. Zero fetch/XHR in the reference [code-host §5.5]; only indirect UI hints: template `refId` exists in mock data but never displayed [CODE basic-app-data.jsx:11-24], CG `columns[]` schema powers the mapping grid (mirrors the API's Key=variable/Value=column contract [PRD L459]) |
| BR-BSA-94 | Near-future APIs (status inquiry, balance inquiry, partial-processing config) | MISSING | [PRD L492-496]. Explicitly deferred by PRD too |

### 1.13 Edge cases

| Req | PRD requirement | Status | Evidence |
|---|---|---|---|
| EC-1 | Zero balance at start ⇒ "Failed - Insufficient Balance", nothing sent | PARTIAL | [PRD L506]. Seeded failed row w/ failReason prose + "No records were processed…" empty state [CODE basic-app-data.jsx:48-85, basic-app.jsx:1345] — copy demonstrates it; no engine |
| EC-2 | Deleted assets before scheduled send ⇒ instant fail at execution ("Asset Missing") | MISSING | [PRD L507]. No counterpart |
| EC-3 | Third-party rejections ⇒ status Failed; core Wallet Engine refunds | PARTIAL | [PRD L508]. Per-recipient Failed status + Failed Rate bar exist in code (which the PRD status list itself omits — Conflict C1); refund flow invisible |

---

## 2. PRD-ONLY GAPS (FE must design from PRD alone — no React counterpart)

1. **CommChannel-status gating end to end** (BR-08–14): disable Send per channel status, read-only tabs, read-only whole-app mode when both channels down, failure reason "Communication Channel is not active" on matured scheduled txns, no-auto-retry after recovery. The reference has zero channel-status wiring.
2. **Conversation-record chaining** (BR-83/84): new conversation record on post-expiry template send, Conversation History reference to prior records, per-record lifecycle/timestamps/statuses. The reference has a single flat demo thread.
3. **Live CS-window mechanics** (BR-82): real ticking 24h countdown, reset-to-24h on every recipient inbound, auto-expiry at 00:00:00 flipping the composer. Reference is static 22:30:15 + a manual demo toggle.
4. **Real cost estimation** (BR-36/37, Q-BSA-03): programmatic estimate from destination + template category + count + active contract (+ expected call time for Voice). Reference uses flat 2.5/4 SAR per recipient.
5. **Duplicate-handling execution** (BR-38) + persisting the allowDup choice (reference discards it), and dedup keep-first ordering guarantee (manual → CGs in added order, BR-39).
6. **Voice recorded-call playback** (BR-70): the `BsaVoicePreview` modal is orphaned/unreachable — usable only as a visual design hint, not a working flow; real playback incl. hang/close moment must be designed.
7. **Working exports** (BR-63/69, BR-14): Export Details (grid + creation date + post-replacement message content + all statuses w/ dates; Voice full audit trail) and Export Statistics; format unspecified by PRD too (flag to BE/PO).
8. **User scoping & roles** (BR-52, BR-02, Q-BSA-01/02): grids scoped to logged-in user; permission-group overrides for app access and Sender ID lists; AO/Falcon purchase rights. Reference's perspective picker/role dropdown is demo chrome, not an auth model.
9. **Marketplace integration** (BR-01–05): purchase gate on the nav item, auto-created submenu on activation, marketplace-card → app navigation, dual-path same-instance semantics.
10. **Entire API surface** (BR-86–94) incl. the deliberate UI/API divergence: API = ONE contact group per request vs UI multi-CG.
11. **Real Meta template sync** (BR-28): backend call refreshing status AND body, propagating to Templates pages.
12. **Scheduled-execution engine consequences** (BR-09, EC-1/EC-2): Scheduled → In Progress/Failed at due time with reasons (channel inactive / "Failed - Insufficient Balance" / "Asset Missing").
13. **True edit-scheduled** (BR-72/73): full prefill of every field (groups, mappings, category/language, schedule) and update-in-place semantics (open Q-BSA-16: same Transaction ID? re-confirmation overlay?).
14. **Missing conversation message types** (BR-78): Videos, Location, Contacts, Interactive; plus Download Attachment action (BR-80).
15. **Stat completeness** (BR-59/64): Average Delivery Time display (WA), cost breakdown by template type (WA) and by IVR template type (Voice).
16. **Voice recipient-grid columns** (BR-67): Send Date (first attempt) and Message Cost (sum of attempts) columns.
17. **Send-gating on manual variables** (BR-32): every manual recipient's variables must be filled before SEND, not just before adding the next row.
18. **Date-range filtering** of the grids implied by history/reporting usage — the reference's date chip is decorative (note: filters aren't in the PRD either; treat the chip as a wireframe promise needing spec).
19. **Balance-strategy compliance surface** (BR-15–22): at minimum the failure/partial reasons and any insufficient-balance messaging.

## 3. CODE-ONLY FEATURES (not in PRD)

**Adopt as de-facto spec** (fills PRD silence, consistent with platform rules):
1. **Per-recipient WA `Failed` status + failed-txn empty states** [CODE basic-app.jsx:441-446, 1345] — resolves PRD's own contradiction (Failed Rate + EC-3 need it; status list omits it). Adopt.
2. **Race-aware cancel outcome** ("too late to cancel" → Completed vs Canceled-with-partial-charge, live re-read) [CODE :2867-2891] — the concrete implementation of BR-48/56. Adopt.
3. **Grid toolbar: search box + type filter + pagination (default 10)** [CODE :302-306, 2784] — matches the platform data-table page-size-10 rule. Adopt (make the date-range chip a real filter).
4. **Recipients `+N` portal popover** distinguishing group vs manual entries [CODE :58-118]. Adopt.
5. **Deleted rows dimmed in place** + status-aware detail banners (deleted/scheduled/in-progress/fail-reason) [CODE :338, 1246-1249]. Adopt.
6. **Mapping-grid UX**: move-on-reassign, red invalid columns, progress pill, sample rows, one-open-panel accordions, explicit no-auto-map [CODE :961-996]. Adopt as the design for BR-31/33.
7. **Compose ergonomics**: locked recipients section until template chosen, cascade resets, preview hide/show, bottom summary strip [CODE :941, 918-919, 1069-1090]. Adopt.
8. **Voice attempts expansion with per-attempt Cost** [CODE :2087-2115] — superset of BR-66. Adopt.
9. **Voice conversation transcript/IVR-walk rendering** (voice notes, transcripts, DTMF keypresses, call-ended notes) [CODE :1816-1884] — the concrete rendering of BR-68's vague "view the IVR and the interaction". Adopt.
10. **In-conversation staged-template card** ("Send & back to conversation") [CODE :2426-2431, 2644-2657] — adopt the flow BUT layered under BR-83/84's new-record semantics.
11. **Empty/no-data chart stubs ('—')** instead of hidden sections for scheduled/deleted/failed [CODE :1198, 1274]. Adopt.

**Flag as questions (do NOT port blindly):**
12. **Perspective picker (View as Falcon/Client) + role dropdown + org-tree rail** [CODE :2709-2766, 2928] — demo scaffolding for the Pending "Other Roles behaviour" [PRD L499]. Real build: PES/session-driven; ask PO which oversight views ship in v1.
13. **Ask AI drawer** (WA + Voice details) [CODE :1125-1171] — nowhere in PRD. Ship or cut?
14. **AI handoff after IVR transfer** (WhatsApp/Instagram continuation chat with scripted Falcon AI Assistant) [CODE :1657-1757] — pure vision demo; PRD says nothing. Almost certainly out of v1 scope; confirm.
15. **Live in-progress ticker (4.5s, caps at 70%)** [CODE :2799-2821] — demo only; real build needs polling/push spec.
16. **"Only a Normal User sends; AO/Node Admin oversee"** [CODE comment :2949] — a stronger rule than the PRD states (Q-BSA-01). Confirm before encoding in PES.
17. **Voice `Duration` column in the OUTBOX recipient grid** [VERIFIED :2062] — PRD lists Duration only on the scheduled voice detail (Q-BSA-18). Keep or reconcile.
18. **Dead/orphaned code — do NOT port**: `BsaVoicePreview` (unreachable), `BsaSendTplModal` (superseded), `timeControl`/`BsaTimePicker`, `BsaClientsRail`, `BsaCountUp`, `BsaStatBar`, `BSA_VOICE_STATS` IVR-insights, group preview-table cards, colored type chips CSS, quicksort CSS [code-core §6.28-36].
19. **Simulate-expiry demo link** in conversation topbar [CODE :2552] — demo only.

## 4. CONFLICTS (code contradicts PRD)

| # | Topic | PRD says | Code does | Ruling |
|---|---|---|---|---|
| C1 | WA per-recipient statuses | 6 statuses: Pending/Sent/Delivered/Read/Played/Seen [PRD L145-151] — no Failed | 7 incl. **Failed** [CODE basic-app.jsx:441-446] | PRD is internally inconsistent (needs Failed for Failed Rate L136 + EC-3 L508). **Adopt code.** |
| C2 | Voice outbox recipient grid columns | Send date, Status date, Message cost per recipient [PRD L402-404] | Recipient Number · Status · Attempts · Status Date · **Duration**; **no Send Date, no Message Cost** [VERIFIED :2057-2062] | Union both: add Send Date + Message Cost; decide on Duration (Q-BSA-18). |
| C3 | Manual-recipient variable enforcement | ALL template variables required per manual recipient [PRD L66-68] | `canSend` omits `manualComplete` — destination-only rows sendable [VERIFIED :796] | **PRD wins**: gate Send on complete manual rows. |
| C4 | Landing page | Landing = WhatsApp tab detailed page [PRD L38] | Perspective picker first [CODE :2912] | PRD wins for Normal User; picker is demo chrome. |
| C5 | Edit scheduled | Reopen compose prefilled, edit anything [PRD L177,L424] — implies updating THAT transaction | Partial prefill (hardcoded cg1; no cat/lang/schedule restore) and **creates a NEW txn**, original untouched [CODE :699-706, 2846-2865] | **PRD wins**: full prefill + in-place update (open: same ID? — Q-BSA-16). |
| C6 | Cost estimation | Programmatic from destination/category/count/contract (+ call time for voice) [PRD L76,L321] | Flat 2.5 SAR (WA) / 4 SAR (voice) × recipients [CODE :758] | PRD wins; code figure is placeholder. |
| C7 | Template eligibility gate | Only approved templates selectable [PRD L14,L47] | Paused template listed, blocked only at send [CODE :524-526, 926-928] | Hybrid is defensible (status can change post-listing per BR-28/29) — but the LIST should also filter non-approved per the Templates Skeleton API rule [PRD L471]. Decide: filter list AND keep send-time guard. |
| C8 | Post-expiry template send | Creates a NEW conversation record chained to the old [PRD L269-271] | Posts into the same thread [CODE :2644-2657] | PRD wins. |
| C9 | Scheduled voice recipients | "Attempts: will be 0" [PRD L438] | Scheduled voice rows generated with one pending attempt (badge 1) [CODE :1406-1443] | PRD wins (display 0 until execution). |
| C10 | WA cost breakdown dimensions | "by template type and recipient destination" [PRD L139] | Destination only [CODE :1285-1314]; voice similarly missing "by IVR template type" [PRD L382] vs destination+retry only [CODE :2012-2046] | PRD wins; add the missing dimension(s). |
| C11 | Duplicate control | "checkbox" [PRD L75] | Toggle switch, value discarded [CODE :494-498, 812-820] | Cosmetic (toggle OK per Falcon UI library); PERSISTING the value is mandatory. |
| C12 | Dual navigation | Marketplace card AND submenu open the app [PRD L21-24] | Submenu only; card has no open action [code-host §2.3] | PRD wins. |
| C13 | Average Delivery Time | Listed statistic [PRD L137] | Computed but never rendered [CODE :408] | PRD wins: display it. |
| C14 | Outbox Actions menu | 3-dots = Details, Cancel [PRD L112-114] | Adds Edit + Delete on the scheduled tab (which PRD specifies separately for Scheduled [L175-180]) | No real conflict — code merges the two PRD action sets per-tab correctly. Note only. |

## 5. CONFIDENCE NOTES (checks against primaries)

1. **Both analysts are highly accurate.** Every line citation I spot-checked in `prd-v5.md` (L95-96, L111-116, L144-146, L385, L399-404, L432-441) and `basic-app.jsx` (:796, :1323, :1061-1064, :2057-2062, :375-386, :2128) matched their claims exactly.
2. **code-core's `canSend` claim CONFIRMED** at basic-app.jsx:796 — `manualComplete` genuinely absent from the gate; this is a real spec violation, not analyst error.
3. **code-core's voice-grid column claim CONFIRMED** at :2057-2062 — no Send Date / Message Cost columns; the WA grid (:1323) does have all PRD columns.
4. **One nuance code-core slightly under-stated**: scheduled details are not purely "grey stubs" — `bsaStatusView` (:379-386) also flags `costEstimated:true`, so the scheduled/failed header cost is semantically an estimate (failed uses a distinct `estimatedCost` field, scheduled reuses `totalCost`). This partially satisfies PRD's "Estimated Cost" on the voice scheduled detail (BR-76) — I graded it PARTIAL, not MISSING.
5. **Compose-time IVR node playback**: the "Tap any node to play its prompt" hint exists ONLY on the voice DETAILS canvas (:2128), not the compose preview (:1061-1064, readOnly+inspect). BR-BSA-35's "play the IVR voices node by node" while composing is therefore weaker in code than prd-analyst's workflow table might suggest — graded PARTIAL.
6. **prd-analyst's Q-BSA-19a confirmed**: PRD L436 really says "Whatsapp message status" inside the VOICE scheduled detail (verified verbatim) — copy/paste defect, FE should read it as "Voice message status".
7. **code-host's "no purchase gate / no card→BSA nav" confirmed** by absence of any `marketplace:basic` navigation in comm-mkt card actions — treat BR-05 as MISSING, not PARTIAL.
8. **Statuses vocabulary parity is exact** (7 txn statuses, 11 voice recipient statuses, 4 retry triggers) — no analyst error; this is the reference's most faithful area alongside cancel semantics.
9. Residual uncertainty: I did not execute the prototype; claims about runtime behavior (ticker cadence, popover flipping) rest on code reading by code-core, which proved reliable in every verified instance.

---
END OF CRITIC REPORT
