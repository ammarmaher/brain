# Voice Service → PES-driven (voice-record resource), both consoles

Date: 2026-07-01 · Agent: claude · Branch: polishing-v0.4 (UNCOMMITTED) · Status: DONE (green; runtime user-gated)

## Goal
Make the Voice Service screen's actions dynamically controlled by PES (per PR 43022's voice-record
resource) in BOTH admin (Falcon/sys) and management (client/acc) consoles, with the FE seed in the
FalconAccess registry. No hardcoding per console.

## Delivered (5 waves)
- **W1 Seed+contract:** falcon-access.registry.ts +voiceRecord group + voiceRecordQuery + VoiceRecordScope
  (resource ${scope}.voice-record, ignoreExpression:true, 6 actions). Golden maps extended in the contract
  test + registry spec. Fixed a PRE-EXISTING managementConsole.organization.edit GOLDEN gap (contract test
  was already red). Contract test GREEN 3/3.
- **W2 Resolver:** per-app voice-service.permissions.ts — resolveVoiceRecordPermissions(access, scope),
  initial write-flags FALSE (no flash), allow-all only on all-deny.
- **W3 Wiring:** both shells inject AccessControlFacade + resolve at mount (mgmt 'acc', admin 'sys') +
  flags signal threaded to children. Every action gated on its own flag (Create/view/preview/share/delete/
  view-shared). Creator gate DROPPED after review (mgmt page acc-owner-only; acc-owner unconditional).
- **W4 Specs+builds:** pes-gating.spec.ts mgmt 16/16 + admin 12/12; nx build mgmt+admin GREEN.
- **W5 Verify:** adversarial review (5 agents) → 0 FE defects, 1 backend merge-ordering caveat.

## Matrix (voice-record, from origin/main BuiltInRoleCatalog)
- sys-admin/ops/products: view+preview allow; create/delete/share deny; NO view-shared (read-only).
- acc-owner + acc-admin: all 6 allow. acc-user: view/create/preview/view-shared allow; delete/share own-only.
- acc.services view: acc-owner allow, acc-admin/acc-user DENY → mgmt page is acc-owner-only.

## Caveats / follow-ups
- RUNTIME: running access-svc (99a93c7) is behind origin/main (785f754, PR 43022) → live PES has no
  voice-record rules → FE takes allow-all fallback (all shows; backend still 403s Falcon writes). Matrix
  activates once PES redeployed from origin/main; FE + access-svc seed must land together.
- sys.voice-record has no view-shared rule → admin's uniform resolver queries it → harmless deny (no admin
  shared tab). Documented in the admin permissions header.
- registry.spec.ts is NOT run by CI vitest (narrow falcon lib config); the contract test is the real gate.
- Shared agent MEMORY.md index is ~390KB (over load limit) — flagged for a compaction decision.
- Memory: project_voice_record_pes_gating_2026_07_01.md. UNCOMMITTED on polishing-v0.4.
