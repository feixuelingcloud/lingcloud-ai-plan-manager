# macOS 快速安装

## ✅ 推荐：通过 OpenClaw 聊天自动安装

打开 **OpenClaw 聊天界面**，输入：

```
从 GitHub 安装插件：https://github.com/feixuelingcloud/lingcloud-ai-plan-manager
```

OpenClaw 会自动完成克隆、构建、配置全流程，按提示填入 API Key 即可 🎉

---

## 备选：手动安装

如果聊天安装失败，打开终端（`Command + 空格` → 输入 `Terminal`）：

```bash
git clone https://github.com/feixuelingcloud/lingcloud-ai-plan-manager.git
cd lingcloud-ai-plan-manager
chmod +x install.sh && ./install.sh
```

---

## 配置 API Key

安装后编辑 `~/.openclaw/openclaw.json`，填入 API Key：

```json
{
  "plugins": {
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

或在 OpenClaw 聊天中直接说：

```
请配置 lingcloud-ai-plan-manager 的 API Key: YOUR_API_KEY_HERE
```

---

## 遇到问题？

| 错误 | 解决方法 |
|------|---------|
| `plugin not found` | 重新聊天安装，或运行 `bash install.sh` |
| `openclaw: command not found` | 检查 OpenClaw 是否加入 PATH，见 [macOS安装指南.md](macOS安装指南.md) |
| `node: command not found` | 安装 Node.js >= 18：https://nodejs.org |
| 工具不可用 | `cd ~/.openclaw/plugins/lingcloud-ai-plan-manager && npm run build && openclaw gateway restart` |
