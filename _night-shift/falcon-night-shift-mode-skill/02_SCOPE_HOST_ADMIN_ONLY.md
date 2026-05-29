# 02 — Scope: Host Shell and Admin Console Only

For this Night Shift run, ignore Management Console completely.

Only scan, audit, fix, validate, and report for:

1. `apps/host-shell`
2. `apps/admin-console`
3. shared Falcon libraries used by Host Shell and Admin Console

Do not modify:

- `apps/management-console`
- management-console routes
- management-console configuration
- management-console features
- management-console components
- management-console styles
- management-console services

Management Console is out of scope.

## Allowed Focus Areas

- `apps/host-shell/`
- `apps/admin-console/`
- shared Falcon UI libraries used by Host Shell/Admin Console
- shared utils/helpers used by Host Shell/Admin Console
- shared notification/loader/uploader/unsafe-changes libraries
- shared Tailwind/token files required by Host Shell/Admin Console

## Configuration Folders

Create or normalize application configuration only for:

- `apps/host-shell/src/app/configuration/`
- `apps/admin-console/src/app/configuration/`

Do not create or update:

- `apps/management-console/src/app/configuration/`

## Reporting Requirement

Final report must clearly state:

“Management Console was excluded by request and was not scanned or modified.”
