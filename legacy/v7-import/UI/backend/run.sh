#!/usr/bin/env bash
# *** Brain UI Backend launcher (bash) ***

set -euo pipefail
cd "$(dirname "$0")"

if [ ! -d ".venv" ]; then
    python -m venv .venv
fi

# shellcheck disable=SC1091
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt

PORT="${BRAIN_UI_PORT:-8000}"
uvicorn app.main:app --host 0.0.0.0 --port "$PORT" --reload
