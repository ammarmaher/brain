# *** pytest conftest — adds project root to sys.path so `app.*` imports resolve ***

import os
import sys
from pathlib import Path

_HERE = Path(__file__).resolve().parent
_BACKEND = _HERE.parent
if str(_BACKEND) not in sys.path:
    sys.path.insert(0, str(_BACKEND))

# *** Ensure tests run in dev mode (no token) regardless of environment ***
os.environ.pop("BRAIN_UI_TOKEN", None)
