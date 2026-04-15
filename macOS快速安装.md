# macOS 快速安装 (最简单)

## 🍎 如果文件在桌面上

### 第1步: 打开终端
按 `Command + 空格`,输入 `Terminal`,回车

### 第2步: 安装插件
复制粘贴以下命令到终端,回车:

```bash
openclaw plugins install ~/Desktop/lingyun-openclaw-plan-manager-1.0.0.tgz
```

**如果提示 "openclaw: command not found"**,用这个命令:

```bash
/Applications/OpenClaw.app/Contents/MacOS/openclaw plugins install ~/Desktop/lingyun-openclaw-plan-manager-1.0.0.tgz
```

### 第3步: 配置
复制粘贴以下命令:

```bash
cd ~/.openclaw/plugins/@lingyun/openclaw-plan-manager
cp .env.example .env
open -e .env
```

会自动打开配置文件,修改这两行:

```
AI_PLAN_API_BASE=http://服务器地址:4000/api
AI_PLAN_API_TOKEN=你的Token
```

保存文件 (Command+S),关闭。

### 第4步: 重启
复制粘贴以下命令:

```bash
openclaw gateway restart
```

或使用完整路径:

```bash
/Applications/OpenClaw.app/Contents/MacOS/openclaw gateway restart
```

### 第5步: 测试
在 OpenClaw 中说:
```
"帮我制定一个计划"
```

如果看到计划草稿,成功了! 🎉

---

## 📁 如果文件在其他位置

### 文件在下载文件夹:
```bash
openclaw plugins install ~/Downloads/lingyun-openclaw-plan-manager-1.0.0.tgz
```

### 文件在文稿文件夹:
```bash
openclaw plugins install ~/Documents/lingyun-openclaw-plan-manager-1.0.0.tgz
```

### 文件在自定义位置:
用 Finder 找到文件,拖到终端窗口,会自动填入路径:
```bash
openclaw plugins install [拖文件到这里]
```

---

## 🆘 遇到问题?

### 问题1: "openclaw: command not found"
**解决**: 在所有命令前加上:
```
/Applications/OpenClaw.app/Contents/MacOS/
```

例如:
```bash
/Applications/OpenClaw.app/Contents/MacOS/openclaw plugins install ~/Desktop/lingyun-openclaw-plan-manager-1.0.0.tgz
```

### 问题2: "No such file or directory"
**解决**: 检查文件名是否正确,确认文件真的在桌面上:
```bash
ls ~/Desktop/*.tgz
```

### 问题3: 配置文件打不开
**解决**: 手动编辑:
```bash
nano ~/.openclaw/plugins/@lingyun/openclaw-plan-manager/.env
```

修改后:
- 保存: `Ctrl+O`, 回车
- 退出: `Ctrl+X`

---

## 📞 需要详细说明?

查看完整文档: [macOS安装指南.md](macOS安装指南.md)

---

## ✅ 一键安装 (适合高级用户)

如果您熟悉终端,可以一次性执行:

```bash
# 安装 (文件在桌面)
openclaw plugins install ~/Desktop/lingyun-openclaw-plan-manager-1.0.0.tgz

# 配置
cd ~/.openclaw/plugins/@lingyun/openclaw-plan-manager
cp .env.example .env
echo "请编辑 .env 文件填入配置"
open -e .env

# 等待编辑完成后,按回车继续
read -p "配置完成后按回车..."

# 重启
openclaw gateway restart

# 验证
openclaw plugins list | grep openclaw-plan-manager
```

---

祝安装顺利! 🎉
