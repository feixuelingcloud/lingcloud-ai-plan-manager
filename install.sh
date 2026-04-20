#!/bin/bash
# OpenClaw 插件快速安装脚本 (Linux/Mac)

set -e  # 遇到错误立即退出

echo "========================================"
echo "  AI计划管理系统 OpenClaw 插件安装"
echo "========================================"
echo ""

# 检查 OpenClaw 是否安装
echo "[1/5] 检查 OpenClaw..."
if ! command -v openclaw &> /dev/null; then
    echo "❌ OpenClaw 未安装"
    echo "请先安装 OpenClaw: https://openclaw.ai"
    exit 1
fi
echo "✅ OpenClaw 已安装"

# 检查环境变量文件
echo ""
echo "[2/5] 检查环境变量..."
if [ ! -f .env ]; then
    echo "⚠️  未找到 .env 文件"
    echo "正在从 .env.example 复制..."
    cp .env.example .env
    echo ""
    echo "⚠️  请编辑 .env 文件,填入您的配置:"
    echo "   - AI_PLAN_API_BASE: 后端API地址"
    echo "   - AI_PLAN_API_KEY: 您的Token"
    echo ""
    echo "使用默认编辑器打开 .env..."
    ${EDITOR:-nano} .env
    echo ""
fi
echo "✅ 环境变量配置完成"

# 安装依赖
echo ""
echo "[3/6] 安装依赖..."
npm install
echo "✅ 依赖安装完成"

# 编译 TypeScript
echo ""
echo "[4/6] 编译 TypeScript..."
npm run build
echo "✅ 编译完成"

# 安装插件到 OpenClaw（手动写入正确配置，避免旧版 CLI 将 path 写入 plugins.entries 导致 Unrecognized key: "path" 错误）
echo ""
echo "[5/6] 安装插件到 OpenClaw..."

PLUGIN_ID="@gotoplan/manager"
OPENCLAW_DIR="$HOME/.openclaw"
PLUGIN_INSTALL_DIR="$OPENCLAW_DIR/plugins/gotoplan-manager"
OPENCLAW_CONFIG="$OPENCLAW_DIR/openclaw.json"

# 拷贝插件文件到 openclaw plugins 目录
mkdir -p "$PLUGIN_INSTALL_DIR"
cp -r dist "$PLUGIN_INSTALL_DIR/"
cp openclaw.plugin.json "$PLUGIN_INSTALL_DIR/"
cp package.json "$PLUGIN_INSTALL_DIR/"
[ -d node_modules ] && cp -r node_modules "$PLUGIN_INSTALL_DIR/"

# 用 Node.js 将路径写入 plugins.load.paths（而非 plugins.entries），
# 并确保 plugins.entries 下只有合法字段（enabled / config），
# 从而避免 OpenClaw 报 Unrecognized key: "path" 错误。
node -e "
const fs = require('fs');
const configPath = process.argv[1];
const pluginDir  = process.argv[2];
const pluginId   = process.argv[3];

let config = {};
if (fs.existsSync(configPath)) {
  try { config = JSON.parse(fs.readFileSync(configPath, 'utf8')); } catch(e) {}
}

// 将插件目录写入 plugins.load.paths（正确位置）
config.plugins = config.plugins || {};
config.plugins.load = config.plugins.load || {};
config.plugins.load.paths = config.plugins.load.paths || [];
if (!config.plugins.load.paths.includes(pluginDir)) {
  config.plugins.load.paths.push(pluginDir);
}

// 确保 plugins.entries 下只有合法字段，删除旧版 CLI 可能写入的 path / name
config.plugins.entries = config.plugins.entries || {};
const entry = config.plugins.entries[pluginId] || {};
delete entry.path;
delete entry.name;
entry.enabled = true;
if (!entry.config) entry.config = { apiKey: '', apiBase: 'https://plan.lingcloudai.com/api' };
config.plugins.entries[pluginId] = entry;

fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
console.log('✅ OpenClaw 配置已正确写入');
" "$OPENCLAW_CONFIG" "$PLUGIN_INSTALL_DIR" "$PLUGIN_ID"

echo "✅ 插件安装完成"

# 重启 Gateway
echo ""
echo "[6/6] 重启 OpenClaw Gateway..."
if openclaw gateway restart; then
    echo "✅ Gateway 重启完成"
else
    echo "⚠️  Gateway 重启失败，请手动重启"
fi

# 验证安装
echo ""
echo "========================================"
echo "  安装完成! 正在验证..."
echo "========================================"
echo ""

sleep 3

echo "已安装的插件:"
openclaw plugins list | grep "gotoplan-manager" || echo "⚠️  插件未出现在列表中"

echo ""
echo "已注册的工具:"
openclaw tools list | grep "plan" || echo "⚠️  工具未注册"

echo ""
echo "========================================"
echo "  🎉 安装完成!"
echo "========================================"
echo ""
echo "下一步:"
echo "  1. 确保后端服务已启动"
echo "  2. 在 OpenClaw 中测试: \"帮我制定一个计划\""
echo "  3. 查看详细测试指南: 安装测试指南.md"
echo ""
