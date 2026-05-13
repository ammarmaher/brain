# *** push-approval.ps1 ***
# *** Phase J - voice-gated push prompt. Plays "Boss, I want to push the code, comrade. Confirm?" ***
# *** then 880Hz x 1500ms beep, reads yes/no, on yes writes a polished commit message + ***
# *** test-comment block to Brain\state\<task-id>\proposed-commit-message.txt. ***
# *** NEVER calls git commit. NEVER calls git push. PS 5.1 compatible. ***

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)] [string] $TaskId
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName presentationCore

# *** Paths ***
$BrainRoot      = Split-Path -Parent $PSScriptRoot
$StateRoot      = Join-Path $BrainRoot 'state'
$TaskFolder     = Join-Path $StateRoot $TaskId
$StateFile      = Join-Path $TaskFolder 'task-state.json'
$ProposedFile   = Join-Path $TaskFolder 'proposed-commit-message.txt'
$RejectionsLog  = Join-Path $TaskFolder 'push-rejections.log'
$GlobalCacheDir = Join-Path $BrainRoot 'settings\sound\voice-samples\global'
$PromptMp3      = Join-Path $GlobalCacheDir 'boss-i-want-to-push.mp3'

# *** Voice config (matches render-all-sequential.ps1 gemini profile) ***
$KokoroBase = 'http://localhost:8880/v1'
$Voice      = 'bm_v0george'
$Speed      = 0.78
$VolMul     = 4.0
$Phrase     = 'Boss, I want to push the code, comrade. Confirm?'

# *** Helpers ***
function Get-IsoTimestamp { (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ') }

function Render-PromptMp3 {
    param([string]$OutPath)
    if (-not (Test-Path $GlobalCacheDir)) {
        New-Item -ItemType Directory -Path $GlobalCacheDir -Force | Out-Null
    }
    $body = @{
        input             = $Phrase
        voice             = $Voice
        response_format   = 'mp3'
        speed             = $Speed
        volume_multiplier = $VolMul
    } | ConvertTo-Json -Compress
    try {
        Invoke-RestMethod -Uri "$KokoroBase/audio/speech" -Method Post -ContentType 'application/json' -Body $body -OutFile $OutPath -TimeoutSec 60
        return $true
    }
    catch {
        Write-Host "[push-approval] Kokoro unreachable ($($_.Exception.Message))."
        Write-Host "[push-approval] Voice fallback (text): $Phrase"
        return $false
    }
}

function Play-Mp3 {
    param([string]$File, [double]$WaitSec = 3.5, [double]$Vol = 1.0)
    $p = New-Object System.Windows.Media.MediaPlayer
    $p.Volume = $Vol
    $p.Open([System.Uri]::new($File))
    Start-Sleep -Milliseconds 350
    $p.Play()
    Start-Sleep -Seconds $WaitSec
    $p.Stop()
    $p.Close()
}

function Get-StringField {
    param($Obj, [string]$Name, [string]$Default = '')
    if ($null -eq $Obj) { return $Default }
    if (-not ($Obj.PSObject.Properties.Name -contains $Name)) { return $Default }
    $v = $Obj.$Name
    if ($null -eq $v) { return $Default }
    return [string]$v
}

function Get-ArrayField {
    param($Obj, [string]$Name)
    if ($null -eq $Obj) { return @() }
    if (-not ($Obj.PSObject.Properties.Name -contains $Name)) { return @() }
    $v = $Obj.$Name
    if ($null -eq $v) { return @() }
    return @($v)
}

function Read-BulletLines {
    param([string]$Path)
    if ([string]::IsNullOrWhiteSpace($Path)) { return @() }
    if (-not (Test-Path -LiteralPath $Path)) { return @() }
    $lines = Get-Content -LiteralPath $Path -ErrorAction SilentlyContinue
    if (-not $lines) { return @() }
    $bullets = @()
    foreach ($ln in $lines) {
        $t = $ln.Trim()
        if ($t -match '^[-*]\s+(.+)$') { $bullets += $Matches[1].Trim() }
        elseif ($t -match '^\d+\.\s+(.+)$') { $bullets += $Matches[1].Trim() }
    }
    return $bullets
}

function Get-TypeFromTitle {
    param([string]$Title)
    if ([string]::IsNullOrWhiteSpace($Title)) { return 'chore' }
    $first = ($Title.Trim().Split(' ', 2))[0].ToLower()
    switch ($first) {
        'fix'      { return 'fix' }
        'fixes'    { return 'fix' }
        'fixed'    { return 'fix' }
        'bug'      { return 'fix' }
        'add'      { return 'feat' }
        'adds'     { return 'feat' }
        'added'    { return 'feat' }
        'feat'     { return 'feat' }
        'feature'  { return 'feat' }
        'implement'{ return 'feat' }
        'refactor' { return 'refactor' }
        'rename'   { return 'refactor' }
        'cleanup'  { return 'refactor' }
        'test'     { return 'test' }
        'tests'    { return 'test' }
        'doc'      { return 'docs' }
        'docs'     { return 'docs' }
        default    { return 'chore' }
    }
}

function Get-Subject {
    param([string]$Title)
    if ([string]::IsNullOrWhiteSpace($Title)) { return 'update' }
    $s = $Title.Trim()
    if ($s.Length -gt 72) { $s = $s.Substring(0, 72) }
    return $s
}

function Build-CommitMessage {
    param($State)

    $title    = Get-StringField -Obj $State -Name 'title' -Default ''
    $type     = Get-TypeFromTitle -Title $title
    $scope    = ([string]$TaskId).ToLower()
    $subject  = Get-Subject -Title $title

    $artifacts = $null
    if ($State.PSObject.Properties.Name -contains 'artifacts') { $artifacts = $State.artifacts }

    $files          = Get-ArrayField -Obj $artifacts -Name 'codeChanges'
    $scenariosPath  = Get-StringField -Obj $artifacts -Name 'scenariosPath'
    $qaReportPath   = Get-StringField -Obj $artifacts -Name 'qaReportPath'

    $notes = Get-ArrayField -Obj $State -Name 'notes'
    $bodySummary = ''
    foreach ($n in $notes) {
        $t = ([string]$n).Trim()
        if ($t.Length -gt 0) { $bodySummary = $t; break }
    }
    if ($bodySummary.Length -gt 200) { $bodySummary = $bodySummary.Substring(0, 200).TrimEnd() + '...' }

    # *** Test bullets per mindset ***
    $claudeTests  = @()
    foreach ($n in $notes) {
        $t = ([string]$n).Trim()
        if ($t -match '^claude-test:\s*(.+)$') { $claudeTests += $Matches[1].Trim() }
    }
    $chatgptTests = Read-BulletLines -Path $scenariosPath
    $geminiTests  = Read-BulletLines -Path $qaReportPath

    # *** Compose ***
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.AppendLine("$type($scope): $subject")
    [void]$sb.AppendLine('')
    if ($bodySummary.Length -gt 0) {
        [void]$sb.AppendLine($bodySummary)
        [void]$sb.AppendLine('')
    }
    if ($files.Count -gt 0) {
        [void]$sb.AppendLine('Files changed:')
        foreach ($f in $files) {
            $fs = ([string]$f).Trim()
            if ($fs.Length -gt 0) { [void]$sb.AppendLine("- $fs") }
        }
        [void]$sb.AppendLine('')
    }
    if ($claudeTests.Count -gt 0) {
        [void]$sb.AppendLine('# Tests authored by Claude:')
        foreach ($b in $claudeTests) { [void]$sb.AppendLine("# - $b") }
        [void]$sb.AppendLine('')
    }
    if ($chatgptTests.Count -gt 0) {
        [void]$sb.AppendLine('# Tests authored by ChatGPT:')
        foreach ($b in $chatgptTests) { [void]$sb.AppendLine("# - $b") }
        [void]$sb.AppendLine('')
    }
    if ($geminiTests.Count -gt 0) {
        [void]$sb.AppendLine('# Tests authored by Gemini:')
        foreach ($b in $geminiTests) { [void]$sb.AppendLine("# - $b") }
        [void]$sb.AppendLine('')
    }

    $coAuthors = @()
    if ($chatgptTests.Count -gt 0) { $coAuthors += 'Co-authored-by: ChatGPT (mindset) <noreply@openai.com>' }
    if ($geminiTests.Count  -gt 0) { $coAuthors += 'Co-authored-by: Gemini (mindset) <noreply@google.com>' }
    if ($coAuthors.Count -gt 0) {
        foreach ($c in $coAuthors) { [void]$sb.AppendLine($c) }
    }

    return $sb.ToString().TrimEnd() + "`n"
}

# *** Validate state file ***
if (-not (Test-Path -LiteralPath $TaskFolder)) {
    throw "Task folder not found: $TaskFolder (orchestrator must bootstrap the task first)."
}
if (-not (Test-Path -LiteralPath $StateFile)) {
    throw "task-state.json not found at: $StateFile"
}

$state = Get-Content -Raw -LiteralPath $StateFile | ConvertFrom-Json

# *** Step 1: render or reuse cached mp3 ***
$mp3Ready = Test-Path -LiteralPath $PromptMp3
if (-not $mp3Ready) {
    Write-Host "[push-approval] caching prompt mp3 -> $PromptMp3"
    $mp3Ready = Render-PromptMp3 -OutPath $PromptMp3
}

# *** Step 2: play mp3 (or text fallback) ***
if ($mp3Ready -and (Test-Path -LiteralPath $PromptMp3)) {
    try { Play-Mp3 -File $PromptMp3 -WaitSec 3.5 -Vol 1.0 }
    catch { Write-Host "[push-approval] mp3 playback error: $($_.Exception.Message)" }
}
else {
    Write-Host "[push-approval] (text prompt) $Phrase"
}

# *** Step 3: 880Hz x 1500ms beep ***
[Console]::Beep(880, 1500)

# *** Step 4: Read-Host yes/no ***
$answer = Read-Host 'Push approved? (yes/no)'
$norm = ''
if ($null -ne $answer) { $norm = ([string]$answer).Trim().ToLower() }

# *** Step 5: branch ***
if ($norm -eq 'yes' -or $norm -eq 'y') {
    $msg = Build-CommitMessage -State $state
    Set-Content -LiteralPath $ProposedFile -Value $msg -Encoding UTF8 -NoNewline
    Write-Host ''
    Write-Host '----- proposed commit message -----'
    Write-Host $msg
    Write-Host '-----------------------------------'
    Write-Host ''
    Write-Host "Commit message ready at $ProposedFile. Copy and run: git commit -F `"$ProposedFile`""
    exit 0
}
else {
    $line = '{0}  answer="{1}"' -f (Get-IsoTimestamp), ($answer -replace '[\r\n]', ' ')
    Add-Content -LiteralPath $RejectionsLog -Value $line -Encoding UTF8
    Write-Host "[push-approval] push declined. Logged to $RejectionsLog"
    exit 0
}
