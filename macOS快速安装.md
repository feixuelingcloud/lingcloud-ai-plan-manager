# macOS 快速安装

## 前提
- Node.js >= 18（终端执行 `node -v` 确认）
- OpenClaw 已安装
- 有效的 API Key

---

## 一、克隆仓库并运行安装脚本

打开终端（`Command + 空格` → 输入 `Terminal` → 回车），粘贴以下命令：

```bash
git clone https://github.com/feixuelingcloud/lingcloud-ai-plan-manager.git
cd lingcloud-ai-plan-manager
chmod +x install.sh && ./install.sh
```

脚本自动完成：
- ✅ 将插件文件复制到 `~/.openclaw/plugins/lingcloud-ai-plan-manager/`
- ✅ 运行 `npm install`，触发自动配置修复
- ✅ 修复 `openclaw.json`（`plugins.load.paths` 正确指向插件目录）
- ✅ 重启 OpenClaw Gateway

---

## 二、配置 API Key

编辑 `~/.openclaw/openclaw.json`，找到以下片段填入 API Key：

```json
{
  "plugins": {
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

保存后重启：

```bash
openclaw gateway restart
```

---

## 三、验证

在 OpenClaw 中输入：

```
告诉我本周的计划
```

看到计划列表或提示创建新计划即表示安装成功 🎉

---

## 遇到问题？

| 错误 | 解决方法 |
|------|---------|
| `Unrecognized key: "path"` | 运行 `bash fix-config.sh` |
| `plugin not found` | 重新运行 `./install.sh` |
| `openclaw: command not found` | 检查 OpenClaw 是否已安装并加入 PATH |
| `node: command not found` | 安装 Node.js >= 18：https://nodejs.org |

详细说明见 [macOS安装指南.md](macOS安装指南.md)
