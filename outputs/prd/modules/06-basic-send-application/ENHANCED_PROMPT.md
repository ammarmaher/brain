*** PRD Understanding - Basic Send Application - ENHANCED_PROMPT ***

# Enhanced re-input prompt — Basic Send Application (BSA)

> The user's 2026-07-06 intake prompt, enhanced and made replayable. Paste the block below into any future Falcon session that must work on BSA. It routes the session to the knowledge this intake created instead of re-deriving it.

---

## The enhanced prompt (copy-paste from here)

**Context — load before doing anything:**
You are working on the Falcon **Basic Send Application (BSA)** — PRD module 06. All BSA knowledge is already captured; do NOT re-analyze from scratch:

1. **Canonical knowledge (SoT):** `C:\Falcon\Brain Outputs\prd\modules\06-basic-send-application\` — read `OVERVIEW.md` first, then as needed: `BUSINESS_RULES.md` (BR-BSA-01..96, verbatim-quoted), `ENTITIES.md` (E1-E15), `WORKFLOWS.md` (4 state machines + 8 workflows), `API.md`, `EDGE_CASES.md`, `QUESTIONS.md` (Q-BSA-01..24 — treat as HALT-AND-FLAG list), `GAPS.md` (PRD↔React parity matrix + conflicts C1-C14 **with rulings** + backend-absence register), `V2_TO_V5_DIFF.md`.
2. **Vault graph:** `C:\Falcon\Brain SK\_obsidian\15-PRD\06 Basic Send Application.md` + the BSA page notes in `10-Pages/` + `45-Backend/Basic Send Service.md` + `16-Journeys/Basic Send Message.md`.
3. **Visual/UX source of truth (screens):** the React reference `C:\Falcon\Source_of_truth_theme\latest 07062026\falcon-ux (4)\admin\basic-app.jsx` (+ `-data.jsx`, `.css`) — pre-digested in `REACT_REFERENCE.md` (every screen, component, CSS token, status color, and the list of stubs/dead code you must NOT port). To SEE it: `python -m http.server 4173 --directory "C:\Falcon\Source_of_truth_theme\latest 07062026\falcon-ux (4)"` → open `http://localhost:4173/T2%20Falcon%20Admin.html` → Marketplace & Applications .Mng → Basic Application → View as Client → set VIEWING AS = Normal User (Send buttons are role-gated).
4. **Backend reality:** `PLATFORM_GROUNDING.md` — what exists (Charging reserve/commit/release, templates-svc feat/ivr-templete, contact-group svc, PES, marketplace SKU `695a304f901bb7d4a830d0dc`) vs what the new BSA service must build. The backend is the platform SoT — never invent endpoints.
5. **The plan:** `IMPLEMENTATION_PLAN.md` — FE = new NX Module-Federation remote `basic-send-app` opened inside both consoles; BE = new service `falcon-core-basic-send-svc`; waves F0-F9 / B0-B7 with decision gates D-1..D-10 and prereqs P-1..P-4.

**Standing constraints (non-negotiable):**
- Frontend and backend are SEPARATE projects; the FE is a micro-front app mounted inside the existing consoles (admin = Falcon view, management = client view).
- PRD V5 is behavior truth; the React reference is visual truth; conflicts are already ruled in `GAPS.md` — follow the rulings, don't re-litigate.
- Falcon UI library only (no native HTML controls); API services live in the app project; data tables default to page size 10; en+ar i18n lockstep; PES fail-closed (BSA needs its OWN `acc.bsa*` resources — `acc.services` denies acc-user).
- Charging: no reservation at creation; WA per-batch reserve→commit|release with idempotent per-recipient references; Voice per-second realtime deduction + termination on exhaustion; no balance/channel failover.
- Never claim tested/verified without runtime evidence; no commits/branches/pushes without explicit instruction.

**Now do: <YOUR TASK HERE — e.g. "execute Wave F1 of the implementation plan">**
If the task touches any Q-BSA-* open question or D-*/P-* decision gate, surface it and get a ruling BEFORE building that part. If you find drift between these documents and the current code/PRD, update the module + flag it — the brain must stay truthful.

---

## What the original prompt asked vs what this enhanced version adds

| Original ask (2026-07-06) | Enhancement |
|---|---|
| "understand the basic app 100%" | Understanding is persisted + adversarially verified (96 BRs, 15 entities, 4 FSMs, 24 questions, 14 ruled conflicts) — sessions LOAD it instead of re-reading a 508-line PRD + 3k-line JSX |
| "make sure we have all the things needed in the brain SK / update Obsidian" | Exact file list + vault nodes above; gaps live in GAPS.md, not chat memory |
| "perfect plan, FE and BE in different projects" | IMPLEMENTATION_PLAN.md with wave DAG, FE/BE contracts per wave, decision gates that make "perfect" honest — the 14 named decisions/prereqs are what still stands between plan and build |
| "micro front app opened inside our applications" | Locked as Module-Federation remote consumed by both consoles (D-1 records the alternative) |
| "run the React project and see the screens" | Exact serve command + click-path + the role-gating trick; runtime walk already evidenced in REACT_REFERENCE.md header |
| "fill all the gaps" | Three-layer gap register with rulings; PRD's own Pending list kept verbatim in EDGE_CASES.md |
