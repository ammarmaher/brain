---
ruleId: R-FE-010
name: Comment style — short banner format only
category: pattern
scope:
  apps:
    - admin-console
    - host-shell
    - management-console
  paths:
    - "apps/**/*.ts"
    - "apps/**/*.html"
    - "libs/**/*.ts"
  exemptPaths:
    - "**/*.spec.ts"
    - "**/*.d.ts"
severity: nice
detector:
  type: semantic-llm
  patterns:
    - 'JSDoc block /** ... */ spanning more than 3 lines'
    - 'multi-paragraph // comment block (3+ consecutive comment lines without code)'
    - 'comments that restate the code'
    - 'see also references inside comments'
  exemptPatterns:
    - '/* \\*+ <terse one-line> \\*+ */'
    - '/\\*\\*\\*.{0,80}\\*\\*\\*/'
    - '// <one-line short comment>'
  description: Semantic-LLM detector — flags JSDoc paragraphs, multi-paragraph rationale comments, "see also" references, "why we chose X" essays, and comments that narrate implementation. Accepts the star-banner format (*** terse comment ***) and single-line // comments that add non-obvious context.
autoFix:
  available: false
  riskLevel: low
  patchHint: 'Rewrite verbose JSDoc as either zero comments (self-documenting code) or a single-line star-banner: /* *** Capability resolver — PES-backed dispatch *** */. Move rationale to a sibling .md note if truly needed.'
relatedRules:
  - R-FE-011
source:
  - file: feedback_comment_style.md
    location: memory
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-FE-010 — Comment style — terse banner only ***
*** Source: feedback_comment_style ***
*** Detector: semantic-llm ***

# R-FE-010 — Comment style — short banner format only

## What it says

Code comments MUST be terse. No verbose prose. No JSDoc-style multi-line paragraphs. The default is **no comment** (self-documenting code). When a comment is genuinely necessary, use the banner format:

```
********************************************************************
********** <your short comment, ONE line, max two>
********************************************************************
```

Or the inline variant: `*** <short comment> ***`. Keep the comment line abstract/general, not implementation-level narration. Never write: long JSDoc blocks, multi-paragraph explanations, "see also" references, rationale paragraphs, "why we chose X" essays, or comments that restate the code.

## Why it exists

The user reviews diffs carefully and finds verbose comments noisy. Banner delimiters make section headers scannable; the body stays abstract and high-level. Implementation rationale belongs in a `.md` note next to the feature, not in the source file. Self-documenting code (good names, small functions, clear types) is the first line of defense — comments are escape hatches, not documentation.

## Detector strategy

Semantic-LLM pass:

1. **Regex pre-pass** finds candidates:
   - JSDoc blocks `/** ... */` spanning more than 3 lines
   - Three or more consecutive `//` lines without intervening code
   - `/* ... */` blocks not matching the star-banner shape

2. **LLM judgment** per candidate. Verdict template:
   - `OK_TERSE_BANNER` — matches the star-banner format
   - `OK_INLINE_SINGLE_LINE` — single-line `//` with non-obvious context (e.g. `// reason: phone-numbers must include +country prefix for SMS gateway`)
   - `VIOLATION_VERBOSE_JSDOC` — multi-line JSDoc with prose
   - `VIOLATION_RESTATES_CODE` — comment narrates what the code obviously does
   - `VIOLATION_RATIONALE_ESSAY` — "we chose X because…" — belongs in a sibling `.md`

## Examples

### ✅ Good

```ts
/*
********************************************************************
********** Capability resolver — PES-backed, generic dispatch
********************************************************************
*/
export class CapabilityResolver { … }
```

```ts
*** PES-backed dispatch ***
export class CapabilityResolver { … }
```

```ts
// reason: phone-numbers must include +country prefix for SMS gateway
const e164 = '+' + countryCode + phone;
```

### ❌ Bad

```ts
/**
 * Handles every action in the `user.*` namespace. Returns null for any
 * other prefix so the CapabilityService can delegate to the next resolver.
 *
 * Registration (in app.config.ts):
 *   { provide: CAPABILITY_RESOLVER, useExisting: UserCapabilityResolver, multi: true }
 *
 * This keeps PES as the single source of truth. Future resolvers for
 * contact-group.*, network.*, etc. can plug in the same way without
 * touching the directive API.
 */
export class UserCapabilityResolver { … }
```

```ts
// increment counter by one
counter++;                            // ❌ restates the code
// loop through users
for (const u of users) { … }          // ❌ restates the code
```

## Known legitimate exemptions

- `*.spec.ts` — test files may use `describe/it` strings that look verbose; that's the framework's API, not comments
- `*.d.ts` — declaration files may have ambient JSDoc for tooling
- Public library API surfaces in `libs/falcon-ui-core/**` where JSDoc drives Storybook/IntelliSense — declare in `EXEMPTIONS.md`
- Anything listed against `R-FE-010` in `exemptions/EXEMPTIONS.md`

## Fix recipe

For each violation:

1. Read the comment. Ask: does it add information the code does not?
   - **No** → delete it.
   - **Yes (implementation rationale)** → move to a sibling `.md` note (e.g. `<feature>.notes.md` or a Brain Outputs note). Replace with a single-line star-banner pointer if helpful.
   - **Yes (high-level section header)** → rewrite as star-banner (one line).
2. Rename variables/functions if the comment was compensating for unclear names (`x` → `userCount`).
3. Extract a method if the comment was labeling a code block (the method name replaces the comment).

## Related rules

- [[R-FE-011-clean-code-dry-minimal]] — paired clean-code rule (self-documenting code over comments)

## Sources of truth

1. `memory/feedback_comment_style.md` — full convention with worked examples
