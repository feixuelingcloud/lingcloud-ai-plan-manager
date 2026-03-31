# 🎯 LingCloud AI 计划管理器

<div align="center">

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/YOUR_USERNAME/lingcloud-ai-plan-manager)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Plugin-orange.svg)](https://openclaw.ai)

**一个强大的 OpenClaw 插件，通过 AI 助手实现智能计划和任务管理**

[English](README_EN.md) | 简体中文

</div>

---

## ✨ 功能特性

### 📋 计划管理
- **创建计划草稿** - AI 辅助创建结构化的计划草稿
- **确认和修改计划** - 灵活的计划确认和修改流程
- **计划列表查询** - 支持多种时间范围和状态筛选
  - **本周** / **上周** / **本月** / **全部**
  - **待办** / **进行中** / **已完成** / **被阻塞**
- **计划详情查看** - 获取完整的计划信息和任务层级

### ✅ 任务管理
- **任务状态更新** - 快速更新任务的执行状态
- **进度跟踪** - 实时追踪任务和计划的完成进度
- **层级任务支持** - 支持多层级的父子任务关系

### 📊 报告和分析
- **执行报告生成** - 自动生成计划执行情况报告
  - 完成率统计
  - 逾期任务统计
  - 阻塞任务识别
  - 下一步行动建议
- **今日重点** - 快速查看今天需要关注的任务
- **计划提醒** - 智能提醒即将到期的任务

### 🤖 AI 集成
- 自然语言交互
- 智能时间解析（支持"明天"、"下周一"等自然表达）
- 上下文感知的任务管理
- 自动化的工作流建议

---

## 🚀 快速开始

### 方法一：通过 OpenClaw 聊天界面自动安装（推荐）⭐

这是最简单的安装方式！只需在 **OpenClaw 聊天界面**中输入以下任意一句话：

```
请帮我安装 lingcloud-ai-plan-manager 插件
```

或者：

```
从 GitHub 安装插件: https://github.com/YOUR_USERNAME/lingcloud-ai-plan-manager
```

或者：

```
安装计划管理插件
```

**OpenClaw 会自动帮你完成：**
1. ✅ 克隆插件仓库
2. ✅ 安装依赖
3. ✅ 构建插件
4. ✅ 配置插件路径

**然后你只需要：**
- 按照提示配置你的 API Key
- 开始使用！

### 方法二：手动安装

#### 前置要求
- Node.js >= 18
- OpenClaw 客户端
- 一个运行中的后端 API 服务

#### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/YOUR_USERNAME/lingcloud-ai-plan-manager.git
   cd lingcloud-ai-plan-manager
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **构建插件**
   ```bash
   npm run build
   ```

4. **在 OpenClaw 中配置插件**

   方式 A - 使用 OpenClaw CLI：
   ```bash
   openclaw plugins install -l ./lingcloud-ai-plan-manager
   ```

   方式 B - 手动编辑配置文件 `~/.openclaw/config.json`：
   ```json
   {
     "plugins": [
       {
         "name": "lingcloud-ai-plan-manager",
         "path": "/path/to/lingcloud-ai-plan-manager",
         "config": {
           "apiKey": "YOUR_API_KEY",
           "apiBaseUrl": "https://plan.lingcloudai.com/api"
         }
       }
     ]
   }
   ```

5. **重启 OpenClaw**

---

## ⚙️ 配置说明

### API Key 获取

你需要从你的 AI 计划管理系统后端获取 API Key：

1. 登录你的 AI 计划管理系统
2. 进入 **设置 → API 管理**
3. 点击 **创建新的 API Key**
4. 复制 API Key 并妥善保存

### 在 OpenClaw 中配置 API Key

#### 💡 方法 1：通过聊天界面配置（最简单）

在 OpenClaw 聊天界面中输入：

```
请配置 lingcloud-ai-plan-manager 插件的 API Key: YOUR_API_KEY_HERE
```

```

OpenClaw 会自动帮你更新配置！

#### 方法 2：手动编辑配置文件

编辑 OpenClaw 配置文件 `~/.openclaw/config.json`：
```json
{
  "plugins": [
    {
      "name": "lingcloud-ai-plan-manager",
      "config": {
        "apiKey": "YOUR_API_KEY",
        "apiBaseUrl": "https://plan.lingcloudai.com/api"
      }
    }
  ]
}
```

配置完成后重启 OpenClaw 即可生效。

---

## 📖 使用指南

### 基础操作

#### 1. 创建计划 📝

```
帮我创建一个新项目计划：开发移动应用，包含设计、开发、测试三个阶段
```

AI 会帮你生成计划草稿，确认后会自动创建。

#### 2. 查看计划列表 📋

```
告诉我本周的计划
```

```
查看上周完成的计划
```

```
显示所有进行中的计划
```

#### 3. 查看计划详情 🔍

```
告诉我第1个计划的详情
```

#### 4. 更新任务状态 ✅

```
将"设计原型"这个任务标记为已完成
```

#### 5. 生成执行报告 📊

```
生成本周的计划执行报告
```

```
查看上周的计划完成情况
```

#### 6. 查看今日重点 🎯

```
今天我需要做什么？
```

```
显示今日重点任务
```

### 高级功能

#### 时间范围筛选 📅

支持的时间范围：
- `本周` - 当前周（周一到周日）
- `上周` - 上一周（周一到周日）✨ **新增**
- `本月` - 当前月
- `全部` - 所有时间

示例：
```
查看上周的计划
告诉我本月所有已完成的计划
显示全部进行中的任务
```

#### 状态筛选 🏷️

支持的状态：
- `待办` (pending)
- `进行中` (in_progress)
- `已完成` (completed)
- `被阻塞` (blocked)

#### 关键词搜索 🔎

```
查找包含"开发"的计划
```

---

## 🛠️ 可用工具

插件提供以下 9 个工具：

| 工具名称 | 描述 | 类型 |
|---------|------|------|
| `create_plan_draft` | 创建计划草稿 | 只读 |
| `confirm_plan` | 确认创建计划 | 写入 |
| `update_plan` | 修改计划信息 | 写入 |
| `list_plans` | 列出计划列表 | 只读 |
| `get_plan_detail` | 获取计划详情 | 只读 |
| `update_task_status` | 更新任务状态 | 写入 |
| `generate_execution_report` | 生成执行报告 | 只读 |
| `get_plan_reminders` | 获取计划提醒 | 只读 |
| `get_today_focus` | 获取今日重点 | 只读 |

---

## 📁 项目结构

```
lingcloud-ai-plan-manager/
├── src/
│   ├── client/          # API 客户端
│   │   └── apiClient.ts
│   ├── config/          # 配置管理
│   │   └── index.ts
│   ├── tools/           # OpenClaw 工具
│   │   ├── createPlanDraft.ts
│   │   ├── confirmPlan.ts
│   │   ├── updatePlan.ts
│   │   ├── listPlans.ts
│   │   ├── getPlanDetail.ts
│   │   ├── updateTaskStatus.ts
│   │   ├── generateReport.ts
│   │   ├── getPlanReminders.ts
│   │   └── getTodayFocus.ts
│   └── utils/           # 工具函数
│       └── errors.ts
├── dist/                # 编译输出
├── index.ts             # 插件入口
├── package.json
├── tsconfig.json
├── README.md            # 中文文档
├── README_EN.md         # 英文文档
├── INSTALLATION.md      # 详细安装指导
├── CHANGELOG.md         # 更新日志
└── LICENSE              # MIT 许可证
```

---

## 🔧 开发

### 本地开发

```bash
# 安装依赖
npm install

# 开发模式（带热重载）
npm run dev

# 类型检查
npm run check

# 构建
npm run build
```

### 调试

设置环境变量启用调试模式：
```bash
DEBUG=true npm run dev
```

---

## 🆕 更新日志

### v1.0.0 (2026-03-31)

#### ✨ 新功能
- ✅ 支持查询"上周"的计划和报告
- ✅ 添加 `last_week` 时间范围选项
- ✅ 完善的时间范围计算逻辑

#### 🐛 Bug 修复
- 🔧 修复上周时间范围计算错误
- 🔧 优化周一/周日的边界处理

#### 📝 文档
- 📚 完整的 GitHub 发布文档
- 📚 详细的安装和配置指南
- 📚 英文版 README

查看完整更新日志：[CHANGELOG.md](CHANGELOG.md)

---

## 🤝 贡献

欢迎贡献！请查看 [贡献指南](CONTRIBUTING.md)。

### 报告问题

如果你发现了 bug 或有功能建议，请在 [GitHub Issues](https://github.com/YOUR_USERNAME/lingcloud-ai-plan-manager/issues) 中提交。

---

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

---

## 🙏 致谢

- [OpenClaw](https://openclaw.ai) - 强大的 AI 助手平台
- 所有贡献者和用户的支持

---

## 📞 联系方式

- **作者**: Lingyun
- **Email**: yemihu@lingcloud.ai
- **GitHub**: [@feixuelingcloud](https://github.com/YOUR_USERNAME)

---

## ❓ 常见问题

### Q: 如何更新插件？

**A:** 在 OpenClaw 聊天界面中输入：
```
更新 lingcloud-ai-plan-manager 插件
```

或手动执行：
```bash
cd lingcloud-ai-plan-manager
git pull
npm install
npm run build
```

### Q: 插件安装后无法使用？

**A:** 请检查：
1. API Key 是否正确配置
2. 后端服务是否正常运行
3. OpenClaw 是否已重启

### Q: 如何卸载插件？

**A:** 在 OpenClaw 聊天界面中输入：
```
卸载 lingcloud-ai-plan-manager 插件
```

---

## 🌟 Star History

如果这个项目对你有帮助，请给我们一个 ⭐️ Star！

[![Star History Chart](https://api.star-history.com/svg?repos=YOUR_USERNAME/lingcloud-ai-plan-manager&type=Date)](https://star-history.com/#YOUR_USERNAME/lingcloud-ai-plan-manager&Date)

---

<div align="center">

**[⬆ 回到顶部](#-lingcloud-ai-计划管理器)**

Made with ❤️ by Lingyun

</div>
