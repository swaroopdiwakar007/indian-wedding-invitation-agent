#!/usr/bin/env node
// Validates a brief.json without dependencies. Exit 1 on any problem.
import { readFileSync } from 'node:fs';

const REQUIRED = ['tradition', 'couple', 'events', 'languages', 'output'];
const TRADITIONS = ['hindu', 'sikh', 'muslim', 'christian', 'jain', 'parsi', 'buddhist', 'interfaith', 'secular'];
const SIZES = ['story', 'square', 'portrait', 'a5'];

export function validateBrief(b) {
  const errors = [];
  for (const k of REQUIRED) if (!(k in b)) errors.push(`missing "${k}"`);
  if (b.tradition && !TRADITIONS.includes(String(b.tradition).toLowerCase()))
    errors.push(`tradition must be one of ${TRADITIONS.join(', ')}`);
  if (b.couple) {
    if (!Array.isArray(b.couple) || b.couple.length !== 2) errors.push('couple must be an array of two names');
    else b.couple.forEach((c, i) => { if (!c || !c.name) errors.push(`couple[${i}].name is required`); });
  }
  if (b.events) {
    if (!Array.isArray(b.events) || b.events.length === 0) errors.push('events must be a non-empty array');
    else b.events.forEach((e, i) => {
      for (const f of ['name', 'date', 'time', 'venue'])
        if (!e[f]) errors.push(`events[${i}].${f} is required`);
      if (e.date && !/^\d{4}-\d{2}-\d{2}$/.test(e.date)) errors.push(`events[${i}].date must be YYYY-MM-DD`);
      for (const f of ['name', 'date', 'time', 'venue'])
        if (typeof e[f] === 'string' && /\[\[|TODO|TBD|lorem/i.test(e[f])) errors.push(`events[${i}].${f} is still a placeholder`);
    });
  }
  if (b.languages && (!Array.isArray(b.languages) || b.languages.length === 0)) errors.push('languages must be a non-empty array');
  if (b.output) {
    if (!Array.isArray(b.output.formats) || !b.output.formats.every(f => ['html', 'png'].includes(f)))
      errors.push('output.formats must be an array of "html" and/or "png"');
    if (b.output.size && !SIZES.includes(b.output.size)) errors.push(`output.size must be one of ${SIZES.join(', ')}`);
  }
  return errors;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2];
  if (!file) { console.error('usage: validate-brief.mjs <brief.json>'); process.exit(2); }
  let data;
  try { data = JSON.parse(readFileSync(file, 'utf8')); }
  catch (e) { console.error(`cannot read ${file}: ${e.message}`); process.exit(2); }
  const errors = validateBrief(data);
  if (errors.length) { console.error(errors.map(e => `✗ ${e}`).join('\n')); process.exit(1); }
  console.log('✓ brief is valid');
}
