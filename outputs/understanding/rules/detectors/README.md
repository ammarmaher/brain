*** Falcon Rulebook — Detector engines ***
*** Reads rule frontmatter, scans Falcon codebase, emits violations ***
*** Consumed by night-shift code-audit orchestrator ***

# 🔍 Detector Engines

The detectors that turn the Falcon Rulebook into actual nightly audit signal. Each engine reads rule frontmatter directly from `../<category>/R-*.md` (no duplication — frontmatter IS the config), scans the target Falcon repos, and emits violations in a unified JSONL stream.

## Engines

| Engine | Language | Runs rules of type | Status |
|---|---|---|---|
| [`regex-runner.ps1`](regex-runner.ps1) | PowerShell | `detector.type: regex` | ✅ shipped Session 2 |
| [`structural-walker.ps1`](structural-walker.ps1) | PowerShell | `detector.type: structural` | ✅ shipped Session 2 |
| [`ast-runner-fe.ts`](ast-runner-fe.ts) | TypeScript | `detector.type: ast` (FE rules) | 🟡 scaffolded — 1 working rule |
| [`ast-runner-be.cs`](ast-runner-be.cs) | C# / Roslyn | `detector.type: ast` (BE rules) | 🟡 scaffolded — 1 working rule |
| [`semantic-judge.ps1`](semantic-judge.ps1) | PowerShell + Brain API | `detector.type: semantic-llm` | 🟡 scaffolded — wires to tri-mindset |
| [`audit-orchestrator.ps1`](audit-orchestrator.ps1) | PowerShell | composes all engines | ✅ shipped Session 2 |
| [`test-runner.ps1`](test-runner.ps1) | PowerShell | runs detectors against fixtures | ✅ shipped Session 2 |

## Output contract

Every detector emits violations to a JSONL stream. One JSON object per line, each with the schema below. The orchestrator concatenates streams into the nightly report.

```json
{
  "ruleId": "R-FE-003",
  "ruleName": "No inline styles, ever",
  "ruleCategory": "theme",
  "severity": "must",
  "detectorType": "regex",
  "filePath": "apps/admin-console/src/app/.../foo.html",
  "lineNumber": 42,
  "lineContent": "<div style=\"color: red\">...</div>",
  "matchedPattern": "style=\"[^\"]+\"",
  "exemptByRule": false,
  "exemptByRegistry": false,
  "suggestedFix": "Replace inline style with Tailwind utility class",
  "detectedAt": "2026-05-16T01:30:00.000Z",
  "runId": "2026-05-16-night-shift-001"
}
```

Field meanings:

| Field | Source |
|---|---|
| `ruleId`, `ruleName`, `ruleCategory`, `severity`, `detectorType` | rule frontmatter |
| `filePath` | scanned file (relative to the scanned repo root) |
| `lineNumber`, `lineContent` | detector-specific |
| `matchedPattern` | which `detector.patterns[i]` produced the hit |
| `exemptByRule` | true if `scope.exemptPaths` glob matched |
| `exemptByRegistry` | true if `exemptions/EXEMPTIONS.md` lists this path against this ruleId |
| `suggestedFix` | from `autoFix.patchHint` or rule body Fix recipe |
| `detectedAt` | UTC ISO 8601 |
| `runId` | provided by orchestrator (e.g. night-shift run id) |

## Per-engine flow

```
1. Engine starts.
2. Load rules: read every R-*.md, extract frontmatter, filter by detector.type.
3. For each rule:
     a. Resolve scope.paths against target repos to a file set.
     b. Remove scope.exemptPaths matches.
     c. Cross-check against EXEMPTIONS.md.
     d. Run the detector.
     e. Emit violations to JSONL.
4. Engine ends.
```

## How to invoke

### Single engine

```powershell
# Run all regex detectors against the web-platform-ui repo
.\regex-runner.ps1 `
  -RulesFolder "C:\Falcon\Brain Outputs\understanding\rules" `
  -TargetRepo  "C:\Falcon\falcon-web-platform-ui" `
  -OutputFile  ".\violations.jsonl" `
  -RunId       "smoke-test-001"
```

### Full audit (all engines)

```powershell
.\audit-orchestrator.ps1 `
  -RulesFolder    "C:\Falcon\Brain Outputs\understanding\rules" `
  -TargetRepos    @("C:\Falcon\falcon-web-platform-ui", "C:\Falcon\falcon-core-commerce-svc") `
  -OutputFolder   "C:\Falcon\Brain Outputs\reports\code-audit\2026-05-16" `
  -RunId          "night-shift-001"
```

The orchestrator dispatches each engine in sequence (parallel where safe), merges output, dedupes, and writes:

- `violations.jsonl` — every violation, one JSON per line
- `AUDIT_SUMMARY.md` — top-of-funnel report
- `violations-by-rule.md` — group by rule, count + top offenders
- `violations-by-file.md` — group by file, all rules hit
- `high-severity.md` — only `severity: must` rows
- `engine-runtimes.md` — performance + skip reasons

## Exemption resolution order

For each candidate violation:

1. **`scope.exemptPaths` glob** — declared in the rule frontmatter; cheapest check.
2. **`exemptions/EXEMPTIONS.md`** — registry of per-rule per-path exemptions with owner + expiry.
3. **Inline `// rule-exempt: R-XX-NNN` comment** — last-resort exemption inside the offending file. Logs the exemption to the audit summary with a low-noise FYI.

Order matters: a path matched by step 1 never reaches steps 2/3, keeping the engines fast on monorepo-scale scans.

## Test fixtures + golden inputs

Each fixture is a tiny synthetic file that intentionally violates (or doesn't violate) one specific rule. The test-runner asserts the detector finds exactly the expected hits.

Folder: [`test-fixtures/`](test-fixtures/) — organized as `<ruleId>/{good,bad}/<example>.<ext>`.

Run all fixtures:

```powershell
.\test-runner.ps1 -RulesFolder "C:\Falcon\Brain Outputs\understanding\rules"
```

This runs every detector against its fixtures and reports `PASS` / `FAIL` per rule. If a detector misses a known-bad fixture or false-positives a known-good fixture, the night-shift code audit refuses to run until it's fixed.

## Related

- Canonical rulebook: [`../`](../README.md)
- Exemption registry: [`../exemptions/EXEMPTIONS.md`](../exemptions/EXEMPTIONS.md)
- Vault hub: `_obsidian/35-Architecture/RULES_INDEX.md`
- Night-shift jobs (Session 3): `C:\Falcon\Brain\jobs\code-audit-*.md`
