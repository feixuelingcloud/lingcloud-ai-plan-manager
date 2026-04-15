@echo off
chcp 65001 >nul
echo ========================================
echo   重新打包 ClawHub 发布包
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] 检查必需文件...
if not exist "package.json" (
    echo ❌ package.json 不存在
    pause
    exit /b 1
)
if not exist "openclaw.plugin.json" (
    echo ❌ openclaw.plugin.json 不存在
    pause
    exit /b 1
)
if not exist "claw-hub.json" (
    echo ❌ claw-hub.json 不存在
    pause
    exit /b 1
)
if not exist "dist" (
    echo ❌ dist 目录不存在，请先运行 npm run build
    pause
    exit /b 1
)
echo ✅ 所有必需文件都存在
echo.

echo [2/5] 清理旧的发布包...
if exist "release\lingcloud-ai-plan-manager-1.0.0-clawhub.zip" (
    del "release\lingcloud-ai-plan-manager-1.0.0-clawhub.zip"
    echo ✅ 已删除旧的 ZIP 包
)
if exist ".release" (
    rmdir /s /q ".release"
)
echo.

echo [3/5] 创建临时打包目录...
mkdir ".release\package-root" 2>nul
echo ✅ 临时目录已创建
echo.

echo [4/5] 复制文件到打包目录...
echo    正在复制必需文件...
copy package.json ".release\package-root\" >nul
copy package-lock.json ".release\package-root\" >nul
copy openclaw.plugin.json ".release\package-root\" >nul
copy claw-hub.json ".release\package-root\" >nul
xcopy /E /I /Q dist ".release\package-root\dist" >nul

echo    正在复制可选文件...
if exist "README.md" copy README.md ".release\package-root\" >nul
if exist "CHANGELOG.md" copy CHANGELOG.md ".release\package-root\" >nul
if exist "INSTALLATION.md" copy INSTALLATION.md ".release\package-root\" >nul
if exist "LICENSE" copy LICENSE ".release\package-root\" >nul
if exist "skills" xcopy /E /I /Q skills ".release\package-root\skills" >nul

echo ✅ 文件复制完成
echo.

echo [5/5] 创建 ZIP 压缩包...
mkdir release 2>nul
powershell -NoProfile -Command "Compress-Archive -Path '.release\package-root\*' -DestinationPath 'release\lingcloud-ai-plan-manager-1.0.0-clawhub.zip' -Force"
if %errorlevel% neq 0 (
    echo ❌ 压缩失败
    pause
    exit /b 1
)
echo ✅ ZIP 包创建成功
echo.

echo [清理] 删除临时文件...
rmdir /s /q ".release"
echo ✅ 临时文件已清理
echo.

echo ========================================
echo   打包完成!
echo ========================================
echo.
echo 📦 输出文件: release\lingcloud-ai-plan-manager-1.0.0-clawhub.zip
echo.

REM 显示文件信息
dir "release\lingcloud-ai-plan-manager-1.0.0-clawhub.zip"
echo.

pause
