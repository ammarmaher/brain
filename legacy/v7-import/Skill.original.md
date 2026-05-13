*** Skill: brain ***
*** Tri-mindset orchestrator â€” routes tasks to ChatGPT, Claude, and Gemini via external APIs ***

# brain

## Activation banner (mandatory on every session)

On every Claude Code SessionStart, two stacked banners are auto-printed by `scripts/show-banner.ps1` (wired as the first SessionStart hook in `~/.claude/settings.json`):

**Banner 1 — Falcon Brain v1.0 identity:**
- **B R A I N** block letters (cyan)
- **F A L C O N — V E R S I O N 1 . 0** tagline (green)
- Three mindset cards (ChatGPT / Claude / Gemini)
- **Powered by Ammar** + **SK** block-letter signature (yellow)

**Banner 2 — System Integrity Check:**
- Two-column dashboard listing 25 skills under categories (ORCHESTRATION, MINDSETS, CODE STANDARDS, PROTOCOLS, BUSINESS PIPELINE, FRONT-END, UNIVERSAL BRAIN)
- Each skill checked at runtime via `Test-Path`: `▣` is **green** if the skill file exists, **red** if missing
- Footer: `ALL SYSTEMS ONLINE · 25 / 25 · READY` (green) when all skills pass; flips to `WARN — N MISSING` (yellow) on any failure

The agent must NOT re-print either banner mid-session unless the user explicitly asks. The banners are visual confirmation only — they do NOT auto-load skill content (skills still load on trigger phrases like `use brain`, `take latest from PRD`, etc.).

## Purpose

Adnan's external-AI escalation lane. When a task benefits from a different model's strength, **brain** routes it: ChatGPT for business analysis, Gemini for visual/chart QA, Claude (this session) for implementation in repo.

Reuses the role contracts already in `../brain-skills/ai_deep_skill_bundle/`.

## Triggers

- `use brain`
- `engage brain`
- `brain analyze`
- `tri-mindset`
- `ask gemini â€¦`
- `ask chatgpt â€¦`
- `brain route`
- `brain plan`
- `brain orchestrate`
- `run brain`

## Source of truth (role contracts â€” do not duplicate)

| Mindset | Contract |
|---|---|
| Master orchestrator | [`../brain-skills/ai_deep_skill_bundle/skills/00-master-orchestrator/SKILL.md`](../brain-skills/ai_deep_skill_bundle/skills/00-master-orchestrator/SKILL.md) |
| ChatGPT â€” business analyst | [`../brain-skills/ai_deep_skill_bundle/skills/10-chatgpt-codex-business-analyst/SKILL.md`](../brain-skills/ai_deep_skill_bundle/skills/10-chatgpt-codex-business-analyst/SKILL.md) |
| Claude â€” implementation engineer | [`../brain-skills/ai_deep_skill_bundle/skills/20-claude-implementation-engineer/SKILL.md`](../brain-skills/ai_deep_skill_bundle/skills/20-claude-implementation-engineer/SKILL.md) |
| Gemini â€” visual / chart QA | [`../brain-skills/ai_deep_skill_bundle/skills/30-gemini-visual-chart-qa/SKILL.md`](../brain-skills/ai_deep_skill_bundle/skills/30-gemini-visual-chart-qa/SKILL.md) |
| Knowledge pipeline | [`../brain-skills/ai_deep_skill_bundle/skills/40-business-knowledge-pipeline/SKILL.md`](../brain-skills/ai_deep_skill_bundle/skills/40-business-knowledge-pipeline/SKILL.md) |
| Sound announcer | [`../brain-skills/ai_deep_skill_bundle/skills/50-sound-announcer/SKILL.md`](../brain-skills/ai_deep_skill_bundle/skills/50-sound-announcer/SKILL.md) |

## Folder layout

```
Brain/
  Skill.md
  scripts/
    ask-gemini.ps1     CLI: prompt -> Gemini, prints answer
    ask-chatgpt.ps1    CLI: prompt -> ChatGPT, prints answer
    test-keys.ps1      Verify both keys authenticate
  config/
    keys.env           [gitignored] real GEMINI_API_KEY + OPENAI_API_KEY
    keys.env.example   template
    .gitignore         excludes keys.env
```

## Hard rules

1. **NEVER commit `config/keys.env`** â€” `.gitignore` enforces it
2. **Brain delegates, it does not author** â€” final business matrices stay with ChatGPT mindset, final code stays with Claude mindset, final visual QA stays with Gemini mindset (see `ai_deep_skill_bundle` role contracts)
3. **Coding gate** â€” no source edits begin until business-pipeline produces test scenarios for the affected module
4. **Cost discipline** â€” default models are `gemini-2.5-flash` and `gpt-4o-mini`; override only when a heavier model is justified
5. **No secrets in chat** â€” never paste API keys into the assistant response; only the user touches `keys.env`

## Commands

| # | Command | What it does |
|---|---|---|
| 1 | `scripts\ask-gemini.ps1 -Prompt "â€¦"` | One-shot Gemini call (default model `gemini-2.5-flash`) |
| 2 | `scripts\ask-chatgpt.ps1 -Prompt "â€¦"` | One-shot ChatGPT call (default model `gpt-4o-mini`) |
| 3 | `scripts\test-keys.ps1` | Verify both keys authenticate |

## Routing algorithm (when Adnan engages brain)

1. **Classify the task** â€” business / visual / code / testing / knowledge
2. **Pick the mindset** â€” see role contracts above
3. **Compose the prompt** â€” use the prompt shapes in the role contract
4. **Call the script** â€” `ask-gemini.ps1` or `ask-chatgpt.ps1`
5. **Validate the output** â€” gates from `00-master-orchestrator/SKILL.md`
6. **Hand the result back to the originating Ammar agent** â€” never let brain author final deliverables

## Status Announcer (voice + sound)

Source of truth: [`settings/sound/settings.json`](settings/sound/settings.json) â†’ `skills.brain` and `mindsets.{ChatGPT,Claude,Gemini}`.

### Brain skill envelope

| Phase | Voice | Phrase | Beep |
|---|---|---|---|
| Activation | `bm_v0george` | `Brain online, comrade.` | â€” |
| Working | `bm_v0george` | `Brain working.` | â€” |
| Completion | `bm_v0george` | `Brain complete.` | rising triad `[440,150; 660,150; 880,300]` |
| Global handshake | `bm_george` | `I am finishing, boss.` | double-tap `[1320,100; 1320,100]` |

### Per-mindset voices (each is a distinct British male, slowed for Russian-accented cadence)

| Mindset | Voice | Speed | Activation phrase | Completion phrase |
|---|---|---|---|---|
| **ChatGPT** (strategic commander) | `bm_v0george` | `0.85` | `ChatGPT engaged, comrade.` | `ChatGPT complete.` |
| **Claude** (tactical engineer) | `bm_v0lewis` | `0.90` | `Claude engaged, comrade.` | `Claude complete.` |
| **Gemini** (verification officer) | `bm_daniel` | `0.88` | `Gemini engaged, comrade.` | `Gemini complete.` |

All mindsets at volume multiplier `8.0` (global default).

When Brain delegates to a mindset, the orchestrator agent must speak the mindset's `engaged` phrase, then `working` phrase mid-operation, then `complete` phrase before handing back. agent-tts auto-routes each phrase to the right voice.

> **Honesty note:** Kokoro does not ship a native Russian-accented English voice (voice families `af/am/bf/bm/ef/em/ff/hf/hm/if/im/jf/jm/pf/pm/zf/zm` only â€” no `ru_*`). Three different British male voices (`bm_v0george`, `bm_v0lewis`, `bm_daniel`) at slowed speed are the closest available â€” distinct, deep, deliberate, measured cadence. Demo: run `settings/sound/scripts/demo-announcer.ps1`.

## Context-aware voice alerts

State-truthful alert routing. Never play a phrase claiming a state that is currently false.

### Picker

[`scripts/play-alert-context.ps1`](scripts/play-alert-context.ps1) â€” loads `assets/voice-alerts-claims.json`, filters the 10 phrases per `<mindset>/<category>` against the boolean state flags, picks one eligible phrase at random, plays the matching mp3 via `[System.Windows.Media.MediaPlayer]`. Falls back to the claim-free subset if no phrase passes; warns and exits 0 if nothing is playable.

### Claim taxonomy

Each phrase in [`assets/voice-alerts-claims.json`](assets/voice-alerts-claims.json) is tagged with a subset of these six claims (strict enum). A phrase is eligible only when every claim in its array is currently true.

| Claim | Meaning |
|---|---|
| `tested` | Tests were executed and passed |
| `reviewed` | Output was inspected by the verification layer |
| `deployed` | Changes were applied to the target |
| `validated` | Validation/QA verdict was issued |
| `tests_authored` | Test cases were written (not necessarily executed) |
| `approved` | A human or gate gave explicit approval |

### Routing rules (script -> alert calls)

| Script | Start call | End call |
|---|---|---|
| `scripts/ask-chatgpt.ps1` | `-Mindset chatgpt -Category taskReceived` | `-Mindset chatgpt -Category finished -Reviewed:$false -Deployed:$false -Tested:$false` |
| `scripts/ask-gemini.ps1` | `-Mindset gemini -Category taskReceived` | `-Mindset gemini -Category finished -Reviewed:$true` (Gemini IS the verification layer) |
| `scripts/render-all-sequential.ps1` | `-Mindset claude -Category processing` | `-Mindset claude -Category deployment -Tested:$false` |
| `scripts/render-mindset.ps1` | â€” | `-Mindset claude -Category deployment -Tested:$false` |
| `scripts/render-mindset-half.ps1` | â€” | `-Mindset claude -Category deployment -Tested:$false` |
| `scripts/test-keys.ps1` | â€” | `-Mindset gemini -Category finished -Tested:$true -Reviewed:$true` if BOTH keys pass; else `-Mindset claude -Category blocked` |

All wired scripts accept a `-Quiet` switch that suppresses every alert call. All picker invocations are wrapped in `try {} catch {}` so a missing picker, missing claims sidecar, or Kokoro-down condition never breaks the host script.

### The honesty rule

Never play a phrase claiming a state that is currently false. If you do not know whether something was tested/reviewed/deployed, pass `$false` and let the picker fall back to claim-free phrases. When in doubt, leave a phrase's claims array empty â€” that keeps it always-eligible and safe.
