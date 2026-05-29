# 08 — Night Shift Execution Runner

Run this after loading all governance files.

## Phase 0 — Pre-flight

Detect:

1. project root
2. host-shell path
3. admin-console path
4. shared library paths
5. package manager
6. build/lint/test scripts
7. Tailwind config
8. ESLint/Prettier config
9. TypeScript config and path aliases
10. existing architecture reports
11. git branch and status
12. files that must never be committed

Create:

```txt
C:\Falcon\architecture-reports\night-shift\00_PREFLIGHT.md
```

## Phase 1 — Audit

Audit only. Do not modify files.

Create:

```txt
C:\Falcon\architecture-reports\night-shift\01_AUDIT.md
```

Audit:

1. folder structure issues
2. inline models/interfaces/DTOs/types/classes
3. signal placement issues
4. validation placement issues
5. service placement issues
6. helper placement issues
7. SCSS/CSS that can become Tailwind
8. security findings
9. comment cleanup findings
10. naming/language findings
11. config strategy findings
12. notification/uploader/loader findings
13. unsafe changes findings
14. warning findings
15. build/lint risks
16. manual review risks

Each finding includes:

- file path
- issue type
- current problem
- recommended fix
- safe auto-fix: yes/no
- risk level
- affected area

## Phase 2 — Fix Plan

Create:

```txt
C:\Falcon\architecture-reports\night-shift\02_FIX_PLAN.md
```

Group fixes into:

1. safe auto-fixes
2. medium-risk fixes
3. manual-review-only fixes
4. Tailwind migration candidates
5. security fixes
6. library config fixes
7. notification/unsafe changes fixes
8. warning cleanup fixes
9. admin-console structure fixes
10. host-shell structure fixes

## Phase 3 — Safe Fixes

Apply only safe fixes:

1. structure normalization
2. model extraction
3. validation extraction
4. signal extraction
5. service extraction
6. helper promotion where safe
7. comments cleanup
8. Tailwind replacements where safe
9. config centralization where safe
10. warning cleanup where safe
11. security cleanup where safe

Do not perform risky refactors.

## Phase 4 — Validation

Run available commands:

1. format
2. lint
3. typecheck
4. build host-shell
5. build admin-console
6. affected build/lint if available

If a command fails:

1. capture error
2. fix if caused by safe changes
3. rerun once
4. if still failing, report clearly

## Phase 5 — Final Report

Create:

```txt
C:\Falcon\architecture-reports\night-shift\09_NIGHT_SHIFT_REPORT.md
```

Do not mark complete unless final report exists.
