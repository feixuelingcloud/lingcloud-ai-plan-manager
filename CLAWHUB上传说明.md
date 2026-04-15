# ClawHub 上传说明

## 准备好的文件

上传到 ClawHub 的文件:
```
release/lingcloud-ai-plan-manager-1.0.0-clawhub.zip
```

## 文件验证通过

### ✅ 必需文件检查
- [x] package.json (包含正确的 author 和 publisher 字段)
- [x] openclaw.plugin.json
- [x] claw-hub.json
- [x] dist/index.js
- [x] package-lock.json

### ✅ package.json 关键字段
```json
{
  "name": "lingcloud-ai-plan-manager",
  "version": "1.0.0",
  "author": {
    "name": "Lingyun",
    "email": "yemihu@lingcloud.ai"
  },
  "publisher": "feixuelingcloud",
  "openclaw": {
    "extensions": ["./dist/index.js"],
    "compat": {
      "pluginApi": "1.0.0"
    },
    "build": {
      "openclawVersion": "1.0.0"
    }
  }
}
```

## 上传步骤

1. **清除浏览器缓存** (重要!)
   - 在 ClawHub 页面按 Ctrl+Shift+Delete
   - 清除缓存的图像和文件

2. **上传新文件**
   - 打开 https://clawhub.ai (或您的 ClawHub 地址)
   - 点击 "Publish" 或 "上传插件"
   - **重要**: 选择 `release/lingcloud-ai-plan-manager-1.0.0-clawhub.zip` 文件
   - **不要**上传 `lingcloud-ai-plan-manager-1.0.0.tgz` 文件

3. **填写元数据**
   - Plugin ID: `lingcloud-ai-plan-manager`
   - Display Name: `AI Plan Manager`
   - Version: `1.0.0`
   - Publisher: `feixuelingcloud`

## 问题排查

如果仍然显示 "package.json is required for code plugins":

### 可能原因 1: 上传了错误的文件
- 确认上传的是 `.zip` 文件,不是 `.tgz` 文件
- 正确文件: `lingcloud-ai-plan-manager-1.0.0-clawhub.zip`
- 错误文件: `lingcloud-ai-plan-manager-1.0.0.tgz`

### 可能原因 2: 浏览器缓存
- 完全关闭浏览器
- 重新打开并尝试上传
- 或者使用无痕模式/隐私浏览模式

### 可能原因 3: ClawHub 平台要求
ClawHub 可能有额外要求。检查是否需要:
- 特定的 package.json 字段
- 特定的文件编码(UTF-8)
- 特定的 ZIP 压缩格式

### 验证 ZIP 文件内容
您可以手动解压 ZIP 文件验证:
```bash
unzip -l release/lingcloud-ai-plan-manager-1.0.0-clawhub.zip
```

应该看到:
```
package.json
openclaw.plugin.json
claw-hub.json
dist/index.js
dist/src/...
```

## 联系支持

如果问题持续存在,请:
1. 截图完整的错误信息
2. 联系 ClawHub 支持团队
3. 提供文件 SHA256:
   ```bash
   sha256sum release/lingcloud-ai-plan-manager-1.0.0-clawhub.zip
   ```

## 修改日志

- 2026-04-01 02:30: 添加必需的 openclaw.compat.pluginApi 和 openclaw.build.openclawVersion 字段
- 2026-04-01 02:12: 修复 package.json author 字段格式
- 2026-04-01 02:12: 添加 publisher 字段
- 2026-04-01 02:12: 创建正确的 ClawHub ZIP 格式

## 最新文件信息

文件: `release/lingcloud-ai-plan-manager-1.0.0-clawhub.zip`
更新时间: 2026-04-01 02:30
包含修复:
- ✅ openclaw.compat.pluginApi = "1.0.0"
- ✅ openclaw.build.openclawVersion = "1.0.0"
- ✅ author 对象格式
- ✅ publisher 字段
