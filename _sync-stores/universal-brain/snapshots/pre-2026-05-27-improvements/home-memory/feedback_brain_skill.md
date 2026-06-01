---
name: feedback_brain_skill
description: Brain skill at C:\falcon\Brain\ â€” tri-mindset orchestrator (ChatGPT/Claude/Gemini APIs), auto-loads on every Falcon session via CLAUDE.md, each mindset has its own distinct British-male Russian-accent voice
type: feedback
originSessionId: d3af8013-16e8-4cfc-8f3e-ebdbdb861247
---
The Brain skill is a tri-mindset orchestrator installed at `C:\falcon\Brain\`. It exposes three external AI mindsets, each with its own voice:

| Mindset | Role | Voice | Speed | Activation phrase |
|---|---|---|---|---|
| **ChatGPT** | Strategic commander â€” business analysis, requirements, prompt polishing | `bm_v0george` | 0.85 | `ChatGPT engaged, comrade.` |
| **Claude** | Tactical engineer â€” implementation, code, validation | `bm_v0lewis` | 0.90 | `Claude engaged, comrade.` |
| **Gemini** | Verification officer â€” visual/chart/screenshot QA | `bm_daniel` | 0.88 | `Gemini engaged, comrade.` |

**Why:** The user wants a single skill that Adnan can route to whenever a task benefits from a different model's strength. Each mindset must be audibly distinguishable â€” different voice, all male, all British (closest Kokoro approximation to Russian-accent English; Kokoro has no native `ru_*` voice family).

**How to apply:**

1. **Trigger phrases** â€” `use brain`, `engage brain`, `tri-mindset`, `ask gemini â€¦`, `ask chatgpt â€¦`, `brain route`, `brain plan`, `brain orchestrate`, `run brain`
2. **Scripts** â€” `scripts\ask-gemini.ps1 -Prompt "â€¦"` and `scripts\ask-chatgpt.ps1 -Prompt "â€¦"` (defaults: `gemini-2.5-flash`, `gpt-4o-mini`)
3. **API keys** live in `Brain\config\keys.env` (gitignored). User maintains them; never commit. Run `scripts\test-keys.ps1` to verify.
4. **Brain envelope voice** â€” `bm_v0george` at speed 0.88. Phrases: `Brain online, comrade.` â†’ `Brain working.` â†’ `Brain complete.`
5. **Mindset voices** â€” when delegating, the mindset's own voice answers (not the envelope). agent-tts auto-routes each phrase to the right Kokoro profile based on the announcement text.
6. **All voices Ã—8 volume** (global `volumeMultiplier: 8.0` in `Brain/settings/sound/settings.json`)
7. **Hard rule** â€” Brain delegates, it does not author. Final code = Claude mindset, final business matrices = ChatGPT mindset, final visual QA = Gemini mindset
8. **Costs** â€” default models `gemini-2.5-flash` + `gpt-4o-mini`; override only when justified

**Source of truth files:**
- [`Brain/Skill.md`](C:\falcon\Brain\Skill.md) â€” main skill
- [`Brain/settings/sound/settings.json`](C:\falcon\Brain\settings\sound\settings.json) â€” voice/phrase config (`skills.brain` + `mindsets.*`)
- [`brain-skills/ai_deep_skill_bundle/skills/{00..50}/SKILL.md`](C:\falcon\brain-skills\ai_deep_skill_bundle\skills) â€” full mindset role contracts (Brain delegates to these)

After editing settings.json, run `Brain\settings\sound\scripts\apply-settings.ps1` and restart agent-tts to pick up changes.
