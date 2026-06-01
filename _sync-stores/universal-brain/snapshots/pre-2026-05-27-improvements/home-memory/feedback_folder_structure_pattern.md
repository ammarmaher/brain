---
name: Feature folder structure — one file per type-folder
description: Every new feature/system organizes code into `models/`, `services/`, `resolvers/`, `directives/` folders, each containing ONE file named after the folder (e.g. `models.ts`, `services.ts`) that re-exports ALL classes/interfaces of that type
type: feedback
originSessionId: cfc821d6-25b0-41dc-b1e6-5e359ea3a828
---
**Rule:** When creating a new feature, library, or subsystem, use this folder layout:

```
<feature-or-system>/
├── models/
│   └── models.ts          ← every interface / class / type / const map
├── services/
│   └── services.ts        ← every @Injectable in this feature
├── resolvers/
│   └── resolvers.ts       ← every resolver / strategy / adapter class
├── directives/
│   └── directives.ts      ← every @Directive in this feature
├── tokens/                ← optional, only when DI tokens exist
│   └── tokens.ts
└── index.ts               ← barrel re-export
```

**File naming:** the file inside each folder is named the PLURAL of the folder (e.g. `models/models.ts`, `services/services.ts`).

**Alternative allowed:** when the feature name is self-evident and there's truly one primary service, the service file MAY be named `<feature>-service.ts` (e.g. `capability-service.ts`) — but the folder stays `services/`.

**Inside the file:** put every class/interface/type of that type. Do NOT split into sub-files unless the file exceeds ~500 lines or a class has genuinely independent concerns.

**Why:**
- Predictable navigation: any developer knows where to find models vs services vs directives.
- Fewer files to import from — one barrel per type.
- Forces the author to keep each type-slice cohesive (if models.ts is becoming incoherent, the feature needs splitting, not the file).
- Matches the user's established convention in his Falcon work.

**How to apply:**
- When creating a new feature, scaffold the 4 folders upfront.
- When adding a new class/interface to an existing feature, put it in the existing file for its type. Don't create a new file.
- When an agent or I write a new subsystem, ALWAYS use this layout without being asked.
- Index barrel (`index.ts`) re-exports every type file so consumers do `import { X, Y } from '@falcon/feature'`.

**Example — existing Capability subsystem (pending rename per user):**

BEFORE (one file per class/interface — wrong):
```
capabilities/
├── models/capability-mode.ts
├── models/capability-context.ts
├── models/capability-result.ts
├── tokens/capability-resolver.token.ts
├── services/capability.service.ts
└── directives/capability.directive.ts
└── directives/if-can.directive.ts
```

AFTER (consolidated per the rule):
```
capabilities/   (or new name)
├── models/models.ts          ← CapabilityMode, CapabilityContext, CapabilityResult, CapabilityResolver interface, CAPABILITY_RESOLVER token
├── services/services.ts      ← CapabilityService
├── directives/directives.ts  ← CapabilityDirective, IfCanDirective
└── index.ts
```

Pair with `feedback_clean_code_dry_minimal.md` and `feedback_comment_style.md`.

---

## 2026-05-16 clarification (v1.2.0)

When a type-folder holds **exactly one primary type per domain**, the file inside it MAY be named after the domain it owns rather than the plural-of-folder. The folder name stays `services/`, `models/`, etc., but the file name reflects the entity:

- `services/user.service.ts` exporting `class UserService` (one service per domain)
- `services/client.service.ts` exporting `class ClientService`
- `services/wallet.service.ts` exporting `class WalletService`

This is consistent with the rule above: still "one file per type-folder", still cohesive. The rename is preferred when:

1. The component / feature is a leaf (a wizard step, a drawer panel, a host-shell shared component) — not a multi-domain feature module.
2. The file would otherwise be named `services/services.ts` exporting `class AddUserApiService` — a dialectally circular name that hides the domain.
3. The class itself follows the canonical `<Domain>Service` shape (not `<Chrome>ApiService`).

When the feature genuinely has multiple unrelated services (e.g. `services/users.service.ts` + `services/permissions.service.ts`), keep them in separate files following the same convention. The single-file `services/services.ts` aggregator is appropriate only when the services are tightly coupled.

See `01-CANONICAL_PATTERN.md` §7 + `10-VALIDATION_CONVENTION.md` in `Brain Outputs/strategies/falcon-component-creation/` for the full doctrine. Reference run: `add-user-wizard` (admin-console).
