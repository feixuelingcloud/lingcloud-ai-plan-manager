# 修复 OpenClaw 配置问题

## 问题描述

OpenClaw 配置文件中插件的 `source` 字段值无效：

```
plugins.installs.@feixuelingcloud/lingcloud-ai-plan-manager.source: Invalid input
(allowed: "npm", "archive", "path", "clawhub", "marketplace")
```

## 解决方案

### 方法 1：手动编辑配置文件（推荐）

1. 打开 OpenClaw 配置文件：
   - Windows: `C:\Users\<你的用户名>\.openclaw\openclaw.json`
   - Linux/Mac: `~/.openclaw/openclaw.json`

2. 找到 `plugins.installs` 部分，查找 `@feixuelingcloud/lingcloud-ai-plan-manager` 配置

3. 修改 `source` 字段为以下任意一个有效值：
   - `"clawhub"` - 如果从 ClawHub 安装
   - `"archive"` - 如果从 zip 文件安装
   - `"path"` - 如果从本地路径安装
   - `"marketplace"` - 如果从市场安装
   - `"npm"` - 如果从 npm 安装

4. 保存文件并重启 OpenClaw

### 方法 2：完全卸载并重新安装

1. **手动删除插件配置**

   编辑 `~/.openclaw/openclaw.json`，删除 `@feixuelingcloud/lingcloud-ai-plan-manager` 的整个配置块

2. **重启 OpenClaw**

3. **重新安装插件**

   使用打包好的文件重新安装：
   ```
   f:\菩提闻道\001-塞外飞雪2024\桌面\openclaw-plan-manager20260406\release\lingcloud-ai-plan-manager-1.0.0-clawhub.zip
   ```

## 正确的配置示例

```json
{
  "plugins": {
    "installs": {
      "@feixuelingcloud/lingcloud-ai-plan-manager": {
        "source": "archive",  // 或 "clawhub", "path", "marketplace", "npm"
        "version": "1.0.0",
        "enabled": true,
        "config": {
          "apiKey": "your-api-key-here"
        }
      }
    }
  }
}
```

## 验证修复

修复后重启 OpenClaw，应该不再看到配置错误信息。
