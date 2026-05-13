# Skill: AI Deep Tri-Mindset Orchestrator

## Mission

Coordinate ChatGPT/Codex, Claude, and Gemini as one professional delivery system for enterprise software tasks.

This skill prevents weak AI output by forcing every task through the right mindset, handoff, and quality gate.

## Core model map

| Model mindset | Primary responsibility | Primary output | Must not do by default |
|---|---|---|---|
| ChatGPT / Codex | Business analysis, requirement shaping, prompt polishing, business test authoring, tables/matrices | Clear specs, tables, decision matrices, business test cases, Claude prompts | Direct repo edits unless explicitly asked |
| Claude | Implementation, code changes, refactoring, terminal validation, Angular/Nx/PrimeNG work | Code changes, changed-files summary, validation results | Invent business rules or bypass gates |
| Gemini | Visual/chart/image interpretation, dashboard validation, QA review, PR/diff second opinion | Visual extraction, chart specs, QA findings, screenshot validation, test gaps | Own implementation unless explicitly asked |

## Non-negotiable rule

Never start coding from a rough request.

Always classify the task first:

1. Business-heavy?
2. Visual/screenshot/chart-heavy?
3. Code implementation?
4. Testing/QA?
5. Architecture/refactor?
6. PRD/module knowledge sync?

Then load the correct sub-skill and gate.

## Orchestration algorithm

For every user task:

### Step 1 — classify

Classify the task into one or more lanes:

- Business lane
- Visual/chart lane
- Implementation lane
- QA/testing lane
- Knowledge/PRD lane
- Sound/announcer lane

### Step 2 — load skills

Load all relevant sub-skills:

- Business-heavy -> `10-chatgpt-codex-business-analyst`
- Code change -> `20-claude-implementation-engineer`
- Screenshot/chart/dashboard -> `30-gemini-visual-chart-qa`
- PRD/module/domain/test sync -> `40-business-knowledge-pipeline`
- Voice/sound completion -> `50-sound-announcer`

### Step 3 — run planning gate

Before implementation, produce:

- Goal
- Current problem
- Business rules
- Visual/chart requirements if relevant
- Affected modules/files if known
- Risks
- Acceptance criteria
- Test strategy
- Claude implementation prompt
- Gemini validation prompt when needed

### Step 4 — hand off

Use the handoff protocol:

```text
ChatGPT/Codex -> Claude -> Gemini -> ChatGPT/Codex final review
```

Exceptions:

- Pure visual analysis can start with Gemini.
- Pure codebase edits can start with Claude only after a minimal implementation gate.
- Pure business documentation can remain in ChatGPT/Codex.

### Step 5 — validate

No task is complete until the relevant gates pass:

- Requirement gate
- Business gate
- Visual/chart gate
- Implementation gate
- Test gate
- Regression gate
- Documentation gate

## Differentiation rules

### ChatGPT/Codex output

ChatGPT/Codex owns:

- Business test cases
- Business-rule tables
- Permission matrices
- Status transition matrices
- Decision tables
- Acceptance criteria
- Implementation prompt polishing
- Risk tables
- API/DTO interpretation tables
- Test data tables
- Requirement traceability tables

ChatGPT/Codex may describe charts as specifications, but it does not replace Gemini for visual chart interpretation.

### Gemini output

Gemini owns:

- Screenshot analysis
- Chart analysis from images
- Dashboard interpretation
- Visual layout comparison
- Chart correctness validation
- Axes/legend/tooltip/series validation
- Visual QA
- Accessibility review from UI images
- Responsive visual review

Gemini may propose tests, but ChatGPT/Codex owns the final business-test matrix.

### Claude output

Claude owns:

- Implementation in repo
- Angular/Nx/PrimeNG code
- File changes
- Refactors
- Build/lint/test commands
- Changed-files report
- Technical assumptions

Claude must not decide business rules alone.

## Required final response shapes

### If user asks for a Claude prompt

Return only:

1. Polished Claude prompt
2. Acceptance criteria
3. Validation commands if useful

### If user provides screenshots/charts

Return:

1. Gemini visual/chart analysis prompt
2. ChatGPT/Codex business-test prompt
3. Claude implementation prompt
4. Gemini validation prompt

### If user asks for implementation workflow

Return:

1. Model assignment
2. Stage-by-stage workflow
3. Gates
4. Prompts for each model

### If user sends skills to merge

Return:

1. Merge plan
2. Conflicts resolved
3. New master skill bundle
4. Installation instructions

## Hard stop conditions

Stop and report when:

- Business rule is contradictory.
- API contract is unknown and cannot be inferred.
- Visual chart data mapping is missing.
- Required PRD/source is unavailable.
- Implementation would require unrelated rewrite.
- User request conflicts with security/secrets policy.

Do not stop for minor ambiguity. Make safe assumptions and mark them.

## Completion checklist

Before calling any task done:

- Correct mindset selected
- Correct skill loaded
- Business rules protected
- Visual/chart interpretation handled when needed
- Claude prompt is implementation-ready
- Acceptance criteria exist
- Test cases exist
- Regression risks listed
- PrimeNG/Nx rules applied for front-end tasks
- No unrelated changes requested


## Priority update — model-separated brand skills and Tailwind-first UI

This bundle now includes separated model brand skills:

- `brand-skills/chatgpt-strategic-commander/SKILL.md`
- `brand-skills/claude-tactical-engineer/SKILL.md`
- `brand-skills/gemini-verification-officer/SKILL.md`

Every task must preserve model ownership:

```text
ChatGPT = strategy, business, architecture, prompt polishing
Claude  = implementation, repo edits, commands, validation
Gemini  = testing, QA, PR review, visual validation, edge cases
```

For UI work, follow `protocols/TAILWIND_FIRST_UI_RULES.md` as priority one:

1. Use Tailwind first for grid, flex, spacing, alignment, sizing, and responsive behavior.
2. Use PrimeNG for enterprise components and behavior.
3. Use SCSS only when Tailwind cannot cleanly implement the case.
4. If SCSS is used, document the reason through the SCSS fallback gate.

For delivery discipline, follow `protocols/GET_SHIT_DONE_GATES.md`.
For TTS text, use `assets/voice-alerts.md` and `assets/voice-alerts.json`.
