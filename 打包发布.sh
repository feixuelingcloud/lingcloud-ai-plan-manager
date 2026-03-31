#!/bin/bash
# OpenClaw 插件打包脚本

set -e

echo "========================================"
echo "  AI计划管理系统 OpenClaw 插件打包"
echo "========================================"
echo ""

# 检查环境
echo "[1/4] 检查环境..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装!"
    exit 1
fi
echo "✅ npm 已安装"

# 安装依赖
echo ""
echo "[2/4] 安装依赖..."
npm install
echo "✅ 依赖安装完成"

# 编译 TypeScript
echo ""
echo "[3/4] 编译 TypeScript..."
npm run build
echo "✅ 编译完成"

# 打包
echo ""
echo "[4/4] 打包插件..."
npm pack

# 查找生成的文件
PACKAGE_FILE=$(ls lingyun-openclaw-plan-manager-*.tgz 2>/dev/null | head -n 1)

echo ""
echo "========================================"
echo "  🎉 打包完成!"
echo "========================================"
echo ""
echo "生成的安装包: $PACKAGE_FILE"
echo ""
echo "下一步:"
echo "  1. 将 $PACKAGE_FILE 复制到目标电脑"
echo "  2. 在目标电脑上运行: openclaw plugins install $PACKAGE_FILE"
echo "  3. 重启 OpenClaw Gateway"
echo ""
echo "详细说明请查看: 用户安装说明.md"
echo ""
