# Falcon Component Knowledge Base — 3-Layer Plan

> Goal (user, 2026-05-18): a *perfect* component knowledge base so that, given a screenshot or a React/Angular design, the agent knows **which Falcon library component to use and how to compose it** to reach the same result.
> Understand every component three ways: **UI · Business · Integration+Validation** — and link components ↔ pages ↔ barrel ↔ backend module.
> Status: PLAN — awaiting "go" + screenshots. Author: Adnan orchestrator.

---

## 1. What already exists (audited 2026-05-18)

| Asset | State |
|---|---|
| `understanding/frontend/components/` | **62 dossiers**, each with 6 files: OVERVIEW · API · USAGE · TOKENS · GAPS_AND_UPGRADES · DECISION |
| Real library | ~60 Angular wrappers (`falcon-ui-core/src/angular-wrapper/components`) + 103 Stencil components (`src/components`) |
| `understanding/pages/` | 14 page folders incl. `organization-hierarchy/` (Add Client folder + Add User/Add Node/Edit Node flows) |
| Wiki `30-Components` / Brain SK `60-Components` | 63 / 62 graph notes (link layer) |
| `BUSINESS.md` / `INTEGRATION.md` / `VALIDATION.md` per component | **0 / 0 / 0 — do not exist** |

**Verdict:** the **UI layer is done**; the **Business** and **Integration+Validation** layers are missing; nothing links component → page → barrel → backend module; there is no **recognition layer** (screenshot → component). So: *augment, don't rebuild.*

---

## 2. The target — a 3-layer dossier + 2 cross-cutting layers

Each component dossier grows from 6 → **9 files**:

### Layer 1 — UI (exists, keep)
`OVERVIEW.md` · `API.md` · `USAGE.md` · `TOKENS.md` — visual anatomy, inputs/outputs, slots/templates, design tokens.

### Layer 2 — Business (NEW: `BUSINESS.md`)
- What business purpose the component serves; which PRD modules / `BR-*` rules touch it.
- Business constraints baked into it (e.g. *Owner-Role dropdown is locked — `BR-AM-19` invariant*).
- Which business flows it appears in, with the *why*.

### Layer 3 — Integration + Validation (NEW: `INTEGRATION_VALIDATION.md`)
- Backend endpoints + DTOs the component (or its app-wrapper) binds to; which **backend module** owns that data (Commerce / Charging / Provisioning / Identity).
- `V-*` validation rules + PES keys that gate it.
- State/signal pattern, skeleton-vs-app-wrapper layering, error-pipeline behavior.

### Cross-cutting A — Recognition (NEW: `RECOGNITION.md`) — *this is what makes screenshots work*
- Visual fingerprint: shape, anatomy, distinguishing features.
- **Cross-library map**: "looks like MUI `<Autocomplete>` / PrimeNG `<p-dropdown>` / Ant `<Select>` → use Falcon `<falcon-angular-dropdown>`".
- Decision hints: when to use this vs a sibling component; the customization order to reach parity.

### Cross-cutting B — The link graph (`COMPONENT_PAGE_MODULE_MAP.md`)
One typed map: **component ↔ page(s) ↔ barrel export ↔ backend module**. Answers "what uses this", "what breaks if I change it", "what backend owns its data".

---

## 3. Seed from the verified-working features

The user confirms these **work as expected** — they are the gold reference:
Add Client · Add User · Add Node · Edit Node · admin-console tabs · Organization Hierarchy component.

- Every component used in those features gets its dossier marked **✅ VERIFIED (feature confirmed working by user)**.
- **The KB is built code-first.** The component source (Stencil `.tsx` + Angular wrapper + `.css`/tokens) is the visual ground truth — richer than a screenshot (all states/props/variants, not one frame). `RECOGNITION.md` fingerprints are derived from rendered structure + CSS anatomy in code.
- **Screenshots are OPTIONAL** — a future runtime *input* (the design the agent maps to components), not build-time training data. Decision 2026-05-18: do not block the build on screenshots; drop one in later only as an optional visual cross-check.
- These ~15-20 "hot" components are the pilot set (Phase 1) before the full 62-component backfill.

---

## 4. Phases

| Phase | Deliverable | Gate |
|---|---|---|
| **P0** | Audit (done) — 62 dossiers, 6 files, 0 business/integration/validation | ✅ complete |
| **P1** | Define the 9-file dossier schema + a `_template/`; pilot on the ~18 components in the verified features (Add Client/User/Node, tabs, org-hierarchy) | pilot dossiers complete + cross-checked vs running UI |
| **P2** | `COMPONENT_PAGE_MODULE_MAP.md` — component ↔ page ↔ barrel ↔ backend module link graph | every verified feature traceable end-to-end |
| **P3** | `RECOGNITION.md` per pilot component + master `COMPONENT_RECOGNITION_INDEX.md` (cross-library map) — seeded from user screenshots | given a screenshot, agent names the right Falcon component |
| **P4** | Backfill `BUSINESS.md` + `INTEGRATION_VALIDATION.md` + `RECOGNITION.md` for the remaining ~44 components | all 62 at 9 files |
| **P5** | Wire into `brain-search` (re-index) + a `screenshot→components` workflow doc/skill | `brain search "<design feature>"` returns the component + composition recipe |

P1-P3 on the verified features deliver the headline capability. P4 scales it; P5 makes it a repeatable workflow.

---

## 5. How this delivers the user's actual goal

> *"Give me a screenshot or a React/Angular design → you understand what the component should be and how to move it using our library."*

The flow at runtime becomes:
1. Screenshot/design in → `brain search` + `COMPONENT_RECOGNITION_INDEX.md` → candidate Falcon components.
2. Each candidate's 9-file dossier gives UI parity (Layer 1), business rules it must honor (Layer 2), backend wiring + validations (Layer 3).
3. `COMPONENT_PAGE_MODULE_MAP.md` shows a working precedent page using it.
4. Output: the Falcon component + the exact composition (inputs → templates → slots → tokens, per the customization-order doctrine) to reach parity.

---

## 6. Open inputs / decisions

- **Screenshots** — user offered them for the verified features. Needed to seed `RECOGNITION.md` (Phase 3). Please share screenshots of: Add Client wizard (5 steps), Add User wizard, Add/Edit Node, the admin-console tabs, and the Organization Hierarchy component.
- **Scope of "component"** — recommend dossiers track the **Angular wrapper** level (~60) as the consumer-facing unit; Stencil internals (103) referenced inside `INTEGRATION_VALIDATION.md`, not given separate dossiers. Confirm.
- **Effort** — P1-P3 (pilot, ~18 components) ≈ 1-2 days. P4 (backfill 44) ≈ 2-3 days. P5 ≈ 0.5 day.

---

*Falcon Component Knowledge Base Plan · 2026-05-18 · Adnan orchestrator · awaiting "go" + screenshots.*
