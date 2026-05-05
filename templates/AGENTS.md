# Repository Agent Guide

本 repo 使用 project-scoped personal skill pack。安装后，skills 位于：

```text
.agents/skills/
```

## Skill 使用规则

- 当任务与 `.agents/skills/` 中任一 skill 的描述匹配时，必须优先加载并遵循对应 skill。
- 目标 repo 的本地规范优先于通用 skill；若发生冲突，按用户显式指令与 repo-local `AGENTS.md` 为准。
- 不要把临时探索结果写入 skill，除非用户明确要求沉淀为长期规范。

## 安装与更新

```bash
npx @uther/personal-skill-pack install --target .
```

如需覆盖本地已修改文件：

```bash
npx @uther/personal-skill-pack install --target . --force
```

## 维护边界

- 本模板只提供 skill pack 的接入说明。
- 具体开发、测试、提交、发布规范应写在目标 repo 自己的 `AGENTS.md` 中。
