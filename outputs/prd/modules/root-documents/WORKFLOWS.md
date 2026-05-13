*** PRD Understanding - Root Documents - WORKFLOWS ***

# root-documents - Workflows

> Meta-workflows only — there is no system runtime here.

## WM1: Backlog Item Lifecycle (Product Team)

- **Trigger:** Product team identifies a topic in a planning meeting that doesn't fit any current PRD revision.
- **Source:** `understanding.md:8-12, 24`.
- **Steps:**
  1. Product team adds the topic to `Points to be covered later` on Drive (typically with the assignee in brackets, e.g. `[Jawad]`).
  2. Next `take latest from PRD` sync mirrors the doc locally.
  3. Brain analysis (this pass) maps each topic to the relevant module.
  4. Module-specific `QUESTIONS.md` lists the topic as a `Q-<MOD>-NN` row.
  5. When a future PRD revision addresses the topic, the row is removed from BOTH `Points to be covered later` (on Drive) AND the local `latest-prd.md`.
- **Success:** Backlog drained as PRDs evolve.
- **Failure modes:** Items stagnate; cross-module ownership unclear; same topic re-added under different wording.

## WM2: Copilot 4DevOps Prompt Library Use (Product Team)

- **Trigger:** Product team has a BRD and needs to convert it into Azure DevOps backlog items.
- **Source:** `latest-prd.md:42-50`.
- **Steps (high-level):**
  1. Pick a prompt template from the library (e.g. "Convert BRD -> Backlog with Epic/Features/Stories + Gherkin").
  2. Apply the prompt to the BRD using Copilot inside Azure DevOps.
  3. Review generated artifacts; iterate.
  4. Other templates available: improve user story, split story, generate QA scenarios, find missing edge cases.
- **Success:** BRD converted to structured backlog.
- **Failure modes:** Generated content needs human review; prompt drift over time.

## WM3: Brain Pass Cross-Reference

- **Trigger:** A new module-understanding pass (this one).
- **Source:** `understanding.md:14-19`.
- **Steps:**
  1. Read `root-documents/latest-prd.md`.
  2. For each backlog item, identify the owning module(s).
  3. Append the item to the owning module's `QUESTIONS.md` as a cross-cutting question, citing `root-documents/latest-prd.md:LL`.
  4. If the topic is ambiguous, leave it in `root-documents/GAPS.md` and note its multi-module scope.
- **Status:** Completed in this pass (all 10 backlog items mapped — see `GAPS.md`).
