'use strict';
/**
 * Round 4: state-specific rewrites of generator template sentences that are
 * frozen in the state pages (generate-pages.js never overwrites an existing
 * page, so its old template text has to be rewritten here, at build time).
 *
 * Each rule matches one template frame and rebuilds the sentence from the
 * page's own state: its name, the law and offices in data/state-facts.json,
 * the cities and cremation rate in the generate-pages.js state row, and the
 * dollar figures in the page's own cost tables. Rules only match the old
 * wording, so a second build leaves the page unchanged.
 *
 * Sources for the non-state facts used below:
 * - 63.4% national cremation rate: NFDA 2025 Cremation & Burial Report
 *   (the figure the site already uses sitewide).
 * - $8,300 national median: NFDA 2023 General Price List study (already on
 *   every funeral page).
 * - FTC Funeral Rule (16 CFR Part 453): itemized prices, alternative
 *   containers for cremation, and the right to use a casket or urn bought
 *   elsewhere without a handling fee.
 * - Social Security lump-sum death payment: $255, spouse or eligible child,
 *   apply within 2 years (ssa.gov, 20 CFR 404.621).
 * - VA national cemeteries accept cremated remains of eligible veterans at no
 *   charge (cem.va.gov).
 */
const fs = require('fs');
const path = require('path');
const { stateRows, tableFigures, money, num } = require('./state-data');

const FACTS = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'state-facts.json'), 'utf8'));
const NATIONAL_CR = 63.4;
const KINDS = ['funeral-costs-', 'cremation-costs-', 'burial-costs-'];

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function ctxFor(file) {
  const kind = KINDS.find(k => file.startsWith(k));
  if (!kind) return null;
  const slug = file.slice(kind.length).replace(/\.html$/, '');
  const rows = stateRows();
  let row = rows[slug], name;
  if (row) name = row.name;
  else if (slug === 'washington-dc') { name = 'District of Columbia'; row = null; }
  else return null;
  const f = FACTS[name];
  if (!f) return null;
  return { kind, slug, name, n: name === 'District of Columbia' ? 'DC' : name, row, f };
}

function figures(html, c) {
  const t = tableFigures(html);
  const get = (...keys) => { for (const k of keys) if (t[k]) return t[k]; return null; };
  return {
    f: get('traditional funeral with burial', 'traditional funeral', 'funeral service') || (c.row && c.row.f),
    dc: get('direct cremation') || (c.row && c.row.dc),
    c: get('cremation with service', 'funeral with cremation', 'cremation + memorial') || (c.row && c.row.c),
    db: get('direct burial'),
    plot: get('cemetery plot', 'cemetery / burial plot'),
    vault: get('burial vault / liner'),
    open: get('opening & closing grave'),
    casket: get('casket')
  };
}

function rateVsNational(cr) {
  const d = Math.round((cr - NATIONAL_CR) * 10) / 10;
  if (Math.abs(d) < 1) return `close to the ${NATIONAL_CR}% national rate`;
  return `${Math.abs(d)} points ${d > 0 ? 'above' : 'below'} the ${NATIONAL_CR}% national rate`;
}

// Every cemetery name in data/state-facts.json, longest first, for re-pointing old sentences.
const ALL_CEMS = (() => { const d = require('../../data/state-facts.json'); const a = new Set(); for (const k in d) for (const c of (d[k].national || []).concat(d[k].stateCems || [])) a.add(c.name); return [...a].sort((x, y) => y.length - x.length); })();

function rulesFor(c, g) {
  const { n, f } = c;
  const cr = c.row ? c.row.cr : null;
  const reg = f.regulator ? `the ${esc(f.regulator.org)} (${esc(f.regulator.phone)})` : null;
  const cem = (f.national || []).concat(f.stateCems || []).find(x => x.name === f.plotCem) || (f.national || []).concat(f.stateCems || [])[0];
  // Default cemetery: data/state-facts.json plotCem (never a cremation-only site, never Barrancas for all of Florida).
  const cemAny = (f.national || []).concat(f.stateCems || []).find(x => x.name === f.plotCem) || (f.national || []).concat(f.stateCems || []).find(x => x.status === 'Open');
  const cite = esc(f.waitCite);
  const waitShort = f.waitHours
    ? `the ${f.waitHours}-hour wait ${n} requires after death (${cite})`
    : `the ${n} cremation permit (${n} sets no fixed waiting period; ${cite})`;
  const firstCity = c.row && c.row.cities[0];
  const R = [];
  const add = (re, fn) => R.push([re, fn]);

  // ---------- cremation pages ----------
  add(/Direct cremation at (\$[\d,]+) moves fastest since there is no viewing or service to schedule beforehand\./g,
    (m, x) => `Direct cremation at ${x} moves fastest: with no viewing or service to schedule, the only wait is ${waitShort}.`);
  add(/Direct cremation \((\$[\d,]+)\) has the shortest total timeline since no viewing or ceremony is involved\./g,
    (m, x) => f.waitHours
      ? `Direct cremation (${x}) has the shortest timeline because no viewing or ceremony is involved, though ${n} law still requires ${f.waitHours} hours to pass after death (${cite}).`
      : `Direct cremation (${x}) has the shortest timeline because no viewing or ceremony is involved; ${n} sets no minimum wait, so the permit is the main step (${cite}).`);
  add(/A direct cremation \((\$[\d,]+)\) is the fastest end-to-end because no ceremony sits between death and cremation\./g,
    (m, x) => `A direct cremation (${x}) is the fastest end-to-end because nothing but ${waitShort} sits between death and cremation.`);
  add(/Direct cremation at (\$[\d,]+) is the simplest — no service, no viewing, body cremated and ashes returned\./g,
    (m, x) => `Direct cremation at ${x} is the simplest ${n} tier: no service or viewing, the body cremated and the ashes returned.`);
  add(/Traditional cremation at (\$[\d,]+) is a full funeral home service followed by cremation\./g,
    (m, x) => g.dc ? `Traditional cremation at ${x} adds a full funeral home service before the cremation, ${money(num(x) - g.dc)} more than the direct tier in ${n}.` : m);
  add(/Only direct cremation at (\$[\d,]+) omits the service entirely\./g,
    (m, x) => `Of the ${n} prices above, only direct cremation at ${x} omits the service entirely.`);
  add(/Factors driving cremation adoption include lower cost compared to traditional burial \(an estimated (\$[\d,]+) less\), greater flexibility for memorial services, environmental considerations, and changing cultural preferences\./g,
    (m, x) => cr ? `In ${n}, cremation costs an estimated ${x} less than a traditional burial and leaves the memorial date open; the state's ${cr}% cremation rate is ${rateVsNational(cr)} that NFDA projected for 2025.` : m);
  add(/The state's cremation rate — currently (\d+)% — reflects a steady national shift toward simpler, lower-cost services\./g,
    (m, x) => `${n}'s cremation rate, currently ${x}%, is ${rateVsNational(+x)} NFDA projected for 2025.`);
  add(/The total depends on the level of service you choose\./g,
    () => g.dc && g.c ? `Before those extras, the ${n} base ranges from ${money(g.dc)} for direct cremation to ${money(g.c)} with a service.` : `The ${n} total depends on the level of service you choose.`);
  add(/Pacemakers, implanted defibrillators, and certain other implants are removed beforehand\./g,
    () => `Pacemakers, implanted defibrillators, and certain other implants are removed before ${an(n)} ${n} cremation; ask the provider whether removal is in its price.`);
  add(/Authorization: Written authorization from the legal next of kin is required\./g,
    () => `Authorization: Written authorization from the legal next of kin is required; the ${n} rules are in ${cite}.`);
  add(/Urns can be purchased independently for significantly less\./g,
    () => `Urns can be bought from any seller for less, and under the FTC Funeral Rule ${an(n)} ${n} funeral home cannot refuse one bought elsewhere.`);
  add(/Additional costs may include urns \((\$[\d,]+-\$[\d,]+)\), memorial services \((\$[\d,]+-\$[\d,]+)\), and scattering or inurnment fees \((\$[\d,]+-\$[\d,]+)\)\./g,
    (m, a, b, s) => g.dc ? `On top of the ${money(g.dc)} ${n} direct cremation price, families may pay for an urn (${a}), a memorial service (${b}), and scattering or inurnment fees (${s}).` : m);
  add(/The FTC Funeral Rule \(federal\) separately guarantees you do not need a casket for cremation — a basic cremation container suffices\./g,
    () => `The FTC Funeral Rule (federal) separately bars any ${n} provider from requiring a casket for cremation — a basic cremation container suffices.`);
  add(/The FTC Funeral Rule protects your right to use any urn or container\./g,
    () => `The FTC Funeral Rule lets you bring your own urn or container to ${an(n)} ${n} funeral home without a handling fee.`);
  add(/Under the (FTC|Federal Trade Commission) Funeral Rule, you are not required to purchase a casket for cremation — an alternative container is sufficient(\.?)/g,
    (m, w, dot) => `Under the ${w} Funeral Rule, ${an(n)} ${n} provider that offers direct cremation must make an alternative container available, so you are not required to buy a casket${dot}`);
  add(/After cremation, ashes are usually ready for pickup or delivery within 3 to 7 business days\./g,
    () => `Ashes are usually ready for pickup or delivery 3 to 7 business days after the cremation, which cannot take place before ${waitShort}.`);
  add(/Ashes: The cremated remains \(typically 3-7 pounds\) are returned to the family in a container or urn of your choice\./g,
    () => `Ashes: The cremated remains (typically 3-7 pounds) are returned to the family in a container or urn of your choice${cem ? `; for an eligible veteran they can be placed at ${esc(cem.name)} at no charge` : ''}.`);
  add(/The Catholic Church permits cremation \(since 1963\) as long as ashes are interred rather than scattered — worth knowing if tradition is a factor for your family\./g,
    () => `For Catholic families in ${n}, the Church has permitted cremation since 1963 as long as the ashes are interred rather than scattered, so a niche or plot belongs in the budget alongside the ${money(g.dc)} direct cremation price.`);
  add(/The saving is largest when the family skips embalming and a public viewing, two items a traditional burial almost always includes\./g,
    () => `The saving is largest when ${an(n)} ${n} family skips embalming and a public viewing, two items a traditional burial almost always includes.`);
  add(/Check local ordinances before choosing a specific location\./g,
    () => `Check ${n} and local rules before choosing a specific scattering location.`);
  add(/Some providers absorb this in the (\$[\d,]+) base price; others charge mileage\./g,
    (m, x) => `Some ${n} providers absorb this in the ${x} base price; others charge mileage.`);
  add(/Ask whether the quote includes the transfer from the place of death, and get any mileage rate in writing\./g,
    () => `Ask whether the ${n} quote includes the transfer from the place of death, and get any mileage rate in writing.`);
  add(/Ask specifically about transportation when comparing\./g,
    () => firstCity ? `Ask specifically about transportation when comparing providers outside ${esc(firstCity)}.` : `Ask specifically about transportation when comparing ${n} providers.`);
  add(/Hold a memorial separately: A memorial at a church, park, or home costs a fraction of a funeral home ceremony and can be scheduled whenever the family is ready\./g,
    () => `Hold a memorial separately: A memorial at a church, park, or home costs a fraction of a funeral home ceremony${g.c && g.dc ? ` (the ${n} table shows ${money(g.c - g.dc)} between direct cremation and cremation with a service)` : ''} and can be scheduled whenever the family is ready.`);
  add(/Some families prefer columbarium niches, urn burial, or memorial jewelry to avoid the permitting question entirely\./g,
    () => `Some ${n} families choose a columbarium niche, urn burial${cem ? ` (including at ${esc(cem.name)} for an eligible veteran)` : ''}, or memorial jewelry to avoid the permitting question entirely.`);
  add(/This includes visitation, a ceremony, and then cremation instead of burial\./g,
    () => `In ${n} that price includes visitation, a ceremony, and then cremation instead of burial.`);
  add(/(Check assistance programs: <a href="veteran-burial-benefits\.html">Veteran benefits<\/a>, <a href="[^"]+">Medicaid assistance<\/a>, and other programs may cover part or all of cremation costs)\./g,
    (m, x) => f.aid ? `${x}; in ${n}, start with ${esc(f.aid.contact)}.` : `${x}.`);
  add(/For more ways to reduce costs, see our (<a href="cheap-funeral-options\.html">affordable funeral options guide<\/a>) or learn (<a href="how-to-pay-for-a-funeral-with-no-money\.html">how to pay for a funeral with no money<\/a>)\./g,
    (m, a, b) => `For ways to bring ${an(n)} ${n} cremation bill down, see our ${a} or learn ${b}.`);

  // ---------- funeral pages ----------
  add(/Cemetery and burial fees add roughly (\$[\d,]+) when applicable\./g,
    (m, x) => `Cemetery and burial fees add roughly ${x} when ${an(n)} ${n} family chooses burial.`);
  add(/(Direct burial is the next step up at about \$[\d,]+) and is still considerably cheaper than a traditional service\./g,
    (m, x) => g.f ? `${x}, which is ${money(g.f - num(x.match(/\$[\d,]+/)[0]))} below a traditional ${n} funeral.` : m);
  add(/(Direct burial comes next at around \$[\d,]+) and still avoids viewing, ceremony, and embalming\./g,
    (m, x) => `${x} and still avoids viewing, ceremony, and embalming${g.plot ? `, though the ${money(g.plot)} ${n} plot estimate still applies` : ''}.`);
  add(/The state's (\d+)% cremation rate shapes pricing too\./g,
    (m, x) => `At ${x}%, ${n}'s cremation rate is ${rateVsNational(+x)} that NFDA projected for 2025.`);
  add(/Where cremation adoption is high, direct cremation providers tend to post competitive flat rates\./g,
    () => g.dc ? `Direct cremation providers tend to post flat rates; in ${n} the table puts that rate near ${money(g.dc)}.` : `Direct cremation providers in ${n} tend to post flat rates.`);
  // Review r4 item 6: this claim was unsourced and also appeared on
  // high-cremation pages (Oregon 78%, Vermont 72%); it is dropped everywhere.
  add(/\s*In lower-cremation [A-Z][A-Za-z ]+ areas the direct cremation market is thinner, so shopping around pays off more\./g, () => '');
  add(/That is a difference of at least (\$[\d,]+) for most families\./g,
    (m, x) => `For most ${n} families, that is a difference of at least ${x}.`);
  add(/If burial is preferred, direct burial \(no viewing or ceremony\) runs near (\$[\d,]+) and is the cheapest burial option\./g,
    (m, x) => `If burial is preferred, direct burial (no viewing or ceremony) runs near ${x} in ${n} before cemetery fees and is the cheapest burial option.`);
  add(/The state's traditional-funeral average of /g, () => `${n}'s traditional-funeral average of `);
  add(/Costs here are moderate, typically near or below the national average despite varying costs of living across the region and the \w+ region trends moderate to lower than the country overall\./g,
    m => g.f ? `${n}'s ${money(g.f)} traditional-funeral average is ${Math.abs(Math.round((g.f / 8300 - 1) * 100))}% ${g.f <= 8300 ? 'below' : 'above'} the $8,300 national median (NFDA 2023).` : m);
  add(/If you are asked to agree to embalming quickly, that is a signal to slow down and ask whether it is a legal requirement or a provider preference\./g,
    () => reg ? `If ${an(n)} ${n} funeral home asks you to agree to embalming quickly, slow down and ask whether it is a legal requirement or the home's own preference; ${reg} can confirm the rule.` : `If ${an(n)} ${n} funeral home asks you to agree to embalming quickly, slow down and ask whether it is a legal requirement or the home's own preference.`);
  add(/Explore payment assistance if cost is a concern: (<a href="social-security-death-benefit\.html">Social Security benefits<\/a>, <a href="veteran-burial-benefits\.html">veteran benefits<\/a>, <a href="funeral-payment-assistance\.html">Medicaid assistance<\/a>, or <a href="crowdfunding-funeral-costs\.html">crowdfunding<\/a>)\./g,
    (m, x) => `Explore payment assistance if cost is a concern: ${x}${f.aid ? `; in ${n}, also ask ${esc(f.aid.contact)}` : ''}.`);
  add(/For a complete walkthrough, see our (<a href="what-to-do-when-someone-dies\.html">what to do when someone dies<\/a>) guide or (<a href="planning-checklist\.html">printable funeral planning checklist<\/a>)\./g,
    (m, a, b) => `For the steps after a death in ${n}, see our ${a} guide or ${b}.`);
  add(/Protect Yourself: Request a (<a href="funeral-price-comparison\.html">General Price List \(GPL\)<\/a>) from every provider\./g,
    (m, x) => `Protect Yourself: Request a ${x} from every ${n} provider${reg ? `, and report one that refuses to ${reg}` : ''}.`);
  add(/Documentation and filing fees — Death certificates, permits, and filing fees can add \$200–\$600\./g,
    () => `Documentation and filing fees — ${n} death certificates, the disposition permit, and filing fees can add $200–$600.`);
  add(/It covers transport, cremation, and return of the ashes — nothing else\./g,
    () => `In ${n} that price covers transport, cremation, and return of the ashes — nothing else.`);
  add(/Ask for their breakdown of cremation versus burial volume when comparing; it predicts pricing posture\./g,
    () => `Ask each ${n} provider for its split of cremation versus burial work when comparing; it predicts pricing posture${cr ? ` in a state where ${cr}% of families choose cremation` : ''}.`);
  add(/The (<a href="national-funeral-cost-index\.html">national funeral cost index<\/a>) and (<a href="funeral-costs-rising-2026\.html">why funeral costs are rising<\/a>) give the wider picture\./g,
    (m, a, b) => `To see how ${n}'s ${g.f ? money(g.f) + ' ' : ''}average compares, the ${a} and ${b} give the wider picture.`);
  add(/Layer in veteran burial benefits, Medicaid funeral assistance, and the Social Security survivor payment where you qualify\./g,
    () => `Layer in veteran burial benefits${cemAny ? ` (a free grave at ${esc(cemAny.name)})` : ''}, ${f.aid ? esc(f.aid.contact) : 'Medicaid funeral assistance'}, and the $255 Social Security payment where you qualify.`);
  add(/Social Security death benefit — A one-time \$255 payment for eligible surviving spouses or children\./g,
    () => `Social Security death benefit — A one-time $255 payment for an eligible ${n} spouse or child, claimed within two years of the death.`);
  add(/Payment plans — Some funeral homes offer financing or installment plans\./g,
    () => `Payment plans — Some ${n} funeral homes offer financing or installment plans; get the interest and terms in writing.`);
  add(/Cemetery &quot;perpetual care&quot; fees — An ongoing maintenance charge, typically \$200–\$1,000, added on top of the plot price\./g,
    () => `Cemetery &quot;perpetual care&quot; fees — An ongoing maintenance charge, typically $200–$1,000, added on top of the ${g.plot ? money(g.plot) + ' ' : ''}${n} plot price.`);
  add(/Distance to provider is often worth driving for a meaningful family event\./g,
    () => `Driving to a lower-priced provider elsewhere in ${n} is often worth it for a family event of this size.`);
  add(/This guide walks through what families here actually pay and where the pricing gaps show up\./g,
    () => `This guide walks through what ${n} families actually pay and where the pricing gaps show up.`);
  add(/The same traditional service quoted at (\$[\d,]+) from one provider/g,
    (m, x) => `The same traditional service quoted at ${x} from one ${n} provider`);
  add(/Weekend\/holiday premium — Services held outside business hours may carry a 15–25% surcharge\./g,
    () => g.f ? `Weekend/holiday premium — Services held outside business hours may carry a 15–25% surcharge, about ${money(g.f * 0.15)}–${money(g.f * 0.25)} on the ${money(g.f)} ${n} average.` : `Weekend/holiday premium — ${n} services held outside business hours may carry a 15–25% surcharge.`);
  add(/Veteran burial benefits — If the deceased served in the military, burial allowances, free cemetery plots, and headstones may be available\./g,
    () => `Veteran burial benefits — If the deceased served in the military, burial allowances, a free plot and a headstone may be available${cemAny ? `, for example at ${esc(cemAny.name)}` : ''}.`);
  add(/Then confirm eligibility for veteran, Medicaid, and Social Security survivor benefits\./g,
    () => f.aid ? `Then confirm eligibility with ${esc(f.aid.contact)}, and for veteran and Social Security survivor benefits.` : `Then confirm ${n} eligibility for veteran, Medicaid, and Social Security survivor benefits.`);
  add(/&quot;Package&quot; markups — Bundled packages often include services you don't need\./g,
    () => `&quot;Package&quot; markups — Bundled packages often include services you don't need; under the FTC Funeral Rule ${an(n)} ${n} funeral home must also price each item separately.`);
  add(/Use our free comparison worksheet to organize quotes\./g,
    () => `Use our free comparison worksheet to organize ${n} quotes.`);
  add(/Our home funeral guide covers the steps\./g,
    () => `Our home funeral guide covers the steps ${an(n)} ${n} family would take.`);

  // ---------- burial pages ----------
  add(/Green burial — No embalming, biodegradable container, and a natural setting\./g,
    () => `Green burial — No embalming, biodegradable container, and a natural setting; ask which ${n} cemeteries allow it.`);
  add(/This guide lays out what drives each line item and where families have room to save\./g,
    () => `This guide lays out what drives each line item and where ${n} families have room to save.`);
  add(/Ask about grave liners: A liner costs significantly less than a full vault and may meet the cemetery's requirements\./g,
    () => `Ask about grave liners: A liner costs significantly less than a full vault${g.vault ? ` (${money(g.vault)} in the ${n} table)` : ''} and may meet the cemetery's requirements.`);
  add(/Consider direct burial or green burial: Skipping viewing, ceremony, and embalming can lower costs significantly\./g,
    () => `Consider direct burial or green burial: Skipping viewing, ceremony, and embalming can lower costs significantly${g.f ? ` from the ${money(g.f)} ${n} funeral service estimate` : ''}.`);
  add(/For comprehensive cost-saving strategies, see our (<a href="cheap-funeral-options\.html">affordable funeral options guide<\/a>) or (<a href="funeral-payment-assistance\.html">payment assistance programs<\/a>)\./g,
    (m, a, b) => `For ways to bring ${an(n)} ${n} burial bill down, see our ${a} or ${b}.`);
  add(/Grave liners \(cheaper than full vaults\) often satisfy the same requirement — ask the specific cemetery what they accept\./g,
    () => `Grave liners (cheaper than full vaults) often satisfy the same requirement — ask the ${n} cemetery what it accepts before paying ${g.vault ? money(g.vault) + ' for a vault' : 'for a vault'}.`);
  add(/Compare prices with the (<a href="casket-buying-guide\.html">casket buying guide<\/a>) and the list of (<a href="best-online-casket-retailers\.html">online casket retailers<\/a>)\./g,
    (m, a, b) => `Compare the ${g.casket ? money(g.casket) + ' ' : ''}${n} casket estimate with the ${a} and the list of ${b}.`);
  add(/Check headstone prices independently: Funeral homes and cemeteries mark up headstones\./g,
    () => `Check headstone prices independently: ${n} funeral homes and cemeteries mark up headstones.`);
  add(/If a rural cemetery is acceptable to your family, the savings compound fast\./g,
    () => firstCity ? `If a rural cemetery away from ${esc(firstCity)} is acceptable to your family, the savings compound fast.` : `If a rural ${n} cemetery is acceptable to your family, the savings compound fast.`);
  add(/Bundled quotes obscure where the markup sits — and the markup sits in a different place depending on the provider\./g,
    () => `Bundled quotes obscure where the markup sits — and it sits in a different place depending on the ${n} provider.`);
  add(/Mausoleum entombment — Above-ground placement in a mausoleum\./g,
    () => `Mausoleum entombment — Above-ground placement in a mausoleum; ${n} crypt prices are not in the table, so ask each cemetery.`);
  add(/Comparing two or three funeral homes and two or three cemeteries independently is the single most reliable way to bring that number down\./g,
    () => `Comparing two or three ${n} funeral homes and two or three cemeteries independently is the single most reliable way to bring that number down.`);
  add(/Choosing direct burial removes embalming, facility use, and visitation fees and can cut total costs by \$2,000-\$4,000\./g,
    () => `Choosing direct burial removes embalming, facility use, and visitation fees and can cut ${an(n)} ${n} total by $2,000-$4,000.`);
  add(/Above-ground entombment also appears in the coastal parts of the region\./g,
    () => `${n} cemeteries may also sell mausoleum crypts for above-ground entombment, priced separately from the plot in the table.`);
  add(/county veterans' sections \(free for eligible veterans\)/g,
    () => cemAny ? `${esc(cemAny.name)} (free for eligible veterans)` : `veterans' cemeteries (free for eligible veterans)`);
  add(/Always request an itemized sheet covering plot, opening-and-closing, vault policy, perpetual care, and any residency or membership restrictions\./g,
    () => `Always request an itemized sheet from each ${n} cemetery covering plot, opening-and-closing, vault policy, perpetual care, and any residency or membership restrictions.`);
  add(/See our (<a href="green-burial[^"]*">green burial guide<\/a>) for more details\./g,
    (m, a) => `See our ${a} before asking ${n} cemeteries about it.`);
  add(/You pay the funeral home, you pay the cemetery, you pay the monument company, and frequently you pay a handful of administrative fees on top\./g,
    () => `In ${n} you pay the funeral home, you pay the cemetery, you pay the monument company, and frequently you pay a handful of administrative fees on top.`);
  add(/Ask for plot, vault, opening-and-closing, and perpetual care line-by-line\./g,
    () => g.plot && g.vault && g.open ? `Ask for plot, vault, opening-and-closing, and perpetual care line-by-line, and set them against the ${n} estimates of ${money(g.plot)}, ${money(g.vault)} and ${money(g.open)}.` : `Ask each ${n} cemetery for plot, vault, opening-and-closing, and perpetual care line-by-line.`);
  add(/Direct burial — The body is buried shortly after death without embalming, viewing, or ceremony\./g,
    () => `Direct burial — The body is buried shortly after death without embalming, viewing, or ceremony; ${n} cemetery charges still apply.`);
  add(/Cemeteries require a vault or a less expensive grave liner to keep the ground stable over time\./g,
    () => `Most cemeteries require a vault or a less expensive grave liner to keep the ground stable over time${g.vault ? `; the ${n} table puts that cost at ${money(g.vault)}` : ''}.`);
  add(/Vault pricing spans \$800 to \$10,000 in the state\./g,
    () => `Vaults sold nationally range from about $800 to $10,000${g.vault ? `, against the ${money(g.vault)} ${n} estimate above` : ''}.`);
  add(/That local scarcity makes up-front price confirmation especially important(?! in )/g,
    () => `That local scarcity makes up-front price confirmation especially important in ${n}`);
  add(/Traditional burial — Full funeral service with viewing, casket, and cemetery burial\./g,
    () => `Traditional burial — Full funeral service with viewing, casket, and cemetery burial${g.f ? `, from about ${money(g.f)} for the ${n} funeral service alone` : ''}.`);
  add(/Totals generally land between (\$[\d,]+) and (\$[\d,]+) depending on choices\./g,
    (m, a, b) => `${n} totals generally land between ${a} and ${b} depending on choices.`);
  add(/the total typically ranges from (\$[\d,]+)/g, (m, a) => `the ${n} total typically ranges from ${a}`);
  add(/and the complete picture runs (\$[\d,]+) to/g, (m, a) => `and the complete ${n} picture runs ${a} to`);
  add(/(<p[^>]*>)The funeral service runs about (\$[\d,]+), the cemetery plot/g, (m, p, a) => `${p}In ${n}, the funeral service runs about ${a}, the cemetery plot`);
  add(/Ask for the winter-specific line item before signing\./g,
    () => `Ask each ${n} cemetery for the winter-specific line item before signing.`);
  // ---------- round-4 leftovers (frames that carry links or sit mid-paragraph) ----------
  add(/(Check assistance programs: <a href="veteran-burial-benefits\.html">Veteran benefits<\/a>, <a href="funeral-payment-assistance\.html">Medicaid assistance<\/a>,) and (<a href="funeral-payment-assistance\.html">other programs<\/a>) may cover part or all of cremation costs\./g,
    (m, a, b) => `${a}${f.aid ? ` through ${esc(f.aid.contact)},` : ''} and ${b} may cover part or all of ${an(n)} ${n} cremation bill.`);
  add(/Pacemakers and implants: These must be removed before cremation for safety\./g,
    () => `Pacemakers and implants: These must be removed before ${an(n)} ${n} cremation because their batteries can burst in the cremation chamber.`);
  add(/Use our (<a href="[^"]*">free comparison worksheet<\/a>) to organize quotes\./g,
    (m, a) => `Use our ${a} to organize the ${n} quotes.`);
  add(/Our (<a href="home-funeral-guide\.html">home funeral guide<\/a>) covers the steps\./g,
    (m, a) => `Our ${a} covers the steps ${an(n)} ${n} family would take.`);
  add(/See our green burial guide for more details\./g,
    () => `Our green burial guide covers the embalming and vault questions to raise with ${an(n)} ${n} cemetery.`);
  add(/(total between \$[\d,]+ and \$[\d,]+\. )The funeral service runs about/g,
    (m, a) => `${a}Of that, the ${n} funeral service runs about`);
  add(/Direct cremation starts around (\$[\d,]+) while cremation with a full service averages (\$[\d,]+)\./g,
    (m, a, b) => `In ${n}, direct cremation starts around ${a} while cremation with a full service averages ${b}, a gap of ${money(num(b) - num(a))}.`);
  // Pages are rewritten in place, so sentences produced by earlier builds keep the
  // cemetery and office they were built with. Re-point them at the current default
  // cemetery (plotCem) and the state's own aid contact; every swap is idempotent.
  const names = '(' + ALL_CEMS.map(x => esc(x).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')';
  const re = (a, b) => new RegExp(a + names + b, 'g');
  if (cem) {
    add(re('(; for an eligible veteran they can be placed at )', '( at no charge)'), (m, a, x, b) => a + esc(cem.name) + b);
    add(re('( \\(including at )', '( for an eligible veteran\\))'), (m, a, x, b) => a + esc(cem.name) + b);
  }
  if (cemAny) {
    add(re('(Layer in veteran burial benefits \\(a free grave at )', '(\\))'), (m, a, x, b) => a + esc(cemAny.name) + b);
    add(re('(, for example at )', '(\\.)'), (m, a, x, b) => a + esc(cemAny.name) + b);
    add(re('', '( \\(free for eligible veterans\\))'), (m, x, b) => esc(cemAny.name) + b);
  }
  if (f.aid && f.aid.contact) {
    add(/(Layer in veteran burial benefits[^<]*?\), )county or Medicaid funeral assistance(, and the \$255)/g, (m, a, b) => a + esc(f.aid.contact) + b);
    add(new RegExp(`; in ${n}, also ask the county social-services office`, 'g'), () => `; in ${n}, also ask ${esc(f.aid.contact)}`);
    add(new RegExp(`; in ${n}, ask the county social-services office first\\.`, 'g'), () => `; in ${n}, start with ${esc(f.aid.contact)}.`);
  }
  // Fix item 8: the generic "legal only in some states" line becomes the state's actual
  // alkaline-hydrolysis status (data/state-facts.json "hydrolysis", sourced in the r4 README).
  if (f.hydrolysis) add(/Alkaline hydrolysis \(water cremation\) is legal only in some states, so ask an? [^<.]*? provider whether it is offered\./g, () => esc(f.hydrolysis));
  return R;
}

function an(w) { return /^[AEIO]/.test(w) || (/^U/.test(w) && !/^U(?:tah|ni|s[aeiou]|r[aeiou])/i.test(w)) ? 'an' : 'a'; }

/** Rewrite template sentences on one state page. Script blocks are left alone
 *  (post-fix syncFaqLd rebuilds the FAQ JSON-LD from the visible answers). */
function rewrite(html, file) {
  const c = ctxFor(file);
  if (!c) return html;
  const g = figures(html, c);
  const rules = rulesFor(c, g);
  const parts = html.split(/(<script[\s\S]*?<\/script>)/);
  for (let i = 0; i < parts.length; i += 2) {
    let s = parts[i];
    for (const [re, fn] of rules) s = s.replace(re, fn);
    // Burial pages: the funeral page already quotes the state's aid program;
    // the burial page gets the burial-specific version of the same facts.
    if (c.kind === 'burial-costs-' && c.f.aid && c.f.aid.burial) s = s.split(esc(c.f.aid.text)).join(esc(c.f.aid.burial));
    s = s.replace(/\s*<p data-state-fact="1">\s*<\/p>/g, '');
    parts[i] = s;
  }
  return parts.join('');
}

/** One labeled methodology/disclosure line per state page. Funeral and burial
 *  pages carried two disclosure-style lines (the table note and the
 *  "Disclaimer:" box); they are merged here without dropping either caveat.
 *  Cremation pages had no estimate caveat and get the same line under their
 *  cost table. DC pages keep their own sourced note. */
const METHOD_NOTE = '<p class="table-note state-method-note"><strong>Methodology note:</strong> These figures are our estimates, not a survey of local providers, and they are not a quote or professional advice. <a href="national-funeral-cost-index.html#state-estimates">See how we calculate them</a> or read the <a href="disclaimer.html">full disclaimer</a>.</p>';
function methodologyNote(html, file) {
  const c = ctxFor(file);
  if (!c || c.slug === 'washington-dc') return html;
  if (html.includes('class="table-note state-method-note"')) {
    return html.replace(/\s*<div class="guide-disclaimer"[^>]*>[\s\S]*?<\/div>/gi, '');
  }
  let out = html.replace(/<p class="table-note">These figures are our estimates, not a survey of local providers\. <a href="national-funeral-cost-index\.html#state-estimates">See how we calculate them<\/a>\.<\/p>/, () => METHOD_NOTE);
  if (out === html) {
    const i = out.indexOf('</table>');
    if (i < 0) return html;
    out = out.slice(0, i + 8) + '\n          ' + METHOD_NOTE + out.slice(i + 8);
  }
  return out.replace(/\s*<div class="guide-disclaimer"[^>]*>[\s\S]*?<\/div>/gi, '');
}

module.exports = { rewrite, ctxFor, methodologyNote, METHOD_NOTE };
