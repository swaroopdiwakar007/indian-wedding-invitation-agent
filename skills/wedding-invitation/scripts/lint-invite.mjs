#!/usr/bin/env node
// Static Floor checks for an invitation HTML file or a directory of them.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SCRIPT_LANGS = [
  { re: /[\u0900-\u097F]/, lang: /^(hi|mr|sa|ne)/, name: 'Devanagari' },
  { re: /[\u0A00-\u0A7F]/, lang: /^pa/, name: 'Gurmukhi' },
  { re: /[\u0980-\u09FF]/, lang: /^(bn|as)/, name: 'Bengali' },
  { re: /[\u0B80-\u0BFF]/, lang: /^ta/, name: 'Tamil' },
  { re: /[\u0C00-\u0C7F]/, lang: /^te/, name: 'Telugu' },
  { re: /[\u0C80-\u0CFF]/, lang: /^kn/, name: 'Kannada' },
  { re: /[\u0D00-\u0D7F]/, lang: /^ml/, name: 'Malayalam' },
  { re: /[\u0A80-\u0AFF]/, lang: /^gu/, name: 'Gujarati' },
  { re: /[\u0600-\u06FF]/, lang: /^(ur|ar|fa)/, name: 'Arabic/Urdu' },
];

export function lintHtml(html) {
  const f = [];
  if (!/<html[^>]*\slang=/i.test(html)) f.push('Floor: <html> has no lang attribute');
  if (!/<meta[^>]*name=["']viewport["']/i.test(html)) f.push('Floor: missing viewport meta');
  if (/\[\[[^\]]+\]\]|TODO|lorem ipsum|TBD/i.test(html)) f.push('Floor: placeholder text remains');
  for (const m of html.matchAll(/<(?:img|script|link|source|video|audio|iframe)\b[^>]*\b(?:src|href)=["'](https?:)?\/\/([^"'\/]+)/gi)) {
    const host = m[2];
    if (!/^fonts\.(googleapis|gstatic)\.com$/.test(host)) f.push(`Floor: external resource from ${host}`);
  }
  if (/url\(\s*["']?https?:\/\/(?!fonts\.g)/i.test(html)) f.push('Floor: external url() in CSS');
  const body = html.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>|<[^>]+>/g, ' ');
  for (const s of SCRIPT_LANGS) {
    if (s.re.test(body)) {
      const langs = [...html.matchAll(/\slang=["']([a-zA-Z-]+)["']/g)].map(m => m[1].toLowerCase());
      if (!langs.some(l => s.lang.test(l))) f.push(`Floor: ${s.name} text present but no matching lang attribute`);
    }
  }
  if (!/@media\s*\(\s*prefers-reduced-motion/i.test(html) && /@keyframes|animation\s*:/i.test(html))
    f.push('Floor: animation without a prefers-reduced-motion rule');
  if (!/<!--[\s\S]*?(tradition|theme)[\s\S]*?-->|\/\*[\s\S]*?(tradition|theme)[\s\S]*?\*\//i.test(html))
    f.push('Finish: no decision comment (tradition, theme, palette, fonts)');
  if (Buffer.byteLength(html) > 400 * 1024) f.push('Floor: file exceeds 400 KB');
  const sacred = [/ik\s*onkar|ੴ/i, /\bom\b|ॐ/i, /✝|cross/i, /bismillah|بسم/i];
  const hits = sacred.filter(r => r.test(body)).length;
  if (hits > 1) f.push('Reflex: more than one faith\'s symbol or invocation present; confirm the card is interfaith');
  return f;
}

function* walk(p) {
  if (statSync(p).isDirectory()) for (const n of readdirSync(p)) yield* walk(join(p, n));
  else if (p.endsWith('.html')) yield p;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const target = process.argv[2];
  if (!target) { console.error('usage: lint-invite.mjs <file-or-dir>'); process.exit(2); }
  let failed = 0;
  for (const file of walk(target)) {
    const findings = lintHtml(readFileSync(file, 'utf8'));
    const floor = findings.filter(x => x.startsWith('Floor'));
    console.log(`${floor.length ? '✗' : '✓'} ${file}`);
    findings.forEach(x => console.log(`   ${x}`));
    if (floor.length) failed++;
  }
  process.exit(failed ? 1 : 0);
}
