# Model Handoff Protocol

## Purpose

Defines exactly how ChatGPT/Codex, Claude, and Gemini pass work between each other.

## Standard sequence

```text
User request
  ↓
ChatGPT/Codex: requirement + business test + tables/matrices
  ↓
Gemini: visual/chart extraction if screenshots/charts exist
  ↓
ChatGPT/Codex: final Claude implementation prompt
  ↓
Claude: code implementation
  ↓
Gemini: QA, visual/chart validation, PR/diff review
  ↓
ChatGPT/Codex: final business review and next-step summary
```

## Handoff package from ChatGPT/Codex to Claude

Must include:

- Goal
- Context
- Problem
- Expected behavior
- Business rules
- UI/UX requirements
- Chart/data requirements if any
- Files/areas to inspect
- Constraints
- Acceptance criteria
- Business tests
- Regression risks
- Validation commands

## Handoff package from Gemini to ChatGPT/Codex

Must include:

- Visual facts
- Visual assumptions
- Chart specs
- Data mapping assumptions
- UI issues
- Accessibility issues
- Suggested QA checks

## Handoff package from Claude to Gemini

Must include:

- Changed files
- Screenshots if available
- Diff summary
- Implemented chart/data behavior
- Known assumptions
- Validation command results

## Handoff package from Gemini to Claude

Must include:

- Issue severity
- Expected fix
- Exact UI/chart mismatch
- Suggested tests
- Pass/fail recommendation

## Stop rules

Stop the handoff if:

- The source information is insufficient for safe implementation.
- Business rules contradict each other.
- A chart has no data mapping and cannot be inferred.
- The requested change would break architecture rules.
