'use strict';
/**
 * Swaps sentences that repeat across state cremation pages for
 * state-specific, sourced facts from data/cremation-local.json.
 * Each entry names the opening words of one <li>, <p> or <div> on the
 * page; the element's contents are replaced. The build fails if an entry
 * matches zero or several elements, so stale entries cannot go unnoticed.
 * Runs before post-fix, which rebuilds FAQ JSON-LD from the visible text.
 */
const fs = require('fs');
const path = require('path');

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const longDate = (d) => { const [y, m, day] = d.split('-').map(Number); return `${MONTHS[m - 1]} ${day}, ${y}`; };

// Moves a page's modified dates (meta, JSON-LD, visible "Updated") forward to
// the date in "_lastmod", so the sitemap lastmod reflects the content change.
function bumpDates(html, d) {
  const later = (old) => (old < d ? d : old);
  return html
    .replace(/(<meta name="last-modified" content=")(\d{4}-\d{2}-\d{2})/, (m, a, o) => a + later(o))
    .replace(/("dateModified":")(\d{4}-\d{2}-\d{2})/g, (m, a, o) => a + later(o))
    .replace(/<time datetime="(\d{4}-\d{2}-\d{2})">[^<]*<\/time>/, (m, o) => (o < d ? `<time datetime="${d}">${longDate(d)}</time>` : m));
}

const norm = (s) => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/\s+/g, ' ').trim();

// dataFile defaults to the cremation entries; data/state-local.json uses the
// same format for sourced facts on funeral, cremation and burial pages.
function run(outDir, dataFile = 'cremation-local.json') {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', dataFile), 'utf8'));
  for (const [slug, entries] of Object.entries(data)) {
    if (slug.startsWith('_')) continue;
    const file = path.join(outDir, slug.endsWith('.html') ? slug : `cremation-costs-${slug}.html`);
    let html = fs.readFileSync(file, 'utf8');
    for (const [find, replacement] of entries) {
      if (norm(html).includes(norm(replacement))) continue; // already applied
      const re = /<(li|p|div)(\s[^>]*)?>((?:(?!<\/?(?:li|p|div|ul|ol)\b)[\s\S])*?)<\/\1>/g;
      const hits = [];
      let m;
      while ((m = re.exec(html))) {
        const t = norm(m[3]);
        if (t.startsWith(find) || t.replace(/^(?:A|An) /, '') .startsWith(find.replace(/^(?:A|An) /, ''))) hits.push(m);
      }
      if (hits.length !== 1) throw new Error(`cremation-local: "${find}" matched ${hits.length} elements in ${path.basename(file)}`);
      const h = hits[0];
      if (/<a\s/i.test(h[3]) && !/<a\s/i.test(replacement)) throw new Error(`cremation-local: "${find}" would drop a link in ${path.basename(file)}`);
      const open = `<${h[1]}${h[2] || ''}>`;
      html = html.slice(0, h.index) + open + replacement + `</${h[1]}>` + html.slice(h.index + h[0].length);
    }
    if (data._lastmod) html = bumpDates(html, data._lastmod);
    fs.writeFileSync(file, html);
  }
}

module.exports = { run };
