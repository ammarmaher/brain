# Volume 52 — Falcon Brain Self-Knowledge Map

> **Specialist depth:** How the Falcon Brain is organized for retrieval. Where to start for any question type. How specialist hubs, atomic notes, Atlas volumes, and memory entries interact. The discipline that keeps the brain coherent over time.
>
> **Audience:** Future-session AI agents AND human contributors (Ammar, Ammar's team) who need to navigate the brain efficiently.

---

## §1 — The Retrieval Problem

The Falcon Brain spans 7 stores totaling thousands of documents:

| Store | Location | Role |
|---|---|---|
| Authority Dataset | `Brain Outputs/datasets/authority-dataset/` | Canonical extracted truth from code + PRD |
| Brain Outputs/Understanding | `Brain Outputs/understanding/` | Per-component, per-page, per-flow specifications |
| Brain Skills | `Brain SK/` (this vault + sibling) | Operating skills + per-task playbooks |
| Falcon Wiki | `falcon-wiki/` | Architecture Wiki (Azure DevOps mirror) |
| Brain SK Obsidian | `Brain SK/_obsidian/` | Graph navigation layer |
| PRD Modules | `PRD/` + `Brain Outputs/prd/` | Customer-supplied product specs (BRDs + extracts) |
| Old-UI Dataset | `Brain Outputs/old-ui/` | Legacy reference for parity work |

A naive search across all 7 stores for "wallet" returns hundreds of matches. The brain's value is NOT raw search; it's **structured routing**.

---

## §2 — The 3-Hop Principle

Every answer in the brain should be reachable in **≤ 3 hops** from a known entry point:

- **Hop 1:** Pick the right entry (Specialist Hub, Atlas Master Index, or AMMAR_BRAIN_HOME).
- **Hop 2:** Drill into a volume/atomic note that covers the question type.
- **Hop 3:** Find the specific section/file:line.

If a question takes >3 hops, EITHER:
- The brain needs a new specialist hub (add it).
- The atomic note is missing (write one).
- The Atlas Master Index needs a new use-case-router row.

Examples:

| Question | Hops |
|---|---|
| "Can NU transfer balance?" | 1: WALLET-SPECIALIST-HUB → 2: VOL-44-TRUTH-TAUTOLOGIES §W-TT-01 → done |
| "Where is BR-CC-31 implemented in code?" | 1: WALLET-SPECIALIST-HUB → 2: Vol 45 §V45-CODE-VERIFICATION-ADDENDUM → 3: file:line citation |
| "Does Falcon do Facebook Messenger?" | 1: CAMPAIGNS-CHANNELS-SPECIALIST-HUB → 2: §0 5-word truth → done |
| "What's the user-limit accounting rule?" | 1: USER-LIFECYCLE-SPECIALIST-HUB → 2: Vol 47 §V47 addendum §8 → done (with Q-UM-19 flag) |

---

## §3 — Routing Map (Question Type → Starting Point)

### §3.1 By topic

| Topic | Entry point | Drill path |
|---|---|---|
| Wallet / Balance / Multi-Contract | `WALLET-SPECIALIST-HUB` | → Vol 45 sections → code citations |
| WhatsApp / Voice / SMS / Email | `CAMPAIGNS-CHANNELS-SPECIALIST-HUB` | → Vol 46 sections → Vol 49 templates |
| User Status / OTP / Login | `USER-LIFECYCLE-SPECIALIST-HUB` | → Vol 47 sections → code citations |
| Contact Group | Vol 48 (no dedicated hub yet — see §10 below) | → Vol 44 §5 tautologies |
| Template Lifecycle | Vol 41 + Vol 49 | → Vol 44 §4 tautologies |
| Permissions / PES | `66-PES-Rules/` + Vol 50 (when complete) | → Vol 44 §X tautologies |
| Saga / Kafka / Cross-BC | Vol 51 (no dedicated hub yet) | → Wave 11/14/18+ code mining |
| Architecture / Service Topology | `falcon-wiki/Home/Software-Architecture-Design/` | → Vol 51 §1 |
| Anything BRD-extracted | Vol 44 (truth tautologies) | → atomic notes in 67-Business-Rules |

### §3.2 By question phrasing

| User says | Route to |
|---|---|
| "Can [role] do [action]?" | Wallet/Campaigns/User-Lifecycle hubs |
| "How does [feature] work?" | Specialist Hub → Vol 4X sections |
| "Where is [concept] in code?" | Specialist Hub → §V4X-CODE-VERIFICATION-ADDENDUM |
| "What's the BRD say?" | Vol 44 truth tautologies + `[BRD-EXTRACTED]` source |
| "Is [thing] implemented?" | Vol 46 (channels) or Vol 32 (campaigns honest map) |
| "Why was this decided?" | Vol 33 (Conclusion Knowledge) or per-module Vol 34-40 |
| "What's still open?" | Atlas Index `_pending-questions/` |

### §3.3 By role

| Role asking | Recommended start |
|---|---|
| Backend developer (new to Falcon) | AMMAR_BRAIN_HOME → ATLAS_MASTER_INDEX → Vol 33 Conclusion Knowledge |
| Frontend developer | Frontend Understanding Index + page-learning folders |
| Product manager | Vol 33 + Vol 34-40 (per-module) |
| New hire onboarding | AMMAR_BRAIN_HOME + Vol 33 + Vol 39 |
| Architect | Vol 51 (Saga Map) + falcon-wiki architecture docs |
| QA engineer | Page-Learning folders + Vol 44 truth tautologies for validation |

---

## §4 — Specialist Hubs as Primary Entry Points

### §4.1 Current hubs (3 live + more planned)

| Hub | Coverage | Established |
|---|---|---|
| [[WALLET-SPECIALIST-HUB]] | Wallet/Balance/Multi-Contract | 2026-05-18 |
| [[CAMPAIGNS-CHANNELS-SPECIALIST-HUB]] | WA/Voice/SMS/Email + FB/IG NOT-impl | 2026-05-18 |
| [[USER-LIFECYCLE-SPECIALIST-HUB]] | User Status/OTP/Soft-delete | 2026-05-18 |

### §4.2 Hubs to add (Wave 17-20 plan)

| Hub | Coverage | When |
|---|---|---|
| `CONTACT-GROUP-SPECIALIST-HUB` | CG creation/edit/share/opt-in | Wave 18 |
| `TEMPLATE-LIFECYCLE-SPECIALIST-HUB` | 6 states + maker/checker + Meta | Wave 19 |
| `PES-CATALOG-SPECIALIST-HUB` | 47 keys × 6 roles grid | Wave 17 (after agent) |
| `SAGA-CROSS-BC-SPECIALIST-HUB` | Outbox/inbox + Kafka topology | Wave 19 |
| `ORDER-STATUS-PAYMENT-SPECIALIST-HUB` | SimplePollService + do-payment dialogs | Wave 21 |

### §4.3 Hub anatomy (canonical structure)

Each hub has:
1. **Quick triage table** (8-10 row "if you're asking X, start here") — the 1-hop router.
2. **Mental model one-paragraph** — instant comprehension.
3. **Sources of truth (priority order)** — disambiguation.
4. **Code citations table** — file:line for every claim.
5. **Truth tautologies (clickable)** — atomic facts.
6. **Edge cases or live bugs** — currently-known gotchas.
7. **Open questions** — what's still ambiguous.
8. **See also** — cross-hub navigation.

### §4.4 Why hubs over flat indexes

A flat index (1 row per volume) requires the reader to **know the volume**. A hub routes by **question type** — the reader doesn't need to know Vol 45 exists; they just need to know "I'm asking about wallets."

---

## §5 — Atomic Notes as Leaf Knowledge

### §5.1 Current atomic notes (in `67-Business-Rules/`)

- [[VOL-44-TRUTH-TAUTOLOGIES]] — all 35+ truth tautologies across 8 families
- [[MULTI-CONTRACT-CROSS-PRICING-DEEP-DIVE]] — BR-CC-31 with code citation + worked example

### §5.2 Atomic note pattern

Each atomic note:
1. **One concept per note** (atomic = irreducible).
2. **Frontmatter** with source, type, tags.
3. **Direct quotation / restatement** of the truth (no commentary).
4. **Code citation** if applicable (`[CODE] file:line`).
5. **See also** — back-links to relevant volumes + hubs.

### §5.3 What NOT to put in atomic notes

- Commentary, opinions, "should we…" discussions → those go in Volumes or Issues.
- Code itself → code lives in the repo; atomic notes cite it.
- Multi-concept content → split into multiple atoms.

### §5.4 Atomic notes to add (future waves)

- `WALLET-SHORTFALL-ABORT-INVARIANT` (W-TT-06 deep dive)
- `FALCON-USER-EXCLUSIVE-MW-COMMCHNL-TRANSFER` (W-TT-04 deep dive)
- `TEMPLATE-REJECTED-INTERNAL-EDIT-LOOP` (TM-TT-05 deep dive)
- `CG-FALCON-CANNOT-MUTATE-INVARIANT` (CG-TT-01 deep dive)
- One per truth tautology where it's load-bearing for code review.

---

## §6 — The Atlas Master Index as Fallback Router

If a Specialist Hub doesn't cover the question, fall back to ATLAS_MASTER_INDEX:
- 52 volumes catalog.
- Use-case quick router (15+ row "question type → volume" table).
- Companion artifacts (BUSINESS-DECISION-MATRIX, ARCH-QUICK-REFERENCE, SECURITY-FINDINGS).

The Atlas Master Index is the "everything's listed somewhere" fallback. Should ALWAYS resolve in 1 hop from there.

---

## §7 — When to Use Code vs PRD vs Brain

A skill the brain doesn't have built-in but should: **knowing when to look where.**

### §7.1 Code wins when

- The question is "how does this work right now?" → `[CODE]` is the SoT.
- The question is "does this method/class exist?" → grep the code.
- The question is "what's the current behavior?" → code.

### §7.2 PRD wins when

- The question is "what SHOULD this do?" → `[PRD]` / `[BRD-EXTRACTED]` is the SoT.
- The question is "what did the customer originally ask for?" → BRDs.
- The question is "what's the business rule's why?" → PRD rationale section.

### §7.3 Brain (Vol XX) wins when

- The question is "what's the operating model?" → specialist volume.
- The question is "what's the edge case I'm missing?" → §10/§11 of volume.
- The question is "how does this relate to that?" → cross-references.

### §7.4 When they disagree

If `[CODE]` ≠ `[PRD]`:
- **Flag as drift** (see Vol 47 BUG §1 example).
- **Spawn a fix task** (via task chips).
- **Update the volume with the drift discovered**.

If `[BRAIN]` ≠ `[CODE]` ≠ `[PRD]`:
- The brain is stale. Spawn an update wave.
- The drift between code and PRD remains a real problem.

---

## §8 — The Source-Prefix Discipline

> Every fact in a brain answer must carry a source prefix.

| Prefix | Means |
|---|---|
| `[CODE] file:line` | Verbatim or computed from real code |
| `[BRAIN-OUT] path` | From Brain Outputs (atlas, reports, registries) |
| `[VAULT] path` | From a typed Obsidian note |
| `[BRAIN-SK] path` | From Brain SK skill files |
| `[MEMORY] entry` | From shared agent memory |
| `[INFERRED]` | From my own reasoning — MUST be flagged |
| `[BRD-EXTRACTED] file` | From the operator's BRD bundle |
| `[REFERENCE-ONLY] source` | External reference (e.g., Meta docs, ITU-T) |

### §8.1 Why source-prefix matters

- **Trust calibration.** Reader can trust `[CODE]` more than `[INFERRED]`.
- **Drift detection.** When code changes, `[CODE]` facts get invalidated; `[BRAIN-OUT]` may stay stale.
- **Halt-and-flag enforcement.** Unprefixed claims are convention violations.

### §8.2 Failure mode

A future session that doesn't source-prefix risks producing speculative content. The discipline prevents it.

---

## §9 — The Halt-and-Flag Protocol

When ambiguity score >= 7 (subjective) OR any security/data-integrity fork lacks a rule, **HALT and flag**, don't speculate.

Recent examples:
- Q-CC-14 (contract expiry boundary race) — flagged, not invented.
- Q-CC-17 (ledger append-only enforcement) — flagged.
- Q-SAGA-09 (event schema registry — Avro vs JSON Schema) — flagged.

A volume that contains explicit "[INFERRED]" sections is good; a volume that invents answers without flagging is bad.

---

## §10 — Suggested Improvements (Tier 2 Obsidian)

### §10.1 Daily-notes pattern

Add `_obsidian/_daily/YYYY-MM-DD.md` with the day's session deliverables. Enables time-based retrieval ("what did we ship 3 nights ago?").

### §10.2 Templater scaffolds

Pre-built templates for:
- Specialist Hub (matches §4.3 anatomy).
- Atomic Note (matches §5.2 pattern).
- Atlas Volume Graph Node (matches 10-Pages convention).
- Code-Mining Report (matches WAVE-XX format).

### §10.3 Tag taxonomy

Standardize on:
- `#type/{hub|atomic|volume|memo|playbook}`
- `#specialist/{wallet|campaigns|user-lifecycle|contact-group|template|pes|saga}`
- `#status/{canonical|partial|stub|deprecated|superseded}`
- `#source/{code|brd|prd|inferred|memory}`
- `#wave/{NN}` (which mining wave produced it)
- `#question/Q-{module}-{n}` (open questions get tagged)

### §10.4 Dataview queries

Add at top of each hub:
```dataview
TABLE status, source, last-updated
FROM #specialist/wallet
SORT last-updated DESC
```

Enables auto-rolling "what's new in this hub" without manual updates.

### §10.5 Backlinks audit

Periodically (weekly?) run a backlinks-orphan check:
- Notes with 0 inbound links → orphan → either link or archive.
- Hubs not linked from AMMAR_BRAIN_HOME → unrouted → add.

---

## §11 — Coherence Rules (the meta-discipline)

### §11.1 Naming

- Volumes: `BUSINESS-SCENARIOS-ATLAS-VOL-NN-SLUG.md`.
- Hubs: `THING-SPECIALIST-HUB.md` in `00-Home/`.
- Atomic notes: `THING-DEEP-DIVE.md` or `Q-XX-TOPIC.md` in `67-Business-Rules/`.
- Memory: `project_topic_YYYY_MM_DD.md` or `feedback_topic.md`.

### §11.2 Versioning

When a volume supersedes another:
1. New volume gets `Replaces:` frontmatter.
2. Old volume gets `⚠ SUPERSEDED by Vol NN` banner.
3. Atlas Master Index updated.
4. Memory entries updated.

### §11.3 Truth tautology naming

`{family}-TT-{NN}` where family = W (Wallet), MC (Multi-Contract), US (User-Status), TM (Template), CG (Contact-Group), CC (CommChannel), MP (Marketplace), DI (Destination-ID), and others as discovered.

### §11.4 Question naming

`Q-{prefix}-{NN}` where prefix maps to module/area:
- AM (Account Management)
- UM (User Management)
- CC (Contract & Cost)
- CGM (Contact Group)
- TM (Templates)
- BSA (Basic Send App)
- CHN (Channels)
- DI (Destination ID)
- SAGA (Cross-BC Saga)
- AUD (Audit)
- CG (Contact Group specific to Vol 48)

---

## §12 — Knowledge Lifecycle

### §12.1 Birth — a new fact is discovered

1. Identify the family (truth tautology vs project memory vs open question).
2. Pick the right home (atomic note vs volume section vs Q-* registry).
3. Apply source-prefix discipline.
4. Cross-link to related concepts.
5. Update relevant indexes (hub, Atlas Master, memory).

### §12.2 Growth — fact gets refined

1. Each subsequent session adds depth (worked examples, edge cases, code citations).
2. The fact's note grows but stays atomic (one concept).
3. New related facts → new atomic notes; old note links to them.

### §12.3 Confirmation — fact gets code-verified

1. Code-mining agent finds the implementation.
2. `[INFERRED]` markers in the volume get replaced with `[CODE] file:line`.
3. A `§VOL-XX-CODE-VERIFICATION-ADDENDUM` documents the verification + any drifts.
4. Memory entry updated.

### §12.4 Death — fact becomes stale

1. Code changes invalidate a `[CODE]` claim.
2. Volume gets a `⚠ Outdated as of YYYY-MM-DD` banner OR addendum revising.
3. Eventually, a new volume supersedes it.

### §12.5 Resurrection (rare) — old fact becomes true again

E.g., a feature is removed then re-added. The atomic note is **never deleted** (audit), only superseded; if it becomes true again, a new note links forward.

---

## §13 — The Brain's Operating Loop

For any new session:

```
1. Read AMMAR_BRAIN_HOME
2. Identify question type → route to Specialist Hub
3. Drill via hub → volume → section → file:line
4. Apply source-prefix discipline in answer
5. If gap found: register Q-X-NN, spawn task chip if actionable
6. If new truth found: write atomic note + cross-link
7. If new pattern found: consider new specialist hub
8. Update memory with one-line summary
9. End session
```

---

## §14 — Cross-References

- AMMAR_BRAIN_HOME — top-of-stack
- ATLAS_MASTER_INDEX — full 52-volume catalog
- VOL-44-TRUTH-TAUTOLOGIES — atomic facts
- WALLET-SPECIALIST-HUB · CAMPAIGNS-CHANNELS-SPECIALIST-HUB · USER-LIFECYCLE-SPECIALIST-HUB — exemplar hubs
- Vol 27 — Falcon Brain Meta-Mining (Atlas precursor)
- Vol 39 — Cross-Module + Obsidian Best Practices
- Vol 43 — Obsidian Enhancement (most recent operational pass)

---

## §15 — Open Improvement Opportunities

| ID | Opportunity | Effort |
|---|---|---|
| Q-BRAIN-01 | Implement Tier 2 (Templater + Dataview + tag taxonomy) | 1-2 sessions |
| Q-BRAIN-02 | Daily-notes pattern + auto-link to active session | 1 session |
| Q-BRAIN-03 | Orphan-backlink audit (weekly cron) | Recurring |
| Q-BRAIN-04 | Specialist hubs for CG, Template, PES, Saga, Order-Status | Next 4 waves |
| Q-BRAIN-05 | Code-mining agent automation (auto-trigger on volume creation) | Wave 21+ |
| Q-BRAIN-06 | Cross-volume change-detection alerts (e.g., when Vol 45 changes, flag Vol 28 Matrix 5) | Wave 22+ |

---

**End of Volume 52 — Falcon Brain Self-Knowledge Map**
**Authored:** 2026-05-18 (night-shift continuation)
**Builds on:** Vol 27, Vol 39, Vol 43 (precursors) + everything else
