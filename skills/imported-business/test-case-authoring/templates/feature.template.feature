# *** Feature Template ***
# *** Copy when generating a new <module>.feature file ***
# Replace bracketed placeholders. Remove this comment block before commit.

Feature: <Module name> — <high-level capability>
  As a <role>
  I want <capability>
  So that <value>

  Background:
    Given the user is signed in as "<role>"
    And the tenant has the "<module>" feature enabled

  # ===== Golden path =====

  # Covers: PRD-XX-1.1
  @TC-XX-001 @smoke
  Scenario: <Primary success path>
    Given <precondition>
    When  <action>
    Then  <expected outcome>

  # ===== Edge cases (universal checklist) =====

  # Covers: PRD-XX-1.1 (validation)
  @TC-XX-002 @edge
  Scenario: Empty input rejected
    Given <form is open>
    When  the user submits with all required fields blank
    Then  inline validation errors appear in English and Arabic

  # Covers: PRD-XX-1.1 (i18n)
  @TC-XX-003 @i18n
  Scenario: RTL layout renders correctly in Arabic
    Given the UI language is set to Arabic
    When  the user opens the <module> page
    Then  the layout flips to right-to-left

  # ===== Permission matrix (one scenario per cell) =====

  # Covers: PRD-XX-2.1 (auth)
  @TC-XX-040 @permission
  Scenario: Anonymous user cannot read the resource
    Given the user is not signed in
    When  the user requests "/api/<module>"
    Then  the response status is 401

  # Add scenarios for: max length, special chars, token expired, network failure,
  # concurrent edit, long text truncation, pagination, sort+filter, no-results,
  # 500 error, validation display, loading, empty, success toast, error toast,
  # back/forward, deep link entry — see edge-case-checklist.md
