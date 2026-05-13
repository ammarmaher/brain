# Skill: Gemini Visual, Chart, Dashboard, and QA Validator

## Mission

Use Gemini as the visual intelligence and validation layer.

Gemini specializes in screenshots, images, UI states, charts, dashboards, diagrams, visual QA, and second-review testing.

## What Gemini owns

Gemini owns:

- Screenshot analysis
- Dashboard analysis
- Chart interpretation from images
- Visual extraction
- Chart requirements
- UI comparison
- Accessibility review from visuals
- Responsive layout review
- PR/diff QA review
- Chart validation after Claude implements

## Gemini vs ChatGPT/Codex differentiation

ChatGPT/Codex creates business tables and business-test matrices.

Gemini analyzes and validates visual charts and screenshots.

| Need | Owner |
|---|---|
| Permission matrix | ChatGPT/Codex |
| Status transition matrix | ChatGPT/Codex |
| Business test table | ChatGPT/Codex |
| Chart shown in screenshot | Gemini |
| Dashboard layout analysis | Gemini |
| Visual comparison before/after | Gemini |
| Chart axis/legend/tooltip validation | Gemini |
| Final business test matrix | ChatGPT/Codex |

## Visual extraction prompt shape

```text
Act as a senior UI/UX analyst, data visualization expert, and QA engineer.

Analyze the attached screenshot/chart/dashboard.

Extract:
1. Page purpose
2. Layout structure
3. Visible components
4. Visual hierarchy
5. Chart type(s)
6. Data shown
7. Axes, legends, labels, tooltips, series, colors
8. Filters and interactions
9. Empty/loading/error states implied
10. Responsive behavior assumptions
11. Accessibility concerns
12. Inconsistencies or UI issues
13. Implementation notes Claude needs

Do not write code.
Return a clear implementation-ready visual specification.
```

## Chart requirements Gemini must extract

For every chart, Gemini must identify:

- Chart type
- Purpose
- Data source assumption
- Data shape
- X-axis
- Y-axis
- Series/grouping
- Legend
- Tooltip
- Labels
- Formatting
- Colors/theme meaning
- Filters
- Drill-down behavior
- Empty state
- Loading state
- Error state
- Export/download behavior if visible
- Responsiveness
- Accessibility labels

If data mapping is not visible, Gemini must mark it as an assumption.

## Validation prompt shape

```text
Act as a senior QA engineer and visual reviewer.

Review the implementation result against the original screenshot/chart/dashboard requirement.

Check:
1. Layout accuracy
2. Component consistency
3. Chart type correctness
4. Data mapping correctness
5. Axis/legend/tooltip behavior
6. Responsive behavior
7. Empty/loading/error states
8. Accessibility
9. Business rule mismatches
10. Regression risks
11. Missing tests

Return:
- Pass/fail recommendation
- Issues table
- Severity
- Expected fix
- Suggested tests

Do not rewrite the implementation unless necessary.
```

## QA review checklist

Gemini must check:

- Visual alignment
- Spacing consistency
- Typography consistency
- Theme consistency
- State coverage
- Data formatting
- Sorting/filtering behavior
- Chart interaction behavior
- Keyboard accessibility
- Screen reader labels
- Mobile/tablet/desktop layout
- Overflow/horizontal scroll issues
- Empty/error/loading skeletons

## Hard rules

- Gemini must not invent hidden data fields.
- Gemini must separate visible facts from assumptions.
- Gemini must not own final business matrices; ChatGPT/Codex does.
- Gemini must not implement unless explicitly instructed.
