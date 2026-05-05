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
| Codex | start a Codex session in the target repo and ask for a matching workflow | Codex follows the AGENTS.md-aware `.agents/skills/` convention and uses the matching skill |
