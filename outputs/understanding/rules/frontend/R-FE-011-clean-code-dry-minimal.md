---
ruleId: R-FE-011
name: Clean code, DRY, minimal — no speculative abstractions
category: dry
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
severity: should
detector:
  type: semantic-llm
  patterns:
    - 'identical HTML blocks across 2+ templates in the same feature'
    - 'if/else ladder with 3+ branches dispatching on a discriminator (lookup-table candidate)'
    - 'unused @Input / @Output / public method (not referenced anywhere)'
    - 'new enum/interface duplicating an existing one'
    - '2+ helpers performing the same string/number transformation'
    - 'as any casts without a // reason: comment'
    - 'back-compat shim with no removal date'
    - 'speculative TODO referring to a future need not yet expressed'
    - 'three near-identical components that differ only by inputs'
  exemptPatterns:
    - '// reason: <explanation> on any as any cast'
  description: Semantic-LLM detector that audits diffs for duplication, speculative abstractions, dead code, and bloat. Hunts the concrete "red flags" listed in feedback_clean_code_dry_minimal.
autoFix:
  available: false
  riskLevel: high
  patchHint: 'Per finding: extract the duplicated block into a shared helper/component; collapse near-identical components into one with inputs; convert if-ladder to a lookup table or polymorphic dispatch; delete unused exports; consolidate duplicate enums/interfaces; remove dead back-compat shims.'
relatedRules:
  - R-FE-009
  - R-FE-010
source:
  - file: feedback_clean_code_dry_minimal.md
    location: memory
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-FE-011 — Clean code, DRY, minimal implementation ***
*** Source: feedback_clean_code_dry_minimal ***
*** Detector: semantic-llm (judgment over diffs) ***

# R-FE-011 — Clean code, DRY, minimal — no speculative abstractions

## What it says

Every change MUST produce:

1. **Clean code** — named well, single-responsibility, readable without comments.
2. **DRY** — no duplicated logic; extract to a helper/utility/constant the moment a pattern appears a second time.
3. **Minimal code for the solution** — the fewest lines that correctly express the behavior. No boilerplate, no dead abstractions, no speculative generality, no "just in case" code paths.
4. **Best-practice idioms** — Angular signals over RxJS Subject when appropriate; pure functions over stateful services; composition over inheritance; early return over nested ifs; `computed()` over manual derived state; template `*ngIf` + `[disabled]` over imperative `setDisabled()`.
5. **Every line earns its place** — before adding a utility, flag, or component, ask "does this exist already?" and "is this needed today, or hypothetical?".

## Why it exists

The user is a senior FE developer who reviews diffs carefully. Bloated code creates review fatigue, hides bugs, and slows onboarding. Past implementations introduced unnecessary components (a 4-variant banner when the parent story didn't need one) and duplicated field-bindings across three tabs instead of a single shared template. This rule encodes the audit checklist the reviewer applies anyway, so authors apply it pre-emptively.

## Detector strategy

Semantic-LLM pass over each PR diff (or per-file in scheduled audits). Concrete red flags to hunt:

1. Identical HTML blocks across 2+ templates → extract a shared component or `ng-template`.
2. `if/else` ladders with 3+ branches → lookup table or polymorphic dispatch.
3. Back-compat shims persisting past the migration window → delete.
4. `as any` casts without a `// reason:` comment → either fix the type or annotate.
5. Unused `@Input` / `@Output` / `public` methods → delete.
6. New enums/interfaces duplicating existing ones → consolidate.
7. Multiple helpers performing the same string/number transformation → consolidate.
8. Comments that restate code → see [[R-FE-010-comment-style]].
9. Three near-identical components → one component + inputs.
10. Manual derived state where `computed()` would work.
11. Imperative setters (`setDisabled()`) where template binding (`[disabled]="…"`) suffices.

Verdict per finding: `RED_FLAG_<n>_<short-tag>` (e.g. `RED_FLAG_3_BACK_COMPAT_SHIM`).

## Examples

### ✅ Good

```ts
// One component, three modes
@Component({ selector: 'app-banner' })
export class BannerComponent {
  @Input() variant: 'info' | 'warning' | 'error' | 'success' = 'info';
  @Input() title!: string;
  @Input() message!: string;
}
```

```ts
// Lookup table over if-ladder
const STATUS_ICONS = {
  active: 'check',
  paused: 'pause',
  closed: 'x',
} as const;
const icon = STATUS_ICONS[status];
```

```ts
// computed() over manual derived state
fullName = computed(() => `${this.first()} ${this.last()}`);
```

### ❌ Bad

```ts
// Three near-identical components — collapse to one with inputs
@Component({ selector: 'app-info-banner', … }) export class InfoBannerComponent {}
@Component({ selector: 'app-warning-banner', … }) export class WarningBannerComponent {}
@Component({ selector: 'app-error-banner', … }) export class ErrorBannerComponent {}
```

```ts
// If-ladder dispatching on a discriminator — use a lookup table
if (status === 'active') icon = 'check';
else if (status === 'paused') icon = 'pause';
else if (status === 'closed') icon = 'x';
else if (status === 'pending') icon = 'clock';
```

```ts
// Speculative generality — no current caller needs the second mode
class Loader {
  load(opts?: { mode?: 'lazy' | 'eager' }) { … }   // ❌ only 'lazy' is used today
}
```

```ts
// as any without justification
const user = (response as any).user;               // ❌ either fix types or annotate
```

## Known legitimate exemptions

- Public library APIs in `libs/falcon-ui-core/**` may have unused `@Input`s that exist for forward compatibility with documented roadmap items — declare in `EXEMPTIONS.md` with a target version
- `*.spec.ts` may legitimately duplicate small fixture blocks for clarity
- Anything listed against `R-FE-011` in `exemptions/EXEMPTIONS.md`

## Fix recipe

For each finding, apply the matching transform:

1. **Duplicated HTML** → extract `<ng-template>` or a small presentational component.
2. **If-ladder** → table lookup (`const MAP = {…} as const`) or polymorphic dispatch via a resolver pattern.
3. **Unused export** → delete. Run `nx build` to confirm nothing depends on it.
4. **Duplicate enum/interface** → keep the older one, replace all usages of the duplicate, delete the new one.
5. **Multiple helpers** → keep the most general signature, rewrite call sites, delete the rest.
6. **Speculative TODO** → delete the TODO and the speculative code path. If a future need actually arises, add it then.
7. **Near-identical components** → keep the most expressive one, add `@Input`s for the differences, retire the others.
8. **`as any`** → either fix the source types (preferred) or add `// reason: <why> ` on the same line.

## Related rules

- [[R-FE-009-folder-structure-pattern]] — folder structure that supports cohesion
- [[R-FE-010-comment-style]] — self-documenting code beats narration

## Sources of truth

1. `memory/feedback_clean_code_dry_minimal.md` — full red-flag checklist
