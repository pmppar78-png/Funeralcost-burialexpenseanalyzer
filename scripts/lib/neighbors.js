// Bordering-state links for the state cost pages (burial / funeral / cremation).
// ADJ is the standard U.S. land-border adjacency list for the 50 states (states
// that meet only at a corner, such as Arizona and Colorado at Four Corners, are
// not counted). Alaska's only land border is with Canada and Hawaii has none, so
// both are pointed at the other Pacific states instead.
const ADJ = {
  AL:['FL','GA','MS','TN'], AK:[], AZ:['CA','NV','NM','UT'], AR:['LA','MS','MO','OK','TN','TX'],
  CA:['AZ','NV','OR'], CO:['KS','NE','NM','OK','UT','WY'], CT:['MA','NY','RI'], DE:['MD','NJ','PA'],
  FL:['AL','GA'], GA:['AL','FL','NC','SC','TN'], HI:[], ID:['MT','NV','OR','UT','WA','WY'],
  IL:['IN','IA','KY','MO','WI'], IN:['IL','KY','MI','OH'], IA:['IL','MN','MO','NE','SD','WI'],
  KS:['CO','MO','NE','OK'], KY:['IL','IN','MO','OH','TN','VA','WV'], LA:['AR','MS','TX'], ME:['NH'],
  MD:['DE','PA','VA','WV'], MA:['CT','NH','NY','RI','VT'], MI:['IN','OH','WI'], MN:['IA','ND','SD','WI'],
  MS:['AL','AR','LA','TN'], MO:['AR','IL','IA','KS','KY','NE','OK','TN'], MT:['ID','ND','SD','WY'],
  NE:['CO','IA','KS','MO','SD','WY'], NV:['AZ','CA','ID','OR','UT'], NH:['ME','MA','VT'],
  NJ:['DE','NY','PA'], NM:['AZ','CO','OK','TX'], NY:['CT','MA','NJ','PA','VT'],
  NC:['GA','SC','TN','VA'], ND:['MN','MT','SD'], OH:['IN','KY','MI','PA','WV'], OK:['AR','CO','KS','MO','NM','TX'],
  OR:['CA','ID','NV','WA'], PA:['DE','MD','NJ','NY','OH','WV'], RI:['CT','MA'], SC:['GA','NC'],
  SD:['IA','MN','MT','NE','ND','WY'], TN:['AL','AR','GA','KY','MS','MO','NC','VA'], TX:['AR','LA','NM','OK'],
  UT:['AZ','CO','ID','NV','WY'], VT:['MA','NH','NY'], VA:['KY','MD','NC','TN','WV'],
  WA:['ID','OR'], WV:['KY','MD','OH','PA','VA'], WI:['IL','IA','MI','MN'], WY:['CO','ID','MT','NE','SD','UT']
};
const PACIFIC = ['WA','OR','CA'];
const money = n => '$' + Math.round(n).toLocaleString('en-US');

function neighborBlock(s, pageType, states) {
  const by = a => states.find(x => x.abbr === a);
  const island = !ADJ[s.abbr].length;
  const ns = (island ? PACIFIC : ADJ[s.abbr]).map(by).filter(Boolean);
  if (!ns.length) return '';
  const prefix = pageType === 'cremation' ? 'cremation-costs' : pageType === 'burial' ? 'burial-costs' : 'funeral-costs';
  const label = pageType === 'cremation' ? 'Cremation' : pageType === 'burial' ? 'Burial' : 'Funeral';
  const key = pageType === 'cremation' ? 'dc' : pageType === 'burial' ? 'b' : 'f';
  const what = pageType === 'cremation' ? 'direct cremation estimate' : pageType === 'burial' ? 'cemetery plot estimate' : 'traditional funeral estimate';
  const item = n => pageType === 'cremation'
    ? `direct cremation about ${money(n.dc)}, cremation rate about ${n.cr}`
    : pageType === 'burial'
      ? `plot about ${money(n.b)}, funeral service about ${money(n.f)}`
      : `traditional funeral about ${money(n.f)}, direct cremation about ${money(n.dc)}`;
  // No generated intro sentence for bordering states (Growth review 2026-10-24: the
  // computed "shares a border with N states..." line was the same frame on ~150 pages).
  // The list rows carry the figures. Alaska and Hawaii keep one line explaining why
  // the Pacific states are listed, since they have no bordering state.
  // Round 4: the AK, HI, ME and RI intros were one sentence repeated across each
  // state's funeral, cremation and burial pages. Each page now gets a line about
  // its own topic. Geography: U.S. Census Bureau state areas and boundaries
  // (Alaska's only land border is with Canada, Hawaii has none, Maine borders
  // only New Hampshire, Rhode Island is the smallest state by area). Figures:
  // the same state rows that fill the page tables; cremation rates as listed.
  const rate = x => parseFloat(String(x));
  const diff = (a, b) => a === b ? 'the same as' : `${money(Math.abs(a - b))} ${a > b ? 'more than' : 'less than'}`;
  const span = k => { const v = ns.map(n => n[k]); return [Math.min(...v), Math.max(...v)]; };
  const low = k => ns.reduce((m, n) => (n[k] < m[k] ? n : m));
  let intro = '';
  if (s.abbr === 'AK') {
    const wa = by('WA');
    if (pageType === 'funeral') intro = `Alaska touches no other state, only Canada, so its funeral prices are set beside Washington, Oregon and California. The ${money(s.f)} Alaska estimate for a traditional funeral is ${diff(s.f, wa.f)} Washington's ${money(wa.f)}.`;
    else if (pageType === 'cremation') { const c = low('dc'); intro = `With Canada as Alaska's only land neighbor, the cremation comparison below uses the Pacific Coast. Direct cremation is estimated at ${money(s.dc)} in Alaska; ${c.name} has the lowest of the three coastal estimates, ${money(c.dc)}.`; }
    else { const [a, b] = span('b'); intro = `Alaska's only land border is with Canada, so the burial figures below come from the three Pacific Coast states, where a cemetery plot is estimated at ${money(a)} to ${money(b)}, against ${money(s.b)} in Alaska.`; }
  } else if (s.abbr === 'HI') {
    const ca = by('CA');
    if (pageType === 'funeral') intro = `With no land border at all, Hawaii is compared here with the three mainland Pacific states. Hawaii's traditional funeral estimate of ${money(s.f)} is ${diff(s.f, ca.f)} California's ${money(ca.f)}.`;
    else if (pageType === 'cremation') intro = `Hawaii's cremation rate, about ${rate(s.cr)}%, is shown beside the West Coast states below because the islands have no neighboring state; direct cremation in Hawaii is estimated at ${money(s.dc)}.`;
    else { const [a, b] = span('b'); intro = `Hawaii borders no other state, so the closest comparison for burial costs is the mainland Pacific coast, where plots are estimated at ${money(a)} to ${money(b)}, against ${money(s.b)} in Hawaii.`; }
  } else if (s.abbr === 'ME') {
    const nh = ns[0];
    if (pageType === 'funeral') intro = `New Hampshire is Maine's only neighboring state, the only such case in the country. Its traditional funeral estimate, ${money(nh.f)}, is ${diff(nh.f, s.f)} the ${money(s.f)} Maine estimate.`;
    else if (pageType === 'cremation') intro = `Because Maine borders only New Hampshire, the one comparison here is direct cremation at ${money(nh.dc)} there, against ${money(s.dc)} in Maine; the cremation rate is about ${rate(nh.cr)}% in New Hampshire and ${rate(s.cr)}% in Maine.`;
    else intro = `A Maine burial can be compared with just one neighbor, New Hampshire, where a cemetery plot is estimated at ${money(nh.b)} against ${money(s.b)} in Maine, and the funeral service at ${money(nh.f)} against ${money(s.f)}.`;
  } else if (s.abbr === 'RI') {
    const [ct, ma] = [by('CT'), by('MA')];
    if (pageType === 'funeral') { const dir = ct.f > s.f && ma.f > s.f ? 'costs more in both' : ct.f < s.f && ma.f < s.f ? 'costs less in both' : 'is priced differently in each'; intro = `Rhode Island, the smallest state by area, borders only Connecticut and Massachusetts, and a traditional funeral ${dir}: about ${money(ct.f)} and ${money(ma.f)}, against ${money(s.f)} in Rhode Island.`; }
    else if (pageType === 'cremation') intro = `Direct cremation in Rhode Island is estimated at ${money(s.dc)}, with a cremation rate of about ${rate(s.cr)}%; the state's only two neighbors, Connecticut and Massachusetts, are listed below for comparison.`;
    else intro = `Families near the Rhode Island line can also price cemeteries in Connecticut or Massachusetts, the state's only two neighbors; the Rhode Island plot estimate is ${money(s.b)}.`;
  }
  const h3 = island ? `${label} Costs in the Pacific Coast States` : `${label} Costs in Bordering States`;
  return `<div class="related-guides"><h3>${h3}</h3>${intro ? `<p>${intro}</p>` : ''}<ul>${ns.map(n => `<li><a href="${prefix}-${n.slug}.html">${n.name}</a>: ${item(n)}</li>`).join('')}</ul></div>`;
}
const BLOCK_RE = /<div class="related-guides"><h3>(?:Funeral|Burial|Cremation) Costs in (?:Nearby States|Bordering States|the Pacific Coast States)<\/h3>[\s\S]*?<\/ul><\/div>/;
// Rewrites the block in already-committed state pages (writePage never overwrites them).
function syncNeighborBlocks(root, states, fs, path) {
  let n = 0;
  for (const s of states) for (const t of ['funeral', 'burial', 'cremation']) {
    const p = path.join(root, `${t}-costs-${s.slug}.html`);
    if (!fs.existsSync(p)) continue;
    const html = fs.readFileSync(p, 'utf8');
    if (!BLOCK_RE.test(html)) continue;
    const out = html.replace(BLOCK_RE, () => neighborBlock(s, t, states));
    if (out !== html) { fs.writeFileSync(p, out); n++; }
  }
  return n;
}
module.exports = { ADJ, neighborBlock, syncNeighborBlocks };
