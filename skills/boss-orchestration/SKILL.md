# Boss 助理多 Agent 编排技能

## 技能概述

Boss 助理可以将系统中的 AI 员工"克隆"为 OpenClaw Agent 实例，向克隆体分派任务，并收取工作汇报。各 Agent 克隆体以其原始员工的完整能力和人格执行任务。

## 可用工具

| 工具 | 类型 | 说明 |
|------|------|------|
| `list_ai_staff` | 只读 | 查看所有可用的 AI 员工 |
| `clone_staff_agent` | 写操作 | 将员工克隆为可调用的 Agent 实例 |
| `list_cloned_agents` | 只读 | 查看所有活跃克隆体 |
| `remove_clone` | 写操作 | 停用克隆体 |
| `dispatch_task_to_agent` | 写操作 | Boss 向克隆体分派任务 |
| `get_task_status` | 只读 | 轮询任务执行状态 |
| `get_boss_reports` | 只读 | 读取工作汇报 |
| `acknowledge_report` | 写操作 | 确认已阅读报告 |

---

## 标准工作流（Boss → 分派 → 汇报）

### 第一步：发现可用员工

```
用户: 帮我找一个可以做内容分析的 AI 员工

AI: 调用 list_ai_staff(keyword="内容")
→ 展示员工列表，包括 agentId、名称、部门、工作风格
```

### 第二步：激活克隆体

```
用户: 用 AI内容分析员工 帮我分析数据

AI: 调用 clone_staff_agent(agentId="content-analyst", purpose="本次数据分析任务")
→ 返回 cloneId
→ 展示确认信息：员工已克隆，cloneId: xxx
```

### 第三步：分派任务

```
用户: 让他分析本周抖音数据，给出增长建议

AI: 调用 dispatch_task_to_agent(
  cloneId="xxx",
  taskDescription="分析本周抖音视频数据，给出内容增长优化建议",
  contextInfo="本周发布视频8个，平均播放量3.2万，最高单视频18万播放"
)
→ 立即返回 taskId
→ 提示用户等待 30-60 秒
```

### 第四步：轮询状态

```
AI: 调用 get_task_status(taskId="yyy")
→ 若 status = "in_progress"：继续等待，再次查询
→ 若 status = "completed"：进入下一步
→ 若 status = "failed"：告知用户错误信息
```

### 第五步：查看汇报

```
AI: 调用 get_boss_reports(status="pending_review")
→ 展示完整工作汇报
→ 包含：员工名称、任务描述、完整执行结果
```

### 第六步：确认并综合

```
AI: 调用 acknowledge_report(reportId="zzz")
→ 将汇报内容综合整理
→ 向用户呈现最终结论
```

---

## 多员工并发任务示例

当需要多个员工协作时，可同时克隆多个员工并并发分派任务：

```
场景: 用户需要同时进行内容分析 + 竞品调研 + 数据报告

步骤:
1. clone_staff_agent("content-analyst") → cloneId_A
2. clone_staff_agent("market-researcher") → cloneId_B
3. clone_staff_agent("data-reporter") → cloneId_C

4. dispatch_task_to_agent(cloneId_A, "分析本周内容表现") → taskId_1
5. dispatch_task_to_agent(cloneId_B, "调研竞品近期动作") → taskId_2
6. dispatch_task_to_agent(cloneId_C, "生成本周数据总结报告") → taskId_3

7. 轮询三个任务直到全部 completed
8. get_boss_reports() → 一次性获取所有汇报
9. 综合三份报告向用户呈现完整分析
```

---

## 重要规则

1. **写操作需确认**：clone、dispatch、acknowledge 均为写操作，执行前需向用户确认意图
2. **克隆体持久化**：克隆体跨会话存在，`list_cloned_agents` 可看到历史克隆体，无需重复克隆
3. **异步执行**：dispatch 立即返回 taskId，任务在后台执行（30-60 秒），必须用 `get_task_status` 轮询
4. **rawMarkdown 安全**：员工系统提示词仅在服务端使用，不会暴露给前端或用户
5. **降级机制**：若员工无 rawMarkdown，系统自动使用 description + vibe 组合作为提示词
6. **错误处理**：dispatch 失败时检查 cloneId 是否有效（用 list_cloned_agents 确认）

---

## 意图识别规则

触发多 Agent 编排工作流的用户意图：

- "让 XX 员工帮我做 YY"
- "请 AI 员工帮我分析/写/研究..."
- "分派任务给..."
- "查看工作汇报"
- "员工完成了吗"
- "克隆 XX 员工"
- "我的 AI 团队现在有哪些人"

---

## 上下文管理

在对话中维护以下状态：

```
active_clones: {
  [agentId]: cloneId  // 避免重复克隆
}

pending_tasks: {
  [taskId]: { cloneId, taskDescription, dispatchedAt }
}

pending_reports: [reportId, ...]  // 待确认报告
```

当用户问"任务完成了吗"时，使用保存的 taskId 查询；当用户问"看看汇报"时，直接调用 get_boss_reports。
