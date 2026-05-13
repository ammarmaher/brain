# *** get-the-task.ps1 ***
# *** Phase F live: Azure DevOps work item -> PRD mapping -> task-card.md ***
# *** PowerShell 5.1 compatible. UTF-8. ***
# *** Live AZDO REST integration with stub fallback (sample-work-item.json). ***
# *** LLM scope-check via ask-chatgpt.ps1; placeholder text on LLM failure. ***
# *** Env: AZDO_PAT (required for live), AZDO_ORG (default t2development), AZDO_PROJECT (default Falcon). ***

[CmdletBinding()]
param(
    # *** Required: Azure DevOps work item ID (digit string) ***
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^\d+$')]
    [string] $WorkItemId,

    # *** Optional: PRD module slug override (e.g. "04-contact-group-management") ***
    [string] $PrdModuleSlug = '',

    # *** Brain root (override only for testing) ***
    [string] $BrainRoot = 'C:\falcon\Brain',

    # *** prd-knowledge skill root (read-only) ***
    [string] $PrdSkillRoot = 'C:\falcon\brain-skills\business-skills\prd-knowledge',

    # *** Stub work-item path (default points at the sample bundled with this skill) ***
    [string] $StubWorkItemPath = 'C:\falcon\Brain\get-the-task\sample-work-item.json'
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

# *** Path constants ***

$TemplatePath  = Join-Path $BrainRoot 'get-the-task\task-card-template.md'
$ModulesRoot   = Join-Path $PrdSkillRoot 'modules'
$IndexJsonPath = Join-Path $BrainRoot 'Brain Generated\analysis\index.json'
$StateRoot     = Join-Path $BrainRoot 'state'
$TaskFolder    = Join-Path $StateRoot $WorkItemId
$TaskCardPath  = Join-Path $TaskFolder 'task-card.md'

# *** Banner ***

Write-Host ''
Write-Host '*** Brain :: get-the-task scaffold ***'
Write-Host ('*** WorkItemId   : {0}' -f $WorkItemId)
Write-Host ('*** PRD module   : {0}' -f ($(if ($PrdModuleSlug) { $PrdModuleSlug } else { '<auto-detect>' })))
Write-Host ('*** Stub source  : {0}' -f $StubWorkItemPath)
Write-Host ''

# *** Auth note: AZDO_PAT env var would be required once API is wired ***

if (-not $env:AZDO_PAT) {
    Write-Warning 'AZDO_PAT env var is not set. Scaffold mode is fine without it; live mode will require it.'
}

# *** Helpers ***

function Read-JsonFile([string] $Path) {
    if (-not (Test-Path -LiteralPath $Path)) {
        throw ('File not found: {0}' -f $Path)
    }
    Get-Content -LiteralPath $Path -Raw -Encoding UTF8 | ConvertFrom-Json
}

function Read-TextFile([string] $Path) {
    if (-not (Test-Path -LiteralPath $Path)) { return '' }
    Get-Content -LiteralPath $Path -Raw -Encoding UTF8
}

function To-Slug([string] $Value) {
    if ([string]::IsNullOrWhiteSpace($Value)) { return '' }
    $s = $Value.ToLowerInvariant()
    # *** Strip path separators, keep tail segment if path-like ***
    if ($s -match '\\') { $s = ($s -split '\\')[-1] }
    $s = ($s -replace '[^a-z0-9]+', '-').Trim('-')
    return $s
}

function Get-PrdModuleFolder([string] $Slug) {
    if (-not (Test-Path -LiteralPath $ModulesRoot)) {
        return $null
    }
    if ([string]::IsNullOrWhiteSpace($Slug)) { return $null }
    $candidates = @(Get-ChildItem -LiteralPath $ModulesRoot -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -like "*$Slug*" })
    if ($candidates.Count -eq 0) { return $null }
    # *** Prefer numeric-prefixed module folder over generic matches ***
    $numbered = @($candidates | Where-Object { $_.Name -match '^\d{2}-' })
    if ($numbered.Count -gt 0) { return $numbered[0] }
    return $candidates[0]
}

function Resolve-PrdModule {
    param($WorkItem, [string] $OverrideSlug)

    # *** Detection priority: override -> areaPath tail -> parent feature -> title ***
    $candidates = @()
    if (-not [string]::IsNullOrWhiteSpace($OverrideSlug)) {
        $candidates += @{ slug = (To-Slug $OverrideSlug); method = 'operator-override' }
    }
    if ($WorkItem.areaPath) {
        $candidates += @{ slug = (To-Slug $WorkItem.areaPath); method = 'area-path-tail' }
    }
    if ($WorkItem.parentFeature -and $WorkItem.parentFeature.title) {
        $candidates += @{ slug = (To-Slug $WorkItem.parentFeature.title); method = 'parent-feature-title' }
    }
    if ($WorkItem.title) {
        $candidates += @{ slug = (To-Slug $WorkItem.title); method = 'work-item-title' }
    }

    foreach ($c in $candidates) {
        if ([string]::IsNullOrWhiteSpace($c.slug)) { continue }
        # *** Try the slug as-is and as keyword fragments (split by dash) ***
        $folder = Get-PrdModuleFolder $c.slug
        if (-not $folder) {
            $tokens = $c.slug -split '-'
            foreach ($t in $tokens) {
                if ($t.Length -lt 4) { continue }
                $folder = Get-PrdModuleFolder $t
                if ($folder) { break }
            }
        }
        if ($folder) {
            return [pscustomobject]@{
                Slug   = $folder.Name
                Folder = $folder.FullName
                Method = $c.method
            }
        }
    }

    return $null
}

function Get-PrdHighlights([string] $UnderstandingMd) {
    if ([string]::IsNullOrWhiteSpace($UnderstandingMd)) {
        return '_(understanding.md missing)_'
    }
    # *** Pull the first 12 non-empty lines after the first heading as a teaser ***
    $lines = $UnderstandingMd -split "`r?`n"
    $picked = New-Object System.Collections.Generic.List[string]
    $afterHeading = $false
    foreach ($l in $lines) {
        if (-not $afterHeading) {
            if ($l -match '^#') { $afterHeading = $true }
            continue
        }
        $trim = $l.Trim()
        if ($trim) { $picked.Add($trim) | Out-Null }
        if ($picked.Count -ge 12) { break }
    }
    if ($picked.Count -eq 0) { return '_(no extractable highlights)_' }
    ($picked -join "`n")
}

function Format-MdEscape([string] $Text) {
    if ($null -eq $Text) { return '' }
    # *** Light escape for placeholder injection only - do not double-encode ***
    return ($Text -replace '\{\{', '{ {' -replace '\}\}', '} }')
}

# *** Step 1 - Read the work item (live Azure DevOps with stub fallback) ***
# *** Env vars: AZDO_PAT (required for live), AZDO_ORG (default t2development), AZDO_PROJECT (default Falcon) ***
# *** Fallback chain: no PAT -> stub; PAT present but request fails -> stub; PAT + success -> live ***

$stubPath = $StubWorkItemPath
$pat = $env:AZDO_PAT
if (-not $pat) {
    Write-Host "[get-the-task] AZDO_PAT env var not set; falling back to stub at $stubPath" -ForegroundColor Yellow
    $workItem = Get-Content $stubPath -Raw | ConvertFrom-Json
} else {
    $org = if ($env:AZDO_ORG) { $env:AZDO_ORG } else { 't2development' }
    $project = if ($env:AZDO_PROJECT) { $env:AZDO_PROJECT } else { 'Falcon' }
    $uri = "https://dev.azure.com/$org/$project/_apis/wit/workitems/$WorkItemId" + '?$expand=relations&api-version=7.1'
    $auth = [Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes(":$pat"))
    $headers = @{ Authorization = "Basic $auth"; 'Content-Type' = 'application/json' }
    try {
        $raw = Invoke-RestMethod -Uri $uri -Headers $headers -Method Get -TimeoutSec 30
        # *** Map AZDO fields to canonical work-item shape ***
        $workItem = [PSCustomObject]@{
            id              = $raw.id
            title           = $raw.fields.'System.Title'
            description     = $raw.fields.'System.Description'
            acceptanceCriteria = $raw.fields.'Microsoft.VSTS.Common.AcceptanceCriteria'
            type            = $raw.fields.'System.WorkItemType'
            areaPath        = $raw.fields.'System.AreaPath'
            iteration       = $raw.fields.'System.IterationPath'
            assignee        = $raw.fields.'System.AssignedTo'.displayName
            priority        = $raw.fields.'Microsoft.VSTS.Common.Priority'
            parentFeature   = ($raw.relations | Where-Object { $_.rel -eq 'System.LinkTypes.Hierarchy-Reverse' } | Select-Object -First 1).url
        }
    } catch {
        Write-Host "[get-the-task] Azure DevOps fetch failed: $_; falling back to stub" -ForegroundColor Yellow
        $workItem = Get-Content $stubPath -Raw | ConvertFrom-Json
    }
}
Write-Host ('Loaded work item: id={0} title="{1}"' -f $workItem.id, $workItem.title)

# *** Defensive override: if stub id != requested id, log but keep going (scaffold) ***

if ([string]$workItem.id -ne $WorkItemId) {
    Write-Warning ('Stub work item id ({0}) does not match requested id ({1}); scaffold continues with stub.' -f $workItem.id, $WorkItemId)
}

# *** Step 2 - Resolve PRD module ***

$module = Resolve-PrdModule -WorkItem $workItem -OverrideSlug $PrdModuleSlug

if ($module) {
    Write-Host ('PRD module resolved: {0} (via {1})' -f $module.Slug, $module.Method)
    $latestPrdPath    = Join-Path $module.Folder 'latest-prd.md'
    $understandingPath= Join-Path $module.Folder 'understanding.md'
    $attachmentsPath  = Join-Path $module.Folder 'attachments.md'
} else {
    Write-Warning 'PRD module could not be resolved. Task card will flag the mapping as UNRESOLVED.'
    $latestPrdPath    = ''
    $understandingPath= ''
    $attachmentsPath  = ''
}

# *** Step 3 - Read PRD trio (read-only) ***

$understanding = Read-TextFile $understandingPath
$prdHighlights = Get-PrdHighlights $understanding

# *** Step 4 - Scope checks (LLM pass via ask-chatgpt; placeholder fallback on failure) ***
# *** Defaults: assume LLM unavailable; success path overwrites these ***

$placeholderText = '(LLM unavailable - manual review required)'
$outOfScopeBlock = @"
$placeholderText
- See ``Brain/get-the-task/scope-check-rules.md`` Section 1 for the rubric.
- If no deltas, the reviewer writes: _No out-of-scope deltas detected._
"@

$errorBusinessBlock = @"
$placeholderText
- See ``Brain/get-the-task/scope-check-rules.md`` Section 2 for the rubric.
- If clean, the reviewer writes: _No business-rule contradictions detected._
"@

$bugBusinessBlock = @"
$placeholderText
- See ``Brain/get-the-task/scope-check-rules.md`` Section 3 for the rubric.
  Classification: BUG | FEATURE | ENHANCEMENT | UNCLEAR
  Confidence:     HIGH | MEDIUM | LOW
  Evidence:       <bullet list of supporting signals>
"@

# *** Default classification placeholders - overwritten only when LLM JSON parses cleanly ***
$bugClassification = 'UNCLEAR'
$bugConfidence     = 'LOW'

# *** Pre-flight: only attempt LLM when keys.env exists with a non-placeholder OPENAI_API_KEY ***

$keysEnvPath = Join-Path $BrainRoot 'config\keys.env'
$llmShouldRun = $false
if (Test-Path -LiteralPath $keysEnvPath) {
    $rawKey = $null
    foreach ($line in (Get-Content -LiteralPath $keysEnvPath)) {
        if ($line -match '^\s*OPENAI_API_KEY\s*=\s*(.+)\s*$') {
            $rawKey = $Matches[1].Trim().Trim('"')
            break
        }
    }
    if ($rawKey -and ($rawKey -notlike 'PASTE_*') -and ($rawKey -notlike 'YOUR_*')) {
        $llmShouldRun = $true
    } else {
        Write-Warning 'OPENAI_API_KEY missing or placeholder in keys.env; skipping LLM scope-check.'
    }
} else {
    Write-Warning ('keys.env not found at {0}; skipping LLM scope-check.' -f $keysEnvPath)
}

if ($llmShouldRun) {
    # *** Build the LLM prompt: work item + PRD + scope-check rules + JSON contract ***

    $latestPrdText = Read-TextFile $latestPrdPath
    if ([string]::IsNullOrWhiteSpace($latestPrdText)) {
        $latestPrdText = '_(latest-prd.md missing or PRD module unresolved)_'
    }

    $rulesPath = Join-Path $BrainRoot 'get-the-task\scope-check-rules.md'
    $scopeRulesText = Read-TextFile $rulesPath
    if ([string]::IsNullOrWhiteSpace($scopeRulesText)) {
        $scopeRulesText = '_(scope-check-rules.md missing)_'
    }

    $wiTitle       = [string]$workItem.title
    $wiDescription = [string]$workItem.description
    $wiAcceptance  = [string]$workItem.acceptanceCriteria

    $llmPrompt = @"
You are the Falcon Brain scope-check reviewer. Compare an Azure DevOps work item
against the canonical PRD using the three checks defined in scope-check-rules.md.

Return ONLY a single JSON object matching this exact schema (no prose, no code
fences, no commentary):

{
  "outOfScope": [ { "claim": "<work-item assertion>", "evidence": "<why no PRD anchor>" } ],
  "errorBusiness": [ { "claim": "<work-item statement>", "evidence": "<exact PRD rule it contradicts>" } ],
  "bugBusinessClassification": "BUG|FEATURE|ENHANCEMENT|UNCLEAR",
  "bugBusinessRationale": "<one or two sentences citing signals>"
}

Empty arrays mean no findings. Do not invent findings; cite PRD text only when present.

==== WORK ITEM ====
Title: $wiTitle

Description:
$wiDescription

Acceptance Criteria:
$wiAcceptance

==== PRD (latest-prd.md) ====
$latestPrdText

==== SCOPE-CHECK RULES (scope-check-rules.md) ====
$scopeRulesText
"@

    try {
        # *** Call ChatGPT (tri-mindset routing: scope-check belongs to ChatGPT) ***
        $llmRaw = & "$PSScriptRoot\ask-chatgpt.ps1" -Prompt $llmPrompt -Model 'gpt-4o-mini' -Quiet -ErrorAction Stop

        # *** Tolerate code-fence wrapping: strip ```json ... ``` if present ***
        $llmJsonText = [string]$llmRaw
        $llmJsonText = $llmJsonText.Trim()
        if ($llmJsonText -match '(?s)^```(?:json)?\s*(.+?)\s*```\s*$') {
            $llmJsonText = $Matches[1].Trim()
        }

        $llmObj = $llmJsonText | ConvertFrom-Json

        # *** Render outOfScope findings ***
        $oosLines = New-Object System.Collections.Generic.List[string]
        $oosArr = @($llmObj.outOfScope)
        if ($oosArr.Count -eq 0) {
            $oosLines.Add('_No out-of-scope deltas detected._') | Out-Null
        } else {
            foreach ($f in $oosArr) {
                $oosLines.Add(('- [DELTA] {0}' -f [string]$f.claim)) | Out-Null
                $oosLines.Add(('  Evidence: {0}' -f [string]$f.evidence)) | Out-Null
            }
        }
        $outOfScopeBlock = ($oosLines -join "`n")

        # *** Render errorBusiness findings ***
        $ebLines = New-Object System.Collections.Generic.List[string]
        $ebArr = @($llmObj.errorBusiness)
        if ($ebArr.Count -eq 0) {
            $ebLines.Add('_No business-rule contradictions detected._') | Out-Null
        } else {
            foreach ($f in $ebArr) {
                $ebLines.Add(('- [CONTRADICTION] {0}' -f [string]$f.claim)) | Out-Null
                $ebLines.Add(('  PRD rule: {0}' -f [string]$f.evidence)) | Out-Null
            }
        }
        $errorBusinessBlock = ($ebLines -join "`n")

        # *** Render bug-business classification ***
        $rawClass = ([string]$llmObj.bugBusinessClassification).ToUpperInvariant().Trim()
        if ($rawClass -in @('BUG','FEATURE','ENHANCEMENT','UNCLEAR')) {
            $bugClassification = $rawClass
        } else {
            $bugClassification = 'UNCLEAR'
        }
        $oosCount = $oosArr.Count
        $ebCount  = $ebArr.Count
        $signals = $oosCount + $ebCount + 1
        if     ($signals -ge 3) { $bugConfidence = 'HIGH' }
        elseif ($signals -eq 2) { $bugConfidence = 'MEDIUM' }
        else                    { $bugConfidence = 'LOW' }
        $rationale = [string]$llmObj.bugBusinessRationale
        if ([string]::IsNullOrWhiteSpace($rationale)) { $rationale = '(no rationale returned)' }
        $bugBusinessBlock = @"
Classification: $bugClassification
Confidence:     $bugConfidence
Evidence:
  - $rationale
"@
        Write-Host '[get-the-task] LLM scope-check complete.' -ForegroundColor Green
    } catch {
        # *** Any LLM / parse failure: keep placeholder text, log warning, do NOT bail ***
        Write-Warning ('LLM scope-check failed; keeping placeholder text. Detail: {0}' -f $_.Exception.Message)
    }
}

# *** Step 5 - Render template ***

if (-not (Test-Path -LiteralPath $TemplatePath)) {
    throw ('Template not found: {0}' -f $TemplatePath)
}
$template = Read-TextFile $TemplatePath

$now = (Get-Date).ToUniversalTime().ToString('s') + 'Z'

# *** Build replacements map ***

$replacements = [ordered]@{}
$replacements['{{WORK_ITEM_ID}}']            = [string]$workItem.id
$replacements['{{WORK_ITEM_TITLE}}']         = Format-MdEscape ([string]$workItem.title)
$replacements['{{WORK_ITEM_TYPE}}']          = [string]$workItem.type
$replacements['{{WORK_ITEM_STATE}}']         = [string]$workItem.state
$replacements['{{WORK_ITEM_PRIORITY}}']      = [string]$workItem.priority
$replacements['{{WORK_ITEM_AREA_PATH}}']     = [string]$workItem.areaPath
$replacements['{{WORK_ITEM_ITERATION}}']     = [string]$workItem.iterationPath
$replacements['{{WORK_ITEM_ASSIGNEE}}']      = [string]$workItem.assignedTo

$parentText = ''
if ($workItem.parentFeature) {
    $parentText = ('#{0} - {1}' -f $workItem.parentFeature.id, $workItem.parentFeature.title)
}
$replacements['{{WORK_ITEM_PARENT}}']        = $parentText
$replacements['{{PICKUP_TIMESTAMP}}']        = $now
$replacements['{{WORK_ITEM_DESCRIPTION}}']   = Format-MdEscape ([string]$workItem.description)
$replacements['{{WORK_ITEM_ACCEPTANCE}}']    = Format-MdEscape ([string]$workItem.acceptanceCriteria)

$tagsText = ''
if ($workItem.tags) { $tagsText = (@($workItem.tags) -join ', ') }
$replacements['{{WORK_ITEM_TAGS}}']          = $tagsText

if ($module) {
    $replacements['{{PRD_MODULE_SLUG}}']     = $module.Slug
    $replacements['{{PRD_DETECTION_METHOD}}']= $module.Method
    $replacements['{{PRD_MODULE_FOLDER}}']   = $module.Folder
    $replacements['{{PRD_LATEST_PATH}}']     = $latestPrdPath
    $replacements['{{PRD_UNDERSTANDING_PATH}}'] = $understandingPath
    $replacements['{{PRD_ATTACHMENTS_PATH}}']= $attachmentsPath
    $replacements['{{PRD_HIGHLIGHTS}}']      = $prdHighlights
} else {
    $unresolved = 'UNRESOLVED - operator must supply -PrdModuleSlug'
    $replacements['{{PRD_MODULE_SLUG}}']     = $unresolved
    $replacements['{{PRD_DETECTION_METHOD}}']= 'none'
    $replacements['{{PRD_MODULE_FOLDER}}']   = '_(unresolved)_'
    $replacements['{{PRD_LATEST_PATH}}']     = '_(unresolved)_'
    $replacements['{{PRD_UNDERSTANDING_PATH}}'] = '_(unresolved)_'
    $replacements['{{PRD_ATTACHMENTS_PATH}}']= '_(unresolved)_'
    $replacements['{{PRD_HIGHLIGHTS}}']      = '_(PRD module unresolved - re-run with -PrdModuleSlug)_'
}

$replacements['{{OUT_OF_SCOPE_FINDINGS}}']   = $outOfScopeBlock
$replacements['{{ERROR_BUSINESS_FINDINGS}}'] = $errorBusinessBlock
# *** LLM-populated classification (defaults UNCLEAR/LOW when LLM unavailable) ***
$replacements['{{BUG_OR_FEATURE}}']             = $bugClassification
$replacements['{{BUG_FEATURE_CONFIDENCE}}']     = $bugConfidence
$replacements['{{BUG_FEATURE_EVIDENCE_INLINE}}']= 'see Evidence detail below'
$replacements['{{BUG_FEATURE_EVIDENCE}}']       = $bugBusinessBlock
$replacements['{{RECOMMENDED_PLAN}}']        = 'TODO: derived from L1 plan (Phase B). Scaffold writes placeholder.'
$replacements['{{ACCEPTANCE_FOR_ORCHESTRATOR}}'] = Format-MdEscape ([string]$workItem.acceptanceCriteria)
$replacements['{{RISKS}}']                   = 'TODO: enumerate after scope checks complete.'

# *** Gate placeholders - orchestrator flips these later ***

$replacements['{{GATE_PRD_COVERAGE}}']        = 'PENDING'
$replacements['{{GATE_PRD_COVERAGE_NOTE}}']   = ''
$replacements['{{GATE_NO_OUT_OF_SCOPE}}']     = 'PENDING'
$replacements['{{GATE_NO_OUT_OF_SCOPE_NOTE}}']= ''
$replacements['{{GATE_NO_ERROR_BUSINESS}}']   = 'PENDING'
$replacements['{{GATE_NO_ERROR_BUSINESS_NOTE}}'] = ''
$replacements['{{GATE_CLASSIFIED}}']          = 'PENDING'
$replacements['{{GATE_CLASSIFIED_NOTE}}']     = ''
$replacements['{{GATE_OPERATOR_APPROVED}}']   = 'PENDING'

# *** Render ***

$rendered = $template
foreach ($k in $replacements.Keys) {
    $rendered = $rendered.Replace($k, [string]$replacements[$k])
}

# *** Step 5b - Write task-card.md ***

if (-not (Test-Path -LiteralPath $TaskFolder)) {
    New-Item -ItemType Directory -Path $TaskFolder -Force | Out-Null
}
Set-Content -LiteralPath $TaskCardPath -Value $rendered -Encoding UTF8

Write-Host ('Wrote task card: {0}' -f $TaskCardPath)

# *** Step 6 - Append to analysis/index.json (preserve existing runs[]) ***

if (-not (Test-Path -LiteralPath $IndexJsonPath)) {
    Write-Warning ('analysis/index.json missing at {0}; creating an empty one.' -f $IndexJsonPath)
    $indexDir = Split-Path -Parent $IndexJsonPath
    if (-not (Test-Path -LiteralPath $indexDir)) {
        New-Item -ItemType Directory -Path $indexDir -Force | Out-Null
    }
    Set-Content -LiteralPath $IndexJsonPath -Value '{ "runs": [] }' -Encoding UTF8
}

$index = Read-JsonFile $IndexJsonPath

# *** Ensure the runs[] array exists (PowerShell ConvertFrom-Json returns scalar for single objects) ***

$runs = @()
if ($index.PSObject.Properties.Name -contains 'runs' -and $index.runs) {
    $runs = @($index.runs)
}

$datePart = (Get-Date).ToUniversalTime().ToString('yyyyMMdd')
$prdSlugForSummary = if ($module) { $module.Slug } else { 'UNRESOLVED' }

$newRun = [ordered]@{
    id        = ('{0}-task-pickup-{1}' -f $datePart, $WorkItemId)
    type      = 'task-pickup'
    level     = 'L0'
    outputs   = @( ('state\{0}\task-card.md' -f $WorkItemId) )
    summary   = ('Picked up WIID {0} ("{1}"). PRD module: {2}.' -f $WorkItemId, $workItem.title, $prdSlugForSummary)
    timestamp = $now
}

$runs += [pscustomobject]$newRun
$updated = [ordered]@{ runs = $runs }
$updated | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $IndexJsonPath -Encoding UTF8

Write-Host ('Appended index.json entry: {0}' -f $newRun.id)

# *** Done ***

Write-Host ''
Write-Host '*** get-the-task scaffold complete ***'
Write-Host ('*** Task card : {0}' -f $TaskCardPath)
Write-Host ('*** Index     : {0}' -f $IndexJsonPath)
Write-Host '*** Next      : Phase C orchestrator picks up the task card.'
Write-Host ''
