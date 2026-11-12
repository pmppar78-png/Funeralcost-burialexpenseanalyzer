// Re-apply distinctive state-page H2/H3 wording after other generate-pages
// hooks. Each record is a from→to replacement on a named HTML file; records
// are applied in order so chained edits land on the final wording. Idempotent
// once the destination text is already in the heading.
const fs = require('fs');
const path = require('path');

function escRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function run(outDir) {
  const data = require('../../data/heading-overrides.json');
  let pages = 0;
  let swaps = 0;
  for (const [file, items] of Object.entries(data)) {
    const fp = path.join(outDir, file);
    if (!fs.existsSync(fp) || !Array.isArray(items) || !items.length) continue;
    let html = fs.readFileSync(fp, 'utf8');
    const before = html;
    for (const it of items) {
      if (!it || !it.from || !it.to || it.from === it.to) continue;
      const body = escRe(it.from);
      let next = html;
      if (it.id) {
        const reId = new RegExp(
          '(<h[23]\\b[^>]*\\bid="' + escRe(it.id) + '"[^>]*>)' + body + '(</h[23]>)'
        );
        next = html.replace(reId, (_, open, close) => open + it.to + close);
      }
      if (next === html) {
        const re = new RegExp('(<(h[23])\\b[^>]*>)' + body + '(</h[23]>)');
        next = html.replace(re, (_, open, _tag, close) => open + it.to + close);
      }
      if (next !== html) {
        html = next;
        swaps++;
      }
    }
    if (html !== before) {
      fs.writeFileSync(fp, html);
      pages++;
    }
  }
  console.log(`  Heading overrides: ${swaps} replacement(s) on ${pages} page(s)`);
}

module.exports = { run };
