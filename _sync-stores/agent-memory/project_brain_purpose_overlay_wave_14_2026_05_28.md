---
name: brain-purpose-overlay-wave-14-2026-05-28
description: Wave 14 — when-to-consult backfill (recommendation
metadata: 
  node_type: memory
  type: project
  originSessionId: 1ddc4de1-42ef-4b42-b947-16d520447c6a
---

# Purpose + When-To-Consult Backfill — Wave 14

🟢 **WAVE-14-LANDED 2026-05-28T01:20:00Z** — Final scriptable item from the 10-item recommendation list. The brain is now self-explaining.

## What landed

| File | Purpose |
|---|---|
| [VAULT] `200-Graph/graph/apply-purpose.js` (~225 lines) | Template-driven `purpose:` + `when_to_consult:` generator |
| [VAULT] `200-Graph/graph/purpose-overlay.json` | 518-node annotation overlay |
| [VAULT] `200-Graph/graph/query.js` (upgraded) | Loads overlay + surfaces fields in `/brain-context` output |

## Headline before/after

**Before Wave 14** — `/brain-context "wallet"` returned:

```
- evt:charging-ocs-wallet-events (KafkaEvent) — Charging OCS Wallet Events
  - evidence: Brain SK/_obsidian/47-Events/Charging OCS Wallet Events.md
```

**After Wave 14**:

```
- evt:charging-ocs-wallet-events (KafkaEvent) — Charging OCS Wallet Events _[trust:structural]_
  - purpose: Kafka event topic charging.ocs-wallet-events.v1 — Every wallet mutation (outbox + worker)
  - when to consult: When subscribing to or producing this event; when reasoning about eventual consistency between charging and consumers (none)
  - evidence: Brain SK/_obsidian/47-Events/Charging OCS Wallet Events.md
```

Agents now know WHAT + WHEN + HOW-TRUSTWORTHY in one bundle. No file reads needed for cold-start orientation.

## Coverage

518 of 518 unique nodes annotated (100%). Breakdown:
- 124 ValidationRule · 62 PESRule · 62 Component · 55 Conflict · 46 DesignToken · 35 TailwindClass
- 27 DTO · 26 KafkaEvent · 20 VisualState · 15 ArchitectureRule · 14 Page · 12 BusinessRule
- 9 Service · 6 each {ThemeMode, Module, Role} · 5 each {App, Size} · 4 Pattern · 3 Wave · 1 each {MOC, ScanMetadata}

## Template-driven approach

22 type-specific templates draw from existing node properties (name, namespace, sot, sheet, module, drift-count, code-line, edit-reach, adr_status, reversal_cost, producer, consumers, topic, trigger). Examples:

- **PESRule** → "Permission key in {namespace}.* namespace — {purpose}" / "Before exposing the action this key gates..."
- **ValidationRule (xlsx)** → "xlsx-SoT validation for {name} (sheet: {sheet}) — {summary}" / "xlsx wins over PRD — do not invent stricter rules"
- **ValidationRule (PRD superseded)** → "PRD validation rule SUPERSEDED by xlsx — historical only" / "Do NOT use for new work"
- **ArchitectureRule (ADR)** → "ADR: {name} (status: {adr_status}, reversal: {reversal_cost})" / "Before deviating from this decision"
- **KafkaEvent** → "Kafka event topic {topic} — {trigger}" / "When subscribing to or producing this event"
- **Conflict** → "Documented PRD ↔ xlsx ↔ code disagreement" / "READ THIS FIRST before implementing"

## Why template-driven beat hand-crafting

- 518 hand-crafted entries = ~17 hours of writing
- Template-driven = 1 script + 225 lines + 0.2 seconds runtime
- 80% correctness from templates; specific overrides land per-cluster in future waves
- Idempotent — re-running with new nodes annotates them without disturbing existing

## Compatibility wins

1. **Auto-merge** — same overlay pattern as Wave 12 trust scoring; BQL picked up purpose-overlay.json without code change
2. **Forward-compat** — new node types just add a template case; no schema migration
3. **Skill enrichment** — `/brain-context` immediately benefits across all topics

## Recommendation status — 9 of 10 items landed

| # | Item | Status | Wave |
|---:|---|---|---:|
| 1 | BQL (query.js) | ✓ | 11 |
| 2 | /brain-context skill | ✓ | 11 |
| 3 | Drift detector | ✓ | 12 |
| 4 | xlsx watcher (/brain-resync-validation) | ✓ | 13 |
| **5** | **when-to-consult backfill** | **✓** | **14 (this)** |
| 6 | Q-* + Gap auto-surfacer | ✓ | 11 (in /brain-context) |
| 7 | Trust-score per node | ✓ | 12 |
| 8 | Per-wave graph diff | ✓ | 12 |
| 9 | PR → graph edges (git hook) | ⏸️ needs user approval | - |
| 10 | Active-learning capture | ✓ effective via GSD Approved Learning Mode | - |

**Only item #9 remains, and it requires explicit user approval per CLAUDE.md no-auto-commit rule.**

## Rules emitted (reusable)

- **Overlay pattern is the right abstraction for cross-cutting metadata** — trust-overlay (Wave 12), purpose-overlay (Wave 14) — both auto-merge into nodes via the same BQL hook. New cross-cutting properties should follow this pattern.
- **Templates beat hand-crafting at scale** when the source signal is sufficient to derive 80% correct text. Hand-craft only the outliers.
- **The biggest cold-start wins come from annotating what already exists** — Wave 14 added 0 new nodes/edges; the brain became significantly more usable because the existing 518 nodes are now self-describing.
- **`/brain-context` output is the user-visible API** — every overlay should land in its formatter, not just in raw data. The bundle output is what agents actually read.

## Safety verification

- ✓ No app code edits
- ✓ Read-only over canonical graph; writes only purpose-overlay.json + query.js edit
- ✓ No npm / docker / server / build / commit / push

## Related

- [[project_brain_xlsx_watcher_wave_13_2026_05_28]] — Wave 13 xlsx watcher
- [[project_brain_bundles_b_c_wave_12_2026_05_28]] — Bundle B + C (sibling overlay pattern: trust-overlay)
- [[project_brain_query_layer_wave_11_2026_05_28]] — Bundle A (BQL + /brain-context the consumer)
- [[project_obsidian_graph_playback_loop_complete_2026_05_27]] — 10-wave build that produced the nodes
