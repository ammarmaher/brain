*** PRD Understanding - Basic Send Application - ARCHITECTURE_FRONTEND (deep design) ***

# BSA Frontend Architecture — deep design (2026-07-06)

> Status: **PROPOSED**. Grounded in three evidence files in this folder: `FE_WORKSPACE_WIRING.md` (repo-reality wiring, file:line recipes), `FE_LIBRARY_COVERAGE.md` (113-element coverage matrix vs falcon-ui-core), `REACT_REFERENCE.md` (visual SoT + do-NOT-port list). Business anchors BR-BSA-*/C-* rulings as in the backend doc. Consumes the API surface of `ARCHITECTURE_BACKEND.md` §5.

---

## 1. Placement decision — D-1 RULED BY USER 2026-07-07: Recipe B standalone remote (supersedes D-1a below)

> **Executed:** `apps/basic-app` Angular 21 MF remote on **port 4303**, registered in all 4 host manifests (menu-driven sidebar item 'Basic App', no host code edits), sharing @falcon/@falcon-sdk/@falcon-ui-core as eager singletons; Waves F0+F1 built, tested (7/7), linted, and runtime-verified inside host-shell (grids + tab/column swaps + zero console errors). Two platform findings fixed/worked around: provideAnimationsAsync NG0201 (management-console pattern adopted) and the data-table first-paint syncProps hole (whenDefined gate; library fix task spawned). The D-1a analysis below is retained for the record.

### D-1a analysis (superseded by the user ruling)

**Repo fact (FE_WORKSPACE_WIRING §2-3):** the only Module-Federation remotes are the two consoles themselves; host-shell loads them from a JSON manifest. Every in-console feature — including the direct precedent (Meta/Voice/AI under CommChannels, 2026-06-30) — is a **lazy route folder inside each console app + a hardcoded sidebar child in host-shell's `layout.component.ts`**. A new true remote would mount at a top-level host route **outside** both consoles, contradicting the PRD's "submenu under Marketplace & Applications .Mng" (BR-BSA-04/05).

**Decision D-1a (recommended):** BSA UI = **new dedicated NX library project `libs/basic-send`** (own `project.json`, build/test targets — this is the "separate frontend project") holding ALL screens as presentational/feature components behind **injected ports**, consumed by BOTH consoles through thin per-console adapters (routes + API services + permissions), wired per **Recipe A** in `FE_WORKSPACE_WIRING.md` (10 steps, every step citing its precedent file:line).
- Satisfies: user constraint "FE in a different project" ✓ · PRD "opens inside our applications" ✓ · standing rules "API-calling services live in host apps, not libs" + "library components are presentational" ✓ (the lib exposes a `BSA_API_PORT` injection token; each console provides its implementation over `HttpService` + `useGateway()` — the `USER_DETAILS_GATEWAY` port precedent, FE_WORKSPACE_WIRING step 8).
- **D-1b fallback:** the existing lighter convention `libs/falcon/src/shared-features/basic-send/` (same code shape, not a separate NX project). Choose if workspace-config overhead is unwanted.
- **Recipe B (true MF remote `basic-send-app`) — REJECTED for v1**: documented fully in FE_WORKSPACE_WIRING (8 steps incl. the 4-manifest entries + `microapp.basic-send-app` PES key) — keep only if BSA must someday deploy independently; it would live OUTSIDE the consoles.

```
libs/basic-send  (NEW NX lib project — screens, state, models, no HTTP)
      ▲ imported lazily by
apps/admin-console  features/marketplace-applications/pages/basic-send/   (Falcon view, SystemGateway)
apps/management-console  features/marketplace-applications/pages/basic-send/ (client view, CoreGateway)
      ▲ sidebar children "Basic Send Application" added in
apps/host-shell  layout.component.ts (Marketplace & Applications .Mng → children[]; slug parity is load-bearing)
```

## 2. Project & folder structure

```
libs/basic-send/src/
  index.ts                          // public API: routes factory + ports
  lib/
    ports/                          // BSA_API_PORT (all §5.1 backend endpoints as an interface),
                                    // BSA_SESSION_PORT (userId, tenantId, role flags), BSA_TOAST_PORT
    models/                         // DTO mirrors of ARCHITECTURE_BACKEND §5 (TransactionListItem, ComposeTransactionRequest,
                                    // RecipientResult, TransactionStats, ChannelState, ConversationDto …) + status enums (FSM vocab)
    state/                          // signal stores: TransactionsStore (grid), ComposeStore, DetailsStore, ConversationStore
    screens/
      bsa-home/                     // S1/S2: channel tabs + outbox/scheduled grids + toolbar + gating banner
      compose-whatsapp/             // S3 WA (3 sections)
      compose-voice/                // S3 voice (retry block + IVR preview)
      details-whatsapp/             // S4
      details-voice/                // S5 (attempts expansion + canvas + transcript)
      conversation/                 // S6 (thread, window, composer)  [wave F7]
      voice-conversation/           // S8 [wave F8]
    widgets/                        // BSA-scoped compositions: recipients-cell(+N popover), mapping-grid,
                                    // manual-recipients-grid, variables-chips, summary-strip, confirm-send-dialog,
                                    // status-pill(vocab maps), stat-bars, cost-breakdown, phone-preview(frame+bubble),
                                    // ivr-canvas-panel, countdown, banners
    validation/                     // E.164 normalize (D-2), mapping-completeness, manual-vars, schedule>now
    i18n-keys.ts                    // typed key constants under the `basicSend.` namespace
apps/<console>/…/pages/basic-send/
  basic-send.routes.ts              // child routes: '', 'send/wa', 'send/voice', ':id', ':id/conversation/:rid'
  basic-send-api.service.ts         // implements BSA_API_PORT via HttpService + useGateway()  (per-console)
  basic-send.permissions.ts         // denied-baseline + resolveFlags (scope 'sys' | 'acc') — voice-service precedent
  providers.ts                      // { provide: BSA_API_PORT, useClass: BasicSendApiService } …
```
Routing = plain Angular lazy routes (consoles expose routes, never components — FE_WORKSPACE_WIRING §Sanity). URL state (deep-linkable, unlike the React reference's in-memory `view`): `…/marketplace-applications/basic-send?channel=whatsapp&mode=outbox` · `/send/wa` · `/{txnId}` · `/{txnId}/conversation/{recipientId}`. Breadcrumbs via `data.breadcrumb` (the only registry).

## 3. Wiring (Recipe A distilled — full file:line list in FE_WORKSPACE_WIRING)
1. PES registry block `basicSend:` + `basicSendQuery(action, scope)` factory in `falcon-access.registry.ts` (mimic voiceRecord :62-74/:369-376) → resources `sys.basic-send` / `acc.basic-send` (backend seeds §6 of ARCHITECTURE_BACKEND — flagged, never FE-authored).
2-5. Feature folders + parent/children route restructuring of `marketplace-applications.routes.ts` in BOTH consoles (comm-channels-services.routes.ts precedent; mgmt keeps `shellAccessGuard` + `data.access`).
6. host-shell `layout.component.ts` Marketplace NavItems gain `children:[{ label 'Basic Send Application', path '<PATH>/basic-send' }]` (admin :344-350 / mgmt :377-383 precedents; slug MUST equal route slug — dead-click trap).
7. i18n: `basicSend` namespace in the ONE shared `libs/falcon/src/language/i18n/en.json` + `ar.json` (lockstep rule).
8. API services per console (§2 above); admin→SystemGateway, mgmt→CoreGateway are the app defaults.
9-10. Vitest colocated `__tests__/` + build gates; UI exclusively `@falcon/ui-core/angular` + tokens (per-app tailwind.css already `@source "./"`).

**Menu visibility (BR-BSA-04):** submenu renders when (a) PES `acc.basic-send view` allows AND (b) app subscription Active (`GET /bsa/channel-state`.appActive or Provisioning read). The sidebar is hardcoded today — gate via the NavItem `access:` hook (mgmt precedent :368/:412); dynamic creation post-purchase = refresh of resolved flags (the registry is fail-closed).

## 4. Screen architecture × library coverage (verdicts from FE_LIBRARY_COVERAGE — 113 rows: 74 COVERED / 16 PARTIAL / 23 MISSING → 8 real builds)

| Screen | Composition (Falcon components + BSA widgets) | Coverage notes (traps bolded) |
|---|---|---|
| **bsa-home** (S1/S2) | `falcon-tabs` (channel + sub-tabs) · `falcon-data-table` (page size 10, `rowClick`, header/cell templates) · `falcon-search-input` · `falcon-dropdown` (type filter) · **N2** datetime/range for the REAL date filter (E3: date-picker lacks range) · status-pill widget over `falcon-badge` (E1: 3 vocab maps — 7 txn / 7 WA / 11 voice) · row menu via `falcon-menu` (E2: danger item + disabled-reason tooltip) · recipients-cell widget over **N1 falcon-popover** · `falcon-empty-state` · `falcon-paginator` · gating banner **N7** | Grid columns per BR-53/54 + C2 ruling. **`falcon-confirm-dialog` is DORMANT — use `FalconConfirmService`→popup** for cancel/delete confirms. **Don't use `[loading]` hard swap — `busyRowIds`**. |
| **compose-whatsapp** (S3) | 3 `falcon-card` columns; cascade `falcon-dropdown`s (disabled-until-parent — pattern k exists, contract-details precedent) · variables-chips (`falcon-tag`) · Meta-status warning **N7** · delivery `falcon-view-toggle` (h ✔; E8 CVA note) · **N2 falcon-datetime-picker** (schedule; **date-picker has NO time + no CVA**) · CG picker: **N1 popover** + `falcon-tabs` (Created by me/Shared with me) + `falcon-search-input` · **N8 mapping-grid** (data-table `headerTemplate` + `falcon-dropdown` per column + E7 pinned "Not mapped" option + progress `falcon-tag`) · manual grid (`falcon-input` + E.164 validation D-2) · phone preview **E6+N5** (promote `app-whatsapp-preview` to lib + device-frame wrapper) · summary-strip widget · confirm dialog (`falcon-dialog` + `falcon-toggle` duplicates + quote from API #3) | Send gating = `canSend` per BR-31/32/33 + C3 ruling (manual vars enforced at send). Cascade resets per REACT_REFERENCE §4.1. |
| **compose-voice** (S3v) | Same skeleton; category 2-tier; retry block: `falcon-toggle` + **E4 checkbox-group chip variant** (4 trigger statuses) + attempt rows (`falcon-input-number` 1..1440 + add/remove, ≤3) · IVR preview via **E5** promoted `IvrFlowViewComponent` (read-only canvas EXISTS app-level in templates-wizard/ivr — promote to lib, do NOT rebuild) | Retry config PERSISTS (reference dropped it — stub #6). |
| **details-whatsapp** (S4) | Banners **N7** (+ live progress **N3 falcon-progress-bar**) · KPI `falcon-card`s · **N4a falcon-bar-chart** (6 rates + Avg Delivery Time displayed — C13) · **N4b falcon-donut-chart** (cost by destination) + by-template-type (C10) · recipients `falcon-data-table` (7 statuses incl. Failed — C1) · per-recipient phone preview (E6/N5) · exports via `falcon-button` → API #10 (real files) · Ask-AI drawer (`falcon-drawer`) **only if D-10 = ship** | **No chart component exists anywhere in the platform — N4 is a hard prerequisite for F3.** |
| **details-voice** (S5) | Call-stat tiles + **N4a/b** (+ by-attempt rows, by-IVR-type C10) · recipients table with **row expansion (EXISTS: `expandedRowId` + shadow rows)** for the attempts sub-table (BR-66) · ADD Send Date + Message Cost columns (C2) · IVR canvas **E5** + transcript panel + call description · recorded-call playback via **existing `falcon-angular-audio-waveform-player`** (reference modal was orphaned — design fresh around the real player) | Audio trio (player/waveform/recorder) already in falcon-ui-core — voice-records era, missing from the 62-dossier KB. |
| **conversation** (S6) | **N6 falcon-chat-thread kit** (bubbles per 11 kinds incl. ADD Video/Location/Contacts/Interactive — PRD-only #14; ticks; reactions; reply-quote; day dividers; in-thread search w/ highlight+prev/next; composer slot) · **N10 falcon-countdown** driven by server `windowExpiresAtUtc` (LIVE — reference was static) · message-info side panel (`falcon-card`) · **N9 falcon-emoji-picker** · attachments via existing uploader components · voice-note record/play via **existing audio recorder/waveform** (WhatsApp-style 1:1 per its own header) · expired-state banner **N7** + "Send New Message Template" → compose fromConversation route → staged card → NEW chained record (C8) | The N6 kit is the largest new build (L) and is REUSED by S8 + AI surfaces. |
| **voice-conversation** (S8) | N6 thread reskinned for IVR walk (voice-note bubbles = audio player, transcript blocks, DTMF keycaps, ended notes) + cross-channel footer buttons → compose routes | AI-handoff demo: CUT from v1 (code-only #14) unless product overrules. |

### 4.1 New-component backlog (build order & wave placement)
| # | Component | Size | Needed by wave | Reuse beyond BSA |
|---|---|---|---|---|
| N1 | `falcon-popover` (anchored, flip-aware, outside-close) | M | F1 | High (any "+N", pickers) |
| N7 | `falcon-inline-banner` (info/warn/error/status tints) | S | F1 | High |
| N2 | `falcon-datetime-picker` (+ range mode for filters; fixes E3/G2/G3; add CVA) | M | F1 (range) / F2 (schedule) | High |
| N8 | `falcon-column-mapping-grid` (shared-feature over data-table headerTemplate + E7 pinned option) | M | F2 | Medium (import/mapping flows) |
| N5 | `falcon-device-frame` (+ E6 promote `app-whatsapp-preview` to lib) | S | F2 | Medium |
| N3 | `falcon-progress-bar` | S | F3 | High |
| N4a/b | `falcon-bar-chart` + `falcon-donut-chart` (SVG, token-colored, no external lib per no-external-dependency rule) | M | F3 | High (dashboards) |
| E5 | Promote `IvrFlowViewComponent` templates-wizard/ivr → lib | M | F5 | Voice/templates features |
| N6 | `falcon-chat-thread` kit | L | F7 | Voice conv, AI surfaces |
| N9 | `falcon-emoji-picker` · N10 `falcon-countdown` | S·S | F7 | Medium |
Extensions: E1 status-badge vocab maps (F1) · E2 menu danger/disabled-hint (F1) · E4 checkbox chips (F5) · E7 dropdown pinned option (F2) · E8 view-toggle CVA (F2).

## 5. State & data flow
- **Signal stores per screen** (zoneless Angular 21): `TransactionsStore` (grid query state ⇄ URL params; 15s poll while any row `in_progress`), `DetailsStore` (5s poll while `in_progress` — BR-46 live counters; stop on terminal status), `ComposeStore` (cascade + mapping + manual + timing + retry; derived `canSend`; quote call on confirm-open), `ConversationStore` (thread pages, `windowExpiresAtUtc` countdown computed client-side from server clock delta, composer state). SignalR upgrade path noted in backend §11 — stores isolate the transport.
- **Ports, not HTTP, in the lib**: `BSA_API_PORT` interface mirrors backend §5.1 (19 calls) + channel-state; console services implement it (admin=SystemGateway/FalconOnly twin endpoints, mgmt=CoreGateway). Falcon (admin) view is read/review: same screens with send/cancel/edit hidden by PES flags (§6) — Q-BSA-01/02 defaults until product rules.
- **Channel gating** (BR-08..14): `channel-state` fetched at shell entry + on channel-tab switch; drives Send visibility, read-only banner (both channels down), and disabled reasons — server re-validates regardless (never trust FE gating).
- **Error mapping**: `FalconKeys.Error.Bsa*` → i18n keys `basicSend.errors.*`; field-detailed `BsaMappingIncomplete` renders inline on the mapping grid.

## 6. PES & session
`basic-send.permissions.ts` per console (denied-baseline + `AccessControlFacade.resolveFlags`, fail-closed): flags `canView, canSend, canSchedule, canCancel, canEdit, canDelete, canExport, canConverse` from `acc.basic-send` / `sys.basic-send` actions (+ creator-scoped rules server-side). Route guards: mgmt parent keeps `shellAccessGuard` + `data.access = basicSendQuery('view','acc')`. The React "VIEWING AS" dropdown is demo chrome — real role comes from session; do NOT port.

## 7. i18n, RTL, theming
- Namespace `basicSend.*` in the shared en/ar.json (lockstep); status labels via vocab maps (`basicSend.status.<code>`); dd-MMM-yyyy display rule (platform canonical date format) — reconcile with REACT_REFERENCE's `DD-MMM-YYYY · hh:mm am/pm` two-line cell (keep, it matches).
- RTL: logical properties (reference CSS already logical-heavy); popover/canvas position math must be direction-aware (reference's portal math is LTR-tuned — REACT_REFERENCE §2.3).
- Tokens: bsa-* palette table (status pills, chart gradients, destination colors — REACT_REFERENCE §2.3) mapped onto `falcon-tailwind-tokens.css` custom properties; **dark mode: the platform ships `.app-dark` + ThemeService but the React reference has NO dark styles — BSA must define dark-token values (NEW requirement, absent from PRD; flag to design).**

## 8. Quality gates & testing
- Per wave: `nx test admin-console` / `management-console` (vitest, colocated `__tests__` — runner is FIXED per repo evidence; the 2026-05-19 broken-runner memory is stale) + `nx test basic-send` (new lib) + both console builds + lint.
- **Visual parity protocol**: serve the React SoT (`python -m http.server 4173`) side-by-side; Falcon Eyes runs per screen (≥90% parity threshold rule); the status-pill hex table + layout skeletons in REACT_REFERENCE §2.3 are the objective color/layout SoT.
- E2E: none exists platform-wide — BSA acceptance via ammar-qa-web browser runs against the local stack (compose→send→cancel→details→conversation happy paths + gating matrices), evidence-bundled.
- Do-NOT-port checklist enforced in review: the 10 dead/orphaned reference paths + demo chrome (perspective picker, role dropdown, ticker, Simulate expiry) — REACT_REFERENCE §6 items 28-36.

## 9. Sequencing (unchanged waves, re-grounded)
F0 = lib scaffold + Recipe A steps 1-8 + N1/N7/E1/E2 → F1 home grids (needs backend #1/#16) → F2 WA compose (+N2/N8/N5/E6/E7; backend #2/#3/#11-15) → F3 WA details (+N3/N4; backend #4-7/#10) → F4 scheduled edit/delete (backend #8/#9) → F5 voice compose (+E4/E5) → F6 voice details → F7 conversation (+N6/N9/N10; backend #17-19) → F8 voice conversation → F9 marketplace purchase surface polish. Component backlog items land in the wave that first needs them; every N-component is a lib-level deliverable reusable platform-wide.
