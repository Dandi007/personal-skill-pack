---
name: work-folder
description: Use when a workflow needs shared artifact semantics for a local work folder, especially when brainstorming, planning, execution, or checkpoint workflows must exchange spec, plan, progress, findings, and context files safely.
---

# Work Folder Contract

Work folder 是同一件工作的本地 control plane。它让多个 workflow 在同一目录里共享事实、计划、进度和恢复上下文，而不是依赖当前 session 的短期记忆。

## Artifact Inventory

| Artifact | Requiredness | Purpose |
|----------|--------------|---------|
| `spec.md` | 设计完成后应存在 | 技术事实源：目标、范围、约束、架构决策 |
| `goal.md` | 可选 | 交付意图：验收标准、完成边界 |
| `plan.md` | 规划开始后应存在 | 从已批准设计派生的执行计划 |
| `progress.md` | work folder 创建后必须存在 | 当前阶段、已完成、进行中、下一步、阻塞项 |
| `findings.md` | 有关键发现时存在 | 决策、踩坑、技术发现、可复用经验 |
| `context.md` | checkpoint/resume 时必须存在 | 环境快照、关键路径、分支、外部依赖 |
| `CLAUDE.md` / `AGENTS.md` | checkpoint 后应存在 | 新 session 的 resume guide |

## Ownership Matrix

| Artifact | Primary owner | Allowed writes |
|----------|---------------|----------------|
| `spec.md` | brainstorming / design workflow | 批准前可改，批准后视为设计事实源 |
| `goal.md` | brainstorming / design workflow | 批准前可改，批准后视为交付事实源 |
| `plan.md` | planning workflow | 从批准后的设计派生，不重新定义设计 |
| `progress.md` | active workflow | 以当前状态为准，可更新快照和 changelog |
| `findings.md` | active workflow | 追加有复用价值的发现，不写流水账 |
| `context.md` | checkpoint / resume workflow | 覆盖为最新环境快照 |
| `CLAUDE.md` / `AGENTS.md` | checkpoint workflow | 覆盖生成，服务下一次恢复 |

## 更新协议

| Protocol | Meaning | Artifacts |
|----------|---------|-----------|
| create-once then freeze | 批准前由 owner 维护，批准后作为事实源读取 | `spec.md`, `goal.md` |
| create-after-approval | 只能从已批准事实源派生 | `plan.md` |
| overwrite snapshot | 当前状态快照可覆盖 | `context.md`, `CLAUDE.md`, `AGENTS.md` |
| append log | 只追加高价值记录 | `findings.md`, `progress.md` changelog |

## 纪律规则

- consuming workflow 必须先识别 work folder 的绝对路径。
- `spec.md` 和 `goal.md` 不能被 plan 或 checkpoint 偷偷改写。
- `plan.md` 可以细化执行 mechanics，但不能重定义范围、目标或验收标准。
- `progress.md` 必须能回答：现在完成了什么、正在做什么、下一步是什么、是否 blocked。
- `findings.md` 只保存未来 session 需要知道的信息。
- `context.md` 只保存与恢复工作有关的环境和路径，不做无关资产清单。

## Consumer Prerequisite

任何 workflow 只要读写 work folder，就应该先声明：

> **Prerequisite: Work Folder Contract**  
> 操作 work folder 前先读取 `skills/work-folder/SKILL.md`。共享 artifact 语义由该文件定义；当前 workflow 只描述自己的阶段职责。

# References

- `skills/checkpoint/SKILL.md`
