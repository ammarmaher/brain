---
type: canonical-tag-taxonomy
status: ADOPTED-2026-05-27
authority: user autopilot directive
applies-to: All Obsidian notes across both vaults · home-memory topic files
preservation: additive — existing tags preserved verbatim
companion: FRONTMATTER-SCHEMA-2026-05-27.md
---

# Canonical Tag Taxonomy — 2026-05-27

## Namespace structure

All tags use the `#namespace/value` form. Six canonical namespaces.

| Namespace | Vocab | Example |
|---|---|---|
| `#status/` | `live` · `superseded` · `draft` · `blocked` · `resolved` · `open` · `triangulated` | `#status/live` |
| `#verification/` | `runtime` · `build` · `spot-checked` · `code-verified` · `unverified` | `#verification/runtime` |
| `#module/` | `account-mgmt` · `user-mgmt` · `contract` · `contact-group` · `templates` · `cross-cutting` · `infra` | `#module/account-mgmt` |
| `#layer/` | `fe` · `be` · `gateway` · `infra` · `meta` | `#layer/fe` |
| `#priority/` | `p0` · `p1` · `p2` · `medium` | `#priority/p0` |
| `#blocked-on/` | free-form slug | `#blocked-on/drive-reexport`, `#blocked-on/stencil-compile`, `#blocked-on/business-decision` |
| `#type/` | `moc` · `validation-rule` · `entity` · `pending-question` · `topic-memory` · `business-rule` · `flow-playbook` · `runbook` | `#type/moc` |

## Mapping rules (how Wave 6 backfill already derived tags)

| From frontmatter field | To tag |
|---|---|
| `status: live` | `#status/live` |
| `status: superseded` | `#status/superseded` |
| `status: triangulated` | `#status/triangulated` + `#verification/spot-checked` |
| `status: RESOLVED` (Q-*) | `#status/resolved` |
| `status: OPEN` (Q-*) | `#status/open` |
| `verification: runtime` | `#verification/runtime` |
| `verification: build` | `#verification/build` |
| `verification: code-verified` | `#verification/code-verified` |
| `verification: unverified` | `#verification/unverified` |
| `module: account-mgmt` | `#module/account-mgmt` |
| `module: user-mgmt` | `#module/user-mgmt` |
| `layer: be` (E-* entities) | `#layer/be` |
| `priority: p0` | `#priority/p0` |
| `blocked-on: ["drive-reexport"]` | `#blocked-on/drive-reexport` |
| `type: validation-rule` | `#type/validation-rule` (optional — covered by file location) |
| `type: moc` | `#type/moc` |

## Useful cross-cutting queries (Tag Wrangler + Obsidian search)

| Question | Search syntax |
|---|---|
| All blocked P0 items | `tag:#priority/p0 tag:#status/blocked` |
| All live runtime-verified V-rules | `tag:#status/live tag:#verification/runtime path:30-Validation` |
| All items blocked on Drive re-export | `tag:#blocked-on/drive-reexport` |
| All superseded V-rules in account mgmt | `tag:#status/superseded tag:#module/account-mgmt path:30-Validation` |
| All entities with drift > 5 | use Bases registry instead (`E-entities.base`) |
| All open Q-* tickets in user mgmt | `tag:#status/open tag:#module/user-mgmt path:_pending-questions` |
| All MOCs | `tag:#type/moc` |

## Tag Wrangler operations the user should run

Tag Wrangler is installed in both vaults. From the Tags pane, right-click a tag → Rename → updates all references.

Suggested cleanups (run in Tag Wrangler after first observation):
1. Find any tag NOT in the canonical 7 namespaces → either rename to a canonical equivalent or delete (Tag Wrangler "Remove from all notes").
2. Find ambiguous tags like `#bug` or `#wip` → migrate to `#status/draft` or `#status/blocked`.
3. Tag stats are visible at Tag pane → sort by count → catch typos like `#status/live` vs `#staus/live`.

## Why these 7 namespaces (and not more)

| Considered | Rejected reason |
|---|---|
| `#prd/` | Already in frontmatter `prd:` — tag duplication |
| `#severity/` | Already in frontmatter `severity:` |
| `#wave/` | Per-wave (D/F/G/11/12) lives in topic files + V-rule changelogs |
| `#team/` | Single-team project — no value |
| `#year/` | Date is in `created:`/`last-verified:` |

7 namespaces is the maximum a human can keep in working memory. Adding more makes the system noisier without sharper queries.

## Adoption

Per user autopilot directive of 2026-05-27. Wave 6 backfill applied these tags. Wave 11 (next) extends to MOCs + the Brain Architecture chart.

## Maintenance contract

When adding a new tag namespace:
1. Update this document.
2. Update `FRONTMATTER-SCHEMA-2026-05-27.md` mapping rules.
3. Update relevant MOC dataview queries if they filter by tag.
4. Use Tag Wrangler to rename existing tags toward the canonical set.
5. Never introduce a tag that duplicates a frontmatter key — frontmatter wins.
