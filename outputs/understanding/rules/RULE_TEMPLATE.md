---
ruleId: R-XX-000
name: Short imperative name (5-8 words)
category: layout | theme | typography | font | color | reuse | i18n | global | architecture | dependency | pattern | dry | naming | secrets | i18n | auth | operational
scope:
  apps:
    - admin-console
    - host-shell
    - management-console
    - falcon-core-commerce-svc
    - falcon-core-identity-svc
    - "*"               # all apps when truly universal
  paths:
    - "apps/**/*.html"
    - "apps/**/*.ts"
    - "libs/**/*.ts"
    - "src/**/*.cs"
  exemptPaths:
    - "libs/falcon-ui-core/**"   # library is allowed to break this rule on purpose
severity: must | should | nice | deprecated
detector:
  type: regex | structural | ast | semantic-llm | manual
  patterns:
    - 'string\\sliteral\\spattern'
  exemptPatterns:
    - 'safe-known-good-pattern'
  description: One-line plain-English description of what the detector does
autoFix:
  available: false
  riskLevel: low | medium | high
  patchHint: 'Optional sed-style suggestion'
relatedRules:
  - R-FE-000
source:
  - file: feedback_<...>.md
    location: memory
  - file: brain-skills/Front-End-skills/<...>/Skill.md
    location: brain-skills
  - file: Home/Software-Architecture-Design/<...>.md
    location: wiki
  - file: CLAUDE.md
    location: project-root
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-XX-000 — Short imperative name ***
*** Source: <where the rule comes from in 1 sentence> ***
*** Detector: regex / structural / ast / semantic-llm ***

# R-XX-000 — Short imperative name

## What it says (one sentence)

A single declarative sentence stating the rule. **Must avoid wiggle words** — be enforceable. "Use Tailwind utilities only on Angular templates" not "prefer Tailwind".

## Why it exists

2-3 sentences. The pain it prevents, the consistency it preserves, the design decision it encodes. Cite the original source.

## Detector strategy

Plain English: how a script can decide whether a file violates this rule. Match the type in frontmatter.

- **regex** — list the literal patterns being searched for, in order of strictness.
- **structural** — describe the folder / file / naming structure being verified.
- **ast** — describe the AST shape (e.g., "ClassDeclaration whose constructor injects another ClassDeclaration whose name ends in `AppService`").
- **semantic-llm** — describe what context the LLM needs and what the verdict template looks like.

## Examples

### ✅ Good

```html
<!-- file: apps/.../some.component.html -->
<falcon-input [(ngModel)]="value" placeholder="Name" />
```

### ❌ Bad

```html
<!-- file: apps/.../some.component.html -->
<input class="border rounded p-2" [(ngModel)]="value" />
```

## Known legitimate exemptions

- `libs/falcon-ui-core/**` — the library itself MUST contain raw HTML primitives
- Any file listed in `exemptions/EXEMPTIONS.md` against this ruleId

## Fix recipe

Step-by-step rewrite, when a violation is found:

1. Identify the Falcon component that should replace the raw element (`<input>` → `<falcon-input>`).
2. Map attributes (`placeholder` → `placeholder`, etc.).
3. Verify Falcon component has the needed feature; if not, file a GAP note in `70-Gaps/` and escalate.
4. Update tests.

## Related rules

- [[R-FE-000-related-rule]] — describe how this rule interacts

## Sources of truth

1. `<original source file path>`
2. `<secondary source>`
