<!-- *** Frontend chain: mandatory wiki pre-reads *** -->
<!-- *** Phase G of full-pipeline-redesign — Adnan reads these BEFORE applying chain.md *** -->

# Architecture Pre-reads (mandatory before chain activates)

When the frontend chain is triggered, Adnan reads each document below — in order — into context **before** loading any of the five sub-skill `Skill.md` files referenced by `chain.md`. This guarantees that placement decisions (which app, which lib, which permission boundary, which trust zone) are made against the architecture source of truth rather than against whatever the sub-skills happen to suggest.

If a document is missing, the listed fallback is used and the substitution is announced when the chain reports activation.

## Required documents

### 1. Front-End Architecture
- **Path:** `C:\falcon\falcon-wiki\Home\Software-Architecture-Design\Front%2DEnd-Architecture.md`
- **Status:** EXISTS (URL-encoded filename — `%2D` is the literal hyphen between "Front" and "End")
- **Why:** Defines the host-shell + remote-MFE topology, the `@falcon/*` library boundaries, Module Federation contract, theming/i18n boundaries, and the host↔remote facade model. Every component placement decision starts here.

### 2. Architecture Vision
- **Path:** `C:\falcon\falcon-wiki\Home\Software-Architecture-Design\Architecture-Vision.md`
- **Status:** EXISTS
- **Why:** Sets the platform's north-star principles: micro-frontend split, Clean Architecture for backend, multi-tenant isolation, identity-as-source-of-truth, multi-language defaults. Frontend choices that violate these principles are rejected.

### 3. High-Level Architecture
- **Path:** `C:\falcon\falcon-wiki\Home\Software-Architecture-Design\High-Level-Architecture.md`
- **Status:** EXISTS
- **Why:** Maps the System Gateway / Core Gateway split, where Falcon-admin vs Client traffic flows, and which backend services own which data. The frontend chain uses this to pick the correct gateway base URL and to know which user-type guard to apply.

### 4. Permissions & Authorization (Policy-Based Access Control)
- **Path:** `C:\falcon\falcon-wiki\Home\Software-Architecture-Design\Permissions-&-Authorization-Module-(Policy%2DBased-Access-Control).md`
- **Status:** EXISTS (URL-encoded filename — the `%2D` between "Policy" and "Based" is the literal hyphen)
- **Why:** Defines the permission claim shape on the JWT, the policy evaluation rules, and how the frontend should gate routes/components. The chain uses this to pick the correct guard, the correct directive (`*ifCan`-style), and the correct claim names — never inventing new ones.

### 5. Security Architecture
- **Path:** `C:\falcon\falcon-wiki\Home\Software-Architecture-Design\Security-Architecture.md`
- **Status:** EXISTS
- **Why:** Specifies token storage rules, refresh-token handling, IP allowlist behavior, and the rule that the browser NEVER calls Zitadel directly (all auth goes through Identity Service at `auth.falconhub.space/api/`). Reinforces `feedback_frontend_auth_identity_service.md`.

### 6. Design Patterns & Guidelines
- **Path:** `C:\falcon\falcon-wiki\Home\Software-Architecture-Design\Design-Patterns-&-Guidelines.md`
- **Status:** EXISTS
- **Why:** Naming conventions (kebab-case files, PascalCase types), folder conventions, the standalone-component-only rule, the `inject()`-over-constructor rule, the `OnPush`-by-default rule, and platform-wide patterns (response wrapper, multi-language strings, error codes). The component layout in `component-layout.md` is consistent with this document; on conflict, this document loses to the chain memory rule.

## Read order

1. Architecture Vision (sets principles)
2. High-Level Architecture (sets topology)
3. Front-End Architecture (sets FE shape)
4. Security Architecture (sets auth/trust rules)
5. Permissions & Authorization (sets gating rules)
6. Design Patterns & Guidelines (sets naming/style)

This order moves from broad principles to concrete patterns so later documents can be evaluated against earlier ones.

## Filename note

Two of the six wiki documents are stored on disk with URL-encoded names containing `%2D` (literal hyphen). When passing them to the `Read` tool the path must include the `%2D` exactly as it appears in the filesystem. The CLAUDE.md path table at `C:\falcon\CLAUDE.md` lists these documents under their human-readable names; the on-disk paths shown above are authoritative.

## Fallback policy (currently unused — every doc exists)

If any document above goes missing in the future, the chain falls back as follows. Today every document is present, so no fallback is active.

| Missing document | Fallback |
|---|---|
| Front-End Architecture | `High-Level-Architecture.md` (closest existing) |
| Architecture Vision | `High-Level-Architecture.md` |
| High-Level-Architecture | `Architecture-Vision.md` |
| Permissions & Authorization | `Security-Architecture.md` |
| Security Architecture | `Permissions-&-Authorization-Module-(Policy%2DBased-Access-Control).md` |
| Design Patterns & Guidelines | `Clean-Architecture-project-structure-&-business-concepts.md` |

When the chain activates with a fallback in play, Adnan announces the substitution in his activation report so the user knows the rule stack is operating with reduced source material.

## Done definition for the pre-read step

- All six documents above resolved successfully (or fallbacks announced).
- Their content is in Adnan's working context BEFORE the five sub-skill `Skill.md` files are read.
- `chain.md`'s activation flow proceeds to step 3 (sub-skill load) only after this step completes.
