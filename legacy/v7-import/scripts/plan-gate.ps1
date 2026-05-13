# *** plan-gate.ps1 ***
# *** Dispatcher for the 3-layer plan gates (L1 abstraction -> L2 business -> L3 technical). ***
# *** Copies templates into Brain\state\<task-id>\, writes approval markers, logs rejections. ***
# *** PowerShell 5.1 compatible. No '??', no ternary, no chain '&&'. ***

param(
    [Parameter(Mandatory)] [string]$TaskId,
    [Parameter(Mandatory)] [ValidateSet('L1','L2','L3')] [string]$Layer,
    [Parameter(Mandatory)] [ValidateSet('create','approve','reject')] [string]$Action,
    [string]$Reason
)

$ErrorActionPreference = 'Stop'

# *** Resolve Brain root from this script's location (scripts\..). ***
$here       = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$brainRoot  = Split-Path $here -Parent
$templates  = Join-Path $brainRoot 'plan\templates'
$stateRoot  = Join-Path $brainRoot 'state'
$taskState  = Join-Path $stateRoot $TaskId

# *** Layer -> (template filename, output filename, approval marker, next layer key). ***
$layerMap = @{
    'L1' = @{ Template = 'plan-l1-abstraction.md'; Output = 'plan-l1.md'; Marker = '.l1-approved'; Next = 'L2' }
    'L2' = @{ Template = 'plan-l2-business.md';    Output = 'plan-l2.md'; Marker = '.l2-approved'; Next = 'L3' }
    'L3' = @{ Template = 'plan-l3-technical.md';   Output = 'plan-l3.md'; Marker = '.l3-approved'; Next = $null }
}

$current = $layerMap[$Layer]

# *** Ensure state dir exists for this task. ***
if (-not (Test-Path $taskState)) {
    New-Item -ItemType Directory -Path $taskState -Force | Out-Null
}

function Assert-PriorApproval {
    param([string]$ForLayer)
    if ($ForLayer -eq 'L2') {
        $prior = Join-Path $taskState '.l1-approved'
        if (-not (Test-Path $prior)) {
            throw ("Cannot create L2: L1 not approved yet for {0}. Approve L1 first." -f $TaskId)
        }
    }
    elseif ($ForLayer -eq 'L3') {
        $prior = Join-Path $taskState '.l2-approved'
        if (-not (Test-Path $prior)) {
            throw ("Cannot create L3: L2 not approved yet for {0}. Approve L2 first." -f $TaskId)
        }
    }
}

function Invoke-Create {
    Assert-PriorApproval -ForLayer $Layer
    $src = Join-Path $templates $current.Template
    $dst = Join-Path $taskState $current.Output
    if (-not (Test-Path $src)) {
        throw "Template missing: $src"
    }
    if (Test-Path $dst) {
        Write-Host "[plan-gate] $Layer plan already exists at $dst (leaving as-is)."
        return
    }
    Copy-Item -Path $src -Destination $dst -Force
    Write-Host "[plan-gate] Created $Layer plan: $dst"
}

function Invoke-Approve {
    $planFile = Join-Path $taskState $current.Output
    if (-not (Test-Path $planFile)) {
        throw ("Cannot approve {0}: plan file missing at {1}. Run -Action create first." -f $Layer, $planFile)
    }
    $marker = Join-Path $taskState $current.Marker
    $stamp  = (Get-Date).ToString('o')
    Set-Content -Path $marker -Value $stamp -Encoding UTF8
    Write-Host "[plan-gate] Approved $Layer at $stamp -> $marker"

    # *** Auto-seed the next layer template, or unlock code phase if L3. ***
    if ($current.Next) {
        $nextLayer    = $layerMap[$current.Next]
        $nextTemplate = Join-Path $templates $nextLayer.Template
        $nextOutput   = Join-Path $taskState $nextLayer.Output
        if (-not (Test-Path $nextOutput)) {
            Copy-Item -Path $nextTemplate -Destination $nextOutput -Force
            Write-Host "[plan-gate] Seeded next layer ($($current.Next)) template -> $nextOutput"
        }
        else {
            Write-Host "[plan-gate] Next layer ($($current.Next)) plan already exists; left untouched."
        }
    }
    else {
        $ready = Join-Path $taskState '.ready-to-code'
        Set-Content -Path $ready -Value $stamp -Encoding UTF8
        Write-Host "[plan-gate] L3 approved. Code phase unlocked: $ready"
    }
}

function Invoke-Reject {
    if (-not $Reason) {
        throw "Reject requires -Reason '<short reason>'."
    }
    $log   = Join-Path $taskState 'rejections.log'
    $stamp = (Get-Date).ToString('o')
    $line  = "[$stamp] $Layer REJECTED -- $Reason"
    Add-Content -Path $log -Value $line -Encoding UTF8
    Write-Host "[plan-gate] Rejected $Layer -> $log"
}

switch ($Action) {
    'create'  { Invoke-Create  }
    'approve' { Invoke-Approve }
    'reject'  { Invoke-Reject  }
}
