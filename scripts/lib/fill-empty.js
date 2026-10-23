'use strict';
/**
 * Fills FAQ answers and table notes that PR #94's fragment removal left empty.
 * Every sentence is built from data/state-facts.json (sourced) or from federal
 * rules (FTC Funeral Rule, 16 CFR 453; NFDA 2023 medians). The same text is
 * written to the visible answer and to the FAQPage JSON-LD.
 */
const SF = require('./state-facts-section');

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function h(s) { let x = 2166136261; for (const c of s) { x ^= c.codePointAt(0); x = Math.imul(x, 16777619); } return x >>> 0; }
function pick(ctx, key, list) { return list[h(`${ctx.slug}|${ctx.kind}|${key}`) % list.length]; }
function an(w) { return /^[AEIO]/.test(w) || (/^U/.test(w) && !/^U(?:tah|ni|s[aeiou]|r[aeiou])/i.test(w)) ? 'an' : 'a'; }
function An(w) { return an(w) === 'an' ? 'An' : 'A'; }
function unent(s) { return s.replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&'); }

function regLine(ctx, f, n) {
  const r = f.regulator;
  if (!r) return '';
  return pick(ctx, 'q-reg', [
    `Complaints about ${an(n)} ${n} funeral home go to the ${r.org}${r.phone ? ` (${r.phone})` : ''}.`,
    `The ${r.org}${r.phone ? `, ${r.phone},` : ''} licenses ${n} funeral homes and takes complaints.`,
    `You can confirm ${an(n)} ${n} license or file a complaint with the ${r.org}${r.phone ? ` at ${r.phone}` : ''}.`,
  ]);
}
function fdLine(ctx, f, n) {
  if (f.fdRestricted) return `${n} law requires a licensed funeral director for ${f.fdRestricted[1]} (${f.fdRestricted[0]}, per the Funeral Consumers Alliance).`;
  if (f.cremationNote) return f.cremationNote;
  return pick(ctx, 'q-fd', [
    `${n} is not among the nine states the Funeral Consumers Alliance lists as requiring families to hire a funeral director.`,
    `According to the Funeral Consumers Alliance, ${n} does not require families to hire a funeral director for every step.`,
  ]);
}
function waitLine(ctx, f) { return f.waitRule.replace(/[\s.]+$/, '') + ` (${f.waitCite}).`; }

function answer(q, ctx, f) {
  const n = SF.nameIn ? SF.nameIn(ctx) : ctx.name;
  const ql = q.toLowerCase();
  const ftc = pick(ctx, 'q-ftc', [
    `Under the FTC Funeral Rule (16 CFR 453), every ${n} funeral home must give you an itemized General Price List, quote prices by phone, and accept a casket or urn you bought elsewhere without a handling fee.`,
    `The federal FTC Funeral Rule gives ${n} families the right to an itemized price list, to prices over the phone, and to buy only the goods and services they want.`,
    `In ${n}, as everywhere in the US, the FTC Funeral Rule requires an itemized General Price List, phone price quotes, and no fee for using a casket bought elsewhere.`,
  ]);
  if (/embalm/.test(ql)) return [
    `The FTC Funeral Rule bars ${an(n)} ${n} funeral home from saying embalming is required by law when it is not, and its price list must state that embalming is not required except in certain special cases.`,
    pick(ctx, 'q-emb', [`If ${an(n)} ${n} provider says embalming is needed, ask which law or cemetery rule it is citing.`, `Ask any ${n} home that insists on embalming to name the rule in writing.`]),
    regLine(ctx, f, n)];
  if (/rights|ftc|consumer/.test(ql)) return [ftc, fdLine(ctx, f, n), regLine(ctx, f, n)];
  if (/cheaper or more expensive/.test(ql)) return [
    `Compare the ${n} figures in the cost table on this page with the national median of $8,300 for a funeral with viewing and burial, or $6,280 with cremation (NFDA 2023).`,
    pick(ctx, 'q-cmp', [`Prices inside ${n} vary by provider, so the General Price Lists you collect matter more than any average.`, `Individual ${n} funeral homes can sit well above or below the state figure, so get several price lists.`])];
  if (/keep funeral costs down/.test(ql)) return [
    `The biggest savings in ${n} come from choosing direct cremation or immediate burial, skipping embalming and a viewing, and holding a memorial later at a church, park or home instead of the funeral home's chapel.`,
    pick(ctx, 'q-keep', [`Turn down any package that bundles items you don't want; ${an(n)} ${n} funeral home has to let you buy individual goods and services from its price list.`, `Buy the casket, urn or marker from an outside seller if it is cheaper; no ${n} funeral home may refuse it or add a fee.`])];
  if (/cheap funeral home|affordable funeral home|keep funeral costs down/.test(ql)) return [
    pick(ctx, 'q-shop', [`Call several ${n} funeral homes and ask for prices by phone, which the FTC Funeral Rule requires them to give.`, `Ask at least three ${n} providers for their General Price Lists and compare direct cremation and immediate burial lines.`]),
    `Buying the casket or urn elsewhere is allowed under the FTC Funeral Rule, and the ${n} home cannot charge a fee for it.`,
    regLine(ctx, f, n)];
  if (/reduce burial|cheapest burial/.test(ql)) return [
    `Direct (immediate) burial skips embalming, viewing and a ceremony at the funeral home, so it is usually the lowest-cost burial on ${an(n)} ${n} price list.`,
    `You may supply your own casket in ${n}; the FTC Funeral Rule forbids a handling fee for it.`,
    f.aid ? f.aid.text : pick(ctx, 'q-vet', [`Eligible veterans in ${n} can be buried in a VA national cemetery at no cost for the grave, opening and closing, liner and marker.`, `A VA national cemetery burial costs eligible ${n} veterans nothing for the plot, opening and closing, or headstone.`])];
  if (/cemetery prices|shop cemeteries/.test(ql)) return [
    pick(ctx, 'q-cem', [`Each ${n} cemetery sets its own prices for the plot, opening and closing, and any required vault or liner.`, `${n} cemeteries price plots, opening and closing, and vault rules separately, so ask each one for a written price list.`]),
    `The FTC Funeral Rule covers funeral homes, not most cemeteries, so ${an(n)} ${n} cemetery may not be required to give an itemized price list; ask for one anyway.`,
    f.national && f.national.length ? `VA national cemeteries in ${n} include ${f.national.map(c => c.name).slice(0, 2).join(' and ')}.` : ''];
  if (/rules for cremation|cremation regulations/.test(ql)) return [
    f.waitHours
      ? `In short, ${n} sets a ${f.waitHours}-hour minimum before cremation, and the crematory also needs the death certificate, a cremation permit and a signed authorization from the next of kin or designated agent.`
      : `In short, ${n} has no fixed minimum waiting period, but the crematory still needs the death certificate, a cremation permit and a signed authorization from the next of kin or designated agent before it can proceed.`,
    pick(ctx, 'q-rules', [`The statute behind the ${n} timing rule, whether a funeral director must be involved, and the licensing board's phone number are listed in the cremation rules section further down this page.`, `For the exact ${n} citation, the funeral-director question and who takes complaints, see the cremation rules and help section lower on this page.`])];
  if (/ceremony before cremation/.test(ql)) return [
    `Yes. ${An(n)} ${n} family can hold a viewing or service before cremation, and many providers rent a casket for it.`,
    `Plan the date around the law: ${waitLine(ctx, f)}`];
  if (/types of cremation/.test(ql)) return [
    `Most ${n} providers offer direct cremation (no service) and cremation with a memorial or viewing.`,
    `Alkaline hydrolysis (water cremation) is legal only in some states, so ask ${an(n)} ${n} provider whether it is offered.`,
    waitLine(ctx, f)];
  if (/cremation rate|choose cremation/.test(ql)) return [
    `Cost is a major reason: the national median for a funeral with cremation is $6,280 versus $8,300 with burial (NFDA 2023), and direct cremation in ${n} costs less than either.`,
    `Cremation also avoids buying ${an(n)} ${n} cemetery plot unless the family wants one.`];
  return null;
}

function fillEmpty(html, ctx) {
  const f = SF.factsFor(ctx);
  if (!f) return html;
  const n = SF.nameIn ? SF.nameIn(ctx) : ctx.name;
  // Never repeat a sentence on one page: skip any part already used in another
  // filled answer or already present in the page text.
  const used = new Set();
  const pageText = unent(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
  html = html.replace(/<summary>([^<]*)<\/summary><div class="faq-answer"><\/div>/g, (m, qh) => {
    const q = unent(qh);
    const parts = answer(q, ctx, f);
    if (!parts) return m;
    let keep = parts.filter(Boolean).filter(p => !used.has(p) && !pageText.includes(p));
    if (!keep.length) keep = parts.filter(Boolean).filter(p => !used.has(p)).slice(0, 1);
    if (!keep.length) return m;
    keep.forEach(p => used.add(p));
    const text = keep.join(' ');
    const jq = JSON.stringify(q).slice(1, -1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`("name"\\s*:\\s*"${jq}"\\s*,\\s*"acceptedAnswer"\\s*:\\s*\\{\\s*"@type"\\s*:\\s*"Answer"\\s*,\\s*"text"\\s*:\\s*)"(?:[^"\\\\]|\\\\.)*"`);
    html = html.replace(re, (_, a) => a + JSON.stringify(text).replace(/<\//g, '<\\/'));
    return `<summary>${qh}</summary><div class="faq-answer"><p>${esc(text)}</p></div>`;
  });
  const wait = f.waitHours ? `${n} requires a ${f.waitHours}-hour wait first (${f.waitCite})` : `${n} needs a permit but sets no fixed wait (${f.waitCite})`;
  const notes = {
    'Direct cremation': `Cremation with no viewing or service; ${wait}.`,
    'Direct burial': pick(ctx, 'td-db', [`Burial soon after death without embalming or viewing; the ${n} cemetery charges for the plot and opening separately.`, `No embalming or viewing; ${n} cemetery plot, opening and closing are billed apart.`]),
    'Green burial': pick(ctx, 'td-gb', [`No embalming and a biodegradable shroud or casket; ask which ${n} cemeteries allow it.`, `Natural burial without embalming or a vault, where ${an(n)} ${n} cemetery permits it.`]),
  };
  html = html.replace(/(<tr><td>(?:<strong>)?(?:<a [^>]*>)?([^<]+)(?:<\/a>)?(?:<\/strong>)?<\/td><td class="cost-value">[^<]*<\/td><td data-state-fact="1">)(<\/td>)/g,
    (m, a, label, c) => (notes[label] ? a + esc(notes[label]) + c : m));
  const has = (u) => html.split('<main')[1] ? html.split('<main')[1].includes(u) : html.includes(u);
  const lis = (arr) => '\n' + arr.filter(Boolean).map(t => `        <li data-state-fact="1">${t}</li>`).join('\n') + '\n      ';
  const office = f.aid && f.aid.contact ? esc(f.aid.contact) : `the ${n} county social services office`;
  html = html.replace(/(<h2 id="payment-help">Payment Assistance in [^<]*<\/h2>\s*<ul>)\s*(<\/ul>)/, (m, a, c) => a + lis([
    pick(ctx, 'pa-office', [`If the family cannot pay, call ${office} before signing with a funeral home, since public help may require approval first and is often limited to the lowest-cost option.`, `Talk to ${office} before any ${n} contract is signed: public burial help often has to be approved in advance and usually covers only a basic burial or cremation.`, `Families in ${n} who have no money for a funeral should reach ${office} first; signing with a provider before the office approves can cost you the help.`]),
    pick(ctx, 'pa-ssa', [`The $255 Social Security death payment goes only to an eligible surviving spouse or child; in ${n}, as elsewhere, they apply by calling 1-800-772-1213 within two years of the death.`, `To collect the one-time $255 from Social Security, a ${n} widow, widower or eligible child must call 1-800-772-1213, and the claim has to be made within two years.`, `Funeral homes in ${n} usually report the death to Social Security, but the $255 lump sum still has to be claimed by the spouse or child (1-800-772-1213, within two years).`]),
    pick(ctx, 'pa-va', [`Whoever paid for a veteran's funeral in ${n} can file VA Form 21P-530EZ; for a death on or after October 1, 2026 that was not service-connected, VA pays up to $1,032 toward burial and $1,032 toward a plot (see our <a href="veteran-burial-benefits.html">veteran burial benefits guide</a>).`, `For a ${n} veteran, the person who covered the funeral bill claims the VA allowance on Form 21P-530EZ: up to $1,032 for burial plus $1,032 for a plot when a non-service-connected death falls on or after October 1, 2026. Eligibility rules for ${n} families are in our <a href="veteran-burial-benefits.html">veteran burial benefits guide</a>.`, `VA reimburses part of a ${n} veteran's funeral through Form 21P-530EZ, filed by whoever paid; deaths not connected to service on or after October 1, 2026 qualify for up to $1,032 for burial and $1,032 for the plot, as our <a href="veteran-burial-benefits.html">veteran burial benefits guide</a> explains.`]),
    `More options for ${n} families, including Medicaid and charity help, are in our <a href="funeral-payment-assistance.html">funeral payment assistance guide</a> and <a href="how-to-pay-for-a-funeral-with-no-money.html">how to pay for a funeral with no money</a>.`,
  ]) + c);
  html = html.replace(/(<h2>What to Know Before Choosing Cremation in [^<]*<\/h2>\s*<p>[^<]*<\/p>\s*<ul>)\s*(<\/ul>)/, (m, a, c) => a + lis([
    `Get the ${n} provider's General Price List before you agree to anything; the direct cremation line must state what it includes, and the price should cover transport, the cremation itself and a basic container for the ashes.`,
    `${An(n)} ${n} provider offering direct cremation must let you use an unfinished wood box or other alternative container instead of a casket (FTC Funeral Rule, 16 CFR 453.3(b)).`,
    pick(ctx, 'cr-ret', [`Ask how long the ${n} crematory usually takes to return the ashes once the permit is issued, and whether the quoted price includes delivery or only pickup.`, `Before signing, ask the ${n} provider when the ashes will be ready, how they are returned, and whether a certified copy of the death certificate is in the price.`]),
    `You can buy the urn anywhere and the ${n} provider cannot charge a handling fee; compare options in our <a href="urn-buying-guide.html">urn buying guide</a>.`,
  ]) + c);
  if (ctx.kind === 'burial-costs-' && !(has('best-online-casket-retailers.html') && has('headstone-monument-costs.html') && has('funeral-payment-assistance.html')))
    html = html.replace(/<h2(?: id="faq")?>Frequently Asked Questions<\/h2>|<h2 id="faq">/, (hd) => `<p>Before buying a casket or marker for ${an(n)} ${n} burial, compare prices in our <a href="best-online-casket-retailers.html">online casket retailer guide</a> and <a href="headstone-monument-costs.html">headstone cost guide</a>, and check the <a href="funeral-payment-assistance.html">payment assistance guide</a> for help with ${n} costs.</p>\n${hd}`);
  return html;
}
module.exports = { fillEmpty };
