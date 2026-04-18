@echo off
REM OpenClaw 插件快速安装脚本 (Windows)
chcp 65001 >nul 2>&1
echo ========================================
echo   AI计划管理系统 OpenClaw 插件安装
echo ========================================
echo.

REM 检查 OpenClaw 是否安装
echo [1/5] 检查 OpenClaw...
openclaw --version >nul 2>&1
if errorlevel 1 (
    echo ❌ OpenClaw 未安装
    echo 请先安装 OpenClaw: https://openclaw.ai
    pause
    exit /b 1
)
echo ✅ OpenClaw 已安装

REM 检查环境变量文件
echo.
echo [2/5] 检查环境变量...
if not exist .env (
    echo ⚠️  未找到 .env 文件
    echo 正在从 .env.example 复制...
    copy .env.example .env
    echo.
    echo ⚠️  请编辑 .env 文件,填入您的配置:
    echo    - AI_PLAN_API_BASE: 后端API地址
    echo    - AI_PLAN_API_KEY: 您的Token
    echo.
    notepad .env
    echo.
    echo 配置完成后，请按任意键继续...
    pause >nul
)
echo ✅ 环境变量配置完成

REM 安装依赖
echo.
echo [3/6] 安装依赖...
call npm install
if errorlevel 1 (
    echo ❌ 依赖安装失败!
    pause
    exit /b 1
)
echo ✅ 依赖安装完成

REM 编译 TypeScript
echo.
echo [4/6] 编译 TypeScript...
call npm run build
if errorlevel 1 (
    echo ❌ 编译失败!
    pause
    exit /b 1
)
echo ✅ 编译完成

REM 安装插件到 OpenClaw（用 PowerShell 手动写入正确配置，
REM 避免旧版 CLI 将 path 写入 plugins.entries 导致 Unrecognized key: "path" 错误）
echo.
echo [5/6] 安装插件到 OpenClaw...

powershell -ExecutionPolicy Bypass -Command ^
  "$pluginId = '@feixuelingcloud/lingcloud-ai-plan-manager';" ^
  "$pluginDir = \"$env:USERPROFILE\.openclaw\plugins\lingcloud-ai-plan-manager\";" ^
  "$configPath = \"$env:USERPROFILE\.openclaw\openclaw.json\";" ^
  "$srcDir = (Get-Location).Path;" ^
  "New-Item -ItemType Directory -Force -Path $pluginDir | Out-Null;" ^
  "Copy-Item -Recurse -Force \"$srcDir\dist\" $pluginDir;" ^
  "Copy-Item -Force \"$srcDir\openclaw.plugin.json\" $pluginDir;" ^
  "Copy-Item -Force \"$srcDir\package.json\" $pluginDir;" ^
  "if (Test-Path \"$srcDir\node_modules\") { Copy-Item -Recurse -Force \"$srcDir\node_modules\" $pluginDir };" ^
  "$config = @{};" ^
  "if (Test-Path $configPath) { try { $config = Get-Content $configPath -Raw | ConvertFrom-Json -AsHashtable } catch {} };" ^
  "if (-not $config.plugins) { $config.plugins = @{} };" ^
  "if (-not $config.plugins.load) { $config.plugins.plugins = @{}; $config.plugins.load = @{} };" ^
  "if (-not $config.plugins.load.paths) { $config.plugins.load.paths = @() };" ^
  "if ($config.plugins.load.paths -notcontains $pluginDir) { $config.plugins.load.paths += $pluginDir };" ^
  "if (-not $config.plugins.entries) { $config.plugins.entries = @{} };" ^
  "$entry = if ($config.plugins.entries[$pluginId]) { $config.plugins.entries[$pluginId] } else { @{} };" ^
  "$entry.Remove('path') | Out-Null; $entry.Remove('name') | Out-Null;" ^
  "$entry.enabled = $true;" ^
  "if (-not $entry.config) { $entry.config = @{ apiKey = ''; apiBase = 'https://plan.lingcloudai.com/api' } };" ^
  "$config.plugins.entries[$pluginId] = $entry;" ^
  "$config | ConvertTo-Json -Depth 10 | Set-Content $configPath -Encoding UTF8;" ^
  "Write-Host '✅ OpenClaw 配置已正确写入'"

if errorlevel 1 (
    echo ❌ 插件配置写入失败!
    pause
    exit /b 1
)
echo ✅ 插件安装完成

REM 重启 Gateway
echo.
echo [6/6] 重启 OpenClaw Gateway...
call openclaw gateway restart
if errorlevel 1 (
    echo ⚠️  Gateway 重启失败，请手动重启
) else (
    echo ✅ Gateway 重启完成
)

REM 验证安装
echo.
echo ========================================
echo   安装完成! 正在验证...
echo ========================================
echo.

timeout /t 3 /nobreak >nul

echo 已安装的插件:
call openclaw plugins list | findstr "lingcloud-ai-plan-manager"

echo.
echo 已注册的工具:
call openclaw tools list | findstr "plan"

echo.
echo ========================================
echo   安装完成!
echo ========================================
echo.
echo 下一步:
echo   1. 确保后端服务已启动
echo   2. 在 OpenClaw 中测试: "帮我制定一个计划"
echo   3. 查看详细测试指南: 安装测试指南.md
echo.
pause
