*** PRD Understanding - Basic Send Application - REACT_ADJACENT_MODELS (WA templates, IVR trees, sender IDs, commchannel statuses) ***

# BSA Adjacent-Module Data Models — Deep Extraction Report

**Agent:** code-adjacent | **Date:** 2026-07-06
**Purpose:** Extract the data models the Basic Send App (BSA) CONSUMES from adjacent reference modules: WhatsApp templates, Voice IVR templates/trees, sender IDs, commchannel statuses — grounded line-by-line in the SoT theme mock.

**Files read (all under `C:/Falcon/Source_of_truth_theme/latest 07062026/falcon-ux (4)/admin/`):**
- `templates-data.jsx` (632 lines, full) — template seeds incl. IVR trees
- `templates-list.jsx` (399, full) — list, status pills, Edit/Share gating
- `templates-wizard.jsx` (1969, full) — WA create wizard: categories, variables, samples, buttons, flows, auth
- `templates-details.jsx` (254, full) — details page + maker–checker action history
- `templates-shared.jsx` (317, full) — WA preview renderer, date format, formatting marks
- `templates-flow.jsx` (1001, targeted) — WhatsApp Flow editor content kinds
- `template-mgmt.jsx` (456, full) — per-channel maker–checker configuration
- `templates.jsx` (704, full) — page orchestrator: create/edit/share/resubmit lifecycle
- `templates-ivr.jsx` (1923, full) — IVR wizard, canvas, variables, playback, review tree
- `meta-service.jsx` (346, full) + `meta-service-data.jsx` (37, full) — Meta/WhatsApp commchannel assets
- `voice-service.jsx` (1702, full) + `voice-service-data.jsx` (115, full) — voice accounts, SIP numbers, voice records
- `basic-app-data.jsx` (231, full) + `basic-app.jsx` (targeted: compose 660–1090, helpers 500–640, conversation 1580–1700, greps) — what BSA actually consumes
- `apps.jsx` (1–80) + `comm-mkt.jsx` (1–82 + greps) + `hierarchy.jsx` (315–360) — commchannel status model

Excluded per instructions: `uploads/`, `admin.bak.*`, `admin/_edit-bak.*`, `replica/`, `standalone/`.

---

## 1. WHATSAPP TEMPLATE MODEL

### 1.1 Stored/list record shape (seed rows)

[CODE] templates-data.jsx:8–219 — every WhatsApp template row carries:

| Field | Type / values | Evidence |
|---|---|---|
| `id` | string numeric (`'12'`, `'14'`, `'65'`, `'30'`…) | templates-data.jsx:10 |
| `name` | string (wizard caps at 512 chars) | templates-data.jsx:11; templates-wizard.jsx:264 |
| `channel` | `'WhatsApp'` \| `'IVR Voice'` | templates-data.jsx:12,130 |
| `serviceType` | WA: `'Marketing'` \| `'Utility'` \| `'Authentication'`; IVR: `'Static'` \| `'Dynamic'` | templates-data.jsx:13,36,57,131,225,260 |
| `referenceId` | free string (`'123'`, `'IVR-RAJHI-01'`) | templates-data.jsx:14,226 |
| `wabaAccount` | one of `'Aramco WABA Main'`, `'Aramco WABA Secondary'`, `'Falcon Demo WABA'`; `'N/A'` for IVR | templates-data.jsx:15; templates-wizard.jsx:245; templates-data.jsx:227 |
| `checker1`, `checker2` | `{ name, status: 'approved'\|'pending'\|'rejected', reason? }` or `null` (NA) | templates-data.jsx:16–17,85–86,133 |
| `creationDate` / `creationTime` | `'27/03/2025'` / `'02:42 pm'` (displayed DD-Mon-YYYY via `tplFmtDate`) | templates-data.jsx:18–19; templates-shared.jsx:7–12 |
| `sharedWith` / `sharedWithCount` | name array + extra count | templates-data.jsx:20–21 |
| `createdBy` | string maker name | templates-data.jsx:22 |
| `statusByMeta` | `'---'` \| `'NA'` \| `'In-Review'` \| `'Rejected'` \| `'Active Quality Pending'` \| `'Active - High Quality'` \| `'Active - Medium Quality'` \| `'Active - Low Quality'` | templates-data.jsx:23,46,67,92,466–470; templates-list.jsx:117–127 |
| `metaQuality` | `'pending'`\|`'high'`\|`'medium'`\|`'low'`\|`null` | templates-data.jsx:24,471–475 |
| `metaRejected` | boolean flag (Meta-side rejection) | templates-data.jsx:73 |
| `status` | internal: `'approved'` \| `'pending'` \| `'rejected'` \| `'deleted'` (pill map also has `review`) | templates-data.jsx:25,47,68,93,171; templates-list.jsx:6–16 |
| `language` | `'English'` \| `'Arabic'` | templates-data.jsx:26,122; templates-wizard.jsx:284–289 |
| `subCategory` | `'Default'` \| `'OTP'` \| `'Flows'` (+ disabled `Catalog`, `Calling`) | templates-data.jsx:27,49,95; templates-wizard.jsx:229–244 |
| `body`, `title`/`header`, `footer` | message text parts | templates-data.jsx:28–29,97–99 |
| `variableType` | `'Number'` \| `'Name'` | templates-data.jsx:96; templates-wizard.jsx:944–952 |
| `samples` | `{ '{{token}}': 'sample value' }` map | templates-data.jsx:100 |
| `flow` | `{ type, source: 'existing'\|'new', name, buttonText, icon, startsWith, startScreen }` | templates-data.jsx:101 |
| `buttons` | array (see 1.5) | templates-data.jsx:102 |
| `previewKind` | `'feedback'\|'otp'\|'signup'\|'shop'\|'track'\|'flow'\|'ivr'\|'live'` (preview rendering hint) | templates-data.jsx:30,51,72; templates-shared.jsx:100 |

### 1.2 Wizard model (create → 3 steps)

- [CODE] templates.jsx:88–92,163 — initial wizard data: `{ channel:'WhatsApp', category:'Marketing', subCategory:'Default', language:'English', sharedIds:[], referenceId:'', wabaAccount:'', variableType:'Number' }`.
- [CODE] templates-wizard.jsx:147–188 — 3 steps: Basic Info → Message Structure → Share & Submit.
- Step 1 [CODE] templates-wizard.jsx:226–313: WABA account dropdown (3 hardcoded), name (max 512 + counter), Reference ID, language (English/العربية), category tabs (Marketing/Utility/Authentication), sub-category cards per category:
  - Marketing: Default, Catalog (comingSoon/disabled), Flows, Calling (comingSoon/disabled) — templates-wizard.jsx:230–235
  - Utility: Default, Flows, Calling (disabled) — templates-wizard.jsx:236–240
  - Authentication: OTP only — templates-wizard.jsx:241–243
- Step-gating [CODE] templates.jsx:289–295: step1 requires name+language+category+subCategory; step2 requires `body` (except Authentication).

### 1.3 Variable syntax & validation (Step 2)

- Token regex: `\{\{[^{}]*\}\}` [CODE] templates-wizard.jsx:807,882.
- **Two variable styles**, chosen by `variableType` dropdown (`Number` | `Name`) [CODE] templates-wizard.jsx:944–952:
  - Number: `{{1}}`, `{{2}}`… numbered **independently per field** (header restarts at `{{1}}`; body restarts at `{{1}}`) [CODE] templates-wizard.jsx:811–823.
  - Name: inserts empty `{{}}` and drops the caret inside; valid content must match `^[a-z][a-z0-9_]*$` [CODE] templates-wizard.jsx:822,843–847,914–915. (Seed example uses CamelCase `{{FirstName}}` — templates-data.jsx:98 — the validator would flag that; the BSA copy uses snake_case.)
- Length budgets: header max 60; body base 1024 **+4 chars per variable**; footer max 60 [CODE] templates-wizard.jsx:803–809,968,1068.
- Body validation rules [CODE] templates-wizard.jsx:899–930: (a) format — each token must match selected type; (b) length — a body containing variables must be ≥140 chars; (c) placement — variable may not start or end the body.
- **Variable Samples**: a sample value is required for every distinct token (header + body sections; empty → error styling + "Add sample text") [CODE] templates-wizard.jsx:1074–1140; stored on `data.samples[token]` [CODE] templates-wizard.jsx:892–893.
- Formatting toolbar inserts WhatsApp marks: `*bold*`, `_italic_`, `~strike~`, ```` ```mono``` ````, emoji picker [CODE] templates-wizard.jsx:1036–1061; rendered by `renderWaText` [CODE] templates-shared.jsx:71–95.
- Header media alternative: `mediaSampleId` ∈ none/image/video/document/location; image JPG/PNG ≤5MB, video MP4 ≤16MB, document PDF ≤100MB; `location` disables the header text [CODE] templates-wizard.jsx:655–716,959–1009.

### 1.4 Authentication (OTP) variant

[CODE] templates-wizard.jsx:316–458 — no free body; instead: code delivery (`zero`/`one`/`copy`, only Copy Code enabled), content checkboxes `addSecurity` (default ON) and `addExpiration` (default OFF, `expiresIn` 1..90 minutes), message-validity toggle with options 30s/1/2/3/5/10/15 minutes. Preview body is auto-generated: `'{{1}} is your verification code.'` + optional security/expiry lines, `previewKind:'otp'` with fixed Copy-code CTA [CODE] templates.jsx:347–365.

### 1.5 Buttons model

[CODE] templates-wizard.jsx:1153–1167 (defaults), 1380–1397 (limits):
- Kinds: `custom` (Quick Reply, text ≤25), `visit` (text ≤25, `urlType` `'Static'|'Dynamic'`, `url` ≤2000; Dynamic appends `{{1}}` and requires `urlSample` valid URL), `wa` (Call on WhatsApp; text + `activeFor` 1..30 days), `phone` (text + country + phone ≥7 digits), `copy` (locked text + `code` ≤25; **Marketing-only** — hidden for Utility per Meta rule), plus `flow` stored on `data.flow` (not in `buttons`).
- Caps: total 10; per-kind `{ custom:10, visit:2, wa:1, phone:1, flow:1, copy:1 }` [CODE] templates-wizard.jsx:1385.
- Preview collapse: >3 actions → show 2 + "See all options" sheet (Quick Replies separated from CTAs by divider) [CODE] templates-shared.jsx:235–297.

### 1.6 Flow (WhatsApp Flows) attachment

- `flow` object: `{ type ('survey'/'feedback'/'existing'/'placeholder'), source ('new'|'existing'), name, buttonText (≤40), icon ('default'|'document'|'promotion'|'review'), startsWith ('predefined'|'dynamic'), startScreen ('help'|'survey'|'welcome'), screens[] }` [CODE] templates-wizard.jsx:1222–1341; templates-data.jsx:101,513–531.
- Flow editor content kinds: heading-large, heading-small, body, caption, paragraph, image, short-text, date, multiple, single, dropdown, opt-in, contact-group [CODE] templates-flow.jsx:222–234. Default survey (3 screens) and feedback (2 screens) flows seeded [CODE] templates-data.jsx:534–605.

### 1.7 Approval lifecycle as modeled (maker–checker + Meta)

- **Config**: Template Management sets, per channel (whatsapp/voice/push/sms), `bodyType` `'restricted'|'unrestricted'` and `levels` `'one'|'two'` with per-level checker user lists (mutually exclusive between levels; required when restricted) [CODE] template-mgmt.jsx:119–314.
- **States**: internal `status` pending → approved/rejected (+deleted); checker rows drive an Action History derived exclusively from `checker1/checker2` so it can never contradict the pill; Level-2 row omitted when L1 rejected with no second reviewer [CODE] templates-details.jsx:5–28.
- **Meta chain**: after full internal approval a WA template goes to Meta: `statusByMeta` `'---'` (not sent) → `'In-Review'` → `'Active Quality Pending'` → `'Active - High/Medium/Low Quality'` or `'Rejected'` (`metaRejected:true`); `'NA'` = never applicable (IVR / internally-rejected-never-sent) [CODE] templates-data.jsx:23,46,67,92,464–475; templates-list.jsx:117–127; Meta action-history mock templates-data.jsx:611–616.
- **Edit gate**: Edit offered ONLY for an internally-rejected template (a checker rejected; not Meta-rejected, not deleted/restricted) [CODE] templates-list.jsx:129–143. **Share gate** is its complement (WhatsApp/IVR, not rejected, not deleted, not editable) [CODE] templates-list.jsx:145–152.
- **Resubmit**: saving an edit resets the workflow — `status:'pending'`, `metaRejected:false`, `statusByMeta:'---'`, both checkers `{name:'---', status:'pending'}` [CODE] templates.jsx:244–268.
- **Pending Review tab** carries checker decision UI (Approve / Reject + reason) only in client view + pending tab [CODE] templates-details.jsx:179–210; tabs = Templates / Pending Review / Shared Templates [CODE] templates.jsx:397–405.
- Falcon (admin) view is read-only ("View details only"); client view is maker view [CODE] templates.jsx:591; templates-list.jsx:156–216.

---

## 2. IVR MODEL

### 2.1 Canonical data shape

[CODE] templates-ivr.jsx:1–11 (header comment, authoritative):
```
data.ivr = {
  type: 'static' | 'dynamic',
  nodes: [ { id, parent: parentId|null, key: '0'..'9'|'*'|'#'|null, label, segments: [Segment], terminal: TerminalAction|null } ],
  variables: [ { key, type: 'digit'|'number'|'date'|'time', sample } ],
}
Segment: { kind:'recording', name, dur } | { kind:'variable', key }
```
Extended in the builder:
- `keys: []` — multi-DTMF selection per node; legacy single `key` = `keys[0]` [CODE] templates-ivr.jsx:49,740–753.
- Segment third kind `{ kind:'goto', target: nodeId }` — "Jump" routing [CODE] templates-ivr.jsx:724–735.
- Node extras written by `saveNode`: `label` (≤60), `voice` (static single recording name), `timeout` (int seconds, ≤3 digits), `dur` (default 8), `x/y` draft position, `varType/varName` legacy cleared [CODE] templates-ivr.jsx:718–758,1132,1209.
- Root/entry node: `id:'n_root'` for the first entry, `parent:null`, no key [CODE] templates-ivr.jsx:747.

### 2.2 Node semantics & rules

- **Name is the only required field** — voice is optional, so a node can be a pure router [CODE] templates-ivr.jsx:577–579.
- **XOR rule**: a node is EITHER a Jump (`goto`) OR message content (recordings/variables) — never both; max one goto per node; the ROOT node gets no Jump option [CODE] templates-ivr.jsx:580–585,724–735,929,1140–1142,1185–1202.
- **DTMF keys**: keypad `1-9,*,0,#`; keys used by siblings are disabled; multi-select allowed; auto-assigns `nextKeyFor(parent)` [CODE] templates-ivr.jsx:401,434,924–933,1214–1235.
- **Timeout** field (seconds) on every node [CODE] templates-ivr.jsx:1206–1212.
- **Terminal actions** (`terminal.type`): `hangup` → "End the call", `return_parent` → "Return to previous menu", `return_root` → "Return to main menu", `transfer` → "Transfer to an agent", `repeat` → "Repeat this message" [CODE] templates-ivr.jsx:1489–1499 (`ivrTermLabel`); seeds use them extensively [CODE] templates-data.jsx:150,246–251,286–287,356–357,395–423. NOTE [INFERRED]: the canvas editor writes `terminal:null` on save (templates-ivr.jsx:752) — in the builder, return/repeat is expressed via `goto` segments; explicit terminals exist in seed data and are rendered read-only in the review tree footer (templates-ivr.jsx:1613).
- **Delete** removes the whole subtree after a confirm dialog counting descendants [CODE] templates-ivr.jsx:769–783,1274–1299.

### 2.3 Static vs Dynamic distinction

- Type picker Step 1 [CODE] templates-ivr.jsx:89–133: Static — "Each node contains one voice recording. Played according to hierarchy and recipient selection." Dynamic — "Each node may combine recordings and variables (Digit, Number, Date, Time) resolved per recipient."
- Static node editor = single Voice picker (+ optional Jump); Dynamic node editor = ordered segment list (Voice / Variable / Jump) with drag & arrow reorder [CODE] templates-ivr.jsx:1135–1204,610–617.
- "Add variable" affordances exist only when `ivr.type === 'dynamic'` [CODE] templates-ivr.jsx:220–224,1141.
- Changing type in Step 1 re-seeds the canvas (nodes wiped); re-entering with same type preserves work via `_seededType` [CODE] templates-ivr.jsx:509–519; templates.jsx:199–203.
- Read-only views (More Details / Share / Pending review) allow opening a node ONLY to edit Variables and only for dynamic flows [CODE] templates-ivr.jsx:319–323,1112–1128.
- List/serviceType mapping: template `serviceType` = `'Static'`/`'Dynamic'`; badge in review header [CODE] templates-data.jsx:225,260; templates-ivr.jsx:1759.

### 2.4 Variables (dynamic)

- Creation modal: key regex `^[a-z][a-z0-9_]{1,31}$` (lowercase, starts with letter), type ∈ `number | digit | date | time | string`, **sample value mandatory** [CODE] templates-ivr.jsx:1306–1340.
- Default variable palette seeded once per canvas: `customer_name` (string), `account_balance` (number), `otp_code` (digit), `appointment_date` (date), `appointment_time` (time) [CODE] templates-ivr.jsx:27–33,515–519.
- Type display labels: Number/Digit/Date/Time/String (`string`/`name` → String, `datetime` → Date) [CODE] templates-ivr.jsx:34.
- Variables panel shows ONLY variables actually used in the flow, each with editable example value [CODE] templates-ivr.jsx:1244–1264.
- Wizard cannot advance past Step 2 unless ≥1 node exists AND every variable has a non-empty sample [CODE] templates.jsx:276–288.
- Seed variable examples: `bill_amount` number '248.50', `due_date` date '2026-06-15', `citizen_name` string, `appt_datetime` date, `card_last4`/`otp_code`/`ticket_ref` digit [CODE] templates-data.jsx:289–292,359–362,425–433.

### 2.5 Canvas & tree mechanics (builder Step 2)

- Tidy-tree auto layout (parents centred over children; measured heights flow Y), zoom 0.5–1.6, map-style panning, fullscreen, re-center/fit, outline "IVR List" tree view with collapse, resizable side panel [CODE] templates-ivr.jsx:400–431,437–455,469–485,888–920,1067–1075.
- Edges: curved parent→child connectors labeled `Press <keys>` (>5 keys compacted "1 / 2 / 3 / 4 +N"); goto edges drawn as dashed "racetrack" return lines labeled `↻ Return` / `↻ Repeat` (self-loop) with collision-avoiding channel routing + label de-overlap [CODE] templates-ivr.jsx:50–52,785–886,948–969,1039–1052.
- Voice sources: `IvrVoicePicker` with two tabs — "Uploaded by me" (`myVoices`, seeded `['sound name 1','IVR-welcome.wav','Main-menu-AR.mp3']` + OS uploads accept `audio/*,.wav,.mp3,.m4a,.ogg`) and "Shared with me" (`sharedVoices` = `['Layla — Female (AR)','Omar — Male (AR)','Sara — Female (EN)']`) [CODE] templates-ivr.jsx:230–273,341–343,560–574,604.

### 2.6 Playback preview mechanics

- **Per-chip playback** (canvas cards): each recording chip is its own play/pause button; a thin progress bar animates for `seg.dur` (variable segments 1.6s), freezes on pause via `animation-play-state`, auto-advances via `onAnimationEnd` [CODE] templates-ivr.jsx:629–666.
- **Node play** ("Play the whole message") sequences the node's audible segments [CODE] templates-ivr.jsx:976–998.
- **Simulate full call**: DFS over the whole tree of nodes with voice, auto-centres the playing node, pause/stop controls [CODE] templates-ivr.jsx:671–707,1055–1066; DFS helper 1523.
- **Details/checker review** (`TplIvrDetails`): tabs Information (Nodes / Recordings / Variables / Levels / Type / Reference ID counters + description) · Levels (nested collapsible cards: Start / Press-key headers, `L<depth>` badges, numbered steps each individually playable, per-node Play, full-call queue advanced by each step's progress-bar end; spoken read time of a variable value ≈ `len*0.13+0.7` s clamped 1–6) · Variables (editable values "set values to preview" spoken in place) [CODE] templates-ivr.jsx:1508–1521,1624–1830. Jump connectors render as orange left-lane arrows [CODE] templates-ivr.jsx:1682–1739.
- **Phone simulator** (`TplIvrPreview`): DTMF keypad drives navigation (`key` match → child; no match → replay), transcript lines `[♪ recording-name]` or the variable sample (digit values read digit-by-digit, space-separated), choices list, Back/Restart; node duration estimate = Σ recording dur (default 5) + 1.2s per variable [CODE] templates-ivr.jsx:54–61,1381–1482.
- **Edit vs Share screens**: `TplIvrEditForm` — Edit: name/reference/canvas editable; Template ID, Service Type, Created By/Date, Channel, Status locked. Share: everything read-only, only Shared With (Select-all multi-select) editable; same canvas read-only [CODE] templates-ivr.jsx:1833–1913.

### 2.7 IVR seed templates (reference trees)

[CODE] templates-data.jsx:146–153 (`Template Test2` static 2-node), 220–255 (Al-Rajhi static 8-node banking), 256–294 (STC dynamic bill read-back with inline variables), 295–326 (Saudia static), 327–364 (Absher dynamic appointment), 365–435 (Riyad Bank dynamic, 12 levels deep, includes `goto` segments to `n_acc`/`n_main`, transfer/hangup terminals, 7 variables). Recording-name convention: `purpose-locale.wav` (e.g. `alrajhi-welcome-ar.wav`).

---

## 3. SENDER IDS

### 3.1 WhatsApp / Meta side (Meta Service .Mng)

- **Offering**: `metaServiceOffer` — Meta Channels & Services, Monthly subscription SAR 750/month, purchase → activate → hub phases [CODE] meta-service-data.jsx:6–17; meta-service.jsx:242,260–261,329–336.
- **Connected asset row** (`seedMetaChannels` / `metaExtraAssets`): `{ id, channelType: 'whatsapp'|'instagram'|'facebook', asset, assetSub?, status: 'active'|'expired'|'disabled' }`. WhatsApp assets are **phone numbers** (`'+1 (555) 019-2834'` sub-label `'Main Support'`, `'+1 (555) 220-7788'` sub `'Sales'`); Instagram = @handles; Facebook = page names [CODE] meta-service-data.jsx:20–32.
- Status pill map: active/expired/disabled [CODE] meta-service.jsx:31–44.
- Per-status row actions: expired → **Re-auth**; active → **Manage**, **Disable**; disabled → **Enable**; all → **Remove**; Add/Manage/Re-auth/Remove all round-trip through a simulated Meta Embedded-Signup OAuth popup + syncing overlay [CODE] meta-service.jsx:154–187,263–303.
- Grid columns: Channel type / Asset name-ID / Status / Actions [CODE] meta-service.jsx:196–201.
- Separate concept: **WABA account** (template ownership) is a 3-value hardcoded dropdown in the template wizard (`Aramco WABA Main` / `Aramco WABA Secondary` / `Falcon Demo WABA`) [CODE] templates-wizard.jsx:245 — distinct from sender phone numbers.

### 3.2 Voice / SIP side (Voice Service)

- **Voice account**: `{ id, name (2..50, unique per client), provider: 't2'|'byo', numbers: [{ value, status: 'approved'|'pending' }], status: 'active'|'disabled', createdAt/By, modifiedAt/By }` [CODE] voice-service-data.jsx:5–62; validation voice-service.jsx:628–658.
- Numbers are explicitly titled **"Phone numbers (Sender IDs)"** in the wizard [CODE] voice-service.jsx:335,554.
- Provider rules: **T2 SIP Trunk** → numbers picked from a pool (`seedT2Numbers`, 8 numbers) via multi-select; every picked number enters `status:'pending'` ("Purchasing T2 numbers needs approval — selected numbers stay 'Pending approval'") [CODE] voice-service.jsx:336,425,489–507; voice-service-data.jsx:64–74. **Own SIP (BYO)** → manual entry with country code; added as `status:'approved'` immediately [CODE] voice-service.jsx:499–503,509–545.
- Switching provider clears the numbers list [CODE] voice-service.jsx:300,352,1681.
- Account status: new account → `'active'`; row/detail actions toggle Disable ↔ Activate [CODE] voice-service.jsx:1548–1557,96–105 (pill maps only active/disabled).
- Pending numbers render an orange dot / "Pending approval" tag in the grid and details [CODE] voice-service.jsx:136–158,283.

### 3.3 Voice records (IVR audio assets — adjacent to sender IDs)

- `{ id, name (≤40), durationSec, createdAt, createdBy{name,email}, source: 'upload'|'tts'|'record', sharedWith[], usedInIvr }` [CODE] voice-service-data.jsx:76–87.
- **IVR lock**: `usedInIvr:true` → referenced by an APPROVED IVR tree → cannot be edited/deleted until the IVR is removed (lock tag in list + disabled delete with hint "Used in an approved IVR — delete the IVR first.") [CODE] voice-service-data.jsx:78–80; voice-service.jsx:932–941,970,1043.
- TTS voices catalog: `{ id, name, desc: 'Language (Accent) — Gender' }` — 6 Arabic (Saudi/Gulf/Egyptian/Levantine) + 2 English (American/British) [CODE] voice-service-data.jsx:96–108.
- Create wizard: name + source (Upload MP3/WAV ≤10MB · Convert Text (TTS: text + voice + Convert) · Record mic) + Share step; TTS duration ≈ `len*0.07` s [CODE] voice-service.jsx:1373–1439,1150.

### 3.4 BSA's sender-ID consumption

- `bsaWaSenders = ['+966 57 283 8628','+962 79 655 0500','+966 56 174 2284','+962 77 680 4143','+966 53 384 4111']` — commented "verified numbers attached to the tenant" [CODE] basic-app-data.jsx:6–7.
- `bsaVoiceSenders = ['+966 11 234 5678','+966 11 234 5679','+966 50 998 2200']` [CODE] basic-app-data.jsx:8.
- [INFERRED] Cross-check against voice-service-data.jsx: the three BSA voice senders are exactly the **approved** numbers of **active** accounts `va1` (T2, both approved) and `va3` (BYO, approved). Excluded: all `pending` numbers, the `disabled` account `va4`'s number. (Also absent: approved numbers of `va2`/`va5` — the seed list is a subset, so the eligibility rule "approved + active account" is consistent but the seed is not exhaustive.) Eligibility rule for the PRD: voice sender candidates = numbers with `status:'approved'` inside accounts with `status:'active'`.
- [INFERRED] WA sender numbers do not appear in meta-service-data (those are US-format demo numbers); BSA's WA list is an independent seed. Intended source per the Meta model: WhatsApp-type Meta assets with `status:'active'`.
- Compose renders sender as a flat single-select "Sender ID"; required for send [CODE] basic-app.jsx:917,796.

---

## 4. COMMCHANNEL STATUS

### 4.1 Status vocabulary (canonical pill)

[CODE] hierarchy.jsx:320–339 (`StatusBadge`, exported window-wide): `active`, `suspended`, `deleted`, `locked`, `pending` (user statuses) plus channel/app statuses `expired` → "Expired", `disable` → "Disabled", `inactive` → "Inactive", `paid` → "Paid".
- **`grace` status: ABSENT** — no occurrence of a grace state anywhere in this codebase (grep across admin/*.jsx). The nearest analogs: `paid` (purchased, awaiting first activation) on commchannels, and `expired` requiring Re-auth on Meta assets.

### 4.2 CommChannel rows and transitions

- Seed (`APPS_BY_TAB.commChannels`) [CODE] apps.jsx:32–41: `{ id, name, priceType Monthly|Yearly|Quarterly, priceValue, firstActivation, purchaseDate, activation, renew, status, visible }`. Statuses in data: `active` (c1 SMS, c3 Email, c6 AI), `paid` (c2 **WhatsApp Business**, c4 **Voice IVR**), `expired` (c5 Push, c7 RCS), `inactive` (c8 Telegram, c9 ABC).
- Marketplace apps tab: BSA itself is `a1 'Basic Send App'` `status:'active', visible:true` [CODE] apps.jsx:23.
- Card behavior per status [CODE] comm-mkt.jsx:89–163: tones for active/expired/disable/paid; buttons — commchannels have **no enable/disable**: `paid` → "Activate", `expired`/`inactive` → "Do Payment"; marketplace apps: `active` → Disable, `expired` → Renew, `disable` → Enable, `inactive` → Do Payment.
- Payment/activation transitions [CODE] comm-mkt.jsx:484–488: first purchase (no `firstActivation`) → `status:'paid'` (awaiting activation); renewal → `'active'`; activate action on `paid` routes by channel: **WhatsApp → Meta Service .Mng; Voice (and others) → Voice Service, Voice-account tab** [CODE] comm-mkt.jsx:379–382; app.jsx:170–179 (`falconGoMetaService` / `falconGoVoiceAccount`, `__vsInitial={viewAs:'client',tab:'account'}`).
- Show filter: all / active / expired / inactive [CODE] comm-mkt.jsx:256–259.
- Meta-asset sub-statuses (per connected WhatsApp number): `active` / `expired` (needs Re-auth) / `disabled` [CODE] meta-service-data.jsx:20–32; meta-service.jsx:31–44.
- Voice-account sub-statuses: account `active`/`disabled`; number `approved`/`pending` [CODE] voice-service-data.jsx / voice-service.jsx:96–105.

### 4.3 Where BSA reads (and should read) these

- In the mock, BSA does **not** gate its channel tabs on commchannel status — the WhatsApp/IVR-Voice tabs are always clickable [CODE] basic-app.jsx:2930–2935; no reference to `APPS_BY_TAB`, `seedMetaChannels`, or `seedVoiceAccounts` statuses inside basic-app.jsx (grep-verified). **ABSENT: commchannel-status gating in BSA.**
- The only status gating BSA implements is at **template** level: simulated Meta status `BSA_TPL_META = { wt5: 'Paused' }`, everything else 'Approved' [CODE] basic-app.jsx:524–526.
- [INFERRED — recommendation for the PRD] BSA should read, in order: (1) marketplace app a1 status (`active` required to open BSA); (2) the commchannel row for the channel being composed (`c2` WhatsApp Business / `c4` Voice IVR — require `active`; `paid` means purchased-not-activated; `expired`/`inactive`/`disable` should hide or disable that channel tab); (3) sender-level status — WhatsApp: Meta asset `status:'active'` (exclude `expired` awaiting re-auth and `disabled`); Voice: number `status:'approved'` within account `status:'active'`; (4) template-level `statusByMeta` (see §5).

---

## 5. BSA CONSUMPTION MAP (field-exact)

### 5.1 Compose entry & channel

- BSA has two channel workspaces: `whatsapp` and `voice`; `isVoice = channel === 'voice'` switches every consumed dataset [CODE] basic-app.jsx:693–697,2930–2935.

### 5.2 Sender ID select

- `senders = isVoice ? window.bsaVoiceSenders : window.bsaWaSenders` → flat `{id,label}` options; `sender` required in `canSend` [CODE] basic-app.jsx:695,917,796. Fields needed: just the display string (E.164-ish). Upstream models feeding it: Meta WhatsApp asset (`asset`, `status`) and voice account number (`value`, `status`) + account `status` (§3.4).

### 5.3 WhatsApp template selection — 3-tier

[CODE] basic-app.jsx:723–727,918–920; basic-app-data.jsx:10–17:
1. **Category** = `cats = ['Marketing','Utility','Authentication']` (matches template `serviceType`); selecting resets language + template.
2. **Language** = distinct `language` values of templates of that type (`langOpts`); disabled until category picked; resets template.
3. **Template Name** = templates filtered `type === cat && language === lang` (`tplOpts`); disabled until both picked.
Template record consumed: `{ id, name, type, language, refId }`. Hint text: "Choose one of your pre-created, approved templates." + Create Template link [CODE] basic-app.jsx:922.

### 5.4 Voice IVR template selection — 2-tier

[CODE] basic-app.jsx:723–726,918–920 (language row hidden `!isVoice`); basic-app-data.jsx:19–24:
1. **Category** = `['Dynamic','Static']` (matches IVR `serviceType`).
2. **Template Name** = templates of that type. Record consumed: `{ id, name, type, refId }` (no language tier).

### 5.5 Variables list

- `vars = window.bsaTemplateVars[tplId]` — ordered snake_case keys per template (`wt3: ['first_name','code']`, `vt1: ['first_name','amount']`, `vt2: []`…) [CODE] basic-app-data.jsx:95–99; basic-app.jsx:728.
- Uses: variable chips under the template select ( `{{var}}` code pills) [CODE] basic-app.jsx:923–925; **per-contact-group mapping grid** — every group must map a Destination column + a column for EVERY variable before send (`groupsReady`), progress "n/m mapped", unmapped columns flagged invalid [CODE] basic-app.jsx:767–796,961–996; **manual recipients table** — one input column per variable, all required before adding another recipient (max 3) [CODE] basic-app.jsx:754–763,1028–1051; **live preview substitution** — first group row via column map (or manual recipient values), falling back to `BSA_SAMPLE` values [CODE] basic-app.jsx:798–810,509–534.
- Upstream sources: WA → tokens extracted from header/body (`{{…}}`) + `samples` map (templates module §1.3); IVR → `ivr.variables[].key` (+ `type`, `sample`) (§2.4).

### 5.6 Template status gating

- `metaStatus = bsaTplMeta(tplId)`; `tplApproved = !tplId || metaStatus === 'Approved'`; a non-approved pick renders a warning — "This template is **Paused** on Meta — please select another template." — and blocks send (`canSend` includes `tplApproved`) [CODE] basic-app.jsx:734–736,796,926–928,524–526.
- Upstream: the full `statusByMeta` lifecycle (§1.7). [INFERRED] BSA list should pre-filter to internally `status:'approved'` templates and re-validate `statusByMeta ∈ Active*` at compose/send time (the mock demonstrates the re-validation path with 'Paused').

### 5.7 Message preview

- WhatsApp: `bsaWaTemplateBodies[tplId]` `{ title, body, footer, button }` rendered in `BsaPhonePreview` with `{{var}}` substitution from `previewVals` [CODE] basic-app-data.jsx:88–94; basic-app.jsx:729,1061–1065.
- Voice: BSA renders the **full IVR canvas read-only** — `ivrSeeds = window.seedTemplates.filter(x => x.ivr && x.ivr.nodes.length)`; picks the seed whose `ivr.type` equals the chosen template's `type.toLowerCase()`; renders `window.TplIvrStep2` with `readOnly inspect` [CODE] basic-app.jsx:730–732,1061–1064. So BSA consumes the entire templates-module IVR tree model (nodes/segments/variables) and the shared canvas component.

### 5.8 Voice transaction details & conversation

- Details/conversation resolve the same IVR seed by `txn.type` [CODE] basic-app.jsx:1766–1767,1929–1930.
- Node transcript = concatenation of `bsaIvrTranscripts[recording.name]` texts + inlined variable values per recipient [CODE] basic-app.jsx:1602–1609; transcript dictionary keyed by the exact recording filenames used in templates-data IVR seeds [CODE] basic-app-data.jsx:118–173.
- Call-outcome narration reads `node.terminal.type` (`transfer` → "was transferred to an agent", `return_root`, `return_parent`) and per-recipient call statuses `answered/live/busy/no_answer/unreachable/dropped/canceled/failed/ringing/sent/pending` [CODE] basic-app.jsx:1610–1631.
- Transfer terminals hand off to a scripted AI chat (`bsaAiHandoff`) with intent derived from template/seed name (`billing/travel/appointment/banking/support`), channel split WhatsApp/Instagram [CODE] basic-app.jsx:1633–1643; basic-app-data.jsx:179–223.
- Voice retry logic (compose): statuses `no_answer/busy/cancel/failed`, up to 3 attempts with wait minutes [CODE] basic-app.jsx:616–622,711–721,857–897.

### 5.9 Send gate & transaction record

- `canSend = !!sender && !!tplId && tplApproved && (selGroups.length>0 || manualValid.length>0) && groupsReady` [CODE] basic-app.jsx:796.
- Sent payload: `{ sender, templateId, recipientsCount, totalCost, groups, manual, scheduled, retry }` [CODE] basic-app.jsx:812–820. Grid rows denormalize template `name/language/type` via `bsaTxn` join [CODE] basic-app-data.jsx:36–45; transaction statuses `completed/in_progress/partial/canceled/failed/scheduled/deleted` [CODE] basic-app-data.jsx:48–85.
- Demo unit costs: voice 4, WhatsApp 2.5 per recipient [CODE] basic-app.jsx:758.

### 5.10 Summary table — model → BSA need

| BSA compose need | Exact fields consumed | Source model |
|---|---|---|
| Sender ID (WA) | display string; eligibility = Meta WA asset `asset` where `status:'active'` | meta-service-data.jsx:20–32 → basic-app-data.jsx:7 |
| Sender ID (Voice) | display string; eligibility = number `value` where number `status:'approved'` AND account `status:'active'` | voice-service-data.jsx:5–62 → basic-app-data.jsx:8 |
| WA 3-tier picker | `type` (Marketing/Utility/Authentication), `language`, `name`, `id`, `refId` | templates seeds (`serviceType`,`language`,`name`,`id`,`referenceId`) → bsaWaTemplates |
| IVR 2-tier picker | `type` (Dynamic/Static), `name`, `id`, `refId` | IVR template seeds → bsaVoiceTemplates |
| Variables list | ordered var keys per template; per-var sample fallback | WA: `{{token}}`s + `samples`; IVR: `ivr.variables[].{key,type,sample}` → bsaTemplateVars |
| Status gating | internal `status === 'approved'`; Meta status `Approved/Active*` else warn+block (`Paused` demoed) | template `status`, `statusByMeta`, `metaQuality` → bsaTplMeta |
| WA preview | `title/header`, `body`, `footer`, first button label | template body parts → bsaWaTemplateBodies |
| IVR preview | whole `ivr` object (nodes, segments, keys, goto, variables) + shared `TplIvrStep2` canvas | templates-data.jsx IVR seeds via `window.seedTemplates` |
| Voice conversation | `segments[].name` → transcript text; `terminal.type`; variable values per recipient | IVR nodes + bsaIvrTranscripts |
| Channel availability | ABSENT in mock; should read commchannel `status` (c2/c4), app a1 `status` | apps.jsx:23,32–41; comm-mkt.jsx actions |

---

## 6. GAPS / ABSENCES (explicit)

1. **ABSENT — `grace` commchannel status**: not present anywhere in this codebase; status set is `active|paid|expired|inactive|disable` (+ user statuses). If the PRD requires a grace period, it is net-new.
2. **ABSENT — BSA channel gating on commchannel status**: BSA tabs are unconditional in the mock; gating is a PRD requirement to specify ([INFERRED] recommendation in §4.3).
3. **ABSENT — live linkage** between `bsaWaSenders` and Meta assets (different seed numbers); linkage for voice senders is consistent-by-value but implicit (§3.4).
4. **INCONSISTENCY — variable naming style**: templates wizard enforces `{{1}}` (Number) or lowercase `{{name}}` (Name-type), seed template `'30'` uses `{{FirstName}}` CamelCase (would fail the wizard's own Name regex), BSA uses snake_case `{{first_name}}`. The BSA snake_case + IVR `^[a-z][a-z0-9_]{1,31}$` styles agree; the WA wizard Name-regex `^[a-z][a-z0-9_]*$` agrees too — CamelCase seed is the outlier.
5. **INCONSISTENCY — IVR `terminal` authoring**: seeds carry rich `terminal` values; the builder writes `terminal:null` and models returns via `goto` segments. Downstream consumers (BSA call narration, review tree) read `terminal` — the PRD should reconcile authoring vs consumption.
6. **ABSENT — SMS / Email / Push templates**: create menu shows SMS/Email as "coming soon" toasts [CODE] templates.jsx:557–563; template-mgmt config already reserves `push`/`sms` channels.
7. **Template channel naming drift**: templates list filter uses `'IVR Voice'`; templates.jsx channel filter list uses `'Voice'` in one spot [CODE] templates-list.jsx:255 vs templates.jsx:297; details treats both `'IVR Voice' || 'Voice'` [CODE] templates-details.jsx:78.
