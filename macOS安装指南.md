# macOS 安装指南

## ⚠️ 重要提示

请**不要**通过 OpenClaw 聊天界面的"自动安装"功能安装本插件。该方式只写入配置记录，不会将插件文件放到正确目录，会导致 `plugin not found` 错误。请按以下步骤手动安装。

---

## 前置要求

- **Node.js** >= 18.0.0（`node -v` 确认）
- **git**（`git --version` 确认）
- **OpenClaw** 已安装
- 有效的 **API Key**

---

## 安装步骤

### 步骤 1：克隆仓库

打开终端（`Command + 空格` → 输入 `Terminal`）：

```bash
git clone https://github.com/feixuelingcloud/lingcloud-ai-plan-manager.git
cd lingcloud-ai-plan-manager
```

### 步骤 2：运行安装脚本

```bash
chmod +x install.sh
./install.sh
```

脚本自动完成：
- ✅ 将插件文件复制到 `~/.openclaw/plugins/lingcloud-ai-plan-manager/`
- ✅ 运行 `npm install` 安装依赖
- ✅ 修复 `openclaw.json`（将路径正确写入 `plugins.load.paths`）
- ✅ 重启 OpenClaw Gateway

### 步骤 3：配置 API Key

编辑 `~/.openclaw/openclaw.json`：

```bash
nano ~/.openclaw/openclaw.json
```

找到插件条目，填入 API Key：

```json
{
  "plugins": {
    "load": {
      "paths": ["/Users/你的用户名/.openclaw/plugins/lingcloud-ai-plan-manager"]
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

保存（`Ctrl+O` → 回车 → `Ctrl+X`）后重启：

```bash
openclaw gateway restart
```

### 步骤 4：验证安装

在 OpenClaw 中输入：

```
告诉我本周的计划
```

看到计划列表即表示安装成功 🎉

---

## 故障排查

### `Unrecognized key: "path"`

原因：`plugins.entries` 里有非法的 `path` 字段。

修复：

```bash
bash fix-config.sh
```

### `plugin not found (stale config entry)`

原因：配置记录存在但插件文件不在目录中。

修复：重新运行安装脚本：

```bash
./install.sh
```

### `openclaw: command not found`

OpenClaw 未加入 PATH。临时解决：

```bash
# 查找 openclaw 位置
mdfind -name openclaw 2>/dev/null | head -5

# 使用完整路径（示例）
/Applications/OpenClaw.app/Contents/MacOS/openclaw gateway restart
```

永久解决，编辑 `~/.zshrc`（macOS Catalina+）：

```bash
echo 'export PATH="/Applications/OpenClaw.app/Contents/MacOS:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### `node: command not found` / Node 版本过低

安装或升级 Node.js：

```bash
# 推荐用 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc
nvm install 22
nvm use 22
```

### `EACCES: permission denied`

```bash
# 不要用 sudo npm install
# 修复 npm 全局目录权限
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

---

## 使用 nvm 的用户

如果使用 nvm 管理 Node.js，确保安装前激活正确版本：

```bash
nvm use 18  # 或更高版本
./install.sh
```

---

## 卸载

```bash
# 删除插件文件
rm -rf ~/.openclaw/plugins/lingcloud-ai-plan-manager

# 编辑 openclaw.json，删除插件条目
nano ~/.openclaw/openclaw.json

# 重启
openclaw gateway restart
```

---

## 获取帮助

- **GitHub Issues**：[提交问题](https://github.com/feixuelingcloud/lingcloud-ai-plan-manager/issues)
- **Email**：yemihu@lingcloud.ai
