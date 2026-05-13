# Retest / Restructure / Redraw Enforcement Skill

## Purpose

Use this skill after any implementation, especially UI conversion, PRD implementation, validation work, PES work, or backend/frontend integration.

The goal is to prevent "first pass done" behavior.

A task is complete only after the implementation is tested, simplified, and visually/business verified.

---

## Trigger Examples

Load this skill when:

- implementing any feature
- converting React to Angular
- cloning HTML/screenshot
- applying validations
- applying PES
- fixing UI mismatch
- finishing PRD implementation
- preparing final handoff
- user asks "make sure it works"
- user asks "same as screenshot"
- user asks "retest"
- user asks "restructure"
- user asks "redraw"

---

## The Three Loops

### 1. Retest

Verify the implementation works.

Check:

```txt
Build
Lint
Unit/component tests if available
Manual interaction path
Form validation
Error messages
Loading states
Empty states
PES/access behavior
Route behavior
No regression in related screens
```

### 2. Restructure

Verify the code is clean.

Check:

```txt
No over-engineering
No duplicated logic
No giant unreadable component
No unnecessary shared library promotion
No unnecessary global state
No unnecessary services
No excessive RxJS/signals
Typed models where practical
Clear file placement
Existing Falcon components reused
```

### 3. Redraw

Verify the UI matches the source/design.

Check:

```txt
Layout
Spacing
Typography
Colors
Borders
Radius
Shadows
Component density
Table header/rows
Dropdowns
Buttons
Cards
Tabs
Modals/drawers
Hover/focus/selected/disabled states
Responsive behavior
```

---

## Root Cause Rule

If something fails, do not randomly patch.

Find the root cause:

```txt
Wrong component
Wrong variant
Wrong token
Wrong Tailwind class
Wrong wrapper
Wrong layout model
Wrong CSS specificity
Wrong state handling
Wrong PES condition
Wrong validation mapping
Wrong data/API contract
```

Fix the cause, then rerun the check.

---

## Output Format

After running this skill, output:

```txt
Retest results:
Restructure results:
Redraw results:
Issues found:
Root causes:
Fixes applied:
Remaining limitations:
Final confidence:
```

---

## Hard Rules

- Do not say complete if build/lint/test behavior is unknown; say what was checked and what was not.
- Do not leave visible UI mismatch without documenting it.
- Do not hide business/PES/validation gaps.
- Do not over-engineer while fixing.
- Do not change unrelated files.
