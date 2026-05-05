#!/usr/bin/env node
'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(PACKAGE_ROOT, 'skills');
const OWNED_SKILLS = ['skill-manager', 'work-folder', 'checkpoint'];
function parseArgs(argv) {
  const args = argv.slice(2);
  const options = { command: args[0], target: process.cwd(), force: false, help: args[0] === '--help' || args[0] === '-h' };
  for (let i = 1; i < args.length; i += 1) {
    if (args[i] === '--force') options.force = true;
    else if (args[i] === '--help' || args[i] === '-h') options.help = true;
    else if (args[i] === '--target') { if (!args[i + 1]) throw new Error('--target requires a path'); options.target = path.resolve(args[i + 1]); i += 1; }
    else throw new Error(`Unknown argument: ${args[i]}`);
  }
  return options;
}
function printHelp() { console.log('Usage: npx @uther/personal-skill-pack install [--target <repo>] [--force]\nDefault target is current working directory. Skills are copied to <target>/.agents/skills/.'); }
async function exists(p) { try { await fs.access(p); return true; } catch { return false; } }
async function copyFileSafely(src, dst, options) {
  const next = await fs.readFile(src);
  if (await exists(dst)) {
    const current = await fs.readFile(dst);
    if (Buffer.compare(next, current) === 0) return 'unchanged';
    if (!options.force) throw new Error(`Refusing to overwrite modified file: ${dst}. Re-run with --force to replace it.`);
  }
  await fs.mkdir(path.dirname(dst), { recursive: true });
  await fs.writeFile(dst, next);
  return 'written';
}
async function copyDir(srcDir, dstDir, options, results) {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const src = path.join(srcDir, entry.name);
    const dst = path.join(dstDir, entry.name);
    if (entry.isDirectory()) await copyDir(src, dst, options, results);
    else if (entry.isFile()) results.push({ status: await copyFileSafely(src, dst, options), file: dst });
  }
}
async function install(options) {
  const targetSkills = path.join(options.target, '.agents', 'skills');
  const results = [];
  for (const skill of OWNED_SKILLS) await copyDir(path.join(SKILLS_DIR, skill), path.join(targetSkills, skill), options, results);
  console.log(`Installed ${OWNED_SKILLS.length} skills into ${targetSkills}`);
  for (const r of results) console.log(`${r.status}: ${r.file}`);
}
async function main() { const options = parseArgs(process.argv); if (options.help || options.command !== 'install') { printHelp(); if (!options.help) process.exitCode = 1; return; } await install(options); }
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
