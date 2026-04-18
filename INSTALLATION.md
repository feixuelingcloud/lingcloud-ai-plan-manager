# 📦 安装指导 Installation Guide

[English](#english) | [中文](#中文)

---

## 中文

### 📋 目录
1. [前置要求](#前置要求)
2. [安装方法](#安装方法)
   - [方法一：Windows 一键安装（推荐）](#方法一windows-一键安装推荐)
   - [方法二：Mac / Linux 手动安装](#方法二mac--linux-手动安装)
   - [方法三：从 Zip 包安装](#方法三从-zip-包安装)
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

> ⚠️ **注意**：请勿通过 OpenClaw 聊天界面的"自动安装"功能安装本插件。
> 该功能只写入配置记录，不会真正将插件文件放到正确目录，会导致
> `plugin not found` 或 `Unrecognized key: "path"` 错误。
> 请按以下方法手动安装。

---

### 安装方法

#### 方法一：Windows 一键安装（推荐）⭐

**步骤 1**：下载安装脚本

从本仓库下载 `windows-install.ps1`，或直接 clone 整个仓库：

```powershell
git clone https://github.com/feixuelingcloud/lingcloud-ai-plan-manager.git
cd lingcloud-ai-plan-manager
```

**步骤 2**：运行安装脚本

右键 `windows-install.ps1` → **用 PowerShell 运行**

或在 PowerShell 中执行：

```powershell
powershell -ExecutionPolicy Bypass -File windows-install.ps1
```

脚本会自动完成：
- ✅ 将插件文件克隆/下载到 `~\.openclaw\plugins\lingcloud-ai-plan-manager\`
- ✅ 运行 `npm install` 安装依赖
- ✅ 修复 `openclaw.json`（正确配置 `plugins.load.paths`）
- ✅ 重启 OpenClaw Gateway

**步骤 3**：配置 API Key（见下文）

完成！🎉

---

#### 方法二：Mac / Linux 手动安装

**步骤 1**：克隆仓库

```bash
git clone https://github.com/feixuelingcloud/lingcloud-ai-plan-manager.git
cd lingcloud-ai-plan-manager
```

**步骤 2**：运行安装脚本

```bash
chmod +x install.sh
./install.sh
```

脚本会自动：
- ✅ 将插件文件复制到 `~/.openclaw/plugins/lingcloud-ai-plan-manager/`
- ✅ 运行 `npm install` 安装依赖并触发自动配置
- ✅ 修复 `openclaw.json`
- ✅ 重启 Gateway

---

#### 方法三：从 Zip 包安装

**步骤 1**：下载 zip 包

从 [Releases 页面](https://github.com/feixuelingcloud/lingcloud-ai-plan-manager/releases) 下载最新的
`lingcloud-ai-plan-manager-x.x.x-clawhub.zip`。

**步骤 2**：解压到插件目录

将 zip 解压到：
- **Windows**：`C:\Users\<你的用户名>\.openclaw\plugins\lingcloud-ai-plan-manager\`
- **Mac/Linux**：`~/.openclaw/plugins/lingcloud-ai-plan-manager/`

**步骤 3**：安装依赖

```bash
cd ~/.openclaw/plugins/lingcloud-ai-plan-manager
npm install
```

`npm install` 会自动触发 `postinstall` 脚本，完成 `openclaw.json` 的配置修复。

**步骤 4**：重启 OpenClaw

```bash
openclaw gateway restart
```

---

### 配置 API Key

#### 获取 API Key

1. 打开你的 **AI 计划管理系统** Web 界面
2. 登录你的账户
3. 导航到 **设置 → API 管理**
4. 点击 **创建新的 API Key**
5. **复制** 生成的 API Key（重要：妥善保存，只显示一次！）

#### 方式 1：手动编辑配置文件（推荐）

编辑 **`~/.openclaw/openclaw.json`**，找到插件条目并填入 API Key：

```json
{
  "plugins": {
    "load": {
      "paths": ["C:\\Users\\你的用户名\\.openclaw\\plugins\\lingcloud-ai-plan-manager"]
    },
    "entries": {
      "@feixuelingcloud/lingcloud-ai-plan-manager": {
        "enabled": true,
        "config": {
          "apiKey": "在这里填入你的API Key",
          "apiBase": "https://plan.lingcloudai.com/api"
        }
      }
    }
  }
}
```

**保存后重启 OpenClaw。**

#### 方式 2：通过 OpenClaw 聊天配置

在 OpenClaw 聊天界面中输入：

```
请配置 lingcloud-ai-plan-manager 的 API Key: YOUR_API_KEY_HERE
```

---

### 验证安装

在 OpenClaw 聊天中输入：

```
告诉我本周的计划
```

如果插件正常工作，你会看到计划列表或提示创建新计划。

---

### 故障排查

#### 问题 1：`Unrecognized key: "path"`

**原因**：OpenClaw 将 `path` 错误地写入了 `plugins.entries`。

**解决**：
- Windows：运行 `fix-config.bat`（双击即可）
- Mac/Linux：运行 `bash fix-config.sh`

#### 问题 2：`plugin not found (stale config entry)`

**原因**：配置记录存在但插件文件不在对应目录。

**解决**：
- Windows：运行 `fix-config.bat`（它会自动安装文件并修复配置）
- Mac/Linux：运行 `bash install.sh`

#### 问题 3：`openclaw.json` 中没有 `plugins.load.paths`

**解决**：手动添加：

```json
{
  "plugins": {
    "load": {
      "paths": ["/absolute/path/to/lingcloud-ai-plan-manager"]
    }
  }
}
```

#### 问题 4：TypeScript 编译错误

```bash
rm -rf dist/
npm run build
```

#### 问题 5：插件加载但工具不可用

```bash
rm -rf dist/
npm run build
openclaw gateway restart
```

---

### 获取帮助

1. **提交 Issue**：[GitHub Issues](https://github.com/feixuelingcloud/lingcloud-ai-plan-manager/issues)
2. **联系支持**：yemihu@lingcloud.ai

---

## English

### 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation Methods](#installation-methods)
   - [Method 1: Windows One-Click Install (Recommended)](#method-1-windows-one-click-install-recommended)
   - [Method 2: Mac / Linux Manual Install](#method-2-mac--linux-manual-install)
   - [Method 3: Install from Zip](#method-3-install-from-zip)
3. [Configure API Key](#configure-api-key-1)
4. [Verify Installation](#verify-installation-1)
5. [Troubleshooting](#troubleshooting-1)

---

### Prerequisites

Before installing the plugin, make sure you have:

✅ **Node.js** >= 18.0.0  
✅ **OpenClaw** client installed  
✅ **AI Plan Manager** backend service running  
✅ Valid **API Key** (obtained from backend system)

> ⚠️ **Important**: Do NOT use OpenClaw's chat "auto-install" feature for this plugin.
> It only writes a config record but never places actual plugin files in the correct directory,
> resulting in `plugin not found` or `Unrecognized key: "path"` errors.
> Use one of the methods below instead.

---

### Installation Methods

#### Method 1: Windows One-Click Install (Recommended) ⭐

**Step 1**: Download the install script

Clone the repository or download `windows-install.ps1`:

```powershell
git clone https://github.com/feixuelingcloud/lingcloud-ai-plan-manager.git
cd lingcloud-ai-plan-manager
```

**Step 2**: Run the install script

Right-click `windows-install.ps1` → **Run with PowerShell**

Or in PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File windows-install.ps1
```

The script automatically:
- ✅ Clones/downloads plugin files to `~\.openclaw\plugins\lingcloud-ai-plan-manager\`
- ✅ Runs `npm install`
- ✅ Fixes `openclaw.json` (sets `plugins.load.paths` correctly)
- ✅ Restarts OpenClaw Gateway

**Step 3**: Configure your API Key (see below)

Done! 🎉

---

#### Method 2: Mac / Linux Manual Install

**Step 1**: Clone the repository

```bash
git clone https://github.com/feixuelingcloud/lingcloud-ai-plan-manager.git
cd lingcloud-ai-plan-manager
```

**Step 2**: Run the install script

```bash
chmod +x install.sh
./install.sh
```

---

#### Method 3: Install from Zip

**Step 1**: Download the zip from [Releases](https://github.com/feixuelingcloud/lingcloud-ai-plan-manager/releases).

**Step 2**: Extract to:
- **Windows**: `C:\Users\<username>\.openclaw\plugins\lingcloud-ai-plan-manager\`
- **Mac/Linux**: `~/.openclaw/plugins/lingcloud-ai-plan-manager/`

**Step 3**: Install dependencies

```bash
cd ~/.openclaw/plugins/lingcloud-ai-plan-manager
npm install
```

**Step 4**: Restart OpenClaw

```bash
openclaw gateway restart
```

---

### Configure API Key

Edit **`~/.openclaw/openclaw.json`**:

```json
{
  "plugins": {
    "load": {
      "paths": ["/absolute/path/to/lingcloud-ai-plan-manager"]
    },
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

**Save and restart OpenClaw.**

---

### Verify Installation

In OpenClaw chat, type:

```
Show me this week's plans
```

---

### Troubleshooting

#### Issue 1: `Unrecognized key: "path"`

**Cause**: OpenClaw incorrectly wrote `path` into `plugins.entries`.

**Fix**:
- Windows: Run `fix-config.bat`
- Mac/Linux: Run `bash fix-config.sh`

#### Issue 2: `plugin not found (stale config entry)`

**Cause**: Config entry exists but plugin files are missing from the directory.

**Fix**:
- Windows: Run `fix-config.bat` (installs files and fixes config)
- Mac/Linux: Run `bash install.sh`

#### Issue 3: Plugin loads but tools unavailable

```bash
rm -rf dist/
npm run build
openclaw gateway restart
```

---

### Get Help

- **GitHub Issues**: [Submit an Issue](https://github.com/feixuelingcloud/lingcloud-ai-plan-manager/issues)
- **Email**: yemihu@lingcloud.ai

---

<div align="center">

**[⬆ Back to Top](#-安装指导-installation-guide)**

</div>
