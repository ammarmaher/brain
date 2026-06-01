---
type: doctrine
purpose: night-shift-safety
created: 2026-05-16
appliesTo: all night-shift jobs under C:\Falcon\Brain\jobs\ and tools/night-shift/
---

*** Falcon Night Shift — Boundary Doctrine ***
*** Read by every night-shift job before execution. Refuse to proceed if a step violates this. ***

# Night Shift Boundaries

> The single safety contract that night shift honors. Every job under `C:\Falcon\Brain\jobs\` and `tools/night-shift/` starts by reading this file and rejecting steps that violate any column.

## The boundary matrix

| Category | CAN do alone | MUST queue for morning | NEVER do |
|---|---|---|---|
| **Vault notes** | Read · add wiki-links · fill missing frontmatter · update scorecards · append to LEARNING_CHANGE_HISTORY · refresh KNOWLEDGE_ROOT_INDEX | Promote a pattern to global · approve a learning event · close a gap · change a rule severity | Delete notes · rewrite playbook spec · edit rule body content |
| **Code audit** | Run detectors · write violation reports · group by rule/file · generate auto-fix patches into `proposed-fixes/` | Apply any patch · close a violation · mark a rule deprecated · edit code | Edit code · run formatters · run linters with `--fix` |
| **Frontend code** | Read-only | All changes — write to a plan note only | Any edit · commit · push · run build (in production-affecting way) |
| **Backend code** | Read-only | All changes — write to a plan note only | Any edit · commit · push · run build (in production-affecting way) |
| **PRDs / wiki** | Read · summarize · index | Edit a PRD · edit wiki | Touch architecture wiki without explicit approval |
| **Git on Falcon repos** | `fetch` · `status` · `log` · `diff` · `for-each-ref` | `add` / `commit` / `tag` — write plan only | `push` · `force-push` · `reset --hard` · branch deletion · `rebase -i` |
| **Git on brain repo** (`C:\Falcon\Brain SK\`) | `add` / `commit` of pure brain artifacts (reports, learning events, vault graph nodes) | Any change touching `outputs/understanding/rules/` body content | `force-push` · branch deletion · `reset --hard` |
| **Brain APIs** (ChatGPT / Gemini / Claude) | Read-only verdict calls · budget cap **300 calls/night** | Calls beyond cap · any prompt asking the model to commit or push | Use real secrets in prompts · send full proprietary source files (truncate to 8 KB) |
| **Decisions** | Classify · prioritize · suggest | Approve · Reject · final call | Make a product call · close a gap · promote a pattern |
| **Reports** | Append to `outputs/reports/night-shift/<date>/` | Edit historical reports older than current run | Delete prior reports · overwrite previous runs |

## Mandatory pre-flight (every job)

Before any job runs, the orchestrator verifies:

1. ✅ Brain SK repo working tree state captured (`git status` snapshot saved to run folder)
2. ✅ Universal Brain state idle (`current-task.json.status != 'in_progress'`) OR explicit override
3. ✅ Output folder `outputs/reports/night-shift/<run-id>/` created and writable
4. ✅ All Falcon repos discoverable at `C:\Falcon\Falcon\falcon-*`
5. ✅ Detector engines parse-clean (PS5.1 BOM + no syntax errors)

If any check fails, the job aborts cleanly with a `night-shift-aborted.md` summary instead of partial work.

## Mandatory post-flight (every job)

After every job:

1. ✅ Write `outputs/reports/night-shift/<run-id>/run-summary.json` with:
   - `runId`, `startedAt`, `finishedAt`, `durationSec`
   - per-step `status` (`ok` / `skipped` / `failed`)
   - `violationCount`, `decisionsQueued`, `gitFetchResults`
2. ✅ Append a row to `outputs/reports/night-shift/INDEX.md` (the run log)
3. ✅ Write `morning-briefing-YYYY-MM-DD.md` even if all checks failed (negative briefing > silence)
4. ✅ Leave the Brain SK working tree in the same state as pre-flight, OR commit ONLY pure brain artifacts (never source code, never config)

## Hard stops

The orchestrator halts immediately and writes `night-shift-halted.md` if:

- Any `git push` is observed in the reflog of any Falcon repo during the run window
- Any `commit` lands in a Falcon source repo (only the brain repo may commit)
- Any file under `apps/`, `libs/`, or `src/` is modified in any Falcon repo
- The brain API budget cap is exceeded
- Disk space < 1 GB on the output drive
- More than 1000 violations emitted (likely runaway / pattern bug)

## Failure modes that DO NOT halt

These are noisy but not unsafe; they get logged and the run continues:

- A single detector handler throws → log and skip that rule, continue with others
- A single repo missing → log and skip, continue with the others
- Brain API call fails → degrade to fewer mindsets (Claude-only fallback)
- A morning-briefing dataview query returns 0 rows → emit empty section, continue

## Where this doctrine is enforced

| Surface | Enforcement |
|---|---|
| `tools/night-shift/night-shift.ps1` | Reads this file on startup; checks every job step against the matrix |
| Each job under `C:\Falcon\Brain\jobs\` | Reads this file at top of the checklist |
| `audit-orchestrator.ps1` | `-NightShiftMode` switch refuses to write outside allowed paths |
| `git push` on Falcon repos | (not enforced by code — relies on no agent invoking push during the run) |
| Briefing renderer | If it sees a `night-shift-halted.md`, the briefing leads with the halt cause |

## Related

- Night-shift orchestrator: `C:\Falcon\Brain SK\tools\night-shift\night-shift.ps1`
- Pre-approved jobs: `C:\Falcon\Brain\jobs\*.md`
- Rulebook: `C:\Falcon\Brain Outputs\understanding\rules\`
- Detector engines: `…/rules/detectors/`
- Output folder: `C:\Falcon\Brain Outputs\reports\night-shift\<run-id>\`
