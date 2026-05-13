# Skill: Business Rule Validation Enforcement Engine

## Skill Name

Business Rule Validation Enforcement Engine

## Purpose

Use this skill whenever a PRD, task, backend endpoint, frontend form, table action, workflow, or user story contains business rules that must be enforced consistently in the Falcon system.

This skill prevents the AI from only "understanding" a requirement without implementing the required validation, UI behavior, API checks, permission checks, error messages, and tests.

Example requirement:

```txt
The user should have a username.
The username must be unique.
When creating a username for a client, it must be clean and valid.
```

This must become an implementation contract across frontend, backend, database/API, UX messages, and tests.

---

## Trigger Phrases

Activate this skill when Ammar says or the files contain:

- validation
- unique
- required
- clean username
- duplicate
- permission
- role
- status
- should show
- should not show
- must not allow
- PES validation
- business rule
- rule should always apply
- PRD says
- backend should validate
- frontend should prevent
- what should be shown
- what should not be shown
- create/update/delete rule
- user/client/entity validation

Also activate this skill automatically after `63-prd-intelligence-and-gap-engine` whenever PRD requirements contain validations, permissions, uniqueness, visibility rules, lifecycle/status rules, or edge cases.

---

## Main Rule

Every understood business rule must be converted into an enforceable implementation contract.

Do not leave business rules as documentation only.

For each rule, define:

```txt
Business meaning
Frontend validation
Backend validation
Database/API constraint if applicable
Visibility / UI behavior
Error message
Permission/status condition
Test cases
Regression risks
Implementation files
```

If a rule cannot be implemented because information is missing, classify it as a gap and ask only the blocking question.

---

## Business Rule Contract Format

For every rule, create a contract using this format:

```txt
Rule ID:
Source:
Business statement:
Actor/role:
Entity/field:
Create behavior:
Update behavior:
Delete behavior:
Visibility behavior:
Frontend validation:
Backend validation:
Database/API constraint:
Error message:
Edge cases:
Test cases:
Files impacted:
Gap/assumption:
```

Generated rule IDs must be stable:

```txt
{MODULE}-VAL-001
{MODULE}-UNQ-001
{MODULE}-VIS-001
{MODULE}-PERM-001
{MODULE}-STATUS-001
{MODULE}-ERR-001
```

---

## Validation Layering Rule

Apply validation at the correct layers.

### 1. Frontend validation

Use frontend validation for immediate UX feedback.

Examples:

```txt
required field
format check
min/max length
allowed characters
trim spaces
disable submit when invalid
show inline error
show duplicate warning after API response
```

Frontend validation improves UX but is not the source of truth.

### 2. Backend validation

Backend validation is mandatory for business integrity.

Examples:

```txt
required field
normalization/trim
uniqueness check
permission check
status transition check
ownership check
entity existence check
duplicate prevention
```

Never rely only on frontend validation.

### 3. Database/API constraint

Use database or persistence-level constraints when appropriate.

Examples:

```txt
unique index for normalized username when business requires global uniqueness
scoped unique index for username per client/entity when business requires scoped uniqueness
foreign key integrity
not-null fields
soft-delete aware uniqueness when required
```

If the current backend architecture does not expose DB constraints, document the persistence-level recommendation and enforce it in service logic.

---

## Username Example Rule

When the requirement says:

```txt
User should have a username.
Username is always unique.
Username is clean.
```

The skill must convert it to:

```txt
Rule ID: USER-UNQ-001
Business statement: Every user must have a unique, normalized username.
Frontend validation:
- username is required
- trim leading/trailing spaces
- prevent invalid characters
- show inline error before submit
- disable submit while invalid
Backend validation:
- normalize username before saving
- reject duplicate username
- reject empty/invalid username after normalization
- return a clear conflict/bad-request response
Database/API constraint:
- unique constraint/index on normalized username, or scoped uniqueness if PRD says per client
Error messages:
- Username is required.
- Username can only contain allowed characters.
- This username is already used.
Edge cases:
- different casing should not bypass uniqueness
- leading/trailing spaces should not create a new username
- update should allow the same username for the same user
- soft-deleted users must follow the project rule: reusable or still reserved
Tests:
- create valid username succeeds
- missing username fails
- duplicate username fails
- same username with different case fails
- username with spaces is normalized
- update same user with same username succeeds
- update to another user’s username fails
```

Do not implement only the input field.

Do not implement only the API check.

The full contract must be covered.

---

## PES Validation Rule

When Ammar says “PES validation,” treat it as a strict cross-layer validation requirement unless the project defines a more specific PES meaning.

PES must be mapped as:

```txt
P = Presentation validation
E = Endpoint/API validation
S = Service/domain validation
```

For every validation rule, check all three layers:

```txt
Presentation:
- Angular form/control validation
- inline errors
- disabled submit
- visible/hidden UI rules

Endpoint/API:
- request DTO validation
- model validation
- response error contract
- HTTP status mapping

Service/domain:
- business rule enforcement
- uniqueness/existence checks
- permission/status rules
- transaction safety
```

If a persistence/database rule is required, include it as an additional persistence layer:

```txt
D = Database/persistence constraint
```

So the complete strict mode is:

```txt
PES+D when persistence integrity is required.
```

---

## Visibility and UX Rule

Business rules are not only backend rules.

For every rule, decide what the user should see or not see.

Examples:

```txt
Should the field be visible?
Should the field be editable?
Should the button be disabled?
Should an action be hidden or disabled?
Should a tooltip explain why?
Should the error be inline or toast?
Should the table action be removed for unauthorized users?
Should a modal/drawer show warning or confirmation?
```

If the PRD says a user cannot perform an action, enforce it in both:

```txt
UI visibility/disabled state
Backend permission validation
```

Never hide-only without backend enforcement.

Never backend-only when the UI can guide the user earlier.

---

## Permission and Status Rule

For any rule involving role, permission, status, lifecycle, approval, or workflow:

Create a matrix:

```txt
Actor/Role | Status | Can View | Can Create | Can Edit | Can Delete | Can Approve | UI Behavior | Backend Check
```

Then implement according to the matrix.

If the matrix is missing from the PRD, generate a draft assumption and mark it as a gap.

---

## Error Message Rule

Every validation must define user-facing messages.

Messages should be:

```txt
clear
business-friendly
not technical
consistent with Falcon UX
specific enough to help the user fix the issue
```

Examples:

```txt
Username is required.
This username is already used.
Only letters, numbers, dots, underscores, and hyphens are allowed.
You do not have permission to edit this record.
This action is not allowed while the request is approved.
```

Do not expose raw backend exceptions to users.

---

## Implementation Mapping Rule

Before coding, map the rule to files.

Frontend mapping:

```txt
Angular component
form model/control
validator function
service/facade call
DTO/interface
UI state
error display
submit button behavior
```

Backend mapping:

```txt
controller endpoint
request DTO
validator/model validation
service/domain method
repository/query
entity/database constraint
response DTO/API error
unit/integration test
```

If the codebase already has validators or shared validation helpers, reuse them.

Do not duplicate validation logic unnecessarily.

---

## Gap Detection Rule

If a validation requirement is incomplete, classify the gap.

Blocking examples:

```txt
Uniqueness scope is unknown: global, per client, per tenant, per entity, or per location.
Allowed username characters are not defined.
Minimum/maximum length is not defined and no system default exists.
Soft-delete reuse behavior is not defined.
Error response contract is missing and backend already has multiple patterns.
```

Important but not blocking examples:

```txt
Exact wording of error message is not approved.
Tooltip text is not defined.
Frontend visual style exists but can use Falcon default.
```

Minor examples:

```txt
Placeholder text is missing.
Field order is not specified but obvious from existing UI.
```

Ask only blocking questions.

If continuing with assumptions, document them.

---

## Test Matrix Rule

For every validation/business rule, generate tests.

Minimum test groups:

```txt
Frontend validation tests
Backend validation tests
Integration/API tests
Permission/status tests
Regression tests
```

For UI tasks, include manual QA scenarios:

```txt
Valid input
Missing input
Invalid format
Duplicate value
Permission denied
Disabled action
Error message display
Successful save
Refresh/reload behavior
```

For backend tasks, include:

```txt
HTTP status
error response shape
service rule enforcement
duplicate race condition if applicable
case-insensitive uniqueness if applicable
transaction behavior if applicable
```

---

## Output Required

When this skill is activated, output must include:

```txt
Validation/business rule contracts
PES+D matrix
Frontend impact
Backend impact
Database/API impact
Visibility/UX behavior
Error messages
Gaps/questions
Test matrix
Implementation checklist
```

For implementation prompts, include all of the above in the Claude handoff.

---

## Strict Rules

Do:

- Convert every understood business rule into implementation behavior.
- Apply validation in frontend and backend.
- Use database/persistence constraints when needed.
- Define what should be shown, hidden, disabled, or blocked.
- Define error messages.
- Link requirements to code files.
- Generate tests.
- Ask only blocking gap questions.

Do not:

- Keep validation only in documentation.
- Rely only on frontend validation.
- Hide actions without backend checks.
- Invent missing business rules without marking assumptions.
- Skip edge cases.
- Use generic error messages when specific messages are needed.
- Over-engineer validation frameworks for one simple rule.

---

## Final Brain Trigger

Whenever a PRD, task, or user story contains validation, uniqueness, visibility, permissions, statuses, or business rules, activate this skill after PRD understanding and before implementation.

The brain must not just understand the requirement.

It must enforce it through:

```txt
Frontend behavior
Backend validation
Database/API integrity where needed
UX messages
Tests
Traceability
```
