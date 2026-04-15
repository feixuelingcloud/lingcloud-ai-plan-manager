@echo off
chcp 65001 >nul
echo ========================================
echo 重新编译和打包 OpenClaw 插件
echo ========================================
echo.

echo [1/3] 清理旧的编译文件...
if exist dist rmdir /s /q dist
echo ✓ 清理完成
echo.

echo [2/3] 重新编译 TypeScript...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 编译失败！
    pause
    exit /b 1
)
echo ✓ 编译完成
echo.

echo [3/3] 创建 ClawHub 压缩包...
if not exist release mkdir release
powershell -NoProfile -Command "Compress-Archive -Path package.json,package-lock.json,openclaw.plugin.json,claw-hub.json,dist,README.md,CHANGELOG.md,INSTALLATION.md,LICENSE,skills -DestinationPath 'release\lingcloud-ai-plan-manager-1.0.0-clawhub.zip' -Force"
if %errorlevel% neq 0 (
    echo ❌ 打包失败！
    pause
    exit /b 1
)
echo ✓ 打包完成
echo.

echo ========================================
echo ✅ 插件重新打包完成！
echo ========================================
echo.
echo 📦 打包文件位置：
echo    %cd%\release\lingcloud-ai-plan-manager-1.0.0-clawhub.zip
echo.
echo 接下来请在 OpenClaw 中：
echo 1. 卸载旧版本的 lingcloud-ai-plan-manager 插件
echo 2. 安装新版本：使用上述 .zip 文件
echo 3. 重启 OpenClaw
echo.
pause
