@echo off
chcp 65001 >nul
echo ========================================
echo 手动打包 OpenClaw 插件
echo ========================================
echo.

set "RELEASE_DIR=release"
set "PKG_NAME=lingcloud-ai-plan-manager-1.0.0-clawhub"

echo [1/2] 创建发布目录...
if not exist "%RELEASE_DIR%" mkdir "%RELEASE_DIR%"
if exist "%RELEASE_DIR%\%PKG_NAME%.zip" del "%RELEASE_DIR%\%PKG_NAME%.zip"
echo ✓ 目录准备完成
echo.

echo [2/2] 打包文件...
powershell -NoProfile -Command "Compress-Archive -Path package.json,package-lock.json,openclaw.plugin.json,claw-hub.json,dist,README.md,CHANGELOG.md,INSTALLATION.md,LICENSE,skills -DestinationPath '%RELEASE_DIR%\%PKG_NAME%.zip' -Force"

if %errorlevel% equ 0 (
    echo ✓ 打包完成
    echo.
    echo ========================================
    echo ✅ 插件打包成功！
    echo ========================================
    echo.
    echo 📦 打包文件位置：
    echo    %cd%\%RELEASE_DIR%\%PKG_NAME%.zip
    echo.
    echo 文件大小：
    powershell -NoProfile -Command "(Get-Item '%RELEASE_DIR%\%PKG_NAME%.zip').Length / 1KB | ForEach-Object { '{0:N2} KB' -f $_ }"
    echo.
) else (
    echo ❌ 打包失败！
)

echo.
echo 接下来请在 OpenClaw 中：
echo 1. 卸载旧版本的 lingcloud-ai-plan-manager 插件
echo 2. 安装新版本：使用上述 .zip 文件
echo 3. 重启 OpenClaw
echo.
pause
