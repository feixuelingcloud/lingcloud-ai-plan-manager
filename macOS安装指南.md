# macOS 安装指南

## ✅ 推荐安装方式：OpenClaw 聊天自动安装

在 **OpenClaw 聊天界面**中输入：

```
从 GitHub 安装插件：https://github.com/feixuelingcloud/gotoplan-manager
```

OpenClaw 会自动完成：
- ✅ 克隆插件仓库到 `~/.openclaw/plugins/gotoplan-manager/`
- ✅ 运行 `npm install`（自动触发 postinstall 配置修复）
- ✅ 构建插件
- ✅ 配置 `openclaw.json`
- ✅ 重启 Gateway

按提示配置 API Key 即可开始使用 🎉

---

## 备选：手动安装

如果聊天安装失败，使用以下方式：

### 步骤 1：克隆仓库

打开终端（`Command + 空格` → `Terminal`）：

```bash
git clone https://github.com/feixuelingcloud/gotoplan-manager.git
cd gotoplan-manager
```

### 步骤 2：运行安装脚本

```bash
chmod +x install.sh
./install.sh
```

---

## 配置 API Key

#### 方式 1：通过 OpenClaw 聊天（最简单）

```
请配置 gotoplan-manager 的 API Key: YOUR_API_KEY_HERE
```

#### 方式 2：手动编辑配置文件

```bash
nano ~/.openclaw/openclaw.json
```

找到插件条目填入 API Key：

```json
{
  "plugins": {
    "entries": {
      "@gotoplan/manager": {
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

保存（`Ctrl+O` → 回车 → `Ctrl+X`）后重启：

```bash
openclaw gateway restart
```

---

## 验证安装

在 OpenClaw 中输入：

```
告诉我本周的计划
```

---

## 故障排查

### `plugin not found`

重新聊天安装，或手动运行：

```bash
./install.sh
```

### `openclaw: command not found`

OpenClaw 未加入 PATH。临时使用完整路径：

```bash
/Applications/OpenClaw.app/Contents/MacOS/openclaw gateway restart
```

永久解决（macOS Catalina+，使用 zsh）：

```bash
echo 'export PATH="/Applications/OpenClaw.app/Contents/MacOS:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### `node: command not found` / Node 版本过低

推荐用 nvm 安装：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc
nvm install 22 && nvm use 22
```

### 插件加载但工具不可用

```bash
cd ~/.openclaw/plugins/gotoplan-manager
npm run build
openclaw gateway restart
```

### `EACCES: permission denied`

不要用 `sudo npm install`，修复 npm 权限：

```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

---

## 使用 nvm 的用户

确保安装前激活正确 Node 版本：

```bash
nvm use 18  # 或更高
./install.sh
```

---

## 卸载

```bash
rm -rf ~/.openclaw/plugins/gotoplan-manager
# 编辑 openclaw.json 删除插件条目
nano ~/.openclaw/openclaw.json
openclaw gateway restart
```

---

## 获取帮助

- **GitHub Issues**：[提交问题](https://github.com/feixuelingcloud/gotoplan-manager/issues)
- **Email**：yemihu@lingcloud.ai
