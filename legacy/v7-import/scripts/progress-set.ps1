# *** progress-set - writes per-task progress.json for the Phase I progress bar ***
# *** Called by orchestrator.ps1 on every state transition (Phase C handoff). ***
# *** PS 5.1 compatible. Atomic write via temp file + rename. ***

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]  [string] $TaskId,
    [Parameter(Mandatory = $true)]  [string] $Step,
    [Parameter(Mandatory = $false)] [int]    $Percent = -1,
    [Parameter(Mandatory = $false)] [string] $Label   = '',
    [Parameter(Mandatory = $false)] [Nullable[int]] $EtaSeconds = $null
)

$ErrorActionPreference = 'Stop'

# *** Canonical step -> percent map. Mirrors Phase C state machine. ***
$StepPercent = @{
    'task_received'     = 5
    'l1_drafting'       = 10
    'l1_review'         = 15
    'l2_drafting'       = 25
    'l2_review'         = 30
    'l3_drafting'       = 40
    'l3_review'         = 50
    'scenarios_pending' = 55
    'scenarios_ready'   = 60
    'coding'            = 70
    'qa_pending'        = 80
    'qa_failed'         = 75
    'qa_passed'         = 90
    'ready_to_push'     = 95
    'completed'         = 100
}
$TotalSteps = 14

# *** Resolve percent: explicit override wins; else canonical lookup; else 0. ***
if ($Percent -lt 0) {
    if ($StepPercent.ContainsKey($Step)) {
        $resolvedPercent = [int]$StepPercent[$Step]
    } else {
        Write-Warning "Unknown step '$Step'. Defaulting percent to 0."
        $resolvedPercent = 0
    }
} else {
    if ($Percent -gt 100) { $resolvedPercent = 100 }
    elseif ($Percent -lt 0) { $resolvedPercent = 0 }
    else { $resolvedPercent = $Percent }
}

# *** Default label to TaskId when caller omits it. ***
if ([string]::IsNullOrWhiteSpace($Label)) { $resolvedLabel = $TaskId } else { $resolvedLabel = $Label }

# *** Paths: progress.json lives next to task-state.json under Brain\state\<task-id>\ ***
$BrainRoot   = Split-Path -Parent $PSScriptRoot
$TaskFolder  = Join-Path $BrainRoot ('state\' + $TaskId)
$Destination = Join-Path $TaskFolder 'progress.json'
$Temp        = $Destination + '.tmp'

if (-not (Test-Path -LiteralPath $TaskFolder)) {
    New-Item -ItemType Directory -Path $TaskFolder -Force | Out-Null
}

# *** Build payload as ordered hashtable so JSON keys keep schema order. ***
$payload = [ordered]@{
    taskId     = $TaskId
    label      = $resolvedLabel
    percent    = $resolvedPercent
    step       = $Step
    totalSteps = $TotalSteps
    etaSeconds = $EtaSeconds
    updatedAt  = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
}

$json = $payload | ConvertTo-Json -Depth 4

# *** Atomic write: write temp, then move over destination. ***
[System.IO.File]::WriteAllText($Temp, $json, [System.Text.UTF8Encoding]::new($false))
Move-Item -LiteralPath $Temp -Destination $Destination -Force

Write-Output ("[progress-set] {0} -> {1}% ({2})" -f $TaskId, $resolvedPercent, $Step)
