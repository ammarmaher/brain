---
type: feature-spec
task: CommChannels & Services .Mng + Marketplace & Applications .Mng — perfect SoT UI/UX parity (mgmt console)
class: ui-polish
ambiguity-score: 3
verdict: proceed-with-defaults
spec-author: night-shift-ai (night-shift-feature mode)
created: 2026-05-29
purpose: "Commits the AI to rebuilding both mgmt-console service pages to pixel-match the React SoT, converge them onto ONE kind-switched component, give both an IDENTICAL card/list view toggle (32x30 icon pair), use only Falcon components, keep the working backend GET integration, and seed all status test-cases."
---

# SPEC · CommChannels & Marketplace mgmt-console SoT parity

## TL;DR
Rebuild the two management-console pages — **CommChannels & Services .Mng** and **Marketplace & Applications .Mng** — so they pixel-match the React source-of-truth (`CommMktPage` in `admin/comm-mkt.jsx` + `comm-mkt.css` + `apps.jsx`), converge them onto a single `kind`-switched shared component (mirroring the SoT), give them an **identical** card/list view toggle (the SoT `cm-view-toggle`: list-first then grid, two **32×30px** buttons, **16×16** icons, active = white bg + teal), use ONLY Falcon UI Core components, preserve the already-working backend GET integration, and seed Commerce so every status (active/expired/disable/inactive + with/without dates + pending-edit) renders for E2E.

## Why this work exists
The user reports the two pages "do not look like the source of truth." Root cause (investigation): the two pages are **architecturally divergent** — `comms-hub` delegates entirely to the shared host-shell `<app-service-pricing>` (no local view, no toggle), while `marketplace-applications` has its own local card+list+toggle built from `falcon-angular-button`. Result: the two view-toggles are **different implementations** → different size/icons, and neither matches the SoT `cm-view-toggle`. The SoT uses ONE component for both pages.

## In scope
1. A single shared mgmt presentational component (SoT `CommMktPage` analog) used by BOTH pages via a `kind: 'commChannels' | 'appsServices'` input.
2. Card view (`cm-grid` + `CMCard`) pixel-matched to SoT.
3. List view (shared `ApplicationsPage` table) pixel-matched to SoT, rendered with `falcon-angular-data-table`.
4. The **identical** card/list view toggle (`cm-view-toggle`) — same size, same icons, both pages.
5. The "Show: All/Active/Expired/Disable/Inactive" status filter (`CMShowFilter`).
6. Per-status action buttons (card) + row-action menu (list): DoPayment / Disable / Enable — backend-`allowedActions`-driven.
7. Falcon-only components; no PrimeNG, no raw widgets where a Falcon component exists.
8. Preserve & verify the existing backend GET integration (CoreGateway `commerce/Node/{nodeId}/applications` + `/comm-channels`).
9. i18n (en + ar) for all labels + the 17 `cmDesc*` descriptions.
10. Seed Commerce data covering all status test-cases for a mgmt test tenant (idempotent; do not break existing seed).
11. End-to-end runtime verification.

## Out of scope (deliberate, authority-grounded)
- **Visibility column / visibility toggle** — Falcon-only (`pes:sys.services.visibility`); mgmt = `hideVisibility=true`. [DECISION F-008]
- **Edit Price Type / Edit Price Value** — Falcon-only (`pes:sys.services.editPriceType/editPriceValue`); hidden in mgmt even though the SoT demo's list row-menu shows them. [DECISION F-008]
- **Falcon/Client perspective picker** (`CMViewAsPicker`) + left clients rail (`CMClientsPanel`) — Falcon-admin-only; mgmt is always "client" perspective (1-col, `cm-page-client`).
- The `(priceValue % 100) + 0.99` demo price hack — replaced with the real `priceValue` + period tail. [DECISION F-D1]
- Modifying the shared host-shell `<app-service-pricing>` component (used by admin-console) — mgmt gets its OWN component instead; this also avoids gap `b-6-comm-channels-unfiltered`.
- Backend handler changes (new endpoints / PES keys) — if an action endpoint is missing, FE does SoT-style optimistic local update + toast + FLAG; we do NOT invent endpoints. [DECISION F-021 / F-011]

## Falsifiable requirements

### A — Architecture convergence
A1. There is ONE shared Angular component rendering the SoT layout, consumed by BOTH `/comm-mgmt` and `/marketplace` routes, parameterized by `kind`. (Falsify: grep shows two divergent view implementations.)
A2. The `/comm-mgmt` route no longer renders `<app-service-pricing>`; it renders the new shared component. (Falsify: comms-hub template still contains `app-service-pricing`.)
A3. No PrimeNG import and no raw `<table>`/`<select>` used where a Falcon component exists, in the new component. (Falsify: grep `primeng` or bare `<table` in the new files.)

### B — View toggle (the user's explicit requirement)
B1. Both pages render the SAME toggle component instance/markup. (Falsify: the two pages' toggles differ in DOM.)
B2. The toggle is a 2-button segmented control, **list button first, grid button second**. (SoT `CMViewToggle` order.)
B3. Each toggle button is **32px wide × 30px tall**; the container has `padding:3px; gap:2px; border-radius:8px; background:neutral-hover`. (SoT `.cm-view-btn` + `.cm-view-toggle`.)
B4. Each button's icon is **16×16**: list = 3 horizontal lines + 3 leading dots; grid = 4 rounded squares (rx=1). (SoT exact SVG.)
B5. Active button = white background + teal icon + `box-shadow: 0 1px 3px rgba(13,63,68,0.08)`; inactive = transparent + muted icon. (SoT `.cm-view-btn.active`.)
B6. Default view = **grid** (cards). (SoT `useState('grid')`.) View choice persists per page (localStorage, as current marketplace does).

### C — Card view parity (`CMCard`)
C1. Cards lay out in a responsive grid `repeat(auto-fill, minmax(280px, 1fr))`, gap 20px. (SoT `.cm-grid`.)
C2. Card border-color expresses status: active `#104C54`, expired `#FF0C0C`, disable & inactive `#E8EAED`; white bg; radius 14px; padding 18px 20px; flex column gap 14px. (SoT `.cm-card*`.)
C3. Card top row = `[icon 24px][title 14/700 multi-line][status]`. Title supports the SoT multi-line displayNames (e.g. "SMS\n(Short Message Service)"). (SoT `.cm-card-top`.)
C4. Status area: active/expired → status badge pill only; inactive/disable → status badge + price line (`﷼ <value><period>`). (SoT conditional in `CMCard`.)
C5. 3-line clamped description from the per-item `cmDesc*` key. (SoT `.cm-card-desc`.)
C6. Dates band (only when firstActivation present): 3 columns First Activation / Activation / Renew, each with calendar icon + value, dashed border. (SoT `.cm-card-dates`.)
C7. Pending-edit band (when a pending price change exists): green band, 3 cols. (SoT `.cm-card-pending`.)
C8. Action buttons per status: active → `Disable` (dark); expired → `Do Payment` (teal) + `Disable` (dark); disable → `Enable` (outline-check); inactive → `Do Payment` (teal). Right-aligned, height 36px. (SoT `.cm-card-actions`.)
C9. Each service/app has the correct icon per `CM_META` (sms/whatsapp/email/voice/bell/ai/rcs/telegram/apple/send/survey/campaign/workflow/analytics/forms/reporting).

### D — List view parity (`ApplicationsPage`)
D1. List columns (mgmt, hideVisibility): Name · Price Type · Price Value · First Activation Date · Activation Date · Renew Date · Status · Action. (SoT `apps.jsx` thead, minus visibility.)
D2. Price Value renders `﷼ <value.toLocaleString()>`; empty dates render `-----`; status renders the status badge; status hidden (`-----`) when no firstActivation. (SoT `apps.jsx` tbody.)
D3. Rendered via `falcon-angular-data-table` with custom cell templates; no raw HTML table. (Falcon-only.)
D4. Footer pagination shows "Showing X - Y from Z" + page-of-total + rows-per-page (default 20). (SoT `TablePagination`.)
D5. Row-action menu (⋮) shows DoPayment/Disable/Enable per status, gated by backend `allowedActions`; NO edit-price in mgmt. [F-008]

### E — Page chrome
E1. 1-column layout (`cm-page-client`), white card container (`cm-main`, radius 14px), top bar with back button + node avatar/name + (Show filter) + (view toggle). (SoT client mode.)
E2. Show filter dropdown: All/Active/Expired/Disable/Inactive; filters both card and list. (SoT `CMShowFilter`.)
E3. Empty state when filter yields zero items ("No items match the current filter"). [F-019 show-don't-hide]

### F — Backend integration
F1. List loads from CoreGateway `commerce/Node/{nodeId}/applications` (marketplace) and `commerce/Node/{nodeId}/comm-channels` (comm-channels); nodeId from `session.tenantId || session.client_id`. (Existing services reused.)
F2. Wire DTO mapped: name, pricingType→priceType label, priceValue, firstActivationDate, activationDate, renewDate, status (FalconItemStatus), allowedActions, description/icon hints.
F3. Status mapping: Active→active, Expired→expired, Disabled→disable, InActive→inactive, PendingActivation/PendingPayment→pending (badge) + inactive card tone. [F-D2]
F4. Action click → if backend endpoint exists, call it and patch the row from the response (per the per-row-loader pattern, no full reload); else optimistic local update + toast + FLAG. [F-011/F-021]
F5. Errors surfaced per FE error contract (HTTP status routes; show localized message; inline + toast). [F-005]

### G — Seed & E2E
G1. Commerce seeded so a mgmt test tenant returns ≥8 applications and ≥9 comm-channels spanning all of {active, expired, disable, inactive} + at least one inactive/disable WITHOUT activation dates + at least one with a pending price change. Idempotent. (best-practice test coverage)
G2. E2E: serve (production build or clean dev restart + warm client-side nav per MF lessons), login as acc-owner, navigate both pages, verify: card view matches SoT, toggle flips to identical list view, Show filter works, statuses render correct tones/badges, data came from backend (network tab), zero console errors.
G3. PES gate (Gate 3): acc-owner allow, acc-admin deny, acc-user deny on `managementConsole.services.view` for BOTH routes.

## Authority context
- **Route guard PES key:** `FalconAccess.managementConsole.services.view()` (both routes — already applied). [CODE comms-hub.routes.ts / marketplace-applications.routes.ts]
- **Allowed:** acc-owner. **Denied (explicit):** acc-admin (`BuiltInRoleCatalog.cs:227` services deny), acc-user (services not granted).
- **Action PES (account scope):** `pes:acc.services.disable`, `pes:acc.services.payment` (graph wave-5). **Falcon-only:** `pes:sys.services.visibility/editPriceType/editPriceValue/payment`. → mgmt hides visibility + edit-price; renders Disable/DoPayment/Enable per backend `allowedActions`.

## pes-checks (Gate 3)
```pes-checks
accowner managementConsole.services.view comm-mgmt   allow
accowner managementConsole.services.view marketplace  allow
accadmin managementConsole.services.view comm-mgmt   deny
accadmin managementConsole.services.view marketplace  deny
accuser  managementConsole.services.view comm-mgmt   deny
accuser  managementConsole.services.view marketplace  deny
```

## Visual target
- **Primary:** React SoT (read in full this run):
  - `C:\Falcon\Source_of_truth_theme\React\new react\admin\comm-mkt.jsx` (CommMktPage, CMCard, CMViewToggle, CMShowFilter)
  - `C:\Falcon\Source_of_truth_theme\React\new react\admin\comm-mkt.css` (all `.cm-*` styles + 32×30 toggle)
  - `C:\Falcon\Source_of_truth_theme\React\new react\admin\apps.jsx` (ApplicationsPage list + StatusBadge + TablePagination usage)
  - `admin\hierarchy.jsx` (StatusBadge + TablePagination definitions), `admin\icons.jsx` (IcRiyal etc.), `admin\i18n.jsx` (all labels + cmDesc*)
- **Live:** `http://127.0.0.1:5173/T2%20Falcon%20Admin.html#commChannels=client` and `#appsServices=client` (Vite SoT; capture via Falcon Eyes/web-scrub for screenshot diff).
- **Token map (confirmed):** teal `#0d3f44`, neutral-50 `#f5f7f8`, neutral-200 `#e5e7eb`, neutral-600 `#6b7280`, neutral-900 `#1a1a1a`; card-active border `#104C54`, expired `#FF0C0C`, default border `#E8EAED`.

## Conservative defaults applied (forks resolved)
- **F-D1 (price display):** SoT card uses a demo `(priceValue % 100) + 0.99` teaser. → Show REAL `priceValue.toLocaleString()` + period tail (`/Month` etc.) for inactive/disable cards. Justification: backend returns real prices; showing fake 0.99 would be a defect; user wants backend integration "without issues."
- **F-D2 (status mapping):** PendingActivation/PendingPayment have no SoT card tone → map badge to `pending`, card border to default (`#E8EAED`). Conservative (most neutral). 
- **F-008 (Falcon-only actions):** hide visibility + edit-price in mgmt (deny wins over SoT-demo exposure).
- **F-022 (view-toggle component):** no dedicated Falcon segmented control exists → build a SHARED Falcon-styled toggle (`falcon-angular-icon` + Falcon tokens + Tailwind) matching the SoT `cm-view-toggle` pixel-spec exactly. Justification: "same size + same icons" + "perfect parity" beats forcing a mismatched `falcon-angular-button`. Both pages import the SAME toggle → guaranteed identical.
- **F-019/F-020:** empty state shown (not hidden); loading = skeleton (data-table `loading` is a hard-swap — bind only to initial-GET, never to a row mutation, per service-pricing lesson).
- **F-011/F-021:** missing action endpoint → optimistic local + toast + FLAG, never invent.
- **F-016/F-017/F-018:** Falcon components over PrimeNG; Tailwind over SCSS; `@if/@for` over `*ngIf/*ngFor`.

## Dataset gap analysis
| Axis | Status | Source / Gap |
|---|---|---|
| Authority | ✅ | `managementConsole.services.view`; acc-owner allow / acc-admin+acc-user deny (PES gate verified 2026-05-16) |
| Feature shape | ✅ | React SoT read in full (comm-mkt.jsx + apps.jsx + comm-mkt.css) |
| Validation | ✅ | No new form inputs in mgmt (edit-price is Falcon-only, hidden) |
| Entity drift | ✅ | Wire DTO known (FalconItemStatus 0-6, PricingType 1-3, allowedActions) |
| Business rules | 🟡 | `vrule:service-visibility-pricing-required` is admin/visibility (out of mgmt scope); action behavior follows SoT demo + backend allowedActions |
| Non-PES gates | ✅ | actions backend-driven via `allowedActions` (default-deny) |
| Errors | ✅ | FE error contract (`13-error-catalog/FE-CONTRACT.md`) |
| Visual target | ✅ | React SoT files (exact) + live Vite SoT |
| Pitfalls | ✅ | MF runtime fragility, ng-content+Stencil light-DOM, relative routing, data-table loading hard-swap, dev-server kill — all known from [MEMORY] |
| Test cases | ✅ | 4 statuses × 2 views × toggle × filter; seed covers |
| Runtime verification | ✅ | Docker up (commerce/gateway/identity/pes healthy); nx serve or prod build + Chrome MCP |
| Open gap surfaced | 🟡 | `gap:b-6-comm-channels-unfiltered` — avoided by giving mgmt its own component (not the shared unfiltered wrapper) |

## Verification target
- Build green: `nx build management-console` exit 0 (per wave; NEVER `--skip-nx-cache` while dev servers live — breaks MF custom-element sharing). 
- Scanner clean: `scan-authority.ps1 -CheckOnly` exit 0 after each wave.
- Backend PES verify (Gate 3): the 6-row pes-checks matrix above.
- FE runtime (Gate 5, now unblocked per VERIFICATION-STATUS 2026-05-27): Chrome MCP / production-served — both pages render SoT-parity card+list, identical toggle, real backend data, zero console errors.

## Decision log seed (append to decisions-2026-05-29.md during build)
- F-022 · view-toggle = dedicated shared Falcon-styled component (exact 32×30 SoT spec)
- F-D1 · card price = real priceValue + period (not demo 0.99 hack)
- F-008 · mgmt hides visibility + edit-price (deny wins)
- F-D2 · Pending* status → pending badge + default card tone
- F-011 · missing action endpoint → optimistic + toast + FLAG
