param(
    [Parameter(Mandatory=$true)]
    [string]$Owner,

    [Parameter(Mandatory=$true)]
    [string]$Repo,

    [Parameter(Mandatory=$true)]
    [string]$Token,

    [string]$BasePath = (Get-Location).Path,
    [string]$Branch,
    [string]$CommitMessage = 'Upload workspace via GitHub API',
    [string[]]$Ignore = @('.git', 'node_modules', '.DS_Store')
)

function Get-RepoMetadata {
    param($Owner, $Repo, $Headers)
    $uri = "https://api.github.com/repos/$Owner/$Repo"
    try {
        return Invoke-RestMethod -Uri $uri -Headers $Headers -Method Get -ErrorAction Stop
    } catch {
        return $null
    }
}

function Get-FileSha {
    param($Owner, $Repo, $Path, $Headers, $Branch)
    $uri = "https://api.github.com/repos/$Owner/$Repo/contents/$Path"
    if ($Branch) { $uri += "?ref=$Branch" }
    try {
        $resp = Invoke-RestMethod -Uri $uri -Headers $Headers -Method Get -ErrorAction Stop
        return $resp.sha
    } catch {
        return $null
    }
}

function Normalize-RelativePath {
    param($FullPath, $BasePath)
    $relative = Resolve-Path $FullPath | ForEach-Object { $_.Path.Substring((Resolve-Path $BasePath).Path.Length).TrimStart('\', '/') }
    return $relative -replace '\\', '/'
}

$headers = @{
    Authorization = "Bearer $Token"
    Accept = 'application/vnd.github+json'
    'X-GitHub-Api-Version' = '2022-11-28'
}

$repoMeta = Get-RepoMetadata -Owner $Owner -Repo $Repo -Headers $headers
if (-not $repoMeta) {
    Write-Error "Repository '$Owner/$Repo' not found or inaccessible with the provided token."
    exit 1
}

if (-not $Branch) {
    $Branch = $repoMeta.default_branch
}

Write-Host "Uploading files to $Owner/$Repo on branch '$Branch'..."

$files = Get-ChildItem -Path $BasePath -Recurse -File | Where-Object {
    $relative = Normalize-RelativePath -FullPath $_.FullName -BasePath $BasePath
    foreach ($ignoreItem in $Ignore) {
        if ($relative -like "$ignoreItem*" -or $relative -match "(^|/)${ignoreItem}(/|$)") {
            return $false
        }
    }
    return $true
}

foreach ($file in $files) {
    $relativePath = Normalize-RelativePath -FullPath $file.FullName -BasePath $BasePath
    $contentBytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $base64 = [Convert]::ToBase64String($contentBytes)

    $body = [ordered]@{
        message = "${CommitMessage}: $relativePath"
        content = $base64
        branch = $Branch
    }

    $sha = Get-FileSha -Owner $Owner -Repo $Repo -Path $relativePath -Headers $headers -Branch $Branch
    if ($sha) {
        $body.sha = $sha
    }

    $jsonBody = $body | ConvertTo-Json -Depth 4
    $uri = "https://api.github.com/repos/$Owner/$Repo/contents/$relativePath"

    try {
        $resp = Invoke-RestMethod -Uri $uri -Headers $headers -Method Put -Body $jsonBody -ContentType 'application/json' -ErrorAction Stop
        if ($sha) {
            Write-Host "Updated: $relativePath"
        } else {
            Write-Host "Created: $relativePath"
        }
    } catch {
        Write-Error "Failed: $relativePath - $($_.Exception.Message)"
        exit 1
    }
}

Write-Host "Upload complete."