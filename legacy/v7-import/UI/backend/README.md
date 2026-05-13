# Falcon Brain UI Backend (Wave 1)

FastAPI backend exposing the Falcon Brain orchestrator state, agent runs, skills, voice, jobs, knowledge, gaps, tests, and reports — over REST and WebSocket.

This is **Wave 1 of 5**. Wave 1 = read-only views over `Brain/state`, `Brain/analysis`, `Brain/jobs`, `Brain/settings`, plus whitelisted control endpoints that delegate to the existing PowerShell scripts under `Brain/scripts/`.

## Setup

```powershell
cd C:\falcon\Brain\UI\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and edit if needed:

| Var | Default | Purpose |
|---|---|---|
| `BRAIN_ROOT` | `C:\falcon\Brain` | Root of the Brain folder. |
| `BRAIN_UI_PORT` | `8000` | HTTP port. |
| `BRAIN_UI_TOKEN` | _empty_ | If set, every API request must send `Authorization: Bearer <token>`. Empty = open dev mode. |
| `BRAIN_UI_ADMIN_TOKEN` | _empty_ | Required for `/api/admin/*` mutations. If both this and `BRAIN_UI_TOKEN` are unset, admin endpoints are open with a single startup WARNING. |
| `BRAIN_MEMORY_DIR` | `C:\Users\User\.claude\projects\C--falcon\memory` | Feedback memory directory used by `/api/admin/memory`. |
| `KOKORO_BASE_URL` | `http://localhost:8880/v1` | Used for the health check + voice regenerate. |
| `BRAIN_UI_AUDIT_LOG` | _empty_ | Override path for `audit.log`. Default = `<backend>/audit.log` next to `app/`. |

## Run

```powershell
.\run.ps1            # Windows
./run.sh             # bash
```

Or manually: `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`.

## Test

```powershell
pytest tests/
```

## Endpoints

All examples assume `BRAIN_UI_TOKEN` is empty (dev mode). If set, prepend `-H "Authorization: Bearer <token>"` to every curl.

### Health
```
curl http://localhost:8000/api/health
```

### Tasks
```
curl http://localhost:8000/api/tasks
curl http://localhost:8000/api/tasks/TASK-20260501-001
curl http://localhost:8000/api/tasks/TASK-20260501-001/state
curl http://localhost:8000/api/tasks/TASK-20260501-001/progress
curl http://localhost:8000/api/tasks/TASK-20260501-001/plan/L1
```

### Orchestrator (POST -> orchestrator.ps1)
```
curl -X POST http://localhost:8000/api/orchestrator/event \
  -H "Content-Type: application/json" \
  -d '{"taskId":"TASK-20260501-001","event":"approve-l1"}'
```

### Plan gate (POST -> plan-gate.ps1)
```
curl -X POST http://localhost:8000/api/plan-gate \
  -H "Content-Type: application/json" \
  -d '{"taskId":"TASK-20260501-001","layer":"L1","action":"approve"}'
```

### Agents
```
curl http://localhost:8000/api/agents
curl -X POST http://localhost:8000/api/agents/TASK-20260501-001:planner/stop
```

### Skills
```
curl http://localhost:8000/api/skills
curl http://localhost:8000/api/skills/<name>/md     # *** Wave 1.6: raw Skill.md body, text/markdown ***
```

### Jobs
```
curl http://localhost:8000/api/jobs
curl http://localhost:8000/api/jobs/analysis-output-structure
curl -X POST http://localhost:8000/api/jobs/analysis-output-structure/run \
  -H "Content-Type: application/json" -d '{"target":"DONE"}'
```

### Voice
```
curl http://localhost:8000/api/voice/alerts            # *** Wave 1.6: flat array — see shape below ***
curl http://localhost:8000/api/voice/mindsets
curl http://localhost:8000/api/voice/settings
curl http://localhost:8000/api/voice/claims
curl -OJ http://localhost:8000/api/voice/alerts/chatgpt/processing/01
curl -X POST http://localhost:8000/api/voice/play \
  -H "Content-Type: application/json" \
  -d '{"mindset":"chatgpt","category":"processing","state":"running"}'
```

`/api/voice/alerts` response (Wave 1.6 — pinned shape):
```json
[
  {"mindset":"chatgpt","category":"processing","index":"01",
   "text":"Commander, planning operation still active.",
   "claims":[],"mp3Url":"/api/voice/alerts/chatgpt/processing/01"}
]
```

### Chat (proxies to ask-chatgpt.ps1 / ask-gemini.ps1; claude returns 501)
```
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"mindset":"chatgpt","prompt":"summarize todays gaps"}'
```

### Knowledge
```
curl http://localhost:8000/api/knowledge/modules
curl http://localhost:8000/api/knowledge/modules/<slug>
curl http://localhost:8000/api/knowledge/files
curl http://localhost:8000/api/knowledge/index
```

### Gaps
```
curl http://localhost:8000/api/gaps
curl http://localhost:8000/api/gaps/GAP-CC-002
```

### Tests
```
curl http://localhost:8000/api/tests
curl http://localhost:8000/api/tests/<module>/<tcId>
```

### Reports
```
curl -OJ http://localhost:8000/api/reports/master.xlsx
curl -OJ http://localhost:8000/api/reports/master.docx

# *** Wave 1.6: per-module rollups (5 module slugs whitelisted) ***
# *** Resolves Brain/analysis/L0-summary/per-module/<slug>-rollup-20260501.<ext>. ***
# *** 404 returns { error: "report not generated", expectedAt: "<path>" }. ***
curl -OJ http://localhost:8000/api/reports/contact-group.xlsx
curl -OJ http://localhost:8000/api/reports/account-management.docx
```

## Admin endpoints (Wave 1.5)

All admin mutations are atomic (write `.tmp` then `os.replace`), every mutation appends one JSON line to `audit.log` (default location next to `app/`; override via `BRAIN_UI_AUDIT_LOG`), and deletes are SOFT — original is archived under `_archive/<stem>-<timestamp><ext>` before removal.

Auth: requires `Authorization: Bearer <BRAIN_UI_ADMIN_TOKEN>` (or `BRAIN_UI_TOKEN`) when configured. If both unset, admin runs OPEN with a startup WARNING.

### Admin Jobs (`/api/admin/jobs`)
```
curl http://localhost:8000/api/admin/jobs

curl -X POST http://localhost:8000/api/admin/jobs \
  -H "Content-Type: application/json" \
  -d '{"slug":"my-job","title":"My Job","statusLine":"PENDING","body":"task body"}'

curl -X PUT http://localhost:8000/api/admin/jobs/my-job \
  -H "Content-Type: application/json" \
  -d '{"statusLine":"DONE"}'

curl -X DELETE http://localhost:8000/api/admin/jobs/my-job
```

### Admin Skills + Mindsets (`/api/admin/{skills,mindsets}`)
Operate on the `skills` / `mindsets` blocks of `Brain/settings/sound/settings.json`. Atomic update + `apply-settings.ps1` post-hook (no-op if script absent).
```
curl http://localhost:8000/api/admin/skills

curl -X PUT http://localhost:8000/api/admin/skills/prd-knowledge \
  -H "Content-Type: application/json" \
  -d '{"voice":"bm_george","speed":1.0,"volumeMultiplier":8.0,"phrases":{"running":"running"},"triggers":[],"beep":[[660,200]]}'

curl -X POST http://localhost:8000/api/admin/skills \
  -H "Content-Type: application/json" \
  -d '{"name":"my-new-skill","voice":"bm_george","speed":1.0,"volumeMultiplier":8.0,"phrases":{},"triggers":[],"beep":[]}'

curl -X DELETE http://localhost:8000/api/admin/skills/my-new-skill
```

### Admin Voice (`/api/admin/voice`)
Edit phrase text + claims; trigger a Kokoro regenerate of a single mp3; restart the agent-tts daemon.
```
curl http://localhost:8000/api/admin/voice/phrases

curl -X PUT http://localhost:8000/api/admin/voice/phrases/chatgpt/processing/02 \
  -H "Content-Type: application/json" \
  -d '{"text":"new phrase text","claims":["tested"]}'

curl -X POST http://localhost:8000/api/admin/voice/regenerate/chatgpt/processing/02

# *** Wave 1.6: restart agent-tts node daemon via whitelisted helper. ***
# *** Returns { stopped: <pids>, started: <pid>, logPath, errPath, rc }. ***
curl -X POST http://localhost:8000/api/admin/voice/restart-daemon
```

### Admin Memory (`/api/admin/memory`)
Edits feedback notes under `BRAIN_MEMORY_DIR`. Special path `/_index` updates `MEMORY.md`.
```
curl http://localhost:8000/api/admin/memory
curl http://localhost:8000/api/admin/memory/feedback_demo.md

curl -X POST http://localhost:8000/api/admin/memory \
  -H "Content-Type: application/json" \
  -d '{"filename":"feedback_demo.md","frontmatter":{"name":"demo","type":"feedback"},"content":"body"}'

curl -X PUT http://localhost:8000/api/admin/memory/feedback_demo.md \
  -H "Content-Type: application/json" \
  -d '{"content":"new body"}'

curl -X DELETE http://localhost:8000/api/admin/memory/feedback_demo.md

curl -X PUT http://localhost:8000/api/admin/memory/_index \
  -H "Content-Type: application/json" \
  -d '{"content":"# Index\n\n- ..."}'
```

### Admin Knowledge (`/api/admin/knowledge`)
Read/write any L0-summary, L1-abstraction, L2-business, L3-technical, raw, or tables file. Edit auto-creates a backup at `Brain/analysis/_history/<file>-<ts>.md` and appends a `manual-edit` run entry to `Brain/analysis/index.json`.
```
curl http://localhost:8000/api/admin/knowledge/<module>/L1-abstraction/<file>.md

curl -X PUT http://localhost:8000/api/admin/knowledge/<module>/L2-business/<file>.md \
  -H "Content-Type: application/json" \
  -d '{"content":"# Title\n\nbody"}'

# *** Wave 1.6: per-layer history (Brain/analysis/<layer>/_history/), ***
# *** filtered to filenames starting with "<module>-". ***
curl http://localhost:8000/api/admin/knowledge/<module>/L2-business/history
curl http://localhost:8000/api/admin/knowledge/<module>/L2-business/history/<module>-l2-20260501.md
```

### Admin Gaps (`/api/admin/gaps`)
Schema-validated against `Brain/analysis/schemas/gap-report.schema.json`. Each module's gaps live in `<module>/<module>-gaps.json` (auto-mirrored to `<module>-gaps.md`). Soft-delete sets `status: archived`.
```
curl -X POST http://localhost:8000/api/admin/gaps/contact-group \
  -H "Content-Type: application/json" \
  -d '{"id":"GAP-CG-099","severity":"medium","category":"missing-edge-case","description":"..."}'

curl -X PUT http://localhost:8000/api/admin/gaps/contact-group/GAP-CG-099 \
  -H "Content-Type: application/json" \
  -d '{"severity":"high"}'

curl -X DELETE http://localhost:8000/api/admin/gaps/contact-group/GAP-CG-099
```

### Admin Tests (`/api/admin/tests`)
Append/replace a Gherkin Scenario block in `<module>/test-cases.md` and mirror to `<module>-test-matrix.csv`. tcId pattern `^TC-[A-Z]{2,4}-\d{3}$`. Soft-delete via `<!-- # Archived: <date> -->` comment.
```
curl -X POST http://localhost:8000/api/admin/tests/contact-group \
  -H "Content-Type: application/json" \
  -d '{"tcId":"TC-CG-101","title":"create contact","category":"happy_path","priority":"P1","given":"...","when":"...","then":"...","tracesTo":["PRD-CG-3.2"],"claims":[]}'

curl -X PUT http://localhost:8000/api/admin/tests/contact-group/TC-CG-101 \
  -H "Content-Type: application/json" \
  -d '{"tcId":"TC-CG-101","title":"...","category":"happy_path","priority":"P0","given":"...","when":"...","then":"...","tracesTo":["PRD-CG-3.2"]}'

curl -X DELETE http://localhost:8000/api/admin/tests/contact-group/TC-CG-101
```

### Admin Agents (`/api/admin/agents`)
Records spawn requests to `Brain/state/_agent_requests/<id>.json` with status `queued`. Orchestrator session reads the directory; backend cannot dispatch the Task tool itself.
```
curl -X POST http://localhost:8000/api/admin/agents/spawn \
  -H "Content-Type: application/json" \
  -d '{"type":"general-purpose","description":"refactor X","prompt":"...","runInBackground":false}'

curl http://localhost:8000/api/admin/agents/spawn/<id>

# *** Wave 1.6: tail of audit.log filtered to agent.* actions (default limit 20, max 100). ***
curl 'http://localhost:8000/api/admin/agents/audit?limit=20'
```

### Admin Settings (`/api/admin/settings`)
Full `settings.json` round-trip (sensitive keys stripped on GET). PUT validates shape and triggers `apply-settings.ps1`.
```
curl http://localhost:8000/api/admin/settings/full

curl -X PUT http://localhost:8000/api/admin/settings/full \
  -H "Content-Type: application/json" \
  -d '{"settingsJson":{"global":{...},"skills":{...},"mindsets":{...}}}'

curl -X POST http://localhost:8000/api/admin/settings/apply
```

## WebSocket

Endpoint: `ws://localhost:8000/ws`

Server pushes events of shape:
```json
{ "type": "task.state.changed", "source": "<file path>", "payload": {"path": "..."}, "timestamp": 1714512345.6 }
```

Client may filter by sending:
```json
{ "action": "subscribe", "filters": ["task.*", "agent.*"] }
```

Event types emitted in Wave 1:

| Type | Trigger |
|---|---|
| `task.state.changed` | `Brain/state/<task>/task-state.json` modified |
| `task.progress.changed` | `Brain/state/<task>/progress.json` modified |
| `task.plan.changed` | `Brain/state/<task>/plan-l*.md` modified |
| `agent.started` | reserved (emitted by future agent shim) |
| `agent.completed` | `Brain/state/<task>/agent-*` files |
| `agent.failed` | reserved |
| `voice.played` | reserved (POST /api/voice/play will emit in Wave 2) |
| `job.status.changed` | `Brain/jobs/*.md` modified |
| `gap.added` | reserved |
| `analysis.run.appended` | any new file under `Brain/analysis/` |
| `job.crud.changed` | admin job create/update/delete |
| `skills.crud.changed` | admin skill create/update/delete |
| `mindsets.crud.changed` | admin mindset create/update/delete |
| `voice.phrase.updated` | admin phrase text/claims edit |
| `voice.regenerated` | admin Kokoro regenerate complete |
| `memory.changed` | admin memory create/update/delete |
| `knowledge.edited` | admin knowledge file write |
| `gap.added` / `gap.updated` / `gap.archived` | admin gap mutation |
| `test.crud.changed` | admin test scenario create/update/archive |
| `agent.spawn.requested` | admin agent spawn queued |
| `settings.changed` / `settings.applied` | full settings update / apply trigger |

A heartbeat ping/pong is supported: client sends `{"action":"ping"}`, server replies `{"type":"system.pong"}`.

## Security guardrails (Wave 1)

- Bearer token auth (env-driven, dev-mode default).
- CORS limited to `http://localhost:5173` and `http://localhost:8000`.
- All write operations go through `services/ps_runner.py`, which whitelists script names; only the 11 scripts listed there can ever execute.
- All script arguments are validated by `is_safe_arg()` (rejects shell metacharacters and path traversal).
- All path inputs (task ids, module slugs, alert filenames, job names, gap ids) are sanitized — no `..`, no separators, alnum + `-_.` only.
- GET endpoints never write to `Brain/state`, `Brain/analysis`, or `Brain/jobs`.
- API responses never expose `keys.env` content.
- Voice settings response strips `apiKey`/`token` keys defensively.

## Layout

```
app/
  main.py            # *** factory + WS endpoint + lifespan watcher ***
  config.py          # *** pydantic-settings ***
  auth.py            # *** bearer token guard ***
  deps.py            # *** shared deps ***
  ws_manager.py      # *** ConnectionManager ***
  file_watcher.py    # *** watchdog (polling fallback) ***
  routers/           # *** 13 routers ***
  services/          # *** brain_state / brain_jobs / brain_analysis / voice_index / ps_runner ***
  models/            # *** pydantic models ***
tests/               # *** pytest ***
```
