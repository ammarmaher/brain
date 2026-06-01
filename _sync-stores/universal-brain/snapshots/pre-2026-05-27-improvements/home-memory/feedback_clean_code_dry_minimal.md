---
name: Clean code, DRY, minimal implementation
description: Every task must produce the smallest amount of clean, DRY, idiomatic code; no duplication; no over-engineering
type: feedback
originSessionId: cfc821d6-25b0-41dc-b1e6-5e359ea3a828
---
**Rule:** All code I (and my delegated agents) produce must satisfy:

1. **Clean code** — named well, single-responsibility, readable without comments.
2. **DRY** — never duplicate logic; extract to a helper/utility/constant the moment a pattern appears a second time.
3. **Minimal code for the solution** — prefer the *fewest lines* that correctly express the behavior. Avoid boilerplate, dead abstractions, speculative generality, or "just in case" code paths.
4. **Best-practice idioms** — follow the framework's canonical patterns (Angular signals over RxJS Subject when appropriate; pure functions over stateful services; composition over inheritance; early return over nested ifs; etc.).
5. **Every line must earn its place** — before adding a utility, a flag, or a component, ask "does this exist already?" and "is this needed today, or hypothetical?".

**Why:** The user is a senior FE developer who reviews diffs carefully. Bloated code creates review fatigue, hides bugs, and slows onboarding for the rest of the team. Past implementations introduced unnecessary components (e.g. a 4-variant banner when the parent story didn't need one) and duplicated field-bindings across three tabs instead of a single shared template.

**How to apply:**
- In every agent brief, include: "Write the minimum code that satisfies the AC. If you're about to add a utility/helper/component, first check if an existing one fits."
- After an agent reports done, audit the diff for: duplicated patterns, components that could be collapsed, capability flags that could be derived instead of stored, unused exports, commented-out code, speculative TODOs.
- Push back on any artifact that only exists for hypothetical future needs.
- Prefer `computed()` / pure functions over explicit methods that always return derived state.
- Prefer template-driven `*ngIf` + `[disabled]` over imperative `setDisabled()` calls.
- Prefer one reusable component + inputs over three near-identical components.
- Prefer composition in the framework's language (pipes, signals, directives) over TypeScript boilerplate.

**Concrete red flags to hunt after every task:**
- Identical HTML blocks across 2+ templates
- `if / else` ladders that could be a lookup table
- Back-compat shims that persist beyond the migration window
- `as any` casts without a comment explaining why
- Unused `@Input` / `@Output` or `public` methods
- New enums/interfaces duplicating existing ones
- More than one helper that does the same string/number transformation
- Comments that restate the code
