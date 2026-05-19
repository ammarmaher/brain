---
name: pr-review-governance
description: Review any Falcon pull request or branch against wiki/architecture rules, PRD requirements, page-learning rules, frontend/backend/full-stack skills, folder-structure governance, Falcon component rules, validation rules, API/DTO contracts, business rules, PES/security rules, testing/build quality gates, and Obsidian/Brain Outputs knowledge. Produces a severity-classified review report set and a final merge decision.
---

# PR Review Governance Skill

## Purpose

Give Brain SK a single, repeatable way to review a pull request (or branch diff)
against every governance source Falcon has — so teammate work, branch changes, or
pre-merge implementations can be validated before they reach `main`.

This skill is **review-only**. It never edits implementation code. It reads the
diff, reads the truth sources, and produces a structured review report set plus a
final merge decision.

## When to use this skill (triggers)

Activate whenever Ammar says any of:

- `review this PR`
- `check this pull request`
- `review teammate work`
- `inspect branch changes`
- `compare branch with main`
- `validate PR against PRD/wiki`
- `check if this implementation is correct`
- `review before merge`

If Ammar names a branch or PR without an explicit verb, still route here when the
intent is "is this change correct / safe to merge".

## Source of truth order

For every PR review, use this order. Higher number = lower authority.

1. **PR diff / changed files** — the actual change truth (what really changed).
2. **Project codebase** — implementation truth (how the surrounding code works).
3. **Architecture wiki** — architecture / governance truth (`C:\Falcon\falcon-wiki`).
4. **PRD / business docs** — requirement truth.
5. **Backend / API / DTO understanding** — integration truth
   (`C:\Falcon\Brain Outputs\understanding\backend\`).
6. **Page learning / approved patterns** — page behavior truth
   (`C:\Falcon\Brain Outputs\understanding\pages\` + `…\frontend\patterns\`).
7. **Falcon component knowledge** — frontend component truth
   (`C:\Falcon\Brain Outputs\understanding\frontend\components\`).
8. **Validation / business / gap registries** — known rule truth.
9. **Best practice** — used ONLY when every source truth above is silent.

### Conflict handling

If sources conflict:

- Do **not** guess silently.
- Report the conflict explicitly in the review.
- Mark it as a **risk / gap**.
- Recommend the safest action.

## PR review process

Run all ten steps in order for every review.

### 1. Identify PR scope

- Source branch
- Target branch
- Changed files (`git diff --name-status <target>...<source>`)
- Affected apps / libs / services / modules
- Frontend / backend / full-stack classification
- Affected pages / components / APIs / DTOs

### 2. Load relevant knowledge

- `C:\Falcon\Brain Outputs\understanding\KNOWLEDGE_ROOT_INDEX.md` (always)
- Frontend knowledge if frontend changes exist
- Backend / service / API knowledge if backend changes exist
- Page knowledge if page changes exist
- PRD / wiki if available
- Approved patterns
- Known gaps

### 3. Review architecture and structure

- Correct feature folder structure
- `models` / `services` / `signals` / `validation` / `helpers` placement
- No random / orphan folders
- Consolidated model files
- Shared vs feature-local decision is justified
- Nx / module boundaries respected
- Route / menu conventions
- No duplicated logic

### 4. Review Falcon frontend rules

- Falcon custom components used first
- No raw `table` / `button` / `input` / `dropdown` / `tabs` when a Falcon component exists
- Dynamic APIs used correctly: `ng-template`, slots, content projection,
  configurable inputs, action templates
- Tailwind + Falcon tokens only
- No new CSS / SCSS unless documented
- No hardcoded colors / spacing / radius / shadow
- No PrimeNG / PrimeIcons for new work

### 5. Review validation

- Frontend validation matches the confirmed requirement / backend rule
- Required / nullable / disabled rules correct
- OTP / IP / email / phone rules if relevant
- Error states present
- Validation messages correct
- Backend remains authoritative
- No backend logic blindly duplicated client-side

### 6. Review API / DTO integration

- DTOs match backend contracts
- Request / response models correct
- API services use the correct endpoints / gateway
- Error / loading / empty / success states handled
- No mock data left unless documented
- No breaking API assumptions

### 7. Review business logic

- PRD flow followed
- Statuses / lifecycle correct
- Permissions / PES rules respected
- Allowed actions by status / role correct
- Edge cases handled
- Gaps / assumptions documented

### 8. Review security / PES

- No secrets committed
- No credentials in code or reports
- Permissions enforced
- Maker / checker / PES rules if applicable
- Sensitive data not logged
- Route access not weakened unless intentional and documented

### 9. Review quality gates

- Build / typecheck / lint status
- Tests added / updated where needed
- Visual parity evidence if UI changed
- No console errors
- No regression risk
- Performance / bundle risk if relevant

### 10. Produce review output

Create the dated review folder:

```text
C:\Falcon\Brain Outputs\reports\pr-reviews\<PR-or-branch-name>-<YYYY-MM-DD>\
```

Inside it create (all are **mandatory** — every review produces the full set):

- `PR_REVIEW_REPORT.md` (main report — format below)
- `PR_REVIEW_FINDINGS.md`
- `PR_REVIEW_CHECKLIST.md`
- `PR_REVIEW_RISK_MATRIX.md`
- `PR_REVIEW_REQUIRED_FIXES.md`
- `PR_REVIEW_APPROVAL_DECISION.md`
- **`PR_REVIEW_REPORT.html`** — **ALWAYS generated.** A single self-contained HTML
  file (inline CSS, no external/CDN dependencies, works offline) that consolidates
  every section above into one readable, navigable page: decision banner, severity
  stat cards, collapsible findings with code evidence, a pass/fail governance
  checklist, the risk matrix, required fixes, and the decision rationale. This is
  not optional and does not depend on any toolchain — it is a plain file write.
- `PR_REVIEW_REPORT.pdf` — only if a PDF toolchain is available; otherwise note
  "PDF skipped — no PDF toolchain" in the report. The HTML covers the readable-output
  need regardless.

Blank templates for the Markdown files and the HTML report live in
[`templates/`](templates/) next to this skill — copy them into the dated folder
and fill them in.

### Code evidence — mandatory for every finding

A finding is not complete until it carries **code evidence**: the reviewer must
"take a shot from the code" — quote the actual offending lines from the diff or the
source file, with a `file:line` reference, and state plainly **what the error is**.
Every finding then carries a concrete **suggested fix** — a corrected code snippet
or a precise change instruction, not a vague description. The pattern per finding:

1. **Code shot** — the real lines, fenced, with `file:line`.
2. **What is wrong** — the specific defect in those lines (bug, contract mismatch,
   rule violation, leak, dead code, order-sensitivity, etc.).
3. **Suggested fix** — corrected snippet or exact instruction.

If a finding is structural (e.g. duplication) the "code shot" is the proof — e.g.
the `git diff`/`diff` output showing the two files are identical. Findings without
code evidence are downgraded to "observations" and must not drive the decision.

### Code-level error pass (not just governance)

Beyond governance rules, every review runs a **code-level error pass** over the
changed files looking for real defects: null/undefined dereferences, unhandled
promise/observable errors, unsubscribed subscriptions (missing
`takeUntilDestroyed`/`async`), order-sensitive serialization or comparison, dead /
unreachable code, off-by-one and boolean-logic mistakes, type holes (`any`, unsafe
casts), missing `await`, race conditions, and DTO/contract mismatches against the
backend. Each real defect found becomes a finding with code evidence + suggested
fix, classified P0–P3 like any other.

## Review mode — Silent Review is the default

**Brain SK runs every PR review in SILENT mode by default.** A silent review reads
the PR, produces the report set locally (Markdown + HTML), and posts **nothing** to
the pull request itself — no PR thread comments, no inline comments, no file
attachments, no status updates on the Azure DevOps / GitHub PR.

- The review output lives **only** in
  `Brain Outputs/reports/pr-reviews/<...>/` and its Brain SK mirror.
- Brain SK must **never** post to a PR without being explicitly told to in this
  same request.
- Before doing anything that writes to the PR, Brain SK **must ask**:
  *"Do you want to add the findings as comments on the PR, or attach the report to
  the PR? (default: No — silent review)"* — and proceed only on an explicit "yes".
- If the user does not answer, or answers anything other than an explicit yes →
  **silent review** (post nothing).

This keeps PR review a private advisory tool. The decision
(`APPROVE` / `REQUEST_CHANGES` / …) is recorded in the report, not pushed onto the
PR, unless the user explicitly opts in.

## Intelligence engine

Every review applies these four capabilities to move findings from "unverified
opinion" to "verified fact". When a capability genuinely cannot run, the review
says so and marks the affected items `⚠ UNVERIFIED` rather than guessing.

1. **Backend contract cross-check.** For any changed FE DTO / API model, load the
   owning service's `DTO_DICTIONARY.md` + `ENDPOINT_REGISTRY.md` from
   `understanding/backend/<service>/` and diff the FE shape against it. A real
   mismatch (wrong field name, type, nullability, missing endpoint) is a P0/P1
   finding with code evidence. If no backend understanding exists for the service,
   flag a gap and recommend generating it — do not assume the contract is correct.

2. **Auto-run quality gates.** Run the affected build / lint / test for the changed
   projects (e.g. `nx affected -t build lint test --base=<target> --head=<source>`)
   and ingest the real results into the Quality Gates section. Only when the
   commands cannot run in the environment is the gate marked `⚠ NOT RUN` with the
   reason.

3. **Two-pass adversarial review.** After the first-pass findings are drafted, run
   a second pass that challenges them: re-check each finding for false positives,
   re-scan the diff for missed defects, and re-test the severity. The report keeps
   only findings that survive the second pass; removed/added items are noted in
   `PR_REVIEW_FINDINGS.md` under a "second-pass adjustments" note. This reduces
   hallucinated findings and missed bugs.

4. **Regression-impact graph.** Build the dependency graph of the changed files
   (e.g. `nx graph --file` or import-tracing) to compute the *real* downstream
   consumers — which apps, libs, pages, and components import what changed. The
   Risk Matrix "regression surface" is computed from this graph, not guessed.

Each capability that produces a defect feeds the normal findings pipeline (code
evidence + suggested fix + P0–P3). Each that produces a clean result is recorded as
a verified-clean line so the reader knows it was actually checked.

## Review severity

Classify every finding.

| Severity | Meaning |
|---|---|
| **P0 BLOCKER** | Breaks build · breaks route/app · security/secrets issue · wrong API/DTO causing runtime failure · violates a critical PRD/business/PES rule |
| **P1 MAJOR** | Major behavior mismatch · wrong component usage · missing validation · wrong folder structure with future risk · visual mismatch affecting UX |
| **P2 MEDIUM** | Maintainability issue · missing edge case · incomplete loading/error state · duplicated logic · missing report/knowledge update |
| **P3 MINOR** | Naming · small cleanup · small visual polish · comment/style issue |

## PR review decision

The final decision must be exactly one of:

- `APPROVE`
- `APPROVE_WITH_MINOR_NOTES`
- `REQUEST_CHANGES`
- `BLOCK_MERGE`
- `NEEDS_MORE_CONTEXT`

Decision rules:

- Any **P0** → `BLOCK_MERGE`.
- Any unresolved **P1** → `REQUEST_CHANGES`.
- Only **P2/P3** → `APPROVE_WITH_MINOR_NOTES` or `REQUEST_CHANGES` depending on
  count and risk.
- No material issues → `APPROVE`.
- Insufficient truth sources to judge → `NEEDS_MORE_CONTEXT`.

## Report format — `PR_REVIEW_REPORT.md`

The main report must include these ten sections:

1. **Summary** — branch/PR · target branch · review date/time · reviewer: Brain SK ·
   affected domains · final decision.
2. **Change scope table** — `| Area | Files | Risk | Notes |`
3. **Findings table** — `| Severity | File | Issue | Source rule | Required fix |`
4. **Wiki/PRD alignment** — `| Rule/requirement | Applied? | Evidence | Gap |`
5. **Structure review** — `| Path | Expected | Actual | Status |`
6. **Falcon component review** — `| UI element | Expected Falcon component | Actual | Status | Fix |`
7. **Validation/API/business review** — `| Rule | Expected | Actual | Status | Fix |`
8. **Security/PES review** — `| Check | Status | Notes |`
9. **Quality gates** — `| Gate | Status | Evidence |`
10. **Final decision** — approve/request changes/block · required fixes ·
    recommended fixes · next action.

The same content is rendered into `PR_REVIEW_REPORT.html` with, additionally, a
**Code Evidence** section: per-finding code shots (the real offending lines) and
suggested-fix snippets, plus the code-level error pass results.

## Obsidian

After producing a review, update the index at:

```text
C:\Falcon\Brain SK\_obsidian\PR_REVIEW_INDEX.md
```

Link every PR review to: affected page · affected components · affected API/DTO ·
related gaps · related PRD/wiki docs · approval decision.

Never touch Obsidian plugin data files (`_obsidian/.obsidian/`, Copilot
`data.json`, `workspace.json`, plugin config, any secret file).

## Git / output sync

After producing reports, mirror Brain Outputs into the Brain SK outputs mirror —
**additive sync only**:

```text
robocopy "C:\Falcon\Brain Outputs" "C:\Falcon\Brain SK\outputs" /E /XO /XD .git node_modules dist bin obj
```

Never use `robocopy /MIR` or `/PURGE`. Never delete destination folders.

Commit and push only safe Brain SK skill/report changes. Never commit secrets,
credentials, Obsidian plugin data, `node_modules`, `dist`, `bin`, `obj`, or temp
files.

## Hard rules

- This skill is **review-only** — it never edits implementation code.
- Follow the source-of-truth order exactly. Best practice is last.
- Report conflicts; never guess silently.
- Every finding gets a severity (P0–P3).
- The decision is derived mechanically from the decision rules above.
- Auto-sync to `https://github.com/ammarmaher/brain` after a review.
