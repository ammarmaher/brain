# *** Phase C - Falcon Brain pipeline orchestrator ***
# *** State machine: received -> L1/L2/L3 -> scenarios -> coding -> QA -> push ***
# *** PS 5.1 compatible. Atomic JSON write. Validates events against transition table. ***

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)] [string] $TaskId,
    [Parameter(Mandatory = $true)] [string] $Event,
    [Parameter(Mandatory = $false)][string] $Payload = '',
    [Parameter(Mandatory = $false)][string] $By      = 'adnan',
    [Parameter(Mandatory = $false)][string] $Note    = ''
)

$ErrorActionPreference = 'Stop'

# *** Paths ***
$BrainRoot   = Split-Path -Parent $PSScriptRoot
$StateRoot   = Join-Path $BrainRoot 'state'
$TemplateFs  = Join-Path $StateRoot 'templates\task-state.template.json'
$TaskFolder  = Join-Path $StateRoot $TaskId
$StateFile   = Join-Path $TaskFolder 'task-state.json'
$TmpFile     = "$StateFile.tmp"

# *** Allowed states ***
$AllowedStates = @(
    'received','l1_drafting','l1_review','l2_drafting','l2_review',
    'l3_drafting','l3_review','scenarios_pending','scenarios_ready',
    'coding','qa_pending','qa_failed','qa_passed','ready_to_push',
    'blocked','completed'
)

# *** Transition table: from -> @{ event = @{ to = ...; gate = ...; gateValue = ... } } ***
$Transitions = @{
    'received'          = @{ 'task_received'   = @{ to='l1_drafting';      gate=$null;             gateValue=$null } }
    'l1_drafting'       = @{ 'l1_submit'       = @{ to='l1_review';        gate=$null;             gateValue=$null } }
    'l1_review'         = @{
        'l1_approve' = @{ to='l2_drafting';  gate='l1Approved'; gateValue=$true }
        'l1_reject'  = @{ to='l1_drafting';  gate='l1Approved'; gateValue=$false }
    }
    'l2_drafting'       = @{ 'l2_submit'       = @{ to='l2_review';        gate=$null;             gateValue=$null } }
    'l2_review'         = @{
        'l2_approve' = @{ to='l3_drafting';  gate='l2Approved'; gateValue=$true }
        'l2_reject'  = @{ to='l2_drafting';  gate='l2Approved'; gateValue=$false }
    }
    'l3_drafting'       = @{ 'l3_submit'       = @{ to='l3_review';        gate=$null;             gateValue=$null } }
    'l3_review'         = @{
        'l3_approve' = @{ to='scenarios_pending'; gate='l3Approved'; gateValue=$true }
        'l3_reject'  = @{ to='l3_drafting';       gate='l3Approved'; gateValue=$false }
    }
    'scenarios_pending' = @{ 'scenarios_ready' = @{ to='scenarios_ready';  gate='scenariosBuilt';  gateValue=$true } }
    'scenarios_ready'   = @{ 'start_coding'    = @{ to='coding';           gate=$null;             gateValue=$null } }
    'coding'            = @{ 'code_submit'     = @{ to='qa_pending';       gate='codeWritten';     gateValue=$true } }
    'qa_pending'        = @{
        'qa_pass' = @{ to='qa_passed'; gate='qaPassed'; gateValue=$true }
        'qa_fail' = @{ to='qa_failed'; gate='qaPassed'; gateValue=$false }
    }
    'qa_failed'         = @{ 'resume_coding'   = @{ to='coding';           gate='codeWritten';     gateValue=$false } }
    'qa_passed'         = @{ 'request_push'    = @{ to='ready_to_push';    gate='pushRequested';   gateValue=$true } }
    'ready_to_push'     = @{
        'push_approve' = @{ to='completed';  gate='pushApproved';   gateValue=$true }
        'push_deny'    = @{ to='qa_passed';  gate='pushRequested';  gateValue=$false }
    }
}

# *** Helpers ***
function Get-IsoTimestamp { (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ') }

function New-StateFromTemplate {
    param([string]$tid, [string]$titleText, [string]$now)
    if (-not (Test-Path $TemplateFs)) { throw "Template not found: $TemplateFs" }
    $tpl = Get-Content -Raw -LiteralPath $TemplateFs | ConvertFrom-Json
    $tpl.taskId  = $tid
    $tpl.title   = $titleText
    $tpl.currentState = 'received'
    $tpl.timestamps.created = $now
    $tpl.timestamps.updated = $now
    # *** PSCustomObject member add via Add-Member to keep PS 5.1 happy ***
    $tpl.timestamps.eachStateEntered | Add-Member -NotePropertyName 'received' -NotePropertyValue $now -Force
    return $tpl
}

function Save-StateAtomic {
    param($obj)
    $json = $obj | ConvertTo-Json -Depth 20
    Set-Content -LiteralPath $TmpFile -Value $json -Encoding UTF8
    Move-Item -LiteralPath $TmpFile -Destination $StateFile -Force
}

function Get-PreviousNonBlockedState {
    param($state)
    # *** Walk history backwards to find the state we were in before going to 'blocked' ***
    for ($i = $state.history.Count - 1; $i -ge 0; $i--) {
        $h = $state.history[$i]
        if ($h.to -eq 'blocked') { return $h.from }
    }
    return 'received'
}

# *** Parse payload (optional JSON) ***
$payloadObj = $null
if ($Payload -and $Payload.Trim().Length -gt 0) {
    try { $payloadObj = $Payload | ConvertFrom-Json } catch {
        throw "Invalid -Payload JSON: $($_.Exception.Message)"
    }
}

# *** Ensure folders exist ***
if (-not (Test-Path $TaskFolder)) {
    New-Item -ItemType Directory -Path $TaskFolder -Force | Out-Null
}

# *** Bootstrap on task_received if file is missing ***
$now = Get-IsoTimestamp
$state = $null

if (-not (Test-Path $StateFile)) {
    if ($Event -ne 'task_received') {
        throw "Task '$TaskId' has no state file. First event must be 'task_received' (got '$Event')."
    }
    $title = ''
    if ($payloadObj -and $payloadObj.PSObject.Properties.Name -contains 'title') {
        $title = [string]$payloadObj.title
    }
    $state = New-StateFromTemplate -tid $TaskId -titleText $title -now $now
    Save-StateAtomic -obj $state
}
else {
    $state = Get-Content -Raw -LiteralPath $StateFile | ConvertFrom-Json
}

# *** Special-case events that bypass per-state table: block / unblock ***
$fromState = $state.currentState
$toState   = $null
$gateName  = $null
$gateValue = $null

if ($Event -eq 'block') {
    if ($fromState -eq 'completed' -or $fromState -eq 'blocked') {
        throw "Cannot 'block' from state '$fromState'."
    }
    $toState = 'blocked'
    if ($payloadObj -and $payloadObj.PSObject.Properties.Name -contains 'reason') {
        $reasonStr = [string]$payloadObj.reason
        $list = @()
        if ($state.blockers) { $list = @($state.blockers) }
        $list += $reasonStr
        $state.blockers = $list
    }
}
elseif ($Event -eq 'unblock') {
    if ($fromState -ne 'blocked') {
        throw "Cannot 'unblock' from state '$fromState'."
    }
    $toState = Get-PreviousNonBlockedState -state $state
    $state.blockers = @()
}
else {
    # *** Normal table-driven transition ***
    if (-not $Transitions.ContainsKey($fromState)) {
        throw "No outgoing transitions defined for state '$fromState' (terminal or invalid)."
    }
    $perEvent = $Transitions[$fromState]
    if (-not $perEvent.ContainsKey($Event)) {
        $allowed = ($perEvent.Keys | Sort-Object) -join ', '
        throw "Invalid event '$Event' for state '$fromState'. Allowed: [$allowed]"
    }
    $rule = $perEvent[$Event]
    $toState   = [string]$rule.to
    $gateName  = $rule.gate
    $gateValue = $rule.gateValue
}

# *** Apply transition ***
if ($toState -notin $AllowedStates) {
    throw "Computed target state '$toState' is not an allowed state."
}

$state.currentState = $toState

# *** Gate side-effect ***
if ($gateName) {
    $state.gates.$gateName = [bool]$gateValue
}

# *** Append history entry ***
$histEntry = [pscustomobject]@{
    from  = $fromState
    to    = $toState
    event = $Event
    at    = $now
    by    = $By
    note  = $Note
}
$histList = @()
if ($state.history) { $histList = @($state.history) }
$histList += $histEntry
$state.history = $histList

# *** Update timestamps ***
$state.timestamps.updated = $now
if (-not ($state.timestamps.eachStateEntered.PSObject.Properties.Name -contains $toState)) {
    $state.timestamps.eachStateEntered |
        Add-Member -NotePropertyName $toState -NotePropertyValue $now -Force
}

# *** Optional artifact attachments via payload ***
if ($payloadObj) {
    $artifactKeys = @('planL1Path','planL2Path','planL3Path','scenariosPath','qaReportPath')
    foreach ($k in $artifactKeys) {
        if ($payloadObj.PSObject.Properties.Name -contains $k) {
            $state.artifacts.$k = [string]$payloadObj.$k
        }
    }
    if ($payloadObj.PSObject.Properties.Name -contains 'codeChanges') {
        $state.artifacts.codeChanges = @($payloadObj.codeChanges)
    }
    if ($payloadObj.PSObject.Properties.Name -contains 'note' -and $payloadObj.note) {
        $noteList = @()
        if ($state.notes) { $noteList = @($state.notes) }
        $noteList += [string]$payloadObj.note
        $state.notes = $noteList
    }
}

# *** Persist atomically ***
Save-StateAtomic -obj $state

# *** Emit new state ***
Write-Output $toState
