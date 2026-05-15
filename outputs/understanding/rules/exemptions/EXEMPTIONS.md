---
type: exemption-registry
created: 2026-05-16
---

*** Falcon Rulebook — Exemption registry ***
*** Per-rule, per-file or per-folder justified exemptions ***

# Exemptions

> When a file legitimately needs to break a rule (legacy code, third-party adapter, intentional library primitive), record the exemption here. Detectors read this file and suppress matching findings.

## How to add an exemption

Append a row to the table for the relevant rule. Every exemption must have:

- **ruleId** — the rule being exempted
- **path** — glob or exact path
- **reason** — 1 sentence justification
- **owner** — who approved the exemption
- **expires** — `never` or a date when this should be re-reviewed

## Active exemptions

### R-FE-005 — Falcon library FIRST

| Path | Reason | Owner | Expires |
|---|---|---|---|
| `libs/falcon-ui-core/**` | Library MUST contain raw HTML primitives — it IS the wrapper layer | Ammar Mk | never |
| `demos/**` | Cross-framework demos intentionally use raw markup to show portability | Ammar Mk | never |

### R-FE-002 — No SCSS, no component CSS

| Path | Reason | Owner | Expires |
|---|---|---|---|
| `libs/falcon-ui-core/**/*.tokens.css` | Stencil component tokens require the `.tokens.css` companion (SSOT) | Ammar Mk | never |

### R-FE-004 — Tokens only (no hardcoded values)

| Path | Reason | Owner | Expires |
|---|---|---|---|
| `libs/falcon-ui-tokens/**` | The token registry IS the hex source — exempt by definition | Ammar Mk | never |
| `**/tailwind.css` | Tailwind v4 `@theme` block declares tokens; hex required here | Ammar Mk | never |

### R-BE-007 — No hardcoded secrets

| Path | Reason | Owner | Expires |
|---|---|---|---|
| `**/*.example.json` | Templates / examples ship with placeholder values, not real secrets | Ammar Mk | never |
| `**/*.template.json` | Same as above | Ammar Mk | never |

## Retired / expired exemptions

(none yet — recorded here when an exemption is removed)
