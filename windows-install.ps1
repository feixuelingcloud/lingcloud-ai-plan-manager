#Requires -Version 5.1
# Windows 一键安装脚本
# 解决 OpenClaw 聊天安装只写配置、不下载文件的问题
# 用法：右键 -> "用 PowerShell 运行"  或  powershell -ExecutionPolicy Bypass -File windows-install.ps1

$ErrorActionPreference = "Stop"
$PLUGIN_ID  = "@gotoplan/manager"
$REPO_URL   = "https://github.com/feixuelingcloud/gotoplan-manager.git"
$PLUGIN_DIR = Join-Path $env:USERPROFILE ".openclaw\plugins\gotoplan-manager"
$CONFIG_PATH= Join-Path $env:USERPROFILE ".openclaw\openclaw.json"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AI计划管理插件 Windows 安装脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ── 1. 检查 Node.js ──────────────────────────────────────────────────────────
Write-Host "[1/5] 检查 Node.js..." -ForegroundColor Yellow
try {
    $nodeVer = node --version 2>&1
    Write-Host "      Node.js $nodeVer  OK" -ForegroundColor Green
} catch {
    Write-Host "      [ERROR] 未找到 Node.js，请先安装 Node.js >= 18" -ForegroundColor Red
    exit 1
}

# ── 2. 下载插件文件 ──────────────────────────────────────────────────────────
Write-Host ""
Write-Host "[2/5] 下载插件文件到 $PLUGIN_DIR ..." -ForegroundColor Yellow

if (Test-Path (Join-Path $PLUGIN_DIR "package.json")) {
    Write-Host "      插件目录已存在，跳过克隆，直接更新..." -ForegroundColor Cyan
    # 目录已存在：尝试 git pull，失败也继续
    try {
        Push-Location $PLUGIN_DIR
        git pull origin main 2>&1 | Write-Host
        Pop-Location
    } catch {
        Pop-Location -ErrorAction SilentlyContinue
        Write-Host "      git pull 失败，继续使用现有文件" -ForegroundColor Yellow
    }
} else {
    # 优先用 git clone
    $useGit = $false
    try {
        git --version 2>&1 | Out-Null
        $useGit = $true
    } catch {}

    if ($useGit) {
        Write-Host "      使用 git clone..." -ForegroundColor Cyan
        if (Test-Path $PLUGIN_DIR) { Remove-Item $PLUGIN_DIR -Recurse -Force }
        git clone $REPO_URL $PLUGIN_DIR 2>&1 | Write-Host
    } else {
        # 没有 git，下载 zip 解压
        Write-Host "      git 未安装，改用下载 zip..." -ForegroundColor Cyan
        $zipUrl  = "https://github.com/feixuelingcloud/gotoplan-manager/archive/refs/heads/main.zip"
        $tmpZip  = Join-Path $env:TEMP "gotoplan-plugin.zip"
        $tmpDir  = Join-Path $env:TEMP "gotoplan-plugin-src"

        Write-Host "      正在下载 $zipUrl ..." -ForegroundColor Cyan
        Invoke-WebRequest -Uri $zipUrl -OutFile $tmpZip -UseBasicParsing

        if (Test-Path $tmpDir) { Remove-Item $tmpDir -Recurse -Force }
        Expand-Archive -Path $tmpZip -DestinationPath $tmpDir -Force

        # zip 解压后子目录名为 gotoplan-manager-main
        $extracted = Join-Path $tmpDir "gotoplan-manager-main"
        if (-not (Test-Path $extracted)) {
            $extracted = (Get-ChildItem $tmpDir -Directory | Select-Object -First 1).FullName
        }

        if (Test-Path $PLUGIN_DIR) { Remove-Item $PLUGIN_DIR -Recurse -Force }
        Copy-Item $extracted $PLUGIN_DIR -Recurse -Force

        Remove-Item $tmpZip  -Force -ErrorAction SilentlyContinue
        Remove-Item $tmpDir  -Recurse -Force -ErrorAction SilentlyContinue
    }
}

if (-not (Test-Path (Join-Path $PLUGIN_DIR "package.json"))) {
    Write-Host "      [ERROR] 下载失败，$PLUGIN_DIR\package.json 不存在" -ForegroundColor Red
    exit 1
}
Write-Host "      插件文件就绪 OK" -ForegroundColor Green

# ── 3. npm install（触发 postinstall 自动修复 config）───────────────────────
Write-Host ""
Write-Host "[3/5] 安装依赖并构建（npm install）..." -ForegroundColor Yellow
Push-Location $PLUGIN_DIR
try {
    npm install 2>&1 | Write-Host
    if ($LASTEXITCODE -ne 0) { throw "npm install 失败" }
} finally {
    Pop-Location
}
Write-Host "      npm install 完成 OK" -ForegroundColor Green

# ── 4. 修复 openclaw.json（兜底，postinstall 可能已完成此步）──────────────
Write-Host ""
Write-Host "[4/5] 校验并修复 openclaw.json..." -ForegroundColor Yellow

if (Test-Path $CONFIG_PATH) {
    $raw    = Get-Content $CONFIG_PATH -Raw -Encoding UTF8
    $config = $raw | ConvertFrom-Json

    # 确保路径结构存在
    if (-not $config.PSObject.Properties["plugins"])        { $config | Add-Member -NotePropertyName plugins -NotePropertyValue ([PSCustomObject]@{}) }
    if (-not $config.plugins.PSObject.Properties["load"])   { $config.plugins | Add-Member -NotePropertyName load -NotePropertyValue ([PSCustomObject]@{}) }
    if (-not $config.plugins.load.PSObject.Properties["paths"]) { $config.plugins.load | Add-Member -NotePropertyName paths -NotePropertyValue @() }
    if (-not $config.plugins.PSObject.Properties["entries"]){ $config.plugins | Add-Member -NotePropertyName entries -NotePropertyValue ([PSCustomObject]@{}) }

    # 将插件目录加入 plugins.load.paths
    $paths = [System.Collections.ArrayList]@($config.plugins.load.paths)
    if ($paths -notcontains $PLUGIN_DIR) {
        $paths.Add($PLUGIN_DIR) | Out-Null
        $config.plugins.load.paths = $paths.ToArray()
        Write-Host "      已将插件目录添加到 plugins.load.paths" -ForegroundColor Green
    }

    # 修复 plugins.entries：删除非法 path/name，保留 enabled/config
    $entries = $config.plugins.entries
    if ($entries.PSObject.Properties[$PLUGIN_ID]) {
        $entry = $entries.PSObject.Properties[$PLUGIN_ID].Value
        $entry.PSObject.Properties.Remove("path")
        $entry.PSObject.Properties.Remove("name")
        if (-not $entry.PSObject.Properties["enabled"]) {
            $entry | Add-Member -NotePropertyName enabled -NotePropertyValue $true
        }
        Write-Host "      已清理 plugins.entries 中的非法字段" -ForegroundColor Green
    } else {
        # 不存在则新建
        $newEntry = [PSCustomObject]@{
            enabled = $true
            config  = [PSCustomObject]@{
                apiKey  = ""
                apiBase = "https://plan.lingcloudai.com/api"
            }
        }
        $entries | Add-Member -NotePropertyName $PLUGIN_ID -NotePropertyValue $newEntry
        Write-Host "      已在 plugins.entries 中新建插件条目" -ForegroundColor Green
    }

    $config | ConvertTo-Json -Depth 10 | Set-Content $CONFIG_PATH -Encoding UTF8
    Write-Host "      openclaw.json 已保存 OK" -ForegroundColor Green
} else {
    Write-Host "      openclaw.json 不存在，跳过修复（OpenClaw 未安装？）" -ForegroundColor Yellow
}

# ── 5. 重启 OpenClaw Gateway ─────────────────────────────────────────────────
Write-Host ""
Write-Host "[5/5] 重启 OpenClaw Gateway..." -ForegroundColor Yellow
try {
    openclaw gateway restart 2>&1 | Write-Host
    Write-Host "      Gateway 重启完成 OK" -ForegroundColor Green
} catch {
    Write-Host "      Gateway 重启失败，请手动重启 OpenClaw" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  安装完成！" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "插件目录：$PLUGIN_DIR"
Write-Host ""
Write-Host "下一步："
Write-Host "  1. 在 openclaw.json 的 plugins.entries.$PLUGIN_ID.config 中填入 apiKey"
Write-Host "  2. 重启 OpenClaw 或运行 openclaw gateway run"
Write-Host ""
