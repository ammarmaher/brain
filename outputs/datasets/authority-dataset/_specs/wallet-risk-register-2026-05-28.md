---
type: risk-register
task: wallet-balance-mgmt-reskin
created: 2026-05-28
audience: night-shift-feature run + Ammar
---

# Wallet & Balance .Mng — Risk Register + Open Questions

## Risk matrix

| ID | Severity | Probability | Risk | Mitigation | Owner |
|---|---|---|---|---|---|
| **R-01** | HIGH | HIGH | `polishing-v0.4` admin-wallet removal was **intentional** (v0.4 polish wave dropped Falcon-only features per [MEMORY] project_admin_to_mgmt_port_complete_2026_05_27). Restoring may conflict with v0.4 scope decisions. | **HALT before Wave 2 — Ammar confirms restoration is desired.** Otherwise build the new design directly without restoring origin/main first. | Ammar |
| **R-02** | HIGH | MED | **D-1 (Master Wallet on Client view)**: mockup contradicts parity matrix. Adding Master Wallet for Client requires new PES key `acc.master-wallet.view` + BE seed change — out of scope ("don't change BE"). | **HALT before Wave 5 — Ammar decides**: follow parity (omit) OR follow mockup (requires BE PES seed addition by separate ticket). Default in plan: **omit**. | Ammar |
| **R-03** | MED | HIGH | Existing origin/main admin impl uses PrimeNG (Toast, MessageService, TreeNode). User UI policy says "no PrimeNG". Mass refactor in Wave 3 is invasive. | Wave 3 dedicated to the swap; reviewed independently before re-skin Wave 4. Verify zero PrimeNG imports remain via grep gate. | ammar-web-platform-ui |
| **R-04** | MED | MED | `falcon-radio-group` may lack the `horizontal-pill` segmented variant needed for Balance Type / Wallet Type controls. | Wave 4 verification step; if missing, Wave 8 ships the component upgrade following `falcon-component-creation-skill` strategy (≥95% scorecard required). | ammar-web-platform-ui |
| **R-05** | MED | LOW | Wave-7 Stencil/Angular workspace compile errors (F-007) prevent FE runtime smoke per VERIFICATION-STATUS.md. Cannot browser-verify the re-skin without first fixing those 40+ compile errors. | Defer FE runtime check (Wave 9.5) to Ammar's manual approval; rely on `nx build` + Falcon Eyes diff for evidence. Same deferral pattern as `comms-hub-2026-05-16.md`. | F-007 owner (workspace-state issue) |
| **R-06** | MED | LOW | Mgmt-side PES keys G-1 + G-2 are missing (`managementConsole.wallet.view` + `managementConsole.wallet.transfer`). Existing code falls back to server-driven gates. | Existing fallback is fine. **Do NOT add new acc-* PES keys** in this run — would require BE seed change. Document the gap; carry forward to a separate ticket. | Ammar (defers to backend) |
| **R-07** | LOW | MED | Mockup's `Switch perspective` button could be interpreted as a real Falcon→Client view-switching feature requiring SSR/JWT impersonation. | DECIDED: it's a UX affordance for Falcon users navigating their two consoles. Implement as route-link only, not as user-impersonation. Document in admin SPEC §3 (D-4). | orchestrator (resolved) |
| **R-08** | LOW | LOW | Mockup's `Viewing as` role simulator might be a real feature request. | DECIDED: design aid only (D-3). If Ammar wants it as a real feature, file a new SPEC outside this scope. | orchestrator (resolved) |
| **R-09** | LOW | LOW | Cross-channel transfer hint text translation might be missing in `ar.json`. | Wave 7 explicitly adds en + ar pair for every new key; en-fallback + gap-log per F-024. | ammar-web-platform-ui |
| **R-10** | LOW | LOW | T2 mockup at `127.0.0.1:5173` may go offline between Wave 1 (capture) and Wave 10 (Falcon Eyes diff). | Wave 1 captures full screenshots + DOM + CSS to disk; Wave 10 diffs against the captured artifacts, not against the live URL. Capture is already complete. | orchestrator (mitigated) |
| **R-11** | LOW | LOW | Existing mgmt-side `BalanceTransferComponent` API may not match the mockup-driven shape, requiring API changes beyond template re-skin. | Wave 6 step 6.1 reads current TS first; if API change needed, scope to minimum non-breaking surface and document in run report. | ammar-web-platform-ui |
| **R-12** | INFO | n/a | Backend Charging service has 13 moderate npm vulnerabilities transitively via web-scrub Crawlee install — unrelated to wallet feature. | Documented in `Brain Outputs/reports/web-scrub-setup-2026-05-28/01-installation-verification.md`; not exploitable in our use. | n/a |

## Open questions for Ammar

| Q# | Question | Required by wave | Default if unanswered |
|---|---|---|---|
| **Q-1** | Confirm restoring admin-console wallet from `origin/main` is desired (or build the new design from scratch instead, skipping restore)? | Wave 2 | Restore (matches user instruction "the integration between the backend should be taken from the main branch") |
| **Q-2** | **D-1**: Master Wallet card on Client view — follow mockup (include) or follow parity matrix (omit)? | Wave 5 | Omit (parity matrix wins per DECISION-PROTOCOL "more restrictive option") |
| **Q-3** | Is the `Switch perspective` button supposed to log the user out and re-log as the other persona, OR just navigate between admin and mgmt URLs (assuming the user has both roles)? | Wave 4 | Navigate-only (URL route change) — no auth change |
| **Q-4** | If a Falcon UI Core component needs upgrade (Wave 8 conditional), does Ammar want the upgrade included in this run, or split to a separate ticket? | Wave 8 (if triggered) | Include in this run (Wave 8) per autopilot scope |
| **Q-5** | After plan approval, does Ammar want me to execute Waves 2-10 autonomously (commit-less; working tree dirty until Ammar runs `commit`), or pause again before Wave 5 (mgmt re-skin) for a mid-checkpoint review? | between Wave 4 and Wave 5 | Autonomous through Wave 10 per "autopilot is activated" |
| **Q-6** | The current `polishing-v0.4` branch has many other in-flight changes (see git status) — is it safe to add wallet work on top, or should this go on a new branch like `feature/wallet-balance-mgmt-reskin`? | Wave 2 | Stay on `polishing-v0.4` per existing memory pattern (memory shows recent changes consistently on this branch) |

## Halt-and-flag verdict for this run

**HALT — DO NOT PROCEED TO WAVE 2 UNTIL Q-1 AND Q-2 ARE ANSWERED.**

All other Qs (Q-3 through Q-6) have safe defaults that don't risk irreversible work. Q-1 and Q-2 are the **gating** decisions because:
- Q-1 determines whether to spend Wave 2 effort restoring 10 files
- Q-2 determines whether Wave 5 omits the Master Wallet card or includes it (different HTML output)

## Source-prefix audit for this risk register

Every claim in this file traces to:
- `[BRAIN-OUT]` paths under `Brain Outputs/datasets/authority-dataset/`
- `[CODE]` paths under `falcon-web-platform-ui/`
- `[MEMORY]` entries from `MEMORY.md`
- `[INFERRED]` reasoning explicitly flagged in `_investigation/wallet-balance-mgmt-2026-05-28.md` §14 (3 of 3 cap)

Zero unprefixed Falcon facts.

## See also

- Investigation: `_investigation/wallet-balance-mgmt-2026-05-28.md`
- SPECs: `_specs/wallet-admin-2026-05-28.md` + `_specs/wallet-mgmt-2026-05-28.md`
- Wave plan: `_specs/wallet-wave-plan-2026-05-28.md`
- Pending Q (Master on Client): `_pending-questions/wallet-2026-05-28-master-on-client.md`
- Action API map: `_specs/wallet-action-api-map.md`
- Component map: `_specs/wallet-component-falcon-map.md`
