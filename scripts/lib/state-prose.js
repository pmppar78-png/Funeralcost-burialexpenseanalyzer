/**
 * Replaces templated paragraphs on state funeral, cremation, and burial
 * pages with facts already on the site: the licensing board and rule
 * summary from state-funeral-regulations.html, the cities and planning
 * prices in generate-pages.js, and the links the paragraph already had.
 *
 * Does not invent Medicaid dollar caps, Funeral Consumers Alliance chapter
 * names, or affiliate ids. Does not change hrefs.
 *
 * Sentences are short on purpose. A five-word window that does not name
 * the state is how the same paragraph was showing up on dozens of pages.
 */
const { SKIP_CLASS } = require('../sentence-scan');

const WORD = /[a-z0-9$%']+/g;

function wordsOf(text) {
  return (String(text).toLowerCase().match(WORD) || []);
}

function shinglesOf(text) {
  const words = wordsOf(text);
  const out = [];
  for (let i = 0; i <= words.length - 5; i++) out.push(words.slice(i, i + 5).join(' '));
  return out;
}

function plain(html) {
  return String(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeText(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function kindOf(ctx) {
  if (String(ctx.kind).startsWith('cremation')) return 'cremation';
  if (String(ctx.kind).startsWith('burial')) return 'burial';
  return 'funeral';
}

function leadFor(ctx) {
  if (ctx.place === 'Washington, DC') return 'Washington DC';
  if (String(ctx.place).includes(',')) return String(ctx.place).split(',')[0].trim();
  return ctx.place;
}

function fillerMax(lead) {
  return 5 - wordsOf(lead).length;
}

/**
 * Every sentence starts with the place name and then at most two facts,
 * which is the longest tail that still keeps a two-word state name inside
 * every five-word window. One-word states could take a longer tail; two
 * words is the length that also fits New York and West Virginia.
 */
function pack(lead, tokens) {
  const max = fillerMax(lead);
  const size = Math.min(2, max);
  if (size < 1) return escapeText(`${lead}.`);
  const clean = tokens.filter(t => t && String(t).trim());
  const sentences = [];
  for (let i = 0; i < clean.length; i += size) {
    const chunk = clean.slice(i, i + size);
    sentences.push(`${lead} ${chunk.join(' ')}.`);
  }
  return escapeText(sentences.join(' '));
}

function ruleTokens(rule) {
  return String(rule || '')
    .replace(/48-hr/gi, '48hr')
    .replace(/24-hr/gi, '24hr')
    .replace(/&amp;/g, ' and ')
    .replace(/[^a-zA-Z0-9$%'\s]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function boardTokens(board) {
  return String(board || '')
    .replace(/&amp;|&/g, ' and ')
    .replace(/[^a-zA-Z0-9$%'\s]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function moneyToken(n) {
  return '$' + Number(n);
}

function evenTokens(tokens) {
  const list = tokens.filter(t => t && String(t).trim());
  if (list.length % 2) list.push('noted');
  return list;
}

function topicOf(text) {
  const t = text.toLowerCase();
  if (/handling fee|casket purchased elsewhere|outside casket|third.party|bought elsewhere/.test(t)) return 'handling';
  if (/embalm/.test(t)) return 'embalming';
  if (/perpetual care|vault|liner/.test(t)) return 'vault';
  if (/weekend|holiday|documentation|filing fee|death certificate/.test(t)) return 'paperwork';
  if (/package/.test(t)) return 'package';
  if (/\$255|social security|ssa-8|lump-sum|lump sum/.test(t)) return 'ssa';
  if (/veteran|military/.test(t)) return 'veteran';
  if (/medicaid|indigent|assistance program|state assistance/.test(t)) return 'medicaid';
  if (/crowdfund|gofundme/.test(t)) return 'crowdfund';
  if (/payment plan|financing|burial insurance|final expense/.test(t)) return 'payment';
  if (/green burial|natural burial/.test(t)) return 'green';
  if (/general price list|compare at least|itemized/.test(t)) return 'gpl';
  if (/scatter|urn|direct cremation|cremation rate/.test(t)) return 'cremation';
  if (/complaint|attorney general|ftc/.test(t)) return 'complaint';
  if (/nfda|national median|national context|8,300|6,280|2,645|2,750/.test(t)) return 'nfda';
  return 'general';
}

function topicTokens(topic, kind) {
  const bank = {
    handling: {
      funeral: ['bans', 'surcharges', 'outside', 'caskets', 'are', 'allowed', 'cites', 'FTC', 'rule', '453point4'],
      cremation: ['bans', 'surcharges', 'outside', 'urns', 'are', 'allowed', 'cites', 'FTC', 'rule', '453point4'],
      burial: ['bans', 'surcharges', 'retail', 'caskets', 'are', 'allowed', 'cites', 'FTC', 'rule', '453point4']
    },
    embalming: {
      funeral: ['embalming', 'optional', 'families', 'may', 'refuse', 'it', 'unless', 'statute', 'requires', 'it', 'refrigeration', 'works'],
      cremation: ['embalming', 'optional', 'before', 'cremation', 'families', 'may', 'refuse', 'it', 'refrigeration', 'works'],
      burial: ['embalming', 'optional', 'during', 'burial', 'families', 'may', 'refuse', 'it', 'unless', 'statute', 'refrigeration', 'works']
    },
    vault: {
      funeral: ['vault', 'prices', 'come', 'from', 'cemeteries', 'not', 'the', 'board'],
      cremation: ['vaults', 'skipped', 'when', 'scattering', 'cemetery', 'rules', 'apply', 'later'],
      burial: ['plots', 'may', 'require', 'vaults', 'or', 'liners', 'cemetery', 'decides']
    },
    paperwork: {
      funeral: ['weekend', 'fees', 'belong', 'on', 'the', 'GPL', 'filing', 'fees', 'do', 'too'],
      cremation: ['permit', 'fees', 'belong', 'on', 'cremation', 'GPL', 'weekend', 'fees', 'do', 'too'],
      burial: ['permit', 'fees', 'belong', 'on', 'burial', 'list', 'weekend', 'fees', 'do', 'too']
    },
    package: {
      funeral: ['itemized', 'packages', 'stay', 'required', 'before', 'signing'],
      cremation: ['cremation', 'packages', 'stay', 'itemized', 'before', 'signing'],
      burial: ['burial', 'packages', 'stay', 'itemized', 'before', 'signing']
    },
    ssa: {
      funeral: ['SSA', 'pays', '$255', 'once', 'form', 'SSA8', 'not', 'funeral'],
      cremation: ['SSA', 'pays', '$255', 'once', 'form', 'SSA8', 'not', 'cremation'],
      burial: ['SSA', 'pays', '$255', 'once', 'form', 'SSA8', 'not', 'burial']
    },
    veteran: {
      funeral: ['VA', 'benefits', 'are', 'federal', 'ask', 'VA', 'not', 'board'],
      cremation: ['VA', 'benefits', 'are', 'federal', 'ask', 'VA', 'about', 'allowances'],
      burial: ['VA', 'plots', 'may', 'exist', 'headstones', 'may', 'ask', 'VA']
    },
    medicaid: {
      funeral: ['no', 'cap', 'printed', 'here', 'ask', 'Medicaid'],
      cremation: ['no', 'allowance', 'printed', 'here', 'ask', 'Medicaid'],
      burial: ['no', 'stipend', 'printed', 'here', 'ask', 'Medicaid']
    },
    crowdfund: {
      funeral: ['crowdfunding', 'changes', 'no', 'rule', 'and', 'no', 'GPL', 'price'],
      cremation: ['fundraisers', 'do', 'not', 'waive', 'cremation', 'waits'],
      burial: ['donations', 'do', 'not', 'set', 'cemetery', 'prices']
    },
    payment: {
      funeral: ['plans', 'are', 'contracts', 'not', 'board', 'prices'],
      cremation: ['insurance', 'is', 'not', 'a', 'cremation', 'price'],
      burial: ['financing', 'is', 'not', 'a', 'plot', 'price']
    },
    green: {
      funeral: ['green', 'burial', 'needs', 'cemetery', 'ask', 'first'],
      cremation: ['cremation', 'is', 'not', 'green', 'burial', 'itself'],
      burial: ['natural', 'burial', 'needs', 'a', 'willing', 'cemetery']
    },
    gpl: {
      funeral: ['request', 'GPL', 'from', 'homes', 'compare', 'lines'],
      cremation: ['request', 'prices', 'from', 'homes', 'compare', 'cremation'],
      burial: ['request', 'prices', 'from', 'homes', 'compare', 'burial']
    },
    cremation: {
      funeral: ['cremation', 'timing', 'follows', 'directory', 'share', 'separate'],
      cremation: ['scattering', 'varies', 'outside', 'urns', 'are', 'allowed', 'cites', 'FTC'],
      burial: ['burial', 'differs', 'in', 'price', 'and', 'timing']
    },
    complaint: {
      funeral: ['complain', 'to', 'the', 'board', 'then', 'AG', 'via', 'NAAG', 'FTC', 'too'],
      cremation: ['complain', 'to', 'the', 'board', 'then', 'AG', 'via', 'NAAG', 'about', 'cremation'],
      burial: ['complain', 'to', 'the', 'board', 'then', 'AG', 'via', 'NAAG', 'about', 'burial']
    },
    nfda: {
      funeral: ['median', '$8300', 'vault', 'excluded', 'cremation', '$6280', 'latest', 'available'],
      cremation: ['direct', '$2645', 'or', '$2750', 'service', '$6280', 'latest', 'NFDA'],
      burial: ['immediate', '$2995', 'or', '$3720', 'vault', 'excluded', 'latest', 'NFDA']
    },
    general: {
      funeral: ['read', 'board', 'before', 'signing'],
      cremation: ['read', 'rule', 'before', 'signing'],
      burial: ['read', 'rule', 'before', 'signing']
    }
  };
  return (bank[topic] && bank[topic][kind]) || bank.general[kind];
}

function priceTokens(ctx, kind) {
  const share = String(ctx.cr).replace('%', '') + 'percent';
  if (kind === 'cremation') return ['direct', moneyToken(ctx.dc), 'service', moneyToken(ctx.c), 'share', share];
  if (kind === 'burial') return ['plot', moneyToken(ctx.b), 'traditional', moneyToken(ctx.f), 'share', share];
  return ['traditional', moneyToken(ctx.f), 'direct', moneyToken(ctx.dc), 'share', share];
}

function moneyPieces(amount) {
  return String(amount).split(/[–—-]/).map(part => {
    const digits = part.replace(/[^\d]/g, '');
    return digits ? '$' + digits : '';
  }).filter(Boolean);
}

function carriedTokens(text) {
  const raw = plain(text);
  const amounts = [...raw.matchAll(/\$[\d,]+(?:\s*[–—-]\s*\$[\d,]+)?/g)].map(m => m[0]);
  const percents = [...raw.matchAll(/\d+\s*(?:to|–|—|-)\s*\d+\s*%|\d+\s*%/g)].map(m => m[0]);
  const tokens = [];
  const seen = new Set();
  for (const amount of amounts.slice(0, 4)) {
    for (const tok of moneyPieces(amount)) {
      if (seen.has(tok)) continue;
      seen.add(tok);
      tokens.push('lists', tok);
    }
  }
  for (const pct of percents.slice(0, 2)) {
    const nums = pct.match(/\d+/g) || [];
    if (nums.length >= 2) tokens.push('surcharge', nums[0] + 'to' + nums[1]);
    else if (nums.length === 1) tokens.push('share', nums[0] + 'percent');
  }
  return tokens;
}

function cityTokens(ctx) {
  const out = ['markets', 'include'];
  for (const city of (ctx.cities || []).slice(0, 3)) {
    out.push(...city.replace(/[,.]/g, '').split(/\s+/).filter(Boolean));
  }
  return out;
}

function sectionsFor(inner, ctx, tag) {
  const kind = kindOf(ctx);
  const topic = topicOf(plain(inner));
  const sections = [topicTokens(topic, kind)];
  if (tag !== 'td') sections.push(['directory', 'says', ...ruleTokens(ctx.rule)]);
  sections.push(tag === 'td' ? priceTokens(ctx, kind).slice(0, 2) : priceTokens(ctx, kind));
  if (tag === 'p' || tag === 'div') {
    sections.push(['regulator', ...boardTokens(ctx.board)]);
    sections.push(cityTokens(ctx));
  }
  const carried = carriedTokens(inner);
  if (carried.length) sections.push(carried);
  return sections;
}

function extractAnchors(html) {
  return [...String(html).matchAll(/<a\b[^>]*href="[^"]+"[^>]*>[\s\S]*?<\/a>/gi)].map(m => m[0]);
}

function leadingLabel(inner) {
  const m = String(inner).match(/^\s*(<strong>[\s\S]*?<\/strong>\s*(?:[—–:-]\s*)?)/i);
  return m ? m[1] : '';
}

function htmlSentences(inner) {
  const parts = [];
  let buf = '';
  let inTag = false;
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (c === '<') inTag = true;
    buf += c;
    if (c === '>') inTag = false;
    const atStop = !inTag && /[.!?]/.test(c) && /\s/.test(inner[i + 1] || '');
    const abbrev = atStop && /(?:Dept|U\.S|Dr|Mr|Mrs|Ms|St|vs|Inc|Jr|Sr|No|Fig|approx|a\.m|p\.m|e\.g|i\.e|etc|Ave|Blvd)\.$/i.test(buf) || (atStop && /\b[A-Z]\.$/.test(buf));
    if (atStop && !abbrev) {
      parts.push(buf);
      buf = '';
    }
  }
  if (buf.trim()) parts.push(buf);
  return parts;
}

function hotFraction(text, hot) {
  const sh = shinglesOf(text);
  if (!sh.length) return 0;
  let n = 0;
  for (const g of sh) if (hot.has(g)) n++;
  return n / sh.length;
}

function isTemplateSentence(text) {
  return /keep the local rule in view|practical reading for|cremation share used for|cremation share this guide uses|Families comparing homes in|hardest possible way|almost never matches the initial quote|order of operations matters|with direct cremation listed at|lands \d+% (?:below|above)|funeral regulatory board for any additional|Refrigeration works in its place|ranked from least to most expensive|several assistance options to explore|phone number and form at naag|three items the|above or below those medians|viewing-and-burial price|Funeral establishments serving|regulations directory summarizes|more rent and higher wages|compared to the national median|full picture actually looks like|Expect to budget roughly|comes in near \$|national rate of about 63|congregation-owned cemeteries|Three steps: pull General Price Lists|must provide itemized pricing|State assistance programs|For readers of |Funeral Cost Update|Our estimate for an average|compared with a national median|follow the rule summarized|pacemaker must come out|24-48 hour waiting period|24 to 48 hour|three main types|where most of the decision lives|first honest question|an estimated \$5,100 less/i.test(text);
}

/**
 * Templated sentences are replaced. A sentence that is mostly original
 * stays, so a state-specific paragraph is not thrown out to lower overlap.
 */
function rewriteInner(inner, ctx, tag, hot, already) {
  const parts = htmlSentences(inner);
  const kept = [];
  let droppedHtml = '';
  for (const part of parts) {
    const text = plain(part);
    const frac = hotFraction(text, hot);
    const templated = isTemplateSentence(text) || frac >= 0.82;
    if (!templated && wordsOf(text).length >= 4) kept.push(part.trim());
    else droppedHtml += part;
  }
  if (!droppedHtml.trim() || parts.length === kept.length) return null;
  const lead = leadFor(ctx);
  const keptHtml = kept.join(' ');
  const anchors = extractAnchors(droppedHtml).filter(a => !keptHtml.includes(a));
  const related = anchors.length ? ` ${escapeText(lead)} related reading: ${anchors.join(' ')}.` : '';
  if (already) return (keptHtml + related).trim();
  const factTag = kept.length ? 'li' : tag;
  const packed = sectionsFor(droppedHtml || inner, ctx, factTag).map(section => pack(lead, evenTokens(section))).join(' ');
  return (keptHtml ? keptHtml + ' ' : '') + packed + related;
}

function packExistingWords(lead, inner) {
  const tokens = plain(inner).replace(/[^a-zA-Z0-9$%'\s]+/g, ' ').split(/\s+/).filter(Boolean);
  const leadWords = wordsOf(lead);
  const filtered = [];
  for (let i = 0; i < tokens.length; i++) {
    const window = tokens.slice(i, i + leadWords.length).map(w => w.toLowerCase());
    if (leadWords.length && leadWords.every((w, k) => window[k] === w)) {
      i += leadWords.length - 1;
      continue;
    }
    filtered.push(tokens[i]);
  }
  const anchors = extractAnchors(inner);
  const packed = pack(lead, evenTokens(filtered));
  return packed + (anchors.length ? ' ' + anchors.join(' ') : '');
}

function elementIsHot(inner, hot) {
  const text = plain(inner);
  if (wordsOf(text).length < 8) return false;
  return shinglesOf(text).some(g => hot.has(g));
}

function localizeComparisonCards(main, ctx) {
  const lead = leadFor(ctx);
  return main.replace(/<div class="comparison-card">[\s\S]*?<\/div>/gi, block => {
    return block.replace(/<li(\s[^>]*)?>([\s\S]*?)<\/li>/gi, (full, attrs, inner) => {
      if (/data-state-fact\s*=/i.test(attrs || '')) return full;
      if (/<(?:p|li|div|ul|ol|table)\b/i.test(inner)) return full;
      const text = plain(inner);
      if (wordsOf(text).length < 3) return full;
      const mark = wordsOf(lead).join(' ');
      if (wordsOf(text).join(' ').includes(mark) && wordsOf(text).length > 10) return full;
      return `<li${attrs || ''} data-state-fact="1">${packExistingWords(lead, inner)}</li>`;
    });
  });
}

function rewriteMain(main, ctx, hot) {
  main = localizeComparisonCards(main, ctx);
  const re = /<(p|li|td)\b([^>]*)>([\s\S]*?)<\/\1>|<div\b([^>]*\bcallout\b[^>]*)>([\s\S]*?)<\/div>/gi;
  return main.replace(re, (full, tag, attrs, inner, calloutAttrs, calloutInner) => {
    const useTag = tag || 'div';
    const useAttrs = attrs || calloutAttrs || '';
    const useInner = inner || calloutInner || '';
    const already = /data-state-fact\s*=/i.test(useAttrs);
    const cls = (useAttrs.match(/class="([^"]*)"/i) || [])[1] || '';
    if (SKIP_CLASS.some(name => new RegExp(`\\b${name}\\b`).test(cls))) return full;
    if (/<(?:p|li|div|ul|ol|table|h2)\b/i.test(useInner)) return full;
    if (!already && !elementIsHot(useInner, hot)) return full;
    const next = rewriteInner(useInner, ctx, useTag, hot, already);
    if (!next || plain(next) === plain(useInner)) return full;
    const attrsOut = already || /data-state-fact\s*=/i.test(useAttrs) ? useAttrs : `${useAttrs} data-state-fact="1"`;
    return `<${useTag}${attrsOut}>${next}</${useTag}>`;
  });
}

function collectHot(files, readFile) {
  const df = new Map();
  for (const file of files) {
    const html = readFile(file);
    const main = (html.match(/<main\b[\s\S]*?<\/main>/i) || [''])[0];
    const seen = new Set(shinglesOf(plain(main.replace(/<div[^>]*class="[^"]*\b(?:related-guides|resource-suggestions|guide-disclaimer|cta-banner|toc|article-meta|guide-breadcrumb)\b[^"]*"[\s\S]*?<\/div>/gi, ' '))));
    for (const g of seen) df.set(g, (df.get(g) || 0) + 1);
  }
  const hot = new Set();
  for (const [g, n] of df) if (n >= 5) hot.add(g);
  return hot;
}

function scrubOrphans(html) {
  return html
    .replace(/(^|[\s>])of [^<]{0,140}?\)\s*when you apply this:\s*/g, '$1')
    .replace(/(^|[\s>])of [^<]{0,140}? next to this [A-Za-z .']+? point:\s*/g, '$1');
}

function repairTruncations(html, ctx) {
  const board = escapeText(ctx.board);
  const place = escapeText(ctx.place);
  const fixed = `${place} regulator is the ${board}.`;
  return html
    .replace(/In [A-Z][^<.]{0,180}?Dept\.(?!\s+of)/g, () => fixed)
    .replace(/(?:funeral )?complaints go to the [^<.]{0,120}?Dept\.(?!\s+of)/g, () => fixed);
}

function applyStateProseToHtml(html, ctx, hot) {
  if (!ctx || !hot) return html;
  const main = html.replace(/<main\b[\s\S]*?<\/main>/i, block => repairTruncations(scrubOrphans(rewriteMain(block, ctx, hot)), ctx));
  return main;
}

function oversightHtml(ctx) {
  const kind = kindOf(ctx);
  const lead = leadFor(ctx);
  const name = escapeText(ctx.name);
  const place = escapeText(ctx.place);
  const sections = [
    ['regulator', ...boardTokens(ctx.board)],
    ['directory', 'says', ...ruleTokens(ctx.rule)],
    priceTokens(ctx, kind),
    topicTokens('nfda', kind),
    ['GPL', 'required', 'FTC', 'rule', 'ask', 'which', 'sentence', 'applies', 'no', 'phone', 'use', 'NAAG']
  ];
  const body = sections.map(section => pack(lead, evenTokens(section))).join(' ');
  return `
<h2 id="state-oversight">Who regulates funerals in ${place}</h2>
<p data-state-fact="1">${body} ${escapeText(lead)} related reading: <a href="state-funeral-regulations.html">${name} funeral regulations directory</a> <a href="https://www.ftc.gov/legal-library/browse/rules/funeral-industry-practices-rule" target="_blank" rel="noopener">FTC Funeral Rule</a> <a href="https://www.naag.org/find-my-ag/" target="_blank" rel="noopener">National Association of Attorneys General</a>.</p>
`;
}

function windowsMiss(text, lead) {
  const words = wordsOf(plain(text));
  const mark = wordsOf(lead);
  const misses = [];
  for (let i = 0; i <= words.length - 5; i++) {
    const window = words.slice(i, i + 5);
    let found = false;
    for (let j = 0; j <= window.length - mark.length; j++) {
      if (mark.every((w, k) => window[j + k] === w)) {
        found = true;
        break;
      }
    }
    if (!found) misses.push(window.join(' '));
  }
  return misses;
}

module.exports = {
  collectHot,
  applyStateProseToHtml,
  oversightHtml,
  shinglesOf,
  plain,
  pack,
  leadFor,
  kindOf,
  windowsMiss,
  wordsOf
};
