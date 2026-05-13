# Business Test Checklist

For every business-heavy task, ChatGPT/Codex must produce tests for:

- [ ] Happy path
- [ ] Negative path
- [ ] Permission/role matrix
- [ ] Status transition matrix
- [ ] Validation errors
- [ ] API failure
- [ ] Empty state
- [ ] Loading state
- [ ] Boundary values
- [ ] Cross-module dependency
- [ ] Regression scenario
- [ ] UI action visibility/disabled state
- [ ] Data mapping correctness
- [ ] Audit/logging if relevant

## Business test table template

| Test ID | Requirement | Given | When | Then | Role | Priority | Type |
|---|---|---|---|---|---|---|---|
