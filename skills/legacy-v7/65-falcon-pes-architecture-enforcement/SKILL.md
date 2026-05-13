# Falcon PES Architecture Enforcement Skill

## Purpose

Use this skill whenever a task, PRD, screen, route, tab, action, field, validation, menu item, drawer, modal, workflow, or API behavior may depend on Falcon PES.

PES must be treated as a Falcon architecture concept that comes from the Falcon Wiki, architecture documentation, or existing code.

Do not invent the exact PES definition.

Do not rename PES to PESD.

Do not assume database enforcement is part of PES unless the architecture explicitly says so.

---

## Current Working Understanding

Until the Falcon Wiki definition is loaded, treat PES as a Falcon permission/eligibility/screen-control architecture that can affect:

- screen visibility
- route access
- tab visibility
- menu visibility
- action visibility
- action enablement/disablement
- field visibility
- field editability
- validation visibility
- data scope
- allowed operations
- forbidden/direct route behavior

This working understanding must be replaced by the exact Wiki definition once available.

---

## Trigger Examples

Load this skill when the user mentions or implies:

- PES
- permission
- role
- access
- hide tab
- hide action
- disable button
- normal user should not see
- user can/cannot perform action
- validation should/should not show
- route should be blocked
- menu should be controlled
- field should be read-only/hidden
- scoped data

---

## Required Inputs to Search

Before implementing PES-related behavior, inspect:

1. Falcon Wiki PES definition, if available.
2. Existing project architecture docs.
3. Existing frontend permission/PES services.
4. Existing route guards.
5. Existing menu/action visibility patterns.
6. Existing backend/API contracts if the UI depends on API permissions.
7. PRD role/access sections.
8. User-provided clarification.

---

## PES Matrix

For every feature affected by PES, create a matrix:

```txt
Area
Role/User Type
PES Rule
Visible?
Enabled?
Editable?
Validation Shown?
Route Accessible?
Fallback Behavior
Source of Truth
Gap/Question
```

Example:

```txt
Area: Add User tab
Role/User Type: Normal User
PES Rule: TBD from Wiki/code
Visible: No
Enabled: N/A
Editable: N/A
Validation Shown: No
Route Accessible: Block or redirect, TBD
Fallback Behavior: Hide tab or show forbidden state, TBD
Source of Truth: PES service/config/Wiki
Gap/Question: Confirm whether hidden or disabled is required
```

---

## Behavior Rules

When PES says an area is not allowed, decide the expected behavior from architecture:

- hide
- disable
- read-only
- block direct route
- show forbidden state
- show empty state
- show validation or suppress validation
- restrict data scope

If architecture is unclear, ask a targeted question.

If the task must continue, use the safest assumption and document it.

---

## Integration with Business Validation

Do not mix PES with business validation.

Business validation answers: "What is valid?"

PES answers: "Who can see/do/apply it?"

Example:

```txt
Business rule:
Username must be unique.

PES rule:
Only allowed users can create/edit username.
Normal users may not see the user-management tab.
```

Both must be checked, but they are not the same thing.

---

## Implementation Checklist

Before coding:

```txt
Identify PES-related areas.
Find existing PES source of truth.
Map roles/user types.
Decide visibility/editability/action behavior.
Define direct route behavior.
Define validation visibility.
Identify gaps/questions.
```

During coding:

```txt
Use existing PES services/guards/directives.
Do not create a parallel permission system.
Keep logic centralized when architecture already provides it.
Do not hardcode role checks unless current architecture does that.
Do not duplicate PES decisions across templates.
```

After coding:

```txt
Verify each role/user type.
Verify hidden/disabled/read-only states.
Verify direct URL behavior.
Verify validation visibility.
Verify no unauthorized action can be triggered.
Verify existing behavior did not regress.
```

---

## Output Required

For PES work, always output:

```txt
PES areas found:
Source of PES truth:
PES matrix:
Implementation approach:
Gaps/questions:
Files changed:
Tests/checks:
```

---

## Hard Rules

- Do not define PES incorrectly.
- Do not expand PES into database/PESD unless architecture says so.
- Do not create a new permission system if one exists.
- Do not ignore direct route access.
- Do not only hide buttons while leaving actions callable.
- Do not apply validation visibility without checking PES.
- Do not over-engineer.
