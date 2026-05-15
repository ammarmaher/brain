*** Falcon Brain — Venom terminal palette ***
*** Companion to `_obsidian/.obsidian/snippets/venom-theme.css` ***

# 🖤 Falcon Brain — Venom Terminal

Match your `claude` terminal to the Obsidian Venom theme. Same Marvel-movie palette: symbiote-black canvas, deep purples, hot violet, electric magenta, tongue-red highlights.

## What's in this folder

| File | Use |
|---|---|
| [`falcon-brain-venom.json`](falcon-brain-venom.json) | Source-of-truth color scheme + 4 paste-ready install snippets |
| `README.md` (this file) | Quick install guide |

## Quick install — Windows Terminal (the `claude` launcher)

1. Open Windows Terminal → `Ctrl + ,` → **Open JSON file** (bottom-left).
2. From `falcon-brain-venom.json` → `windowsTerminalFragment.schemes_append` → copy the single scheme object.
3. Append it to the top-level `"schemes": [ ... ]` array.
4. In `"profiles" → "defaults"` merge in `windowsTerminalFragment.profiles_defaults_merge` (sets `colorScheme: "Falcon Brain — Venom"`, acrylic, padding, cursor).
5. Save. Windows Terminal hot-reloads — every profile (PowerShell, WSL, cmd, Git Bash) now wears Venom.

## Quick install — VS Code / Cursor / Windsurf integrated terminal

1. `Ctrl + Shift + P` → **Preferences: Open User Settings (JSON)**.
2. Copy `vscodeIntegratedTerminal.snippet` from `falcon-brain-venom.json` and merge it into your settings.
3. Reopen the integrated terminal.

## Optional — PowerShell prompt with Venom magenta ❯

```powershell
notepad $PROFILE
# paste powerShellPrompt.snippet, save, then:
. $PROFILE
```

## Optional — Oh My Posh

Save the `ohMyPoshTheme.snippet` block as `falcon-brain-venom.omp.json` anywhere, then:

```powershell
oh-my-posh init pwsh --config "C:\path\to\falcon-brain-venom.omp.json" | Invoke-Expression
```

## Palette reference (shared with the Obsidian theme)

| Role | Hex | Where it shows |
|---|---|---|
| Symbiote-black | `#0A0014` | Background / canvas |
| Symbiote-purple | `#1A0A2E` | ANSI black / panels |
| Venom-purple | `#4C1D95` | Selection / accents |
| Hot-violet | `#9333EA` | ANSI purple / path |
| Electric-magenta | `#D946EF` | Cursor / bright purple / ❯ prompt |
| Tongue-red | `#DC2626` | ANSI red / errors |
| Teeth-white / silver | `#E9D5FF` | Foreground text |

These are the **same hex values** used in `venom-theme.css` → so Obsidian, Windows Terminal, and the VS Code terminal all share one symbiote palette.

## Related

- `_obsidian/.obsidian/snippets/venom-theme.css` — Obsidian vault Venom theme
- `_obsidian/00-Home/Color Legend.md` — full color legend
- `_obsidian/.obsidian/snippets/falcon-vault.css` — functional palette (still required underneath)
