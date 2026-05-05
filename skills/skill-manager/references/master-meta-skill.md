# Master / Meta Skill Guide

本文件是 `skill-manager` 的 reference，用于设计 repo-first master/meta skill。它不是独立 runtime skill；不要创建 `skills/master-meta-skill/SKILL.md`。

## 使用场景

当用户想为一个本地 repo、monorepo、工具族或复杂工作域创建 expert/master 型 skill 时使用本 guide。典型信号：

- “给这个 repo 做一个 master skill”
- “把这些分散 workflow 收口成一个 meta skill”
- “让 agent 以后优先基于本地源码回答这个领域的问题”
- “设计一个 skill 来管理某类 skill / agent / command 生命周期”

## Route Table

| 用户意图 / 问题形态 | 优先使用 | 不应使用 | 判定规则 |
|---------------------|----------|----------|----------|
| 需要为一个 repo、monorepo、工具族或 skill 族建立统一入口、事实源优先级、跨子能力路由 | master/meta skill | 单个 domain/workflow/reference skill | 问题核心是“如何组织、路由和约束一组能力” |
| 需要回答某个明确技术领域、库、框架、服务或本地 repo 的具体问题 | domain expert skill | master/meta skill | 已经能落到更具体 domain 时，直接让 domain skill 接管 |
| 需要按固定步骤完成一个过程，例如 debug、发布、checkpoint、迁移、review loop | workflow skill | master/meta skill | 用户要的是“执行流程”，不是建立能力地图 |
| 需要查询 API、命令、配置、术语表、repo map、长 checklist 等资料 | reference | master/meta skill | 内容只提供事实和查表，不承担 runtime 决策 |
| 用户意图同时命中 master 和更具体 skill | 更具体 domain/workflow skill | master/meta skill 抢占执行 | master/meta skill 只可补充 routing 和 shared constraints，不能覆盖具体 skill |

## 概念边界

| 类型 | 职责 | 典型内容 | 禁止事项 |
|------|------|----------|----------|
| Master / meta skill | routing、shared constraints、source priority、validation posture、downgrade strategy | scope、route table、repo map 链接、通用验证姿态 | 不直接替代 domain/workflow skill 完成具体任务 |
| Domain expert skill | 针对明确技术域或 repo 给出事实性回答、源码定位、配置解释 | API 语义、调用链、目录结构、源码证据、领域排障 | 不负责组织其他无关 skill 的生命周期 |
| Workflow skill | 按步骤执行可复用过程 | 阶段、输入输出、检查点、验证命令、rollback 或 blocker 处理 | 不把长事实资料内联成百科，不重写 domain truth |
| Reference skill / reference file | 提供查表型事实、模板、命令、长 checklist | repo map、command cheatsheet、API 表、模板 | 不作为独立 runtime orchestrator，除非本身有明确触发和流程 |

## 让位规则

Master/meta skill 只负责 **routing、shared constraints、validation posture**：

- **Routing**：识别用户意图应交给哪个更具体 skill 或 reference。
- **Shared constraints**：提供跨子能力共享的边界、事实源优先级和安全约束。
- **Validation posture**：规定回答或执行前如何核对本地 repo、版本、证据和降级条件。

Master/meta skill 不覆盖更具体的 domain expert skill 或 workflow skill。若用户意图已经被更具体 skill 明确覆盖，必须让位：

1. 先调用或建议使用更具体 skill。
2. 只在必要时补充 master/meta 层的共享约束和验证姿态。
3. 不复制、更改或弱化具体 skill 的步骤、检查项、输出标准。
4. 如果 master/meta 的路由判断与具体 skill 的触发条件冲突，以更具体 skill 为准。

## 设计原则

1. **Repo first**：本地 repo、官方文档和现有脚本是第一事实源，LLM 记忆只能作为补充。
2. **Boundary first**：先定义负责什么、不负责什么，避免 master skill 吞掉所有问题。
3. **Progressive disclosure**：runtime `SKILL.md` 只放路由和关键约束；repo map、长 checklist、命令表放 `references/`。
4. **Thin wrapper**：平台入口只负责触发，不复制 workflow。
5. **Downgrade strategy**：当本地 repo 不存在、版本不匹配或证据不足时，必须降级为说明限制，而不是编造答案。

## 推荐目录

```text
skills/<domain-master>/
  SKILL.md
  errors.md
  references/
    repo-map.md
    validation-notes.md
    command-cheatsheet.md
```

## `SKILL.md` 最小结构

```markdown
---
name: <domain-master>
description: Use when ...
---

# <Domain> Master

## Scope
- 本 skill 负责 ...
- 本 skill 不负责 ...

## Source Priority
1. 本地 repo
2. 官方文档
3. 现有工作记录 / notes
4. LLM 常识

## Workflow
1. 确认问题类型
2. 定位事实源
3. 读取最小必要文件
4. 交叉验证关键结论
5. 输出结论、证据和不确定性

## References
- `references/repo-map.md`
```

## Repo Map 要点

`references/repo-map.md` 应记录：

- 本地 repo 默认路径和 fallback 路径。
- 关键目录与职责。
- 常见入口文件、配置文件、测试命令。
- 源码阅读优先级。
- 哪些路径不应作为事实源。

## Validation Notes 要点

`references/validation-notes.md` 应记录：

- 如何验证版本、分支和依赖是否匹配。
- 哪些命令是只读安全命令。
- 哪些命令会写入、部署或触发外部副作用。
- 常见误判和已知坑。

## 质量检查

- description 只描述触发条件，不总结完整 workflow。
- runtime 入口不超过必要长度。
- long reference 没有被放进 frontmatter 或入口顶部。
- 所有本地路径都可降级：路径不存在时给出 fallback 或 blocker。
- 输出必须包含证据路径、版本信息或明确的不确定性。

# References

- `skills/skill-manager/SKILL.md`
