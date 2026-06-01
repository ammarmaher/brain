---
type: feature-wave-plan
task: wallet-balance-mgmt-reskin
created: 2026-05-28
purpose: "Multi-wave build plan for restoring + re-skinning Wallet & Balance .Mng across admin + management consoles. Gates per wave. Agent assignments per wave. No code-write happens until Ammar approves the plan."
---

# Wallet & Balance .Mng — Multi-Wave Build Plan

> [!summary]
> 10 waves total, capped at the night-shift-feature 10-wave limit. Each wave is independently gatable. Admin and mgmt work split per console; shared work (drawer, models, i18n, tokens) lives in libs. **NO BACKEND CHANGES** — all BE waves are READ-ONLY context loading via specialist agents.

## Wave overview

| # | Wave | Console | Files touched (count) | Agent owner | Gates | Status |
|---|---|---|---|---|---|---|
| 1 | Pre-flight + Ammar decisions | both | 0 (decisions only) | orchestrator (this skill) | none | **AWAITING USER** — see pending questions |
| 2 | Restore admin-console wallet from origin/main | admin | ~10 (copy) | ammar-web-platform-ui | 1 (build) |  |
| 3 | Replace PrimeNG with Falcon UI Core (admin) | admin | ~3-5 (imports + handler refactor) | ammar-web-platform-ui | 1, 2 |  |
| 4 | Re-skin admin component HTML + SCSS to T2 mockup | admin | ~2-3 (HTML, SCSS, possibly TS for signal additions) | ammar-web-platform-ui | 1, 2 |  |
| 5 | Re-skin mgmt component HTML + SCSS to T2 mockup | mgmt | ~2-3 | ammar-web-platform-ui | 1, 2 |  |
| 6 | Re-skin shared Balance Transfer drawer template (both apps consume) | shared | ~2 (admin + mgmt balance-transfer.component.html each) | ammar-web-platform-ui | 1, 2 |  |
| 7 | i18n keys (en + ar) + new tokens | shared | ~3-5 (en.json, ar.json, tokens.css, possibly tokens.ts) | ammar-web-platform-ui | 1, 2 |  |
| 8 | Falcon UI Core upgrades (if Wave 4 verification flags any) | libs/falcon-ui-core | varies | ammar-web-platform-ui | 1, 2, falcon-ui-core build |  |
| 9 | PES verification + browser-driven smoke | runtime | 0 code (verification only) | orchestrator + ammar-qa-web | 3 (PES) + manual browser check |  |
| 10 | Polish + Falcon Eyes diff + final report | both | varies (final tweaks) | ammar-web-platform-ui + orchestrator | 1, 2, falcon-eyes ≥ 90% | final report |

## Wave 1 — Pre-flight + Ammar decisions (BEFORE any code-write)

| Step | Action | Owner |
|---|---|---|
| 1.1 | Halt current run. Present plan summary to Ammar. | orchestrator |
| 1.2 | Resolve **D-1** (Master Wallet on Client view) — Ammar decides mockup OR parity matrix. | Ammar |
| 1.3 | Confirm `polishing-v0.4` admin-wallet removal was intentional — Ammar to confirm OK to restore. | Ammar |
| 1.4 | Confirm UI policy is hard (no PrimeNG even though origin/main uses it). | Ammar (implied: "Falcon Library ONLY") |
| 1.5 | Confirm autopilot continues to Waves 2-10 once decisions logged. | Ammar |

Gates: none (this wave is decision-only).

Exit criteria: `_pending-questions/wallet-2026-05-28-master-on-client.md` updated with Ammar's verdict; orchestrator records all decisions in `decisions-2026-05-28.md`.

## Wave 2 — Restore admin-console wallet from `origin/main`

| Step | Action | Files | Owner |
|---|---|---|---|
| 2.1 | `git show origin/main:apps/admin-console/src/app/features/wallet-balance-management/` → 10 files | listed in §1 of investigation | ammar-web-platform-ui |
| 2.2 | Copy verbatim to `apps/admin-console/src/app/features/wallet-balance-management/` on `polishing-v0.4` | 10 files | same |
| 2.3 | Wire route in `apps/admin-console/src/app/app.routes.ts` — restore the deleted entry from origin/main | `app.routes.ts` | same |
| 2.4 | Wire sidebar nav (host-shell config if needed) | sidebar config | same |

Gates: **1 (build)**: `nx build admin-console` exit 0. Must build even though PrimeNG is still imported (we replace in Wave 3).

Acceptance: route loads in dev-serve; component mounts; PrimeNG-driven toast appears on hierarchy fetch failure.

## Wave 3 — Replace PrimeNG with Falcon UI Core (admin)

| Step | Action | Files | Owner |
|---|---|---|---|
| 3.1 | Replace `import { TreeNode, MessageService } from 'primeng/api'` with Falcon equivalents (use existing `OrganizationHierarchyTreeComponent` model types + `FalconNotificationService`) | `wallet-balance-management.component.ts` | ammar-web-platform-ui |
| 3.2 | Replace `import { ToastModule } from 'primeng/toast'` — drop from imports (host-shell already mounts a global toast outlet OR import `falcon-toast` from `@falcon/ui-core/angular`) | same | same |
| 3.3 | Replace all `messageService.add({...})` calls with `notificationService.show(...)` matching Falcon Notification API | same | same |
| 3.4 | Remove `MessageService` from `providers` array | same | same |
| 3.5 | Verify zero `primeng/` imports remain — `grep -rn "primeng/" apps/admin-console/src/app/features/wallet-balance-management/` returns 0 | n/a (verification) | same |

Gates: **1 (build) + 2 (scanner)**: `nx build admin-console` exit 0; `scan-authority.ps1 -CheckOnly` exit 0.

Acceptance: page renders; toast still appears via Falcon Notification on hierarchy fetch failure.

## Wave 4 — Re-skin admin component HTML + SCSS to T2 mockup (Falcon view)

| Step | Action | Files | Owner |
|---|---|---|---|
| 4.1 | Replace `wallet-balance-management.component.html` markup per component-falcon-map.md §"Falcon view" using only Falcon UI Core components | HTML | ammar-web-platform-ui |
| 4.2 | Update `wallet-balance-management.component.scss` to use Falcon tokens (zero hex / arbitrary px) | SCSS | same |
| 4.3 | Add signals/computed for new UI state: `editMode = signal(false)` for the Edit toggle, etc. | TS | same |
| 4.4 | Verify `falcon-radio-group` segmented variant exists — if missing, queue Wave 8 upgrade task | n/a (verification) | same |
| 4.5 | Wire all 4 PES flags via existing `primeAccess()` method (unchanged from origin/main) | TS | same |

Gates: **1 + 2**: build + scanner. Plus visual-target alignment check (informal — Wave 10 does Falcon Eyes diff).

Acceptance: page renders matching T2 mockup "Show as Falcon" layout; Edit/Save/Transfer buttons gated by correct PES flags.

## Wave 5 — Re-skin mgmt component HTML + SCSS to T2 mockup (Client view)

| Step | Action | Files | Owner |
|---|---|---|---|
| 5.1 | Replace `apps/management-console/src/app/features/wallet-balance-management/wallet-balance-management.component.html` per component-falcon-map.md §"Client view" | HTML | ammar-web-platform-ui |
| 5.2 | Apply D-1 decision: include or omit Master Wallet card | HTML | same |
| 5.3 | Verify SCSS still uses tokens; update if needed | SCSS (if exists) | same |
| 5.4 | Drop `Switch perspective` button (Falcon-only affordance) | HTML | same |

Gates: **1 + 2**: build + scanner. Mgmt-console + host-shell green.

Acceptance: page renders matching T2 mockup "Show as Client" layout; server-driven `canTransfer` gates per-row Transfer button; no Master Wallet (unless D-1 says include).

## Wave 6 — Re-skin shared Balance Transfer drawer template

| Step | Action | Files | Owner |
|---|---|---|---|
| 6.1 | Update admin `components/balance-transfer/balance-transfer.component.html` per component-falcon-map.md §"Balance Transfer Drawer" | admin HTML | ammar-web-platform-ui |
| 6.2 | Update mgmt `components/balance-transfer/balance-transfer.component.html` to same template (or import shared template if extracted) | mgmt HTML | same |
| 6.3 | Verify cross-channel locked hint via `<falcon-tooltip>` works in RTL (Arabic) | both HTMLs | same |
| 6.4 | Wire `isDescriptionRequired()` helper unchanged from `transfer.models.ts` | both TS | same |

Gates: **1 + 2** (both apps + host-shell).

Acceptance: opening drawer from row OR Master Wallet shows form fields in the order specified; Save button reactive to `canSave` formula; Cancel closes; success/error pipe works.

## Wave 7 — i18n keys (en + ar) + new tokens

| Step | Action | Files | Owner |
|---|---|---|---|
| 7.1 | Add new translation keys for any new mockup strings (e.g., `wallet.editStrategy`, `wallet.switchPerspective`, `wallet.transfer.crossChannelLocked`) to `en.json` + `ar.json` | i18n resources | ammar-web-platform-ui |
| 7.2 | If mockup palette doesn't match existing tokens, add new tokens to `libs/falcon-ui-tokens/src/` per [MEMORY] project_night_shift_static_value_token_migration | tokens.css / tokens.ts | same |
| 7.3 | Verify `gate:hardcoded-value-lint` exit 0 + `gate:token-naming-lint` exit 0 | n/a (verification) | same |

Gates: **1 + 2** + lint gates.

Acceptance: ar.json updated; gate scripts green; no inline hex/arbitrary values.

## Wave 8 — Falcon UI Core upgrades (conditional — only if Wave 4 surfaced gaps)

| Step | Action | Files | Owner |
|---|---|---|---|
| 8.1 | If `falcon-radio-group` lacks `horizontal-pill` segmented variant → add variant via Stencil component upgrade per `falcon-component-creation-skill` strategy | `libs/falcon-ui-core/src/components/falcon-radio-group/` (Stencil + render variants) | ammar-web-platform-ui |
| 8.2 | If `falcon-input-number` lacks suffix slot → add via input upgrade | similar | same |
| 8.3 | Build falcon-ui-core + admin + mgmt + host-shell | n/a (verification) | same |
| 8.4 | Update component dossier in `Brain Outputs/understanding/frontend/components/<name>/` (6-file dossier) | dossier | same |

Gates: **1 + 2 + falcon-ui-core build**.

Acceptance: scorecard ≥95% per `Brain Outputs/strategies/falcon-component-creation/05-SCORING_RUBRIC.md` for any upgraded component.

If no upgrades needed, this wave is **SKIPPED** and marked accordingly in the run report.

## Wave 9 — PES verification + browser-driven smoke

| Step | Action | Owner |
|---|---|---|
| 9.1 | Login as `sysadmin` → `POST :7777/api/auth/login` → JWT → 4 PES authorize calls per admin SPEC PES-checks block. Expect all 4 allow. | orchestrator |
| 9.2 | Login as `sysops` → 4 PES authorize calls. Expect all 4 deny. | same |
| 9.3 | Login as `sysproducts` → 4 PES authorize calls. Expect all 4 allow. | same |
| 9.4 | Login as `accowner` → app-level + 1 server-driven `canTransfer` check via hierarchy response. | same |
| 9.5 | Browser smoke (deferred to Ammar if F-007 still blocks FE runtime): admin route loads, Master Wallet card renders, tree navigable, drawer opens, transfer fires → response intercepted → toast shown. | ammar-qa-web (deferred) |
| 9.6 | Write evidence to `_runtime-verification/wallet-2026-05-28.md` (matching `comms-hub-2026-05-16.md` shape) | orchestrator |

Gates: **3 (backend PES)**: 12/12 dataset predictions match runtime.

Acceptance: PES matrix matches dataset; evidence file written. FE runtime check deferred per F-007.

## Wave 10 — Polish + Falcon Eyes diff + final report

| Step | Action | Owner |
|---|---|---|
| 10.1 | Run Falcon Eyes between scraped mockup and dev-serve render of admin wallet page → must score ≥ 90% | ammar-web-platform-ui |
| 10.2 | Same for mgmt wallet page | same |
| 10.3 | Fix any HIGH-severity Falcon Eyes mismatches via customization order | same |
| 10.4 | Run `gate:all` (12 quality gates) end-to-end | same |
| 10.5 | Write night-shift-feature final report at `_runtime-verification/night-shift-feature-wallet-2026-05-28-<TS>.md` (per CONTRACT.md report shape) | orchestrator |
| 10.6 | Update `home-memory/project_wallet_reskin_2026_05_28.md` + 1 line in `MEMORY.md` per CONTRACT.md memory-grow rule | orchestrator |
| 10.7 | Update `learnings.md` for night-shift-feature skill | orchestrator |

Gates: **1 + 2 + Falcon Eyes ≥ 90% + gate:all**.

Acceptance: final report present; memory updated; no commits made (per Falcon hard-rule).

## Agent dispatch summary

| Agent | Waves | Scope |
|---|---|---|
| ammar-web-platform-ui (FE specialist) | 2, 3, 4, 5, 6, 7, 8, 10.1-10.4 | All FE design + impl + token + i18n work |
| ammar-core-charging (BE specialist) | — | **NOT USED**: BE is read-only per user policy. Background context already loaded into investigation/SPEC. |
| ammar-core-commerce | — | Same — context-only, no dispatch needed |
| ammar-qa-web | 9.5 (browser smoke) | Deferred — only if F-007 unblocked |
| orchestrator (this run) | 1, 9.1-9.4, 9.6, 10.5-10.7 | Decisions + PES verify + reports + memory |

## Per-wave halt-and-flag triggers (in addition to universal halts)

| Trigger | When | Action |
|---|---|---|
| Falcon UI Core scorecard < 95% for any upgrade in Wave 8 | Wave 8 | Halt, write deviation log, ask Ammar |
| `gate:hardcoded-value-lint` flags inline hex/px after Wave 4 or 5 | Wave 4 or 5 | Halt, fix tokens before continuing |
| Any wave introduces a new `[INFERRED]` decision > 0 (count per wave > 0 means we need to ask) | Any wave | Halt, write `_pending-questions/wallet-2026-05-28-wave-<n>.md` |
| `nx build` exit code ≠ 0 | Any wave | Halt, fix root cause |
| Falcon Eyes diff < 90% with no clear customization path | Wave 10 | Halt, escalate to Ammar with diff report |
| User says "halt" | Any wave | Halt immediately |

## Total estimated effort

- Waves 2-7: ~6 hours of FE work
- Wave 8: 0-4 hours (conditional)
- Waves 9-10: 1-2 hours
- **Total: 7-12 hours of FE work + ~1 hour orchestration**

All work is **frontend-only**. Backend is touched zero times. No new dependencies. No PES seed changes.

## See also

- Investigation: `_investigation/wallet-balance-mgmt-2026-05-28.md`
- SPECs: `_specs/wallet-admin-2026-05-28.md` + `_specs/wallet-mgmt-2026-05-28.md`
- API map: `_specs/wallet-action-api-map.md`
- Component map: `_specs/wallet-component-falcon-map.md`
- Risk register: `_specs/wallet-risk-register-2026-05-28.md`
- Pending questions: `_pending-questions/wallet-2026-05-28-master-on-client.md`
