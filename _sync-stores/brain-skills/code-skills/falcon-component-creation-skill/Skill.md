*** Skill: falcon-component-creation ***
*** Canonical Stencil + Angular wrapper authoring for libs/falcon-ui-core ***

# Falcon Component Creation Skill

| Meta | Value |
|---|---|
| **Skill name** | `falcon-component-creation` |
| **Version** | v1.0 |
| **Last updated** | 2026-05-14 |
| **Category** | `code-skills` |
| **Owner** | Adnan (Orchestrator) |
| **Status** | 🟢 Active |
| **Strategy root** | `C:\Falcon\Brain Outputs\strategies\falcon-component-creation\` |

## Quick reference

| Aspect | Value |
|---|---|
| Triggers | `create new falcon component <name>`, `scaffold falcon component <name>`, `build falcon component <name>`, `/falcon-component <name>`, `new falcon ui component` |
| Scope | `libs/falcon-ui-core/src/components/<falcon-name>/` (Stencil) + Angular wrapper barrel entry |
| Doctrine | 8-phase wave-based execution from `06-EXECUTION_PROTOCOL.md` |
| Confidence gate | ≥95% per `05-SCORING_RUBRIC.md` — below that **blocks** |
| Build gates | `nx build falcon-ui-core` → `nx build admin-console` → `nx build host-shell` |
| Run artifact | `Brain Outputs/strategies/falcon-component-creation/runs/<YYYY-MM-DD>_<component>/` |
| Sound | ascending 4-step creation arpeggio `[520,180; 780,180; 1040,180; 1300,400]` |
| Voice | `bm_george` (matches `prd-knowledge` family — code-skills will get its own voice once category-wide voice map lands) |

## Purpose

Canonical, repeatable, audit-grade Falcon UI component creation. One trigger phrase scaffolds a brand-new `<falcon-*>` Stencil component, its Tailwind-render counterpart, its types contract, its loader registration, its token contract, its Angular wrapper export, and the supporting Obsidian + Brain SK knowledge so any agent in any future session can reuse / extend / audit the component.

This skill is the **doctrine entry point**. The actual playbook (templates, scoring rubric, common pitfalls, execution protocol) lives in `C:\Falcon\Brain Outputs\strategies\falcon-component-creation\` so multiple agents and sessions can share it without duplicating it inside the skill.

## Triggers

| Phrase | Behavior |
|---|---|
| `create new falcon component <name>` | Full 8-phase run |
| `scaffold falcon component <name>` | Alias of above |
| `build falcon component <name>` | Alias of above |
| `/falcon-component <name>` | Slash-command shorthand |
| `new falcon ui component` | Conversational form — agent asks for the name then runs |

`<name>` is normalized to kebab-case (`my-thing` → tag `falcon-my-thing`).

## When this skill applies

- User asks to create a brand-new Falcon UI component (Stencil + Tailwind-render dual path + Angular wrapper).
- Pattern recognition: any task that adds a new directory under `libs/falcon-ui-core/src/components/`.
- Cross-framework demos automatically pick up the new component via `libs/falcon-ui-showcase-data` — out of scope for this skill (separate `falcon-component-publish-skill` will own that).

**Do NOT use this skill for:**
- Editing existing components (use the matching component dossier in `Brain Outputs/understanding/frontend/components/<name>/`)
- Adding Angular-only directives or services (no Stencil involved)
- Authoring tokens — token authoring belongs in `libs/falcon-ui-tokens/src/`; this skill only **references** tokens

## What the skill does

The skill loads the canonical strategy and follows it. Concretely:

1. **Read** `Brain Outputs/strategies/falcon-component-creation/01-CANONICAL_PATTERN.md` to internalize the doctrine (file layout, dual-render path, types contract, loader pattern).
2. **Read** `06-EXECUTION_PROTOCOL.md` for the 8-phase wave plan (intake → token contract → types → Stencil → Tailwind-render → loader → Angular wrapper → build verification).
3. **Read** `05-SCORING_RUBRIC.md` for the confidence rubric — every emitted file is scored, total must reach **≥95%**.
4. **Use** `04-FILE_TEMPLATES/` as the scaffolding source for each new file (Stencil `.tsx`, `.types.ts`, `.tokens.css`, Tailwind `.render.ts`, loader registration, Angular wrapper export).
5. **Cross-check** `08-COMMON_PITFALLS.md` to avoid known traps (event-bubbling drift, Shadow DOM token leakage, Angular wrapper input/output naming, tag-name clashes, Tailwind variant parity).
6. **Write** a run report to `Brain Outputs/strategies/falcon-component-creation/runs/<YYYY-MM-DD>_<component>/`:
   - `RUN.md` — what was created, build hashes, scorecard
   - `SCORECARD.md` — per-file rubric breakdown
   - `DEVIATIONS.md` — any deltas from the canonical pattern, with justification
7. **Update knowledge in three vaults** (mandatory):
   - **Falcon Wiki** (`C:\Falcon\falcon-wiki\`): new atomic note in `30-Components/falcon-<name>.md` via the `new-component` Templater shape
   - **Brain SK vault**: new component dossier under `Brain Outputs/understanding/frontend/components/<name>/` with the standard 6-file set (`OVERVIEW.md`, `API.md`, `USAGE.md`, `TOKENS.md`, `GAPS_AND_UPGRADES.md`, `DECISION.md`)
   - **Brain SK registry**: append entry to component registry index
8. **Announce** completion via the sound signature + global handshake.

## Strategy resources (referenced, not inlined)

The strategy docs live in Brain Outputs so they survive context resets and are shared across agents. Skill.md only lists the paths — never inlines the content.

| File | Purpose |
|---|---|
| `Brain Outputs/strategies/falcon-component-creation/README.md` | Strategy overview + how to invoke |
| `…/01-CANONICAL_PATTERN.md` | Component anatomy, dual-render doctrine, types contract, loader rule |
| `…/05-SCORING_RUBRIC.md` | Per-file 0–100 scoring breakdown + ≥95% pass gate |
| `…/06-EXECUTION_PROTOCOL.md` | 8-phase wave plan (intake / tokens / types / Stencil / Tailwind / loader / wrapper / verify) |
| `…/04-FILE_TEMPLATES/` | Scaffolding templates per file type |
| `…/08-COMMON_PITFALLS.md` | Known traps + how to avoid them |
| `…/runs/<date>_<component>/` | Per-run artifacts (RUN.md, SCORECARD.md, DEVIATIONS.md) |

## Source-of-truth examples in the codebase

When in doubt during a run, mirror these two known-good references:

| Reference | Path | Why it's canonical |
|---|---|---|
| `falcon-empty-state` | `libs/falcon-ui-core/src/components/falcon-empty-state/` | Cleanest dual-render pattern, minimal surface |
| `falcon-accordion` | `libs/falcon-ui-core/src/components/falcon-accordion/` | Demonstrates event bubbling + slot composition + token usage |
| Token system | `libs/falcon-ui-tokens/src/` | Token authoring + theme entry |
| Loader | `libs/falcon-ui-core/src/define-falcon-tw-component.ts` | The single registration point both Shadow and Tailwind variants must go through |

## Pre-checks (BEFORE invoking)

Run all three. Halt and report on any failure — do NOT scaffold over a broken baseline.

1. **Build baseline green** — `nx build falcon-ui-core` exits 0. If red, file the broken-baseline issue and stop.
2. **Tag-name clash scan** — `grep -r "falcon-<name>" libs/` returns zero existing files. If the tag exists, escalate (consumer will silently bind to the wrong component).
3. **Token contract draft** — either the user supplies a token list inline, or we stub `falcon-<name>.tokens.css` from the matching token family in `falcon-ui-tokens` and flag it as **PENDING_TOKEN_REVIEW** in the run report.

## Post-checks (AFTER invoking)

All four are mandatory. Skill does not declare success until all four pass.

1. `nx build falcon-ui-core` exits 0 (Stencil + types compile + bundle emits).
2. `nx build admin-console` exits 0 (consumer 1 — proves wrapper export works).
3. `nx build host-shell` exits 0 (consumer 2 — proves Module Federation surface intact).
4. Scorecard total **≥95%** per `05-SCORING_RUBRIC.md`. If below, run is **logged as DEVIATION** and blocked — no completion sound, no global handshake, no vault updates. The user is asked to approve the deviation or rerun the failing wave.

If consumer builds drift but `falcon-ui-core` is green: the component is valid but **not shippable**. Mark `RUN.md` status as `partial`, do not run the global handshake, escalate to user.

## Cross-skill dependencies

This skill triggers / uses (never duplicates) these peers:

| Peer skill | What we borrow | How |
|---|---|---|
| [`angular-tailwind-skill`](../../Front-End-skills/angular-tailwind-skill/Skill.md) | Tailwind v4 utility rules, no-SCSS rule, theme `@theme` directive | Tailwind-render variant must comply 100% |
| [`noor-instructions-skill`](../../Front-End-skills/noor-instructions-skill/Skill.md) | Color palette naming (palette over intent), no inline styles | **Only when component is going to be consumed by Admin Console** — does NOT govern authoring |
| [`official-angular-skill`](../../Front-End-skills/official-angular-skill/Skill.md) | Angular 21 + zoneless + signals reference for the wrapper | Wrapper template / output emitter style |
| [`design-eng`](../../Front-End-skills/emil-design-eng-skill/Skill.md) | Motion + craft heuristics | Optional polish pass after build gates |

This skill **does NOT trigger**: `prd-knowledge`, `module-catalog`, `test-case-authoring` (those are business-side; this is code-side).

## Hard rules

1. **NEVER skip the build phase.** All three builds must run on every invocation, in this exact order: `falcon-ui-core` → `admin-console` → `host-shell`.
2. **NEVER ship a confidence score <95%.** Block the run, write `DEVIATIONS.md`, await user decision.
3. **NEVER commit or push without explicit user instruction.** Standard Falcon rule — applies to this skill without exception. Working tree may be left dirty.
4. **ALWAYS update Obsidian in both vaults** — Falcon Wiki (`30-Components/falcon-<name>.md`) AND Brain SK vault (`Brain Outputs/understanding/frontend/components/<name>/` 6-file dossier).
5. **ALWAYS route registration through `define-falcon-tw-component.ts`.** Direct `customElements.define` calls are banned for Falcon components.
6. **ALWAYS produce both render paths.** Shadow DOM (Stencil `.tsx`) **and** Tailwind (`.render.ts`) — never one without the other. The token contract is the SSOT for both.
7. **NEVER edit `libs/falcon-ui-tokens/`** during a component-creation run. Tokens are authored upstream; this skill only consumes them. If a missing token is detected, write it as a **GAP** in `GAPS_AND_UPGRADES.md` and stub a local placeholder.
8. **NEVER touch consumers** (admin-console, host-shell, mgmt-console) other than building them. Wrapper imports are tested **by building** consumers — not by inserting demo usage into their pages.
9. **NEVER skip the scorecard** even on "trivial" components. The rubric is the audit trail.
10. **NEVER suppress build warnings** to hit the green gate. Fix root cause or escalate.

## Failure modes (recovery doctrine)

| Failure | Recovery |
|---|---|
| **Stencil build fails** | Stop immediately. Dump full error to `RUN.md`. **Do NOT chain to consumer builds.** Re-spawn only the Wave that owns the failing file (typically Stencil `.tsx` or types contract). |
| **A Wave-1 sub-agent fails** | Rerun ONLY that sub-agent — do not re-execute completed waves. The types contract is the synchronization point; if it changed, escalate to "types drift" recovery (below). |
| **Types contract drifts mid-execution** | Lock `types.ts` immediately. Re-spawn every dependent agent (Stencil, Tailwind-render, Angular wrapper) against the locked types. Mark the run in `DEVIATIONS.md`. |
| **Consumer build fails but `falcon-ui-core` is green** | Component is valid but not shippable. Status = `partial`. No global handshake. Escalate. |
| **Token contract incomplete** | Stub locally, flag `PENDING_TOKEN_REVIEW`, write a `falcon-ui-tokens` gap note. Do NOT block — proceed to build. |
| **Tag-name clash detected in pre-check** | Halt before any file write. Escalate to user with the existing component's path. |
| **Scorecard <95%** | Block completion. Write `DEVIATIONS.md` with the per-file deltas. Ask user to approve or rerun. |

## Run output (required format)

```
Falcon component creation complete (YYYY-MM-DD HH:MM)
Component:    falcon-<name>
Files created: N (Stencil .tsx, .types.ts, .tokens.css, .render.ts, wrapper export, barrel update)
Scorecard:    NN/100 (gate: ≥95)
Builds:
  falcon-ui-core:  ✓ green (hash: <hash>)
  admin-console:   ✓ green (hash: <hash>)
  host-shell:      ✓ green (hash: <hash>)
Knowledge:
  Falcon Wiki:     ✓ 30-Components/falcon-<name>.md created
  Brain SK vault:  ✓ Brain Outputs/understanding/frontend/components/<name>/ (6 files)
  Component registry: ✓ entry appended
Deviations:    <none | see DEVIATIONS.md>
Run artifact:  Brain Outputs/strategies/falcon-component-creation/runs/<YYYY-MM-DD>_<name>/
```

## Status Announcer (voice + sound)

| Phase | Voice | Phrase | Beep |
|---|---|---|---|
| Activation | `bm_george` | "Falcon component creation running." | — |
| Working (long ops) | `bm_george` | "Falcon component creation working." | — |
| Completion | `bm_george` | "Falcon component creation complete." | ascending 4-step `[520,180; 780,180; 1040,180; 1300,400]` |
| **Global handshake** | `bm_george` | **"I am finishing, boss."** | double-tap `[1320,100; 1320,100]` |

**PowerShell beep:**

```powershell
[console]::beep(520,180); [console]::beep(780,180); [console]::beep(1040,180); [console]::beep(1300,400)
```

This 4-step pattern is fresh — no collision with the 5 existing skill beeps (`prd-knowledge` 660-880-1100, `domain-glossary` 1000×3, `module-catalog` 700 long-short-long telegraph, `test-case-authoring` 880-1100-880 low-high-low, `business-pipeline` 440-660-880-1100 fanfare). Lower starting frequency + 4-step climb is distinct.

**Play ONLY when:** all 3 consumer builds are green AND scorecard ≥95% AND both vaults updated. Never on partial / failed / deviated runs.

## Resource file list

This Skill.md does NOT inline the strategy. Files referenced live at:

- `C:\Falcon\Brain Outputs\strategies\falcon-component-creation\README.md`
- `C:\Falcon\Brain Outputs\strategies\falcon-component-creation\01-CANONICAL_PATTERN.md`
- `C:\Falcon\Brain Outputs\strategies\falcon-component-creation\04-FILE_TEMPLATES\`
- `C:\Falcon\Brain Outputs\strategies\falcon-component-creation\05-SCORING_RUBRIC.md`
- `C:\Falcon\Brain Outputs\strategies\falcon-component-creation\06-EXECUTION_PROTOCOL.md`
- `C:\Falcon\Brain Outputs\strategies\falcon-component-creation\08-COMMON_PITFALLS.md`
- `C:\Falcon\Brain Outputs\strategies\falcon-component-creation\runs\` (per-run artifacts)

## See also

- [`README.md`](./README.md) — short overview + strategy-folder pointers
- `Brain Outputs/strategies/falcon-component-creation/README.md` — full strategy entry point
- `libs/falcon-ui-core/src/components/falcon-empty-state/` — canonical reference component
- `libs/falcon-ui-core/src/components/falcon-accordion/` — canonical reference component (event-rich)
- `libs/falcon-ui-core/src/define-falcon-tw-component.ts` — mandatory registration entry
- [`angular-tailwind-skill`](../../Front-End-skills/angular-tailwind-skill/Skill.md) — Tailwind v4 doctrine for the render variant
- [`noor-instructions-skill`](../../Front-End-skills/noor-instructions-skill/Skill.md) — consumer-side rules (Admin Console)
- [`SOUNDS.md`](../../SOUNDS.md) — sound-signature index across all skills

---

_Last updated: 2026-05-14 — Strategy v1.0 — Author: Adnan (auto)_
