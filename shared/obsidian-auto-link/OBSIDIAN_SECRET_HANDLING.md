# OBSIDIAN SECRET HANDLING — Brain SK Protocol

**Status:** Active
**Owner:** Brain SK governance
**Scope:** Every Obsidian vault under or near the Brain SK working tree
**Companion:** [`OBSIDIAN_AUTO_LINK_PROTOCOL.md`](./OBSIDIAN_AUTO_LINK_PROTOCOL.md), root [`.gitignore`](../../.gitignore), [`CLAUDE.md`](../../CLAUDE.md)

---

## 1. Purpose

Obsidian is the canonical authoring + browsing surface for Brain SK Markdown knowledge. Plugins like **Copilot / autopilot** are encouraged for local productivity — but their stored API keys, OAuth tokens, and plugin state must never reach Git, GitHub, or any artifact mirror.

This protocol defines the line between *Obsidian content* (commit-allowed) and *Obsidian plugin state* (local-only).

---

## 2. What is allowed in Git

| Item | Path pattern | Allowed? |
|---|---|---|
| Brain SK canonical Markdown index | `_obsidian/**/*.md` | YES |
| Brain SK protocol/governance Markdown | `shared/**/*.md`, `protocols/**/*.md`, root `*.md` | YES |
| Brain SK generated output mirrors | `outputs/**` (additive sync only) | YES |
| Templates with placeholder values only | `**/*.example.*`, `**/*.template.*`, `**/*.sample.*` | YES |

---

## 3. What is local-only (NEVER commit)

| Item | Path pattern |
|---|---|
| Secondary Obsidian staging vault | `Obsidian Vault/` |
| Any Obsidian plugin data file (auth tokens / API keys live here) | `**/.obsidian/plugins/*/data.json` |
| Plugin source maps | `**/.obsidian/plugins/*/main.js.map` |
| Plugin-local env files | `**/.obsidian/plugins/*/.env` |
| Workspace state (per-machine) | `**/.obsidian/workspace.json`, `**/.obsidian/workspace-mobile.json` |
| Plugin caches | `**/.obsidian/cache/**` |
| Any real-secret bag | `**/*.env`, `**/*.key`, `**/*.pem`, `*.secrets.json`, `**/*secret*`, `**/*password*`, `**/*token*` |

These patterns are enforced in the root [`.gitignore`](../../.gitignore). The negations in that file keep `*.md`, `*.example.*`, `*.template.*`, and `*.sample.*` re-included so this protocol note and other docs remain trackable.

---

## 4. Where API keys go

API keys for Obsidian plugins (Copilot / autopilot / any LLM bridge) MUST be supplied through one of:

1. The plugin's own settings UI inside Obsidian (writes to local `data.json`, which is gitignored).
2. A local environment variable (`$env:ANTHROPIC_API_KEY`, etc. — never written to a tracked file).
3. A local-only secrets file already covered by `.gitignore` (`config/local.secrets.json`).

API keys MUST NOT be:

- Pasted into any tracked Markdown file (knowledge notes, protocol docs, README, CLAUDE.md).
- Pasted into any tracked JSON / YAML / TOML config.
- Echoed in commit messages, agent reports, or chat transcripts that are persisted to disk.
- Read aloud, screenshotted, or mirrored into `outputs/`.

---

## 5. Brain SK agent rules

Every Brain SK agent (Claude, ChatGPT, Gemini, automated jobs) MUST:

1. **Never print, display, copy, or transcribe a real API key value** — even when asked to verify one. If asked, refuse and point the user to the local plugin UI.
2. **Never `git add` an Obsidian plugin `data.json`, `workspace.json`, plugin `.env`, or plugin source map**, regardless of the change diff.
3. **If a secret is detected locally**, report only the file path containing it. Recommend the user rotate the key manually and clear the local file via the plugin UI.
4. **If a secret appears to be in Git history**, STOP and surface the cleanup options (BFG Repo-Cleaner / `git filter-repo`) — do not rewrite history without explicit user approval.
5. **Autopilot/Copilot may run locally** with full plugin functionality — that is expected and supported. The boundary is the Git push, not the Obsidian feature.

---

## 6. Verification commands

Run these any time the Brain SK repo state is suspect:

```powershell
# Are any plugin data / workspace / vault files currently tracked?
git ls-files | Select-String "\.obsidian/|Obsidian Vault/|workspace\.json|plugins/.*/data\.json"

# Has any plugin data file ever been committed in history?
git log --all --full-history --oneline -- "**/.obsidian/plugins/*/data.json"
git log --all --full-history --oneline -- "Obsidian Vault/**"
```

A healthy result is: zero tracked plugin data files AND zero history entries for plugin data files. The canonical `_obsidian/*.md` indexes should still be tracked.

---

## 7. Incident response

If a secret IS found in a tracked file or in history:

1. **Rotate the leaked key first** (manually, via the issuing provider's dashboard).
2. **Untrack the live file** with `git rm --cached <path>` — leave the local file in place unless the user approves deletion.
3. **For history cleanup**: do not run `git filter-repo` or `git push --force` without explicit user approval. Present the safe options and wait.
4. **Document the incident** in `outputs/discovery/` with no secret values, only the path and timestamp.
