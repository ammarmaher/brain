# Patch for 00_LOAD_SEQUENTIALLY_PROMPT.md

Add this file to the sequential loading order after:

`09_REPORTING_AND_BRAIN_MEMORY.md`

New final loading order:

1. `01_NIGHT_SHIFT_FOUNDATION_SKILL.md`
2. `02_SCOPE_HOST_ADMIN_ONLY.md`
3. `03_STRUCTURE_GOVERNANCE.md`
4. `04_TAILWIND_FIRST_GOVERNANCE.md`
5. `05_NOTIFICATION_UNSAFE_CHANGES_CONFIG_GOVERNANCE.md`
6. `06_ZERO_WARNING_POLICY.md`
7. `07_SECURITY_LANGUAGE_COMMENTS_GOVERNANCE.md`
8. `08_NIGHT_SHIFT_EXECUTION_RUNNER.md`
9. `09_REPORTING_AND_BRAIN_MEMORY.md`
10. `10_REPORT_CHECKPOINT_RULE.md`

After all files are loaded, Claude must confirm:

1. BEFORE health check will be created before any code change.
2. AFTER health check will be created after safe fixes and validation.
3. FINAL Night Shift report will be created after the AFTER report.
4. Night Shift Mode will not be marked complete unless all three reports exist.
