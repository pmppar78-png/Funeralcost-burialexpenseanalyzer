#!/usr/bin/env node
// Fails the build if a burial page's meta/og/twitter/JSON-LD description total
// differs from the total computed from its own cost table.
// Table total = funeral service + plot + casket + vault + opening/closing
// (averages) + headstone low/high.
const fs = require('fs');
const path = require('path');
const dir = path.resolve(__dirname, '..');
const n = s => Number(s.replace(/[$,]/g, ''));
const fmt = v => '$' + v.toLocaleString('en-US');
let bad = 0, checked = 0;
for (const f of fs.readdirSync(dir).filter(f => /^burial-costs-.+\.html$/.test(f))) {
  const html = fs.readFileSync(path.join(dir, f), 'utf8');
  const row = label => {
    const m = html.match(new RegExp('<td>' + label + '[^<]*</td>\\s*<td[^>]*>(\\$[\\d,]+)</td>\\s*<td>(\\$[\\d,]+)\\s*[–-]\\s*(\\$[\\d,]+)'));
    return m && { avg: n(m[1]), lo: n(m[2]), hi: n(m[3]) };
  };
  const r = ['Funeral service', 'Cemetery plot', 'Casket', 'Burial vault', 'Opening &amp; closing', 'Headstone'].map(row);
  if (r.some(x => !x)) continue; // no standard cost table (e.g. sourced DC page)
  const core = r.slice(0, 5).reduce((a, x) => a + x.avg, 0);
  const want = `${fmt(core + r[5].lo)}–${fmt(core + r[5].hi)}`;
  checked++;
  const descs = [...html.matchAll(/(?:name="(?:description|twitter:description)"|property="og:description") content="([^"]*)"/g)].map(m => m[1])
    .concat([...html.matchAll(/"@type":"Article"[^}]*?"description":"([^"]*)"/g)].map(m => m[1]));
  for (const d of descs) {
    const m = d.match(/total (\$[\d,]+–\$[\d,]+)/);
    if (m && m[1] !== want) { bad++; console.error(`${f}: description total ${m[1]} != table total ${want}`); }
  }
}
console.log(`check-desc-totals: ${checked} pages checked, ${bad} mismatches`);
if (bad || !checked) process.exit(1);
