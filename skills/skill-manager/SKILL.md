---
name: skill-manager
description: Use when managing a repository-local skill lifecycle, including discovering existing skills, creating or editing shared skills, migrating thin wrappers, evaluating skill quality, or designing repo-first master/meta skills.
---

# Skill Manager

这个 skill 是 portable skill pack 中管理 skill 生命周期的主入口。它负责把 skill 的发现、创建、迁移、编辑、评测和 master/meta skill 设计收口到一个统一流程。

## 能力边界

本 skill 负责：

- 盘点当前仓库中的 `skills/<name>/SKILL.md`、`references/`、`errors.md` 等资源。
- 判断需求应复用现有 skill、修改现有 skill，还是新建 skill。
- 创建、编辑、瘦身、合并 portable skill。
- 将平台专有 wrapper 收口为 shared truth + thin wrapper。
- 设计 repo-first master/meta skill，并把长参考放入 `references/`。

本 skill 不负责：

- 具体领域 expert skill 的技术问答。
- 发布 package、创建远程仓库、执行 marketplace 分发。
- 替代 consuming skill 的业务流程。

## 仓库约定

- shared truth 放在 `skills/<skill-name>/SKILL.md`。
- skill 名使用小写字母、数字和连字符。
- `SKILL.md` frontmatter 至少包含 `name` 和 `description`。
- `description` 描述触发条件，不复述完整 workflow。
- 正文中文为主，专业术语保留 English。
- 复杂背景、长 checklist、模板或 repo map 放入 `references/`，不要塞进 runtime 入口。
- 每个 skill 补 `errors.md`，用于记录 bug、回归和踩坑。

## 意图路由

| 模式 | 触发意图 | 核心动作 |
|------|----------|----------|
| `discover` | 查有没有现成 skill、比较重叠能力 | 先本地盘点，再给复用/修改/新建判断 |
| `create` | 新建 skill 或补骨架 | 建 `SKILL.md`、`errors.md`，按需补资源目录 |
| `edit` | 修改、瘦身、合并已有 skill | 先确认依赖与引用，再最小改动 shared truth |
| `migrate` | 从单平台入口迁移到 portable skill | 保留语义，剥离平台专有配置 |
| `forge-master` | 设计 repo-first master/meta skill | 明确边界、事实源、降级策略和验证方式 |
| `evaluate` | 优化 description、做 eval 或 benchmark | 准备真实 prompt，再做质量迭代 |

多类目标同时出现时，按 `discover → edit/migrate → create → forge-master → evaluate` 的顺序执行。

## 统一流程

1. 盘点相关 skill、wrapper、references 和 `errors.md`。
2. 判断改动属于 shared truth 变更、platform wrapper 调整，还是 reference 补充。
3. 明确哪些语义必须保留，哪些只是历史入口或重复说明。
4. 做最小必要改动，避免把平台专有字段写进 portable skill 正文。
5. 运行聚焦验证：文件存在、frontmatter 合法、引用路径可读、git diff 符合预期。
6. 如发现踩坑，追加到对应 `errors.md`。

## Master/Meta Skill 指南

当用户要设计 repo-first expert/master 型 skill 时，先读取 `skills/skill-manager/references/master-meta-skill.md`。

该文件只是 skill-manager 的 reference，不是独立 runtime skill；不要把它放到 `skills/master-meta-skill/SKILL.md`。

## 输出要求

完成后说明：

- shared truth 修改位置。
- 新增、保留或删除了哪些入口。
- 是否存在重复副本或漂移风险。
- 验证命令和结果。
- 未解决的风险或 blocker。

# References

- `skills/skill-manager/references/master-meta-skill.md`
