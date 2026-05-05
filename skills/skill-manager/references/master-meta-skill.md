# Master / Meta Skill Guide

本文件是 `skill-manager` 的 reference，用于设计 repo-first master/meta skill。它不是独立 runtime skill；不要创建 `skills/master-meta-skill/SKILL.md`。

## 使用场景

当用户想为一个本地 repo、monorepo、工具族或复杂工作域创建 expert/master 型 skill 时使用本 guide。典型信号：

- “给这个 repo 做一个 master skill”
- “把这些分散 workflow 收口成一个 meta skill”
- “让 agent 以后优先基于本地源码回答这个领域的问题”
- “设计一个 skill 来管理某类 skill / agent / command 生命周期”

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
