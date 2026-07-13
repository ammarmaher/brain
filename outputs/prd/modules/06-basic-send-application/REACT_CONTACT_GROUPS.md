*** PRD Understanding - Basic Send Application - REACT_CONTACT_GROUPS (contact-group model consumed by BSA) ***

# Contact Group Model — as BSA (Basic Send Application) Consumes It
## Deep extraction: recipients source + variable mapping

**Analyst scope note.** Primary sources ordered by the task:
- `C:/Falcon/Source_of_truth_theme/latest 07062026/falcon-ux (4)/admin/contact-groups.jsx` (879 lines — page orchestrator, list, details, share editor, edit form)
- `C:/Falcon/Source_of_truth_theme/latest 07062026/falcon-ux (4)/admin/contact-groups-data.jsx` (115 lines — seed model)
- `C:/Falcon/Source_of_truth_theme/latest 07062026/falcon-ux (4)/admin/contact-groups-flow.jsx` (818 lines — create/edit wizard)

Because the task is "as **BSA** consumes it", I additionally read the actual consumer in the same non-ignored `admin/` folder:
- `C:/Falcon/Source_of_truth_theme/latest 07062026/falcon-ux (4)/admin/basic-app.jsx` (BSA compose wizard — group picker, mapping grid, preview)
- `C:/Falcon/Source_of_truth_theme/latest 07062026/falcon-ux (4)/admin/basic-app-data.jsx` (BSA seed — `bsaContactGroups`, template variables)
- `C:/Falcon/Source_of_truth_theme/latest 07062026/falcon-ux (4)/admin/i18n.jsx` (label evidence for column/field semantics)

Ignored directories (`uploads/`, `admin.bak.*`, `_edit-bak.*`, `replica/`, `standalone/`) were **not** read; grep hits inside them were discarded.

**Source-tag legend:** `[CODE] file:line` = read in this session. `[MEMORY] <path>` = entry from the shared agent-memory index at `C:\Users\User\.claude\projects\C--Falcon\memory\MEMORY.md` (declared explicitly because it is neither PRD nor code). `[INFERRED]` = my reasoning, flagged. PRD and Vault were **not consulted** for this task (ABSENT from inputs given to me).

---

## 1. CONTACT GROUP MODEL (entity fields)

### 1.1 Group entity — management-page shape (`seedContactGroups`)

[CODE] contact-groups-data.jsx:4-51 — each contact group row carries:

| Field | Type / example | Where surfaced | Evidence |
|---|---|---|---|
| `id` | string, numeric-looking (`'234'`, `'123'`) | List column "ID" (`t.cgColId`) | [CODE] contact-groups-data.jsx:6; contact-groups.jsx:288,309; i18n.jsx:893 (`cgColId: 'ID'`) |
| `name` | string (`'NewlyJoining'`, `'Adv June'`) | List column "Contact name"; details field "Name" | [CODE] contact-groups-data.jsx:6; contact-groups.jsx:290,310,379; i18n.jsx:894,904 |
| `referenceId` | string, free-form (`'111222'`, `'AAAEEE'`, `'Frg4'`, `'JJJH764'`) | List column "Reference ID"; details field; editable in Edit | [CODE] contact-groups-data.jsx:6,12,20; contact-groups.jsx:291,311,380,561-562; i18n.jsx:895,905 |
| `contactId` | string (`'8841'`, `'7421'`) — the **stable per-record key** | Details field "Contact ID"; **locked (read-only)** in Edit form; used as the delete key | [CODE] contact-groups-data.jsx:6; contact-groups.jsx:381,565-566 (`is-locked`, readOnly), 634 (`removedIds` keyed by `contactId`), 715 (`n.add(deleteRow.contactId)`); i18n.jsx:906 |
| `createdBy` | object `{ name, email }` (email values are username-like: `'aramcoao'`, `'n.joudeh'`) | List "Created by" renders name + email stacked; details field | [CODE] contact-groups-data.jsx:7,13; contact-groups.jsx:312-317,384; i18n.jsx:896,909 |
| `createdAt` | string `'27-Mar-2025 | 02:42 pm'` — date and time joined by a pipe; UI splits on `'|'` | List "Creation date" (2 lines); details "Created at"; date part reused as locked "Creation Date" in Edit | [CODE] contact-groups-data.jsx:8; contact-groups.jsx:318 (`r.createdAt.split('|')`), 383, 536 (`(row.createdAt || '').split('|')[0].trim()`), 568-570; i18n.jsx:897,908,939 |
| `uploaded` | number (`151`, `32`, `632`) — count of uploaded contacts | List column "Uploaded"; details field "Uploaded contacts" | [CODE] contact-groups-data.jsx:8; contact-groups.jsx:293,319,382; i18n.jsx:898,907 |
| `status` | enum string: `'inProgress' \| 'completed'` | List + details status pill "In Progress"/"Completed" | [CODE] contact-groups-data.jsx:3 (comment: `status: 'inProgress' \| 'completed'`), 9,15; contact-groups.jsx:195-202 (CgStatusPill) |
| `deleted` | boolean flag (optional) — soft-delete marker, orthogonal to `status` | Grey row styling; row filtered out of Client view; kept (grey) in Falcon view | [CODE] contact-groups-data.jsx:15,41; contact-groups.jsx:193-194 (comment: "a deleted record keeps its real status here and is marked separately by the `deleted` flag (grey row)"), 303-307 (`className={isDeleted ? 'deleted' : ''}`), 696 |
| `deletedBy` | object `{ name, email }` (optional) | Details "Deleted by" — only when `row.deleted` | [CODE] contact-groups-data.jsx:16,42; contact-groups.jsx:386-388; i18n.jsx:911 |
| `deletedAt` | string, same `'dd-MMM-yyyy | hh:mm am'` format (optional) | Details "Deletion date" (falls back to createdAt date part) | [CODE] contact-groups-data.jsx:16,42; contact-groups.jsx:389; i18n.jsx:910 |
| `sharedWith` | `string[]` of user **display names** (augmented at load with 1–13 extra names for varied "+N" chips) | List "Shared with" chip (first name + "+N"); details full chip list; editable via Share | [CODE] contact-groups-data.jsx:9,55-63 (`CG_SHARE_EXTRA` merge); contact-groups.jsx:321-323,392-397; i18n.jsx:900,912 |

Duplicate-key caveat: the seed reuses `id` values (`'635'` twice at data.jsx:26,38; `'423'` twice at 32,46) while `contactId` is unique — consistent with the UI keying deletes on `contactId`, not `id`. [CODE] contact-groups-data.jsx:26,32,38,46 + contact-groups.jsx:634,715. [INFERRED] `contactId` is the de-facto primary key of a group record in this mock; `id` behaves like a display/short id.

`window` exports: `seedContactGroups`, `seedContactGroupRows`, `seedSharedGroups`, `seedShareUsers` [CODE] contact-groups-data.jsx:111-114.

### 1.2 Contacts inside a group — details-table row shape

[CODE] contact-groups-data.jsx:66-77 (`seedContactGroupRows`): rows are objects
`{ first, last, email, mobile, company, notes }` — e.g. `{ first: 'Ahmad', last: 'Hassan', email: 'ahmad@aramco.sa', mobile: '0528726398', company: 'Aramco', notes: 'VIP Clients' }`. Empty cells use the literal placeholder string `'---'` (data.jsx:70,71).

Rendered under headers `#`, "First name", "Last name", "Email", "Mobile", "Company", "Notes" [CODE] contact-groups.jsx:417-425 + i18n.jsx:917-922, with TablePagination (default page size 10 — contact-groups.jsx:640, consistent with the platform-wide rule [MEMORY] feedback_data_table_default_page_size_10.md).

**Mock limitation (important for PRD):** the details/edit contacts table always reads the single global `window.seedContactGroupRows` — every group shows the same 10 contacts. [CODE] contact-groups.jsx:371 (`const allRows = window.seedContactGroupRows || []`), 534. [INFERRED] In the real system this must be per-group row data keyed by the group's own uploaded file.

### 1.3 Wizard-created group shape (the authoring model)

[CODE] contact-groups-flow.jsx:712-720 — the create-wizard form state, i.e. what a group *is* at creation time:

```js
{
  name:        string,                     // required, max 30 chars (flow.jsx:729-731)
  referenceId: string,                     // optional (flow.jsx:130-138)
  file:        { name, size } | null,      // the uploaded sheet (flow.jsx:110)
  columns:     [{ name, hidden, disabledRules[] }],  // per-column model (flow.jsx:111)
  rows:        string[][],                 // row-major cells, positionally aligned to columns (flow.jsx:112, 15-26)
  firstRowHeader: boolean,                 // (flow.jsx:113, 360-377)
  shared:      string[]                    // user IDs from ACG_SHARE_USERS (flow.jsx:719, 486-492)
}
```

4 wizard steps: `upload` ("Upload & Group details") → `preview` ("Preview & Configure") → `share` ("Share group") → `review` ("Review & create") [CODE] contact-groups-flow.jsx:6-11.

### 1.4 Column model + typing

- Column object = `{ name: string, hidden: boolean, disabledRules: string[] }` [CODE] contact-groups-flow.jsx:111,716.
- **Column typing: ABSENT.** No data-type attribute exists anywhere in the column model — no email/phone/number/date typing, no format validation of cell values. All validation is on the **column NAME**, and all cell values are opaque strings. [CODE] contact-groups-flow.jsx:41-49 (rules test `v` = the name only).
- Column-NAME validation rules (each independently disable-able per column) [CODE] contact-groups-flow.jsx:41-49:
  1. `required` — non-empty
  2. `alnum` — `/^[A-Za-z0-9_]*$/`
  3. `start` — must start with a letter
  4. `unique` — unique among non-hidden columns
  5. `symbols` — no special characters (same regex as `alnum`)
  6. `trim` — no leading/trailing spaces
  7. `length` — 2–32 chars
- Normalization: spaces → underscores as you type (`acgNormalizeCol`, flow.jsx:51; input at flow.jsx:300) with hard 32-char cap (flow.jsx:296-300); UI note "Spaces will be replaced with underscores ( _ )" (flow.jsx:406-410).
- Headers containing spaces are seeded with `disabledRules: ['alnum','symbols']` so the raw human header ("First Name") passes until renamed [CODE] contact-groups-flow.jsx:111,370.
- Hidden columns: `hidden: true` short-circuits validation (`acgEvalCol` returns `failed: []`, flow.jsx:55), removes the column from the preview (`visibleCols` filter, flow.jsx:353) and from the Review table (flow.jsx:604) — "Columns (Uncheck To Ignore)" (flow.jsx:381-383). [INFERRED] Hidden columns are excluded from the persisted group.
- Step-2 gate: cannot advance while any visible column fails an enabled rule [CODE] contact-groups-flow.jsx:733-736,750-752.

### 1.5 BSA-facing group contract (`bsaContactGroups`) — what BSA actually consumes

[CODE] basic-app-data.jsx:26-33:

```js
const bsaContactGroups = [
  { id: 'cg1', name: 'Contact Group 1', count: 257, columns: ['mobile', 'first_name', 'last_name', 'age', 'gender'] },
  { id: 'cg2', name: 'VIP Customers',   count: 96,  columns: ['phone', 'name', 'tier'] },
  { id: 'cg3', name: 'New Leads',       count: 120, columns: ['mobile', 'first_name', 'city'] },
  { id: 'cg4', name: 'Partner Leads',      count: 340, columns: ['mobile', 'first_name', 'company'], shared: true },
  { id: 'cg5', name: 'Regional Team List', count: 512, columns: ['phone', 'name', 'region'],         shared: true },
];
```

BSA's minimum read model per group is exactly **4 + 1 fields**: `id`, `name`, `count` (recipient count for estimation), `columns` (ordered snake_case names), and optional `shared: true` (provenance flag). [CODE] basic-app-data.jsx:27-33; consumed at basic-app.jsx:697 (`window.bsaContactGroups`), 757 (count summed for recipientCount), 963 (`grp.columns`), 185 (`g.shared` tab filter).

- The snake_case, lowercase column names (`first_name`, `mobile`) are exactly the output of the CG wizard's normalization (spaces→underscores) — the two models are consistent end-to-end. [CODE] contact-groups-flow.jsx:51,409 vs basic-app-data.jsx:28. [INFERRED] the CG wizard's cleaned column names are the canonical vocabulary the BSA mapping grid later binds against.
- BSA does **not** receive rows in the group object. Row data for the "first two rows" mapping preview is synthesized separately (see §3.4). [CODE] basic-app.jsx:527-534.
- Naming divergence to reconcile in the PRD: CG page model uses `uploaded` for the contact count and free string ids; BSA model uses `count` and `cg*` ids; CG page model has no `columns` field on the group row at all (columns only exist inside the wizard form). ABSENT: any code that maps `seedContactGroups` → `bsaContactGroups`; they are two independent seeds. [CODE] contact-groups-data.jsx:4-51 vs basic-app-data.jsx:27-33.

---

## 2. SHARING MODEL (own vs shared-with-me)

### 2.1 Perspectives and roles on the Contact Groups page

- Page opens with a Falcon/Client perspective picker (same pattern as Templates/Contracts) [CODE] contact-groups.jsx:205-230,676-678.
- Client view has a visual "Viewing as" role selector: `account-owner | node-admin | normal-user` [CODE] contact-groups.jsx:233-244,629.
- Derived flags [CODE] contact-groups.jsx:683-686:
  - `isOwnerAdmin = !isFalcon && (role === 'account-owner' || role === 'node-admin')`
  - `isNormalUser = !isFalcon && role === 'normal-user'`
  - `showTree = isFalcon || isOwnerAdmin` (hierarchy tree hidden for normal users)
  - `onSharedTab = isNormalUser && cgTab === 'shared'`

### 2.2 Own vs shared-with-me as modeled

- **Normal User** gets two tabs: "Contact Groups" (own) vs "Shared Groups" (shared with me) [CODE] contact-groups.jsx:630,795-801; i18n.jsx:927-928.
- Data source switches per tab: `baseRows = onSharedTab ? window.seedSharedGroups : window.seedContactGroups` [CODE] contact-groups.jsx:695.
- `seedSharedGroups` = groups **"created by OTHER users and shared with the logged-in user"** — same entity shape (id/name/referenceId/contactId/createdBy/createdAt/uploaded/status/sharedWith), used for "More Details only" [CODE] contact-groups-data.jsx:79-100 (comment at 79-80).
- Deleted-row visibility: `listRows = baseRows.filter(r => (isFalcon || onSharedTab || !r.deleted) && !removedIds.has(r.contactId))` — Falcon sees soft-deleted rows (grey), Client "own" list hides them [CODE] contact-groups.jsx:696.

### 2.3 Capability matrix (as coded)

[CODE] contact-groups.jsx:698-701 (+ per-row suppression for deleted rows at 335-337):

| Capability | Falcon view | Owner/Admin (client) | Normal User — own tab | Normal User — Shared tab |
|---|---|---|---|---|
| More Details | yes | yes | yes | yes (only action) |
| Share | no | **yes** (`canShareRows = isOwnerAdmin`) | no | no |
| Edit | no | yes (`!isFalcon && !onSharedTab`) | yes | no |
| Delete | no | yes (`!isFalcon && !onSharedTab`) | yes | no |
| Create group | no (button hidden when `isFalcon`) | yes | yes (own tab) | no (`!onSharedTab`) |

Comment in code: "Per-row capabilities. 'Everything is mine' → Edit/Delete on every row (not Falcon, not Shared tab)." [CODE] contact-groups.jsx:698. Deleted rows additionally lose Share/Edit/Delete [CODE] contact-groups.jsx:335-337.

### 2.4 Share write path

- Share action opens Details with `shareMode`, drafting `shareDraft = [...r.sharedWith]`; Save mutates `activeRow.sharedWith = [...shareDraft]` + toast "Sharing updated ✓" [CODE] contact-groups.jsx:703-712.
- Share pool = `seedShareUsers`: a flat list of 18 **display-name strings**, documented as "Normal Users within the account an owner/admin can share a group with" [CODE] contact-groups-data.jsx:102-109.
- Two picker widgets exist: `CgShareCombo` (Select-All + checkbox multi-select, mirrors the Edit-Template picker) [CODE] contact-groups.jsx:455-525, and chip-based `CgShareEditor` [CODE] contact-groups.jsx:119-169 (defined; details view uses CgShareCombo at 395).
- The Edit form also exposes `sharedWith` as an editable multi-select alongside name/referenceId (contactId and creation date locked) [CODE] contact-groups.jsx:528-576,864-868.
- Wizard Step 3 ("Share group") uses a richer user object `{ id, name, role, email }` (`ACG_SHARE_USERS`, 8 users incl. roles Admin/Manager/Operator/Viewer/Normal User) and stores selected **ids** in `form.shared`; label reads "Shared With — Normal User (Multiple Select)"; supports search + All Users toggle + Selected Users panel [CODE] contact-groups-flow.jsx:29-38,467-597.
- **Inconsistency to flag:** persisted list model stores share targets as display-name strings (`sharedWith`), while the wizard models them as user ids — ABSENT any id↔name reconciliation in the mock. [CODE] contact-groups-data.jsx:9 vs contact-groups-flow.jsx:719.

### 2.5 How BSA sees sharing

- The BSA "Add Contact Group" picker has exactly two provenance tabs: **"Created by me"** vs **"Shared with me"**, filtered purely by the boolean `g.shared` flag on the group [CODE] basic-app.jsx:175 (`tab = 'mine' | 'shared'`), 185 (`(tab === 'shared' ? g.shared : !g.shared)`), 196-197 (labels `t.bsaCreatedByMe || 'Created by me'`, `t.bsaSharedWithMe || 'Shared with me'`).
- After selection, own and shared groups are functionally identical recipient sources — same chips, same mapping grid, same counting. No further permission gating exists in BSA. [CODE] basic-app.jsx:950-996. ABSENT: any BSA handling of share revocation mid-compose or per-share permission levels (view/use/edit).
- Picker behavior: search by name, one-click add (single-select per open; already-added groups are hidden), shows per-group `count`; disabled until a template is chosen AND all already-selected groups are fully mapped [CODE] basic-app.jsx:184-186,199-211,947.
- Backend reality cross-reference (not in the mock): the platform's share model server-side is a nested `sharePolicy` (voice-record read-side rewire [MEMORY] project_voice_record_sharepolicy_read_side_2026_07_06.md) and contact-group share/edit/delete is PES-enforced (403 fix [MEMORY] project_contact_group_share_403_pes_baseurl_fix_2026_06_20.md; PR 42603 review [MEMORY] project_pr42603_contact_group_remove_view_auth_rules_keep_pes_2026_06_21.md). [INFERRED] the PRD should map the mock's `sharedWith: string[]` / `shared: true` onto that sharePolicy/PES model rather than inventing a new one.

---

## 3. DESTINATION + MAPPING (what BSA's mapping grid needs)

### 3.1 Destination column identification

- Per selected group, BSA keeps `groupCfg: { [gid]: { mobileCol, varMap: { [var]: column } } }` — **`mobileCol` IS the destination column** [CODE] basic-app.jsx:704 (state + shape comment), 748.
- In the mapping dropdown the destination is the sentinel field id `'__dest'`, labeled **"Destination"** (`t.bsaDestination`); the unmapped sentinel is `'__none'` → "Not mapped" [CODE] basic-app.jsx:772-773.
- **No auto-mapping in the current build**: the config-seeding effect explicitly leaves `mobileCol: ''` with comment "No auto-mapping — the user picks which columns map to Destination / each variable." [CODE] basic-app.jsx:738-752 (comment at 747).
- **Latent heuristics exist but are unwired**: `bsaAutoMobile(cols)` picks the first column matching `/mobile|phone|msisdn|number/i` (else `cols[0]`), and `bsaAutoCol(cols, name)` does exact-then-substring case-insensitive name matching for variables [CODE] basic-app.jsx:522-523. [INFERRED] these are the intended auto-suggest rules if the PRD wants "smart defaults"; today they are dead code in the compose path.
- Manual recipients have a parallel Destination concept: a free-text input placeholdered "Phone, email, or username" [CODE] basic-app.jsx:1033,1041.

### 3.2 Template variables — the other side of the binding

- Variables per template come from `bsaTemplateVars[tplId]` — e.g. `wt3: ['first_name','code']`, `wt4: ['first_name','ticket']`, voice `vt1: ['first_name','amount']`; file comment: "Template bodies (for the phone preview) + variables (for the mapping grid)" [CODE] basic-app-data.jsx:87-99.
- Selected template's variables render as `{{var}}` chips in step 1 [CODE] basic-app.jsx:923-925. Template bodies embed `{{var}}` tokens (basic-app-data.jsx:88-94).
- Recipients step is locked until a template is chosen ("Choose a template name first to add contact groups or recipients") — the variable set must exist before mapping can start [CODE] basic-app.jsx:941,947.

### 3.3 The mapping grid — exact mechanics (what a PRD mapping grid must reproduce)

Per selected group chip (clicking the chip toggles its map card; exactly one map/preview panel open at a time — `activePanel`) [CODE] basic-app.jsx:770-795,953-954:

1. **Inputs**: `grp.columns` (ordered names), template `vars`, current `cfg = { mobileCol, varMap }`, and 2 sample sheet rows (`bsaGroupRows(grp)`) [CODE] basic-app.jsx:963.
2. **Required set**: `need = 1 + vars.length` (Destination + every variable); progress badge "done/need mapped" where `done = (mobileCol?1:0) + vars.filter(v => varMap[v]).length` [CODE] basic-app.jsx:964,969.
3. **"Fields to map" checklist chips**: Destination + each `{{var}}`, ticked when bound [CODE] basic-app.jsx:972-976.
4. **Grid layout** (column-oriented binding): an Excel-like table whose **first header row is a "Map to…" dropdown per sheet column** (options: Destination / each `{{var}}` / Not mapped), **second header row is the column name**, body = the group's first two data rows. Mapped columns get `is-dest` / `is-var` highlighting [CODE] basic-app.jsx:977-992. Guide text: "Use the dropdown above each column to link it to a template field." (971).
5. **Binding invariants** (`assignColField`) [CODE] basic-app.jsx:776-782:
   - One column ↔ one field. Re-assigning a column first clears its old field (mobileCol emptied / varMap entries emptied).
   - Assigning a field already held by another column **moves** it ("assigning a taken var moves it here").
   - Setting `'__dest'` writes `mobileCol = col`; other field ids write `varMap[field] = col`.
   - A per-column checkbox override (`colChecked`) exists; unchecking clears the assignment [CODE] basic-app.jsx:770,783.
6. **Validation surfacing**: while `done < need`, every unmapped column's dropdown is flagged invalid [CODE] basic-app.jsx:982.
7. **Completeness gates**:
   - `groupsReady = every selected group has mobileCol && all vars mapped` [CODE] basic-app.jsx:767-768.
   - Adding another group is disabled until current ones are ready [CODE] basic-app.jsx:947.
   - `canSend = sender && tplId && tplApproved && (groups || manual) && groupsReady` [CODE] basic-app.jsx:796.
8. **Per-group independence**: each group maps its own columns to the same variable set — cg2 can bind `{{first_name}} ← name` while cg1 binds `{{first_name}} ← first_name`. [INFERRED from the per-gid `groupCfg` keying, CODE basic-app.jsx:704,742-750.]
9. **Manual recipients** fill the same slots literally: per-row Destination input + one input per `{{var}}`; max 3; the current row must be complete (destination + all vars) before another can be added; only rows with a non-blank phone count (`manualValid`) [CODE] basic-app.jsx:705,716,754-756,761,1028-1051.
10. **Counting / cost**: `recipientCount = Σ group.count + manualValid.length`; est. cost = `recipientCount × costPerMsg` (2.5 WA / 4 voice); confirm modal adds an "Allow duplicate recipients" toggle — dedup across sources is a send-time option [CODE] basic-app.jsx:757-758,796,1084; 472-507 (BsaSendConfirm, allowDup at 494-498).
11. **Send payload**: `{ sender, templateId, recipientsCount, totalCost, groups: selGroups (ids), manual, scheduled, retry }` [CODE] basic-app.jsx:812-819. **The mapping (`groupCfg`) is NOT in the payload** — ABSENT. [INFERRED] a real send API must carry, per group: `groupId`, `destinationColumn`, and `variableMap {templateVar → column}`; the PRD should add this explicitly.
12. **Transaction-side recipients model** (Outbox rows): `recipientsList: string[]` (group names) + `manualRecipients: string[]` (numbers); rendered as first source + "+N" popover "All recipients (N)" distinguishing group vs manual glyphs [CODE] basic-app-data.jsx:42,49-51; basic-app.jsx:58-61,82-117.

### 3.4 First-recipient preview data source

[CODE] basic-app.jsx:798-810 (`previewVals`), comment at 798: "Live preview values — first recipient: first group's first sheet row (via the column map), else first manual recipient."

- If ≥1 group selected: take `selGroups[0]`, its `cfg`, and `row0 = bsaGroupRows(grp)[0]`; for each var `v`: `previewVals[v] = row0[cfg.varMap[v]] || bsaSampleVal(v)` (unmapped vars fall back to a canned sample).
- Else: first valid manual recipient's `vars[v]`, falling back to the literal token `{{v}}`.
- Fed into `BsaPhonePreview` (WhatsApp phone mockup) at basic-app.jsx:1065.
- **Where the "sheet rows" come from in the mock**: `bsaGroupRows(group)` synthesizes 2 rows from `BSA_COL_SAMPLES`, a per-column-name sample dictionary (`mobile/phone/msisdn` → phone numbers, `first_name` → ['Ahmed','Sara'], `tier` → ['Gold','Silver'], …), fallback `bsaSampleVal` [CODE] basic-app.jsx:527-534,510-511. So the grid's "first two rows" and the phone preview's "first recipient" are canned per column name, not real file rows. [INFERRED] Real implementation requires an endpoint returning the group's first N actual rows (N=2 for the grid preview, first row for the message preview).
- Post-send, per-recipient Details preview uses indexed sample pools `BSA_RVALS` (`bsaRecipVal(v, i)`) so each recipient shows its own values [CODE] basic-app.jsx:512-519,1216.

### 3.5 What BSA's mapping grid needs — consolidated requirements ([INFERRED] synthesis of the code facts above)

Per contact group: `id`, `name`, `count`, ordered `columns[]`, `shared` provenance, first-2-rows sample data.
Per template: `variables[]` (ordered), body for live preview, approval status (Meta sync — `bsaTplMeta`, basic-app.jsx:524-526,734-736,926-928).
Per binding: `{ groupId, destinationColumn (exactly one, required), variableMap: var→column (total, required), unmappedColumns (allowed, ignored) }`, with invariants: 1 column ↔ 1 field, reassignment steals, completeness gate `1 + |vars|`.
UX state: one open panel at a time; progress counter; invalid flags on unmapped columns while incomplete; picker locked until template chosen and prior groups complete.

---

## 4. CSV / IMPORT SHAPE (column origin)

- **Accepted files**: drag-drop or browse; `accept=".csv,.xlsx,.xls"`; UI copy "supports .xlsx .xls .csv files / max size 20MB" [CODE] contact-groups-flow.jsx:161,187.
- **On accept (mock)**: stores `file = { name, size }` and seeds `columns` from `ACG_SAMPLE_HEADERS` and `rows` from `ACG_SAMPLE_ROWS`; sets `firstRowHeader = true`. No real parsing occurs — every upload yields the same sample sheet [CODE] contact-groups-flow.jsx:105-114. [INFERRED] real implementation parses the sheet server- or client-side.
- **Canonical sample sheet** [CODE] contact-groups-flow.jsx:14-26:
  - Headers: `['First Name', 'Last Name', 'Email', 'Mobile', 'Company', 'Notes']`
  - 10 data rows, `string[][]`, positionally aligned to headers; `'---'` as the empty marker (e.g. `['Lina','Ibrahim','---','0528726398','Aramco','New Lead']`).
- **Column origin = file header row**: hint under the drop zone — "First row of the file is treated as column names. You'll review and rename them in the next step." [CODE] contact-groups-flow.jsx:192-195.
- **"The first row is the header" toggle** (Step 2): checked → column names derived from the first row (space-bearing names get `alnum`/`symbols` rules disabled); unchecked → names cleared and rules re-enabled, forcing manual labeling before Next [CODE] contact-groups-flow.jsx:356-377 (comment at 357-359). Mock caveat: `rows` are not respliced when toggling (header row never moves in/out of the data) — [INFERRED] mock shortcut.
- **Cleanup pipeline**: rename inline (spaces→`_`, ≤32 chars) → toggle per-column visibility ("Uncheck To Ignore") → per-column rule popover with disable/restore ("Disabled" section) [CODE] contact-groups-flow.jsx:286-315,201-275,379-401.
- **Review step**: shows Name, Reference ID, "Original Contact file" chip (name+size), **"Number of uploaded contact" = `data.rows.length`**, Shared with chips, and a read-only Data Preview of visible columns only [CODE] contact-groups-flow.jsx:601-704 (count at 640-643).
- **Persistence of the file**: details/edit screens offer **"Download Original File"** and **"Download Contact Group"** buttons — the raw upload is retained alongside the processed group [CODE] contact-groups.jsx:405-411,580-584; i18n.jsx:915-916. [INFERRED] two artifacts per group: original sheet + normalized group export.
- **Lifecycle tie-in**: group `status` (`inProgress`/`completed`) plus the `uploaded` count [INFERRED] represent the import-processing lifecycle of the uploaded file (in progress until ingestion completes); the code never transitions it (mock).
- **Origin chain to BSA**: file header row → normalized snake_case column names (wizard) → `columns[]` on the BSA group object → mapping-grid vocabulary → `varMap`/`mobileCol` bindings → per-recipient variable values at send time. [INFERRED] from contact-groups-flow.jsx:51,111 + basic-app-data.jsx:28 + basic-app.jsx:704,805.

---

## 5. Gaps, contradictions, mock limitations (for the PRD to resolve)

1. **Same contacts for every group** — details/edit tables read a single global `seedContactGroupRows` [CODE] contact-groups.jsx:371,534. Real per-group row storage/API is ABSENT.
2. **Mapping not persisted in the send payload** — `groupCfg` never leaves the composer [CODE] basic-app.jsx:812-819. The send/schedule API contract needs `destinationColumn` + `variableMap` per group.
3. **Two disconnected group models** — CG page (`id/name/referenceId/contactId/uploaded/status/sharedWith…`, no columns) vs BSA (`id/name/count/columns/shared`). No shared source or transform exists between them [CODE] contact-groups-data.jsx:4-51 vs basic-app-data.jsx:27-33.
4. **Share-target identity mismatch** — persisted `sharedWith` = display-name strings; wizard `shared` = user ids from a role-bearing user object [CODE] contact-groups-data.jsx:9,104-109 vs contact-groups-flow.jsx:29-38,719.
5. **No column typing** — destination-column correctness (is it a phone? an email?) is entirely the user's responsibility; the only phone-shaped intelligence is the unwired `bsaAutoMobile` regex [CODE] basic-app.jsx:523. Cell-value validation is ABSENT in both wizard and BSA.
6. **`id` non-unique in seed; `contactId` is the real key** [CODE] contact-groups-data.jsx:26/38,32/46; contact-groups.jsx:715.
7. **Auto-mapping intentionally off** ("No auto-mapping — the user picks…") though helpers exist — a product decision point [CODE] basic-app.jsx:747 vs 522-523.
8. **Status vocabulary**: CG list pill only ever shows Completed/In Progress; i18n also defines `cgStatusDeleted: 'Deleted'` (i18n.jsx:892) which the pill never renders — deletion is a flag, not a status [CODE] contact-groups.jsx:193-199.
9. **Backend alignment** (outside mock): contact-group share/edit/delete are PES-gated and the platform share read-model is `sharePolicy` — see [MEMORY] entries cited in §2.5; the FE contact-group edit/share features already shipped against real endpoints per [MEMORY] project_contact_group_edit_feature_fe_2026_06_20.md and project_contact_group_share_all_users_multiselect_hydration_2026_06_20.md. The mock's semantics should be reconciled with those, not duplicated.
