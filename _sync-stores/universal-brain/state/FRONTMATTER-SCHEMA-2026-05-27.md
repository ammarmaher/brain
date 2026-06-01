---
type: canonical-frontmatter-schema
status: ADOPTED-2026-05-27
authority: user autopilot directive — Claude picks recommended defaults
applies-to: V-rules · E-* entities · Q-* tickets · topic memory files · MOC files
preservation: additive only — existing keys preserved, new keys appended
---

# Canonical Frontmatter Schema — 2026-05-27

## Discovered existing schemas (preserved verbatim)

### V-rule (e.g. `V-account-ip-allowlist-enforcement.md`)
```yaml
type: validation-rule          # KEEP
id: V-account-ip-allowlist-enforcement  # KEEP
prd: PRD-01                    # KEEP
service: <maybe empty>         # KEEP
severity: medium               # KEEP
status: triangulated           # KEEP (existing value vocab)
drift: false                   # KEEP
created: 2026-05-15            # KEEP
```

### E-* entity (e.g. `E-account.md`)
```yaml
type: entity-reconciliation    # KEEP
entity: account                # KEEP
prd: PRD-01                    # KEEP
service: commerce              # KEEP
drift-count: 16                # KEEP
created: 2026-05-15            # KEEP
```

### Q-* ticket (e.g. `Q-UM-07-RESOLVED-2026-05-19.md`)
```yaml
type: pending-question-resolution   # KEEP (or pending-question if open)
question-id: Q-UM-07           # KEEP
status: RESOLVED               # KEEP
resolved: 2026-05-19           # KEEP
related: Vol 43 Part A · BRD refresh  # KEEP
```

## Additive schema (NEW keys to be appended)

### Common keys (all 4 file types)

| Key | Vocab / format | How it's derived |
|---|---|---|
| `module` | `account-mgmt`, `user-mgmt`, `contract`, `contact-group`, `templates`, `cross-cutting`, `infra` | Map from `prd:` (PRD-01 → account-mgmt; PRD-02 → user-mgmt; PRD-03 → contract; PRD-04 → contact-group; PRD-05 → templates). If no PRD, infer from filename or set `cross-cutting`. |
| `feature` | snake-case (e.g. `add-client`, `add-user`, `info-panel`, `service-pricing`) | Inferred from filename or content; `unknown` if undeterminable |
| `verification` | `runtime` · `build` · `spot-checked` · `code-verified` · `unverified` | For V-rules: map from existing `status:` (triangulated→spot-checked; runtime-confirmed→runtime). For E-*: default `code-verified` (read from code). For Q-*: `unverified` |
| `last-verified` | ISO date YYYY-MM-DD | Use `created:` if no fresher signal; else most recent date in body |
| `tags` | array of `#namespace/value` strings | Derived from other fields: `#status/<v>`, `#module/<v>`, `#verification/<v>`, `#layer/<v>` |
| `up` | `[[<MOC-name>]]` (Breadcrumbs hierarchy) | V-rule → `[[V-rules-MOC]]`; E-* → `[[E-entities-MOC]]`; Q-* → `[[Q-tickets-MOC]]`; topic → `[[Topic-memory-MOC]]` |
| `parent` | same as `up` | Breadcrumbs parent — kept identical to `up` unless explicit override |

### V-rule specific additions

| Key | Vocab | Notes |
|---|---|---|
| `supersedes` | array of V-rule ids | Empty array if none. Existing field — preserve if present. |
| `superseded-by` | array of V-rule ids | Empty array if none. Existing field — preserve if present. |
| `evidence-link` | filename or path | Link to home-memory topic file or runtime-verification report |

### E-* entity specific additions

| Key | Vocab | Notes |
|---|---|---|
| `layer` | always `be` (entities are backend) | Add `#layer/be` tag |

### Q-* ticket specific additions

| Key | Vocab | Notes |
|---|---|---|
| `tracked-as-task` | `true`/`false` — default `true` for open Q-* | Lets Obsidian Tasks plugin find it |
| `priority` | `p0` · `p1` · `p2` · `medium` (default) | Infer from `severity:` or content |
| `due` | ISO date or empty | Only set if specified in body |
| `blocked-on` | array of strings | Inferred from body (e.g. `drive-reexport`, `stencil-compile`) |

### Topic memory file specific additions

| Key | Vocab | Notes |
|---|---|---|
| `type` | `topic-memory` (new — these files often have no frontmatter) | Adds frontmatter where missing |
| `date` | ISO date | Extracted from filename suffix `_YYYY_MM_DD.md` |

## Status vocabulary translation

When existing `status:` value needs mapping to canonical:

| Existing value | Canonical equivalent | Add tag |
|---|---|---|
| `triangulated` | (keep — Brain SK convention) | `#status/triangulated` + `#verification/spot-checked` |
| `live` | (keep) | `#status/live` |
| `superseded` | (keep) | `#status/superseded` |
| `draft` | (keep) | `#status/draft` |
| `RESOLVED` (Q-*) | (keep — uppercase = closed) | `#status/resolved` |
| `OPEN` | (keep) | `#status/open` |

## Application rules

1. **Read first** — every Edit call reads existing frontmatter, parses YAML, merges additively.
2. **Never remove** an existing key.
3. **Never silently change** an existing value — if `verification:` already exists with a different vocab, keep the original and add a new tag in `tags:`.
4. **Unknown values** → use `TBD-needs-classification`, never guess.
5. **Whole-file integrity** — if frontmatter parse fails (malformed YAML), SKIP the file and log; do not touch it.
6. **Backfill batch size** — process in batches of 10 files, log each, snapshot before each batch.

## Backfill targets (Wave 6 will process these)

| Source dir | File pattern | Estimated count |
|---|---|---|
| `C:\Falcon\Brain SK\_obsidian\30-Validation\` | `V-*.md` (skip README) | ~26 |
| `C:\Falcon\Brain SK\_obsidian\40-API\` | `E-*.md` (skip README) | ~15 |
| `C:\Falcon\Brain Outputs\datasets\authority-dataset\_pending-questions\` | `*.md` | ~19 |
| `C:\Falcon\falcon-wiki\65-Validation-Rules\` | `*.md` | ~1 |
| `C:\Falcon\falcon-wiki\66-PES-Rules\` | `*.md` | ~1 |
| `C:\Falcon\falcon-wiki\67-Business-Rules\` | `*.md` | ~1 |
| `C:\Falcon\falcon-wiki\100-Authority\` | `*.md` (sample only — not full mirror) | ~32 |
| **Total expected touch** | | **~95 files** |

Topic memory files (262) are EXCLUDED from this batch — they'd be backfilled on-demand as referenced. Mass-backfilling 262 files is overkill.

## Rollback

```powershell
# Restore from Phase 0 snapshot
$SNAP = 'C:\Falcon\universal-brain\snapshots\pre-2026-05-27-improvements'
robocopy "$SNAP\brain-sk-targeted\30-Validation" 'C:\Falcon\Brain SK\_obsidian\30-Validation' /MIR /XJ /R:1 /W:1
robocopy "$SNAP\brain-sk-targeted\40-API" 'C:\Falcon\Brain SK\_obsidian\40-API' /MIR /XJ /R:1 /W:1
robocopy "$SNAP\authority-dataset\_pending-questions" 'C:\Falcon\Brain Outputs\datasets\authority-dataset\_pending-questions' /MIR /XJ /R:1 /W:1
```

## Adopted

Per user autopilot directive of 2026-05-27 — *"You will answer each question to help our brain grow up. Always take the recommended."*

Proceeding to Wave 6 (backfill) immediately.
