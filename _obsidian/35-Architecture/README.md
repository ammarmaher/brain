*** Architecture Rule Set — Frontend ***
*** SoT: Brain Outputs/understanding/frontend/architecture/*.md (13 audits) ***
*** Indexed 2026-05-15 by Brain SK Phase 3F ***

# Frontend Architecture Rule Set

> Frontend architectural rules extracted from 13 audit files at `Brain Outputs/understanding/frontend/architecture/`. Each audit becomes one vault note surfacing the most important rules verbatim. The audit files remain the full source of truth — these notes are the graph entry points.

## Audit registry

| # | Vault note | SoT file | Key rules | Type |
|---|---|---|---|---|
| 1 | [[Auth and Facade Patterns]] | `AUTH_AND_FACADE_PATTERNS.md` | 9 | code-cited |
| 2 | [[Barrel Exports]] | `BARREL_EXPORTS_AUDIT.md` | 7 | code-cited |
| 3 | [[Component Usage Matrix]] | `COMPONENT_USAGE_MATRIX.md` | 6 | data table |
| 4 | [[Feature Folder Structure]] | `FEATURE_FOLDER_STRUCTURE.md` | 10 | code-cited |
| 5 | [[Forbidden Patterns]] | `FORBIDDEN_PATTERNS_OBSERVED.md` | 10 | grep-verified |
| 6 | [[Import Path Conventions]] | `IMPORT_PATH_CONVENTIONS.md` | 9 | tsconfig-cited |
| 7 | [[Module Federation]] | `MODULE_FEDERATION_PATTERNS.md` | 10 | code-cited |
| 8 | [[Quality Gates]] | `QUALITY_GATES_AUDIT.md` | 12 | gate registry |
| 9 | [[Routes and Module Federation]] | `ROUTES_AND_MF_AUDIT.md` | 8 | code-cited |
| 10 | [[State and Signals]] | `STATE_AND_SIGNAL_PATTERNS.md` | 10 | code-cited |
| 11 | [[Unused and Deprecated]] | `UNUSED_AND_DEPRECATED_COMPONENTS.md` | 7 | data table |
| 12 | [[Workspace Topology]] | `WORKSPACE_TOPOLOGY.md` | 9 | code-cited |
| 13 | [[Wrapper Import Decision Tree]] | `WRAPPER_IMPORT_DECISION_TREE.md` | 9 | decision tree |

**Total extracted rules:** ~116 across 13 audits.

## Cross-cutting rules (cited in multiple audits)

- **No PrimeNG / PrimeIcons** — appears in [[Forbidden Patterns]], [[Module Federation]], [[Quality Gates]], [[Wrapper Import Decision Tree]]. Enforced by ESLint flat-block in `eslint.config.mjs:26` + share-map deletion + memory rule.
- **No `*ngIf` / `*ngFor` / `*ngSwitch`** — appears in [[Forbidden Patterns]], [[Wrapper Import Decision Tree]]. Zero matches across apps; new control flow `@if / @for / @switch` only.
- **Tokens only, no hardcoded `#hex`/`px`** — appears in [[Forbidden Patterns]], [[Quality Gates]] (gate-08), [[Wrapper Import Decision Tree]]. Memory rule `feedback_no_inline_styles_tokens_only.md` (hardened 2026-05-05).
- **Zoneless + signal-based change detection** — appears in [[Auth and Facade Patterns]], [[State and Signals]], [[Workspace Topology]]. All 3 apps register `provideZonelessChangeDetection()`.
- **Per-component direct import `@falcon/ui-core/angular`** — appears in [[Barrel Exports]], [[Import Path Conventions]], [[Wrapper Import Decision Tree]]. Canonical Angular wrapper import path.
- **Frontend NEVER calls Zitadel directly** — appears in [[Auth and Facade Patterns]], [[Forbidden Patterns]]. All auth flows through `AuthApiService` → `Gateway.IdentityGateway`. Memory `feedback_frontend_auth_identity_service.md` (STRICT).

## Top 10 forbidden patterns surfaced

1. `from 'primeng/...'` imports — ESLint flat-block.
2. `pi pi-*` icon class strings — fully purged Wave PR-8.
3. `*ngIf` / `*ngFor` / `*ngSwitch` legacy control flow.
4. Inline `style="..."` attributes in templates (1 remaining violation).
5. Tailwind arbitrary `bg-[#hex]` / `text-[#hex]` / `border-[#hex]` (~19+ violations).
6. Tailwind arbitrary `rounded-[Npx]` and `w-[Npx]` / `h-[Npx]` (~24+ violations).
7. Direct `<falcon-input>` in feature code (use `<falcon-angular-input>` instead).
8. Token CSS files declared under `:root` (gate-12 — freezes Chrome DevTools).
9. `@Injectable({ providedIn: 'root' })` for page-scoped state services.
10. SCSS files with declared rules in component folders (Tailwind-only rule).

## Hubs

- [[FRONTEND_INDEX]] · [[COMPONENT_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
