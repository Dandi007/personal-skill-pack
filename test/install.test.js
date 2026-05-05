// @ts-check
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const installer = path.join(repoRoot, 'bin', 'install.js');
const skillsRoot = path.join(repoRoot, 'skills');
const ownedSkills = ['skill-manager', 'work-folder', 'checkpoint'];

async function makeProject() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'personal-skill-pack-'));
}

function runInstall(target, extraArgs = []) {
  return spawnSync(process.execPath, [installer, 'install', '--target', target, ...extraArgs], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
}

async function listFiles(dir, prefix = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = path.join(prefix, entry.name);
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(fullPath, relativePath));
    else if (entry.isFile()) files.push(relativePath);
  }

  return files.sort();
}

async function assertSkillMatchesSource(target, skill) {
  const source = path.join(skillsRoot, skill);
  const destination = path.join(target, '.agents', 'skills', skill);
  const files = await listFiles(source);

  assert.deepEqual(await listFiles(destination), files);
  for (const file of files) {
    assert.equal(
      await fs.readFile(path.join(destination, file), 'utf8'),
      await fs.readFile(path.join(source, file), 'utf8'),
      `${skill}/${file} should match the packaged source`,
    );
  }
}

test('installs three skills into an empty project', async () => {
  const target = await makeProject();

  const result = runInstall(target);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Installed 3 skills/);
  assert.deepEqual((await fs.readdir(path.join(target, '.agents', 'skills'))).sort(), ownedSkills.sort());
  for (const skill of ownedSkills) await assertSkillMatchesSource(target, skill);
});

test('repeat install leaves unchanged files in place', async () => {
  const target = await makeProject();
  const installedFile = path.join(target, '.agents', 'skills', 'checkpoint', 'SKILL.md');

  assert.equal(runInstall(target).status, 0);
  const before = await fs.stat(installedFile);

  const result = runInstall(target);
  const after = await fs.stat(installedFile);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /unchanged:/);
  assert.equal(after.mtimeMs, before.mtimeMs);
  assert.equal(await fs.readFile(installedFile, 'utf8'), await fs.readFile(path.join(skillsRoot, 'checkpoint', 'SKILL.md'), 'utf8'));
});

test('refuses to overwrite modified target files by default', async () => {
  const target = await makeProject();
  const installedFile = path.join(target, '.agents', 'skills', 'work-folder', 'SKILL.md');

  assert.equal(runInstall(target).status, 0);
  await fs.writeFile(installedFile, 'local edits\n');

  const result = runInstall(target);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Refusing to overwrite modified file/);
  assert.equal(await fs.readFile(installedFile, 'utf8'), 'local edits\n');
});

test('force overwrites modified target files', async () => {
  const target = await makeProject();
  const installedFile = path.join(target, '.agents', 'skills', 'skill-manager', 'SKILL.md');

  assert.equal(runInstall(target).status, 0);
  await fs.writeFile(installedFile, 'local edits\n');

  const result = runInstall(target, ['--force']);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /written:/);
  assert.equal(await fs.readFile(installedFile, 'utf8'), await fs.readFile(path.join(skillsRoot, 'skill-manager', 'SKILL.md'), 'utf8'));
});
