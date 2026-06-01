---
type: night-shift-report
mode: feature
task-id: wallet-balance-mgmt-reskin-2026-05-28
phase: planning-complete-halted-pending-decisions
created: 2026-05-28T04:50Z
audience: Ammar
---

# Night-Shift Feature Report · Wallet & Balance .Mng (admin + mgmt re-skin)

## TL;DR

Plan complete. **Halted before code-write per Ammar's "creates a perfect plan" primary aim.** Two gating decisions need Ammar (Q-1: restore admin from origin/main; Q-2: Master Wallet on Client view). All other forks resolved via DECISION-PROTOCOL with conservative defaults. **Zero backend changes required** — all 9 actions map to existing endpoints/DTOs/gateways. Multi-wave plan ready (10 waves, ~7-12 hours FE-only).

## Before → After (planning phase)

| Dimension | Before | After (post-planning) | Δ |
|---|---|---|---|
| Investigation document | absent | `_investigation/wallet-balance-mgmt-2026-05-28.md` (16 sections, 12 tables) | +1 |
| SPECs written | absent | 2 (admin + mgmt) | +2 |
| Per-action API mappings | scattered across 4 docs | 1 consolidated table (13 actions) | -3 docs, +1 table |
| Per-component Falcon mappings | absent | 1 table + customization-order discipline | +1 |
| Multi-wave build plan | absent | 10 waves with gates + agent assignments | +1 |
| Risk register | absent | 12 risks classified by severity/probability | +1 |
| Pending-question dossiers (open forks) | 0 | 1 (D-1 Master Wallet on Client) | +1 |
| Mockup evidence captured | 0 | 4 scrapes (full + chooser + Falcon view + Client view) + 8 source JSX files + 1 CSS file | +14 files |
| Brain context loaded | partial | complete: 4 BE doc reads, 2 origin/main code reads, 1 mgmt code read, 1 parity-matrix entry, Charging DTO dictionary | +9 reads |
| Source-prefixed Falcon claims | n/a | 100% — every claim cited with `[CODE]` / `[BRAIN-OUT]` / `[BRAIN-SK]` / `[MEMORY]` / `[INFERRED]` flags | full compliance |

## Before → After example (concrete artifact)

**Before**: `apps/admin-console/src/app/features/wallet-balance-management/` does not exist on `polishing-v0.4`.

**After**: Plan to copy 10 files from `origin/main` then re-skin per Wave 2-4. Files identified:
```
apps/admin-console/src/app/features/wallet-balance-management/
  wallet-balance-management.component.ts       [887+ lines, restored from origin/main]
  wallet-balance-management.component.html     [restored, then re-skinned in Wave 4]
  wallet-balance-management.component.scss     [restored, then token-migrated in Wave 4]
  wallet-balance-management.routes.ts          [restored, wired in app.routes.ts]
  models/
    wallet-balance.models.ts                   [restored verbatim — DTOs match BE]
    transfer.models.ts                         [restored verbatim — Rules A-D + Currency enum]
  services/
    wallet-balance.service.ts                  [restored verbatim — 3 endpoints unchanged]
  components/
    balance-transfer/balance-transfer.component.ts   [restored, re-skinned in Wave 6]
    balance-transfer/balance-transfer.component.html [re-skinned in Wave 6]
    balance-transfer/balance-transfer.component.scss [token-migrated in Wave 6]
    index.ts                                   [restored verbatim]
```

Wave 3 then replaces 2 PrimeNG imports (`ToastModule`, `MessageService`, `TreeNode`) with 3 Falcon UI Core imports (`falcon-toast`, `FalconNotificationService`, Falcon's own tree types) — `grep -rn "primeng/" apps/admin-console/.../wallet-balance-management/` must return 0 lines for Wave 3 to close.

## Waves planned (10 of 10)

| # | Wave | Status | Gates | Agent |
|---|---|---|---|---|
| 1 | Pre-flight + Ammar decisions | **🟡 AWAITING USER** | none | orchestrator + Ammar |
| 2 | Restore admin from origin/main | pending Q-1 | 1 | ammar-web-platform-ui |
| 3 | Replace PrimeNG with Falcon UI Core (admin) | pending Wave 2 | 1, 2 | ammar-web-platform-ui |
| 4 | Re-skin admin component HTML+SCSS | pending Wave 3 | 1, 2 | ammar-web-platform-ui |
| 5 | Re-skin mgmt component HTML+SCSS | pending Q-2 | 1, 2 | ammar-web-platform-ui |
| 6 | Re-skin shared Balance Transfer drawer | pending Wave 5 | 1, 2 | ammar-web-platform-ui |
| 7 | i18n keys (en + ar) + new tokens | pending Wave 6 | 1, 2 + lint gates | ammar-web-platform-ui |
| 8 | Falcon UI Core upgrades (conditional) | pending Wave 4 verification | 1, 2 + ui-core build | ammar-web-platform-ui |
| 9 | PES verification + browser smoke | pending Wave 7 | 3 (PES) | orchestrator + ammar-qa-web |
| 10 | Polish + Falcon Eyes diff + final report | pending Wave 9 | 1, 2 + Falcon Eyes ≥ 90% + gate:all | ammar-web-platform-ui + orchestrator |

## Halt-and-flag items (1 open)

| ID | Class | Severity | Description | Decision needed |
|---|---|---|---|---|
| **D-1** (F-021) | A — Authority | HIGH | Master Wallet card on Client view contradicts parity matrix | Q-2 above — Ammar picks A/B/C |

## Memory entries (deferred — write after Wave 10)

Per CONTRACT.md memory-grow rule: this is a planning phase, not a delivery. No memory entry written yet. Wave 10 will write:
- `home-memory/project_wallet_reskin_2026_05_28.md` (topic file)
- 1 line in `MEMORY.md` (index entry)

## Brain-grounding declaration

- ✅ Read Master Index (`0-MASTER-INDEX.md`)
- ✅ Read Verification Status (`VERIFICATION-STATUS.md`)
- ✅ Read SPEC-PROTOCOL + DECISION-PROTOCOL + CONTRACT + playbook + learnings
- ✅ A→Z trace consulted: none exists for wallet (only Add Client/User/Node, Edit Node). Used `04-feature-parity-matrix/wallet-balance-management.compare.md` (174 lines) as the next-best authority.
- ✅ Pitfalls checked: F-007 (workspace compile errors), F-016 (PrimeNG anti-pattern), F-019/F-020 (empty/loading states)
- ✅ 19 verification-gate questions can be answered from cited sources
- ✅ Source-prefix applied to every Falcon claim in this report + all linked SPECs

## Open assumptions count

- Investigation: 3 of 3 cap (acceptable per SPEC-PROTOCOL)
- Admin SPEC: 3 of 3 cap (acceptable)
- Mgmt SPEC: 3 of 3 cap (acceptable)
- **Total INFERRED count for this run: 9** — at cap but not over

## Files written this run

```
Brain Outputs/datasets/authority-dataset/_investigation/
  wallet-balance-mgmt-2026-05-28.md                              [16 sections, 12 tables]

Brain Outputs/datasets/authority-dataset/_specs/
  wallet-admin-2026-05-28.md                                     [admin SPEC — verdict: proceed-with-defaults]
  wallet-mgmt-2026-05-28.md                                      [mgmt SPEC — verdict: proceed-with-defaults]
  wallet-action-api-map.md                                       [13-action API mapping]
  wallet-component-falcon-map.md                                 [per-region Falcon component mapping]
  wallet-wave-plan-2026-05-28.md                                 [10-wave build plan]
  wallet-risk-register-2026-05-28.md                             [12 risks + 6 open questions]

Brain Outputs/datasets/authority-dataset/_pending-questions/
  wallet-2026-05-28-master-on-client.md                          [D-1 fork — 3 options]

Brain Outputs/datasets/authority-dataset/_runtime-verification/
  night-shift-feature-wallet-2026-05-28-0450.md                  [this report]

Brain Outputs/reports/web-scrub/
  2026-05-28-0438_t2-falcon-admin-full/                          [initial scrape, 7 files]
  2026-05-28-0440_t2-falcon-admin-wallet/                        [wallet chooser scrape, 7 files]
  2026-05-28-0443_t2-wallet-falcon-view/                         [Falcon view scrape, 7 files]
  2026-05-28-0443_t2-wallet-client-view/                         [Client view scrape, 7 files]
  2026-05-28-0444_t2-wallet-falcon-transfer-modal/               [Master-wallet-click scrape, 7 files]
  _source-jsx/                                                   [8 mockup JSX files + wallet.css]
```

Plus 3 web-scrub script edits (`scrape-url.ts` — added `--click` repeatable flag, fixed esbuild `__name` artifact, added click chain support).

**No production code (Angular .ts/.html/.scss) modified.** All FE work waits for Ammar's Q-1 + Q-2 answers.

## Verdict

🟡 **HALT-AND-FLAG — PLANNING COMPLETE.**

The night-shift-feature run has produced a complete, source-prefixed, falsifiable plan to deliver Wallet & Balance .Mng across both consoles in 10 waves with zero backend changes. Two gating decisions (Q-1 + Q-2) need Ammar's input before Wave 2 can begin.

Once Ammar answers, autopilot will continue through Waves 2-10 per the wave plan, halting on any gate failure or new ambiguity ≥7.

## See also

- All artifacts linked in the file list above
- Mockup at `http://127.0.0.1:5173/T2 Falcon Admin.html` (still reachable; design ref only)
- web-scrub setup report at `Brain Outputs/reports/web-scrub-setup-2026-05-28/`
