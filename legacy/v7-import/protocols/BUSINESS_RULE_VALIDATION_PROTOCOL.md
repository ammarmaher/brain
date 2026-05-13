# Business Rule Validation Protocol

This protocol is mandatory whenever a task includes validations, uniqueness, permissions, visibility, statuses, workflow rules, or business constraints.

## Required Flow

```txt
Understand rule
→ assign stable Rule ID
→ define business meaning
→ map PES+D layers
→ define UI visibility/errors
→ map frontend files
→ map backend/API/database files
→ create test matrix
→ implement or hand off
→ verify no layer is missing
```

## PES+D Matrix

```txt
P = Presentation/frontend validation and UI behavior
E = Endpoint/API request validation and error response
S = Service/domain business enforcement
D = Database/persistence constraint when integrity requires it
```

Every validation rule must document whether each layer is:

```txt
Required
Already exists
Missing
Not applicable
```

## Rule Contract Template

```txt
Rule ID:
Source:
Business statement:
Actor/role:
Entity/field:
Scope:
Frontend/P layer:
Endpoint/E layer:
Service/S layer:
Database/D layer:
Visibility behavior:
Error messages:
Edge cases:
Tests:
Gaps/questions:
Files impacted:
```

## Username Uniqueness Example

```txt
Rule ID: USER-UNQ-001
Business statement: Username must be unique and normalized.
Scope question: global or per client/tenant/entity?
P: required, trim, allowed characters, inline errors, disabled submit
E: DTO/model validation, HTTP 400 for invalid, HTTP 409 for duplicate
S: normalize before save, duplicate check, update-self exception
D: unique index on normalized username or scoped unique index
UX: show "This username is already used."
Tests: missing, invalid, duplicate, case-insensitive duplicate, trim, update same user
```

## Gap Rules

Ask only when the missing detail changes implementation safety.

Examples of blocking gaps:

```txt
Uniqueness scope unknown
Allowed characters unknown and no system default exists
Role/status permission matrix missing
Backend error contract conflicts across codebase
```

Continue with assumptions for non-blocking gaps and document them.
