<!-- *** Skill chain: backend "let's go" *** -->
<!-- *** Phase H of full-pipeline-redesign — single trigger that loads the BE rule stack *** -->

# Chain: Backend "let's go"

## Purpose

A single composition that, when activated, makes Adnan apply the Falcon backend rule stack — Clean Architecture + DDD + CQRS via MediatR + use-case folder layout + cross-service boundary rules — to the active task. Phase H of `Brain\jobs\full-pipeline-redesign.md`. Mirrors the frontend chain at `Brain\chains\frontend\chain.md`.

This chain does not generate code on its own. It loads rules. The downstream task (e.g. "add a `SuspendUser` use-case to Commerce") then runs under those rules and is delegated to the matching Ammar agent.

## Trigger phrases

When the user says any of the following, Adnan activates this chain:

- `let's go on backend`
- `let's go on <feature>` — when `<feature>` is recognized as a backend feature (use-case, handler, command, query, domain event, Kafka producer/consumer, gRPC, repository, MongoDB collection, gateway route)
- `backend chain`
- `run backend chain`

If `<feature>` ambiguity exists between FE and BE, Adnan asks once which side; on BE, this chain runs. If a feature spans both sides, Adnan runs the backend chain first (data contract first), then the frontend chain.

## Pre-read (mandatory before chain activates)

Adnan reads `architecture-prereads.md` (sibling file) and loads the listed wiki docs into context **before** loading any sub-skill or delegating to an Ammar. This guarantees layering, naming, permission boundaries, and module placement decisions are made against the architecture source of truth — not from memory or guesswork.

## Sub-doc load order

After the wiki pre-read, Adnan reads each sibling doc below in this order. Order matters: the last doc in the list overrides earlier ones on conflict. Falcon project standards win over generic Clean Architecture wording.

1. `architecture-prereads.md` — wiki docs to absorb first.
2. `use-case-structure.md` — concrete folder/file expectations, decision rule for module-vs-use-case, standing platform rules.

## Agent-to-service map (delegation matrix)

Adnan never writes backend code directly. After loading the chain, he delegates to the matching Ammar specialist. One Ammar per service. Cross-service work fans out to multiple Ammars in parallel (independent edits) or sequence (contract-first edits).

| Subagent type | Service repo | Owns |
|---|---|---|
| `ammar-core-commerce` | `falcon-core-commerce-svc` | Commerce domain — accounts, contact groups, orders, services, applications, communication channels, pricing, renewals |
| `ammar-core-charging` | `falcon-core-charging-svc` | Charging domain — wallet, balances, ledger, transfers, funding decisions |
| `ammar-core-provisioning` | `falcon-core-provisioning-svc` | Provisioning domain — service subscriptions, tenant lifecycle, visibility |
| `ammar-auth` | `falcon-core-identity-svc` | Identity domain — user lifecycle, authentication flows, OTP, password, IP allowlist, sessions, webhooks. Owns user lifecycle (NOT Commerce, NOT Zitadel directly) |
| `ammar-core-gateway` | `falcon-int-core-gateway-svc` | Client-facing gateway — YARP routing, response aggregation, JWT forwarding |
| `ammar-system-gateway` | `falcon-int-system-gateway-svc` | Falcon-admin-facing gateway — YARP routing, response aggregation, JWT forwarding |

## Hard layered enforcement rules (chain-level overrides — non-negotiable)

These rules come from the architecture wiki and standing user-feedback memory. They override anything an Ammar default-prompt or sub-skill might say.

1. **Clean Architecture dependency direction.** `Domain` → `Application` → `Infrastructure` → `Api`. Dependencies point inward only. `Domain` references nothing. `Application` references only `Domain`. `Infrastructure` and `Api` reference `Application` (and `Domain` transitively). No backwards reference is ever introduced.
   - Source: `Clean-Architecture-project-structure-&-business-concepts.md`.

2. **Application Service CANNOT call another Application Service.** Cross-use-case logic moves to a Domain Service, a domain event, or an explicit coordinator/orchestrator at the Application layer that owns both. Handlers do not `_mediator.Send(otherCommand)` to chain use-cases.
   - Source: wiki, "Application Service Can't Call Another Application Service".

3. **Internal services NEVER call each other through gateways.** Service-to-service communication uses gRPC (synchronous) or Kafka (asynchronous) directly. Gateways (`core-gateway`, `system-gateway`) are exclusively for external (browser/mobile/admin) traffic. Commerce calling Charging goes service-to-service, not through the gateway.

4. **Gateways use YARP — 90% pass-through, 10% custom aggregation.** Default to YARP route config. Custom Minimal API endpoints exist only when aggregation/transformation across multiple downstream services is required. Custom endpoints still forward JWTs unchanged and never re-issue tokens.

5. **Identity Service owns user lifecycle.** Creation, status changes (Active/Locked/Suspended/Deleted), credential operations, OTP, password reset, session lifecycle — all live in `falcon-core-identity-svc`. Commerce, Charging, Provisioning consume identity events; they do not mutate users. No service talks to Zitadel directly except Identity.

6. **`ServiceOperationResult<T>` is the universal response wrapper.** Every command/query handler returns it. Every controller/endpoint returns it. Errors are encoded as `FalconError` codes inside the result, not raw exceptions across the wire.

7. **`MultiLanguageName(string En, string Ar)` for every user-facing label** stored in the domain (entity names, status labels, error display strings, etc.). No bare strings.

8. **`FalconException` with `FalconError` codes for domain failures.** Throw inside the domain/application layer. The exception middleware translates to `ServiceOperationResult` errors at the API edge. No raw `Exception` or `InvalidOperationException` for business failures.

9. **No hardcoded secrets.** Connection strings, API keys, tokens, signing keys all live in `appsettings.json` sections (Mongo, Redis, Kafka, Zitadel, Mailing, Sms, Hangfire) or environment variables. PRs that introduce a literal secret are rejected at the chain level.

10. **`IUnitOfWorkTrigger` on every state-changing command.** The `UnitOfWorkFilter` only commits when the command implements this interface. Read-only queries do not implement it.

11. **`FluentValidation` on every command/query that accepts user input.** Validators sit next to the command in the same use-case folder. The `ValidationBehavior` MediatR pipeline rejects invalid inputs before the handler runs.

12. **`IRepository<T>` is the only data-access surface.** No direct `IMongoCollection<T>` access from `Application` or `Api`. Custom queries go through repository methods or repository extensions in `Infrastructure`.

## Standing rules also enforced (carried from CLAUDE.md and memory)

- No commit without explicit user permission (`feedback_never_commit_without_explicit_permission.md`).
- No push without explicit user permission (`feedback_never_push_without_explicit_permission.md`).
- Strict task scope — do not touch infra, config, or tooling outside the task (`feedback_strict_task_scope.md`).
- Clean DRY minimal code, no speculative abstractions (`feedback_clean_code_dry_minimal.md`).
- Banner-format comments only — `*** ... ***` delimited, max 2 lines, no JSDoc-style verbosity (`feedback_comment_style.md`).
- Folder pattern from `feedback_folder_structure_pattern.md` applies to backend mappings/services where appropriate (one file per type-folder), without fighting the use-case folder template.
- No service code execution / no live test runs against running services during implementation. Build-time `dotnet build` and unit tests under `tests/` are the only allowed validation steps.

## Activation flow (what Adnan does on trigger)

1. Match trigger phrase. If ambiguous (FE vs BE), ask once.
2. Read `architecture-prereads.md`, then load every wiki doc it lists into context.
3. Read `use-case-structure.md`.
4. Apply hard layered enforcement rules + standing rules over whatever the Ammar default prompt says.
5. Identify the target service from the task description and select the matching Ammar from the agent-to-service map. For multi-service tasks, plan the order: contract-owning service first, consumers next.
6. Delegate the implementation to the selected Ammar(s) with the loaded ruleset attached.
7. Refuse any sub-step that violates a hard rule (e.g. handler calling another handler, service-to-service via gateway, raw `IMongoCollection` access) and report the violation with the exact rule reference.

## De-activation

The chain stays in effect for the duration of the current backend task. A new unrelated trigger (frontend chain, infrastructure chain) replaces it. Switching services within the same backend task does not re-trigger the chain — the loaded rules already cover every backend service.

## Done definition for this chain

- All wiki pre-reads in `architecture-prereads.md` resolve (or are explicitly marked MISSING with a fallback in that file).
- `use-case-structure.md` is read before any new file is created in any backend service.
- The selected Ammar produces code that satisfies every hard layered enforcement rule above.
- No application service calls another application service.
- No internal service-to-service call routes through a gateway.
- No service writes to Zitadel directly except `falcon-core-identity-svc`.
- Every new command/query handler returns `ServiceOperationResult<T>`, has a `FluentValidation` validator (when input-bearing), and lives under `Application\<Module>\UseCases\<UseCaseName>\` per the template in `use-case-structure.md`.
