$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$loginBody = '{"username":"sysadmin","password":"Admin@1234"}'
$login = Invoke-RestMethod -Method Post -Uri "http://localhost:7777/api/auth/login" -ContentType "application/json" -Body $loginBody
$token = $login.result.tokens.accessToken
$headers = @{ Authorization = "Bearer $token" }
$acc = "000000000000000000a11001"

$SurveyPro     = "695a304f901bb7d4a830d0dd"
$CampaignEngine= "695a304f901bb7d4a830d0e1"
$AnalyticsSuite= "695a304f901bb7d4a830d101"
$WhatsApp = "695a304f901bb7d4a830d0e2"
$EmailRelay="695a304f901bb7d4a830d111"

$contracts = @(
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

$first = $true
foreach ($c in $contracts) {
  if (-not $first) { Start-Sleep -Seconds 2 }  # advance ObjectId timestamp so contractId (= ts prefix) differs
  $first = $false
  $body = $c | ConvertTo-Json -Depth 8
  try {
    $resp = Invoke-RestMethod -Method Post -Uri "http://localhost:7045/api/Contracts" -ContentType "application/json" -Headers $headers -Body $body
    $r = $resp.result
    Write-Host ("CREATED  '{0}'  -> contractId={1}  status={2}  currency={3}  rates={4}" -f $c.ContractName, $r.contractId, $r.status, $r.currency, ($r.tariffPlan.rates).Count)
  } catch {
    $msg = $_.ErrorDetails.Message; if (-not $msg) { $msg = $_.Exception.Message }
    Write-Host ("FAILED   '{0}'  -> {1}" -f $c.ContractName, $msg) -ForegroundColor Red
  }
}
