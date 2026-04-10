/**
 * 从 Git 克隆后 dist 不在仓库中；npm 发布的包内已有 dist，无需再构建。
 */
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distIndex = join(root, "dist", "index.js");

if (!existsSync(distIndex)) {
  execSync("npm run build", { cwd: root, stdio: "inherit", shell: true });
}
