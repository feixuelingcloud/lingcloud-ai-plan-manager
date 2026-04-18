/**
 * 从 Git 克隆后 dist 不在仓库中；npm 发布的包内已有 dist，无需再构建。
 *
 * 同时自动修复 openclaw.json 中 plugins.entries 下非法的 path 字段：
 * OpenClaw 通过 GitHub / `plugins install -l` 安装插件时，会把插件目录
 * 错误地写入 plugins.entries.<id>.path，导致新版网关报
 * "Unrecognized key: path" 而无法启动。
 * 正确位置是 plugins.load.paths[]。
 * 本脚本在 postinstall 阶段自动完成迁移，用户无需手动修复。
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distIndex = join(root, "dist", "index.js");

if (!existsSync(distIndex)) {
  execSync("npm run build", { cwd: root, stdio: "inherit", shell: true });
}

// ── Auto-fix openclaw.json ────────────────────────────────────────────────────
// 当 OpenClaw 从 GitHub 安装插件时，会将 path 字段错误地写入
// plugins.entries.<plugin-id>，而非正确的 plugins.load.paths。
// 新版 OpenClaw 网关对此报 Unrecognized key: "path" 并拒绝启动。
// 在 postinstall 阶段自动检测并修正，使网关可以正常启动。
const PLUGIN_ID = "@feixuelingcloud/lingcloud-ai-plan-manager";
const openclawConfigPath = join(homedir(), ".openclaw", "openclaw.json");

if (existsSync(openclawConfigPath)) {
  try {
    const config = JSON.parse(readFileSync(openclawConfigPath, "utf8"));
    const entry = config?.plugins?.entries?.[PLUGIN_ID];

    if (entry && Object.prototype.hasOwnProperty.call(entry, "path")) {
      const pluginDir = entry.path;

      // 将 path 迁移到 plugins.load.paths（正确位置）
      config.plugins.load = config.plugins.load || {};
      config.plugins.load.paths = config.plugins.load.paths || [];
      if (!config.plugins.load.paths.includes(pluginDir)) {
        config.plugins.load.paths.push(pluginDir);
      }

      // 从 entries 中删除非法字段
      delete entry.path;
      if (Object.prototype.hasOwnProperty.call(entry, "name")) {
        delete entry.name;
      }

      writeFileSync(openclawConfigPath, JSON.stringify(config, null, 2), "utf8");
      console.log(
        "[postinstall] \u2705 Fixed openclaw.json: moved 'path' from plugins.entries to plugins.load.paths"
      );
    }
  } catch (e) {
    // 非致命错误：修复失败时给出提示，用户可手动运行 fix-config.bat
    console.warn(
      "[postinstall] \u26a0\ufe0f  Could not auto-fix openclaw.json:",
      e.message
    );
    console.warn(
      "[postinstall]    Please run fix-config.bat (Windows) or fix-config.sh (Mac/Linux) manually."
    );
  }
}
