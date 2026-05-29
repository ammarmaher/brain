# Night Shift Wave #3 — Kickoff Prompt

> Paste the content **inside the fenced block below** as the first message in a NEW Claude Code session opened at `C:\Falcon`.

---

````
You are Adnan / Jakco operating in NIGHT SHIFT autonomous orchestrator mode at C:\Falcon. This is Night Shift Wave #3 — a merged execution wave consolidating every plan we have. Take your time. Take auto-pilot. You have full orchestrator authority, multiple parallel senior-architect agents at your disposal, and no need to ask which path to take (per feedback_self_explore). Do not commit, do not push, build must be green per app, source-prefix every Falcon fact.

# Phase 0 — Brain-first onboarding (MANDATORY before any work)

Read these in order. Cite them with the source-prefix rule for the rest of the session.

1. [BRAIN-OUT] C:\Falcon\Brain Outputs\datasets\authority-dataset\0-MASTER-INDEX.md
2. [BRAIN-OUT] C:\Falcon\Brain Outputs\datasets\authority-dataset\VERIFICATION-STATUS.md
3. [BRAIN-OUT] C:\Falcon\Brain Outputs\datasets\authority-dataset\19-night-shift-readiness\DECISION-PROTOCOL.md
4. [BRAIN-OUT] C:\Falcon\Brain Outputs\reports\night-shift-2026-05-16\REPORT.md  (Wave #1 — audit + safe fixes)
5. [BRAIN-OUT] C:\Falcon\Brain Outputs\reports\night-shift-2026-05-16\01-rules-digest.md  (38 rules, 3 severity tiers)
6. [BRAIN-OUT] C:\Falcon\Brain Outputs\reports\night-shift-2026-05-16\02-token-registry-quick-grep.txt  (3,485 vars + 2,251 Tailwind class prefixes for reality checks)
7. [BRAIN-OUT] C:\Falcon\Brain Outputs\reports\night-shift-2026-05-16\05-fixes\00-AGGREGATION-AND-FIX-PLAN.md  (Wave #1 deferred-tier register)
8. [BRAIN-OUT] C:\Falcon\Brain Outputs\datasets\old-ui-dataset\REPORT.md  (Wave #2 — Old UI Dataset)
9. [BRAIN-OUT] C:\Falcon\Brain Outputs\datasets\old-ui-dataset\00-INDEX.md
10. [BRAIN-OUT] C:\Falcon\Brain Outputs\datasets\old-ui-dataset\99-registries\02-API-REGISTRY.md  (88 endpoints)
11. [BRAIN-OUT] C:\Falcon\Brain Outputs\datasets\old-ui-dataset\99-registries\04-PES-REGISTRY.md  (56 PES keys)
12. [BRAIN-OUT] C:\Falcon\Brain Outputs\understanding\pages\organization-hierarchy\Add Client\README.md  (canonical Add Client flow playbook)
13. [BRAIN-OUT] C:\Falcon\Brain Outputs\understanding\pages\organization-hierarchy\Add Client\08-BACKEND_API.md  (Add Client backend contract)
14. [BRAIN-SK] C:\Falcon\Brain SK\CLAUDE.md  (implementation source-of-truth chain)
15. [BRAIN-SK] C:\Falcon\Brain SK\_obsidian\00-Home\IMPLEMENTATION_KNOWLEDGE_MAP.md
16. [MEMORY] All memory entries listed in the Platform Knowledge section of MEMORY.md — pay special attention to:
    - project_night_shift_2026_05_16.md  (Wave #1 record)
    - project_old_ui_dataset_2026_05_16.md  (Wave #2 record)
    - project_falcon_component_validation_convention.md  (component + validation doctrine; reference impl: add-user-wizard)
    - project_local_backend_test_users_2026_05_16.md  (live local backend for runtime verification)
    - project_add_user_backend_pes_integration.md  (Add User integration — STEPPER REFERENCE)
    - project_admin_console_users_filter_search_removed.md
    - feedback_falcon_custom_library_mandatory.md  (Falcon library first)
    - feedback_library_skeleton_app_api.md  (skeleton vs wrapper)
    - feedback_no_inline_styles_tokens_only.md
    - feedback_orchestrator_failure_modes_org_hierarchy.md  (the 10 locked rules from the org-hierarchy disaster)
    - feedback_pes_g_link_uses_zitadel_id.md  (PES standing rule)
    - feedback_test_user_password_standard.md  (Admin@1234 — replaced Pass123!)
17. [VAULT] C:\Falcon\falcon-wiki\00-MOCs\Night-Shift-2026-05-16.md
18. [VAULT] C:\Falcon\falcon-wiki\00-MOCs\Old-UI-Dataset-Index.md
19. [VAULT] All 10 gap notes in falcon-wiki\70-Gaps\GAP-NS0[1-6]*.md + GAP-OLDUI-0[1-4]*.md

**Verification gate** — before any task you must be able to answer with file:line citations:
- What does Wave #1 leave deferred? (the 6 GAP-NS gaps)
- What does Wave #2 surface as backend hygiene gaps? (the 4 GAP-OLDUI gaps)
- What is the canonical stepper reference? (Add User wizard at apps/admin-console/.../add-user-wizard/)
- What is the canonical Add Client playbook root? (Brain Outputs/understanding/pages/organization-hierarchy/Add Client/)
- Which tokens are runtime-verified? (per VERIFICATION-STATUS.md)

If you cannot answer all five with citations, drill deeper before proceeding.

# Phase 1 — Mission framing

**Goal:** advance the front-end from "audit-clean" (Wave #1 finished) to "architecture-clean + backend-wired + UI-unified" through a merged plan that closes Wave #1 deferreds, addresses Wave #2 backend-hygiene gaps, unifies the stepper pattern across all wizards, and delivers the Add Client wizard using the new stepper + the validated backend contract from the Old-UI Dataset.

**Quality posture:**
- Architect-level — every change supports a clean architecture, not just a green build.
- Coding-strategy — Falcon library first, skeleton+wrapper boundary, signals over decorators, @if/@for over *ngIf/*ngFor, input()/output() over @Input/@Output, models/services/resolvers/directives folder convention per project_falcon_component_validation_convention.md.
- Cleaning-strategy — tokens-only, no SCSS, no PrimeNG, no inline styles, no hardcoded z-index, no console.log residue, no @ts-ignore.
- Runtime-verified where possible — local backend stack is live; use it to RUNTIME-VERIFY any feature you touch (login → flow → assertion). Mark facts ✋ runtime-verified vs 🟡 structurally-checked vs 🔴 unverified per VERIFICATION-STATUS.md convention.

# Phase 2 — Merged plan (7 tiers, sequenced)

Below is the consolidated plan. Tiers run in order. Inside a tier, dispatch parallel agents where scopes are non-overlapping. Always build-green-gated; roll back on red.

## TIER A — Pre-flight unblock
A.1 Identify and fix the "40+ pre-existing Stencil/Angular compile errors" flagged in the brain-first STANDING TRUTHS as blocking FE-level UI verification. Without this fix, runtime verification of subsequent tiers is impossible. Dispatch one senior-architect agent to catalog the 40+ errors, then a fix agent per non-overlapping file cluster. Build verify per app at the end.
A.2 If the cause is workspace-state (e.g. tsconfig drift, lockfile mismatch), document it as the root cause and apply the minimal fix; do not pollute application code.

## TIER B — Wave #1 deferred Tier-4 fixes (the 6 GAP-NS gaps, build-green-gated)

B.1 — GAP-NS02 SCSS / styleUrls purge (workspace-wide, sequential per app to maintain green builds)
  - apps/admin-console/src/styles.scss + apps/admin-console/project.json (inlineStyleLanguage: "scss") — remove in lockstep
  - apps/management-console/src/styles.scss + apps/management-console/project.json — same
  - 5 SCSS files in apps/host-shell/src/app/features/auth/ — DEFER to B.4 (auth rebuild owns this)
  - 8 lib .scss files in libs/falcon-ui-core — remove per component, replace with Tailwind utilities
  - 17 styleUrls: [ Angular wrapper arrays in libs/falcon-ui-core — collapse to host bindings
  - Build verify per app after each batch

B.2 — GAP-NS01 @Input/@Output → input()/output() codemod (libs/falcon-ui-core, 871 sites)
  - Staged ts-morph codemod in batches of ~30 components per family
  - Build verify after each batch
  - Audit imports: replace { Input, Output } with { input, output } per file
  - Preserve generics, default values, required-ness

B.3 — GAP-NS06 Phantom warning/success/danger tokens
  - HALT-AND-FLAG: this requires a UX decision (extend Noor palette with warning/success/danger intents, OR remap usages to existing palette names like text-falcon-amber-700)
  - Write _pending-questions/GAP-NS06-token-mapping.md per DECISION-PROTOCOL.md
  - Do NOT invent token names; ask
  - Move on without blocking other tiers

B.4 — GAP-NS03 Host-Shell auth rebuild
  - 5 SCSS files (~1,720 lines), 163 phantom --login-* tokens, raw <input>/<button> bypassing Falcon library
  - Multi-step: (a) define or remap --login-* tokens (probably remap; halt-and-flag like B.3 if ambiguous), (b) rebuild login / OTP / forgot-password / change-password on Tailwind utilities + Falcon library, (c) delete the 5 SCSS files, (d) runtime-verify the login flow against the live local backend per project_local_backend_test_users_2026_05_16.md (use sys-* or acc-* users on tenant test-tenant-001, password Admin@1234)
  - This is the multi-day item; do as far as is safe inside this wave then leave a follow-up note

B.5 — GAP-NS04 admin-console otp-dialog rebuild (single file)
  - apps/admin-console/.../otp-dialog.component.html — strip inline <style> block, 9 inline style attrs, 12 hardcoded font-sizes; rebuild on Tailwind + canonical typography tokens
  - Runtime-verify OTP flow

B.6 — GAP-NS05 Library-first refactors
  - 11 raw <input> + 1 hand-rolled toggle + hand-rolled topbar menu → Falcon equivalents (<falcon-input>, <falcon-switch>, <falcon-menu>)
  - Per-feature mini-batches; runtime-verify each affected screen

## TIER C — Stepper unification (NEW)

**User instruction:** every stepper in the workspace must use the same pattern as the Add User wizard's stepper. The Add User wizard is the reference implementation (project_falcon_component_validation_convention.md cites apps/admin-console/.../add-user-wizard/).

C.1 Inventory every stepper in the workspace:
  - grep workspace for `<falcon-angular-stepper`, `<p-steps`, `<app-*-stepper>`, `*stepper*` component names
  - Capture: file:line, stepper-implementation-flavor, consumer wizard
  - Output: inventory table at C:\Falcon\Brain Outputs\reports\night-shift-wave-3\01-stepper-inventory.md

C.2 Document the Add User stepper as the canonical reference:
  - Read every file in apps/admin-console/.../add-user-wizard/
  - Capture the stepper component used, its inputs/outputs, how step labels are computed, how step-validity is gated, how Previous/Next/Cancel/Finish buttons are wired, how the stepper renders horizontal-with-green-checkmarks per the HTML truth in memory project_org_hierarchy_html_conversion.md Wave 5
  - Output: C:\Falcon\Brain Outputs\reports\night-shift-wave-3\02-stepper-reference-spec.md

C.3 Migrate every non-conforming stepper to the canonical pattern:
  - One agent per wizard (parallel, non-overlapping files)
  - Build verify per migration
  - Runtime-verify each wizard against the live backend (open the wizard, walk through every step, assert step-validity gating, assert Previous/Next/Finish all behave correctly)

C.4 Capture the refactor in the vault and memory.

## TIER D — Add Client wizard implementation

This is the next big feature. Backend contract is solid (per Wave #2 Old-UI Dataset). The new theme rebuild needs this wizard built using the canonical stepper from TIER C.

D.1 Read the canonical Add Client playbook:
  - C:\Falcon\Brain Outputs\understanding\pages\organization-hierarchy\Add Client\README.md  (entry)
  - Then read all the 17 files: 01..16 + README per the Brain SK chain
  - Cross-reference Cluster 14 (Flow Playbook Integration) of the Authority Dataset

D.2 Read the captured backend contract for Add Client:
  - C:\Falcon\Brain Outputs\datasets\old-ui-dataset\10-pages\admin-console\organization-hierarchy\03-SERVICES-APIS.md (every Create-Client endpoint)
  - 04-DTOS.md (the 7-DTO wizard tree, AccountInformationModel with 17 fields, ClientSettingsModel, etc.)
  - 05-PES.md (the 13 PES keys)
  - 06-VALIDATIONS.md (every form validator + business rule)

D.3 Build the wizard in apps/admin-console/.../create-client-wizard/ (or wherever the active rebuild branch wants it — check the structure on polishing-v0.4):
  - Use the canonical stepper from TIER C
  - 5 steps per the Old UI: Information → Settings → CommChannels → Application → Account Owner
  - Each step is a self-contained component per project_falcon_component_validation_convention.md (with models/, services/, validations/, directives/)
  - Wire PES checks via AccessControlFacade.resolveFlags({...}) batched
  - Wire validations via FALCON_VALIDATIONS registry + per-component InjectionToken+RulesProvider factory
  - Wire backend per the captured contract — every URL/method/DTO must match what main is using; do NOT invent contracts
  - Use Gateway.SystemGateway default (admin-console scope)
  - Runtime-verify end-to-end against the live local backend

D.4 If anything in the playbook ↔ contract pairing is ambiguous, HALT-AND-FLAG (don't invent business rules or DTO shapes from training data).

## TIER E — Wave #2 backend-hygiene gaps

E.1 — GAP-OLDUI-01 URL prefix consistency (workspace-wide)
  - Audit every service for the prefix mix (api/commerce/, commerce/, commerce/Node PascalCase, lowercase commerce/node/)
  - Pick ONE canonical convention (recommend lowercase + no api/ prefix since the gateway already strips api/)
  - Migrate non-conforming callers (mechanical replacements via Edit)
  - Build verify

E.2 — GAP-OLDUI-02 Add PES gating to admin-console/contracts-cost-management
  - 0 PES keys today (only app-level guard)
  - Define keys: FalconAccess.adminConsole.contract.view, create, edit, delete, pricing, etc.
  - Wire route guard + component-level batched checks
  - Runtime-verify with a non-Falcon user (should be denied)

E.3 — GAP-OLDUI-03 Cross-app sibling imports
  - mgmt/contracts-cost-management imports admin-console files via 5-level relative paths
  - Extract shared components/services to libs/falcon/ or new libs/shared-contracts/
  - Update both consumers
  - Build verify both apps

E.4 — GAP-OLDUI-04 Wallet cell-edit dead code
  - Either complete the cell-edit feature (save per-cell balances to a real endpoint) OR remove the inputs entirely
  - HALT-AND-FLAG to ask UX which direction
  - Document the decision in the gap note

## TIER F — Architecture, coding, and cleaning continuous improvement

These run as background tasks across every tier — not a discrete tier, more a quality posture you maintain throughout the wave.

F.1 Architecture
  - Every refactor must preserve or improve the skeleton+wrapper boundary (skeleton = presentational, wrapper = service-injecting)
  - Every new component must follow the models/ services/ resolvers/ directives/ folder convention
  - Every new feature must place its file structure per project_falcon_component_validation_convention.md
  - Cross-app sharing happens through libs only — no sibling imports

F.2 Coding strategy
  - Signals over RxJS where applicable
  - input()/output()/model() over decorator forms
  - @if/@for/@switch over *ngIf/*ngFor/*ngSwitch
  - Reactive forms via FormBuilder (no template-driven)
  - inject() over constructor injection
  - Standalone components (no standalone: true literal — that's the v20+ default)

F.3 Cleaning strategy
  - Tokens-only — every var(--xxx) and Tailwind class must resolve in the token registry
  - No SCSS, no component CSS, no styleUrls arrays
  - No PrimeNG, no PrimeIcons, no Aura
  - No hardcoded z-index — use the canonical Tailwind ladder z-falcon-* + --falcon-overlay-z-index for portals
  - No inline style="..." (computed [style.foo.unit] is allowed)
  - No console.log residue
  - No TODO/FIXME without an issue number
  - No @ts-ignore / @ts-nocheck

F.4 RTL hygiene
  - Logical properties throughout: ps-/pe- not pl-/pr-, ms-/me- not ml-/mr-, text-start/text-end not text-left/right, start-/end- not left-/right-
  - Tailwind v4 supports all of these natively in this workspace

F.5 i18n hygiene
  - Every user-facing string must come from a translate pipe
  - MultiLanguageName = { en, ar } for every label/title in DTOs

## TIER G — Knowledge capture (continuous)

For every tier you finish:
G.1 Update Obsidian vault — per-folder notes + gap-close notes
G.2 Update shared memory — one-line summary in MEMORY.md + a detailed memory file
G.3 Update Authority Dataset scanner if a watched file changed (re-run the scanner via the powershell scripts at falcon-wiki/scripts/)
G.4 If VERIFICATION-STATUS.md changes (something moves 🔴 → 🟡 → ✋), update it.

# Phase 3 — Methodology (how to execute)

- Use TodoWrite to track tier progress. One in-progress item at a time.
- Dispatch parallel senior-architect / fix agents per non-overlapping scope (libs / admin / host / mgmt).
- Read before Edit every time — file state may shift inside this wave.
- Build verify per app after every batch — never ship red.
- Roll back on red, don't press on.
- Source-prefix every fact: [CODE] / [BRAIN-OUT] / [VAULT] / [BRAIN-SK] / [MEMORY] / [INFERRED — must flag]
- Halt-and-flag when ambiguity score ≥ 7 or any security/data-integrity fork lacks a rule. Write _pending-questions/<task>-<fork>.md per DECISION-PROTOCOL.md.
- Runtime-verify against the live local backend wherever possible (test users on tenant test-tenant-001, password Admin@1234, login via Identity OTP — dev exposes devOtpCode).

# Phase 4 — Standing rules (non-negotiable)

- No commits unless the user types "commit" in their next message
- No pushes unless the user types "push" in their next message
- No edits to the deprecated-falcon-web-platform-ui folder
- No edits to the WebstormProjects duplicate path
- Worktree at C:\Falcon\Brain Outputs\worktrees\falcon-old-ui-main\ is READ-ONLY (it's origin/main — never edit there)
- Tokens-only enforcement: every substitution must be registry-verified against quick-grep
- Falcon library first: hand-rolled markup is a GAP, not a fix
- No PrimeNG / PrimeIcons / SCSS in new code
- Build must be green per app at the end of every tier

# Phase 5 — Acceptance criteria per tier

- TIER A: pre-flight compile errors fixed, 4/4 builds green
- TIER B: GAP-NS01..06 either resolved or further-scoped with a halt-and-flag note
- TIER C: stepper inventory documented, reference spec captured, every non-conforming wizard migrated, runtime-verified
- TIER D: Add Client wizard built using canonical stepper, backend contract preserved per Old-UI Dataset, runtime-verified end-to-end
- TIER E: GAP-OLDUI-01..04 either resolved or further-scoped with halt-and-flag
- TIER F: zero new violations of the 38-rule digest introduced
- TIER G: vault + memory + Authority Dataset scanner all up to date

# Phase 6 — Stop conditions

Stop the wave and ask the user when:
- A halt-and-flag fork has no answer in the brain (security/data-integrity)
- A build cannot be brought back green after rollback
- Runtime verification fails repeatedly against the live backend (suggests an actual regression, not a flaky test)
- Context budget is approaching limits (save state per the brain protocol; create a checkpoint via the brain skill at C:\Falcon\.claude\skills\brain\SKILL.md)

# Phase 7 — Output workspace

Persist all per-tier artifacts under:
C:\Falcon\Brain Outputs\reports\night-shift-wave-3\
├── 00-PLAN.md  (mirror this prompt's plan)
├── 01-stepper-inventory.md
├── 02-stepper-reference-spec.md
├── 03-tier-A-preflight-fixes.md
├── 04-tier-B-fixes\
│   ├── GAP-NS01-codemod-log.md
│   ├── GAP-NS02-scss-purge-log.md
│   ├── GAP-NS03-auth-rebuild-log.md
│   ├── GAP-NS04-otp-rebuild-log.md
│   ├── GAP-NS05-library-first-log.md
│   └── GAP-NS06-token-mapping-pending.md
├── 05-tier-C-stepper-migration\
│   └── <per-wizard>-migration-log.md
├── 06-tier-D-add-client-wizard\
│   ├── BUILD-LOG.md
│   ├── RUNTIME-VERIFICATION.md
│   └── CONTRACT-PARITY.md
├── 07-tier-E-backend-hygiene\
│   ├── GAP-OLDUI-01-url-prefix-log.md
│   ├── GAP-OLDUI-02-contracts-pes-log.md
│   ├── GAP-OLDUI-03-shared-lib-extraction-log.md
│   └── GAP-OLDUI-04-wallet-dead-code-pending.md
├── 08-build-verify\
│   └── build-log.md  (every nx build run with hashes)
├── 09-obsidian-writebacks\
│   └── (list of vault notes written)
└── REPORT.md  (final master summary)

# Phase 8 — Resume trigger for follow-up sessions

If this wave runs long and a follow-up session is needed, the user can resume with:
- `continue Night Shift Wave #3`
- `work TIER <X> of Night Shift Wave #3`

Confirm readiness in your first message of the new session by:
1. Acknowledging the brain-first protocol
2. Listing the 7 tiers and where you'll start
3. Spawning the Phase 0 read agents in parallel
4. Marking a chapter "Night Shift Wave #3 — Merged Execution"
5. Beginning TIER A pre-flight unblock

Take your time. Take auto-pilot. The user has given you full orchestrator authority.
````

---

# What's inside this prompt (so the user knows before pasting)

| Section | Purpose |
|---|---|
| Phase 0 | Brain-first onboarding — 19 mandatory reads (Master Index, Verification Status, both Night Shift reports, Old UI Dataset, Add Client playbook, Brain SK, memory entries, vault MOCs, all 10 gap notes) |
| Phase 1 | Mission framing — architect-clean + backend-wired + UI-unified quality posture |
| Phase 2 | **The merged plan in 7 tiers (A→G)** with explicit task lists |
| Phase 3 | Methodology (parallel orchestration, build-green-gated, halt-and-flag) |
| Phase 4 | Standing rules (non-negotiable — no commits/pushes, no PrimeNG/SCSS, etc.) |
| Phase 5 | Acceptance criteria per tier |
| Phase 6 | Stop conditions (when to ask the user) |
| Phase 7 | Output workspace structure (where to write artifacts) |
| Phase 8 | Resume trigger for follow-up sessions |

## Tier summary (the 7 tiers in the merged plan)

| Tier | Scope |
|---|---|
| **A** | Pre-flight unblock — fix the 40+ pre-existing Stencil/Angular compile errors that block FE-level UI verification (per STANDING TRUTHS) |
| **B** | Wave #1 deferred gaps — GAP-NS01..06 (SCSS purge, @Input/@Output codemod, phantom tokens, auth rebuild, otp-dialog rebuild, library-first refactors) |
| **C** | **Stepper unification (NEW)** — inventory all steppers, document Add User as canonical reference, migrate every non-conforming wizard |
| **D** | **Add Client wizard implementation** — use canonical stepper + Old UI Dataset backend contract + Authority Dataset playbook |
| **E** | Wave #2 backend-hygiene gaps — GAP-OLDUI-01..04 (URL prefix consistency, contracts-PES gap, cross-app imports, wallet dead code) |
| **F** | Architecture / coding-strategy / cleaning continuous improvement (38-rule digest enforcement throughout) |
| **G** | Knowledge capture (Obsidian vault + memory + Authority Dataset scanner refresh) |

## Saved to disk for safekeeping
`C:\Falcon\Brain Outputs\reports\night-shift-wave-3\KICKOFF-PROMPT.md` — open it anytime to re-copy.

When you start the new session, paste **only the fenced ` ```` ` block contents** from above (or from the saved file). The new session will load the brain-first protocol automatically (via the SessionStart hook) and then your pasted plan will activate Night Shift Wave #3 mode.