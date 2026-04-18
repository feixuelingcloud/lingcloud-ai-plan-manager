$ErrorActionPreference = 'Stop'
$root    = Split-Path -Parent $MyInvocation.MyCommand.Definition
$staging = Join-Path $root '.release\stage'
$release = Join-Path $root 'release'
$out     = Join-Path $release 'lingcloud-ai-plan-manager-1.0.3-clawhub.zip'

if (Test-Path $staging) { Remove-Item $staging -Recurse -Force }
New-Item -ItemType Directory -Force -Path $staging | Out-Null
New-Item -ItemType Directory -Force -Path $release | Out-Null
if (Test-Path $out) { Remove-Item $out -Force }

$required = @('package.json','package-lock.json','openclaw.plugin.json','claw-hub.json','dist','scripts')
$optional = @('README.md','CHANGELOG.md','INSTALLATION.md','LICENSE','skills','fix-config.bat','fix-config.sh')

foreach ($e in $required) {
    $src = Join-Path $root $e
    if (-not (Test-Path $src)) { Write-Error "Missing required: $e"; exit 1 }
    Copy-Item $src (Join-Path $staging $e) -Recurse -Force
}
foreach ($e in $optional) {
    $src = Join-Path $root $e
    if (Test-Path $src) { Copy-Item $src (Join-Path $staging $e) -Recurse -Force }
}

Compress-Archive -Path "$staging\*" -DestinationPath $out -Force
Write-Host "[OK] Created: $out"
Remove-Item $staging -Recurse -Force -ErrorAction SilentlyContinue
