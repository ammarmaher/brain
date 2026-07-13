> **⚠️ PLACEMENT SUPERSEDED — USER RULING 2026-07-12.** The "internal = libs/falcon/shared-features"
> placement in this plan is OBSOLETE. Final: the basic app lives at **`apps/basic-app`** (same level as
> the consoles), consumed by both consoles via the **`@basic-app`** alias; the shared library holds only
> generic app-agnostic components; customization = generic flags (e.g. `static`), never app-named
> library artifacts. Everything else in this plan (waves, SoT parity, gates) still applies.
> See ORCHESTRATION_STATE.md "RULING 2026-07-12" row + Obsidian `20-Basic-App/Architecture Ruling 2026-07-12`.

*** PRD Understanding - Basic Send Application - REPLAN: internal placement + SoT parity + compliance audit ***

# Basic App — implementation audit map + re-created plan (2026-07-07, Revision 3 — THE ruling plan)

> Ammar's final instructions consolidated: (1) the basic app is an **INTERNAL application — a feature folder inside the existing consoles like every other feature; Module Federation gets NO new application**; (2) **zero native HTML controls, zero raw CSS/SASS colors — everything rides the Falcon theme + 218-token SSOT**; (3) the screens must be **exactly the React source of truth**; (4) this document maps the current implementation truthfully and re-creates the plan. **No code was changed while producing it.**
> Brain grounding loaded for this audit: `understanding/frontend/architecture/FEATURE_FOLDER_STRUCTURE.md` (one-file-per-type-folder rule), `TOKEN_TAXONOMY.md` (218 tokens, `falcon-tailwind-tokens.css` SSOT), `FORBIDDEN_PATTERNS_OBSERVED.md` (no *ngIf/PrimeNG/inline-style), `WRAPPER_IMPORT_DECISION_TREE.md`, standing memories (falcon-library-only · API-in-apps · page-size-10 · no-commit).

---

## A. Current-state audit map (what exists RIGHT NOW, evidence-checked 2026-07-07)

### A.1 Placement (the thing being corrected)
| Fact | State |
|---|---|
| `apps/basic-app/` standalone MF remote (:4303) | **EXISTS — untracked** (yesterday's build; runtime-verified). This is what must become INTERNAL. |
| Manifest entries `basic-app` in 4 host manifests + menu[] sidebar item | **EXIST — modified files** (to be REMOVED in M0) |
| `libs/falcon/src/shared-features/basic-send/` | ABSENT (M0 creates it — precedent siblings: `comm-mkt-view`, `user-details`) |
| Console feature folders `features/marketplace-applications/pages/basic-send/` | ABSENT in BOTH consoles (`marketplace-applications` routes are still flat — no `pages/` dir) |
| host-shell Marketplace NavItems `children[]` for Basic App | ABSENT |
| Git | branch `polishing-v0.4`; only the 6 modified + 1 untracked BSA items dirty; last commits are unrelated voice/templates merges |
| task_e08e9a6d (library data-table fix) | running in a separate session — L0/M0 note the dependency; the `whenDefined` gate in bsa-home stays until it lands |

### A.2 Compliance audit of the existing screen code (`apps/basic-app/.../bsa-home.*`)
| Rule (source) | Verdict | Evidence / fix owed |
|---|---|---|
| Zero native HTML **controls** — every UI element from falcon-ui-core (standing mandate) | ✅ PASS | grep `<input|<select|<button|<table|<textarea|<a ` in template = **0**; controls are `falcon-angular-{tabs,button,search-input,dropdown,data-table,status-badge,tag,saudi-riyal-icon}` |
| Tokens-only colors — no raw CSS color utilities (TOKEN_TAXONOMY; theme SSOT) | ❌ **1 violation** | `bg-white` at `bsa-home.component.html:25` — not one of the 218 tokens. Fix in M0: drop it (the data-table + panel border supply the surface, voice-records-tab precedent) or use the falcon surface token if the panel truly needs a fill |
| No raw CSS/SCSS files for feature chrome (styles.scss rule) | ✅ PASS | component has NO .scss/.css; layout via token-mapped Tailwind utilities (`border-falcon-neutral-200`, `text-falcon-neutral-*`, `px-4.5`, `rounded-md`, `text-xs` — all declared token families); remaining utilities are structural (flex/gap/w-*) which the platform pattern allows (voice precedent) |
| No inline `style=""` literals (FORBIDDEN_PATTERNS §4) | ✅ PASS | only `[style.--falcon-table-*]` CSS-variable bindings — the sanctioned token re-pointing pattern (voice-records-tab precedent) |
| New control flow only (no *ngIf/*ngFor) | ✅ PASS | `@if`/`@let` throughout |
| No PrimeNG/PrimeIcons | ✅ PASS | falcon-icon classes only |
| Feature folder pattern — `models/models.ts`, `services/services.ts`, one file per type-folder (FEATURE_FOLDER_STRUCTURE + memory rule) | ⚠️ **DEVIATION** | current: `models/bsa.models.ts` + `data/bsa-mock-data.ts`. M0 conforms: `models/models.ts`; mock seeds colocated under `services/` (`mock-transactions.ts` — the `mock-tree.ts` precedent); future HTTP adapter = `services/services.ts` per console |
| API services live in apps, not libs (standing rule) | ✅ by design | mock service is presentational-safe; real `BsaApi` adapters are planned per-console (SystemGateway/CoreGateway) |
| Data table page size 10 · dd-MMM-yyyy dates · en+ar lockstep | ✅ PASS | pageSize 10; dates rendered as dd-MMM-yyyy two-line cells; `basicApp` namespace present in both en.json + ar.json |
| Zoneless/signals/OnPush | ✅ PASS | signals + computed, OnPush, afterNextRender |

### A.3 Source-of-truth parity map — implemented vs `basic-app.jsx` (SoT) per screen
| SoT screen (REACT_REFERENCE §1) | Status in our code | Deltas owed to "exactly the SoT" |
|---|---|---|
| S1/S2 landing: channel tabs · Outbox/Scheduled · toolbar · grid | **PARTIAL (built, verified)** | (1) toolbar lacks the **date-range filter** (SoT chip is decorative; PRD needs it REAL → `falcon-datetime-picker` range N2); (2) **status-pill palette approximate** — platform severities vs SoT exact hex table (E1 vocab extension; e.g. In Progress must read blue `#e8f1fe/#1d5fc4`, Partially Processed orange `#fff4e6/#c46a00`); (3) recipients **"+N" must open the popover** listing all recipients (N1) — today it is a static tag; (4) row menu shows all actions then blocks — SoT **hides** non-applicable items (menu API already supports conditional lists — refine in M1); (5) Send button placement: SoT puts it right-aligned in the panel header row; ours sits beside the channel tabs — align in M1; (6) SoT title strip inside panel ("Outbox"/"Scheduled" label) — add in M1; (7) per-status empty-state copy (failed vs plain) — M1 |
| S0 perspective picker + org-tree rail + VIEWING-AS chip | **CORRECTLY NOT PORTED** | demo chrome; real role comes from session/PES (do-NOT-port list §6) — no action |
| S3 Send Whatsapp Message (3 sections, cascade, mapping grid, manual ≤3, preview, confirm+quote) | **MISSING** | wave F2 (function specs in BUILD_PLAN_DETAILED Part C·F2) |
| S3 voice variant (2-tier, retry ≤3, IVR canvas preview) | **MISSING** | F5 (+E5 canvas promotion) |
| S4 WA details (banners, 6-rate bars + avg delivery time, cost donut+by-type, recipients grid, phone preview, exports, cancel race dialog) | **MISSING** | F3 (+N3 progress, N4 charts, N5/E6 phone preview) |
| S5 voice details (call stats, cost by destination/attempt/type, attempts expansion, canvas+transcript, recording playback) | **MISSING** | F6 (C2 ruling adds Send Date + Message Cost columns) |
| S6 conversation (info panel, 11 message kinds, search, 24h countdown, composer, template-after-expiry) | **MISSING** | F7 (+N6 chat kit, N9 emoji, N10 countdown; C8 chaining) |
| S7/S8 voice conversation (IVR walk, DTMF, cross-channel footer) | **MISSING** | F8 (AI-handoff demo stays cut) |
| S8-S10 dialogs (cancel race-aware, delete, confirm-send) | Delete/cancel copy partially present (F1 toasts only) | real dialogs land with F2/F3/F4 via `FalconConfirmService` (confirm-dialog wrapper is dormant — never use it) |

**Bottom line:** what exists is a faithful, compliant **landing screen** in the **wrong placement** with **one token violation**, **one folder-structure deviation**, and a short list of SoT visual deltas; all remaining SoT screens are un-built and already function-spec'd.

---

## B. The re-created plan (waves; every wave ends at the compliance gate in §C)

### M0 — Internalization migration — ✅ EXECUTED + RUNTIME-VERIFIED 2026-07-07

> **Naming convention (user mandate: understandable names — ONE stem everywhere):**
> `basic-app` (folders/routes/alias) · `BasicApp*` (classes/types: BasicAppHomeComponent, BasicAppTransaction, BasicAppTransactionStatus…) · `BASIC_APP_*` (constants: BASIC_APP_STATUS_META, BASIC_APP_WHATSAPP_OUTBOX…) · `basicApp.*` (i18n) · `app-basic-app-*` (selectors) · future PES `sys/acc.basic-app`. NO "bsa"/"basic-send" abbreviations anywhere in code.
>
> **As executed:** shared feature at `libs/falcon/src/shared-features/basic-app/` (`@falcon/basic-app`; index exports component+models+seeds) with `basic-app-home/` + `models/models.ts` + `services/mock-transactions.ts` (folder rule conformed); `bg-white` violation removed (panel is theme-neutral, table owns its surface). Both consoles restructured `marketplace-applications.routes.ts` flat→parent+children with a STATIC `component: BasicAppHomeComponent` child (module-boundaries forbids lazy-importing the eager-shared falcon scope; the feature file is already the lazy chunk). Mgmt keeps the acc-owner `marketplace.view()` gate ON THE INDEX CHILD only — the basic-app child is ungated until W-PES, preserving BR-BSA-02 Normal-User reachability. host-shell: `children:[Basic App]` on BOTH Marketplace NavItems (slug parity held automatically — the real feature slug is **`marketplace`**, constants-driven). Standalone remote fully removed (4 manifests, menu, apps/basic-app deleted, launch entry gone; live-served manifest re-verified = consoles only). Spec relocated to `apps/admin-console/tests/basic-app-home.models.spec.ts` (libs/falcon has NO test runner — consumer-side spec via the public alias; 7/7 green).
> **Runtime proof (real sessions, local stack):** sysadmin → admin sidebar child visible → `#/admin-console/marketplace/basic-app` renders grid ✓ · accowner → `#/management-console/marketplace/basic-app` ✓ · **accuser (Normal User) reaches the route with full grid** (menu hidden by the pre-existing owner-gate — W-PES item) ✓ · pre-existing failures proven at HEAD (contracts spec resolve error; admin lint debt 251@HEAD) — not regressions. Parallel session task_e08e9a6d landed the data-table first-paint fix on this tree during M0 (its wrapper edit + mgmt spec); the whenDefined gate in basic-app-home stays until a wave touches that file.

#### Original M0 step list (for the record)
1. Create `libs/falcon/src/shared-features/basic-send/` (+ `index.ts`, tsconfig alias `@falcon/basic-send` — mimic `@falcon/comm-mkt-view` mapping). Move the screen: `bsa-home.component.{ts,html}` + tests; **conform structure while moving**: `models/models.ts` (from bsa.models.ts), mock seeds → `services/mock-transactions.ts`; define `BSA_API` token + `BsaApi` interface + `BsaMockApiService` here (presentational-safe).
2. **Fix the token violation** during the move: remove `bg-white` (or apply the falcon surface token if the panel needs an explicit fill under dark mode — decide against the theme, not by eye).
3. Console wiring (Recipe A, file:line in FE_WORKSPACE_WIRING): per console `features/marketplace-applications/pages/basic-send/` = `basic-send.routes.ts` (child `basic-send`, breadcrumb 'Basic App'), `basic-send.permissions.ts` (denied-baseline; scope `'sys'` admin / `'acc'` mgmt), `providers.ts` (`BSA_API → BsaMockApiService` until B-waves); restructure both `marketplace-applications.routes.ts` flat→parent+children (comm-channels precedent); mgmt parent keeps `shellAccessGuard` + `data.access`.
4. host-shell sidebar: `children: [{ label 'Basic App' (basicApp.nav), path <PATH_MARKETPLACE_APPLICATIONS>/basic-send }]` on BOTH Marketplace NavItems (admin :344-350 / mgmt :377-383 precedents; slug parity = load-bearing).
5. **Remove the standalone remote**: `basic-app` entries out of all 4 manifests; delete `apps/basic-app/`; drop the `falcon-basic-app` launch.json entry; `npm run list:remotes` must list ONLY the two consoles. Shared i18n keys stay.
6. Gate + runtime proof in BOTH consoles under host-shell (Marketplace & Applications .Mng → Basic App → grids render; zero console errors).

### M1 — Landing-screen exact-SoT parity pass (after M0; small-medium)
Close every A.3 row-1 delta: panel title strip · Send button placement · per-status-filtered row menus · real date-range filter (needs **N2** falcon-datetime-picker range mode) · recipients **N1** popover · **E1** status-badge BSA vocab with the SoT hex table (REACT_REFERENCE §2.3 is the color SoT — mapped onto tokens, not literals) · empty-state copy. Exit = **Falcon Eyes run ≥90% parity** against `:4173` SoT landing (both tabs × both modes), evidence bundle saved.

### F2 → F8 — remaining SoT screens (function-level specs unchanged in `BUILD_PLAN_DETAILED.md` Part C; routes re-based)
Order: F2 WA compose (N1,N2,N7,E4,E7) → F3 WA details (N3,N4) → F4 scheduled edit/delete → F5 voice compose (E5) → F6 voice details → F7 conversation (N6,N9,N10) → F8 voice conversation. Each wave: mock-first behind `BSA_API`, per-wave Falcon Eyes parity vs the corresponding SoT screen, and the §C gate. Routes now `…/marketplace-applications/basic-send/{send/whatsapp | send/voice | :txnId | :txnId/conversation/:rid}` in both consoles.

### W-PES · W-DARK · L0-L4 library track — unchanged from BUILD_PLAN_DETAILED (Part A/W-waves); L-track stays independent of placement (and note: internal placement makes the MF-singleton constraint moot for basic-app — it now consumes the libs exactly like every console feature).

### Dependency line
`task_e08e9a6d → (removes whenDefined gate)` · `M0 → M1 → F2 → {F3, F4} → F5 → F6` · `F7 (after F2) → F8` · `W-PES after backend B0` · `B-couplings per wave as before`.

---

## C. The always-on compliance gate (run EVERY wave — this encodes Ammar's mandate)
1. `grep -E "<(input|select|button|table|textarea|a )" **/*.html` inside the feature = 0 (native controls forbidden; falcon-ui-core only).
2. No non-token color/effect utilities: audit against TOKEN_TAXONOMY (218 tokens) — `bg-white|bg-black|text-white|bg-gray-*|text-gray-*|#hex|shadow-(non-falcon)` = 0; only `*-falcon-*` color/shadow tokens + structural utilities; component-scoped `--falcon-<comp>-*` re-pointing only via `[style.--…]` bindings.
3. No `.scss/.css` files for feature chrome; no inline `style=""` literals; `@if/@for` only; no PrimeNG/PrimeIcons.
4. Folder pattern: `models/models.ts` · `services/services.ts` (+ named signal-state/mock exceptions) · routes file per feature; shared presentational code in `@falcon/basic-send`, HTTP adapters in the console apps.
5. Data-table page size 10 · dd-MMM-yyyy · en+ar keys lockstep · PES fail-closed flags on every action surface.
6. Build+test+lint both consoles green · zero console errors on click-through · Falcon Eyes parity vs SoT for any visual wave.

---

## D. Status of prior plan docs
`BUILD_PLAN_DETAILED.md` remains the **function-level specification** (Part A library waves · Part B communication · Part C F-wave function signatures) — its Revision-2 M0 is superseded by THIS document's M0/M1 (internal placement + compliance + parity emphasis). `IMPLEMENTATION_PLAN.md` D-1 history: D-1a lib recommendation → user Recipe-B ruling (executed as apps/basic-app) → **FINAL user ruling 2026-07-07: internal in-console feature (this doc)**. The apps/basic-app remote is scheduled for removal in M0 — its build proved the screen code, the library usage, and surfaced 2 platform bugs; nothing is wasted (the screen moves, the scaffold goes).
