*** Job: full-pipeline-redesign ***
*** End-to-end Brain pipeline: PRD/wiki sync â†’ tri-mindset reasoning â†’ 3-layer planning â†’ gated dev/QA â†’ push prompt ***
*** Triggered by: "night mode" / "fixing night" / "run night job: pipeline" / one phase at a time on demand ***

# Job: Full Brain Pipeline Redesign

## Status

DONE (2026-05-01) â€” split into 10 phases. Each phase is independently triggerable. Do **NOT** run them all in one session â€” context will run out and the voice system might break. Run one phase per night mode invocation. User picks the phase.

## North-star user requirements (verbatim source â€” DO NOT EDIT, this is the contract)

1. **Knowledge layer**
   - Update wiki (sync `C:\falcon\falcon-wiki` from Azure Wiki).
   - Update PRDs (sync from Drive).
   - Understand PRDs â€” parse + summarize each.
   - Pull PRDs by section / by user. If a user folder is missing, create it. Pull all related PRDs with links. Download every link asset: `.xlsx`, `.pdf`, image files.
2. **Per-model reasoning agents**
   - Each mindset (ChatGPT, Claude, Gemini) gets its own agent that reads + reasons on the PRDs and produces a plan + understanding artifact.
3. **Knowledge â†’ ocelot/Obsidian integration**
   - The reasoning output is written into the knowledge graph. Obsidian vault file + schema is refreshed after each knowledge update.
4. **Cron business-gap watcher**
   - A scheduled job scans the business knowledge for gaps, contradictions, unanswered conditions. Saves suggestions to a known location for the user to review.
5. **Task pickup pipeline**
   - On user trigger "get the task" â†’ rate the task, understand it, map it to its PRD. Verify the task is fully covered by PRD, no out-of-scope, no error business, no bug business.
6. **"Let's go" â†’ frontend execution chain**
   - On trigger, run the frontend skill stack: Tailwind, Angular latest, Nx, related rules.
   - Component creation rule: every component gets `services/` folder + `models/` (modules) folder. Component `.ts` must NOT define interfaces/classes â€” those live in `models/`. Services have their own `.ts` and their own `models/` folder.
   - After task finishes, refresh the ocelot/Obsidian links so new features/files are queryable.
7. **Architecture awareness**
   - Before any change, read the architecture wiki to find where the component belongs (permissions, authorization, account-management, contact-group, etc.).
8. **Backend tasks**
   - Backend work uses a different structure: separate module OR use-cases (per the architecture wiki's Clean Architecture rules).
9. **QA loop (gate before code)**
   - Claude pauses BEFORE coding. ChatGPT + Gemini build test cases / test scenarios. Then Claude codes.
   - Any bug found â†’ reassign to Claude. Claude is responsible only for code + structure; ChatGPT and Gemini supervise. ChatGPT prioritizes hints/instructions Claude must follow.
10. **Progress bar 0â€“100%**
    - While Claude works, an async progress indicator advances. Starts at 0 (task accepted), moves through plan/scenarios/implementation, hits 100 only when QA gate passes.
11. **3-layer plan**
    - **L1 â€” abstraction**: high-level shape of the change.
    - **L2 â€” business detail**: business rules, permissions, status transitions, edge cases.
    - **L3 â€” technical deep dive**: implementation steps, file paths, best practices, libraries, patterns.
    - Each layer has an explicit gate that must pass before the next.
12. **Gates**
    - Plan gates â†’ code â†’ QA gate (Gemini + ChatGPT) â†’ return-to-dev OR pass â†’ deployment / PR step.
13. **Push approval (mandatory voice prompt)**
    - NEVER commit. NEVER push. When ready to push, emit a voice prompt + beep: "Boss, I want to push the code. Confirm?" Wait for explicit "yes". On yes: write a polished commit message AND attach a comment block listing all test cases authored by Claude / Gemini / ChatGPT.
14. **Brain folder consolidation**
    - Move `C:\falcon\Brain\settings` â†’ `C:\falcon\Brain\settings`.
    - Verify voices + agent-tts profiles still load after the move.
    - Migrate every reference (scripts, docs, memory, CLAUDE.md).
15. **Old-Brain feature parity**
    - Audit `C:\falcon\Brain\` for features in the old bundle that are missing from the new `C:\falcon\Brain\`. Port anything missing.
16. **Always honor standing user rules**
    - No commit without permission. No push without permission. No UI testing during implementation. Strict task scope. Clean DRY code. Banner-format comments. Tailwind grid first. Identity service for all auth. Discard old UI folders. orchestrator voice. (See feedback notes in `C:\Users\User\.claude\projects\C--falcon\memory\`.)

## Phase plan (run one phase per "night mode" invocation)

| # | Phase | Effort | Risk | Why this order |
|---|---|---|---|---|
| **A** | **Brain folder consolidation** â€” move `brain-skills\settings` â†’ `Brain\settings`, update every path reference, verify voices still play. | 1â€“2 h | High (could break voice) | Risky but foundational; do it cold while no other work is in flight. |
| **B** | **3-layer plan engine** â€” `Brain\plan\plan-l1.md`, `plan-l2.md`, `plan-l3.md` templates + gate script that promotes L1â†’L2â†’L3 only on user "approve". | 2 h | Low | Pure markdown + small dispatcher script; no runtime dependencies. |
| **C** | **Gate-based pipeline orchestrator** â€” state machine over: task-received â†’ L1 â†’ L2 â†’ L3 â†’ scenarios (ChatGPT+Gemini) â†’ code (Claude) â†’ QA (Gemini+ChatGPT) â†’ push-approval. Saves state to `Brain\state\<task-id>.json`. | 3 h | Low | Pure orchestrator; no model calls until skills are wired. |
| **D** | **PRD/wiki/asset sync orchestrator** â€” wraps existing `prd-knowledge` + `wiki-knowledge` skills, adds asset download (xlsx/pdf/images), per-user folder creation. | 4 h | Medium (Drive API) | Heavy Drive integration; isolate to its own session. |
| **E** | **Cron gap detector** â€” Windows Scheduled Task that runs `business-gap-detection` skill nightly, writes findings to `Brain\suggestions\YYYY-MM-DD.md`. | 1 h | Low | Tiny shell + existing skill. |
| **F** | **Task pickup + PRD mapping** â€” `get-the-task` skill: parses Azure DevOps WIID, fetches matching PRD, runs out-of-scope / error-business / bug-business checks, emits a `task-card.md`. | 3 h | Medium | Requires Azure DevOps + PRD index; depends on Phase D done. |
| **G** | **Frontend skill chain "let's go"** â€” Adnan binds `tailwind` + `angular-latest` + `nx-workspace` + component-structure rules into one trigger. Enforces component layout (`services/` + `models/` folders, no class/interface in `.ts`). | 2 h | Low | Compositional only; uses existing brain-skills/Front-End-skills. |
| **H** | **Backend use-case structure rule** â€” same shape as G but for backend (Clean Architecture, use-cases, no app-service-to-app-service calls â€” straight from wiki). | 2 h | Low | Mirrors G. |
| **I** | **Progress bar 0â€“100%** â€” async PowerShell job that emits progress events (1 per significant step) to a status file; renderer reads it and prints/announces. | 2 h | Low | Pure UX layer over the orchestrator from Phase C. |
| **J** | **Push approval voice prompt** â€” when orchestrator hits push-state, plays `Brain "boss I want to push" mp3` + 880Hz long beep, waits for explicit "yes", then writes a curated commit message + test-comment block (Claude/Gemini/ChatGPT contributions). | 1 h | Low | Adds the final gate to Phase C. |

## Phase A detailed checklist (the move)

When user triggers `night mode: phase A` or `do the brain folder move`:

1. **Inventory references** â€” `Grep` for `brain-skills\\settings` AND `Brain/settings` across:
   - `C:\falcon\brain-skills\**\*.ps1`
   - `C:\falcon\brain-skills\**\*.md`
   - `C:\falcon\CLAUDE.md`
   - `C:\Users\User\.claude\projects\C--falcon\memory\*.md`
   - `C:\Users\User\.config\agent-tts\config.js`
2. **Stop agent-tts** so it doesn't lock files mid-move.
3. **Move** `C:\falcon\Brain\settings` â†’ `C:\falcon\Brain\settings` (preserve subtree).
4. **Rewrite all references** to the new path. Use `Edit` per file (Grep first, then surgical replace).
5. **Re-run** `apply-settings.ps1` â€” confirm `~/.config/agent-tts/config.js` regenerates with new paths.
6. **Smoke test** â€” render one envelope mp3, play it. Then play one alert from each mindset.
7. **Restart agent-tts**.
8. **Update Skill.md / SOUNDS.md / INSTRUCTIONS.md** path references.
9. **Update memory** â€” `feedback_brain_skill.md` + `feedback_skill_status_announcer.md` path references.
10. **Local commit** (no push, per standing rule). Wait for explicit user "push" before pushing.

## Phase A done definition

- `C:\falcon\Brain\settings\` no longer exists.
- `C:\falcon\Brain\settings\sound\settings.json` exists and is the source of truth.
- `apply-settings.ps1` regenerated `config.js` with no broken paths.
- Demo plays one envelope + one alert end-to-end with no errors.
- All grep hits for the old path return zero.

## Out of scope for THIS job (entire pipeline)

- Touching any service code outside `C:\falcon\Brain\`, `C:\falcon\Brain\`, and the memory folder.
- Re-rendering existing voice mp3s unless paths force it.
- Auto-pushing to remote.
- Auto-running tests against the actual Falcon services.

## Done definition for the WHOLE pipeline

- All 10 phases marked DONE in this file.
- Adnan has a single trigger `let's go on <feature>` that walks: PRD verify â†’ 3-layer plan â†’ ChatGPT/Gemini scenarios â†’ Claude code â†’ QA loop â†’ push-approval voice prompt.
- Voice progress bar advances live.
- Every voice phrase respects state (depends on context-aware-alerts job â€” Phase 0).
- No regression in current Brain voices/scripts.
