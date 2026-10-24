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
  let intro = '';
  if (s.abbr === 'AK') intro = `Alaska's only land border is with Canada, so the closest U.S. reference points are the three Pacific Coast states. The ${what} here is ${money(s[key])}.`;
  else if (s.abbr === 'HI') intro = `Hawaii shares no border with another state, so the three West Coast states are the nearest mainland reference points; Hawaii's ${what} is ${money(s[key])}.`;
  else if (s.abbr === 'ME') intro = `Maine is the only state that borders just one other state. In New Hampshire the ${what} is ${money(ns[0][key])}, against ${money(s[key])} in Maine.`;
  else if (s.abbr === 'RI') intro = `Rhode Island, the smallest state by area, shares land borders only with Connecticut and Massachusetts.`;
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
