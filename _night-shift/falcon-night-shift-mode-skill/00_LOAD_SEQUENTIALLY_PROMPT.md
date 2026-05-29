# Load This Skill Bundle Sequentially

You are Claude working inside Ammar Brain / Falcon Brain.

Ammar has provided this folder/zip as the Night Shift Mode skill bundle.

Your job is to load and execute the files in strict sequence.

Do not jump directly to implementation.
Do not skip the planning phases.
Do not modify project files before reading all governance files.

## Required Sequence

Read these files in order:

1. `01_NIGHT_SHIFT_FOUNDATION_SKILL.md`
2. `02_SCOPE_HOST_ADMIN_ONLY.md`
3. `03_STRUCTURE_GOVERNANCE.md`
4. `04_TAILWIND_FIRST_GOVERNANCE.md`
5. `05_NOTIFICATION_UNSAFE_CHANGES_CONFIG_GOVERNANCE.md`
6. `06_ZERO_WARNING_POLICY.md`
7. `07_SECURITY_LANGUAGE_COMMENTS_GOVERNANCE.md`
8. `08_NIGHT_SHIFT_EXECUTION_RUNNER.md`
9. `09_REPORTING_AND_BRAIN_MEMORY.md`

## Execution Behavior

For each file:

1. Read it fully.
2. Summarize what rule it adds.
3. Add the rule into the active Night Shift context.
4. Check for conflict with previous rules.
5. Resolve conflict using the safest rule.
6. Continue to the next file.

After all files are loaded:

1. Create an execution plan.
2. Start with pre-flight.
3. Run audit.
4. Create fix plan.
5. Apply safe fixes only.
6. Validate.
7. Report.
8. Update Brain knowledge.

## Important

This is a controlled sequential workflow.

You must not say “done” until:

- all files are loaded,
- pre-flight is completed,
- audit is completed,
- safe fixes are applied where possible,
- validation is attempted,
- final report is created,
- remaining risky items are documented.

If a rule is unclear, do not ask Ammar unless blocked.
Use the safest default and document the assumption.
