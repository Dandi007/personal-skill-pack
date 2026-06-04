> **⚠️ Superseded by [katana](https://github.com/Dandi007/katana)** — checkpoint and work-folder now ship as official Claude Code plugins in the katana marketplace; the npx installer approach is retired. This repo is archived.

# personal-skill-pack

个人跨平台 AI Agent Skill Pack，用于把稳定维护的 project-scoped skills 安装到目标 repo 的 `.agents/skills/` 目录。

## 安装到目标 repo

```bash
npx @uther/personal-skill-pack install --target /path/to/repo
```

默认目标目录是当前工作目录：

```bash
npx @uther/personal-skill-pack install
```

如果目标 repo 中已有同名 skill 文件且内容不同，安装器会拒绝覆盖。确认需要替换时再使用：

```bash
npx @uther/personal-skill-pack install --target /path/to/repo --force
```

## 当前包含的 skills

- `skill-manager`
- `work-folder`
- `checkpoint`

## 本地开发

```bash
npm test
npm run install:local
```

## 约束

- 本包只负责复制本包拥有的 skills。
- 不自动 push、不创建远端 repo、不发布 npm package。
- 项目侧 AGENTS 模板见 `templates/AGENTS.md`。

## Minimal verification matrix

| Platform | Command or action | Expected result |
|----------|-------------------|-----------------|
| Filesystem | `find .agents/skills -name SKILL.md -print | sort` | three `SKILL.md` files for `checkpoint`, `skill-manager`, `work-folder` |
| OpenCode | `opencode debug skill` | the three installed skills are listed |
| Codex | copy `templates/AGENTS.md` to target `AGENTS.md`, then start a Codex session in the target repo and ask for a matching workflow | Codex follows the AGENTS.md-aware `.agents/skills/` convention and uses the matching skill |

如果全局 OpenCode config 已加载大量 user-level skills，`opencode debug skill` 输出可能很长，不利于人工确认 project-scoped skills。可用隔离 `HOME` 做 discovery-only 验证：

```bash
target=$(mktemp -d)
node bin/install.js install --target "$target"
(cd "$target" && HOME=$(mktemp -d) opencode debug skill --log-level WARN)
```

输出应包含来自 `$target/.agents/skills/` 的 `checkpoint`、`skill-manager` 和 `work-folder`。

### Codex target 初始化

Codex 依赖目标 repo 内的 `AGENTS.md` 说明 `.agents/skills/` 约定。安装 skills 后，需要显式复制本包模板：

```bash
cp <package-repo>/templates/AGENTS.md <target>/AGENTS.md
```

本地最短验证路径：

```bash
target=$(mktemp -d)
REPO_ROOT=/path/to/personal-skill-pack
node "$REPO_ROOT/bin/install.js" install --target "$target"
cp "$REPO_ROOT/templates/AGENTS.md" "$target/AGENTS.md"
test -f "$target/AGENTS.md"
test -f "$target/.agents/skills/skill-manager/SKILL.md"
test -f "$target/.agents/skills/work-folder/SKILL.md"
test -f "$target/.agents/skills/checkpoint/SKILL.md"
```
