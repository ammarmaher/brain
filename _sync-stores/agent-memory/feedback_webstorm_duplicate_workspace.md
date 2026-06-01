---
name: Canonical Falcon frontend repo
description: ABSOLUTE RULE — the Falcon web platform repo is C:\Falcon\Falcon\falcon-web-platform-ui (the git working copy). Never use the WebstormProjects copy.
type: feedback
originSessionId: 672a7f5f-279e-40a9-b376-86795518823a
---
**The Falcon web platform repo is `C:\Falcon\Falcon\falcon-web-platform-ui`. Always. This is the default.**

User confirmed this directly on 2026-05-19. Verified empirically: `C:\Falcon\Falcon\falcon-web-platform-ui\.git` exists and is the live git working copy (remote: Azure DevOps `t2development/Falcon/falcon-web-platform-ui`). The path `C:\Falcon\falcon-web-platform-ui` is **not** a git repo.

> CORRECTION: an earlier note (2026-05-13) named `C:\Falcon\falcon-web-platform-ui` as canonical. That was stale — the active git working copy is the nested `C:\Falcon\Falcon\falcon-web-platform-ui`. The user's 2026-05-19 statement supersedes it.

A duplicate also exists at `C:\Users\User\WebstormProjects\falcon-web-platform-ui` (WebStorm default workspace). It is NOT the project — never edit, read, sync to, or run from it.

**How to apply:**
- Every edit, read, build, dev-serve, PR review, and verification runs against `C:\Falcon\Falcon\falcon-web-platform-ui` ONLY.
- Do NOT sync to or run from `C:\Users\User\WebstormProjects\falcon-web-platform-ui` or `C:\Falcon\falcon-web-platform-ui`.
- If a build error path contains `WebstormProjects`, the answer is "stale workspace — run from `C:\Falcon\Falcon\falcon-web-platform-ui`", not "let me sync files".
- Preview / `.claude/launch.json` automation targets `C:\Falcon\Falcon\falcon-web-platform-ui`.
- This repo ships `primeng@^20.4.0` and uses Angular Nx `libs/falcon/src/shared-ui` — PrimeNG is a sanctioned dependency here. The "no PrimeNG" rule belongs to a different (v2) workspace and does NOT apply to this repo.
