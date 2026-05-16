---
type: protocol
cluster: 19-night-shift-readiness
purpose: "Answers 'when the AI hits a fork during autonomous build, which rule applies + when to halt vs proceed'. Open BEFORE running any night-shift task; consulted at every fork during the build."
audience: autonomous AI agents (night-shift mode)
---

# DECISION-PROTOCOL — Fork resolution for autonomous AI

> [!tldr]
> Night-shift = no human to ask. Every decision is either codified by a rule or arbitrary. Arbitrary decisions diverge across runs. This protocol codifies 25 concrete forks the AI will hit, with canonical resolutions + escalation criteria.

## Integration with SPEC-PROTOCOL

- During SPEC creation: any fork that can't be resolved here → halt-and-flag
- During build: every fork the AI hits → consult this catalog → log the resolution

## The fork taxonomy (6 classes)

| Class | Description | Default escalation |
|---|---|---|
| **A** — Authority | Role/permission contradiction (PRD vs PES catalog vs falcon-access.registry.ts) | Halt-and-flag |
| **B** — Validation | FE cap vs backend cap differ; missing `[ThrowIf*]`; cross-field rule ambiguous | Apply rule or default |
| **C** — Entity drift | PRD entity shape ≠ backend DTO shape | Apply rule (PRD wins on labels; backend wins on transport) |
| **D** — Business rule | BR-* has two readings; status-aware logic unclear | Apply rule or halt |
| **E** — UI/UX | Empty/loading/error state unspecified; visual density unclear | Apply conservative default |
| **F** — Operational | Scanner reports drift; build error; runtime test fails | Halt-and-flag |

## The resolution algorithm

```
1. CLASSIFY fork (A–F)
2. LOOK UP rule in this catalog
3. IF rule exists:
     EXECUTE → LOG decision → CONTINUE
4. IF no rule:
     CLASSIFY ambiguity (high/medium/low-stakes)
     IF high-stakes (security/data): HALT-AND-FLAG
     IF medium-stakes (business logic): apply conservative-default + LOG
     IF low-stakes (cosmetic): apply conservative-default + LOG
5. NEVER make the same fork decision twice without logging the prior one
```

## The 25-fork catalog

### Class A — Authority (5 forks)

| # | Fork | Trigger | Resolution | Escalation |
|---|---|---|---|---|
| **F-001** | PRD says cap N, backend allows M (N<M) | Adding a field validator | **FE enforces N (tighter wins)**. Submit will succeed because backend accepts N. | None — settled rule. Source: V-username-format-uniqueness-immutable |
| **F-002** | PRD label set ≠ backend enum codes | Rendering a dropdown of an enum field | **Display PRD labels, submit backend codes**. Map at the FE boundary. | None. Source: V-password-security-level-enum (Q-UM-12) |
| **F-008** | `acc-admin` denied on services per PES, but the UI exposes a button | Wiring the route or feature | **Trust BuiltInRoleCatalog.cs deny wins**. Hide the button at the route or the action layer. | None. Source: F-008 spec |
| **F-009** | Q-UM-07 still blocked (PRD Sheet Tab 2 uncaptured) | Looking up a permission rule that might be in Tab 2 | **Proceed against captured Tab 1**, mark decision as `conditional on Tab 2`. Log in decisions file. | If conflict surfaces later, retroactively adjust. Source: permission-sheet-gaps.md |
| **F-021** | New `acc.*` resource needed for new feature, no PES rule exists yet | Adding a new feature with PES gating | **Halt-and-flag**. PES seed update (BuiltInRoleCatalog.cs + reseed) is human-reviewed. | Cannot auto-add PES rules. |

### Class B — Validation (6 forks)

| # | Fork | Trigger | Resolution | Escalation |
|---|---|---|---|---|
| **F-003** | AccountName "must start with letter" per PRD; backend has no regex | Wiring AccountName field | **FE enforces via `FalconStartWithLetterMax30Directive`** | None. Source: V-account-name-format-uniqueness |
| **F-004** | Required field per PRD; `[ThrowIfNotPassed]` missing on DTO | Wiring required fields | **FE enforces required**. Note backend gap in `_runtime-verification/`. | None. Source: V-* with `drift` status |
| **F-005** | HTTP status conflicts with `FalconKeys.Error.*` code message | Surfacing an error to UI | **HTTP status wins as primary routing signal**; display localized `errorMessages[0]`; never parse code | None. Source: 13-error-catalog/FE-CONTRACT.md |
| **F-011** | Backend endpoint returns 500 in dev | API integration during dev | **Continue with mock data + flag**. Note in `_pending-questions/` if blocking. | If endpoint is critical for the SPEC, halt. |
| **F-012** | i18n key missing in `ar.json` | Adding translation | **Generate English fallback in `en.json`** key + flag `translation gap` in decisions log | None. Falls back gracefully. |
| **F-024** | Validation error message in 2 languages but Arabic missing | Building error UX | **Display English fallback + log gap** to translation team | None. |

### Class C — Entity drift (3 forks)

| # | Fork | Trigger | Resolution | Escalation |
|---|---|---|---|---|
| **F-006** | Scanner reports drift on a watched source file | Pre-push or on-demand scan | **Verify intentional**: if YES → MarkChecked. If NO or in night-shift → **halt-and-flag** | Night-shift cannot self-verify intent. |
| **F-014** | Wallet transfer currency mismatch | Wiring transfer flow | **Reject at FE**; per V-charging-transfer-source-destination, must match | None. |
| **F-023** | Date format conflict (PRD says one, backend says ISO 8601) | Transport + display | **ISO 8601 in transport, PRD-specified format in display** | None. Standard. |

### Class D — Business rule (5 forks)

| # | Fork | Trigger | Resolution | Escalation |
|---|---|---|---|---|
| **F-010** | Two PRD requirements contradict each other | SPEC creation | **Halt-and-flag**. PRD inconsistency cannot be resolved autonomously. | Always escalate. |
| **F-015** | Add Client Step 5 partial-failure (Account created, Owner failed) | Implementing Add Client wizard finalize | **Preserve wizard state + show "Account created but Account Owner creation failed — contact support"** | Pattern is the BR. Don't roll back the account. |
| **F-022** | Two valid component choices for the same UI need | Choosing a Falcon UI Core component | **Pick first in Falcon UI Core component order** (alphabetical within category) + log | None. Cosmetic. |
| **F-019** | Empty-state design unspecified | Rendering an empty list | **Show, don't hide** + use `<falcon-empty-state>` or a Tailwind-styled fallback + log key for i18n | None. Conservative default. |
| **F-020** | Loading-state design unspecified | Rendering during data fetch | **Skeleton, not spinner** per noor-instructions-skill | None. Conservative default. |

### Class E — UI/UX (3 forks)

| # | Fork | Trigger | Resolution | Escalation |
|---|---|---|---|---|
| **F-013** | RTL Arabic layout visibly breaks | Building Arabic-supporting UI | **Halt-and-flag**. Visual judgment needed for RTL fixes. | Always escalate. |
| **F-016** | PrimeNG component referenced in old code | Porting a feature | **Replace with Falcon UI Core equivalent** per ANTI-PATTERNS.md | None. Standing rule. |
| **F-017** | SCSS file in old code | Porting a feature | **Replace with Tailwind utilities** per ANTI-PATTERNS.md | None. Standing rule. |
| **F-018** | `*ngIf` / `*ngFor` in old template | Porting a feature | **Replace with `@if` / `@for`** per ANTI-PATTERNS.md | None. Standing rule. |

### Class F — Operational (3 forks)

| # | Fork | Trigger | Resolution | Escalation |
|---|---|---|---|---|
| **F-007** | Stencil/Angular workspace compile error (40+ "tag missing in component decorator") | Build green required | **Halt-and-flag**. Workspace-state issue, not the AI's job. | Always escalate. Documented in VERIFICATION-STATUS.md. |
| **F-025** | Test case wants a role that has explicit deny | Writing Gherkin tests | **Skip or invert test** — can't test what's deny. Document "negative test only" for that role/action. | None. |
| **F-026** | nx serve hangs or fails to start | LOOP step 1 | **Halt-and-flag** after one retry. Don't kill working dev servers. | Escalate. |

(Forks F-001 through F-025 + F-026 — total **25 catalogued** + 1 added for nx-serve.)

## The "ask vs proceed" decision matrix

```
Severity \ Confidence  | High            | Medium          | Low
-----------------------|-----------------|-----------------|----------
Security-class fork    | Halt-and-flag   | Halt-and-flag   | Halt-and-flag
Data-integrity fork    | Halt-and-flag   | Halt-and-flag   | Halt-and-flag
Business-logic fork    | Proceed w/rule  | Proceed w/default | Halt-and-flag
UI/cosmetic fork       | Proceed w/rule  | Proceed w/default | Proceed w/default
```

## The "halt and flag" output

When halting, write `Brain Outputs/datasets/authority-dataset/_pending-questions/<task-id>-<fork-id>.md` with:

```markdown
---
type: pending-question
fork-id: F-XXX
task-id: <task>
halted-at: ISO 8601
night-shift-batch: <run-id>
---

# Fork: <one-line title>

## Why halted
<sentence on which criterion fired>

## Sources reviewed
- <dataset cell · file · line>
- <dataset cell · file · line>

## Plausible answers
- A: <option A> · consequences: ...
- B: <option B> · consequences: ...

## Recommended question for the human
<one specific question, written to be answered yes/no or A/B/C>

## Blast radius
<what's blocked until this is resolved + what can still proceed in parallel>
```

## The decision log

Every resolved fork during a night-shift run gets logged to:

`Brain Outputs/datasets/authority-dataset/_runtime-verification/decisions-<date>.md`

Append-only. Format:

```
- F-001 · <YYYY-MM-DDTHH:MM> · task=<task-id> · resolution=FE-enforced-30 · source=V-username-format-uniqueness-immutable · file=<path-modified>
- F-002 · ... 
```

## The conservative-default principle

When no rule exists AND no halt criterion fires:
1. Default to the **more restrictive** option (security)
2. Default to the **more visible** option (UX clarity)
3. Default to the **more explicit** option (no magic)
4. Default to **PRD over backend** (PRD is the contract)
5. Default to **code over my-mental-model** (code is reality)

## See also

- [[SPEC-PROTOCOL]] — invokes this catalog during ambiguity scoring
- [[VISUAL-TARGETS/_INDEX]] — UI/UX forks (Class E) consult here for visual targets
- [[NIGHT-SHIFT-LOOP]] — the script that triggers fork resolution during the build
- [[../15-implementation-pitfalls/PITFALLS]] — same forks may surface as pitfalls
- [[../07-cross-cutting/permission-sheet-gaps]] — Q-UM-07/Q-AM-16 forks (F-009)
- [[../VERIFICATION-STATUS]] — workspace-state forks (F-007)
