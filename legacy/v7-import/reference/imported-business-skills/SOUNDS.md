*** Falcon Brain Skills — Sound + Voice Signatures ***
*** Per-skill voice + beep pattern + global completion handshake ***

# Sound + Voice Signatures

Every brain skill has a unique voice and beep on success. Source of truth: [`settings/sound/settings.json`](./settings/sound/settings.json).

## Per-skill signatures

| Skill | Voice | "Running" / "Complete" phrase | Beep pattern | PowerShell command |
|---|---|---|---|---|
| **prd-knowledge** | `bm_george` (British male, authoritative) | `PRD knowledge running.` / `PRD knowledge complete.` | ascending → resolve | `[console]::beep(660,200); [console]::beep(880,200); [console]::beep(1100,400)` |
| **domain-glossary** | `bm_lewis` (British male, careful) | `Domain glossary running.` / `Domain glossary complete.` | 3 equal taps | `[console]::beep(1000,150); Start-Sleep -Milliseconds 80; [console]::beep(1000,150); Start-Sleep -Milliseconds 80; [console]::beep(1000,150)` |
| **module-catalog** | `bm_daniel` (British male, narrator) | `Module catalog running.` / `Module catalog complete.` | long-short-long telegraph | `[console]::beep(700,500); [console]::beep(700,200); [console]::beep(700,500)` |
| **test-case-authoring** | `bm_fable` (British male, methodical) | `Test case authoring running.` / `Test case authoring complete.` | low-high-low | `[console]::beep(880,400); [console]::beep(1100,400); [console]::beep(880,400)` |

## Global completion handshake

Played at the **end of EVERY skill cycle** after the per-skill beep:

| Element | Value |
|---|---|
| Voice | `bm_george` (British male — always) |
| Phrase | `I am finishing, boss.` |
| Beep | `[console]::beep(1320,100); [console]::beep(1320,100)` (high-pitched double-tap) |

## Full sequence per skill cycle

```
1. <skill voice>: "<Skill> running."
   ... work happens ...
2. <skill voice>: "<Skill> complete."
3. <skill beep signature>
4. bm_george: "I am finishing, boss."
5. <global double-tap beep>
```

## Voice / volume settings (apply globally)

| Setting | Value | Source |
|---|---|---|
| Volume multiplier | `8.0` (Kokoro `volume_multiplier`) | `settings.json:global.volumeMultiplier` |
| Speed | `1.0` | `settings.json:global.speed` |
| Player volume | `1.0` (max) | `settings.json:global.playerVolume` |
| Response format | `mp3` | `settings.json:global.responseFormat` |

Volume scaled empirically — 8× is the loudness/clarity sweet spot. 12×+ introduces noticeable distortion.

## When to play

- ONLY on successful completion of the skill's primary operation
- ALWAYS pair: voice + per-skill beep + global handshake
- NEVER on routine actions (file reads, intermediate steps)
- NEVER on errors — emit error sound instead (TBD)

## How to change

1. Edit `settings/sound/settings.json` (per-skill `voice`, `phrases`, `beep`, or global `completion`)
2. Run `settings/sound/scripts/apply-settings.ps1`
3. Restart agent-tts

## Adding a new skill sound

1. Pick a frequency band that does not collide with existing skills (300–1500 Hz used)
2. Pick a temporal pattern distinct from all existing (taps, sweep, telegraph, low-high-low)
3. Add the skill block to `settings.json` with `voice`, `phrases`, `beep`
4. Run `apply-settings.ps1` and `demo-announcer.ps1` to verify

## Future categories

- **code-skills** — TBD
- **design-skills** — TBD
