$file = 'c:\Users\Olinda\Downloads\workforce_mvp_mvp.zip'
$output = Join-Path $PSScriptRoot 'upload_transfer_output.txt'
$url = 'https://transfer.sh/workforce_mvp_mvp.zip'

$client = $null
$stream = $null
$content = $null
try {
    Add-Type -AssemblyName System.Net.Http
    $client = New-Object System.Net.Http.HttpClient
    $stream = [System.IO.File]::OpenRead($file)
    $content = New-Object System.Net.Http.StreamContent($stream)
    $content.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse('application/octet-stream')

    $response = $client.PutAsync($url, $content).Result
    $body = $response.Content.ReadAsStringAsync().Result
    Set-Content -Path $output -Value $body -Encoding UTF8
} catch {
    $errorMsg = "ERROR: $($_.Exception.Message)"
    if ($_.Exception.InnerException) { $errorMsg += "`nINNER: $($_.Exception.InnerException.Message)" }
    Set-Content -Path $output -Value $errorMsg -Encoding UTF8
} finally {
    if ($null -ne $stream) { $stream.Dispose() }
    if ($null -ne $content) { $content.Dispose() }
    if ($null -ne $client) { $client.Dispose() }
}
