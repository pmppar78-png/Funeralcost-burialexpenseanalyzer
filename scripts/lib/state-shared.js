// G4 generator row: state-specific versions of the blocks every state funeral page shares.
// Active by default (r,G,N,P,c): resource and related-guide order from the state's data, guide/CTA headings,
// lower-cost table caption and row notes. R, C and K (rewritten resource text, CTA paragraph, rank line)
// are kept off: measured on overlap_spec they raised seq because their wording repeats across states.
// (resources, related-guide order, lower-cost table notes, CTA intro, 50-state callout).
// Every variable line is filled from data/state-facts.json or the states[] price data; links are unchanged.
const facts = require('../../data/state-facts.json');
const $ = n => '$' + n.toLocaleString('en-US');
function F(s) { return facts[s.name] || null; }
function ord(n) { const v = n % 100; return n + (v >= 11 && v <= 13 ? 'th' : ({1:'st',2:'nd',3:'rd'}[n % 10] || 'th')); }
function crPct(s) { return parseInt(s.cr, 10) || 0; }

function waitNote(s) {
  const f = F(s); if (!f) return '';
  return f.waitHours ? `not before ${f.waitHours} hours after death in ${s.name} (${f.waitCite})` : `no waiting period in ${s.name}, but a permit comes first (${f.waitCite})`;
}
function plotNote(s) {
  const f = F(s); if (!f) return '';
  const cem = f.plotCem || (f.national && f.national[0] && f.national[0].name) || (f.stateCems && f.stateCems[0] && f.stateCems[0].name);
  return `the grave itself, about ${$(s.b)} in ${s.name}, is extra` + (cem ? `, unless a veteran qualifies for ${cem}` : '');
}
function natNote(s) {
  const d = Math.round((s.f - 8300) / 83);
  return d === 0 ? 'level with the $8,300 NFDA median' : `${Math.abs(d)}% ${d > 0 ? 'above' : 'below'} the $8,300 NFDA median`;
}

function resources(s) {
  const f = F(s) || {};
  const reg = f.regulator || {};
  const fd = Array.isArray(f.fdRestricted)
    ? `Explains why ${s.name} is one of nine states that require a funeral director for ${f.fdRestricted[1]}`
    : `Lists the nine states that restrict family-led funerals; ${s.name} is not one of them`;
  const ftc = reg.org ? `The federal price-list rule; ${s.name} complaints can also go to the ${reg.org}` : 'The federal rule protecting funeral consumers';
  const aid = f.aid && f.aid.contact ? `Medicaid, charity and federal help, plus the ${s.name} route: ${f.aid.contact}` : 'Government programs and financial help for funeral costs';
  const top = [
    `<li><a href="https://www.funerals.org" target="_blank" rel="nofollow noopener">Funeral Consumers Alliance</a><span class="resource-desc">${fd}</span></li>`,
    `<li><a href="https://www.ftc.gov/legal-library/browse/rules/funeral-industry-practices-rule" target="_blank" rel="nofollow noopener">FTC Funeral Rule</a><span class="resource-desc">${ftc}</span></li>`,
    `<li><a href="funeral-payment-assistance.html">Payment Assistance Guide</a><span class="resource-desc">${aid}</span></li>`,
    `<li><a href="funeral-insurance-guide.html">Funeral Insurance Guide</a><span class="resource-desc">Final expense and burial policies for a family planning ahead for a ${$(s.f)} ${s.name} service</span></li>`,
    `<li><a href="best-burial-insurance.html">Best Burial Insurance Companies</a><span class="resource-desc">Side-by-side comparison of top burial insurance providers</span></li>`,
    `<li><a href="funeral-insurance-comparison.html">Insurance Plan Comparison</a><span class="resource-desc">Compare coverage, premiums, and payout speed across providers</span></li>`];
  const cost = [
    ['c', `<li><a href="direct-cremation-cost.html">Direct Cremation — Most Affordable Option</a><span class="resource-desc">NFDA 2023 median $2,645 with a family-supplied container (latest available); about ${$(s.dc)} in ${s.name} on our estimates</span></li>`],
    ['c', `<li><a href="cremation-vs-burial-cost.html">Cremation vs. Burial Cost Comparison</a><span class="resource-desc">Both paths at ${s.name} prices: ${$(s.dc)} direct cremation against a ${$(s.f)} traditional service plus the plot</span></li>`],
    ['b', `<li><a href="funeral-cost-breakdown.html">Funeral Cost Breakdown</a><span class="resource-desc">Every line item explained — know what you're paying for</span></li>`],
    ['b', `<li><a href="average-funeral-cost-2026.html">Average Funeral Cost in 2026</a><span class="resource-desc">${s.name}'s ${$(s.f)} traditional average sits ${natNote(s)}</span></li>`],
    ['x', `<li><a href="cheap-funeral-options.html">Cheapest Funeral Options</a><span class="resource-desc">Lower-cost alternatives, with typical price ranges</span></li>`],
    ['x', `<li><a href="funeral-price-comparison.html">How to Compare Funeral Prices</a><span class="resource-desc">Step-by-step guide to getting the best price</span></li>`]];
  const cremFirst = crPct(s) >= 60;
  const order = cost.slice().sort((a, b) => (r => r === 'x' ? 2 : (r === 'c') === cremFirst ? 0 : 1)(a[0]) - (r => r === 'x' ? 2 : (r === 'c') === cremFirst ? 0 : 1)(b[0]));
  return `<div class="resource-suggestions"><h3>Where ${s.name} families can check rules and find help</h3><ul class="resource-list">${top.join('')}</ul></div>` +
    `<div class="resource-suggestions"><h3>Set ${s.name} prices against national figures</h3><ul class="resource-list">${order.map(x => x[1]).join('')}</ul></div>`;
}

// Same guides as before, reordered by what the state's own data makes most relevant.
function orderGuides(s, list, key) {
  const f = F(s) || {};
  const score = g => {
    const h = g.h;
    if (f.aid && /payment-assistance|no-money/.test(h)) return 0;
    if (crPct(s) >= 60 && /cremation|urn/.test(h)) return 1;
    if (crPct(s) < 50 && /burial|casket|headstone/.test(h)) return 1;
    if (((f.national || []).length + (f.stateCems || []).length) >= 3 && /veteran/.test(h)) return 2;
    if (Array.isArray(f.fdRestricted) && /home-funeral|questions-to-ask/.test(h)) return 2;
    if (!f.fdRestricted && /home-funeral/.test(h)) return 3;
    return 4;
  };
  const hs = x => { let v = 0; for (const c of (key || s.slug) + x) v = (v * 31 + c.charCodeAt(0)) >>> 0; return v; };
  return list.map(g => [score(g), hs(g.h), g]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(x => x[2]);
}

function ctaIntro(s) {
  const f = F(s) || {};
  const wait = f.waitHours ? `the ${f.waitHours}-hour cremation wait` : 'the cremation permit';
  return `<h3>Price a ${s.name} funeral with the free tools</h3>
        <p>Use our free calculator to estimate funeral costs in your area, compare cremation vs. burial prices, and find ways to lower costs. It starts from this page's ${s.name} figures, ${$(s.f)} for a traditional service and ${$(s.dc)} for direct cremation, and the free AI guide can answer questions about ${wait} or a price list you were handed.</p>`;
}

function rankLine(s, states) {
  const higher = states.filter(x => x.f > s.f).length, same = states.filter(x => x.f === s.f && x !== s).length;
  return ` On our estimates ${s.name}'s ${$(s.f)} traditional funeral is ${same ? 'tied for ' : ''}${ord(higher + 1)}-highest of the ${states.length} states, ${natNote(s)}.`;
}

// Build pass: existing pages are never regenerated, so apply the blocks to the built HTML.
function hrefs(x) { return (x.match(/href="[^"]+"/g) || []).sort().join('|'); }
function run(OUT, states, metros) {
  const T = (process.env.SST || 'r,G,N,P,c').split(',');
  const fs = require('fs'), path = require('path'); let n = 0;
  const jobs = states.map(s => ({ s, slug: s.slug, label: s.name, st: true })).concat((metros || []).map(m => ({ s: states.find(x => x.slug === m.ss), slug: m.slug, label: m.city, st: false })).filter(j => j.s));
  for (const { s, slug, label, st } of jobs) {
    const fp = path.join(OUT, `funeral-costs-${slug}.html`);
    if (!fs.existsSync(fp) || !F(s)) continue;
    let h = fs.readFileSync(fp, 'utf8'); const before = h;
    const rx = /<div class="resource-suggestions"><h3>Educational Resources<\/h3>[\s\S]*?<\/div><div class="resource-suggestions"><h3>Compare Funeral Costs<\/h3>[\s\S]*?<\/div>/;
    const m = h.match(rx);
    if (st && m && T.includes('R')) { const r = resources(s); if (hrefs(m[0]) !== hrefs(r)) throw new Error('state-shared resources links ' + s.slug); h = h.replace(m[0], r); }
    const g = h.match(/<div class="related-guides"><h3>Related Guides<\/h3><ul>([\s\S]*?)<\/ul><\/div>/);
    if (T.includes('r')) {
      h = h.replace(/(<div class="resource-suggestions"><h3>(?:Educational Resources|Compare Funeral Costs)<\/h3><ul class="resource-list">)([\s\S]*?)(<\/ul><\/div>)/g, (all, a, body, c) => {
        const li = body.match(/<li>[\s\S]*?<\/li>/g) || [];
        if (li.join('') !== body) return all;
        const it = li.map(x => ({ h: (x.match(/href="([^"]+)"/) || [])[1] || '', x }));
        return a + orderGuides(s, it, slug).map(y => y.x).join('') + c;
      });
    }
    if (g && T.includes('G')) {
      const items = [...g[1].matchAll(/<li><a href="([^"]+)">([\s\S]*?)<\/a><\/li>/g)].map(x => ({ h: x[1], t: x[2] }));
      if (items.length !== (g[1].match(/<li>/g) || []).length) throw new Error('state-shared guides ' + s.slug);
      h = h.replace(g[0], `<div class="related-guides"><h3>Related guides, ordered for ${label}</h3><ul>${orderGuides(s, items, slug).map(x => `<li><a href="${x.h}">${x.t}</a></li>`).join('')}</ul></div>`);
    }
    if (T.includes('c')) h = h.replace(/<h3>Calculate Your Funeral Costs[^<]*<\/h3>/, `<h3>Calculate ${label} Funeral Costs With the Free Tools</h3>`);
    if (st && T.includes('C')) h = h.replace(/<h3>Calculate Your Funeral Costs[^<]*<\/h3>\s*<p>Use our free calculator to estimate funeral costs in your area, compare cremation vs\. burial prices, and find ways to lower costs\.<\/p>/, ctaIntro(s));
    if (st && T.includes('K') && !h.includes('-highest of the ')) h = h.replace(/(2026 National Funeral Cost Index<\/a>\.)(<\/div>)/, (a, x, y) => x + rankLine(s, states) + y);
    if (st && T.includes('N')) h = h.replace('<td>Cremation followed by a separate memorial service</td>', `<td>Cremation followed by a separate memorial service; ${s.cr} of ${s.name} deaths now end in cremation</td>`);
    if (st && T.includes('N')) h = h.replace('<td>Full service with viewing, ceremony, and burial</td>', `<td>Full service with viewing, ceremony, and burial, ${natNote(s)}</td>`);
    if (st && T.includes('P')) h = h.replace(`<caption>Most Affordable Funeral Options in ${s.name}</caption>`, `<caption>Most Affordable Funeral Options in ${s.name}, from ${$(s.dc)} to ${$(s.f)}</caption>`);
    if (h !== before) { fs.writeFileSync(fp, h); n++; }
  }
  // Cremation and burial state pages: reordering only (Growth step 3), options in SSX.
  const X = (process.env.SSX === undefined ? 'r,G' : process.env.SSX).split(',').filter(Boolean);
  for (const kind of ['cremation', 'burial']) {
    for (const s of states) {
      const fp = path.join(OUT, `${kind}-costs-${s.slug}.html`);
      if (!fs.existsSync(fp) || !F(s)) continue;
      let h = fs.readFileSync(fp, 'utf8'); const before = h; const key = kind + '-' + s.slug;
      if (X.includes('r')) {
        h = h.replace(/(<div class="resource-suggestions"><h3>(?:Cremation Resources|Burial Resources|Compare Funeral Costs)<\/h3><ul class="resource-list">)([\s\S]*?)(<\/ul><\/div>)/g, (all, a, body, c) => {
          const li = body.match(/<li>[\s\S]*?<\/li>/g) || [];
          if (li.join('') !== body) return all;
          const it = li.map(x => ({ h: (x.match(/href="([^"]+)"/) || [])[1] || '', x }));
          return a + orderGuides(s, it, key).map(y => y.x).join('') + c;
        });
      }
      const g = h.match(/<div class="related-guides"><h3>Related Guides<\/h3><ul>([\s\S]*?)<\/ul><\/div>/);
      if (g && X.includes('G')) {
        const items = [...g[1].matchAll(/<li><a href="([^"]+)">([\s\S]*?)<\/a><\/li>/g)].map(x => ({ h: x[1], t: x[2] }));
        if (items.length === (g[1].match(/<li>/g) || []).length)
          h = h.replace(g[0], `<div class="related-guides"><h3>Related ${kind} guides for ${s.name}</h3><ul>${orderGuides(s, items, key).map(x => `<li><a href="${x.h}">${x.t}</a></li>`).join('')}</ul></div>`);
      }
      if (X.includes('c')) h = h.replace(/<h3>Calculate Your Funeral Costs[^<]*<\/h3>/, `<h3>Calculate ${s.name} ${kind === 'cremation' ? 'Cremation' : 'Burial'} Costs With the Free Tools</h3>`);
      if (h !== before) { fs.writeFileSync(fp, h); n++; }
    }
  }
  return n;
}
module.exports = { run, resources, orderGuides, ctaIntro, rankLine, waitNote, plotNote, natNote };
