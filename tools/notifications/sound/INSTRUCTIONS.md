*** Falcon Brain Skills â€” Voice Trigger Instructions ***
*** Master list of phrases that activate each business skill. Source: settings.json:skills.*.triggers ***

# Voice / Trigger Instructions

You can say (or type) any of these phrases to activate a skill. Each one is detected by Adnan + the appropriate Ammar agent. When a skill activates you will hear:

1. The skill's voice say `<skill> running.`
2. ...work happens...
3. The skill's voice say `<skill> complete.`
4. The skill's beep signature
5. **bm_george (British male) say `I am finishing, boss.`**
6. The global completion beep (1320 Hz Ã— 2)

---

## prd-knowledge â€” voice `bm_george`

Sync, version, and diff PRDs from Drive.

**Triggers:**
1. take latest from PRD
2. update PRD knowledge
3. sync PRDs
4. refresh PRD
5. pull PRD from Drive
6. import PRD
7. fetch latest PRDs
8. PRD sync
9. what does the PRD say about [module]
10. show me the latest PRD
11. what changed in the PRD
12. diff PRD

---

## domain-glossary â€” voice `bm_lewis`

Lock Falcon vocabulary (En/Ar) and validate every artifact against it.

**Triggers:**
1. validate against glossary
2. check glossary
3. add glossary term
4. regenerate glossary index
5. what does this term mean
6. is this term canonical
7. find banned terms
8. translate to Arabic
9. what is the canonical term for [X]
10. are there synonyms for [X]
11. show disambiguation for [X]
12. glossary status

---

## module-catalog â€” voice `bm_daniel`

Per-module dossier â€” scope, surfaces, decisions, open questions.

**Triggers:**
1. what does module [X] do
2. describe module [X]
3. open module dossier [X]
4. module catalog index
5. list all modules
6. who owns module [X]
7. module decisions
8. show open questions for [X]
9. module surface map
10. where does module [X] live
11. what module owns [entity]
12. create new module dossier

---

## test-case-authoring â€” voice `bm_fable`

PRD requirements â†’ Gherkin scenarios + acceptance criteria + traceability.

**Triggers:**
1. generate test cases for all PRD
2. generate test cases for [module]
3. author tests for [X]
4. build test plan
5. test plan for [module]
6. edge cases for [feature]
7. permission matrix for [module]
8. Gherkin scenarios for [feature]
9. coverage matrix for [module]
10. regenerate tests
11. trace TC to PRD
12. list test IDs for [module]

---

## business-pipeline â€” voice `bf_emma` (orchestrator)

Single-trigger that runs prd-knowledge â†’ domain-glossary â†’ module-catalog â†’ test-case-authoring in order.

**Triggers:**
1. run business
2. do business
3. business pipeline
4. full business sync
5. business everything
6. business run

---

## brain â€” voice `bm_v0george` (tri-mindset orchestrator, slowed Russian-accent cadence)

External-AI escalation lane. Routes tasks to ChatGPT (strategic), Claude (tactical), or Gemini (verification). Each mindset has its OWN distinct British male voice (see Brain mindsets section below).

**Triggers:**
1. use brain
2. engage brain
3. brain analyze
4. tri-mindset
5. ask gemini [prompt]
6. ask chatgpt [prompt]
7. brain route
8. brain plan
9. brain orchestrate
10. run brain

---

## Brain mindsets â€” three distinct male British voices, slowed for Russian-accent cadence

When Brain delegates to a mindset, that mindset's voice answers (not the brain envelope voice).

| Mindset | Voice | Speed | Engaged phrase |
|---|---|---|---|
| ChatGPT | `bm_v0george` | 0.85 | `ChatGPT engaged, comrade.` |
| Claude | `bm_v0lewis` | 0.90 | `Claude engaged, comrade.` |
| Gemini | `bm_daniel` | 0.88 | `Gemini engaged, comrade.` |

**API keys:** `C:\falcon\Brain\config\keys.env` (gitignored). Run `scripts\test-keys.ps1` to verify.

---

## Global

These phrases work regardless of skill:

- `read your last response aloud`
- `speak the summary`
- `start agent TTS` / `stop agent TTS`
- `mute the announcer` / `unmute the announcer`
- `change voice to [voice-id]` (edit settings.json then `apply-settings.ps1`)
- `list command` / `list commands` / `list instructions` / `list prd commands` / `list prd instructions` â€” print this command reference table back to chat

Editing triggers: `Brain/settings/sound/settings.json` â†’ `skills.<skillName>.triggers[]` â†’ re-run `scripts/apply-settings.ps1`.

---

## Full PRD Commands Reference (migrated from OLD claude-falcon-skills)

| # | Command | Aliases | What it does | Touches files | Restrictions |
|---|---|---|---|---|---|
| 1 | `take latest from PRD` | `update PRD knowledge` | Full PRD sync: scan Drive â†’ pick latest per `v<number>` rule â†’ rewrite each module's `README.md`, `latest-prd.md`, `understanding.md`, `attachments.md`, `source-map.json` â†’ download every original Drive file into `modules/<slug>/assets/` with **OVERWRITE** | `prd-knowledge/modules/**/*.md`, `prd-knowledge/modules/**/source-map.json`, `prd-knowledge/modules/**/assets/**` | No app code; no packages; no migrations; `test-cases.md` NOT modified; STOP if Drive inaccessible |
| 2 | `update PRD knowledge` | `take latest from PRD` | Same as #1 | Same | Same |
| 3 | `generate test cases for all PRD` | â€” | Generate `test-cases.md` for every synced module from `latest-prd.md` + `understanding.md` + `attachments.md` (entries with `used_for_understanding: yes`) | `test-case-authoring/modules/**/test-cases.md` | Emits sound `Peeep / PeeeP / Peeep`; no fabrication if PRD missing |
| 4 | `generate test cases for [module name]` | â€” | Same as #3 but scoped to ONE module | `test-case-authoring/modules/<slug>/test-cases.md` | Same sound; only the named module touched |
| 5 | `list command` | `list commands` / `list instructions` / `list prd commands` / `list prd instructions` | Print this command reference table back to chat | Read-only | None |
| 6 | `run business` | `do business` / `business pipeline` / `full business sync` / `business everything` / `business run` | Orchestrate the full chain: prd-knowledge â†’ domain-glossary â†’ module-catalog â†’ test-case-authoring | Whatever sub-skills touch | All sub-skill restrictions apply |

### Failure behavior

- Drive inaccessible â†’ STOP; report missing access; do not fabricate
- Unknown command â†’ ask user to confirm or suggest `list command`
- Ambiguous `[module name]` â†’ list candidates and ask
- PRD content missing/unreadable when test cases requested â†’ STOP; tell user which module lacks content; no fake test cases

### Completion behavior

- **Commands 3 & 4 (test case generation)** â€” output `Peeep / PeeeP / Peeep` (audio: low-high-low beep) + one-line summary
- **Command 5 (list command)** â€” print the table above; no other output, no file changes
- **Command 6 (run business)** â€” orchestrator emits its own announcer cycle with `bf_emma` voice + rising fanfare beep, ALWAYS followed by global "I am finishing, boss." handshake
