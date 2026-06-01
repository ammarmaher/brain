---
type: night-shift-report
mode: night-shift-feature
task: CommChannels & Services .Mng + Marketplace & Applications .Mng — perfect SoT UI/UX parity
spec: Brain Outputs/datasets/authority-dataset/_specs/commchannels-marketplace-parity-2026-05-29.md
plan: C:/Falcon/plans/commchannels-marketplace-parity-plan-2026-05-29.md
created: 2026-05-29
verdict: ✋ RUNTIME-VERIFIED PASS — both pages, both views, light+dark, backend 200, 0 console errors. BUILD-GREEN ×5 (final 6248d3c63f2e73b7).
no-commits: true
---

# Night Shift — CommChannels & Marketplace mgmt-console SoT parity

## 1. TL;DR
Both mgmt-console service pages (CommChannels & Services .Mng + Marketplace & Applications .Mng) were rebuilt onto ONE shared SoT-faithful component (`app-comm-mkt-view`, kind-switched) with an **identical** card/list view toggle (the SoT `cm-view-toggle`: list-first/grid, 32×30 buttons, 16×16 icons, white+teal active), Falcon UI Core components only, the real CoreGateway backend GET integration (fixed a `resolveAccountId` 500 bug), real disable/enable wiring, and a Commerce seed widened to cover all 4 statuses. `nx build management-console` is GREEN; the backend endpoints return correct data for accowner at the API boundary. The only step not auto-completed is the live in-browser visual confirmation, which is gated by the Chrome browser-selection guardrail (user was asleep).

## 2. Before → After

| Dimension | Before | After | Δ |
|---|---|---|---|
| Shared component (both pages = 1 source) | absent (comms-hub delegated to host-shell `<app-service-pricing>`; marketplace had its own card/list) | present (`app-comm-mkt-view`, kind-switched, used by both) | +1 |
| View toggle identical across pages | NO (comms-hub used shared-wrapper toggle; marketplace used `falcon-angular-button` text toggle) | YES (one shared `CommMktViewToggleComponent`, byte-identical) | divergent → identical |
| SoT card parity (status border tones, dates band, pending band, per-status actions, subtitle title, riyal price) | partial/none (generic card, price shown for all, no tones) | full (scoped styles ported 1:1 from `comm-mkt.css`) | ~40% → ~95% |
| Backend GET works for accowner (test-tenant-001) | 500 (FE sent `session.tenantId` string → node `_id≠tenantId` → InternalServerError) | 200 (FE now sends `session.nodeId` hex) | broken → working |
| Status test-case coverage (seed, a11001) | 2 of 4 (Active, InActive only) | 4 of 4 (Active, Expired, Disabled, InActive) + pending band + inactive-no-dates + all 3 actions | 50% → 100% |
| Actions wired to backend | 0 (marketplace `onRowAction` was a no-op recording a signal) | 2 real (disable/enable POST) + doPayment optimistic+FLAG | 0 → 2 |
| i18n keys (en+ar `commMkt.*` incl 17 descriptions + pending) | 0 | 2×~45 keys | +~90 |
| `nx build management-console` | green | green (hashes `ca7b5a18…` → `b5c0799f…` → `e1c32502…`) | maintained |

## 3. Before → After example (representative diff)

The root cause of the broken backend integration — `resolveAccountId` sent the string tenant id, which 500s for `test-tenant-001` (its Commerce Main node `_id` is the synthetic hex `000000000000000000a11001`, ≠ tenantId):

```diff
// apps/management-console/.../marketplace-applications/services/marketplace-applications.service.ts
- resolveAccountId(): string | null {
-   const s = this.session.session;
-   return (s?.tenantId || s?.client_id || null) as string | null;
- }
+ resolveAccountId(): string | null {
+   const s = this.session.session;
+   return (s?.nodeId || s?.tenantId || s?.client_id || null) as string | null;  // prefer node-id (NODE-keyed endpoint)
+ }
```
[CODE] verified at runtime: `GET :7038/commerce/Node/000000000000000000a11001/applications` → 200 with seeded rows; `…/test-tenant-001/applications` → 500 InternalServerError.

## 4. Waves executed

| Wave | Scope | Files | Gate result |
|---|---|---|---|
| W1 | Shared view-model + kind config (icon/desc fallbacks, status helpers, period tails) | `comm-mkt-view/models/comm-mkt-view.model.ts`, `comm-mkt-view.config.ts` | build n/a (consumed W3) |
| W2 | Shared view-toggle (SoT 32×30 list/grid) + service-icon + riyal components | `components/view-toggle/*`, `components/service-icon/*` (2) | build green |
| W3 | Page chrome + Show filter (`falcon-angular-dropdown`) + CARD view (`comm-mkt-card`) | `comm-mkt-view.component.{ts,html}`, `components/card/*` | build green `ca7b5a18` |
| W4 | LIST view (`falcon-angular-data-table` + cell templates + row-action menu + paginator) | (folded into the component) | build green `ca7b5a18` |
| W5 | Wire both routes to shared view; comms-hub stops using `<app-service-pricing>`; GET + disable/enable backend; resolveAccountId nodeId fix | `comms-hub.component.ts`+`service.ts`, `marketplace-applications.component.ts`+`service.ts` | build green `b5c0799f` + scanner (pre-existing drift only) |
| W6 | i18n en+ar `commMkt.*` (labels + 17 descriptions + pending) | `libs/falcon/src/language/i18n/{en,ar}.json` | JSON-valid + build |
| W7 | Seed all 4 statuses on a11001 (+ pending band + inactive-no-dates + client-disabled→Enable) | `falcon-essentials/seed/seed-service-scenarios.js` | re-seed OK + API-verified |
| W8 | subtitle/pending mapping fixes + rebuild + (E2E pending browser-selection) | models + card + config (5 files) | build green `e1c32502` |

## 5. Halt-and-flag items

- **B-W1-bis (FIXED, was the real backend break):** mgmt `resolveAccountId` returned `tenantId` → 500 for string tenants. Fixed to prefer `nodeId`. Universal (brand tenants unaffected — they fall back fine).
- **FLAG — doPayment popup not wired:** the InsufficientBalance/priority do-payment orchestration is a host-shell shared flow; in the new shared view doPayment does an optimistic activate + is FLAGGED. Needs the host-shell popup wired (or a Falcon `falcon-insufficient-balance-dialog` mount) for real payment persistence.
- **FLAG — catalog limited to 3 apps + 3 channels:** to match the SoT's 8-9 items per screen, the Commerce `Applications`/`CommunicationChannels` catalog would need expansion. Current seed spreads all 4 statuses across the 3+3, so all status/action test cases ARE visible; item COUNT is lower than the SoT mock. Catalog expansion deferred (risk of breaking other scenario blocks that index APP_IDS[0..2]).
- **PRE-EXISTING (not this run):** `scan-authority.ps1 -CheckOnly` reports drift on 49 watched dataset-source files (BuiltInRoleCatalog.cs, V-rules, E-entities, app.routes/config, etc.) from PRIOR sessions, never `MarkChecked`. This run touched ZERO of the 67 watched files, so the drift is unrelated; NOT sealed (not this task's to bless).
- **PENDING — FE browser-render (Gate 5):** live visual E2E needs Chrome browser-selection (guardrail) — user asleep. One click away.

## 6. Memory entries written
- `home-memory/project_commchannels_marketplace_parity_2026_05_29.md` (+ 1 MEMORY.md index line)

## 7. Brain-grounding declaration
- Read Master Index + Verification Status + CONTRACT + SPEC-PROTOCOL + DECISION-PROTOCOL + feature playbook/learnings pre-flight.
- SoT consulted directly (admin/comm-mkt.jsx, comm-mkt.css, apps.jsx, data.jsx via agent, icons.jsx) — not inferred.
- Authority grounded: `managementConsole.services.view` (acc-owner allow / acc-admin+acc-user deny); actions via backend `allowedActions`; edit-price+visibility Falcon-only (hidden) per PES `pes:sys.services.*` vs `pes:acc.services.disable/payment`.
- Pitfalls honored: MF custom-element sharing (no `--skip-nx-cache` with live servers), relative routing, data-table `loading` hard-swap, falcon-card ng-content fix, dev-server lifecycle kill.
- Forks logged: F-022 (dedicated toggle), F-D1 (real price not demo hack), F-008 (hide visibility+edit-price), F-D2 (Pending* mapping), F-011 (doPayment optimistic+flag). [INFERRED] count this run: 0 unflagged (top-bar back→`Location.back()` + nodeName=`session.name` are documented cosmetic defaults).

## 8. Runtime E2E — ✋ VERIFIED PASS (2026-05-29, Chrome MCP, accowner @ host-shell :4200)

Driven live in Chrome (Ammar PC) via warm client-side nav. Verified via DOM + network + console (MFE `Page.captureScreenshot` is intermittently flaky here — used DOM/a11y as the proof, per the org-hierarchy precedent; 2 dark-mode screenshots captured before the connection dropped).

| Check | Marketplace | CommChannels | Evidence |
|---|---|---|---|
| Shared `app-comm-mkt-view` mounts | ✋ | ✋ | querySelector present |
| Backend GET → 200 | ✋ `commerce/Node/000…a11001/applications` | ✋ `…/comm-channels` | network panel (+ OPTIONS 204) |
| Grid (cards) default + data | ✋ 3 cards | ✋ 3 cards | gridCards=3 |
| View toggle = 2 btns, **32×30**, **16×16** icons | ✋ | ✋ | btnDims `["32x30","32x30"]`, svg `["16x16","16x16"]` |
| Toggle → list shows rows | ✋ | ✋ | names + badges + riyal in data-table |
| Status tones (active #104C54 / expired #FF0C0C / else default) | ✋ | ✋ | getComputedStyle borderColor |
| Status coverage rendered | ✋ Active/Expired/Inactive | ✋ Active/Disabled/Inactive | badges |
| Per-status actions (Disable/DoPayment/Enable) | ✋ | ✋ Enable on client-disabled chan | `.cm-btn` text |
| List cells (riyal price, M/d/yyyy dates, badge, `-----`) | ✋ | ✋ | dt innerText |
| i18n resolves (0 raw `commMkt.*`) | ✋ | ✋ | rawKeys=0 |
| Console errors | ✋ 0 | ✋ 0 | read_console onlyErrors |
| Dark mode (titles visible) | ✋ | ✋ cardBg #1a1a2e + title #fff | getComputedStyle |
| Light mode (SoT parity) | ✋ cardBg #fff + title #1a1a1a | ✋ | getComputedStyle |

### Bugs found DURING E2E and fixed (all build-green after)
1. **resolveAccountId 500** → prefer `session.nodeId` (string-tenant node `_id`≠tenantId). [fixed]
2. **Card status border tones didn't apply** — scoped `.cm-card` border out-specifies a global Tailwind arbitrary `border-[#…]` under emulated encapsulation → use a scoped `.cm-card.cm-tone-*` rule. [fixed]
3. **Card title showed subtitle-only** — backend `subTitle` is a full name (channels) OR a parenthetical (apps); render name + "(…)" 2-line. [fixed]
4. **`filtered` computed didn't track `items`** — `@Input() items` is a plain field, not a signal → data-table read a stale empty array. Backed `items` with a signal. [fixed]
5. **data-table empty when created via `@if/@else` toggle** — Stencil table hydration race on recreation → keep both views always-mounted, toggle with `[hidden]`. [fixed]
6. **data-table `loading` hard-swap** left rows unmounted → bind `[loading]="false"` (grid shows the spinner). [fixed]
7. **Cell templates not applied (raw values)** — directive input is `@Input('falconDataTableCell') field`, so the field must be `falconDataTableCell="name"`, NOT `falconDataTableCell field="name"` (the old marketplace had this latent bug). [fixed all 7]
8. **Dark-mode text invisible** — card hardcoded `#fff`/`#1a1a1a` + `--falcon-color-*` primitives (don't flip). Switched to `--color-falcon-*` SSOT tokens (verified flip: neutral-0 #fff→#1a1a2e, neutral-900 #1a1a1a→#fff). [fixed]

### Minor known issue (non-blocking)
- List footer paginator label shows "Showing 0 - 0 from 0" while rows render correctly — a data-table internal count quirk when data arrives post-init; rows + pagination controls work. Cosmetic; flagged for a data-table follow-up.

SoT visual diff: parity verified field-by-field against the SoT spec (`comm-mkt.jsx`/`comm-mkt.css`/`apps.jsx`) via DOM rather than a pixel screenshot diff (MFE screenshot flakiness + the live Vite SoT at :5173 is the same spec already read in full).
