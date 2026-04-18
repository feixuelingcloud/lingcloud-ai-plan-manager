# 📦 安装指导 Installation Guide

[English](#english) | [中文](#中文)

---

## 中文

### 📋 目录
1. [前置要求](#前置要求)
2. [按系统选择安装方式](#按系统选择安装方式)
   - [macOS / Linux（推荐：聊天自动安装）](#macos--linux推荐聊天自动安装)
   - [Windows（推荐：脚本安装）](#windows推荐脚本安装)
3. [配置 API Key](#配置-api-key)
4. [验证安装](#验证安装)
5. [故障排查](#故障排查)

---

### 前置要求

在安装插件之前，请确保你已经具备：

✅ **Node.js** >= 18.0.0  
✅ **OpenClaw** 客户端已安装  
✅ **AI 计划管理系统**后端服务正在运行  
✅ 有效的 **API Key**（从后端系统获取）

---

### 按系统选择安装方式

#### macOS / Linux（推荐：聊天自动安装）

在 **OpenClaw 聊天界面**中输入：

```
从 GitHub 安装插件：https://github.com/feixuelingcloud/lingcloud-ai-plan-manager
```

OpenClaw 会自动完成：
- ✅ 克隆插件仓库到本地
- ✅ 安装 npm 依赖（自动触发 postinstall 配置修复）
- ✅ 构建插件
- ✅ 配置 `openclaw.json`
- ✅ 重启 Gateway

安装完成后按提示配置 API Key，即可开始使用 🎉

> 如果聊天安装失败，也可以手动安装：
> ```bash
> git clone https://github.com/feixuelingcloud/lingcloud-ai-plan-manager.git
> cd lingcloud-ai-plan-manager
> chmod +x install.sh && ./install.sh
> ```

---

#### Windows（推荐：脚本安装）

> ⚠️ **为什么 Windows 不能用聊天安装？**
>
> OpenClaw 在 Windows 上通过聊天方式安装 GitHub 插件时，存在以下已知问题：
> - 插件文件未能正确复制到 `%USERPROFILE%\.openclaw\plugins\` 目录
> - `openclaw.json` 中写入了不合法的 `path` 字段（仅 Windows 版本存在此行为），
>   导致 Gateway 启动时报 `Unrecognized key: "path"` 错误
>
> 这是 Windows 版 OpenClaw 自身的行为差异，与插件本身无关。
> 请使用以下脚本方式安装。

**方法一：一键安装脚本（最简单）⭐**

**步骤 1**：克隆仓库（需要安装 git）

打开 **PowerShell** 或 **命令提示符**：

```powershell
git clone https://github.com/feixuelingcloud/lingcloud-ai-plan-manager.git
cd lingcloud-ai-plan-manager
```

**步骤 2**：运行安装脚本

```powershell
powershell -ExecutionPolicy Bypass -File windows-install.ps1
```

或直接右键 `windows-install.ps1` → **用 PowerShell 运行**

脚本自动完成：
- ✅ 将插件文件安装到 `%USERPROFILE%\.openclaw\plugins\lingcloud-ai-plan-manager\`
- ✅ 运行 `npm install`，触发自动配置修复
- ✅ 正确配置 `openclaw.json`（`plugins.load.paths`）
- ✅ 重启 OpenClaw Gateway

**方法二：命令行手动安装**

如果没有安装 git，可以下载 zip 包手动安装：

```powershell
# 1. 创建插件目录
New-Item -ItemType Directory -Force "$env:USERPROFILE\.openclaw\plugins\lingcloud-ai-plan-manager"

# 2. 下载并解压（PowerShell 5.1+）
$url = "https://github.com/feixuelingcloud/lingcloud-ai-plan-manager/archive/refs/heads/main.zip"
$tmp = "$env:TEMP\lingcloud-plugin.zip"
Invoke-WebRequest -Uri $url -OutFile $tmp
Expand-Archive -Path $tmp -DestinationPath "$env:TEMP\lingcloud-src" -Force
Copy-Item "$env:TEMP\lingcloud-src\lingcloud-ai-plan-manager-main\*" `
    "$env:USERPROFILE\.openclaw\plugins\lingcloud-ai-plan-manager\" -Recurse -Force

# 3. 安装依赖（自动修复配置）
cd "$env:USERPROFILE\.openclaw\plugins\lingcloud-ai-plan-manager"
npm install

# 4. 重启 Gateway
openclaw gateway restart
```

---

### 配置 API Key

安装完成后，编辑 `%USERPROFILE%\.openclaw\openclaw.json`（Windows）或
`~/.openclaw/openclaw.json`（macOS/Linux），找到插件条目填入 API Key：

```json
{
  "plugins": {
    "load": {
      "paths": ["插件目录的绝对路径"]
    },
    "entries": {
      "@feixuelingcloud/lingcloud-ai-plan-manager": {
        "enabled": true,
        "config": {
          "apiKey": "在这里填入你的 API Key",
          "apiBase": "https://plan.lingcloudai.com/api"
        }
      }
    }
  }
}
```

> macOS/Linux 聊天安装后，也可以直接在 OpenClaw 中说：
> ```
> 请配置 lingcloud-ai-plan-manager 的 API Key: YOUR_API_KEY_HERE
> ```

保存后重启 OpenClaw。

---

### 验证安装

在 OpenClaw 中输入：

```
告诉我本周的计划
```

看到计划列表或提示创建新计划即表示安装成功 🎉

---

### 故障排查

#### Windows：`Unrecognized key: "path"`

**原因**：Windows 版 OpenClaw 将 `path` 字段错误写入了 `plugins.entries`。

**解决**：运行 `fix-config.bat`（双击即可），它会自动修复配置并重新安装插件文件。

#### Windows / macOS / Linux：`plugin not found`

**原因**：`openclaw.json` 有插件记录但文件不在对应目录。

**解决**：
- Windows：运行 `fix-config.bat`
- macOS/Linux：重新通过聊天安装，或运行 `bash install.sh`

#### macOS/Linux：聊天安装后工具不可用

**原因**：构建未完成或 Gateway 未重启。

**解决**：

```bash
cd ~/.openclaw/plugins/lingcloud-ai-plan-manager
npm run build
openclaw gateway restart
```

#### 所有平台：API 连接失败

检查 `apiKey` 是否正确，以及 `apiBase` 是否可访问：

```bash
curl https://plan.lingcloudai.com/api/health
```

---

### 获取帮助

- **GitHub Issues**：[提交问题](https://github.com/feixuelingcloud/lingcloud-ai-plan-manager/issues)
- **Email**：yemihu@lingcloud.ai

---

## English

### 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Choose Installation Method by OS](#choose-installation-method-by-os)
   - [macOS / Linux (Recommended: Chat Auto-Install)](#macos--linux-recommended-chat-auto-install)
   - [Windows (Recommended: Script Install)](#windows-recommended-script-install)
3. [Configure API Key](#configure-api-key-1)
4. [Verify Installation](#verify-installation-1)
5. [Troubleshooting](#troubleshooting-1)

---

### Prerequisites

✅ **Node.js** >= 18.0.0  
✅ **OpenClaw** client installed  
✅ **AI Plan Manager** backend service running  
✅ Valid **API Key**

---

### Choose Installation Method by OS

#### macOS / Linux (Recommended: Chat Auto-Install)

In the **OpenClaw chat interface**, type:

```
Install plugin from GitHub: https://github.com/feixuelingcloud/lingcloud-ai-plan-manager
```

OpenClaw will automatically:
- ✅ Clone the plugin repository
- ✅ Install npm dependencies (postinstall auto-fixes config)
- ✅ Build the plugin
- ✅ Configure `openclaw.json`
- ✅ Restart the Gateway

Configure your API Key when prompted. Done! 🎉

> If chat install fails, use manual install:
> ```bash
> git clone https://github.com/feixuelingcloud/lingcloud-ai-plan-manager.git
> cd lingcloud-ai-plan-manager
> chmod +x install.sh && ./install.sh
> ```

---

#### Windows (Recommended: Script Install)

> ⚠️ **Why can't Windows use chat install?**
>
> OpenClaw on Windows has known issues when installing GitHub plugins via chat:
> - Plugin files are not properly copied to `%USERPROFILE%\.openclaw\plugins\`
> - An invalid `path` field is written to `openclaw.json` (Windows-only behavior),
>   causing the Gateway to fail with `Unrecognized key: "path"`
>
> This is a behavior difference in the Windows version of OpenClaw, not a plugin issue.
> Use the script method below instead.

**Method 1: One-Click Install Script (Easiest) ⭐**

Open **PowerShell**:

```powershell
git clone https://github.com/feixuelingcloud/lingcloud-ai-plan-manager.git
cd lingcloud-ai-plan-manager
powershell -ExecutionPolicy Bypass -File windows-install.ps1
```

Or right-click `windows-install.ps1` → **Run with PowerShell**

**Method 2: Manual Command Line**

```powershell
# Download and extract
$url = "https://github.com/feixuelingcloud/lingcloud-ai-plan-manager/archive/refs/heads/main.zip"
$tmp = "$env:TEMP\lingcloud-plugin.zip"
Invoke-WebRequest -Uri $url -OutFile $tmp
Expand-Archive -Path $tmp -DestinationPath "$env:TEMP\lingcloud-src" -Force
New-Item -ItemType Directory -Force "$env:USERPROFILE\.openclaw\plugins\lingcloud-ai-plan-manager"
Copy-Item "$env:TEMP\lingcloud-src\lingcloud-ai-plan-manager-main\*" `
    "$env:USERPROFILE\.openclaw\plugins\lingcloud-ai-plan-manager\" -Recurse -Force

# Install dependencies (auto-fixes config)
cd "$env:USERPROFILE\.openclaw\plugins\lingcloud-ai-plan-manager"
npm install

# Restart Gateway
openclaw gateway restart
```

---

### Configure API Key

Edit `~/.openclaw/openclaw.json`:

```json
{
  "plugins": {
    "entries": {
      "@feixuelingcloud/lingcloud-ai-plan-manager": {
        "enabled": true,
        "config": {
          "apiKey": "your-api-key-here",
          "apiBase": "https://plan.lingcloudai.com/api"
        }
      }
    }
  }
}
```

Save and restart OpenClaw.

---

### Verify Installation

In OpenClaw chat, type:

```
Show me this week's plans
```

---

### Troubleshooting

#### Windows: `Unrecognized key: "path"`

Run `fix-config.bat` (double-click) — it automatically fixes the config and reinstalls plugin files.

#### `plugin not found`

- Windows: Run `fix-config.bat`
- macOS/Linux: Reinstall via chat or run `bash install.sh`

#### Plugin loads but tools unavailable

```bash
cd ~/.openclaw/plugins/lingcloud-ai-plan-manager
npm run build
openclaw gateway restart
```

---

### Get Help

- **GitHub Issues**: [Submit an Issue](https://github.com/feixuelingcloud/lingcloud-ai-plan-manager/issues)
- **Email**: yemihu@lingcloud.ai

<div align="center">

**[⬆ Back to Top](#-安装指导-installation-guide)**

</div>
