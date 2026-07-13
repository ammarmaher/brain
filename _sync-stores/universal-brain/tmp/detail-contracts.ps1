$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# --- login as sysadmin ---
$login = Invoke-RestMethod -Method Post -Uri "http://localhost:7777/api/auth/login" -ContentType "application/json" -Body '{"username":"sysadmin","password":"Admin@1234"}'
$token = $login.result.tokens.accessToken
$headers = @{ Authorization = "Bearer $token" }
Write-Host "Logged in as sysadmin (token len=$($token.Length))."

# catalog ids
$BasicSendApp="695a304f901bb7d4a830d0dc"; $SurveyPro="695a304f901bb7d4a830d0dd"
$CampaignEngine="695a304f901bb7d4a830d0e1"; $AnalyticsSuite="695a304f901bb7d4a830d101"
$Voice="695a304f901bb7d4a830d0de"; $SMS="695a304f901bb7d4a830d110"
$WhatsApp="695a304f901bb7d4a830d0e2"; $EmailRelay="695a304f901bb7d4a830d111"

# ============ Contract 1: Voice & SMS Bundle (Active) ============
$c1 = @{
  ContractName="TT001 Voice & SMS Bundle 2026"; FarabiReferenceId="TT001-TEST-001"
  StartDate="2026-06-01T00:00:00Z"; EndDate="2027-06-01T00:00:00Z"
  CommittedValue=500000; Currency=1
  Rates=@(
    @{ApplicationId=$BasicSendApp;ChannelId=$Voice;Priority="HIGH";Destination="KSA";Unit="SECOND";RatePerUnit=1.75}
    @{ApplicationId=$BasicSendApp;ChannelId=$Voice;Priority="NORMAL";Destination="KSA";Unit="SECOND";RatePerUnit=1.10}
    @{ApplicationId=$BasicSendApp;ChannelId=$SMS;Priority="NORMAL";Destination="KSA";Unit="MESSAGE";RatePerUnit=0.25}
    @{ApplicationId=$BasicSendApp;ChannelId=$SMS;Priority="UTILITY";Destination="KSA";Unit="MESSAGE";RatePerUnit=0.18}
    @{ApplicationId=$BasicSendApp;ChannelId=$SMS;Priority="NORMAL";Destination="ARE";Unit="MESSAGE";RatePerUnit=0.40}
  )
  UnitConversions=@(
    @{Code="VOICE";Name="Voice";PriceUnit="ONE_KSA_SECOND";RatingUnit="SECOND";PriceValue=1.00}
    @{Code="SMS";Name="SMS";PriceUnit="ONE_KSA_MESSAGE";RatingUnit="MESSAGE";PriceValue=0.20}
  )
  Quotas=@(
    @{QuotaCode="VOICE_USAGE";ChannelId=$Voice;IncludedAmount=50000;IncludedUnits=0;Unit="SAR";QuotaCategory="USAGE";QuotaType="FREE_CREDIT";Scope="ACCOUNT";SubService=""}
    @{QuotaCode="VOICE_NUMBER";ChannelId=$Voice;IncludedAmount=0;IncludedUnits=50;Unit="NUMBER";QuotaCategory="SUB_SERVICE";QuotaType="CREDIT_POOL";Scope="ACCOUNT";SubService="VOICE_NUMBER"}
    @{QuotaCode="SMS_SENDER_NAME";ChannelId=$SMS;IncludedAmount=0;IncludedUnits=10;Unit="SENDER_NAME";QuotaCategory="SUB_SERVICE";QuotaType="CREDIT_POOL";Scope="ACCOUNT";SubService="SMS_SENDER_NAME"}
    @{QuotaCode="SHORT_CODE";ChannelId=$SMS;IncludedAmount=0;IncludedUnits=5;Unit="SHORT_CODE";QuotaCategory="SUB_SERVICE";QuotaType="CREDIT_POOL";Scope="ACCOUNT";SubService="SHORT_CODE"}
  )
  OverageRates=@(
    @{SubService="VOICE_NUMBER";ChannelId=$Voice;Unit="NUMBER";UnitPrice=150;BillingCycle="MONTHLY"}
    @{SubService="SMS_SENDER_NAME";ChannelId=$SMS;Unit="SENDER_NAME";UnitPrice=200;BillingCycle="MONTHLY"}
    @{SubService="SHORT_CODE";ChannelId=$SMS;Unit="SHORT_CODE";UnitPrice=1000;BillingCycle="MONTHLY"}
  )
}

# ============ Contract 2: WhatsApp Engagement (Pending) ============
$c2 = @{
  ContractName="TT001 WhatsApp Engagement H2 2026"; FarabiReferenceId="TT001-TEST-002"
  StartDate="2026-07-01T00:00:00Z"; EndDate="2026-12-31T00:00:00Z"
  CommittedValue=250000; Currency=1
  Rates=@(
    @{ApplicationId=$CampaignEngine;ChannelId=$WhatsApp;Priority="ADVERTISEMENT";Destination="KSA";Unit="MESSAGE";RatePerUnit=0.40}
    @{ApplicationId=$CampaignEngine;ChannelId=$WhatsApp;Priority="UTILITY";Destination="KSA";Unit="MESSAGE";RatePerUnit=0.18}
    @{ApplicationId=$CampaignEngine;ChannelId=$WhatsApp;Priority="AUTHENTICATION";Destination="KSA";Unit="MESSAGE";RatePerUnit=0.22}
    @{ApplicationId=$SurveyPro;ChannelId=$WhatsApp;Priority="SERVICE";Destination="KSA";Unit="MESSAGE";RatePerUnit=0.15}
    @{ApplicationId=$SurveyPro;ChannelId=$WhatsApp;Priority="ADVERTISEMENT";Destination="ARE";Unit="MESSAGE";RatePerUnit=0.55}
  )
  UnitConversions=@(
    @{Code="WHATSAPP";Name="WhatsApp";PriceUnit="ONE_KSA_TRANSACTION";RatingUnit="MESSAGE";PriceValue=0.30}
  )
  Quotas=@(
    @{QuotaCode="WHATSAPP_MESSAGE";ChannelId=$WhatsApp;IncludedAmount=100000;IncludedUnits=0;Unit="SAR";QuotaCategory="USAGE";QuotaType="FREE_CREDIT";Scope="ACCOUNT";SubService=""}
    @{QuotaCode="WHATSAPP_TEMPLATE";ChannelId=$WhatsApp;IncludedAmount=0;IncludedUnits=500;Unit="TEMPLATE";QuotaCategory="SUB_SERVICE";QuotaType="CREDIT_POOL";Scope="ACCOUNT";SubService="WHATSAPP_TEMPLATE"}
  )
  OverageRates=@(
    @{SubService="WHATSAPP_TEMPLATE";ChannelId=$WhatsApp;Unit="TEMPLATE";UnitPrice=25;BillingCycle="PER_USE"}
  )
}

# ============ Contract 3: Email Relay Annual (Pending) ============
$c3 = @{
  ContractName="TT001 Email Relay Annual 2026"; FarabiReferenceId="TT001-TEST-003"
  StartDate="2026-08-01T00:00:00Z"; EndDate="2027-07-31T00:00:00Z"
  CommittedValue=100000; Currency=1
  Rates=@(
    @{ApplicationId=$AnalyticsSuite;ChannelId=$EmailRelay;Priority="NORMAL";Destination="KSA";Unit="MESSAGE";RatePerUnit=0.05}
    @{ApplicationId=$AnalyticsSuite;ChannelId=$EmailRelay;Priority="UTILITY";Destination="KSA";Unit="MESSAGE";RatePerUnit=0.03}
    @{ApplicationId=$AnalyticsSuite;ChannelId=$EmailRelay;Priority="ADVERTISEMENT";Destination="KSA";Unit="MESSAGE";RatePerUnit=0.08}
    @{ApplicationId=$AnalyticsSuite;ChannelId=$EmailRelay;Priority="NORMAL";Destination="ARE";Unit="MESSAGE";RatePerUnit=0.07}
  )
  UnitConversions=@(
    @{Code="EMAIL";Name="Email Relay";PriceUnit="ONE_KSA_EMAIL";RatingUnit="MESSAGE";PriceValue=0.04}
  )
  Quotas=@(
    @{QuotaCode="EMAIL_USAGE";ChannelId=$EmailRelay;IncludedAmount=20000;IncludedUnits=0;Unit="SAR";QuotaCategory="USAGE";QuotaType="FREE_CREDIT";Scope="ACCOUNT";SubService=""}
    @{QuotaCode="EMAIL_DEDICATED_IP";ChannelId=$EmailRelay;IncludedAmount=0;IncludedUnits=2;Unit="IP_ADDRESS";QuotaCategory="SUB_SERVICE";QuotaType="CREDIT_POOL";Scope="ACCOUNT";SubService="EMAIL_DEDICATED_IP"}
  )
  OverageRates=@(
    @{SubService="EMAIL_DEDICATED_IP";ChannelId=$EmailRelay;Unit="IP_ADDRESS";UnitPrice=500;BillingCycle="MONTHLY"}
  )
}

$targets = @(
  @{ id="CTR-6A3D028C"; body=$c1 },
  @{ id="CTR-6A3D02D7"; body=$c2 },
  @{ id="CTR-6A3D02D9"; body=$c3 }
)

foreach ($t in $targets) {
  $json = $t.body | ConvertTo-Json -Depth 10
  try {
    $resp = Invoke-RestMethod -Method Put -Uri "http://localhost:7045/api/Contracts/$($t.id)" -ContentType "application/json" -Headers $headers -Body $json
    $r = $resp.result
    Write-Host ("UPDATED  {0} '{1}'  status={2}  rates={3}  unitConv={4}  quotas={5}  overage={6}" -f `
      $t.id, $r.contractName, $r.status, $r.tariffPlan.rates.Count, $r.tariffPlan.unitConversions.Count, $r.tariffPlan.quotas.Count, $r.tariffPlan.overageRates.Count)
  } catch {
    $msg = $_.ErrorDetails.Message; if (-not $msg) { $msg = $_.Exception.Message }
    Write-Host ("FAILED   {0} -> {1}" -f $t.id, $msg) -ForegroundColor Red
  }
}
