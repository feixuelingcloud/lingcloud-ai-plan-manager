@echo off
REM 修复 openclaw.json 中 plugins.entries 下非法的 path / name 字段
REM 适用于：通过 GitHub / openclaw plugins install -l 安装后出现
REM   "Unrecognized key: path" 错误的用户
chcp 65001 >nul 2>&1

echo ========================================
echo   修复 OpenClaw 插件配置
echo ========================================
echo.

set "OPENCLAW_CONFIG=%USERPROFILE%\.openclaw\openclaw.json"

if not exist "%OPENCLAW_CONFIG%" (
    echo ❌ 未找到 %OPENCLAW_CONFIG%，请确认 OpenClaw 已安装
    pause
    exit /b 1
)

echo 正在修复 %OPENCLAW_CONFIG% ...

node -e ^
  "const fs = require('fs');" ^
  "const configPath = '%OPENCLAW_CONFIG:\=\\%';" ^
  "const pluginId = '@feixuelingcloud/lingcloud-ai-plan-manager';" ^
  "let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));" ^
  "const entry = (config.plugins && config.plugins.entries && config.plugins.entries[pluginId]) || null;" ^
  "if (!entry) { console.log('未找到插件条目，无需修复'); process.exit(0); }" ^
  "const hadPath = Object.prototype.hasOwnProperty.call(entry, 'path');" ^
  "const hadName = Object.prototype.hasOwnProperty.call(entry, 'name');" ^
  "if (!hadPath && !hadName) { console.log('配置正常，无需修复'); process.exit(0); }" ^
  "if (hadPath) {" ^
  "  const pluginDir = entry.path;" ^
  "  config.plugins.load = config.plugins.load || {};" ^
  "  config.plugins.load.paths = config.plugins.load.paths || [];" ^
  "  if (!config.plugins.load.paths.includes(pluginDir)) { config.plugins.load.paths.push(pluginDir); console.log('已将 path 迁移到 plugins.load.paths: ' + pluginDir); }" ^
  "  delete entry.path;" ^
  "}" ^
  "if (hadName) { delete entry.name; }" ^
  "fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');" ^
  "console.log('✅ 修复完成！请重启 OpenClaw。');"

if errorlevel 1 (
    echo ❌ 修复失败，请手动编辑配置文件
    pause
    exit /b 1
)

echo.
echo 重启 OpenClaw Gateway...
call openclaw gateway restart >nul 2>&1
if errorlevel 1 (
    echo ⚠️  请手动重启 OpenClaw
) else (
    echo ✅ Gateway 已重启
)

echo.
pause
