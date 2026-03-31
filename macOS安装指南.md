# macOS 用户安装指南

## 🍎 macOS 特殊说明

在 macOS 上安装 OpenClaw 插件可能与 Windows/Linux 略有不同。

---

## ⚠️ 常见问题

### 问题1: "openclaw: command not found"

**原因**: OpenClaw 未加入 PATH 或未正确安装

**解决方案**:

#### 方案A: 使用完整路径
```bash
# 查找 OpenClaw 安装位置
which openclaw

# 或搜索
mdfind -name openclaw

# 使用完整路径执行
/Applications/OpenClaw.app/Contents/MacOS/openclaw plugins install lingyun-openclaw-plan-manager-1.0.0.tgz
```

#### 方案B: 添加到 PATH
```bash
# 编辑 shell 配置文件
nano ~/.zshrc  # macOS Catalina+ 使用 zsh
# 或
nano ~/.bash_profile  # 旧版本 macOS 使用 bash

# 添加以下行:
export PATH="/Applications/OpenClaw.app/Contents/MacOS:$PATH"

# 保存后重新加载
source ~/.zshrc  # 或 source ~/.bash_profile
```

#### 方案C: 通过 OpenClaw 应用安装

如果 OpenClaw 有图形界面:
1. 打开 OpenClaw 应用
2. 进入"插件管理"或"Plugins"
3. 点击"从文件安装"或"Install from file"
4. 选择 `lingyun-openclaw-plan-manager-1.0.0.tgz`
5. 按提示完成安装

---

### 问题2: 权限被拒绝

**错误信息**:
```
Permission denied
EACCES: permission denied
```

**解决方案**:

```bash
# 不要使用 sudo!
# 检查文件权限
ls -la lingyun-openclaw-plan-manager-1.0.0.tgz

# 如果需要,修改权限
chmod +r lingyun-openclaw-plan-manager-1.0.0.tgz

# 重试安装
openclaw plugins install lingyun-openclaw-plan-manager-1.0.0.tgz
```

---

### 问题3: 插件目录不存在

**错误信息**:
```
Cannot find plugin directory
```

**解决方案**:

```bash
# 创建插件目录
mkdir -p ~/.openclaw/plugins

# 重试安装
openclaw plugins install lingyun-openclaw-plan-manager-1.0.0.tgz
```

---

## 📦 完整安装步骤 (macOS)

### 步骤1: 确认 OpenClaw 已安装

```bash
# 检查 OpenClaw 是否安装
ls /Applications/ | grep -i openclaw

# 或
system_profiler SPApplicationsDataType | grep -i openclaw
```

### 步骤2: 准备安装包

```bash
# 如果文件在下载目录
cd ~/Downloads

# 如果文件在桌面
cd ~/Desktop

# 确认文件存在
ls -lh lingyun-openclaw-plan-manager-1.0.0.tgz
```

### 步骤3: 安装插件

#### 方法A: 使用命令行 (推荐)

```bash
# 方式1: 文件在桌面
openclaw plugins install ~/Desktop/lingyun-openclaw-plan-manager-1.0.0.tgz

# 方式2: 文件在下载目录
openclaw plugins install ~/Downloads/lingyun-openclaw-plan-manager-1.0.0.tgz

# 方式3: 先进入文件所在目录,再安装
cd ~/Desktop  # 或 cd ~/Downloads
openclaw plugins install lingyun-openclaw-plan-manager-1.0.0.tgz

# 方式4: 使用 OpenClaw 完整路径 (如果 openclaw 命令找不到)
/Applications/OpenClaw.app/Contents/MacOS/openclaw plugins install ~/Desktop/lingyun-openclaw-plan-manager-1.0.0.tgz
```

#### 方法B: 手动安装

如果命令行方式不工作:

```bash
# 1. 创建插件目录
mkdir -p ~/.openclaw/plugins/@lingyun/openclaw-plan-manager

# 2. 解压安装包到插件目录 (根据文件位置选择)
cd ~/.openclaw/plugins/@lingyun/openclaw-plan-manager

# 如果文件在桌面:
tar -xzf ~/Desktop/lingyun-openclaw-plan-manager-1.0.0.tgz --strip-components=1

# 如果文件在下载目录:
tar -xzf ~/Downloads/lingyun-openclaw-plan-manager-1.0.0.tgz --strip-components=1

# 3. 检查文件
ls -la
# 应该看到: dist/, package.json, README.md, etc.

# 4. 安装依赖
npm install --production
```

### 步骤4: 配置插件

```bash
# 进入插件目录
cd ~/.openclaw/plugins/@lingyun/openclaw-plan-manager

# 复制配置示例
cp .env.example .env

# 编辑配置
nano .env
# 或使用其他编辑器
# open -e .env  # TextEdit
# code .env     # VS Code
```

填入配置:
```env
AI_PLAN_API_BASE=http://your-server:4000/api
AI_PLAN_API_TOKEN=your_token_here
AI_PLAN_TIMEOUT_MS=15000
```

保存文件 (nano: Ctrl+O, Enter, Ctrl+X)

### 步骤5: 重启 OpenClaw Gateway

```bash
# 重启 Gateway
openclaw gateway restart

# 或使用完整路径
/Applications/OpenClaw.app/Contents/MacOS/openclaw gateway restart

# 或通过应用界面重启
```

### 步骤6: 验证安装

```bash
# 检查插件列表
openclaw plugins list

# 应该看到:
# @lingyun/openclaw-plan-manager@1.0.0

# 检查工具列表
openclaw tools list | grep plan

# 应该看到9个工具:
# create_plan_draft
# confirm_plan
# update_plan
# list_plans
# get_plan_detail
# update_task_status
# generate_execution_report
# get_plan_reminders
# get_today_focus
```

### 步骤7: 测试功能

在 OpenClaw 中说:
```
"帮我制定一个学习计划"
```

如果看到计划草稿,说明安装成功! 🎉

---

## 🔍 调试技巧

### 查看日志

```bash
# 查看 Gateway 日志
openclaw gateway logs

# 实时查看日志
openclaw gateway logs --follow

# 或查看日志文件
cat ~/.openclaw/logs/gateway.log
```

### 检查插件目录

```bash
# 查看插件安装位置
ls -la ~/.openclaw/plugins/@lingyun/openclaw-plan-manager/

# 应该看到:
# dist/          (编译后的代码)
# package.json
# .env           (配置文件)
# node_modules/  (依赖)
```

### 检查进程

```bash
# 查看 OpenClaw 进程
ps aux | grep -i openclaw

# 或
pgrep -f openclaw
```

---

## 🛠️ 卸载插件

如果需要重新安装:

```bash
# 方法1: 使用命令
openclaw plugins uninstall @lingyun/openclaw-plan-manager

# 方法2: 手动删除
rm -rf ~/.openclaw/plugins/@lingyun/openclaw-plan-manager

# 重启 Gateway
openclaw gateway restart
```

---

## 🆘 仍然无法安装?

### 最后的方案: 使用 Docker (如果可用)

```bash
# 如果 OpenClaw 支持 Docker
docker run -v ~/Downloads:/data openclaw plugins install /data/lingyun-openclaw-plan-manager-1.0.0.tgz
```

### 或联系支持

提供以下信息:
1. macOS 版本: `sw_vers`
2. OpenClaw 版本: `openclaw --version`
3. 错误日志: `openclaw gateway logs`
4. 文件权限: `ls -la lingyun-openclaw-plan-manager-1.0.0.tgz`

发送到: support@lingyun.ai

---

## 📝 macOS 特定配置

### Homebrew 用户

如果通过 Homebrew 安装的 OpenClaw:

```bash
# OpenClaw 可能在
/usr/local/bin/openclaw

# 或
/opt/homebrew/bin/openclaw  # Apple Silicon

# 插件目录可能在
/usr/local/var/openclaw/plugins/
```

### 使用 nvm 的用户

如果使用 nvm 管理 Node.js:

```bash
# 确保使用正确的 Node 版本
nvm use 22  # 或更高版本

# 然后安装插件
openclaw plugins install lingyun-openclaw-plan-manager-1.0.0.tgz
```

---

## ✅ 快速检查清单

安装前检查:
- [ ] OpenClaw 已安装
- [ ] Node.js >= 22 已安装 (`node -v`)
- [ ] npm 可用 (`npm -v`)
- [ ] 安装包文件存在
- [ ] 有写入权限

安装后检查:
- [ ] 插件出现在列表中
- [ ] 9个工具已注册
- [ ] .env 文件已配置
- [ ] Gateway 已重启
- [ ] 测试创建计划成功

---

## 🎯 成功标志

当您看到:

```bash
$ openclaw plugins list
@lingyun/openclaw-plan-manager@1.0.0 ✅

$ openclaw tools list | grep plan
✅ create_plan_draft
✅ confirm_plan
✅ list_plans
...
```

并且在 OpenClaw 中能成功创建计划,说明安装成功! 🎉

---

祝安装顺利!如有问题,请参考 [用户安装说明.md](用户安装说明.md)
