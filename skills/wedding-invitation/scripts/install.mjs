#!/usr/bin/env node
// Copies the skill into ~/.claude/skills and ~/.agents/skills after validating briefs.
import { cpSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, '..');
const targets = [join(homedir(), '.claude', 'skills', 'wedding-invitation'), join(homedir(), '.agents', 'skills', 'wedding-invitation')];
for (const t of targets) {
  mkdirSync(dirname(t), { recursive: true });
  cpSync(src, t, { recursive: true });
  console.log(`✓ installed to ${t}`);
}
if (!existsSync(join(src, 'SKILL.md'))) { console.error('SKILL.md missing'); process.exit(1); }
