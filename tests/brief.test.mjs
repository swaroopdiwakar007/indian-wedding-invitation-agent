import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateBrief } from '../skills/wedding-invitation/scripts/validate-brief.mjs';

const good = () => JSON.parse(readFileSync('templates/brief.example.json', 'utf8'));

test('example brief is valid', () => assert.deepEqual(validateBrief(good()), []));

test('missing events fails', () => {
  const b = good(); delete b.events;
  assert.ok(validateBrief(b).length > 0);
});

test('placeholder venue fails', () => {
  const b = good(); b.events[0].venue = 'TBD';
  assert.ok(validateBrief(b).some(e => /placeholder/.test(e)));
});

test('bad date format fails', () => {
  const b = good(); b.events[0].date = '12/02/2027';
  assert.ok(validateBrief(b).some(e => /YYYY-MM-DD/.test(e)));
});

test('unknown tradition fails', () => {
  const b = good(); b.tradition = 'other';
  assert.ok(validateBrief(b).length > 0);
});
