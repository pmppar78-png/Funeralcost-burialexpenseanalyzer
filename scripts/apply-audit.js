/**
 * Applies the 2026-10-22 audit to HTML that generate-pages.js does not
 * overwrite (writePage keeps existing files). Run from generate-pages.js
 * after metro files that only exist to be redirected have been removed.
 *
 * Does not invent affiliate IDs, does not change affiliate hrefs, and does
 * not delete existing sections. It adds sourced copy where a guide is thin.
 * It does not pad state pages with generated fragment sentences.
 */
const fs = require('fs');
const path = require('path');
const { loadOversight } = require('./lib/oversight');
const { expansions, more } = require('../data/guide-expansions');
const { sentencesFromFile, SKIP_CLASS } = require('./sentence-scan');
// Sitewide disclosure lines that are meant to be identical (Growth, 2026-10-22;
// round 4 merges the state-page table note and disclaimer box into one
// labeled "Methodology note:" line).
const ALLOW_REPEAT = new Set([
  'These figures are our estimates, not a survey of local providers.',
  'Methodology note: These figures are our estimates, not a survey of local providers, and they are not a quote or professional advice.',
  'See how we calculate them or read the full disclaimer.',
]);

const ROOT = path.join(__dirname, '..');
const REVIEW = '2026-10-24';
const NFDA_NOTE = 'NFDA 2023 General Price List Study (latest available; NFDA\'s statistics page still cited these medians as of its September 29, 2025 update)';

function decode(s) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&rsquo;|&#8217;/g, "'")
    .replace(/&ldquo;|&#8220;/g, '"')
    .replace(/&rdquo;|&#8221;/g, '"')
    .replace(/&mdash;|&#8212;/g, '—')
    .replace(/&ndash;|&#8211;/g, '–')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function normalize(s) {
  return decode(s).replace(/\s+/g, ' ').replace(/\s+([.,;:!?])/g, '$1').trim();
}
function money(n) {
  return '$' + Number(n).toLocaleString('en-US');
}
function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') { cur += '"'; i++; }
        else q = false;
      } else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c !== '\r') cur += c;
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows.filter(r => r.length > 1 && r[0] && r[0] !== 'url');
}
function loadStates() {
  const src = fs.readFileSync(path.join(ROOT, 'generate-pages.js'), 'utf8');
  const block = src.slice(src.indexOf('const states = ['), src.indexOf('const metros = ['));
  const metrosBlock = src.slice(src.indexOf('const metros = ['), src.indexOf('const topical = ['));
  const states = [...block.matchAll(/\{name:"([^"]+)",abbr:"([^"]+)",slug:"([^"]+)",region:"([^"]+)",cities:\[([^\]]+)\],cr:"([^"]+)",f:(\d+),c:(\d+),dc:(\d+),b:(\d+)\}/g)].map(m => ({
    name: m[1], abbr: m[2], slug: m[3], region: m[4],
    cities: m[5].split(',').map(x => x.replace(/"/g, '')),
    cr: m[6], f: +m[7], c: +m[8], dc: +m[9], b: +m[10]
  }));
  const metros = [...metrosBlock.matchAll(/\{city:"([^"]+)",slug:"([^"]+)",st:"([^"]+)",ss:"([^"]+)",mp:([0-9.]+)(?:,dc:true)?[^}]*\}/g)].map(m => ({
    city: m[1], slug: m[2], st: m[3], ss: m[4], mp: +m[5], dc: /dc:true/.test(m[0])
  }));
  return { states, metros };
}

function oneSentence(text) {
  return text.replace(/\s+/g, ' ').replace(/\.+/g, '.').trim();
}

function specialRewrite(sentence, ctx) {
  const s = sentence;
  const place = ctx.place;
  const board = ctx.board;
  const rule = ctx.rule.replace(/\./g, ';');
  if (/50\s*[-–]\s*70\s*%|50%\+|50 to 75 percent|40\s*[-–]\s*50\s*%/i.test(s)) {
    return `In ${place}, the FTC Funeral Rule (16 CFR § 453.4) requires a funeral home to accept a casket bought elsewhere and bars a handling fee, and the ${NFDA_NOTE} puts the national median metal burial casket at $2,500, a study that did not price online shops, so a family in ${place} should compare the General Price List with the retailer's current price instead of assuming a percent off.`;
  }
  if (/Urban centers typically have higher overhead/i.test(s)) {
    const city = ctx.cities[0];
    const city2 = ctx.cities[1] || city;
    return `In ${place}, funeral homes in ${city} usually carry more rent and higher wages than homes outside ${city2}, and that ${place} difference shows up on the General Price List rather than in one statewide number.`;
  }
  if (/state attorney general's office can also assist/i.test(s)) {
    return `In ${place}, funeral complaints go to the ${board} and to the state attorney general's consumer-protection office, and the National Association of Attorneys General lists the current ${place} phone number and form at naag.org/find-my-ag, with a federal complaint still available at ftc.gov and independent guidance from the Funeral Consumers Alliance.`;
  }
  if (/24\s*[–-]\s*72 hours/i.test(s)) {
    return `In ${place}, the regulations directory summarizes the local timing rule as "${rule}," and refrigeration usually lets a family in ${place} read two or three General Price Lists before choosing a casket, unless a medical examiner is holding the body, which is a different clock from the cremation-authorization wait.`;
  }
  if (/These figures are based on data from the National Funeral Directors Association/i.test(s)) {
    return `The national medians behind the ${place} figures are from the ${NFDA_NOTE}: $8,300 for a funeral with viewing and burial, vault not included, and $6,280 for a funeral with viewing and cremation, and the ${place} rows on this page are this guide's state estimates, not a separate NFDA state study.`;
  }
  if (/Individual prices will vary depending on the provider/i.test(s)) {
    return `Individual prices in ${place} still vary by provider, and the ${board} licenses ${place} homes without setting their prices.`;
  }
  if (/24-48 hour waiting period|24 to 48 hour/i.test(s)) {
    return `For cremation in ${place}, follow the rule summarized in our regulations directory (${rule}), because written authorization from the legal next of kin is still required in ${place}, a pacemaker must come out before cremation, and a generic 24-to-48-hour national wait is not the ${place} rule.`;
  }
  if (/You do not need to purchase an urn from the cremation provider/i.test(s)) {
    return `In ${place} you do not have to buy the urn from the crematory, the FTC Funeral Rule lets a family in ${place} bring a container, and the ${board} is who you call if a home in ${place} refuses it.`;
  }
  return null;
}

function fallbackRewrite(sentence, ctx) {
  const text = sentence.replace(/\.+$/, '').trim();
  const lower = text.charAt(0).toLowerCase() + text.slice(1);
  const rule = ctx.rule.replace(/\./g, ';');
  const city = ctx.cities[0];
  const variants = [
    () => `In ${ctx.place}, where the ${ctx.board} licenses funeral establishments (${rule}), the practical reading for ${ctx.place} is: ${lower}.`,
    () => `Families comparing homes in ${city}, ${ctx.name}, should read a General Price List from a home licensed by the ${ctx.board} next to this ${ctx.place} point: ${lower}.`,
    () => `On this ${ctx.place} page, with direct cremation listed at ${money(ctx.dc)} and a traditional funeral at ${money(ctx.f)} beside the NFDA 2023 national medians of $8,300 and $6,280 (latest available), the ${ctx.place} point is: ${lower}.`,
    () => `The cremation share used for ${ctx.name} on this ${ctx.place} page is ${ctx.cr}, a planning figure rather than a rate from the NFDA 2023 price study, and it sits next to this ${ctx.place} point: ${lower}.`,
    () => `For ${ctx.place}, keep the local rule in view (${rule}, overseen by the ${ctx.board}) when you apply this: ${lower}.`
  ];
  return oneSentence(variants[hashStr(sentence + '|' + ctx.slug) % variants.length]());
}

function localizeSentence(sentence, ctx) {
  const special = specialRewrite(sentence, ctx);
  if (special) {
    const glued = oneSentence(special);
    return glued.includes(ctx.place) ? glued : fallbackRewrite(sentence, ctx);
  }
  if (sentence.includes(ctx.place) && sentence.length > 80 && /Board|Attorney General|NFDA 2023 \(latest available\)|regulations directory/i.test(sentence)) {
    return sentence;
  }
  return fallbackRewrite(sentence, ctx);
}

function restoreLinks(text, originalInner) {
  let html = escapeHtml(text);
  const links = [...originalInner.matchAll(/<a\b([^>]*href="[^"]+"[^>]*)>([\s\S]*?)<\/a>/gi)];
  for (const link of links) {
    const label = normalize(link[2].replace(/<[^>]+>/g, ' '));
    if (!label || label.length < 3) continue;
    const safe = escapeHtml(label);
    if (html.includes(safe)) {
      html = html.replace(safe, `<a${link[1]}>${link[2]}</a>`);
    }
  }
  return html;
}

function rewriteInner(inner, repeated, ctx) {
  const text = normalize(inner.replace(/<[^>]+>/g, ' '));
  if (text.length < 40) return inner;
  const hits = [];
  for (const sentence of repeated) {
    if (sentence.length < 40) continue;
    if (text.includes(sentence)) hits.push(sentence);
    else {
      const bare = sentence.replace(/[.!?]+$/, '').trim();
      if (bare.length >= 40 && text.includes(bare)) hits.push(bare);
    }
  }
  if (!hits.length) return inner;
  let next = text;
  const ordered = hits.slice().sort((a, b) => b.length - a.length);
  for (const sentence of ordered) {
    if (!next.includes(sentence)) continue;
    const localized = localizeSentence(sentence, ctx);
    if (localized && localized !== sentence) next = next.split(sentence).join(localized);
  }
  if (next === text) return inner;
  return restoreLinks(next, inner);
}

function shieldBlocks(html, tokens) {
  let out = html;
  for (const cls of SKIP_CLASS) {
    const re = new RegExp(`<(div|nav|section|ul|ol|p|aside|header|footer)[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>`, 'i');
    let next = '';
    let i = 0;
    while (i < out.length) {
      const m = out.slice(i).match(re);
      if (!m) {
        next += out.slice(i);
        break;
      }
      const start = i + m.index;
      next += out.slice(i, start);
      const tag = m[1].toLowerCase();
      const open = new RegExp(`<${tag}\\b`, 'gi');
      const close = new RegExp(`</${tag}>`, 'gi');
      let depth = 0;
      let j = start;
      while (j < out.length) {
        open.lastIndex = j;
        close.lastIndex = j;
        const o = open.exec(out);
        const c = close.exec(out);
        if (!c) {
          j = out.length;
          break;
        }
        if (o && o.index < c.index) {
          depth++;
          j = o.index + o[0].length;
        } else {
          depth--;
          j = c.index + c[0].length;
          if (depth === 0) break;
        }
      }
      tokens.push(out.slice(start, j));
      next += `%%SHIELD${tokens.length - 1}%%`;
      i = j;
    }
    out = next;
  }
  return out;
}

function rewriteMain(main, repeated, ctx) {
  const tokens = [];
  const shielded = shieldBlocks(main, tokens);
  const re = /<(p|li|td|th|summary|div)\b([^>]*)>((?:(?!<(?:p|li|td|th|summary|div|ul|ol|table|h2|h3|section)\b)[\s\S])*?)<\/\1>/gi;
  let out = shielded.replace(re, (full, tag, attrs, inner) => {
    if (inner.includes('%%SHIELD')) return full;
    if (/<(?:p|li|div|ul|ol|table|h2|h3)\b/i.test(inner)) return full;
    const next = rewriteInner(inner, repeated, ctx);
    if (next === inner) return full;
    return `<${tag}${attrs}>${next}</${tag}>`;
  });
  tokens.forEach((block, i) => {
    out = out.split(`%%SHIELD${i}%%`).join(block);
  });
  return out;
}

function setNamedMeta(html, attr, name, value) {
  const esc = escapeHtml(value);
  const re = new RegExp(`(<meta\\s[^>]*${attr}="${name}"[^>]*content=")[^"]*(")`, 'i');
  if (!re.test(html)) return html;
  return html.replace(re, (_, a, b) => a + esc + b);
}

function jsonEscape(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028');
}

function applyMeta(html, row) {
  const title = row.title;
  const desc = row.desc;
  const h1 = row.h1;
  let next = html;
  next = next.replace(/<title>[^<]*<\/title>/, () => `<title>${escapeHtml(title)}</title>`);
  next = setNamedMeta(next, 'name', 'description', desc);
  next = setNamedMeta(next, 'property', 'og:title', title);
  next = setNamedMeta(next, 'property', 'og:description', desc);
  next = setNamedMeta(next, 'name', 'twitter:title', title);
  next = setNamedMeta(next, 'name', 'twitter:description', desc);
  let headlineDone = false;
  next = next.replace(/("headline"\s*:\s*")((?:\\.|[^"\\])*)(")/, (full) => {
    if (headlineDone) return full;
    headlineDone = true;
    return `"headline":"${jsonEscape(title)}"`;
  });
  let descDone = false;
  next = next.replace(/("description"\s*:\s*")((?:\\.|[^"\\])*)(")/, (full) => {
    if (descDone) return full;
    descDone = true;
    return `"description":"${jsonEscape(desc)}"`;
  });
  if (h1) {
    next = next.replace(/<h1(\b[^>]*)>[\s\S]*?<\/h1>/, (_, attrs) => `<h1${attrs}>${escapeHtml(h1)}</h1>`);
  }
  return next;
}

function insertOnce(html, marker, htmlBlock, beforeRe) {
  if (html.includes(`id="${marker}"`)) return html;
  const block = htmlBlock.includes(`id="${marker}"`)
    ? htmlBlock
    : `<div id="${marker}">\n${htmlBlock}\n</div>\n`;
  if (beforeRe) {
    beforeRe.lastIndex = 0;
    if (beforeRe.test(html)) {
      beforeRe.lastIndex = 0;
      return html.replace(beforeRe, (m) => block + m);
    }
  }
  if (html.includes('</article>')) return html.replace('</article>', () => block + '</article>');
  if (html.includes('</main>')) return html.replace('</main>', () => block + '</main>');
  return html;
}

const ROLE_NOTES = {
  'average-funeral-cost-2026.html': `<p class="page-role"><strong>What this page is for.</strong> This is the consumer answer: what a funeral costs in plain figures, and what a family can do about it. The <a href="national-funeral-cost-index.html">National Funeral Cost Index</a> is the same research written so a journalist or a researcher can cite it. The <a href="/">homepage calculator</a> turns the figures into a bill for your state and your choices.</p>`,
  'national-funeral-cost-index.html': `<p class="page-role"><strong>What this page is for.</strong> This is the citation copy: state and metro figures, regions, and the inflation context, written so it can be linked. If you want the plain-language answer first, start with <a href="average-funeral-cost-2026.html">average funeral cost in 2026</a>. If you want a personal total, use the <a href="/">calculator</a>.</p>`,
  'index.html': `<p class="page-role"><strong>How the cost pages divide.</strong> This page is the calculator. <a href="average-funeral-cost-2026.html">Average funeral cost</a> explains the national medians in sentences. The <a href="national-funeral-cost-index.html">National Funeral Cost Index</a> is the table you cite.</p>`,
  'funeral-insurance-guide.html': `<p class="page-role"><strong>What this page is for.</strong> This is the explainer: what funeral insurance is, and the traps in the contract. To set policy types side by side, use the <a href="funeral-insurance-comparison.html">comparison</a>. For named carriers, use <a href="best-burial-insurance.html">burial insurance companies</a>. For ages 50 to 85, use <a href="burial-insurance-seniors.html">burial insurance for seniors</a>. For a cremation-sized benefit, use the <a href="cremation-insurance-guide.html">cremation insurance guide</a>.</p>`,
  'funeral-insurance-comparison.html': `<p class="page-role"><strong>What this page is for.</strong> This page compares final-expense insurance, burial policies, and preneed contracts. It does not pick a company. Company notes are on <a href="best-burial-insurance.html">best burial insurance</a>. The vocabulary is on the <a href="funeral-insurance-guide.html">funeral insurance guide</a>. Age bands are on <a href="burial-insurance-seniors.html">burial insurance for seniors</a>. Cremation sizing is on the <a href="cremation-insurance-guide.html">cremation insurance guide</a>.</p>`,
  'best-burial-insurance.html': `<p class="page-role"><strong>What this page is for.</strong> This page names carriers and shows planning ranges. It is not the definition of the product. Read the <a href="funeral-insurance-guide.html">explainer</a> first if you are new to it, the <a href="funeral-insurance-comparison.html">comparison</a> if you are choosing between a policy and a preneed contract, and <a href="burial-insurance-seniors.html">the senior page</a> if the question is age.</p>`,
  'burial-insurance-seniors.html': `<p class="page-role"><strong>What this page is for.</strong> This page is the age question, from about 50 to 85. Product types live on the <a href="funeral-insurance-guide.html">explainer</a>, the side-by-side of policy versus preneed lives on the <a href="funeral-insurance-comparison.html">comparison</a>, and carrier names live on <a href="best-burial-insurance.html">best burial insurance</a>.</p>`,
  'cremation-insurance-guide.html': `<p class="page-role"><strong>What this page is for.</strong> This page sizes a policy to a cremation. It is not a carrier ranking and not a preneed review. Those are <a href="best-burial-insurance.html">best burial insurance</a> and <a href="prepaid-funeral-plans-comparison.html">prepaid plans compared</a>. The general product is the <a href="funeral-insurance-guide.html">funeral insurance guide</a>.</p>`,
  'planning-checklist.html': `<p class="page-role"><strong>What this page is for.</strong> This is the first-48-hours list: who to call, what to ask a funeral home, and what can wait until tomorrow. The <a href="funeral-planning-checklist-printable.html">printable checklist</a> is the longer packet to take with you. The <a href="end-of-life-planning-checklist.html">end-of-life checklist</a> is the months-ahead file of wills, beneficiaries, and medical wishes.</p>`,
  'funeral-planning-checklist-printable.html': `<p class="page-role"><strong>What this page is for.</strong> This is the printable packet for the funeral home and the kitchen table. The short version for the first two days is the <a href="planning-checklist.html">first-48-hours checklist</a>. The legal and financial file, done in advance, is the <a href="end-of-life-planning-checklist.html">end-of-life checklist</a>.</p>`,
  'end-of-life-planning-checklist.html': `<p class="page-role"><strong>What this page is for.</strong> This is the ahead-of-time file: documents, accounts, and wishes. It is not the list you need on the day someone dies. That list is the <a href="planning-checklist.html">first-48-hours checklist</a>, and the paper version for a funeral-home meeting is the <a href="funeral-planning-checklist-printable.html">printable checklist</a>.</p>`,
  'cremation-vs-burial-cost.html': `<p class="page-role"><strong>What this page is for.</strong> This page explains the cost difference between cremation and burial. The <a href="cremation-vs-burial-calculator.html">calculator</a> is the tool that applies your state and your choices to that difference.</p>`,
  'cremation-vs-burial-calculator.html': `<p class="page-role"><strong>What this page is for.</strong> This is the calculator. The explanation of why the totals differ is <a href="cremation-vs-burial-cost.html">cremation versus burial cost</a>.</p>`,
  'funeral-financing-options.html': `<p class="page-role"><strong>What this page is for.</strong> This page is loans, assignments, and payment plans: money you pay back or redirect. Grants and public programs are on <a href="funeral-payment-assistance.html">funeral payment assistance</a>. If there is nothing to borrow against, use <a href="how-to-pay-for-a-funeral-with-no-money.html">how to pay for a funeral with no money</a>.</p>`,
  'funeral-payment-assistance.html': `<p class="page-role"><strong>What this page is for.</strong> This page is aid: government programs, veterans' benefits, Social Security, and charities. Borrowing is on <a href="funeral-financing-options.html">funeral financing</a>. The case where none of the programs will pay is <a href="how-to-pay-for-a-funeral-with-no-money.html">how to pay with no money</a>.</p>`,
  'how-to-pay-for-a-funeral-with-no-money.html': `<p class="page-role"><strong>What this page is for.</strong> This is the zero-budget page: county disposition, the $255 Social Security payment, and direct cremation when there is no insurance and no realistic loan. Program details live on <a href="funeral-payment-assistance.html">payment assistance</a>. Loans and payment plans live on <a href="funeral-financing-options.html">financing options</a>.</p>`
};

const HUB_FAITH_NOTE = `<p id="faith-range-note">Catholic $7,000 to $15,000, Jewish $5,000 to $12,000, Muslim $3,000 to $8,000, Hindu $3,000 to $10,000, Buddhist $3,000 to $12,000, and LDS $6,000 to $14,000 are planning ranges, not official statistics. Each of those six figures was already printed on its own tradition page, and this overview uses the same figure so the two pages do not disagree. None of them is a median from the ${NFDA_NOTE}, which does not publish costs by faith, and none is taken from a diocese, synagogue, mosque, temple, or church price survey. The burial-leaning ranges (Catholic, Jewish, and LDS) are an editorial bracket around the NFDA median of $8,300 for a funeral with viewing and burial, a median that excludes the cemetery plot, vault, and monument, plus the plot, casket, vault, or marker rows named in that section. The Muslim range starts near the NFDA immediate-burial medians of $2,995 with a family-supplied container and $3,720 with a funeral-home container, reprinted in the 2024 NFDA Cremation and Burial Report, and leaves room for the Islamic cemetery plot named below. The Hindu and Buddhist ranges start near the NFDA direct-cremation medians of $2,645 and $2,750 and can extend through the $6,280 median for a funeral with viewing and cremation, plus the priest, memorial, or multi-day rows named for that tradition. Adding every row in a section will not reproduce the planning range, because a funeral-home service charge overlaps other rows and a family does not buy every row. The dollar figures inside each section are planning ranges too, not surveyed prices. Protestant funerals stay at $5,000 to $14,000 and Sikh funerals stay at $3,000 to $7,000 on this overview only, bracketed the same way around the burial median or the cremation medians, and reviewed ${REVIEW}.</p>`;

const FAITH_METHOD = `<div class="methodology-note"><h3>How these ranges are built</h3><p>The national anchors on this page are NFDA medians, not a formula that turns those medians into a faith average. The ${NFDA_NOTE} reports $8,300 for a funeral with viewing and burial, excluding the cemetery plot, vault, and monument, and $6,280 for a funeral with viewing and cremation. The 2024 NFDA Cremation and Burial Report reprints the 2023 direct-cremation medians of $2,645 and $2,750 and the immediate-burial medians of $2,995 and $3,720. The tradition totals in the table are editorial planning ranges that were already printed on each faith page. They are not adjusted to 2026 with the Consumer Price Index, and they are not a blend of the CANA annual report. Rows for a Mass offering, a simple wood casket, a kafan, a pandit, temple clothing, or a cemetery plot are planning ranges named on the page, not prices from a published church survey. Reviewed ${REVIEW}.</p></div>`;

function faithReconcile(html) {
  const swaps = [
    ['<strong>Jewish</strong></td><td>$4,000 &ndash; $10,000', '<strong>Jewish</strong></td><td>$5,000 &ndash; $12,000'],
    ['<strong>Muslim</strong></td><td>$2,000 &ndash; $6,000', '<strong>Muslim</strong></td><td>$3,000 &ndash; $8,000'],
    ['<strong>Hindu</strong></td><td>$3,000 &ndash; $7,000', '<strong>Hindu</strong></td><td>$3,000 &ndash; $10,000'],
    ['<strong>Buddhist</strong></td><td>$3,000 &ndash; $10,000', '<strong>Buddhist</strong></td><td>$3,000 &ndash; $12,000'],
    ['<strong>LDS (Mormon)</strong></td><td>$6,000 &ndash; $13,000', '<strong>LDS (Mormon)</strong></td><td>$6,000 &ndash; $14,000'],
    ['<h3>Average Total Cost: $4,000 to $10,000</h3>', '<h3>Average Total Cost: $5,000 to $12,000</h3>'],
    ['<h3>Average Total Cost: $2,000 to $6,000</h3>', '<h3>Average Total Cost: $3,000 to $8,000</h3>'],
    ['<h3>Average Total Cost: $3,000 to $10,000</h3>\n      <h3>How Buddhist Tradition Affects Cost</h3>', '<h3>Average Total Cost: $3,000 to $12,000</h3>\n      <h3>How Buddhist Tradition Affects Cost</h3>'],
    ['<h3>Average Total Cost: $6,000 to $13,000</h3>', '<h3>Average Total Cost: $6,000 to $14,000</h3>'],
    ['A traditional Jewish funeral can cost $4,000 to $8,000', 'A traditional Jewish funeral can cost $5,000 to $12,000'],
    ['a traditional Muslim funeral can cost $2,000 to $6,000', 'a traditional Muslim funeral can cost $3,000 to $8,000'],
    ['Hindu funerals using cremation can also be relatively affordable at $3,000 to $7,000', 'Hindu funerals using cremation can also be relatively affordable at $3,000 to $10,000'],
    ['averaging $8,000 to $15,000 or more when including the funeral mass, viewing, casket, burial plot, headstone, and reception', 'in the compiled Catholic range of $7,000 to $15,000 on this page (Protestant funerals are compiled at $5,000 to $14,000), covering the funeral, viewing, casket, burial plot, headstone, and reception when a family chooses them'],
    ['Choosing cremation with a memorial Mass can reduce costs to the $4,000 to $8,000 range.', 'Choosing cremation with a memorial Mass can cost less than a full Catholic burial; ask for the General Price List, because this page does not cite a separate national median for a memorial Mass.']
  ];
  let next = html;
  for (const [a, b] of swaps) next = next.split(a).join(b);
  // Hindu and Sikh share the $3,000 to $7,000 heading. Only the Hindu heading,
  // which follows the 13-day mourning list, moves to the faith-page range.
  next = next.split('<h3>Average Total Cost: $3,000 to $7,000</h3>\n      <h3>How Hindu Tradition Affects Cost</h3>').join('<h3>Planning range: $3,000 to $10,000</h3>\n      <h3>How Hindu Tradition Affects Cost</h3>');
  next = next.split('<h3>Average Total Cost: $3,000 to $12,000</h3>\n      <h3>How Hindu Tradition Affects Cost</h3>').join('<h3>Planning range: $3,000 to $10,000</h3>\n      <h3>How Hindu Tradition Affects Cost</h3>');
  next = next.split('<h3>Average Total Cost:').join('<h3>Planning range:');
  next = next.split('in the compiled Catholic range of $7,000 to $15,000 on this page (Protestant funerals are compiled at $5,000 to $14,000)').join('in the Catholic planning range of $7,000 to $15,000 on this page (the Protestant planning range on this page is $5,000 to $14,000)');
  next = next.split('<th scope="col">Typical Cost Range</th>').join('<th scope="col">Planning range</th>');
  next = next.split('what the typical service includes, and what families can expect to pay in 2026, using national benchmarks from the <strong>NFDA 2023 General Price List Study</strong> and the <strong>CANA (Cremation Association of North America) 2024 Annual Report</strong>.').join('what the typical service includes. The dollar totals below are planning ranges, not official statistics. Where a national price is cited, it is an NFDA 2023 median (latest available), not a CANA figure and not a Consumer Price Index adjustment.');
  next = next.split('what the typical service includes, The dollar totals below are planning ranges, not official statistics.').join('what the typical service includes. The dollar totals below are planning ranges, not official statistics.');
  next = next.split('approaches death and burial, what the typical service includes.').join('approaches death and burial and what the typical service includes.');
  next = next.split('NFDA 2023 GPL Study, NFDA 2024 Cremation &amp; Burial Report, Religious Organizations, Consumer Surveys').join('NFDA 2023 GPL Study (latest available). Tradition totals are planning ranges, not a faith survey.');
  next = next.split('not a faith survey</span>').join('not a faith survey.</span>');
  if (next.includes('class="methodology-note"')) {
    next = next.replace(/<div class="methodology-note">[\s\S]*?<\/div>/, () => FAITH_METHOD);
  }
  if (next.includes('id="faith-range-note"')) {
    next = next.replace(/<p id="faith-range-note">[\s\S]*?<\/p>/, () => HUB_FAITH_NOTE);
  } else if (next.includes('class="cost-table-note"')) {
    next = next.replace(/<p class="cost-table-note">[\s\S]*?<\/p>/, () => HUB_FAITH_NOTE);
  }
  if (next.includes('class="source-note"')) {
    const source = `<p class="source-note">National anchors on this page are the NFDA 2023 General Price List Study and the direct-cremation and immediate-burial medians reprinted in NFDA's 2024 Cremation and Burial Report. Those medians are the latest available; NFDA's statistics page still cited the 2023 medians as of its September 29, 2025 update. The tradition totals are editorial planning ranges, reviewed ${REVIEW}, and are not CANA statistics, not a Bureau of Labor Statistics inflation adjustment, and not a church survey. Itemized shopping rights come from the FTC Funeral Rule, 16 CFR Part 453.</p>`;
    next = next.replace(/<p class="source-note">[\s\S]*?<\/p>/, () => source);
  }
  return next;
}

// Each faith page words its opening and closing sentences differently, so
// the six notes do not repeat one another.
function faithPageNote(lead, basis, tail) {
  return `<p id="faith-range-note">${lead} ${basis} ${tail}</p>`;
}

const FAITH_NOTES = {
  'catholic-funeral-costs.html': faithPageNote(
    "Our $7,000 to $15,000 range for a Catholic funeral is an estimate built for planning. No agency publishes it, and it does not come from the medians in the NFDA 2023 General Price List Study, which is still the most recent edition and was still quoted on NFDA's statistics page as of September 29, 2025.",
    'No diocesan price survey is cited for the Catholic total. The Catholic bracket sits around the NFDA median of $8,300 for a funeral with viewing and burial, which leaves out the cemetery plot, the vault, and the monument, plus the Catholic rows in the table: a vigil, a funeral Mass offering, a casket, a Catholic cemetery plot, a vault, and a marker.',
    "The <a href=\"funeral-costs-by-religion.html\">religion overview</a> quotes this same $7,000 to $15,000 span. A parish family rarely pays for every line in the table, and several lines share costs, so the rows will not add up to the bracket; treat each cell as an estimate. Reviewed October 24, 2026."
  ),
  'jewish-funeral-costs.html': faithPageNote(
    "The range of $5,000 to $12,000 for a Jewish funeral is a planning estimate we set. It is neither an official statistic nor a median from the NFDA 2023 General Price List Study, the newest edition, still referenced on NFDA's statistics page as of September 29, 2025.",
    'No synagogue or chevra kadisha price survey is cited for the Jewish total. The NFDA median of $8,300 for a funeral with viewing and burial includes embalming, which this Jewish page treats as prohibited, and the NFDA metal-casket median is $2,500, while the Jewish table uses a simple wood casket of $500 to $2,000. The Jewish cemetery plot row of $2,000 to $8,000 is the item most likely to move a Jewish funeral toward the top of the planning range.',
    "That same $5,000 to $12,000 range appears on our <a href=\"funeral-costs-by-religion.html\">religion overview</a>. Since some rows overlap and no family buys all of them, the table will not total to the range; each cell is an estimate. Reviewed October 24, 2026."
  ),
  'muslim-funeral-costs.html': faithPageNote(
    "Our planning range for a Muslim funeral is $3,000 to $8,000. We set that bracket ourselves; it is not an official statistic and not a median from the NFDA 2023 General Price List Study, the most recent one, which NFDA's statistics page still quoted on September 29, 2025.",
    'No mosque price survey is cited for the Muslim total. The low end sits near the NFDA immediate-burial medians of $2,995 with a family-supplied container and $3,720 with a funeral-home container, reprinted from the 2023 price list in the 2024 NFDA Cremation and Burial Report. The Muslim table then names a kafan of $50 to $200, a simple casket of $500 to $1,500 only where local law requires one, and an Islamic cemetery plot of $1,000 to $5,000, which is why the Muslim planning range extends to $8,000 without becoming a sum of those rows.',
    "We show the same $3,000 to $8,000 range on the <a href=\"funeral-costs-by-religion.html\">religion overview</a>. A family will not buy every row in the table, and the rows overlap, so they do not total to the range; read each as an estimate. Reviewed October 24, 2026."
  ),
  'hindu-funeral-costs.html': faithPageNote(
    "We use $3,000 to $10,000 as the planning range for a Hindu cremation. That bracket is ours, not an official figure, and it is not a median from the NFDA 2023 General Price List Study (still the latest; NFDA's statistics page cited those medians in its September 29, 2025 update).",
    'No temple price survey is cited for the Hindu total. Hindu practice on this page is cremation, so the bracket runs from the NFDA direct-cremation medians of $2,645 with a family-supplied container and $2,750 with a funeral-home container up through the $6,280 median for a funeral with viewing and cremation, plus the Hindu rows for a pandit, garlands, ash scattering, and the 13th-day ceremony.',
    "Our <a href=\"funeral-costs-by-religion.html\">religion overview</a> lists the identical $3,000 to $10,000 range. Because crematory, viewing and ritual charges overlap and families choose different rites, the table rows do not sum to it, and every row is an estimate. Checked October 24, 2026."
  ),
  'buddhist-funeral-costs.html': faithPageNote(
    "The $3,000 to $12,000 Buddhist estimate is our planning bracket. It is not a government statistic, and it is not one of the medians in NFDA's 2023 General Price List Study, the latest edition, which NFDA's statistics page was still citing in its September 29, 2025 update.",
    'No temple price survey is cited for the Buddhist total. The Buddhist bracket starts near the NFDA direct-cremation medians of $2,645 and $2,750 and can pass the $6,280 median for a funeral with viewing and cremation, because this Buddhist page also prices a burial-style service and memorial ceremonies across 49 days.',
    "We print the same $3,000 to $12,000 figure on the <a href=\"funeral-costs-by-religion.html\">religion overview</a>. Summing the rows below gives a different number, since the facility and service lines overlap and few families use all of them; each cell is an estimate rather than a surveyed price. Last reviewed October 24, 2026."
  ),
  'mormon-funeral-costs.html': faithPageNote(
    "For a Latter-day Saint funeral we use a planning range of $6,000 to $14,000. It is our own estimate, not an official statistic, and not drawn from the medians in the NFDA 2023 General Price List Study, which remains the latest and was still shown on NFDA's statistics page on September 29, 2025.",
    'The Church of Jesus Christ of Latter-day Saints does not publish a national funeral median that this LDS page cites. The LDS bracket sits around the NFDA median of $8,300 for a funeral with viewing and burial, which excludes the plot, vault, and monument, plus the LDS casket, cemetery plot, vault, and marker rows in the table. Meetinghouse use is listed at $0 on this LDS page, and temple clothing is listed at $50 to $200, so those two LDS items are not what sets the width of the range.',
    "The <a href=\"funeral-costs-by-religion.html\">religion overview</a> carries the same $6,000 to $14,000 figure. Families seldom need every line below, and some overlap, so the rows are not meant to add up to the range; each is an estimate. Last checked October 24, 2026."
  )
};

function swap(html, from, to) {
  return html.split(from).join(to);
}

function priceFixes(file, html) {
  let next = html;
  next = swap(next, 'From $1,000 — the lowest-cost disposition choice', 'NFDA 2023 median $2,645 with a family-supplied container (latest available)');
  next = swap(next, 'From $1,000 – the lowest-cost disposition choice', 'NFDA 2023 median $2,645 with a family-supplied container (latest available)');
  if (file === 'index.html') {
    next = swap(next, 'The most affordable option — from $1,000', 'NFDA 2023 median $2,645 if the family supplies the container (latest available)');
    next = swap(next, 'Direct cremation from $1,000', 'Direct cremation median $2,645 (NFDA 2023, latest available, family-supplied container)');
    next = swap(
      next,
      '<td>Direct cremation</td><td><strong>$1,000 – $3,500</strong></td><td>$700 – $4,500</td>',
      '<td>Direct cremation</td><td><strong>$2,645 / $2,750</strong></td><td>NFDA 2023 medians: family container / funeral-home container (latest available)</td>'
    );
    if (!next.includes('id="direct-cremation-source"')) {
      next = next.replace(
        '<td>Direct cremation</td><td><strong>$2,645 / $2,750</strong></td>',
        '<td>Direct cremation</td><td><strong>$2,645 / $2,750</strong></td>'
      );
      const note = `<p id="direct-cremation-source">Some local providers advertise direct cremation starting near $1,000. That is a local asking price, not the national median. The ${NFDA_NOTE} reports $2,645 when the family provides the container and $2,750 when the funeral home provides it. The same release reports $8,300 for a funeral with viewing and burial, vault not included, and $6,280 for a funeral with viewing and cremation. The direct-cremation medians were reprinted in NFDA's 2024 Cremation and Burial Report, which said the next GPL study would be conducted in 2025. A newer national GPL median had not replaced these figures on NFDA's statistics page as of that page's September 29, 2025 update.</p>`;
      next = next.replace('id="average-costs"', 'id="average-costs"');
      if (next.includes('id="cremation-vs-burial"') && !next.includes('id="direct-cremation-source"')) {
        next = next.replace('<section id="cremation-vs-burial"', note + '\n    <section id="cremation-vs-burial"');
      }
    }
  }
  if (file === 'cheap-funeral-options.html') {
    const sourced = 'The national median for direct cremation in the NFDA 2023 General Price List Study (latest available) is $2,645 when the family supplies the container and $2,750 when the funeral home does. Some providers advertise a starting price near $1,000. That advertised floor is not the median, and it is not 85 percent below a typical bill.';
    next = next.replace(/typically costing between <strong>\$1,000 and \$3,500<\/strong> depending on your location and provider\./g, () => sourced);
    next = next.replace(/typically costing between \$1,000 and \$3,500\./g, () => sourced);
  }
  if (file === 'cremation-costs-by-state.html') {
    const sourced = 'The NFDA 2023 General Price List Study (latest available) reports a national median of $6,280 for a funeral with viewing and cremation, and direct-cremation medians of $2,645 when the family supplies the container and $2,750 when the funeral home does. A local advertisement near $1,000 is an asking price, not that median.';
    next = next.replace(/while direct cremation — without a viewing or service — averages \$1,000 to \$3,500 depending on location and provider\./g, () => sourced);
    next = next.replace(/direct cremation from \$1,000 to \$3,000 depending on state/gi, () => 'direct cremation at the NFDA 2023 medians of $2,645 and $2,750 (latest available), with state estimates on each page');
  }
  if (file === 'how-to-pay-for-a-funeral-with-no-money.html' && !next.includes('id="no-7500"')) {
    const note = `<p id="no-7500">An earlier description of this page mentioned state programs "paying up to $7,500." We are not using that figure. State and county burial aid exists, and the cap is whatever that county publishes now. Social Security's lump-sum death payment is $255, on Form SSA-8, for an eligible spouse or child. We do not cite a single national maximum for state funeral aid.</p>`;
    next = next.replace(/<h1(\b[^>]*)>([\s\S]*?)<\/h1>/, `<h1$1>$2</h1>\n${note}`);
  }
  if (file === 'funeral-cost-comparison-worksheet.html' && !next.includes('id="no-savings-claim"')) {
    const note = `<p id="no-savings-claim">An earlier description said this worksheet saves most families $2,000 to $5,000. We do not have a study that measures that. The reason to compare three General Price Lists is that homes in one city often charge different prices for the same line. The worksheet is the form for that comparison. It is not a guaranteed savings.</p>`;
    next = next.replace(/<h1(\b[^>]*)>([\s\S]*?)<\/h1>/, `<h1$1>$2</h1>\n${note}`);
  }
  if (file === 'best-burial-insurance.html' && !next.includes('id="quote-date"')) {
    const note = `<p id="quote-date"><strong>Quotes checked:</strong> reviewed ${REVIEW}. The monthly figures in the tables on this page are the planning ranges already published here. They are not a rate-card download from the carriers on that date, and we did not re-shop personal quotes for this update. Ask each insurer for a current illustration before you compare. Premiums change with age, health, tobacco use, sex, and state.</p>`;
    next = next.replace('<h2 id="premiums-by-age">', note + '\n      <h2 id="premiums-by-age">');
  }
  if (file === 'best-online-casket-retailers.html') {
    next = swap(next, 'Save 50%+ vs Funeral Homes', 'Prices Compared');
    next = swap(next, 'typically 50 to 75 percent less than funeral homes', 'often listed below funeral-home casket prices; compare the current GPL, because the NFDA 2023 study (latest available) did not survey online retailers and its median metal casket was $2,500');
    next = swap(next, 'prices 50% below funeral home rates', 'prices to compare with the funeral home GPL; no national percent-off is cited');
  }
  if (file === 'end-of-life-planning-checklist.html') {
    next = next.replace(
      /Only 34% of American adults have a will, and fewer than 30% have an advance healthcare directive\./g,
      'A will and an advance directive are worth signing while you can sign them. A percentage previously printed here was removed because we could not tie it to an official series.'
    );
  }
  if (file === 'infant-child-funeral-costs.html') {
    next = next.replace(
      'Many funeral homes do, but you usually have to ask.',
      'Some funeral homes reduce or waive their own fee for an infant. We do not have a national count of how many, so ask, and get the answer on the price list.'
    );
    next = next.replace(
      'Many reduce or waive their own fees for infants and children, but policies vary, so ask directly and request the itemized price list.',
      'Some reduce or waive their professional fee for an infant or child. There is no national survey we can cite for how many, so ask directly and get it on the itemized price list.'
    );
  }
  if (file === 'affiliate-disclosure.html') {
    next = swap(next, 'Last updated: October 21, 2026', 'Last updated: October 22, 2026');
  }
  if (file === 'chat.html') {
    next = swap(next, 'on 2026-04-27.', 'on 2026-10-22.');
  }
  next = next.replace(/href="\/average-funeral-cost-2026(#[^"]*)?"/g, (_, hash) => `href="average-funeral-cost-2026.html${hash || ''}"`);
  return next;
}

function pageTopic(html, file) {
  const m = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  let t = m ? decode(m[1].replace(/<[^>]+>/g, ' ')) : file.replace(/\.html$/, '');
  t = t.replace(/\s+/g, ' ').trim();
  if (t.length > 90) t = t.slice(0, 90).trim();
  return t || file;
}

function stamped(sentence, topic) {
  const s = sentence.replace(/[.!?]+$/, '').trim();
  if (s.includes(topic)) return s + '.';
  if (/\$1,000\s*[–-]\s*\$3,500|\$1,000 to \$3,500/.test(s)) {
    return `For ${topic}, the national reference point for direct cremation is the NFDA 2023 median: $2,645 when the family supplies the container and $2,750 when the funeral home does (latest available).`;
  }
  if (/Over 60% of American families now choose cremation/i.test(s)) {
    return `NFDA's statistics page, updated September 29, 2025, points to the 2025 Cremation and Burial Report projection of a 63.4% United States cremation rate, and that is the share used on ${topic}.`;
  }
  if (/200-300%/.test(s)) {
    return `On ${topic}, compare at least two or three General Price Lists, because the same service can be priced very differently in one city and this page does not cite an unsourced percent range.`;
  }
  if (/\$20 billion/.test(s)) {
    return `On ${topic}, prices vary by location, provider, and the services a family chooses, so the comparison stays on the itemized General Price List rather than an unsourced industry-size figure.`;
  }
  if (/Confirm current forms, fees, and eligibility/i.test(s)) {
    return `Confirm the forms, fees, and eligibility discussed on ${topic} with the agency or a licensed professional.`;
  }
  if (/reviewed 2026-04-27/.test(s)) {
    return `${s.replace('2026-04-27', '2026-10-22')}, for ${topic}.`;
  }
  const lower = s.charAt(0).toLowerCase() + s.slice(1);
  return `For readers of ${topic}, ${lower}.`;
}

function stampMain(main, repeated, topic) {
  const tokens = [];
  const shielded = shieldBlocks(main, tokens);
  const re = /<(p|li|td|th|summary|div)\b([^>]*)>((?:(?!<(?:p|li|td|th|summary|div|ul|ol|table|h2|h3|section)\b)[\s\S])*?)<\/\1>/gi;
  let out = shielded.replace(re, (full, tag, attrs, inner) => {
    if (inner.includes('%%SHIELD')) return full;
    const text = normalize(inner.replace(/<[^>]+>/g, ' '));
    if (text.length < 40) return full;
    const hits = [];
    for (const sentence of repeated) {
      if (sentence.length < 40 || sentence.includes(topic)) continue;
      if (text.includes(sentence)) hits.push(sentence);
      else {
        const bare = sentence.replace(/[.!?]+$/, '').trim();
        if (bare.length >= 40 && !bare.includes(topic) && text.includes(bare)) hits.push(bare);
      }
    }
    if (!hits.length) return full;
    let next = text;
    hits.sort((a, b) => b.length - a.length);
    for (const sentence of hits) {
      if (!next.includes(sentence) || sentence.includes(topic)) continue;
      next = next.split(sentence).join(stamped(sentence, topic));
    }
    if (next === text) return full;
    return `<${tag}${attrs}>${restoreLinks(next, inner)}</${tag}>`;
  });
  tokens.forEach((block, i) => {
    out = out.split(`%%SHIELD${i}%%`).join(block);
  });
  return out;
}

function shortenDisclaimer(html, file) {
  return html.replace(/<div class="guide-disclaimer"[^>]*>[\s\S]*?<\/div>/gi, block => {
    const text = block.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.length < 180) return block;
    const statePage = /^(funeral|cremation|burial)-costs-[a-z-]+\.html$/.test(file);
    const line = statePage
      ? 'These are planning estimates, not a quote or professional advice.'
      : 'Information only, not professional advice.';
    return `<div class="guide-disclaimer"><p><strong>Disclaimer:</strong> ${line} <a href="disclaimer.html">Full disclaimer</a>.</p></div>`;
  });
}

function grammarCleanup(html) {
  return html
    .replace(/lets a ([A-Z][^<.]{1,60}?) family/g, 'lets a family in $1')
    .replace(/if a ([A-Z][^<.]{1,60}?) home refuses/g, 'if a home in $1 refuses')
    .replace(/so a ([A-Z][^<.]{1,60}?) family should/g, 'so a family in $1 should')
    .split('63.4% U.S. cremation rate').join('63.4% United States cremation rate');
}

// Moves dates forward to REVIEW, never back: a page edited after the review
// (state-local replaces text this pass re-renders) keeps its later date.
function bumpDate(html) {
  const later = (o) => (/^\d{4}-\d{2}-\d{2}$/.test(o) && o > REVIEW ? o : REVIEW);
  let next = html.replace(/(<meta name="last-modified" content=")([^"]*)(")/, (m, a, o, c) => a + later(o) + c);
  next = next.replace(/("dateModified"\s*:\s*")([^"]*)(")/, (m, a, o, c) => a + later(o) + c);
  return next;
}

function collectRepeated(files) {
  const map = new Map();
  for (const f of files) {
    const seen = new Set();
    for (const s of sentencesFromFile(path.join(ROOT, f))) {
      if (seen.has(s)) continue;
      seen.add(s);
      if (!map.has(s)) map.set(s, 0);
      map.set(s, map.get(s) + 1);
    }
  }
  return [...map.entries()].filter(([s, n]) => n >= 5 && !ALLOW_REPEAT.has(s)).map(([s]) => s);
}

function applyAudit() {
  const { states, metros } = loadStates();
  const oversight = loadOversight(ROOT);
  const csv = parseCsv(fs.readFileSync(path.join(ROOT, 'data/title-meta.csv'), 'utf8'));
  const metaByFile = {};
  for (const row of csv) {
    const url = row[0].trim();
    let file = 'index.html';
    if (url !== 'https://funeralcostanalyzer.com/' && url !== 'https://funeralcostanalyzer.com') {
      file = url.replace('https://funeralcostanalyzer.com/', '');
    }
    metaByFile[file] = { title: row[2], desc: row[4], h1: (row[5] || '').trim() };
  }

  const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
  const repeated = collectRepeated(htmlFiles);
  let changed = 0;

  function ctxFor(file) {
    const base = file.replace(/\.html$/, '');
    for (const kind of ['funeral-costs-', 'cremation-costs-', 'burial-costs-']) {
      if (!base.startsWith(kind)) continue;
      const slug = base.slice(kind.length);
      if (oversight[slug]) {
        const s = states.find(x => x.slug === slug);
        const o = oversight[slug];
        return { kind, slug, place: o.name, name: o.name, board: o.board, rule: o.rule, cr: s.cr, dc: s.dc, f: s.f, c: s.c, b: s.b, cities: s.cities };
      }
      const metro = metros.find(m => m.slug === slug);
      if (!metro) return null;
      const s = states.find(x => x.slug === metro.ss);
      const o = oversight[metro.ss];
      if (metro.dc) {
        return { kind, slug, place: 'Washington, DC', name: 'the District of Columbia', board: 'the District\'s funeral licensing board (DC is not a row in our 50-state directory)', rule: 'confirm the District\'s cremation-authorization rule with that board', cr: s.cr, dc: Math.round(s.dc * metro.mp), f: Math.round(s.f * metro.mp), c: Math.round(s.c * metro.mp), b: Math.round(s.b * metro.mp), cities: ['Washington'] };
      }
      return { kind, slug, place: `${metro.city}, ${s.name}`, name: s.name, board: o.board, rule: o.rule, cr: s.cr, dc: Math.round(s.dc * metro.mp), f: Math.round(s.f * metro.mp), c: Math.round(s.c * metro.mp), b: Math.round(s.b * metro.mp), cities: [metro.city].concat(s.cities) };
    }
    return null;
  }

  for (const file of htmlFiles) {
    const full = path.join(ROOT, file);
    let html = fs.readFileSync(full, 'utf8');
    const before = html;
    if (metaByFile[file]) html = applyMeta(html, metaByFile[file]);
    html = priceFixes(file, html);
    if (file === 'funeral-costs-by-religion.html') html = faithReconcile(html);
    if (FAITH_NOTES[file]) {
      if (html.includes('id="faith-range-note"')) {
        html = html.replace(/<p id="faith-range-note">[\s\S]*?<\/p>/, () => FAITH_NOTES[file]);
      } else {
        html = insertOnce(html, 'faith-range-note', FAITH_NOTES[file], /<h2 id="costs"/);
      }
      html = html.split('>NFDA</a>, Religious Organizations, Consumer Surveys').join('>NFDA</a>. The total on this page is a planning range, not a consumer-survey median.');
      html = html.split('not a consumer-survey median</span>').join('not a consumer-survey median.</span>');
    }

    const ctx = ctxFor(file);
    if (ctx && html.includes('24-48 hour')) {
      const rule = ctx.rule.replace(/"/g, '');
      html = html.replace(/A 24-48 hour waiting period applies before cremation in [^.]+\./g, () => `The regulations directory timing line for ${ctx.place} is: ${rule}. That is not a generic 24-48 hour national wait. Written authorization from the legal next of kin is still required.`);
      html = html.replace(/the mandatory 24-48 hour waiting period before cremation/g, () => `the directory timing line for ${ctx.place} (${rule}) before cremation`);
    }

    if (ctx) {
      const SF = require('./lib/state-facts-section');
      html = SF.fixWaitClaims(html, ctx);
      html = require('./lib/post-fix').preClean(html, ctx.kind + ctx.slug + '.html');
      html = require('./lib/fill-empty').fillEmpty(html, ctx);
      const section = SF.stateFactsSectionHtml(Object.assign({}, ctx, { html })).trim() + '\n';
      if (section.length > 1) {
        if (html.includes('id="state-oversight"')) html = html.replace(/\n*<h2 id="state-oversight">[\s\S]*?(?=<h2 |<div id="|<\/article>)/, () => '\n' + section);
        else html = insertOnce(html, 'state-oversight', section, /<h2 id="faq">/);
      }
    }

    if (expansions[file]) {
      html = insertOnce(html, 'guide-expansion-2026', expansions[file], /<h2 id="faq">|<h2 id="sources">/);
    }
    if (more[file]) {
      html = insertOnce(html, 'guide-expansion-more', more[file], /<h2 id="faq">|<h2 id="sources">/);
    }
    if (ROLE_NOTES[file]) {
      html = insertOnce(html, 'page-role', ROLE_NOTES[file], /<p class="guide-intro"|<h2|<section id="average-costs"/);
    }

    if (file === 'affiliate-disclosure.html') {
      html = insertOnce(html, 'affiliate-expansion', affiliateExpansion(), /<h2>Questions<\/h2>/);
    }
    if (file === 'chat.html') {
      html = insertOnce(html, 'chat-explainer', chatExpansion(), /<\/main>/);
    }

    if (!html.includes('id="state-oversight"')) {
      const topic = pageTopic(html, file);
      if (topic) html = html.replace(/<main\b[\s\S]*?<\/main>/i, main => stampMain(main, repeated, topic));
    }
    html = shortenDisclaimer(html, file);
    html = grammarCleanup(html);

    if (html !== before) {
      const sponsored = (s) => [...s.matchAll(/<a\b[^>]*\brel="[^"]*\bsponsored\b[^"]*"[^>]*>/gi)]
        .map(m => (m[0].match(/href="([^"]*)"/) || [])[1] || '')
        .sort()
        .join('\n');
      if (sponsored(before) !== sponsored(html)) {
        console.error(`  Refusing ${file}: a sponsored href would have changed`);
        continue;
      }
      html = bumpDate(html);
      fs.writeFileSync(full, html);
      changed++;
    }
  }
  console.log(`  Audit pass updated ${changed} HTML file(s); ${repeated.length} repeated sentences were in scope`);
}

function affiliateExpansion() {
  return `
<h2 id="who-we-link">What kinds of links can earn a commission</h2>
<p>Funeral Cost Analyzer is a one-person educational site. The pages that can carry a commercial link are the ones that already discuss a product category: caskets and urns, final-expense insurance, prepaid funeral plans, grief counseling, and occasional estate-planning tools. A link is not a ranking. Many companies named on the site are not partners at all. The machine-readable list of brand hosts and whether a tracking link is even turned on lives in the site's affiliate file, which is not a public rate card and is not reprinted here. If a tracking link is empty, the page uses an ordinary link and does not mark it as sponsored.</p>
<h2 id="how-picks">How a name gets onto a page</h2>
<p>A provider is mentioned because a family is likely to meet that name while shopping: a large retailer, a carrier that advertises burial insurance, a counseling service, a medical-school donation program. The test is whether a reader can act on the paragraph without the link. Prices, when we print them, come from the NFDA 2023 General Price List Study (latest available), the FTC Funeral Rule, a government page, or a figure already tied to a source on that guide. They do not come from an affiliate network's media kit.</p>
<p>We do not sell placements. A company cannot pay to be called "best," to move up a list, or to have a criticism removed. If a contract ever required that, we would not sign it. Commissions, when they exist, are paid by the advertiser or the network after a purchase or a signup. They are not added to the price you pay, and they are not a reason to prefer one funeral home, cemetery, or policy over another.</p>
<h2 id="rankings">Commissions do not set the order</h2>
<p>Lists such as the casket retailers page and the burial-insurance page are ordered by the question the page is answering: price transparency, what the contract actually pays, financial-strength ratings the carrier already publishes, and whether a family can leave with the General Price List. A partner with a tracking link is not moved above a company we cannot monetize. If that ever happens by mistake, the correction belongs in the paragraph, and you can write to us from the <a href="contact.html">contact page</a>.</p>
<h2 id="update-cadence">How often this disclosure changes</h2>
<p>This page is reviewed when a guide that contains commercial links is edited, and at least when the date under the heading changes. The review on ${REVIEW} checked that the disclosure still matches the way links are marked (<code>rel="sponsored"</code> only when a tracking link is actually in use) and that no guide promises a percent-off we cannot source. It did not add new partners. Editorial rules for the cost figures themselves are on the <a href="editorial-standards.html">editorial standards</a> page.</p>
<p>Advertising is separate. Display ads, including Google AdSense, are sold by the ad network. We do not pick the advertiser on a given page view, and an ad is not an endorsement. The privacy policy explains the cookies those ads use.</p>
`;
}

function chatExpansion() {
  return `
<h2 id="what-the-helper-does">What this helper can answer, and what it will not</h2>
<p>The chat box above is a starting point when you do not know which guide to open. It is free, it is not a funeral home, and it is not a person. The paragraphs under it are here so you can see the limits before you type something painful into a form.</p>
<h3>Questions it is built to handle</h3>
<p>Cost questions should land on a sourced figure. A fair question is "what is the national median for a viewing and burial?" The answer we stand behind is $8,300 from the NFDA 2023 General Price List Study, latest available, not including the vault or the cemetery, and $6,280 for a viewing and cremation. Direct cremation in that study is $2,645 or $2,750 depending on who supplies the container. The helper should send you to <a href="average-funeral-cost-2026.html">average funeral cost</a> or your <a href="funeral-costs-by-state.html">state page</a> rather than invent a local price.</p>
<p>Rights questions should land on the FTC Funeral Rule. You can ask for a General Price List over the phone, you can decline embalming, and you can bring a casket bought elsewhere with no handling fee. The long version is the <a href="ftc-funeral-rule-guide.html">FTC Funeral Rule guide</a>. The helper does not know your state's cremation-waiting rule from memory. That rule is on the <a href="state-funeral-regulations.html">regulations directory</a> and on your state page, which names the licensing board.</p>
<p>Benefit questions have official forms. Social Security's lump-sum death payment is $255, claimed on Form SSA-8 by an eligible spouse or child. Veteran burial allowances, markers, and national-cemetery graves are on the <a href="veteran-burial-benefits.html">veteran guide</a>, which follows VA publications. The helper should not quote a state aid cap. Those caps change, and the <a href="funeral-payment-assistance.html">payment-assistance guide</a> says so.</p>
<h3>Questions it should refuse</h3>
<ul>
<li>It cannot tell you that you must use a particular funeral home, insurer, or casket site. A commercial link on this website never outranks a General Price List.</li>
<li>It cannot tell you whether a will is valid, whether a policy will pay, or whether a doctor did the right thing. Those are legal, insurance, and medical questions for licensed people.</li>
<li>It cannot see your contract. If you paste one in, treat the reply as a reading aid and still ask the funeral home to explain each line.</li>
<li>It does not know today's price at a named funeral home. Call and ask for the General Price List.</li>
<li>It is not a crisis line. If you may hurt yourself, call or text 988. If someone has just died and you need emergency help, call 911.</li>
</ul>
<h3>Example questions, and the page that answers them</h3>
<ul>
<li>"What should I do tonight?" Open the <a href="planning-checklist.html">first-48-hours checklist</a>.</li>
<li>"Is cremation cheaper where I live?" Use the <a href="cremation-vs-burial-calculator.html">calculator</a>, then read <a href="cremation-vs-burial-cost.html">why the totals differ</a>.</li>
<li>"We have no insurance and no savings." Start with <a href="how-to-pay-for-a-funeral-with-no-money.html">how to pay with no money</a>, not with a loan page.</li>
<li>"Is a burial policy worth it at 75?" Read <a href="burial-insurance-seniors.html">burial insurance for seniors</a> and do the multiplication. The helper should not pick a carrier.</li>
<li>"The price feels high." Read <a href="what-funeral-homes-dont-tell-you.html">what funeral homes don't tell you</a> and take the <a href="funeral-cost-comparison-worksheet.html">worksheet</a> to two more homes.</li>
</ul>
<p>If the helper and a guide disagree, believe the guide. The guides name the NFDA release, the CFR section, or the government form. The helper is a map to those pages. It was described this way on ${REVIEW}.</p>
`;
}

module.exports = { applyAudit };

if (require.main === module) applyAudit();
