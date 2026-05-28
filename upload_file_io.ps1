$file = 'c:\Users\Olinda\Downloads\workforce_mvp_mvp.zip'
$boundary = '----WebKitFormBoundary' + ([System.Guid]::NewGuid().ToString('N'))
$header = "--$boundary`r`n"
$header += "Content-Disposition: form-data; name=""file""; filename=""workforce_mvp_mvp.zip""`r`n"
$header += "Content-Type: application/zip`r`n`r`n"
$footer = "`r`n--$boundary--`r`n"

$h = [System.Text.Encoding]::ASCII.GetBytes($header)
$f = [System.Text.Encoding]::ASCII.GetBytes($footer)
$b = [System.IO.File]::ReadAllBytes($file)
$body = New-Object byte[] ($h.Length + $b.Length + $f.Length)
[System.Buffer]::BlockCopy($h, 0, $body, 0, $h.Length)
[System.Buffer]::BlockCopy($b, 0, $body, $h.Length, $b.Length)
[System.Buffer]::BlockCopy($f, 0, $body, $h.Length + $b.Length, $f.Length)

try {
    $response = Invoke-RestMethod -Uri 'https://file.io' -Method Post -Body $body -ContentType "multipart/form-data; boundary=$boundary" -TimeoutSec 60
    $responseJson = $response | ConvertTo-Json
    Set-Content -Path "$PSScriptRoot\upload_output.txt" -Value $responseJson -Encoding UTF8
} catch {
    $errorMsg = "ERROR: $($_.Exception.Message)"
    if ($_.Exception.InnerException) { $errorMsg += "`nINNER: $($_.Exception.InnerException.Message)" }
    Set-Content -Path "$PSScriptRoot\upload_output.txt" -Value $errorMsg -Encoding UTF8
}
