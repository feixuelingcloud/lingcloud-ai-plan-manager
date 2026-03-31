@echo off
REM OpenClaw 插件打包脚本
echo ========================================
echo   AI计划管理系统 OpenClaw 插件打包
echo ========================================
echo.

REM 检查环境
echo [1/4] 检查环境...
where npm >nul 2>&1
if errorlevel 1 (
    echo ❌ npm 未安装!
    pause
    exit /b 1
)
echo ✅ npm 已安装

REM 安装依赖
echo.
echo [2/4] 安装依赖...
call npm install
if errorlevel 1 (
    echo ❌ 依赖安装失败!
    pause
    exit /b 1
)
echo ✅ 依赖安装完成

REM 编译 TypeScript
echo.
echo [3/4] 编译 TypeScript...
call npm run build
if errorlevel 1 (
    echo ❌ 编译失败!
    pause
    exit /b 1
)
echo ✅ 编译完成

REM 打包
echo.
echo [4/4] 打包插件...
call npm pack
if errorlevel 1 (
    echo ❌ 打包失败!
    pause
    exit /b 1
)

REM 查找生成的文件
for %%f in (lingyun-openclaw-plan-manager-*.tgz) do set PACKAGE_FILE=%%f

echo.
echo ========================================
echo   🎉 打包完成!
echo ========================================
echo.
echo 生成的安装包: %PACKAGE_FILE%
echo.
echo 下一步:
echo   1. 将 %PACKAGE_FILE% 复制到目标电脑
echo   2. 在目标电脑上运行: openclaw plugins install %PACKAGE_FILE%
echo   3. 重启 OpenClaw Gateway
echo.
echo 详细说明请查看: 用户安装说明.md
echo.
pause
