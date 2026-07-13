$users = @(
  "pilot-us-19-owner","pilot-us-19-admin","pilot-us-19-user","pilot-us-19-disabled-1",
  "pilot-us-20-owner","pilot-us-21-owner","pilot-us-22-owner","pilot-us-23-owner","pilot-us-24-owner",
  "ammartest-owner","user-name"
)
$pwd = "Admin@1234"
foreach ($u in $users) {
  $body = @{ userName = $u; password = $pwd } | ConvertTo-Json -Compress
  try {
    $r = Invoke-RestMethod -Uri "http://localhost:7777/api/auth/login" -Method Post -ContentType "application/json" -Body $body -ErrorAction Stop
    $stage = $r.result.stage
    $ok = $r.isSuccessful
    Write-Output ("{0,-26} => OK={1}  stage={2}" -f $u, $ok, $stage)
  } catch {
    $msg = $_.ErrorDetails.Message
    if (-not $msg) { $msg = $_.Exception.Message }
    $msg = ($msg -replace "\s+", " ")
    if ($msg.Length -gt 160) { $msg = $msg.Substring(0,160) }
    Write-Output ("{0,-26} => FAIL: {1}" -f $u, $msg)
  }
}
