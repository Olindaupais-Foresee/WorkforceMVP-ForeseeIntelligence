$vars = Get-ChildItem Env: | Where-Object { $_.Name -match 'GITHUB|GH_' }
if ($vars) {
    $vars | ForEach-Object { Write-Host "$($_.Name)= $($_.Value)" }
} else {
    Write-Host 'NO_GITHUB_ENV_VARS_FOUND'
}