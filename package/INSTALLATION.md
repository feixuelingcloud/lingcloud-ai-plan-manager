# 📦 安装指导 Installation Guide

[English](#english) | [中文](#中文)

---

## 中文

### 📋 目录
1. [前置要求](#前置要求)
2. [安装方法](#安装方法)
   - [方法一：通过 OpenClaw 聊天自动安装（推荐）](#方法一通过-openclaw-聊天自动安装推荐)
   - [方法二：从 GitHub 手动安装](#方法二从-github-手动安装)
   - [方法三：从 Claw Hub 安装](#方法三从-claw-hub-安装)
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

### 安装方法

#### 方法一：通过 OpenClaw 聊天自动安装（推荐）⭐

这是最简单、最快速的安装方式！

**步骤 1**: 打开 OpenClaw 聊天界面

**步骤 2**: 输入以下任意一句话：

```
请帮我安装 lingcloud-ai-plan-manager 插件
```

或者：

```
从 GitHub 安装插件: https://github.com/feixuelingcloud/lingcloud-ai-plan-manager
```

或者简单地说：

```
安装计划管理插件
```

**步骤 3**: OpenClaw 会自动执行：
- ✅ 克隆插件仓库
- ✅ 安装 npm 依赖
- ✅ 构建插件（运行 TypeScript 编译）
- ✅ 配置插件路径

**步骤 4**: 按照提示配置你的 API Key（见下文）

**步骤 5**: 重启 OpenClaw 或重新加载插件

完成！🎉

---

#### 方法二：从 GitHub 手动安装

如果你希望更多控制权或需要自定义配置，可以手动安装。

**步骤 1**: 克隆仓库

```bash
git clone https://github.com/feixuelingcloud/lingcloud-ai-plan-manager.git
cd lingcloud-ai-plan-manager
```

**步骤 2**: 安装依赖

```bash
npm install
```

**步骤 3**: 构建插件

```bash
npm run build
```

这会将 TypeScript 编译为 JavaScript 并输出到 `dist/` 目录。

**步骤 4**: 安装到 OpenClaw

**选项 A - 使用 OpenClaw CLI**（如果可用）：

```bash
openclaw plugins install -l ./lingcloud-ai-plan-manager
```

**选项 B - 手动编辑配置文件**（不推荐；易与旧文档混淆）

编辑 **`~/.openclaw/openclaw.json`**。当前 OpenClaw 网关使用 **`plugins.entries`**，**禁止**在 `entries` 下写 `path` / `name`（否则会报 `Unrecognized key: "path"`）。

从源码目录加载时需 **`plugins.load.paths`（绝对路径）** + **`plugins.entries` 仅含 `enabled` / `config`**：

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
          "apiKey": "",
          "apiBase": "https://plan.lingcloudai.com/api"
        }
      }
    }
  }
}
```

**重要**：`paths` 使用插件根目录的绝对路径；业务配置键名与 `openclaw.plugin.json` 一致，为 **`apiBase`**（不要使用已废弃示例里的 `apiBaseUrl`）。

**步骤 5**: 配置 API Key（见下文）

**步骤 6**: 重启 OpenClaw

```bash
# 如果使用 OpenClaw CLI
openclaw restart

# 或者手动重启 OpenClaw 应用
```

---

#### 方法三：从 Claw Hub 安装

（待 Claw Hub 正式发布后）

**步骤 1**: 打开 OpenClaw 聊天界面

**步骤 2**: 输入：

```
从 Claw Hub 安装 lingcloud-ai-plan-manager
```

**步骤 3**: 按照屏幕提示操作

---

### 配置 API Key

插件需要 API Key 才能与你的后端服务通信。

#### 获取 API Key

1. 打开你的 **AI 计划管理系统** Web 界面
2. 登录你的账户
3. 导航到 **设置 → API 管理**
4. 点击 **创建新的 API Key**
5. **复制** 生成的 API Key（重要：妥善保存，只显示一次！）

#### 方式 1：通过 OpenClaw 聊天配置（推荐）

在 OpenClaw 聊天界面中输入：

```
请配置 lingcloud-ai-plan-manager 的 API Key: YOUR_API_KEY_HERE
```

或分别设置：

```
设置 lingcloud-ai-plan-manager 的 API 地址: https://your-api.com/api
```

OpenClaw 会自动更新配置。

#### 方式 2：手动编辑配置文件

编辑 **`~/.openclaw/openclaw.json`**：

```json
{
  "plugins": {
    "entries": {
      "@feixuelingcloud/lingcloud-ai-plan-manager": {
        "enabled": true,
        "config": {
          "apiKey": "your-api-key-here",
          "apiBase": "https://your-backend-api.com/api"
        }
      }
    }
  }
}
```

**保存文件后重启 OpenClaw。**

---

### 验证安装

#### 检查插件状态

**方法 1：通过聊天**

```
列出所有已安装的插件
```

你应该看到 `lingcloud-ai-plan-manager` 在列表中。

**方法 2：使用 CLI**（如果可用）

```bash
openclaw plugins list
```

输出应包含：

```
✅ lingcloud-ai-plan-manager@1.0.0 (enabled)
```

#### 测试功能

在 OpenClaw 聊天中输入：

```
告诉我本周的计划
```

如果插件正常工作，你会看到计划列表或提示创建新计划。

---

### 故障排查

#### 问题 1: 插件未显示在列表中

**可能原因**:
- 插件路径配置错误
- 构建未完成（`dist/` 目录不存在）
- OpenClaw 未重启

**解决方法**:
1. 检查配置文件中的路径是否正确（必须是绝对路径）
2. 运行 `npm run build` 确保构建成功
3. 完全重启 OpenClaw（不只是重新加载）

#### 问题 2: API 连接失败

**错误信息**: `Failed to fetch` 或 `Network error`

**可能原因**:
- API Key 无效或过期
- API Base URL 配置错误
- 后端服务未运行
- 网络连接问题

**解决方法**:
1. 验证 API Key 是否正确（重新生成一个试试）
2. 检查 `apiBase` 是否可访问（在浏览器中打开试试）
3. 确认后端服务正在运行：
   ```bash
   curl https://your-backend-api.com/api/health
   ```
4. 检查防火墙设置

#### 问题 3: TypeScript 编译错误

**错误信息**: `tsc: command not found` 或编译错误

**解决方法**:
1. 确保 Node.js >= 18
2. 删除并重新安装依赖：
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. 检查类型错误：
   ```bash
   npm run check
   ```

#### 问题 4: 插件加载但工具不可用

**可能原因**:
- 构建不完整
- OpenClaw 缓存问题

**解决方法**:
1. 清除缓存并重建：
   ```bash
   rm -rf dist/
   npm run build
   ```
2. 清除 OpenClaw 缓存（如果有此选项）
3. 完全重启 OpenClaw

#### 问题 5: 权限错误

**错误信息**: `EACCES: permission denied`

**解决方法**:
```bash
# 修复文件权限
chmod -R 755 lingcloud-ai-plan-manager

# 重新安装依赖
npm install
```

---

### 获取帮助

如果以上方法都无法解决你的问题：

1. **查看日志**:
   - OpenClaw 日志（通常在 `~/.openclaw/logs/`）
   - 插件控制台输出

2. **提交 Issue**:
   - 访问 [GitHub Issues](https://github.com/feixuelingcloud/lingcloud-ai-plan-manager/issues)
   - 提供详细的错误信息和环境信息

3. **联系支持**:
   - Email: your-email@example.com

---

## English

### 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation Methods](#installation-methods)
   - [Method 1: Auto-install via OpenClaw Chat (Recommended)](#method-1-auto-install-via-openclaw-chat-recommended)
   - [Method 2: Manual Install from GitHub](#method-2-manual-install-from-github)
   - [Method 3: Install from Claw Hub](#method-3-install-from-claw-hub)
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

---

### Installation Methods

#### Method 1: Auto-install via OpenClaw Chat (Recommended)⭐

This is the simplest and fastest way!

**Step 1**: Open OpenClaw chat interface

**Step 2**: Type any of these:

```
Please install lingcloud-ai-plan-manager plugin
```

Or:

```
Install plugin from GitHub: https://github.com/feixuelingcloud/lingcloud-ai-plan-manager
```

Or simply:

```
Install plan manager plugin
```

**Step 3**: OpenClaw will automatically:
- ✅ Clone the plugin repository
- ✅ Install npm dependencies
- ✅ Build the plugin (TypeScript compilation)
- ✅ Configure plugin path

**Step 4**: Follow prompts to configure your API Key (see below)

**Step 5**: Restart OpenClaw or reload plugins

Done! 🎉

---

#### Method 2: Manual Install from GitHub

For more control or custom configurations.

**Step 1**: Clone the repository

```bash
git clone https://github.com/feixuelingcloud/lingcloud-ai-plan-manager.git
cd lingcloud-ai-plan-manager
```

**Step 2**: Install dependencies

```bash
npm install
```

**Step 3**: Build the plugin

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

**Step 4**: Install to OpenClaw

**Option A - Using OpenClaw CLI** (if available):

```bash
openclaw plugins install -l ./lingcloud-ai-plan-manager
```

**Option B - Manual configuration**:

Edit **`~/.openclaw/openclaw.json`**. Do **not** put `path` under `plugins.entries` (gateway will reject with `Unrecognized key: "path"`). Use `plugins.load.paths` for the plugin root + `plugins.entries` for `enabled` / `config` only:

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
          "apiKey": "",
          "apiBase": "https://plan.lingcloudai.com/api"
        }
      }
    }
  }
}
```

**Important**: Use an absolute path in `load.paths`. Config keys must match `openclaw.plugin.json` (`apiBase`, not `apiBaseUrl`).

**Step 5**: Configure API Key (see below)

**Step 6**: Restart OpenClaw

```bash
# If using OpenClaw CLI
openclaw restart

# Or manually restart OpenClaw application
```

---

#### Method 3: Install from Claw Hub

(Available when Claw Hub is officially released)

**Step 1**: Open OpenClaw chat

**Step 2**: Type:

```
Install lingcloud-ai-plan-manager from Claw Hub
```

**Step 3**: Follow on-screen instructions

---

### Configure API Key

The plugin requires an API Key to communicate with your backend service.

#### Obtain API Key

1. Open your **AI Plan Manager** web interface
2. Log in to your account
3. Navigate to **Settings → API Management**
4. Click **Create New API Key**
5. **Copy** the generated API Key (Important: save it securely, shown only once!)

#### Option 1: Configure via OpenClaw Chat (Recommended)

In OpenClaw chat, type:

```
Please configure lingcloud-ai-plan-manager API Key: YOUR_API_KEY_HERE
```

Or set separately:

```
Set lingcloud-ai-plan-manager API URL: https://your-api.com/api
```

OpenClaw will update the configuration automatically.

#### Option 2: Manual Configuration

Edit **`~/.openclaw/openclaw.json`**:

```json
{
  "plugins": {
    "entries": {
      "@feixuelingcloud/lingcloud-ai-plan-manager": {
        "enabled": true,
        "config": {
          "apiKey": "your-api-key-here",
          "apiBase": "https://your-backend-api.com/api"
        }
      }
    }
  }
}
```

**Save and restart OpenClaw.**

---

### Verify Installation

#### Check Plugin Status

**Method 1: Via Chat**

```
List all installed plugins
```

You should see `lingcloud-ai-plan-manager` in the list.

**Method 2: Using CLI** (if available)

```bash
openclaw plugins list
```

Output should include:

```
✅ lingcloud-ai-plan-manager@1.0.0 (enabled)
```

#### Test Functionality

In OpenClaw chat, type:

```
Show me this week's plans
```

If the plugin works correctly, you'll see a plan list or prompt to create one.

---

### Troubleshooting

#### Issue 1: Plugin Not Showing in List

**Possible Causes**:
- Incorrect plugin path configuration
- Build incomplete (`dist/` directory missing)
- OpenClaw not restarted

**Solutions**:
1. Check path in config file is correct (must be absolute)
2. Run `npm run build` to ensure successful build
3. Fully restart OpenClaw (not just reload)

#### Issue 2: API Connection Failed

**Error Message**: `Failed to fetch` or `Network error`

**Possible Causes**:
- Invalid or expired API Key
- Incorrect API Base URL
- Backend service not running
- Network issues

**Solutions**:
1. Verify API Key is correct (try regenerating one)
2. Check `apiBase` is accessible (try opening in browser)
3. Confirm backend service is running:
   ```bash
   curl https://your-backend-api.com/api/health
   ```
4. Check firewall settings

#### Issue 3: TypeScript Compilation Errors

**Error Message**: `tsc: command not found` or compilation errors

**Solutions**:
1. Ensure Node.js >= 18
2. Delete and reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. Check for type errors:
   ```bash
   npm run check
   ```

#### Issue 4: Plugin Loads But Tools Unavailable

**Possible Causes**:
- Incomplete build
- OpenClaw cache issues

**Solutions**:
1. Clear cache and rebuild:
   ```bash
   rm -rf dist/
   npm run build
   ```
2. Clear OpenClaw cache (if option available)
3. Fully restart OpenClaw

#### Issue 5: Permission Errors

**Error Message**: `EACCES: permission denied`

**Solutions**:
```bash
# Fix file permissions
chmod -R 755 lingcloud-ai-plan-manager

# Reinstall dependencies
npm install
```

---

### Get Help

If none of the above solutions work:

1. **Check Logs**:
   - OpenClaw logs (usually in `~/.openclaw/logs/`)
   - Plugin console output

2. **Submit an Issue**:
   - Visit [GitHub Issues](https://github.com/feixuelingcloud/lingcloud-ai-plan-manager/issues)
   - Provide detailed error messages and environment info

3. **Contact Support**:
   - Email: your-email@example.com

---

<div align="center">

**[⬆ Back to Top](#-安装指导-installation-guide)**

</div>
