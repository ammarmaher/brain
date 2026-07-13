$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# --- 1. Login as sysadmin (Falcon user) ---
$loginBody = '{"username":"sysadmin","password":"Admin@1234"}'
$login = Invoke-RestMethod -Method Post -Uri "http://localhost:7777/api/auth/login" -ContentType "application/json" -Body $loginBody
$token = $login.result.tokens.accessToken
if ([string]::IsNullOrWhiteSpace($token)) { throw "No access token returned from login" }
Write-Host "Logged in as sysadmin. Token acquired (len=$($token.Length))."

$headers = @{ Authorization = "Bearer $token" }
$acc = "000000000000000000a11001"

# Catalog IDs (global, validated server-side)
$BasicSendApp  = "695a304f901bb7d4a830d0dc"
$SurveyPro     = "695a304f901bb7d4a830d0dd"
$CampaignEngine= "695a304f901bb7d4a830d0e1"
$AnalyticsSuite= "695a304f901bb7d4a830d101"
$Voice    = "695a304f901bb7d4a830d0de"
$SMS      = "695a304f901bb7d4a830d110"
$WhatsApp = "695a304f901bb7d4a830d0e2"
$EmailRelay="695a304f901bb7d4a830d111"

# --- 2. Define 3 sensible test contracts ---
$contracts = @(
  @{
    AccountId = $acc
    ContractName = "TT001 Voice & SMS Bundle 2026"
    FarabiReferenceId = "TT001-TEST-001"
    StartDate = "2026-06-01T00:00:00Z"
    EndDate   = "2027-06-01T00:00:00Z"
    CommittedValue = 500000
    Currency = 1
    Rates = @(
      @{ ApplicationId=$BasicSendApp; ChannelId=$Voice; Priority="High";   Destination="KSA"; Unit="Second";  RatePerUnit=1.75 }
      @{ ApplicationId=$BasicSendApp; ChannelId=$Voice; Priority="Normal"; Destination="KSA"; Unit="Second";  RatePerUnit=1.10 }
      @{ ApplicationId=$BasicSendApp; ChannelId=$SMS;   Priority="Normal"; Destination="KSA"; Unit="Message"; RatePerUnit=0.25 }
    )
  },
  @{
    AccountId = $acc
    ContractName = "TT001 WhatsApp Engagement H2 2026"
    FarabiReferenceId = "TT001-TEST-002"
    StartDate = "2026-07-01T00:00:00Z"
    EndDate   = "2026-12-31T00:00:00Z"
    CommittedValue = 250000
    Currency = 1
    Rates = @(
      @{ ApplicationId=$CampaignEngine; ChannelId=$WhatsApp; Priority="High";   Destination="KSA"; Unit="Message"; RatePerUnit=0.40 }
      @{ ApplicationId=$SurveyPro;      ChannelId=$WhatsApp; Priority="Normal"; Destination="KSA"; Unit="Message"; RatePerUnit=0.30 }
    )
  },
  @{
    AccountId = $acc
    ContractName = "TT001 Email Relay Annual 2026"
    FarabiReferenceId = "TT001-TEST-003"
    StartDate = "2026-08-01T00:00:00Z"
    EndDate   = "2027-07-31T00:00:00Z"
    CommittedValue = 100000
    Currency = 1
    Rates = @(
      @{ ApplicationId=$AnalyticsSuite; ChannelId=$EmailRelay; Priority="Normal"; Destination="KSA"; Unit="Message"; RatePerUnit=0.05 }
    )
  }
)

# --- 3. POST each contract ---
$results = @()
foreach ($c in $contracts) {
  $body = $c | ConvertTo-Json -Depth 8
  try {
    $resp = Invoke-RestMethod -Method Post -Uri "http://localhost:7045/api/Contracts" -ContentType "application/json" -Headers $headers -Body $body
    $r = $resp.result
    Write-Host ("CREATED  '{0}'  -> contractId={1}  status={2}  currency={3}  rates={4}" -f $c.ContractName, $r.contractId, $r.status, $r.currency, ($r.tariffPlan.rates).Count)
    $results += [pscustomobject]@{ Name=$c.ContractName; ContractId=$r.contractId; Status=$r.status; Ok=$true }
  } catch {
    $msg = $_.ErrorDetails.Message
    if (-not $msg) { $msg = $_.Exception.Message }
    Write-Host ("FAILED   '{0}'  -> {1}" -f $c.ContractName, $msg) -ForegroundColor Red
    $results += [pscustomobject]@{ Name=$c.ContractName; ContractId=$null; Status="FAILED"; Ok=$false; Error=$msg }
  }
}

Write-Host "`n=== SUMMARY ==="
$results | Format-Table -AutoSize
