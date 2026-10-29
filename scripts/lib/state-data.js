'use strict';
/**
 * Read-only helpers shared by the state-page post-build steps:
 * - the state rows (name, region, cities, cremation rate, base prices)
 *   parsed from the `states` array in generate-pages.js, and
 * - the dollar figures in a page's own cost tables, so any sentence that
 *   quotes a price uses the number the reader sees in the table.
 */
const fs = require('fs');
const path = require('path');

let ROWS = null;
function stateRows() {
  if (ROWS) return ROWS;
  const src = fs.readFileSync(path.join(__dirname, '..', '..', 'generate-pages.js'), 'utf8');
  const block = src.slice(src.indexOf('const states = ['), src.indexOf('];', src.indexOf('const states = [')));
  ROWS = {};
  for (const m of block.matchAll(/\{name:"([^"]+)",abbr:"(\w\w)",slug:"([^"]+)",region:"([^"]+)",cities:\[([^\]]*)\],cr:"(\d+)%",f:(\d+),c:(\d+),dc:(\d+),b:(\d+)\}/g)) {
    ROWS[m[3]] = { name: m[1], abbr: m[2], slug: m[3], region: m[4], cities: [...m[5].matchAll(/"([^"]+)"/g)].map(x => x[1]), cr: Number(m[6]), f: +m[7], c: +m[8], dc: +m[9], b: +m[10] };
  }
  return ROWS;
}

const money = n => '$' + Math.round(n).toLocaleString('en-US');
const num = s => Number(String(s).replace(/[$,]/g, ''));

/** {lowercased row label: first $ figure in that row} for every table on the page. */
function tableFigures(html) {
  const out = {};
  for (const tr of html.match(/<tr>[\s\S]*?<\/tr>/g) || []) {
    const cells = [...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map(c => c[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim());
    if (cells.length < 2) continue;
    const m = cells[1].match(/\$[\d,]+/);
    const key = cells[0].toLowerCase();
    if (m && !(key in out)) out[key] = num(m[0]);
  }
  return out;
}

module.exports = { stateRows, tableFigures, money, num };
