@echo off
chcp 65001 >nul 2>&1
echo ========================================
echo   修复 OpenClaw 插件配置 + 安装文件
echo ========================================
echo.
echo 正在调用 windows-install.ps1 ...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0windows-install.ps1"
pause
