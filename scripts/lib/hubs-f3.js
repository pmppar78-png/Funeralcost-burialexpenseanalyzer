// F3: answer-first summaries and state-rule tables for the national state hubs.
// Every cost figure is read from the hub's own committed state table, and every
// rule comes from data/state-facts.json, whose waiting periods, citations, regulators and
// VA national cemeteries are the same sourced facts shown on each state page.
const facts = require('../../data/state-facts.json');
const usd = n => '$' + Math.round(n).toLocaleString('en-US');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const median = a => { const b = [...a].sort((x, y) => x - y); const m = b.length >> 1; return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; }
const list = a => a.length > 2 ? a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1] : a.join(' and ');
const byName = st => [...st].sort((a, b) => a.name.localeCompare(b.name));
const lows = (st, k) => { const m = Math.min(...st.map(s => s[k])); return [m, st.filter(s => s[k] === m).map(s => s.name)]; }
const highs = (st, k) => { const m = Math.max(...st.map(s => s[k])); return [m, st.filter(s => s[k] === m).map(s => s.name)]; }
function regulator(f) {
  const r = f.regulator || {}
  if (!r.org) return '&mdash;';
  const name = r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.org)}</a>` : esc(r.org);
  return r.phone ? `${name}<br><span class="muted">${esc(r.phone)}</span>` : name;
}

function cremationSummary(st) {
  const md = median(st.map(s => s.dc)), mc = median(st.map(s => s.c));
  const [lo, loN] = lows(st, 'dc'), [hi, hiN] = highs(st, 'dc');
  return `<div class="methodology-note" id="quick-answer">
        <p><strong>How much cremation costs:</strong> across the 50 states in our table, the middle estimate for a direct cremation is ${usd(md)}, and a cremation with a funeral service runs a middle ${usd(mc)}. Direct cremation is cheapest in ${list(loN)} (about ${usd(lo)}) and most expensive in ${list(hiN)} (about ${usd(hi)}). For a national benchmark, NFDA&rsquo;s 2023 General Price List Study puts the median direct cremation at $2,645 when the family supplies the container. Prices for a specific provider come from its General Price List, which the <a href="ftc-funeral-rule-guide.html">FTC Funeral Rule</a> lets you request by phone.</p>
      </div>`;
}

function cremationRules(states) {
  const st = byName(states);
  const by = h => st.filter(s => facts[s.name].waitHours === h).map(s => s.name);
  const none = by(0), h12 = by(12), h24 = by(24), h48 = by(48);
  const rows = st.map(s => {
    const f = facts[s.name];
    const wait = f.waitHours ? `${f.waitHours} hours` : 'None set; permit still needed';
    return `<tr><td><a href="cremation-costs-${s.slug}.html">${s.name}</a></td><td>${wait}</td><td>${esc(f.waitCite).replace(/\. (?=\S)/g, '.&nbsp;')}</td><td>${regulator(f)}</td></tr>`;
  }).join('\n            ');
  return `<h2 id="state-rules">Cremation Waiting Periods and Regulators by State</h2>
      <p>Price is only half of planning a cremation; the other half is timing. ${h48.length} states (${list(h48)}) make families wait 48 hours after death, ${h24.length} set a 24-hour minimum${h12.length ? `, and ${list(h12)} uses 12 hours` : ''}. The other ${none.length} set no fixed wait, but that rarely means same-day cremation: a coroner, medical examiner or local registrar still has to issue a permit, and the next of kin or authorized agent has to sign. Some of the timed states let a medical examiner or court waive the wait, so the citation in each row is the place to check.</p>
      <p>The last column names the state office that licenses funeral homes and crematories. It is the right place to confirm a provider&rsquo;s license or to file a complaint about pricing.</p>
      <div class="cost-table-wrap">
        <table class="cost-table">
          <caption>Minimum wait before cremation, the governing law, and the state regulator</caption>
          <thead><tr><th>State</th><th>Minimum wait</th><th>Law</th><th>Regulator</th></tr></thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
      <p class="muted">Citations as published on each state&rsquo;s cremation page on this site; a waiver, an infectious-disease case or a medical examiner hold can change the timing. Compiled from those state pages in October 2026.</p>`;
}

function burialSummary(st) {
  const tot = st.map(s => ({ name: s.name, t: s.t }));
  const md = median(tot.map(x => x.t)), mp = median(st.map(s => s.b));
  const lo = tot.reduce((a, b) => (b.t < a.t ? b : a)), hi = tot.reduce((a, b) => (b.t > a.t ? b : a));
  return `<div class="methodology-note" id="quick-answer">
        <p><strong>What a burial costs:</strong> a full burial (funeral service, plot, vault, opening and closing, and a basic marker) has a middle estimated total of ${usd(md)} across the 50 states in our table. It is lowest in ${lo.name} (about ${usd(lo.t)}) and highest in ${hi.name} (about ${usd(hi.t)}). The plot alone has a middle estimate of ${usd(mp)}. NFDA&rsquo;s 2023 national median of $8,300 for a funeral with viewing and burial does not include any cemetery charges, which is why the totals here are higher.</p>
      </div>`;
}

function burialVA(states) {
  const st = byName(states);
  const nat = s => (facts[s.name].national || []).filter(n => n.status === 'Open' || n.status === 'Cremation Only');
  const casket = s => nat(s).some(n => n.status === 'Open');
  const without = st.filter(s => !casket(s)).map(s => s.name);
  const rows = st.map(s => {
    const o = nat(s);
    const ph = n => (n.phone ? ` <span class="muted">(${esc(n.phone)})</span>` : '');
    let cems = o.map(n => esc(n.name) + (n.status === 'Cremation Only' ? ' (cremated remains only)' : '') + ph(n)).join('<br>');
    if (!casket(s)) {
      const sc = (facts[s.name].stateCems || []).map(c => esc(c.name));
      cems += (cems ? '<br>' : '') + (sc.length ? `State-run: ${sc.join('; ')}` : 'None in the state');
    }
    return `<tr><td><a href="burial-costs-${s.slug}.html">${s.name}</a></td><td>${cems}</td></tr>`;
  }).join('\n            ');
  return `<h2 id="va-cemeteries">VA National Cemeteries Open for Burial, by State</h2>
      <p>For a veteran, the biggest single saving on a burial is usually the grave itself: the <a href="https://www.cem.va.gov/" target="_blank" rel="noopener">VA National Cemetery Administration</a> provides the gravesite, opening and closing, a liner and a government headstone or marker at no charge to eligible veterans, and a spouse can often be buried in the same site. The table lists the national cemeteries VA shows as open in each state, marking the ones that now accept only cremated remains. ${without.length} states (${list(without)}) have no national cemetery open for a casket burial, so the table names the state-run veterans cemeteries there instead; most were built with VA grant money, but each state sets its own residency rules and any fee for a spouse.</p>
      <p>The funeral home, not the family, usually books the burial through the <a href="https://www.va.gov/burials-memorials/schedule-a-burial/" target="_blank" rel="noopener">National Cemetery Scheduling Office</a> (800-535-1117). Ask for the cemetery&rsquo;s own charges in writing for anything VA does not cover, such as an upgraded marker or a private plot for a family member who does not qualify.</p>
      <div class="cost-table-wrap">
        <table class="cost-table">
          <caption>Where a veteran can be buried in each state</caption>
          <thead><tr><th>State</th><th>Veterans cemeteries</th></tr></thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
      <p class="muted">National cemetery status as listed by VA at cem.va.gov, and state veterans cemeteries as carried on each state&rsquo;s burial page on this site; status can change as cemeteries fill or open, so confirm with VA before planning.</p>`;
}

// Strongest pages by Google Search Console exposure (Jul 28 to Oct 27, 2026).
function strongest(kind) {
  const L = {
    cremation: [['cremation-costs-michigan.html', 'Cremation costs in Michigan'], ['direct-cremation-cost.html', 'What direct cremation costs'], ['cremation-vs-burial-cost.html', 'Cremation vs. burial cost'], ['cremation-vs-burial-calculator.html', 'Cremation vs. burial calculator']],
    burial: [['burial-costs-florida.html', 'Burial costs in Florida'], ['burial-costs-ohio.html', 'Burial costs in Ohio'], ['burial-costs-pennsylvania.html', 'Burial costs in Pennsylvania'], ['burial-costs-tennessee.html', 'Burial costs in Tennessee'], ['burial-costs-georgia.html', 'Burial costs in Georgia'], ['veteran-burial-benefits.html', 'VA burial benefits for veterans']],
  }[kind];
  const intro = kind === 'cremation'
    ? 'These are the cremation guides readers open most often, a good place to start if you are weighing cremation against burial or want the cheapest workable option:'
    : 'Florida, Ohio, Pennsylvania, Tennessee and Georgia get the most burial searches on this site, and the veterans page answers the question we hear most about free graves:';
  return `<h2 id="most-read">${kind === 'cremation' ? 'Where Readers Start With Cremation' : 'Burial Pages Families Use Most'}</h2>
      <p>${intro}</p>
      <ul>${L.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul>`;
}

const num = x => Number(x.replace(/[$,]/g, ''));
function rows(html, kind) {
  const re = new RegExp(`<tr><td><a href="${kind}-costs-([a-z-]+)\\.html">([^<]+)</a></td><td class="cost-value">([^<]+)</td><td>([^<]+)</td><td>([^<]+)</td></tr>`, 'g');
  const out = [];
  let m;
  while ((m = re.exec(html))) if (facts[m[2]]) out.push({ slug: m[1], name: m[2], a: m[3], b: m[4], c: m[5] });
  if (out.length !== 50) throw new Error(`hubs-f3: expected 50 ${kind} rows, got ${out.length}`);
  return out;
}
const S = '<!-- f3:', E = '<!-- /f3 -->';
function put(html, id, before, block) {
  const re = new RegExp(`${S}${id} -->[\\s\\S]*?${E}\\n\\n      `);
  const wrapped = `${S}${id} -->\n      ${block}\n      ${E}\n\n      `;
  if (re.test(html)) return html.replace(re, () => wrapped);
  if (!html.includes(before)) throw new Error(`hubs-f3: anchor missing for ${id}`);
  return html.replace(before, () => wrapped + before);
}
exports.run = function run(OUT) {
  const fs = require('fs'), path = require('path');
  let f = path.join(OUT, 'cremation-costs-by-state.html');
  let h = fs.readFileSync(f, 'utf8');
  let st = rows(h, 'cremation').map(r => ({ slug: r.slug, name: r.name, dc: num(r.a), c: num(r.b) }));
  h = put(h, 'answer', '<h2 id="all-states">', cremationSummary(st));
  h = put(h, 'rules', '<h2 id="about">', cremationRules(st) + '\n\n      ' + strongest('cremation'));
  fs.writeFileSync(f, h);
  f = path.join(OUT, 'burial-costs-by-state.html');
  h = fs.readFileSync(f, 'utf8');
  st = rows(h, 'burial').map(r => ({ slug: r.slug, name: r.name, b: num(r.b), t: num(r.c) }));
  h = put(h, 'answer', '<h2 id="all-states">', burialSummary(st));
  h = put(h, 'va', '<h2 id="about">', burialVA(st) + '\n\n      ' + strongest('burial'));
  fs.writeFileSync(f, h);
  console.log('  F3 hub sections: cremation-costs-by-state, burial-costs-by-state');
};
