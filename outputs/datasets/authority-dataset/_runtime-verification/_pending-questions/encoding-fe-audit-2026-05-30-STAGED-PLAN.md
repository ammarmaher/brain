---
task-id: encoding-fe-audit-2026-05-30
mode: night-shift-audit (Code & Structure Validation)
status: HELD — staged, awaiting explicit "run it now"
created: 2026-05-30
scope-decision: FE workspace only (user-chosen)
execution-decision: HOLD now; on run = full report + FIX ALL severities (high/med/low)
relationship: PARALLEL to the in-progress current-task.json (brain-sk-portal-...-2026-05-30).
              This staged plan deliberately does NOT overwrite current-task.json.
              On "run it now", park the portal task to task-history, then activate this.
trigger-to-run: user says "run it now" / "run the audit" / "run Night Shift Audit"
---

# Night Shift Audit — Encoding Deep-Dive — STAGED PLAN

## Brain-ask finding (informs the whole run)
The Falcon Knowledge Graph has **no modeled knowledge of encoding**.
`query.js --context "encoding"` → 15 noise matches, 0 V-rules / 0 BRs / 0 PES / 0 gaps / 0 conflicts.
Fuzzy: `i18n` = no results; `utf`/`avro`/`arabic`/`charset` = Tailwind/V-rule noise only.
[BRAIN-OUT] 200-Graph/graph
⇒ Findings derive from [CODE] + [MEMORY], NOT brain rules.
⇒ The blind spot is itself a reportable gap → candidate night-shift-brain follow-up.

## Encoding surface map (read-only recon 2026-05-30, evidence-based)
Workspace: C:\Falcon\Falcon\falcon-web-platform-ui — 127 encode/charset/base64 hits across 49 .ts files.

| Wave | Surface | Targets (evidence [CODE] Grep/Glob) | Agents |
|---|---|---|---|
| A | i18n / Arabic UTF-8 | libs/falcon/src/language/i18n/{en,ar}.json (canonical; .nx/cache + node_modules excluded) | 5 |
| B | base64 / data-URI / JWT decode | falcon-photo-uploader.component.ts; auth.service.ts; session-provider.service.ts; helper.ts (8 hits) | 1,7 |
| C | URL-encoding in HTTP services | templates-http-api.service.ts (11 hits); contracts*.service.ts; contact-group-api.service.ts; commerce-gateway.service.ts; wallet-balance.service.ts | 1,7 |
| D | file BOM / charset hygiene | .ts/.json/.css across workspace (Windows UTF-16-BOM trap [MEMORY]) | 1,2 |
| E | encode-util consistency | helper.ts; svg-icon.registry.ts; popover-portal.ts; named-validators.ts; messages.ts | 1,3 |

## Out of scope (flag + route, do NOT touch — user chose FE-only)
- Backend Avro/Kafka — [MEMORY] BUG-KAFKA-AVRO (open) → night-shift-backend
- Brain-dataset mojibake → brain-verify / night-shift-brain
- .ps1 / .sh BOM hazards

## Run sequence (only after "run it now")
1. git status (read-only). 2. Bound scope + dependency walk. 3. Folder-by-folder 24-item checklist (playbook §3).
4. Dispatch 7 agents in parallel where safe. 5. Merge → dedupe → classify (§7).
6. FIX-MODE = ALL: apply every fix the user pre-authorized (see guardrails). 7. Write 26-section report. 8. Stop + report.

## Fix-mode parameters (user directive: "fix all issues … high, medium, or low")
- fix-mode = ON, all severities. Apply SAFE_AUTO_FIX **and** NEEDS_APPROVAL-class **encoding** fixes.
- HARD guardrails that remain even under "fix all" (CONTRACT §8 + SKILL §11, non-overridable):
  * No commit / no push (needs explicit "commit"/"push").
  * Do NOT silently change auth/JWT/payment/PES/permission/backend-contract **semantics**.
    Protected encoding touch-points: auth.service.ts + session-provider.service.ts (JWT base64 decode = security);
    HTTP services' URL-encoding (feeds backend contracts). For these: apply behavior-PRESERVING encoding fix +
    show before→after. If a fix would necessarily CHANGE security/payment/contract behavior → HALT that item, flag it.
  * Static-by-default: fixes land locally; build/scanner/PES gates run only with separate green-light,
    else fixed items ship with verification: PENDING (never claim runtime-verified without evidence — CONTRACT §8).
  * FE-only scope.

## Deliverable
Brain Outputs/datasets/authority-dataset/_runtime-verification/night-shift-audit-encoding-<YYYY-MM-DD-HHMM>.md
(26 sections + scoring table; source-prefixed; CONTRACT §6 cross-check).

## SoT to load at run time (playbook §1 + CONTRACT §1)
0-MASTER-INDEX.md · VERIFICATION-STATUS.md · 19-night-shift-readiness/{_INDEX,DECISION-PROTOCOL}.md ·
15-implementation-pitfalls/_INDEX.md · ANGULAR_AND_TAILWIND_RULES.md · FALCON_COMPONENT_REGISTRY.md ·
TOKEN_TAXONOMY.md · DEAD-TOKENS.md · prior night-shift-* reports (delta-not-repeat).
