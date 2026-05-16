---
type: adr
adr-id: ADR-008
title: Why the feature-folder pattern — one file per type-folder
status: accepted
date: 2026-05-16
deciders: [Ammar Maher, Falcon Frontend Working Group]
supersedes: []
superseded-by: []
---

*** ADR-008 — Why every feature folder uses the one-file-per-type-folder layout ***
*** Status: accepted · Reversal severity: high (workspace-wide refactor) ***

# ADR-008 — Why the feature-folder pattern (one file per type-folder)

## Context

Every Angular team makes a thousand small decisions about where to put models, services, guards, resolvers, directives, and pipes. Left to per-developer taste, three variants emerge inside the same workspace within months:

1. **Per-class file (Angular CLI default).** `nx g component`, `nx g service`, `nx g interface` produce one file per class — `user.model.ts`, `user.service.ts`, `user-detail.component.ts`, `user-edit.guard.ts`, and so on. A feature of any depth quickly becomes a folder with 25–60 sibling files, each named after a single class. Find-in-files becomes the navigation tool of record.

2. **Per-feature flat.** All files live directly under `features/user/` with no type-folders. Works for tiny features; breaks immediately at scale — type collisions appear (`user.service.ts` vs `user-list.service.ts`), and "show me every service in this feature" requires a glob.

3. **Per-feature subfoldered with per-class files.** `features/user/models/user.model.ts`, `features/user/models/user-role.model.ts`, `features/user/services/user.service.ts`, `features/user/services/user-list.service.ts`. The CLI-default applied recursively. Files multiply ~4× over variant 2.

Across Falcon's three apps and 9 libraries the same feature was being authored three different ways depending on who landed first. By early-2026 [BRAIN-OUT] `FOLDER_STRUCTURE_DEEP_DIVE.md` §8 captured the problem: every new Capability subsystem, every new feature folder, every new shared subsystem invented its own layout. Two consequences hurt daily work:

- **Unfindable code.** A developer joining a feature mid-stream cannot reliably guess where a model, service, or directive lives. "Look in `models/`" is a guess, not a rule.
- **Refactor friction.** Renaming a feature, splitting it, or extracting an inner type-slice required touching dozens of files instead of a handful.

The rule below was captured from a recurring author preference into a formal convention ([MEMORY] `feedback_folder_structure_pattern.md`, originSessionId `cfc821d6-25b0-41dc-b1e6-5e359ea3a828`) and promoted to a structural rule ([BRAIN-OUT] `rules/frontend/R-FE-009-folder-structure-pattern.md`).

## Decision

**Every feature folder has the same fixed sub-structure. One file per type-folder. The file is named after the folder in plural form. All members of that type live inside that one file.**

```
features/<feature>/
├── <feature>.routes.ts          Route definitions for the feature
├── models/
│   └── models.ts                Every interface, type, enum, class, const map
├── services/
│   └── services.ts              Every @Injectable for the feature
│   └── [<thing>-state.service.ts]   EXCEPTION — signal-state services may be their own file
├── resolvers/
│   └── resolvers.ts             Every Resolve / ResolveFn (when the feature has any)
├── directives/
│   └── directives.ts            Every @Directive (when the feature has any)
├── tokens/                      Optional — only when feature-scoped DI tokens exist
│   └── tokens.ts
├── components/                  One folder per component (its own concern — see §4 of FOLDER_STRUCTURE_DEEP_DIVE)
└── index.ts                     Optional barrel — re-exports the type files
```

**No exceptions other than the two named ones:**

1. **Signal-state services may be their own file** (e.g. `hierarchy-page-state.service.ts`). The page-scoped state service grows large by design — separating it from stateless data-access services keeps both readable. This is documented in [BRAIN-OUT] `STATE_MANAGEMENT_ARCHITECTURE.md` §3 and reflected in R-FE-009's exempt pattern.
2. **Consolidated file > ~500 lines, and the contents genuinely split along independent concerns.** The remedy is normally "split the feature, not the file"; an oversized consolidated file is a signal of a feature that wants to become two features. If a true split is justified, declare it in `exemptions/EXEMPTIONS.md` against R-FE-009.

The rule applies to:
- `apps/**/src/app/features/**` — every feature folder in every app
- `libs/**/src/**` subsystems — every internal subsystem inside a library (capabilities, access-control, session, language, etc.)

The rule explicitly does NOT apply to:
- `libs/falcon-ui-core/**` — Stencil component layout (one folder per component, `<name>.tsx` + `<name>.css` + `<name>.types.ts` + `<name>.utils.ts`) is the Stencil framework's own convention and trumps R-FE-009 inside that library.
- `libs/falcon-ui-tokens/**` — token contract layout (one CSS file per component) is a different artifact class.
- `*.spec.ts` test files — co-located alongside the subject under test, never counted against the rule.

## Alternatives considered

### A. Per-class file (Angular CLI default) — **rejected**

Keep the CLI default: `user.model.ts`, `user.service.ts`, `user-list.service.ts`, `user.guard.ts`, `user.resolver.ts`, `user.directive.ts`. Rejected because:

- **File explosion.** A medium feature lands at 25–60 files in the feature root or scattered across type-folders. The `org-hierarchy-page` feature alone would have ~30 files in `services/` and `~25` in `models/` under this scheme; today it has 7 files in `services/` and 1 in `models/`.
- **Refactor friction.** Renaming a feature touches every file. Extracting a sub-feature requires moving N files and updating N imports. Under the chosen rule, the equivalent edit is one file move + one barrel update.
- **Import noise.** `import { User } from './models/user.model'; import { UserRole } from './models/user-role.model'; import { UserStatus } from './models/user-status.model';` versus a single `import { User, UserRole, UserStatus } from './models/models';`. Every feature pays the noise tax.
- **No cohesion pressure.** Per-class files let related types drift apart silently. A consolidated `models.ts` makes incoherence visible — if the file is hard to read, the feature wants splitting.

### B. Per-feature flat (no type-folders) — **rejected**

Drop type-folders entirely. `features/user/user.models.ts`, `features/user/user.service.ts`, `features/user/user-list.service.ts`, `features/user/user.component.ts`. Rejected because:

- **Name collisions at scale.** `<feature>.service.ts` collides with itself across features as soon as the feature grows past one service. Disambiguating with prefixes (`<feature>-list.service.ts`, `<feature>-detail.service.ts`) reintroduces variant A's file count.
- **No separation of concerns at the directory level.** "Show me every service in this feature" requires a glob. Type-folders make the answer one `ls`.
- **Components and types mix.** Component files (always many — one per template) drown out the type files in the same directory.

### C. Hexagonal / Clean Architecture frontend folders — **rejected**

Adopt `domain/`, `application/`, `infrastructure/`, `presentation/` per feature, mirroring backend Clean Architecture. Rejected because:

- **Overkill for UI features.** Falcon features are presentational compositions over a thin domain. The four-layer split adds three folders for every feature without separating things that change at different rates — models, services, and components all change together when a feature evolves.
- **Doesn't map to Angular DI.** Angular's DI graph is single-layer (`providedIn: 'root'`, page-scoped, component-scoped). Splitting into "application services" vs "infrastructure services" is an artificial seam that Angular itself does not enforce — the compiler treats them identically.
- **Components have nowhere natural to live.** `presentation/` becomes a synonym for `components/`. The hexagonal split disguises the same problem variant B solves with type-folders, while adding ceremony.
- **Cross-feature consistency.** The chosen rule reads the same in every feature — anyone who has seen one Falcon feature can navigate any other. Hexagonal folders demand the author understand the architecture vocabulary before they can navigate.

### D. Per-feature subfoldered with per-class files — **rejected**

The middle ground: keep type-folders (variant A's structure) but with per-class files inside (variant B's verbosity). `features/user/models/user.model.ts`, `features/user/models/user-role.model.ts`. Rejected because it inherits A's file-explosion and import-noise costs while gaining no new benefit over the chosen rule. The only thing variant D does that the chosen rule doesn't is allow per-class git blame — which a per-class export comment block achieves equally well inside a consolidated file.

## Consequences

### Positive

- **Predictable file location.** Any developer who has navigated one Falcon feature can navigate every other. `features/X/models/models.ts` is the only place X's models live. There is no second place to look.
- **Single import per type-folder.** Consumers write `import { ClientNode, UserSummary, TreeViewMode } from './models/models';` — one path, not N.
- **Refactor "all models of feature X" is one file edit.** Renaming, restructuring, or extracting a type-slice is a single-file operation. Equivalent edits under variant A touch N files and N import sites.
- **No duplicate-name collisions across features.** Type-folders namespace types by feature; `features/billing/models/models.ts` and `features/user/models/models.ts` never collide.
- **Cohesion pressure.** A `models.ts` that becomes hard to read signals that the feature is two features. The fix is to split the feature, not the file — which produces a structural improvement, not a file-shuffle.
- **Detector is trivial.** R-FE-009's structural detector is "enumerate `<feature>/<type>/*.ts`, accept exactly `<type>.ts`, reject everything else." No AST. No imports parsing. Pure file-tree shape.
- **Barrel hygiene.** The optional `index.ts` re-exports the four type files and nothing else. Cross-feature consumers import via the barrel; intra-feature consumers reach into `./models/models` directly. No cherry-picking inside the feature folder.

### Negative (acknowledged, accepted)

- **Large `services.ts` files are normal.** The canonical example — `apps/admin-console/src/app/features/org-hierarchy-page/services/hierarchy-page-state.service.ts` — is **675 lines** of signal-state, computed-state, effects, and orchestration on disk today. That's not a typo. The first encounter with a 600+-line state service intimidates newcomers used to "one class, one file" norms.
  - **Mitigation:** the EXCEPTION clause permits signal-state services to live in their own file (as `hierarchy-page-state.service.ts` does), so the giant file is at least *named* and not hidden inside `services.ts`. Stateless services and HTTP wrappers stay in `services.ts` (218 lines for this feature — comfortably navigable).
  - **Mitigation:** a `services.ts` > 500 lines is the trigger to ask "should this feature be two features?" The cohesion pressure is a feature of the rule, not a bug.

- **Git blame loses per-class granularity.** A consolidated `models.ts` shows the author of each type interleaved with every other edit to the file. Per-class file blame is cleaner.
  - **Trade-off accepted.** Blame at the type level is recoverable from the diff history; navigation and refactor wins are not recoverable from per-class files.

- **Reordering inside the file matters for readability.** A `services.ts` that lists services in arbitrary order is harder to read than one ordered by dependency. The rule does not enforce ordering — convention is "data-access services first, then domain services, then UI orchestrators."

- **The rule is structural, not auto-fixable.** R-FE-009 ships `autoFix.available: false` because consolidating split files requires updating every import site — beyond what a safe codemod can guarantee. New violations are detected automatically; remediation is manual.

## Verification

The chosen rule is live in the canonical example and enforced by the night-shift audit.

### Live canonical example — `apps/admin-console/src/app/features/org-hierarchy-page/`

Verified on disk `2026-05-16`:

```
org-hierarchy-page/
├── org-hierarchy-page.routes.ts        (route registers HierarchyPageStateService via providers)
├── models/
│   └── models.ts                       367 lines — ClientNode, UserSummary, TreeViewMode, all enums and DTOs
├── services/
│   ├── services.ts                     218 lines — HierarchyService (HTTP) + adjacent stateless services
│   ├── hierarchy-page-state.service.ts 675 lines — page-scoped signal-state (EXCEPTION clause)
│   ├── validators.ts                   feature-scoped synchronous validators
│   ├── validation-messages.ts          i18n message keys for validators
│   ├── mock-applications.ts            mock data (dev-only)
│   ├── mock-tree.ts                    mock data (dev-only)
│   └── otp-mock.service.ts             mock OTP service (dev-only, exception per mock-service convention)
└── components/                         one folder per component (deeper structure documented in FOLDER_STRUCTURE_DEEP_DIVE §8)
```

This feature does not have `resolvers/` or `directives/` folders — the optional clause applies (you only create the folder when the feature has members of that type). The rule does **not** require empty type-folders.

### Scoping proof — page-scoped, not root-scoped

The state service is registered on the page route, not globally. From [CODE] `org-hierarchy-page.routes.ts:12`:

```ts
providers: [HierarchyPageStateService],
```

And the service declaration at [CODE] `hierarchy-page-state.service.ts:1-2`:

```ts
@Injectable()
/*** Page-scoped via providers: [HierarchyPageStateService]; never providedIn root. ***/
```

This is the canonical pattern documented in [BRAIN-OUT] `STATE_MANAGEMENT_ARCHITECTURE.md` §3 ("State two or more sibling components must share, scoped to one page → page-scoped `@Injectable()` (no `providedIn`) registered in the page component's `providers: [...]`"). The folder rule and the scoping rule reinforce each other — feature-scoped state goes in a feature-scoped file, registered at the feature route.

### Structural detector

R-FE-009's detector ([BRAIN-OUT] `rules/frontend/R-FE-009-folder-structure-pattern.md` lines 17-32) does a structural sweep across `apps/**/src/app/features/**` and `libs/**/src/**`, listing every `<type>/*.ts` and rejecting anything that isn't `<type>.ts`. The audit produced **20 violations** workspace-wide as of the latest run — concentrated in older subsystems authored before the rule was formalized (e.g. legacy capability-subsystem split files). These violations are the queued remediation work; new features are landed against the rule from inception.

### Documentation alignment

The rule, the live example, and the state-management pattern triangulate:

- [BRAIN-OUT] `FOLDER_STRUCTURE_DEEP_DIVE.md` §8 documents the convention and points at `org-hierarchy-page` as the live example.
- [BRAIN-OUT] `STATE_MANAGEMENT_ARCHITECTURE.md` §3 documents the signal-state-service EXCEPTION and confirms the `providers: [...]` scoping at the page component.
- [BRAIN-OUT] `rules/frontend/R-FE-009-folder-structure-pattern.md` documents the structural detector + fix recipe.
- [MEMORY] `feedback_folder_structure_pattern.md` is the original author preference statement.

## Related

- [BRAIN-OUT] `FOLDER_STRUCTURE_DEEP_DIVE.md` — Agent D's Tier 2 output; §8 covers this rule with the live `org-hierarchy-page` walkthrough
- [BRAIN-OUT] `STATE_MANAGEMENT_ARCHITECTURE.md` — Agent C's Tier 2 output; §3 covers page-scoped state services and the `providers: [...]` registration that pairs with this folder rule
- [BRAIN-OUT] `rules/frontend/R-FE-009-folder-structure-pattern.md` — the rulebook entry with structural detector, fix recipe, and exempt patterns
- [BRAIN-OUT] `rules/frontend/R-FE-011-clean-code-dry-minimal.md` — paired convention that informs how large a consolidated file may grow before it signals a feature-split
- [BRAIN-OUT] `rules/frontend/R-FE-010-comment-style.md` — paired convention (terse `*** ... ***` banner comments inside the consolidated files)
- [MEMORY] `feedback_folder_structure_pattern.md` — original author-preference statement
- [MEMORY] `feedback_clean_code_dry_minimal.md` — sibling rule on minimum code, DRY, no speculative abstractions
- [CODE] `apps/admin-console/src/app/features/org-hierarchy-page/` — the canonical live example
