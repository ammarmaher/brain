<!-- *** Backend chain index — Phase H of full-pipeline-redesign *** -->

# Backend Chain — Index

This folder is the backend half of Adnan's "let's go" composition. It is the symmetrical counterpart of `C:\falcon\Brain\chains\frontend\`.

The chain is a markdown rulebook, not a code generator. When the user triggers it, Adnan loads the docs in this folder plus the listed wiki pre-reads, then delegates the implementation to the matching Ammar specialist for the target service.

## Files in this folder

| File | Role |
|---|---|
| `chain.md` | Master chain doc. Trigger phrases, agent-to-service map, hard layered enforcement rules, activation flow, done definition. |
| `use-case-structure.md` | Folder/file template for use-cases and modules, decision rule for module-vs-use-case, standing platform rules, definition-of-done checklist. |
| `architecture-prereads.md` | Wiki docs Adnan must absorb before delegating. Each entry marked PRESENT or MISSING with a fallback. |
| `README.md` | This file. |

## How Adnan triggers the chain

When the user says any of:

- `let's go on backend`
- `let's go on <feature>` — when `<feature>` is a backend feature (use-case, handler, command, query, domain event, Kafka producer/consumer, gRPC, repository, MongoDB, gateway route)
- `backend chain`
- `run backend chain`

Adnan executes the activation flow defined in `chain.md`:

1. Read `architecture-prereads.md`, then load every wiki doc it lists.
2. Read `use-case-structure.md`.
3. Apply the chain's hard layered enforcement rules + standing rules.
4. Identify the target service from the task description.
5. Delegate to the matching Ammar via the agent-to-service map below.
6. Refuse and report any sub-step that violates a hard rule.

## Agent-to-service map (at a glance)

| Subagent type | Service repo |
|---|---|
| `ammar-core-commerce` | `falcon-core-commerce-svc` |
| `ammar-core-charging` | `falcon-core-charging-svc` |
| `ammar-core-provisioning` | `falcon-core-provisioning-svc` |
| `ammar-auth` | `falcon-core-identity-svc` |
| `ammar-core-gateway` | `falcon-int-core-gateway-svc` |
| `ammar-system-gateway` | `falcon-int-system-gateway-svc` |

Multi-service tasks fan out to multiple Ammars — parallel when independent, sequential when contract-first ordering matters (the contract-owning service goes first, consumers next).

## Chain non-negotiables (one-liner each)

- Clean Architecture dependency direction is inward-only.
- An application service cannot call another application service.
- Internal services never call each other through gateways.
- Gateways are 90% YARP pass-through, 10% custom aggregation.
- Identity Service owns user lifecycle; Commerce/Charging/Provisioning consume identity events.
- `ServiceOperationResult<T>` wraps every response.
- `MultiLanguageName(En, Ar)` for every user-facing string.
- `FalconException` + `FalconError` for domain failures.
- No hardcoded secrets — config via `appsettings.json` sections.
- Use-case folder template: `Application\<Module>\UseCases\<UseCaseName>\Command|Handler|Validator|Result.cs`.

Full text and rationale lives in `chain.md` and `use-case-structure.md`.

## Phase H done definition

This deliverable is complete when:

- Adnan recognizes every trigger phrase listed in `chain.md`.
- Every wiki pre-read in `architecture-prereads.md` resolves to an existing file (or is explicitly marked MISSING with a fallback).
- A backend task delegated through the chain produces code that satisfies the use-case folder template and every standing platform rule.
- No backend code in this repo or the service repos was modified by Phase H — this phase delivers documentation only.

## Out of scope for this folder

- Service code (no `.cs` edits, no `appsettings.json` edits).
- Voice/settings/scripts/jobs assets.
- Other chains (frontend chain lives in a sibling folder).
- Any commit or push.
