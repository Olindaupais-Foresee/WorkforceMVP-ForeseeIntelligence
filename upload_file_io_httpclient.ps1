$file = 'c:\Users\Olinda\Downloads\workforce_mvp_mvp.zip'
$output = Join-Path $PSScriptRoot 'upload_output.txt'

try {
    Add-Type -AssemblyName System.Net.Http
    $client = New-Object System.Net.Http.HttpClient
    $multipart = New-Object System.Net.Http.MultipartFormDataContent
    $stream = [System.IO.File]::OpenRead($file)
    $fileContent = New-Object System.Net.Http.StreamContent($stream)
    $fileContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse('application/zip')
    $multipart.Add($fileContent, 'file', 'workforce_mvp_mvp.zip')

    $response = $client.PostAsync('https://file.io', $multipart).Result
    $body = $response.Content.ReadAsStringAsync().Result
    Set-Content -Path $output -Value $body -Encoding UTF8
} catch {
    $errorMsg = "ERROR: $($_.Exception.Message)"
    if ($_.Exception.InnerException) { $errorMsg += "`nINNER: $($_.Exception.InnerException.Message)" }
    Set-Content -Path $output -Value $errorMsg -Encoding UTF8
} finally {
    if ($stream) { $stream.Dispose() }
    if ($multipart) { $multipart.Dispose() }
    if ($client) { $client.Dispose() }
}
