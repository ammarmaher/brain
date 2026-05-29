# 10 — Mandatory Report Checkpoint Rule

Add this rule to Falcon Night Shift Mode.

Night Shift Mode must create three mandatory reports:

1. BEFORE HEALTH CHECK REPORT
2. AFTER HEALTH CHECK REPORT
3. FINAL NIGHT SHIFT REPORT

Do not mark Night Shift Mode as complete unless all three reports exist.

==================================================
1. BEFORE HEALTH CHECK REPORT
==================================================

Path:

```txt
C:\Falcon\architecture-reports\night-shift\00_BEFORE_HEALTH_CHECK.md
```

When:

Before any source code change.

Purpose:

Show the real current state before Night Shift fixes.

Must include:

1. Current structure health
2. Current Tailwind/SCSS health
3. Current warning health
4. Current security health
5. Current configuration health
6. Current notification governance health
7. Current unsafe changes health
8. Current build/lint/typecheck health
9. Current issues
10. Current risks
11. Current manual review items
12. Current Host Shell status
13. Current Admin Console status
14. Current shared library status
15. Management Console exclusion confirmation

Important:

No source code changes are allowed before this report is created.

==================================================
2. AFTER HEALTH CHECK REPORT
==================================================

Path:

```txt
C:\Falcon\architecture-reports\night-shift\08_AFTER_HEALTH_CHECK.md
```

When:

After safe fixes and validation.

Purpose:

Show the state after Night Shift fixes.

Must include:

1. What changed
2. What improved
3. Before vs after comparison
4. Warnings before vs after
5. Structure before vs after
6. SCSS/Tailwind before vs after
7. Notification config before vs after
8. Unsafe changes before vs after
9. Security before vs after
10. Build/lint/typecheck after fixes
11. Remaining warnings
12. Remaining risks
13. Health score before
14. Health score after
15. Improvement percentage
16. Rollback instructions

==================================================
3. FINAL NIGHT SHIFT REPORT
==================================================

Path:

```txt
C:\Falcon\architecture-reports\night-shift\09_NIGHT_SHIFT_REPORT.md
```

When:

After the AFTER health check is completed.

Purpose:

Final executive summary and delivery report.

Must include:

1. Reference to BEFORE report
2. Reference to AFTER report
3. Executive summary
4. Scope confirmation
5. Management Console exclusion statement
6. What was scanned
7. What was fixed
8. What was not fixed
9. Risky/manual items
10. Validation result
11. Rollback plan
12. Git diff summary
13. Recommended next tasks
14. Brain memory updates
15. Final health score
16. Final improvement percentage

==================================================
HEALTH SCORING MODEL
==================================================

Use this health scoring model:

```txt
Structure Health: 0-100
Tailwind Health: 0-100
Warning Health: 0-100
Security Health: 0-100
Configuration Health: 0-100
Notification Governance Health: 0-100
Unsafe Changes Health: 0-100
Build/Lint Health: 0-100
Overall Health: average of all categories
```

The BEFORE report must calculate the initial score.
The AFTER report must calculate the updated score.
The FINAL report must summarize the improvement.

==================================================
MANDATORY COMPLETION RULE
==================================================

Night Shift Mode is not complete unless these files exist:

```txt
C:\Falcon\architecture-reports\night-shift\00_BEFORE_HEALTH_CHECK.md
C:\Falcon\architecture-reports\night-shift\08_AFTER_HEALTH_CHECK.md
C:\Falcon\architecture-reports\night-shift\09_NIGHT_SHIFT_REPORT.md
```

If any report is missing, continue the reporting phase.

Do not say “done” until all three reports are created.

==================================================
REQUIRED FINAL STATEMENT
==================================================

The FINAL report must include this exact sentence:

```txt
Management Console was excluded by request and was not scanned or modified.
```
