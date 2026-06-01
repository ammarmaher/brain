---
name: Noor Instructions skill (always-on for Admin Console)
description: Falcon Admin Console rule book — always loaded, always applied. Overrides angular-tailwind-skill on color naming for Admin Console scope. Edit-gated via PreToolUse hook.
type: feedback
originSessionId: 25512807-daa0-486f-99fd-0aacbe9baea5
---
**Rule:** All Admin Console UI work (Contracts, Pricing, Tariff, OCS, future internal modules) MUST follow `noor-instructions-skill` at `C:\falcon\brain-skills\Front-End-skills\noor-instructions-skill\Skill.md`.

**Why:** Boss handed over a written spec (§5.15.x) for internal console screens covering layout ownership, theme promotion, typography, font policy, color naming, component reuse, i18n/RTL, and global selectors. Noor encodes that spec into 8 categories + 1 informational baseline file. Confirmed with user on 2026-05-05.

**How to apply:**
- The skill is auto-loaded via `C:\falcon\CLAUDE.md` mandatory pre-read block — every session loads it on startup.
- The session-start banner shows a `▣ noor-instructions` row in the FRONT-END column of the System Integrity Check.
- A PreToolUse hook on Edit/Write to `*.html`, `*.scss`, `*.css`, `*.ts` injects a one-line system-reminder before each UI edit: "Noor Instructions in force — verify shell ownership, palette names, RTL safety."
- On conflict between Noor and `angular-tailwind-skill`: Noor wins **inside Admin Console scope** (color naming flips from semantic `bg-success` to palette `falcon-green-*`). Universal skill wins outside it.
- On conflict between Noor and the Falcon Wiki: Wiki wins (architecture supersedes styling).

**Color naming caveat (forward-only):** Noor's palette-over-intent rule (Cat E) applies ONLY to NEW theme tokens added in Admin Console scope. Existing semantic tokens (`bg-success`, `text-danger`, `bg-primary-600`, etc.) stay valid — no migration, no rename. Touching an existing semantic token to "Noor-ize" it without other reason is a scope violation.

**Font caveat:** Noor's font policy (Cat D) is the Falcon canonical stack: **Neue Haas Grotesk Display Pro** (LTR) + **Cairo** (RTL primary) + **IBM Plex Sans Arabic** (RTL fallback). The boss's V0.2 sketch (Inter + IBM Plex + Poppins via Google Fonts CDN) was rejected — Falcon uses self-hosted fonts only. IBM Plex Sans Arabic was wired into the live `--font-sans-ar` chain on 2026-05-05.
