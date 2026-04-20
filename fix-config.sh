#!/bin/bash
# 修复 openclaw.json 中 plugins.entries 下非法的 path / name 字段
# 适用于：通过 GitHub / openclaw plugins install -l 安装后出现
#   "Unrecognized key: path" 错误的用户

set -e

PLUGIN_ID="@gotoplan/manager"
OPENCLAW_CONFIG="$HOME/.openclaw/openclaw.json"

echo "========================================"
echo "  修复 OpenClaw 插件配置"
echo "========================================"
echo ""

if [ ! -f "$OPENCLAW_CONFIG" ]; then
    echo "❌ 未找到 $OPENCLAW_CONFIG，请确认 OpenClaw 已安装"
    exit 1
fi

echo "正在修复 $OPENCLAW_CONFIG ..."

node -e "
const fs = require('fs');
const configPath = process.argv[1];
const pluginId   = process.argv[2];

let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const entry = (config.plugins && config.plugins.entries && config.plugins.entries[pluginId]) || null;

if (!entry) {
  console.log('未找到插件条目，无需修复');
  process.exit(0);
}

const hadPath = Object.prototype.hasOwnProperty.call(entry, 'path');
const hadName = Object.prototype.hasOwnProperty.call(entry, 'name');

if (!hadPath && !hadName) {
  console.log('配置正常，无需修复');
  process.exit(0);
}

// 将非法的 path 字段迁移到 plugins.load.paths
if (hadPath) {
  const pluginDir = entry.path;
  config.plugins.load = config.plugins.load || {};
  config.plugins.load.paths = config.plugins.load.paths || [];
  if (!config.plugins.load.paths.includes(pluginDir)) {
    config.plugins.load.paths.push(pluginDir);
    console.log('已将 path 迁移到 plugins.load.paths: ' + pluginDir);
  }
  delete entry.path;
}
if (hadName) { delete entry.name; }

fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
console.log('✅ 修复完成！请重启 OpenClaw。');
" "$OPENCLAW_CONFIG" "$PLUGIN_ID"

echo ""
echo "重启 OpenClaw Gateway..."
if openclaw gateway restart 2>/dev/null; then
    echo "✅ Gateway 已重启"
else
    echo "⚠️  请手动重启 OpenClaw"
fi
