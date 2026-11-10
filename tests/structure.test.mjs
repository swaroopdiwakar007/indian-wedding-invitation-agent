import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';

const themes = 'skills/wedding-invitation/references/themes';

test('themes are under 8 KB and have required fields', () => {
  for (const f of readdirSync(themes)) {
    const p = `${themes}/${f}`;
    assert.ok(statSync(p).size < 8192, `${f} too large`);
    const t = readFileSync(p, 'utf8');
    for (const k of ['**Fits:**', '**Palette:**', '**Motif family:**', '**Type:**', '**Layout idea:**'])
      assert.ok(t.includes(k), `${f} missing ${k}`);
  }
});

test('SKILL.md has frontmatter with name and description', () => {
  const s = readFileSync('skills/wedding-invitation/SKILL.md', 'utf8');
  assert.match(s, /^---\nname: wedding-invitation\ndescription: .+\n---/);
});
