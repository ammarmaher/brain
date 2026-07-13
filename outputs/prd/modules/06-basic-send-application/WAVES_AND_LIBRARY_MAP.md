*** PRD Understanding - Basic Send Application - WAVES_AND_LIBRARY_MAP (all waves · SoT→library map · no-regression customization policy) ***

# Basic App — all waves + source-of-truth → falcon-library map (2026-07-07)

> Companion to `REPLAN_INTERNAL_SOT_PARITY.md` (authoritative wave plan) and `FE_LIBRARY_COVERAGE.md` (the full 113-row element-by-element matrix, evidence-cited). This file answers three standing questions in one place: **(1) what are ALL the waves, (2) which falcon-library component implements every SoT page/element, (3) how do we customize the library without causing regressions.**
> SoT = `falcon-ux (4)/admin/basic-app.jsx` (screens S0-S10 per `REACT_REFERENCE.md`). Library = falcon-ui-core (69 wrappers) + libs/falcon shared-ui/shared-features. Coverage headline: **113 SoT elements → 74 COVERED · 16 PARTIAL (extensions E1-E8) · 23 MISSING (collapse to 8 new components N1-N10)**. Nothing in any BSA screen is native HTML controls or raw CSS — everything is a falcon component, a token, or a sanctioned composition.

---

## 1. ALL WAVES (complete list, every track)

| # | Wave | Track | What ships | Library work inside | Status |
|---|---|---|---|---|---|
| 1 | **M0 — internalize** | FE placement | Screen moves to `@falcon/basic-send` shared-feature + thin wiring in BOTH consoles under Marketplace & Applications .Mng; standalone remote REMOVED (manifests ×4, menu, apps/basic-app, launch entry); fixes `bg-white` violation + folder pattern (`models/models.ts`, seeds → `services/`) | — | ⏳ next (on "go") |
| 2 | **M1 — landing exact-SoT parity** | FE | Closes the 7 landing deltas: panel title strip · Send-button placement · per-status-hidden row menus · REAL date-range filter · recipients +N popover · exact pill palette · empty-state copy. Exit: Falcon Eyes ≥90% vs :4173 (both tabs, both modes) | **N1** popover · **E1** status-badge vocab · **E2** menu danger/hint · **E3** date-picker range | ⏳ |
| 3 | **F2 — Send Whatsapp Message** | FE | 3-section compose: cascade (Sender→Category→Language→Template), variables chips, Meta-status warning, CG picker (Created-by-me/Shared), mapping grid w/ move-semantics, manual ≤3 (E.164), phone preview w/ live substitution, Immediate/Schedule, confirm overlay (server quote + duplicates toggle), summary strip | **N2** datetime-picker · **N7** inline-banner · **N8** mapping-grid · **N5+E6** device-frame + WA-preview promotion · **E4** checkbox chips · **E7** dropdown pinned option | ⏳ |
| 4 | **F3 — WA details + cancel** | FE | Banners (live progress), 6-rate bars + avg delivery time, cost donut + by-template-type, recipients grid (7 statuses), per-recipient phone preview, race-aware cancel, REAL exports | **N3** progress-bar · **N4a/b** bar + donut charts | ⏳ |
| 5 | **F4 — scheduled lifecycle** | FE | Frozen scheduled details (zeros, Pending, 0 SAR), TRUE edit (full prefill, same TXN id, re-confirm), delete w/ exact PRD copy (row stays Deleted) | — (reuses F2/F3 pieces) | ⏳ |
| 6 | **F5 — Send Voice IVR Message** | FE | 2-tier cascade (Dynamic/Static), retry logic (≤3 attempts, 4 trigger statuses, waits 1..1440 — PERSISTED), IVR canvas preview w/ node-tap playback, voice quote | **E5** IVR-canvas promotion to lib · E4 chips reuse | ⏳ |
| 7 | **F6 — voice details** | FE | Call stats (+IVR completion, avg duration), cost by destination/attempt/IVR-type, expandable attempts sub-table, +Send Date +Message Cost columns (C2), canvas+transcript+call description, recorded-call playback (audio components) | — (charts + canvas reused) | ⏳ |
| 8 | **F7 — WA conversation + 24h window** | FE | Msg-info panel, thread (11 message kinds incl. the 4 the SoT lacked), search, LIVE server-driven countdown, reactions/reply, composer (text/emoji/attach/voice-record/template), template-after-expiry → NEW chained record | **N6** chat-thread kit · **N9** emoji-picker · **N10** countdown | ⏳ |
| 9 | **F8 — voice conversation** | FE | IVR-walk playback thread (voice notes + transcripts + DTMF + ended notes), cross-channel follow-up buttons (AI-handoff demo stays CUT) | N6 reuse | ⏳ |
| 10 | **F9 — marketplace surface** | FE | BSA card "Open" → app (dual navigation C12), submenu visibility = subscription Active + PES, per-channel Send gating + read-only banner (channel-state driven) | — | ⏳ |
| 11 | **W-PES — permissions hardening** | Cross | Seed `sys/acc.basic-send` (BuiltInRoleCatalog + bootstrap), FE registry block + `basicSendQuery`, flags on every action surface, route/data.access gates | — | ⏳ (after B0; before ANY release) |
| 12 | **W-DARK — dark tokens** | Cross | Dark values for BSA custom surfaces (pill vocab, charts, phone frame, chat bubbles); Falcon Eyes both modes | token additions only | ⏳ (after F3) |
| 13 | **L0 — library fitness** | Library | Land task_e08e9a6d (data-table first-paint fix) + sweep sibling wrappers + fix shared-table stored-XSS | library fixes | 🔨 fix in flight |
| 14 | **L1 — packaging surface** | Library | LICENSE/private:false · ng-packagr dist for 69 wrappers + exports→dist + sideEffects · peerDeps (@angular/rxjs) · invert @falcon/studio/runtime dep · split libs/falcon (publishable presentational vs app-side HTTP services) | npm-audit Plan-1 W1-W4 | ⏳ |
| 15 | **L2 — publish pipeline** | Library | Option A: Azure Artifacts npm feed + changesets publish · Option B: npm-pack tarballs as artifacts (A = B + registry). v1.0.0 for ui-core/tokens; 0.x for shared-ui/sdk | Plan-1 W5 | ⏳ |
| 16 | **L3 — consumption proof** | Library | External smoke repo installs the packages (registry or tarball) and builds; switch-day recipe documented. In-repo apps stay source-aliased (internal placement makes this moot for basic-app) | — | ⏳ |
| 17 | **L4 — docs + coverage floor** | Library | Per-component docs (dossiers → package docs), token docs, spec-per-component gate | Plan-1 W6 | ⏳ (parallel) |
| 18-25 | **B0-B7 — backend service waves** | BE | `falcon-core-basic-send-svc`: skeleton+domain (B0) → read facades+gating (B1) → compose/schedule/quote (B2) → WA engine+Meta (B3/B4) → voice engine+retry (B5) → conversation+window (B6) → stats/exports/public API/PES (B7) — full detail in `ARCHITECTURE_BACKEND.md`/`IMPLEMENTATION_PLAN.md` | — | ⏳ (FE runs mock-first; per-endpoint flag flips as these land) |

Order of execution (FE lane): **M0 → M1 → F2 → F3 → F4 → F5 → F6 → F7 → F8 → F9**, with W-PES/W-DARK slotting per their gates and the L-track running independently.

---

## 2. SoT pages → falcon-library rollup (every page, every element family — full 113-row detail in FE_LIBRARY_COVERAGE.md)

| SoT page | Falcon components implementing it | Customizations needed (wave) |
|---|---|---|
| **S0 persona picker** | card · tabs `radio-cards` · avatar · icon | none — and page is demo chrome (NOT ported; PES replaces it) |
| **S1 shell** (tabs, Send, header) | tabs `navigation` · button · avatar · tag+select | none |
| **S2 outbox/scheduled grids** | data-table (ColumnDef, cell templates, rowActions, rowStyleClass, emptyData, custom footer/paginator) · search-input · select · badge · notification | E1 pill vocab (M1) · E2 menu danger/hint (M1) · E3 date-range (M1) · N1 recipients popover (M1) |
| **S3 WA compose** | select/dropdown cascade · tag (variables/chips/gate) · view-toggle (Immediate/Schedule) · switch · input-number · grid-input (manual rows) · phone-field · tooltip · dialog (confirm) · popup `unsaved` (cancel) · card · badge · button | N2 datetime (F2) · N7 banner (F2) · N8 mapping-grid on data-table headerTemplate (F2) · E7 pinned option (F2) · N5+E6 phone preview promotion+frame (F2) · E4 chips (F5 reuse) |
| **S3 voice compose delta** | + audio players (existing) · checkbox-group | E5 IVR canvas promotion (F5) |
| **S4 WA details** | info-card/card KPIs · data-table (scrollHeight, rowClick select, footer) · drawer (Ask AI shell) · tooltip · icon (riyal) · button · popup/dialog (cancel race) | N3 progress (F3) · N4a bars + N4b donut (F3) · N7 banners (F3) · E1 recipient pills (F3) · E2 hint (F3) |
| **S5 voice details** | + data-table **expandedRowId/shadow-rows** (attempts) · audio-waveform-player (recorded call) · filter-panel · empty-data | same chart/pill/banner items (F6 reuses) · E5 canvas |
| **S6 WA conversation** | avatar · info-card · **audio-recorder (WhatsApp-style 1:1 — exists!)** · audio-waveform-player (voice notes) · menu (attach) · input · button · notification | N6 thread kit + N9 emoji + N10 countdown (F7) · N7 expired banner · E6 template bubble |
| **S7 voice conversation** | empty-state · audio players · tag · info-card | N6 reuse (F8) |
| **S8-S10 dialogs/AI drawer** | `FalconConfirmService`→popup (confirms — NEVER the dormant confirm-dialog) · dialog (send-confirm) · drawer · notification | N6 for the AI chat body (if D-10 ships) |
| **Cross-cutting** | icon registry (~322; audit paper-plane/phone-off/funnel/DTMF glyphs at build) · loading skeletons (`skeletonRows`, busyRowIds pattern) · validations (`state="error"`) · RTL logical props | — |

**Traps carried into every wave:** dormant `falcon-confirm-dialog` · deprecated `falcon-toast`/`falcon-table`/`falcon-mobile-number`/legacy pickers — never count as coverage · data-table `[loading]` is a hard swap (use `busyRowIds`) · date-picker has no CVA.

---

## 3. Customization-without-regression policy (binding for E1-E8, N1-N10, promotions)

**Order of resort (platform's Falcon Eyes customization ladder — always try in this order):** ① component **inputs** → ② **ng-template/cell templates** → ③ **slots** → ④ **tokens** (`--falcon-<comp>-*` re-pointing via `[style.--…]`) → ⑤ **shared upgrade** (extend the library component) → ⑥ **new component** → ⑦ wrapper → ⑧ raw markup ONLY as a registered GAP. BSA reached ⑤/⑥ only where the matrix says PARTIAL/MISSING; everything else stays at ①-④.

**Rules for shared upgrades (E1-E8) — the regression-sensitive class:**
1. **Additive-only**: new inputs/flags with defaults that reproduce today's behavior exactly (e.g. E1 status-badge `customVocab` input — absent ⇒ the current 9-severity path untouched; E2 `danger?/disabledHintKey?` optional on the action type; E3 range mode behind `mode="range"`).
2. **Consumer census before coding**: consult `understanding/frontend/architecture/COMPONENT_USAGE_MATRIX.md` + grep for the selector; list every consuming page in the wave notes. Known hot consumers: data-table/menu (voice-records tabs, contracts lists, org-hierarchy users), status-badge (voice account/review), dropdown/select (all wizards), popup (delete confirms platform-wide), tabs (voice service, contracts), date-picker (contracts wizard).
3. **Regression gates per upgrade** (all mandatory): existing unit specs of the component + of listed consumers GREEN · both consoles build · **Falcon Eyes parity run on ONE existing consumer page per touched component** (e.g. E1 → voice-account details; E2/E3 → voice-records list + contracts list) proving pixel-neutrality · component dossier `GAPS_AND_UPGRADES.md` + `API.md` updated · component-scan report row (author/date/files/status per the permanent rule).
4. **Promotions (E5 IVR canvas, E6 WA preview)** move code that live pages already use (templates-wizard in BOTH consoles): re-point the old imports to the promoted lib version in the same wave, and run Falcon Eyes on the templates-wizard preview + IVR view pages before/after — the promotion must be render-identical for them.
5. **New components (N1-N10)**: no regression surface by definition, but they enter the library under the same gates (tokens-only styling, dossier authored, spec floor, en+ar keys, RTL logical properties, dark-mode values) so they don't become tomorrow's debt.
6. **Never** fork a component into the feature to avoid the process, never extend the templates-scoped `falcon-status-chip` (its dossier flags the duplication), never resurrect deprecated components.

**Compliance gate** (from REPLAN §C) runs on every wave on top of this policy: zero native controls · zero non-token colors · no scss/inline styles · folder pattern · page-size 10 · en+ar · PES fail-closed · Falcon Eyes vs SoT for visual waves.
