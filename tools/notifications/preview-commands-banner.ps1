# *** Preview ONLY — Commands banner color preview ***
# *** Run this to see exact colors before approving the merge into show-banner.ps1 ***

$OutputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)

# *** Color constants ***
$cBorder   = "DarkGray"
$cTitle    = "White"
$cDiamond  = "Cyan"
$cCategory = "Cyan"
$cCommand  = "Green"
$cArg      = "Yellow"
$cDesc     = "White"
$cFooter   = "Green"

function Write-CardTitle {
    param([string]$Name, [int]$TotalWidth = 64)
    $prefix = "─◆─ "
    $suffix = " "
    $titleBlock = "$prefix$Name$suffix"
    $fillCount = $TotalWidth - 2 - $titleBlock.Length
    if ($fillCount -lt 0) { $fillCount = 0 }
    Write-Host " " -NoNewline
    Write-Host "╭" -NoNewline -ForegroundColor $cBorder
    Write-Host "─" -NoNewline -ForegroundColor $cBorder
    Write-Host "◆" -NoNewline -ForegroundColor $cDiamond
    Write-Host "─ " -NoNewline -ForegroundColor $cBorder
    Write-Host $Name -NoNewline -ForegroundColor $cCategory
    Write-Host " " -NoNewline -ForegroundColor $cBorder
    Write-Host ("─" * $fillCount) -NoNewline -ForegroundColor $cBorder
    Write-Host "╮" -ForegroundColor $cBorder
}

function Write-CardEmpty {
    param([int]$TotalWidth = 64)
    $inner = $TotalWidth - 2
    Write-Host " " -NoNewline
    Write-Host "│" -NoNewline -ForegroundColor $cBorder
    Write-Host (" " * $inner) -NoNewline
    Write-Host "│" -ForegroundColor $cBorder
}

function Write-CardBottom {
    param([int]$TotalWidth = 64)
    $inner = $TotalWidth - 2
    Write-Host " " -NoNewline
    Write-Host "╰" -NoNewline -ForegroundColor $cBorder
    Write-Host ("─" * $inner) -NoNewline -ForegroundColor $cBorder
    Write-Host "╯" -ForegroundColor $cBorder
}

function Write-CardCommand {
    param(
        [string]$Cmd,
        [string]$Arg = "",
        [string]$Desc,
        [int]$TotalWidth = 64,
        [int]$CmdColWidth = 22,
        [int]$DescColWidth = 36
    )
    Write-Host " " -NoNewline
    Write-Host "│" -NoNewline -ForegroundColor $cBorder
    Write-Host "   " -NoNewline

    $cmdRendered = $Cmd
    Write-Host $Cmd -NoNewline -ForegroundColor $cCommand
    if ($Arg -ne "") {
        Write-Host " " -NoNewline
        Write-Host $Arg -NoNewline -ForegroundColor $cArg
        $cmdRendered = "$Cmd $Arg"
    }
    $cmdLen = $cmdRendered.Length
    $cmdPad = $CmdColWidth - $cmdLen
    if ($cmdPad -lt 1) { $cmdPad = 1 }
    Write-Host (" " * $cmdPad) -NoNewline

    Write-Host $Desc -NoNewline -ForegroundColor $cDesc
    $descPad = $DescColWidth - $Desc.Length
    if ($descPad -lt 0) { $descPad = 0 }
    Write-Host (" " * $descPad) -NoNewline

    Write-Host " " -NoNewline
    Write-Host "│" -ForegroundColor $cBorder
}

# *** Outer title box ***
Write-Host ""
Write-Host " ╔══════════════════════════════════════════════════════════════╗" -ForegroundColor $cBorder
Write-Host " ║" -NoNewline -ForegroundColor $cBorder
Write-Host "          " -NoNewline
Write-Host "▶  A V A I L A B L E   C O M M A N D S" -NoNewline -ForegroundColor $cTitle
Write-Host "             " -NoNewline
Write-Host " ║" -ForegroundColor $cBorder
Write-Host " ╚══════════════════════════════════════════════════════════════╝" -ForegroundColor $cBorder
Write-Host ""

# *** Card 1: THE BRAIN ***
Write-CardTitle "THE BRAIN"
Write-CardEmpty
Write-CardCommand -Cmd "/brain-engage"     -Desc "Engage tri-mindset orchestrator"
Write-CardCommand -Cmd "/ask-chatgpt"      -Arg "<q>" -Desc "Ask ChatGPT (strategy/business)"
Write-CardCommand -Cmd "/ask-gemini"       -Arg "<q>" -Desc "Ask Gemini (visual / chart QA)"
Write-CardCommand -Cmd "/brain-test-keys"  -Desc "Verify ChatGPT + Gemini API keys"
Write-CardEmpty
Write-CardBottom
Write-Host ""

# *** Card 2: KNOWLEDGE SYNC ***
Write-CardTitle "KNOWLEDGE SYNC"
Write-CardEmpty
Write-CardCommand -Cmd "/brain-wiki"      -Desc "Sync Falcon Azure Wiki"
Write-CardCommand -Cmd "/brain-prd"       -Desc "Sync latest PRDs from Drive"
Write-CardCommand -Cmd "/brain-glossary"  -Desc "Validate terms against glossary"
Write-CardEmpty
Write-CardBottom
Write-Host ""

# *** Card 3: MODULES & TESTING ***
Write-CardTitle "MODULES & TESTING"
Write-CardEmpty
Write-CardCommand -Cmd "/brain-module"     -Arg "<slug>"   -Desc "Read or refresh module dossier"
Write-CardCommand -Cmd "/brain-tests"      -Arg "<module>" -Desc "Generate test cases (one module)"
Write-CardCommand -Cmd "/brain-tests-all"  -Desc "Generate test cases (all modules)"
Write-CardEmpty
Write-CardBottom
Write-Host ""

# *** Card 4: ANALYSIS ***
Write-CardTitle "ANALYSIS"
Write-CardEmpty
Write-CardCommand -Cmd "/brain-business"  -Desc "Run 6-stage business pipeline"
Write-CardCommand -Cmd "/brain-gaps"      -Desc "Detect PRD / Wiki / test gaps"
Write-CardEmpty
Write-CardBottom
Write-Host ""

# *** Card 5: TASK WORKFLOWS ***
Write-CardTitle "TASK WORKFLOWS"
Write-CardEmpty
Write-CardCommand -Cmd "/brain-task"       -Desc "Standard task lifecycle"
Write-CardCommand -Cmd "/brain-screenshot" -Desc "Screenshot pipeline (Gemini->Claude)"
Write-CardEmpty
Write-CardBottom
Write-Host ""

# *** Card 6: REVIEW & AUTOMATION ***
Write-CardTitle "REVIEW & AUTOMATION"
Write-CardEmpty
Write-CardCommand -Cmd "/brain-pr-review" -Arg "<#>"    -Desc "PR review chain (Gemini -> Claude)"
Write-CardCommand -Cmd "/brain-night"     -Arg "[job]"  -Desc "Run a deferred night-mode job"
Write-CardEmpty
Write-CardBottom
Write-Host ""

# *** Card 7: DESIGN POLISH ***
Write-CardTitle "DESIGN POLISH"
Write-CardEmpty
Write-CardCommand -Cmd "/design-eng" -Desc "Emil's design-eng craft rules"
Write-CardCommand -Cmd "/polish"     -Arg "<sub>" -Desc "Audit / critique / polish UI"
Write-CardEmpty
Write-CardBottom
Write-Host ""

# *** Card 8: STATUS ***
Write-CardTitle "STATUS"
Write-CardEmpty
Write-CardCommand -Cmd "/brain-status" -Desc "Re-print full Brain banner"
Write-CardCommand -Cmd "/brain-check"  -Desc "Re-print integrity check only"
Write-CardEmpty
Write-CardBottom
Write-Host ""

# *** Footer ***
Write-Host "           " -NoNewline
Write-Host "20 commands available" -NoNewline -ForegroundColor $cFooter
Write-Host "   ·   " -NoNewline -ForegroundColor $cBorder
Write-Host "Type any command above" -ForegroundColor $cFooter
Write-Host ""
