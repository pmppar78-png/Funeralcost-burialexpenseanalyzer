// Re-audit pass (2026-10-29). Runs after the bylines step on every page on
// disk and is idempotent, so a second build produces identical output.
//  1. "Reviewed" date beside each byline (Paul Paradis, the page's own
//     last-modified date).
//  2. State pages: per-family heading wording and section order picked from a
//     hash of the state, so neighbouring pages do not share one skeleton. Only
//     whole sections move; no text is removed.
//  3. Charts: an SVG bar chart drawn from the page's own cost table (or the
//     state cards on hub pages), written to /charts/ and shown with alt text.
const fs = require('fs');
const path = require('path');

const SKIP = new Set(['404.html', 'about.html', 'affiliate-disclosure.html', 'author-paul-paradis.html', 'chat.html',
  'contact.html', 'disclaimer.html', 'editorial-standards.html', 'index.html', 'privacy-policy.html',
  'sitemap-index.html', 'terms-of-service.html', 'funeral-cost-widget.html']);

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}
const fmt = (iso) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&rsquo;/g, '\u2019').replace(/&ndash;/g, '\u2013').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

// ── 1. Reviewed dates ────────────────────────────────────────────────
function addReviewed(html) {
  const m = html.match(/<meta name="last-modified" content="(\d{4}-\d{2}-\d{2})"/);
  if (!m) return html;
  const time = `<time datetime="${m[1]}">${fmt(m[1])}</time>`;
  if (/class="article-meta"/.test(html)) {
    if (/article-meta-label">(?:Reviewed|Last reviewed):/.test(html)) {
      return html.replace(/(<span class="article-meta-label">Last reviewed:<\/span> <span class="article-meta-value">)<time[^>]*>[^<]*<\/time>/, `$1${time}`);
    }
    return html.replace(/(<span class="article-meta-item"><span class="article-meta-label">Last updated:<\/span>[\s\S]*?<\/span><\/span>)/,
      `$1\n        <span class="article-meta-item"><span class="article-meta-label">Last reviewed:</span> <span class="article-meta-value">${time}</span></span>`);
  }
  if (/<p class="article-byline[^>]*>/.test(html)) {
    if (/<p class="article-byline[^>]*>[^\n]*Reviewed/.test(html)) {
      return html.replace(/(<p class="article-byline[^>]*>[^\n]*Reviewed by Paul Paradis on )<time[^>]*>[^<]*<\/time>/, `$1${time}`);
    }
    return html.replace(/(<p class="article-byline[^>]*>[^\n]*?)<\/p>/, `$1 &middot; Reviewed by Paul Paradis on ${time}</p>`);
  }
  return html;
}

// ── 2. State-page headings and section order ──────────────────────────
// {S} = state name, {R} = region. The first entry is the original wording.
const HEADINGS = {
  funeral: [
    ['Funeral Cost Breakdown in {S}', 'What a Funeral Costs in {S}, Item by Item', '{S} Funeral Prices by Item'],
    ['What Drives Funeral Costs in {S}', 'Why Funeral Prices Vary in {S}', 'What Pushes a {S} Funeral Bill Up or Down'],
    ['Hidden Funeral Fees in {S}: What to Watch For', 'Fees {S} Families Often Miss', 'Charges to Question on a {S} Price List'],
    ['Cheapest Funeral Options in {S} (2026)', 'Lower-Cost Funeral Choices in {S}', 'The Least Expensive Ways to Hold a Funeral in {S}'],
    ['Major Cities in {S}', '{S} Funeral Costs by City', 'Funeral Prices Across {S} Cities'],
    ['Cremation vs. Burial in {S}', 'Choosing Between Cremation and Burial in {S}', '{S} Cremation and Burial Compared'],
    ['Detailed {S} Cost Guides', 'More {S} Cost Guides', 'Other {S} Guides on This Site'],
    ['Your Consumer Rights in {S}', 'What the Law Guarantees You in {S}', 'Rights Every Funeral Buyer Has in {S}'],
    ["What's Specific to {S} ({R})", 'What Sets {S} Apart ({R})', 'How {S} Differs From Its {R} Neighbors'],
    ['Payment Assistance in {S}', 'Help Paying for a Funeral in {S}', 'Where {S} Families Can Find Money for a Funeral'],
    ['What to Do When Planning a Funeral in {S}', 'Steps for Planning a Funeral in {S}', 'Planning a Funeral in {S}: Where to Start'],
  ],
  cremation: [
    ['Types of Cremation in {S}', 'Cremation Choices Offered in {S}', 'The Main Kinds of Cremation in {S}'],
    ['Cremation Cost Breakdown', '{S} Cremation Prices by Item', 'What Each Part of a {S} Cremation Costs'],
    ['What to Know Before Choosing Cremation in {S}', 'Before You Sign for Cremation in {S}', 'Checks to Make Before a Cremation in {S}'],
    ['How to Save on Cremation in {S}', 'Ways to Spend Less on Cremation in {S}', 'Keeping a Cremation in {S} Affordable'],
    ['Regional Context for Cremation in {S}', 'How {S} Cremation Compares With the Region', 'Cremation Trends Around {S}'],
  ],
  burial: [
    ['Complete Burial Cost Breakdown', '{S} Burial Costs by Item', 'What Each Part of a {S} Burial Costs'],
    ['Burial Options in {S}', 'Kinds of Burial Available in {S}', 'Choosing a Type of Burial in {S}'],
    ['How to Reduce Burial Costs in {S}', 'Ways to Lower a Burial Bill in {S}', 'Spending Less on Burial in {S}'],
    ['Regional Context for Burial in {S}', 'How {S} Burial Compares With the Region', 'Burial Practices Around {S}'],
  ],
};
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function headingRegex(tpl, S) {
  return new RegExp('^' + reEsc(tpl.replace(/'/g, '\u0001')).replace('\\{S\\}', reEsc(S)).replace('\\{R\\}', '([^)]+?)').replace(/\u0001/g, "(?:'|&#39;|&rsquo;)") + '$');
}

function stateName(html) {
  const m = html.match(/<h1>[^<]*? in (.+?)(?: \(2026\)|: What Families Pay in 2026)<\/h1>/);
  return m ? m[1].replace(/&amp;/g, '&') : null;
}

function varyState(html, family, slug) {
  const S = slug === 'washington-dc' ? stateName(html) : slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
  if (!S) return html;
  const sets = HEADINGS[family];
  const salt = family + '|' + slug;
  // Headings.
  html = html.replace(/(\n      <h2(?: id="[^"]*")?>)([^<]+)(<\/h2>)/g, (all, open, text, close) => {
    for (let k = 0; k < sets.length; k++) {
      for (const tpl of sets[k]) {
        const m = text.match(headingRegex(tpl, S));
        if (!m) continue;
        const pick = sets[k][hashStr(salt + '|h' + k) % sets[k].length];
        return open + pick.replace('{S}', S).replace('{R}', m[1] || '') + close;
      }
    }
    return all;
  });
  // Section order: whole h2 sections after the one holding the cost table.
  const art = html.indexOf('<article');
  const endRe = family === 'funeral' ? /\n<h2 id="state-oversight">/g : /\n      <h2[^>]*>Frequently Asked Questions/g;
  endRe.lastIndex = art;
  const em = endRe.exec(html);
  const end = em ? em.index : -1;
  if (art < 0 || end < 0) return html;
  const starts = [];
  const re = /\n      <h2[ >]/g;
  re.lastIndex = art;
  let mm;
  while ((mm = re.exec(html)) && mm.index < end) starts.push(mm.index);
  const tableAt = html.indexOf('<table', art);
  let pin = starts.findIndex((s, i) => tableAt > s && (i + 1 === starts.length || tableAt < starts[i + 1]));
  if (pin < 0) return html;
  const movable = starts.slice(pin + 1);
  if (movable.length < 3) return html;
  const secs = movable.map((s, i) => html.slice(s, i + 1 < movable.length ? movable[i + 1] : end).replace(/\s+$/, ''));
  // Stable key per section: its position in the HEADINGS family (or text).
  const keyOf = (sec) => {
    const t = (sec.match(/<h2[^>]*>([^<]+)<\/h2>/) || [])[1] || sec.slice(0, 80);
    const id = (sec.match(/<h2 id="([^"]+)"/) || [])[1];
    if (id) return id;
    for (let k = 0; k < sets.length; k++) for (const tpl of sets[k]) if (headingRegex(tpl, S).test(t)) return 'k' + k;
    return t;
  };
  const keyed = secs.map((sec) => ({ sec, key: keyOf(sec) }));
  keyed.sort((a, b) => (hashStr(salt + '|o|' + a.key) - hashStr(salt + '|o|' + b.key)) || (a.key < b.key ? -1 : 1));
  // Keep "what to do" style closing steps last when present.
  const last = keyed.findIndex((x) => x.key === 'what-to-do');
  if (last >= 0) keyed.push(keyed.splice(last, 1)[0]);
  const body = keyed.map((x) => x.sec).join('\n');
  return html.slice(0, movable[0]) + body + '\n' + html.slice(end);
}

// ── 3. Charts ───────────────────────────────────────────────────────
const money = (s) => { const m = s.match(/^\s*(?:From\s+)?\$([\d,]+)\s*$/); return m ? Number(m[1].replace(/,/g, '')) : null; };
function tableData(html) {
  const re = /<table\b[\s\S]*?<\/table>/g;
  let t;
  while ((t = re.exec(html))) {
    const cap = (t[0].match(/<caption>([\s\S]*?)<\/caption>/) || [])[1];
    const head = [...(t[0].match(/<thead>[\s\S]*?<\/thead>/) || [''])[0].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((x) => strip(x[1]));
    const rows = [...t[0].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((r) => [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((c, i) => strip(i === 0 ? c[1].replace(/<span class="avg-reference">[\s\S]*?<\/span>/g, '') : c[1]))).filter((r) => r.length >= 2);
    let best = null;
    for (let col = 1; col < (rows[0] || []).length; col++) {
      const single = rows.map((r) => ({ label: r[0], v: money(r[col] || '') })).filter((p) => p.v !== null && p.label);
      const range = rows.map((r) => { const m = (r[col] || '').match(/^\$([\d,]+)\s*[\u2013-]\s*\$([\d,]+)(\+?)$/); return m && r[0] ? { label: r[0], lo: +m[1].replace(/,/g, ''), v: +m[2].replace(/,/g, ''), plus: !!m[3] } : null; }).filter(Boolean);
      for (const [pts, isRange] of [[single, false], [range, true]]) {
        if (pts.length < 3 || pts.length < rows.length * 0.6) continue;
        if (!best || pts.length > best.pts.length) best = { pts, range: isRange, title: cap ? strip(cap) : null, measure: head[col] || (isRange ? 'Range' : 'Cost'), end: t.index + t[0].length };
      }
    }
    if (best) return best;
  }
  return null;
}
function cardData(html) {
  const pts = [...html.matchAll(/<span class="state-name">([^<]+)<\/span><span class="state-cost">([^<]+)<\/span>/g)]
    .map((m) => ({ label: strip(m[1]), v: money(m[2]), from: /From/.test(m[2]) })).filter((p) => p.v !== null);
  if (pts.length < 5) return null;
  const at = html.indexOf('<span class="state-name">' + pts[0].label.replace(/&/g, '&amp;') + '</span><span class="state-cost">');
  const close = html.indexOf('</div>', html.lastIndexOf('<span class="state-cost">'));
  return { pts, from: pts[0].from, end: close + 6, start: at };
}
function svgChart(title, desc, pts, from) {
  const W = 680, labelW = 230, rowH = 30, top = 48, valueW = 120;
  const max = Math.max(...pts.map((p) => p.v));
  const H = top + pts.length * rowH + 16;
  const barMax = W - labelW - valueW - 16;
  const rows = pts.map((p, i) => {
    const y = top + i * rowH;
    const x0 = p.lo !== undefined ? labelW + Math.round((p.lo / max) * barMax) : labelW;
    const w = Math.max(2, labelW + Math.round((p.v / max) * barMax) - x0);
    const label = p.label.length > 31 ? p.label.slice(0, 30) + '\u2026' : p.label;
    return `<text x="${labelW - 8}" y="${y + 19}" text-anchor="end">${esc(label)}</text>` +
      `<rect x="${x0}" y="${y + 5}" width="${w}" height="${rowH - 10}" rx="3" fill="#8a6d3b"/>` +
      `<text x="${x0 + w + 6}" y="${y + 19}">${p.lo !== undefined ? '$' + p.lo.toLocaleString('en-US') + '\u2013' : (from ? 'from ' : '')}$${p.v.toLocaleString('en-US')}${p.plus ? '+' : ''}</text>`;
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(desc)}</desc>
<rect width="${W}" height="${H}" fill="#ffffff"/>
<g font-family="Inter, Arial, sans-serif" font-size="13" fill="#2b2b2b">
<text x="16" y="28" font-size="16" font-weight="700">${esc(title)}</text>
<line x1="${labelW}" y1="${top}" x2="${labelW}" y2="${H - 12}" stroke="#bbbbbb"/>
${rows}
</g>
</svg>
`;
}
const usd = (v) => '$' + v.toLocaleString('en-US');
function addChart(html, f, OUT) {
  html = html.replace(/\n?\s*<figure class="data-chart">[\s\S]*?<\/figure>/g, '');
  let d = tableData(html), from = false, title, insertAt;
  if (d) {
    title = d.title || strip((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '');
    insertAt = d.end;
    const after = html.slice(insertAt).match(/^(\s*<p class="table-note[^>]*>[\s\S]*?<\/p>)?\s*<\/div>/);
    if (after && /cost-table-wrap|<div[^>]*>\s*$/.test(html.slice(html.lastIndexOf('<div', insertAt - 1) - 0, html.lastIndexOf('<table', insertAt)))) insertAt += after[0].length;
  } else {
    const c = cardData(html);
    if (!c) return html;
    d = c; from = c.from; d.measure = d.measure || 'Cost';
    d.pts.sort((a, b) => b.v - a.v);
    d.cards = true;
    const h2s = [...html.slice(0, c.start).matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)];
    title = h2s.length ? strip(h2s[h2s.length - 1][1]) : strip((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '');
    if (from && !/start/i.test(title)) title += ': starting prices';
    insertAt = c.end;
  }
  if (!title) return html;
  const pts = d.pts;
  const hi = pts.reduce((a, b) => (b.v > a.v ? b : a)), lo = pts.reduce((a, b) => (b.v < a.v ? b : a));
  const val = (p) => p.lo !== undefined ? `${usd(p.lo)} to ${usd(p.v)}${p.plus ? ' or more' : ''}` : `${from ? 'from ' : ''}${usd(p.v)}`;
  const list = pts.length <= 10 ? pts.map((p) => `${p.label} ${val(p)}`).join('; ') : null;
  const kind = d.range ? 'Range chart' : 'Horizontal bar chart';
  const alt = list
    ? `${kind} of ${title}. ${list}.`
    : `${kind} of ${title} with ${pts.length} bars, from ${lo.label} at ${usd(lo.v)} to ${hi.label} at ${usd(hi.v)}.`;
  const name = f.replace(/\.html$/, '') + '.svg';
  fs.mkdirSync(path.join(OUT, 'charts'), { recursive: true });
  fs.writeFileSync(path.join(OUT, 'charts', name), svgChart(title, alt, pts, from));
  const W = 680, H = 48 + pts.length * 30 + 16;
  const cap = from
    ? `Starting prices from the ${pts.length} cards above, highest first; ${hi.label} is highest at ${usd(hi.v)} and ${lo.label} lowest at ${usd(lo.v)}.`
    : d.cards
      ? `${title}, highest first: ${hi.label} tops the list at ${usd(hi.v)} and ${lo.label} is lowest at ${usd(lo.v)}.`
      : d.range
        ? `Each bar spans the low-to-high range for one line of the ${title} table; ${hi.label} has the widest upper end at ${usd(hi.v)}${hi.plus ? ' or more' : ''}.`
        : pts.length > 10
          ? `The bars show the ${d.measure.toLowerCase()} column of the ${title} table; ${hi.label} is highest at ${usd(hi.v)} and ${lo.label} lowest at ${usd(lo.v)}.`
          : `The bars show the ${d.measure.toLowerCase()} column of the ${title} table; ${hi.label} is the largest item at ${usd(hi.v)}.`;
  // State pages carry the chart without a caption: the table above already
  // says what the numbers are, and the alt text lists every bar.
  const isState = /^(funeral|cremation|burial)-costs-/.test(f) && /\(2026\)|What Families Pay in 2026/.test(title + (html.match(/<h1>[^<]*/) || [''])[0]) && !/by-state|by-religion/.test(f);
  const fig = `\n      <figure class="data-chart"><img src="charts/${name}" alt="${esc(alt)}" width="${W}" height="${H}" loading="lazy" decoding="async" />${isState ? '' : `<figcaption>${esc(cap)}</figcaption>`}</figure>`;
  return html.slice(0, insertAt) + fig + html.slice(insertAt);
}

function run(OUT) {
  let rev = 0, lay = 0, ch = 0;
  for (const f of fs.readdirSync(OUT).sort()) {
    if (!f.endsWith('.html') || SKIP.has(f)) continue;
    const file = path.join(OUT, f);
    const before = fs.readFileSync(file, 'utf8');
    let html = addReviewed(before);
    if (html !== before) rev++;
    const fam = f.match(/^(funeral|cremation|burial)-costs-([a-z-]+)\.html$/);
    if (fam && !/^(by-state|by-religion|indianapolis|memphis|uninsured|rising-2026)$/.test(fam[2])) { const h2 = varyState(html, fam[1], fam[2]); if (h2 !== html) lay++; html = h2; }
    const h3 = addChart(html, f, OUT);
    if (/class="data-chart"/.test(h3)) ch++;
    html = h3;
    if (html !== before) fs.writeFileSync(file, html);
  }
  console.log(`  Re-audit: reviewed dates ${rev}, state layouts ${lay}, charts ${ch}`);
}
module.exports = { run };
