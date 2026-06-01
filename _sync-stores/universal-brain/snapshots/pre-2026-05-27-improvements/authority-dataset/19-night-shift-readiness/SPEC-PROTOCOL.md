---
type: protocol
cluster: 19-night-shift-readiness
purpose: "Answers 'how do I turn an ambiguous prose request into a locked SPEC.md the AI commits to'. Open BEFORE starting any night-shift task whose spec isn't already complete."
audience: autonomous AI agents (night-shift mode)
---

# SPEC-PROTOCOL — From prose to falsifiable SPEC.md

> [!tldr]
> Night-shift = no human to ask. This protocol turns prose like "build a notifications page" into a `SPEC.md` with falsifiable requirements, ambiguity score, and a proceed-or-halt verdict. The AI commits to the SPEC before writing any code.

## When to invoke

Run this protocol whenever the task:
- Starts with **build / create / implement / make / add**
- Lacks an existing flow playbook (Add Client / Add User / Add Node / Edit Node) or feature compare note
- Has < 200 chars of prose specification
- References "we need" / "let's add" / "do something for" — ambiguous trigger words

**Skip** when the task already has:
- A complete playbook at `Brain Outputs/understanding/pages/<page>/<flow>/`
- An A→Z trace at `18-a-to-z-traces/<feature>.trace.md`
- A `04-feature-parity-matrix/<feature>.compare.md` PLUS the task is a port (Step 1 of the 12-step recipe)

## The 6-step protocol

### Step 1 — Classify the request

Pick exactly ONE class:

| Class | Trigger words | SPEC requirements |
|---|---|---|
| `port` | "copy from admin to mgmt", "migrate", "port" | Source feature must exist; 12-step recipe applies |
| `new-feature` | "build", "create", "implement", "add a page" | Needs PRD reference + role list + DTO shape |
| `ui-polish` | "improve", "polish", "fix the look", "make it look like" | Needs visual target + existing feature reference |
| `bug-fix` | "fix", "broken", "not working" | Needs reproduction + root cause hypothesis |
| `migration` | "move data", "schema change", "rename" | Needs before/after schema + rollback plan |

### Step 2 — Extract falsifiable requirements

Turn each prose claim into a testable assertion. Example:

> Prose: "users can filter notifications by date"

Becomes:
- Filter UI exists at `<falcon-form-field>` with date-picker
- `onChange` fires API call within 300ms (debounced)
- API URL = `GET /notifications?from=<ISO>&to=<ISO>`
- Response shape = `{ items: NotificationItem[], page: int, total: int }`
- Empty state shown when `items.length === 0`
- Error state shown on HTTP 4xx/5xx per FE error contract

Every requirement must be:
- ✅ **Testable** — has a pass/fail criterion
- ✅ **Bounded** — names files, components, endpoints
- ✅ **Grounded** — cites a dataset cell or PRD line

### Step 3 — Identify the authority context

For every action in the requirements:
1. Find the PES key from `03-pes-keys/REGISTRY-RAW.md`
2. Look up which roles pass from `01-roles/<role>.md` + `05-capability-maps/<role>.capability.md`
3. Document the route-guard PES key + per-row gates

If the authority context is **unknown** (no PES key exists for this action), this is a `halt-and-flag` condition (Class A fork — see DECISION-PROTOCOL).

### Step 4 — Identify dataset gaps

Run through the 12-axis question per [[../0-MASTER-INDEX]]:

| Axis | Resolved? |
|---|---|
| Authority | ✅ / 🔴 |
| Feature shape | ✅ / 🔴 |
| Validation rules (V-rules) | ✅ / 🔴 |
| Entity drift | ✅ / 🔴 |
| Business rules | ✅ / 🔴 |
| Non-PES gates | ✅ / 🔴 |
| Port recipe (if class=port) | ✅ / 🔴 |
| Error codes | ✅ / 🔴 |
| Visual target | ✅ / 🔴 |
| Pitfall awareness | ✅ / 🔴 |
| Test cases | ✅ / 🔴 |
| Runtime verification path | ✅ / 🔴 |

Each 🔴 is a gap. Document each gap with its unblock path.

### Step 5 — Compute the ambiguity score (0–10)

Count the number of fields/states/behaviors with multiple plausible interpretations:

| Score | Meaning |
|---|---|
| 0–3 | Clear — proceed |
| 4–6 | Tolerable — proceed with conservative defaults documented |
| 7–10 | High — halt and flag |

**Examples:**
- "Build a contact-groups list view that filters by date" → score 2 (filter UI is the only ambiguity; default to date-range picker)
- "Build a notifications dashboard" → score 8 (no role list · no DTO · no events triggering notifications · no per-channel filtering rules)
- "Port marketplace-applications to mgmt" → score 1 (12-step recipe applies; only UI density needs a default)

### Step 6 — Decide proceed vs halt

| Combination | Verdict |
|---|---|
| Score ≤ 3 AND no security-class forks AND no API-shape unknowns | 🟢 **proceed** |
| Score 4–6 AND all forks have conservative defaults | 🟡 **proceed with defaults documented** |
| Score ≥ 7 OR any security/data-integrity fork lacks a rule | 🔴 **halt-and-flag** |

## The SPEC.md output template

Every spec produced by this protocol follows this shape:

```markdown
---
type: feature-spec
task: <one-line task title>
class: port | new-feature | ui-polish | bug-fix | migration
ambiguity-score: 0-10
verdict: proceed | proceed-with-defaults | halt-and-flag
spec-author: night-shift-ai
created: YYYY-MM-DD
purpose: "<one line answering 'what does this SPEC commit the AI to build'>"
---

# SPEC · <task title>

## TL;DR
<2 sentences: what + why>

## Falsifiable requirements
1. <req 1 — testable>
2. <req 2 — testable>
...

## Authority context
- Route guard PES key: `FalconAccess.<namespace>.<feature>.<action>()`
- Allowed roles: ...
- Denied roles: ...

## Dataset gap analysis
| Axis | Status | Source / Gap detail |
|---|---|---|
| Authority | ✅ | `05-capability-maps/<role>.capability.md` |
| ... | ... | ... |

## Conservative defaults applied
- <fork> → <default> · justification: <dataset reference>

## Open questions (only if halt-and-flag)
- Q1: <question> · plausible answers: <A/B/C> · blast radius: <what's blocked>

## Verification target
- Build green: `nx build <app>` returns 0
- Scanner clean: `scan-authority.ps1 -CheckOnly` returns 0
- Backend PES verify: <3-row matrix for relevant roles>
- (FE runtime: BLOCKED on workspace compile errors per VERIFICATION-STATUS.md)
```

## The "conservative defaults" catalog (12 pre-decided forks)

For common forks where the rule is clear but the spec doesn't say it explicitly:

| # | Fork | Default | Source |
|---|---|---|---|
| 1 | Username cap | PRD wins → enforce 30 on FE | V-username-format-uniqueness-immutable |
| 2 | PasswordSecurityLevel label | Display PRD `Normal/Advanced`; submit backend `Low/Medium/High/Strict` | V-password-security-level-enum |
| 3 | Empty-state UI | Show, don't hide | noor-instructions-skill |
| 4 | Loading state | Skeleton, not spinner | noor-instructions-skill |
| 5 | Error UI on submit | Inline + toast | 13-error-catalog/FE-CONTRACT.md |
| 6 | Locale fallback | en-US if Arabic key missing + log gap | i18n convention |
| 7 | Date format on transport | ISO 8601 | F-023 in DECISION-PROTOCOL |
| 8 | Date format on display | PRD-specified format | F-023 |
| 9 | Boolean field default | `false` (most restrictive) | DECISION conservative principle |
| 10 | Enum field default | First non-`None` value | V-* enum patterns |
| 11 | Pagination size | 20 (Falcon convention) | 04-feature-parity-matrix examples |
| 12 | Status badge color | Match `02-statuses/<entity>-status.md` mapping | Status taxonomy |

## Worked examples

### Example 1 — port comms-hub (score 1, proceed)

```yaml
class: port
ambiguity-score: 1
verdict: proceed
```

12-step recipe applies. Only ambiguity: which Falcon UI Core data table component. Default per dataset: `<falcon-angular-data-table>` (confirmed in comms-hub.compare.md).

### Example 2 — "build a notifications management page" (score 8, halt)

```yaml
class: new-feature
ambiguity-score: 8
verdict: halt-and-flag
```

Open questions:
- Q1: Which roles can use this? (no `acc.notifications` PES key in registry)
- Q2: What DTO shape? (no `Notification` entity in 15 E-* notes)
- Q3: What events trigger notifications? (no PRD reference provided)
- Q4: Push vs poll for new notifications? (no architectural decision)

The AI must NOT proceed without these answered.

### Example 3 — "fix wallet transfer dialog showing wrong currency" (score 4, proceed with defaults)

```yaml
class: bug-fix
ambiguity-score: 4
verdict: proceed-with-defaults
```

Conservative default: currency from Account context per V-charging-transfer-source-destination. Documented as default #14 (not in this catalog — task-specific extension).

## Anti-patterns

❌ Don't invent scope: "user probably also wants X" — that's a halt-and-flag
❌ Don't merge similar requests: "build a notifications page + an activity log" → two specs
❌ Don't infer business rules without PRD support
❌ Don't proceed silently when a security-class fork exists
❌ Don't skip the SPEC.md write — even a 5-line SPEC.md is better than no SPEC

## Where to write the SPEC.md

`Brain Outputs/datasets/authority-dataset/_specs/<task-id>.md` — one per task. Stays even after task completes (becomes the historical record of what was built).

## See also

- [[DECISION-PROTOCOL]] — where forks get resolved
- [[VISUAL-TARGETS/_INDEX]] — where visual unknowns get pinned
- [[NIGHT-SHIFT-LOOP]] — where the SPEC.md is consumed by the verification chain
- [[../0-MASTER-INDEX]] — routing across all knowledge stores
