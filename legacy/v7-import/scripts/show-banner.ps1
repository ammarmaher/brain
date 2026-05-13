# *** Brain banner + skill self-check — Claude Code SessionStart ***
# *** Falcon Brain v1.0 — Powered by Ammar SK ***

$OutputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)

$root = "C:\falcon"

# *** Skill registry — file paths checked at runtime ***
$skillFiles = [ordered]@{
    "master-orchestrator"      = "$root\Brain\skills\00-master-orchestrator\SKILL.md"
    "brain"                    = "$root\Brain\Skill.md"
    "sound-announcer"          = "$root\Brain\skills\50-sound-announcer\SKILL.md"
    "chatgpt-strategic"        = "$root\Brain\brand-skills\chatgpt-strategic-commander\SKILL.md"
    "claude-tactical"          = "$root\Brain\brand-skills\claude-tactical-engineer\SKILL.md"
    "gemini-verification"      = "$root\Brain\brand-skills\gemini-verification-officer\SKILL.md"
    "falcon-project-standards" = "$root\brain-skills\code-skills\falcon-project-standards-skill\Skill.md"
    "MODEL_HANDOFF"            = "$root\Brain\protocols\MODEL_HANDOFF_PROTOCOL.md"
    "QUALITY_GATES"            = "$root\Brain\protocols\QUALITY_GATES.md"
    "GET_SHIT_DONE"            = "$root\Brain\protocols\GET_SHIT_DONE_GATES.md"
    "TAILWIND_FIRST"           = "$root\Brain\protocols\TAILWIND_FIRST_UI_RULES.md"
    "CHART_TABLE_DIFF"         = "$root\Brain\protocols\CHART_TABLE_DIFFERENTIATION.md"
    "wiki-knowledge"           = "$root\brain-skills\business-skills\wiki-knowledge\Skill.md"
    "prd-knowledge"            = "$root\brain-skills\business-skills\prd-knowledge\Skill.md"
    "domain-glossary"          = "$root\brain-skills\business-skills\domain-glossary\Skill.md"
    "module-catalog"           = "$root\brain-skills\business-skills\module-catalog\Skill.md"
    "business-gap-detection"   = "$root\brain-skills\business-skills\business-gap-detection\Skill.md"
    "test-case-authoring"      = "$root\brain-skills\business-skills\test-case-authoring\Skill.md"
    "business-pipeline"        = "$root\brain-skills\business-skills\business-pipeline\Skill.md"
    "official-angular"         = "$root\brain-skills\Front-End-skills\official-angular-skill\Skill.md"
    "angular-tailwind-primeng" = "$root\brain-skills\Front-End-skills\angular-tailwind-primeng-skill\Skill.md"
    "angular-upgrade"          = "$root\brain-skills\Front-End-skills\angular-upgrade-skill\Skill.md"
    "nx-workspace"             = "$root\brain-skills\Front-End-skills\nx-workspace-skill\Skill.md"
    "nx-module-federation"     = "$root\brain-skills\Front-End-skills\nx-module-federation-skill\Skill.md"
    "design-eng"               = "$root\brain-skills\Front-End-skills\emil-design-eng-skill\Skill.md"
    "polish"                   = "$root\brain-skills\Front-End-skills\polish-skill\Skill.md"
    "noor-instructions"        = "$root\brain-skills\Front-End-skills\noor-instructions-skill\Skill.md"
    "ui-ux-pro-max"            = "$root\brain-skills\Front-End-skills\ui-ux-pro-max-skill\.claude\skills\ui-ux-pro-max\SKILL.md"
    "caveman"                  = "$root\brain-skills\Front-End-skills\caveman-skill\skills\caveman\SKILL.md"
    "universal-brain"          = "$root\.claude\skills\brain\SKILL.md"
}

# *** Layout: parallel left/right column entries ***
$L = @(
    @{ Kind="header"; Text="ORCHESTRATION" },
    @{ Kind="skill";  Text="master-orchestrator";      Key="master-orchestrator" },
    @{ Kind="skill";  Text="brain";                    Key="brain" },
    @{ Kind="skill";  Text="sound-announcer";          Key="sound-announcer" },
    @{ Kind="blank" },
    @{ Kind="header"; Text="MINDSETS" },
    @{ Kind="skill";  Text="chatgpt-strategic";        Key="chatgpt-strategic" },
    @{ Kind="skill";  Text="claude-tactical";          Key="claude-tactical" },
    @{ Kind="skill";  Text="gemini-verification";      Key="gemini-verification" },
    @{ Kind="blank" },
    @{ Kind="header"; Text="CODE STANDARDS" },
    @{ Kind="skill";  Text="falcon-project-standards"; Key="falcon-project-standards" },
    @{ Kind="blank" },
    @{ Kind="header"; Text="PROTOCOLS" },
    @{ Kind="skill";  Text="MODEL_HANDOFF";            Key="MODEL_HANDOFF" },
    @{ Kind="skill";  Text="QUALITY_GATES";            Key="QUALITY_GATES" },
    @{ Kind="skill";  Text="GET_SHIT_DONE";            Key="GET_SHIT_DONE" },
    @{ Kind="skill";  Text="TAILWIND_FIRST";           Key="TAILWIND_FIRST" },
    @{ Kind="skill";  Text="CHART_TABLE_DIFF";         Key="CHART_TABLE_DIFF" }
)

$R = @(
    @{ Kind="header"; Text="BUSINESS PIPELINE" },
    @{ Kind="skill";  Text="wiki-knowledge";           Key="wiki-knowledge" },
    @{ Kind="skill";  Text="prd-knowledge";            Key="prd-knowledge" },
    @{ Kind="skill";  Text="domain-glossary";          Key="domain-glossary" },
    @{ Kind="skill";  Text="module-catalog";           Key="module-catalog" },
    @{ Kind="skill";  Text="business-gap-detection";   Key="business-gap-detection" },
    @{ Kind="skill";  Text="test-case-authoring";      Key="test-case-authoring" },
    @{ Kind="skill";  Text="business-pipeline";        Key="business-pipeline" },
    @{ Kind="blank" },
    @{ Kind="header"; Text="FRONT-END" },
    @{ Kind="skill";  Text="official-angular";         Key="official-angular" },
    @{ Kind="skill";  Text="angular-tailwind-primeng"; Key="angular-tailwind-primeng" },
    @{ Kind="skill";  Text="angular-upgrade";          Key="angular-upgrade" },
    @{ Kind="skill";  Text="nx-workspace";             Key="nx-workspace" },
    @{ Kind="skill";  Text="nx-module-federation";     Key="nx-module-federation" },
    @{ Kind="skill";  Text="design-eng";               Key="design-eng" },
    @{ Kind="skill";  Text="polish";                   Key="polish" },
    @{ Kind="skill";  Text="noor-instructions";        Key="noor-instructions" },
    @{ Kind="skill";  Text="ui-ux-pro-max";            Key="ui-ux-pro-max" },
    @{ Kind="skill";  Text="caveman";                  Key="caveman" },
    @{ Kind="blank" },
    @{ Kind="header"; Text="UNIVERSAL BRAIN" },
    @{ Kind="skill";  Text="universal-brain";          Key="universal-brain" },
    @{ Kind="blank" }
)

function Write-Cell {
    param($cell, [int]$width)
    if ($cell.Kind -eq "header") {
        Write-Host $cell.Text -NoNewline -ForegroundColor Cyan
        $remaining = $width - $cell.Text.Length
        if ($remaining -gt 0) { Write-Host (" " * $remaining) -NoNewline }
    } elseif ($cell.Kind -eq "skill") {
        $exists = Test-Path $skillFiles[$cell.Key]
        $boxColor = if ($exists) { "Green" } else { "Red" }
        Write-Host "▣" -NoNewline -ForegroundColor $boxColor
        Write-Host (" " + $cell.Text) -NoNewline -ForegroundColor White
        $textLen = 1 + 1 + $cell.Text.Length
        $remaining = $width - $textLen
        if ($remaining -gt 0) { Write-Host (" " * $remaining) -NoNewline }
    } else {
        Write-Host (" " * $width) -NoNewline
    }
}

# *** BANNER 1 — Falcon Brain v1.0 + Powered by Ammar SK ***
Write-Host ""
Write-Host " ╔════════════════════════════════════════════════════════════╗" -ForegroundColor DarkGray
Write-Host " ║                                                            ║" -ForegroundColor DarkGray
Write-Host " ║      " -ForegroundColor DarkGray -NoNewline; Write-Host "____    ____      _      ___   _   _" -ForegroundColor Cyan -NoNewline; Write-Host "                  ║" -ForegroundColor DarkGray
Write-Host " ║     " -ForegroundColor DarkGray -NoNewline; Write-Host "| __ )  |  _ \    / \    |_ _| | \ | |" -ForegroundColor Cyan -NoNewline; Write-Host "                 ║" -ForegroundColor DarkGray
Write-Host " ║     " -ForegroundColor DarkGray -NoNewline; Write-Host "|  _ \  | |_) |  / _ \    | |  |  \| |" -ForegroundColor Cyan -NoNewline; Write-Host "                 ║" -ForegroundColor DarkGray
Write-Host " ║     " -ForegroundColor DarkGray -NoNewline; Write-Host "| |_) | |  _ <  / ___ \   | |  | |\  |" -ForegroundColor Cyan -NoNewline; Write-Host "                 ║" -ForegroundColor DarkGray
Write-Host " ║     " -ForegroundColor DarkGray -NoNewline; Write-Host "|____/  |_| \_\/_/   \_\ |___| |_| \_|" -ForegroundColor Cyan -NoNewline; Write-Host "                 ║" -ForegroundColor DarkGray
Write-Host " ║                                                            ║" -ForegroundColor DarkGray
Write-Host " ║         " -ForegroundColor DarkGray -NoNewline; Write-Host "F A L C O N   ―   V E R S I O N   1 . 0" -ForegroundColor Green -NoNewline; Write-Host "            ║" -ForegroundColor DarkGray
Write-Host " ║                                                            ║" -ForegroundColor DarkGray
Write-Host " ║     ┌───────────┐  ┌───────────┐  ┌───────────┐            ║" -ForegroundColor DarkGray
Write-Host " ║     │  " -ForegroundColor DarkGray -NoNewline; Write-Host "ChatGPT" -ForegroundColor Magenta -NoNewline; Write-Host "  │  │   " -ForegroundColor DarkGray -NoNewline; Write-Host "Claude" -ForegroundColor Cyan -NoNewline; Write-Host "  │  │   " -ForegroundColor DarkGray -NoNewline; Write-Host "Gemini" -ForegroundColor Blue -NoNewline; Write-Host "  │            ║" -ForegroundColor DarkGray
Write-Host " ║     │ Strategic │  │  Tactical │  │   Verify  │            ║" -ForegroundColor DarkGray
Write-Host " ║     └───────────┘  └───────────┘  └───────────┘            ║" -ForegroundColor DarkGray
Write-Host " ║                                                            ║" -ForegroundColor DarkGray
Write-Host " ║     ════════════  " -ForegroundColor DarkGray -NoNewline; Write-Host "Powered by Ammar" -ForegroundColor Yellow -NoNewline; Write-Host "  ═════════════          ║" -ForegroundColor DarkGray
Write-Host " ║                                                            ║" -ForegroundColor DarkGray
Write-Host " ║                    " -ForegroundColor DarkGray -NoNewline; Write-Host "____    _  __" -ForegroundColor Yellow -NoNewline; Write-Host "                           ║" -ForegroundColor DarkGray
Write-Host " ║                   " -ForegroundColor DarkGray -NoNewline; Write-Host "/ ___|  | |/ /" -ForegroundColor Yellow -NoNewline; Write-Host "                           ║" -ForegroundColor DarkGray
Write-Host " ║                   " -ForegroundColor DarkGray -NoNewline; Write-Host "\___ \  | ' /" -ForegroundColor Yellow -NoNewline; Write-Host "                            ║" -ForegroundColor DarkGray
Write-Host " ║                    " -ForegroundColor DarkGray -NoNewline; Write-Host ' ___) | | . \' -ForegroundColor Yellow -NoNewline; Write-Host "                          ║" -ForegroundColor DarkGray
Write-Host " ║                   " -ForegroundColor DarkGray -NoNewline; Write-Host '|____/  |_|\_\' -ForegroundColor Yellow -NoNewline; Write-Host "                           ║" -ForegroundColor DarkGray
Write-Host " ║                                                            ║" -ForegroundColor DarkGray
Write-Host " ╚════════════════════════════════════════════════════════════╝" -ForegroundColor DarkGray
Write-Host ""

# *** BANNER 2 — System Integrity Check (skill self-check) ***
Write-Host " ╔══════════════════════════════════════════════════════════════╗" -ForegroundColor DarkGray
Write-Host " ║       " -ForegroundColor DarkGray -NoNewline; Write-Host "▶  S Y S T E M   I N T E G R I T Y   C H E C K" -ForegroundColor White -NoNewline; Write-Host "         ║" -ForegroundColor DarkGray
Write-Host " ╚══════════════════════════════════════════════════════════════╝" -ForegroundColor DarkGray
Write-Host ""

# *** Render the two-column grid ***
$rowCount = [Math]::Max($L.Count, $R.Count)
for ($i = 0; $i -lt $rowCount; $i++) {
    $left  = if ($i -lt $L.Count) { $L[$i] } else { @{ Kind="blank" } }
    $right = if ($i -lt $R.Count) { $R[$i] } else { @{ Kind="blank" } }

    Write-Host "  " -NoNewline
    Write-Cell $left 28
    Write-Host "  " -NoNewline
    Write-Cell $right 28
    Write-Host ""
}

# *** Footer summary ***
$total = $skillFiles.Count
$ok = 0
foreach ($v in $skillFiles.Values) { if (Test-Path $v) { $ok++ } }

$status = if ($ok -eq $total) { "ALL SYSTEMS ONLINE" } else { "WARN — $($total - $ok) MISSING" }
$statusColor = if ($ok -eq $total) { "Green" } else { "Yellow" }

Write-Host ""
Write-Host " ──────────────────────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host "        " -NoNewline
Write-Host $status -NoNewline -ForegroundColor $statusColor
Write-Host "   ·   " -NoNewline -ForegroundColor DarkGray
Write-Host "$ok / $total" -NoNewline -ForegroundColor $statusColor
Write-Host "   ·   " -NoNewline -ForegroundColor DarkGray
Write-Host "READY" -ForegroundColor $statusColor
Write-Host " ──────────────────────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""
