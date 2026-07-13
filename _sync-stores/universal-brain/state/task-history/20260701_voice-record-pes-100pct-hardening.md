# Voice Service PES gating → 100% PES-driven (fail-closed) + live vocab verification

Date: 2026-07-01 · Agent: claude · Branch: polishing-v0.4 (UNCOMMITTED) · Status: DONE (reviewed, 0 defects)

## Trigger
User challenged: "are we relying on the PES API 100%, or adding values statically?" Traced the code +
proved the decision path is fully dynamic, then hardened the two static layers.

## Decision path (proven dynamic)
resolveVoiceRecordPermissions → AccessControlFacade.resolveFlags → AccessControlClient.authorizeResources
→ POST {baseURLPes}/pes/authorize/resources (subject built from the LIVE session roles). No permission
decision is hardcoded; the sys=read-only/acc=full matrix lives only in backend BuiltInRoleCatalog.

## Wave A — Layer 2 (seed/fallback) → 100% PES, fail-closed
- Deleted the static allow-all fallback + the read-true seed. Resolver returns the PES result over an
  all-deny baseline (deniedVoiceRecordFlags all-false). No static value can grant access.
- Both shells seed flags all-false + set a flagsLoaded signal in .finally → content renders ONLY after
  PES answers, and a PES error fails closed (never stuck on loading).
- Child input defaults flipped allowAll→denied. i18n +voiceRecords.loadingPermissions (en+ar).
- nx build mgmt+admin GREEN; pes-gating.spec ×2 updated (fail-closed + flagsLoaded) 30/30 PASS.

## Wave B — Layer 1 (descriptors) → live PES vocab verification (PASS)
- scratchpad/wave-b-verify-vocab.js reads the registry voiceRecordQuery('<action>') strings + diffs them
  against the live pes/policyrulesByObj catalog as accowner+sysadmin → all FE actions present (acc 6,
  sys 5 no view-shared), zero drift.

## Wave C — SKIPPED (user decision)
Runtime action-set discovery from pes/policyrulesByObj is feasible (client HTTP 200) but returns 774
CROSS-TENANT rules for acc.voice-record (heavy payload + leaks every tenant's role structure to any
client) just to learn 6 action names, and the button↔action mapping stays FE regardless. A+B sufficient.

## Verification
- nx build ×2 GREEN; pes-gating.spec ×2 30/30; Wave B live cross-check PASS.
- Adversarial review (fail-closed correctness + gate completeness/regression, per-finding verify) → 0 defects.

## Honest limit
PES is a decision PDP; the UI→(resource,action) binding is irreducibly FE — but it's verified against
live PES (Wave B) and fail-safe to deny (a wrong string → PES denies), never a hardcoded decision.

## Caveats
- Fail-closed means: if PES is down/unprovisioned the screen shows NO actions (deliberate, per user).
- Shared MEMORY.md index ~390KB (over load limit) — flagged for a compaction decision.
- All FE UNCOMMITTED on polishing-v0.4. access-svc on 785f754 (PES redeployed, serving).
