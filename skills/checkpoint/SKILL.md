---
name: checkpoint
description: Use when saving work before context loss or resuming a previous session from a local work folder, especially before clearing context, switching sessions, or continuing work from saved progress.
---

# Checkpoint

Checkpoint 负责在 session 结束前保存关键工作状态，并在新 session 中从 work folder 恢复上下文。它不做设计、不做规划、不替用户决定是否 commit。

**Prerequisite: Work Folder Contract**  
执行前先读取 `skills/work-folder/SKILL.md`，按其中 artifact 语义操作。

## 模式判断

| 信号 | 模式 |
|------|------|
| 用户说保存、存档、checkpoint、准备清上下文 | Save |
| 用户说恢复、继续、resume、接着做 | Resume |
| 用户给 work folder 且当前 session 缺少上下文 | Resume |
| 用户给 work folder 且当前 session 已有工作上下文 | Save |

无法判断时，先问用户要 `save` 还是 `resume`。

## Save 模式

1. **确定 work folder**：优先使用本 session 已经操作过的 work folder；没有则让用户提供路径或允许自动创建。
2. **扫描 artifacts**：读取目录，确认 `spec.md`、`goal.md`、`plan.md`、`progress.md`、`findings.md`、`context.md` 是否存在。
3. **更新 `progress.md`**：记录 Goal、Status、Phase、Completed、Current、Blocked、Next，并追加 changelog。
4. **更新 `findings.md`**：只追加关键决策、可复用经验、遇到的问题和技术发现；没有价值的信息不写。
5. **更新 `context.md`**：覆盖当前环境快照，包括 repo 路径、分支、commit、服务地址、配置或日志路径。
6. **生成 resume guide**：覆盖写入 `CLAUDE.md` 和 `AGENTS.md`，内容包括 Goal、Status、Key Context、Key Decisions、Known Issues、Lessons、Resume Steps。
7. **输出摘要**：列出 work folder、更新文件、恢复方式。

Save 不创建或修改 `spec.md` / `plan.md`，除非用户明确要求当前 workflow 同时承担对应职责。

## Resume 模式

1. **确定 work folder**：用户给路径则使用；否则列出最近候选让用户选择。
2. **加载 artifacts**：按 `CLAUDE.md`/`AGENTS.md` → `progress.md` → `context.md` → `findings.md` → `spec.md` → `plan.md` 的顺序读取。
3. **验证环境**：检查关键路径是否存在、git repo 分支和工作区状态是否与 `context.md` 一致、必要服务是否可达。
4. **分级报告**：
   - ✅ MATCH：环境与存档一致，可以继续。
   - ⚠️ DRIFT：有漂移但不阻塞，报告差异后继续。
   - ❌ BROKEN：关键依赖不可用，标记 blocked，等待用户决策。
5. **更新 `progress.md`**：追加 resume changelog；如有 drift/broken，同步 Blocked section。
6. **进入工作状态**：不要重新问“你想做什么”；从 Current/Next 继续，除非存在 BROKEN。

## 共享约束

- 自给自足：直接用可用文件和 shell 工具读写验证。
- 幂等：Save 多次可以覆盖 snapshot，追加日志不破坏历史。
- 不越权：checkpoint 不改设计事实源和执行计划。
- 不做 git commit：是否 commit 由用户明确决定。
- Resume 必须验证：不允许只读文件就宣称恢复完成。

## `errors.md`

执行前检查 `skills/checkpoint/errors.md`。遇到 checkpoint 流程 bug、恢复漂移误判或 artifact 兼容问题时，追加记录。

# References

- `skills/work-folder/SKILL.md`
