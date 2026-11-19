#!/usr/bin/env node
'use strict';
/**
 * Fails when any <script type="application/ld+json"> block does not parse.
 *
 * This exists because a title-update regex once used a replacement of the
 * form `\1` + title. A title beginning with 2026 produced the replacement
 * `\12026...`, which Python's re.sub treated as octal `\120` ("P") plus
 * "26...", leaving a corrupt Article line:
 *   P26 National Funeral Cost Index (PDF): 50-State Figures to Download",
 * Never splice a title into a replacement string after a backreference.
 * Parse the JSON-LD and set the field, or use a replacement function.
 *
 * Usage: node scripts/check-json-ld.js [root]   (exit 1 on any parse error)
 */
const fs = require('fs');
const path = require('path');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));

const SCRIPT = /<script type="application\/ld\+json">\s*([\s\S]*?)<\/script>/gi;
let blocks = 0;
let bad = 0;
const files = fs.readdirSync(root).filter((f) => f.endsWith('.html')).sort();
for (const f of files) {
  const html = fs.readFileSync(path.join(root, f), 'utf8');
  let m;
  SCRIPT.lastIndex = 0;
  const re = new RegExp(SCRIPT.source, 'gi');
  let i = 0;
  while ((m = re.exec(html))) {
    blocks++;
    i++;
    try {
      JSON.parse(m[1]);
    } catch (err) {
      bad++;
      const preview = m[1].replace(/\s+/g, ' ').trim().slice(0, 160);
      console.log(`INVALID JSON-LD ${f} block ${i}: ${err.message}`);
      console.log(`  ${preview}`);
    }
  }
}
console.log(`check-json-ld: ${blocks} blocks checked, ${bad} invalid`);
process.exit(bad ? 1 : 0);
