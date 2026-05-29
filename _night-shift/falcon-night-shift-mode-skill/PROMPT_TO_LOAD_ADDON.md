# Prompt to Load This Add-on

You are Claude working inside Ammar Brain / Falcon Brain.

The Night Shift Mode skill folder is here:

C:\Falcon\Brain SK\_night-shift\falcon-night-shift-mode-skill

I added a new report-checkpoint add-on file:

C:\Falcon\Brain SK\_night-shift\falcon-night-shift-mode-skill\10_REPORT_CHECKPOINT_RULE.md

Load this file after:

C:\Falcon\Brain SK\_night-shift\falcon-night-shift-mode-skill\09_REPORTING_AND_BRAIN_MEMORY.md

Update the active Night Shift Mode loading order to include:

10_REPORT_CHECKPOINT_RULE.md

The new execution rule is mandatory:

1. Create BEFORE health check before any code change:
   C:\Falcon\architecture-reports\night-shift\00_BEFORE_HEALTH_CHECK.md

2. Create AFTER health check after safe fixes and validation:
   C:\Falcon\architecture-reports\night-shift\08_AFTER_HEALTH_CHECK.md

3. Create FINAL Night Shift report after the AFTER report:
   C:\Falcon\architecture-reports\night-shift\09_NIGHT_SHIFT_REPORT.md

Do not mark Night Shift Mode as complete unless all three reports exist.

The BEFORE report must show the current real health before changes.
The AFTER report must compare before vs after after safe fixes.
The FINAL report must summarize the full delivery, improvement percentage, remaining risks, manual review items, validation results, rollback plan, and Brain memory updates.

Use this health scoring model:

- Structure Health: 0-100
- Tailwind Health: 0-100
- Warning Health: 0-100
- Security Health: 0-100
- Configuration Health: 0-100
- Notification Governance Health: 0-100
- Unsafe Changes Health: 0-100
- Build/Lint Health: 0-100
- Overall Health: average of all categories

Scope remains:

- Host Shell
- Admin Console
- shared libraries used by Host Shell/Admin Console

Do not scan or modify Management Console.

The final report must include this exact sentence:

Management Console was excluded by request and was not scanned or modified.

Now load the full Night Shift skill sequentially, including this new file, then run Level 1 + Level 2 only:
- Level 1 = Audit
- Level 2 = Safe auto-fix

Do not run Level 3 deep refactor unless I explicitly approve.
