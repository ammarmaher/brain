# Agent 2 — React Source-of-Truth Discovery
## Falcon Organization Hierarchy Page — Night Shift 2026-05-14

**Source folder:** `C:\Falcon\Source_of_truth_theme\React\Organization page`
**Real source-of-truth:** `admin/` subfolder (the parent JSX files are for the Auth shell, not the hierarchy page)
**Entry HTML:** `T2 Falcon Admin.html` — loads 23 JSX files (Babel-compiled in-browser, React 18.3.1 UMD, no build pipeline)
**Live URL:** `http://localhost:5500/T2%20Falcon%20Admin.html`

---

## 0. Architecture Overview

The React app is a single-page admin console rendered into `<div id="root">`. There is **no JSX module system** — each file dumps its components onto `window` (or relies on hoisted globals because Babel + script-type evaluation makes everything top-level). All children pull strings from a single `adminDict[lang]` map.

```
T2 Falcon Admin.html
   |
   v
admin/app.jsx (App)            <- root, owns global state
   |
   |-- Sidebar              (sidebar.jsx)
   |-- Topbar               (topbar.jsx) -- UserMenu
   |-- HierarchyPage        (hierarchy.jsx) -- DEFAULT ACTIVE PAGE
   |     |-- ClientsTree
   |     |     |-- NodeRow (recursive) + floating ctx-menu
   |     |-- Tabs (hierarchy | commChannels | appsServices | settings)
   |     |-- View toggle (tree | chart)
   |     |     |-- OrgChartView (zoom/pan/focus + user-circle ring)
   |     |-- node-header (title + action buttons)
   |     |-- InfoPanel (view/edit modes)  -- OR --
   |     |-- table-panel (UsersTable + TablePagination)
   |     |-- AddClientFlow (5-step wizard)  -- OR --
   |     |-- AddUserFlow   (3-step wizard)  -- OR --
   |     |-- UserDetailsPage (3 tabs, view/edit)
   |-- NodeDrawer (add/edit node by name)
   |-- Toasts
   |-- Tweaks panel (edit mode only)
```

---

## 1. Component Tree (ASCII)

```
App
+-- PlaceholderPage             (stub for non-implemented sidebar pages)
+-- Toasts
+-- Sidebar
|     +-- (renderItem) NavItem -> NavSub (expandable group e.g. CommChannels)
+-- Topbar
|     +-- UserMenu (lang/profile/changePassword/mood/logout)
+-- HierarchyPage    <-- HEART OF THE PAGE
|     +-- ClientsTree
|     |     +-- ScrollableTreeList
|     |     |     +-- NodeRow (recursive)
|     |     |           +-- tree-rails (depth-based)
|     |     |           +-- BrandLogo OR initials avatar
|     |     |           +-- client-menu-btn (kebab) -> floats ctx-menu
|     |     +-- ctx-menu (Add Node / Edit Node / Add User)   OR
|     |     +-- ctx-menu (Add Client / Add User) -- when root
|     +-- ContentPanel
|           +-- TabsBar (hierarchy | commChannels | appsServices | settings)
|           +-- ViewToggle (tree | chart) -- only on hierarchy tab
|           +-- BRANCH:
|           |   +-- OrgChartView      (chart mode)
|           |   |     +-- ChartCard (recursive layout)
|           |   |     +-- chart-user-circle ring (when a card is focused)
|           |   |     +-- chart-zoom-controls (zoom in/out/fit/reset)
|           |   |     +-- chart-focus-close button
|           |   +-- node-header + (InfoPanel OR table-panel)   (tree mode)
|           |   |     +-- InfoPanel
|           |   |     |     +-- info-grid (top: 4 fields)
|           |   |     |     +-- info-grid-bottom (Account Official, 13 fields)
|           |   |     |     +-- au-avatar-row (uploader in edit mode)
|           |   |     +-- table-panel
|           |   |           +-- UsersTable
|           |   |           |     +-- StatusBadge
|           |   |           |     +-- row-menu (More Details)
|           |   |           +-- TablePagination
|           |   +-- ApplicationsPage   (appsServices / commChannels tabs)
|           |   +-- SettingsTab        (settings tab)
|           +-- AddClientFlow          (replaces content panel)
|           |     +-- ACStepBar
|           |     +-- ACStep1 (Client Information)
|           |     |     +-- ACProfilePicture
|           |     +-- ACStep2 (Settings)
|           |     |     +-- NumberStepper x3
|           |     +-- ACStep3 (CommChannels) -> ACServiceTable
|           |     +-- ACStep4 (Applications) -> ACServiceTable
|           |     +-- ACStep5 (Account Owner)
|           |     +-- SendCredentialsModal -> SuccessModal
|           +-- AddUserFlow            (replaces content panel)
|           |     +-- StepBar
|           |     +-- Step1 (Personal Info)
|           |     |     +-- PhoneInput  (otp-verify.jsx)
|           |     |     +-- EmailInput  (otp-verify.jsx)
|           |     |     +-- OtpModal    (otp-verify.jsx)
|           |     +-- Step2 (Role & Status)
|           |     +-- Step3 (Permissions & Privilege)
|           |     +-- CredentialsModal -> UserSuccessModal
|           +-- UserDetailsPage        (replaces content panel)
|                 +-- UDTabPersonal | UDTabRole | UDTabPermissions   (view)
|                 +-- UDEditPersonal | UDEditRole | UDEditPermissions (edit)
|                 +-- UDVerifyBadge
|                 +-- OtpModal (re-verify phone/email on edit)
+-- NodeDrawer (overlay)           -- generic Add Node / Edit Node
+-- TweaksPanel                    -- edit-mode only
```

---

## 2. Component Index (file → exported)

| File | Components / Exports |
|---|---|
| `app.jsx` | `App` (root), `PlaceholderPage`, `Toasts`, `TWEAK_DEFAULTS` |
| `sidebar.jsx` | `Sidebar` |
| `topbar.jsx` | `Topbar`, `UserMenu` |
| `drawers.jsx` | `Drawer`, `NodeDrawer` |
| `hierarchy.jsx` | `NodeRow`, `ClientsTree`, `ScrollableTreeList`, `StatusBadge`, `Checkbox`, `SortArrow`, `TablePagination`, `UsersTable`, `UserCard`, `KanbanView`, `ChartCard`, `OrgChartView`, `InfoPanel`, `HierarchyPage`, `NODE_INFO` const |
| `apps.jsx` | `ApplicationsPage` + many inline helpers; `APPS_BY_TAB` data |
| `otp-verify.jsx` | `PhoneInput`, `EmailInput`, `OtpModal`, `COUNTRIES`, ~25 Flag components |
| `adduser.jsx` | `AddUserFlow`, `Step1/2/3`, `StepBar`, `CredentialsModal`, `UserSuccessModal` |
| `userdetails.jsx` | `UserDetailsPage`, `UDTabPersonal/Role/Permissions`, `UDEditPersonal/Role/Permissions`, `UDVerifyBadge`, `UDField` |
| `addclient.jsx` | `AddClientFlow`, `ACStep1..ACStep5`, `ACStepBar`, `ACProfilePicture`, `NumberStepper`, `ACServiceTable`, `SendCredentialsModal`, `SuccessModal` |
| `settingstab.jsx` | `SettingsTab`, `ST_NumberStepper` |
| `wallet.jsx` | `WalletPage` (outside hierarchy scope but reachable from sidebar) |
| `comm-mkt.jsx` | `CommChannelsPage`, `MarketplacePage` (outside hierarchy scope) |
| `templates*.jsx` | Templates page family (outside hierarchy scope) |
| `data.jsx` | `seedTree`, `seedUsers`, `BrandLogo`, helpers `flattenTree`, `clone`, `findNode`, `pathTo` |
| `icons.jsx` | 30+ `Ic*` icons, `T2Mark`, `IcFalcon`, `IcRiyal` |
| `i18n.jsx` | `adminDict` (en + ar, ~470 keys per lang) |

---

## 3. Props Table (key components)

### Sidebar
| Prop | Type | Purpose |
|---|---|---|
| `collapsed` | bool | sidebar narrow-state |
| `setCollapsed` | fn | toggle |
| `activePage` | string | matches sidebar nav id (`orgHierarchy`, `walletBalance`, …) |
| `setActivePage` | fn | nav change |
| `lang` | 'en' \| 'ar' | for RTL handling in CSS |
| `t` | object | i18n dict |

### Topbar
| Prop | Type | Purpose |
|---|---|---|
| `pageTitle` | string | header title |
| `breadcrumb` | string[] | crumbs after Home |
| `lang`, `setLang`, `mood`, `setMood`, `t` | — | passed to UserMenu |

### HierarchyPage
| Prop | Type | Purpose |
|---|---|---|
| `tree` | TreeNode | root tree (Falcon) |
| `setTree` | fn | mutate the tree (Add Node propagates here) |
| `selected` | string | id of selected node |
| `selectNode` | fn(id) | select + auto-expand ancestors |
| `expanded` | `Record<string,boolean>` | per-id expansion state |
| `toggleExpand` | fn(id) | flip one row |
| `lang`, `t`, `pushToast` | — | downstream |
| `drawer`, `setDrawer` | — | shared with App (Add/Edit Node) |
| `ctxOpenFor`, `setCtxOpenFor` | — | shared with App for kebab menu |

### NodeRow (within ClientsTree, recursive)
| Prop | Type | Purpose |
|---|---|---|
| `node` | TreeNode | row data |
| `depth` | number | indent level (used for tree-rails count) |
| `ancestorsHasNext` | boolean[] | per-depth: does ancestor at that level still have siblings below? — drives the rail glyph (`elbow`, `rail-empty`, `rail-last`) |
| `isLastChild` | bool | for elbow vs full vertical |
| `parentPath` | string[] | id chain to root |
| `expanded`, `onToggle` | — | expand chevron |
| `selected`, `onSelect`, `onCtxMenu`, `ctxOpen` | — | row interactions |
| `hoveredPath`, `setHoveredPath` | Set<string> \| null | hover trail highlight along ancestors |
| `t` | dict | |

### NodeDrawer
| Prop | Type | Purpose |
|---|---|---|
| `mode` | 'add' \| 'edit' | drives title + submit label |
| `initialName` | string | preset for edit |
| `onSubmit` | fn(name) | parent inserts/updates |
| `onClose` | fn | overlay click / Esc / X / Cancel |
| `t` | dict | |

### OrgChartView
| Prop | Type | Purpose |
|---|---|---|
| `tree`, `selected`, `onSelect` | — | rendered + selectable |
| `t` | dict | legend text |

### UsersTable
| Prop | Type | Purpose |
|---|---|---|
| `users` | UserRow[] | sliced page of users |
| `selected` | `Set<string>` | row selection (per id) |
| `setSelected` | fn(set) | bulk toggle |
| `sort`, `setSort` | `{col, dir}` | sort state (declared but not implemented) |
| `rowMenuFor`, `setRowMenuFor` | id \| null | per-row open kebab |
| `onMoreDetails` | fn(user) | open UserDetailsPage |
| `t` | dict | column labels |

### TablePagination
| Prop | Type | Purpose |
|---|---|---|
| `total` | number | row count |
| `page`, `pageSize` | numbers | current state |
| `onPageChange`, `onPageSizeChange` | fns | mutate |
| `t` | dict | localized labels |
| `pageSizeOptions` | number[] | default `[10,20,30,40]` |

### AddUserFlow
| Prop | Type | Purpose |
|---|---|---|
| `onClose` | fn | exits flow and restores user list |
| `t` | dict | |
| `pushToast` | fn | success toast after creds sent |
| `node` | TreeNode | current node — drives brand logo + brand name in topbar |

### AddClientFlow — same `{onClose, t, pushToast, parentNode}`.

### PhoneInput / EmailInput / OtpModal
- See section 13 below.

---

## 4. State Table (root + key components)

### `App` (admin/app.jsx)
| State | Initial | Notes |
|---|---|---|
| `lang` | localStorage `admin_lang` \|\| `'en'` | persisted |
| `mood` | `'light'` | local only |
| `collapsed` | tweak default `false` | sidebar |
| `activePage` | `'orgHierarchy'` | default landing |
| `tree` | `clone(seedTree)` | mutable tree |
| `selected` | tweak default `'aramco'` | selected node id |
| `expanded` | `{ aramco: true, cc: true }` | seeded so Aramco + its Contact Center sub-tree are open |
| `drawer` | `null` | `{mode:'add'|'edit', targetId, initialName?}` |
| `ctxOpenFor` | `null` | id with open kebab |
| `toasts` | `[]` | each `{id, msg}`; auto-dismiss after 3500 ms |
| `editMode` | `false` | tweaks panel visibility (postMessage protocol) |

### `HierarchyPage`
| State | Initial | Notes |
|---|---|---|
| `selectedUsers` | `new Set(['u3'])` | Hajeer is pre-selected per design reference |
| `sort` | `{col: null, dir: null}` | declared, not wired |
| `rowMenuFor` | `null` | open kebab on a row |
| `activeTab` | `'hierarchy'` | 4 tabs: hierarchy/commChannels/appsServices/settings (root has only hierarchy+settings) |
| `userPage` | `1` | pagination |
| `userPageSize` | `20` | pagination |
| `hierarchyView` | `'tree'` | toggle: `'tree'` or `'chart'` |
| `infoOpen` | `false` | Information panel on/off |
| `addUserOpen` | `false` | Add User flow replaces content |
| `addClientOpen` | `false` | Add Client flow replaces content |
| `detailUser` | `null` | UserDetailsPage replaces content when set |
| `infoEditing` | `false` | InfoPanel edit toggle |
| `infoDraft` | `null` | dirty data while editing |

Important behavior: `useEffect([selected])` resets `infoOpen=false`, `detailUser=null`, `infoEditing=false`, `infoDraft=null` whenever the selected node changes.

### `ClientsTree`
| State | Initial | Notes |
|---|---|---|
| `hoveredPath` | `null` | `Set<string>` of ancestor ids; used to paint the rail with a teal stripe |
| `menuAnchor` | `null` | DOM element of currently-open kebab |
| `menuPos` | `null` | floating-menu coords; recomputed on scroll/resize while open |

### `OrgChartView`
| State | Initial | Notes |
|---|---|---|
| `zoom` | `1` | clamped `[0.3, 2]` |
| `pan` | `{x:0,y:0}` | translation in CSS px |
| `focusedId` | `null` | id of focused card (the one whose user circles are visible) |
| `animating` | `false` | adds `.animating` class for ~520 ms |
| `dragRef` | `{active, startX, startY, origX, origY, moved}` | mouse-drag pan |
| `viewportRef`, `prevViewRef` | refs | DOM + zoom/pan restoration after focus exit |

### `AddUserFlow`
| State | Initial | Notes |
|---|---|---|
| `step` | `0` | 0..2 |
| `maxStep` | `0` | furthest reached, for jump-back |
| `showCreds` | `false` | Sending Credentials modal |
| `showSuccess` | `false` | Done modal |
| `otpChannel` | `null` | `'phone'` \| `'email'` |
| `form` | seed object (12 keys) | see seed below |

`form` seed:
```js
{ photo:'', firstName:'', lastName:'', userName:'', password:'#123455',
  nationalId:'',
  phoneCountry:'SA', phone:'', phoneVerified:false,
  email:'', emailVerified:false,
  status:'active', role:'system_admin',
  permGroup:'admin',
  checker_whatsapp:'level2', checker_voice:'level1' }
```

### `AddClientFlow`
| State | Initial | Notes |
|---|---|---|
| `step` | `0` | 0..4 |
| `direction` | `1` | for in-right/in-left CSS anim |
| `errors` | `{}` | only step-1 validation (account name required) |
| `sendingOpen` | `false` | SendCredentialsModal |
| `successOpen` | `false` | SuccessModal |
| `delivery` | `'email'` | email/sms/both |
| `form` | seed (32 keys, see addclient.jsx:564) | preset `ownerPwd:'#123455'`, preset 2 allowedIps, seed channels[3] + apps[3] |

### `UserDetailsPage`
| State | Initial | Notes |
|---|---|---|
| `form` | `seedToForm(user)` | working draft |
| `origForm` | `seedToForm(user)` | revert target for Cancel |
| `activeTab` | `'personal'` | 3 tabs |
| `editing` | `false` | view/edit |

### `OtpModal`
| State | Initial | Notes |
|---|---|---|
| `code` | `Array(6).fill('')` | 6 digit boxes split visually 3+3 |
| `seconds` | `60` | resend timer |
| `status` | `'input'` | `'input'\|'invalid'\|'expired'\|'success'` |

---

## 5. Event Handlers (high-leverage)

### `App.selectNode(id)`
- `setSelected(id)`
- If activePage isn't `orgHierarchy`, switch it.
- Compute `pathTo(tree, id)` and force-expand every ancestor id in the path so the row is visible.

### `App.handleDrawerSubmit(name)`
- Clones the tree.
- `add`: creates `{id:'n'+Date.now(), type: target.type==='root'?'client':'node', name, users:seedUsers, children:[]}`. If parent is root, also sets `brand:'generic'`. Appends to `target.children`, expands the parent, toasts `t.toastNodeAdded`.
- `edit`: mutates `target.name`. Toasts `t.toastNodeEdited`.
- Closes the drawer in both cases.

### `App.pushToast(msg)`
- `id = Date.now() + Math.random()`
- Pushes `{id,msg}`, then `setTimeout(3500ms)` to filter it out.
- `dismissToast(id)` is also available (X button on each toast).

### `ClientsTree.handleCtxMenu(id, anchorEl)`
- Toggles which row owns the floating kebab menu.
- The menu items depend on node type:
  - root: `[addClient, addUser]`
  - else: `[addNode, editNode, addUser]`
- `onCtxAction(action, openNode)` callback:
  - `addClient` -> `setAddClientOpen(true)`
  - `addNode` -> `setDrawer({mode:'add', targetId:node.id})`
  - `editNode` -> `setDrawer({mode:'edit', targetId:node.id, initialName:node.name})`
  - `addUser` -> `setAddUserOpen(true)`

### `NodeRow` hover trail
- `onMouseEnter` -> `setHoveredPath(new Set(ownPath))`. Each ancestor row gets `.on-path` class; the rail-stripe linear-gradient lights up teal.
- `onMouseLeave` -> `setHoveredPath(null)`.

### `NodeRow` auto-scroll
- `useEffect` watches `isSelected`. If selected and **the user didn't just click this row** (`justClickedRef.current` guard), schedule a `requestAnimationFrame` then `scrollIntoView({block:'nearest', behavior:'smooth'})`. This makes deep-link / chart-jump / search-jump always reveal the row without yanking when the user clicked it themselves.

### `ScrollableTreeList`
- Adds `is-scrolled` class while `scrollLeft > 0` so the long node names un-truncate (visual cue + reveal of full text when horizontally scrolled).

### `OrgChartView` interactions
- Wheel → zoom-at-cursor (passive:false to preventDefault). In focus mode any `deltaY > 10` exits focus.
- Mouse drag on background (not on a card) → pan. Drag is suppressed by an idempotent `dragRef.moved` check (>4 px to suppress the trailing click).
- Clicking a non-root card → enter focus mode: zoom to 1.6, place card at ~26% of viewport height, dim siblings, draw a connector + animated user circles + labels.
- Clicking the focused card again, or the close button, or empty area → `exitFocus`: restores `prevViewRef` (zoom + pan).
- Zoom buttons: `+0.15` / `-0.15`; `fitToView`: scales so the entire tree fits viewport; `resetView`: zoom=1, pan=0.

### `UsersTable` row menu
- `setRowMenuFor(menuOpen ? null : u.id)` — only one row's menu open at a time.
- "More Details" item → `onMoreDetails(u)` → `setDetailUser(u)` in HierarchyPage, which replaces the table-panel with `<UserDetailsPage>`.

### `InfoPanel` edit toggle (HierarchyPage)
- "Edit Info" button:
  - Reads `NODE_INFO[selectedNode.id]` or `[selectedNode.clientId]` or builds a generic seed.
  - `setInfoDraft({...base})` then `setInfoEditing(true)`.
- "Cancel": `setInfoEditing(false); setInfoDraft(null)`.
- "Save": `setInfoEditing(false); setInfoDraft(null); pushToast('Information updated ✓')`. **No persistence to backend or to the tree itself** — the edit is forgotten.

### `OtpModal.handleChange(i,v)`
- Strips non-digits, keeps last char only, auto-advances focus.
- When all 6 boxes filled, after a 200 ms beat:
  - If the joined string === **`'150999'`** → `setStatus('invalid')`.
  - Else → `setStatus('success')` and after 1300 ms call `onSuccess()`.

(See section 10 for the full OTP behavior — note: this is NOT "all zeros pass". The actual rule is: ANY 6-digit code except literally `150999` succeeds.)

### `OtpModal.handlePaste`
- Same accept/reject logic but instant on paste.

### `OtpModal.resend`
- `seconds=60, code=fill('')`, status='input', refocus box 0. Resend button is disabled while `seconds>0 && status!=='expired'`.

---

## 6. Data Models / Mock Seeds

### `seedUsers` (admin/data.jsx)
```js
[
  { id:'u1', username:'thamer',   firstName:'Thamer',   email:'thamer@t2.sa',   phone:'+966572838628', role:'System Admin', permGroup:'Support', status:'active' },
  { id:'u2', username:'anas',     firstName:'Anas',     email:'anas@t2.sa',     phone:'+966572838628', role:'Operation',    permGroup:'Ops',     status:'suspended' },
  { id:'u3', username:'Hajeer',   firstName:'Hajeer',   email:'hajeer@t2.sa',   phone:'+966572838628', role:'Products',     permGroup:'Support', status:'active' },
  { id:'u4', username:'Najla',    firstName:'Najla',    email:'najla@t2.sa',    phone:'+966572838628', role:'System Admin', permGroup:'Support', status:'deleted' },
  { id:'u5', username:'Faisal',   firstName:'Faisal',   email:'faisal@t2.sa',   phone:'+966572838628', role:'System Admin', permGroup:'Support', status:'locked' },
  { id:'u6', username:'Abdallah', firstName:'Abdallah', email:'abdallah@t2.sa', phone:'+966572838628', role:'System Admin', permGroup:'Support', status:'pending' },
]
```
**Same 6-user array is referenced by every node** (`users: seedUsers` on every tree node). This means selecting any node shows the same 6 users — the demo never differentiates.

### `seedTree`
```
Falcon (root, type:'root')
├── Al-Rajhi Bank             (client, brand:'alrajhi')        — no children
├── Saudi National Bank       (client, brand:'snb')
│   ├── Corporate & Institutional Banking Division
│   │   ├── Relationship Management — Large Enterprises
│   │   └── Trade Finance & Documentary Credits
│   ├── Retail Banking & Wealth Management Group
│   └── Operations, Risk & Regulatory Compliance Department
├── Bupa Arabia for Cooperative Insurance Company  (client, brand:'bupa')
├── Aramco                    (client, brand:'aramco')
│   ├── Human Resources
│   ├── Digital Banking
│   ├── Contact Center
│   │   ├── Inbound Call
│   │   ├── Outbound Call
│   │   └── Customer Care
│   ├── Marketing
│   └── IT & Cybersecurity
└── BMW Group                 (client, brand:'bmw')
    ├── Production & Manufacturing
    │   ├── European Plants Network
    │   │   ├── Plant Munich
    │   │   │   ├── Body Shop Operations
    │   │   │   │   ├── Welding Hall A
    │   │   │   │   │   ├── Robotic Cells Cluster 4
    │   │   │   │   │   │   ├── Line 7 — Floor Pan Assembly
    │   │   │   │   │   │   │   └── Station 7B — Spot Weld
    │   │   │   │   │   │   │       └── Bay 03 — Quality Inspection
    │   │   │   │   │   │   │           └── Workstation 03-α (Final QA)   <-- 10 deep
    │   │   │   │   │   └── Robotic Cells Cluster 5
    │   │   │   │   └── Welding Hall B
    │   │   │   ├── Paint Shop Operations
    │   │   │   └── Final Assembly Lines
    │   │   ├── Plant Dingolfing
    │   │   └── Plant Regensburg
    │   ├── Americas Plants Network
    │   └── Asia-Pacific Plants Network
    ├── Research & Development
    ├── Sales & Aftersales
    └── Finance & Treasury
```
**BMW exists specifically as a 10-level-deep hierarchy demo** — the Angular implementation must support arbitrary depth.

### Node shape
```ts
type TreeNode = {
  id: string;              // 'falcon', 'aramco', 'hr', 'bmw-l10', ...
  type: 'root' | 'client' | 'node';
  name: string;
  brand?: 'alrajhi'|'snb'|'bupa'|'aramco'|'bmw'|'generic';   // only on clients
  users: User[];           // always seedUsers
  children: TreeNode[];
};
```

### `NODE_INFO` (hierarchy.jsx)
Hardcoded full info objects only for `aramco`, `snb`, `bupa`, `falcon`. Anything else falls back to a generic shape derived from `node.name + node.id`.

### `APPS_BY_TAB` (apps.jsx)
Two arrays (`appsServices` and `commChannels`) of ~9 rows each — name + price + activation/renew dates + status (active/expired/disable/inactive) + visibility flag.

### AddClient seed channels & apps
Each is a 3-row table; `visible/priceType/priceValue/status` fields used by `ACServiceTable`. See addclient.jsx:573.

### Status taxonomy used by `StatusBadge`
| key | label key | cls |
|---|---|---|
| active | t.statusActive | active |
| suspended | t.statusSuspended | suspended |
| deleted | t.statusDeleted | deleted |
| locked | t.statusLocked | locked |
| pending | t.statusPending | pending |
| expired | t.statusExpired ('Expired') | expired |
| disable | t.statusDisable ('Disabled') | disabled |
| inactive | t.statusInactive ('Inactive') | inactive |

---

## 7. Strings Catalog

Strings live in `admin/i18n.jsx` as `adminDict.en` and `adminDict.ar` — each ~470 keys. Below is the **hierarchy-relevant subset** (full file already covered the others — Templates, Wallet, Marketplace, etc.).

| Key | English | Arabic | Used in |
|---|---|---|---|
| mainItems | Main Items | العناصر الرئيسية | Sidebar group label |
| accountAdmin | Account Administration | إدارة الحساب | Sidebar group label |
| dashboard | Dashboard | لوحة التحكم | Sidebar nav |
| contactGroups | Contact Groups | مجموعات جهات الاتصال | Sidebar |
| templates | Templates | القوالب | Sidebar |
| orgHierarchy | Organization Hierarchy | الهيكل التنظيمي | Sidebar (primary) |
| permissions | Permissions | الصلاحيات | Sidebar |
| walletBalance | Wallet & Balance .Mng | إدارة المحفظة والرصيد | Sidebar |
| commChannels | CommChannels & Services .Mng | إدارة قنوات الاتصال والخدمات | Sidebar |
| marketplace | Marketplace & Applications .Mng | إدارة المتجر والتطبيقات | Sidebar |
| contractsCost | Contracts & Cost .Mng | إدارة العقود والتكاليف | Sidebar |
| systemSettings | System Settings | إعدادات النظام | Sidebar footer |
| auditLog | Audit Log | سجل العمليات | Sidebar footer |
| home | Home | الرئيسية | Topbar breadcrumb |
| searchPlaceholder | Search… | بحث… | Topbar |
| userName | User Name | اسم المستخدم | Topbar user chip |
| jobTitle | Job Title | المسمى الوظيفي | Topbar user chip |
| language | Language | اللغة | UserMenu |
| english | English | English | UserMenu |
| arabic | العربية | العربية | UserMenu |
| profile | Profile | الملف الشخصي | UserMenu |
| changePassword | Change Password | تغيير كلمة المرور | UserMenu |
| mood | Mood | المظهر | UserMenu |
| logout | Logout | تسجيل الخروج | UserMenu |
| falcon | Falcon | فالكون | Tree root |
| falconClients | Falcon Clients | عملاء فالكون | Tree section label |
| tabHierarchy | Hierarchy | الهيكل | Tabs |
| tabCommChannels | CommChannels & Services | قنوات الاتصال والخدمات | Tabs |
| tabAppsServices | Apps & Services | التطبيقات والخدمات | Tabs |
| tabSettings | Settings | الإعدادات | Tabs |
| information | Information | المعلومات | node-actions link |
| backToUsers | Back to users | العودة إلى المستخدمين | InfoPanel header btn |
| editInfo | Edit Info | تعديل المعلومات | InfoPanel header btn |
| infoAccountName | Account Name | اسم الحساب | InfoPanel |
| infoFinanceId | Finance ID | معرّف المالية | InfoPanel |
| infoClassification | Classification Category | فئة التصنيف | InfoPanel |
| infoSubClassification | Classification Sub Category | الفئة الفرعية للتصنيف | InfoPanel |
| infoAccountOfficial | Account Official | مسؤول الحساب | InfoPanel section title |
| infoEntityName | Entity Name | اسم الكيان | InfoPanel |
| infoAuthorityType | Authority Letter Type | نوع خطاب التفويض | InfoPanel |
| infoSector | Sector | القطاع | InfoPanel |
| infoBudget | Budget No. | رقم الميزانية | InfoPanel |
| infoCountry | Country | الدولة | InfoPanel |
| infoCity | City | المدينة | InfoPanel |
| infoDistrict | District | المنطقة | InfoPanel |
| infoStreet | Street | الشارع | InfoPanel |
| infoBuilding | Building Number | رقم المبنى | InfoPanel |
| infoPostal | Postal Code | الرمز البريدي | InfoPanel |
| infoAddlAddr | Additional Address | عنوان إضافي | InfoPanel |
| infoAnotherId | Another ID | معرّف آخر | InfoPanel |
| infoVAT | VAT Registration Number | رقم التسجيل الضريبي | InfoPanel |
| addNode | Add Node | إضافة عقدة | ctx-menu + node-actions |
| editNode | Edit Node | تعديل العقدة | ctx-menu + Drawer title |
| addUser | Add User | إضافة مستخدم | ctx-menu + node-actions |
| addClient | Add Client | إضافة عميل | ctx-menu (root) + node-actions |
| users | Users | المستخدمون | table title |
| filter | Filter | تصفية | table head |
| searchHere | Search here | ابحث هنا | table head |
| viewTree | List | قائمة | view-toggle label |
| viewChart | Tree | شجرة | view-toggle label |
| chartHint | Click any node to view its details | انقر على أي عقدة لعرض تفاصيلها | OrgChart hint |
| chartLegendRoot | Platform | المنصة | OrgChart legend |
| chartLegendClient | Client | عميل | OrgChart legend |
| chartLegendNode | Sub-node | عقدة فرعية | OrgChart legend |
| chartChild / chartChildren | sub-node / sub-nodes | عقدة فرعية / عقد فرعية | ChartCard meta |
| colUsername…colActions | Username/First Name/Email/Phone Number/Role/Permission Group/Status/Actions | اسم المستخدم/الاسم الأول/البريد الإلكتروني/رقم الهاتف/الدور/مجموعة الصلاحيات/الحالة/الإجراءات | UsersTable headers |
| statusActive | Active | نشط | StatusBadge |
| statusInactive | Inactive | غير نشط | StatusBadge |
| statusExpired | Expired | منتهي | StatusBadge |
| statusDisable | Disable | معطّل | StatusBadge |
| statusSuspended | Suspended | موقوف | StatusBadge |
| statusDeleted | Deleted | محذوف | StatusBadge |
| statusLocked | Locked | مقفل | StatusBadge |
| statusPending | Pending | معلق | StatusBadge |
| moreDetails | More Details | مزيد من التفاصيل | row-menu |
| nodeName | Node Name | اسم العقدة | NodeDrawer field |
| cancel | Cancel | إلغاء | NodeDrawer + everywhere |
| add | Add | إضافة | NodeDrawer submit |
| save | Save | حفظ | Drawer / Info save |
| toastNodeAdded | The Node has been added successfully | تمت إضافة العقدة بنجاح | Add Node toast |
| toastNodeEdited | The Node has been updated successfully | تم تحديث العقدة بنجاح | Edit Node toast |
| of | of | من | Pagination |
| pagShowing | Showing | عرض | Pagination |
| pagFrom | from | من | Pagination |
| pagRowsPerPage | Rows per page | عدد الصفوف | Pagination |
| placeholderBody | This area is stubbed for demo… | هذه الصفحة مخصصة للعرض… | PlaceholderPage |

### Hardcoded English strings (NOT in i18n) — need to be added to dict for full localization:
- `'Add User'` (button label inside HierarchyPage node-actions — uses literal string instead of `t.addUser`)
- `'Information updated ✓'` (toast text on InfoPanel save)
- `'Cancel'` (InfoPanel cancel button)
- `'Save'` (InfoPanel save button)
- `'Edit User'`, `'User Profile'`, `'Personal Information'`, `'Role & Status'`, `'Permissions & Privilege'`, `'Back to User list'`, `'Edit'` (UserDetailsPage)
- `'User updated ✓'` (UserDetailsPage save toast)
- `'Verified'`, `'Verification required before saving'`, `'OTP Verification'`, `'Invalid OTP'`, `'Successfully'`, `'OTP verified successfully'`, `'Code expired — please resend'`, `'Resend'`, `'The verification code has been sent to your Phone number/Email address'` (otp-verify.jsx)
- `'Add New User'`, `'step 1/3'`, `'Personal Information'`, `'First Name'`, `'Last Name'`, `'User Name'`, `'National ID / Iqama'`, `'Phone Number'`, `'Email Address'`, `'Role & Status'`, `'User Status'`, `'User Role'`, `'Active'`, `'Inactive'`, `'Suspended'`, `'Pending'`, `'System Admin'`, `'Operation'`, `'Products'`, `'Support'`, `'Viewer'`, `'Permissions & Privilege'`, `'Assigned Permission Group'`, `'Admin Group'`, `'Read Only Group'`, `'Operations Group'`, `'Support Group'`, `'CommChannel Checker Level'`, `'WhatsApp'`, `'Voice'`, `'None'`, `'Checker Level One'`, `'Checker Level Two'`, `'Sending Credentials'`, `'Send Credentials'`, `'Send via Email'`, `'Send via SMS'`, `'Both, SMS and Email'`, `'Completed successfully'`, `'Credentials sent to the user'` (adduser.jsx + cred modals)
- `'Create New Client'`, `'Client Picture'`, `'Owner Picture'`, `'PNG, JPG up to 2MB'`, `'Drag a photo here or'`, `'Upload Photo'`, `'Account Name'`, `'Finance ID'`, `'Account Official'`, `'Entity Name'`, `'Authority Letter Type'`, `'Sector'`, `'Budget No.'`, `'Country'`, `'City'`, `'District'`, `'Street'`, `'Building Number'`, `'Postal Code'`, `'Additional Address'`, `'Another ID'`, `'VAT Registration Number'`, `'Password Security Level'`, `'Normal'`, `'Advanced'`, `'Username, Password, OTP'`, `'Comply with NCA regulations, press here for more details.'`, `'Allowed IPs'`, `'IP Address'`, `'Enter IP Address (IPv4 or IPv6) and press Enter'`, `'* Restrict platform access and limit it from these IPs only'`, `'Account Limitations'`, `'Max normal user limit'`, `'Max System User Limit'`, `'Max Node Level'`, `'Current existing'`, `'Max allowed'`, `'Visibility'`, `'Name'`, `'Price Type'`, `'Price Value'`, `'Status'`, `'Inactive'`, `'Account Owner'`, `'Role'`, `'Password'`, `'Client Information'`, `'Settings'`, `'CommChannels'`, `'Applications'` (addclient.jsx)
- `'Coming in v2 — this tab is stubbed for the v1 scope (Hierarchy only).'` (HierarchyPage stub tab body)

This is the biggest i18n gap. Angular implementation should plumb every visible string through the `t` dict.

---

## 8. Tab / Wizard Logic

### Tabs (HierarchyPage)
- Tab set depends on `isRoot` (i.e. `selectedNode.id === tree.id`):
  - **Root selected** → `[hierarchy, settings]` only.
  - **Any other node** → `[hierarchy, commChannels, appsServices, settings]`.
- `setActiveTab(id)` switches. No validation, no animation between tabs.
- The hierarchy tab additionally renders a view-toggle (tree/chart).
- `commChannels` and `appsServices` both render `<ApplicationsPage tabKey={activeTab}>` — same component, different seed array.
- `settings` renders `<SettingsTab>` (view/edit clone of AddClient Step 2).

### Wizard: AddUserFlow (3 steps)
- Steps: `[personal, role, permissions]`
- `handleNext()`:
  - If not last: `setStep(step+1); setMaxStep(max(maxStep, step+1));`
  - If last: `setShowCreds(true)` — opens Sending Credentials modal (does not yet "save" anywhere).
- `jumpToStep(i)`: only allowed if `i <= maxStep` (clickable previous-step labels).
- **No per-step validation.** No required-field gating before advancing. The footer "Next" button is unconditional. (Step 1 has visual `*` markers but no real check.)
- After "Send Credentials" → `showSuccess` modal → `onClose()` of the modal calls `pushToast('User created & credentials sent ✓')` then `onClose()` of the flow.

### Wizard: AddClientFlow (5 steps)
- Steps: `[info, settings, channels, apps, owner]`
- `handleNext()`:
  - If `step===0`, run `validateStep1()` → only required field is `accountName` (sets `errors.accountName=true` on empty, shows `*Please fill this field`).
  - If last: `setSendingOpen(true)`.
  - Else: `setDirection(1); setStep(step+1)`.
- `handlePrev()`: `setDirection(-1); setStep(step-1)`.
- The `direction` state drives a slide-in CSS animation (`in-right` or `in-left`).
- Stepper jump: `onJump(i)` allowed only `if (i <= current)` (looser than AddUser).
- Final "Save" → SendCredentialsModal → SuccessModal → toast `t.toastNodeAdded` then `onClose()`.

### Wizard: UserDetailsPage (3 tabs, not stepwise)
- `[personal, role, permissions]` — clickable, no max-step restriction.
- "Edit": snapshot to `origForm`, flip `editing=true`. "Cancel": restore `form=origForm`. "Save": `setOrigForm(form)`, toast `'User updated ✓'`.

---

## 9. Tree Behavior

### Selection
- `selectNode(id)` (in App):
  1. `setSelected(id)`.
  2. If `activePage !== 'orgHierarchy'`, switch to it.
  3. Force-expand every ancestor in `pathTo(tree, id)` so the row is rendered.
- Click on a row → `handleClick` sets `justClickedRef.current=true` then calls `onSelect(node.id)`. The flag prevents the auto-scroll effect from yanking the row.
- Selection is **single-node** (no multi-select for tree itself).

### Expansion
- `expanded` is an object keyed by node id with boolean values.
- `toggleExpand(id)` flips one key.
- Initial seed: `{aramco: true, cc: true}` — Aramco and its Contact Center sub-tree are open by default.
- Chevron click `stopPropagation()` so it doesn't select.
- Chevron rotates via `.open` class.

### Hover trail
- Hovering any row sets `hoveredPath = new Set(ownPath)`. Each ancestor row gets `.on-path` class, which paints the rail with a center teal stripe via linear-gradient.

### Kebab menu (per-row)
- `client-menu-btn` toggles `ctxOpenFor` in HierarchyPage state.
- Menu is rendered with `position: fixed` and a `useEffect` repositions it on scroll/resize relative to the button bounding rect. RTL flips left/right anchor. Items:
  - root: Add Client / Add User
  - non-root: Add Node / Edit Node / Add User
- Closes on outside `mousedown`, on Escape, on any menu-item click.

### Three-dot actions per item: same as kebab — there is only one kebab per row; the action depends on node type.

### Long names
- `client-name` has `text-overflow: ellipsis`. When `ScrollableTreeList.is-scrolled` is on (i.e. user scrolled horizontally), the ellipsis turns off and full names show.

### Root vs children
- Root is rendered **outside** the recursive list with its own `.clients-root` block at top, then a `Falcon Clients` section label, then the `<ScrollableTreeList>` of children.

---

## 10. Users Table Behavior

### Reload on node change
- The users array comes from `selectedNode.users` (each node has `users: seedUsers` so the same 6 always appear).
- Pagination state (`userPage`, `userPageSize`) lives in HierarchyPage so it persists across node switches — switching node does NOT reset pagination. (Pre-selection `selectedUsers = {u3}` is also persistent.)

### Statuses
- Mapping defined in `StatusBadge` (active/suspended/deleted/locked/pending/expired/disable/inactive).
- Each status gets a colored dot + label.

### Row actions
- Single kebab on each row → opens `row-menu` with one item: **More Details**.
- "More Details" → `setDetailUser(user)` in HierarchyPage which replaces the table-panel with `<UserDetailsPage user={user} node={selectedNode} onBack={...}>`.

### Top actions in node-header (state-dependent)
- **When InfoPanel is closed AND not in a sub-flow:**
  - Root selected: `[Information(hidden if root)] + [Add Client] + [Add User]`
  - Non-root: `[Information link] + [Add Node] + [Add User]`
- **When InfoPanel is open:** `[Back to users (secondary)] + [Edit Info (primary)]`
- **When InfoPanel is open AND editing:** `[Cancel (secondary)] + [Save (primary)]`

### Top-of-table controls (table-head-bar)
- Only shown when `isRoot`:
  - `<button class="filter-btn">` (Filter)
  - `<div class="search-input">` (Search here)
- These are NOT wired — they're decorative. No filter/search state.

### Sort
- `cols` array has stable ids but the table renders rows in seed order (no sort logic). `SortArrow` component exists but is never used.

### Pagination
- `TablePagination` with first/prev/page/next/last + rows-per-page select [10,20,30,40]. Shows `Showing N - M from total`.

### Kanban (KanbanView) — defined but not rendered in the hierarchy page. Available as an alternate user view, plotting users by `status` column.

---

## 11. OTP Behavior — the truth

**Brief said "all zeros pass, anything else fails".** **That is NOT what the code does.** The code at `otp-verify.jsx:432–443`:

```js
if (next.every((c) => c !== '')) {
  const joined = next.join('');
  setTimeout(() => {
    if (joined === '150999') {
      setStatus('invalid');
    } else {
      setStatus('success');
      setTimeout(() => onSuccess(), 1300);
    }
  }, 200);
}
```

**Actual rule: ANY 6-digit code EXCEPT the literal `'150999'` succeeds.** `'150999'` is the only code that triggers `'invalid'`. Same logic in the paste handler (line 466).

For Angular: preserve this exact rule. (Likely a placeholder for "any error code to demo the invalid state"; the Angular implementation can plumb this through a service call when real backend is wired.)

Additional OTP behavior:
- 6 boxes total, split visually as 3 + `<sep>` + 3.
- Auto-focus next on input, auto-focus previous on backspace empty.
- Arrow keys navigate.
- Paste: strips non-digits, distributes across boxes, evaluates immediately.
- Numeric-only via `replace(/[^0-9]/g,'')`.
- 60-second resend timer with circular SVG progress.
- States: `input → invalid (on '150999') | success | expired (timer hits 0)`.
- Resend resets timer + clears boxes.
- Success state shows a check icon for ~1300 ms before invoking `onSuccess()`.

---

## 12. View-mode toggle (list vs tree-chart)

- State: `hierarchyView: 'tree' | 'chart'` — local to HierarchyPage.
- Shown only when `activeTab === 'hierarchy'`.
- Two buttons inside `.view-toggle.tabs-bar-toggle` (right side of tabs bar).
- `'tree'`: renders the node-header + InfoPanel-or-table-panel (default view).
- `'chart'`: renders the **content-panel-wide** `<OrgChartView>` (`.page.chart-mode` parent class shifts the layout grid).
- Clicking a chart card calls `(id) => {selectNode(id); setHierarchyView('tree');}` — so picking a card returns you to list mode with the new selection.

**Note:** the labels are inverted-from-intuition: `viewTree` = "List", `viewChart` = "Tree". The list view is the row-tree (vertical hierarchy); the chart view is the L-connector visual diagram.

---

## 13. Information Edit Flow

1. User on tree, non-root node, clicks the "Information" link in node-header.
2. `setInfoOpen(true)` — table-panel is replaced with `<InfoPanel editing=false>`.
3. Node-header buttons swap to `[Back to users] [Edit Info]`.
4. Click "Edit Info":
   - Read existing info via `NODE_INFO[id] || NODE_INFO[clientId] || generic fallback`.
   - `setInfoDraft({...base})`, `setInfoEditing(true)`.
5. Header now shows `[Cancel] [Save]`. All fields become inputs/selects (TextField/SelectField branches inside InfoPanel). Avatar uploader renders in place of the static logo.
6. Fields editable: accountName, financeId, classification, subClassification (select), entityName, authorityType (select), sector, budget, country (select), city (select), district, street, building, postal, addlAddr, anotherId, vat. Plus clientPhoto upload.
7. **Cancel**: `setInfoEditing(false); setInfoDraft(null)`. Drops the draft.
8. **Save**: `setInfoEditing(false); setInfoDraft(null); pushToast('Information updated ✓')`. **The draft is discarded** — no persistence to `NODE_INFO` (which is a hardcoded const), no mutation of the tree. The save toast is purely cosmetic.

This is a UI-only flow with no backend in the mock.

---

## 14. Phone / Email Verification

Order (per `adduser.jsx` Step 1 and `userdetails.jsx` Edit Personal):

1. User types phone or email.
2. Inline verify button appears (`PhoneInput` / `EmailInput` both render `<button class="otp-verify-btn">Verify</button>`).
3. Click "Verify":
   - Add User flow: `openOtp('phone'|'email')` which sets `otpChannel` in AddUserFlow state.
   - User Details edit: clears verified flag first (`onChange('phoneVerified', false)`) then opens OtpModal.
4. `<OtpModal channel={otpChannel} target={...} onSuccess={...}>` renders as overlay.
5. User enters 6 digits.
6. After full 6 entered:
   - `'150999'` → status becomes `'invalid'`, an "Invalid OTP" banner shows.
   - Anything else → status `'success'`, ~1300 ms later `onSuccess()` fires.
7. `onSuccess` callback flips the right field's verified flag and dismisses the modal:
   ```js
   if (otpChannel === 'phone') update('phoneVerified', true);
   else { update('emailVerified', true); setShowEmailError(false); }
   setOtpChannel(null);
   ```
8. After verification, the input shows the `is-verified` style + a green "Verified" tag instead of the Verify button.
9. **Editing the phone/email after verification clears the verified flag**, forcing re-verify (UserDetailsPage:181–188).

Conditions for the Verify button to appear:
- `AddUserFlow`: always visible inline (the flow uses `<PhoneInput data={data} onChange={onChange}>` without `showVerify` prop — so verify is not shown in seed code. Actually re-reading: `showVerify` is not passed — so adduser flow's Verify buttons are absent. The "Verified" pill never appears here either. Verification UI is only wired in UserDetailsPage edit mode where `showVerify={form.status === 'pending'}`.)
- `UserDetailsPage` edit mode: shows Verify only when `form.status === 'pending'`.

Country picker behavior (`PhoneInput`):
- Default `'SA'` (Saudi Arabia, +966).
- 25 countries with hand-drawn flag SVGs.
- Dropdown has search input (filters by name or dial).
- First 2 results highlighted, separator, then remainder.
- Closes on outside click.

---

## 15. Style Classes vs Tailwind

**No Tailwind.** The React reference is **plain hand-written CSS** with CSS custom properties.

- 7 stylesheets: `styles.css` (~85 KB main), `addclient.css`, `settingstab.css`, `wallet.css`, `comm-mkt.css`, `templates.css`, `otp-verify.css`.
- Some inline `style={{...}}` attributes throughout (e.g. `marginTop: 24`, `padding: 80px 20px` in PlaceholderPage, `position: 'fixed'` for floating menus). These should be migrated to Tailwind utilities in Angular.
- BrandLogo (BMW especially) uses elaborate inline `style` for conic-gradient roundel — needs careful Angular translation.
- All status badges use class-based color via `.status-badge.active/.suspended/.deleted/.locked/.pending/.expired/.disabled/.inactive` — Angular should mirror via Tailwind palette (e.g. `bg-green-500/10 text-green-700` for active).
- Naming uses **kebab-case BEM-like** classes: `client-row`, `client-row.selected`, `client-row.on-path`, `clients-tree-scroll`, `ctx-menu`, `ctx-menu-floating`, `ctx-menu-item.highlighted`, `node-header`, `node-actions`, `view-toggle-btn`, `chart-card.is-root/.is-client/.is-dimmed/.is-focused`, `chart-user-circle.status-active/.status-pending/...`, `chart-zoom-controls`, `chart-focus-close`, `info-panel`, `info-panel.is-editing`, `info-grid`, `info-grid-top`, `info-grid-bottom`, `au-*` (Add User), `ac-*` (Add Client), `ud-*` (User Details), `otp-*`.
- Tailwind opportunity: every spacing/radius/color matches a token already in Noor. Conversion can be 1:1 utility-class with semantic mapping.
- **Flex used heavily** for the row layouts (tree-rails + chevron + logo + name + kebab); grid used for the form layouts (info-grid, au-form-grid-3, ac-grid-4). Angular team can stay closer to grid-first per the project preference.

### Color tokens (from styles.css :root)
```
--teal:       #0d3f44
--teal-dark:  #0a3338
--teal-deep:  #082a2e
--teal-hover: #124c52
--teal-light: #e8f0f1
--accent:     #0d3f44  (same as teal)
--text:       #1a1a1a
--text-2:     #3d3d3d
--text-muted: #6b7280
--text-faint: #9ca3af
--border:     #e5e7eb
--border-2:   #eef0f2
--bg:         #ffffff
--bg-panel:   #fafafa
--bg-hover:   #f5f7f8
--bg-page:    #f5f6f7
```
Map these to `falcon-teal-{500,600,700,800,50}` etc. in the Noor palette.

### Fonts
- Poppins (400, 500, 600, 700) for Latin.
- IBM Plex Sans Arabic (400, 500, 600, 700) for Arabic.
- Loaded via Google Fonts CDN (matches existing Falcon Theme studio decision).

---

## 16. Animations (from styles.css)

| Selector | Animation | Notes |
|---|---|---|
| `.page` | `transition: grid-template-columns 0.2s ease` | tree-vs-chart layout shift |
| `.client-row, .nav-item, .icon-btn, .user-chip, .user-menu-item, etc.` | `transition: background 0.12-0.15s` | hover states |
| `.client-chev` | `transition: transform 0.15s` | chevron rotate |
| `.ctx-menu, .row-menu` | `animation: menuIn 0.12-0.15s ease` | pop-in scale 0.96→1 + opacity 0→1 |
| `.toast` | `animation: toastIn 0.25s ease` | slide + fade in |
| `.drawer-overlay` | `animation: fadeIn 0.15s ease` | overlay |
| `.drawer` | `animation: drawerIn 0.22s ease` (LTR) / `drawerInRtl` | slide from right (or left for RTL) |
| `.ac-anim-pane.in-right/.in-left` | step-pane slide animation | wizard transitions |
| `.org-chart-canvas` | `transition: transform 520ms cubic-bezier(.22,1,.36,1)` | zoom/pan animation |
| `.chart-card.is-focused` | `animation: focusPulse 1.6s ease-in-out infinite` | pulse highlight |
| `.chart-card.is-dimmed` | `transition: opacity 420ms ease, filter 420ms ease` | dim non-focused |
| `.chart-card *` | `animation: focusFade 400ms ease-out` | when entering focus |
| `.chart-user-circle` | `animation: userCirclePop 520ms cubic-bezier(.22,1.2,.36,1) forwards` + staggered delays (180+i*60 ms) | pop-in for each user circle |
| `.chart-user-label` | `animation: userLabelIn 400ms ease-out forwards` + staggered (260+i*60) | label below circle |
| `.chart-user-connector path` | `animation: connectorIn 340ms ease-out 120ms backwards` | dashed line draw |
| `.chart-focus-close` | `animation: closeBtnIn 300ms ease-out 100ms backwards` | exit-focus button |
| `.org-chart-canvas-scroll.panning` | cursor: grabbing | not a transition but worth noting |
| `.ac-stepper-dot.active .ac-stepper-dot-pulse` | pulse around active step | wizard stepper |
| `.otp-timer circle (stroke-dashoffset)` | `transition: stroke-dashoffset 0.95s linear` | OTP timer ring decay |

Angular needs to mirror at least the orchestrated chart-focus animations and the stepper transitions; the rest is incidental hover polish.

---

## 17. icons.jsx — full list

| Export | Renders |
|---|---|
| `I` | Generic `<svg>` wrapper used by all icons |
| `IcDashboard` | 4 rounded rectangles (a Bento-style dashboard glyph) |
| `IcContactGroup` | 2 person heads with bodies |
| `IcTemplate` | Rectangle + horizontal + vertical line (sidebar template) |
| `IcBuilding` | Building with windows (Org Hierarchy nav) |
| `IcFalcon` | Stylized Falcon glyph in viewBox 0 0 201 201 (#104C54) — root logo |
| `IcLock` | Padlock |
| `IcWallet` | Wallet |
| `IcComm` | Refresh circle with arrow (chat-bubble proxy) |
| `IcMarket` | Storefront awning + shelves |
| `IcContracts` | Document with folded corner + lines |
| `IcSettings` | Cog wheel |
| `IcAudit` | Document with lines (audit log) |
| `IcSearch` | Magnifier |
| `IcBell` | Notification bell |
| `IcChevronDown` / `IcChevronUp` / `IcChevronLeft` / `IcChevronRight` | 4 chevrons |
| `IcHome` | House outline |
| `IcInfo` | Circled `i` |
| `IcPlus` | + |
| `IcUserPlus` | Person head + `+` |
| `IcMore` | 3 vertical dots (kebab) |
| `IcCheck` | Checkmark |
| `IcClose` | × |
| `IcFilter` | Funnel |
| `IcArrowLeft` | ← |
| `IcEdit` | Pencil |
| `IcGlobe` | Globe with meridians |
| `IcUserCircle` | Person in circle |
| `IcKey` | Key with hole |
| `IcLogout` | Door + arrow out |
| `IcSun` | Sun with rays |
| `IcMoon` | Crescent moon |
| `IcTrash` | Trash can |
| `IcZap` | Lightning bolt (filled) |
| `IcSquare` | Square |
| `IcReply` | Reply arrow |
| `IcGrid` | 4-square grid |
| `IcContact` | Contact card with avatar |
| `IcText` | Capital T |
| `IcImage` | Image with sun + mountain |
| `IcDot` | Filled dot |
| `IcCheckSq` | Checkmark in rounded square |
| `IcInputBox` | Input box outline |
| `IcDropdown` | Dropdown box + chevron |
| `IcBuildingS` | Smaller building variant |
| `IcUsers` | Two people |
| `IcExternal` | Arrow exiting box |
| `IcWa` | Speech bubble (WhatsApp-style) |
| `IcPhone` | Phone handset |
| `IcRiyal` | Official 2025 Saudi Riyal glyph (currentColor SVG) |
| `T2Mark` | T2 wordmark (used in sidebar header) |

Total: **~50 components**.

`otp-verify.jsx` adds: 25 country FlagXX components, `IcVerify`, `IcInfo` (local), `IcChevronUpDown`, `IcSearch` (local), `IcCheckCircle`, `IcResend`.

---

## 18. screens.jsx (auth shell, NOT hierarchy)

`screens.jsx` in the parent folder contains the login/forgot/OTP/reset screens for the public-facing auth flow. Not relevant to Organization Hierarchy page rebuild but cataloged for completeness:
- `LoginScreen` with 15+ error states (incorrect, usernameWrong, attempts2, attempts1, locked, suspended, pending, deleted, ip)
- `ForgotScreen`, `OtpScreen`, `SuccessScreen`, `ResetScreen` (mode: reset|change), `AllDoneScreen`
- `Marketing` aside, `BrandLogo` (Falcon mark)

Routing: `app.jsx` (parent, not admin/) URL-style state machine via `screen` localStorage key.

---

## 19. CSS file budget (for Angular Tailwind translation)

| File | KB | Scope |
|---|---|---|
| admin/styles.css | 85.4 KB | base + sidebar + topbar + page grid + tree + table + chart + info-panel + drawer + toasts + tweaks |
| admin/templates.css | 75.9 KB | (out of scope) |
| admin/addclient.css | 21.4 KB | wizard + step pane + service table + IP chips + radio cards |
| admin/wallet.css | 16.1 KB | (out of scope) |
| admin/comm-mkt.css | 9.1 KB | (out of scope) |
| admin/otp-verify.css | 8.1 KB | phone/email input + OTP boxes + verify pill + modal |
| admin/settingstab.css | 2.4 KB | settings tab specifics |

**Hierarchy-page-relevant total: ~117 KB of CSS** to convert to Tailwind utilities or design-system tokens. The lion's share is in styles.css.

---

## Behaviors that the Angular team MUST preserve

1. **Tree must support arbitrary depth** — the seed data goes 10 levels deep (BMW). No depth cap in the render code.
2. **Auto-expand ancestors on select** — calling `selectNode(id)` must compute `pathTo` and expand every ancestor so the row is rendered before scroll.
3. **Auto-scroll selected row into view** — but ONLY when the selection was programmatic (not user-clicked). Guard with a `justClickedRef`-style flag.
4. **Hover trail glow** — hovering a row should add an `.on-path` style to every ancestor row, painted as a teal vertical stripe in the rail column.
5. **Horizontal-scroll reveals full names** — while `clients-list.is-scrolled`, the row name should un-truncate (the ellipsis lifts). This is the long-name view.
6. **Floating context menu with anchor reposition** — the per-row kebab menu is `position:fixed` and recomputes coords on scroll/resize. RTL flips anchor side.
7. **Context menu items vary by node type** — root: Add Client + Add User; everything else: Add Node + Edit Node + Add User. Submenu items are exactly these — no more, no less.
8. **Add Node creates a node, Add Client creates a client, Edit Node renames in place** — the App.handleDrawerSubmit logic. New IDs use `'n' + Date.now()`. New nodes inherit `users: seedUsers`.
9. **Toasts auto-dismiss after 3500 ms** — and stack from a fixed corner. X-button manual dismiss must also work.
10. **Tab set depends on whether the selected node is the root** — root has only `[hierarchy, settings]`; everyone else has `[hierarchy, commChannels, appsServices, settings]`.
11. **View-toggle hides for non-hierarchy tabs** — `viewTree/viewChart` buttons only show when activeTab === 'hierarchy'.
12. **Chart card click enters focus mode, not selection** — root cards are a special case (root → onSelect, no focus). Non-root clicks zoom in and show user circles around the card with staggered pop animations.
13. **Exit focus restores prior zoom + pan** — captured in `prevViewRef` before entering focus.
14. **Wheel-zoom is anchored to cursor position** — zooming towards the point under the mouse, not the canvas center.
15. **Pan suppression of click after drag** — `dragRef.moved > 4` blocks the trailing card click.
16. **Information panel is non-persistent** — Save dispatches a toast but does NOT mutate NODE_INFO or the tree. Cancel discards. (Angular team must mirror this for parity, then connect to backend in v2.)
17. **Information panel resets when the selected node changes** — `useEffect([selected])` closes the panel, drops the draft, exits edit.
18. **OTP "invalid" trigger is literal `'150999'`** — every other 6-digit combination succeeds. Behavior is identical on type and on paste.
19. **OTP modal auto-advances focus, supports paste, has 60s resend timer with circular SVG progress**, expires state when timer hits zero, and disables boxes while expired.
20. **Phone input defaults to SA (+966)** — country dropdown is searchable; first 2 matches highlighted, separator, then remainder.
21. **Editing a verified phone/email un-verifies it** — to force re-OTP.
22. **Verify pill only shows when `status === 'pending'`** in UserDetailsPage edit mode. AddUser flow shows no Verify by default in the current code (gap to confirm with Noor/PO).
23. **AddClient validation: only `accountName` is required in step 1**, all other "required" markers are visual. (Angular team can keep this minimal or expand later.)
24. **AddUser flow has NO per-step validation** — Next is always enabled. Stepper jump-back is gated by `maxStep`.
25. **AddClient flow stepper jump-back is gated by `current` not `maxStep`** — slightly looser than AddUser. Preserve the asymmetry or unify intentionally.

---

## Open questions

1. **OTP "all zeros" mention in the brief vs `'150999'` in the code** — confirm: should Angular keep `'150999'` invalid, or change to "any zeros" rule, or wire to backend? Code reality is `'150999'` only.
2. **InfoPanel Save persistence** — the React mock does not persist edits. Should Angular persist into a local store (signal/service) and propagate to the `users` table or `NODE_INFO`-equivalent, or stay UI-only for the mock phase?
3. **AddUser flow lacks Verify buttons** — `<PhoneInput>` and `<EmailInput>` are rendered without `showVerify`, so no Verify UI appears during user creation. UserDetailsPage in edit mode DOES wire it. Is the intent that Add User should also have Verify? (The buttons + OtpModal logic are present but unused.)
4. **`Add User` label is hardcoded** in HierarchyPage's primary button (line 1352) — uses literal English string, not `t.addUser`. Bug or intentional? Angular should use `t.addUser`.
5. **`users: seedUsers` on every node** — all nodes share the same 6 users. Is this intentional for the demo, or should every node have distinct mock users in Angular?
6. **Status `'expired'` and `'disable'`** appear in `StatusBadge` map but are never used in `seedUsers`. They exist in `APPS_BY_TAB` (apps.jsx). Should the Angular UsersTable accommodate them?
7. **KanbanView is exported but never rendered** in the hierarchy page — was it planned for a future "Group by status" view? The label `viewByStatus = 'Grouped by status'` exists in i18n. Confirm whether Angular should include it as a third view-mode.
8. **Information panel data source for non-NODE_INFO nodes** — currently falls back to a derived stub. Should Angular keep this fallback or fetch from the tree's own data?
9. **Mood (dark/light) toggle in UserMenu** — `mood` state is local to App and never read elsewhere. Dark mode CSS is not implemented. Is dark mode a hierarchy-page concern, or platform-wide later?
10. **Brand logos** — BMW uses inline conic-gradient SVG, Aramco loads `admin/assets/aramco-logo.png`. Angular needs equivalents (asset paths + SVG component).
11. **Sidebar collapsing affects layout via root `.app.collapsed`** — confirm Angular shell already supports this pattern from the existing admin-console scaffold.
12. **`Drawer` keyboard / focus management** — Esc closes, Enter on the input submits. No focus-trap is implemented (the React drawer relies on `autoFocus` on the single input). Angular should add a11y focus-trap.
13. **RTL handling for the ctx-menu floating coords** — the code reads `document.body.getAttribute('dir')` to flip left/right anchor. Angular team must wire equivalent via the framework's direction service.
14. **`'Coming in v2'` stub for non-implemented tabs in the original** — currently never reached because every tab is wired. Safe to drop.
15. **No focus-trap or backdrop-blur in modals** — opportunity to add via Falcon UI Core wrappers without changing behavior.

---

## Files (absolute paths) referenced

- `C:\Falcon\Source_of_truth_theme\React\Organization page\T2 Falcon Admin.html`
- `C:\Falcon\Source_of_truth_theme\React\Organization page\admin\app.jsx`
- `C:\Falcon\Source_of_truth_theme\React\Organization page\admin\sidebar.jsx`
- `C:\Falcon\Source_of_truth_theme\React\Organization page\admin\topbar.jsx`
- `C:\Falcon\Source_of_truth_theme\React\Organization page\admin\drawers.jsx`
- `C:\Falcon\Source_of_truth_theme\React\Organization page\admin\hierarchy.jsx`
- `C:\Falcon\Source_of_truth_theme\React\Organization page\admin\apps.jsx`
- `C:\Falcon\Source_of_truth_theme\React\Organization page\admin\otp-verify.jsx`
- `C:\Falcon\Source_of_truth_theme\React\Organization page\admin\adduser.jsx`
- `C:\Falcon\Source_of_truth_theme\React\Organization page\admin\userdetails.jsx`
- `C:\Falcon\Source_of_truth_theme\React\Organization page\admin\addclient.jsx`
- `C:\Falcon\Source_of_truth_theme\React\Organization page\admin\settingstab.jsx`
- `C:\Falcon\Source_of_truth_theme\React\Organization page\admin\data.jsx`
- `C:\Falcon\Source_of_truth_theme\React\Organization page\admin\icons.jsx`
- `C:\Falcon\Source_of_truth_theme\React\Organization page\admin\i18n.jsx`
- `C:\Falcon\Source_of_truth_theme\React\Organization page\admin\styles.css`
- `C:\Falcon\Source_of_truth_theme\React\Organization page\admin\addclient.css`
- `C:\Falcon\Source_of_truth_theme\React\Organization page\admin\settingstab.css`
- `C:\Falcon\Source_of_truth_theme\React\Organization page\admin\otp-verify.css`

End of Agent 2 discovery.
