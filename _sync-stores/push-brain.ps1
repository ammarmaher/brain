# push-brain.ps1
# Refresh this repo FROM the live brain stores on the primary laptop, then commit & push.
# Additive only (robocopy /E /XO, never /MIR or /PURGE). Never force-pushes.
$ErrorActionPreference = "Stop"
$here   = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo   = Split-Path -Parent $here
$memory = Join-Path $env:USERPROFILE ".claude\projects\C--Falcon\memory"

Write-Host "== Refreshing repo from live stores (additive) =="
# Brain Outputs -> outputs/  (skip the big worktrees + reports trees)
robocopy "C:\Falcon\Brain Outputs" "$repo\outputs" /E /XO /XD .git node_modules dist bin obj worktrees reports /XF *.gz /NFL /NDL /NP /NJH /R:1 /W:1 | Out-Null
Write-Host ("  outputs        exit={0}" -f $LASTEXITCODE)
robocopy "C:\Falcon\Brain"           "$repo\_sync-stores\Brain"           /E /XD .git node_modules .venv __pycache__ .cache worktrees .obsidian /XF *.gz *.zip /NFL /NDL /NP /NJH /R:1 /W:1 | Out-Null
Write-Host ("  Brain          exit={0}" -f $LASTEXITCODE)
robocopy "C:\Falcon\universal-brain" "$repo\_sync-stores\universal-brain" /E /XD .git node_modules .venv __pycache__ .cache worktrees /XF *.gz *.zip /NFL /NDL /NP /NJH /R:1 /W:1 | Out-Null
Write-Host ("  universal-brain exit={0}" -f $LASTEXITCODE)
robocopy $memory                     "$repo\_sync-stores\agent-memory"    /E /XD .git node_modules .venv __pycache__ .cache /XF *.gz *.zip /NFL /NDL /NP /NJH /R:1 /W:1 | Out-Null
Write-Host ("  agent-memory   exit={0}" -f $LASTEXITCODE)
robocopy "C:\Falcon\brain-skills"    "$repo\_sync-stores\brain-skills"    /E /XD .git node_modules .venv __pycache__ .cache /NFL /NDL /NP /NJH /R:1 /W:1 | Out-Null
Write-Host ("  brain-skills   exit={0}" -f $LASTEXITCODE)

Write-Host "== Staging + commit + push =="
git -C $repo add .gitignore outputs _sync-stores RESTORE-ON-NEW-MACHINE.md
$ts = Get-Date -Format "yyyy-MM-dd HH:mm"
git -C $repo commit -m "chore(brain-sync): refresh brain stores snapshot ($ts)"
if ($LASTEXITCODE -eq 0) { git -C $repo push; Write-Host "Pushed." }
else { Write-Host "Nothing to commit - repo already up to date." }
