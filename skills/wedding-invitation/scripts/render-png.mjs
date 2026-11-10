#!/usr/bin/env node
// Renders an invitation HTML file to PNG with puppeteer-core and a local Chrome.
import { resolve, dirname, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';

const SIZES = {
  story: [1080, 1920], square: [1080, 1080], portrait: [1080, 1350], a5: [1240, 1748],
};
const args = process.argv.slice(2);
const file = args.find(a => !a.startsWith('--'));
const sizeName = (args[args.indexOf('--size') + 1]) || 'story';
if (!file || !SIZES[sizeName]) {
  console.error(`usage: render-png.mjs <invite.html> [--size ${Object.keys(SIZES).join('|')}] [--full]`);
  process.exit(2);
}

let puppeteer;
try { puppeteer = (await import('puppeteer-core')).default; }
catch { console.error('puppeteer-core is not installed. Run: npm i -g puppeteer-core'); process.exit(3); }

const candidates = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);
const executablePath = candidates.find(existsSync);
if (!executablePath) { console.error('Chrome not found. Set CHROME_PATH.'); process.exit(3); }

const [w, h] = SIZES[sizeName];
const out = resolve(dirname(file), `${basename(file, '.html')}-${sizeName}.png`);
const browser = await puppeteer.launch({ executablePath, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: Math.round(w / 2), height: Math.round(h / 2), deviceScaleFactor: 2 });
  await page.goto(pathToFileURL(resolve(file)).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, fullPage: args.includes('--full') });
  console.log(`✓ ${out} (${w}x${h})`);
} finally { await browser.close(); }
