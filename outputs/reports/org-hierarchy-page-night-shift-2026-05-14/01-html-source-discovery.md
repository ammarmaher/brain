# Organization Hierarchy — HTML Source Discovery
**Agent 1, Brain SK Night Shift, 2026-05-14**

Source-of-truth files lived in `C:\Falcon\Source_of_truth_theme\React\Organization page\` (a React/Babel-Standalone hi-fi prototype). The bundled HTML `T2 Falcon Admin - Offline.html` is a runtime unpacker over a JSON manifest of these source files — all visual/structural detail below was extracted from the unbundled JSX + CSS sources, which are the actual source-of-truth.

## File map (input authorities for downstream agents)

| File | Lines | Role |
|---|---|---|
| `admin/app.jsx` | 315 | Main shell, routes to pages, holds tree state, drawer, toasts |
| `admin/sidebar.jsx` | 86 | Sidebar nav (Falcon mark, items, submenu, collapse) |
| `admin/topbar.jsx` | 120 | Topbar (title, breadcrumb, icons, user-chip, user-menu) |
| `admin/hierarchy.jsx` | 1458 | **Core page** — tree panel, info panel, tabs, users table, org-chart view |
| `admin/data.jsx` | 197 | Seed tree, `BrandLogo` per-brand renderer, util fns |
| `admin/i18n.jsx` | 936 | EN + AR strings (use for i18n key names) |
| `admin/addclient.jsx` | 836 | 5-step Add Client wizard + Send-Credentials + Success modals |
| `admin/adduser.jsx` | 459 | 3-step Add User wizard |
| `admin/userdetails.jsx` | 478 | Drill-down “More Details” view+edit page |
| `admin/apps.jsx` | 625 | Apps & Services / CommChannels tab table |
| `admin/settingstab.jsx` | 272 | Settings tab (view/edit modes) |
| `admin/otp-verify.jsx` | 587 | Phone input w/ country picker, Email input, OTP modal |
| `admin/drawers.jsx` | 64 | Generic right-side drawer + NodeDrawer |
| `admin/styles.css` | 3579 | Tokens + every component style |
| `admin/addclient.css`, `settingstab.css`, `otp-verify.css`, `comm-mkt.css` | — | Per-feature CSS |
| `admin/assets/*.svg`, `aramco-logo.png` | — | All asset paths |

---

## 1. Page chrome

The app shell uses CSS Grid: **sidebar | main**.

| Element | Selector / class | Detail |
|---|---|---|
| Root | `.app` (`.collapsed` class when sidebar collapsed) | `display:grid; grid-template-columns: var(--sidebar-w) 1fr` (224px expanded, 68px collapsed); `height:100vh` |
| Sidebar | `aside.sidebar` | `position:sticky; top:0; height:100vh; background:var(--teal) #0d3f44; color:white` |
| Main | `div.main` | `display:flex; flex-direction:column; background:var(--bg-page) #f5f6f7; overflow:hidden` |
| Topbar | `header.topbar` | `height:var(--topbar-h) 72px; background:white; border-bottom:1px solid border-2` |
| Direction | `<body dir="ltr|rtl">` | RTL toggled by lang change. RTL also swaps font to `IBM Plex Sans Arabic` |
| Document lang | `<html lang="en|ar">` | Set in `app.jsx` on lang change |

### Topbar layout (from topbar.jsx)
```
[topbar-titles: pageTitle + breadcrumb]   |  [topbar-actions]
```
- **topbar-titles.topbar-title** — Page name (`Organization Hierarchy`), 18px-ish weight 600
- **topbar-titles.breadcrumb** — `[home-icon] Home › <crumb-1> › <crumb-current>`
  - Home icon: `IcHome size=13 stroke=1.8`
  - Separator: `IcChevronRight size=11 stroke=2 className="sep flip-rtl"` (auto-mirrors in RTL)
  - Current crumb: `<span className="crumb current">`
- **topbar-actions** right side, in order:
  1. `.icon-btn[aria-label="Search"]` — `IcSearch size=18`
  2. `.icon-btn[aria-label="Notifications"]` — `IcBell size=18` + red `.badge-dot` indicator
  3. `.topbar-divider` — vertical line
  4. `.user-chip` button — avatar svg + `user-name`+`user-job` block + `IcChevronDown` (`user-chevron` class)
- **Avatar** is an SVG: 40×40 rect (#cfd8dc bg) + head circle (#8a9ea7) + shoulders path.
- **UserMenu** opens on user-chip click — dismisses on outside mousedown:
  - Header: same avatar (40×40) + name + job
  - Items: Language toggle (label + sub-label EN/AR), Profile, Change Password
  - Mood toggle (cursor:default) — small `IcSun` label, mini segmented toggle: `IcMoon` (dark) / `IcSun` (light) icons in `.mood-toggle`
  - `user-menu-sep` divider
  - Logout button — `.user-menu-item.danger`, navigates to `T2 Falcon Login - Enhanced.html`

### Breadcrumb in code
```jsx
<IcHome size={13} stroke={1.8} />
<span className="crumb">{t.home}</span>
{breadcrumb.map((c, i) => (<>
  <IcChevronRight size={11} stroke={2} className="sep flip-rtl" />
  <span className={`crumb ${i===breadcrumb.length-1?'current':''}`}>{c}</span>
</>))}
```

---

## 2. Sidebar (admin/sidebar.jsx)

### Structure
```
sidebar
├── sidebar-head       (FalconMark + "FALCON" text + collapse arrow)
├── sidebar-nav        (scrollable middle)
│   ├── nav-section-label "Main Items"
│   ├── nav-item (Dashboard)
│   ├── nav-item (Contact Groups)
│   ├── nav-item (Templates)
│   ├── nav-section-label "Account Administration"
│   ├── nav-item (Organization Hierarchy)
│   ├── nav-item (Permissions)
│   ├── nav-item (Wallet & Balance .Mng)
│   ├── nav-item (CommChannels & Services .Mng)  + nav-sub items
│   │     - nav-sub-item: WhatsApp Business .Msg
│   │     - nav-sub-item: Voice Service
│   │     - nav-sub-item: AI
│   ├── nav-item (Marketplace & Applications .Mng)
│   └── nav-item (Contracts & Cost .Mng)
└── sidebar-foot       (always-visible bottom)
      ├── nav-item (System Settings)
      └── nav-item (Audit Log)
```

### Sidebar items + icon components

| id | Icon component | EN label | AR label | Children? |
|---|---|---|---|---|
| `dashboard` | `IcDashboard` | Dashboard | لوحة التحكم | — |
| `contactGroups` | `IcContactGroup` | Contact Groups | مجموعات جهات الاتصال | — |
| `templates` | `IcTemplate` | Templates | القوالب | — |
| `orgHierarchy` | `IcBuilding` | Organization Hierarchy | الهيكل التنظيمي | — |
| `permissions` | `IcLock` | Permissions | الصلاحيات | — |
| `walletBalance` | `IcWallet` | Wallet & Balance .Mng | إدارة المحفظة والرصيد | — |
| `commChannels` | `IcComm` | CommChannels & Services .Mng | إدارة قنوات الاتصال والخدمات | 3 |
| `marketplace` | `IcMarket` | Marketplace & Applications .Mng | إدارة المتجر والتطبيقات | — |
| `contractsCost` | `IcContracts` | Contracts & Cost .Mng | إدارة العقود والتكاليف | — |
| `systemSettings` | `IcSettings` | System Settings | إعدادات النظام | — |
| `auditLog` | `IcAudit` | Audit Log | سجل العمليات | — |

### Submenu items under commChannels
| id | EN | AR |
|---|---|---|
| `commChannels:whatsapp` | WhatsApp Business .Msg | (see i18n) |
| `commChannels:voice` | Voice Service | — |
| `commChannels:ai` | AI | — |

### Sidebar element classes

| Class | Style |
|---|---|
| `.sidebar` | bg `var(--teal) #0d3f44`, white text, sticky top |
| `.sidebar-head` | flex, justify-between, padding 20px, height 72px (matches topbar) |
| `.sidebar-logo` | `T2Mark size=28 color=white` + 20px `FALCON` text, letterSpacing `0.04em`, weight 700 |
| `.sidebar-collapse` | 22×22 circle, bg `rgba(255,255,255,0.1)`, hover `rgba(255,255,255,0.2)`; in collapsed/RTL the svg rotates 180° |
| `.nav-section-label` | 11px / weight 500 / rgba(255,255,255,0.4), padding 16px/12px/6px |
| `.nav-item` | 9px 10px padding, radius 8px, rgba(255,255,255,0.82), 13px / weight 500, transition 0.12s |
| `.nav-item:hover` | bg `rgba(255,255,255,0.06)`, color white |
| `.nav-item.active` | bg `var(--teal-deep) #082a2e`, white text |
| `.nav-sub` | flex-col, gap 2px, paddingInlineStart 22px, has `::before` rail line |
| `.nav-sub-item` | chevron `›` (literal char) + label, smaller; `.active` styles for selected child |

### Collapsed state
- Width `--sidebar-w-collapsed: 68px`
- `.app.collapsed .sidebar-head` stacks vertical (flex-direction: column, gap 8px, padding 16px 0)
- `.nav-section-label` becomes invisible (visibility:hidden, h:24)
- `.nav-item .label` display:none, item centered, padding 10px
- Logo: `FALCON` text hidden when collapsed (`{!collapsed && <span>FALCON</span>}`)

---

## 3. Org Hierarchy page header

Page lives inside `.main` after Topbar:

```jsx
<div className="page chart-mode?"> // chart-mode applied only in chart view
  <div className="clients-panel">  // left tree (272px fixed)
  <div className="content-panel">  // right side (1fr)
    [content depends on activeTab and on whether a modal/overlay is shown]
  </div>
</div>
```

`.page` is `display:grid; grid-template-columns: var(--clients-w) 1fr` (272px left tree, content right).

### Tab bar (lives at top of content-panel — see hierarchy.jsx ~1232)

```
[tabs-bar tabs-bar-with-toggle]
  [tabs-bar-left]   <— Hierarchy / CommChannels / Apps&Svc / Settings
  [view-toggle tabs-bar-toggle]  <— only when activeTab=hierarchy
     [view-toggle-btn] List   (icon: 3-line list svg)
     [view-toggle-btn] Tree   (icon: org-chart svg)
```

### Tabs visible per node type

| Node type | Tabs shown |
|---|---|
| **root** (Falcon) | Hierarchy, Settings |
| **client** | Hierarchy, CommChannels & Services, Apps & Services, Settings |
| **node** (sub-node) | Hierarchy, CommChannels & Services, Apps & Services, Settings |

### Top-right action buttons (in `.node-header`)
Depends on state, in this priority order:

| Scenario | Buttons (in DOM order, left→right) |
|---|---|
| **Hierarchy tab, root** | `<button btn-secondary>Add Client</button>`<br>`<button btn-primary>Add User</button>` |
| **Hierarchy tab, client/node** | `<a.info-link>` Information<br>`<button btn-secondary>Add Node</button><br>`<button btn-primary>Add User</button>` |
| **Info panel open (view)** | `<button btn-secondary>` ← Back to users<br>`<button btn-primary>` Edit Info |
| **Info panel open (edit)** | `<button btn-secondary>Cancel</button>`<br>`<button btn-primary>Save</button>` |
| **Settings tab (view)** | (portal-rendered into `#settings-actions-slot`) `<button btn-primary>` Edit |
| **Settings tab (edit)** | `<button btn-secondary>Cancel</button>` + `<button btn-primary>Save Changes</button>` |

### Node title element
```
<div className="node-title falcon?">
  [node-avatar: IcFalcon for root | BrandLogo for client | initial letter for sub-node]
  <span>{node.name}</span>
</div>
```
Avatar fallback for sub-nodes: 32×32 circle, `background:#0d3f44`, white text, 12px weight 700, first letter of name.

---

## 4. Tree panel (left column — `.clients-panel`)

### Width / layout

| Token | Value |
|---|---|
| `--clients-w` | **272px** |
| Panel selector | `.clients-panel` (grid column 1 of `.page`) |
| Background | white |
| Border-right | 1 px var(--border) |

### Top section (clients-root)
- The Falcon root node is rendered above the scrollable list as a special row.
```
.clients-root
├── .clients-root-inner   (Falcon mark IcFalcon + node name)
└── .client-menu-btn      (⋮ kebab for root)
```
- After the root: `.clients-section-label` = `t.falconClients` ("Falcon Clients" / "عملاء فالكون") as a section header.
- Then `.clients-list` is the scrollable container (`ScrollableTreeList`).

### Tree node row (`NodeRow`)

```jsx
<div className="client-node" data-depth={d} data-node-id={id}>
  <div className="client-row [selected] [on-path] [child-node-row]">
    <div className="tree-rails">[rail spans, depth count]</div>
    <span className="client-chev open|collapsed-has-kids|invisible">
       <IcChevronRight size={12} stroke={2.4} className="flip-rtl" />
    </span>
    [BrandLogo size=26 for client | initials-circle 22×22 for node]
    <span className="client-name">{name}</span>
    <button className="client-menu-btn [open]"><IcMore size=14 /></button>
  </div>
  [children: <div className="client-children"> ...recursive </div>]
</div>
```

### Tree row states (from styles.css lines 477–663)

| State | Class added | Visual |
|---|---|---|
| Default | — | bg transparent, hover bg `#ffffff` |
| Selected | `.selected` | bg + colored, `var(--teal-light) #e8f0f1`, name color `var(--teal)` weight 600 |
| Hover-path (any node hovered, ancestors highlighted) | `.on-path` | tree-rail draws teal stripe; teal elbow shows |
| Child node | `.child-node-row` | indent + connector lines visible |

### Rails (connector lines)
- `.tree-rails` is the row's left zone, contains `depth` count of `<span class="tree-rail">` elements
- `.tree-rail.elbow` is the last column (the one immediately to the left of the node)
- `.tree-rail.rail-last` is given to the elbow when this is the last child
- `.tree-rail.rail-empty` is given to non-elbow ancestors that no longer have siblings below

Hover-path style: `linear-gradient(to right, transparent calc(50% - 0.5px), var(--teal) calc(50% - 0.5px), var(--teal) calc(50% + 0.5px), transparent calc(50% + 0.5px))`.

### Chevron states (`.client-chev`)
- `.open` — rotated to point down (expanded)
- `.collapsed-has-kids` — points right (collapsed)
- `.invisible` — visibility hidden but still in flow (leaf nodes)
- `flip-rtl` class auto-mirrors in RTL.

### Kebab menu (`.client-menu-btn`)
- Always present in DOM. Visible on row hover OR when row is selected/menu open (CSS).
- Default opacity 0; visible at opacity 1 in `.client-row:hover` + `.client-row.selected` (or `.open`).
- On root row: `style={{ opacity: 1, pointerEvents: 'auto' }}` — always visible.
- Click opens `.ctx-menu.ctx-menu-floating` rendered as `position:fixed` (escapes overflow:hidden).

### Context menu items (`menuItemsFor`)
| Node type | Items |
|---|---|
| `root` | • Add Client (`IcBuilding`) • Add User (`IcUserPlus`) |
| `client` / `node` | • Add Node (`IcPlus`) • Edit Node (`IcEdit`) • Add User (`IcUserPlus`) |

Menu anchoring: positioned `top: btn.bottom+6`, in **LTR** pin right edge to button's right edge; in **RTL** pin left edge to button's left edge. Reposition on scroll/resize while open. Closes on outside click + Esc.

### Auto-scroll behavior
When a row becomes selected programmatically (e.g. from chart click, search), it calls `el.scrollIntoView({block:'nearest', inline:'nearest', behavior:'smooth'})` via `requestAnimationFrame` (skipped when the user clicked the row directly).

### Horizontal scroll → reveal full names
`ScrollableTreeList` watches `scrollLeft` on `.clients-list` and toggles `.is-scrolled`. When scrolled, the CSS overrides text truncation so full node names show up instead of ellipsis.

---

## 5. Tab strip — exact labels

Position-equivalent to PrimeNG TabMenu but custom-styled.

| Tab id | EN | AR |
|---|---|---|
| `hierarchy` | Hierarchy | الهيكل |
| `commChannels` | CommChannels & Services | قنوات الاتصال والخدمات |
| `appsServices` | Apps & Services | التطبيقات والخدمات |
| `settings` | Settings | الإعدادات |

CSS: `.tabs-bar { padding:0 24px; gap:28px; border-bottom:1px solid var(--border-2); background:white; }` ; `.tab { padding:18px 4px 16px; font-size:14px; color:var(--text-muted); border-bottom:2px solid transparent; }` ; `.tab.active { color:var(--text); weight:600; border-bottom-color:var(--teal); }`.

### View toggle (only on Hierarchy tab)
Shown right-side in `.tabs-bar-toggle`:

| Button | Label key | Icon (inline SVG) |
|---|---|---|
| `tree` view | `t.viewTree` = "List" / "القائمة" | 3 horizontal lines + dots (12×12, strokeWidth 2) |
| `chart` view | `t.viewChart` = "Tree" / "الشجرة" | Org-chart icon (rect + 2 rects + connector path) |

Active state: `.view-toggle-btn.active`. role="tablist" wrapper.

---

## 6. Hierarchy tab content (right pane)

Three sub-views, depending on state:
1. **Users table** (default)
2. **Information panel** (on info-link click)
3. **Org chart** (when `hierarchyView==='chart'`)

### Users table top bar (`.table-head-bar`)
- **Title left**: `<div className="table-head-title">{t.users}</div>` ("Users")
- **Controls right** (only shown when `isRoot`):
  - `<button className="filter-btn">` + `IcFilter size=14 stroke=1.8` + `t.filter` ("Filter")
  - `<div className="search-input">` `IcSearch size=14 stroke=1.8` + `<input placeholder={t.searchHere}>` ("Search here")

So: Filter+Search controls **only show on the Falcon root node**. For client/node tables they're hidden.

### Users table columns (UsersTable component)

| col id | Header label (EN) | Render |
|---|---|---|
| `username` | Username | `td.col-username` |
| `firstName` | First Name | `td` |
| `email` | Email | `td.col-email` |
| `phone` | Phone Number | `td.col-phone` with `dir="ltr"` (keeps phone LTR in RTL layout) |
| `role` | Role | `td` |
| `permGroup` | Permission Group | `td` |
| `status` | Status | `<StatusBadge>` |
| (sticky) `actions` | Actions | `.col-actions` (3-dot button + per-row menu) |

The headerless **left-most select column** appears to be removed in this version — the code only iterates `cols` (no checkbox/select-all in header).

### Row hover & selected styles
- `.users-table tr.selected` — bg `var(--teal-light)` / etc. (per CSS) — only when `selected.has(u.id)`. Default `setSelected(new Set(['u3']))` so Hajeer is selected by default.
- Default-selected user (`u3` Hajeer) per hierarchy.jsx line 1136.

### Row action menu (3-dot)
- Button: `.row-action-btn` (gets `.open` when active), `IcMore size=16`
- Opens `.row-menu` below: single item `<button className="row-menu-item">` with `IcInfo size=14 stroke=1.8` + `{t.moreDetails}` ("More Details")
- Clicking goes to `<UserDetailsPage>` (see section 11).

### Pagination footer (`TablePagination`)
Reusable component:
```
[Showing 1 - 20 from 100]                    [<<] [<] page X of Y [>] [>>]    [Rows per page: 20 ▼]
```
- `.table-footer` flex
- `.table-footer-info` = "Showing {start} - {end} from {total}"
- `.table-pager` with: first-page `<<` (custom svg with double-chevron), prev `<`, `[currentNum] of [totalPages]`, next `>`, last `>>`
- `.table-pager-rows` select with options `[10, 20, 30, 40]`
- All chevron icons use `flip-rtl` class.

### KanbanView (alternate users view — code present but not currently routed from any switch)
- Status columns: Active, Pending, Suspended, Locked, Deleted — each `.kanban-col`
- `.kanban-col-head` shows StatusBadge + count
- `.user-card` content:
  - `.user-card-head`: 40×40 initials avatar (uppercase first 2 of firstName) + name + username + 3-dot menu
  - `.user-card-contact` 2 lines: mail-svg + email, phone-svg + phone (dir=ltr)
  - `.user-card-foot` pills: `.role-pill` and `.perm-pill`

---

## 7. Apps & Services tab (admin/apps.jsx)

### Top header (Applications panel)
- `<div className="apps-panel-header">` — text is `t.applications` for apps tab, `t.tabCommChannels` for comm channels tab. Renders the same UI for both with different seed data.

### Table columns (note: each header label is wrapped 2-words-per-line via `wrapTwo()`)

| col header | i18n key (EN) |
|---|---|
| Visibility | colVisibility |
| Name | colName |
| Price Type | colPriceType |
| Price Value | colPriceValue |
| First Activation Date | colFirstActivation |
| Activation Date | colActivationDate |
| Renew Date | colRenewDate |
| Status | colStatus |
| Action | colAction |

### Row content
| Column | Render |
|---|---|
| Visibility | `<VisibilityToggle>` — pill switch (`.vis-toggle`, `.vis-toggle.on` when on, `.vis-toggle-dot` is the thumb) |
| Name | `.name-cell` strong text |
| Price Type | text (`Monthly` / `Yearly` / `Quarterly` / `OneTime`) |
| Price Value | `<SAR/>` riyal glyph (IcRiyal) + `value.toLocaleString()` |
| First Activation / Activation / Renew | dates as `MM/DD/YYYY`. When null shows `-----` (5 dashes) |
| Status | `<StatusBadge>` unless `!visible || !firstActivation` then shows `-----` |
| Action | `.row-action-stack`: optional toggle-pending button (chevron-down svg) + `.row-action-btn` 3-dot |

### Row action menu (per status)

| App status | Menu items (icons + labels) |
|---|---|
| `active` | `actDisable` (Disable, circle-slash), `actEditPriceType` (Edit), `actEditPriceValue` (Edit) |
| `expired` | `actDoPayment` (card+slash), `actDisable`, `actEditPriceType`, `actEditPriceValue` |
| `disable` | `actEnable` (circle-check), `actEditPriceType`, `actEditPriceValue` |
| `inactive` | `actDoPayment`, `actDisable` |

### Inline edit-row (expansion after action)
When editing price type or price value, a sub-row expands beneath:

| Mode | Label | Control | Footer actions |
|---|---|---|---|
| `type` | `t.newPriceType` "New Price Type" + `t.effectiveDate` "Effective Date" | edit-select-pill `<select>` w/ OneTime/Monthly/Quarterly/Yearly + `<DatePicker>` (popover, min-date today+1) | Edit mode: Cancel link + Save text-button. View mode: edit-icon + remove-icon (trash) |
| `value` | `t.newPriceValue` "New Price Value" | edit-price-input with SAR glyph + numeric input | same |

When edit is saved, the row keeps the pending change in a `pendingMap` keyed by `id` and mode. Two pending rows can co-exist (one type, one value) — both expand under the row. Toast on save: `Applications: Save ✓`.

### Status pills (canonical from styles.css 1319-1351)

| Status | bg | text | dot | Label EN |
|---|---|---|---|---|
| `active` | `var(--green-bg) #d9f2e4` | `#0f7a3a` | `var(--green) #16a34a` | Active |
| `expired` | `#FFEDED` | `#a1191d` | `#d92d20` | Expired |
| `disable` (display class `.disabled`) | `#F3F3F3` | `#595959` | `#D9D9D9` | Disable |
| `inactive` | `#C2C2C2` | `#444444` | `#444444` | Inactive |
| `suspended` | `#F3F3F3` | `#5a6470` | `#D9D9D9` | Suspended |
| `deleted` | `var(--red-bg) #fde2e4` | `#a1191d` | `var(--red) #dc2626` | Deleted |
| `locked` | `#C2C2C2` | `#444444` | `#444444` | Locked |
| `pending` | `var(--orange-bg) #ffeccb` | `#a85a00` | `var(--orange) #f59e0b` | Pending |

`.status-badge` is `display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:999px; font-size:12px; font-weight:500;` with `.dot` being 6×6 round.

### Insufficient Balance modal (drag-to-reorder)
When `Do Payment` selected and balance insufficient. Custom modal `.ib-modal`:
- Big red triangle warning svg (64×64)
- `t.ibTitle`: "Insufficient Balance Detected"
- `t.ibSubtitle`: "Please prioritize the Communication Channel wallet…"
- Drag-rank list (`.ib-list`): WhatsApp / Voice / AI-ChatGPT
  - Each row: rank number, grip dots icon (`.ib-grip`), name, up/down arrows
  - HTML5 drag-and-drop
- Info note: "The first channel will be used automatically." (`t.ibFirstAuto`)
- Actions: `Cancel` (text link) + `Proceed Payment` button

---

## 8. CommChannels & Services tab

Same `ApplicationsPage` component, different seed data via `tabKey`. Different default rows (SMS Gateway, WhatsApp Business, Email Relay, Voice IVR, Push Notifications, AI-ChatGPT, RCS Messaging, Telegram Bot, Apple Business Chat). Header text reads `t.tabCommChannels` instead of `t.applications`. Otherwise identical UI/behavior.

---

## 9. Settings tab (admin/settingstab.jsx)

### Layout
2-column grid `.ac-settings-grid` (left larger, right side aside):

```
[ac-settings-left]                      [ac-settings-right aside]
  Password Security Level                Account Limitations
   [normal radio card]                    Max Normal User Limit (stepper)
   [advanced radio card]                  Max System User Limit (stepper)
  Allowed IPs                             Max Node Level (stepper)
   [+ IP Address button] [chips...]
   [input "Enter IP Address..." Enter]
   * Restrict platform...
```

For **root (Falcon)**: only the left card shows (`isRoot && hide right`). The grid takes `is-root-only` class.

### Modes
- View mode (default): all controls disabled; `Edit` button at top portal (slot `#settings-actions-slot`)
- Edit mode: controls active; bar shows `Cancel` (revert from snapshot) + `Save Changes` (toast `'Settings updated successfully'`)

### Radio cards (`.ac-radio-cards`)
Two cards `.ac-radio-card`:
1. **Normal** — strong title + em sub: "Username, Password, OTP"
2. **Advanced** — strong title + em sub: "Comply with NCA regulations, press here for more details." (with inline link)

Selected card gets `.selected` class. Disabled in view mode gets `.is-disabled` and `.ac-radio-mark` is dim.

### IP chips (`.ac-ip-row`, `.ac-ip-chip`)
- `.ac-ip-add` is the entry button — when clicked in edit mode it reveals an input `.ac-ip-input` (placeholder: `Enter IP Address (IPv4 or IPv6) and press Enter`). Enter key adds chip; Esc cancels.
- Each chip: dotted-pill style, IP text + small `IcClose size=10 stroke=2.4` to remove (only in edit mode).
- View mode shows chips read-only, no remove buttons; if zero chips: hint `No IPs configured`.

### Number stepper (`.ac-number`)
Number input with custom +/− arrow buttons stacked on the right side. Used for limit caps. In view mode the inputs are disabled (greyed).

### Limit rows (edit mode shows both side-by-side)
| Title | EN |
|---|---|
| Max Normal User Limit | "Max normal user limit" |
| Max System User Limit | "Max System User Limit" |
| Max Node Level | "Max Node Level" |

In edit mode: 2-column inner: "Current existing" (disabled input) + "Max allowed" (NumberStepper).

---

## 10. Users table — top actions visibility

| Context | Filter btn | Search input |
|---|---|---|
| Root node | yes | yes |
| Client/Node | no | no |

Add User / Add Client / Add Node buttons live in **`.node-header`** (not in the table bar) — see section 3 for full button matrix.

---

## 11. Information page (drill-down inside Hierarchy tab)

When `info-link` clicked, the users-table is replaced with `<InfoPanel>`.

### Layout
```
.info-panel
├── .info-panel-header  "Information"
└── .info-panel-body
    ├── .info-client-pic  (view) or .au-avatar-row (edit)
    │   - 84×84 circle with BrandLogo OR initials
    │   - Name + "Client Picture" label
    ├── .info-grid.info-grid-top (4-col)
    │   - Account Name, Finance ID, Classification Category (select), Classification Sub Category (select)
    └── .info-grid.info-grid-bottom
        ├── .info-section-title "Account Official"
        ├── Entity Name, Authority Letter Type (select), Sector, Budget No.
        ├── Country (select), City (select), District, Street
        ├── Building Number, Postal Code
        └── Additional Address, Another ID, VAT Registration Number
```

### Editable fields (i18n keys)
`infoAccountName`, `infoFinanceId`, `infoClassification` (select), `infoSubClassification` (select), `infoAccountOfficial` (section header), `infoEntityName`, `infoAuthorityType` (select), `infoSector`, `infoBudget`, `infoCountry` (select), `infoCity` (select), `infoDistrict`, `infoStreet`, `infoBuilding`, `infoPostal`, `infoAddlAddr`, `infoAnotherId`, `infoVAT`.

### Static SELECT_OPTIONS
| field | options |
|---|---|
| classification | Government, Banking, Healthcare, Energy, Retail, Organization, Sub-Node |
| subClassification | Public Sector, Commercial, Non-profit |
| authorityType | Government, Private, Joint Venture, Organizational Unit |
| country | Kingdom Of Saudi Arabia, Saudi Arabia, UAE, Egypt, Jordan |
| city | Riyadh, Jeddah, Dammam, Mecca |

### View vs edit
- View: shows `<span className="info-field-value">{value}</span>`
- Edit: input or select using `.ac-input` styles. Select wrap shows `IcChevronDown` chevron.
- Photo edit shows the **`au-avatar-row`** uploader: 84×84 circle + edit/delete tiny buttons + Upload Photo button.
  - Drop area hint: "Drag a photo here or" + Upload Photo button
  - File rule: PNG, JPG up to 2MB.

### Toast on save
`'Information updated ✓'` (literal).

---

## 12. Add Client wizard (admin/addclient.jsx)

5-step stepper. Renders as a **full-screen page replacement** within the content-panel (not a modal).

### AC_STEPS
| Index | id | Label | Icon |
|---|---|---|---|
| 0 | `info` | Client Information | grid icon |
| 1 | `settings` | Settings | cog icon |
| 2 | `channels` | CommChannels | circular-arrow icon |
| 3 | `apps` | Applications | 4-square icon |
| 4 | `owner` | Account Owner | person icon |

### Page chrome (`.ac-page`)
- **Top bar (`.ac-topbar`)**: left = `T2Mark size=26 color=#0d3f44` + `Falcon` brand name; right = `Cancel` button, `Previous` (if step>0), `Next`/`Save` primary button.
- **Body (`.ac-body`)**: `.ac-card` white card with:
  - `.ac-card-head`: title `"Create New Client"` + step counter `step X/5`
  - **`<ACStepBar>`**: horizontal track with 5 dots and gradient fill. Each dot can be "idle/active/done"; done shows check svg; active shows pulse. Dots clickable to jump backward only (`i <= current`). Labels below each dot.
  - `.ac-card-body { height: 751px; }`: holds the animating step pane (`.ac-anim-pane.in-right` or `.in-left`)

### Step 1 — Client Information
- `<ACProfilePicture>` block (drag-drop or upload, 2MB limit hint)
- Account block (4-column grid `.ac-field-grid.ac-grid-4`):
  - **Account Name** (required, asterisk) — placeholder: `Start with letter · Max 30 Characters`. Error: `*Please fill this field` shown below in red.
  - **Finance ID** (required) — text
  - **Classification Category** (select) — options: Government / Banking / Healthcare / Energy / Retail
  - **Classification Sub Category** (select) — options: Public Sector / Commercial / Non-profit
- `.ac-section-block` "Account Official" header (`.ac-section-title`)
- 4-column grid of: Entity Name, Authority Letter Type (Government/Private/Joint Venture), Sector, Budget No., Country (SA/UAE/EG/JO), City (Riyadh/Jeddah/Dammam/Mecca), District, Street, Building Number, Postal Code, Additional Address, Another ID, VAT Registration Number

### Step 2 — Settings
Same shape as the Settings tab (section 9): left card (security + IPs), right aside (limits). Defaults:
- `security: 'normal'`
- `allowedIps: ['192.168.0.1', '192.168.0.1']`
- `maxNormal: 20, maxSystem: 5, maxNode: 2`
- `currentNormal: 0, currentSystem: 5, currentNode: 0`

### Step 3 — CommChannels (`<ACServiceTable rows=channels>`)
Five-column row table:
| Column | Cell |
|---|---|
| Visibility | `.vis-toggle` switch |
| Name | strong text |
| Price Type | select: OneTime/Monthly/Yearly/Quarterly |
| Price Value | `.ac-price-input` with SAR glyph + numeric |
| Status | "Inactive" pill (`.ac-status-pill`) or `------` if !visible |

Default rows: WhatsApp (visible, Monthly, 2000), Voice (hidden), AI (visible, OneTime, 2000)

### Step 4 — Applications
Same `<ACServiceTable>`. Defaults: Basic Send App (Monthly 2000), Survey Engine (hidden), Campaign Engine (OneTime 2000)

### Step 5 — Account Owner
- `<ACProfilePicture>` "Owner Picture"
- 4-col grid:
  - First Name (req), Last Name (req), User Name (req)
  - Password (disabled, value `#123455`)
  - National ID / Iqama
  - Phone Number (req)
  - Email Address (req)
  - Role (disabled, value `Account Owner`)

### Footer buttons per step
- Step 0: `Cancel` + `Next`
- Steps 1–3: `Cancel` + `Previous` + `Next`
- Step 4 (last): `Cancel` + `Previous` + `Save` → opens SendCredentialsModal

### SendCredentialsModal
- Heading: `Sending Credentials`
- Sub: `An email and/or SMS with the username and password will be sent to the account owner`
- 3 selectable illustration cards (radio-style):
  - `Send via Email` — `admin/assets/send-email.svg`
  - `Send via SMS` — `admin/assets/send-sms.svg`
  - `Both, SMS and Email` — `admin/assets/send-both.svg`
- Summary block: Account owner + Phone Number + Email (with svg icons)
- Footer: `Cancel` (text link) + `Send Credentials` (primary)

### SuccessModal
- Closes wizard
- Big "successfully" SVG illo (`admin/assets/successfully.svg`)
- Title: `Completed successfully`
- Sub: `Credentials sent to the user`
- Toast emitted on close: `t.toastNodeAdded` "The Node has been added successfully" (or fallback "Client created ✓")

---

## 13. Add User wizard (admin/adduser.jsx)

3-step stepper. Same full-page replacement pattern as Add Client.

### Steps
| Index | id | Label |
|---|---|---|
| 0 | `personal` | Personal Information |
| 1 | `role` | Role & Status |
| 2 | `permissions` | Permissions & Privilege |

### Top bar
Brand: `BrandLogo` of the active node + node name (e.g. "Aramco") OR `T2Mark` + "Falcon" if no node.
Actions: Cancel + Previous + Next/Finish.

### Step 1 — Personal Information
- `.au-avatar-row` photo uploader (same shape as Add Client):
  - Left: 84×84 (`.au-avatar-circle`) initial circle or image. Edit pencil + delete X overlays when photo present.
  - Right: drag hint + `Upload Photo` button.
- `.au-divider` rule
- `.au-form-grid.au-form-grid-3` (3-col):
  - First Name (req), Last Name (req), User Name (req)
  - National ID / Iqama (placeholder `10-digit number`)
  - Phone Number (req) — uses `<PhoneInput>` (see section 14)
  - Email Address (req) — uses `<EmailInput>`

### Step 2 — Role & Status
- `.au-form-grid.au-form-grid-2`:
  - **User Status** (select, **disabled** in this version) — options: Active / Inactive / Suspended / Pending. Default `active`.
  - **User Role** (select) — options: System Admin / Operation / Products / Support / Viewer

### Step 3 — Permissions & Privilege
- **Assigned Permission Group** (`.au-perm-section`) — select: Admin Group / Read Only Group / Operations Group / Support Group
- `.au-divider`
- **CommChannel Checker Level** title
- `.au-checker-table` with 2 rows (WhatsApp, Voice). Each row shows 3 radio options:
  - None
  - Checker Level One
  - Checker Level Two

### Submit
Click Finish on step 3 → opens `<CredentialsModal>` (same shape as Add Client SendCredentialsModal) → SuccessModal → toast `'User created & credentials sent ✓'`.

### Stepper jump-back
Users can click any past step to jump back (clickable label has `.is-clickable` class). Future steps are not clickable until reached (`maxStep` tracks furthest reached).

---

## 14. PhoneInput + EmailInput + OTP Modal (admin/otp-verify.jsx)

### PhoneInput
- Wrapper `.otp-phone-wrap`, inner `.otp-phone-input` (gains `.is-verified` once verified)
- Layout: `[country-button] [divider] [+dial] [input] [verify-button]`
- `.otp-cc-btn`: flag (circular 22×22 svg, slice preserve) + small chev (`<IcChevronUpDown>`)
- `.otp-cc-dial` shows country dial code (e.g. `+966`)
- `.otp-phone-num` numeric input, placeholder `5XX XXX XXXX`
- Verify/Verified pill: `<button.otp-verify-btn>` with refresh-style svg + "Verify" / `<span.otp-verified-tag>` with check-circle + "Verified"
- Field-level error: `.otp-field-error` with info icon + "Verification required before saving"

### Country dropdown (`.otp-cc-menu`)
- Search row `.otp-cc-search` with search icon + placeholder "Search for countries"
- Two-section list: first 2 results / separator / rest
- Each item `.otp-cc-item`: flag (`.otp-flag.otp-flag-md`) + country name + `.otp-cc-dialpill` (dial code)
- 25 countries defined: US, UZ, AF, AL, DZ, AD, SA, AE, EG, JO, KW, BH, QA, OM, YE, IQ, SY, LB, PS, GB, FR, DE, IN, PK, TR
- Default `SA` (+966)

### EmailInput
- Wrapper `.otp-email-wrap`, inner `.otp-email-input` (gains `.is-error`, `.is-verified` modifier)
- Email input placeholder: `name@company.sa`
- Same verify button + verified tag pattern.

### OTP Modal (`.ac-modal-overlay > .ac-modal.otp-modal`)
- Title: `OTP Verification`
- Status states: `'input' | 'invalid' | 'expired' | 'success'`
- **Status: input/invalid**:
  - Banner only if invalid: `.otp-invalid-banner` icon + "Invalid OTP"
  - Line: `The verification code has been sent to your Phone number` / `your Email address`
  - Target line: `.otp-sent-target` shows the phone or email value
  - 6 OTP boxes `.otp-box` split 3+3 with `.otp-sep` between. Numeric inputs, autofocus first, arrow nav, paste support
  - **Acceptance rule (from code)**: `joined === '150999'` → invalid; anything else → success.
    (Note: the user task spec said all-zeros should pass; the actual source rejects only `150999`. Downstream agents should follow Brain SK task spec; flag this discrepancy.)
  - Circular timer 60s (radius 36, dashed countdown). When 0 → status `'expired'`, code `<input>`s disabled, message: `Code expired — please resend`.
  - `.otp-resend` button (icon + "Resend") — disabled while timer running. Resets code + timer.
- **Status: success**:
  - `.otp-success` block: big check icon (34×34), title `Successfully`, sub `OTP verified successfully`
  - Auto-closes onSuccess after 1300ms.

---

## 15. Add Node drawer (admin/drawers.jsx)

Slide-in from right (no left/bottom variant).

```
.drawer-overlay  (fixed full screen, dimmed)
.drawer (aside)  role="dialog" aria-modal
├── .drawer-head
│   ├── .drawer-title  ("Add Node" / "Edit Node")
│   └── .drawer-close button — IcClose size=14 stroke=2
├── .drawer-body
│   └── .field
│       ├── .field-label "Node Name"
│       └── .field-input  (single-line text)
└── .drawer-foot
    ├── btn-secondary "Cancel"
    └── btn-primary    "Add"  /  "Save"  (disabled when name is empty)
```

### Behaviors
- Esc to close
- Outside click on `.drawer-overlay` to close
- Enter in input submits
- Drawer title pulls from `t.addNode` / `t.editNode`
- Primary button label: Add (mode='add') / Save (mode='edit')

---

## 16. OTP popup (in Add User flow)

Covered in section 14. Trigger is the `Verify` button next to phone (PhoneInput) or email (EmailInput) — `showVerify` prop is true when `form.status === 'pending'` (and target value isn't empty). Calling `openOtp('phone'|'email')` sets `otpChannel` state and renders `<OtpModal>` overlaying the wizard.

---

## 17. Confirmation / info dialogs

| Dialog | Trigger | Component | Key text |
|---|---|---|---|
| Toast (success) | Tree edits, saves | `<Toasts>` floating stack | Check icon + msg + close X. Auto-dismiss after 3500ms. Position: `.toast-stack` |
| OTP modal | Phone/email Verify click | `<OtpModal>` | See section 14 |
| Send Credentials modal | Add Client step 5 Save / Add User step 3 Finish | `<SendCredentialsModal>` / `<CredentialsModal>` | "Sending Credentials" |
| Success modal | After Send Credentials confirm | `<SuccessModal>` / `<UserSuccessModal>` | "Completed successfully" |
| Insufficient Balance modal | "Do Payment" on expired app | `<InsufficientBalanceModal>` | "Insufficient Balance Detected" |
| Node drawer | Context menu Add/Edit Node | `<NodeDrawer>` | "Add Node" / "Edit Node" |

Toast structure:
```jsx
<div className="toast">
  <span className="toast-icon"><IcCheck size=12 stroke=3 /></span>
  <span className="toast-msg">{msg}</span>
  <button className="toast-close" onClick={dismiss}><IcClose size=14 /></button>
</div>
```

---

## 18. View modes (List vs Tree)

### List (`hierarchyView==='tree'`) — default
Tree panel on left + users table on right. Section 4 covers tree.

### Tree (`hierarchyView==='chart'`) — `<OrgChartView>`
Renders the full org chart card layout in the content panel (page gets `.chart-mode` class).

```
.org-chart-wrap
├── .org-chart-toolbar
│   ├── .chart-legend
│   │   ├── dot.root  + "Platform"
│   │   ├── dot.client + "Client"
│   │   └── dot.sub   + "Sub-node"
│   └── .chart-hint   ("Click any node to view its details" or "{name} — N users" when focused)
└── .org-chart-canvas-scroll  (panning + zoom viewport)
    ├── .org-chart-canvas  (transform: translate + scale)
    │   ├── svg.org-chart-lines  (connector L-paths between cards)
    │   └── .chart-card cards positioned absolutely
    ├── (focused state) user circles ring under focused node
    └── .chart-focus-close button (when focused)
    └── .chart-zoom-controls (+/-, level%, fit, reset)
```

### Card layout numbers
- `CHART_CARD_W = 180`, `CHART_CARD_H = 56`
- `CHART_H_GAP = 60`, `CHART_V_GAP = 14`, `CHART_PAD = 24`
- Recursive `layoutChart()` computes x/y positions; lines drawn as L-paths from parent right-center to child left-center, bending at midpoint.

### Card content (`<ChartCard>`)
- Brand icon left: `IcFalcon` for root / `BrandLogo` for client / initials circle for node
- Right: `.chart-card-name` + `.chart-card-meta` ("N sub-nodes" / "1 sub-node" using `t.chartChild`/`chartChildren`)
- Classes: `.chart-card.selected.is-root.is-client.is-dimmed.is-focused` (mutually-exclusive bundles)
- Connector lines: `stroke="#7C82A9" strokeWidth="1.5" strokeOpacity="0.5"`

### Focus mode
Click a card → smooth animation focuses on that node; zoom to 1.6 and shift to top-third. Renders **user circles ring** below the card:
- 54×54 circles, 18px spacing
- Connector: dashed `#0d3f44` line from card bottom to circle row (opacity 0.4)
- Each circle: status-color border + initials + status dot (bottom-right)
- Below each circle: name + role label
- Animation delays staggered ~60ms

Exit focus: click empty area / Exit Focus button (`.chart-focus-close`) / zoom-out wheel.

### Zoom controls (`.chart-zoom-controls`)
4 buttons + percentage:
- Zoom in (+): plus svg inside magnifier
- Zoom out / Exit focus (−): minus svg
- Fit to view (square corners icon)
- Reset (refresh icon)
- Level pill: `Math.round(zoom*100)%`

### Pan + Wheel
- Wheel: zoom-at-cursor (preventDefault); zoom range [0.3, 2.0]
- Mouse drag pan (skip if click started on a card or user-circle)
- Cursor: `grab` default, `grabbing` while `.panning` is set

### Dotted background grid?
The CSS file likely contains a `.org-chart-canvas-scroll` background — confirmation pending — but the layout itself is clean white from the source files. Pattern is rendered (if any) via CSS in `styles.css`. Downstream may need to verify on live screenshot.

---

## 19. Brand colors / tokens (from styles.css :root + observed inline)

| CSS var | Value | Used for |
|---|---|---|
| `--teal` | `#0d3f44` | brand primary, active nav, accent |
| `--teal-dark` | `#0a3338` | (variant) |
| `--teal-deep` | `#082a2e` | active nav item bg |
| `--teal-hover` | `#124c52` | primary button hover |
| `--teal-light` | `#e8f0f1` | selected row bg, soft tint |
| `--accent` | `#0d3f44` | same as teal |
| `--text` | `#1a1a1a` | primary text |
| `--text-2` | `#3d3d3d` | secondary text |
| `--text-muted` | `#6b7280` | tertiary/captions |
| `--text-faint` | `#9ca3af` | hints |
| `--border` | `#e5e7eb` | default border |
| `--border-2` | `#eef0f2` | subtle separators (tab bottom etc.) |
| `--bg` | `#ffffff` | white |
| `--bg-panel` | `#fafafa` | flat panel |
| `--bg-hover` | `#f5f7f8` | hover bg |
| `--bg-page` | `#f5f6f7` | app page bg (main) |
| `--green` | `#16a34a` | active status dot |
| `--green-bg` | `#d9f2e4` | active status pill bg |
| `--gray-status` | `#9ca3af` | neutral dot |
| `--gray-status-bg` | `#e7eaee` | neutral pill bg |
| `--red` | `#dc2626` | deleted/danger |
| `--red-bg` | `#fde2e4` | deleted pill bg |
| `--orange` | `#f59e0b` | pending dot |
| `--orange-bg` | `#ffeccb` | pending pill bg |
| `--sidebar-w` | `224px` | layout |
| `--sidebar-w-collapsed` | `68px` | layout |
| `--topbar-h` | `72px` | layout |
| `--clients-w` | `272px` | layout |

### Status colors (canonical)
See section 7 table.

### One-off colors observed in JSX
- Chart line stroke: `#7C82A9` opacity 0.5
- Focus-user connector: `#0d3f44` dashed opacity 0.4
- Sub-node avatar bg: `#0d3f44`
- Cyan accent (used in marketing/index, but not in admin): `#2dd4d9`
- Falcon-loading bg in unbundler: `#0d3f44`

---

## 20. Typography

### Fonts loaded (T2 Falcon Admin.html `<link>`)
- **Poppins** weights `400,500,600,700`
- **IBM Plex Sans Arabic** weights `400,500,600,700`
- (index.html also loads **Inter** weights `400,500,600,700,800`)

### Defaults
```css
html, body {
  font-family: 'Poppins', 'Inter', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}
body[dir="rtl"] { font-family: 'IBM Plex Sans Arabic', 'Poppins', sans-serif; }
```

### Type scale (observed)
| Use | Size | Weight | Class |
|---|---|---|---|
| App brand (sidebar) | 20px | 700 / 0.04em letter-spacing | `.sidebar-logo` |
| Topbar title (page name) | 18-ish px | 600 | `.topbar-title` |
| Node title (page header) | 18px | 600 | `.node-title` |
| Section title (info, account official) | ~15px | 600 | `.ac-section-title`, `.info-section-title` |
| Tabs | 14px | 500 (active 600) | `.tab` |
| Nav item | 13px | 500 | `.nav-item` |
| Nav section label | 11px / 0.02em | 500 | `.nav-section-label` |
| Status pill text | 12px | 500/600 | `.status-badge` |
| Field label | 13px | 500 | `.ac-label`, `.au-label`, `.info-field-label` |
| Input text | 14px | 400 | `.ac-input`, `.au-input` |
| Table header text | ~13px wrapped | 500 | `th` |
| Toast | 13px | — | `.toast-msg` |
| Pagination info | 12-13px | — | `.table-footer-info` |
| Card title (modal) | 22px | 600 | `.ac-modal-title` |

### Buttons (`.btn`)
- `.btn-primary` — teal bg, white text, hover `--teal-hover #124c52`
- `.btn-secondary` — white bg with border, hover bg `--bg-hover`, border `#d1d5db`

---

## 21. Animations / transitions

From styles + JSX:
- Sidebar expand/collapse: `transition: grid-template-columns 0.2s ease` on `.app`
- Sidebar collapse arrow: rotate 180deg, in `transition: background 0.15s` on hover
- Nav-item hover: `transition: background 0.12s, color 0.12s`
- Tab transition: `transition: color 0.15s, border-color 0.15s`
- Info link transition: `transition: color 0.15s`
- View toggle button hover: similar 0.12s
- Stepper progress: gradient fill animates as % grows
- Stepper dot active: `<span className="ac-stepper-dot-pulse" />` animated pulse
- Step pane in/out: `.ac-anim-pane.in-right` / `.in-left` classes (key=step triggers re-mount; animation defined in CSS)
- Org chart focus/exit: `.org-chart-canvas.animating` class plus `withAnim()` wrapper, ~520ms
- User circles in focused chart: `animationDelay: ${180 + i*60}ms` for circles, `${260 + i*60}ms` for labels
- Toast: appear/disappear (auto-dismiss 3500ms)
- OTP timer ring: `style={{ transition: 'stroke-dashoffset 0.95s linear' }}`
- OTP success transition: 1300ms before onSuccess fired
- Wallet/etc: not in scope

---

## 22. Drill-down (`<UserDetailsPage>`) — additional findings

When "More Details" picked from a user row menu, the page replaces the users table with `<UserDetailsPage>`:

```
.ud-wrap
├── .ud-top-bar
│   ├── .ud-top-left  [node-avatar + node-name "Aramco"]
│   └── .ud-top-actions
│       View: [Back to User list] + [Edit]
│       Edit: [Cancel] + [Save]
├── .ud-card
│   ├── .ud-card-head  h2 "User Profile" or "Edit User"
│   ├── .ud-tabs       [Personal Information] [Role & Status] [Permissions & Privilege]
│   └── (pane per tab in view or edit mode)
```

### UD view fields
- **Personal**: avatar block (140-ish?), divider, 4-col grid: First Name / Last Name / User Name / National ID, then 4-col with Phone Number (verified badge if status==pending) + Email (with copy button + verified badge)
- **Role**: 2-col grid: User Status + User Role (read-only display via UDField)
- **Permissions**: Assigned Permission Group (single field), divider, CommChannel Checker Level grid (WhatsApp + Voice with displayed level label)

### Verify badge
`<UDVerifyBadge>`: check-circle (verified) or warning triangle (not verified) + tooltip on hover.

### Copy button
On email field — clicks navigator.clipboard.writeText(value).

### Edit mode
Tabs swap to `<UDEditPersonal>` / `<UDEditRole>` / `<UDEditPermissions>` — these reuse `<PhoneInput>`/`<EmailInput>` + `.au-*` styles from adduser. `User Status` select is **disabled** in edit.

### Status / Role / PermGroup label maps (canonical English)
```js
STATUS_LABEL = { active:'Active', suspended:'Suspended', deleted:'Deleted',
  locked:'Locked', pending:'Pending', inactive:'Inactive' };
ROLE_LABEL = { system_admin:'System Admin', operation:'Operation',
  products:'Products', support:'Support', viewer:'Viewer' };
PERM_LABEL = { admin:'Admin Group', readonly:'Read Only Group',
  ops:'Operations Group', support:'Support Group', Support:'Admin Group', Ops:'Operations Group' };
CHECKER_LABEL = { none:'None', level1:'Checker Level One', level2:'Checker Level Two' };
```

---

## 23. Seed data summary (admin/data.jsx)

### Seed users (per node)
6 users with these fields: `id, username, firstName, email, phone, role, permGroup, status`.

| id | username | firstName | role | permGroup | status |
|---|---|---|---|---|---|
| u1 | thamer | Thamer | System Admin | Support | active |
| u2 | anas | Anas | Operation | Ops | suspended |
| u3 | Hajeer | Hajeer | Products | Support | active |
| u4 | Najla | Najla | System Admin | Support | deleted |
| u5 | Faisal | Faisal | System Admin | Support | locked |
| u6 | Abdallah | Abdallah | System Admin | Support | pending |

### Seed tree (5 clients + sub-nodes)
- Root: `falcon` (Falcon)
  - `alrajhi` — Al-Rajhi Bank (no subs)
  - `snb` — Saudi National Bank (4 children, 1 deep)
  - `bupa` — Bupa Arabia for Cooperative Insurance Company (no subs)
  - `aramco` — Aramco (5 children, with cc → 3 sub-subs)
  - `bmw` — BMW Group (10-level deep, demonstrates worst-case hierarchy depth)

Default expanded set: `{ aramco: true, cc: true }`. Default selected: `aramco`.

### BrandLogo component
Renders different shape per brand:
- `alrajhi`: green "ر" arabic-style svg path on white tile (`.client-logo.bank-rajhi`)
- `snb`: text "SNB" tile (`.bank-snb`)
- `bupa`: red circle with white center (`.bank-bupa`)
- `aramco`: `<img src="admin/assets/aramco-logo.png">` — actual logo image
- `bmw`: conic-gradient (#fff/#1c69d4 alternating) + "BMW" text — pure CSS+inline-styles
- default: `.client-logo.node-generic`

---

## Open questions / ambiguities

1. **OTP accept rule** — Task spec said "all zeros pass, anything else fail". Source code says `'150999'` is rejected and everything else passes. Downstream agents must decide which to honor; likely the Brain SK task spec wins.
2. **Chart dotted-grid background** — Task spec mentions "dotted grid background" for org-chart viewport; the JSX itself doesn't include any explicit dotted pattern. May be styled in `styles.css` lines >2700 (org-chart sections not fully read here). Verify in live screenshot.
3. **Sidebar AI submenu items** — Source has only WhatsApp/Voice/AI under CommChannels; spec mentioned 3 children. Confirmed 3.
4. **Tab order discrepancy** — Task spec says "Apps & Services, CommChannels & Services" but source uses `[Hierarchy, CommChannels, Apps&Services, Settings]` for non-root, `[Hierarchy, Settings]` for root. Use the source order.
5. **Filter / Search controls only on root node table** — confirmed by `isRoot &&` guard. Spec mentioned "Filter / Search" as top actions; should the spec require these be visible on every node table? Source says no.
6. **Default-selected user (Hajeer)** — code initializes selected user set to `['u3']` so Hajeer row appears selected on first load. Is this an artifact of the demo or intended UX?
7. **`User Status` is disabled in both Add User and User Details edit** — Status changes presumably happen elsewhere (Audit / Permission flows). Confirm with React reference: is status read-only here forever, or only because this is demo data?
8. **Settings tab default IPs** — both Add Client wizard step 2 and Settings tab seed `['192.168.0.1', '192.168.0.1']` (duplicate) in addclient, and `['192.168.1.10', '10.0.0.5']` in settingstab. Downstream should normalize on the latter as more realistic.
9. **Stencil/Shadow boundary** — the original brand-skills require Stencil Shadow + tokens for Falcon UI. Source uses plain JSX/CSS (no Shadow DOM). Angular agents will need to reuse `<falcon-*>` lib components and pull these tokens from the `falcon-ui-tokens` canonical theme (the project token rename rules apply).
10. **i18n key set** — Full i18n in `admin/i18n.jsx` is 936 lines (EN+AR). Agents adding new strings must follow the existing camelCase key style: `t.editInfo`, `t.toastNodeAdded`, etc.
11. **Org chart layout dimensions** — `CHART_CARD_W=180`, `CHART_CARD_H=56` and gaps are hard-coded constants. If responsive sizing is needed, these will need to migrate to CSS vars.
12. **Drawer slide direction in RTL** — `.drawer` styles weren't fully inspected; verify whether it slides from right in LTR and left in RTL (the convention) on the live page.
13. **Wizard step animation pane width** — `.ac-card-body { height: 751px; }` is a fixed pixel height (visible inline in hierarchy.jsx line 642). This is likely a temporary tweak; for production should be `min-height: 751px` with responsive overflow.
