*** Falcon Brain — Cron / Nightly Gap Scan ***
*** Phase E of the Brain pipeline redesign — see `Brain/jobs/full-pipeline-redesign.md` Phase E ***

# Nightly Gap Scan (Cron)

This folder ships the Windows Task Scheduler bindings for the **nightly business-gap-detection sweep**.
The job is intentionally tiny: it records that a sweep was triggered. The actual gap analysis is
performed by Adnan/Claude when the daily run record is opened against the
[`business-gap-detection`](../../brain-skills/business-skills/business-gap-detection/Skill.md) skill.

## What this job is

Every day, the scheduled task invokes
[`Brain/scripts/nightly-gap-scan.ps1`](../scripts/nightly-gap-scan.ps1). The wrapper:

1. Verifies the source skill (`brain-skills/business-skills/business-gap-detection/Skill.md`) is
   reachable; logs a warning if not.
2. Writes a dated stub run record at `C:\falcon\Brain\suggestions\YYYY-MM-DD.md` containing the
   start time, status `INITIATED`, and a TODO list describing what the skill must do when
   activated.
3. Appends one entry of shape
   `{ "type": "nightly-gap-scan", "level": "L0", "outputs": [...], "timestamp": "...", "summary": "..." }`
   to `C:\falcon\Brain\analysis\index.json` if that file exists; otherwise logs a warning.
4. Exits 0 unconditionally — failures are logged, never propagated (cron contract).

The wrapper does **not** perform gap detection itself. It only schedules + records the invocation
event. Adnan picks the dated run record up later and runs the actual skill against it.

## Trigger

Two triggers register together under one task:

| Trigger      | When                          |
|--------------|-------------------------------|
| **AtLogOn**  | Each time the user signs in   |
| **Daily**    | Every day at **02:00** local  |

## Output destination

- One file per run, dated: `C:\falcon\Brain\suggestions\YYYY-MM-DD.md`
- Append-only history. Today's file is rewritten only if it does not yet exist.
- Index entry: `C:\falcon\Brain\analysis\index.json` (only if that file already exists).

See [`../suggestions/README.md`](../suggestions/README.md) for the file format.

## Install / Uninstall

### Install
```powershell
# Open PowerShell as the user who will own the task (no admin needed).
C:\falcon\Brain\cron\install-task.ps1
```
You will be prompted to confirm. Pass `-Force` to skip the prompt.

### Uninstall
```powershell
C:\falcon\Brain\cron\uninstall-task.ps1
```

## Run manually

```powershell
# Run via Task Scheduler (uses the registered action):
Start-ScheduledTask -TaskName 'FalconBrainNightlyGapScan'

# Or invoke the wrapper directly (same effect, no scheduler involvement):
powershell.exe -ExecutionPolicy Bypass -NoProfile -File C:\falcon\Brain\scripts\nightly-gap-scan.ps1
```

After either form, check today's run record at
`C:\falcon\Brain\suggestions\<YYYY-MM-DD>.md`.

## Files in this folder

| File                  | Purpose                                              |
|-----------------------|------------------------------------------------------|
| `install-task.ps1`    | Registers `FalconBrainNightlyGapScan` (logon + 02:00)|
| `uninstall-task.ps1`  | Removes the same task                                |
| `README.md`           | This document                                        |

## Hard rules

- The installer is **not** auto-run. The user installs it explicitly.
- The wrapper script is the **only** thing scheduled — no other Brain scripts are touched.
- The wrapper **never** modifies a `business-skills/**` source file. It only reads
  `Skill.md` to confirm the skill is present.
- The job **never** propagates failures. If something breaks, it logs and exits 0.
