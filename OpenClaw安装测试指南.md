# OpenClaw 安装测试指南

## 准备工作

### 可用的安装包
1. **npm 包** (推荐用于本地测试):
   - 文件: `lingcloud-ai-plan-manager-1.0.0.tgz`
   - 大小: 102KB
   - 更新时间: 刚刚生成
   - SHA512: `57f8e0fdf4f70a0be6af6654a12b4c730e4dd111`

2. **ClawHub 包** (用于 ClawHub 发布):
   - 文件: `release/lingcloud-ai-plan-manager-1.0.0-clawhub.zip`
   - 大小: 45KB
   - SHA256: `5c4aceb07bb721d19a52d6f209a9dd9bc6b97d2c5992b27c5f4fe135770f7a2f`

3. **GitHub Release**:
   - 仓库: https://github.com/feixuelingcloud/lingcloud-ai-plan-manager
   - 标签: v1.0.0

## 测试方法

### 方法 1: 本地文件安装 (最快)

```bash
# 在 OpenClaw 中执行
/plugins install /path/to/lingcloud-ai-plan-manager-1.0.0.tgz
```

**Windows 路径示例**:
```bash
/plugins install "f:\菩提闻道\001-塞外飞雪2024\桌面\AI计划管理系统_网页版20260328\openclaw-plan-manager\lingcloud-ai-plan-manager-1.0.0.tgz"
```

### 方法 2: 从 GitHub 安装

```bash
# 使用 GitHub 仓库 URL
/plugins install https://github.com/feixuelingcloud/lingcloud-ai-plan-manager

# 或指定版本
/plugins install https://github.com/feixuelingcloud/lingcloud-ai-plan-manager#v1.0.0
```

### 方法 3: 从 ClawHub 安装 (需要先在 ClawHub 发布)

```bash
# 使用插件名称
/plugins install lingcloud-ai-plan-manager

# 或使用完整 ID
/plugins install @feixuelingcloud/lingcloud-ai-plan-manager
```

## 安装后验证

### 1. 检查插件是否已安装
```bash
/plugins list
```

应该看到:
```
lingcloud-ai-plan-manager@1.0.0
```

### 2. 查看插件信息
```bash
/plugins info lingcloud-ai-plan-manager
```

### 3. 测试插件工具

在 OpenClaw Chat 中测试以下命令:

#### 创建计划草稿
```
帮我创建一个学习 TypeScript 的计划
```

#### 列出所有计划
```
列出我的所有计划
```

#### 查看今日焦点
```
今天我需要关注哪些任务?
```

#### 获取计划提醒
```
有哪些需要提醒的任务?
```

## 常见问题排查

### 问题 1: 插件安装失败
**检查**:
- OpenClaw 版本是否 >= 1.0.0
- Node.js 版本是否 >= 18
- 文件路径是否正确

### 问题 2: 工具无法使用
**检查**:
- 插件是否已启用: `/plugins enable lingcloud-ai-plan-manager`
- 查看插件日志: `/plugins logs lingcloud-ai-plan-manager`

### 问题 3: API 连接失败
**配置后端 API**:
```bash
# 在 OpenClaw 设置中配置
API Base URL: https://your-backend-api.com/api
API Key: your-api-key
```

## 配置插件

### 通过 OpenClaw 界面配置
1. 打开 OpenClaw 设置
2. 找到 "Plugins" -> "lingcloud-ai-plan-manager"
3. 配置:
   - API Key: 您的 API 密钥
   - API Base URL: 后端服务地址

### 通过配置文件
编辑 **`~/.openclaw/openclaw.json`**，在 `plugins.entries` 下配置（键名与 `openclaw.plugin.json` 一致）：
```json
{
  "plugins": {
    "entries": {
      "@feixuelingcloud/lingcloud-ai-plan-manager": {
        "enabled": true,
        "config": {
          "apiKey": "your-api-key",
          "apiBase": "https://your-backend-api.com/api"
        }
      }
    }
  }
}
```

## 卸载插件

如果需要卸载:
```bash
/plugins uninstall lingcloud-ai-plan-manager
```

## 测试清单

安装测试完成后,请验证:

- [ ] 插件成功安装
- [ ] 插件出现在插件列表中
- [ ] 可以看到插件信息
- [ ] 工具可以在 Chat 中调用
- [ ] API 配置正确
- [ ] 可以创建计划草稿
- [ ] 可以列出计划
- [ ] 可以查看今日焦点
- [ ] 可以获取提醒

## 反馈问题

如果遇到问题,请:
1. 收集错误日志: `/plugins logs lingcloud-ai-plan-manager`
2. 在 GitHub 提交 Issue: https://github.com/feixuelingcloud/lingcloud-ai-plan-manager/issues
3. 附上:
   - OpenClaw 版本
   - Node.js 版本
   - 错误信息
   - 重现步骤
