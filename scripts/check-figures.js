#!/usr/bin/env node
'use strict';
/**
 * Fails the build when a computed figure on a state page disagrees with that
 * page's own cost table. Rules:
 *  - every "direct burial ... $X" sentence (FAQ, visible text and JSON-LD)
 *    must quote the "Direct burial" table cell exactly (a range stays a range);
 *  - the derived gaps and tier figures added by state-sentences.js must match
 *    the table rows they were computed from.
 * Usage: node scripts/check-figures.js [root]   (exit 1 on any mismatch)
 */
const fs = require('fs');
const path = require('path');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const { tableFigures } = require(path.join(root, 'scripts/lib/state-data'));
const N = s => +String(s).replace(/[$,]/g, '');
const AMT = '\\$\\d{1,3}(?:,\\d{3})*(?:\\u2013\\$\\d{1,3}(?:,\\d{3})*)?';
let bad = 0, n = 0;
for (const f of fs.readdirSync(root).filter(f => /^(funeral|cremation|burial)-costs-[a-z-]+\.html$/.test(f)).sort()) {
  if (/-by-(state|religion)\.html$/.test(f)) continue;
  const h = fs.readFileSync(path.join(root, f), 'utf8');
  const t = tableFigures(h);
  const chk = (ok, what) => { n++; if (!ok) { bad++; console.log(`MISMATCH ${f}: ${what}`); } };
  const cell = h.match(/<td>(?:<strong>)?Direct burial(?:<\/strong>)?<\/td><td class="cost-value">([^<]+)<\/td>/);
  const dbRe = new RegExp(`[Dd]irect burial(?: \\(no viewing or ceremony\\))? (?:is the next step up at about|comes next at around|runs near|costs about|at about|of about|around) (${AMT})`, 'g');
  for (const m of h.matchAll(dbRe)) chk(cell && m[1] === cell[1].trim(), `"${m[0]}" vs table ${cell ? cell[1] : '(no Direct burial row)'}`);
  for (const m of h.matchAll(/Direct burial is the next step up at about (\$[\d,]+)(?:\u2013\$[\d,]+)?, which is (\$[\d,]+) below/g)) {
    const tf = t['traditional funeral with burial'] || t['traditional funeral'];
    chk(N(m[1]) === t['direct burial'] && tf - N(m[1]) === N(m[2]), m[0]);
  }
  for (const m of h.matchAll(/base ranges from (\$[\d,]+) for direct cremation to (\$[\d,]+)/g))
    chk(N(m[1]) === t['direct cremation'] && N(m[2]) === t['cremation with service'], m[0]);
  for (const m of h.matchAll(/On top of the (\$[\d,]+) [A-Za-z ]+ direct cremation price/g)) chk(N(m[1]) === t['direct cremation'], m[0]);
  for (const m of h.matchAll(/table puts that cost at (\$[\d,]+)|against the (\$[\d,]+) [A-Za-z ]+ estimate above/g)) chk(N(m[1] || m[2]) === t['burial vault / liner'], m[0]);
  for (const m of h.matchAll(/direct cremation starts around (\$[\d,]+) while cremation with a full service averages (\$[\d,]+), a gap of (\$[\d,]+)/g))
    chk(N(m[1]) === t['direct cremation'] && N(m[2]) === t['cremation with service'] && N(m[2]) - N(m[1]) === N(m[3]), m[0]);
  for (const m of h.matchAll(/Traditional cremation at (\$[\d,]+) adds a full funeral home service before the cremation, (\$[\d,]+) more/g))
    chk(N(m[1]) - t['direct cremation'] === N(m[2]), m[0]);
}
console.log(`check-figures: ${n} figures checked, ${bad} mismatches`);
process.exit(bad ? 1 : 0);
