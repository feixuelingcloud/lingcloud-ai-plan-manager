# 📤 发布指南 Publishing Guide

本指南将帮助你将 `lingcloud-ai-plan-manager` 插件发布到 GitHub 和 Claw Hub。

## 📋 目录

1. [准备工作](#准备工作)
2. [发布到 GitHub](#发布到-github)
3. [发布到 Claw Hub](#发布到-claw-hub)
4. [版本管理](#版本管理)
5. [发布检查清单](#发布检查清单)

---

## 准备工作

### 1. 更新版本信息

在发布之前，确保所有版本号一致：

**`package.json`**:
```json
{
  "name": "lingcloud-ai-plan-manager",
  "version": "1.0.0"
}
```

**`claw-hub.json`**:
```json
{
  "name": "lingcloud-ai-plan-manager",
  "version": "1.0.0"
}
```

### 2. 更新文档

- ✅ README.md 完整且最新
- ✅ CHANGELOG.md 包含最新更新
- ✅ INSTALLATION.md 安装说明准确
- ✅ 所有链接指向正确的 GitHub 仓库

### 3. 测试

确保插件在本地完全可用：

```bash
# 运行类型检查
npm run check

# 构建
npm run build

# 在 OpenClaw 中测试所有功能
```

---

## 发布到 GitHub

### 步骤 1: 创建 GitHub 仓库

1. 登录 [GitHub](https://github.com)
2. 点击 **New Repository**
3. 填写信息：
   - **Repository name**: `lingcloud-ai-plan-manager`
   - **Description**: "A powerful OpenClaw plugin for intelligent plan and task management with AI assistance"
   - **Public/Private**: 选择 **Public**
   - **不要**初始化 README（我们已经有了）
4. 点击 **Create repository**

### 步骤 2: 推送代码到 GitHub

```bash
cd openclaw-plan-manager

# 初始化 git 仓库（如果还没有）
git init

# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/lingcloud-ai-plan-manager.git

# 添加所有文件
git add .

# 创建第一次提交
git commit -m "🎉 Initial release v1.0.0

Features:
- Plan management with AI assistance
- Task tracking and status updates
- Execution reports and analytics
- Smart reminders
- Time range filtering (week, last_week, month, all)
- 9 powerful tools for complete workflow"

# 推送到 GitHub
git push -u origin main
```

### 步骤 3: 创建 Release

1. 在 GitHub 仓库页面，点击 **Releases** → **Create a new release**

2. 填写 Release 信息：

**Tag version**: `v1.0.0`

**Release title**: `🎯 LingCloud AI Plan Manager v1.0.0`

**Description**:
```markdown
## 🎉 First Release

**LingCloud AI Plan Manager** is a powerful OpenClaw plugin for intelligent plan and task management.

### ✨ Features

- 📋 **Plan Management** - Create, update, and manage plans with AI
- ✅ **Task Tracking** - Real-time task status and progress tracking
- 📊 **Execution Reports** - Comprehensive reports with insights
- 🎯 **Smart Reminders** - Intelligent reminders for tasks
- 📅 **Time Filtering** - Week, last week, month, or all time
- 🤖 **AI Integration** - Natural language interaction

### 🛠️ Tools (9)

1. `create_plan_draft` - Create plan drafts
2. `confirm_plan` - Confirm and save plans
3. `update_plan` - Modify plan information
4. `list_plans` - List plans with filters
5. `get_plan_detail` - Get plan details
6. `update_task_status` - Update task status
7. `generate_execution_report` - Generate reports
8. `get_plan_reminders` - Get reminders
9. `get_today_focus` - Get today's focus

### 📦 Installation

**Via OpenClaw Chat (Recommended):**
```
Please install lingcloud-ai-plan-manager plugin
```

**Manual Installation:**
```bash
git clone https://github.com/YOUR_USERNAME/lingcloud-ai-plan-manager.git
cd lingcloud-ai-plan-manager
npm install
npm run build
```

See [INSTALLATION.md](INSTALLATION.md) for detailed guide.

### 📖 Documentation

- [README (中文)](README.md)
- [Installation Guide](INSTALLATION.md)
- [Changelog](CHANGELOG.md)

### 🙏 Acknowledgments

Thanks to [OpenClaw](https://openclaw.ai) and all contributors!

---

**Full Changelog**: https://github.com/YOUR_USERNAME/lingcloud-ai-plan-manager/commits/v1.0.0
```

3. 勾选 **Set as the latest release**

4. 点击 **Publish release**

### 步骤 4: 更新 README 中的链接

在 README.md 和其他文档中，将所有 `YOUR_USERNAME` 替换为你的实际 GitHub 用户名。

```bash
# 使用 sed 批量替换（macOS/Linux）
sed -i 's/YOUR_USERNAME/your-actual-username/g' *.md claw-hub.json package.json

# Windows PowerShell
(Get-Content *.md) -replace 'YOUR_USERNAME', 'your-actual-username' | Set-Content *.md
```

提交更新：

```bash
git add .
git commit -m "docs: update GitHub username in all files"
git push
```

---

## 发布到 Claw Hub

### 前提条件

- GitHub 仓库已公开
- 已创建 v1.0.0 Release
- `claw-hub.json` 配置正确

### 步骤 1: 准备 Claw Hub 提交

确保 `claw-hub.json` 中所有信息正确：

```json
{
  "name": "lingcloud-ai-plan-manager",
  "version": "1.0.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_ACTUAL_USERNAME/lingcloud-ai-plan-manager.git"
  }
}
```

### 步骤 2: 提交到 Claw Hub

**方法 A: 通过 OpenClaw CLI**（如果可用）

```bash
openclaw publish claw-hub.json
```

**方法 B: 通过 Claw Hub 网站**

1. 访问 [Claw Hub](https://clawhub.ai)（假设的 URL）
2. 登录你的账户
3. 点击 **Submit Plugin**
4. 填写表单：
   - GitHub Repository URL
   - Plugin Name
   - Version
   - Description
5. 提交审核

### 步骤 3: 等待审核

Claw Hub 团队会审核你的插件。通常需要 1-3 个工作日。

审核通过后，用户就可以通过 Claw Hub 直接安装你的插件了！

---

## 版本管理

### 语义化版本

遵循 [Semantic Versioning](https://semver.org/):

- **主版本号** (Major): 不兼容的 API 变更
- **次版本号** (Minor): 向后兼容的功能新增
- **修订号** (Patch): 向后兼容的 Bug 修复

示例：
- `1.0.0` → 初始发布
- `1.0.1` → Bug 修复
- `1.1.0` → 新功能
- `2.0.0` → 重大变更

### 发布新版本

**步骤 1**: 更新版本号

```bash
npm version patch  # 1.0.0 → 1.0.1
# 或
npm version minor  # 1.0.0 → 1.1.0
# 或
npm version major  # 1.0.0 → 2.0.0
```

**步骤 2**: 更新 CHANGELOG.md

在 `CHANGELOG.md` 中添加新版本的更新内容。

**步骤 3**: 提交并推送

```bash
git add .
git commit -m "chore: bump version to 1.0.1"
git push
```

**步骤 4**: 创建新的 GitHub Release

重复上面"创建 Release"的步骤。

**步骤 5**: 更新 Claw Hub

如果已发布到 Claw Hub，提交更新：

```bash
openclaw publish claw-hub.json --update
```

---

## 发布检查清单

在发布之前，确保完成以下检查：

### 代码质量
- [ ] 所有代码已通过 TypeScript 检查 (`npm run check`)
- [ ] 构建成功 (`npm run build`)
- [ ] 没有 console.log 或调试代码
- [ ] 代码格式统一

### 文档
- [ ] README.md 完整且准确
- [ ] CHANGELOG.md 已更新
- [ ] INSTALLATION.md 安装说明正确
- [ ] 所有 `YOUR_USERNAME` 已替换
- [ ] 所有链接可访问

### 配置文件
- [ ] package.json 版本号正确
- [ ] claw-hub.json 信息完整
- [ ] .gitignore 配置正确
- [ ] LICENSE 文件存在

### 测试
- [ ] 在本地 OpenClaw 中测试所有功能
- [ ] API 连接正常
- [ ] 所有 9 个工具正常工作
- [ ] 错误处理正确

### GitHub
- [ ] 仓库已创建
- [ ] 代码已推送
- [ ] Release 已创建
- [ ] Release 标签正确 (v1.0.0)

### Claw Hub (可选)
- [ ] claw-hub.json 配置完整
- [ ] 已提交到 Claw Hub
- [ ] 等待审核通过

---

## 发布后

### 1. 宣传

在以下平台分享你的插件：

- Twitter/X
- Reddit (r/OpenClaw)
- Discord (OpenClaw 社区)
- 技术博客

### 2. 收集反馈

- 监控 GitHub Issues
- 回复用户问题
- 记录功能请求

### 3. 持续改进

- 根据反馈优化功能
- 修复 Bug
- 添加新功能
- 定期发布更新

---

## 示例发布命令脚本

创建一个 `scripts/release.sh` 脚本自动化发布流程：

```bash
#!/bin/bash

# 发布脚本
# 用法: ./scripts/release.sh <version>

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "请指定版本号，例如: ./scripts/release.sh 1.0.1"
  exit 1
fi

echo "🚀 开始发布 v$VERSION..."

# 1. 运行测试
echo "✅ 运行类型检查..."
npm run check

# 2. 构建
echo "🔨 构建项目..."
npm run build

# 3. 更新版本号
echo "📝 更新版本号..."
npm version $VERSION --no-git-tag-version

# 4. 更新 claw-hub.json
echo "📝 更新 claw-hub.json..."
sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" claw-hub.json

# 5. Git 提交
echo "📤 提交更改..."
git add .
git commit -m "chore: release v$VERSION"
git tag "v$VERSION"
git push origin main
git push origin "v$VERSION"

echo "✅ 发布完成！"
echo "📝 下一步："
echo "1. 在 GitHub 上创建 Release: https://github.com/YOUR_USERNAME/lingcloud-ai-plan-manager/releases/new"
echo "2. 更新 Claw Hub（如果已发布）"
```

使用方法：

```bash
chmod +x scripts/release.sh
./scripts/release.sh 1.0.1
```

---

## 获取帮助

如果在发布过程中遇到问题：

- 查看 [GitHub 文档](https://docs.github.com)
- 查看 [OpenClaw 文档](https://docs.openclaw.ai)
- 提交 [Issue](https://github.com/YOUR_USERNAME/lingcloud-ai-plan-manager/issues)
- 联系 support@openclaw.ai

---

<div align="center">

**祝发布顺利！🎉**

Made with ❤️ by Lingyun

</div>
