---
ruleId: R-FE-009
name: Feature folder structure — one file per type-folder
category: pattern
scope:
  apps:
    - admin-console
    - host-shell
    - management-console
  paths:
    - "apps/**/src/app/features/**"
    - "libs/**/src/**"
  exemptPaths:
    - "libs/falcon-ui-core/**"
    - "libs/falcon-ui-tokens/**"
    - "**/*.spec.ts"
severity: should
detector:
  type: structural
  patterns:
    - 'features/<feature>/models/*.ts not matching models.ts'
    - 'features/<feature>/services/*.ts with multiple service-file siblings'
    - 'features/<feature>/resolvers/*.ts not matching resolvers.ts'
    - 'features/<feature>/directives/*.ts not matching directives.ts'
  exemptPatterns:
    - '<feature>-service.ts where exactly one service exists'
    - '*.spec.ts'
  description: Structural sweep — for every feature folder, verify each type-folder (models/, services/, resolvers/, directives/, optional tokens/) contains exactly ONE file named after the folder in plural form (models.ts, services.ts, etc.). Multiple split files inside a type-folder is a violation unless the consolidated file would exceed ~500 lines.
autoFix:
  available: false
  riskLevel: medium
  patchHint: 'Consolidate split files: merge models/capability-mode.ts + models/capability-context.ts + models/capability-result.ts into models/models.ts. Update imports. Add a single barrel index.ts at the feature root.'
relatedRules:
  - R-FE-010
  - R-FE-011
source:
  - file: feedback_folder_structure_pattern.md
    location: memory
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-FE-009 — Feature folder structure — one file per type-folder ***
*** Source: feedback_folder_structure_pattern ***
*** Detector: structural (file tree shape) ***

# R-FE-009 — Feature folder structure — one file per type-folder

## What it says

Every new feature, library, or subsystem MUST be organized into type-folders, each containing exactly ONE file named after the folder in plural form:

```
<feature-or-system>/
├── models/
│   └── models.ts            ← every interface / class / type / const map
├── services/
│   └── services.ts          ← every @Injectable in this feature
├── resolvers/
│   └── resolvers.ts         ← every resolver / strategy / adapter class
├── directives/
│   └── directives.ts        ← every @Directive in this feature
├── tokens/                  ← optional, only when DI tokens exist
│   └── tokens.ts
└── index.ts                 ← barrel re-export
```

The file inside each type-folder is named after the folder in plural form (`models/models.ts`). Alternative permitted: when there is exactly one primary service, the file MAY be named `<feature>-service.ts` (e.g. `services/capability-service.ts`) — but the folder stays `services/`. Inside the file, put every class/interface/type of that type. Splitting into sub-files is only allowed when the consolidated file would exceed ~500 lines OR a class has genuinely independent concerns.

## Why it exists

- **Predictable navigation** — any developer knows where to find models vs services vs directives.
- **Fewer imports** — one barrel per type-slice.
- **Forces cohesion** — if `models.ts` is becoming incoherent, the feature needs splitting, not the file.
- Matches the user's established convention across Falcon work.

## Detector strategy

Structural sweep:

1. Enumerate every `apps/**/src/app/features/**` and `libs/**/src/**` folder that contains any of `models/`, `services/`, `resolvers/`, `directives/`, or `tokens/` subfolders.
2. For each such type-folder, list its `*.ts` files (excluding `*.spec.ts`).
3. Acceptable shapes:
   - Exactly one file named after the folder in plural form: `models/models.ts`, `services/services.ts`, etc.
   - For `services/`: a single file matching `<feature>-service.ts` is acceptable as an alternative.
4. Any other shape (multiple files, file named differently) is a violation, unless an `EXEMPTIONS.md` entry justifies a >500-line consolidated equivalent.

Files in `libs/falcon-ui-core/**` and `libs/falcon-ui-tokens/**` follow the Stencil component layout and are exempt.

## Examples

### ✅ Good

```
apps/admin-console/src/app/features/capabilities/
├── models/
│   └── models.ts          ← CapabilityMode, CapabilityContext, CapabilityResult, CapabilityResolver, CAPABILITY_RESOLVER token
├── services/
│   └── services.ts        ← CapabilityService
├── directives/
│   └── directives.ts      ← CapabilityDirective, IfCanDirective
└── index.ts               ← export * from './models/models'; export * from './services/services'; export * from './directives/directives';
```

### ❌ Bad

```
apps/admin-console/src/app/features/capabilities/
├── models/
│   ├── capability-mode.ts          ❌ split file
│   ├── capability-context.ts       ❌ split file
│   └── capability-result.ts        ❌ split file
├── tokens/
│   └── capability-resolver.token.ts  ❌ should live in models.ts as a const, or in tokens/tokens.ts
├── services/
│   └── capability.service.ts       ❌ should be services.ts or capability-service.ts (note the dash not dot)
└── directives/
    ├── capability.directive.ts     ❌ split file
    └── if-can.directive.ts         ❌ split file
```

## Known legitimate exemptions

- `libs/falcon-ui-core/**` — Stencil component layout (one folder per component)
- `libs/falcon-ui-tokens/**` — token contract layout (one file per component)
- Any consolidated `*.ts` file that would exceed ~500 lines — split is justified; declare in `EXEMPTIONS.md`
- `*.spec.ts` test files are co-located alongside their subject and not counted
- Anything listed against `R-FE-009` in `exemptions/EXEMPTIONS.md`

## Fix recipe

For each violation:

1. Read every split file under the type-folder.
2. Create or open `<type>/<type>s.ts` (e.g. `models/models.ts`).
3. Move every export from the split files into the consolidated file, preserving export names.
4. Delete the split files.
5. Update the feature's `index.ts` barrel to re-export from the consolidated file only.
6. Find-and-replace all import paths across the workspace to point at the new file or the barrel.
7. Re-run `nx build <app>` to confirm the moves resolve.
8. If the consolidated file exceeds ~500 lines, consider whether the feature itself is too large — split features, not files.

## Related rules

- [[R-FE-010-comment-style]] — paired convention from the same author
- [[R-FE-011-clean-code-dry-minimal]] — paired convention from the same author

## Sources of truth

1. `memory/feedback_folder_structure_pattern.md` — full convention with examples
