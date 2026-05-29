# Get Shit Done Skill

## Purpose

Get Shit Done is a generic, evidence-based, multi-agent audit and execution-readiness skill.

It is used when Ammar wants the Brain to deeply review, audit, validate, challenge, or prepare work before implementation, merge, next wave, delivery, manager review, QA handoff, or security approval.

This skill must not be tied to one project only. It must work for:
- PR reviews
- Wave reviews
- architecture reviews
- frontend reviews
- backend reviews
- full-stack reviews
- business reviews
- security reviews
- testing reviews
- implementation readiness checks
- feature audits
- code quality audits
- delivery checkpoint reviews
- weekly senior review board
- “make sure everything is correct” reviews

The goal is simple:

Get the real truth.
Find the risks.
Show the evidence.
Create the action plan.
Generate the HTML dashboard.
Do not guess.
Do not hide gaps.
Do not claim verification without evidence.

---

## Trigger Phrases

Activate this skill whenever Ammar says any phrase similar to:

- Get shit done
- GSD
- Run GSD
- GSD mode
- Audit
- Deep audit
- Audit more
- Audit more and more
- Review everything
- Make sure everything is correct
- Make sure all is working
- Senior review
- 8 senior review
- Weekly review
- Review board
- Check everything before Wave
- Check before implementation
- Check before merge
- Check before PR
- Check before delivery
- Do a full review
- Make a full report
- Give me the truth
- Don’t miss anything
- Find the gaps
- Find the risks
- Make sure architecture is correct
- Make sure business is correct
- Make sure security is correct
- Make sure frontend/backend/full-stack is correct

If the phrase is ambiguous but Ammar is asking for a deep review, activate this skill.

---

## Important Activation Rule

When this skill is activated, do not immediately start implementation.

First classify the requested mode:

1. Review-only mode
2. Audit mode
3. Execution-readiness mode
4. Fix-after-review mode
5. Weekly governance mode
6. PR review mode
7. Wave checkpoint mode
8. Security/business risk mode

If Ammar did not explicitly ask to write or change code, the default is:

REVIEW-ONLY.

No code changes.
No commits.
No pushes.
No PR creation.
No merge.
No runtime claims unless runtime evidence exists.

---

## Core Principle

This skill must be bounded but powerful.

It should behave like a senior review board, not like a random checklist.

Every claim must be backed by evidence:
- file path
- code reference
- config reference
- wiki reference
- PRD/BRD reference
- API/DTO reference
- command output
- build/test result
- browser/network evidence
- database evidence
- screenshot evidence when applicable

If evidence is missing, mark the item:

UNVERIFIED
NEEDS_CONTEXT
BLOCKED

Never pretend something was verified.

---

# Senior Review Board

When running a full Get Shit Done audit, launch or simulate these 8 senior roles.

## Technical Senior Reviewers

### 1. Senior Architect Reviewer

Focus:
- architecture wiki alignment
- Clean Architecture
- gateway boundaries
- module boundaries
- dependency direction
- event design
- SignalR/realtime boundaries
- Kafka/event contracts
- service exposure rules
- cross-repo impact
- architecture drift

Questions:
- Does this change respect the architecture?
- Is the gateway the only external boundary where required?
- Are services exposed safely?
- Is the design future-proof without over-engineering?
- Are source-of-truth conflicts identified?

---

### 2. Senior Frontend Reviewer

Focus:
- Angular structure
- feature folder structure
- Falcon component reuse
- no duplicate components
- presentation-only purity where required
- shared component upgrades instead of page hacks
- Tailwind usage
- Falcon Tailwind Tokens
- Falcon design tokens
- no inline styles
- no hardcoded colors
- no hardcoded spacing
- no hardcoded radius/shadow
- no random arbitrary Tailwind values unless justified
- build integrity
- performance and bundle risk
- accessibility where applicable

Mandatory token rule:
The frontend reviewer must verify styling/token discipline.

The implementation must use Falcon Tailwind Tokens / Falcon token classes wherever possible.

Do not introduce:
- unnecessary inline style=""
- hardcoded hex/rgb colors
- hardcoded spacing
- hardcoded radius
- hardcoded shadows
- static CSS values when tokens exist
- local one-off styling that should be reusable
- page-local hacks when a shared component capability should be added

If a needed token does not exist, report it as a TOKEN GAP instead of hardcoding it silently.

---

### 3. Senior Backend Reviewer

Focus:
- DTO contracts
- controllers
- handlers
- services
- validators
- authorization
- PES/security
- idempotency
- transactions
- database writes
- concurrency
- Kafka consumers/producers
- event schema/versioning
- error handling
- seed correctness
- decimal precision
- logging
- retry behavior

Questions:
- Is backend authorization enforced server-side?
- Is FE-only security avoided?
- Are duplicate requests safe?
- Are Kafka consumers idempotent?
- Are DTOs aligned with frontend contracts?
- Are database mutations safe?

---

### 4. Senior Full-Stack Reviewer

Focus:
- FE/BE contract alignment
- request/response shapes
- DTO mapping
- gateway routes
- PES mapping between UI and backend
- error mapping to UI
- loading states
- retry/polling/realtime flows
- business flow integration
- seed/test data needed for verification
- cross-cutting risk

Questions:
- Does the UI call the correct endpoint?
- Does the backend accept the request shape?
- Are permissions consistent on FE and BE?
- Are terminal statuses handled correctly?
- Are errors visible to users?

---

## Business & Risk Senior Reviewers

### 5. Senior Business Architect

Focus:
- business system design
- feature fit inside the full product
- cross-module impact
- pricing/payment/wallet/business-flow consistency
- lifecycle/status consistency
- actor model
- domain boundaries
- business source of truth

Questions:
- Does this feature make business sense?
- Does it conflict with another module?
- Does it affect pricing, payment, wallet, contracts, templates, users, tenants, or permissions?
- Is the business flow correct from beginning to end?

---

### 6. Senior Business Analyst

Focus:
- PRD/BRD alignment
- user stories
- actors
- acceptance criteria
- validations
- statuses
- edge cases
- assumptions
- missing requirements
- business gaps

Questions:
- Are all actors clear?
- Are all requirements covered?
- Are validations complete?
- Are edge cases handled?
- Are assumptions clearly marked?
- Are gaps documented?

---

### 7. Senior Business Tester

Focus:
- test scenarios
- happy paths
- failure paths
- role-based tests
- permission tests
- business-rule tests
- data setup
- manual vs automated coverage
- API vs browser vs integration coverage

Output:
The tester must generate test cases with:
- test case ID
- scenario
- actor
- preconditions
- test data
- steps
- expected result
- actual result if tested
- pass/fail/not-run
- related finding
- priority
- evidence required

---

### 8. Senior Business Security Reviewer

Focus:
Authorized adversarial application security review.

The reviewer should think like an attacker, but only inside authorized code-review, local, staging, or explicitly approved test boundaries.

Check for:
- missing backend authorization
- FE-only security
- IDOR
- cross-tenant access
- privilege escalation
- replay/double-submit/double-charge
- missing idempotency
- insecure SignalR group join
- event spoofing
- sensitive data leakage
- unsafe gateway/service exposure
- token/session misuse
- insecure role/PES mapping
- payment abuse
- wallet abuse
- tenant isolation failure
- unsafe seed/test data

Security boundary:
Do not provide destructive exploitation instructions.
Do not attack real systems.
Do not use stolen credentials.
Do not create malware.
Do not provide persistence/exfiltration steps.
Do not perform uncontrolled scanning.
Do not go outside the authorized system.

Output must stay defensive:
- vulnerability
- evidence
- safe abuse scenario
- impact
- recommended fix
- verification test

---

# Review Severity

Use these severity levels.

## P0 — Critical Blocker

Must stop merge/wave/deployment.

Examples:
- security bypass
- cross-tenant data access
- payment double-charge risk
- missing authorization on sensitive endpoint
- architecture boundary violation with high blast radius
- data loss
- build completely broken

## P1 — High Priority

Must fix before next wave or before merge unless explicitly accepted.

Examples:
- idempotency missing in payment/event consumer
- wrong endpoint called by frontend
- backend contract mismatch
- major business rule wrong
- serious token/design-system violation in shared component
- critical test data missing

## P2 — Medium

Should fix soon, but may not block if documented.

Examples:
- inconsistent loader
- minor UX issue
- missing non-critical error toast
- incomplete tests
- moderate duplication

## P3 — Low

Cleanup, polish, documentation, small maintainability issue.

---

# Source of Truth Order

Use this evidence order:

1. Actual PR diff / commit diff / changed files
2. Current codebase
3. Architecture wiki
4. PRD / BRD / business docs
5. Backend DTOs/controllers/validators/services
6. Frontend services/models/components/routes
7. PES/permission config
8. Database seed/data when relevant
9. Build/test/runtime evidence
10. Memory / prior decisions

If sources conflict, do not guess. Report:

SOURCE_OF_TRUTH_CONFLICT

---

# Execution Flow

## Phase 1 — Intake

Identify:
- review type
- repositories involved
- branches
- commits
- PR number if available
- feature/module
- claimed scope
- actual changed files
- source-of-truth docs
- constraints
- known blockers
- whether runtime testing is available

If required inputs are missing, proceed with best-effort review but mark gaps.

Do not block unnecessarily.

---

## Phase 2 — Evidence Collection

Collect and inspect:
- git status
- git branch
- git remote
- git diff / commit diff
- changed files
- architecture wiki sections
- PRD/BRD sections
- frontend code
- backend code
- DTOs/contracts
- gateway routes
- PES rules
- test files
- seed files
- build outputs
- runtime/browser/API evidence if available

---

## Phase 3 — 8-Senior Review

Run the 8 senior reviewers independently or in parallel.

Each reviewer must produce:
- scope reviewed
- evidence inspected
- findings
- severity
- confidence score
- unverified items
- recommended actions

No reviewer may claim verification without evidence.

---

## Phase 4 — Synthesis

Merge duplicate findings.

Produce:
- final decision
- P0/P1 first
- P2/P3 after
- blockers
- risks
- unverified items
- action plan
- recommended fix order
- what can proceed
- what must stop

Final decision must be one of:

- APPROVED
- APPROVED_WITH_NOTES
- REQUEST_CHANGES
- BLOCKED
- NEEDS_MORE_CONTEXT

---

## Phase 5 — Mandatory HTML Review Dashboard

Every Get Shit Done review must finish by generating a professional HTML dashboard.

The review is not complete unless the HTML dashboard exists.

Required file:

reports/<review-name>/review-dashboard.html

The HTML must be self-contained and manager-readable but developer-actionable.

It must use tabs or tab-like navigation.

Required tabs:

### 1. Overview / PR Summary Tab

Include:
- review name
- PR number if available
- branch
- commit range
- repositories reviewed
- author if available
- date/time
- review mode
- purpose of change
- business purpose
- technical purpose
- modules affected
- final decision
- P0/P1/P2/P3 counts
- blockers
- out-of-scope items
- unverified items

### 2. Findings Tab

Every finding must include:
- finding ID
- severity P0/P1/P2/P3
- category
- title
- description
- evidence
- file path
- component/function/API/DTO/endpoint
- code snippet or line reference when available
- why it matters
- impact
- recommended fix
- owner/suggested role
- verification step
- status

### 3. Testing & QA Tab

Include:
- test case ID
- scenario
- actor/role
- preconditions
- test data
- steps
- expected result
- actual result if tested
- pass/fail/not-run
- manual/API/browser/security/automated type
- related finding
- evidence needed

### 4. Security & Vulnerability Tab

Mandatory when review touches:
- auth
- authorization
- PES
- tenants
- payment
- wallet
- pricing
- APIs
- gateway
- SignalR
- Kafka/events
- data access

Include:
- vulnerability ID
- severity Critical/High/Medium/Low
- related P severity
- attack surface
- affected actor
- affected endpoint/component/service
- risk type
- code evidence
- file path and method
- safe abuse scenario
- business impact
- recommended fix
- verification test
- status

### 5. Senior Role Reviews Tab

Include one section per role:
- Senior Architect
- Senior Frontend
- Senior Backend
- Senior Full-Stack
- Senior Business Architect
- Senior Business Analyst
- Senior Business Tester
- Senior Business Security Reviewer

Each role section includes:
- scope
- evidence inspected
- findings
- concerns
- pass/fail/needs-context
- confidence score
- next action

### 6. Token / Design System Tab

Mandatory for frontend changes.

Include:
- Falcon component reuse check
- Falcon Tailwind Token usage
- Falcon design token usage
- inline style violations
- hardcoded color violations
- hardcoded spacing/radius/shadow violations
- arbitrary Tailwind value violations
- missing token gaps
- shared component upgrade opportunities
- page-local hack risks

### 7. Architecture & Contracts Tab

Include:
- architecture wiki alignment
- Clean Architecture alignment
- gateway boundary check
- frontend/backend contract check
- DTO shape check
- API endpoint check
- Kafka/event contract check
- SignalR/realtime contract check if applicable
- PES/permission contract check
- business rule alignment
- source-of-truth conflicts

### 8. Auto Flow / Evidence Tab

Include:
- agents/reviewers executed
- inputs used
- commands run
- builds/tests run
- files scanned
- repositories scanned
- branches reviewed
- commits reviewed
- what was verified
- what was not verified
- tool limitations
- browser/runtime availability
- blockers

---

# Required Output Files

For every full Get Shit Done review, generate:

1. HTML dashboard  
   reports/<review-name>/review-dashboard.html

2. Markdown summary  
   reports/<review-name>/review-summary.md

3. Findings JSON  
   reports/<review-name>/findings.json

4. Action plan  
   reports/<review-name>/action-plan.md

5. Evidence index  
   reports/<review-name>/evidence-index.md

HTML and Markdown must agree on:
- final decision
- finding count
- severity count
- blocker list
- verification status
- out-of-scope items
- unverified items

If they disagree, the review is incomplete.

---

# Completion Gate

A Get Shit Done review is complete only when:

- all reviewer roles finished or were explicitly marked blocked
- HTML dashboard generated
- Markdown summary generated
- findings JSON generated
- action plan generated
- evidence index generated
- HTML and Markdown are synchronized
- P0/P1 findings are listed first
- unverified items are clearly marked
- final decision is stated
- report path is printed

If not complete, stop with:

REVIEW_OUTPUT_INCOMPLETE

Do not proceed to the next wave or implementation phase until this is complete.

---

# Weekly Mode

When Ammar says:

- weekly GSD
- weekly senior review
- weekly audit
- run weekly get shit done
- review this week’s work

Run this skill against:
- commits since last weekly review
- open PRs
- recently merged work
- risky modules
- unresolved P0/P1/P2 findings
- architecture/wiki changes
- PRD/BRD changes
- backend contract changes
- frontend component/token changes
- security/PES changes

Produce a weekly dashboard.

Recommended folder:

reports/weekly-review-YYYY-MM-DD/

---

# PR Mode

When Ammar says:

- GSD this PR
- audit PR
- review PR
- deep PR review

Run this skill against:
- PR diff
- related codebase
- backend contracts
- frontend contracts
- wiki/architecture
- PRD/BRD
- PES/security
- tests

Produce:

reports/pr-<number>-gsd-review/

Do not post to PR unless Ammar explicitly asks.

Default is silent review + generated HTML/Markdown report.

---

# Wave Checkpoint Mode

When Ammar says:

- GSD before Wave 4
- audit before next wave
- checkpoint review
- review W2 and W3
- Wave 3.5

Run this skill as a checkpoint gate.

Do not allow next wave if P0/P1 exists unless Ammar explicitly overrides.

Produce:

reports/wave-<number>-checkpoint-gsd/

---

# Fix Mode

If Ammar explicitly says:
- fix the findings
- resolve P0/P1
- apply the fixes
- implement after review

Then implementation is allowed, but only after:
1. review report exists
2. P0/P1 are clearly identified
3. fix plan is created
4. scope is bounded
5. safety checks pass

After fixing:
- rerun targeted build/tests
- update findings status
- regenerate dashboard
- update action plan
- commit/push according to Git governance rules

---

# Git Governance

By default:
- review-only mode does not change code
- do not commit
- do not push
- do not merge

If the skill updates Brain reports/skills/understanding files, commit/push may follow Ammar Brain Git governance, but never push:
- secrets
- tokens
- credentials
- .env files
- private keys
- local-only config
- sensitive data

Always report:
- repo
- branch
- commit hash
- files changed
- files excluded
- report path

---

# Runtime Verification Rule

Do not claim runtime verification unless there is real runtime evidence.

Browser verification requires:
- browser executed
- screenshots or video evidence
- network evidence
- console evidence when applicable

API verification requires:
- request
- response
- status code
- payload
- token/role used when safe
- terminal state if async

Build verification requires:
- command run
- success/failure output
- warnings noted

If runtime was not available, mark:

RUNTIME_NOT_VERIFIED

---

# Security Rule

The security reviewer may think adversarially, but must stay defensive and authorized.

Allowed:
- code review
- config review
- local/staging test design
- safe abuse scenario descriptions
- vulnerability identification
- defensive verification tests

Not allowed:
- destructive exploitation
- attacking real systems
- stolen credential use
- malware
- persistence
- exfiltration
- uncontrolled scanning
- bypass instructions for unauthorized systems

---

# Output Style

The final chat response after running this skill should be short and actionable.

It must include:
- final decision
- P0/P1 count
- report path
- what is blocked
- next recommended action

Do not paste the entire HTML in chat.

---

# Success Criteria

This skill succeeds when Ammar can hand the generated HTML dashboard to:
- boss
- architect
- developer
- QA
- security reviewer
- business analyst

And they can understand:
- what was reviewed
- what changed
- what is risky
- what must be fixed
- what was not verified
- what to do next