*** Gherkin Rules — test-case-authoring ***
*** Standard Given/When/Then shape for all Falcon test cases ***

# Gherkin Rules

## Standard shape

```gherkin
Feature: <Module name> — <high-level capability>

  Background:
    Given <shared precondition>

  @TC-XX-001 @smoke
  Scenario: <Specific behavior under one set of conditions>
    Given <precondition>
    When  <action>
    Then  <expected outcome>
    And   <additional assertion>
```

## Hard rules

1. Every `Scenario` has a stable `@TC-<MODULE>-<###>` tag
2. Every scenario covers ≥1 PRD requirement — link via `# Covers: PRD-AM-3.2` line above
3. Max 3 `And` per Given/When/Then block — split into multiple scenarios if more needed
4. No `But` — use `And` with negative phrasing
5. Use `Background` for shared preconditions (login, role setup) — never repeat in every scenario
6. Use `Scenario Outline` + `Examples` for parameterized cases (validation tables, role matrices)
7. Step text uses canonical glossary terms only — banned terms fail validation

## Tag taxonomy

| Tag | Meaning |
|---|---|
| `@TC-XX-###` | Stable test ID (required) |
| `@smoke` | Critical path — runs every build |
| `@regression` | Full suite |
| `@permission` | Role/permission matrix scenario |
| `@edge` | Edge case from the universal checklist |
| `@i18n` | Multi-language / RTL scenario |
| `@a11y` | Accessibility check |

## Step phrasing

- Past tense in `Given` (`Given the user has logged in`)
- Active voice in `When` (`When the user clicks Save`)
- Observable outcome in `Then` (`Then the contact group is listed`)

## Anti-patterns

- ❌ `Then it works` — not observable
- ❌ `When user does the thing and then another thing and then a third thing` — split scenarios
- ❌ `Given the system is in a complex state` — be specific or use Background
- ❌ Implementation details (`Given the database has a row in tbl_account`) — describe behavior, not state
