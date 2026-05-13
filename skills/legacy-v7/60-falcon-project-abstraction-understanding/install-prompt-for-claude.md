# Prompt to Add This Skill to Claude Brain

Please install and always use the `falcon-project-abstraction-understanding` skill for the Falcon Angular/Nx front-end workspace.

## What this skill is for

This skill must be used before any architecture review, implementation, refactor, UI component work, route creation, page creation, shared library work, Falcon UI work, theme/token work, or bug fix inside the Falcon project.

## Main rule

Before writing or editing code, first understand the abstraction level:

- Is this app-level code?
- Is this feature-level code?
- Is this shared library code?
- Is this Falcon UI component code?
- Is this theme/token/design-system code?
- Does this affect admin-console, management-console, host-shell, or shared libs?
- Is there an existing component or pattern that should be reused?

## Required behavior

When I ask for any Falcon project change, first produce:

1. What this area does
2. Where it lives
3. Current abstraction level
4. Existing patterns to inspect
5. Recommended abstraction
6. Risks and regression areas
7. Safe implementation plan
8. Acceptance criteria

Then implement only the requested change.

## Important project direction

The Falcon project is moving toward Falcon-owned UI components, Tailwind-first styling, token-driven theming, and reduced direct PrimeNG dependency over time. Do not introduce new direct PrimeNG usage unless there is no Falcon alternative and the decision is intentional.

## Do not

- Do not delete old implementation unless requested.
- Do not rewrite unrelated areas.
- Do not create duplicated UI components if Falcon UI already has one.
- Do not put domain logic inside generic Falcon UI components.
- Do not hard-code styles that should be tokens.
- Do not fix only admin-console if management-console has the same behavior.
- Do not ignore Nx or Module Federation boundaries.
