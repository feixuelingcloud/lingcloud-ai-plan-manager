import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const packageJsonPath = path.join(projectRoot, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const pluginManifestPath = path.join(projectRoot, "openclaw.plugin.json");
const pluginManifest = JSON.parse(readFileSync(pluginManifestPath, "utf8"));
/** Zip basename: strip npm scope from plugin id (e.g. @feixuelingcloud/lingcloud-ai-plan-manager → lingcloud-ai-plan-manager) */
const zipSlug = String(pluginManifest.id || packageJson.name).replace(
  /^@[^/]+\//,
  "",
);

const requiredEntries = [
  "package.json",
  "package-lock.json",
  "openclaw.plugin.json",
  "claw-hub.json",
  "dist",
];

const optionalEntries = [
  "README.md",
  "CHANGELOG.md",
  "INSTALLATION.md",
  "LICENSE",
  "skills",
];

for (const entry of requiredEntries) {
  const entryPath = path.join(projectRoot, entry);
  if (!existsSync(entryPath)) {
    console.error(`[ERROR] Required package entry is missing: ${entry}`);
    process.exit(1);
  }
}

const releaseDir = path.join(projectRoot, "release");
const tempRootDir = path.join(projectRoot, ".release");
mkdirSync(tempRootDir, { recursive: true });
const stagingDir = mkdtempSync(path.join(tempRootDir, "clawhub-"));
const packageRoot = path.join(stagingDir, "package-root");
const outputFileName = `${zipSlug}-${packageJson.version}-clawhub.zip`;
const outputFilePath = path.join(releaseDir, outputFileName);

mkdirSync(packageRoot, { recursive: true });
mkdirSync(releaseDir, { recursive: true });
rmSync(outputFilePath, { force: true });

for (const entry of [...requiredEntries, ...optionalEntries]) {
  const sourcePath = path.join(projectRoot, entry);
  if (!existsSync(sourcePath)) {
    continue;
  }

  const targetPath = path.join(packageRoot, entry);
  cpSync(sourcePath, targetPath, { recursive: true });
}

if (process.platform === "win32") {
  try {
    execFileSync("tar.exe", ["-a", "-cf", outputFilePath, "."], {
      cwd: packageRoot,
      stdio: "inherit",
    });
  } catch {
    execFileSync(
      "powershell.exe",
      [
        "-NoProfile",
        "-Command",
        `Compress-Archive -Path * -DestinationPath '${outputFilePath.replace(/'/g, "''")}' -Force`,
      ],
      {
        cwd: packageRoot,
        stdio: "inherit",
      },
    );
  }
} else {
  try {
    execFileSync("zip", ["-r", "-q", outputFilePath, "."], {
      cwd: packageRoot,
      stdio: "inherit",
    });
  } catch {
    execFileSync("tar", ["-a", "-cf", outputFilePath, "."], {
      cwd: packageRoot,
      stdio: "inherit",
    });
  }
}

console.log(`[OK] Created ClawHub zip: ${outputFilePath}`);

try {
  rmSync(stagingDir, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 100,
  });
} catch {
  // Ignore temp cleanup errors on Windows file locking.
}
