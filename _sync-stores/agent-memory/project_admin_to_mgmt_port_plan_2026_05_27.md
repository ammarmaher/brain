---
name: project-admin-to-mgmt-port-plan-2026-05-27
description: 8-wave port plan to copy admin-console features into management-console as Client-side (acc-* roles) with Falcon-only sub-features intentionally dropped per authority-dataset
metadata: 
  node_type: memory
  type: project
  originSessionId: 25972c96-56f6-47b9-b1ee-a0d5bc4ea595
---

# Admin → Mgmt port plan — 2026-05-27 (draft, awaiting sign-off)

**Status:** 📋 PLAN ONLY · no code written yet · awaiting user sign-off on 6 open questions

**Plan file:** `C:\Falcon\plans\admin-to-mgmt-port-plan-2026-05-27.md`

**Why:** Why: User asked to copy everything from admin-console (Falcon / sys-*) to management-console (Client / acc-*) with appropriate drops. Initial reading suggested 6 features already ported in 2026-05-18 Night-Shift waves — but those live in `C:\Falcon\Brain Outputs\worktrees\night-shift-token-migration\` and were never merged. **Live `apps/management-console/src/app/features/` has only `templates-page`** — port is essentially greenfield, with worktree as 9-day-stale reference material.

**How to apply:** Future sessions resuming this work should:
1. Re-read the plan file at the path above (8 waves, one Ammar agent per wave).
2. Confirm answers to the 6 open questions §11 before spawning Wave 0.
3. Wave 0 = `ammar-web-platform-ui` runs 6 parallel sub-audits diffing worktree port vs current admin per feature.
4. Waves 1-6 = per-feature port (comms-hub, org-hierarchy, marketplace, wallet, contracts, contact-groups).
5. Wave 7 = unblock 40+ pre-existing Stencil compile errors per [[verification-status]] then browser-verify acc-owner/acc-admin/acc-user landing.
6. Wave 8 = brain + memory closing.

**Drop list (Falcon-only — must NOT leak into mgmt-console):**
- 5-step Add Client wizard · `FALCON_ROOT_NODE` synthetic root · cross-account tree picker · Master Wallet card · wallet-strategy view/edit · EditPriceType/EditPriceValue/Visibility row actions · Contract Add/Edit · root-level password security + allowed IPs · `account.add` · `testing-charging` entire feature.

**Drift baseline (verified clean 2026-05-27):** zero `FalconAccess.adminConsole` · zero `useGateway(Gateway.SystemGateway)` · zero `masterWallet`/`FALCON_ROOT_NODE`/`EditPriceType` leaks in live mgmt-console. Starting point is genuinely empty.

**Authority asymmetry to honour (per [BRAIN-OUT] 04-feature-parity-matrix/MATRIX.md:88-96):**
| Feature | acc-owner | acc-admin | acc-user |
|---|---|---|---|
| org-hierarchy | ✅ | ✅ | ❌ |
| comms-hub | ✅ | ❌ | ❌ |
| marketplace | ✅ | ❌ | ❌ |
| contact-groups | ✅ | ✅ | ✅ |
| wallet | ✅ | ❌ | ❌ |
| contracts | ✅ | ❌ | ❌ |

**Strongest asymmetry:** `contracts-cost-management` — acc-admin + acc-user both DENIED. Wave 5 deliverable must pair `canActivate: [shellAccessGuard]` AND `data.access` (admin-console port omitted the guard per [BRAIN-OUT] contracts-cost-management.compare.md:80).

**Related:** [[copy-admin-feature-to-mgmt-playbook]] (12-step recipe) · [[verification-status-2026-05-16]] (FE compile-error blocker for Wave 7) · [[feature-parity-matrix]] (per-role landing).
