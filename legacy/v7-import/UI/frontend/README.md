# Brain Control Plane UI

Wave 2 of 5 - frontend skeleton for the Brain control plane. Vite + React 18 + TypeScript + Tailwind + React Router + Zustand + TanStack Query.

> **Scope:** brand-new project at `C:\falcon\Brain\UI\frontend\`. Not connected to `falcon-web-platform-ui` or any existing Falcon repo.

## Prerequisites

- Node.js 18.18+ or 20.x
- npm 9+
- Wave 1 backend running on `http://localhost:8000` (FastAPI / Python)

## Setup

```bash
cd C:/falcon/Brain/UI/frontend
cp .env.example .env
npm install
```

Adjust `.env` only if backend is not on `localhost:8000`.

## Run

```bash
npm run dev          # frontend at http://localhost:5173
```

Vite proxies `/api/*` and `/ws/*` to the backend, so the dev URL stays clean and CORS is avoided in development.

To start the full stack locally, in two terminals:

```bash
# terminal 1 - backend (Wave 1)
cd C:/falcon/Brain/UI/backend
uvicorn app.main:app --reload --port 8000

# terminal 2 - frontend (Wave 2)
cd C:/falcon/Brain/UI/frontend
npm run dev
```

## Build

```bash
npm run build        # produces dist/
npm run preview      # serves dist/ for sanity check
```

## Test

```bash
npm test             # run vitest once
npm run test:smoke   # run smoke test only
```

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_API_BASE_URL` | `http://localhost:8000` | REST base URL |
| `VITE_WS_URL` | `ws://localhost:8000/ws` | WebSocket URL |

## Screen routing map

| Route | Screen | Wave |
|-------|--------|------|
| `/dashboard` | KPI tiles + activity feed | 3 |
| `/pipeline` | Task pipeline visualization | 3 |
| `/agents` | Agent roster + run history | 3 |
| `/skills` | Skill catalog + triggers | 4 |
| `/chat` | Conversational control plane | 4 |
| `/voice` | Voice alert library + player | 4 |
| `/knowledge` | Knowledge graph + Mermaid | 5 |
| `/gaps` | Gap tracker by severity | 5 |
| `/tests` | Gherkin browser + PRD links | 5 |
| `/settings` | Token + theme | 2 (this wave) |

`/` redirects to `/dashboard`; unknown routes redirect to `/dashboard`.

## Architecture

```
src/
  api/         axios client, react-query hooks, WS hook, types
  components/
    layout/    AppShell, Sidebar, Header, Footer
    ui/        Card, StatTile, Badge, ProgressBar, Table, Tabs, Drawer, EmptyState, Spinner, Toast
    mermaid/   Mermaid renderer
    voice/     VoicePlayer
  lib/         formatters, classnames
  screens/     10 screens (9 stubs + Settings wired)
  store/       Zustand: appStore (theme, sidebar, token), liveStore (WS events ring buffer)
  test/        vitest setup + smoke test
```

Layout uses Tailwind CSS Grid (`grid grid-cols-[240px_1fr] grid-rows-[56px_1fr_24px]`) per Falcon's grid-first convention; flexbox is reserved for small inline alignment only.

## Conventions

- Banner-format comments only (`*** ... ***`), no JSDoc.
- All routes lazy-load via `React.lazy` and `<Suspense>`.
- Auth: bearer token from Zustand; if unset, requests still go through (Wave 1 backend is dev-mode allow-all).
- Theme: dark default; toggle persisted via Zustand `persist`.
- WebSocket auto-reconnects with exponential backoff (500 ms -> 30 s).

## Wave plan

- Wave 1 - backend (FastAPI, Pydantic models)
- **Wave 2 - this skeleton (shell, routing, providers, contracts)**
- Wave 3 - Dashboard / Pipeline / Agents
- Wave 4 - Skills / Chat / Voice
- Wave 5 - Knowledge / Gaps / Tests
