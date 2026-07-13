*** PRD Understanding - Basic Send Application - REACT_REFERENCE (cloud-design SoT deep read) ***

> Reference: `C:\Falcon\Source_of_truth_theme\latest 07062026\falcon-ux (4)\admin\basic-app.jsx` (+ -data.jsx, .css) as of 2026-07-06.
> RUNTIME-WALKED 2026-07-06: served via `python -m http.server 4173` -> `T2 Falcon Admin.html` -> Marketplace & Applications .Mng -> Basic Application; every major screen exercised live (persona picker, role-gated Send, WA outbox/scheduled/details/conversation incl. CS-window expiry + template re-initiation, voice compose incl. 2-tier cascade + retry + mapping grid 0/3->3/3 + confirm overlay with cost estimate & duplicates toggle, voice details incl. per-attempt sub-table + IVR canvas).

# Basic Send Application (BSA) — Exhaustive Reference-Implementation Read

Deep-read report of the React cloud-design source of truth for the Basic Send Application.

**Files read in full (line by line):**
- [CODE] `C:/Falcon/Source_of_truth_theme/latest 07062026/falcon-ux (4)/admin/basic-app.jsx` — 2,993 lines (component logic, all screens)
- [CODE] `C:/Falcon/Source_of_truth_theme/latest 07062026/falcon-ux (4)/admin/basic-app-data.jsx` — 231 lines (mock data model)
- [CODE] `C:/Falcon/Source_of_truth_theme/latest 07062026/falcon-ux (4)/admin/basic-app.css` — 1,472 lines (all layout/visual rules)
- Supporting greps into `app.jsx`, `sidebar.jsx`, `icons.jsx`, `templates-shared.jsx`, `templates-ivr.jsx`, `templates-data.jsx`, `hierarchy.jsx`, `apps.jsx`, `otp-verify.jsx`, `data.jsx` to resolve external globals.

All facts below are `[CODE]`-prefixed with file:line. Reasoning of mine is flagged `[INFERRED]`. Anything not present in the code is marked **ABSENT**.

---

## 1. SCREEN INVENTORY

The whole BSA is a single-page state machine. [CODE] basic-app.jsx:2771-2785 — top-level state: `viewAs` (null | 'falcon' | 'client'), `role` ('account-owner' | 'node-admin' | 'normal-user'), `channel` ('whatsapp' | 'voice'), `mode` ('outbox' | 'scheduled'), `view` ('list' | 'compose' | 'details' | 'conversation'). Full-page takeovers replace the list (no routing): [CODE] basic-app.jsx:2917-2924.

### S0 — Perspective picker (landing)
- [CODE] basic-app.jsx:2709-2734 (`BsaViewPicker`), rendered when `viewAs === null` [CODE] basic-app.jsx:2912.
- Reached from sidebar "Marketplace & Applications .Mng → Basic Application": [CODE] sidebar.jsx:20 `{ id: 'marketplace:basic', label: t.bsaBasicApp || 'Basic Application' }`; mounted by app router [CODE] app.jsx:347-357.
- Layout: `tpl-picker-page > tpl-picker-card` (reuses Templates-module picker chrome). Head: title "Whose channels & services are you reviewing?" + sub "Falcon admins manage across clients; client admins manage a single organization."
- Two tiles: **View as Falcon** (T2Mark logo, class `falcon`) and **View as Client** (IcBuildingS, class `client`), each with title/description/CTA chevron. Picking `client` also selects the `aramco` node: [CODE] basic-app.jsx:2912.
- "Switch perspective" button on the main screen returns here and resets role/view/mode/channel: [CODE] basic-app.jsx:2908, 2936.

### S1 — Main list page (list view)
- [CODE] basic-app.jsx:2926-2989. Grid layout `templates-page basic-app-page` = org-tree rail + content panel; `bsa-no-tree` (single column) when Normal User [CODE] basic-app.css:8.
- **Org tree rail** via `window.TplOrgTree` [CODE] basic-app.jsx:2928 — hidden entirely for Normal User; Falcon sees the full tree; Client sees only its own subtree (`findNode(tree,'aramco')`) [CODE] basic-app.jsx:2903-2904. Props: `rootClickable={!isFalcon}`, `hideSectionLabel={!isFalcon}`, `hideMenus={true}`.
- **Topbar** [CODE] basic-app.jsx:2931-2937: channel tabs **WhatsApp | IVR Voice** (underline tabs identical to Organization Hierarchy: [CODE] basic-app.css:10-16) + secondary "Switch perspective" button.
- **Header row** [CODE] basic-app.jsx:2941-2958: left = client BrandLogo (or letter avatar) + client name (resolved from selected tree node, default Aramco [CODE] basic-app.jsx:2903-2907). Right (client view only): `BsaViewingAs` role chip ("VIEWING AS" + native select Account Owner / Node Admin / Normal User [CODE] basic-app.jsx:2755-2766) and the **Send button** — rendered **only for Normal User** ("Only a Normal User sends messages; Account Owner / Node Admin oversee & review" comment [CODE] basic-app.jsx:2949-2955). Send label switches per channel: "Send Whatsapp Message" / "Send Voice IVR Message" [CODE] basic-app.jsx:2832.
- Falcon perspective: no right-side controls at all (read/review only). [INFERRED] Falcon is implicitly read-only because the Send button block is inside `!isFalcon`.
- **Channel/mode switch side-effects**: resets page to 1, closes menus, clears search + type filter [CODE] basic-app.jsx:2797.
- **Live In-Progress ticker** [CODE] basic-app.jsx:2799-2821: every 4.5 s each `in_progress` row advances `recipientsCount` by ~6% of `targetCount` and `totalCost` proportionally, capped at ~70% of target so it never auto-completes during the demo. Details pages read a "live" resolved txn so they tick too [CODE] basic-app.jsx:2914-2915.

### S2 — Outbox / Scheduled grid (BsaMessageGrid)
- [CODE] basic-app.jsx:286-364. Panel `table-panel bsa-table-panel` (radius 14, border) [CODE] basic-app.css:52.
- **Sub-tabs**: Outbox | Scheduled underline tabs [CODE] basic-app.jsx:298-301, css:26-30.
- **Toolbar** [CODE] basic-app.jsx:302-306: search box (IcSearch + input, placeholder "Search Here ....", resets page); **static date-range chip** "Date: From    To" (calendar glyph, purely decorative — no picker, no handler); **Type filter** `BsaSelect` width 130 — options: All + (Voice: Dynamic, Static | WA: Marketing, Utility, Authentication).
- **Filtering logic** [CODE] basic-app.jsx:2827-2830: type = exact match (or 'all'); search = case-insensitive substring across `[id, sender, templateName, recipients, type].join(' ')`.
- **Table columns** [CODE] basic-app.jsx:310-325:
  1. `ID` (bsa-txnid, tabular-nums)
  2. `Sender ID`
  3. `Template Name` — voice header swaps to `IVR Name` [CODE] basic-app.jsx:291
  4. `Language` — **WhatsApp only** [CODE] basic-app.jsx:315 ('—' when null)
  5. `Type` (plain text, no chip: `.bsa-type-plain` [CODE] basic-app.css:78-79; a colored chip system `.bsa-type.mkt/util/auth/dyn/stat` exists in CSS 101-107 but is not used by the grid)
  6. `Creation Date` — two-line date/time cell `BsaDateCell` (splits on '·') [CODE] basic-app.jsx:24-33
  7. `Scheduled Date` — **scheduled tab only** [CODE] basic-app.jsx:318, 345
  8. `Recipient Count` (localized number)
  9. `Transaction Cost` — IcRiyal glyph + localized number [CODE] basic-app.jsx:347
  10. `Recipients` — `BsaRecipients` (below)
  11. `Status` — `BsaStatusPill`
  12. `Actions` — 3-dot `row-action-btn`.
- **Recipients cell** (`BsaRecipients`) [CODE] basic-app.jsx:58-118: merges `recipientsList[]` (contact groups) + `manualRecipients[]`; 0 items → '—'; 1 item → plain label; >1 → first label + dark-teal `+N` circular badge which opens a **portal popover** "All recipients (n)" (fixed-position, flips above when <200px below, closes on outside click/scroll/resize) listing each item with a group-people glyph or phone glyph [CODE] basic-app.jsx:65-66, 102-115. Reuses contact-group popover chrome `cg-shared-pop*`.
- **Row action gating** [CODE] basic-app.jsx:329-336:
  - `Details` — always.
  - `Edit` — only scheduled tab AND `status === 'scheduled'`.
  - `Cancel` (danger) — only `status === 'in_progress'`.
  - `Delete` (danger) — only scheduled tab AND `status === 'scheduled'`.
- Deleted rows stay in the grid dimmed (`.bsa-row-deleted td { opacity: .55 }`) [CODE] basic-app.jsx:338, css:70.
- **Empty state**: single row, colSpan computed `10 + (voice?0:1) + (scheduled?1:0)`, text "No transactions yet." [CODE] basic-app.jsx:292-293, 357.
- **Pagination**: shared `window.TablePagination` (defined [CODE] hierarchy.jsx:1474), page-size change resets to page 1 [CODE] basic-app.jsx:361. Default pageSize 10 [CODE] basic-app.jsx:2784.
- **Row menu** (`BsaRowMenu`) [CODE] basic-app.jsx:234-265: portal-less but `position:fixed` anchored to the trigger rect; width 152; flips up near viewport bottom; closes on outside mousedown or any scroll; supports `danger` styling + `disabled` with `disabledHint` tooltip.

### S3 — Compose (Send / Edit) takeover — `BsaCompose`
- [CODE] basic-app.jsx:693-1097; entered via Send button (`openCompose`), row Edit (`openEdit`), or from a conversation (`openComposeFor` / `openComposeChannel`) [CODE] basic-app.jsx:2836-2842.
- **Header** [CODE] basic-app.jsx:900-908: title "Send Whatsapp Message" / "Send Voice IVR Message"; actions: `Cancel` (opens confirm modal unless `fromConversation`, then returns directly) + `Send` (disabled until `canSend`) — or, in fromConversation mode, `Send & back to conversation` (enabled once a template is picked; stages `{templateId, vars, number}` back into the thread) [CODE] basic-app.jsx:903-906.
- **Layout** [CODE] basic-app.css:212-224: `.bsa-compose-main.bsa-wa-cols` = 3-column grid `1fr 1.85fr 1.15fr` (Message Details · Recipients · Preview). Each column is a `bsa-card bsa-step-card` capped at `calc(100vh - 296px)`; the numbered step header is pinned and only the body scrolls (`.bsa-step-scroll`). Compose header pinned; form area scrolls beneath [CODE] basic-app.css:140-143.
- **Numbered step headers** (`BsaStepHead`) [CODE] basic-app.jsx:219-231: teal circle number + title + subtitle; the Preview header doubles as a hide/show toggle (eye icon, keyboard accessible). When Preview is hidden the grid becomes `1fr 2.4fr auto` and a slim 56px vertical strip with the step number + eye reopens it [CODE] basic-app.jsx:1069-1074, css:215, 230-233.

**Column 1 — "Message Details"** [CODE] basic-app.jsx:912-935:
- Fields (all `BsaSelect` dropdowns): `Sender ID` (from bsaWaSenders/bsaVoiceSenders), `Category` (WA: Marketing/Utility/Authentication; Voice: Dynamic/Static [CODE] basic-app.jsx:723), `Language` (**WA only**, disabled until category, options derived from templates of that category [CODE] basic-app.jsx:724, 919), `Template Name` (disabled until category + (voice || language); placeholder "Choose Template"; options filtered by type+language [CODE] basic-app.jsx:725-726, 920).
- **Cascade resets**: changing Category clears Language + Template; changing Language clears Template [CODE] basic-app.jsx:918-919.
- Hint line: "Choose one of your pre-created, approved templates." + `Create Template` link → toast only [CODE] basic-app.jsx:922.
- **Variables chips**: when the chosen template has variables, a "VARIABLES" row lists each `{{var}}` as a monospace chip [CODE] basic-app.jsx:923-925.
- **Meta template-status sync (simulated)**: `BSA_TPL_META = { wt5: 'Paused' }`; if the picked template is not 'Approved' a warning banner shows "This template is Paused on Meta — please select another template." and `canSend` is blocked [CODE] basic-app.jsx:524-526, 734-736, 926-928, 796.
- **Delivery** block (uppercase label + clock icon): segmented control `Immediate | Schedule`; choosing Schedule reveals "Send on" + the combined `BsaDateTimePicker` (preferUp) [CODE] basic-app.jsx:842-855, 929-932.
- **Voice only — Retry Logic** (rendered inside Message Details under Delivery) [CODE] basic-app.jsx:857-897, 933: header with "Optional" tag + toggle switch; when ON: (a) "Retry when the call result is" checkbox-chips from `BSA_RETRY_STATUSES` = No Answer / Busy / Cancel / Failed (defaults: no_answer + busy [CODE] basic-app.jsx:713), (b) "Retry attempts n/3" numbered rows "Wait [number 1..1440] minutes before the next attempt" with per-row remove (hidden when only 1) and "＋ Add attempt" (disabled at max 3, appends wait:10); when OFF: helper copy "Turn on to automatically re-attempt unconnected calls…".

**Column 2 — "Recipients"** [CODE] basic-app.jsx:938-1054:
- **Locked gate**: until a template is chosen, a lock chip shows "Choose a template name first to add contact groups or recipients." [CODE] basic-app.jsx:941; the group picker + Add Recipient are disabled on `!tplId`.
- **Contact Groups** sub-section (hidden entirely in fromConversation mode [CODE] basic-app.jsx:943):
  - `Add Contact Group` button (`BsaGroupPicker`) [CODE] basic-app.jsx:172-216, 947: teal button + chevron; popover with two tabs **Created by me | Shared with me** (groups carry a `shared` flag), search input (autofocus), single-select list rows (name + member count) — clicking adds the group and closes; empty states "All groups added" / "No groups found". Disabled while `!tplId || !groupsReady` — i.e. you must finish mapping the current groups before adding another [CODE] basic-app.jsx:947.
  - **Group chips bar** [CODE] basic-app.jsx:949-960: each selected group is a chip "Name (count)" + ×; clicking the name toggles that group's mapping card (`is-mapping` = dark-teal selected state [CODE] basic-app.css:445-448); exactly ONE panel open at a time (`activePanel`), newest added group auto-opens its map [CODE] basic-app.jsx:771, 788-795, 947. Empty text "No groups selected yet".
  - **Mapping card** (per open group) [CODE] basic-app.jsx:961-996: header = building icon + name + "N contacts" + progress pill `done/need mapped` (need = 1 destination + #vars; turns teal `is-done`); guide line "Use the dropdown above each column to link it to a template field."; **Fields-to-map chips** (Destination + each `{{var}}`, hollow dot → check when mapped); **column-mapping table** (`bsa-mapx-table`): header row 1 = a `Map to…` dropdown per sheet column with options `[Destination, {{var}}…, Not mapped]` (Not mapped pinned at bottom, distinct style [CODE] basic-app.css:536-539); header row 2 = raw column names; body = 2 sample rows generated from `BSA_COL_SAMPLES` via `bsaGroupRows` [CODE] basic-app.jsx:527-534. Assignment semantics: assigning a field already used by another column **moves** it; picking Not mapped clears [CODE] basic-app.jsx:776-782. Mapped destination column is tinted teal (`is-dest`) [CODE] basic-app.css:326, 545. **Validation**: while required mapping incomplete, every unmapped column's dropdown gets a red border + red placeholder (`is-invalid`) [CODE] basic-app.jsx:980-987, css:513-515. NO auto-mapping — the user picks every column deliberately [CODE] basic-app.jsx:747 comment.
  - A read-only "Preview" table card variant exists (`isPrevOpen`/`togglePrev`, `bsa-prev-card`) [CODE] basic-app.jsx:786-787, 997-1014 — **no UI element invokes `togglePrev`; dead path** (verified by grep: only the definition exists).
- **Manual Recipients** sub-section [CODE] basic-app.jsx:1018-1052:
  - Header "Manual Recipients" (fromConversation: "Recipient") + count "n Recipients" + `＋ Add Recipient` button — disabled when `!tplId`, at `MAX_MANUAL = 3`, or when the current rows are incomplete (`manualComplete`: every row needs destination + every template var filled) with tooltip "Fill the current recipient's destination and variables first" [CODE] basic-app.jsx:716, 754-756, 761, 1025. At max the button label appends "· max 3".
  - Table: `Destination` column (borderless-until-hover input, placeholder "Phone, email, or username") + one column per `{{var}}` (placeholder = prettified var name) + trailing remove-× column [CODE] basic-app.jsx:1028-1051. No format validation on destination (free text).
  - fromConversation prefill: the conversation recipient's number is split into `{phoneCountry, phone}` via `bsaSplitNum` against the shared `COUNTRIES` dial table [CODE] basic-app.jsx:50-57, 705.
- **Recipient count** = sum of selected groups' `count` + valid manual rows [CODE] basic-app.jsx:757.

**Column 3 — "Preview"** [CODE] basic-app.jsx:1056-1074:
- WhatsApp → `BsaPhonePreview` [CODE] basic-app.jsx:448-469: iPhone mockup — frame is an SVG image overlay (`assets/iphone-frame.svg`, transparent screen cut-out, `.bsa-phone-frame` z-index 3 above content) [CODE] basic-app.css:604-616; screen bg #efe7df with dot-grid; "Today" chip; message bubble = optional bold title, body (supports `*bold*` inline via `bsaFmt` [CODE] basic-app.jsx:369-372), optional footer, fixed time stamp "13:54 ✓✓", optional CTA button row. Empty state: "Choose a template to view its content."
- Live variable substitution (`previewVals`) [CODE] basic-app.jsx:798-810: first selected group → its first sample sheet row through the column map, falling back to `BSA_SAMPLE` values; else first valid manual recipient's typed var values; `bsaSubst` fallback samples (Ahmed / Ali / 482913 / TKT-2048 / 1,500 / 02-Jul-2026) [CODE] basic-app.jsx:367.
- Voice → **no phone mockup**: read-only IVR flow canvas `window.TplIvrStep2` (readOnly + inspect) inside `.bsa-ivr-flow`, seeded by matching `seedTemplates` entry whose `ivr.type` equals the template's type (Dynamic/Static), else the first IVR seed [CODE] basic-app.jsx:730-732, 1061-1064. Empty text "Select a template to preview its IVR flow."

**Bottom summary strip** [CODE] basic-app.jsx:1077-1090, css:244-304: full-width teal band, 3 divided tiles: **Message Summary** (Template · Language (WA) · Category), **Estimated Recipients** (count + "From N group(s)" badge), **Date & Time** (Immediate, or `dd MMM yyyy · hh:mm AM`).

**Send gating** [CODE] basic-app.jsx:796: `canSend = sender && tplId && tplApproved && (selGroups.length > 0 || manualValid.length > 0) && groupsReady`. Note `manualComplete` (vars filled) is NOT part of canSend — it only gates adding another manual row. [INFERRED] a manual row with destination but empty vars can be sent.

**S3a — Send confirmation overlay** (`BsaSendConfirm`) [CODE] basic-app.jsx:471-507:
- Portal over `vis-warn-overlay`; paper-plane icon; title "Confirm & send"; copy: "The cost below is an estimate based on your recipients, template category, and active contract. Your balance is charged at send time."
- KPI panel: **Recipients** (count) | divider | **Estimated cost** (IcRiyal + `recipients × costPerMsg`), where `costPerMsg = 2.5` (WA) / `4` (voice) [CODE] basic-app.jsx:758.
- **"Allow duplicate recipients"** toggle switch, default OFF [CODE] basic-app.jsx:473, 494-498. The chosen value is passed to `onConfirm({allowDup})` but **discarded** by `doSend` [CODE] basic-app.jsx:812-820.
- Buttons: Cancel / "Confirm & Send".

**S3b — Compose-cancel confirm** [CODE] basic-app.jsx:1094: danger dialog "Are you sure you want to cancel this message?" body "You haven't sent this message yet. If you cancel now, everything you've entered will be lost." buttons "Keep editing" / "Yes, cancel".

**Post-send behavior** (`onSent` in page) [CODE] basic-app.jsx:2846-2865: builds a new txn `TXN-{100600+count}`, `createdAt` hardcoded `'27-Mar-2025 · 03:xx pm'`, records group names + dialed manual numbers, `status = scheduled ? 'scheduled' : 'in_progress'`, `scheduledAt` **hardcoded** `'20-Jul-2026 · 09:00 am'` when scheduled (the picked date/time is ignored in the stored record); prepends to the matching list; auto-switches sub-tab; toast "Transaction scheduled ✓" / "Transaction submitted — now processing ✓". **`data.retry` is received but never stored on the txn.**

**Edit mode** [CODE] basic-app.jsx:699-706: `editRow` prefills sender + templateId + `selGroups = ['cg1']` (**hardcoded**, not the row's real groups) + timing from `scheduledAt`; category/language are NOT restored (template dropdown stays disabled until re-cascading); `schedDate/schedTime` not parsed from the row. Sending creates a NEW transaction — the edited scheduled row is not replaced. [INFERRED] Edit is visually present but functionally a "compose again" stub.

### S4 — WhatsApp transaction Details takeover — `BsaDetails`
- [CODE] basic-app.jsx:1173-1360. Entered via row Details.
- **Header** [CODE] basic-app.jsx:1223-1244: square back-icon button; title = template name + `BsaStatusPill`; sub-row: calendar icon + createdAt · tag icon + type · txn id. Right: `Export Details` (secondary) + `Export Statistics` (primary) — **toast only**.
- **Status banners** [CODE] basic-app.jsx:1246-1249:
  - `failReason` banner (partial/canceled/failed rows) — tinted per status: canceled grey, partial orange, failed red, default amber [CODE] basic-app.css:779-783.
  - Deleted banner (trash icon): "Deleted — this scheduled transaction was deleted and will not be sent. No statistics or costs will be generated."
  - Scheduled banner (clock icon, blue): "Scheduled — this transaction is set for {scheduledAt}. It hasn't been sent yet, so delivery statistics, rates, and costs will appear here once it's processed."
  - In-Progress banner (pulsing dot, blue): "{processed} of {planned} recipients processed so far…" + live progress bar.
- **Per-status view logic** [CODE] basic-app.jsx:375-386: `bsaStatusView` — failed / scheduled / deleted → `stats:false, breakdown:false, costEstimated:true` (charts render as grey stubs with '—'); otherwise stats + breakdown; `processing` when in_progress. Header figures: failed shows `plannedCount` / `estimatedCost`; others show processed `recipientsCount` / `totalCost` [CODE] basic-app.jsx:385-386. "of N" planned subtext when in_progress/partial/canceled and planned > processed [CODE] basic-app.jsx:1192-1193, 1253.
- **KPI row** (3 tiles): Sender ID · Total Recipients (+ "of N") · Recipients (reuses `BsaRecipients` popover) [CODE] basic-app.jsx:1251-1255.
- **Overview Stats card** [CODE] basic-app.jsx:1259-1284: sub "Engagement rates — delivery, read, played, seen, failed & reply"; legend chips; 6 vertical gradient bars with % on top and count below: Delivered / Read / Played / Seen / Failed / Reply; dashed gridlines at 0/25/50/75/100; bars animate from 0 on mount (`chartIn` 40 ms timeout) [CODE] basic-app.jsx:1176-1177, 1274. Rates come from `bsaStatsFor` [CODE] basic-app.jsx:387-412 — deterministic demo figures: sent 98.3%, delivered 94.7%, read 76.1% of total, readRate = read/delivered, played 68, seen 72, failed 5.3, reply 45% of read; avgDeliveryTime '4.2s' (computed but not displayed anywhere — ABSENT from UI).
- **Cost Breakdown card** [CODE] basic-app.jsx:1285-1314: two items — "Cost of messages sent" (IcRiyal + total) and "Average cost of a message" (cost/total, 2 dp); **By destination**: `BsaDonut` (centered total + 'SAR') + ranked list rows (color dot · country · SAR value · %) — WA data fixed at Saudi Arabia 82% / Jordan remainder [CODE] basic-app.jsx:400-410.
- **Recipients Details table** [CODE] basic-app.jsx:1319-1350: columns Recipient Number · Status · Send Date · Delivery Date · Status Date · Reply · Message Cost · Actions. Status pills (`BSA_RSTATUS`): Read/Delivered/Sent/Pending/Played/Seen/Failed [CODE] basic-app.jsx:441-446; missing dates render muted `---`; Reply column shows a green `↩` when `replied`; row click selects (`bsa-recip-sel` teal tint) which drives the side preview; own pagination (10/page); sticky header inside a 430px scroll region [CODE] basic-app.css:822-824.
  - Row generation `bsaRecipientsFor` [CODE] basic-app.jsx:414-439: bounded sample `min(count, 24)`; per-row status from `BSA_RDIST` cycle; scheduled → all pending/no dates; failed → all failed; timestamps derived from createdAt shifted by minutes (deterministic seconds via `bsaShiftTime` [CODE] basic-app.jsx:1398-1405); per-message cost = totalCost/count.
  - Row action menu: single item `Conversation` — disabled with hint "No conversation for scheduled or deleted messages" when txn scheduled/deleted [CODE] basic-app.jsx:1340.
  - Empty state: failed → "No records were processed — the transaction was aborted before any messages were sent."; else "No recipients to show." [CODE] basic-app.jsx:1345.
- **Preview card (right)** [CODE] basic-app.jsx:1351-1354: header "Preview" + selected recipient number chip; `BsaPhonePreview` of the SELECTED recipient's message — variables filled from per-recipient sample pools `BSA_RVALS` (`bsaRecipVal(var, index)`) [CODE] basic-app.jsx:512-519, 1216-1219.
- **Ask AI drawer** (`BsaAskAI`) [CODE] basic-app.jsx:1125-1171, 1357: opened by the app-header "Ask AI" button through the `window.falconAskAI.handler` contract — the details page registers a handler on mount and blocks it for scheduled/deleted txns [CODE] basic-app.jsx:1183-1188; app-side registry [CODE] app.jsx:139-149. Right-side drawer (`drawer` chrome, 420px): title "Ask AI" + sparkle badge, sub "templateName · id"; message list seeded with a status-aware `aiSummary` (failed / scheduled / processed variants [CODE] basic-app.jsx:1209-1213); suggested-question chips ("Summarize this transaction", "Why are some messages still pending?", "How can I improve the read rate?"); input + round send. Canned keyword answers (scheduled/fail/read/pending/cost regexes) [CODE] basic-app.jsx:1132-1140. Escape closes.

### S5 — Voice (IVR) transaction Details takeover — `BsaVoiceDetails`
- [CODE] basic-app.jsx:1903-2161. Same header / exports / banners / KPI row as S4 (voice-worded scheduled + processing copy: "recipients dialed so far") [CODE] basic-app.jsx:1949-1983.
- **Call Statistics card** [CODE] basic-app.jsx:1986-2011: bars **Answered / Busy / No Answer / Failed** (failed aggregates failed+unreachable+canceled+dropped) computed from the sample recipient set by `bsaVoiceStats` [CODE] basic-app.jsx:1444-1480; two stat tiles with hover tooltips: **IVR Completion %** (answered calls that completed the tree) and **Avg. Duration s**; bars min-height 1.5% so tiny values stay visible [CODE] basic-app.jsx:2003.
- **Cost Breakdown card** [CODE] basic-app.jsx:2012-2046: 4 cost items each with a ⓘ `BsaCostInfo` hover tooltip [CODE] basic-app.jsx:624-630, css:764-770 — **Total Cost** (IcRiyal), **Average Cost** (per answered call), **Total Seconds**, **Average Seconds**; **By destination** donut built from recipients' dial codes via `BSA_DIAL_COUNTRY` (9 GCC/regional codes, 'Other' fallback), sorted desc, rounding drift absorbed into the largest segment so the donut equals Total Cost exactly [CODE] basic-app.jsx:1379-1385, 1466-1471; **By retry attempt**: 3 progress rows (Attempt 1/2/3, value + % of total, scaled by `costProg` for partial runs) [CODE] basic-app.jsx:2036-2044.
  - Sample-to-campaign scaling: the ≤24-row sample's costs are scaled up so breakdown totals agree with the outbox Transaction Cost [CODE] basic-app.jsx:1455-1465.
- **Recipients Details table** [CODE] basic-app.jsx:2052-2124: header adds a **Filter chip** (funnel icon → toast only). Columns: expander caret · Recipient Number · Status · Attempts (count badge; teal `multi` variant when >1) · Status Date · Duration · Actions.
  - **Voice status set** `BSA_VSTATUS` [CODE] basic-app.jsx:1363-1376: Pending, Sent, Ringing, Live, Answered, No Answer, Busy, Unreachable, Initiator Dropped, Canceled, Failed — full SIP-mapped lifecycle; pill colors + tinted bg per status [CODE] basic-app.css:1277-1289.
  - **Expandable attempts row**: caret rotates, expands a nested "Delivery attempts" table — Attempt # (teal circle) · Status · Time (— for queued) · Wait ('n min' or —) · Cost (IcRiyal or —) [CODE] basic-app.jsx:2087-2115.
  - Row click selects the recipient (`bsa-recip-sel`) → drives the right canvas card [CODE] basic-app.jsx:2073, 1933-1935.
  - Row action: `Conversation` (disabled for scheduled/deleted) [CODE] basic-app.jsx:2082-2084.
  - Empty state failed: "No calls were placed — the transaction was aborted before any records were processed."
  - **Row generation** `bsaVoiceRecipientsFor` [CODE] basic-app.jsx:1406-1443: ≤24 rows; scheduled → all pending single-attempt; failed txn → all `['failed']`; **in_progress leads with one example of every lifecycle status** (BSA_VLIFECYCLE pending→sent→ringing→live→answered→busy→no_answer→unreachable→dropped→canceled→failed) then realistic retry plans `BSA_VPLANS`; attempt waits 0/5/10 min; per-attempt cost formula: answered = 3×rate, live = 2×, busy/no_answer/unreachable/dropped = 1×, else 0 [CODE] basic-app.jsx:1397; duration only for answered/live; `completed` flag ~75% of answered; an `options` array (IVR key levels) is generated **but never rendered** (legacy keypad UI removed — CSS `.bsa-keypad`, `.bsa-opt-levels` remain [CODE] basic-app.css:1301-1306).
- **IVR Canvas Preview card (right)** [CODE] basic-app.jsx:2126-2154: header + selected recipient number chip; hint "Tap any node to play its prompt"; read-only `TplIvrStep2` canvas; below it, for the selected recipient: **Call description** (prose from `bsaRecipDesc` — status-specific sentences incl. navigated path + duration [CODE] basic-app.jsx:1610-1631) and **Transcript** (per walked node: IVR chip + node label, spoken text from `bsaNodeTranscript` joining recording transcripts + inlined variable sample values [CODE] basic-app.jsx:1602-1609, data:121-173, plus pressed-key line with keycap).
  - IVR walk is deterministic per recipient: `bsaIvrWalk(nodes, seed)` picks the child `(seed + depth) % kids.length` at each menu, max depth 6 [CODE] basic-app.jsx:1563-1577.
- **Voice Call Preview modal** (`BsaVoicePreview`) [CODE] basic-app.jsx:1505-1560, 2157: header (phone icon, "Voice Call Preview", number · duration, status pill, close); fake player (play → toast "Playing recorded call…", disabled if not answered; waveform; "Recorded call"/"No recording for this call" + duration); answered → Duration + Outcome tiles ("Transferred to agent" / "Recipient hung up"), IVR canvas, "View full conversation" button; not answered → amber note. **ORPHANED: `setPreviewId` is never called with an id anywhere — the modal is unreachable in the current build** (verified by grep: only declaration :1908 and onClose :2157).
- **Ask AI** — same drawer with voice suggestions ("Why did some calls fail?", "How can I improve the answered rate?") and voice-worded summaries [CODE] basic-app.jsx:1937-1941, 2158.
- `BSA_VOICE_STATS` (IVR paths/behavior/perf demo data) is defined [CODE] basic-app.jsx:1482-1486 and assigned to `vs` :1927 but **never rendered** — the "IVR Options Summary" boxes exist only in CSS (`.bsa-ivr-opts-grid`, `.bsa-path-row`, `.bsa-barchart` [CODE] basic-app.css:1257-1270, 1343-1350). Dead data + dead CSS.

### S6 — WhatsApp Conversation takeover — `BsaConversation`
- [CODE] basic-app.jsx:2371-2706. Entered from a WA details recipient row → Conversation.
- **Topbar** [CODE] basic-app.jsx:2545-2554: circular Back button; meta "Message Name: X" / "Created Date: Y"; right: underlined demo link "Simulate expiry" ⇄ "Reopen window" toggling the 24-hour-window `expired` state.
- **Left panel — Message Info** [CODE] basic-app.jsx:2559-2571: rows Sender, Type; separator; green info block (`bsa-cv-info-block` #e9f3ee) with Created / Send / Delivery / Read Date rows (Read row carries blue double-ticks). When a message's ⓘ action is clicked, the block mirrors THAT message (sender summary + 'Show transaction' link to clear; dates = message time, +1 min delivery, +2 min read, date 'Oct 6, 2025') [CODE] basic-app.jsx:2437-2440, 2530-2540. Deterministic seconds appended to times (`withSec`) [CODE] basic-app.jsx:2530.
- **Thread header** [CODE] basic-app.jsx:2575-2592: "Conversation" + chevron + avatar + "Recipient Number: X" + **in-conversation search** pill: match count "i/n" (or red "No results"), prev/next chevrons (Enter / Shift+Enter navigate; Escape clears), clear ×; matches highlighted with `<mark class="bsa-cv-hl">`, current match gets a stronger highlight + teal ring on the bubble, auto scroll-into-view [CODE] basic-app.jsx:2462-2480, css:1039-1054. Searchable fields per message: text, title, caption, fileName, footer, button [CODE] basic-app.jsx:2463.
- **Thread body** [CODE] basic-app.jsx:2595-2621: day divider "Oct 6, 2025"; **first message is the ACTUAL sent template** rendered as a template-card bubble (title/body/footer/button from `bsaWaTemplateBodies`, substituted) [CODE] basic-app.jsx:2375-2382; then the seeded sample thread (`bsaSampleConversation`) demonstrating every message kind: text, big-emoji, image (gradient placeholder + caption), voice note (playable fake waveform, wall-clock timer that survives re-renders [CODE] basic-app.jsx:2209-2245), document (T2-branded thumb + red PDF chip + name/meta), reactions.
  - OUT messages right-aligned: sender line "Aramco-Marketing-Office Management- **Jawad Lababneh**", white bubble, delivery ticks (`BsaTicks`: none pending/sending; single = sent; double grey = delivered; double blue #34b7f1 = read [CODE] basic-app.jsx:2165-2175), agent avatar. IN messages left: number + tinted bubble with teal left border, customer avatar.
  - **Hover actions per bubble** [CODE] basic-app.jsx:2437-2460: OUT = [react, reply(forward icon + 'Forward' title), info] / IN = [info, reply, react] — mirrored so info is always nearest the bubble. Reply sets a quote bar; react opens the 6-emoji picker (👍 ❤️ 😂 😮 🙏 🔥, toggle badge on bubble corner); info pins the message into the left panel. Reply + react are disabled when the window is expired.
- **Footer (window open)** [CODE] basic-app.jsx:2624-2690:
  - **Customer-support-window countdown**: boxes HH:MM:SS with labels Hours/Minutes/Seconds + "Time remaining for the Customer Support Window". Values are **static demo constants 22:30:15** [CODE] basic-app.jsx:2398 — no ticking interval. Compact by default; enlarges (`is-final`) only when hours < 1 [CODE] basic-app.jsx:2627, css:1158-1163.
  - Reply-quote bar (name + snippet + cancel ×).
  - **Staged template bar**: when returning from "Send & back to conversation", the composed template renders as a ready-to-send card with substituted variables + discard × + Send (sends as a template bubble, toast "Template message sent ✓") [CODE] basic-app.jsx:2426-2431, 2644-2657.
  - **Recording composer**: mic → live state (trash cancel, pulsing red dot, mm:ss timer, waveform, red stop button) → stopped preview (play + waveform + duration, Send sends a voice bubble) [CODE] basic-app.jsx:2400-2405, 2432, 2658-2673.
  - **Normal composer**: emoji button → 16-emoji popover appending to draft; attach button → popover Photo / Document (each sends a placeholder bubble + toast); text input "Type message ..." (Enter sends); mic; **tplAdd button** ("Send new message template") → `onSendTemplate` → opens the compose takeover in fromConversation mode; teal round Send [CODE] basic-app.jsx:2674-2688.
- **Footer (window expired)** [CODE] basic-app.jsx:2691-2699: amber alert "The 24-hour support window has expired — send a Template Message to continue." + dark button "Send New Message Template" (same route). Thread actions disabled as above.
- **BsaSendTplModal** [CODE] basic-app.jsx:2251-2369, mounted :2703 — "Send new message template" modal with locked Sender/Category/Language + template picker, per-group Field→Column mapping table (destination locked, vars auto-mapped via `bsaAutoCol`/`bsaAutoMobile` [CODE] basic-app.jsx:522-523, 2267-2270), locked manual numbers + var inputs, live phone preview, Send gated on all vars mapped. **ORPHANED: `tplModal` is never set true** — superseded by the fromConversation compose takeover (verified by grep: only `useState(false)` :2372 and `setTplModal(false)` :2703).
- Back → returns to Details if a txn is active, else list [CODE] basic-app.jsx:2924.

### S7 — Voice Conversation takeover — `BsaVoiceConversation`
- [CODE] basic-app.jsx:1759-1901. Entered from voice details recipient → Conversation (also wired from the orphaned voice preview modal).
- **Topbar**: back circle; Message Name / Created Date; right: the recipient's voice status pill [CODE] basic-app.jsx:1791-1798.
- **Left panel — Call Info** [CODE] basic-app.jsx:1801-1814: Sender ID, Recipient Number, Type, Status pill; separator; Send Date, Status Date, Duration, Outcome ("Transferred to agent" / "IVR call" / status label).
- **Thread** [CODE] basic-app.jsx:1816-1884:
  - Header: "Conversation" + avatar + Recipient Number + right-aligned sub ("IVR call · 0:XX" or "call did not connect").
  - **Not answered** → empty-state card: phone-off icon, "No conversation to show", "This call was {Status} — the recipient never reached the IVR menu, so there are no prompts or key presses to display."
  - **Answered** → day chip; amber note "Call connected — the recipient navigated the IVR menu below."; then per IVR-walk step:
    - OUT bubble (right, business side): sender "Aramco-Marketing-Office Management- **IVR System**"; node label with teal IVR chip; **playable voice note** (`BsaVoiceNote` — waveform fills + timer counts up while playing [CODE] basic-app.jsx:1580-1600); **Transcript** block (label + spoken text with dynamic variable values inlined from the seed template's variables); **menu option list** (keycap + label per child, the pressed one highlighted teal) [CODE] basic-app.jsx:1841-1859.
    - IN bubble (left, recipient): big DTMF keycap + "Pressed **N** — label" [CODE] basic-app.jsx:1861-1875.
  - Ending: red "call ended" note (hang-up / return-to-menu terminals, exact text per terminal type [CODE] basic-app.jsx:1778-1781) **or**, when the last node's terminal is `transfer` → **AI-agent handoff**.
- **AI handoff** (`BsaAiHandoff` + `useBsaHandoff`) [CODE] basic-app.jsx:1657-1757:
  - Channel divider chip — WhatsApp (green #25d366) or Instagram (gradient) — chosen deterministically from bit 1 of the recipient seed so both appear across recipients [CODE] basic-app.jsx:1641-1643, css:949-951.
  - Note "Call ended — conversation continued with **Falcon AI Assistant** on {channel}".
  - Scripted chat by intent — billing / travel / appointment / banking / support — derived from template/IVR name regexes (`bsaAiIntent` [CODE] basic-app.jsx:1632-1639) against `bsaAiHandoff` scripts [CODE] basic-app-data.jsx:179-223. AI bubbles right with "AI" tag (tinted; Instagram = gradient bubble with white text [CODE] basic-app.css:972-974); customer bubbles left.
  - Per-message actions: info (toast), reply (quote), react (6-emoji picker) [CODE] basic-app.jsx:1680-1689.
  - Live composer in the pinned footer: reply-quote bar + input "Reply on WhatsApp/Instagram …" + Send — appends 'me' messages to the thread (state shared via the `useBsaHandoff` hook because bubbles render in the body and the composer in the footer) [CODE] basic-app.jsx:1659-1675, 1690-1705.
  - Closing chip: "✓ Resolved by the AI assistant — no human agent required."
- **Footer (no handoff)** [CODE] basic-app.jsx:1885-1896: two large actions — "Send Whatsapp Message" (secondary, WA glyph) and "Send Voice IVR Message" (primary, phone glyph) → `openComposeChannel(ch, recipient)`: switches channel and opens compose with the recipient prefilled [CODE] basic-app.jsx:2840-2841.
- Escape backs out [CODE] basic-app.jsx:1771.

### S8 — Confirm dialogs (`BsaConfirm`, shared `vis-warn-*` chrome)
- [CODE] basic-app.jsx:267-283 — portal overlay, warning triangle (red tint when `danger`), title + body + secondary/primary buttons; overlay mousedown cancels.
- **Cancel transaction** [CODE] basic-app.jsx:2972-2979: title "Cancel this transaction?"; dynamic body naming the txn id, "(X of Y recipients processed so far)", explains stop-at-next-batch semantics, kept+charged vs excluded+not-charged, and the race caveat ("if the engine finishes every recipient before your cancellation takes effect, the transaction completes normally — you'll be told which outcome occurred"). Confirm = danger "Cancel Transaction".
- **Cancel execution** (`applyCancel`) [CODE] basic-app.jsx:2867-2891: re-reads the LIVE row (ticker may have advanced while the dialog was open); race lost (no longer in_progress or processed ≥ target) → force status completed at full target/cost + toast "Too late to cancel — the transaction had already finished…"; else → status `canceled`, keeps processed count + cost (or `sent × rate`), writes a detailed `failReason`, toast with kept/not-charged figures.
- **Delete scheduled** [CODE] basic-app.jsx:2980-2987: title "Delete this scheduled transaction?", body 'This scheduled transaction will be ignored and listed with status "Deleted". This cannot be undone.'; `applyDelete` maps status → 'deleted' (row remains, dimmed) + toast [CODE] basic-app.jsx:2892-2897.

### S9 — Send confirmation overlay — covered in S3a.
### S10 — Ask AI drawer — covered in S4/S5.

**ABSENT screens** (nothing in code): standalone export menu/dropdown (single toast buttons only), template-creation screen, contact-group creation screen, sender-ID management, settings, notification center, and any URL-routed sub-pages.

---

## 2. COMPONENT + PATTERN CATALOG

### 2.1 Internal components (all in basic-app.jsx)
| Component | Lines | Purpose |
|---|---|---|
| `BSA_STATUS` + `BsaStatusPill` | 9-22 | txn status pill (dot + label), i18n via `t['bsaStatus_'+status]` |
| `bsaStamp` + `BsaDateCell` | 24-33 | two-line date/time cell from `'date · time'` string |
| `bsaTypeCls` | 36-44 | type→chip class (unused by grid; chips CSS exists) |
| `BsaSar` | 47 | riyal glyph fallback (IcRiyal or 'SAR') |
| `bsaDial` / `bsaSplitNum` / `bsaRecipientParts` / `bsaRecipientRich` | 50-63 | phone/dial helpers, recipients merging |
| `BsaGroupGlyph` / `BsaPhoneGlyph` | 65-66 | popover row icons |
| `BsaRecipients` | 68-118 | first label + `+N` badge + portal popover |
| `BsaCountUp` | 121-140 | eased count-up number — **defined, never used (dead)** |
| `BsaSelect` | 143-169 | lightweight dropdown (button + absolutely positioned pop, outside-click close, `is-disabled`, option `cls`) |
| `BsaGroupPicker` | 172-216 | Add-Contact-Group popover (mine/shared tabs + search + single-select) |
| `BsaStepHead` | 219-231 | numbered step header, optional toggle (eye) |
| `BsaRowMenu` | 234-265 | fixed-position 3-dot menu w/ flip + disabled items |
| `BsaConfirm` | 267-283 | warning confirm modal (vis-warn chrome) |
| `BsaMessageGrid` | 286-364 | outbox/scheduled table |
| `bsaSubst` / `bsaFmt` | 367-372 | `{{var}}` substitution + `*bold*`/newline renderer |
| `bsaIsScheduled` / `bsaStatusView` / `bsaHeadRecipients` / `bsaHeadCost` / `bsaStatsFor` | 375-412 | per-status details logic + WA stats |
| `BSA_RDIST` / `BSA_RNUMS` / `bsaRecipientsFor` / `BSA_RSTATUS` | 415-446 | WA recipient sample generator + status pills |
| `BsaPhonePreview` | 448-469 | iPhone WhatsApp bubble preview |
| `BsaSendConfirm` | 471-507 | pre-send confirm (recipients/cost/dup toggle) |
| `BSA_SAMPLE` / `BSA_RVALS` / `bsaRecipVal` / `bsaPretty` / `bsaFmtDate` / `bsaAutoCol` / `bsaAutoMobile` / `BSA_TPL_META` / `bsaTplMeta` / `BSA_COL_SAMPLES` / `bsaColSample` / `bsaGroupRows` | 510-534 | preview samples, auto-map helpers, Meta status sim, sheet-row samples |
| `BsaTimePicker` | 538-614 | clock-dial time picker (editable HH/MM, AM/PM, dial, Cancel/OK, flip-up) — used only by the orphaned `timeControl` |
| `BSA_RETRY_STATUSES` / `BsaCheck` / `BsaCostInfo` | 617-630 | voice retry chips, checkmark, ⓘ tooltip |
| `BSA_MONTHS` / `BSA_DOW` / `bsaSameDay` / `BsaDateTimePicker` | 633-690 | combined calendar+time picker (month nav, today ring, steppers ±1h/±5min, AM/PM, Clear/Done, flip-up) |
| `BsaCompose` | 693-1097 | the whole compose wizard |
| `BsaStatBar` | 1100-1105 | vertical stat bar — **dead** |
| `BSA_DICONS` / `BsaSparkle` | 1108-1123 | detail-page line icons + AI sparkle |
| `BsaAskAI` | 1126-1171 | AI drawer |
| `BsaDetails` | 1173-1360 | WA details |
| `BSA_VSTATUS` / `BSA_VNUMS` / `BSA_DIAL_COUNTRY` / `bsaCountryOf` / `BSA_DEST_COLORS` / `BSA_VPLANS` / `BSA_RETRY_WAITS` / `BSA_VLIFECYCLE` / `BSA_VINFLIGHT` / `bsaVAttemptCost` / `bsaShiftTime` / `bsaVoiceRecipientsFor` / `bsaVoiceStats` | 1363-1480 | voice model + stats |
| `BSA_VOICE_STATS` | 1482-1486 | IVR insight demo data — **dead** |
| `BsaDonut` | 1488-1501 | SVG donut with centered total |
| `BsaPlay` | 1502 | play glyph — **dead** |
| `BsaVoicePreview` | 1505-1560 | recorded-call modal — **unreachable** |
| `bsaIvrKids` / `bsaNodeDur` / `bsaIvrWalk` | 1563-1577 | IVR tree walk |
| `BsaVConvWave` / `BsaVoiceNote` | 1578-1600 | waveforms / playable IVR note |
| `bsaNodeTranscript` / `bsaRecipDesc` / `bsaAiIntent` / `bsaChannelFor` / `bsaAddMin` / `BsaChanIcon` | 1602-1655 | transcripts, call description, handoff routing |
| `useBsaHandoff` / `BsaAiHandoff` | 1662-1757 | AI handoff chat (hook + chat/foot parts) |
| `BsaVoiceConversation` | 1759-1901 | voice conversation |
| `BsaVoiceDetails` | 1903-2161 | voice details |
| `BsaTicks` / `BsaAvatar` / `BsaCvIc` / `BSA_REACTIONS` / `BSA_EMOJIS` / `BSA_WAVE` / `bsaDurToSec` / `BsaCvVoiceNote` | 2165-2245 | conversation primitives |
| `BsaSendTplModal` | 2251-2369 | send-template modal — **unreachable** |
| `BsaConversation` | 2371-2706 | WA conversation |
| `BsaViewPicker` | 2709-2734 | perspective picker |
| `BsaClientsRail` | 2737-2752 | Falcon clients rail — **dead** (Falcon view renders the full TplOrgTree instead) |
| `BsaViewingAs` | 2755-2766 | role chip |
| `BasicApplicationPage` | 2769-2990 | page shell + state machine |

### 2.2 Shared/external primitives consumed
- `window.TplOrgTree` — org-tree rail [CODE] templates-shared.jsx:45, exported :316.
- `window.TablePagination` — grid footer pager [CODE] hierarchy.jsx:1474.
- `window.DatePicker` — calendar (used only in the orphaned `timeControl`) [CODE] apps.jsx:171.
- `window.TplIvrStep2` — read-only IVR canvas [CODE] templates-ivr.jsx:319, exported :1920; invoked with `readOnly={true} inspect={true}` and a no-op `setData`.
- `window.seedTemplates` — IVR seed templates (nodes/variables) [CODE] templates-data.jsx:618.
- `window.findNode`, `BrandLogo` [CODE] data.jsx:179, 181.
- `COUNTRIES` dial table [CODE] otp-verify.jsx:369.
- Icons (globals from icons.jsx via Object.assign :121+): `IcRiyal`(:81), `IcSearch`, `IcInfo`, `IcEdit`, `IcClose`, `IcTrash`, `IcMore`, `IcArrowLeft`, `IcDownload`, `IcBuildingS`, `IcChevronRight`, `T2Mark`(:114).
- `window.falconAskAI` handler registry [CODE] app.jsx:143-149.
- Shared CSS chrome reused: `status-badge` (pill base), `row-menu`/`row-menu-item` (+ `cg-danger-item`), `cg-shared-pop*` (contact-group share popover), `vis-warn-overlay/modal/ic/title/msg/actions` (warning modal), `meta-confirm-del` (danger confirm button), `drawer`/`drawer-overlay` (Ask AI), `btn btn-primary/btn-secondary`, `table-panel`/`table-scroll`/`table-footer`, `templates-page`/`content-panel`/`content-body`, `tpl-picker-*`, `clients-panel vs-clients-rail vs-rail-*` (dead rail), `wb-tb-viewing`/`wb-role-chip` (wallet "Viewing as" chip), `ivr-edit-canvas is-readonly td-ivr-flow`, `otp-phone-wrap` (CSS hook only).

### 2.3 CSS conventions & patterns
- **Prefix**: every BSA class starts `bsa-`; conversation sub-namespace `bsa-cv-*`; voice conversation `bsa-vconv-*`; date-time picker `bsa-dtp-*`; time picker `bsa-tp-*`; mapping `bsa-map*/bsa-mapx-*`.
- **Tokens** (CSS custom properties, no hard theme file in BSA): `--teal` (primary, ~#0d3f44 family), `--teal-hover` (#0a3338 fallback), `--border`, `--border-2`, `--text`, `--text-muted`, `--bg-hover`, `--green-bg`, `--clients-w`. Frequent literal accents: dark-teal #0d3f44 / #0e3f44 / #104c54 / #16302c, tint families #eef5f3/#e9f5f1/#e6f2ec, table head #F5F5F5, mapping head #F3F8F5.
- **Tabs**: underline style with 2px teal bottom border, `-1px` margin-bottom trick; identical for channel tabs, sub-tabs, group-picker tabs [CODE] basic-app.css:14-16, 28-30, 419-421.
- **Tables**: mirror the Organization Hierarchy users-table exactly — 60px header height, #F5F5F5 head, 13px/500 muted headers, 16px/14px cell padding, row hover #fafbfb, horizontal scroll only on the wrapper [CODE] basic-app.css:60-69.
- **Takeover**: `.bsa-takeover` = white card, margin 16, radius 16, own scroll [CODE] basic-app.css:135.
- **Status pill colors** [CODE] basic-app.css:109-124]:
  - Completed `#e7f6ee`/`#0f7a3a`, dot `#1aab5a`
  - In Progress `#e8f1fe`/`#1d5fc4`, dot `#3b82f6`
  - Partially Processed `#fff4e6`/`#c46a00`, dot `#f08c00`
  - Failed `#ffeded`/`#a1191d`, dot `#d92d20`
  - Canceled `#f1f3f5`/`#5a6470`, dot `#adb5bd`
  - Scheduled `#fff8e1`/`#a67c00`, dot `#f2b705`
  - Deleted `#f1f3f5`/`#868e96`, dot `#ced4da`
- **WA recipient status pills** [CODE] basic-app.css:826-829]: Read #e7f6ee/#0f7a3a · Delivered #e6f7f3/#0d7a72 · Sent #e8f1fe/#1d5fc4 · Pending #fff4e6/#c46a00 · Failed #ffeded/#a1191d · Played #efecfb/#6d52d6 · Seen #e7f3fb/#1f77b8.
- **Voice status colors** [CODE] basic-app.css:1277-1289]: answered #0d7a72 · no_answer #c46a00 · failed #d92d20 · pending #0f7a3a · busy #a67c00 · sent #2f6fed · ringing #6d52d6 · live #0f9d58 · unreachable #9a4d4d · dropped/canceled greys; each with a tinted bg in tables.
- **Chart bars**: gradient fills s1..s6 (dark-teal → mid-teal → light-teal → amber → red → blue) and voice va/vn/vp/vr/vf; dashed gridlines; % labels above bars; `is-empty` grey stubs for no-data [CODE] basic-app.css:707-725, 739-743.
- **Destination palette** `BSA_DEST_COLORS` = ['#0d3f44','#1f7a6d','#3fa796','#7bc4b4','#e0a458','#c0613f','#9a4d6e','#5a6470','#b0b8bd'] [CODE] basic-app.jsx:1385.
- **Icons**: inline Feather-style stroke SVGs, stroke 1.7–2.2, defined per call site; two icon maps (`BSA_DICONS`, `BsaCvIc`).
- **Popovers**: absolute or fixed positioned, outside-mousedown close, scroll/resize close, flip-up near viewport bottom (recipients popover, row menu, time picker, date-time picker).
- **Switches**: two hand-rolled toggle styles (`.bsa-switch` retry, `.bsa-dup-toggle` duplicates) — teal when on.
- **Segmented control**: `.bsa-seg` grey track + white active pill [CODE] basic-app.css:550, 588-589.
- **Responsive**: exactly two media queries, both `@media (max-width: 1180px)` — stack compose/details/conversation grids to one column [CODE] basic-app.css:1230-1232, 1461-1463. No mobile-specific layout beyond that.
- **RTL readiness**: logical properties used widely (`margin-inline-start`, `border-inline-end`, `padding-inline`, `text-align: start`, `inset-inline` patterns); `document.body.dir` flipped by the host on `lang==='ar'` [CODE] app.jsx:152. Some physical left/right remain in popover positioning math ([INFERRED] portal position math is LTR-tuned).
- **Animations**: `bsaPulse` keyframes (defined twice — once box-shadow ring for the progress dot :857, once opacity for the recording dot :1189; second definition wins per CSS cascade [INFERRED]); funnel bar height transition .85s; count-up rAF easing in JS.

---

## 3. STATE + DATA MODEL

### 3.1 React state shape
**Page (`BasicApplicationPage`)** [CODE] basic-app.jsx:2771-2795:
```
viewAs: null|'falcon'|'client'      role: 'account-owner'|'node-admin'|'normal-user'
channel: 'whatsapp'|'voice'         mode: 'outbox'|'scheduled'
view: 'list'|'compose'|'details'|'conversation'
activeTxn, editRow, prefill:{number}|null, convRecipient, composeFromConv:bool,
stagedTpl:{templateId,vars,number}|null, openMenuId, page, pageSize=10,
confirm:{kind:'cancel'|'delete',row}|null, search:'', typeFilter:null,
waOutbox / waScheduled / voiceOutbox / voiceScheduled  (mutable copies of window seeds)
```
**Compose** [CODE] basic-app.jsx:699-721, 770-771: `sender, cat, lang, tplId, selGroups[], groupCfg{gid:{mobileCol, varMap{var:col}}}, manual[{phoneCountry,phone,vars{}}] (≤3), timing 'immediate'|'schedule', schedDate:Date|null, schedTime:'09:00 AM', confirm, cancelConfirm, retryOn, retryStatuses[]=['no_answer','busy'], retryAttempts[{wait}] (≤3, seed [{wait:5}]), showPreview=true, colChecked{} (dead), activePanel:{gid,kind:'map'|'prev'}|null`.
**WA details** [CODE] basic-app.jsx:1175-1182: `recips` (memoized once), `chartIn`, `openMenuId`, `sel` (selected recipient index), `recPage/recPageSize`, `askAI`.
**Voice details** adds `expandId`, `selRecId`, `previewId` (orphaned) [CODE] basic-app.jsx:1904-1911.
**WA conversation** [CODE] basic-app.jsx:2372-2398: `tplModal` (dead), `expired`, `draft`, `msgs[]`, `replyTo`, `reactFor`, `emojiOpen`, `attachOpen`, `recording`, `recStopped`, `recSec`, `infoMsg`, `search`, `searchIdx`; window constants `winHours=22, winMins=30, winSecs=15`.
**Handoff hook** [CODE] basic-app.jsx:1662-1675: `msgs, reactFor, replyTo, draft` + `who/setReaction/sendReply` helpers.

### 3.2 Mock data structures (basic-app-data.jsx) — attribute by attribute
- **Senders** [CODE] basic-app-data.jsx:7-8: `bsaWaSenders` = 5 formatted phone strings (KSA + Jordan); `bsaVoiceSenders` = 3 (KSA landline-style). Plain strings, no metadata (no verified flag, no display name — ABSENT).
- **WA templates** `bsaWaTemplates` [CODE] :11-17: `{ id ('wt1'..'wt5'), name, type ('Marketing'|'Authentication'|'Utility'), language ('English'|'Arabic'), refId ('REF-100x') }`. `refId` is never displayed in the UI (ABSENT from screens).
- **Voice templates** `bsaVoiceTemplates` [CODE] :20-24: `{ id ('vt1'..'vt3'), name, type ('Dynamic'|'Static'), refId }` — **no language attribute** (2-tier selection).
- **Contact groups** `bsaContactGroups` [CODE] :27-33: `{ id, name, count, columns[] (sheet column names e.g. mobile/first_name/last_name/age/gender), shared?:true }` — cg4/cg5 are shared. No owner, no createdAt, no version (ABSENT).
- **Transaction factory** `bsaTxn(id, sender, tplId, count, cost, created, status, extra)` [CODE] :36-45 producing:
  `{ id:'TXN-nnnnnn', sender, templateId, templateName, language|null, type, createdAt:'DD-MMM-YYYY · hh:mm am/pm' (display string, not ISO), recipientsCount, totalCost, recipients:'Contact Group 1' (legacy single string), recipientsList:['Contact Group 1'], status, ...extra }`
  Extras used: `manualRecipients[]` (formatted numbers), `scheduledAt` (display string), `targetCount`/`targetCost` (in-progress), `plannedCount` (partial/canceled/failed), `estimatedCost` (failed), `failReason` (long human sentence).
- **Seed grids** [CODE] :48-85:
  - WA outbox 15 rows: 10 completed, 1 in_progress (142/257 processed, target cost 642), 1 partial (84/120, insufficient balance), 1 canceled (47/120), 1 failed (0/64, aborted, estimatedCost 160). One row has 3 groups; one has group + 2 manual; one manual-only (3 numbers).
  - WA scheduled 5: 4 scheduled (future `scheduledAt` Jul-2026) + 1 **deleted**.
  - Voice outbox 4: 2 completed, 1 in_progress (51/88), 1 partial (40/64).
  - Voice scheduled 2: both scheduled.
- **Template bodies** `bsaWaTemplateBodies` [CODE] :88-94: `{ title, body, footer|null, button|null }` per WA template; `{{var}}` placeholders + `*bold*` markers; wt5 body is Arabic.
- **Template variables** `bsaTemplateVars` [CODE] :95-99: var-name arrays for wt1-5 AND vt1-3 (voice vars used by mapping + transcripts; vt2 = []).
- **Sample conversation** `bsaSampleConversation` [CODE] :103-116: 7 messages exercising every kind: out text w/ org+name+status read; in text; in text + big `emoji`; out `kind:'image'` + caption + reaction ❤️; in `kind:'voice'` dur '0:14'; out `kind:'doc'` fileName/fileMeta; in text + reaction 👍.
- **IVR transcripts** `bsaIvrTranscripts` [CODE] :121-173: ~45 entries mapping recording filename → spoken sentence, grouped: routine, Al Rajhi (AR), STC billing (dynamic AR), Saudia, Absher (dynamic AR), Riyad Bank card-dispute/balance (EN).
- **AI handoff scripts** `bsaAiHandoff` [CODE] :179-223: 5 intents (billing/travel/appointment/banking/support), each `{ agent:'Falcon AI Assistant', msgs:[{from:'ai'|'cust', text}] }` — fully scripted resolutions (payment link, flight booking SV-7K2P9, reschedule APP-553120, card block RJ-204871, generic).
- **Export**: everything assigned onto `window` [CODE] :225-230.

### 3.3 PRD-relevant fields present vs missing in the mock ([INFERRED] mapping, absences explicit)
Present: txn id, sender id, template ref (id+name), language (WA), category/type, creation timestamp, scheduled timestamp, recipient count, total cost, recipients (groups + manual), status incl. partial/canceled/deleted, fail reason, planned vs processed counts, per-recipient statuses + timestamps + reply + cost, voice attempts with wait/cost, IVR path/keys, cost by destination/attempt, 24h-window concept, duplicates toggle, retry config.
**ABSENT from the mock/txn model**: created-by user, owning node/tenant id, channel field on the txn record (implied by which list it sits in), ISO dates/timezones, currency code (SAR hardcoded via glyph), template version/refId surfaced, per-recipient names, message ids per recipient, delivery-receipt raw payloads, error codes (only prose failReason), retry config persisted on the txn, allowDup persisted, balance snapshot, priority/throttling, campaign name distinct from template name, pagination metadata, permissions/PES flags.

---

## 4. FLOW LOGIC (exact behavior)

### 4.1 Template selection (3-tier WA / 2-tier voice)
- Tiering: Category → Language (WA only) → Template Name. `langOpts` derived from templates of the chosen category; `tplReady = !!cat && (isVoice || !!lang)`; `tplOpts` filtered by type + language [CODE] basic-app.jsx:723-726. Cascade clears downstream picks [CODE] :918-919.
- Meta-status guard: non-Approved template (wt5 'Paused') → warning banner + send blocked [CODE] :524-526, 734-736, 796, 926-928.

### 4.2 Variable mapping grid (contact groups)
- Per-group config `{ mobileCol, varMap }` seeded EMPTY (explicitly no auto-mapping) whenever groups/template change; existing picks preserved [CODE] :739-752.
- `groupsReady` = every selected group has `mobileCol` AND every template var mapped [CODE] :768. Gates BOTH `canSend` and adding more groups.
- Column dropdown assignment moves fields between columns; unmapping via 'Not mapped'; unmapped columns flagged red while incomplete [CODE] :776-787, 980-987.
- Progress pill `done/need mapped`; field chips tick as mapped [CODE] :963-976.
- Sample rows: 2 rows per group from canned per-column samples [CODE] :527-534.

### 4.3 Manual recipients
- Max 3; add blocked until template picked AND all existing rows complete (destination + every var non-blank) [CODE] :716, 754-756, 761, 1025.
- Only rows with a destination count toward `recipientCount`/sending (`manualValid`) [CODE] :754, 757.
- Destination is free text; no validation. From-conversation mode locks the list to the single prefilled recipient (no add/remove UI, header "Recipient") [CODE] :1021-1025.

### 4.4 Preview + cost
- Live phone preview uses recipient-1 resolution: first group's first sample row through the map → else first manual row's typed vars → else `{{var}}`/sample fallbacks [CODE] :798-810.
- Cost model: flat `costPerMsg` 2.5 (WA) / 4 (voice); estimate = recipients × rate shown only in the confirm overlay [CODE] :758, 474, 491. The compose summary shows recipients + date but no cost (cost appears only at confirm).
- Duplicates: 'Allow duplicate recipients' switch in the confirm; value forwarded then dropped [CODE] :494-498, 812-820.

### 4.5 Scheduling
- Segmented Immediate/Schedule; Schedule reveals `BsaDateTimePicker` (calendar with today ring; picking a date defaults time to 09:00 AM; hour stepper ±1 wrap 1-12; minute stepper ±5 wrap; direct typed digits clamped; AM/PM buttons; Clear resets date; Done closes; opens upward when space demands/preferUp) [CODE] :636-690, 848-853.
- A legacy `timeControl` combining shared `window.DatePicker` + the clock-dial `BsaTimePicker` exists but is **never rendered** [CODE] :823-840 (dead).
- On send, `scheduled: timing==='schedule'` drives status + destination list, but the ACTUAL picked date/time is not persisted (hardcoded scheduledAt) [CODE] :812-819, 2858.

### 4.6 Send / post-send
- Send button → confirm overlay → `doSend` → `onSent` payload `{sender, templateId, recipientsCount, totalCost, groups, manual, scheduled, retry}` [CODE] :812-820.
- New txn prepended; sub-tab auto-switches to outbox/scheduled; toasts distinguish scheduled vs processing [CODE] :2846-2865. New outbox txns start `in_progress` and get picked up by the ticker. targetCount/targetCost are NOT set on the new txn ([INFERRED] the ticker treats target = current count so new sends hold at 70% of their own count).

### 4.7 Cancel / Delete / Edit
- Cancel: only in_progress; dialog explains batch semantics; live re-read → race-aware outcome (canceled-with-partial-charge vs completed) [CODE] :2867-2891.
- Delete: only scheduled; row becomes status 'deleted', stays visible dimmed; details page shows the deleted banner and blocks conversation + AI [CODE] :2892-2897, 1247, 1340.
- Edit: only scheduled; opens compose with partial prefill (see S3 Edit-mode notes) — does not update or remove the original row.

### 4.8 Details flows
- WA: recipient row click → side phone preview re-renders with that recipient's values; 3-dot → Conversation (gated). Export buttons toast. Ask AI via header handler (gated for scheduled/deleted).
- Voice: recipient row click → side IVR canvas + call description + transcript; caret → attempts sub-table; Conversation gated identically; Filter chip toasts.
- No-data statuses (scheduled/deleted/failed) render every chart/cost as '—' grey stubs rather than hiding sections [CODE] :1198, 1274, 1290-1300, 1925, 2003, 2015-2041.

### 4.9 Conversation flows
- WA thread: composer send (Enter or button), emoji append, attach photo/doc placeholders, voice record → stop → preview → send, reply quoting (summary line with kind icons: 📷 Photo / 🎤 Voice message / 📄 name / template title) [CODE] :2417, reactions toggle, per-message info → left panel mirror, in-thread search with next/prev.
- 24-hour CS window: static 22:30:15 display, `is-final` enlargement rule (hours < 1), demo expiry toggle; expired → composer replaced by template-only CTA; reply/react disabled [CODE] :2397-2398, 2627-2699. **No live countdown interval (ABSENT).**
- "Send new message template" → compose takeover (fromConversation): groups hidden, single locked recipient, Cancel returns to thread, "Send & back to conversation" stages `{templateId, vars, number}` → staged card in the footer → Send posts it as a template bubble [CODE] :2839-2842, 903-906, 2426-2431, 2644-2657.
- Voice thread: IVR walk playback (per-node voice note + transcript + options + pressed key), terminal handling (hangup/return notes vs AI handoff), handoff live composer (reply/react/info), footer send-WhatsApp/send-Voice shortcuts that jump to compose with channel switched + recipient prefilled [CODE] :1825-1896, 2840-2841.

---

## 5. INTEGRATION SURFACE (what a micro-frontend port must replicate)

- **Export**: single global — `window.BasicApplicationPage = BasicApplicationPage` [CODE] basic-app.jsx:2992. Data file exports 14 globals via `Object.assign(window, …)` [CODE] basic-app-data.jsx:225-230.
- **Mount contract** [CODE] app.jsx:347-357: `<BasicApplicationPage tree selected selectNode expanded toggleExpand lang t pushToast />` — rendered when `activePage === 'marketplace:basic'`; sidebar item under the Marketplace group [CODE] sidebar.jsx:20; page-title map entry 'Basic Application' [CODE] app.jsx:239.
  - `tree` = org hierarchy root (children = clients); `selected` + `selectNode(id)` = selected node; `expanded` + `toggleExpand` = tree expansion state; `t` = translation dict; `pushToast(msg)` = host toast (3.5 s auto-dismiss [CODE] app.jsx:130-133).
  - All props defaulted (`selectNode = () => {}` etc. [CODE] basic-app.jsx:2769) so it can render standalone.
- **i18n mechanism**: every visible string is `t.bsaKey || 'English fallback'`; status labels via dynamic key `t['bsaStatus_' + status]` [CODE] basic-app.jsx:20. No dictionary shipped in these files — the host owns translations. RTL: host sets `document.body.dir = 'rtl'` for Arabic [CODE] app.jsx:152; CSS uses logical properties for most spacing.
- **Theming hooks**: relies on host CSS variables (`--teal`, `--teal-hover`, `--border`, `--border-2`, `--text`, `--text-muted`, `--bg-hover`, `--green-bg`, `--clients-w`) + shared chrome classes (btn, status-badge, table-panel, drawer, vis-warn, row-menu, cg-shared-pop, tpl-picker, templates-page grid). No dark-mode rules in basic-app.css (ABSENT).
- **Global component dependencies** (must exist on `window` or as globals): `TplOrgTree`, `TablePagination`, `DatePicker` (optional — guarded), `TplIvrStep2` (guarded; voice previews degrade to empty text), `seedTemplates` (IVR canvases), `findNode`, `BrandLogo`, `COUNTRIES`, icon globals, `React`/`ReactDOM` UMD (file uses `const {useState…} = React`, no imports — Babel-standalone environment [INFERRED from file style]).
- **Ask AI contract** [CODE] app.jsx:139-149 + basic-app.jsx:1183-1188: host header button calls `window.falconAskAI.open()`; details pages set `window.falconAskAI.handler` while mounted (cleared on unmount); handler suppressed for scheduled/deleted txns (falls through to nothing — the global panel is not opened either because handler exists but returns silently [CODE] basic-app.jsx:1186).
- **Cross-page nav hooks available in the host** (not used by BSA itself): `window.falconGoVoiceAccount`, `window.falconGoMetaService` [CODE] app.jsx:169-179.
- **Assets**: `admin/assets/iphone-frame.svg` phone frame [CODE] basic-app.css:612; marketplace tile icon `admin/assets/basic-application.svg` [CODE] comm-mkt.jsx:37.
- **No router/URL state**: all navigation is in-memory `view` state; browser back is unwired (ABSENT).
- **Data contract**: reads `window.bsa*` seeds once into local state; all mutations local (no persistence, no API layer). A port must define: transactions list/read per channel+mode, template catalog (3-tier), sender list, contact groups (+columns +shared flag +sample rows), template bodies/variables, per-recipient results (WA statuses + voice attempt lifecycles), cost/stat aggregates, conversation thread, IVR flow definition + transcripts.

---

## 6. GAPS — PRD features visibly ABSENT or stubbed in this reference (for the critic)

**Stubbed (UI present, behavior fake):**
1. Date-range filter — static chip, no picker, no filtering [CODE] basic-app.jsx:304.
2. Export Details / Export Statistics — toast only, no file [CODE] :1241-1242, 1969-1970.
3. Voice recipients Filter chip — toast only [CODE] :2053.
4. Create Template link — toast only [CODE] :922.
5. Allow-duplicate-recipients toggle — value discarded [CODE] :812-820.
6. Voice retry config — collected but not persisted onto the created txn [CODE] :818, 2853-2859.
7. 24-hour CS window — static values, manual demo toggle, no countdown interval [CODE] :2397-2398, 2552.
8. Schedule date/time — picked values not stored (hardcoded scheduledAt '20-Jul-2026 · 09:00 am') [CODE] :2858.
9. Edit scheduled txn — partial prefill (groups hardcoded to cg1; category/language/schedule not restored) and produces a NEW txn instead of updating [CODE] :699-706, 2846-2865.
10. Audio everywhere is simulated (fake waveforms/timers; recorded-call play is a toast) [CODE] :1533, 2209-2245.
11. Stats/rates are deterministic demo constants (WA 98.3/94.7/76.1/68/72/45; voice derived from a ≤24-row synthetic sample scaled up) [CODE] :387-412, 1444-1480.
12. Recipient tables capped at 24 synthetic rows regardless of real count [CODE] :418, 1407.
13. avgDeliveryTime computed ('4.2s') but never displayed [CODE] :408.

**Absent entirely (no UI):**
14. No backend/API integration, loading states, error states, or skeletons.
15. No phone/format validation on manual destinations (free text "Phone, email, or username"); no country-code selector in the manual grid (helper `bsaSplitNum` + `otp-phone-wrap` CSS suggest a dropped phone-input) [CODE] :1041, css:548.
16. No CSV/file upload of recipients; no inline contact-group creation.
17. No column sorting or "Quick Sort" (header comment mentions Quick Sort [CODE] :4; CSS `.bsa-quicksort` exists :36 — UI removed).
18. No pause/resume, resend-failed, duplicate-transaction, or archive actions on transactions.
19. No campaign naming separate from template name; no notes/tags.
20. No balance display or pre-send balance check (failure copy references insufficient balance only in seeded failReasons).
21. No per-recipient export or message-level cost drill-down beyond the table.
22. No real-time push — the in-progress ticker is a local 4.5 s interval that never completes rows [CODE] :2802-2821; scheduled rows never auto-execute.
23. No permission/PES enforcement beyond the role dropdown demo (role only hides tree/Send button) [CODE] :2900-2955.
24. No dark mode; no responsive layout below the single 1180px breakpoint; no URL deep links.
25. Voice IVR canvas shows a HEURISTICALLY matched seed template (by type, falling back to the first), not the transaction's actual template flow [CODE] :731-732, 1766-1767, 1929-1930.
26. Multi-currency ABSENT — SAR glyph hardcoded.
27. WhatsApp interactive button replies, message forwarding (icon exists, acts as reply-quote), read receipts progression, typing indicators — ABSENT/static.

**Dead code kept in the file (signals of earlier iterations — do NOT port blindly):**
28. `BsaCountUp` (:121), `BsaStatBar` (:1100), `BsaPlay` (:1502), `BsaClientsRail` (:2737) — never referenced.
29. `BsaVoicePreview` modal (:1505) — unreachable (`setPreviewId` never called with an id).
30. `BsaSendTplModal` (:2251) — unreachable (`tplModal` never set true); superseded by fromConversation compose.
31. `timeControl` + `BsaTimePicker` path (:538-614, 823-840) — replaced by `BsaDateTimePicker`.
32. `togglePrev`/`isPrevOpen` group preview-table cards (:786-787, 997-1014) — no trigger.
33. `colChecked`/`colIsChecked`/`setColCheck` checkbox-mapping state (:770-783) — checkbox UI removed.
34. `BSA_VOICE_STATS` IVR insights (:1482-1486) + `.bsa-ivr-opts-grid`/keypad/`.bsa-vp-*` CSS (css:1256-1306) — UI removed.
35. Voice recipient `options` field (:1437-1440) — no renderer.
36. `.bsa-type` colored chips (css:101-107) vs plain-text type cells actually used; `.bsa-quicksort`, `.bsa-compose-grid`, `.bsa-manual-card`, `.bsa-map-grid`, `.bsa-rate-strip` etc. are legacy CSS with no current JSX consumer ([INFERRED] from class-name greps).

**Data-model gaps vs a real PRD build** (see §3.3): no ISO timestamps/timezones, no createdBy/tenant, no channel field on txn, no error codes, no currency code, no template refId surfaced, no per-recipient message ids.
