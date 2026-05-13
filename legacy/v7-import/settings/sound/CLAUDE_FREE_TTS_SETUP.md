*** Claude Free TTS â€” Setup Guide (Kokoro local, no API key) ***
*** agent-tts (Node) â†’ Kokoro-FastAPI (Docker, port 8880) â†’ Kokoro 82M model â†’ speakers ***

# Claude Free TTS Setup

Free, local, on-device TTS for Claude Code responses. No API key, no cloud, no paid provider.

## Architecture

```
Claude Code writes JSONL  â”€â”€â–¶  agent-tts (Node, watches files)
                                      â”‚
                                      â–¼  HTTP POST /v1/audio/speech
                              Kokoro-FastAPI (Docker, :8880)
                                      â”‚
                                      â–¼  audio bytes
                              agent-tts UI (http://localhost:3456)
                                      â”‚
                                      â–¼
                                  Speakers
```

## What is already installed

| Component | Where | Status |
|---|---|---|
| Node.js v20.19.5 | system | âœ… |
| npm 10.8.2 | system | âœ… |
| Docker Desktop 29.3.1 | system | âš  installed but daemon was OFFLINE during setup â€” start it before continuing |
| Python 3.14.4 | system | âš  too new for native Kokoro install â€” use Docker path instead |
| espeak-ng | â€” | âŒ not installed (only needed for non-Docker fallback) |
| `agent-tts` global package | `%APPDATA%\npm\agent-tts` | âœ… |
| agent-tts config (Kokoro-pointed) | `~/.config/agent-tts/config.js` | âœ… |
| `.gitignore` for audio/caches | `Brain/settings/sound/.gitignore` | âœ… |
| Kokoro-FastAPI Docker image | `ghcr.io/remsky/kokoro-fastapi-cpu:latest` | âŒ pull failed (Docker offline) |

## What you must do (one-time)

### Step 1 â€” Start Docker Desktop

Open Docker Desktop from the Start menu. Wait for the whale icon to stop animating in the system tray.

Verify:
```powershell
docker info
```
You should see a `Server:` section, not just `Client:`.

### Step 2 â€” Pull the Kokoro-FastAPI image

```powershell
docker pull ghcr.io/remsky/kokoro-fastapi-cpu:latest
```
This is a multi-GB download. First pull only.

### Step 3 â€” Run the container

```powershell
docker run -d --name kokoro-fastapi -p 8880:8880 --restart unless-stopped ghcr.io/remsky/kokoro-fastapi-cpu:latest
```

Verify it is listening:
```powershell
docker ps
curl http://localhost:8880/v1/audio/voices
```
You should get back a JSON array of voice IDs.

### Step 4 â€” Test the test phrase

```powershell
curl.exe -X POST http://localhost:8880/v1/audio/speech `
  -H "Content-Type: application/json" `
  -d '{"input":"Claude text-to-speech is working with free local Kokoro.","voice":"af_bella","response_format":"mp3"}' `
  -o test.mp3
Start-Process test.mp3
```

If you hear the phrase, the engine is working.

### Step 5 â€” Start agent-tts

```powershell
agent-tts
```
Then open http://localhost:3456 â€” the dashboard shows agent activity. Leave it running while you use Claude Code; it will pick up `~/.claude/projects/**/*.jsonl` and speak assistant turns through Kokoro.

To stop: Ctrl+C.

## Configuration files (already written)

### `~/.config/agent-tts/config.js`
- Profile: `claude-code-kokoro`
- Watches: `~/.claude/projects/**/*.jsonl`
- Provider: Kokoro at `http://localhost:8880/v1`
- Voice: `af_bella` (clear US English female; change to `am_michael`, `bf_emma`, `bm_george`, `af_heart`, etc. â€” full list via `GET /v1/audio/voices`)
- Speed: 1.0
- Format: mp3

### `Brain/settings/sound/.gitignore`
Excludes `*.mp3 *.wav node_modules .venv` etc. â€” never commit audio output or caches.

## Daily use â€” example prompts to Claude

> "Read your last response aloud."
> "Speak the summary of the task using Kokoro."
> "Generate a short voice notification when this finishes."

When agent-tts is running, Claude Code's assistant turns are read aloud automatically as they appear in the transcript file.

## Troubleshooting

### Failed to load configuration / agent-tts won't start
Confirm `~/.config/agent-tts/config.js` exists and has no syntax errors:
```powershell
node ~/.config/agent-tts/config.js
```
(should print nothing and exit 0)

### "Cannot connect to the Docker daemon" / `docker info` shows only Client
Start **Docker Desktop**. Wait until the whale tray icon is steady. Then retry.

### `curl ... /v1/audio/voices` hangs or returns connection refused
The container isn't running. Check:
```powershell
docker ps
docker logs kokoro-fastapi
```
If it says model is loading, wait 30â€“60s after first start.

### No sound from the test mp3
- Confirm the file is non-zero: `Get-Item test.mp3 | Select-Object Length`
- Try a different player (VLC, Windows Media Player)
- Check Windows default audio device

### "Kokoro not found" in agent-tts logs
agent-tts expects a server at `http://localhost:8880/v1`. Make sure the Kokoro-FastAPI container is running and the port is mapped. `docker ps` should show `0.0.0.0:8880->8880/tcp`.

### espeak-ng missing (only relevant for non-Docker path)
The Docker image bundles a fallback. If you skip Docker and run Kokoro natively, install espeak-ng:
1. Download `.msi` from https://github.com/espeak-ng/espeak-ng/releases
2. Run installer
3. Add `C:\Program Files\eSpeak NG\` to PATH
4. Verify: `espeak-ng --version`

### Node/npm issues
- agent-tts requires Node â‰¥ 18. We have v20.19.5 âœ…
- If `agent-tts` is not on PATH: `npm config get prefix` should match an entry in your PATH

### Windows path issues
- agent-tts config uses `os.homedir()` + `path.join` â€” already cross-platform
- Don't manually paste Windows paths with `\` into JS strings; let the config.js do it

### Claude Code transcripts not being picked up
- Confirm the watch path matches your Claude Code projects dir: `~/.claude/projects/`
- The parser type is `claude-code` â€” keep this; do not change to `claude-desktop`
- Open the agent-tts dashboard at http://localhost:3456 to see live activity

## Non-Docker fallback (advanced â€” only if Docker is not an option)

Kokoro-FastAPI can be run directly via Python, but Python 3.14 (your current) is too new for PyTorch wheels. You would need:
1. Install Python 3.11 or 3.12 alongside 3.14
2. Install [UV](https://github.com/astral-sh/uv): `pip install uv`
3. Clone Kokoro-FastAPI: `git clone https://github.com/remsky/Kokoro-FastAPI`
4. Run `.\start-cpu.ps1` from inside the repo
5. Install espeak-ng MSI (see Troubleshooting above)

The Docker path is strongly preferred on Windows â€” it bundles all native deps and avoids Python version churn.

## Removing the obsolete ElevenLabs install

The earlier ElevenLabs setup left a built MCP bundle on disk at `Brain/settings/sound/elevenlabs-mcp-player/`. It is **not used** by this free-local setup â€” you can safely delete it:

```powershell
Remove-Item -Recurse -Force C:\falcon\Brain\settings\sound\elevenlabs-mcp-player
```

The MCP server entry has already been removed from `claude_desktop_config.json`.

## Voices reference

Common English voices Kokoro-FastAPI exposes:
- `af_bella` â€” US English female
- `af_heart` â€” US English female (warmer)
- `af_sky` â€” US English female
- `am_michael` â€” US English male
- `bf_emma` â€” UK English female
- `bm_george` â€” UK English male

Full live list: `curl http://localhost:8880/v1/audio/voices`

To change the default in agent-tts: edit `~/.config/agent-tts/config.js` â†’ `ttsService.voiceId`, restart `agent-tts`.

## Speed / format / response

In `~/.config/agent-tts/config.js`:
- `options.speed: 0.8` (slower) â†’ `1.5` (faster)
- `options.responseFormat: 'mp3' | 'wav' | 'opus' | 'flac' | 'pcm'`
