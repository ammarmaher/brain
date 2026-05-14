# Tabs Source Discovery (React + HTML)

Date: 2026-05-14
Scope: tabs only above `falcon-node-details-section`
Sources used: React JSX (primary), HTML latest (CSS shell only — DOM is React-rendered)

---

## A. Tab header strip

### A.1 Structure (React)

`[REACT]` `hierarchy.jsx:1191-1200` — Tab list is **conditional on `isRoot`**:

```jsx
const tabs = isRoot ?
  [ { id: 'hierarchy',  label: t.tabHierarchy },
    { id: 'settings',    label: t.tabSettings } ] :
  [ { id: 'hierarchy',    label: t.tabHierarchy },
    { id: 'commChannels', label: t.tabCommChannels },
    { id: 'appsServices', label: t.tabAppsServices },
    { id: 'settings',     label: t.tabSettings } ];
```

`[REACT]` `hierarchy.jsx:1246-1277` — Strip markup:

```jsx
<div className="tabs-bar tabs-bar-with-toggle">
  <div className="tabs-bar-left">
    {tabs.map((tb) =>
      <button className={`tab ${activeTab === tb.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tb.id)}>
        {tb.label}
      </button>)}
  </div>
  {activeTab === 'hierarchy' && (
    <div className="view-toggle tabs-bar-toggle" role="tablist" aria-label="Hierarchy view">
      <button role="tab" aria-selected={hierarchyView === 'tree'} ...>{t.viewTree}</button>
      <button role="tab" aria-selected={hierarchyView === 'chart'} ...>{t.viewChart}</button>
    </div>
  )}
</div>
```

### A.2 Tab labels (i18n.jsx:85-88, 753-756)

| key | EN | AR |
|---|---|---|
| `tabHierarchy` | `Hierarchy` | `الهيكل` |
| `tabCommChannels` | `CommChannels & Services` | `قنوات الاتصال والخدمات` |
| `tabAppsServices` | `Apps & Services` | `التطبيقات والخدمات` |
| `tabSettings` | `Settings` | `الإعدادات` |
| `viewTree` | `List` | `قائمة` |
| `viewChart` | `Tree` | `شجرة` |

> `[INFERRED]` Naming oddity: the EN tab is **"CommChannels & Services"** (one word, no space). Brain SK spec calls it "Communication Channels" — log conflict.

### A.3 Visual styles (styles.css)

`[HTML]` `latest.html:181 (CSS) — .tabs-bar @ line 734-741`:
```css
.tabs-bar { display: flex; padding: 0 24px; border-bottom: 1px solid var(--border-2);
            gap: 28px; flex-shrink: 0; background: white; }
```

`[HTML]` `.tab @ 742-756`:
```css
.tab { padding: 18px 4px 16px; font-size: 14px; font-weight: 500;
       color: var(--text-muted); border-bottom: 2px solid transparent;
       margin-bottom: -1px; transition: color 0.15s, border-color 0.15s; }
.tab:hover { color: var(--text); }
.tab.active { color: var(--text); font-weight: 600; border-bottom-color: var(--teal); }
```

`[HTML]` `.tabs-bar-with-toggle @ 1706-1726`:
```css
.tabs-bar.tabs-bar-with-toggle { justify-content: space-between; align-items: center; padding-right: 14px; }
.tabs-bar-with-toggle .tabs-bar-left { display: flex; gap: 28px; }
.tabs-bar-toggle { padding: 2px; align-self: center; }
.tabs-bar-toggle .view-toggle-btn { padding: 4px 9px; font-size: 11.5px; }
```

`[HTML]` `.view-toggle / .view-toggle-btn @ 1012-1039`:
```css
.view-toggle { display: inline-flex; padding: 3px; background: var(--bg-hover);
               border: 1px solid var(--border-2); border-radius: 8px; gap: 2px; }
.view-toggle-btn { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px;
                   background: transparent; border: none; border-radius: 6px;
                   font-size: 12px; font-weight: 500; color: var(--text-muted); }
.view-toggle-btn:hover { color: var(--text); }
.view-toggle-btn.active { background: white; color: var(--teal);
                          box-shadow: 0 1px 3px rgba(13,63,68,0.08); }
```

### A.4 Header action slot

`[REACT]` `hierarchy.jsx:1452` — Settings tab only:
```jsx
<div id="settings-actions-slot" className="node-header-actions"></div>
```
`SettingsTab` portals its action buttons into this slot via `ReactDOM.createPortal` (`settingstab.jsx:84-96, 116`).

For other tabs (hierarchy, commChannels, appsServices), the action buttons live directly in `node-header > node-actions` (`hierarchy.jsx:1304-1370`).

### A.5 Behavior

- `[REACT]` Tab change: `onClick={() => setActiveTab(tb.id)}` — no animation, instant switch.
- `[REACT]` `hierarchy.jsx:1165` — Switching nodes resets `infoOpen`, `detailUser`, `infoEditing`, `infoDraft` (NOT activeTab — sticky).
- `[REACT]` `hierarchy.jsx:1255` — `view-toggle` only rendered when `activeTab === 'hierarchy'`.

---

## B. comm-channels-tab

`[REACT]` `hierarchy.jsx:1418-1435` — Both `commChannels` and `appsServices` render the **same component** `<ApplicationsPage tabKey={activeTab} />`.

`[REACT]` `apps.jsx:1-43, 414-625` — `ApplicationsPage` component:
- Seed data: `APPS_BY_TAB.commChannels` (9 rows: SMS Gateway, WhatsApp Business, Email Relay, Voice IVR, Push Notifications, AI-ChatGPT, RCS Messaging, Telegram Bot, Apple Business Chat).
- Header text: `tabKey === 'commChannels' ? t.tabCommChannels : t.applications` (`apps.jsx:495`).

### B.1 Wrap + simple node-header

`[REACT]` `hierarchy.jsx:1419-1433`:
```jsx
<div className="apps-tab-wrap">
  <div className="node-header simple" style={{ paddingTop: 3, paddingBottom: 3 }}>
    <div className={`node-title ${isRoot ? 'falcon' : ''}`}>
      <span className="node-avatar">…</span>
      <span>{selectedNode.name}</span>
    </div>
  </div>
  <ApplicationsPage tabKey={activeTab} t={t} pushToast={pushToast} />
</div>
```

`[HTML]` `.apps-tab-wrap @ 2124-2128`:
```css
.apps-tab-wrap { display: flex; flex-direction: column; gap: 16px; }
.node-header.simple { padding: 0px 0 0; border-bottom: 0; margin-bottom: 2px; }
```

### B.2 Table (commChannels rows)

Columns (`apps.jsx:498-509`):

| # | Column | i18n key | Cell type | Source |
|---|---|---|---|---|
| 1 | Visibility | `colVisibility` | Toggle switch (`VisibilityToggle`) — width 72px | `apps.jsx:46-55, 500, 515` |
| 2 | Name | `colName` | Bold text, max-width 140px (`name-cell`) | `apps.jsx:501, 516` |
| 3 | Price Type | `colPriceType` | Plain text (e.g. "Monthly", "Yearly", "Quarterly") | `apps.jsx:502, 517` |
| 4 | Price Value | `colPriceValue` | `<SAR/> {number.toLocaleString()}` in `.price-val` | `apps.jsx:503, 518-521` |
| 5 | First Activation Date | `colFirstActivation` | Date string m/d/yyyy or `-----` (muted) | `apps.jsx:504, 523` |
| 6 | Activation Date | `colActivationDate` | Date string m/d/yyyy or `-----` | `apps.jsx:505, 524` |
| 7 | Renew Date | `colRenewDate` | Date string m/d/yyyy or `-----` | `apps.jsx:506, 525` |
| 8 | Status | `colStatus` | `<StatusBadge>` or `-----` if `!visible \|\| !firstActivation` | `apps.jsx:507, 526-530` |
| 9 | Action | `colAction` | Optional pending-toggle chevron + 3-dot row-action button — width 64px center | `apps.jsx:508, 532-559` |

### B.3 Header labels wrap to 2 words per line

`[REACT]` `apps.jsx:6-17` — helper `wrapTwo()` splits label by whitespace, returns `<br>` between every 2 words. So `"First Activation Date"` renders on 2 lines: "First Activation" / "Date".

### B.4 Row actions menu per status

`[REACT]` `apps.jsx:370-411` — `RowActionsMenu`:

| Row Status | Actions |
|---|---|
| `active` | Disable, Edit Price Type, Edit Price Value |
| `expired` | Do Payment, Disable, Edit Price Type, Edit Price Value |
| `disable` | Enable, Edit Price Type, Edit Price Value |
| `inactive` | Do Payment, Disable |

### B.5 Status badge styles

`[HTML]` `styles.css:1320-1352`:
```css
.status-badge { … }  /* base pill */
.status-badge.active    { background: var(--green-bg);  color: #0f7a3a; }
.status-badge.suspended { background: #F3F3F3;          color: #5a6470; }
.status-badge.deleted   { background: var(--red-bg);    color: #a1191d; }
.status-badge.locked    { background: #C2C2C2;          color: #444444; }
.status-badge.pending   { background: var(--orange-bg); color: #a85a00; }
.status-badge.expired   { background: #FFEDED;          color: #a1191d; }
.status-badge.disabled  { background: #F3F3F3;          color: #595959; }
.status-badge.inactive  { background: #C2C2C2;          color: #444444; }
```

Each badge has a left `.dot` (~6px circle, same hue family as text).

### B.6 Pending edit expand row (EditRow)

`[REACT]` `apps.jsx:152-263` — `EditRow` injects between the data row and the next row when a price-type or price-value edit is pending. Two modes:

- **`mode='type'`**: shows `New Price Type` select (`OneTime/Monthly/Quarterly/Yearly`) + `Effective Date` (DatePicker; min = today+0).
- **`mode='value'`**: shows `New Price Value` numeric input prefixed with `<SAR/>`.

Action buttons in edit-mode: **Cancel** (text) / **Save** (text).
Action buttons in view-mode (after save): **edit icon** / **trash icon** to remove pending.

### B.7 Apps panel styles

`[HTML]` `styles.css:2143-2196`:
```css
.apps-panel { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: white; }
.apps-panel-header { padding: 21px 18px; min-height: 49px; border-bottom: 1px solid var(--border);
                     font-size: 14px; font-weight: 700; color: var(--text); }
.apps-table thead th { font-weight: 500; color: var(--text-muted); font-size: 12px; text-align: start;
                       padding: 12px 14px; background: #F5F5F5; height: 60px; line-height: 1.35; }
.apps-table thead th.col-vis    { width: 72px; }
.apps-table thead th.col-action { width: 64px; text-align: center; }
.apps-table tbody td { padding: 16px 14px; vertical-align: middle; border-bottom: 1px solid var(--border-2); }
.apps-table .name-cell  { font-weight: 700; max-width: 140px; line-height: 1.3; }
.apps-table .muted-cell { color: var(--text-2); }
.price-val { display: inline-flex; align-items: center; gap: 4px; font-weight: 500; color: var(--text); }
```

### B.8 Visibility toggle

`[HTML]` `styles.css:2199-2225`:
```css
.vis-toggle { width: 38px; height: 22px; background: #d1d5db; border-radius: 999px; }
.vis-toggle.on { background: var(--teal); }
.vis-toggle-dot { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px;
                  background: white; border-radius: 50%; }
.vis-toggle.on .vis-toggle-dot { transform: translateX(16px); }
```

### B.9 Pagination

`[REACT]` `apps.jsx:600-608` — Uses shared `<TablePagination>` (`hierarchy.jsx:353-394`). Page-size options `[10, 20, 30, 40]`, defaults `appsPageSize=20`. Footer shows `Showing X - Y from Z`.

### B.10 Insufficient Balance modal (Do Payment flow)

`[REACT]` `apps.jsx:266-360` — `InsufficientBalanceModal`. Drag-and-drop list of channels (WhatsApp, Voice, AI-ChatGPT) to reorder priority. After Proceed, target row gets `status: 'active'`.

---

## C. apps-services-tab

`[REACT]` Same `ApplicationsPage` component as B; only the seed data differs.

### C.1 Seed rows (`apps.jsx:22-30`)

| name | priceType | priceValue | firstActivation | status | visible |
|---|---|---|---|---|---|
| Basic Send App | Monthly | 2000 | 1/1/2025 | active | true |
| Survey Pro | Monthly | 2000 | 1/1/2025 | active | true |
| Campaign Engine | Yearly | 18000 | 3/15/2023 | expired | true |
| Workflow Builder | Quarterly | 5500 | 2/1/2024 | expired | true |
| Analytics Suite | Monthly | 3500 | 6/10/2024 | disable | true |
| Form Builder | Yearly | 12000 | 4/1/2024 | disable | false |
| Reporting Hub | Monthly | 2800 | 8/1/2024 | inactive | true |
| AI Assistant | Monthly | 4200 | null | inactive | false |

### C.2 Visual + behavior

Identical to B. Header text: `t.applications` ("Applications" / "التطبيقات").

> `[INFERRED]` The header text **differs from the tab label** — tab label is "Apps & Services" but panel header is just "Applications". Tab-label vs panel-header mismatch should be noted for the Angular implementation.

---

## D. org-info-panel

**CRITICAL FINDING** `[REACT]` There is NO sub-tab structure in the React InfoPanel — it is a **single scrolling panel** of fields, not a tabbed panel. The task brief's call for "Audit Mode / Rule and Status / Permission and Privilege" sub-tabs is NOT supported by the React source.

The 3-tab pattern (`Personal Information / Role & Status / Permissions & Privilege`) exists only in the **User Details page** (`userdetails.jsx`), reached from a user-row's "More Details" menu — NOT from the hierarchy tab strip and NOT inside `InfoPanel`. See section G (conflicts).

### D.0 Real InfoPanel structure (single panel, no sub-tabs)

`[REACT]` `hierarchy.jsx:992-1146` — `InfoPanel` component, opened via the "Information" link in `node-header > node-actions` (lines 1343-1351).

Top-level structure:
```jsx
<div className={`info-panel ${editing ? 'is-editing' : ''}`}>
  <div className="info-panel-header">Information</div>
  <div className="info-panel-body">
    {/* Client picture block (avatar OR upload widget) */}
    <div className="info-grid info-grid-top">    {/* 4-col grid, top fields */} </div>
    <div className="info-grid info-grid-bottom"> {/* 4-col grid, address fields + section title */} </div>
  </div>
</div>
```

### D.1 Top fields grid (`hierarchy.jsx:1121-1126`)

| Field | i18n key | Type | View | Edit options |
|---|---|---|---|---|
| Account Name | `infoAccountName` | text | span | input (placeholder "Start with letter · Max 30 Characters") |
| Finance ID | `infoFinanceId` | text | span | input |
| Classification Category | `infoClassification` | select | span | `Government / Banking / Healthcare / Energy / Retail / Organization / Sub-Node` |
| Classification Sub Category | `infoSubClassification` | select | span | `Public Sector / Commercial / Non-profit` |

### D.2 Bottom fields grid + "Account Official" title (`hierarchy.jsx:1127-1142`)

| Field | i18n key | Type | Options if select |
|---|---|---|---|
| Entity Name | `infoEntityName` | text | — |
| Authority Letter Type | `infoAuthorityType` | select | `Government / Private / Joint Venture / Organizational Unit` |
| Sector | `infoSector` | text | — |
| Budget No. | `infoBudget` | text | — |
| Country | `infoCountry` | select | `Kingdom Of Saudi Arabia / Saudi Arabia / UAE / Egypt / Jordan` |
| City | `infoCity` | select | `Riyadh / Jeddah / Dammam / Mecca` |
| District | `infoDistrict` | text | — |
| Street | `infoStreet` | text | — |
| Building Number | `infoBuilding` | text | — |
| Postal Code | `infoPostal` | text | — |
| Additional Address | `infoAddlAddr` | text | — |
| Another ID | `infoAnotherId` | text | — |
| VAT Registration Number | `infoVAT` | text | — |

### D.3 Picture / avatar block

`[REACT]` `hierarchy.jsx:1058-1120` — Two render paths:
- **View mode** (`.info-client-pic`): 84×84 circle with photo OR brand logo OR initials. Right: account name + "Client Picture" label.
- **Edit mode** (`.au-avatar-row`): 64-ish circle, edit + delete buttons overlaid; right side has drag-hint + "Upload Photo" button; accepts `image/*`.

### D.4 Visual styles

`[HTML]` `styles.css:823-947`:
```css
.info-panel { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: white; }
.info-panel-header { padding: 21px 18px; border-bottom: 1px solid var(--border);
                     font-size: 14px; font-weight: 700; color: var(--text); }
.info-panel-body { padding: 26px 28px 32px; background: white; }
.info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px 28px; }
.info-grid-top    { padding: 24px 0px; }
.info-grid-bottom { padding: 24px 0px; border-top: 1px solid var(--border); }
.info-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.info-field-label { font-size: 12px; font-weight: 400; color: var(--text-muted); }
.info-field-value { font-size: 13.5px; font-weight: 700; color: var(--text); line-height: 1.4; }
.info-section-title { grid-column: 1 / -1; font-size: 13px; font-weight: 700; padding-top: 4px;
                      margin-top: 4px; border-top: 1px dashed var(--border); }
@media (max-width: 1100px) { .info-grid { grid-template-columns: repeat(2, 1fr); } }
```

### D.5 Header actions for InfoPanel

`[REACT]` `hierarchy.jsx:1305-1340` — When `infoOpen`:
- View: **Back to users** (secondary) + **Edit Info** (primary, edit icon).
- Edit: **Cancel** (secondary) + **Save** (primary). On Save: closes edit + pushes toast "Information updated ✓".

---

### D.1, D.2, D.3 — placeholder sub-tabs (per task brief)

The task brief specifies sub-tabs **Audit Mode / Rule and Status / Permission and Privilege**. These DO NOT exist in the React InfoPanel source. The closest match is the User-Details page tabs (Personal / Role / Permissions). Mapping attempt:

| Task brief sub-tab | React equivalent (closest) | Source |
|---|---|---|
| Audit Mode | `UDTabPersonal` / `UDEditPersonal` (Personal Information) — includes phone/email **verify** flow (this is likely what "Audit" refers to: OTP-verified contact info) | `userdetails.jsx:90-122, 177-299` |
| Rule and Status | `UDTabRole` / `UDEditRole` (Role & Status) | `userdetails.jsx:142-149, 301-332` |
| Permission and Privilege | `UDTabPermissions` / `UDEditPermissions` (Permissions & Privilege) | `userdetails.jsx:151-174, 340-383` |

If the Angular intent was actually User Details, the next sub-sections apply. Otherwise these belong in a different page (see G).

#### D.1 "Audit Mode" tab (= Personal Information for users)

`[REACT]` `userdetails.jsx:90-122` (view) / `177-299` (edit).

**Layout (view)**:
- Avatar row: 84-ish circle, full name + "User Picture" label.
- `.ud-divider`
- `.ud-grid-4` — First Name, Last Name, User Name, National ID/Iqama.
- `.ud-grid-4` (mt 28px) — Phone Number, Email Address.

**Verification badge** (`userdetails.jsx:34-52, 72-74`): green check for verified, red triangle for unverified. Shown ONLY when `form.status === 'pending'`.

**Layout (edit)**:
- `.au-avatar-row` (reused from Add User wizard) — avatar circle + edit/delete overlays; right side drag-hint + Upload Photo.
- `.au-divider`
- `.au-form-grid.au-form-grid-3` — First Name*, Last Name*, User Name*, National ID/Iqama, Phone Number*, Email Address*.

#### D.2 "Rule and Status" tab (= Role & Status)

`[REACT]` `userdetails.jsx:142-149` (view) / `301-332` (edit):

**View** (`.ud-grid-2`):
- User Status (`STATUS_LABEL`: Active / Pending / Suspended / Locked / Deleted / Inactive)
- User Role (`ROLE_LABEL`: System Admin / Operation / Products / Support / Viewer)

**Edit** (`.au-form-grid-2`):
- User Status select — **disabled** (`.au-select-disabled`). Options: active / pending / suspended / locked / deleted.
- User Role select — enabled. Options: system_admin / operation / products / support / viewer.

#### D.3 "Permission and Privilege" tab (= Permissions & Privilege)

`[REACT]` `userdetails.jsx:151-174` (view) / `340-383` (edit):

**View**:
- "Assigned Permission Group" → `.ud-perm-value` ("Admin Group" / "Read Only Group" / "Operations Group" / "Support Group" — from `PERM_LABEL`).
- Divider (`.ud-perm-spacer`).
- "CommChannel Checker Level" header → 2-col `.ud-checker-grid`:
  - WhatsApp → checker level label
  - Voice → checker level label
  - Labels via `CHECKER_LABEL`: `None / Checker Level One / Checker Level Two`.

**Edit**:
- `.au-perm-section` — "Assigned Permission Group" select. Options: `admin / readonly / ops / support`.
- `.au-divider`
- `.au-perm-section` — "CommChannel Checker Level" with 2-row `.au-checker-table`:
  - WhatsApp row + Voice row.
  - Each row: label + 3 radio options (none / level1 / level2), grouped via `name="ud-checker-{ch.id}"`.

---

## E. settings-tab

`[REACT]` `settingstab.jsx:26-271`. Triggered from tab id `settings`. Wrapped via `node-header.simple.node-header-with-actions` with a portal slot `id="settings-actions-slot"` for action buttons.

### E.1 View mode

Triggered when `mode === 'view'` (initial state). Layout (`settingstab.jsx:118-267`):

```
.settings-tab-wrap
  .settings-tab-body.is-view
    .ac-settings-grid             ← grid-template-columns: minmax(0, 1fr) 360px (or 1fr alone if isRoot)
      .ac-settings-left           ← bordered card, padding 22px
        .ac-block-title           "Password Security Level"
        .ac-radio-cards           grid-template-columns: 1fr 1fr
          .ac-radio-card.is-disabled.selected?         ← Normal: "Username, Password, OTP"
          .ac-radio-card.is-disabled.selected?         ← Advanced: "Comply with NCA regulations, press here for more details."
        .ac-block-title           "Allowed IPs"
        .ac-ip-row                row of chips (no "Add IP" button in view mode)
          .ac-ip-chip × N         each chip: "192.168.1.10" (no remove × in view)
          + .settings-empty-hint  if no IPs: "No IPs configured"
        .ac-hint-text             "* Restrict platform access and limit it from these IPs only"
      [aside].ac-settings-right   (only if !isRoot — fixed 360px)
        .ac-side-head             icon + "Account Limitations"
        .limit-row × 3            each: title + ST_NumberStepper (disabled)
          "Max Normal User Limit"  / 20
          "Max System User Limit"  / 5
          "Max Node Level"         / 2
```

Action button (rendered via portal into `node-header > #settings-actions-slot`):
- Edit (primary, pencil icon) — switches to edit mode.

### E.2 Edit mode

Triggered after **Edit** click. `enterEdit()` snapshots data to `snapshotRef`, sets `mode='edit'`.

```
.settings-tab-wrap
  .settings-tab-body.is-edit
    .ac-settings-grid             same template
      .ac-settings-left
        .ac-block-title           "Password Security Level"
        .ac-radio-cards           ← radio cards now enabled (Normal/Advanced toggleable)
        .ac-block-title           "Allowed IPs"
        .ac-ip-row
          .ac-ip-add              ← visible only when !ipInputOpen: dashed-teal button "IP Address"
          .ac-ip-chip × N         each chip: IP + × remove button
        .ac-input.ac-ip-input     ← shown if ipInputOpen: placeholder "Enter IP Address (IPv4 or IPv6) and press Enter"
        .ac-hint-text             "* Restrict platform access and limit it from these IPs only"
      [aside].ac-settings-right   (only if !isRoot)
        .ac-side-head             "Account Limitations"
        .limit-row × 3            each: title + .limit-row-cols (2-col grid)
          .limit-col              .limit-col-label "Current existing" + .ac-input.limit-current (disabled readOnly)
          .limit-col              .limit-col-label "Max allowed" + ST_NumberStepper (active)
```

Action buttons (portal):
- Cancel (secondary) — reverts to snapshot, exits edit.
- Save Changes (primary) — pushes toast "Settings updated successfully", exits edit.

### E.2.1 70/80 vs 30/20 split

`[HTML]` `addclient.css:399-407`:
```css
.ac-settings-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;   /* left flex / right fixed 360 */
  gap: 32px;
  align-items: start;
}
.ac-settings-grid.is-root-only { grid-template-columns: minmax(0, 1fr); }
```
> `[INFERRED]` Right column is **fixed 360px**, not a 30/20% ratio. Left fills remaining space. At ~1200-1400px page width the visual ratio is roughly 70/30 to 75/25.

### E.3 Add IP flow

`[REACT]` `settingstab.jsx:37-59, 151-187`:

1. User in edit mode clicks **`IP Address`** button (`.ac-ip-add`, dashed-teal border).
2. Button hides; `.ac-ip-input` text input appears with placeholder `"Enter IP Address (IPv4 or IPv6) and press Enter"`, autofocused.
3. User types IP.
4. **Enter key** → `submitIp()`:
   - Trim value.
   - If empty → close input.
   - If not duplicate (`!data.allowedIps.includes(v)`) → append to chip list.
   - Clear input, close input.
5. **Escape key** → close input, discard.
6. **Blur with empty input** → close input.
7. Each chip has a × button (`<IcClose size={10} stroke={2.4} />`) that calls `removeIp(ip)`.

**Validation gap** `[REACT]` There is **NO IPv4/IPv6 format validation** in the React source — any non-empty string that's not a duplicate is accepted. Placeholder claims IPv4/IPv6 but the code does no regex check. Confirmed by reading lines 51-59. Log as gap vs Brain SK task spec.

**No confirm popup** `[REACT]` Removing an IP does NOT show a confirm dialog — chip removes immediately. Log against task spec.

### E.4 Account limits table

`[REACT]` `settingstab.jsx:192-265`. Renders ONLY when `!isRoot` (root node hides limits).

| Row | View | Edit (2-col grid) |
|---|---|---|
| Max Normal User Limit | ST_NumberStepper disabled = 20 | "Current existing" 0 (readOnly) + "Max allowed" ST_NumberStepper = 20 |
| Max System User Limit | ST_NumberStepper disabled = 5 | "Current existing" 5 (readOnly) + "Max allowed" ST_NumberStepper = 5 |
| Max Node Level | ST_NumberStepper disabled = 2 | "Current existing" 0 (readOnly) + "Max allowed" ST_NumberStepper = 2 |

**ST_NumberStepper** (`settingstab.jsx:5-24`):
- Input type=number with `±1` arrow buttons (up/down chevrons).
- Constraints: `min={0}, max={9999}` defaults.
- Disabled state respected on both input and arrow buttons.

> `[INFERRED]` Labels are inconsistent: view mode says "Max Normal User Limit" (capitalized) but edit mode title says "Max normal user limit" (sentence case). Source bug — flag for Angular as decision needed.

### E.5 Password Security Level radio cards

`[REACT]` `settingstab.jsx:123-148`. Two options:
- **Normal** (default): `<strong>Normal</strong><em>Username, Password, OTP</em>`
- **Advanced**: `<strong>Advanced</strong><em>Comply with NCA regulations, <a>press here for more details.</a></em>`

In **view mode**, both cards show but `.ac-radio-card.is-disabled` AND `.ac-radio-card:not(.selected)` becomes `opacity: 0.55` — dim the unselected card (`settingstab.css:45-47`).

In **edit mode**, both cards are clickable, selecting toggles `data.security`.

### E.6 Snapshot/Cancel behavior

`[REACT]` `settingstab.jsx:46, 61-69`:
- On `enterEdit()` → `snapshotRef.current = JSON.parse(JSON.stringify(data))`.
- On `cancelEdit()` → `setData(snapshotRef.current)` to revert.
- On `saveEdit()` → just exits edit; data is already mutated in-place during editing (so save = commit).

### E.7 Settings tab styles summary

`[HTML]` `settingstab.css:1-117` + `addclient.css:399-568`:

```css
.settings-tab-wrap        { padding: 0; max-width: none; width: 100%; }
.settings-tab-actions     { display: flex; gap: 10px; flex-shrink: 0; }
.settings-tab-body.is-view .ac-radio-card.is-disabled            { cursor: default; }
.settings-tab-body.is-view .ac-radio-card.is-disabled .ac-radio-mark { opacity: 0.7; }
.settings-tab-body.is-view .ac-radio-card:not(.selected)         { opacity: 0.55; }
.settings-tab-body.is-view .ac-ip-add                            { display: none; }

.ac-settings-grid         { display: grid; grid-template-columns: minmax(0,1fr) 360px; gap: 32px; }
.ac-settings-left         { border: 1px solid #e5e7eb; border-radius: 12px; padding: 22px; }
.ac-settings-right        { background: var(--bg-hover); border-radius: 12px; padding: 22px;
                            border: 1px solid var(--border-2); }
.ac-block-title           { font-size: 13px; font-weight: 700; text-transform: uppercase;
                            letter-spacing: 0.04em; margin-bottom: 14px; }

.ac-radio-cards           { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.ac-radio-card            { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; }
.ac-radio-mark            { width: 16px; height: 16px; border: 1.5px solid #c4c9cf;
                            border-radius: 50%; margin-top: 2px; }
.ac-radio-card.selected .ac-radio-mark { border-color: var(--teal); border-width: 5px; }

.ac-ip-row                { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 10px; }
.ac-ip-add                { height: 34px; padding: 0 14px; background: white;
                            border: 1px dashed var(--teal); border-radius: 8px;
                            color: var(--teal); font-size: 12.5px; font-weight: 500; }
.ac-ip-chip               { height: 34px; padding: 0 12px; background: #eff1f3;
                            border-radius: 8px; font-size: 12.5px; }
.ac-ip-chip button        { width: 16px; height: 16px; border-radius: 50%;
                            border: 1px solid #c4c9cf; }
.ac-hint-text             { font-size: 11.5px; color: #dc2626; margin-top: 8px; }

.limit-row + .limit-row   { margin-top: 14px; }
.limit-row-title          { font-size: 12.5px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
.limit-row-cols           { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; align-items: end; }
.limit-col-label          { font-size: 11px; font-weight: 500; color: var(--text-muted); }
.ac-input.limit-current   { background: #ffffff; border-color: var(--border);
                            color: var(--text-muted); font-weight: 500;
                            text-align: center; padding: 8px 6px; cursor: default; }
```

---

## F. OTP popup (as used by Personal Info phone/email verify)

`[REACT]` `otp-verify.jsx:399-584` — `OtpModal` component.

### F.1 Trigger

`[REACT]` `userdetails.jsx:179-181, 269-296`:
- In Personal-Info **edit** mode, when `form.status === 'pending'`, the Phone and Email inputs show a `Verify` button.
- Click → `onChange('phoneVerified', false); setOtpChannel('phone')` (or `'email'`).
- `<OtpModal channel={otpChannel} target={...}>` renders.

### F.2 Markup

```jsx
<div className="ac-modal-overlay" onClick={onClose}>
  <div className="ac-modal otp-modal" onClick={(e) => e.stopPropagation()}>
    <button className="ac-modal-close">×</button>
    <h3 className="otp-title">OTP Verification</h3>
    {/* invalid banner if state === 'invalid' */}
    {/* sent line + target */}
    <div className="otp-boxes">
      6 × .otp-box  (split as 3 + .otp-sep + 3)
    </div>
    <div className="otp-timer">SVG circular progress + countdown text</div>
    <button className="otp-resend">⟲ Resend</button>
  </div>
</div>
```

### F.3 Behavior

`[REACT]` `otp-verify.jsx:400-477`:

| Step | Behavior |
|---|---|
| On open | Auto-focus first box; start 60s countdown. |
| Per box | `onChange` strips non-digits, takes last char, auto-advances to next box. |
| Backspace on empty | Move focus to previous box. |
| ArrowLeft/Right | Move focus. |
| Paste | Extract digits, fill from box 0 (up to 6). |
| When all 6 filled | After 200ms delay: if joined === `'150999'` → `status='invalid'`; otherwise → `status='success'` then 1300ms later → `onSuccess()`. |
| Countdown hits 0 | `status='expired'`, inputs disabled, "Code expired — please resend" shown. |
| Resend | Reset timer to 60, clear boxes, status='input'. |

### F.4 Validation rule — invalid trigger

`[REACT]` `otp-verify.jsx:436, 466`:
```js
if (joined === '150999') setStatus('invalid');
```

> **CONFLICT** Task brief says Brain SK spec is "all zeros pass". React source uses the **opposite trigger code `150999` = invalid**. Any other 6-digit code passes (including `000000`). Document this conflict in section G.

### F.5 Visual specs

`[HTML]` `otp-verify.css:1-200`:
- `.otp-phone-input` — height 44px, border-radius 10px, focus-within ring (teal).
- `.otp-cc-btn` — country dropdown trigger (flag circle + chevron).
- `.otp-cc-menu` — absolute dropdown, max-height list, search input on top.
- `.otp-verify-btn` — background `#FDE8D0`, text `#E08600`, padding `0 16px`, height 36px, border-radius 8px.
- `.otp-verified-tag` — pill background `#e6f4ee`, color `#0d3f44`.
- `.otp-modal` — centered modal, 60s circular progress (radius 36, circumference 2π·36, dashoffset = C · (1 - progress)).
- `.otp-box` — square input, monospace large-digit, has-value + is-invalid states.
- `.otp-success-icon` — 90×90 teal circle with check polyline.

### F.6 Phone Input details

`[REACT]` `otp-verify.jsx:200-225, 270-366` — `PhoneInput`:
- Country list: 25 countries (US, UZ, AF, AL, DZ, AD, SA, AE, EG, JO, KW, BH, QA, OM, YE, IQ, SY, LB, PS, GB, FR, DE, IN, PK, TR).
- Default: SA (`+966`).
- Searchable dropdown — filters by name OR dial code substring.
- Country dropdown displays first 2 results above a separator, rest below.
- Placeholder: `"5XX XXX XXXX"`.
- `is-verified` state shown when `verified === true`.
- Inline error `"Verification required before saving"` if `showVerify && !verified`.

### F.7 Email Input details

`[REACT]` `otp-verify.jsx:369-397` — `EmailInput`:
- `<input type="email">`, placeholder `"name@company.sa"`.
- States: `.is-error` (border red), `.is-verified` (green tint).
- Same Verify / Verified-tag pattern as PhoneInput.
- Inline error `"Verification required before saving"` when needed.

---

## G. Conflicts vs Brain SK task spec

| # | Brain SK / task brief | React/HTML source truth | Severity |
|---|---|---|---|
| 1 | Org-info-panel has sub-tabs **"Audit Mode / Rule and Status / Permission and Privilege"** | InfoPanel is a **single panel** with 2 grids (top + bottom) + section title "Account Official". Sub-tabs DO NOT exist. The 3-tab pattern lives in `UserDetailsPage` (`userdetails.jsx`) and is labeled `"Personal Information / Role & Status / Permissions & Privilege"`. | HIGH |
| 2 | OTP "all zeros pass" rule | React source: any 6-digit code passes EXCEPT `150999` which triggers `invalid`. Zero-only (`000000`) passes by default. | HIGH |
| 3 | Tab label "Communication Channels" | React label is **`"CommChannels & Services"`** (one-word "CommChannels"). Arabic: `قنوات الاتصال والخدمات`. | MEDIUM |
| 4 | Settings IP add: validate IPv4/IPv6 + confirm popup on delete | React: no format validation, no confirm dialog. Placeholder mentions IPv4/IPv6 but no regex. Delete is immediate. | MEDIUM |
| 5 | apps-services table "Apps & Services" | Tab label is `"Apps & Services"` but the **panel header** under the table just says `"Applications"`. Header-text vs tab-text mismatch. | LOW |
| 6 | "70/80% + 30/20%" left/right ratio in Settings edit | Right column is **fixed 360px**, left fills remaining (`grid-template-columns: minmax(0,1fr) 360px`). Visual ratio depends on viewport width. | LOW |
| 7 | "Account Limits ±1 buttons" min/max bounds | `ST_NumberStepper` defaults `min=0, max=9999`. The task spec mentions `Max Normal User Limit ±1` but no clamps documented. React allows up to 9999. | LOW |
| 8 | Settings labels case consistency | View mode: "Max Normal User Limit" (Title Case). Edit mode: "Max normal user limit" (sentence case). React source bug. | LOW |

---

## H. Source file paths (for citation)

### React (primary)
- `C:\Falcon\Source_of_truth_theme\React\Falcon-Taha (1)\admin\hierarchy.jsx` — `HierarchyPage`, `InfoPanel`, tab strip (lines 992-1146, 1148-1469)
- `C:\Falcon\Source_of_truth_theme\React\Falcon-Taha (1)\admin\apps.jsx` — `ApplicationsPage`, `EditRow`, `RowActionsMenu`, `InsufficientBalanceModal`, `VisibilityToggle`, `DatePicker` (lines 1-628)
- `C:\Falcon\Source_of_truth_theme\React\Falcon-Taha (1)\admin\settingstab.jsx` — `SettingsTab`, `ST_NumberStepper` (lines 1-273)
- `C:\Falcon\Source_of_truth_theme\React\Falcon-Taha (1)\admin\otp-verify.jsx` — `OtpModal`, `PhoneInput`, `EmailInput`, `COUNTRIES` (lines 1-588)
- `C:\Falcon\Source_of_truth_theme\React\Falcon-Taha (1)\admin\userdetails.jsx` — `UserDetailsPage` with sub-tabs (lines 1-479) — closest match to "Audit Mode / Rule and Status / Permission and Privilege"
- `C:\Falcon\Source_of_truth_theme\React\Falcon-Taha (1)\admin\i18n.jsx` — EN labels lines 85-180; AR labels lines 753-830

### CSS (visual SoT)
- `C:\Falcon\Source_of_truth_theme\React\Falcon-Taha (1)\admin\styles.css`
  - Tab strip: 734-756 (`.tabs-bar`, `.tab`), 1706-1726 (`.tabs-bar-with-toggle`)
  - View toggle: 1012-1039 (`.view-toggle`, `.view-toggle-btn`)
  - Info panel: 806-947 (`.info-link`, `.info-panel`, `.info-grid-*`, `.info-field-*`, `.info-section-title`)
  - Apps panel: 2124-2226 (`.apps-tab-wrap`, `.apps-panel`, `.apps-table`, `.vis-toggle`)
  - Status badge: 1320-1352
  - IB modal: 2260-2412
- `C:\Falcon\Source_of_truth_theme\React\Falcon-Taha (1)\admin\settingstab.css` — settings-specific tweaks (lines 1-117)
- `C:\Falcon\Source_of_truth_theme\React\Falcon-Taha (1)\admin\addclient.css` — shared `.ac-*` classes (lines 399-568)
- `C:\Falcon\Source_of_truth_theme\React\Falcon-Taha (1)\admin\otp-verify.css` — OTP modal styles (lines 1-200+)

### HTML
- `C:\Falcon\Source_of_truth_theme\HTML\latest.html` — `[HTML]` Single-page HTML shell. Line 181 contains a JSON-stringified HTML body with CSS only (no static DOM markup — all rendered by the JSX files above). Decoded body inspected via `node -e "JSON.parse(...)"`. CSS extracted matches `styles.css` (canonical).
