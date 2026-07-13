*** PRD Understanding - Basic Send Application - REACT_HOST_INTEGRATION (shell mount, marketplace flow, i18n, runtime) ***

# BSA Hosting & Marketplace Flow in the Falcon Admin Reference App (falcon-ux (4))

**Analyst report — deep read of the T2 Falcon Admin reference prototype.**
Date: 2026-07-06.

**Path shorthand:** all `[CODE]` citations below are relative to
`C:/Falcon/Source_of_truth_theme/latest 07062026/falcon-ux (4)/` unless a full path is given.

**Prefix legend:** `[CODE] file:line` = read from source. `[INFERRED]` = my reasoning, flagged. `[MEMORY]` = user's persistent MEMORY.md standing rules (auto-memory context, not vault/PRD — used only in §5 recommendations). No PRD, Brain output, or Vault file was read for this task; every `[PRD]`/`[BRAIN-OUT]`/`[VAULT]`-class claim is therefore ABSENT from this report by design.

**Ignored dirs honored:** `uploads/`, `admin.bak.2026-05-30-120523/`, `admin/_edit-bak.2026-05-30-123233/`, `replica/`, `standalone/` were not read.

---

## 1. MOUNTING — how screens are registered/routed and how the BSA is mounted

### 1.1 The shell is a single React `App` with string-state routing (no router)

- [CODE] admin/app.jsx:94-108 — `const App = () => { ... const [activePage, setActivePage] = useState('orgHierarchy'); ...}`. The entire admin is one React tree; the "route" is the `activePage` string in component state. Default landing page is `orgHierarchy`.
- [CODE] admin/app.jsx:461 — `ReactDOM.createRoot(document.getElementById('root')).render(<App />);` — single root mount into `<div id="root">` ([CODE] T2 Falcon Admin.html:38).
- ABSENT: there is **no URL routing** — no react-router, no hash routing, no history API usage anywhere in app.jsx. Deep-linking to a screen is impossible; refresh always lands on Organization Hierarchy. [INFERRED] this is a prototype simplification an Angular port must replace with real routes.
- ABSENT: there is **no lazy loading**. Every screen's code is loaded eagerly at page load via `<script type="text/babel">` tags (see §4). "Mounting" a page is purely a conditional render.

### 1.2 Page registry = `pageTitleMap` + a render if/else chain

- [CODE] admin/app.jsx:227-244 — `pageTitleMap` is the de-facto page registry (keys: `dashboard`, `contactGroups`, `templates`, `templateMgmt`, `orgHierarchy`, `permissions`, `walletBalance`, `commChannels`, `commChannels:whatsapp`, `commChannels:voice`, `marketplace`, `marketplace:basic`, `marketplace:survey`, `contractsCost`, `systemSettings`, `auditLog`). Submenu pages use a `parent:child` colon convention in the id.
- [CODE] admin/app.jsx:239 — `'marketplace:basic': t.bsaBasicApp || 'Basic Application'` — the BSA page title entry.
- [CODE] admin/app.jsx:269-393 — the render chain: `activePage === 'orgHierarchy' ? <HierarchyPage/> : ... : activePage === 'marketplace' ? <MarketplacePage/> : activePage === 'marketplace:basic' ? <BasicApplicationPage/> : ... : <PlaceholderPage/>`. Pages with components: orgHierarchy, templates, templateMgmt, commChannels:whatsapp (MetaServicePage), commChannels:voice (VoiceServicePage), commChannels (CommChannelsPage), marketplace (MarketplacePage), **marketplace:basic (BasicApplicationPage)**, contactGroups, contractsCost, walletBalance.
- [CODE] admin/app.jsx:391-393 — everything else (`dashboard`, `permissions`, `systemSettings`, `auditLog`, `commChannels:ai`, **`marketplace:survey`**) falls through to `<PlaceholderPage title={pageTitle} t={t} />`. So "Survey Pro" is a registered nav item + title with **no page implementation** — an intentional stub.

### 1.3 What triggers the BSA: the sidebar submenu item

- [CODE] admin/sidebar.jsx:19-22 — the nav item:
  ```jsx
  { id: 'marketplace', icon: IcMarket, label: t.marketplace, children: [
    { id: 'marketplace:basic',  label: t.bsaBasicApp || 'Basic Application' },
    { id: 'marketplace:survey', label: t.bsaSurveyPro || 'Survey Pro' },
  ] },
  ```
- [CODE] admin/sidebar.jsx:38-57 — clicking the parent row calls `setActivePage('marketplace')`; sub-items render only while parent-or-child is active and the sidebar is not collapsed (`expanded = (selfActive || childActive) && hasKids && !collapsed`, line 35); clicking `Basic Application` calls `setActivePage('marketplace:basic')`. `childActive` is computed by prefix match `activePage.startsWith(it.id + ':')` (line 34) and puts a `has-active-child` class on the parent.
- [CODE] admin/app.jsx:421-426 — a second trigger exists: the Tweaks/edit-mode panel `Active Page` dropdown can jump straight to any `pageTitleMap` key, including `marketplace:basic`.

### 1.4 The BSA component itself, and the exact props it receives

- [CODE] admin/basic-app.jsx:1-4 — file header: *"T2 Falcon Admin — Basic Send Application (BSA). Marketplace & Applications .Mng → Basic Application. Phase 1: WhatsApp / Voice channel tabs · Outbox / Scheduled sub-tabs · Quick Sort · Message List grid (status pills + row actions) · pagination."*
- [CODE] admin/basic-app.jsx:2769 — the top-level component signature:
  ```jsx
  const BasicApplicationPage = ({ tree, selected, selectNode = () => {}, expanded,
                                  toggleExpand = () => {}, t = {}, pushToast = () => {} }) => {
  ```
- [CODE] admin/basic-app.jsx:2992 — `window.BasicApplicationPage = BasicApplicationPage;` — registration is a **global window assignment**, the same pattern every screen uses (`window.Sidebar` sidebar.jsx:91, `window.Topbar` topbar.jsx:146, `window.ApplicationsPage` apps.jsx:710, `window.CommChannelsPage`/`window.MarketplacePage` comm-mkt.jsx:503-504).
- [CODE] admin/app.jsx:347-357 — the shell mounts it with:
  ```jsx
  <BasicApplicationPage tree={tree} selected={selected} selectNode={(id) => setSelected(id)}
                        expanded={expanded} toggleExpand={toggleExpand}
                        lang={lang} t={t} pushToast={pushToast} />
  ```
  Note: `lang` is passed by the shell but **not destructured** by the component (2769) — the BSA reads language only through `t`. [INFERRED] `lang` is dead-prop for BSA; RTL comes free because the shell flips `document.body.dir` (app.jsx:152).
- Props semantics:
  - `tree` — the live mutable org tree state (root Falcon → clients → nodes), seeded from `window.seedTree` ([CODE] admin/data.jsx:13-75, app.jsx:111).
  - `selected` — currently selected node id (shell state, default `'aramco'` via `TWEAK_DEFAULTS.defaultClient`, app.jsx:37-42,114).
  - `selectNode` — note the shell passes the *plain* setter `(id) => setSelected(id)` here (app.jsx:351), not the auto-navigating `selectNode` used by HierarchyPage (app.jsx:184-196), so selecting a node inside BSA does not yank the user to Org Hierarchy.
  - `expanded`/`toggleExpand` — shared tree-expansion map (app.jsx:117-119) so the org tree keeps its expansion state across pages.
  - `t` — the flat translation dict for the active language (`adminDict[lang]`, app.jsx:99).
  - `pushToast` — shell toast queue (app.jsx:129-134); toasts render in the shell's `<Toasts/>` stack (app.jsx:406).
- ABSENT: **no React context, no DI, no auth/session object, no API client** is passed. Everything else the BSA needs it pulls from `window.*` globals (see §1.6).

### 1.5 BSA internal state machine (what "mounted" means for it)

- [CODE] admin/basic-app.jsx:2771-2785 — internal state: `viewAs` (`null` picker | `'falcon'` | `'client'`), `role` (`account-owner` | `node-admin` | `normal-user`), `channel` (`whatsapp` | `voice`), `mode` (`outbox` | `scheduled`), `view` (`list` | `compose` | `details` | `conversation`), plus grid state (page, pageSize=10, search, typeFilter) and mutable transaction lists.
- [CODE] admin/basic-app.jsx:2912 — first render is a **perspective picker** (`BsaViewPicker`, 2709-2734: "View as Falcon" / "View as Client"); choosing client also `selectNode('aramco')`.
- [CODE] admin/basic-app.jsx:2918-2924 — `compose`, `details`, `conversation` are **full-page takeovers**: they replace the whole page body (the org-tree rail included) but stay inside the BSA component — the shell topbar/sidebar remain, breadcrumb/title do not change.
- [CODE] admin/basic-app.jsx:2926-2928 — list view layout: `templates-page basic-app-page` grid = `window.TplOrgTree` rail (hidden for Normal User: `isNormalUser` → `bsa-no-tree` class, full-width, basic-app.css:5-8) + `content-panel bsa-main`.
- [CODE] admin/basic-app.jsx:2899-2906 — perspective logic: Falcon view gets the whole `tree`; Client view gets the Aramco subtree (`window.findNode(tree,'aramco')`); `role==='normal-user'` hides the tree entirely and is **the only role that can compose/send** (2950: `{isNormalUser && (<button ... onClick={openCompose}>` and comment at 2949 "Only a Normal User sends messages; Account Owner / Node Admin oversee & review").
- [CODE] admin/basic-app.jsx:2802-2821 — a live "In Progress" ticker advances in-progress transactions every 4.5 s toward ~70% of target (never auto-completes) — pure demo behavior.

### 1.6 Window-global contracts the BSA participates in (the reference's "micro-frontend bus")

- **Ask-AI handler registration:** [CODE] admin/app.jsx:139-149 — the shell owns `window.falconAskAI = { handler, _openGlobal, open() {...} }`; the topbar button calls `window.falconAskAI.open()` ([CODE] admin/topbar.jsx:103). A page may register a richer handler: [CODE] admin/basic-app.jsx:1185-1187 (`BsaDetails`) and 1914-1916 (`BsaVoiceDetails`) set `window.falconAskAI.handler = () => setAskAI(true)` and null it on unmount — so on BSA detail screens, Ask-AI opens the transaction-aware `BsaAskAI` (1126) instead of the generic shell panel (`AskAIGlobal`, app.jsx:47-92).
- **Cross-page navigation functions:** [CODE] admin/app.jsx:169-180 — the shell exposes `window.falconGoVoiceAccount()` (sets `window.__vsInitial = { viewAs:'client', tab:'account' }`, selects `aramco`, activePage → `commChannels:voice`) and `window.falconGoMetaService()` (activePage → `commChannels:whatsapp`). Consumed by marketplace/comm activation actions ([CODE] admin/apps.jsx:519-523, admin/comm-mkt.jsx:378-382). The Voice Service page reads-then-clears `window.__vsInitial` ([CODE] admin/voice-service.jsx:1494-1521).
- **Shared components pulled from other files via window:** `window.TplOrgTree` (defined templates-shared.jsx:45, exported :316), `window.TplIvrStep2` (IVR flow canvas, used read-only at basic-app.jsx:1063,1548,2130), `window.TablePagination` + `window.StatusBadge` (hierarchy.jsx:1473-1474), `window.DatePicker` + `window.formatDMY` (apps.jsx:88,171), `window.COUNTRIES` (otp-verify.jsx:369), `window.findNode`/`window.seedTree`/`window.BrandLogo` (data.jsx:176-181), `window.seedTemplates` (templates-data.jsx:618).
- **BSA seed data globals:** [CODE] admin/basic-app-data.jsx:225-230 — `Object.assign(window, { bsaWaSenders, bsaVoiceSenders, bsaWaTemplates, bsaVoiceTemplates, bsaContactGroups, seedBsaWaOutbox, seedBsaWaScheduled, seedBsaVoiceOutbox, seedBsaVoiceScheduled, bsaWaTemplateBodies, bsaTemplateVars, bsaSampleConversation, bsaIvrTranscripts, bsaAiHandoff })`.
- **Edit-mode/iframe host protocol:** [CODE] admin/app.jsx:157-165,222-224 — the app listens for `__activate_edit_mode`/`__deactivate_edit_mode` postMessages, announces `__edit_mode_available` to `window.parent`, and persists tweaks via `__edit_mode_set_keys`. [INFERRED] this is the contract with the (ignored) uploads-host wrapper; harmless when opened directly.

---

## 2. MARKETPLACE FLOW — purchase/activation in apps.jsx / comm-mkt.jsx

### 2.1 Where marketplace data lives

- [CODE] admin/apps.jsx:21-43 — `APPS_BY_TAB` seeds two catalogs:
  - `appsServices` (the **Marketplace** catalog): `a1 'Basic Send App'` (Monthly, 2000, status `active`, visible), `a2 'Survey Pro'` (active), `a3 'Campaign Engine'` (expired), `a4 'Workflow Builder'` (expired), `a5 'Analytics Suite'` (disable), `a6 'Form Builder'` (disable, invisible), `a7 'Reporting Hub'` (inactive), `a8 'AI Assistant'` (inactive, invisible, never activated).
  - `commChannels`: `c1 SMS Gateway`(active) … `c2 WhatsApp Business`(**paid**) … `c4 Voice IVR`(**paid**) … `c9 Apple Business Chat`(inactive, never purchased). Comm rows carry an extra `purchaseDate` field.
- Row shape: `{ id, name, priceType(OneTime|Monthly|Quarterly|Yearly), priceValue, firstActivation, [purchaseDate], activation, renew, status, visible }` ([CODE] admin/apps.jsx:23-41).

### 2.2 Three surfaces render these catalogs

1. **Sidebar → Marketplace & Applications .Mng** (`activePage='marketplace'`) → `MarketplacePage = (props) => <CommMktPage {...props} kind="appsServices"/>` ([CODE] admin/comm-mkt.jsx:501).
2. **Sidebar → CommChannels & Services .Mng** (`activePage='commChannels'`) → `CommChannelsPage = kind="commChannels"` ([CODE] admin/comm-mkt.jsx:500).
3. **Org Hierarchy node tabs** — the node detail page has tabs `hierarchy | commChannels | appsServices | settings` ([CODE] admin/hierarchy.jsx:1198-1201, labels i18n.jsx:88-89 'CommChannels & Services'/'Apps & Services') and embeds the same table: `<ApplicationsPage tabKey={activeTab} t={t} pushToast={pushToast} nodeId={selectedNode.id} />` ([CODE] admin/hierarchy.jsx:1435).

### 2.3 CommMktPage flow (the marketplace screen proper)

- [CODE] admin/comm-mkt.jsx:351-419 — flow: on entry `viewAs===null` → `CMViewAsPicker` ("Whose channels & services are you reviewing?" — View as Falcon / View as Client, i18n cmViewAsTitle:227). Picking `client` auto-selects `aramco`.
  - **Falcon perspective**: left `CMClientsPanel` clients rail (295-320) + **list-only** view (`effectiveView = isFalcon ? 'list' : view`, 417) → renders `ApplicationsPage` with the visibility column shown (`hideVisibility={!isFalcon}` → false) — Falcon admin controls per-client catalog visibility.
  - **Client perspective**: no clients rail, defaults to **grid of cards** with a list/grid toggle (`CMViewToggle`, 283-292) and a status filter dropdown (`CMShowFilter`: All/Active/Expired/Disable/Inactive, 245-280). Visibility column hidden in list view.
- **The 'Basic Send App' marketplace card:** [CODE] admin/comm-mkt.jsx:18 — `a1: { icon: 'send', descKey: 'cmDescBasic', displayName: 'Basic Send App' }` in `CM_META` (exported `window.CM_META`, line 27); icon asset `send: 'admin/assets/basic-application.svg'` ([CODE] comm-mkt.jsx:37); description i18n `cmDescBasic: 'Basic Send App for triggering one-off transactional messages from any backend.'` ([CODE] admin/i18n.jsx:214; AR :1146). Card anatomy (`CMCard`, 99-242): icon + title + status pill (+ price line `9.99/Month` for inactive/disabled), description, 3-4 date chips (First Activation / [Purchase] / Activation-or-Paid / Renew), pending-price band, and per-status action buttons.
- **Relationship to the BSA page:** ABSENT — there is **no navigation wired from the 'Basic Send App' marketplace card to the BSA screen**. The card's actions are only lifecycle actions (disable/enable/doPayment). The BSA screen is reached exclusively via the sidebar submenu `Marketplace & Applications .Mng → Basic Application` (§1.3). [INFERRED] in a production port one would expect an "Open app" affordance on an active card; the reference keeps purchase-lifecycle and app-usage as sibling nav items instead.

### 2.4 Status transitions (the purchase/activation state machine)

Statuses rendered by the shared `StatusBadge` ([CODE] admin/hierarchy.jsx:320-339; labels i18n.jsx:142-146 Active/Inactive/Expired/Disable/Paid; AR :1077-1081).

**Marketplace applications (`appsServices`, isComm=false)** — actions from the 3-dot `RowActionsMenu` ([CODE] admin/apps.jsx:417-434) and card buttons ([CODE] admin/comm-mkt.jsx:133-142):
- `active` → **Disable** (→ `disable`), Edit Price Type, Edit Price Value.
- `expired` → **Do Payment** (→ `active`), Disable, Edit×2.
- `disable` → **Enable** (→ `active`), Edit×2.
- `inactive` → **Do Payment** (→ `active`), Disable.
- Transition handlers: [CODE] admin/apps.jsx:501-528 (`handleAction`: disable/enable set status directly with toast; doPayment opens modal) and comm-mkt.jsx:377-394.

**Comm channels (isComm=true)** — [CODE] admin/apps.jsx:405-416 (menu) and comm-mkt.jsx:126-132 (cards): *"CommChannels: no enable/disable; 'Paid' rows expose 'Activate'."*
- `inactive` (never purchased) → **Do Payment** → status **`paid`** + `purchaseDate=today` + `activation=today` (first purchase).
- `paid` → **Activate** → **cross-page route by channel**, not an in-place flip: WhatsApp → `window.falconGoMetaService()` (Meta Service .Mng page); Voice/any other → `window.falconGoVoiceAccount()` (Voice Service, Voice-account tab) ([CODE] admin/apps.jsx:519-523; admin/comm-mkt.jsx:378-382; channel detection via `CM_META[id].icon`). Actual activation is completed inside those service pages.
- `expired` → **Do Payment** → `active` (renewal; `activation=today`).
- The branch logic: [CODE] admin/apps.jsx:678-687 and comm-mkt.jsx:480-489 — `if (!x.firstActivation) → { status:'paid', purchaseDate, activation:today }` else `{ status:'active', activation:today }`; non-comm rows always `→ active`.

**Do Payment = the Insufficient Balance modal** ([CODE] admin/apps.jsx:290-383, invoked :669-690):
- Red-triangle warning, title `ibTitle: 'Insufficient Balance Detected'` (i18n.jsx:189), subtitle, a **drag-to-reorder priority list** of channels (WhatsApp / Voice / AI-ChatGPT) with rank numbers and up/down arrows, an info note (`ibFirstAuto`), Cancel / **Proceed Payment** (`ibProceed`, i18n.jsx:194). `onProceed(items)` applies the status transition above and toasts `Proceed Payment ✓ — <first-priority>`. [INFERRED] the modal models "wallet can't cover everything — rank which channels consume balance first"; in the prototype it *always* appears for Do Payment (no real balance check).

**Visibility (Falcon-only column)** — [CODE] admin/apps.jsx:476-486:
- Toggle per row; **locked once a commchannel has been purchased** (`isComm && app.purchaseDate` → disabled, tooltip `visLockedHint`, :570).
- Turning a commchannel visible while the tenant has an active contract (`window.seedContracts[nodeId]` check, :450-452) first shows a warning modal `visWarnTitle: 'Make commchannel visible?' / visWarnMsg: 'Make sure to edit all active contracts and add the contract price details and Rate card…'` (i18n.jsx:184-187; modal :691-705).
- Status-cell display rule ([CODE] admin/apps.jsx:583-586): shows `-----` when `!visible` or (`!firstActivation && status!=='paid'`) — i.e., a never-activated, unpaid item has no meaningful status to show.

**Price edits (pending-change pattern)** — [CODE] admin/apps.jsx:174-287,488-499: Edit Price Type (new type + effective date, min-date-guarded `DatePicker`) or Edit Price Value (SAR input) open an inline expansion row; Save stores it in `pendingMap` (view-mode row with re-edit/delete icons) rather than mutating the live price — mirrored on cards as a pending band ([CODE] comm-mkt.jsx:110-122,193-210; a demo pending change is hard-seeded on c2/WhatsApp, :396-403).

### 2.5 Where "Basic Send Application" shows up, summarized

| Surface | Evidence |
|---|---|
| Marketplace card/list row "Basic Send App" (a1) | [CODE] apps.jsx:23; comm-mkt.jsx:18,37; i18n.jsx:214 |
| Sidebar submenu "Basic Application" under Marketplace & Applications .Mng | [CODE] sidebar.jsx:20; i18n.jsx:47 (AR :990 'التطبيق الأساسي') |
| Full BSA screen (`marketplace:basic`) | [CODE] app.jsx:347-357; basic-app.jsx:2769-2992 |
| BSA seed data marks it as the send-app product | [CODE] basic-app-data.jsx:1-4 |

ABSENT: no purchase gate in front of the BSA screen — the sidebar item renders the app regardless of a1's marketplace status. [INFERRED] a real port should gate the nav item / route on subscription status (a1 is seeded `active`, so the reference is self-consistent but the gating logic itself is not demonstrated).

---

## 3. NAVIGATION MODEL — sidebar, topbar, breadcrumbs

### 3.1 Sidebar ([CODE] admin/sidebar.jsx:3-92)

Three sections (labels i18n.jsx:6-7 `mainItems: 'Main Items'`, `accountAdmin: 'Account Administration'`):

```
FALCON logo + collapse chevron                       (sidebar.jsx:66-74)
── Main Items ──────────────────────────
  Dashboard            (placeholder page)
  Contact Groups
  Templates
  Template Management
── Account Administration ──────────────
  Organization Hierarchy
  Permissions          (placeholder page)
  Wallet & Balance .Mng
  CommChannels & Services .Mng   ▸ Meta Service .Mng (commChannels:whatsapp)
                                 ▸ Voice Service     (commChannels:voice)
                                 ▸ AI                (commChannels:ai → placeholder)
  Marketplace & Applications .Mng ▸ Basic Application (marketplace:basic → BSA)
                                  ▸ Survey Pro        (marketplace:survey → placeholder)
  Contracts & Cost .Mng
── footer ──────────────────────────────
  System Settings      (placeholder)
  Audit Log            (placeholder)
```

- Submenu behavior: children render only when the parent or one of its children is the active page AND the sidebar is expanded ([CODE] sidebar.jsx:33-35); no independent expand/collapse chevrons — selection drives expansion. Child rows show a `›` glyph (:54).
- Collapse: `collapsed` state lives in the shell (app.jsx:105, seeded from `TWEAK_DEFAULTS.sidebarStart`), toggled by the chevron button; collapsed mode hides labels and submenus.
- Labels: `t.marketplace = 'Marketplace & Applications .Mng'` / AR `'إدارة المتجر والتطبيقات'` ([CODE] i18n.jsx:46,989); `t.commChannels = 'CommChannels & Services .Mng'` / AR :988; `smWhatsapp: 'Meta Service .Mng'`, `smVoice: 'Voice Service'`, `smAi: 'AI'` (:235-237, AR :1167-1169).

### 3.2 Topbar ([CODE] admin/topbar.jsx:73-144)

- Left: page title (`pageTitle`) + breadcrumb.
- Right action cluster: **Ask AI** button (gradient spark svg; calls `window.falconAskAI.open()`, :103), Search icon (non-functional), Notifications bell with badge dot, divider, user chip → `UserMenu` dropdown (:5-71) containing: Language switch (single button toggling en↔ar, :34), Profile, Change Password, **Mood** light/dark toggle, Logout (`window.location.href = 'T2 Falcon Login - Enhanced.html'`, :65).
- Mood: state only — `const [mood, setMood] = useState('light')` (app.jsx:102) is passed down and toggled, but ABSENT: no effect ever applies a dark theme class/token anywhere. Dark mode is a UI stub.

### 3.3 Breadcrumbs

- [CODE] admin/app.jsx:245-246 — `const pageTitle = pageTitleMap[activePage] || t.orgHierarchy; const breadcrumb = [pageTitle];` — the breadcrumb is always exactly one level.
- [CODE] admin/topbar.jsx:90-99 — rendered as `⌂ Home › <pageTitle>`; the chevron carries class `flip-rtl` so it mirrors in Arabic.
- For the BSA: breadcrumb shows `Home › Basic Application` and **never changes** while the user drills into Compose/Details/Conversation — those are internal takeovers invisible to the shell (§1.5). ABSENT: no parent crumb "Marketplace & Applications .Mng" is inserted for submenu pages — the map is flat.

### 3.4 i18n & RTL mechanism

- [CODE] admin/i18n.jsx:3-4,949,1863-1865 — `const adminDict = { en: {...~945 keys...}, ar: {...} }; window.adminDict = adminDict;` — one flat dictionary per language, plain JS object.
- [CODE] admin/app.jsx:96-99 — `lang` state initialized from `localStorage.admin_lang` (fallback `TWEAK_DEFAULTS.defaultLang='en'`); `const t = adminDict[lang];` — `t` is re-derived every render; language switch re-renders the whole tree.
- [CODE] admin/app.jsx:151-154 — RTL: `document.body.dir = lang === 'ar' ? 'rtl' : 'ltr'` + persist to localStorage. CSS handles mirroring via `[dir=rtl]` rules and `.flip-rtl`.
- **BSA i18n coverage is minimal:** grep of `bsa` in i18n.jsx yields exactly 4 lines — `bsaBasicApp`/`bsaSurveyPro` in EN (:47-48) and AR (:990-991: `'التطبيق الأساسي'`; Survey Pro left untranslated). Every other `t.bsa*` key used by basic-app.jsx and app.jsx (`bsaPickerTitle`, `bsaViewFalcon`, `bsaWhatsapp`, `bsaVoice`, `bsaSendWa`, `bsaSendVoice`, `bsaSwitchPerspective`, `bsaScheduledToast`, `bsaSentToast`, `bsaCancelTitle`, `bsaDeleteTitle`, `bsaAskAI`, `bsaFalconAi`, `bsaSuggestedQ`, `bsaAskAnything`, `bsaSendMsg`, `bsaStatus_*`, …) is ABSENT from the dictionary and resolves through inline `||` English fallbacks (e.g. [CODE] basic-app.jsx:2714,2832,2933-2936; app.jsx:68,75,82,86-87; basic-app.jsx:21 `t['bsaStatus_' + status]` lookup). **The BSA is effectively English-only today**; an AR pass requires extracting and translating all these keys.
- Marketplace-related keys that ARE fully bilingual: `marketplace`, `statusActive/Inactive/Expired/Disable/Paid` (:142-146/:1077-1081), `actDisable/actEnable/actActivate/actDoPayment` (:177-180/:1110-1113), `visWarn*` (:184-187/:1117-1120), `ib*` (:189-194/:1122-1127), `cmDescBasic/cmDescSurvey` (:214-215/:1146-1147), `cmViewAs*` (:227/:1159), `cmPerMonth` (:222/:1154).

---

## 4. RUNTIME — exactly how the reference app runs

### 4.1 Entry points

- `index.html` ([CODE] :1-203) — a static **project-index landing page** (cards linking to the prototypes); it does not load any JSX. The Admin card links to `T2 Falcon Admin.html` (:168).
- **`T2 Falcon Admin.html` is the real admin entry** and the only non-ignored HTML that loads `basic-app.jsx` (verified by grep across root `*.html`).
- `index-bundle-src.html` (6.7 KB) and `T2 Falcon - Index (standalone).html` (606 KB) are bundler source/output variants of the index page; both carry a `<template id="__bundler_thumbnail">` block ([CODE] T2 Falcon Admin.html:25-35 has one too) — [INFERRED] artifacts of the upload/preview bundler that hosted these prototypes; irrelevant at runtime.

### 4.2 Script/runtime stack ([CODE] T2 Falcon Admin.html:38-83)

- `<div id="root"></div>` (:38).
- **React 18.3.1 UMD development builds** + **@babel/standalone 7.29.0** from `unpkg.com`, each with SRI `integrity` + `crossorigin` attributes (:40-42). No bundler, no ES modules, no importmap.
- **33 `<script type="text/babel" src="admin/*.jsx?v=20260703u">` tags** (:44-83), transpiled **in the browser** by babel-standalone at page load. There are no imports/exports in any jsx file — each file relies on globals created by earlier files, so **tag order is the dependency graph**:
  `i18n → icons → data → sidebar → topbar → drawers → hierarchy → apps → otp-verify → adduser → userdetails → addclient → settingstab → wallet-drawer → wallet-client → wallet → contracts-data → contracts-details → contracts-wizard → contracts → contact-groups-data → contact-groups-flow → contact-groups → comm-mkt → voice-service-data → voice-service → meta-service-data → meta-service → templates-data → templates-shared → templates-flow → templates-list → templates-wizard → templates-details → templates-ivr → templates → template-mgmt → **basic-app-data → basic-app** → app` (app.jsx last because it references every page component).
- Shared hooks are aliased per file to avoid re-declaration collisions in the shared global scope (e.g. `useStateBsa` basic-app.jsx:6, `useStateA` apps.jsx:3, `useStateCM` comm-mkt.jsx:3, `useStateTB` topbar.jsx:3). [INFERRED] because babel-standalone evaluates each script in global scope, a bare `const { useState } = React` twice would throw — this aliasing is the workaround, and also why `const` top-level names are globally visible across files (e.g. `adminDict`, `CM_META`, `APPS_BY_TAB` work without `window.` in same-scope references, though most are also explicitly window-exported).

### 4.3 CSS strategy

- 13 plain global stylesheets, one per feature, all in `<head>` with cache-buster `?v=20260703u` ([CODE] T2 Falcon Admin.html:12-24): `styles.css` (core + tokens), `addclient`, `settingstab`, `wallet`, `contracts`, `contact-groups`, `comm-mkt`, `voice-service`, `meta-service`, `templates`, `templates-ivr`, `otp-verify`, **`basic-app.css`** (142 KB, the single largest after templates.css).
- Design tokens are CSS custom properties on `:root` ([CODE] admin/styles.css:4-39): brand (`--teal:#0d3f44`, `--teal-dark`, `--teal-light:#e8f0f1`, `--accent`), neutrals (`--text`, `--text-muted`, `--border`, `--bg-page:#f5f6f7`…), status (`--green/--green-bg`, `--red/--red-bg`, `--orange/--orange-bg`, `--gray-status…`), layout (`--sidebar-w:224px`, `--sidebar-w-collapsed:68px`, `--topbar-h:72px`, `--clients-w:272px`).
- `basic-app.css` consumes tokens 494 times (`grep -c "var(--"`) and namespaces everything under `bsa-`/`.basic-app-page` ([CODE] admin/basic-app.css:1-12; it explicitly reuses `.templates-page` grid).
- **Hidden reverse dependency:** the shell's global `AskAIGlobal` panel (app.jsx:63-91) is styled with `bsa-ai-*`/`bsa-modal-*` classes that live in `basic-app.css` (29 `bsa-ai-` rules found there). The shell chrome depends on the BSA stylesheet — fine in a monolith, a layering violation for a real micro-frontend split. [INFERRED consequence flagged in §5.]
- Fonts: Google Fonts `Poppins` + `IBM Plex Sans Arabic` (:8-10). Viewport is fixed desktop: `<meta name="viewport" content="width=1440, initial-scale=1" />` (:5) — not responsive.

### 4.4 How to run it locally (recipe)

- [INFERRED from the stack above] Serve the folder over HTTP and open the admin page:
  ```
  cd "C:/Falcon/Source_of_truth_theme/latest 07062026/falcon-ux (4)"
  python -m http.server 8080     # or: npx http-server -p 8080
  # open http://localhost:8080/T2%20Falcon%20Admin.html
  ```
- **Internet access is required** at load time for unpkg (React/Babel CDN with SRI) and Google Fonts. To run fully offline you must vendor the three CDN scripts locally and rewrite the three `<script src>` tags (keeping or dropping SRI accordingly).
- **`file://` will not work reliably**: babel-standalone fetches each `src` via XHR, which browsers block cross-origin/from-disk. [INFERRED — standard babel-standalone behavior; not directly evidenced in repo.]
- No build step, no node_modules, nothing to install. First paint is slow (~230 KB basic-app.jsx alone is transpiled in-browser); this is expected for babel-standalone dev builds.
- State persistence: only `localStorage.admin_lang`; everything else resets on refresh (and always lands on Org Hierarchy).

---

## 5. MICRO-FRONTEND IMPLICATIONS — contract a real Angular Module-Federation port needs

The reference is **not** a micro-frontend — it is a monolithic multi-file React prototype glued by window globals and script order. But its seams show exactly what a genuine Module-Federation BSA remote must receive from the Falcon host shell. Everything below is [INFERRED] engineering analysis grounded in the cited code, plus [MEMORY] standing rules from the user's Falcon memory where marked.

### 5.1 Mount API (the remote's exposed surface)

Reference seam: `window.BasicApplicationPage = <component(props)>` (basic-app.jsx:2992) mounted by a shell conditional (app.jsx:347-357).
Module-Federation equivalent:
- Expose one routed entry (`exposes: { './BsaModule': ... }` or a standalone-component route set) that the host lazy-loads under a route like `/marketplace/basic-application` — replacing the reference's `activePage==='marketplace:basic'` string check. Unlike the reference, use **real router URLs** for the internal views too (`/outbox`, `/scheduled`, `/compose`, `/tx/:id`, `/tx/:id/conversation/:recipient`) since the reference's `view` state machine (basic-app.jsx:2775, 2918-2924) loses deep-linking.
- The host must remain owner of: sidebar item registration (id `marketplace:basic`, label key `bsaBasicApp`, parent `marketplace`), topbar, breadcrumb, toasts, Ask-AI entry point — the BSA only fills the content region (reference proof: BSA never touches topbar/breadcrumb, §3.3).

### 5.2 Context/inputs the host must provide (derived from the reference props + globals)

| Reference input | Evidence | MF-port equivalent |
|---|---|---|
| `tree` (org hierarchy) + `selected` + `selectNode` + `expanded`/`toggleExpand` | app.jsx:348-353; basic-app.jsx:2769 | Shared hierarchy/session service (host-owned API service per [MEMORY] feedback_api_code_stays_in_host_app — API-calling services live in the host app, remotes consume via shared injectable) |
| `t` translation dict | app.jsx:99,355 | Shared i18n service (ngx-translate/transloco or platform mechanism) with **EN+AR** assets; the port must first *extract* every `t.bsa*` fallback literal from basic-app.jsx into real keys because the dict has only 2 BSA keys today (§3.4) |
| `pushToast` | app.jsx:129-134,356 | Host toast/notification service shared as singleton |
| `lang` + RTL | app.jsx:151-154 | Host sets `dir` on `<html>`; remote must be RTL-safe (logical CSS properties / `.flip-rtl` equivalents) |
| `viewAs`/`role` selector (account-owner/node-admin/normal-user) | basic-app.jsx:2771-2772,2755-2766,2949-2955 | **Replace with real auth/PES context.** The reference encodes the rule to preserve: only Normal User composes/sends; Account Owner/Node Admin get read-only oversight of the hierarchy's transactions; Falcon admin sees all clients. Feed from the host session (OAuth2/OIDC token + PES permissions), not a dropdown |
| Seed data globals (`bsaWaSenders`, `bsaWaTemplates`, `bsaContactGroups`, `seedBsaWa*`…) | basic-app-data.jsx:225-230 | Backend endpoints (senders, templates incl. Meta approval status — note `bsaTplMeta`/`BSA_TPL_META` simulation basic-app.jsx:525-526, contact groups with column schemas, outbox/scheduled transactions with paging). [MEMORY] feedback_backend_is_sot_do_not_author_backend: backend is source of truth — flag missing endpoints, never invent them |
| Cross-app nav fns `falconGoVoiceAccount`/`falconGoMetaService` + `__vsInitial` | app.jsx:169-180; apps.jsx:519-523; voice-service.jsx:1494-1521 | Host router navigation with navigation-state (e.g. `router.navigate(['/comm/voice'], { state: { tab:'account' }})`) — kill the mutable window global |
| Ask-AI handler registration `window.falconAskAI.handler` | app.jsx:139-149; basic-app.jsx:1185-1187,1914-1916 | A host-provided "page assistant registry" service: remote registers/unregisters a context provider on activate/deactivate; topbar button asks the registry first, falls back to the generic panel |
| Shared UI (`StatusBadge`, `TablePagination`, `TplOrgTree`, `TplIvrStep2`, `DatePicker`, `BrandLogo`, `COUNTRIES`, `formatDMY`) | §1.6 citations | These map to the mandated shared component library — [MEMORY] feedback_falcon_ui_library_only_no_native + feedback_falcon_custom_library_mandatory: every UI element from falcon-ui-core custom components, no native HTML controls; library components stay presentational ([MEMORY] feedback_library_skeleton_app_api). Share as MF singletons to keep one instance |

### 5.3 Theming tokens

- The contract is the `:root` custom-property set (styles.css:4-39) + the `bsa-` namespaced consumption (494 `var(--…)` uses in basic-app.css). A port must map these to the platform's Tailwind token layer (the Falcon web platform uses Tailwind per [MEMORY] rules; label→input spacing and date format `dd-MMM-yyyy` are already platform-canonical — see `formatDMY` apps.jsx:74-88 matching [MEMORY] project_canonical_date_format_dd_mmm_yyyy).
- Fix the layering bug before splitting: shell `AskAIGlobal` uses `bsa-ai-*` classes defined in basic-app.css (§4.3) — those styles must move to the shared/shell stylesheet or the remote's absence breaks shell chrome.
- Dark mode: the reference stubs it (mood state, no effect) — ABSENT as a spec; do not claim parity requirements from it.

### 5.4 Behavioral spec worth porting exactly (the valuable IP in this reference)

- BSA grid: WhatsApp|IVR-Voice channel tabs × Outbox|Scheduled modes; columns incl. two-line date cell (`BsaDateCell` basic-app.jsx:30-34), type chips (Marketing/Utility/Authentication/Dynamic/Static, :36-44), recipients popover distinguishing contact-groups vs manual numbers (:49-118), status pills `completed / in_progress / partial / failed / canceled / scheduled / deleted` (`BSA_STATUS` :9-17), row menus, search + type filter (:2827-2830), pagination default **pageSize 10** (:2784 — matches [MEMORY] feedback_data_table_default_page_size_10).
- Compose wizard (`BsaCompose` :693-1097): sender → template cascade (type → language → name; voice is 2-tier), contact-group multi-select with per-group Destination-column + variable→column mapping (no auto-map — "the user picks", :741-748), max 3 manual recipients each with per-variable values (:750-762), immediate vs scheduled timing with Falcon date+time pickers, voice retry logic (statuses no_answer/busy…, max 3 attempts with waits, :713-722), WhatsApp phone-preview / read-only IVR canvas preview, Meta template-approval guard (`tplApproved`, :736-738), duplicate-handling + cost-estimate confirm overlay (`BsaSendConfirm` :472).
- Post-send lifecycle: `onSent` → new txn `in_progress` (or `scheduled`) prepended (:2846-2865); cancel-in-flight semantics with race handling ("too late to cancel" → completed; else canceled with partial charge, :2867-2891); scheduled delete → soft `deleted` status (:2892-2897).
- Marketplace lifecycle: the §2.4 state machine (inactive→[DoPayment/priority modal]→paid→[Activate→channel service]→active; expired→DoPayment→active; visibility lock after purchase; contract-warning on making visible).

### 5.5 What the reference gives no answer to (explicit gaps for the port)

- ABSENT: authentication/session — logout is an href to a static login page (topbar.jsx:65); no token, no user identity beyond static `t.userName`.
- ABSENT: authorization backend — roles are a client-side dropdown; PES subject/action names for BSA are not defined anywhere in this reference.
- ABSENT: any HTTP/API layer — zero fetch/XHR in app code; all data is seeds.
- ABSENT: purchase gating of the BSA nav item on marketplace status (§2.5), error states for payment, and real wallet-balance checks behind the Insufficient Balance modal.
- ABSENT: URL routing/deep-linking, responsive layout (fixed 1440 viewport), dark theme, real i18n coverage of BSA strings (§3.4).

---
*End of report.*
