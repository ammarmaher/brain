*** Brain SK — Page Learning Skill ***
*** Path: domains/frontend/page-learning/SKILL.md ***
*** Created: 2026-05-15 ***

# Page Learning Skill

Two-mode learning system that turns every prompt, screenshot, bug note, red X, green tick, validation rule, API rule, business rule, and UI/UX correction into structured per-page knowledge for Falcon — without auto-approving anything.

## Modes

### 1. Light Learning Intake (always-on, automatic)

Runs automatically on every interaction Ammar gives that touches a page:

| Trigger | Example |
|---|---|
| Free-text prompt mentioning a page/section/component | "Add the toggle to the Settings tab" |
| Screenshot attachment | Pasted/dropped image |
| Bug note | "This row is misaligned" |
| Correction | "No, use Falcon Data Table here" |
| Red X marker | Image annotation, prefix `❌`, prefix `wrong:` |
| Green tick marker | Image annotation, prefix `✅`, prefix `right:` |
| Validation rule statement | "Email must be unique" |
| API rule statement | "POST /accounts returns 201 on success" |
| Business rule statement | "Tariff cannot be deleted while active subscriptions exist" |

What Light Learning Intake does:

1. Save the input as evidence under `Brain Outputs/understanding/pages/<page>/evidence/<learningId>/`.
2. Extract the candidate page, section, related Falcon component (when possible).
3. Classify the input into a category: `uiux | validation | api | business | component | gap | evidence`.
4. Create a structured event in `LIGHT_LEARNING_EVENTS.md` for that page with status `pending`.
5. If a clear rule emerged, append a draft entry to `PENDING_PAGE_PATTERNS.md` with status `pending`.
6. Append a one-liner to `EVIDENCE_INDEX.md`.
7. Echo back to Ammar a 1–3 line acknowledgement: page, section, category, learningId, status `pending`.

What Light Learning Intake does NOT do:

- Does NOT deeply re-analyze the whole page.
- Does NOT approve any rule or pattern.
- Does NOT modify approved rules.
- Does NOT promote anything globally.
- Does NOT change scorecards.
- Does NOT trigger commits or pushes by itself.

### 2. Deep Page Learning (explicit Ammar approval)

Runs only when Ammar explicitly says any of:

- `deep learn this page`
- `update vault`
- `approve this pattern`
- `promote this globally`
- `learn this page`

What Deep Page Learning does:

1. Reads the page's `LIGHT_LEARNING_EVENTS.md` + `PENDING_PAGE_PATTERNS.md`.
2. Walks each pending event/rule with Ammar; asks an explicit approve/reject/promote prompt per item.
3. On `approve` → moves the rule from `PENDING_PAGE_PATTERNS.md` to `APPROVED_PAGE_PATTERNS.md` AND into the matching domain file (`UI_UX_RULES.md`, `VALIDATION_RULES.md`, `API_RULES.md`, `BUSINESS_RULES.md`).
4. On `reject` → moves to `REJECTED_PAGE_PATTERNS.md` with reason.
5. On `promote globally` → copies to `PROMOTION_CANDIDATES.md` AND appends to the matching global pattern file under `Brain Outputs/understanding/frontend/patterns/`.
6. Recomputes `PAGE_SCORECARD.md` dimensions only based on approved evidence.
7. Appends a full audit entry to `LEARNING_CHANGE_HISTORY.md`.
8. Updates Obsidian indexes (additive only, no plugin/secret edits).
9. Stages and (with Ammar's explicit `commit` / `push`) commits/pushes brain artifacts.

## Page folder layout

```text
C:\Falcon\Brain Outputs\understanding\pages\<page-name>\
  PAGE_LEARNING.md              ← entry point; links everything; describes mode + scoring
  LIGHT_LEARNING_EVENTS.md      ← all intake events (append-only)
  PENDING_PAGE_PATTERNS.md      ← unapproved patterns
  APPROVED_PAGE_PATTERNS.md     ← approved page-specific patterns
  REJECTED_PAGE_PATTERNS.md     ← rejected patterns + reasons
  PROMOTION_CANDIDATES.md       ← page patterns proposed for global promotion
  UI_UX_RULES.md                ← approved UI/UX rules (existing)
  VALIDATION_RULES.md           ← approved validation rules (existing)
  API_RULES.md                  ← approved API contract rules
  BUSINESS_RULES.md             ← approved business rules (existing)
  GAP_REGISTRY.md               ← unresolved gaps (existing)
  EVIDENCE_INDEX.md             ← every screenshot / quote / file pointer
  COMPONENT_USAGE_DECISIONS.md  ← per-section Falcon component decisions
  PAGE_SCORECARD.md             ← scored dimensions
  LEARNING_CHANGE_HISTORY.md    ← audit of every approve/reject/promote action
  evidence/<learningId>/        ← raw screenshots, quotes, exports
```

Existing rule registries (`UI_UX_RULES.md`, `VALIDATION_RULES.md`, `BUSINESS_RULES.md`, `GAP_REGISTRY.md`, `PAGE_SCORECARD.md`) stay in place. Page Learning never overwrites their human-edited content — it only appends approved entries during Deep Learning.

## Learning event schema (required fields)

Every learning event in `LIGHT_LEARNING_EVENTS.md` MUST carry:

| Field | Value |
|---|---|
| `learningId` | `LE-<YYYYMMDD>-<page-slug>-<NNN>` |
| `createdAt` | ISO 8601 with TZ |
| `sourceType` | `prompt \| screenshot \| bug \| correction \| approval \| rejection` |
| `pageName` | folder name under `pages/` |
| `sectionName` | section slug (e.g. `comm-channels-tab`) |
| `relatedComponent` | Falcon component (`falcon-data-table`, etc.) or `none` |
| `userInstruction` | verbatim Ammar quote |
| `extractedMeaning` | 1–2 line paraphrase |
| `category` | `uiux \| validation \| api \| business \| component \| gap \| evidence` |
| `status` | `pending \| approved \| rejected \| promoted \| deprecated` |
| `confidence` | `low \| medium \| high` |
| `relatedScreenshots` | relative paths under `evidence/<learningId>/` |
| `relatedFiles` | relative paths to source/destination code |
| `nextAction` | what is needed to advance this learning (e.g. `await Ammar approval`) |

A missing field invalidates the event. The intake step must add `UNKNOWN` rather than leave a field empty.

## Screenshot learning rule

When Ammar drops a screenshot:

1. Save the original to `evidence/<learningId>/source.png` (or `.jpg`).
2. If a clearly visible **red border / box / outline** → mark `sourceType: bug`, set `category: uiux`, status `pending`.
3. If a clearly visible **red X / cross** → mark as wrong/rejected pattern proposal, status `pending` (NOT auto-rejected — Ammar must confirm).
4. If a clearly visible **green tick / check** → mark as proposed approved pattern, status `pending` (NOT auto-approved).
5. If readable text on the screenshot → extract to `evidence/<learningId>/SCREENSHOT_NOTES.md` with verbatim transcript.
6. Append entry to `EVIDENCE_INDEX.md`.
7. Cross-link to any existing Falcon Eyes report folder if one exists for the same page+section.

Hard rule: screenshot interpretation is NEVER an approval. Approval requires Ammar to say it in words.

## Multi-level page understanding

Every page tracks 8 dimensions in `PAGE_SCORECARD.md`:

| Dimension | What it measures |
|---|---|
| UI/UX | approved UI/UX rules vs known sections |
| Validation | approved validation rules vs known fields |
| API | approved API contract rules vs known endpoints |
| Business | approved business rules vs known workflows |
| Component Usage | sections with approved Falcon component decision |
| Gap Resolution | resolved gaps / total gaps |
| Evidence Coverage | sections with at least 1 evidence item |
| Test Coverage | sections with at least 1 traced test |

Each dimension is a percentage. Any dimension < **60 %** is flagged `NEEDS ATTENTION`. The overall page status is `NEEDS ATTENTION` if any dimension is below 60 %, regardless of aggregate.

**Never inflate scores without evidence.** A dimension can only count entries currently in the matching APPROVED file — pending or rejected entries do not count.

## Approval rule

- Nothing becomes approved automatically.
- Nothing becomes global automatically.
- Page-specific rules stay page-specific unless Ammar says `promote this globally`.
- Never promote one-off hacks to global patterns.
- Once approved, a rule can still be deprecated later (status `deprecated`), but its history stays in `LEARNING_CHANGE_HISTORY.md`.

## Customization order (consumed by COMPONENT_USAGE_DECISIONS.md)

When deciding how to render a section, follow this order and record the chosen step in the decision file:

1. Use existing Falcon component as-is.
2. Use existing inputs.
3. Add `ng-template` / slots.
4. Add new variant on existing component.
5. Upgrade the Falcon library component.
6. Build a new library component.
7. Build an app-level wrapper.
8. Raw HTML — flagged as GAP, must produce a follow-up entry.

## Global pattern promotion

When Ammar says `promote this globally`:

1. Append the rule to the matching file under `Brain Outputs/understanding/frontend/patterns/`.
2. Add to `PROMOTION_CANDIDATES.md` for the page with the promotion timestamp.
3. Record approver = Ammar in `LEARNING_CHANGE_HISTORY.md`.
4. Never silently override an existing global pattern — if conflict, append a `Conflict` section and ask Ammar to reconcile.

## Slash commands

| Command | Behavior |
|---|---|
| `/light-learn` | Force a light intake run for the last message (useful when intake was skipped). |
| `/deep-learn-page <page>` | Run Deep Page Learning for the named page. |
| `/approve-pattern <learningId>` | Approve a single pending pattern. |
| `/reject-pattern <learningId> <reason>` | Reject a single pending pattern. |
| `/promote-pattern <learningId>` | Promote a page pattern to the global frontend patterns folder. |
| `/learn-screenshot` | Force a screenshot-intake pass on the latest screenshot. |

## Cross-domain interaction

- Reads from `domains/frontend/falcon-eyes/SKILL.md` reports when they exist for the same page+section.
- Reads from `domains/frontend/component-knowledge/SKILL.md` to resolve `relatedComponent`.
- Honors `protocols/APPROVAL_LEARNING_GATE.md` — nothing becomes approved without Ammar.
- Honors `protocols/SAFE_CHANGE_PROTOCOL.md` and the no-commit/no-push standing rules.
- Updates Obsidian indexes via `shared/obsidian-auto-link/OBSIDIAN_AUTO_LINK_PROTOCOL.md` ("Page Learning System — Obsidian Link Block" + "Knowledge Graph Vault Structure" sections).

## Obsidian graph layer

The vault at `C:\Falcon\Brain SK\_obsidian` is the navigation graph for this skill. Folder map:

- `00-Home/` — hubs (`PAGE_LEARNING_INDEX.md`, `COMPONENT_INDEX.md`, `UI_UX_INDEX.md`, `VALIDATION_INDEX.md`, `API_INDEX.md`, `BUSINESS_INDEX.md`, `GAPS_INDEX.md`, `EVIDENCE_INDEX.md`, `APPROVED_PATTERNS_INDEX.md`).
- `10-Pages/<Page Title>.md` — one note per Falcon page. Must link to every required artifact for that page (see OBSIDIAN_AUTO_LINK_PROTOCOL.md → "Required links on every page note").
- `60-Components/<Component Title>.md` — one note per Falcon component. Must back-link pages, gaps, approved patterns, Brain Outputs dossier, and Falcon Eyes reports.

When a Deep Page Learning run approves/promotes/rejects an item, the skill must additively refresh:

1. The page's `10-Pages/<Page>.md` note (links to new approved/promoted rules).
2. The matching domain hub in `00-Home/` (counts + page row).
3. The `60-Components/<Component>.md` note when `relatedComponent` is set.
4. `_obsidian/PAGE_KNOWLEDGE_INDEX.md` per the existing block.

The skill must NEVER create or edit files inside `_obsidian/.obsidian/`, `_obsidian/.smart-env/`, or any plugin/secret file. It MUST NOT duplicate rule content into vault notes — vault notes are link-only.

## Mirror + Git sync

After Deep Page Learning completes AND Ammar says `commit` and/or `push`:

1. Additive mirror only — `robocopy /E /XO /XD .git node_modules dist bin obj`. Never `/MIR`.
2. Mirror target: `C:\Falcon\Brain SK\outputs\understanding\pages\<page>\`.
3. Commit message convention: `feat(brain-sk): page learning — <page> — <short summary>`.
4. Never commit secrets, `.env`, plugin data, Copilot data, workspace state.

## Definition of done (for a single learning loop)

A learning loop is done when:

- The event is recorded with every schema field present.
- Evidence is saved under `evidence/<learningId>/`.
- A pending pattern exists if a rule emerged.
- Ammar has been informed in 1–3 lines.
- Page Scorecard has NOT been mutated (Light) OR has been recomputed from APPROVED files only (Deep).
- `LEARNING_CHANGE_HISTORY.md` carries an entry (Deep only).
- Obsidian index is refreshed if a Deep run touched approved/promoted rules.
