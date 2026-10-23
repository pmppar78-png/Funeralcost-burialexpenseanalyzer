'use strict';
/**
 * Real, sourced state section for funeral, cremation and burial pages.
 * Facts live in data/state-facts.json (sources listed there and in the
 * patch README). Nothing here is generated filler: if a fact is missing
 * for a state, the sentence is left out.
 */
const fs = require('fs');
const path = require('path');

const FACTS = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'state-facts.json'), 'utf8'));

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function hash(s) {
  let h = 2166136261;
  for (const ch of s) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function pick(ctx, key, list) {
  return list[hash(`${ctx.slug}|${ctx.kind}|${key}`) % list.length];
}
function stateName(ctx) {
  return ctx.name === 'the District of Columbia' ? 'District of Columbia' : ctx.name;
}
function an(w) { return /^[AEIO]/.test(w) || (/^U/.test(w) && !/^U(?:tah|ni|s[aeiou]|r[aeiou])/i.test(w)) ? 'an' : 'a'; }
function An(w) { return an(w) === 'an' ? 'An' : 'A'; }
function factsFor(ctx) {
  return FACTS[stateName(ctx)] || null;
}
function nameIn(ctx) {
  return stateName(ctx) === 'District of Columbia' ? 'DC' : stateName(ctx);
}

function waitShort(ctx, f) {
  const n = nameIn(ctx);
  if (f.waitHours) return `the ${f.waitHours}-hour wait ${n} requires after death (${f.waitCite})`;
  return `the cremation permit step (${n} sets no fixed waiting period; ${f.waitCite})`;
}
function waitInline(ctx, f) {
  if (f.waitHours) return `a ${f.waitHours}-hour wait after death (${f.waitCite})`;
  return `no fixed waiting period (${f.waitCite}), though a permit is still required`;
}
function waitSentence(ctx, f) {
  return f.waitRule.replace(/[\s.]+$/, '') + ` (${f.waitCite})`;
}

/** Rewrites old, unverified waiting-period claims baked into earlier pages. */
function fixWaitClaims(html, ctx) {
  const f = factsFor(ctx);
  if (!f) return html;
  return html
    .replace(/a standard 24-48 hour waiting period/g, () => waitInline(ctx, f))
    .replace(/the mandatory 24-48 hour pre-cremation waiting period/g, () => waitShort(ctx, f))
    .replace(/The regulations directory timing line for [^:<"]+ is: [^.<"]+\.(?: That is not a generic 24-48 hour national wait\.)?/g, () => waitSentence(ctx, f) + '.')
    .replace(/the directory timing line for [^(<"]+\([^)<"]*\) before cremation/g, () => `${waitShort(ctx, f)} before cremation`)
    .replace(/follows standard cremation regulations requiring a mandatory waiting period \(typically 24-48 hours\) before cremation/g,
      () => (f.waitHours ? `requires a ${f.waitHours}-hour wait before cremation (${f.waitCite})` : `sets no fixed waiting period before cremation but requires a permit (${f.waitCite})`))
    .replace(/However, there is typically a mandatory 24 to 48 hour waiting period before cremation can proceed/g,
      () => (f.waitHours ? `However, ${nameIn(ctx)} requires a ${f.waitHours}-hour wait before cremation can proceed (${f.waitCite})` : `However, cremation cannot proceed until the permit is issued, even though ${nameIn(ctx)} sets no fixed waiting period (${f.waitCite})`))
    .replace(/Tennessee's 48-72 hour waiting period/g, 'the cremation permit from the county medical examiner (Tennessee sets no fixed waiting period; Tenn. Code Ann. 62-5-504)');
}

function regulatorP(ctx, f) {
  const r = f.regulator;
  if (!r) return '';
  const org = r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.org)}</a>` : esc(r.org);
  const n = esc(nameIn(ctx));
  const frames = {
    'funeral-costs-': [
      `Funeral homes in ${n} are licensed by the ${org} (${esc(r.phone)}). That office takes ${n} complaints about pricing, misleading sales, or a home that will not hand over its price list.`,
      `The ${org} licenses funeral directors and establishments in ${n}; call ${esc(r.phone)} to check a license or file a complaint.`,
      `If a funeral home in ${n} refuses to show prices or pressures you, the licensing body is the ${org}, reachable at ${esc(r.phone)}.`
    ],
    'cremation-costs-': [
      `Crematories and the funeral homes that sell cremation in ${n} answer to the ${org} (${esc(r.phone)}).`,
      `To check that a cremation provider in ${n} is licensed, or to report a problem, contact the ${org} at ${esc(r.phone)}.`,
      `The licensing office for cremation providers in ${n} is the ${org}; its number is ${esc(r.phone)}.`
    ],
    'burial-costs-': [
      `Funeral homes handling burials in ${n} are licensed by the ${org} (${esc(r.phone)}). Cemetery sales in ${n} may fall under a different office, so ask the board who oversees the cemetery you are considering.`,
      `For a license check or complaint about a funeral home arranging a burial in ${n}, call the ${org} at ${esc(r.phone)}; ${n} cemeteries can have a separate regulator.`,
      `The ${org} (${esc(r.phone)}) licenses the funeral homes that arrange burials in ${n}. It can also tell you which ${n} office handles cemetery complaints.`
    ]
  }[ctx.kind];
  let t = pick(ctx, 'reg', frames);
  if (f.code === 'CO') {
    t = t.replace('licenses funeral directors and establishments', 'registers funeral homes and crematories')
      .replace('are licensed by the', 'are registered with the').replace('is licensed, or', 'is registered, or')
      .replace('licenses the funeral homes', 'registers the funeral homes').replace('licensing office', 'registration office')
      .replace('licensing body', 'regulator').replace('to check a license', 'to check a registration').replace('a license check', 'a registration check');
    t += ' Individual funeral directors, embalmers and cremationists have not needed a Colorado license so far; Senate Bill 24-173 (C.R.S. 12-135-501) requires one starting January 1, 2027, and practitioners without the new qualifications can apply for a provisional license before then.';
  }
  return `<p>${t}</p>`;
}

function directorP(ctx, f) {
  const n = esc(nameIn(ctx));
  const src = '<a href="https://funerals.org/your-rights/state-by-state-rights/the-9-states-that-restrict-caring-for-your-own-dead/" target="_blank" rel="noopener">Funeral Consumers Alliance</a>';
  if (f.fdRestricted) {
    const [cite, steps] = f.fdRestricted;
    return `<p>${pick(ctx, 'fd', [
      `${n} is one of nine states where a licensed funeral director must be involved in some steps: ${esc(steps)} (${esc(cite)}, as summarized by ${src}). ${An(n)} ${n} family can still do the rest, such as washing and dressing the body or holding a service at home.`,
      `Under ${esc(cite)}, ${n} requires a funeral director for ${esc(steps)}. ${src} lists ${n} among the nine states with this kind of rule; other parts of after-death care can stay with the family.`,
      `Plan on paying a funeral director for at least part of the process in ${n}: state law (${esc(cite)}) reserves ${esc(steps)} for a licensee, according to ${src}.`
    ])}</p>`;
  }
  if (f.cremationNote) return `<p>${esc(f.cremationNote)}</p>`;
  return `<p>${pick(ctx, 'fd', [
    `${src} does not list ${n} among the nine states that require a funeral director for parts of after-death care, so a family may handle much of the work itself. The ${n} death certificate and disposition permit still have to be filed.`,
    `Hiring a funeral home is a choice, not a legal requirement, for most steps in ${n}; ${src} does not count it among the nine states with funeral-director rules. ${n} paperwork and permits still apply.`,
    `${n} is not on the ${src} list of nine states that restrict families from caring for their own dead. You can buy only the services you need, but someone must still file the ${n} death certificate and get the permit.`
  ])}</p>`;
}

function waitP(ctx, f) {
  const n = esc(nameIn(ctx));
  const rule = esc(waitSentence(ctx, f));
  if (ctx.kind === 'cremation-costs-') {
    return `<p>${pick(ctx, 'wait', [`What the law says about timing: ${rule}.`, `Before a cremation can happen: ${rule}.`, `Timing and permits: ${rule}.`])}</p>`;
  }
  if (ctx.kind === 'funeral-costs-') {
    const w = f.waitHours ? `${n} requires a ${f.waitHours}-hour wait before cremation${f.boardRule ? ' under board rules' : ''} (${esc(f.waitCite)})` : `${n} sets no fixed waiting period before cremation, but a permit is needed first (${esc(f.waitCite)})`;
    return `<p>${pick(ctx, 'wait', [`If the family chooses cremation, ${w}.`, `Cremation timing: ${w}.`, `For families comparing a funeral with cremation, note that ${w}.`])}</p>`;
  }
  const w = f.waitHours ? `a ${f.waitHours}-hour wait applies (${esc(f.waitCite)})` : `there is no fixed waiting period, though a permit is required (${esc(f.waitCite)})`;
  return `<p>${pick(ctx, 'wait', [`${An(n)} ${n} burial needs a disposition permit. If you switch to cremation instead, ${w}.`, `A burial in ${n} goes ahead once the permit is issued; for cremation, ${w}.`, `No cremation wait affects a burial, but if plans change to cremation, ${w}.`])}</p>`;
}

function aidP(ctx, f) {
  if (f.aid && ctx.kind === 'burial-costs-') {
    const n = esc(nameIn(ctx));
    const fp = ctx.kind.replace('burial', 'funeral') + ctx.slug + '.html';
    return `<p>${esc(nameIn(ctx))} has a public program that can help pay for a burial when the family cannot (${esc(f.aid.source)}); ${/\$/.test(f.aid.text) ? 'the amounts and deadlines are' : 'how it works is explained'} on our <a href="${esc(fp)}#state-oversight">${esc(nameIn(ctx))} funeral cost page</a>. Ask about it before you buy ${an(n)} ${n} plot, since help may be limited or capped.</p>`;
  }
  if (f.aid) return `<p>${esc(f.aid.text)} (Source: ${esc(f.aid.source)}.)</p>`;
  const n = esc(nameIn(ctx));
  return `<p>${pick(ctx, 'aid', [
    `We have not verified a statewide burial-assistance amount for ${n}. Ask the ${n} county social-services office whether it pays for indigent burial or cremation, and see our <a href="medicaid-funeral-assistance.html">guide to public funeral assistance</a>.`,
    `${n} help with funeral costs, where it exists, is usually run by counties, and we could not confirm a statewide figure. Start with the ${n} county social-services office; our <a href="medicaid-funeral-assistance.html">public assistance guide</a> covers what to ask.`,
    `No verified statewide burial benefit is listed here for ${n}. The county social-services or human-services office in ${n} is the place to ask, and our <a href="medicaid-funeral-assistance.html">assistance guide</a> explains the federal options.`
  ])} ${pick(ctx, 'ssa', [`Social Security pays a one-time $255 to a qualifying surviving spouse or child in ${n}, as in every state.`, `Separately, Social Security pays ${n} survivors $255 once, if they are an eligible spouse or child.`, `The federal Social Security lump sum available in ${n} is $255, paid only to a qualifying spouse or child.`])}</p>`;
}

function veteransP(ctx, f) {
  const n = esc(nameIn(ctx));
  const fmt = c => `${esc(c.name)} (${esc(c.phone)}${c.status === 'Cremation Only' ? ', cremated remains only' : ''})`;
  const nat = f.national.map(fmt);
  const st = f.stateCems.map(fmt);
  if (ctx.kind === 'cremation-costs-') {
    const first = (f.national[0] || f.stateCems[0]);
    return `<p>${pick(ctx, 'vetc', [
      `Cremated remains of an eligible ${n} veteran can be placed in a VA national cemetery columbarium or in-ground site at no charge for the space.`,
      `${An(n)} ${n} veteran who is cremated keeps the same burial benefit: the niche or plot and the marker in a national cemetery cost nothing.`,
      `Choosing cremation does not give up ${an(n)} ${n} veteran's cemetery benefit; urns can be interred in national cemeteries free of charge.`
    ])}${first ? ` One option in ${n} is ${fmt(first)}.` : ''} See <a href="https://www.cem.va.gov/" target="_blank" rel="noopener">cem.va.gov</a>.</p>`;
  }
  if (!nat.length && !st.length) {
    return `<p>Veterans can be buried at no cost for the grave in a VA national cemetery; families in ${n} usually use cemeteries in neighboring states. The <a href="https://www.cem.va.gov/" target="_blank" rel="noopener">VA cemetery locator</a> lists them.</p>`;
  }
  const parts = [];
  if (nat.length) parts.push(`VA national cemeteries accepting burials: ${nat.join('; ')}`);
  if (st.length) parts.push(`state veterans cemeteries: ${st.join('; ')}`);
  const lead = pick(ctx, 'vet', [
    `Eligible ${n} veterans get a grave, opening and closing, a liner and a headstone at no cost in a national cemetery.`,
    `${An(n)} ${n} veteran's grave in a national cemetery costs the family nothing for the plot, opening and closing, or marker.`,
    `For ${n} veterans, the plot and marker in a national cemetery are free, which can remove thousands from a burial bill.`
  ]);
  const alt = f.stateCems.filter(c => c.phoneSource).map(c => ` The ${esc(c.name)} number comes from the <a href="${esc(c.phoneSource)}" target="_blank" rel="noopener">tribe's office directory</a>.`).join('');
  return `<p>${lead} In ${n}, ${parts.join('; ')}. Source: <a href="https://www.cem.va.gov/" target="_blank" rel="noopener">VA National Cemetery Administration</a>.${alt}</p>`;
}

function nextSteps(ctx, f) {
  const n = esc(nameIn(ctx));
  const phone = f.regulator ? esc(f.regulator.phone) : '';
  const cem = f.national[0] || f.stateCems[0];
  const items = [];
  items.push(pick(ctx, 'ns1', [
    `Ask every ${n} provider for its General Price List; the FTC Funeral Rule says they must give it to you.`,
    `Get written price lists from at least two ${n} providers before you agree to anything.`,
    `Request itemized prices from ${n} providers by phone or in person; under the FTC Funeral Rule you only pay for what you choose.`,
    `Compare at least two ${n} providers line by line, using their printed price lists.`
  ]));
  if (ctx.kind === 'cremation-costs-') items.push(f.waitHours ? pick(ctx, 'ns2', [`Allow at least ${f.waitHours} hours after death, plus time for the permit, before the cremation date.`, `Do not expect a cremation date sooner than ${f.waitHours} hours after death in ${n}.`, `Build the ${f.waitHours}-hour legal wait into any travel or memorial plans.`]) : pick(ctx, 'ns2', [`Ask the provider how long the ${n} cremation permit usually takes where you live.`, `Ask which office signs cremation permits in your ${n} county and how long it takes.`, `Confirm who signs the ${n} permit and when, so the memorial date is realistic.`]));
  if (ctx.kind === 'burial-costs-') items.push(pick(ctx, 'ns2', [`Price the ${n} cemetery separately: plot, opening and closing, vault or liner, and marker are often sold apart from the funeral home.`, `Ask the ${n} cemetery for its own price sheet, since grave opening and vault rules vary by cemetery.`, `Check whether the ${n} cemetery requires an outer burial container before you shop for one.`, `Ask whether the ${n} cemetery lets you buy the headstone elsewhere.`]));
  if (ctx.kind === 'funeral-costs-') items.push(pick(ctx, 'ns2', [`Decide early whether you want embalming and a viewing in ${n}; skipping them is often the largest saving.`, `Ask the ${n} funeral home whether embalming is actually needed for your plans.`, `Consider ${an(n)} ${n} memorial service after cremation or burial, which avoids embalming and viewing fees.`]));
  if (f.aid) items.push(pick(ctx, 'ns3', [`If money is short, contact ${esc(f.aid.contact)} before signing a contract.`, `Check eligibility with ${esc(f.aid.contact)} first; some programs refuse claims after a contract is signed.`, `Contact ${esc(f.aid.contact)} early, because deadlines and limits can apply.`]));
  else items.push(pick(ctx, 'ns3', [`If money is short, call the ${n} county social-services office before signing a contract.`, `Ask your ${n} county human-services office about indigent burial help before you commit.`, `Ask about ${n} county help before any contract is signed; it may not be available afterward.`]));
  if (cem && ctx.kind !== 'cremation-costs-') items.push(pick(ctx, 'ns4', [`For a veteran, ask ${esc(cem.name)} about eligibility before buying a private plot.`, `Veterans' families can schedule through the VA's National Cemetery Scheduling Office; ${esc(cem.name)} is listed above.`, `If the person served, ask ${esc(cem.name)} what paperwork it needs, usually starting with the DD214 discharge record.`]));
  if (phone) items.push(pick(ctx, 'ns5', [`Report problems with a provider to the licensing board at ${phone}.`, `Keep the board's number, ${phone}, in case a provider will not honor its price list.`, `A complaint call to ${phone} is free if a provider misleads you.`]));
  return `<h3>${pick(ctx, 'nsh', ['Next steps', 'What to do next', `Next steps in ${n}`])}</h3>\n<ol>\n${items.map(i => `<li>${i}</li>`).join('\n')}\n</ol>`;
}

function stateFactsSectionHtml(ctx) {
  const f = factsFor(ctx);
  const place = esc(ctx.place);
  const title = { 'funeral-costs-': `Funeral rules and help in ${place}`, 'cremation-costs-': `Cremation rules and help in ${place}`, 'burial-costs-': `Burial rules and help in ${place}` }[ctx.kind];
  if (!f) return '';
  let body = [regulatorP(ctx, f), directorP(ctx, f), waitP(ctx, f), aidP(ctx, f), veteransP(ctx, f), nextSteps(ctx, f)].filter(Boolean).join('\n');
  if (f.code === 'DC') {
    body = body.replace(/DC help with funeral costs, where it exists, is usually run by counties, and/g, 'DC has no counties, and')
      .replace(/ county (social-services|human-services)/g, ' $1').replace(/DC county /g, 'DC ').replace(/statewide/g, 'District-wide');
  }
  return `\n<h2 id="state-oversight">${title}</h2>\n${body}\n`;
}

module.exports = { stateFactsSectionHtml, fixWaitClaims, factsFor, nameIn };
