---
name: feedback_backend_is_sot_do_not_author_backend_2026_07_01
description: STANDING RULE — the Falcon backend is the source of truth; do NOT author backend changes. Feature work is FE-only; PES lives in the backend (untouchable).
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 5976432b-1428-415f-a958-f9c51cccf11d
---

**The Falcon backend is the SOURCE OF TRUTH — do NOT change/author backend code.** The user stated (2026-07-01): "make sure you are not changing anything in the backend. The backend is a source of truth, and also all PES integration is inside the backend."

**Why:** the backend (services under `C:\Falcon\Falcon\falcon-core-*` incl. access-svc/PES) is the authoritative contract. PES authorization + the domain DTOs/handlers are owned there; the FE consumes them. Authoring backend code from an FE task creates drift and bypasses the backend team's PR process.

**How to apply:**
- Feature work is **FE-only**. When a feature needs a backend field/endpoint that does NOT exist (e.g. the Voice Service per-row IVR lock needed a `usedInIvr` field on the list DTO), do **NOT** add it. **Flag it as blocked-on-backend** (needs a proper backend-team PR) and either keep the FE ready-to-consume or leave it out — ask the user which.
- **Never** edit access-svc / PES rules (BuiltInRoleCatalog etc.) — all PES integration is backend SoT. The FE only *reads* PES via `pes/authorize/resources` and mirrors the vocab in the FalconAccess registry (verified, not authored).
- Syncing a LOCAL backend checkout to already-merged `origin/main` (a git ff-pull) + redeploying to make the SoT live is OK **only when the user explicitly asks** (e.g. "take the latest from PES", 2026-07-01) — that is using the SoT, not authoring it. Still report it.

**What triggered this:** I added `usedInIvr` + a batch usage reader + handler wiring to `falcon-core-templates-svc` for the Voice Records lock. That violated the rule. **Reverted** surgically (kept the prior-session sharedUsers/sharedWith work), rebuilt, redeployed, verified the list API no longer emits it. See [[project_voice_record_ivr_lock_and_header_layout_2026_07_01]]. Related: [[feedback_fe_no_commit_no_branch_without_instruction_2026_06_22]].
