/**
 * postinstall 脚本：
 * 1. 如果 dist 目录不存在则自动构建
 * 2. 将当前插件目录注册到 openclaw.json 的 plugins.load.paths
 *    并确保 plugins.entries 只含合法字段（enabled / config），
 *    从而修复 OpenClaw 报 "Unrecognized key: path" 的问题
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

// 插件根目录（即本脚本上一级）
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distIndex = join(root, "dist", "index.js");

if (!existsSync(distIndex)) {
  execSync("npm run build", { cwd: root, stdio: "inherit", shell: true });
}

// ── 自动配置 openclaw.json ────────────────────────────────────────────────────
const PLUGIN_ID    = "@gotoplan/manager";
const DEFAULT_BASE = "https://plan.lingcloudai.com/api";
const configPath   = join(homedir(), ".openclaw", "openclaw.json");

if (!existsSync(configPath)) {
  console.log("[postinstall] openclaw.json not found, skipping config patch.");
  process.exit(0);
}

try {
  const config = JSON.parse(readFileSync(configPath, "utf8"));

  config.plugins        = config.plugins        || {};
  config.plugins.load   = config.plugins.load   || {};
  config.plugins.load.paths = config.plugins.load.paths || [];
  config.plugins.entries = config.plugins.entries || {};

  // 1. 将插件实际目录写入 plugins.load.paths（正确位置）
  if (!config.plugins.load.paths.includes(root)) {
    config.plugins.load.paths.push(root);
    console.log("[postinstall] Added plugin path to plugins.load.paths:", root);
  }

  // 2. 清理 plugins.entries：删除所有非法字段，保留/补全合法字段
  const entry = config.plugins.entries[PLUGIN_ID] || {};
  const hadInvalid = "path" in entry || "name" in entry;
  delete entry.path;
  delete entry.name;
  if (entry.enabled === undefined) entry.enabled = true;
  if (!entry.config) {
    entry.config = { apiKey: "", apiBase: DEFAULT_BASE };
  }
  config.plugins.entries[PLUGIN_ID] = entry;

  if (hadInvalid) {
    console.log("[postinstall] Removed invalid field(s) from plugins.entries.");
  }

  writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
  console.log("[postinstall] \u2705 openclaw.json updated successfully.");
} catch (err) {
  console.warn("[postinstall] \u26a0\ufe0f  Could not patch openclaw.json:", err.message);
  console.warn("[postinstall]    Run fix-config.bat (Windows) or fix-config.sh manually.");
}
