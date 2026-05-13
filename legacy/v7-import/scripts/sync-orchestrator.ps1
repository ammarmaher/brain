# *** sync-orchestrator.ps1 ***
# *** Phase D orchestrator: post-processes prd-knowledge output ***
# *** Steps owned here: (c) per-user folder ensure, (d) asset download, (e) atomic report ***
# *** Steps (a) wiki-knowledge sync and (b) prd-knowledge sync are owned by their skills ***
# *** PowerShell 5.1 compatible. Idempotent. No Drive API calls. ***

[CmdletBinding()]
param(
    # *** Brain root (override only for testing) ***
    [string] $BrainRoot = 'C:\falcon\Brain',

    # *** prd-knowledge skill root ***
    [string] $PrdSkillRoot = 'C:\falcon\brain-skills\business-skills\prd-knowledge',

    # *** Skip the asset-download step (useful for dry-runs of step c only) ***
    [switch] $SkipAssets,

    # *** Skip the per-user folder ensure step ***
    [switch] $SkipUserFolders
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

# *** Constants ***

$AllowedExt = @(
    '.xlsx','.xlsm','.csv',
    '.pdf','.docx','.pptx',
    '.jpg','.jpeg','.png','.gif','.webp'
)

$AllowedHostSuffixes = @(
    'drive.google.com',
    'docs.google.com',
    'googleusercontent.com',
    'drive.usercontent.google.com'
)

$MaxFileBytes      = 100MB
$RequestTimeoutSec = 60

$ReportPath  = Join-Path $BrainRoot 'Brain Generated\analysis\L0-summary\sync-report.md'
$ModulesRoot = Join-Path $PrdSkillRoot 'modules'
$UsersRoot   = Join-Path $ModulesRoot  'users'

# *** Result accumulators ***

$Script:Lines      = New-Object System.Collections.Generic.List[string]
$Script:UserLines  = New-Object System.Collections.Generic.List[string]
$Script:AssetLines = New-Object System.Collections.Generic.List[string]
$Script:Errors     = New-Object System.Collections.Generic.List[string]

# *** Helpers ***

function Add-Line([string] $Bucket, [string] $Text) {
    switch ($Bucket) {
        'user'   { $Script:UserLines.Add($Text) | Out-Null }
        'asset'  { $Script:AssetLines.Add($Text) | Out-Null }
        'error'  { $Script:Errors.Add($Text) | Out-Null }
        default  { $Script:Lines.Add($Text) | Out-Null }
    }
    Write-Verbose $Text
}

function Get-UserSlug([string] $Raw) {
    # *** Lowercase + kebab-case + ASCII-only slug per per-user-folder-rules.md ***
    if ($null -eq $Raw) { return '' }
    $s = $Raw.ToString().Trim().ToLowerInvariant()
    $s = $s -replace "[\s_]+", '-'
    $s = $s -replace "[^a-z0-9-]", ''
    $s = $s -replace "-+", '-'
    $s = $s.Trim('-')
    return $s
}

function Test-Whitelisted([string] $Url) {
    # *** Origin whitelist check ***
    try {
        $u = [System.Uri] $Url
    } catch {
        return $false
    }
    $h = $u.Host.ToLowerInvariant()
    foreach ($suffix in $AllowedHostSuffixes) {
        if ($h -eq $suffix -or $h.EndsWith('.' + $suffix)) { return $true }
    }
    return $false
}

function Get-ExtFromUrl([string] $Url) {
    try {
        $u = [System.Uri] $Url
        $path = $u.AbsolutePath
        $ext = [System.IO.Path]::GetExtension($path).ToLowerInvariant()
        return $ext
    } catch {
        return ''
    }
}

function Get-FilenameFromUrl([string] $Url) {
    try {
        $u = [System.Uri] $Url
        $name = [System.IO.Path]::GetFileName($u.AbsolutePath)
        $name = [System.Uri]::UnescapeDataString($name)
        # *** Windows-safe sanitization ***
        $name = $name -replace "[^A-Za-z0-9._-]", '_'
        if ([string]::IsNullOrWhiteSpace($name)) { return $null }
        return $name
    } catch {
        return $null
    }
}

function Read-AttachmentUrls([string] $AttachmentsPath) {
    # *** Returns a list of @{ Url; Filename } objects parsed from a module's attachments.md. ***
    # *** Matches: bare http(s) URLs, markdown links [text](url), and "filename:" annotations. ***
    $out = New-Object System.Collections.Generic.List[object]
    if (-not (Test-Path -LiteralPath $AttachmentsPath)) { return $out }

    $text = Get-Content -LiteralPath $AttachmentsPath -Raw -ErrorAction Stop

    # *** Markdown links first so we can pair filename hints with URLs ***
    $mdMatches = [regex]::Matches($text, '\[([^\]]+)\]\((https?://[^\s)]+)\)')
    foreach ($m in $mdMatches) {
        $hint = $m.Groups[1].Value.Trim()
        $url  = $m.Groups[2].Value.Trim()
        $obj = New-Object psobject -Property @{ Url = $url; Filename = $hint }
        $out.Add($obj) | Out-Null
    }

    # *** Bare URLs (skip those already captured above) ***
    $seen = New-Object System.Collections.Generic.HashSet[string]
    foreach ($o in $out) { [void] $seen.Add($o.Url) }
    $bareMatches = [regex]::Matches($text, 'https?://[^\s)<>\"\]]+')
    foreach ($m in $bareMatches) {
        $url = $m.Value.TrimEnd('.', ',', ';')
        if (-not $seen.Contains($url)) {
            $obj = New-Object psobject -Property @{ Url = $url; Filename = $null }
            $out.Add($obj) | Out-Null
            [void] $seen.Add($url)
        }
    }

    return $out
}

function Read-PrdAssignees([string] $LatestPrdPath) {
    # *** Greps a module's latest-prd.md for assignee/owner/pm/requested_by fields. ***
    $names = New-Object System.Collections.Generic.List[string]
    if (-not (Test-Path -LiteralPath $LatestPrdPath)) { return $names }

    $text = Get-Content -LiteralPath $LatestPrdPath -Raw -ErrorAction Stop

    $patterns = @(
        '(?im)^\s*-?\s*\*?\*?(assignee|owner|pm|requested[\s_-]?by)\*?\*?\s*[:=]\s*(.+?)\s*$'
    )
    foreach ($p in $patterns) {
        $matches = [regex]::Matches($text, $p)
        foreach ($m in $matches) {
            $val = $m.Groups[2].Value.Trim().Trim('`','"','*')
            if ($val) { $names.Add($val) | Out-Null }
        }
    }
    return $names
}

function Ensure-UserFolder([string] $RawName) {
    # *** Per per-user-folder-rules.md ***
    $slug = Get-UserSlug $RawName
    if (-not $slug) {
        Add-Line 'user' "USER_FOLDER_SKIPPED: empty-slug (source: ""$RawName"")"
        return
    }

    $userDir = Join-Path $UsersRoot $slug
    if (Test-Path -LiteralPath $userDir) {
        Add-Line 'user' "USER_FOLDER_KEPT: $slug"
        return
    }

    New-Item -ItemType Directory -Force -Path $userDir | Out-Null
    $placeholder = '<!-- placeholder; per-user PRD slice not yet generated -->'
    $latest = Join-Path $userDir 'latest-prd.md'
    $gitkeep = Join-Path $userDir '.gitkeep'
    Set-Content -LiteralPath $latest -Value $placeholder -Encoding UTF8 -NoNewline:$false
    Set-Content -LiteralPath $gitkeep -Value '' -Encoding UTF8 -NoNewline:$true
    Add-Line 'user' "USER_FOLDER_CREATED: $slug"
}

function Get-AssetSidecar([string] $AssetPath) { return ($AssetPath + '.etag') }

function Save-Asset(
    [string] $ModuleSlug,
    [string] $Url,
    [string] $FilenameHint
) {
    # *** Per asset-download-rules.md ***

    if (-not (Test-Whitelisted $Url)) {
        Add-Line 'asset' "ASSET_SKIPPED: untrusted-origin ($Url)"
        return
    }

    $ext = Get-ExtFromUrl $Url
    if (-not ($AllowedExt -contains $ext)) {
        Add-Line 'asset' "ASSET_SKIPPED: unsupported-ext ($Url)"
        return
    }

    $fname = $null
    if ($FilenameHint) {
        $candidate = $FilenameHint -replace "[^A-Za-z0-9._-]", '_'
        if ([System.IO.Path]::GetExtension($candidate).ToLowerInvariant() -eq $ext) {
            $fname = $candidate
        }
    }
    if (-not $fname) { $fname = Get-FilenameFromUrl $Url }
    if (-not $fname) {
        Add-Line 'asset' "ASSET_FAILED: cannot-derive-filename ($Url)"
        return
    }

    $assetsDir = Join-Path $ModulesRoot (Join-Path $ModuleSlug 'assets')
    New-Item -ItemType Directory -Force -Path $assetsDir | Out-Null
    $dest = Join-Path $assetsDir $fname
    $sidecar = Get-AssetSidecar $dest

    # *** HEAD probe for size + ETag ***
    $remoteEtag = $null
    $remoteLen  = $null
    try {
        $head = Invoke-WebRequest -Uri $Url -Method Head -UseBasicParsing -TimeoutSec $RequestTimeoutSec
        if ($head.Headers.ContainsKey('ETag')) {
            $remoteEtag = ([string] $head.Headers['ETag']).Trim('"',' ')
        }
        if ($head.Headers.ContainsKey('Content-Length')) {
            $remoteLen = [int64] ([string] $head.Headers['Content-Length'])
        }
    } catch {
        # *** Head failures are non-fatal — fall through to GET ***
    }

    if ($remoteLen -and ($remoteLen -gt $MaxFileBytes)) {
        Add-Line 'asset' "ASSET_SKIPPED: too-large ($Url)"
        return
    }

    $existed = Test-Path -LiteralPath $dest
    if ($existed) {
        if ($remoteEtag -and (Test-Path -LiteralPath $sidecar)) {
            $localEtag = (Get-Content -LiteralPath $sidecar -Raw -ErrorAction SilentlyContinue).Trim()
            if ($localEtag -and ($localEtag -eq $remoteEtag)) {
                Add-Line 'asset' "ASSET_SKIPPED: unchanged-etag ($ModuleSlug/$fname)"
                return
            }
        } elseif ($remoteLen) {
            $localLen = (Get-Item -LiteralPath $dest).Length
            if ($localLen -eq $remoteLen) {
                Add-Line 'asset' "ASSET_SKIPPED: unchanged-size ($ModuleSlug/$fname)"
                return
            }
        }
    }

    # *** Download to a temp file then move (atomic-ish on same volume) ***
    $tmp = $dest + '.tmp'
    try {
        Invoke-WebRequest -Uri $Url -OutFile $tmp -UseBasicParsing -TimeoutSec $RequestTimeoutSec | Out-Null
    } catch {
        Add-Line 'asset' "ASSET_FAILED: $($_.Exception.Message -replace '[\r\n]+',' ') ($Url)"
        if (Test-Path -LiteralPath $tmp) { Remove-Item -LiteralPath $tmp -Force -ErrorAction SilentlyContinue }
        return
    }

    if (-not (Test-Path -LiteralPath $tmp)) {
        Add-Line 'asset' "ASSET_FAILED: no-output ($Url)"
        return
    }

    $tmpLen = (Get-Item -LiteralPath $tmp).Length
    if ($tmpLen -gt $MaxFileBytes) {
        Remove-Item -LiteralPath $tmp -Force -ErrorAction SilentlyContinue
        Add-Line 'asset' "ASSET_SKIPPED: too-large ($Url)"
        return
    }

    if ($existed) {
        Move-Item -LiteralPath $tmp -Destination $dest -Force
        Add-Line 'asset' "ASSET_OVERWROTE: $ModuleSlug/$fname ($tmpLen B)"
    } else {
        Move-Item -LiteralPath $tmp -Destination $dest -Force
        Add-Line 'asset' "ASSET_DOWNLOADED: $ModuleSlug/$fname ($tmpLen B)"
    }

    if ($remoteEtag) {
        Set-Content -LiteralPath $sidecar -Value $remoteEtag -Encoding UTF8 -NoNewline:$true
    }
}

function Get-ModuleSlugs() {
    # *** Returns all <module-slug> directories under modules/, excluding the users/ shared root ***
    if (-not (Test-Path -LiteralPath $ModulesRoot)) { return @() }
    Get-ChildItem -LiteralPath $ModulesRoot -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -ne 'users' } |
        ForEach-Object { $_.Name }
}

function Write-AtomicFile([string] $Path, [string] $Content) {
    $dir = Split-Path -Parent $Path
    if ($dir -and -not (Test-Path -LiteralPath $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
    $tmp = $Path + '.tmp'
    Set-Content -LiteralPath $tmp -Value $Content -Encoding UTF8
    Move-Item -LiteralPath $tmp -Destination $Path -Force
}

# *** Step (c): per-user folder ensure ***

function Invoke-UserFolderStep() {
    if ($SkipUserFolders) {
        Add-Line 'user' 'SKIPPED: -SkipUserFolders flag set'
        return
    }
    if (-not (Test-Path -LiteralPath $ModulesRoot)) {
        Add-Line 'error' "modules-root-missing: $ModulesRoot"
        return
    }
    New-Item -ItemType Directory -Force -Path $UsersRoot | Out-Null

    foreach ($slug in Get-ModuleSlugs) {
        $latest = Join-Path $ModulesRoot (Join-Path $slug 'latest-prd.md')
        $names  = Read-PrdAssignees $latest
        foreach ($n in $names) { Ensure-UserFolder $n }
    }
}

# *** Step (d): asset download ***

function Invoke-AssetStep() {
    if ($SkipAssets) {
        Add-Line 'asset' 'SKIPPED: -SkipAssets flag set'
        return
    }
    if (-not (Test-Path -LiteralPath $ModulesRoot)) {
        Add-Line 'error' "modules-root-missing: $ModulesRoot"
        return
    }

    foreach ($slug in Get-ModuleSlugs) {
        $att = Join-Path $ModulesRoot (Join-Path $slug 'attachments.md')
        $urls = Read-AttachmentUrls $att
        if ($urls.Count -eq 0) { continue }
        foreach ($u in $urls) {
            Save-Asset -ModuleSlug $slug -Url $u.Url -FilenameHint $u.Filename
        }
    }
}

# *** Step (e): atomic report write ***

function Write-Report() {
    $now = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')

    $sb = New-Object System.Text.StringBuilder
    [void] $sb.AppendLine('*** sync-report ***')
    [void] $sb.AppendLine('*** Generated by Brain/scripts/sync-orchestrator.ps1 ***')
    [void] $sb.AppendLine('')
    [void] $sb.AppendLine('# Sync Report')
    [void] $sb.AppendLine('')
    [void] $sb.AppendLine("Generated: $now")
    [void] $sb.AppendLine('')
    [void] $sb.AppendLine('## Steps a + b (skill-owned)')
    [void] $sb.AppendLine('')
    [void] $sb.AppendLine('Wiki and PRD syncs are owned by `wiki-knowledge` and `prd-knowledge` skills.')
    [void] $sb.AppendLine('Their own UPDATES.md files capture per-skill output. This orchestrator only')
    [void] $sb.AppendLine('post-processes their results.')
    [void] $sb.AppendLine('')
    [void] $sb.AppendLine('## Step c — Per-user folders')
    [void] $sb.AppendLine('')
    if ($Script:UserLines.Count -eq 0) {
        [void] $sb.AppendLine('_No user folder actions._')
    } else {
        foreach ($l in $Script:UserLines) { [void] $sb.AppendLine($l) }
    }
    [void] $sb.AppendLine('')
    [void] $sb.AppendLine('## Step d — Asset downloads')
    [void] $sb.AppendLine('')
    if ($Script:AssetLines.Count -eq 0) {
        [void] $sb.AppendLine('_No asset actions._')
    } else {
        foreach ($l in $Script:AssetLines) { [void] $sb.AppendLine($l) }
    }
    [void] $sb.AppendLine('')
    [void] $sb.AppendLine('## Errors')
    [void] $sb.AppendLine('')
    if ($Script:Errors.Count -eq 0) {
        [void] $sb.AppendLine('_None._')
    } else {
        foreach ($l in $Script:Errors) { [void] $sb.AppendLine($l) }
    }
    [void] $sb.AppendLine('')
    [void] $sb.AppendLine('## Summary')
    [void] $sb.AppendLine('')
    $userCount  = $Script:UserLines.Count
    $assetCount = $Script:AssetLines.Count
    $errCount   = $Script:Errors.Count
    [void] $sb.AppendLine("- User-folder actions: $userCount")
    [void] $sb.AppendLine("- Asset actions:       $assetCount")
    [void] $sb.AppendLine("- Errors:              $errCount")

    Write-AtomicFile -Path $ReportPath -Content $sb.ToString()
    Write-Output "sync-report written: $ReportPath"
}

# *** Main ***

Invoke-UserFolderStep
Invoke-AssetStep
Write-Report
