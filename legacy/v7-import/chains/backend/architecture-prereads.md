<!-- *** Backend chain pre-read — wiki docs to load before any backend work *** -->
<!-- *** Sibling of chain.md. Adnan reads this first when the backend chain triggers. *** -->

# Backend Chain — Architecture Pre-Reads

## Purpose

Before the backend chain delegates to any Ammar, Adnan reads the wiki docs listed below into context. This guarantees layering, naming, permission boundaries, security posture, and module placement decisions are made against the architecture source of truth — not from memory or pattern-match guesswork.

All paths are absolute. The Falcon Wiki is auto-synced from Azure Wiki to the local Obsidian vault every Sunday. Source path: `C:\falcon\falcon-wiki\Home\Software-Architecture-Design\`.

If a path is marked **MISSING**, the chain falls back to the closest available document and the gap is reported in the final summary.

## Required pre-reads (load in this order)

### 1. Architecture Vision

- **Path:** `C:\falcon\falcon-wiki\Home\Software-Architecture-Design\Architecture-Vision.md`
- **Status:** PRESENT
- **Why:** Anchors the platform's strategic intent — what we are building, who consumes it, and the long-term direction. Read first to ground every later decision.

### 2. High-Level Architecture

- **Path:** `C:\falcon\falcon-wiki\Home\Software-Architecture-Design\High-Level-Architecture.md`
- **Status:** PRESENT
- **Why:** Defines the service inventory, gateways, infrastructure, and the runtime topology (Commerce, Charging, Provisioning, Identity, Core Gateway, System Gateway, MongoDB, Redis, Kafka, Zitadel). This is the map that places any new feature into the correct service.

### 3. Clean Architecture Project Structure & Business Concepts

- **Path:** `C:\falcon\falcon-wiki\Home\Software-Architecture-Design\Clean-Architecture-project-structure-&-business-concepts.md`
- **Status:** PRESENT
- **Why:** The canonical layering rules — Domain/Application/Infrastructure/Api dependency direction, the Application-Service-cannot-call-another-Application-Service rule, the use-case folder template under `Application/<Module>/UseCases/<UseCaseName>/`, Contracts DTOs vs Application DTOs, Domain Service vs Application Service vs Infrastructure Service. This is the document `use-case-structure.md` collapses into operational form.

### 4. Design Patterns & Guidelines

- **Path:** `C:\falcon\falcon-wiki\Home\Software-Architecture-Design\Design-Patterns-&-Guidelines.md`
- **Status:** PRESENT
- **Why:** Naming conventions, MediatR patterns, validation patterns, mapping conventions, repository conventions. Aligns Ammar output with the rest of the codebase.

### 5. Permissions & Authorization Module (Policy-Based Access Control)

- **Path:** `C:\falcon\falcon-wiki\Home\Software-Architecture-Design\Permissions-&-Authorization-Module-(Policy%2DBased-Access-Control).md`
- **Status:** PRESENT (filename uses URL-encoded hyphen `%2D` between `Policy` and `Based`; the encoded form is the actual file on disk).
- **Why:** ABAC policy model, claims structure, authorization controls vs application logic. Required reading whenever a use-case touches a protected resource — which is most of them.

### 6. Security Architecture

- **Path:** `C:\falcon\falcon-wiki\Home\Software-Architecture-Design\Security-Architecture.md`
- **Status:** PRESENT
- **Why:** JWT issuance/validation, Zitadel integration, claims transformation, secrets handling, cross-service auth posture. Required when adding a controller, gateway route, gRPC endpoint, or any external surface.

## Service-specific pre-reads (load when the task targets that service)

### Commerce — Account Management Module

- **Path:** `C:\falcon\falcon-wiki\Home\Software-Architecture-Design\Account-Management-Module.md`
- **Status:** PRESENT
- **Required for:** `ammar-core-commerce` tasks that touch accounts, organizations, hierarchies, owners.

### Commerce — Contact Group Module

- **Path:** `C:\falcon\falcon-wiki\Home\Software-Architecture-Design\Contact-Group-Module.md`
- **Status:** PRESENT
- **Required for:** `ammar-core-commerce` tasks that touch contact groups, group members, contact-group permissions.

### Commerce — Contact Group Permission (deeper context)

- **Path:** `C:\falcon\falcon-wiki\Home\Software-Architecture-Design\Contact-Group-Permission-Story-115329.md`
- **Path:** `C:\falcon\falcon-wiki\Home\Software-Architecture-Design\Contact-Group-Permission-Business-Walkthrough.md`
- **Status:** PRESENT (both)
- **Required for:** any work scoped to story 115329 or its derivatives. Optional otherwise.

### Identity — JWT Claims

- **Path:** `C:\falcon\falcon-wiki\Home\Software-Architecture-Design\Identity-User-Role-Claims-on-JWT.md`
- **Status:** PRESENT
- **Required for:** `ammar-auth` tasks. Strongly recommended for `ammar-core-gateway` and `ammar-system-gateway` tasks that read or forward JWT claims.

### Charging / Provisioning — service-specific docs

- **Status:** No dedicated module pages found under `Software-Architecture-Design/` at chain-creation time.
- **Fallback:** `High-Level-Architecture.md` for the service's place in the topology, plus `Clean-Architecture-project-structure-&-business-concepts.md` for the layering rules. Ammars for these services rely on their own internal `CLAUDE.md` and the existing handlers in their repos as additional ground truth.
- **Action item:** when a Charging or Provisioning module spec lands in the wiki, add it here.

## Cross-cutting pre-reads (load when relevant)

### Development & Deployment Strategy

- **Path:** `C:\falcon\falcon-wiki\Home\Software-Architecture-Design\Development-&-Deployment-Strategy.md`
- **Status:** PRESENT
- **Required for:** any task that affects branching, release tags, feature flags, or CI behavior. Optional for pure feature work inside a single service.

### Front-End Architecture

- **Path:** `C:\falcon\falcon-wiki\Home\Software-Architecture-Design\Front%2DEnd-Architecture.md`
- **Status:** PRESENT (filename uses URL-encoded hyphen `%2D` between `Front` and `End`).
- **Required for:** the frontend chain only. Listed here for cross-reference when a backend feature must align with an existing frontend contract.

## Wiki accessibility check

If `C:\falcon\falcon-wiki\` is not present or its contents look stale (e.g. missing the docs above), the backend chain stops and reports. The user must re-run the wiki sync before the chain can proceed. The chain never invents architecture rules from memory when the wiki is unreachable.

## Reading discipline

- Read each doc fully on first activation of the chain in a session.
- On subsequent activations within the same session, re-read only the docs whose content has changed (or skip if confident the context is still loaded).
- Never paraphrase a wiki rule into the chain output without grounding it back to the doc — quote the section heading or rule label so the rule is traceable.
