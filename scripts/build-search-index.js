// Build /search-index.json for the header search box: one entry per sitemap
// page, using the page's <title> (brand suffix removed). Idempotent.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const idx = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const subs = [...idx.matchAll(/<loc>https:\/\/funeralcostanalyzer\.com\/([^<]+)<\/loc>/g)].map(m => m[1]);
const urls = [];
for (const s of subs) {
  const xml = fs.readFileSync(path.join(ROOT, s), 'utf8');
  for (const m of xml.matchAll(/<loc>https:\/\/funeralcostanalyzer\.com\/([^<]*)<\/loc>/g)) urls.push(m[1]);
}
const decode = s => s.replace(/&amp;/g, '&').replace(/&rsquo;|&#8217;/g, '\u2019').replace(/&ndash;/g, '\u2013')
  .replace(/&mdash;/g, '\u2014').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ');
const out = [];
for (const u of [...new Set(urls)]) {
  const file = path.join(ROOT, u === '' ? 'index.html' : u);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const t = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1];
  if (!t) continue;
  const entry = { t: decode(t).replace(/\s*[|–—-]\s*Funeral Cost.*$/i, '').trim(), u: '/' + u };
  if (h1) {
    const k = decode(h1.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
    if (k && k !== entry.t) entry.k = k;
  }
  out.push(entry);
}
fs.writeFileSync(path.join(ROOT, 'search-index.json'), JSON.stringify(out) + '\n');
console.log(`search-index.json: ${out.length} pages`);
