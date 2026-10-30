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

const CEM_NOTES = require('../../data/cemetery-notes.json');
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
  const f = FACTS[stateName(ctx)] || null;
  // Metro pages (e.g. Indianapolis, Memphis) carry their own written aid lines so they do
  // not repeat the state page word for word (data/state-facts.json aid.metro).
  const m = f && f.aid && f.aid.metro && ctx && f.aid.metro[ctx.slug];
  return m ? Object.assign({}, f, { aid: Object.assign({}, f.aid, m) }) : f;
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
    t += {
      'funeral-costs-': ' Individual funeral directors, embalmers and cremationists have not needed a Colorado license so far; Senate Bill 24-173 (C.R.S. 12-135-501) requires one starting January 1, 2027, and practitioners without the new qualifications can apply for a provisional license before then.',
      'cremation-costs-': ' The person running a Colorado cremation has not needed an individual license so far; under Senate Bill 24-173 (C.R.S. 12-135-501), cremationists must be licensed from January 1, 2027, or hold a provisional license applied for before that date.',
      'burial-costs-': ' From January 1, 2027, Senate Bill 24-173 (C.R.S. 12-135-501) requires the funeral directors and embalmers who handle Colorado burials to hold an individual license, with a provisional license for those who apply before then without the new qualifications.'
    }[ctx.kind];
  }
  return `<p>${t}</p>`;
}

const FCA = '<a href="https://funerals.org/your-rights/state-by-state-rights/the-9-states-that-restrict-caring-for-your-own-dead/" target="_blank" rel="noopener">Funeral Consumers Alliance</a>';
const VA_NCA = '<a href="https://www.cem.va.gov/" target="_blank" rel="noopener">VA National Cemetery Administration</a>';
const VA_SCHED = '<a href="https://www.va.gov/burials-memorials/schedule-a-burial/" target="_blank" rel="noopener">National Cemetery Scheduling Office</a>';
const { tableFigures, money } = require('./state-data');

/** Dollar figures from the page's own tables (falls back to the state row). */
function figs(ctx) {
  const t = ctx.html ? tableFigures(ctx.html) : {};
  const get = (...keys) => { for (const k of keys) if (t[k]) return t[k]; return null; };
  return {
    f: get('traditional funeral with burial', 'funeral service (includes basic services and professional services)', 'traditional funeral') || ctx.f,
    dc: get('direct cremation') || ctx.dc,
    plot: get('cemetery plot', 'cemetery / burial plot') || ctx.b,
    open: get('opening & closing grave'),
    vault: get('burial vault / liner')
  };
}

// Round 4: every paragraph below is written for one page type (funeral,
// cremation or burial), so a state's three pages never share a sentence, and
// each sentence carries the state's own name, statute, office or figure.
function directorP(ctx, f) {
  const n = esc(nameIn(ctx));
  const k = ctx.kind;
  const g = figs(ctx);
  if (f.fdRestricted) {
    const [cite0, steps0] = f.fdRestricted;
    const cite = esc(cite0), steps = esc(steps0);
    if (k === 'funeral-costs-') return `<p>${n} is one of nine states where a licensed funeral director must be involved in some steps: ${steps} (${cite}, as summarized by ${FCA}). ${An(n)} ${n} family can still do the rest of a funeral itself, such as washing and dressing the body or holding the service at home.</p>`;
    if (k === 'cremation-costs-') return `<p>For a cremation in ${n}, state law (${cite}) reserves ${steps} for a licensed funeral director, according to the ${FCA}, so even the ${money(g.dc)} direct cremation in the table runs through a licensee.</p>`;
    if (/^arranging a cremation$/.test(steps0)) return `<p>The ${n} funeral-director requirement that the ${FCA} lists (${cite}) covers arranging a cremation, not a burial; for a burial, ask the ${n} cemetery what it needs from the family before the date is set.</p>`;
    return `<p>A burial in ${n} cannot be handled entirely by the family: ${cite} requires a licensed funeral director for ${steps}, as the ${FCA} summarizes it, while the ${n} cemetery itself opens and closes the grave.</p>`;
  }
  if (f.cremationNote) {
    if (k === 'funeral-costs-') return `<p>${esc(f.cremationNote)}</p>`;
    if (k === 'cremation-costs-') return `<p>Every cremation in ${n} has to be arranged through a funeral establishment licensed by the ${esc(f.regulator.org)} (Ala. Code § 34-13-121(b)), so the ${money(g.dc)} direct cremation in the table is bought from a licensed establishment rather than from a crematory alone.</p>`;
    return `<p>The ${n} rule that a licensed funeral establishment arrange the disposition applies to cremation (Ala. Code § 34-13-121(b)); ${n} does not make families hire a funeral director for every arrangement, so ask the cemetery what it needs for a burial.</p>`;
  }
  const v = {
    'funeral-costs-': [
      `The ${FCA} does not list ${n} among the nine states that require a funeral director for parts of after-death care, so ${an(n)} ${n} family may arrange much of a funeral itself. The ${n} death certificate and disposition permit still have to be filed.`,
      `Hiring a funeral home is a choice, not a legal requirement, for most steps of a funeral in ${n}; the ${FCA} does not count ${n} among the nine states with funeral-director rules, and you can buy only the services you want.`
    ],
    'cremation-costs-': [
      `${n} is not among the nine states the ${FCA} lists as requiring a funeral director, but no ${n} crematory will proceed without the death certificate, the cremation permit and the next of kin's signed authorization.`,
      `Because ${n} is not on the ${FCA} list of nine states that restrict family-directed care, the family may deal with ${an(n)} ${n} crematory directly once the cremation permit has been issued.`
    ],
    'burial-costs-': [
      `Because the ${FCA} does not count ${n} among the nine states that require a funeral director, ${an(n)} ${n} family may arrange a burial without one; the cemetery still sets its own rules for the grave, and the burial permit must be in hand.`,
      `${n} does not require a funeral director for a burial, by the ${FCA}'s count of the nine states that do, so the family can work with ${an(n)} ${n} cemetery directly on the plot, the grave opening and the container it accepts.`
    ]
  }[k];
  return `<p>${pick(ctx, 'fd', v)}</p>`;
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
  // Every jurisdiction now has an individually written, sourced aid entry in
  // data/state-facts.json (text / cremation / burial, sources in the r4 README);
  // there is no templated "county" fallback any more.
  if (!f.aid) return '';
  const k = ctx.kind;
  const t = k === 'burial-costs-' ? (f.aid.burial || f.aid.text) : k === 'cremation-costs-' ? (f.aid.cremation || f.aid.text) : f.aid.text;
  const src = f.aid.srcUrl ? `<a href="${esc(f.aid.srcUrl)}" target="_blank" rel="noopener">${esc(f.aid.source)}</a>` : esc(f.aid.source);
  // The live pages for these jurisdictions already carry the Social Security $255 line
  // after the aid sentence; it is kept (tied to this page's own table figure) so no page
  // loses it. It is not added to states whose live page never had it.
  if (!SSA_LIVE.has(f.code)) return `<p>${esc(t)} (Source: ${src}.)</p>`;
  const g = figs(ctx);
  const n = esc(nameIn(ctx));
  const ssa = pick(ctx, 'ssa', {
    'funeral-costs-': [
      `Social Security's one-time $255 death payment, paid only to a qualifying spouse or child, is small next to the ${money(g.f)} average ${n} funeral in the table.`,
      `The $255 Social Security lump sum goes only to an eligible spouse or child and must be claimed within two years; it does not go to the ${n} funeral home.`
    ],
    'cremation-costs-': [
      `The $255 Social Security death payment to a qualifying ${n} spouse or child would cover only part of the ${money(g.dc)} direct cremation estimate above.`,
      `Social Security's $255 lump sum is paid only to an eligible ${n} spouse or child, and only if claimed within two years of the death.`
    ],
    'burial-costs-': [
      `Social Security's $255 payment to a surviving spouse or child is well short of the ${money(g.plot)} ${n} plot estimate on this page.`,
      `A surviving spouse or child may claim Social Security's one-time $255 death payment within two years; it is paid to them, not to the ${n} cemetery.`
    ]
  }[k]);
  return `<p>${esc(t)} (Source: ${src}.) ${ssa}</p>`;
}
const SSA_LIVE = new Set(["AL","AK","AZ","AR","CO","DE","DC","FL","GA","HI","ID","IA","KS","KY","LA","ME","MD","MS","MO","MT","NE","NV","NH","NM","NC","ND","OK","OR","RI","SC","SD","TN","UT","VT","VA","WA","WV","WY"]);

function plotCem(f) {
  const all = f.national.concat(f.stateCems);
  return all.find(c => c.name === f.plotCem) || all.find(c => c.status === 'Open');
}

function veteransP(ctx, f) {
  const n = esc(nameIn(ctx));
  const fmt = c => `${esc(c.name)} (${c.tribal ? 'tribal, ' : ''}${esc(c.phone)}${c.status === 'Cremation Only' ? ', cremated remains only' : ''})`;
  const tribal = f.stateCems.some(c => c.tribal);
  const allTribal = f.stateCems.length > 0 && f.stateCems.every(c => c.tribal);
  const kindLabel = allTribal ? 'tribal' : tribal ? 'state and tribal' : 'state-run';
  const nat = f.national.map(fmt);
  const st = f.stateCems.map(fmt);
  if (ctx.kind === 'cremation-costs-') {
    // Lead with the default cemetery (never a statewide Barrancas), then the rest.
    const lead = plotCem(f);
    const opts = lead ? [lead].concat(f.national.concat(f.stateCems).filter(c => c !== lead)) : [];
    return `<p>${pick(ctx, 'vetc', [
      `Cremated remains of an eligible ${n} veteran can be placed in a VA national cemetery columbarium or in-ground site at no charge for the space.`,
      `${An(n)} ${n} veteran who is cremated keeps the same burial benefit: the niche or plot and the marker in a national cemetery cost nothing.`,
      `Choosing cremation does not give up ${an(n)} ${n} veteran's cemetery benefit; urns can be interred in national cemeteries free of charge.`
    ])}${opts.length === 1 ? ` The one option in ${n} is ${fmt(opts[0])}.` : opts.length ? ` Options in ${n} include ${((a) => a.length > 2 ? a.slice(0, -1).join(', ') + ', and ' + a[a.length - 1] : a.join(' and '))(opts.slice(0, 3).map(fmt))}.` : ''} See <a href="https://www.cem.va.gov/" target="_blank" rel="noopener">cem.va.gov</a>.</p>`;
  }
  if (f.code === 'DC' && ctx.kind === 'funeral-costs-') {
    return `<p>Veterans can be buried at no cost for the grave in a VA national cemetery, but the only VA site in the District, the Congressional Cemetery government lots, is closed, so the closest VA-run option is Quantico National Cemetery in Virginia. The Army runs Arlington, in Virginia, and the Soldiers&rsquo; and Airmen&rsquo;s Home National Cemetery, in the District; most veterans with honorable service qualify for above-ground inurnment at <a href="https://www.arlingtoncemetery.mil/Funerals/Scheduling-a-Funeral/Establishing-Eligibility" target="_blank" rel="noopener">Arlington National Cemetery</a>, but in-ground burial there has stricter rules. A DC funeral home books a VA grave through the ${VA_SCHED} (800-535-1117).</p>`;
  }
  if (f.code === 'DC' && ctx.kind === 'burial-costs-') {
    return `<p>Veterans can be buried at no cost for the grave in a VA national cemetery; VA has no national cemetery with open burial space inside the District itself (its Congressional Cemetery government lots are closed). The <a href="https://www.cem.va.gov/" target="_blank" rel="noopener">VA cemetery locator</a> lists the nearest open ones, including Quantico National Cemetery in Virginia.</p>`;
  }
  if (!nat.length && !st.length) {
    if (ctx.kind === 'funeral-costs-') return `<p>A funeral home can book a veteran's burial in a VA national cemetery through the ${VA_SCHED} (800-535-1117); families in ${n} usually use cemeteries in neighboring states, which the <a href="https://www.cem.va.gov/" target="_blank" rel="noopener">VA cemetery locator</a> lists.</p>`;
    return `<p>Veterans can be buried at no cost for the grave in a VA national cemetery; families in ${n} usually use cemeteries in neighboring states. The <a href="https://www.cem.va.gov/" target="_blank" rel="noopener">VA cemetery locator</a> lists them.</p>`;
  }
  const alt = f.stateCems.filter(c => c.phoneSource).map(c => ctx.kind === 'funeral-costs-' ? ` We took the ${esc(c.name)} phone number from the <a href="${esc(c.phoneSource)}" target="_blank" rel="noopener">tribe's office directory</a>.` : ` The ${esc(c.name)} number comes from the <a href="${esc(c.phoneSource)}" target="_blank" rel="noopener">tribe's office directory</a>.`).join('');
  if (ctx.kind === 'funeral-costs-') {
    const one = fmt;
    const join = a => a.length > 1 ? a.slice(0, -1).join(', ') + (a.length > 2 ? ',' : '') + ' or ' + a[a.length - 1] : a[0];
    const out = [];
    // A metro page names its city so it does not repeat the state page's sentence.
    const who = ctx.place && ctx.place.includes(', ') && !/^Washington, DC$/.test(ctx.place) ? esc(ctx.place.split(', ')[0]) : n;
    if (f.national.length) out.push(`${An(who)} ${who} funeral home can reserve a veteran's grave at ${join(f.national.map(one))} through the VA's ${VA_SCHED} (800-535-1117).`);
    if (f.stateCems.length) out.push(`${f.national.length ? `The ${kindLabel}` : `${n}'s ${kindLabel}`} ${f.stateCems.length > 1 ? 'veterans cemeteries' : 'veterans cemetery'}, ${join(f.stateCems.map(one))}, ${f.stateCems.length > 1 ? 'take' : 'takes'} requests directly${f.national.length ? '' : `, and the VA supplies the veteran's headstone or marker there at no charge`}.`);
    return `<p>${out.join(' ')}${alt}</p>`;
  }
  const parts = [];
  if (nat.length) parts.push(`VA national cemeteries accepting burials: ${nat.join('; ')}`);
  if (st.length) parts.push(`${allTribal ? 'tribal' : tribal ? 'state and tribal' : 'state'} ${st.length > 1 ? 'veterans cemeteries' : 'veterans cemetery'}: ${st.join('; ')}`);
  const lead = pick(ctx, 'vet', [
    `Eligible ${n} veterans get a grave, opening and closing, a liner and a headstone at no cost in a national cemetery.`,
    `${An(n)} ${n} veteran's grave in a national cemetery costs the family nothing for the plot, opening and closing, or marker.`,
    `For ${n} veterans, the plot and marker in a national cemetery are free, which can remove thousands from a burial bill.`
  ]);
  return `<p>${lead} In ${n}, ${parts.join('; ')} (source: ${VA_NCA}).${alt}</p>`;
}

function nextSteps(ctx, f) {
  const n = esc(nameIn(ctx));
  const phone = f.regulator ? esc(f.regulator.phone) : '';
  const cem = plotCem(f);
  const k = ctx.kind;
  const has = t => (ctx.html || '').includes(esc(t));
  const items = [];
  if (k === 'funeral-costs-') {
    items.push(pick(ctx, 'ns1', [
      `Ask every ${n} funeral home for its General Price List; the FTC Funeral Rule says it must give you one when you ask in person.`,
      `Get written price lists from at least two ${n} funeral homes before you agree to anything.`,
      `Request itemized prices from ${n} funeral homes by phone or in person; under the FTC Funeral Rule you only pay for what you choose.`,
      `Compare at least two ${n} funeral homes line by line, using their printed price lists.`
    ]));
    items.push(pick(ctx, 'ns2', [`Decide early whether you want embalming and a viewing in ${n}; skipping them is often the largest saving.`, `Ask the ${n} funeral home whether embalming is actually needed for your plans.`, `Consider ${an(n)} ${n} memorial service after cremation or burial, which avoids embalming and viewing fees.`]));
    // Individually written per-state step (data/state-facts.json aid.stepF); skipped when
    // the payment-help list above already carries it.
    if (f.aid && f.aid.stepF) items.push(esc(f.aid.stepF));
    if (cem) items.push(pick(ctx, 'ns4', [`For a veteran, price ${esc(cem.name)} against a private ${n} plot before choosing.`, `If the person served, have the funeral home ask about ${esc(cem.name)} before you buy a private plot.`]));
    if (phone) items.push(pick(ctx, 'ns5', [`Report a funeral home that hides or ignores its price list to the board at ${phone}.`, `Keep the board's number, ${phone}, in case a funeral home will not honor its price list.`]));
  } else if (k === 'cremation-costs-') {
    items.push(pick(ctx, 'ns1', [
      `Get written cremation prices from at least two ${n} providers and compare what each direct cremation price includes.`,
      `Ask ${n} cremation providers to itemize transport, the container and the crematory fee before you choose one.`,
      `Ask whether ${an(n)} ${n} cremation price includes the death certificates and the permit fee, which some providers bill separately.`
    ]));
    items.push(f.waitHours
      ? pick(ctx, 'ns2', [`Allow at least ${f.waitHours} hours after death in ${n}, plus time for the permit, before the cremation date.`, `Build the ${f.waitHours}-hour wait set by ${esc(f.waitCite)} into any ${n} travel or memorial plans.`])
      : pick(ctx, 'ns2', [`Ask which office signs ${n} cremation permits where the death occurred, and how long it takes.`, `Confirm who signs the ${n} cremation permit and when, so the memorial date is realistic.`]));
    if (f.aid && f.aid.stepC) items.push(esc(f.aid.stepC));
    if (phone) items.push(pick(ctx, 'ns5', [`A cremation provider that misstates its prices can be reported at ${phone}.`, `Note the board's number, ${phone}, before you pay a cremation provider.`]));
  } else {
    items.push(pick(ctx, 'ns1', [
      `Get the funeral home's General Price List and the ${n} cemetery's own price sheet before you agree to a burial.`,
      `Compare at least two ${n} cemeteries as well as two funeral homes, since the plot, grave opening and marker are priced separately.`,
      `Price the ${n} cemetery separately: plot, opening and closing, vault or liner, and marker are often sold apart from the funeral home.`
    ]));
    items.push(pick(ctx, 'ns2', [`Ask the ${n} cemetery whether it requires an outer burial container before you shop for one.`, `Ask whether the ${n} cemetery lets you buy the headstone elsewhere.`, `Ask the ${n} cemetery for its rules on grave opening times, vaults and markers.`]));
    if (f.aid && f.aid.stepB) items.push(esc(f.aid.stepB));
    if (cem) items.push(pick(ctx, 'ns4', [`For a veteran, ask ${esc(cem.name)} about eligibility before buying a private plot.`, `If the person served, ask ${esc(cem.name)} what paperwork it needs, usually starting with the DD214 discharge record.`]));
    if (phone) items.push(pick(ctx, 'ns5', [`Report a funeral home that misprices a burial to the board at ${phone}.`, `A complaint call to ${phone} is free if a funeral home misleads you about burial costs.`]));
  }
  const head = { 'funeral-costs-': `Next steps for a funeral in ${n}`, 'cremation-costs-': `Next steps for a cremation in ${n}`, 'burial-costs-': `Next steps for a burial in ${n}` }[k];
  return `<h3>${head}</h3>\n<ol>\n${items.map(i => `<li>${i}</li>`).join('\n')}\n</ol>`;
}

function stateFactsSectionHtml(ctx) {
  // Hand-written override for a page (data/overrides/{file-slug}.html), used
  // instead of the generated rules-and-help section and its next-steps list.
  // The file must open with <h2 id="state-oversight">. Pages without one are
  // unchanged.
  const ov = path.join(__dirname, '..', '..', 'data', 'overrides', `${ctx.kind}${ctx.slug}.html`);
  if (fs.existsSync(ov)) return `\n${fs.readFileSync(ov, 'utf8').trim()}\n`;
  const f = factsFor(ctx);
  const place = esc(ctx.place);
  const title = { 'funeral-costs-': `Funeral rules and help in ${place}`, 'cremation-costs-': `Cremation rules and help in ${place}`, 'burial-costs-': `Burial rules and help in ${place}` }[ctx.kind];
  if (!f) return '';
  // Page-specific cemetery note (data/cemetery-notes.json; VA listings), added inside the veterans paragraph.
  const note = CEM_NOTES[ctx.kind + ctx.slug];
  const vet = veteransP(ctx, f);
  const vetP = note && vet ? vet.replace(/<\/p>$/, ` ${esc(note)}</p>`) : vet;
  let body = [regulatorP(ctx, f), directorP(ctx, f), waitP(ctx, f), aidP(ctx, f), vetP, nextSteps(ctx, f)].filter(Boolean).join('\n');
  return `\n<h2 id="state-oversight">${title}</h2>\n${body}\n`;
}

module.exports = { stateFactsSectionHtml, fixWaitClaims, factsFor, nameIn };
