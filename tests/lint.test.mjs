import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { lintHtml } from '../skills/wedding-invitation/scripts/lint-invite.mjs';

test('example card passes the Floor', () => {
  const html = readFileSync('examples/rajasthani-royal.html', 'utf8');
  const floor = lintHtml(html).filter(f => f.startsWith('Floor'));
  assert.deepEqual(floor, []);
});

test('base template fails on placeholders', () => {
  const html = readFileSync('templates/invite-base.html', 'utf8');
  assert.ok(lintHtml(html).some(f => /placeholder/.test(f)));
});

test('remote image is rejected', () => {
  const html = '<html lang="en"><head><meta name="viewport" content="x"></head><body><img src="https://example.com/a.png"></body></html>';
  assert.ok(lintHtml(html).some(f => /external resource/.test(f)));
});

test('Devanagari without lang is rejected', () => {
  const html = '<html lang="en"><head><meta name="viewport" content="x"></head><body><p>नमस्ते</p></body></html>';
  assert.ok(lintHtml(html).some(f => /Devanagari/.test(f)));
});

test('animation without reduced-motion is rejected', () => {
  const html = '<html lang="en"><head><meta name="viewport" content="x"><style>a{animation:x 1s}</style></head><body></body></html>';
  assert.ok(lintHtml(html).some(f => /reduced-motion/.test(f)));
});
